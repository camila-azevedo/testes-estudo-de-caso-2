import "./FeaturedEvents.css";

export default function FeaturedEvents() {
  return (
    <section className="featured-event" aria-labelledby="featured-event-title">
      <div className="featured-event__copy">
        <p className="section-kicker section-kicker--light">Eventos em destaque</p>
        <h2 id="featured-event-title">XI Congresso Nacional de Arquivologia</h2>
        <p>
          Descubra e explore o universo dos arquivos e da arquivologia na
          fascinante e exuberante cidade de Manaus, no coração do Amazonas!
          Conhecida por sua rica biodiversidade e pelo encontro das águas,
          Manaus tem uma cultura vibrante e envolvente.
        </p>
        <div className="featured-event__details">
          <span>26 a 30 de outubro</span>
          <span>Manaus Plaza Centro de Convenções</span>
        </div>
        <button type="button" className="featured-event__button">
          Quero participar <span aria-hidden="true">-&gt;</span>
        </button>
      </div>
      <div className="featured-event__visual" aria-hidden="true">
        <span className="featured-event__number">CNA </span>
        <span className="featured-event__label">XI edição</span>
        <span className="featured-event__line" />
      </div>
    </section>
  );
}
