import "../styles/EsqueceuSenha.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function EsqueceuSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const emailClass = emailTouched
    ? emailValido
      ? "valid"
      : "invalid"
    : "";

  function handleSubmit(e) {
    e.preventDefault();
    setEmailTouched(true);
    if (!emailValido) return;
    navigate("/nova-senha");
  }

  return (
    <>
      <div className="bg"></div>

      <div className="page">
        <div className="left-panel">
          <div className="brand">
            <div className="logo-wrap">
              <svg className="logo-icon" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="26" r="18" fill="#2e8b3a" opacity="0.15" />
                <path
                  d="M32 8C22.06 8 14 16.06 14 26C14 38.5 32 56 32 56C32 56 50 38.5 50 26C50 16.06 41.94 8 32 8Z"
                  fill="#2e6b35"
                />
                <rect x="24" y="18" width="5" height="12" rx="1" fill="white" opacity="0.9" />
                <rect x="31" y="14" width="5" height="16" rx="1" fill="white" opacity="0.9" />
                <rect x="38" y="20" width="4" height="10" rx="1" fill="white" opacity="0.9" />
                <path d="M20 34 Q26 28 32 34 Q26 40 20 34Z" fill="#6fcf7a" opacity="0.85" />
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
              Receba instruções no seu e-mail
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
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                  />
                </div>

                {emailTouched && !emailValido && (
                  <span className="error-message">
                    Digite um e-mail válido.
                  </span>
                )}

                {emailTouched && emailValido && (
                  <span className="success-message">
                    E-mail válido.
                  </span>
                )}
              </div>

              <button type="submit" className="btn-primary">
                <span>→</span> Enviar instruções
              </button>
            </form>

            <p className="register-text">
              Lembrou sua senha? <Link to="/login">Entrar</Link>
            </p>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>CityFix – Sistema de Denúncias Urbanas</p>
        <p>© 2026 Todos os direitos reservados.</p>
      </footer>
    </>
  );
}

export default EsqueceuSenha;