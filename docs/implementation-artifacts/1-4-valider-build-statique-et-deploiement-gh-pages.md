# Story 1.4: Valider build statique et déploiement gh-pages

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

> **Adaptée à pnpm.** Build validé via `pnpm generate` (et non `yarn`) ; le workflow CI `cd.yml` a été migré Yarn→pnpm + Node 18→22. Un asset portrait supprimé par accident au commit `06555cc` (qui cassait le prerender) a été restauré.

## Story

As a mainteneur du site jouan.ovh,
I want valider `yarn generate` et le déploiement gh-pages après migration,
so that la chaîne de production est verte avant d'entamer la refonte.

## Acceptance Criteria

1. **Given** la stack migrée, **When** on lance `yarn generate`, **Then** le build statique réussit et `.output/public` contient les pages existantes.
2. **Given** le build statique, **When** on inspecte la sortie et la chaîne de déploiement, **Then** le fichier `CNAME` est présent dans la sortie et le déploiement `gh-pages` reste fonctionnel.

> Périmètre : **validation finale de la chaîne de production** (build statique + déploiement gh-pages), après le cœur Nuxt 4 (story 1.1), la mise à jour des modules (story 1.2) et l'outillage lint (story 1.3). Cette story **clôt l'Epic 1** : elle ne déplace pas de fichiers et n'ajoute pas de feature ; elle garantit que `yarn generate` → `.output/public` → `gh-pages` (avec `CNAME` et `_headers`) fonctionne comme avant la migration.

## Tasks / Subtasks

