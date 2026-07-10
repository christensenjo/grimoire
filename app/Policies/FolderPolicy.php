<?php

namespace App\Policies;

use App\Models\Folder;
use App\Models\User;
use App\Models\World;

class FolderPolicy
{
    public function viewAny(User $user, World $world): bool
    {
        return $world->user()->is($user);
    }

    public function view(User $user, Folder $folder): bool
    {
        return $folder->world->user()->is($user);
    }

    public function create(User $user, World $world): bool
    {
        return $world->user()->is($user);
    }

    public function update(User $user, Folder $folder): bool
    {
        return $folder->world->user()->is($user);
    }

    public function delete(User $user, Folder $folder): bool
    {
        return $folder->world->user()->is($user);
    }
}
