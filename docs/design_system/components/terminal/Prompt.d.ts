import * as React from "react";

export interface PromptProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "anon." */
  user?: string;
  /** @default "jouan.ovh" */
  host?: string;
  /** Current directory. @default "~" */
  dir?: string;
  /** Command text shown after the $. */
  command?: string;
  /** Show a blinking caret after the command. @default false */
  caret?: boolean;
  className?: string;
}

/** Heritage shell prompt: green user@host, blue dir, blinking caret. */
export function Prompt(props: PromptProps): JSX.Element;
