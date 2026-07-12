<?php

namespace App\Actions;

use App\Models\File;
use Illuminate\Support\Facades\DB;

class UpdateFile
{
    public function __construct(private SyncFileLinks $syncFileLinks) {}

    /**
     * @param  array{name?: string, folder_id?: int|null, content?: string|null}  $attributes
     */
    public function __invoke(File $file, array $attributes): void
    {
        DB::transaction(function () use ($file, $attributes): void {
            $file->update($attributes);

            if (array_key_exists('content', $attributes)) {
                ($this->syncFileLinks)($file);
            }
        });
    }
}
