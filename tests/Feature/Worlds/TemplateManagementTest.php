<?php

use App\Models\File;
use App\Models\Template;
use App\Models\User;
use App\Models\World;
use Database\Seeders\TemplateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(TemplateSeeder::class);
});

test('seeder provides the world character and location templates', function () {
    $this->seed(TemplateSeeder::class);

    expect(Template::query()->orderBy('sort_order')->pluck('slug')->all())
        ->toBe(['world', 'character', 'location']);

    Template::query()->each(function (Template $template): void {
        expect($template->body)
            ->not->toBeEmpty()
            ->toContain('## ');
    });
});

test('user can create a file from a template', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $template = Template::query()->where('slug', 'character')->sole();

    $response = $this->actingAs($user)
        ->post(route('worlds.files.store', $world), [
            'name' => 'Aria Vale',
            'folder_id' => null,
            'template_id' => $template->id,
        ]);

    $file = File::query()->where('name', 'Aria Vale')->sole();

    $response->assertRedirect(route('worlds.files.show', [$world, $file], absolute: false));
    expect($file)
        ->template_id->toBe($template->id)
        ->content->toBe($template->body);

    $this->actingAs($user)
        ->get(route('worlds.files.show', [$world, $file]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('file.template.slug', 'character')
            ->where('tree.files.0.template.slug', 'character')
            ->has('templates', 3)
        );
});

test('user can apply a template type without changing existing file content', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $file = File::factory()->for($world)->create([
        'name' => 'The Shattered Coast',
        'content' => 'Stormglass washes ashore at dawn.',
    ]);
    $template = Template::query()->where('slug', 'location')->sole();

    $this->actingAs($user)
        ->patch(route('worlds.files.template.update', [$world, $file]), [
            'template_id' => $template->id,
        ])
        ->assertRedirect(route('worlds.files.show', [$world, $file], absolute: false));

    expect($file->refresh())
        ->template_id->toBe($template->id)
        ->content->toBe('Stormglass washes ashore at dawn.');
});

test('user can add template prompts after existing file content', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $file = File::factory()->for($world)->create([
        'name' => 'The Shattered Coast',
        'content' => 'Stormglass washes ashore at dawn.',
    ]);
    $template = Template::query()->where('slug', 'location')->sole();

    $this->actingAs($user)
        ->patch(route('worlds.files.template.update', [$world, $file]), [
            'template_id' => $template->id,
            'append_body' => true,
        ])
        ->assertRedirect();

    expect($file->refresh())
        ->template_id->toBe($template->id)
        ->content->toBe("Stormglass washes ashore at dawn.\n\n".$template->body);
});

test('user can still create a blank untyped file', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();

    $this->actingAs($user)
        ->post(route('worlds.files.store', $world), [
            'name' => 'Loose Notes',
            'folder_id' => null,
        ])
        ->assertRedirect();

    expect(File::query()->where('name', 'Loose Notes')->sole())
        ->template_id->toBeNull()
        ->content->toBe('');
});

test('user cannot apply a template to another users file', function () {
    $file = File::factory()->create();
    $template = Template::query()->where('slug', 'world')->sole();

    $this->actingAs(User::factory()->create())
        ->patch(route('worlds.files.template.update', [$file->world, $file]), [
            'template_id' => $template->id,
        ])
        ->assertNotFound();

    expect($file->refresh()->template_id)->toBeNull();
});

test('invalid template values are rejected when creating and applying', function (mixed $templateId) {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $file = File::factory()->for($world)->create(['content' => 'Keep this.']);

    $this->actingAs($user)
        ->post(route('worlds.files.store', $world), [
            'name' => 'Invalid Template File',
            'folder_id' => null,
            'template_id' => $templateId,
        ])
        ->assertSessionHasErrors('template_id');

    $this->actingAs($user)
        ->patch(route('worlds.files.template.update', [$world, $file]), [
            'template_id' => $templateId,
        ])
        ->assertSessionHasErrors('template_id');

    expect(File::query()->where('name', 'Invalid Template File')->exists())->toBeFalse()
        ->and($file->refresh())
        ->template_id->toBeNull()
        ->content->toBe('Keep this.');
})->with([
    'malformed' => 'not-a-template',
    'missing' => 999_999,
]);
