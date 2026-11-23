import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReportSighting } from "../../hooks";
import { DarkButton, MainButton } from "../../ui/buttons";
import { MapSelector } from "../../ui/map";
import { PhotoUploader } from "../../ui/photo-uploader";
import { TextField } from "../../ui/text-field";
import { Body, Title } from "../../ui/texts";
import css from "./index.css";

interface ReportSightingFormProps {
  petId?: string;
}

export function ReportSightingForm({ petId }: ReportSightingFormProps) {
  const navigate = useNavigate();
  const { pet, submitting, error, setError, submitSighting } =
    useReportSighting(petId);

  const [reporterName, setReporterName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [pictureData, setPictureData] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (lat === 0 && lng === 0) {
      setError("Por favor, marcá dónde viste a la mascota en el mapa.");
      return;
    }

    const ok = await submitSighting({
      reporterName: reporterName.trim(),
      phone: phone.trim(),
      location: location.trim(),
      lat,
      lng,
      pictureData: pictureData || undefined,
    });

    if (ok) {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <section className={css.card}>
        <div className={css.successBox}>
          <Title centered>¡Aviso enviado!</Title>
          <Body centered>
            El dueño de {pet?.name ? <strong>{pet.name}</strong> : "la mascota"}{" "}
            recibirá un correo con tu información y el punto exacto en el mapa.
          </Body>
          <MainButton type="button" onClick={() => navigate("/")}>
            Volver al inicio
          </MainButton>
        </div>
      </section>
    );
  }

  return (
    <section className={css.card}>
      <div>
        <Title centered>
          Reportar info {pet?.name ? `de ${pet.name}` : ""}
        </Title>
        <Body centered>
          Completá tus datos de contacto y el lugar donde viste a la mascota
        </Body>
      </div>

      {pet && (
        <div className={css.petSummary}>
          {pet.petImageUrl && (
            <img
              src={pet.petImageUrl}
              alt={pet.name}
              className={css.petThumb}
            />
          )}
          <div className={css.petMeta}>
            <h3 className={css.petName}>{pet.name}</h3>
            <p className={css.petLoc}>Perdida en: {pet.location}</p>
          </div>
        </div>
      )}

      <form className={css.form} onSubmit={handleSubmit}>
        <TextField
          id="reporterName"
          name="reporterName"
          label="Tu nombre"
          placeholder="Ej: María Gómez"
          value={reporterName}
          onChange={(e) => setReporterName(e.target.value)}
          required
        />

        <TextField
          id="phone"
          name="phone"
          type="tel"
          label="Tu teléfono"
          placeholder="Ej: +54 9 11 1234-5678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <PhotoUploader
          label="Foto del avistamiento (opcional)"
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
          label="¿Dónde la viste? (Ciudad, Barrio, Calle)"
          placeholder="Ej: Plaza Italia, Palermo"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        {error && <div className={css.errorBox}>{error}</div>}

        <div className={css.actions}>
          <MainButton type="submit" disabled={submitting}>
            {submitting ? "Enviando información..." : "Enviar información"}
          </MainButton>
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
