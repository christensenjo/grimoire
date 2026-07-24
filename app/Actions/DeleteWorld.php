<?php

namespace App\Actions;

use App\Models\Image;
use App\Models\World;

class DeleteWorld
{
    public function __invoke(World $world): void
    {
        $world->images()->eachById(function (Image $image): void {
            $image->delete();
        });

        $world->delete();
    }
}
