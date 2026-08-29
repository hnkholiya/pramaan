<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Blockchain configuration
    |--------------------------------------------------------------------------
    |
    | provider: 'arbitrum' or 'mock'.
    |   - 'arbitrum' uses a real RPC + wallet + contract (Arbitrum Sepolia).
    |   - 'mock' is a local deterministic provider for development/testing
    |     when no RPC access is available.
    |
    | NEVER commit private keys. Use .env only.
    |
    */

    'provider' => env('BLOCKCHAIN_PROVIDER', 'mock'),

    'arbitrum' => [
        'rpc_url' => env('ARBITRUM_RPC_URL'),
        'chain_id' => env('ARBITRUM_CHAIN_ID', '421614'), // 421614 = Arbitrum Sepolia
        'contract_address' => env('ARBITRUM_CONTRACT_ADDRESS'),
        'wallet_address' => env('ARBITRUM_WALLET_ADDRESS'),
        'private_key' => env('ARBITRUM_PRIVATE_KEY'),
        'gas_limit' => env('ARBITRUM_GAS_LIMIT', 300000),
        'confirmation_blocks' => env('ARBITRUM_CONFIRMATION_BLOCKS', 2),
    ],
];
