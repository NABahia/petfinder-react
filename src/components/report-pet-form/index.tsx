import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePetForm } from "../../hooks";
import {
  DarkButton,
  MainButton,
  OutlineButton,
  SuccessButton,
} from "../../ui/buttons";
import { MapSelector } from "../../ui/map";
import { PhotoUploader } from "../../ui/photo-uploader";
import { TextField } from "../../ui/text-field";
import { Body, Title } from "../../ui/texts";
import css from "./index.css";

interface ReportPetProps {
  petId?: string;
}

export function ReportPet({ petId }: ReportPetProps) {
  const navigate = useNavigate();
  const isEditMode = Boolean(petId);
  const {
    initialPet,
    loadingInitial,
    submitting,
    error,
    setError,
    savePet,
    deleteOrUnpublishPet,
  } = usePetForm(petId);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [pictureData, setPictureData] = useState("");

  useEffect(() => {
    if (initialPet) {
      setName(initialPet.name || "");
      setLocation(initialPet.location || "");
      setLat(
        initialPet.lat ?? initialPet._geoloc?.lat ?? 0
      );
      setLng(
        initialPet.lng ?? initialPet._geoloc?.lng ?? 0
      );
      setPictureData(initialPet.petImageUrl || "");
    }
  }, [initialPet]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!pictureData) {
      setError("Por favor, agregá una foto de la mascota.");
      return;
    }

    if (lat === 0 && lng === 0) {
      setError(
        "Por favor, marcá un punto de referencia en el mapa o capturá tu ubicación."
      );
      return;
    }

    const ok = await savePet({
      name: name.trim(),
      location: location.trim(),
      lat,
      lng,
      pictureData,
    });

    if (ok) {
      navigate("/mis-mascotas");
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "¿Confirmás que encontraste a tu mascota o querés despublicarla?"
    );
    if (!confirmed) return;

    const ok = await deleteOrUnpublishPet();
    if (ok) {
      navigate("/mis-mascotas");
    }
  }

  if (loadingInitial) {
    return (
      <section className={css.card}>
        <Body centered>Cargando datos de la mascota...</Body>
      </section>
    );
  }

  return (
    <section className={css.card}>
      <div>
        <Title centered>
          {isEditMode ? "Editar reporte de mascota" : "Reportar mascota"}
        </Title>
        <Body centered>
          {isEditMode
            ? "Actualizá los datos o despublicá tu mascota si ya apareció."
            : "Ingresá la siguiente información para realizar el reporte de la mascota."}
        </Body>
      </div>

      <form className={css.form} onSubmit={handleSubmit}>
        <TextField
          id="name"
          name="name"
          label="Nombre de la mascota"
          placeholder="Ej: Firulais"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <PhotoUploader
          label="Foto de la mascota"
          previewUrl={pictureData}
          onImageChange={(dataUrl) => setPictureData(dataUrl)}
        />

        <MapSelector
          lat={lat}
          lng={lng}
          locationText={location}
          onChange={({ lat: newLat, lng: newLng, addressHint }) => {
            setLat(newLat);
            setLng(newLng);
            if (addressHint && !location) {
              setLocation(addressHint);
            }
          }}
        />

        <TextField
          id="location"
          name="location"
          label="Ubicación (Barrio, Ciudad)"
          placeholder="Ej: Palermo, Buenos Aires"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        {error && <div className={css.errorBox}>{error}</div>}

        <div className={css.actions}>
          {isEditMode ? (
            <>
              <MainButton type="submit" disabled={submitting}>
                {submitting ? "Guardando..." : "Guardar cambios"}
              </MainButton>
              <SuccessButton
                type="button"
                disabled={submitting}
                onClick={handleDelete}
              >
                Reportar como encontrado / Despublicar
              </SuccessButton>
            </>
          ) : (
            <MainButton type="submit" disabled={submitting}>
              {submitting ? "Publicando reporte..." : "Reportar mascota"}
            </MainButton>
          )}

          <DarkButton
            type="button"
            disabled={submitting}
            onClick={() => navigate(-1)}
          >
            Cancelar
          </DarkButton>
        </div>
      </form>
    </section>
  );
}
