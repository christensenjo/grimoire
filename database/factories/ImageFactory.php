<?php

namespace Database\Factories;

use App\Models\Folder;
use App\Models\Image;
use App\Models\World;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Image>
 */
class ImageFactory extends Factory
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
            'folder_id' => fn (array $attributes): Factory => Folder::factory()
                ->for(World::query()->findOrFail($attributes['world_id'])),
            'disk' => 'local',
            'path' => 'worlds/'.fake()->uuid().'/images/'.fake()->uuid().'.png',
            'original_name' => fake()->word().'.png',
            'mime_type' => 'image/png',
            'size' => fake()->numberBetween(100, 1_000_000),
        ];
    }
}
