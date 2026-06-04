import "../styles/admin.css";
import { useEffect, useState } from "react";
import NavBar from "../../dashboard/components/NavBar";

const denunciasIniciais = [
  {
    titulo: "Buraco na via",
    categoria: "Buraco",
    status: "Aberta",
    prioridade: "Alta",
    local: "Rua das Flores, 123 - Centro",
    autor: "João Silva",
  },
  {
    titulo: "Poste com luz apagada",
    categoria: "Iluminação",
    status: "Em andamento",
    prioridade: "Média",
    local: "Av. Brasil, 450 - Jardim América",
    autor: "Maria Santos",
  },
  {
    titulo: "Lixo acumulado",
    categoria: "Lixo",
    status: "Resolvida",
    prioridade: "Média",
    local: "Rua das Palmeiras, 78 - Centro",
    autor: "Carlos Lima",
  },
];

const usuariosIniciais = [
  {
    nome: "João Silva",
    email: "joao@email.com",
    tipo: "Usuário",
    telefone: "(74) 99999-9999",
    cidade: "Irecê - BA",
    denuncias: 5,
  },
  {
    nome: "Maria Santos",
    email: "maria@email.com",
    tipo: "Usuário",
    telefone: "(74) 98888-8888",
    cidade: "Irecê - BA",
    denuncias: 2,
  },
  {
    nome: "Admin CityFix",
    email: "admin@cityfix.com",
    tipo: "Administrador",
    telefone: "(74) 97777-7777",
    cidade: "Irecê - BA",
    denuncias: 0,
  },
];


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
  const [denuncias, setDenuncias] = useState(denunciasIniciais);

  const [usuarios, setUsuarios] = useState(usuariosIniciais);
  const [buscaUsuario, setBuscaUsuario] = useState("");
  const [tipoUsuarioFiltro, setTipoUsuarioFiltro] = useState("Todos");
  const [modalNovoUsuario, setModalNovoUsuario] = useState(false);
  const [modalPerfilUsuario, setModalPerfilUsuario] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  const [categorias, setCategorias] = useState([]);
  const [buscaCategoria, setBuscaCategoria] = useState("");
  const [novaCategoria, setNovaCategoria] = useState({
    nome: "",
    descricao: "",
  });

  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    email: "",
    telefone: "",
    cidade: "",
    tipo: "Usuário",
  });

  const API_CATEGORIAS = "http://localhost:8080/categorias";

async function carregarCategorias() {
  try {
    const response = await fetch(API_CATEGORIAS);
    const data = await response.json();
    setCategorias(data);
  } catch (error) {
    console.error("Erro ao carregar categorias:", error);
  }
}

