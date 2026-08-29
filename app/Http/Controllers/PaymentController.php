<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Services\Payment\PaymentService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(private PaymentService $service) {}

    public function index(Request $request)
    {
        $payments = $request->user()->currentOrganization()->payments()
            ->with(['batch', 'quote'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'order_id' => $p->provider_order_id,
                'payment_id' => $p->provider_payment_id,
                'provider' => $p->provider->value,
                'amount' => $p->amount,
                'currency' => $p->currency,
                'status' => $p->status->value,
                'batch_id' => $p->certificate_batch_id,
                'verified_at' => $p->verified_at?->toIso8601String(),
            ]);

        return \Inertia\Inertia::render('Payments/Index', ['payments' => $payments]);
    }

    /**
     * Razorpay return callback. Server is the source of truth.
     */
    public function callback(Request $request, Payment $payment)
    {
        abort_unless($payment->organization_id === $request->user()?->currentOrganization()?->id, 403, 'Forbidden.');

        $verified = $this->service->verifyAndCapture($payment, [
            'razorpay_order_id' => $request->input('razorpay_order_id'),
            'razorpay_payment_id' => $request->input('razorpay_payment_id'),
            'razorpay_signature' => $request->input('razorpay_signature'),
        ]);

        return redirect()
            ->route('organization.batches.show', $verified->certificate_batch_id)
            ->with('success', 'Payment verified.');
    }
}
