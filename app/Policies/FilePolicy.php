<?php

namespace App\Policies;

use App\Models\File;
use App\Models\User;
use App\Models\World;

class FilePolicy
{
    public function viewAny(User $user, World $world): bool
    {
        return $world->user()->is($user);
    }

    public function view(User $user, File $file): bool
    {
        return $file->world->user()->is($user);
    }

    public function create(User $user, World $world): bool
    {
        return $world->user()->is($user);
    }

    public function update(User $user, File $file): bool
    {
        return $file->world->user()->is($user);
    }

    public function delete(User $user, File $file): bool
    {
        return $file->world->user()->is($user);
    }
}
