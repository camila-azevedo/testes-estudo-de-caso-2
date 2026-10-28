package com.regiimento.portal_academico.dto.response;

import com.regiimento.portal_academico.model.IntegranteRegimento;
import lombok.Getter;

/**
 * Versão pública de um integrante (GET /api/integrantes e /api/integrantes/{id}). Diferente de
 * IntegranteRegimentoResponse (usada nas rotas de admin), não expõe a flag "administrador"
 * nem a data de cadastro.
 */
@Getter
public class IntegranteRegimentoPublicoResponse {

    private final Long id;
    private final String email;
    private final String nome;
    private final String imagem;
    private final String vinculoInstitucional;
    private final String linhaPesquisa;
    private final String lattes;
    private final String titulacao;
    private final Boolean statusAtivo;

    public IntegranteRegimentoPublicoResponse(IntegranteRegimento integrante) {
        this.id = integrante.getId();
        this.email = integrante.getEmail();
        this.nome = integrante.getNome();
        this.imagem = integrante.getImagem();
        this.vinculoInstitucional = integrante.getVinculoInstitucional();
        this.linhaPesquisa = integrante.getLinhaPesquisa();
        this.lattes = integrante.getLattes();
        this.titulacao = integrante.getTitulacao();
        this.statusAtivo = integrante.getStatusAtivo();
    }
}
