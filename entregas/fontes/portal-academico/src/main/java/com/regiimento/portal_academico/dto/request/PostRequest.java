package com.regiimento.portal_academico.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostRequest {

    @NotBlank(message = "conteudoTexto não pode ficar vazio")
    private String conteudoTexto;

    @NotBlank(message = "tipo é obrigatório")
    private String tipo;

    private String imagem;
    // integranteRegimentoId removido: "cadastradoPor" é sempre o usuário autenticado.
}
