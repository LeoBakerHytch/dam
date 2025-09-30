import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
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

import { RefreshTokenMutation, type RefreshTokenMutationResult } from '@/graphql/auth';
import { getTokenExpiry, isTokenValid } from '@/lib/token';

interface AuthContextType {
  setAccessToken: (token: string) => void;
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
  const accessTokenRef = useRef<string | null>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Runs once on app mount
  useEffect(() => {
    const stored = localStorage.getItem('accessToken');
    if (stored && isTokenValid(stored)) {
      setAccessTokenState(stored);
      accessTokenRef.current = stored;
    } else if (stored) {
      // Token exists but is invalid/expired, clear it
      localStorage.removeItem('accessToken');
    }
    setLoaded(true);
  }, []);

  const logOut = useCallback(() => {
    setAccessTokenState(null);
    accessTokenRef.current = null;
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
        // Required for multipart uploads
        'Apollo-Require-Preflight': 'true',
      },
    });

    const authLink = new SetContextLink(({ headers }) => {
      return {
        headers: {
          ...headers,
          authorization: accessTokenRef.current ? `Bearer ${accessTokenRef.current}` : '',
        },
      };
    });

    const errorLink = new ErrorLink(({ error }) => {
      if (CombinedGraphQLErrors.is(error)) {
        for (const err of error.errors) {
          if (err.extensions?.code === 'UNAUTHENTICATED') {
            logOut();
            return;
          }
        }
      }
    });

    return new ApolloClient({
      link: ApolloLink.from([errorLink, authLink, httpLink]),
      cache: new InMemoryCache(),
    });
  }, [logOut]);

  const setAccessToken = useCallback(
    (accessToken: string) => {
      setAccessTokenState(accessToken);
      accessTokenRef.current = accessToken;
      localStorage.setItem('accessToken', accessToken);
    },
    [setAccessTokenState],
  );

  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (isRefreshing) {
      return false; // Already refreshing, don’t attempt again
    }

    setIsRefreshing(true);

    try {
      const result = await client.mutate<RefreshTokenMutationResult>({
        mutation: RefreshTokenMutation,
      });

      const refreshResult = result.data?.Auth_RefreshToken;

      if (refreshResult) {
        setAccessToken(refreshResult.accessToken);
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
