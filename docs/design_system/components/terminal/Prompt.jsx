import React from "react";

const CSS = `
.ds-prompt { font-family: var(--font-mono); font-size: var(--fs-sm); line-height: var(--lh-snug); }
.ds-prompt__user { color: var(--prompt); font-weight: var(--fw-bold); }
.ds-prompt__sep { color: var(--ink-1); }
.ds-prompt__dir { color: var(--term-blue); font-weight: var(--fw-bold); }
.ds-prompt__cmd { color: var(--ink-1); }
.ds-prompt__caret {
  display: inline-block; width: 0.55em; height: 1.05em; margin-left: 1px;
  background: var(--prompt); vertical-align: text-bottom;
  animation: caret-blink 1s steps(1) infinite;
}
@media (prefers-reduced-motion: reduce) { .ds-prompt__caret { animation: none; } }
`;

let injected = false;
function ensureStyles() {
  if (typeof document === "undefined" || injected) return;
  const el = document.createElement("style");
  el.setAttribute("data-ds", "prompt");
  el.textContent = CSS;
  document.head.appendChild(el);
  injected = true;
}

/**
 * A shell prompt line: user@host:dir$ command — with the heritage colours.
 */
export function Prompt({
  user = "anon.",
  host = "jouan.ovh",
  dir = "~",
  command = "",
  caret = false,
  className = "",
  ...rest
}) {
  ensureStyles();
  const cls = ["ds-prompt", className].filter(Boolean).join(" ");
  return (
    <span className={cls} {...rest}>
      <span className="ds-prompt__user">{user}@{host}</span>
      <span className="ds-prompt__sep">:</span>
      <span className="ds-prompt__dir">{dir}</span>
      <span className="ds-prompt__sep">$ </span>
      <span className="ds-prompt__cmd">{command}</span>
      {caret ? <span className="ds-prompt__caret" /> : null}
    </span>
  );
}
