<?php

namespace App\GraphQL\Resolvers;

use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Hash;

final class Auth_User_Register
{
    /**
     * @throws Exception
     */
    public function __invoke($_, array $args): array
    {
        $input = $args['input'];

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
        ]);

        if (! $accessToken = auth('api')->attempt($input)) {
            throw new Exception('Invalid credentials');
        }

        return [
            'accessToken' => [
                'jwt' => $accessToken,
                'tokenType' => 'Bearer',
                'expiresIn' => auth('api')->factory()->getTTL() * 60,
            ],
            'user' => $user,
        ];
    }
}
