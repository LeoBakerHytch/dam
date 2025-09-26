<?php declare(strict_types=1);

namespace App\Policies;

use App\Models\ImageAsset;
use App\Models\User;

class ImageAssetPolicy
{
    public function create(User $user): bool
    {
        return true;
    }

    public function view(User $user, ImageAsset $imageAsset): bool
    {
        return $imageAsset->user_id === $user->id;
    }

    public function update(User $user, ImageAsset $imageAsset): bool
    {
        return $imageAsset->user_id === $user->id;
    }

    public function delete(User $user, ImageAsset $imageAsset): bool
    {
        return $imageAsset->user_id === $user->id;
    }
}
