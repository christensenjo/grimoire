<?php

use App\Actions\SeedWorldDefaults;
use App\Models\File;
use App\Models\Folder;
use App\Models\User;
use App\Models\World;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('creating a world seeds an images folder and exactly one scratchpad file', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post(route('worlds.store'), [
        'name' => 'Sunbreak Archipelago',
        'description' => 'Tide-locked islands.',
    ])->assertRedirect();

    $world = World::query()->where('name', 'Sunbreak Archipelago')->firstOrFail();

    $imagesFolder = $world->folders()->where('name', 'images')->whereNull('parent_id')->sole();
    $scratchpads = $world->files()->where('is_scratchpad', true)->get();

    expect($scratchpads)->toHaveCount(1);

    $scratchpad = $scratchpads->first();

    expect($scratchpad)
        ->name->toBe('Scratchpad')
        ->folder_id->toBeNull()
        ->format->toBe('document')
        ->content->toBe('')
        ->and($imagesFolder->slug)->toBe('images')
        ->and($imagesFolder->is_images_folder)->toBeTrue()
        ->and($scratchpad->slug)->toBe('scratchpad');
});

test('seed world defaults is idempotent and backfills a world missing scaffolding', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create(['name' => 'Glassreach']);

    expect($world->folders)->toHaveCount(0)
        ->and($world->files)->toHaveCount(0);

    $seed = app(SeedWorldDefaults::class);

    $seed($world);
    $seed($world);

    expect($world->folders()->where('name', 'images')->whereNull('parent_id')->count())->toBe(1)
        ->and($world->files()->where('is_scratchpad', true)->count())->toBe(1);
});

test('scratchpad cannot be deleted', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    app(SeedWorldDefaults::class)($world);

    $scratchpad = $world->files()->where('is_scratchpad', true)->sole();

    $this->actingAs($user)
        ->delete(route('worlds.files.destroy', [$world, $scratchpad]))
        ->assertForbidden();

    expect(File::query()->whereKey($scratchpad->id)->exists())->toBeTrue();
});

test('ordinary files can still be deleted', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    app(SeedWorldDefaults::class)($world);

    $file = File::factory()->for($world)->create(['name' => 'Chronicle']);

    $this->actingAs($user)
        ->delete(route('worlds.files.destroy', [$world, $file]))
        ->assertRedirect(route('worlds.show', $world, absolute: false));

    expect(File::query()->whereKey($file->id)->exists())->toBeFalse();
});

test('scratchpad cannot be moved into a folder but can be renamed and edited', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    app(SeedWorldDefaults::class)($world);

    $folder = Folder::factory()->for($world)->create(['name' => 'Characters']);
    $scratchpad = $world->files()->where('is_scratchpad', true)->sole();

    $this->actingAs($user)
        ->from(route('worlds.files.show', [$world, $scratchpad]))
        ->patch(route('worlds.files.update', [$world, $scratchpad]), [
            'name' => 'Scratchpad',
            'folder_id' => $folder->id,
            'content' => 'A fleeting thought.',
        ])
        ->assertRedirect(route('worlds.files.show', [$world, $scratchpad], absolute: false))
        ->assertSessionHasErrors('folder_id');

    expect($scratchpad->refresh())
        ->folder_id->toBeNull()
        ->content->toBe('');

    $response = $this->actingAs($user)
        ->patch(route('worlds.files.update', [$world, $scratchpad]), [
            'name' => 'Quick Notes',
            'folder_id' => null,
            'content' => 'A fleeting thought.',
        ]);

    $scratchpad->refresh();

    $response->assertRedirect(route('worlds.files.show', [$world, $scratchpad], absolute: false));

    expect($scratchpad)
        ->name->toBe('Quick Notes')
        ->slug->toBe('quick-notes')
        ->folder_id->toBeNull()
        ->content->toBe('A fleeting thought.')
        ->is_scratchpad->toBeTrue();
});

test('is_scratchpad cannot be injected via store or update requests', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    app(SeedWorldDefaults::class)($world);

    $this->actingAs($user)
        ->post(route('worlds.files.store', $world), [
            'name' => 'Another Scratchpad',
            'is_scratchpad' => true,
        ])
        ->assertRedirect();

    $created = File::query()->where('name', 'Another Scratchpad')->firstOrFail();

    expect($created->is_scratchpad)->toBeFalse()
        ->and($world->files()->where('is_scratchpad', true)->count())->toBe(1);

    $this->actingAs($user)
        ->patch(route('worlds.files.update', [$world, $created]), [
            'name' => 'Another Scratchpad',
            'is_scratchpad' => true,
            'content' => 'Nope.',
        ])
        ->assertRedirect();

    expect($created->refresh()->is_scratchpad)->toBeFalse()
        ->and($world->files()->where('is_scratchpad', true)->count())->toBe(1);
});

