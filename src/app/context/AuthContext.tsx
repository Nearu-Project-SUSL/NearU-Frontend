import { createContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string; // From backend "userId"
  username: string;
  email: string;
  roles: string[]; // Maps from backend "role"
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthContextType {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
}

// Helper: safely read persisted auth from localStorage
const getPersistedAuth = (): AuthState => {
  try {
    const user = localStorage.getItem('auth_user');
    const accessToken = localStorage.getItem('auth_accessToken');
    const refreshToken = localStorage.getItem('auth_refreshToken');
    if (user && accessToken) {
      return {
        user: JSON.parse(user),
        accessToken,
        refreshToken,
      };
    }
  } catch {
    // Corrupted storage — clear it
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_accessToken');
    localStorage.removeItem('auth_refreshToken');
  }
  return { user: null, accessToken: null, refreshToken: null };
};

const AuthContext = createContext<AuthContextType>({
  auth: { user: null, accessToken: null, refreshToken: null },
  setAuth: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize from localStorage so refresh doesn't log the user out
  const [auth, setAuth] = useState<AuthState>(getPersistedAuth);

  // Keep localStorage in sync whenever auth changes
  useEffect(() => {
    if (auth.user && auth.accessToken) {
      localStorage.setItem('auth_user', JSON.stringify(auth.user));
      localStorage.setItem('auth_accessToken', auth.accessToken);
      localStorage.setItem('auth_refreshToken', auth.refreshToken ?? '');
    } else {
      // Cleared auth (logout) — wipe storage
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_accessToken');
      localStorage.removeItem('auth_refreshToken');
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
