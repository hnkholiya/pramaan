<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'certificate_batch_id',
        'batch_record_id',
        'document_template_id',
        'document_template_version_id',
        'certificate_number',
        'recipient_data',
        'pdf_path',
        'pdf_hash',
        'verification_token',
        'status',
        'issued_at',
    ];

    protected function casts(): array
    {
        return [
            'recipient_data' => 'array',
            'status' => \App\Enums\CertificateStatus::class,
            'issued_at' => 'datetime',
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

    public function batchRecord(): BelongsTo
    {
        return $this->belongsTo(BatchRecord::class, 'batch_record_id');
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(DocumentTemplate::class, 'document_template_id');
    }

    public function templateVersion(): BelongsTo
    {
        return $this->belongsTo(DocumentTemplateVersion::class, 'document_template_version_id');
    }

    public function blockchainRecord(): HasOne
    {
        return $this->hasOne(CertificateBlockchainRecord::class);
    }

    public function getVerificationUrlAttribute(): string
    {
        return route('public.verify.show', ['token' => $this->verification_token]);
    }
}
