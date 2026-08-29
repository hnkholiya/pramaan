<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class BatchRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'certificate_batch_id',
        'row_number',
        'source_data',
        'validation_errors',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'source_data' => 'array',
            'validation_errors' => 'array',
            'status' => \App\Enums\BatchRecordStatus::class,
        ];
    }

    public function batch(): BelongsTo
    {
        return $this->belongsTo(CertificateBatch::class, 'certificate_batch_id');
    }

    public function certificate(): HasOne
    {
        return $this->hasOne(Certificate::class);
    }
}
