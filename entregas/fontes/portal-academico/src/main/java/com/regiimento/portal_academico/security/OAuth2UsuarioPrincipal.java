package com.regiimento.portal_academico.security;

import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * Wrapper que carrega, além dos atributos brutos do provedor OAuth2,
 * o AuthenticatedUser já resolvido/persistido no banco (ver CustomOAuth2UserService).
 */
public class OAuth2UsuarioPrincipal implements OAuth2User {

    private final AuthenticatedUser authenticatedUser;
    private final Map<String, Object> atributos;

    public OAuth2UsuarioPrincipal(AuthenticatedUser authenticatedUser, Map<String, Object> atributos) {
        this.authenticatedUser = authenticatedUser;
        this.atributos = atributos;
    }

    public AuthenticatedUser getAuthenticatedUser() {
        return authenticatedUser;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return atributos;
    }

    @Override
    public Collection<? extends org.springframework.security.core.GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getName() {
        return authenticatedUser.email();
    }
}
