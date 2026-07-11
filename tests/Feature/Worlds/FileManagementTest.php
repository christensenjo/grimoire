<?php

use App\Models\File;
use App\Models\Folder;
use App\Models\SlugRedirect;
use App\Models\User;
use App\Models\World;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests cannot manage files', function () {
    $world = World::factory()->create();
    $file = File::factory()->for($world)->create();

    $this->post(route('worlds.files.store', $world), ['name' => 'Notes'])->assertRedirect(route('login', absolute: false));
    $this->get(route('worlds.files.show', [$world, $file]))->assertRedirect(route('login', absolute: false));
    $this->patch(route('worlds.files.update', [$world, $file]), ['name' => 'Renamed'])->assertRedirect(route('login', absolute: false));
    $this->delete(route('worlds.files.destroy', [$world, $file]))->assertRedirect(route('login', absolute: false));
});

test('user can create a file at world root and in a folder', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $folder = Folder::factory()->for($world)->create(['name' => 'Characters']);

    $this->actingAs($user)
        ->post(route('worlds.files.store', $world), [
            'name' => 'Scratchpad',
        ])
        ->assertRedirect();

    $rootFile = File::query()->where('name', 'Scratchpad')->firstOrFail();

    expect($rootFile)
        ->world_id->toBe($world->id)
        ->folder_id->toBeNull()
        ->format->toBe('document')
        ->content->toBe('');

    $response = $this->actingAs($user)
        ->post(route('worlds.files.store', $world), [
            'name' => 'Aria Vale',
            'folder_id' => $folder->id,
        ]);

    $nestedFile = File::query()->where('name', 'Aria Vale')->firstOrFail();

    $response->assertRedirect(route('worlds.files.show', [$world, $nestedFile], absolute: false));

    expect($nestedFile)
        ->slug->toBe('aria-vale')
        ->folder_id->toBe($folder->id);
});

test('file content round-trips through update and show', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $file = File::factory()->for($world)->create([
        'name' => 'Chronicle',
        'content' => '',
    ]);

    $markdown = <<<'MD'
# Chronicle

The river woke before dawn with **bold** and *italic* notes.

## Notes

- First beat
- Second beat

1. Ordered one
2. Ordered two

> A quiet quote from the bank.

```
const omen = true;
```
MD;

    $this->actingAs($user)
        ->patch(route('worlds.files.update', [$world, $file]), [
            'name' => 'Chronicle',
            'content' => $markdown,
        ])
        ->assertRedirect(route('worlds.files.show', [$world, $file], absolute: false));

    expect($file->refresh()->content)->toBe($markdown);

    $this->actingAs($user)
        ->get(route('worlds.files.show', [$world, $file]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('worlds/show')
            ->where('file.id', $file->id)
            ->where('file.name', 'Chronicle')
            ->where('file.content', $markdown)
            ->has('tree.files', 1)
        );
});

test('user can rename and move a file between folders', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $from = Folder::factory()->for($world)->create(['name' => 'Drafts']);
    $to = Folder::factory()->for($world)->create(['name' => 'Canon']);
    $file = File::factory()->for($world)->create([
        'name' => 'Old Title',
        'folder_id' => $from->id,
    ]);

    $this->actingAs($user)
        ->patch(route('worlds.files.update', [$world, $file]), [
            'name' => 'Canon Title',
            'folder_id' => $to->id,
            'content' => $file->content,
        ])
        ->assertRedirect('/worlds/'.$world->slug.'/files/canon-title');

    expect($file->refresh())
        ->name->toBe('Canon Title')
        ->slug->toBe('canon-title')
        ->folder_id->toBe($to->id);
});

test('user can delete a file', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $file = File::factory()->for($world)->create();

    $this->actingAs($user)
        ->delete(route('worlds.files.destroy', [$world, $file]))
        ->assertRedirect(route('worlds.show', $world, absolute: false));

    $this->assertDatabaseMissing('files', ['id' => $file->id]);
});

