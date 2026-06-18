# Story 9.1: États interactifs cohérents

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want des états visuels clairs sur les éléments interactifs,
so that je sais ce qui est cliquable et focalisé.

## Acceptance Criteria

**Given** les primitives et la navigation
**When** on vérifie les états focus/hover/press
**Then** chaque élément interactif a des états visibles conformes au DS
**And** le focus clavier est toujours visible

## Tasks / Subtasks

- [ ] Tâche 1 — Recenser tous les éléments interactifs du site (AC: #1)
  - [ ] Lister les primitives interactives (Epic 2) : `ZButton`, `ZInput`, `ZCard` (si cliquable), `ZTag`/`ZBadge` (si liens), avatars cliquables, icônes-actions.
  - [ ] Lister les éléments du châssis global (Epic 2 — story 2.8) : liens de nav du header, logo diamant, liens du footer, hexagones sociaux.
  - [ ] Lister les éléments propres aux pages (Epics 3–7) : CTA hero, liens « aperçu services », cartes de projets, cartes d'offre `/services`, liens timeline/stack `/about`, cartes d'articles + liens `/blog`, champs + bouton + CTA terminal + socials `/contact`.
  - [ ] Lister les éléments du terminal (Epic 8) : zone de saisie, liens cliquables dans les sorties, bouton/contrôle d'ouverture-fermeture, poignée draggable.
- [ ] Tâche 2 — Vérifier et harmoniser l'état hover (AC: #1)
  - [ ] Surfaces (cartes, panneaux) : éclaircissement d'un cran (`--surface-2` → `--surface-3` via `--bg-elevated`) et/ou passage de la bordure à `var(--border-strong)`.
  - [ ] Boutons primaires : l'orange s'éclaircit (`var(--accent)` → `var(--accent-hover)`).
  - [ ] Liens : soulignement / bleu plus clair (`var(--link)`).
  - [ ] Confirmer que toute transition hover passe par les tokens motion (`--dur-fast`/`--dur-base`, `--ease-out`) — pas de durée/easing en dur.
- [ ] Tâche 3 — Vérifier et harmoniser l'état press/active (AC: #1)
  - [ ] Boutons : couleur active (`var(--accent-active)`) + léger nudge de ~1px vers le bas ; **pas** de scale-shrink, pas de rebond.
  - [ ] Éléments cliquables non-bouton : feedback press cohérent et discret.
- [ ] Tâche 4 — Vérifier et garantir l'état focus clavier visible (AC: #2)
  - [ ] Chaque élément focalisable expose un anneau de focus visible (`:focus-visible`) utilisant `var(--accent-ring)` (ou `--border-strong` selon la primitive), jamais `outline: none` sans remplacement visible.
  - [ ] Le focus reste visible sur fonds sombres et sur les surfaces atmosphériques (gradient héritage, fond AI-art sous overlay) — contraste suffisant de l'anneau.
  - [ ] Les inputs renforcent leur bordure au focus (`--border-default` → `--border-strong`) conformément à `ZInput` (Epic 2 — story 2.6).
  - [ ] L'ordre de tabulation suit l'ordre visuel/logique sur chaque page.
- [ ] Tâche 5 — Vérification manuelle transverse (AC: #1, #2)
  - [ ] Parcourir chaque page (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) au clavier (Tab/Shift+Tab/Enter/Espace) et confirmer que focus/hover/press sont visibles partout.
  - [ ] Vérifier le terminal easter-egg (ouverture, saisie, liens) au clavier sans régression.
  - [ ] `yarn lint` et `yarn generate` verts (aucune valeur hardcodée réintroduite).

## Dev Notes

### Nature de la story (finition transverse)

- C'est une story de **finition** de l'Epic 9 : elle ne crée pas de nouvelle UI, elle **audite et harmonise** ce qui a été produit en amont — primitives (Epic 2), châssis global (Epic 2 — story 2.8), pages (Epics 3–7) et terminal (Epic 8). Cette dépendance vers tout l'antérieur est normale ; il n'y a **aucune dépendance vers des stories futures**.
- Périmètre : **états interactifs uniquement** (focus / hover / press + visibilité du focus clavier). Le motion réduit, le contraste et la navigabilité clavier complète sont l'objet de la **story 9.2** ; ne pas les traiter ici sauf chevauchement direct (la visibilité du focus est partagée et prioritaire ici). [Source: docs/planning-artifacts/epics.md#Epic 9]

### États conformes au DS (référence exacte)

- **Hover** : éclaircir la surface d'un cran (`--surface-2` → `--surface-3`) et/ou passer la bordure à `--border-strong` ; les boutons primaires éclaircissent l'orange (`--accent` → `--accent-hover`) ; les liens gagnent un soulignement / un bleu plus clair. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Hover states]
- **Press** : se poser sur la couleur active (`--accent-active`) avec un nudge de ~1px vers le bas ; **pas de scale-shrink**. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Press states]
- **Focus** : anneau visible via `--accent-ring` (`hsl(24 94% 53% / 0.45)`) ; `--border-strong` au focus pour bordures/inputs. [Source: docs/design_system/tokens/colors.css — `--accent-ring`, `--border-strong`]
- **Bordures** : hairlines 1px solides — `--border-subtle` pour séparateurs/cartes, `--border-default` pour inputs, `--border-strong` au hover/focus. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Borders]
- **Transitions** : courtes et mécaniques (`--dur-fast` 120ms / `--dur-base` 180ms, `--ease-out`) ; pas de rebond sur l'UI. [Source: docs/design_system/tokens/motion.css]

