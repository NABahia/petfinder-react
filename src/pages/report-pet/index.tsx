import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReportPet } from "../../components/report-pet-form";
import { useAuth } from "../../hooks";

export function ReportPetPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/ingresar");
    }
  }, [isAuthenticated, navigate]);

  return <ReportPet petId={id} />;
}
