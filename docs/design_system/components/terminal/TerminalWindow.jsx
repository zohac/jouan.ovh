import React from "react";

const CSS = `
.ds-term {
  display: flex; flex-direction: column; overflow: hidden;
  border-radius: var(--radius-sm); border: 1px solid hsl(319 40% 30% / 0.4);
  box-shadow: var(--glow-terminal); max-width: 100%;
}
.ds-term__bar {
  display: flex; align-items: center; gap: var(--space-2);
  height: 30px; padding: 0 var(--space-3); flex: none;
  background: var(--aubergine-black); position: relative;
}
.ds-term__btns { display: flex; align-items: center; gap: 7px; }
.ds-term__dot { width: 13px; height: 13px; border-radius: var(--radius-circle); }
.ds-term__dot--close { background-image: linear-gradient(to bottom right, var(--term-red), hsl(0 100% 27%));
  box-shadow: 1px 1px 2px hsl(320 60% 2%); cursor: pointer; }
.ds-term__dot--min { background: hsl(48 89% 50%); opacity: 0.85; }
.ds-term__dot--max { background: hsl(143 60% 45%); opacity: 0.85; }
.ds-term__title {
  position: absolute; left: 0; right: 0; text-align: center; pointer-events: none;
  font-family: var(--font-mono); font-size: var(--fs-xs); color: var(--text-muted);
  letter-spacing: var(--ls-wide);
}
.ds-term__body {
  flex: 1; min-height: 0; overflow: auto; padding: var(--space-4);
  background: var(--bg-terminal); color: var(--ink-1);
  font-family: var(--font-mono); font-size: var(--fs-sm); line-height: var(--lh-snug);
  white-space: pre-wrap; word-break: break-word;
}
@supports (backdrop-filter: blur(5px)) {
  .ds-term__body { background: hsl(319 100% 9% / 0.86); backdrop-filter: blur(5px); }
}
.ds-term__body::-webkit-scrollbar { width: 10px; }
.ds-term__body::-webkit-scrollbar-thumb { background: hsl(319 30% 30%); border-radius: var(--radius-pill); }
`;

let injected = false;
function ensureStyles() {
  if (typeof document === "undefined" || injected) return;
  const el = document.createElement("style");
  el.setAttribute("data-ds", "terminal-window");
  el.textContent = CSS;
  document.head.appendChild(el);
  injected = true;
}

/**
 * The signature terminal window chrome — Ubuntu-style title bar with a red
 * close gem, centred title, and an aubergine, blurred body.
 */
export function TerminalWindow({
  title = "anon.@jouan.ovh: ~",
  height = 320,
  buttons = true,
  onClose,
  className = "",
  style = {},
  children,
  ...rest
}) {
  ensureStyles();
  const cls = ["ds-term", className].filter(Boolean).join(" ");
  return (
    <div className={cls} style={{ height: typeof height === "number" ? `${height}px` : height, ...style }} {...rest}>
      <div className="ds-term__bar">
        {buttons ? (
          <div className="ds-term__btns">
            <span className="ds-term__dot ds-term__dot--close" onClick={onClose} role="button" aria-label="Fermer" />
            <span className="ds-term__dot ds-term__dot--min" />
            <span className="ds-term__dot ds-term__dot--max" />
          </div>
        ) : null}
        <span className="ds-term__title">{title}</span>
      </div>
      <div className="ds-term__body">{children}</div>
    </div>
  );
}
