<?php

namespace App\Services;

use App\Models\Certificate;
use App\Models\DocumentTemplateVersion;
use Barryvdh\DomPDF\Facade\Pdf;
use RuntimeException;

class PdfService
{
    public function __construct(
        private QrCodeService $qrCode,
        private StorageService $storage,
    ) {}

    /**
     * Generate the certificate PDF binary for a certificate.
     *
     * The PDF is rendered from the immutable template-version snapshot
     * plus certificate/recipient data.
     */
    public function generate(
        DocumentTemplateVersion $version,
        Certificate $certificate
    ): string {
        $snapshot = $version->snapshot ?? [];

        $width = (int) (
            $snapshot['template']['canvas_width']
            ?? $version->canvas_width
        );

        $height = (int) (
            $snapshot['template']['canvas_height']
            ?? $version->canvas_height
        );

        if ($width <= 0 || $height <= 0) {
            throw new RuntimeException(
                'Template canvas dimensions are invalid.'
            );
        }

        $values = $this->resolveValues(
            $snapshot,
            $certificate
        );

        $html = $this->buildHtml(
            $snapshot,
            $values,
            $width,
            $height
        );

        try {
            $pdf = Pdf::setPaper([
                0,
                0,
                $width,
                $height,
            ]);

            $pdf->loadHTML($html);

            return $pdf->output();
        } catch (\Throwable $e) {
            throw new RuntimeException(
                'PDF generation failed: ' . $e->getMessage(),
                0,
                $e
            );
        }
    }

    /**
     * Resolve the rendered value for every element type.
     */
    private function resolveValues(
        array $snapshot,
        Certificate $certificate
    ): array {
        $values = [];

        $recipient = $certificate->recipient_data ?? [];

        foreach ($snapshot['elements'] ?? [] as $element) {
            $value = '';

            switch ($element['type'] ?? '') {
                case 'TEXT':
                    $value =
                        $element['config']['text']
                        ?? $element['name']
                        ?? '';
                    break;

                case 'DYNAMIC_FIELD':
                    $dataKey =
                        $element['data_key']
                        ?? '';

                    $value =
                        $recipient[$dataKey]
                        ?? ($element['config']['default'] ?? '');
                    break;

                case 'CERTIFICATE_NUMBER':
                    $value =
                        $certificate->certificate_number;
                    break;

                case 'VERIFICATION_URL':
                    $value =
                        $certificate->verification_url;
                    break;

                case 'QR_CODE':
                    $payload =
                        $element['config']['payload']
                        ?? 'verification_url';

                    $url =
                        $payload === 'verification_url'
                        ? $certificate->verification_url
                        : $certificate->certificate_number;

                    $value = $this->qrCode->dataUri(
                        $url,
                        (int) (
                            $element['config']['size']
                            ?? 120
                        )
                    );
                    break;

                case 'IMAGE':
                    $value =
                        $element['config']['src']
                        ?? '';
                    break;
            }

            $values[$element['name'] ?? uniqid('element_', true)] = [
                'value' => $value,
                'element' => $element,
            ];
        }

        return $values;
    }

