import { useState } from "react";
import "./Events.css";

export const events = [
  {
    date: "18 MAR",
    title: "Encontro de boas-vindas",
    description:
      "Conheca o REGIIMENTO, seus projetos e as pessoas que fazem parte do grupo.",
    type: "Integracao",
    time: "18h30",
    location: "Sala de reunioes da FCI",
  },
  {
    date: "25 MAR",
    title: "Roda de conversa: informacao e sociedade",
    description:
      "Um encontro aberto para trocar ideias sobre os caminhos da informacao na universidade.",
    type: "Debate",
    time: "19h",
    location: "Auditorio da BCE",
  },
  {
    date: "02 ABR",
    title: "Oficina de pesquisa academica",
    description:
      "Aprenda a organizar uma pesquisa e encontre novas ferramentas para seus estudos.",
    type: "Oficina",
    time: "14h",
    location: "Laboratorio 2 da FCI",
  },
  {
    date: "09 ABR",
    title: "Encontro sobre informação e cidadania",
    description:
      "Uma conversa sobre o papel da informação na participação social e na vida universitária.",
    type: "Debate",
    time: "18h30",
    location: "Sala de reuniões da FCI",
  },
  {
    date: "16 ABR",
    title: "Oficina de organização de arquivos",
    description:
      "Conheça métodos práticos para organizar arquivos pessoais e institucionais.",
    type: "Oficina",
    time: "14h",
    location: "Laboratório 2 da FCI",
  },
  {
    date: "23 ABR",
    title: "Café com pesquisadores",
    description:
      "Um encontro para compartilhar experiências, projetos e oportunidades de pesquisa.",
    type: "Integração",
    time: "16h",
    location: "Espaço de convivência da FCI",
  },
  {
    date: "30 ABR",
    title: "Introdução à pesquisa acadêmica",
    description:
      "Aprenda a definir um tema, formular perguntas e dar os primeiros passos em uma pesquisa.",
    type: "Formação",
    time: "19h",
    location: "Auditório da BCE",
  },
  {
    date: "07 MAI",
    title: "Roda de conversa sobre ciência aberta",
    description:
      "Debate sobre colaboração, transparência e compartilhamento na produção científica.",
    type: "Debate",
    time: "18h30",
    location: "Auditório da BCE",
  },
  {
    date: "14 MAI",
    title: "Visita guiada à Biblioteca Central",
    description:
      "Conheça os espaços, serviços e recursos disponíveis para apoiar seus estudos.",
    type: "Visita",
    time: "10h",
    location: "Entrada Leste da BCE",
  },
  {
    date: "21 MAI",
    title: "Laboratório de ferramentas digitais",
    description:
      "Explore ferramentas digitais para organizar referências, dados e projetos acadêmicos.",
    type: "Laboratório",
    time: "14h",
    location: "Laboratório 2 da FCI",
  },
  {
    date: "28 MAI",
    title: "Seminário de experiências de pesquisa",
    description:
      "Integrantes compartilham seus percursos, descobertas e desafios na universidade.",
    type: "Seminário",
    time: "18h30",
    location: "Auditório da FCI",
  },
  {
    date: "04 JUN",
    title: "Encontro de planejamento do REGIIMENTO",
    description:
      "Participe da construção das próximas ações, projetos e atividades do grupo.",
    type: "Planejamento",
    time: "17h",
    location: "Sala de reuniões da FCI",
  },
];

const eventsPerPage = 6;

export default function Events({ favoriteIds, onToggleFavorite }) {
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = Math.ceil(events.length / eventsPerPage);
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

      <div className="event-cards">
        {visibleEvents.map((event) => (
          <article className="event-card" key={event.title}>
            <button
              type="button"
              className="event-card__favorite"
              aria-label={`${favoriteIds.includes(event.title) ? "Remover dos" : "Adicionar aos"} favoritos: ${event.title}`}
              aria-pressed={favoriteIds.includes(event.title)}
              onClick={() => onToggleFavorite(event.title)}
            >
              {favoriteIds.includes(event.title) ? "★" : "☆"}
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
                <span>{event.location}</span>
              </div>
              <button type="button" className="event-card__link">
                Ver detalhes <span aria-hidden="true">-&gt;</span>
              </button>
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
