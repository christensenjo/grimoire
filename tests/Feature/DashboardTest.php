<?php

use App\Actions\BuildDashboardProps;
use App\Models\File;
use App\Models\Folder;
use App\Models\Template;
use App\Models\User;
use App\Models\World;
use Database\Seeders\TemplateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(TemplateSeeder::class);
});

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
            ->where('summary.worlds', 1)
            ->where('summary.files', 0)
            ->where('summary.typedFiles', 0)
            ->has('recentFiles', 0)
            ->has('templates', 3)
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
            ->where('summary.worlds', 0)
            ->where('summary.files', 0)
            ->where('summary.typedFiles', 0)
            ->has('recentFiles', 0)
        );
});

test('dashboard returns real type counts summaries and recent files across worlds', function () {
    $user = User::factory()->create();
    $worldA = World::factory()->for($user)->create([
        'name' => 'Marrow Falls',
        'updated_at' => now()->subDays(2),
    ]);
    $worldB = World::factory()->for($user)->create([
        'name' => 'Sunbreak Archipelago',
        'updated_at' => now()->subDay(),
    ]);
    $character = Template::query()->where('slug', 'character')->sole();
    $location = Template::query()->where('slug', 'location')->sole();
    $worldTemplate = Template::query()->where('slug', 'world')->sole();

    File::factory()->for($worldA)->for($character)->create([
        'name' => 'Aria Vale',
        'updated_at' => now()->subHours(3),
    ]);
    File::factory()->for($worldA)->for($character)->create([
        'name' => 'Captain Vey',
        'updated_at' => now()->subHours(2),
    ]);
    File::factory()->for($worldA)->for($location)->create([
        'name' => 'Glassreach',
        'updated_at' => now()->subHour(),
    ]);
    $recent = File::factory()->for($worldB)->for($worldTemplate)->create([
        'name' => 'Sunbreak Overview',
        'updated_at' => now(),
    ]);
    File::factory()->create(['name' => 'Other User File']);
    Folder::factory()->for($worldB)->create(['name' => 'Characters']);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('summary.worlds', 2)
            ->where('summary.files', 4)
            ->where('summary.typedFiles', 4)
            ->where('summary.types.character', 2)
            ->where('summary.types.location', 1)
            ->where('summary.types.world', 1)
            ->has('worlds', 2)
            ->where('worlds.0.id', $worldB->id)
            ->where('worlds.0.fileCount', 1)
            ->where('worlds.0.typeCounts.world', 1)
            ->where('worlds.0.typeCounts.character', 0)
            ->where('worlds.1.id', $worldA->id)
            ->where('worlds.1.fileCount', 3)
            ->where('worlds.1.typeCounts.character', 2)
            ->where('worlds.1.typeCounts.location', 1)
            ->where('recentFiles.0.id', $recent->id)
            ->where('recentFiles.0.worldName', 'Sunbreak Archipelago')
            ->where('recentFiles.0.template.slug', 'world')
            ->where('worlds.0.folders.0.name', 'Characters')
        );
});

test('dashboard data query count does not grow with more worlds', function () {
    $user = User::factory()->create();
    $firstWorld = World::factory()->for($user)->create();
    File::factory()->for($firstWorld)->create();

    DB::flushQueryLog();
    DB::enableQueryLog();
    app(BuildDashboardProps::class)($user);
    $singleWorldQueryCount = count(DB::getQueryLog());

    DB::disableQueryLog();
    World::factory()
        ->count(5)
        ->for($user)
        ->create()
        ->each(function (World $world): void {
            File::factory()->count(3)->for($world)->create();
            Folder::factory()->count(2)->for($world)->create();
        });

    DB::flushQueryLog();
    DB::enableQueryLog();
    app(BuildDashboardProps::class)($user);
    $manyWorldQueryCount = count(DB::getQueryLog());
    DB::disableQueryLog();

    expect($manyWorldQueryCount)->toBe($singleWorldQueryCount);
});

test('dashboard create file action accepts a world folder and template', function () {
    $user = User::factory()->create();
    $world = World::factory()->for($user)->create();
    $folder = Folder::factory()->for($world)->create();
    $template = Template::query()->where('slug', 'character')->sole();

    $this->actingAs($user)
        ->from(route('dashboard'))
        ->post(route('worlds.files.store', $world), [
            'name' => 'Aria Vale',
            'folder_id' => $folder->id,
            'template_id' => $template->id,
        ])
        ->assertRedirect();

    expect(File::query()->where('name', 'Aria Vale')->sole())
        ->world_id->toBe($world->id)
        ->folder_id->toBe($folder->id)
        ->template_id->toBe($template->id)
        ->content->toBe($template->body);
});
