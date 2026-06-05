import { useEffect, useState } from "react";
import "./Notificacao.css";

function Notificacoes() {
  const [aberto, setAberto] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [naoLidas, setNaoLidas] = useState(0);

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

  async function marcarComoLida(id) {
  try {
    await fetch(`http://localhost:8080/notificacoes/${id}/lida`, {
      method: "PUT",
    });

    const novasNotificacoes = notificacoes.map((n) =>
      n.id === id ? { ...n, lida: true } : n
    );

    setNotificacoes(novasNotificacoes);

    const novasNaoLidas = novasNotificacoes.filter((n) => !n.lida).length;

    setNaoLidas(novasNaoLidas);

    if (novasNaoLidas === 0) {
      setAberto(false);
    }
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error);
  }
}

  function formatarData(data) {
    if (!data) return "";

    return new Date(data).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  async function marcarTodasComoLidas() {
  try {
    await fetch(
      `http://localhost:8080/notificacoes/usuario/${usuario.id}/lidas`,
      {
        method: "PUT",
      }
    );

    setNotificacoes(
      notificacoes.map((n) => ({
        ...n,
        lida: true,
      }))
    );

    setNaoLidas(0);

    setAberto(false);

  } catch (error) {
    console.error(error);
  }
}

  return (
    <div className="notificacoes">
      <button
        type="button"
        className="notificacoes-btn"
        onClick={() => {
          setAberto(!aberto);
          carregarNotificacoes();
        }}
      >
        🔔

        {naoLidas > 0 && (
          <span className="notificacoes-badge">{naoLidas}</span>
        )}
      </button>

      {aberto && (
        <div className="notificacoes-dropdown">
          <div className="notificacoes-header">
  <div>
    <h3>Notificações</h3>
    <span>{naoLidas} nova(s)</span>
  </div>

  {naoLidas > 0 && (
    <button
      className="btn-marcar-todas"
      onClick={marcarTodasComoLidas}
    >
      Marcar todas
    </button>
  )}
</div>

          <div className="notificacoes-lista">
            {notificacoes.length > 0 ? (
              notificacoes.map((n) => (
                <div
                  key={n.id}
                  className={`notificacao-item ${!n.lida ? "nao-lida" : ""}`}
                >
                  <div>
                    <strong>{n.titulo}</strong>
                    <p>{n.mensagem}</p>
                    <small>{formatarData(n.dataCriacao)}</small>
                  </div>

                  {!n.lida && (
                    <button
  type="button"
  onClick={() => marcarComoLida(n.id)}
>
  Marcar como lida
</button>
                  )}
                </div>
              ))
            ) : (
              <p className="notificacoes-vazia">
                Nenhuma notificação por enquanto.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Notificacoes;