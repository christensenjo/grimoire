<?php

namespace Database\Factories;

use App\Models\Folder;
use App\Models\World;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Folder>
 */
class FolderFactory extends Factory
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
            'parent_id' => null,
            'name' => fake()->words(2, true),
        ];
    }
}
