import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MyDataForm } from "../../components/my-data-form";
import { useAuth } from "../../hooks";

export function MisDatosPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/ingresar");
    }
  }, [isAuthenticated, navigate]);

  return <MyDataForm />;
}
