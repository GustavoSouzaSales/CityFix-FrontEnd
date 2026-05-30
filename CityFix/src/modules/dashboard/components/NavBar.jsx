import { Link, useLocation } from "react-router-dom";
import "./NavBar.css";
import logoCityFix from "../../../assets/images/favicon.png";

function NavBar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="navbar-cityfix">
      <div className="navbar-top">
        <div className="navbar-brand">
          <div className="navbar-logo">
  <img src={logoCityFix} alt="CityFix" />
</div>

          <div className="navbar-brand-text">
            <h1>
              City<span>Fix</span>
            </h1>
            <p>Sua cidade melhor começa com sua voz.</p>
          </div>
        </div>

        <nav className="navbar-menu">
  <Link to="/home" className={isActive("/home") ? "active" : ""}>
    <span>🏠</span>
    <p>Início</p>
  </Link>

  <Link
    to="/registrar-denuncia"
    className={isActive("/registrar-denuncia") ? "active" : ""}
  >
    <span>➕</span>
    <p>Registrar</p>
  </Link>

  <Link
    to="/denuncias-publicas"
    className={isActive("/denuncias-publicas") ? "active" : ""}
  >
    <span>📋</span>
    <p>Públicas</p>
  </Link>

  <Link to="/perfil" className={isActive("/perfil") ? "active" : ""}>
    <span>👤</span>
    <p>Perfil</p>
  </Link>

  <Link to="/admin" className={isActive("/admin") ? "active" : ""}>
    <span>⚙️</span>
    <p>Admin</p>
  </Link>

  <Link to="/sobre" className={isActive("/sobre") ? "active" : ""}>
    <span>ℹ️</span>
    <p>Sobre</p>
  </Link>

  <Link
    to="/login"
    className={`navbar-menu-login ${isActive("/login") ? "active" : ""}`}
  >
    <span>👤</span>
    <p>Login</p>
  </Link>
</nav>
      </div>

      <div className="navbar-login-card">
        <p>Entre para acompanhar suas denúncias.</p>
        <Link to="/login">Fazer login</Link>
      </div>
    </aside>
  );
}

export default NavBar;