<?php

namespace App\Actions;

use App\Models\File;

class ListBrokenWikiLinkTargetIds
{
    /**
     * Target File ids recorded on `file_links` whose File row no longer exists.
     *
     * @return list<int>
     */
    public function __invoke(File $file): array
    {
        $targetIds = $file->outgoingWikiLinks()
            ->newPivotQuery()
            ->pluck('target_file_id')
            ->map(fn (mixed $id): int => (int) $id);

        if ($targetIds->isEmpty()) {
            return [];
        }

        $existingIds = File::query()
            ->whereIn('id', $targetIds)
            ->pluck('id')
            ->map(fn (mixed $id): int => (int) $id);

        return $targetIds
            ->diff($existingIds)
            ->sort()
            ->values()
            ->all();
    }
}
