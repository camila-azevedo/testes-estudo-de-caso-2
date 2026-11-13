const administrador = {
  id: 42,
  email: "admin@example.test",
  tipo: "INTEGRANTE",
  administrador: true,
};

const interessado = {
  id: 73,
  nome: "Usuário Exemplo",
  email: "usuario@example.test",
};

function openEventForm() {
  cy.intercept("GET", "/api/eventos", { statusCode: 200, body: [] }).as(
    "eventos",
  );
  cy.visit("/eventos");
  cy.wait("@eventos");
  cy.contains("button", "Cadastrar evento").click();
  cy.get('[role="dialog"] form').should("be.visible");
}

function fillEventRequiredFields() {
  cy.contains("label", "Nome do evento").find("input").type("Evento de teste");
  cy.contains("label", "Descrição").find("textarea").type("Descrição de teste");
  cy.contains("label", "Data do evento").find("input").type("2030-06-15");
  cy.contains("label", "Horário do evento").find("input").type("12:00");
}

function openMemberForm() {
  cy.intercept("GET", "/api/integrantes/todos", {
    statusCode: 200,
    body: [],
  }).as("integrantes");
  cy.intercept("GET", "/api/usuarios-interessados", {
    statusCode: 200,
    body: [interessado],
  }).as("interessados");

  cy.visitAsUser("/integrantes", administrador);
  cy.wait("@integrantes");
  cy.contains("button", "Adicionar Membro").click();
  cy.wait("@interessados");
  cy.get('[role="dialog"] form').should("be.visible");
}

