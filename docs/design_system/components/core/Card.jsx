import React from "react";

const CSS = `
.ds-card {
  position: relative; background: var(--bg-card); color: var(--text-body);
  border: 1px solid var(--border-subtle); border-radius: var(--radius-md);
  box-shadow: var(--shadow-2), var(--shadow-hairline); overflow: hidden;
  transition: border-color var(--dur-base) var(--ease-standard),
    transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-standard);
}
.ds-card--pad { padding: var(--space-6); }
.ds-card--interactive { cursor: pointer; }
.ds-card--interactive:hover {
  border-color: var(--border-strong); transform: translateY(-2px);
  box-shadow: var(--shadow-3), var(--shadow-hairline);
}
.ds-card--accent::before {
  content: ""; position: absolute; inset: 0 0 auto 0; height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
}
.ds-card--featured { border-color: hsl(24 94% 53% / 0.35); box-shadow: var(--glow-accent), var(--shadow-hairline); }
`;

let injected = false;
function ensureStyles() {
  if (typeof document === "undefined" || injected) return;
  const el = document.createElement("style");
  el.setAttribute("data-ds", "card");
  el.textContent = CSS;
  document.head.appendChild(el);
  injected = true;
}

/**
 * Surface container — quiet by default; content is the hero.
 */
export function Card({
  interactive = false,
  accent = false,
  featured = false,
  padded = true,
  as = "div",
  className = "",
  children,
  ...rest
}) {
  ensureStyles();
  const Tag = as;
  const cls = [
    "ds-card",
    padded ? "ds-card--pad" : "",
    interactive ? "ds-card--interactive" : "",
    accent ? "ds-card--accent" : "",
    featured ? "ds-card--featured" : "",
    className,
  ].filter(Boolean).join(" ");
  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  );
}
