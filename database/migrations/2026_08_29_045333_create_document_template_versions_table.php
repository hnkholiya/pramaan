<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_template_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_template_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('version')->default(1);
            $table->unsignedInteger('canvas_width');
            $table->unsignedInteger('canvas_height');
            $table->string('orientation')->default('landscape');
            $table->json('snapshot');          // frozen element definitions
            $table->boolean('is_active')->default(false);
            $table->timestamps();

            $table->unique(['document_template_id', 'version']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_template_versions');
    }
};
