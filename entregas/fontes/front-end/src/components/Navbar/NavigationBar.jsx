import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { useAuth } from "../../authContext";

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, login, logout } = useAuth();

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (!isLoginOpen) return undefined;

    const closeWithEscape = (event) => {
      if (event.key === "Escape") setIsLoginOpen(false);
    };

    document.addEventListener("keydown", closeWithEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", closeWithEscape);
      document.body.style.overflow = "";
    };
  }, [isLoginOpen]);

  return (
    <nav className={styles.navbar}>
      <a href="/" className={styles.logo}>
        <img
          src="/regiimento.png"
          alt="REGIIMENTO"
          className={styles.logoImg}
        />
        <span className={styles.logoText}>R.E.G.I.I.M.E.N.T.O</span>
      </a>
      <button
        type="button"
        className={styles.menuToggle}
        aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={isMenuOpen}
        aria-controls="main-navigation"
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
      >
        <span />
        <span />
        <span />
      </button>
      <div
        id="main-navigation"
        className={`${styles.navigationContent} ${
          isMenuOpen ? styles.navigationContentOpen : ""
        }`}
      >
        <ul className={styles.navLinks}>
          <li>
            <a href="/#sobre-nos" onClick={closeMenu}>
              Sobre Nós
            </a>
          </li>
          <li>
            <a href="/integrantes" onClick={closeMenu}>
              Integrantes
            </a>
          </li>
          <li>
            <a href="/eventos" onClick={closeMenu}>
              Eventos
            </a>
          </li>
          <li>
            <a
              href="/conteudo"
              className={styles.dropdownTrigger}
              aria-haspopup="true"
            >
              Conteúdo Acadêmico
            </a>
            <ul className={styles.dropdownMenu}>
              <li>
                <a href="/textos-para-discussao" onClick={closeMenu}>
                  Textos para Discussão
                </a>
              </li>
              {/* Abas temporariamente ocultas até o conteúdo estar disponível.
              <li>
                <a href="/biblioteca-digital" onClick={closeMenu}>
                  Biblioteca Digital
                </a>
              </li>
              <li>
                <a href="/linhas-de-pesquisa" onClick={closeMenu}>
                  Linhas de Pesquisa
                </a>
              </li>
              */}
            </ul>
          </li>
        </ul>
        <div className={styles.navButtons}>
          {user ? (
            <button
              type="button"
              className={styles.loginBtn}
              title={user.email}
              onClick={logout}
            >
              Sair
            </button>
          ) : (
            <button
              type="button"
              className={styles.loginBtn}
              onClick={() => setIsLoginOpen(true)}
            >
              Área do Interessado
            </button>
          )}
        </div>
      </div>

      {isLoginOpen && (
        <div
          className={styles.loginModalBackdrop}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsLoginOpen(false);
          }}
        >
          <section
            className={styles.loginModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
          >
            <button
              type="button"
              className={styles.loginModalClose}
              aria-label="Fechar login"
              onClick={() => setIsLoginOpen(false)}
            >
              ×
            </button>
            <h2 id="login-modal-title">Área do Interessado</h2>
            <button
              type="button"
              className={styles.googleLoginBtn}
              onClick={login}
            >
              <span aria-hidden="true">G</span>
              Fazer login com Google
            </button>
          </section>
        </div>
      )}
    </nav>
  );
};
export default NavigationBar;
