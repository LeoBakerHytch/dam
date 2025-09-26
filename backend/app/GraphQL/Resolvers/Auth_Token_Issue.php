<?php declare(strict_types=1);

namespace App\GraphQL\Resolvers;

use Exception;

final class Auth_Token_Issue
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
            'accessToken' => [
                'jwt' => $accessToken,
                'tokenType' => 'Bearer',
                'expiresIn' => auth('api')->factory()->getTTL() * 60,
            ],
            'user' => auth('api')->user(),
        ];
    }
}
