# Story 8.1: Style TerminalWindow et Prompt

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want un terminal au style de la marque,
so that l'easter-egg s'intègre à l'identité (UX-DR8, UX-DR9, FR10).

## Acceptance Criteria

**Given** `components/terminal/` existant et les références `TerminalWindow.jsx`/`Prompt.jsx`
**When** on restyle la fenêtre (fond aubergine profond, `blur(5px)`, radius-sm, caret clignotant) et le prompt vert (`anon.@jouan.ovh:~$`)
**Then** le terminal rend conformément au DS
**And** le caret clignotant est la seule animation en boucle

## Tasks / Subtasks

- [ ] Tâche 1 — Restyler le châssis de la fenêtre `TerminalComponent.vue` (AC: tout)
  - [ ] Aligner la fenêtre sur `TerminalWindow.jsx` : `border-radius: var(--radius-sm)` (5px), bordure aubergine `1px solid hsl(319 40% 30% / 0.4)`, ombre `--glow-terminal`, et corps en `--bg-terminal` (aubergine profond) avec `backdrop-filter: blur(5px)` gardé derrière `@supports`.
  - [ ] Conserver le layout flex header / body / resize-handle déjà présent ; ne PAS toucher au markup porteur des handlers (drag, resize, close, focus input) — on ne change QUE le style.
  - [ ] Remplacer les couleurs/rayons codés en dur du bloc `<style>` (variables `--color-*` locales, `border-radius: 5px`, `var(--box-shadow-2)`, `opacity: 0.85`, etc.) par les tokens du DS exposés en CSS vars globales (Epic 2 — Story 2.1) consommés via `var()`, en suivant le pattern « CSS custom properties locales depuis tokens » (NFR2).
- [ ] Tâche 2 — Restyler la barre de titre (header) (AC: rend conformément au DS)
  - [ ] Reproduire la barre `.ds-term__bar` : hauteur ~30px, fond `--aubergine-black`, titre centré en `--font-mono`, `--fs-xs`, `--text-muted`, `letter-spacing: --ls-wide`, `pointer-events: none` sur le titre.
  - [ ] Restyler la pastille de fermeture (`close-button`) comme `.ds-term__dot--close` (dégradé `--term-red` → rouge sombre, `--radius-circle`). Conserver le `@click="closeTerminal"` existant.
  - [ ] (Optionnel, conforme au DS) ajouter les pastilles min/max purement décoratives (`--term-yellow` / `--term-green`) sans handler — ne pas casser l'alignement du titre.
- [ ] Tâche 3 — Restyler le prompt en vert + caret (AC: prompt vert, caret = seule boucle)
  - [ ] Aligner la ligne de prompt sur `Prompt.jsx` : `user@host` en vert `--prompt` gras, séparateur `:` en `--ink-1`, répertoire `~` en `--term-blue` gras, `$ ` en `--ink-1`. Le format reste `anon.@jouan.ovh:~$` (valeurs depuis `terminal.config.ts`).
  - [ ] Mettre à jour les classes existantes (`.git-prompt`, `.git-prompt-separator`, `.git-prompt-directory`) pour pointer sur les tokens (`--prompt`, `--ink-1`, `--term-blue`) au lieu des `--color-green` / `--color-blue` locaux.
  - [ ] Implémenter le caret clignotant du DS sur l'`input` (ou un caret rendu) : animation `caret-blink 1s steps(1) infinite` (token `motion.css`), couleur `--prompt`. Aujourd'hui le champ utilise `caret-color: var(--color-green)` natif — décider de garder le caret natif coloré OU de porter le caret bloc `.ds-prompt__caret`, mais une seule approche.
- [ ] Tâche 4 — Garantir « caret = seule animation en boucle » + reduced-motion (AC: caret = seule boucle, NFR9/UX-DR17)
  - [ ] Vérifier qu'aucune autre animation/transition en boucle n'est introduite par le restyle (pas de pulsation, scanline, etc.).
  - [ ] Ajouter `@media (prefers-reduced-motion: reduce) { ... animation: none; }` sur le caret (comme `Prompt.jsx`).
- [ ] Tâche 5 — Vérification visuelle (AC: rend conformément au DS)
  - [ ] `yarn lint` (eslint + stylelint) sans nouvelle erreur ; `yarn generate` (build statique) vert.
  - [ ] Ouvrir le terminal et comparer le rendu à `ui_kits/jouan-site/TerminalScreen.jsx` + `terminal.card.html` : fond aubergine, blur, radius, prompt vert, caret qui clignote.

## Dev Notes

### Périmètre

- **Restyle uniquement** : on porte le STYLE de `TerminalWindow.jsx` + `Prompt.jsx` (et tokens `colors.css`/`motion.css`/`radius.css`/`elevation.css`/`typography.css`) sur le composant Vue existant. **Aucune logique** (drag, resize, focus, historique, exécution des commandes) n'est modifiée — c'est la story 8.2 qui vérifie le non-régression fonctionnel.
- Dépend d'Epic 1 (stack Nuxt 4 verte, NFR8) et d'Epic 2 — Story 2.1 (tokens DS disponibles en CSS vars globales / SCSS `@use`). Ne dépend d'aucune story future.

### Fichiers concernés (lus — état actuel)

