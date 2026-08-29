<?php

namespace App\Services\Blockchain;

interface BlockchainProviderInterface
{
    /**
     * Submit a Merkle root for anchoring to the smart contract.
     *
     * @param array $data merkle_root, batch_identifier, meta
     */
    public function anchorRoot(array $data): BlockchainSubmissionResult;

    /**
     * Check whether a root already exists on-chain.
     */
    public function rootExists(string $merkleRoot): bool;

    /**
     * Get authoritative on-chain status for a transaction.
     */
    public function getTransactionStatus(string $transactionHash): BlockchainReceipt;

    /**
     * Retrieve on-chain root info (block, timestamp) for a stored root.
     */
    public function getRootInfo(string $merkleRoot): array;
}
