import "../styles/admin.css";
import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import NavBar from "../../dashboard/components/NavBar";

/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
function Toast({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          <span className="toast-icon">
            {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
          </span>
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
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  return { toasts, addToast, removeToast };
}

/* ══════════════════════════════════════
   CONFIGS
══════════════════════════════════════ */
const statusConfig = {
  Aberta: { cor: "status--aberta", dot: "#31bf49" },
  "Em andamento": { cor: "status--andamento", dot: "#f4d06f" },
  Resolvida: { cor: "status--resolvida", dot: "#60a5fa" },
};

const prioridadeConfig = {
  Alta: { cor: "prio--alta" },
  Média: { cor: "prio--media" },
  Baixa: { cor: "prio--baixa" },
};

/* ══════════════════════════════════════
   ADMIN
══════════════════════════════════════ */
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
    nome: "", email: "", telefone: "", cidade: "", senha: "", tipo: "USUARIO",
  });

  const { toasts, addToast, removeToast } = useToast();

  const API_CATEGORIAS = "http://localhost:8080/categorias";
  const API_DENUNCIAS  = "http://localhost:8080/denuncias";
  const API_USUARIOS   = "http://localhost:8080/usuarios";

  async function carregarDados() {
    try {
      const [resCategorias, resDenuncias, resUsuarios] = await Promise.all([
        fetch(API_CATEGORIAS),
        fetch(API_DENUNCIAS),
        fetch(API_USUARIOS),
      ]);
      const categoriasData = await resCategorias.json();
      const denunciasData  = await resDenuncias.json();
      const usuariosData   = await resUsuarios.json();
      setCategorias(categoriasData);
      setDenuncias(denunciasData);
      setUsuarios(
        usuariosData.map((u) => ({
          ...u,
          denuncias: denunciasData.filter((d) => d.usuario?.id === u.id).length,
        }))
      );
    } catch (error) {
      console.error("Erro ao carregar dados do admin:", error);
    }
  }

  useEffect(() => { carregarDados(); }, []);

  /* ── helpers ── */
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
    return "Usuário";
  }

  function tipoParaBackend(tipo) {
    if (tipo === "Administrador") return "ADMIN";
    if (tipo === "Usuário")       return "USUARIO";
    return tipo;
  }

  function getMapaDenunciaUrl(denuncia) {
    const lat = denuncia?.latitude;
    const lng = denuncia?.longitude;
    if (lat && lng) return `https://maps.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
    return `https://maps.google.com/maps?q=${encodeURIComponent(denuncia?.localizacao || "Irecê BA")}&z=17&output=embed`;
  }

  /* ── filtros ── */
  const denunciasFiltradas = denuncias.filter((d) => {
    const busca = buscaDenuncia.toLowerCase();
    const s     = formatarStatus(d.status);
    const cat   = d.categoria?.nome || "";
    const autor = d.usuario?.nome   || "Usuário não informado";
    return (
      (d.titulo?.toLowerCase().includes(busca) || d.localizacao?.toLowerCase().includes(busca) || autor.toLowerCase().includes(busca)) &&
      (statusFiltro === "Todos" || s === statusFiltro) &&
      (categoriaFiltro === "Todas" || cat === categoriaFiltro)
    );
  });

  const usuariosFiltrados = usuarios.filter((u) => {
    const busca = buscaUsuario.toLowerCase();
    const tipo  = formatarTipoUsuario(u);
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

  /* ── actions ── */
  async function salvarNovoUsuario(e) {
    e.preventDefault();
    try {
      const response = await fetch(API_USUARIOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...novoUsuario, tipo: tipoParaBackend(novoUsuario.tipo) }),
      });
      if (!response.ok) { addToast("Erro ao cadastrar usuário. Verifique os dados.", "error"); return; }
      setNovoUsuario({ nome:"", email:"", telefone:"", cidade:"", senha:"", tipo:"USUARIO" });
      setModalNovoUsuario(false);
      carregarDados();
      addToast("Usuário cadastrado com sucesso!", "success");
    } catch (error) {
      addToast("Falha na conexão com o servidor.", "error");
    }
  }

  async function salvarNovaCategoria(e) {
    e.preventDefault();
    try {
      const response = await fetch(API_CATEGORIAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaCategoria),
      });
      if (!response.ok) { addToast("Erro ao cadastrar categoria.", "error"); return; }
      setNovaCategoria({ nome:"", descricao:"" });
      carregarDados();
      addToast("Categoria cadastrada com sucesso!", "success");
    } catch (error) {
      addToast("Falha na conexão com o servidor.", "error");
    }
  }

  async function removerCategoria(id) {
    try {
      await fetch(`${API_CATEGORIAS}/${id}`, { method: "DELETE" });
      carregarDados();
      addToast("Categoria removida.", "info");
    } catch (error) {
      addToast("Erro ao remover categoria.", "error");
    }
  }

  async function salvarAtualizacaoDenuncia() {
    try {
      const response = await fetch(
        `${API_DENUNCIAS}/${denunciaSelecionada.id}/status?status=${denunciaSelecionada.status}&prioridade=${denunciaSelecionada.prioridade}`,
        { method: "PUT" }
      );
      if (!response.ok) { addToast("Erro ao atualizar denúncia.", "error"); return; }
      const denunciaAtualizada = await response.json();
      setDenuncias(denuncias.map((d) => d.id === denunciaAtualizada.id ? denunciaAtualizada : d));
      setModalAtualizar(false);
      addToast("Denúncia atualizada com sucesso!", "success");
    } catch (error) {
      addToast("Falha na conexão com o servidor.", "error");
    }
  }

  /* ── mapa ── */
  function getDenunciasComCoordenadas() {
    return denuncias.filter((d) => {
      const lat = Number(d.latitude);
      const lng = Number(d.longitude);
      return (
        d.status !== "RESOLVIDA" &&
        d.latitude != null && d.latitude !== "" &&
        d.longitude != null && d.longitude !== "" &&
        !Number.isNaN(lat) && !Number.isNaN(lng)
      );
    });
  }

  function getCorMarcadorPrioridade(prioridade) {
    if (prioridade === "ALTA")  return "#ef4444";
    if (prioridade === "MEDIA") return "#f59e0b";
    if (prioridade === "BAIXA") return "#3b82f6";
    return "#f59e0b";
  }

  /* ── stats / módulos ── */
  const statsData = [
    { emoji:"📋", label:"Denúncias abertas", valor: denuncias.filter((d) => d.status==="ABERTA").length,       cor:"stat--green"  },
    { emoji:"⏳", label:"Em andamento",       valor: denuncias.filter((d) => d.status==="EM_ANDAMENTO").length, cor:"stat--yellow" },
    { emoji:"✅", label:"Resolvidas",          valor: denuncias.filter((d) => d.status==="RESOLVIDA").length,   cor:"stat--blue"   },
    { emoji:"👥", label:"Usuários",            valor: usuarios.length,                                          cor:"stat--purple" },
  ];

  const modulosData = [
    { id:"denuncias",  icon:"📋", titulo:"Gerenciar denúncias",  descricao:"Visualize, filtre e atualize as denúncias registradas.", meta:`${denuncias.length} registros` },
    { id:"usuarios",   icon:"👥", titulo:"Gerenciar usuários",   descricao:"Consulte usuários cadastrados e suas atividades.",        meta:`${usuarios.length} cadastros` },
    { id:"categorias", icon:"🏷️", titulo:"Gerenciar categorias", descricao:"Cadastre e organize os tipos de denúncias.",             meta:`${categorias.length} categorias` },
    { id:"mapa",       icon:"🗺️", titulo:"Mapa da cidade",       descricao:"Acompanhe pontos de denúncias espalhados pela cidade.",  meta:"Irecê – BA" },
  ];

  return (
    <div className="admin-page">
      <NavBar />
      <Toast toasts={toasts} removeToast={removeToast} />

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
                      <div className="list-item-info">
                        <div className="list-item-title-row">
                          <h3>{denuncia.titulo}</h3>
                          <span className={`prioridade-badge ${prioridadeConfig[formatarPrioridade(denuncia.prioridade)]?.cor}`}>
                            {formatarPrioridade(denuncia.prioridade)}
                          </span>
                        </div>
                        <p className="list-item-local">📍 {denuncia.localizacao}</p>
                        <p className="list-item-meta">{denuncia.usuario?.nome || "Usuário não informado"} · {denuncia.categoria?.nome || "Sem categoria"}</p>
                      </div>
                      <div className="admin-item-actions">
                        <span className={`status-badge ${statusConfig[formatarStatus(denuncia.status)]?.cor}`}>
                          <span className="status-dot" style={{ background: statusConfig[formatarStatus(denuncia.status)]?.dot }} />
                          {formatarStatus(denuncia.status)}
                        </span>
                        <button className="btn-outline" onClick={() => { setDenunciaSelecionada(denuncia); setModalDetalhes(true); }}>Detalhes</button>
                        <button className="btn-solid"   onClick={() => { setDenunciaSelecionada(denuncia); setModalAtualizar(true); }}>Atualizar</button>
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
                    <option>Todos</option><option>Usuário</option><option>Administrador</option>
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
                    <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {getDenunciasComCoordenadas().map((denuncia) => {
                      const lat = Number(denuncia.latitude);
                      const lng = Number(denuncia.longitude);
                      return (
                        <CircleMarker key={denuncia.id} center={[lat, lng]} radius={10} pathOptions={{ color: getCorMarcadorPrioridade(denuncia.prioridade), fillColor: getCorMarcadorPrioridade(denuncia.prioridade), fillOpacity: 0.8 }}>
                          <Popup>
                            <div className="map-popup">
                              <strong>{denuncia.titulo}</strong>
                              <p>{denuncia.localizacao}</p>
                              <small>Status: {formatarStatus(denuncia.status)}</small><br />
                              <small>Categoria: {denuncia.categoria?.nome || "Sem categoria"}</small>
                            </div>
                          </Popup>
                        </CircleMarker>
                      );
                    })}
                  </MapContainer>
                </div>
                {getDenunciasComCoordenadas().length === 0 && (
                  <p className="map-empty-message">Nenhuma denúncia com coordenadas registrada ainda.</p>
                )}
                <div className="map-legend">
                  <span><b className="legend-dot alta" /> Alta prioridade</span>
                  <span><b className="legend-dot media" /> Média prioridade</span>
                  <span><b className="legend-dot baixa" /> Baixa prioridade</span>
                </div>
                <div className="map-info">
                  <article><h3>{denuncias.length}</h3><p>Denúncias registradas</p></article>
                  <article><h3>{denuncias.filter((d) => d.status==="ABERTA").length}</h3><p>Denúncias abertas</p></article>
                  <article><h3>{denuncias.filter((d) => d.status==="RESOLVIDA").length}</h3><p>Denúncias resolvidas</p></article>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ MODAL DETALHES — REDESENHADO ══ */}
      {modalDetalhes && denunciaSelecionada && (
        <div className="admin-modal-overlay" onClick={() => setModalDetalhes(false)}>
          <div className="admin-modal details-modal" onClick={(e) => e.stopPropagation()}>

            <div className="details-modal-header">
              <div className="details-modal-header-left">
                <div className="details-modal-eyebrow">Denúncia #{denunciaSelecionada.id}</div>
                <h2>{denunciaSelecionada.titulo}</h2>
              </div>
              <button className="admin-close" onClick={() => setModalDetalhes(false)}>✕</button>
            </div>

            {/* Badges de status + prioridade no topo */}
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
                ["👤 Autor",      denunciaSelecionada.usuario?.nome || "Usuário não informado"],
                ["📍 Local",      denunciaSelecionada.localizacao],
                ["🏷️ Categoria",  denunciaSelecionada.categoria?.nome || "Sem categoria"],
                ["📅 Data",       denunciaSelecionada.dataCriacao ? new Date(denunciaSelecionada.dataCriacao).toLocaleDateString("pt-BR") : "Não informada"],
              ].map(([label, val]) => (
                <div key={label} className="detail-field">
                  <span className="detail-label">{label}</span>
                  <span className="detail-value">{val}</span>
                </div>
              ))}
            </div>

            {/* ── Bloco do mapa redesenhado ── */}
            <div className="detail-map-block">
              {/* Header do bloco */}
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
                <button
                  className="detail-map-open-btn"
                  onClick={(e) => { e.stopPropagation(); setModalMapaDenuncia(true); }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  </svg>
                  Abrir mapa
                </button>
              </div>

              {/* Preview do mapa com neon overlay */}
              <div className="detail-map-preview-wrap" onClick={() => setModalMapaDenuncia(true)}>
                {/* Bordas neon decorativas */}
                <div className="detail-map-neon-tl" />
                <div className="detail-map-neon-br" />

                <iframe
                  title="Prévia da localização"
                  src={getMapaDenunciaUrl(denunciaSelecionada)}
                  width="100%"
                  height="200"
                  style={{ border: 0, display:"block", borderRadius:"12px" }}
                  loading="lazy"
                />

                {/* Overlay clicável com hint */}
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
                { label:"Nome",   key:"nome",   type:"text"     },
                { label:"E-mail", key:"email",  type:"email"    },
                { label:"Telefone", key:"telefone", type:"text" },
                { label:"Cidade", key:"cidade", type:"text"     },
                { label:"Senha",  key:"senha",  type:"password" },
              ].map(({ label, key, type }) => (
                <div className="modal-form-group" key={key}>
                  <label>{label}</label>
                  <input type={type} required={key !== "telefone" && key !== "cidade"} value={novoUsuario[key]} onChange={(e) => setNovoUsuario({ ...novoUsuario, [key]: e.target.value })} />
                </div>
              ))}
              <div className="modal-form-group">
                <label>Tipo</label>
                <select value={formatarTipoUsuario(novoUsuario.tipo)} onChange={(e) => setNovoUsuario({ ...novoUsuario, tipo: tipoParaBackend(e.target.value) })}>
                  <option>Usuário</option><option>Administrador</option>
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
    </div>
  );
}

export default Admin;