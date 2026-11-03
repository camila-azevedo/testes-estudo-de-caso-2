package com.regiimento.portal_academico.repository;

import com.regiimento.portal_academico.model.IntegranteRegimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IntegranteRegimentoRepository extends JpaRepository<IntegranteRegimento, Long> {

    List<IntegranteRegimento> findByStatusAtivoTrue();

    /**
     * Insere só a linha de extensão (integrante_regimento) para um id_usuario que
     * já existe na tabela usuario. Feito em SQL nativo de propósito: com herança
     * JOINED e PK gerado por IDENTITY, o JPA não tem uma forma direta de "converter"
     * uma UsuarioInteressado já persistida em IntegranteRegimento reaproveitando o
     * mesmo id — ele tentaria inserir uma linha nova em usuario.
     */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query(value = """
            INSERT INTO integrante_regimento
                (id_usuario, vinculo_institucional, linha_pesquisa, lattes, titulacao, status_ativo, administrador)
            VALUES
                (:idUsuario, :vinculoInstitucional, :linhaPesquisa, :lattes, :titulacao, true, :administrador)
            """, nativeQuery = true)
    void inserirComoIntegrante(
            @Param("idUsuario") Long idUsuario,
            @Param("vinculoInstitucional") String vinculoInstitucional,
            @Param("linhaPesquisa") String linhaPesquisa,
            @Param("lattes") String lattes,
            @Param("titulacao") String titulacao,
            @Param("administrador") boolean administrador
    );
}