useEffect(() => {
  carregarCategorias();
}, []);

  const denunciasFiltradas = denuncias.filter((denuncia) => {
    const busca = buscaDenuncia.toLowerCase();

    const correspondeBusca =
      denuncia.titulo.toLowerCase().includes(busca) ||
      denuncia.local.toLowerCase().includes(busca) ||
      denuncia.autor.toLowerCase().includes(busca);

    const correspondeStatus =
      statusFiltro === "Todos" || denuncia.status === statusFiltro;

    const correspondeCategoria =
      categoriaFiltro === "Todas" || denuncia.categoria === categoriaFiltro;

    return correspondeBusca && correspondeStatus && correspondeCategoria;
  });

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const busca = buscaUsuario.toLowerCase();

    const correspondeBusca =
      usuario.nome.toLowerCase().includes(busca) ||
      usuario.email.toLowerCase().includes(busca) ||
      usuario.cidade.toLowerCase().includes(busca);

    const correspondeTipo =
      tipoUsuarioFiltro === "Todos" || usuario.tipo === tipoUsuarioFiltro;

    return correspondeBusca && correspondeTipo;
  });

  const categoriasFiltradas = categorias.filter((categoria) => {
    const busca = buscaCategoria.toLowerCase();

    return (
      categoria.nome.toLowerCase().includes(busca) ||
      (categoria.descricao || "").toLowerCase().includes(busca)
    );
  });

  function salvarNovoUsuario(e) {
    e.preventDefault();

    setUsuarios([...usuarios, { ...novoUsuario, denuncias: 0 }]);

    setNovoUsuario({
      nome: "",
      email: "",
      telefone: "",
      cidade: "",
      tipo: "Usuário",
    });

    setModalNovoUsuario(false);
  }

  async function salvarNovaCategoria(e) {
  e.preventDefault();

  try {
    const response = await fetch(API_CATEGORIAS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novaCategoria),
    });

    if (!response.ok) {
      alert("Erro ao cadastrar categoria.");
      return;
    }

    setNovaCategoria({
      nome: "",
      descricao: "",
    });

    carregarCategorias();
  } catch (error) {
    console.error("Erro ao salvar categoria:", error);
  }
}

  const statsData = [
    {
      emoji: "📋",
      label: "Denúncias abertas",
      valor: denuncias.filter((d) => d.status === "Aberta").length,
      cor: "stat--green",
    },
    {
      emoji: "⏳",
      label: "Em andamento",
      valor: denuncias.filter((d) => d.status === "Em andamento").length,
      cor: "stat--yellow",
    },
    {
      emoji: "✅",
      label: "Resolvidas",
      valor: denuncias.filter((d) => d.status === "Resolvida").length,
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
            <button onClick={() => setModalAberto("denuncias")}>
              <span>📋</span> Ver denúncias
            </button>
            <button onClick={() => setModalAberto("usuarios")}>
              <span>👥</span> Ver usuários
            </button>
            <button onClick={() => setModalAberto("categorias")}>
              <span>🏷️</span> Ver categorias
            </button>
            <button onClick={() => setModalAberto("mapa")}>
              <span>🗺️</span> Ver mapa
            </button>
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
                  {modalAberto === "denuncias" &&
                    "Acompanhe e atualize as denúncias da plataforma."}
                  {modalAberto === "usuarios" &&
                    "Consulte os usuários cadastrados no sistema."}
                  {modalAberto === "categorias" &&
                    "Cadastre, visualize e organize categorias de denúncias."}
                  {modalAberto === "mapa" &&
                    "Visualize a distribuição das denúncias na cidade."}
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

                  <select
                    value={statusFiltro}
                    onChange={(e) => setStatusFiltro(e.target.value)}
                  >
                    <option>Todos</option>
                    <option>Aberta</option>
                    <option>Em andamento</option>
                    <option>Resolvida</option>
                  </select>

                  <select
                    value={categoriaFiltro}
                    onChange={(e) => setCategoriaFiltro(e.target.value)}
                  >
                    <option>Todas</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.nome}>{categoria.nome}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-list">
                  {denunciasFiltradas.map((denuncia) => (
                    <article className="admin-list-item" key={denuncia.titulo}>
                      <div className="list-item-info">
                        <div className="list-item-title-row">
                          <h3>{denuncia.titulo}</h3>
                          <span
                            className={`prioridade-badge ${
                              prioridadeConfig[denuncia.prioridade]?.cor
                            }`}
                          >
                            {denuncia.prioridade}
                          </span>
                        </div>

                        <p className="list-item-local">📍 {denuncia.local}</p>
                        <p className="list-item-meta">
                          {denuncia.autor} · {denuncia.categoria}
                        </p>
                      </div>

                      <div className="admin-item-actions">
                        <span
                          className={`status-badge ${
                            statusConfig[denuncia.status]?.cor
                          }`}
                        >
                          <span
                            className="status-dot"
                            style={{
                              background: statusConfig[denuncia.status]?.dot,
                            }}
                          />
                          {denuncia.status}
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
                      placeholder="Buscar por nome, e-mail ou cidade..."
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
                    <article className="admin-list-item" key={usuario.email}>
                      <div className="list-item-info">
                        <div className="usuario-avatar-row">
                          <div className="usuario-avatar">
                            {usuario.nome
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <div>
                            <h3>{usuario.nome}</h3>
                            <p className="list-item-meta">
                              {usuario.email} · {usuario.cidade}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="admin-item-actions">
                        <span
                          className={`tipo-badge ${
                            usuario.tipo === "Administrador"
                              ? "tipo--admin"
                              : "tipo--user"
                          }`}
                        >
                          {usuario.tipo}
                        </span>

                        <span className="denuncias-count">
                          {usuario.denuncias} denúncias
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
                        setNovaCategoria({
                          ...novaCategoria,
                          nome: e.target.value,
                        })
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
                        setNovaCategoria({
                          ...novaCategoria,
                          descricao: e.target.value,
                        })
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
                        <p className="list-item-meta">
                          {categoria.descricao}
                        </p>
                      </div>

                      <div className="admin-item-actions">
                        <button
                          className="btn-outline"
                          onClick={async () => {
  try {
    await fetch(`${API_CATEGORIAS}/${categoria.id}`, {
      method: "DELETE",
    });

    carregarCategorias();
  } catch (error) {
    console.error("Erro ao remover categoria:", error);
  }
}}
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
                  <iframe
                    title="Mapa de Irecê"
                    src="https://maps.google.com/maps?q=Irecê%20BA&t=&z=13&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="420"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                </div>

                <div className="map-info">
                  <article>
                    <h3>12</h3>
                    <p>Denúncias no centro</p>
                  </article>

                  <article>
                    <h3>8</h3>
                    <p>Denúncias em bairros</p>
                  </article>

                  <article>
                    <h3>6</h3>
                    <p>Pontos críticos</p>
                  </article>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {modalDetalhes && denunciaSelecionada && (
        <div
          className="admin-modal-overlay"
          onClick={() => setModalDetalhes(false)}
        >
          <div
            className="admin-modal details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="details-modal-header">
              <h2>Detalhes da denúncia</h2>
              <button
                className="admin-close"
                onClick={() => setModalDetalhes(false)}
              >
                ✕
              </button>
            </div>

            <div className="details-grid">
              {[
                ["Título", denunciaSelecionada.titulo],
                ["Autor", denunciaSelecionada.autor],
                ["Local", denunciaSelecionada.local],
                ["Categoria", denunciaSelecionada.categoria],
                ["Status", denunciaSelecionada.status],
                ["Prioridade", denunciaSelecionada.prioridade],
              ].map(([label, val]) => (
                <div key={label} className="detail-field">
                  <span className="detail-label">{label}</span>
                  <span className="detail-value">{val}</span>
                </div>
              ))}
            </div>

            <button className="save-btn" onClick={() => setModalDetalhes(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {modalAtualizar && denunciaSelecionada && (
        <div
          className="admin-modal-overlay"
          onClick={() => setModalAtualizar(false)}
        >
          <div
            className="admin-modal details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="details-modal-header">
              <h2>Atualizar denúncia</h2>
              <button
                className="admin-close"
                onClick={() => setModalAtualizar(false)}
              >
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
                  <option>Aberta</option>
                  <option>Em andamento</option>
                  <option>Resolvida</option>
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
                  <option>Baixa</option>
                  <option>Média</option>
                  <option>Alta</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setModalAtualizar(false)}
              >
                Cancelar
              </button>

              <button
                className="save-btn"
                onClick={() => {
                  setDenuncias(
                    denuncias.map((d) =>
                      d.titulo === denunciaSelecionada.titulo
                        ? denunciaSelecionada
                        : d
                    )
                  );

                  setModalAtualizar(false);
                }}
              >
                Salvar alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {modalNovoUsuario && (
        <div
          className="admin-modal-overlay"
          onClick={() => setModalNovoUsuario(false)}
        >
          <div
            className="admin-modal details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="details-modal-header">
              <h2>Novo usuário</h2>
              <button
                className="admin-close"
                onClick={() => setModalNovoUsuario(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={salvarNovoUsuario} className="new-user-form">
              {[
                { label: "Nome", key: "nome", type: "text" },
                { label: "E-mail", key: "email", type: "email" },
                { label: "Telefone", key: "telefone", type: "text" },
                { label: "Cidade", key: "cidade", type: "text" },
              ].map(({ label, key, type }) => (
                <div className="modal-form-group" key={key}>
                  <label>{label}</label>
                  <input
                    type={type}
                    required={key !== "telefone"}
                    value={novoUsuario[key]}
                    onChange={(e) =>
                      setNovoUsuario({
                        ...novoUsuario,
                        [key]: e.target.value,
                      })
                    }
                  />
                </div>
              ))}

              <div className="modal-form-group">
                <label>Tipo</label>
                <select
                  value={novoUsuario.tipo}
                  onChange={(e) =>
                    setNovoUsuario({
                      ...novoUsuario,
                      tipo: e.target.value,
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
        <div
          className="admin-modal-overlay"
          onClick={() => setModalPerfilUsuario(false)}
        >
          <div
            className="admin-modal details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="details-modal-header">
              <h2>Perfil do usuário</h2>
              <button
                className="admin-close"
                onClick={() => setModalPerfilUsuario(false)}
              >
                ✕
              </button>
            </div>

            <div className="perfil-usuario-topo">
              <div className="usuario-avatar large">
                {usuarioSelecionado.nome
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
                    usuarioSelecionado.tipo === "Administrador"
                      ? "tipo--admin"
                      : "tipo--user"
                  }`}
                >
                  {usuarioSelecionado.tipo}
                </span>
              </div>
            </div>

            <div className="details-grid">
              {[
                ["E-mail", usuarioSelecionado.email],
                ["Telefone", usuarioSelecionado.telefone],
                ["Cidade", usuarioSelecionado.cidade],
                ["Denúncias", usuarioSelecionado.denuncias],
              ].map(([label, val]) => (
                <div key={label} className="detail-field">
                  <span className="detail-label">{label}</span>
                  <span className="detail-value">{val}</span>
                </div>
              ))}
            </div>

            <button
              className="save-btn"
              onClick={() => setModalPerfilUsuario(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;