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

    /**
     * Laravel should not endlessly retry a permanently broken job.
     */
    public int $tries = 5;

    public int $timeout = 60;

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
         * Already final.
         */
        if (
            $anchor->status === BlockchainStatus::Confirmed ||
            $anchor->status === BlockchainStatus::Failed
        ) {
            return;
        }

        /*
         * Cannot confirm without a transaction hash.
         */
        if (! $anchor->transaction_hash) {
            return;
        }

        try {
            $updated = $blockchain->confirmAnchor($anchor);

            $updated->refresh();

            if (
                $updated->status === BlockchainStatus::Confirmed ||
                $updated->status === BlockchainStatus::Failed
            ) {
                return;
            }

            /*
             * Still pending/confirming.
             *
             * Schedule another confirmation check.
             */
            if (
                $updated->status === BlockchainStatus::Confirming ||
                $updated->status === BlockchainStatus::Submitted
            ) {
                self::dispatch(
                    $updated->id
                )->delay(
                    now()->addSeconds(15)
                );
            }
        } catch (Throwable $e) {
            /*
             * Temporary RPC/network problems are retryable.
             *
             * Do not mark a valid transaction as failed merely because
             * the RPC was temporarily unavailable.
             */
            report($e);

            self::dispatch(
                $anchor->id
            )->delay(
                now()->addSeconds(30)
            );
        }
    }
}