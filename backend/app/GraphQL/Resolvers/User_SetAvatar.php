<?php declare(strict_types=1);

namespace App\GraphQL\Resolvers;

use App\Models\User;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

final class User_SetAvatar
{
    /**
     * @throws Exception
     */
    public function __invoke($_, array $args): array
    {
        $input = $args['input'];

        $authenticatedUser = auth('api')->user();
        if (!$authenticatedUser) {
            throw new Exception('User not authenticated');
        }

        $user = User::find($authenticatedUser->getAuthIdentifier());
        if (!$user) {
            throw new Exception('User not found');
        }

        /** @var UploadedFile $avatar */
        $avatar = $input['avatar'];

        if (!$avatar->isValid()) {
            throw new Exception('Invalid file uploaded');
        }

        $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($avatar->getMimeType(), $allowedMimes)) {
            throw new Exception('Only JPEG, PNG, GIF, and WebP images are allowed');
        }

        $maxSize = 2 * 1024 * 1024; // 2MB
        if ($avatar->getSize() > $maxSize) {
            throw new Exception('File size must not exceed 2MB');
        }

        if ($user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
        }

        $path = $avatar->store('avatars', 'public');

        $user->avatar_path = $path;
        $user->save();

        return [
            'user' => $user->fresh(),
        ];
    }
}
