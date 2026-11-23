import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PetCard } from "../../components/pet-card";
import { useAuth, useNearbyPets } from "../../hooks";
import { DarkButton, MainButton, SecondaryButton } from "../../ui/buttons";
import { Body, Subtitle, Title } from "../../ui/texts";
import css from "./index.css";

export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    nearbyPets,
    loading,
    error,
    hasRequestedLocation,
    requestLocationAndSearch,
  } = useNearbyPets();

  const searchSectionRef = useRef<HTMLDivElement | null>(null);

  function handleOwnerAccess() {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/ingresar");
    }
  }

  function handleScrollToNearby() {
    searchSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className={css.wrapper}>
      <section className={css.hero}>
        <span className={css.heroBadge}>🐶🐱</span>
        <Title centered accent>
          PetFinder
        </Title>
        <Subtitle centered>
          Encontrá y reportá mascotas perdidas cerca de tu ubicación
        </Subtitle>
        <Body centered>
          Conectamos a dueños de mascotas perdidas con vecinos de su zona en
          tiempo real.
        </Body>

        <div className={css.heroButtons}>
          <DarkButton onClick={handleOwnerAccess}>
            👤 Soy dueño ({isAuthenticated ? "Ir a mi panel" : "Ingresar"})
          </DarkButton>
          <MainButton type="button" onClick={handleScrollToNearby}>
            👀 Vi una mascota perdida
          </MainButton>
        </div>
      </section>

      <hr className={css.divider} />

      <section ref={searchSectionRef} className={css.nearbySection}>
        <Subtitle centered>Mascotas perdidas cerca</Subtitle>

        {!hasRequestedLocation && (
          <div className={css.locationCard}>
            <Body centered>
              Para ver las mascotas reportadas cerca tuyo necesitamos permiso
              para conocer tu ubicación.
            </Body>
            <SecondaryButton
              className={css.locationBtn}
              onClick={requestLocationAndSearch}
            >
              📍 Dar mi ubicación actual
            </SecondaryButton>
          </div>
        )}

        {loading && (
          <div className={css.statusBox}>
            <Subtitle centered>Buscando mascotas cerca tuyo... 🐾</Subtitle>
            <Body centered>Consultando reportes en un radio de 5 km.</Body>
          </div>
        )}

        {!loading && error && (
          <div className={css.statusBox}>
            <Body centered>{error}</Body>
            <SecondaryButton onClick={requestLocationAndSearch}>
              Reintentar con mi ubicación
            </SecondaryButton>
          </div>
        )}

        {!loading && !error && hasRequestedLocation && (
          <>
            {nearbyPets.length === 0 ? (
              <div className={css.statusBox}>
                <Subtitle centered>
                  No hay mascotas perdidas reportadas en tu zona
                </Subtitle>
                <Body centered>
                  No encontramos reportes activos cerca de tu ubicación actual.
                </Body>
                <SecondaryButton onClick={requestLocationAndSearch}>
                  Actualizar ubicación
                </SecondaryButton>
              </div>
            ) : (
              <div className={css.grid}>
                {nearbyPets.map((pet) => {
                  const id = pet.objectID ?? pet.id ?? pet.name;
                  return (
                    <PetCard
                      key={String(id)}
                      pet={pet}
                      mode="nearby"
                      onAction={(petId) => navigate(`/mascota/${petId}`)}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
