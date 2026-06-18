import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Colour tone. @default "neutral" */
  tone?: "neutral" | "accent" | "success" | "warning" | "danger" | "info";
  /** Show a leading status dot. @default false */
  dot?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/** Small status / category label in the terminal/syntax palette. */
export function Badge(props: BadgeProps): JSX.Element;
