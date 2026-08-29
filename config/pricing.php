<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default pricing configuration
    |--------------------------------------------------------------------------
    |
    | price_per_certificate: cost per single certificate document.
    | tax_rate: percentage applied on top of the subtotal.
    | currency: ISO 4217 currency code used for quotes and payments.
    |
    */

    'currency' => env('PRICING_CURRENCY', 'INR'),
    'price_per_certificate' => (float) env('PRICING_PRICE_PER_CERTIFICATE', 50),
    'tax_rate' => (float) env('PRICING_TAX_RATE', 18),
];
