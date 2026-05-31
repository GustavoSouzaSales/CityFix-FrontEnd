import { Link, useLocation } from "react-router-dom";
import "./NavBar.css";
import logoCityFix from "../../../assets/images/favicon.png";

function NavBar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { to: "/home",               emoji: "🏠", label: "Início"    },
    { to: "/registrar-denuncia", emoji: "➕", label: "Registrar" },
    { to: "/denuncias-publicas", emoji: "📋", label: "Públicas"  },
    { to: "/perfil",             emoji: "👤", label: "Perfil"    },
    { to: "/admin",              emoji: "⚙️", label: "Admin"     },
    { to: "/sobre",              emoji: "ℹ️", label: "Sobre"     },
  ];

  return (
    <aside className="navbar-cityfix">

      {/* ── TOPO: brand + nav ── */}
      <div className="navbar-top">

        {/* Brand — só desktop */}
        <div className="navbar-brand">
          <div className="navbar-logo">
            <img src={logoCityFix} alt="CityFix" />
          </div>
          <div className="navbar-brand-text">
            <h1>City<span>Fix</span></h1>
            <p>Sua cidade melhor começa com sua voz.</p>
          </div>
        </div>

        {/* Divisor fino — só desktop */}
        <div className="navbar-divider" />

        {/* Links de navegação */}
        <nav className="navbar-menu">
          {navItems.map(({ to, emoji, label }) => (
            <Link key={to} to={to} className={isActive(to) ? "active" : ""}>
              <span className="nav-icon">{emoji}</span>
              <p>{label}</p>
            </Link>
          ))}

          {/* Login visível só no mobile */}
          <Link
            to="/login"
            className={`navbar-menu-login ${isActive("/login") ? "active" : ""}`}
          >
            <span className="nav-icon">👤</span>
            <p>Login</p>
          </Link>
        </nav>
      </div>

      {/* ── RODAPÉ: card de login — só desktop ── */}
      <div className="navbar-login-card">
        <div className="login-card-icon">🔑</div>
        <p>Entre para acompanhar suas denúncias.</p>
        <Link to="/login" className="login-card-btn">Fazer login</Link>
      </div>

    </aside>
  );
}

export default NavBar;