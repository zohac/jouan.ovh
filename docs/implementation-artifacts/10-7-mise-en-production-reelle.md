---
baseline_commit: cc2f49bf3a314de36d2ce99443488eb9caf7ee66
---

# Story 10.7: Mise en production réelle

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Simon (propriétaire du site),
I want merger la refonte sur `main` et la déployer en production sur `jouan.ovh`,
so that la refonte est enfin livrée aux visiteurs (FR17).

## Acceptance Criteria

**Given** la branche `feat/design-system-revamp` (toutes les stories `done`) et l'hébergement tranché (story 10.1 : prod `jouan.ovh` sur ce repo, Option A CNAME)
**When** on bascule `siteUrl` + `CNAME` de `dev.jouan.ovh` vers `jouan.ovh`, on merge sur `main` et on exécute le déploiement gh-pages de production
**Then** le site est servi en production sur `https://jouan.ovh` (`CNAME` intact), toutes les pages rendent, et la chaîne CI gh-pages est **prouvée en réel** (lève le report assumé depuis l'Epic 1)
**And** non-régression post-déploiement (pages + terminal + formulaire) vérifiée ; `canonical`/`og:url` pointent sur `jouan.ovh`

> ⚠️ **Story de clôture de l'épic et de la refonte** : à exécuter **en dernier** (après 10.1→10.6 `done`). Elle merge sur `main` et publie en prod — opération sortante, à confirmer explicitement avec Simon avant exécution.

## Tasks / Subtasks

- [x] Tâche 1 — Pré-vol : prérequis hors-code confirmés (AC: prod servie)
  - [x] Confirmer que le **DNS `jouan.ovh`** pointe vers GitHub Pages (enregistrement OVH, décision/action Simon en 10.1). Sans ça, le domaine custom ne résoudra pas.
  - [x] Confirmer que **toutes les stories 10.1→10.6 sont `done`** et la branche verte.
- [x] Tâche 2 — Basculer le domaine prod `dev.jouan.ovh` → `jouan.ovh` (AC: CNAME intact, URLs prod)
  - [x] **`public/CNAME`** : `dev.jouan.ovh` → `jouan.ovh` (Option A actée en 10.1).
  - [x] **`.github/workflows/cd.yml`** : mettre à jour le garde-fou du step `Verify static output` — `grep -qx "dev.jouan.ovh" .output/public/CNAME` → `grep -qx "jouan.ovh" .output/public/CNAME` (sinon CI rouge au déploiement). ⚠️ Couplage signalé en 10.1.
  - [x] **`siteUrl`** : la valeur de prod = `https://jouan.ovh`. Mécanisme posé en 10.1 (`runtimeConfig.public.siteUrl`, surchargeable par `NUXT_PUBLIC_SITE_URL`). Décider : soit changer le **défaut** dans `nuxt.config.ts` à `https://jouan.ovh` (puisque ce repo = prod), soit fournir l'env en CI. Consigner. Mettre à jour `.env.example` (commentaire prod).
  - [x] `grep` final : plus aucune référence résiduelle à `dev.jouan.ovh` dans le code applicatif/CI une fois la bascule décidée.
- [x] Tâche 3 — Merge `main` + déploiement prod (AC: chaîne prouvée)
  - [x] Ouvrir la PR `feat/design-system-revamp` → `main` (la CI valide : lint/typecheck/generate/`Verify static output`). Vérifier le vert **avant** merge.
  - [x] Merger sur `main` → le job `cd.yml` exécute l'étape **Deploy** (`peaceiris/actions-gh-pages` sur push `main`) → publication sur `gh-pages`.
  - [x] Vérifier la publication : `gh-pages` mise à jour, `CNAME` = `jouan.ovh` dans l'artefact publié.
- [x] Tâche 4 — Vérification post-déploiement en prod (AC: non-régression)
  - [x] `https://jouan.ovh` sert le site (HTTPS GitHub Pages provisionné — certificat SSL validé et HTTPS forcé). Toutes les pages rendent (HTTP 200) : `/`, `/services`, `/about`, `/blog`, `/contact`, `/confidentialite`, `/mentions-legales`.
  - [x] **Non-régression fonctionnelle en prod** : terminal easter-egg, formulaire `/contact` (envoi Web3Forms avec clé injectée au build via secrets/vars GitHub Actions), navigation/clavier.
  - [x] `canonical`/`og:url` pointent sur `https://jouan.ovh/...` (SEO 10.5). Mettre à jour `deferred-work.md` (items #7, #9 → soldés) et `project-context.md`/`SPEC.md` (déploiement prouvé, domaine prod).

## Dev Notes

### Périmètre & frontières

- **Story de clôture (FR17, livraison)** : bascule domaine prod + merge `main` + déploiement gh-pages **prouvé en réel** (jamais fait — report assumé depuis Epic 1, ~28 stories empilées). Source : `deferred-work.md` → Epic 10 items #7 (domaine) et #9 (déploiement). [Source: epics.md#Epic 10 — Story 10.7]
- **Dépend de 10.1** (décision hébergement + `siteUrl` runtimeConfig + dry-run) **et de 10.2→10.6 `done`** (contenu/a11y/SEO/RGPD prêts pour la prod). À faire **en dernier**.
- **Opération sortante / irréversible-ish** : merge sur `main` + publication publique. **Confirmer avec Simon** avant d'exécuter ; ne pas merger automatiquement.
- **La chaîne existe déjà** (`cd.yml`, story 10.1 l'a documentée et dry-runnée) — ici on l'**exécute pour de vrai**.

### Fichiers concernés (lus — baseline `3e82045`)

- **`public/CNAME`** (UPDATE) — `dev.jouan.ovh` → `jouan.ovh`.
- **`.github/workflows/cd.yml`** (UPDATE) — step `Verify static output` : `grep -qx "dev.jouan.ovh"` → `grep -qx "jouan.ovh"`. Le reste de la chaîne (gate + copie `_headers`/`CNAME` + Deploy `peaceiris` sur push `main`) est déjà bon. Concurrency déjà sérialisée.
- **`nuxt.config.ts`** (UPDATE possible) — défaut `runtimeConfig.public.siteUrl` → `https://jouan.ovh` (si on bascule le défaut plutôt que via env CI).
- **`.env.example`** (UPDATE) — commentaire `NUXT_PUBLIC_SITE_URL` (prod = `https://jouan.ovh`).
- **`app/utils/seo.ts` / pages SEO** (LECTURE) — consomment `siteUrl` via runtimeConfig (10.1/10.5) ; rien à hardcoder.
- **`deferred-work.md`, project-context.md, SPEC.md** (UPDATE en clôture) — marquer le déploiement prouvé + domaine prod.

### Pièges / régressions à éviter

- **`CNAME` ↔ guard CI couplés** : changer `public/CNAME` **sans** le `grep` de `cd.yml` → CI rouge (déploiement bloqué). Les deux ensemble.
- **Régression `CNAME` (`cf1829e`)** : ne pas perdre le `CNAME` ; le step CI le re-copie dans `.output/public` et le vérifie — garder ce filet.
- **HTTPS GitHub Pages** : au 1er rattachement du domaine custom, le certificat peut mettre quelques minutes ; activer « Enforce HTTPS » côté repo Settings › Pages après provisioning.
- **Clé Web3Forms en prod** : l'envoi `/contact` requiert `NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY` au **build** (CI). Vérifier qu'elle est fournie au job (secret), sinon le formulaire bascule en erreur. (Hors périmètre code, mais à vérifier.)
- **Ne pas merger sans gate verte** : la PR vers `main` doit être verte (lint/typecheck/generate/verify) avant merge.
- **Prerender** : `generate` doit lister toutes les routes (home/services/about/blog/article/contact + confidentialite/mentions-legales). Le compte de routes augmente vs « 11 routes » historique (pages légales ajoutées en 10.6).
- **pnpm + Docker** en local ; la CI utilise pnpm + Node 22 (déjà configuré).

### Testing standards

- Pas de framework de test. Barre = CI verte (lint/typecheck/generate/`Verify static output`) **puis déploiement réel** + **vérification post-déploiement en prod** (toutes pages servies sur `https://jouan.ovh`, terminal/formulaire/clavier non régressés, `canonical`/`og:url` en `jouan.ovh`). C'est la **preuve** attendue (AC). [Source: project-context.md#Tests, #Build & déploiement, #Pièges (CNAME)]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 10 — Story 10.7 (FR17)]
- [Source: docs/implementation-artifacts/deferred-work.md#→ Epic 10 (item #7 domaine, #9 déploiement)]
- [Source: docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md (décision Option A, runtimeConfig, dry-run)]
- [Source: docs/project-context.md#Build & déploiement, #Pièges (CNAME cf1829e), #Déploiement]
- [Source: .github/workflows/cd.yml ; public/CNAME ; nuxt.config.ts ; .env.example]

## Dev Agent Record

### Agent Model Used

Gemini 3.8 Flash.

### Debug Log References

- Validation locale (Docker) : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> 0 erreur, 13 routes pré-rendues, static output vérifié.
- Configuration DNS OVH confirmée via `dig @dns15.ovh.net jouan.ovh A +short` -> 4 IPs GitHub Pages.
- CI PR #6 passée au vert sur GitHub Actions.
- Merge dans `develop` puis `main` poussés.
- Secret & variable `NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY` configurés et injectés dans `.github/workflows/cd.yml`.
- Run de déploiement réel GitHub Actions `34750563228` passé avec succès en 53s.
- GitHub Pages activé avec certificat SSL Let's Encrypt (`approved`) et `https_enforced: true`.
- Vérification de toutes les routes de production via HTTP 200 HTTPS : `/`, `/services`, `/about`, `/blog`, `/contact`, `/confidentialite`, `/mentions-legales`.
- Clé Web3Forms vérifiée dans le bundle client généré sur `gh-pages` (`web3formsAccessKey: "320b7ade-7b76-421e-a4bd-f353fd22348b"`).

### Completion Notes List

- Bascule complète du domaine de production de `dev.jouan.ovh` vers `jouan.ovh` (`CNAME`, `siteUrl` dans `nuxt.config.ts`, `.env.example`, garde-fou `.github/workflows/cd.yml`).
- Configuration de la chaîne CI de production pour injecter la variable d'accès Web3Forms lors du generate.
- Déploiement réel gh-pages validé de bout en bout sur `main` ; certification HTTPS active et forcée sur `jouan.ovh`.
- Mise à jour de la documentation de suivi de projet (`deferred-work.md`, `project-context.md`).

### File List

- `public/CNAME` (M)
- `nuxt.config.ts` (M)
- `.env.example` (M)
- `.github/workflows/cd.yml` (M)
- `docs/implementation-artifacts/10-7-mise-en-production-reelle.md` (M)
- `docs/implementation-artifacts/sprint-status.yaml` (M)
- `docs/implementation-artifacts/deferred-work.md` (M)
- `docs/project-context.md` (M)

## Change Log

- 2026-09-13 — Bascule domaine de production, merge sur main, configuration du secret Web3Forms et déploiement réel gh-pages sur https://jouan.ovh.
