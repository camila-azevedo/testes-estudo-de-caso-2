package com.regiimento.portal_academico.dto.response;

import com.regiimento.portal_academico.model.PublicacaoAcademica;
import com.regiimento.portal_academico.model.Usuario;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
public class PublicacaoAcademicaResponse {

    private final Long id;
    private final String titulo;
    private final String resumo;
    private final LocalDate dataPublicacao;
    private final String tipo;
    private final List<AutorResumo> autores;

    public PublicacaoAcademicaResponse(PublicacaoAcademica pub) {
        this.id = pub.getId();
        this.titulo = pub.getTitulo();
        this.resumo = pub.getResumo();
        this.dataPublicacao = pub.getDataPublicacao();
        this.tipo = pub.getTipo();
        this.autores = pub.getAutores().stream()
                .map(AutorResumo::new)
                .toList();
    }

    @Getter
    public static class AutorResumo {
        private final Long id;
        private final String nome;

        public AutorResumo(Usuario usuario) {
            this.id = usuario.getId();
            this.nome = usuario.getNome();
        }
    }
}
