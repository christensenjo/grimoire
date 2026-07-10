<?php

namespace App\Support;

use App\Models\File;
use App\Models\Folder;
use App\Models\SlugRedirect;
use App\Models\World;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class WorkspaceSlugRedirector
{
    public function redirect(Request $request): ?RedirectResponse
    {
        $worldParameter = $request->route('world');

        if (is_string($worldParameter)) {
            return $this->redirectWorld($request, $worldParameter);
        }

        if ($worldParameter instanceof World) {
            $fileParameter = $request->route('file');

            if (is_string($fileParameter)) {
                return $this->redirectChild($request, $worldParameter, File::class, $fileParameter);
            }

            $folderParameter = $request->route('folder');

            if (is_string($folderParameter)) {
                return $this->redirectChild($request, $worldParameter, Folder::class, $folderParameter);
            }
        }

        return null;
    }

    protected function redirectWorld(Request $request, string $fromSlug): ?RedirectResponse
    {
        $redirect = SlugRedirect::query()
            ->where('redirectable_type', (new World)->getMorphClass())
            ->where('user_id', $request->user()?->id)
            ->where('from_slug', $fromSlug)
            ->first();

        $world = $redirect?->redirectable;

        if (!$world instanceof World) {
            return null;
        }

        $segments = $request->segments();
        $worldSegmentIndex = array_search($fromSlug, $segments, true);

        if ($worldSegmentIndex === false) {
            return null;
        }

        $segments[$worldSegmentIndex] = $world->slug;
        $path = implode('/', $segments);
        $query = $request->getQueryString();

        return redirect($query === null ? $path : "{$path}?{$query}", 301);
    }

    /**
     * @param  class-string<File|Folder>  $modelClass
     */
    protected function redirectChild(Request $request, World $world, string $modelClass, string $fromSlug): ?RedirectResponse
    {
        $redirect = SlugRedirect::query()
            ->where('redirectable_type', (new $modelClass)->getMorphClass())
            ->where('world_id', $world->id)
            ->where('from_slug', $fromSlug)
            ->first();

        $model = $redirect?->redirectable;

        if (!$model instanceof $modelClass) {
            return null;
        }

        $routeName = $model instanceof File ? 'worlds.files.show' : 'worlds.show';
        $parameters = $model instanceof File ? [$world, $model] : $world;

        return to_route($routeName, $parameters, 301);
    }
}
