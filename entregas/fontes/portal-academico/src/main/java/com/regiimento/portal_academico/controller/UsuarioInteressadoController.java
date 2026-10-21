package com.regiimento.portal_academico.controller;

import com.regiimento.portal_academico.dto.request.UsuarioInteressadoRequest;
import com.regiimento.portal_academico.dto.response.UsuarioInteressadoResponse;
import com.regiimento.portal_academico.service.UsuarioInteressadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios-interessados")
@RequiredArgsConstructor
public class UsuarioInteressadoController {

    private final UsuarioInteressadoService usuarioInteressadoService;

    // Lista e-mail/nome de todo mundo que já logou — não pode ser público.
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<UsuarioInteressadoResponse>> listarTodos() {
        return ResponseEntity.ok(usuarioInteressadoService.listarTodos());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioInteressadoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioInteressadoService.buscarPorId(id));
    }

    // Em uso normal, UsuarioInteressado só é criado pelo login com o Google
    // (CustomOAuth2UserService). Isso aqui fica só para admin, mesmo caso do
    // IntegranteRegimentoController.criar().
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<UsuarioInteressadoResponse> criar(@Valid @RequestBody UsuarioInteressadoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioInteressadoService.criar(request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        usuarioInteressadoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
