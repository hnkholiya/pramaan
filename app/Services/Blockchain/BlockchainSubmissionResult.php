<?php

namespace App\Services\Blockchain;

class BlockchainSubmissionResult
{
    public function __construct(
        public readonly string $transactionHash,
        public readonly string $status, // submitted
        public readonly ?string $blockNumber = null,
        public readonly array $meta = [],
    ) {}
}
