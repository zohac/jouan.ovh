# Primitives — mapping React → Vue

Recréer chaque primitive en composant Vue 3 (`<script setup lang="ts">`), stylée
via les tokens (CAP-2), conforme à la référence React. NE PAS copier les `.jsx`.
Référence : `docs/design_system/components/`. Chaque primitive a un `.d.ts`
(contrat de props) et souvent un `*.prompt.md` (intention) à respecter.

| Primitive | Réf. source | Cible | Notes |
|---|---|---|---|
| Button | `components/core/Button.jsx` (+ `.d.ts`) | `components/ui/ZButton.vue` | variantes (primary orange, dark…), états hover/press/focus |
| Card | `components/core/Card.jsx` | `components/ui/ZCard.vue` | fond `--bg-card`, bordure hairline, `--radius-md`, ombres + hairline ; remplace/refond les `ZCard*` existants |
| Badge | `components/core/Badge.jsx` | `components/ui/ZBadge.vue` | — |
| Tag | `components/core/Tag.jsx` | `components/ui/ZTag.vue` | radius pill |
| Input | `components/core/Input.jsx` | `components/ui/ZInput.vue` | bordure `--border-default` → `--border-strong` au focus |
| Avatar | `components/core/Avatar.jsx` | `components/ui/ZAvatar.vue` | radius pill |
| Prompt | `components/terminal/Prompt.jsx` | intégré au sous-système terminal | prompt `anon.@jouan.ovh:~$`, vert |
| TerminalWindow | `components/terminal/TerminalWindow.jsx` | refonte du style de `components/terminal/TerminalComponent.vue` | fond aubergine profond, `blur(5px)`, radius-sm, caret clignotant |

## Conventions

- Le nom/chemin Vue ci-dessus est une proposition (préfixe `Z` cohérent avec
  l'existant) — à confirmer à l'étape epics/stories.
- Icônes : Lucide via CDN (stand-in), `currentColor` ; glyphes sociaux et logo
  diamant restent en SVG inline (cf. `icons.jsx` du UI kit).
- Les primitives sont stylées **uniquement** via tokens ; aucune valeur en dur.
