<?php

namespace App\GraphQL\Resolvers;

use App\Models\User;
use Exception;

final class User_UpdateProfile
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

        $updateData = array_filter($input, fn($value) => $value !== null);

        if (!empty($updateData)) {
            $user->update($updateData);
        }

        return [
            'user' => $user->fresh(),
        ];
    }
}
