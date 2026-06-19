---
project_name: 'jouan.ovh'
user_name: 'Simon'
date: '2026-06-18'
sections_completed:
  ['technology_stack', 'language_framework', 'code_quality', 'workflow_testing', 'critical_rules']
status: 'complete'
optimized_for_llm: true
existing_patterns_found: 12
---

# Project Context for AI Agents

_Ce fichier contient les règles et patterns critiques que les agents IA doivent suivre lors de l'implémentation de code dans ce projet. Il se concentre sur les détails non évidents que les agents pourraient manquer._

---

## Technology Stack & Versions

- **Framework :** Nuxt 3 (`^3.3.1`), SSR activé, avec `@nuxt/bridge-edge` (configuration hybride). `experimental.payloadExtraction: false`.
- **UI :** Vue 3 — majoritairement `<script setup lang="ts">`, mais certains composants legacy utilisent l'Options API (`export default { name }`) et `vue-property-decorator` (`experimentalDecorators: true` dans tsconfig).
- **Langage :** TypeScript `^4.9.5`.
- **Styles :** SCSS (`sass ^1.59.2`) via le système de modules `@use ... as`. Architecture à tokens sous `assets/scss/abstract/` (échelle de couleurs Radix 12 paliers).
- **Contenu :** `@nuxt/content ^2.5.2` (blog), `@nuxt/image-edge` (`<nuxt-img>` / `<nuxt-picture>`).
- **Lint :** ESLint (`@nuxtjs/eslint-config-typescript` + `plugin:prettier/recommended`, `max-len: 120`), Prettier (double quotes, points-virgules), Stylelint + `stylelint-scss`.
- **Gestionnaire de paquets :** pnpm (`pnpm-lock.yaml`) — dev via Docker (cf. Workflow).
- **Déploiement :** site statique (`nuxi generate`) → `push-dir` vers la branche `gh-pages` (GitHub Pages, domaine custom via `CNAME`).
- **Divers :** `ua-parser-js` (détection device, terminal).

> ⚠️ **PRÉREQUIS — Mise à jour complète de la stack avant la refonte.**
> Les versions ci-dessus sont l'état AVANT migration. Le projet doit être
> entièrement mis à niveau **avant** d'implémenter le nouveau design system :
> - **Nuxt 3 → Nuxt 4** (et abandon de `@nuxt/bridge-edge`, devenu inutile).
> - Vue 3, TypeScript 5.x, `sass`, `@nuxt/content`, `@nuxt/image`, ESLint 9 /
>   flat config, Prettier, Stylelint — toutes les dépendances à jour.
> - Re-valider la chaîne `nuxi generate` → `gh-pages` après migration.
> Cette migration est la **première étape** du plan (épic « Migration stack »),
> en amont des fondations design.

## Critical Implementation Rules

### Règles Langage & Framework (TypeScript · Nuxt · Vue · SCSS)

**TypeScript / Vue**
- Préférer `<script setup lang="ts">` pour tout NOUVEAU composant. Le code legacy
  en Options API + `vue-property-decorator` existe mais ne doit PAS être étendu —
  à migrer/supprimer pendant la mise à jour de la stack.
- `experimentalDecorators: true` n'est là que pour le legacy — ne pas introduire
  de nouveaux décorateurs de classe.
- Imports composants via l'alias `~/` ou `@/` (les deux pointent sur project-root).

**Nuxt**
- Cible de build = site **STATIQUE** (`nuxi generate`) → tout code doit être
  compatible prerender : pas d'accès `window`/`document` hors `onMounted` ou
  garde `import.meta.client`.
