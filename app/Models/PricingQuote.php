<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PricingQuote extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'certificate_batch_id',
        'currency',
        'price_per_certificate',
        'certificate_count',
        'subtotal',
        'tax_rate',
        'tax',
        'total',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => \App\Enums\QuoteStatus::class,
            'price_per_certificate' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'tax' => 'decimal:2',
            'total' => 'decimal:2',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function batch(): BelongsTo
    {
        return $this->belongsTo(CertificateBatch::class, 'certificate_batch_id');
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }
}
