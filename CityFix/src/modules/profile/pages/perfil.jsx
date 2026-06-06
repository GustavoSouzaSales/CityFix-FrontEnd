import "../styles/perfil.css";
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../dashboard/components/NavBar";
import Notificacoes from "../../dashboard/components/Notificacao";

/* ── Toast customizado ── */
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

/* ── Olho SVG ── */
function EyeIcon({ visible }) {
  if (!visible) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

/* ── Força da senha ── */
function calcularForca(senha) {
  if (!senha) return { nivel: 0, label: "", cor: "" };
  let score = 0;
  if (senha.length >= 8)  score++;
  if (senha.length >= 12) score++;
  if (/[A-Z]/.test(senha)) score++;
  if (/[0-9]/.test(senha)) score++;
  if (/[^A-Za-z0-9]/.test(senha)) score++;

  if (score <= 1) return { nivel: 1, label: "Fraca",  cor: "forca--fraca"  };
  if (score <= 3) return { nivel: 2, label: "Média",  cor: "forca--media"  };
  return           { nivel: 3, label: "Forte",  cor: "forca--forte"  };
}

function BarraForca({ senha }) {
  const { nivel, label, cor } = calcularForca(senha);
  if (!senha) return null;
  return (
    <div className="barra-forca-wrap">
      <div className="barra-forca-tracks">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`barra-forca-track ${i <= nivel ? cor : ""}`}
          />
        ))}
      </div>
      <span className={`barra-forca-label ${cor}`}>{label}</span>
    </div>
  );
}

