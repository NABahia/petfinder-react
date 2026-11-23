import React, { useRef, useState } from "react";
import css from "./index.css";

interface PhotoUploaderProps {
  label?: string;
  previewUrl?: string;
  onImageChange: (base64DataUrl: string) => void;
}

function resizeImageToBase64(file: File, maxSize = 600): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function PhotoUploader({
  label = "Foto de la mascota",
  previewUrl,
  onImageChange,
}: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  async function handleFile(file?: File) {
    if (!file || !file.type.startsWith("image/")) return;
    const dataUrl = await resizeImageToBase64(file);
    onImageChange(dataUrl);
  }

  return (
    <div className={css.wrapper}>
      {label && <span className={css.label}>{label}</span>}

      <div
        className={`${css.dropzone} ${dragging ? css.dragging : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          handleFile(file);
        }}
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Vista previa de la mascota"
              className={css.previewImg}
            />
            <button
              type="button"
              className={css.changeBtn}
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              Cambiar foto
            </button>
          </>
        ) : (
          <>
            <span className={css.placeholderIcon}>📷</span>
            <span className={css.placeholderText}>
              Hacé clic o arrastrá una foto de la mascota acá
            </span>
            <span className={css.changeBtn}>Agregar / modificar foto</span>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className={css.hiddenInput}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
