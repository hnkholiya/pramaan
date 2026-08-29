<?php

namespace App\Services;

use App\Enums\ActivityAction;
use App\Enums\BatchRecordStatus;
use App\Enums\BatchStatus;
use App\Models\BatchRecord;
use App\Models\CertificateBatch;
use App\Models\DocumentTemplate;
use App\Models\Organization;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CsvService
{
    public function __construct(
        private ActivityLogService $activityLog,
        private StorageService $storage,
    ) {}

    /**
     * Parse CSV string content into structured headers + rows.
     *
     * @return array{headers: string[], rows: array<int, array<string,string>>}
     *
     * @throws RuntimeException
     */
    public function parse(string $content): array
    {
        if (trim($content) === '') {
            throw new RuntimeException('CSV is empty.');
        }

        // Normalize line endings.
        $content = str_replace(["\r\n", "\r"], "\n", $content);

        // Remove a UTF-8 BOM if present.
        $content = $this->removeUtf8Bom($content);

        $lines = explode("\n", trim($content));

        $headers = $this->parseLine($lines[0]);

        if (count($headers) === 0) {
            throw new RuntimeException('CSV has no headers.');
        }

        $headerMap = [];

        foreach ($headers as $i => $header) {
            $header = trim($header);

            if ($header === '') {
                throw new RuntimeException(
                    'CSV contains an empty header column.'
                );
            }

            if (isset($headerMap[$header])) {
                throw new RuntimeException(
                    "Duplicate header column '{$header}' is not supported."
                );
            }

            $headerMap[$header] = $i;
            $headers[$i] = $header;
        }

        $rows = [];
        $lineCount = count($lines);

        for ($i = 1; $i < $lineCount; $i++) {
            $line = trim($lines[$i]);

            if ($line === '') {
                continue;
            }

            $values = $this->parseLine($line);

            if (count($values) !== count($headers)) {
                throw new RuntimeException(
                    'Row ' . ($i + 1) . ' has ' .
                    count($values) .
                    ' columns but headers have ' .
                    count($headers) .
                    '.'
                );
            }

            $row = [];

            foreach ($headers as $index => $header) {
                $row[$header] = trim((string) ($values[$index] ?? ''));
            }

            $rows[] = $row;
        }

        return [
            'headers' => $headers,
            'rows' => $rows,
        ];
    }

    /**
     * Remove UTF-8 BOM from the beginning of a string if present.
     */
    private function removeUtf8Bom(string $content): string
    {
        return str_starts_with($content, "\xEF\xBB\xBF")
            ? substr($content, 3)
            : $content;
    }

    /**
     * Parse a single CSV line while respecting quoted fields.
     *
     * @return string[]
     */
    private function parseLine(string $line): array
    {
        $parts = str_getcsv($line);

        if ($parts === [null]) {
            return [];
        }

        return array_map(
            static fn ($value) => trim((string) $value),
            $parts
        );
    }

    /**
     * Store the uploaded CSV and create the batch + records.
     */
    public function createBatch(
        Organization $organization,
        DocumentTemplate $template,
        string $originalName,
        string $fileContents,
    ): CertificateBatch {
        return DB::transaction(
            function () use (
                $organization,
                $template,
                $originalName,
                $fileContents
            ) {
                $parsed = $this->parse($fileContents);

                $safeName = preg_replace(
                    '/[^A-Za-z0-9._-]/',
                    '_',
                    $originalName
                );

                $relative =
                    'source/' .
                    $organization->id .
                    '/' .
                    now()->format('YmdHis') .
                    '_' .
                    $safeName;

                $this->storage->store(
                    $relative,
                    $fileContents
                );

                // Lock the template version at batch creation.
                // Historical certificates must reference the exact version
                // used for this batch.
                $version = $template->activeVersion();

                if (! $version) {
                    throw new RuntimeException(
                        'Template has no active version.'
                    );
                }

                $batch = CertificateBatch::create([
                    'organization_id' => $organization->id,
                    'document_template_id' => $template->id,
                    'document_template_version_id' => $version->id,
                    'source_file_name' => $originalName,
                    'source_file_path' => $relative,
                    'original_headers' => $parsed['headers'],
                    'total_records' => count($parsed['rows']),
                    'valid_records' => 0,
                    'invalid_records' => 0,
                    'status' => BatchStatus::Uploaded->value,
                ]);

                foreach ($parsed['rows'] as $index => $row) {
                    BatchRecord::create([
                        'certificate_batch_id' => $batch->id,
                        'row_number' => $index + 2,
                        'source_data' => $row,
                        'validation_errors' => null,
                        'status' => BatchRecordStatus::Pending->value,
                    ]);
                }

                $this->activityLog->log(
                    ActivityAction::BatchCreated,
                    $organization->id,
                    subject: $batch
                );

                $this->activityLog->log(
                    ActivityAction::BatchFileUploaded,
                    $organization->id,
                    subject: $batch,
                    metadata: [
                        'file' => $originalName,
                        'records' => count($parsed['rows']),
                    ]
                );

                return $batch;
            }
        );
    }

    /**
     * Validate every record against required keys and format rules.
     *
     * Supported rules:
     * - email
     * - date
     *
     * Date format is intentionally strict:
     *
     * YYYY-MM-DD
     *
     * @param string[] $requiredKeys
     * @param array<string,string> $rules
     */
    public function validateRecords(
        CertificateBatch $batch,
        array $requiredKeys = [],
        array $rules = []
    ): array {
        $summary = [
            'valid' => 0,
            'invalid' => 0,
            'errors' => [],
        ];

        $records = $batch->records()->get();

        foreach ($records as $record) {
            $errors = [];

            // Required fields.
            foreach ($requiredKeys as $key) {
                $value = $record->source_data[$key] ?? '';

                if (trim((string) $value) === '') {
                    $errors[] =
                        "Required column '{$key}' is empty " .
                        "(row {$record->row_number}).";
                }
            }

            // Format rules.
            foreach ($rules as $key => $rule) {
                $value = $record->source_data[$key] ?? '';
                $value = trim((string) $value);

                // Empty optional values are handled by requiredKeys.
                if ($value === '') {
                    continue;
                }

                if (
                    $rule === 'email' &&
                    filter_var($value, FILTER_VALIDATE_EMAIL) === false
                ) {
                    $errors[] =
                        "'{$key}' is not a valid email " .
                        "(row {$record->row_number}).";
                }

                if ($rule === 'date') {
                    if (! $this->isValidDate($value)) {
                        $errors[] =
                            "'{$key}' is not a valid date " .
                            "(row {$record->row_number}).";
                    }
                }
            }

            if (empty($errors)) {
                $record->update([
                    'status' => BatchRecordStatus::Valid->value,
                    'validation_errors' => null,
                ]);

                $summary['valid']++;

                continue;
            }

            $record->update([
                'status' => BatchRecordStatus::Invalid->value,
                'validation_errors' => $errors,
            ]);

            $summary['invalid']++;
            $summary['errors'][$record->row_number] = $errors;
        }

        $batch->update([
            'valid_records' => $summary['valid'],
            'invalid_records' => $summary['invalid'],
            'status' => BatchStatus::Validated->value,
        ]);

        $this->activityLog->log(
            ActivityAction::BatchValidated,
            $batch->organization_id,
            subject: $batch,
            metadata: $summary
        );

        return $summary;
    }

    /**
     * Strictly validate a date using YYYY-MM-DD format.
     */
    private function isValidDate(string $value): bool
    {
        // Strict format check first.
        if (! preg_match(
            '/^\d{4}-\d{2}-\d{2}$/',
            $value
        )) {
            return false;
        }

        [$year, $month, $day] = array_map(
            'intval',
            explode('-', $value)
        );

        return checkdate(
            $month,
            $day,
            $year
        );
    }

    /**
     * Load original uploaded CSV content.
     */
    public function loadBatchContents(
        CertificateBatch $batch
    ): string {
        return $this->storage->get(
            $batch->source_file_path
        ) ?? throw new RuntimeException(
            'Source file no longer exists.'
        );
    }
}