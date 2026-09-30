package com.regiimento.portal_academico.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "usuario_interessado")
@PrimaryKeyJoinColumn(name = "id_usuario")
@Getter
@Setter
@NoArgsConstructor
public class UsuarioInteressado extends Usuario {

    @ManyToOne
    @JoinColumn(name = "id_integrante_cadastrante")
    private IntegranteRegimento cadastradoPor;
}