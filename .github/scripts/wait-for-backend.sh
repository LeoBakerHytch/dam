#!/bin/bash
set -e

# CI-only script - requires $COMPOSE_CMD env var to be set by workflow
if [[ -z "$COMPOSE_CMD" ]]; then
  echo "Error: \$COMPOSE_CMD env var not set. This script is for CI use only."
  exit 1
fi

echo "Waiting for backend container to be ready..."
for i in {1..30}; do
  if $COMPOSE_CMD exec -T backend php artisan --version 2>/dev/null; then
    echo "Backend is ready"
    exit 0
  fi
  echo "Waiting for backend... ($i/30)"
  sleep 2
done

echo "Backend failed to start"
exit 1
