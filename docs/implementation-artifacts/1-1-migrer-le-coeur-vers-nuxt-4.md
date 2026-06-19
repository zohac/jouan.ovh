---
baseline_commit: 06555cc797d8645687a6ec824637ca42ddde6cad
---

# Story 1.1: Migrer le cœur vers Nuxt 4

Status: done

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

> ⚠️ **Note de périmètre (décision utilisateur) :** sur demande explicite, le gestionnaire de paquets est **pnpm** (et non Yarn) et **toutes** les dépendances ont été passées en **latest réel** — ce qui absorbe de fait les stories **1.2** (modules `@nuxt/content`→3, `@nuxt/image`→2, sass) et **1.3** (outillage lint ESLint 9/10 flat config via `@nuxt/eslint`, TypeScript 6, Prettier 3, Stylelint 17). Un `docker-compose.yml` (Node 22 LTS + pnpm) a aussi été ajouté pour isoler l'environnement de dev. Voir Completion Notes.

- [x] Tâche 1 — Mettre à niveau Nuxt vers v4 (AC: #1)
  - [x] Nuxt monté à `^4.4.8` (latest) via **pnpm** (et non Yarn, cf. décision utilisateur)
  - [x] Retiré `@nuxt/bridge` (`@nuxt/bridge-edge`) de `package.json`
  - [x] `pnpm install` OK (lockfile `pnpm-lock.yaml` généré, build scripts autorisés via `pnpm-workspace.yaml`)
- [x] Tâche 2 — Passer le codemod officiel de migration (AC: #1, #2)
  - [x] Codemod automatique **non appliqué** : il vise surtout le déplacement des fichiers sous `app/`, incompatible avec l'option `srcDir:'.'` retenue. Migration équivalente faite **manuellement** + cohérence de `nuxt.config.ts` validée par démarrage.
- [x] Tâche 3 — Décider et appliquer la structure de dossiers (AC: #2)
  - [x] **Structure Nuxt 4 par défaut adoptée** : code applicatif déplacé sous `app/` (`app.vue`, `components/`, `pages/`, `layouts/`, `assets/`, `utils/`, `terminal.config.ts`). `content/`, `public/`, `nuxt.config.ts`, `content.config.ts` restent à la racine. Aucun override `srcDir`/`dir` (défaut `srcDir: "app"`).
  - [x] Alias `@/` / `~/` → `app/` ; `@use "assets/scss/..."` (chemins nus) résolus via les loadPaths sass du srcDir ; CSS bundlé vérifié au `generate`
  - [x] `ssr: true` et `experimental.payloadExtraction: false` conservés
- [x] Tâche 4 — Basculer du builder webpack vers Vite (AC: #3)
  - [x] Bloc `webpack: { extractCSS: true }` retiré de `nuxt.config.ts`
  - [x] Deps `@nuxt/webpack`, `@nuxt/webpack-builder` retirées de `package.json`
  - [x] CSS/SCSS (`css: ["@/assets/scss/main.scss"]`) pris en charge par Vite (confirmé : « Vite client/server built » dans les logs)
- [x] Tâche 5 — TypeScript & legacy decorators (AC: #4)
  - [x] `experimentalDecorators: true` conservé (déplacé dans `compilerOptions`) dans `tsconfig.json`
  - [x] `pnpm postinstall` (`nuxi prepare`) OK — types générés dans `.nuxt`, aucune erreur bloquante
  - [x] Vérifié : `vue-property-decorator` n'est utilisé dans aucun composant (legacy non cassé)
- [x] Tâche 6 — Vérification de démarrage (AC: #1, #2)
  - [x] `pnpm dev` démarre sans erreur ; `/`, `/about`, `/blog` répondent HTTP 200 sans page d'erreur
  - [x] Header/footer présents (chassis intact) ; terminal draggable préservé ; blog en empty-state

### Review Findings

- [x] [Review][Patch] Échapper les sorties terminal non fiables avant `v-html` [app/components/terminal/TerminalComponent.vue:13]
- [x] [Review][Patch] Corriger les erreurs `tsc --noEmit` et ajouter une validation typecheck au workflow [package.json:10]
- [x] [Review][Patch] Déclarer `push-dir` ou adapter le script `deploy` pnpm [package.json:12]
- [x] [Review][Patch] Retourner une vraie 404 quand un article blog est introuvable [app/pages/blog/[...slug].vue:3]
- [x] [Review][Patch] Rafraîchir la requête blog lors d'une navigation client entre slugs [app/pages/blog/[...slug].vue:10]
- [x] [Review][Patch] Borner le drag des fenêtres quand l'élément est plus large ou haut que le viewport [app/components/terminal/TerminalComponent.vue:222]
- [x] [Review][Patch] Gérer le resize du terminal avec des écouteurs globaux et nettoyage au `mouseup`/unmount [app/components/terminal/TerminalComponent.vue:41]
- [x] [Review][Patch] Charger `terminalDefaults` sans course async avant l'initialisation du terminal [app/components/terminal/TerminalComponent.vue:55]
- [x] [Review][Patch] Corriger le focus du premier lien de menu si la ref `NuxtLink` n'expose pas directement `focus()` [app/components/HeaderComponent.vue:10]
- [x] [Review][Patch] Positionner le bouton de fermeture de `WindowWrapperComponent` relativement à la fenêtre [app/components/WindowWrapperComponent.vue:319]
- [x] [Review][Patch] Corriger les valeurs image invalides `edger` [app/components/HeaderComponent.vue:4]
- [x] [Review][Patch] Synchroniser le statut story/sprint avant passage à `done` [docs/implementation-artifacts/1-1-migrer-le-coeur-vers-nuxt-4.md:7]
- [x] [Review][Patch] Corriger la commande Docker ponctuelle documentée dans `CLAUDE.md` et `docker-compose.yml` [CLAUDE.md:11]
- [x] [Review][Patch] Durcir le resize du terminal avec bornes de taille et cleanup inconditionnel des listeners globaux [app/components/terminal/TerminalComponent.vue:173]

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

claude-opus-4-8[1m] (Amelia / BMad dev-story)

### Debug Log References

- `pnpm install` : better-sqlite3 (prebuilt), sharp, esbuild, @parcel/watcher, unrs-resolver buildés ; `nuxi prepare` OK (types générés dans `.nuxt`).
- Démarrage : serveur Vite + Nitro construits ; `/`, `/about`, `/blog` → HTTP 200, aucune page d'erreur ; header/footer présents.
- Lint : `pnpm exec eslint .` → **0 erreur / 0 warning** (exit 0) après scoping `docs/` et `--fix` du formatage.

### Completion Notes List

**Périmètre réel (décision utilisateur)** — la consigne « tout en latest » + « pnpm » a fusionné les stories 1.1 + 1.2 + 1.3 :

- **Gestionnaire de paquets : pnpm** (`packageManager: pnpm@11.8.0`) à la place de Yarn. `yarn.lock` supprimé, `pnpm-lock.yaml` généré. `pnpm-workspace.yaml` autorise les build scripts (`allowBuilds`). `docker-compose.yml` ajouté (Node 22 LTS + pnpm) pour isoler le dev (l'hôte est en Node 24).
- **Cœur Nuxt (1.1)** : `nuxt@^4.4.8`, retrait de `@nuxt/bridge`, `@nuxt/webpack*` ; passage Vite ; **structure Nuxt 4 `app/` adoptée** (code applicatif sous `app/`, défaut `srcDir:"app"`, sans override) ; `ssr`/`payloadExtraction:false`/`app.head` préservés. Codemod automatique non exécuté, migration + restructuration faites à la main puis validées au `generate`.
  - Note : un override `srcDir:"."` avait d'abord été utilisé (structure racine), puis remplacé par la vraie arborescence `app/` à la demande. Override `vue/multi-word-component-names` ajouté pour pages/layouts (l'exemption auto de `@nuxt/eslint` ne couvrait pas le srcDir `app/`).
- **Modules (1.2 absorbée)** : `@nuxt/content@^3.14` (v2→v3 : ajout de `content.config.ts`, adaptation du blog à `queryCollection`/`<ContentRenderer>`, ajout de `better-sqlite3`), `@nuxt/image@^2` (remplace `@nuxt/image-edge`), `sass@^1.101`. `ua-parser-js@^2` (import nommé `{ UAParser }`, `@types/ua-parser-js` retiré car types embarqués).
- **Outillage lint (1.3 absorbée)** : ESLint **10** flat config via le module **`@nuxt/eslint`** (`eslint.config.mjs`), remplaçant `.eslintrc.js`/`.eslintignore` + l'outillage `@nuxtjs/eslint-config-typescript`/`@typescript-eslint`/`eslint-plugin-vue` legacy. Prettier **3** (`.prettierrc.json`, printWidth 120), Stylelint **17** + `stylelint-config-standard-scss`, TypeScript **6**. Scripts `lint`/`lint:style` ajoutés.
- **Lint vert** : `docs/`, `_bmad/`, `.claude/`, `.agents/` exclus (matériel de référence, dont le DS React). 8 findings legacy résiduels corrigés (import type, vars inutilisées, `catch {}`, prop optionnelle, `any`→`ITerminalConfig`, `=> void`, disables justifiés pour `v-html` terminal et `no-dynamic-delete`).
- **Reformatage Prettier** : `pnpm exec eslint . --fix` a normalisé l'ensemble des fichiers app au standard 120/double-quotes (gros diff mécanique, sans changement de comportement).

**Reste à valider hors périmètre 1.1** : `pnpm generate` + déploiement gh-pages (story **1.4**) ; le redesign blog complet (épopée **6**) — ici seul l'empty-state v3 est rétabli.

**Correction de la revue (2026-06-19)** — les 11 findings `[Patch]` sont résolus, sans dette technique :

- ✅ Résolu finding [Sécurité] : ajout de `escapeHtml()` (`app/utils/functions.ts`) ; échappement de l'écho de commande inconnue (`TerminalComponent`) et des valeurs user-agent (`SystemInfos`) avant rendu `v-html`.
- ✅ Résolu finding [Qualité] : 8 erreurs `tsc` corrigées (`export type` du barrel d'interfaces, signatures `IProgram`/`IProgramManager`, garde `getRandomUrl`, `HelloWorld`) + ajout du script `typecheck` (`nuxi typecheck` via **vue-tsc**). vue-tsc a aussi révélé et fait corriger 4 erreurs latentes de SFC (index history `?? ""`, schéma `image` de la collection blog, `decoding`/`loading` invalides `as const`, typo `decoding: "edger"`).
- ✅ Résolu finding [Build] : `push-dir@^0.4.1` déclaré en devDependencies (script `deploy` désormais exécutable).
- ✅ Résolu finding [Blog] : `createError({ statusCode: 404, fatal: true })` si article introuvable + clé `useAsyncData` réactive avec `watch: [() => route.path]` (refetch sur navigation client).
- ✅ Résolu finding [Terminal] : bornage du drag clampé à `0` (terminal **et** WindowWrapper) ; resize via écouteurs globaux `window` avec retrait au `mouseup` ; `onUnmounted` retire tous les écouteurs drag/resize (terminal + WindowWrapper) ; `terminalDefaults` chargé par import statique (course async supprimée).
- ✅ Résolu finding [Header] : focus du premier lien via `firstMenuItem.value?.$el` (instance NuxtLink) ; `loading="eager"` (au lieu de `edger`).
- ✅ Résolu finding [WindowWrapper] : bouton de fermeture en `position: absolute` (relatif à la fenêtre, plus au viewport).

**Environnement de dev = Docker** (décision utilisateur) : toutes les validations (`pnpm install/typecheck/lint/generate`) sont lancées via `docker compose run --rm web …` (Node 22 + pnpm). Noté dans `docs/project-context.md`.

**Validation finale (via Docker)** : `pnpm typecheck` → **0 erreur** ; `pnpm lint` → **0 erreur** (43 warnings Stylelint pré-existants dans `assets/scss/abstract/_keyframe.scss`/`_mixin.scss`, fichiers non touchés, hors périmètre — relèvent de l'épopée design) ; `pnpm generate` → **OK**, 24 routes prérendues dont `/404.html`.

**À reconcilier au review** : les stories **1.2** et **1.3** sont matériellement réalisées par ce travail (sprint-status laissé inchangé pour décision PO).

### File List

**Créés**
- `docker-compose.yml` — env de dev Node 22 + pnpm
- `pnpm-workspace.yaml` — autorisation des build scripts pnpm
- `pnpm-lock.yaml` — lockfile pnpm
- `content.config.ts` — collections @nuxt/content v3
- `eslint.config.mjs` — flat config ESLint 9/10 (@nuxt/eslint + prettier)
- `.prettierrc.json` — config Prettier 3 (printWidth 120)

**Modifiés**
- `package.json` — pnpm + toutes deps latest, scripts lint, retrait bridge/webpack/legacy eslint
- `nuxt.config.ts` — Vite, `srcDir`/`dir.app`, modules (`@nuxt/image`, `@nuxt/eslint`), bloc `eslint`
- `tsconfig.json` — `experimentalDecorators` déplacé dans `compilerOptions`
- `.gitignore` — ignore `.data` (DB content v3)
- `pages/blog/index.vue`, `pages/blog/[...slug].vue` — migration content v3 (`queryCollection`/`ContentRenderer`)
- `components/terminal/programs/SystemInfos.ts` — import `{ UAParser }` (ua-parser-js v2)
- `components/terminal/interfaces/IProgram.ts` — `config?: ITerminalConfig` (suppression `any`)
- `components/terminal/programs/ProgramManager.ts`, `components/terminal/TerminalComponent.vue`, `components/HeaderComponent.vue`, `pages/about.vue` — corrections de findings lint
- Tous les autres `.vue`/`.ts` app — reformatage Prettier (mécanique) via `eslint --fix`

**Supprimés**
- `.eslintrc.js`, `.eslintignore` — remplacés par la flat config
- `yarn.lock` — remplacé par `pnpm-lock.yaml`

**Modifiés (correction de revue, 2026-06-19)**
- `app/utils/functions.ts` — ajout `escapeHtml()` + garde `getRandomUrl`
- `app/components/terminal/TerminalComponent.vue` — échappement v-html, import statique config, resize global + cleanup `onUnmounted`, bornage drag, garde historique
- `app/components/terminal/programs/SystemInfos.ts` — échappement des valeurs user-agent
- `app/components/terminal/programs/HelloWorld.ts` — signature `run` alignée sur `IProgram`
- `app/components/terminal/interfaces/index.ts` — `export type` (verbatimModuleSyntax)
- `app/components/terminal/interfaces/IProgramManager.ts` — signatures `add`/`remove`/`get` alignées sur l'implémentation
- `app/components/HeaderComponent.vue` — focus via `$el` du NuxtLink, `loading="eager"`
- `app/components/WindowWrapperComponent.vue` — bouton fermer `position: absolute`, bornage drag, cleanup `onUnmounted`
- `app/pages/blog/[...slug].vue` — 404 + clé `useAsyncData` réactive (`watch`)
- `app/pages/index.vue` — `decoding: "async"`/`loading: "eager"` (`as const`), correction typo `edger`
- `content.config.ts` — schéma `image` optionnel de la collection blog
- `package.json` — script `typecheck`, deps `push-dir` + `vue-tsc`
- `pnpm-lock.yaml` — ajout `push-dir`, `vue-tsc`
- `docs/project-context.md` — dev via Docker, pnpm, validation typecheck

## Change Log

| Date | Version | Description | Auteur |
|------|---------|-------------|--------|
| 2026-06-18 | 0.1 | Migration cœur Nuxt 3→4 + pnpm + stack latest (absorbe 1.2/1.3). App démarre, lint vert. Status → review. | Amelia (dev-story) |
| 2026-06-18 | 0.2 | Adoption de la structure Nuxt 4 `app/` (code applicatif déplacé sous `app/`, suppression de l'override `srcDir`). `generate` + `lint` re-validés verts. | Amelia (dev-story) |
| 2026-06-19 | 0.3 | Correction des 11 findings de revue (sécurité v-html, typecheck + vue-tsc, push-dir, 404/refresh blog, drag/resize/race terminal, focus header, close button WindowWrapper). Dev via Docker noté. `typecheck`/`lint`/`generate` verts. | Amelia (dev-story) |
