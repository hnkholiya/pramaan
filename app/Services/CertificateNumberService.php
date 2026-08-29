<?php

namespace App\Services;

use App\Models\Certificate;

/**
 * Generates unique, human-friendly certificate numbers.
 *
 * Uniqueness is enforced both here and by a DB unique constraint.
 * Format: PRM-<YEAR><MONTH>-<8 random alphanumeric> (e.g. PRM-202608-3F9A2C7B1D)
 */
class CertificateNumberService
{
    public function generate(): string
    {
        do {
            $number = sprintf(
                'PRM-%s-%s',
                now()->format('Ym'),
                strtoupper(substr(bin2hex(random_bytes(8)), 0, 10)),
            );
        } while (Certificate::where('certificate_number', $number)->exists());

        return $number;
    }
}
