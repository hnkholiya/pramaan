<?php

namespace App\Services\Blockchain;

use Illuminate\Support\Facades\Http;
use RuntimeException;
use Web3p\EthereumTx\EIP1559Transaction;

class ArbitrumBlockchainProvider implements BlockchainProviderInterface
{
    private string $rpcUrl;
    private int $chainId;
    private string $contractAddress;
    private string $walletAddress;
    private string $privateKey;
    private int $gasLimit;
    private int $confirmationBlocks;

    public function __construct()
    {
        $this->rpcUrl = (string) config(
            'blockchain.arbitrum.rpc_url'
        );

        $this->chainId = (int) config(
            'blockchain.arbitrum.chain_id',
            421614
        );

        $this->contractAddress = (string) config(
            'blockchain.arbitrum.contract_address'
        );

        $this->walletAddress = (string) config(
            'blockchain.arbitrum.wallet_address'
        );

        $this->privateKey = (string) config(
            'blockchain.arbitrum.private_key'
        );

        $this->gasLimit = (int) config(
            'blockchain.arbitrum.gas_limit',
            300000
        );

        $this->confirmationBlocks = (int) config(
            'blockchain.arbitrum.confirmation_blocks',
            2
        );

        if ($this->rpcUrl === '') {
            throw new RuntimeException(
                'Arbitrum RPC URL is not configured.'
            );
        }

        if (
            ! preg_match(
                '/^0x[a-fA-F0-9]{40}$/',
                $this->contractAddress
            )
        ) {
            throw new RuntimeException(
                'Invalid Arbitrum contract address.'
            );
        }

        if (
            ! preg_match(
                '/^0x[a-fA-F0-9]{40}$/',
                $this->walletAddress
            )
        ) {
            throw new RuntimeException(
                'Invalid Arbitrum wallet address.'
            );
        }

        if (
            ! preg_match(
                '/^(0x)?[a-fA-F0-9]{64}$/',
                $this->privateKey
            )
        ) {
            throw new RuntimeException(
                'Invalid Arbitrum private key configuration.'
            );
        }

        if ($this->chainId !== 421614) {
            throw new RuntimeException(
                'This provider currently expects Arbitrum Sepolia chain ID 421614.'
            );
        }
    }

    private function rpc(
        string $method,
        array $params = []
    ): array {
        try {
            $response = Http::withOptions([
                'timeout' => 30,
            ])
                ->acceptJson()
                ->post($this->rpcUrl, [
                    'jsonrpc' => '2.0',
                    'id' => random_int(1, PHP_INT_MAX),
                    'method' => $method,
                    'params' => $params,
                ]);
        } catch (\Throwable $e) {
            throw new RuntimeException(
                'Arbitrum RPC request failed: ' . $e->getMessage(),
                0,
                $e
            );
        }

        if (! $response->successful()) {
            throw new RuntimeException(
                'Arbitrum RPC HTTP error: HTTP ' . $response->status()
            );
        }

        $data = $response->json();

        if (! is_array($data)) {
            throw new RuntimeException(
                'Arbitrum RPC returned invalid JSON.'
            );
        }

        if (isset($data['error'])) {
            $message = $data['error']['message']
                ?? 'unknown RPC error';

            $code = $data['error']['code']
                ?? 'unknown';

            throw new RuntimeException(
                "Arbitrum RPC error [{$code}]: {$message}"
            );
        }

        return $data;
    }

    private function quantityToInt(string $hex): int
    {
        $hex = strtolower(trim($hex));

        if (! str_starts_with($hex, '0x')) {
            throw new RuntimeException(
                "Invalid hex quantity: {$hex}"
            );
        }

        return hexdec(substr($hex, 2));
    }

    private function intToQuantity(int $value): string
    {
        if ($value < 0) {
            throw new RuntimeException(
                'Quantity cannot be negative.'
            );
        }

        return '0x' . dechex($value);
    }

    private function normalizeBytes32(string $root): string
    {
        $root = strtolower(trim($root));

        if (str_starts_with($root, '0x')) {
            $root = substr($root, 2);
        }

        if (
            $root === ''
            || ! preg_match('/^[0-9a-f]{1,64}$/', $root)
        ) {
            throw new RuntimeException(
                'Invalid Merkle root. Expected up to 32 bytes of hexadecimal data.'
            );
        }

        return '0x' . str_pad(
            $root,
            64,
            '0',
            STR_PAD_LEFT
        );
    }

