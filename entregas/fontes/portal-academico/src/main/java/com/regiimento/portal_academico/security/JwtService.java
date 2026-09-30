package com.regiimento.portal_academico.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;

/**
 * Emite e valida o JWT que a API usa como "sessão" depois do login OAuth2.
 * O front-end guarda esse token e manda em todo request:
 *   Authorization: Bearer <token>
 */
@Service
public class JwtService {

    private final SecretKey chave;
    private final long expiracaoMinutos;

    public JwtService(
            @Value("${app.jwt.secret}") String segredoBase64,
            @Value("${app.jwt.expiracao-minutos:120}") long expiracaoMinutos
    ) {
        // A chave PRECISA vir de variável de ambiente em produção (ver application.properties).
        this.chave = Keys.hmacShaKeyFor(java.util.Base64.getDecoder().decode(segredoBase64));
        this.expiracaoMinutos = expiracaoMinutos;
    }

    public String gerarToken(AuthenticatedUser usuario) {
        Instant agora = Instant.now();
        return Jwts.builder()
                .subject(usuario.id().toString())
                .claim("email", usuario.email())
                .claim("tipo", usuario.tipo().name())
                .claim("administrador", usuario.administrador())
                .issuedAt(Date.from(agora))
                .expiration(Date.from(agora.plusSeconds(expiracaoMinutos * 60)))
                .signWith(chave)
                .compact();
    }

    /**
     * Lança JwtException (ExpiredJwtException, SignatureException, etc.) se o token
     * for inválido ou tiver expirado — o filtro decide o que fazer com isso.
     */
    public AuthenticatedUser validarToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(chave)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return new AuthenticatedUser(
                Long.valueOf(claims.getSubject()),
                claims.get("email", String.class),
                AuthenticatedUser.TipoUsuario.valueOf(claims.get("tipo", String.class)),
                Boolean.TRUE.equals(claims.get("administrador", Boolean.class))
        );
    }
}
