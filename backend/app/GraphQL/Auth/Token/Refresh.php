<?php

namespace App\GraphQL\Auth\Token;

use Exception;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

final class Refresh
{
    /**
     * @throws Exception
     */
    public function __invoke($_, array $args): array
    {

        try {
            $accessToken = Auth::guard('api')->refresh();
        } catch (TokenInvalidException $e) {
            throw new Exception('Invalid refresh token');
        }

        return [
            'access_token' => $accessToken,
            'token_type' => 'Bearer',
            'expires_in' => Auth::guard('api')->factory()->getTTL() * 60,
            'user' => Auth::user(),
        ];
    }
}
