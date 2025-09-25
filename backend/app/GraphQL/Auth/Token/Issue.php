<?php

namespace App\GraphQL\Auth\Token;

use Exception;
use Illuminate\Support\Facades\Auth;

final class Issue
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

        $refreshToken = Auth::guard('api')
                ->setToken($token)
                ->getToken()
                ->getClaim('jti') . '_refresh';

        return [
            'access_token' => $token,
            'refresh_token' => $refreshToken,
            'user' => Auth::user(),
        ];
    }
}
