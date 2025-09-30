<?php

declare(strict_types=1);

namespace App\GraphQL\Resolvers;

use GraphQL\Error\Error;

final class Auth_IssueToken
{
    /**
     * @throws Error
     */
    public function __invoke($_, array $args): array
    {
        $credentials = $args['input'];

        if (! $accessToken = auth('api')->attempt($credentials)) {
            throw new Error('Invalid credentials');
        }

        return [
            'accessToken' => $accessToken,
            'user' => auth('api')->user(),
        ];
    }
}
