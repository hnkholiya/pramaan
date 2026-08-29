<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('certificate_batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('document_template_id')->constrained()->cascadeOnDelete();
            $table->foreignId('document_template_version_id')->nullable()->constrained()->nullOnDelete();
            $table->string('source_file_name');
            $table->string('source_file_path');
            $table->json('original_headers')->nullable();
            $table->unsignedInteger('total_records')->default(0);
            $table->unsignedInteger('valid_records')->default(0);
            $table->unsignedInteger('invalid_records')->default(0);
            $table->decimal('price_per_certificate', 12, 2)->nullable();
            $table->string('status')->default('draft');
            // draft | uploaded | validated | mapped | quoted | payment_pending | paid | processing | completed | failed
            $table->timestamps();

            $table->index(['organization_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificate_batches');
    }
};
