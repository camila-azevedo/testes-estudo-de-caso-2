package com.regiimento.portal_academico.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
public class PublicacaoAcademicaRequest {

    private String titulo;
    private String resumo;
    private LocalDate dataPublicacao;
    private String tipo;
    private Set<Long> autoresIds;
}
