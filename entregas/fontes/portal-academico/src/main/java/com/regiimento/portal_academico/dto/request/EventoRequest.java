package com.regiimento.portal_academico.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDateTime;

@Getter
@Setter
public class EventoRequest {

    @NotBlank(message = "nomeEvento não pode ficar vazio")
    @Size(max = 255, message = "nomeEvento pode ter no máximo 255 caracteres")
    private String nomeEvento;

    private String descricao;

    @Size(max = 500, message = "linkAcesso pode ter no máximo 500 caracteres")
    @URL(message = "linkAcesso precisa ser uma URL válida")
    private String linkAcesso;

    private Boolean destaque;

    @Size(max = 500, message = "imagem pode ter no máximo 500 caracteres")
    private String imagem;

    @NotNull(message = "dataEvento é obrigatório")
    private LocalDateTime dataEvento;

    // integranteRegimentoId removido: "cadastradoPor" é sempre o usuário autenticado.
}
