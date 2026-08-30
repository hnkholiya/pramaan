<?php

namespace App\Services\Blockchain;

use App\Enums\ActivityAction;
use App\Enums\BlockchainStatus;
use App\Models\MerkleAnchor;
use App\Services\ActivityLogService;
use RuntimeException;
use Throwable;

/**
 * Orchestrates application-level blockchain operations for Merkle anchors.
 * Network/RPC/wallet details stay inside the provider, not in controllers.
 */
class BlockchainService
{
    public function __construct(
        private BlockchainProviderInterface $provider,
        private ActivityLogService $activityLog,
    ) {}

    public function provider(): BlockchainProviderInterface
    {
        return $this->provider;
    }

    /**
     * Submit the Merkle root on-chain. Idempotent if already submitted.
     */
    public function submitAnchor(MerkleAnchor $anchor): MerkleAnchor
    {
        if ($anchor->status === BlockchainStatus::Confirmed) {
            return $anchor;
        }

        // Idempotency: if we already have a tx hash, do not resubmit.
        if (! $anchor->transaction_hash) {
            $submission = $this->provider->anchorRoot([
                'merkle_root' => $anchor->merkle_root,
                'batch_identifier' => 'batch-' . $anchor->certificate_batch_id,
            ]);

            $anchor->update([
                'transaction_hash' => $submission->transactionHash,
                'status' => BlockchainStatus::Submitted->value,
                'network' => $this->networkLabel(),
                'chain_id' => (string) config('blockchain.arbitrum.chain_id', '421614'),
                'contract_address' => $this->provider->getRootInfo($anchor->merkle_root)['contract_address'] ?? null,
                'submitted_at' => now(),
            ]);
        } else {
            $anchor->update(['status' => BlockchainStatus::Submitted->value]);
        }

        $this->activityLog->log(ActivityAction::BlockchainSubmitted, $anchor->organization_id, subject: $anchor, metadata: [
            'transaction_hash' => $anchor->transaction_hash,
            'root' => $anchor->merkle_root,
        ]);

        return $anchor;
    }

    /**
     * Check confirmation status and update the anchor.
     *
     * Important:
     * "not confirmed yet" is NOT the same as "failed".
     * Pending RPC/receipt state remains CONFIRMING so the queue job can retry.
     */
    public function confirmAnchor(
        MerkleAnchor $anchor,
        int $requiredBlocks = 0
    ): MerkleAnchor {
        if (! $anchor->transaction_hash) {
            throw new RuntimeException(
                'Anchor has no transaction hash to confirm.'
            );
        }

        /*
     * Already confirmed: idempotent.
     */
        if (
            $anchor->status === BlockchainStatus::Confirmed
        ) {
            return $anchor;
        }

        /*
     * Move to confirming while checking the provider.
     */
        if (
            $anchor->status !== BlockchainStatus::Confirming
        ) {
            $anchor->update([
                'status' => BlockchainStatus::Confirming->value,
            ]);
        }

        $receipt = $this->provider->getTransactionStatus(
            $anchor->transaction_hash
        );

        /*
     * SUCCESS
     */
        if ($receipt->status === 'confirmed') {
            $anchor->update([
                'status' => BlockchainStatus::Confirmed->value,
                'block_number' => $receipt->blockNumber,
                'confirmed_at' => now(),
                'failure_reason' => null,
            ]);

            $this->activityLog->log(
                ActivityAction::BlockchainConfirmed,
                $anchor->organization_id,
                subject: $anchor,
                metadata: [
                    'transaction_hash' => $anchor->transaction_hash,
                    'block_number' => $receipt->blockNumber,
                ]
            );

            return $anchor->fresh();
        }

        /*
     * EXPLICIT BLOCKCHAIN FAILURE
     */
        if (
            $receipt->status === 'failed'
        ) {
            $reason = $receipt->error
                ?: 'Blockchain transaction failed.';

            $anchor->update([
                'status' => BlockchainStatus::Failed->value,
                'failure_reason' => $reason,
            ]);

            $this->activityLog->log(
                ActivityAction::BlockchainFailed,
                $anchor->organization_id,
                subject: $anchor,
                metadata: [
                    'transaction_hash' => $anchor->transaction_hash,
                    'reason' => $reason,
                ]
            );

            return $anchor->fresh();
        }

        /*
     * STILL PENDING
     *
     * This is the important fix.
     */
        $anchor->update([
            'status' => BlockchainStatus::Confirming->value,
        ]);

        return $anchor->fresh();
    }

    /**
     * Submit + perform one confirmation check.
     *
     * Kept for compatibility, but long-running confirmation is handled
     * by ConfirmAnchorJob.
     */
    public function submitAndConfirm(
        MerkleAnchor $anchor
    ): MerkleAnchor {
        $this->submitAnchor($anchor);

        return $this->confirmAnchor($anchor);
    }

    private function networkLabel(): string
    {
        return config('blockchain.provider') === 'arbitrum' ? 'arbitrum' : 'mock';
    }

    public function isRootAnchored(string $merkleRoot): bool
    {
        return $this->provider->rootExists($merkleRoot);
    }
}
