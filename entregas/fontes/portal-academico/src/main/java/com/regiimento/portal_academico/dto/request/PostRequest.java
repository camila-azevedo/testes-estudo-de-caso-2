package com.regiimento.portal_academico.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostRequest {

    private String conteudoTexto;
    private String tipo;
    private String imagem;
    // integranteRegimentoId removido: "cadastradoPor" é sempre o usuário autenticado.
}
