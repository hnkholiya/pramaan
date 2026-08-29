<?php

namespace App\Enums;

enum BatchRecordStatus: string
{
    case Pending = 'pending';
    case Valid = 'valid';
    case Invalid = 'invalid';
    case Generated = 'generated';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Valid => 'Valid',
            self::Invalid => 'Invalid',
            self::Generated => 'Generated',
        };
    }
}
