package com.regiimento.portal_academico.dto.response;

import com.regiimento.portal_academico.model.Post;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class PostResponse {

    private final Long id;
    private final LocalDateTime dataCriacao;
    private final String conteudoTexto;
    private final String tipo;
    private final String imagem;
    private final Long cadastradoPorId;
    private final String cadastradoPorNome;
    private final int totalComentarios;

    public PostResponse(Post post) {
        this.id = post.getId();
        this.dataCriacao = post.getDataCriacao();
        this.conteudoTexto = post.getConteudoTexto();
        this.tipo = post.getTipo();
        this.imagem = post.getImagem();
        this.cadastradoPorId = post.getCadastradoPor().getId();
        this.cadastradoPorNome = post.getCadastradoPor().getNome();
        this.totalComentarios = post.getComentarios().size();
    }
}
