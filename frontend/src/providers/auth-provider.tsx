import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { type AccessToken } from '@/graphql/auth';

type StoredAccessToken = AccessToken & {
  expiresAt: number;
};

interface AuthContextType {
  accessToken: StoredAccessToken | null;
  setAccessToken: (token: AccessToken | null) => void;
  logOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export function AuthProvider(props: PropsWithChildren) {
  const [accessToken, setAccessTokenState] = useState<StoredAccessToken | null>(() => {
    const stored = localStorage.getItem('accessToken');
    return stored ? JSON.parse(stored) : null;
  });

  function setAccessToken(token: AccessToken | null) {
    if (token) {
      // Calculate actual expiration timestamp (yes, it’s in the token, but whatever)
      const expiresAt = Date.now() / 1000 + token.expiresIn;
      const tokenWithExpiry = { ...token, expiresAt };
      setAccessTokenState(tokenWithExpiry);
      localStorage.setItem('accessToken', JSON.stringify(tokenWithExpiry));
    } else {
      setAccessTokenState(null);
      localStorage.removeItem('accessToken');
    }
  }

  const logOut = useCallback(() => {
    setAccessToken(null);
    localStorage.removeItem('user');
  }, []);

  const isAuthenticated = !!accessToken;

  useEffect(() => {
    if (accessToken) {
      const now = Date.now() / 1000;
      if (now >= accessToken.expiresAt) {
        logOut();
      }
    }
  }, [accessToken, logOut]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        logOut,
        isAuthenticated,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
