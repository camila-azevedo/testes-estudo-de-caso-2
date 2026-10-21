package com.regiimento.portal_academico.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDateTime;

@Getter
@Setter
public class EventoRequest {

    @NotBlank(message = "nomeEvento não pode ficar vazio")
    private String nomeEvento;

    private String descricao;

    @URL(message = "linkAcesso precisa ser uma URL válida")
    private String linkAcesso;

    private Boolean destaque;
    private String imagem;

    @NotNull(message = "dataEvento é obrigatório")
    private LocalDateTime dataEvento;
    // integranteRegimentoId removido: "cadastradoPor" é sempre o usuário autenticado.
}
