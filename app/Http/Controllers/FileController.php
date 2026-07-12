<?php

namespace App\Http\Controllers;

use App\Actions\ApplyTemplateToFile;
use App\Actions\CreateFile;
use App\Actions\ListTemplates;
use App\Actions\UpdateFile;
use App\Http\Requests\ApplyTemplateRequest;
use App\Http\Requests\StoreFileRequest;
use App\Http\Requests\UpdateFileRequest;
use App\Models\File;
use App\Models\Template;
use App\Models\World;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class FileController extends Controller
{
    public function store(StoreFileRequest $request, World $world, CreateFile $createFile): RedirectResponse
    {
        Gate::authorize('create', [File::class, $world]);

        $file = $createFile($world, $request->validated());

        return to_route('worlds.files.show', [$world, $file]);
    }

    public function show(World $world, File $file, ListTemplates $listTemplates): Response
    {
        Gate::authorize('view', $file);

        $invalidateDashboardPrefetch = !$world->isMostRecentScratchpadWorld();
        $world->markAccessed();
        $file->loadMissing('template');

        return Inertia::render('worlds/show', [
            'world' => $world->toInertiaArray(),
            'tree' => $world->toTreeInertiaArray(),
            'file' => $file->toInertiaArray(),
            'templates' => $listTemplates(),
            'invalidateDashboardPrefetch' => $invalidateDashboardPrefetch,
        ]);
    }

    public function update(UpdateFileRequest $request, World $world, File $file, UpdateFile $updateFile): RedirectResponse
    {
        Gate::authorize('update', $file);

        $updateFile($file, $request->validated());

        $previousPath = parse_url((string) url()->previous(), PHP_URL_PATH) ?: '';

        if (str_starts_with($previousPath, '/dashboard')) {
            return redirect()->to(url()->previous());
        }

        return to_route('worlds.files.show', [$world, $file]);
    }

    public function updateTemplate(
        ApplyTemplateRequest $request,
        World $world,
        File $file,
        ApplyTemplateToFile $applyTemplateToFile,
    ): RedirectResponse {
        Gate::authorize('update', $file);

        $template = Template::query()->findOrFail($request->integer('template_id'));
        $applyTemplateToFile($file, $template, $request->boolean('append_body'));

        return to_route('worlds.files.show', [$world, $file]);
    }

    public function destroy(World $world, File $file): RedirectResponse
    {
        Gate::authorize('delete', $file);

        $file->delete();

        return to_route('worlds.show', $world);
    }
}
