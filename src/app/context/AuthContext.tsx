import { createContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useFcm } from "../hooks/useFcm";
import defaultAxios from "../../api/axios";

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
  /** True once the startup token refresh attempt has completed (success or failure). */
  isAuthReady: boolean;
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

/**
 * Silently refresh the access token on app startup.
 *
 * The access token has a 15-minute TTL. When the user reloads the page
 * after >15 minutes of inactivity, the stored token is already expired
 * and every API call fires with a stale bearer — causing a cascade of
 * 401 errors (device-token, rider/status, SignalR handshake, etc.).
 *
 * By refreshing proactively on mount we always start with a valid token,
 * avoiding those errors before the axios interceptor even gets a chance.
 *
 * @returns the new access token string on success, null on failure
 */
const refreshOnStartup = async (
  refreshToken: string,
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>
): Promise<void> => {
  try {
    const response = await defaultAxios.post('/auth/refresh', { refreshToken });
    const tokenData = response.data?.data;
    const newAccessToken = tokenData?.accessToken;
    const newRefreshToken = tokenData?.refreshToken || refreshToken;

    if (!newAccessToken) return;

    // Write to localStorage FIRST so the axios interceptor and the
    // SignalR accessTokenFactory pick up the new token immediately.
    localStorage.setItem('auth_accessToken', newAccessToken);
    localStorage.setItem('auth_refreshToken', newRefreshToken);

    // Then update React state so useRideHub reconnects with the new token.
    setAuth(prev => {
      if (!prev.user) return prev;
      return { ...prev, accessToken: newAccessToken, refreshToken: newRefreshToken };
    });

    console.info('[Auth] Startup token refresh succeeded.');
  } catch {
    // Refresh token is also expired — force logout gracefully.
    console.warn('[Auth] Startup token refresh failed — clearing session.');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_accessToken');
    localStorage.removeItem('auth_refreshToken');
    setAuth({ user: null, accessToken: null, refreshToken: null });
  }
};

const AuthContext = createContext<AuthContextType>({
  auth: { user: null, accessToken: null, refreshToken: null },
  setAuth: () => {},
  isAuthReady: false,
});

// ─── Inner provider — has access to auth state ────────────────────────────────
function AuthProviderInner({ children, auth, setAuth }: {
  children: ReactNode;
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
}) {
  // isAuthReady: false while the startup refresh is in-flight.
  // Consumers (useRideHub, queries) should wait for this before connecting.
  const [isAuthReady, setIsAuthReady] = useState(false);

  const isLoggedIn = !!auth.user && !!auth.accessToken;

  // Initialise FCM for any logged-in user (Students, Riders, etc.)
  // cleanupFcm() is called on logout to remove the device token from the backend
  const { cleanupFcm } = useFcm({ enabled: isLoggedIn && isAuthReady });

  // ── Proactive startup refresh ─────────────────────────────────────────────
  // Runs once on mount. If there is an active session in localStorage but
  // the access token may be stale (>15 min since last login/refresh), this
  // silently gets a fresh token before any other hooks fire their queries.
  useEffect(() => {
    const storedRefreshToken = localStorage.getItem('auth_refreshToken');
    if (auth.user && storedRefreshToken) {
      refreshOnStartup(storedRefreshToken, setAuth).finally(() => {
        setIsAuthReady(true);
      });
    } else {
      // No session or no refresh token — nothing to refresh, ready immediately
      setIsAuthReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — run once on mount only

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
    <AuthContext.Provider value={{ auth, setAuth, isAuthReady }}>
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
