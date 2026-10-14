package com.regiimento.portal_academico.service;

import com.regiimento.portal_academico.dto.request.ComentarioRequest;
import com.regiimento.portal_academico.dto.response.ComentarioResponse;
import com.regiimento.portal_academico.exception.ResourceNotFoundException;
import com.regiimento.portal_academico.model.Comentario;
import com.regiimento.portal_academico.model.Post;
import com.regiimento.portal_academico.model.Usuario;
import com.regiimento.portal_academico.repository.ComentarioRepository;
import com.regiimento.portal_academico.repository.PostRepository;
import com.regiimento.portal_academico.repository.UsuarioRepository;
import com.regiimento.portal_academico.security.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComentarioService {

    private final ComentarioRepository comentarioRepository;
    private final PostRepository postRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<ComentarioResponse> listarPorPost(Long postId) {
        return comentarioRepository.findByPostIdOrderByDataHora(postId).stream()
                .map(ComentarioResponse::new)
                .toList();
    }

    @Transactional
    public ComentarioResponse criar(ComentarioRequest request, AuthenticatedUser usuarioLogado) {
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Post não encontrado com id: " + request.getPostId()));

        // autor = quem está logado, não um usuarioId que veio no JSON
        Usuario autor = usuarioRepository.findById(usuarioLogado.id())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com id: " + usuarioLogado.id()));

        Comentario comentario = new Comentario();
        comentario.setTexto(request.getTexto());
        comentario.setPost(post);
        comentario.setAutor(autor);

        return new ComentarioResponse(comentarioRepository.save(comentario));
    }

    @Transactional
    public void deletar(Long id, AuthenticatedUser usuarioLogado) {
        Comentario comentario = comentarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comentário não encontrado com id: " + id));

        boolean ehAutor = comentario.getAutor().getId().equals(usuarioLogado.id());
        if (!ehAutor && !usuarioLogado.administrador()) {
            throw new AccessDeniedException("Você só pode apagar seus próprios comentários");
        }

        comentarioRepository.deleteById(id);
    }
}
