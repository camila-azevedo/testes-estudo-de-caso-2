package com.regiimento.portal_academico.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

@Getter
@Setter
public class PromoverIntegranteRequest {

    @NotBlank(message = "vinculoInstitucional é obrigatório")
    @Size(max = 100, message = "vinculoInstitucional pode ter no máximo 100 caracteres")
    private String vinculoInstitucional;

    @Size(max = 255, message = "linhaPesquisa pode ter no máximo 255 caracteres")
    private String linhaPesquisa;

    @Size(max = 255, message = "lattes pode ter no máximo 255 caracteres")
    @URL(message = "lattes precisa ser uma URL válida")
    private String lattes;

    @Size(max = 100, message = "titulacao pode ter no máximo 100 caracteres")
    private String titulacao;

    // Sem email/idProvedorExterno de propósito: quem a pessoa é já foi provado
    // pelo login com o Google. Aqui só se decide o papel dela no sistema.
    private Boolean administrador;
}
