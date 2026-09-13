---
baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
---

# Story 10.1: Décision hébergement prod et dé-risquage du déploiement gh-pages

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a mainteneur du site,
I want trancher l'hébergement de production et prouver la chaîne de déploiement gh-pages (`CNAME` inclus) sur un dry-run,
so that la première mise en production de la refonte ne révèle pas de surprise (chaîne CI jamais exécutée en réel, ~28 stories empilées sur `feat/design-system-revamp`).

## Acceptance Criteria

**Given** la cible prod `jouan.ovh` et la chaîne `pnpm generate` → publication `gh-pages`
**When** on tranche l'hébergement prod (domaine, branche de déploiement, `CNAME`) et on exécute un dry-run de la chaîne depuis le staging
**Then** la décision est consignée et `SITE_URL` est lu depuis `runtimeConfig` (valeur staging/prod swappable, sans domaine hardcodé)
**And** le dry-run prouve `pnpm generate` vert (11 routes) + un artefact `gh-pages` servant le site avec `CNAME` intact (régression `cf1829e` non reproduite), documenté dans la story

> **Découpage AC (numérotation pour les tâches) :**
> 1. **Décision d'hébergement prod consignée** (domaine, branche→environnement, mécanisme `CNAME` staging vs prod) dans la story (+ `deferred-work.md`/`project-context.md` si besoin).
> 2. **`SITE_URL` lu depuis `runtimeConfig.public`** (plus de domaine hardcodé dans `app/utils/seo.ts`), valeur **staging par défaut inchangée** (`dev.jouan.ovh`) et **surchargeable** vers prod par env — sans casser le staging actuel.
> 3. **Dry-run de la chaîne prouvé** : `pnpm generate` vert (11 routes) + artefact `.output/public` valide (pages + `_headers` + `CNAME` + portrait) servant le site, `CNAME` intact ; consigné (logs/captures) dans le Dev Agent Record.

## Tasks / Subtasks

- [x] Tâche 1 — Trancher et consigner l'hébergement de production (AC: #1) — **⚠️ décision Simon requise, cf. Dev Notes › Décision requise**
  - [x] Acter le **domaine prod** (`jouan.ovh`) et la **correspondance branche → environnement** (ex. `develop` → staging `dev.jouan.ovh`, `main` → prod `jouan.ovh`).
  - [x] Acter le **mécanisme `CNAME`** : aujourd'hui `public/CNAME` = `dev.jouan.ovh` (committé, émis tel quel par `generate`). Décider comment le prod sert `jouan.ovh` (option A : `public/CNAME` devient `jouan.ovh` au moment du merge prod en 10.7 ; option B : `CNAME` écrit par le job CI selon la branche). **Ne PAS basculer la valeur live `dev.jouan.ovh` dans cette story** (le staging doit continuer à fonctionner) — la bascule réelle est la story 10.7.
  - [x] Consigner la décision dans la story (section Décision) ; mettre à jour `deferred-work.md` items #7/#9 si la décision les précise.
