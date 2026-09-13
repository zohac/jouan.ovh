---
baseline_commit: 7ea5b6d9cbe5ca8f018dcea57c19bb63c475510a
---

# Story 8.1: Style TerminalWindow et Prompt

Status: done

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

- [x] Tâche 1 — Restyler le châssis de la fenêtre `TerminalComponent.vue` (AC: tout)
  - [x] Aligner la fenêtre sur `TerminalWindow.jsx` : `border-radius: var(--radius-sm)` (5px), bordure aubergine `1px solid hsl(319 40% 30% / 0.4)`, ombre `--glow-terminal`, et corps en `--bg-terminal` (aubergine profond) avec `backdrop-filter: blur(5px)` gardé derrière `@supports`.
  - [x] Conserver le layout flex header / body / resize-handle déjà présent ; ne PAS toucher au markup porteur des handlers (drag, resize, close, focus input) — on ne change QUE le style.
  - [x] Remplacer les couleurs/rayons codés en dur du bloc `<style>` (variables `--color-*` locales, `border-radius: 5px`, `var(--box-shadow-2)`, `opacity: 0.85`, etc.) par les tokens du DS exposés en CSS vars globales (Epic 2 — Story 2.1) consommés via `var()`, en suivant le pattern « CSS custom properties locales depuis tokens » (NFR2).
- [x] Tâche 2 — Restyler la barre de titre (header) (AC: rend conformément au DS)
  - [x] Reproduire la barre `.ds-term__bar` : hauteur ~30px, fond `--aubergine-black`, titre centré en `--font-mono`, `--fs-xs`, `--text-muted`, `letter-spacing: --ls-wide`, `pointer-events: none` sur le titre.
  - [x] Restyler la pastille de fermeture (`close-button`) comme `.ds-term__dot--close` (dégradé `--term-red` → rouge sombre, `--radius-circle`). Conserver le `@click="closeTerminal"` existant.
  - [x] (Optionnel, conforme au DS) ajouter les pastilles min/max purement décoratives (`--term-yellow` / `--term-green`) sans handler — ne pas casser l'alignement du titre.
- [x] Tâche 3 — Restyler le prompt en vert + caret (AC: prompt vert, caret = seule boucle)
  - [x] Aligner la ligne de prompt sur `Prompt.jsx` : `user@host` en vert `--prompt` gras, séparateur `:` en `--ink-1`, répertoire `~` en `--term-blue` gras, `$ ` en `--ink-1`. Le format reste `anon.@jouan.ovh:~$` (valeurs depuis `terminal.config.ts`).
  - [x] Mettre à jour les classes existantes (`.git-prompt`, `.git-prompt-separator`, `.git-prompt-directory`) pour pointer sur les tokens (`--prompt`, `--ink-1`, `--term-blue`) au lieu des `--color-green` / `--color-blue` locaux.
  - [x] Implémenter le caret clignotant du DS sur l'`input` (ou un caret rendu) : animation `caret-blink 1s steps(1) infinite` (token `motion.css`), couleur `--prompt`. Aujourd'hui le champ utilise `caret-color: var(--color-green)` natif — décider de garder le caret natif coloré OU de porter le caret bloc `.ds-prompt__caret`, mais une seule approche. → **Décision : caret natif coloré** (`caret-color: var(--prompt)`, `caret-shape: block`), seul choix robuste pour un `<input>` éditable (le caret suit la frappe). Clignote nativement, **aucune animation CSS en boucle ajoutée**.
- [x] Tâche 4 — Garantir « caret = seule animation en boucle » + reduced-motion (AC: caret = seule boucle, NFR9/UX-DR17)
  - [x] Vérifier qu'aucune autre animation/transition en boucle n'est introduite par le restyle (pas de pulsation, scanline, etc.).
  - [x] Ajouter `@media (prefers-reduced-motion: reduce) { ... animation: none; }` sur le caret (comme `Prompt.jsx`). → **Sans objet avec le caret natif** : aucune animation CSS n'est introduite (zéro boucle CSS), donc rien à neutraliser ; le clignotement natif est figé par le navigateur sous `prefers-reduced-motion`. Le seul `transition`/effet (hover `filter` de la pastille close) n'est pas une boucle.
