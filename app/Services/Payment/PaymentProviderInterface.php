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
     * @param array $attributes e.g. ['razorpay_order_id','razorpay_payment_id','razorpay_signature']
     */
    public function verifySignature(array $attributes): bool;

    /**
     * Fetch authoritative payment status from the provider by payment id.
     */
    public function fetchPaymentStatus(string $paymentId): string;
}