test('visiting a world or file updates last_accessed_at without changing updated_at', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    app(SeedWorldDefaults::class)($world);

    $originalUpdatedAt = $world->updated_at->copy();

    $this->travel(5)->minutes();

    $this->actingAs($user)
        ->get(route('worlds.show', $world))
        ->assertOk();

    $world->refresh();

    expect($world->last_accessed_at)->not->toBeNull()
        ->and($world->updated_at->eq($originalUpdatedAt))->toBeTrue();

    $accessedAfterShow = $world->last_accessed_at->copy();
    $scratchpad = $world->files()->where('is_scratchpad', true)->sole();

    $this->travel(3)->minutes();

    $this->actingAs($user)
        ->get(route('worlds.files.show', [$world, $scratchpad]))
        ->assertOk();

    $world->refresh();

    expect($world->last_accessed_at->gt($accessedAfterShow))->toBeTrue()
        ->and($world->updated_at->eq($originalUpdatedAt))->toBeTrue();
});

test('dashboard resolves the most recently active world scratchpad', function () {
    $user = User::factory()->create();
    $worldA = World::factory()->for($user)->create(['name' => 'Marrow Falls']);
    $worldB = World::factory()->for($user)->create(['name' => 'Sunbreak Archipelago']);
    $seed = app(SeedWorldDefaults::class);
    $seed($worldA);
    $seed($worldB);

    $this->actingAs($user)->get(route('worlds.show', $worldA))->assertOk();
    $this->travel(1)->seconds();
    $this->actingAs($user)->get(route('worlds.show', $worldB))->assertOk();

    $scratchpadB = $worldB->files()->where('is_scratchpad', true)->sole();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('recentScratchpad.worldSlug', $worldB->slug)
            ->where('recentScratchpad.worldName', 'Sunbreak Archipelago')
            ->where('recentScratchpad.fileSlug', $scratchpadB->slug)
            ->where('recentScratchpad.fileName', $scratchpadB->name)
            ->where('recentScratchpad.content', $scratchpadB->content ?? '')
            ->has('worlds', 2)
            ->where('worlds.0.scratchpadSlug', fn ($slug) => is_string($slug) && $slug !== '')
            ->where('worlds.1.scratchpadSlug', fn ($slug) => is_string($slug) && $slug !== '')
        );
});

test('world and file show request dashboard prefetch invalidation when access order changes', function () {
    $user = User::factory()->create();
    $worldA = World::factory()->for($user)->create(['name' => 'Marrow Falls']);
    $worldB = World::factory()->for($user)->create(['name' => 'Sunbreak Archipelago']);
    $seed = app(SeedWorldDefaults::class);
    $seed($worldA);
    $seed($worldB);

    $fileA = File::factory()->for($worldA)->create(['name' => 'Notes']);

    $this->actingAs($user)->get(route('worlds.show', $worldB))->assertOk();
    $this->travel(1)->seconds();

    $this->actingAs($user)
        ->get(route('worlds.show', $worldA))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('worlds/show')
            ->where('invalidateDashboardPrefetch', true)
        );

    $this->travel(1)->seconds();

    $this->actingAs($user)
        ->get(route('worlds.files.show', [$worldA, $fileA]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('worlds/show')
            ->where('invalidateDashboardPrefetch', false)
        );

    $this->actingAs($user)
        ->get(route('worlds.show', $worldA))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('worlds/show')
            ->where('invalidateDashboardPrefetch', false)
        );
});

test('dashboard scratchpad can be edited without leaving the dashboard', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create(['name' => 'Marrow Falls']);
    app(SeedWorldDefaults::class)($world);
    $scratchpad = $world->files()->where('is_scratchpad', true)->sole();

    $this->actingAs($user)
        ->from(route('dashboard'))
        ->patch(route('worlds.files.update', [$world, $scratchpad]), [
            'name' => $scratchpad->name,
            'folder_id' => null,
            'content' => 'A note from the dashboard.',
        ])
        ->assertRedirect(route('dashboard', absolute: false));

    expect($scratchpad->refresh()->content)->toBe('A note from the dashboard.');
});

test('dashboard can switch to another world scratchpad via query', function () {
    $user = User::factory()->create();
    $worldA = World::factory()->for($user)->create(['name' => 'Marrow Falls']);
    $worldB = World::factory()->for($user)->create(['name' => 'Sunbreak Archipelago']);
    $seed = app(SeedWorldDefaults::class);
    $seed($worldA);
    $seed($worldB);

    $scratchpadA = $worldA->files()->where('is_scratchpad', true)->sole();
    $scratchpadA->update(['content' => 'Notes for Marrow Falls.']);

    $this->actingAs($user)->get(route('worlds.show', $worldB))->assertOk();

    $this->actingAs($user)
        ->get(route('dashboard', ['scratchpad' => $worldA->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('recentScratchpad.worldSlug', $worldA->slug)
            ->where('recentScratchpad.content', 'Notes for Marrow Falls.')
        );
});

test('dashboard has a null recent scratchpad when the user has no worlds', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('recentScratchpad', null)
            ->has('worlds', 0)
        );
});
