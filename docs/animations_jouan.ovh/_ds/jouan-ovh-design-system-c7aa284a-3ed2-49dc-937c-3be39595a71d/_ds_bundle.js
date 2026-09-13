/* @ds-bundle: {"format":3,"namespace":"JouanOvhDesignSystem_c7aa28","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Prompt","sourcePath":"components/terminal/Prompt.jsx"},{"name":"TerminalWindow","sourcePath":"components/terminal/TerminalWindow.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"88a475ace770","components/core/Badge.jsx":"3baa8d037256","components/core/Button.jsx":"f3aa50fa4e08","components/core/Card.jsx":"f5a7ed52c00a","components/core/Input.jsx":"518201db5071","components/core/Tag.jsx":"fe19ad3a5e67","components/terminal/Prompt.jsx":"cf368b942fbb","components/terminal/TerminalWindow.jsx":"d8ad74c96e9b","ui_kits/jouan-site/About.jsx":"1ecc9a7c7177","ui_kits/jouan-site/App.jsx":"22e1f58509df","ui_kits/jouan-site/Blog.jsx":"13b08b6ba05c","ui_kits/jouan-site/Contact.jsx":"622a6e547a0a","ui_kits/jouan-site/Footer.jsx":"32cbb13d7347","ui_kits/jouan-site/Header.jsx":"f50c548df873","ui_kits/jouan-site/Home.jsx":"cf1e2ce383b6","ui_kits/jouan-site/Services.jsx":"9983d0904485","ui_kits/jouan-site/TerminalScreen.jsx":"fc436139a76e","ui_kits/jouan-site/data.js":"6d58db02629f","ui_kits/jouan-site/icons.jsx":"6ee1d95c1c2f"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.JouanOvhDesignSystem_c7aa28 = window.JouanOvhDesignSystem_c7aa28 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Avatar({
  src,
  alt = "",
  initials,
  size = "md",
  ring = false,
  className = "",
  ...rest
}) {
  ensureStyles();
  const cls = ["ds-avatar", `ds-avatar--${size}`, ring ? "ds-avatar--ring" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt
  }) : initials || "?");
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Badge({
  tone = "neutral",
  dot = false,
  className = "",
  children,
  ...rest
}) {
  ensureStyles();
  const cls = ["ds-badge", `ds-badge--${tone}`, className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), dot ? /*#__PURE__*/React.createElement("span", {
    className: "ds-badge__dot"
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Button({
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
  const cls = ["ds-btn", `ds-btn--${variant}`, `ds-btn--${size}`, className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, rest), icon ? /*#__PURE__*/React.createElement("span", {
    className: "ds-btn__icon"
  }, icon) : null, children, iconRight ? /*#__PURE__*/React.createElement("span", {
    className: "ds-btn__icon"
  }, iconRight) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Card({
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
  const cls = ["ds-card", padded ? "ds-card--pad" : "", interactive ? "ds-card--interactive" : "", accent ? "ds-card--accent" : "", featured ? "ds-card--featured" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Input({
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
  const control = multiline ? /*#__PURE__*/React.createElement("textarea", _extends({
    id: fieldId,
    className: "ds-textarea"
  }, rest)) : icon ? /*#__PURE__*/React.createElement("span", {
    className: "ds-input__wrap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-input__icon"
  }, icon), /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    className: "ds-input"
  }, rest))) : /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    className: "ds-input"
  }, rest));
  return /*#__PURE__*/React.createElement("div", {
    className: cls
  }, label ? /*#__PURE__*/React.createElement("label", {
    className: "ds-field__label",
    htmlFor: fieldId
  }, label, required ? /*#__PURE__*/React.createElement("span", {
    className: "ds-field__req"
  }, "*") : null) : null, control, hint ? /*#__PURE__*/React.createElement("span", {
    className: "ds-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Tag({
  hash = true,
  onRemove,
  onClick,
  className = "",
  children,
  ...rest
}) {
  ensureStyles();
  const cls = ["ds-tag", hash ? "" : "ds-tag--plain", onClick ? "ds-tag--clickable" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls,
    onClick: onClick
  }, rest), children, onRemove ? /*#__PURE__*/React.createElement("button", {
    className: "ds-tag__remove",
    onClick: e => {
      e.stopPropagation();
      onRemove(e);
    },
    "aria-label": "Retirer"
  }, "\xD7") : null);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/terminal/Prompt.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Prompt({
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
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "ds-prompt__user"
  }, user, "@", host), /*#__PURE__*/React.createElement("span", {
    className: "ds-prompt__sep"
  }, ":"), /*#__PURE__*/React.createElement("span", {
    className: "ds-prompt__dir"
  }, dir), /*#__PURE__*/React.createElement("span", {
    className: "ds-prompt__sep"
  }, "$ "), /*#__PURE__*/React.createElement("span", {
    className: "ds-prompt__cmd"
  }, command), caret ? /*#__PURE__*/React.createElement("span", {
    className: "ds-prompt__caret"
  }) : null);
}
Object.assign(__ds_scope, { Prompt });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/terminal/Prompt.jsx", error: String((e && e.message) || e) }); }

