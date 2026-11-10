// Converte as respostas da API para o formato usado pelos componentes.
const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
const MESES_LONGOS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const IMAGE_POSITIONS = ["center", "right", "left", "bottom", "top"];

const dois = (n) => String(n).padStart(2, "0");

export function mapEvento(e) {
  const d = new Date(e.dataEvento);
  const minutos = d.getMinutes();
  const dateLong = Number.isNaN(d.getTime())
    ? ""
    : new Intl.DateTimeFormat("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(d);
  return {
    id: String(e.id),
    date: `${dois(d.getDate())} ${MESES[d.getMonth()]}`,
    dateLong,
    year: Number.isNaN(d.getTime()) ? "" : d.getFullYear(),
    time: minutos ? `${d.getHours()}h${dois(minutos)}` : `${d.getHours()}h`,
    dateTime: e.dataEvento,
    title: e.nomeEvento,
    description: e.descricao || "",
    type: e.destaque ? "Destaque" : "Evento",
    link: e.linkAcesso || "",
    image: e.imagem || "",
    destaque: Boolean(e.destaque),
    ownerId: e.cadastradoPorId,
  };
}

export function mapIntegrante(i) {
  return {
    id: i.id,
    name: i.nome,
    role: i.titulacao || "",
    area: i.linhaPesquisa || "",
    vinculo: i.vinculoInstitucional || "",
    image: i.imagem || "",
    email: i.email,
    lattes: i.lattes || "",
    active: i.statusAtivo !== false,
    // só vem nas rotas de admin (/integrantes/todos); a lista pública não expõe esse campo
    admin: Boolean(i.administrador),
  };
}

// O post da API não tem título separado: a primeira linha vira o título e o
// restante vira a descrição.
export function mapPost(p, index = 0) {
  const [primeira, ...resto] = (p.conteudoTexto || "").trim().split(/\r?\n+/);
  const d = new Date(p.dataCriacao);
  return {
    id: p.id,
    category: p.tipo,
    title: primeira,
    description: resto.join(" ") || "",
    author: p.cadastradoPorNome,
    ownerId: p.cadastradoPorId,
    date: `${dois(d.getDate())} ${MESES_LONGOS[d.getMonth()]} ${d.getFullYear()}`,
    comments: p.totalComentarios,
    image: p.imagem || "/banner.png",
    imagePosition: IMAGE_POSITIONS[index % IMAGE_POSITIONS.length],
  };
}

export function mapPublicacao(publicacao) {
  const [year, month, day] = (publicacao.dataPublicacao || "").split("-");
  return {
    id: String(publicacao.id),
    type: publicacao.tipo || "Publicação",
    title: publicacao.titulo,
    summary: publicacao.resumo || "",
    authors: (publicacao.autores || [])
      .map((author) => author.nome)
      .filter(Boolean),
    date: year && month && day ? `${day}/${month}/${year}` : "",
  };
}
