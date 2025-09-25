<?php

namespace App\GraphQL\Auth\Token;

use Exception;

final class Issue
{
    /**
     * @throws Exception
     */
    public function __invoke($_, array $args): array
    {
        $credentials = $args['input'];

        if (! $accessToken = auth('api')->attempt($credentials)) {
            throw new Exception('Invalid credentials');
        }

        return [
            'access_token' => $accessToken,
            'token_type' => 'Bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => auth('api')->user(),
        ];
    }
}
