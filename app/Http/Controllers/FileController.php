<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFileRequest;
use App\Http\Requests\UpdateFileRequest;
use App\Models\File;
use App\Models\World;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class FileController extends Controller
{
    public function store(StoreFileRequest $request, World $world): RedirectResponse
    {
        Gate::authorize('create', [File::class, $world]);

        $file = $world->files()->create([
            ...$request->validated(),
            'content' => '',
            'format' => 'document',
        ]);

        return to_route('worlds.files.show', [$world, $file]);
    }

    public function show(World $world, File $file): Response
    {
        Gate::authorize('view', $file);

        return Inertia::render('worlds/show', [
            'world' => $world->toInertiaArray(),
            'tree' => $world->toTreeInertiaArray(),
            'file' => $file->toInertiaArray(),
        ]);
    }

    public function update(UpdateFileRequest $request, World $world, File $file): RedirectResponse
    {
        Gate::authorize('update', $file);

        $file->update($request->validated());

        return to_route('worlds.files.show', [$world, $file]);
    }

    public function destroy(World $world, File $file): RedirectResponse
    {
        Gate::authorize('delete', $file);

        $file->delete();

        return to_route('worlds.show', $world);
    }
}
