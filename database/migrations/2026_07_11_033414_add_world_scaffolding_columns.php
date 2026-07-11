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
        Schema::table('worlds', function (Blueprint $table) {
            $table->timestamp('last_accessed_at')->nullable()->after('description');
            $table->index(['user_id', 'last_accessed_at']);
        });

        Schema::table('files', function (Blueprint $table) {
            $table->boolean('is_scratchpad')->default(false)->after('format');
        });

        $this->backfillWorldDefaults();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('files', function (Blueprint $table) {
            $table->dropColumn('is_scratchpad');
        });

        Schema::table('worlds', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'last_accessed_at']);
            $table->dropColumn('last_accessed_at');
        });
    }

    protected function backfillWorldDefaults(): void
    {
        $now = now();

        DB::table('worlds')->orderBy('id')->lazyById()->each(function (object $world) use ($now): void {
            $hasImagesFolder = DB::table('folders')
                ->where('world_id', $world->id)
                ->where('name', 'images')
                ->whereNull('parent_id')
                ->exists();

            if (!$hasImagesFolder) {
                DB::table('folders')->insert([
                    'world_id' => $world->id,
                    'parent_id' => null,
                    'name' => 'images',
                    'slug' => $this->uniqueFolderSlug((int) $world->id, 'images'),
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }

            $hasScratchpad = DB::table('files')
                ->where('world_id', $world->id)
                ->where('is_scratchpad', true)
                ->exists();

            if (!$hasScratchpad) {
                DB::table('files')->insert([
                    'world_id' => $world->id,
                    'folder_id' => null,
                    'name' => 'Scratchpad',
                    'slug' => $this->uniqueFileSlug((int) $world->id, 'scratchpad'),
                    'content' => '',
                    'format' => 'document',
                    'is_scratchpad' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        });
    }

    protected function uniqueFolderSlug(int $worldId, string $base): string
    {
        $slug = $base;
        $suffix = 2;

        while (DB::table('folders')->where('world_id', $worldId)->where('slug', $slug)->exists()) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }

    protected function uniqueFileSlug(int $worldId, string $base): string
    {
        $slug = $base;
        $suffix = 2;

        while (DB::table('files')->where('world_id', $worldId)->where('slug', $slug)->exists()) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
};
