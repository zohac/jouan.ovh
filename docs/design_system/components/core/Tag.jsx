import React from "react";

const CSS = `
.ds-tag {
  display: inline-flex; align-items: center; gap: var(--space-2);
  height: 26px; padding: 0 var(--space-3);
  font-family: var(--font-mono); font-size: var(--fs-xs); font-weight: var(--fw-regular);
  line-height: 1; white-space: nowrap; color: var(--text-body);
  background: var(--surface-2); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-pill); box-sizing: border-box;
  transition: border-color var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard);
}
.ds-tag::before { content: "#"; color: var(--accent); }
.ds-tag--plain::before { content: ""; }
.ds-tag--clickable { cursor: pointer; }
.ds-tag--clickable:hover { border-color: var(--border-strong); color: var(--text-strong); }
.ds-tag__remove {
  display: inline-flex; align-items: center; justify-content: center;
  width: 14px; height: 14px; margin-right: -2px; border: none; background: none; padding: 0;
  color: var(--text-muted); cursor: pointer; font-family: var(--font-mono); font-size: var(--fs-sm);
  line-height: 1; border-radius: var(--radius-circle);
}
.ds-tag__remove:hover { color: var(--term-red); }
`;

let injected = false;
function ensureStyles() {
  if (typeof document === "undefined" || injected) return;
  const el = document.createElement("style");
  el.setAttribute("data-ds", "tag");
  el.textContent = CSS;
  document.head.appendChild(el);
  injected = true;
}

/**
 * Technology / topic chip. Renders a leading "#" by default.
 */
export function Tag({ hash = true, onRemove, onClick, className = "", children, ...rest }) {
  ensureStyles();
  const cls = [
    "ds-tag",
    hash ? "" : "ds-tag--plain",
    onClick ? "ds-tag--clickable" : "",
    className,
  ].filter(Boolean).join(" ");
  return (
    <span className={cls} onClick={onClick} {...rest}>
      {children}
      {onRemove ? (
        <button className="ds-tag__remove" onClick={(e) => { e.stopPropagation(); onRemove(e); }} aria-label="Retirer">×</button>
      ) : null}
    </span>
  );
}
