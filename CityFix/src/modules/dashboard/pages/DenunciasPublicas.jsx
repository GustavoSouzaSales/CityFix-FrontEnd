import { useEffect, useMemo, useState, useCallback } from "react";
import NavBar from "..//components/NavBar";
import "../styles/DenunciasPublicas.css";

/* ══ HELPERS ══ */
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
  return new Date(data).toLocaleString("pt-BR", { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" });
}
function obterRegiao(localizacao) {
  if (!localizacao) return "Não informada";
  const partes = localizacao.split("-");
  if (partes.length > 1) return partes[partes.length - 1].trim();
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
function iniciais(nome) {
  if (!nome) return "?";
  return nome.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

/* ══ STATUS BADGE ══ */
function StatusBadge({ status }) {
  const sf = statusClasse(status);
  const cls = sf === "aberta" ? "dp-status-badge dp-status-aberta"
    : sf === "andamento" ? "dp-status-badge dp-status-andamento"
    : "dp-status-badge dp-status-resolvida";
  return (
    <span className={cls}>
      <span className="dp-status-dot" />
      {formatarStatus(status)}
    </span>
  );
}

/* ══ TOAST ══ */
function Toast({ toasts, removeToast }) {
  return (
    <div className="dp-toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`dp-toast dp-toast--${t.type}`}>
          <span className="dp-toast-icon">{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
          <span className="dp-toast-msg">{t.message}</span>
          <button className="dp-toast-close" onClick={() => removeToast(t.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}
function useToast() {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4500);
  }, []);
  const removeToast = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);
  return { toasts, addToast, removeToast };
}

/* ══ CONFIRM MODAL ══ */
function ConfirmModal({ aberto, onConfirmar, onCancelar }) {
  if (!aberto) return null;
  return (
    <div className="dp-confirm-overlay" onClick={onCancelar}>
      <div className="dp-confirm-box" onClick={e => e.stopPropagation()}>
        <div className="dp-confirm-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </div>
        <h3 className="dp-confirm-title">Apagar comentário</h3>
        <p className="dp-confirm-msg">Esta ação não pode ser desfeita. Tem certeza que deseja apagar este comentário?</p>
        <div className="dp-confirm-actions">
          <button className="dp-confirm-cancel" onClick={onCancelar}>Cancelar</button>
          <button className="dp-confirm-delete" onClick={onConfirmar}>Apagar</button>
        </div>
      </div>
    </div>
  );
}

/* ══ ÍCONES ══ */
function IconComment() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
function IconHeart({ filled }) {
  return filled ? (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#ff6b6b" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ) : (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
function IconSend() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}

/* ══ COMPONENTE PRINCIPAL ══ */
function DenunciasPublicas() {
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
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [totaisComentarios, setTotaisComentarios] = useState({});
  const [totaisCurtidas, setTotaisCurtidas] = useState({});
  const [curtidasUsuario, setCurtidasUsuario] = useState({});
  const [comentarioEditandoId, setComentarioEditandoId] = useState(null);
  const [textoEditando, setTextoEditando] = useState("");
  const [confirm, setConfirm] = useState({ aberto: false, comentarioId: null });

  const { toasts, addToast, removeToast } = useToast();

  const API_CATEGORIAS = "http://localhost:8080/categorias";
  const API_DENUNCIAS  = "http://localhost:8080/denuncias";
  const API_COMENTARIOS = "http://localhost:8080/comentarios";
  const API_CURTIDAS   = "http://localhost:8080/curtidas";

  useEffect(() => { carregarDados(); }, []);
  useEffect(() => { setPagina(1); }, [busca, categoria, situacao, localizacao, ordenacao, itensPorPagina]);

  function usuarioLogado() { return JSON.parse(localStorage.getItem("usuario")); }
  function usuarioIdLogado() { const u = usuarioLogado(); return u?.id || u?.usuarioId; }
  function usuarioEhAdmin() { return usuarioLogado()?.tipoUsuario === "ADMINISTRADOR"; }
  function podeEditarComentario(c) { return c.usuarioId === usuarioIdLogado(); }
  function podeApagarComentario(c) { return c.usuarioId === usuarioIdLogado() || usuarioEhAdmin(); }

  async function carregarDados() {
    try {
      const usuario = usuarioLogado();
      const [resCat, resDen] = await Promise.all([fetch(API_CATEGORIAS), fetch(API_DENUNCIAS)]);
      const categoriasData = await resCat.json();
      const denunciasData  = await resDen.json();
      setCategorias(categoriasData);
      setDenuncias(denunciasData);
      const totComentarios = {}, totCurtidas = {}, curtUsuario = {};
      await Promise.all(denunciasData.map(async d => {
        const rc = await fetch(`${API_COMENTARIOS}/denuncia/${d.id}/total`);
        totComentarios[d.id] = await rc.json();
        const rcu = await fetch(`${API_CURTIDAS}/denuncia/${d.id}/total`);
        totCurtidas[d.id] = await rcu.json();
        if (usuario?.id || usuario?.usuarioId) {
          const uid = usuario.id || usuario.usuarioId;
          const ru = await fetch(`${API_CURTIDAS}/denuncia/${d.id}/usuario/${uid}`);
          curtUsuario[d.id] = await ru.json();
        }
      }));
      setTotaisComentarios(totComentarios);
      setTotaisCurtidas(totCurtidas);
      setCurtidasUsuario(curtUsuario);
    } catch (e) { console.error("Erro ao carregar:", e); }
  }

  async function abrirModal(denuncia) {
    setDenunciaSelecionada(denuncia);
    setModalAberto(true);
    setNovoComentario(""); setComentarioEditandoId(null); setTextoEditando("");
    try {
      const r = await fetch(`${API_COMENTARIOS}/denuncia/${denuncia.id}`);
      setComentarios(await r.json());
    } catch (e) { console.error(e); }
  }

  function fecharModal() {
    setModalAberto(false); setDenunciaSelecionada(null);
    setComentarios([]); setNovoComentario("");
    setComentarioEditandoId(null); setTextoEditando("");
  }

  async function enviarComentario() {
    const uid = usuarioIdLogado();
    if (!uid) { addToast("Você precisa estar logado para comentar.", "error"); return; }
    if (!novoComentario.trim()) { addToast("Digite algo antes de comentar.", "error"); return; }
    try {
      const r = await fetch(API_COMENTARIOS, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: novoComentario, usuarioId: uid, denunciaId: denunciaSelecionada.id }),
      });
      if (!r.ok) { addToast("Erro ao enviar comentário.", "error"); return; }
      const salvo = await r.json();
      setComentarios(p => [salvo, ...p]);
      setNovoComentario("");
      setTotaisComentarios(p => ({ ...p, [denunciaSelecionada.id]: (p[denunciaSelecionada.id] || 0) + 1 }));
    } catch (e) { console.error(e); }
  }

  function iniciarEdicao(c) { setComentarioEditandoId(c.id); setTextoEditando(c.texto); }
  function cancelarEdicao() { setComentarioEditandoId(null); setTextoEditando(""); }

  async function salvarEdicao(cid) {
    const uid = usuarioIdLogado();
    if (!textoEditando.trim()) { addToast("O comentário não pode ficar vazio.", "error"); return; }
    try {
      const r = await fetch(`${API_COMENTARIOS}/${cid}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: textoEditando, usuarioId: uid, denunciaId: denunciaSelecionada.id }),
      });
      if (!r.ok) { addToast("Erro ao editar comentário.", "error"); return; }
      const atualizado = await r.json();
      setComentarios(p => p.map(c => c.id === cid ? atualizado : c));
      cancelarEdicao();
    } catch (e) { console.error(e); }
  }

  function apagarComentario(cid) {
    setConfirm({ aberto: true, comentarioId: cid });
  }

  async function confirmarApagar() {
    const uid = usuarioIdLogado();
    const { comentarioId } = confirm;
    setConfirm({ aberto: false, comentarioId: null });
    try {
      const r = await fetch(`${API_COMENTARIOS}/${comentarioId}/usuario/${uid}`, { method: "DELETE" });
      if (!r.ok) { addToast("Erro ao apagar comentário.", "error"); return; }
      setComentarios(p => p.filter(c => c.id !== comentarioId));
      setTotaisComentarios(p => ({ ...p, [denunciaSelecionada.id]: Math.max((p[denunciaSelecionada.id] || 1) - 1, 0) }));
      addToast("Comentário apagado.", "info");
    } catch (e) { console.error(e); }
  }

  async function alternarCurtida(denunciaId) {
    const uid = usuarioIdLogado();
    if (!uid) { addToast("Você precisa estar logado para curtir.", "error"); return; }
    const jaCurtiu = curtidasUsuario[denunciaId];
    try {
      const r = await fetch(API_CURTIDAS, {
        method: jaCurtiu ? "DELETE" : "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId: uid, denunciaId }),
      });
      if (!r.ok) { addToast("Erro ao atualizar curtida.", "error"); return; }
      setCurtidasUsuario(p => ({ ...p, [denunciaId]: !jaCurtiu }));
      setTotaisCurtidas(p => ({ ...p, [denunciaId]: jaCurtiu ? Math.max((p[denunciaId]||1)-1,0) : (p[denunciaId]||0)+1 }));
    } catch (e) { console.error(e); }
  }

  const regioes = useMemo(() => {
    const lista = denuncias.map(d => obterRegiao(d.localizacao));
    return [...new Set(lista)].filter(Boolean);
  }, [denuncias]);

  const denunciasFiltradas = useMemo(() => {
    return denuncias.filter(d => {
      const bt = busca.toLowerCase();
      const cn = d.categoria?.nome || "";
      const rg = obterRegiao(d.localizacao).toLowerCase();
      return (
        (d.titulo?.toLowerCase().includes(bt) || d.descricao?.toLowerCase().includes(bt) || d.localizacao?.toLowerCase().includes(bt) || cn.toLowerCase().includes(bt)) &&
        (categoria === "todas" || cn === categoria) &&
        (situacao === "todas" || d.status === situacao) &&
        (localizacao === "todas" || rg === localizacao)
      );
    }).sort((a, b) => ordenacao === "antigas"
      ? new Date(a.dataCriacao) - new Date(b.dataCriacao)
      : new Date(b.dataCriacao) - new Date(a.dataCriacao)
    );
  }, [denuncias, busca, categoria, situacao, localizacao, ordenacao]);

  const totalPaginas = Math.max(1, Math.ceil(denunciasFiltradas.length / itensPorPagina));
  const inicio = (pagina - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const denunciasPaginadas = denunciasFiltradas.slice(inicio, fim);

  return (
    <>
      <NavBar />
      <Toast toasts={toasts} removeToast={removeToast} />
      <ConfirmModal
        aberto={confirm.aberto}
        onConfirmar={confirmarApagar}
        onCancelar={() => setConfirm({ aberto: false, comentarioId: null })}
      />

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
                <input type="text" placeholder="Buscar denúncias (ex: buraco, lixo, iluminação...)" value={busca} onChange={e => setBusca(e.target.value)} />
              </div>
              <button className="dp-filter-btn" onClick={() => setMostrarFiltros(!mostrarFiltros)}>
                <span>⚙️</span>
                {mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"}
              </button>
            </div>

            {mostrarFiltros && (
              <div className="dp-filters-row">
                {[
                  { label: "Categoria", value: categoria, set: setCategoria, opts: [["todas","Todas"], ...categorias.map(c => [c.nome, c.nome])] },
                  { label: "Situação",  value: situacao,  set: setSituacao,  opts: [["todas","Todas"],["ABERTA","Aberta"],["EM_ANDAMENTO","Em andamento"],["RESOLVIDA","Resolvida"]] },
                  { label: "Data",      value: ordenacao, set: setOrdenacao, opts: [["recentes","Mais recentes"],["antigas","Mais antigas"]] },
                ].map(({ label, value, set, opts }) => (
                  <div className="dp-filter-select" key={label}>
                    <label>{label}</label>
                    <div className="dp-select-wrap">
                      <select value={value} onChange={e => set(e.target.value)}>
                        {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                      <span className="dp-filter-arrow">▼</span>
                    </div>
                  </div>
                ))}
                <div className="dp-filter-select">
                  <label>Localização</label>
                  <div className="dp-select-wrap">
                    <select value={localizacao} onChange={e => setLocalizacao(e.target.value)}>
                      <option value="todas">Todas as regiões</option>
                      {regioes.map(r => <option key={r} value={r.toLowerCase()}>{r}</option>)}
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
            {denunciasPaginadas.map(d => (
              <article key={d.id} className="dp-card" onClick={() => abrirModal(d)}>
                <div className="dp-card-thumb">
                  <span className="dp-card-emoji">{obterEmoji(d.categoria?.nome)}</span>
                  <span className="dp-card-id">#{d.id}</span>
                </div>
                <div className="dp-card-body">
                  <div className="dp-card-top-row">
                    <h3 className="dp-card-title">{d.titulo}</h3>
                    <StatusBadge status={d.status} />
                  </div>
                  <div className="dp-card-location"><span>📍</span><span>{d.localizacao}</span></div>
                  <p className="dp-card-desc">{d.descricao}</p>
                  <div className="dp-card-footer">
                    <div className="dp-card-meta"><span>📅 {formatarData(d.dataCriacao)}</span></div>
                    <div className="dp-card-stats">
                      {/* Comentários SVG */}
                      <span className="dp-stat-comment" title="Comentários">
                        <IconComment /> {totaisComentarios[d.id] || 0}
                      </span>
                      {/* Curtidas SVG */}
                      <button type="button"
                        className={`dp-like-btn ${curtidasUsuario[d.id] ? "dp-like-btn--active" : ""}`}
                        title="Curtidas"
                        onClick={e => { e.stopPropagation(); alternarCurtida(d.id); }}
                      >
                        <IconHeart filled={!!curtidasUsuario[d.id]} />
                        {totaisCurtidas[d.id] || 0}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="dp-card-right">
                  <div className="dp-card-status-info">
                    <p className="dp-status-msg">{statusMensagem(d.status)}</p>
                    <div className="dp-card-region"><span>📍</span><span>{obterRegiao(d.localizacao)}</span></div>
                  </div>
                  <button className="dp-card-arrow" onClick={e => { e.stopPropagation(); abrirModal(d); }} aria-label="Ver detalhes">›</button>
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

          {/* ══ MODAL REDESENHADO ══ */}
          {modalAberto && denunciaSelecionada && (
            <div className="dp-modal-overlay" onClick={fecharModal}>
              <div className="dp-modal" onClick={e => e.stopPropagation()}>

                {/* Linha neon topo */}
                <div className="dp-modal-neon" />

                {/* Header */}
                <div className="dp-modal-header">
                  <div className="dp-modal-header-left">
                    <StatusBadge status={denunciaSelecionada.status} />
                    <div>
                      <p className="dp-modal-eyebrow">
                        #{denunciaSelecionada.id} · {denunciaSelecionada.categoria?.nome || "Sem categoria"}
                      </p>
                      <h2 className="dp-modal-title">{denunciaSelecionada.titulo}</h2>
                      <p className="dp-modal-local">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        {denunciaSelecionada.localizacao}
                      </p>
                    </div>
                  </div>
                  <button className="dp-modal-close" onClick={fecharModal}>✕</button>
                </div>

                <div className="dp-modal-body">

                  {/* Grid de infos */}
                  <div className="dp-modal-info-grid">
                    {[
                      ["📍 Local",    denunciaSelecionada.localizacao],
                      ["📌 Região",   obterRegiao(denunciaSelecionada.localizacao)],
                      ["🏷️ Categoria", denunciaSelecionada.categoria?.nome || "Sem categoria"],
                      ["📅 Data",     formatarData(denunciaSelecionada.dataCriacao)],
                    ].map(([label, val]) => (
                      <div key={label} className="dp-modal-info-field">
                        <span className="dp-modal-info-label">{label}</span>
                        <span className="dp-modal-info-val">{val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Descrição */}
                  <div className="dp-modal-desc">
                    <p>{denunciaSelecionada.descricao}</p>
                  </div>

                  {/* Imagens */}
                  {denunciaSelecionada.imagens?.length > 0 && (
                    <div className="dp-modal-imagens">
                      <span className="dp-modal-section-label">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                        </svg>
                        Imagens
                      </span>
                      <div className="dp-modal-imagens-grid">
                        {denunciaSelecionada.imagens.map(img => (
                          <img key={img.id} src={img.imagemUrl} alt={denunciaSelecionada.titulo} className="dp-modal-imagem" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats bar */}
                  <div className="dp-modal-stats-bar">
                    <div className="dp-modal-stat">
                      <span className="dp-modal-stat-icon dp-modal-stat-icon--comment"><IconComment /></span>
                      <span>{comentarios.length} comentário{comentarios.length !== 1 ? "s" : ""}</span>
                    </div>
                    <button
                      type="button"
                      className={`dp-modal-like-btn ${curtidasUsuario[denunciaSelecionada.id] ? "dp-modal-like-btn--active" : ""}`}
                      onClick={() => alternarCurtida(denunciaSelecionada.id)}
                    >
                      <IconHeart filled={!!curtidasUsuario[denunciaSelecionada.id]} />
                      <span>{totaisCurtidas[denunciaSelecionada.id] || 0}</span>
                      <span className="dp-modal-like-label">{curtidasUsuario[denunciaSelecionada.id] ? "Curtido" : "Curtir"}</span>
                    </button>
                  </div>

                  {/* Formulário de comentário */}
                  <div className="dp-modal-comment-form">
                    <div className="dp-modal-form-avatar">{iniciais(usuarioLogado()?.nome)}</div>
                    <div className="dp-modal-form-inner">
                      <textarea
                        placeholder="Escreva um comentário sobre esta denúncia..."
                        value={novoComentario}
                        onChange={e => setNovoComentario(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) enviarComentario(); }}
                      />
                      <div className="dp-modal-form-footer">
                        <span className="dp-modal-form-hint">Ctrl + Enter para enviar</span>
                        <button type="button" className="dp-modal-send-btn" onClick={enviarComentario}>
                          <IconSend /> Comentar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Label comentários */}
                  <div className="dp-modal-comments-label">
                    <IconComment />
                    Comentários
                    {comentarios.length > 0 && <span className="dp-modal-count-badge">{comentarios.length}</span>}
                  </div>

                  {/* Lista */}
                  <div className="dp-modal-comments-list">
                    {comentarios.length > 0 ? comentarios.map((c, i) => (
                      <div key={c.id} className="dp-modal-comment-item" style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className="dp-modal-comment-avatar">{iniciais(c.nomeUsuario)}</div>
                        <div className="dp-modal-comment-content">
                          <div className="dp-modal-comment-header">
                            <strong className="dp-modal-comment-name">{c.nomeUsuario}</strong>
                            <small className="dp-modal-comment-time">{formatarData(c.dataCriacao)}</small>
                            {(podeEditarComentario(c) || podeApagarComentario(c)) && (
                              <div className="dp-modal-comment-actions">
                                {podeEditarComentario(c) && (
                                  <button type="button" className="dp-action-btn dp-action-btn--edit" onClick={() => iniciarEdicao(c)}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                    </svg>
                                    Editar
                                  </button>
                                )}
                                {podeApagarComentario(c) && (
                                  <button type="button" className="dp-action-btn dp-action-btn--delete" onClick={() => apagarComentario(c.id)}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                                    </svg>
                                    Apagar
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          {comentarioEditandoId === c.id ? (
                            <div className="dp-modal-edit-form">
                              <textarea value={textoEditando} onChange={e => setTextoEditando(e.target.value)} />
                              <div className="dp-modal-edit-actions">
                                <button type="button" className="dp-edit-save" onClick={() => salvarEdicao(c.id)}>Salvar</button>
                                <button type="button" className="dp-edit-cancel" onClick={cancelarEdicao}>Cancelar</button>
                              </div>
                            </div>
                          ) : (
                            <p className="dp-modal-comment-text">{c.texto}</p>
                          )}
                        </div>
                      </div>
                    )) : (
                      <div className="dp-modal-empty-comments">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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

          <div className="dp-pagination-row">
            <div className="dp-per-page">
              <span>Itens por página:</span>
              <select value={itensPorPagina} onChange={e => setItensPorPagina(Number(e.target.value))}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
            <span className="dp-count">
              {denunciasFiltradas.length === 0 ? "0 de 0 denúncias"
                : `${inicio + 1}–${Math.min(fim, denunciasFiltradas.length)} de ${denunciasFiltradas.length} denúncias`}
            </span>
            <div className="dp-pages">
              <button className="dp-page-btn" disabled={pagina === 1} onClick={() => setPagina(p => Math.max(p-1,1))}>‹</button>
              {Array.from({ length: totalPaginas }, (_,i) => i+1).slice(0,5).map(n => (
                <button key={n} className={`dp-page-btn ${pagina===n?"active":""}`} onClick={() => setPagina(n)}>{n}</button>
              ))}
              {totalPaginas > 5 && <button className="dp-page-btn" disabled>…</button>}
              <button className="dp-page-btn" disabled={pagina===totalPaginas} onClick={() => setPagina(p => Math.min(p+1,totalPaginas))}>›</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DenunciasPublicas;