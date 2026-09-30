package com.regiimento.portal_academico.service;

import com.regiimento.portal_academico.dto.request.PublicacaoAcademicaRequest;
import com.regiimento.portal_academico.dto.response.PublicacaoAcademicaResponse;
import com.regiimento.portal_academico.exception.ResourceNotFoundException;
import com.regiimento.portal_academico.model.PublicacaoAcademica;
import com.regiimento.portal_academico.model.Usuario;
import com.regiimento.portal_academico.repository.PublicacaoAcademicaRepository;
import com.regiimento.portal_academico.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PublicacaoAcademicaService {

    private final PublicacaoAcademicaRepository publicacaoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<PublicacaoAcademicaResponse> listarTodas() {
        return publicacaoRepository.findAll().stream()
                .map(PublicacaoAcademicaResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public PublicacaoAcademicaResponse buscarPorId(Long id) {
        PublicacaoAcademica pub = publicacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Publicação não encontrada com id: " + id));
        return new PublicacaoAcademicaResponse(pub);
    }

    @Transactional
    public PublicacaoAcademicaResponse criar(PublicacaoAcademicaRequest request) {
        PublicacaoAcademica pub = new PublicacaoAcademica();
        pub.setTitulo(request.getTitulo());
        pub.setResumo(request.getResumo());
        pub.setDataPublicacao(request.getDataPublicacao());
        pub.setTipo(request.getTipo());

        if (request.getAutoresIds() != null && !request.getAutoresIds().isEmpty()) {
            Set<Usuario> autores = new HashSet<>(usuarioRepository.findAllById(request.getAutoresIds()));
            pub.setAutores(autores);
        }

        return new PublicacaoAcademicaResponse(publicacaoRepository.save(pub));
    }

    @Transactional
    public PublicacaoAcademicaResponse atualizar(Long id, PublicacaoAcademicaRequest request) {
        PublicacaoAcademica pub = publicacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Publicação não encontrada com id: " + id));

        pub.setTitulo(request.getTitulo());
        pub.setResumo(request.getResumo());
        pub.setDataPublicacao(request.getDataPublicacao());
        pub.setTipo(request.getTipo());

        if (request.getAutoresIds() != null) {
            Set<Usuario> autores = new HashSet<>(usuarioRepository.findAllById(request.getAutoresIds()));
            pub.setAutores(autores);
        }

        return new PublicacaoAcademicaResponse(publicacaoRepository.save(pub));
    }

    @Transactional
    public void deletar(Long id) {
        if (!publicacaoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Publicação não encontrada com id: " + id);
        }
        publicacaoRepository.deleteById(id);
    }
}