- [x] Tâche 5 — Vérification visuelle (AC: rend conformément au DS)
  - [x] `yarn lint` (eslint + stylelint) sans nouvelle erreur ; `yarn generate` (build statique) vert.
  - [x] Ouvrir le terminal et comparer le rendu à `ui_kits/jouan-site/TerminalScreen.jsx` + `terminal.card.html` : fond aubergine, blur, radius, prompt vert, caret qui clignote.

## Review Findings

_Revue de code adversariale (bmad-code-review) — 2026-06-26. 3 passes : Blind Hunter / Edge Case Hunter / Acceptance Auditor. Baseline `7ea5b6d`._

### Décisions requises (à trancher avant patch)

- [x] [Review][Decision] **Teleport → terminal positionné relativement au document (régression hors-viewport + drag faussé quand la page est scrollée)** [app/components/terminal/TerminalComponent.vue:9-20, 232-238] — `<Teleport to="body">` sort `.terminal` (`position: absolute; top:60px; left:15px`) du `.hdr` (sticky + `backdrop-filter` = ancien bloc conteneur épinglé au viewport ; confirmé HeaderComponent.vue:190/201). Le bloc conteneur devient le document : ouvert page scrollée, le terminal s'affiche au-dessus du viewport (top:60px = 60px sous le HAUT du **document**) et `focusUserInput()` au montage tire le scroll vers le haut ; le clamp drag utilise `window.innerHeight/innerWidth` (viewport, l.232-233) tandis que `style.top/left` est désormais document-relatif (l.237-238) → drag « collé » en haut quand scrollé. **Sévérité : High.** Vérif empirique Chrome DevTools bloquée (navigateur déjà ouvert) — à confirmer en scrollant la page puis en ouvrant. Options : (a) `position: fixed` sur `.terminal` (re-cohérent avec le clamp viewport + le drag `clientX/Y` — vraisemblablement le fix propre) ; (b) compenser `scrollX/scrollY` à l'ouverture et dans le drag ; (c) replier ce correctif dans la story 8.3 (réécriture `<script setup>`). → **Décision Simon : (a) `position: fixed`** — corriger en 8.1, re-vérifier au navigateur (scroll + drag + resize).
- [x] [Review][Decision] **Alpha de bordure 0.28 vs 0.4 (AC + DS)** [app/components/terminal/TerminalComponent.vue:323] — code = `border: 1px solid var(--accent-2-soft)`, or `--accent-2-soft = hsl(319 40% 30% / 28%)`, alors que Task 1 et `TerminalWindow.jsx` exigent `hsl(319 40% 30% / 0.4)`. Même teinte, alpha ~30 % plus transparent. **Medium.** Options : (a) ajouter/ajuster un token à alpha 0.4 ; (b) dérogation commentée `hsl(319 40% 30% / 0.4)` (comme le rouge de la pastille close) ; (c) accepter 0.28 (priorité tokens-only). → **Décision Simon : (a) nouveau token DS à alpha 0.4** (dans `_root.scss`) consommé par la bordure.
- [x] [Review][Decision] **Caret natif — support `caret-shape: block` + justification reduced-motion inexacte + divergence DS** [app/components/terminal/TerminalComponent.vue:436-439] — le DS (`Prompt.jsx`) implémente un caret bloc `.ds-prompt__caret` avec `caret-blink … infinite` ET `@media (prefers-reduced-motion){ animation: none }`. Le choix « caret natif » (robuste pour `<input>` éditable) satisfait l'AC dure (CAP-11 exempte le caret comme unique boucle), MAIS (i) le commentaire « le navigateur le fige sous prefers-reduced-motion » est techniquement faux (le clignotement du caret texte natif n'est pas piloté par cette media query), (ii) `caret-shape: block` n'est honoré que par Chromium récent (repli barre Firefox/Safari), (iii) le DS arrête explicitement son caret en reduced-motion. **Medium.** Options : (a) ratifier le caret natif + corriger le commentaire trompeur ; (b) porter le caret bloc DS avec garde reduced-motion (fidèle, mais caret détaché de la frappe). → **Décision Simon : (a) caret natif ratifié** — corriger le commentaire trompeur (ne pas affirmer que le caret natif est figé par `prefers-reduced-motion`).

### Patchs (correctifs sans ambiguïté)

