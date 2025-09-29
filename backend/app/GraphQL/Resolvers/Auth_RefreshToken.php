<?php declare(strict_types=1);

namespace App\GraphQL\Resolvers;

use GraphQL\Error\Error;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

final class Auth_RefreshToken
{
    /**
     * @throws Error
     */
    public function __invoke($_, array $args): array
    {
        try {
            $accessToken = auth('api')->refresh();
        } catch (TokenInvalidException $e) {
            throw new Error('Invalid refresh token');
        }

        return [
            'accessToken' => $accessToken,
            'user' => auth('api')->user(),
        ];
    }
}
