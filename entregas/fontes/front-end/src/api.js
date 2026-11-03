// Cliente da API. O access token fica só em memória; o refresh token vive em
// um cookie httpOnly que o navegador envia sozinho para /api/auth/*.
let accessToken = null;
let refreshInFlight = null;

// Marcador (não sensível) de que este navegador já teve login. Serve só para decidir se vale a
// pena chamar /api/auth/refresh ao abrir uma página: sem ele, todo visitante anônimo geraria uma
// chamada (e um erro no console) a cada página que abre.
const SESSAO_KEY = "regiimento:sessao";

function marcarSessao(ativa) {
  try {
    if (ativa) window.localStorage.setItem(SESSAO_KEY, "1");
    else window.localStorage.removeItem(SESSAO_KEY);
  } catch {
    // localStorage indisponível (modo privado, por exemplo): segue sem o marcador
  }
}

export function temSessaoSalva() {
  try {
    return window.localStorage.getItem(SESSAO_KEY) === "1";
  } catch {
    return false;
  }
}

export class ApiError extends Error {
  constructor(status, message, campos) {
    super(message || `Erro ${status}`);
    this.status = status;
    this.campos = campos || null;
  }
}

// O back responde erros como { erro, campos? }. Aproveita a mensagem para mostrar ao usuário.
async function lerErro(res) {
  let mensagem = "";
  let campos = null;
  try {
    const dados = await res.json();
    campos = dados.campos || null;
    mensagem = campos ? Object.values(campos).join(" ") : dados.erro || "";
  } catch {
    // corpo vazio ou que não é JSON
  }
  return new ApiError(res.status, mensagem, campos);
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
          // 401/403: cookie inexistente ou inválido, ou seja, não há sessão. Outros erros
          // (ex.: 500) podem ser passageiros e mantêm o marcador.
          if (res.status === 401 || res.status === 403) marcarSessao(false);
          return null;
        }
        const data = await res.json();
        accessToken = data.accessToken;
        marcarSessao(true);
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
  marcarSessao(false);
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  } catch {
    // sem rede: localmente a sessão já foi encerrada; o cookie expira sozinho
  }
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
  if (!res.ok) throw await lerErro(res);
  return res.status === 204 ? null : res.json();
}

export const get = (path) => api(path);
export const post = (path, body) => api(path, { method: "POST", body });
export const put = (path, body) => api(path, { method: "PUT", body });
export const patch = (path, body) => api(path, { method: "PATCH", body });
export const del = (path) => api(path, { method: "DELETE" });
