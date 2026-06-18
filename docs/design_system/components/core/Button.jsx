import React from "react";

const CSS = `
.ds-btn {
  --_h: 36px; --_px: var(--space-4); --_fs: var(--fs-sm);
  display: inline-flex; align-items: center; justify-content: center; gap: var(--space-2);
  height: var(--_h); padding: 0 var(--_px); box-sizing: border-box;
  font-family: var(--font-mono); font-size: var(--_fs); font-weight: var(--fw-medium);
  line-height: 1; letter-spacing: var(--ls-wide); white-space: nowrap;
  border: 1px solid transparent; border-radius: var(--radius-md); cursor: pointer;
  text-decoration: none; user-select: none;
  transition: background var(--dur-fast) var(--ease-standard),
    border-color var(--dur-fast) var(--ease-standard),
    color var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard);
}
.ds-btn:focus-visible { outline: none; box-shadow: var(--ring-accent); }
.ds-btn:disabled, .ds-btn[aria-disabled="true"] { opacity: 0.45; cursor: not-allowed; pointer-events: none; }
.ds-btn__icon { display: inline-flex; width: 1.05em; height: 1.05em; }
.ds-btn__icon svg { width: 100%; height: 100%; }

.ds-btn--sm { --_h: 28px; --_px: var(--space-3); --_fs: var(--fs-xs); }
.ds-btn--lg { --_h: 44px; --_px: var(--space-5); --_fs: var(--fs-base); }

.ds-btn--primary { background: var(--accent); color: var(--accent-text); border-color: var(--accent); }
.ds-btn--primary:hover { background: var(--accent-hover); border-color: var(--accent-hover); }
.ds-btn--primary:active { background: var(--accent-active); border-color: var(--accent-active); transform: translateY(1px); }

.ds-btn--secondary { background: var(--surface-2); color: var(--text-strong); border-color: var(--border-default); }
.ds-btn--secondary:hover { background: var(--surface-3); border-color: var(--border-strong); }
.ds-btn--secondary:active { transform: translateY(1px); }

.ds-btn--ghost { background: transparent; color: var(--text-body); border-color: transparent; }
.ds-btn--ghost:hover { background: var(--surface-2); color: var(--text-strong); }

.ds-btn--terminal { background: var(--bg-terminal); color: var(--term-green); border-color: hsl(319 40% 30% / 0.6); }
.ds-btn--terminal:hover { border-color: var(--term-green); box-shadow: var(--glow-terminal); }

.ds-btn--danger { background: var(--danger); color: hsl(0 60% 8%); border-color: var(--danger); }
.ds-btn--danger:hover { filter: brightness(1.08); }
.ds-btn--danger:active { transform: translateY(1px); }
`;

let injected = false;
function ensureStyles() {
  if (typeof document === "undefined" || injected) return;
  const el = document.createElement("style");
  el.setAttribute("data-ds", "button");
  el.textContent = CSS;
  document.head.appendChild(el);
  injected = true;
}

/**
 * Primary action button. Mono label, Ubuntu-orange primary.
 */
export function Button({
  variant = "primary",
  size = "md",
  icon = null,
  iconRight = null,
  as = "button",
  className = "",
  children,
  ...rest
}) {
  ensureStyles();
  const Tag = as;
  const cls = ["ds-btn", `ds-btn--${variant}`, `ds-btn--${size}`, className]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag className={cls} {...rest}>
      {icon ? <span className="ds-btn__icon">{icon}</span> : null}
      {children}
      {iconRight ? <span className="ds-btn__icon">{iconRight}</span> : null}
    </Tag>
  );
}
