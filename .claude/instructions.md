# AI assistant instructions

This file contains project-specific instructions and preferences for AI assistants working on this codebase.

## Writing style

### Headings
- **Use sentence case for all headings**, not Title Case
- Proper nouns (Laravel, Telescope, Apollo, etc.) should retain their capitalization
- ✅ Good: "Running the development environment"
- ✅ Good: "Backend: Laravel Telescope"
- ❌ Bad: "Running the Development Environment"

## Code conventions

### General
- **Always end files with a newline character** (EOL at EOF)
- This is a POSIX standard and prevents issues with many tools

### TypeScript/React
- Prefer functional components with hooks
- Use explicit return types for non-trivial functions
- Avoid `any` types when possible; use `unknown` or proper types

### Laravel/PHP
- Follow PSR-12 coding standards
- Use type hints for function parameters and return types
- Prefer explicit over implicit

## Documentation
- Keep documentation concise and actionable
- Include code examples where helpful
- Document "why" not just "what" for non-obvious decisions

## Project structure
- Backend: Laravel API in `/backend`
- Frontend: React + Vite in `/frontend`
- Use `docker-compose` for local development
