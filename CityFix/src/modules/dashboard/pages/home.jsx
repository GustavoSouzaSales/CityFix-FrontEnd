import "../styles/home.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

import buraco from "../../../assets/images/buraco.jpg";
import poste from "../../../assets/images/poste.jpg";
import lixo from "../../../assets/images/lixo.jpg";
import calçada from "../../../assets/images/calçada.jpg";
import esgoto from "../../../assets/images/esgoto.jpg";
import semaforo from "../../../assets/images/semaforo.jpg";

const denuncias = [
  {
    titulo: "Buraco na via",
    categoria: "Buraco",
    endereco: "Rua das Flores, 123 - Centro",
    tempo: "Hoje, 10:23",
    status: "Aberta",
    tipoStatus: "aberta",
    imagem: buraco,
    comentarios: 3,
    curtidas: 12,
  },
  {
    titulo: "Poste com luz apagada",
    categoria: "Iluminação",
    endereco: "Av. Brasil, 450 - Jardim América",
    tempo: "Ontem, 20:15",
    status: "Em andamento",
    tipoStatus: "andamento",
    imagem: poste,
    comentarios: 2,
    curtidas: 8,
  },
  {
    titulo: "Lixo acumulado",
    categoria: "Lixo",
    endereco: "Rua das Palmeiras, 78 - Centro",
    tempo: "Ontem, 14:42",
    status: "Aberta",
    tipoStatus: "aberta",
    imagem: lixo,
    comentarios: 5,
    curtidas: 15,
  },
  {
    titulo: "Calçada quebrada",
    categoria: "Calçadas",
    endereco: "Rua das Acácias, 321 - Vila Nova",
    tempo: "2 dias atrás",
    status: "Aberta",
    tipoStatus: "aberta",
    imagem: calçada,
    comentarios: 1,
    curtidas: 6,
  },
  {
    titulo: "Vazamento de esgoto",
    categoria: "Água/Esgoto",
    endereco: "Rua do Sol, 56 - São José",
    tempo: "2 dias atrás",
    status: "Em andamento",
    tipoStatus: "andamento",
    imagem: esgoto,
    comentarios: 4,
    curtidas: 10,
  },
  {
    titulo: "Semáforo com defeito",
    categoria: "Trânsito",
    endereco: "Av. Central, 890 - Centro",
    tempo: "3 dias atrás",
    status: "Resolvida",
    tipoStatus: "resolvida",
    imagem: semaforo,
    comentarios: 2,
    curtidas: 9,
  },
];

function Home() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");
  const [categorias, setCategorias] = useState([]);
  const [busca, setBusca] = useState("");
  const [modalMapa, setModalMapa] = useState(false);

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    async function carregarCategorias() {
      try {
        const response = await fetch("http://localhost:8080/categorias");
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    }

    carregarCategorias();
  }, []);

  const categoriasFiltro = [
    { id: "todas", nome: "Todas", icon: "▦" },
    ...categorias.map((categoria) => ({
      id: categoria.id,
      nome: categoria.nome,
      icon: "⚠",
    })),
  ];

  const denunciasFiltradas = denuncias.filter((item) => {
    const categoriaOk =
      categoriaAtiva === "Todas" || item.categoria === categoriaAtiva;

    const buscaOk =
      item.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      item.endereco.toLowerCase().includes(busca.toLowerCase());

    return categoriaOk && buscaOk;
  });

  return (
    <div className="home-page">
      <NavBar />

      <main className="home-main">
        <header className="home-header">
          <div className="home-header-text">
            <div className="home-eyebrow">Painel da comunidade</div>

            <h1>Olá, {usuario?.nome || "Cliente"}! 👋</h1>

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
            <span className="search-icon">🔍</span>

            <input
              type="text"
              placeholder="Buscar denúncias (ex: buraco, lixo, iluminação...)"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <button className="filter-btn">
            <span>▽</span> Filtros
          </button>
        </section>

        <section className="categories">
          {categoriasFiltro.map((item) => (
            <button
              key={item.id}
              onClick={() => setCategoriaAtiva(item.nome)}
              className={categoriaAtiva === item.nome ? "active" : ""}
            >
              <span>{item.icon}</span>
              {item.nome}
            </button>
          ))}
        </section>

        <section className="home-layout">
          <div className="reports-area">
            <div className="reports-area-header">
              <h2>Denúncias recentes</h2>

              <span className="reports-count">
                {denunciasFiltradas.length} registros
              </span>
            </div>

            <div className="reports-grid">
              {denunciasFiltradas.map((item) => (
                <article className="report-card" key={item.titulo}>
                  <div className="report-image">
                    <img src={item.imagem} alt={item.titulo} />

                    <div className="report-image-overlay" />

                    <span className={`status ${item.tipoStatus}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="report-body">
                    <h3>{item.titulo}</h3>

                    <p className="report-address">
                      <span className="report-addr-icon">📍</span>
                      {item.endereco}
                    </p>

                    <p className="report-time">{item.tempo}</p>

                    <div className="report-divider" />

                    <div className="report-footer">
                      <span className="report-action">
                        <span>💬</span> {item.comentarios}
                      </span>

                      <span className="report-action">
                        <span>♡</span> {item.curtidas}
                      </span>

                      <span className="report-action report-save">🔖</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <button className="more-btn">
              Ver mais denúncias <span>⌄</span>
            </button>
          </div>

          <aside className="dashboard-side">
            <section className="side-card">
              <div className="side-title">
                <h3>Mapa da cidade</h3>
              </div>

              <div className="map-box" onClick={() => setModalMapa(true)}>
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
                <span>Este mês ⌄</span>
              </div>

              <div className="stats">
                <div className="stat-row">
                  <span className="stat-icon">📷</span>

                  <div className="stat-info">
                    <strong>Denúncias abertas</strong>
                    <small>Aguardando atendimento</small>
                  </div>

                  <b className="stat-val stat-val--red">128</b>
                </div>

                <div className="stat-row">
                  <span className="stat-icon">📦</span>

                  <div className="stat-info">
                    <strong>Em andamento</strong>
                    <small>Sendo tratadas</small>
                  </div>

                  <b className="stat-val stat-val--yellow">63</b>
                </div>

                <div className="stat-row">
                  <span className="stat-icon">✅</span>

                  <div className="stat-info">
                    <strong>Resolvidas</strong>
                    <small>Problemas solucionados</small>
                  </div>

                  <b className="stat-val stat-val--green">215</b>
                </div>
              </div>
            </section>

            <section className="side-card call-card">
              <div className="call-icon">🌱</div>

              <h3>Faça a diferença!</h3>

              <p>Sua denúncia ajuda a construir uma cidade melhor para todos.</p>

              <Link to="/registrar-denuncia">
                <button>＋ Registrar denúncia</button>
              </Link>
            </section>
          </aside>
        </section>
      </main>

      {modalMapa && (
        <div
          className="admin-modal-overlay"
          onClick={() => setModalMapa(false)}
        >
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <p className="modal-eyebrow">Mapa da cidade</p>

                <h2>Mapa da cidade</h2>

                <p className="modal-sub">
                  Visualize as denúncias registradas no mapa.
                </p>
              </div>

              <button
                className="admin-close"
                onClick={() => setModalMapa(false)}
              >
                ✕
              </button>
            </div>

            <div className="admin-map-real">
              <iframe
                title="Mapa de Irecê"
                src="https://maps.google.com/maps?q=Irecê%20BA&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="450"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;