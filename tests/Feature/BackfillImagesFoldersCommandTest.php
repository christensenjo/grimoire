<?php

use App\Models\Folder;
use App\Models\World;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;

uses(RefreshDatabase::class);

test('the migration adds the images folder marker without changing existing folders', function () {
    $migration = require database_path('migrations/2026_07_12_042834_add_is_images_folder_to_folders_table.php');
    $migration->down();

    $folder = Folder::factory()->create(['name' => 'images']);

    try {
        $migration->up();

        expect(Schema::hasColumn('folders', 'is_images_folder'))->toBeTrue()
            ->and($folder->refresh()->is_images_folder)->toBeFalse();

        $migration->down();

        expect(Schema::hasColumn('folders', 'is_images_folder'))->toBeFalse();
    } finally {
        if (!Schema::hasColumn('folders', 'is_images_folder')) {
            $migration->up();
        }
    }
});

test('audit reports the root images folder without changing it', function () {
    $world = World::factory()->create();
    $imagesFolder = Folder::factory()->for($world)->create(['name' => 'images']);

    $this->artisan('worlds:backfill-images-folders')
        ->expectsOutputToContain('1 would be marked')
        ->assertSuccessful();

    expect($imagesFolder->refresh()->is_images_folder)->toBeFalse();
});

test('apply marks only root images folders in their own worlds and is idempotent', function () {
    $firstWorld = World::factory()->create();
    $secondWorld = World::factory()->create();
    $firstImagesFolder = Folder::factory()->for($firstWorld)->create(['name' => 'images']);
    $similarFolder = Folder::factory()->for($firstWorld)->create(['name' => 'images 2']);
    $secondImagesFolder = Folder::factory()->for($secondWorld)->create(['name' => 'images']);

    $this->artisan('worlds:backfill-images-folders --apply')
        ->expectsOutputToContain('2 marked')
        ->assertSuccessful();

    $this->artisan('worlds:backfill-images-folders --apply')
        ->expectsOutputToContain('2 already correct')
        ->assertSuccessful();

    expect($firstImagesFolder->refresh()->is_images_folder)->toBeTrue()
        ->and($secondImagesFolder->refresh()->is_images_folder)->toBeTrue()
        ->and($similarFolder->refresh()->is_images_folder)->toBeFalse();
});

test('apply leaves an already correct world unchanged', function () {
    $world = World::factory()->create();
    $imagesFolder = Folder::factory()->for($world)->create(['name' => 'images']);
    $imagesFolder->forceFill(['is_images_folder' => true])->save();

    $this->artisan('worlds:backfill-images-folders --apply')
        ->expectsOutputToContain('1 already correct')
        ->assertSuccessful();

    expect($imagesFolder->refresh()->is_images_folder)->toBeTrue();
});

test('multiple marked folders are reported and left unchanged', function () {
    $world = World::factory()->create();
    $firstFolder = Folder::factory()->for($world)->create(['name' => 'images']);
    $secondFolder = Folder::factory()->for($world)->create(['name' => 'art']);
    $firstFolder->forceFill(['is_images_folder' => true])->save();
    $secondFolder->forceFill(['is_images_folder' => true])->save();

    $this->artisan('worlds:backfill-images-folders --apply')
        ->expectsOutputToContain("Unresolved world IDs: {$world->id}")
        ->assertFailed();

    expect($world->folders()->where('is_images_folder', true)->count())->toBe(2);
});

test('missing and non-root images candidates are reported without mutation', function () {
    $missingWorld = World::factory()->create();
    $nestedWorld = World::factory()->create();
    $parent = Folder::factory()->for($nestedWorld)->create(['name' => 'Assets']);
    $nestedImages = Folder::factory()->for($nestedWorld)->create([
        'name' => 'images',
        'parent_id' => $parent->id,
    ]);

    $this->artisan('worlds:backfill-images-folders --apply')
        ->expectsOutputToContain("Unresolved world IDs: {$missingWorld->id}, {$nestedWorld->id}")
        ->assertFailed();

    expect($nestedImages->refresh()->is_images_folder)->toBeFalse();
});
