describe("Caso funcional: autenticação", () => {
  it("CT01 - inicia o fluxo de login via Google OAuth", () => {
    cy.request({
      method: "GET",
      url: "/oauth2/authorization/google",
      followRedirect: false,
    }).then((response) => {
      expect(response.status).to.be.oneOf([302, 303]);
      expect(response.headers.location).to.include("accounts.google.com");
    });
  });
});
