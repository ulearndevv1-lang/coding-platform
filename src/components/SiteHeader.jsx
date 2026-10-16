import { Link, NavLink } from "react-router-dom";
import AuthControls from "./AuthControls";
import { useTheme } from "../hooks/useTheme";

export default function SiteHeader({ variant = "practice" }) {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className={`site-header site-header--${variant}`}>
      <Link to="/" className="brand brand-link">
        <div className="brand-icon">{"</>"}</div>
        <div className="brand-text">
          <span className="brand-title">CodeSpace</span>
          <span className="brand-tagline show-on-landing">Practice. Code. Grow.</span>
        </div>
      </Link>

      <nav className="site-nav" aria-label="Main">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-link${isActive ? " active" : ""}`
          }
          end
        >
          Home
        </NavLink>
        <NavLink
          to="/practice"
          className={({ isActive }) =>
            `nav-link${isActive ? " active" : ""}`
          }
        >
          Practice
        </NavLink>
      </nav>

      <div className="header-actions">
        <AuthControls />
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
        <Link to="/practice" className="cta-button header-cta">
          Start coding
        </Link>
      </div>
    </header>
  );
}
