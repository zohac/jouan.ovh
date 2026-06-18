# Story 1.2: Mettre à jour les modules et dépendances

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

> **Réalisée conjointement à la story 1.1** (décision utilisateur « tout en latest » + pnpm). Les modules ont été passés en latest réel dès la migration du cœur. Cette entrée consigne la vérification et l'état final.

## Story

As a mainteneur du site jouan.ovh,
I want mettre à jour Vue 3, TypeScript 5, sass, `@nuxt/content` et `@nuxt/image`,
so that toutes les dépendances sont alignées avec Nuxt 4 et sans deprecations bloquantes.

## Acceptance Criteria

1. **Given** les versions héritées dans `package.json`, **When** on met à jour les modules et on remplace `@nuxt/image-edge` par `@nuxt/image` stable, **Then** le blog (`@nuxt/content`) et les images (`<nuxt-img>` / `<nuxt-picture>`) fonctionnent.
2. **Given** la montée de version, **When** on compile et on démarre le projet, **Then** le code legacy `vue-property-decorator` est neutralisé ou migré (pas d'erreur de compilation).

> Périmètre : **mise à jour fine des modules & dépendances** uniquement, après le passage du cœur en Nuxt 4 (story 1.1). Le réalignement de l'outillage lint (ESLint 9 flat config) est la story 1.3. La validation `generate` + déploiement gh-pages est la story 1.4. Cette story doit laisser le projet **démarrant, compilant et lintable** (`yarn dev` OK, blog + images OK).

## Tasks / Subtasks

- [x] Tâche 1 — Remplacer `@nuxt/image-edge` par `@nuxt/image` stable (AC: #1)
  - [x] `@nuxt/image-edge` retiré de `package.json`
  - [x] `@nuxt/image@^2.0.0` ajouté (latest)
  - [x] `nuxt.config.ts` : `"@nuxt/image-edge"` → `"@nuxt/image"` dans `modules`
  - [x] `<nuxt-img>` / `<nuxt-picture>` rendent (vérifié au dev ET au `generate` : variantes `_ipx` produites pour logo + portrait)
- [x] Tâche 2 — Mettre à jour `@nuxt/content` (AC: #1)
  - [x] `@nuxt/content@^3.14.0` (latest) — ajout de `better-sqlite3` (requis par v3)
  - [x] Entrée `"@nuxt/content"` conservée dans `modules`
  - [x] Pipeline blog se charge sans erreur (dump statique `__nuxt_content/blog/sql_dump.txt` généré)
  - [x] **Breaking change v2→v3 traité ici** (et non reporté) : `content.config.ts` ajouté, blog migré vers `queryCollection`/`<ContentRenderer>` (cf. story 1.1). Le redesign blog complet reste l'épopée 6.
- [x] Tâche 3 — Aligner Vue 3, TypeScript et sass (AC: #1, #2)
  - [x] `typescript` monté à `^6.0.3` (au-delà de TS 5 visé — décision « latest »)
  - [x] `vue` tiré par `nuxt@^4` (non figé)
  - [x] `sass` monté à `^1.101.0` (compatible Vite)
  - [x] `pnpm install` OK (lockfile généré, aucun conflit bloquant)
- [x] Tâche 4 — Neutraliser ou migrer `vue-property-decorator` (AC: #2)
  - [x] Recensement : **aucun composant** n'utilise `vue-property-decorator` (legacy déjà absent du code)
  - [x] `experimentalDecorators: true` conservé (dans `compilerOptions`) ; dépendance gardée mais inutilisée
  - [x] `nuxi prepare` ne remonte aucune erreur de types bloquante
- [x] Tâche 5 — Vérification (AC: #1, #2)
  - [x] `pnpm dev` démarre ; `/`, `/about`, `/blog` → HTTP 200
  - [x] `<nuxt-picture>` (portrait about, logo header) affiche ses images (variantes `_ipx` au `generate`)
  - [x] Blog se charge sans régression (empty-state v3)
  - [x] `pnpm lint` ne se dégrade pas (flat config = story 1.3, désormais verte)

## Dev Notes

### Contexte & contraintes (depuis project-context.md et SPEC)

- **Gestionnaire de paquets : Yarn** — toujours `yarn`, jamais `npm`. [Source: docs/project-context.md#Build & déploiement]
- **Cible de migration (CAP-1) :** Nuxt 4 + Vue 3 + **TypeScript 5** + ESLint 9 (flat config), abandon de `@nuxt/bridge-edge`, **toutes deps à jour**. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Decisions]
- **Images TOUJOURS via `<nuxt-img>` / `<nuxt-picture>`** (@nuxt/image), jamais `<img>` brut — le module doit donc rester fonctionnel après la bascule edge → stable. [Source: docs/project-context.md#Nuxt]
- **Blog alimenté par `@nuxt/content`** (markdown), route `blog/[...slug].vue`, dossier `content/` à créer ultérieurement (Epic 6). Ici, on ne casse pas le pipeline existant. [Source: docs/project-context.md#Nuxt ; docs/specs/spec-design-system-revamp/SPEC.md#Assumptions]
- **Code legacy Options API + `vue-property-decorator`** : à migrer/supprimer, ne pas étendre ; `experimentalDecorators` n'existe que pour ce legacy. [Source: docs/project-context.md#Règles Langage & Framework]
- **NFR8 (séquencement)** : FR1 (migration) doit être livrée et verte avant les stories de design (Epic 2+). [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]
- **Compatibilité prerender** : tout doit rester compatible `nuxi generate` (validé en story 1.4). [Source: docs/project-context.md#Nuxt]

### Fichiers à modifier (lus — état actuel)

- **`package.json`** (UPDATE) — état actuel `devDependencies` pertinentes : `@nuxt/content ^2.5.2`, `@nuxt/image-edge 1.0.0-27968280.9739e4d`, `typescript ^4.9.5`, `sass ^1.59.2`, `vue-property-decorator ^9.1.2`. Scripts à conserver (`dev`/`build`/`generate`/`preview`/`postinstall`/`deploy`).
  - À changer : retirer `@nuxt/image-edge`, ajouter `@nuxt/image` stable ; monter `@nuxt/content` (stable Nuxt 4) ; monter `typescript` → `^5` ; aligner `sass`.
  - À conserver : `vue-property-decorator` tant que le legacy vit (cf. Tâche 4) ; `ua-parser-js` (dépendance runtime du terminal).
  - Note : `@nuxt/bridge`, `@nuxt/webpack`, `@nuxt/webpack-builder` sont retirés en **story 1.1** — ne pas les réintroduire ici.
- **`nuxt.config.ts`** (UPDATE) — état actuel : `modules: ["@nuxt/content", "@nuxt/image-edge"]`. Remplacer `"@nuxt/image-edge"` par `"@nuxt/image"`. Ne pas toucher `app.head`, `css`, `ssr: true`, `experimental.payloadExtraction: false`.
- **`tsconfig.json`** (lecture/UPDATE) — `extends: "./.nuxt/tsconfig.json"` + `experimentalDecorators: true`. Conserver `experimentalDecorators` tant que `vue-property-decorator` est présent (cf. AC #2).

### Spécificités techniques à jour (doc officielle / modules)

- **`@nuxt/image` (stable)** remplace `@nuxt/image-edge` : le préfixe `-edge` désignait une pré-release nocturne, désormais inutile. Installation recommandée : `yarn dlx nuxi module add image` (ajoute la dep et l'entrée `modules`), ou `yarn add -D @nuxt/image` + édition manuelle de `modules`. Les composants `<nuxt-img>` / `<nuxt-picture>` restent auto-importés. [Source: https://nuxt.com/docs/4.x/api/components/nuxt-img — Setup ; https://image.nuxt.com/get-started/installation]
- **`@nuxt/content`** : installation `yarn dlx nuxi module add content`. Vérifier la majeure résolue — `@nuxt/content` v3 introduit des changements d'API (collections / `content.config.ts`, requêtes via `queryCollection` au lieu de `queryContent`). Si la résolution monte en v3, **noter le breaking change** pour l'implémentation blog (Epic 6) ; l'objectif ici est seulement que le module **se charge** et que le pipeline existant ne casse pas le démarrage. [Source: https://nuxt.com/docs/4.x/directory-structure/content — Enable Nuxt Content]
- **Vue / Nuxt 4** : la version de `vue` est gérée par `nuxt@^4` (peer/transitive) — éviter d'épingler un `vue` divergent qui créerait un conflit. [Source: https://nuxt.com/docs/4.x/getting-started/upgrade]
- **TypeScript 5** : aligné sur la cible CAP-1 ; Nuxt 4 génère des `tsconfig` séparés, l'`extends` racine reste supporté. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Decisions]
- **`vue-property-decorator`** : librairie de décorateurs de classe pour l'Options API ; non maintenue activement. La voie « port, pas extension » du projet veut qu'on ne l'étende pas. Neutralisation = la garder isolée au legacy ; migration = réécrire le composant en `<script setup>`. [Source: docs/project-context.md#Règles critiques à ne pas manquer]

### Pièges / régressions à éviter

- **Ne pas oublier la double mise à jour** pour l'image : changer la dep dans `package.json` ET l'entrée dans `modules` de `nuxt.config.ts` (les deux pointaient sur `-edge`).
- **`@nuxt/content` v2 → v3** : si la majeure saute, `queryContent()` et la structure de dossier peuvent changer ; ne pas réécrire le blog ici, juste constater que le module se charge et **documenter** l'écart pour Epic 6.
- **Conflits de peer-deps** au `yarn install` (vue / @vue/* / sass) — résoudre en s'alignant sur ce que tire `nuxt@^4`, pas en figeant des versions arbitraires.
- **Retirer `experimentalDecorators` trop tôt** casserait les composants `vue-property-decorator` (AC #2) — ne le faire que si TOUS les usages sont migrés.
- **Compat prerender** : si la mise à jour des modules introduit un accès DOM non gardé (ex. via @nuxt/image en SSG), garder `onMounted` / `import.meta.client`. Validation réelle du `generate` = story 1.4.

### Project Structure Notes

- Aucune nouvelle entité / base de données. La structure de dossiers (racine vs `app/`) est fixée en story 1.1 ; cette story ne la modifie pas.
- Le dossier `content/` du blog est créé plus tard (Epic 6) ; ici on ne fait que mettre à jour le module `@nuxt/content`.

### Testing standards

- Pas de framework de test (pas de Vitest/Jest/Playwright). [Source: docs/project-context.md#Tests]
- Validation = `yarn lint` (ne pas dégrader) + **`yarn dev` démarre**, blog et images fonctionnent. La validation `yarn generate` + déploiement est la **story 1.4**. [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 1: Migration de la stack vers Nuxt 4 — Story 1.2]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#Capabilities (CAP-1), #Decisions, #Constraints, #Assumptions]
- [Source: docs/project-context.md#Technology Stack & Versions, #Règles Langage & Framework, #Règles critiques à ne pas manquer, #Tests]
- [Source: https://nuxt.com/docs/4.x/api/components/nuxt-img — Setup @nuxt/image]
- [Source: https://nuxt.com/docs/4.x/directory-structure/content — Enable Nuxt Content]
- [Source: https://nuxt.com/docs/4.x/getting-started/upgrade — Upgrade to Nuxt 4]

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Amelia / BMad dev-story)

### Debug Log References

- Modules vérifiés au `pnpm generate` : `@nuxt/image` produit les variantes `_ipx` (logo + portrait), `@nuxt/content` v3 émet `__nuxt_content/blog/sql_dump.txt`.

### Completion Notes List

- Versions finales : `@nuxt/content@3.14`, `@nuxt/image@2.0`, `sass@1.101`, `typescript@6.0`, `ua-parser-js@2.0`. Gestionnaire **pnpm** (et non Yarn).
- **`@nuxt/content` v2→v3** : breaking change traité (pas seulement constaté) — `content.config.ts` + migration des requêtes blog (`queryCollection`/`<ContentRenderer>`). Redesign blog complet = épopée 6.
- **`vue-property-decorator`** : aucun usage dans le code → AC #2 trivialement satisfait ; dépendance conservée mais inutilisée (à supprimer plus tard).
- `ua-parser-js` v2 : import nommé `{ UAParser }` ; `@types/ua-parser-js` retiré (types embarqués).

### File List

Voir story 1.1 (changements réalisés conjointement). Spécifiques aux modules : `package.json` (deps modules), `nuxt.config.ts` (`@nuxt/image`), `content.config.ts` (créé), `pages/blog/index.vue`, `pages/blog/[...slug].vue`, `components/terminal/programs/SystemInfos.ts`.

## Change Log

| Date | Version | Description | Auteur |
|------|---------|-------------|--------|
| 2026-06-18 | 0.1 | Modules en latest (content 3, image 2, sass, TS 6, ua-parser 2) — réalisé avec 1.1. Status → review. | Amelia (dev-story) |
