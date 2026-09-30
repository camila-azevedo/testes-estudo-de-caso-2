package com.regiimento.portal_academico.service;

import com.regiimento.portal_academico.dto.request.EventoRequest;
import com.regiimento.portal_academico.dto.response.EventoResponse;
import com.regiimento.portal_academico.exception.ResourceNotFoundException;
import com.regiimento.portal_academico.model.Evento;
import com.regiimento.portal_academico.model.IntegranteRegimento;
import com.regiimento.portal_academico.repository.EventoRepository;
import com.regiimento.portal_academico.repository.IntegranteRegimentoRepository;
import com.regiimento.portal_academico.security.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventoService {

    private final EventoRepository eventoRepository;
    private final IntegranteRegimentoRepository integranteRepository;

    @Transactional(readOnly = true)
    public List<EventoResponse> listarTodos() {
        return eventoRepository.findByOrderByDataEventoDesc().stream()
                .map(EventoResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EventoResponse> listarDestaques() {
        return eventoRepository.findByDestaqueTrue().stream()
                .map(EventoResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public EventoResponse buscarPorId(Long id) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado com id: " + id));
        return new EventoResponse(evento);
    }

    @Transactional
    public EventoResponse criar(EventoRequest request, AuthenticatedUser usuarioLogado) {
        IntegranteRegimento integrante = integranteRepository.findById(usuarioLogado.id())
                .orElseThrow(() -> new ResourceNotFoundException("Integrante não encontrado com id: " + usuarioLogado.id()));

        Evento evento = new Evento();
        evento.setNomeEvento(request.getNomeEvento());
        evento.setDescricao(request.getDescricao());
        evento.setLinkAcesso(request.getLinkAcesso());
        evento.setDestaque(request.getDestaque() != null ? request.getDestaque() : false);
        evento.setImagem(request.getImagem());
        evento.setDataEvento(request.getDataEvento());
        evento.setCadastradoPor(integrante);

        return new EventoResponse(eventoRepository.save(evento));
    }

    @Transactional
    public EventoResponse atualizar(Long id, EventoRequest request, AuthenticatedUser usuarioLogado) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado com id: " + id));

        boolean ehAutor = evento.getCadastradoPor().getId().equals(usuarioLogado.id());
        if (!ehAutor && !usuarioLogado.administrador()) {
            throw new AccessDeniedException("Você só pode editar seus próprios eventos");
        }

        evento.setNomeEvento(request.getNomeEvento());
        evento.setDescricao(request.getDescricao());
        evento.setLinkAcesso(request.getLinkAcesso());
        evento.setDestaque(request.getDestaque() != null ? request.getDestaque() : evento.getDestaque());
        evento.setImagem(request.getImagem());
        evento.setDataEvento(request.getDataEvento());

        return new EventoResponse(eventoRepository.save(evento));
    }

    @Transactional
    public void deletar(Long id, AuthenticatedUser usuarioLogado) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado com id: " + id));

        boolean ehAutor = evento.getCadastradoPor().getId().equals(usuarioLogado.id());
        if (!ehAutor && !usuarioLogado.administrador()) {
            throw new AccessDeniedException("Você só pode apagar seus próprios eventos");
        }

        eventoRepository.deleteById(id);
    }
}
