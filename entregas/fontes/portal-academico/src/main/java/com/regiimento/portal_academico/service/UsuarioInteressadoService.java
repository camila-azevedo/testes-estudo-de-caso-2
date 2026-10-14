package com.regiimento.portal_academico.service;

import com.regiimento.portal_academico.dto.request.UsuarioInteressadoRequest;
import com.regiimento.portal_academico.dto.response.UsuarioInteressadoResponse;
import com.regiimento.portal_academico.exception.ResourceNotFoundException;
import com.regiimento.portal_academico.model.IntegranteRegimento;
import com.regiimento.portal_academico.model.UsuarioInteressado;
import com.regiimento.portal_academico.repository.IntegranteRegimentoRepository;
import com.regiimento.portal_academico.repository.UsuarioInteressadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioInteressadoService {

    private final UsuarioInteressadoRepository usuarioInteressadoRepository;
    private final IntegranteRegimentoRepository integranteRepository;

    @Transactional(readOnly = true)
    public List<UsuarioInteressadoResponse> listarTodos() {
        return usuarioInteressadoRepository.findAll().stream()
                .map(UsuarioInteressadoResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public UsuarioInteressadoResponse buscarPorId(Long id) {
        UsuarioInteressado usuario = usuarioInteressadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário interessado não encontrado com id: " + id));
        return new UsuarioInteressadoResponse(usuario);
    }

    @Transactional
    public UsuarioInteressadoResponse criar(UsuarioInteressadoRequest request) {
        UsuarioInteressado usuario = new UsuarioInteressado();
        usuario.setEmail(request.getEmail());
        usuario.setNome(request.getNome());
        usuario.setImagem(request.getImagem());
        usuario.setIdProvedorExterno(request.getIdProvedorExterno());
        usuario.setAutenticacaoProvedor(request.getAutenticacaoProvedor());

        if (request.getIntegranteCadastranteId() != null) {
            IntegranteRegimento integrante = integranteRepository.findById(request.getIntegranteCadastranteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Integrante não encontrado com id: " + request.getIntegranteCadastranteId()));
            usuario.setCadastradoPor(integrante);
        }

        return new UsuarioInteressadoResponse(usuarioInteressadoRepository.save(usuario));
    }

    @Transactional
    public void deletar(Long id) {
        if (!usuarioInteressadoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuário interessado não encontrado com id: " + id);
        }
        usuarioInteressadoRepository.deleteById(id);
    }
}
