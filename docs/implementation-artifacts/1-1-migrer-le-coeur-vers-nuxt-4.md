---
baseline_commit: 06555cc797d8645687a6ec824637ca42ddde6cad
---

# Story 1.1: Migrer le cœur vers Nuxt 4

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a mainteneur du site jouan.ovh,
I want migrer le projet de Nuxt 3 vers Nuxt 4 et retirer `@nuxt/bridge-edge`,
so that le site repose sur une base moderne et supportée, prête pour la refonte du design system.

## Acceptance Criteria

1. **Given** le projet sur Nuxt 3 + `@nuxt/bridge-edge`, **When** on met à niveau vers Nuxt 4 et on retire la dépendance bridge, **Then** `yarn install` réussit et `yarn dev` démarre sans erreur.
2. **Given** la montée de version, **When** on adapte `nuxt.config.ts` à Nuxt 4 (structure `app/` ou compat explicite) , **Then** le SSR et `generate` restent activés et la config est valide.
3. **Given** le builder webpack hérité (`webpack: { extractCSS: true }` + deps `@nuxt/webpack*`), **When** on bascule sur le builder Vite par défaut de Nuxt 4, **Then** l'app build et tourne sans le bloc webpack ni ces dépendances.
4. **Given** le code legacy en `vue-property-decorator` (`experimentalDecorators`), **When** on compile le projet sur Nuxt 4, **Then** il n'y a pas d'erreur de compilation TypeScript bloquante (le legacy reste fonctionnel ou est neutralisé, sans le casser).

> Périmètre : **cœur Nuxt + config + structure** uniquement. La mise à jour fine des modules (`@nuxt/content`, `@nuxt/image`) et le réalignement lint ESLint 9 sont les stories 1.2 et 1.3. La validation `generate` + déploiement gh-pages est la story 1.4. Cette story doit néanmoins laisser le projet **démarrant et compilant** (`yarn dev` OK).

## Tasks / Subtasks