describe("Casos funcionais: formulários e limites", () => {
  it("CT-PRF01 - permite editar titulação e foto, mas bloqueia nome e e-mail", () => {
    cy.visitAsUser("/perfil", {
      id: 12,
      email: "interessado@example.test",
      tipo: "INTERESSADO",
      administrador: false,
    });

    cy.contains("h1", "Meu perfil").should("be.visible");
    cy.get('input[name="titulacao"]').should("be.enabled");
    cy.get('input[name="foto"]').should("be.enabled");
    cy.get('input[name="nome"]').should("be.disabled");
    cy.get('input[name="email"]').should("be.disabled");
  });

  it("CT-INT01 - não permite cadastrar integrante com campos obrigatórios vazios", () => {
    cy.intercept("POST", "**/api/integrantes/*/promover").as("promover");
    openMemberForm();

    cy.get('[role="dialog"] form').within(() => {
      cy.get("select[required]").should("exist");
      cy.get("input[required]").should("have.length", 3);
      cy.get('button[type="submit"]').click();
    });
    cy.get('[role="dialog"] form').should(($form) => {
      expect($form[0].checkValidity()).to.equal(false);
    });
    cy.get("@promover.all").should("have.length", 0);
  });

  it("CT-INT03 - rejeita URL inválida no currículo Lattes", () => {
    cy.intercept("POST", "**/api/integrantes/*/promover").as("promover");
    openMemberForm();

    cy.get('[role="dialog"] form').within(() => {
      cy.get("select[required]").select(String(interessado.id));
      cy.contains("label", "Vínculo institucional")
        .find("input")
        .type("Pesquisadora");
      cy.contains("label", "Titulação").find("input").type("Doutora");
      cy.contains("label", "Área de atuação")
        .find("input")
        .type("Arquivologia");
      cy.contains("label", "Link do currículo Lattes")
        .find("input")
        .type("link-invalido.com");
      cy.get('button[type="submit"]').click();
    });

    cy.get('[role="dialog"] input[type="url"]').should(($input) => {
      expect($input[0].validity.typeMismatch).to.equal(true);
    });
    cy.get("@promover.all").should("have.length", 0);
  });

  it("CT-EVT01 - bloqueia o cadastro de evento sem campos obrigatórios", () => {
    openEventForm();

    cy.get('[role="dialog"] form').within(() => {
      cy.get("input[required], textarea[required]").should("have.length", 4);
      cy.get('button[type="submit"]').click();
    });
    cy.get('[role="dialog"] form').should(($form) => {
      expect($form[0].checkValidity()).to.equal(false);
    });
  });

  it("CT-EVT02 - rejeita data inexistente e horário inválido", () => {
    openEventForm();
    cy.contains("label", "Nome do evento").find("input").type("Evento de teste");
    cy.contains("label", "Descrição").find("textarea").type("Descrição de teste");

    cy.get('input[type="date"]').then(($input) => {
      $input[0].value = "2026-02-30";
      $input[0].dispatchEvent(new Event("input", { bubbles: true }));
      $input[0].dispatchEvent(new Event("change", { bubbles: true }));
      expect($input[0].value).to.equal("");
      expect($input[0].validity.valueMissing).to.equal(true);
    });
    cy.get('input[type="time"]').then(($input) => {
      $input[0].value = "25:00";
      $input[0].dispatchEvent(new Event("input", { bubbles: true }));
      $input[0].dispatchEvent(new Event("change", { bubbles: true }));
      expect($input[0].value).to.equal("");
      expect($input[0].validity.valueMissing).to.equal(true);
    });
    cy.get('[role="dialog"] form').should(($form) => {
      expect($form[0].checkValidity()).to.equal(false);
    });
  });

  it("CT-EVT03 - rejeita URL inválida no link opcional do evento", () => {
    openEventForm();
    fillEventRequiredFields();
    cy.contains("label", "Link do evento (opcional)")
      .find("input")
      .type("link-invalido.com");

    cy.get('[role="dialog"] input[type="url"]').should(($input) => {
      expect($input[0].validity.typeMismatch).to.equal(true);
    });
    cy.get('[role="dialog"] form').should(($form) => {
      expect($form[0].checkValidity()).to.equal(false);
    });
  });

  it("CT-EVT04 - exibe no destaque o evento marcado como destaque", () => {
    const eventoDestacado = {
      id: 11,
      nomeEvento: "Seminário em destaque",
      descricao: "Evento principal.",
      dataEvento: "2030-06-15T12:00:00",
      destaque: true,
    };
    const eventoComum = {
      id: 12,
      nomeEvento: "Encontro regular",
      descricao: "Evento sem destaque.",
      dataEvento: "2030-06-16T12:00:00",
      destaque: false,
    };
    cy.intercept("GET", "/api/eventos", {
      statusCode: 200,
      body: [eventoComum, eventoDestacado],
    }).as("eventos");

    cy.visit("/eventos");
    cy.wait("@eventos");
    cy.get(".featured-event__item h2").should(
      "have.text",
      eventoDestacado.nomeEvento,
    );
    cy.get(".featured-event__item").should(
      "not.contain",
      eventoComum.nomeEvento,
    );
  });

  it("CT-TXT01 - bloqueia publicação de texto sem campos obrigatórios", () => {
    cy.intercept("GET", "/api/posts", { statusCode: 200, body: [] }).as("posts");
    cy.visitAsUser("/textos-para-discussao", administrador);
    cy.wait("@posts");
    cy.contains("button", "Novo texto").click();

    cy.get('[role="dialog"] form').within(() => {
      cy.get("input[required], textarea[required]").should("have.length", 3);
      cy.get('button[type="submit"]').click();
    });
    cy.get('[role="dialog"] form').should(($form) => {
      expect($form[0].checkValidity()).to.equal(false);
    });
  });

  it("CT-COM01 - valida comentário vazio e limite de 2.000 caracteres", () => {
    cy.intercept("GET", "/api/posts", {
      statusCode: 200,
      body: [
        {
          id: 1,
          conteudoTexto: "Texto para comentários\nDescrição do texto.",
          tipo: "Discussão",
          dataCriacao: "2026-11-13T12:00:00",
          cadastradoPorNome: "Autora",
          cadastradoPorId: 7,
          totalComentarios: 0,
        },
      ],
    }).as("posts");

    cy.visit("/textos-para-discussao");
    cy.wait("@posts");
    cy.get(".text-card").contains("h2", "Texto para comentários").parents(".text-card").within(() => {
      cy.get('textarea[maxlength="2000"]').as("comentario");
      cy.contains("button", /comentar/i).as("enviarComentario");
      cy.get("@enviarComentario").click();
      cy.get('[role="alert"]').should("contain", "comentário");
      cy.get("@comentario").type("A".repeat(2001));
      cy.get("@comentario").should(($textarea) => {
        expect($textarea.val().length).to.be.at.most(2000);
      });
    });
  });

  it("CT-AVS01 - impede salvar aviso com campos obrigatórios vazios", () => {
    cy.visitAsUser("/conteudo", administrador);
    cy.contains("button", "Novo aviso").click();
    cy.get('[role="dialog"] form').within(() => {
      cy.get("input[required], textarea[required]").should("have.length.greaterThan", 0);
      cy.get('button[type="submit"]').click();
    });
    cy.get('[role="dialog"] form').should(($form) => {
      expect($form[0].checkValidity()).to.equal(false);
    });
  });

  it("CT-AVS02 - impede excluir o último aviso ativo", () => {
    cy.visitAsUser("/conteudo", administrador);
    cy.get('[aria-label="Excluir aviso"]').should("have.length", 1);
    cy.get('[aria-label="Excluir aviso"]').click();
    cy.contains(/o banner não pode ficar vazio/i).should("be.visible");
  });

  it("CT-AVS03 - permite reordenar avisos e reflete a ordem no carrossel", () => {
    cy.visitAsUser("/conteudo", administrador);
    cy.get('[aria-label="Mover aviso para cima"]').should("exist");
    cy.get(".aviso-card").first().should("contain", "Aviso A");
    cy.get('[aria-label="Mover aviso para cima"]').last().click();
    cy.get(".aviso-card").first().should("contain", "Aviso B");
    cy.visit("/");
    cy.get(".announcementBanner h1").should("contain", "Aviso B");
  });
});
