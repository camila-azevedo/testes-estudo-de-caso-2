package com.regiimento.portal_academico.dto.response;

import com.regiimento.portal_academico.model.Comentario;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ComentarioResponse {

    private final Long id;
    private final LocalDateTime dataHora;
    private final String texto;
    private final Long autorId;
    private final String autorNome;
    private final Long postId;

    public ComentarioResponse(Comentario comentario) {
        this.id = comentario.getId();
        this.dataHora = comentario.getDataHora();
        this.texto = comentario.getTexto();
        this.autorId = comentario.getAutor().getId();
        this.autorNome = comentario.getAutor().getNome();
        this.postId = comentario.getPost().getId();
    }
}
