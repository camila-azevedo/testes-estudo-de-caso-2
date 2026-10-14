# Projeto R.E.G.I.I.M.E.N.T.O.

Plataforma web para o grupo R.E.G.I.I.M.E.N.T.O (UnB), que centraliza pesquisas e dados da ciência arquivística computacional.

> **Professor(a):** Leia as AS DIRETRIZES INSTITUCIONAIS constantes no repositório [DIRETRIZES](https://github.com/CAMPUSCEUB/DIRETRIZES), em especial o [Guia dos Professores](https://github.com/CAMPUSCEUB/DIRETRIZES/guias/github-enterprise-campus-ceub.md) e o [checklist do GitHub Enterprise](https://github.com/CAMPUSCEUB/DIRETRIZES/guias/github-enterprise-campus-ceub.md).
>
> **Estudante:** Leia o [guia dos alunos](docs/guia-alunos.md).

## Identificação do repositório

| Campo | Informação |
| --- | --- |
| Instituição | CEUB |
| Organização no GitHub | CampusCEUB |
| Professor(a) responsável pela criação | Lucas Rodrigues |
| Equipe | Camila de Faria, Henrique Milhorim e Marcela Lucy |
| IDProjeto | 20260121 |

## Contexto acadêmico

| Campo | Informação |
| --- | --- |
| Curso | Análise e Desenvolvimento de Sistemas |
| Disciplina | Projeto Integrador II |
| Semestre | 4º |
| Instituição parceira | Grupo de pesquisa REGIIMENTO (UnB) |

## Problema

Atualmente, a divulgação de publicações, eventos e reuniões do grupo de pesquisa REGIIMENTO ocorre somente via WhatsApp e e-mail, restringindo severamente o acesso orgânico da comunidade externa. Como o avanço do conhecimento científico depende do debate e da circulação de ideias, esse ecossistema limitado impede que as produções acadêmicas alcancem e beneficiem o público-alvo, reduzindo significativamente o impacto social e a visibilidade do grupo.

## Solução proposta

Desenvolver uma plataforma web (Portal REGIIMENTO) que ofereça um meio para divulgar as produções acadêmicas do grupo de pesquisa e promova a disseminação do conhecimento em Arquivologia, com os seguintes objetivos específicos:

- Aumentar a visibilidade do grupo de pesquisa;
- Otimizar a comunicação entre grupo e comunidade acadêmica;
- Centralizar informações sobre o meio acadêmico da Arquivologia.

### Principais funcionalidades

- Apresentação institucional do grupo e listagem de integrantes;
- Publicação de posts, textos para discussão e comentários;
- Página de eventos e avisos;
- Login via autenticação externa (Google ou ORCID);
- Motor de busca semântica sobre o acervo de publicações, com filtros por metadados;
- Dashboards interativos sobre a evolução da arquivologia acadêmica no Brasil, com exportação de dados.

### Arquitetura

- **Backend:** Spring Boot (Maven), em camadas Controller → Service → Repository;
- **Frontend:** React + Vite + Tailwind CSS;
- **Banco de dados:** PostgreSQL.

## Estrutura deste repositório

| Item | Link |
| --- | --- |
| Backlog | Vincular o GitHub Project |
| Sprints | [sprints/README.md](sprints/README.md) |
| Entregas | [entregas/README.md](entregas/README.md) |
| Requisitos | [docs/requisitos.md](docs/requisitos.md) |
| Arquitetura | [docs/arquitetura.md](docs/arquitetura.md) |
