<?php

namespace App\Services\Payment;

use Illuminate\Support\Str;

/**
 * Local deterministic provider used ONLY when credentials/network are
 * unavailable (development/testing). It must never be used in production.
 */
class MockPaymentProvider implements PaymentProviderInterface
{
    public function createOrder(array $data): PaymentOrderResult
    {
        return new PaymentOrderResult(
            orderId: 'order_'.Str::random(12),
            amount: $data['amount'],
            currency: $data['currency'],
            provider: 'mock',
            meta: ['receipt' => $data['receipt']],
        );
    }

    public function verifySignature(array $attributes): bool
    {
        // In mock mode, a "paid" signature is simulated for the test flow.
        return ($attributes['razorpay_signature'] ?? null) === 'mock_paid_signature'
            || ($attributes['mock_paid'] ?? false);
    }

    public function fetchPaymentStatus(string $paymentId): string
    {
        return 'captured';
    }
}
