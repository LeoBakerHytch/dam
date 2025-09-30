<?php

declare(strict_types=1);

namespace App\GraphQL\Resolvers;

use App\Models\User;

final class User_UpdateProfile
{
    public function __invoke($_, array $args): array
    {
        $input = $args['input'];

        /** @var User $user */
        $user = auth('api')->user();

        if (isset($input['name'])) {
            $user->update(['name' => $input['name']]);
            $user->save();
        }

        return [
            'user' => $user,
        ];
    }
}