// components/terminal/TerminalWindow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function TerminalWindow({
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
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls,
    style: {
      height: typeof height === "number" ? `${height}px` : height,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "ds-term__bar"
  }, buttons ? /*#__PURE__*/React.createElement("div", {
    className: "ds-term__btns"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-term__dot ds-term__dot--close",
    onClick: onClose,
    role: "button",
    "aria-label": "Fermer"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ds-term__dot ds-term__dot--min"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ds-term__dot ds-term__dot--max"
  })) : null, /*#__PURE__*/React.createElement("span", {
    className: "ds-term__title"
  }, title)), /*#__PURE__*/React.createElement("div", {
    className: "ds-term__body"
  }, children));
}
Object.assign(__ds_scope, { TerminalWindow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/terminal/TerminalWindow.jsx", error: String((e && e.message) || e) }); }

// ui_kits/jouan-site/About.jsx
try { (() => {
const {
  Card,
  Tag,
  Avatar,
  Button
} = window.JouanOvhDesignSystem_c7aa28;
function About({
  go
}) {
  const S = window.SITE;
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid-2",
    style: {
      gridTemplateColumns: "0.8fr 1.2fr",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Avatar, {
    src: "../../assets/brand/portrait.jpeg",
    alt: S.name,
    size: "xl",
    ring: true
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "var(--fs-3xl)",
      margin: "var(--space-5) 0 var(--space-1)"
    }
  }, S.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-mono)",
      color: "var(--accent)",
      fontSize: "var(--fs-sm)"
    }
  }, S.role), /*#__PURE__*/React.createElement("p", {
    className: "prose",
    style: {
      marginTop: "var(--space-4)",
      color: "var(--text-muted)",
      fontSize: "var(--fs-sm)"
    }
  }, /*#__PURE__*/React.createElement(window.Icon.pin, null), " ", S.city), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-5)",
      display: "flex",
      gap: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: () => go("contact")
  }, "Me contacter"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    as: "a",
    href: "mailto:" + S.email
  }, "CV"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "// \xE0 propos"), /*#__PURE__*/React.createElement("p", {
    className: "prose",
    style: {
      fontSize: "var(--fs-md)"
    }
  }, "D\xE9veloppeur web freelance, je viens d'un parcours technique (m\xE9trologie, instrumentation) avant de basculer dans le code. Aujourd'hui je con\xE7ois des applications en ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--text-strong)"
    }
  }, "PHP/Symfony"), ", des sites ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--text-strong)"
    }
  }, "WordPress"), " sur-mesure, et des produits en ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--text-strong)"
    }
  }, "Node.js / Nest.js / Nuxt.js"), "."), /*#__PURE__*/React.createElement("p", {
    className: "prose",
    style: {
      fontSize: "var(--fs-md)"
    }
  }, "Je suis aussi fondateur du SaaS ", /*#__PURE__*/React.createElement("a", {
    href: "https://keova.app",
    target: "_blank",
    rel: "noreferrer"
  }, "keova.app"), ", et j'aime mettre l'IA au service du code \u2014 agents, automatisations, int\xE9grations LLM."), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "var(--space-6) 0"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow eyebrow--muted"
  }, "// stack"), /*#__PURE__*/React.createElement("div", {
    className: "hero__tags"
  }, S.skills.map(t => /*#__PURE__*/React.createElement(Tag, {
    key: t
  }, t)))))))), /*#__PURE__*/React.createElement("section", {
    className: "section section--sunken"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid-2",
    style: {
      gridTemplateColumns: "1.4fr 0.6fr",
      gap: "var(--space-12)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "// exp\xE9riences"), /*#__PURE__*/React.createElement("div", {
    className: "tl",
    style: {
      marginTop: "var(--space-5)"
    }
  }, S.experiences.map(e => /*#__PURE__*/React.createElement("div", {
    className: "tl__item",
    key: e.org
  }, /*#__PURE__*/React.createElement("div", {
    className: "tl__date"
  }, e.date), /*#__PURE__*/React.createElement("div", {
    className: "tl__role"
  }, e.role), /*#__PURE__*/React.createElement("div", {
    className: "tl__org"
  }, e.org), /*#__PURE__*/React.createElement("div", {
    className: "tl__desc"
  }, e.desc))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "// formation"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-5)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-5)"
    }
  }, S.degrees.map(d => /*#__PURE__*/React.createElement(Card, {
    key: d.name,
    padded: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "tl__date"
  }, d.date), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      color: "var(--text-strong)",
      fontSize: "var(--fs-sm)",
      margin: "4px 0"
    }
  }, d.name), /*#__PURE__*/React.createElement("div", {
    className: "tl__org"
  }, d.school)))))))));
}
window.About = About;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/jouan-site/About.jsx", error: String((e && e.message) || e) }); }

