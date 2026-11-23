import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import { MainButton } from "../../ui/buttons";
import { TextField } from "../../ui/text-field";
import { Body, Title } from "../../ui/texts";
import css from "./index.css";

export function LoginForm() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) {
      navigate("/dashboard");
    }
  }

  return (
    <section className={css.card}>
      <div>
        <Title centered>Iniciar Sesión</Title>
        <Body centered>Ingresá tus datos para administrar tus mascotas</Body>
      </div>

      <form className={css.form} onSubmit={handleSubmit}>
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

        {error && <div className={css.errorBox}>{error}</div>}

        <MainButton type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Acceder"}
        </MainButton>
      </form>

      <div className={css.footerText}>
        ¿Aún no tenés cuenta?
        <Link to="/registro" className={css.link}>
          Registrate acá
        </Link>
      </div>
    </section>
  );
}
