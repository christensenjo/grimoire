<?php

namespace App\Actions;

class ExtractWikiLinkIds
{
    /**
     * @return list<int>
     */
    public function __invoke(?string $content): array
    {
        if ($content === null || $content === '') {
            return [];
        }

        preg_match_all('/\[\[file:(\d+)\]\]/', $content, $matches);

        return collect($matches[1] ?? [])
            ->map(fn (string $id): int => (int) $id)
            ->filter(fn (int $id): bool => $id > 0)
            ->unique()
            ->values()
            ->all();
    }
}
