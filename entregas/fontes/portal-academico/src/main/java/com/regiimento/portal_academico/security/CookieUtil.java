package com.regiimento.portal_academico.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class CookieUtil {

    public static final String NOME_COOKIE_REFRESH = "refresh_token";

    @Value("${app.cookie.secure:true}")
    private boolean cookieSecure;

    /**
     * Path restrito só ao endpoint de refresh/logout: o navegador não manda esse
     * cookie em nenhuma outra chamada à API, reduzindo a superfície de ataque.
     */
    public ResponseCookie construirCookieRefresh(String valor, Duration duracao) {
        return ResponseCookie.from(NOME_COOKIE_REFRESH, valor)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Lax")
                .path("/api/auth")
                .maxAge(duracao)
                .build();
    }

    public ResponseCookie construirCookieRefreshExpirado() {
        return ResponseCookie.from(NOME_COOKIE_REFRESH, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Lax")
                .path("/api/auth")
                .maxAge(0)
                .build();
    }
}
