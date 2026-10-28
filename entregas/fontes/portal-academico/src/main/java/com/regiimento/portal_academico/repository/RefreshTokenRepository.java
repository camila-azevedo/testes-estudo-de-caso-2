package com.regiimento.portal_academico.repository;

import com.regiimento.portal_academico.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByTokenHash(String tokenHash);

    List<RefreshToken> findByUsuarioIdAndRevogadoFalse(Long usuarioId);

    @Modifying
    @Query("delete from RefreshToken t where t.expiraEm < :agora")
    int apagarExpirados(@Param("agora") LocalDateTime agora);
}
