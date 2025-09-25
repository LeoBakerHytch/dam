<?php

namespace App\GraphQL\Auth\Token;

use Exception;
use Illuminate\Support\Facades\Auth;

final class Refresh
{
    /**
     * @throws Exception
     */
    public function __invoke($_, array $args): array
    {
        $refreshToken = $args['input']['refresh_token'];

        try {
            $newToken = Auth::guard('api')->refresh($refreshToken);
        } catch (Exception $e) {
            throw new Exception('Invalid refresh token');
        }

        return [
            'access_token' => $newToken,
            'token_type' => 'bearer',
            'expires_in' => Auth::guard('api')->factory()->getTTL() * 60,
        ];
    }
}
