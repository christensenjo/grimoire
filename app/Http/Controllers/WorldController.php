<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorldRequest;
use App\Http\Requests\UpdateWorldRequest;
use App\Models\World;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class WorldController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', World::class);

        return Inertia::render('worlds/index', [
            'worlds' => $request->user()
                ->worlds()
                ->latest('updated_at')
                ->get()
                ->map(fn (World $world): array => $world->toInertiaArray()),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', World::class);

        return Inertia::render('worlds/create');
    }

    public function store(StoreWorldRequest $request): RedirectResponse
    {
        Gate::authorize('create', World::class);

        $world = $request->user()->worlds()->create($request->validated());

        return to_route('worlds.show', $world);
    }

    public function show(World $world): Response
    {
        Gate::authorize('view', $world);

        return Inertia::render('worlds/show', [
            'world' => $world->toInertiaArray(),
        ]);
    }

    public function edit(World $world): Response
    {
        Gate::authorize('update', $world);

        return Inertia::render('worlds/edit', [
            'world' => $world->toInertiaArray(),
        ]);
    }

    public function update(UpdateWorldRequest $request, World $world): RedirectResponse
    {
        Gate::authorize('update', $world);

        $world->update($request->validated());

        return to_route('worlds.show', $world);
    }

    public function destroy(World $world): RedirectResponse
    {
        Gate::authorize('delete', $world);

        $world->delete();

        return to_route('worlds.index');
    }
}
