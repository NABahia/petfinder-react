import React from "react";
import css from "./index.css";

export type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

export function TextField({
  label,
  hint,
  className = "",
  type = "text",
  id,
  ...rest
}: TextFieldProps) {
  const inputClasses = className ? `${css.input} ${className}` : css.input;

  return (
    <div className={css.wrapper}>
      {label && (
        <label htmlFor={id} className={css.label}>
          {label}
        </label>
      )}
      <input id={id} type={type} className={inputClasses} {...rest} />
      {hint && <span className={css.hint}>{hint}</span>}
    </div>
  );
}
