package com.regiimento.portal_academico.repository;

import com.regiimento.portal_academico.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findAllByOrderByDataCriacaoDesc();

    List<Post> findByTipoOrderByDataCriacaoDesc(String tipo);
}