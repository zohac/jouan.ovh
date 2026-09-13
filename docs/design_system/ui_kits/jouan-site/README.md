# UI kit — jouan.ovh (the site)

High-fidelity recreation of the **revamped** jouan.ovh: Simon Jouan's freelance
developer site. Dark-first, Ubuntu/terminal-flavoured, French. It composes the
design-system primitives (`Button`, `Card`, `Tag`, `Badge`, `Input`, `Avatar`,
`Prompt`, `TerminalWindow`) — it does not re-implement them.

Open `index.html` for the full interactive click-through.

## Screens
- **Home** — hero + services preview + stats + selected projects.
- **Services** — three offers (WordPress / Applications web / IA), process steps.
- **About** — portrait, bio, experience timeline, formation, stack.
- **Blog** — article index, and a sample **Article** view with prose + code.
- **Contact** — working (fake) form + info card + terminal CTA + socials.
- **Terminal** — the signature easter-egg: a modal terminal with live commands
  (`help`, `about`, `skills`, `projets`, `contact`, `clear`).

## Built-in exploration (bottom-right switcher)
- **Hero** (home only): `Terminal` (A) · `Portrait` (B) · `Statement` (C) — the
  three homepage directions requested.
- **Accent**: `Orange` (Ubuntu signature) · `Aubergine` · `Vert` (terminal green)
  — swaps the accent tokens live to preview the colour treatment.

## Files
| File | Role |
|---|---|
| `index.html` | Entry — loads React, the DS bundle, then the screens. |
| `kit.css` | Layout-only CSS (header, hero, grids…). Tokens come from the DS. |
| `data.js` | All French content (services, projects, CV, posts). |
| `icons.jsx` | Inline SVG icons (Lucide-style + brand glyphs) → `window.Icon`. |
| `Header/Footer/Home/Services/About/Blog/Contact/TerminalScreen.jsx` | Screens. |
| `App.jsx` | Router + switcher + terminal modal. |

## Notes
- This is an **interpretation** of the rebrand, not a 1:1 copy of the current
  live site (which is being replaced). It honours the heritage: Ubuntu Mono,
  orange + aubergine, terminal motifs, hexagon socials, heritage gradient.
- The portrait & background art are the original site's AI-generated assets,
  reused as atmospheric imagery.
