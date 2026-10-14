package com.regiimento.portal_academico.service;

import com.regiimento.portal_academico.dto.request.IntegranteRegimentoRequest;
import com.regiimento.portal_academico.dto.request.PromoverIntegranteRequest;
import com.regiimento.portal_academico.dto.response.IntegranteRegimentoResponse;
import com.regiimento.portal_academico.exception.ResourceNotFoundException;
import com.regiimento.portal_academico.model.IntegranteRegimento;
import com.regiimento.portal_academico.repository.IntegranteRegimentoRepository;
import com.regiimento.portal_academico.repository.UsuarioInteressadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IntegranteRegimentoService {

    private final IntegranteRegimentoRepository integranteRepository;
    private final UsuarioInteressadoRepository usuarioInteressadoRepository;

    @Transactional(readOnly = true)
    public List<IntegranteRegimentoResponse> listarAtivos() {
        return integranteRepository.findByStatusAtivoTrue().stream()
                .map(IntegranteRegimentoResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<IntegranteRegimentoResponse> listarTodos() {
        return integranteRepository.findAll().stream()
                .map(IntegranteRegimentoResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public IntegranteRegimentoResponse buscarPorId(Long id) {
        IntegranteRegimento integrante = integranteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Integrante não encontrado com id: " + id));
        return new IntegranteRegimentoResponse(integrante);
    }

    @Transactional
    public IntegranteRegimentoResponse criar(IntegranteRegimentoRequest request) {
        IntegranteRegimento integrante = new IntegranteRegimento();
        integrante.setEmail(request.getEmail());
        integrante.setNome(request.getNome());
        integrante.setImagem(request.getImagem());
        integrante.setIdProvedorExterno(request.getIdProvedorExterno());
        integrante.setAutenticacaoProvedor(request.getAutenticacaoProvedor());
        integrante.setVinculoInstitucional(request.getVinculoInstitucional());
        integrante.setLinhaPesquisa(request.getLinhaPesquisa());
        integrante.setLattes(request.getLattes());
        integrante.setTitulacao(request.getTitulacao());

        return new IntegranteRegimentoResponse(integranteRepository.save(integrante));
    }

    @Transactional
    public IntegranteRegimentoResponse atualizar(Long id, IntegranteRegimentoRequest request) {
        IntegranteRegimento integrante = integranteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Integrante não encontrado com id: " + id));

        integrante.setNome(request.getNome());
        integrante.setImagem(request.getImagem());
        integrante.setVinculoInstitucional(request.getVinculoInstitucional());
        integrante.setLinhaPesquisa(request.getLinhaPesquisa());
        integrante.setLattes(request.getLattes());
        integrante.setTitulacao(request.getTitulacao());

        return new IntegranteRegimentoResponse(integranteRepository.save(integrante));
    }

    @Transactional
    public void deletar(Long id) {
        if (!integranteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Integrante não encontrado com id: " + id);
        }
        integranteRepository.deleteById(id);
    }

    /**
     * Promove um UsuarioInteressado já existente (ou seja, alguém que já passou
     * pelo login com o Google) a IntegranteRegimento. Não aceita email nem
     * idProvedorExterno no corpo — a identidade já foi provada pelo OAuth,
     * aqui só se decide o papel da pessoa no sistema.
     */
    @Transactional
    public IntegranteRegimentoResponse promover(Long usuarioId, PromoverIntegranteRequest request) {
        if (integranteRepository.existsById(usuarioId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Usuário " + usuarioId + " já é integrante");
        }
        if (!usuarioInteressadoRepository.existsById(usuarioId)) {
            throw new ResourceNotFoundException("Usuário interessado não encontrado com id: " + usuarioId);
        }

        // remove a linha da subclasse antiga antes de inserir a nova —
        // o id_usuario na tabela usuario continua o mesmo o tempo todo
        usuarioInteressadoRepository.deleteById(usuarioId);

        integranteRepository.inserirComoIntegrante(
                usuarioId,
                request.getVinculoInstitucional(),
                request.getLinhaPesquisa(),
                request.getLattes(),
                request.getTitulacao(),
                Boolean.TRUE.equals(request.getAdministrador())
        );

        IntegranteRegimento novoIntegrante = integranteRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalStateException("Falha ao promover usuário " + usuarioId));

        return new IntegranteRegimentoResponse(novoIntegrante);
    }
}
