#!/bin/sh

set -e

mkdir -p bootstrap/cache
mkdir -p storage/app
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs

# Adjust ownership only in local/dev, not when on Fly volumes
if [ "$APP_ENV" != "production" ]; then
    chown -R www-data:www-data storage bootstrap/cache
fi

# Create storage symlink for serving uploaded files (local development only)
if [ "$APP_ENV" = "local" ] && [ ! -L "public/storage" ]; then
    php artisan storage:link
fi

# Hand off to environment-specific CMD
exec "$@"
