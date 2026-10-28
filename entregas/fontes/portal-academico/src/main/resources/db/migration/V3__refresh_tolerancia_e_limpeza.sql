-- V3__refresh_tolerancia_e_limpeza.sql
-- 1) rotacionado_em: quando o token foi trocado por um novo (rotação). Só tokens rotacionados
--    há poucos segundos são tolerados se reaparecerem (F5 duplo, duas abas). Token revogado por
--    logout NÃO tem rotacionado_em e nunca é aceito de novo.
ALTER TABLE refresh_token ADD COLUMN rotacionado_em TIMESTAMP;

-- 2) Coluna sem uso: o refresh token agora vive na tabela refresh_token (só o hash).
ALTER TABLE usuario DROP COLUMN refresh_token_criptografado;
