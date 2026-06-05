import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./NavBar.css";
import logoCityFix from "../../../assets/images/favicon.png";

function NavBar() {
  const location = useLocation();

  const [naoLidas, setNaoLidas] = useState(0);

  const isActive = (path) => location.pathname === path;

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const isAdmin = usuario?.tipoUsuario === "ADMINISTRADOR";

  useEffect(() => {
    async function carregarNotificacoes() {
      if (!usuario?.id) return;

      try {
        const response = await fetch(
          `http://localhost:8080/notificacoes/usuario/${usuario.id}/nao-lidas`
        );

        const quantidade = await response.json();

        setNaoLidas(quantidade);
      } catch (error) {
        console.error("Erro ao carregar notificações:", error);
      }
    }

    carregarNotificacoes();

    const intervalo = setInterval(carregarNotificacoes, 5000);

    return () => clearInterval(intervalo);
  }, [usuario]);

  const navItems = [
    { to: "/home", emoji: "🏠", label: "Início" },
    { to: "/registrar-denuncia", emoji: "➕", label: "Registrar" },
    { to: "/denuncias-publicas", emoji: "📋", label: "Públicas" },
    { to: "/perfil", emoji: "👤", label: "Perfil" },
    ...(isAdmin
      ? [{ to: "/admin", emoji: "⚙️", label: "Admin" }]
      : []),
    { to: "/sobre", emoji: "ℹ️", label: "Sobre" },
  ];

  return (
    <aside className="navbar-cityfix">

      {/* ── TOPO: brand + nav ── */}
      <div className="navbar-top">

        {/* Brand */}
        <div className="navbar-brand">
          <div className="navbar-logo">
            <img src={logoCityFix} alt="CityFix" />
          </div>

          <div className="navbar-brand-text">
            <h1>
              City<span>Fix</span>
            </h1>

            <p>
              Sua cidade melhor começa com sua voz.
            </p>
          </div>
        </div>

        <div className="navbar-divider" />

        {/* Menu */}
        <nav className="navbar-menu">

          {navItems.map(({ to, emoji, label }) => (
            <Link
              key={to}
              to={to}
              className={isActive(to) ? "active" : ""}
            >
              <span className="nav-icon">
                {emoji}
              </span>

              <p className="navbar-label">
                {label}

                {to === "/home" && naoLidas > 0 && (
                  <span className="navbar-notification-dot"></span>
                )}
              </p>
            </Link>
          ))}

          {/* Login mobile apenas se não estiver logado */}
          {!usuario && (
            <Link
              to="/login"
              className={`navbar-menu-login ${
                isActive("/login") ? "active" : ""
              }`}
            >
              <span className="nav-icon">👤</span>
              <p>Login</p>
            </Link>
          )}
        </nav>
      </div>

      {/* Card inferior */}
      <div
        className={`navbar-login-card ${
          usuario ? "logged-in" : ""
        }`}
      >
        {usuario ? (
          <>
            <div className="login-card-icon">
              👤
            </div>

            <h3 className="user-name">
              {usuario.nome}
            </h3>

            <p className="user-email">
              {usuario.email}
            </p>

            <button
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem("usuario");
                window.location.href = "/login";
              }}
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <div className="login-card-icon">
              🔑
            </div>

            <p>
              Entre para acompanhar suas denúncias.
            </p>

            <Link
              to="/login"
              className="login-card-btn"
            >
              Fazer login
            </Link>
          </>
        )}
      </div>

    </aside>
  );
}

export default NavBar;