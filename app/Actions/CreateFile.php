<?php

namespace App\Actions;

use App\Models\File;
use App\Models\Template;
use App\Models\World;
use Illuminate\Support\Facades\DB;

class CreateFile
{
    public function __construct(private SyncFileLinks $syncFileLinks) {}

    /**
     * @param  array{name: string, folder_id?: int|null, template_id?: int|null}  $attributes
     */
    public function __invoke(World $world, array $attributes): File
    {
        $templateId = $attributes['template_id'] ?? null;
        $template = $templateId === null
            ? null
            : Template::query()->findOrFail($templateId);

        return DB::transaction(function () use ($world, $attributes, $template): File {
            $file = new File([
                'name' => $attributes['name'],
                'folder_id' => $attributes['folder_id'] ?? null,
                'content' => $template?->body ?? '',
                'format' => 'document',
            ]);
            $file->world()->associate($world);

            if ($template !== null) {
                $file->template()->associate($template);
            }

            $file->save();
            ($this->syncFileLinks)($file);

            return $file;
        });
    }
}
