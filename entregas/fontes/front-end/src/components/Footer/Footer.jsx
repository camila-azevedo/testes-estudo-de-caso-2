import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <a href="/" aria-label="Ir para a página inicial">
        <img
          src="/regiimento2.png"
          alt="R.E.G.I.I.M.E.N.T.O."
          className="footerLogo"
        />
      </a>

      <p className="footerText">
        Entre em contato conosco:
        <br />
        <a href="mailto:contato@regiimento.com">contato@regiimento.com</a>
        <br />
        Ou Universidade de Brasília - Campus Darcy Ribeiro
        <br />
        Faculdade de Ciências da Informação
        <br />
        Edifício da Biblioteca Central, Entrada Leste, Mezanino
        <br />
        Brasília - DF, 70919-970
      </p>
    </footer>
  );
}
