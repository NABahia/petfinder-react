import React, { useState } from "react";
import { useUserData } from "../../hooks";
import { MainButton } from "../../ui/buttons";
import { TextField } from "../../ui/text-field";
import { Body, Caption, Title } from "../../ui/texts";
import css from "./index.css";

export function MyDataForm() {
  const {
    fullname,
    setFullname,
    email,
    loading,
    saving,
    statusMsg,
    isError,
    updateProfile,
  } = useUserData();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalError(null);

    if (password && password !== confirmPassword) {
      setLocalError("Las contraseñas nuevas no coinciden.");
      return;
    }

    const ok = await updateProfile(fullname, password);
    if (ok) {
      setPassword("");
      setConfirmPassword("");
    }
  }

  if (loading) {
    return (
      <section className={css.card}>
        <Body centered>Cargando tus datos personales...</Body>
      </section>
    );
  }

  return (
    <section className={css.card}>
      <div>
        <Title centered>Mis Datos</Title>
        {email && <Caption centered>Cuenta: {email}</Caption>}
      </div>

      <form className={css.form} onSubmit={handleSubmit}>
        <TextField
          id="fullname"
          name="fullname"
          label="Nombre completo"
          placeholder="Ej: Juan Pérez"
          autoComplete="off"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          required
        />

        <hr className={css.divider} />

        <TextField
          id="password"
          name="password"
          type="password"
          label="Nueva contraseña (opcional)"
          placeholder="Dejar en blanco para no cambiar"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Repetir nueva contraseña"
          placeholder="Dejar en blanco para no cambiar"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {localError && <div className={css.statusError}>{localError}</div>}

        {statusMsg && (
          <div className={isError ? css.statusError : css.statusSuccess}>
            {statusMsg}
          </div>
        )}

        <MainButton type="submit" disabled={saving}>
          {saving ? "Guardando..." : "Guardar"}
        </MainButton>
      </form>
    </section>
  );
}
