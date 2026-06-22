---
baseline_commit: 3f208e6e0ce2dbba70e7aea246a073833c9c6e57
---

# Story 2.4: Primitive ZCard

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a développeur,
I want un composant carte conforme au DS,
so that le contenu est présenté de façon cohérente (UX-DR3, FR3).

## Acceptance Criteria

1. **Given** la référence `Card.jsx` et les `ZCard*` existants, **When** on crée/refond `ZCard.vue` (fond `--bg-card`, bordure hairline, `--radius-md`, ombres + hairline), **Then** la carte rend conformément à la référence.
2. **Given** la nouvelle primitive, **When** on l'intègre, **Then** les usages existants de `ZCard*` sont migrés sans régression.

> Périmètre : **la primitive `ZCard.vue`** + **migration des usages existants** des cartes legacy (`components/card/ZCard*.vue`) pour éviter toute régression. S'appuie sur les tokens (2.1).

## Tasks / Subtasks

- [x] Tâche 1 — Créer `components/ui/ZCard.vue` (AC: #1)
  - [x] `<script setup lang="ts">`, `defineProps` typé (`withDefaults`) d'après `Card.d.ts` : `interactive`, `accent`, `featured`, `padded` (défaut `true`), `as` (défaut `"div"`).
  - [x] Élément polymorphe via `as` (`<component :is="as">`), slot par défaut. `class`/attrs hérités sur la racine (inheritAttrs par défaut → `class="home-card-w"` fusionne).
- [x] Tâche 2 — Style scoped via tokens (AC: #1)
  - [x] Base : `var(--bg-card)`, `var(--text-body)`, `1px solid var(--border-subtle)`, `var(--radius-md)`, `box-shadow var(--shadow-2), var(--shadow-hairline)`, `overflow:hidden`, `position:relative`.
  - [x] `padded` → `padding var(--space-6)`.
  - [x] `interactive` → `cursor:pointer` + hover `border-color var(--border-strong)`, `translateY(-2px)`, `box-shadow var(--shadow-3), var(--shadow-hairline)`.
  - [x] `accent` → `::before` barre 2px haut `linear-gradient(90deg, var(--accent), var(--aubergine-light))`.
  - [x] `featured` → `box-shadow var(--glow-accent), var(--shadow-hairline)` + bordure `var(--accent-ring)` (token le plus proche de la réf. `hsl(24 94% 53% / 0.35)` — même teinte accent translucide ; évite une valeur hardcodée, cf. revue 2.3).
  - [x] Transitions border-color/transform/box-shadow en `--dur-base` (`--ease-out` pour transform).
- [x] Tâche 3 — Migrer les usages existants de `ZCard*` (AC: #2)
  - [x] Consommateurs recensés : `pages/about.vue` (1 carte) et `pages/blog/index.vue` (2 cartes états erreur/vide). Aucun autre (layouts/composants).
  - [x] Stratégie **(a)** retenue : `ZCard` conteneur DS + sous-blocs `ZCardHeader`/`ZCardBody`/`ZCardFooter` **restylés via tokens**. Les pages passent `:padded="false"` (header image pleine largeur) ; les sous-blocs portent leur propre padding token.
  - [x] Migration sans régression : `<ZCardComponent>` → `<ZCard :padded="false">` dans les 2 pages ; sous-blocs débarrassés de leur dépendance au grid/vars du parent. **Régression dark-first corrigée** : titre `ZCardBody` passait de gris foncé (fond clair legacy) → `--text-strong` (lisible sur `--bg-card` sombre). `ZCardComponent.vue` legacy (fond gris + `bounce-in-fwd`) supprimé (orphelin).
- [x] Tâche 4 — Vérification (AC: #1, #2)
  - [x] Rendu prouvé par build : `about/index.html` → `<div class="zcard home-card-w">` (0 `<article>` legacy restant) ; `blog/index.html` → `<div class="zcard container-w50">`. CSS scoped émis : `.zcard{background:var(--bg-card)…}` + modifiers `--pad`/`--interactive`/`--accent`/`--featured` ; body title `color:var(--text-strong)`.
  - [x] `pnpm lint` **exit 0** ; `pnpm typecheck` **exit 0** ; `pnpm generate` **exit 0** (24 routes prerendues, cartes incluses).

## Dev Notes

### Contexte & contraintes (depuis project-context.md et SPEC)

- **Port, pas copie** ; **tokens, pas de valeurs en dur** ; SCSS `@use`/`<style scoped>`. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]
- **Cible** : `components/ui/ZCard.vue` ; « remplace/refond les `ZCard*` existants ». [Source: docs/specs/spec-design-system-revamp/primitives.md]
- **Cartes DS** : `--bg-card`, 1px `--border-subtle`, `--radius-md`, `--shadow-2 + --shadow-hairline` ; quiet by default (le contenu est le héros) ; accent left/top optionnel sur cartes en vedette. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Cards]
- Dépend de 2.1 (tokens).

### Fichiers à créer / modifier (lus — état actuel)

- **`components/ui/ZCard.vue`** (CREATE) — nouvelle primitive conteneur DS.
- **`components/card/ZCardComponent.vue`** (état actuel) — `<article>` + slot ; style legacy : `--article-color-background: #{_color.$background}` (gris clair !), `box-shadow` legacy, animation `bounce-in-fwd`, grille `header/section/footer`. **À refondre/remplacer** : le fond clair et le bounce sont incompatibles dark-first/motion DS.
- **`components/card/ZCardHeader.vue`** (état actuel) — `<nuxt-picture>` (image 16/9, max-height 256px). À conserver/adapter comme sous-bloc image si la composition le requiert (garder `<nuxt-picture>` — règle images DS).
- **`components/card/ZCardBody.vue`** (état actuel) — `<section>` slots `title`/`body`, couleur `--zcb-color-text: #{_color.$gray-5}`, animation `fadeIn`. À restyler via tokens (`--text-body`/`--text-strong`).
- **`components/card/ZCardFooter.vue`** (état actuel) — `<footer>` contenant `<LinkListComponent/>` (hexagones sociaux). Dépend du châssis socials (story 2.8) — ne pas casser ici.
- **Réf. source** : `docs/design_system/components/core/Card.jsx`, `Card.d.ts`, `Card.prompt.md`.

### Mapping props (depuis `Card.d.ts`)

| Prop | Type | Défaut | Effet |
|---|---|---|---|
| `interactive` | `boolean` | `false` | hover lift + bordure plus claire |
| `accent` | `boolean` | `false` | barre orange→aubergine en haut |
| `featured` | `boolean` | `false` | anneau de glow orange (offre recommandée) |
| `padded` | `boolean` | `true` | padding interne `--space-6` |
| `as` | élément | `"div"` | polymorphe |

### Pièges / régressions à éviter

- **Régression visuelle** : AC #2 exige une migration **sans régression**. Le legacy `ZCardComponent` a un fond **clair** (`$background = gray-0`) et un `bounce-in-fwd` — passer au fond `--bg-card` (sombre) + retirer le bounce (motion DS : fades/translate courts). Vérifier chaque page consommatrice.
- **Images** : conserver `<nuxt-picture>`/`<nuxt-img>` (jamais `<img>` brut). [Source: docs/project-context.md#Nuxt]
- **Footer socials** : `ZCardFooter` tire `LinkListComponent` (hexagones) — la refonte hexagones est la story 2.8 ; ici ne pas casser, restyle minimal.
- **Prerender** : retirer toute dépendance JS d'injection de style ; cartes statiques. (NFR4)
- **Naming** : `ZCard` (famille `ui/`), distinct des `ZCard*Component` legacy ; éviter collision de noms d'auto-import (le legacy est `ZCardComponent`, pas `ZCard` → pas de collision directe, mais vérifier).

### Project Structure Notes

- Nouveau `components/ui/ZCard.vue` ; les sous-blocs legacy `components/card/*` sont soit migrés vers la composition `ZCard` + slots, soit restylés via tokens. Décider d'une approche unique et la documenter. [Source: docs/specs/spec-design-system-revamp/primitives.md]

### Testing standards

- Pas de framework de test. Validation = `yarn lint` (eslint + stylelint) + **`yarn generate` vert** + vérif visuelle des pages qui utilisaient les cartes (pas de régression). [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 2: Fondations du design system — Story 2.4]
- [Source: docs/specs/spec-design-system-revamp/primitives.md (Card → components/ui/ZCard.vue ; remplace/refond les ZCard* existants)]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#Capabilities (CAP-3)]
- [Source: docs/design_system/components/core/Card.jsx, Card.d.ts, Card.prompt.md]
- [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Cards, Shadows]
- [Source: components/card/ZCardComponent.vue, ZCardHeader.vue, ZCardBody.vue, ZCardFooter.vue (état actuel)]

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Amelia / BMad dev-story)

### Debug Log References

- `pnpm lint` → exit 0 ; `pnpm typecheck` → exit 0 ; `pnpm generate` → exit 0 (24 routes).
- Preuves sortie : `about/index.html` `<div class="zcard home-card-w">` (grep `<article` = 0) ; `blog/index.html` `<div class="zcard container-w50">` ; `.zcard[data-v-…]{position:relative;overflow:hidden;background:var(--bg-card);color:var(--text-body);border:1px solid var(--border-subtle)…}` ; 4 modifiers `.zcard--{pad,interactive,accent,featured}` émis ; `color:var(--text-strong)` (titre body).

### Completion Notes List

- **`components/ui/ZCard.vue` créé** (`<script setup lang="ts">`) : props `interactive`/`accent`/`featured`/`padded`(def. true)/`as`(def. "div"), polymorphe `<component :is>`, slot par défaut. CSS porté de `Card.jsx` en `<style scoped>` 100 % tokens (pas de `ensureStyles()`/`document` → prerender-safe). Auto-import `ui/` sans préfixe (`<ZCard>`, config posée en 2.3).
- **Convention DS** : classes BEM `zcard--*` → `/* stylelint-disable selector-class-pattern */` inline en tête du `<style>` (même approche que `ZButton` après revue 2.3, pas de changement Stylelint global).
- **`featured`** : bordure via token `--accent-ring` (réf. `hsl(24 94% 53% / 0.35)` sans token exact ; `--accent-ring` = même teinte accent translucide, choix cohérent avec la revue 2.3 « tokens plutôt que valeurs hardcodées »).
- **Migration (AC#2)** : `about.vue` + `blog/index.vue` (3 cartes) passées de `<ZCardComponent>` à `<ZCard :padded="false">`. `:padded="false"` car l'image `ZCardHeader` est pleine largeur ; les sous-blocs portent leur propre padding `var(--space-4)` (= 16px, parité avec le legacy `$space-inset-16x`).
- **Sous-blocs restylés via tokens** (retrait de la dépendance au grid `header/section/footer` et aux vars du parent `--article-space-inset`/`--main-space-inset`) :
  - `ZCardHeader.vue` : retrait `grid-area: header` (image pleine largeur conservée, `<nuxt-picture>` intact).
  - `ZCardBody.vue` : `padding var(--space-4)`, `color var(--text-body)`, **titre `color var(--text-strong)`** — corrige la régression dark-first (le titre était en gris foncé, illisible sur le fond sombre `--bg-card`). Animation `fadeIn` conservée (fade conforme motion DS).
  - `ZCardFooter.vue` : `padding var(--space-4)` (token), retrait `grid-area`/vars parent. `LinkListComponent` (hexagones socials) intact — refonte = story 2.8.
- **`ZCardComponent.vue` supprimé** : conteneur grille legacy (fond gris clair `$gray-0` + `bounce-in-fwd`, incompatibles dark-first/motion DS) devenu orphelin après migration → supprimé (zéro dette). Remplacé par `ZCard` + sous-blocs.
- **Legacy non concerné préservé** : tokens SCSS `$` et `_button.scss` intacts.

### File List

- `app/components/ui/ZCard.vue` (CRÉÉ) — primitive carte DS.
- `app/components/card/ZCardComponent.vue` (SUPPRIMÉ) — conteneur grille legacy orphelin (remplacé par `ZCard`).
- `app/components/card/ZCardBody.vue` (MODIFIÉ) — restyle tokens, titre `--text-strong` (fix dark-first), padding `--space-4`.
- `app/components/card/ZCardHeader.vue` (MODIFIÉ) — retrait `grid-area`.
- `app/components/card/ZCardFooter.vue` (MODIFIÉ) — padding token, retrait `grid-area`/vars parent.
- `app/pages/about.vue` (MODIFIÉ) — `<ZCard :padded="false">`, import `ZCardComponent` retiré.
- `app/pages/blog/index.vue` (MODIFIÉ) — 2 cartes `<ZCard :padded="false">`, import `ZCardComponent` retiré.

## Change Log

| Date | Version | Description | Auteur |
|------|---------|-------------|--------|
| 2026-06-21 | 0.1 | Primitive `ZCard.vue` (interactive/accent/featured/padded/as) 100 % tokens. Migration des 3 cartes (about + blog) vers `ZCard` + sous-blocs restylés ; suppression du conteneur grille legacy `ZCardComponent` ; fix dark-first du titre. Lint/typecheck/generate verts, rendu prouvé. Status → review. | Amelia (dev-story) |
