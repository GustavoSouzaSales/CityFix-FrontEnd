import "../styles/admin.css";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import NavBar from "../../dashboard/components/NavBar";

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
    nome: "",
    email: "",
    telefone: "",
    cidade: "",
    senha: "",
    tipo: "USUARIO",
  });

  const API_CATEGORIAS = "http://localhost:8080/categorias";
  const API_DENUNCIAS = "http://localhost:8080/denuncias";
  const API_USUARIOS = "http://localhost:8080/usuarios";

  async function carregarDados() {
    try {
      const [resCategorias, resDenuncias, resUsuarios] = await Promise.all([
        fetch(API_CATEGORIAS),
        fetch(API_DENUNCIAS),
        fetch(API_USUARIOS),
      ]);

      const categoriasData = await resCategorias.json();
      const denunciasData = await resDenuncias.json();
      const usuariosData = await resUsuarios.json();

      setCategorias(categoriasData);
      setDenuncias(denunciasData);

      const usuariosComDenuncias = usuariosData.map((usuario) => ({
        ...usuario,
        denuncias: denunciasData.filter((d) => d.usuario?.id === usuario.id).length,
      }));

      setUsuarios(usuariosComDenuncias);
    } catch (error) {
      console.error("Erro ao carregar dados do admin:", error);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function formatarStatus(status) {
    if (status === "ABERTA") return "Aberta";
    if (status === "EM_ANDAMENTO") return "Em andamento";
    if (status === "RESOLVIDA") return "Resolvida";
    return status || "Aberta";
  }

  function formatarPrioridade(prioridade) {
    if (prioridade === "ALTA") return "Alta";
    if (prioridade === "MEDIA") return "Média";
    if (prioridade === "BAIXA") return "Baixa";
    return prioridade || "Média";
  }

  function formatarTipoUsuario(usuarioOuTipo) {
    const tipo =
      typeof usuarioOuTipo === "object"
        ? usuarioOuTipo.tipo ||
          usuarioOuTipo.role ||
          usuarioOuTipo.perfil ||
          usuarioOuTipo.tipoUsuario
        : usuarioOuTipo;

    const tipoNormalizado = String(tipo || "").toUpperCase();

    if (
      tipoNormalizado === "ADMIN" ||
      tipoNormalizado === "ADMINISTRADOR" ||
      tipoNormalizado === "ROLE_ADMIN"
    ) {
      return "Administrador";
    }

    return "Usuário";
  }

  function tipoParaBackend(tipo) {
    if (tipo === "Administrador") return "ADMIN";
    if (tipo === "Usuário") return "USUARIO";
    return tipo;
  }

  function getMapaDenunciaUrl(denuncia) {
    const latitude = denuncia?.latitude;
    const longitude = denuncia?.longitude;

    if (latitude && longitude) {
      return `https://maps.google.com/maps?q=${latitude},${longitude}&z=17&output=embed`;
    }

    return `https://maps.google.com/maps?q=${encodeURIComponent(
      denuncia?.localizacao || "Irecê BA"
    )}&z=17&output=embed`;
  }

  const denunciasFiltradas = denuncias.filter((denuncia) => {
    const busca = buscaDenuncia.toLowerCase();
    const statusFormatado = formatarStatus(denuncia.status);
    const categoriaNome = denuncia.categoria?.nome || "";
    const autorNome = denuncia.usuario?.nome || "Usuário não informado";

    return (
      (denuncia.titulo?.toLowerCase().includes(busca) ||
        denuncia.localizacao?.toLowerCase().includes(busca) ||
        autorNome.toLowerCase().includes(busca)) &&
      (statusFiltro === "Todos" || statusFormatado === statusFiltro) &&
      (categoriaFiltro === "Todas" || categoriaNome === categoriaFiltro)
    );
  });

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const busca = buscaUsuario.toLowerCase();
    const tipoFormatado = formatarTipoUsuario(usuario);

    return (
      (usuario.nome?.toLowerCase().includes(busca) ||
        usuario.email?.toLowerCase().includes(busca) ||
        (usuario.cidade || "").toLowerCase().includes(busca) ||
        (usuario.telefone || "").toLowerCase().includes(busca)) &&
      (tipoUsuarioFiltro === "Todos" || tipoFormatado === tipoUsuarioFiltro)
    );
  });

  const categoriasFiltradas = categorias.filter((categoria) => {
    const busca = buscaCategoria.toLowerCase();

    return (
      categoria.nome?.toLowerCase().includes(busca) ||
      (categoria.descricao || "").toLowerCase().includes(busca)
    );
  });

  async function salvarNovoUsuario(e) {
    e.preventDefault();

    try {
      const response = await fetch(API_USUARIOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: novoUsuario.nome,
          email: novoUsuario.email,
          telefone: novoUsuario.telefone,
          cidade: novoUsuario.cidade,
          senha: novoUsuario.senha,
          tipo: tipoParaBackend(novoUsuario.tipo),
        }),
      });

      if (!response.ok) {
        alert("Erro ao cadastrar usuário.");
        return;
      }

      setNovoUsuario({
        nome: "",
        email: "",
        telefone: "",
        cidade: "",
        senha: "",
        tipo: "USUARIO",
      });

      setModalNovoUsuario(false);
      carregarDados();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      alert("Erro ao conectar com o servidor.");
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

      if (!response.ok) {
        alert("Erro ao cadastrar categoria.");
        return;
      }

      setNovaCategoria({ nome: "", descricao: "" });
      carregarDados();
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
    }
  }

  async function removerCategoria(id) {
    try {
      await fetch(`${API_CATEGORIAS}/${id}`, { method: "DELETE" });
      carregarDados();
    } catch (error) {
      console.error("Erro ao remover categoria:", error);
    }
  }

  async function salvarAtualizacaoDenuncia() {
    try {
      const response = await fetch(
        `${API_DENUNCIAS}/${denunciaSelecionada.id}/status?status=${denunciaSelecionada.status}&prioridade=${denunciaSelecionada.prioridade}`,
        { method: "PUT" }
      );

      if (!response.ok) {
        alert("Erro ao atualizar denúncia.");
        return;
      }

      const denunciaAtualizada = await response.json();

      setDenuncias(
        denuncias.map((d) =>
          d.id === denunciaAtualizada.id ? denunciaAtualizada : d
        )
      );

      setModalAtualizar(false);
    } catch (error) {
      console.error("Erro ao atualizar denúncia:", error);
      alert("Erro ao conectar com o servidor.");
    }
  }

  const statsData = [
    {
      emoji: "📋",
      label: "Denúncias abertas",
      valor: denuncias.filter((d) => d.status === "ABERTA").length,
      cor: "stat--green",
    },
    {
      emoji: "⏳",
      label: "Em andamento",
      valor: denuncias.filter((d) => d.status === "EM_ANDAMENTO").length,
      cor: "stat--yellow",
    },
    {
      emoji: "✅",
      label: "Resolvidas",
      valor: denuncias.filter((d) => d.status === "RESOLVIDA").length,
      cor: "stat--blue",
    },
    {
      emoji: "👥",
      label: "Usuários",
      valor: usuarios.length,
      cor: "stat--purple",
    },
  ];

  const modulosData = [
    {
      id: "denuncias",
      icon: "📋",
      titulo: "Gerenciar denúncias",
      descricao: "Visualize, filtre e atualize as denúncias registradas.",
      meta: `${denuncias.length} registros`,
    },
    {
      id: "usuarios",
      icon: "👥",
      titulo: "Gerenciar usuários",
      descricao: "Consulte usuários cadastrados e suas atividades.",
      meta: `${usuarios.length} cadastros`,
    },
    {
      id: "categorias",
      icon: "🏷️",
      titulo: "Gerenciar categorias",
      descricao: "Cadastre e organize os tipos de denúncias.",
      meta: `${categorias.length} categorias`,
    },
    {
      id: "mapa",
      icon: "🗺️",
      titulo: "Mapa da cidade",
      descricao: "Acompanhe pontos de denúncias espalhados pela cidade.",
      meta: "Irecê – BA",
    },
  ];

