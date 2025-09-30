<?php

declare(strict_types=1);

namespace App\GraphQL\Resolvers;

use GraphQL\Error\Error;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Hash;

final class Auth_ChangePassword
{
    /**
     * @throws Error
     */
    public function __invoke($_, array $args): array
    {
        $input = $args['input'];
        $user = auth('api')->user();

        if (! Hash::check($input['currentPassword'], $user->password)) {
            throw new Error('Current password is incorrect');
        }

        $user->forceFill([
            'password' => Hash::make($input['newPassword']),
        ])->save();

        event(new PasswordReset($user));

        return [
            'user' => $user,
        ];
    }
}
