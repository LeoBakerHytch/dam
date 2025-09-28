<?php declare(strict_types=1);

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

/**
 * Ensures the request is not vulnerable to cross-site request forgery.
 *
 * Similar to Lighthouse's EnsureXHR middleware but allows multipart/form-data
 * for file uploads via the Upload scalar.
 */
class EnsureXHROrMultipart
{
    /** @see https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-enctype */
    public const FORBIDDEN_FORM_CONTENT_TYPES = [
        'application/x-www-form-urlencoded',
        'text/plain',
    ];

    public function handle(Request $request, \Closure $next): mixed
    {
        $method = $request->getRealMethod();

        if ($method === 'GET') {
            throw new BadRequestHttpException('GET requests are forbidden');
        }

        if ($method !== 'POST') {
            return $next($request);
        }

        if ($request->header('X-Requested-With', '') === 'XMLHttpRequest') {
            return $next($request);
        }

        $contentType = $request->header('content-type', '');
        // @phpstan-ignore-next-line wrongly assumes $contentType to always be string
        if (is_array($contentType)) {
            $contentType = $contentType[0];
        }

        // @phpstan-ignore-next-line wrongly assumes $contentType to always be string
        if ($contentType === null || $contentType === '') {
            throw new BadRequestHttpException('Content-Type header must be set');
        }

        // Allow multipart/form-data for file uploads (Upload scalar)
        if (Str::startsWith($contentType, 'multipart/form-data')) {
            return $next($request);
        }

        // Block other form content types that are vulnerable to CSRF
        if (Str::startsWith($contentType, static::FORBIDDEN_FORM_CONTENT_TYPES)) {
            throw new BadRequestHttpException("Content-Type {$contentType} is forbidden");
        }

        return $next($request);
    }
}