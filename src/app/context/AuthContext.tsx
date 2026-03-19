import { createContext, useState, ReactNode } from "react";

interface User {
  id: string; // From backend "userId"
  username: string; // New
  email: string;
  roles: string[]; // Maps from backend "role"
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null; // New
}

interface AuthContextType {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
}

const AuthContext = createContext<AuthContextType>({
  auth: { user: null, accessToken: null, refreshToken: null },
  setAuth: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({ user: null, accessToken: null, refreshToken: null });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
