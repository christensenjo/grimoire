<?php

namespace App\Actions;

use App\Models\User;
use App\Models\World;

final class BuildDashboardProps
{
    /**
     * @return array{worlds: list<array{id: int, slug: string, name: string, description: string|null, updatedAt: string|null, updatedForHumans: string|null, scratchpadSlug: string|null}>, recentScratchpad: array{worldSlug: string, worldName: string, fileSlug: string, fileName: string, content: string}|null}
     */
    public function __invoke(User $user, ?string $scratchpadWorldSlug = null): array
    {
        $worlds = $user->worlds()
            ->with('scratchpadFile')
            ->latest('updated_at')
            ->get();

        $recentWorld = $this->resolveScratchpadWorld($user, $scratchpadWorldSlug);

        return [
            'worlds' => $worlds
                ->map(fn (World $world): array => $world->toInertiaArray())
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

    protected function resolveScratchpadWorld(User $user, ?string $scratchpadWorldSlug): ?World
    {
        if ($scratchpadWorldSlug !== null && $scratchpadWorldSlug !== '') {
            $selected = $user->worlds()
                ->with('scratchpadFile')
                ->where('slug', $scratchpadWorldSlug)
                ->whereHas('scratchpadFile')
                ->first();

            if ($selected !== null) {
                return $selected;
            }
        }

        return $user->worlds()
            ->with('scratchpadFile')
            ->whereHas('scratchpadFile')
            ->orderByRecentAccess()
            ->first();
    }
}
