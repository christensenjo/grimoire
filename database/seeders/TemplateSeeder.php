<?php

namespace Database\Seeders;

use App\Models\Template;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            [
                'slug' => 'world',
                'name' => 'World',
                'sort_order' => 10,
                'body' => <<<'MARKDOWN'
## The promise of this World

What feeling, question, or conflict makes this World worth exploring?

## Places that shape it

- Which horizon calls to travelers?
- Where does power gather?
- What place do people avoid naming?

## Forces in motion

Who wants the World to change, and who needs it to stay the same?
MARKDOWN,
            ],
            [
                'slug' => 'character',
                'name' => 'Character',
                'sort_order' => 20,
                'body' => <<<'MARKDOWN'
## First impression

What does someone notice before this Character says a word?

## Desire and cost

- What do they want badly enough to take a risk?
- What would getting it cost them?

## Contradiction

Which two truths about this Character should not fit together, but do?

## Ties to the World

Who relies on them, who fears them, and where do they belong?
MARKDOWN,
            ],
            [
                'slug' => 'location',
                'name' => 'Location',
                'sort_order' => 30,
                'body' => <<<'MARKDOWN'
## Arrival

What sight, sound, or smell tells a traveler they have reached this Location?

## What happens here

- Why do people come?
- Why do some people stay?
- What becomes dangerous after dark?

## History underfoot

What past event still shapes daily life here?

## Secrets and connections

What is hidden here, and where does the road lead next?
MARKDOWN,
            ],
        ];

        foreach ($templates as $template) {
            Template::query()->updateOrCreate(
                ['slug' => $template['slug']],
                $template,
            );
        }
    }
}
