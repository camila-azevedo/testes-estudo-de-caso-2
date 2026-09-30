package com.regiimento.portal_academico.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IntegranteRegimentoRequest {

    private String email;
    private String nome;
    private String imagem;
    private String idProvedorExterno;
    private String autenticacaoProvedor;
    private String vinculoInstitucional;
    private String linhaPesquisa;
    private String lattes;
    private String titulacao;
}
