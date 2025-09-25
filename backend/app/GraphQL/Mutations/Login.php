<?php

namespace App\GraphQL\Mutations;

use Exception;
use Illuminate\Support\Facades\Auth;

final class Login
{
    /**
     * @throws Exception
     */
    public function __invoke($_, array $args): array
    {
        $credentials = $args['input'];

        if (! $token = Auth::guard('api')->attempt($credentials)) {
            throw new Exception('Invalid credentials');
        }

        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::guard('api')->factory()->getTTL() * 60,
            'user' => Auth::user(),
        ];
    }
}
