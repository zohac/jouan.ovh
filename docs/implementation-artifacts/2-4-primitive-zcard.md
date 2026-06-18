# Story 2.4: Primitive ZCard

Status: ready-for-dev

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

- [ ] Tâche 1 — Créer `components/ui/ZCard.vue` (AC: #1)
  - [ ] `<script setup lang="ts">`, `defineProps` typé d'après `Card.d.ts` : `interactive`, `accent`, `featured`, `padded` (défaut `true`), `as` (défaut `"div"`).
  - [ ] Élément polymorphe via `as` (`<component :is="as">`), slot par défaut pour le contenu.
- [ ] Tâche 2 — Style scoped via tokens (AC: #1)
  - [ ] Base : `background var(--bg-card)`, `color var(--text-body)`, `border 1px solid var(--border-subtle)`, `border-radius var(--radius-md)`, `box-shadow var(--shadow-2), var(--shadow-hairline)`, `overflow: hidden`, `position: relative`.
  - [ ] `padded` → `padding var(--space-6)`.
  - [ ] `interactive` → `cursor:pointer` ; hover : `border-color var(--border-strong)`, `transform translateY(-2px)`, `box-shadow var(--shadow-3), var(--shadow-hairline)`.
  - [ ] `accent` → pseudo `::before` barre 2px en haut : `linear-gradient(90deg, var(--accent), var(--aubergine-light))`.
  - [ ] `featured` → `border-color hsl(24 94% 53% / 0.35)`, `box-shadow var(--glow-accent), var(--shadow-hairline)`.
  - [ ] Transitions border-color/transform/box-shadow en `--dur-base` (`--ease-out` pour transform).
- [ ] Tâche 3 — Migrer les usages existants de `ZCard*` (AC: #2)
  - [ ] Recenser les consommateurs de `ZCardComponent` / `ZCardHeader` / `ZCardBody` / `ZCardFooter` (cf. `pages/`, `layouts/`, autres composants).
  - [ ] Décider de la stratégie : (a) remplacer par `ZCard` + composition slots, ou (b) restyler le sous-système `card/*` existant via tokens. **Recommandé** : introduire `ZCard.vue` comme conteneur DS et migrer les usages vers lui, en conservant `ZCardHeader`/`ZCardBody`/`ZCardFooter` comme sous-blocs restylés si besoin (image header, body, footer socials).
  - [ ] Migrer chaque usage **sans régression visuelle bloquante** (la carte reste fonctionnelle : image, titre, contenu, footer socials).
- [ ] Tâche 4 — Vérification (AC: #1, #2)
  - [ ] `yarn dev` : les pages qui utilisaient `ZCard*` rendent toujours (pas d'erreur de composant manquant), avec le nouveau style DS.
  - [ ] `yarn lint` (eslint + stylelint) vert ; `yarn generate` reste vert (cartes prerendues OK).

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

### Debug Log References

### Completion Notes List

### File List
