import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "..//components/NavBar";
import "../styles/DenunciasPublicas.css";

function formatarStatus(status) {
  if (status === "ABERTA") return "Aberta";
  if (status === "EM_ANDAMENTO") return "Em andamento";
  if (status === "RESOLVIDA") return "Resolvida";
  return status || "Não informado";
}

function statusClasse(status) {
  if (status === "ABERTA") return "aberta";
  if (status === "EM_ANDAMENTO") return "andamento";
  if (status === "RESOLVIDA") return "resolvida";
  return "aberta";
}

function statusMensagem(status) {
  if (status === "ABERTA") return "Aguardando atendimento";
  if (status === "EM_ANDAMENTO") return "Em análise pela prefeitura";
  if (status === "RESOLVIDA") return "Problema solucionado";
  return "Status não informado";
}

function formatarData(data) {
  if (!data) return "Data não informada";

  return new Date(data).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function obterRegiao(localizacao) {
  if (!localizacao) return "Não informada";

  const partes = localizacao.split("-");
  if (partes.length > 1) {
    return partes[partes.length - 1].trim();
  }

  return localizacao;
}

function obterEmoji(categoria) {
  const nome = categoria?.toLowerCase() || "";

  if (nome.includes("buraco")) return "🕳️";
  if (nome.includes("luz") || nome.includes("iluminação")) return "💡";
  if (nome.includes("lixo")) return "🗑️";
  if (nome.includes("água") || nome.includes("agua") || nome.includes("esgoto")) return "🚰";
  if (nome.includes("árvore") || nome.includes("arvore")) return "🌳";

  return "⚠️";
}

function StatusBadge({ status }) {
  const statusFront = statusClasse(status);

  const cls =
    statusFront === "aberta"
      ? "dp-status-badge dp-status-aberta"
      : statusFront === "andamento"
      ? "dp-status-badge dp-status-andamento"
      : "dp-status-badge dp-status-resolvida";

  return (
    <span className={cls}>
      <span className="dp-status-dot" />
      {formatarStatus(status)}
    </span>
  );
}

function DenunciasPublicas() {
  const navigate = useNavigate();

  const [denuncias, setDenuncias] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const [categoria, setCategoria] = useState("todas");
  const [situacao, setSituacao] = useState("todas");
  const [localizacao, setLocalizacao] = useState("todas");
  const [ordenacao, setOrdenacao] = useState("recentes");

  const [modalAberto, setModalAberto] = useState(false);
  const [denunciaSelecionada, setDenunciaSelecionada] = useState(null);

  const [mostrarFiltros, setMostrarFiltros] = useState(true);

  const API_CATEGORIAS = "http://localhost:8080/categorias";
  const API_DENUNCIAS = "http://localhost:8080/denuncias";

  useEffect(() => {
    async function carregarDados() {
      try {
        const responseCategorias = await fetch(API_CATEGORIAS);
        const categoriasData = await responseCategorias.json();
        setCategorias(categoriasData);

        const responseDenuncias = await fetch(API_DENUNCIAS);
        const denunciasData = await responseDenuncias.json();
        setDenuncias(denunciasData);
      } catch (error) {
        console.error("Erro ao carregar denúncias públicas:", error);
      }
    }

    carregarDados();
  }, []);

  useEffect(() => {
    setPagina(1);
  }, [busca, categoria, situacao, localizacao, ordenacao, itensPorPagina]);

  function abrirModal(denuncia) {
    setDenunciaSelecionada(denuncia);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setDenunciaSelecionada(null);
  }

  const regioes = useMemo(() => {
    const lista = denuncias.map((d) => obterRegiao(d.localizacao));
    return [...new Set(lista)].filter(Boolean);
  }, [denuncias]);

  const denunciasFiltradas = useMemo(() => {
    return denuncias
      .filter((d) => {
        const buscaTexto = busca.toLowerCase();
        const categoriaNome = d.categoria?.nome || "";
        const regiao = obterRegiao(d.localizacao).toLowerCase();

        const matchBusca =
          d.titulo?.toLowerCase().includes(buscaTexto) ||
          d.descricao?.toLowerCase().includes(buscaTexto) ||
          d.localizacao?.toLowerCase().includes(buscaTexto) ||
          categoriaNome.toLowerCase().includes(buscaTexto);

        const matchCategoria =
          categoria === "todas" || categoriaNome === categoria;

        const matchSituacao =
          situacao === "todas" || d.status === situacao;

        const matchLocalizacao =
          localizacao === "todas" || regiao === localizacao;

        return matchBusca && matchCategoria && matchSituacao && matchLocalizacao;
      })
      .sort((a, b) => {
        if (ordenacao === "antigas") {
          return new Date(a.dataCriacao) - new Date(b.dataCriacao);
        }

        return new Date(b.dataCriacao) - new Date(a.dataCriacao);
      });
  }, [denuncias, busca, categoria, situacao, localizacao, ordenacao]);

  const totalPaginas = Math.max(1, Math.ceil(denunciasFiltradas.length / itensPorPagina));
  const inicio = (pagina - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const denunciasPaginadas = denunciasFiltradas.slice(inicio, fim);

  return (
    <>
      <NavBar />


      <div className="dp-page">
        <div className="dp-content">
          <header className="dp-header">
            <div className="dp-header-eyebrow">CityFix · Transparência</div>
            <h1>Denúncias públicas</h1>
            <p>Acompanhe os problemas da sua cidade e veja o que está sendo feito.</p>
          </header>

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

              <button
                className="dp-filter-btn"
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
              >
                <span>⚙️</span>
                {mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"}
              </button>
            </div>

{mostrarFiltros && (
            <div className="dp-filters-row">
              <div className="dp-filter-select">
                <label>Categoria</label>

                <div className="dp-select-wrap">
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                  >
                    <option value="todas">Todas</option>

                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.nome}>
                        {cat.nome}
                      </option>
                    ))}
                  </select>

                  <span className="dp-filter-arrow">▼</span>
                </div>
              </div>

              <div className="dp-filter-select">
                <label>Situação</label>

                <div className="dp-select-wrap">
                  <select
                    value={situacao}
                    onChange={(e) => setSituacao(e.target.value)}
                  >
                    <option value="todas">Todas</option>
                    <option value="ABERTA">Aberta</option>
                    <option value="EM_ANDAMENTO">Em andamento</option>
                    <option value="RESOLVIDA">Resolvida</option>
                  </select>

                  <span className="dp-filter-arrow">▼</span>
                </div>
              </div>

              
              

              <div className="dp-filter-select">
                <label>Data</label>

                <div className="dp-select-wrap">
                  <select
                    value={ordenacao}
                    onChange={(e) => setOrdenacao(e.target.value)}
                  >
                    <option value="recentes">Mais recentes</option>
                    <option value="antigas">Mais antigas</option>
                  </select>

                  <span className="dp-filter-arrow">▼</span>
                </div>
              </div>

              <div className="dp-filter-select">
                <label>Localização</label>

                <div className="dp-select-wrap">
                  <select
                    value={localizacao}
                    onChange={(e) => setLocalizacao(e.target.value)}
                  >
                    <option value="todas">Todas as regiões</option>

                    {regioes.map((regiao) => (
                      <option key={regiao} value={regiao.toLowerCase()}>
                        {regiao}
                      </option>
                    ))}
                  </select>

                  <span className="dp-filter-arrow">▼</span>
                </div>
              </div> 
              
            </div>
            )}
          </section>

          <div className="dp-results-info">
            <span>{denunciasFiltradas.length} denúncias encontradas</span>
          </div>

          <div className="dp-list">
            {denunciasPaginadas.map((d) => (
              <article
                key={d.id}
                className="dp-card"
                onClick={() => abrirModal(d)}
              >
                <div className="dp-card-thumb">
                  <span className="dp-card-emoji">
                    {obterEmoji(d.categoria?.nome)}
                  </span>
                  <span className="dp-card-id">#{d.id}</span>
                </div>

                <div className="dp-card-body">
                  <div className="dp-card-top-row">
                    <h3 className="dp-card-title">{d.titulo}</h3>
                    <StatusBadge status={d.status} />
                  </div>

                  <div className="dp-card-location">
                    <span>📍</span>
                    <span>{d.localizacao}</span>
                  </div>

                  <p className="dp-card-desc">{d.descricao}</p>

                  <div className="dp-card-footer">
                    <div className="dp-card-meta">
                      <span>📅 {formatarData(d.dataCriacao)}</span>
                    </div>

                    <div className="dp-card-stats">
                      <span title="Comentários">💬 0</span>
                      <span title="Curtidas">🤍 0</span>
                      <span title="Visualizações">👁️ 0</span>
                    </div>
                  </div>
                </div>

                <div className="dp-card-right">
                  <div className="dp-card-status-info">
                    <p className="dp-status-msg">{statusMensagem(d.status)}</p>

                    <div className="dp-card-region">
                      <span>📍</span>
                      <span>{obterRegiao(d.localizacao)}</span>
                    </div>
                  </div>

                  <button
                    className="dp-card-arrow"
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirModal(d);
                    }}
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

          {modalAberto && denunciaSelecionada && (
            <div className="modal-overlay" onClick={fecharModal}>
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <div>
                    <h2>{denunciaSelecionada.titulo}</h2>
                    <span className="modal-id">#{denunciaSelecionada.id}</span>
                  </div>

                  <button onClick={fecharModal}>✕</button>
                </div>

                <div className="modal-status">
                  <StatusBadge status={denunciaSelecionada.status} />
                </div>

                <div className="modal-info-grid">
                  <div>
                    <h4>📍 Local</h4>
                    <p>{denunciaSelecionada.localizacao}</p>
                  </div>

                  <div>
                    <h4>📌 Região</h4>
                    <p>{obterRegiao(denunciaSelecionada.localizacao)}</p>
                  </div>

                  <div>
                    <h4>🏷️ Categoria</h4>
                    <p>{denunciaSelecionada.categoria?.nome || "Sem categoria"}</p>
                  </div>

                  <div>
                    <h4>📅 Data</h4>
                    <p>{formatarData(denunciaSelecionada.dataCriacao)}</p>
                  </div>
                </div>

                <div className="modal-desc">
                  <h4>Descrição</h4>
                  <p>{denunciaSelecionada.descricao}</p>
                </div>

                {denunciaSelecionada.imagens?.length > 0 && (
  <div className="modal-imagens">
    <h4>Imagens da denúncia</h4>

    <div className="modal-imagens-grid">
      {denunciaSelecionada.imagens.map((img) => (
        <img
          key={img.id}
          src={img.imagemUrl}
          alt={denunciaSelecionada.titulo}
          className="modal-imagem"
        />
      ))}
    </div>
  </div>
)}

                <div className="modal-stats">
                  <div>💬 0</div>
                  <div>🤍 0</div>
                  <div>👁️ 0</div>
                </div>
              </div>
            </div>
          )}

          <div className="dp-pagination-row">
            <div className="dp-per-page">
              <span>Itens por página:</span>

              <select
                value={itensPorPagina}
                onChange={(e) => setItensPorPagina(Number(e.target.value))}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>

            <span className="dp-count">
              {denunciasFiltradas.length === 0
                ? "0 de 0 denúncias"
                : `${inicio + 1}–${Math.min(fim, denunciasFiltradas.length)} de ${denunciasFiltradas.length} denúncias`}
            </span>

            <div className="dp-pages">
              <button
                className="dp-page-btn"
                disabled={pagina === 1}
                onClick={() => setPagina((p) => Math.max(p - 1, 1))}
              >
                ‹
              </button>

              {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                .slice(0, 5)
                .map((n) => (
                  <button
                    key={n}
                    className={`dp-page-btn ${pagina === n ? "active" : ""}`}
                    onClick={() => setPagina(n)}
                  >
                    {n}
                  </button>
                ))}

              {totalPaginas > 5 && (
                <button className="dp-page-btn" disabled>
                  …
                </button>
              )}

              <button
                className="dp-page-btn"
                disabled={pagina === totalPaginas}
                onClick={() => setPagina((p) => Math.min(p + 1, totalPaginas))}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DenunciasPublicas;