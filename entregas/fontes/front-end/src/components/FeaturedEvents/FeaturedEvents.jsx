import { useEffect, useState } from "react";
import { formatEventDate } from "../../eventUtils";
import { getEventCountdown } from "../Events/countdown";
import "./FeaturedEvents.css";

export default function FeaturedEvents({ events }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [now, setNow] = useState(Date.now());
  const activeIndex = events.length ? currentIndex % events.length : 0;
  const activeEvent = events[activeIndex];
  const dateParts = getDateParts(activeEvent);

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timerId);
  }, []);

  return (
    <section className="featured-event" aria-label="Eventos em destaque">
      <div className="featured-event__copy">
        <p className="section-kicker section-kicker--light">Eventos em destaque</p>
        {activeEvent ? (
          <article className="featured-event__item" key={activeEvent.id}>
            <p className="featured-event__item-meta">
              {activeEvent.dateLong ||
                formatEventDate(activeEvent.dateTime) ||
                activeEvent.date}{" "}
              · {activeEvent.type}
            </p>
            <h2>{activeEvent.title}</h2>
            <p className="featured-event__item-description">
              {activeEvent.description}
            </p>
            <div className="featured-event__details">
              <span>{activeEvent.time}</span>
            </div>
            {activeEvent.dateTime && (
              <p className="featured-event__countdown">
                {getEventCountdown(activeEvent.dateTime, now)}
              </p>
            )}
            {events.length > 1 && (
              <nav className="featured-event__navigation" aria-label="Eventos favoritados">
                <button
                  type="button"
                  className="featured-event__arrow"
                  aria-label="Evento anterior"
                  onClick={() =>
                    setCurrentIndex((index) => (index - 1 + events.length) % events.length)
                  }
                >
                  &lt;
                </button>
                <div className="featured-event__indicators">
                  {events.map((event, index) => (
                    <button
                      type="button"
                      key={event.id}
                      className="featured-event__indicator"
                      aria-label={`Mostrar evento ${index + 1}: ${event.title}`}
                      aria-current={index === activeIndex ? "true" : undefined}
                      onClick={() => setCurrentIndex(index)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="featured-event__arrow"
                  aria-label="Próximo evento"
                  onClick={() => setCurrentIndex((index) => (index + 1) % events.length)}
                >
                  &gt;
                </button>
              </nav>
            )}
            {events.length === 1 && (
              <nav className="featured-event__navigation" aria-label="Eventos favoritados">
                <div className="featured-event__indicators">
                  <button
                    type="button"
                    className="featured-event__indicator"
                    aria-label={`Mostrar evento 1: ${activeEvent.title}`}
                    aria-current="true"
                  />
                </div>
              </nav>
            )}
          </article>
        ) : (
          <p className="featured-event__empty">
            Nenhum evento em destaque.
          </p>
        )}
      </div>
      <div className="featured-event__visual" aria-hidden="true">
        {activeEvent?.image ? (
          <img className="featured-event__image" src={activeEvent.image} alt="" />
        ) : (
          <div className="featured-event__date">
            {dateParts ? (
              <>
                <span className="featured-event__date-day">{dateParts.day}</span>
                <span className="featured-event__date-details">
                  <span>{dateParts.month}</span>
                  <span>{dateParts.year}</span>
                </span>
              </>
            ) : (
              <span className="featured-event__date-empty">Agenda</span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function getDateParts(event) {
  if (!event) return null;

  const date = event.dateTime ? new Date(event.dateTime) : null;
  if (!date || Number.isNaN(date.getTime())) return null;

  const parts = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).formatToParts(date);
  return {
    day: parts.find((part) => part.type === "day")?.value,
    month: parts.find((part) => part.type === "month")?.value,
    year: parts.find((part) => part.type === "year")?.value,
  };
}
