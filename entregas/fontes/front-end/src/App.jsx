import { useEffect, useState } from "react";
import NavigationBar from "./components/Navbar/NavigationBar";
import Banner from "./components/Banner/Banner";
import AboutUs from "./components/AboutUs/AboutUs";
import Calendar from "./components/Calendar/Calendar";
import Footer from "./components/Footer/Footer";
import Events from "./components/Events/Events";
import FeaturedEvents from "./components/FeaturedEvents/FeaturedEvents";
import Texts from "./components/Texts/Texts";
import FeaturedTexts from "./components/FeaturedTexts/FeaturedTexts";
import Members from "./components/Members/Members";
import { useApiList } from "./useApi";
import { mapEvento, mapPost } from "./mappers";
import { refresh } from "./api";

function HomePage() {
  return (
    <>
      <NavigationBar />
      <Banner />
      <AboutUs />
      <Calendar />
      <Footer />
    </>
  );
}

function EventsPage() {
  const { items: events, error } = useApiList("/eventos", mapEvento);
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const savedFavorites = JSON.parse(
        window.localStorage.getItem("favorite-events") || "[]",
      );
      return Array.isArray(savedFavorites)
        ? savedFavorites.map(String)
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem("favorite-events", JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const toggleFavorite = (eventId) => {
    setFavoriteIds((currentFavorites) =>
      currentFavorites.includes(eventId)
        ? currentFavorites.filter((favoriteId) => favoriteId !== eventId)
        : [...currentFavorites, eventId],
    );
  };
  const featuredEvents = events.filter((event) =>
    favoriteIds.includes(event.id),
  );

  return (
    <>
      <NavigationBar />
      <main>
        <FeaturedEvents events={featuredEvents} />
        {error && <p>Não foi possível carregar os eventos.</p>}
        <Events
          events={events}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />
      </main>
      <Footer />
    </>
  );
}

function MembersPage() {
  return (
    <>
      <NavigationBar />
      <Members />
      <Footer />
    </>
  );
}

function TextosParaDiscussaoPage() {
  const { items: texts, error } = useApiList("/posts", mapPost);
  return (
    <>
      <NavigationBar />
      <main>
        <FeaturedTexts featuredText={texts[0]} />
        {error && <p>Não foi possível carregar os textos.</p>}
        <Texts texts={texts} />
      </main>
      <Footer />
    </>
  );
}

function BibliotecaDigitalPage() {
  return (
    <>
      <NavigationBar />
      <Footer />
    </>
  );
}

function AuthCallbackPage() {
  // O back-end redireciona para cá depois do login com o Google. Troca o cookie
  // de refresh por um access token e volta para a página inicial.
  useEffect(() => {
    refresh().then(() => window.location.replace("/"));
  }, []);
  return <p>Entrando...</p>;
}

function App() {
  // referencias internas
  const currentPath = window.location.pathname;
  const isEventsPage = currentPath === "/eventos";
  const isMembersPage = currentPath === "/integrantes";
  const isTextosParaDiscussaoPage =
    currentPath === "/textos-para-discussao" || currentPath === "/publicacoes";
  const isBibliotecaDigitalPage = currentPath === "/biblioteca-digital";

  useEffect(() => {
    // redirecionando para a seção "sobre-nos" se o ID for "#sobre-nos"
    if (window.location.hash === "#sobre-nos") {
      requestAnimationFrame(() => {
        document.getElementById("sobre-nos")?.scrollIntoView();
      });
    }
  }, []);

  let page = <HomePage />;

  if (currentPath === "/auth/callback") {
    page = <AuthCallbackPage />;
  } else if (isEventsPage) {
    page = <EventsPage />;
  } else if (isMembersPage) {
    page = <MembersPage />;
  } else if (isTextosParaDiscussaoPage) {
    page = <TextosParaDiscussaoPage />;
  } else if (isBibliotecaDigitalPage) {
    page = <BibliotecaDigitalPage />;
  }

  return <div className="App">{page}</div>;
}

export default App;
