package com.regiimento.portal_academico.repository;

import com.regiimento.portal_academico.model.UsuarioInteressado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UsuarioInteressadoRepository extends JpaRepository<UsuarioInteressado, Long> {

    /**
     * Remove SÓ a linha da tabela usuario_interessado, mantendo a linha em usuario.
     * Não dá para usar deleteById aqui: com herança JOINED, apagar a entidade pelo JPA apaga a
     * linha da subclasse E a da tabela usuario (e, junto, os refresh tokens por ON DELETE CASCADE),
     * e o INSERT seguinte em integrante_regimento falharia na FK.
     */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query(value = "DELETE FROM usuario_interessado WHERE id_usuario = :id", nativeQuery = true)
    void removerLinhaInteressado(@Param("id") Long id);
}
