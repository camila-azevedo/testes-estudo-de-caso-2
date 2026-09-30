import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Estilo padrão da biblioteca
import "./Calendar.css";

export default function MyCalendar() {
  const [value, setValue] = useState(new Date());

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
          <button className="calendar-action" type="button">
            <span aria-hidden="true">+</span> Novo evento
          </button>
          <button className="calendar-action" type="button">
            <span aria-hidden="true">☷</span> Ver eventos
          </button>
        </div>
        <div className="calendar-container">
          <Calendar locale="pt-BR" onChange={setValue} value={value} />
        </div>
      </div>
    </section>
  );
}
