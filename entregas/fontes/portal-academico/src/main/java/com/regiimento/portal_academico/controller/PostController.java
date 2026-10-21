package com.regiimento.portal_academico.controller;

import com.regiimento.portal_academico.dto.request.PostRequest;
import com.regiimento.portal_academico.dto.response.PostResponse;
import com.regiimento.portal_academico.security.AuthenticatedUser;
import com.regiimento.portal_academico.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<List<PostResponse>> listarTodos() {
        return ResponseEntity.ok(postService.listarTodos());
    }

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<PostResponse>> listarPorTipo(@PathVariable String tipo) {
        return ResponseEntity.ok(postService.listarPorTipo(tipo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(postService.buscarPorId(id));
    }

    // só IntegranteRegimento pode publicar — UsuarioInteressado não tem essa role
    @PreAuthorize("hasRole('INTEGRANTE')")
    @PostMapping
    public ResponseEntity<PostResponse> criar(
            @Valid @RequestBody PostRequest request,
            @AuthenticationPrincipal AuthenticatedUser usuarioLogado
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.criar(request, usuarioLogado));
    }

    @PreAuthorize("hasRole('INTEGRANTE')")
    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody PostRequest request,
            @AuthenticationPrincipal AuthenticatedUser usuarioLogado
    ) {
        return ResponseEntity.ok(postService.atualizar(id, request, usuarioLogado));
    }

    @PreAuthorize("hasRole('INTEGRANTE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id,
            @AuthenticationPrincipal AuthenticatedUser usuarioLogado
    ) {
        postService.deletar(id, usuarioLogado);
        return ResponseEntity.noContent().build();
    }
}
