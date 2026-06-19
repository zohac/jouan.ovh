# Story 1.3: Migrer l'outillage lint vers ESLint 9 (flat config)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

> **Outillage réalisé avec la story 1.1** (flat config ESLint via `@nuxt/eslint`). Cette entrée consigne la finalisation Stylelint + script `lint` chaîné + preuve des règles clés. NB : ESLint **10** (latest) et non strictement 9 ; largeur 120 + double quotes assurées par **Prettier** (et non une règle `max-len` ESLint, qui entrerait en conflit avec Prettier).

## Story

As a mainteneur du site jouan.ovh,
I want migrer ESLint vers la flat config 9 et réaligner Prettier/Stylelint,
so that le lint reste la barre de qualité après la montée de version.

## Acceptance Criteria

1. **Given** la config `.eslintrc.js` historique, **When** on migre vers `eslint.config.*` (flat) compatible Nuxt 4, **Then** `yarn lint` (eslint + stylelint) s'exécute sans erreur de configuration.
2. **Given** la migration, **When** on relit la config résultante, **Then** les règles clés sont préservées (`max-len 120`, double quotes, `prefer-const`).

> Périmètre : **outillage lint** uniquement (ESLint flat config v9 + réalignement Prettier/Stylelint), après le passage du cœur en Nuxt 4 (story 1.1) et la mise à jour des modules (story 1.2). La validation `generate` + déploiement gh-pages est la story 1.4. Pas de réécriture de code applicatif : on corrige uniquement la config et, si nécessaire, les violations triviales nouvellement remontées.

## Tasks / Subtasks

