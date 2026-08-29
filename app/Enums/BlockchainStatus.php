<?php

namespace App\Enums;

enum BlockchainStatus: string
{
    case Pending = 'pending';
    case Submitted = 'submitted';
    case Confirming = 'confirming';
    case Confirmed = 'confirmed';
    case Failed = 'failed';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Submitted => 'Submitted',
            self::Confirming => 'Confirming',
            self::Confirmed => 'Confirmed',
            self::Failed => 'Failed',
        };
    }
}
