package com.regiimento.portal_academico.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuario")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@NoArgsConstructor
public abstract class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String nome;

    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    private String imagem;

    @Column(name = "id_provedor_externo", nullable = false)
    private String idProvedorExterno;

    @Column(name = "autenticacao_provedor", nullable = false)
    private String autenticacaoProvedor;

    @Column(name = "refresh_token_criptografado")
    private String refreshTokenCriptografado;

    @PrePersist
    protected void aoPersistir() {
        if (dataCriacao == null) {
            dataCriacao = LocalDateTime.now();
        }
    }
}