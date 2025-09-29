## Development conventions

### GraphQL resolvers

**Error handling:**
- Use `GraphQL\Error\Error` for business logic failures (auth, authorization, invalid state)
- Use `Illuminate\Validation\ValidationException` for input validation errors
- Never throw generic `Exception` - it results in 500 errors instead of user-facing messages
