import "../styles/admin.css";
import { useEffect, useState, useCallback } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import NavBar from "../../dashboard/components/NavBar";

/* ══ TOAST ══ */
function Toast({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          <span className="toast-icon">{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
          <span className="toast-msg">{t.message}</span>
          <button className="toast-close" onClick={() => removeToast(t.id)}>✕</button>
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
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);
  const removeToast = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);
  return { toasts, addToast, removeToast };
}

/* ══ ÍCONES SVG ══ */
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

/* ══ CONFIGS ══ */
const statusConfig = {
  Aberta:         { cor: "status--aberta",    dot: "#31bf49" },
  "Em andamento": { cor: "status--andamento", dot: "#f4d06f" },
  Resolvida:      { cor: "status--resolvida", dot: "#60a5fa" },
};
const prioridadeConfig = {
  Alta:  { cor: "prio--alta"  },
  Média: { cor: "prio--media" },
  Baixa: { cor: "prio--baixa" },
};

/* ══ CONFIRM MODAL ══ */
function ConfirmModal({ aberto, onConfirmar, onCancelar, titulo = "Apagar comentário", mensagem = "Esta ação não pode ser desfeita. Deseja apagar este comentário?" }) {
  if (!aberto) return null;
  return (
    <div className="admin-confirm-overlay" onClick={onCancelar}>
      <div className="admin-confirm-box" onClick={e => e.stopPropagation()}>
        <div className="admin-confirm-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </div>
        <h3 className="admin-confirm-title">{titulo}</h3>
        <p className="admin-confirm-msg">{mensagem}</p>
        <div className="admin-confirm-actions">
          <button className="admin-confirm-cancel" onClick={onCancelar}>Cancelar</button>
          <button className="admin-confirm-delete" onClick={onConfirmar}>Apagar</button>
        </div>
      </div>
    </div>
  );
}

