<?php

namespace App\Policies;

use App\Models\Image;
use App\Models\User;
use App\Models\World;

class ImagePolicy
{
    public function view(User $user, Image $image): bool
    {
        return $image->world->user()->is($user);
    }

    public function create(User $user, World $world): bool
    {
        return $world->user()->is($user);
    }
}
