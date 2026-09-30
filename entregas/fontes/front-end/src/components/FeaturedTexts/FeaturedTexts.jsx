import "./FeaturedTexts.css";

const featuredText = {
  category: "Texto em destaque",
  title: "A influência da IA na pesquisa acadêmica",
  description:
    "A inteligência artificial vem transformando a forma como pesquisadores produzem conhecimento. Até que ponto ferramentas automatizadas podem auxiliar sem comprometer a originalidade acadêmica?",
  image: "/banner.png",
};

export default function FeaturedTexts() {
  return (
    <div className="featured-texts-section">
      <header className="featured-texts__header">
        <p className="featured-texts__kicker">Texto para discussão</p>
        <h1>Fórum de Discussões Acadêmicas</h1>
        <p>
          Espaço destinado à troca de ideias, debates e divulgação de pesquisas
          desenvolvidas pelos integrantes do REGIIMENTO.
        </p>
      </header>
      <section className="featured-text" aria-labelledby="featured-text-title">
        <div className="featured-text__image-wrap">
          <img
            src={featuredText.image}
            alt="Pesquisadora trabalhando em uma pesquisa acadêmica"
            className="featured-text__image"
          />
        </div>
        <div className="featured-text__content">
          <span className="featured-text__badge">{featuredText.category}</span>
          <h2 id="featured-text-title">{featuredText.title}</h2>
          <p>{featuredText.description}</p>
          <button type="button" className="featured-text__button">
            Participar da discussão <span aria-hidden="true">-&gt;</span>
          </button>
        </div>
      </section>
    </div>
  );
}