function Admin() {
  const [modalAberto, setModalAberto] = useState(null);
  const [buscaDenuncia, setBuscaDenuncia] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("Todos");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [denunciaSelecionada, setDenunciaSelecionada] = useState(null);
  const [modalDetalhes, setModalDetalhes] = useState(false);
  const [modalAtualizar, setModalAtualizar] = useState(false);
  const [modalMapaDenuncia, setModalMapaDenuncia] = useState(false);
  const [denuncias, setDenuncias] = useState([]);

  const [totaisComentarios, setTotaisComentarios] = useState({});
  const [totaisCurtidas, setTotaisCurtidas] = useState({});
  const [curtidasUsuario, setCurtidasUsuario] = useState({});
  const [comentariosDetalhes, setComentariosDetalhes] = useState([]);
  const [mostrarComentariosDetalhes, setMostrarComentariosDetalhes] = useState(false);
  const [comentarioEditandoId, setComentarioEditandoId] = useState(null);
  const [textoEditando, setTextoEditando] = useState("");
  const [confirm, setConfirm] = useState({ aberto: false, comentarioId: null });
  const [confirmDenuncia, setConfirmDenuncia] = useState({ aberto: false, denuncia: null });
  const [imagemVisualizando, setImagemVisualizando] = useState(null);

  const [usuarios, setUsuarios] = useState([]);
  const [buscaUsuario, setBuscaUsuario] = useState("");
  const [tipoUsuarioFiltro, setTipoUsuarioFiltro] = useState("Todos");
  const [modalNovoUsuario, setModalNovoUsuario] = useState(false);
  const [modalPerfilUsuario, setModalPerfilUsuario] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  const [categorias, setCategorias] = useState([]);
  const [buscaCategoria, setBuscaCategoria] = useState("");
  const [novaCategoria, setNovaCategoria] = useState({ nome: "", descricao: "" });

  const [novoUsuario, setNovoUsuario] = useState({
    nome: "", email: "", telefone: "", cidade: "", senha: "", tipoUsuario: "USUARIO",
  });

  const { toasts, addToast, removeToast } = useToast();

  const API_CATEGORIAS  = "http://localhost:8080/categorias";
  const API_DENUNCIAS   = "http://localhost:8080/denuncias";
  const API_USUARIOS    = "http://localhost:8080/usuarios";
  const API_COMENTARIOS = "http://localhost:8080/comentarios";
  const API_CURTIDAS    = "http://localhost:8080/curtidas";

  function usuarioLogado() { return JSON.parse(localStorage.getItem("usuario")); }
  function usuarioIdLogado() { const u = usuarioLogado(); return u?.id || u?.usuarioId; }

  async function carregarInteracoes(denunciasData) {
    const uid = usuarioIdLogado();
    const ct = {}, cu = {}, cuu = {};
    await Promise.all(denunciasData.map(async (d) => {
      const rc = await fetch(`${API_COMENTARIOS}/denuncia/${d.id}/total`);
      ct[d.id] = await rc.json();
      const rcu = await fetch(`${API_CURTIDAS}/denuncia/${d.id}/total`);
      cu[d.id] = await rcu.json();
      if (uid) {
        const ru = await fetch(`${API_CURTIDAS}/denuncia/${d.id}/usuario/${uid}`);
        cuu[d.id] = await ru.json();
      }
    }));
    setTotaisComentarios(ct);
    setTotaisCurtidas(cu);
    setCurtidasUsuario(cuu);
  }

  async function carregarDados() {
    try {
      const [resCat, resDen, resUsu] = await Promise.all([
        fetch(API_CATEGORIAS), fetch(API_DENUNCIAS), fetch(API_USUARIOS),
      ]);
      const categoriasData = await resCat.json();
      const denunciasData  = await resDen.json();
      const usuariosData   = await resUsu.json();
      setCategorias(categoriasData);
      setDenuncias(denunciasData);
      setUsuarios(usuariosData.map((u) => ({
        ...u,
        denuncias: denunciasData.filter((d) => d.usuario?.id === u.id).length,
      })));
      await carregarInteracoes(denunciasData);
    } catch (error) {
      console.error("Erro ao carregar dados do admin:", error);
    }
  }

  useEffect(() => { carregarDados(); }, []);

  function formatarStatus(status) {
    if (status === "ABERTA")       return "Aberta";
    if (status === "EM_ANDAMENTO") return "Em andamento";
    if (status === "RESOLVIDA")    return "Resolvida";
    return status || "Aberta";
  }
  function formatarPrioridade(prioridade) {
    if (prioridade === "ALTA")  return "Alta";
    if (prioridade === "MEDIA") return "Média";
    if (prioridade === "BAIXA") return "Baixa";
    return prioridade || "Média";
  }
  function formatarTipoUsuario(usuarioOuTipo) {
    const tipo = typeof usuarioOuTipo === "object"
      ? usuarioOuTipo.tipo || usuarioOuTipo.role || usuarioOuTipo.perfil || usuarioOuTipo.tipoUsuario
      : usuarioOuTipo;
    const t = String(tipo || "").toUpperCase();
    if (t === "ADMIN" || t === "ADMINISTRADOR" || t === "ROLE_ADMIN") return "Administrador";
    return "Usuário comum";
  }
  function getMapaDenunciaUrl(denuncia) {
    const lat = denuncia?.latitude, lng = denuncia?.longitude;
    if (lat && lng) return `https://maps.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
    return `https://maps.google.com/maps?q=${encodeURIComponent(denuncia?.localizacao || "Irecê BA")}&z=17&output=embed`;
  }

  /* ── Filtros ── */
  const denunciasFiltradas = denuncias.filter((d) => {
    const busca = buscaDenuncia.toLowerCase();
    const s = formatarStatus(d.status);
    const cat = d.categoria?.nome || "";
    const autor = d.usuario?.nome || "Usuário não informado";
    return (
      (d.titulo?.toLowerCase().includes(busca) || d.localizacao?.toLowerCase().includes(busca) || autor.toLowerCase().includes(busca)) &&
      (statusFiltro === "Todos" || s === statusFiltro) &&
      (categoriaFiltro === "Todas" || cat === categoriaFiltro)
    );
  });

  const usuariosFiltrados = usuarios.filter((u) => {
    const busca = buscaUsuario.toLowerCase();
    const tipo = formatarTipoUsuario(u);
    return (
      (u.nome?.toLowerCase().includes(busca) || u.email?.toLowerCase().includes(busca) ||
       (u.cidade||"").toLowerCase().includes(busca) || (u.telefone||"").toLowerCase().includes(busca)) &&
      (tipoUsuarioFiltro === "Todos" || tipo === tipoUsuarioFiltro)
    );
  });

  const categoriasFiltradas = categorias.filter((c) => {
    const busca = buscaCategoria.toLowerCase();
    return c.nome?.toLowerCase().includes(busca) || (c.descricao||"").toLowerCase().includes(busca);
  });

  async function abrirDetalhesDenuncia(denuncia) {
    setDenunciaSelecionada(denuncia);
    setModalDetalhes(true);
    setMostrarComentariosDetalhes(false);
    setComentariosDetalhes([]);
  }

  async function carregarComentariosDaDenuncia(denunciaId) {
    try {
      const response = await fetch(`${API_COMENTARIOS}/denuncia/${denunciaId}`);
      if (!response.ok) { addToast("Erro ao carregar comentários.", "error"); return; }
      const data = await response.json();
      setComentariosDetalhes(Array.isArray(data) ? data : []);
      setMostrarComentariosDetalhes(true);
    } catch (error) {
      addToast("Falha ao carregar comentários.", "error");
    }
  }

  function iniciarEdicaoAdmin(c) { setComentarioEditandoId(c.id); setTextoEditando(c.texto); }
  function cancelarEdicaoAdmin() { setComentarioEditandoId(null); setTextoEditando(""); }

  async function salvarEdicaoAdmin(comentarioId) {
    const uid = usuarioIdLogado();
    if (!textoEditando.trim()) { addToast("O comentário não pode ficar vazio.", "error"); return; }
    try {
      const r = await fetch(`${API_COMENTARIOS}/${comentarioId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: textoEditando, usuarioId: uid, denunciaId: denunciaSelecionada.id }),
      });
      if (!r.ok) { addToast("Erro ao editar comentário.", "error"); return; }
      const atualizado = await r.json();
      setComentariosDetalhes(p => p.map(c => c.id === comentarioId ? atualizado : c));
      cancelarEdicaoAdmin();
      addToast("Comentário editado!", "success");
    } catch (e) { addToast("Erro ao editar comentário.", "error"); }
  }

  function apagarComentarioAdmin(cid) { setConfirm({ aberto: true, comentarioId: cid }); }

  async function confirmarApagarAdmin() {
    const uid = usuarioIdLogado();
    const { comentarioId } = confirm;
    setConfirm({ aberto: false, comentarioId: null });
    try {
      const r = await fetch(`${API_COMENTARIOS}/${comentarioId}/usuario/${uid}`, { method: "DELETE" });
      if (!r.ok) { addToast("Erro ao apagar comentário.", "error"); return; }
      setComentariosDetalhes(p => p.filter(c => c.id !== comentarioId));
      addToast("Comentário apagado.", "info");
    } catch (e) { addToast("Erro ao apagar comentário.", "error"); }
  }

  async function alternarCurtida(denunciaId) {
    const uid = usuarioIdLogado();
    if (!uid) { addToast("Você precisa estar logado para curtir.", "error"); return; }
    const jaCurtiu = curtidasUsuario[denunciaId];
    try {
      const r = await fetch(API_CURTIDAS, {
        method: jaCurtiu ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId: uid, denunciaId }),
      });
      if (!r.ok) { addToast("Erro ao atualizar curtida.", "error"); return; }
      setCurtidasUsuario((p) => ({ ...p, [denunciaId]: !jaCurtiu }));
      setTotaisCurtidas((p) => ({ ...p, [denunciaId]: jaCurtiu ? Math.max((p[denunciaId]||1)-1,0) : (p[denunciaId]||0)+1 }));
    } catch (e) { addToast("Falha ao atualizar curtida.", "error"); }
  }

  async function salvarNovoUsuario(e) {
    e.preventDefault();
    try {
      const r = await fetch(API_USUARIOS, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...novoUsuario }),
      });
      if (!r.ok) { addToast("Erro ao cadastrar usuário. Verifique os dados.", "error"); return; }
      setNovoUsuario({ nome:"", email:"", telefone:"", cidade:"", senha:"", tipoUsuario:"USUARIO" });
      setModalNovoUsuario(false);
      carregarDados();
      addToast("Usuário cadastrado com sucesso!", "success");
    } catch (e) { addToast("Falha na conexão com o servidor.", "error"); }
  }

  async function salvarNovaCategoria(e) {
    e.preventDefault();
    try {
      const r = await fetch(API_CATEGORIAS, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaCategoria),
      });
      if (!r.ok) { addToast("Erro ao cadastrar categoria.", "error"); return; }
      setNovaCategoria({ nome:"", descricao:"" });
      carregarDados();
      addToast("Categoria cadastrada com sucesso!", "success");
    } catch (e) { addToast("Falha na conexão com o servidor.", "error"); }
  }

  async function removerCategoria(id) {
    try {
      await fetch(`${API_CATEGORIAS}/${id}`, { method: "DELETE" });
      carregarDados();
      addToast("Categoria removida.", "info");
    } catch (e) { addToast("Erro ao remover categoria.", "error"); }
  }

  async function salvarAtualizacaoDenuncia() {
    try {
      const r = await fetch(
        `${API_DENUNCIAS}/${denunciaSelecionada.id}/status?status=${denunciaSelecionada.status}&prioridade=${denunciaSelecionada.prioridade}`,
        { method: "PUT" }
      );
      if (!r.ok) { addToast("Erro ao atualizar denúncia.", "error"); return; }
      const atualizada = await r.json();
      setDenuncias(denuncias.map((d) => d.id === atualizada.id ? atualizada : d));
      setModalAtualizar(false);
      addToast("Denúncia atualizada com sucesso!", "success");
    } catch (e) { addToast("Falha na conexão com o servidor.", "error"); }
  }

  function apagarDenuncia(denuncia) {
    setConfirmDenuncia({ aberto: true, denuncia });
  }

  async function confirmarApagarDenuncia() {
    const denuncia = confirmDenuncia.denuncia;
    setConfirmDenuncia({ aberto: false, denuncia: null });
    try {
      const r = await fetch(`${API_DENUNCIAS}/${denuncia.id}`, { method: "DELETE" });
      if (!r.ok) { addToast("Erro ao apagar denúncia.", "error"); return; }
      setDenuncias(p => p.filter(d => d.id !== denuncia.id));
      addToast("Denúncia apagada.", "info");
    } catch { addToast("Falha na conexão.", "error"); }
  }

  function getDenunciasComCoordenadas() {
    return denuncias.filter((d) => {
      const lat = Number(d.latitude), lng = Number(d.longitude);
      return d.status !== "RESOLVIDA" && d.latitude != null && d.latitude !== "" &&
        d.longitude != null && d.longitude !== "" && !Number.isNaN(lat) && !Number.isNaN(lng);
    });
  }
  function getCorMarcadorPrioridade(p) {
    if (p === "ALTA")  return "#ef4444";
    if (p === "MEDIA") return "#f59e0b";
    if (p === "BAIXA") return "#3b82f6";
    return "#f59e0b";
  }
  function criarIconeMarcador(prioridade) {
    const cor = getCorMarcadorPrioridade(prioridade);
    const classe = prioridade === "ALTA" ? "map-pin--alta" : prioridade === "MEDIA" ? "map-pin--media" : "map-pin--baixa";
    return L.divIcon({
      className: "",
      html: `<div class="map-pin-wrap ${classe}">
        <div class="map-pin-core" style="background:${cor}"></div>
        <div class="map-pin-ring" style="border-color:${cor}"></div>
        <div class="map-pin-tail" style="background:${cor}"></div>
      </div>`,
      iconSize: [24,32], iconAnchor: [12,32], popupAnchor: [0,-34],
    });
  }

  const statsData = [
    { emoji:"📋", label:"Denúncias abertas", valor: denuncias.filter((d)=>d.status==="ABERTA").length,       cor:"stat--green"  },
    { emoji:"⏳", label:"Em andamento",       valor: denuncias.filter((d)=>d.status==="EM_ANDAMENTO").length, cor:"stat--yellow" },
    { emoji:"✅", label:"Resolvidas",          valor: denuncias.filter((d)=>d.status==="RESOLVIDA").length,   cor:"stat--blue"   },
    { emoji:"👥", label:"Usuários",            valor: usuarios.length,                                        cor:"stat--purple" },
  ];
  const modulosData = [
    { id:"denuncias",  icon:"📋", titulo:"Gerenciar denúncias",  descricao:"Visualize, filtre e atualize as denúncias registradas.", meta:`${denuncias.length} registros`      },
    { id:"usuarios",   icon:"👥", titulo:"Gerenciar usuários",   descricao:"Consulte usuários cadastrados e suas atividades.",        meta:`${usuarios.length} cadastros`       },
    { id:"categorias", icon:"🏷️", titulo:"Gerenciar categorias", descricao:"Cadastre e organize os tipos de denúncias.",             meta:`${categorias.length} categorias`    },
    { id:"mapa",       icon:"🗺️", titulo:"Mapa da cidade",       descricao:"Acompanhe pontos de denúncias espalhados pela cidade.",  meta:"Irecê – BA"                          },
  ];

  return (
    <div className="admin-page">
      <NavBar />
      <Toast toasts={toasts} removeToast={removeToast} />
      <ConfirmModal
        aberto={confirm.aberto}
        onConfirmar={confirmarApagarAdmin}
        onCancelar={() => setConfirm({ aberto: false, comentarioId: null })}
      />
      <ConfirmModal
        aberto={confirmDenuncia.aberto}
        titulo="Apagar denúncia"
        mensagem={`A denúncia "${confirmDenuncia.denuncia?.titulo}" será removida permanentemente. Essa ação não pode ser desfeita.`}
        onConfirmar={confirmarApagarDenuncia}
        onCancelar={() => setConfirmDenuncia({ aberto: false, denuncia: null })}
      />

      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-eyebrow">Painel administrativo</div>
          <h1>Visão geral</h1>
          <p>Gerencie denúncias, usuários e acompanhe o mapa da cidade.</p>
        </header>

        <section className="admin-stats">
          {statsData.map((s) => (
            <article key={s.label} className={`stat-card ${s.cor}`}>
              <div className="stat-icon">{s.emoji}</div>
              <div className="stat-body">
                <p className="stat-label">{s.label}</p>
                <h3 className="stat-num">{s.valor}</h3>
              </div>
              <div className="stat-bar" />
            </article>
          ))}
        </section>

        <section className="admin-modules-section">
          <div className="section-label">Módulos de gestão</div>
          <div className="admin-grid">
            {modulosData.map((m) => (
              <article key={m.id} className="admin-card">
                <div className="admin-card-top">
                  <div className="admin-card-icon">{m.icon}</div>
                  <span className="admin-card-meta">{m.meta}</span>
                </div>
                <h2>{m.titulo}</h2>
                <p>{m.descricao}</p>
                <button onClick={() => setModalAberto(m.id)}>
                  Abrir módulo <span className="btn-arrow">→</span>
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-overview">
          <div className="overview-text">
            <div className="section-label">Acesso rápido</div>
            <h2>Resumo do painel</h2>
            <p>Use esta área para acompanhar rapidamente o estado geral da plataforma e acessar as principais funções administrativas.</p>
          </div>
          <div className="admin-actions">
            <button onClick={() => setModalAberto("denuncias")}>📋 Ver denúncias</button>
            <button onClick={() => setModalAberto("usuarios")}>👥 Ver usuários</button>
            <button onClick={() => setModalAberto("categorias")}>🏷️ Ver categorias</button>
            <button onClick={() => setModalAberto("mapa")}>🗺️ Ver mapa</button>
          </div>
        </section>
      </main>

      {/* ══ MODAL PRINCIPAL ══ */}
      {modalAberto && (
        <div className="admin-modal-overlay" onClick={() => setModalAberto(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <p className="modal-eyebrow">
                  {modalAberto === "denuncias"  && "Gestão · Denúncias"}
                  {modalAberto === "usuarios"   && "Gestão · Usuários"}
                  {modalAberto === "categorias" && "Gestão · Categorias"}
                  {modalAberto === "mapa"       && "Gestão · Mapa"}
                </p>
                <h2>
                  {modalAberto === "denuncias"  && "Gerenciar denúncias"}
                  {modalAberto === "usuarios"   && "Gerenciar usuários"}
                  {modalAberto === "categorias" && "Gerenciar categorias"}
                  {modalAberto === "mapa"       && "Mapa da cidade"}
                </h2>
                <p className="modal-sub">
                  {modalAberto === "denuncias"  && "Acompanhe e atualize as denúncias da plataforma."}
                  {modalAberto === "usuarios"   && "Consulte os usuários cadastrados no sistema."}
                  {modalAberto === "categorias" && "Cadastre, visualize e organize categorias de denúncias."}
                  {modalAberto === "mapa"       && "Visualize a distribuição das denúncias na cidade."}
                </p>
              </div>
              <button className="admin-close" onClick={() => setModalAberto(null)}>✕</button>
            </div>

            {/* ── DENÚNCIAS ── */}
            {modalAberto === "denuncias" && (
              <div className="admin-modal-content">
                <div className="admin-filter-row">
                  <div className="filter-input-wrap">
                    <span className="filter-icon">🔍</span>
                    <input placeholder="Buscar por título, local ou autor..." value={buscaDenuncia} onChange={(e) => setBuscaDenuncia(e.target.value)} />
                  </div>
                  <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}>
                    <option>Todos</option><option>Aberta</option><option>Em andamento</option><option>Resolvida</option>
                  </select>
                  <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)}>
                    <option>Todas</option>
                    {categorias.map((c) => <option key={c.id}>{c.nome}</option>)}
                  </select>
                </div>

                <div className="admin-list">
                  {denunciasFiltradas.map((denuncia) => (
                    <article className="admin-list-item" key={denuncia.id}>
                      {/* Thumbnail lateral */}
                      {denuncia.imagens?.length > 0 ? (
                        <img src={denuncia.imagens[0].imagemUrl} alt={denuncia.titulo} className="admin-denuncia-thumb" onClick={() => setImagemVisualizando(denuncia.imagens[0].imagemUrl)} />
                      ) : (
                        <div className="admin-denuncia-thumb-placeholder">📋</div>
                      )}

                      <div className="list-item-info">
                        <div className="list-item-title-row">
                          <h3>{denuncia.titulo}</h3>
                          <span className={`prioridade-badge ${prioridadeConfig[formatarPrioridade(denuncia.prioridade)]?.cor}`}>
                            {formatarPrioridade(denuncia.prioridade)}
                          </span>
                        </div>
                        <p className="list-item-local">📍 {denuncia.localizacao}</p>
                        <p className="list-item-meta">{denuncia.usuario?.nome || "Usuário não informado"} · {denuncia.categoria?.nome || "Sem categoria"}</p>

                        <div className="admin-denuncia-interacoes">
                          <span className="admin-stat-comment">
                            <IconComment /> {totaisComentarios[denuncia.id] || 0}
                          </span>
                          <button type="button" className={`admin-like-btn ${curtidasUsuario[denuncia.id] ? "admin-like-btn--active" : ""}`} onClick={() => alternarCurtida(denuncia.id)}>
                            <IconHeart filled={!!curtidasUsuario[denuncia.id]} />
                            {totaisCurtidas[denuncia.id] || 0}
                          </button>
                        </div>
                      </div>

                      <div className="admin-item-actions">
                        <span className={`status-badge ${statusConfig[formatarStatus(denuncia.status)]?.cor}`}>
                          <span className="status-dot" style={{ background: statusConfig[formatarStatus(denuncia.status)]?.dot }} />
                          {formatarStatus(denuncia.status)}
                        </span>
                        <button className="btn-outline" onClick={() => abrirDetalhesDenuncia(denuncia)}>Detalhes</button>
                        <button className="btn-solid" onClick={() => { setDenunciaSelecionada(denuncia); setModalAtualizar(true); }}>Atualizar</button>
                        <button className="admin-apagar-denuncia-btn" onClick={() => apagarDenuncia(denuncia)}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                          </svg>
                          Apagar
                        </button>
                      </div>
                    </article>
                  ))}
                  {denunciasFiltradas.length === 0 && (
                    <div className="empty-state"><span>🔎</span><p>Nenhuma denúncia encontrada.</p></div>
                  )}
                </div>
              </div>
            )}

            {/* ── USUÁRIOS ── */}
            {modalAberto === "usuarios" && (
              <div className="admin-modal-content">
                <div className="admin-filter-row">
                  <div className="filter-input-wrap">
                    <span className="filter-icon">🔍</span>
                    <input placeholder="Buscar por nome, e-mail, telefone ou cidade..." value={buscaUsuario} onChange={(e) => setBuscaUsuario(e.target.value)} />
                  </div>
                  <select value={tipoUsuarioFiltro} onChange={(e) => setTipoUsuarioFiltro(e.target.value)}>
                    <option>Todos</option><option>Usuário comum</option><option>Administrador</option>
                  </select>
                  <button className="new-user-btn" onClick={() => setModalNovoUsuario(true)}>＋ Novo usuário</button>
                </div>
                <div className="admin-list">
                  {usuariosFiltrados.map((usuario) => (
                    <article className="admin-list-item" key={usuario.id || usuario.email}>
                      <div className="list-item-info">
                        <div className="usuario-avatar-row">
                          <div className="usuario-avatar">
                            {(usuario.nome || "U").split(" ").map((n) => n[0]).join("").slice(0,2).toUpperCase()}
                          </div>
                          <div>
                            <h3>{usuario.nome}</h3>
                            <p className="list-item-meta">{usuario.email} · {usuario.cidade || "Cidade não informada"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="admin-item-actions">
                        <span className={`tipo-badge ${formatarTipoUsuario(usuario) === "Administrador" ? "tipo--admin" : "tipo--user"}`}>
                          {formatarTipoUsuario(usuario)}
                        </span>
                        <span className="denuncias-count">{usuario.denuncias || 0} denúncias</span>
                        <button className="btn-solid" onClick={() => { setUsuarioSelecionado(usuario); setModalPerfilUsuario(true); }}>Ver perfil</button>
                      </div>
                    </article>
                  ))}
                  {usuariosFiltrados.length === 0 && (
                    <div className="empty-state"><span>🔎</span><p>Nenhum usuário encontrado.</p></div>
                  )}
                </div>
              </div>
            )}

            {/* ── CATEGORIAS ── */}
            {modalAberto === "categorias" && (
              <div className="admin-modal-content">
                <form onSubmit={salvarNovaCategoria} className="new-user-form">
                  <div className="modal-form-group">
                    <label>Nome da categoria</label>
                    <input type="text" required placeholder="Ex: Buraco" value={novaCategoria.nome} onChange={(e) => setNovaCategoria({ ...novaCategoria, nome: e.target.value })} />
                  </div>
                  <div className="modal-form-group">
                    <label>Descrição</label>
                    <input type="text" required placeholder="Ex: Problemas em vias públicas" value={novaCategoria.descricao} onChange={(e) => setNovaCategoria({ ...novaCategoria, descricao: e.target.value })} />
                  </div>
                  <div className="modal-actions">
                    <button type="submit" className="save-btn">Salvar categoria</button>
                  </div>
                </form>
                <div className="admin-filter-row">
                  <div className="filter-input-wrap">
                    <span className="filter-icon">🔍</span>
                    <input placeholder="Buscar categoria..." value={buscaCategoria} onChange={(e) => setBuscaCategoria(e.target.value)} />
                  </div>
                </div>
                <div className="admin-list">
                  {categoriasFiltradas.map((categoria) => (
                    <article className="admin-list-item" key={categoria.id}>
                      <div className="list-item-info">
                        <h3>{categoria.nome}</h3>
                        <p className="list-item-meta">{categoria.descricao}</p>
                      </div>
                      <div className="admin-item-actions">
                        <button className="btn-outline" onClick={() => removerCategoria(categoria.id)}>Remover</button>
                      </div>
                    </article>
                  ))}
                  {categoriasFiltradas.length === 0 && (
                    <div className="empty-state"><span>🔎</span><p>Nenhuma categoria encontrada.</p></div>
                  )}
                </div>
              </div>
            )}

            {/* ── MAPA ── */}
            {modalAberto === "mapa" && (
              <div className="admin-modal-content">
                <div className="admin-map-real">
                  <MapContainer center={[-11.3042, -41.8565]} zoom={13} style={{ width:"100%", height:"420px", borderRadius:"18px" }}>
                    <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {getDenunciasComCoordenadas().map((denuncia) => (
                      <Marker key={denuncia.id} position={[Number(denuncia.latitude), Number(denuncia.longitude)]} icon={criarIconeMarcador(denuncia.prioridade)}>
                        <Popup>
                          <div className="map-popup">
                            <strong>{denuncia.titulo}</strong>
                            <p>{denuncia.localizacao}</p>
                            <small>Status: {formatarStatus(denuncia.status)}</small><br />
                            <small>Categoria: {denuncia.categoria?.nome || "Sem categoria"}</small>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
                {getDenunciasComCoordenadas().length === 0 && (
                  <p className="map-empty-message">Nenhuma denúncia com coordenadas registrada ainda.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ MODAL DETALHES REDESENHADO ══ */}
      {modalDetalhes && denunciaSelecionada && (
        <div className="admin-modal-overlay" onClick={() => setModalDetalhes(false)}>
          <div className="admin-modal details-modal" onClick={(e) => e.stopPropagation()}>

            {/* Linha neon */}
            <div className="details-neon" />

            <div className="details-modal-header">
              <div className="details-modal-header-left">
                <div className="details-modal-eyebrow">Denúncia #{denunciaSelecionada.id}</div>
                <h2>{denunciaSelecionada.titulo}</h2>
              </div>
              <button className="admin-close" onClick={() => setModalDetalhes(false)}>✕</button>
            </div>

            {/* Badges */}
            <div className="details-badges-row">
              <span className={`status-badge ${statusConfig[formatarStatus(denunciaSelecionada.status)]?.cor}`}>
                <span className="status-dot" style={{ background: statusConfig[formatarStatus(denunciaSelecionada.status)]?.dot }} />
                {formatarStatus(denunciaSelecionada.status)}
              </span>
              <span className={`prioridade-badge ${prioridadeConfig[formatarPrioridade(denunciaSelecionada.prioridade)]?.cor}`}>
                {formatarPrioridade(denunciaSelecionada.prioridade)}
              </span>
            </div>

            {/* Grid de campos */}
            <div className="details-grid">
              {[
                ["👤 Autor",     denunciaSelecionada.usuario?.nome || "Usuário não informado"],
                ["📍 Local",     denunciaSelecionada.localizacao],
                ["🏷️ Categoria", denunciaSelecionada.categoria?.nome || "Sem categoria"],
                ["📅 Data",      denunciaSelecionada.dataCriacao ? new Date(denunciaSelecionada.dataCriacao).toLocaleDateString("pt-BR") : "Não informada"],
              ].map(([label, val]) => (
                <div key={label} className="detail-field">
                  <span className="detail-label">{label}</span>
                  <span className="detail-value">{val}</span>
                </div>
              ))}
            </div>

            {/* ── Bloco imagem ── */}
            <div className="admin-detail-imagem-block">
              {denunciaSelecionada.imagens?.length > 0 ? (
                <button type="button" className="admin-visualizar-imagem-btn" onClick={() => setImagemVisualizando(denunciaSelecionada.imagens[0].imagemUrl)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  Visualizar imagem
                  <span className="admin-imagem-count">{denunciaSelecionada.imagens.length}</span>
                </button>
              ) : (
                <div className="admin-sem-imagem">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    <line x1="3" y1="3" x2="21" y2="21"/>
                  </svg>
                  <span>Esta denúncia não possui imagens registradas.</span>
                </div>
              )}
            </div>

            {/* ── Barra de interações redesenhada ── */}
            <div className="admin-detail-stats-bar">
              <div className="admin-detail-stat">
                <span className="admin-detail-stat-icon admin-detail-stat-icon--comment">
                  <IconComment />
                </span>
                <span>{totaisComentarios[denunciaSelecionada.id] || 0} comentário{(totaisComentarios[denunciaSelecionada.id] || 0) !== 1 ? "s" : ""}</span>
              </div>

              <button
                type="button"
                className={`admin-detail-like-btn ${curtidasUsuario[denunciaSelecionada.id] ? "admin-detail-like-btn--active" : ""}`}
                onClick={() => alternarCurtida(denunciaSelecionada.id)}
              >
                <IconHeart filled={!!curtidasUsuario[denunciaSelecionada.id]} />
                <span>{totaisCurtidas[denunciaSelecionada.id] || 0}</span>
                <span className="admin-detail-like-label">
                  {curtidasUsuario[denunciaSelecionada.id] ? "Curtido" : "Curtir"}
                </span>
              </button>

              <button
                type="button"
                className="admin-ver-comentarios-btn"
                onClick={() => carregarComentariosDaDenuncia(denunciaSelecionada.id)}
              >
                <IconComment />
                Ver comentários
              </button>
            </div>

            {/* ── Painel de comentários ── */}
            {mostrarComentariosDetalhes && (
              <div className="admin-comentarios-panel">
                <div className="admin-comentarios-panel-neon" />
                <div className="admin-comentarios-panel-header">
                  <div className="admin-comentarios-panel-label">
                    <IconComment />
                    Comentários
                    {comentariosDetalhes.length > 0 && (
                      <span className="admin-comentarios-badge">{comentariosDetalhes.length}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="admin-comentarios-close"
                    onClick={() => setMostrarComentariosDetalhes(false)}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Fechar
                  </button>
                </div>

                <div className="admin-comentarios-list">
                  {comentariosDetalhes.length > 0 ? (
                    comentariosDetalhes.map((c, i) => (
                      <div key={c.id} className="admin-comentario-item" style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className="admin-comentario-avatar">
                          {(c.nomeUsuario || "?").split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
                        </div>
                        <div className="admin-comentario-body">
                          <div className="admin-comentario-header">
                            <strong className="admin-comentario-nome">{c.nomeUsuario}</strong>
                            <div className="admin-comentario-actions">
                              <button type="button" className="admin-action-btn admin-action-btn--edit" onClick={() => iniciarEdicaoAdmin(c)}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                                Editar
                              </button>
                              <button type="button" className="admin-action-btn admin-action-btn--delete" onClick={() => apagarComentarioAdmin(c.id)}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                  <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                                </svg>
                                Apagar
                              </button>
                            </div>
                          </div>

                          {comentarioEditandoId === c.id ? (
                            <div className="admin-edit-form">
                              <textarea value={textoEditando} onChange={e => setTextoEditando(e.target.value)} />
                              <div className="admin-edit-actions">
                                <button type="button" className="admin-edit-save" onClick={() => salvarEdicaoAdmin(c.id)}>Salvar</button>
                                <button type="button" className="admin-edit-cancel" onClick={cancelarEdicaoAdmin}>Cancelar</button>
                              </div>
                            </div>
                          ) : (
                            <p className="admin-comentario-texto">{c.texto}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="admin-comentarios-empty">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      <p>Nenhum comentário ainda.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Bloco do mapa ── */}
            <div className="detail-map-block">
              <div className="detail-map-block-header">
                <div className="detail-map-block-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <strong>Localização da ocorrência</strong>
                  <p>{denunciaSelecionada.localizacao}</p>
                </div>
                <button className="detail-map-open-btn" onClick={(e) => { e.stopPropagation(); setModalMapaDenuncia(true); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  </svg>
                  Abrir mapa
                </button>
              </div>
              <div className="detail-map-preview-wrap" onClick={() => setModalMapaDenuncia(true)}>
                <div className="detail-map-neon-tl" />
                <div className="detail-map-neon-br" />
                <iframe title="Prévia da localização" src={getMapaDenunciaUrl(denunciaSelecionada)} width="100%" height="200" style={{ border:0, display:"block", borderRadius:"12px" }} loading="lazy" />
                <div className="detail-map-overlay">
                  <div className="detail-map-overlay-hint">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                    </svg>
                    Clique para ampliar
                  </div>
                </div>
              </div>
            </div>

            <button className="save-btn" onClick={() => setModalDetalhes(false)}>Fechar</button>
          </div>
        </div>
      )}

      {/* ══ MODAL MAPA EXPANDIDO ══ */}
      {modalMapaDenuncia && denunciaSelecionada && (
        <div className="admin-modal-overlay" onClick={() => setModalMapaDenuncia(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <p className="modal-eyebrow">Localização da denúncia</p>
                <h2>{denunciaSelecionada.titulo}</h2>
                <p className="modal-sub">{denunciaSelecionada.localizacao}</p>
              </div>
              <button type="button" className="admin-close" onClick={() => setModalMapaDenuncia(false)}>✕</button>
            </div>
            <div className="admin-map-real">
              <iframe title="Mapa da denúncia" src={getMapaDenunciaUrl(denunciaSelecionada)} width="100%" height="450" style={{ border:0 }} loading="lazy" />
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL ATUALIZAR ══ */}
      {modalAtualizar && denunciaSelecionada && (
        <div className="admin-modal-overlay" onClick={() => setModalAtualizar(false)}>
          <div className="admin-modal details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="details-modal-header">
              <h2>Atualizar denúncia</h2>
              <button className="admin-close" onClick={() => setModalAtualizar(false)}>✕</button>
            </div>
            <div className="update-form">
              <div className="modal-form-group">
                <label>Status</label>
                <select value={denunciaSelecionada.status} onChange={(e) => setDenunciaSelecionada({ ...denunciaSelecionada, status: e.target.value })}>
                  <option value="ABERTA">Aberta</option>
                  <option value="EM_ANDAMENTO">Em andamento</option>
                  <option value="RESOLVIDA">Resolvida</option>
                </select>
              </div>
              <div className="modal-form-group">
                <label>Prioridade</label>
                <select value={denunciaSelecionada.prioridade} onChange={(e) => setDenunciaSelecionada({ ...denunciaSelecionada, prioridade: e.target.value })}>
                  <option value="BAIXA">Baixa</option>
                  <option value="MEDIA">Média</option>
                  <option value="ALTA">Alta</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setModalAtualizar(false)}>Cancelar</button>
              <button className="save-btn" onClick={salvarAtualizacaoDenuncia}>Salvar alterações</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL NOVO USUÁRIO ══ */}
      {modalNovoUsuario && (
        <div className="admin-modal-overlay" onClick={() => setModalNovoUsuario(false)}>
          <div className="admin-modal details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="details-modal-header">
              <h2>Novo usuário</h2>
              <button className="admin-close" onClick={() => setModalNovoUsuario(false)}>✕</button>
            </div>
            <form onSubmit={salvarNovoUsuario} className="new-user-form">
              {[
                { label:"Nome",     key:"nome",     type:"text"     },
                { label:"E-mail",   key:"email",    type:"email"    },
                { label:"Telefone", key:"telefone", type:"text"     },
                { label:"Cidade",   key:"cidade",   type:"text"     },
                { label:"Senha",    key:"senha",    type:"password" },
              ].map(({ label, key, type }) => (
                <div className="modal-form-group" key={key}>
                  <label>{label}</label>
                  <input type={type} required={key !== "telefone" && key !== "cidade"} value={novoUsuario[key]} onChange={(e) => setNovoUsuario({ ...novoUsuario, [key]: e.target.value })} />
                </div>
              ))}
              <div className="modal-form-group">
                <label>Tipo</label>
                <select value={novoUsuario.tipoUsuario} onChange={(e) => setNovoUsuario({ ...novoUsuario, tipoUsuario: e.target.value })}>
                  <option value="USUARIO">Usuário</option>
                  <option value="ADMINISTRADOR">Administrador</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setModalNovoUsuario(false)}>Cancelar</button>
                <button type="submit" className="save-btn">Salvar usuário</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ MODAL PERFIL USUÁRIO ══ */}
      {modalPerfilUsuario && usuarioSelecionado && (
        <div className="admin-modal-overlay" onClick={() => setModalPerfilUsuario(false)}>
          <div className="admin-modal details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="details-modal-header">
              <h2>Perfil do usuário</h2>
              <button className="admin-close" onClick={() => setModalPerfilUsuario(false)}>✕</button>
            </div>
            <div className="perfil-usuario-topo">
              <div className="usuario-avatar large">
                {(usuarioSelecionado.nome || "U").split(" ").map((n) => n[0]).join("").slice(0,2).toUpperCase()}
              </div>
              <div>
                <h3>{usuarioSelecionado.nome}</h3>
                <span className={`tipo-badge ${formatarTipoUsuario(usuarioSelecionado) === "Administrador" ? "tipo--admin" : "tipo--user"}`}>
                  {formatarTipoUsuario(usuarioSelecionado)}
                </span>
              </div>
            </div>
            <div className="details-grid">
              {[
                ["E-mail",    usuarioSelecionado.email],
                ["Telefone",  usuarioSelecionado.telefone || "Não informado"],
                ["Cidade",    usuarioSelecionado.cidade   || "Não informada"],
                ["Denúncias", usuarioSelecionado.denuncias || 0],
              ].map(([label, val]) => (
                <div key={label} className="detail-field">
                  <span className="detail-label">{label}</span>
                  <span className="detail-value">{val}</span>
                </div>
              ))}
            </div>
            <button className="save-btn" onClick={() => setModalPerfilUsuario(false)}>Fechar</button>
          </div>
        </div>
      )}

      {/* ══ PREVIEW IMAGEM ══ */}
      {imagemVisualizando && (
        <div className="admin-imagem-overlay" onClick={() => setImagemVisualizando(null)}>
          <button className="admin-imagem-overlay-close">✕</button>
          <img src={imagemVisualizando} alt="Imagem da denúncia" className="admin-imagem-preview" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

export default Admin;