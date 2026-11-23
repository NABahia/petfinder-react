import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import { MainButton, OutlineButton, SecondaryButton } from "../../ui/buttons";
import { Body, Title } from "../../ui/texts";
import css from "./index.css";

export function DashboardPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/ingresar");
    }
  }, [isAuthenticated, navigate]);

  return (
    <section className={css.container}>
      <div>
        <Title centered>Mi Panel</Title>
        <Body centered>
          {user?.name ? `¡Hola, ${user.name}! ` : ""}
          Gestioná tus datos personales y tus reportes de mascotas
        </Body>
      </div>

      <div className={css.menuButtons}>
        <OutlineButton onClick={() => navigate("/mis-datos")}>
          👤 Mis datos personales
        </OutlineButton>

        <SecondaryButton onClick={() => navigate("/mis-mascotas")}>
          🐾 Mis mascotas reportadas
        </SecondaryButton>

        <MainButton type="button" onClick={() => navigate("/reportar")}>
          📢 Reportar mascota perdida
        </MainButton>
      </div>
    </section>
  );
}
