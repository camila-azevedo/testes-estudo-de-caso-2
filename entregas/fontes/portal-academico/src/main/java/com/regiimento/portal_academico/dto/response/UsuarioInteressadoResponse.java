package com.regiimento.portal_academico.dto.response;

import com.regiimento.portal_academico.model.UsuarioInteressado;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class UsuarioInteressadoResponse {

    private final Long id;
    private final String email;
    private final String nome;
    private final LocalDateTime dataCriacao;
    private final String imagem;
    private final Long cadastradoPorId;
    private final String cadastradoPorNome;

    public UsuarioInteressadoResponse(UsuarioInteressado usuario) {
        this.id = usuario.getId();
        this.email = usuario.getEmail();
        this.nome = usuario.getNome();
        this.dataCriacao = usuario.getDataCriacao();
        this.imagem = usuario.getImagem();
        this.cadastradoPorId = usuario.getCadastradoPor() != null ? usuario.getCadastradoPor().getId() : null;
        this.cadastradoPorNome = usuario.getCadastradoPor() != null ? usuario.getCadastradoPor().getNome() : null;
    }
}
