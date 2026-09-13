import React from "react";

const CSS = `
.ds-field { display: flex; flex-direction: column; gap: var(--space-2); }
.ds-field__label {
  font-family: var(--font-mono); font-size: var(--fs-xs); letter-spacing: var(--ls-wider);
  text-transform: uppercase; color: var(--text-muted);
}
.ds-field__label .ds-field__req { color: var(--accent); margin-left: 2px; }
.ds-input, .ds-textarea {
  width: 100%; box-sizing: border-box; font-family: var(--font-sans); font-size: var(--fs-base);
  color: var(--text-strong); background: var(--bg-input); border: 1px solid var(--border-default);
  border-radius: var(--radius-md); padding: 0 var(--space-3); height: 42px;
  transition: border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard);
}
.ds-textarea { height: auto; padding: var(--space-3); min-height: 110px; resize: vertical; line-height: var(--lh-normal); }
.ds-input::placeholder, .ds-textarea::placeholder { color: var(--text-faint); }
.ds-input:hover, .ds-textarea:hover { border-color: var(--border-strong); }
.ds-input:focus, .ds-textarea:focus { outline: none; border-color: var(--accent); box-shadow: var(--ring-accent); }
.ds-field--error .ds-input, .ds-field--error .ds-textarea { border-color: var(--danger); }
.ds-field__hint { font-family: var(--font-mono); font-size: var(--fs-xs); color: var(--text-muted); }
.ds-field--error .ds-field__hint { color: var(--danger); }
.ds-input__prefix { display: inline-flex; align-items: center; }
.ds-input__wrap { position: relative; display: flex; align-items: center; }
.ds-input__wrap .ds-input { padding-left: calc(var(--space-3) + 1.4em); }
.ds-input__icon { position: absolute; left: var(--space-3); color: var(--text-muted); width: 1.05em; height: 1.05em; display: inline-flex; }
.ds-input__icon svg { width: 100%; height: 100%; }
`;

let injected = false;
function ensureStyles() {
  if (typeof document === "undefined" || injected) return;
  const el = document.createElement("style");
  el.setAttribute("data-ds", "input");
  el.textContent = CSS;
  document.head.appendChild(el);
  injected = true;
}

/**
 * Labelled text field / textarea with hint + error states.
 */
export function Input({
  label,
  hint,
  error = false,
  required = false,
  multiline = false,
  icon = null,
  id,
  className = "",
  ...rest
}) {
  ensureStyles();
  const fieldId = id || (label ? `f-${String(label).toLowerCase().replace(/\s+/g, "-")}` : undefined);
  const cls = ["ds-field", error ? "ds-field--error" : "", className].filter(Boolean).join(" ");
  const control = multiline ? (
    <textarea id={fieldId} className="ds-textarea" {...rest} />
  ) : icon ? (
    <span className="ds-input__wrap">
      <span className="ds-input__icon">{icon}</span>
      <input id={fieldId} className="ds-input" {...rest} />
    </span>
  ) : (
    <input id={fieldId} className="ds-input" {...rest} />
  );
  return (
    <div className={cls}>
      {label ? (
        <label className="ds-field__label" htmlFor={fieldId}>
          {label}{required ? <span className="ds-field__req">*</span> : null}
        </label>
      ) : null}
      {control}
      {hint ? <span className="ds-field__hint">{hint}</span> : null}
    </div>
  );
}
