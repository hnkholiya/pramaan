<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BatchFieldMapping extends Model
{
    use HasFactory;

    protected $fillable = [
        'certificate_batch_id',
        'mapping',
        'mapped_by',
    ];

    protected function casts(): array
    {
        return [
            'mapping' => 'array',
        ];
    }

    public function batch(): BelongsTo
    {
        return $this->belongsTo(CertificateBatch::class, 'certificate_batch_id');
    }
}