    /**
     * Build complete HTML document for DomPDF.
     */
    private function buildHtml(
        array $snapshot,
        array $values,
        int $width,
        int $height
    ): string {
        $blocks = '';

        /*
         * ---------------------------------------------------------------
         * Uploaded template background
         * ---------------------------------------------------------------
         */
        $background = '';

        $asset = $snapshot['template']['asset'] ?? null;

        if (
            is_array($asset)
            && ($asset['type'] ?? null) === 'image'
            && ! empty($asset['path'])
            && ! empty($asset['mime_type'])
        ) {
            $dataUri = $this->assetDataUri(
                $asset['path'],
                $asset['mime_type']
            );

            if ($dataUri !== null) {
                $background =
                    '<img '
                    . 'src="' . $dataUri . '" '
                    . 'style="'
                    . 'position:absolute; '
                    . 'left:0; '
                    . 'top:0; '
                    . 'width:' . $width . 'px; '
                    . 'height:' . $height . 'px; '
                    . 'z-index:0; '
                    . 'display:block; '
                    . '" '
                    . 'alt="" '
                    . '/>';
            }
        }

        /*
         * ---------------------------------------------------------------
         * Dynamic/template elements
         * ---------------------------------------------------------------
         */
        foreach ($values as $row) {
            $el = $row['element'];
            $value = $row['value'];

            $pos = $el['position'] ?? [
                'x' => 0,
                'y' => 0,
            ];

            $size = $el['size'] ?? [
                'width' => 200,
                'height' => 40,
            ];

            $styles = $el['styles'] ?? [];

            $style = [
                'position: absolute',
                'left: ' . (int) ($pos['x'] ?? 0) . 'px',
                'top: ' . (int) ($pos['y'] ?? 0) . 'px',
                'width: ' . (int) ($size['width'] ?? 200) . 'px',
                'height: ' . (int) ($size['height'] ?? 40) . 'px',
                'font-size: ' . (
                    (int) ($styles['font_size'] ?? 18)
                ) . 'px',
                'color: ' . (
                    $styles['color'] ?? '#000000'
                ),
                'text-align: ' . (
                    $styles['align'] ?? 'left'
                ),
                'z-index: 10',
            ];

            if (
                ($styles['font_family'] ?? '') !== ''
            ) {
                $style[] =
                    'font-family: '
                    . $styles['font_family'];
            }

            if (! empty($styles['bold'])) {
                $style[] =
                    'font-weight: bold';
            }

            if (! empty($styles['italic'])) {
                $style[] =
                    'font-style: italic';
            }

            $inline = implode(
                '; ',
                $style
            );

            if (
                ($el['type'] ?? '') === 'QR_CODE'
            ) {
                if ($value !== '') {
                    $safeSrc = htmlspecialchars(
                        $value,
                        ENT_QUOTES
                    );

                    $blocks .=
                        "<div style=\"{$inline}; overflow:hidden;\">"
                        . "<img "
                        . "style=\""
                        . "width:100%; "
                        . "height:100%; "
                        . "object-fit:contain;"
                        . "\" "
                        . "src=\"{$safeSrc}\" "
                        . "alt=\"QR Code\" />"
                        . '</div>';
                }

                continue;
            }

            if (
                ($el['type'] ?? '') === 'IMAGE'
            ) {
                if ($value !== '') {
                    $safeSrc = htmlspecialchars(
                        $value,
                        ENT_QUOTES
                    );

                    $blocks .=
                        "<div style=\"{$inline}; overflow:hidden;\">"
                        . "<img "
                        . "style=\""
                        . "width:100%; "
                        . "height:100%; "
                        . "object-fit:contain;"
                        . "\" "
                        . "src=\"{$safeSrc}\" "
                        . "alt=\"\" />"
                        . '</div>';
                }

                continue;
            }

            $display = htmlspecialchars(
                (string) $value,
                ENT_QUOTES
            );

            $blocks .=
                "<div style=\"{$inline}; overflow:hidden;\">"
                . $display
                . '</div>';
        }

        return
            '<!DOCTYPE html>'
            . '<html>'
            . '<head>'
            . '<meta charset="UTF-8">'
            . '<style>'
            . 'html, body { margin:0; padding:0; }'
            . '* { box-sizing:border-box; }'
            . '</style>'
            . '</head>'
            . '<body '
            . 'style="'
            . 'margin:0; '
            . 'padding:0; '
            . 'width:' . $width . 'px; '
            . 'height:' . $height . 'px; '
            . 'position:relative; '
            . 'overflow:hidden; '
            . 'background:#ffffff;'
            . '">'
            . $background
            . $blocks
            . '</body>'
            . '</html>';
    }

    /**
     * Convert a stored asset into a DomPDF-compatible data URI.
     */
    private function assetDataUri(
        string $path,
        string $mimeType
    ): ?string {
        try {
            $content = $this->storage->getTemplateAsset(
                $path
            );

            if (
                $content === null ||
                $content === ''
            ) {
                return null;
            }

            return 'data:' .
                $mimeType .
                ';base64,' .
                base64_encode($content);
        } catch (\Throwable) {
            return null;
        }
    }
}
