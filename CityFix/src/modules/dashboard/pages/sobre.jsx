import "../styles/sobre.css";
import NavBar from "../../dashboard/components/NavBar";

function Sobre() {
  return (
    <div className="sobre-page">
      <NavBar />

      <main className="sobre-main">
        <section className="sobre-banner">
          <div>
            <h1>Sobre o CityFix</h1>
            <p>
              Conheça mais sobre nossa missão, valores e como trabalhamos
              por cidades melhores e mais sustentáveis.
            </p>
          </div>
        </section>

        <section className="sobre-card principal-card">
          <div className="logo-area">
            <h2 className="cityfix-logo">
              City<span>Fix</span>
            </h2>

            <span className="version">
              Versão 1.0.0
            </span>
          </div>

          <div>
            <h2>O que é o CityFix?</h2>

            <p>
              O CityFix é uma plataforma digital que conecta cidadãos e
              prefeituras para tornar as cidades melhores para todos.
            </p>

            <p>
              Através dela, você pode registrar problemas urbanos,
              acompanhar o andamento das denúncias e contribuir para uma
              cidade mais segura, limpa e sustentável.
            </p>
          </div>

          <div className="beneficios">
            <div>
              <h3>🤝 Conexão cidadã</h3>
              <p>Aproximamos você da sua cidade e das autoridades.</p>
            </div>

            <div>
              <h3>🛡️ Transparência</h3>
              <p>Acompanhe suas denúncias com clareza.</p>
            </div>

            <div>
              <h3>🌱 Sustentabilidade</h3>
              <p>Promovemos ações com impacto positivo.</p>
            </div>
          </div>
        </section>

        <section className="cards-grid">
          <article className="sobre-card">
            <h2>🎯 Nossa missão</h2>

            <p>
              Transformar a participação cidadã em ação, promovendo cidades
              mais organizadas, seguras e sustentáveis.
            </p>
          </article>

          <article className="sobre-card">
            <h2>👁️ Nossa visão</h2>

            <p>
              Ser referência nacional em cidadania digital e colaboração
              entre população e gestores públicos.
            </p>
          </article>

          <article className="sobre-card">
            <h2>💚 Nossos valores</h2>

            <ul>
              <li>Compromisso com a comunidade</li>
              <li>Ética e transparência</li>
              <li>Inovação com propósito</li>
              <li>Respeito e inclusão</li>
            </ul>
          </article>
        </section>

        <section className="cards-grid">
          <article className="sobre-card">
            <h2>🔒 Tecnologia e segurança</h2>

            <p>
              O CityFix utiliza tecnologia segura para proteger seus dados
              e garantir privacidade em todas as interações.
            </p>

            <div className="badges">
              <span>🛡️ Dados protegidos</span>
              <span>📋 Conformidade com LGPD</span>
            </div>
          </article>

          <article className="sobre-card destaque-card">
            <h2>Feito para você, feito pela cidade.</h2>

            <p>
              O CityFix é mais do que um aplicativo. É um movimento de
              transformação social.
            </p>

            <p>
              Juntos podemos construir cidades melhores.
            </p>
          </article>
        </section>

        <footer className="sobre-footer">
          © 2026 CityFix. Todos os direitos reservados.
        </footer>
      </main>
    </div>
  );
}

export default Sobre;