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

    /*
    |--------------------------------------------------------------------------
    | Design Elements
    |--------------------------------------------------------------------------
    |
    | These are optional visual primitives used to create richer certificate
    | designs. Existing element types remain fully backward compatible.
    |
    */

    case Rectangle = 'RECTANGLE';
    case Line = 'LINE';
    case Background = 'BACKGROUND';
    case Decoration = 'DECORATION';

    public function label(): string
    {
        return match ($this) {
            self::Text => 'Text',
            self::DynamicField => 'Dynamic Field',
            self::Image => 'Image',
            self::CertificateNumber => 'Certificate Number',
            self::VerificationUrl => 'Verification URL',
            self::QrCode => 'QR Code',

            self::Rectangle => 'Rectangle',
            self::Line => 'Line',
            self::Background => 'Background',
            self::Decoration => 'Decoration',
        };
    }

    /** @return string[] */
    public static function values(): array
    {
        return array_map(
            fn ($case) => $case->value,
            self::cases()
        );
    }
}