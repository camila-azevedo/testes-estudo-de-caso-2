import { useEffect, useState } from "react";
import ContentForm from "../ContentForm/ContentForm";
import { getEventCountdown } from "./countdown";
import {
  formatEventDate,
  getEventYear,
  sortEventsByDate,
} from "../../eventUtils";
import "./Events.css";

const eventsPerPage = 6;

const eventFields = [
  { name: "title", label: "Nome do evento", required: true, maxLength: 255 },
  { name: "description", label: "Descrição", type: "textarea", required: true },
  { name: "date", label: "Data do evento", type: "date", required: true },
  { name: "time", label: "Horário do evento", type: "time", required: true },
  { name: "capacity", label: "Capacidade do evento", suffix: "pessoas" },
  {
    name: "link",
    label: "Link do evento (opcional)",
    type: "url",
    maxLength: 500,
  },
  {
    name: "image",
    label: "Imagem do evento (opcional, até 2 MB)",
    type: "file",
    accept: "image/*",
    maxFileSize: 2 * 1024 * 1024,
  },
  {
    name: "destaque",
    label: "Exibir em eventos em destaque",
    type: "checkbox",
  },
];

export default function Events({
  events,
  localEvents,
  onCreate,
  onUpdate,
  favoriteIds,
  onToggleFavorite,
  canDelete,
  onDelete,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (window.location.hash === "#novo") setFormOpen(true);
  }, []);

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timerId);
  }, []);

  const saveEvent = (values) => {
    const eventDate = new Date(`${values.date}T${values.time}`);
    if (!values.title.trim()) throw new Error("Informe o nome do evento.");
    if (
      Number.isNaN(eventDate.getTime()) ||
      eventDate.getTime() <= Date.now()
    ) {
      throw new Error("Escolha uma data e hora futuras para o evento.");
    }

    const newEvent = {
      ...editingEvent,
      id: editingEvent?.id || `local-${Date.now()}`,
      title: values.title.trim(),
      description: values.description.trim(),
      capacity: values.capacity.trim(),
      link: values.link.trim(),
      image: values.image || editingEvent?.image || "",
      destaque: values.destaque,
      dateTime: eventDate.toISOString(),
      date: `${String(eventDate.getDate()).padStart(2, "0")} ${eventDate.toLocaleString("pt-BR", { month: "short" }).replace(".", "").toUpperCase()}`,
      dateLong: formatEventDate(eventDate),
      year: eventDate.getFullYear(),
      time: eventDate.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: values.destaque ? "Destaque" : "Evento",
    };
    if (editingEvent) onUpdate(newEvent);
    else onCreate(newEvent);
    setCurrentPage(0);
  };

  const openEditForm = (event) => {
    setEditingEvent(event);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingEvent(null);
  };

  const editingDate = editingEvent ? new Date(editingEvent.dateTime) : null;
  const initialValues = editingEvent
    ? {
        title: editingEvent.title,
        description: editingEvent.description,
        date: `${editingDate.getFullYear()}-${String(editingDate.getMonth() + 1).padStart(2, "0")}-${String(editingDate.getDate()).padStart(2, "0")}`,
        time: `${String(editingDate.getHours()).padStart(2, "0")}:${String(editingDate.getMinutes()).padStart(2, "0")}`,
        capacity: editingEvent.capacity || "",
        link: editingEvent.link || "",
        destaque: Boolean(editingEvent.destaque),
      }
    : undefined;

  const allEvents = sortEventsByDate([...localEvents, ...events]);
  const pageCount = Math.max(1, Math.ceil(allEvents.length / eventsPerPage));
  const visibleEvents = allEvents.slice(
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

      <div className="content-toolbar">
        <button
          type="button"
          className="memberActionButton"
          onClick={() => {
            setEditingEvent(null);
            setFormOpen(true);
          }}
        >
          Cadastrar evento
        </button>
      </div>
      {formOpen && (
        <ContentForm
          kicker={editingEvent ? "EDITAR EVENTO" : "NOVO EVENTO"}
          title={editingEvent ? "Editar evento" : "Cadastrar evento"}
          fields={eventFields}
          initialValues={initialValues}
          submitLabel={editingEvent ? "Salvar alterações" : "Salvar evento"}
          onSubmit={saveEvent}
          onClose={closeForm}
        />
      )}

      {allEvents.length === 0 && (
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
              <small>{event.year || getEventYear(event.dateTime)}</small>
            </div>
            <div className="event-card__content">
              {event.image && (
                <img className="event-card__image" src={event.image} alt="" />
              )}
              <span className="event-card__type">{event.type}</span>
              <h2>{event.title}</h2>
              <p>{event.description}</p>
              <div className="event-card__meta">
                <span>{event.time}</span>
                {event.capacity && (
                  <span>Capacidade: {event.capacity} pessoas</span>
                )}
              </div>
              {event.dateTime && (
                <p className="event-card__countdown">
                  {getEventCountdown(event.dateTime, now)}
                </p>
              )}
              {event.link && (
                <a
                  className="event-card__link"
                  href={event.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver evento no site
                </a>
              )}
              {localEvents.some((localEvent) => localEvent.id === event.id) && (
                <button
                  type="button"
                  className="event-card__edit"
                  aria-label={`Editar evento: ${event.title}`}
                  title="Editar evento"
                  onClick={() => openEditForm(event)}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m16 4 4 4M4 20l4-.8L19.2 8a2.1 2.1 0 0 0-3-3L5 16.2 4 20Z" />
                  </svg>
                </button>
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
