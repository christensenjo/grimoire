<?php

use App\Models\User;
use App\Models\World;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());
    $world = World::factory()->for($user)->create([
        'name' => 'Marrow Falls',
        'description' => 'A fogbound river city.',
    ]);
    World::factory()->create([
        'name' => 'Other User World',
    ]);

    $expectedUpdatedAt = $world->updated_at->toISOString();
    $expectedUpdatedForHumans = $world->updated_at->diffForHumans();

    $this->get('/dashboard')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('auth.user.id', $user->id)
            ->where('auth.user.name', $user->name)
            ->has('worlds', 1)
            ->where('worlds.0.id', $world->id)
            ->where('worlds.0.name', 'Marrow Falls')
            ->where('worlds.0.description', 'A fogbound river city.')
            ->where('worlds.0.updatedAt', $expectedUpdatedAt)
            ->where('worlds.0.updatedForHumans', $expectedUpdatedForHumans)
        );
});

test('dashboard shows an empty worlds state', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get('/dashboard')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('auth.user.id', $user->id)
            ->has('worlds', 0)
        );
});
