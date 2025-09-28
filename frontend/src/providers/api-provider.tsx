import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { CombinedGraphQLErrors, ServerError } from '@apollo/client/errors';
import { SetContextLink } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import { ApolloProvider } from '@apollo/client/react';
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs';
import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { type AccessToken, RefreshTokenMutation, readAccessTokenFragment } from '@/graphql/auth';
import { getTokenExpiry, isTokenValid } from '@/lib/token';

interface AuthContextType {
  setAccessToken: (token: AccessToken) => void;
  logOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an ApiProvider');
  }

  return context;
}

export function ApiProvider(props: PropsWithChildren) {
  const [loaded, setLoaded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Runs once on app mount
  useEffect(() => {
    const stored = localStorage.getItem('accessToken');
    if (stored && isTokenValid(stored)) {
      setAccessTokenState(stored);
    } else if (stored) {
      // Token exists but is invalid/expired, clear it
      localStorage.removeItem('accessToken');
    }
    setLoaded(true);
  }, []);

  const logOut = useCallback(() => {
    setAccessTokenState(null);
    localStorage.removeItem('accessToken');

    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const client = useMemo(() => {
    const httpLink = new UploadHttpLink({
      uri: import.meta.env.VITE_API_URL,
      headers: {
        'Apollo-Require-Preflight': 'true',
      },
    });

    const authLink = new SetContextLink(({ headers }) => {
      return {
        headers: {
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      };
    });

    const errorLink = new ErrorLink(({ error }) => {
      // Handle server errors (like 401)
      if (ServerError.is(error) && error.statusCode === 401) {
        console.warn('Received 401 server error - logging out user');
        logOut();
        return;
      }

      // Handle GraphQL errors that might contain auth errors
      if (CombinedGraphQLErrors.is(error)) {
        for (const err of error.errors) {
          if (err.extensions?.code === 'UNAUTHENTICATED') {
            console.warn('Received UNAUTHENTICATED GraphQL error - logging out user');
            logOut();
            return;
          }
        }
      }

      // Handle network errors
      if (
        error &&
        typeof error === 'object' &&
        'networkError' in error &&
        error.networkError &&
        typeof error.networkError === 'object' &&
        'statusCode' in error.networkError &&
        (error.networkError as { statusCode: number }).statusCode === 401
      ) {
        console.warn('Received 401 network error - logging out user');
        logOut();
      }
    });

    return new ApolloClient({
      link: ApolloLink.from([errorLink, authLink, httpLink]),
      cache: new InMemoryCache(),
    });
  }, [accessToken, logOut]);

  const setAccessToken = useCallback(
    (token: AccessToken) => {
      setAccessTokenState(token.jwt);
      localStorage.setItem('accessToken', token.jwt);
    },
    [setAccessTokenState],
  );

  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (isRefreshing) {
      return false; // Already refreshing, don’t attempt again
    }

    setIsRefreshing(true);

    try {
      const result = await client.mutate({
        mutation: RefreshTokenMutation,
      });

      const refreshResult = result.data?.Auth_RefreshToken;

      if (refreshResult) {
        const newToken = readAccessTokenFragment(refreshResult.accessToken);
        setAccessToken(newToken);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [client, isRefreshing, setAccessToken]);

  useEffect(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    if (accessToken) {
      const nowSeconds = Math.floor(Date.now() / 1000);
      const expirySeconds = getTokenExpiry(accessToken);

      if (expirySeconds) {
        const refreshAtSeconds = expirySeconds - 5 * 60; // 5 minutes before expiry
        const timeUntilRefresh = Math.max(0, (refreshAtSeconds - nowSeconds) * 1000);

        refreshTimerRef.current = setTimeout(async () => {
          const success = await refreshToken();
          if (!success) {
            // Refresh failed, try once more in 30 seconds
            refreshTimerRef.current = setTimeout(async () => {
              const retrySuccess = await refreshToken();
              if (!retrySuccess) {
                logOut(); // Final failure — log out user
              }
            }, 30 * 1000);
          }
        }, timeUntilRefresh);
      }
    }
  }, [accessToken, logOut, refreshToken]);

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider
        value={{
          setAccessToken,
          logOut,
          isAuthenticated: Boolean(accessToken),
        }}
      >
        {loaded && props.children}
      </AuthContext.Provider>
    </ApolloProvider>
  );
}
