package com.regiimento.portal_academico.security;

/**
 * Representa o usuário autenticado na requisição atual.
 * É este objeto — nunca um ID vindo do corpo da requisição — que deve ser usado
 * para saber "quem" está criando um Post, Evento ou Comentario.
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

    public static AuthenticatedUser de(com.regiimento.portal_academico.model.Usuario usuario) {
        boolean ehIntegrante = usuario instanceof com.regiimento.portal_academico.model.IntegranteRegimento;
        boolean administrador = ehIntegrante
                && Boolean.TRUE.equals(((com.regiimento.portal_academico.model.IntegranteRegimento) usuario).getAdministrador());

        return new AuthenticatedUser(
                usuario.getId(),
                usuario.getEmail(),
                ehIntegrante ? TipoUsuario.INTEGRANTE : TipoUsuario.INTERESSADO,
                administrador
        );
    }
}