- [x] Tâche 1 — Valider le build statique `pnpm generate` (AC: #1)
  - [x] `pnpm install` + `pnpm generate` → **exit 0** (24 routes prerendues)
  - [x] Sortie `.output/public` vérifiée
  - [x] Pages présentes : `/` (index.html 25 KB), `/about` (32 KB), `/blog` (22 KB) — contenu réel, aucune erreur ; + `200.html`/`404.html`
  - [x] Pas d'erreur de prerender / DOM non gardé (accès `window`/`document` du terminal gardés par handlers + `typeof window`)
- [x] Tâche 2 — Garantir la présence de `CNAME` dans la sortie (AC: #2)
  - [x] État constaté : `CNAME` était à la racine (non copié par le workflow → risque `cf1829e`)
  - [x] `CNAME` déplacé dans `public/CNAME` (émis automatiquement dans `.output/public/CNAME` par `nuxi generate`) ; racine nettoyée
  - [x] Workflow ajusté (plus de copie de l'ancien CNAME racine)
  - [x] `.output/public/CNAME` contient bien `dev.jouan.ovh` après generate
- [x] Tâche 3 — Valider la chaîne de déploiement gh-pages (AC: #2)
  - [x] `cd.yml` migré **Yarn→pnpm** (`pnpm/action-setup` + `pnpm install --frozen-lockfile` + `pnpm generate`) et **Node 18→22**
  - [x] `_headers` + `CNAME` garantis dans la sortie (présents via `public/` + étape de copie de sécurité)
  - [x] Version Node CI montée à 22 (exigence Nuxt 4)
  - [x] Note : le script local `deploy` (`push-dir`) publie `.output/public` qui contient désormais `CNAME` + `_headers` (déploiement réel via CI au merge sur `main`)
- [x] Tâche 4 — Vérification de non-régression (AC: #1, #2)
  - [x] `pnpm lint` (eslint + stylelint) reste vert
  - [x] Le site généré rend les mêmes pages qu'avant (parité ; portrait about restauré après suppression accidentelle en `06555cc`)
  - [x] `CNAME` présent dans `.output/public` → domaine custom préservé après déploiement

### Review Findings

- [x] [Review][Patch] Empêcher le déploiement gh-pages sur les événements pull_request [.github/workflows/cd.yml:41] — le workflow est déclenché sur `pull_request` et le step `Deploy` n'a pas de garde; ajouter `if: github.event_name == 'push'` pour garder la validation PR sans publication. **→ Résolu** : step `Deploy` gardé par `if: github.event_name == 'push'` ; les PR exécutent lint/typecheck/generate/assertions sans publier.
- [x] [Review][Patch] Déclarer explicitement les permissions d'écriture pour publier `gh-pages` [.github/workflows/cd.yml:1] — le déploiement utilise `GITHUB_TOKEN`, mais le workflow ne fixe pas `permissions: contents: write`; selon les réglages du dépôt, le publish peut échouer en 403. **→ Résolu** : bloc `permissions: contents: write` au niveau workflow.
- [x] [Review][Patch] Ajouter `pnpm lint` et `pnpm typecheck` dans la gate CI avant `pnpm generate` [.github/workflows/cd.yml:28] — le contexte projet définit la validation minimale comme lint + typecheck + generate, mais `cd.yml` n'exécute aujourd'hui que install puis generate. **→ Résolu** : steps `Lint` (`pnpm lint`) et `Typecheck` (`pnpm typecheck`) ajoutés avant `Generate` (vérifiés exit 0 sous Node 22).
- [x] [Review][Patch] Ajouter des assertions CI sur la sortie statique avant publication [.github/workflows/cd.yml:31] — la story exige `.output/public` avec pages existantes, `_headers`, `CNAME` et portrait restauré; le workflow publie après generate sans tester explicitement ces artefacts. **→ Résolu** : step `Verify static output` (`set -euo pipefail`) vérifie `index.html`, `200.html`, `404.html`, `about/index.html`, `blog/index.html`, `_headers`, `CNAME` (+ contenu `dev.jouan.ovh`) et le portrait `portrait_512x512_drip_art_8.webp`, avant `Deploy`.
- [x] [Review][Patch] Sérialiser les déploiements pour éviter qu'un ancien run écrase un plus récent [.github/workflows/cd.yml:3] — sans `concurrency`, deux pushes rapprochés sur `main` peuvent finir dans le désordre et publier l'ancien build en dernier. **→ Résolu** : bloc `concurrency: { group: deploy-gh-pages, cancel-in-progress: false }`.

## Dev Notes

### Contexte & contraintes (depuis project-context.md et SPEC)

- **Cible de build = site STATIQUE** : `yarn generate` (`nuxi generate`) → sortie `.output/public`. [Source: docs/project-context.md#Build & déploiement]
- **Déploiement** : `yarn deploy` = `push-dir --dir=.output/public --branch=gh-pages --cleanup` (en local) ; en CI, workflow `cd.yml` via `peaceiris/actions-gh-pages@v3`. [Source: docs/project-context.md#Build & déploiement ; .github/workflows/cd.yml]
- **⚠️ `CNAME` critique** : le domaine custom dépend de `CNAME` ; régression déjà survenue (commit `cf1829e` « fix the github page custom domain removed on github workflow »). Ne pas le perdre lors du déploiement gh-pages. [Source: docs/project-context.md#Build & déploiement ; docs/specs/spec-design-system-revamp/SPEC.md#Constraints]
- **Compatibilité prerender** : tout code doit passer `nuxi generate` ; accès DOM gardés (`onMounted` / `import.meta.client`). [Source: docs/project-context.md#Règles Langage & Framework ; SPEC.md#Constraints]
- **CAP-1 success signal** : « `yarn install` puis `yarn generate` réussissent sans erreur sur Nuxt 4 ; le site pré-refonte rend les mêmes pages qu'avant et se déploie sur `gh-pages` avec `CNAME` intact ». **C'est exactement le critère de sortie de cette story.** [Source: docs/specs/spec-design-system-revamp/SPEC.md#Capabilities (CAP-1)]
- **NFR5 / NFR8** : déploiement préservé (`CNAME` + chaîne `yarn generate` → `gh-pages` non régressés) ; cette validation doit être **verte avant** d'entamer FR2+ (Epic 2). [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]

### Fichiers à modifier (lus — état actuel)

- **`CNAME`** (racine, lecture/DÉPLACER) — contenu actuel : `dev.jouan.ovh`. Situé à la racine du dépôt, **absent de `public/`** et **non copié** par le workflow. → C'est la source du risque ; le déplacer/dupliquer sous `public/CNAME` (recommandé) le fait entrer automatiquement dans `.output/public`.
- **`public/`** (lecture/UPDATE) — contient `_headers`, `favicon.ico`, `images/`. C'est le bon emplacement pour les fichiers statiques émis tels quels par `nuxi generate` (donc pour `CNAME`).
- **`.github/workflows/cd.yml`** (lecture/UPDATE) — état actuel des steps : Checkout → setup-node (`node: [18]`) → `yarn` → `yarn generate` → `cp public/_headers .output/public/_headers` → `peaceiris/actions-gh-pages@v3` (`publish_dir: .output/public`). Déclencheurs : push/PR sur `main`. À ajuster : (a) garantir `CNAME` dans la sortie (via `public/CNAME` OU une étape « Copy CNAME » symétrique à « Copy _headers ») ; (b) éventuellement monter la version Node si Nuxt 4 l'exige.
- **`package.json`** (lecture) — scripts `generate` (`nuxi generate`), `preview` (`nuxi preview`), `deploy` (`push-dir ... --branch=gh-pages --cleanup`) à conserver. (Le script `lint`, ajouté en story 1.3, doit rester vert.)
- **`nuxt.config.ts`** (lecture) — `ssr: true`, `experimental.payloadExtraction: false` : à conserver pour que le prerender statique se comporte comme avant.

### Spécificités techniques à jour (Nuxt 4 prerender / gh-pages)

- **Sortie `nuxi generate`** : Nuxt 4 émet le site statique sous `.output/public`. Tout fichier placé dans `public/` est copié à l'identique dans la sortie (mécanisme idéal pour `CNAME` et `_headers`). [Source: https://nuxt.com/docs/4.x/getting-started/deployment — Static Hosting]
- **`payloadExtraction: false`** conservé : évite les payloads séparés, comportement déjà en place avant migration. [Source: nuxt.config.ts (état actuel)]
- **GitHub Pages + domaine custom** : GitHub Pages exige un fichier `CNAME` à la racine de la branche publiée (`gh-pages`) ; s'il disparaît de la sortie, le domaine custom est réinitialisé → exactement la régression de `cf1829e`. Émettre `CNAME` via `public/` (recommandé) le rend résilient au prochain refactor du workflow.
- **`peaceiris/actions-gh-pages@v3`** : publie `publish_dir` tel quel sur `gh-pages` ; il ne réinjecte pas `CNAME` automatiquement sauf option dédiée — d'où l'importance que `CNAME` soit **déjà** dans `.output/public`.
- **Version Node CI** : Nuxt 4 cible des versions Node récentes ; `node: [18]` peut être insuffisant — valider et, le cas échéant, monter (ex. Node 20+) sans casser le pipeline. [Source: https://nuxt.com/docs/4.x/getting-started/upgrade]

### Pièges / régressions à éviter

- **Perte de `CNAME`** = perte du domaine custom (`dev.jouan.ovh`) : c'est LA régression historique (`cf1829e`). Vérifier explicitement `.output/public/CNAME` après `yarn generate`, et sa présence sur `gh-pages` après déploiement.
- **`_headers` oublié** : l'étape « Copy _headers » du workflow doit rester ; ne pas la supprimer en touchant au YAML.
- **Accès DOM non gardé** : un composant accédant à `window`/`document` hors `onMounted` / `import.meta.client` fera échouer `yarn generate` (prerender). Identifier et garder le cas échéant (legacy terminal, `ua-parser-js`).
- **Double source de `CNAME`** : si on déplace `CNAME` dans `public/`, retirer/aligner toute copie racine pour éviter l'incohérence (et toute étape de workflow qui copierait l'ancien emplacement).
- **Désynchro local vs CI** : `yarn deploy` (local, `push-dir`) et le workflow `cd.yml` (CI) doivent tous deux publier une sortie contenant `CNAME` + `_headers` — valider les deux chemins.

### Project Structure Notes

- Aucune nouvelle entité applicative ; pas de déplacement de `pages/`/`components/` (la structure est figée en story 1.1).
- Seul changement de structure recommandé : `CNAME` racine → `public/CNAME` (fichier statique), pour fiabiliser l'émission dans `.output/public`.

### Testing standards

- Pas de framework de test. [Source: docs/project-context.md#Tests]
- Validation = **`yarn generate` réussit** + `.output/public` contient les pages existantes + `.output/public/CNAME` présent (`dev.jouan.ovh`) + `_headers` présent + `yarn lint` vert + déploiement `gh-pages` fonctionnel (domaine custom intact). [Source: docs/project-context.md#Tests ; docs/specs/spec-design-system-revamp/SPEC.md#Capabilities (CAP-1)]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 1: Migration de la stack vers Nuxt 4 — Story 1.4]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#Capabilities (CAP-1), #Constraints]
- [Source: docs/project-context.md#Build & déploiement, #Règles Langage & Framework, #Pièges, #Tests]
- [Source: .github/workflows/cd.yml — chaîne CI generate → copy _headers → actions-gh-pages]
- [Source: CNAME (racine, `dev.jouan.ovh`) ; commit cf1829e — régression domaine custom]
- [Source: https://nuxt.com/docs/4.x/getting-started/deployment — Static Hosting / .output/public]

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Amelia / BMad dev-story)

### Debug Log References

- `pnpm generate` → exit 0, « Prerendered 24 routes ». `.output/public` contient `index.html`, `200.html`, `404.html`, `about/`, `blog/`, `_ipx/` (18 variantes), `_nuxt/`, `__nuxt_content/`, `images/`, `CNAME` (`dev.jouan.ovh`), `_headers`, `favicon.ico`.
- 1er `generate` échouait (`IPX_FILE_NOT_FOUND`) : le portrait `public/images/portrait_512x512_drip_art_8.webp` référencé par `about.vue` avait été supprimé au commit `06555cc`. Restauré depuis `faacdb2` (24 fichiers portrait) → generate vert.

### Completion Notes List

- **Build statique validé** sur la stack migrée (Nuxt 4 + pnpm). Pages, images optimisées (`_ipx`) et dump blog statique (`__nuxt_content`) émis.
- **CNAME fiabilisé** : déplacé `racine → public/CNAME` (émission auto), supprimant la cause de la régression historique `cf1829e`.
- **CI migrée** : `cd.yml` Yarn→pnpm + Node 18→22 ; `_headers` + `CNAME` garantis dans la sortie.
- **Asset restauré** : portraits supprimés par erreur en `06555cc` rétablis (sinon prerender cassé). Le vrai portrait du nouveau DS reste à traiter en story 5.1.
- Déploiement gh-pages réel non exécuté ici (push outward-facing depuis une branche feature) — se fera via la CI au merge sur `main`.

#### Correctifs de revue (2026-06-19)

Durcissement du workflow `.github/workflows/cd.yml` — 5 findings résolus :

- ✅ [Patch] **Garde déploiement PR** : step `Deploy` conditionné par `if: github.event_name == 'push'`. Les PR valident (lint/typecheck/generate/assertions) sans publier.
- ✅ [Patch] **Permissions explicites** : `permissions: contents: write` au niveau workflow (publish gh-pages via `GITHUB_TOKEN` sans risque de 403).
- ✅ [Patch] **Gate qualité CI** : steps `Lint` + `Typecheck` avant `Generate`. Vérifiés localement sous Node 22 (Docker) : `pnpm lint` exit 0 (0 erreur / 43 warnings baseline), `pnpm typecheck` exit 0.
- ✅ [Patch] **Assertions sortie statique** : step `Verify static output` (`set -euo pipefail`) qui échoue si une page (`index/200/404/about/blog`), `_headers`, `CNAME` (+ contenu `dev.jouan.ovh`) ou le portrait `portrait_512x512_drip_art_8.webp` manquent — testé contre `.output/public` réel (8/8 OK).
- ✅ [Patch] **Sérialisation** : `concurrency: { group: deploy-gh-pages, cancel-in-progress: false }` empêche deux pushes rapprochés de publier dans le désordre.
- Validation : `pnpm generate` exit 0 (24 routes), YAML du workflow validé (parseur), script d'assertions vert contre la sortie réelle. La CI réelle s'exécutera au merge sur `main`.
- Convention : outillage exécuté **via Docker** (`docker compose run --rm web pnpm <cmd>`), cf. `CLAUDE.md`.

### File List

- `CNAME` (supprimé de la racine) → `public/CNAME` (créé)
- `.github/workflows/cd.yml` (réécrit : pnpm + Node 22 ; **correctifs de revue** : permissions, concurrency, gate lint/typecheck, assertions sortie, garde déploiement push-only)
- `public/images/portrait*` (24 fichiers restaurés depuis `faacdb2`)

## Change Log

| Date | Version | Description | Auteur |
|------|---------|-------------|--------|
| 2026-06-18 | 0.1 | `pnpm generate` vert + CNAME→public + cd.yml pnpm/Node22 + restauration portraits. Clôt l'Epic 1. Status → review. | Amelia (dev-story) |
| 2026-06-19 | 0.2 | Correctifs de revue : 5 findings résolus (durcissement `cd.yml` — permissions, concurrency, gate lint/typecheck, assertions sortie statique, garde déploiement push-only). Validations vertes. Status → review. | Amelia (dev-story) |
