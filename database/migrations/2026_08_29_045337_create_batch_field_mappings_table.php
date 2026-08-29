<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('batch_field_mappings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('certificate_batch_id')->constrained()->cascadeOnDelete();
            $table->json('mapping'); // { "name": "recipient_name", "course": "course_name", ... }
            $table->unsignedBigInteger('mapped_by')->nullable();
            $table->timestamps();

            $table->index('certificate_batch_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('batch_field_mappings');
    }
};
