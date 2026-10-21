package com.regiimento.portal_academico.security;

import com.regiimento.portal_academico.model.Usuario;
import com.regiimento.portal_academico.model.UsuarioInteressado;
import com.regiimento.portal_academico.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Depois que o Spring troca o "code" do provedor (ex.: Google) pelo token e busca o
 * userinfo, isso aqui roda para ligar aquele login a um Usuario do nosso banco.
 *
 * Regra de provisionamento adotada (ajuste conforme a regra de negócio real):
 *  - Se já existe um Usuario com esse e-mail, reaproveita (seja IntegranteRegimento
 *    ou UsuarioInteressado) e atualiza os dados do provedor.
 *  - Se não existe, cria um UsuarioInteressado novo — IntegranteRegimento (membro do
 *    corpo docente/pesquisa) só é promovido por um admin depois, nunca por
 *    autoatribuição via OAuth. Isso evita que qualquer pessoa que logue vire
 *    "integrante" e ganhe permissão de publicar posts/eventos.
 */
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UsuarioRepository usuarioRepository;
    private final AuthenticatedUserResolver authenticatedUserResolver;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        String provedor = userRequest.getClientRegistration().getRegistrationId(); // ex: "google"

        String idExterno = oauth2User.getAttribute("sub");
        String email = oauth2User.getAttribute("email");
        String nome = oauth2User.getAttribute("name");
        String imagem = oauth2User.getAttribute("picture");
        Boolean emailVerificado = oauth2User.getAttribute("email_verified");

        if (email == null || idExterno == null) {
            throw new OAuth2AuthenticationException("Provedor OAuth2 não retornou email/sub");
        }
        // Não confiamos em e-mail não verificado pelo provedor: alguém poderia cadastrar
        // um e-mail que não controla e assumir a identidade de outro usuário já existente.
        if (emailVerificado != null && !emailVerificado) {
            throw new OAuth2AuthenticationException("E-mail não verificado pelo provedor OAuth2");
        }

        Usuario usuario = usuarioRepository.findByEmail(email).orElseGet(() -> {
            UsuarioInteressado novo = new UsuarioInteressado();
            novo.setEmail(email);
            return novo;
        });

        usuario.setNome(nome != null ? nome : usuario.getNome());
        usuario.setImagem(imagem);
        usuario.setIdProvedorExterno(idExterno);
        usuario.setAutenticacaoProvedor(provedor);
        usuario = usuarioRepository.save(usuario);

        return new OAuth2UsuarioPrincipal(authenticatedUserResolver.resolver(usuario), oauth2User.getAttributes());
    }
}
