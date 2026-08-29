<?php

namespace App\Providers;

use App\Services\Blockchain\ArbitrumBlockchainProvider;
use App\Services\Blockchain\BlockchainProviderInterface;
use App\Services\Blockchain\MockBlockchainProvider;
use App\Services\Payment\MockPaymentProvider;
use App\Services\Payment\PaymentProviderInterface;
use App\Services\Payment\RazorpayPaymentProvider;
use Illuminate\Support\ServiceProvider;

class PramaanServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(PaymentProviderInterface::class, function ($app) {
            $provider = config('payments.provider', 'mock');

            if ($provider === 'razorpay' && config('payments.razorpay.key_id') && config('payments.razorpay.key_secret')) {
                return new RazorpayPaymentProvider();
            }

            return new MockPaymentProvider();
        });

        $this->app->singleton(BlockchainProviderInterface::class, function ($app) {
            $provider = config('blockchain.provider', 'mock');

            if ($provider === 'arbitrum' && config('blockchain.arbitrum.rpc_url') && config('blockchain.arbitrum.contract_address')) {
                return new ArbitrumBlockchainProvider();
            }

            return new MockBlockchainProvider();
        });
    }

    public function boot(): void
    {
        //
    }
}
