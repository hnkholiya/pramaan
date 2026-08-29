<?php

namespace App\Services;

use App\Enums\ActivityAction;
use App\Enums\BatchRecordStatus;
use App\Enums\BatchStatus;
use App\Enums\CertificateStatus;
use App\Models\BatchRecord;
use App\Models\Certificate;
use App\Models\CertificateBatch;
use App\Models\CertificateBlockchainRecord;
use App\Models\MerkleAnchor;
use App\Services\Blockchain\BlockchainService;
use App\Services\Merkle\MerkleTreeService;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Throwable;

class CertificateService
{
    public function __construct(
        private CertificateNumberService $certNumber,
        private VerificationTokenService $token,
        private PdfService $pdf,
        private HashService $hash,
        private StorageService $storage,
        private MerkleTreeService $merkle,
        private BlockchainService $blockchain,
        private ActivityLogService $activityLog,
    ) {}

    /**
     * Generate one certificate (PDF + store + hash) for a valid record.
     * Idempotent: skips if a certificate already exists for the record.
     */
    public function generateCertificateForRecord(BatchRecord $record): ?Certificate
    {
        if ($record->status !== BatchRecordStatus::Valid) {
            return null;
        }

        $batch = $record->batch;
        $existing = Certificate::where('batch_record_id', $record->id)->first();
        if ($existing) {
            return $existing; // idempotent
        }

        $version = $batch->templateVersion;
        if (! $version) {
            throw new RuntimeException('Batch has no assigned template version.');
        }

        return DB::transaction(function () use ($record, $batch, $version) {
            $certificate = Certificate::create([
                'organization_id' => $batch->organization_id,
                'certificate_batch_id' => $batch->id,
                'batch_record_id' => $record->id,
                'document_template_id' => $batch->document_template_id,
                'document_template_version_id' => $version->id,
                'certificate_number' => $this->certNumber->generate(),
                'recipient_data' => $record->source_data,
                'verification_token' => $this->token->generate(),
                'status' => CertificateStatus::Generated->value,
            ]);

            $pdfBinary = $this->pdf->generate($version, $certificate);

            $relative = 'certificates/'.$batch->organization_id.'/'.$certificate->certificate_number.'.pdf';
            $this->storage->store($relative, $pdfBinary);

            // Hash the ACTUAL stored bytes.
            $pdfHash = $this->hash->hashBinary($this->storage->get($relative));

            $certificate->update([
                'pdf_path' => $relative,
                'pdf_hash' => $pdfHash,
                'status' => CertificateStatus::Issued->value,
                'issued_at' => now(),
            ]);

            $record->update(['status' => BatchRecordStatus::Generated->value]);

            $this->activityLog->log(ActivityAction::CertificateIssued, $batch->organization_id, subject: $certificate, metadata: [
                'certificate_number' => $certificate->certificate_number,
            ]);

            return $certificate;
        });
    }

    /**
     * Generate all certificates for a paid batch.
     */
    public function generateBatchCertificates(CertificateBatch $batch): CertificateBatch
    {
        if ($batch->status !== BatchStatus::Paid) {
            throw new RuntimeException('Batch must be paid before generating certificates.');
        }

        $batch->update(['status' => BatchStatus::Processing->value]);

        $failures = 0;
        $batch->validRecords->each(function (BatchRecord $record) use (&$failures) {
            try {
                $this->generateCertificateForRecord($record);
            } catch (Throwable $e) {
                $failures++;
                report($e);
            }
        });

        $batch->refresh();
        $batch->update([
            'status' => $failures === 0 ? BatchStatus::Completed->value : BatchStatus::Failed->value,
        ]);

        return $batch;
    }

    /**
     * Build the Merkle tree from all issued certificate hashes and anchor
     * the single root on-chain. One anchor transaction per batch.
     */
    public function anchorBatch(CertificateBatch $batch): MerkleAnchor
    {
        $certificates = $batch->certificates()->whereNotNull('pdf_hash')->get();
        if ($certificates->isEmpty()) {
            throw new RuntimeException('No certificate hashes to anchor.');
        }

        $hashes = $certificates->pluck('pdf_hash')->all();
        $tree = $this->merkle->buildTree($hashes);

        $anchor = DB::transaction(function () use ($batch, $tree, $certificates) {
            $anchor = MerkleAnchor::create([
                'organization_id' => $batch->organization_id,
                'certificate_batch_id' => $batch->id,
                'hash_algorithm' => MerkleTreeService::ALGORITHM,
                'merkle_version' => MerkleTreeService::VERSION,
                'leaf_count' => count($tree['leaves']),
                'merkle_root' => $tree['root'],
                'status' => \App\Enums\BlockchainStatus::Pending->value,
            ]);

            foreach ($certificates as $certificate) {
                CertificateBlockchainRecord::create([
                    'certificate_id' => $certificate->id,
                    'merkle_anchor_id' => $anchor->id,
                    'leaf_hash' => $certificate->pdf_hash,
                    'proof' => $this->merkle->generateProof($tree['leaves'], $certificate->pdf_hash),
                    'merkle_root' => $tree['root'],
                ]);
            }

            $this->activityLog->log(ActivityAction::MerkleTreeCreated, $batch->organization_id, subject: $anchor, metadata: [
                'leaves' => count($tree['leaves']),
                'version' => $tree['version'],
            ]);
            $this->activityLog->log(ActivityAction::MerkleRootCreated, $batch->organization_id, subject: $anchor, metadata: [
                'root' => $tree['root'],
            ]);

            return $anchor;
        });

        // Blockchain submission + confirmation (mock or real).
        $this->blockchain->submitAndConfirm($anchor);

        return $anchor;
    }
}
