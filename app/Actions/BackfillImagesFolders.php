<?php

namespace App\Actions;

use App\Data\ImagesFolderBackfillResult;
use App\Models\Folder;
use App\Models\World;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class BackfillImagesFolders
{
    public function __invoke(bool $apply): ImagesFolderBackfillResult
    {
        $marked = 0;
        $wouldMark = 0;
        $alreadyCorrect = 0;
        $unresolvedWorldIds = [];

        World::query()
            ->with(['folders' => function (HasMany $query): void {
                $query->where(function (Builder $query): void {
                    $query
                        ->where('is_images_folder', true)
                        ->orWhere(function (Builder $query): void {
                            $query->whereNull('parent_id')->where('slug', 'images');
                        });
                });
            }])
            ->orderBy('id')
            ->each(function (World $world) use ($apply, &$marked, &$wouldMark, &$alreadyCorrect, &$unresolvedWorldIds): void {
                $markedFolders = $world->folders->where('is_images_folder', true);

                if ($markedFolders->count() === 1) {
                    $alreadyCorrect++;

                    return;
                }

                if ($markedFolders->count() > 1) {
                    $unresolvedWorldIds[] = $world->id;

                    return;
                }

                $imagesFolder = $world->folders->first(
                    fn (Folder $folder): bool => $folder->parent_id === null && $folder->slug === 'images',
                );

                if ($imagesFolder === null) {
                    $unresolvedWorldIds[] = $world->id;

                    return;
                }

                if (!$apply) {
                    $wouldMark++;

                    return;
                }

                $imagesFolder->is_images_folder = true;
                $imagesFolder->save();
                $marked++;
            });

        return new ImagesFolderBackfillResult(
            marked: $marked,
            wouldMark: $wouldMark,
            alreadyCorrect: $alreadyCorrect,
            unresolvedWorldIds: $unresolvedWorldIds,
        );
    }
}
