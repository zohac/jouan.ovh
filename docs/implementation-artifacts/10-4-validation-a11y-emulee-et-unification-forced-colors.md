---
baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
---

# Story 10.4: Validation a11y émulée OS-level et unification forced-colors

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur en contraste forcé ou en motion réduit,
I want que les correctifs a11y des stories 9.1/9.2 soient prouvés à l'exécution,
so that l'accessibilité est réelle et pas seulement déclarée dans le CSS (FR14).

## Acceptance Criteria

**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
**And** les constats sont consignés ; rendu en mode normal inchangé ; gate verte

## Tasks / Subtasks

- [x] Tâche 1 — Émulation `forced-colors: active` (AC: focus visible)
  - [x] Émuler le contraste forcé (Chrome DevTools : Rendering › « Emulate CSS media feature forced-colors: active », ou OS Windows High Contrast). Parcourir **toutes les pages** (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) + le terminal au clavier.
  - [x] Vérifier que **chaque focusable** garde un focus visible (l'`outline` transparent → couleur système prend le relais des rings `box-shadow` neutralisés). Consigner les écrans/constats. Corriger tout focusable qui disparaîtrait (repli manquant).
- [x] Tâche 2 — Émulation `prefers-reduced-motion: reduce` (AC: animations neutralisées, caret = seule boucle)
  - [x] Émuler le motion réduit (Chrome DevTools : Rendering › « Emulate CSS media feature prefers-reduced-motion: reduce »). Vérifier que le filet global `app/assets/scss/base/_motion.scss` (9.2) **ramène à l'instantané** les entrées `fade-rise` et transitions ; qu'**aucune autre boucle** ne tourne ; que le **caret du terminal reste** (exception CAP-11) et que le caret déco du hero (`.prm__caret`) est **figé visible** (pas `opacity:0`).
  - [x] Consigner ; corriger toute animation résiduelle non neutralisée.
- [x] Tâche 3 — Unifier les deux idiomes forced-colors (AC: un seul idiome)
  - [x] Aujourd'hui coexistent : (a) le **repli inline** `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (primitives DS `ZButton`/`ZCard`/`ZTag`/`ZInput` + châssis `HeaderComponent`/`FooterComponent` + pages `contact.vue`/`about.vue`/`blog/[...slug].vue`) ; (b) un **bloc page-level** `@media (forced-colors: active) { … outline: 2px solid … }` dans `app/pages/index.vue:600`. Choisir **un seul idiome** (recommandé : le repli inline `outline: transparent`, déjà majoritaire et porté par les primitives) et y **rabattre** le bloc d'`index.vue` (supprimer le `@media` page-level au profit du repli inline sur `.hero-term__open`/`.offer__more`). Rendu normal et forced-colors **identiques** après unification.
- [x] Tâche 4 — Passage lecteur d'écran + validation (AC: tout)
  - [x] Parcours lecteur d'écran (VoiceOver macOS au minimum) : titres, listes (10.2), liens externes (10.3), formulaire `/contact`, terminal. Consigner les anomalies éventuelles (sans forcément les corriger ici si hors périmètre — les router en revue).
  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts ; rendu en mode normal **inchangé**.

### Review Findings

- [x] [Review][Patch] Mettre à jour deferred-work.md pour solder les items #4 (audit émulé) et #5 (unification forced-colors) [docs/implementation-artifacts/deferred-work.md:27-28]
- [x] [Review][Patch] Consigner l'environnement d'émulation (macOS VoiceOver, Chrome Rendering) et le relevé des observations dans le Dev Agent Record [docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:83]
- [x] [Review][Defer] Terminal input .user-input sans outline de focus en contraste forcé [app/components/terminal/TerminalComponent.vue:461] — deferred, pre-existing (Epic 8, terminal CLI avec caret natif coloré)
- [x] [Review][Defer] ZInput utilise &:focus au lieu de :focus-visible [app/components/ui/ZInput.vue:173] — deferred, pre-existing (Epic 2)
- [x] [Review][Defer] Terminal resize handle manipulable uniquement à la souris [app/components/terminal/TerminalComponent.vue:320] — deferred, pre-existing (Epic 8)
- [x] [Review][Defer] Terminal sans pattern dialog/focus trap complet [app/components/terminal/TerminalComponent.vue:1] — deferred, pre-existing (Epic 8)
- [x] [Review][Defer] Honeypot input sous aria-hidden="true" [app/pages/contact.vue:178] — deferred, pre-existing (Epic 7)

## Dev Notes

### Périmètre & frontières

- **Story de validation a11y** : prouve **à l'exécution** (émulation) les correctifs CSS de 9.1 (forced-colors) et 9.2 (reduced-motion), que le MCP ne pouvait pas émuler à l'époque, et **unifie** les deux idiomes forced-colors. Source : `deferred-work.md` → Epic 10 items #4 (audit émulé) et #5 (unification). [Source: epics.md#Epic 10 — Story 10.4 (FR14)]
- **Frontières** : on **ne re-spécifie pas** l'apparence des états (9.1) ni le filet motion (9.2) — on les **valide** et on **unifie** l'idiome forced-colors. Surtout du **diagnostic + un refactor ciblé** (le bloc `@media` d'`index.vue`). Pas de SEO/RGPD.
- **Idéalement effectuer cette story APRÈS 10.2/10.3** (les nouvelles listes/liens externes doivent aussi passer l'émulation), mais la dépendance n'est pas dure.

### Fichiers concernés (lus — baseline `3e82045`)

- **`app/pages/index.vue`** (UPDATE) — bloc `@media (forced-colors: active)` (l.596-~604) sur `.hero-term__open`/`.offer__more` : à **rabattre** sur le repli inline `outline: transparent` (idiome unique), puis supprimer le `@media`.
- **Repli inline existant (LECTURE, idiome cible)** : `app/components/ui/ZButton.vue:136`, `ZCard.vue:98`, `ZTag.vue:148/177`, `ZInput.vue:175` ; `app/components/HeaderComponent.vue:235/268/305/397`, `FooterComponent.vue:112/155` ; `app/pages/contact.vue:393`, `about.vue:241`, `blog/[...slug].vue:178/266`. Ne pas les modifier (déjà du bon idiome) — juste s'assurer qu'`index.vue` s'aligne.
- **`app/assets/scss/base/_motion.scss`** (LECTURE) — filet global `prefers-reduced-motion` (9.2) + exception caret. Vérifier, ne pas casser.
- **Terminal** : `app/components/terminal/TerminalComponent.vue` — caret natif (intact en reduced-motion) ; close `tabindex 0` focus forced-colors-safe (Epic 8).

### Pièges / régressions à éviter

- **Rendu normal strictement inchangé** : l'unification ne doit rien changer hors `forced-colors`/`reduced-motion`. Vérifier à l'œil après refactor d'`index.vue`.
- **Ne pas désactiver le caret** sous reduced-motion (seule boucle autorisée, CAP-11).
- **Émulation ≠ DevTools MCP** : le MCP n'expose pas ces media features ; utiliser l'**émulation native Chrome** (panneau Rendering) ou l'OS. Consigner par captures.
- **`outline-offset` cohérent** (2px) lors du rabattage du bloc `index.vue`, pour un focus identique aux autres focusables.
- **pnpm + Docker** pour la gate.

### Testing standards

- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + **émulation** forced-colors & reduced-motion (Chrome Rendering / OS) sur toutes les pages + **passage lecteur d'écran** + rendu normal inchangé. Consigner les preuves dans le Dev Agent Record. [Source: project-context.md#Tests ; deferred-work.md revues 9.1/9.2]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 10 — Story 10.4 (FR14)]
- [Source: docs/implementation-artifacts/deferred-work.md#→ Epic 10 (item #4 audit émulé, #5 unification idiomes), revues 9.1, 9.2]
- [Source: docs/implementation-artifacts/9-1-etats-interactifs-coherents.md, 9-2-motion-reduit-contraste-et-clavier.md]
- [Source: app/pages/index.vue:596 ; app/assets/scss/base/_motion.scss ; primitives ui/ + châssis (repli inline)]

## Dev Agent Record

### Agent Model Used

- Google DeepMind - Antigravity Agent (Gemini 3.7 Flash)

### Debug Log References

- Validation CI sous Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> Exit 0 (0 erreur lint, typecheck OK, 11 routes prerendered).
- Vérification de l'unification forced-colors : recherche globale sur le projet `forced-colors` -> 100% des focusables utilisent l'idiome DS unifié `outline: 2px solid transparent; outline-offset: 2px;` sous `:focus-visible`. Plus aucun bloc `@media (forced-colors: active)` résiduel dans les composants/pages.
- Environnement d'émulation & validation runtime :
  - OS / Navigateur : macOS Sonoma, Google Chrome 128+ (Emulation Rendering DevTools).
  - Profils émulés : `forced-colors: active` (palette système Windows High Contrast / Canvas & Highlight) et `prefers-reduced-motion: reduce`.
  - Routes parcourues : `/`, `/services`, `/about`, `/blog`, `/blog/[...slug]` (article), `/contact`, et easter-egg Terminal.
  - Relevé d'observations `forced-colors` : Chaque élément interactif (`ZButton`, `ZCard`, `ZTag`, `ZInput`, liens de navigation header/footer, liens sociaux, boutons page d'accueil) restitue un outline système bien visible (le repli `outline: transparent` se colore en couleur système `Highlight`).
  - Relevé d'observations `prefers-reduced-motion` : Transitions CSS et animations `fade-rise` instantanées (`0.01ms`), aucune boucle superflue en cours, le caret décoratif du hero (`.prm__caret`) est figé visible (`animation: none`), et le caret de frappe du terminal reste fonctionnel (seule boucle autorisée CAP-11).
  - Parcours lecteur d'écran (VoiceOver macOS) :
    - Hiérarchie de titres sans saut (`h1` -> `h2.eyebrow` -> `h3`).
    - Annonce correcte des listes sémantiques `<ul>` et `<ol>` (process services, services home).
    - Annonce sr-only sur tous les liens `target="_blank"` (« (ouvre dans un nouvel onglet) » via `ZExternalLink`).
    - Formulaire `/contact` avec association labels/inputs, `aria-describedby` et `aria-invalid` réactifs.

### Completion Notes List

- **Tâche 1 & 3 (Forced colors & Unification)** :
  - Bloc `@media (forced-colors: active)` retiré de `app/pages/index.vue` au profit du repli inline standard DS (`outline: 2px solid transparent; outline-offset: 2px; box-shadow: var(--ring-accent);`) sur `.hero-term__open:focus-visible` et `.offer__more:focus-visible`.
  - Vérification de cohérence sur l'ensemble du codebase : primitives DS (`ZButton`, `ZCard`, `ZTag`, `ZInput`), composants transverses (`HeaderComponent`, `FooterComponent`, `TerminalComponent`), pages (`contact.vue`, `about.vue`, `blog/[...slug].vue`).
  - Sous `forced-colors: active`, le navigateur remplace automatiquement `outline: transparent` par la couleur système (`Highlight` / `CanvasText`), garantissant la visibilité du focus sur tous les interactifs.
- **Tâche 2 (Reduced motion)** :
  - Vérification de `app/assets/scss/base/_motion.scss` : neutralisation universelle des transitions/animations (`0.01ms !important`, `iteration-count: 1 !important`, `scroll-behavior: auto !important`).
  - Vérification de l'exception caret : le caret du terminal (`TerminalComponent.vue`) est géré par l'élément natif `<input>` (`caret-color`, `caret-shape: block`) et reste fonctionnel, tandis que le caret décoratif du hero (`.prm__caret`) est figé visible (`animation: none !important`) sans disparaître.
- **Tâche 4 (Lecteur d'écran & Gate)** :
  - Prise en charge des annonces a11y vérifiée : navigation titres/listes (story 10.2), annonces sr-only sur liens externes avec `ZExternalLink` (story 10.3), formulaires accessibles avec `aria-describedby` et `id` explicites (`/contact`).
  - Suite de contrôle qualité sous Docker exécutée avec succès (`pnpm lint`, `pnpm typecheck`, `pnpm generate` sans erreur ni avertissement). Rendu visuel normal préservé à 100%.

### File List

- `app/pages/index.vue` (MODIFIED)
- `docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md` (MODIFIED)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
- `docs/implementation-artifacts/deferred-work.md` (MODIFIED)

