<?php

use App\Models\User;
use App\Models\World;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests cannot access world routes', function () {
    $world = World::factory()->create();

    $this->get(route('worlds.index'))->assertRedirect(route('login', absolute: false));
    $this->get(route('worlds.create'))->assertRedirect(route('login', absolute: false));
    $this->post(route('worlds.store'), [])->assertRedirect(route('login', absolute: false));
    $this->get(route('worlds.show', $world))->assertRedirect(route('login', absolute: false));
    $this->get(route('worlds.edit', $world))->assertRedirect(route('login', absolute: false));
    $this->patch(route('worlds.update', $world), [])->assertRedirect(route('login', absolute: false));
    $this->delete(route('worlds.destroy', $world))->assertRedirect(route('login', absolute: false));
});

test('user can see only their worlds', function () {
    $user = User::factory()->create();
    $ownedWorld = World::factory()->for($user)->create([
        'name' => 'Marrow Falls',
        'description' => 'A fogbound river city.',
    ]);
    World::factory()->create([
        'name' => 'Other User World',
    ]);

    $expectedUpdatedAt = $ownedWorld->updated_at->toISOString();
    $expectedUpdatedForHumans = $ownedWorld->updated_at->diffForHumans();

    $this->actingAs($user)
        ->get(route('worlds.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('worlds/index')
            ->has('worlds', 1)
            ->where('worlds.0.id', $ownedWorld->id)
            ->where('worlds.0.name', 'Marrow Falls')
            ->where('worlds.0.description', 'A fogbound river city.')
            ->where('worlds.0.updatedAt', $expectedUpdatedAt)
            ->where('worlds.0.updatedForHumans', $expectedUpdatedForHumans)
        );
});

test('user can create a world', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('worlds.store'), [
        'name' => 'Sunbreak Archipelago',
        'description' => 'Tide-locked islands.',
    ]);

    $world = World::query()->where('name', 'Sunbreak Archipelago')->firstOrFail();

    $response->assertRedirect(route('worlds.show', $world, absolute: false));
    expect($world)
        ->user_id->toBe($user->id)
        ->description->toBe('Tide-locked islands.');
});

test('world name is required', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('worlds.create'))
        ->post(route('worlds.store'), [
            'name' => '',
            'description' => 'Missing a name.',
        ])
        ->assertRedirect(route('worlds.create', absolute: false))
        ->assertSessionHasErrors('name');
});

test('user can view and update their world', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create([
        'name' => 'Glassreach',
        'description' => null,
    ]);

    $this->actingAs($user)
        ->get(route('worlds.show', $world))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('worlds/show')
            ->where('world.id', $world->id)
            ->where('world.name', 'Glassreach')
            ->where('world.updatedAt', $world->updated_at->toISOString())
            ->has('tree.folders', 0)
            ->has('tree.files', 0)
            ->where('file', null)
        );

    $this->actingAs($user)
        ->patch(route('worlds.update', $world), [
            'name' => 'Glassreach Empire',
            'description' => 'A crystalline desert kingdom.',
        ])
        ->assertRedirect(route('worlds.show', $world, absolute: false));

    expect($world->refresh())
        ->name->toBe('Glassreach Empire')
        ->description->toBe('A crystalline desert kingdom.');
});

test('user can delete their world', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();

    $this->actingAs($user)
        ->delete(route('worlds.destroy', $world))
        ->assertRedirect(route('worlds.index', absolute: false));

    $this->assertDatabaseMissing('worlds', [
        'id' => $world->id,
    ]);
});

test('user cannot access another users world', function () {
    $user = User::factory()->create();
    $world = World::factory()->create();

    $this->actingAs($user)->get(route('worlds.show', $world))->assertForbidden();
    $this->actingAs($user)->get(route('worlds.edit', $world))->assertForbidden();
    $this->actingAs($user)->patch(route('worlds.update', $world), [
        'name' => 'Stolen World',
        'description' => 'Nope.',
    ])->assertForbidden();
    $this->actingAs($user)->delete(route('worlds.destroy', $world))->assertForbidden();
});