function getDenunciasComCoordenadas() {
  return denuncias.filter((denuncia) => {
    const lat = Number(denuncia.latitude);
    const lng = Number(denuncia.longitude);

    return (
      denuncia.status !== "RESOLVIDA" &&
      denuncia.latitude !== null &&
      denuncia.latitude !== undefined &&
      denuncia.latitude !== "" &&
      denuncia.longitude !== null &&
      denuncia.longitude !== undefined &&
      denuncia.longitude !== "" &&
      !Number.isNaN(lat) &&
      !Number.isNaN(lng)
    );
  });
}

function getCorMarcadorPrioridade(prioridade) {
  if (prioridade === "ALTA") return "#ef4444";
  if (prioridade === "MEDIA") return "#f59e0b";
  if (prioridade === "BAIXA") return "#3b82f6";
  return "#f59e0b";
}

  return (
    <div className="admin-page">
      <NavBar />

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
            <p>
              Use esta área para acompanhar rapidamente o estado geral da
              plataforma e acessar as principais funções administrativas.
            </p>
          </div>

          <div className="admin-actions">
            <button onClick={() => setModalAberto("denuncias")}>📋 Ver denúncias</button>
            <button onClick={() => setModalAberto("usuarios")}>👥 Ver usuários</button>
            <button onClick={() => setModalAberto("categorias")}>🏷️ Ver categorias</button>
            <button onClick={() => setModalAberto("mapa")}>🗺️ Ver mapa</button>
          </div>
        </section>
      </main>

      {modalAberto && (
        <div className="admin-modal-overlay" onClick={() => setModalAberto(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <p className="modal-eyebrow">
                  {modalAberto === "denuncias" && "Gestão · Denúncias"}
                  {modalAberto === "usuarios" && "Gestão · Usuários"}
                  {modalAberto === "categorias" && "Gestão · Categorias"}
                  {modalAberto === "mapa" && "Gestão · Mapa"}
                </p>

                <h2>
                  {modalAberto === "denuncias" && "Gerenciar denúncias"}
                  {modalAberto === "usuarios" && "Gerenciar usuários"}
                  {modalAberto === "categorias" && "Gerenciar categorias"}
                  {modalAberto === "mapa" && "Mapa da cidade"}
                </h2>

                <p className="modal-sub">
                  {modalAberto === "denuncias" && "Acompanhe e atualize as denúncias da plataforma."}
                  {modalAberto === "usuarios" && "Consulte os usuários cadastrados no sistema."}
                  {modalAberto === "categorias" && "Cadastre, visualize e organize categorias de denúncias."}
                  {modalAberto === "mapa" && "Visualize a distribuição das denúncias na cidade."}
                </p>
              </div>

              <button className="admin-close" onClick={() => setModalAberto(null)}>
                ✕
              </button>
            </div>

            {modalAberto === "denuncias" && (
              <div className="admin-modal-content">
                <div className="admin-filter-row">
                  <div className="filter-input-wrap">
                    <span className="filter-icon">🔍</span>
                    <input
                      placeholder="Buscar por título, local ou autor..."
                      value={buscaDenuncia}
                      onChange={(e) => setBuscaDenuncia(e.target.value)}
                    />
                  </div>

                  <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}>
                    <option>Todos</option>
                    <option>Aberta</option>
                    <option>Em andamento</option>
                    <option>Resolvida</option>
                  </select>

                  <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)}>
                    <option>Todas</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id}>{categoria.nome}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-list">
                  {denunciasFiltradas.map((denuncia) => (
                    <article className="admin-list-item" key={denuncia.id}>
                      <div className="list-item-info">
                        <div className="list-item-title-row">
                          <h3>{denuncia.titulo}</h3>
                          <span
                            className={`prioridade-badge ${
                              prioridadeConfig[formatarPrioridade(denuncia.prioridade)]?.cor
                            }`}
                          >
                            {formatarPrioridade(denuncia.prioridade)}
                          </span>
                        </div>

                        <p className="list-item-local">📍 {denuncia.localizacao}</p>
                        <p className="list-item-meta">
                          {denuncia.usuario?.nome || "Usuário não informado"} ·{" "}
                          {denuncia.categoria?.nome || "Sem categoria"}
                        </p>
                      </div>

                      <div className="admin-item-actions">
                        <span
                          className={`status-badge ${
                            statusConfig[formatarStatus(denuncia.status)]?.cor
                          }`}
                        >
                          <span
                            className="status-dot"
                            style={{
                              background: statusConfig[formatarStatus(denuncia.status)]?.dot,
                            }}
                          />
                          {formatarStatus(denuncia.status)}
                        </span>

                        <button
                          className="btn-outline"
                          onClick={() => {
                            setDenunciaSelecionada(denuncia);
                            setModalDetalhes(true);
                          }}
                        >
                          Detalhes
                        </button>

                        <button
                          className="btn-solid"
                          onClick={() => {
                            setDenunciaSelecionada(denuncia);
                            setModalAtualizar(true);
                          }}
                        >
                          Atualizar
                        </button>
                      </div>
                    </article>
                  ))}

                  {denunciasFiltradas.length === 0 && (
                    <div className="empty-state">
                      <span>🔎</span>
                      <p>Nenhuma denúncia encontrada.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {modalAberto === "usuarios" && (
              <div className="admin-modal-content">
                <div className="admin-filter-row">
                  <div className="filter-input-wrap">
                    <span className="filter-icon">🔍</span>
                    <input
                      placeholder="Buscar por nome, e-mail, telefone ou cidade..."
                      value={buscaUsuario}
                      onChange={(e) => setBuscaUsuario(e.target.value)}
                    />
                  </div>

                  <select
                    value={tipoUsuarioFiltro}
                    onChange={(e) => setTipoUsuarioFiltro(e.target.value)}
                  >
                    <option>Todos</option>
                    <option>Usuário</option>
                    <option>Administrador</option>
                  </select>

                  <button
                    className="new-user-btn"
                    onClick={() => setModalNovoUsuario(true)}
                  >
                    ＋ Novo usuário
                  </button>
                </div>

                <div className="admin-list">
                  {usuariosFiltrados.map((usuario) => (
                    <article className="admin-list-item" key={usuario.id || usuario.email}>
                      <div className="list-item-info">
                        <div className="usuario-avatar-row">
                          <div className="usuario-avatar">
                            {(usuario.nome || "U")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <div>
                            <h3>{usuario.nome}</h3>
                            <p className="list-item-meta">
                              {usuario.email} · {usuario.cidade || "Cidade não informada"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="admin-item-actions">
                        <span
                          className={`tipo-badge ${
                            formatarTipoUsuario(usuario) === "Administrador"
                              ? "tipo--admin"
                              : "tipo--user"
                          }`}
                        >
                          {formatarTipoUsuario(usuario)}
                        </span>

                        <span className="denuncias-count">
                          {usuario.denuncias || 0} denúncias
                        </span>

                        <button
                          className="btn-solid"
                          onClick={() => {
                            setUsuarioSelecionado(usuario);
                            setModalPerfilUsuario(true);
                          }}
                        >
                          Ver perfil
                        </button>
                      </div>
                    </article>
                  ))}

                  {usuariosFiltrados.length === 0 && (
                    <div className="empty-state">
                      <span>🔎</span>
                      <p>Nenhum usuário encontrado.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {modalAberto === "categorias" && (
              <div className="admin-modal-content">
                <form onSubmit={salvarNovaCategoria} className="new-user-form">
                  <div className="modal-form-group">
                    <label>Nome da categoria</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Buraco"
                      value={novaCategoria.nome}
                      onChange={(e) =>
                        setNovaCategoria({ ...novaCategoria, nome: e.target.value })
                      }
                    />
                  </div>

                  <div className="modal-form-group">
                    <label>Descrição</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Problemas em vias públicas"
                      value={novaCategoria.descricao}
                      onChange={(e) =>
                        setNovaCategoria({ ...novaCategoria, descricao: e.target.value })
                      }
                    />
                  </div>

                  <div className="modal-actions">
                    <button type="submit" className="save-btn">
                      Salvar categoria
                    </button>
                  </div>
                </form>

                <div className="admin-filter-row">
                  <div className="filter-input-wrap">
                    <span className="filter-icon">🔍</span>
                    <input
                      placeholder="Buscar categoria..."
                      value={buscaCategoria}
                      onChange={(e) => setBuscaCategoria(e.target.value)}
                    />
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
                        <button
                          className="btn-outline"
                          onClick={() => removerCategoria(categoria.id)}
                        >
                          Remover
                        </button>
                      </div>
                    </article>
                  ))}

                  {categoriasFiltradas.length === 0 && (
                    <div className="empty-state">
                      <span>🔎</span>
                      <p>Nenhuma categoria encontrada.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {modalAberto === "mapa" && (
  <div className="admin-modal-content">
    <div className="admin-map-real">
      <MapContainer
        center={[-11.3042, -41.8565]}
        zoom={13}
        style={{
          width: "100%",
          height: "420px",
          borderRadius: "18px",
        }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {getDenunciasComCoordenadas().map((denuncia) => {
          const lat = Number(denuncia.latitude);
          const lng = Number(denuncia.longitude);

          return (
            <CircleMarker
              key={denuncia.id}
              center={[lat, lng]}
              radius={10}
              pathOptions={{
                color: getCorMarcadorPrioridade(denuncia.prioridade),
                fillColor: getCorMarcadorPrioridade(denuncia.prioridade),
                fillOpacity: 0.8,
              }}
            >
              <Popup>
                <div className="map-popup">
                  <strong>{denuncia.titulo}</strong>
                  <p>{denuncia.localizacao}</p>
                  <small>Status: {formatarStatus(denuncia.status)}</small>
                  <br />
                  <small>
                    Categoria: {denuncia.categoria?.nome || "Sem categoria"}
                  </small>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>

    {getDenunciasComCoordenadas().length === 0 && (
      <p className="map-empty-message">
        Nenhuma denúncia com coordenadas registrada ainda.
      </p>
    )}

    <div className="map-legend">
      <span><b className="legend-dot alta"></b> Alta prioridade</span>
      <span><b className="legend-dot media"></b> Média prioridade</span>
      <span><b className="legend-dot baixa"></b> Baixa prioridade</span>
    </div>

    <div className="map-info">
                  <article>
                    <h3>{denuncias.length}</h3>
                    <p>Denúncias registradas</p>
                  </article>

                  <article>
                    <h3>{denuncias.filter((d) => d.status === "ABERTA").length}</h3>
                    <p>Denúncias abertas</p>
                  </article>

                  <article>
                    <h3>{denuncias.filter((d) => d.status === "RESOLVIDA").length}</h3>
                    <p>Denúncias resolvidas</p>
                  </article>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {modalDetalhes && denunciaSelecionada && (
        <div className="admin-modal-overlay" onClick={() => setModalDetalhes(false)}>
          <div className="admin-modal details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="details-modal-header">
              <h2>Detalhes da denúncia</h2>
              <button className="admin-close" onClick={() => setModalDetalhes(false)}>
                ✕
              </button>
            </div>

            <div className="details-grid">
              {[
                ["Autor", denunciaSelecionada.usuario?.nome || "Usuário não informado"],
                ["Local", denunciaSelecionada.localizacao],
                ["Categoria", denunciaSelecionada.categoria?.nome || "Sem categoria"],
                ["Status", formatarStatus(denunciaSelecionada.status)],
                ["Prioridade", formatarPrioridade(denunciaSelecionada.prioridade)],
              ].map(([label, val]) => (
                <div key={label} className="detail-field">
                  <span className="detail-label">{label}</span>
                  <span className="detail-value">{val}</span>
                </div>
              ))}
            </div>

            <div
              className="detail-map-preview"
              onClick={() => setModalMapaDenuncia(true)}
            >
              <div className="detail-map-info">
                <span>🗺️</span>
                <div>
                  <strong>Mapa da localização</strong>
                  <p>Clique para visualizar o ponto registrado.</p>
                </div>
              </div>

              <iframe
                title="Prévia da localização"
                src={getMapaDenunciaUrl(denunciaSelecionada)}
                width="100%"
                height="180"
                style={{ border: 0, borderRadius: "14px", pointerEvents: "none" }}
                loading="lazy"
              />
            </div>

            <button className="save-btn" onClick={() => setModalDetalhes(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {modalMapaDenuncia && denunciaSelecionada && (
        <div
          className="admin-modal-overlay"
          onClick={() => setModalMapaDenuncia(false)}
        >
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <p className="modal-eyebrow">Localização da denúncia</p>
                <h2>{denunciaSelecionada.titulo}</h2>
                <p className="modal-sub">{denunciaSelecionada.localizacao}</p>
              </div>

              <button
                type="button"
                className="admin-close"
                onClick={() => setModalMapaDenuncia(false)}
              >
                ✕
              </button>
            </div>

            <div className="admin-map-real">
              <iframe
                title="Mapa da denúncia"
                src={getMapaDenunciaUrl(denunciaSelecionada)}
                width="100%"
                height="450"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}

      {modalAtualizar && denunciaSelecionada && (
        <div className="admin-modal-overlay" onClick={() => setModalAtualizar(false)}>
          <div className="admin-modal details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="details-modal-header">
              <h2>Atualizar denúncia</h2>
              <button className="admin-close" onClick={() => setModalAtualizar(false)}>
                ✕
              </button>
            </div>

            <div className="update-form">
              <div className="modal-form-group">
                <label>Status</label>
                <select
                  value={denunciaSelecionada.status}
                  onChange={(e) =>
                    setDenunciaSelecionada({
                      ...denunciaSelecionada,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="ABERTA">Aberta</option>
                  <option value="EM_ANDAMENTO">Em andamento</option>
                  <option value="RESOLVIDA">Resolvida</option>
                </select>
              </div>

              <div className="modal-form-group">
                <label>Prioridade</label>
                <select
                  value={denunciaSelecionada.prioridade}
                  onChange={(e) =>
                    setDenunciaSelecionada({
                      ...denunciaSelecionada,
                      prioridade: e.target.value,
                    })
                  }
                >
                  <option value="BAIXA">Baixa</option>
                  <option value="MEDIA">Média</option>
                  <option value="ALTA">Alta</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setModalAtualizar(false)}>
                Cancelar
              </button>

              <button className="save-btn" onClick={salvarAtualizacaoDenuncia}>
                Salvar alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {modalNovoUsuario && (
        <div className="admin-modal-overlay" onClick={() => setModalNovoUsuario(false)}>
          <div className="admin-modal details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="details-modal-header">
              <h2>Novo usuário</h2>
              <button className="admin-close" onClick={() => setModalNovoUsuario(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={salvarNovoUsuario} className="new-user-form">
              {[
                { label: "Nome", key: "nome", type: "text" },
                { label: "E-mail", key: "email", type: "email" },
                { label: "Telefone", key: "telefone", type: "text" },
                { label: "Cidade", key: "cidade", type: "text" },
                { label: "Senha", key: "senha", type: "password" },
              ].map(({ label, key, type }) => (
                <div className="modal-form-group" key={key}>
                  <label>{label}</label>
                  <input
                    type={type}
                    required={key !== "telefone" && key !== "cidade"}
                    value={novoUsuario[key]}
                    onChange={(e) =>
                      setNovoUsuario({ ...novoUsuario, [key]: e.target.value })
                    }
                  />
                </div>
              ))}

              <div className="modal-form-group">
                <label>Tipo</label>
                <select
                  value={formatarTipoUsuario(novoUsuario.tipo)}
                  onChange={(e) =>
                    setNovoUsuario({
                      ...novoUsuario,
                      tipo: tipoParaBackend(e.target.value),
                    })
                  }
                >
                  <option>Usuário</option>
                  <option>Administrador</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setModalNovoUsuario(false)}
                >
                  Cancelar
                </button>

                <button type="submit" className="save-btn">
                  Salvar usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalPerfilUsuario && usuarioSelecionado && (
        <div className="admin-modal-overlay" onClick={() => setModalPerfilUsuario(false)}>
          <div className="admin-modal details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="details-modal-header">
              <h2>Perfil do usuário</h2>
              <button className="admin-close" onClick={() => setModalPerfilUsuario(false)}>
                ✕
              </button>
            </div>

            <div className="perfil-usuario-topo">
              <div className="usuario-avatar large">
                {(usuarioSelecionado.nome || "U")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <h3>{usuarioSelecionado.nome}</h3>
                <span
                  className={`tipo-badge ${
                    formatarTipoUsuario(usuarioSelecionado) === "Administrador"
                      ? "tipo--admin"
                      : "tipo--user"
                  }`}
                >
                  {formatarTipoUsuario(usuarioSelecionado)}
                </span>
              </div>
            </div>

            <div className="details-grid">
              {[
                ["E-mail", usuarioSelecionado.email],
                ["Telefone", usuarioSelecionado.telefone || "Não informado"],
                ["Cidade", usuarioSelecionado.cidade || "Não informada"],
                ["Denúncias", usuarioSelecionado.denuncias || 0],
              ].map(([label, val]) => (
                <div key={label} className="detail-field">
                  <span className="detail-label">{label}</span>
                  <span className="detail-value">{val}</span>
                </div>
              ))}
            </div>

            <button className="save-btn" onClick={() => setModalPerfilUsuario(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;