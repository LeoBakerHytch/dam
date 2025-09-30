<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class TelescopeServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->hideSensitiveRequestDetails();

        if ($this->app->isLocal() && class_exists(\Laravel\Telescope\Telescope::class)) {
            \Laravel\Telescope\Telescope::filter(function (\Laravel\Telescope\IncomingEntry $entry) {
                // Drop CORS preflight requests
                if ($entry->type === 'request'
                    && strtoupper($entry->content['method'] ?? '') === 'OPTIONS') {
                    return false;
                }

                // Drop GraphQL introspection queries
                if ($entry->type === 'request'
                    && ($entry->content['uri'] ?? '') === '/graphql') {

                    $payload = $entry->content['payload'] ?? null;

                    if (is_string($payload)) {
                        $payload = json_decode($payload, true);
                    }

                    if (is_array($payload) && ($payload['operationName'] ?? null) === 'IntrospectionQuery') {
                        return false;
                    }
                }

                // Otherwise, record everything (this runs local-only anyway)
                return true;
            });
        }
    }

    protected function hideSensitiveRequestDetails(): void
    {
        if ($this->app->environment('local') && class_exists(\Laravel\Telescope\Telescope::class)) {
            \Laravel\Telescope\Telescope::hideRequestParameters(['_token']);

            \Laravel\Telescope\Telescope::hideRequestHeaders([
                'cookie',
                'x-csrf-token',
                'x-xsrf-token',
            ]);
        }
    }
}
