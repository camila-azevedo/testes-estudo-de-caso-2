package com.regiimento.portal_academico.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class EventoRequest {

    private String nomeEvento;
    private String descricao;
    private String linkAcesso;
    private Boolean destaque;
    private String imagem;
    private LocalDateTime dataEvento;
    // integranteRegimentoId removido: "cadastradoPor" é sempre o usuário autenticado.
}
