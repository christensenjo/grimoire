<?php

namespace App\Actions;

use App\Models\File;
use App\Models\Template;

class ApplyTemplateToFile
{
    public function __invoke(File $file, Template $template, bool $appendBody = false): void
    {
        $file->template()->associate($template);

        if ($appendBody) {
            $content = $file->content ?? '';

            if ($content === '') {
                $file->content = $template->body;
            } elseif (str_ends_with($content, "\n\n")) {
                $file->content = $content.$template->body;
            } elseif (str_ends_with($content, "\n")) {
                $file->content = $content."\n".$template->body;
            } else {
                $file->content = $content."\n\n".$template->body;
            }
        }

        $file->save();
    }
}
