import { createContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useFcm } from "../hooks/useFcm";

interface User {
  id: string; // From backend "userId"
  username: string;
  email: string;
  roles: string[]; // Maps from backend "role"
  profilePictureUrl?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface AuthContextType {
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

// ─── Inner provider — has access to auth state ────────────────────────────────
function AuthProviderInner({ children, auth, setAuth }: {
  children: ReactNode;
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
}) {
  const isLoggedIn = !!auth.user && !!auth.accessToken;

  // Initialise FCM for any logged-in user (Students, Riders, etc.)
  // cleanupFcm() is called on logout to remove the device token from the backend
  const { cleanupFcm } = useFcm({ enabled: isLoggedIn });

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

  // Synchronize static interceptor updates (tokens refreshed/logout) with React state
  useEffect(() => {
    const handleRefreshed = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const newAccessToken = customEvent.detail;
      setAuth(prev => {
        if (!prev.user) return prev;
        return { ...prev, accessToken: newAccessToken };
      });
    };

    const handleLogoutEvent = async () => {
      // Clean up FCM token before wiping auth state
      await cleanupFcm();
      setAuth({ user: null, accessToken: null, refreshToken: null });
    };

    window.addEventListener('auth_token_refreshed', handleRefreshed);
    window.addEventListener('auth_logout', handleLogoutEvent);

    return () => {
      window.removeEventListener('auth_token_refreshed', handleRefreshed);
      window.removeEventListener('auth_logout', handleLogoutEvent);
    };
  }, [cleanupFcm, setAuth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Exported provider — owns the state ──────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(getPersistedAuth);

  return (
    <AuthProviderInner auth={auth} setAuth={setAuth}>
      {children}
    </AuthProviderInner>
  );
};

export default AuthContext;
