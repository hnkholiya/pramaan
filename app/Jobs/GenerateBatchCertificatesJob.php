<?php

namespace App\Jobs;

use App\Models\CertificateBatch;
use App\Services\CertificateService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateBatchCertificatesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 900;
    public int $tries = 1;

    public function __construct(public CertificateBatch $batch)
    {
    }

    public function handle(CertificateService $certificates): void
    {
        $certificates->generateBatchCertificates($this->batch);
    }
}
