<?php declare(strict_types=1);

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

        if (isset($input['name'])) {
            $user->name = $input['name'];
            $user->save();
        }

        return [
            'user' => $user->fresh(),
        ];
    }
}
