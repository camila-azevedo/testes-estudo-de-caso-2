package com.regiimento.portal_academico.controller;

import com.regiimento.portal_academico.dto.request.IntegranteRegimentoRequest;
import com.regiimento.portal_academico.dto.request.PromoverIntegranteRequest;
import com.regiimento.portal_academico.dto.response.IntegranteRegimentoResponse;
import com.regiimento.portal_academico.service.IntegranteRegimentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/integrantes")
@RequiredArgsConstructor
public class IntegranteRegimentoController {

    private final IntegranteRegimentoService integranteService;

    @GetMapping
    public ResponseEntity<List<IntegranteRegimentoResponse>> listarAtivos() {
        return ResponseEntity.ok(integranteService.listarAtivos());
    }

    @GetMapping("/todos")
    public ResponseEntity<List<IntegranteRegimentoResponse>> listarTodos() {
        return ResponseEntity.ok(integranteService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IntegranteRegimentoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(integranteService.buscarPorId(id));
    }

    // Cria um integrante "do zero" (com email/idProvedorExterno próprios) — só faz
    // sentido em casos excepcionais (ex.: importação manual). Restrito a admin.
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<IntegranteRegimentoResponse> criar(@RequestBody IntegranteRegimentoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(integranteService.criar(request));
    }

    // Caminho normal: promove alguém que já logou com o Google (UsuarioInteressado)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/promover")
    public ResponseEntity<IntegranteRegimentoResponse> promover(
            @PathVariable Long id,
            @RequestBody PromoverIntegranteRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(integranteService.promover(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<IntegranteRegimentoResponse> atualizar(@PathVariable Long id, @RequestBody IntegranteRegimentoRequest request) {
        return ResponseEntity.ok(integranteService.atualizar(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        integranteService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
