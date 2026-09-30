import { useState } from "react";
import "./Texts.css";

const texts = [
  {
    category: "Texto para discussão",
    title: "A influência da IA na pesquisa acadêmica",
    description:
      "A inteligência artificial vem transformando a forma como pesquisadores produzem conhecimento.",
    author: "Ana Clara",
    date: "28 Mai 2026",
    comments: 2,
    imagePosition: "center",
  },
  {
    category: "Discussão acadêmica",
    title: "Universidade e inclusão digital",
    description:
      "As universidades brasileiras estão preparadas para garantir inclusão digital plena aos estudantes de baixa renda?",
    author: "Marina Oliveira",
    date: "30 Mai 2026",
    comments: 1,
    imagePosition: "right",
  },
  {
    category: "Fórum",
    title: "Ciência e redes sociais",
    description:
      "As redes sociais aproximaram a ciência da população ou aumentaram a desinformação?",
    author: "João Pedro Silva",
    date: "15 Mai 2026",
    comments: 4,
    imagePosition: "left",
  },
  {
    category: "Pesquisa",
    title: "Arquivamento digital em universidades",
    description:
      "Como garantir a preservação de documentos digitais universitários ao longo das décadas?",
    author: "Laura Mendes",
    date: "09 Mai 2026",
    comments: 3,
    imagePosition: "bottom",
  },
  {
    category: "Discussão",
    title: "IA e a produção científica",
    description:
      "Ferramentas de IA generativa podem acelerar pesquisas acadêmicas sem comprometer a qualidade científica?",
    author: "Rafael Costa",
    date: "02 Mai 2026",
    comments: 5,
    imagePosition: "top",
  },
  {
    category: "Fórum",
    title: "Desinformação científica na internet",
    description:
      "Como universidades e pesquisadores podem combater a desinformação nas redes sociais?",
    author: "Beatriz Alves",
    date: "26 Abr 2026",
    comments: 2,
    imagePosition: "center",
  },
  {
    category: "Pesquisa",
    title: "Acesso aberto ao conhecimento",
    description:
      "Os caminhos para ampliar o acesso de estudantes e pesquisadores à produção científica.",
    author: "Camila Rocha",
    date: "18 Abr 2026",
    comments: 3,
    imagePosition: "right",
  },
  {
    category: "Texto para discussão",
    title: "Preservação da memória institucional",
    description:
      "Arquivos universitários como instrumentos de preservação da memória e da história.",
    author: "Lucas Martins",
    date: "12 Abr 2026",
    comments: 1,
    imagePosition: "left",
  },
  {
    category: "Discussão acadêmica",
    title: "Dados e decisões na universidade",
    description:
      "Como o uso responsável de dados pode melhorar a gestão e a experiência acadêmica.",
    author: "Sofia Almeida",
    date: "05 Abr 2026",
    comments: 2,
    imagePosition: "top",
  },
  {
    category: "Fórum",
    title: "A biblioteca no ensino híbrido",
    description:
      "Novos serviços e possibilidades para bibliotecas em ambientes de aprendizagem híbridos.",
    author: "Pedro Henrique",
    date: "28 Mar 2026",
    comments: 4,
    imagePosition: "bottom",
  },
  {
    category: "Pesquisa",
    title: "Ética na produção de conhecimento",
    description:
      "Princípios éticos para fortalecer a pesquisa acadêmica e a confiança na ciência.",
    author: "Isabela Nunes",
    date: "20 Mar 2026",
    comments: 2,
    imagePosition: "center",
  },
  {
    category: "Texto para discussão",
    title: "Competência informacional e cidadania",
    description:
      "A importância de saber buscar, avaliar e usar informações no cotidiano e na universidade.",
    author: "Gabriel Souza",
    date: "14 Mar 2026",
    comments: 3,
    imagePosition: "right",
  },
];

const textsPerPage = 6;

export default function Texts() {
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = Math.ceil(texts.length / textsPerPage);
  const visibleTexts = texts.slice(
    currentPage * textsPerPage,
    (currentPage + 1) * textsPerPage,
  );

  return (
    <section className="texts-list" aria-label="Textos para discussão">
      <div className="text-cards">
        {visibleTexts.map((text) => (
          <article className="text-card" key={text.title}>
            <img
              src="/banner.png"
              alt=""
              className={`text-card__image text-card__image--${text.imagePosition}`}
            />
            <div className="text-card__content">
              <span className="text-card__category">{text.category}</span>
              <h2>{text.title}</h2>
              <p>{text.description}</p>
              <div className="text-card__meta">
                <span className="text-card__author">{text.author}</span>
                <span>{text.date}</span>
                <span aria-label={`${text.comments} comentários`}>
                  {text.comments}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <nav className="texts-pagination" aria-label="Páginas de textos">
        <button
          type="button"
          className="texts-pagination__arrow"
          aria-label="Página anterior"
          disabled={currentPage === 0}
          onClick={() => setCurrentPage((page) => page - 1)}
        >
          &lt;
        </button>
        <span>
          Página {currentPage + 1} de {pageCount}
        </span>
        <button
          type="button"
          className="texts-pagination__arrow"
          aria-label="Próxima página"
          disabled={currentPage === pageCount - 1}
          onClick={() => setCurrentPage((page) => page + 1)}
        >
          &gt;
        </button>
      </nav>
    </section>
  );
}