test('user cannot manage files in another users world', function () {
    $user = User::factory()->create();
    $world = World::factory()->create();
    $file = File::factory()->for($world)->create();

    $this->actingAs($user)
        ->post(route('worlds.files.store', $world), ['name' => 'Stolen'])
        ->assertNotFound();

    $this->actingAs($user)
        ->get(route('worlds.files.show', [$world, $file]))
        ->assertNotFound();

    $this->actingAs($user)
        ->patch(route('worlds.files.update', [$world, $file]), [
            'name' => 'Stolen',
            'content' => 'Nope',
        ])
        ->assertNotFound();

    $this->actingAs($user)
        ->delete(route('worlds.files.destroy', [$world, $file]))
        ->assertNotFound();
});

test('file cannot move into a folder from another world', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $otherWorld = World::factory()->for($user)->create();
    $foreignFolder = Folder::factory()->for($otherWorld)->create();
    $file = File::factory()->for($world)->create();

    $this->actingAs($user)
        ->from(route('worlds.files.show', [$world, $file]))
        ->patch(route('worlds.files.update', [$world, $file]), [
            'name' => $file->name,
            'folder_id' => $foreignFolder->id,
            'content' => $file->content,
        ])
        ->assertRedirect(route('worlds.files.show', [$world, $file], absolute: false))
        ->assertSessionHasErrors('folder_id');
});

test('file from another world cannot be addressed under this world', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $otherWorld = World::factory()->for($user)->create();
    $foreignFile = File::factory()->for($otherWorld)->create();

    $this->actingAs($user)
        ->get(route('worlds.files.show', [$world, $foreignFile]))
        ->assertNotFound();
});

test('file name is required', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();

    $this->actingAs($user)
        ->from(route('worlds.show', $world))
        ->post(route('worlds.files.store', $world), [
            'name' => '',
        ])
        ->assertRedirect(route('worlds.show', $world, absolute: false))
        ->assertSessionHasErrors('name');
});

test('file slugs are unique within a world', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $otherWorld = World::factory()->for($user)->create();

    $first = File::factory()->for($world)->create(['name' => 'Map']);
    $second = File::factory()->for($world)->create(['name' => 'Map']);
    $otherWorldFile = File::factory()->for($otherWorld)->create(['name' => 'Map']);

    expect($first->slug)->toBe('map')
        ->and($second->slug)->toBe('map-2')
        ->and($otherWorldFile->slug)->toBe('map');
});

test('file rename creates a redirect to the canonical file url', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create(['name' => 'World']);
    $file = File::factory()->for($world)->create(['name' => 'Old File']);

    $this->actingAs($user)
        ->patch(route('worlds.files.update', [$world, $file]), [
            'name' => 'New File',
            'content' => $file->content,
        ])
        ->assertRedirect('/worlds/world/files/new-file');

    $this->actingAs($user)
        ->get('/worlds/world/files/old-file')
        ->assertRedirect('/worlds/world/files/new-file')
        ->assertMovedPermanently();
});

test('live file slug reclaims redirect history', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $file = File::factory()->for($world)->create(['name' => 'Old File']);

    $this->actingAs($user)->patch(route('worlds.files.update', [$world, $file]), [
        'name' => 'New File',
        'content' => $file->content,
    ]);

    $replacement = File::factory()->for($world)->create(['name' => 'Old File']);

    expect($replacement->slug)->toBe('old-file');
    $this->assertDatabaseMissing('slug_redirects', [
        'redirectable_type' => (new File)->getMorphClass(),
        'world_id' => $world->id,
        'from_slug' => 'old-file',
    ]);
});

test('file delete removes slug redirect history', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $file = File::factory()->for($world)->create(['name' => 'Old File']);

    $this->actingAs($user)->patch(route('worlds.files.update', [$world, $file]), [
        'name' => 'New File',
        'content' => $file->content,
    ]);

    expect(SlugRedirect::query()->count())->toBe(1);

    $file->refresh()->delete();

    expect(SlugRedirect::query()->count())->toBe(0);
});

test('file name must be slugifiable', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();

    $this->actingAs($user)
        ->from(route('worlds.show', $world))
        ->post(route('worlds.files.store', $world), [
            'name' => '!!!',
        ])
        ->assertRedirect(route('worlds.show', $world, absolute: false))
        ->assertSessionHasErrors('name');
});
