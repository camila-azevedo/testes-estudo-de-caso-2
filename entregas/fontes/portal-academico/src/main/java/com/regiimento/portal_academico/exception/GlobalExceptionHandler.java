package com.regiimento.portal_academico.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        return corpo(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // Campo nulo/vazio/inválido no corpo da requisição (@Valid nos DTOs) — 400,
    // com a lista de qual campo falhou e por quê.
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

    // JSON malformado / tipo errado no corpo (ex.: texto onde se espera número) e id inválido na
    // URL (ex.: /api/posts/abc). Sem este handler, o handler genérico lá embaixo transformaria
    // isso em 500, quando o erro é do cliente (400).
    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class})
    public ResponseEntity<Map<String, Object>> handleRequisicaoInvalida(Exception ex) {
        return corpo(HttpStatus.BAD_REQUEST, "Requisição inválida: verifique o formato dos dados enviados");
    }

    // Ex.: tentar deletar um integrante que ainda tem Post vinculado (FK), ou valor duplicado
    // em coluna UNIQUE (e-mail repetido).
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleIntegridade(DataIntegrityViolationException ex) {
        log.warn("Violação de integridade: {}", ex.getMostSpecificCause().getMessage());
        return corpo(HttpStatus.CONFLICT, "Operação viola uma restrição de integridade do banco " +
                "(ex.: registro ainda referenciado por outro, ou valor duplicado)");
    }

    // Cobre o ResponseStatusException usado nos services e mantém o mesmo formato de resposta.
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleResponseStatus(ResponseStatusException ex) {
        HttpStatusCode status = ex.getStatusCode();
        return corpo(HttpStatus.valueOf(status.value()), ex.getReason() != null ? ex.getReason() : ex.getMessage());
    }

    // AccessDeniedException vem de duas fontes: dono-ou-admin nos services e @PreAuthorize nos controllers.
    // Quem NÃO está autenticado (ex.: token expirado) recebe 401, e não 403: o front só tenta renovar
    // o token quando recebe 401. Quem está logado mas sem permissão recebe 403.
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAcessoNegado(AccessDeniedException ex) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth instanceof AnonymousAuthenticationToken) {
            return corpo(HttpStatus.UNAUTHORIZED, "Faça login para continuar");
        }
        String mensagem = ex instanceof AuthorizationDeniedException ? "Acesso negado" : ex.getMessage();
        return corpo(HttpStatus.FORBIDDEN, mensagem);
    }

    // Qualquer coisa não prevista. Os erros do próprio Spring MVC (404 de URL inexistente, 405, 415...)
    // implementam ErrorResponse e mantêm o status original; o resto é erro nosso: 500 + log com o
    // stacktrace (sem log, um 500 não deixa rastro nenhum no console).
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenerico(Exception ex) {
        if (ex instanceof ErrorResponse erro) {
            int codigo = erro.getStatusCode().value();
            String mensagem = switch (codigo) {
                case 404 -> "Recurso não encontrado";
                case 405 -> "Método HTTP não permitido para este endereço";
                case 415 -> "Tipo de conteúdo não suportado";
                default -> erro.getBody().getDetail() != null ? erro.getBody().getDetail() : "Requisição inválida";
            };
            return corpo(HttpStatus.valueOf(codigo), mensagem);
        }
        log.error("Erro inesperado", ex);
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
