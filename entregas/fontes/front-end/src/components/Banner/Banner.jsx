import { useState, useEffect } from "react";
import "./Banner.css";

const Banner = () => {
  const announcements = [
    "📢 Bem-vindo ao R.E.G.I.I.M.E.N.T.O - Research Expert Group",
    "🎓 Conteúdo acadêmico de qualidade disponível",
    "👥 Conecte-se com outros pesquisadores e aprendizes",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? announcements.length - 1 : prev - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  return (
    <section className="banner">
      <div className="carouselContainer">
        <button className="carouselButton prev" onClick={goToPrevious}>
          ❮
        </button>
        <div className="announcementBanner">
          <span className="announcementText">
            {announcements[currentIndex]}
          </span>
        </div>
        <button className="carouselButton next" onClick={goToNext}>
          ❯
        </button>
      </div>
      <img
        src="banner.png"
        alt="Banner R.E.G.I.I.M.E.N.T.O"
        className="bannerImage"
      />
    </section>
  );
};

export default Banner;
