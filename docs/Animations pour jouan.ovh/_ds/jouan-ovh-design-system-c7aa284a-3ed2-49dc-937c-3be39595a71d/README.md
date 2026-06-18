# jouan.ovh — Design System

The brand system for **Simon Jouan**, freelance developer. A dark-first,
terminal-flavoured identity that pairs Ubuntu's heritage palette (orange +
aubergine) with Ubuntu Mono to make the whole interface feel like a polished
operating system at night — warm, precise, and a little bit hacker.

> Positioning: *PHP/Symfony application developer, WordPress developer, and
> Node.js / Nest.js / Nuxt.js developer. Founder of the SaaS platform
> [keova.app](https://keova.app). Client work incl. patio-conseil.fr.*

---

## Sources

This system was reverse-engineered and rebranded from the live site and its
codebase. The reader is encouraged to explore these further to build
higher-fidelity work:

- **Live site:** https://dev.jouan.ovh
- **Theme repo (source of truth):** https://github.com/zohac/jouan.ovh
  — Nuxt 3 + SCSS. The SCSS token files under `assets/scss/abstract/`
  (`_color.scss`, `_typography.scss`, `_space.scss`, `_radius.scss`,
  `_box_shadow.scss`, `color/*`) are where the original tokens live. The
  draggable terminal lives in `components/terminal/`.
- Author GitHub: https://github.com/zohac

The original used a **Ubuntu desktop metaphor**: a tri-colour gradient
background (aubergine + orange + red), draggable/resizable terminal windows
with a green `user@host` prompt, hexagon social links, and Ubuntu Mono
everywhere. This system keeps that DNA but elevates it into a cohesive,
content-forward dark interface.

---

## Brand at a glance

| | |
|---|---|
| **Vibe** | Polished indie craftsman × AI-forward × approachable |
| **Mode** | Dark-first (no light theme) |
| **Language** | French (UI copy & sample content) |
| **Heritage** | Ubuntu / terminal / OS metaphor |
| **Accent** | Ubuntu orange (hero) + aubergine purple (secondary) |
| **Type** | Ubuntu Mono (signature) + Ubuntu sans (body) |
| **Terminal** | Kept as a fun secondary feature / easter-egg |

---

## CONTENT FUNDAMENTALS

How copy is written across the brand.

- **Language:** French, throughout. Headlines, labels, buttons, body.
- **Voice:** First person — *"je"*. Simon speaks directly and personally
  ("Je conçois et développe…"), and addresses the visitor with *"vous"*
  (professional, not the casual *"tu"*). Warm but not chatty.
- **Tone:** Confident craftsman. Specific over hype — names real stacks
  (PHP/Symfony, WordPress, Nest.js, Nuxt.js) and real outcomes rather than
  buzzwords. AI is framed as a practical tool ("l'IA au service du code"),
  not magic.
- **Casing:** Sentence case for headings and body. **UPPERCASE + wide
  letter-spacing** is reserved for short mono eyebrows / kicker labels and
  nav (`// SERVICES`, `~/À-PROPOS`). Never all-caps a full sentence.
- **Terminal idioms as flavour:** prompts (`anon.@jouan.ovh:~$`), command
  names (`help`, `about`, `whoami`), file-path framing (`~/blog`), and
  comment syntax (`// `, `# `) are used decoratively for eyebrows and
  section markers — sparingly, so they stay charming.
- **Length:** Short. Hero statements are one line. Service blurbs 1–2
  sentences. Let whitespace and the mono rhythm carry weight.
- **Punctuation:** French spacing conventions where natural; em dashes for
  asides. Avoid exclamation marks except the friendly terminal welcome.
- **Emoji:** Not used. Status and accent come from colour + the terminal
  palette, not emoji.

**Examples**
- Hero: *"Développeur web freelance. Je conçois des applications sur-mesure,
  des sites WordPress, et j'intègre l'IA dans vos outils."*
- Eyebrow: `// CE QUE JE FAIS`
- Button: `Démarrer un projet` / `Voir le terminal`
- Empty state (blog): *"Oups, pas encore d'articles ici. Je prépare du
  contenu — revenez bientôt."*
- Terminal welcome: *"Bienvenue. Pour voir les commandes disponibles,
  tapez `help`."*

---

## VISUAL FOUNDATIONS

- **Colour vibe:** Dark, warm, aubergine-tinted. Surfaces are near-black with
  a faint purple cast (`--surface-0` … `--surface-4`) so the UI reads like a
  lit terminal rather than flat grey. **Ubuntu orange** (`--accent`,
  `hsl(24 94% 53%)`) is the single hero colour — used decisively and
  sparingly for primary actions, links-as-buttons, focal accents. **Aubergine**
  (`--aubergine`, `--aubergine-light`) is the secondary/atmospheric colour and
  the terminal body background (`--bg-terminal`, deep aubergine).
- **Terminal/syntax palette:** green (prompt/success), blue (directory/links),
  red, yellow, cyan, purple — pulled straight from the original terminal
  component. Use these for code, the terminal feature, and small status dots —
  not as broad UI fills.
- **Type:** Ubuntu Mono is the *signature voice* — hero headlines, section
  titles, eyebrows, buttons, stats, code, terminal. Ubuntu sans carries
  *long-form body* (paragraphs, blog articles, dense UI) for readability.
  Headlines lean on regular/300 weight at large sizes (airy, not heavy).
  Eyebrows are uppercase mono with `--ls-wider` tracking.
- **Spacing:** 4px base scale. Generous vertical rhythm; sections breathe
  (`--space-12`/`--space-16` between blocks). Content max-width ~1200px.
- **Backgrounds:** Three registers — (1) flat `--surface-0` for most content;
  (2) the signature **tri-colour heritage gradient** (aubergine-deep → orange
  → red, diagonal) for hero / full-bleed moments, always dark enough to keep
  white text legible; (3) **AI-art full-bleed** cyberpunk/hacker-den imagery
  (in `assets/`) behind a dark `--overlay` for atmospheric section breaks.
  Subtle scanline / grid textures are optional and low-opacity.
- **Animation:** Restrained and mechanical — short fades + small upward
  translate on enter (`fade-rise`, `--ease-out`, ~180–320ms). No bounce on UI.
  The only looping motion is the **terminal caret blink**. Respect
  `prefers-reduced-motion`.
- **Hover states:** Lighten the surface one step (`--surface-2` → `--surface-3`)
  and/or shift border to `--border-strong`. Primary buttons brighten the
  orange (`--accent` → `--accent-hover`). Links gain underline / brighter blue.
- **Press states:** Settle to the active colour (`--accent-active`) and a
  ~1px nudge down; no scale-shrink.
- **Borders:** Hairlines do a lot of work in this dark UI. `--border-subtle`
  for separators/cards, `--border-default` for inputs, `--border-strong` on
  hover/focus. 1px, solid. Dashed borders are a terminal idiom (used on
  terminal tables) — use only in that context.
- **Shadows:** Deep, near-black, soft (`--shadow-1…4`) plus an inset top
  hairline (`--shadow-hairline`) that makes dark cards feel lit from above.
  Focal elements (primary CTA, terminal) may use a coloured glow
  (`--glow-accent`, `--glow-terminal`) — sparingly.
- **Transparency & blur:** The terminal uses `backdrop-filter: blur(5px)` over
  content — a signature touch. Overlays on imagery use `--overlay`. Otherwise
  keep surfaces opaque.
- **Corner radii:** Small and controlled — `--radius-md` (8px) for cards,
  inputs, buttons; `--radius-sm` (5px) for the terminal window & chips;
  `--radius-pill` for tags/avatars. Nothing very round.
- **Cards:** `--bg-card` fill, 1px `--border-subtle`, `--radius-md`,
  `--shadow-2` + `--shadow-hairline`. Optional left/top accent on featured
  cards. Quiet by default; the content is the hero.
- **Layout rules:** Fixed top header (`--header-height` 56px) dark bar with the
  diamond logo. Footer 56px. Hexagon social links are a heritage motif kept for
  the footer/contact.

---

## ICONOGRAPHY

- The original site ships **no icon font**. Icons are **inline SVG**, drawn at
  `fill="currentColor"`, simple and monochrome (e.g. brand glyphs for GitHub /
  Twitter / LinkedIn in `LinkListComponent.vue`, sized ~20px).
- **Approach for this system:** use **Lucide** (https://lucide.dev) via CDN as
  the working icon set — thin, consistent stroke icons that match the precise,
  technical feel. `currentColor` so they inherit text colour.
  *Substitution note:* Lucide is a stand-in for a bespoke set; the only true
  brand icons in the repo are the social glyphs (kept as inline SVG) and the
  diamond logo. Flag if a self-hosted set is preferred.
- **Brand social glyphs** (GitHub, X/Twitter, LinkedIn) are kept as inline SVG
  paths, used inside the hexagon links — see the original `LinkListComponent`.
- **Logo / brand mark:** a minimalist 3-D **diamond / gem** (rotated square with
  a soft top-light gradient). Provided in `assets/` as black, white, and
  greyscale PNGs at multiple sizes.
- **Emoji:** never used as iconography.
- **Unicode/ASCII:** box-drawing & block characters appear in the terminal ASCII
  art (the `/S/ /J/` banner) — terminal-only flavour, not general UI.

---

## INDEX — what's in this system

**Root**
- `styles.css` — global entry point (consumers link this). `@import`s only.
- `README.md` — this guide.
- `SKILL.md` — Agent-Skills-compatible entry for downloaded use.

**`tokens/`** — CSS custom properties
- `fonts.css` (Ubuntu Mono @font-face + Ubuntu sans import) ·
  `colors.css` · `typography.css` · `spacing.css` · `radius.css` ·
  `elevation.css` · `motion.css`

**`assets/`** — fonts (Ubuntu Mono ttf), logos (diamond, black/white),
portrait, AI-art backgrounds.

**`guidelines/`** — foundation specimen cards (Type, Colors, Spacing, Brand).

**`components/`** — reusable React primitives (see cards in the Design System
tab): `Button`, `Badge`, `Tag`, `Card`, `Input`, `Avatar`, `Prompt`,
`TerminalWindow`.

**`ui_kits/jouan-site/`** — high-fidelity recreation of the revamped site:
Home (hero variations), Services, About/CV, Blog, Contact, and the interactive
Terminal. See its own `README.md`.

---

## Caveats / substitutions

- **Ubuntu sans** is added from Google Fonts (the repo ships only Ubuntu Mono).
- **Lucide** icons are a CDN stand-in for a bespoke icon set.
- The site is being **rebranded**, so the UI kit is an interpretation that
  honours the heritage rather than a 1:1 copy of the current live site.
