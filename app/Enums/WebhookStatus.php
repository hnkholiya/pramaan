<?php

namespace App\Enums;

enum WebhookStatus: string
{
    case Received = 'received';
    case Processed = 'processed';
    case Failed = 'failed';
    case Duplicate = 'duplicate';

    public function label(): string
    {
        return match ($this) {
            self::Received => 'Received',
            self::Processed => 'Processed',
            self::Failed => 'Failed',
            self::Duplicate => 'Duplicate',
        };
    }
}
