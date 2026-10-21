package com.regiimento.portal_academico.controller;

import com.regiimento.portal_academico.dto.request.PublicacaoAcademicaRequest;
import com.regiimento.portal_academico.dto.response.PublicacaoAcademicaResponse;
import com.regiimento.portal_academico.service.PublicacaoAcademicaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/publicacoes")
@RequiredArgsConstructor
public class PublicacaoAcademicaController {

    private final PublicacaoAcademicaService publicacaoService;

    @GetMapping
    public ResponseEntity<List<PublicacaoAcademicaResponse>> listarTodas() {
        return ResponseEntity.ok(publicacaoService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PublicacaoAcademicaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(publicacaoService.buscarPorId(id));
    }

    // Só integrante (corpo docente/pesquisa) cadastra publicação acadêmica —
    // mesma regra já usada em PostController/EventoController.
    @PreAuthorize("hasRole('INTEGRANTE')")
    @PostMapping
    public ResponseEntity<PublicacaoAcademicaResponse> criar(@Valid @RequestBody PublicacaoAcademicaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(publicacaoService.criar(request));
    }

    @PreAuthorize("hasRole('INTEGRANTE')")
    @PutMapping("/{id}")
    public ResponseEntity<PublicacaoAcademicaResponse> atualizar(@PathVariable Long id, @Valid @RequestBody PublicacaoAcademicaRequest request) {
        return ResponseEntity.ok(publicacaoService.atualizar(id, request));
    }

    @PreAuthorize("hasRole('INTEGRANTE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        publicacaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
