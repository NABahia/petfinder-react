import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import { MainButton } from "../../ui/buttons";
import { TextField } from "../../ui/text-field";
import { Body, Title } from "../../ui/texts";
import css from "./index.css";

export function RegisterForm() {
  const navigate = useNavigate();
  const { register, login, loading, error, setError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const created = await register(name, email, password);
    if (created) {
      const loggedIn = await login(email, password);
      if (loggedIn) {
        navigate("/dashboard");
      } else {
        navigate("/ingresar");
      }
    }
  }

  return (
    <section className={css.card}>
      <div>
        <Title centered>Registrarse</Title>
        <Body centered>Creá tu cuenta en PetFinder en pocos segundos</Body>
      </div>

      <form className={css.form} onSubmit={handleSubmit}>
        <TextField
          id="name"
          name="name"
          label="Nombre completo"
          placeholder="Ej: Juan Pérez"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <TextField
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <TextField
          id="password"
          name="password"
          type="password"
          label="Contraseña"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <TextField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirmar contraseña"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && <div className={css.errorBox}>{error}</div>}

        <MainButton type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Registrarme"}
        </MainButton>
      </form>

      <div className={css.footerText}>
        ¿Ya tenés una cuenta?
        <Link to="/ingresar" className={css.link}>
          Iniciá sesión
        </Link>
      </div>
    </section>
  );
}
