<?php

namespace App\Actions;

use App\Models\User;
use App\Models\World;

final class BuildDashboardProps
{
    /**
     * @return array{worlds: list<array{id: int, slug: string, name: string, description: string|null, updatedAt: string|null, updatedForHumans: string|null, scratchpadSlug: string|null}>, recentScratchpad: array{worldSlug: string, worldName: string, fileSlug: string}|null}
     */
    public function __invoke(User $user): array
    {
        $worlds = $user->worlds()
            ->with('scratchpadFile')
            ->latest('updated_at')
            ->get();

        $recentWorld = $user->worlds()
            ->with('scratchpadFile')
            ->whereHas('scratchpadFile')
            ->orderByRaw('last_accessed_at is null')
            ->orderByDesc('last_accessed_at')
            ->orderByDesc('updated_at')
            ->orderByDesc('id')
            ->first();

        return [
            'worlds' => $worlds
                ->map(fn (World $world): array => $world->toInertiaArray())
                ->values()
                ->all(),
            'recentScratchpad' => $recentWorld === null ? null : [
                'worldSlug' => $recentWorld->slug,
                'worldName' => $recentWorld->name,
                'fileSlug' => $recentWorld->scratchpadFile->slug,
            ],
        ];
    }
}
