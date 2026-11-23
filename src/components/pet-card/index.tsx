import React from "react";
import { PetItem } from "../../lib/api";
import { MainButton, SecondaryButton } from "../../ui/buttons";
import css from "./index.css";

interface PetCardProps {
  pet: PetItem;
  mode?: "nearby" | "owner";
  onAction: (petId: string | number) => void;
}

const FALLBACK_IMAGE =
  "https://placehold.co/600x400/3b4845/ffffff?text=Mascota";

export function PetCard({ pet, mode = "nearby", onAction }: PetCardProps) {
  const petId = pet.objectID ?? pet.id ?? "";

  return (
    <article className={css.card}>
      <div className={css.imageBox}>
        <img
          src={pet.petImageUrl || FALLBACK_IMAGE}
          alt={pet.name}
          className={css.image}
          loading="lazy"
        />
      </div>

      <div className={css.body}>
        <div className={css.info}>
          <h3 className={css.name}>{pet.name}</h3>
          <p className={css.location}>📍 {pet.location}</p>
        </div>

        {mode === "owner" ? (
          <SecondaryButton
            className={css.actionBtn}
            onClick={() => onAction(petId)}
          >
            ✏️ Editar
          </SecondaryButton>
        ) : (
          <MainButton
            type="button"
            className={css.actionBtn}
            onClick={() => onAction(petId)}
          >
            Reportar 📢
          </MainButton>
        )}
      </div>
    </article>
  );
}
