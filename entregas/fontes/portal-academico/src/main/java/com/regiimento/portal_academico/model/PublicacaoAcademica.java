package com.regiimento.portal_academico.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "publicacao_academica")
@Getter
@Setter
@NoArgsConstructor
public class PublicacaoAcademica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_publicacao")
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String resumo;

    @Column(name = "data_publicacao")
    private LocalDate dataPublicacao;

    private String tipo;

    @ManyToMany
    @JoinTable(
            name = "usuario_publicacao",
            joinColumns = @JoinColumn(name = "id_publicacao"),
            inverseJoinColumns = @JoinColumn(name = "id_usuario")
    )
    private Set<Usuario> autores = new HashSet<>();
}