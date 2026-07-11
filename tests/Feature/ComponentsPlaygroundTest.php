<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get('/components')->assertRedirect('/login');
});

test('authenticated users can visit the components playground', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get('/components')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('components')
            ->where('auth.user.id', $user->id)
            ->where('auth.user.name', $user->name)
        );
});
