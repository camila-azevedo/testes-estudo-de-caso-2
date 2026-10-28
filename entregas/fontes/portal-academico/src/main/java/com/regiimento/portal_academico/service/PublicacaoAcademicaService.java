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
        return publicacaoRepository.findAllByOrderByDataPublicacaoDesc().stream()
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

        pub.setAutores(buscarAutores(request.getAutoresIds()));

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

        pub.setAutores(buscarAutores(request.getAutoresIds()));

        return new PublicacaoAcademicaResponse(publicacaoRepository.save(pub));
    }

    // findAllById ignora em silêncio os ids que não existem: sem esta checagem, uma publicação
    // podia ser salva com menos autores (ou nenhum) do que o pedido.
    private Set<Usuario> buscarAutores(Set<Long> ids) {
        List<Usuario> encontrados = usuarioRepository.findAllById(ids);
        if (encontrados.size() != ids.size()) {
            List<Long> achados = encontrados.stream().map(Usuario::getId).toList();
            List<Long> faltando = ids.stream().filter(id -> !achados.contains(id)).sorted().toList();
            throw new ResourceNotFoundException("Autor(es) não encontrado(s): " + faltando);
        }
        return new HashSet<>(encontrados);
    }

    @Transactional
    public void deletar(Long id) {
        if (!publicacaoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Publicação não encontrada com id: " + id);
        }
        publicacaoRepository.deleteById(id);
    }
}
