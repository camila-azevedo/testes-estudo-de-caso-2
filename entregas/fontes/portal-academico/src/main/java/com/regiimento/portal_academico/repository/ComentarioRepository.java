package com.regiimento.portal_academico.repository;

import com.regiimento.portal_academico.model.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComentarioRepository extends JpaRepository<Comentario, Long> {

    List<Comentario> findByPostIdOrderByDataHora(Long postId);
}