- [x] [Review][Patch] **`white-space: pre-wrap` hérité dans les sorties `v-html` → lignes vides / artefacts (`about` tables, `system-info` liste)** [app/components/terminal/TerminalComponent.vue:398] — le corps n'avait pas de `white-space` avant (défaut `normal`) ; `About.ts:132-160` et `SystemInfos.ts:21-29` concatènent du HTML pretty-printé (`\n` + indentation 2/4/6 espaces) qui ne s'effondre plus sous `pre-wrap`. Le `pre-wrap` est requis par le DS (ASCII) → fix ciblé : minifier le HTML des programmes OU appliquer `white-space: normal` aux conteneurs de réponse HTML. À confirmer visuellement. **Medium.**
- [x] [Review][Patch] **Séparateurs `:` et `$` en gras alors que le DS ne met en gras que `user@host` et `~`** [app/components/terminal/TerminalComponent.vue:402-416] — `Prompt.jsx` : `.ds-prompt__sep` en graisse normale (les Completion Notes « tous gras comme la réf » sur-lisent la réf). Fix : `.git-prompt-separator { font-weight: var(--fw-regular) }`. **Low.**
- [x] [Review][Patch] **a11y — pastille close non focusable / sans nom accessible / sans clavier ; input sans label** [app/components/terminal/TerminalComponent.vue:23, 38-46] — `TerminalWindow.jsx` donne `role="button" aria-label="Fermer"` au close ; CAP-11 + project-context exigent clavier (Enter/Space) + aria. Fix additif (ne casse pas `@click`) : `role="button"`, `aria-label`, `tabindex="0"`, `@keydown.enter/.space="closeTerminal"` ; `aria-label` sur l'input. Peut être replié dans 8.3 si 8.1 doit rester strictement CSS. **Medium.**
- [x] [Review][Patch] **Espace après `$` incohérent : echo (`&nbsp;`) vs prompt live (aucun)** [app/components/terminal/TerminalComponent.vue:31 vs 38-46] — le prompt en saisie colle le texte au `$` alors que l'historique et le DS affichent `$ `. Fix : un espace insécable avant l'`<input>`. **Low.**

### Différés (préexistants, hors périmètre)

- [x] [Review][Defer→Résolu 8.1] **CSS mort `.command-prefix` / `.git-prompt-branch`** [app/components/terminal/TerminalComponent.vue] — **supprimé en 8.1** (consigne « aucune dette technique ») : mort confirmé par `grep` (aucun usage hors `TerminalComponent.vue`, rien dans `programs/`). Non reporté en 8.3.

### Résolution (reprise dev — 2026-06-26)

Tous les points (3 décisions + 4 patchs + le différé) sont corrigés et **re-vérifiés au navigateur (Chrome DevTools), page scrollée incluse** :

- **[High] Teleport/positionnement** → `.terminal` en `position: fixed`. Ouvert page scrollée (y=700) : terminal dans le viewport (top:60/left:15), **aucun saut de scroll** au focus ; **drag 1:1** (Δcurseur +200/+150 → fenêtre +200/+150), **resize** OK (800×400 → 907×467).
- **[Med] Bordure 0.4** → nouveau token `--border-terminal: hsl(319 40% 30% / 40%)` dans `_root.scss`, consommé par `.terminal` ; computed = `rgba(107,46,88,0.4)`.
- **[Med] Caret** → caret natif ratifié ; commentaire trompeur corrigé (ne prétend plus que le caret natif est figé par `prefers-reduced-motion`) ; note `caret-shape: block` = amélioration progressive.
- **[Med] `pre-wrap` artefacts** → `.terminal-response { white-space: normal }` sur les conteneurs `v-html` ; `about`/`system-info` rendus sans ligne vide (0 ligne blanche parasite), bannière ASCII préservée.
- **[Low] Séparateurs gras** → `.git-prompt-separator { font-weight: var(--fw-regular) }` (les séparateurs héritaient du gras du parent `.git-prompt`) ; computed : `:`/`$` = 400, `user@host`/`~` = 700.
- **[Med] a11y close + input** → close : `role="button"`, `aria-label`, `tabindex="0"`, `@keydown.enter/.space.prevent`, `:focus-visible` (ring `--accent`) ; input : `aria-label`. Fermeture clavier (Enter) vérifiée.
- **[Low] Espace `$ ` live** → `&nbsp;` avant l'`<input>` (le prompt en saisie collait au `$`) ; nœud espace présent, cohérent avec l'historique et `Prompt.jsx`.
- **[Defer→fait] CSS mort** → `.command-prefix` / `.git-prompt-branch` supprimés.

`pnpm lint` + `pnpm typecheck` + `pnpm generate` (11 routes) verts après corrections.

