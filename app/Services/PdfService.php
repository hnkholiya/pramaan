<?php

namespace App\Services;

use App\Models\Certificate;
use App\Models\DocumentTemplateVersion;
use Barryvdh\DomPDF\Facade\Pdf;
use RuntimeException;

/**
 * Centralized certificate PDF generation.
 *
 * A PDF always represents an immutable template-version snapshot plus the
 * recipient data. Rendering logic lives here, never in controllers.
 */
class PdfService
{
    public function __construct(
        private QrCodeService $qrCode,
    ) {}

    /**
     * Generate the certificate PDF binary for a certificate.
     */
    public function generate(DocumentTemplateVersion $version, Certificate $certificate): string
    {
        $snapshot = $version->snapshot;
        $width = $snapshot['template']['canvas_width'] ?? $version->canvas_width;
        $height = $snapshot['template']['canvas_height'] ?? $version->canvas_height;

        $values = $this->resolveValues($snapshot, $certificate);

        $html = $this->buildHtml($snapshot, $values, $width, $height);

        try {
            $pdf = Pdf::setPaper([0, 0, (int) $width, (int) $height]);
            $pdf->loadHTML($html);

            return $pdf->output();
        } catch (\Throwable $e) {
            throw new RuntimeException('PDF generation failed: '.$e->getMessage(), 0, $e);
        }
    }

    /**
     * Resolve the rendered value for every element type.
     */
    private function resolveValues(array $snapshot, Certificate $certificate): array
    {
        $values = [];
        $recipient = $certificate->recipient_data ?? [];

        foreach ($snapshot['elements'] as $element) {
            $value = '';
            switch ($element['type']) {
                case 'TEXT':
                    $value = $element['config']['text'] ?? $element['name'] ?? '';
                    break;
                case 'DYNAMIC_FIELD':
                    $value = $recipient[$element['data_key'] ?? ''] ?? ($element['config']['default'] ?? '');
                    break;
                case 'CERTIFICATE_NUMBER':
                    $value = $certificate->certificate_number;
                    break;
                case 'VERIFICATION_URL':
                    $value = $certificate->verification_url;
                    break;
                case 'QR_CODE':
                    $payload = $element['config']['payload'] ?? 'verification_url';
                    $url = ($payload === 'verification_url') ? $certificate->verification_url : $certificate->certificate_number;
                    $value = $this->qrCode->dataUri($url, (int) ($element['config']['size'] ?? 120));
                    break;
                case 'IMAGE':
                    $value = $element['config']['src'] ?? '';
                    break;
            }
            $values[$element['name']] = ['value' => $value, 'element' => $element];
        }

        return $values;
    }

    private function buildHtml(array $snapshot, array $values, int $width, int $height): string
    {
        $blocks = '';
        $org = $snapshot['template']['name'] ?? '';

        foreach ($values as $name => $row) {
            $el = $row['element'];
            $value = $row['value'];
            $pos = $el['position'] ?? ['x' => 0, 'y' => 0];
            $size = $el['size'] ?? ['width' => 200, 'height' => 40];
            $styles = $el['styles'] ?? [];

            $style = [
                'position: absolute',
                'left: '.(int) ($pos['x'] ?? 0).'px',
                'top: '.(int) ($pos['y'] ?? 0).'px',
                'width: '.(int) ($size['width'] ?? 200).'px',
                'height: '.(int) ($size['height'] ?? 40).'px',
                'font-size: '.((int) ($styles['font_size'] ?? 18)).'px',
                'color: '.($styles['color'] ?? '#000000'),
                'text-align: '.($styles['align'] ?? 'left'),
            ];

            if (($styles['font_family'] ?? '') !== '') {
                $style[] = 'font-family: '.$styles['font_family'];
            }
            if (! empty($styles['bold'])) {
                $style[] = 'font-weight: bold';
            }
            if (! empty($styles['italic'])) {
                $style[] = 'font-style: italic';
            }

            $inline = implode('; ', $style);

            if ($el['type'] === 'QR_CODE') {
                if ($value !== '') {
                    $blocks .= "<div style=\"{$inline}; overflow: hidden;\">"
                        ."<img style=\"width:100%; height:100%; object-fit: contain;\" src=\"{$value}\" />"
                        .'</div>';
                }
            } elseif ($el['type'] === 'IMAGE') {
                if ($value !== '') {
                    $blocks .= "<div style=\"{$inline}; overflow: hidden;\">"
                        ."<img style=\"width:100%; height:100%; object-fit: contain;\" src=\"{$value}\" />"
                        .'</div>';
                }
            } else {
                $display = $value;
                // Keep verification URL readable but allow wrapping.
                if ($el['type'] === 'VERIFICATION_URL') {
                    $display = htmlspecialchars($display, ENT_QUOTES);
                } else {
                    $display = htmlspecialchars((string) $display, ENT_QUOTES);
                }
                $blocks .= "<div style=\"{$inline}; overflow: hidden;\">{$display}</div>";
            }
        }

        $escapedOrg = htmlspecialchars((string) $org, ENT_QUOTES);

        return "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"></head>"
            ."<body style=\"margin:0; padding:0; width:{$width}px; height:{$height}px; position:relative; overflow:hidden; background:#ffffff;\">"
            .$blocks
            ."</body></html>";
    }
}
