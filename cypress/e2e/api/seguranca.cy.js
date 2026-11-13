describe('Módulo: Autenticação, Proteção de Endpoints e Segurança', () => {

  it('CT01 - Deve iniciar fluxo de login via Google OAuth', () => {
    cy.request({
      method: 'GET',
      url: '/oauth2/authorization/google',
      followRedirect: false 
    }).then((response) => {
      expect(response.status).to.be.oneOf([302, 303]);
      expect(response.headers.location).to.include('accounts.google.com');
    });
  });

  it('CT02, CT09 - Deve bloquear acesso sem autenticação com 401/403 (RBAC)', () => {
    const rotasProtegidas = [
      { method: 'POST', url: '/api/eventos' },
      { method: 'DELETE', url: '/api/avisos/1' },
      { method: 'PUT', url: '/api/usuarios/me' }
    ];

    rotasProtegidas.forEach((rota) => {
      cy.request({
        method: rota.method,
        url: rota.url,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 403]);
      });
    });
  });

  it('CT10 - Deve sanitizar script malicioso (XSS) submetido em comentários', () => {
    const scriptMalicioso = "<script>alert('xss')</script>";
    
    // Usa uma sessão autenticada genérica
    cy.loginComoUsuario(); 

    cy.request({
      method: 'POST',
      url: '/api/textos/1/comentarios',
      body: { texto: scriptMalicioso },
      failOnStatusCode: false
    }).then((response) => {
      // Valida se a API retorna sucesso mas o body salvo não contém as tags script
      expect(response.status).to.eq(201);
      expect(response.body.texto).not.to.include('<script>');
      expect(response.body.texto).to.include('&lt;script&gt;'); // Verifica escape HTML
    });
  });
});