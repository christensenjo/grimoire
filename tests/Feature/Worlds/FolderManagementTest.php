<?php

use App\Models\File;
use App\Models\Folder;
use App\Models\User;
use App\Models\World;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests cannot manage folders', function () {
    $world = World::factory()->create();
    $folder = Folder::factory()->for($world)->create();

    $this->post(route('worlds.folders.store', $world), ['name' => 'Places'])->assertRedirect(route('login', absolute: false));
    $this->patch(route('worlds.folders.update', [$world, $folder]), ['name' => 'Renamed'])->assertRedirect(route('login', absolute: false));
    $this->delete(route('worlds.folders.destroy', [$world, $folder]))->assertRedirect(route('login', absolute: false));
});

test('user can create a root folder in their world', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();

    $this->actingAs($user)
        ->post(route('worlds.folders.store', $world), [
            'name' => 'Characters',
        ])
        ->assertRedirect(route('worlds.show', $world, absolute: false));

    $folder = Folder::query()->where('name', 'Characters')->firstOrFail();

    expect($folder)
        ->world_id->toBe($world->id)
        ->parent_id->toBeNull();
});

test('user can nest rename and move folders', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $parent = Folder::factory()->for($world)->create(['name' => 'Places']);
    $child = Folder::factory()->for($world)->create([
        'name' => 'Cities',
        'parent_id' => $parent->id,
    ]);

    $this->actingAs($user)
        ->patch(route('worlds.folders.update', [$world, $child]), [
            'name' => 'River Cities',
            'parent_id' => null,
        ])
        ->assertRedirect(route('worlds.show', $world, absolute: false));

    expect($child->refresh())
        ->name->toBe('River Cities')
        ->parent_id->toBeNull();

    $this->actingAs($user)
        ->patch(route('worlds.folders.update', [$world, $child]), [
            'name' => 'River Cities',
            'parent_id' => $parent->id,
        ])
        ->assertRedirect(route('worlds.show', $world, absolute: false));

    expect($child->refresh()->parent_id)->toBe($parent->id);
});

test('moving a folder into itself or a descendant is rejected', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $parent = Folder::factory()->for($world)->create(['name' => 'Parent']);
    $child = Folder::factory()->for($world)->create([
        'name' => 'Child',
        'parent_id' => $parent->id,
    ]);
    $grandchild = Folder::factory()->for($world)->create([
        'name' => 'Grandchild',
        'parent_id' => $child->id,
    ]);

    $this->actingAs($user)
        ->from(route('worlds.show', $world))
        ->patch(route('worlds.folders.update', [$world, $parent]), [
            'name' => 'Parent',
            'parent_id' => $parent->id,
        ])
        ->assertRedirect(route('worlds.show', $world, absolute: false))
        ->assertSessionHasErrors('parent_id');

    $this->actingAs($user)
        ->from(route('worlds.show', $world))
        ->patch(route('worlds.folders.update', [$world, $parent]), [
            'name' => 'Parent',
            'parent_id' => $grandchild->id,
        ])
        ->assertRedirect(route('worlds.show', $world, absolute: false))
        ->assertSessionHasErrors('parent_id');

    expect($parent->refresh()->parent_id)->toBeNull();
});

test('deleting a folder cascades to nested folders and files', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $parent = Folder::factory()->for($world)->create(['name' => 'Lore']);
    $child = Folder::factory()->for($world)->create([
        'name' => 'Myths',
        'parent_id' => $parent->id,
    ]);
    $nestedFile = File::factory()->for($world)->create([
        'name' => 'Origin Myth',
        'folder_id' => $child->id,
    ]);
    $rootFile = File::factory()->for($world)->create([
        'name' => 'Scratch Notes',
        'folder_id' => null,
    ]);

    $this->actingAs($user)
        ->delete(route('worlds.folders.destroy', [$world, $parent]))
        ->assertRedirect(route('worlds.show', $world, absolute: false));

    $this->assertDatabaseMissing('folders', ['id' => $parent->id]);
    $this->assertDatabaseMissing('folders', ['id' => $child->id]);
    $this->assertDatabaseMissing('files', ['id' => $nestedFile->id]);
    $this->assertDatabaseHas('files', ['id' => $rootFile->id]);
});