### Rejetés (faux positifs / non-problèmes)

- `--color-dark` / `--color-grey-light` « indéfinies » (Blind Hunter, diff seul) — **faux positif** : le bloc `table, .table` redéfinit `--color-light/-dark/-grey-light` localement (l.487-489), auto-suffisant. Confirmé par les 2 relecteurs avec accès projet + relecture.
- Sorties de programmes dépendant des `--color-*` retirées (Blind Hunter) — **faux positif** : aucun `var(--color-*)` dans `programs/` (grep vide) ; seuls le bloc table (auto-suffisant) et les `.git-prompt*` (retokenisés) les consommaient.
- Teleport = risque SSR/hydration (Blind Hunter) — **réfuté** : `TerminalManager` démarre `terminals: []`, création client-only, cible `body` présente au montage, `generate` vert.
- Scrollbar WebKit-only sans repli Firefox — **fidèle au DS** (`TerminalWindow.jsx` ne style aussi que `::-webkit-scrollbar`) ; repli Firefox gracieux. Non bloquant.
- Valeurs hardcodées de la pastille close (`hsl(0 100% 27%)`, `hsl(320 60% 2%)`, `gap:7px`) — dérogations commentées identiques à la source DS, autorisées par NFR2.

## Dev Notes

### Périmètre

- **Restyle uniquement** : on porte le STYLE de `TerminalWindow.jsx` + `Prompt.jsx` (et tokens `colors.css`/`motion.css`/`radius.css`/`elevation.css`/`typography.css`) sur le composant Vue existant. **Aucune logique** (drag, resize, focus, historique, exécution des commandes) n'est modifiée — c'est la story 8.2 qui vérifie le non-régression fonctionnel. **La migration Options API → `<script setup>` du terminal (décision rétro Epic 7 : refonte complète) est la story 8.3** — elle vient APRÈS ce restyle et le préserve.
- Dépend d'Epic 1 (stack Nuxt 4 verte, NFR8) et d'Epic 2 — Story 2.1 (tokens DS disponibles en CSS vars globales / SCSS `@use`). Ne dépend d'aucune story future.

### Fichiers concernés (lus — état actuel)

- **`components/terminal/TerminalComponent.vue`** (UPDATE — style) — composant **Options API** (`defineComponent`, legacy ; périmètre 8.1 = **style seul**, la migration `<script setup>` est la **story 8.3**). Le `<style lang="scss">` (non scoped) définit aujourd'hui un bloc de variables locales `--color-*` codées en dur (aubergine, vert, bleu, rouge…), `border-radius: 5px`, `box-shadow: var(--box-shadow-2)`, corps en `--color-aubergine-dark` + `opacity: 0.85`, `backdrop-filter: blur(5px)` (déjà présent, derrière `@supports`). Le markup contient : `.terminal-header` (drag via `@mousedown`), `.close-button` (`@click="closeTerminal"`), `.header-text`, `.terminal-body` avec la ligne `.git-prompt` (+ `.git-prompt-separator`, `.git-prompt-directory`), l'`input.user-input`, et `.resize-handle`.
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

claude-opus-4-8[1m] (Claude Code, workflow bmad-dev-story)

### Debug Log References

