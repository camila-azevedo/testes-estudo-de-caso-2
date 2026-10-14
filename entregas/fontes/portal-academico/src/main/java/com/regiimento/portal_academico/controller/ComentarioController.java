package com.regiimento.portal_academico.controller;

import com.regiimento.portal_academico.dto.request.ComentarioRequest;
import com.regiimento.portal_academico.dto.response.ComentarioResponse;
import com.regiimento.portal_academico.security.AuthenticatedUser;
import com.regiimento.portal_academico.service.ComentarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comentarios")
@RequiredArgsConstructor
public class ComentarioController {

    private final ComentarioService comentarioService;

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<ComentarioResponse>> listarPorPost(@PathVariable Long postId) {
        return ResponseEntity.ok(comentarioService.listarPorPost(postId));
    }

    @PostMapping
    public ResponseEntity<ComentarioResponse> criar(
            @RequestBody ComentarioRequest request,
            @AuthenticationPrincipal AuthenticatedUser usuarioLogado
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(comentarioService.criar(request, usuarioLogado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id,
            @AuthenticationPrincipal AuthenticatedUser usuarioLogado
    ) {
        comentarioService.deletar(id, usuarioLogado);
        return ResponseEntity.noContent().build();
    }
}
