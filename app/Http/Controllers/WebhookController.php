<?php

namespace App\Http\Controllers;

use App\Services\Payment\PaymentService;
use Illuminate\Http\Request;

class WebhookController extends Controller
{
    public function __construct(private PaymentService $service) {}

    /**
     * Razorpay webhook. Verifies the HMAC signature server-side and handles
     * the event idempotently.
     */
    public function razorpay(Request $request)
    {
        $payload = $request->getContent();
        $signature = (string) $request->header('X-Razorpay-Signature');

        $secret = (string) config('payments.razorpay.webhook_secret');

        // If webhook secret configured, verify HMAC. Otherwise reject.
        if ($secret !== '') {
            $expected = hash_hmac('sha256', $payload, $secret);
            if (! hash_equals($expected, $signature)) {
                abort(400, 'Invalid webhook signature.');
            }
        } else {
            abort(400, 'Webhook secret not configured.');
        }

        $event = json_decode($payload, true);
        $eventType = $event['event'] ?? 'unknown';
        $eventId = $event['payload']['payment']['entity']['id'] ?? null;

        $this->service->handleWebhook('razorpay', $eventType, $eventId ?? uniqid('ev_'), $event);

        return response()->json(['status' => 'ok']);
    }
}
