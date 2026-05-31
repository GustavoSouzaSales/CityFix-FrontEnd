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
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const denunciasFiltradas =
    abaDenuncia === "Todas"
      ? minhasDenuncias
      : minhasDenuncias.filter((d) => d.status === abaDenuncia);

  const totalDenuncias  = minhasDenuncias.length;
  const totalAbertas    = minhasDenuncias.filter((d) => d.status === "Aberta").length;
  const totalAndamento  = minhasDenuncias.filter((d) => d.status === "Em andamento").length;
  const totalResolvidas = minhasDenuncias.filter((d) => d.status === "Resolvida").length;

  const stats = [
    { emoji: "📋", valor: totalDenuncias,  label: "Denúncias feitas", cor: "stat--blue"   },
    { emoji: "🟡", valor: totalAndamento,  label: "Em andamento",     cor: "stat--yellow" },
    { emoji: "✅", valor: totalResolvidas, label: "Resolvidas",        cor: "stat--green"  },
    { emoji: "🔴", valor: totalAbertas,    label: "Abertas",           cor: "stat--red"    },
  ];

  return (
    <div className="perfil-page">
      <NavBar />

      <main className="perfil-main">

        {/* ── HEADER ── */}
        <header className="perfil-header">
          <div className="perfil-header-eyebrow">Painel do cidadão</div>
          <h1>Meu Perfil</h1>
          <p>Gerencie seus dados e acompanhe suas denúncias.</p>
        </header>

        <section className="perfil-layout">

          {/* ── CARD LATERAL DO USUÁRIO ── */}
          <aside className="perfil-user-card">

            {/* Avatar */}
            <div className="perfil-avatar-wrap">
              <div className="perfil-avatar">{iniciais}</div>
              <div className="perfil-avatar-ring" />
            </div>

            <h2 className="perfil-nome">{usuario.nome}</h2>
            <p className="perfil-email">{usuario.email}</p>

            <div className="perfil-badge">👤 Usuário comum</div>

            <div className="perfil-divider" />

            <div className="perfil-info">
              <div className="perfil-info-item">
                <span className="info-icon">📍</span>
                <span>{usuario.cidade}</span>
              </div>
              <div className="perfil-info-item">
                <span className="info-icon">📞</span>
                <span>{usuario.telefone}</span>
              </div>
            </div>

            <div className="perfil-divider" />

            <button className="btn-editar" onClick={abrirModal}>
              ✏️ Editar perfil
            </button>
          </aside>

          {/* ── COLUNA DIREITA ── */}
          <section className="perfil-content">

            {/* Stats */}
            <div className="perfil-stats">
              {stats.map((s) => (
                <article key={s.label} className={`stat-card ${s.cor}`}>
                  <span className="stat-emoji">{s.emoji}</span>
                  <h3 className="stat-num">{s.valor}</h3>
                  <p className="stat-label">{s.label}</p>
                </article>
              ))}
            </div>

            {/* Denúncias */}
            <section className="perfil-section">
              <div className="section-title">
                <div className="section-title-left">
                  <span className="section-icon">📋</span>
                  <h2>Minhas denúncias</h2>
                </div>
                <button
                  className="btn-ver-todas"
                  onClick={() => setModalDenunciasAberto(true)}
                >
                  Ver todas →
                </button>
              </div>

              <div className="denuncias-list">
                {minhasDenuncias.map((d) => (
                  <article className="denuncia-item" key={d.titulo}>
                    <div className="denuncia-left">
                      <h3>{d.titulo}</h3>
                      <p>{d.local}</p>
                      <small>{d.data}</small>
                    </div>
                    <span className={`perfil-status ${d.tipo}`}>{d.status}</span>
                  </article>
                ))}
              </div>
            </section>

            {/* Configurações */}
            <section className="perfil-section">
              <div className="section-title">
                <div className="section-title-left">
                  <span className="section-icon">⚙️</span>
                  <h2>Configurações da conta</h2>
                </div>
              </div>

              <div className="config-list">
                <button
                  className="config-btn"
                  onClick={() => { abrirModal(); setMostrarSenha(true); }}
                >
                  <span className="config-btn-icon">🔐</span>
                  <div className="config-btn-text">
                    <strong>Alterar senha</strong>
                    <small>Atualize sua senha de acesso</small>
                  </div>
                  <span className="config-btn-arrow">›</span>
                </button>

                <button className="config-btn">
                  <span className="config-btn-icon">🔔</span>
                  <div className="config-btn-text">
                    <strong>Notificações</strong>
                    <small>Gerencie seus alertas</small>
                  </div>
                  <span className="config-btn-arrow">›</span>
                </button>

                <button
                  className="config-btn config-btn--danger"
                  onClick={() => {
                    localStorage.removeItem("token");
                    sessionStorage.clear();
                    navigate("/login");
                  }}
                >
                  <span className="config-btn-icon">🚪</span>
                  <div className="config-btn-text">
                    <strong>Sair da conta</strong>
                    <small>Encerrar sessão atual</small>
                  </div>
                  <span className="config-btn-arrow">›</span>
                </button>
              </div>
            </section>

          </section>
        </section>
      </main>

      {/* ── MODAL EDITAR PERFIL ── */}
      {modalAberto && (
        <div className="perfil-modal-overlay" onClick={fecharModal}>
          <div className="perfil-modal" onClick={(e) => e.stopPropagation()}>
            <div className="perfil-modal-header">
              <div>
                <h2>Editar perfil</h2>
                <p>Atualize suas informações pessoais.</p>
              </div>
              <button className="modal-close" onClick={fecharModal}>✕</button>
            </div>

            <form className="perfil-modal-form" onSubmit={salvarAlteracoes}>
              <div className="modal-grid">
                {[
                  { label: "Nome",              key: "nome",     type: "text"  },
                  { label: "E-mail",            key: "email",    type: "email" },
                  { label: "Telefone",          key: "telefone", type: "text"  },
                  { label: "Cidade onde mora",  key: "cidade",   type: "text"  },
                ].map(({ label, key, type }) => (
                  <div className="modal-form-group" key={key}>
                    <label>{label}</label>
                    <input
                      type={type}
                      value={formUsuario[key]}
                      onChange={(e) =>
                        setFormUsuario({ ...formUsuario, [key]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="password-area">
                <div className="password-area-top">
                  <button
                    type="button"
                    className="change-password-btn"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                  >
                    🔐 {mostrarSenha ? "Ocultar campos de senha" : "Mudar senha"}
                  </button>
                  <Link to="/esqueci-senha" className="forgot-password-modal">
                    Esqueceu sua senha?
                  </Link>
                </div>

                {mostrarSenha && (
                  <div className="modal-grid password-fields">
                    {[
                      { label: "Senha atual",      ph: "Digite sua senha atual"   },
                      { label: "Nova senha",        ph: "Mínimo de 8 caracteres"  },
                      { label: "Confirmar senha",   ph: "Confirme sua nova senha" },
                    ].map(({ label, ph }) => (
                      <div className="modal-form-group" key={label}>
                        <label>{label}</label>
                        <input type="password" placeholder={ph} />
                      </div>
                    ))}
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

      {/* ── MODAL VER TODAS AS DENÚNCIAS ── */}
      {modalDenunciasAberto && (
        <div className="perfil-modal-overlay" onClick={() => setModalDenunciasAberto(false)}>
          <div className="perfil-modal denuncias-modal" onClick={(e) => e.stopPropagation()}>
            <div className="perfil-modal-header">
              <div>
                <h2>Minhas denúncias</h2>
                <p>Acompanhe todas as denúncias registradas por você.</p>
              </div>
              <button className="modal-close" onClick={() => setModalDenunciasAberto(false)}>✕</button>
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
              {denunciasFiltradas.map((d) => (
                <article className="denuncia-item" key={d.titulo}>
                  <div className="denuncia-left">
                    <h3>{d.titulo}</h3>
                    <p>{d.local}</p>
                    <small>{d.data}</small>
                  </div>
                  <span className={`perfil-status ${d.tipo}`}>{d.status}</span>
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