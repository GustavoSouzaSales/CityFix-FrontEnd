import "../styles/home.css";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

import imagemGenerica from "../../../assets/images/imagemGenerica.png";
import Notificacoes from "../components/Notificacao";

/* ══ TOAST ══ */
function Toast({ toasts, removeToast }) {
  return (
    <div className="home-toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`home-toast home-toast--${t.type}`}>
          <span className="home-toast-icon">
            {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
          </span>
          <span className="home-toast-msg">{t.message}</span>
          <button className="home-toast-close" onClick={() => removeToast(t.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  return { toasts, addToast, removeToast };
}

/* ══ CONFIRM MODAL ══ */
function ConfirmModal({ aberto, mensagem, onConfirmar, onCancelar }) {
  if (!aberto) return null;
  return (
    <div className="hd-confirm-overlay" onClick={onCancelar}>
      <div className="hd-confirm-box" onClick={(e) => e.stopPropagation()}>
        <div className="hd-confirm-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </div>
        <h3 className="hd-confirm-title">Apagar comentário</h3>
        <p className="hd-confirm-msg">{mensagem}</p>
        <div className="hd-confirm-actions">
          <button className="hd-confirm-cancel" onClick={onCancelar}>Cancelar</button>
          <button className="hd-confirm-delete" onClick={onConfirmar}>Apagar</button>
        </div>
      </div>
    </div>
  );
}


function IconComment() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

function IconHeart({ filled }) {
  return filled ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff6b6b" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function IconGear() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}

function IconSend() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}

/* ══ COMPONENTE PRINCIPAL ══ */
function Home() {
  const [quantidadeVisivel, setQuantidadeVisivel] = useState(6);
  const [denuncias, setDenuncias] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [modalMapa, setModalMapa] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(true);
  const [periodoPanorama, setPeriodoPanorama] = useState("mes");

  const [totaisComentarios, setTotaisComentarios] = useState({});
  const [totaisCurtidas, setTotaisCurtidas] = useState({});
  const [curtidasUsuario, setCurtidasUsuario] = useState({});

  const [modalDenuncia, setModalDenuncia] = useState(false);
  const [denunciaSelecionada, setDenunciaSelecionada] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");

  const [comentarioEditandoId, setComentarioEditandoId] = useState(null);
  const [textoEditando, setTextoEditando] = useState("");

  const [confirm, setConfirm] = useState({ aberto: false, comentarioId: null });
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const { toasts, addToast, removeToast } = useToast();

  const API_CATEGORIAS = "http://localhost:8080/categorias";
  const API_DENUNCIAS  = "http://localhost:8080/denuncias";
  const API_COMENTARIOS = "http://localhost:8080/comentarios";
  const API_CURTIDAS   = "http://localhost:8080/curtidas";

  useEffect(() => { carregarDados(); }, []);

  function usuarioIdLogado() { return usuario?.id || usuario?.usuarioId; }
  function usuarioEhAdmin() { return usuario?.tipoUsuario === "ADMINISTRADOR"; }
  function podeEditarComentario(c) { return c.usuarioId === usuarioIdLogado(); }
  function podeApagarComentario(c) { return c.usuarioId === usuarioIdLogado() || usuarioEhAdmin(); }

  async function carregarDados() {
    try {
      const usuarioId = usuarioIdLogado();
      const responseCategorias = await fetch(API_CATEGORIAS);
      const categoriasData = await responseCategorias.json();
      setCategorias(categoriasData);

      const responseDenuncias = await fetch(API_DENUNCIAS);
      const denunciasData = await responseDenuncias.json();
      setDenuncias(denunciasData);

      const comentariosTemp = {};
      const curtidasTemp = {};
      const curtidasUsuarioTemp = {};

      await Promise.all(
        denunciasData.map(async (denuncia) => {
          const rc = await fetch(`${API_COMENTARIOS}/denuncia/${denuncia.id}/total`);
          comentariosTemp[denuncia.id] = await rc.json();
          const rcu = await fetch(`${API_CURTIDAS}/denuncia/${denuncia.id}/total`);
          curtidasTemp[denuncia.id] = await rcu.json();
          if (usuarioId) {
            const ruu = await fetch(`${API_CURTIDAS}/denuncia/${denuncia.id}/usuario/${usuarioId}`);
            curtidasUsuarioTemp[denuncia.id] = await ruu.json();
          }
        })
      );

      setTotaisComentarios(comentariosTemp);
      setTotaisCurtidas(curtidasTemp);
      setCurtidasUsuario(curtidasUsuarioTemp);
    } catch (error) {
      console.error("Erro ao carregar dados da Home:", error);
    }
  }

  async function abrirDenuncia(denuncia) {
    setDenunciaSelecionada(denuncia);
    setModalDenuncia(true);
    setNovoComentario("");
    setComentarioEditandoId(null);
    setTextoEditando("");
    try {
      const response = await fetch(`${API_COMENTARIOS}/denuncia/${denuncia.id}`);
      const data = await response.json();
      setComentarios(data);
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
    }
  }

  function fecharDenuncia() {
    setModalDenuncia(false);
    setDenunciaSelecionada(null);
    setComentarios([]);
    setNovoComentario("");
    setComentarioEditandoId(null);
    setTextoEditando("");
  }

  async function enviarComentario() {
    const usuarioId = usuarioIdLogado();
    if (!usuarioId) { addToast("Você precisa estar logado para comentar.", "error"); return; }
    if (!novoComentario.trim()) { addToast("Digite algo antes de comentar.", "error"); return; }
    try {
      const response = await fetch(API_COMENTARIOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: novoComentario, usuarioId, denunciaId: denunciaSelecionada.id }),
      });
      if (!response.ok) { addToast("Não foi possível enviar o comentário.", "error"); return; }
      const comentarioSalvo = await response.json();
      setComentarios((prev) => [comentarioSalvo, ...prev]);
      setNovoComentario("");
      setTotaisComentarios((prev) => ({ ...prev, [denunciaSelecionada.id]: (prev[denunciaSelecionada.id] || 0) + 1 }));
    } catch (error) {
      console.error("Erro ao comentar:", error);
    }
  }

  function iniciarEdicao(comentario) {
    setComentarioEditandoId(comentario.id);
    setTextoEditando(comentario.texto);
  }

  function cancelarEdicao() {
    setComentarioEditandoId(null);
    setTextoEditando("");
  }

  async function salvarEdicao(comentarioId) {
    const usuarioId = usuarioIdLogado();
    if (!textoEditando.trim()) { addToast("O comentário não pode ficar vazio.", "error"); return; }
    try {
      const response = await fetch(`${API_COMENTARIOS}/${comentarioId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: textoEditando, usuarioId, denunciaId: denunciaSelecionada.id }),
      });
      if (!response.ok) { addToast("Erro ao editar comentário.", "error"); return; }
      const comentarioAtualizado = await response.json();
      setComentarios((prev) => prev.map((c) => (c.id === comentarioId ? comentarioAtualizado : c)));
      cancelarEdicao();
    } catch (error) {
      console.error("Erro ao editar comentário:", error);
    }
  }

  async function apagarComentario(comentarioId) {
    const usuarioId = usuarioIdLogado();
    setConfirm({ aberto: true, comentarioId });
  }

  async function confirmarApagar() {
    const usuarioId = usuarioIdLogado();
    const { comentarioId } = confirm;
    setConfirm({ aberto: false, comentarioId: null });
    try {
      const response = await fetch(`${API_COMENTARIOS}/${comentarioId}/usuario/${usuarioId}`, { method: "DELETE" });
      if (!response.ok) { addToast("Erro ao apagar comentário.", "error"); return; }
      setComentarios((prev) => prev.filter((c) => c.id !== comentarioId));
      setTotaisComentarios((prev) => ({
        ...prev,
        [denunciaSelecionada.id]: Math.max((prev[denunciaSelecionada.id] || 1) - 1, 0),
      }));
      addToast("Comentário apagado.", "info");
    } catch (error) {
      console.error("Erro ao apagar comentário:", error);
    }
  }

  async function alternarCurtida(denunciaId) {
    const usuarioId = usuarioIdLogado();
    if (!usuarioId) { addToast("Você precisa estar logado para curtir.", "error"); return; }
    const jaCurtiu = curtidasUsuario[denunciaId];
    try {
      const response = await fetch(API_CURTIDAS, {
        method: jaCurtiu ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId, denunciaId }),
      });
      if (!response.ok) { addToast("Erro ao atualizar curtida.", "error"); return; }
      setCurtidasUsuario((prev) => ({ ...prev, [denunciaId]: !jaCurtiu }));
      setTotaisCurtidas((prev) => ({
        ...prev,
        [denunciaId]: jaCurtiu ? Math.max((prev[denunciaId] || 1) - 1, 0) : (prev[denunciaId] || 0) + 1,
      }));
    } catch (error) {
      console.error("Erro ao curtir:", error);
    }
  }

  const categoriasFiltro = [
    { id: "todas", nome: "Todas", icon: "▦" },
    ...categorias.map((c) => ({ id: c.id, nome: c.nome, icon: "⚠" })),
  ];

  function denunciaDentroDoPeriodo(denuncia) {
    if (periodoPanorama === "todos") return true;
    if (!denuncia.dataCriacao) return false;
    const dataDenuncia = new Date(denuncia.dataCriacao);
    const hoje = new Date();
    const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const inicioSemana = new Date(inicioHoje);
    inicioSemana.setDate(inicioHoje.getDate() - 7);
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    if (periodoPanorama === "hoje")   return dataDenuncia >= inicioHoje;
    if (periodoPanorama === "semana") return dataDenuncia >= inicioSemana;
    if (periodoPanorama === "mes")    return dataDenuncia >= inicioMes;
    return true;
  }

  function labelPeriodo() {
    if (periodoPanorama === "hoje")   return "Hoje";
    if (periodoPanorama === "semana") return "Últimos 7 dias";
    if (periodoPanorama === "mes")    return "Este mês";
    return "Todos";
  }

  const denunciasFiltradas = denuncias.filter((item) => {
    const buscaTexto = busca.toLowerCase();
    const categoriaOk = categoriaAtiva === "Todas" || item.categoria?.nome === categoriaAtiva;
    const buscaOk =
      item.titulo?.toLowerCase().includes(buscaTexto) ||
      item.localizacao?.toLowerCase().includes(buscaTexto) ||
      item.descricao?.toLowerCase().includes(buscaTexto);
    return categoriaOk && buscaOk;
  });

  const denunciasPanorama = denuncias.filter(denunciaDentroDoPeriodo);
  const denunciasVisiveis = denunciasFiltradas.slice(0, quantidadeVisivel);
  const temMaisDenuncias  = quantidadeVisivel < denunciasFiltradas.length;

  const totalAbertas   = denunciasPanorama.filter((d) => d.status === "ABERTA").length;
  const totalAndamento = denunciasPanorama.filter((d) => d.status === "EM_ANDAMENTO").length;
  const totalResolvidas = denunciasPanorama.filter((d) => d.status === "RESOLVIDA").length;

  function formatarStatus(status) {
    if (status === "ABERTA")       return "Aberta";
    if (status === "EM_ANDAMENTO") return "Em andamento";
    if (status === "RESOLVIDA")    return "Resolvida";
    return status;
  }

  function classeStatus(status) {
    if (status === "ABERTA")       return "aberta";
    if (status === "EM_ANDAMENTO") return "andamento";
    if (status === "RESOLVIDA")    return "resolvida";
    return "";
  }

  function formatarData(data) {
    if (!data) return "Data não informada";
    return new Date(data).toLocaleDateString("pt-BR");
  }

  /* iniciais do nome do comentarista */
  function iniciais(nome) {
    if (!nome) return "?";
    return nome.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  }

  return (
    <div className="home-page">
      <NavBar />
      <Toast toasts={toasts} removeToast={removeToast} />
      <ConfirmModal
        aberto={confirm.aberto}
        mensagem="Esta ação não pode ser desfeita. Tem certeza que deseja apagar este comentário?"
        onConfirmar={confirmarApagar}
        onCancelar={() => setConfirm({ aberto: false, comentarioId: null })}
      />

      <main className="home-main">
        <header className="home-header">
          <div className="home-header-text">
            <div className="home-eyebrow">Painel da comunidade</div>
            <h1>Olá, {usuario?.nome || "Cliente"}! 👋</h1>
            <p>Vamos juntos melhorar nossa cidade.</p>
          </div>
          <div className="home-actions"><Notificacoes /></div>
        </header>

        <section className="home-search">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar denúncias (ex: buraco, lixo, iluminação...)"
              value={busca}
              onChange={(e) => { setBusca(e.target.value); setQuantidadeVisivel(6); }}
            />
          </div>

          {/* ── Botão filtros com engrenagem ── */}
          <button
            type="button"
            className={`filter-btn ${mostrarFiltros ? "active" : ""}`}
            onClick={() => setMostrarFiltros((prev) => !prev)}
          >
            <span className={`filter-gear ${mostrarFiltros ? "filter-gear--spin" : ""}`}>
              <IconGear />
            </span>
            {mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"}
          </button>
        </section>

        {mostrarFiltros && (
          <section className="categories">
            {categoriasFiltro.map((item) => (
              <button key={item.id} type="button"
                onClick={() => { setCategoriaAtiva(item.nome); setQuantidadeVisivel(6); }}
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
              <span className="reports-count">{denunciasFiltradas.length} registros</span>
            </div>

            <div className="reports-grid">
              {denunciasFiltradas.length > 0 ? (
                denunciasVisiveis.map((item) => (
                  <article className="report-card" key={item.id} onClick={() => abrirDenuncia(item)}>
                    <div className="report-image">
                      <img src={item.imagens?.length > 0 ? item.imagens[0].imagemUrl : imagemGenerica} alt={item.titulo} />
                      <div className="report-image-overlay" />
                      <span className={`status ${classeStatus(item.status)}`}>{formatarStatus(item.status)}</span>
                    </div>

                    <div className="report-body">
                      <h3>{item.titulo}</h3>
                      <p className="report-address">
                        <span className="report-addr-icon">📍</span>
                        {item.localizacao}
                      </p>
                      <p className="report-time">{formatarData(item.dataCriacao)}</p>
                      <div className="report-divider" />

                      <div className="report-footer">
                        {/* Comentários */}
                        <span className="report-action report-action--comment">
                          <IconComment />
                          {totaisComentarios[item.id] || 0}
                        </span>

                        {/* Curtidas */}
                        <button
                          type="button"
                          className={`report-like-btn ${curtidasUsuario[item.id] ? "report-like-btn--active" : ""}`}
                          onClick={(e) => { e.stopPropagation(); alternarCurtida(item.id); }}
                          title="Curtir"
                        >
                          <IconHeart filled={!!curtidasUsuario[item.id]} />
                          {totaisCurtidas[item.id] || 0}
                        </button>

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
              <button type="button" className="more-btn" onClick={() => setQuantidadeVisivel((prev) => prev + 6)}>
                Ver mais denúncias <span>⌄</span>
              </button>
            )}
          </div>

          <aside className="dashboard-side">
            <section className="side-card">
              <div className="side-title"><h3>Mapa da cidade</h3></div>
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
                  <select value={periodoPanorama} onChange={(e) => setPeriodoPanorama(e.target.value)} className="panorama-select">
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
                  <div className="stat-info"><strong>Denúncias abertas</strong><small>{labelPeriodo()}</small></div>
                  <b className="stat-val stat-val--red">{totalAbertas}</b>
                </div>
                <div className="stat-row">
                  <span className="stat-icon">📦</span>
                  <div className="stat-info"><strong>Em andamento</strong><small>{labelPeriodo()}</small></div>
                  <b className="stat-val stat-val--yellow">{totalAndamento}</b>
                </div>
                <div className="stat-row">
                  <span className="stat-icon">✅</span>
                  <div className="stat-info"><strong>Resolvidas</strong><small>{labelPeriodo()}</small></div>
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

      {/* ══ MODAL MAPA ══ */}
      {modalMapa && (
        <div className="admin-modal-overlay" onClick={() => setModalMapa(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <p className="modal-eyebrow">Mapa da cidade</p>
                <h2>Mapa da cidade</h2>
                <p className="modal-sub">Visualize as denúncias registradas no mapa.</p>
              </div>
              <button type="button" className="admin-close" onClick={() => setModalMapa(false)}>✕</button>
            </div>
            <div className="admin-map-real">
              <iframe title="Mapa de Irecê" src="https://maps.google.com/maps?q=Irecê%20BA&t=&z=13&ie=UTF8&iwloc=&output=embed" width="100%" height="450" style={{ border: 0 }} loading="lazy" />
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL DENÚNCIA — REDESENHADO ══ */}
      {modalDenuncia && denunciaSelecionada && (
        <div className="admin-modal-overlay" onClick={fecharDenuncia}>
          <div className="hd-modal" onClick={(e) => e.stopPropagation()}>

            {/* Linha neon topo */}
            <div className="hd-modal-neon" />

            {/* Header */}
            <div className="hd-modal-header">
              <div className="hd-modal-header-left">
                <span className={`hd-modal-status hd-status--${classeStatus(denunciaSelecionada.status)}`}>
                  {formatarStatus(denunciaSelecionada.status)}
                </span>
                <div>
                  <p className="hd-modal-eyebrow">Denúncia pública · {denunciaSelecionada.categoria?.nome || "Sem categoria"}</p>
                  <h2 className="hd-modal-title">{denunciaSelecionada.titulo}</h2>
                  <p className="hd-modal-local">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {denunciaSelecionada.localizacao}
                  </p>
                </div>
              </div>
              <button type="button" className="admin-close" onClick={fecharDenuncia}>✕</button>
            </div>

            <div className="hd-modal-body">

              {/* Descrição */}
              <div className="hd-descricao">
                <p>{denunciaSelecionada.descricao}</p>
              </div>

              {/* Stats bar */}
              <div className="hd-stats-bar">
                <div className="hd-stat">
                  <span className="hd-stat-icon hd-stat-icon--comment"><IconComment /></span>
                  <span>{comentarios.length} comentário{comentarios.length !== 1 ? "s" : ""}</span>
                </div>

                <button
                  type="button"
                  className={`hd-like-btn ${curtidasUsuario[denunciaSelecionada.id] ? "hd-like-btn--active" : ""}`}
                  onClick={() => alternarCurtida(denunciaSelecionada.id)}
                >
                  <span className="hd-like-icon">
                    <IconHeart filled={!!curtidasUsuario[denunciaSelecionada.id]} />
                  </span>
                  <span>{totaisCurtidas[denunciaSelecionada.id] || 0}</span>
                  <span className="hd-like-label">{curtidasUsuario[denunciaSelecionada.id] ? "Curtido" : "Curtir"}</span>
                </button>
              </div>

              {/* Formulário de comentário */}
              <div className="hd-comentario-form">
                <div className="hd-form-avatar">
                  {iniciais(usuario?.nome)}
                </div>
                <div className="hd-form-inner">
                  <textarea
                    placeholder="Escreva um comentário sobre esta denúncia..."
                    value={novoComentario}
                    onChange={(e) => setNovoComentario(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) enviarComentario();
                    }}
                  />
                  <div className="hd-form-footer">
                    <span className="hd-form-hint">Ctrl + Enter para enviar</span>
                    <button type="button" className="hd-send-btn" onClick={enviarComentario}>
                      <IconSend /> Comentar
                    </button>
                  </div>
                </div>
              </div>

              {/* Lista de comentários */}
              <div className="hd-comentarios-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Comentários {comentarios.length > 0 && <span className="hd-count-badge">{comentarios.length}</span>}
              </div>

              <div className="hd-comentarios-list">
                {comentarios.length > 0 ? (
                  comentarios.map((comentario, i) => (
                    <div key={comentario.id} className="hd-comentario-item" style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className="hd-comentario-avatar">
                        {iniciais(comentario.nomeUsuario)}
                      </div>

                      <div className="hd-comentario-content">
                        <div className="hd-comentario-header">
                          <strong className="hd-comentario-nome">{comentario.nomeUsuario}</strong>
                          {(podeEditarComentario(comentario) || podeApagarComentario(comentario)) && (
                            <div className="hd-comentario-actions">
                              {podeEditarComentario(comentario) && (
                                <button type="button" className="hd-action-btn hd-action-btn--edit" onClick={() => iniciarEdicao(comentario)}>
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                  </svg>
                                  Editar
                                </button>
                              )}
                              {podeApagarComentario(comentario) && (
                                <button type="button" className="hd-action-btn hd-action-btn--delete" onClick={() => apagarComentario(comentario.id)}>
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                                  </svg>
                                  Apagar
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {comentarioEditandoId === comentario.id ? (
                          <div className="hd-edit-form">
                            <textarea value={textoEditando} onChange={(e) => setTextoEditando(e.target.value)} />
                            <div className="hd-edit-actions">
                              <button type="button" className="hd-edit-save" onClick={() => salvarEdicao(comentario.id)}>Salvar</button>
                              <button type="button" className="hd-edit-cancel" onClick={cancelarEdicao}>Cancelar</button>
                            </div>
                          </div>
                        ) : (
                          <p className="hd-comentario-texto">{comentario.texto}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="hd-empty-comments">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <p>Nenhum comentário ainda.</p>
                    <small>Seja o primeiro a comentar!</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;