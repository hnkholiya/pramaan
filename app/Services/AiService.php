<?php

namespace App\Services;

use App\Models\CertificateBatch;
use App\Models\DocumentTemplate;

/**
 * AI-assisted workflows.
 *
 * AI is NEVER the source of truth for payment, authorization, integrity,
 * or blockchain state. It only assists (wording suggestions, CSV anomaly
 * analysis). When no provider key is configured, a deterministic local
 * heuristic is returned so the feature remains functional and testable.
 */
class AiService
{
    public function isEnabled(): bool
    {
        return ! empty(config('ai.providers.openai.key'));
    }

    /**
     * Suggest certificate wording (title, body, footer) for a template.
     *
     * @return array{title?: string, body?: string, footer?: string, note: string}
     */
    public function suggestCertificateWording(DocumentTemplate $template, string $recipientName = ''): array
    {
        if (! $this->isEnabled()) {
            return $this->fallbackWording($template->name, $recipientName);
        }

        try {
            $prompt = "You are a professional certificate copywriter. Suggest a title, body, and footer for a certificate template named '{$template->name}'. Return JSON with keys: title, body, footer.";

            $response = \Laravel\Ai\Ai::chat()->create([
                'messages' => [
                    ['role' => 'system', 'content' => 'Return only JSON.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'tools' => [
                    \Laravel\Ai\Tool::make('return_wording', 'Return suggested wording', 'array', [
                        'title' => 'string',
                        'body' => 'string',
                        'footer' => 'string',
                    ])->using(fn ($args) => $args),
                ],
                'toolChoice' => 'return_wording',
            ]);

            $text = $response->text();
            $parsed = json_decode($text, true);

            return [
                'title' => $parsed['title'] ?? '',
                'body' => $parsed['body'] ?? '',
                'footer' => $parsed['footer'] ?? '',
                'note' => 'AI generated',
            ];
        } catch (\Throwable $e) {
            report($e);

            return $this->fallbackWording($template->name, $recipientName, 'AI unavailable, used local fallback.');
        }
    }

    /**
     * Analyze a batch's CSV data for anomalies (no mutation).
     */
    public function analyzeCsv(CertificateBatch $batch): array
    {
        $rows = $batch->records()->get()->map(fn ($r) => $r->source_data);
        $anomalies = [];
        $total = $rows->count();
        $headers = $batch->original_headers ?? [];

        foreach ($headers as $header) {
            $empty = $rows->filter(fn ($row) => trim((string) ($row[$header] ?? '')) === '')->count();
            if ($empty > 0) {
                $anomalies[] = "Column '{$header}': {$empty}/{$total} records are empty.";
            }
        }

        // Duplicate detection on first column.
        $first = $headers[0] ?? null;
        if ($first) {
            $counts = $rows->groupBy(fn ($row) => $row[$first] ?? null)->map->count()->filter(fn ($c) => $c > 1);
            foreach ($counts as $value => $count) {
                $anomalies[] = "Potential duplicate '{$first}' = '{$value}' appears {$count} times.";
            }
        }

        if (empty($anomalies)) {
            $anomalies[] = 'No obvious anomalies detected.';
        }

        return ['total_records' => $total, 'anomalies' => array_slice($anomalies, 0, 10)];
    }

    private function fallbackWording(string $templateName, string $recipientName, string $note = 'Local heuristic'): array
    {
        $title = 'Certificate of Achievement';
        $body = 'This is to certify that the recipient has successfully completed the '.$templateName.' program and is hereby awarded this certificate in recognition of the accomplishment.';

        if ($recipientName !== '') {
            $body = 'This is to certify that '.$recipientName.' has successfully completed the '.$templateName.' program and is hereby awarded this certificate in recognition of the accomplishment.';
        }

        return [
            'title' => $title,
            'body' => $body,
            'footer' => 'Verified via blockchain on Arbitrum.',
            'note' => $note,
        ];
    }
}
