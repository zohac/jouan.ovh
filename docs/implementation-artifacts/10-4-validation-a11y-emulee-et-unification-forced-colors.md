---
baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
---

# Story 10.4: Validation a11y émulée OS-level et unification forced-colors

Status: ready-for-dev

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

- [ ] Tâche 1 — Émulation `forced-colors: active` (AC: focus visible)
  - [ ] Émuler le contraste forcé (Chrome DevTools : Rendering › « Emulate CSS media feature forced-colors: active », ou OS Windows High Contrast). Parcourir **toutes les pages** (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) + le terminal au clavier.
  - [ ] Vérifier que **chaque focusable** garde un focus visible (l'`outline` transparent → couleur système prend le relais des rings `box-shadow` neutralisés). Consigner les écrans/constats. Corriger tout focusable qui disparaîtrait (repli manquant).
- [ ] Tâche 2 — Émulation `prefers-reduced-motion: reduce` (AC: animations neutralisées, caret = seule boucle)
  - [ ] Émuler le motion réduit (Chrome DevTools : Rendering › « Emulate CSS media feature prefers-reduced-motion: reduce »). Vérifier que le filet global `app/assets/scss/base/_motion.scss` (9.2) **ramène à l'instantané** les entrées `fade-rise` et transitions ; qu'**aucune autre boucle** ne tourne ; que le **caret du terminal reste** (exception CAP-11) et que le caret déco du hero (`.prm__caret`) est **figé visible** (pas `opacity:0`).
  - [ ] Consigner ; corriger toute animation résiduelle non neutralisée.
- [ ] Tâche 3 — Unifier les deux idiomes forced-colors (AC: un seul idiome)
  - [ ] Aujourd'hui coexistent : (a) le **repli inline** `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (primitives DS `ZButton`/`ZCard`/`ZTag`/`ZInput` + châssis `HeaderComponent`/`FooterComponent` + pages `contact.vue`/`about.vue`/`blog/[...slug].vue`) ; (b) un **bloc page-level** `@media (forced-colors: active) { … outline: 2px solid … }` dans `app/pages/index.vue:600`. Choisir **un seul idiome** (recommandé : le repli inline `outline: transparent`, déjà majoritaire et porté par les primitives) et y **rabattre** le bloc d'`index.vue` (supprimer le `@media` page-level au profit du repli inline sur `.hero-term__open`/`.offer__more`). Rendu normal et forced-colors **identiques** après unification.
- [ ] Tâche 4 — Passage lecteur d'écran + validation (AC: tout)
  - [ ] Parcours lecteur d'écran (VoiceOver macOS au minimum) : titres, listes (10.2), liens externes (10.3), formulaire `/contact`, terminal. Consigner les anomalies éventuelles (sans forcément les corriger ici si hors périmètre — les router en revue).
  - [ ] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts ; rendu en mode normal **inchangé**.

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

### Debug Log References

### Completion Notes List

### File List
