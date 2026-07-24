<?php

namespace App\Http\Controllers;

use App\Actions\DeleteFolder;
use App\Http\Requests\StoreFolderRequest;
use App\Http\Requests\UpdateFolderRequest;
use App\Models\Folder;
use App\Models\World;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class FolderController extends Controller
{
    public function store(StoreFolderRequest $request, World $world): RedirectResponse
    {
        Gate::authorize('create', [Folder::class, $world]);

        $world->folders()->create($request->validated());

        return to_route('worlds.show', $world);
    }

    public function update(UpdateFolderRequest $request, World $world, Folder $folder): RedirectResponse
    {
        Gate::authorize('update', $folder);

        $folder->update($request->validated());

        return to_route('worlds.show', $world);
    }

    public function destroy(World $world, Folder $folder, DeleteFolder $deleteFolder): RedirectResponse
    {
        Gate::authorize('delete', $folder);

        $deleteFolder($folder);

        return to_route('worlds.show', $world);
    }
}
