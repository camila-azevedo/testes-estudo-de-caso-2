describe('Módulo: Gestão de Dados (Formulários e Limites)', () => {

  beforeEach(() => {
    // Simula que um Admin está logado para acessar os formulários
    cy.loginComoAdmin(); // Comando customizado a ser criado no commands.js
  });

  it('CT-INT01, CT-EVT01, CT-TXT01, CT-AVS01 - Deve bloquear submissão com campos obrigatórios vazios', () => {
    const rotasFormularios = ['/admin/integrantes/novo', '/admin/eventos/novo', '/admin/posts/novo', '/admin/avisos/novo'];
    
    rotasFormularios.forEach((rota) => {
      cy.visit(rota);
      cy.get('button[type="submit"]').click();
      cy.contains(/campo obrigatório/i).should('be.visible');
    });
  });

  it('CT-INT03, CT-EVT03 - Deve rejeitar formato de URL inválido no Lattes e link do Evento', () => {
    cy.visit('/admin/eventos/novo');
    cy.get('input[name="linkExterno"]').type('link-invalido.com');
    cy.get('button[type="submit"]').click();
    cy.contains(/URL inválida/i).should('be.visible');
  });

  it('CT-EVT02 - Deve rejeitar data inexistente ou horário inválido no Evento', () => {
    cy.visit('/admin/eventos/novo');
    cy.get('input[name="data"]').type('2026-02-30'); // Data inválida
    cy.get('input[name="hora"]').type('25:00'); // Hora inválida
    cy.get('button[type="submit"]').click();
    cy.contains(/data inválida|hora inválida/i).should('be.visible');
  });

  it('CT-COM01 - Deve rejeitar comentário vazio e validar limite de 2000 caracteres', () => {
    cy.visit('/textos/1'); // Acessa um post específico
    
    // Comentário Vazio
    cy.get('.btn-comentar').click();
    cy.contains(/comentário não pode ser vazio/i).should('be.visible');

    // Comentário acima de 2000 caracteres
    const comentarioLongo = 'A'.repeat(2001);
    cy.get('textarea[name="comentario"]').invoke('val', comentarioLongo).trigger('input');
    cy.get('.contador-caracteres').should('contain', '2001/2000').and('have.class', 'texto-erro');
    cy.get('.btn-comentar').should('be.disabled');
  });

  it('CT-AVS02 - Deve bloquear exclusão do último aviso ativo no banner', () => {
    cy.visit('/admin/avisos');
    // Supondo que a interface tem botões de exclusão
    cy.get('.btn-excluir-aviso').should('have.length', 1);
    cy.get('.btn-excluir-aviso').first().click();
    cy.contains(/o banner não pode ficar vazio/i).should('be.visible');
  });
});