import * as React from "react";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Show the leading "#". @default true */
  hash?: boolean;
  /** When provided, renders a × remove button. */
  onRemove?: (e: React.MouseEvent) => void;
  className?: string;
  children?: React.ReactNode;
}

/** Pill-shaped technology / topic chip with a mono "#" prefix. */
export function Tag(props: TagProps): JSX.Element;