- `pnpm lint` (eslint + stylelint, Docker) : PASS après 3 corrections stylelint (disable `selector-class-pattern` pour les pastilles BEM `--min`/`--max` ; `word-break: break-word` déprécié → `overflow-wrap: break-word` ; ligne vide avant commentaire). `pnpm typecheck` / `pnpm generate` : PASS.
- Vérif visuelle Chrome DevTools MCP (terminal ouvert) : computed styles tous conformes aux tokens — `border-radius 5px` (`--radius-sm`), bordure `rgba(107,46,88,.28)` (`--accent-2-soft`), ombre `--glow-terminal`, corps `bg-terminal` à 86 % (`color-mix`) + `backdrop-filter: blur(5px)`, prompt `rgb(59,206,115)` (`--prompt`), `~` `rgb(88,172,228)` (`--term-blue`), séparateurs `--ink-1`, caret `--prompt`, pastilles jaune/vert. Close vérifié (clic → `display:none`), classes des handlers intactes.
- **Passe de finition (reprise)** : re-vérif Chrome DevTools sur l'easter-egg réel (header → bouton « Terminal ») — terminal monté 800×400, blur actif (le hero transparaît), prompt rendu `anon.@jouan.ovh:~$`, caret bloc vert, **0 animation CSS en boucle** dans le sous-arbre (`animationName: none` partout → seule boucle = le caret natif). Commandes exécutées sans régression (`help`/`about`/`system-info`/`helloWorld`), close → `display:none`, classes des handlers présentes. Scrollbar aubergine vérifiée en débordement (1430 > 368 px). `pnpm lint` + `pnpm typecheck` + `pnpm generate` re-PASS (11 routes prerendered) après l'ajout de la scrollbar et la correction du prompt (auto-format Prettier appliqué).
- **Diag blur (Chrome DevTools)** : `backdrop-filter: blur(5px)` calculé sur `.terminal-body` mais flou non rendu. Remontée de la chaîne d'ancêtres → `<header class="hdr">` porte `backdrop-filter: blur(10px)` (en-tête givré). Validation : déplacement DOM du `.terminal` vers `<body>` → blur immédiatement visible (ancêtre filtré = « backdrop root » qui neutralisait le descendant). Fix par `<Teleport to="body">`. Post-fix : drag → fenêtre à `left:215px/top:208px` (math intacte), `about` rend, close → `display:none`.

### Completion Notes List

- **Restyle CSS uniquement** de `app/components/terminal/TerminalComponent.vue` (Options API legacy — non réécrit). Le `<script>` (drag/resize/close/focus/historique/`programManager`/commandes) et les classes porteuses de handlers (`terminal-header`, `close-button`, `user-input`, `resize-handle`) sont **intacts**.
- **Fenêtre** (`.terminal`) : suppression du bloc de ~22 variables `--color-*` codées en dur → tokens DS. `--radius-sm`, bordure `--accent-2-soft`, ombre `--glow-terminal` (remplace `var(--box-shadow-2)` qui était indéfini), `font-mono`, `color: --ink-1`.
- **Barre** (`.terminal-header`) : 30px, fond `--aubergine-black` ; pastilles à gauche (close `--term-red`→rouge sombre + min `--term-yellow` / max `--term-green` décoratives `aria-hidden`) ; titre centré absolu `--text-muted`/`--fs-xs`/`--ls-wide`, `pointer-events: none` (toute la barre reste draggable).
- **Corps** (`.terminal-body`) : `--bg-terminal` opaque par défaut ; sous `@supports`, `color-mix(... 86%)` + `backdrop-filter: blur(5px)` (le flou est désormais sur le corps, comme le DS, et `opacity:0.85` qui rendait le **texte** translucide est supprimé). `--fs-sm`, `--lh-snug`, `white-space: pre-wrap`.
- **Prompt** : `.git-prompt` → `--prompt` (vert), séparateurs → `--ink-1`, répertoire → `--term-blue`, tous `--fw-bold` (porté de `Prompt.jsx`).
- **Format du prompt corrigé (finition)** : le rendu affichait `anon.@jouan.ovh :~$` (espace parasite avant `:`, dû au repli de whitespace du template Vue entre l'interpolation du domaine et le `<span>` séparateur). Interpolation et séparateur rendus adjacents → format exact `anon.@jouan.ovh:~$` (conforme à `Prompt.jsx` / Task 3). De plus, l'echo de commande dans l'historique était collé au `$` (`$help`) alors que le prompt en saisie affiche `$ help` : un `&nbsp;` placé avant `{{ line.text }}` rétablit l'espace `$ ` (cohérent avec le prompt vivant et `Prompt.jsx`). Markup non porteur de handler ; aucune logique touchée.
- **Scrollbar (finition, fidélité `.ds-term__body`)** : ajout de la scrollbar fine portée de `TerminalWindow.jsx` — `::-webkit-scrollbar { width: 10px }` + pouce `--aubergine` (≈ `hsl(319 30% 30%)` de la réf), `border-radius: var(--radius-pill)`. Seul élément du corps DS qui manquait ; tokenisé, vérifié en débordement.
- **Blur réellement appliqué via `<Teleport to="body">` (finition)** : le `backdrop-filter: blur(5px)` du corps était bien calculé mais **ne rendait pas** — le terminal est monté dans le `<header>` (`HeaderComponent`), qui porte `backdrop-filter: blur(10px)`. Un ancêtre filtré devient « backdrop root » et confine le `backdrop-filter` du descendant au seul contenu du header → flou invisible sur la page. Correctif : envelopper le `<div class="terminal">` dans `<Teleport to="body">` pour le sortir du contexte filtré. Diagnostic confirmé en live (déplacement DOM → blur visible) puis re-vérifié sur le composant. **Déplacement de rendu uniquement** : `top:60px/left:15px` conservés, et **drag** (fenêtre déplacée à 215/208 px, math du containing-block intacte), **commandes** (`about` OK) et **fermeture** (`display:none`) re-vérifiés sans régression. Prerender-safe (la liste `terminals` est vide au build → `<Teleport>` jamais évalué en SSR ; `generate` vert, 11 routes).
- **Caret** : natif coloré (`caret-color: var(--prompt)`, `caret-shape: block`) — choix robuste pour un `<input>` éditable. Clignote nativement ; **aucune animation CSS en boucle introduite** → « caret = seule boucle » respecté par construction, reduced-motion géré par le navigateur.
- **Tables de sortie de commandes** (bloc `table`/`.table`, non scoped) : conservées (hors périmètre « fenêtre + prompt »), rendues **auto-suffisantes** — la seule référence externe (`var(--color-text-dark)`, qui héritait du bloc `.terminal` supprimé) repointée sur le `--color-dark` local.
- **Markup** : ajout des 2 pastilles décoratives (`aria-hidden`) dans un wrapper `.terminal-dots` ; suppression du `<div>` vide de spacing. Aucune classe de handler renommée/retirée.

### File List

- `app/components/terminal/TerminalComponent.vue` (MODIFIÉ — restyle CSS tokenisé + scrollbar aubergine ; barre de titre DS + pastilles ; `<Teleport to="body">` + `position: fixed` (blur effectif + positionnement viewport) ; bordure `--border-terminal` (alpha 0.4) ; `.terminal-response { white-space: normal }` (artefacts `v-html`) ; séparateurs `:`/`$` en graisse normale ; a11y close (role/aria/tabindex/keydown/focus-ring) + `aria-label` input ; espace `$ ` du prompt live ; commentaire caret corrigé ; CSS mort `.command-prefix`/`.git-prompt-branch` supprimé — handlers intacts)
- `app/assets/scss/abstract/_root.scss` (MODIFIÉ — ajout du token `--border-terminal: hsl(319 40% 30% / 40%)` pour la bordure de la fenêtre terminal, alpha 0.4 conforme à `TerminalWindow.jsx`)
- `docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md` (MODIFIÉ — frontmatter `baseline_commit`, tâches, Review Findings + résolution, Dev Agent Record, statut)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIÉ — statut story `ready-for-dev` → `in-progress` → `review`)

