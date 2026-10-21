import { useState } from "react";
import "./Events.css";

const eventsPerPage = 6;

export default function Events({ events, favoriteIds, onToggleFavorite }) {
  const [currentPage, setCurrentPage] = useState(0);
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
