package com.regiimento.portal_academico.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "integrante_regimento")
@PrimaryKeyJoinColumn(name = "id_usuario")
@Getter
@Setter
@NoArgsConstructor
public class IntegranteRegimento extends Usuario {

    @Column(name = "vinculo_institucional", nullable = false)
    private String vinculoInstitucional;

    @Column(name = "linha_pesquisa")
    private String linhaPesquisa;

    private String lattes;

    private String titulacao;

    @Column(name = "status_ativo", nullable = false)
    private Boolean statusAtivo = true;

    @Column(nullable = false)
    private Boolean administrador = false;

    @OneToMany(mappedBy = "cadastradoPor")
    private List<UsuarioInteressado> usuariosCadastrados = new ArrayList<>();

    @OneToMany(mappedBy = "cadastradoPor")
    private List<Post> posts = new ArrayList<>();

    @OneToMany(mappedBy = "cadastradoPor")
    private List<Evento> eventos = new ArrayList<>();
}