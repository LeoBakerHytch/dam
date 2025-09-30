<?php

declare(strict_types=1);

namespace App\GraphQL\Resolvers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

final class Auth_Register
{
    public function __invoke($_, array $args): array
    {
        $input = $args['input'];

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
        ]);

        /** @var \Tymon\JWTAuth\JWTGuard $guard */
        $guard = auth('api');
        $accessToken = $guard->login($user);

        return [
            'accessToken' => $accessToken,
            'user' => $user,
        ];
    }
}
