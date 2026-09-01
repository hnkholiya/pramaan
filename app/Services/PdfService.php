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
     *
     * Existing element types remain backward compatible.
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
     * Resolve the rendered value for every content element type.
     *
     * Design primitives are rendered directly from their config and do not
     * require certificate data.
     */
    private function resolveValues(
        array $snapshot,
        Certificate $certificate
    ): array {
        $values = [];

        $recipient =
            $certificate->recipient_data ?? [];

        foreach (
            $snapshot['elements'] ?? []
            as $index => $element
        ) {
            $type =
                $element['type'] ?? '';

            $value = '';

            switch ($type) {
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

                    $value =
                        $this->qrCode->dataUri(
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

                /*
                 * Design primitives do not need a resolved value.
                 */
                case 'BACKGROUND':
                case 'RECTANGLE':
                case 'LINE':
                case 'DECORATION':
                    $value = '';
                    break;
            }

            $values[$element['name']
                ?? ('element_' . $index)] = [
                'value' => $value,
                'element' => $element,
            ];
        }

        return $values;
    }

    /**
     * Build complete HTML document for DomPDF.
     *
     * Rendering is split into:
     *
     * 1. Uploaded asset background
     * 2. BACKGROUND design elements
     * 3. RECTANGLE / LINE / DECORATION elements
     * 4. Existing content elements
     */
    private function buildHtml(
        array $snapshot,
        array $values,
        int $width,
        int $height
    ): string {
        $backgroundHtml = '';
        $designHtml = '';
        $contentHtml = '';

        /*
         * ---------------------------------------------------------------
         * Uploaded template background
         * ---------------------------------------------------------------
         */
        $asset =
            $snapshot['template']['asset']
            ?? null;

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
                $safeSrc =
                    htmlspecialchars(
                        $dataUri,
                        ENT_QUOTES
                    );

                $backgroundHtml .=
                    '<img '
                    . 'src="' . $safeSrc . '" '
                    . 'style="'
                    . 'position:absolute;'
                    . 'left:0;'
                    . 'top:0;'
                    . 'width:' . $width . 'px;'
                    . 'height:' . $height . 'px;'
                    . 'z-index:0;'
                    . 'display:block;'
                    . '" '
                    . 'alt=""'
                    . '/>';
            }
        }

        /*
         * ---------------------------------------------------------------
         * Split elements by rendering responsibility.
         * ---------------------------------------------------------------
         */
        $backgroundElements = [];
        $designElements = [];
        $contentElements = [];

        foreach ($values as $row) {
            $element = $row['element'];

            switch ($element['type'] ?? '') {
                case 'BACKGROUND':
                    $backgroundElements[] = $row;
                    break;

                case 'RECTANGLE':
                case 'LINE':
                case 'DECORATION':
                    $designElements[] = $row;
                    break;

                default:
                    $contentElements[] = $row;
                    break;
            }
        }

        /*
         * Preserve explicit layer order.
         */
        usort(
            $backgroundElements,
            fn($a, $b) => ($a['element']['sort_order'] ?? 0)
                <=>
                ($b['element']['sort_order'] ?? 0)
        );

        usort(
            $designElements,
            fn($a, $b) => ($a['element']['sort_order'] ?? 0)
                <=>
                ($b['element']['sort_order'] ?? 0)
        );

        usort(
            $contentElements,
            fn($a, $b) => ($a['element']['sort_order'] ?? 0)
                <=>
                ($b['element']['sort_order'] ?? 0)
        );

        /*
         * ---------------------------------------------------------------
         * BACKGROUND elements
         * ---------------------------------------------------------------
         */
        foreach ($backgroundElements as $row) {
            $el =
                $row['element'];

            $config =
                $el['config'] ?? [];

            $color =
                $this->safeColor(
                    $config['color']
                        ?? '#FFFFFF'
                );

            $backgroundHtml .=
                '<div style="'
                . 'position:absolute;'
                . 'left:0;'
                . 'top:0;'
                . 'width:' . $width . 'px;'
                . 'height:' . $height . 'px;'
                . 'background-color:' . $color . ';'
                . 'z-index:1;'
                . '">'
                . '</div>';
        }

        /*
         * ---------------------------------------------------------------
         * Visual design primitives
         * ---------------------------------------------------------------
         */
        foreach ($designElements as $row) {
            $designHtml .=
                $this->renderDesignElement(
                    $row['element'],
                    $width,
                    $height
                );
        }

        /*
         * ---------------------------------------------------------------
         * Existing content elements
         * ---------------------------------------------------------------
         */
        foreach ($contentElements as $row) {
            $contentHtml .=
                $this->renderContentElement(
                    $row['element'],
                    $row['value']
                );
        }

        return
            '<!DOCTYPE html>'
            . '<html>'
            . '<head>'
            . '<meta charset="UTF-8">'
            . '<style>'
            . 'html, body {'
            . 'margin:0;'
            . 'padding:0;'
            . '}'

            . '* {'
            . 'box-sizing:border-box;'
            . '}'

            . 'body {'
            . 'position:relative;'
            . 'margin:0;'
            . 'padding:0;'
            . 'width:' . $width . 'px;'
            . 'height:' . $height . 'px;'
            . 'overflow:hidden;'
            . 'background:#ffffff;'
            . '}'

            . '</style>'
            . '</head>'

            . '<body>'

            . $backgroundHtml
            . $designHtml
            . $contentHtml

            . '</body>'
            . '</html>';
    }

    /**
     * Render visual primitives.
     */
    private function renderDesignElement(
        array $element,
        int $canvasWidth,
        int $canvasHeight
    ): string {
        $type =
            $element['type']
            ?? '';

        $position =
            $element['position']
            ?? [
                'x' => 0,
                'y' => 0,
            ];

        $size =
            $element['size']
            ?? [
                'width' => 100,
                'height' => 40,
            ];

        $config =
            $element['config']
            ?? [];

        $x = max(
            0,
            (int) ($position['x'] ?? 0)
        );

        $y = max(
            0,
            (int) ($position['y'] ?? 0)
        );

        $elementWidth =
            max(
                1,
                (int) ($size['width'] ?? 100)
            );

        $elementHeight =
            max(
                1,
                (int) ($size['height'] ?? 40)
            );

        /*
         * Clamp to canvas.
         */
        $elementWidth = min(
            $elementWidth,
            max(1, $canvasWidth - $x)
        );

        $elementHeight = min(
            $elementHeight,
            max(1, $canvasHeight - $y)
        );

        switch ($type) {
            case 'RECTANGLE':
                return $this->renderRectangle(
                    $x,
                    $y,
                    $elementWidth,
                    $elementHeight,
                    $config,
                    (int) (
                        $element['sort_order']
                        ?? 0
                    )
                );

            case 'LINE':
                return $this->renderLine(
                    $x,
                    $y,
                    $elementWidth,
                    $elementHeight,
                    $config,
                    (int) (
                        $element['sort_order']
                        ?? 0
                    )
                );

            case 'DECORATION':
                return $this->renderDecoration(
                    $x,
                    $y,
                    $elementWidth,
                    $elementHeight,
                    $config,
                    (int) (
                        $element['sort_order']
                        ?? 0
                    )
                );
        }

        return '';
    }

    /**
     * Render a rectangle / border frame.
     */
    private function renderRectangle(
        int $x,
        int $y,
        int $width,
        int $height,
        array $config,
        int $sortOrder
    ): string {
        $fill =
            $config['fill']
            ?? 'transparent';

        if (
            ! is_string($fill)
            || strtolower(trim($fill))
            === 'transparent'
        ) {
            $fill = 'transparent';
        } else {
            $fill =
                $this->safeColor($fill);
        }

        $borderColor =
            $this->safeColor(
                $config['border_color']
                    ?? '#D4AF37'
            );

        $borderWidth =
            max(
                0,
                min(
                    20,
                    (int) (
                        $config['border_width']
                        ?? 0
                    )
                )
            );

        $radius =
            max(
                0,
                min(
                    100,
                    (int) (
                        $config['radius']
                        ?? 0
                    )
                )
            );

        $style =
            'position:absolute;'
            . 'left:' . $x . 'px;'
            . 'top:' . $y . 'px;'
            . 'width:' . $width . 'px;'
            . 'height:' . $height . 'px;'
            . 'background-color:' . $fill . ';'
            . 'border:'
            . $borderWidth
            . 'px solid '
            . $borderColor
            . ';'
            . 'border-radius:'
            . $radius
            . 'px;'
            . 'z-index:'
            . (20 + $sortOrder)
            . ';';

        return
            '<div style="'
            . $style
            . '"></div>';
    }

    /**
     * Render horizontal / vertical line.
     */
    private function renderLine(
        int $x,
        int $y,
        int $width,
        int $height,
        array $config,
        int $sortOrder
    ): string {
        $orientation =
            strtolower(
                trim(
                    (string) (
                        $config['orientation']
                        ?? 'horizontal'
                    )
                )
            );

        $color =
            $this->safeColor(
                $config['color']
                    ?? '#D4AF37'
            );

        $thickness =
            max(
                1,
                min(
                    20,
                    (int) (
                        $config['thickness']
                        ?? 2
                    )
                )
            );

        if ($orientation === 'vertical') {
            $lineWidth = $thickness;
            $lineHeight = $height;
        } else {
            $lineWidth = $width;
            $lineHeight = $thickness;
        }

        $style =
            'position:absolute;'
            . 'left:' . $x . 'px;'
            . 'top:' . $y . 'px;'
            . 'width:' . $lineWidth . 'px;'
            . 'height:' . $lineHeight . 'px;'
            . 'background-color:' . $color . ';'
            . 'z-index:'
            . (20 + $sortOrder)
            . ';';

        return
            '<div style="'
            . $style
            . '"></div>';
    }

    /**
     * Render decorative visual variants.
     *
     * Uses only basic HTML/CSS shapes so the output remains
     * compatible with DomPDF.
     */
    private function renderDecoration(
        int $x,
        int $y,
        int $width,
        int $height,
        array $config,
        int $sortOrder
    ): string {
        $variant =
            strtolower(
                trim(
                    (string) (
                        $config['variant']
                        ?? 'corner'
                    )
                )
            );

        $color =
            $this->safeColor(
                $config['color']
                    ?? '#D4AF37'
            );

        $secondaryColor =
            $config['secondary_color']
            ?? $color;

        if (
            ! is_string(
                $secondaryColor
            )
        ) {
            $secondaryColor = $color;
        } else {
            $secondaryColor =
                $this->safeColor(
                    $secondaryColor
                );
        }

        $zIndex =
            20 + $sortOrder;

        $base =
            'position:absolute;'
            . 'left:' . $x . 'px;'
            . 'top:' . $y . 'px;'
            . 'width:' . $width . 'px;'
            . 'height:' . $height . 'px;'
            . 'z-index:' . $zIndex . ';';

        switch ($variant) {
            case 'seal':
                return
                    '<div style="'
                    . $base
                    . 'text-align:center;'
                    . '">'

                    . '<div style="'
                    . 'width:'
                    . min(
                        $width,
                        $height
                    ) * 0.82
                    . 'px;'
                    . 'height:'
                    . min(
                        $width,
                        $height
                    ) * 0.82
                    . 'px;'
                    . 'margin:auto;'
                    . 'border:'
                    . '3px solid '
                    . $color
                    . ';'
                    . 'border-radius:50%;'
                    . '">'

                    . '<div style="'
                    . 'width:70%;'
                    . 'height:70%;'
                    . 'margin:15%;'
                    . 'border:1px solid '
                    . $secondaryColor
                    . ';'
                    . 'border-radius:50%;'
                    . 'text-align:center;'
                    . 'font-size:10px;'
                    . 'font-weight:bold;'
                    . 'line-height:'
                    . (
                        min(
                            $width,
                            $height
                        ) * 0.49
                    )
                    . 'px;'
                    . 'color:'
                    . $color
                    . ';'
                    . '">'

                    . 'SEAL'

                    . '</div>'
                    . '</div>'
                    . '</div>';

            case 'divider':
                return
                    '<div style="'
                    . $base
                    . '">'

                    . '<div style="'
                    . 'position:absolute;'
                    . 'left:10%;'
                    . 'right:10%;'
                    . 'top:50%;'
                    . 'height:2px;'
                    . 'background:'
                    . $color
                    . ';'
                    . '"></div>'

                    . '<div style="'
                    . 'position:absolute;'
                    . 'left:50%;'
                    . 'top:50%;'
                    . 'width:10px;'
                    . 'height:10px;'
                    . 'margin-left:-5px;'
                    . 'margin-top:-4px;'
                    . 'background:'
                    . $secondaryColor
                    . ';'
                    . 'transform:rotate(45deg);'
                    . '"></div>'

                    . '</div>';

            case 'ornament':
                return
                    '<div style="'
                    . $base
                    . '">'

                    . '<div style="'
                    . 'position:absolute;'
                    . 'left:20%;'
                    . 'top:20%;'
                    . 'width:60%;'
                    . 'height:60%;'
                    . 'border:2px solid '
                    . $color
                    . ';'
                    . 'transform:rotate(45deg);'
                    . '">'

                    . '<div style="'
                    . 'width:100%;'
                    . 'height:100%;'
                    . 'border:1px solid '
                    . $secondaryColor
                    . ';'
                    . '"></div>'

                    . '</div>'
                    . '</div>';

            case 'double_corner':
                return
                    '<div style="'
                    . $base
                    . '">'

                    . '<div style="'
                    . 'position:absolute;'
                    . 'left:0;'
                    . 'top:0;'
                    . 'width:60%;'
                    . 'height:60%;'
                    . 'border-left:3px solid '
                    . $color
                    . ';'
                    . 'border-top:3px solid '
                    . $color
                    . ';'
                    . '"></div>'

                    . '<div style="'
                    . 'position:absolute;'
                    . 'left:8px;'
                    . 'top:8px;'
                    . 'width:45%;'
                    . 'height:45%;'
                    . 'border-left:1px solid '
                    . $secondaryColor
                    . ';'
                    . 'border-top:1px solid '
                    . $secondaryColor
                    . ';'
                    . '"></div>'

                    . '</div>';

            case 'corner':
            default:
                return
                    '<div style="'
                    . $base
                    . '">'

                    . '<div style="'
                    . 'position:absolute;'
                    . 'left:0;'
                    . 'top:0;'
                    . 'width:100%;'
                    . 'height:100%;'
                    . 'border-left:4px solid '
                    . $color
                    . ';'
                    . 'border-top:4px solid '
                    . $color
                    . ';'
                    . '"></div>'

                    . '<div style="'
                    . 'position:absolute;'
                    . 'left:8px;'
                    . 'top:8px;'
                    . 'width:65%;'
                    . 'height:65%;'
                    . 'border-left:1px solid '
                    . $secondaryColor
                    . ';'
                    . 'border-top:1px solid '
                    . $secondaryColor
                    . ';'
                    . '"></div>'

                    . '</div>';
        }
    }

    /**
     * Render existing content elements.
     *
     * This deliberately preserves the current behavior of TEXT,
     * DYNAMIC_FIELD, CERTIFICATE_NUMBER, VERIFICATION_URL,
     * QR_CODE and IMAGE.
     */
    private function renderContentElement(
        array $element,
        mixed $value
    ): string {
        $position =
            $element['position']
            ?? [
                'x' => 0,
                'y' => 0,
            ];

        $size =
            $element['size']
            ?? [
                'width' => 200,
                'height' => 40,
            ];

        $styles =
            $element['styles']
            ?? [];

        $x =
            max(
                0,
                (int) (
                    $position['x']
                    ?? 0
                )
            );

        $y =
            max(
                0,
                (int) (
                    $position['y']
                    ?? 0
                )
            );

        $width =
            max(
                1,
                (int) (
                    $size['width']
                    ?? 200
                )
            );

        $height =
            max(
                1,
                (int) (
                    $size['height']
                    ?? 40
                )
            );

        $fontSize =
            max(
                6,
                min(
                    120,
                    (int) (
                        $styles['font_size']
                        ?? 18
                    )
                )
            );

        $color = $this->safeColor(
            $styles['color'] ?? '#000000'
        );

        $requestedAlign =
            $styles['align'] ?? 'left';

        $align = in_array(
            $requestedAlign,
            [
                'left',
                'center',
                'right',
            ],
            true
        )
            ? $requestedAlign
            : 'left';

        $fontFamily =
            trim(
                (string) (
                    $styles['font_family']
                    ?? ''
                )
            );

        $style = [
            'position:absolute',
            'left:' . $x . 'px',
            'top:' . $y . 'px',
            'width:' . $width . 'px',
            'height:' . $height . 'px',
            'font-size:' . $fontSize . 'px',
            'color:' . $color,
            'text-align:' . $align,
            'z-index:100',
            'overflow:hidden',
        ];

        if ($fontFamily !== '') {
            $style[] =
                'font-family:'
                . $fontFamily;
        }

        if (! empty($styles['bold'])) {
            $style[] =
                'font-weight:bold';
        }

        if (! empty($styles['italic'])) {
            $style[] =
                'font-style:italic';
        }

        if (isset($styles['opacity'])) {
            $opacity =
                max(
                    0,
                    min(
                        1,
                        (float) $styles['opacity']
                    )
                );

            $style[] =
                'opacity:'
                . $opacity;
        }

        $inline =
            implode(
                ';',
                $style
            );

        /*
         * QR code.
         */
        if (
            ($element['type'] ?? '')
            === 'QR_CODE'
        ) {
            if ((string) $value === '') {
                return '';
            }

            $safeSrc =
                htmlspecialchars(
                    (string) $value,
                    ENT_QUOTES
                );

            return
                '<div style="'
                . $inline
                . ';overflow:hidden;">'

                . '<img '
                . 'src="'
                . $safeSrc
                . '" '
                . 'style="'
                . 'width:100%;'
                . 'height:100%;'
                . 'object-fit:contain;'
                . '" '
                . 'alt="QR Code"'
                . '/>'

                . '</div>';
        }

        /*
         * Uploaded / resolved image.
         */
        if (
            ($element['type'] ?? '')
            === 'IMAGE'
        ) {
            if ((string) $value === '') {
                return '';
            }

            $safeSrc =
                htmlspecialchars(
                    (string) $value,
                    ENT_QUOTES
                );

            return
                '<div style="'
                . $inline
                . ';overflow:hidden;">'

                . '<img '
                . 'src="'
                . $safeSrc
                . '" '
                . 'style="'
                . 'width:100%;'
                . 'height:100%;'
                . 'object-fit:contain;'
                . '" '
                . 'alt=""'
                . '/>'

                . '</div>';
        }

        /*
         * Existing text-based elements.
         */
        $display =
            htmlspecialchars(
                (string) $value,
                ENT_QUOTES
            );

        return
            '<div style="'
            . $inline
            . '">'
            . $display
            . '</div>';
    }

    /**
     * Convert a stored asset into a DomPDF-compatible data URI.
     */
    private function assetDataUri(
        string $path,
        string $mimeType
    ): ?string {
        try {
            $content =
                $this->storage->getTemplateAsset(
                    $path
                );

            if (
                $content === null ||
                $content === ''
            ) {
                return null;
            }

            return
                'data:'
                . $mimeType
                . ';base64,'
                . base64_encode($content);
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * Validate a color defensively before putting it into CSS.
     */
    private function safeColor(
        mixed $value
    ): string {
        if (! is_string($value)) {
            return '#000000';
        }

        $color =
            strtoupper(
                trim($value)
            );

        if (
            preg_match(
                '/^#[0-9A-F]{6}$/',
                $color
            )
        ) {
            return $color;
        }

        return '#000000';
    }
}
