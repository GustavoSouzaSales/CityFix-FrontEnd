import "../styles/NovaSenha.css";
import { useState, useCallback } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

/* ══ TOAST (reutiliza estilos do login.css via NovaSenha.css que importa login.css) ══ */
function Toast({ toasts, removeToast }) {
  return (
    <div className="login-toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`login-toast login-toast--${t.type}`}>
          <span className="login-toast-icon">
            {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
          </span>
          <span className="login-toast-msg">{t.message}</span>
          <button className="login-toast-close" onClick={() => removeToast(t.id)}>✕</button>
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
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  return { toasts, addToast, removeToast };
}

/* ══ OLHO SVG ══ */
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

/* ══ CSS extra injetado no head ══ */
const extraCSS = `
  .senha-forca-wrap { display:flex; align-items:center; gap:10px; margin-top:8px; }
  .senha-forca-barras { display:flex; gap:5px; flex:1; }
  .senha-barra { flex:1; height:4px; border-radius:99px; background:rgba(255,255,255,0.1); transition:background 0.3s ease; }
  .senha-barra.senha-fraca { background:#e53935; }
  .senha-barra.senha-media { background:#f4a825; }
  .senha-barra.senha-forte { background:#31bf49; }
  .senha-forca-label { font-size:11px; font-weight:600; letter-spacing:0.3px; min-width:36px; text-align:right; }
  .senha-forca-label.senha-fraca { color:#e53935; }
  .senha-forca-label.senha-media { color:#f4a825; }
  .senha-forca-label.senha-forte { color:#31bf49; }
  .confirmar-erro { margin-top:6px; font-size:11px; font-weight:500; color:#e57373; letter-spacing:0.2px; }
`;

if (!document.getElementById("nova-senha-extra-css")) {
  const style = document.createElement("style");
  style.id = "nova-senha-extra-css";
  style.textContent = extraCSS;
  document.head.appendChild(style);
}

/* ══ FORÇA DA SENHA ══ */
function avaliarSenha(senha) {
  if (senha.length === 0) return { nivel: 0, label: "", cor: "" };
  let pontos = 0;
  if (senha.length >= 8)           pontos++;
  if (senha.length >= 12)          pontos++;
  if (/[A-Z]/.test(senha))         pontos++;
  if (/[0-9]/.test(senha))         pontos++;
  if (/[^A-Za-z0-9]/.test(senha))  pontos++;
  if (pontos <= 2) return { nivel: 1, label: "Fraca", cor: "senha-fraca" };
  if (pontos <= 3) return { nivel: 2, label: "Média", cor: "senha-media" };
  return             { nivel: 3, label: "Forte", cor: "senha-forte" };
}

/* ══ COMPONENTE ══ */
function NovaSenha() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state?.token;
  const [salvando, setSalvando] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const [novaSenha, setNovaSenha]           = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showPassword, setShowPassword]                   = useState(false);
  const [showConfirmPassword, setShowConfirmPassword]     = useState(false);
  const [senhaTouched, setSenhaTouched]         = useState(false);
  const [confirmarTouched, setConfirmarTouched] = useState(false);

  const senhaValida     = novaSenha.length >= 8;
  const confirmarValida = confirmarSenha === novaSenha && confirmarSenha.length >= 8;
  const formularioValido = senhaValida && confirmarValida;
  const forcaSenha = avaliarSenha(novaSenha);

  const senhaClass     = senhaTouched     ? (senhaValida     ? "valid" : "invalid") : "";
  const confirmarClass = confirmarTouched ? (confirmarValida ? "valid" : "invalid") : "";

  const lerResposta = async (response) => {
  const texto = await response.text();

  if (!texto) {
    return {};
  }

  try {
    return JSON.parse(texto);
  } catch {
    return { mensagem: texto };
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  setSenhaTouched(true);
  setConfirmarTouched(true);

  if (!formularioValido) {
    addToast(
      "Verifique as senhas informadas.",
      "error"
    );
    return;
  }

  if (!token) {
    addToast(
      "A recuperação expirou. Solicite um novo código.",
      "error"
    );

    setTimeout(() => {
      navigate("/esqueci-senha");
    }, 1800);

    return;
  }

  try {
    setSalvando(true);

    const response = await fetch(
      "http://localhost:8080/recuperacao-senha/redefinir",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          novaSenha,
          confirmarSenha,
        }),
      }
    );

    const data = await lerResposta(response);

    if (!response.ok) {
      throw new Error(
        data.mensagem ||
          data.message ||
          "Não foi possível atualizar a senha."
      );
    }

    addToast(
      data.mensagem ||
        "Senha atualizada com sucesso! Redirecionando...",
      "success"
    );

    setTimeout(() => {
      navigate("/login", {
        replace: true,
      });
    }, 1500);
  } catch (error) {
    addToast(
      error.message ||
        "Não foi possível conectar ao servidor.",
      "error"
    );
  } finally {
    setSalvando(false);
  }
};

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />

      <div className="bg"></div>

      <div className="page page-nova-senha">
        <div className="left-panel">
          <div className="brand">
            <div className="logo-wrap">
              <svg className="logo-icon" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="26" r="18" fill="#2e8b3a" opacity="0.15" />
                <path d="M32 8C22.06 8 14 16.06 14 26C14 38.5 32 56 32 56C32 56 50 38.5 50 26C50 16.06 41.94 8 32 8Z" fill="#2e6b35" />
                <rect x="24" y="18" width="5"  height="12" rx="1" fill="white" opacity="0.9" />
                <rect x="31" y="14" width="5"  height="16" rx="1" fill="white" opacity="0.9" />
                <rect x="38" y="20" width="4"  height="10" rx="1" fill="white" opacity="0.9" />
                <path d="M20 34 Q26 28 32 34 Q26 40 20 34Z" fill="#6fcf7a" opacity="0.85" />
              </svg>
              <span className="brand-name">City<span>Fix</span></span>
            </div>
            <p className="brand-tagline">Segurança para sua conta<br />em poucos passos.</p>
          </div>

          <div className="features">
            <div className="feature-item"><span className="feature-icon">🔒</span>Crie uma senha segura</div>
            <div className="feature-item"><span className="feature-icon">🛡️</span>Proteja seus dados</div>
            <div className="feature-item"><span className="feature-icon">✅</span>Recupere o acesso à sua conta</div>
          </div>
        </div>

        <div className="right-panel">
          <div className="card nova-senha-card">
            <h1 className="card-title">Definir nova <span>senha</span></h1>
            <p className="card-subtitle">Escolha uma nova senha para sua conta.</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nova senha</label>
                <div className={`input-wrap ${senhaClass}`}>
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo de 8 caracteres"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    onBlur={() => setSenhaTouched(true)}
                  />
                  <button type="button" className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
                {novaSenha.length > 0 && (
                  <div className="senha-forca-wrap">
                    <div className="senha-forca-barras">
                      <div className={`senha-barra ${forcaSenha.nivel >= 1 ? forcaSenha.cor : ""}`} />
                      <div className={`senha-barra ${forcaSenha.nivel >= 2 ? forcaSenha.cor : ""}`} />
                      <div className={`senha-barra ${forcaSenha.nivel >= 3 ? forcaSenha.cor : ""}`} />
                    </div>
                    <span className={`senha-forca-label ${forcaSenha.cor}`}>{forcaSenha.label}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Confirmar senha</label>
                <div className={`input-wrap ${confirmarClass}`}>
                  <span className="input-icon">🔐</span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme sua senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    onBlur={() => setConfirmarTouched(true)}
                  />
                  <button type="button" className="eye-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}>
                    <EyeIcon visible={showConfirmPassword} />
                  </button>
                </div>
                {confirmarTouched && confirmarSenha.length > 0 && !confirmarValida && (
                  <p className="confirmar-erro">✕ As senhas não coincidem</p>
                )}
              </div>

              <button
  className="btn-primary"
  type="submit"
  disabled={!formularioValido || salvando}
>
  {salvando ? "Atualizando..." : "Atualizar senha"}
</button>
            </form>

            <p className="register-text">
              <Link to="/login">Voltar para o login</Link>
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

export default NovaSenha;