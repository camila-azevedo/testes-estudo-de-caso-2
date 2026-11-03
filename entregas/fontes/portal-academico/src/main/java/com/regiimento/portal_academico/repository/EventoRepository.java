package com.regiimento.portal_academico.repository;

import com.regiimento.portal_academico.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventoRepository extends JpaRepository<Evento, Long> {

    //eventos mais recentes no topo
    List<Evento> findByOrderByDataEventoDesc();

    //eventos em destaque
    List<Evento> findByDestaqueTrueOrderByDataEventoDesc();
}