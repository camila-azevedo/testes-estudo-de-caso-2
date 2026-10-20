package com.regiimento.portal_academico.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        return corpo(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // Campo nulo/vazio/inválido no corpo da requisição (@Valid nos DTOs) — 400,
    // com a lista de qual campo falhou e por quê, em vez do 500 genérico de antes.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidacao(MethodArgumentNotValidException ex) {
        Map<String, String> erros = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(erro ->
                erros.put(erro.getField(), erro.getDefaultMessage())
        );

        Map<String, Object> corpo = new LinkedHashMap<>();
        corpo.put("timestamp", LocalDateTime.now().toString());
        corpo.put("status", 400);
        corpo.put("erro", "Dados inválidos");
        corpo.put("campos", erros);
        return ResponseEntity.badRequest().body(corpo);
    }

    // Ex.: tentar deletar um IntegranteRegimento que ainda tem Post vinculado —
    // o banco recusa por causa da FK, e isso virava um 500 cru antes disso existir.
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleIntegridade(DataIntegrityViolationException ex) {
        return corpo(HttpStatus.CONFLICT, "Operação viola uma restrição de integridade do banco " +
                "(ex.: registro ainda referenciado por outro, ou valor duplicado)");
    }

    // Cobre o ResponseStatusException(CONFLICT, ...) usado em
    // IntegranteRegimentoService.promover() quando alguém já é integrante,
    // e qualquer outro uso futuro desse tipo — mantém o mesmo formato de resposta.
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleResponseStatus(ResponseStatusException ex) {
        HttpStatusCode status = ex.getStatusCode();
        return corpo(HttpStatus.valueOf(status.value()), ex.getReason() != null ? ex.getReason() : ex.getMessage());
    }

    // AccessDeniedException (dono-ou-admin nos services, @PreAuthorize nos
    // controllers) já era traduzida para 403 pelo Spring Security mesmo sem
    // handler — isso aqui só garante o mesmo formato de corpo que os outros erros.
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAcessoNegado(AccessDeniedException ex) {
        return corpo(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    // Qualquer coisa não prevista: nunca vaza stacktrace/mensagem interna —
    // server.error.include-stacktrace já cobre o endpoint de erro padrão do
    // Spring, isso aqui cobre as respostas que passam por este handler.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenerico(Exception ex) {
        return corpo(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno. Tente novamente mais tarde.");
    }

    private ResponseEntity<Map<String, Object>> corpo(HttpStatus status, String mensagem) {
        Map<String, Object> corpo = new LinkedHashMap<>();
        corpo.put("timestamp", LocalDateTime.now().toString());
        corpo.put("status", status.value());
        corpo.put("erro", mensagem);
        return ResponseEntity.status(status).body(corpo);
    }
}
