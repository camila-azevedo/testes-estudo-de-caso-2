import { useState } from "react";
import { post } from "../../api";
import { useAuth } from "../../auth";
import "./TextEditor.css";

export default function TextEditor() {
  const { user, loading } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const saveText = async (event) => {
    event.preventDefault();
    setError("");
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle || !trimmedContent) {
      setError("Preencha o título e o conteúdo do texto.");
      return;
    }

    try {
      await post("/posts", {
        conteudoTexto: `${trimmedTitle}\n\n${trimmedContent}`,
        tipo: "Texto para discussão",
      });
      setSaved(true);
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(
          { type: "post-created" },
          window.location.origin,
        );
      }
    } catch {
      setError("Não foi possível publicar o texto. Verifique sua permissão e tente novamente.");
    }
  };

  return (
    <main className="text-editor-page">
      <section className="text-editor" aria-labelledby="text-editor-title">
        <p className="text-editor__kicker">Texto para discussão</p>
        <h1 id="text-editor-title">Adicionar texto</h1>
        <p className="text-editor__intro">
          Informe o título e o conteúdo que serão publicados no fórum.
        </p>
        {loading ? (
          <p>Verificando acesso...</p>
        ) : !user?.administrador ? (
          <p role="alert">
            Entre com uma conta de integrante administrador para publicar textos.
          </p>
        ) : saved ? (
          <div className="text-editor__success" role="status">
            <p>Texto publicado com sucesso.</p>
            <a href="/textos-para-discussao">Voltar para os textos</a>
          </div>
        ) : (
          <form className="text-editor__form" onSubmit={saveText}>
            <label>
              Título
              <input
                autoFocus
                required
                maxLength={200}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>
            <label>
              Conteúdo
              <textarea
                required
                rows={12}
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
            </label>
            {error && <p className="text-editor__error" role="alert">{error}</p>}
            <div className="text-editor__actions">
              <a href="/textos-para-discussao">Cancelar</a>
              <button type="submit">Publicar texto</button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
