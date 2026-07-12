<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('folders', function (Blueprint $table) {
            $table->boolean('is_images_folder')->default(false)->after('parent_id');
        });

        DB::table('folders')
            ->where('name', 'images')
            ->whereNull('parent_id')
            ->update(['is_images_folder' => true]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('folders', function (Blueprint $table) {
            $table->dropColumn('is_images_folder');
        });
    }
};
