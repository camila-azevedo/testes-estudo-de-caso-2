package com.regiimento.portal_academico.security;

import com.regiimento.portal_academico.model.Usuario;
import com.regiimento.portal_academico.repository.IntegranteRegimentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Decide se um Usuario é IntegranteRegimento (e se é admin) consultando
 * diretamente a tabela integrante_regimento pelo id, em vez de confiar em
 * "usuario instanceof IntegranteRegimento" depois de um fetch polimórfico
 * pela superclasse abstrata Usuario. Essa checagem via instanceof dependia de
 * o Hibernate resolver corretamente o tipo concreto na herança JOINED (sem
 * coluna discriminadora), e isso se mostrou não confiável em alguns
 * ambientes — o banco estava certo, mas o tipo resolvido em memória, não.
 * Uma consulta direta ao repository correto sempre reflete o estado real do
 * banco, então usamos isso em todo lugar que decide o papel/role de alguém.
 */
@Component
@RequiredArgsConstructor
public class AuthenticatedUserResolver {

    private final IntegranteRegimentoRepository integranteRepository;

    @Transactional(readOnly = true)
    public AuthenticatedUser resolver(Usuario usuario) {
        return integranteRepository.findById(usuario.getId())
                // integrante desativado pelo admin perde as permissões de integrante
                .filter(integrante -> Boolean.TRUE.equals(integrante.getStatusAtivo()))
                .map(integrante -> new AuthenticatedUser(
                        usuario.getId(),
                        usuario.getEmail(),
                        AuthenticatedUser.TipoUsuario.INTEGRANTE,
                        Boolean.TRUE.equals(integrante.getAdministrador())
                ))
                .orElseGet(() -> new AuthenticatedUser(
                        usuario.getId(),
                        usuario.getEmail(),
                        AuthenticatedUser.TipoUsuario.INTERESSADO,
                        false
                ));
    }
}
