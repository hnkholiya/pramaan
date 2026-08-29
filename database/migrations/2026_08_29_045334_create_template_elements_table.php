<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('template_elements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_template_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // TEXT | DYNAMIC_FIELD | IMAGE | CERTIFICATE_NUMBER | VERIFICATION_URL | QR_CODE
            $table->string('name');
            $table->string('data_key')->nullable(); // for DYNAMIC_FIELD
            $table->json('config')->nullable();     // defaults, qr payload, etc.
            $table->json('position');               // {x, y}
            $table->json('size');                   // {width, height}
            $table->json('styles')->nullable();     // font, size, color, align, bold, etc.
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['document_template_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('template_elements');
    }
};
