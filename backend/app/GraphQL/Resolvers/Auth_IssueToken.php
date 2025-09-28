<?php declare(strict_types=1);

namespace App\GraphQL\Resolvers;

use Exception;

final class Auth_IssueToken
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
            'accessToken' => $accessToken,
            'user' => auth('api')->user(),
        ];
    }
}
