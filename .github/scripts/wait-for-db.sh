#!/bin/bash
set -e

# CI-only script - requires $COMPOSE_CMD env var to be set by workflow
if [[ -z "$COMPOSE_CMD" ]]; then
  echo "Error: \$COMPOSE_CMD env var not set. This script is for CI use only."
  exit 1
fi

echo "Waiting for database to be ready..."
for i in {1..30}; do
  if $COMPOSE_CMD exec -T db pg_isready -U test 2>/dev/null; then
    echo "Database is ready"
    exit 0
  fi
  echo "Waiting for database... ($i/30)"
  sleep 2
done

echo "Database failed to become ready"
exit 1
