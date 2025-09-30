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

# Open shell in backend container
shell:
    docker compose exec backend bash
