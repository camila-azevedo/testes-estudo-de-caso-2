# Portal REGIIMENTO — front-end

React 18 + Vite. Consome a API `portal-academico` (Spring Boot).

## Como rodar

Pré-requisitos: Node.js 18 ou superior e a API no ar (veja o README do back-end).

```bash
npm install
npm run dev      # http://localhost:5173
```

O Vite encaminha `/api`, `/oauth2` e `/login` para `http://localhost:8080` (ver `vite.config.js`), então
o navegador só fala com `localhost:5173` e não há problema de CORS nem de cookie entre origens.
**Use sempre a porta 5173** (o back-end só redireciona o login para ela).

## Login

1. O botão "Fazer login com Google" abre `/oauth2/authorization/google`.
2. Depois do Google, o back grava o cookie httpOnly de refresh e redireciona para `/auth/callback`.
3. A página `/auth/callback` chama `POST /api/auth/refresh` e recebe o access token (guardado só em memória).
4. Ao abrir qualquer página, se este navegador já teve login, o front renova a sessão do mesmo jeito.

No Google Console, cadastre como URI de redirecionamento autorizado
`http://localhost:5173/login/oauth2/code/google` (a requisição passa pelo proxy do Vite, então o
Spring monta o `redirect_uri` com a porta 5173).

## Scripts

| Comando           | O que faz                       |
| ----------------- | ------------------------------- |
| `npm run dev`     | servidor de desenvolvimento     |
| `npm run build`   | build de produção em `dist/`    |
| `npm run lint`    | ESLint                          |

## Estrutura

- `src/api.js`: cliente da API (token em memória, refresh automático em 401).
- `src/auth.jsx` e `src/authContext.js`: estado de login (`useAuth()`).
- `src/mappers.js`: converte as respostas da API para o formato dos componentes.
- `src/useApi.js`: hook `useApiList` para listar dados.
- `src/components/`: telas e componentes (Eventos, Textos, Integrantes, Calendário...).
