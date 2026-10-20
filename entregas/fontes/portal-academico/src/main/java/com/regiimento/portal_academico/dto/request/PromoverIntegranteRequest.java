package com.regiimento.portal_academico.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PromoverIntegranteRequest {

    @NotBlank(message = "vinculoInstitucional é obrigatório")
    private String vinculoInstitucional;

    private String linhaPesquisa;
    private String lattes;
    private String titulacao;
    // Sem email/idProvedorExterno de propósito: quem a pessoa é já foi provado
    // pelo login com o Google. Aqui só se decide o papel dela no sistema.
    private Boolean administrador;
}