// ui_kits/jouan-site/App.jsx
try { (() => {
const ACCENTS = {
  orange: {},
  aubergine: {
    "--accent": "hsl(319 55% 60%)",
    "--accent-hover": "hsl(319 62% 68%)",
    "--accent-active": "hsl(319 55% 50%)",
    "--accent-text": "hsl(320 60% 6%)",
    "--accent-soft": "hsl(319 55% 60% / 0.15)",
    "--accent-ring": "hsl(319 55% 60% / 0.45)"
  },
  vert: {
    "--accent": "hsl(143 58% 48%)",
    "--accent-hover": "hsl(143 60% 56%)",
    "--accent-active": "hsl(143 58% 40%)",
    "--accent-text": "hsl(150 60% 6%)",
    "--accent-soft": "hsl(143 58% 48% / 0.15)",
    "--accent-ring": "hsl(143 58% 48% / 0.45)"
  }
};
function Switcher({
  heroVariant,
  setHeroVariant,
  accent,
  setAccent,
  route
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "switcher"
  }, route === "home" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "switcher__lbl"
  }, "Hero"), /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, [["a", "Terminal"], ["b", "Portrait"], ["c", "Statement"]].map(([v, l]) => /*#__PURE__*/React.createElement("button", {
    key: v,
    className: heroVariant === v ? "on" : "",
    onClick: () => setHeroVariant(v)
  }, l)))) : null, /*#__PURE__*/React.createElement("span", {
    className: "switcher__lbl"
  }, "Accent"), /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, [["orange", "Orange"], ["aubergine", "Aubergine"], ["vert", "Vert"]].map(([v, l]) => /*#__PURE__*/React.createElement("button", {
    key: v,
    className: accent === v ? "on" : "",
    onClick: () => setAccent(v)
  }, l))));
}
function App() {
  const [route, setRoute] = React.useState("home");
  const [slug, setSlug] = React.useState(null);
  const [heroVariant, setHeroVariant] = React.useState("a");
  const [accent, setAccent] = React.useState("orange");
  const [termOpen, setTermOpen] = React.useState(false);
  React.useEffect(() => {
    const root = document.documentElement;
    const keys = ["--accent", "--accent-hover", "--accent-active", "--accent-text", "--accent-soft", "--accent-ring"];
    keys.forEach(k => root.style.removeProperty(k));
    Object.entries(ACCENTS[accent]).forEach(([k, v]) => root.style.setProperty(k, v));
  }, [accent]);
  const go = r => {
    setRoute(r);
    window.scrollTo({
      top: 0
    });
  };
  const openArticle = s => {
    setSlug(s);
    go("article");
  };
  const openTerminal = () => setTermOpen(true);
  const screen = () => {
    switch (route) {
      case "services":
        return /*#__PURE__*/React.createElement(window.Services, {
          go: go
        });
      case "about":
        return /*#__PURE__*/React.createElement(window.About, {
          go: go
        });
      case "blog":
        return /*#__PURE__*/React.createElement(window.Blog, {
          go: go,
          openArticle: openArticle
        });
      case "article":
        return /*#__PURE__*/React.createElement(window.Article, {
          go: go,
          slug: slug
        });
      case "contact":
        return /*#__PURE__*/React.createElement(window.Contact, {
          openTerminal: openTerminal
        });
      default:
        return /*#__PURE__*/React.createElement(window.Home, {
          go: go,
          openTerminal: openTerminal,
          heroVariant: heroVariant
        });
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement(window.Header, {
    route: route,
    go: go,
    openTerminal: openTerminal
  }), /*#__PURE__*/React.createElement("div", {
    key: route
  }, screen()), /*#__PURE__*/React.createElement(window.Footer, {
    go: go
  }), /*#__PURE__*/React.createElement("button", {
    className: "term-launch",
    onClick: openTerminal
  }, /*#__PURE__*/React.createElement(window.Icon.terminal, null), " ouvrir le terminal"), termOpen ? /*#__PURE__*/React.createElement(window.TerminalScreen, {
    close: () => setTermOpen(false)
  }) : null, /*#__PURE__*/React.createElement(Switcher, {
    heroVariant: heroVariant,
    setHeroVariant: setHeroVariant,
    accent: accent,
    setAccent: setAccent,
    route: route
  }));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/jouan-site/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/jouan-site/Blog.jsx
try { (() => {
const {
  Card,
  Tag,
  Button,
  Badge
} = window.JouanOvhDesignSystem_c7aa28;
function Blog({
  go,
  openArticle
}) {
  const S = window.SITE;
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "// ~/blog"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "var(--fs-4xl)",
      fontWeight: "var(--fw-light)",
      marginBottom: "var(--space-2)"
    }
  }, "Notes de dev"), /*#__PURE__*/React.createElement("p", {
    className: "prose",
    style: {
      color: "var(--text-muted)",
      marginBottom: "var(--space-10)",
      maxWidth: "56ch"
    }
  }, "WordPress, architecture, IA appliqu\xE9e \u2014 ce que j'apprends en construisant des choses."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-5)"
    }
  }, S.posts.map(p => /*#__PURE__*/React.createElement(Card, {
    key: p.slug,
    interactive: true,
    className: "post",
    onClick: () => openArticle(p.slug)
  }, /*#__PURE__*/React.createElement("img", {
    className: "post__thumb",
    src: p.img,
    alt: ""
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hero__tags",
    style: {
      marginBottom: "var(--space-2)"
    }
  }, p.tags.map(t => /*#__PURE__*/React.createElement(Tag, {
    key: t
  }, t))), /*#__PURE__*/React.createElement("h3", null, p.title), /*#__PURE__*/React.createElement("p", null, p.desc), /*#__PURE__*/React.createElement("div", {
    className: "post__meta"
  }, /*#__PURE__*/React.createElement("span", null, p.date), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, p.read, " de lecture")))))))));
}
function Article({
  go,
  slug
}) {
  const S = window.SITE;
  const p = S.posts.find(x => x.slug === slug) || S.posts[0];
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "article"
  }, /*#__PURE__*/React.createElement("button", {
    className: "hdr__link",
    style: {
      paddingLeft: 0,
      marginBottom: "var(--space-5)"
    },
    onClick: () => go("blog")
  }, "\u2190 Retour au blog"), /*#__PURE__*/React.createElement("div", {
    className: "hero__tags",
    style: {
      marginBottom: "var(--space-4)"
    }
  }, p.tags.map(t => /*#__PURE__*/React.createElement(Tag, {
    key: t
  }, t))), /*#__PURE__*/React.createElement("h1", null, p.title), /*#__PURE__*/React.createElement("div", {
    className: "post__meta",
    style: {
      margin: "var(--space-4) 0 var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "Simon Jouan"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, p.date), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, p.read)), /*#__PURE__*/React.createElement("img", {
    className: "article__hero",
    src: p.img,
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    className: "prose"
  }, /*#__PURE__*/React.createElement("p", null, p.desc), /*#__PURE__*/React.createElement("p", null, "La plupart des int\xE9grations IA \xE9chouent non pas sur le mod\xE8le, mais sur l'architecture autour. On greffe un appel d'API au mauvais endroit, et le site devient lent, fragile et impossible \xE0 maintenir. Voici l'approche que j'applique sur mes projets."), /*#__PURE__*/React.createElement("h2", null, "Garder l'IA hors du chemin critique"), /*#__PURE__*/React.createElement("p", null, "L'id\xE9e centrale : un appel \xE0 un LLM est lent et faillible. Il ne doit jamais bloquer le rendu d'une page. On le d\xE9porte dans une file de traitement, on met en cache agressivement, et on pr\xE9voit toujours un fallback."), /*#__PURE__*/React.createElement("pre", null, /*#__PURE__*/React.createElement("code", null, `// file d'attente plutôt qu'appel synchrone
await queue.push('summarize', {
  postId: post.id,
  prompt: buildPrompt(post),
});
// le résultat arrive via webhook, mis en cache`)), /*#__PURE__*/React.createElement("h2", null, "Mesurer le co\xFBt, toujours"), /*#__PURE__*/React.createElement("p", null, "Chaque appel a un prix. Je logue les tokens par requ\xEAte et je fixe un budget mensuel \u2014 au-del\xE0, le syst\xE8me bascule sur le cache ou d\xE9sactive la fonctionnalit\xE9 proprement. L'IA reste un confort, jamais une d\xE9pendance qui casse le site.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-10)",
      paddingTop: "var(--space-6)",
      borderTop: "1px solid var(--border-subtle)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-sm)",
      color: "var(--text-muted)"
    }
  }, "Un projet en t\xEAte ?"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    iconRight: /*#__PURE__*/React.createElement(window.Icon.arrow, null),
    onClick: () => go("contact")
  }, "D\xE9marrer un projet"))))));
}
window.Blog = Blog;
window.Article = Article;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/jouan-site/Blog.jsx", error: String((e && e.message) || e) }); }

