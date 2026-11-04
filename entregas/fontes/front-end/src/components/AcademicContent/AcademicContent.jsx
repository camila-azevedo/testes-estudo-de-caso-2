import { useApiList } from "../../useApi";
import { mapPublicacao } from "../../mappers";
import "./AcademicContent.css";

const sections = [
  {
    title: "Textos para Discussão",
    description:
      "Leituras e debates sobre temas relevantes para a comunidade acadêmica.",
    href: "/textos-para-discussao",
    action: "Acessar textos",
  },
  {
    title: "Biblioteca Digital",
    description:
      "Acesse a biblioteca digital e acompanhe a organização do acervo.",
    href: "/biblioteca-digital",
    action: "Acessar biblioteca",
  },
  {
    title: "Linhas de Pesquisa",
    description:
      "Conheça os temas e as áreas de estudo desenvolvidos pelo grupo.",
    href: "/linhas-de-pesquisa",
    action: "Acessar linhas de pesquisa",
  },
];

export default function AcademicContent() {
  return (
    <main className="academic-content-page">
      <section className="academic-content__intro">
        <p className="academic-content__kicker">R.E.G.I.I.M.E.N.T.O.</p>
        <h1>Conteúdo Acadêmico</h1>
        <p>
          Avisos, publicações e espaços para conhecer e compartilhar
          conhecimento.
        </p>
      </section>
      <aside
        className="academic-content__notice"
        aria-labelledby="academic-content-notice-title"
      >
        <div className="academic-content__notice-heading">
          <span className="academic-content__notice-icon" aria-hidden="true">
            !
          </span>
          <div>
            <p className="academic-content__kicker">Fique por dentro</p>
            <h2 id="academic-content-notice-title">Avisos principais</h2>
          </div>
        </div>
        <div className="academic-content__notice-body">
          <p>
            <strong>Dia da Consciência Negra — 20/11</strong>
            <span>
              Não haverá aula nem quaisquer outras atividades acadêmicas na UnB.
            </span>
          </p>
          <p>
            <strong>Pós-graduação na FCI</strong>
            <span>
              Estão abertas as inscrições para a pós-graduação na FCI.
            </span>
          </p>
        </div>
      </aside>
      <section className="academic-content__explore">
        <p className="academic-content__kicker">Explore o conteúdo</p>
        <h2>Acesse nossos espaços acadêmicos</h2>
        <p>Escolha uma das áreas do nosso conteúdo acadêmico.</p>
      </section>
      <section
        className="academic-content__grid"
        aria-label="Seções acadêmicas"
      >
        {sections.map((section) => (
          <article className="academic-content__card" key={section.href}>
            <h2>{section.title}</h2>
            <p>{section.description}</p>
            <a href={section.href}>
              {section.action} <span aria-hidden="true">-&gt;</span>
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}

export function AcademicPublications() {
  const {
    items: publications,
    loading,
    error,
  } = useApiList("/publicacoes", mapPublicacao);

  return (
    <main className="academic-content-page">
      <section className="academic-content__intro">
        <p className="academic-content__kicker">Conteúdo acadêmico</p>
        <h1>Linhas de Pesquisa</h1>
        <p>
          Conheça os temas de estudo e as publicações desenvolvidas pelos
          integrantes do REGIIMENTO.
        </p>
      </section>
      {loading && (
        <p className="academic-content__message">Carregando publicações...</p>
      )}
      {error && (
        <p className="academic-content__message" role="alert">
          Não foi possível carregar as publicações. Tente novamente mais tarde.
        </p>
      )}
      {!loading && !error && publications.length === 0 && (
        <p className="academic-content__message">
          Nenhuma publicação cadastrada ainda.
        </p>
      )}
      {publications.length > 0 && (
        <section
          className="academic-content__grid"
          aria-label="Publicações acadêmicas"
        >
          {publications.map((publication) => (
            <article className="academic-content__card" key={publication.id}>
              <p className="academic-content__publication-type">
                {publication.type}
              </p>
              <h2>{publication.title}</h2>
              {publication.summary && <p>{publication.summary}</p>}
              <div className="academic-content__meta">
                {publication.authors.length > 0 && (
                  <span>{publication.authors.join(", ")}</span>
                )}
                {publication.date && <span>{publication.date}</span>}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
