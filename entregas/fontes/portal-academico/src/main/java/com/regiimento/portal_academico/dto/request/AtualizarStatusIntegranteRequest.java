package com.regiimento.portal_academico.dto.request;

import lombok.Getter;
import lombok.Setter;

/** Campo nulo = não alterar aquele atributo. Pelo menos um dos dois precisa vir preenchido. */
@Getter
@Setter
public class AtualizarStatusIntegranteRequest {

    private Boolean statusAtivo;

    private Boolean administrador;
}
