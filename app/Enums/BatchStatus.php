<?php

namespace App\Enums;

enum BatchStatus: string
{
    case Draft = 'draft';
    case Uploaded = 'uploaded';
    case Validated = 'validated';
    case Mapped = 'mapped';
    case Quoted = 'quoted';
    case PaymentPending = 'payment_pending';
    case Paid = 'paid';
    case Processing = 'processing';
    case Completed = 'completed';
    case Failed = 'failed';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Uploaded => 'Uploaded',
            self::Validated => 'Validated',
            self::Mapped => 'Mapped',
            self::Quoted => 'Quoted',
            self::PaymentPending => 'Payment Pending',
            self::Paid => 'Paid',
            self::Processing => 'Processing',
            self::Completed => 'Completed',
            self::Failed => 'Failed',
        };
    }
}