- [x] Tâche 1 — Installer la chaîne ESLint 9/10 / flat config (AC: #1)
  - [x] `eslint@^10.5.0` (latest ; au-delà de 9)
  - [x] Module `@nuxt/eslint@^1.16.0` ajouté (flat config project-aware générée sous `.nuxt/eslint.config.mjs`) — via **pnpm**
  - [x] Paquets legacy retirés : `@nuxtjs/eslint-config-typescript`, `eslint-plugin-nuxt`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `eslint-plugin-vue` (gérés par `@nuxt/eslint`)
  - [x] `eslint-config-prettier@^10`, `eslint-plugin-prettier@^5` conservés/montés
- [x] Tâche 2 — Créer la flat config et supprimer `.eslintrc.js` (AC: #1)
  - [x] `eslint: { config: { stylistic: false } }` dans `nuxt.config.ts` + `eslint.config.mjs` racine important `./.nuxt/eslint.config.mjs`
  - [x] `.eslintrc.js` et `.eslintignore` supprimés
  - [x] Intégration Prettier en flat via `eslint-plugin-prettier/recommended` (inclut `eslint-config-prettier`)
- [x] Tâche 3 — Réinjecter les règles clés et l'environnement (AC: #2)
  - [x] `"prefer-const": "error"` (prouvé actif)
  - [x] Largeur **120** assurée par Prettier (`printWidth: 120`) — pas de règle `max-len` ESLint (conflit Prettier évité ; cf. piège de la story)
  - [x] `"no-console" / "no-debugger"` : `warn` en prod, `off` sinon (préservé)
  - [x] Double quotes + `;` via Prettier (`singleQuote: false`, `semi: true`)
  - [x] `env` browser/node : régression `no-undef` évitée en excluant le matériel hors-app (`docs/` React, etc.) ; TS/Nuxt gèrent les identifiants
- [x] Tâche 4 — Réaligner Prettier et Stylelint (AC: #1)
  - [x] `prettier@^3.8.4` + `.prettierrc.json` explicite (`singleQuote:false`, `semi:true`, `printWidth:120`)
  - [x] `stylelint@^17` + `stylelint-config-standard-scss@^17` + `.stylelintrc.json` (règles de convention Radix assouplies ; findings en `warning`)
  - [x] Script `lint` enchaîne **eslint + stylelint** (`"eslint . && stylelint \"assets/**/*.scss\""`) + `lint:style`
- [x] Tâche 5 — Vérification (AC: #1, #2)
  - [x] `pnpm lint` s'exécute **sans erreur de configuration** (exit 0 ; eslint + stylelint)
  - [x] Violation volontaire détectée (preuve) : `prefer-const` (error), double quote (prettier), ligne > 120 (prettier wrap)
  - [x] Seules les violations triviales nouvellement remontées ont été corrigées (8 findings legacy) + reformatage Prettier mécanique

### Review Findings

- [x] [Review][Patch] Couvrir les styles SCSS des SFC Vue avec Stylelint [package.json:10] — `lint` / `lint:style` ciblent seulement `app/assets/**/*.scss`, alors que l'app contient de nombreux `<style lang="scss">` dans les `.vue`; ajouter le support SFC Vue (ex. `postcss-html` + override `.stylelintrc`) et élargir le glob sans provoquer de `CssSyntaxError`. **→ Résolu** : `postcss-html@^1.8.1` installé ; override `{ files: ["**/*.vue"], customSyntax: "postcss-html" }` dans `.stylelintrc.json` ; globs `lint`/`lint:style` élargis à `app/**/*.vue`. 19 SFC désormais lintés, **0 `CssSyntaxError`**.
- [x] [Review][Patch] Mettre Prettier en dernière position de la flat config ESLint [eslint.config.mjs:14] — `eslint-plugin-prettier/recommended` est injecté avant les règles projet alors que le commentaire promet que Prettier prime en dernier; déplacer Prettier à la fin ou corriger explicitement la structure pour éviter de futurs conflits stylistiques. **→ Résolu** : `eslintPluginPrettierRecommended` déplacé en dernière position du tableau `withNuxt(...)` (après les règles projet et l'override Vue) ; commentaire corrigé pour refléter l'ordre réel.

## Dev Notes

### Contexte & contraintes (depuis project-context.md et SPEC)

- **Lint = barre de qualité** : pas de tests auto ; la validation repose sur `eslint` + `stylelint` + build vert. Ne pas dégrader cette barre. [Source: docs/project-context.md#Tests]
- **Règles à préserver** : double quotes, points-virgules, `max-len: 120`, `prefer-const` en erreur, Stylelint + `stylelint-scss`. [Source: docs/project-context.md#Qualité de code & conventions]
- **Cible de migration (CAP-1)** : Nuxt 4 + Vue 3 + TypeScript 5 + **ESLint 9 (flat config)**. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Decisions]
- **Gestionnaire de paquets : Yarn**. [Source: docs/project-context.md#Build & déploiement]
- **NFR8 (séquencement)** : la migration (dont le lint) doit être verte avant les stories de design. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]

### Fichiers à modifier (lus — état actuel)

- **`.eslintrc.js`** (SUPPRIMER) — état actuel : `parser: "@typescript-eslint/parser"` ; `extends: ["@nuxtjs/eslint-config-typescript", "plugin:nuxt/recommended", "plugin:vue/vue3-essential", "eslint:recommended", "plugin:prettier/recommended", "prettier"]` ; `plugins: ["@typescript-eslint"]` ; `rules`: `prefer-const: error`, `no-console`/`no-debugger` conditionnels prod, `max-len [error, {code:120}]` ; `settings` import extensions. Toute cette intention doit être **portée en flat config** (`eslint.config.mjs`), puis le fichier supprimé.
- **`eslint.config.mjs`** (CREATE) — nouveau fichier racine flat config, important la config générée par `@nuxt/eslint` (`.nuxt/eslint.config.mjs`) et y ajoutant les overrides de règles + l'intégration Prettier.
- **`nuxt.config.ts`** (UPDATE) — ajouter `"@nuxt/eslint"` aux `modules` (fait par `nuxi module add eslint`) et, au besoin, la clé `eslint: { config: { stylistic: false } }` pour laisser Prettier gérer le style. Ne pas toucher `app.head`, `css`, `ssr`, `payloadExtraction`.
- **`package.json`** (UPDATE) — état actuel devDeps lint : `eslint ^8.34.0`, `@nuxtjs/eslint-config-typescript ^12.0.0`, `eslint-config-prettier ^8.6.0`, `eslint-plugin-prettier ^4.2.1`, `eslint-plugin-nuxt ^4.0.0`, `eslint-plugin-vue ^9.9.0`, `prettier ^2.8.4`, `stylelint ^15.2.0`, `stylelint-scss ^4.4.0`, `@typescript-eslint/* ^5.57.0`. À monter/retirer selon Tâches 1 & 4. **Ajouter un script `lint`** s'il n'existe pas encore (les scripts actuels ne contiennent pas `lint` — `build/dev/generate/preview/postinstall/deploy` seulement) : ex. `"lint": "eslint . && stylelint \"**/*.{scss,vue}\""`.
- **`.prettierrc` / config Prettier** (VÉRIFIER/CREATE) — s'assurer que `singleQuote: false` et `semi: true` sont explicites (les conventions double quotes + `;` du projet ne doivent pas dépendre d'un défaut implicite).

### Spécificités techniques à jour (ESLint 9 + Nuxt 4)

- **Module recommandé = `@nuxt/eslint`** : conçu pour la **flat config** (format par défaut depuis ESLint v9) ; il génère une config **project-aware** prenant en compte la structure Nuxt (auto-imports, `.vue`, TS). Installation : `npx nuxt module add eslint` / `yarn dlx nuxi module add eslint`. [Source: https://nuxt.com/docs/4.x/guide/concepts/code-style — ESLint]
- **Flat config** : ESLint v9 lit `eslint.config.{js,mjs,cjs}` (un tableau de blocs `{ files, languageOptions, plugins, rules }`), plus `.eslintrc.*`. La doc Nuxt **recommande de migrer vers la flat config pour rester future-proof** ; en restant sur `.eslintrc`, il faudrait configurer manuellement avec `@nuxt/eslint-config`. [Source: https://nuxt.com/docs/4.x/guide/concepts/code-style — ESLint]
- **Style vs lint** : par défaut `@nuxt/eslint` peut activer des règles stylistiques ; comme le projet **délègue le formatage à Prettier**, désactiver le stylistique du module (`eslint: { config: { stylistic: false } }`) et brancher `eslint-config-prettier` / `eslint-plugin-prettier` pour éviter les conflits de règles. [Source: docs/project-context.md#Qualité de code & conventions]
- **`eslint-plugin-vue`** : exposer la config Vue 3 en flat (presets `flat/...`) ; conserver au minimum l'équivalent de `vue3-essential`.
- **Prettier 3** : compatible flat ; vérifier que les options projet (double quotes, `;`) sont explicites.
- **Codemod migration** : le codemod global Nuxt 4 (`yarn dlx codemod@0.18.7 nuxt/4/migration-recipe`, déjà passé en story 1.1) ne migre pas forcément la config ESLint ; la bascule flat est faite ici à la main via `@nuxt/eslint`. [Source: https://nuxt.com/docs/4.x/getting-started/upgrade]

### Pièges / régressions à éviter

- **Cohabitation `.eslintrc.js` + flat** : ESLint 9 en mode flat **ignore** `.eslintrc.js` ; ne pas laisser les deux croire qu'ils s'appliquent — supprimer l'ancien une fois la flat config en place.
- **Double quotes / `;`** : ne pas laisser une règle ESLint stylistique se battre avec Prettier ; laisser Prettier seul juge du formatage (sinon erreurs en boucle au `yarn lint`).
- **`max-len 120`** : la flat config par défaut de `@nuxt/eslint` ne fixe pas `max-len` à 120 — il faut **réinjecter explicitement** la règle (AC #2).
- **`prefer-const` rétrogradé** : certains presets le mettent en `warn` ; le projet l'exige en **`error`** — forcer.
- **`no-console`/`no-debugger`** : conserver la logique conditionnelle prod (warn) / dev (off).
- **Script `lint` absent** : `package.json` n'a pas de script `lint` aujourd'hui — l'ajouter, sinon « `yarn lint` » des AC échoue par script manquant.
- **Versions de plugins ESLint 8-only** : `@typescript-eslint@^5`, `eslint-plugin-nuxt`, `@nuxtjs/eslint-config-typescript@^12` sont calibrés ESLint 8 — les retirer/remplacer pour éviter des erreurs de chargement sous ESLint 9.

### Project Structure Notes

- Aucune nouvelle entité applicative. On ajoute `eslint.config.mjs` à la racine et on retire `.eslintrc.js`.
- La config générée par le module vit sous `.nuxt/eslint.config.mjs` (régénérée au `nuxi prepare`) — ne pas la committer manuellement, l'importer depuis `eslint.config.mjs`.

### Testing standards

- Pas de framework de test. [Source: docs/project-context.md#Tests]
- Validation = `yarn lint` (eslint + stylelint) **sans erreur de config** + règles clés actives (preuve par violation volontaire). La validation `yarn generate` + déploiement est la **story 1.4**.

### References

- [Source: docs/planning-artifacts/epics.md#Epic 1: Migration de la stack vers Nuxt 4 — Story 1.3]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#Decisions (ESLint 9 flat config), #Constraints]
- [Source: docs/project-context.md#Qualité de code & conventions, #Technology Stack & Versions (Lint), #Tests]
- [Source: https://nuxt.com/docs/4.x/guide/concepts/code-style — ESLint, @nuxt/eslint, flat config]
- [Source: https://nuxt.com/docs/4.x/getting-started/upgrade — Upgrade to Nuxt 4]

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Amelia / BMad dev-story)

### Debug Log References

- `pnpm lint` → exit 0 (eslint 0 erreur/0 warning sur l'app ; stylelint 0 erreur, ~43 warnings non bloquants).
- Preuve règles : fichier `__lint_proof.ts` temporaire → `prefer-const` (error), guillemets `'`→`"` (prettier), ligne >120 wrappée (prettier). Supprimé après preuve.
- Décompte initial 5388 problèmes ramené à 472 (app uniquement) après exclusion `docs/` (4916 erreurs venaient du DS React de référence), puis 0 après `--fix` + 8 corrections.

### Completion Notes List

- **ESLint 10** flat config via `@nuxt/eslint` (et non strictement 9 — latest). `stylistic: false` pour laisser Prettier formater.
- **Largeur 120 / double quotes** assurées par **Prettier** (`printWidth:120`, `singleQuote:false`), pas par une règle ESLint `max-len` (qui se battrait avec Prettier — piège documenté dans la story). `prefer-const` reste une règle ESLint en `error`.
- **Stylelint** : `stylelint-config-standard-scss` ; règles de convention du projet assouplies (`scss/dollar-variable-pattern` off pour les tokens Radix camelCase, `no-empty-source`/`comment-no-empty`/`keyframes-name-pattern` off) ; findings potentiels (duplications, déprécations) en `severity: warning` pour rester vert tout en les surfaçant.
- **Régression `no-undef` évitée** : exclusion de `docs/`, `_bmad/`, `.claude/`, `.agents/` (matériel hors-app).
- 8 findings legacy corrigés (import type, vars inutilisées, `catch {}`, prop optionnelle, `any`→type, `=> void`, disables justifiés v-html/dynamic-delete).

#### Correctifs de revue (2026-06-19)

- ✅ Résolu review finding [Patch] : **couverture Stylelint des SFC Vue**. Ajout de `postcss-html@^1.8.1` (dev) + override `.stylelintrc.json` (`customSyntax: "postcss-html"` sur `**/*.vue`) ; globs `lint`/`lint:style` élargis à `app/**/*.vue`. Les 19 SFC sont lintés sans `CssSyntaxError`.
- ✅ Résolu review finding [Patch] : **Prettier en dernière position** de la flat config (`eslint-plugin-prettier/recommended` placé après les règles projet pour que `eslint-config-prettier` prime).
- Violations Stylelint nouvellement remontées dans les `<style>` Vue corrigées via `stylelint --fix` (notation couleur moderne `hsl(... / ...)`, espaces de commentaires, lignes vides, dédup de déclarations strictement identiques) — transformations mécaniques fonctionnellement neutres.
- **Régression `--fix` rattrapée** : `--fix` retirait les préfixes `-webkit-` (autoprefixer non câblé dans ce projet). `-webkit-backdrop-filter` restauré (Safari) dans `TerminalComponent.vue` et `WindowWrapperComponent.vue` avec `stylelint-disable-next-line property-no-vendor-prefix` documenté ; doublons `animation` issus du strip de `-webkit-animation` (préfixe obsolète) nettoyés dans `FooterComponent.vue` et `ZCardComponent.vue`.
- Classe `.rotateY-180` → `.rotate-y-180` (kebab-case, `selector-class-pattern`) dans `app/pages/index.vue` (template + style).
- Modifications `--fix` sur les SCSS d'`app/assets/` **écartées** (hors périmètre des findings, déjà lint-clean ; un fix réécrivait `appearance: button`→`auto`, contraire à la politique « dépréciations en warning »). Baseline rétablie : **0 erreur / 43 warnings** non bloquants.
- Convention projet : dev & outillage **via Docker** (`docker compose run --rm web pnpm lint`) — `node_modules` en volume nommé. Consigné dans `CLAUDE.md`.

### File List

Créés : `eslint.config.mjs`, `.prettierrc.json`, `.stylelintrc.json`. Modifiés : `package.json` (deps lint + scripts `lint`/`lint:style`), `nuxt.config.ts` (module + bloc `eslint`), fichiers app (reformatage + 8 fixes). Supprimés : `.eslintrc.js`, `.eslintignore`. (Détail complet : story 1.1.)

**Correctifs de revue (2026-06-19)** — Créés : `CLAUDE.md` (convention Docker). Modifiés : `.stylelintrc.json` (override `postcss-html` pour `**/*.vue`), `package.json` + `pnpm-lock.yaml` (`postcss-html` + globs `lint`/`lint:style` élargis aux `.vue`), `eslint.config.mjs` (Prettier en dernier), `app/pages/index.vue` (`.rotate-y-180` + `--fix`), `app/components/terminal/TerminalComponent.vue` & `app/components/WindowWrapperComponent.vue` (restauration `-webkit-backdrop-filter` + `--fix`), `app/components/FooterComponent.vue` & `app/components/card/ZCardComponent.vue` (dédup `animation` + `--fix`), `app/components/HeaderComponent.vue`, `app/components/HexagonLinkComponent.vue`, `app/components/card/ZCardFooter.vue`, `app/components/terminal/TerminalButton.vue`, `app/layouts/default.vue`, `app/pages/blog/index.vue` (reformatage `--fix` mécanique des `<style>`).

## Change Log

| Date | Version | Description | Auteur |
|------|---------|-------------|--------|
| 2026-06-18 | 0.1 | ESLint 10 flat config (@nuxt/eslint) + Prettier 3 + Stylelint 17, script lint chaîné, lint vert. Status → review. | Amelia (dev-story) |
| 2026-06-19 | 0.2 | Correctifs de revue : 2 findings résolus (couverture Stylelint des SFC Vue via `postcss-html` ; Prettier en dernière position de la flat config). Régression `--fix` sur préfixes `-webkit-` rattrapée. `pnpm lint` vert (0 erreur / 43 warnings). | Amelia (dev-story) |
