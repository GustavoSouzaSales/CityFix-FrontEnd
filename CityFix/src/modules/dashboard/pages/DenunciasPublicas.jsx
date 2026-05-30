import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "..//components/NavBar";
import "../styles/DenunciasPublicas.css";

// Dados mockados baseados no mockup
const DENUNCIAS_MOCK = [
  {
    id: "DF2451",
    titulo: "Buraco na via",
    localizacao: "Rua das Flores, 123 - Centro",
    descricao: "Buraco grande na via, oferecendo risco para motoristas e pedestres.",
    data: "10/05/2025 às 10:23",
    status: "aberta",
    statusLabel: "Aberta",
    statusMsg: "Aguardando atendimento",
    regiao: "Centro",
    comentarios: 3,
    curtidas: 12,
    visualizacoes: 156,
    emoji: "🕳️",
  },
  {
    id: "DF2447",
    titulo: "Poste com luz apagada",
    localizacao: "Av. Brasil, 450 - Jardim América",
    descricao: "Poste com lâmpada queimada há mais de uma semana.",
    data: "08/05/2025 às 20:15",
    status: "andamento",
    statusLabel: "Em andamento",
    statusMsg: "Em análise pela prefeitura",
    regiao: "Jardim América",
    comentarios: 2,
    curtidas: 8,
    visualizacoes: 98,
    emoji: "💡",
  },
  {
    id: "DF2432",
    titulo: "Lixo acumulado",
    localizacao: "Rua das Palmeiras, 78 - Centro",
    descricao: "Acúmulo de lixo na calçada, atraindo animais e causando mau cheiro.",
    data: "05/05/2025 às 14:42",
    status: "resolvida",
    statusLabel: "Resolvida",
    statusMsg: "Problema solucionado",
    regiao: "Centro",
    comentarios: 5,
    curtidas: 15,
    visualizacoes: 210,
    emoji: "🗑️",
  },
  {
    id: "DF2419",
    titulo: "Vazamento de esgoto",
    localizacao: "Rua do Sol, 56 - São José",
    descricao: "Vazamento de esgoto na via, com mau cheiro forte.",
    data: "01/05/2025 às 09:30",
    status: "resolvida",
    statusLabel: "Resolvida",
    statusMsg: "Problema solucionado",
    regiao: "São José",
    comentarios: 4,
    curtidas: 11,
    visualizacoes: 134,
    emoji: "🚰",
  },
];

function StatusBadge({ status, label }) {
  const cls =
    status === "aberta"
      ? "dp-status-badge dp-status-aberta"
      : status === "andamento"
      ? "dp-status-badge dp-status-andamento"
      : "dp-status-badge dp-status-resolvida";
  return <span className={cls}>{label}</span>;
}

