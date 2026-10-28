package com.regiimento.portal_academico.security;

import com.regiimento.portal_academico.model.RefreshToken;
import com.regiimento.portal_academico.model.Usuario;
import com.regiimento.portal_academico.repository.RefreshTokenRepository;
import com.regiimento.portal_academico.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

/**
 * O refresh token que o cliente guarda é um valor aleatório opaco — só o SHA-256
 * dele fica no banco. Vazou o banco, não dá pra forjar sessão com isso.
 * Cada uso do refresh token o invalida e emite um novo (rotação): se um token
 * roubado for usado depois do legítimo (ou vice-versa), dá pra detectar reuso.
 */
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UsuarioRepository usuarioRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    // Self-injeção com @Lazy: é assim que se chama "a si mesmo" passando pelo
    // proxy do Spring. Sem isso, @Transactional(REQUIRES_NEW) chamado de dentro
    // da própria classe é ignorado silenciosamente (chamada interna não passa
    // pelo proxy AOP) e a revogação continua dentro da transação que dá rollback.
    @Autowired
    @Lazy
    private RefreshTokenService self;

    @Value("${app.jwt.refresh-expiracao-dias:30}")
    private long expiracaoDias;

    @Value("${app.jwt.refresh-tolerancia-segundos:20}")
    private long toleranciaSegundos;

    public record NovoRefreshToken(String valorCru, LocalDateTime expiraEm) {}

    @Transactional
    public NovoRefreshToken gerar(Usuario usuario) {
        byte[] bytesAleatorios = new byte[32];
        secureRandom.nextBytes(bytesAleatorios);
        String valorCru = Base64.getUrlEncoder().withoutPadding().encodeToString(bytesAleatorios);

        LocalDateTime expiraEm = LocalDateTime.now().plusDays(expiracaoDias);

        RefreshToken entidade = new RefreshToken();
        entidade.setUsuario(usuario);
        entidade.setTokenHash(hash(valorCru));
        entidade.setExpiraEm(expiraEm);
        refreshTokenRepository.save(entidade);

        return new NovoRefreshToken(valorCru, expiraEm);
    }

    /**
     * Valida o refresh token, revoga-o e emite um novo (rotação).
     * Retorna o usuário e o novo token cru para setar no cookie.
     */
    @Transactional
    public NovoRefreshTokenComUsuario validarERotacionar(String valorCru) {
        RefreshToken entidade = refreshTokenRepository.findByTokenHash(hash(valorCru))
                .orElseThrow(() -> new AccessDeniedException("Refresh token inválido"));

        if (Boolean.TRUE.equals(entidade.getRevogado()) && foiRotacionadoHaPoucoTempo(entidade)) {
            // Duas requisições chegaram com o mesmo cookie quase ao mesmo tempo (F5 duplo, duas abas,
            // navegação que cancelou a resposta antes do Set-Cookie chegar). Não é roubo: emite um
            // token novo para esta requisição também, sem revogar as outras sessões.
            Usuario usuario = usuarioRepository.findById(entidade.getUsuario().getId())
                    .orElseThrow(() -> new AccessDeniedException("Usuário não encontrado"));
            return new NovoRefreshTokenComUsuario(usuario, gerar(usuario));
        }

        if (Boolean.TRUE.equals(entidade.getRevogado())) {
            // Reuso de um token já rotacionado (fora da janela de tolerância) ou de um token
            // revogado no logout: sinal forte de token roubado.
            // Chamada via "self" (proxy) + REQUIRES_NEW: isso commita numa
            // transação própria, independente do que acontecer depois aqui.
            // Mesmo quando o AccessDeniedException abaixo desfizer a transação
            // atual, a revogação já está gravada no banco.
            self.revogarTodosDoUsuario(entidade.getUsuario().getId());
            throw new AccessDeniedException("Refresh token já utilizado — sessões revogadas por segurança");
        }

        if (entidade.getExpiraEm().isBefore(LocalDateTime.now())) {
            throw new AccessDeniedException("Refresh token expirado");
        }

        entidade.setRevogado(true);
        entidade.setRotacionadoEm(LocalDateTime.now());
        refreshTokenRepository.save(entidade);

        Usuario usuario = usuarioRepository.findById(entidade.getUsuario().getId())
                .orElseThrow(() -> new AccessDeniedException("Usuário não encontrado"));

        NovoRefreshToken novo = gerar(usuario);
        return new NovoRefreshTokenComUsuario(usuario, novo);
    }

    // Só tokens trocados por rotação entram na tolerância; tokens revogados no logout não têm
    // rotacionadoEm e nunca são aceitos de novo.
    private boolean foiRotacionadoHaPoucoTempo(RefreshToken entidade) {
        return entidade.getRotacionadoEm() != null
                && entidade.getRotacionadoEm().isAfter(LocalDateTime.now().minusSeconds(toleranciaSegundos));
    }

    public record NovoRefreshTokenComUsuario(Usuario usuario, NovoRefreshToken token) {}

    @Transactional
    public void revogar(String valorCru) {
        refreshTokenRepository.findByTokenHash(hash(valorCru))
                .ifPresent(t -> {
                    t.setRevogado(true);
                    refreshTokenRepository.save(t);
                });
    }

    /**
     * REQUIRES_NEW: roda numa transação própria, que commita (ou dá rollback)
     * sozinha, sem depender de como a transação que chamou este método termina.
     * Só funciona porque é chamado via "self" acima — chamar diretamente
     * (this.revogarTodosDoUsuario(...) implícito) faria essa anotação ser
     * ignorada.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void revogarTodosDoUsuario(Long usuarioId) {
        refreshTokenRepository.findByUsuarioIdAndRevogadoFalse(usuarioId)
                .forEach(t -> t.setRevogado(true));
        // dirty checking cuida do UPDATE dentro da transação — sem N saves manuais.
    }

    private String hash(String valor) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(valor.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
