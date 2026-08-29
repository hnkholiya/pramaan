<?php

namespace App\Services\Payment;

use App\Enums\ActivityAction;
use App\Enums\BatchStatus;
use App\Enums\PaymentStatus;
use App\Enums\QuoteStatus;
use App\Models\CertificateBatch;
use App\Models\Payment;
use App\Models\PricingQuote;
use App\Models\WebhookEvent;
use App\Services\ActivityLogService;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Throwable;

class PaymentService
{
    public function __construct(
        private ActivityLogService $activityLog,
        private PaymentProviderInterface $provider,
    ) {}

    public function provider(): PaymentProviderInterface
    {
        return $this->provider;
    }

    /**
     * Create a server-side payment order for a pending quote.
     */
    public function createOrderForQuote(PricingQuote $quote): Payment
    {
        if ($quote->status !== QuoteStatus::Pending) {
            throw new RuntimeException('Quote is not pending.');
        }
        if ($quote->batch->status->value !== BatchStatus::Quoted->value) {
            throw new RuntimeException('Batch is not in a quotable state.');
        }

        return DB::transaction(function () use ($quote) {
            $receipt = 'batch-'.$quote->certificate_batch_id;

            $order = $this->provider->createOrder([
                'receipt' => $receipt,
                'amount' => $quote->total,
                'currency' => $quote->currency,
                'notes' => [
                    'quote_id' => $quote->id,
                    'batch_id' => $quote->certificate_batch_id,
                ],
            ]);

            $payment = Payment::create([
                'organization_id' => $quote->organization_id,
                'pricing_quote_id' => $quote->id,
                'certificate_batch_id' => $quote->certificate_batch_id,
                'provider' => $order->provider,
                'provider_order_id' => $order->orderId,
                'amount' => $quote->total,
                'currency' => $order->currency,
                'status' => PaymentStatus::Created->value,
                'payload' => $order->meta,
            ]);

            $quote->update(['status' => QuoteStatus::Pending->value]);
            $quote->batch->update(['status' => BatchStatus::PaymentPending->value]);

            $this->activityLog->log(ActivityAction::PaymentCreated, $payment->organization_id, subject: $payment, metadata: [
                'order_id' => $order->orderId,
                'amount' => $payment->amount,
            ]);

            return $payment;
        });
    }

    /**
     * Server-side payment verification. The browser callback is never trusted.
     *
     * Idempotent: a payment already captured returns without side effects.
     */
    public function verifyAndCapture(Payment $payment, array $attributes): Payment
    {
        if ($payment->status === PaymentStatus::Captured) {
            return $payment; // idempotent
        }

        if (! $this->provider->verifySignature($attributes)) {
            $payment->update(['status' => PaymentStatus::Failed->value]);
            $this->activityLog->log(ActivityAction::PaymentFailed, $payment->organization_id, subject: $payment, metadata: [
                'reason' => 'signature_mismatch',
            ]);

            throw new RuntimeException('Payment signature verification failed.');
        }

        // Authoritative provider status check.
        $providerStatus = $this->provider->fetchPaymentStatus($attributes['razorpay_payment_id'] ?? '');
        if ($providerStatus !== 'captured') {
            $payment->update(['status' => PaymentStatus::Failed->value]);
            $this->activityLog->log(ActivityAction::PaymentFailed, $payment->organization_id, subject: $payment, metadata: [
                'provider_status' => $providerStatus,
            ]);

            throw new RuntimeException('Payment was not captured by the provider.');
        }

        return DB::transaction(function () use ($payment, $attributes) {
            $payment->update([
                'provider_payment_id' => $attributes['razorpay_payment_id'] ?? null,
                'provider_signature' => $attributes['razorpay_signature'] ?? null,
                'status' => PaymentStatus::Captured->value,
                'verified_at' => now(),
            ]);

            $quote = $payment->quote;
            if ($quote) {
                $quote->update(['status' => QuoteStatus::Paid->value]);
            }

            $batch = $payment->batch;
            $batch->update(['status' => BatchStatus::Paid->value]);

            $this->activityLog->log(ActivityAction::PaymentVerified, $payment->organization_id, subject: $payment);
            $this->activityLog->log(ActivityAction::BatchMarkedPaid, $batch->organization_id, subject: $batch);

            return $payment;
        });
    }

    /**
     * Handle a payment webhook idempotently.
     */
    public function handleWebhook(string $provider, string $eventType, string $providerEventId, array $payload): WebhookEvent
    {
        // Idempotency: unique(provider, provider_event_id)
        $existing = WebhookEvent::where('provider', $provider)
            ->where('provider_event_id', $providerEventId)
            ->first();

        if ($existing) {
            return $existing;
        }

        $event = WebhookEvent::create([
            'provider' => $provider,
            'event_type' => $eventType,
            'provider_event_id' => $providerEventId,
            'payload' => $payload,
            'status' => 'received',
        ]);

        try {
            $this->processWebhook($event);
            $event->update(['status' => 'processed', 'processed_at' => now()]);
        } catch (Throwable $e) {
            $event->update(['status' => 'failed']);
            report($e);
            throw $e;
        }

        return $event;
    }

    private function processWebhook(WebhookEvent $event): void
    {
        // Find the payment by order id, then verify against provider.
        $orderId = $event->payload['payload']['payment']['entity']['order_id']
            ?? $event->payload['order_id']
            ?? null;

        $paymentId = $event->payload['payload']['payment']['entity']['id']
            ?? $event->payload['payment_id']
            ?? null;

        if (! $orderId || ! $paymentId) {
            return;
        }

        $payment = Payment::where('provider_order_id', $orderId)->first();
        if (! $payment) {
            return;
        }

        $status = $this->provider->fetchPaymentStatus($paymentId);
        if ($status === 'captured') {
            $this->verifyAndCapture($payment, [
                'razorpay_order_id' => $orderId,
                'razorpay_payment_id' => $paymentId,
                'razorpay_signature' => 'webhook', // signature handled by webhook HMAC at HTTP layer
            ]);
        } else {
            $payment->update(['status' => PaymentStatus::Failed->value]);
            $this->activityLog->log(ActivityAction::PaymentFailed, $payment->organization_id, subject: $payment, metadata: [
                'provider_status' => $status,
            ]);
        }
    }
}
