<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('certificate_blockchain_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('certificate_id')->constrained()->cascadeOnDelete();
            $table->foreignId('merkle_anchor_id')->constrained()->cascadeOnDelete();
            $table->string('leaf_hash', 64);
            $table->json('proof');
            $table->string('merkle_root', 64);
            $table->timestamps();

            $table->unique(['certificate_id']);
            $table->index(['merkle_anchor_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificate_blockchain_records');
    }
};
