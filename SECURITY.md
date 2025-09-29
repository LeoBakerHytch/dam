# Security considerations

Bear in mind, this is a demo app and not a production-ready application. Several security features have therefore been
intentionally simplified or omitted.

## Known limitations

### Email enumeration

The registration and login mutations (`Auth_Register` & `Auth_IssueToken`) reveal whether an email address is registered
in the system through different error messages. This allows:

- Testing whether specific email addresses have accounts;
- Validating leaked email lists against the user database;
- Building user databases for targeted attacks.

**Production solution:** Implement generic error messages for authentication failures, email verification flows, and
rate limiting to make enumeration impractical.

### No email verification

Users can register with any email address without verification, and we immediately issue an access token (so that a demo
user can register and start trying things out immediately).

**Production solution:** Require email verification before granting access, implement separate verification and login
flows.

### Rate limiting

Rate limiting is minimal or absent on authentication endpoints, making brute force attacks and enumeration easier.

**Production solution:** Implement comprehensive rate limiting on all authentication endpoints (registration, login,
password reset, token refresh).

### Simplified authentication flow

The application prioritizes demonstrating GraphQL API patterns and testing conventions over production-grade
authentication security.

**Production solution:** Add refresh token rotation, token revocation, secure session management, and potentially
OAuth2/OIDC.
