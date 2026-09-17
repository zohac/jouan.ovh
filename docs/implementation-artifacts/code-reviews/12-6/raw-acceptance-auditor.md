Reading prompt from stdin...
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: medium
reasoning summaries: none
session id: 01a0ac3f-5a0c-7993-a2ba-73674761e815
--------
user
# Acceptance Auditor Prompt — Story 12.6

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md`
- Context specs: `docs/specs/spec-repositionnement-ia/SPEC.md`, `docs/specs/spec-repositionnement-ia/messaging-matrix.md`, `docs/jouan-ovh-offre-v1-brief-codex.md`, `docs/planning-artifacts/epics.md` (Epic 12 / Story 12.6), `docs/project-context.md`, `AGENTS.md`
- Diff file: `docs/implementation-artifacts/code-reviews/12-6/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
Je vais auditer ça en mode revue d’acceptation stricte : je charge d’abord les consignes de review pertinentes, puis je croise la story, les specs de contexte et le diff sans m’arrêter aux checkpoints.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/bmad-code-review/SKILL.md" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "sed -n '1,240p' docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
name: bmad-code-review
description: 'Adversarial code review using parallel review layers and structured triage. Use when the user says "run code review" or "review this code"'
---

# Code Review Workflow

**Goal:** Review code changes adversarially. No noise, no filler.

Subagents, when the capability is available, are an important part of this workflow. Use them as directed by the workflow steps.
If you need an explicit user instruction to run them, ask once now for the whole workflow run.

## Conventions

- Bare paths (e.g. `checklist.md`) resolve from the skill root.
- `{skill-root}` resolves to this skill's installed directory (where `customize.toml` lives).
- `{project-root}`-prefixed paths resolve from the project working directory.
- `{skill-name}` resolves to the skill directory's basename.

## On Activation

### Step 1: Resolve the Workflow Block

Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`

**If the script fails**, resolve the `workflow` block yourself by reading these three files in base → team → user order and applying the same structural merge rules as the resolver:

1. `{skill-root}/customize.toml` — defaults
2. `{project-root}/_bmad/custom/{skill-name}.toml` — team overrides
3. `{project-root}/_bmad/custom/{skill-name}.user.toml` — personal overrides

Any missing file is skipped. Scalars override, tables deep-merge, arrays of tables keyed by `code` or `id` replace matching entries and append new entries, and all other arrays append.

### Step 2: Execute Prepend Steps

Execute each entry in `{workflow.activation_steps_prepend}` in order before proceeding.

### Step 3: Load Persistent Facts

Treat every entry in `{workflow.persistent_facts}` as foundational context you carry for the rest of the workflow run. Entries prefixed `file:` are paths or globs under `{project-root}` — load the referenced contents as facts. All other entries are facts verbatim.

### Step 4: Load Config

Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `project_name`, `planning_artifacts`, `implementation_artifacts`, `user_name`
- `communication_language`, `document_output_language`, `user_skill_level`
- `date` as system-generated current datetime
- `sprint_status` = `{implementation_artifacts}/sprint-status.yaml`
- `project_context` = `**/project-context.md` (load if exists)
- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

### Step 5: Greet the User

Greet `{user_name}`, speaking in `{communication_language}`.

### Step 6: Execute Append Steps

Execute each entry in `{workflow.activation_steps_append}` in order.

Activation is complete. If `activation_steps_prepend` or `activation_steps_append` were non-empty, confirm every entry was executed in order before proceeding. Do not begin the main workflow until all activation steps have been completed.

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** for disciplined execution:

- **Micro-file Design**: Each step is self-contained and followed exactly
- **Just-In-Time Loading**: Only load the current step file
- **Sequential Enforcement**: Complete steps in order, no skipping
- **State Tracking**: Persist progress via in-memory variables
- **Append-Only Building**: Build artifacts incrementally

### Step Processing Rules

1. **READ COMPLETELY**: Read the entire step file before acting
2. **FOLLOW SEQUENCE**: Execute sections in order
3. **WAIT FOR INPUT**: Halt at checkpoints and wait for human
4. **LOAD NEXT**: When directed, read fully and follow the next step file

### Critical Rules (NO EXCEPTIONS)

- **NEVER** load multiple step files simultaneously
- **ALWAYS** read entire step file before execution
- **NEVER** skip steps or optimize the sequence
- **ALWAYS** follow the exact instructions in the step file
- **ALWAYS** halt at checkpoints and wait for human input

## FIRST STEP

Read fully and follow: `./steps/step-01-gather-context.md`

 succeeded in 0ms:
---
baseline_commit: c1b8a200419751d2817144be71e60d508b413626
---

# Story 12.6: Page À propos, CTA d'inspection de workflow, formulaire & SEO site-wide

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a prospect souhaitant vérifier la crédibilité du profil et initier une demande ciblée,
I want comprendre le lien entre le parcours qualité/métrologie de Simon et la robustesse de ses systèmes IA, et pouvoir qualifier mon workflow dans le formulaire,
so that j'envoie une demande précise et pertinente (FR33, FR34, FR35, FR36, NFR15, NFR16, UX-DR31, CAP-6, CAP-7, CAP-8, CAP-9).

## Acceptance Criteria

1. **Given** la page À propos dans `app/pages/about.vue`
   **When** le visiteur consulte la section Hero et la biographie
   **Then** le titre du profil affiche `SITE.profile.role` (`Développeur Full Stack spécialisé en systèmes IA & automatisation métier`)
   **And** la localisation affiche `SITE.profile.city` (`France · Remote`)
   **And** le texte de bio expose le parcours réel reliant les 12 ans de métrologie industrielle et l'expérience QA aux réflexes de robustesse logicielle et d'observabilité en production
   **And** la page intègre le bloc philosophie officiel :
     - « Je ne pars pas de "où mettre de l'IA ?", je pars de : »
     - qu’est-ce qui prend du temps ?
     - qu’est-ce qui se répète ?
     - où l’information se perd-elle ?
     - où une personne doit-elle recopier, rechercher ou interpréter ?
     - qu’est-ce qui doit absolument rester sous contrôle humain ?
     - « Ensuite seulement vient la solution technique. »
   **And** la section expériences valorise la QA (Linkizz, 02/2021 — aujourd'hui) et la métrologie (A+ Métrologie / Trescal) comme un atout direct pour la fiabilité des systèmes IA.

2. **Given** le bloc CTA final de conversion sur les pages clés (`app/pages/index.vue` et le CTA de fin d'article dans `app/pages/blog/[...slug].vue`)
   **When** le visiteur arrive en bas de page
   **Then** le bloc CTA affiche :
     - L'eyebrow terminal : `<span aria-hidden="true">$ </span>./workflow --inspect`
     - Le titre H2 : `Quel process vous fait perdre du temps chaque semaine ?`
     - Le corps d'accompagnement : `Décrivez-moi simplement comment il fonctionne aujourd’hui. Je vous dirai ce qui mérite d’être automatisé, ce qui doit rester humain et si l’IA apporte réellement quelque chose.`
     - Le CTA principal `<ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">` : `Identifier un workflow à automatiser` avec icône flèche droite
     - Le CTA secondaire `<ZButton>` vers le contact direct (`mailto:` ou formulaire) : `M’écrire directement`.

3. **Given** la page de contact et son formulaire dans `app/pages/contact/index.vue`
   **When** le visiteur souhaite initier un échange
   **Then** l'en-tête de la page oriente vers la qualification du problème (`Parlons de votre workflow`)
   **And** le formulaire Web3Forms est adapté pour recueillir la qualification du workflow :
     - Champ `Nom` (requis)
     - Champ `Email professionnel` (requis, type `email`)
     - Champ `Entreprise` (optionnel)
     - Champ `Quel processus souhaitez-vous améliorer ?` (champ requis)
     - Champ `Comment fonctionne-t-il aujourd’hui ?` (champ multiligne requis)
     - Champ `Combien de fois ce process se répète-t-il ?` (optionnel, fréquence)
   **And** le bouton de soumission affiche l'intitulé `Décrire mon workflow`
   **And** la charge utile envoyée à l'API Web3Forms transmet l'ensemble de ces champs de qualification de manière explicite et lisible dans l'email reçu
   **And** la notice RGPD est mise à jour pour mentionner les données transmises.

4. **Given** les balises de référencement (SEO), OpenGraph et données structurées Schema.org sur l'ensemble du site
   **When** les 13 routes statiques sont générées en SSG et auditées
   **Then** le composable `usePageSeo` injecte sur chaque page un titre et une meta-description cohérents avec le repositionnement :
     - Homepage (`/`) : titre `Simon Jouan — Systèmes IA, agents & automatisation métier` et description `Développeur Full Stack spécialisé en systèmes IA et automatisation métier. Agents IA, intégrations, applications sur mesure et workflows mis en production.`
     - À propos (`/about`) : titre `À propos — Simon Jouan` et description alignée sur le parcours métrologie, culture QA et ingénierie logicielle
     - Contact (`/contact`) : titre `Contact — Simon Jouan` et description orientée qualification de processus
     - Services (`/services`) : titre `Services & Tarifs — Simon Jouan` (conforme à la story 12.5)
     - Blog (`/blog`) : titre `Blog — Simon Jouan`
     - Mentions légales & Confidentialité : titres unifiés avec suffixe `— Simon Jouan`
   **And** `aboutJsonLd` dans `app/pages/about.vue` utilise `SITE.profile.city` (`France · Remote`) pour `addressLocality` sans résidu de localisation obsolète.

5. **Given** les contraintes de Design System et d'accessibilité (a11y WCAG / RGAA)
   **When** les pages modifiées sont inspectées et testées
   **Then** les styles respectent scrupuleusement les custom properties globales (`var(--token)`) sans couleurs ni marges en dur
   **And** la règle `ZÉRO EMOJI` (NFR6) est respectée sur l'intégralité des textes, templates et styles
   **And** les champs de formulaire disposent de labels explicites, d'attributs `required`, `aria-invalid` et de gestion d'erreur hydration-safe avec focus sur la première erreur.

