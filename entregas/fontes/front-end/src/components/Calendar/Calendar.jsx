import { useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Estilo padrão da biblioteca
import { useAuth } from "../../authContext";
import { mapEvento } from "../../mappers";
import { useApiList } from "../../useApi";
import "./Calendar.css";

// Mesmo mapeamento da página de eventos, guardando também a data real para marcar o calendário.
const mapEventoComData = (e) => ({ ...mapEvento(e), data: new Date(e.dataEvento) });

// Chave "ano-mês-dia" no fuso local, para comparar dias sem se preocupar com horário.
const chaveDoDia = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

export default function MyCalendar() {
  const [value, setValue] = useState(new Date());
  const { user } = useAuth();
  const { items: events, error } = useApiList("/eventos", mapEventoComData);

  // Eventos agrupados por dia: { "2026-9-28": [evento, ...] }
  const eventsByDay = useMemo(() => {
    const grupos = {};
    for (const event of events) {
      if (Number.isNaN(event.data.getTime())) continue;
      (grupos[chaveDoDia(event.data)] ||= []).push(event);
    }
    for (const lista of Object.values(grupos)) lista.sort((a, b) => a.data - b.data);
    return grupos;
  }, [events]);

  const selectedEvents = eventsByDay[chaveDoDia(value)] || [];

  return (
    <section className="events-section">
      <div className="events-introduction">
        <h2>
          Confira todos os
          <br />
          nossos eventos
        </h2>
        <p>
          Acesse abaixo todos os nossos eventos
          <br />e eventos sugeridos por nossos Integrantes
        </p>
        <a className="events-button" href="/eventos">
          Eventos
        </a>
      </div>

      <div className="calendar-area">
        <div className="calendar-actions">
          {user?.tipo === "INTEGRANTE" && (
            <a className="calendar-action" href="/eventos#novo">
              <span aria-hidden="true">+</span> Novo evento
            </a>
          )}
          <a className="calendar-action" href="/eventos">
            <span aria-hidden="true">☷</span> Ver eventos
          </a>
        </div>
        <div className="calendar-container">
          <Calendar
            locale="pt-BR"
            onChange={setValue}
            value={value}
            tileClassName={({ date, view }) =>
              view === "month" && eventsByDay[chaveDoDia(date)] ? "has-event" : null
            }
          />
        </div>

        <div className="calendar-day-events" aria-live="polite">
          {error ? (
            <p className="calendar-day-events__empty">
              Não foi possível carregar os eventos.
            </p>
          ) : selectedEvents.length === 0 ? (
            <p className="calendar-day-events__empty">Nenhum evento neste dia.</p>
          ) : (
            <ul>
              {selectedEvents.map((event) => (
                <li key={event.id}>
                  <span className="calendar-day-events__time">{event.time}</span>
                  <a href={event.link || "/eventos"} {...(event.link && { target: "_blank", rel: "noreferrer" })}>
                    {event.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
