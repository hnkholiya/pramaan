<?php

namespace App\Services;

use App\Enums\ActivityAction;
use App\Enums\TemplateStatus;
use App\Models\DocumentTemplate;
use App\Models\Organization;
use App\Models\TemplateAsset;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class TemplateImportService
{
    public function __construct(
        private TemplateService $templateService,
        private ActivityLogService $activityLog,
        private StorageService $storage,
    ) {}

    public function import(
        Organization $organization,
        string $name,
        ?string $description,
        string $orientation,
        UploadedFile $file,
    ): DocumentTemplate {
        return DB::transaction(function () use (
            $organization,
            $name,
            $description,
            $orientation,
            $file
        ) {
            [$width, $height] = $this->detectDimensions(
                $file,
                $orientation
            );

            $template = DocumentTemplate::create([
                'organization_id' => $organization->id,
                'name' => $name,
                'slug' => $this->templateService->uniqueSlug(
                    $organization,
                    $name
                ),
                'description' => $description,
                'canvas_width' => $width,
                'canvas_height' => $height,
                'orientation' => $orientation,
                'status' => TemplateStatus::Draft->value,
            ]);

            $filename = $file->hashName();

            $storedPath =
                'template-assets/' .
                $organization->id .
                '/' .
                $filename;

            $contents = file_get_contents(
                $file->getRealPath()
            );

            $this->storage->storeTemplateAsset(
                $storedPath,
                $contents
            );

            $mime = $file->getMimeType()
                ?? 'application/octet-stream';

            $type = $mime === 'application/pdf'
                ? 'pdf'
                : 'image';

            $asset = TemplateAsset::create([
                'document_template_id' => $template->id,
                'type' => $type,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $mime,
                'file_size' => $file->getSize(),
                'path' => $storedPath,
                'width' => $width,
                'height' => $height,
                'is_active' => true,
            ]);

            $this->activityLog->log(
                ActivityAction::TemplateCreated,
                $organization->id,
                subject: $template,
                metadata: [
                    'source' => 'uploaded',
                    'asset_id' => $asset->id,
                    'file' => $asset->original_name,
                ]
            );

            $this->templateService->createVersion(
                $template,
                activate: true
            );

            return $template->fresh();
        });
    }

    private function detectDimensions(
        UploadedFile $file,
        string $orientation
    ): array {
        $mime = $file->getMimeType();

        if (
            $mime === 'image/png' ||
            $mime === 'image/jpeg'
        ) {
            $dimensions = @getimagesize(
                $file->getRealPath()
            );

            if (
                is_array($dimensions) &&
                isset($dimensions[0], $dimensions[1])
            ) {
                return [
                    (int) $dimensions[0],
                    (int) $dimensions[1],
                ];
            }
        }

        /*
         * For SVG/PDF we keep a stable certificate canvas.
         * The uploaded document remains the source asset.
         */
        return $orientation === 'portrait'
            ? [850, 1200]
            : [1200, 850];
    }
}
