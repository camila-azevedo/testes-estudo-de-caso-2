import { createContext, useContext } from "react";

// Contexto e hook ficam fora do auth.jsx para que aquele arquivo exporte só o componente
// (exigência do Fast Refresh do Vite).
export const AuthContext = createContext({
  user: null,
  loading: false,
  login: () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);
