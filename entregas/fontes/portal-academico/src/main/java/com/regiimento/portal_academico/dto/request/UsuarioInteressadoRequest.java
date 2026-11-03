package com.regiimento.portal_academico.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioInteressadoRequest {

    @NotBlank(message = "email é obrigatório")
    @Email(message = "email precisa ser um e-mail válido")
    @Size(max = 255, message = "email pode ter no máximo 255 caracteres")
    private String email;

    @NotBlank(message = "nome é obrigatório")
    @Size(max = 255, message = "nome pode ter no máximo 255 caracteres")
    private String nome;

    @Size(max = 500, message = "imagem pode ter no máximo 500 caracteres")
    private String imagem;

    @NotBlank(message = "idProvedorExterno é obrigatório")
    @Size(max = 255, message = "idProvedorExterno pode ter no máximo 255 caracteres")
    private String idProvedorExterno;

    @NotBlank(message = "autenticacaoProvedor é obrigatório")
    @Size(max = 100, message = "autenticacaoProvedor pode ter no máximo 100 caracteres")
    private String autenticacaoProvedor;

    private Long integranteCadastranteId;
}
