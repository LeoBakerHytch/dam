import { PropsWithChildren, createContext, useContext, useState, useEffect } from 'react';

interface AccessToken {
  jwt: string;
  tokenType: string;
  expiresIn: number;
}

interface AuthContextType {
  accessToken: AccessToken | null;
  setAccessToken: (token: AccessToken | null) => void;
  logout: () => void;
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
  const [accessToken, setAccessTokenState] = useState<AccessToken | null>(() => {
    const stored = localStorage.getItem('accessToken');
    return stored ? JSON.parse(stored) : null;
  });

  const setAccessToken = (token: AccessToken | null) => {
    setAccessTokenState(token);
    if (token) {
      localStorage.setItem('accessToken', JSON.stringify(token));
    } else {
      localStorage.removeItem('accessToken');
    }
  };

  const logout = () => {
    setAccessToken(null);
    // Could also clear user context here if needed
  };

  const isAuthenticated = !!accessToken;

  // Optional: Check token expiration
  useEffect(() => {
    if (accessToken) {
      const now = Date.now() / 1000;
      const expirationTime = accessToken.expiresIn;

      if (now >= expirationTime) {
        logout();
      }
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, logout, isAuthenticated }}>
      {props.children}
    </AuthContext.Provider>
  );
}