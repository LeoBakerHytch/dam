<?php

namespace App\GraphQL\Resolvers;

use Exception;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

final class Auth_Token_Refresh
{
    /**
     * @throws Exception
     */
    public function __invoke($_, array $args): array
    {

        try {
            $accessToken = auth('api')->refresh();
        } catch (TokenInvalidException $e) {
            throw new Exception('Invalid refresh token');
        }

        return [
            'access_token' => $accessToken,
            'token_type' => 'Bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => auth('api')->user(),
        ];
    }
}
