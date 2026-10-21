import { useState } from "react";
import "./Texts.css";

const textsPerPage = 6;

export default function Texts({ texts }) {
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(texts.length / textsPerPage));
  const visibleTexts = texts.slice(
    currentPage * textsPerPage,
    (currentPage + 1) * textsPerPage,
  );

  return (
    <section className="texts-list" aria-label="Textos para discussão">
      {texts.length === 0 && <p>Nenhum texto publicado ainda.</p>}
      <div className="text-cards">
        {visibleTexts.map((text) => (
          <article className="text-card" key={text.id}>
            <img
              src={text.image}
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