6. **Given** l'ensemble des modifications de la story 12.6
   **When** on exécute la gate de validation Docker
   **Then** `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint / Stylelint, 0 erreur TypeScript, et les 13 routes statiques (+ assets) pré-rendues avec succès par Nitro.

## Tasks / Subtasks

- [x] Tâche 1 — Refonte de la page À propos (`app/pages/about.vue`) (AC: 1, 4, 5)
  - [x] Mettre à jour la biographie hero en intégrant les paragraphes officiels sur les 12 ans de métrologie, la bascule dans le code et la culture QA.
  - [x] Insérer le bloc philosophie d'intervention sous forme de carte ou bloc stylisé (`ZCard` ou section typographique BEM).
  - [x] Mettre en valeur l'expérience Linkizz dans la timeline des expériences en explicitant l'apport de la QA à la conception d'agents fiables.
  - [x] Vérifier la consommation de `SITE.profile.role` et `SITE.profile.city`.
  - [x] Aligner les métadonnées SEO et le JSON-LD `aboutJsonLd` (`addressLocality: "France · Remote"`).

- [x] Tâche 2 — Mise à jour du CTA final global sur la Homepage et le Blog (AC: 2, 5)
  - [x] Dans `app/pages/index.vue`, remplacer le bloc CTA final actuel par la formulation officielle :
    - Eyebrow : `<span aria-hidden="true">$ </span>./workflow --inspect`
    - H2 : `Quel process vous fait perdre du temps chaque semaine ?`
    - Sous-titre : `Décrivez-moi simplement comment il fonctionne aujourd’hui. Je vous dirai ce qui mérite d’être automatisé, ce qui doit rester humain et si l’IA apporte réellement quelque chose.`
    - CTA 1 : `Identifier un workflow à automatiser` (vers `/contact`) avec icône flèche droite
    - CTA 2 : `M’écrire directement` (vers `mailto:simon@jouan.ovh`)
  - [x] Dans `app/pages/blog/[...slug].vue`, harmoniser le CTA de fin d'article pour orienter vers la qualification de workflow.

- [x] Tâche 3 — Réorientation du formulaire de contact vers la qualification de workflow (`app/pages/contact/index.vue`) (AC: 3, 5)
  - [x] Adapter l'en-tête et l'introduction de la page : `Parlons de votre workflow` et message d'accueil orienté gain de temps/process.
  - [x] Mettre à jour l'interface `ContactForm` :
    - `name: string`
    - `email: string`
    - `company: string`
    - `workflow: string` (Quel processus souhaitez-vous améliorer ?)
    - `currentState: string` (Comment fonctionne-t-il aujourd’hui ?)
    - `frequency?: string` (Combien de fois ce process se répète-t-il ?)
  - [x] Adapter le template du formulaire avec les composants `ZInput` (champs texte et multiligne) et les attributs d'accessibilité.
  - [x] Modifier le bouton de soumission : `Décrire mon workflow`.
  - [x] Adapter la fonction de validation `validate()` et l'envoi vers l'API Web3Forms (`body` avec clés explicites `name`, `email`, `company`, `workflow`, `current_state`, `frequency`, `message`).
  - [x] Mettre à jour le texte RGPD d'information sous le formulaire.

- [x] Tâche 4 — Harmonisation SEO transverse site-wide (`usePageSeo`) (AC: 4)
  - [x] Mettre à jour le titre et la description dans `app/pages/index.vue` : `Simon Jouan — Systèmes IA, agents & automatisation métier`.
  - [x] Mettre à jour le titre et la description dans `app/pages/about.vue`.
  - [x] Mettre à jour le titre et la description dans `app/pages/contact/index.vue` : `Contact — Simon Jouan`.
  - [x] Mettre à jour le titre dans `app/pages/blog/index.vue` : `Blog — Simon Jouan`.
  - [x] Vérifier et unifier les métadonnées dans `app/pages/confidentialite.vue` et `app/pages/mentions-legales.vue`.

- [x] Tâche 5 — Styles SCSS, responsive et accessibilité (AC: 5)
  - [x] Styliser le bloc philosophie sur `/about` en utilisant les tokens du Design System (`--bg-surface`, `--border-subtle`, `--accent`).
  - [x] Vérifier la disposition responsive du formulaire de contact sur mobile et desktop.
  - [x] Contrôler les contrastes, le focus visible (`:focus-visible`) et l'absence totale d'emoji.

- [x] Tâche 6 — Validation qualité Docker (AC: 6)
  - [x] Exécuter la gate de validation complète : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [x] Vérifier 0 erreur ESLint / Stylelint, 0 erreur vue-tsc et la génération SSG Nitro sans avertissement.

## Dev Agent Record

### Implementation Plan
- **Tâche 1 (Page À propos) :** Refonte de la bio (`about.vue`) avec mise en avant du parcours métrologie industrielle (12 ans) et culture QA au service de la robustesse des systèmes IA. Insertion du bloc philosophie d'intervention stylisé avec les tokens DS. Mise à jour de la timeline d'expériences (Linkizz et A+ Métrologie / Trescal) et alignement de `aboutJsonLd.addressLocality`.
- **Tâche 2 (CTA final global) :** Refonte du CTA final sur `index.vue` avec le prompt `./workflow --inspect`, le H2 ciblant le gain de temps hebdomadaire et les boutons d'action. Harmonisation du CTA de fin d'article dans `blog/[...slug].vue`.
- **Tâche 3 (Formulaire de contact) :** Transformation du formulaire sur `contact/index.vue` en formulaire de qualification de workflow métier (Nom, Email pro, Entreprise, Processus à améliorer, Fonctionnement actuel, Fréquence). Validation reactive et payload Web3Forms enrichi.
- **Tâche 4 (SEO site-wide) :** Harmonisation des titres, méta-descriptions et JSON-LD Schema.org sur toutes les pages (`/`, `/about`, `/contact`, `/blog`, `/blog/[...slug]`, `/confidentialite`, `/mentions-legales`, `/contact/card`).
- **Tâche 5 & 6 (Styles, a11y & Validation) :** Validation rigoureuse des tokens DS, de l'accessibilité a11y et exécution de la gate complète Docker (0 erreur ESLint, 0 erreur vue-tsc, build statique SSG Nitro de 24 routes / assets réussi).

### Completion Notes
- Page À propos (`about.vue`) refondue conformément à la charte et au brief : bio officielle, bloc philosophie d'intervention, valorisation de la QA (Linkizz) et de la métrologie dans la timeline.
- CTA final sur `index.vue` et `blog/[...slug].vue` aligné sur `./workflow --inspect` et l'orientation gain de temps opérationnel.
- Formulaire de contact (`contact/index.vue`) adapté pour la qualification de flux avec conservation du honeypot, focus accessible sur erreurs et transmission des champs détaillés à Web3Forms.
- Titres SEO, descriptions et données structurées unifiés sur toutes les routes du site.
- Validation Docker 100% verte : ESLint/Stylelint sans erreur, vérification de types TypeScript vue-tsc validée, pré-rendu statique SSG Nitro réussi.

## File List

- [MODIFY] [app/pages/about.vue](file:///Users/simon/dev/jouan.ovh/app/pages/about.vue)
- [MODIFY] [app/pages/contact/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/contact/index.vue)
- [MODIFY] [app/pages/contact/card.vue](file:///Users/simon/dev/jouan.ovh/app/pages/contact/card.vue)
- [MODIFY] [app/pages/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue)
- [MODIFY] [app/pages/blog/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/blog/index.vue)
- [MODIFY] [app/pages/blog/[...slug].vue](file:///Users/simon/dev/jouan.ovh/app/pages/blog/%5B...slug%5D.vue)
- [MODIFY] [app/pages/confidentialite.vue](file:///Users/simon/dev/jouan.ovh/app/pages/confidentialite.vue)
- [MODIFY] [app/pages/mentions-legales.vue](file:///Users/simon/dev/jouan.ovh/app/pages/mentions-legales.vue)
- [MODIFY] [docs/implementation-artifacts/sprint-status.yaml](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/sprint-status.yaml)
- [MODIFY] [docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md)

## Change Log

- 2026-09-16 : Implémentation complète de la Story 12.6 — Refonte de la page À propos avec bloc philosophie et timeline métrologie/QA, CTA d'inspection de workflow sur la Homepage et le Blog, formulaire de qualification de workflow sur Contact, et harmonisation transverse du SEO et des données structurées Schema.org sur l'ensemble des 13 routes statiques. Gate Docker (lint, typecheck, SSG) verte à 100%.

## Dev Notes

### Architecture & Contraintes d'environnement
- **Environnement Docker STRICT :** Ne jamais exécuter `pnpm` sur l'hôte macOS. Toute commande d'outillage doit s'exécuter dans Docker : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm <cmd>"`. [Source: AGENTS.md#Section 2]
- **Tokens & Design System :** Aucune couleur ou espacement en dur. Utiliser impérativement `var(--token)`. [Source: AGENTS.md#Section 5.3]
- **Primitives de Layout :** Les classes `.section`, `.section--sunken`, `.container`, `.eyebrow`, `.prose` sont des primitives globales (`app/assets/scss/base/_layout.scss`). Ne pas les redéclarer dans le bloc scoped. [Source: AGENTS.md#Section 5.3]
- **Icônes :** Utiliser les glyphes de `<ZIcon name="..." />` (`arrow`, `pin`, `mail`, `terminal`, etc.). [Source: app/components/ui/ZIcon.vue]
- **Zéro Emoji :** Règle stricte NFR6 / NFR13.
- **Formulaire Web3Forms :** Conserve la clé injectée via `useRuntimeConfig().public.web3formsAccessKey`. Web3Forms accepte n'importe quelles propriétés additionnelles dans le corps JSON et les retransmet dans le corps du courriel.

### Ce qui doit être préservé
- Le fonctionnement du honeypot anti-spam (`honeypot` invisible pour les humains) sur le formulaire de contact.
- L'annonce accessible `role="status"` et le focus sur la confirmation d'envoi.
- L'accès à la carte de visite digitale (`/contact/card`) et à l'easter egg terminal (`useTerminal`).
- La timeline chronologique et la structure sémantique `<ol>` sur `/about`.

### Items différés intégrés à cette story (depuis `deferred-work.md`)
- **Description SEO `/about` repositionnée sur les systèmes IA** (`app/pages/about.vue:142`).
- **Format de `addressLocality` Schema.org sur `/about`** (`app/pages/about.vue:159`) aligné sur `SITE.profile.city` (`France · Remote`).

### Références
- Spécification canonique : [docs/specs/spec-repositionnement-ia/SPEC.md#CAP-6](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/SPEC.md) (CAP-6, CAP-7, CAP-8, CAP-9)
- Charte éditoriale & messaging : [docs/specs/spec-repositionnement-ia/messaging-matrix.md](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/messaging-matrix.md)
- Brief Codex : [docs/jouan-ovh-offre-v1-brief-codex.md](file:///Users/simon/dev/jouan.ovh/docs/jouan-ovh-offre-v1-brief-codex.md) (Sections 16, 17, 18, 19)
- Cahier des charges : [docs/planning-artifacts/epics.md#Story-12.6](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)
- Invariants d'implémentation : [AGENTS.md](file:///Users/simon/dev/jouan.ovh/AGENTS.md)
- Travaux différés : [docs/implementation-artifacts/deferred-work.md](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/deferred-work.md)

exec
/bin/zsh -lc "sed -n '1,260p' docs/implementation-artifacts/code-reviews/12-6/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
diff --git a/app/pages/about.vue b/app/pages/about.vue
index 0fbfd92..e7a44e6 100644
--- a/app/pages/about.vue
+++ b/app/pages/about.vue
@@ -21,26 +21,42 @@
             </div>
           </div>
 
-          <!-- Colonne droite : eyebrow + bio (1re personne, emphases sur les technologies) + stack -->
+          <!-- Colonne droite : eyebrow + bio (1re personne, emphases sur les technologies) + bloc philosophie + stack -->
           <div class="about__bio">
-            <h2 class="eyebrow">// à propos</h2>
+            <h2 class="eyebrow"><span aria-hidden="true">// </span>à propos</h2>
             <p class="prose about__para">
-              Développeur Full Stack freelance basé en <strong>France (Remote)</strong>, je viens d'un parcours
-              technique (métrologie, instrumentation) avant de basculer avec passion dans le code. Aujourd'hui, je
-              conçois et développe des applications web et produits SaaS modernes avec <strong>Vue 3 / Nuxt 4</strong>,
-              <strong>NestJS</strong> et <strong>PostgreSQL</strong>.
+              Je développe des produits et applications depuis plusieurs années, avec un parcours un peu atypique :
+              <strong>douze ans dans la métrologie industrielle</strong> avant de passer au logiciel.
             </p>
             <p class="prose about__para">
-              Je suis également co-fondateur de la plateforme SaaS
-              <ZExternalLink :href="keovaUrl">{{ keovaHostname }}</ZExternalLink
-              >, et j'intègre l'automatisation, l'exigence QA et l'IA au service du code — tests automatisés,
-              architecture modulaire et intégrations d'APIs.
+              Cette première carrière m’a donné des réflexes qui me suivent encore aujourd’hui :
+              <strong>mesurer, tracer, vérifier</strong> et ne pas considérer qu’un système est fiable simplement parce
+              qu’il fonctionne une fois.
             </p>
+            <p class="prose about__para">
+              Aujourd’hui, je combine <strong>développement Full Stack</strong>, <strong>culture QA</strong> et
+              <strong>IA appliquée</strong> pour transformer des processus métier manuels en systèmes logiciels
+              réellement exploitables.
+            </p>
+
+            <!-- Bloc philosophie d'intervention (AC-1) -->
+            <div class="about__philosophy">
+              <p class="about__philo-intro">Je ne pars pas de « où mettre de l'IA ? ».</p>
+              <p class="about__philo-lead">Je pars de :</p>
+              <ul class="about__philo-list">
+                <li>qu’est-ce qui prend du temps ?</li>
+                <li>qu’est-ce qui se répète ?</li>
+                <li>où l’information se perd-elle ?</li>
+                <li>où une personne doit-elle recopier, rechercher ou interpréter ?</li>
+                <li>qu’est-ce qui doit absolument rester sous contrôle humain ?</li>
+              </ul>
+              <p class="about__philo-outro">Ensuite seulement vient la solution technique.</p>
+            </div>
 
             <!-- Stack technique (story 5.2) — sous la bio, conforme à About.jsx. ZTag = pill.
                  Liste sémantique (<ul>/<li>) pour annonce « liste de N éléments » aux lecteurs d'écran. -->
             <div class="about__stack">
-              <h2 class="eyebrow eyebrow--muted">// stack</h2>
+              <h2 class="eyebrow eyebrow--muted"><span aria-hidden="true">// </span>stack</h2>
               <ul class="hero__tags">
                 <li v-for="skill in skills" :key="skill">
                   <ZTag>{{ skill }}</ZTag>
@@ -60,7 +76,7 @@
           <!-- Colonne gauche : timeline d'expériences (la plus récente en haut).
                <ol> : séquence chronologique annoncée comme liste ordonnée aux lecteurs d'écran. -->
           <div>
-            <h2 class="eyebrow">// expériences</h2>
+            <h2 class="eyebrow"><span aria-hidden="true">// </span>expériences</h2>
             <ol class="tl">
               <li v-for="xp in experiences" :key="xp.org" class="tl__item">
                 <div class="tl__date">{{ xp.date }}</div>
@@ -73,7 +89,7 @@
 
           <!-- Colonne droite : formation (une ZCard par diplôme), liste sémantique <ul>/<li>. -->
           <div>
-            <h2 class="eyebrow">// formation</h2>
+            <h2 class="eyebrow"><span aria-hidden="true">// </span>formation</h2>
             <ul class="about__degrees">
               <li v-for="degree in degrees" :key="degree.name">
                 <ZCard padded>
@@ -101,12 +117,6 @@ import { SITE } from "~/data/site";
 // Identité + stack — source unique `app/data/site.ts`.
 const profile = SITE.profile;
 const skills = SITE.skills;
-const city = profile.city.split(",")[0]?.trim() ?? profile.city;
-const keovaProject =
-  SITE.legacyProjects.find((p) => p.name.toLowerCase().includes("keova") && p.url) ??
-  SITE.projects.find((p) => p.name.toLowerCase().includes("keova") && p.url);
-const keovaUrl = keovaProject?.url ?? "";
-const keovaHostname = keovaUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
 
 // Expériences (de la plus récente à la plus ancienne).
 // `org` sert de clé v-for stable (unique).
@@ -115,7 +125,7 @@ const experiences = [
     date: "02/2021 — aujourd'hui",
     role: "Testeur QA & Développeur TypeScript",
     org: "Linkizz",
-    desc: "Tests automatisés et fiabilisation applicative — Node.js, TypeScript, TestCafé.",
+    desc: "Tests automatisés, fiabilisation applicative et conception de systèmes résilients — Node.js, TypeScript, TestCafé. L'expérience QA influence directement la conception d'agents fiables : reproductibilité, cas limites, observabilité.",
   },
   {
     date: "05/2020 — 12/2021",
@@ -127,7 +137,7 @@ const experiences = [
     date: "07/2007 — 05/2019",
     role: "Métrologue",
     org: "A+ Métrologie / Trescal",
-    desc: "Technicien métrologue multi-grandeur, suppléant COFRAC électricité-magnétisme.",
+    desc: "Technicien métrologue multi-grandeur, suppléant COFRAC électricité-magnétisme. 12 ans de métrologie industrielle : rigueur de mesure, traçabilité et validation méthodologique.",
   },
 ];
 
@@ -138,8 +148,9 @@ const degrees = [
 ];
 
 // Métadonnées de la page. Voix 1re personne cohérente (cf. contrainte Langue & voix).
-const pageTitle = "À propos — jouan.ovh";
-const pageDescription = `Développeur web freelance à ${city}, je conçois des applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL — découvrez mon parcours.`;
+const pageTitle = "À propos — Simon Jouan";
+const pageDescription =
+  "Développeur Full Stack spécialisé en systèmes IA et automatisation métier. Parcours métrologie, culture QA et ingénierie logicielle au service de la fiabilité.";
 
 const siteUrl = useSiteUrl();
 const aboutJsonLd = {
@@ -265,6 +276,64 @@ usePageSeo({
   }
 }
 
+// ---- Bloc Philosophie ----
+.about__philosophy {
+  margin: var(--space-6) 0;
+  padding: var(--space-5);
+  border: 1px solid var(--border-subtle);
+  border-left: 3px solid var(--accent);
+  border-radius: var(--radius-md);
+  background: var(--surface-1);
+}
+
+.about__philo-intro {
+  margin: 0 0 var(--space-2);
+  font-family: var(--font-mono);
+  font-size: var(--fs-sm);
+  font-weight: var(--fw-medium);
+  color: var(--text-strong);
+}
+
+.about__philo-lead {
+  margin: 0 0 var(--space-3);
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  color: var(--text-muted);
+}
+
+.about__philo-list {
+  display: flex;
+  flex-direction: column;
+  gap: var(--space-2);
+  margin: 0 0 var(--space-4);
+  padding: 0;
+  list-style: none;
+
+  li {
+    position: relative;
+    padding-left: var(--space-5);
+    font-family: var(--font-mono);
+    font-size: var(--fs-xs);
+    line-height: var(--lh-normal);
+    color: var(--text-body);
+
+    &::before {
+      content: "→";
+      position: absolute;
+      left: 0;
+      color: var(--accent);
+    }
+  }
+}
+
+.about__philo-outro {
+  margin: 0;
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  font-style: italic;
+  color: var(--accent);
+}
+
 // ---- Stack (porté de About.jsx : bloc sous la bio) ----
 // .hero__tags (rangée de chips) = primitive de layout globale (base/_layout.scss).
 .about__stack {
diff --git a/app/pages/blog/[...slug].vue b/app/pages/blog/[...slug].vue
index 0668f84..e803f07 100644
--- a/app/pages/blog/[...slug].vue
+++ b/app/pages/blog/[...slug].vue
@@ -42,11 +42,11 @@
             <ContentRenderer :value="page" />
           </div>
 
-          <!-- Bloc CTA de fin (porté de Blog.jsx) -->
+          <!-- Bloc CTA de fin (porté de Blog.jsx / Story 12.6) -->
           <div class="article__cta">
-            <span class="article__cta-label">Un projet en tête ?</span>
+            <span class="article__cta-label">Un process vous fait perdre du temps ?</span>
             <ZButton :as="NuxtLink" to="/contact" variant="primary">
-              Démarrer un projet
+              Identifier un workflow
               <template #iconRight><ZIcon name="arrow" /></template>
             </ZButton>
           </div>
@@ -147,7 +147,7 @@ usePageSeo(() => {
   };
 
   return {
-    title: `${article.title} — jouan.ovh`,
+    title: `${article.title} — Simon Jouan`,
     ogTitle: article.title,
     description: article.description,
     path: article.path,
diff --git a/app/pages/blog/index.vue b/app/pages/blog/index.vue
index 63903b5..6bbacb6 100644
--- a/app/pages/blog/index.vue
+++ b/app/pages/blog/index.vue
@@ -3,10 +3,10 @@
     <section class="section">
       <div class="container">
         <!-- En-tête (porté de Blog.jsx : eyebrow + titre + sous-titre prose) -->
-        <p class="eyebrow">// ~/blog</p>
+        <p class="eyebrow"><span aria-hidden="true">// </span>~/blog</p>
         <h1 class="blog__title">Notes de dev</h1>
         <p class="prose blog__subtitle">
-          WordPress, architecture, IA appliquée — ce que j'apprends en construisant des choses.
+          Systèmes IA, agents, architecture et automatisation métier — ce que j'apprends en construisant des choses.
         </p>
 
         <!-- Liste des articles (triés par date décroissante), cartes interactives -->
@@ -100,9 +100,9 @@ const { data: articles, error } = await useAsyncData("blog-list", () =>
 // Métadonnées de la page. URL de prod lue depuis runtimeConfig via useSiteUrl()
 // (swappable staging/prod, sans domaine en dur). Inchangée en staging.
 const siteUrl = useSiteUrl();
-const pageTitle = "Blog — jouan.ovh";
+const pageTitle = "Blog — Simon Jouan";
 const pageDescription =
-  "Notes de dev — WordPress, architecture et IA appliquée : ce que j'apprends en construisant des produits web.";
+  "Notes de dev, architecture, agents IA et automatisation métier : retours d'expérience et apprentissages concrets sur le terrain.";
 const pageUrl = `${siteUrl}/blog`;
 
 // JSON-LD : flux d'articles (Blog → BlogPosting) pour les moteurs / agrégateurs.
@@ -110,7 +110,7 @@ const pageUrl = `${siteUrl}/blog`;
 const blogJsonLd = {
   "@context": "https://schema.org",
   "@type": "Blog",
-  name: "Notes de dev",
+  name: pageTitle,
   description: pageDescription,
   url: pageUrl,
   blogPost: (articles.value ?? []).map((article) => ({
diff --git a/app/pages/confidentialite.vue b/app/pages/confidentialite.vue
index d86e33e..c61beaa 100644
--- a/app/pages/confidentialite.vue
+++ b/app/pages/confidentialite.vue
@@ -27,11 +27,13 @@
             <p>Le site <strong>jouan.ovh</strong> limite la collecte des données personnelles au strict nécessaire :</p>
             <ul>
               <li>
-                <strong>Formulaire de contact :</strong> lorsque vous envoyez un message via la page
+                <strong>Formulaire de contact :</strong> lorsque vous envoyez une demande via la page

codex
Le skill de revue interne contient un workflow à checkpoints, mais votre consigne demande explicitement un audit complet sans pause. Je garde donc la posture adversariale de revue et j’applique directement les critères d’acceptation à la diff fournie.
exec
/bin/zsh -lc "sed -n '261,620p' docs/implementation-artifacts/code-reviews/12-6/full.diff" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "sed -n '1,220p' docs/specs/spec-repositionnement-ia/SPEC.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
id: SPEC-repositionnement-ia
companions:
  - messaging-matrix.md
  - services-and-pricing.md
  - projects-showcase.md
sources:
  - docs/jouan-ovh-offre-v1-brief-codex.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Repositionnement Offre V1 — Systèmes IA & Automatisation Métier

## Why

Le site actuel positionne Simon Jouan comme développeur Full Stack technique (Nuxt/NestJS/SaaS), ce qui dilue la valeur perçue et attire des demandes génériques ou peu qualifiées. Le nouveau positionnement commercial cible directement la douleur opérationnelle des entreprises : automatiser les processus métier chronophages et intégrer des systèmes et agents IA fiables en production. Le savoir-faire Full Stack et la culture QA deviennent le garant d'industrialisation (au-delà du prototype ou de l'automatisation fragile), sans renier l'identité sobre d'inspiration terminal du portfolio.

## Capabilities

- id: CAP-1
  intent: La source unique de données du site (`site.ts`) et les éléments globaux de marque (footer, bio, tags, métadonnées) reflètent le positionnement d'expert systèmes IA et automatisation métier, en éliminant les intitulés proscrits (ingénieur IA, ERP équestre, WordPress principal, localisation erronée).
  success: Une inspection de `app/data/site.ts` et des pieds de page confirme la présence du titre "Développeur Full Stack spécialisé en systèmes IA & automatisation métier", la localisation "France · Remote", la mise à jour des bios et l'absence totale de "Ingénieur IA" ou "ERP équestre".

- id: CAP-2
  intent: Le visiteur arrivant sur la page d'accueil identifie en moins de 15 secondes la promesse d'automatisation des workflows d'équipe via un Hero restructuré et un terminal interactif mis à jour.
  success: Le hero affiche le H1 "Automatisez les workflows qui freinent votre équipe", le sous-titre orienté intégration métier, les CTAs dédiés ("Identifier un workflow à automatiser" et "Voir mes systèmes IA"), et les sorties de commande du terminal hero reflètent les commandes `whoami`, `focus.txt` et `~/systems`.

- id: CAP-3
  intent: La page d'accueil présente la nouvelle offre en 3 cartes de services et un bloc différenciateur "prototype vers production" valorisant la robustesse technique et la QA.
  success: La section "Ce que je propose" expose les 3 offres (Automatisation de processus métier, Agents IA intégrés à vos outils, Applications IA sur mesure) avec leurs tags respectifs, immédiatement suivie du bloc "Un agent qui fonctionne trois fois n'est pas encore un système fiable" détaillant les piliers Données, Fiabilité, IA et Exploitation.

- id: CAP-4
  intent: La page d'accueil met en avant 3 projets phares démontrant la résolution de problèmes métier concrets (Keova Signal, Debrief, Devis-Assist), tout en conservant les réalisations antérieures dans un statut d'archives ou de parcours.
  success: Les trois projets affichés en vitrine principale sont Keova Signal (commercial / signaux d'achat), Debrief (desktop / IA locale privacy-first) et Devis-Assist (BTP / OCR & extraction documentaire), avec leurs statuts réels (interne, R&D, MVP) et sans métrique ni ROI fictif.

- id: CAP-5
  intent: La page Services (`/services`) détaille la méthodologie d'intervention en 4 étapes et la grille tarifaire transparente des 3 formats d'engagement.
  success: La page `/services` articule le processus (Diagnostic, Cadrage, Build, Exploitation) et affiche les offres "AI Workflow Sprint" (à partir de 3 500 € HT), "AI Workflow Blueprint" (à partir de 750 € HT) et "AI Care" (à partir de 490 € HT/mois) en dissociant explicitement les coûts d'infrastructure et d'APIs tierces.

- id: CAP-6
  intent: La page À propos (`/about`) retrace la trajectoire professionnelle en articulant la métrologie industrielle, le contrôle qualité (QA), le développement Full Stack et l'ingénierie des systèmes IA.
  success: Le contenu d'introduction et la timeline relient explicitement la rigueur de métrologie et QA à la fiabilité des agents IA en production (reproductibilité, gestion des cas limites, observabilité).

- id: CAP-7
  intent: Le visiteur peut qualifier directement son workflow problématique via les CTA de bas de page et le formulaire de contact mis à jour.
  success: Le CTA final global pose la question "Quel process vous fait perdre du temps chaque semaine ?" avec le prompt inspecteur `$ ./workflow --inspect`, et le formulaire de contact permet de saisir la description du processus et son fonctionnement actuel.

- id: CAP-8
  intent: Les métadonnées SEO, OpenGraph et données structurées Schema.org intègrent les nouveaux mots-clés sans allégations trompeuses.
  success: `usePageSeo` injecte les balises de titres ("Simon Jouan — Systèmes IA, agents & automatisation métier") et descriptions cibles sur l'ensemble des 13 routes pré-rendues.

- id: CAP-9
  intent: La refonte de contenu préserve intégralement les acquis d'accessibilité (a11y WCAG / RGAA), le responsive mobile et l'univers graphique terminal dark-first sans régression technique.
  success: La validation Docker `pnpm lint && pnpm typecheck && pnpm generate` passe avec 0 erreur et les contrastes, focus clavier et comportements motion réduit sont maintenus conformes aux standards du projet.

## Constraints

- **Direction artistique pérenne :** Conservation stricte du thème sombre aubergine, de l'accent orange, de la typographie Ubuntu/monospace et de l'ambiance terminal. Zéro cliché visuel d'IA générique (pas de cerveaux lumineux, néons bleus/violets, robots ou logos OpenAI partout).
- **Zéro Emoji :** Conformité stricte à la règle NFR6 du projet (aucun emoji dans les contenus textuels ou l'UI).
- **Vérité des faits :** Aucun ROI inventé, aucune promesse magique de remplacement d'employés, respect des statuts réels des projets (R&D, MVP, interne).
- **Environnement Docker exclusif :** Toute validation et compilation s'exécute dans Docker via `docker compose run --rm web ...`.
- **DRY & Pas d'URL en dur :** Données centralisées dans `app/data/site.ts`, URL résolue via `useSiteUrl()`.

## Non-goals

- Ne pas refondre l'identité graphique, le logo ou le Design System de base.
- Ne pas construire de système d'authentification ou d'espace client sur `jouan.ovh`.
- Ne pas supprimer brutalement les anciens projets du code (conservation propre pour archives ou parcours).
- Ne pas créer de calculateur de devis automatisé complexe en V1.

## Success signal

Le site déployé sur `jouan.ovh` (ou prévisualisé en local) permet à un prospect ou client en moins de 20 secondes d'identifier Simon comme développeur Full Stack capable d'automatiser un processus métier via des systèmes IA robustes, avec 3 démonstrateurs techniques crédibles et une proposition d'audit initial immédiate, validé par une gate CI/Docker verte à 100 %.

## Assumptions

- Les dépôts `zohac/keova_signal`, `zohac/debrief` et `zohac/devis-assist` sont des projets privés sous propriété intellectuelle : ils sont présentés avec le statut `Projet interne / Dépôt privé` sans lien GitHub sortant direct.
- Keova Signal dispose déjà de 3 visuels haute définition copiés dans `public/images/projects/`.
- Debrief dispose de 3 captures de référence prêtes à l'import depuis son Design System.
- Devis-Assist est représenté fidèlement sous son statut de phase de spécification et d'architecture BMM validées (pipeline Mistral OCR 3, BullMQ, pg_trgm).
- Les anciens projets restent référencés dans le code de `site.ts` sous une section secondaire d'archives/parcours.

## Open Questions

- L'expérience `Linkizz` sur la page À propos doit-elle être conservée telle quelle, ajustée ou complétée ?


 succeeded in 0ms:
                 <NuxtLink to="/contact" class="legal__link">Contact</NuxtLink>, je collecte votre <strong>nom</strong>,
-                votre <strong>adresse email</strong>, ainsi que le <strong>sujet</strong> (facultatif) et le
-                <strong>contenu de votre message</strong>. Les champs nom, email et message sont obligatoires pour me
-                permettre de vous répondre.
+                votre <strong>adresse email</strong>, le nom de votre <strong>entreprise</strong> (facultatif), la
+                <strong>fréquence</strong> du processus (facultatif), ainsi que la description de votre workflow
+                (<strong>processus à améliorer</strong> et <strong>fonctionnement actuel</strong>). Les champs nom,
+                email, processus et fonctionnement actuel sont obligatoires pour me permettre de qualifier votre besoin
+                et vous répondre.
               </li>
               <li>
                 <strong>Finalité :</strong> ces informations sont utilisées exclusivement pour traiter votre demande, y
@@ -155,7 +157,7 @@ import { usePageSeo } from "~/composables/usePageSeo";
 const profile = SITE.profile;
 
 usePageSeo({
-  title: "Politique de confidentialité — jouan.ovh",
+  title: "Politique de confidentialité — Simon Jouan",
   description:
     "Politique de confidentialité et protection des données personnelles (RGPD) du site jouan.ovh — Simon Jouan.",
   path: "/confidentialite",
diff --git a/app/pages/contact/card.vue b/app/pages/contact/card.vue
index 0fb22a4..060472f 100644
--- a/app/pages/contact/card.vue
+++ b/app/pages/contact/card.vue
@@ -102,7 +102,8 @@ const cardJsonLd = {
 
 usePageSeo({
   title: "Carte de visite — Simon Jouan",
-  description: "Fiche contact et QR code vCard de Simon Jouan, Développeur Full Stack TypeScript.",
+  description:
+    "Fiche contact et QR code vCard de Simon Jouan, Développeur Full Stack spécialisé en systèmes IA et automatisation métier.",
   path: "/contact/card",
   image: "/images/portrait.jpeg",
   type: "profile",
diff --git a/app/pages/contact/index.vue b/app/pages/contact/index.vue
index 77e0ece..972f6ef 100644
--- a/app/pages/contact/index.vue
+++ b/app/pages/contact/index.vue
@@ -3,13 +3,13 @@
     <section class="section">
       <div class="container">
         <div class="contact__grid">
-          <!-- Colonne gauche : en-tête + formulaire (story 7.1) -->
+          <!-- Colonne gauche : en-tête + formulaire (story 7.1 / story 12.6) -->
           <div class="contact__main">
             <p class="eyebrow"><span aria-hidden="true">// </span>contact</p>
-            <h1 class="contact__title">Parlons de votre projet</h1>
+            <h1 class="contact__title">Parlons de votre workflow</h1>
             <p class="prose contact__intro">
-              Une idée, un site à refaire, une automatisation à mettre en place ? Décrivez-moi le besoin — je réponds
-              sous 48h.
+              Décrivez-moi simplement le processus qui vous ralentit ou vous fait perdre du temps au quotidien. Je vous
+              réponds sous 48h avec une première analyse de faisabilité.
             </p>
 
             <!-- État « envoyé » : carte accent + ligne mono verte. role="status" + focus
@@ -43,29 +43,49 @@
                 />
                 <ZInput
                   v-model="form.email"
-                  label="Email"
+                  label="Email professionnel"
                   type="email"
-                  placeholder="vous@exemple.com"
+                  placeholder="vous@entreprise.com"
                   required
                   autocomplete="email"
                   :error="Boolean(errors.email)"
                   :hint="errors.email"
                 />
               </div>
+
+              <div class="contact__row">
+                <ZInput
+                  v-model="form.company"
+                  label="Entreprise"
+                  placeholder="Nom de votre structure"
+                  autocomplete="organization"
+                />
+                <ZInput
+                  v-model="form.frequency"
+                  label="Combien de fois ce process se répète-t-il ?"
+                  placeholder="Ex : quotidien, 10x par semaine…"
+                  autocomplete="off"
+                />
+              </div>
+
               <ZInput
-                v-model="form.subject"
-                label="Sujet"
-                placeholder="Site WordPress, application, IA…"
+                v-model="form.workflow"
+                label="Quel processus souhaitez-vous améliorer ?"
+                placeholder="Ex : qualification des leads, devis BTP, extraction de factures…"
+                required
                 autocomplete="off"
+                :error="Boolean(errors.workflow)"
+                :hint="errors.workflow"
               />
+
               <ZInput
-                v-model="form.message"
-                label="Message"
+                v-model="form.currentState"
+                label="Comment fonctionne-t-il aujourd’hui ?"
                 multiline
-                placeholder="Parlez-moi de votre projet…"
+                placeholder="Outils utilisés, étapes manuelles, qui intervient, où l’information se perd…"
                 required
-                :error="Boolean(errors.message)"
-                :hint="errors.message"
+                :error="Boolean(errors.currentState)"
+                :hint="errors.currentState"
               />
 
               <!-- Erreur d'envoi réseau (distincte des erreurs de validation par champ). -->
@@ -73,14 +93,14 @@
 
               <div>
                 <ZButton type="submit" variant="primary" size="lg" :disabled="sending">
-                  {{ sending ? "Envoi en cours…" : "Envoyer le message" }}
+                  {{ sending ? "Envoi en cours…" : "Décrire mon workflow" }}
                   <template #iconRight><ZIcon name="arrow" /></template>
                 </ZButton>
               </div>
 
               <p class="contact__rgpd">
-                En envoyant ce formulaire, vos nom, email, sujet et message sont transmis via Web3Forms à seule fin de
-                traiter votre demande. Consultez la
+                En envoyant ce formulaire, vos coordonnées et la description de votre workflow sont transmises via
+                Web3Forms à seule fin de qualifier votre besoin et vous répondre. Consultez la
                 <NuxtLink to="/confidentialite" class="contact__rgpd-link">politique de confidentialité</NuxtLink>.
               </p>
             </form>
@@ -146,7 +166,7 @@
 <script setup lang="ts">
 // Page Contact — colonne gauche : en-tête + formulaire (story 7.1, envoi Web3Forms,
 // service tiers SANS serveur). Colonne droite : infos + CTA terminal + socials (story 7.2).
-import { nextTick } from "vue";
+import { nextTick, reactive, ref, watch } from "vue";
 import { NuxtLink } from "#components";
 import { SITE } from "~/data/site";
 
@@ -160,8 +180,10 @@ const { open: openTerminal } = useTerminal();
 interface ContactForm {
   name: string;
   email: string;
-  subject: string;
-  message: string;
+  company: string;
+  workflow: string;
+  currentState: string;
+  frequency: string;
 }
 
 interface Web3FormsResponse {
@@ -174,9 +196,23 @@ const ERROR_MESSAGE = `L'envoi a échoué. Réessayez, ou écrivez-moi directeme
 // Clé Web3Forms injectée par l'env (NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY) — jamais en dur.
 const accessKey = useRuntimeConfig().public.web3formsAccessKey;
 
-const form = reactive<ContactForm>({ name: "", email: "", subject: "", message: "" });
+const form = reactive<ContactForm>({
+  name: "",
+  email: "",
+  company: "",
+  workflow: "",
+  currentState: "",
+  frequency: "",
+});
+
 // Message d'erreur par champ requis ("" = valide). Rendu sous le champ via ZInput.
-const errors = reactive({ name: "", email: "", message: "" });
+const errors = reactive({
+  name: "",
+  email: "",
+  workflow: "",
+  currentState: "",
+});
+
 const honeypot = ref("");
 const sent = ref(false);
 const sending = ref(false);
@@ -198,14 +234,15 @@ function validate(): boolean {
     : EMAIL_RE.test(form.email.trim())
       ? ""
       : "Cet email ne semble pas valide.";
-  errors.message = form.message.trim() ? "" : "Un message est requis.";
-  return !errors.name && !errors.email && !errors.message;
+  errors.workflow = form.workflow.trim() ? "" : "Veuillez préciser le processus à améliorer.";
+  errors.currentState = form.currentState.trim() ? "" : "Veuillez décrire le fonctionnement actuel.";
+  return !errors.name && !errors.email && !errors.workflow && !errors.currentState;
 }
 
 // Après un 1er envoi, re-valider à la saisie : corriger un champ lève son message d'erreur
 // sans attendre une nouvelle soumission.
 watch(
-  () => [form.name, form.email, form.message],
+  () => [form.name, form.email, form.workflow, form.currentState],
   () => {
     if (submitted.value) {
       validate();
@@ -244,8 +281,12 @@ async function onSubmit(): Promise<void> {
         access_key: accessKey,
         name: form.name.trim(),
         email: form.email.trim(),
-        subject: form.subject.trim() || "Nouveau message depuis jouan.ovh",
-        message: form.message.trim(),
+        company: form.company.trim(),
+        subject: `Qualification de workflow : ${form.workflow.trim() || "Nouveau projet"}`,
+        workflow: form.workflow.trim(),
+        current_state: form.currentState.trim(),
+        frequency: form.frequency.trim(),
+        message: `Processus à améliorer : ${form.workflow.trim()}\n\nFonctionnement actuel :\n${form.currentState.trim()}\n\nFréquence : ${form.frequency.trim() || "Non spécifiée"}\nEntreprise : ${form.company.trim() || "Non spécifiée"}`,
         botcheck: "",
       },
     });
@@ -267,9 +308,9 @@ const siteUrl = useSiteUrl();
 const contactJsonLd = {
   "@context": "https://schema.org",
   "@type": "ContactPage",
-  name: "Contact — jouan.ovh",
+  name: "Contact — Simon Jouan",
   description:
-    "Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h.",
+    "Parlons de votre workflow : décrivez le processus métier qui vous ralentit pour identifier les opportunités d'automatisation et d'agents IA adaptés.",
   url: `${siteUrl}/contact`,
   mainEntity: {
     "@type": "Person",
@@ -284,9 +325,9 @@ const contactJsonLd = {
 };
 
 usePageSeo({
-  title: "Contact — jouan.ovh",
+  title: "Contact — Simon Jouan",
   description:
-    "Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h.",
+    "Parlons de votre workflow : décrivez le processus métier qui vous ralentit pour identifier les opportunités d'automatisation et d'agents IA adaptés.",
   path: "/contact",
   image: "/images/portrait.jpeg",
   type: "website",
diff --git a/app/pages/index.vue b/app/pages/index.vue
index 7f84950..bd728b5 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -259,35 +259,26 @@
       </div>
     </section>
 
-    <!-- Bloc CTA final de conversion (Story 11.4 / AC-4) -->
+    <!-- Bloc CTA final de conversion (Story 12.6 / AC-2) -->
     <section class="section">
       <div class="container">
         <div class="cta">
-          <p class="eyebrow cta__eyebrow"><span aria-hidden="true">$ </span>./contact --start</p>
+          <p class="eyebrow cta__eyebrow"><span aria-hidden="true">$ </span>./workflow --inspect</p>
           <h2 class="cta__title">
-            Un projet en tête ?<br />
-            Mettons-le <span class="cta__highlight">en production</span>.
+            Quel process vous fait perdre du temps <span class="cta__highlight">chaque semaine</span> ?
           </h2>
           <p class="cta__subtitle">
-            Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript,
-            parlons-en.
+            Décrivez-moi simplement comment il fonctionne aujourd’hui. Je vous dirai ce qui mérite d’être automatisé, ce
+            qui doit rester humain et si l’IA apporte réellement quelque chose.
           </p>
           <div class="cta__actions">
             <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg" data-hot>
-              Discuter de votre projet
+              Identifier un workflow à automatiser
               <template #iconRight><ZIcon name="arrow" /></template>
             </ZButton>
-            <ZButton
-              v-if="SITE.profile.maltUrl"
-              :as="ZExternalLink"
-              :href="SITE.profile.maltUrl"
-              variant="secondary"
-              size="lg"
-              data-hot
-            >
-              Me contacter sur Malt
+            <ZButton as="a" :href="`mailto:${SITE.profile.email}`" variant="secondary" size="lg" data-hot>
+              M’écrire directement
             </ZButton>
-            <ZButton :as="NuxtLink" to="/about" variant="ghost" size="lg" data-hot> Voir le parcours &amp; CV </ZButton>
           </div>
         </div>
       </div>
@@ -440,7 +431,7 @@ const homeJsonLd = [
   {
     "@context": "https://schema.org",
     "@type": "WebSite",
-    name: "Simon Jouan — Développeur Full Stack TypeScript",
+    name: "Simon Jouan — Systèmes IA, agents & automatisation métier",
     url: siteUrl,
     description: SITE.profile.role,
   },
@@ -461,9 +452,9 @@ const homeJsonLd = [
 ];
 
 usePageSeo({
-  title: "Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS",
+  title: "Simon Jouan — Systèmes IA, agents & automatisation métier",
   description:
-    "Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL.",
+    "Développeur Full Stack spécialisé en systèmes IA et automatisation métier. Agents IA, intégrations, applications sur mesure et workflows mis en production.",
   path: "/",
   image: "/images/portrait.jpeg",
   type: "website",
diff --git a/app/pages/mentions-legales.vue b/app/pages/mentions-legales.vue
index baf3a9c..1990a55 100644
--- a/app/pages/mentions-legales.vue
+++ b/app/pages/mentions-legales.vue
@@ -95,7 +95,7 @@ import { usePageSeo } from "~/composables/usePageSeo";
 const profile = SITE.profile;
 
 usePageSeo({
-  title: "Mentions légales — jouan.ovh",
+  title: "Mentions légales — Simon Jouan",
   description: "Mentions légales, informations éditeur et hébergement du site jouan.ovh — Simon Jouan.",
   path: "/mentions-legales",
   type: "website",
diff --git a/docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md b/docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md
index e445d7b..c6c8864 100644
--- a/docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md
+++ b/docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md
@@ -4,7 +4,7 @@ baseline_commit: c1b8a200419751d2817144be71e60d508b413626
 
 # Story 12.6: Page À propos, CTA d'inspection de workflow, formulaire & SEO site-wide
 
-Status: ready-for-dev
+Status: review
 
 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
 
@@ -77,51 +77,84 @@ so that j'envoie une demande précise et pertinente (FR33, FR34, FR35, FR36, NFR
 
 ## Tasks / Subtasks
 
-- [ ] Tâche 1 — Refonte de la page À propos (`app/pages/about.vue`) (AC: 1, 4, 5)
-  - [ ] Mettre à jour la biographie hero en intégrant les paragraphes officiels sur les 12 ans de métrologie, la bascule dans le code et la culture QA.
-  - [ ] Insérer le bloc philosophie d'intervention sous forme de carte ou bloc stylisé (`ZCard` ou section typographique BEM).
-  - [ ] Mettre en valeur l'expérience Linkizz dans la timeline des expériences en explicitant l'apport de la QA à la conception d'agents fiables.
-  - [ ] Vérifier la consommation de `SITE.profile.role` et `SITE.profile.city`.
-  - [ ] Aligner les métadonnées SEO et le JSON-LD `aboutJsonLd` (`addressLocality: "France · Remote"`).
+- [x] Tâche 1 — Refonte de la page À propos (`app/pages/about.vue`) (AC: 1, 4, 5)
+  - [x] Mettre à jour la biographie hero en intégrant les paragraphes officiels sur les 12 ans de métrologie, la bascule dans le code et la culture QA.
+  - [x] Insérer le bloc philosophie d'intervention sous forme de carte ou bloc stylisé (`ZCard` ou section typographique BEM).
+  - [x] Mettre en valeur l'expérience Linkizz dans la timeline des expériences en explicitant l'apport de la QA à la conception d'agents fiables.
+  - [x] Vérifier la consommation de `SITE.profile.role` et `SITE.profile.city`.
+  - [x] Aligner les métadonnées SEO et le JSON-LD `aboutJsonLd` (`addressLocality: "France · Remote"`).
 
-- [ ] Tâche 2 — Mise à jour du CTA final global sur la Homepage et le Blog (AC: 2, 5)
-  - [ ] Dans `app/pages/index.vue`, remplacer le bloc CTA final actuel par la formulation officielle :
+- [x] Tâche 2 — Mise à jour du CTA final global sur la Homepage et le Blog (AC: 2, 5)
+  - [x] Dans `app/pages/index.vue`, remplacer le bloc CTA final actuel par la formulation officielle :
     - Eyebrow : `<span aria-hidden="true">$ </span>./workflow --inspect`
     - H2 : `Quel process vous fait perdre du temps chaque semaine ?`
     - Sous-titre : `Décrivez-moi simplement comment il fonctionne aujourd’hui. Je vous dirai ce qui mérite d’être automatisé, ce qui doit rester humain et si l’IA apporte réellement quelque chose.`

exec
/bin/zsh -lc "sed -n '1,240p' docs/specs/spec-repositionnement-ia/messaging-matrix.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
# Messaging Matrix & Charte Éditoriale — Repositionnement Offre IA

## 1. Identité & Promesse

| Dimension | Formulation officielle |
| :--- | :--- |
| **Titre principal** | Développeur Full Stack spécialisé en systèmes IA & automatisation métier |
| **Promesse centrale** | J’automatise les processus commerciaux et opérationnels qui font perdre du temps, des opportunités ou de la capacité aux entreprises. |
| **Explication courte** | Je conçois des agents IA, automatisations et applications métier qui s’intègrent aux outils existants — du diagnostic jusqu’à la mise en production. |
| **Différenciateur clé** | Je ne construis pas seulement l’agent. Je construis le système autour : données, API, interface, sécurité, tests, supervision et déploiement. |
| **Version condensée** | Développeur Full Stack spécialisé IA & automatisation métier. Je transforme les workflows manuels en systèmes logiciels intégrés, fiables et mesurables. |
| **Baseline ultra-courte**| Systèmes IA · automatisation métier · Full Stack |

## 2. Principes & Doctrine d'Intervention

1. **Douleur avant solution :** on part du dysfonctionnement ou du goulot d'étranglement concret, jamais d'une lubie technologique.
2. **Workflow avant technologie :** simplifier et cartographier le flux avant d'automatiser.
3. **Déterministe d'abord :** des règles de code simples prévalent dès qu'elles suffisent.
4. **IA ciblée :** mobilisée uniquement lorsque l'interprétation, la lecture, la synthèse ou la génération apportent une valeur irremplaçable.
5. **Autonomie justifiée :** des agents multi-étapes seulement si le parcours l'exige.
6. **Contrôle humain (*Human-in-the-loop*) :** supervision obligatoire sur les actions critiques, financières ou engageantes.
7. **Mesure factuelle :** comparaison systématique avant / après, sans indicateurs de rentabilité fantaisistes.
8. **Intégrité commerciale :** aucune promesse de remplacement d'effectifs ni de gain magique "10x".

## 3. Formulations proscrites vs Formulations cibles

| Proscrit / À bannir | Privilégié / À utiliser |
| :--- | :--- |
| Ingénieur IA / Ingénieur produit IA | Développeur Full Stack spécialisé systèmes IA |
| Expert ChatGPT / Prompt Engineer | Conception de systèmes IA & automatisation métier |
| Agence IA / No-code AI expert | Développement sur mesure & intégration robuste |
| "Vos employés IA autonomes" | "Des systèmes qui assistent vos équipes sur leurs tâches récurrentes" |
| "Révolutionnez votre business avec l'IA" | "Automatisez les workflows qui freinent votre équipe" |
| "ERP équestre" (pour Keova) | "Application métier & gestion opérationnelle" |
| Localisation "Rouen, France" | "France · Remote" |

## 4. Textes d'Accroche par Page

### 4.1 Homepage
- **Eyebrow :** `// DÉVELOPPEUR FULL STACK · SYSTÈMES IA & AUTOMATISATION`
- **H1 :** `Automatisez les workflows qui freinent votre équipe.`
- **Sous-titre :** `Je conçois des agents IA, automatisations et applications métier qui s’intègrent à vos outils existants — de l’identification du problème jusqu’à la mise en production.`
- **Ligne de crédibilité :** `Full Stack TypeScript · Agents IA · APIs · PostgreSQL · MCP · IA locale · QA`
- **CTA principal :** `Identifier un workflow à automatiser`
- **CTA secondaire :** `Voir mes systèmes IA`
- **Signal disponibilité :** `Disponible pour nouvelles missions freelance`

### 4.2 Terminal Hero
```text
anon.@jouan.ovh:~$ whoami
Simon Jouan — Développeur Full Stack spécialisé IA & automatisation

anon.@jouan.ovh:~$ cat focus.txt
Systèmes IA · automatisation métier · agents · applications Full Stack · QA

anon.@jouan.ovh:~$ ls ~/systems
keova-signal/ debrief/ devis-assist/
```

### 4.3 Bloc Différenciateur "Prototype → Production"
- **Eyebrow :** `// au-delà de la démo`
- **H2 :** `Un agent qui fonctionne trois fois n’est pas encore un système fiable.`
- **Corps :** `Mon background Full Stack et QA me permet de traiter ce qui arrive après le prototype : authentification, permissions, données, erreurs, retries, logs, tests, coûts, monitoring, sécurité et supervision humaine. L’objectif n’est pas de mettre de l’IA partout. L’objectif est de construire un workflow qui reste utile lorsqu’il rencontre la vraie vie.`
- **4 Piliers :**
  - *Données :* provenance, structuration, stockage, rétention, secrets.
  - *Fiabilité :* cas limites, retries, fallbacks, tests, observabilité.
  - *IA :* sorties structurées, versionnage, évaluations, contrôle humain.
  - *Exploitation :* monitoring, coûts, support, maintenance, évolution.

### 4.4 CTA Final Global
- **Eyebrow :** `$ ./workflow --inspect`
- **H2 :** `Quel process vous fait perdre du temps chaque semaine ?`
- **Corps :** `Décrivez-moi simplement comment il fonctionne aujourd’hui. Je vous dirai ce qui mérite d’être automatisé, ce qui doit rester humain et si l’IA apporte réellement quelque chose.`
- **CTA principal :** `Identifier un workflow à automatiser`
- **CTA secondaire :** `M’écrire directement`

exec
/bin/zsh -lc "sed -n '1,260p' app/components/ui/ZInput.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <div class="zfield" :class="{ 'zfield--error': error }">
    <label v-if="label" class="zfield__label" :for="fieldId">
      {{ label }}<span v-if="required" class="zfield__req" aria-hidden="true">*</span>
    </label>

    <textarea
      v-if="multiline"
      v-bind="controlAttrs"
      :id="fieldId"
      class="ztextarea"
      :value="modelValue"
      :required="required || undefined"
      :aria-invalid="error || undefined"
      :aria-describedby="describedBy"
      @input="onInput"
    />

    <span v-else class="zinput__wrap">
      <span v-if="icon || $slots.icon" class="zinput__icon">
        <component :is="icon" v-if="icon" aria-hidden="true" />
        <slot v-else name="icon" />
      </span>
      <input
        v-bind="controlAttrs"
        :id="fieldId"
        class="zinput"
        :class="{ 'zinput--has-icon': icon || $slots.icon }"
        :value="modelValue"
        :required="required || undefined"
        :aria-invalid="error || undefined"
        :aria-describedby="describedBy"
        @input="onInput"
      />
    </span>

    <span v-if="hint" :id="hintId" class="zfield__hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
// Primitive champ du DS — label mono uppercase, valeur sans-serif, focus ring orange.
// Porté de docs/design_system/components/core/Input.jsx (CSS en <style scoped>, prerender-safe).
// API React (attrs natifs forwarded) → Vue : v-model (modelValue/update:modelValue) + $attrs sur le contrôle.
import type { Component } from "vue";
import { computed, useAttrs, useId } from "vue";

defineOptions({
  inheritAttrs: false,
});

interface Props {
  /** Valeur liée (v-model). */
  modelValue?: string;
  /** Label mono uppercase au-dessus du contrôle. */
  label?: string;
  /** Texte d'aide / d'erreur sous le contrôle. */
  hint?: string;
  /** Style d'erreur. @default false */
  error?: boolean;
  /** Ajoute un `*` orange au label + `required` natif. @default false */
  required?: boolean;
  /** Rend un <textarea> au lieu d'un <input>. @default false */
  multiline?: boolean;
  /** Icône leading (composant Vue ou nom), input simple uniquement. */
  icon?: string | Component;
  /** id explicite ; sinon généré (hydration-safe via useId). */
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  label: undefined,
  hint: undefined,
  error: false,
  required: false,
  multiline: false,
  icon: undefined,
  id: undefined,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

// id déterministe et hydration-safe (useId), surchargeable par la prop `id`.
const generatedId = useId();
const fieldId = computed(() => props.id ?? generatedId);
const hintId = computed(() => `${fieldId.value}-hint`);
const attrs = useAttrs();

const controlledAttrs = new Set([
  "aria-describedby",
  "ariaDescribedby",
  "aria-invalid",
  "ariaInvalid",
  "id",
  "modelValue",
  "required",
  "value",
]);

const controlAttrs = computed(() => {
  return Object.fromEntries(
    Object.entries(attrs).filter(([key]) => {
      return !controlledAttrs.has(key);
    }),
  );
});

const describedBy = computed(() => {
  const attrDescribedBy = attrs["aria-describedby"] ?? attrs.ariaDescribedby;
  const externalIds = typeof attrDescribedBy === "string" ? attrDescribedBy.trim() : "";

  if (!props.hint) {
    return externalIds || undefined;
  }

  return [externalIds, hintId.value].filter(Boolean).join(" ");
});

function onInput(event: Event) {
  emit("update:modelValue", (event.target as HTMLInputElement | HTMLTextAreaElement).value);
}
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis Input.jsx */
.zfield {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.zfield__label {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: var(--ls-wider);
  text-transform: uppercase;
  color: var(--text-muted);
}

.zfield__req {
  margin-left: 2px;
  color: var(--accent);
}

.zinput,
.ztextarea {
  box-sizing: border-box;
  width: 100%;
  height: 42px;
  padding: 0 var(--space-3);
  font-family: var(--font-sans);
  font-size: var(--fs-base);
  color: var(--text-strong);
  background: var(--bg-input);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  transition:
    border-color var(--dur-fast) var(--ease-standard),
    box-shadow var(--dur-fast) var(--ease-standard);

  &::placeholder {
    // Contraste (story 9.2) : remonté d'un palier (--text-faint → --text-muted).
    // Le champ porte un <label> ; le placeholder reste supplémentaire mais lisible.
    color: var(--text-muted);
  }

  &:hover {
    border-color: var(--border-strong);
  }

  &:focus {
    // Outline transparent → rendu en couleur système sous forced-colors (où la
    // box-shadow du ring et la bordure accent ne suffisent plus) — focus visible (AC #2).
    outline: 2px solid transparent;
    outline-offset: 2px;
    border-color: var(--accent);
    box-shadow: var(--ring-accent);
  }
}

.ztextarea {
  height: auto;
  min-height: 110px;
  padding: var(--space-3);
  line-height: var(--lh-normal);
  resize: vertical;
}

.zfield--error {
  .zinput,
  .ztextarea {
    border-color: var(--danger);
  }

  .zfield__hint {
    color: var(--danger);
  }
}

.zfield__hint {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--text-muted);
}

.zinput__wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.zinput--has-icon {
  padding-left: calc(var(--space-3) + 1.4em);
}

.zinput__icon {
  position: absolute;
  left: var(--space-3);
  display: inline-flex;
  width: 1.05em;
  height: 1.05em;
  color: var(--text-muted);

  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .zinput,
  .ztextarea {
    transition: none;
  }
}
</style>

exec
/bin/zsh -lc "rg -n \"Story 12\\.6|12\\.6|Quel process|workflow --inspect|À propos\" docs/planning-artifacts/epics.md docs/project-context.md docs/jouan-ovh-offre-v1-brief-codex.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/jouan-ovh-offre-v1-brief-codex.md:101:4. Page À propos
docs/jouan-ovh-offre-v1-brief-codex.md:500:À proposer uniquement quand plusieurs heures d’analyse / architecture sont nécessaires.
docs/jouan-ovh-offre-v1-brief-codex.md:756:La page À propos affiche actuellement `Linkizz`.
docs/jouan-ovh-offre-v1-brief-codex.md:932:# 16. Page À propos — nouveau contenu
docs/jouan-ovh-offre-v1-brief-codex.md:1009:$ ./workflow --inspect
docs/jouan-ovh-offre-v1-brief-codex.md:1015:Quel process vous fait perdre du temps chaque semaine ?
docs/jouan-ovh-offre-v1-brief-codex.md:1048:Quel processus souhaitez-vous améliorer ?
docs/jouan-ovh-offre-v1-brief-codex.md:1236:- [ ] la page À propos relie métrologie → QA → développement → systèmes IA ;
docs/planning-artifacts/epics.md:72:FR33: Page À propos — Trajectoire professionnelle et rigueur QA (métrologie industrielle → QA logicielle → Full Stack → systèmes IA en production). _(CAP-6)_
docs/planning-artifacts/epics.md:73:FR34: CTA global inspecteur de workflow (`$ ./workflow --inspect`) et formulaire de contact orienté qualification de processus. _(CAP-7)_
docs/planning-artifacts/epics.md:173:FR33: Epic 12 — Page À propos, trajectoire métrologie / QA & systèmes IA
docs/planning-artifacts/epics.md:960:### Story 12.6: Page À propos, CTA d'inspection de workflow, formulaire & SEO site-wide
docs/planning-artifacts/epics.md:970:**Then** la page À propos (`/about`) :
docs/planning-artifacts/epics.md:976:  - Eyebrow : `$ ./workflow --inspect`
docs/planning-artifacts/epics.md:977:  - Titre : `Quel process vous fait perdre du temps chaque semaine ?`

exec
/bin/zsh -lc "rg -n \"addressLocality|profile\\.role|profile\\.city|aboutJsonLd|contact__field|first|errors|aria-invalid|ref=\" app/pages/about.vue app/pages/contact/index.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/about.vue:13:            <p class="about__role">{{ profile.role }}</p>
app/pages/about.vue:16:              {{ profile.city }}
app/pages/about.vue:20:              <ZButton as="a" :href="`mailto:${profile.email}`" variant="secondary">M'écrire</ZButton>
app/pages/about.vue:113:// stack en <ZTag>, formation en <ZCard>. Dark-first, tokens uniquement, prerender-safe.
app/pages/about.vue:156:const aboutJsonLd = {
app/pages/about.vue:164:    jobTitle: SITE.profile.role,
app/pages/about.vue:170:      addressLocality: SITE.profile.city,
app/pages/about.vue:183:  jsonLd: aboutJsonLd,
app/pages/contact/index.vue:17:            <ZCard v-if="sent" ref="sentCard" accent class="contact__sent" role="status" tabindex="-1">
app/pages/contact/index.vue:25:            <form v-else ref="formRef" class="contact__form" novalidate @submit.prevent="onSubmit">
app/pages/contact/index.vue:41:                  :error="Boolean(errors.name)"
app/pages/contact/index.vue:42:                  :hint="errors.name"
app/pages/contact/index.vue:51:                  :error="Boolean(errors.email)"
app/pages/contact/index.vue:52:                  :hint="errors.email"
app/pages/contact/index.vue:77:                :error="Boolean(errors.workflow)"
app/pages/contact/index.vue:78:                :hint="errors.workflow"
app/pages/contact/index.vue:87:                :error="Boolean(errors.currentState)"
app/pages/contact/index.vue:88:                :hint="errors.currentState"
app/pages/contact/index.vue:118:                    <a class="contact__email" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
app/pages/contact/index.vue:209:const errors = reactive({
app/pages/contact/index.vue:231:  errors.name = form.name.trim() ? "" : "Votre nom est requis.";
app/pages/contact/index.vue:232:  errors.email = !form.email.trim()
app/pages/contact/index.vue:237:  errors.workflow = form.workflow.trim() ? "" : "Veuillez préciser le processus à améliorer.";
app/pages/contact/index.vue:238:  errors.currentState = form.currentState.trim() ? "" : "Veuillez décrire le fonctionnement actuel.";
app/pages/contact/index.vue:239:  return !errors.name && !errors.email && !errors.workflow && !errors.currentState;
app/pages/contact/index.vue:265:    formRef.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
app/pages/contact/index.vue:321:      addressLocality: SITE.profile.city,

codex
J’ai déjà repéré un écart net sur le CTA blog : la story ne demandait pas seulement un libellé plus orienté workflow, mais le bloc complet harmonisé. Je vérifie maintenant les formulations canon du brief pour éviter de signaler de faux positifs sur le contenu À propos.
exec
/bin/zsh -lc "sed -n '920,1085p' docs/jouan-ovh-offre-v1-brief-codex.md" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "sed -n '960,1005p' docs/planning-artifacts/epics.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
- suivi de valeur.

### Exclusions

- nouveau workflow ;
- nouvelle intégration majeure ;
- refonte importante ;
- migration ;
- consommations tierces illimitées.

---

# 16. Page À propos — nouveau contenu

## Hero

### Nom

```text
Simon Jouan
```

### Titre

```text
Développeur Full Stack spécialisé en systèmes IA & automatisation métier
```

### Intro

```text
Je développe des produits et applications depuis plusieurs années, avec un parcours un peu atypique : douze ans dans la métrologie industrielle avant de passer au logiciel.

Cette première carrière m’a donné des réflexes qui me suivent encore aujourd’hui : mesurer, tracer, vérifier et ne pas considérer qu’un système est fiable simplement parce qu’il fonctionne une fois.
```

Puis :

```text
Aujourd’hui, je combine développement Full Stack, culture QA et IA appliquée pour transformer des processus métier manuels en systèmes logiciels réellement exploitables.
```

## Bloc philosophie

```text
Je ne pars pas de “où mettre de l’IA ?”.

Je pars de :
- qu’est-ce qui prend du temps ?
- qu’est-ce qui se répète ?
- où l’information se perd-elle ?
- où une personne doit-elle recopier, rechercher ou interpréter ?
- qu’est-ce qui doit absolument rester sous contrôle humain ?

Ensuite seulement vient la solution technique.
```

## Parcours

Conserver :

- expérience développement ;
- QA ;
- SaaS ;
- métrologie ;
- formation.

Mettre davantage en valeur la QA comme avantage :

```text
Mon expérience QA influence directement ma manière de construire des systèmes IA : reproductibilité, cas limites, gestion des erreurs, observabilité et validation font partie du produit dès le départ.
```

---

# 17. CTA final global

Remplacer les CTA génériques du type :

```text
Un projet en tête ?
Mettons-le en production.
```

par un CTA directement relié au problème.

## Eyebrow

```text
$ ./workflow --inspect
```

## Titre

```text
Quel process vous fait perdre du temps chaque semaine ?
```

## Texte

```text
Décrivez-moi simplement comment il fonctionne aujourd’hui.

Je vous dirai ce qui mérite d’être automatisé, ce qui doit rester humain et si l’IA apporte réellement quelque chose.
```

## CTA

```text
Identifier un workflow à automatiser
```

## CTA secondaire

```text
M’écrire directement
```

---

# 18. Formulaire de contact

Si le formulaire peut être modifié simplement, préférer les champs suivants :

```text
Nom
Email professionnel
Entreprise
Quel processus souhaitez-vous améliorer ?
Comment fonctionne-t-il aujourd’hui ?
Optionnel : combien de fois ce process se répète-t-il ?
```

Éviter un long formulaire “budget / deadline / type de prestation” dès la première interaction.

CTA :

```text
Décrire mon workflow
```

---

# 19. SEO

## Homepage title

```text
Simon Jouan — Développeur IA & Full Stack | Automatisation métier
```

Alternative plus descriptive :

```text
Simon Jouan — Systèmes IA, agents & automatisation métier
```

## Meta description

```text
Développeur Full Stack spécialisé en systèmes IA et automatisation métier. Agents IA, intégrations, applications sur mesure et workflows mis en production.
```

## Services title

```text

 succeeded in 0ms:
### Story 12.6: Page À propos, CTA d'inspection de workflow, formulaire & SEO site-wide

As a prospect souhaitant vérifier la crédibilité du profil et initier une demande ciblée,
I want comprendre le lien entre le parcours qualité/métrologie de Simon et la robustesse de ses systèmes IA, et pouvoir qualifier mon workflow dans le formulaire,
So that j'envoie une demande précise et pertinente (FR33, FR34, FR35, FR36, NFR15, NFR16, UX-DR31).

**Acceptance Criteria:**

**Given** les pages `app/pages/about.vue`, `app/pages/contact/index.vue`, le layout global et les métadonnées SEO
**When** on navigue sur le site
**Then** la page À propos (`/about`) :
  - Présente le titre `Développeur Full Stack spécialisé en systèmes IA & automatisation métier`
  - Relie les 12 ans de métrologie industrielle et l'expérience QA aux réflexes de fiabilité des systèmes IA (reproductibilité, gestion des cas limites, observabilité)
  - Expose le bloc philosophie (« Je ne pars pas de "où mettre de l'IA ?", je pars de "qu'est-ce qui prend du temps ?" »)
  - Mentionne l'expérience Linkizz dans le parcours selon les données réelles
**And** le CTA final présent sur les pages de conversion affiche :
  - Eyebrow : `$ ./workflow --inspect`
  - Titre : `Quel process vous fait perdre du temps chaque semaine ?`
  - Texte d'accompagnement orienté diagnostic pragmatique
  - Boutons d'action `Identifier un workflow à automatiser` (vers `/contact`) et `M’écrire directement`
**And** le formulaire de contact (`/contact`) est orienté qualification de workflow (champs processus à améliorer, fonctionnement actuel, répétition)
**And** `usePageSeo` met à jour les balises de titres (`Simon Jouan — Systèmes IA, agents & automatisation métier`), descriptions et métadonnées canoniques/OpenGraph sur l'ensemble des 13 routes
**And** la suite de validation Docker complète (`pnpm lint && pnpm typecheck && pnpm generate`) réussit avec 0 erreur (0 ESLint/Stylelint, 0 typecheck TypeScript, 13 routes statiques pré-rendues).




exec
/bin/zsh -lc "sed -n '1,220p' app/pages/about.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <main class="about">
    <!-- Hero À-propos : portrait + identité (colonne gauche) + bio + stack (colonne droite).
         Porté de About.jsx (section hero) : recréation Vue 3 + tokens, aucune copie JSX.
         La section CV (expériences + formation) suit dans une <section--sunken> (story 5.2). -->
    <section class="section">
      <div class="container">
        <div class="about__grid">
          <!-- Colonne gauche : portrait, identité, localisation, CTA -->
          <div class="about__identity">
            <ZAvatar src="/images/portrait.jpeg" :alt="profile.name" initials="SJ" size="xl" ring />
            <h1 class="about__name">{{ profile.name }}</h1>
            <p class="about__role">{{ profile.role }}</p>
            <p class="prose about__location">
              <ZIcon name="pin" class="about__pin" />
              {{ profile.city }}
            </p>
            <div class="about__cta">
              <ZButton :as="NuxtLink" to="/contact" variant="primary">Me contacter</ZButton>
              <ZButton as="a" :href="`mailto:${profile.email}`" variant="secondary">M'écrire</ZButton>
            </div>
          </div>

          <!-- Colonne droite : eyebrow + bio (1re personne, emphases sur les technologies) + bloc philosophie + stack -->
          <div class="about__bio">
            <h2 class="eyebrow"><span aria-hidden="true">// </span>à propos</h2>
            <p class="prose about__para">
              Je développe des produits et applications depuis plusieurs années, avec un parcours un peu atypique :
              <strong>douze ans dans la métrologie industrielle</strong> avant de passer au logiciel.
            </p>
            <p class="prose about__para">
              Cette première carrière m’a donné des réflexes qui me suivent encore aujourd’hui :
              <strong>mesurer, tracer, vérifier</strong> et ne pas considérer qu’un système est fiable simplement parce
              qu’il fonctionne une fois.
            </p>
            <p class="prose about__para">
              Aujourd’hui, je combine <strong>développement Full Stack</strong>, <strong>culture QA</strong> et
              <strong>IA appliquée</strong> pour transformer des processus métier manuels en systèmes logiciels
              réellement exploitables.
            </p>

            <!-- Bloc philosophie d'intervention (AC-1) -->
            <div class="about__philosophy">
              <p class="about__philo-intro">Je ne pars pas de « où mettre de l'IA ? ».</p>
              <p class="about__philo-lead">Je pars de :</p>
              <ul class="about__philo-list">
                <li>qu’est-ce qui prend du temps ?</li>
                <li>qu’est-ce qui se répète ?</li>
                <li>où l’information se perd-elle ?</li>
                <li>où une personne doit-elle recopier, rechercher ou interpréter ?</li>
                <li>qu’est-ce qui doit absolument rester sous contrôle humain ?</li>
              </ul>
              <p class="about__philo-outro">Ensuite seulement vient la solution technique.</p>
            </div>

            <!-- Stack technique (story 5.2) — sous la bio, conforme à About.jsx. ZTag = pill.
                 Liste sémantique (<ul>/<li>) pour annonce « liste de N éléments » aux lecteurs d'écran. -->
            <div class="about__stack">
              <h2 class="eyebrow eyebrow--muted"><span aria-hidden="true">// </span>stack</h2>
              <ul class="hero__tags">
                <li v-for="skill in skills" :key="skill">
                  <ZTag>{{ skill }}</ZTag>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section CV (story 5.2) : timeline d'expériences (gauche) + formation (droite).
         Porté de About.jsx (2e section--sunken), grille 1.4fr / 0.6fr. -->
    <section class="section section--sunken">
      <div class="container">
        <div class="about__cv">
          <!-- Colonne gauche : timeline d'expériences (la plus récente en haut).
               <ol> : séquence chronologique annoncée comme liste ordonnée aux lecteurs d'écran. -->
          <div>
            <h2 class="eyebrow"><span aria-hidden="true">// </span>expériences</h2>
            <ol class="tl">
              <li v-for="xp in experiences" :key="xp.org" class="tl__item">
                <div class="tl__date">{{ xp.date }}</div>
                <div class="tl__role">{{ xp.role }}</div>
                <div class="tl__org">{{ xp.org }}</div>
                <div class="tl__desc">{{ xp.desc }}</div>
              </li>
            </ol>
          </div>

          <!-- Colonne droite : formation (une ZCard par diplôme), liste sémantique <ul>/<li>. -->
          <div>
            <h2 class="eyebrow"><span aria-hidden="true">// </span>formation</h2>
            <ul class="about__degrees">
              <li v-for="degree in degrees" :key="degree.name">
                <ZCard padded>
                  <div class="tl__date">{{ degree.date }}</div>
                  <div class="about__degree-name">{{ degree.name }}</div>
                  <div class="tl__org">{{ degree.school }}</div>
                </ZCard>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Page À-propos — hero portrait + bio + stack (story 5.1/5.2) puis section CV
// (timeline d'expériences + formation, story 5.2). Porté de About.jsx du UI kit :
// hero 2 colonnes (0.8fr identité / 1.2fr bio), section CV 2 colonnes (1.4fr / 0.6fr),
// stack en <ZTag>, formation en <ZCard>. Dark-first, tokens uniquement, prerender-safe.
import { NuxtLink } from "#components";
import { SITE } from "~/data/site";

// Identité + stack — source unique `app/data/site.ts`.
const profile = SITE.profile;
const skills = SITE.skills;

// Expériences (de la plus récente à la plus ancienne).
// `org` sert de clé v-for stable (unique).
const experiences = [
  {
    date: "02/2021 — aujourd'hui",
    role: "Testeur QA & Développeur TypeScript",
    org: "Linkizz",
    desc: "Tests automatisés, fiabilisation applicative et conception de systèmes résilients — Node.js, TypeScript, TestCafé. L'expérience QA influence directement la conception d'agents fiables : reproductibilité, cas limites, observabilité.",
  },
  {
    date: "05/2020 — 12/2021",
    role: "Développeur Full Stack",
    org: "CINS",
    desc: "Développement d'applications web, APIs et intégrations sur-mesure, Docker.",
  },
  {
    date: "07/2007 — 05/2019",
    role: "Métrologue",
    org: "A+ Métrologie / Trescal",
    desc: "Technicien métrologue multi-grandeur, suppléant COFRAC électricité-magnétisme. 12 ans de métrologie industrielle : rigueur de mesure, traçabilité et validation méthodologique.",
  },
];

// Formation (data.js → S.degrees). `name` sert de clé v-for stable (unique).
const degrees = [
  { date: "2017 — 2018", name: "Développeur d'application — PHP / Symfony", school: "OpenClassrooms" },
  { date: "1999 — 2001", name: "BTS CIRA", school: "Lycée A. de Tocqueville, Cherbourg" },
];

// Métadonnées de la page. Voix 1re personne cohérente (cf. contrainte Langue & voix).
const pageTitle = "À propos — Simon Jouan";
const pageDescription =
  "Développeur Full Stack spécialisé en systèmes IA et automatisation métier. Parcours métrologie, culture QA et ingénierie logicielle au service de la fiabilité.";

const siteUrl = useSiteUrl();
const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: pageTitle,
  url: `${siteUrl}/about`,
  mainEntity: {
    "@type": "Person",
    name: SITE.profile.name,
    jobTitle: SITE.profile.role,
    url: siteUrl,
    image: `${siteUrl}/images/portrait.jpeg`,
    email: SITE.profile.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.profile.city,
      addressCountry: "FR",
    },
  },
};

usePageSeo({
  title: pageTitle,
  description: pageDescription,
  path: "/about",
  image: "/images/portrait.jpeg",
  type: "profile",
  twitterCard: "summary",
  jsonLd: aboutJsonLd,
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / About.jsx */
// .section / .container / .eyebrow / .prose / .hero__tags sont des primitives de
// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
.about {
  display: block;
}

// Les libellés de section sont des <h2> (outline a11y navigable au lecteur d'écran),
// stylés en eyebrow. Neutralise le poids et l'interligne propres au <h2> pour un
// rendu strictement identique au <p class="eyebrow"> initial (line-height: inherit
// reproduit l'héritage du corps, comme le ferait un <p>).
.eyebrow {
  font-weight: var(--fw-regular);
  line-height: inherit;
}

// ---- Grille du hero (porté de About.jsx : grid-2 + gridTemplateColumns "0.8fr 1.2fr") ----
.about__grid {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  align-items: start;
  gap: var(--space-6);
}

// ---- Colonne gauche : identité ----
.about__name {
  margin: var(--space-5) 0 var(--space-1);
  font-family: var(--font-mono);
  font-size: var(--fs-3xl);
  font-weight: var(--fw-regular);
  line-height: var(--lh-tight);
  color: var(--text-strong);
}

exec
/bin/zsh -lc "sed -n '1,220p' app/composables/usePageSeo.ts" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "sed -n '1085,1135p' docs/jouan-ovh-offre-v1-brief-codex.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
```text
Agents IA & automatisation de processus métier — Simon Jouan
```

## About title

```text
Simon Jouan — Développeur Full Stack spécialisé IA
```

Ne pas utiliser de claims non prouvés comme :

- meilleur ;
- expert n°1 ;
- leader ;
- IA révolutionnaire ;
- ROI garanti.

---

# 20. Stack et mots-clés

Le stack reste visible, mais après la valeur métier.

Priorité :

- TypeScript ;
- Node.js ;
- NestJS ;
- Nuxt ;
- Vue ;
- PostgreSQL ;
- REST APIs ;
- Docker ;
- MCP ;
- LLM APIs ;
- Mistral ;
- Claude ;
- Tauri ;
- Rust ;
- tests automatisés ;
- QA.

Ne pas laisser WordPress / PHP / Symfony disparaître du parcours si historiquement utile, mais ne plus les mettre en avant dans la proposition principale.

---

# 21. Ton rédactionnel

Le ton doit rester :


 succeeded in 0ms:
import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { useSiteUrl } from "./useSiteUrl";

export interface PageSeoOptions {
  /** Titre de la page (utilisé pour <title> et par défaut og:title, twitter:title). */
  title: string;
  /** Titre optionnel spécifique pour Open Graph et Twitter (ex. titre d'article sans suffixe). */
  ogTitle?: string;
  /** Description de la page (utilisée pour <meta name="description">, og:description, twitter:description). */
  description: string;
  /** Chemin relatif de la page (ex. "/" ou "/services" ou "/blog/slug"). Si omis, résolu sur siteUrl. */
  path?: string;
  /** Chemin relatif ou absolu de l'image OG/Twitter (ex. "/images/portrait.jpeg"). Résolue en URL absolue. */
  image?: string;
  /** Texte alternatif pour l'image OG/Twitter (og:image:alt, twitter:image:alt). */
  imageAlt?: string;
  /** Type Open Graph : "website" (défaut), "article" ou "profile". */
  type?: "website" | "article" | "profile";
  /** Format Twitter Card : si omis, "summary_large_image" si type article avec image, sinon "summary". */
  twitterCard?: "summary" | "summary_large_image";
  /** Données JSON-LD (objet Schema.org ou tableau d'objets) injectées via jsonLdScript. */
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

/**
 * Composable centralisant la déclaration des métadonnées SEO par page :
 * <title>, canonical, description, Open Graph (type, title, desc, url, image, alt)
 * et Twitter Card (card, title, desc, image, alt) + JSON-LD échappé.
 *
 * Résout automatiquement les URLs absolues à partir de `useSiteUrl()` (runtimeConfig).
 */
export function usePageSeo(options: MaybeRefOrGetter<PageSeoOptions | undefined | null>): void {
  const siteUrl = useSiteUrl();

  const seo = computed(() => {
    const opts = toValue(options);
    if (!opts) {
      return null;
    }

    const rawPath = opts.path ?? "";
    const cleanPath = rawPath === "" || rawPath === "/" ? "" : rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
    const canonicalUrl = cleanPath ? `${siteUrl}${cleanPath}` : siteUrl;

    let imageUrl: string | undefined;
    if (opts.image) {
      imageUrl = /^https?:\/\//i.test(opts.image)
        ? opts.image
        : `${siteUrl}${opts.image.startsWith("/") ? opts.image : `/${opts.image}`}`;
    }

    const type = opts.type ?? "website";
    const twitterCard = opts.twitterCard ?? (imageUrl && type === "article" ? "summary_large_image" : "summary");

    return {
      title: opts.title,
      ogTitle: opts.ogTitle ?? opts.title,
      description: opts.description,
      canonicalUrl,
      imageUrl,
      imageAlt: opts.imageAlt,
      type,
      twitterCard,
      jsonLd: opts.jsonLd,
    };
  });

  useHead(() => {
    if (!seo.value) {
      return {};
    }

    const scripts: Array<{ type: string; innerHTML: string }> = [];
    if (seo.value.jsonLd) {
      if (Array.isArray(seo.value.jsonLd)) {
        for (const item of seo.value.jsonLd) {
          scripts.push(jsonLdScript(item));
        }
      } else {
        scripts.push(jsonLdScript(seo.value.jsonLd));
      }
    }

    return {
      title: seo.value.title,
      link: [{ rel: "canonical", href: seo.value.canonicalUrl }],
      script: scripts,
    };
  });

  useSeoMeta({
    title: () => seo.value?.title,
    description: () => seo.value?.description,
    ogTitle: () => seo.value?.ogTitle,
    ogDescription: () => seo.value?.description,
    ogUrl: () => seo.value?.canonicalUrl,
    ogType: () => seo.value?.type,
    ogImage: () => seo.value?.imageUrl,
    ogImageAlt: () => seo.value?.imageAlt,
    twitterCard: () => seo.value?.twitterCard,
    twitterTitle: () => seo.value?.ogTitle,
    twitterDescription: () => seo.value?.description,
    twitterImage: () => seo.value?.imageUrl,
    twitterImageAlt: () => seo.value?.imageAlt,
  });
}

exec
/bin/zsh -lc "sed -n '620,760p' docs/implementation-artifacts/code-reviews/12-6/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     - Sous-titre : `Décrivez-moi simplement comment il fonctionne aujourd’hui. Je vous dirai ce qui mérite d’être automatisé, ce qui doit rester humain et si l’IA apporte réellement quelque chose.`
     - CTA 1 : `Identifier un workflow à automatiser` (vers `/contact`) avec icône flèche droite
     - CTA 2 : `M’écrire directement` (vers `mailto:simon@jouan.ovh`)
-  - [ ] Dans `app/pages/blog/[...slug].vue`, harmoniser le CTA de fin d'article pour orienter vers la qualification de workflow.
+  - [x] Dans `app/pages/blog/[...slug].vue`, harmoniser le CTA de fin d'article pour orienter vers la qualification de workflow.
 
-- [ ] Tâche 3 — Réorientation du formulaire de contact vers la qualification de workflow (`app/pages/contact/index.vue`) (AC: 3, 5)
-  - [ ] Adapter l'en-tête et l'introduction de la page : `Parlons de votre workflow` et message d'accueil orienté gain de temps/process.
-  - [ ] Mettre à jour l'interface `ContactForm` :
+- [x] Tâche 3 — Réorientation du formulaire de contact vers la qualification de workflow (`app/pages/contact/index.vue`) (AC: 3, 5)
+  - [x] Adapter l'en-tête et l'introduction de la page : `Parlons de votre workflow` et message d'accueil orienté gain de temps/process.
+  - [x] Mettre à jour l'interface `ContactForm` :
     - `name: string`
     - `email: string`
     - `company: string`
     - `workflow: string` (Quel processus souhaitez-vous améliorer ?)
     - `currentState: string` (Comment fonctionne-t-il aujourd’hui ?)
     - `frequency?: string` (Combien de fois ce process se répète-t-il ?)
-  - [ ] Adapter le template du formulaire avec les composants `ZInput` (champs texte et multiligne) et les attributs d'accessibilité.
-  - [ ] Modifier le bouton de soumission : `Décrire mon workflow`.
-  - [ ] Adapter la fonction de validation `validate()` et l'envoi vers l'API Web3Forms (`body` avec clés explicites `name`, `email`, `company`, `workflow`, `current_state`, `frequency`, `message`).
-  - [ ] Mettre à jour le texte RGPD d'information sous le formulaire.
-
-- [ ] Tâche 4 — Harmonisation SEO transverse site-wide (`usePageSeo`) (AC: 4)
-  - [ ] Mettre à jour le titre et la description dans `app/pages/index.vue` : `Simon Jouan — Systèmes IA, agents & automatisation métier`.
-  - [ ] Mettre à jour le titre et la description dans `app/pages/about.vue`.
-  - [ ] Mettre à jour le titre et la description dans `app/pages/contact/index.vue` : `Contact — Simon Jouan`.
-  - [ ] Mettre à jour le titre dans `app/pages/blog/index.vue` : `Blog — Simon Jouan`.
-  - [ ] Vérifier et unifier les métadonnées dans `app/pages/confidentialite.vue` et `app/pages/mentions-legales.vue`.
-
-- [ ] Tâche 5 — Styles SCSS, responsive et accessibilité (AC: 5)
-  - [ ] Styliser le bloc philosophie sur `/about` en utilisant les tokens du Design System (`--bg-surface`, `--border-subtle`, `--accent`).
-  - [ ] Vérifier la disposition responsive du formulaire de contact sur mobile et desktop.
-  - [ ] Contrôler les contrastes, le focus visible (`:focus-visible`) et l'absence totale d'emoji.
-
-- [ ] Tâche 6 — Validation qualité Docker (AC: 6)
-  - [ ] Exécuter la gate de validation complète : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
-  - [ ] Vérifier 0 erreur ESLint / Stylelint, 0 erreur vue-tsc et la génération SSG Nitro sans avertissement.
+  - [x] Adapter le template du formulaire avec les composants `ZInput` (champs texte et multiligne) et les attributs d'accessibilité.
+  - [x] Modifier le bouton de soumission : `Décrire mon workflow`.
+  - [x] Adapter la fonction de validation `validate()` et l'envoi vers l'API Web3Forms (`body` avec clés explicites `name`, `email`, `company`, `workflow`, `current_state`, `frequency`, `message`).
+  - [x] Mettre à jour le texte RGPD d'information sous le formulaire.
+
+- [x] Tâche 4 — Harmonisation SEO transverse site-wide (`usePageSeo`) (AC: 4)
+  - [x] Mettre à jour le titre et la description dans `app/pages/index.vue` : `Simon Jouan — Systèmes IA, agents & automatisation métier`.
+  - [x] Mettre à jour le titre et la description dans `app/pages/about.vue`.
+  - [x] Mettre à jour le titre et la description dans `app/pages/contact/index.vue` : `Contact — Simon Jouan`.
+  - [x] Mettre à jour le titre dans `app/pages/blog/index.vue` : `Blog — Simon Jouan`.
+  - [x] Vérifier et unifier les métadonnées dans `app/pages/confidentialite.vue` et `app/pages/mentions-legales.vue`.
+
+- [x] Tâche 5 — Styles SCSS, responsive et accessibilité (AC: 5)
+  - [x] Styliser le bloc philosophie sur `/about` en utilisant les tokens du Design System (`--bg-surface`, `--border-subtle`, `--accent`).
+  - [x] Vérifier la disposition responsive du formulaire de contact sur mobile et desktop.
+  - [x] Contrôler les contrastes, le focus visible (`:focus-visible`) et l'absence totale d'emoji.
+
+- [x] Tâche 6 — Validation qualité Docker (AC: 6)
+  - [x] Exécuter la gate de validation complète : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
+  - [x] Vérifier 0 erreur ESLint / Stylelint, 0 erreur vue-tsc et la génération SSG Nitro sans avertissement.
+
+## Dev Agent Record
+
+### Implementation Plan
+- **Tâche 1 (Page À propos) :** Refonte de la bio (`about.vue`) avec mise en avant du parcours métrologie industrielle (12 ans) et culture QA au service de la robustesse des systèmes IA. Insertion du bloc philosophie d'intervention stylisé avec les tokens DS. Mise à jour de la timeline d'expériences (Linkizz et A+ Métrologie / Trescal) et alignement de `aboutJsonLd.addressLocality`.
+- **Tâche 2 (CTA final global) :** Refonte du CTA final sur `index.vue` avec le prompt `./workflow --inspect`, le H2 ciblant le gain de temps hebdomadaire et les boutons d'action. Harmonisation du CTA de fin d'article dans `blog/[...slug].vue`.
+- **Tâche 3 (Formulaire de contact) :** Transformation du formulaire sur `contact/index.vue` en formulaire de qualification de workflow métier (Nom, Email pro, Entreprise, Processus à améliorer, Fonctionnement actuel, Fréquence). Validation reactive et payload Web3Forms enrichi.
+- **Tâche 4 (SEO site-wide) :** Harmonisation des titres, méta-descriptions et JSON-LD Schema.org sur toutes les pages (`/`, `/about`, `/contact`, `/blog`, `/blog/[...slug]`, `/confidentialite`, `/mentions-legales`, `/contact/card`).
+- **Tâche 5 & 6 (Styles, a11y & Validation) :** Validation rigoureuse des tokens DS, de l'accessibilité a11y et exécution de la gate complète Docker (0 erreur ESLint, 0 erreur vue-tsc, build statique SSG Nitro de 24 routes / assets réussi).
+
+### Completion Notes
+- Page À propos (`about.vue`) refondue conformément à la charte et au brief : bio officielle, bloc philosophie d'intervention, valorisation de la QA (Linkizz) et de la métrologie dans la timeline.
+- CTA final sur `index.vue` et `blog/[...slug].vue` aligné sur `./workflow --inspect` et l'orientation gain de temps opérationnel.
+- Formulaire de contact (`contact/index.vue`) adapté pour la qualification de flux avec conservation du honeypot, focus accessible sur erreurs et transmission des champs détaillés à Web3Forms.
+- Titres SEO, descriptions et données structurées unifiés sur toutes les routes du site.
+- Validation Docker 100% verte : ESLint/Stylelint sans erreur, vérification de types TypeScript vue-tsc validée, pré-rendu statique SSG Nitro réussi.
+
+## File List
+
+- [MODIFY] [app/pages/about.vue](file:///Users/simon/dev/jouan.ovh/app/pages/about.vue)
+- [MODIFY] [app/pages/contact/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/contact/index.vue)
+- [MODIFY] [app/pages/contact/card.vue](file:///Users/simon/dev/jouan.ovh/app/pages/contact/card.vue)
+- [MODIFY] [app/pages/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue)
+- [MODIFY] [app/pages/blog/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/blog/index.vue)
+- [MODIFY] [app/pages/blog/[...slug].vue](file:///Users/simon/dev/jouan.ovh/app/pages/blog/%5B...slug%5D.vue)
+- [MODIFY] [app/pages/confidentialite.vue](file:///Users/simon/dev/jouan.ovh/app/pages/confidentialite.vue)
+- [MODIFY] [app/pages/mentions-legales.vue](file:///Users/simon/dev/jouan.ovh/app/pages/mentions-legales.vue)
+- [MODIFY] [docs/implementation-artifacts/sprint-status.yaml](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/sprint-status.yaml)
+- [MODIFY] [docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md)
+
+## Change Log
+
+- 2026-09-16 : Implémentation complète de la Story 12.6 — Refonte de la page À propos avec bloc philosophie et timeline métrologie/QA, CTA d'inspection de workflow sur la Homepage et le Blog, formulaire de qualification de workflow sur Contact, et harmonisation transverse du SEO et des données structurées Schema.org sur l'ensemble des 13 routes statiques. Gate Docker (lint, typecheck, SSG) verte à 100%.
 
 ## Dev Notes
 
@@ -133,15 +166,6 @@ so that j'envoie une demande précise et pertinente (FR33, FR34, FR35, FR36, NFR
 - **Zéro Emoji :** Règle stricte NFR6 / NFR13.
 - **Formulaire Web3Forms :** Conserve la clé injectée via `useRuntimeConfig().public.web3formsAccessKey`. Web3Forms accepte n'importe quelles propriétés additionnelles dans le corps JSON et les retransmet dans le corps du courriel.
 
-### Fichiers concernés
-- [MODIFY] [app/pages/about.vue](file:///Users/simon/dev/jouan.ovh/app/pages/about.vue)
-- [MODIFY] [app/pages/contact/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/contact/index.vue)
-- [MODIFY] [app/pages/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue)
-- [MODIFY] [app/pages/blog/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/blog/index.vue)
-- [MODIFY] [app/pages/blog/[...slug].vue](file:///Users/simon/dev/jouan.ovh/app/pages/blog/%5B...slug%5D.vue)
-- [MODIFY] [app/pages/confidentialite.vue](file:///Users/simon/dev/jouan.ovh/app/pages/confidentialite.vue)
-- [MODIFY] [app/pages/mentions-legales.vue](file:///Users/simon/dev/jouan.ovh/app/pages/mentions-legales.vue)
-
 ### Ce qui doit être préservé
 - Le fonctionnement du honeypot anti-spam (`honeypot` invisible pour les humains) sur le formulaire de contact.
 - L'annonce accessible `role="status"` et le focus sur la confirmation d'envoi.
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index d241058..78a6268 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -134,5 +134,5 @@ development_status:
   12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur: done
   12-4-homepage-vitrine-des-3-projets-phares: done
   12-5-page-services-restructuration-des-offres-et-process-4-etapes: done
-  12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide: ready-for-dev
+  12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide: review
   epic-12-retrospective: optional

codex
Le reste du formulaire et du JSON-LD tient plutôt bien les contraintes principales : labels explicites, `required`, payload lisible, `addressLocality` depuis `SITE.profile.city`. Les écarts restants se concentrent surtout sur la complétude des blocs imposés et une formulation officielle légèrement altérée.
exec
/bin/zsh -lc 'rg -n "article__cta|Un process|Identifier un workflow|workflow --inspect|philo-intro|philo-lead|build statique SSG Nitro de 24|13 routes" docs/implementation-artifacts/code-reviews/12-6/full.diff' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
39:+              <p class="about__philo-intro">Je ne pars pas de « où mettre de l'IA ? ».</p>
40:+              <p class="about__philo-lead">Je pars de :</p>
134:+.about__philo-intro {
142:+.about__philo-lead {
195:           <div class="article__cta">
196:-            <span class="article__cta-label">Un projet en tête ?</span>
197:+            <span class="article__cta-label">Un process vous fait perdre du temps ?</span>
200:+              Identifier un workflow
516:+          <p class="eyebrow cta__eyebrow"><span aria-hidden="true">$ </span>./workflow --inspect</p>
531:+              Identifier un workflow à automatiser
618:     - Eyebrow : `<span aria-hidden="true">$ </span>./workflow --inspect`
621:     - CTA 1 : `Identifier un workflow à automatiser` (vers `/contact`) avec icône flèche droite
683:+- **Tâche 2 (CTA final global) :** Refonte du CTA final sur `index.vue` avec le prompt `./workflow --inspect`, le H2 ciblant le gain de temps hebdomadaire et les boutons d'action. Harmonisation du CTA de fin d'article dans `blog/[...slug].vue`.
686:+- **Tâche 5 & 6 (Styles, a11y & Validation) :** Validation rigoureuse des tokens DS, de l'accessibilité a11y et exécution de la gate complète Docker (0 erreur ESLint, 0 erreur vue-tsc, build statique SSG Nitro de 24 routes / assets réussi).
690:+- CTA final sur `index.vue` et `blog/[...slug].vue` aligné sur `./workflow --inspect` et l'orientation gain de temps opérationnel.
710:+- 2026-09-16 : Implémentation complète de la Story 12.6 — Refonte de la page À propos avec bloc philosophie et timeline métrologie/QA, CTA d'inspection de workflow sur la Homepage et le Blog, formulaire de qualification de workflow sur Contact, et harmonisation transverse du SEO et des données structurées Schema.org sur l'ensemble des 13 routes statiques. Gate Docker (lint, typecheck, SSG) verte à 100%.

exec
/bin/zsh -lc "rg -n \"Je ne pars pas|CTA Final Global|Quel process|M’écrire directement|Décrire mon workflow|Homepage \\("'`/`'"\\)|Services \\("'`/services`'"\\)\" docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md docs/specs/spec-repositionnement-ia/messaging-matrix.md docs/jouan-ovh-offre-v1-brief-codex.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
zsh:1: permission denied: /
zsh:1: no such file or directory: /services
docs/jouan-ovh-offre-v1-brief-codex.md:965:Je ne pars pas de “où mettre de l’IA ?”.
docs/jouan-ovh-offre-v1-brief-codex.md:1015:Quel process vous fait perdre du temps chaque semaine ?
docs/jouan-ovh-offre-v1-brief-codex.md:1035:M’écrire directement
docs/jouan-ovh-offre-v1-brief-codex.md:1048:Quel processus souhaitez-vous améliorer ?
docs/jouan-ovh-offre-v1-brief-codex.md:1058:Décrire mon workflow
docs/specs/spec-repositionnement-ia/messaging-matrix.md:70:### 4.4 CTA Final Global
docs/specs/spec-repositionnement-ia/messaging-matrix.md:72:- **H2 :** `Quel process vous fait perdre du temps chaque semaine ?`
docs/specs/spec-repositionnement-ia/messaging-matrix.md:75:- **CTA secondaire :** `M’écrire directement`
docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md:25:     - « Je ne pars pas de "où mettre de l'IA ?", je pars de : »
docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md:38:     - Le titre H2 : `Quel process vous fait perdre du temps chaque semaine ?`
docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md:41:     - Le CTA secondaire `<ZButton>` vers le contact direct (`mailto:` ou formulaire) : `M’écrire directement`.
docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md:50:     - Champ `Quel processus souhaitez-vous améliorer ?` (champ requis)
docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md:53:   **And** le bouton de soumission affiche l'intitulé `Décrire mon workflow`
docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md:90:    - H2 : `Quel process vous fait perdre du temps chaque semaine ?`
docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md:93:    - CTA 2 : `M’écrire directement` (vers `mailto:simon@jouan.ovh`)
docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md:102:    - `workflow: string` (Quel processus souhaitez-vous améliorer ?)
docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md:106:  - [x] Modifier le bouton de soumission : `Décrire mon workflow`.

codex
- **Blog article CTA is incomplete** — Violates AC2 / CAP-7. Evidence: `app/pages/blog/[...slug].vue` diff only changes the CTA label/button to `Un process vous fait perdre du temps ?` and `Identifier un workflow` (`full.diff:195-200`), but AC2 requires the full final CTA block: `$ ./workflow --inspect`, H2, body copy, primary CTA `Identifier un workflow à automatiser`, and secondary CTA `M’écrire directement`.

- **Official About philosophy wording is altered** — Violates AC1 / “bloc philosophie officiel”. Evidence: AC requires `Je ne pars pas de "où mettre de l'IA ?", je pars de :`; diff splits this into two sentences: `Je ne pars pas de « où mettre de l'IA ? ».` and `Je pars de :` (`full.diff:39-40`), so the official combined formulation is not preserved exactly.

- **Validation record contradicts required route count** — Violates AC6 evidence consistency. Evidence: AC6 requires 13 static routes, and the changelog claims 13 routes (`full.diff:710`), but the Dev Agent Record also claims `build statique SSG Nitro de 24 routes / assets réussi` (`full.diff:686`). This makes the validation evidence internally inconsistent.
tokens used
43 621
- **Blog article CTA is incomplete** — Violates AC2 / CAP-7. Evidence: `app/pages/blog/[...slug].vue` diff only changes the CTA label/button to `Un process vous fait perdre du temps ?` and `Identifier un workflow` (`full.diff:195-200`), but AC2 requires the full final CTA block: `$ ./workflow --inspect`, H2, body copy, primary CTA `Identifier un workflow à automatiser`, and secondary CTA `M’écrire directement`.

- **Official About philosophy wording is altered** — Violates AC1 / “bloc philosophie officiel”. Evidence: AC requires `Je ne pars pas de "où mettre de l'IA ?", je pars de :`; diff splits this into two sentences: `Je ne pars pas de « où mettre de l'IA ? ».` and `Je pars de :` (`full.diff:39-40`), so the official combined formulation is not preserved exactly.

- **Validation record contradicts required route count** — Violates AC6 evidence consistency. Evidence: AC6 requires 13 static routes, and the changelog claims 13 routes (`full.diff:710`), but the Dev Agent Record also claims `build statique SSG Nitro de 24 routes / assets réussi` (`full.diff:686`). This makes the validation evidence internally inconsistent.
