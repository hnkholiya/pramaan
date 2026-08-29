<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('batch_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('certificate_batch_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('row_number');
            $table->json('source_data');
            $table->json('validation_errors')->nullable();
            $table->string('status')->default('pending'); // pending | valid | invalid | generated
            $table->timestamps();

            $table->unique(['certificate_batch_id', 'row_number']);
            $table->index(['certificate_batch_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('batch_records');
    }
};
