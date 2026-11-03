package com.regiimento.portal_academico.security;

import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class JwtServiceTest {

    // 32 bytes em Base64, o mínimo para HS256. Só para teste, nunca use esse valor de verdade.
    private static final String SEGREDO = Base64.getEncoder()
            .encodeToString("0123456789abcdef0123456789abcdef".getBytes(StandardCharsets.UTF_8));

    private final AuthenticatedUser admin = new AuthenticatedUser(
            7L, "admin@exemplo.com", AuthenticatedUser.TipoUsuario.INTEGRANTE, true);

    @Test
    void tokenGeradoPodeSerLidoDeVolta() {
        JwtService jwtService = new JwtService(SEGREDO, 15);

        AuthenticatedUser lido = jwtService.validarToken(jwtService.gerarToken(admin));

        assertEquals(admin, lido);
    }

    @Test
    void tokenExpiradoELancaExcecao() {
        JwtService jwtService = new JwtService(SEGREDO, -1);

        String token = jwtService.gerarToken(admin);

        assertThrows(JwtException.class, () -> jwtService.validarToken(token));
    }

    @Test
    void tokenAdulteradoELancaExcecao() {
        JwtService jwtService = new JwtService(SEGREDO, 15);

        String token = jwtService.gerarToken(admin);
        String adulterado = token.substring(0, token.length() - 2) + "xx";

        assertThrows(JwtException.class, () -> jwtService.validarToken(adulterado));
    }
}
