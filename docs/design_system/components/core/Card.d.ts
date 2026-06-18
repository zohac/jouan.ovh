import * as React from "react";

/**
 * Surface container — card background, hairline border, soft dark shadow.
 */
export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** Hover lift + brighter border. @default false */
  interactive?: boolean;
  /** Orange→aubergine accent bar across the top. @default false */
  accent?: boolean;
  /** Orange glow ring for the highlighted offer. @default false */
  featured?: boolean;
  /** Built-in padding. @default true */
  padded?: boolean;
  as?: any;
  className?: string;
  children?: React.ReactNode;
}

export function Card(props: CardProps): JSX.Element;
