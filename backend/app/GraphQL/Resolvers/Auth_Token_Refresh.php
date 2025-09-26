<?php declare(strict_types=1);

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
            'accessToken' => [
                'jwt' => $accessToken,
                'tokenType' => 'Bearer',
                'expiresIn' => auth('api')->factory()->getTTL() * 60,
            ],
            'user' => auth('api')->user(),
        ];
    }
}
