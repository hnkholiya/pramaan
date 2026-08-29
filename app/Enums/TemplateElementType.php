<?php

namespace App\Enums;

enum TemplateElementType: string
{
    case Text = 'TEXT';
    case DynamicField = 'DYNAMIC_FIELD';
    case Image = 'IMAGE';
    case CertificateNumber = 'CERTIFICATE_NUMBER';
    case VerificationUrl = 'VERIFICATION_URL';
    case QrCode = 'QR_CODE';

    public function label(): string
    {
        return match ($this) {
            self::Text => 'Text',
            self::DynamicField => 'Dynamic Field',
            self::Image => 'Image',
            self::CertificateNumber => 'Certificate Number',
            self::VerificationUrl => 'Verification URL',
            self::QrCode => 'QR Code',
        };
    }

    /** @return string[] */
    public static function values(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
}
