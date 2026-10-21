import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { logout as apiLogout, refresh } from "./api";

const AuthContext = createContext({
  user: null,
  loading: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaura a sessão ao abrir o site (se o cookie de refresh ainda for válido).
  useEffect(() => {
    let active = true;
    refresh().then((usuario) => {
      if (!active) return;
      setUser(usuario);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(() => {
    window.location.href = "/oauth2/authorization/google";
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
