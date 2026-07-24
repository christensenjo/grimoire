<?php

namespace App\Actions;

use App\Models\Folder;
use App\Models\Image;

class DeleteFolder
{
    public function __invoke(Folder $folder): void
    {
        $folderIds = collect([$folder->id]);
        $parentIds = $folderIds;

        do {
            $childIds = $folder->world
                ->folders()
                ->whereIn('parent_id', $parentIds)
                ->pluck('id');
            $folderIds = $folderIds->merge($childIds);
            $parentIds = $childIds;
        } while ($parentIds->isNotEmpty());

        Image::query()->whereIn('folder_id', $folderIds)->eachById(function (Image $image): void {
            $image->delete();
        });

        $folder->delete();
    }
}
