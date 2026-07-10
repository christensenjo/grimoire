<?php

namespace Database\Factories;

use App\Models\File;
use App\Models\World;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<File>
 */
class FileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'world_id' => World::factory(),
            'folder_id' => null,
            'name' => fake()->words(2, true),
            'content' => '',
            'format' => 'document',
        ];
    }
}
