package com.regiimento.portal_academico.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

/**
 * Dados editáveis de um integrante (PUT /api/integrantes/{id}). Não tem e-mail nem dados do
 * provedor de login: quem a pessoa é foi provado pelo Google e não se edita aqui. Para ativar,
 * desativar ou mudar o papel de admin existe o PATCH /api/integrantes/{id}/status.
 */
@Getter
@Setter
public class AtualizarIntegranteRequest {

    @NotBlank(message = "nome é obrigatório")
    @Size(max = 255, message = "nome pode ter no máximo 255 caracteres")
    private String nome;

    @Size(max = 500, message = "imagem pode ter no máximo 500 caracteres")
    @URL(message = "imagem precisa ser uma URL válida")
    private String imagem;

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
}
