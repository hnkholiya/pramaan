<?php

namespace App\Services;

use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Facades\Storage;

/**
 * Centralizes all certificate document storage.
 * Documents never live in a publicly writable directory.
 */
class StorageService
{
    public const DISK = 'certificates';

    private function disk(): Filesystem
    {
        return Storage::disk(self::DISK);
    }

    public function store(string $relativePath, string $contents): bool
    {
        return $this->disk()->put($relativePath, $contents);
    }

    public function exists(string $relativePath): bool
    {
        return $this->disk()->exists($relativePath);
    }

    public function get(string $relativePath): ?string
    {
        return $this->disk()->exists($relativePath) ? $this->disk()->get($relativePath) : null;
    }

    public function delete(string $relativePath): bool
    {
        return $this->disk()->delete($relativePath);
    }

    public function url(string $relativePath): string
    {
        return $this->disk()->url($relativePath);
    }

    public function path(string $relativePath): string
    {
        return $this->disk()->path($relativePath);
    }
}
