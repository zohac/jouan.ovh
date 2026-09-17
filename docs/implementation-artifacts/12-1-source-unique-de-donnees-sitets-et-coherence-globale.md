---
baseline_commit: 5d8ea765a7adaf422137894801bf096860876837
---

# Story 12.1: Source unique de données `site.ts`, assainissement sémantique & cohérence globale

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur du site,
I want consulter un profil et des métadonnées alignés sur les systèmes IA et l'automatisation métier,
so that j'identifie la spécialisation de Simon et ne trouve plus de références obsolètes (FR28, NFR13, NFR14).

## Acceptance Criteria

1. **Given** le fichier source unique `app/data/site.ts`
   **When** on met à jour les données du profil `SITE.profile`
   **Then** `profile.role` est exactement `Développeur Full Stack spécialisé en systèmes IA & automatisation métier`
   **And** `profile.city` devient `France · Remote` (suppression définitive de `Rouen, France`)
   **And** `profile.bio` ou description résume la promesse d'automatisation des workflows et d'industrialisation IA
   **And** le champ `maltUrl` est conservé (`https://www.malt.fr/profile/simonjouan`).

2. **Given** la liste ordonnée des compétences clés `SITE.skills`
   **When** on audite la stack technique moderne
   **Then** la liste met en valeur la stack ciblée IA & systèmes : `["typescript", "node.js", "nest.js", "nuxt", "vue", "postgresql", "mcp", "docker", "whisper.cpp", "sherpa-onnx", "llama.cpp", "bullmq", "rest-api", "vitest"]`.

3. **Given** la collection des projets vitrines `SITE.projects`
   **When** on charge les projets phares
   **Then** la liste principale expose exactement les 3 projets de l'Offre V1 :
     - **Keova Signal** : `role: "Concepteur & Développeur Full Stack"`, `status: "● Système interne / Dépôt privé"`, tags `["Node.js 22", "TypeScript", "MCP Server", "PostgreSQL", "Cheerio", "Docker"]`, sans champ `url` externe direct
     - **Debrief** : `role: "Concepteur & Développeur Full Stack"`, `status: "◐ R&D / Dépôt privé"`, tags `["Tauri", "Rust", "whisper.cpp", "sherpa-onnx", "llama.cpp", "Gemma 4"]`, sans champ `url` externe direct
     - **Devis-Assist** : `role: "Architecte & Développeur Full Stack"`, `status: "○ Architecture validée / Dépôt privé"`, tags `["NestJS", "Nuxt UI 4", "PostgreSQL pg_trgm", "Mistral OCR", "BullMQ"]`, sans champ `url` externe direct
   **And** les anciens projets (`Keova App`, `TryOn`, `Nodium`) sont conservés dans `SITE.legacyProjects` (ou export typé équivalent) pour préserver l'historique et le parcours
   **And** la mention obsolète `ERP équestre` est définitivement bannie et remplacée par `Application SaaS de gestion opérationnelle`
   **And** le terme proscrit `Ingénieur IA` est définitivement banni et remplacé par `Créateur · R&D agents IA`.

4. **Given** les composants consommateurs existants (`app/components/FooterComponent.vue`, `app/components/terminal/programs/Projets.ts`, `app/components/CurrentTime.vue`, `app/components/home/HomeHeroTerminal.vue`, `app/pages/about.vue`, `app/pages/index.vue`)
   **When** les composants lisent `SITE.profile` et `SITE.projects`
   **Then** aucun plantage TypeScript ni erreur d'hydratation ne survient
   **And** `FooterComponent.vue` affiche la nouvelle tagline `Développeur Full Stack spécialisé en systèmes IA & automatisation métier. France · Remote.` et liste les 3 projets avec la classe `.ftr__link--static` sans lien 404
   **And** le terminal (`Projets.ts`) formate correctement les noms, statuts et descriptions sans générer de lien mort
   **And** `CurrentTime.vue` conserve un `aria-label` valide `Heure locale (France · Remote) : ...`.

