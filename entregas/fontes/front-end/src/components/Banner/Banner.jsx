import { useEffect, useState } from "react";
import "./Banner.css";

const slides = [
  {
    eyebrow: "R.E.G.I.I.M.E.N.T.O.",
    title: "Bem-vindo(a) ao Portal REGIIMENTO",
    description:
      "Página do grupo de pesquisa REGIIMENTO. Conheça nossas pesquisas, atividades e conteúdos acadêmicos.",
  },
  {
    eyebrow: "Comunicado",
    title: "Dia da Consciência Negra",
    description:
      "No dia 20/11, não haverá aula devido ao feriado da Consciência Negra.",
    image: "/banner2.png",
    imageAlt:
      "Comunicado ilustrado sobre o Dia Nacional da Consciência Negra em 20 de novembro.",
  },
  {
    eyebrow: "Novidades",
    title: "Agora nós temos avisos!",
    description: "Clique em Conteúdo Acadêmico para conferir.",
    href: "/conteudo",
    image: "/sino.png",
    imageAlt: "Ícone de sino para destacar os avisos do portal.",
  },
];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = slides[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((index) => (index + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((index) => (index === 0 ? slides.length - 1 : index - 1));
  };

  const goToNext = () => {
    setCurrentIndex((index) => (index + 1) % slides.length);
  };

  const announcement = (
    <div className="announcementBanner" aria-live="polite">
      <p className="bannerEyebrow">{currentSlide.eyebrow}</p>
      <h1 className="announcementTitle">{currentSlide.title}</h1>
      <p className="announcementText">{currentSlide.description}</p>
    </div>
  );
  const slideImage = currentSlide.image && (
    <img
      className="bannerNoticeImage"
      src={currentSlide.image}
      alt={currentSlide.imageAlt}
    />
  );

  return (
    <section className="banner" aria-label="Destaques do REGIIMENTO">
      <div
        className={`carouselContainer ${
          currentSlide.image ? "carouselContainer--notice" : ""
        } ${currentSlide.href ? "carouselContainer--cta" : ""}`}
      >
        {currentSlide.href ? (
          <a className="carouselSlideLink" href={currentSlide.href}>
            {announcement}
            {slideImage}
          </a>
        ) : (
          <>
            {announcement}
            {slideImage}
          </>
        )}
        <div className="carouselControls">
          <button
            type="button"
            className="carouselButton"
            aria-label="Destaque anterior"
            onClick={goToPrevious}
          >
            ←
          </button>
          <div className="carouselIndicators" aria-label="Selecionar destaque">
            {slides.map((slide, index) => (
              <button
                type="button"
                key={slide.title}
                className={`carouselIndicator ${
                  currentIndex === index ? "isActive" : ""
                }`}
                aria-label={`Ir para destaque ${index + 1}`}
                aria-current={currentIndex === index ? "true" : undefined}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
          <button
            type="button"
            className="carouselButton"
            aria-label="Próximo destaque"
            onClick={goToNext}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Banner;