- **`components/terminal/TerminalComponent.vue`** (UPDATE — style) — composant **Options API** (`defineComponent`, legacy, à NE PAS réécrire en `<script setup>` ici : périmètre = style). Le `<style lang="scss">` (non scoped) définit aujourd'hui un bloc de variables locales `--color-*` codées en dur (aubergine, vert, bleu, rouge…), `border-radius: 5px`, `box-shadow: var(--box-shadow-2)`, corps en `--color-aubergine-dark` + `opacity: 0.85`, `backdrop-filter: blur(5px)` (déjà présent, derrière `@supports`). Le markup contient : `.terminal-header` (drag via `@mousedown`), `.close-button` (`@click="closeTerminal"`), `.header-text`, `.terminal-body` avec la ligne `.git-prompt` (+ `.git-prompt-separator`, `.git-prompt-directory`), l'`input.user-input`, et `.resize-handle`.
  - **À préserver intégralement** : tout le `<script>` (handlers drag/resize/close/focus/historique, `runCommand`, `programManager`), la structure du `<template>` (classes utilisées par les handlers : `terminal-header`, `resize-handle`, `close-button`, `user-input`).
  - **À changer** : valeurs de couleur/rayon/ombre/typo du `<style>` → tokens DS ; ajout du caret clignotant + garde reduced-motion ; barre de titre alignée DS.
- **`terminal.config.ts`** (lecture, pas de changement attendu) — fournit `userName: "anon."`, `domainName: "jouan.ovh"`, donc le prompt rend déjà `anon.@jouan.ovh:~$`. `initialData` = bannière ASCII « S/J ». Ne pas casser ces valeurs.
- **`components/terminal/TerminalButton.vue`** (lecture) — bouton d'ouverture ; restyle non requis par cette story (peut être harmonisé en Epic 2/9, hors périmètre ici).
- **`components/terminal/TerminalManagerComponent.vue`** (lecture) — gère la liste des terminaux ; pas de style à porter.

### Ce qui CHANGE (style depuis le DS) vs ce qui est PRÉSERVÉ

- **Change (style)** — d'après `TerminalWindow.jsx` / `Prompt.jsx` et tokens :
  - Fenêtre : `--radius-sm` (5px), bordure `hsl(319 40% 30% / 0.4)`, ombre `--glow-terminal`.
  - Corps : `--bg-terminal` (= `--aubergine-deep`, `hsl(319 100% 9%)`) ; sous `@supports (backdrop-filter)`, `hsl(319 100% 9% / 0.86)` + `blur(5px)`. Texte `--ink-1`, `--font-mono`, `--fs-sm`, `--lh-snug`, `white-space: pre-wrap`.
  - Barre : `--aubergine-black`, titre `--text-muted` / `--fs-xs` / `--ls-wide`, pastille close en dégradé `--term-red`.
  - Prompt : `user@host` vert `--prompt` (= `--term-green`), `:` `--ink-1`, `~` `--term-blue`, `$` `--ink-1` ; tous gras (`--fw-bold`) comme la réf.
  - Caret : `caret-blink 1s steps(1) infinite`, couleur `--prompt`.
- **Préservé (NFR9, voir 8.2)** : ouverture modale/affichage, **drag** (header `mousedown` + écouteurs globaux `mousemove`/`mouseup`), **resize** (`.resize-handle`), fermeture (`closeTerminal`), focus input au clic, historique (flèches haut/bas), exécution via `programManager`, et **toutes les commandes existantes**.

### Caret = seule animation en boucle (contrainte clé)

- Le DS impose `prefers-reduced-motion` partout et **une seule boucle = le caret** (NFR / UX-DR17, project-context.md). Ne pas introduire d'autre animation infinie pendant le restyle. Le keyframe `caret-blink` vit dans `motion.css` ; la garde reduced-motion est dans `Prompt.jsx`.

### Pièges / régressions à éviter (NFR9)

- **Ne pas modifier le markup porteur des handlers** : les classes `terminal-header`, `resize-handle`, `close-button`, `user-input` sont testées par `classList.contains(...)` dans le script — les renommer casserait le drag/resize/close.
- Le `<style>` du composant est **non scoped** : attention aux sélecteurs `table`/`.table` globaux en bas du fichier (utilisés par les sorties de commandes comme `about`/`system-info`) — les conserver ou les porter sur tokens sans casser le rendu HTML injecté via `v-html`.
- Compatibilité prerender (NFR4) : pas d'accès DOM nouveau hors `onMounted` / garde client ; le restyle est pur CSS, donc safe.
- Ne pas hardcoder de valeurs (NFR2) : tout passe par les tokens DS portés en Story 2.1.
- Ne pas régresser le déploiement / `CNAME` (NFR5) — story purement CSS, mais `yarn generate` doit rester vert.

### Testing standards

- Pas de framework de test (project-context.md). Validation = `yarn lint` (eslint + stylelint) sans nouvelle erreur + `yarn generate` vert + **vérification manuelle** : ouverture du terminal, rendu (aubergine + blur + radius + prompt vert + caret clignotant), et caret qui s'arrête sous `prefers-reduced-motion`. Le non-régression fonctionnel des commandes est couvert par la story 8.2.

### References

- [Source: docs/planning-artifacts/epics.md#Epic 8 — Story 8.1]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#CAP-10, #CAP-11, #Constraints]
- [Source: docs/specs/spec-design-system-revamp/primitives.md — Prompt, TerminalWindow]
- [Source: docs/design_system/components/terminal/TerminalWindow.jsx + .prompt.md]
- [Source: docs/design_system/components/terminal/Prompt.jsx + .prompt.md]
- [Source: docs/design_system/tokens/colors.css, motion.css, radius.css, elevation.css, typography.css]
- [Source: docs/design_system/ui_kits/jouan-site/TerminalScreen.jsx]
- [Source: components/terminal/TerminalComponent.vue, terminal.config.ts]
- [Source: docs/project-context.md#À préserver pendant la refonte, #SCSS, #Tests]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
