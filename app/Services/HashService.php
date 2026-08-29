<?php

namespace App\Services;

/**
 * Document integrity hashing.
 *
 * The SHA-256 hash always represents the exact stored document bytes,
 * never merely source metadata.
 */
class HashService
{
    public const ALGORITHM = 'sha256';

    public function hashString(string $content): string
    {
        return hash(self::ALGORITHM, $content);
    }

    public function hashFile(string $path): string
    {
        return hash_file(self::ALGORITHM, $path);
    }

    public function hashBinary(string $content): string
    {
        return hash(self::ALGORITHM, $content);
    }
}