/* ── Helpers ── */
function mascararTelefone(valor) {
  const digits = valor.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatarStatus(status) {
  if (status === "ABERTA") return "Aberta";
  if (status === "EM_ANDAMENTO") return "Em andamento";
  if (status === "RESOLVIDA") return "Resolvida";
  return status;
}

function classeStatus(status) {
  if (status === "ABERTA") return "aberta";
  if (status === "EM_ANDAMENTO") return "andamento";
  if (status === "RESOLVIDA") return "resolvida";
  return "";
}

/* ══════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════ */
function Perfil() {
  const [modalAberto, setModalAberto] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [modalDenunciasAberto, setModalDenunciasAberto] = useState(false);
  const [minhasDenuncias, setMinhasDenuncias] = useState([]);
  const [abaDenuncia, setAbaDenuncia] = useState("Todas");

  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [verSenhaAtual, setVerSenhaAtual] = useState(false);
  const [verNovaSenha, setVerNovaSenha] = useState(false);
  const [verConfirmarSenha, setVerConfirmarSenha] = useState(false);

  /* Erro inline por campo */
  const [erroConfirmar, setErroConfirmar] = useState("");

  const [usuario, setUsuario] = useState({ nome: "", email: "", telefone: "", cidade: "" });
  const [formUsuario, setFormUsuario] = useState(usuario);

  useEffect(() => {
    async function carregarDados() {
      const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
      if (!usuarioLogado) return;
      setUsuario(usuarioLogado);
      setFormUsuario(usuarioLogado);
      try {
        const response = await fetch(`http://localhost:8080/denuncias/usuario/${usuarioLogado.id}`);
        const denuncias = await response.json();
        setMinhasDenuncias(denuncias);
      } catch (error) {
        console.error("Erro ao carregar denúncias:", error);
      }
    }
    carregarDados();
  }, []);

  function abrirModal() {
    setFormUsuario(usuario);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setMostrarSenha(false);
    setVerSenhaAtual(false);
    setVerNovaSenha(false);
    setVerConfirmarSenha(false);
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
    setErroConfirmar("");
  }

  function handleConfirmarSenha(val) {
    setConfirmarSenha(val);
    if (val && val !== novaSenha) {
      setErroConfirmar("As senhas não coincidem.");
    } else {
      setErroConfirmar("");
    }
  }

  function handleNovaSenha(val) {
    setNovaSenha(val);
    if (confirmarSenha && val !== confirmarSenha) {
      setErroConfirmar("As senhas não coincidem.");
    } else {
      setErroConfirmar("");
    }
  }

  async function salvarAlteracoes(e) {
    e.preventDefault();

    if (mostrarSenha) {
      if (novaSenha.length < 8) {
        addToast("A nova senha deve ter no mínimo 8 caracteres.", "error");
        return;
      }
      if (novaSenha !== confirmarSenha) {
        addToast("As senhas não coincidem. Verifique e tente novamente.", "error");
        return;
      }
    }

    try {
      const response = await fetch(`http://localhost:8080/usuarios/${usuario.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formUsuario),
      });

      if (!response.ok) {
        addToast("Não foi possível atualizar o perfil. Tente novamente.", "error");
        return;
      }

      const usuarioAtualizado = await response.json();

      if (mostrarSenha) {
        const responseSenha = await fetch(`http://localhost:8080/usuarios/${usuario.id}/senha`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ senhaAtual, novaSenha, confirmarSenha }),
        });

        if (!responseSenha.ok) {
          addToast("Senha atual incorreta ou dados inválidos. Verifique e tente novamente.", "error");
          return;
        }
      }

      setUsuario(usuarioAtualizado);
      setFormUsuario(usuarioAtualizado);
      localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));

      addToast("Perfil atualizado com sucesso!", "success");
      fecharModal();
    } catch (error) {
      addToast("Falha na conexão com o servidor. Verifique sua internet.", "error");
    }
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
      : minhasDenuncias.filter((d) => {
          if (abaDenuncia === "Aberta") return d.status === "ABERTA";
          if (abaDenuncia === "Em andamento") return d.status === "EM_ANDAMENTO";
          if (abaDenuncia === "Resolvida") return d.status === "RESOLVIDA";
          return true;
        });

  const totalDenuncias  = minhasDenuncias.length;
  const totalAbertas    = minhasDenuncias.filter((d) => d.status === "ABERTA").length;
  const totalAndamento  = minhasDenuncias.filter((d) => d.status === "EM_ANDAMENTO").length;
  const totalResolvidas = minhasDenuncias.filter((d) => d.status === "RESOLVIDA").length;

  const stats = [
    { emoji: "📋", valor: totalDenuncias,  label: "Denúncias feitas", cor: "stat--blue"   },
    { emoji: "🟡", valor: totalAndamento,  label: "Em andamento",     cor: "stat--yellow" },
    { emoji: "✅", valor: totalResolvidas, label: "Resolvidas",        cor: "stat--green"  },
    { emoji: "🔴", valor: totalAbertas,    label: "Abertas",           cor: "stat--red"    },
  ];

  const forcaSenha = calcularForca(novaSenha);
  const senhasIguais = novaSenha && confirmarSenha && novaSenha === confirmarSenha;

  return (
    <div className="perfil-page">
      <NavBar />
      <Toast toasts={toasts} removeToast={removeToast} />

      <main className="perfil-main">
        <header className="perfil-header">
          <div className="perfil-header-eyebrow">Painel do cidadão</div>
          <h1>Meu Perfil</h1>
          <p>Gerencie seus dados e acompanhe suas denúncias.</p>
        </header>

        <section className="perfil-layout">
          <aside className="perfil-user-card">
            <div className="perfil-avatar-wrap">
              <div className="perfil-avatar">{iniciais}</div>
              <div className="perfil-avatar-ring" />
            </div>

            <h2 className="perfil-nome">{usuario.nome}</h2>
            <p className="perfil-email">{usuario.email}</p>

            <div className={usuario.tipoUsuario === "ADMINISTRADOR" ? "perfil-badge perfil-badge-admin" : "perfil-badge"}>
              👤 {usuario.tipoUsuario === "ADMINISTRADOR" ? "Administrador" : "Usuário comum"}
            </div>

            <div className="perfil-divider" />

            <div className="perfil-info">
              <div className="perfil-info-item">
                <span className="info-icon">📍</span>
                <span>{usuario.cidade || "Cidade não informada"}</span>
              </div>
              <div className="perfil-info-item">
                <span className="info-icon">📞</span>
                <span>{usuario.telefone || "Telefone não informado"}</span>
              </div>
            </div>

            <div className="perfil-divider" />

            <button className="btn-editar" onClick={abrirModal}>
              ✏️ Editar perfil
            </button>
          </aside>

          <section className="perfil-content">
            <div className="perfil-stats">
              {stats.map((s) => (
                <article key={s.label} className={`stat-card ${s.cor}`}>
                  <span className="stat-emoji">{s.emoji}</span>
                  <h3 className="stat-num">{s.valor}</h3>
                  <p className="stat-label">{s.label}</p>
                </article>
              ))}
            </div>

            <section className="perfil-section">
              <div className="section-title">
                <div className="section-title-left">
                  <span className="section-icon">📋</span>
                  <h2>Minhas denúncias</h2>
                </div>
                <button className="btn-ver-todas" onClick={() => setModalDenunciasAberto(true)}>
                  Ver todas →
                </button>
              </div>

              <div className="denuncias-list">
                {minhasDenuncias.length > 0 ? (
                  minhasDenuncias.map((d) => (
                    <article className="denuncia-item" key={d.id}>
                      <div className="denuncia-left">
                        <h3>{d.titulo}</h3>
                        <p>{d.localizacao}</p>
                        <small>{new Date(d.dataCriacao).toLocaleDateString("pt-BR")}</small>
                        {d.imagens?.length > 0 && <small>📷 {d.imagens.length} imagem(ns)</small>}
                      </div>
                      <span className={`perfil-status ${classeStatus(d.status)}`}>
                        {formatarStatus(d.status)}
                      </span>
                    </article>
                  ))
                ) : (
                  <p>Nenhuma denúncia registrada ainda.</p>
                )}
              </div>
            </section>

            <section className="perfil-section">
              <div className="section-title">
                <div className="section-title-left">
                  <span className="section-icon">⚙️</span>
                  <h2>Configurações da conta</h2>
                </div>
              </div>

              <div className="config-list">
                <button className="config-btn" onClick={() => { abrirModal(); setMostrarSenha(true); }}>
                  <span className="config-btn-icon">🔐</span>
                  <div className="config-btn-text">
                    <strong>Alterar senha</strong>
                    <small>Atualize sua senha de acesso</small>
                  </div>
                  <span className="config-btn-arrow">›</span>
                </button>

                <div className="config-btn-notif-wrap">
                  <button
                    className="config-btn"
                    onClick={() => {
                      const bell = document.querySelector(".perfil-notif-anchor .notif-bell");
                      if (bell) bell.click();
                    }}
                  >
                    <span className="config-btn-icon">🔔</span>
                    <div className="config-btn-text">
                      <strong>Notificações</strong>
                      <small>Veja suas notificações de denúncias</small>
                    </div>
                    <span className="config-btn-arrow">›</span>
                  </button>
                  {/* Sino âncora — botão invisível mas dentro da mesma área para o clickOutside funcionar */}
                  <div className="perfil-notif-anchor">
                    <Notificacoes />
                  </div>
                </div>

                <button
                  className="config-btn config-btn--danger"
                  onClick={() => {
                    localStorage.removeItem("usuario");
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

      {/* ══ MODAL EDITAR PERFIL ══ */}
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
                <div className="modal-form-group">
                  <label>Nome</label>
                  <input
                    type="text"
                    value={formUsuario.nome}
                    onChange={(e) => setFormUsuario({ ...formUsuario, nome: e.target.value })}
                  />
                </div>
                <div className="modal-form-group">
                  <label>E-mail</label>
                  <input
                    type="email"
                    value={formUsuario.email}
                    onChange={(e) => setFormUsuario({ ...formUsuario, email: e.target.value })}
                  />
                </div>
                <div className="modal-form-group">
                  <label>Telefone</label>
                  <input
                    type="text"
                    value={formUsuario.telefone || ""}
                    placeholder="(XX) XXXXX-XXXX"
                    maxLength={15}
                    onChange={(e) =>
                      setFormUsuario({ ...formUsuario, telefone: mascararTelefone(e.target.value) })
                    }
                  />
                </div>
                <div className="modal-form-group">
                  <label>Cidade onde mora</label>
                  <input
                    type="text"
                    value={formUsuario.cidade || ""}
                    onChange={(e) => setFormUsuario({ ...formUsuario, cidade: e.target.value })}
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
                    🔐 {mostrarSenha ? "Ocultar campos de senha" : "Mudar senha"}
                  </button>
                  <Link to="/esqueci-senha" className="forgot-password-modal">
                    Esqueceu sua senha?
                  </Link>
                </div>

                {mostrarSenha && (
                  <div className="modal-grid password-fields">

                    {/* Senha atual */}
                    <div className="modal-form-group">
                      <label>Senha atual</label>
                      <div className="input-senha-wrap">
                        <input
                          type={verSenhaAtual ? "text" : "password"}
                          placeholder="Digite sua senha atual"
                          value={senhaAtual}
                          onChange={(e) => setSenhaAtual(e.target.value)}
                        />
                        <button
                          type="button"
                          className="olho-btn"
                          onClick={() => setVerSenhaAtual(!verSenhaAtual)}
                          aria-label={verSenhaAtual ? "Ocultar senha" : "Mostrar senha"}
                        >
                          <EyeIcon visible={verSenhaAtual} />
                        </button>
                      </div>
                    </div>

                    {/* Nova senha + barra de força */}
                    <div className="modal-form-group">
                      <label>Nova senha</label>
                      <div className="input-senha-wrap">
                        <input
                          type={verNovaSenha ? "text" : "password"}
                          placeholder="Mínimo de 8 caracteres"
                          value={novaSenha}
                          onChange={(e) => handleNovaSenha(e.target.value)}
                        />
                        <button
                          type="button"
                          className="olho-btn"
                          onClick={() => setVerNovaSenha(!verNovaSenha)}
                          aria-label={verNovaSenha ? "Ocultar senha" : "Mostrar senha"}
                        >
                          <EyeIcon visible={verNovaSenha} />
                        </button>
                      </div>
                      <BarraForca senha={novaSenha} />
                      {novaSenha && novaSenha.length < 8 && (
                        <span className="campo-erro">Mínimo de 8 caracteres</span>
                      )}
                    </div>

                    {/* Confirmar senha */}
                    <div className="modal-form-group">
                      <label>Confirmar senha</label>
                      <div className={`input-senha-wrap ${erroConfirmar ? "input-senha-wrap--erro" : ""} ${senhasIguais ? "input-senha-wrap--ok" : ""}`}>
                        <input
                          type={verConfirmarSenha ? "text" : "password"}
                          placeholder="Confirme nova senha"
                          value={confirmarSenha}
                          onChange={(e) => handleConfirmarSenha(e.target.value)}
                        />
                        <button
                          type="button"
                          className="olho-btn"
                          onClick={() => setVerConfirmarSenha(!verConfirmarSenha)}
                          aria-label={verConfirmarSenha ? "Ocultar senha" : "Mostrar senha"}
                        >
                          <EyeIcon visible={verConfirmarSenha} />
                        </button>
                        {senhasIguais && (
                          <span className="campo-ok-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </span>
                        )}
                      </div>
                      {erroConfirmar && (
                        <span className="campo-erro">{erroConfirmar}</span>
                      )}
                      {senhasIguais && (
                        <span className="campo-ok">Senhas coincidem ✓</span>
                      )}
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

      {/* ══ MODAL DENÚNCIAS ══ */}
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
                <article className="denuncia-item" key={d.id}>
                  <div className="denuncia-left">
                    <h3>{d.titulo}</h3>
                    <p>{d.localizacao}</p>
                    <small>{new Date(d.dataCriacao).toLocaleDateString("pt-BR")}</small>
                    {d.imagens?.length > 0 && (
                      <div className="perfil-imagens">
                        {d.imagens.map((img) => (
                          <img key={img.id} src={img.imagemUrl} alt={d.titulo} className="perfil-imagem" />
                        ))}
                      </div>
                    )}
                  </div>
                  <span className={`perfil-status ${classeStatus(d.status)}`}>
                    {formatarStatus(d.status)}
                  </span>
                </article>
              ))}
              {denunciasFiltradas.length === 0 && (
                <p>Nenhuma denúncia encontrada nessa aba.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;