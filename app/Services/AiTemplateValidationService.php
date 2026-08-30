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
        $description = trim((string) ($template['description'] ?? ''));

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

        if (count($elements) < 5 || count($elements) > 12) {
            throw new InvalidArgumentException(
                'AI template must contain between 5 and 12 elements.'
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

            if ($normalizedElement['type'] === 'CERTIFICATE_NUMBER') {
                $hasCertificateNumber = true;
            }

            if ($normalizedElement['type'] === 'QR_CODE') {
                $hasQrCode = true;
            }

            if (
                $normalizedElement['sort_order'] !== $index
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
        $type = strtoupper(trim((string) ($element['type'] ?? '')));

        if (! in_array($type, self::ALLOWED_TYPES, true)) {
            throw new InvalidArgumentException(
                "Element {$index} has an unsupported type."
            );
        }

        $name = trim((string) ($element['name'] ?? ''));

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

        if ($dataKey !== null) {
            $dataKey = trim((string) $dataKey);

            if (! in_array(
                $dataKey,
                self::ALLOWED_DATA_KEYS,
                true
            )) {
                throw new InvalidArgumentException(
                    "Element {$index} has an unsupported data_key."
                );
            }
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

        $styles = $this->normalizeStyles($styles, $index);

        if ($styles !== null && ! is_array($styles)) {
            throw new InvalidArgumentException(
                "Element {$index} styles must be an object."
            );
        }

        $styles = $styles ?? [];

        $styles = $this->normalizeStyles(
            $styles,
            $index
        );

        $sortOrder = $this->positiveOrZeroInt(
            $element['sort_order'] ?? null,
            "Element {$index} sort_order"
        );

        /*
         * Type-specific rules.
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
            if ($dataKey === null || $dataKey === '') {
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

            if ($qrSize < 20 || $qrSize > 500) {
                throw new InvalidArgumentException(
                    "QR_CODE {$index} size must be between 20 and 500."
                );
            }

            $config = [
                'size' => $qrSize,
            ];
        }

        if (
            $type === 'CERTIFICATE_NUMBER' ||
            $type === 'VERIFICATION_URL' ||
            $type === 'IMAGE'
        ) {
            /*
             * Keep only safe configuration values we explicitly support.
             */
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
     */
    private function normalizeStyles(
        array $styles,
        int $index
    ): array {
        $normalized = [];

        if (array_key_exists('font_size', $styles)) {
            $fontSize = $this->positiveInt(
                $styles['font_size'],
                "Element {$index} styles.font_size"
            );

            if ($fontSize < 6 || $fontSize > 120) {
                throw new InvalidArgumentException(
                    "Element {$index} font size must be between 6 and 120."
                );
            }

            $normalized['font_size'] = $fontSize;
        }

        if (array_key_exists('align', $styles)) {
            $align = trim((string) $styles['align']);

            if (! in_array(
                $align,
                ['left', 'center', 'right'],
                true
            )) {
                throw new InvalidArgumentException(
                    "Element {$index} has invalid alignment."
                );
            }

            $normalized['align'] = $align;
        }

        if (array_key_exists('color', $styles)) {
            $color = strtoupper(
                trim((string) $styles['color'])
            );

            if (! preg_match(
                '/^#[0-9A-F]{6}$/i',
                $color
            )) {
                throw new InvalidArgumentException(
                    "Element {$index} has invalid color."
                );
            }

            $normalized['color'] = $color;
        }

        return $normalized;
    }

    /**
     * Keep only explicitly allowed config values.
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
        return $this->positiveOrZeroInt($value, $field);
    }
}
