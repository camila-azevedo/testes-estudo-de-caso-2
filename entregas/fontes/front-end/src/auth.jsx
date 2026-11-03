import { useCallback, useEffect, useMemo, useState } from "react";
import { logout as apiLogout, refresh, temSessaoSalva } from "./api";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Só fica "carregando" se este navegador já teve login: visitante anônimo não chama o back-end.
  const [loading, setLoading] = useState(temSessaoSalva);

  // Restaura a sessão ao abrir o site (se o cookie de refresh ainda for válido).
  useEffect(() => {
    if (!temSessaoSalva()) return undefined;
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

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
