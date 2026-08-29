<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MerkleAnchor extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'certificate_batch_id',
        'hash_algorithm',
        'merkle_version',
        'leaf_count',
        'merkle_root',
        'status',
        'network',
        'chain_id',
        'contract_address',
        'transaction_hash',
        'block_number',
        'failure_reason',
        'submitted_at',
        'confirmed_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => \App\Enums\BlockchainStatus::class,
            'submitted_at' => 'datetime',
            'confirmed_at' => 'datetime',
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

    public function blockchainRecords(): HasMany
    {
        return $this->hasMany(CertificateBlockchainRecord::class);
    }
}
