package com.regiimento.portal_academico.repository;

import com.regiimento.portal_academico.model.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface ComentarioRepository extends JpaRepository<Comentario, Long> {

    List<Comentario> findByPostIdOrderByDataHora(Long postId);

    long countByPostId(Long postId);

    // Resultado de contarPorPostIds: (id do post, total de comentários)
    interface ContagemPorPost {
        Long getPostId();

        Long getTotal();
    }

    // Uma única consulta para contar os comentários de vários posts (evita uma consulta por post).
    @Query("select c.post.id as postId, count(c) as total from Comentario c "
            + "where c.post.id in :ids group by c.post.id")
    List<ContagemPorPost> contarPorPostIds(@Param("ids") Collection<Long> ids);
}
