<?php

namespace App\Actions;

use App\Models\File;
use App\Models\Template;
use App\Models\World;

class CreateFile
{
    /**
     * @param  array{name: string, folder_id?: int|null, template_id?: int|null}  $attributes
     */
    public function __invoke(World $world, array $attributes): File
    {
        $templateId = $attributes['template_id'] ?? null;
        $template = $templateId === null
            ? null
            : Template::query()->findOrFail($templateId);

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

        return $file;
    }
}
