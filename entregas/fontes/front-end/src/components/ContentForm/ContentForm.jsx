import { useEffect, useState } from "react";
import "../Members/Members.css"; // reaproveita o visual dos modais de formulário
import "./ContentForm.css";

// Modal de formulário simples. `fields` descreve os campos; `onSubmit(values)` deve lançar um
// erro (ApiError) se algo falhar. Em caso de sucesso, o modal fecha sozinho.
export default function ContentForm({
  kicker,
  title,
  fields,
  initialValues = {},
  submitLabel = "Salvar",
  onSubmit,
  onClose,
}) {
  const [values, setValues] = useState(() =>
    Object.fromEntries(
      fields.map((field) => [
        field.name,
        initialValues[field.name] ??
          (field.type === "checkbox" ? false : ""),
      ]),
    ),
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [readingFile, setReadingFile] = useState(false);

  useEffect(() => {
    const closeWithEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeWithEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeWithEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const update = (name, value) =>
    setValues((current) => ({ ...current, [name]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      setError(err.message || "Não foi possível salvar.");
      setSaving(false);
    }
  };

  const renderField = (field, index) => {
    if (field.type === "checkbox") {
      return (
        <label className="memberActiveToggle" key={field.name}>
          <input
            type="checkbox"
            checked={values[field.name]}
            onChange={(event) => update(field.name, event.target.checked)}
          />
          {field.label}
        </label>
      );
    }

    if (field.type === "file") {
      return (
        <label key={field.name}>
          {field.label}
          <input
            type="file"
            accept={field.accept}
            required={field.required}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              if (field.maxFileSize && file.size > field.maxFileSize) {
                setError("A imagem deve ter no máximo 2 MB.");
                update(field.name, "");
                event.target.value = "";
                return;
              }

              const reader = new FileReader();
              setReadingFile(true);
              reader.onload = () => {
                if (typeof reader.result === "string") {
                  setError("");
                  update(field.name, reader.result);
                }
                setReadingFile(false);
              };
              reader.onerror = () => {
                setError("Não foi possível carregar a imagem.");
                setReadingFile(false);
              };
              reader.readAsDataURL(file);
            }}
          />
        </label>
      );
    }

    if (field.type === "textarea") {
      return (
        <label key={field.name}>
          {field.label}
          <textarea
            rows={6}
            required={field.required}
            maxLength={field.maxLength}
            autoFocus={index === 0}
            value={values[field.name]}
            onChange={(event) => update(field.name, event.target.value)}
          />
        </label>
      );
    }

    const listId = field.suggestions ? `${field.name}-sugestoes` : undefined;
    return (
      <label key={field.name}>
        {field.label}
        {field.suffix ? (
          <span className="contentForm__inputSuffix">
            <input
              type={field.type || "text"}
              required={field.required}
              maxLength={field.maxLength}
              list={listId}
              autoFocus={index === 0}
              value={values[field.name]}
              onChange={(event) => update(field.name, event.target.value)}
            />
            <span>{field.suffix}</span>
          </span>
        ) : (
          <input
            type={field.type || "text"}
            required={field.required}
            maxLength={field.maxLength}
            list={listId}
            autoFocus={index === 0}
            value={values[field.name]}
            onChange={(event) => update(field.name, event.target.value)}
          />
        )}
        {listId && (
          <datalist id={listId}>
            {field.suggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        )}
      </label>
    );
  };

  return (
    <div
      className="memberModalBackdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="memberFormModal contentForm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="content-form-title"
      >
        <button
          type="button"
          className="modalClose"
          aria-label="Fechar formulário"
          onClick={onClose}
        >
          ×
        </button>
        <p className="membersKicker">{kicker}</p>
        <h2 id="content-form-title">{title}</h2>
        <form onSubmit={handleSubmit}>
          {fields.map(renderField)}
          {error && <p role="alert">{error}</p>}
          <div className="memberFormActions">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="memberActionButton"
              disabled={saving || readingFile}
            >
              {readingFile ? "Carregando imagem..." : saving ? "Salvando..." : submitLabel}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