    private function anchorCalldata(string $root): string
    {
        $root = $this->normalizeBytes32($root);

        // anchor(bytes32)
        // Function selector: 0xeecdf927
        return '0xeecdf927' . substr($root, 2);
    }

    public function anchorRoot(
        array $data
    ): BlockchainSubmissionResult {
        $root = $this->normalizeBytes32(
            (string) ($data['merkle_root'] ?? '')
        );

        /*
        |--------------------------------------------------------------------------
        | 1. Prevent duplicate submission
        |--------------------------------------------------------------------------
        */
        if ($this->rootExists($root)) {
            throw new RuntimeException(
                'Merkle root is already anchored on-chain.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 2. Get pending nonce
        |--------------------------------------------------------------------------
        */
        $nonceResponse = $this->rpc(
            'eth_getTransactionCount',
            [
                $this->walletAddress,
                'pending',
            ]
        );

        $nonceHex = $nonceResponse['result'] ?? null;

        if (! is_string($nonceHex)) {
            throw new RuntimeException(
                'Failed to get wallet nonce.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 3. Build calldata
        |--------------------------------------------------------------------------
        */
        $calldata = $this->anchorCalldata($root);

        /*
        |--------------------------------------------------------------------------
        | 4. Estimate gas
        |--------------------------------------------------------------------------
        */
        $gasEstimateResponse = $this->rpc(
            'eth_estimateGas',
            [[
                'from' => $this->walletAddress,
                'to' => $this->contractAddress,
                'value' => '0x0',
                'data' => $calldata,
            ]]
        );

        $gasEstimateHex =
            $gasEstimateResponse['result']
            ?? null;

        if (! is_string($gasEstimateHex)) {
            throw new RuntimeException(
                'Failed to estimate gas.'
            );
        }

        $estimatedGas =
            $this->quantityToInt(
                $gasEstimateHex
            );

        if ($estimatedGas <= 0) {
            throw new RuntimeException(
                'RPC returned an invalid gas estimate.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 5. Add a safety margin
        |--------------------------------------------------------------------------
        */
        $gas = max(
            $estimatedGas,
            (int) ceil(
                $estimatedGas * 1.20
            )
        );

        /*
        |--------------------------------------------------------------------------
        | 6. Get gas price
        |--------------------------------------------------------------------------
        */
        $gasPriceResponse = $this->rpc(
            'eth_gasPrice'
        );

        $gasPriceHex =
            $gasPriceResponse['result']
            ?? null;

        if (! is_string($gasPriceHex)) {
            throw new RuntimeException(
                'Failed to get gas price.'
            );
        }

        $gasPrice =
            $this->quantityToInt(
                $gasPriceHex
            );

        if ($gasPrice <= 0) {
            throw new RuntimeException(
                'RPC returned an invalid gas price.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 7. Try to obtain max priority fee
        |--------------------------------------------------------------------------
        */
        $priorityFee = 0;

        try {
            $priorityResponse = $this->rpc(
                'eth_maxPriorityFeePerGas'
            );

            $priorityHex =
                $priorityResponse['result']
                ?? null;

            if (
                is_string($priorityHex)
                && str_starts_with(
                    strtolower($priorityHex),
                    '0x'
                )
            ) {
                $priorityFee =
                    $this->quantityToInt(
                        $priorityHex
                    );
            }
        } catch (\Throwable) {
            // Some RPC providers may not expose this method.
            $priorityFee = 0;
        }

        /*
        |--------------------------------------------------------------------------
        | 8. Build EIP-1559 fee values
        |--------------------------------------------------------------------------
        |
        | maxFee is deliberately above the current gas price so the
        | transaction has room for fee movement.
        */
        $maxPriorityFeePerGas =
            max(
                1,
                min(
                    $priorityFee > 0
                        ? $priorityFee
                        : 1_000_000_000,
                    $gasPrice
                )
            );

        $maxFeePerGas =
            max(
                $gasPrice,
                ($gasPrice * 2) +
                    $maxPriorityFeePerGas
            );

        /*
        |--------------------------------------------------------------------------
        | 9. Build EIP-1559 transaction
        |--------------------------------------------------------------------------
        */
        $transaction = new EIP1559Transaction([
            'nonce' => $nonceHex,
            'from' => $this->walletAddress,
            'to' => $this->contractAddress,
            'maxPriorityFeePerGas' =>
            $this->intToQuantity(
                $maxPriorityFeePerGas
            ),
            'maxFeePerGas' =>
            $this->intToQuantity(
                $maxFeePerGas
            ),
            'gas' =>
            $this->intToQuantity($gas),
            'value' => '0x0',
            'chainId' => $this->chainId,
            'accessList' => [],
            'data' => $calldata,
        ]);

        /*
        |--------------------------------------------------------------------------
        | 10. Sign locally
        |--------------------------------------------------------------------------
        */
        $rawTransaction =
            $transaction->sign(
                $this->privateKey
            );

        if (! is_string($rawTransaction)) {
            throw new RuntimeException(
                'Transaction signing failed.'
            );
        }

        $rawTransaction =
            str_starts_with(
                $rawTransaction,
                '0x'
            )
            ? $rawTransaction
            : '0x' . $rawTransaction;

        /*
        |--------------------------------------------------------------------------
        | 11. Submit signed raw transaction
        |--------------------------------------------------------------------------
        */
        $result = $this->rpc(
            'eth_sendRawTransaction',
            [$rawTransaction]
        );

        $hash =
            $result['result']
            ?? null;

        if (
            ! is_string($hash)
            || ! preg_match(
                '/^0x[a-fA-F0-9]{64}$/',
                $hash
            )
        ) {
            throw new RuntimeException(
                'eth_sendRawTransaction returned no valid transaction hash.'
            );
        }

        return new BlockchainSubmissionResult(
            transactionHash: $hash,
            status: 'submitted',
        );
    }

    public function rootExists(string $merkleRoot): bool
    {
        $root = $this->normalizeBytes32($merkleRoot);

        // anchoredRoots(bytes32)
        $calldata = '0xce993b8c' . substr($root, 2);

        $result = $this->rpc(
            'eth_call',
            [[
                'to' => $this->contractAddress,
                'data' => $calldata,
            ], 'latest']
        );

        $encoded = strtolower(
            (string) ($result['result'] ?? '')
        );

        if (! preg_match('/^0x[0-9a-f]{64}$/', $encoded)) {
            throw new RuntimeException(
                'Invalid ABI bool response from anchoredRoots().'
            );
        }

        return substr($encoded, -1) === '1';
    }

    public function getTransactionStatus(
        string $transactionHash
    ): BlockchainReceipt {
        if (
            ! preg_match(
                '/^0x[a-fA-F0-9]{64}$/',
                $transactionHash
            )
        ) {
            throw new RuntimeException(
                'Invalid transaction hash.'
            );
        }

        $receipt =
            $this->rpc(
                'eth_getTransactionReceipt',
                [$transactionHash]
            );

        $result =
            $receipt['result']
            ?? null;

        if (! is_array($result)) {
            return new BlockchainReceipt(
                status: 'pending'
            );
        }

        $status =
            strtolower(
                (string) (
                    $result['status']
                    ?? '0x0'
                )
            );

        $blockNumber =
            isset(
                $result['blockNumber']
            )
            ? $this->quantityToInt(
                $result['blockNumber']
            )
            : null;

        if ($status !== '0x1') {
            return new BlockchainReceipt(
                status: 'failed',
                blockNumber: $blockNumber,
                error: 'Transaction reverted.'
            );
        }

        return new BlockchainReceipt(
            status: 'confirmed',
            blockNumber: $blockNumber
        );
    }

    public function getRootInfo(
        string $merkleRoot
    ): array {
        return [
            'contract_address' =>
            $this->contractAddress,

            'chain_id' =>
            $this->chainId,

            'wallet_address' =>
            $this->walletAddress,

            'merkle_root' =>
            $this->normalizeBytes32(
                $merkleRoot
            ),
        ];
    }
}
