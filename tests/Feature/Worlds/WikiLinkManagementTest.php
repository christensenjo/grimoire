<?php

use App\Models\File;
use App\Models\Template;
use App\Models\User;
use App\Models\World;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('saving a file synchronizes its wiki-link targets', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $source = File::factory()->for($world)->create(['name' => 'Chronicle']);
    $firstTarget = File::factory()->for($world)->create(['name' => 'Aria Vale']);
    $secondTarget = File::factory()->for($world)->create(['name' => 'Glassreach']);

    $this->actingAs($user)
        ->patch(route('worlds.files.update', [$world, $source]), [
            'name' => $source->name,
            'folder_id' => null,
            'content' => "Meet [[file:{$firstTarget->id}]] near [[file:{$secondTarget->id}]]. Then ask [[file:{$firstTarget->id}]] again.",
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('file_links', [
        'source_file_id' => $source->id,
        'target_file_id' => $firstTarget->id,
    ]);
    $this->assertDatabaseHas('file_links', [
        'source_file_id' => $source->id,
        'target_file_id' => $secondTarget->id,
    ]);
    expect($source->outgoingWikiLinks()->count())->toBe(2);

    $this->actingAs($user)
        ->patch(route('worlds.files.update', [$world, $source]), [
            'name' => $source->name,
            'folder_id' => null,
            'content' => "Only [[file:{$secondTarget->id}]] remains.",
        ])
        ->assertRedirect();

    expect($source->outgoingWikiLinks()->pluck('files.id')->all())->toBe([$secondTarget->id]);
});

test('renaming a target file leaves its id-based wiki-link intact', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $source = File::factory()->for($world)->create(['name' => 'Chronicle']);
    $target = File::factory()->for($world)->create(['name' => 'Old Name']);
    $content = "Seek [[file:{$target->id}]].";

    $this->actingAs($user)->patch(route('worlds.files.update', [$world, $source]), [
        'name' => $source->name,
        'folder_id' => null,
        'content' => $content,
    ]);

    $this->actingAs($user)
        ->patch(route('worlds.files.update', [$world, $target]), [
            'name' => 'New Name',
            'folder_id' => null,
            'content' => '',
        ])
        ->assertRedirect();

    expect($source->refresh()->content)->toBe($content)
        ->and($source->outgoingWikiLinks()->sole())
        ->id->toBe($target->id)
        ->name->toBe('New Name');
});

test('deleting a target preserves the source reference as a broken wiki-link', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $source = File::factory()->for($world)->create(['name' => 'Chronicle']);
    $target = File::factory()->for($world)->create(['name' => 'Lost City']);
    $content = "The road once led to [[file:{$target->id}]].";

    $this->actingAs($user)->patch(route('worlds.files.update', [$world, $source]), [
        'name' => $source->name,
        'folder_id' => null,
        'content' => $content,
    ]);

    $this->actingAs($user)
        ->delete(route('worlds.files.destroy', [$world, $target]))
        ->assertRedirect();

    $this->actingAs($user)
        ->patch(route('worlds.files.update', [$world, $source]), [
            'name' => $source->name,
            'folder_id' => null,
            'content' => $content,
        ])
        ->assertRedirect();

    expect($source->refresh()->content)->toBe($content);
    $this->assertDatabaseHas('file_links', [
        'source_file_id' => $source->id,
        'target_file_id' => $target->id,
    ]);
});

test('cross-world wiki-links are rejected without changing content or links', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $otherWorld = World::factory()->for($user)->create();
    $source = File::factory()->for($world)->create([
        'name' => 'Chronicle',
        'content' => 'Original content.',
    ]);
    $otherWorldFile = File::factory()->for($otherWorld)->create();

    $this->actingAs($user)
        ->patch(route('worlds.files.update', [$world, $source]), [
            'name' => $source->name,
            'folder_id' => null,
            'content' => "Forbidden [[file:{$otherWorldFile->id}]].",
        ])
        ->assertSessionHasErrors('content');

    expect($source->refresh()->content)->toBe('Original content.')
        ->and($source->outgoingWikiLinks()->count())->toBe(0);
});

test('deleting a source file removes its file-link rows', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $source = File::factory()->for($world)->create();
    $target = File::factory()->for($world)->create();

    $this->actingAs($user)->patch(route('worlds.files.update', [$world, $source]), [
        'name' => $source->name,
        'folder_id' => null,
        'content' => "[[file:{$target->id}]]",
    ]);

    $this->actingAs($user)->delete(route('worlds.files.destroy', [$world, $source]));

    $this->assertDatabaseMissing('file_links', [
        'source_file_id' => $source->id,
    ]);
});

test('metadata-only updates leave synchronized wiki-links unchanged', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $source = File::factory()->for($world)->create(['name' => 'Chronicle']);
    $target = File::factory()->for($world)->create();

    $this->actingAs($user)->patch(route('worlds.files.update', [$world, $source]), [
        'name' => $source->name,
        'folder_id' => null,
        'content' => "[[file:{$target->id}]]",
    ]);

    $this->actingAs($user)
        ->patch(route('worlds.files.update', [$world, $source]), [
            'name' => 'Renamed Chronicle',
            'folder_id' => null,
        ])
        ->assertRedirect();

    expect($source->refresh()->content)->toBe("[[file:{$target->id}]]")
        ->and($source->outgoingWikiLinks()->sole()->id)->toBe($target->id);
});

test('appending template content synchronizes its wiki-links', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $source = File::factory()->for($world)->create(['content' => 'Existing content.']);
    $target = File::factory()->for($world)->create();
    $template = Template::factory()->create([
        'body' => "Continue with [[file:{$target->id}]].",
    ]);

    $this->actingAs($user)
        ->patch(route('worlds.files.template.update', [$world, $source]), [
            'template_id' => $template->id,
            'append_body' => true,
        ])
        ->assertRedirect();

    expect($source->outgoingWikiLinks()->sole()->id)->toBe($target->id);
});

test('template content cannot create cross-world wiki-links', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $otherWorld = World::factory()->for($user)->create();
    $otherWorldFile = File::factory()->for($otherWorld)->create();
    $template = Template::factory()->create([
        'body' => "Forbidden [[file:{$otherWorldFile->id}]].",
    ]);

    $this->actingAs($user)
        ->post(route('worlds.files.store', $world), [
            'name' => 'Cross-World File',
            'folder_id' => null,
            'template_id' => $template->id,
        ])
        ->assertSessionHasErrors('content');

    $this->assertDatabaseMissing('files', [
        'world_id' => $world->id,
        'name' => 'Cross-World File',
    ]);

    $source = File::factory()->for($world)->create([
        'content' => 'Keep this content.',
    ]);

    $this->actingAs($user)
        ->patch(route('worlds.files.template.update', [$world, $source]), [
            'template_id' => $template->id,
            'append_body' => true,
        ])
        ->assertSessionHasErrors('content');

    expect($source->refresh())
        ->template_id->toBeNull()
        ->content->toBe('Keep this content.')
        ->and($source->outgoingWikiLinks()->count())->toBe(0);
});
