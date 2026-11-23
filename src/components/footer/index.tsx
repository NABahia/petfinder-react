import React from "react";
import css from "./index.css";

export function Footer() {
  return (
    <footer className={css.footer}>
      <span className={css.highlight}>PetFinder</span> · Comunidad para
      encontrar y reportar mascotas perdidas · React + Custom Hooks + UI
    </footer>
  );
}