5. **Given** l'ensemble des modifications de la story
   **When** on exécute la gate de validation Docker
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur et 13 routes statiques pré-rendues.

## Tasks / Subtasks

- [x] Tâche 1 — Mise à jour des interfaces et données dans `app/data/site.ts` (AC: 1, 2, 3)
  - [x] Mettre à jour `profile.role` avec `Développeur Full Stack spécialisé en systèmes IA & automatisation métier`.
  - [x] Mettre à jour `profile.city` avec `France · Remote`.
  - [x] Réordonner `skills` pour intégrer MCP, whisper.cpp, sherpa-onnx, llama.cpp, BullMQ, Docker.
  - [x] Configurer les 3 projets phares dans `projects` : Keova Signal, Debrief, Devis-Assist.
  - [x] Déclarer `legacyProjects` pour conserver Keova App (corrigé sans « ERP équestre »), TryOn et Nodium (corrigé sans « Ingénieur IA »).
  - [x] Exporter `legacyProjects` dans l'objet `SITE`.

- [x] Tâche 2 — Contrôle et adaptation des consommateurs directs (AC: 4)
  - [x] Vérifier `app/components/FooterComponent.vue` (rendu des projets sans URL sous forme statique accessible).
  - [x] Vérifier `app/components/terminal/programs/Projets.ts` (affichage propre des statuts et descriptions).
  - [x] Vérifier `app/components/CurrentTime.vue` (aria-label avec `France · Remote`).
  - [x] Vérifier `app/components/home/HomeHeroTerminal.vue` (formatage de `projectsOutput` : `keova-signal/ debrief/ devis-assist/`).
  - [x] Vérifier `app/pages/about.vue` pour assurer la résolution correcte de `keovaProject` via `SITE.projects` ou `SITE.legacyProjects`.

- [x] Tâche 3 — Vérification sémantique globale anti-régression (AC: 1, 3)
  - [x] Lancer une recherche grep pour s'assurer de l'absence totale de « Ingénieur IA » et « ERP équestre » dans tout le dossier `app/`.
  - [x] Vérifier qu'aucun lien mort vers un dépôt GitHub privé n'est généré.

