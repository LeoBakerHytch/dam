#!/bin/sh

set -e

if [ "$APP_ENV" = "local" ]; then
  if [ -d "public/storage" ] && [ ! -L "public/storage" ]; then
    echo "Removing existing directory public/storage"
    rm -rf public/storage
  fi

  if [ ! -e "public/storage" ]; then
    php artisan storage:link
  fi
fi

# Ensure storage volume is writable by www-data
if [ "$APP_ENV" = "production" ] && [ -d "storage/app/public" ]; then
  chown www-data:www-data storage/app/public
  chmod 775 storage/app/public
fi

# Hand off to environment-specific CMD
exec "$@"
