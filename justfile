# List all available commands
default:
    @just --list

# Lint code (context-aware, frontend only)
lint:
    #!/usr/bin/env bash
    set -e
    cwd="{{invocation_directory()}}"
    root="{{justfile_directory()}}"
    if [[ "$cwd" == *"/frontend"* ]] || [[ "$cwd" == "$root" ]]; then
        cd "$root/frontend" && npm run lint
    else
        echo "Lint only available for frontend"
        exit 1
    fi

# Format code (context-aware: backend if in backend/, frontend if in frontend/, both at root)
format:
    #!/usr/bin/env bash
    set -e
    cwd="{{invocation_directory()}}"
    root="{{justfile_directory()}}"
    if [[ "$cwd" == *"/backend"* ]]; then
        docker compose exec backend composer format
    elif [[ "$cwd" == *"/frontend"* ]]; then
        cd "$root/frontend" && npm run format
    else
        docker compose exec backend composer format
        cd "$root/frontend" && npm run format
    fi

# Check types (context-aware)
types:
    #!/usr/bin/env bash
    set -e
    cwd="{{invocation_directory()}}"
    root="{{justfile_directory()}}"
    if [[ "$cwd" == *"/backend"* ]]; then
        docker compose exec backend composer types
    elif [[ "$cwd" == *"/frontend"* ]]; then
        cd "$root/frontend" && npm run types
    else
        docker compose exec backend composer types
        cd "$root/frontend" && npm run types
    fi

# Run tests (context-aware)
test:
    #!/usr/bin/env bash
    set -e
    cwd="{{invocation_directory()}}"
    root="{{justfile_directory()}}"
    if [[ "$cwd" == *"/backend"* ]]; then
        docker compose exec backend composer test
    elif [[ "$cwd" == *"/frontend"* ]]; then
        echo "Frontend tests not yet set up"
        exit 1
    else
        docker compose exec backend composer test
        echo "Frontend tests not yet set up"
    fi

# Add shadcn/ui component (frontend only)
ui component:
    #!/usr/bin/env bash
    set -e
    cd {{justfile_directory()}}/frontend
    npx shadcn@latest add {{component}}
    npm run format

# Open shell in backend container
shell:
    docker compose exec backend bash

# Run E2E tests (ensures backend is running)
e2e:
    #!/usr/bin/env bash
    set -e
    root="{{justfile_directory()}}"

    # Check if backend is running
    if ! docker compose ps backend | grep -q "Up"; then
        echo "Starting backend services..."
        docker compose up -d
        echo "Waiting for backend to be ready..."
        for i in {1..30}; do
            if curl -sf http://localhost:8000/api/healthz > /dev/null 2>&1; then
                echo "Backend is ready"
                break
            fi
            if [ $i -eq 30 ]; then
                echo "Backend failed to start"
                exit 1
            fi
            sleep 2
        done
    fi

    # Run Playwright tests
    cd "$root/frontend" && npx playwright test
