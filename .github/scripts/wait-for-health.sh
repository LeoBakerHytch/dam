#!/bin/bash
set -e

echo "Waiting for backend health check..."
for i in {1..30}; do
  if curl -f http://localhost:8000/api/healthz 2>/dev/null; then
    echo "Backend is healthy"
    exit 0
  fi
  echo "Waiting for backend health... ($i/30)"
  sleep 2
done

echo "Backend health check failed"
exit 1
