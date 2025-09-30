<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class MigrateAll extends Command
{
    protected $signature = 'migrate:all';
    protected $description = 'Run migrations on both dev and test databases';

    public function handle(): int
    {
        $connections = ['pgsql', 'pgsql_test'];

        foreach ($connections as $connection) {
            $this->info("Running migrations for $connection...");
            $this->call('migrate', [
                '--database' => $connection,
            ]);
        }

        $this->info('Migrations complete for all databases');
        return 0;
    }
}
