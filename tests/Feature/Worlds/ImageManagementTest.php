<?php

use App\Actions\SeedWorldDefaults;
use App\Models\File;
use App\Models\Folder;
use App\Models\Image;
use App\Models\User;
use App\Models\World;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    Storage::fake('local');
});

test('user can upload an image into the world images folder', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    app(SeedWorldDefaults::class)($world);

    $response = $this->actingAs($user)
        ->postJson(route('worlds.images.store', $world), [
            'image' => UploadedFile::fake()->image('city-map.jpg', 1200, 800),
        ]);

    $image = Image::query()->sole();
    $imagesFolder = $world->folders()->where('name', 'images')->sole();

    $response
        ->assertCreated()
        ->assertJsonPath('image.id', $image->id)
        ->assertJsonPath('image.url', route('images.show', $image));

    expect($image)
        ->world_id->toBe($world->id)
        ->folder_id->toBe($imagesFolder->id)
        ->original_name->toBe('city-map.jpg')
        ->mime_type->toBe('image/jpeg')
        ->size->toBeGreaterThan(0);

    Storage::disk('local')->assertExists($image->path);
});

test('owner can load an uploaded image', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    app(SeedWorldDefaults::class)($world);

    $this->actingAs($user)->postJson(route('worlds.images.store', $world), [
        'image' => UploadedFile::fake()->image('portrait.png'),
    ])->assertCreated();

    $image = Image::query()->sole();

    $this->actingAs($user)
        ->get(route('images.show', $image))
        ->assertOk()
        ->assertHeader('content-type', 'image/png');
});

test('an uploaded image reference survives file save and reload', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    app(SeedWorldDefaults::class)($world);
    $file = File::factory()->for($world)->create(['name' => 'Atlas']);

    $this->actingAs($user)->postJson(route('worlds.images.store', $world), [
        'image' => UploadedFile::fake()->image('map.png'),
    ])->assertCreated();

    $image = Image::query()->sole();
    $markdown = '![map]('.route('images.show', $image).')';

    $this->actingAs($user)
        ->patch(route('worlds.files.update', [$world, $file]), [
            'name' => $file->name,
            'folder_id' => null,
            'content' => $markdown,
        ])
        ->assertRedirect();

    $this->actingAs($user)
        ->get(route('worlds.files.show', [$world, $file]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('file.content', $markdown)
        );
});

test('another user is forbidden from loading an image', function () {
    $owner = User::factory()->create();
    $world = World::factory()->for($owner)->create();
    app(SeedWorldDefaults::class)($world);

    $this->actingAs($owner)->postJson(route('worlds.images.store', $world), [
        'image' => UploadedFile::fake()->image('portrait.png'),
    ])->assertCreated();

    $this->actingAs(User::factory()->create())
        ->get(route('images.show', Image::query()->sole()))
        ->assertForbidden();
});

test('another user cannot upload an image to the world', function () {
    $owner = User::factory()->create();
    $world = World::factory()->for($owner)->create();
    app(SeedWorldDefaults::class)($world);

    $this->actingAs(User::factory()->create())
        ->postJson(route('worlds.images.store', $world), [
            'image' => UploadedFile::fake()->image('portrait.png'),
        ])
        ->assertNotFound();

    expect(Image::query()->count())->toBe(0);
});

test('image uploads reject non-images and oversized files', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    app(SeedWorldDefaults::class)($world);

    $this->actingAs($user)
        ->postJson(route('worlds.images.store', $world), [
            'image' => UploadedFile::fake()->create('notes.txt', 10, 'text/plain'),
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('image');

    $this->actingAs($user)
        ->postJson(route('worlds.images.store', $world), [
            'image' => UploadedFile::fake()->create('huge.jpg', 10_241, 'image/jpeg'),
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('image');

    expect(Image::query()->count())->toBe(0);
});

test('the default images folder cannot be deleted and orphan stored images', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    app(SeedWorldDefaults::class)($world);

    $this->actingAs($user)->postJson(route('worlds.images.store', $world), [
        'image' => UploadedFile::fake()->image('map.png'),
    ])->assertCreated();

    $image = Image::query()->sole();
    $imagesFolder = $world->folders()->where('is_images_folder', true)->sole();

    $this->actingAs($user)
        ->delete(route('worlds.folders.destroy', [$world, $imagesFolder]))
        ->assertForbidden();

    Storage::disk('local')->assertExists($image->path);
    expect($image->fresh())->not->toBeNull();
});

test('deleting a folder removes any stored images associated with it', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $folder = Folder::factory()->for($world)->create();
    $childFolder = Folder::factory()->for($world)->create(['parent_id' => $folder->id]);
    $image = Image::factory()->for($world)->for($folder)->create();
    $nestedImage = Image::factory()->for($world)->for($childFolder)->create();
    Storage::disk('local')->put($image->path, 'image contents');
    Storage::disk('local')->put($nestedImage->path, 'nested image contents');

    $this->actingAs($user)
        ->delete(route('worlds.folders.destroy', [$world, $folder]))
        ->assertRedirect();

    Storage::disk('local')->assertMissing($image->path);
    Storage::disk('local')->assertMissing($nestedImage->path);
    expect($image->fresh())->toBeNull()
        ->and($nestedImage->fresh())->toBeNull();
});

test('deleting a world removes its stored images', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    app(SeedWorldDefaults::class)($world);

    $this->actingAs($user)->postJson(route('worlds.images.store', $world), [
        'image' => UploadedFile::fake()->image('map.png'),
    ])->assertCreated();

    $image = Image::query()->sole();

    Storage::disk('local')->assertExists($image->path);

    $this->actingAs($user)
        ->delete(route('worlds.destroy', $world))
        ->assertRedirect(route('worlds.index', absolute: false));

    Storage::disk('local')->assertMissing($image->path);
    expect(Image::query()->count())->toBe(0);
});

test('image factory keeps its folder in the same world', function () {
    $image = Image::factory()->create();

    expect($image->folder->world_id)->toBe($image->world_id);
});
