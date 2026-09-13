---
name: jouan-ovh-design
description: Use this skill to generate well-branded interfaces and assets for jouan.ovh (Simon Jouan — freelance web developer), either for production or throwaway prototypes/mocks/etc. A dark-first, Ubuntu/terminal-flavoured personal brand (Ubuntu orange + aubergine, Ubuntu Mono). Contains design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out of `assets/` and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick map
- `styles.css` — the one stylesheet to link; `@import`s all tokens + fonts.
- `tokens/` — colors, typography, spacing, radius, elevation, motion.
- `assets/` — Ubuntu Mono fonts, the diamond logo (black/white), portrait, AI-art backgrounds.
- `components/` — React primitives: Button, Badge, Tag, Card, Input, Avatar, Prompt, TerminalWindow (see each `*.prompt.md`).
- `ui_kits/jouan-site/` — full interactive site recreation (Home/Services/About/Blog/Contact/Terminal).
- `guidelines/` — foundation specimen cards.

## Brand in one breath
Dark, warm, aubergine-tinted surfaces. **Ubuntu orange** is the single hero accent; **aubergine** is the secondary + terminal-body colour. **Ubuntu Mono** for headlines/labels/code, **Ubuntu sans** for body. French, first-person, no emoji. Terminal idioms (`anon.@jouan.ovh:~$`, `// eyebrow`) as decorative flavour. Restrained motion; the only loop is the terminal caret. Small radii, hairline borders, deep dark shadows.