- [ ] Tâche 1 — Mettre à niveau Nuxt vers v4 (AC: #1)
  - [ ] `yarn add nuxt@^4.0.0` (gestionnaire = **Yarn**)
  - [ ] Retirer `@nuxt/bridge` (`@nuxt/bridge-edge`) de `package.json` (inutile sur Nuxt 4 ; servait au pont 2→3)
  - [ ] `yarn install` et résoudre les conflits de versions éventuels
- [ ] Tâche 2 — Passer le codemod officiel de migration (AC: #1, #2)
  - [ ] Lancer `yarn dlx codemod@0.18.7 nuxt/4/migration-recipe` puis relire le diff produit
  - [ ] Vérifier la cohérence de `nuxt.config.ts` après codemod
- [ ] Tâche 3 — Décider et appliquer la structure de dossiers (AC: #2)
  - [ ] **Option recommandée (risque faible) :** garder la structure racine actuelle en figeant l'ancien défaut dans `nuxt.config.ts` :
    ```ts
    export default defineNuxtConfig({
      srcDir: '.',
      dir: { app: 'app' },
    })
    ```
  - [ ] (Alternative, hors périmètre si trop risqué ici : déplacer `pages/ components/ layouts/ assets/ app.vue` sous `app/` — à réserver à une story dédiée si souhaité)
  - [ ] Conserver `ssr: true` et `experimental.payloadExtraction: false`
- [ ] Tâche 4 — Basculer du builder webpack vers Vite (AC: #3)
  - [ ] Retirer le bloc `webpack: { extractCSS: true }` de `nuxt.config.ts`
  - [ ] Retirer les deps `@nuxt/webpack`, `@nuxt/webpack-builder` de `package.json`
  - [ ] Vérifier que `css: ["@/assets/scss/main.scss"]` est toujours pris en compte par Vite (sass déjà présent)
- [ ] Tâche 5 — TypeScript & legacy decorators (AC: #4)
  - [ ] Conserver `experimentalDecorators: true` dans `tsconfig.json` tant que `vue-property-decorator` est présent
  - [ ] Lancer `yarn postinstall` (`nuxi prepare`) et corriger toute erreur de types bloquante
  - [ ] Identifier les composants utilisant l'Options API + decorators (legacy) et confirmer qu'ils compilent (pas de réécriture ici)
- [ ] Tâche 6 — Vérification de démarrage (AC: #1, #2)
  - [ ] `yarn dev` démarre sans erreur ; les routes `/`, `/about`, `/blog` se chargent
  - [ ] Le terminal draggable et le header/footer existants s'affichent (pas de régression visuelle bloquante)

## Dev Notes

### Contexte & contraintes (depuis project-context.md et SPEC)

- **Gestionnaire de paquets : Yarn** — toujours `yarn`, jamais `npm`. [Source: docs/project-context.md#Workflow]
- **Cible de build = site statique** (`nuxi generate` → `gh-pages`), SSR activé. Tout doit rester compatible prerender. [Source: docs/project-context.md#Nuxt]
- **NFR8 (séquencement)** : cette migration (FR1) doit être livrée et **verte avant** toute story de design (Epic 2+). [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]
- **Ne pas casser `CNAME`** ni la chaîne de déploiement (régression déjà survenue, commit `cf1829e`) — validée formellement en story 1.4. [Source: docs/project-context.md#Build & déploiement]
- **Lint = barre de qualité** (pas de tests auto) ; le réalignement ESLint 9 flat est la story 1.3, mais ne pas dégrader le lint existant. [Source: docs/project-context.md#Tests]

### Fichiers à modifier (lus — état actuel)

- **`nuxt.config.ts`** (UPDATE) — état actuel : `css: ["@/assets/scss/main.scss"]`, `modules: ["@nuxt/content", "@nuxt/image-edge"]`, `ssr: true`, `experimental.payloadExtraction: false`, `webpack: { extractCSS: true }`, et un `app.head` (title, htmlAttrs lang=fr, meta description).
  - À préserver : `app.head`, `css`, `ssr`, `payloadExtraction:false`, `modules` (la mise à jour `@nuxt/image-edge` → `@nuxt/image` est story 1.2 — ne pas la traiter ici sauf si elle bloque le démarrage).
  - À changer : retirer `webpack`, ajouter la config de structure (`srcDir`/`dir`).
- **`package.json`** (UPDATE) — retirer `@nuxt/bridge`, `@nuxt/webpack`, `@nuxt/webpack-builder` ; monter `nuxt` à `^4`. Conserver les scripts (`dev/build/generate/preview/postinstall/deploy`). Garder `sass`, `vue-property-decorator`, `ua-parser-js`.
- **`tsconfig.json`** (UPDATE) — `extends: "./.nuxt/tsconfig.json"` + `experimentalDecorators: true`. Vérifier que l'extends reste valide en Nuxt 4 (Nuxt 4 génère des projets tsconfig séparés ; l'extends racine reste supporté).
- **`app.vue`** (lecture) — simple wrapper `<NuxtLayout><NuxtPage/></NuxtLayout>`, pas de changement attendu si on garde `srcDir:'.'`.

### Spécificités Nuxt 4 (doc officielle à jour)

- **Upgrade** : `yarn add nuxt@^4.0.0`. [Source: https://nuxt.com/docs/4.x/getting-started/upgrade]
- **Codemod de migration** : `yarn dlx codemod@0.18.7 nuxt/4/migration-recipe` (version épinglée par la doc). Relire le diff. [Source: idem]
- **Nouvelle structure par défaut** : `srcDir` passe à `app/` (avec `app/components`, `app/pages`, `app/layouts`, `app/assets`, `app/app.vue`, etc.) + dossiers racine `shared/`, `server/`, `public/`, `content/`. Pour **conserver la structure actuelle** sans tout déplacer :
  ```ts
  export default defineNuxtConfig({ srcDir: '.', dir: { app: 'app' } })
  ```
  [Source: idem]
- **Builder** : Vite est le builder par défaut — l'écosystème `@nuxt/webpack*` n'est plus le chemin standard. Retirer la config webpack et laisser Vite gérer le CSS/SCSS. [Cohérence stack — voir AC #3]

### Pièges / régressions à éviter

- Ne pas déplacer les fichiers sous `app/` ET garder `srcDir:'.'` en même temps (incohérent) — choisir UNE approche (recommandé : `srcDir:'.'`).
- `@nuxt/image-edge` et `@nuxt/content` peuvent émettre des avertissements de version sur Nuxt 4 ; leur mise à jour fine est la **story 1.2**. Ici, n'intervenir que si ça empêche `yarn dev` de démarrer (alors, noter le contournement pour 1.2).
- Garder `experimentalDecorators` tant que `vue-property-decorator` vit, sinon les composants legacy cassent (AC #4).

### Project Structure Notes

- Approche retenue par défaut : **structure racine inchangée** via `srcDir:'.'` → impact minimal sur `components/`, `pages/`, `layouts/`, `assets/`, `app.vue`. Une bascule vers `app/` pourra faire l'objet d'une story dédiée plus tard si souhaité.
- Aucune base de données / entité à créer.

### Testing standards

- Pas de framework de test. Validation = `yarn lint` (ne pas dégrader) + **`yarn dev` démarre et les pages se chargent**. La validation `yarn generate` + déploiement est explicitement la **story 1.4**. [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 1: Migration de la stack vers Nuxt 4 — Story 1.1]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#Capabilities (CAP-1), #Constraints, #Decisions]
- [Source: docs/project-context.md#Technology Stack & Versions, #Règles Langage & Framework, #Workflow de développement]
- [Source: https://nuxt.com/docs/4.x/getting-started/upgrade — Upgrade to Nuxt 4, codemod, folder structure, srcDir/dir]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.

### File List
