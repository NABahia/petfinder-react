import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PetCard } from "../../components/pet-card";
import { useAuth, useMyPets } from "../../hooks";
import { MainButton } from "../../ui/buttons";
import { Body, Subtitle, Title } from "../../ui/texts";
import css from "./index.css";

export function MisMascotasPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { pets, loading, error } = useMyPets();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/ingresar");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={css.wrapper}>
      <div className={css.header}>
        <Title centered>Mascotas reportadas</Title>
        <Body centered>
          Administrá tus publicaciones activas o editá sus datos
        </Body>
      </div>

      {loading && (
        <div className={css.emptyCard}>
          <Subtitle centered>Cargando tus mascotas... 🐾</Subtitle>
        </div>
      )}

      {!loading && error && (
        <div className={css.emptyCard}>
          <Body centered>{error}</Body>
        </div>
      )}

      {!loading && !error && pets.length === 0 && (
        <div className={css.emptyCard}>
          <span className={css.emptyIcon}>🐕</span>
          <Subtitle centered>Aún no reportaste mascotas perdidas</Subtitle>
          <Body centered>
            Publicá un reporte con foto y ubicación para que la comunidad pueda
            ayudarte a encontrarla.
          </Body>
          <MainButton type="button" onClick={() => navigate("/reportar")}>
            Publicar reporte
          </MainButton>
        </div>
      )}

      {!loading && !error && pets.length > 0 && (
        <div className={css.grid}>
          {pets.map((pet) => {
            const id = pet.id ?? pet.objectID ?? pet.name;
            return (
              <PetCard
                key={String(id)}
                pet={pet}
                mode="owner"
                onAction={(petId) => navigate(`/editar-mascota/${petId}`)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
