import "../styles/home.css";
import NavBar from "../components/NavBar";

const denuncias = [
  {
    titulo: "Buraco na via",
    endereco: "Rua das Flores, 123 - Centro",
    tempo: "Hoje, 10:23",
    status: "Aberta",
    tipoStatus: "aberta",
    imagem: "https://images.unsplash.com/photo-1610016302534-6f67f1c968d8?q=80&w=800",
    comentarios: 3,
    curtidas: 12,
  },
  {
    titulo: "Poste com luz apagada",
    endereco: "Av. Brasil, 450 - Jardim América",
    tempo: "Ontem, 20:15",
    status: "Em andamento",
    tipoStatus: "andamento",
    imagem: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800",
    comentarios: 2,
    curtidas: 8,
  },
  {
    titulo: "Lixo acumulado",
    endereco: "Rua das Palmeiras, 78 - Centro",
    tempo: "Ontem, 14:42",
    status: "Aberta",
    tipoStatus: "aberta",
    imagem: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?q=80&w=800",
    comentarios: 5,
    curtidas: 15,
  },
  {
    titulo: "Calçada quebrada",
    endereco: "Rua das Acácias, 321 - Vila Nova",
    tempo: "2 dias atrás",
    status: "Aberta",
    tipoStatus: "aberta",
    imagem: "https://images.unsplash.com/photo-1584466977773-e625c37cdd50?q=80&w=800",
    comentarios: 1,
    curtidas: 6,
  },
  {
    titulo: "Vazamento de esgoto",
    endereco: "Rua do Sol, 56 - São José",
    tempo: "2 dias atrás",
    status: "Em andamento",
    tipoStatus: "andamento",
    imagem: "https://images.unsplash.com/photo-1523419409543-a5e549c1faa8?q=80&w=800",
    comentarios: 4,
    curtidas: 10,
  },
  {
    titulo: "Semáforo com defeito",
    endereco: "Av. Central, 890 - Centro",
    tempo: "3 dias atrás",
    status: "Resolvida",
    tipoStatus: "resolvida",
    imagem: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=800",
    comentarios: 2,
    curtidas: 9,
  },
];

const categorias = [
  "Todas",
  "Buracos",
  "Iluminação",
  "Lixo",
  "Água/Esgoto",
  "Calçadas",
  "Trânsito",
  "Outros",
];

function Home() {
  return (
    <div className="home-page">
      <NavBar />

      <main className="home-main">
        <header className="home-header">
          <div>
            <h1>Olá, Cliente! 👋</h1>
            <p>Vamos juntos melhorar nossa cidade.</p>
          </div>

          <div className="home-actions">
  <div className="bell">
    🔔<small>2</small>
  </div>
</div>
        </header>

        <section className="home-search">
          <div className="search-box">
            <span>🔍</span>
            <input placeholder="Buscar denúncias (ex: buraco, lixo, iluminação...)" />
          </div>

          <button className="filter-btn">▽ Filtros</button>
        </section>

        <section className="categories">
          {categorias.map((item, index) => (
            <button key={item} className={index === 0 ? "active" : ""}>
              <span>{index === 0 ? "▦" : "⚠"}</span>
              {item}
            </button>
          ))}
        </section>

        <section className="home-layout">
          <div className="reports-area">
            <h2>Denúncias recentes</h2>

            <div className="reports-grid">
              {denuncias.map((item) => (
                <article className="report-card" key={item.titulo}>
                  <div className="report-image">
                    <img src={item.imagem} alt={item.titulo} />
                    <span className={`status ${item.tipoStatus}`}>{item.status}</span>
                  </div>

                  <div className="report-body">
                    <h3>{item.titulo}</h3>
                    <p>{item.endereco}</p>
                    <p>{item.tempo}</p>

                    <div className="report-footer">
                      <span>💬 {item.comentarios}</span>
                      <span>♡ {item.curtidas}</span>
                      <span>🔖</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <button className="more-btn">Ver mais denúncias ⌄</button>
          </div>

          <aside className="dashboard-side">
            <section className="side-card">
              <div className="side-title">
                <h3>Mapa da cidade</h3>
                <a href="#">Ver no mapa completo</a>
              </div>

              <div className="map-box">
                <span className="pin p1">8</span>
                <span className="pin p2">5</span>
                <span className="pin p3">2</span>
                <span className="pin p4">3</span>
                <span className="pin center">📍</span>
              </div>
            </section>

            <section className="side-card">
              <div className="side-title">
                <h3>Panorama geral</h3>
                <span>Este mês⌄</span>
              </div>

              <div className="stats">
                <div>
                  <span>📷</span>
                  <p><strong>Denúncias abertas</strong> Aguardando atendimento</p>
                  <b>128</b>
                </div>

                <div>
                  <span>📦</span>
                  <p><strong>Em andamento</strong> Sendo tratadas</p>
                  <b>63</b>
                </div>

                <div>
                  <span>✅</span>
                  <p><strong>Resolvidas</strong> Problemas solucionados</p>
                  <b>215</b>
                </div>
              </div>
            </section>

            <section className="side-card call-card">
              <div className="call-icon">🌱</div>
              <h3>Faça a diferença!</h3>
              <p>Sua denúncia ajuda a construir uma cidade melhor para todos.</p>
              <button>＋ Registrar denúncia</button>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default Home;