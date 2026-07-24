<?php

namespace App\Actions;

use App\Models\File;
use App\Models\Folder;
use App\Models\Template;
use App\Models\User;
use App\Models\World;
use Illuminate\Database\Eloquent\Collection;

final class BuildDashboardProps
{
    /**
     * @return array{
     *     worlds: list<array<string, mixed>>,
     *     summary: array{worlds: int, files: int, typedFiles: int, types: array<string, int>},
     *     recentFiles: list<array{id: int, slug: string, name: string, worldSlug: string, worldName: string, updatedAt: string|null, updatedForHumans: string|null, template: array{id: int, slug: string, name: string}|null}>,
     *     templates: list<array{id: int, slug: string, name: string}>,
     *     recentScratchpad: array{worldSlug: string, worldName: string, fileSlug: string, fileName: string, content: string}|null
     * }
     */
    public function __invoke(User $user, ?string $scratchpadWorldSlug = null): array
    {
        $templates = Template::query()
            ->orderBy('sort_order')
            ->get();
        $worlds = $user->worlds()
            ->with([
                'scratchpadFile',
                'folders' => fn ($query) => $query->orderBy('name'),
            ])
            ->withCount('files')
            ->orderByRecentAccess()
            ->get();
        $worldIds = $worlds->modelKeys();
        $counts = File::query()
            ->whereIn('world_id', $worldIds)
            ->whereNotNull('template_id')
            ->select(['world_id', 'template_id'])
            ->selectRaw('count(*) as aggregate')
            ->groupBy('world_id', 'template_id')
            ->get();
        $countsByWorld = $counts->groupBy('world_id');
        $summaryTypeCounts = $templates
            ->mapWithKeys(fn (Template $template): array => [
                $template->slug => (int) $counts
                    ->where('template_id', $template->id)
                    ->sum('aggregate'),
            ])
            ->all();
        $recentFiles = File::query()
            ->whereHas('world', fn ($query) => $query->where('user_id', $user->id))
            ->with([
                'world:id,slug,name',
                'template:id,slug,name',
            ])
            ->latest('updated_at')
            ->latest('id')
            ->limit(8)
            ->get();

        $recentWorld = $this->resolveScratchpadWorld($worlds, $scratchpadWorldSlug);

        return [
            'worlds' => $worlds
                ->map(function (World $world) use ($templates, $countsByWorld): array {
                    $worldCounts = $countsByWorld->get($world->id, collect());

                    return [
                        ...$world->toInertiaArray(),
                        'fileCount' => (int) $world->files_count,
                        'typeCounts' => $templates
                            ->mapWithKeys(fn (Template $template): array => [
                                $template->slug => (int) $worldCounts
                                    ->where('template_id', $template->id)
                                    ->sum('aggregate'),
                            ])
                            ->all(),
                        'folders' => $world->folders
                            ->map(fn (Folder $folder): array => $folder->toInertiaArray())
                            ->values()
                            ->all(),
                    ];
                })
                ->values()
                ->all(),
            'summary' => [
                'worlds' => $worlds->count(),
                'files' => (int) $worlds->sum('files_count'),
                'typedFiles' => (int) $counts->sum('aggregate'),
                'types' => $summaryTypeCounts,
            ],
            'recentFiles' => $recentFiles
                ->map(fn (File $file): array => [
                    'id' => $file->id,
                    'slug' => $file->slug,
                    'name' => $file->name,
                    'worldSlug' => $file->world->slug,
                    'worldName' => $file->world->name,
                    'updatedAt' => $file->updated_at?->toISOString(),
                    'updatedForHumans' => $file->updated_at?->diffForHumans(),
                    'template' => $file->template?->toInertiaArray(),
                ])
                ->values()
                ->all(),
            'templates' => $templates
                ->map(fn (Template $template): array => $template->toInertiaArray())
                ->values()
                ->all(),
            'recentScratchpad' => $recentWorld?->scratchpadFile === null ? null : [
                'worldSlug' => $recentWorld->slug,
                'worldName' => $recentWorld->name,
                'fileSlug' => $recentWorld->scratchpadFile->slug,
                'fileName' => $recentWorld->scratchpadFile->name,
                'content' => $recentWorld->scratchpadFile->content ?? '',
            ],
        ];
    }

    /**
     * @param  Collection<int, World>  $worlds
     */
    protected function resolveScratchpadWorld(Collection $worlds, ?string $scratchpadWorldSlug): ?World
    {
        if ($scratchpadWorldSlug !== null && $scratchpadWorldSlug !== '') {
            $selected = $worlds->first(
                fn (World $world): bool => $world->slug === $scratchpadWorldSlug
                    && $world->scratchpadFile !== null,
            );

            if ($selected !== null) {
                return $selected;
            }
        }

        return $worlds->first(
            fn (World $world): bool => $world->scratchpadFile !== null,
        );
    }
}
