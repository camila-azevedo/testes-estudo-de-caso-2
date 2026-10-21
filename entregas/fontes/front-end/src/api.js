// Cliente da API. O access token fica só em memória; o refresh token vive em
// um cookie httpOnly que o navegador envia sozinho para /api/auth/*.
let accessToken = null;
let refreshInFlight = null;

export class ApiError extends Error {
  constructor(status, message) {
    super(message || `Erro ${status}`);
    this.status = status;
  }
}

// Renova o access token. Chamadas simultâneas (ex.: StrictMode) compartilham a
// mesma requisição, porque o refresh token é rotacionado a cada uso.
export function refresh() {
  if (!refreshInFlight) {
    refreshInFlight = fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          accessToken = null;
          return null;
        }
        const data = await res.json();
        accessToken = data.accessToken;
        return data.usuario;
      })
      .catch(() => {
        accessToken = null;
        return null;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

export async function logout() {
  accessToken = null;
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
}

export async function api(path, { body, headers, ...options } = {}) {
  const send = () =>
    fetch(`/api${path}`, {
      ...options,
      credentials: "include",
      headers: {
        ...(body !== undefined && { "Content-Type": "application/json" }),
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...headers,
      },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    });

  let res = await send();
  if (res.status === 401 && (await refresh())) res = await send();
  if (!res.ok) throw new ApiError(res.status);
  return res.status === 204 ? null : res.json();
}

export const get = (path) => api(path);
export const post = (path, body) => api(path, { method: "POST", body });
export const put = (path, body) => api(path, { method: "PUT", body });
export const del = (path) => api(path, { method: "DELETE" });