- [x] Tâche 2 — Rendre `SITE_URL` swappable via `runtimeConfig` (AC: #2)
  - [x] Ajouter `runtimeConfig.public.siteUrl` dans `nuxt.config.ts` (à côté de `web3formsAccessKey`), **valeur par défaut `https://dev.jouan.ovh`** (staging, identique à l'actuel), surchargeable par env `NUXT_PUBLIC_SITE_URL` (ajouter au `.env.example`).
  - [x] Repointer les consommateurs de `SITE_URL` (`app/utils/seo.ts` + `app/pages/about.vue`, `app/pages/blog/index.vue`, `app/pages/blog/[...slug].vue`) pour lire la valeur depuis `useRuntimeConfig().public.siteUrl`. ⚠️ `useRuntimeConfig()` est un composable → l'appeler **dans le `setup`/contexte Nuxt**, pas au niveau module d'un util pur (cf. Dev Notes › `SITE_URL` → runtimeConfig). Conserver `jsonLdScript()` tel quel.
  - [x] Vérifier qu'aucune **URL canonique complète** du site ne reste hardcodée dans le code applicatif ; le seul littéral admis pour l'URL de base = le défaut dans `nuxt.config.ts` et `public/CNAME`.
  - [x] Confirmer le rendu **identique** du HTML prerendu pour `/about`, `/blog`, `/blog/[...slug]` (canonical/og:url toujours en `https://dev.jouan.ovh/...` tant que l'env n'est pas surchargée).
- [x] Tâche 3 — Dry-run de la chaîne de déploiement (AC: #3)
  - [x] Lire et comprendre la chaîne **déjà en place** : `.github/workflows/cd.yml` (gate lint+typecheck+generate → copie `_headers`/`CNAME` → `Verify static output` → `peaceiris/actions-gh-pages` **sur push `main` uniquement**, PR `main` = validation sans déploiement) ET le script local `pnpm deploy` (`push-dir` → `gh-pages`). **Ne pas réinventer** : la chaîne existe, on la **prouve**.
  - [x] Exécuter le dry-run **sans publier en prod**. Option recommandée : ouvrir une **PR vers `main`** (déclenche la validation CI — lint/typecheck/generate/`Verify static output` — **sans** l'étape Deploy, gardée `if: github.event_name == 'push'`). Alternative locale : `docker compose run --rm web sh -c "corepack enable && pnpm generate"` puis inspecter `.output/public`.
  - [x] Vérifier l'artefact `.output/public` : présence de `index.html`, `200.html`, `404.html`, `about/index.html`, `blog/index.html`, `_headers`, `CNAME` (= domaine attendu), `images/portrait_512x512_drip_art_8.webp` (les fichiers contrôlés par le step `Verify static output`). Confirmer **11 routes** prerendered et `CNAME` intact (régression `cf1829e` non reproduite).
  - [x] Consigner le résultat du dry-run (sortie CI / logs `generate` / liste `.output/public`) dans le Dev Agent Record.
- [x] Tâche 4 — Validation qualité (AC: #2, #3)
  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` **verts** (11 routes), aucune valeur hardcodée réintroduite.
  - [x] Vérif navigateur (Chrome DevTools MCP) : `/about` et `/blog` — `canonical`/`og:url` rendus, domaine résolu depuis `runtimeConfig` (inchangé en staging). Vue article non vérifiable en navigateur faute d'article réel (`content/blog/` vide), mais couverte par typecheck/prerender.

## Dev Notes

### Périmètre & décision

- **Story d'ouverture de l'Epic 10 (« fin de refonte »)** : elle (a) **tranche l'hébergement prod** — input qui débloque tout l'épic, (b) pose le **mécanisme `SITE_URL` swappable** via `runtimeConfig`, (c) **dé-risque la chaîne de déploiement** par un dry-run, **avant** la mise en prod réelle. Décision rétro Epic 9 : dé-risquer le déploiement **tôt** (chaîne jamais exécutée sur `main`, report assumé depuis l'Epic 1). [Source: `docs/implementation-artifacts/epic-9-retro-2026-06-29.md` §6/§7 ; `deferred-work.md` items #7, #9]
- **Frontières à respecter (ne pas déborder) :**
  - **Story 10.5 (SEO)** fera la **centralisation SEO** (`useSeoMeta`/`app.head` partagé, `publisher`/`Organization`, OG/JSON-LD des pages nues). Ici on ne fait QUE déplacer `SITE_URL` vers `runtimeConfig` (plomberie minimale) — **pas** de refonte des métadonnées.
  - **Story 10.7 (mise en prod réelle)** fera la **bascule live** `dev.jouan.ovh` → `jouan.ovh` (`CNAME` + valeur prod), le **merge `main`** et le **déploiement prod**. Ici on **ne bascule pas** le domaine live et **on ne merge pas** — on prouve seulement la chaîne en dry-run.
- **Nature « décision + spike + plomberie légère »** : une bonne part de la valeur est la **décision consignée** + la **preuve** que la chaîne marche. Le code touché est volontairement **minimal et non destructif** (staging reste vert).

### Décision requise — hébergement de production (input Simon)

> **À trancher avant/au lancement de `dev-story`.** Le code par défaut garde le staging intact ; seule la décision oriente 10.7.

> **✅ Décision actée (Simon, 2026-06-30) :**
> 1. **Environnements** : 2 envs souhaités *idéalement*. ⚠️ **Contrainte GitHub Pages : un repo = un seul site Pages = un seul domaine custom** (un seul `CNAME`) → impossible de servir `jouan.ovh` ET `dev.jouan.ovh` depuis ce repo. **Décision : prod `jouan.ovh` sur CE repo** (`main` → `gh-pages`, Option A). Le **staging `dev.jouan.ovh` permanent = setup séparé** (repo dédié ou 2ᵉ host type Cloudflare Pages/Netlify, ou PR previews) — **hors chemin critique**, à mettre en place séparément (ne bloque pas la livraison prod ; traçable comme tâche distincte, pas dans Epic 10 sauf décision contraire).
> 2. **Mécanisme `CNAME` : Option A** — `public/CNAME` passe à `jouan.ovh` au merge prod (story 10.7), en même temps que le `grep -qx` du step `Verify static output` de `cd.yml`.
> 3. **DNS** : OK — Simon configure l'enregistrement `jouan.ovh` → GitHub Pages chez OVH avant 10.7.
>
> _Conséquence pour 10.1_ : la valeur par défaut de `siteUrl` **reste `https://dev.jouan.ovh`** (staging) ; la bascule vers `jouan.ovh` (valeur + `CNAME` + guard CI) est faite en **10.7**. Le dry-run de 10.1 se fait avec le `CNAME` actuel (`dev.jouan.ovh`), donc le guard CI passe.

Contexte : `public/CNAME` = `dev.jouan.ovh` (staging, branche `develop` → `gh-pages` historiquement) ; la prod cible est `jouan.ovh`, **hébergement encore non décidé**. Questions ouvertes :

1. **Modèle d'environnements** — confirme-t-on `develop` → staging (`dev.jouan.ovh`) et `main` → prod (`jouan.ovh`) sur **le même repo / la même branche `gh-pages`** ? (cd.yml déploie aujourd'hui depuis `main` uniquement.) Si staging et prod doivent coexister, il faut **deux cibles `gh-pages`** (deux repos ou deux domaines) — à acter.
2. **Mécanisme `CNAME`** — _Option A (simple)_ : `public/CNAME` passe à `jouan.ovh` au merge prod (10.7), et le staging vit sur une autre cible. _Option B (paramétré)_ : le job CI écrit le `CNAME` selon la branche/l'environnement. **Recommandation : Option A** (le moins de magie ; cohérent avec « `CNAME` committé émis par `generate` »), sauf si tu veux conserver un staging permanent en parallèle de la prod.
3. **DNS `jouan.ovh`** — l'enregistrement DNS (A/ALIAS/CNAME GitHub Pages) doit pointer vers GitHub Pages avant 10.7. Hors code, mais à acter par Simon (registrar OVH).

⚠️ Le step CI `Verify static output` **épingle `grep -qx "dev.jouan.ovh" .output/public/CNAME`** : tant que le `CNAME` reste `dev.jouan.ovh`, le dry-run passe ; **10.7 devra mettre à jour cette ligne** en même temps que le `CNAME`. À tracer pour 10.7, ne pas oublier.

### État actuel de la chaîne de déploiement (déjà en place — NE PAS réinventer)

- **`.github/workflows/cd.yml`** (existe, bien construit) : `on: push main` + `pull_request main` ; `permissions: contents: write` ; concurrency sérialisée. Étapes : setup pnpm + Node 22 → `pnpm install --frozen-lockfile` → **`pnpm lint`** → **`pnpm typecheck`** → **`pnpm generate`** → copie `_headers`+`CNAME` dans `.output/public` → **`Verify static output`** (présence des fichiers clés + `grep -qx "dev.jouan.ovh"` sur le `CNAME`) → **Deploy** `peaceiris/actions-gh-pages@v3` (publish `.output/public`), **gardé `if: github.event_name == 'push'`** → les **PR valident sans publier**.
- **Script local `pnpm deploy`** : `push-dir --dir=.output/public --branch=gh-pages --cleanup` (dép. `push-dir@^0.4.1`). Fallback manuel de publication.
- **Conséquence pour le dry-run** : ouvrir une **PR vers `main`** exécute exactement le gate + `Verify static output` **sans déployer** → c'est le dry-run **le plus sûr et le plus représentatif** (mêmes étapes que la prod, étape Deploy sautée). C'est le chemin recommandé.

### `SITE_URL` → `runtimeConfig` (implémentation, piège à éviter)

- **État actuel** : `app/utils/seo.ts` exporte `export const SITE_URL = "https://dev.jouan.ovh";` (constante **module**, auto-importée). Consommée par `app/pages/about.vue` (`pageUrl`/`pageImage`), `app/pages/blog/index.vue` (`pageUrl` + `url`/`image` JSON-LD), `app/pages/blog/[...slug].vue` (`url`/`image`).
- **Cible** : la valeur vient de `useRuntimeConfig().public.siteUrl` (défaut `https://dev.jouan.ovh` dans `nuxt.config.ts`, surchargeable par `NUXT_PUBLIC_SITE_URL`).
- **⚠️ Piège** : `useRuntimeConfig()` ne s'appelle **que dans un contexte Nuxt** (setup de composant, plugin, route middleware) — **pas** au niveau module d'un util pur. Donc on ne peut pas garder `export const SITE_URL = useRuntimeConfig()…` dans `seo.ts`. Deux approches valides :
  - (a) **Lire `useRuntimeConfig().public.siteUrl` dans le `<script setup>` de chaque page** (about/blog/article) — explicite, local au contexte ; `seo.ts` ne garde que `jsonLdScript()`.
  - (b) Exposer un **composable** `useSiteUrl()` dans `app/composables/` qui retourne `useRuntimeConfig().public.siteUrl` ; les pages l'appellent. (Plus DRY, prépare 10.5.)
  - **Recommandation : (b)** (un point d'accès, cohérent avec la centralisation SEO de 10.5), mais (a) est acceptable si plus simple. Documenter le choix dans Completion Notes.
- **Invariant** : tant que `NUXT_PUBLIC_SITE_URL` n'est pas surchargée, le rendu reste `https://dev.jouan.ovh/...` (zéro changement visible en staging).

### Fichiers concernés (lus — état actuel au baseline `3e82045`)

- **`nuxt.config.ts`** (UPDATE) — possède déjà `runtimeConfig.public.web3formsAccessKey: ""`. **Ajouter** `siteUrl: "https://dev.jouan.ovh"`. Ne pas toucher au reste (head, modules, content highlight off, components ui/, ssr, experimental, eslint).
- **`app/utils/seo.ts`** (UPDATE) — retirer le hardcode `SITE_URL`, garder `jsonLdScript()`. (Ou transformer en `useSiteUrl()` composable, cf. approche b.)
- **`app/pages/about.vue`**, **`app/pages/blog/index.vue`**, **`app/pages/blog/[...slug].vue`** (UPDATE) — repointer la lecture de l'URL de prod sur `runtimeConfig`. **Préserver** la forme exacte des canonical/og/JSON-LD (mêmes chemins, même rendu en staging).
- **`public/CNAME`** (LECTURE en 10.1, UPDATE en 10.7) — `dev.jouan.ovh`. **Ne pas changer ici.**
- **`.github/workflows/cd.yml`** (LECTURE en 10.1) — chaîne CI ; le `grep -qx "dev.jouan.ovh"` du step `Verify static output` est couplé au `CNAME` (à mettre à jour en 10.7).
- **`package.json`** (LECTURE) — script `deploy` (`push-dir`), dép. `push-dir`. Pas de changement attendu.
- **`.env.example`** (UPDATE) — ajouter `NUXT_PUBLIC_SITE_URL=` (commenté : défaut = staging ; renseigner `https://jouan.ovh` en prod).

### Pièges / régressions à éviter

- **Ne pas casser le staging** : la valeur par défaut de `siteUrl` reste `https://dev.jouan.ovh` ; `public/CNAME` reste `dev.jouan.ovh`. Aucune bascule live dans cette story.
- **`useRuntimeConfig()` hors contexte** : ne pas l'appeler au top-level d'un util/module (erreur runtime / prerender). Cf. ci-dessus.
- **CNAME guard CI couplé** : ne pas modifier `public/CNAME` sans aussi le `grep` du `Verify static output` (sinon CI rouge) — concerne surtout 10.7, mais à connaître.
- **Compatibilité prerender (NFR4)** : `pnpm generate` doit rester vert (11 routes) ; `runtimeConfig.public` est inliné au prerender, OK.
- **Ne pas régresser le `CNAME`** (régression historique `cf1829e`) : le dry-run doit **prouver** la présence du `CNAME` dans `.output/public`.
- **pnpm + Docker** : toutes les commandes via `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"` (jamais sur l'hôte). [Source: `docs/project-context.md#Environnement de dev`]
- **Ne pas merger sur `main` ni publier en prod** dans cette story (c'est 10.7). Le dry-run via PR `main` valide **sans** déployer (étape Deploy gardée `if push`).

### Testing standards

- Pas de framework de test (`docs/project-context.md#Tests`). Barre = `pnpm lint` (eslint + stylelint) + `pnpm typecheck` (vue-tsc) + `pnpm generate` (Docker) **verts**, + **dry-run** de la chaîne (PR `main` ou `generate` local + inspection `.output/public`), + vérif navigateur (Chrome DevTools MCP) des canonical/og inchangés en staging. Consigner les preuves (logs/captures) dans le Dev Agent Record.

### References

- [Source: docs/planning-artifacts/epics.md#Epic 10 — Story 10.1 (FR17)]
- [Source: docs/implementation-artifacts/deferred-work.md#→ Epic 10 (items #7 domaine, #9 déploiement)]
- [Source: docs/implementation-artifacts/epic-9-retro-2026-06-29.md §5/§6/§7 (dé-risquer le déploiement, trancher l'hébergement)]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#CAP-1, #Constraints (Déploiement préservé), #NFR (CNAME/gh-pages)]
- [Source: docs/project-context.md#Déploiement, #Environnement de dev (Docker), #Pièges (CNAME `cf1829e`)]
- [Source: .github/workflows/cd.yml ; nuxt.config.ts ; app/utils/seo.ts ; public/CNAME ; package.json ; .env.example]

## Dev Agent Record

### Agent Model Used

Opus 4.8 (1M context) — `claude-opus-4-8[1m]`.

### Debug Log References

Toutes les commandes via Docker (jamais sur l'hôte), cf. project-context.

```
# Gate CI de cd.yml reproduit localement (Tâche 3/4)
docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
  → lint ✓ · typecheck ✓ · generate ✓ · "[nitro] Prerendered 11 routes in ~2.6s"

# Steps CI 'Ensure _headers + CNAME' + 'Verify static output' rejoués sur .output/public
  → index.html, 200.html, 404.html, about/index.html, blog/index.html, _headers, CNAME,
    images/portrait_512x512_drip_art_8.webp  → tous présents
  → grep -qx "dev.jouan.ovh" .output/public/CNAME  → ✓ (CNAME intact, régression cf1829e non reproduite)

# canonical/og:url — prerender (.output/public) ET runtime live (dev server SSR)
grep canonical .output/public/{about,blog}/index.html   → https://dev.jouan.ovh/{about,blog}
curl -s http://localhost:3000/{about,blog}              → idem (useSiteUrl() OK en contexte runtime)

# Surchargeabilité prouvée
docker compose run --rm -e NUXT_PUBLIC_SITE_URL=https://jouan.ovh web sh -c "corepack enable && pnpm generate"
  → canonical /about = https://jouan.ovh/about ✓ ; CNAME reste dev.jouan.ovh ✓ ; 11 routes
  → puis regenerate sans override → retour https://dev.jouan.ovh (état staging validé)

# Piège Docker/SQLite connu : `generate` en `run --rm` périme la DB @nuxt/content du dev
#   → `docker compose restart web` (réindexe + prend la nouvelle nuxt.config)
```

### Completion Notes List

- **AC#1 — Décision d'hébergement consignée.** La décision était déjà actée par Simon (2026-06-30, Dev Notes › Décision requise) : **prod `jouan.ovh` sur CE repo** (`main` → `gh-pages`, **Option A**) ; **staging `dev.jouan.ovh` = setup séparé** hors chemin critique (contrainte GitHub Pages : 1 repo = 1 domaine custom) ; `CNAME` reste `dev.jouan.ovh` jusqu'à 10.7. Propagée dans `deferred-work.md` (items #6 sous-point runtimeConfig ✅, #7 domaine, #9 déploiement), avec le **rappel explicite pour 10.7** : mettre à jour le `grep -qx "dev.jouan.ovh"` du step `Verify static output` **en même temps** que le `CNAME` (couplés, sinon CI rouge). Aucune bascule live ici (staging intact).
- **AC#2 — `SITE_URL` swappable via `runtimeConfig`.** Approche **(b)** retenue (composable `useSiteUrl()` — un point d'accès unique, cohérent avec la centralisation SEO de 10.5) plutôt que la lecture inline (a). `runtimeConfig.public.siteUrl` ajouté à `nuxt.config.ts` (défaut `https://dev.jouan.ovh`, à côté de `web3formsAccessKey`), surchargeable `NUXT_PUBLIC_SITE_URL`. `SITE_URL` retiré de `app/utils/seo.ts` (ne garde que `jsonLdScript()`) ; `about.vue`, `blog/index.vue`, `blog/[...slug].vue` appellent `useSiteUrl()` **dans le setup** (dans `[...slug].vue`, capturée **hors** du getter `useHead` — un composable ne s'appelle pas dans un callback). `useSiteUrl()` parse désormais la config via `new URL()`, exige une origin http(s) sans chemin/query/hash et retourne `url.origin` normalisée. Grep : plus aucune URL canonique complète du site n'est hardcodée dans `app/` ; l'URL de base ne vit que dans `nuxt.config.ts` et `public/CNAME`.
- **`.env.example`** : `NUXT_PUBLIC_SITE_URL` ajouté **commenté** (et non `=` nu comme la clé Web3Forms) — délibéré : une ligne `NUXT_PUBLIC_SITE_URL=` non commentée dans un `.env` écraserait le défaut par une **chaîne vide** (canonical/og cassés). Laisser non défini = défaut staging ; décommenter uniquement en prod.
- **AC#3 — Dry-run prouvé (sans publier).** Gate de `cd.yml` reproduit localement (Docker) : `lint`+`typecheck`+`generate` verts, **11 routes**, artefact `.output/public` complet, step `Verify static output` OK, `CNAME` intact. **Ni merge `main`, ni déploiement** (étape `Deploy` gardée `if: github.event_name == 'push'` → non déclenchée en local ; 1re exécution réelle = 10.7). L'ouverture d'une PR vers `main` (gate réel sans deploy) est une action **outward-facing / git** laissée à la main de Simon — non déclenchée unilatéralement dans cette story de dé-risquage.
- **Vérif navigateur.** Chrome DevTools MCP a vérifié `/about` et `/blog` en navigateur (2026-09-12) : canonical/og résolus depuis `runtimeConfig`, inchangés en staging (`https://dev.jouan.ovh/about`, `https://dev.jouan.ovh/blog`) ; JSON-LD `/blog` présent avec `blogPost: []`. Aucun article réel n'existe aujourd'hui (`content/blog/` vide), donc la vue article ne peut pas être rendue au navigateur ; elle reste couverte par typecheck + prerender.
- **Blog sans article.** `content/blog/` est vide → blog en empty-state (`blogPost:[]`), aucune sous-route `/blog/*` prerendue (cohérent avec 11 routes). La vue article partage le même `useSiteUrl()` (validé par typecheck + prerender) ; pas d'article réel à rendre en dry-run.

**✅ Résolution des findings de revue (2026-07-02) :**

- ✅ Resolved review finding [Patch] : **durcir `useSiteUrl()`** (décision D1). Garde-fou fail-fast ajouté — `throw` si `siteUrl` n'est pas une URL absolue (`/^https?:\/\//`) + strip du/des slash(es) final(aux) (`.replace(/\/+$/, "")`). **Prouvé au prerender** : override `NUXT_PUBLIC_SITE_URL=https://jouan.ovh/` → `canonical = https://jouan.ovh/about` (pas de `//`) ; override `notaurl` → **seuls `/about` et `/blog` (les consommateurs du composable) tombent en `[500]` → `generate` échoue** (« Exiting due to prerender errors »), les autres routes intactes → c'est bien le garde-fou qui déclenche l'échec, pas un effet de bord. [app/composables/useSiteUrl.ts]
- ✅ Resolved review finding [Patch] : **`sprint-status.yaml`** — `epic-9` passé `in-progress` → `done` (9-1/9-2 + rétrospective `done`, epic-10 ouvert). [docs/implementation-artifacts/sprint-status.yaml]
- ℹ️ Finding [Defer] **image `src` sans slash initial** (déjà trié `[x]` en revue) : confirmé **pré-existant** (déjà vrai avec l'ancienne constante `SITE_URL`), **non déclenchable** (`content/blog/` vide), et la normalisation/factorisation d'URL relève explicitement de **story 10.5** (frontière 10.1↔10.5 posée par les Dev Notes — la toucher ici déborderait le périmètre). **Non introduit par 10.1 → pas une dette de cette story** ; laissé différé conformément au triage de revue (tracé `deferred-work.md` #6).

### File List

- `nuxt.config.ts` (M) — ajout `runtimeConfig.public.siteUrl` (défaut staging `https://dev.jouan.ovh`).
- `app/composables/useSiteUrl.ts` (A) — nouveau composable, point d'accès unique à l'URL de prod (lit `runtimeConfig.public.siteUrl`).
- `app/utils/seo.ts` (M) — retrait de la constante `SITE_URL` ; conserve `jsonLdScript()`.
- `app/pages/about.vue` (M) — `pageUrl`/`pageImage` via `useSiteUrl()`.
- `app/pages/blog/index.vue` (M) — `pageUrl` + `url`/`image` JSON-LD via `useSiteUrl()`.
- `app/pages/blog/[...slug].vue` (M) — `url`/`image` via `useSiteUrl()` (capturé hors du getter `useHead`).
- `.env.example` (M) — ajout `NUXT_PUBLIC_SITE_URL` (commenté).
- `docs/implementation-artifacts/deferred-work.md` (M) — items #6/#7/#9 mis à jour (décision + plomberie 10.1, reste 10.7).
- `docs/implementation-artifacts/sprint-status.yaml` (M) — statut 10.1 → in-progress → review.
- `docs/planning-artifacts/epics.md` (M) — ajout Epic 10 au planning global.
- `docs/implementation-artifacts/epic-9-retro-2026-06-29.md` (A) — rétro Epic 9, source de la consolidation Epic 10.
- `docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md` (A) — story suivante prête pour dev.
- `docs/implementation-artifacts/10-3-liens-externes-accessibles.md` (A) — story suivante prête pour dev.
- `docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md` (A) — story suivante prête pour dev.
- `docs/implementation-artifacts/10-5-seo-centralise-site-wide.md` (A) — story suivante prête pour dev.
- `docs/implementation-artifacts/10-6-conformite-legale-rgpd-mentions.md` (A) — story suivante prête pour dev.
- `docs/implementation-artifacts/10-7-mise-en-production-reelle.md` (A) — story suivante prête pour dev.

### Review Findings

_Revue de code adversariale (`bmad-code-review`, 2026-07-02) — 3 couches parallèles Opus 4.8 (Blind Hunter / Edge Case Hunter / Acceptance Auditor), aucune couche en échec. **Les 3 AC sont tenus** et **les frontières 10.5/10.7 respectées** (aucun sur-périmètre). Findings triés :_

- [x] [Review][Patch] Durcir `useSiteUrl()` (résolution D1 — décision Simon 2026-07-02, garde-fou fail-fast) — **(a)** `throw` si `siteUrl` est vide ou non-absolue (`!/^https?:\/\//`) : fait **échouer `generate`** au prerender au lieu d'émettre `canonical`/`og:url`/JSON-LD **relatifs** silencieusement cassés (cas « ligne `NUXT_PUBLIC_SITE_URL=` vide décommentée » → `siteUrl=""`) ; **(b)** rogne le slash final (`.replace(/\/+$/, "")`) pour éviter les `//` de concaténation (`${siteUrl}/about`) si l'override prod est saisi avec un `/` final. [app/composables/useSiteUrl.ts:8] — _le sous-cas « build prod **sans** env → domaine staging valide mais non voulu » n'est pas attrapable par un test d'URL absolue et reste tracé pour 10.7 (`deferred-work` #7/#9). [source: blind+edge]_
- [x] [Review][Patch] `sprint-status.yaml` : `epic-9` reste `in-progress` alors que 9-1/9-2/rétro sont `done` et epic-10 ouvert → devrait passer `done` [docs/implementation-artifacts/sprint-status.yaml:104] [source: auditor]
- [x] [Review][Defer] `article.image.src` sans slash initial → URL d'image malformée (`https://dev.jouan.ovhimages/x.webp`) [app/pages/blog/index.vue:122, app/pages/blog/[...slug].vue:121] — deferred, pre-existing (déjà vrai avec l'ancienne `SITE_URL` ; non déclenchable : `content/blog/` vide ; à traiter à la factorisation URL de 10.5)

_Re-review `bmad-code-review` (2026-09-12) — 3 couches parallèles (Blind Hunter / Edge Case Hunter / Acceptance Auditor), aucune couche en échec. Findings triés :_

- [x] [Review][Patch] Durcir `useSiteUrl()` avec un parsing URL origin-only — Résolu : `new URL(siteUrl)`, protocole http(s), hostname requis, origin-only (`pathname === "/"`, pas de query/hash), retour `url.origin`. [app/composables/useSiteUrl.ts:13]
- [x] [Review][Patch] Corriger la preuve de vérification navigateur/article — Résolu : Chrome DevTools MCP a vérifié `/about` et `/blog` (canonical/og depuis le DOM) ; la story précise que la vue article n'est pas vérifiable au navigateur sans article réel et reste couverte par typecheck/prerender. [docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:45]
- [x] [Review][Patch] Nettoyer les domaines littéraux dans les commentaires applicatifs — Résolu : commentaires `app/` nettoyés et AC reformulé sur l'absence d'URL canonique complète hardcodée, pour éviter de confondre URL de base et nom de marque/UI. [app/composables/useSiteUrl.ts:2]
- [x] [Review][Patch] Mettre la File List en cohérence avec le diff réel — Résolu : File List complétée avec les stories 10.2→10.7, `epics.md` et la rétro Epic 9. [docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:177]
- [x] [Review][Defer] `article.image.src` sans slash initial → URL d'image malformée [app/pages/blog/index.vue:122, app/pages/blog/[...slug].vue:121] — deferred, pre-existing ; déjà confirmé non introduit par 10.1, non déclenchable avec `content/blog/` vide, et routé vers la normalisation/factorisation SEO de 10.5.

## Change Log

- 2026-07-01 — Implémentation story 10.1. AC#1 décision hébergement consignée/propagée (Option A, prod `jouan.ovh` sur ce repo, staging séparé). AC#2 `SITE_URL` déplacé vers `runtimeConfig.public.siteUrl` + composable `useSiteUrl()` (staging par défaut inchangé, surchargeable `NUXT_PUBLIC_SITE_URL`). AC#3 dry-run de la chaîne `cd.yml` prouvé en local (lint/typecheck/generate verts, 11 routes, `.output/public` valide, `CNAME` intact). Aucune bascule live, aucun merge/déploiement (réservés à 10.7).
- 2026-07-02 — Findings de revue de code (`bmad-code-review`) soldés — 2 items [Patch] résolus : garde-fou fail-fast + strip du slash final de `useSiteUrl()` (prouvé au prerender) ; `epic-9` → `done` dans `sprint-status.yaml`. 1 item [Defer] (image `src` sans slash) confirmé pré-existant / hors périmètre 10.1 → routé 10.5. Gate lint/typecheck/generate re-vérifié vert (11 routes) ; rendu staging inchangé (canonical/og identiques).
- 2026-09-12 — Re-review `bmad-code-review` soldée — 4 items [Patch] résolus : `useSiteUrl()` durci par parsing `URL` origin-only, preuve navigateur Chrome DevTools MCP ajoutée pour `/about` et `/blog`, contrainte grep clarifiée/nettoyée, File List alignée avec le diff réel. 1 item [Defer] reconfirmé (image `src` sans slash) → reste routé 10.5.

### Re-review Verification — 2026-09-12

- `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` → ✅ lint/typecheck/generate verts, 11 routes prerendered.
- Chrome DevTools MCP `/about` → ✅ `canonical=https://dev.jouan.ovh/about`, `og:url=https://dev.jouan.ovh/about`, images SEO staging.
- Chrome DevTools MCP `/blog` → ✅ `canonical=https://dev.jouan.ovh/blog`, `og:url=https://dev.jouan.ovh/blog`, JSON-LD Blog `url=https://dev.jouan.ovh/blog`, `blogPost=[]`.
- `rg "https://dev\.jouan\.ovh|https://jouan\.ovh" app` → ✅ aucune URL complète hardcodée dans `app/`.
- `git diff --check` → ✅ aucun whitespace error.
- `NUXT_PUBLIC_SITE_URL=https://jouan.ovh/site pnpm generate` via Docker → ✅ échec attendu au prerender (`/about`, `/blog`) : le garde-fou origin-only rejette les bases avec chemin.
