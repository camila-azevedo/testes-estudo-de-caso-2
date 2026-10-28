package com.regiimento.portal_academico.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostRequest {

    @NotBlank(message = "conteudoTexto não pode ficar vazio")
    private String conteudoTexto;

    @NotBlank(message = "tipo é obrigatório")
    @Size(max = 100, message = "tipo pode ter no máximo 100 caracteres")
    private String tipo;

    @Size(max = 500, message = "imagem pode ter no máximo 500 caracteres")
    private String imagem;

    // integranteRegimentoId removido: "cadastradoPor" é sempre o usuário autenticado.
}
