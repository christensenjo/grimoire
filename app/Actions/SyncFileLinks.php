<?php

namespace App\Actions;

use App\Models\File;
use Illuminate\Validation\ValidationException;

class SyncFileLinks
{
    public function __construct(private ExtractWikiLinkIds $extractWikiLinkIds) {}

    public function __invoke(File $file): void
    {
        $targetIds = ($this->extractWikiLinkIds)($file->content);
        $hasCrossWorldTarget = File::query()
            ->whereIn('id', $targetIds)
            ->where('world_id', '!=', $file->world_id)
            ->exists();

        if ($hasCrossWorldTarget) {
            throw ValidationException::withMessages([
                'content' => 'Wiki-links can only target Files in this World.',
            ]);
        }

        $file->outgoingWikiLinks()->sync($targetIds);
    }
}
