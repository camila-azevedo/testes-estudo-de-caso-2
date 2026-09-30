package com.regiimento.portal_academico.security;

import com.regiimento.portal_academico.model.Usuario;
import com.regiimento.portal_academico.repository.UsuarioRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final RefreshTokenService refreshTokenService;
    private final CookieUtil cookieUtil;
    private final UsuarioRepository usuarioRepository;

    @Value("${app.frontend.callback-url}")
    private String frontendCallbackUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2UsuarioPrincipal principal = (OAuth2UsuarioPrincipal) authentication.getPrincipal();
        AuthenticatedUser usuarioAutenticado = principal.getAuthenticatedUser();

        Usuario usuario = usuarioRepository.findById(usuarioAutenticado.id())
                .orElseThrow(() -> new IllegalStateException("Usuário desapareceu entre o login e o provisionamento"));

        // Nada de token na URL: só um refresh token opaco, num cookie httpOnly,
        // com escopo restrito a /api/auth. A SPA troca esse cookie por um access
        // token de verdade chamando POST /api/auth/refresh assim que carregar.
        var refresh = refreshTokenService.gerar(usuario);

        var cookie = cookieUtil.construirCookieRefresh(
                refresh.valorCru(),
                Duration.between(LocalDateTime.now(), refresh.expiraEm())
        );
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        getRedirectStrategy().sendRedirect(request, response, frontendCallbackUrl);
    }
}
