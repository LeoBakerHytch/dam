<?php declare(strict_types=1);

namespace App\GraphQL\ErrorHandlers;

use GraphQL\Error\Error;
use Illuminate\Auth\AuthenticationException as LaravelAuthenticationException;
use Nuwave\Lighthouse\Execution\ErrorHandler;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;

class CustomAuthenticationErrorHandler implements ErrorHandler
{
    public function __invoke(?Error $error, \Closure $next): ?array
    {
        if ($error === null) {
            return $next(null);
        }

        $underlyingException = $error->getPrevious();
        if ($underlyingException instanceof LaravelAuthenticationException) {
            $authException = AuthenticationException::fromLaravel($underlyingException);

            return $next(new Error(
                $error->getMessage(),
                $error->getNodes(),
                $error->getSource(),
                $error->getPositions(),
                $error->getPath(),
                $authException,
                [
                    'code' => 'UNAUTHENTICATED',
                    'guards' => $authException->guards(),
                ]
            ));
        }

        return $next($error);
    }
}
