import { useEffect, useState, useRef } from "react";
import "./Notificacao.css";

function Notificacoes() {
  const [aberto, setAberto] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [naoLidas, setNaoLidas] = useState(0);
  const dropdownRef = useRef(null);

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  async function carregarNotificacoes() {
    if (!usuario?.id) return;
    try {
      const response = await fetch(
        `http://localhost:8080/notificacoes/usuario/${usuario.id}`
      );
      const data = await response.json();
      setNotificacoes(data);
      setNaoLidas(data.filter((n) => !n.lida).length);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    }
  }

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  /* Fechar ao clicar fora */
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAberto(false);
      }
    }
    if (aberto) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [aberto]);

  async function marcarComoLida(id) {
    try {
      await fetch(`http://localhost:8080/notificacoes/${id}/lida`, {
        method: "PUT",
      });
      const novas = notificacoes.map((n) =>
        n.id === id ? { ...n, lida: true } : n
      );
      setNotificacoes(novas);
      const novasNaoLidas = novas.filter((n) => !n.lida).length;
      setNaoLidas(novasNaoLidas);
      if (novasNaoLidas === 0) setAberto(false);
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  }

  async function marcarTodasComoLidas() {
    try {
      await fetch(
        `http://localhost:8080/notificacoes/usuario/${usuario.id}/lidas`,
        { method: "PUT" }
      );
      setNotificacoes(notificacoes.map((n) => ({ ...n, lida: true })));
      setNaoLidas(0);
      setAberto(false);
    } catch (error) {
      console.error(error);
    }
  }

  function formatarData(data) {
    if (!data) return "";
    return new Date(data).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  /* Ícone por tipo/conteúdo do título */
  function iconeNotificacao(notif) {
    const t = (notif.titulo || "").toLowerCase();
    if (t.includes("resolv")) return "✅";
    if (t.includes("andamento")) return "⚙️";
    if (t.includes("nova") || t.includes("registr")) return "📌";
    return "🔔";
  }

  return (
    <div className="notif-root" ref={dropdownRef}>
      {/* ── Botão sino ── */}
      <button
        type="button"
        className={`notif-bell ${aberto ? "notif-bell--active" : ""}`}
        onClick={() => {
          setAberto((prev) => !prev);
          carregarNotificacoes();
        }}
        aria-label="Notificações"
      >
        <span className="notif-bell-icon">🔔</span>
        {naoLidas > 0 && (
          <span className="notif-badge">
            {naoLidas > 9 ? "9+" : naoLidas}
          </span>
        )}
        {naoLidas > 0 && <span className="notif-pulse" />}
      </button>

      {/* ── Dropdown ── */}
      {aberto && (
        <div className="notif-dropdown">
          {/* Cabeçalho */}
          <div className="notif-header">
            <div className="notif-header-left">
              <span className="notif-header-icon">🔔</span>
              <div>
                <h3 className="notif-title">Notificações</h3>
                <span className="notif-subtitle">
                  {naoLidas > 0
                    ? `${naoLidas} não lida${naoLidas > 1 ? "s" : ""}`
                    : "Tudo em dia"}
                </span>
              </div>
            </div>

            {naoLidas > 0 && (
              <button
                type="button"
                className="notif-mark-all"
                onClick={marcarTodasComoLidas}
              >
                Marcar todas
              </button>
            )}
          </div>

          {/* Separador degradê */}
          <div className="notif-sep" />

          {/* Lista */}
          <div className="notif-list">
            {notificacoes.length > 0 ? (
              notificacoes.map((n, i) => (
                <div
                  key={n.id}
                  className={`notif-item ${!n.lida ? "notif-item--unread" : ""}`}
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <div className="notif-item-icon">{iconeNotificacao(n)}</div>

                  <div className="notif-item-body">
                    <strong className="notif-item-title">{n.titulo}</strong>
                    <p className="notif-item-msg">{n.mensagem}</p>
                    <small className="notif-item-time">
                      🕐 {formatarData(n.dataCriacao)}
                    </small>
                  </div>

                  {!n.lida && (
                    <div className="notif-item-actions">
                      <span className="notif-dot" />
                      <button
                        type="button"
                        className="notif-read-btn"
                        onClick={() => marcarComoLida(n.id)}
                        title="Marcar como lida"
                      >
                        ✓
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="notif-empty">
                <span className="notif-empty-icon">🌿</span>
                <p>Nenhuma notificação por enquanto.</p>
                <small>Você será avisado sobre suas denúncias aqui.</small>
              </div>
            )}
          </div>

          {/* Rodapé */}
          {notificacoes.length > 0 && (
            <div className="notif-footer">
              <span>{notificacoes.length} notificação{notificacoes.length > 1 ? "s" : ""} no total</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notificacoes;