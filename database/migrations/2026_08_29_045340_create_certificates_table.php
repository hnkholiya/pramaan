<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('certificate_batch_id')->constrained()->cascadeOnDelete();
            $table->foreignId('batch_record_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('document_template_id')->constrained()->cascadeOnDelete();
            $table->foreignId('document_template_version_id')->constrained()->cascadeOnDelete();
            $table->string('certificate_number')->unique();
            $table->json('recipient_data');
            $table->string('pdf_path')->nullable();
            $table->string('pdf_hash')->nullable();
            $table->string('verification_token')->unique();
            $table->string('status')->default('generated'); // generated | issued | revoked
            $table->timestamp('issued_at')->nullable();
            $table->timestamps();

            $table->index(['organization_id', 'status']);
            $table->index(['certificate_batch_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
