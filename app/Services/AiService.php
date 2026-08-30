<?php

namespace App\Services;

use App\Ai\Agents\TemplateDesigner;
use App\Models\CertificateBatch;
use App\Models\DocumentTemplate;
use RuntimeException;
use Throwable;

class AiService
{
    public function __construct(
        private AiTemplateValidationService $templateValidator,
    ) {
    }

    /**
     * Check whether Gemini AI is configured.
     */
    public function isEnabled(): bool
    {
        return config('ai.default') === 'gemini'
            && ! empty(config('ai.providers.gemini.key'));
    }

    /**
     * Generate and validate a certificate template using Gemini.
     *
     * AI never writes directly to the database.
     * The returned template has already passed Pramaan business validation.
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
    public function generateTemplateDesign(
        string $prompt,
        string $organizationName
    ): array {
        $prompt = trim($prompt);
        $organizationName = trim($organizationName);

        if ($prompt === '') {
            throw new RuntimeException(
                'Template generation prompt is required.'
            );
        }

        if ($organizationName === '') {
            throw new RuntimeException(
                'Organization name is required.'
            );
        }

        if (! $this->isEnabled()) {
            throw new RuntimeException(
                'Gemini AI is not configured.'
            );
        }

        try {
            $agent = new TemplateDesigner(
                organizationName: $organizationName
            );

            $response = $agent->prompt(
                $prompt,
                provider: 'gemini',
                model: config(
                    'ai.providers.gemini.models.text.default',
                    env('GEMINI_MODEL', 'gemini-3.6-flash')
                ),
                timeout: 90,
            );

            $generated = $response;

            if (is_object($generated) && method_exists($generated, 'toArray')) {
                $generated = $generated->toArray();
            } elseif (is_object($generated)) {
                $json = json_encode($generated);

                if (json_last_error() === JSON_ERROR_NONE && is_string($json)) {
                    $generated = json_decode($json, true);
                }
            } elseif (is_string($generated)) {
                $decoded = json_decode($generated, true);

                if (is_array($decoded)) {
                    $generated = $decoded;
                }
            }

            if (! is_array($generated)) {
                throw new RuntimeException(
                    'Gemini returned an invalid template response.'
                );
            }

            return $this->templateValidator->validate(
                $generated
            );
        } catch (Throwable $e) {
            report($e);

            throw new RuntimeException(
                'AI template generation failed: '.$e->getMessage(),
                previous: $e
            );
        }
    }

    /**
     * Suggest certificate wording.
     *
     * This remains deterministic for now.
     * The Template Generator is the primary Gemini-powered workflow.
     *
     * @return array{
     *     title: string,
     *     body: string,
     *     footer: string,
     *     note: string
     * }
     */
    public function suggestCertificateWording(
        DocumentTemplate $template,
        string $recipientName = ''
    ): array {
        return $this->fallbackWording(
            $template->name,
            $recipientName,
            $this->isEnabled()
                ? 'Gemini configured; wording assistant not enabled.'
                : 'Gemini unavailable; used local fallback.'
        );
    }

    /**
     * Analyze a batch's CSV data for anomalies.
     *
     * This is read-only and does not mutate the batch.
     */
    public function analyzeCsv(CertificateBatch $batch): array
    {
        $rows = $batch
            ->records()
            ->get()
            ->map(fn ($r) => $r->source_data);

        $anomalies = [];
        $total = $rows->count();
        $headers = $batch->original_headers ?? [];

        foreach ($headers as $header) {
            $empty = $rows
                ->filter(
                    fn ($row) =>
                        trim((string) ($row[$header] ?? '')) === ''
                )
                ->count();

            if ($empty > 0) {
                $anomalies[] =
                    "Column '{$header}': {$empty}/{$total} records are empty.";
            }
        }

        // Duplicate detection on the first CSV column.
        $first = $headers[0] ?? null;

        if ($first) {
            $counts = $rows
                ->groupBy(
                    fn ($row) => $row[$first] ?? null
                )
                ->map->count()
                ->filter(
                    fn ($count) => $count > 1
                );

            foreach ($counts as $value => $count) {
                $anomalies[] =
                    "Potential duplicate '{$first}' = '{$value}' appears {$count} times.";
            }
        }

        if (empty($anomalies)) {
            $anomalies[] = 'No obvious anomalies detected.';
        }

        return [
            'total_records' => $total,
            'anomalies' => array_slice(
                $anomalies,
                0,
                10
            ),
        ];
    }

    /**
     * Local wording fallback.
     */
    private function fallbackWording(
        string $templateName,
        string $recipientName,
        string $note = 'Local heuristic'
    ): array {
        $title = 'Certificate of Achievement';

        $body =
            'This is to certify that the recipient has successfully completed the '
            .$templateName
            .' program and is hereby awarded this certificate in recognition of the accomplishment.';

        if ($recipientName !== '') {
            $body =
                'This is to certify that '
                .$recipientName
                .' has successfully completed the '
                .$templateName
                .' program and is hereby awarded this certificate in recognition of the accomplishment.';
        }

        return [
            'title' => $title,
            'body' => $body,
            'footer' => 'Verified via blockchain on Arbitrum.',
            'note' => $note,
        ];
    }
}