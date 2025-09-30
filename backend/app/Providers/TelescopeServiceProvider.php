<?php declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class TelescopeServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->hideSensitiveRequestDetails();

        if ($this->app->isLocal() && class_exists(\Laravel\Telescope\Telescope::class)) {
            \Laravel\Telescope\Telescope::filter(function (\Laravel\Telescope\IncomingEntry $entry) {
                return
                    $this->app->isLocal() ||
                    $entry->isReportableException() ||
                    $entry->isFailedRequest() ||
                    $entry->isFailedJob() ||
                    $entry->isScheduledTask() ||
                    $entry->hasMonitoredTag();
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
