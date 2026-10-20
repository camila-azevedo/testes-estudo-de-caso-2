package com.regiimento.portal_academico.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
public class PublicacaoAcademicaRequest {

    @NotBlank(message = "titulo não pode ficar vazio")
    private String titulo;

    private String resumo;

    @NotNull(message = "dataPublicacao é obrigatório")
    private LocalDate dataPublicacao;

    @NotBlank(message = "tipo é obrigatório")
    private String tipo;

    @NotEmpty(message = "a publicação precisa de pelo menos um autor")
    private Set<Long> autoresIds;
}
