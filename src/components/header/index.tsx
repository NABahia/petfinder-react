import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import css from "./index.css";

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function goProtected(path: string) {
    setMenuOpen(false);
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate("/ingresar");
    }
  }

  function handleLogout() {
    setMenuOpen(false);
    logout();
    navigate("/");
  }

  return (
    <header className={css.header}>
      <div className={css.inner}>
        <Link
          to="/"
          className={css.brand}
          onClick={() => setMenuOpen(false)}
        >
          <span className={css.brandBadge}>🐾</span>
          <span>PetFinder</span>
        </Link>

        <nav className={css.desktopNav}>
          <button
            type="button"
            className={css.navLink}
            onClick={() => goProtected("/mis-datos")}
          >
            Mis datos
          </button>
          <button
            type="button"
            className={css.navLink}
            onClick={() => goProtected("/mis-mascotas")}
          >
            Mis mascotas reportadas
          </button>
          <button
            type="button"
            className={css.navLink}
            onClick={() => goProtected("/reportar")}
          >
            Reportar mascota
          </button>

          <div className={css.userBox}>
            {isAuthenticated ? (
              <>
                {user?.email && (
                  <span className={css.userEmail}>{user.email}</span>
                )}
                <button
                  type="button"
                  className={css.sessionBtn}
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <button
                type="button"
                className={css.sessionBtn}
                onClick={() => navigate("/ingresar")}
              >
                Iniciar sesión
              </button>
            )}
          </div>
        </nav>

        <button
          type="button"
          className={css.menuToggle}
          aria-label="Abrir menú"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <nav className={css.mobileMenu}>
          <button
            type="button"
            className={css.navLink}
            onClick={() => goProtected("/mis-datos")}
          >
            Mis datos
          </button>
          <button
            type="button"
            className={css.navLink}
            onClick={() => goProtected("/mis-mascotas")}
          >
            Mis mascotas reportadas
          </button>
          <button
            type="button"
            className={css.navLink}
            onClick={() => goProtected("/reportar")}
          >
            Reportar mascota
          </button>

          <div className={css.userBox}>
            {isAuthenticated ? (
              <>
                {user?.email && (
                  <span className={css.userEmail}>{user.email}</span>
                )}
                <button
                  type="button"
                  className={css.sessionBtn}
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <button
                type="button"
                className={css.sessionBtn}
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/ingresar");
                }}
              >
                Iniciar sesión
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
