<?php

namespace App\Services;

use App\Enums\ActivityAction;
use App\Enums\BatchStatus;
use App\Models\BatchFieldMapping;
use App\Models\CertificateBatch;
use RuntimeException;

class FieldMappingService
{
    public function __construct(
        private ActivityLogService $activityLog,
    ) {}

    /**
     * Store the explicit CSV-column -> template-field mapping.
     * The mapping is validated before persistence.
     */
    public function saveMapping(CertificateBatch $batch, array $mapping, ?int $mappedBy = null): BatchFieldMapping
    {
        if (! in_array($batch->status->value, [BatchStatus::Validated->value, BatchStatus::Mapped->value, BatchStatus::Quoted->value], true)) {
            throw new RuntimeException('Batch must be validated before mapping fields.');
        }

        $headers = $batch->original_headers ?? [];

        // Validate every CSV source column exists.
        foreach (array_keys($mapping) as $sourceColumn) {
            if (! in_array($sourceColumn, $headers, true)) {
                throw new RuntimeException("CSV column '{$sourceColumn}' does not exist.");
            }
        }

        $record = $batch->fieldMapping()->firstOrNew([]);
        $record->certificate_batch_id = $batch->id;
        $record->mapping = $mapping;
        $record->mapped_by = $mappedBy;
        $record->save();

        if ($batch->status === BatchStatus::Validated) {
            $batch->update(['status' => BatchStatus::Mapped->value]);
        }

        $this->activityLog->log(ActivityAction::BatchFieldMapped, $batch->organization_id, subject: $batch, metadata: $mapping);

        return $record;
    }

    /**
     * Verify that all required template dynamic fields are covered by the mapping.
     *
     * @param string[] $requiredFields
     */
    public function assertCoverage(CertificateBatch $batch, array $requiredFields): void
    {
        $mapping = $batch->fieldMapping?->mapping ?? [];
        $missing = array_diff($requiredFields, array_values($mapping));

        if (! empty($missing)) {
            throw new RuntimeException(
                'Field mapping does not cover required template fields: '.implode(', ', $missing)
            );
        }
    }
}
