<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateElement extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_template_id',
        'type',
        'name',
        'data_key',
        'config',
        'position',
        'size',
        'styles',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'type' => \App\Enums\TemplateElementType::class,
            'config' => 'array',
            'position' => 'array',
            'size' => 'array',
            'styles' => 'array',
        ];
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(DocumentTemplate::class, 'document_template_id');
    }
}
