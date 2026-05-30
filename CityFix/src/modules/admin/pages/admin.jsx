import "../styles/admin.css";
import { useState } from "react";
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

  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    email: "",
    telefone: "",
    cidade: "",
    tipo: "Usuário",
  });

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

  function salvarNovoUsuario(e) {
    e.preventDefault();

    const usuarioCriado = {
      ...novoUsuario,
      denuncias: 0,
    };

    setUsuarios([...usuarios, usuarioCriado]);

    setNovoUsuario({
      nome: "",
      email: "",
      telefone: "",
      cidade: "",
      tipo: "Usuário",
    });

    setModalNovoUsuario(false);
  }

  return (
    <div className="admin-page">
      <NavBar />

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Painel Administrativo</h1>
            <p>Gerencie denúncias, usuários e acompanhe o mapa da cidade.</p>
          </div>
        </header>

        <section className="admin-stats">
          <article>
            <span>📋</span>
            <div>
              <p>Denúncias abertas</p>
              <h3>{denuncias.filter((d) => d.status === "Aberta").length}</h3>
            </div>
          </article>

          <article>
            <span>⏳</span>
            <div>
              <p>Em andamento</p>
              <h3>{denuncias.filter((d) => d.status === "Em andamento").length}</h3>
            </div>
          </article>

          <article>
            <span>✅</span>
            <div>
              <p>Resolvidas</p>
              <h3>{denuncias.filter((d) => d.status === "Resolvida").length}</h3>
            </div>
          </article>

          <article>
            <span>👥</span>
            <div>
              <p>Usuários</p>
              <h3>{usuarios.length}</h3>
            </div>
          </article>
        </section>

        <section className="admin-grid">
          <article className="admin-card">
            <div className="admin-card-icon">📋</div>
            <h2>Gerenciar denúncias</h2>
            <p>Visualize, filtre e atualize as denúncias registradas.</p>
            <button onClick={() => setModalAberto("denuncias")}>Abrir</button>
          </article>

          <article className="admin-card">
            <div className="admin-card-icon">👥</div>
            <h2>Gerenciar usuários</h2>
            <p>Consulte usuários cadastrados e suas atividades.</p>
            <button onClick={() => setModalAberto("usuarios")}>Abrir</button>
          </article>

          <article className="admin-card">
            <div className="admin-card-icon">🗺️</div>
            <h2>Mapa da cidade</h2>
            <p>Acompanhe pontos de denúncias espalhados pela cidade.</p>
            <button onClick={() => setModalAberto("mapa")}>Abrir</button>
          </article>
        </section>

        <section className="admin-overview">
          <div>
            <h2>Resumo do painel</h2>
            <p>
              Use esta área para acompanhar rapidamente o estado geral da
              plataforma e acessar as principais funções administrativas.
            </p>
          </div>

          <div className="admin-actions">
            <button onClick={() => setModalAberto("denuncias")}>
              Ver denúncias
            </button>
            <button onClick={() => setModalAberto("usuarios")}>
              Ver usuários
            </button>
            <button onClick={() => setModalAberto("mapa")}>Ver mapa</button>
          </div>
        </section>
      </main>

      {modalAberto && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <div>
                <h2>
                  {modalAberto === "denuncias" && "Gerenciar denúncias"}
                  {modalAberto === "usuarios" && "Gerenciar usuários"}
                  {modalAberto === "mapa" && "Mapa da cidade"}
                </h2>
                <p>
                  {modalAberto === "denuncias" &&
                    "Acompanhe e atualize as denúncias da plataforma."}
                  {modalAberto === "usuarios" &&
                    "Consulte os usuários cadastrados no sistema."}
                  {modalAberto === "mapa" &&
                    "Visualize a distribuição das denúncias na cidade."}
                </p>
              </div>

              <button
                className="admin-close"
                onClick={() => setModalAberto(null)}
              >
                ✕
              </button>
            </div>

            {modalAberto === "denuncias" && (
              <div className="admin-modal-content">
                <div className="admin-filter-row">
                  <input
                    placeholder="Buscar denúncia..."
                    value={buscaDenuncia}
                    onChange={(e) => setBuscaDenuncia(e.target.value)}
                  />

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
                    <option>Buraco</option>
                    <option>Iluminação</option>
                    <option>Lixo</option>
                    <option>Água/Esgoto</option>
                    <option>Calçadas</option>
                    <option>Trânsito</option>
                    <option>Outros</option>
                  </select>
                </div>

                <div className="admin-list">
                  {denunciasFiltradas.map((denuncia) => (
                    <article className="admin-list-item" key={denuncia.titulo}>
                      <div>
                        <h3>{denuncia.titulo}</h3>
                        <p>{denuncia.local}</p>
                        <small>
                          {denuncia.autor} • {denuncia.categoria}
                        </small>
                      </div>

                      <div className="admin-item-actions">
                        <span>{denuncia.status}</span>

                        <button
                          onClick={() => {
                            setDenunciaSelecionada(denuncia);
                            setModalDetalhes(true);
                          }}
                        >
                          Detalhes
                        </button>

                        <button
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
                    <p className="empty-message">
                      Nenhuma denúncia encontrada.
                    </p>
                  )}
                </div>
              </div>
            )}

            {modalAberto === "usuarios" && (
              <div className="admin-modal-content">
                <div className="admin-filter-row">
                  <input
                    placeholder="Buscar usuário..."
                    value={buscaUsuario}
                    onChange={(e) => setBuscaUsuario(e.target.value)}
                  />

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
                      <div>
                        <h3>{usuario.nome}</h3>
                        <p>{usuario.email}</p>
                        <small>
                          {usuario.tipo} • {usuario.cidade}
                        </small>
                      </div>

                      <div className="admin-item-actions">
                        <span>{usuario.denuncias} denúncias</span>
                        <button
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
                    <p className="empty-message">Nenhum usuário encontrado.</p>
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
    height="450"
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
        <div className="admin-modal-overlay">
          <div className="admin-modal details-modal">
            <h2>Detalhes da denúncia</h2>

            <p>
              <strong>Título:</strong> {denunciaSelecionada.titulo}
            </p>
            <p>
              <strong>Autor:</strong> {denunciaSelecionada.autor}
            </p>
            <p>
              <strong>Local:</strong> {denunciaSelecionada.local}
            </p>
            <p>
              <strong>Categoria:</strong> {denunciaSelecionada.categoria}
            </p>
            <p>
              <strong>Status:</strong> {denunciaSelecionada.status}
            </p>
            <p>
              <strong>Prioridade:</strong> {denunciaSelecionada.prioridade}
            </p>

            <button
              onClick={() => setModalDetalhes(false)}
              className="save-btn"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {modalAtualizar && denunciaSelecionada && (
        <div className="admin-modal-overlay">
          <div className="admin-modal details-modal">
            <h2>Atualizar denúncia</h2>

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
              Salvar
            </button>
          </div>
        </div>
      )}

      {modalNovoUsuario && (
        <div className="admin-modal-overlay">
          <div className="admin-modal details-modal">
            <h2>Novo usuário</h2>

            <form onSubmit={salvarNovoUsuario} className="new-user-form">
              <label>Nome</label>
              <input
                type="text"
                required
                value={novoUsuario.nome}
                onChange={(e) =>
                  setNovoUsuario({ ...novoUsuario, nome: e.target.value })
                }
              />

              <label>E-mail</label>
              <input
                type="email"
                required
                value={novoUsuario.email}
                onChange={(e) =>
                  setNovoUsuario({ ...novoUsuario, email: e.target.value })
                }
              />

              <label>Telefone</label>
              <input
                type="text"
                value={novoUsuario.telefone}
                onChange={(e) =>
                  setNovoUsuario({ ...novoUsuario, telefone: e.target.value })
                }
              />

              <label>Cidade</label>
              <input
                type="text"
                value={novoUsuario.cidade}
                onChange={(e) =>
                  setNovoUsuario({ ...novoUsuario, cidade: e.target.value })
                }
              />

              <label>Tipo</label>
              <select
                value={novoUsuario.tipo}
                onChange={(e) =>
                  setNovoUsuario({ ...novoUsuario, tipo: e.target.value })
                }
              >
                <option>Usuário</option>
                <option>Administrador</option>
              </select>

              <button type="submit" className="save-btn">
                Salvar usuário
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={() => setModalNovoUsuario(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {modalPerfilUsuario && usuarioSelecionado && (
        <div className="admin-modal-overlay">
          <div className="admin-modal details-modal">
            <h2>Perfil do usuário</h2>

            <p>
              <strong>Nome:</strong> {usuarioSelecionado.nome}
            </p>
            <p>
              <strong>E-mail:</strong> {usuarioSelecionado.email}
            </p>
            <p>
              <strong>Telefone:</strong> {usuarioSelecionado.telefone}
            </p>
            <p>
              <strong>Cidade:</strong> {usuarioSelecionado.cidade}
            </p>
            <p>
              <strong>Tipo:</strong> {usuarioSelecionado.tipo}
            </p>
            <p>
              <strong>Denúncias:</strong> {usuarioSelecionado.denuncias}
            </p>

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