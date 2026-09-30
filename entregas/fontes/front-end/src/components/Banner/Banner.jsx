import { useState, useEffect } from "react";
import "./Banner.css";

const slides = [
  {
    eyebrow: "R.E.G.I.I.M.E.N.T.O.",
    title: "Pesquisa que conecta informação e sociedade",
    description:
      "Conheça o grupo de pesquisa e as iniciativas que aproximam conhecimento, tecnologia e participação social.",
  },
  {
    eyebrow: "CONHECIMENTO EM MOVIMENTO",
    title: "Ideias que ganham força em conjunto",
    description:
      "Um espaço de colaboração para pesquisadores, estudantes e pessoas interessadas em novas perspectivas.",
  },
  {
    eyebrow: "PESQUISA E PARTICIPAÇÃO",
    title: "Faça parte dessa conversa",
    description:
      "Acompanhe as atividades, os estudos e as discussões produzidas pela comunidade REGIIMENTO.",
  },
];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = slides[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((previousIndex) => (previousIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="banner" aria-label="Destaques do REGIIMENTO">
      <div className="carouselContainer">
        <div className="announcementBanner" aria-live="polite">
          <p className="bannerEyebrow">{currentSlide.eyebrow}</p>
          <h1 className="announcementTitle">{currentSlide.title}</h1>
          <p className="announcementText">{currentSlide.description}</p>
          <div className="carouselControls">
            <button
              type="button"
              className="carouselButton"
              aria-label="Destaque anterior"
              onClick={goToPrevious}
            >
              ←
            </button>
            <div
              className="carouselIndicators"
              aria-label="Selecionar destaque"
            >
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
        <div className="bannerMedia" aria-hidden="true" />
      </div>
    </section>
  );
};

export default Banner;
