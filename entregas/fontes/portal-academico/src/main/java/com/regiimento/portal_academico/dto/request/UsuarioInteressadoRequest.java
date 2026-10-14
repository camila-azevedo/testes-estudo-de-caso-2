package com.regiimento.portal_academico.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioInteressadoRequest {

    private String email;
    private String nome;
    private String imagem;
    private String idProvedorExterno;
    private String autenticacaoProvedor;
    private Long integranteCadastranteId;
}
