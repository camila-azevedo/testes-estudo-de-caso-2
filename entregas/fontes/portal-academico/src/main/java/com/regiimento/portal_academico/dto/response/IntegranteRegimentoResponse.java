package com.regiimento.portal_academico.dto.response;

import com.regiimento.portal_academico.model.IntegranteRegimento;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class IntegranteRegimentoResponse {

    private final Long id;
    private final String email;
    private final String nome;
    private final LocalDateTime dataCriacao;
    private final String imagem;
    private final String vinculoInstitucional;
    private final String linhaPesquisa;
    private final String lattes;
    private final String titulacao;
    private final Boolean statusAtivo;
    private final Boolean administrador;

    public IntegranteRegimentoResponse(IntegranteRegimento integrante) {
        this.id = integrante.getId();
        this.email = integrante.getEmail();
        this.nome = integrante.getNome();
        this.dataCriacao = integrante.getDataCriacao();
        this.imagem = integrante.getImagem();
        this.vinculoInstitucional = integrante.getVinculoInstitucional();
        this.linhaPesquisa = integrante.getLinhaPesquisa();
        this.lattes = integrante.getLattes();
        this.titulacao = integrante.getTitulacao();
        this.statusAtivo = integrante.getStatusAtivo();
        this.administrador = integrante.getAdministrador();
    }
}