// ui_kits/jouan-site/Contact.jsx
try { (() => {
const {
  Button,
  Input,
  Card,
  Badge
} = window.JouanOvhDesignSystem_c7aa28;
function Contact({
  openTerminal
}) {
  const S = window.SITE;
  const [sent, setSent] = React.useState(false);
  const submit = e => {
    e.preventDefault();
    setSent(true);
  };
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "contact__grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "// contact"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "var(--fs-4xl)",
      fontWeight: "var(--fw-light)",
      marginBottom: "var(--space-3)"
    }
  }, "Parlons de votre projet"), /*#__PURE__*/React.createElement("p", {
    className: "prose",
    style: {
      color: "var(--text-muted)",
      marginBottom: "var(--space-8)",
      maxWidth: "48ch"
    }
  }, "Une id\xE9e, un site \xE0 refaire, une automatisation \xE0 mettre en place ? D\xE9crivez-moi le besoin \u2014 je r\xE9ponds sous 48h."), sent ? /*#__PURE__*/React.createElement(Card, {
    accent: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      color: "var(--term-green)",
      fontSize: "var(--fs-md)",
      marginBottom: "var(--space-2)"
    }
  }, "\u2713 Message envoy\xE9"), /*#__PURE__*/React.createElement("p", {
    className: "prose",
    style: {
      fontSize: "var(--fs-sm)",
      margin: 0
    }
  }, "Merci ! Je vous r\xE9ponds tr\xE8s vite \xE0 votre adresse.")) : /*#__PURE__*/React.createElement("form", {
    className: "contact__form",
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid-2",
    style: {
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Nom",
    placeholder: "Votre nom",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    type: "email",
    placeholder: "vous@exemple.com",
    required: true
  })), /*#__PURE__*/React.createElement(Input, {
    label: "Sujet",
    placeholder: "Site WordPress, application, IA\u2026"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Message",
    multiline: true,
    placeholder: "Parlez-moi de votre projet\u2026",
    required: true
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    type: "submit",
    iconRight: /*#__PURE__*/React.createElement(window.Icon.arrow, null)
  }, "Envoyer le message")))), /*#__PURE__*/React.createElement("div", {
    className: "contact__info"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "infoitem",
    style: {
      marginBottom: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "// email"), /*#__PURE__*/React.createElement("a", {
    className: "v",
    href: "mailto:" + S.email,
    style: {
      color: "var(--term-blue)"
    }
  }, S.email)), /*#__PURE__*/React.createElement("div", {
    className: "infoitem",
    style: {
      marginBottom: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "// localisation"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, S.city)), /*#__PURE__*/React.createElement("div", {
    className: "infoitem"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "// disponibilit\xE9"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    dot: true
  }, "Ouvert aux missions freelance")))), /*#__PURE__*/React.createElement(Card, {
    className: "offer",
    style: {
      background: "var(--bg-terminal)",
      borderColor: "hsl(319 40% 30% / 0.5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-sm)",
      color: "var(--term-green)",
      marginBottom: "var(--space-2)"
    }
  }, "anon.@jouan.ovh:~$ ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-1)"
    }
  }, "./contact")), /*#__PURE__*/React.createElement("p", {
    className: "prose",
    style: {
      fontSize: "var(--fs-sm)",
      color: "var(--text-muted)",
      margin: "0 0 var(--space-3)"
    }
  }, "Vous pr\xE9f\xE9rez la ligne de commande ? Ouvrez le terminal."), /*#__PURE__*/React.createElement(Button, {
    variant: "terminal",
    size: "sm",
    icon: /*#__PURE__*/React.createElement(window.Icon.terminal, null),
    onClick: openTerminal
  }, "Ouvrir le terminal")), /*#__PURE__*/React.createElement("div", {
    className: "hexrow"
  }, S.social.map(s => {
    const G = window.Icon[s.icon];
    return /*#__PURE__*/React.createElement("a", {
      key: s.icon,
      className: "hex",
      href: s.url,
      target: "_blank",
      rel: "noreferrer",
      title: s.label
    }, /*#__PURE__*/React.createElement(G, null));
  })))))));
}
window.Contact = Contact;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/jouan-site/Contact.jsx", error: String((e && e.message) || e) }); }

// ui_kits/jouan-site/Footer.jsx
try { (() => {
function Footer({
  go
}) {
  const S = window.SITE;
  return /*#__PURE__*/React.createElement("footer", {
    className: "ftr"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ftr__in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ftr__col",
    style: {
      maxWidth: "300px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hdr__brand",
    style: {
      marginBottom: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/brand/logo-white.png",
    alt: "",
    style: {
      width: 22,
      height: 22
    }
  }), /*#__PURE__*/React.createElement("b", {
    style: {
      fontFamily: "var(--font-mono)",
      color: "var(--text-strong)",
      fontSize: "var(--fs-md)",
      fontWeight: "var(--fw-bold)"
    }
  }, "jouan.ovh")), /*#__PURE__*/React.createElement("p", {
    className: "prose",
    style: {
      fontSize: "var(--fs-sm)",
      color: "var(--text-muted)",
      margin: 0
    }
  }, S.role, ". ", S.city, ".")), /*#__PURE__*/React.createElement("div", {
    className: "ftr__col"
  }, /*#__PURE__*/React.createElement("h4", null, "// Navigation"), /*#__PURE__*/React.createElement("a", {
    onClick: () => go("home")
  }, "Accueil"), /*#__PURE__*/React.createElement("a", {
    onClick: () => go("services")
  }, "Services"), /*#__PURE__*/React.createElement("a", {
    onClick: () => go("about")
  }, "\xC0 propos"), /*#__PURE__*/React.createElement("a", {
    onClick: () => go("blog")
  }, "Blog"), /*#__PURE__*/React.createElement("a", {
    onClick: () => go("contact")
  }, "Contact")), /*#__PURE__*/React.createElement("div", {
    className: "ftr__col"
  }, /*#__PURE__*/React.createElement("h4", null, "// Projets"), S.projects.map(p => /*#__PURE__*/React.createElement("a", {
    key: p.name,
    href: p.url,
    target: "_blank",
    rel: "noreferrer"
  }, p.name))), /*#__PURE__*/React.createElement("div", {
    className: "ftr__col"
  }, /*#__PURE__*/React.createElement("h4", null, "// R\xE9seaux"), /*#__PURE__*/React.createElement("div", {
    className: "hexrow"
  }, S.social.map(s => {
    const Glyph = window.Icon[s.icon];
    return /*#__PURE__*/React.createElement("a", {
      key: s.icon,
      className: "hex",
      href: s.url,
      target: "_blank",
      rel: "noreferrer",
      title: s.label
    }, /*#__PURE__*/React.createElement(Glyph, null));
  })))), /*#__PURE__*/React.createElement("div", {
    className: "ftr__bottom"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Simon Jouan \u2014 jouan.ovh"), /*#__PURE__*/React.createElement("span", null, "anon.@jouan.ovh:~$ ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--term-green)"
    }
  }, "echo \"merci de votre visite\"")))));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/jouan-site/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/jouan-site/Header.jsx
