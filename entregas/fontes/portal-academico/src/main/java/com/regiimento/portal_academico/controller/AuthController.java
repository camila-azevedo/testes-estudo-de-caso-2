package com.regiimento.portal_academico.controller;

import com.regiimento.portal_academico.security.AuthenticatedUser;
import com.regiimento.portal_academico.security.AuthenticatedUserResolver;
import com.regiimento.portal_academico.security.CookieUtil;
import com.regiimento.portal_academico.security.JwtService;
import com.regiimento.portal_academico.security.RefreshTokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;
    private final CookieUtil cookieUtil;
    private final AuthenticatedUserResolver authenticatedUserResolver;

    /**
     * Chamado pela SPA logo após o redirect do OAuth2 (e sempre que o access
     * token em memória expira/some, ex.: recarregou a página). O cookie
     * httpOnly do refresh token vai junto automaticamente — não precisa mandar
     * nada no corpo.
     */
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refresh(HttpServletRequest request) {
        String refreshCru = extrairCookieRefresh(request)
                .orElseThrow(() -> new AccessDeniedException("Refresh token ausente"));

        var resultado = refreshTokenService.validarERotacionar(refreshCru);
        AuthenticatedUser usuarioAutenticado = authenticatedUserResolver.resolver(resultado.usuario());
        String novoAccessToken = jwtService.gerarToken(usuarioAutenticado);

        var cookie = cookieUtil.construirCookieRefresh(
                resultado.token().valorCru(),
                Duration.between(java.time.LocalDateTime.now(), resultado.token().expiraEm())
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of(
                        "accessToken", novoAccessToken,
                        "usuario", Map.of(
                                "id", usuarioAutenticado.id(),
                                "email", usuarioAutenticado.email(),
                                "tipo", usuarioAutenticado.tipo(),
                                "administrador", usuarioAutenticado.administrador()
                        )
                ));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        extrairCookieRefresh(request).ifPresent(refreshTokenService::revogar);

        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, cookieUtil.construirCookieRefreshExpirado().toString())
                .build();
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(@AuthenticationPrincipal AuthenticatedUser usuarioLogado) {
        if (usuarioLogado == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(Map.of(
                "id", usuarioLogado.id(),
                "email", usuarioLogado.email(),
                "tipo", usuarioLogado.tipo(),
                "administrador", usuarioLogado.administrador()
        ));
    }

    private java.util.Optional<String> extrairCookieRefresh(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return java.util.Optional.empty();
        }
        for (Cookie cookie : request.getCookies()) {
            if (CookieUtil.NOME_COOKIE_REFRESH.equals(cookie.getName())) {
                return java.util.Optional.of(cookie.getValue());
            }
        }
        return java.util.Optional.empty();
    }
}
