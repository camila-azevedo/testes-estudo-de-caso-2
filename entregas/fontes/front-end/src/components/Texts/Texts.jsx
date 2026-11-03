import { useState } from "react";
import ContentForm from "../ContentForm/ContentForm";
import "./Texts.css";

const textsPerPage = 6;

// canCreate/onCreate: botão "Novo texto" (só para integrantes).
// canDelete(text)/onDelete(text): botão "Excluir" em cada card (autor ou admin).
export default function Texts({
  texts,
  canCreate = false,
  onCreate,
  canDelete,
  onDelete,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const categories = [...new Set(texts.map((text) => text.category).filter(Boolean))];
  const textFields = [
    { name: "titulo", label: "Título", required: true, maxLength: 200 },
    { name: "conteudo", label: "Texto", type: "textarea", required: true },
    {
      name: "tipo",
      label: "Categoria",
      required: true,
      maxLength: 100,
      suggestions: categories,
    },
    { name: "imagem", label: "URL da imagem (opcional)", type: "url", maxLength: 500 },
  ];
  const pageCount = Math.max(1, Math.ceil(texts.length / textsPerPage));
  const visibleTexts = texts.slice(
    currentPage * textsPerPage,
    (currentPage + 1) * textsPerPage,
  );

  return (
    <section className="texts-list" aria-label="Textos para discussão">
      {canCreate && (
        <div className="content-toolbar">
          <button
            type="button"
            className="memberActionButton"
            onClick={() => setFormOpen(true)}
          >
            Novo texto
          </button>
        </div>
      )}
      {formOpen && (
        <ContentForm
          kicker="NOVO TEXTO"
          title="Publicar texto para discussão"
          fields={textFields}
          submitLabel="Publicar"
          onSubmit={onCreate}
          onClose={() => setFormOpen(false)}
        />
      )}
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
              {canDelete?.(text) && (
                <button
                  type="button"
                  className="content-delete"
                  onClick={() => onDelete(text)}
                >
                  Excluir
                </button>
              )}
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