try { (() => {
const {
  Button,
  Badge,
  Avatar
} = window.JouanOvhDesignSystem_c7aa28;
function Header({
  route,
  go,
  openTerminal
}) {
  const items = [["home", "Accueil"], ["services", "Services"], ["about", "À propos"], ["blog", "Blog"], ["contact", "Contact"]];
  return /*#__PURE__*/React.createElement("header", {
    className: "hdr"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hdr__in container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hdr__brand",
    onClick: () => go("home")
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/brand/logo-white.png",
    alt: ""
  }), /*#__PURE__*/React.createElement("b", null, "jouan.ovh")), /*#__PURE__*/React.createElement("nav", {
    className: "hdr__nav"
  }, items.map(([id, label]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    className: "hdr__link" + (route === id || route === "article" && id === "blog" ? " hdr__link--active" : ""),
    onClick: () => go(id)
  }, label))), /*#__PURE__*/React.createElement("div", {
    className: "hdr__right"
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    dot: true
  }, "Disponible"), /*#__PURE__*/React.createElement(Button, {
    variant: "terminal",
    size: "sm",
    icon: /*#__PURE__*/React.createElement(window.Icon.terminal, null),
    onClick: openTerminal
  }, "Terminal"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    onClick: () => go("contact")
  }, "D\xE9marrer un projet"))));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/jouan-site/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/jouan-site/Home.jsx
