package com.regiimento.portal_academico.dto.response;

import com.regiimento.portal_academico.model.Evento;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class EventoResponse {

    private final Long id;
    private final String nomeEvento;
    private final String descricao;
    private final String linkAcesso;
    private final Boolean destaque;
    private final String imagem;
    private final LocalDateTime dataEvento;
    private final Long cadastradoPorId;
    private final String cadastradoPorNome;

    public EventoResponse(Evento evento) {
        this.id = evento.getId();
        this.nomeEvento = evento.getNomeEvento();
        this.descricao = evento.getDescricao();
        this.linkAcesso = evento.getLinkAcesso();
        this.destaque = evento.getDestaque();
        this.imagem = evento.getImagem();
        this.dataEvento = evento.getDataEvento();
        this.cadastradoPorId = evento.getCadastradoPor().getId();
        this.cadastradoPorNome = evento.getCadastradoPor().getNome();
    }
}
