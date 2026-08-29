<?php

namespace App\Services\Payment;

class PaymentOrderResult
{
    public function __construct(
        public readonly string $orderId,
        public readonly string $amount,
        public readonly string $currency,
        public readonly string $provider,
        public readonly array $meta = [],
    ) {}

    public static function from(array $data): self
    {
        return new self(
            orderId: $data['order_id'],
            amount: $data['amount'],
            currency: $data['currency'],
            provider: $data['provider'],
            meta: $data['meta'] ?? [],
        );
    }
}
