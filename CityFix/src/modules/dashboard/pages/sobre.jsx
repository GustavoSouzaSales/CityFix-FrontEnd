import "../styles/sobre.css";
import NavBar from "../../dashboard/components/NavBar";

function Sobre() {
  return (
    <div className="sobre-page">
      <NavBar />

      <main className="sobre-main">

        {/* ── BANNER ── */}
        <section className="sobre-banner">
          <div className="banner-glow" />
          <div className="banner-content">
            <span className="banner-eyebrow">Plataforma cidadã</span>
            <h1>Sobre o <span className="green">CityFix</span></h1>
            <p>
              Conheça mais sobre nossa missão, valores e como trabalhamos por
              cidades melhores e mais sustentáveis.
            </p>
          </div>
        </section>

        {/* ── CARD PRINCIPAL ── */}
        <section className="sobre-card principal-card">

          {/* Coluna esquerda — logo + versão */}
          <div className="logo-area">
            <h2 className="cityfix-logo">City<span>Fix</span></h2>
            <div className="logo-divider" />
            <span className="version">Versão 1.0.0</span>
            <p className="logo-tagline">Cidadania digital para todos.</p>
          </div>

          {/* Coluna central — descrição */}
          <div className="principal-desc">
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

          {/* Coluna direita — benefícios */}
          <div className="beneficios">
            <div className="beneficio-item">
              <div className="beneficio-icon">🤝</div>
              <div>
                <h3>Conexão cidadã</h3>
                <p>Aproximamos você da sua cidade e das autoridades.</p>
              </div>
            </div>
            <div className="beneficio-sep" />
            <div className="beneficio-item">
              <div className="beneficio-icon">🛡️</div>
              <div>
                <h3>Transparência</h3>
                <p>Acompanhe suas denúncias com clareza.</p>
              </div>
            </div>
            <div className="beneficio-sep" />
            <div className="beneficio-item">
              <div className="beneficio-icon">🌱</div>
              <div>
                <h3>Sustentabilidade</h3>
                <p>Promovemos ações com impacto positivo.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── MISSÃO / VISÃO / VALORES ── */}
        <div className="cards-grid cards-trio">

          <article className="sobre-card mvv-card">
            <div className="mvv-header">
              <span className="mvv-emoji">🎯</span>
              <div className="mvv-line" />
            </div>
            <h2>Nossa missão</h2>
            <p>
              Transformar a participação cidadã em ação, promovendo cidades
              mais organizadas, seguras e sustentáveis.
            </p>
          </article>

          <article className="sobre-card mvv-card mvv-card--mid">
            <div className="mvv-header">
              <span className="mvv-emoji">👁️</span>
              <div className="mvv-line" />
            </div>
            <h2>Nossa visão</h2>
            <p>
              Ser referência nacional em cidadania digital e colaboração
              entre população e gestores públicos.
            </p>
          </article>

          <article className="sobre-card mvv-card">
            <div className="mvv-header">
              <span className="mvv-emoji">💚</span>
              <div className="mvv-line" />
            </div>
            <h2>Nossos valores</h2>
            <ul>
              <li>Compromisso com a comunidade</li>
              <li>Ética e transparência</li>
              <li>Inovação com propósito</li>
              <li>Respeito e inclusão</li>
            </ul>
          </article>

        </div>

        {/* ── TECNOLOGIA + DESTAQUE ── */}
        <div className="cards-grid cards-duo">

          <article className="sobre-card tech-card">
            <div className="tech-top">
              <span className="tech-emoji">🔒</span>
              <h2>Tecnologia e segurança</h2>
            </div>
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
            <div className="destaque-inner">
              <span className="destaque-quote">"</span>
              <h2>Feito para você,<br/>feito pela cidade.</h2>
              <p>
                O CityFix é mais do que um aplicativo. É um movimento de
                transformação social.
              </p>
              <p>Juntos podemos construir cidades melhores.</p>
              <div className="destaque-tag">🌍 Transformação social</div>
            </div>
          </article>

        </div>

        <footer className="sobre-footer">
          <div className="footer-divider" />
          <p>© 2026 CityFix. Todos os direitos reservados.</p>
        </footer>

      </main>
    </div>
  );
}

export default Sobre;