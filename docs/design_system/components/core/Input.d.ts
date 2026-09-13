import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement & HTMLTextAreaElement> {
  /** Uppercase mono label above the control. */
  label?: string;
  /** Helper or error text below. */
  hint?: string;
  /** Error styling. @default false */
  error?: boolean;
  /** Append an orange * to the label. @default false */
  required?: boolean;
  /** Render a textarea instead of input. @default false */
  multiline?: boolean;
  /** Leading inline-SVG icon (input only). */
  icon?: React.ReactNode;
  className?: string;
}

/** Labelled text field / textarea — Ubuntu-sans value, mono label, orange focus ring. */
export function Input(props: InputProps): JSX.Element;
