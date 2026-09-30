import { useEffect, useState } from "react";
import "./Members.css";

const members = [
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
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    if (!selectedMember) return undefined;
    const closeWithEscape = (event) => {
      if (event.key === "Escape") setSelectedMember(null);
    };
    document.addEventListener("keydown", closeWithEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeWithEscape);
      document.body.style.overflow = "";
    };
  }, [selectedMember]);

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
            <article className="memberCard" key={member.name}>
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
            </article>
          ))}
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
              <p className="modalLabel">Pesquisador(a)</p>
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
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
