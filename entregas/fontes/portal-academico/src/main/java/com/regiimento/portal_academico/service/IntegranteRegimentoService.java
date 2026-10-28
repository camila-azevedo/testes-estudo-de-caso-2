package com.regiimento.portal_academico.service;

import com.regiimento.portal_academico.dto.request.AtualizarIntegranteRequest;
import com.regiimento.portal_academico.dto.request.AtualizarStatusIntegranteRequest;
import com.regiimento.portal_academico.dto.request.IntegranteRegimentoRequest;
import com.regiimento.portal_academico.dto.request.PromoverIntegranteRequest;
import com.regiimento.portal_academico.dto.response.IntegranteRegimentoPublicoResponse;
import com.regiimento.portal_academico.dto.response.IntegranteRegimentoResponse;
import com.regiimento.portal_academico.exception.ResourceNotFoundException;
import com.regiimento.portal_academico.model.IntegranteRegimento;
import com.regiimento.portal_academico.repository.IntegranteRegimentoRepository;
import com.regiimento.portal_academico.repository.UsuarioInteressadoRepository;
import com.regiimento.portal_academico.security.AuthenticatedUser;
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
    public List<IntegranteRegimentoPublicoResponse> listarAtivos() {
        return integranteRepository.findByStatusAtivoTrue().stream()
                .map(IntegranteRegimentoPublicoResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<IntegranteRegimentoResponse> listarTodos() {
        return integranteRepository.findAll().stream()
                .map(IntegranteRegimentoResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public IntegranteRegimentoPublicoResponse buscarPorId(Long id) {
        IntegranteRegimento integrante = integranteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Integrante não encontrado com id: " + id));
        return new IntegranteRegimentoPublicoResponse(integrante);
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
    public IntegranteRegimentoResponse atualizar(Long id, AtualizarIntegranteRequest request) {
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

    /**
     * Ativa/desativa um integrante e/ou concede/retira o papel de admin. Desativar é o caminho
     * normal para "tirar" alguém: apagar falha quando a pessoa já tem posts, eventos ou comentários.
     * O admin não pode desativar nem rebaixar a si mesmo, o que garante que sempre sobra um admin.
     */
    @Transactional
    public IntegranteRegimentoResponse atualizarStatus(Long id, AtualizarStatusIntegranteRequest request,
                                                       AuthenticatedUser adminLogado) {
        if (request.getStatusAtivo() == null && request.getAdministrador() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe statusAtivo e/ou administrador");
        }

        IntegranteRegimento integrante = integranteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Integrante não encontrado com id: " + id));

        boolean ehOProprioAdmin = integrante.getId().equals(adminLogado.id());
        if (ehOProprioAdmin && (Boolean.FALSE.equals(request.getStatusAtivo())
                || Boolean.FALSE.equals(request.getAdministrador()))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Você não pode se desativar nem remover o seu próprio acesso de administrador");
        }

        if (request.getStatusAtivo() != null) {
            integrante.setStatusAtivo(request.getStatusAtivo());
        }
        if (request.getAdministrador() != null) {
            integrante.setAdministrador(request.getAdministrador());
        }

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

        // Remove só a linha da subclasse antiga (SQL nativo) antes de inserir a nova: o
        // id_usuario na tabela usuario precisa continuar existindo. NÃO usar deleteById aqui:
        // com herança JOINED o JPA apagaria também a linha de usuario.
        usuarioInteressadoRepository.removerLinhaInteressado(usuarioId);

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
