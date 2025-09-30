# Development guide

This document covers developer tooling, debugging, and workflows for working on the DAM project.

## Developer tools

### Backend: Laravel Telescope

Laravel Telescope provides debugging and monitoring for the backend API.

**Access**: http://localhost:8000/telescope

**Features**:
- GraphQL query inspection
- Database query monitoring
- Request/response logging
- Exception tracking
- Cache operations
- Job monitoring

**Note**: Telescope is only available in local development. The following requests are automatically excluded from Telescope logs:
- GraphQL introspection requests
- CORS OPTIONS requests

### Frontend: Apollo Client devtools

The Apollo Client DevTools browser extension provides GraphQL debugging for the frontend.

**Installation**: Install the [Apollo Client Devtools](https://www.apollographql.com/docs/react/development-testing/developer-tooling/#apollo-client-devtools) extension for your browser.

**Usage**:
- Open browser dev tools
- Navigate to the "Apollo" tab
- **Known Issue**: Apollo Client fails to connect to dev tools if they are already open when the page loads. If
  this happens, close dev tools, hard reload the page (Cmd+Shift+R / Ctrl+Shift+R), then reopen dev tools.

**Features**:
- GraphQL query explorer
- Cache inspection
- Mutation tracking
- Query performance monitoring

**Note**: In development mode with React Strict Mode enabled, you may see two Apollo Client instances in the extension.
This is expected behavior due to React’s intentional double-mounting in dev mode. The correct/active client is
automatically selected.

## Common development tasks

### Running the development environment

```bash
# Start backend services (database + API)
docker-compose up

# Start frontend dev server (in a separate terminal)
cd frontend
npm run dev
```

### Accessing services

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Laravel Telescope: http://localhost:8000/telescope
- PostgreSQL: localhost:5432
- Test database: localhost:5433

### Clearing caches

If you encounter issues with configuration not updating:

```bash
# Clear Laravel caches
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear

# Recache configuration
docker-compose exec backend php artisan config:cache
```

### Database access

```bash
# Access main database
docker-compose exec db psql -U app -d app

# Access test database
docker-compose exec db_test psql -U test -d test
```

## Environment configuration

The backend uses environment variables defined in `docker-compose.yml` for local development. Secrets (like API keys,
credentials) should be added to a `.env` file in the `backend/` directory, which is git-ignored.

Non-secret configuration is kept in `docker-compose.yml` to make the development setup more transparent and easier to
onboard new developers.

## Troubleshooting

### Images not loading in development

If images aren’t loading on http://localhost:3000, ensure:
1. The backend is running and accessible at http://localhost:8000
2. Try clearing Laravel caches (see above)

### Apollo Devtools not connecting

- Open DevTools before or during page load
- Click "Retry" in the Apollo tab if needed
- Check browser console for any Apollo Client errors

### Database connection issues

If the backend can’t connect to the database:
1. Ensure Docker containers are running: `docker-compose ps`
2. Check logs: `docker-compose logs db`