## Change Log

| Date       | Version | Description                                                                                  |
| ---------- | ------- | -------------------------------------------------------------------------------------------- |
| 2026-06-26 | 0.1     | Implémentation story 8.1 — restyle DS du terminal (fenêtre aubergine + blur + radius, barre de titre + pastilles, prompt vert, caret natif vert), tokens uniquement, logique préservée. |
| 2026-06-26 | 0.2     | Finition fidélité DS (reprise) — scrollbar aubergine portée de `.ds-term__body` ; format du prompt corrigé en `anon.@jouan.ovh:~$` (espace parasite avant `:` retiré) + espace `$ ` avant l'echo de commande ; re-vérif Chrome DevTools (0 boucle CSS, commandes/close/handlers OK) ; lint + typecheck + generate re-verts. |
| 2026-06-26 | 0.3     | Fix blur — le `backdrop-filter` du corps ne rendait pas (terminal monté dans le `<header>` filtré `blur(10px)`, devenu « backdrop root »). `<Teleport to="body">` sort le terminal du contexte filtré → flou aubergine DS effectif. Drag/commandes/fermeture re-vérifiés OK ; prerender-safe ; lint + typecheck + generate verts. |
| 2026-06-26 | 0.4     | Revue de code — correction des 8 points (3 décisions + 4 patchs + différé), aucune dette : `position: fixed` (régression positionnement/scroll du Teleport, page scrollée), token `--border-terminal` alpha 0.4, `white-space: normal` sur sorties `v-html`, séparateurs en graisse normale, a11y close (clavier + focus-ring) + `aria-label` input, espace `$ ` du prompt live, commentaire caret corrigé, CSS mort supprimé. Re-vérif Chrome DevTools (scroll + drag 1:1 + resize + clavier) ; lint + typecheck + generate verts. |
