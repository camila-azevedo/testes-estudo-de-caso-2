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
import { del, post, refresh } from "./api";
import { useAuth } from "./authContext";

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
  const { items: events, error, reload } = useApiList("/eventos", mapEvento);
  const { user } = useAuth();
  const isIntegrante = user?.tipo === "INTEGRANTE";
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
  // Em destaque: os marcados como "destaque" por quem cadastrou + os favoritos deste navegador.
  const featuredEvents = events.filter(
    (event) => event.destaque || favoriteIds.includes(event.id),
  );

  const createEvent = async (values) => {
    await post("/eventos", {
      nomeEvento: values.nomeEvento,
      descricao: values.descricao,
      dataEvento: values.dataEvento,
      linkAcesso: values.linkAcesso || undefined,
      destaque: values.destaque,
    });
    reload();
  };

  // Só o autor ou um admin pode excluir (o back-end também confere).
  const canDeleteEvent = (event) =>
    isIntegrante && (user.administrador || event.ownerId === user.id);

  const deleteEvent = async (event) => {
    if (!window.confirm(`Excluir o evento "${event.title}"?`)) return;
    try {
      await del(`/eventos/${event.id}`);
      reload();
    } catch (err) {
      window.alert(err.message || "Não foi possível excluir o evento.");
    }
  };

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
          canCreate={isIntegrante}
          onCreate={createEvent}
          canDelete={canDeleteEvent}
          onDelete={deleteEvent}
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
  const { items: texts, error, reload } = useApiList("/posts", mapPost);
  const { user } = useAuth();
  const isIntegrante = user?.tipo === "INTEGRANTE";

  // O post da API não tem título separado: a primeira linha do texto é o título.
  const createText = async (values) => {
    await post("/posts", {
      conteudoTexto: `${values.titulo.trim()}\n${values.conteudo.trim()}`,
      tipo: values.tipo,
      imagem: values.imagem || undefined,
    });
    reload();
  };

  const canDeleteText = (text) =>
    isIntegrante && (user.administrador || text.ownerId === user.id);

  const deleteText = async (text) => {
    if (!window.confirm(`Excluir o texto "${text.title}"?`)) return;
    try {
      await del(`/posts/${text.id}`);
      reload();
    } catch (err) {
      window.alert(err.message || "Não foi possível excluir o texto.");
    }
  };

  return (
    <>
      <NavigationBar />
      <main>
        <FeaturedTexts featuredText={texts[0]} />
        {error && <p>Não foi possível carregar os textos.</p>}
        <Texts
          texts={texts}
          canCreate={isIntegrante}
          onCreate={createText}
          canDelete={canDeleteText}
          onDelete={deleteText}
        />
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
