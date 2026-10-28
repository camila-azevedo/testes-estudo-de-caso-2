import { useEffect, useState } from "react";
import { ApiError, del, get, patch, post, put } from "../../api";
import { useAuth } from "../../authContext";
import { mapIntegrante } from "../../mappers";
import { useApiList } from "../../useApi";
import "./Members.css";

export default function Members() {
  const { user } = useAuth();
  const isAdmin = Boolean(user?.administrador);
  // O admin vê todos (inclusive inativos, com a flag de admin); o público só vê os ativos.
  const { items: members, loading, error, reload } = useApiList(
    isAdmin ? "/integrantes/todos" : "/integrantes",
    mapIntegrante,
  );
  const [interessados, setInteressados] = useState([]);
  const [formError, setFormError] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberForm, setMemberForm] = useState(null);

  useEffect(() => {
    if (!selectedMember && !memberForm) return undefined;
    const closeWithEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedMember(null);
        setMemberForm(null);
      }
    };
    document.addEventListener("keydown", closeWithEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeWithEscape);
      document.body.style.overflow = "";
    };
  }, [selectedMember, memberForm]);

  const openAddForm = async () => {
    setSelectedMember(null);
    setFormError("");
    setMemberForm({
      interessadoId: "",
      name: "",
      role: "",
      area: "",
      vinculo: "",
      image: "",
      email: "",
      lattes: "",
      admin: false,
    });
    try {
      // Quem já entrou com o Google e ainda não é integrante.
      const todos = await get("/usuarios-interessados");
      setInteressados(todos);
    } catch {
      setInteressados([]);
      setFormError("Não foi possível carregar a lista de usuários. Tente novamente.");
    }
  };

  const openEditForm = (member) => {
    setSelectedMember(null);
    setFormError("");
    setMemberForm({ ...member });
  };

  const saveMember = async (event) => {
    event.preventDefault();
    setFormError("");
    try {
      if (memberForm.id) {
        await put(`/integrantes/${memberForm.id}`, {
          nome: memberForm.name,
          imagem: memberForm.image,
          vinculoInstitucional: memberForm.vinculo,
          linhaPesquisa: memberForm.area,
          lattes: memberForm.lattes,
          titulacao: memberForm.role,
        });
        // ativo/administrador têm endpoint próprio (só admin, e não pode se rebaixar)
        await patch(`/integrantes/${memberForm.id}/status`, {
          statusAtivo: memberForm.active,
          administrador: memberForm.admin,
        });
      } else {
        await post(`/integrantes/${memberForm.interessadoId}/promover`, {
          vinculoInstitucional: memberForm.vinculo,
          linhaPesquisa: memberForm.area,
          lattes: memberForm.lattes,
          titulacao: memberForm.role,
          administrador: memberForm.admin,
        });
      }
      setMemberForm(null);
      reload();
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Não foi possível salvar o membro.",
      );
    }
  };

  const removeMember = async () => {
    if (!window.confirm(`Remover ${memberForm.name}?`)) return;
    try {
      await del(`/integrantes/${memberForm.id}`);
      setMemberForm(null);
      reload();
    } catch (err) {
      setFormError(
        err instanceof ApiError && err.status === 409
          ? "Este membro já tem posts, eventos ou comentários e não pode ser removido. Desmarque \"Membro ativo\" para desativá-lo."
          : "Não foi possível remover o membro.",
      );
    }
  };

  return (
    <main className="membersPage">
      <section className="membersSection" aria-labelledby="members-title">
        <p className="membersKicker">R.E.G.I.I.M.E.N.T.O.</p>
        <h1 id="members-title">Pesquisadores</h1>
        <p className="membersIntro">
          Membros do grupo de pesquisa REGIIMENTO, com suas respectivas áreas de
          atuação.
        </p>
        {loading && <p className="membersIntro">Carregando...</p>}
        {error && (
          <p className="membersIntro">Não foi possível carregar os membros.</p>
        )}
        <div className="membersGrid">
          {members.map((member) => (
            <article className="memberCard" key={member.id}>
              <img
                src={member.image || "/regiimento.png"}
                alt={`Retrato de ${member.name}`}
                className="memberPhoto"
                role="button"
                tabIndex="0"
                onClick={() => setSelectedMember(member)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedMember(member);
                  }
                }}
              />
              <button
                type="button"
                className="memberName"
                onClick={() => setSelectedMember(member)}
              >
                {member.name}
              </button>
              <p>{member.role}</p>
              {!member.active && <p className="memberCardStatus">Inativo</p>}
            </article>
          ))}
        </div>
      </section>

      {isAdmin && (
      <section
        className="memberManagement"
        aria-labelledby="member-management-title"
      >
        <div className="memberManagementHeader">
          <div>
            <p className="membersKicker">ADMINISTRAÇÃO</p>
            <h2 id="member-management-title">Gerenciar membros</h2>
          </div>
          <button
            type="button"
            className="memberActionButton"
            onClick={openAddForm}
          >
            Adicionar Membro
          </button>
        </div>
      </section>
      )}

      {selectedMember && (
        <div
          className="memberModalBackdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedMember(null);
          }}
        >
          <section
            className="memberModal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-modal-title"
          >
            {isAdmin && (
            <button
              type="button"
              className="memberEditAction"
              aria-label={`Editar informações de ${selectedMember.name}`}
              title="Editar membro"
              onClick={() => openEditForm(selectedMember)}
            >
              ✎
            </button>
            )}
            <button
              type="button"
              className="modalClose"
              aria-label="Fechar detalhes"
              onClick={() => setSelectedMember(null)}
            >
              ×
            </button>
            <img
              src={selectedMember.image || "/regiimento.png"}
              alt={`Retrato de ${selectedMember.name}`}
            />
            <div>
              <p className="modalLabel">
                {selectedMember.active ? "Ativo" : "Inativo"}
              </p>
              <h2 id="member-modal-title">{selectedMember.name}</h2>
              <p className="modalRole">{selectedMember.role}</p>
              <p>
                <strong>Área de atuação</strong>
                <br />
                {selectedMember.area}
              </p>
              <a href={`mailto:${selectedMember.email}`}>
                {selectedMember.email}
              </a>
              {selectedMember.lattes && (
                <a
                  href={selectedMember.lattes}
                  target="_blank"
                  rel="noreferrer"
                >
                  Currículo Lattes
                </a>
              )}
            </div>
          </section>
        </div>
      )}

      {memberForm && (
        <div
          className="memberModalBackdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setMemberForm(null);
          }}
        >
          <section
            className="memberFormModal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-form-title"
          >
            <button
              type="button"
              className="modalClose"
              aria-label="Fechar formulário"
              onClick={() => setMemberForm(null)}
            >
              ×
            </button>
            <p className="membersKicker">ADMINISTRAÇÃO</p>
            <h2 id="member-form-title">
              {memberForm.id ? "Editar membro" : "Adicionar membro"}
            </h2>
            <form onSubmit={saveMember}>
              {memberForm.id ? (
              <label>
                Nome
                <input
                  required
                  autoFocus
                  value={memberForm.name}
                  onChange={(event) =>
                    setMemberForm({ ...memberForm, name: event.target.value })
                  }
                />
              </label>
              ) : (
              <label>
                Usuário (já fez login com o Google)
                <select
                  required
                  value={memberForm.interessadoId}
                  onChange={(event) =>
                    setMemberForm({
                      ...memberForm,
                      interessadoId: event.target.value,
                    })
                  }
                >
                  <option value="">Selecione...</option>
                  {interessados.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nome} ({u.email})
                    </option>
                  ))}
                </select>
              </label>
              )}
              <label>
                Vínculo institucional
                <input
                  required
                  value={memberForm.vinculo}
                  onChange={(event) =>
                    setMemberForm({ ...memberForm, vinculo: event.target.value })
                  }
                />
              </label>
              <label>
                Titulação
                <input
                  required
                  value={memberForm.role}
                  onChange={(event) =>
                    setMemberForm({ ...memberForm, role: event.target.value })
                  }
                />
              </label>
              <label>
                Área de atuação
                <input
                  required
                  value={memberForm.area}
                  onChange={(event) =>
                    setMemberForm({ ...memberForm, area: event.target.value })
                  }
                />
              </label>
              {memberForm.id && (
              <label>
                URL da foto
                <input
                  type="url"
                  value={memberForm.image}
                  onChange={(event) =>
                    setMemberForm({ ...memberForm, image: event.target.value })
                  }
                />
              </label>
              )}
              <label>
                Link do currículo Lattes
                <input
                  type="url"
                  value={memberForm.lattes || ""}
                  onChange={(event) =>
                    setMemberForm({ ...memberForm, lattes: event.target.value })
                  }
                />
              </label>
              {memberForm.id && (
                <label className="memberActiveToggle">
                  <input
                    type="checkbox"
                    checked={memberForm.active}
                    onChange={(event) =>
                      setMemberForm({ ...memberForm, active: event.target.checked })
                    }
                  />
                  Membro ativo
                </label>
              )}
              <label className="memberActiveToggle">
                <input
                  type="checkbox"
                  checked={Boolean(memberForm.admin)}
                  onChange={(event) =>
                    setMemberForm({ ...memberForm, admin: event.target.checked })
                  }
                />
                Administrador
              </label>
              {formError && <p role="alert">{formError}</p>}
              <div className="memberFormActions">
                {memberForm.id && (
                  <button type="button" onClick={removeMember}>
                    Remover
                  </button>
                )}
                <button type="button" onClick={() => setMemberForm(null)}>
                  Cancelar
                </button>
                <button type="submit" className="memberActionButton">
                  Salvar membro
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
