<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('merkle_anchors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('certificate_batch_id')->constrained()->cascadeOnDelete();
            $table->string('hash_algorithm')->default('SHA-256');
            $table->unsignedInteger('merkle_version')->default(1);
            $table->unsignedInteger('leaf_count')->default(0);
            $table->string('merkle_root', 64);
            $table->string('status')->default('pending');
            // pending | submitted | confirming | confirmed | failed
            $table->string('network')->nullable();
            $table->string('chain_id')->nullable();
            $table->string('contract_address')->nullable();
            $table->string('transaction_hash')->nullable()->unique();
            $table->unsignedBigInteger('block_number')->nullable();
            $table->string('failure_reason')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamps();

            $table->unique(['certificate_batch_id']);
            $table->index(['organization_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('merkle_anchors');
    }
};
