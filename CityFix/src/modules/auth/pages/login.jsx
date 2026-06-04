import "../styles/login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [emailTouched, setEmailTouched] = useState(false);
  const [senhaTouched, setSenhaTouched] = useState(false);

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const senhaValida = senha.length >= 8;

  const emailClass = emailTouched
    ? emailValido
      ? "valid"
      : "invalid"
    : "";

  const senhaClass = senhaTouched
    ? senhaValida
      ? "valid"
      : "invalid"
    : "";

    // Realiza o login do usuário na API
async function handleSubmit(e) {
  e.preventDefault();

  if (!emailValido || !senhaValida) {
    alert("Preencha e-mail e senha corretamente.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        senha,
      }),
    });

    if (!response.ok) {
      alert("E-mail ou senha inválidos.");
      return;
    }

    const usuario = await response.json();

    localStorage.setItem("usuario", JSON.stringify(usuario));

    alert("Login realizado com sucesso!");
    navigate("/home");
  } catch (error) {
    alert("Erro ao conectar com o servidor.");
  }
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
              Sua cidade melhor começa
              <br />
              com a sua voz.
            </p>
          </div>

          <div className="features">
            <div className="feature-item">
              <span className="feature-icon">🛡️</span>
              Denuncie problemas urbanos
            </div>

            <div className="feature-item">
              <span className="feature-icon">📍</span>
              Acompanhe suas solicitações
            </div>

            <div className="feature-item">
              <span className="feature-icon">🌿</span>
              <span>
                Contribua para uma cidade
                <br />
                melhor para todos
              </span>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="card">
            <h1 className="card-title">
              Bem-vindo ao <span>CityFix</span>
            </h1>

            <p className="card-subtitle">Faça login para continuar</p>

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
              </div>

              <div className="form-group">
                <label className="form-label">Senha</label>

                <div className={`input-wrap ${senhaClass}`}>
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
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

                <Link to="/esqueci-senha" className="forgot-link">
                Esqueceu sua senha?
              </Link>
              </div>

              <button className="btn-primary" type="submit">
                <span>→</span> Entrar
              </button>

              <div className="divider">ou</div>

              <button className="btn-google" type="button">
                <svg className="google-logo" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>

                Entrar com Google
              </button>
            </form>

            <p className="register-text">
              Ainda não tem uma conta? <Link to="/criar-conta">Cadastre-se</Link>
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

export default Login;