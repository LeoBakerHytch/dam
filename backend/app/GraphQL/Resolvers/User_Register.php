<?php

namespace App\GraphQL\Resolvers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

final class User_Register
{
    public function __invoke($_, array $args): array
    {
        $input = $args['input'];

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
        ]);

        return [
            'user' => $user,
        ];
    }
}
