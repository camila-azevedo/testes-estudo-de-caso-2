package com.regiimento.portal_academico.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "post")
@Getter
@Setter
@NoArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_post")
    private Long id;

    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @Column(name = "conteudo_texto", columnDefinition = "TEXT")
    private String conteudoTexto;

    private String tipo;

    private String imagem;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_integrante_regimento", nullable = false)
    private IntegranteRegimento cadastradoPor;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comentario> comentarios = new ArrayList<>();

    @PrePersist
    protected void aoPersistir() {
        if (dataCriacao == null) {
            dataCriacao = LocalDateTime.now();
        }
    }
}