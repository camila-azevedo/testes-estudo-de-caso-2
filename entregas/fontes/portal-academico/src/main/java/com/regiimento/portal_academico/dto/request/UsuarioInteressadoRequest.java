package com.regiimento.portal_academico.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioInteressadoRequest {

    @NotBlank(message = "email é obrigatório")
    @Email(message = "email precisa ser um e-mail válido")
    private String email;

    @NotBlank(message = "nome é obrigatório")
    private String nome;

    private String imagem;

    @NotBlank(message = "idProvedorExterno é obrigatório")
    private String idProvedorExterno;

    @NotBlank(message = "autenticacaoProvedor é obrigatório")
    private String autenticacaoProvedor;

    private Long integranteCadastranteId;
}
