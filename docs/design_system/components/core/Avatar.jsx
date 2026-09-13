import React from "react";

const CSS = `
.ds-avatar {
  display: inline-flex; align-items: center; justify-content: center;
  width: var(--_sz, 44px); height: var(--_sz, 44px); flex: none;
  border-radius: var(--radius-circle); overflow: hidden; position: relative;
  background: var(--surface-3); color: var(--text-strong);
  font-family: var(--font-mono); font-weight: var(--fw-bold); font-size: calc(var(--_sz, 44px) * 0.4);
  border: 1px solid var(--border-default); box-sizing: border-box;
}
.ds-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ds-avatar--ring { box-shadow: 0 0 0 2px var(--bg-page), 0 0 0 4px var(--accent); }
.ds-avatar--sm { --_sz: 32px; }
.ds-avatar--md { --_sz: 44px; }
.ds-avatar--lg { --_sz: 64px; }
.ds-avatar--xl { --_sz: 96px; }
`;

let injected = false;
function ensureStyles() {
  if (typeof document === "undefined" || injected) return;
  const el = document.createElement("style");
  el.setAttribute("data-ds", "avatar");
  el.textContent = CSS;
  document.head.appendChild(el);
  injected = true;
}

/**
 * Round avatar — image or initials, optional accent ring.
 */
export function Avatar({
  src,
  alt = "",
  initials,
  size = "md",
  ring = false,
  className = "",
  ...rest
}) {
  ensureStyles();
  const cls = [
    "ds-avatar",
    `ds-avatar--${size}`,
    ring ? "ds-avatar--ring" : "",
    className,
  ].filter(Boolean).join(" ");
  return (
    <span className={cls} {...rest}>
      {src ? <img src={src} alt={alt} /> : (initials || "?")}
    </span>
  );
}
