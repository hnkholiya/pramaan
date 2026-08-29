<?php

namespace App\Services;

use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;

class StorageService
{
    /**
     * Certificate documents.
     */
    public const CERTIFICATES_DISK = 'certificates';

    /**
     * Uploaded template assets.
     */
    public const TEMPLATE_ASSETS_DISK = 'local';

    private function disk(string $diskName): FilesystemAdapter
    {
        return Storage::disk($diskName);
    }

    /*
    |--------------------------------------------------------------------------
    | Certificate Storage
    |--------------------------------------------------------------------------
    */

    public function store(
        string $relativePath,
        string $contents
    ): bool {
        return $this->disk(
            self::CERTIFICATES_DISK
        )->put(
            $relativePath,
            $contents
        );
    }

    public function exists(
        string $relativePath
    ): bool {
        return $this->disk(
            self::CERTIFICATES_DISK
        )->exists($relativePath);
    }

    public function get(
        string $relativePath
    ): ?string {
        $disk = $this->disk(
            self::CERTIFICATES_DISK
        );

        return $disk->exists($relativePath)
            ? $disk->get($relativePath)
            : null;
    }

    public function delete(
        string $relativePath
    ): bool {
        return $this->disk(
            self::CERTIFICATES_DISK
        )->delete($relativePath);
    }

    public function url(
        string $relativePath
    ): string {
        return $this->disk(
            self::CERTIFICATES_DISK
        )->url($relativePath);
    }

    public function path(
        string $relativePath
    ): string {
        return $this->disk(
            self::CERTIFICATES_DISK
        )->path($relativePath);
    }

    /*
    |--------------------------------------------------------------------------
    | Template Asset Storage
    |--------------------------------------------------------------------------
    */

    public function storeTemplateAsset(
        string $relativePath,
        string $contents
    ): bool {
        return $this->disk(
            self::TEMPLATE_ASSETS_DISK
        )->put(
            $relativePath,
            $contents
        );
    }

    public function templateAssetExists(
        string $relativePath
    ): bool {
        return $this->disk(
            self::TEMPLATE_ASSETS_DISK
        )->exists($relativePath);
    }

    public function getTemplateAsset(
        string $relativePath
    ): ?string {
        $disk = $this->disk(
            self::TEMPLATE_ASSETS_DISK
        );

        return $disk->exists($relativePath)
            ? $disk->get($relativePath)
            : null;
    }

    public function deleteTemplateAsset(
        string $relativePath
    ): bool {
        return $this->disk(
            self::TEMPLATE_ASSETS_DISK
        )->delete($relativePath);
    }

    public function templateAssetPath(
        string $relativePath
    ): string {
        return $this->disk(
            self::TEMPLATE_ASSETS_DISK
        )->path($relativePath);
    }
}