<?php

namespace App\Services\Blockchain;

use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Real Arbitrum (Sepolia) integration over JSON-RPC.
 *
 * A minimal PramaanRegistry contract exposes `anchoredRoots(bytes32)` and
 * `anchor(bytes32)`. This provider submits the root transaction through an
 * RPC endpoint. In production, wallet signing is delegated to a key-managed
 * signer / relayer; never hold raw keys in the web tier.
 *
 * Requires ARBITRUM_RPC_URL and a signing strategy.
 */
class ArbitrumBlockchainProvider implements BlockchainProviderInterface
{
    private string $rpcUrl;
    private string $chainId;
    private string $contractAddress;

    public function __construct()
    {
        $this->rpcUrl = (string) config('blockchain.arbitrum.rpc_url');
        $this->chainId = (string) config('blockchain.arbitrum.chain_id', '421614');
        $this->contractAddress = (string) config('blockchain.arbitrum.contract_address');

        if (! $this->rpcUrl || ! $this->contractAddress) {
            throw new RuntimeException('Arbitrum RPC URL / contract address is not configured.');
        }
    }

    private function rpc(string $method, array $params = []): array
    {
        $response = Http::withOptions(['timeout' => 30])
            ->acceptJson()
            ->post($this->rpcUrl, [
                'jsonrpc' => '2.0',
                'id' => 1,
                'method' => $method,
                'params' => $params,
            ]);

        $data = $response->json();

        if (isset($data['error'])) {
            throw new RuntimeException('RPC error: '.($data['error']['message'] ?? 'unknown'));
        }

        return $data;
    }

    public function anchorRoot(array $data): BlockchainSubmissionResult
    {
        $root = $data['merkle_root'];
        if (! preg_match('/^0x[0-9a-fA-F]{64}$/', $root)) {
            $root = '0x'.str_pad(ltrim($root, '0x'), 64, '0', STR_PAD_LEFT);
        }

        // Build calldata for anchor(bytes32). ABI selector: 0xeecdf927
        $calldata = '0xeecdf927'.substr($root, 2);

        $tx = $this->rpc('eth_sendTransaction', [[
            'to' => $this->contractAddress,
            'data' => $calldata,
            'chainId' => $this->chainId,
            'gas' => (string) config('blockchain.arbitrum.gas_limit', 300000),
        ]]);

        $hash = $tx['result'] ?? null;
        if (! $hash) {
            throw new RuntimeException('eth_sendTransaction returned no hash.');
        }

        return new BlockchainSubmissionResult(
            transactionHash: $hash,
            status: 'submitted',
        );
    }

    public function rootExists(string $merkleRoot): bool
    {
        $root = '0x'.str_pad(ltrim($merkleRoot, '0x'), 64, '0', STR_PAD_LEFT);
        $calldata = '0x'.'ce993b8c'.substr($root, 2); // selector for anchoredRoots(bytes32)

        $result = $this->rpc('eth_call', [[
            'to' => $this->contractAddress,
            'data' => $calldata,
        ], 'latest']);

        // A non-zero 32-byte result means the root is anchored.
        $value = str_replace('0x', '', (string) ($result['result'] ?? ''));

        return $value !== '' && ltrim($value, '0') !== '';
    }

    public function getTransactionStatus(string $transactionHash): BlockchainReceipt
    {
        $receipt = $this->rpc('eth_getTransactionReceipt', [$transactionHash]);

        $result = $receipt['result'] ?? null;
        if (! $result) {
            return new BlockchainReceipt(status: 'pending');
        }

        if (($result['status'] ?? '0x0') !== '0x1') {
            return new BlockchainReceipt(
                status: 'failed',
                blockNumber: isset($result['blockNumber']) ? (int) hexdec($result['blockNumber']) : null,
                error: 'transaction reverted',
            );
        }

        return new BlockchainReceipt(
            status: 'confirmed',
            blockNumber: isset($result['blockNumber']) ? (int) hexdec($result['blockNumber']) : null,
        );
    }

    public function getRootInfo(string $merkleRoot): array
    {
        return [
            'contract_address' => $this->contractAddress,
            'chain_id' => $this->chainId,
            'merkle_root' => $merkleRoot,
        ];
    }
}
