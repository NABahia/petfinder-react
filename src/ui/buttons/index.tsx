import React from "react";
import css from "./index.css";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export function MainButton({
  children,
  className = "",
  type = "submit",
  ...rest
}: ButtonProps) {
  const classes = `${css.base} ${css.main} ${className}`.trim();
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = `${css.base} ${css.secondary} ${className}`.trim();
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}

export function DarkButton({
  children,
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = `${css.base} ${css.dark} ${className}`.trim();
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}

export function SuccessButton({
  children,
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = `${css.base} ${css.success} ${className}`.trim();
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}

export function OutlineButton({
  children,
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = `${css.base} ${css.outline} ${className}`.trim();
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
