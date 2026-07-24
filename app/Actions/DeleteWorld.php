<?php

namespace App\Actions;

use App\Models\World;

class DeleteWorld
{
    public function __invoke(World $world): void
    {
        $world->delete();
    }
}