try { (() => {
const {
  Button,
  Badge,
  Tag,
  Card,
  Avatar,
  TerminalWindow,
  Prompt
} = window.JouanOvhDesignSystem_c7aa28;
function HeroTerminal({
  go,
  openTerminal
}) {
  const S = window.SITE;
  return /*#__PURE__*/React.createElement("section", {
    className: "hero hero__grad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__in container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "anim"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "// d\xE9veloppeur web freelance"), /*#__PURE__*/React.createElement("h1", null, "Du code ", /*#__PURE__*/React.createElement("em", null, "sur-mesure"), ",", /*#__PURE__*/React.createElement("br", null), "de l'IA ", /*#__PURE__*/React.createElement("em", null, "utile"), "."), /*#__PURE__*/React.createElement("p", {
    className: "hero__sub"
  }, S.tagline), /*#__PURE__*/React.createElement("div", {
    className: "hero__cta"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(window.Icon.arrow, null),
    onClick: () => go("contact")
  }, "D\xE9marrer un projet"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    onClick: () => go("services")
  }, "Voir les services")), /*#__PURE__*/React.createElement("div", {
    className: "hero__tags"
  }, ["php", "symfony", "wordpress", "nest.js", "nuxt.js"].map(t => /*#__PURE__*/React.createElement(Tag, {
    key: t
  }, t)))), /*#__PURE__*/React.createElement("div", {
    className: "anim",
    style: {
      animationDelay: "80ms"
    }
  }, /*#__PURE__*/React.createElement(TerminalWindow, {
    title: "anon.@jouan.ovh: ~",
    height: 300,
    onClose: () => {}
  }, /*#__PURE__*/React.createElement(Prompt, {
    command: "whoami"
  }), "\n", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-1)"
    }
  }, "Simon Jouan \u2014 ", S.role), "\n\n", /*#__PURE__*/React.createElement(Prompt, {
    command: "cat stack.txt"
  }), "\n", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--term-blue)"
    }
  }, "PHP/Symfony \xB7 WordPress \xB7 Node/Nest \xB7 Nuxt"), "\n\n", /*#__PURE__*/React.createElement(Prompt, {
    command: "ls ~/projets"
  }), "\n", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--term-green)"
    }
  }, "keova.app/   patio-conseil.fr/"), "\n\n", /*#__PURE__*/React.createElement("span", {
    onClick: openTerminal,
    style: {
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Prompt, {
    command: "help",
    caret: true
  })))))));
}
function HeroPortrait({
  go
}) {
  const S = window.SITE;
  return /*#__PURE__*/React.createElement("section", {
    className: "hero hero__heritage hero--center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__in container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "anim",
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    src: "../../assets/brand/portrait.jpeg",
    alt: S.name,
    size: "xl",
    ring: true,
    status: true
  }), /*#__PURE__*/React.createElement("p", {
    className: "eyebrow",
    style: {
      marginTop: "var(--space-5)"
    }
  }, "// ", S.role), /*#__PURE__*/React.createElement("h1", {
    style: {
      marginBottom: "var(--space-2)"
    }
  }, S.name), /*#__PURE__*/React.createElement("p", {
    className: "hero__sub"
  }, S.tagline), /*#__PURE__*/React.createElement("div", {
    className: "hero__cta"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(window.Icon.arrow, null),
    onClick: () => go("contact")
  }, "Travaillons ensemble"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    onClick: () => go("about")
  }, "\xC0 propos")), /*#__PURE__*/React.createElement("div", {
    className: "hexrow",
    style: {
      marginTop: "var(--space-6)"
    }
  }, S.social.map(s => {
    const G = window.Icon[s.icon];
    return /*#__PURE__*/React.createElement("a", {
      key: s.icon,
      className: "hex",
      href: s.url,
      target: "_blank",
      rel: "noreferrer"
    }, /*#__PURE__*/React.createElement(G, null));
  })))));
}
function HeroStatement({
  go
}) {
  const S = window.SITE;
  return /*#__PURE__*/React.createElement("section", {
    className: "hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__img",
    style: {
      backgroundImage: "url(../../assets/backgrounds/hacker-den-1.png)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "hero__in container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "anim",
    style: {
      maxWidth: "820px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "// freelance \xB7 PHP \xB7 WordPress \xB7 IA"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "var(--fs-6xl)"
    }
  }, "Je transforme des id\xE9es en ", /*#__PURE__*/React.createElement("em", null, "produits web"), " qui tournent."), /*#__PURE__*/React.createElement("p", {
    className: "hero__sub",
    style: {
      maxWidth: "52ch"
    }
  }, S.tagline), /*#__PURE__*/React.createElement("div", {
    className: "hero__cta"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(window.Icon.arrow, null),
    onClick: () => go("contact")
  }, "D\xE9marrer un projet"), /*#__PURE__*/React.createElement(Button, {
    variant: "terminal",
    size: "lg",
    icon: /*#__PURE__*/React.createElement(window.Icon.terminal, null),
    onClick: () => go("services")
  }, "./services")))));
}
function ServicesPreview({
  go
}) {
  const S = window.SITE;
  return /*#__PURE__*/React.createElement("section", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "// ce que je fais"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "var(--fs-3xl)",
      marginBottom: "var(--space-8)"
    }
  }, "Trois fa\xE7ons de travailler ensemble"), /*#__PURE__*/React.createElement("div", {
    className: "grid-3"
  }, S.services.map(sv => {
    const G = window.Icon[sv.icon];
    return /*#__PURE__*/React.createElement(Card, {
      key: sv.title,
      interactive: true,
      accent: sv.featured,
      featured: sv.featured,
      className: "offer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "offer__icon"
    }, /*#__PURE__*/React.createElement(G, null)), /*#__PURE__*/React.createElement("h3", null, sv.title), /*#__PURE__*/React.createElement("p", null, sv.desc), /*#__PURE__*/React.createElement("a", {
      onClick: () => go("services"),
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: "var(--fs-sm)",
        color: "var(--accent)",
        cursor: "pointer"
      }
    }, "En savoir plus \u2192"));
  }))));
}
function StatsProjects({
  go
}) {
  const S = window.SITE;
  return /*#__PURE__*/React.createElement("section", {
    className: "section section--sunken"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "statrow",
    style: {
      marginBottom: "var(--space-12)"
    }
  }, S.stats.map(s => /*#__PURE__*/React.createElement("div", {
    className: "stat",
    key: s.l
  }, /*#__PURE__*/React.createElement("b", null, s.n), /*#__PURE__*/React.createElement("span", null, s.l)))), /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "// projets s\xE9lectionn\xE9s"), /*#__PURE__*/React.createElement("div", {
    className: "grid-2",
    style: {
      marginTop: "var(--space-5)"
    }
  }, S.projects.map(p => /*#__PURE__*/React.createElement(Card, {
    key: p.name,
    interactive: true,
    as: "a",
    href: p.url,
    target: "_blank"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: "var(--fs-xl)"
    }
  }, p.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-xs)",
      color: "var(--text-muted)"
    }
  }, p.role)), /*#__PURE__*/React.createElement("p", {
    className: "prose",
    style: {
      fontSize: "var(--fs-sm)",
      margin: "var(--space-3) 0 var(--space-4)"
    }
  }, p.desc), /*#__PURE__*/React.createElement("div", {
    className: "hero__tags"
  }, p.tags.map(t => /*#__PURE__*/React.createElement(Tag, {
    key: t
  }, t))))))));
}
function Home({
  go,
  openTerminal,
  heroVariant
}) {
  const Hero = heroVariant === "b" ? HeroPortrait : heroVariant === "c" ? HeroStatement : HeroTerminal;
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Hero, {
    go: go,
    openTerminal: openTerminal
  }), /*#__PURE__*/React.createElement(ServicesPreview, {
    go: go
  }), /*#__PURE__*/React.createElement(StatsProjects, {
    go: go
  }));
}
window.Home = Home;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/jouan-site/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/jouan-site/Services.jsx
try { (() => {
const {
  Button,
  Card,
  Badge
} = window.JouanOvhDesignSystem_c7aa28;
function Services({
  go
}) {
  const S = window.SITE;
  const steps = [["01", "Échange", "On cadre le besoin, le périmètre et le budget — sans jargon inutile."], ["02", "Conception", "Architecture, maquette, et plan de livraison clair."], ["03", "Développement", "Code propre, testé, livré par itérations visibles."], ["04", "Livraison & suivi", "Mise en ligne, documentation, et accompagnement."]];
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "// services"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "var(--fs-4xl)",
      fontWeight: "var(--fw-light)",
      maxWidth: "16ch",
      marginBottom: "var(--space-3)"
    }
  }, "Des prestations claires, pens\xE9es comme des produits."), /*#__PURE__*/React.createElement("p", {
    className: "prose",
    style: {
      maxWidth: "60ch",
      color: "var(--text-muted)",
      marginBottom: "var(--space-10)"
    }
  }, "Du site WordPress \xE0 l'application sur-mesure, en passant par l'IA appliqu\xE9e \u2014 je m'occupe de la technique, vous gardez la main sur votre projet."), /*#__PURE__*/React.createElement("div", {
    className: "grid-3"
  }, S.services.map(sv => {
    const G = window.Icon[sv.icon];
    return /*#__PURE__*/React.createElement(Card, {
      key: sv.title,
      accent: sv.featured,
      featured: sv.featured,
      className: "offer",
      style: {
        display: "flex",
        flexDirection: "column"
      }
    }, sv.featured ? /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: "var(--space-3)"
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "accent"
    }, "Le plus demand\xE9")) : null, /*#__PURE__*/React.createElement("div", {
      className: "offer__icon"
    }, /*#__PURE__*/React.createElement(G, null)), /*#__PURE__*/React.createElement("h3", null, sv.title), /*#__PURE__*/React.createElement("p", null, sv.desc), /*#__PURE__*/React.createElement("ul", null, sv.points.map(p => /*#__PURE__*/React.createElement("li", {
      key: p
    }, p))), /*#__PURE__*/React.createElement("div", {
      className: "offer__price",
      style: {
        marginTop: "auto",
        paddingTop: "var(--space-5)"
      }
    }, /*#__PURE__*/React.createElement("b", null, sv.price)), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "var(--space-4)"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: sv.featured ? "primary" : "secondary",
      onClick: () => go("contact"),
      style: {
        width: "100%"
      }
    }, "Discuter du projet")));
  })))), /*#__PURE__*/React.createElement("section", {
    className: "section section--sunken"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "// comment \xE7a se passe"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "var(--fs-3xl)",
      marginBottom: "var(--space-8)"
    }
  }, "Un d\xE9roul\xE9 simple en quatre temps"), /*#__PURE__*/React.createElement("div", {
    className: "grid-2",
    style: {
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "var(--space-5)"
    }
  }, steps.map(([n, t, d]) => /*#__PURE__*/React.createElement("div", {
    key: n
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-3xl)",
      color: "var(--accent)",
      fontWeight: "var(--fw-light)"
    }
  }, n), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: "var(--fs-lg)",
      margin: "var(--space-2) 0"
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    className: "prose",
    style: {
      fontSize: "var(--fs-sm)",
      color: "var(--text-muted)"
    }
  }, d)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-12)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(window.Icon.arrow, null),
    onClick: () => go("contact")
  }, "Demander un devis")))));
}
window.Services = Services;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/jouan-site/Services.jsx", error: String((e && e.message) || e) }); }

