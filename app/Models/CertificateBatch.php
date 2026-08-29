<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CertificateBatch extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'document_template_id',
        'document_template_version_id',
        'source_file_name',
        'source_file_path',
        'original_headers',
        'total_records',
        'valid_records',
        'invalid_records',
        'price_per_certificate',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'original_headers' => 'array',
            'status' => \App\Enums\BatchStatus::class,
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(DocumentTemplate::class, 'document_template_id');
    }

    public function templateVersion(): BelongsTo
    {
        return $this->belongsTo(DocumentTemplateVersion::class, 'document_template_version_id');
    }

    public function records(): HasMany
    {
        return $this->hasMany(BatchRecord::class)->orderBy('row_number');
    }

    public function validRecords(): HasMany
    {
        return $this->records()->where('status', \App\Enums\BatchRecordStatus::Valid->value);
    }

    public function fieldMapping(): HasOne
    {
        return $this->hasOne(BatchFieldMapping::class);
    }

    public function quote(): HasOne
    {
        return $this->hasOne(PricingQuote::class);
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }

    public function merkleAnchor(): HasOne
    {
        return $this->hasOne(MerkleAnchor::class);
    }
}
