package com.regiimento.portal_academico.controller;

import com.regiimento.portal_academico.dto.request.EventoRequest;
import com.regiimento.portal_academico.dto.response.EventoResponse;
import com.regiimento.portal_academico.security.AuthenticatedUser;
import com.regiimento.portal_academico.service.EventoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@RequiredArgsConstructor
public class EventoController {

    private final EventoService eventoService;

    @GetMapping
    public ResponseEntity<List<EventoResponse>> listarTodos() {
        return ResponseEntity.ok(eventoService.listarTodos());
    }

    @GetMapping("/destaques")
    public ResponseEntity<List<EventoResponse>> listarDestaques() {
        return ResponseEntity.ok(eventoService.listarDestaques());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(eventoService.buscarPorId(id));
    }

    @PreAuthorize("hasRole('INTEGRANTE')")
    @PostMapping
    public ResponseEntity<EventoResponse> criar(
            @Valid @RequestBody EventoRequest request,
            @AuthenticationPrincipal AuthenticatedUser usuarioLogado
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventoService.criar(request, usuarioLogado));
    }

    @PreAuthorize("hasRole('INTEGRANTE')")
    @PutMapping("/{id}")
    public ResponseEntity<EventoResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody EventoRequest request,
            @AuthenticationPrincipal AuthenticatedUser usuarioLogado
    ) {
        return ResponseEntity.ok(eventoService.atualizar(id, request, usuarioLogado));
    }

    @PreAuthorize("hasRole('INTEGRANTE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id,
            @AuthenticationPrincipal AuthenticatedUser usuarioLogado
    ) {
        eventoService.deletar(id, usuarioLogado);
        return ResponseEntity.noContent().build();
    }
}
