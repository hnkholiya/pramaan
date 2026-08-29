<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('template_assets', function (Blueprint $table) {
            $table->id();

            $table->foreignId('document_template_id')
                ->constrained('document_templates')
                ->cascadeOnDelete();

            $table->string('type', 30); // pdf, image
            $table->string('original_name');
            $table->string('mime_type', 100);
            $table->unsignedBigInteger('file_size');
            $table->string('path');

            $table->unsignedInteger('page_count')->nullable();
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();

            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->index([
                'document_template_id',
                'is_active',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('template_assets');
    }
};