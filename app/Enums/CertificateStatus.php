<?php

namespace App\Enums;

enum CertificateStatus: string
{
    case Generated = 'generated';
    case Issued = 'issued';
    case Revoked = 'revoked';

    public function label(): string
    {
        return match ($this) {
            self::Generated => 'Generated',
            self::Issued => 'Issued',
            self::Revoked => 'Revoked',
        };
    }
}
