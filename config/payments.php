<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Payment provider configuration
    |--------------------------------------------------------------------------
    |
    | provider: 'razorpay' or 'mock'.
    |   - 'razorpay' uses the Razorpay SDK (test or live via mode).
    |   - 'mock' is a local provider used when credentials/network are
    |     unavailable; it must NEVER be used in production.
    |
    */

    'provider' => env('PAYMENT_PROVIDER', 'mock'),

    'razorpay' => [
        'key_id' => env('RAZORPAY_KEY_ID'),
        'key_secret' => env('RAZORPAY_KEY_SECRET'),
        'mode' => env('RAZORPAY_MODE', 'test'), // test | live
        'webhook_secret' => env('RAZORPAY_WEBHOOK_SECRET'),
    ],
];
