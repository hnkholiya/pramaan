<?php

namespace App\Services;

use InvalidArgumentException;

class AiTemplateValidationService
{
    /**
     * Allowed template element types in Pramaan.
     */
    private const ALLOWED_TYPES = [
        'TEXT',
        'DYNAMIC_FIELD',
        'IMAGE',
        'CERTIFICATE_NUMBER',
        'VERIFICATION_URL',
        'QR_CODE',

        // Visual design primitives.
        'RECTANGLE',
        'LINE',
        'BACKGROUND',
        'DECORATION',
    ];

    /**
     * Allowed dynamic field keys.
     */
    private const ALLOWED_DATA_KEYS = [
        'recipient_name',
        'course',
        'date',
        'organization',
        'instructor',
        'designation',
    ];

    /**
     * Validate and normalize an AI-generated template.
     *
     * @return array{
     *     name: string,
     *     description: string,
     *     canvas_width: int,
     *     canvas_height: int,
     *     orientation: string,
     *     elements: array<int, array<string, mixed>>
     * }
     */
    public function validate(array $template): array
    {
        $name = trim((string) ($template['name'] ?? ''));
        $description = trim(
            (string) ($template['description'] ?? '')
        );

        if ($name === '') {
            throw new InvalidArgumentException(
                'AI template name is required.'
            );
        }

        if (mb_strlen($name) > 150) {
            throw new InvalidArgumentException(
                'AI template name is too long.'
            );
        }

        if (mb_strlen($description) > 1000) {
            throw new InvalidArgumentException(
                'AI template description is too long.'
            );
        }

        $canvasWidth = $this->positiveInt(
            $template['canvas_width'] ?? null,
            'canvas_width'
        );

        $canvasHeight = $this->positiveInt(
            $template['canvas_height'] ?? null,
            'canvas_height'
        );

        if ($canvasWidth < 800 || $canvasWidth > 3000) {
            throw new InvalidArgumentException(
                'Canvas width must be between 800 and 3000.'
            );
        }

        if ($canvasHeight < 500 || $canvasHeight > 2000) {
            throw new InvalidArgumentException(
                'Canvas height must be between 500 and 2000.'
            );
        }

        $orientation = $template['orientation'] ?? null;

        if (! in_array(
            $orientation,
            ['landscape', 'portrait'],
            true
        )) {
            throw new InvalidArgumentException(
                'Invalid template orientation.'
            );
        }

        $elements = $template['elements'] ?? null;

        if (! is_array($elements)) {
            throw new InvalidArgumentException(
                'AI template elements must be an array.'
            );
        }

        if (count($elements) < 5 || count($elements) > 16) {
            throw new InvalidArgumentException(
                'AI template must contain between 5 and 16 elements.'
            );
        }

        $normalized = [];
        $hasCertificateNumber = false;
        $hasQrCode = false;

        foreach ($elements as $index => $element) {
            if (! is_array($element)) {
                throw new InvalidArgumentException(
                    "Element {$index} is invalid."
                );
            }

            $normalizedElement = $this->validateElement(
                $element,
                $index,
                $canvasWidth,
                $canvasHeight
            );

            if (
                $normalizedElement['type'] ===
                'CERTIFICATE_NUMBER'
            ) {
                $hasCertificateNumber = true;
            }

            if (
                $normalizedElement['type'] ===
                'QR_CODE'
            ) {
                $hasQrCode = true;
            }

            if (
                $normalizedElement['sort_order'] !==
                $index
            ) {
                throw new InvalidArgumentException(
                    "Element {$index} has invalid sort_order."
                );
            }

            $normalized[] = $normalizedElement;
        }

        if (! $hasCertificateNumber) {
            throw new InvalidArgumentException(
                'AI template must contain CERTIFICATE_NUMBER.'
            );
        }

        if (! $hasQrCode) {
            throw new InvalidArgumentException(
                'AI template must contain QR_CODE.'
            );
        }

        return [
            'name' => $name,
            'description' => $description,
            'canvas_width' => $canvasWidth,
            'canvas_height' => $canvasHeight,
            'orientation' => $orientation,
            'elements' => $normalized,
        ];
    }

