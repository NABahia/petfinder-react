import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "../components/layout";
import { DashboardPage } from "../pages/dashboard";
import { HomePage } from "../pages/home";
import { LoginPage } from "../pages/login";
import { MisDatosPage } from "../pages/mis-datos";
import { MisMascotasPage } from "../pages/mis-mascotas";
import { RegisterPage } from "../pages/register";
import { ReportPetPage } from "../pages/report-pet";
import { ReportSightingPage } from "../pages/report-sighting";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="ingresar" element={<LoginPage />} />
        <Route path="registro" element={<RegisterPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="mis-datos" element={<MisDatosPage />} />
        <Route path="mis-mascotas" element={<MisMascotasPage />} />
        <Route path="reportar" element={<ReportPetPage />} />
        <Route path="reportar/:id" element={<ReportPetPage />} />
        <Route path="editar-mascota/:id" element={<ReportPetPage />} />
        <Route path="mascota/:id" element={<ReportSightingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
