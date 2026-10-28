package com.regiimento.portal_academico.service;

import com.regiimento.portal_academico.dto.request.PostRequest;
import com.regiimento.portal_academico.dto.response.PostResponse;
import com.regiimento.portal_academico.exception.ResourceNotFoundException;
import com.regiimento.portal_academico.model.IntegranteRegimento;
import com.regiimento.portal_academico.model.Post;
import com.regiimento.portal_academico.repository.IntegranteRegimentoRepository;
import com.regiimento.portal_academico.repository.ComentarioRepository;
import com.regiimento.portal_academico.repository.PostRepository;
import com.regiimento.portal_academico.security.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final IntegranteRegimentoRepository integranteRepository;
    private final ComentarioRepository comentarioRepository;

    @Transactional(readOnly = true)
    public List<PostResponse> listarTodos() {
        return comTotais(postRepository.findAllByOrderByDataCriacaoDesc());
    }

    @Transactional(readOnly = true)
    public List<PostResponse> listarPorTipo(String tipo) {
        return comTotais(postRepository.findByTipoOrderByDataCriacaoDesc(tipo));
    }

    // Uma única consulta traz o total de comentários de todos os posts da lista
    // (antes era uma consulta por post: post.getComentarios().size()).
    private List<PostResponse> comTotais(List<Post> posts) {
        if (posts.isEmpty()) {
            return List.of();
        }
        List<Long> ids = posts.stream().map(Post::getId).toList();
        Map<Long, Long> totais = new HashMap<>();
        comentarioRepository.contarPorPostIds(ids).forEach(c -> totais.put(c.getPostId(), c.getTotal()));
        return posts.stream()
                .map(post -> new PostResponse(post, totais.getOrDefault(post.getId(), 0L)))
                .toList();
    }

    @Transactional(readOnly = true)
    public PostResponse buscarPorId(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post não encontrado com id: " + id));
        return new PostResponse(post, comentarioRepository.countByPostId(id));
    }

    @Transactional
    public PostResponse criar(PostRequest request, AuthenticatedUser usuarioLogado) {
        // @PreAuthorize("hasRole('INTEGRANTE')") no controller já barra quem não é integrante;
        // aqui buscamos a entidade correspondente ao usuário logado.
        IntegranteRegimento integrante = integranteRepository.findById(usuarioLogado.id())
                .orElseThrow(() -> new ResourceNotFoundException("Integrante não encontrado com id: " + usuarioLogado.id()));

        Post post = new Post();
        post.setConteudoTexto(request.getConteudoTexto());
        post.setTipo(request.getTipo());
        post.setImagem(request.getImagem());
        post.setCadastradoPor(integrante);

        return new PostResponse(postRepository.save(post), 0);
    }

    @Transactional
    public PostResponse atualizar(Long id, PostRequest request, AuthenticatedUser usuarioLogado) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post não encontrado com id: " + id));

        boolean ehAutor = post.getCadastradoPor().getId().equals(usuarioLogado.id());
        if (!ehAutor && !usuarioLogado.administrador()) {
            throw new AccessDeniedException("Você só pode editar seus próprios posts");
        }

        post.setConteudoTexto(request.getConteudoTexto());
        post.setTipo(request.getTipo());
        post.setImagem(request.getImagem());

        Post salvo = postRepository.save(post);
        return new PostResponse(salvo, comentarioRepository.countByPostId(salvo.getId()));
    }

    @Transactional
    public void deletar(Long id, AuthenticatedUser usuarioLogado) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post não encontrado com id: " + id));

        boolean ehAutor = post.getCadastradoPor().getId().equals(usuarioLogado.id());
        if (!ehAutor && !usuarioLogado.administrador()) {
            throw new AccessDeniedException("Você só pode apagar seus próprios posts");
        }

        postRepository.deleteById(id);
    }
}
