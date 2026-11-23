import React from "react";
import css from "./index.css";

type TextProps = {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
  accent?: boolean;
};

function buildClasses(
  base: string,
  centered?: boolean,
  accent?: boolean,
  extra?: string
) {
  return [
    base,
    centered ? css.centered : "",
    accent ? css.accent : "",
    extra || "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function Title({ children, className, centered, accent }: TextProps) {
  return (
    <h1 className={buildClasses(css.title, centered, accent, className)}>
      {children}
    </h1>
  );
}

export function Subtitle({ children, className, centered, accent }: TextProps) {
  return (
    <h2 className={buildClasses(css.subtitle, centered, accent, className)}>
      {children}
    </h2>
  );
}

export function Body({ children, className, centered, accent }: TextProps) {
  return (
    <p className={buildClasses(css.body, centered, accent, className)}>
      {children}
    </p>
  );
}

export function Caption({ children, className, centered, accent }: TextProps) {
  return (
    <span className={buildClasses(css.caption, centered, accent, className)}>
      {children}
    </span>
  );
}
