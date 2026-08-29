<?php

namespace App\Services\Payment;

use Razorpay\Api\Api;
use RuntimeException;

/**
 * Real Razorpay integration. Uses test or live mode via config/payments.php.
 * Never trusts the frontend callback; signature verification is server-side.
 */
class RazorpayPaymentProvider implements PaymentProviderInterface
{
    private Api $api;

    public function __construct()
    {
        $key = config('payments.razorpay.key_id');
        $secret = config('payments.razorpay.key_secret');

        if (! $key || ! $secret) {
            throw new RuntimeException('Razorpay credentials are not configured.');
        }

        $this->api = new Api($key, $secret);
    }

    public function createOrder(array $data): PaymentOrderResult
    {
        $order = $this->api->order->create([
            'receipt' => $data['receipt'],
            'amount' => (int) round($data['amount'] * 100), // paise
            'currency' => $data['currency'],
            'notes' => $data['notes'] ?? [],
        ]);

        return new PaymentOrderResult(
            orderId: $order['id'],
            amount: $order['amount'],
            currency: $order['currency'],
            provider: 'razorpay',
            meta: ['receipt' => $data['receipt']],
        );
    }

    public function verifySignature(array $attributes): bool
    {
        $signature = $attributes['razorpay_signature'] ?? null;
        $orderId = $attributes['razorpay_order_id'] ?? null;
        $paymentId = $attributes['razorpay_payment_id'] ?? null;

        if (! $signature || ! $orderId || ! $paymentId) {
            return false;
        }

        $expected = hash_hmac('sha256', $orderId.'|'.$paymentId, config('payments.razorpay.key_secret'));

        return hash_equals($expected, $signature);
    }

    public function fetchPaymentStatus(string $paymentId): string
    {
        $payment = $this->api->payment->fetch($paymentId);

        return $payment['status'] ?? 'unknown';
    }
}
