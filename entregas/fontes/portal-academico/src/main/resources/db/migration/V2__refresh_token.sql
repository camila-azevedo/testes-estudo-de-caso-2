-- V2__refresh_token.sql
-- Tokens de refresh opacos (não são o JWT em si — só um hash dele é guardado,
-- então um vazamento do banco não permite forjar sessões).

CREATE TABLE refresh_token (
    id_refresh_token   BIGSERIAL PRIMARY KEY,
    id_usuario         BIGINT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    token_hash         VARCHAR(255) NOT NULL UNIQUE,
    criado_em          TIMESTAMP NOT NULL DEFAULT now(),
    expira_em          TIMESTAMP NOT NULL,
    revogado           BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_refresh_token_usuario ON refresh_token(id_usuario);
