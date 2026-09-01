<?php

namespace App\Services;

use App\Enums\ActivityAction;
use App\Enums\BatchStatus;
use App\Enums\QuoteStatus;
use App\Models\CertificateBatch;
use App\Models\PricingQuote;
use RuntimeException;
use App\Services\OrganizationAccessService;

/**
 * Clean, centralized pricing/quote engine. Pricing logic never lives in
 * controllers. Configuration is injected via config/pricing.php.
 */
class PricingService
{
    public function __construct(
        private ActivityLogService $activityLog,
        private OrganizationAccessService $organizationAccess,
    ) {}

    public function buildQuote(CertificateBatch $batch): PricingQuote
    {

        $this->organizationAccess->assertActive(
            $batch->organization
        );
        if (! in_array($batch->status->value, [BatchStatus::Validated->value, BatchStatus::Mapped->value], true)) {
            throw new RuntimeException('Batch must be validated before generating a quote.');
        }

        $count = $batch->valid_records;
        if ($count <= 0) {
            throw new RuntimeException('Batch has no valid records to quote.');
        }

        $pricePer = (float) config('pricing.price_per_certificate');
        $taxRate = (float) config('pricing.tax_rate');

        $subtotal = round($count * $pricePer, 2);
        $tax = round($subtotal * ($taxRate / 100), 2);
        $total = round($subtotal + $tax, 2);

        $quote = PricingQuote::create([
            'organization_id' => $batch->organization_id,
            'certificate_batch_id' => $batch->id,
            'currency' => config('pricing.currency', 'INR'),
            'price_per_certificate' => $pricePer,
            'certificate_count' => $count,
            'subtotal' => $subtotal,
            'tax_rate' => $taxRate,
            'tax' => $tax,
            'total' => $total,
            'status' => QuoteStatus::Pending->value,
        ]);

        $batch->update([
            'price_per_certificate' => $pricePer,
            'status' => BatchStatus::Quoted->value,
        ]);

        $this->activityLog->log(ActivityAction::QuoteCreated, $batch->organization_id, subject: $quote, metadata: [
            'subtotal' => $subtotal,
            'tax' => $tax,
            'total' => $total,
        ]);

        return $quote;
    }

    /**
     * Refresh/recompute a quote for the same batch (idempotent when status pending).
     */
    public function refreshQuote(CertificateBatch $batch): PricingQuote
    {
        if ($batch->quote && $batch->quote->status === QuoteStatus::Paid) {
            throw new RuntimeException('Cannot refresh an already-paid quote.');
        }

        $batch->quote?->delete();

        return $this->buildQuote($batch);
    }
}
