<?php

namespace App\Services;

use App\Enums\ActivityAction;
use App\Enums\CertificateStatus;
use App\Models\Certificate;
use App\Services\Blockchain\BlockchainService;
use App\Services\Merkle\MerkleTreeService;

/**
 * Public certificate verification. Runs all integrity checks and returns a
 * single structured result. Never exposes sensitive internal data.
 */
class VerificationService
{
    public function __construct(
        private HashService $hash,
        private StorageService $storage,
        private MerkleTreeService $merkle,
        private BlockchainService $blockchain,
        private ActivityLogService $activityLog,
    ) {}

    public function verifyByToken(string $token): array
    {
        $certificate = Certificate::with(['organization', 'template', 'templateVersion', 'blockchainRecord.merkleAnchor'])
            ->where('verification_token', $token)
            ->first();

        if (! $certificate) {
            return $this->result(false, 'not_found', [], 'Certificate could not be found.');
        }

        return $this->verify($certificate);
    }

    public function verifyByNumber(string $number): array
    {
        $certificate = Certificate::with(['organization', 'template', 'templateVersion', 'blockchainRecord.merkleAnchor'])
            ->where('certificate_number', $number)
            ->first();

        if (! $certificate) {
            return $this->result(false, 'not_found', [], 'Certificate could not be found.');
        }

        return $this->verify($certificate);
    }

    private function verify(Certificate $certificate): array
    {
        $checks = [];

        // 1. Business status
        $statusValid = $certificate->status !== CertificateStatus::Revoked;
        $checks['status'] = $statusValid
            ? ['valid' => true, 'message' => 'Certificate status is valid.']
            : ['valid' => false, 'message' => 'Certificate has been revoked.'];

        // 2. PDF integrity (recompute SHA-256 over stored bytes)
        $pdfIntegrity = false;
        $pdfMessage = 'Certificate document could not be located.';
        $pdfContent = $this->storage->get($certificate->pdf_path ?? '');
        if ($certificate->pdf_hash && $pdfContent !== null) {
            $currentHash = $this->hash->hashBinary($pdfContent);
            $pdfIntegrity = hash_equals(strtolower($certificate->pdf_hash), strtolower($currentHash));
            $pdfMessage = $pdfIntegrity
                ? 'Document integrity verified (SHA-256 match).'
                : 'Document has been modified (SHA-256 mismatch).';
        }
        $checks['document_integrity'] = ['valid' => $pdfIntegrity, 'message' => $pdfMessage];

        // 3. Merkle proof
        $merkleValid = false;
        $merkleMessage = 'No Merkle anchor found for this certificate.';
        $blockchainRecord = $certificate->blockchainRecord;
        $anchor = $blockchainRecord?->merkleAnchor;
        if ($anchor && $blockchainRecord) {
            $merkleValid = $this->merkle->verify(
                $anchor->merkle_root,
                $certificate->pdf_hash,
                $blockchainRecord->proof ?? [],
            );
            $merkleMessage = $merkleValid
                ? 'Merkle proof is valid.'
                : 'Merkle proof could not be verified.';
        }
        $checks['merkle_proof'] = ['valid' => $merkleValid, 'message' => $merkleMessage];

        // 4. Blockchain anchor
        $blockchainValid = false;
        $blockchainMessage = 'Certificate is not anchored on the blockchain.';
        if ($anchor && $anchor->transaction_hash && $anchor->status->value === 'confirmed') {
            $blockchainValid = $this->merkle->verify($anchor->merkle_root, $certificate->pdf_hash, $blockchainRecord->proof ?? [])
                && $anchor->status->value === 'confirmed';
            $blockchainMessage = $blockchainValid
                ? 'Blockchain anchor confirmed (transaction '.$anchor->transaction_hash.').'
                : 'Blockchain anchor not confirmed.';
        }
        $checks['blockchain_anchor'] = ['valid' => $blockchainValid, 'message' => $blockchainMessage];

        $overall = $statusValid && $pdfIntegrity && $merkleValid && $blockchainValid;

        $this->activityLog->log(ActivityAction::CertificateVerified, $certificate->organization_id, subject: $certificate, metadata: [
            'valid' => $overall,
            'checks' => array_map(fn ($c) => $c['valid'], $checks),
        ]);

        return $this->result($overall, 'verified', $checks, 'Certificate verified successfully.', $this->publicData($certificate));
    }

    private function publicData(Certificate $certificate): array
    {
        return [
            'certificate_number' => $certificate->certificate_number,
            'recipient' => $certificate->recipient_data,
            'organization' => $certificate->organization ? [
                'name' => $certificate->organization->name,
            ] : null,
            'issued_at' => $certificate->issued_at?->toIso8601String(),
            'template_name' => $certificate->template?->name,
            'status' => $certificate->status->value,
            'transaction_hash' => $certificate->blockchainRecord?->merkleAnchor?->transaction_hash,
            'merkle_root' => $certificate->blockchainRecord?->merkle_root,
        ];
    }

    private function result(bool $valid, string $code, array $checks, string $message, ?array $data = null): array
    {
        return [
            'valid' => $valid,
            'code' => $code,
            'message' => $message,
            'checks' => $checks,
            'data' => $data,
        ];
    }
}
