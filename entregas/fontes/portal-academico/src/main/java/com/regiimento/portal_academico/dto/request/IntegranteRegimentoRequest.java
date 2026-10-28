package com.regiimento.portal_academico.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

/** Criação "do zero" de um integrante (POST /api/integrantes, só admin). */
@Getter
@Setter
public class IntegranteRegimentoRequest {

    @NotBlank(message = "email é obrigatório")
    @Email(message = "email precisa ser um e-mail válido")
    @Size(max = 255, message = "email pode ter no máximo 255 caracteres")
    private String email;

    @NotBlank(message = "nome é obrigatório")
    @Size(max = 255, message = "nome pode ter no máximo 255 caracteres")
    private String nome;

    @Size(max = 500, message = "imagem pode ter no máximo 500 caracteres")
    @URL(message = "imagem precisa ser uma URL válida")
    private String imagem;

    @NotBlank(message = "idProvedorExterno é obrigatório")
    @Size(max = 255, message = "idProvedorExterno pode ter no máximo 255 caracteres")
    private String idProvedorExterno;

    @NotBlank(message = "autenticacaoProvedor é obrigatório")
    @Size(max = 100, message = "autenticacaoProvedor pode ter no máximo 100 caracteres")
    private String autenticacaoProvedor;

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