test('user cannot manage folders in another users world', function () {
    $user = User::factory()->create();
    $world = World::factory()->create();
    $folder = Folder::factory()->for($world)->create();

    $this->actingAs($user)
        ->post(route('worlds.folders.store', $world), ['name' => 'Stolen'])
        ->assertForbidden();

    $this->actingAs($user)
        ->patch(route('worlds.folders.update', [$world, $folder]), ['name' => 'Stolen'])
        ->assertForbidden();

    $this->actingAs($user)
        ->delete(route('worlds.folders.destroy', [$world, $folder]))
        ->assertForbidden();
});

test('folder from another world cannot be addressed under this world', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $otherWorld = World::factory()->for($user)->create();
    $foreignFolder = Folder::factory()->for($otherWorld)->create(['name' => 'Foreign']);

    $this->actingAs($user)
        ->patch(route('worlds.folders.update', [$world, $foreignFolder]), [
            'name' => 'Moved Across Worlds',
            'parent_id' => null,
        ])
        ->assertNotFound();
});

test('folder cannot move under a folder from another world', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $otherWorld = World::factory()->for($user)->create();
    $folder = Folder::factory()->for($world)->create(['name' => 'Local']);
    $foreignParent = Folder::factory()->for($otherWorld)->create(['name' => 'Foreign Parent']);

    $this->actingAs($user)
        ->from(route('worlds.show', $world))
        ->patch(route('worlds.folders.update', [$world, $folder]), [
            'name' => 'Local',
            'parent_id' => $foreignParent->id,
        ])
        ->assertRedirect(route('worlds.show', $world, absolute: false))
        ->assertSessionHasErrors('parent_id');

    expect($folder->refresh()->parent_id)->toBeNull();
});

test('user can create deeply nested folders', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();

    $this->actingAs($user)
        ->post(route('worlds.folders.store', $world), ['name' => 'Level 1'])
        ->assertRedirect(route('worlds.show', $world, absolute: false));

    $level1 = Folder::query()->where('name', 'Level 1')->firstOrFail();

    $this->actingAs($user)
        ->post(route('worlds.folders.store', $world), [
            'name' => 'Level 2',
            'parent_id' => $level1->id,
        ])
        ->assertRedirect(route('worlds.show', $world, absolute: false));

    $level2 = Folder::query()->where('name', 'Level 2')->firstOrFail();

    $this->actingAs($user)
        ->post(route('worlds.folders.store', $world), [
            'name' => 'Level 3',
            'parent_id' => $level2->id,
        ])
        ->assertRedirect(route('worlds.show', $world, absolute: false));

    $level3 = Folder::query()->where('name', 'Level 3')->firstOrFail();

    expect($level3->parent_id)->toBe($level2->id);
    expect($level2->parent_id)->toBe($level1->id);
    expect($level1->parent_id)->toBeNull();
});

test('world show includes the folder and file tree', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $folder = Folder::factory()->for($world)->create(['name' => 'Places']);
    $file = File::factory()->for($world)->create([
        'name' => 'Marrow Falls',
        'folder_id' => $folder->id,
    ]);

    $this->actingAs($user)
        ->get(route('worlds.show', $world))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('worlds/show')
            ->where('world.id', $world->id)
            ->has('tree.folders', 1)
            ->where('tree.folders.0.id', $folder->id)
            ->where('tree.folders.0.name', 'Places')
            ->has('tree.files', 1)
            ->where('tree.files.0.id', $file->id)
            ->where('tree.files.0.folderId', $folder->id)
            ->where('file', null)
        );
});
