<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class DocumentTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'name',
        'slug',
        'description',
        'canvas_width',
        'canvas_height',
        'orientation',
        'thumbnail_path',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => \App\Enums\TemplateStatus::class,
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function versions(): HasMany
    {
        return $this->hasMany(DocumentTemplateVersion::class)->orderBy('version');
    }

    public function activeVersion(): ?DocumentTemplateVersion
    {
        return $this->versions()->where('is_active', true)->first();
    }

    public function elements(): HasMany
    {
        return $this->hasMany(TemplateElement::class)->orderBy('sort_order');
    }

    public function activeAsset(): HasOne
    {
        return $this->hasOne(TemplateAsset::class)
            ->where('is_active', true);
    }
}