    /**
     * Validate a single template element.
     */
    private function validateElement(
        array $element,
        int $index,
        int $canvasWidth,
        int $canvasHeight
    ): array {
        $type = strtoupper(
            trim((string) ($element['type'] ?? ''))
        );

        if (! in_array(
            $type,
            self::ALLOWED_TYPES,
            true
        )) {
            throw new InvalidArgumentException(
                "Element {$index} has an unsupported type."
            );
        }

        $name = trim(
            (string) ($element['name'] ?? '')
        );

        if ($name === '') {
            throw new InvalidArgumentException(
                "Element {$index} must have a name."
            );
        }

        if (mb_strlen($name) > 150) {
            throw new InvalidArgumentException(
                "Element {$index} name is too long."
            );
        }

        $position = $element['position'] ?? null;

        if (! is_array($position)) {
            throw new InvalidArgumentException(
                "Element {$index} position is invalid."
            );
        }

        $x = $this->nonNegativeInt(
            $position['x'] ?? null,
            "Element {$index} position.x"
        );

        $y = $this->nonNegativeInt(
            $position['y'] ?? null,
            "Element {$index} position.y"
        );

        $size = $element['size'] ?? null;

        if (! is_array($size)) {
            throw new InvalidArgumentException(
                "Element {$index} size is invalid."
            );
        }

        $width = $this->positiveInt(
            $size['width'] ?? null,
            "Element {$index} size.width"
        );

        $height = $this->positiveInt(
            $size['height'] ?? null,
            "Element {$index} size.height"
        );

        /*
 * Decorations are visual accents, not large layout containers.
 */
        if ($type === 'DECORATION') {
            $width = min(
                $width,
                min(260, $canvasWidth)
            );

            $height = min(
                $height,
                min(180, $canvasHeight)
            );
        }

        if ($x + $width > $canvasWidth) {
            throw new InvalidArgumentException(
                "Element {$index} exceeds the canvas width."
            );
        }

        if ($y + $height > $canvasHeight) {
            throw new InvalidArgumentException(
                "Element {$index} exceeds the canvas height."
            );
        }

        $dataKey = $element['data_key'] ?? null;

        if ($type === 'DYNAMIC_FIELD') {
            if ($dataKey === null) {
                throw new InvalidArgumentException(
                    "DYNAMIC_FIELD {$index} requires data_key."
                );
            }

            $dataKey = trim((string) $dataKey);

            if ($dataKey === '') {
                throw new InvalidArgumentException(
                    "DYNAMIC_FIELD {$index} requires data_key."
                );
            }

            if (! in_array(
                $dataKey,
                self::ALLOWED_DATA_KEYS,
                true
            )) {
                throw new InvalidArgumentException(
                    "DYNAMIC_FIELD {$index} has an unsupported data_key."
                );
            }
        } else {
            /*
     * Only DYNAMIC_FIELD is allowed to carry a data_key.
     * Ignore accidental AI-provided values for other element types.
     */
            $dataKey = null;
        }

        $config = $element['config'] ?? [];

        if ($config === null) {
            $config = [];
        }

        if (! is_array($config)) {
            throw new InvalidArgumentException(
                "Element {$index} config must be an object."
            );
        }

        $styles = $element['styles'] ?? [];

        if ($styles === null) {
            $styles = [];
        }

        if (! is_array($styles)) {
            throw new InvalidArgumentException(
                "Element {$index} styles must be an object."
            );
        }

        $styles = $this->normalizeStyles(
            $styles,
            $index
        );

        $sortOrder = $this->positiveOrZeroInt(
            $element['sort_order'] ?? null,
            "Element {$index} sort_order"
        );

        /*
         * ---------------------------------------------------------------
         * Type-specific rules
         * ---------------------------------------------------------------
         */

        if ($type === 'TEXT') {
            $text = $config['text'] ?? null;

            if (! is_string($text)) {
                throw new InvalidArgumentException(
                    "TEXT element {$index} must contain config.text."
                );
            }

            $text = trim($text);

            if ($text === '') {
                throw new InvalidArgumentException(
                    "TEXT element {$index} config.text cannot be empty."
                );
            }

            if (mb_strlen($text) > 500) {
                throw new InvalidArgumentException(
                    "TEXT element {$index} is too long."
                );
            }

            $config = [
                'text' => $text,
            ];
        }

        if ($type === 'DYNAMIC_FIELD') {
            if (
                $dataKey === null ||
                $dataKey === ''
            ) {
                throw new InvalidArgumentException(
                    "DYNAMIC_FIELD {$index} requires data_key."
                );
            }

            $config = [];
        }

        if ($type === 'QR_CODE') {
            $qrSize = $config['size'] ?? min(
                $width,
                $height
            );

            $qrSize = $this->positiveInt(
                $qrSize,
                "QR_CODE {$index} config.size"
            );

            if (
                $qrSize < 20 ||
                $qrSize > 500
            ) {
                throw new InvalidArgumentException(
                    "QR_CODE {$index} size must be between 20 and 500."
                );
            }

            $config = [
                'size' => $qrSize,
            ];
        }

        /*
         * ---------------------------------------------------------------
         * Visual design primitives
         * ---------------------------------------------------------------
         */

        if ($type === 'RECTANGLE') {
            $config = $this->normalizeRectangleConfig(
                $config,
                $index
            );
        }

        if ($type === 'LINE') {
            $config = $this->normalizeLineConfig(
                $config,
                $index
            );
        }

        if ($type === 'BACKGROUND') {
            $config = $this->normalizeBackgroundConfig(
                $config,
                $index
            );
        }

        if ($type === 'DECORATION') {
            $config = $this->normalizeDecorationConfig(
                $config,
                $index
            );
        }

        if ($type === 'DECORATION') {
            /*
     * Decorations should remain decorative rather than becoming
     * giant canvas-sized containers.
     */
            $maxDecorationWidth = min(
                260,
                $canvasWidth
            );

            $maxDecorationHeight = min(
                180,
                $canvasHeight
            );

            $width = min(
                $width,
                $maxDecorationWidth
            );

            $height = min(
                $height,
                $maxDecorationHeight
            );
        }

        /*
         * IMAGE and system-generated types must not receive arbitrary
         * AI-controlled paths or executable content.
         */
        if (
            $type === 'CERTIFICATE_NUMBER' ||
            $type === 'VERIFICATION_URL' ||
            $type === 'IMAGE'
        ) {
            $config = $this->normalizeSafeConfig(
                $config,
                $type,
                $index
            );
        }

        return [
            'type' => $type,
            'name' => $name,
            'data_key' => $dataKey,
            'config' => $config,

            'position' => [
                'x' => $x,
                'y' => $y,
            ],

            'size' => [
                'width' => $width,
                'height' => $height,
            ],

            'styles' => $styles,
            'sort_order' => $sortOrder,
        ];
    }

