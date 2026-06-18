# Story 1.2: Mettre à jour les modules et dépendances

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a mainteneur du site jouan.ovh,
I want mettre à jour Vue 3, TypeScript 5, sass, `@nuxt/content` et `@nuxt/image`,
so that toutes les dépendances sont alignées avec Nuxt 4 et sans deprecations bloquantes.

## Acceptance Criteria

1. **Given** les versions héritées dans `package.json`, **When** on met à jour les modules et on remplace `@nuxt/image-edge` par `@nuxt/image` stable, **Then** le blog (`@nuxt/content`) et les images (`<nuxt-img>` / `<nuxt-picture>`) fonctionnent.
2. **Given** la montée de version, **When** on compile et on démarre le projet, **Then** le code legacy `vue-property-decorator` est neutralisé ou migré (pas d'erreur de compilation).

> Périmètre : **mise à jour fine des modules & dépendances** uniquement, après le passage du cœur en Nuxt 4 (story 1.1). Le réalignement de l'outillage lint (ESLint 9 flat config) est la story 1.3. La validation `generate` + déploiement gh-pages est la story 1.4. Cette story doit laisser le projet **démarrant, compilant et lintable** (`yarn dev` OK, blog + images OK).

## Tasks / Subtasks

- [ ] Tâche 1 — Remplacer `@nuxt/image-edge` par `@nuxt/image` stable (AC: #1)
  - [ ] Retirer `@nuxt/image-edge` (`1.0.0-27968280.9739e4d`) de `package.json`
  - [ ] `yarn add -D @nuxt/image` (version stable compatible Nuxt 4 ; ou via `yarn dlx nuxi module add image` qui ajoute le module et l'entrée `modules`)
  - [ ] Dans `nuxt.config.ts`, remplacer l'entrée `"@nuxt/image-edge"` par `"@nuxt/image"` dans `modules`
  - [ ] Vérifier que les composants `<nuxt-img>` / `<nuxt-picture>` continuent de rendre (auto-import du module)
- [ ] Tâche 2 — Mettre à jour `@nuxt/content` (AC: #1)
  - [ ] `yarn add -D @nuxt/content` (version stable compatible Nuxt 4)
  - [ ] Conserver l'entrée `"@nuxt/content"` dans `modules` (déjà présente)
  - [ ] Vérifier que le pipeline blog (route `blog/[...slug].vue`, dossier `content/`) se charge sans erreur de module
  - [ ] Relire le CHANGELOG / guide de migration du module si la majeure a changé (collections, `queryContent` → API v3) et noter tout breaking change pour Epic 6
- [ ] Tâche 3 — Aligner Vue 3, TypeScript 5 et sass (AC: #1, #2)
  - [ ] Monter `typescript` de `^4.9.5` vers `^5` (cf. Decisions SPEC : TypeScript 5)
  - [ ] S'assurer que `vue` est présent en version Nuxt 4 (généralement tiré par `nuxt@^4` ; ne pas figer un `vue` divergent)
  - [ ] Conserver / mettre à jour `sass` (`^1.59.2`) à une version récente compatible avec le builder Vite
  - [ ] `yarn install` et résoudre les conflits de versions éventuels
- [ ] Tâche 4 — Neutraliser ou migrer `vue-property-decorator` (AC: #2)
  - [ ] Recenser les composants legacy utilisant `vue-property-decorator` (Options API + décorateurs de classe)
  - [ ] **Option recommandée (risque faible) : neutralisation/compat** — garder les composants legacy fonctionnels tels quels, en conservant `experimentalDecorators: true` dans `tsconfig.json` tant que la dépendance vit. Ne pas étendre ce pattern.
  - [ ] Vérifier que `vue-property-decorator@^9.1.2` reste installable et compile sur Vue 3 + Nuxt 4 ; sinon, migrer le(s) composant(s) concerné(s) vers `<script setup lang="ts">` (port minimal, sans changement fonctionnel)
  - [ ] `yarn postinstall` (`nuxi prepare`) ne doit pas remonter d'erreur de types bloquante
- [ ] Tâche 5 — Vérification (AC: #1, #2)
  - [ ] `yarn dev` démarre sans erreur ; `/`, `/about`, `/blog` se chargent
  - [ ] Une page contenant `<nuxt-img>` / `<nuxt-picture>` affiche bien ses images
  - [ ] Le blog liste / affiche le contenu `@nuxt/content` existant sans régression
  - [ ] `yarn lint` ne se dégrade pas (la migration flat config est la story 1.3)

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

### Debug Log References

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.

### File List
