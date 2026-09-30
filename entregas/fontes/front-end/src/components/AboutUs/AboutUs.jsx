import "./AboutUs.css";

const AboutUs = () => {
  return (
    <section className="aboutUs" id="sobre-nos">
      <div className="aboutContainer">
        <h1>Sobre Nós</h1>
        <p>
          O grupo de pesquisa R.E.G.I.I.M.E.N.T.O. (Research Expert Group for
          Intelligent Information in Multimodal Environment using Natural
          language Technologies and Ontologies), atua desde 2009 na promoção de
          Workshops, Colóquios e Seminários sobre Arquitetura da Informação,
          desde 2019 na Ciência Arquivística Computacional (computational
          archival science, CAS) e desde 2022 no INTERPARES TRUST AI, tendo
          titulado 24 mestres e 24 doutores até 2022. Desenvolve estudos em
          Arquitetura da Informação, Processamento de Linguagem Natural,
          Engenharia de Ontologias, Multimodalidade e Deep Learning, propondo
          uma Arquitetura da Informação Multimodal (MIA), além de colaborar com
          ações voluntárias do Instituto Brasil Digital no Movimento Brasil
          Digital no eixo de Educação Digital.
        </p>

        {/*
        <div className="features">
          <div className="feature">
            <h3>Conhecimento</h3>
            <p>Acesso a conteúdo acadêmico de qualidade</p>
          </div>
          <div className="feature">
            <h3>Comunidade</h3>
            <p>Conecte-se com outros aprendizes</p>
          </div>
          <div className="feature">
            <h3>Crescimento</h3>
            <p>Desenvolva suas habilidades e conhecimentos</p>
          </div>
        </div>
        */}
      </div>
    </section>
  );
};

export default AboutUs;
