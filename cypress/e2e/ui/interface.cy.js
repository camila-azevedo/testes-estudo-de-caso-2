const integrante = {
  id: 7,
  nome: "Ana Exemplo",
  email: "ana@example.test",
  titulacao: "Doutora",
  linhaPesquisa: "Ciência Arquivística",
  vinculoInstitucional: "Pesquisadora",
  imagem: "https://example.test/ana.jpg",
  lattes: "https://lattes.cnpq.br/123456789",
  statusAtivo: true,
};

const eventoMaisAntigo = {
  id: 1,
  nomeEvento: "Encontro anterior",
  descricao: "Descrição do encontro anterior.",
  dataEvento: "2026-11-15T10:00:00",
  destaque: false,
};

const eventoMaisRecente = {
  id: 2,
  nomeEvento: "Encontro recente",
  descricao: "Descrição do encontro recente.",
  dataEvento: "2026-11-20T14:00:00",
  destaque: false,
};

describe("Casos funcionais: conteúdo institucional e consultas públicas", () => {
  it('CT04 - exibe "Sobre Nós", endereço e contato no rodapé', () => {
    cy.visit("/");

    cy.get("#sobre-nos").within(() => {
      cy.get("h1").should("have.text", "Sobre Nós");
    });

    cy.get("footer").scrollIntoView().within(() => {
      cy.contains("Campus Darcy Ribeiro").should("be.visible");
      cy.get('a[href="mailto:contato@regiimento.com"]')
        .should("be.visible")
        .and("contain", "contato@regiimento.com");
    });
  });

  it("CT05 - lista integrantes e exibe os dados exigidos no modal de perfil", () => {
    cy.intercept("GET", "/api/integrantes", {
      statusCode: 200,
      body: [integrante],
    }).as("integrantes");

    cy.visit("/integrantes");
    cy.wait("@integrantes");
    cy.get(".memberCard").should("have.length", 1);
    cy.contains("button.memberName", integrante.nome).click();

    cy.get('[role="dialog"]').within(() => {
      cy.get(`img[alt="Retrato de ${integrante.nome}"]`)
        .should("be.visible")
        .and("have.attr", "src", integrante.imagem);
      cy.get("h2").should("have.text", integrante.nome);
      cy.contains(integrante.titulacao).should("be.visible");
      cy.contains(integrante.linhaPesquisa).should("be.visible");
      cy.contains(integrante.vinculoInstitucional).should("be.visible");
      cy.get(`a[href="mailto:${integrante.email}"]`).should("be.visible");
      cy.get('a[href="https://lattes.cnpq.br/123456789"]')
        .should("contain", "Currículo Lattes");
    });
  });

  it("CT06 - marca eventos no calendário e lista do mais recente para o mais antigo", () => {
    cy.clock(Date.parse("2026-11-13T12:00:00-03:00"), ["Date"]);
    cy.intercept("GET", "/api/eventos", {
      statusCode: 200,
      body: [eventoMaisAntigo, eventoMaisRecente],
    }).as("eventos");

    cy.visit("/");
    cy.wait("@eventos");
    cy.get(".calendar-container .react-calendar__tile.has-event")
      .should("have.length", 2)
      .last()
      .click();
    cy.get(".calendar-day-events").should("contain", eventoMaisRecente.nomeEvento);

    cy.visit("/eventos");
    cy.wait("@eventos");
    cy.get(".event-card h2").then(($titles) => {
      const titles = [...$titles].map((title) => title.textContent.trim());
      expect(titles).to.deep.equal([
        eventoMaisRecente.nomeEvento,
        eventoMaisAntigo.nomeEvento,
      ]);
    });
  });
});
