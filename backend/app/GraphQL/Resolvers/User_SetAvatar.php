<?php declare(strict_types=1);

namespace App\GraphQL\Resolvers;

use App\Models\User;
use GraphQL\Error\Error;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

final class User_SetAvatar
{
    /**
     * @throws Error
     */
    public function __invoke($_, array $args): array
    {
        $input = $args['input'];

        /** @var User $user */
        $user = auth('api')->user();

        /** @var UploadedFile $avatar */
        $avatar = $input['avatar'];

        if (!$avatar->isValid()) {
            throw new Error('Invalid file uploaded');
        }

        $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($avatar->getMimeType(), $allowedMimes)) {
            throw new Error('Only JPEG, PNG, GIF, and WebP images are allowed');
        }

        $maxSize = 2 * 1024 * 1024; // 2MB
        if ($avatar->getSize() > $maxSize) {
            throw new Error('File size must not exceed 2MB');
        }

        if ($user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
        }

        $path = $avatar->store('avatars', 'public');

        $user->avatar_path = $path;
        $user->save();

        return [
            'user' => $user,
        ];
    }
}
