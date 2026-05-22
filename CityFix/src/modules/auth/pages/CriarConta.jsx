import "../styles/CriarConta.css";
import { useState } from "react";
import { Link } from "react-router-dom";

function CriarConta() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [nomeTouched, setNomeTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [senhaTouched, setSenhaTouched] = useState(false);
  const [confirmarTouched, setConfirmarTouched] = useState(false);

  const nomeValido = nome.trim().length >= 3;
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const senhaValida = senha.length >= 8;
  const confirmarValida = confirmarSenha === senha && confirmarSenha.length >= 8;

  const nomeClass = nomeTouched ? (nomeValido ? "valid" : "invalid") : "";
  const emailClass = emailTouched ? (emailValido ? "valid" : "invalid") : "";
  const senhaClass = senhaTouched ? (senhaValida ? "valid" : "invalid") : "";
  const confirmarClass = confirmarTouched ? (confirmarValida ? "valid" : "invalid") : "";

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
              Participe da mudança
              <br />
              da sua cidade.
            </p>
          </div>

          <div className="features">
            <div className="feature-item">
              <span className="feature-icon">🛡️</span>
              Cadastre-se com segurança
            </div>

            <div className="feature-item">
              <span className="feature-icon">📍</span>
              Registre problemas urbanos
            </div>

            <div className="feature-item">
              <span className="feature-icon">🌿</span>
              <span>
                Ajude a construir uma cidade
                <br />
                melhor para todos
              </span>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="card">
            <h1 className="card-title">
              Crie sua conta no <span>CityFix</span>
            </h1>

            <p className="card-subtitle">Preencha seus dados para começar</p>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label className="form-label">Nome</label>

                <div className={`input-wrap ${nomeClass}`}>
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    placeholder="Digite seu nome"
                    autoComplete="name"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    onBlur={() => setNomeTouched(true)}
                  />
                </div>
              </div>

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
              </div>

              <div className="form-group">
                <label className="form-label">Senha</label>

                <div className={`input-wrap ${senhaClass}`}>
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo de 8 caracteres"
                    autoComplete="new-password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    onBlur={() => setSenhaTouched(true)}
                  />

                  <button
                    className="eye-btn"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    title="Mostrar/ocultar senha"
                  >
                    👁️
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirmar senha</label>

                <div className={`input-wrap ${confirmarClass}`}>
                  <span className="input-icon">🔐</span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme sua senha"
                    autoComplete="new-password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    onBlur={() => setConfirmarTouched(true)}
                  />

                  <button
                    className="eye-btn"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    title="Mostrar/ocultar senha"
                  >
                    👁️
                  </button>
                </div>
              </div>

              <button className="btn-primary" type="submit">
                <span>✓</span> Criar conta
              </button>
            </form>

            <p className="register-text">
  Já tem uma conta? <Link to="/login">Entrar</Link>
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

export default CriarConta;