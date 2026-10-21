package com.regiimento.portal_academico.security;

/**
 * Representa o usuário autenticado na requisição atual.
 * É este objeto — nunca um ID vindo do corpo da requisição — que deve ser usado
 * para saber "quem" está criando um Post, Evento ou Comentario.
 *
 * Quem decide se alguém é INTEGRANTE/admin é o AuthenticatedUserResolver,
 * consultando a tabela integrante_regimento diretamente — não existe mais um
 * factory method aqui baseado em "instanceof", porque essa checagem via
 * polimorfismo do Hibernate (herança JOINED sem coluna discriminadora) se
 * mostrou não confiável em alguns ambientes.
 */
public record AuthenticatedUser(
        Long id,
        String email,
        TipoUsuario tipo,
        boolean administrador
) {
    public enum TipoUsuario {
        INTEGRANTE,
        INTERESSADO
    }

    public boolean isIntegrante() {
        return tipo == TipoUsuario.INTEGRANTE;
    }
}
