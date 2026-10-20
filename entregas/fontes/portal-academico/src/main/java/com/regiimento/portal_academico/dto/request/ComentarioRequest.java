package com.regiimento.portal_academico.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComentarioRequest {

    @NotBlank(message = "O texto do comentário não pode ficar vazio")
    @Size(max = 2000, message = "O comentário pode ter no máximo 2000 caracteres")
    private String texto;

    @NotNull(message = "postId é obrigatório")
    private Long postId;
    // usuarioId removido: o autor é sempre o usuário autenticado (ver JWT), nunca um valor do corpo.
}
