# Portal REGIIMENTO — back-end (API)

API REST em Spring Boot 4 / Java 25, com PostgreSQL, Flyway e login com Google (OAuth2) + JWT.

## Como rodar

1. **JDK 25** instalado (no IntelliJ: *File > Project Structure > SDK > Add SDK > Download JDK > 25*).
2. **Banco** (Docker Desktop aberto), na pasta do back-end:
   ```bash
   docker compose up -d
   ```
3. **Variáveis de ambiente** (no IntelliJ: *Run > Edit Configurations > Modify options > Environment variables*):

   | Variável               | O que é                                                              |
   | ---------------------- | -------------------------------------------------------------------- |
   | `GOOGLE_CLIENT_ID`     | ID do cliente OAuth do Google Console (peça ao grupo, no privado)    |
   | `GOOGLE_CLIENT_SECRET` | Segredo do cliente OAuth (idem; nunca commitar)                      |
   | `JWT_SECRET`           | Chave de assinatura dos tokens, em **Base64**, com no mínimo 32 bytes |
   | `COOKIE_SECURE`        | `false` em desenvolvimento (http), `true` em produção (https)        |

   Para gerar um `JWT_SECRET` (PowerShell):
   ```powershell
   $b = New-Object byte[] 32; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b); [Convert]::ToBase64String($b)
   ```
   Gere uma vez e guarde: se a chave mudar, os tokens já emitidos deixam de valer.
4. Rodar `PortalAcademicoApplication` (▶ no IntelliJ) ou `./mvnw spring-boot:run` com as variáveis definidas.
   A API sobe em `http://localhost:8080`.

## Google Console

Em *APIs e Serviços > Credenciais > ID do cliente OAuth*, cadastre os URIs de redirecionamento:

- `http://localhost:5173/login/oauth2/code/google` (o login passa pelo proxy do Vite, porta 5173)
- `http://localhost:8080/login/oauth2/code/google` (para testar direto na API)

Com a tela de consentimento em modo "Testando", só entram os e-mails cadastrados como *usuários de teste*.

## Primeiro administrador

O login cria só `UsuarioInteressado`, e promover alguém exige ser admin. O **primeiro admin** é criado
direto no banco, depois de fazer login uma vez:

```bash
docker exec -it portal-db psql -U postgres -d portal_academico
```

```sql
SELECT id_usuario, email FROM usuario;   -- descubra o seu id

BEGIN;
DELETE FROM usuario_interessado WHERE id_usuario = 1;   -- troque 1 pelo seu id
INSERT INTO integrante_regimento (id_usuario, vinculo_institucional, status_ativo, administrador)
VALUES (1, 'Aluno', true, true);
COMMIT;
```

Depois, faça logout e login de novo (o token antigo ainda carrega o papel antigo). A partir daí, os
demais integrantes são promovidos pela tela *Pesquisadores > Adicionar Membro*.

## Autenticação, em resumo

- `/oauth2/authorization/google` inicia o login. No retorno, a API grava o cookie httpOnly `refresh_token`
  (path `/api/auth`) e redireciona para `app.frontend.callback-url`.
- `POST /api/auth/refresh` troca o cookie por um **access token** (JWT, 15 min). O refresh token é
  rotacionado a cada uso; reuso fora da janela de tolerância (`app.jwt.refresh-tolerancia-segundos`)
  revoga todas as sessões da pessoa.
- `Authorization: Bearer <accessToken>` nas demais chamadas. GETs são públicos, exceto os de admin
  (`/api/usuarios-interessados`, `/api/integrantes/todos`).
- Papéis: `ROLE_ADMIN` (inclui `INTEGRANTE`), `ROLE_INTEGRANTE`, `ROLE_INTERESSADO`. Integrante
  desativado perde as permissões de integrante.

## Erros

Todos os erros seguem `{ "timestamp", "status", "erro" }` (e `"campos"` quando é validação):
400 dados inválidos, 401 não autenticado, 403 sem permissão, 404 não encontrado, 405 método não permitido,
409 conflito (FK/duplicidade, ou regra de negócio), 500 erro interno (o stacktrace vai para o log).

## Testes

```bash
./mvnw test
```

`JwtServiceTest` roda sempre. `PortalAcademicoApplicationTests` (sobe o contexto inteiro) só roda quando
`JWT_SECRET` está definido e o banco está no ar.
