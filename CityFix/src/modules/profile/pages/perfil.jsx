import "../styles/perfil.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../dashboard/components/NavBar";

const minhasDenuncias = [
  {
    titulo: "Buraco na via",
    local: "Rua das Flores, Centro",
    data: "Hoje, 10:23",
    status: "Aberta",
    tipo: "aberta",
  },
  {
    titulo: "Poste com luz apagada",
    local: "Av. Brasil, Jardim América",
    data: "Ontem, 20:15",
    status: "Em andamento",
    tipo: "andamento",
  },
  {
    titulo: "Lixo acumulado",
    local: "Rua das Palmeiras, Centro",
    data: "2 dias atrás",
    status: "Resolvida",
    tipo: "resolvida",
  },
];

function Perfil() {
  const [modalAberto, setModalAberto] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [modalDenunciasAberto, setModalDenunciasAberto] = useState(false);
const [abaDenuncia, setAbaDenuncia] = useState("Todas");
const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nome: "João Silva",
    email: "joao@email.com",
    telefone: "(74) 99999-9999",
    cidade: "Irecê - BA",
  });

  const [formUsuario, setFormUsuario] = useState(usuario);

  function abrirModal() {
    setFormUsuario(usuario);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setMostrarSenha(false);
  }

  function salvarAlteracoes(e) {
    e.preventDefault();

    setUsuario(formUsuario);
    fecharModal();
  }

  const iniciais = usuario.nome
    .split(" ")
    .map((nome) => nome[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

    const denunciasFiltradas =
  abaDenuncia === "Todas"
    ? minhasDenuncias
    : minhasDenuncias.filter(
        (denuncia) => denuncia.status === abaDenuncia
      );

      const totalDenuncias = minhasDenuncias.length;

const totalAbertas = minhasDenuncias.filter(
  (denuncia) => denuncia.status === "Aberta"
).length;

const totalAndamento = minhasDenuncias.filter(
  (denuncia) => denuncia.status === "Em andamento"
).length;

const totalResolvidas = minhasDenuncias.filter(
  (denuncia) => denuncia.status === "Resolvida"
).length;

  return (
    <div className="perfil-page">
      <NavBar />

      <main className="perfil-main">
        <header className="perfil-header">
          <div>
            <h1>Meu Perfil</h1>
            <p>Gerencie seus dados e acompanhe suas denúncias.</p>
          </div>
        </header>

        <section className="perfil-layout">
          <aside className="perfil-user-card">
            <div className="perfil-avatar">{iniciais}</div>

            <h2>{usuario.nome}</h2>
            <p>{usuario.email}</p>

            <div className="perfil-info">
              <span>📍 {usuario.cidade}</span>
              <span>📞 {usuario.telefone}</span>
              <span>👤 Usuário comum</span>
            </div>

            <button onClick={abrirModal}>Editar perfil</button>
          </aside>

          <section className="perfil-content">
            <div className="perfil-stats">
              <article>
                <span>📋</span>
                <h3>{totalDenuncias}</h3>
                <p>Denúncias feitas</p>
              </article>

              <article>
                <span>🟡</span>
                <h3>{totalAndamento}</h3>
                <p>Em andamento</p>
              </article>

              <article>
                <span>✅</span>
                <h3>{totalResolvidas}</h3>
                <p>Resolvidas</p>
              </article>

              <article>
                <span>🔴</span>
                <h3>{totalAbertas}</h3>
                <p>Abertas</p>
              </article>
            </div>

            <section className="perfil-section">
              <div className="section-title">
                <h2>Minhas denúncias</h2>
                <button onClick={() => setModalDenunciasAberto(true)}>
  Ver todas
</button>
              </div>

              <div className="denuncias-list">
                {minhasDenuncias.map((denuncia) => (
                  <article className="denuncia-item" key={denuncia.titulo}>
                    <div>
                      <h3>{denuncia.titulo}</h3>
                      <p>{denuncia.local}</p>
                      <small>{denuncia.data}</small>
                    </div>

                    <span className={`perfil-status ${denuncia.tipo}`}>
                      {denuncia.status}
                    </span>
                  </article>
                ))}
              </div>
            </section>

            <section className="perfil-section">
              <div className="section-title">
                <h2>Configurações da conta</h2>
              </div>

              <div className="config-list">
                <button
                  onClick={() => {
                    abrirModal();
                    setMostrarSenha(true);
                  }}
                >
                  🔐 Alterar senha
                </button>
                <button>🔔 Notificações</button>
                <button
  className="danger"
  onClick={() => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/login");
  }}
>
  🚪 Sair da conta
</button>
              </div>
            </section>
          </section>
        </section>
      </main>

      {modalAberto && (
        <div className="perfil-modal-overlay">
          <div className="perfil-modal">
            <div className="perfil-modal-header">
              <div>
                <h2>Editar perfil</h2>
                <p>Atualize suas informações pessoais.</p>
              </div>

              <button className="modal-close" onClick={fecharModal}>
                ✕
              </button>
            </div>

            <form className="perfil-modal-form" onSubmit={salvarAlteracoes}>
              <div className="modal-grid">
                <div className="modal-form-group">
                  <label>Nome</label>
                  <input
                    type="text"
                    value={formUsuario.nome}
                    onChange={(e) =>
                      setFormUsuario({
                        ...formUsuario,
                        nome: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="modal-form-group">
                  <label>E-mail</label>
                  <input
                    type="email"
                    value={formUsuario.email}
                    onChange={(e) =>
                      setFormUsuario({
                        ...formUsuario,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="modal-form-group">
                  <label>Telefone</label>
                  <input
                    type="text"
                    value={formUsuario.telefone}
                    onChange={(e) =>
                      setFormUsuario({
                        ...formUsuario,
                        telefone: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="modal-form-group">
                  <label>Cidade onde mora</label>
                  <input
                    type="text"
                    value={formUsuario.cidade}
                    onChange={(e) =>
                      setFormUsuario({
                        ...formUsuario,
                        cidade: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="password-area">
                <div className="password-area-top">
                  <button
                    type="button"
                    className="change-password-btn"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                  >
                    🔐 Mudar senha
                  </button>

                  <Link to="/esqueci-senha" className="forgot-password-modal">
                    Esqueceu sua senha?
                  </Link>
                </div>

                {mostrarSenha && (
                  <div className="modal-grid password-fields">
                    <div className="modal-form-group">
                      <label>Senha atual</label>
                      <input
                        type="password"
                        placeholder="Digite sua senha atual"
                      />
                    </div>

                    <div className="modal-form-group">
                      <label>Nova senha</label>
                      <input
                        type="password"
                        placeholder="Mínimo de 8 caracteres"
                      />
                    </div>

                    <div className="modal-form-group">
                      <label>Confirmar senha</label>
                      <input
                        type="password"
                        placeholder="Confirme sua nova senha"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={fecharModal}>
                  Cancelar
                </button>

                <button type="submit" className="save-btn">
                  Salvar alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalDenunciasAberto && (
  <div className="perfil-modal-overlay">
    <div className="perfil-modal denuncias-modal">
      <div className="perfil-modal-header">
        <div>
          <h2>Minhas denúncias</h2>
          <p>Acompanhe todas as denúncias registradas por você.</p>
        </div>

        <button
          className="modal-close"
          onClick={() => setModalDenunciasAberto(false)}
        >
          ✕
        </button>
      </div>

      <div className="denuncias-tabs">
        {["Todas", "Aberta", "Em andamento", "Resolvida"].map((aba) => (
          <button
            key={aba}
            className={abaDenuncia === aba ? "active" : ""}
            onClick={() => setAbaDenuncia(aba)}
          >
            {aba}
          </button>
        ))}
      </div>

      <div className="denuncias-modal-list">
        {denunciasFiltradas.map((denuncia) => (
          <article className="denuncia-item" key={denuncia.titulo}>
            <div>
              <h3>{denuncia.titulo}</h3>
              <p>{denuncia.local}</p>
              <small>{denuncia.data}</small>
            </div>

            <span className={`perfil-status ${denuncia.tipo}`}>
              {denuncia.status}
            </span>
          </article>
        ))}
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default Perfil;