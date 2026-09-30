-- V1__criacao_inicial.sql
-- PostgreSQL

CREATE TABLE usuario (
                         id_usuario                    BIGSERIAL PRIMARY KEY,
                         email                         VARCHAR(255) NOT NULL UNIQUE,
                         nome                          VARCHAR(255) NOT NULL,
                         data_criacao                  TIMESTAMP NOT NULL DEFAULT now(),
                         imagem                        VARCHAR(500),
                         id_provedor_externo           VARCHAR(255) NOT NULL,
                         autenticacao_provedor         VARCHAR(100) NOT NULL,
                         refresh_token_criptografado   TEXT
);

CREATE TABLE integrante_regimento (
                                      id_usuario              BIGINT PRIMARY KEY REFERENCES usuario(id_usuario) ON DELETE CASCADE,
                                      vinculo_institucional   VARCHAR(100) NOT NULL,
                                      linha_pesquisa          VARCHAR(255),
                                      lattes                  VARCHAR(255),
                                      titulacao               VARCHAR(100),
                                      status_ativo            BOOLEAN NOT NULL DEFAULT TRUE,
                                      administrador           BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE usuario_interessado (
                                     id_usuario                  BIGINT PRIMARY KEY REFERENCES usuario(id_usuario) ON DELETE CASCADE,
                                     id_integrante_cadastrante   BIGINT REFERENCES integrante_regimento(id_usuario)
);

CREATE TABLE publicacao_academica (
                                      id_publicacao    BIGSERIAL PRIMARY KEY,
                                      titulo           VARCHAR(500) NOT NULL,
                                      resumo           TEXT,
                                      data_publicacao  DATE,
                                      tipo             VARCHAR(100)
);

CREATE TABLE usuario_publicacao (
                                    id_usuario       BIGINT NOT NULL REFERENCES usuario(id_usuario),
                                    id_publicacao    BIGINT NOT NULL REFERENCES publicacao_academica(id_publicacao),
                                    PRIMARY KEY (id_usuario, id_publicacao)
);

CREATE TABLE post (
                      id_post                  BIGSERIAL PRIMARY KEY,
                      data_criacao             TIMESTAMP NOT NULL DEFAULT now(),
                      conteudo_texto           TEXT,
                      tipo                     VARCHAR(100),
                      imagem                   VARCHAR(500),
                      id_integrante_regimento  BIGINT NOT NULL REFERENCES integrante_regimento(id_usuario)
);

CREATE TABLE comentario (
                            id_comentario    BIGSERIAL PRIMARY KEY,
                            data_hora        TIMESTAMP NOT NULL DEFAULT now(),
                            texto            TEXT,
                            id_usuario       BIGINT NOT NULL REFERENCES usuario(id_usuario),
                            id_post          BIGINT NOT NULL REFERENCES post(id_post)
);

CREATE TABLE evento (
                        id_evento                BIGSERIAL PRIMARY KEY,
                        nome_evento              VARCHAR(255) NOT NULL,
                        descricao                TEXT,
                        link_acesso              VARCHAR(500),
                        destaque                 BOOLEAN NOT NULL DEFAULT FALSE,
                        imagem                   VARCHAR(500),
                        data_evento              TIMESTAMP,
                        id_integrante_regimento  BIGINT NOT NULL REFERENCES integrante_regimento(id_usuario)
);