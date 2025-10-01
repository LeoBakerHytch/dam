<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | Default Database Connection Name
    |--------------------------------------------------------------------------
    |
    | Here you may specify which of the database connections below you wish
    | to use as your default connection for database operations. This is
    | the connection which will be utilized unless another connection
    | is explicitly specified when you execute a query / statement.
    |
    */

    'default' => env('DB_CONNECTION', 'pgsql'),

    /*
    |--------------------------------------------------------------------------
    | Database Connections
    |--------------------------------------------------------------------------
    */

    'connections' => [
        'pgsql' => [
            'driver' => 'pgsql',
            'url' => env('DATABASE_URL'), // Overrides everything below
            'host' => 'db',
            'port' => '5432',
            'database' => 'app',
            'username' => 'app',
            'password' => 'secret',
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            'search_path' => 'public',
            'sslmode' => 'prefer',
        ],

        // Test database connection
        'pgsql_test' => [
            'driver' => 'pgsql',
            'url' => env('TEST_DATABASE_URL'), // Overrides everything below
            'host' => env('DB_HOST', 'db_test'),
            'port' => env('DB_PORT', '5432'),
            'database' => env('DB_DATABASE', 'test'),
            'username' => env('DB_USERNAME', 'test'),
            'password' => env('DB_PASSWORD', 'secret'),
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            'schema' => 'public',
            'sslmode' => 'prefer',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Migration Repository Table
    |--------------------------------------------------------------------------
    |
    | This table keeps track of all the migrations that have already run for
    | your application. Using this information, we can determine which of
    | the migrations on disk haven't actually been run on the database.
    |
    */

    'migrations' => [
        'table' => 'migrations',
        'update_date_on_publish' => true,
    ],
];
