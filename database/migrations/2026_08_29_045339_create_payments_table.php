<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('pricing_quote_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('certificate_batch_id')->constrained()->cascadeOnDelete();
            $table->string('provider')->default('razorpay');
            $table->string('provider_order_id')->nullable();
            $table->string('provider_payment_id')->nullable();
            $table->string('provider_signature')->nullable();
            $table->decimal('amount', 14, 2);
            $table->string('currency')->default('INR');
            $table->string('status')->default('created');
            // created | authorized | captured | failed | refunded
            $table->json('payload')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();

            $table->unique('provider_order_id');
            $table->index(['organization_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
