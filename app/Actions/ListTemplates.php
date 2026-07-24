<?php

namespace App\Actions;

use App\Models\Template;

class ListTemplates
{
    /**
     * @return list<array{id: int, slug: string, name: string}>
     */
    public function __invoke(): array
    {
        return Template::query()
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Template $template): array => $template->toInertiaArray())
            ->all();
    }
}
