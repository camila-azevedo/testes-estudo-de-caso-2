describe('Módulo: Conteúdo Institucional, Eventos e Responsividade', () => {

  beforeEach(() => {
    cy.visit('/');
  });

  it('CT04 - Deve exibir a seção "Sobre Nós" e o rodapé na página inicial', () => {
    cy.contains(/Sobre Nós/i).should('be.visible');
    cy.get('footer').should('be.visible').and('contain', 'Endereço'); // Ajustar para o texto real do rodapé
  });

  it('CT05 - Deve listar integrantes e abrir modal de perfil com os dados', () => {
    cy.visit('/integrantes');
    // Clica no primeiro card de integrante disponível
    cy.get('.card-integrante').first().click();
    
    // Verifica se o modal abriu com os campos exigidos (RF05)
    cy.get('.modal-perfil').should('be.visible');
    cy.get('.modal-foto').should('be.visible');
    cy.get('.modal-titulacao').should('not.be.empty');
    cy.get('.modal-lattes').should('have.attr', 'href').and('include', 'lattes.cnpq.br');
  });

  it('CT06 - Deve consultar o calendário, listar eventos ordenados e destacar o banner superior', () => {
    cy.visit('/eventos');
    cy.get('.calendario-interativo').should('be.visible');
    
    // CT-EVT04: Valida se o evento "Destaque" aparece na seção superior
    cy.get('.evento-destaque').should('be.visible');
    
    // Valida ordenação (mais recente para mais antigo)
    cy.get('.evento-data').then(($datas) => {
      // Lógica extraível para comparar as datas renderizadas no DOM
      const datas = $datas.map((i, el) => new Date(el.innerText)).get();
      const ordenado = [...datas].sort((a, b) => b - a);
      expect(datas).to.deep.equal(ordenado);
    });
  });

  it('CT12 - Deve garantir responsividade em Viewports (Mobile e Desktop)', () => {
    // Mobile
    cy.viewport(360, 800);
    cy.get('.menu-hamburger').should('be.visible');
    cy.get('body').should('not.have.css', 'overflow-x', 'auto'); // Sem rolagem horizontal

    // Desktop
    cy.viewport(1920, 1080);
    cy.get('.menu-desktop').should('be.visible');
    cy.get('.menu-hamburger').should('not.be.visible');
  });
});