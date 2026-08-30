<?php

namespace App\Services\Payment;

use Razorpay\Api\Api;
use RuntimeException;

class RazorpayPaymentProvider implements PaymentProviderInterface
{
    private Api $api;

    public function __construct()
    {
        $key = config('payments.razorpay.key_id');
        $secret = config('payments.razorpay.key_secret');

        if (! $key || ! $secret) {
            throw new RuntimeException(
                'Razorpay credentials are not configured.'
            );
        }

        $this->api = new Api($key, $secret);
    }

    /**
     * Create a Razorpay order server-side.
     *
     * Amount received from the application is in major currency units
     * (for example INR 100.00) and is converted to paise here.
     */
    public function createOrder(array $data): PaymentOrderResult
    {
        $amount = (int) round(
            ((float) $data['amount']) * 100
        );

        if ($amount <= 0) {
            throw new RuntimeException(
                'Payment amount must be greater than zero.'
            );
        }

        $order = $this->api->order->create([
            'receipt' => $data['receipt'],
            'amount' => $amount,
            'currency' => $data['currency'],
            'notes' => $data['notes'] ?? [],
        ]);

        return new PaymentOrderResult(
            orderId: $order['id'],
            amount: $order['amount'],
            currency: $order['currency'],
            provider: 'razorpay',
            meta: [
                'receipt' => $data['receipt'],
                'status' => $order['status'] ?? null,
            ],
        );
    }

    /**
     * Verify Razorpay Checkout signature.
     *
     * The order ID MUST come from our database.
     */
    public function verifySignature(
        string $orderId,
        string $paymentId,
        string $signature
    ): bool {
        if (
            trim($orderId) === '' ||
            trim($paymentId) === '' ||
            trim($signature) === ''
        ) {
            return false;
        }

        $secret = config('payments.razorpay.key_secret');

        if (! $secret) {
            return false;
        }

        $expected = hash_hmac(
            'sha256',
            $orderId.'|'.$paymentId,
            $secret
        );

        return hash_equals(
            $expected,
            $signature
        );
    }

    /**
     * Fetch authoritative payment status from Razorpay.
     */
    public function fetchPaymentStatus(
        string $paymentId
    ): string {
        if (trim($paymentId) === '') {
            return 'unknown';
        }

        try {
            $payment = $this->api
                ->payment
                ->fetch($paymentId);

            return (string) (
                $payment['status'] ?? 'unknown'
            );
        } catch (\Throwable $e) {
            report($e);

            throw new RuntimeException(
                'Unable to fetch Razorpay payment status.',
                previous: $e
            );
        }
    }
}