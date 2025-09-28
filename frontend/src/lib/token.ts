/**
 * Extracts the expiry timestamp from a JWT
 * @param jwt The token string
 * @returns The expiry timestamp in seconds, or null if parsing fails
 */
export function getTokenExpiry(jwt: string): number | null {
  try {
    const parts = jwt.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload);
    const parsed = JSON.parse(decoded);

    return typeof parsed.exp === 'number' ? parsed.exp : null;
  } catch {
    return null;
  }
}

/**
 * Checks if a JWT is valid (properly formatted and not expired)
 * @param jwt The token string
 * @returns True if the token is valid and not expired, false otherwise
 */
export function isTokenValid(jwt: string): boolean {
  if (!jwt || typeof jwt !== 'string') {
    return false;
  }

  const expiry = getTokenExpiry(jwt);
  if (expiry === null) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  return expiry > now;
}
