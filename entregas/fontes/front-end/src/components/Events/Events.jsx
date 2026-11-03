import { useEffect, useState } from "react";
import ContentForm from "../ContentForm/ContentForm";
import "./Events.css";

const eventsPerPage = 6;

const eventFields = [
  { name: "nomeEvento", label: "Nome do evento", required: true, maxLength: 255 },
  { name: "descricao", label: "Descrição", type: "textarea" },
  { name: "dataEvento", label: "Data e hora", type: "datetime-local", required: true },
  { name: "linkAcesso", label: "Link do evento (opcional)", type: "url", maxLength: 500 },
  { name: "destaque", label: "Marcar como destaque", type: "checkbox" },
];

// canCreate/onCreate: botão "Novo evento" (só para integrantes).
// canDelete(event)/onDelete(event): botão "Excluir" em cada card (autor ou admin).
export default function Events({
  events,
  favoriteIds,
  onToggleFavorite,
  canCreate = false,
  onCreate,
  canDelete,
  onDelete,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [formOpen, setFormOpen] = useState(false);

  // O botão "Novo evento" do calendário da home leva para /eventos#novo.
  useEffect(() => {
    if (canCreate && window.location.hash === "#novo") setFormOpen(true);
  }, [canCreate]);

  const pageCount = Math.max(1, Math.ceil(events.length / eventsPerPage));
  const visibleEvents = events.slice(
    currentPage * eventsPerPage,
    (currentPage + 1) * eventsPerPage,
  );

  return (
    <section className="events-list" aria-labelledby="events-title">
      <div className="events-list__header">
        <div>
          <p className="section-kicker">Agenda do REGIIMENTO</p>
          <h1 id="events-title">Eventos</h1>
        </div>
        <p className="events-list__intro">
          Encontros para aprender, conversar e construir novas ideias juntos.
        </p>
      </div>

      {canCreate && (
        <div className="content-toolbar">
          <button
            type="button"
            className="memberActionButton"
            onClick={() => setFormOpen(true)}
          >
            Novo evento
          </button>
        </div>
      )}
      {formOpen && (
        <ContentForm
          kicker="NOVO EVENTO"
          title="Cadastrar evento"
          fields={eventFields}
          submitLabel="Salvar evento"
          onSubmit={onCreate}
          onClose={() => setFormOpen(false)}
        />
      )}

      {events.length === 0 && (
        <p className="events-list__intro">Nenhum evento cadastrado.</p>
      )}
      <div className="event-cards">
        {visibleEvents.map((event) => (
          <article className="event-card" key={event.id}>
            <button
              type="button"
              className="event-card__favorite"
              aria-label={`${favoriteIds.includes(event.id) ? "Remover dos" : "Adicionar aos"} favoritos: ${event.title}`}
              aria-pressed={favoriteIds.includes(event.id)}
              onClick={() => onToggleFavorite(event.id)}
            >
              {favoriteIds.includes(event.id) ? "★" : "☆"}
            </button>
            <div
              className="event-card__date"
              aria-label={`Data: ${event.date}`}
            >
              <strong>{event.date.split(" ")[0]}</strong>
              <span>{event.date.split(" ")[1]}</span>
            </div>
            <div className="event-card__content">
              <span className="event-card__type">{event.type}</span>
              <h2>{event.title}</h2>
              <p>{event.description}</p>
              <div className="event-card__meta">
                <span>{event.time}</span>
              </div>
              {event.link && (
                <a
                  className="event-card__link"
                  href={event.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver detalhes <span aria-hidden="true">-&gt;</span>
                </a>
              )}
              {canDelete?.(event) && (
                <button
                  type="button"
                  className="content-delete"
                  onClick={() => onDelete(event)}
                >
                  Excluir
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      <nav className="events-pagination" aria-label="Páginas de eventos">
        <button
          type="button"
          className="events-pagination__arrow"
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
          className="events-pagination__arrow"
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
