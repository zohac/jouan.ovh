# Story 1.4: Valider build statique et déploiement gh-pages

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a mainteneur du site jouan.ovh,
I want valider `yarn generate` et le déploiement gh-pages après migration,
so that la chaîne de production est verte avant d'entamer la refonte.

## Acceptance Criteria

1. **Given** la stack migrée, **When** on lance `yarn generate`, **Then** le build statique réussit et `.output/public` contient les pages existantes.
2. **Given** le build statique, **When** on inspecte la sortie et la chaîne de déploiement, **Then** le fichier `CNAME` est présent dans la sortie et le déploiement `gh-pages` reste fonctionnel.

> Périmètre : **validation finale de la chaîne de production** (build statique + déploiement gh-pages), après le cœur Nuxt 4 (story 1.1), la mise à jour des modules (story 1.2) et l'outillage lint (story 1.3). Cette story **clôt l'Epic 1** : elle ne déplace pas de fichiers et n'ajoute pas de feature ; elle garantit que `yarn generate` → `.output/public` → `gh-pages` (avec `CNAME` et `_headers`) fonctionne comme avant la migration.

## Tasks / Subtasks

- [ ] Tâche 1 — Valider le build statique `yarn generate` (AC: #1)
  - [ ] `yarn install` (propre) puis `yarn generate` réussit sans erreur (gestionnaire = **Yarn**)
  - [ ] Vérifier la sortie dans `.output/public` (cible Nuxt 4 du prerender statique)
  - [ ] Confirmer la présence des pages existantes générées : `/` (index), `/about`, et les routes blog (`blog/[...slug]`)
  - [ ] `yarn preview` sert le build statique et les pages se chargent (pas d'erreur de prerender / d'accès DOM non gardé)
- [ ] Tâche 2 — Garantir la présence de `CNAME` dans la sortie (AC: #2)
  - [ ] Constater l'état actuel : `CNAME` est à la **racine du dépôt** (contenu `dev.jouan.ovh`), il n'est **pas** dans `public/` et **n'est pas copié** par le workflow → risque de régression (cf. commit `cf1829e`)
  - [ ] **DÉCISION PO : déplacer `CNAME` dans `public/CNAME`** afin que `nuxi generate` l'émette automatiquement dans `.output/public/CNAME` (comme `public/_headers`). Retirer le `CNAME` de la racine pour éviter une double source.
  - [ ] Après déplacement, retirer toute étape de workflow qui copierait l'ancien `CNAME` racine (devenue inutile).
  - [ ] Vérifier que `.output/public/CNAME` contient bien `dev.jouan.ovh` après `yarn generate`
- [ ] Tâche 3 — Valider la chaîne de déploiement gh-pages (AC: #2)
  - [ ] Relire `.github/workflows/cd.yml` : `yarn` → `yarn generate` → `cp public/_headers .output/public/_headers` → `peaceiris/actions-gh-pages@v3` (`publish_dir: .output/public`)
  - [ ] S'assurer que `_headers` est toujours copié et présent dans la sortie
  - [ ] Vérifier la cohérence de la version Node du workflow (`node: [18]`) avec les exigences de Nuxt 4 ; monter si nécessaire (Nuxt 4 requiert Node récent) sans casser le pipeline
  - [ ] Vérifier que le script local `deploy` (`push-dir --dir=.output/public --branch=gh-pages --cleanup`) pousse bien une sortie contenant `CNAME` + `_headers`
- [ ] Tâche 4 — Vérification de non-régression (AC: #1, #2)
  - [ ] `yarn lint` (eslint + stylelint, flat config story 1.3) reste vert
  - [ ] Le site généré rend les mêmes pages qu'avant migration (parité de contenu pré-refonte)
  - [ ] Le domaine custom (`dev.jouan.ovh`) reste servi : `CNAME` présent dans la branche `gh-pages` après déploiement

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

### Debug Log References

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.

### File List