    /**
     * Normalize supported style properties.
     *
     * Only explicit, safe visual properties are retained.
     */
    private function normalizeStyles(
        array $styles,
        int $index
    ): array {
        $normalized = [];

        if (array_key_exists(
            'font_size',
            $styles
        )) {
            $fontSize = $this->positiveInt(
                $styles['font_size'],
                "Element {$index} styles.font_size"
            );

            if (
                $fontSize < 6 ||
                $fontSize > 120
            ) {
                throw new InvalidArgumentException(
                    "Element {$index} font size must be between 6 and 120."
                );
            }

            $normalized['font_size'] = $fontSize;
        }

        if (array_key_exists(
            'align',
            $styles
        )) {
            $align = trim(
                (string) $styles['align']
            );

            if (! in_array(
                $align,
                [
                    'left',
                    'center',
                    'right',
                ],
                true
            )) {
                throw new InvalidArgumentException(
                    "Element {$index} has invalid alignment."
                );
            }

            $normalized['align'] = $align;
        }

        if (array_key_exists(
            'color',
            $styles
        )) {
            $normalized['color'] = $this->hexColor(
                $styles['color'],
                "Element {$index} styles.color"
            );
        }

        /*
         * Optional visual weight for text/design elements.
         */
        if (array_key_exists('opacity', $styles)) {
            $opacity = $styles['opacity'];

            if (! is_numeric($opacity)) {
                throw new InvalidArgumentException(
                    "Element {$index} opacity must be numeric."
                );
            }

            $opacity = (float) $opacity;

            /*
     * AI models sometimes return opacity as a percentage
     * (for example 80 or 50) instead of 0-1.
     *
     * Normalize percentage-style values automatically.
     */
            if ($opacity > 1 && $opacity <= 100) {
                $opacity /= 100;
            }

            if ($opacity < 0 || $opacity > 1) {
                throw new InvalidArgumentException(
                    "Element {$index} opacity must be between 0 and 1."
                );
            }

            $normalized['opacity'] = round(
                $opacity,
                3
            );
        }

        return $normalized;
    }

    /**
     * Normalize rectangle configuration.
     */
    private function normalizeRectangleConfig(
        array $config,
        int $index
    ): array {
        $fill = $config['fill'] ?? 'transparent';

        if (
            ! is_string($fill) &&
            $fill !== null
        ) {
            throw new InvalidArgumentException(
                "RECTANGLE {$index} fill must be a color or transparent."
            );
        }

        if (
            $fill !== null &&
            strtolower(trim($fill)) !== 'transparent'
        ) {
            $fill = $this->hexColor(
                $fill,
                "RECTANGLE {$index} config.fill"
            );
        } else {
            $fill = 'transparent';
        }

        $borderColor = $config['border_color']
            ?? '#000000';

        $borderColor = $this->hexColor(
            $borderColor,
            "RECTANGLE {$index} config.border_color"
        );

        $borderWidth = $this->nonNegativeInt(
            $config['border_width'] ?? 0,
            "RECTANGLE {$index} config.border_width"
        );

        /*
 * A transparent rectangle with no border is visually invisible.
 * For AI-generated certificate frames, use a safe visible default.
 */
        if (
            $fill === 'transparent' &&
            $borderWidth === 0
        ) {
            $borderWidth = 3;
        }

        if ($borderWidth > 20) {
            throw new InvalidArgumentException(
                "RECTANGLE {$index} border width cannot exceed 20."
            );
        }

        $radius = $this->nonNegativeInt(
            $config['radius'] ?? 0,
            "RECTANGLE {$index} config.radius"
        );

        if ($radius > 100) {
            throw new InvalidArgumentException(
                "RECTANGLE {$index} radius cannot exceed 100."
            );
        }

        return [
            'fill' => $fill,
            'border_color' => $borderColor,
            'border_width' => $borderWidth,
            'radius' => $radius,
        ];
    }

