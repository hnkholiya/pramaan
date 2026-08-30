<?php

namespace App\Services\Payment;

interface PaymentProviderInterface
{
    /**
     * Create a payment order (server-side, never trusting the frontend).
     *
     * @param array{receipt: string, amount: float|int, currency: string, notes?: array} $data
     */
    public function createOrder(array $data): PaymentOrderResult;

    /**
     * Verify the payment callback signature server-side.
     *
     * IMPORTANT:
     * The authoritative Razorpay order ID must come from
     * our own database, not from the browser callback.
     */
    public function verifySignature(
        string $orderId,
        string $paymentId,
        string $signature
    ): bool;

    /**
     * Fetch authoritative payment status from the provider by payment id.
     */
    public function fetchPaymentStatus(string $paymentId): string;
}
