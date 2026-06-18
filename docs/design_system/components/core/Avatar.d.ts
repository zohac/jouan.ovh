import * as React from "react";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Image URL. Falls back to initials when omitted. */
  src?: string;
  alt?: string;
  /** Initials shown when there's no image. */
  initials?: string;
  /** @default "md" */
  size?: "sm" | "md" | "lg" | "xl";
  /** Orange accent ring. @default false */
  ring?: boolean;
  className?: string;
}

/** Round avatar — image or initials, optional accent ring. */
export function Avatar(props: AvatarProps): JSX.Element;
