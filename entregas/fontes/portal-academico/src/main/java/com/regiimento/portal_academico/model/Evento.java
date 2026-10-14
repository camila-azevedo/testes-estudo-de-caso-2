package com.regiimento.portal_academico.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "evento")
@Getter
@Setter
@NoArgsConstructor
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evento")
    private Long id;

    @Column(name = "nome_evento", nullable = false)
    private String nomeEvento;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "link_acesso")
    private String linkAcesso;

    @Column(nullable = false)
    private Boolean destaque = false;

    private String imagem;

    @Column(name = "data_evento")
    private LocalDateTime dataEvento;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_integrante_regimento", nullable = false)
    private IntegranteRegimento cadastradoPor;
}