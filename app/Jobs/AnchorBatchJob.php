<?php

namespace App\Jobs;

use App\Models\CertificateBatch;
use App\Services\CertificateService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class AnchorBatchJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 300;
    public int $tries = 3;

    public function __construct(public CertificateBatch $batch)
    {
    }

    public function handle(CertificateService $certificates): void
    {
        $certificates->anchorBatch($this->batch);
    }
}
