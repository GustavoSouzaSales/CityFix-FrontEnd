import "../styles/home.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

import imagemGenerica from "../../../assets/images/imagemGenerica.png";

import Notificacoes from "../components/Notificacao";

function Home() {
  const [quantidadeVisivel, setQuantidadeVisivel] = useState(6);
  const [denuncias, setDenuncias] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [modalMapa, setModalMapa] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(true);
  const [periodoPanorama, setPeriodoPanorama] = useState("mes");

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    async function carregarDados() {
      try {
        const responseCategorias = await fetch("http://localhost:8080/categorias");
        const categoriasData = await responseCategorias.json();
        setCategorias(categoriasData);

        const responseDenuncias = await fetch("http://localhost:8080/denuncias");
        const denunciasData = await responseDenuncias.json();
        setDenuncias(denunciasData);
      } catch (error) {
        console.error("Erro ao carregar dados da Home:", error);
      }
    }

    carregarDados();
  }, []);

  const categoriasFiltro = [
    { id: "todas", nome: "Todas", icon: "▦" },
    ...categorias.map((categoria) => ({
      id: categoria.id,
      nome: categoria.nome,
      icon: "⚠",
    })),
  ];

  function denunciaDentroDoPeriodo(denuncia) {
    if (periodoPanorama === "todos") return true;
    if (!denuncia.dataCriacao) return false;

    const dataDenuncia = new Date(denuncia.dataCriacao);
    const hoje = new Date();

    const inicioHoje = new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      hoje.getDate()
    );

    const inicioSemana = new Date(inicioHoje);
    inicioSemana.setDate(inicioHoje.getDate() - 7);

    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    if (periodoPanorama === "hoje") {
      return dataDenuncia >= inicioHoje;
    }

    if (periodoPanorama === "semana") {
      return dataDenuncia >= inicioSemana;
    }

    if (periodoPanorama === "mes") {
      return dataDenuncia >= inicioMes;
    }

    return true;
  }

  function labelPeriodo() {
    if (periodoPanorama === "hoje") return "Hoje";
    if (periodoPanorama === "semana") return "Últimos 7 dias";
    if (periodoPanorama === "mes") return "Este mês";
    return "Todos";
  }

  const denunciasFiltradas = denuncias.filter((item) => {
    const buscaTexto = busca.toLowerCase();

    const categoriaOk =
      categoriaAtiva === "Todas" || item.categoria?.nome === categoriaAtiva;

    const buscaOk =
      item.titulo?.toLowerCase().includes(buscaTexto) ||
      item.localizacao?.toLowerCase().includes(buscaTexto) ||
      item.descricao?.toLowerCase().includes(buscaTexto);

    return categoriaOk && buscaOk;
  });

  const denunciasPanorama = denuncias.filter(denunciaDentroDoPeriodo);

  const denunciasVisiveis = denunciasFiltradas.slice(0, quantidadeVisivel);
  const temMaisDenuncias = quantidadeVisivel < denunciasFiltradas.length;

  const totalAbertas = denunciasPanorama.filter((d) => d.status === "ABERTA").length;
  const totalAndamento = denunciasPanorama.filter((d) => d.status === "EM_ANDAMENTO").length;
  const totalResolvidas = denunciasPanorama.filter((d) => d.status === "RESOLVIDA").length;

  function formatarStatus(status) {
    if (status === "ABERTA") return "Aberta";
    if (status === "EM_ANDAMENTO") return "Em andamento";
    if (status === "RESOLVIDA") return "Resolvida";
    return status;
  }

  function classeStatus(status) {
    if (status === "ABERTA") return "aberta";
    if (status === "EM_ANDAMENTO") return "andamento";
    if (status === "RESOLVIDA") return "resolvida";
    return "";
  }

  function formatarData(data) {
    if (!data) return "Data não informada";
    return new Date(data).toLocaleDateString("pt-BR");
  }

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
            <Notificacoes />
          </div>
        </header>

        <section className="home-search">
          <div className="search-box">
            <span className="search-icon">🔍</span>

            <input
              type="text"
              placeholder="Buscar denúncias (ex: buraco, lixo, iluminação...)"
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setQuantidadeVisivel(6);
              }}
            />
          </div>

          <button
            type="button"
            className={`filter-btn ${mostrarFiltros ? "active" : ""}`}
            onClick={() => setMostrarFiltros((prev) => !prev)}
          >
            <span>{mostrarFiltros ? "△" : "▽"}</span>
            {mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"}
          </button>
        </section>

        {mostrarFiltros && (
          <section className="categories">
            {categoriasFiltro.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCategoriaAtiva(item.nome);
                  setQuantidadeVisivel(6);
                }}
                className={categoriaAtiva === item.nome ? "active" : ""}
              >
                <span>{item.icon}</span>
                {item.nome}
              </button>
            ))}
          </section>
        )}

        <section className="home-layout">
          <div className="reports-area">
            <div className="reports-area-header">
              <h2>Denúncias recentes</h2>

              <span className="reports-count">
                {denunciasFiltradas.length} registros
              </span>
            </div>

            <div className="reports-grid">
              {denunciasFiltradas.length > 0 ? (
                denunciasVisiveis.map((item) => (
                  <article className="report-card" key={item.id}>
                    <div className="report-image">
<img
  src={
    item.imagens?.length > 0
      ? item.imagens[0].imagemUrl
      : imagemGenerica
  }
  alt={item.titulo}
/>

  <div className="report-image-overlay" />

  <span className={`status ${classeStatus(item.status)}`}>
    {formatarStatus(item.status)}
  </span>
</div>

                    <div className="report-body">
                      <h3>{item.titulo}</h3>

                      <p className="report-address">
                        <span className="report-addr-icon">📍</span>
                        {item.localizacao}
                      </p>

                      <p className="report-time">
                        {formatarData(item.dataCriacao)}
                      </p>

                      <div className="report-divider" />

                      <div className="report-footer">
                        <span className="report-action">
                          <span>💬</span> 0
                        </span>

                        <span className="report-action">
                          <span>♡</span> 0
                        </span>

                        <span className="report-action report-save">🔖</span>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <p className="empty-message">Nenhuma denúncia encontrada.</p>
              )}
            </div>

            {temMaisDenuncias && (
              <button
                type="button"
                className="more-btn"
                onClick={() => setQuantidadeVisivel((prev) => prev + 6)}
              >
                Ver mais denúncias <span>⌄</span>
              </button>
            )}
          </div>

          <aside className="dashboard-side">
            <section className="side-card">
              <div className="side-title">
                <h3>Mapa da cidade</h3>
              </div>

              <div className="map-box" onClick={() => setModalMapa(true)}>
                <span className="pin p1">{totalAbertas}</span>
                <span className="pin p2">{totalAndamento}</span>
                <span className="pin p3">{totalResolvidas}</span>
                <span className="pin p4">{denunciasPanorama.length}</span>
                <span className="pin center">📍</span>
              </div>
            </section>

            <section className="side-card">
              <div className="side-title">
                <h3>Panorama geral</h3>

                <div className="panorama-filter">
                  <select
                    value={periodoPanorama}
                    onChange={(e) => setPeriodoPanorama(e.target.value)}
                    className="panorama-select"
                  >
                    <option value="hoje">Hoje</option>
                    <option value="semana">Últimos 7 dias</option>
                    <option value="mes">Este mês</option>
                    <option value="todos">Todos</option>
                  </select>
                </div>
              </div>

              <div className="stats">
                <div className="stat-row">
                  <span className="stat-icon">📷</span>
                  <div className="stat-info">
                    <strong>Denúncias abertas</strong>
                    <small>{labelPeriodo()}</small>
                  </div>
                  <b className="stat-val stat-val--red">{totalAbertas}</b>
                </div>

                <div className="stat-row">
                  <span className="stat-icon">📦</span>
                  <div className="stat-info">
                    <strong>Em andamento</strong>
                    <small>{labelPeriodo()}</small>
                  </div>
                  <b className="stat-val stat-val--yellow">{totalAndamento}</b>
                </div>

                <div className="stat-row">
                  <span className="stat-icon">✅</span>
                  <div className="stat-info">
                    <strong>Resolvidas</strong>
                    <small>{labelPeriodo()}</small>
                  </div>
                  <b className="stat-val stat-val--green">{totalResolvidas}</b>
                </div>
              </div>
            </section>

            <section className="side-card call-card">
              <div className="call-icon">🌱</div>
              <h3>Faça a diferença!</h3>
              <p>Sua denúncia ajuda a construir uma cidade melhor para todos.</p>

              <Link to="/registrar-denuncia">
                <button type="button">＋ Registrar denúncia</button>
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
                type="button"
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