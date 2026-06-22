---
baseline_commit: 743f6b56dd4a315f08706cb01b354654ebd733e4
---

# Story 2.7: Iconographie

Status: review

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

- [x] Tâche 1 — Intégrer Lucide via CDN (AC: #1, #2)
  - [x] Icônes au trait style Lucide (`stroke="currentColor"`, `fill="none"`, `stroke-width 2`, `viewBox 0 0 24 24`) portées dans `ZIcon.vue`.
  - [x] **Stratégie retenue (documentée)** : composant `ZIcon.vue` rendant des **SVG inline** depuis un set interne, **et non** un script Lucide CDN (qui muterait le DOM côté client → trou/FOUC au `nuxi generate` + dépendance réseau). Set porté de `icons.jsx`. Prerender-safe.
  - [x] Icônes en `currentColor` (héritent de `color`) et dimensionnées en `em` (`.zicon { width:1em; height:1em }`) — prouvé : `stroke/fill="currentColor"` dans la sortie.
- [x] Tâche 2 — Glyphes sociaux en SVG inline (AC: #1, #2)
  - [x] Glyphes **GitHub / Twitter(X) / LinkedIn** (+ WordPress) portés en SVG inline `fill="currentColor"` dans `ZIcon` (mêmes paths que `LinkListComponent.vue`/`icons.jsx`).
  - [x] Centralisés dans `ZIcon` (set unique) → réutilisables par le footer/hexagones (story 2.8). `LinkListComponent` legacy laissé intact (sa refonte = 2.8).
- [x] Tâche 3 — Logo diamant SVG (AC: #1)
  - [x] Logo diamant `gem` fourni en SVG inline dans `ZIcon` (carré pivoté en `currentColor` + facette haute éclairée `#fff`/0.12, esprit « lit from above » du logo de marque). Hérite/contrôle la couleur.
  - [x] Disponible via `<ZIcon name="gem">` (dimensionnable en 24px). Le **swap du header** PNG→SVG est hors périmètre (châssis = story 2.8) ; le PNG blanc reste acceptable d'ici là (dark-first, un seul thème).
- [x] Tâche 4 — Vérification (AC: #1, #2)
  - [x] Rendu prouvé par build (page smoke temporaire, supprimée) : 12 `<svg class="zicon">`, icônes trait `viewBox 0 0 24 24`+`stroke="currentColor"`, glyphes marque `viewBox 0 0 16 16`+`fill="currentColor"`, gem (diamant), icône inconnue → svg vide (pas de crash). a11y : décoratif `aria-hidden="true"` / labellisé `role="img" aria-label`.
  - [x] **Aucune `@font-face` d'icônes** introduite (grep fontawesome/icomoon/material-icons → néant). (AC #2)
  - [x] `pnpm lint` **exit 0** ; `pnpm typecheck` **exit 0** ; `pnpm generate` **exit 0** (24 routes ; icônes prerendues inline, pas de dépendance CDN).

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

claude-opus-4-8[1m] (Amelia / BMad dev-story)

### Debug Log References

- `pnpm lint` → exit 0 ; `pnpm typecheck` → exit 0 ; `pnpm generate` → exit 0 (24 routes). Verts du premier coup.
- Preuves sortie (page smoke temporaire) : 12 `<svg class="zicon">` ; icônes trait `viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"` ; glyphes marque `viewbox="0 0 16 16" fill="currentColor"` ; gem `<path d="M12 1.5 22.5 12 12 22.5 1.5 12z" fill="currentColor"/>` + facette ; `currentColor` ×13 ; `role="img" aria-label="GitHub"` vs `aria-hidden="true"` ; icône inconnue → `<svg…></svg>` vide ; aucune icon-font dans le CSS.
- Note SSR : la sérialisation statique met `viewBox`→`viewbox` (minuscules) ; le parser HTML du navigateur ré-ajuste automatiquement la casse des attributs SVG (`viewBox`, `preserveAspectRatio`…) — rendu/scaling corrects.

### Completion Notes List

- **`components/ui/ZIcon.vue` créé** : composant unique rendant des SVG inline `currentColor`, taille `1em`. Set porté de `icons.jsx` :
  - **Icônes au trait** (style Lucide, `viewBox 24`, `stroke=currentColor`, `stroke-width 2`) : arrow, terminal, code, layers, bot, spark, mail, pin, check, zap.
  - **Glyphes de marque** (`fill=currentColor`) : github/twitter/linkedin (`viewBox 16`), wp (`viewBox 24`).
  - **Logo `gem`** (`viewBox 24`) : carré pivoté en `currentColor` + facette haute `#fff`/0.12 (lit-from-above).
- **Décision Lucide CDN → SVG inline** : le DS mentionne « Lucide via CDN » comme stand-in ; un script CDN qui remplace des `<i data-lucide>` au runtime laisse un trou au prerender (`nuxi generate`) et dépend du réseau (NFR4). Choix d'un set inline dans `ZIcon` → icônes présentes dans le HTML statique, zéro JS client requis. **AC #2 respecté : aucune police d'icône** (pas de Font Awesome/icon font, pas d'`@font-face`).
- **Rendu via `v-html`** d'un set **100 % statique interne** (aucune entrée utilisateur interpolée) → `eslint-disable vue/no-v-html` justifié (même pattern contrôlé que `TerminalComponent`). Icône inconnue → fallback svg vide (pas de crash, prerender-safe).
- **a11y** : décoratif par défaut (`aria-hidden="true"`) ; prop `label` → `role="img"` + `aria-label` pour les icônes porteuses de sens.
- **Centralisation (Tâche 2)** : les glyphes sociaux sont désormais dans `ZIcon` (source unique). `LinkListComponent`/`HexagonLinkComponent` legacy **non modifiés** — leur refonte (et le swap du logo header PNG→`<ZIcon name="gem">`) relèvent de la story 2.8 (châssis). Périmètre 2.7 = fournir le système, pas câbler les consommateurs.
- **Consommation prête** : `ZButton`/`ZInput` (slots `icon`) peuvent recevoir `<ZIcon name="…" />` ; aucun changement requis sur ces primitives.

### File List

- `app/components/ui/ZIcon.vue` (CRÉÉ) — système d'icônes DS (trait Lucide + glyphes marque + logo gem), SVG inline `currentColor`.

## Change Log

| Date | Version | Description | Auteur |
|------|---------|-------------|--------|
| 2026-06-22 | 0.1 | Système d'iconographie `ZIcon.vue` : SVG inline `currentColor` (icônes trait Lucide + glyphes github/twitter/linkedin/wp + logo diamant gem), prerender-safe, a11y label. Aucune icon-font. Lint/typecheck/generate verts, rendu prouvé. Status → review. | Amelia (dev-story) |
