# Story 2.7: Iconographie

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a développeur,
I want un système d'icônes cohérent,
so that l'UI utilise des icônes au trait et les glyphes de marque (UX-DR10).

## Acceptance Criteria

1. **Given** l'approche DS (Lucide CDN + SVG inline), **When** on intègre Lucide (`currentColor`), les glyphes sociaux en SVG inline et le logo diamant, **Then** les icônes héritent de la couleur du texte.
2. **Given** l'intégration, **When** on rend l'UI, **Then** aucune police d'icône n'est introduite.

> Périmètre : **système d'icônes** — icônes au trait (Lucide via CDN, `currentColor`), glyphes sociaux en SVG inline (GitHub / X / LinkedIn), logo diamant SVG. S'appuie sur les tokens (2.1). Les usages concrets (boutons, nav, footer) sont fournis par les stories qui consomment (`ZButton` 2.3, châssis 2.8, pages).

## Tasks / Subtasks

- [ ] Tâche 1 — Intégrer Lucide via CDN (AC: #1, #2)
  - [ ] Charger Lucide en stand-in (CDN), icônes au trait `stroke="currentColor"`, `fill="none"`, `stroke-width` ~2, `viewBox 0 0 24 24`.
  - [ ] Stratégie compatible prerender/SSR : préférer un composant `ZIcon`/wrapper rendant des SVG inline tirés du set (cf. `icons.jsx`) plutôt qu'un script CDN qui mute le DOM côté client (le DS appelle Lucide « via CDN » comme stand-in ; un set inline est plus sûr pour `nuxi generate`). Documenter le choix retenu.
  - [ ] Vérifier que les icônes héritent de `color` (donc `currentColor`) et se dimensionnent en `em` (ex. `1.05em`).
- [ ] Tâche 2 — Glyphes sociaux en SVG inline (AC: #1, #2)
  - [ ] Porter les glyphes de marque **GitHub / X(Twitter) / LinkedIn** en SVG inline `fill="currentColor"` (déjà présents dans `LinkListComponent.vue` et `icons.jsx`).
  - [ ] Centraliser ces glyphes (composant ou map) pour réutilisation par le footer/contact (story 2.8) et les hexagones.
- [ ] Tâche 3 — Logo diamant SVG (AC: #1)
  - [ ] Fournir le logo / marque diamant (gem) — actuellement en PNG (`public/images/logo*.png`, `docs/design_system/assets/brand/logo-*.png`, `logo-gem.png`). Si un SVG diamant n'existe pas, le créer en SVG inline minimaliste (carré pivoté + dégradé top-light) pour qu'il hérite/contrôle la couleur ; sinon réutiliser le PNG blanc pour le header (documenter).
  - [ ] Le logo header doit être net en 24px (cf. UI kit `.hdr__brand img { width:24px; height:24px }`).
- [ ] Tâche 4 — Vérification (AC: #1, #2)
  - [ ] `yarn dev` : une icône au trait posée dans un texte hérite de la couleur du parent (changer `color` → l'icône suit) ; glyphes sociaux idem dans un hexagone.
  - [ ] Aucune `@font-face` d'icônes (pas de Font Awesome / icon font) introduite. (AC #2)
  - [ ] `yarn lint` vert ; `yarn generate` vert (icônes prerendues, pas de FOUC dépendant du CDN).

## Dev Notes

### Contexte & contraintes (depuis project-context.md et SPEC)

- **Iconographie DS** : pas de police d'icône. Icônes = SVG inline `fill/stroke="currentColor"`. Lucide via CDN comme set de travail (thin stroke). Glyphes sociaux (GitHub/X/LinkedIn) et logo diamant restent SVG inline/marque. [Source: docs/design_system/README.md#ICONOGRAPHY]
- **`currentColor`** pour que les icônes héritent de la couleur du texte. [Source: docs/specs/spec-design-system-revamp/SPEC.md (UX-DR10) ; docs/design_system/README.md#ICONOGRAPHY]
- **Substitution** : Lucide est un stand-in ; seules vraies icônes de marque = glyphes sociaux + diamant. Signaler si un set self-hosted est préféré. [Source: docs/design_system/README.md#Caveats / substitutions]
- **Compatibilité prerender** : éviter un chargement d'icônes qui dépend de JS client post-hydration ; favoriser le SVG inline. [Source: docs/project-context.md#Nuxt]
- Dépend de 2.1 (tokens — couleurs/tailles).

### Fichiers à créer / modifier (lus — état actuel)

- **`components/ui/ZIcon.vue`** (CREATE, proposé) — wrapper qui rend un SVG inline du set (trait Lucide-style + glyphes de marque), `currentColor`, taille en `em`. Nom à confirmer ; auto-import Nuxt.
- **Réf. set source** : `docs/design_system/ui_kits/jouan-site/icons.jsx` — contient à la fois les icônes au trait (`arrow`, `terminal`, `code`, `layers`, `bot`, `spark`, `mail`, `pin`, `check`, `zap`, `wp`) et les glyphes de marque (`github`, `twitter`, `linkedin`, `wp`). Porter ces paths en Vue.
- **`components/LinkListComponent.vue`** (état actuel) — contient déjà les 3 glyphes sociaux SVG inline `fill="currentColor"` (GitHub viewBox 16, Twitter, LinkedIn), taille 20px, dans des `HexagonLinkComponent`. Source fiable pour centraliser les glyphes ; sera consommé/refondu par la story 2.8.
- **Logo** : `public/images/logo_white_32x32.png` (utilisé par `HeaderComponent.vue` aujourd'hui) ; assets de marque `docs/design_system/assets/brand/logo-white.png`, `logo-gem.png`, `logo-mark-32.png`. Pas de SVG diamant fourni → créer si besoin.
- **`nuxt.config.ts`** (UPDATE possible) — si chargement CDN Lucide via `<script>`/`<link>` dans `app.head` (déconseillé vs inline ; documenter si retenu).

### Mapping depuis `icons.jsx`

- Helper `S` : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` → base des icônes au trait.
- Glyphes de marque : `github` (viewBox 0 0 16 16, fill currentColor), `twitter`, `linkedin` (idem), `wp` (WordPress, fill currentColor, viewBox 24).
- Tailles d'usage : icônes boutons `~1.05em` (cf. `Button.jsx` `.ds-btn__icon`) ; hexagones `svg { width:20px; height:20px }` (cf. kit.css `.hex svg`). [Source: docs/design_system/ui_kits/jouan-site/kit.css]

### Pièges / régressions à éviter

- **Pas d'icon font** (AC #2 explicite) : ne pas ajouter Font Awesome / Material Icons / `@font-face` d'icônes.
- **Prerender vs CDN** : un script Lucide qui remplace des `<i data-lucide>` au runtime peut laisser un trou au prerender (`nuxi generate`) et dépend du réseau. Préférer SVG inline. (NFR4)
- **`currentColor` strict** : ne pas hardcoder de `fill`/`stroke` en couleur littérale sur les icônes — laisser hériter. (UX-DR10)
- **Logo couleur** : un PNG ne suit pas `currentColor` ; pour un logo qui change de teinte selon le thème, un SVG est requis — mais le site est dark-first (un seul thème), donc le PNG blanc reste acceptable pour le header. Documenter le choix.
- **Naming** : `ZIcon` (famille `ui/`).

### Project Structure Notes

- Set d'icônes centralisé sous `components/ui/` ; glyphes de marque réutilisés par le châssis (footer/hexagones, story 2.8) et les pages. Copier tout SVG/PNG de marque depuis `docs/design_system/assets/brand/` vers `public/images/`/`assets/` à l'usage. [Source: docs/project-context.md#Organisation]

### Testing standards

- Pas de framework de test. Validation = `yarn lint` + **`yarn generate` vert** (icônes présentes dans le HTML statique) + vérif `currentColor` (l'icône suit la couleur du texte parent). [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 2: Fondations du design system — Story 2.7]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md (UX-DR10), #Constraints]
- [Source: docs/specs/spec-design-system-revamp/primitives.md#Conventions (icônes Lucide CDN, glyphes inline, logo diamant)]
- [Source: docs/design_system/README.md#ICONOGRAPHY, #Caveats / substitutions]
- [Source: docs/design_system/ui_kits/jouan-site/icons.jsx ; kit.css (.hex svg, .ds-btn__icon)]
- [Source: components/LinkListComponent.vue (glyphes sociaux inline existants)]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
