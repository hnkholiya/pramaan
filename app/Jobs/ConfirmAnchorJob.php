<?php

namespace App\Jobs;

use App\Enums\BlockchainStatus;
use App\Models\MerkleAnchor;
use App\Services\Blockchain\BlockchainService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Throwable;

class ConfirmAnchorJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 10;

    public int $timeout = 120;

    public function __construct(
        public int $anchorId
    ) {
    }

    public function handle(
        BlockchainService $blockchain
    ): void {
        $anchor = MerkleAnchor::find($this->anchorId);

        if (! $anchor) {
            return;
        }

        /*
         * Already final — nothing more to do.
         */
        if (
            $anchor->status === BlockchainStatus::Confirmed
        ) {
            return;
        }

        if (! $anchor->transaction_hash) {
            return;
        }

        try {
            $blockchain->confirmAnchor($anchor);

            $anchor->refresh();

            /*
             * If still confirming, run this job again later.
             */
            if (
                $anchor->status === BlockchainStatus::Confirming
            ) {
                self::dispatch($anchor->id)
                    ->delay(now()->addSeconds(15));
            }
        } catch (Throwable $e) {
            report($e);

            /*
             * Temporary RPC/network errors should not immediately
             * destroy a valid blockchain transaction.
             */
            self::dispatch($anchor->id)
                ->delay(now()->addSeconds(30));
        }
    }
}