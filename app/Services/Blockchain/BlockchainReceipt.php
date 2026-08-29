<?php

namespace App\Services\Blockchain;

class BlockchainReceipt
{
    public function __construct(
        public readonly string $status, // pending | confirmed | failed
        public readonly ?string $blockNumber = null,
        public readonly ?string $root = null,
        public readonly ?string $error = null,
    ) {}
}