- [x] Tâche 4 — Validation qualité Docker (AC: 5)
  - [x] Lancer `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [x] Valider le passage à 100 % des tests ESLint, Stylelint, typecheck TypeScript et du build Nitro SSG.

### Review Findings

- [x] [Review][Patch] Reformuler la phrase d'accroche de l'introduction dans `about.vue` [app/pages/about.vue:28]
- [x] [Review][Patch] Sécuriser le fallback de sélection du projet Keova dans `about.vue` [app/pages/about.vue:106-107]
- [x] [Review][Patch] Sourcer le téléphone depuis `SITE.profile.phone` dans `About.ts` [app/components/terminal/programs/About.ts:69]
- [x] [Review][Patch] Mettre à jour le commentaire sur l'affichage des URLs de projets dans `FooterComponent.vue` [app/components/FooterComponent.vue:63]
- [x] [Review][Patch] Ajouter `docs/planning-artifacts/epics.md` dans la `File List` du ticket 12.1 [docs/implementation-artifacts/12-1-source-unique-de-donnees-sitets-et-coherence-globale.md:122]
- [x] [Review][Defer] Alignement de la description SEO de `/about` sur le repositionnement IA [app/pages/about.vue:142] — deferred, prévu dans Story 12.6
- [x] [Review][Defer] Révision du Schema.org `addressLocality: "France · Remote"` sur `/about` [app/pages/about.vue:159] — deferred, prévu dans Story 12.6

## Dev Notes

### Architecture & Contraintes d'environnement
- **Environnement Docker STRICT :** Ne jamais exécuter `pnpm` sur l'hôte macOS. Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker : `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. [Source: AGENTS.md#Section 2]
- **DRY & Source unique :** `app/data/site.ts` est la seule et unique source de vérité pour le profil et les projets. Aucun nom, rôle, bio ou projet ne doit être codé en dur dans les pages ou les programmes du terminal. [Source: AGENTS.md#Section 5.2]
- **Préservation des anciens projets :** Les anciens projets (Keova App, TryOn, Nodium) ne doivent pas être détruits. Ils sont simplement déplacés dans une propriété `legacyProjects` afin que `about.vue` ou les futures pages de parcours continuent de fonctionner sans rupture. [Source: docs/specs/spec-repositionnement-ia/projects-showcase.md#Section 2]

### Fichiers concernés
- [MODIFY] [app/data/site.ts](file:///Users/simon/dev/jouan.ovh/app/data/site.ts)
- [MODIFY] [app/pages/about.vue](file:///Users/simon/dev/jouan.ovh/app/pages/about.vue)
- [MODIFY] [app/components/home/HomeStackMarquee.vue](file:///Users/simon/dev/jouan.ovh/app/components/home/HomeStackMarquee.vue)
- [MODIFY] [app/components/terminal/programs/About.ts](file:///Users/simon/dev/jouan.ovh/app/components/terminal/programs/About.ts)

### Références
- Cahier des charges et critères d'acceptation : [docs/planning-artifacts/epics.md#Story-12.1](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)
- Vitrine projets & spécifications techniques réelles : [docs/specs/spec-repositionnement-ia/projects-showcase.md](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/projects-showcase.md)
- Matrice éditoriale : [docs/specs/spec-repositionnement-ia/messaging-matrix.md](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/messaging-matrix.md)

## Dev Agent Record

### Agent Model Used

Gemini 3.7 Flash

### Debug Log References

- Validation Docker exécutée avec succès via `docker compose run --rm web sh -c "export COREPACK_ENABLE_DOWNLOAD_PROMPT=0 && corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
- 0 erreur ESLint / Stylelint.
- 0 erreur vue-tsc typecheck.
- 20 routes et assets statiques pré-rendus par Nitro SSG.

### Completion Notes List

- `app/data/site.ts` mis à jour avec le nouveau profil (« Développeur Full Stack spécialisé en systèmes IA & automatisation métier », localisation « France · Remote »), les compétences ordonnées ciblées IA & systèmes, les 3 projets phares de l'Offre V1 (Keova Signal, Debrief, Devis-Assist) sans lien sortant privé, et `legacyProjects` assaini sans mention « ERP équestre » ni « Ingénieur IA ».
- `app/pages/about.vue` adapté pour résoudre le projet Keova depuis `SITE.legacyProjects` ou `SITE.projects` de manière résiliente.
- `app/components/home/HomeStackMarquee.vue` enrichi avec les libellés de la nouvelle stack technique (MCP, whisper.cpp, sherpa-onnx, llama.cpp, BullMQ).
- `app/components/terminal/programs/About.ts` aligné sur `SITE.profile.role`.
- Recherche grep exhaustive confirmant l'absence de mentions obsolètes et de liens rompus.

### File List

- `app/data/site.ts` (modifié)
- `app/pages/about.vue` (modifié)
- `app/components/home/HomeStackMarquee.vue` (modifié)
- `app/components/terminal/programs/About.ts` (modifié)
- `app/components/FooterComponent.vue` (modifié)
- `docs/planning-artifacts/epics.md` (modifié)
- `docs/implementation-artifacts/sprint-status.yaml` (modifié)
- `docs/implementation-artifacts/12-1-source-unique-de-donnees-sitets-et-coherence-globale.md` (modifié)
- `docs/implementation-artifacts/deferred-work.md` (modifié)

## Change Log

- 2026-09-16 : Implémentation complète de la Story 12.1 — Refonte de la source unique de données `site.ts`, intégration des 3 projets phares de l'Offre V1, déclaration de `legacyProjects`, assainissement sémantique et validation Docker 100% verte.

