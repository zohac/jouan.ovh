import * as React from "react";

/**
 * Primary action button for jouan.ovh — mono label, Ubuntu-orange primary.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. @default "primary" */
  variant?: "primary" | "secondary" | "ghost" | "terminal" | "danger";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Leading icon (inline SVG element). */
  icon?: React.ReactNode;
  /** Trailing icon. */
  iconRight?: React.ReactNode;
  /** Render as a different element, e.g. "a". @default "button" */
  as?: any;
  className?: string;
  children?: React.ReactNode;
}

export function Button(props: ButtonProps): JSX.Element;
