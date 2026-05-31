import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "..//components/NavBar";
import "../styles/DenunciasPublicas.css";

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
  return (
    <span className={cls}>
      <span className="dp-status-dot" />
      {label}
    </span>
  );
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

      {/* Topbar — só notificação */}
      <div className="dp-topbar">
        <button className="dp-notif-btn">
          <span>🔔</span>
          <span className="dp-notif-badge">2</span>
        </button>
      </div>

      <div className="dp-page">
        <div className="dp-content">

          {/* ── HEADER ── */}
          <header className="dp-header">
            <div className="dp-header-eyebrow">CityFix · Transparência</div>
            <h1>Denúncias públicas</h1>
            <p>Acompanhe os problemas da sua cidade e veja o que está sendo feito.</p>
          </header>

          {/* ── BARRA DE BUSCA + FILTROS ── */}
          <section className="dp-toolbar">
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

            <div className="dp-filters-row">
              {[
                {
                  label: "Categoria",
                  defaultValue: "todas",
                  options: [
                    { value: "todas", label: "Todas" },
                    { value: "buraco", label: "Buraco na via" },
                    { value: "iluminacao", label: "Iluminação" },
                    { value: "lixo", label: "Lixo" },
                    { value: "esgoto", label: "Esgoto" },
                  ],
                },
                {
                  label: "Situação",
                  defaultValue: "todas",
                  options: [
                    { value: "todas", label: "Todas" },
                    { value: "aberta", label: "Aberta" },
                    { value: "andamento", label: "Em andamento" },
                    { value: "resolvida", label: "Resolvida" },
                  ],
                },
                {
                  label: "Data",
                  defaultValue: "recentes",
                  options: [
                    { value: "recentes", label: "Mais recentes" },
                    { value: "antigas", label: "Mais antigas" },
                  ],
                },
                {
                  label: "Localização",
                  defaultValue: "todas",
                  options: [
                    { value: "todas", label: "Todas as regiões" },
                    { value: "centro", label: "Centro" },
                    { value: "jardim", label: "Jardim América" },
                    { value: "saojose", label: "São José" },
                  ],
                },
              ].map((f) => (
                <div className="dp-filter-select" key={f.label}>
                  <label>{f.label}</label>
                  <div className="dp-select-wrap">
                    <select defaultValue={f.defaultValue}>
                      {f.options.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <span className="dp-filter-arrow">▼</span>
                  </div>
                </div>
              ))}

              <div className="dp-filter-select dp-order-select">
                <label>Ordenar por</label>
                <div className="dp-select-wrap">
                  <select defaultValue="recentes">
                    <option value="recentes">Mais recentes</option>
                    <option value="curtidas">Mais curtidas</option>
                    <option value="visualizacoes">Mais vistas</option>
                  </select>
                  <span className="dp-filter-arrow">▼</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── CONTADOR DE RESULTADOS ── */}
          <div className="dp-results-info">
            <span>{denunciasFiltradas.length} denúncias encontradas</span>
          </div>

          {/* ── LISTA DE CARDS ── */}
          <div className="dp-list">
            {denunciasFiltradas.map((d) => (
              <article key={d.id} className="dp-card" onClick={() => navigate(`/denuncias/${d.id}`)}>

                {/* Coluna esquerda: emoji */}
                <div className="dp-card-thumb">
                  <span className="dp-card-emoji">{d.emoji}</span>
                  <span className="dp-card-id">#{d.id}</span>
                </div>

                {/* Coluna central: info */}
                <div className="dp-card-body">
                  <div className="dp-card-top-row">
                    <h3 className="dp-card-title">{d.titulo}</h3>
                    <StatusBadge status={d.status} label={d.statusLabel} />
                  </div>

                  <div className="dp-card-location">
                    <span>📍</span>
                    <span>{d.localizacao}</span>
                  </div>

                  <p className="dp-card-desc">{d.descricao}</p>

                  <div className="dp-card-footer">
                    <div className="dp-card-meta">
                      <span>📅 {d.data}</span>
                    </div>
                    <div className="dp-card-stats">
                      <span title="Comentários">💬 {d.comentarios}</span>
                      <span title="Curtidas">🤍 {d.curtidas}</span>
                      <span title="Visualizações">👁️ {d.visualizacoes}</span>
                    </div>
                  </div>
                </div>

                {/* Coluna direita: status + seta */}
                <div className="dp-card-right">
                  <div className="dp-card-status-info">
                    <p className="dp-status-msg">{d.statusMsg}</p>
                    <div className="dp-card-region">
                      <span>📍</span>
                      <span>{d.regiao}</span>
                    </div>
                  </div>
                  <button
                    className="dp-card-arrow"
                    onClick={(e) => { e.stopPropagation(); navigate(`/denuncias/${d.id}`); }}
                    aria-label="Ver detalhes"
                  >
                    ›
                  </button>
                </div>

              </article>
            ))}

            {denunciasFiltradas.length === 0 && (
              <div className="dp-empty">
                <span>🔎</span>
                <p>Nenhuma denúncia encontrada para a busca realizada.</p>
              </div>
            )}
          </div>

          {/* ── PAGINAÇÃO ── */}
          <div className="dp-pagination-row">
            <div className="dp-per-page">
              <span>Itens por página:</span>
              <select defaultValue="10">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>

            <span className="dp-count">1–10 de 128 denúncias</span>

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
              <button className="dp-page-btn" disabled>…</button>
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