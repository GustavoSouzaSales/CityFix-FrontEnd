import "../styles/EsqueceuSenha.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080";

function EsqueceuSenha() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const [codigo, setCodigo] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  const [enviando, setEnviando] = useState(false);
  const [validando, setValidando] = useState(false);

  const [erro, setErro] = useState("");
  const [erroCodigo, setErroCodigo] = useState("");
  const [mensagem, setMensagem] = useState("");

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const emailClass = emailTouched
    ? emailValido
      ? "valid"
      : "invalid"
    : "";

  async function lerResposta(response) {
    const texto = await response.text();

    if (!texto) {
      return {};
    }

    try {
      return JSON.parse(texto);
    } catch {
      return { mensagem: texto };
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setEmailTouched(true);
    setErro("");
    setMensagem("");

    if (!emailValido) {
      return;
    }

    try {
      setEnviando(true);

      const response = await fetch(
        `${API_URL}/recuperacao-senha/solicitar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await lerResposta(response);

      if (!response.ok) {
        throw new Error(
          data.mensagem ||
            data.message ||
            "Não foi possível enviar o código."
        );
      }

      setMensagem(
        data.mensagem || "Código enviado para o seu e-mail."
      );

      setCodigo("");
      setErroCodigo("");
      setModalAberto(true);
    } catch (error) {
      setErro(
        error.message ||
          "Não foi possível conectar ao servidor."
      );
    } finally {
      setEnviando(false);
    }
  }

  function handleCodigoChange(e) {
    const somenteNumeros = e.target.value
      .replace(/\D/g, "")
      .slice(0, 6);

    setCodigo(somenteNumeros);
    setErroCodigo("");
  }

  async function validarCodigo(e) {
    e.preventDefault();

    setErroCodigo("");

    if (codigo.length !== 6) {
      setErroCodigo("Digite o código completo de 6 dígitos.");
      return;
    }

    try {
      setValidando(true);

      const response = await fetch(
        `${API_URL}/recuperacao-senha/validar-codigo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            codigo,
          }),
        }
      );

      const data = await lerResposta(response);

      if (!response.ok) {
        throw new Error(
          data.mensagem ||
            data.message ||
            "Código inválido ou expirado."
        );
      }

      if (!data.token) {
        throw new Error(
          "O servidor não retornou o token de recuperação."
        );
      }

      navigate("/nova-senha", {
        state: {
          token: data.token,
        },
      });
    } catch (error) {
      setErroCodigo(
        error.message || "Não foi possível validar o código."
      );
    } finally {
      setValidando(false);
    }
  }

  function fecharModal() {
    if (validando) {
      return;
    }

    setModalAberto(false);
    setCodigo("");
    setErroCodigo("");
  }

  return (
    <>
      <div className="bg"></div>

      <div className="page">
        <div className="left-panel">
          <div className="brand">
            <div className="logo-wrap">
              <svg
                className="logo-icon"
                viewBox="0 0 64 64"
                fill="none"
              >
                <circle
                  cx="32"
                  cy="26"
                  r="18"
                  fill="#2e8b3a"
                  opacity="0.15"
                />

                <path
                  d="M32 8C22.06 8 14 16.06 14 26C14 38.5 32 56 32 56C32 56 50 38.5 50 26C50 16.06 41.94 8 32 8Z"
                  fill="#2e6b35"
                />

                <rect
                  x="24"
                  y="18"
                  width="5"
                  height="12"
                  rx="1"
                  fill="white"
                  opacity="0.9"
                />

                <rect
                  x="31"
                  y="14"
                  width="5"
                  height="16"
                  rx="1"
                  fill="white"
                  opacity="0.9"
                />

                <rect
                  x="38"
                  y="20"
                  width="4"
                  height="10"
                  rx="1"
                  fill="white"
                  opacity="0.9"
                />

                <path
                  d="M20 34 Q26 28 32 34 Q26 40 20 34Z"
                  fill="#6fcf7a"
                  opacity="0.85"
                />
              </svg>

              <span className="brand-name">
                City<span>Fix</span>
              </span>
            </div>

            <p className="brand-tagline">
              Recupere o acesso
              <br />
              da sua conta.
            </p>
          </div>

          <div className="features">
            <div className="feature-item">
              <span className="feature-icon">🔐</span>
              Recuperação segura de senha
            </div>

            <div className="feature-item">
              <span className="feature-icon">📧</span>
              Receba um código no seu e-mail
            </div>

            <div className="feature-item">
              <span className="feature-icon">🛡️</span>

              <span>
                Proteção e segurança
                <br />
                para sua conta
              </span>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="card">
            <h1 className="card-title">
              Recuperar <span>Senha</span>
            </h1>

            <p className="card-subtitle">
              Informe seu e-mail para continuar
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">E-mail</label>

                <div className={`input-wrap ${emailClass}`}>
                  <span className="input-icon">✉️</span>

                  <input
                    type="email"
                    placeholder="Digite seu e-mail"
                    autoComplete="email"
                    value={email}
                    disabled={enviando}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErro("");
                      setMensagem("");
                    }}
                    onBlur={() => setEmailTouched(true)}
                  />
                </div>

                {emailTouched && !emailValido && (
                  <span className="error-message">
                    Digite um e-mail válido.
                  </span>
                )}

                {erro && (
                  <span className="error-message">
                    {erro}
                  </span>
                )}

                {mensagem && !modalAberto && (
                  <span className="success-message">
                    {mensagem}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={enviando}
              >
                {enviando ? (
                  "Enviando..."
                ) : (
                  <>
                    <span>→</span> Enviar código
                  </>
                )}
              </button>
            </form>

            <p className="register-text">
              Lembrou sua senha?{" "}
              <Link to="/login">Entrar</Link>
            </p>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>CityFix – Sistema de Denúncias Urbanas</p>
        <p>© 2026 Todos os direitos reservados.</p>
      </footer>

      {modalAberto && (
        <div
          className="codigo-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              fecharModal();
            }
          }}
        >
          <div className="codigo-modal">
            <button
              type="button"
              className="codigo-modal-close"
              onClick={fecharModal}
              disabled={validando}
              aria-label="Fechar"
            >
              ✕
            </button>

            <div className="codigo-modal-icon">✉️</div>

            <h2>Verifique seu e-mail</h2>

            <p>
              Enviamos um código de 6 dígitos para:
            </p>

            <strong className="codigo-email">
              {email}
            </strong>

            <form onSubmit={validarCodigo}>
              <input
                className="codigo-input"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                value={codigo}
                onChange={handleCodigoChange}
                autoFocus
                disabled={validando}
              />

              {erroCodigo && (
                <span className="codigo-erro">
                  {erroCodigo}
                </span>
              )}

              <button
                type="submit"
                className="btn-primary codigo-btn"
                disabled={codigo.length !== 6 || validando}
              >
                {validando
                  ? "Verificando..."
                  : "Verificar código"}
              </button>
            </form>

            <button
              type="button"
              className="reenviar-codigo"
              disabled={enviando || validando}
              onClick={handleSubmit}
            >
              {enviando
                ? "Reenviando..."
                : "Não recebeu? Reenviar código"}
            </button>

            <span className="codigo-aviso">
              O código expira em 15 minutos.
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default EsqueceuSenha;