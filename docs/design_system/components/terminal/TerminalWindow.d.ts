import * as React from "react";

/**
 * Signature terminal window chrome — Ubuntu title bar + aubergine blurred body.
 */
export interface TerminalWindowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Centred title-bar text. @default "anon.@jouan.ovh: ~" */
  title?: string;
  /** Body height (px number or CSS string). @default 320 */
  height?: number | string;
  /** Show the close/min/max gems. @default true */
  buttons?: boolean;
  /** Close handler for the red gem. */
  onClose?: (e: React.MouseEvent) => void;
  className?: string;
  children?: React.ReactNode;
}

export function TerminalWindow(props: TerminalWindowProps): JSX.Element;
