import { useEffect, useState } from "react";
import "./Members.css";

const initialMembers = [
  {
    name: "Ana Beatriz Ferreira",
    role: "Pesquisadora da Faculdade de Direito UnB",
    area: "Direito, informação e sociedade",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    email: "ana.ferreira@regiimento.com",
  },
  {
    name: "Carlos Lima",
    role: "Mestrando em Ciência Política",
    area: "Políticas públicas e participação",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    email: "carlos.lima@regiimento.com",
  },
  {
    name: "João Amauri",
    role: "Doutor em Psicologia",
    area: "Comportamento e processos sociais",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    email: "joao.amauri@regiimento.com",
  },
  {
    name: "Rafael Souza",
    role: "Analista",
    area: "Gestão e análise de dados",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    email: "rafael.souza@regiimento.com",
  },
  {
    name: "Juliana Pires",
    role: "Pesquisadora",
    area: "Memória, cultura e informação",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    email: "juliana.pires@regiimento.com",
  },
  {
    name: "Bruno Mendes",
    role: "Coordenador",
    area: "Coordenação de projetos de pesquisa",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    email: "bruno.mendes@regiimento.com",
  },
  {
    name: "Patrícia Silva",
    role: "Pesquisadora",
    area: "Comunicação e estudos organizacionais",
    image: "https://randomuser.me/api/portraits/women/49.jpg",
    email: "patricia.silva@regiimento.com",
  },
  {
    name: "Gurdeep Shyam",
    role: "Pesquisador Doutor",
    area: "Tecnologia, informação e sociedade",
    image: "https://randomuser.me/api/portraits/men/29.jpg",
    email: "gurdeep.shyam@regiimento.com",
  },
  {
    name: "Fernanda Rocha",
    role: "Pesquisadora",
    area: "Design da informação",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    email: "fernanda.rocha@regiimento.com",
  },
  {
    name: "Eduardo Barros",
    role: "Coordenador",
    area: "Ciência de dados e visualização",
    image: "https://randomuser.me/api/portraits/men/64.jpg",
    email: "eduardo.barros@regiimento.com",
  },
  {
    name: "Beatriz Costa",
    role: "Pesquisadora",
    area: "Educação e acesso à informação",
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    email: "beatriz.costa@regiimento.com",
  },
  {
    name: "João Pedro",
    role: "Analista",
    area: "Pesquisa e desenvolvimento",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    email: "joao.pedro@regiimento.com",
  },
];

export default function Members() {
  const [members, setMembers] = useState(() =>
    initialMembers.map((member, index) => ({
      ...member,
      id: `member-${index + 1}`,
      active: true,
    })),
  );
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

  const openAddForm = () => {
    setSelectedMember(null);
    setMemberForm({
      name: "",
      role: "",
      area: "",
      image: "",
      email: "",
      lattes: "",
      active: true,
    });
  };

  const openEditForm = (member) => {
    setSelectedMember(null);
    setMemberForm({ ...member });
  };

  const saveMember = (event) => {
    event.preventDefault();
    if (memberForm.id) {
      setMembers((currentMembers) =>
        currentMembers.map((member) =>
          member.id === memberForm.id ? memberForm : member,
        ),
      );
    } else {
      setMembers((currentMembers) => [
        ...currentMembers,
        { ...memberForm, id: crypto.randomUUID() },
      ]);
    }
    setMemberForm(null);
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
        <div className="membersGrid">
          {members.map((member) => (
            <article className="memberCard" key={member.id}>
              <img
                src={member.image}
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
            <button
              type="button"
              className="memberEditAction"
              aria-label={`Editar informações de ${selectedMember.name}`}
              title="Editar membro"
              onClick={() => openEditForm(selectedMember)}
            >
              ✎
            </button>
            <button
              type="button"
              className="modalClose"
              aria-label="Fechar detalhes"
              onClick={() => setSelectedMember(null)}
            >
              ×
            </button>
            <img
              src={selectedMember.image}
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
              <label>
                E-mail
                <input
                  type="email"
                  value={memberForm.email}
                  onChange={(event) =>
                    setMemberForm({ ...memberForm, email: event.target.value })
                  }
                />
              </label>
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
              <label className="memberActiveToggle">
                <input
                  type="checkbox"
                  checked={memberForm.active}
                  onChange={(event) =>
                    setMemberForm({
                      ...memberForm,
                      active: event.target.checked,
                    })
                  }
                />
                Ativo
              </label>
              <div className="memberFormActions">
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