### Tokens & valeurs (source unique de vérité)

- Consommer exclusivement les tokens CSS (`var(--…)`) / SCSS `@use` ; aucune couleur/durée/rayon en dur. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints — Tokens, pas de valeurs en dur ; #CAP-2]
- Tokens d'états disponibles : `--accent`, `--accent-hover`, `--accent-active`, `--accent-ring`, `--accent-soft`, `--bg-card`, `--bg-elevated`, `--bg-input`, `--border-subtle`, `--border-default`, `--border-strong`, `--link`. [Source: docs/design_system/tokens/colors.css]
- Pattern de theming projet : déclarer des CSS custom properties locales au composant à partir des tokens, puis consommer via `var()`. [Source: docs/project-context.md#SCSS (règle critique)]

### Périmètre par couche (où chercher)

- **Primitives (Epic 2)** : `ZButton` (story 2.3), `ZInput` (story 2.6), `ZCard` (story 2.4), `ZBadge`/`ZTag` (story 2.5), `ZAvatar` (story 2.6) — les états y sont définis à la source ; vérifier qu'ils sont corrects et factorisés, pas redéfinis ad hoc dans les pages.
- **Châssis (Epic 2 — story 2.8)** : header fixe 56px (logo diamant), nav, footer 56px, hexagones sociaux.
- **Pages (Epics 3–7)** : Home (Epic 3), Services (Epic 4), About (Epic 5), Blog (Epic 6), Contact (Epic 7) — vérifier les éléments interactifs spécifiques à chaque page.
- **Terminal (Epic 8)** : `TerminalWindow`/`Prompt` (story 8.1), commandes + draggable (story 8.2).

### Pièges / régressions à éviter

- **Ne pas réintroduire de valeurs hardcodées** (couleur d'anneau, durée, rayon) — toujours via tokens. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]
- **Ne jamais** faire `outline: none` sans fournir un focus visible de remplacement (anneau via `--accent-ring`). Le focus clavier doit **toujours** rester visible (AC #2).
- Respecter les tokens motion : pas de durée/easing inventés pour les transitions d'état. [Source: docs/design_system/tokens/motion.css]
- **Press = nudge ~1px, pas de scale-shrink**, pas de rebond. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Press states]
- Ne pas dupliquer les états dans les pages s'ils appartiennent à une primitive — corriger à la source pour rester cohérent.
- Compatibilité prerender (site statique) : tout accès DOM gardé (`onMounted` / `import.meta.client`). [Source: docs/project-context.md#Nuxt]

### Testing standards

- Pas de framework de test. Validation = `yarn lint` (eslint + stylelint, ne pas dégrader) + `yarn generate` vert + **check manuel** : parcours clavier (Tab/Shift+Tab) de toutes les pages confirmant focus/hover/press visibles partout. [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 9: Accessibilité & finitions motion — Story 9.1]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#CAP-11, #Constraints]
- [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Hover states, Press states, Borders, Animation]
- [Source: docs/design_system/tokens/colors.css — `--accent`, `--accent-hover`, `--accent-active`, `--accent-ring`, `--border-strong`]
- [Source: docs/design_system/tokens/motion.css — `--dur-fast`, `--dur-base`, `--ease-out`]
- [Source: docs/project-context.md#Règles Langage & Framework, #SCSS (règle critique), #Tests]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
