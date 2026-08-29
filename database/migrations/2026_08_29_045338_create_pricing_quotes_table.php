<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pricing_quotes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('certificate_batch_id')->constrained()->cascadeOnDelete();
            $table->string('currency')->default('INR');
            $table->decimal('price_per_certificate', 12, 2)->default(0);
            $table->unsignedInteger('certificate_count')->default(0);
            $table->decimal('subtotal', 14, 2)->default(0);
            $table->decimal('tax_rate', 6, 2)->default(0);
            $table->decimal('tax', 14, 2)->default(0);
            $table->decimal('total', 14, 2)->default(0);
            $table->string('status')->default('pending'); // pending | paid | failed | cancelled
            $table->timestamps();

            $table->index(['organization_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pricing_quotes');
    }
};
