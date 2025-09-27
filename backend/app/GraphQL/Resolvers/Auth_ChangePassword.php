<?php declare(strict_types=1);

namespace App\GraphQL\Resolvers;

use App\Models\User;
use Exception;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Hash;

final class Auth_ChangePassword
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

        if (!Hash::check($input['currentPassword'], $user->password)) {
            throw new Exception('Current password is incorrect');
        }

        $user->forceFill([
            'password' => Hash::make($input['newPassword']),
        ])->save();

        event(new PasswordReset($user));

        return [
            'success' => true,
            'user' => $user->fresh(),
        ];
    }
}
