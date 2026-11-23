import React from "react";
import { useParams } from "react-router-dom";
import { ReportSightingForm } from "../../components/report-sighting-form";

export function ReportSightingPage() {
  const { id } = useParams<{ id: string }>();
  return <ReportSightingForm petId={id} />;
}
