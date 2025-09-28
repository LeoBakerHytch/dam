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

# Hand off to environment-specific CMD
exec "$@"
