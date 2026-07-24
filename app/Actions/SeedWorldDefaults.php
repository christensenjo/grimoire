<?php

namespace App\Actions;

use App\Models\File;
use App\Models\Folder;
use App\Models\World;

final class SeedWorldDefaults
{
    public function __invoke(World $world): void
    {
        $this->ensureImagesFolder($world);
        $this->ensureScratchpad($world);
    }

    protected function ensureImagesFolder(World $world): void
    {
        $exists = $world->folders()
            ->where('is_images_folder', true)
            ->exists();

        if ($exists) {
            return;
        }

        $folder = new Folder([
            'name' => 'images',
            'parent_id' => null,
        ]);
        $folder->world()->associate($world);
        $folder->is_images_folder = true;
        $folder->save();
    }

    protected function ensureScratchpad(World $world): void
    {
        $exists = $world->files()
            ->where('is_scratchpad', true)
            ->exists();

        if ($exists) {
            return;
        }

        $file = new File([
            'name' => 'Scratchpad',
            'folder_id' => null,
            'content' => '',
            'format' => 'document',
        ]);
        $file->world()->associate($world);
        $file->is_scratchpad = true;
        $file->save();
    }
}
