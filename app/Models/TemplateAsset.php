<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class TemplateAsset extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_template_id',
        'type',
        'original_name',
        'mime_type',
        'file_size',
        'path',
        'page_count',
        'width',
        'height',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'file_size' => 'integer',
            'page_count' => 'integer',
            'width' => 'integer',
            'height' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(
            DocumentTemplate::class,
            'document_template_id'
        );
    }

    public function activeAsset(): HasOne
    {
        return $this->hasOne(TemplateAsset::class)
            ->where('is_active', true);
    }
}
