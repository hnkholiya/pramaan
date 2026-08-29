<?php

namespace App\Services\Blockchain;

use Illuminate\Support\Str;

/**
 * Deterministic local provider for development/testing when no RPC access
 * exists. Simulates submission and immediate confirmation. Never used in
 * production.
 */
class MockBlockchainProvider implements BlockchainProviderInterface
{
    private array $anchored = [];

    public function anchorRoot(array $data): BlockchainSubmissionResult
    {
        $root = $data['merkle_root'];
        $this->anchored[$root] = true;

        return new BlockchainSubmissionResult(
            transactionHash: '0x'.Str::repeat(Str::random(1), 64),
            status: 'submitted',
            blockNumber: random_int(20000000, 30000000),
        );
    }

    public function rootExists(string $merkleRoot): bool
    {
        return $this->anchored[$merkleRoot] ?? false;
    }

    public function getTransactionStatus(string $transactionHash): BlockchainReceipt
    {
        return new BlockchainReceipt(status: 'confirmed', blockNumber: random_int(20000000, 30000000));
    }

    public function getRootInfo(string $merkleRoot): array
    {
        return [
            'contract_address' => '0xMockContract000000000000000000000000000000',
            'chain_id' => '421614',
            'merkle_root' => $merkleRoot,
            'network' => 'arbitrum-sepolia (mock)',
        ];
    }
}
