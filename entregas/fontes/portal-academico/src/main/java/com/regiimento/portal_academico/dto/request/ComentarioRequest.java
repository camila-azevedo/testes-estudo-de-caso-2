package com.regiimento.portal_academico.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComentarioRequest {

    private String texto;
    private Long postId;
    // usuarioId removido: o autor é sempre o usuário autenticado (ver JWT), nunca um valor do corpo.
}
