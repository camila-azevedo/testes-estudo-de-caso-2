import { useEffect, useState } from "react";
import { get } from "./api";

// Busca um GET da API e converte o resultado com `map`.
export function useApiList(path, map) {
  const [state, setState] = useState({ items: [], loading: true, error: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    get(path)
      .then((data) => active && setState({ items: data.map(map), loading: false, error: null }))
      .catch((error) => active && setState({ items: [], loading: false, error }));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, version]);

  return { ...state, reload: () => setVersion((v) => v + 1) };
}