    /**
     * Normalize line configuration.
     */
    private function normalizeLineConfig(
        array $config,
        int $index
    ): array {
        $orientation =
            strtolower(
                trim(
                    (string) (
                        $config['orientation']
                        ?? 'horizontal'
                    )
                )
            );

        if (! in_array(
            $orientation,
            [
                'horizontal',
                'vertical',
            ],
            true
        )) {
            throw new InvalidArgumentException(
                "LINE {$index} orientation must be horizontal or vertical."
            );
        }

        $color = $this->hexColor(
            $config['color'] ?? '#000000',
            "LINE {$index} config.color"
        );

        $thickness = $this->positiveInt(
            $config['thickness'] ?? 2,
            "LINE {$index} config.thickness"
        );

        if ($thickness > 20) {
            throw new InvalidArgumentException(
                "LINE {$index} thickness cannot exceed 20."
            );
        }

        return [
            'orientation' => $orientation,
            'color' => $color,
            'thickness' => $thickness,
        ];
    }

    /**
     * Normalize background configuration.
     */
    private function normalizeBackgroundConfig(
        array $config,
        int $index
    ): array {
        $color = $this->hexColor(
            $config['color'] ?? '#FFFFFF',
            "BACKGROUND {$index} config.color"
        );

        return [
            'color' => $color,
        ];
    }

    /**
     * Normalize decoration configuration.
     */
    private function normalizeDecorationConfig(
        array $config,
        int $index
    ): array {
        $variant =
            strtolower(
                trim(
                    (string) (
                        $config['variant']
                        ?? 'corner'
                    )
                )
            );

        $allowedVariants = [
            'corner',
            'double_corner',
            'seal',
            'divider',
            'ornament',
        ];

        if (! in_array(
            $variant,
            $allowedVariants,
            true
        )) {
            throw new InvalidArgumentException(
                "DECORATION {$index} has an unsupported variant."
            );
        }

        $color = $this->hexColor(
            $config['color'] ?? '#D4AF37',
            "DECORATION {$index} config.color"
        );

        $secondaryColor = $config['secondary_color']
            ?? null;

        if ($secondaryColor !== null) {
            $secondaryColor = $this->hexColor(
                $secondaryColor,
                "DECORATION {$index} config.secondary_color"
            );
        }

        return [
            'variant' => $variant,
            'color' => $color,
            'secondary_color' => $secondaryColor,
        ];
    }

    /**
     * Keep only explicitly allowed config values for non-design types.
     */
    private function normalizeSafeConfig(
        array $config,
        string $type,
        int $index
    ): array {
        if ($type === 'IMAGE') {
            /*
             * AI must not invent arbitrary file paths or URLs.
             */
            return [];
        }

        return [];
    }

    /**
     * Validate a hexadecimal color.
     */
    private function hexColor(
        mixed $value,
        string $field
    ): string {
        if (! is_string($value)) {
            throw new InvalidArgumentException(
                "{$field} must be a hexadecimal color."
            );
        }

        $color = strtoupper(
            trim($value)
        );

        if (! preg_match(
            '/^#[0-9A-F]{6}$/',
            $color
        )) {
            throw new InvalidArgumentException(
                "{$field} must be a valid #RRGGBB color."
            );
        }

        return $color;
    }

    private function positiveInt(
        mixed $value,
        string $field
    ): int {
        if (
            filter_var(
                $value,
                FILTER_VALIDATE_INT
            ) === false
        ) {
            throw new InvalidArgumentException(
                "{$field} must be an integer."
            );
        }

        $value = (int) $value;

        if ($value <= 0) {
            throw new InvalidArgumentException(
                "{$field} must be greater than zero."
            );
        }

        return $value;
    }

    private function positiveOrZeroInt(
        mixed $value,
        string $field
    ): int {
        if (
            filter_var(
                $value,
                FILTER_VALIDATE_INT
            ) === false
        ) {
            throw new InvalidArgumentException(
                "{$field} must be an integer."
            );
        }

        $value = (int) $value;

        if ($value < 0) {
            throw new InvalidArgumentException(
                "{$field} cannot be negative."
            );
        }

        return $value;
    }

    private function nonNegativeInt(
        mixed $value,
        string $field
    ): int {
        return $this->positiveOrZeroInt(
            $value,
            $field
        );
    }
}
