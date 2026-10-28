package com.regiimento.portal_academico.security;

import com.regiimento.portal_academico.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Apaga, uma vez por dia, os refresh tokens que já expiraram. Sem isso a tabela
 * refresh_token só cresce (cada carregamento de página com login gera uma linha).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RefreshTokenLimpeza {

    private final RefreshTokenRepository refreshTokenRepository;

    @Scheduled(cron = "0 30 3 * * *")
    @Transactional
    public void limparExpirados() {
        int apagados = refreshTokenRepository.apagarExpirados(LocalDateTime.now());
        log.info("Limpeza de refresh tokens: {} expirado(s) removido(s)", apagados);
    }
}
