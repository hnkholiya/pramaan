<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'pricing_quote_id',
        'certificate_batch_id',
        'provider',
        'provider_order_id',
        'provider_payment_id',
        'provider_signature',
        'amount',
        'currency',
        'status',
        'payload',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'provider' => \App\Enums\PaymentProvider::class,
            'status' => \App\Enums\PaymentStatus::class,
            'payload' => 'array',
            'verified_at' => 'datetime',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function quote(): BelongsTo
    {
        return $this->belongsTo(PricingQuote::class, 'pricing_quote_id');
    }

    public function batch(): BelongsTo
    {
        return $this->belongsTo(CertificateBatch::class, 'certificate_batch_id');
    }
}
