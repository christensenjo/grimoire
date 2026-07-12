<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('file_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('source_file_id')->constrained('files')->cascadeOnDelete();
            $table->unsignedBigInteger('target_file_id');
            $table->timestamps();

            $table->unique(['source_file_id', 'target_file_id']);
            $table->index('target_file_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('file_links');
    }
};
