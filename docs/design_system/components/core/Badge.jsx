import React from "react";

const CSS = `
.ds-badge {
  display: inline-flex; align-items: center; gap: var(--space-2);
  height: 22px; padding: 0 var(--space-2);
  font-family: var(--font-mono); font-size: var(--fs-xs); font-weight: var(--fw-medium);
  letter-spacing: var(--ls-wide); line-height: 1; white-space: nowrap;
  border: 1px solid transparent; border-radius: var(--radius-sm); box-sizing: border-box;
}
.ds-badge__dot { width: 6px; height: 6px; border-radius: var(--radius-circle); background: currentColor; }
.ds-badge--neutral { background: var(--surface-3); color: var(--text-body); border-color: var(--border-default); }
.ds-badge--accent { background: var(--accent-soft); color: var(--accent); border-color: hsl(24 94% 53% / 0.3); }
.ds-badge--success { background: var(--success-soft); color: var(--success); border-color: hsl(143 50% 32% / 0.5); }
.ds-badge--warning { background: var(--warning-soft); color: var(--warning); border-color: hsl(38 70% 32% / 0.5); }
.ds-badge--danger { background: var(--danger-soft); color: var(--danger); border-color: hsl(0 55% 35% / 0.5); }
.ds-badge--info { background: var(--info-soft); color: var(--info); border-color: hsl(204 55% 32% / 0.5); }
`;

let injected = false;
function ensureStyles() {
  if (typeof document === "undefined" || injected) return;
  const el = document.createElement("style");
  el.setAttribute("data-ds", "badge");
  el.textContent = CSS;
  document.head.appendChild(el);
  injected = true;
}

/**
 * Small status / category label.
 */
export function Badge({ tone = "neutral", dot = false, className = "", children, ...rest }) {
  ensureStyles();
  const cls = ["ds-badge", `ds-badge--${tone}`, className].filter(Boolean).join(" ");
  return (
    <span className={cls} {...rest}>
      {dot ? <span className="ds-badge__dot" /> : null}
      {children}
    </span>
  );
}
