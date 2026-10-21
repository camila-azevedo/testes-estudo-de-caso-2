import { useState } from "react";
import "./FeaturedEvents.css";

export default function FeaturedEvents({ events }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeIndex = events.length ? currentIndex % events.length : 0;
  const activeEvent = events[activeIndex];

  return (
    <section className="featured-event" aria-label="Eventos em destaque">
      <div className="featured-event__copy">
        <p className="section-kicker section-kicker--light">Eventos em destaque</p>
        {activeEvent ? (
          <article className="featured-event__item" key={activeEvent.title}>
            <p className="featured-event__item-meta">
              {activeEvent.date} · {activeEvent.type}
            </p>
            <h2>{activeEvent.title}</h2>
            <p className="featured-event__item-description">
              {activeEvent.description}
            </p>
            <div className="featured-event__details">
              <span>{activeEvent.time}</span>
              <span>{activeEvent.location}</span>
            </div>
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
                      key={event.title}
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
        <span className="featured-event__number">
          {String(activeIndex + 1).padStart(2, "0")}
        </span>
        <span className="featured-event__label">
          {events.length ? `de ${String(events.length).padStart(2, "0")}` : "favorito"}
        </span>
        <span className="featured-event__line" />
      </div>
    </section>
  );
}
