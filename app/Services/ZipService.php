<?php

namespace App\Services;

use App\Enums\BatchStatus;
use App\Enums\CertificateStatus;
use App\Models\CertificateBatch;
use RuntimeException;
use ZipArchive;

class ZipService
{
    public function __construct(
        private StorageService $storage,
    ) {}

    /**
     * Create a ZIP containing all issued certificates for a batch.
     *
     * The ZIP is created in the system temporary directory and is
     * intended to be downloaded immediately. The application does
     * not persist a duplicate ZIP copy in the database/storage.
     *
     * @return array{path: string, filename: string, count: int}
     */
    public function createBatchZip(
        CertificateBatch $batch
    ): array {
        /*
         * ZIP download is available only after the batch has completed
         * certificate generation.
         */
        if (
            $batch->status !== BatchStatus::Completed
        ) {
            throw new RuntimeException(
                'Certificates are not ready for ZIP download yet.'
            );
        }

        /*
         * Only fully issued certificates with a stored PDF are included.
         */
        $certificates = $batch
            ->certificates()
            ->where(
                'status',
                CertificateStatus::Issued->value
            )
            ->whereNotNull('pdf_path')
            ->orderBy('id')
            ->get();

        if ($certificates->isEmpty()) {
            throw new RuntimeException(
                'No issued certificates are available for download.'
            );
        }

        /*
         * Do not silently create a partial ZIP when the batch is supposed
         * to contain all generated certificates.
         */
        $expectedCount = (int) $batch->valid_records;

        if (
            $expectedCount > 0 &&
            $certificates->count() !== $expectedCount
        ) {
            throw new RuntimeException(
                'Not all certificates are ready for ZIP download.'
            );
        }

        $zipPath = tempnam(
            sys_get_temp_dir(),
            'pramaan_zip_'
        );

        if ($zipPath === false) {
            throw new RuntimeException(
                'Unable to create a temporary ZIP file.'
            );
        }

        $zip = new ZipArchive();

        try {
            $opened = $zip->open($zipPath, ZipArchive::OVERWRITE);

            if ($opened !== true) {
                throw new RuntimeException(
                    'Unable to open ZIP archive.'
                );
            }

            foreach ($certificates as $certificate) {
                $pdfPath = (string) $certificate->pdf_path;

                $pdfContent = $this->storage->get($pdfPath);

                if ($pdfContent === null) {
                    throw new RuntimeException(
                        "Certificate PDF is missing: {$certificate->certificate_number}"
                    );
                }

                $filename =
                    $certificate->certificate_number.'.pdf';

                if (
                    $zip->addFromString(
                        $filename,
                        $pdfContent
                    ) === false
                ) {
                    throw new RuntimeException(
                        "Unable to add {$filename} to ZIP."
                    );
                }

                unset($pdfContent);
            }

            if (! $zip->close()) {
                throw new RuntimeException(
                    'Unable to finalize ZIP archive.'
                );
            }

            $safeBatchId = (int) $batch->id;

            return [
                'path' => $zipPath,
                'filename' =>
                    'pramaan-batch-'.$safeBatchId.'-certificates.zip',
                'count' => $certificates->count(),
            ];
        } catch (\Throwable $e) {
            /*
             * Close the archive when possible.
             */
            try {
                $zip->close();
            } catch (\Throwable) {
                // Ignore cleanup error.
            }

            /*
             * Remove partially-created ZIP.
             */
            if (is_file($zipPath)) {
                @unlink($zipPath);
            }

            throw $e;
        }
    }
}