// ui_kits/jouan-site/TerminalScreen.jsx
try { (() => {
const {
  TerminalWindow,
  Prompt
} = window.JouanOvhDesignSystem_c7aa28;
const COMMANDS = {
  help: () => "Commandes disponibles :\n  about     — qui suis-je\n  skills    — ma stack technique\n  projets   — mes projets\n  contact   — comment me joindre\n  clear     — vider le terminal",
  whoami: () => "Simon Jouan — Développeur web freelance",
  about: () => "Développeur web freelance basé à Valognes.\nPHP/Symfony · WordPress · Node.js / Nest.js / Nuxt.js.\nFondateur du SaaS keova.app.",
  skills: () => window.SITE.skills.join("  "),
  projets: () => window.SITE.projects.map(p => `${p.name.padEnd(20)} ${p.role}`).join("\n"),
  contact: () => "email   : simon@jouan.ovh\nville   : Valognes, France\nstatut  : disponible"
};
function TerminalScreen({
  close
}) {
  const [lines, setLines] = React.useState([{
    t: "  /S/  /J/  ·  jouan.ovh",
    c: "var(--accent)"
  }, {
    t: 'Bienvenue. Tapez "help" pour voir les commandes.',
    c: "var(--text-muted)"
  }]);
  const [input, setInput] = React.useState("");
  const bodyRef = React.useRef(null);
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);
  React.useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);
  const run = raw => {
    const cmd = raw.trim();
    if (!cmd) return;
    if (cmd === "clear") {
      setLines([]);
      return;
    }
    const out = COMMANDS[cmd] ? COMMANDS[cmd]() : `Commande inconnue : ${cmd}  (tapez "help")`;
    setLines(l => [...l, {
      prompt: cmd
    }, {
      t: out,
      c: COMMANDS[cmd] ? "var(--ink-1)" : "var(--term-red)"
    }]);
  };
  const onKey = e => {
    if (e.key === "Enter") {
      run(input);
      setInput("");
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "term-modal",
    onMouseDown: e => {
      if (e.target.classList.contains("term-modal")) close();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "term-modal__win"
  }, /*#__PURE__*/React.createElement(TerminalWindow, {
    title: "anon.@jouan.ovh: ~",
    height: 420,
    onClose: close
  }, /*#__PURE__*/React.createElement("div", {
    ref: bodyRef,
    style: {
      height: "100%",
      overflow: "auto"
    },
    onClick: () => inputRef.current && inputRef.current.focus()
  }, lines.map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, ln.prompt ? /*#__PURE__*/React.createElement(Prompt, {
    command: ln.prompt
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: ln.c || "var(--ink-1)"
    }
  }, ln.t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Prompt, null), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    className: "term-input",
    value: input,
    onChange: e => setInput(e.target.value),
    onKeyDown: onKey,
    spellCheck: "false",
    autoComplete: "off"
  }))))));
}
window.TerminalScreen = TerminalScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/jouan-site/TerminalScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/jouan-site/data.js
try { (() => {
/* Shared content for the jouan-site kit (French). Drawn from the
   source site's About program + the user's positioning brief. */

window.SITE = {
  name: "Simon Jouan",
  role: "Développeur web freelance",
  tagline: "Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils.",
  city: "Valognes, France",
  email: "simon@jouan.ovh",
  available: true,
  stats: [{
    n: "8+",
    l: "ans dans la tech"
  }, {
    n: "3",
    l: "stacks maîtrisés"
  }, {
    n: "1",
    l: "SaaS fondé · keova.app"
  }],
  services: [{
    icon: "wp",
    title: "WordPress sur-mesure",
    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
    points: ["Thème sur-mesure (press-wind / Tailwind)", "Plugins & blocs Gutenberg", "Performance & SEO technique"],
    price: "à partir de 1 500 €",
    featured: false
  }, {
    icon: "code",
    title: "Applications web",
    desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.",
    points: ["API REST / GraphQL (Symfony · Nest.js)", "Front Vue / Nuxt", "Tests & CI/CD, qualité QA"],
    price: "sur devis",
    featured: true
  }, {
    icon: "spark",
    title: "IA & automatisation",
    desc: "L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.",
    points: ["Agents & workflows (n8n)", "Intégration d'API LLM", "Automatisation de contenu"],
    price: "sur devis",
    featured: false
  }],
  projects: [{
    name: "keova.app",
    role: "Fondateur · SaaS",
    desc: "Plateforme SaaS que je conçois et opère de bout en bout.",
    tags: ["nest.js", "nuxt", "saas"],
    url: "https://keova.app"
  }, {
    name: "patio-conseil.fr",
    role: "Client",
    desc: "Site et outils pour un cabinet de conseil.",
    tags: ["wordpress", "conseil"],
    url: "https://patio-conseil.fr"
  }],
  experiences: [{
    date: "02/2021 — aujourd'hui",
    org: "Linkizz",
    role: "Testeur QA",
    desc: "Tests automatisés — Node.js, TypeScript, TestCafé."
  }, {
    date: "05/2020 — 12/2021",
    org: "CINS",
    role: "Développeur Full Stack",
    desc: "PHP/MySQL, Symfony 4/5, Drupal, Prestashop, WordPress, Docker."
  }, {
    date: "07/2007 — 05/2019",
    org: "A+ Métrologie / Trescal",
    role: "Métrologue",
    desc: "Technicien métrologue multi-grandeur, suppléant COFRAC électricité-magnétisme."
  }],
  degrees: [{
    date: "2017 — 2018",
    name: "Développeur d'application — PHP / Symfony",
    school: "OpenClassrooms"
  }, {
    date: "1999 — 2001",
    name: "BTS CIRA",
    school: "Lycée A. de Tocqueville, Cherbourg"
  }],
  skills: ["php", "symfony", "wordpress", "node.js", "nest.js", "nuxt.js", "vue", "typescript", "docker", "tailwind", "n8n", "mysql"],
  posts: [{
    slug: "ia-dans-wordpress",
    title: "Intégrer un agent IA dans WordPress proprement",
    desc: "Comment brancher un LLM sur WordPress sans transformer votre site en usine à gaz — architecture, sécurité, et coûts.",
    date: "12 juin 2026",
    read: "8 min",
    tags: ["wordpress", "ia", "architecture"],
    img: "../../assets/backgrounds/hacker-den-1.png"
  }, {
    slug: "nuxt-symfony-archi",
    title: "Nuxt + Symfony : une architecture qui tient la route",
    desc: "Le découpage front/back que j'utilise sur keova.app, et pourquoi la Clean Architecture m'a fait gagner du temps.",
    date: "28 mai 2026",
    read: "11 min",
    tags: ["nuxt", "symfony", "clean-archi"],
    img: "../../assets/backgrounds/hacker-den-2.png"
  }, {
    slug: "n8n-automatisation",
    title: "Automatiser sa veille avec n8n et un peu de code",
    desc: "Un workflow n8n concret pour collecter, résumer et publier — le tout piloté par quelques nœuds et une touche de LLM.",
    date: "9 mai 2026",
    read: "6 min",
    tags: ["n8n", "automatisation", "ia"],
    img: "../../assets/backgrounds/hacker-den-3.png"
  }],
  social: [{
    icon: "github",
    url: "https://github.com/zohac",
    label: "GitHub"
  }, {
    icon: "twitter",
    url: "https://twitter.com/fenrir0680",
    label: "Twitter"
  }, {
    icon: "linkedin",
    url: "https://www.linkedin.com/in/simonjouan/",
    label: "LinkedIn"
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/jouan-site/data.js", error: String((e && e.message) || e) }); }

// ui_kits/jouan-site/icons.jsx
try { (() => {
/* Inline SVG icons for the jouan-site kit.
   Stroke icons = Lucide style (fill:none, stroke:currentColor).
   Brand glyphs (GitHub/LinkedIn/X) = fill, lifted from the source repo. */

const S = ({
  children,
  sw = 2
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: sw,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, children);
const Icon = {
  arrow: () => /*#__PURE__*/React.createElement(S, null, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 5l7 7-7 7"
  })),
  terminal: () => /*#__PURE__*/React.createElement(S, null, /*#__PURE__*/React.createElement("polyline", {
    points: "4 17 10 11 4 5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "19",
    x2: "20",
    y2: "19"
  })),
  code: () => /*#__PURE__*/React.createElement(S, null, /*#__PURE__*/React.createElement("polyline", {
    points: "16 18 22 12 16 6"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "8 6 2 12 8 18"
  })),
  layers: () => /*#__PURE__*/React.createElement(S, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 2 2 7l10 5 10-5-10-5Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m2 17 10 5 10-5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m2 12 10 5 10-5"
  })),
  bot: () => /*#__PURE__*/React.createElement(S, null, /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "8",
    width: "16",
    height: "12",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 4v4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "14",
    r: "1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "15",
    cy: "14",
    r: "1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M2 14h2M20 14h2"
  })),
  spark: () => /*#__PURE__*/React.createElement(S, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 3l1.8 5.6L19.5 10l-5.7 1.4L12 17l-1.8-5.6L4.5 10l5.7-1.4z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 15l.7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9z"
  })),
  mail: () => /*#__PURE__*/React.createElement(S, null, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "4",
    width: "20",
    height: "16",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m22 7-10 5L2 7"
  })),
  pin: () => /*#__PURE__*/React.createElement(S, null, /*#__PURE__*/React.createElement("path", {
    d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "10",
    r: "3"
  })),
  check: () => /*#__PURE__*/React.createElement(S, null, /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  })),
  zap: () => /*#__PURE__*/React.createElement(S, null, /*#__PURE__*/React.createElement("path", {
    d: "M13 2 3 14h9l-1 8 10-12h-9l1-8z"
  })),
  wp: () => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 1.5a8.5 8.5 0 0 1 4.9 1.55h-.34c-.62 0-1.06.54-1.06 1.12 0 .52.3.96.62 1.48.24.42.52.96.52 1.74 0 .54-.2 1.18-.48 2.06l-.64 2.12-2.3-6.84c.38-.02.72-.06.72-.06.34-.04.3-.54-.04-.52 0 0-1.02.08-1.68.08-.62 0-1.66-.08-1.66-.08-.34-.02-.38.5-.04.52 0 0 .32.04.66.06l.96 2.62-1.34 4.02L7.2 7.34c.38-.02.72-.06.72-.06.34-.04.3-.54-.04-.52 0 0-1.02.08-1.68.08-.12 0-.26 0-.4-.01A8.5 8.5 0 0 1 12 3.5zM3.6 8.7l3.7 10.16A8.5 8.5 0 0 1 3.6 8.7zm8.76 3.18 2.34 6.4c.02.04.04.08.06.1a8.5 8.5 0 0 1-5.04.16l2.64-6.66zm5.96-3.4a8.5 8.5 0 0 1-2.16 9.42l2.58-7.46c.24-.6.4-1.18.48-1.7l.06.04c.24.46.42 1.02.42 1.64 0 .8-.16 1.7-.62 2.86z"
  })),
  github: () => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 16 16",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
  })),
  twitter: () => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 16 16",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"
  })),
  linkedin: () => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 16 16",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"
  }))
};
window.Icon = Icon;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/jouan-site/icons.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Prompt = __ds_scope.Prompt;

__ds_ns.TerminalWindow = __ds_scope.TerminalWindow;

})();