function DenunciasPublicas() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);

  const denunciasFiltradas = DENUNCIAS_MOCK.filter(
    (d) =>
      d.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      d.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <>
      <NavBar />

      {/* Topbar */}
      <div className="dp-topbar">
        <button className="dp-notif-btn">
          <span>🔔</span>
          <span className="dp-notif-badge">2</span>
        </button>
        <div className="dp-user-info">
          <div className="dp-user-avatar">👤</div>
          <span className="dp-user-name">João Silva</span>
          <span style={{ color: "#888", fontSize: 12 }}>▾</span>
        </div>
      </div>

      <div className="dp-page">
        <div className="dp-content">

          {/* Header */}
          <div className="dp-header">
            <h1>Denúncias públicas</h1>
            <p>Acompanhe os problemas da sua cidade e veja o que está sendo feito.</p>
          </div>

          {/* Search + Filter button */}
          <div className="dp-search-row">
            <div className="dp-search-wrap">
              <span className="dp-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Buscar denúncias (ex: buraco, lixo, iluminação...)"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
            <button className="dp-filter-btn">
              <span>⚙️</span> Filtros
            </button>
          </div>

          {/* Filter dropdowns */}
          <div className="dp-filters-row">
            <div className="dp-filter-select">
              <label>Categoria</label>
              <select defaultValue="todas">
                <option value="todas">Todas</option>
                <option value="buraco">Buraco na via</option>
                <option value="iluminacao">Iluminação</option>
                <option value="lixo">Lixo</option>
                <option value="esgoto">Esgoto</option>
              </select>
              <span className="dp-filter-arrow">▼</span>
            </div>

            <div className="dp-filter-select">
              <label>Situação</label>
              <select defaultValue="todas">
                <option value="todas">Todas</option>
                <option value="aberta">Aberta</option>
                <option value="andamento">Em andamento</option>
                <option value="resolvida">Resolvida</option>
              </select>
              <span className="dp-filter-arrow">▼</span>
            </div>

            <div className="dp-filter-select">
              <label>Data</label>
              <select defaultValue="recentes">
                <option value="recentes">Mais recentes</option>
                <option value="antigas">Mais antigas</option>
              </select>
              <span className="dp-filter-arrow">▼</span>
            </div>

            <div className="dp-filter-select">
              <label>Localização</label>
              <select defaultValue="todas">
                <option value="todas">Todas as regiões</option>
                <option value="centro">Centro</option>
                <option value="jardim">Jardim América</option>
                <option value="saojose">São José</option>
              </select>
              <span className="dp-filter-arrow">▼</span>
            </div>

            <div className="dp-filter-select dp-order-select">
              <label>Ordenar por</label>
              <select defaultValue="recentes">
                <option value="recentes">Mais recentes</option>
                <option value="curtidas">Mais curtidas</option>
                <option value="visualizacoes">Mais vistas</option>
              </select>
              <span className="dp-filter-arrow">▼</span>
            </div>
          </div>

          {/* Cards */}
          <div className="dp-list">
            {denunciasFiltradas.map((d) => (
              <div key={d.id} className="dp-card">
                {/* Imagem / placeholder */}
                <div className="dp-card-img-placeholder">
                  {d.emoji}
                </div>

                {/* Body */}
                <div className="dp-card-body">
                  <div>
                    <div className="dp-card-title">{d.titulo}</div>
                    <div className="dp-card-location">
                      <span>📍</span>
                      <span>{d.localizacao}</span>
                    </div>
                    <p className="dp-card-desc">{d.descricao}</p>
                  </div>
                  <div className="dp-card-meta">
                    <span>📅 {d.data}</span>
                    <span>• ID: #{d.id}</span>
                  </div>
                </div>

                {/* Right panel */}
                <div className="dp-card-right">
                  <div className="dp-card-right-top">
                    <StatusBadge status={d.status} label={d.statusLabel} />
                    <span className="dp-status-label">{d.statusMsg}</span>
                    <div className="dp-card-region">
                      <span>📍</span>
                      <span>{d.regiao}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div className="dp-card-stats">
                      <span>💬 {d.comentarios}</span>
                      <span>🤍 {d.curtidas}</span>
                      <span>👁️ {d.visualizacoes}</span>
                    </div>
                    <button
                      className="dp-card-arrow"
                      onClick={() => navigate(`/denuncias/${d.id}`)}
                    >
                      ›
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="dp-pagination-row">
            <div className="dp-per-page">
              <span>Itens por página:</span>
              <select defaultValue="10">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>

            <span className="dp-count">1-10 de 128 denúncias</span>

            <div className="dp-pages">
              <button className="dp-page-btn" disabled={pagina === 1} onClick={() => setPagina(p => p - 1)}>‹</button>
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  className={`dp-page-btn ${pagina === n ? "active" : ""}`}
                  onClick={() => setPagina(n)}
                >
                  {n}
                </button>
              ))}
              <button className="dp-page-btn" disabled>...</button>
              <button className="dp-page-btn" onClick={() => setPagina(13)}>13</button>
              <button className="dp-page-btn" onClick={() => setPagina(p => Math.min(p + 1, 13))}>›</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default DenunciasPublicas;