- Pages dans `pages/`, layout `layouts/default.vue`, auto-import des composants
  activé (pas d'import manuel pour la plupart).
- Images TOUJOURS via `<nuxt-img>` / `<nuxt-picture>` (@nuxt/image), jamais
  `<img>` brut. Assets statiques dans `public/images/`.
- Blog alimenté par `@nuxt/content` (markdown) — route `blog/[...slug].vue`.

**SCSS (règle critique)**
- Système `@use ... as _alias` UNIQUEMENT — jamais `@import` (déprécié).
- Pattern de theming : un composant déclare des CSS custom properties locales à
  partir des tokens SCSS, puis les consomme via `var()`. Ex :
  `--header-color-background: #{_color.$dark-background};` puis
  `background-color: var(--header-color-background);`
- Styles dans `<style lang="scss" scoped>` par composant. Tokens sous
  `assets/scss/abstract/` ; ne pas hardcoder couleurs/espaces/rayons — passer
  par les tokens.

### Qualité de code & conventions

**Lint / format**
- ESLint + Prettier : double quotes, points-virgules, `max-len: 120`.
  `prefer-const` en erreur. Stylelint + `stylelint-scss` pour le SCSS.
- `no-console` / `no-debugger` : warning en production uniquement.

**Conventions de nommage**
- Composants : PascalCase suffixé `Component` (`HeaderComponent.vue`,
  `FooterComponent.vue`). Les cartes sont préfixées `Z` (`ZCardComponent`,
  `ZCardHeader`, `ZCardBody`, `ZCardFooter`).
- Sous-système terminal sous `components/terminal/` : `programs/` = classes TS
  implémentant `IProgram`, `interfaces/` = contrats (`I*` + barrel `index.ts`).
- Tokens SCSS : fichiers partiels `_nom.scss`, importés en `_alias`
  (ex. `@use "...color" as _color`).

**Organisation**
- SCSS structuré en `abstract/` (tokens, mixins, fonctions), `base/` (reset),
  `components/`, `pages/`. Point d'entrée global `assets/scss/main.scss`.
- Copier les SVG/PNG du design system depuis `docs/design_system/assets/` vers
  `public/images/` ou `assets/` lors de l'implémentation.

**Langue**
- UI et contenu en FRANÇAIS (`lang="fr"`). Voix : 1re personne « je »,
  vouvoiement. Pas d'emoji (cf. guidelines du design system).

### Workflow de développement

**Git**
- Branche principale : `main`. Intégration : `develop`. Travail par branches de
  feature (ex. refonte en cours : `feat/design-system-revamp`).
- Commits conventionnels : `feat:`, `fix:`, `style:`, etc. (cf. historique).

**Environnement de dev : Docker (obligatoire)**
- ⚠️ **Tout le dev passe par Docker** (`docker-compose.yml`, Node 22 LTS + pnpm
  via corepack). Ne PAS lancer `pnpm`/`nuxi` directement sur l'hôte (macOS arm64) :
  les `node_modules` natifs (better-sqlite3, sharp, esbuild…) sont compilés pour
  le conteneur Linux et vivent dans un volume nommé isolé de l'hôte.
- Lancer le dev : `docker compose up` → `pnpm dev` sur http://localhost:3000.
- Commande ponctuelle (lint, typecheck, generate…) :
  `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`.
- Stopper : `docker compose down`.

**Build & déploiement**
- Gestionnaire de paquets : **pnpm** (`packageManager: pnpm@…`, lockfile
  `pnpm-lock.yaml`). Ne pas utiliser `npm`/`yarn`.
- Validation : `pnpm lint` (eslint + stylelint) + `pnpm typecheck` (`nuxi typecheck`
  / vue-tsc) + build `pnpm generate` — tout doit passer (cf. section Tests).
- Build statique : `pnpm generate` → sortie `.output/public`.
- Déploiement : `pnpm deploy` (`push-dir` vers la branche `gh-pages`).
- ⚠️ Le domaine custom dépend du fichier `CNAME` — ne pas le perdre lors du
  déploiement gh-pages (régression déjà survenue, cf. commit `cf1829e`).

### Tests
- ❌ Aucun framework de test configuré à ce jour (pas de Vitest/Jest/Playwright).
- Validation actuelle = lint (`eslint`, `stylelint`) + `pnpm typecheck` (vue-tsc) +
  build `pnpm generate`, le tout via Docker et sans erreur. Barre de qualité minimale.
- Si des tests sont introduits pendant la migration, documenter la convention ici.

### Règles critiques à ne pas manquer

**Port du design system (React/CSS → Vue/SCSS)**
- Le design system source (`docs/design_system/`) est en **React + CSS custom
  properties**. NE PAS copier les `.jsx` tels quels : recréer chaque primitive en
  composant Vue 3 (`<script setup>`), en réutilisant les tokens.
- Source de vérité des valeurs = `docs/design_system/tokens/*.css` et
  `styles.css`. Stratégie : porter ces tokens vers `assets/scss/abstract/` (ou
  les exposer en CSS vars globales) plutôt que de redéfinir des valeurs.
- Le `ui_kits/jouan-site/` est la **référence visuelle cible** des pages (Home,
  Services, About, Blog, Contact, Terminal) — s'y reporter pour le rendu.

**À préserver pendant la refonte**
- La **fonctionnalité terminal** draggable (`components/terminal/`) est un
  easter-egg à conserver — le design system la garde comme feature secondaire.
- Le **dark-first** : pas de thème clair. Surfaces sombres teintées aubergine,
  orange Ubuntu comme unique accent héros.
- Respect de `prefers-reduced-motion` ; seule animation en boucle = le caret du
  terminal.

**Pièges**
- Compatibilité prerender (site statique) : tout accès DOM doit être gardé.
- Ne pas casser `CNAME` / le déploiement gh-pages.
- Faire la migration de stack AVANT la refonte (cf. prérequis en tête de fichier).

---

## Usage Guidelines

**Pour les agents IA :**
- Lire ce fichier AVANT toute implémentation.
- Suivre toutes les règles ; en cas de doute, choisir l'option la plus restrictive.
- Mettre à jour ce fichier si de nouveaux patterns émergent.

**Pour les humains :**
- Garder le fichier court et focalisé sur les besoins des agents.
- Mettre à jour quand la stack change (notamment après la migration Nuxt 4).
- Revue périodique ; retirer les règles devenues évidentes.

Dernière mise à jour : 2026-06-18
