import { useEffect } from "react";
import NavigationBar from "./components/Navbar/NavigationBar";
import Banner from "./components/Banner/Banner";
import AboutUs from "./components/AboutUs/AboutUs";
import Calendar from "./components/Calendar/calendar";
import Footer from "./components/Footer/Footer";
import Events from "./components/Events/Events";
import FeaturedEvents from "./components/FeaturedEvents/FeaturedEvents";
import Texts from "./components/Texts/Texts";
import FeaturedTexts from "./components/FeaturedTexts/FeaturedTexts";
import Members from "./components/Members/Members";

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
  return (
    <>
      <NavigationBar />
      <main>
        <FeaturedEvents />
        <Events />
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
  return (
    <>
      <NavigationBar />
      <main>
        <FeaturedTexts />
        <Texts />
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

//   );
// }

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

  if (isEventsPage) {
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
