<?php

namespace App\Services;

use App\Enums\ActivityAction;
use App\Enums\TemplateStatus;
use App\Models\Certificate;
use App\Models\DocumentTemplate;
use App\Models\DocumentTemplateVersion;
use App\Models\Organization;
use App\Models\TemplateElement;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TemplateService
{
    public function __construct(
        private ActivityLogService $activityLog,
    ) {}

    public function create(Organization $organization, array $data): DocumentTemplate
    {
        return DB::transaction(function () use ($organization, $data) {
            $template = DocumentTemplate::create([
                'organization_id' => $organization->id,
                'name' => $data['name'],
                'slug' => $this->uniqueSlug($organization, $data['name']),
                'description' => $data['description'] ?? null,
                'canvas_width' => $data['canvas_width'] ?? 1200,
                'canvas_height' => $data['canvas_height'] ?? 850,
                'orientation' => $data['orientation'] ?? 'landscape',
                'status' => TemplateStatus::Draft->value,
            ]);

            foreach ($data['elements'] ?? [] as $sort => $element) {
                $this->addElement($template, $element, $sort);
            }

            // Always create version 1 (frozen snapshot) so certificates
            // always reference an immutable version.
            $this->createVersion($template, activate: true);

            $this->activityLog->log(ActivityAction::TemplateCreated, $organization->id, subject: $template);

            return $template;
        });
    }

    public function update(DocumentTemplate $template, array $data): DocumentTemplate
    {
        $template->update($data);

        $this->activityLog->log(ActivityAction::TemplateUpdated, $template->organization_id, subject: $template);

        return $template;
    }

    public function uniqueSlug(Organization $organization, string $name): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i = 1;
        while (DocumentTemplate::where('organization_id', $organization->id)->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }

    public function addElement(DocumentTemplate $template, array $data, int $sortOrder = 0): TemplateElement
    {
        return TemplateElement::create([
            'document_template_id' => $template->id,
            'type' => $data['type'],
            'name' => $data['name'] ?? $data['type'],
            'data_key' => $data['data_key'] ?? null,
            'config' => $data['config'] ?? null,
            'position' => $data['position'] ?? ['x' => 50, 'y' => 50],
            'size' => $data['size'] ?? ['width' => 200, 'height' => 40],
            'styles' => $data['styles'] ?? null,
            'sort_order' => $data['sort_order'] ?? $sortOrder,
        ]);
    }

    public function updateElement(TemplateElement $element, array $data): TemplateElement
    {
        $element->update($data);

        return $element;
    }

    public function removeElement(TemplateElement $element): void
    {
        $element->delete();
    }

    /**
     * Replaces the full working set of elements for a template.
     */
    public function replaceElements(DocumentTemplate $template, array $elements): void
    {
        $template->elements()->delete();

        foreach (array_values($elements) as $sort => $element) {
            $this->addElement($template, $element, $sort);
        }
    }

    /**
     * Save the layout. If the template has already been used to issue
     * certificates, we must NOT alter historical snapshots: create a new
     * version instead.
     */
    public function saveLayout(DocumentTemplate $template): DocumentTemplateVersion
    {
        if ($this->hasBeenUsed($template)) {
            return $this->createVersion($template, activate: true);
        }

        $version = $template->activeVersion() ?? $this->createVersion($template, activate: true);
        $version->snapshot = $this->buildSnapshot($template);
        $version->save();

        return $version;
    }

    /**
     * Freezes the current layout into a new immutable version.
     */
    public function createVersion(DocumentTemplate $template, bool $activate = true): DocumentTemplateVersion
    {
        return DB::transaction(function () use ($template, $activate) {
            if ($activate) {
                $template->versions()->update(['is_active' => false]);
            }

            $next = ($template->versions()->max('version') ?? 0) + 1;

            $version = DocumentTemplateVersion::create([
                'document_template_id' => $template->id,
                'version' => $next,
                'canvas_width' => $template->canvas_width,
                'canvas_height' => $template->canvas_height,
                'orientation' => $template->orientation,
                'snapshot' => $this->buildSnapshot($template),
                'is_active' => $activate,
            ]);

            $this->activityLog->log(ActivityAction::TemplateVersionCreated, $template->organization_id, subject: $version);

            return $version;
        });
    }

    /**
     * The frozen JSON snapshot used by certificate generation.
     * Contains the canvas + all current element definitions.
     */
    public function buildSnapshot(DocumentTemplate $template): array
    {
        return [
            'template' => [
                'id' => $template->id,
                'name' => $template->name,
                'slug' => $template->slug,
                'canvas_width' => $template->canvas_width,
                'canvas_height' => $template->canvas_height,
                'orientation' => $template->orientation,
            ],
            'elements' => $template->elements()
                ->orderBy('sort_order')
                ->get()
                ->map(fn (TemplateElement $e) => [
                    'type' => $e->type->value,
                    'name' => $e->name,
                    'data_key' => $e->data_key,
                    'config' => $e->config,
                    'position' => $e->position,
                    'size' => $e->size,
                    'styles' => $e->styles,
                    'sort_order' => $e->sort_order,
                ])
                ->values()
                ->all(),
        ];
    }

    public function hasBeenUsed(DocumentTemplate $template): bool
    {
        return Certificate::where('document_template_id', $template->id)->exists();
    }

    public function delete(DocumentTemplate $template): void
    {
        $this->activityLog->log(ActivityAction::TemplateDeleted, $template->organization_id, subject: $template);
        $template->delete();
    }
}
