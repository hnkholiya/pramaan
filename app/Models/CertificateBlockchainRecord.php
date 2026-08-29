<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CertificateBlockchainRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'certificate_id',
        'merkle_anchor_id',
        'leaf_hash',
        'proof',
        'merkle_root',
    ];

    protected function casts(): array
    {
        return [
            'proof' => 'array',
        ];
    }

    public function certificate(): BelongsTo
    {
        return $this->belongsTo(Certificate::class);
    }

    public function merkleAnchor(): BelongsTo
    {
        return $this->belongsTo(MerkleAnchor::class);
    }
}
