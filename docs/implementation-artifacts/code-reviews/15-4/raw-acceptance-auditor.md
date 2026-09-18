Reading prompt from stdin...
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: medium
reasoning summaries: none
session id: 01a0b65d-128b-7ed3-866a-8743bb02ff1b
--------
user
# Acceptance Auditor Prompt — Story 15.4

You are an Acceptance Auditor. Review the diff in `docs/implementation-artifacts/code-reviews/15-4/full.diff` against the story specification and project context:

- Story: `docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md`
- Context:
  - `AGENTS.md` (Docker rules, NFR6 zero emoji, SCSS tokens, usePageSeo, a11y, layout rules)
  - `docs/project-context.md`
  - `docs/jouan-ovh-offre-commerciale-v1.1-updated.md`
  - `docs/planning-artifacts/epics.md`
  - `docs/implementation-artifacts/sprint-status.yaml`
- Also inspect the audited application files referenced by the story:
  - `app/pages/contact/index.vue`
  - `app/pages/index.vue`
  - `app/pages/services.vue`
  - `app/pages/blog/[...slug].vue`
  - `app/composables/usePageSeo.ts`
  - `app/data/site.ts`

Check for:
- Violations of acceptance criteria (AC-1, AC-2, AC-3, AC-4, AC-5)
- Deviations from spec intent (Offre Commerciale V1.1)
- Missing implementation of specified behavior or unverified assertions
- Inconsistencies or visual regressions in design system and typography (dark & light themes)
- Contradictions between spec constraints and actual code or metadata

Output findings as a Markdown list. Each finding must include:
- A one-line title
- Which AC or architectural constraint it violates
- Evidence from the diff, code files, and references

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise la compétence de revue de code pour structurer l’audit adversarial, puis je comparerai le diff aux critères AC et aux invariants du dépôt. Je vais rester en lecture seule et fournir uniquement les findings vérifiables.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/r0/bmad-code-review/SKILL.md && printf '\\n---FILES---\\n' && printf '%s\\n' docs/implementation-artifacts/code-reviews/15-4/full.diff docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md docs/project-context.md docs/jouan-ovh-offre-commerciale-v1.1-updated.md docs/planning-artifacts/epics.md docs/implementation-artifacts/sprint-status.yaml app/pages/contact/index.vue app/pages/index.vue app/pages/services.vue 'app/pages/blog/[...slug].vue' app/composables/usePageSeo.ts app/data/site.ts | xargs -n1 test -f" in /Users/simon/dev/jouan.ovh
 exited 1 in 0ms:
sed: /Users/simon/.codex/skills/r0/bmad-code-review/SKILL.md: No such file or directory

exec
/bin/zsh -lc "rg --files /Users/simon/.codex/skills /Users/simon/dev/jouan.ovh/.agents/skills | rg '/bmad-code-review/SKILL\\.md"'$|15-4|project-context|offre-commerciale|epics'"\\.md|sprint-status\\.yaml|full\\.diff|usePageSeo\\.ts|site\\.ts|index\\.vue"'$|services'"\\.vue"'$'"'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
/Users/simon/dev/jouan.ovh/.agents/skills/bmad-generate-project-context/project-context-template.md
/Users/simon/dev/jouan.ovh/.agents/skills/bmad-generate-project-context/customize.toml
/Users/simon/dev/jouan.ovh/.agents/skills/bmad-generate-project-context/SKILL.md
/Users/simon/dev/jouan.ovh/.agents/skills/bmad-generate-project-context/steps/step-02-generate.md
/Users/simon/dev/jouan.ovh/.agents/skills/bmad-generate-project-context/steps/step-01-discover.md
/Users/simon/dev/jouan.ovh/.agents/skills/bmad-generate-project-context/steps/step-03-complete.md
/Users/simon/dev/jouan.ovh/.agents/skills/bmad-create-epics-and-stories/steps/step-02-design-epics.md
/Users/simon/.codex/skills/bmad-create-epics-and-stories/steps/step-02-design-epics.md
/Users/simon/.codex/skills/bmad-code-review/SKILL.md
/Users/simon/.codex/skills/bmad-generate-project-context/project-context-template.md
/Users/simon/.codex/skills/bmad-generate-project-context/customize.toml
/Users/simon/.codex/skills/bmad-generate-project-context/SKILL.md
/Users/simon/dev/jouan.ovh/.agents/skills/bmad-code-review/SKILL.md
/Users/simon/.codex/skills/bmad-generate-project-context/steps/step-02-generate.md
/Users/simon/.codex/skills/bmad-generate-project-context/steps/step-01-discover.md
/Users/simon/.codex/skills/bmad-generate-project-context/steps/step-03-complete.md

exec
/bin/zsh -lc "sed -n '1,260p' /Users/simon/.codex/skills/bmad-code-review/SKILL.md; printf '\\n---STORY---\\n'; sed -n '1,280p' docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md; printf '\\n---DIFF---\\n'; sed -n '1,360p' docs/implementation-artifacts/code-reviews/15-4/full.diff" in /Users/simon/dev/jouan.ovh
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

---STORY---
---
baseline_commit: 7c84ab3d4ce0f562bd860a256a374aa980f52082
---

# Story 15.4: Cohérence Globale, SEO, Formulaire de Contact & Gate Docker Nitro SSG

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a développeur garantissant la qualité globale du projet jouan.ovh,
I want auditer l'ensemble des parcours, formulaires, balises SEO et valider la compilation statique Nitro,
so that le site soit exempt de régressions fonctionnelles, visuelles, d'accessibilité ou de dépositionnement commercial (FR52, NFR4, NFR6, CAP-4).

## Acceptance Criteria

1. **Given** l'ensemble des parcours de conversion de `jouan.ovh`
   **When** on audite le CTA final global (`app/pages/index.vue`, `app/pages/blog/[...slug].vue`) et la page de contact (`app/pages/contact/index.vue`)
   **Then** le CTA final de conversion maintient l'accroche officielle :
     - Eyebrow : `<p class="eyebrow"><span aria-hidden="true">$ </span>./workflow --inspect</p>`
     - Titre : `Quel process vous fait perdre du temps chaque semaine ?`
     - Sous-titre : cadrage sur le fonctionnement du workflow sans aucune mention tarifaire bloquante.
   **And** le formulaire de contact dans `app/pages/contact/index.vue` qualifie le processus sans champ de budget obligatoire (questions centrées sur l'entreprise, la fréquence, le processus à améliorer et le fonctionnement actuel).
   **And** la chaîne d'envoi Web3Forms transmet l'objet qualifié (`subject: Qualification de workflow : ...`) et gère gracieusement le honeypot anti-spam ainsi que l'état d'envoi.

2. **Given** l'ensemble des 13 routes applicatives du site
   **When** on inspecte les métadonnées SEO OpenGraph/Twitter et les données structurées Schema.org injectées par `usePageSeo()`
   **Then** toutes les méta-descriptions et entités JSON-LD sont parfaitement alignées sur l'Offre Commerciale V1.1 (systèmes IA, automatisation de processus métier, offres sur devis, AI Care dès 250 € HT / mois, Blueprint dès 750 € HT).
   **And** aucune mention obsolète de l'ancien tarif d'entrée « 3 500 € HT » ou « 3500 » ne subsiste sur le site, ni dans le balisage HTML pré-rendu, ni dans les scripts, ni dans les données structurées.

3. **Given** la bascule de thème clair et sombre (acquis Epic 13)
   **When** les pages modifiées dans le cadre de l'Epic 15 (`app/pages/index.vue`, `app/pages/services.vue`, `app/pages/contact/index.vue`) sont affichées en mode sombre (`[data-theme="dark"]`) et en mode clair (`[data-theme="light"]`)
   **Then** le contraste de l'ensemble des textes, badges, icônes et boutons interactifs respecte le standard WCAG AA (ratio >= 4.5:1 pour le texte normal, >= 3:1 pour les composants d'interface).
   **And** tous les styles consomment exclusivement les tokens SCSS `var(--token)` du design system sans valeur arbitraire en dur non documentée.

4. **Given** la suite de validation de qualité du projet (Definition of Done)
   **When** la commande de contrôle Docker est exécutée
   **Then** la gate réussit avec 0 erreur ESLint, 0 erreur Stylelint, 0 erreur TypeScript `vue-tsc` et 28 routes statiques pré-rendues avec succès par Nitro :
     ```sh
     docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
     ```

5. **Given** la validation complète de la Story 15.4
   **When** tous les critères d'acceptation sont vérifiés
   **Then** l'Epic 15 (« Repositionnement Commercial V1.1 ») est prêt à être clôturé avec l'ensemble de ses stories (15.1, 15.2, 15.3, 15.4) au statut `done` dans `sprint-status.yaml`.

## Tasks / Subtasks

- [x] Tâche 1 — Audit et validation du CTA final global et du formulaire de contact (AC: 1)
  - [x] Vérifier le composant de CTA final dans `app/pages/index.vue` (L286-308) et `app/pages/blog/[...slug].vue` (L45-63) : accroche, terminal décoratif et redirection `/contact`.
  - [x] Vérifier `app/pages/contact/index.vue` : s'assurer de l'absence de champ budget, conformité du libellé de bouton « Décrire mon workflow », accessibilité a11y (focus premier champ invalide, honeypot masqué) et message de confirmation.
  - [x] Tester l'absence d'erreurs d'hydratation ou de validation réseau.

- [x] Tâche 2 — Audit transverse SEO, OpenGraph et données structurées Schema.org (AC: 2)
  - [x] Auditer `usePageSeo` sur toutes les routes statiques :
    - `/` (`app/pages/index.vue`)
    - `/services` (`app/pages/services.vue`)
    - `/about` (`app/pages/about.vue`)
    - `/contact` (`app/pages/contact/index.vue`)
    - `/contact/card` (`app/pages/contact/card.vue`)
    - `/blog` (`app/pages/blog/index.vue`)
    - `/confidentialite` (`app/pages/confidentialite.vue`)
    - `/mentions-legales` (`app/pages/mentions-legales.vue`)
  - [x] Vérifier l'alignement des objets JSON-LD (`WebPage`, `Service`, `ItemList`, `Person`, `ContactPage`, `ProfilePage`, `Blog`) sans prix d'entrée 3 500 € HT.
  - [x] Lancer une recherche grep globale sur `3 500`, `3500`, `490` pour garantir l'élimination totale de l'ancien catalogue dans `app/`.

- [x] Tâche 3 — Vérification du contraste thèmes Sombre & Clair et tokens SCSS (AC: 3)
  - [x] Contrôler visuellement et fonctionnellement les pages `services.vue`, `index.vue` et `contact/index.vue` sous les deux thèmes.
  - [x] Vérifier la lisibilité des badges (`<ZBadge>`), des cartes (`<ZCard>`), des bordures subtiles et de l'alternance de sections (`.section` / `.section--sunken`).
  - [x] S'assurer qu'aucun style scoped ne redéclare les primitives globales de layout (`.section`, `.container`, `.eyebrow`, `.prose`).

- [x] Tâche 4 — Exécution de la Gate Docker Nitro SSG et synchronisation de sprint (AC: 4, 5)
  - [x] Exécuter la commande Docker de validation :
    ```sh
    docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
    ```
  - [x] Vérifier que les 28 routes statiques compilent proprement dans `.output/public`.
  - [x] Mettre à jour `docs/implementation-artifacts/sprint-status.yaml` pour marquer la story 15.4 et l'epic-15.

## Dev Notes

### Contexte & Guardrails
- **Fichiers principaux à inspecter / valider :**
  - [`app/pages/contact/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/contact/index.vue)
  - [`app/pages/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue)
  - [`app/pages/services.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/services.vue)
  - [`app/pages/blog/[...slug].vue`](file:///Users/simon/dev/jouan.ovh/app/pages/blog/[...slug].vue)
  - [`app/composables/usePageSeo.ts`](file:///Users/simon/dev/jouan.ovh/app/composables/usePageSeo.ts)
- **Règle d'or Docker :** Ne JAMAIS lancer `pnpm` sur l'hôte macOS arm64.
- **Règle NFR6 :** Zéro emoji dans l'UI et le code. Utiliser les icônes vectorielles du composant `<ZIcon>`.
- **Règle Tokens :** Utiliser exclusivement `var(--token)`.
- **Règle Layout SCSS :** Ne pas redéclarer `.section`, `.section--sunken`, `.container`, `.eyebrow`, `.prose` dans les styles scoped.

### Inventaire des Pages et Appels usePageSeo
| Route | Fichier | Titre SEO | JSON-LD Type |
|-------|---------|-----------|--------------|
| `/` | `app/pages/index.vue` | Simon Jouan — Systèmes IA, agents & automatisation métier | WebSite, Person |
| `/services` | `app/pages/services.vue` | Services & Systèmes IA — Simon Jouan | WebPage, ItemList (4 Services) |
| `/about` | `app/pages/about.vue` | À propos — Simon Jouan | ProfilePage, Person |
| `/contact` | `app/pages/contact/index.vue` | Contact — Simon Jouan | ContactPage, Person |
| `/contact/card` | `app/pages/contact/card.vue` | Carte de visite — Simon Jouan | ProfilePage |
| `/blog` | `app/pages/blog/index.vue` | Notes de dev | Blog, BlogPosting[] |
| `/blog/:slug` | `app/pages/blog/[...slug].vue` | (Titre article) — Simon Jouan | BlogPosting |
| `/confidentialite` | `app/pages/confidentialite.vue` | Politique de confidentialité — Simon Jouan | WebPage |
| `/mentions-legales` | `app/pages/mentions-legales.vue` | Mentions légales — Simon Jouan | WebPage |

### References
- [Cahier des Epics : docs/planning-artifacts/epics.md#Story-15-4](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)
- [Sprint Change Proposal : docs/planning-artifacts/sprint-change-proposal-2026-09-18.md](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/sprint-change-proposal-2026-09-18.md)
- [Source de vérité Offre V1.1 : docs/jouan-ovh-offre-commerciale-v1.1-updated.md](file:///Users/simon/dev/jouan.ovh/docs/jouan-ovh-offre-commerciale-v1.1-updated.md)
- [Directives et Invariants : AGENTS.md](file:///Users/simon/dev/jouan.ovh/AGENTS.md)
- [Story précédente : docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md)

## Dev Agent Record

### Agent Model Used
Gemini 3.7 Flash

### Debug Log References
- Docker Quality Gate: `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> Exit code 0, 0 error lint/typecheck, 28 routes statiques pré-rendues.
- Grep checks: zéro occurrence de prix obsolètes (`3500`, `3 500`, `490`) dans l'arborescence `app/`.

### Completion Notes List
- Audit complet du CTA final et du formulaire de contact : conformité avec l'offre V1.1, absence de champ budget obligatoire, validation Web3Forms avec honeypot et a11y.
- Audit transverse SEO et Schema.org sur l'ensemble des 13 routes statiques de l'application via `usePageSeo()`.
- Vérification des contrastes thème sombre / thème clair et stricte consommation des tokens SCSS sans redéclaration des primitives globales de layout.
- Validation intégrale de la gate Docker (linting, vérification statique TypeScript, génération SSG Nitro 28 routes).

### File List
- `docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md`
- `docs/implementation-artifacts/sprint-status.yaml`

## Change Log
- 2026-09-18: Audit de cohérence globale, SEO, formulaire de contact et passage de la gate Docker Nitro SSG (Story 15.4 complétée et passée en review).

---DIFF---
diff --git a/app/pages/services.vue b/app/pages/services.vue
index 0c6e1e1..6d6a6eb 100644
--- a/app/pages/services.vue
+++ b/app/pages/services.vue
@@ -1,6 +1,6 @@
 <template>
   <main class="services">
-    <!-- En-tête + grille d'offres (story 12.5 & story 15.2) -->
+    <!-- En-tête + grille d'offres de build (story 12.5 & story 15.2) -->
     <section class="section">
       <div class="container">
         <p class="eyebrow"><span aria-hidden="true">// </span>services</p>
@@ -49,8 +49,59 @@
       </div>
     </section>
 
-    <!-- Section process : 4 étapes ordonnées + CTA (story 12.5) -->
-    <section class="section section--sunken">
+    <!-- Section AI Care : Maintien en condition opérationnelle (story 15.3) -->
+    <section class="section section--sunken care-section">
+      <div class="container">
+        <p class="eyebrow"><span aria-hidden="true">// </span>après la mise en production</p>
+        <h2 class="care-section__title">Le système doit continuer à fonctionner.</h2>
+        <p class="prose care-section__intro">
+          Une automatisation utile doit continuer à fonctionner après sa mise en production. AI Care couvre le maintien
+          en condition opérationnelle du système : monitoring, maintenance, support, suivi des coûts et adaptations
+          mineures liées aux APIs ou aux modèles.
+        </p>
+
+        <ZCard :id="careOffer.id" class="care-card">
+          <div class="care-card__info">
+            <div class="care-card__badge">
+              <ZBadge tone="neutral">{{ careOffer.badge }}</ZBadge>
+            </div>
+            <div class="care-card__icon"><ZIcon name="bot" /></div>
+            <h3 class="care-card__title">{{ careOffer.title }}</h3>
+            <p class="care-card__desc">{{ careOffer.desc }}</p>
+
+            <div class="care-card__footer">
+              <div class="care-card__price">
+                <b>{{ careOffer.price }}</b>
+              </div>
+              <p v-if="careOffer.disclaimer" class="care-card__disclaimer">
+                {{ careOffer.disclaimer }}
+              </p>
+              <div class="care-card__cta">
+                <ZButton
+                  :as="NuxtLink"
+                  to="/contact"
+                  variant="secondary"
+                  :aria-label="careOffer.ctaAriaLabel"
+                  class="care-card__btn"
+                >
+                  {{ careOffer.ctaText }}
+                </ZButton>
+              </div>
+            </div>
+          </div>
+
+          <div class="care-card__details">
+            <h4 class="care-card__points-title">Inclus dans l’accompagnement :</h4>
+            <ul class="care-card__points">
+              <li v-for="point in careOffer.points" :key="point">{{ point }}</li>
+            </ul>
+          </div>
+        </ZCard>
+      </div>
+    </section>
+
+    <!-- Section process : 4 étapes ordonnées + CTA (story 12.5 & story 15.3) -->
+    <section class="section">
       <div class="container">
         <p class="eyebrow"><span aria-hidden="true">// </span>comment ça se passe</p>
         <h2 class="process__title">Un déroulé simple en quatre temps</h2>
@@ -80,8 +131,8 @@
 </template>
 
 <script setup lang="ts">
-// Page Services : catalogue d'offres de build sur devis (3 niveaux d'intervention) + process 4 étapes + CTA contact.
-// Données statiques (3 offres, 4 étapes) déclarées localement. Prerender-safe, dark-first.
+// Page Services : catalogue d'offres de build sur devis + section dédiée AI Care + process 4 étapes + CTA contact.
+// Données statiques (3 offres de build, 1 offre de care, 4 étapes) déclarées localement. Prerender-safe, dark-first.
 import { NuxtLink } from "#components";
 import { SITE } from "~/data/site";
 
@@ -104,6 +155,18 @@ interface Offer {
   ctaAriaLabel: string;
 }
 
+interface CareOffer {
+  id: string;
+  badge: string;
+  title: string;
+  price: string;
+  desc: string;
+  points: string[];
+  disclaimer: string;
+  ctaText: string;
+  ctaAriaLabel: string;
+}
+
 interface Step {
   n: string;
   title: string;
@@ -178,12 +241,32 @@ const offers: Offer[] = [
   },
 ];
 
-// Étapes du process en 4 temps. L'ordre du tableau garantit l'affichage 01 → 04.
+// Offre de maintien en condition opérationnelle V1.1 (AI Care).
+const careOffer: CareOffer = {
+  id: "ai-care",
+  badge: "MAINTIEN EN CONDITION OPÉRATIONNELLE",
+  title: "AI Care",
+  price: "À partir de 250 € HT / mois",
+  desc: "Pour les systèmes qui ont besoin d'être exploités, surveillés et adaptés dans la durée.",
+  points: [
+    "Monitoring proactif, détection d'erreurs & alertes d'anomalies",
+    "Maintenance corrective & adaptation aux évolutions d'APIs tierces",
+    "Suivi fin de consommation des tokens & ajustements de prompts",
+    "Support technique réactif & veille sur les nouveaux modèles",
+    "Mesure factuelle des KPI et optimisation continue du flux",
+  ],
+  disclaimer:
+    "Consommations tierces d'APIs et tokens (LLM, OCR, scraping...) refacturées au réel ou prises en charge directement par le client. Pas d'engagement imposé au build.",
+  ctaText: "Découvrir AI Care",
+  ctaAriaLabel: "Découvrir l'accompagnement AI Care",
+};
+
+// Étapes du process en 4 temps (Offre V1.1). L'ordre du tableau garantit l'affichage 01 → 04.
 const steps: Step[] = [
   {
     n: "01",
     title: "Diagnostic",
-    desc: "Échange de 20 à 30 minutes pour qualifier le problème, comprendre le workflow existant et identifier les goulots d'étranglement.",
+    desc: "Échange gratuit de 20 à 30 minutes pour qualifier le problème, comprendre le workflow existant, ses volumes, ses outils et identifier la friction réelle.",
     inlineCta: {
       to: "/contact",
       label: "Identifier un workflow →",
@@ -192,17 +275,17 @@ const steps: Step[] = [
   {
     n: "02",
     title: "Cadrage",
-    desc: "Formalisation du workflow cible, des étapes manuelles à conserver sous contrôle humain, des connecteurs API requis et des KPI de mesure. Fait l'objet d'un Blueprint pour les sujets complexes.",
+    desc: "Définir la cible, ce qui doit être automatisé, ce qui reste humain et comment mesurer le résultat. Pour les sujets complexes, un Blueprint facturable (à partir de 750 € HT) peut être proposé lorsque le cadrage nécessite un travail approfondi avant devis.",
   },
   {
     n: "03",
     title: "Construction & intégration",
-    desc: "Développement logiciel du système, connexion aux outils métiers (CRM, ERP, messagerie...), couverture de tests automatisés et mise à l'épreuve sur cas réels avant livraison.",
+    desc: "Développer uniquement le niveau de système nécessaire (automatisation ciblée, workflow métier ou application sur mesure) et le tester sur des cas réels avant livraison.",
   },
   {
     n: "04",
-    title: "Suivi & amélioration",
-    desc: "Monitoring en production, maintenance préventive/corrective, ajustements aux évolutions d'APIs tierces ou modèles d'IA, mesure factuelle des résultats.",
+    title: "Exploitation & mesure",
+    desc: "Mise en production, mesure initiale de performance et maintien en condition opérationnelle lorsque le workflow le justifie (via AI Care).",
   },
 ];
 
@@ -217,24 +300,46 @@ const servicesJsonLd = {
   url: `${siteUrl}/services`,
   mainEntity: {
     "@type": "ItemList",
-    itemListElement: offers.map((offer, index) => ({
-      "@type": "ListItem",
-      position: index + 1,
-      item: {
-        "@type": "Service",
-        name: offer.title,
-        description: offer.desc,
-        provider: {
-          "@type": "Organization",
-          "@id": `${siteUrl}/#organization`,
-          name: SITE.profile.name,
+    itemListElement: [
+      ...offers.map((offer, index) => ({
+        "@type": "ListItem",
+        position: index + 1,
+        item: {
+          "@type": "Service",
+          name: offer.title,
+          description: offer.desc,
+          url: `${siteUrl}/services#${offer.id}`,
+          provider: {
+            "@type": "Organization",
+            "@id": `${siteUrl}/#organization`,
+            name: SITE.profile.name,
+          },
+          offers: {
+            "@type": "Offer",
+            description: offer.price,
+          },
         },
-        offers: {
-          "@type": "Offer",
-          description: offer.price,
+      })),
+      {
+        "@type": "ListItem",
+        position: offers.length + 1,
+        item: {
+          "@type": "Service",
+          name: careOffer.title,
+          description: careOffer.desc,
+          url: `${siteUrl}/services#${careOffer.id}`,
+          provider: {
+            "@type": "Organization",
+            "@id": `${siteUrl}/#organization`,
+            name: SITE.profile.name,
+          },
+          offers: {
+            "@type": "Offer",
+            description: careOffer.price,
+          },
         },
       },
-    })),
+    ],
   },
 };
 
@@ -399,6 +504,147 @@ usePageSeo({
   width: 100%;
 }
 
+// ---- Section AI Care (.care-section / .care-card*) ----
+.care-section__title {
+  max-width: 26ch;
+  margin-bottom: var(--space-3);
+  font-family: var(--font-mono);
+  font-size: var(--fs-3xl);
+  font-weight: var(--fw-regular);
+  line-height: var(--lh-tight);
+  color: var(--text-strong);
+}
+
+.care-section__intro {
+  max-width: 62ch;
+  margin-bottom: var(--space-8);
+  color: var(--text-muted);
+}
+
+.care-card {
+  display: grid;
+  grid-template-columns: 1fr 1fr;
+  gap: var(--space-8);
+  align-items: start;
+  scroll-margin-top: var(--space-16);
+}
+
+.care-card__info {
+  display: flex;
+  flex-direction: column;
+}
+
+.care-card__badge {
+  margin-bottom: var(--space-3);
+}
+
+.care-card__icon {
+  display: flex;
+  align-items: center;
+  justify-content: center;
+  width: var(--space-10); // 40px
+  height: var(--space-10);
+  margin-bottom: var(--space-4);
+
+  // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
+  // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
+  font-size: 22px;
+  color: var(--accent);
+  background: var(--accent-soft);
+  border-radius: var(--radius-md);
+}
+
+.care-card__title {
+  margin-bottom: var(--space-2);
+  font-family: var(--font-mono);
+  font-size: var(--fs-2xl);
+  font-weight: var(--fw-regular);
+  color: var(--text-strong);
+}
+
+.care-card__desc {
+  margin: 0 0 var(--space-5);
+  font-family: var(--font-sans);
+  font-size: var(--fs-sm);
+  line-height: var(--lh-relaxed);
+  color: var(--text-body);
+}
+
+.care-card__details {
+  display: flex;
+  flex-direction: column;
+  padding-left: var(--space-6);
+  border-left: 1px solid var(--border-subtle);
+}
+
+.care-card__points-title {
+  margin: 0 0 var(--space-3);
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  font-weight: var(--fw-medium);
+  letter-spacing: var(--ls-wide);
+  color: var(--accent);
+  text-transform: uppercase;
+}
+
+.care-card__points {
+  margin: 0;
+  padding: 0;
+  list-style: none;
+
+  li {
+    position: relative;
+    padding: var(--space-2) 0 var(--space-2) var(--space-5);
+    font-family: var(--font-mono);
+    font-size: var(--fs-sm);
+    color: var(--text-muted);
+  }
+
+  li::before {
+    content: "→";
+    position: absolute;
+    left: 0;
+    color: var(--accent);
+  }
+}
+
+.care-card__footer {
+  display: flex;
+  flex-direction: column;
+  margin-top: var(--space-4);
+  padding-top: var(--space-4);
+  border-top: 1px solid var(--border-subtle);
+}
+
+.care-card__price {
+  font-family: var(--font-mono);
+  font-size: var(--fs-sm);
+  color: var(--text-muted);
+
+  b {
+    font-size: var(--fs-lg);
+    font-weight: var(--fw-bold);
+    color: var(--text-strong);
+  }
+}
+
+.care-card__disclaimer {
+  margin: var(--space-2) 0 0;
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  line-height: var(--lh-normal);
+  color: var(--text-muted);
+  opacity: 0.85;
+}
+

exec
/bin/zsh -lc "sed -n '361,760p' docs/implementation-artifacts/code-reviews/15-4/full.diff; printf '\\n---CURRENT TARGETS---\\n'; sed -n '1,260p' app/pages/contact/index.vue; sed -n '1,380p' app/pages/index.vue; sed -n '1,180p' 'app/pages/blog/[...slug].vue'; sed -n '1,260p' app/composables/usePageSeo.ts; sed -n '1,300p' app/data/site.ts" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
+.care-card__cta {
+  margin-top: var(--space-4);
+}
+
+.care-card__btn {
+  width: 100%;
+}
+
 // ---- Section process ----
 .process__title {
   margin-bottom: var(--space-8);
@@ -482,5 +728,17 @@ usePageSeo({
   .process {
     grid-template-columns: 1fr;
   }
+
+  .care-card {
+    grid-template-columns: 1fr;
+    gap: var(--space-6);
+  }
+
+  .care-card__details {
+    padding-top: var(--space-4);
+    padding-left: 0;
+    border-top: 1px solid var(--border-subtle);
+    border-left: none;
+  }
 }
 </style>
diff --git a/docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md b/docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md
index 3b2a14b..ac7d416 100644
--- a/docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md
+++ b/docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md
@@ -4,7 +4,7 @@ baseline_commit: 7162f14595e42399d234c534fd88d78a7360cbb8
 
 # Story 15.3: Page Services — Section Dédiée AI Care Après Mise en Production & Process 4 Étapes
 
-Status: ready-for-dev
+Status: done
 
 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
 
@@ -80,39 +80,43 @@ so that mon investissement reste opérationnel, adapté aux évolutions d'APIs e
 
 ## Tasks / Subtasks
 
-- [ ] Tâche 1 — Création de la section dédiée « AI Care » dans `app/pages/services.vue` (AC: 1, 3)
-  - [ ] Structurer la section avec `.section.section--sunken.care-section` insérée entre la grille de build et la section process.
-  - [ ] Insérer l'eyebrow standard `<p class="eyebrow"><span aria-hidden="true">// </span>après la mise en production</p>`.
-  - [ ] Insérer le titre `h2.care-section__title` : `Le système doit continuer à fonctionner.`
-  - [ ] Rédiger le texte de cadrage d'exploitation en 2 phrases (prose).
-  - [ ] Intégrer une carte `<ZCard>` dédiée (ou layout horizontal adapté) avec badge `MAINTIEN EN CONDITION OPÉRATIONNELLE`, icône `bot`, prix `À partir de 250 € HT / mois`, les 5 points de livrables et le disclaimer des consommations tierces d'APIs/tokens.
-  - [ ] Ajouter le bouton `<ZButton>` vers `/contact` avec `:aria-label="Découvrir l'accompagnement AI Care"`.
-  - [ ] Configurer l'ancre `id="ai-care"` et la règle `scroll-margin-top: var(--space-16)`.
-
-- [ ] Tâche 2 — Réalignement des 4 étapes du process et intégration Blueprint (AC: 2)
-  - [ ] Mettre à jour l'étape `01` : Diagnostic gratuit 20 à 30 min.
-  - [ ] Mettre à jour l'étape `02` : Cadrage avec mention explicite du Blueprint facturable optionnel à partir de 750 € HT pour sujets complexes.
-  - [ ] Mettre à jour l'étape `03` : Construction & intégration centrée sur le bon niveau de système.
-  - [ ] Mettre à jour l'étape `04` : Renommer en `Exploitation & mesure` avec mention de la transition vers AI Care.
-  - [ ] Marquer comme résolu le point de dette différé correspondant dans `docs/implementation-artifacts/deferred-work.md`.
-
-- [ ] Tâche 3 — Intégration SCSS, tokens et responsive (AC: 1, 3)
-  - [ ] Déclarer les styles scoped de la carte AI Care dans `app/pages/services.vue` en utilisant exclusivement les tokens de spacing, border, typography et color.
-  - [ ] S'assurer d'un rendu soigné en desktop et mobile (< 900px).
-  - [ ] Tester le contraste et l'alternance visuelle sur les thèmes sombre et clair.
-
-- [ ] Tâche 4 — Synchronisation Schema.org JSON-LD (AC: 4)
-  - [ ] Ajouter AI Care dans l'objet `servicesJsonLd` comme service d'exploitation (`@type: "Service"`).
-  - [ ] Enrichir les 3 services de build avec leur attribut `url` (`${siteUrl}/services#automatisation`, etc.).
-  - [ ] Marquer comme résolu le point de dette différé Schema.org dans `docs/implementation-artifacts/deferred-work.md`.
-
-- [ ] Tâche 5 — Validation transverse, accessibilité et Gate Docker Nitro SSG (AC: 5)
-  - [ ] Vérifier la navigation clavier, le focus visible et les attributs ARIA des nouveaux éléments interactifs.
-  - [ ] Exécuter la commande de validation Docker :
+- [x] Tâche 1 — Création de la section dédiée « AI Care » dans `app/pages/services.vue` (AC: 1, 3)
+  - [x] Structurer la section avec `.section.section--sunken.care-section` insérée entre la grille de build et la section process.
+  - [x] Insérer l'eyebrow standard `<p class="eyebrow"><span aria-hidden="true">// </span>après la mise en production</p>`.
+  - [x] Insérer le titre `h2.care-section__title` : `Le système doit continuer à fonctionner.`
+  - [x] Rédiger le texte de cadrage d'exploitation en 2 phrases (prose).
+  - [x] Intégrer une carte `<ZCard>` dédiée (ou layout horizontal adapté) avec badge `MAINTIEN EN CONDITION OPÉRATIONNELLE`, icône `bot`, prix `À partir de 250 € HT / mois`, les 5 points de livrables et le disclaimer des consommations tierces d'APIs/tokens.
+  - [x] Ajouter le bouton `<ZButton>` vers `/contact` avec `:aria-label="careOffer.ctaAriaLabel"`.
+  - [x] Configurer l'ancre `id="ai-care"` et la règle `scroll-margin-top: var(--space-16)`.
+
+- [x] Tâche 2 — Réalignement des 4 étapes du process et intégration Blueprint (AC: 2)
+  - [x] Mettre à jour l'étape `01` : Diagnostic gratuit 20 à 30 min.
+  - [x] Mettre à jour l'étape `02` : Cadrage avec mention explicite du Blueprint facturable optionnel à partir de 750 € HT pour sujets complexes.
+  - [x] Mettre à jour l'étape `03` : Construction & intégration centrée sur le bon niveau de système.
+  - [x] Mettre à jour l'étape `04` : Renommer en `Exploitation & mesure` avec mention de la transition vers AI Care.
+  - [x] Marquer comme résolu le point de dette différé correspondant dans `docs/implementation-artifacts/deferred-work.md`.
+
+- [x] Tâche 3 — Intégration SCSS, tokens et responsive (AC: 1, 3)
+  - [x] Déclarer les styles scoped de la carte AI Care dans `app/pages/services.vue` en utilisant exclusivement les tokens de spacing, border, typography et color.
+  - [x] S'assurer d'un rendu soigné en desktop et mobile (< 900px).
+  - [x] Tester le contraste et l'alternance visuelle sur les thèmes sombre et clair.
+
+- [x] Tâche 4 — Synchronisation Schema.org JSON-LD (AC: 4)
+  - [x] Ajouter AI Care dans l'objet `servicesJsonLd` comme service d'exploitation (`@type: "Service"`).
+  - [x] Enrichir les 3 services de build avec leur attribut `url` (`${siteUrl}/services#${offer.id}`, etc.).
+  - [x] Marquer comme résolu le point de dette différé Schema.org dans `docs/implementation-artifacts/deferred-work.md`.
+
+- [x] Tâche 5 — Validation transverse, accessibilité et Gate Docker Nitro SSG (AC: 5)
+  - [x] Vérifier la navigation clavier, le focus visible et les attributs ARIA des nouveaux éléments interactifs.
+  - [x] Exécuter la commande de validation Docker :
     ```sh
     docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
     ```
-  - [ ] Vérifier que les 28 routes statiques compilent sans erreur.
+  - [x] Vérifier que les 28 routes statiques compilent sans erreur.
+
+### Review Findings
+
+- [x] [Review][Patch] Typographie et dimensionnement du glyphe de l'icône AI Care : documenter l'exception design kit 22px de ZIcon pour alignement architectural avec `.offer__icon` [`app/pages/services.vue:548`]
 
 ## Dev Notes
 
@@ -198,9 +202,20 @@ const steps: Step[] = [
 ## Dev Agent Record
 
 ### Agent Model Used
+- Gemini 3.7 Flash
 
 ### Debug Log References
+- `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> Gate 100% verte (0 erreurs lint, 0 erreurs types, 28 routes statiques pré-rendues).
 
 ### Completion Notes List
+- Création de la section dédiée AI Care (`.section.section--sunken.care-section`) dans `app/pages/services.vue` avec titre, prose de cadrage, badge « MAINTIEN EN CONDITION OPÉRATIONNELLE », icône `bot`, prix « À partir de 250 € HT / mois », 5 livrables et clause de transparence.
+- Réalignement des 4 étapes du process avec mention du Blueprint facturable (à partir de 750 € HT) pour l'étape 02 Cadrage et renommage de l'étape 04 en « Exploitation & mesure » avec mention de transition vers AI Care.
+- Alternance visuelle des sections en 3 temps : Build (`.section`), AI Care (`.section.section--sunken`), Process (`.section`).
+- Synchronisation complète de Schema.org `servicesJsonLd` avec ajout d'AI Care et des attributs `url` pour les 4 offres.
+- Résolution des deux dettes techniques différées de la story 15.2 dans `docs/implementation-artifacts/deferred-work.md`.
 
 ### File List
+- `app/pages/services.vue` (modifié)
+- `docs/implementation-artifacts/deferred-work.md` (modifié)
+- `docs/implementation-artifacts/sprint-status.yaml` (modifié)
+- `docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md` (modifié)
diff --git a/docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md b/docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md
new file mode 100644
index 0000000..7b328a5
--- /dev/null
+++ b/docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md
@@ -0,0 +1,136 @@
+---
+baseline_commit: 7c84ab3d4ce0f562bd860a256a374aa980f52082
+---
+
+# Story 15.4: Cohérence Globale, SEO, Formulaire de Contact & Gate Docker Nitro SSG
+
+Status: review
+
+<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
+
+## Story
+
+As a développeur garantissant la qualité globale du projet jouan.ovh,
+I want auditer l'ensemble des parcours, formulaires, balises SEO et valider la compilation statique Nitro,
+so that le site soit exempt de régressions fonctionnelles, visuelles, d'accessibilité ou de dépositionnement commercial (FR52, NFR4, NFR6, CAP-4).
+
+## Acceptance Criteria
+
+1. **Given** l'ensemble des parcours de conversion de `jouan.ovh`
+   **When** on audite le CTA final global (`app/pages/index.vue`, `app/pages/blog/[...slug].vue`) et la page de contact (`app/pages/contact/index.vue`)
+   **Then** le CTA final de conversion maintient l'accroche officielle :
+     - Eyebrow : `<p class="eyebrow"><span aria-hidden="true">$ </span>./workflow --inspect</p>`
+     - Titre : `Quel process vous fait perdre du temps chaque semaine ?`
+     - Sous-titre : cadrage sur le fonctionnement du workflow sans aucune mention tarifaire bloquante.
+   **And** le formulaire de contact dans `app/pages/contact/index.vue` qualifie le processus sans champ de budget obligatoire (questions centrées sur l'entreprise, la fréquence, le processus à améliorer et le fonctionnement actuel).
+   **And** la chaîne d'envoi Web3Forms transmet l'objet qualifié (`subject: Qualification de workflow : ...`) et gère gracieusement le honeypot anti-spam ainsi que l'état d'envoi.
+
+2. **Given** l'ensemble des 13 routes applicatives du site
+   **When** on inspecte les métadonnées SEO OpenGraph/Twitter et les données structurées Schema.org injectées par `usePageSeo()`
+   **Then** toutes les méta-descriptions et entités JSON-LD sont parfaitement alignées sur l'Offre Commerciale V1.1 (systèmes IA, automatisation de processus métier, offres sur devis, AI Care dès 250 € HT / mois, Blueprint dès 750 € HT).
+   **And** aucune mention obsolète de l'ancien tarif d'entrée « 3 500 € HT » ou « 3500 » ne subsiste sur le site, ni dans le balisage HTML pré-rendu, ni dans les scripts, ni dans les données structurées.
+
+3. **Given** la bascule de thème clair et sombre (acquis Epic 13)
+   **When** les pages modifiées dans le cadre de l'Epic 15 (`app/pages/index.vue`, `app/pages/services.vue`, `app/pages/contact/index.vue`) sont affichées en mode sombre (`[data-theme="dark"]`) et en mode clair (`[data-theme="light"]`)
+   **Then** le contraste de l'ensemble des textes, badges, icônes et boutons interactifs respecte le standard WCAG AA (ratio >= 4.5:1 pour le texte normal, >= 3:1 pour les composants d'interface).
+   **And** tous les styles consomment exclusivement les tokens SCSS `var(--token)` du design system sans valeur arbitraire en dur non documentée.
+
+4. **Given** la suite de validation de qualité du projet (Definition of Done)
+   **When** la commande de contrôle Docker est exécutée
+   **Then** la gate réussit avec 0 erreur ESLint, 0 erreur Stylelint, 0 erreur TypeScript `vue-tsc` et 28 routes statiques pré-rendues avec succès par Nitro :
+     ```sh
+     docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
+     ```
+
+5. **Given** la validation complète de la Story 15.4
+   **When** tous les critères d'acceptation sont vérifiés
+   **Then** l'Epic 15 (« Repositionnement Commercial V1.1 ») est prêt à être clôturé avec l'ensemble de ses stories (15.1, 15.2, 15.3, 15.4) au statut `done` dans `sprint-status.yaml`.
+
+## Tasks / Subtasks
+
+- [x] Tâche 1 — Audit et validation du CTA final global et du formulaire de contact (AC: 1)
+  - [x] Vérifier le composant de CTA final dans `app/pages/index.vue` (L286-308) et `app/pages/blog/[...slug].vue` (L45-63) : accroche, terminal décoratif et redirection `/contact`.
+  - [x] Vérifier `app/pages/contact/index.vue` : s'assurer de l'absence de champ budget, conformité du libellé de bouton « Décrire mon workflow », accessibilité a11y (focus premier champ invalide, honeypot masqué) et message de confirmation.
+  - [x] Tester l'absence d'erreurs d'hydratation ou de validation réseau.
+
+- [x] Tâche 2 — Audit transverse SEO, OpenGraph et données structurées Schema.org (AC: 2)
+  - [x] Auditer `usePageSeo` sur toutes les routes statiques :
+    - `/` (`app/pages/index.vue`)
+    - `/services` (`app/pages/services.vue`)
+    - `/about` (`app/pages/about.vue`)
+    - `/contact` (`app/pages/contact/index.vue`)
+    - `/contact/card` (`app/pages/contact/card.vue`)
+    - `/blog` (`app/pages/blog/index.vue`)
+    - `/confidentialite` (`app/pages/confidentialite.vue`)
+    - `/mentions-legales` (`app/pages/mentions-legales.vue`)
+  - [x] Vérifier l'alignement des objets JSON-LD (`WebPage`, `Service`, `ItemList`, `Person`, `ContactPage`, `ProfilePage`, `Blog`) sans prix d'entrée 3 500 € HT.
+  - [x] Lancer une recherche grep globale sur `3 500`, `3500`, `490` pour garantir l'élimination totale de l'ancien catalogue dans `app/`.
+
+- [x] Tâche 3 — Vérification du contraste thèmes Sombre & Clair et tokens SCSS (AC: 3)
+  - [x] Contrôler visuellement et fonctionnellement les pages `services.vue`, `index.vue` et `contact/index.vue` sous les deux thèmes.
+  - [x] Vérifier la lisibilité des badges (`<ZBadge>`), des cartes (`<ZCard>`), des bordures subtiles et de l'alternance de sections (`.section` / `.section--sunken`).
+  - [x] S'assurer qu'aucun style scoped ne redéclare les primitives globales de layout (`.section`, `.container`, `.eyebrow`, `.prose`).
+
+- [x] Tâche 4 — Exécution de la Gate Docker Nitro SSG et synchronisation de sprint (AC: 4, 5)
+  - [x] Exécuter la commande Docker de validation :
+    ```sh
+    docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
+    ```
+  - [x] Vérifier que les 28 routes statiques compilent proprement dans `.output/public`.
+  - [x] Mettre à jour `docs/implementation-artifacts/sprint-status.yaml` pour marquer la story 15.4 et l'epic-15.
+
+## Dev Notes
+
+### Contexte & Guardrails
+- **Fichiers principaux à inspecter / valider :**
+  - [`app/pages/contact/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/contact/index.vue)
+  - [`app/pages/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue)
+  - [`app/pages/services.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/services.vue)
+  - [`app/pages/blog/[...slug].vue`](file:///Users/simon/dev/jouan.ovh/app/pages/blog/[...slug].vue)
+  - [`app/composables/usePageSeo.ts`](file:///Users/simon/dev/jouan.ovh/app/composables/usePageSeo.ts)
+- **Règle d'or Docker :** Ne JAMAIS lancer `pnpm` sur l'hôte macOS arm64.
+- **Règle NFR6 :** Zéro emoji dans l'UI et le code. Utiliser les icônes vectorielles du composant `<ZIcon>`.
+- **Règle Tokens :** Utiliser exclusivement `var(--token)`.
+- **Règle Layout SCSS :** Ne pas redéclarer `.section`, `.section--sunken`, `.container`, `.eyebrow`, `.prose` dans les styles scoped.
+
+### Inventaire des Pages et Appels usePageSeo
+| Route | Fichier | Titre SEO | JSON-LD Type |
+|-------|---------|-----------|--------------|
+| `/` | `app/pages/index.vue` | Simon Jouan — Systèmes IA, agents & automatisation métier | WebSite, Person |
+| `/services` | `app/pages/services.vue` | Services & Systèmes IA — Simon Jouan | WebPage, ItemList (4 Services) |
+| `/about` | `app/pages/about.vue` | À propos — Simon Jouan | ProfilePage, Person |
+| `/contact` | `app/pages/contact/index.vue` | Contact — Simon Jouan | ContactPage, Person |
+| `/contact/card` | `app/pages/contact/card.vue` | Carte de visite — Simon Jouan | ProfilePage |
+| `/blog` | `app/pages/blog/index.vue` | Notes de dev | Blog, BlogPosting[] |
+| `/blog/:slug` | `app/pages/blog/[...slug].vue` | (Titre article) — Simon Jouan | BlogPosting |
+| `/confidentialite` | `app/pages/confidentialite.vue` | Politique de confidentialité — Simon Jouan | WebPage |
+| `/mentions-legales` | `app/pages/mentions-legales.vue` | Mentions légales — Simon Jouan | WebPage |
+
+### References
+- [Cahier des Epics : docs/planning-artifacts/epics.md#Story-15-4](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)
+- [Sprint Change Proposal : docs/planning-artifacts/sprint-change-proposal-2026-09-18.md](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/sprint-change-proposal-2026-09-18.md)
+- [Source de vérité Offre V1.1 : docs/jouan-ovh-offre-commerciale-v1.1-updated.md](file:///Users/simon/dev/jouan.ovh/docs/jouan-ovh-offre-commerciale-v1.1-updated.md)
+- [Directives et Invariants : AGENTS.md](file:///Users/simon/dev/jouan.ovh/AGENTS.md)
+- [Story précédente : docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md)
+
+## Dev Agent Record
+
+### Agent Model Used
+Gemini 3.7 Flash
+
+### Debug Log References
+- Docker Quality Gate: `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> Exit code 0, 0 error lint/typecheck, 28 routes statiques pré-rendues.
+- Grep checks: zéro occurrence de prix obsolètes (`3500`, `3 500`, `490`) dans l'arborescence `app/`.
+
+### Completion Notes List
+- Audit complet du CTA final et du formulaire de contact : conformité avec l'offre V1.1, absence de champ budget obligatoire, validation Web3Forms avec honeypot et a11y.
+- Audit transverse SEO et Schema.org sur l'ensemble des 13 routes statiques de l'application via `usePageSeo()`.
+- Vérification des contrastes thème sombre / thème clair et stricte consommation des tokens SCSS sans redéclaration des primitives globales de layout.
+- Validation intégrale de la gate Docker (linting, vérification statique TypeScript, génération SSG Nitro 28 routes).
+
+### File List
+- `docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md`
+- `docs/implementation-artifacts/sprint-status.yaml`
+
+## Change Log
+- 2026-09-18: Audit de cohérence globale, SEO, formulaire de contact et passage de la gate Docker Nitro SSG (Story 15.4 complétée et passée en review).
diff --git a/docs/implementation-artifacts/deferred-work.md b/docs/implementation-artifacts/deferred-work.md
index 1c06aeb..cba069e 100644
--- a/docs/implementation-artifacts/deferred-work.md
+++ b/docs/implementation-artifacts/deferred-work.md
@@ -42,8 +42,8 @@ _Vue d'ensemble par destination. Le détail par story est conservé dans les sec
 
 ## Deferred from: code review of 15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint (2026-09-18)
 
-- **Nuancer la mention du Blueprint dans l'étape Cadrage** (`app/pages/services.vue:195`) — L'étape Cadrage indique « Fait l'objet d'un Blueprint pour les sujets complexes », alors que l'Offre Commerciale V1.1 et l'AC-3 prévoient qu'un Blueprint peut être proposé lorsque le cadrage nécessite un travail approfondi. Ce texte est préexistant (story 12.5) et son refactoring complet fait l'objet de la Story 15.3 dédiée au déroulé en 4 étapes.
-- **Enrichir les entités Service de `servicesJsonLd` avec leur URL d'ancrage respective** (`app/pages/services.vue:224`) — Les 3 offres de build ont désormais des ancres HTML stables (`#automatisation`, `#workflow`, `#sur-mesure`). L'ajout explicite du champ `url: `${siteUrl}/services#${offer.id}`` au sein de chaque `Service` du Schema.org ItemList améliorera la précision machine-readable lors de la consolidation transverse SEO (Story 15.4).
+- ~~**Nuancer la mention du Blueprint dans l'étape Cadrage** (`app/pages/services.vue`)~~ — ✅ **Résolu en 15.3** : étape 02 Cadrage mise à jour avec mention du Blueprint facturable optionnel à partir de 750 € HT pour sujets complexes.
+- ~~**Enrichir les entités Service de `servicesJsonLd` avec leur URL d'ancrage respective** (`app/pages/services.vue`)~~ — ✅ **Résolu en 15.3** : attributs `url` pointant vers `#automatisation`, `#workflow`, `#sur-mesure` et `#ai-care` intégrés dans Schema.org `servicesJsonLd`.
 
 ## Deferred from: code review of 15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance (2026-09-18)
 
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 0b0e021..bd1f521 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-18 (Story 15.3 prête pour le dev)"
+last_updated: "2026-09-18 (Story 15.4 terminée et prête pour review)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -157,8 +157,8 @@ development_status:
   epic-15: in-progress
   15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance: done
   15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint: done
-  15-3-page-services-section-dediee-ai-care-et-process-4-etapes: ready-for-dev
-  15-4-coherence-globale-seo-formulaire-contact-et-gate-docker: backlog
+  15-3-page-services-section-dediee-ai-care-et-process-4-etapes: done
+  15-4-coherence-globale-seo-formulaire-contact-et-gate-docker: review
   epic-15-retrospective: optional
 
 

---CURRENT TARGETS---
<template>
  <main class="contact">
    <section class="section">
      <div class="container">
        <div class="contact__grid">
          <!-- Colonne gauche : en-tête + formulaire (story 7.1 / story 12.6) -->
          <div class="contact__main">
            <p class="eyebrow"><span aria-hidden="true">// </span>contact</p>
            <h1 class="contact__title">Parlons de votre workflow</h1>
            <p class="prose contact__intro">
              Décrivez-moi simplement le processus qui vous ralentit ou vous fait perdre du temps au quotidien. Je vous
              réponds sous 48h avec une première analyse de faisabilité.
            </p>

            <!-- État « envoyé » : carte accent + ligne mono verte. role="status" + focus
                 programmatique (tabindex -1) → annonce fiable aux lecteurs d'écran. -->
            <ZCard v-if="sent" ref="sentCard" accent class="contact__sent" role="status" tabindex="-1">
              <p class="contact__sent-line"><span aria-hidden="true">✓</span> Message envoyé</p>
              <p class="prose contact__sent-text">
                Merci ! Je vous réponds sous 48h avec une première analyse de faisabilité à votre adresse.
              </p>
            </ZCard>

            <!-- Formulaire — envoi via Web3Forms (service sans serveur, clé en env). Validation
                 front d'abord ; `novalidate` pour afficher nos messages FR (et non les bulles
                 natives). Compatible site statique : le fetch ne tourne qu'au clic, côté client. -->
            <form v-else ref="formRef" class="contact__form" novalidate @submit.prevent="onSubmit">
              <!-- Honeypot anti-spam : hors flux visuel et hors tabulation ; rempli = bot. -->
              <div class="contact__hp" aria-hidden="true">
                <label>
                  Ne remplissez pas ce champ
                  <input v-model="honeypot" type="text" tabindex="-1" autocomplete="off" />
                </label>
              </div>

              <div class="contact__row">
                <ZInput
                  v-model="form.name"
                  label="Nom"
                  placeholder="Votre nom"
                  required
                  autocomplete="name"
                  :error="Boolean(errors.name)"
                  :hint="errors.name"
                />
                <ZInput
                  v-model="form.email"
                  label="Email professionnel"
                  type="email"
                  placeholder="vous@entreprise.com"
                  required
                  autocomplete="email"
                  :error="Boolean(errors.email)"
                  :hint="errors.email"
                />
              </div>

              <div class="contact__row">
                <ZInput
                  v-model="form.company"
                  label="Entreprise"
                  placeholder="Nom de votre structure"
                  autocomplete="organization"
                />
                <ZInput
                  v-model="form.frequency"
                  label="Combien de fois ce process se répète-t-il ?"
                  placeholder="Ex : quotidien, 10x par semaine…"
                  autocomplete="off"
                />
              </div>

              <ZInput
                v-model="form.workflow"
                label="Quel processus souhaitez-vous améliorer ?"
                placeholder="Ex : qualification des leads, devis BTP, extraction de factures…"
                required
                autocomplete="off"
                :error="Boolean(errors.workflow)"
                :hint="errors.workflow"
              />

              <ZInput
                v-model="form.currentState"
                label="Comment fonctionne-t-il aujourd’hui ?"
                multiline
                placeholder="Outils utilisés, étapes manuelles, qui intervient, où l’information se perd…"
                required
                :error="Boolean(errors.currentState)"
                :hint="errors.currentState"
              />

              <!-- Erreur d'envoi réseau (distincte des erreurs de validation par champ). -->
              <p v-if="submitError" class="contact__error" role="alert">{{ submitError }}</p>

              <div>
                <ZButton type="submit" variant="primary" size="lg" :disabled="sending">
                  {{ sending ? "Envoi en cours…" : "Décrire mon workflow" }}
                  <template #iconRight><ZIcon name="arrow" /></template>
                </ZButton>
              </div>

              <p class="contact__rgpd">
                En envoyant ce formulaire, vos coordonnées et la description de votre workflow sont transmises via
                Web3Forms à seule fin de qualifier votre besoin et vous répondre. Consultez la
                <NuxtLink to="/confidentialite" class="contact__rgpd-link">politique de confidentialité</NuxtLink>.
              </p>
            </form>
          </div>

          <!-- Colonne droite (story 7.2) : carte infos + carte CTA terminal + hexagones sociaux -->
          <div class="contact__info">
            <h2 class="screen-reader-text">Coordonnées et terminal</h2>
            <!-- Carte infos : email / localisation / disponibilité -->
            <ZCard class="contact__infocard">
              <dl class="contact__infolist">
                <div class="infoitem">
                  <dt class="infoitem__k"><span aria-hidden="true">// </span>email</dt>
                  <dd class="infoitem__v">
                    <a class="contact__email" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
                  </dd>
                </div>
                <div class="infoitem">
                  <dt class="infoitem__k"><span aria-hidden="true">// </span>localisation</dt>
                  <dd class="infoitem__v">{{ contact.city }}</dd>
                </div>
                <div class="infoitem">
                  <dt class="infoitem__k"><span aria-hidden="true">// </span>disponibilité</dt>
                  <dd class="infoitem__v">
                    <div class="contact__avail"><ZBadge tone="success" dot>Ouvert aux missions freelance</ZBadge></div>
                  </dd>
                </div>
              </dl>
            </ZCard>

            <!-- Carte d'accès carte de visite digitale & QR Code -->
            <ZCard class="contact__cardcta">
              <p class="contact__cardcta-eyebrow"><span aria-hidden="true">// </span>carte de visite digitale</p>
              <p class="prose contact__cardcta-text">Fiche contact prête à scanner avec QR code vCard.</p>
              <ZButton :as="NuxtLink" to="/contact/card" variant="secondary" size="sm">
                <template #icon><ZIcon name="qr" /></template>
                Carte de visite &amp; QR Code
              </ZButton>
            </ZCard>

            <!-- Carte CTA terminal : ouvre l'easter-egg via le lanceur partagé (useTerminal) -->
            <ZCard class="contact__term">
              <!-- Prompt décoratif (flavor terminal) : aria-hidden — le bouton + l'invite portent le sens. -->
              <p class="contact__prompt" aria-hidden="true">
                anon.@jouan.ovh:~$ <span class="contact__prompt-cmd">./contact</span>
              </p>
              <p class="prose contact__term-text">Vous préférez la ligne de commande ? Ouvrez le terminal.</p>
              <ZButton variant="terminal" size="sm" aria-haspopup="dialog" @click="openTerminal">
                <template #icon><ZIcon name="terminal" /></template>
                Ouvrir le terminal
              </ZButton>
            </ZCard>

            <!-- Hexagones sociaux (composant partagé avec le footer) -->
            <LinkListComponent />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Page Contact — colonne gauche : en-tête + formulaire (story 7.1, envoi Web3Forms,
// service tiers SANS serveur). Colonne droite : infos + CTA terminal + socials (story 7.2).
import { nextTick, reactive, ref, watch } from "vue";
import { NuxtLink } from "#components";
import { SITE } from "~/data/site";

// Infos de contact — source unique `app/data/site.ts`.
const contact = SITE.profile;

// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le header).
// no-op au prerender (aucun lanceur) → prerender-safe ; ouvre le terminal côté client.
const { open: openTerminal } = useTerminal();

interface ContactForm {
  name: string;
  email: string;
  company?: string;
  workflow: string;
  currentState: string;
  frequency?: string;
}

interface Web3FormsResponse {
  success: boolean;
  message: string;
}

const ERROR_MESSAGE = `L'envoi a échoué. Réessayez, ou écrivez-moi directement à ${SITE.profile.email}.`;

// Clé Web3Forms injectée par l'env (NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY) — jamais en dur.
const accessKey = useRuntimeConfig().public.web3formsAccessKey;

const form = reactive<ContactForm>({
  name: "",
  email: "",
  company: "",
  workflow: "",
  currentState: "",
  frequency: "",
});

// Message d'erreur par champ requis ("" = valide). Rendu sous le champ via ZInput.
const errors = reactive({
  name: "",
  email: "",
  workflow: "",
  currentState: "",
});

const honeypot = ref("");
const sent = ref(false);
const sending = ref(false);
const submitError = ref("");
// Passe à true au 1er envoi → active la re-validation live (les erreurs se lèvent à la saisie).
const submitted = ref(false);

const formRef = ref<HTMLFormElement | null>(null);
const sentCard = ref<{ $el: HTMLElement } | null>(null);

// Format email volontairement permissif (un @, un point dans le domaine) : on évite les
// faux négatifs d'une regex stricte ; Web3Forms revalide côté service.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Nettoie les espaces et les caractères zero-width / invisibles (ex: \u200B)
function cleanInput(val?: string): string {
  return (val ?? "").replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
}

function validate(): boolean {
  const name = cleanInput(form.name);
  const email = cleanInput(form.email);
  const workflow = cleanInput(form.workflow);
  const currentState = cleanInput(form.currentState);

  errors.name = name ? "" : "Votre nom est requis.";
  errors.email = !email ? "Votre email est requis." : EMAIL_RE.test(email) ? "" : "Cet email ne semble pas valide.";
  errors.workflow = workflow ? "" : "Veuillez préciser le processus à améliorer.";
  errors.currentState = currentState ? "" : "Veuillez décrire le fonctionnement actuel.";
  return !errors.name && !errors.email && !errors.workflow && !errors.currentState;
}

// Après un 1er envoi, re-valider à la saisie : corriger un champ lève son message d'erreur
// sans attendre une nouvelle soumission.
watch(
  () => [form.name, form.email, form.workflow, form.currentState],
  () => {
    if (submitted.value) {
      validate();
    }
  },
);

<template>
  <main class="home">
    <ClientOnly>
      <HomeBootOverlay @boot-complete="onBootComplete" />
    </ClientOnly>
    <HomeAtmosComponent />
    <ZCustomCursor />

    <section class="hero">
      <div class="hero__in container">
        <div class="hero__grid">
          <!-- Colonne gauche : accroche commerciale, badge dispo, CTAs -->
          <div class="anim hero__text">
            <h2 class="eyebrow">
              <span aria-hidden="true">// </span>DÉVELOPPEUR FULL STACK · SYSTÈMES IA &amp; AUTOMATISATION
            </h2>
            <h1 class="hero__title">Automatisez les workflows qui freinent votre équipe.</h1>
            <p class="hero__sub">
              Je conçois des agents IA, automatisations et applications métier qui s’intègrent à vos outils existants —
              de l’identification du problème jusqu’à la mise en production.
            </p>
            <p class="hero__credibility">
              Full Stack TypeScript · Agents IA · APIs · PostgreSQL · MCP · IA locale · QA
            </p>

            <div class="hero__badge-wrap">
              <span class="hero__pulse-dot" aria-hidden="true" />
              <span>Disponible pour nouvelles missions freelance</span>
              <template v-if="SITE.profile.maltUrl">
                <span aria-hidden="true"> · </span>
                <ZExternalLink :href="SITE.profile.maltUrl"> Profil Malt vérifié </ZExternalLink>
              </template>
            </div>

            <div class="hero__cta">
              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
                Identifier un workflow à automatiser
                <template #iconRight><ZIcon name="arrow" /></template>
              </ZButton>
              <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir mes systèmes IA </ZButton>
            </div>
          </div>

          <!-- Colonne droite : terminal hero cinétique -->
          <div class="anim hero__term-col">
            <HomeHeroTerminal :auto-start="isBootFinished" />
          </div>
        </div>

        <!-- Ruban défilant de la stack moderne remonté au sein du hero (fidèle à la maquette) -->
        <HomeStackMarquee class="hero__marquee" />
      </div>
    </section>

    <!-- Vitrine des 3 services cibles (Story 12.3 / AC-1 & Story 15.1 / AC-1, AC-2, AC-3) -->
    <section class="section">
      <div class="container">
        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos systèmes</h2>
        <ul class="grid-3">
          <li v-for="service in services" :key="service.id">
            <ZCard class="offer" interactive tilt :accent="service.featured" :featured="service.featured">
              <div class="offer__top">
                <div class="offer__icon"><ZIcon :name="service.icon" /></div>
                <span class="offer__no">{{ service.no }}</span>
              </div>
              <h3 class="offer__title">{{ service.title }}</h3>
              <p class="offer__desc">{{ service.desc }}</p>
              <ul class="offer__points">
                <li v-for="point in service.points" :key="point">
                  <ZIcon name="check" class="offer__check" />
                  <span>{{ point }}</span>
                </li>
              </ul>
              <ul class="hero__tags offer__tags">
                <li v-for="tag in service.tags" :key="tag">
                  <ZTag>{{ tag }}</ZTag>
                </li>
              </ul>
              <NuxtLink
                :to="service.to"
                class="offer__more"
                :aria-label="`${service.actionText.replace(' →', '')} - ${service.title}`"
              >
                <span>{{ service.actionText.replace(" →", "") }}</span>
                <span class="offer__arrow" aria-hidden="true">→</span>
              </NuxtLink>
            </ZCard>
          </li>
        </ul>

        <!-- Encart de réassurance désancrage tarifaire (Story 15.1 / AC-3) -->
        <div class="services-reassurance">
          <div class="services-reassurance__bar" aria-hidden="true">
            <span class="services-reassurance__dots">
              <span class="services-reassurance__dot services-reassurance__dot--close" />
              <span class="services-reassurance__dot services-reassurance__dot--min" />
              <span class="services-reassurance__dot services-reassurance__dot--max" />
            </span>
            <span class="services-reassurance__cmd">anon.@jouan.ovh: ~ / note.txt</span>
          </div>
          <div class="services-reassurance__body">
            <p class="services-reassurance__lead">
              <span class="services-reassurance__prompt" aria-hidden="true">&gt; </span>
              <strong>Un besoin simple ne nécessite pas forcément un gros projet.</strong>
            </p>
            <p class="services-reassurance__text">
              Je dimensionne la solution selon le workflow réel : parfois quelques automatisations suffisent ; parfois
              il faut construire un système métier complet.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Bloc différenciateur « Prototype → Production » (Story 12.3 / AC-2) -->
    <section class="section diff-block">
      <div class="container">
        <p class="eyebrow"><span aria-hidden="true">// </span>au-delà de la démo</p>
        <h2 class="section__title diff-block__title">
          Un agent qui fonctionne trois fois n’est pas encore un système fiable.
        </h2>
        <p class="prose diff-block__lead">
          Mon background Full Stack et QA me permet de traiter ce qui arrive après le prototype : authentification,
          permissions, données, erreurs, retries, logs, tests, coûts, monitoring, sécurité et supervision humaine.
          L’objectif n’est pas de mettre de l’IA partout. L’objectif est de construire un workflow qui reste utile
          lorsqu’il rencontre la vraie vie.
        </p>

        <ul class="pillars-grid">
          <li v-for="pillar in pillars" :key="pillar.id">
            <ZCard class="pillar" padded>
              <div class="pillar__icon">
                <ZIcon :name="pillar.icon" />
              </div>
              <h3 class="pillar__title">{{ pillar.title }}</h3>
              <p class="pillar__desc">{{ pillar.desc }}</p>
            </ZCard>
          </li>
        </ul>
      </div>
    </section>

    <!-- Projets sélectionnés & Statistiques de réassurance (Story 12.4 / AC-1, AC-2, AC-3) -->
    <section class="section">
      <div class="container">
        <div class="block__head">
          <p class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</p>
          <h2 class="section__title">Des produits qui tournent en production</h2>
        </div>

        <ul class="projects-grid">
          <li v-for="(project, index) in projects" :key="project.name" class="projects-grid__item">
            <ZCard class="project-card" tilt :padded="false">
              <div v-if="project.image" class="project-card__media">
                <NuxtImg
                  :src="project.image"
                  :alt="project.imageAlt || `Capture d'écran du projet ${project.name}`"
                  width="720"
                  height="405"
                  sizes="(max-width: 900px) 100vw, (max-width: 1200px) 50vw, 380px"
                  format="webp"
                  loading="lazy"
                  class="project-card__img"
                />
              </div>
              <div v-else class="project-card__media project-card__media--schematic">
                <div
                  class="project-card__blueprint"
                  role="img"
                  aria-label="Schéma d'architecture du pipeline documentaire Devis-Assist : Mistral OCR 3 vers BullMQ et Redis, puis matching flou PostgreSQL pg_trgm"
                >
                  <div class="project-card__blueprint-grid">
                    <div class="project-card__node">
                      <ZIcon name="layers" class="project-card__node-icon" />
                      <span class="project-card__node-label">Mistral OCR 3</span>
                    </div>
                    <span class="project-card__node-flow">→</span>
                    <div class="project-card__node">
                      <ZIcon name="zap" class="project-card__node-icon" />
                      <span class="project-card__node-label">BullMQ / Redis</span>
                    </div>
                    <span class="project-card__node-flow">→</span>
                    <div class="project-card__node">
                      <ZIcon name="code" class="project-card__node-icon" />
                      <span class="project-card__node-label">pg_trgm Match</span>
                    </div>
                  </div>
                  <div class="project-card__blueprint-sub">Pipeline documentaire &amp; extraction tabulaire</div>
                </div>
              </div>

              <div class="project-card__body">
                <div class="project-card__header">
                  <span class="project-card__no"
                    >{{ String(index + 1).padStart(2, "0") }} / {{ String(projects.length).padStart(2, "0") }}</span
                  >
                  <ZBadge v-if="project.badge" tone="neutral">{{ project.badge }}</ZBadge>
                </div>
                <div class="project-card__title-wrap">
                  <h3 class="project-card__title">{{ project.name }}</h3>
                  <span v-if="project.status" class="project-card__status">{{ project.status }}</span>
                </div>
                <p v-if="project.hook" class="project-card__hook">{{ project.hook }}</p>
                <p class="project-card__desc prose">{{ project.desc }}</p>
                <ul class="hero__tags project-card__tags">
                  <li v-for="tag in project.tags" :key="tag">
                    <ZTag>{{ tag }}</ZTag>
                  </li>
                </ul>
              </div>
            </ZCard>
          </li>
        </ul>

        <!-- Statistiques clés de réassurance (Story 11.4 / AC-2) -->
        <ul class="stats">
          <li v-for="stat in stats" :key="stat.id" class="stat">
            <b>{{ stat.value }}</b>
            <span>{{ stat.label }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Journal technique / Notes de dev (Story 11.4 / AC-3) -->
    <section class="section">
      <div class="container">
        <div class="block__head block__head--row">
          <div>
            <p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>
            <h2 class="section__title">Notes de dev, écrites en construisant</h2>
          </div>
          <NuxtLink to="/blog" class="seeall" data-hot>
            cat tous-les-articles
            <ZIcon name="arrow" class="seeall__icon" />
          </NuxtLink>
        </div>

        <!-- Liste des articles les plus récents -->
        <ul v-if="articles && articles.length" class="journal">
          <li v-for="article in articles" :key="article.path" class="journal__item">
            <ZCard :as="NuxtLink" :to="article.path" :padded="false" interactive tilt class="jpost" data-hot>
              <NuxtImg
                v-if="article.image"
                class="jpost__thumb"
                :src="article.image.src"
                :alt="article.image.alt"
                width="360"
                height="200"
                sizes="360px"
                format="webp"
              />
              <div class="jpost__body">
                <ul v-if="article.tags?.length" class="hero__tags jpost__tags">
                  <li v-for="(tag, tagIndex) in article.tags" :key="`${tag}-${tagIndex}`">
                    <ZTag>{{ tag }}</ZTag>
                  </li>
                </ul>
                <h3 class="jpost__title">{{ article.title }}</h3>
                <p v-if="article.description" class="prose jpost__desc">{{ article.description }}</p>
                <div class="jpost__meta">
                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
                  <template v-if="article.read">
                    <span aria-hidden="true">·</span>
                    <span>{{ article.read }} de lecture</span>
                  </template>
                  <span class="jpost__arrow" aria-hidden="true">
                    <ZIcon name="arrow" />
                  </span>
                </div>
              </div>
            </ZCard>
          </li>
        </ul>

        <!-- État d'attente sobre lorsque aucun article n'est encore publié -->
        <ZCard v-else class="journal__empty" padded>
          <p class="journal__empty-code">$ cat ~/journal/*.md</p>
          <p class="journal__empty-text">Les notes d'ingénierie et retours d'expérience sont en cours de rédaction.</p>
          <ZButton :as="NuxtLink" to="/blog" variant="secondary" size="sm"> Consulter la section blog </ZButton>
        </ZCard>
      </div>
    </section>

    <!-- Bloc CTA final de conversion (Story 12.6 / AC-2) -->
    <section class="section">
      <div class="container">
        <div class="cta">
          <p class="eyebrow cta__eyebrow"><span aria-hidden="true">$ </span>./workflow --inspect</p>
          <h2 class="cta__title">
            Quel process vous fait perdre du temps <span class="cta__highlight">chaque semaine</span> ?
          </h2>
          <p class="cta__subtitle">
            Décrivez-moi simplement comment il fonctionne aujourd’hui. Je vous dirai ce qui mérite d’être automatisé, ce
            qui doit rester humain et si l’IA apporte réellement quelque chose.
          </p>
          <div class="cta__actions">
            <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg" data-hot>
              Identifier un workflow à automatiser
              <template #iconRight><ZIcon name="arrow" /></template>
            </ZButton>
            <ZButton as="a" :href="`mailto:${SITE.profile.email}`" variant="secondary" size="lg" data-hot>
              M’écrire directement
            </ZButton>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Page d'accueil — refonte Hero Full Stack TS, Projets SaaS, Journal & CTA final (Story 11.4).
// Architecture multi-pages Nuxt 4, dark-first, accent orange.
import { onBeforeUnmount, onMounted, ref } from "vue";
import { NuxtLink, ZExternalLink } from "#components";
import { SITE } from "~/data/site";

const isBootFinished = ref(false);
const isReducedMotion = ref(false);
let motionMq: MediaQueryList | null = null;

function onMotionChange(e: MediaQueryListEvent) {
  isReducedMotion.value = e.matches;
}

onMounted(() => {
  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  isReducedMotion.value = motionMq.matches;
  motionMq.addEventListener("change", onMotionChange);
});

onBeforeUnmount(() => {
  motionMq?.removeEventListener("change", onMotionChange);
});

function onBootComplete() {
  isBootFinished.value = true;
}

interface HomeServiceOffer {
  id: string;
  no: string;
  icon: "code" | "layers" | "spark" | "bot" | "terminal" | "zap";
  title: string;
  desc: string;
  points: string[];
  tags: string[];
  actionText: string;
  to: string;
  featured: boolean;
}

interface ProductionPillar {
  id: string;
  icon: "code" | "layers" | "spark" | "bot" | "terminal" | "zap";
  title: string;
  desc: string;
}

// Vitrine des 3 offres ciblées Systèmes IA & Automatisation (Story 12.3 / AC-1 & Story 15.1 / AC-1, AC-2 & Story 15.2 / AC-4).
const services: HomeServiceOffer[] = [
  {
    id: "automation",
    no: "01 / 03",
    icon: "layers",
    title: "Automatisation de processus métier",
    desc: "Cartographie d'un workflow existant, identification des tâches répétitives et construction du système qui automatise ce qui mérite réellement de l'être.",
    points: [
      "Cartographie de flux & connecteurs d'APIs",
      "Ingestion, enrichissement et traitement de données",
      "Synchronisation d'outils métier & reporting",
    ],
    tags: ["Workflow", "APIs", "Automation", "PostgreSQL"],
    actionText: "Voir les types d'automatisation →",
    to: "/services#automatisation",
    featured: false,
  },
  {
<template>
  <main class="blog-article">
    <section class="section">
      <div class="container">
        <article v-if="page" class="article">
          <!-- Lien retour (porté de Blog.jsx : hdr__link « ← Retour au blog »).
               Le glyphe ← est décoratif (aria-hidden) : le lecteur d'écran lit « Retour au blog ». -->
          <NuxtLink to="/blog" class="article__back"><span aria-hidden="true">←</span> Retour au blog</NuxtLink>

          <!-- En-tête : tags, titre, méta (auteur · date · lecture), image héro -->
          <ul v-if="page.tags?.length" class="hero__tags article__tags">
            <li v-for="tag in page.tags" :key="tag">
              <ZTag>{{ tag }}</ZTag>
            </li>
          </ul>

          <h1 class="article__title">{{ page.title }}</h1>

          <div class="post__meta article__meta">
            <span>Simon Jouan</span>
            <span aria-hidden="true">·</span>
            <time :datetime="page.date">{{ formatDate(page.date) }}</time>
            <template v-if="page.read">
              <span aria-hidden="true">·</span>
              <span>{{ page.read }}</span>
            </template>
          </div>

          <NuxtImg
            v-if="page.image"
            class="article__hero"
            :src="page.image.src"
            :alt="page.image.alt"
            width="760"
            height="320"
            sizes="760px"
            format="webp"
          />

          <!-- Corps de l'article : HTML généré par @nuxt/content, stylé via :deep() -->
          <div class="prose article__prose">
            <ContentRenderer :value="page" />
          </div>

          <!-- Bloc CTA final de conversion (Story 12.6 / AC-2) -->
          <div class="article__cta">
            <p class="eyebrow article__cta-eyebrow"><span aria-hidden="true">$ </span>./workflow --inspect</p>
            <h2 class="article__cta-title">Quel process vous fait perdre du temps chaque semaine ?</h2>
            <p class="article__cta-subtitle">
              Décrivez-moi simplement comment il fonctionne aujourd’hui. Je vous dirai ce qui mérite d’être automatisé,
              ce qui doit rester humain et si l’IA apporte réellement quelque chose.
            </p>
            <div class="article__cta-actions">
              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
                Identifier un workflow à automatiser
                <template #iconRight><ZIcon name="arrow" /></template>
              </ZButton>
              <ZButton as="a" :href="`mailto:${SITE.profile.email}`" variant="secondary" size="lg">
                M’écrire directement
              </ZButton>
            </div>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Vue article du blog (story 6.2) — porté de Blog.jsx (fonction Article) : structure
// .article (760px), en-tête tags/titre/méta/héro, prose Ubuntu sans, blocs de code en
// palette terminale (Shiki désactivé, cf. nuxt.config), CTA de fin. Contenu via
// @nuxt/content v3 (queryCollection + ContentRenderer). Prerender-safe (useAsyncData).
import { NuxtLink } from "#components";
import { SITE } from "~/data/site";

const route = useRoute();

// Normalise le chemin (retire le(s) slash(es) final/aux) pour éviter un faux 404
// sur une URL du type "/blog/mon-article/".
const path = computed(() => route.path.replace(/\/+$/, "") || "/");

const { data: page, error } = await useAsyncData(
  // Clé reproductible côté SSR + refetch automatique lors d'une navigation client entre slugs.
  () => `blog-${path.value}`,
  () => queryCollection("blog").path(path.value).first(),
  { watch: [path] },
);

// Erreur adaptée à l'état courant : 500 si la requête de contenu échoue (on ne masque
// pas une vraie erreur derrière un 404), 404 uniquement quand l'article n'existe pas.
const resolveContentError = () => {
  if (error.value) {
    return createError({ statusCode: 500, statusMessage: "Erreur lors du chargement de l'article" });
  }
  if (!page.value) {
    return createError({ statusCode: 404, statusMessage: "Article introuvable" });
  }
  return null;
};

// Rendu initial (SSR / prerender) : throw pour fixer le bon statut HTTP. Pas besoin de
// `fatal: true` ici, un throw au niveau du setup est déjà traité comme une erreur de page.
const initialError = resolveContentError();
if (initialError) {
  throw initialError;
}

// Navigation client entre slugs : le refetch met à jour `page`/`error` sans réexécuter le
// setup → on (dé)clenche la page d'erreur de façon réactive.
if (import.meta.client) {
  watch([page, error], () => {
    const clientError = resolveContentError();
    if (clientError) {
      showError(clientError);
    } else {
      clearError();
    }
  });
}

// SEO par article (centralisé via usePageSeo, parité /about, /blog).
// usePageSeo résout siteUrl, canonical, og:*, twitter:* et le JSON-LD échappé.
const siteUrl = useSiteUrl();
usePageSeo(() => {
  const article = page.value;
  if (!article) {
    return null;
  }
  const url = `${siteUrl}${article.path}`;
  const image = article.image
    ? article.image.src.startsWith("/")
      ? `${siteUrl}${article.image.src}`
      : `${siteUrl}/${article.image.src}`
    : undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: {
      "@type": "Person",
      name: SITE.profile.name,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: SITE.profile.name,
      url: siteUrl,
      logo: `${siteUrl}/images/logo.png`,
    },
    url,
    ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
    ...(image ? { image } : {}),
  };

  return {
    title: `${article.title} — Simon Jouan`,
    ogTitle: article.title,
    description: article.description,
    path: article.path,
    image: article.image?.src,
    imageAlt: article.image?.alt,
    type: "article",
    jsonLd,
  };
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / Blog.jsx */
// .section / .container / .prose / .hero__tags / .post__meta sont des primitives de
// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
.blog-article {
  display: block;
}

// ---- Conteneur article (porté de kit.css : .article) ----
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
// Source de vérité unique du CONTENU partagé du site (DRY / SRP : les données vivent ici,
// les composants/programmes ne font que les présenter). Forme portée de
// `docs/design_system/ui_kits/jouan-site/data.js` (référence du UI kit).
//
// Consommé par : pages (`index.vue`, `about.vue`, `contact.vue`), `FooterComponent.vue`,
// et les programmes terminal (`programs/Skills|Projets|Contact|About.ts`).
//
// NB : `experiences` / `degrees` ne sont PAS centralisés ici — leurs formes et leur niveau
// de détail divergent volontairement entre le CV terminal (`About.ts`, détaillé) et la page
// `/about` (condensée). Leur réconciliation est une décision de contenu, suivie dans
// `deferred-work.md`, pas un simple refactor.

export interface IProfile {
  name: string;
  role: string;
  shortRole?: string;
  bio?: string;
  email: string;
  city: string;
  available: boolean;
  maltUrl?: string;
  phone?: string;
  phoneRaw?: string;
}

export interface IProject {
  name: string;
  role: string;
  desc: string;
  hook?: string;
  image?: string;
  imageAlt?: string;
  badge?: string;
  url?: string;
  status?: string;
  statusVariant?: string;
  tags: string[];
}

const profile: IProfile = {
  name: "Simon Jouan",
  role: "Développeur Full Stack spécialisé en systèmes IA & automatisation métier",
  shortRole: "Développeur Full Stack spécialisé IA & automatisation",
  bio: "Conception et industrialisation d'applications web, agents IA et pipelines d'automatisation métier de bout en bout.",
  email: "simon@jouan.ovh",
  city: "France · Remote",
  available: true,
  maltUrl: "https://www.malt.fr/profile/simonjouan",
  phone: "+33 6 58 96 90 20",
  phoneRaw: "+33658969020",
};

// Stack technique moderne prioritaire ordonnée.
const skills: string[] = [
  "typescript",
  "node.js",
  "nest.js",
  "nuxt",
  "vue",
  "postgresql",
  "mcp",
  "docker",
  "whisper.cpp",
  "sherpa-onnx",
  "llama.cpp",
  "bullmq",
  "rest-api",
  "vitest",
];

const projects: IProject[] = [
  {
    name: "Keova Signal",
    role: "Concepteur & Développeur Full Stack",
    hook: "Détecter le bon prospect au bon moment",
    desc: "Moteur d'acquisition B2B & qualification de leads par ingestion Open Data Insee, scraping éthique, double étage de scoring Zod et serveur MCP natif (10 outils).",
    image: "/images/projects/keova-signal-dashboard.png",
    imageAlt: "Tableau de bord de qualification de prospects Keova Signal",
    badge: "Projet interne / Dépôt privé",
    status: "● Système interne / En développement actif",
    tags: ["Node.js 22", "TypeScript", "MCP Server", "PostgreSQL", "Cheerio", "Docker"],
  },
  {
    name: "Debrief",
    role: "Concepteur & Développeur Full Stack",
    hook: "Transformer un rendez-vous commercial en apprentissage exploitable",
    desc: "Application desktop privacy-first (100 % on-device) de synthèse commerciale et analyse d'appels, sans fuite réseau ni dépendance cloud externe.",
    image: "/images/projects/debrief-dashboard.png",
    imageAlt: "Interface desktop de synthèse d'appels Debrief",
    badge: "Dépôt privé",
    status: "◐ R&D / En développement",
    tags: ["Tauri", "Rust", "whisper.cpp", "sherpa-onnx", "llama.cpp", "Gemma 4"],
  },
  {
    name: "Devis-Assist",
    role: "Architecte & Développeur Full Stack",
    hook: "Transformer un historique de devis BTP en aide au chiffrage",
    desc: "Solution d'ingestion et d'analyse de devis artisans BTP combinant Mistral OCR 3, file asynchrone BullMQ/Redis et matching flou PostgreSQL pg_trgm.",
    badge: "Dépôt privé",
    status: "○ Produit / Architecture BMM validée",
    tags: ["NestJS", "Nuxt UI 4", "PostgreSQL pg_trgm", "Mistral OCR", "BullMQ"],
  },
];

const legacyProjects: IProject[] = [
  {
    name: "Keova App",
    role: "Co-fondateur & Développeur Full Stack",
    desc: "Application SaaS de gestion opérationnelle complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).",
    url: "https://keova.app",
    status: "● En production",
    tags: ["Nuxt 4", "NestJS", "PostgreSQL", "Stripe Connect", "SaaS"],
  },
  {
    name: "TryOn",
    role: "CTO & Développeur Full Stack",
    desc: "Plateforme SaaS B2B d'essayage virtuel de vêtements via l'IA générative (diffusion models, microservices asynchrones, files Redis).",
    status: "○ Étude de cas (MVP livré)",
    tags: ["Nuxt 3", "NestJS", "Python", "ComfyUI", "IA"],
  },
  {
    name: "Nodium",
    role: "Créateur · R&D agents IA",
    desc: "Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.",
    status: "◐ R&D / En cours",
    tags: ["TypeScript", "Electron", "Agents", "IA"],
  },
];

export const SITE = { profile, skills, projects, legacyProjects } as const;

exec
/bin/zsh -lc "printf '%s\\n' '---DIFF NAMES---'; git diff --no-index /dev/null docs/implementation-artifacts/code-reviews/15-4/full.diff >/dev/null 2>&1 || true; rg '"'^diff --git|''^[-+].*(3 ?500|3500|490|emoji|budget|subject|workflow|250|750)|sprint-status|15-4|epic-15'"' docs/implementation-artifacts/code-reviews/15-4/full.diff docs/implementation-artifacts/sprint-status.yaml; printf '%s\\n' '---CONTACT---'; nl -ba app/pages/contact/index.vue | sed -n '1,360p'; printf '%s\\n' '---SEO CALLS---'; rg -n -C 4 'usePageSeo|description:|jsonLd|3500|3 500|490' app/pages app/composables app/data/site.ts; printf '%s\\n' '---REFERENCES---'; rg -n -C 3 'AC-1|AC-2|AC-3|AC-4|15\\.4|3500|3 500|490|250|750|AI Care|Blueprint|thème|theme' docs/project-context.md docs/jouan-ovh-offre-commerciale-v1.1-updated.md docs/planning-artifacts/epics.md docs/implementation-artifacts/sprint-status.yaml AGENTS.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---DIFF NAMES---
docs/implementation-artifacts/sprint-status.yaml:  epic-15: in-progress
docs/implementation-artifacts/sprint-status.yaml:  15-4-coherence-globale-seo-formulaire-contact-et-gate-docker: review
docs/implementation-artifacts/sprint-status.yaml:  epic-15-retrospective: optional
docs/implementation-artifacts/code-reviews/15-4/full.diff:diff --git a/app/pages/services.vue b/app/pages/services.vue
docs/implementation-artifacts/code-reviews/15-4/full.diff:+  price: "À partir de 250 € HT / mois",
docs/implementation-artifacts/code-reviews/15-4/full.diff:-    desc: "Échange de 20 à 30 minutes pour qualifier le problème, comprendre le workflow existant et identifier les goulots d'étranglement.",
docs/implementation-artifacts/code-reviews/15-4/full.diff:+    desc: "Échange gratuit de 20 à 30 minutes pour qualifier le problème, comprendre le workflow existant, ses volumes, ses outils et identifier la friction réelle.",
docs/implementation-artifacts/code-reviews/15-4/full.diff:-    desc: "Formalisation du workflow cible, des étapes manuelles à conserver sous contrôle humain, des connecteurs API requis et des KPI de mesure. Fait l'objet d'un Blueprint pour les sujets complexes.",
docs/implementation-artifacts/code-reviews/15-4/full.diff:+    desc: "Définir la cible, ce qui doit être automatisé, ce qui reste humain et comment mesurer le résultat. Pour les sujets complexes, un Blueprint facturable (à partir de 750 € HT) peut être proposé lorsque le cadrage nécessite un travail approfondi avant devis.",
docs/implementation-artifacts/code-reviews/15-4/full.diff:+    desc: "Développer uniquement le niveau de système nécessaire (automatisation ciblée, workflow métier ou application sur mesure) et le tester sur des cas réels avant livraison.",
docs/implementation-artifacts/code-reviews/15-4/full.diff:+    desc: "Mise en production, mesure initiale de performance et maintien en condition opérationnelle lorsque le workflow le justifie (via AI Care).",
docs/implementation-artifacts/code-reviews/15-4/full.diff:diff --git a/docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md b/docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md
docs/implementation-artifacts/code-reviews/15-4/full.diff:-  - [ ] Intégrer une carte `<ZCard>` dédiée (ou layout horizontal adapté) avec badge `MAINTIEN EN CONDITION OPÉRATIONNELLE`, icône `bot`, prix `À partir de 250 € HT / mois`, les 5 points de livrables et le disclaimer des consommations tierces d'APIs/tokens.
docs/implementation-artifacts/code-reviews/15-4/full.diff:-  - [ ] Mettre à jour l'étape `02` : Cadrage avec mention explicite du Blueprint facturable optionnel à partir de 750 € HT pour sujets complexes.
docs/implementation-artifacts/code-reviews/15-4/full.diff:+  - [x] Intégrer une carte `<ZCard>` dédiée (ou layout horizontal adapté) avec badge `MAINTIEN EN CONDITION OPÉRATIONNELLE`, icône `bot`, prix `À partir de 250 € HT / mois`, les 5 points de livrables et le disclaimer des consommations tierces d'APIs/tokens.
docs/implementation-artifacts/code-reviews/15-4/full.diff:+  - [x] Mettre à jour l'étape `02` : Cadrage avec mention explicite du Blueprint facturable optionnel à partir de 750 € HT pour sujets complexes.
docs/implementation-artifacts/code-reviews/15-4/full.diff:+- Création de la section dédiée AI Care (`.section.section--sunken.care-section`) dans `app/pages/services.vue` avec titre, prose de cadrage, badge « MAINTIEN EN CONDITION OPÉRATIONNELLE », icône `bot`, prix « À partir de 250 € HT / mois », 5 livrables et clause de transparence.
docs/implementation-artifacts/code-reviews/15-4/full.diff:+- Réalignement des 4 étapes du process avec mention du Blueprint facturable (à partir de 750 € HT) pour l'étape 02 Cadrage et renommage de l'étape 04 en « Exploitation & mesure » avec mention de transition vers AI Care.
docs/implementation-artifacts/code-reviews/15-4/full.diff:+- `docs/implementation-artifacts/sprint-status.yaml` (modifié)
docs/implementation-artifacts/code-reviews/15-4/full.diff:diff --git a/docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md b/docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md
docs/implementation-artifacts/code-reviews/15-4/full.diff:+++ b/docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md
docs/implementation-artifacts/code-reviews/15-4/full.diff:+     - Eyebrow : `<p class="eyebrow"><span aria-hidden="true">$ </span>./workflow --inspect</p>`
docs/implementation-artifacts/code-reviews/15-4/full.diff:+     - Sous-titre : cadrage sur le fonctionnement du workflow sans aucune mention tarifaire bloquante.
docs/implementation-artifacts/code-reviews/15-4/full.diff:+   **And** le formulaire de contact dans `app/pages/contact/index.vue` qualifie le processus sans champ de budget obligatoire (questions centrées sur l'entreprise, la fréquence, le processus à améliorer et le fonctionnement actuel).
docs/implementation-artifacts/code-reviews/15-4/full.diff:+   **And** la chaîne d'envoi Web3Forms transmet l'objet qualifié (`subject: Qualification de workflow : ...`) et gère gracieusement le honeypot anti-spam ainsi que l'état d'envoi.
docs/implementation-artifacts/code-reviews/15-4/full.diff:+   **Then** toutes les méta-descriptions et entités JSON-LD sont parfaitement alignées sur l'Offre Commerciale V1.1 (systèmes IA, automatisation de processus métier, offres sur devis, AI Care dès 250 € HT / mois, Blueprint dès 750 € HT).
docs/implementation-artifacts/code-reviews/15-4/full.diff:+   **And** aucune mention obsolète de l'ancien tarif d'entrée « 3 500 € HT » ou « 3500 » ne subsiste sur le site, ni dans le balisage HTML pré-rendu, ni dans les scripts, ni dans les données structurées.
docs/implementation-artifacts/code-reviews/15-4/full.diff:+   **Then** l'Epic 15 (« Repositionnement Commercial V1.1 ») est prêt à être clôturé avec l'ensemble de ses stories (15.1, 15.2, 15.3, 15.4) au statut `done` dans `sprint-status.yaml`.
docs/implementation-artifacts/code-reviews/15-4/full.diff:+  - [x] Vérifier `app/pages/contact/index.vue` : s'assurer de l'absence de champ budget, conformité du libellé de bouton « Décrire mon workflow », accessibilité a11y (focus premier champ invalide, honeypot masqué) et message de confirmation.
docs/implementation-artifacts/code-reviews/15-4/full.diff:+  - [x] Vérifier l'alignement des objets JSON-LD (`WebPage`, `Service`, `ItemList`, `Person`, `ContactPage`, `ProfilePage`, `Blog`) sans prix d'entrée 3 500 € HT.
docs/implementation-artifacts/code-reviews/15-4/full.diff:+  - [x] Lancer une recherche grep globale sur `3 500`, `3500`, `490` pour garantir l'élimination totale de l'ancien catalogue dans `app/`.
docs/implementation-artifacts/code-reviews/15-4/full.diff:+  - [x] Mettre à jour `docs/implementation-artifacts/sprint-status.yaml` pour marquer la story 15.4 et l'epic-15.
docs/implementation-artifacts/code-reviews/15-4/full.diff:+- **Règle NFR6 :** Zéro emoji dans l'UI et le code. Utiliser les icônes vectorielles du composant `<ZIcon>`.
docs/implementation-artifacts/code-reviews/15-4/full.diff:+- [Cahier des Epics : docs/planning-artifacts/epics.md#Story-15-4](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)
docs/implementation-artifacts/code-reviews/15-4/full.diff:+- Grep checks: zéro occurrence de prix obsolètes (`3500`, `3 500`, `490`) dans l'arborescence `app/`.
docs/implementation-artifacts/code-reviews/15-4/full.diff:+- Audit complet du CTA final et du formulaire de contact : conformité avec l'offre V1.1, absence de champ budget obligatoire, validation Web3Forms avec honeypot et a11y.
docs/implementation-artifacts/code-reviews/15-4/full.diff:+- `docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md`
docs/implementation-artifacts/code-reviews/15-4/full.diff:+- `docs/implementation-artifacts/sprint-status.yaml`
docs/implementation-artifacts/code-reviews/15-4/full.diff:diff --git a/docs/implementation-artifacts/deferred-work.md b/docs/implementation-artifacts/deferred-work.md
docs/implementation-artifacts/code-reviews/15-4/full.diff:-- **Enrichir les entités Service de `servicesJsonLd` avec leur URL d'ancrage respective** (`app/pages/services.vue:224`) — Les 3 offres de build ont désormais des ancres HTML stables (`#automatisation`, `#workflow`, `#sur-mesure`). L'ajout explicite du champ `url: `${siteUrl}/services#${offer.id}`` au sein de chaque `Service` du Schema.org ItemList améliorera la précision machine-readable lors de la consolidation transverse SEO (Story 15.4).
docs/implementation-artifacts/code-reviews/15-4/full.diff:+- ~~**Nuancer la mention du Blueprint dans l'étape Cadrage** (`app/pages/services.vue`)~~ — ✅ **Résolu en 15.3** : étape 02 Cadrage mise à jour avec mention du Blueprint facturable optionnel à partir de 750 € HT pour sujets complexes.
docs/implementation-artifacts/code-reviews/15-4/full.diff:+- ~~**Enrichir les entités Service de `servicesJsonLd` avec leur URL d'ancrage respective** (`app/pages/services.vue`)~~ — ✅ **Résolu en 15.3** : attributs `url` pointant vers `#automatisation`, `#workflow`, `#sur-mesure` et `#ai-care` intégrés dans Schema.org `servicesJsonLd`.
docs/implementation-artifacts/code-reviews/15-4/full.diff:diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
docs/implementation-artifacts/code-reviews/15-4/full.diff:--- a/docs/implementation-artifacts/sprint-status.yaml
docs/implementation-artifacts/code-reviews/15-4/full.diff:+++ b/docs/implementation-artifacts/sprint-status.yaml
docs/implementation-artifacts/code-reviews/15-4/full.diff:   epic-15: in-progress
docs/implementation-artifacts/code-reviews/15-4/full.diff:-  15-4-coherence-globale-seo-formulaire-contact-et-gate-docker: backlog
docs/implementation-artifacts/code-reviews/15-4/full.diff:+  15-4-coherence-globale-seo-formulaire-contact-et-gate-docker: review
docs/implementation-artifacts/code-reviews/15-4/full.diff:   epic-15-retrospective: optional
---CONTACT---
     1	<template>
     2	  <main class="contact">
     3	    <section class="section">
     4	      <div class="container">
     5	        <div class="contact__grid">
     6	          <!-- Colonne gauche : en-tête + formulaire (story 7.1 / story 12.6) -->
     7	          <div class="contact__main">
     8	            <p class="eyebrow"><span aria-hidden="true">// </span>contact</p>
     9	            <h1 class="contact__title">Parlons de votre workflow</h1>
    10	            <p class="prose contact__intro">
    11	              Décrivez-moi simplement le processus qui vous ralentit ou vous fait perdre du temps au quotidien. Je vous
    12	              réponds sous 48h avec une première analyse de faisabilité.
    13	            </p>
    14	
    15	            <!-- État « envoyé » : carte accent + ligne mono verte. role="status" + focus
    16	                 programmatique (tabindex -1) → annonce fiable aux lecteurs d'écran. -->
    17	            <ZCard v-if="sent" ref="sentCard" accent class="contact__sent" role="status" tabindex="-1">
    18	              <p class="contact__sent-line"><span aria-hidden="true">✓</span> Message envoyé</p>
    19	              <p class="prose contact__sent-text">
    20	                Merci ! Je vous réponds sous 48h avec une première analyse de faisabilité à votre adresse.
    21	              </p>
    22	            </ZCard>
    23	
    24	            <!-- Formulaire — envoi via Web3Forms (service sans serveur, clé en env). Validation
    25	                 front d'abord ; `novalidate` pour afficher nos messages FR (et non les bulles
    26	                 natives). Compatible site statique : le fetch ne tourne qu'au clic, côté client. -->
    27	            <form v-else ref="formRef" class="contact__form" novalidate @submit.prevent="onSubmit">
    28	              <!-- Honeypot anti-spam : hors flux visuel et hors tabulation ; rempli = bot. -->
    29	              <div class="contact__hp" aria-hidden="true">
    30	                <label>
    31	                  Ne remplissez pas ce champ
    32	                  <input v-model="honeypot" type="text" tabindex="-1" autocomplete="off" />
    33	                </label>
    34	              </div>
    35	
    36	              <div class="contact__row">
    37	                <ZInput
    38	                  v-model="form.name"
    39	                  label="Nom"
    40	                  placeholder="Votre nom"
    41	                  required
    42	                  autocomplete="name"
    43	                  :error="Boolean(errors.name)"
    44	                  :hint="errors.name"
    45	                />
    46	                <ZInput
    47	                  v-model="form.email"
    48	                  label="Email professionnel"
    49	                  type="email"
    50	                  placeholder="vous@entreprise.com"
    51	                  required
    52	                  autocomplete="email"
    53	                  :error="Boolean(errors.email)"
    54	                  :hint="errors.email"
    55	                />
    56	              </div>
    57	
    58	              <div class="contact__row">
    59	                <ZInput
    60	                  v-model="form.company"
    61	                  label="Entreprise"
    62	                  placeholder="Nom de votre structure"
    63	                  autocomplete="organization"
    64	                />
    65	                <ZInput
    66	                  v-model="form.frequency"
    67	                  label="Combien de fois ce process se répète-t-il ?"
    68	                  placeholder="Ex : quotidien, 10x par semaine…"
    69	                  autocomplete="off"
    70	                />
    71	              </div>
    72	
    73	              <ZInput
    74	                v-model="form.workflow"
    75	                label="Quel processus souhaitez-vous améliorer ?"
    76	                placeholder="Ex : qualification des leads, devis BTP, extraction de factures…"
    77	                required
    78	                autocomplete="off"
    79	                :error="Boolean(errors.workflow)"
    80	                :hint="errors.workflow"
    81	              />
    82	
    83	              <ZInput
    84	                v-model="form.currentState"
    85	                label="Comment fonctionne-t-il aujourd’hui ?"
    86	                multiline
    87	                placeholder="Outils utilisés, étapes manuelles, qui intervient, où l’information se perd…"
    88	                required
    89	                :error="Boolean(errors.currentState)"
    90	                :hint="errors.currentState"
    91	              />
    92	
    93	              <!-- Erreur d'envoi réseau (distincte des erreurs de validation par champ). -->
    94	              <p v-if="submitError" class="contact__error" role="alert">{{ submitError }}</p>
    95	
    96	              <div>
    97	                <ZButton type="submit" variant="primary" size="lg" :disabled="sending">
    98	                  {{ sending ? "Envoi en cours…" : "Décrire mon workflow" }}
    99	                  <template #iconRight><ZIcon name="arrow" /></template>
   100	                </ZButton>
   101	              </div>
   102	
   103	              <p class="contact__rgpd">
   104	                En envoyant ce formulaire, vos coordonnées et la description de votre workflow sont transmises via
   105	                Web3Forms à seule fin de qualifier votre besoin et vous répondre. Consultez la
   106	                <NuxtLink to="/confidentialite" class="contact__rgpd-link">politique de confidentialité</NuxtLink>.
   107	              </p>
   108	            </form>
   109	          </div>
   110	
   111	          <!-- Colonne droite (story 7.2) : carte infos + carte CTA terminal + hexagones sociaux -->
   112	          <div class="contact__info">
   113	            <h2 class="screen-reader-text">Coordonnées et terminal</h2>
   114	            <!-- Carte infos : email / localisation / disponibilité -->
   115	            <ZCard class="contact__infocard">
   116	              <dl class="contact__infolist">
   117	                <div class="infoitem">
   118	                  <dt class="infoitem__k"><span aria-hidden="true">// </span>email</dt>
   119	                  <dd class="infoitem__v">
   120	                    <a class="contact__email" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
   121	                  </dd>
   122	                </div>
   123	                <div class="infoitem">
   124	                  <dt class="infoitem__k"><span aria-hidden="true">// </span>localisation</dt>
   125	                  <dd class="infoitem__v">{{ contact.city }}</dd>
   126	                </div>
   127	                <div class="infoitem">
   128	                  <dt class="infoitem__k"><span aria-hidden="true">// </span>disponibilité</dt>
   129	                  <dd class="infoitem__v">
   130	                    <div class="contact__avail"><ZBadge tone="success" dot>Ouvert aux missions freelance</ZBadge></div>
   131	                  </dd>
   132	                </div>
   133	              </dl>
   134	            </ZCard>
   135	
   136	            <!-- Carte d'accès carte de visite digitale & QR Code -->
   137	            <ZCard class="contact__cardcta">
   138	              <p class="contact__cardcta-eyebrow"><span aria-hidden="true">// </span>carte de visite digitale</p>
   139	              <p class="prose contact__cardcta-text">Fiche contact prête à scanner avec QR code vCard.</p>
   140	              <ZButton :as="NuxtLink" to="/contact/card" variant="secondary" size="sm">
   141	                <template #icon><ZIcon name="qr" /></template>
   142	                Carte de visite &amp; QR Code
   143	              </ZButton>
   144	            </ZCard>
   145	
   146	            <!-- Carte CTA terminal : ouvre l'easter-egg via le lanceur partagé (useTerminal) -->
   147	            <ZCard class="contact__term">
   148	              <!-- Prompt décoratif (flavor terminal) : aria-hidden — le bouton + l'invite portent le sens. -->
   149	              <p class="contact__prompt" aria-hidden="true">
   150	                anon.@jouan.ovh:~$ <span class="contact__prompt-cmd">./contact</span>
   151	              </p>
   152	              <p class="prose contact__term-text">Vous préférez la ligne de commande ? Ouvrez le terminal.</p>
   153	              <ZButton variant="terminal" size="sm" aria-haspopup="dialog" @click="openTerminal">
   154	                <template #icon><ZIcon name="terminal" /></template>
   155	                Ouvrir le terminal
   156	              </ZButton>
   157	            </ZCard>
   158	
   159	            <!-- Hexagones sociaux (composant partagé avec le footer) -->
   160	            <LinkListComponent />
   161	          </div>
   162	        </div>
   163	      </div>
   164	    </section>
   165	  </main>
   166	</template>
   167	
   168	<script setup lang="ts">
   169	// Page Contact — colonne gauche : en-tête + formulaire (story 7.1, envoi Web3Forms,
   170	// service tiers SANS serveur). Colonne droite : infos + CTA terminal + socials (story 7.2).
   171	import { nextTick, reactive, ref, watch } from "vue";
   172	import { NuxtLink } from "#components";
   173	import { SITE } from "~/data/site";
   174	
   175	// Infos de contact — source unique `app/data/site.ts`.
   176	const contact = SITE.profile;
   177	
   178	// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le header).
   179	// no-op au prerender (aucun lanceur) → prerender-safe ; ouvre le terminal côté client.
   180	const { open: openTerminal } = useTerminal();
   181	
   182	interface ContactForm {
   183	  name: string;
   184	  email: string;
   185	  company?: string;
   186	  workflow: string;
   187	  currentState: string;
   188	  frequency?: string;
   189	}
   190	
   191	interface Web3FormsResponse {
   192	  success: boolean;
   193	  message: string;
   194	}
   195	
   196	const ERROR_MESSAGE = `L'envoi a échoué. Réessayez, ou écrivez-moi directement à ${SITE.profile.email}.`;
   197	
   198	// Clé Web3Forms injectée par l'env (NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY) — jamais en dur.
   199	const accessKey = useRuntimeConfig().public.web3formsAccessKey;
   200	
   201	const form = reactive<ContactForm>({
   202	  name: "",
   203	  email: "",
   204	  company: "",
   205	  workflow: "",
   206	  currentState: "",
   207	  frequency: "",
   208	});
   209	
   210	// Message d'erreur par champ requis ("" = valide). Rendu sous le champ via ZInput.
   211	const errors = reactive({
   212	  name: "",
   213	  email: "",
   214	  workflow: "",
   215	  currentState: "",
   216	});
   217	
   218	const honeypot = ref("");
   219	const sent = ref(false);
   220	const sending = ref(false);
   221	const submitError = ref("");
   222	// Passe à true au 1er envoi → active la re-validation live (les erreurs se lèvent à la saisie).
   223	const submitted = ref(false);
   224	
   225	const formRef = ref<HTMLFormElement | null>(null);
   226	const sentCard = ref<{ $el: HTMLElement } | null>(null);
   227	
   228	// Format email volontairement permissif (un @, un point dans le domaine) : on évite les
   229	// faux négatifs d'une regex stricte ; Web3Forms revalide côté service.
   230	const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   231	
   232	// Nettoie les espaces et les caractères zero-width / invisibles (ex: \u200B)
   233	function cleanInput(val?: string): string {
   234	  return (val ?? "").replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
   235	}
   236	
   237	function validate(): boolean {
   238	  const name = cleanInput(form.name);
   239	  const email = cleanInput(form.email);
   240	  const workflow = cleanInput(form.workflow);
   241	  const currentState = cleanInput(form.currentState);
   242	
   243	  errors.name = name ? "" : "Votre nom est requis.";
   244	  errors.email = !email ? "Votre email est requis." : EMAIL_RE.test(email) ? "" : "Cet email ne semble pas valide.";
   245	  errors.workflow = workflow ? "" : "Veuillez préciser le processus à améliorer.";
   246	  errors.currentState = currentState ? "" : "Veuillez décrire le fonctionnement actuel.";
   247	  return !errors.name && !errors.email && !errors.workflow && !errors.currentState;
   248	}
   249	
   250	// Après un 1er envoi, re-valider à la saisie : corriger un champ lève son message d'erreur
   251	// sans attendre une nouvelle soumission.
   252	watch(
   253	  () => [form.name, form.email, form.workflow, form.currentState],
   254	  () => {
   255	    if (submitted.value) {
   256	      validate();
   257	    }
   258	  },
   259	);
   260	
   261	async function focusSentCard(): Promise<void> {
   262	  await nextTick();
   263	  sentCard.value?.$el?.focus();
   264	}
   265	
   266	async function onSubmit(): Promise<void> {
   267	  submitted.value = true;
   268	  submitError.value = "";
   269	
   270	  if (!validate()) {
   271	    // a11y : amener le focus sur le 1er champ invalide.
   272	    await nextTick();
   273	    formRef.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
   274	    return;
   275	  }
   276	
   277	  // Honeypot rempli = bot : on n'envoie rien et on affiche l'état de succès.
   278	  if (honeypot.value) {
   279	    sent.value = true;
   280	    await focusSentCard();
   281	    return;
   282	  }
   283	
   284	  sending.value = true;
   285	  try {
   286	    const name = cleanInput(form.name);
   287	    const email = cleanInput(form.email);
   288	    const company = cleanInput(form.company);
   289	    const workflow = cleanInput(form.workflow);
   290	    const currentState = cleanInput(form.currentState);
   291	    const frequency = cleanInput(form.frequency);
   292	    const workflowSubject = workflow.slice(0, 80);
   293	
   294	    const res = await $fetch<Web3FormsResponse>("https://api.web3forms.com/submit", {
   295	      method: "POST",
   296	      body: {
   297	        access_key: accessKey,
   298	        name,
   299	        email,
   300	        company,
   301	        subject: `Qualification de workflow : ${workflowSubject || "Nouveau projet"}`,
   302	        workflow,
   303	        current_state: currentState,
   304	        frequency,
   305	        message: `Processus à améliorer : ${workflow}\n\nFonctionnement actuel :\n${currentState}\n\nFréquence : ${frequency || "Non spécifiée"}\nEntreprise : ${company || "Non spécifiée"}`,
   306	        botcheck: "",
   307	      },
   308	    });
   309	    if (res.success) {
   310	      sent.value = true;
   311	      await focusSentCard();
   312	    } else {
   313	      submitError.value = ERROR_MESSAGE;
   314	    }
   315	  } catch {
   316	    submitError.value = ERROR_MESSAGE;
   317	  } finally {
   318	    sending.value = false;
   319	  }
   320	}
   321	
   322	const siteUrl = useSiteUrl();
   323	
   324	const contactJsonLd = {
   325	  "@context": "https://schema.org",
   326	  "@type": "ContactPage",
   327	  name: "Contact — Simon Jouan",
   328	  description:
   329	    "Parlons de votre workflow : décrivez le processus métier qui vous ralentit pour identifier les opportunités d'automatisation et d'agents IA adaptés.",
   330	  url: `${siteUrl}/contact`,
   331	  mainEntity: {
   332	    "@type": "Person",
   333	    name: SITE.profile.name,
   334	    email: SITE.profile.email,
   335	    address: {
   336	      "@type": "PostalAddress",
   337	      addressLocality: SITE.profile.city,
   338	      addressCountry: "FR",
   339	    },
   340	  },
   341	};
   342	
   343	usePageSeo({
   344	  title: "Contact — Simon Jouan",
   345	  description:
   346	    "Parlons de votre workflow : décrivez le processus métier qui vous ralentit pour identifier les opportunités d'automatisation et d'agents IA adaptés.",
   347	  path: "/contact",
   348	  image: "/images/portrait.jpeg",
   349	  type: "website",
   350	  jsonLd: contactJsonLd,
   351	});
   352	</script>
   353	
   354	<style lang="scss" scoped>
   355	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / Contact.jsx */
   356	// .section / .container / .eyebrow / .prose sont des primitives de layout globales
   357	// (app/assets/scss/base/_layout.scss) — non redéclarées ici.
   358	.contact {
   359	  display: block;
   360	}
---SEO CALLS---
app/pages/about.vue-172-    },
app/pages/about.vue-173-  },
app/pages/about.vue-174-};
app/pages/about.vue-175-
app/pages/about.vue:176:usePageSeo({
app/pages/about.vue-177-  title: pageTitle,
app/pages/about.vue:178:  description: pageDescription,
app/pages/about.vue-179-  path: "/about",
app/pages/about.vue-180-  image: "/images/portrait.jpeg",
app/pages/about.vue-181-  type: "profile",
app/pages/about.vue-182-  twitterCard: "summary",
app/pages/about.vue:183:  jsonLd: aboutJsonLd,
app/pages/about.vue-184-});
app/pages/about.vue-185-</script>
app/pages/about.vue-186-
app/pages/about.vue-187-<style lang="scss" scoped>
--
app/composables/usePageSeo.ts-6-  title: string;
app/composables/usePageSeo.ts-7-  /** Titre optionnel spécifique pour Open Graph et Twitter (ex. titre d'article sans suffixe). */
app/composables/usePageSeo.ts-8-  ogTitle?: string;
app/composables/usePageSeo.ts-9-  /** Description de la page (utilisée pour <meta name="description">, og:description, twitter:description). */
app/composables/usePageSeo.ts:10:  description: string;
app/composables/usePageSeo.ts-11-  /** Chemin relatif de la page (ex. "/" ou "/services" ou "/blog/slug"). Si omis, résolu sur siteUrl. */
app/composables/usePageSeo.ts-12-  path?: string;
app/composables/usePageSeo.ts-13-  /** Chemin relatif ou absolu de l'image OG/Twitter (ex. "/images/portrait.jpeg"). Résolue en URL absolue. */
app/composables/usePageSeo.ts-14-  image?: string;
--
app/composables/usePageSeo.ts-17-  /** Type Open Graph : "website" (défaut), "article" ou "profile". */
app/composables/usePageSeo.ts-18-  type?: "website" | "article" | "profile";
app/composables/usePageSeo.ts-19-  /** Format Twitter Card : si omis, "summary_large_image" si type article avec image, sinon "summary". */
app/composables/usePageSeo.ts-20-  twitterCard?: "summary" | "summary_large_image";
app/composables/usePageSeo.ts:21:  /** Données JSON-LD (objet Schema.org ou tableau d'objets) injectées via jsonLdScript. */
app/composables/usePageSeo.ts:22:  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
app/composables/usePageSeo.ts-23-}
app/composables/usePageSeo.ts-24-
app/composables/usePageSeo.ts-25-/**
app/composables/usePageSeo.ts-26- * Composable centralisant la déclaration des métadonnées SEO par page :
--
app/composables/usePageSeo.ts-28- * et Twitter Card (card, title, desc, image, alt) + JSON-LD échappé.
app/composables/usePageSeo.ts-29- *
app/composables/usePageSeo.ts-30- * Résout automatiquement les URLs absolues à partir de `useSiteUrl()` (runtimeConfig).
app/composables/usePageSeo.ts-31- */
app/composables/usePageSeo.ts:32:export function usePageSeo(options: MaybeRefOrGetter<PageSeoOptions | undefined | null>): void {
app/composables/usePageSeo.ts-33-  const siteUrl = useSiteUrl();
app/composables/usePageSeo.ts-34-
app/composables/usePageSeo.ts-35-  const seo = computed(() => {
app/composables/usePageSeo.ts-36-    const opts = toValue(options);
--
app/composables/usePageSeo.ts-54-
app/composables/usePageSeo.ts-55-    return {
app/composables/usePageSeo.ts-56-      title: opts.title,
app/composables/usePageSeo.ts-57-      ogTitle: opts.ogTitle ?? opts.title,
app/composables/usePageSeo.ts:58:      description: opts.description,
app/composables/usePageSeo.ts-59-      canonicalUrl,
app/composables/usePageSeo.ts-60-      imageUrl,
app/composables/usePageSeo.ts-61-      imageAlt: opts.imageAlt,
app/composables/usePageSeo.ts-62-      type,
app/composables/usePageSeo.ts-63-      twitterCard,
app/composables/usePageSeo.ts:64:      jsonLd: opts.jsonLd,
app/composables/usePageSeo.ts-65-    };
app/composables/usePageSeo.ts-66-  });
app/composables/usePageSeo.ts-67-
app/composables/usePageSeo.ts-68-  useHead(() => {
--
app/composables/usePageSeo.ts-70-      return {};
app/composables/usePageSeo.ts-71-    }
app/composables/usePageSeo.ts-72-
app/composables/usePageSeo.ts-73-    const scripts: Array<{ type: string; innerHTML: string }> = [];
app/composables/usePageSeo.ts:74:    if (seo.value.jsonLd) {
app/composables/usePageSeo.ts:75:      if (Array.isArray(seo.value.jsonLd)) {
app/composables/usePageSeo.ts:76:        for (const item of seo.value.jsonLd) {
app/composables/usePageSeo.ts:77:          scripts.push(jsonLdScript(item));
app/composables/usePageSeo.ts-78-        }
app/composables/usePageSeo.ts-79-      } else {
app/composables/usePageSeo.ts:80:        scripts.push(jsonLdScript(seo.value.jsonLd));
app/composables/usePageSeo.ts-81-      }
app/composables/usePageSeo.ts-82-    }
app/composables/usePageSeo.ts-83-
app/composables/usePageSeo.ts-84-    return {
--
app/composables/usePageSeo.ts-89-  });
app/composables/usePageSeo.ts-90-
app/composables/usePageSeo.ts-91-  useSeoMeta({
app/composables/usePageSeo.ts-92-    title: () => seo.value?.title,
app/composables/usePageSeo.ts:93:    description: () => seo.value?.description,
app/composables/usePageSeo.ts-94-    ogTitle: () => seo.value?.ogTitle,
app/composables/usePageSeo.ts-95-    ogDescription: () => seo.value?.description,
app/composables/usePageSeo.ts-96-    ogUrl: () => seo.value?.canonicalUrl,
app/composables/usePageSeo.ts-97-    ogType: () => seo.value?.type,
--
app/pages/blog/[...slug].vue-118-    }
app/pages/blog/[...slug].vue-119-  });
app/pages/blog/[...slug].vue-120-}
app/pages/blog/[...slug].vue-121-
app/pages/blog/[...slug].vue:122:// SEO par article (centralisé via usePageSeo, parité /about, /blog).
app/pages/blog/[...slug].vue:123:// usePageSeo résout siteUrl, canonical, og:*, twitter:* et le JSON-LD échappé.
app/pages/blog/[...slug].vue-124-const siteUrl = useSiteUrl();
app/pages/blog/[...slug].vue:125:usePageSeo(() => {
app/pages/blog/[...slug].vue-126-  const article = page.value;
app/pages/blog/[...slug].vue-127-  if (!article) {
app/pages/blog/[...slug].vue-128-    return null;
app/pages/blog/[...slug].vue-129-  }
--
app/pages/blog/[...slug].vue-132-    ? article.image.src.startsWith("/")
app/pages/blog/[...slug].vue-133-      ? `${siteUrl}${article.image.src}`
app/pages/blog/[...slug].vue-134-      : `${siteUrl}/${article.image.src}`
app/pages/blog/[...slug].vue-135-    : undefined;
app/pages/blog/[...slug].vue:136:  const jsonLd = {
app/pages/blog/[...slug].vue-137-    "@context": "https://schema.org",
app/pages/blog/[...slug].vue-138-    "@type": "BlogPosting",
app/pages/blog/[...slug].vue-139-    headline: article.title,
app/pages/blog/[...slug].vue:140:    description: article.description,
app/pages/blog/[...slug].vue-141-    datePublished: article.date,
app/pages/blog/[...slug].vue-142-    author: {
app/pages/blog/[...slug].vue-143-      "@type": "Person",
app/pages/blog/[...slug].vue-144-      name: SITE.profile.name,
--
app/pages/blog/[...slug].vue-158-
app/pages/blog/[...slug].vue-159-  return {
app/pages/blog/[...slug].vue-160-    title: `${article.title} — Simon Jouan`,
app/pages/blog/[...slug].vue-161-    ogTitle: article.title,
app/pages/blog/[...slug].vue:162:    description: article.description,
app/pages/blog/[...slug].vue-163-    path: article.path,
app/pages/blog/[...slug].vue-164-    image: article.image?.src,
app/pages/blog/[...slug].vue-165-    imageAlt: article.image?.alt,
app/pages/blog/[...slug].vue-166-    type: "article",
app/pages/blog/[...slug].vue:167:    jsonLd,
app/pages/blog/[...slug].vue-168-  };
app/pages/blog/[...slug].vue-169-});
app/pages/blog/[...slug].vue-170-</script>
app/pages/blog/[...slug].vue-171-
--
app/pages/blog/index.vue-110-const blogJsonLd = {
app/pages/blog/index.vue-111-  "@context": "https://schema.org",
app/pages/blog/index.vue-112-  "@type": "Blog",
app/pages/blog/index.vue-113-  name: "Notes de dev",
app/pages/blog/index.vue:114:  description: pageDescription,
app/pages/blog/index.vue-115-  url: pageUrl,
app/pages/blog/index.vue-116-  blogPost: (articles.value ?? []).map((article) => ({
app/pages/blog/index.vue-117-    "@type": "BlogPosting",
app/pages/blog/index.vue-118-    headline: article.title,
app/pages/blog/index.vue:119:    description: article.description,
app/pages/blog/index.vue-120-    datePublished: article.date,
app/pages/blog/index.vue-121-    author: {
app/pages/blog/index.vue-122-      "@type": "Person",
app/pages/blog/index.vue-123-      name: SITE.profile.name,
--
app/pages/blog/index.vue-141-      : {}),
app/pages/blog/index.vue-142-  })),
app/pages/blog/index.vue-143-};
app/pages/blog/index.vue-144-
app/pages/blog/index.vue:145:usePageSeo({
app/pages/blog/index.vue-146-  title: pageTitle,
app/pages/blog/index.vue:147:  description: pageDescription,
app/pages/blog/index.vue-148-  path: "/blog",
app/pages/blog/index.vue-149-  type: "website",
app/pages/blog/index.vue:150:  jsonLd: blogJsonLd,
app/pages/blog/index.vue-151-});
app/pages/blog/index.vue-152-</script>
app/pages/blog/index.vue-153-
app/pages/blog/index.vue-154-<style lang="scss" scoped>
--
app/pages/contact/card.vue-99-    addressCountry: "FR",
app/pages/contact/card.vue-100-  },
app/pages/contact/card.vue-101-};
app/pages/contact/card.vue-102-
app/pages/contact/card.vue:103:usePageSeo({
app/pages/contact/card.vue-104-  title: "Carte de visite — Simon Jouan",
app/pages/contact/card.vue:105:  description:
app/pages/contact/card.vue-106-    "Fiche contact et QR code vCard de Simon Jouan, Développeur Full Stack spécialisé en systèmes IA et automatisation métier.",
app/pages/contact/card.vue-107-  path: "/contact/card",
app/pages/contact/card.vue-108-  image: "/images/portrait.jpeg",
app/pages/contact/card.vue-109-  type: "profile",
app/pages/contact/card.vue:110:  jsonLd: cardJsonLd,
app/pages/contact/card.vue-111-});
app/pages/contact/card.vue-112-</script>
app/pages/contact/card.vue-113-
app/pages/contact/card.vue-114-<style lang="scss" scoped>
--
app/pages/services.vue-294-const servicesJsonLd = {
app/pages/services.vue-295-  "@context": "https://schema.org",
app/pages/services.vue-296-  "@type": "WebPage",
app/pages/services.vue-297-  name: "Services & Systèmes IA — Simon Jouan",
app/pages/services.vue:298:  description:
app/pages/services.vue-299-    "Conception et développement de systèmes IA et automatisation de processus métier : automatisation ciblée, workflows complets et applications métier sur mesure.",
app/pages/services.vue-300-  url: `${siteUrl}/services`,
app/pages/services.vue-301-  mainEntity: {
app/pages/services.vue-302-    "@type": "ItemList",
--
app/pages/services.vue-306-        position: index + 1,
app/pages/services.vue-307-        item: {
app/pages/services.vue-308-          "@type": "Service",
app/pages/services.vue-309-          name: offer.title,
app/pages/services.vue:310:          description: offer.desc,
app/pages/services.vue-311-          url: `${siteUrl}/services#${offer.id}`,
app/pages/services.vue-312-          provider: {
app/pages/services.vue-313-            "@type": "Organization",
app/pages/services.vue-314-            "@id": `${siteUrl}/#organization`,
app/pages/services.vue-315-            name: SITE.profile.name,
app/pages/services.vue-316-          },
app/pages/services.vue-317-          offers: {
app/pages/services.vue-318-            "@type": "Offer",
app/pages/services.vue:319:            description: offer.price,
app/pages/services.vue-320-          },
app/pages/services.vue-321-        },
app/pages/services.vue-322-      })),
app/pages/services.vue-323-      {
--
app/pages/services.vue-325-        position: offers.length + 1,
app/pages/services.vue-326-        item: {
app/pages/services.vue-327-          "@type": "Service",
app/pages/services.vue-328-          name: careOffer.title,
app/pages/services.vue:329:          description: careOffer.desc,
app/pages/services.vue-330-          url: `${siteUrl}/services#${careOffer.id}`,
app/pages/services.vue-331-          provider: {
app/pages/services.vue-332-            "@type": "Organization",
app/pages/services.vue-333-            "@id": `${siteUrl}/#organization`,
app/pages/services.vue-334-            name: SITE.profile.name,
app/pages/services.vue-335-          },
app/pages/services.vue-336-          offers: {
app/pages/services.vue-337-            "@type": "Offer",
app/pages/services.vue:338:            description: careOffer.price,
app/pages/services.vue-339-          },
app/pages/services.vue-340-        },
app/pages/services.vue-341-      },
app/pages/services.vue-342-    ],
app/pages/services.vue-343-  },
app/pages/services.vue-344-};
app/pages/services.vue-345-
app/pages/services.vue:346:usePageSeo({
app/pages/services.vue-347-  title: "Services & Systèmes IA — Simon Jouan",
app/pages/services.vue:348:  description:
app/pages/services.vue-349-    "Conception et développement de systèmes IA et automatisation de processus métier : automatisation ciblée, workflows complets et applications métier sur mesure.",
app/pages/services.vue-350-  path: "/services",
app/pages/services.vue-351-  image: "/images/portrait.jpeg",
app/pages/services.vue-352-  type: "website",
app/pages/services.vue:353:  jsonLd: servicesJsonLd,
app/pages/services.vue-354-});
app/pages/services.vue-355-</script>
app/pages/services.vue-356-
app/pages/services.vue-357-<style lang="scss" scoped>
--
app/pages/contact/index.vue-324-const contactJsonLd = {
app/pages/contact/index.vue-325-  "@context": "https://schema.org",
app/pages/contact/index.vue-326-  "@type": "ContactPage",
app/pages/contact/index.vue-327-  name: "Contact — Simon Jouan",
app/pages/contact/index.vue:328:  description:
app/pages/contact/index.vue-329-    "Parlons de votre workflow : décrivez le processus métier qui vous ralentit pour identifier les opportunités d'automatisation et d'agents IA adaptés.",
app/pages/contact/index.vue-330-  url: `${siteUrl}/contact`,
app/pages/contact/index.vue-331-  mainEntity: {
app/pages/contact/index.vue-332-    "@type": "Person",
--
app/pages/contact/index.vue-339-    },
app/pages/contact/index.vue-340-  },
app/pages/contact/index.vue-341-};
app/pages/contact/index.vue-342-
app/pages/contact/index.vue:343:usePageSeo({
app/pages/contact/index.vue-344-  title: "Contact — Simon Jouan",
app/pages/contact/index.vue:345:  description:
app/pages/contact/index.vue-346-    "Parlons de votre workflow : décrivez le processus métier qui vous ralentit pour identifier les opportunités d'automatisation et d'agents IA adaptés.",
app/pages/contact/index.vue-347-  path: "/contact",
app/pages/contact/index.vue-348-  image: "/images/portrait.jpeg",
app/pages/contact/index.vue-349-  type: "website",
app/pages/contact/index.vue:350:  jsonLd: contactJsonLd,
app/pages/contact/index.vue-351-});
app/pages/contact/index.vue-352-</script>
app/pages/contact/index.vue-353-
app/pages/contact/index.vue-354-<style lang="scss" scoped>
--
app/pages/mentions-legales.vue-89-</template>
app/pages/mentions-legales.vue-90-
app/pages/mentions-legales.vue-91-<script setup lang="ts">
app/pages/mentions-legales.vue-92-import { SITE } from "~/data/site";
app/pages/mentions-legales.vue:93:import { usePageSeo } from "~/composables/usePageSeo";
app/pages/mentions-legales.vue-94-
app/pages/mentions-legales.vue-95-const profile = SITE.profile;
app/pages/mentions-legales.vue-96-
app/pages/mentions-legales.vue:97:usePageSeo({
app/pages/mentions-legales.vue-98-  title: "Mentions légales — Simon Jouan",
app/pages/mentions-legales.vue:99:  description: "Mentions légales, informations éditeur et hébergement du site jouan.ovh — Simon Jouan.",
app/pages/mentions-legales.vue-100-  path: "/mentions-legales",
app/pages/mentions-legales.vue-101-  type: "website",
app/pages/mentions-legales.vue-102-});
app/pages/mentions-legales.vue-103-</script>
--
app/pages/confidentialite.vue-151-</template>
app/pages/confidentialite.vue-152-
app/pages/confidentialite.vue-153-<script setup lang="ts">
app/pages/confidentialite.vue-154-import { SITE } from "~/data/site";
app/pages/confidentialite.vue:155:import { usePageSeo } from "~/composables/usePageSeo";
app/pages/confidentialite.vue-156-
app/pages/confidentialite.vue-157-const profile = SITE.profile;
app/pages/confidentialite.vue-158-
app/pages/confidentialite.vue:159:usePageSeo({
app/pages/confidentialite.vue-160-  title: "Politique de confidentialité — Simon Jouan",
app/pages/confidentialite.vue:161:  description:
app/pages/confidentialite.vue-162-    "Politique de confidentialité et protection des données personnelles (RGPD) du site jouan.ovh — Simon Jouan.",
app/pages/confidentialite.vue-163-  path: "/confidentialite",
app/pages/confidentialite.vue-164-  type: "website",
app/pages/confidentialite.vue-165-});
--
app/pages/index.vue-460-    "@context": "https://schema.org",
app/pages/index.vue-461-    "@type": "WebSite",
app/pages/index.vue-462-    name: "Simon Jouan — Systèmes IA, agents & automatisation métier",
app/pages/index.vue-463-    url: siteUrl,
app/pages/index.vue:464:    description: SITE.profile.role,
app/pages/index.vue-465-  },
app/pages/index.vue-466-  {
app/pages/index.vue-467-    "@context": "https://schema.org",
app/pages/index.vue-468-    "@type": "Person",
--
app/pages/index.vue-478-    },
app/pages/index.vue-479-  },
app/pages/index.vue-480-];
app/pages/index.vue-481-
app/pages/index.vue:482:usePageSeo({
app/pages/index.vue-483-  title: "Simon Jouan — Systèmes IA, agents & automatisation métier",
app/pages/index.vue:484:  description:
app/pages/index.vue-485-    "Développeur Full Stack spécialisé en systèmes IA et automatisation métier. Agents IA, intégrations, applications sur mesure et workflows mis en production.",
app/pages/index.vue-486-  path: "/",
app/pages/index.vue-487-  image: "/images/portrait.jpeg",
app/pages/index.vue-488-  type: "website",
app/pages/index.vue:489:  jsonLd: homeJsonLd,
app/pages/index.vue-490-});
app/pages/index.vue-491-</script>
app/pages/index.vue-492-
app/pages/index.vue-493-<style lang="scss" scoped>
---REFERENCES---
AGENTS.md-169-   - 13 routes statiques (+ assets) pré-rendues avec succès par Nitro.
AGENTS.md-170-2. **Vérification visuelle & comportementale :**
AGENTS.md-171-   - Contrôle visuel comparatif sur navigateur (desktop et mobile) conforme à la maquette cible.
AGENTS.md:172:   - Rendu fidèle au Design System (thème sombre aubergine, orange accent, typographie Ubuntu).
AGENTS.md-173-   - Navigation clavier fonctionnelle (focus visible, ordre logique).
AGENTS.md-174-   - Pas de valeurs CSS en dur non justifiées.
AGENTS.md-175-
--
docs/implementation-artifacts/sprint-status.yaml-35-# - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
docs/implementation-artifacts/sprint-status.yaml-36-
docs/implementation-artifacts/sprint-status.yaml-37-generated: 2026-06-18
docs/implementation-artifacts/sprint-status.yaml:38:last_updated: "2026-09-18 (Story 15.4 terminée et prête pour review)"
docs/implementation-artifacts/sprint-status.yaml-39-project: jouan.ovh
docs/implementation-artifacts/sprint-status.yaml-40-project_key: NOKEY
docs/implementation-artifacts/sprint-status.yaml-41-tracking_system: file-system
--
docs/implementation-artifacts/sprint-status.yaml-139-
docs/implementation-artifacts/sprint-status.yaml-140-  # Epic 13 — Thème Light & Dark et Bascule Utilisateur
docs/implementation-artifacts/sprint-status.yaml-141-  epic-13: done
docs/implementation-artifacts/sprint-status.yaml:142:  13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal: done
docs/implementation-artifacts/sprint-status.yaml:143:  13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc: done
docs/implementation-artifacts/sprint-status.yaml:144:  13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile: done
docs/implementation-artifacts/sprint-status.yaml-145-  13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg: done
docs/implementation-artifacts/sprint-status.yaml-146-  epic-13-retrospective: optional
docs/implementation-artifacts/sprint-status.yaml-147-
--
docs/project-context.md-225-
docs/project-context.md-226-- La **fonctionnalité terminal** draggable (`components/terminal/`) est un
docs/project-context.md-227-  easter-egg à conserver — le design system la garde comme feature secondaire.
docs/project-context.md:228:- Le **dark-first** : pas de thème clair. Surfaces sombres teintées aubergine,
docs/project-context.md-229-  orange Ubuntu comme unique accent héros.
docs/project-context.md-230-- Respect de `prefers-reduced-motion` ; seule animation en boucle = le caret du
docs/project-context.md-231-  terminal.
--
docs/project-context.md-284-- Mettre à jour quand la stack change.
docs/project-context.md-285-- Revue périodique ; retirer les règles devenues évidentes.
docs/project-context.md-286-
docs/project-context.md:287:Dernière mise à jour : 2026-09-18 (post-Epic 12 : repositionnement commercial V1 « Systèmes IA & Automatisation Métier » livré et déployé en production — epics 1→12 done ; refonte du Hero commercial, vitrine des 3 services et bloc différenciateur Prototype → Production ; 3 projets phares V1 Keova Signal, Debrief, Devis-Assist ; page Services avec offres Sprint, Blueprint, AI Care et process 4 étapes ; page À propos avec trajectoire métrologie/QA ; formulaire de contact avec qualification de workflow ; CTA inspecteur workflow ; SEO et Schema.org site-wide ; patch layout z-index .section stabilisé ; PR #7 mergée sur main et déploiement gh-pages actif sur https://jouan.ovh).
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-18-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-19-La priorité de cette version est simple :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-20-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:21:> **Permettre à un prospect de comprendre que Simon peut traiter aussi bien une automatisation ciblée qu'un workflow métier complet, sans donner l'impression qu'un projet démarre obligatoirement à 3 500 € HT.**
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-22-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-23-Cette version remplace la logique précédente où plusieurs cartes affichaient publiquement :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-24-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-25-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:26:À partir de 3 500 € HT
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-27-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-28-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-29-Le prix reste un sujet commercial important, mais il doit intervenir **après compréhension du processus, de sa fréquence, de son impact et du périmètre réel**.
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-68-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-69-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-70-Projet IA
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:71:→ minimum 3 500 €
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-72-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-73-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-74-Elle doit être comprise comme :
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-112-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-113-Une cinquième brique intervient après livraison lorsque cela se justifie :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-114-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:115:5. AI Care
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-116-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:117:Le **Blueprint** n'est plus présenté comme une offre principale au même niveau que les autres. Il devient un **cadrage facturable optionnel** pour les sujets complexes.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-118-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-119----
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-120-
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-314-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-315-## Prix public
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-316-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:317:**Ne pas afficher `À partir de 3 500 € HT`.**
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-318-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-319-Afficher :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-320-
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-397-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-398----
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-399-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:400:# 8. Cadrage complexe — Blueprint optionnel
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-401-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-402-## Nom
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-403-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-404-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:405:AI Workflow Blueprint
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-406-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-407-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-408-## Statut
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-445-Il est possible de conserver :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-446-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-447-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:448:À partir de 750 € HT
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-449-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-450-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-451-Mais **ne pas en faire une des trois offres principales de la page Services**.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-452-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:453:Le Blueprint doit apparaître comme :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-454-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-455-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-456-Pour les sujets complexes, un cadrage détaillé peut être proposé avant le développement.
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-458-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-459----
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-460-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:461:# 9. Offre 5 — AI Care
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-462-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-463-## Nom
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-464-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-465-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:466:AI Care
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-467-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-468-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-469-## Positionnement
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-470-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:471:AI Care n'est pas un abonnement ajouté automatiquement à tous les projets.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-472-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-473-Il est proposé lorsqu'une capacité mise en production doit être :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-474-
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-483-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-484-> **Une automatisation utile doit continuer à fonctionner après sa mise en production.**
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-485->
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:486:> AI Care couvre le maintien en condition opérationnelle du système : monitoring, maintenance, support, suivi des coûts et adaptations mineures liées aux APIs ou aux modèles.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-487-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-488-## Peut inclure
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-489-
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-512-Conserver pour cette version :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-513-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-514-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:515:À partir de 250 € HT / mois
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-516-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-517-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-518-Ce prix reste une hypothèse commerciale à tester.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-519-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:520:Le `250 € HT / mois` constitue un **plancher de maintenance**, adapté à une automatisation simple, peu critique et peu consommatrice de support.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-521-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-522-Repères internes de travail, non destinés à devenir une grille publique rigide :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-523-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-524-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:525:≈ 250–350 € / mois
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-526-Automatisation simple, faible criticité, faible volume, surveillance légère.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-527-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-528-≈ 400–700 € / mois
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-581-En particulier, retirer :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-582-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-583-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:584:À partir de 3 500 € HT
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-585-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-586-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-587-des cartes :
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-632-Elle corrige directement l'interprétation actuelle :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-633-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-634-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:635:"Simon = projet minimum à 3 500 €"
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-636-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-637-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-638-sans pour autant positionner Simon comme prestataire low-cost.
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-805-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-806----
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-807-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:808:# 14. Page Services — AI Care séparé
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-809-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:810:Ne pas afficher AI Care comme une alternative équivalente aux trois offres de build.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-811-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-812-Créer une section après les offres principales.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-813-
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-826-## Carte ou bloc
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-827-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-828-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:829:AI Care
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:830:À partir de 250 € HT / mois
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-831-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-832-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-833-Texte :
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-837-CTA :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-838-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-839-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:840:Découvrir AI Care
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-841-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-842-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-843----
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-861-Pour les sujets complexes :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-862-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-863-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:864:Un Blueprint facturable peut être proposé lorsque le cadrage nécessite un travail approfondi avant devis.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-865-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-866-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-867-## 03 — Construction & intégration
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-965-Sur devis
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-966-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-967-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:968:### AI Care
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-969-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-970-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:971:À partir de 250 € HT / mois
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-972-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-973-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:974:### Blueprint
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-975-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-976-Seulement lorsqu'il est présenté :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-977-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-978-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:979:À partir de 750 € HT
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-980-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-981-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-982----
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-985-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-986-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-987-Automatisation de processus métier
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:988:À partir de 3 500 € HT
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-989-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-990-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-991-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-992-Agents IA intégrés à vos outils
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:993:À partir de 3 500 € HT
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-994-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-995-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-996-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-997-AI Workflow Sprint
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:998:À partir de 3 500 € HT
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-999-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1000-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1001:Le prix de 3 500 / 3 900 € reste une hypothèse commerciale interne pour les projets correspondant réellement au niveau Workflow Sprint.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1002-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1003----
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1004-
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1111-- augmenter le prix du Workflow Sprint ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1112-- supprimer une catégorie peu rentable ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1113-- spécialiser une offre par verticale ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1114:- rendre AI Care obligatoire sur certains systèmes critiques.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1115-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1116-Mais aucune de ces décisions ne doit être prise avant d'avoir observé plusieurs opportunités réelles.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1117-
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1128-   - CTA ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1129-   - libellés de prix ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1130-   - éventuels textes associés à l'offre.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1131:5. Supprimer les prix `À partir de 3 500 € HT` des cartes publiques concernées.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1132-6. Ne pas remplacer ces prix par un prix plus bas.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1133-7. Ne pas créer une grille SaaS rigide.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1134-8. Présenter :
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1136-   - Workflow métier ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1137-   - Système métier sur mesure ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1138-   comme trois niveaux d'intervention.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1139:9. Conserver AI Care comme offre d'exploitation séparée.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1140:10. Garder le Blueprint comme option de cadrage complexe, pas comme offre cœur.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1141-11. Réutiliser les composants existants autant que possible.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1142-12. Ne pas inventer :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1143-   - ROI ;
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1169-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1170-La mise à jour est réussie si :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1171-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1172:- [ ] aucun `À partir de 3 500 € HT` n'est affiché sur les cartes Automatisation / Agents IA ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1173:- [ ] le site ne donne plus l'impression que toute intervention coûte au minimum 3 500 € ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1174-- [ ] l'offre distingue clairement automatisation ciblée, workflow métier et système métier ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1175-- [ ] le Workflow métier reste visuellement identifiable comme offre cœur ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1176-- [ ] aucune offre low-cost artificielle n'est créée ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1177-- [ ] aucun prix fictif n'est ajouté ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1178-- [ ] le Diagnostic reste accessible ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1179:- [ ] le Blueprint devient secondaire / optionnel ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1180:- [ ] AI Care reste séparé du build ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1181:- [ ] `À partir de 250 € HT / mois` reste affiché pour AI Care ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1182-- [ ] le CTA principal parle toujours d'un workflow ou processus ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1183-- [ ] le discours reste centré sur le problème métier ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1184-- [ ] le Full Stack reste une preuve de capacité et non le produit principal ;
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1218-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1219-AI CARE
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1220-Maintenir la capacité en production.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1221:À partir de 250 € HT / mois.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1222-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1223-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1224-Pour les sujets complexes :
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1226-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1227-AI WORKFLOW BLUEPRINT
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1228-Cadrage approfondi avant engagement.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1229:À partir de 750 € HT.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1230-Optionnel.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1231-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1232-
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1250-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1251-# 27. Décision V1.1
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1252-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1253:La V1.1 retire le ticket d'entrée public de **3 500 € HT**.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1254-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1255-Ce changement ne signifie pas :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1256-
--
docs/planning-artifacts/epics.md-18-  - docs/specs/spec-repositionnement-ia/projects-showcase.md
docs/planning-artifacts/epics.md-19-  - docs/jouan-ovh-offre-v1-brief-codex.md
docs/planning-artifacts/epics.md-20-  - AGENTS.md
docs/planning-artifacts/epics.md:21:  - docs/specs/spec-theme-light-dark/SPEC.md
docs/planning-artifacts/epics.md:22:  - docs/specs/spec-theme-light-dark/technical-architecture.md
docs/planning-artifacts/epics.md-23-  - docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md
docs/planning-artifacts/epics.md-24-  - docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md
docs/planning-artifacts/epics.md-25-  - docs/specs/spec-analytics-search-console/SPEC.md
--
docs/planning-artifacts/epics.md-78-FR29: Page d'accueil — Hero commercial cinétique & Terminal interactif (H1 « Automatisez les workflows qui freinent votre équipe », sous-titre d'intégration de systèmes, CTAs vers workflow, commandes terminal `whoami`, `cat focus.txt`, `ls ~/systems`). _(CAP-2)_
docs/planning-artifacts/epics.md-79-FR30: Page d'accueil — Vitrine des 3 services ciblés & Bloc différenciateur « Prototype → Production » (Automatisation, Agents IA, Applications sur mesure, suivi de « Un agent qui fonctionne trois fois n'est pas encore un système fiable » articulé sur 4 piliers). _(CAP-3)_
docs/planning-artifacts/epics.md-80-FR31: Page d'accueil — Vitrine des 3 projets phares (Keova Signal avec dashboard réel HD, Debrief 100% on-device avec capture HD, Devis-Assist avec pipeline OCR BTP et matching pg_trgm, sans faux ROI, relégation des anciens projets en archives/parcours). _(CAP-4)_
docs/planning-artifacts/epics.md:81:FR32: Page Services — Restructuration complète des offres & Processus en 4 étapes (Workflow Sprint à 3 500 € HT, Blueprint à 750 € HT, AI Care à 490 € HT/mois hors consommations tierces, et process Diagnostic → Cadrage → Build → Suivi). _(CAP-5)_
docs/planning-artifacts/epics.md-82-FR33: Page À propos — Trajectoire professionnelle et rigueur QA (métrologie industrielle → QA logicielle → Full Stack → systèmes IA en production). _(CAP-6)_
docs/planning-artifacts/epics.md-83-FR34: CTA global inspecteur de workflow (`$ ./workflow --inspect`) et formulaire de contact orienté qualification de processus. _(CAP-7)_
docs/planning-artifacts/epics.md-84-FR35: SEO centralisé, OpenGraph et Schema.org/JSON-LD alignés sur « Systèmes IA, agents & automatisation métier ». _(CAP-8)_
docs/planning-artifacts/epics.md-85-FR36: Préservation de la DA terminal dark-first, accessibilité WCAG AA, conformité motion réduit et validation de la gate Docker 100% verte. _(CAP-9)_
docs/planning-artifacts/epics.md-86-
docs/planning-artifacts/epics.md:87:#### Epic 13 — Thème Light & Dark (SPEC-theme-light-dark)
docs/planning-artifacts/epics.md:88:FR37: Palette de thèmes et tokens sémantiques complets (mode sombre aubergine par défaut et mode clair « Papier technique / Crème solaire », sanctuarisation du terminal sombre, contrastes WCAG AAA/AA). _(CAP-1)_
docs/planning-artifacts/epics.md-89-FR38: Détection automatique et synchronisation réactive de la préférence système (`prefers-color-scheme`) en temps réel sans rechargement de page. _(CAP-2)_
docs/planning-artifacts/epics.md:90:FR39: Surcharge utilisateur et persistance locale sous `localStorage` (`jouan_theme_mode`) conservant le choix d'une visite à l'autre. _(CAP-3)_
docs/planning-artifacts/epics.md-91-FR40: Composant de bascule ternaire `ThemeToggle` dans le Header desktop (`hdr__dock-right` à gauche de « Disponible ») et dans le tiroir mobile, avec cycle `Système → Sombre → Clair → Système`, icônes vectorielles et 0 emoji. _(CAP-4)_
docs/planning-artifacts/epics.md-92-FR41: Prévention absolue du flash au premier paint (script inline synchrone anti-FOUC dans le `<head>` avant le montage client). _(CAP-5)_
docs/planning-artifacts/epics.md-93-FR42: Accessibilité, focus visible, navigation clavier et support de `forced-colors` Windows High Contrast. _(CAP-6)_
--
docs/planning-artifacts/epics.md-101-FR48: Outillage agentic MCP PostHog et validation Docker sans régression (`lint`, `typecheck`, `generate`). _(CAP-7, CAP-8)_
docs/planning-artifacts/epics.md-102-
docs/planning-artifacts/epics.md-103-#### Epic 15 — Repositionnement Commercial V1.1 : Désancrage Tarifaire & Offres par Niveaux d'Intervention (Offre V1.1)
docs/planning-artifacts/epics.md:104:FR49: Page d'accueil — Retrait de toute mention « À partir de 3 500 € HT », intégration des liens contextuels vers les types de systèmes et insertion de la phrase de réassurance sur le dimensionnement selon le workflow réel. _(CAP-1)_
docs/planning-artifacts/epics.md:105:FR50: Page Services — Restructuration complète des offres de build en 3 niveaux d'intervention sur devis (Automatisation ciblée, Workflow métier, Système métier sur mesure) et relégation du Blueprint en cadrage préalable optionnel. _(CAP-2)_
docs/planning-artifacts/epics.md:106:FR51: Page Services — Section dédiée AI Care après mise en production (à partir de 250 € HT / mois) et réalignement du déroulé d'intervention en 4 étapes (Diagnostic gratuit 20-30 min, Cadrage, Construction & intégration, Exploitation & mesure). _(CAP-3)_
docs/planning-artifacts/epics.md:107:FR52: Cohérence globale, SEO, accessibilité et validation transversale — Formulaire de contact sans budget imposé, alignement des métadonnées SEO, parité des thèmes clair/sombre et validation de la gate Docker 100% verte. _(CAP-4)_
docs/planning-artifacts/epics.md-108-
docs/planning-artifacts/epics.md-109-### NonFunctional Requirements
docs/planning-artifacts/epics.md-110-
docs/planning-artifacts/epics.md:111:NFR1: Dark-first uniquement — aucun thème clair ; orange Ubuntu = unique accent héros.
docs/planning-artifacts/epics.md-112-NFR2: Aucune valeur de couleur/espace/rayon hardcodée ; tout passe par les tokens.
docs/planning-artifacts/epics.md-113-NFR3: Port, pas copie — recréation en Vue 3 `<script setup>` + SCSS `@use` (jamais `@import`).
docs/planning-artifacts/epics.md-114-NFR4: Compatibilité prerender — tout passe `nuxi generate`, accès DOM gardés.
--
docs/planning-artifacts/epics.md-125-NFR15: Exécution Docker stricte — toute compilation et validation de gate s'effectue dans le conteneur Docker.
docs/planning-artifacts/epics.md-126-NFR16: Performance SSG & Zéro régression — génération statique Nitro préservée avec 13 routes pré-rendues.
docs/planning-artifacts/epics.md-127-NFR17: Exécution stricte de la suite de validation dans l'environnement Docker (`pnpm lint`, `pnpm typecheck`, `pnpm generate`).
docs/planning-artifacts/epics.md:128:NFR18: Zéro emoji dans les libellés, composants ou infobulles du sélecteur de thème (règle NFR6).
docs/planning-artifacts/epics.md-129-NFR19: Sanctuarisation absolue du terminal (Terminal Hero et fenêtres flottantes conservent impérativement leur fond sombre aubergine `#2E0024` et leurs couleurs syntaxiques).
docs/planning-artifacts/epics.md-130-NFR20: Compatibilité SSG totale sous GitHub Pages sans dépendance dynamique serveur.
docs/planning-artifacts/epics.md-131-
--
docs/planning-artifacts/epics.md-139-- Lint : ESLint 10 (`@nuxt/eslint`), Prettier 3, Stylelint 17 (`stylelint-scss`).
docs/planning-artifacts/epics.md-140-- **Epic 11 — Données centralisées dans `app/data/site.ts`** : mise à jour de `SITE.profile` (titre Full Stack TS, localisation Rouen/remote), `SITE.skills` (TypeScript, Nuxt, NestJS, etc.) et `SITE.projects` (Keova, TryOn, Nodium), consommées sans duplication locale.
docs/planning-artifacts/epics.md-141-- **Epic 11 — Compatibilité statique SSG (Nitro)** : tout accès direct à `window`, `document`, `sessionStorage` strictement encapsulé dans `onMounted()` ou sous `import.meta.client`.
docs/planning-artifacts/epics.md:142:- **Epic 13 — Cascade SCSS & Composable `useTheme`** : Déclaration des tokens de thème clair sous le sélecteur `[data-theme="light"]` dans `app/assets/scss/abstract/_root.scss`, script synchrone anti-FOUC injecté via `app.head.script` dans `nuxt.config.ts`, et gestion d'état réactive via `app/composables/useTheme.ts`.
docs/planning-artifacts/epics.md-143-
docs/planning-artifacts/epics.md-144-### UX Design Requirements
docs/planning-artifacts/epics.md-145-
--
docs/planning-artifacts/epics.md-210-FR29: Epic 12 — Page d'accueil hero commercial cinétique & terminal
docs/planning-artifacts/epics.md-211-FR30: Epic 12 — Vitrine des 3 services & bloc différenciateur Prototype → Production
docs/planning-artifacts/epics.md-212-FR31: Epic 12 — Vitrine des 3 projets phares (Keova Signal, Debrief, Devis-Assist)
docs/planning-artifacts/epics.md:213:FR32: Epic 12 — Page Services, offres Workflow Sprint / Blueprint / Care & process
docs/planning-artifacts/epics.md-214-FR33: Epic 12 — Page À propos, trajectoire métrologie / QA & systèmes IA
docs/planning-artifacts/epics.md-215-FR34: Epic 12 — CTA final inspecteur de workflow & formulaire de contact
docs/planning-artifacts/epics.md-216-FR35: Epic 12 — SEO centralisé, OpenGraph & Schema.org
docs/planning-artifacts/epics.md-217-FR36: Epic 12 — Préservation DA terminal, a11y & non-régression gate Docker
docs/planning-artifacts/epics.md:218:FR37: Epic 13 — Palette de thèmes et tokens sémantiques complets (mode clair crème, terminal sombre)
docs/planning-artifacts/epics.md-219-FR38: Epic 13 — Détection et synchronisation réactive de la préférence système (prefers-color-scheme)
docs/planning-artifacts/epics.md-220-FR39: Epic 13 — Surcharge utilisateur et persistance locale (localStorage)
docs/planning-artifacts/epics.md-221-FR40: Epic 13 — Bouton de bascule ternaire ThemeToggle dans le Header (desktop et mobile)
--
docs/planning-artifacts/epics.md-275-**FRs covered:** FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27 _(NFR10, NFR11, NFR12, UX-DR18 à UX-DR25)_
docs/planning-artifacts/epics.md-276-
docs/planning-artifacts/epics.md-277-### Epic 12: Repositionnement Commercial V1 — Systèmes IA & Automatisation Métier
docs/planning-artifacts/epics.md:278:Le visiteur arrivant sur `jouan.ovh` (prospect ou client) comprend en moins de 15 secondes que Simon Jouan automatise les workflows métier des entreprises grâce à des systèmes IA robustes et industriels, validés par des réalisations concrètes (Keova Signal, Debrief, Devis-Assist) et une culture QA éprouvée, avec une grille tarifaire claire (Sprint à partir de 3 500 € HT) et un appel direct à qualifier son processus sans friction.
docs/planning-artifacts/epics.md-279-**FRs covered:** FR28, FR29, FR30, FR31, FR32, FR33, FR34, FR35, FR36 _(NFR13 à NFR16, UX-DR28 à UX-DR31)_
docs/planning-artifacts/epics.md-280-
docs/planning-artifacts/epics.md-281-### Epic 13: Thème Light & Dark et Bascule Utilisateur
docs/planning-artifacts/epics.md:282:Le visiteur peut consulter l'ensemble du site dans un thème clair « Papier technique / Crème solaire » reposant et contrasté tout en profitant de l'authenticité des terminaux sombres sanctuarisés. Il bénéficie d'une synchronisation automatique avec son OS, d'une bascule manuelle rapide dans le header (desktop et tiroir mobile) et d'une persistance locale sans aucun clignotement visuel (anti-FOUC) au rechargement statique.
docs/planning-artifacts/epics.md-283-**FRs covered:** FR37, FR38, FR39, FR40, FR41, FR42 _(NFR17 à NFR20, UX-DR32 à UX-DR35)_
docs/planning-artifacts/epics.md-284-
docs/planning-artifacts/epics.md-285-### Epic 14: Analytics Privacy-First (PostHog EU), Consentement RGPD & Google Search Console
--
docs/planning-artifacts/epics.md-374-**Given** les polices Ubuntu Mono (ttf locales) et Ubuntu sans
docs/planning-artifacts/epics.md-375-**When** on configure `@font-face`/import et le reset/base dark-first
docs/planning-artifacts/epics.md-376-**Then** Ubuntu Mono sert aux titres/labels/code et Ubuntu sans au corps long
docs/planning-artifacts/epics.md:377:**And** le fond par défaut est sombre (aucun thème clair) et lisible
docs/planning-artifacts/epics.md-378-
docs/planning-artifacts/epics.md-379-### Story 2.3: Primitive ZButton
docs/planning-artifacts/epics.md-380-
--
docs/planning-artifacts/epics.md-909-
docs/planning-artifacts/epics.md-910-## Epic 12: Repositionnement Commercial V1 — Systèmes IA & Automatisation Métier
docs/planning-artifacts/epics.md-911-
docs/planning-artifacts/epics.md:912:Le visiteur arrivant sur `jouan.ovh` (prospect ou client) comprend en moins de 15 secondes que Simon Jouan automatise les workflows métier des entreprises grâce à des systèmes IA robustes et industriels, validés par des réalisations concrètes (Keova Signal, Debrief, Devis-Assist) et une culture QA éprouvée, avec une grille tarifaire claire (Sprint à partir de 3 500 € HT) et un appel direct à qualifier son processus sans friction.
docs/planning-artifacts/epics.md-913-
docs/planning-artifacts/epics.md-914-### Story 12.1: Source unique de données `site.ts`, assainissement sémantique & cohérence globale
docs/planning-artifacts/epics.md-915-
--
docs/planning-artifacts/epics.md-1007-  - H1 : `Des systèmes IA construits autour de vos vrais processus métier.`
docs/planning-artifacts/epics.md-1008-  - Intro : `Je pars d’un workflow existant, pas d’une technologie à placer... L’IA intervient uniquement là où elle apporte réellement quelque chose.`
docs/planning-artifacts/epics.md-1009-**And** les 3 offres commerciales sont détaillées :
docs/planning-artifacts/epics.md:1010:  1. **AI Workflow Sprint** (Offre principale) : `À partir de 3 500 € HT`. Règle : `Un Sprint = un workflow prioritaire`. Liste complète des livrables inclus (diagnostic, cartographie, KPI, architecture, dev, intégrations, tests, MEP, documentation, mesure initiale).
docs/planning-artifacts/epics.md:1011:  2. **AI Workflow Blueprint** : `À partir de 750 € HT`. Cadrage préalable pour problématique complexe (processus actuel, volumes, risques, flux cible, matrice IA vs automation vs humain, KPI, estimation).
docs/planning-artifacts/epics.md:1012:  3. **AI Care** : `À partir de 490 € HT / mois`. Maintien en condition opérationnelle (monitoring, maintenance, support, veille coûts et modèles), avec exclusion explicite des consommations tierces d'APIs/tokens refacturées au réel.
docs/planning-artifacts/epics.md-1013-**And** le processus en 4 étapes est balisé sémantiquement en liste ordonnée `<ol>` :
docs/planning-artifacts/epics.md-1014-  - Étape 1 : *Diagnostic* (20-30 min pour qualifier le problème) avec CTA `Identifier un workflow`
docs/planning-artifacts/epics.md-1015-  - Étape 2 : *Cadrage* (workflow cible, KPI, architecture)
--
docs/planning-artifacts/epics.md-1044-
docs/planning-artifacts/epics.md-1045-## Epic 13: Thème Light & Dark et Bascule Utilisateur
docs/planning-artifacts/epics.md-1046-
docs/planning-artifacts/epics.md:1047:Le visiteur peut consulter l'ensemble du site dans un thème clair « Papier technique / Crème solaire » reposant et contrasté tout en profitant de l'authenticité des terminaux sombres sanctuarisés. Il bénéficie d'une synchronisation automatique avec son OS, d'une bascule manuelle rapide dans le header (desktop et tiroir mobile) et d'une persistance locale sans aucun clignotement visuel (anti-FOUC) au rechargement statique.
docs/planning-artifacts/epics.md-1048-
docs/planning-artifacts/epics.md-1049-### Story 13.1: Fondations des Tokens SCSS Thème Clair et Sanctuarisation du Terminal
docs/planning-artifacts/epics.md-1050-
--
docs/planning-artifacts/epics.md-1055-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-1056-
docs/planning-artifacts/epics.md-1057-**Given** le fichier `app/assets/scss/abstract/_root.scss`
docs/planning-artifacts/epics.md:1058:**When** on déclare le sélecteur `[data-theme="light"]`
docs/planning-artifacts/epics.md-1059-**Then** les alias sémantiques de surfaces sont surchargés :
docs/planning-artifacts/epics.md-1060-  - `--bg-page: hsl(38deg 25% 97%)` (`#FAF8F4`)
docs/planning-artifacts/epics.md-1061-  - `--bg-sunken: hsl(38deg 20% 93%)` (`#F1EDE6`)
--
docs/planning-artifacts/epics.md-1073-### Story 13.2: Composable réactif useTheme, écoute système et script synchrone anti-FOUC
docs/planning-artifacts/epics.md-1074-
docs/planning-artifacts/epics.md-1075-As a visiteur naviguant sur `jouan.ovh`,
docs/planning-artifacts/epics.md:1076:I want que mon thème s'adapte automatiquement à mon OS par défaut, qu'une surcharge soit conservée en mémoire locale et que la page s'affiche sans clignotement noir/blanc,
docs/planning-artifacts/epics.md-1077-So that mon confort de lecture soit immédiat et persistant à chaque visite (FR38, FR39, FR41, NFR20).
docs/planning-artifacts/epics.md-1078-
docs/planning-artifacts/epics.md-1079-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-1080-
docs/planning-artifacts/epics.md-1081-**Given** l'infrastructure client Nuxt 4
docs/planning-artifacts/epics.md:1082:**When** on initialise le thème dans l'application
docs/planning-artifacts/epics.md-1083-**Then** le composable `app/composables/useTheme.ts` expose l'état réactif (`preference`, `resolvedTheme`, `cycleTheme()`, `setTheme()`)
docs/planning-artifacts/epics.md-1084-**And** par défaut, `preference` vaut `'system'` et `resolvedTheme` écoute réactivement `window.matchMedia('(prefers-color-scheme: dark)')`
docs/planning-artifacts/epics.md:1085:**And** tout appel à `setTheme('dark' | 'light' | 'system')` met à jour `localStorage.getItem('jouan_theme_mode')` et positionne les attributs `data-theme` et `data-theme-source` sur `document.documentElement`
docs/planning-artifacts/epics.md:1086:**And** un micro-script synchrone pur JS est injecté dans le `<head>` via `app.head.script` dans `nuxt.config.ts`, résolvant et appliquant `data-theme` avant le premier paint du navigateur (zéro FOUC en SSG)
docs/planning-artifacts/epics.md-1087-**And** aucune discordance d'hydratation Vue (hydration mismatch) n'apparaît en console.
docs/planning-artifacts/epics.md-1088-
docs/planning-artifacts/epics.md-1089-### Story 13.3: Composant ThemeToggle, icônes vectorielles et intégration Header / Mobile
--
docs/planning-artifacts/epics.md-1111-### Story 13.4: Validation transverse, atmosphère d'ambiance et gate Docker Nitro SSG
docs/planning-artifacts/epics.md-1112-
docs/planning-artifacts/epics.md-1113-As a développeur garantissant la robustesse de production,
docs/planning-artifacts/epics.md:1114:I want vérifier le rendu esthétique des pages sous le thème clair et exécuter la gate Docker complète,
docs/planning-artifacts/epics.md-1115-So that le déploiement sur GitHub Pages soit certifié à 100 % vert sans régressions (FR37–FR42, NFR17, NFR19).
docs/planning-artifacts/epics.md-1116-
docs/planning-artifacts/epics.md-1117-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-1118-
docs/planning-artifacts/epics.md-1119-**Given** l'ensemble des routes statiques de `jouan.ovh`
docs/planning-artifacts/epics.md:1120:**When** on bascule le thème sur `light`
docs/planning-artifacts/epics.md-1121-**Then** toutes les pages (Accueil, Services, À propos, Blog, Contact) affichent un rendu harmonieux :
docs/planning-artifacts/epics.md-1122-  - Les cartes blanches (`#FFFFFF`) se détachent nettement du fond crème (`#FAF8F4`)
docs/planning-artifacts/epics.md-1123-  - Les encres aubergine et les liens orange offrent une lisibilité contrastée conforme WCAG AA/AAA
docs/planning-artifacts/epics.md-1124-  - L'arrière-plan atmosphérique d'accueil (`.atmos`) atténue son opacité pour éviter toute interférence de lecture
docs/planning-artifacts/epics.md-1125-  - Le Terminal Hero et le terminal flottant demeurent en mode sombre permanent avec leur prompt vert
docs/planning-artifacts/epics.md:1126:**And** le changement de thème est persistant après rechargement de page ou changement d'URL
docs/planning-artifacts/epics.md-1127-**And** la suite de validation Docker complète réussit avec 0 erreur :
docs/planning-artifacts/epics.md-1128-  ```sh
docs/planning-artifacts/epics.md-1129-  docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
--
docs/planning-artifacts/epics.md-1227-
docs/planning-artifacts/epics.md-1228-## Epic 15: Repositionnement Commercial V1.1 — Désancrage Tarifaire & Niveaux d'Intervention
docs/planning-artifacts/epics.md-1229-
docs/planning-artifacts/epics.md:1230:Simon Jouan souhaite supprimer l'affichage récurrent du prix d'entrée public de 3 500 € HT qui freinait les prospects ayant des besoins d'automatisation ciblée, et restructurer l'offre en 3 niveaux d'intervention sur devis, tout en conservant le Workflow métier comme offre cœur, AI Care isolé après mise en production à partir de 250 € HT/mois, et le Blueprint en cadrage optionnel.
docs/planning-artifacts/epics.md-1231-
docs/planning-artifacts/epics.md-1232-### Story 15.1: Homepage — Suppression des Prix d'Entrée, Liens Contextuels & Phrase de Réassurance
docs/planning-artifacts/epics.md-1233-
docs/planning-artifacts/epics.md-1234-As a visiteur découvrant la page d'accueil,
docs/planning-artifacts/epics.md:1235:I want comprendre que Simon intervient aussi bien sur une automatisation ciblée que sur un workflow complet sans imposer un ticket d'entrée public à 3 500 € HT,
docs/planning-artifacts/epics.md-1236-So that je me sente libre de le contacter pour qualifier mon besoin réel (FR49, NFR6, CAP-1).
docs/planning-artifacts/epics.md-1237-
docs/planning-artifacts/epics.md-1238-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-1239-
docs/planning-artifacts/epics.md-1240-**Given** la section expertises de `app/pages/index.vue`
docs/planning-artifacts/epics.md-1241-**When** le visiteur consulte les 3 cartes de services
docs/planning-artifacts/epics.md:1242:**Then** la mention `À partir de 3 500 € HT` est intégralement retirée des cartes *Automatisation de processus métier* et *Agents IA intégrés à vos outils*
docs/planning-artifacts/epics.md-1243-**And** chaque carte intègre un lien d'exploration contextuel ciblant `/services` :
docs/planning-artifacts/epics.md-1244-  - *Automatisation :* « Voir les types d'automatisation → »
docs/planning-artifacts/epics.md-1245-  - *Agents IA :* « Voir quand utiliser un agent → »
--
docs/planning-artifacts/epics.md-1248-  > *« Un besoin simple ne nécessite pas forcément un gros projet. Je dimensionne la solution selon le workflow réel : parfois quelques automatisations suffisent ; parfois il faut construire un système métier complet. »*
docs/planning-artifacts/epics.md-1249-**And** le style est strictement conforme aux tokens du design system (`var(--token)`), responsive et sans régression visuelle.
docs/planning-artifacts/epics.md-1250-
docs/planning-artifacts/epics.md:1251:### Story 15.2: Page Services — Restructuration des 3 Offres de Build sur Devis & Relégation du Blueprint
docs/planning-artifacts/epics.md-1252-
docs/planning-artifacts/epics.md-1253-As a prospect consultant la page `/services`,
docs/planning-artifacts/epics.md-1254-I want apprécier immédiatement les 3 niveaux d'intervention possibles et comprendre le positionnement sans prix plancher bloquant,
--
docs/planning-artifacts/epics.md-1265-  1. *Automatisation ciblée :* (Eyebrow `BESOIN PRÉCIS`, titre, accroche « Supprimer une tâche répétitive sans reconstruire tout le processus », prix `Sur devis`, CTA « Décrire mon besoin »)
docs/planning-artifacts/epics.md-1266-  2. *Workflow métier :* (Eyebrow `OFFRE CŒUR`, titre, accroche « Transformer un processus complet en système opérationnel », prix `Sur devis`, carte visuellement mise en avant / featured, CTA « Identifier un workflow »)
docs/planning-artifacts/epics.md-1267-  3. *Système métier sur mesure :* (Eyebrow `PROJET COMPLEXE`, titre, accroche « Construire l'application lorsque l'automatisation devient un vrai produit », prix `Sur devis`, CTA « Parler du projet »)
docs/planning-artifacts/epics.md:1268:**And** l'offre *AI Workflow Blueprint* est retirée des cartes de build principales pour devenir une option de cadrage dans la section process.
docs/planning-artifacts/epics.md-1269-
docs/planning-artifacts/epics.md:1270:### Story 15.3: Page Services — Section Dédiée AI Care Après Mise en Production & Process 4 Étapes
docs/planning-artifacts/epics.md-1271-
docs/planning-artifacts/epics.md-1272-As a client ayant déployé un système,
docs/planning-artifacts/epics.md-1273-I want comprendre comment Simon garantit la fiabilité et la maintenance de la capacité dans la durée,
--
docs/planning-artifacts/epics.md-1280-**Then** une section autonome est créée spécifiquement pour l'exploitation post-déploiement :
docs/planning-artifacts/epics.md-1281-  - Eyebrow : `<h2 class="eyebrow"><span aria-hidden="true">// </span>APRÈS LA MISE EN PRODUCTION</h2>`
docs/planning-artifacts/epics.md-1282-  - Titre : `Le système doit continuer à fonctionner.`
docs/planning-artifacts/epics.md:1283:  - Carte ou bloc dédié `AI Care` affichant `À partir de 250 € HT / mois`
docs/planning-artifacts/epics.md-1284-  - Descriptif axé sur le monitoring, la maintenance corrective, le suivi des coûts d'inférence et les adaptations mineures d'APIs
docs/planning-artifacts/epics.md-1285-  - Mention explicite des coûts variables d'infrastructures et tokens tiers non inclus
docs/planning-artifacts/epics.md:1286:  - CTA orienté « Découvrir AI Care »
docs/planning-artifacts/epics.md-1287-**And** la section du déroulé en 4 étapes (`steps`) est mise à jour :
docs/planning-artifacts/epics.md-1288-  - *01 — Diagnostic :* Gratuit — 20 à 30 minutes
docs/planning-artifacts/epics.md:1289:  - *02 — Cadrage :* Cadrage du workflow cible, avec mention explicite du Blueprint facturable optionnel (à partir de 750 € HT) pour les sujets complexes
docs/planning-artifacts/epics.md-1290-  - *03 — Construction & intégration :* Développement uniquement du niveau de système nécessaire
docs/planning-artifacts/epics.md-1291-  - *04 — Exploitation & mesure :* Mise en production, mesure initiale et maintien opérationnel.
docs/planning-artifacts/epics.md-1292-
docs/planning-artifacts/epics.md:1293:### Story 15.4: Cohérence Globale, SEO, Formulaire de Contact & Gate Docker Nitro SSG
docs/planning-artifacts/epics.md-1294-
docs/planning-artifacts/epics.md-1295-As a développeur garantissant la qualité du projet,
docs/planning-artifacts/epics.md-1296-I want auditer l'ensemble des parcours et formulaires et valider la compilation statique,
--
docs/planning-artifacts/epics.md-1302-**When** on audite le CTA final global et la page `/contact`
docs/planning-artifacts/epics.md-1303-**Then** le CTA global maintient la question « Quel process vous fait perdre du temps chaque semaine ? » avec le terminal `$ ./workflow --inspect`
docs/planning-artifacts/epics.md-1304-**And** le formulaire de contact dans `app/pages/contact.vue` qualifie le processus sans champ de budget obligatoire
docs/planning-artifacts/epics.md:1305:**And** les méta-descriptions SEO et OpenGraph gérées par `usePageSeo()` sont alignées sur l'Offre V1.1 sans référence obsolète aux 3 500 €
docs/planning-artifacts/epics.md:1306:**And** les thèmes clair et sombre s'affichent avec un contraste conforme WCAG AA
docs/planning-artifacts/epics.md-1307-**And** la suite de validation Docker s'exécute avec un succès complet à 100% :
docs/planning-artifacts/epics.md-1308-  ```sh
docs/planning-artifacts/epics.md-1309-  docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"

exec
/bin/zsh -lc "printf '%s\\n' '---FULL DIFF FILES---'; rg '"'^diff --git'"' docs/implementation-artifacts/code-reviews/15-4/full.diff; printf '%s\\n' '---FULL DIFF STATS---'; rg '"'^diff --git|''^@@'"' docs/implementation-artifacts/code-reviews/15-4/full.diff | tail -80; printf '%s\\n' '---SPRINT CURRENT---'; nl -ba docs/implementation-artifacts/sprint-status.yaml | sed -n '1,180p'; printf '%s\\n' '---CONTACT SCRIPT---'; nl -ba app/pages/contact/index.vue | sed -n '168,390p'; printf '%s\\n' '---HOME SEO/CTA---'; rg -n -C 8 'usePageSeo|workflow --inspect|jsonLd|description:' app/pages/index.vue; printf '%s\\n' '---SERVICES FULL RELEVANT---'; nl -ba app/pages/services.vue | sed -n '1,360p'; printf '%s\\n' '---ROOT TOKENS---'; rg -n -C 2 'data-theme|--text|--accent|--border|--bg' app/assets/scss/abstract/_root.scss" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---FULL DIFF FILES---
diff --git a/app/pages/services.vue b/app/pages/services.vue
diff --git a/docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md b/docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md
diff --git a/docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md b/docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md
diff --git a/docs/implementation-artifacts/deferred-work.md b/docs/implementation-artifacts/deferred-work.md
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
---FULL DIFF STATS---
diff --git a/app/pages/services.vue b/app/pages/services.vue
@@ -1,6 +1,6 @@
@@ -49,8 +49,59 @@
@@ -80,8 +131,8 @@
@@ -104,6 +155,18 @@ interface Offer {
@@ -178,12 +241,32 @@ const offers: Offer[] = [
@@ -192,17 +275,17 @@ const steps: Step[] = [
@@ -217,24 +300,46 @@ const servicesJsonLd = {
@@ -399,6 +504,147 @@ usePageSeo({
@@ -482,5 +728,17 @@ usePageSeo({
diff --git a/docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md b/docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md
@@ -4,7 +4,7 @@ baseline_commit: 7162f14595e42399d234c534fd88d78a7360cbb8
@@ -80,39 +80,43 @@ so that mon investissement reste opérationnel, adapté aux évolutions d'APIs e
@@ -198,9 +202,20 @@ const steps: Step[] = [
diff --git a/docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md b/docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md
@@ -0,0 +1,136 @@
diff --git a/docs/implementation-artifacts/deferred-work.md b/docs/implementation-artifacts/deferred-work.md
@@ -42,8 +42,8 @@ _Vue d'ensemble par destination. Le détail par story est conservé dans les sec
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
@@ -157,8 +157,8 @@ development_status:
---SPRINT CURRENT---
     1	# generated: 2026-06-18
     2	# last_updated: 2026-09-18 (Story 15.2 terminée et prête pour review)
     3	# project: jouan.ovh
     4	# project_key: NOKEY
     5	# tracking_system: file-system
     6	# story_location: docs/implementation-artifacts
     7	
     8	# STATUS DEFINITIONS:
     9	# ==================
    10	# Epic Status:
    11	#   - backlog: Epic not yet started
    12	#   - in-progress: Epic actively being worked on
    13	#   - done: All stories in epic completed
    14	#
    15	# Epic Status Transitions:
    16	#   - backlog → in-progress: Automatically when first story is created (via create-story)
    17	#   - in-progress → done: Manually when all stories reach 'done' status
    18	#
    19	# Story Status:
    20	#   - backlog: Story only exists in epic file
    21	#   - ready-for-dev: Story file created in stories folder
    22	#   - in-progress: Developer actively working on implementation
    23	#   - review: Ready for code review (via Dev's code-review workflow)
    24	#   - done: Story completed
    25	#
    26	# Retrospective Status:
    27	#   - optional: Can be completed but not required
    28	#   - done: Retrospective has been completed
    29	#
    30	# WORKFLOW NOTES:
    31	# ===============
    32	# - Epic transitions to 'in-progress' automatically when first story is created
    33	# - Stories can be worked in parallel if team capacity allows
    34	# - Developer typically creates next story after previous one is 'done' to incorporate learnings
    35	# - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
    36	
    37	generated: 2026-06-18
    38	last_updated: "2026-09-18 (Story 15.4 terminée et prête pour review)"
    39	project: jouan.ovh
    40	project_key: NOKEY
    41	tracking_system: file-system
    42	story_location: docs/implementation-artifacts
    43	
    44	development_status:
    45	  # Epic 1 — Migration de la stack vers Nuxt 4
    46	  epic-1: in-progress
    47	  1-1-migrer-le-coeur-vers-nuxt-4: done
    48	  1-2-mettre-a-jour-les-modules-et-dependances: done
    49	  1-3-migrer-loutillage-lint-vers-eslint-9: done
    50	  1-4-valider-build-statique-et-deploiement-gh-pages: done
    51	  epic-1-retrospective: done
    52	
    53	  # Epic 2 — Fondations du design system
    54	  epic-2: in-progress
    55	  2-1-porter-les-tokens-du-design-system: done
    56	  2-2-polices-et-base-dark-first: done
    57	  2-3-primitive-zbutton: done
    58	  2-4-primitive-zcard: done
    59	  2-5-primitives-zbadge-et-ztag: done
    60	  2-6-primitives-zinput-et-zavatar: done
    61	  2-7-iconographie: done
    62	  2-8-chassis-global-header-footer-nav-socials: done
    63	  epic-2-retrospective: done
    64	
    65	  # Epic 3 — Page d'accueil
    66	  epic-3: in-progress
    67	  3-1-hero-terminal-a: done
    68	  3-2-apercu-services-et-stats: done
    69	  3-3-projets-selectionnes: done
    70	  epic-3-retrospective: done
    71	
    72	  # Epic 4 — Page Services
    73	  epic-4: in-progress
    74	  4-1-route-services-et-cartes-doffre: done
    75	  4-2-section-process: done
    76	  epic-4-retrospective: done
    77	
    78	  # Epic 5 — Page À-propos
    79	  epic-5: in-progress
    80	  5-1-portrait-et-bio: done
    81	  5-2-timeline-formation-et-stack: done
    82	  epic-5-retrospective: done
    83	
    84	  # Epic 6 — Blog
    85	  epic-6: in-progress
    86	  6-1-index-du-blog-et-empty-state: done
    87	  6-2-vue-article-prose-et-code: done
    88	  epic-6-retrospective: done
    89	
    90	  # Epic 7 — Page Contact
    91	  epic-7: in-progress
    92	  7-1-route-contact-et-formulaire: done
    93	  7-2-infos-cta-terminal-et-socials: done
    94	  epic-7-retrospective: done
    95	
    96	  # Epic 8 — Terminal easter-egg restylé
    97	  epic-8: in-progress
    98	  8-1-style-terminalwindow-et-prompt: done
    99	  8-2-preserver-les-commandes-et-louverture: done
   100	  8-3-migrer-composants-terminal-script-setup: done
   101	  epic-8-retrospective: done
   102	
   103	  # Epic 9 — Accessibilité & finitions motion
   104	  epic-9: done
   105	  9-1-etats-interactifs-coherents: done
   106	  9-2-motion-reduit-contraste-et-clavier: done
   107	  epic-9-retrospective: done
   108	
   109	  # Epic 10 — Fin de refonte (a11y résiduel + SEO + RGPD + déploiement prod)
   110	  epic-10: done
   111	  10-1-decision-hebergement-prod-et-derisquage-deploiement: done
   112	  10-2-a11y-semantique-residuelle: done
   113	  10-3-liens-externes-accessibles: done
   114	  10-4-validation-a11y-emulee-et-unification-forced-colors: done
   115	  10-5-seo-centralise-site-wide: done
   116	  10-6-conformite-legale-rgpd-mentions: done
   117	  10-7-mise-en-production-reelle: done
   118	  epic-10-retrospective: done
   119	
   120	  # Epic 11 — Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
   121	  epic-11: done
   122	  11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique: done
   123	  11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique: done
   124	  11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles: done
   125	  11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: done
   126	  11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker: done
   127	  11-6-polissage-visuel-fidelite-maquette-awwwards-et-interactions: done
   128	  epic-11-retrospective: done
   129	
   130	  # Epic 12 — Repositionnement Commercial V1 : Systèmes IA & Automatisation Métier
   131	  epic-12: done
   132	  12-1-source-unique-de-donnees-sitets-et-coherence-globale: done
   133	  12-2-homepage-hero-commercial-cinetique-et-terminal-interactif: done
   134	  12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur: done
   135	  12-4-homepage-vitrine-des-3-projets-phares: done
   136	  12-5-page-services-restructuration-des-offres-et-process-4-etapes: done
   137	  12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide: done
   138	  epic-12-retrospective: done
   139	
   140	  # Epic 13 — Thème Light & Dark et Bascule Utilisateur
   141	  epic-13: done
   142	  13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal: done
   143	  13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc: done
   144	  13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile: done
   145	  13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg: done
   146	  epic-13-retrospective: optional
   147	
   148	  # Epic 14 — Analytics Privacy-First (PostHog EU), Consentement RGPD & Google Search Console
   149	  epic-14: backlog
   150	  14-1-fondations-posthog-eu-composable-consentement-et-toast-cookie-terminal: backlog
   151	  14-2-session-replay-securise-masquage-donnees-et-politique-rgpd: backlog
   152	  14-3-implementation-plan-de-taggage-exhaustif-conversions-ia-et-interactions: backlog
   153	  14-4-referencement-google-search-console-sitemap-xml-et-robots-txt: backlog
   154	  epic-14-retrospective: optional
   155	
   156	  # Epic 15 — Repositionnement Commercial V1.1 : Désancrage Tarifaire & Offres par Niveaux d'Intervention
   157	  epic-15: in-progress
   158	  15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance: done
   159	  15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint: done
   160	  15-3-page-services-section-dediee-ai-care-et-process-4-etapes: done
   161	  15-4-coherence-globale-seo-formulaire-contact-et-gate-docker: review
   162	  epic-15-retrospective: optional
   163	
   164	
---CONTACT SCRIPT---
   168	<script setup lang="ts">
   169	// Page Contact — colonne gauche : en-tête + formulaire (story 7.1, envoi Web3Forms,
   170	// service tiers SANS serveur). Colonne droite : infos + CTA terminal + socials (story 7.2).
   171	import { nextTick, reactive, ref, watch } from "vue";
   172	import { NuxtLink } from "#components";
   173	import { SITE } from "~/data/site";
   174	
   175	// Infos de contact — source unique `app/data/site.ts`.
   176	const contact = SITE.profile;
   177	
   178	// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le header).
   179	// no-op au prerender (aucun lanceur) → prerender-safe ; ouvre le terminal côté client.
   180	const { open: openTerminal } = useTerminal();
   181	
   182	interface ContactForm {
   183	  name: string;
   184	  email: string;
   185	  company?: string;
   186	  workflow: string;
   187	  currentState: string;
   188	  frequency?: string;
   189	}
   190	
   191	interface Web3FormsResponse {
   192	  success: boolean;
   193	  message: string;
   194	}
   195	
   196	const ERROR_MESSAGE = `L'envoi a échoué. Réessayez, ou écrivez-moi directement à ${SITE.profile.email}.`;
   197	
   198	// Clé Web3Forms injectée par l'env (NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY) — jamais en dur.
   199	const accessKey = useRuntimeConfig().public.web3formsAccessKey;
   200	
   201	const form = reactive<ContactForm>({
   202	  name: "",
   203	  email: "",
   204	  company: "",
   205	  workflow: "",
   206	  currentState: "",
   207	  frequency: "",
   208	});
   209	
   210	// Message d'erreur par champ requis ("" = valide). Rendu sous le champ via ZInput.
   211	const errors = reactive({
   212	  name: "",
   213	  email: "",
   214	  workflow: "",
   215	  currentState: "",
   216	});
   217	
   218	const honeypot = ref("");
   219	const sent = ref(false);
   220	const sending = ref(false);
   221	const submitError = ref("");
   222	// Passe à true au 1er envoi → active la re-validation live (les erreurs se lèvent à la saisie).
   223	const submitted = ref(false);
   224	
   225	const formRef = ref<HTMLFormElement | null>(null);
   226	const sentCard = ref<{ $el: HTMLElement } | null>(null);
   227	
   228	// Format email volontairement permissif (un @, un point dans le domaine) : on évite les
   229	// faux négatifs d'une regex stricte ; Web3Forms revalide côté service.
   230	const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   231	
   232	// Nettoie les espaces et les caractères zero-width / invisibles (ex: \u200B)
   233	function cleanInput(val?: string): string {
   234	  return (val ?? "").replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
   235	}
   236	
   237	function validate(): boolean {
   238	  const name = cleanInput(form.name);
   239	  const email = cleanInput(form.email);
   240	  const workflow = cleanInput(form.workflow);
   241	  const currentState = cleanInput(form.currentState);
   242	
   243	  errors.name = name ? "" : "Votre nom est requis.";
   244	  errors.email = !email ? "Votre email est requis." : EMAIL_RE.test(email) ? "" : "Cet email ne semble pas valide.";
   245	  errors.workflow = workflow ? "" : "Veuillez préciser le processus à améliorer.";
   246	  errors.currentState = currentState ? "" : "Veuillez décrire le fonctionnement actuel.";
   247	  return !errors.name && !errors.email && !errors.workflow && !errors.currentState;
   248	}
   249	
   250	// Après un 1er envoi, re-valider à la saisie : corriger un champ lève son message d'erreur
   251	// sans attendre une nouvelle soumission.
   252	watch(
   253	  () => [form.name, form.email, form.workflow, form.currentState],
   254	  () => {
   255	    if (submitted.value) {
   256	      validate();
   257	    }
   258	  },
   259	);
   260	
   261	async function focusSentCard(): Promise<void> {
   262	  await nextTick();
   263	  sentCard.value?.$el?.focus();
   264	}
   265	
   266	async function onSubmit(): Promise<void> {
   267	  submitted.value = true;
   268	  submitError.value = "";
   269	
   270	  if (!validate()) {
   271	    // a11y : amener le focus sur le 1er champ invalide.
   272	    await nextTick();
   273	    formRef.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
   274	    return;
   275	  }
   276	
   277	  // Honeypot rempli = bot : on n'envoie rien et on affiche l'état de succès.
   278	  if (honeypot.value) {
   279	    sent.value = true;
   280	    await focusSentCard();
   281	    return;
   282	  }
   283	
   284	  sending.value = true;
   285	  try {
   286	    const name = cleanInput(form.name);
   287	    const email = cleanInput(form.email);
   288	    const company = cleanInput(form.company);
   289	    const workflow = cleanInput(form.workflow);
   290	    const currentState = cleanInput(form.currentState);
   291	    const frequency = cleanInput(form.frequency);
   292	    const workflowSubject = workflow.slice(0, 80);
   293	
   294	    const res = await $fetch<Web3FormsResponse>("https://api.web3forms.com/submit", {
   295	      method: "POST",
   296	      body: {
   297	        access_key: accessKey,
   298	        name,
   299	        email,
   300	        company,
   301	        subject: `Qualification de workflow : ${workflowSubject || "Nouveau projet"}`,
   302	        workflow,
   303	        current_state: currentState,
   304	        frequency,
   305	        message: `Processus à améliorer : ${workflow}\n\nFonctionnement actuel :\n${currentState}\n\nFréquence : ${frequency || "Non spécifiée"}\nEntreprise : ${company || "Non spécifiée"}`,
   306	        botcheck: "",
   307	      },
   308	    });
   309	    if (res.success) {
   310	      sent.value = true;
   311	      await focusSentCard();
   312	    } else {
   313	      submitError.value = ERROR_MESSAGE;
   314	    }
   315	  } catch {
   316	    submitError.value = ERROR_MESSAGE;
   317	  } finally {
   318	    sending.value = false;
   319	  }
   320	}
   321	
   322	const siteUrl = useSiteUrl();
   323	
   324	const contactJsonLd = {
   325	  "@context": "https://schema.org",
   326	  "@type": "ContactPage",
   327	  name: "Contact — Simon Jouan",
   328	  description:
   329	    "Parlons de votre workflow : décrivez le processus métier qui vous ralentit pour identifier les opportunités d'automatisation et d'agents IA adaptés.",
   330	  url: `${siteUrl}/contact`,
   331	  mainEntity: {
   332	    "@type": "Person",
   333	    name: SITE.profile.name,
   334	    email: SITE.profile.email,
   335	    address: {
   336	      "@type": "PostalAddress",
   337	      addressLocality: SITE.profile.city,
   338	      addressCountry: "FR",
   339	    },
   340	  },
   341	};
   342	
   343	usePageSeo({
   344	  title: "Contact — Simon Jouan",
   345	  description:
   346	    "Parlons de votre workflow : décrivez le processus métier qui vous ralentit pour identifier les opportunités d'automatisation et d'agents IA adaptés.",
   347	  path: "/contact",
   348	  image: "/images/portrait.jpeg",
   349	  type: "website",
   350	  jsonLd: contactJsonLd,
   351	});
   352	</script>
   353	
   354	<style lang="scss" scoped>
   355	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / Contact.jsx */
   356	// .section / .container / .eyebrow / .prose sont des primitives de layout globales
   357	// (app/assets/scss/base/_layout.scss) — non redéclarées ici.
   358	.contact {
   359	  display: block;
   360	}
   361	
   362	// ---- Grille (porté de kit.css : .contact__grid 1fr / 0.8fr) ----
   363	.contact__grid {
   364	  display: grid;
   365	  grid-template-columns: 1fr 0.8fr;
   366	  gap: var(--space-12);
   367	  align-items: start;
   368	}
   369	
   370	// ---- En-tête (porté de Contact.jsx) ----
   371	.contact__title {
   372	  margin-bottom: var(--space-3);
   373	  font-family: var(--font-mono);
   374	  font-size: var(--fs-4xl);
   375	  font-weight: var(--fw-light);
   376	  line-height: var(--lh-tight);
   377	  color: var(--text-strong);
   378	}
   379	
   380	.contact__intro {
   381	  max-width: 48ch;
   382	  margin-bottom: var(--space-8);
   383	  color: var(--text-muted);
   384	}
   385	
   386	// ---- Formulaire (porté de kit.css : .contact__form) ----
   387	.contact__form {
   388	  display: flex;
   389	  flex-direction: column;
   390	  gap: var(--space-4);
---HOME SEO/CTA---
282-        </ZCard>
283-      </div>
284-    </section>
285-
286-    <!-- Bloc CTA final de conversion (Story 12.6 / AC-2) -->
287-    <section class="section">
288-      <div class="container">
289-        <div class="cta">
290:          <p class="eyebrow cta__eyebrow"><span aria-hidden="true">$ </span>./workflow --inspect</p>
291-          <h2 class="cta__title">
292-            Quel process vous fait perdre du temps <span class="cta__highlight">chaque semaine</span> ?
293-          </h2>
294-          <p class="cta__subtitle">
295-            Décrivez-moi simplement comment il fonctionne aujourd’hui. Je vous dirai ce qui mérite d’être automatisé, ce
296-            qui doit rester humain et si l’IA apporte réellement quelque chose.
297-          </p>
298-          <div class="cta__actions">
--
456-
457-const siteUrl = useSiteUrl();
458-const homeJsonLd = [
459-  {
460-    "@context": "https://schema.org",
461-    "@type": "WebSite",
462-    name: "Simon Jouan — Systèmes IA, agents & automatisation métier",
463-    url: siteUrl,
464:    description: SITE.profile.role,
465-  },
466-  {
467-    "@context": "https://schema.org",
468-    "@type": "Person",
469-    name: SITE.profile.name,
470-    jobTitle: SITE.profile.role,
471-    url: siteUrl,
472-    image: `${siteUrl}/images/portrait.jpeg`,
--
474-    address: {
475-      "@type": "PostalAddress",
476-      addressLocality: SITE.profile.city,
477-      addressCountry: "FR",
478-    },
479-  },
480-];
481-
482:usePageSeo({
483-  title: "Simon Jouan — Systèmes IA, agents & automatisation métier",
484:  description:
485-    "Développeur Full Stack spécialisé en systèmes IA et automatisation métier. Agents IA, intégrations, applications sur mesure et workflows mis en production.",
486-  path: "/",
487-  image: "/images/portrait.jpeg",
488-  type: "website",
489:  jsonLd: homeJsonLd,
490-});
491-</script>
492-
493-<style lang="scss" scoped>
494-/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Home.jsx */
495-.home {
496-  display: block;
497-}
---SERVICES FULL RELEVANT---
     1	<template>
     2	  <main class="services">
     3	    <!-- En-tête + grille d'offres de build (story 12.5 & story 15.2) -->
     4	    <section class="section">
     5	      <div class="container">
     6	        <p class="eyebrow"><span aria-hidden="true">// </span>services</p>
     7	        <h1 class="services__title">Le bon niveau de système pour le bon problème.</h1>
     8	        <p class="prose services__intro">
     9	          Je pars d’un workflow existant, pas d’une technologie à placer. Certaines frictions se règlent avec une
    10	          automatisation simple. D’autres nécessitent plusieurs intégrations, de l’IA ou une véritable application
    11	          métier. Le rôle du diagnostic est justement de déterminer jusqu’où il est utile d’aller.
    12	        </p>
    13	
    14	        <ul class="grid-3">
    15	          <li v-for="offer in offers" :key="offer.id">
    16	            <ZCard :id="offer.id" class="offer" :accent="offer.featured" :featured="offer.featured">
    17	              <div v-if="offer.badge" class="offer__badge">
    18	                <ZBadge :tone="offer.badgeTone || 'neutral'">{{ offer.badge }}</ZBadge>
    19	              </div>
    20	              <div class="offer__icon"><ZIcon :name="offer.icon" /></div>
    21	              <h2 class="offer__title">{{ offer.title }}</h2>
    22	              <p v-if="offer.hook" class="offer__hook">{{ offer.hook }}</p>
    23	              <p class="offer__desc">{{ offer.desc }}</p>
    24	              <ul class="offer__points">
    25	                <li v-for="point in offer.points" :key="point">{{ point }}</li>
    26	              </ul>
    27	              <div class="offer__footer">
    28	                <div class="offer__price">
    29	                  <b>{{ offer.price }}</b>
    30	                </div>
    31	                <p v-if="offer.disclaimer" class="offer__disclaimer">
    32	                  {{ offer.disclaimer }}
    33	                </p>
    34	                <div class="offer__cta">
    35	                  <ZButton
    36	                    :as="NuxtLink"
    37	                    to="/contact"
    38	                    :variant="offer.featured ? 'primary' : 'secondary'"
    39	                    :aria-label="offer.ctaAriaLabel"
    40	                    class="offer__btn"
    41	                  >
    42	                    {{ offer.ctaText }}
    43	                  </ZButton>
    44	                </div>
    45	              </div>
    46	            </ZCard>
    47	          </li>
    48	        </ul>
    49	      </div>
    50	    </section>
    51	
    52	    <!-- Section AI Care : Maintien en condition opérationnelle (story 15.3) -->
    53	    <section class="section section--sunken care-section">
    54	      <div class="container">
    55	        <p class="eyebrow"><span aria-hidden="true">// </span>après la mise en production</p>
    56	        <h2 class="care-section__title">Le système doit continuer à fonctionner.</h2>
    57	        <p class="prose care-section__intro">
    58	          Une automatisation utile doit continuer à fonctionner après sa mise en production. AI Care couvre le maintien
    59	          en condition opérationnelle du système : monitoring, maintenance, support, suivi des coûts et adaptations
    60	          mineures liées aux APIs ou aux modèles.
    61	        </p>
    62	
    63	        <ZCard :id="careOffer.id" class="care-card">
    64	          <div class="care-card__info">
    65	            <div class="care-card__badge">
    66	              <ZBadge tone="neutral">{{ careOffer.badge }}</ZBadge>
    67	            </div>
    68	            <div class="care-card__icon"><ZIcon name="bot" /></div>
    69	            <h3 class="care-card__title">{{ careOffer.title }}</h3>
    70	            <p class="care-card__desc">{{ careOffer.desc }}</p>
    71	
    72	            <div class="care-card__footer">
    73	              <div class="care-card__price">
    74	                <b>{{ careOffer.price }}</b>
    75	              </div>
    76	              <p v-if="careOffer.disclaimer" class="care-card__disclaimer">
    77	                {{ careOffer.disclaimer }}
    78	              </p>
    79	              <div class="care-card__cta">
    80	                <ZButton
    81	                  :as="NuxtLink"
    82	                  to="/contact"
    83	                  variant="secondary"
    84	                  :aria-label="careOffer.ctaAriaLabel"
    85	                  class="care-card__btn"
    86	                >
    87	                  {{ careOffer.ctaText }}
    88	                </ZButton>
    89	              </div>
    90	            </div>
    91	          </div>
    92	
    93	          <div class="care-card__details">
    94	            <h4 class="care-card__points-title">Inclus dans l’accompagnement :</h4>
    95	            <ul class="care-card__points">
    96	              <li v-for="point in careOffer.points" :key="point">{{ point }}</li>
    97	            </ul>
    98	          </div>
    99	        </ZCard>
   100	      </div>
   101	    </section>
   102	
   103	    <!-- Section process : 4 étapes ordonnées + CTA (story 12.5 & story 15.3) -->
   104	    <section class="section">
   105	      <div class="container">
   106	        <p class="eyebrow"><span aria-hidden="true">// </span>comment ça se passe</p>
   107	        <h2 class="process__title">Un déroulé simple en quatre temps</h2>
   108	
   109	        <ol class="process">
   110	          <li v-for="step in steps" :key="step.n" class="process__step">
   111	            <div class="process__num" aria-hidden="true">{{ step.n }}</div>
   112	            <h3 class="process__step-title">{{ step.title }}</h3>
   113	            <p class="prose process__desc">{{ step.desc }}</p>
   114	            <div v-if="step.inlineCta" class="process__cta-inline-wrapper">
   115	              <NuxtLink :to="step.inlineCta.to" class="process__inline-cta">
   116	                {{ step.inlineCta.label }}
   117	              </NuxtLink>
   118	            </div>
   119	          </li>
   120	        </ol>
   121	
   122	        <div class="process__cta">
   123	          <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
   124	            Me parler de votre besoin
   125	            <template #iconRight><ZIcon name="arrow" /></template>
   126	          </ZButton>
   127	        </div>
   128	      </div>
   129	    </section>
   130	  </main>
   131	</template>
   132	
   133	<script setup lang="ts">
   134	// Page Services : catalogue d'offres de build sur devis + section dédiée AI Care + process 4 étapes + CTA contact.
   135	// Données statiques (3 offres de build, 1 offre de care, 4 étapes) déclarées localement. Prerender-safe, dark-first.
   136	import { NuxtLink } from "#components";
   137	import { SITE } from "~/data/site";
   138	
   139	interface Offer {
   140	  /** Clé v-for et ancre HTML stable (indépendante du contenu affiché). */
   141	  id: string;
   142	  /** Nom d'icône dans le set ZIcon. */
   143	  icon: string;
   144	  badge: string;
   145	  badgeTone?: "accent" | "neutral";
   146	  title: string;
   147	  hook?: string;
   148	  desc: string;
   149	  points: string[];
   150	  price: string;
   151	  disclaimer?: string;
   152	  /** Offre mise en avant : carte accent + glow. */
   153	  featured: boolean;
   154	  ctaText: string;
   155	  ctaAriaLabel: string;
   156	}
   157	
   158	interface CareOffer {
   159	  id: string;
   160	  badge: string;
   161	  title: string;
   162	  price: string;
   163	  desc: string;
   164	  points: string[];
   165	  disclaimer: string;
   166	  ctaText: string;
   167	  ctaAriaLabel: string;
   168	}
   169	
   170	interface Step {
   171	  n: string;
   172	  title: string;
   173	  desc: string;
   174	  inlineCta?: {
   175	    to: string;
   176	    label: string;
   177	  };
   178	}
   179	
   180	// Les 3 offres de build officielles V1.1 — 1re personne, vouvoiement, zéro emoji.
   181	const offers: Offer[] = [
   182	  {
   183	    id: "automatisation",
   184	    icon: "zap",
   185	    badge: "BESOIN PRÉCIS",
   186	    badgeTone: "neutral",
   187	    title: "Automatisation ciblée",
   188	    hook: "Supprimer une tâche répétitive sans reconstruire tout le processus.",
   189	    desc: "Pour les besoins bien délimités : données, emails, documents, CRM, synchronisation, génération ou traitement automatisé.",
   190	    points: [
   191	      "Cartographie rapide du flux & cadrage du besoin",
   192	      "Automatisation logicielle & connecteurs API / webhooks",
   193	      "Traitement de données ou IA ciblée si pertinent",
   194	      "Contrôle ou validation humaine si requis",
   195	      "Tests, mise en production & documentation courte",
   196	    ],
   197	    price: "Sur devis",
   198	    featured: false,
   199	    ctaText: "Décrire mon besoin",
   200	    ctaAriaLabel: "Décrire mon besoin pour une automatisation ciblée",
   201	  },
   202	  {
   203	    id: "workflow",
   204	    icon: "layers",
   205	    badge: "OFFRE CŒUR",
   206	    badgeTone: "accent",
   207	    title: "Workflow métier",
   208	    hook: "Transformer un processus complet en système opérationnel.",
   209	    desc: "Pour les workflows qui traversent plusieurs étapes ou outils : cartographie, intégrations, automatisation, IA ciblée, contrôle humain, tests et mise en production.",
   210	    points: [
   211	      "Diagnostic approfondi & cartographie avant/après",
   212	      "Architecture système & connecteurs API métier",
   213	      "Modèles d'IA & prompt engineering avec sorties typées",
   214	      "Tests automatisés sur cas réels & boucle de validation humaine",
   215	      "Déploiement en production, documentation & mesure initiale",
   216	    ],
   217	    price: "Sur devis",
   218	    featured: true,
   219	    ctaText: "Identifier un workflow",
   220	    ctaAriaLabel: "Identifier un workflow métier",
   221	  },
   222	  {
   223	    id: "sur-mesure",
   224	    icon: "terminal",
   225	    badge: "PROJET COMPLEXE",
   226	    badgeTone: "neutral",
   227	    title: "Système métier sur mesure",
   228	    hook: "Construire l'application lorsque l'automatisation devient un vrai produit.",
   229	    desc: "Interface, backend, base de données, authentification, intégrations, IA, rôles, supervision et déploiement.",
   230	    points: [
   231	      "Interface web ou desktop adaptée aux opérateurs",
   232	      "Backend, base de données relationnelle & gestion des rôles",
   233	      "Orchestration multi-modèles & pipelines de données",
   234	      "Intégration profonde au SI (CRM, ERP, APIs métier)",
   235	      "Supervision avancée, tests automatisés & déploiement souverain",
   236	    ],
   237	    price: "Sur devis",
   238	    featured: false,
   239	    ctaText: "Parler du projet",
   240	    ctaAriaLabel: "Parler d'un projet de système métier sur mesure",
   241	  },
   242	];
   243	
   244	// Offre de maintien en condition opérationnelle V1.1 (AI Care).
   245	const careOffer: CareOffer = {
   246	  id: "ai-care",
   247	  badge: "MAINTIEN EN CONDITION OPÉRATIONNELLE",
   248	  title: "AI Care",
   249	  price: "À partir de 250 € HT / mois",
   250	  desc: "Pour les systèmes qui ont besoin d'être exploités, surveillés et adaptés dans la durée.",
   251	  points: [
   252	    "Monitoring proactif, détection d'erreurs & alertes d'anomalies",
   253	    "Maintenance corrective & adaptation aux évolutions d'APIs tierces",
   254	    "Suivi fin de consommation des tokens & ajustements de prompts",
   255	    "Support technique réactif & veille sur les nouveaux modèles",
   256	    "Mesure factuelle des KPI et optimisation continue du flux",
   257	  ],
   258	  disclaimer:
   259	    "Consommations tierces d'APIs et tokens (LLM, OCR, scraping...) refacturées au réel ou prises en charge directement par le client. Pas d'engagement imposé au build.",
   260	  ctaText: "Découvrir AI Care",
   261	  ctaAriaLabel: "Découvrir l'accompagnement AI Care",
   262	};
   263	
   264	// Étapes du process en 4 temps (Offre V1.1). L'ordre du tableau garantit l'affichage 01 → 04.
   265	const steps: Step[] = [
   266	  {
   267	    n: "01",
   268	    title: "Diagnostic",
   269	    desc: "Échange gratuit de 20 à 30 minutes pour qualifier le problème, comprendre le workflow existant, ses volumes, ses outils et identifier la friction réelle.",
   270	    inlineCta: {
   271	      to: "/contact",
   272	      label: "Identifier un workflow →",
   273	    },
   274	  },
   275	  {
   276	    n: "02",
   277	    title: "Cadrage",
   278	    desc: "Définir la cible, ce qui doit être automatisé, ce qui reste humain et comment mesurer le résultat. Pour les sujets complexes, un Blueprint facturable (à partir de 750 € HT) peut être proposé lorsque le cadrage nécessite un travail approfondi avant devis.",
   279	  },
   280	  {
   281	    n: "03",
   282	    title: "Construction & intégration",
   283	    desc: "Développer uniquement le niveau de système nécessaire (automatisation ciblée, workflow métier ou application sur mesure) et le tester sur des cas réels avant livraison.",
   284	  },
   285	  {
   286	    n: "04",
   287	    title: "Exploitation & mesure",
   288	    desc: "Mise en production, mesure initiale de performance et maintien en condition opérationnelle lorsque le workflow le justifie (via AI Care).",
   289	  },
   290	];
   291	
   292	const siteUrl = useSiteUrl();
   293	
   294	const servicesJsonLd = {
   295	  "@context": "https://schema.org",
   296	  "@type": "WebPage",
   297	  name: "Services & Systèmes IA — Simon Jouan",
   298	  description:
   299	    "Conception et développement de systèmes IA et automatisation de processus métier : automatisation ciblée, workflows complets et applications métier sur mesure.",
   300	  url: `${siteUrl}/services`,
   301	  mainEntity: {
   302	    "@type": "ItemList",
   303	    itemListElement: [
   304	      ...offers.map((offer, index) => ({
   305	        "@type": "ListItem",
   306	        position: index + 1,
   307	        item: {
   308	          "@type": "Service",
   309	          name: offer.title,
   310	          description: offer.desc,
   311	          url: `${siteUrl}/services#${offer.id}`,
   312	          provider: {
   313	            "@type": "Organization",
   314	            "@id": `${siteUrl}/#organization`,
   315	            name: SITE.profile.name,
   316	          },
   317	          offers: {
   318	            "@type": "Offer",
   319	            description: offer.price,
   320	          },
   321	        },
   322	      })),
   323	      {
   324	        "@type": "ListItem",
   325	        position: offers.length + 1,
   326	        item: {
   327	          "@type": "Service",
   328	          name: careOffer.title,
   329	          description: careOffer.desc,
   330	          url: `${siteUrl}/services#${careOffer.id}`,
   331	          provider: {
   332	            "@type": "Organization",
   333	            "@id": `${siteUrl}/#organization`,
   334	            name: SITE.profile.name,
   335	          },
   336	          offers: {
   337	            "@type": "Offer",
   338	            description: careOffer.price,
   339	          },
   340	        },
   341	      },
   342	    ],
   343	  },
   344	};
   345	
   346	usePageSeo({
   347	  title: "Services & Systèmes IA — Simon Jouan",
   348	  description:
   349	    "Conception et développement de systèmes IA et automatisation de processus métier : automatisation ciblée, workflows complets et applications métier sur mesure.",
   350	  path: "/services",
   351	  image: "/images/portrait.jpeg",
   352	  type: "website",
   353	  jsonLd: servicesJsonLd,
   354	});
   355	</script>
   356	
   357	<style lang="scss" scoped>
   358	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) */
   359	.services {
   360	  display: block;
---ROOT TOKENS---
69-  //  Alias sémantiques — à préférer dans les composants
70-  // ============================================================
71:  --bg-page: var(--surface-0);
72:  --bg-sunken: var(--surface-1);
73:  --bg-card: var(--surface-2);
74:  --bg-elevated: var(--surface-3);
75:  --bg-input: var(--surface-4);
76:  --bg-terminal: var(--aubergine-deep);
77:  --text-strong: var(--ink-1);
78:  --text-body: var(--ink-2);
79:  --text-muted: var(--ink-3);
80:  --text-faint: var(--ink-4);
81:  --border-subtle: var(--line-subtle);
82:  --border-default: var(--line);
83:  --border-strong: var(--line-strong);
84:  --accent: var(--orange-500);
85:  --accent-hover: hsl(24deg 100% 60%);
86:  --accent-active: var(--orange-600);
87:  --accent-text: var(--ink-on-accent);
88:  --accent-soft: hsl(24deg 94% 53% / 13%); // fond teinté
89:  --accent-ring: hsl(24deg 94% 53% / 45%);
90:  --accent-2: var(--aubergine-light); // accent secondaire
91:  --accent-2-soft: hsl(319deg 40% 30% / 28%);
92:  --border-terminal: hsl(319deg 40% 30% / 40%); // bordure fenêtre terminal (TerminalWindow.jsx)
93-  --link: var(--term-blue);
94-  --prompt: var(--term-green);
--
189-
190-  // Anneau de focus
191:  --ring-accent: 0 0 0 3px var(--accent-ring);
192-
193-  // ============================================================
--
204-  // Ambiance & contrastes héro
205-  --atmos-opacity: 0.52;
206:  --atmos-fallback-accent: var(--accent-soft);
207:  --atmos-fallback-accent-2: var(--accent-2-soft);
208-  --hero-title-shadow: 0 2px 14px color-mix(in srgb, var(--surface-0) 80%, transparent);
209-  --hero-sub-shadow: 0 1px 8px color-mix(in srgb, var(--surface-0) 70%, transparent);
--
213-//  Surcharge Thème Clair — Palette « Papier technique / Crème solaire »
214-// ============================================================
215:[data-theme="light"] {
216-  // ---- Rampe de surfaces neutres primitives ----
217-  --surface-0: hsl(38deg 25% 97%);
--
234-
235-  // ---- Alias sémantiques ----
236:  --bg-page: var(--surface-0);
237:  --bg-sunken: var(--surface-1);
238:  --bg-card: var(--surface-2);
239:  --bg-elevated: var(--surface-3);
240:  --bg-input: var(--surface-4);
241:  --text-strong: var(--ink-1);
242:  --text-body: var(--ink-2);
243:  --text-muted: var(--ink-3);
244:  --text-faint: var(--ink-4);
245:  --accent-text: var(--ink-on-accent);
246:  --border-subtle: var(--line-subtle);
247:  --border-default: var(--line);
248:  --border-strong: var(--line-strong);
249-
250-  // ---- Accentuation & interactions ----
251:  --accent: hsl(24deg 95% 44%);
252:  --accent-hover: hsl(24deg 95% 48%);
253:  --accent-active: hsl(24deg 95% 40%);
254:  --accent-soft: hsl(24deg 94% 53% / 10%);
255:  --accent-ring: hsl(24deg 94% 53% / 35%);
256:  --accent-2: hsl(319deg 33% 40%);
257:  --accent-2-soft: hsl(319deg 40% 40% / 15%);
258-  --selection: hsl(24deg 94% 53% / 22%);
259-  --overlay: hsl(320deg 30% 10% / 40%);
--
267-  // Ambiance & contrastes héro en thème clair (visibilité rehaussée)
268-  --atmos-opacity: 0.46;
269:  --atmos-fallback-accent: color-mix(in srgb, var(--accent) 22%, transparent);
270:  --atmos-fallback-accent-2: color-mix(in srgb, var(--accent-2) 20%, transparent);
271-  --hero-title-shadow: none;
272-  --hero-sub-shadow: none;
--
293-  --line: hsl(315deg 12% 25%);
294-  --line-strong: hsl(314deg 11% 34%);
295:  --bg-page: var(--surface-0);
296:  --bg-sunken: var(--surface-1);
297:  --bg-card: var(--surface-2);
298:  --bg-elevated: var(--surface-3);
299:  --bg-input: var(--surface-4);
300:  --bg-terminal: var(--aubergine-deep);
301:  --text-strong: hsl(30deg 18% 95%);
302:  --text-body: hsl(28deg 10% 74%);
303:  --text-muted: hsl(25deg 7% 54%);
304:  --text-faint: hsl(22deg 6% 40%);
305:  --border-subtle: hsl(316deg 14% 18%);
306:  --border-default: hsl(315deg 12% 25%);
307:  --border-terminal: hsl(319deg 40% 30% / 40%);
308:  --accent: var(--orange-500);
309:  --accent-hover: hsl(24deg 100% 60%);
310:  --accent-active: var(--orange-600);
311:  --accent-soft: hsl(24deg 94% 53% / 13%);
312:  --accent-ring: hsl(24deg 94% 53% / 45%);
313:  --accent-2: var(--aubergine-light);
314:  --accent-2-soft: hsl(319deg 40% 30% / 28%);
315-  --ink-on-accent: hsl(320deg 60% 5%);
316:  --accent-text: var(--ink-on-accent);
317-  --link: var(--term-blue);
318-  --prompt: var(--term-green);
--
331-}
332-
333:[data-theme="light"] {
334-  .hdr__logo--dark,
335-  .ftr__logo--dark {

exec
/bin/zsh -lc "for f in app/pages/about.vue app/pages/contact/card.vue app/pages/blog/index.vue app/pages/confidentialite.vue app/pages/mentions-legales.vue app/pages/index.vue app/pages/services.vue app/pages/contact/index.vue 'app/pages/blog/[...slug].vue'; do echo \"--- "'$f"; rg -n -A3 -B2 '"'usePageSeo|description:|jsonLd|offers|price|3 500|3500|490' \""'$f"; done; printf '"'%s\\n' '---OFFER DOC---'; sed -n '1,260p' docs/jouan-ovh-offre-commerciale-v1.1-updated.md; printf '%s\\n' '---EPIC15---'; sed -n '1228,1325p' docs/planning-artifacts/epics.md; printf '%s\\n' '---DIFF STATUS SECTION---'; sed -n '1,220p' <(sed -n '/diff --git a\\/docs\\/implementation-artifacts\\/sprint-status.yaml/,"'$p'"' docs/implementation-artifacts/code-reviews/15-4/full.diff)" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
--- app/pages/about.vue
174-};
175-
176:usePageSeo({
177-  title: pageTitle,
178:  description: pageDescription,
179-  path: "/about",
180-  image: "/images/portrait.jpeg",
181-  type: "profile",
182-  twitterCard: "summary",
183:  jsonLd: aboutJsonLd,
184-});
185-</script>
186-
--- app/pages/contact/card.vue
101-};
102-
103:usePageSeo({
104-  title: "Carte de visite — Simon Jouan",
105:  description:
106-    "Fiche contact et QR code vCard de Simon Jouan, Développeur Full Stack spécialisé en systèmes IA et automatisation métier.",
107-  path: "/contact/card",
108-  image: "/images/portrait.jpeg",
109-  type: "profile",
110:  jsonLd: cardJsonLd,
111-});
112-</script>
113-
--- app/pages/blog/index.vue
112-  "@type": "Blog",
113-  name: "Notes de dev",
114:  description: pageDescription,
115-  url: pageUrl,
116-  blogPost: (articles.value ?? []).map((article) => ({
117-    "@type": "BlogPosting",
118-    headline: article.title,
119:    description: article.description,
120-    datePublished: article.date,
121-    author: {
122-      "@type": "Person",
--
143-};
144-
145:usePageSeo({
146-  title: pageTitle,
147:  description: pageDescription,
148-  path: "/blog",
149-  type: "website",
150:  jsonLd: blogJsonLd,
151-});
152-</script>
153-
--- app/pages/confidentialite.vue
153-<script setup lang="ts">
154-import { SITE } from "~/data/site";
155:import { usePageSeo } from "~/composables/usePageSeo";
156-
157-const profile = SITE.profile;
158-
159:usePageSeo({
160-  title: "Politique de confidentialité — Simon Jouan",
161:  description:
162-    "Politique de confidentialité et protection des données personnelles (RGPD) du site jouan.ovh — Simon Jouan.",
163-  path: "/confidentialite",
164-  type: "website",
--- app/pages/mentions-legales.vue
91-<script setup lang="ts">
92-import { SITE } from "~/data/site";
93:import { usePageSeo } from "~/composables/usePageSeo";
94-
95-const profile = SITE.profile;
96-
97:usePageSeo({
98-  title: "Mentions légales — Simon Jouan",
99:  description: "Mentions légales, informations éditeur et hébergement du site jouan.ovh — Simon Jouan.",
100-  path: "/mentions-legales",
101-  type: "website",
102-});
--- app/pages/index.vue
462-    name: "Simon Jouan — Systèmes IA, agents & automatisation métier",
463-    url: siteUrl,
464:    description: SITE.profile.role,
465-  },
466-  {
467-    "@context": "https://schema.org",
--
480-];
481-
482:usePageSeo({
483-  title: "Simon Jouan — Systèmes IA, agents & automatisation métier",
484:  description:
485-    "Développeur Full Stack spécialisé en systèmes IA et automatisation métier. Agents IA, intégrations, applications sur mesure et workflows mis en production.",
486-  path: "/",
487-  image: "/images/portrait.jpeg",
488-  type: "website",
489:  jsonLd: homeJsonLd,
490-});
491-</script>
492-
--- app/pages/services.vue
13-
14-        <ul class="grid-3">
15:          <li v-for="offer in offers" :key="offer.id">
16-            <ZCard :id="offer.id" class="offer" :accent="offer.featured" :featured="offer.featured">
17-              <div v-if="offer.badge" class="offer__badge">
18-                <ZBadge :tone="offer.badgeTone || 'neutral'">{{ offer.badge }}</ZBadge>
--
26-              </ul>
27-              <div class="offer__footer">
28:                <div class="offer__price">
29:                  <b>{{ offer.price }}</b>
30-                </div>
31-                <p v-if="offer.disclaimer" class="offer__disclaimer">
32-                  {{ offer.disclaimer }}
--
71-
72-            <div class="care-card__footer">
73:              <div class="care-card__price">
74:                <b>{{ careOffer.price }}</b>
75-              </div>
76-              <p v-if="careOffer.disclaimer" class="care-card__disclaimer">
77-                {{ careOffer.disclaimer }}
--
148-  desc: string;
149-  points: string[];
150:  price: string;
151-  disclaimer?: string;
152-  /** Offre mise en avant : carte accent + glow. */
153-  featured: boolean;
--
160-  badge: string;
161-  title: string;
162:  price: string;
163-  desc: string;
164-  points: string[];
165-  disclaimer: string;
--
179-
180-// Les 3 offres de build officielles V1.1 — 1re personne, vouvoiement, zéro emoji.
181:const offers: Offer[] = [
182-  {
183-    id: "automatisation",
184-    icon: "zap",
--
195-      "Tests, mise en production & documentation courte",
196-    ],
197:    price: "Sur devis",
198-    featured: false,
199-    ctaText: "Décrire mon besoin",
200-    ctaAriaLabel: "Décrire mon besoin pour une automatisation ciblée",
--
215-      "Déploiement en production, documentation & mesure initiale",
216-    ],
217:    price: "Sur devis",
218-    featured: true,
219-    ctaText: "Identifier un workflow",
220-    ctaAriaLabel: "Identifier un workflow métier",
--
235-      "Supervision avancée, tests automatisés & déploiement souverain",
236-    ],
237:    price: "Sur devis",
238-    featured: false,
239-    ctaText: "Parler du projet",
240-    ctaAriaLabel: "Parler d'un projet de système métier sur mesure",
--
247-  badge: "MAINTIEN EN CONDITION OPÉRATIONNELLE",
248-  title: "AI Care",
249:  price: "À partir de 250 € HT / mois",
250-  desc: "Pour les systèmes qui ont besoin d'être exploités, surveillés et adaptés dans la durée.",
251-  points: [
252-    "Monitoring proactif, détection d'erreurs & alertes d'anomalies",
--
296-  "@type": "WebPage",
297-  name: "Services & Systèmes IA — Simon Jouan",
298:  description:
299-    "Conception et développement de systèmes IA et automatisation de processus métier : automatisation ciblée, workflows complets et applications métier sur mesure.",
300-  url: `${siteUrl}/services`,
301-  mainEntity: {
302-    "@type": "ItemList",
303-    itemListElement: [
304:      ...offers.map((offer, index) => ({
305-        "@type": "ListItem",
306-        position: index + 1,
307-        item: {
308-          "@type": "Service",
309-          name: offer.title,
310:          description: offer.desc,
311-          url: `${siteUrl}/services#${offer.id}`,
312-          provider: {
313-            "@type": "Organization",
--
315-            name: SITE.profile.name,
316-          },
317:          offers: {
318-            "@type": "Offer",
319:            description: offer.price,
320-          },
321-        },
322-      })),
323-      {
324-        "@type": "ListItem",
325:        position: offers.length + 1,
326-        item: {
327-          "@type": "Service",
328-          name: careOffer.title,
329:          description: careOffer.desc,
330-          url: `${siteUrl}/services#${careOffer.id}`,
331-          provider: {
332-            "@type": "Organization",
--
334-            name: SITE.profile.name,
335-          },
336:          offers: {
337-            "@type": "Offer",
338:            description: careOffer.price,
339-          },
340-        },
341-      },
--
344-};
345-
346:usePageSeo({
347-  title: "Services & Systèmes IA — Simon Jouan",
348:  description:
349-    "Conception et développement de systèmes IA et automatisation de processus métier : automatisation ciblée, workflows complets et applications métier sur mesure.",
350-  path: "/services",
351-  image: "/images/portrait.jpeg",
352-  type: "website",
353:  jsonLd: servicesJsonLd,
354-});
355-</script>
356-
--
476-}
477-
478:.offer__price {
479-  font-family: var(--font-mono);
480-  font-size: var(--fs-sm);
481-  color: var(--text-muted);
--
617-}
618-
619:.care-card__price {
620-  font-family: var(--font-mono);
621-  font-size: var(--fs-sm);
622-  color: var(--text-muted);
--- app/pages/contact/index.vue
326-  "@type": "ContactPage",
327-  name: "Contact — Simon Jouan",
328:  description:
329-    "Parlons de votre workflow : décrivez le processus métier qui vous ralentit pour identifier les opportunités d'automatisation et d'agents IA adaptés.",
330-  url: `${siteUrl}/contact`,
331-  mainEntity: {
--
341-};
342-
343:usePageSeo({
344-  title: "Contact — Simon Jouan",
345:  description:
346-    "Parlons de votre workflow : décrivez le processus métier qui vous ralentit pour identifier les opportunités d'automatisation et d'agents IA adaptés.",
347-  path: "/contact",
348-  image: "/images/portrait.jpeg",
349-  type: "website",
350:  jsonLd: contactJsonLd,
351-});
352-</script>
353-
--- app/pages/blog/[...slug].vue
120-}
121-
122:// SEO par article (centralisé via usePageSeo, parité /about, /blog).
123:// usePageSeo résout siteUrl, canonical, og:*, twitter:* et le JSON-LD échappé.
124-const siteUrl = useSiteUrl();
125:usePageSeo(() => {
126-  const article = page.value;
127-  if (!article) {
128-    return null;
--
134-      : `${siteUrl}/${article.image.src}`
135-    : undefined;
136:  const jsonLd = {
137-    "@context": "https://schema.org",
138-    "@type": "BlogPosting",
139-    headline: article.title,
140:    description: article.description,
141-    datePublished: article.date,
142-    author: {
143-      "@type": "Person",
--
160-    title: `${article.title} — Simon Jouan`,
161-    ogTitle: article.title,
162:    description: article.description,
163-    path: article.path,
164-    image: article.image?.src,
165-    imageAlt: article.image?.alt,
166-    type: "article",
167:    jsonLd,
168-  };
169-});
170-</script>
---OFFER DOC---
---
title: "jouan.ovh — Offre commerciale V1.1"
version: "1.1"
date: "2026-09-18"
author: "Simon Jouan"
status: "working-offer"
purpose: "Source de vérité pour présenter et implémenter l'offre commerciale jouan.ovh sur le site."
site: "https://jouan.ovh"
---

# jouan.ovh — Offre commerciale V1.1

## 0. Objectif du document

Ce document définit l'offre commerciale à présenter sur `jouan.ovh`.

Il sert de **source de vérité pour Codex** lors de la mise à jour du site.

La priorité de cette version est simple :

> **Permettre à un prospect de comprendre que Simon peut traiter aussi bien une automatisation ciblée qu'un workflow métier complet, sans donner l'impression qu'un projet démarre obligatoirement à 3 500 € HT.**

Cette version remplace la logique précédente où plusieurs cartes affichaient publiquement :

```text
À partir de 3 500 € HT
```

Le prix reste un sujet commercial important, mais il doit intervenir **après compréhension du processus, de sa fréquence, de son impact et du périmètre réel**.

---

# 1. Positionnement

## Identité

**Développeur Full Stack spécialisé en systèmes IA & automatisation métier**

## Promesse

> **J'automatise les processus commerciaux et opérationnels qui font perdre du temps, des opportunités ou de la capacité aux entreprises.**

## Explication courte

> Je conçois des automatisations, agents IA et applications métier qui s'intègrent aux outils existants — du problème initial jusqu'à la mise en production.

## Différenciateur

> **Je ne construis pas seulement l'automatisation. Je construis le système autour : données, API, interface, sécurité, tests, supervision et déploiement.**

## Doctrine

- douleur avant solution ;
- workflow avant technologie ;
- règles déterministes lorsqu'elles suffisent ;
- IA lorsque lecture, interprétation ou génération apportent réellement de la valeur ;
- agent uniquement lorsqu'une autonomie multi-étapes est utile ;
- humain dans la boucle pour les décisions importantes ;
- mesure avant / après ;
- pas de ROI inventé ;
- pas de promesse d'automatisation totale par défaut.

---

# 2. Principe commercial de cette version

L'offre ne doit plus être comprise comme :

```text
Projet IA
→ minimum 3 500 €
```

Elle doit être comprise comme :

```text
Problème métier
→ diagnostic
→ niveau d'intervention adapté
→ automatisation ciblée OU workflow complet OU système métier
```

Le prix dépend notamment :

- du problème traité ;
- du volume ;
- de la fréquence ;
- des intégrations ;
- de la criticité ;
- des données ;
- de la supervision nécessaire ;
- de la fiabilité attendue ;
- de la valeur créée ;
- du périmètre réel du projet.

La complexité technique n'est pas, à elle seule, le critère de valeur.

Une automatisation simple peut avoir beaucoup de valeur.

Un système complexe peut avoir peu d'intérêt économique.

---

# 3. Architecture de l'offre

L'offre publique repose sur **4 briques** :

1. Diagnostic
2. Automatisation ciblée
3. Workflow métier
4. Système métier sur mesure

Une cinquième brique intervient après livraison lorsque cela se justifie :

5. AI Care

Le **Blueprint** n'est plus présenté comme une offre principale au même niveau que les autres. Il devient un **cadrage facturable optionnel** pour les sujets complexes.

---

# 4. Offre 1 — Diagnostic

## Nom

```text
Diagnostic
```

## Prix public

```text
Gratuit — 20 à 30 minutes
```

## Rôle

Le diagnostic sert à comprendre le processus avant de parler de solution.

Il permet de déterminer :

- ce qui prend du temps ;
- ce qui se répète ;
- qui intervient ;
- quels outils sont utilisés ;
- où se trouvent les frictions ;
- quel volume est concerné ;
- ce qui doit rester humain ;
- si l'IA apporte réellement quelque chose ;
- quel niveau d'intervention est pertinent.

## Texte public recommandé

> **Avant de parler d'IA, on regarde le processus.**
>
> En 20 à 30 minutes, nous passons en revue le workflow actuel, sa fréquence, les outils utilisés et les points de friction.
>
> L'objectif est simplement de déterminer ce qui mérite d'être automatisé — et ce qui ne le mérite pas.

## CTA

```text
Identifier un workflow
```

ou

```text
Décrire mon processus
```

## Garde-fou

Le diagnostic gratuit ne doit pas devenir plusieurs heures de conseil ou un audit complet gratuit.

---

# 5. Offre 2 — Automatisation ciblée

## Nom public

```text
Automatisation ciblée
```

## Positionnement

Pour un problème précis, bien délimité, qui peut être résolu sans construire une application métier complète.

## Exemples

- récupérer des données reçues par email ;
- extraire des informations d'un document ;
- enrichir une fiche prospect ;
- synchroniser deux outils ;
- mettre à jour automatiquement un CRM ;
- générer un compte-rendu ;
- préparer une proposition ;
- classer ou router des demandes ;
- déclencher une action selon certaines règles ;
- supprimer un copier-coller récurrent.

## Texte public recommandé

> **Un problème précis ne nécessite pas forcément un gros projet.**
>
> Lorsqu'une tâche répétitive peut être supprimée avec une automatisation bien ciblée, je construis uniquement ce qui est nécessaire et je l'intègre aux outils déjà en place.

## Ce que cela peut inclure

- cartographie rapide du flux ;
- automatisation ;
- API / webhook ;
- traitement de données ;
- IA si utile ;
- validation humaine si nécessaire ;
- tests ;
- mise en production ;
- documentation courte.

## Prix public

**Ne pas afficher de prix minimum.**

Afficher :

```text
Sur devis selon le workflow
```

ou ne pas afficher de prix du tout.

## Hypothèse commerciale interne

Cette catégorie sert à accepter des missions plus petites lorsqu'elles sont :

- rapides à délivrer ;
- clairement bornées ;
- rentables ;
- utiles pour le client ;
- faibles en support ;
- potentiellement réutilisables ou génératrices de preuve.

Ne pas transformer cette catégorie en catalogue de micro-prestations low-cost.

---

# 6. Offre 3 — Workflow métier

## Nom public recommandé

```text
Workflow métier
```

Alternative si la marque souhaite conserver le nom actuel :

```text
AI Workflow Sprint
```

---EPIC15---
## Epic 15: Repositionnement Commercial V1.1 — Désancrage Tarifaire & Niveaux d'Intervention

Simon Jouan souhaite supprimer l'affichage récurrent du prix d'entrée public de 3 500 € HT qui freinait les prospects ayant des besoins d'automatisation ciblée, et restructurer l'offre en 3 niveaux d'intervention sur devis, tout en conservant le Workflow métier comme offre cœur, AI Care isolé après mise en production à partir de 250 € HT/mois, et le Blueprint en cadrage optionnel.

### Story 15.1: Homepage — Suppression des Prix d'Entrée, Liens Contextuels & Phrase de Réassurance

As a visiteur découvrant la page d'accueil,
I want comprendre que Simon intervient aussi bien sur une automatisation ciblée que sur un workflow complet sans imposer un ticket d'entrée public à 3 500 € HT,
So that je me sente libre de le contacter pour qualifier mon besoin réel (FR49, NFR6, CAP-1).

**Acceptance Criteria:**

**Given** la section expertises de `app/pages/index.vue`
**When** le visiteur consulte les 3 cartes de services
**Then** la mention `À partir de 3 500 € HT` est intégralement retirée des cartes *Automatisation de processus métier* et *Agents IA intégrés à vos outils*
**And** chaque carte intègre un lien d'exploration contextuel ciblant `/services` :
  - *Automatisation :* « Voir les types d'automatisation → »
  - *Agents IA :* « Voir quand utiliser un agent → »
  - *Applications sur mesure :* « Découvrir les projets sur mesure → »
**And** la phrase de réassurance officielle est insérée à proximité des expertises ou du CTA intermédiaire :
  > *« Un besoin simple ne nécessite pas forcément un gros projet. Je dimensionne la solution selon le workflow réel : parfois quelques automatisations suffisent ; parfois il faut construire un système métier complet. »*
**And** le style est strictement conforme aux tokens du design system (`var(--token)`), responsive et sans régression visuelle.

### Story 15.2: Page Services — Restructuration des 3 Offres de Build sur Devis & Relégation du Blueprint

As a prospect consultant la page `/services`,
I want apprécier immédiatement les 3 niveaux d'intervention possibles et comprendre le positionnement sans prix plancher bloquant,
So that je puisse identifier le format adapté à mon organisation (FR50, CAP-2).

**Acceptance Criteria:**

**Given** la route `/services` (`app/pages/services.vue`)
**When** la page est affichée
**Then** le Hero présente le H1 officiel :
  > *« Le bon niveau de système pour le bon problème. »*
  avec le texte d'introduction centré sur le workflow plutôt que sur la technologie
**And** la grille principale présente les 3 offres de build :
  1. *Automatisation ciblée :* (Eyebrow `BESOIN PRÉCIS`, titre, accroche « Supprimer une tâche répétitive sans reconstruire tout le processus », prix `Sur devis`, CTA « Décrire mon besoin »)
  2. *Workflow métier :* (Eyebrow `OFFRE CŒUR`, titre, accroche « Transformer un processus complet en système opérationnel », prix `Sur devis`, carte visuellement mise en avant / featured, CTA « Identifier un workflow »)
  3. *Système métier sur mesure :* (Eyebrow `PROJET COMPLEXE`, titre, accroche « Construire l'application lorsque l'automatisation devient un vrai produit », prix `Sur devis`, CTA « Parler du projet »)
**And** l'offre *AI Workflow Blueprint* est retirée des cartes de build principales pour devenir une option de cadrage dans la section process.

### Story 15.3: Page Services — Section Dédiée AI Care Après Mise en Production & Process 4 Étapes

As a client ayant déployé un système,
I want comprendre comment Simon garantit la fiabilité et la maintenance de la capacité dans la durée,
So that mon investissement reste opérationnel et maîtrisé en coûts (FR51, CAP-3).

**Acceptance Criteria:**

**Given** la page `/services` (`app/pages/services.vue`)
**When** l'utilisateur parcourt la page sous la grille des offres de build
**Then** une section autonome est créée spécifiquement pour l'exploitation post-déploiement :
  - Eyebrow : `<h2 class="eyebrow"><span aria-hidden="true">// </span>APRÈS LA MISE EN PRODUCTION</h2>`
  - Titre : `Le système doit continuer à fonctionner.`
  - Carte ou bloc dédié `AI Care` affichant `À partir de 250 € HT / mois`
  - Descriptif axé sur le monitoring, la maintenance corrective, le suivi des coûts d'inférence et les adaptations mineures d'APIs
  - Mention explicite des coûts variables d'infrastructures et tokens tiers non inclus
  - CTA orienté « Découvrir AI Care »
**And** la section du déroulé en 4 étapes (`steps`) est mise à jour :
  - *01 — Diagnostic :* Gratuit — 20 à 30 minutes
  - *02 — Cadrage :* Cadrage du workflow cible, avec mention explicite du Blueprint facturable optionnel (à partir de 750 € HT) pour les sujets complexes
  - *03 — Construction & intégration :* Développement uniquement du niveau de système nécessaire
  - *04 — Exploitation & mesure :* Mise en production, mesure initiale et maintien opérationnel.

### Story 15.4: Cohérence Globale, SEO, Formulaire de Contact & Gate Docker Nitro SSG

As a développeur garantissant la qualité du projet,
I want auditer l'ensemble des parcours et formulaires et valider la compilation statique,
So that le site soit exempt de régressions fonctionnelles, visuelles ou d'accessibilité (FR52, NFR4, NFR6, CAP-4).

**Acceptance Criteria:**

**Given** l'ensemble des routes statiques de `jouan.ovh`
**When** on audite le CTA final global et la page `/contact`
**Then** le CTA global maintient la question « Quel process vous fait perdre du temps chaque semaine ? » avec le terminal `$ ./workflow --inspect`
**And** le formulaire de contact dans `app/pages/contact.vue` qualifie le processus sans champ de budget obligatoire
**And** les méta-descriptions SEO et OpenGraph gérées par `usePageSeo()` sont alignées sur l'Offre V1.1 sans référence obsolète aux 3 500 €
**And** les thèmes clair et sombre s'affichent avec un contraste conforme WCAG AA
**And** la suite de validation Docker s'exécute avec un succès complet à 100% :
  ```sh
  docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
  ```






---DIFF STATUS SECTION---
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 0b0e021..bd1f521 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-18 (Story 15.3 prête pour le dev)"
+last_updated: "2026-09-18 (Story 15.4 terminée et prête pour review)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -157,8 +157,8 @@ development_status:
   epic-15: in-progress
   15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance: done
   15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint: done
-  15-3-page-services-section-dediee-ai-care-et-process-4-etapes: ready-for-dev
-  15-4-coherence-globale-seo-formulaire-contact-et-gate-docker: backlog
+  15-3-page-services-section-dediee-ai-care-et-process-4-etapes: done
+  15-4-coherence-globale-seo-formulaire-contact-et-gate-docker: review
   epic-15-retrospective: optional
 
 

codex
Le diff de la Story 15.4 ne modifie pas le formulaire, les CTA ni `usePageSeo`; il documente surtout des vérifications et réintroduit les changements de 15.3. Je vérifie maintenant les assertions de qualité (statut sprint, gate Docker et cohérence des styles/SEO) pour distinguer les critères réellement satisfaits des affirmations non prouvées.
exec
/bin/zsh -lc 'docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"' in /Users/simon/dev/jouan.ovh
 succeeded in 15484ms:
! Corepack is about to download https://registry.npmjs.org/pnpm/-/pnpm-11.8.0.tgz
$ eslint . && stylelint "app/assets/**/*.scss" "app/**/*.vue"
$ nuxi typecheck
$ nuxi generate
│
▲  Changing NODE_ENV from development to production, to avoid unintended behavior.
┌  Building Nuxt for production...
│
●  Nuxt 4.4.8 (with Nitro 2.13.4, Vite 7.3.5 and Vue 3.5.38)

[@nuxt/content]  WARN  "blog/blog/.gitkeep" is ignored because parsing is failed. Error: .gitkeep files are not supported.

[@nuxt/content] ✔ Processed 2 collections and 1 files in 8.43ms (0 cached, 1 parsed)

 WARN  Payload extraction is recommended for full-static output. You can enable it by setting experimental.payloadExtraction to true or 'client'.

│
●  Nitro preset: static
ℹ Building client...
ℹ vite v7.3.5 building client environment for production...

 WARN  [plugin nuxt:module-preload-polyfill] Sourcemap is likely to be incorrect: a plugin (nuxt:module-preload-polyfill) was used to transform files, but didn't generate a sourcemap for the transformation. Consult the plugin documentation for help

ℹ transforming...
ℹ ✓ 368 modules transformed.
ℹ rendering chunks...
ℹ computing gzip size...
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/sqlite3-opfs-async-proxy-C_otN2ZJ.js            9.45 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/manifest.json                                        34.97 kB │ gzip:   2.77 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/UbuntuMono-Bold.DxtomZAI.ttf                  174.01 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/UbuntuMono-Regular.C0QEQ_U4.ttf               189.00 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/UbuntuMono-Italic.B29yKq6H.ttf                193.38 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/sqlite3-worker1-bundler-friendly-Bv6ABw9v.js  196.87 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/UbuntuMono-BoldItalic.TXXgaKQw.ttf            198.23 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/sqlite3.DBpDb1lf.wasm                         856.45 kB │ gzip: 393.51 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/sqlite3-DBpDb1lf.wasm                         856.45 kB │ gzip: 393.51 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ProsePre.D5orA6B_.css                           0.03 kB │ gzip:   0.05 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ZAvatar.CvXu5kTF.css                            0.76 kB │ gzip:   0.39 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/LinkListComponent.BRT0voAK.css                  0.97 kB │ gzip:   0.48 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ZBadge.BAw1B01J.css                             1.11 kB │ gzip:   0.43 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/HomeAtmosComponent.Cjy0p702.css                 1.29 kB │ gzip:   0.48 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ZCard.Cx-66epl.css                              1.29 kB │ gzip:   0.51 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/confidentialite.BeEkDW2c.css                    1.31 kB │ gzip:   0.45 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/mentions-legales.CRNo1qcx.css                   1.31 kB │ gzip:   0.45 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ZTag.f2Aq6DLg.css                               1.46 kB │ gzip:   0.53 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/index.1OU3feSG.css                              1.65 kB │ gzip:   0.53 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/error-500.CIKAhgAS.css                          1.91 kB │ gzip:   0.73 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/error-404.BvOk15Jd.css                          2.43 kB │ gzip:   0.86 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ZButton.B_tmGfvE.css                            3.48 kB │ gzip:   1.04 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/about.BT8rVsY7.css                              4.13 kB │ gzip:   1.04 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/card.CLLCUm53.css                               4.68 kB │ gzip:   1.20 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/_...DpFKtM3A.css                                4.71 kB │ gzip:   0.95 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/index.aw3Aiyvc.css                              5.33 kB │ gzip:   1.22 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/services.npR0bN7y.css                           6.84 kB │ gzip:   1.24 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/entry.Dla0HiAk.css                             13.24 kB │ gzip:   4.04 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/default.CrVG7B4r.css                           15.56 kB │ gzip:   3.13 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/index.C-IV2i1o.css                             23.56 kB │ gzip:   4.08 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DlAUqK2U.js                                     0.09 kB │ gzip:   0.10 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/n1zWNR2J.js                                     0.17 kB │ gzip:   0.15 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CJY0qgoC.js                                     0.21 kB │ gzip:   0.18 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/C8PTtS-j.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/nFMuOSxl.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ClSeXbLI.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/C4mrklmW.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/B7vvvHJ_.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Dbo_wsXF.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DQhwL5fc.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DNUbhLKz.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Bt8hMBZe.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/C5nBAWL_.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D_y1CcCj.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DuoZgMwW.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CS2b3pOT.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/HhL7bRG4.js                                     0.26 kB │ gzip:   0.22 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/cd1nIFSh.js                                     0.38 kB │ gzip:   0.27 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/B7MqeTD4.js                                     0.41 kB │ gzip:   0.25 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ByqgbwH3.js                                     0.48 kB │ gzip:   0.36 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ry0JpxR-.js                                     0.49 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/C267WOlK.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/2PSA0vP8.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/R2PzY2Ht.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DPASN3ie.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/sptR2pT-.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CB66_Pn-.js                                     0.51 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BeGlXpH2.js                                     0.63 kB │ gzip:   0.37 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DV1tRWF9.js                                     0.64 kB │ gzip:   0.42 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Ch0jaO-Y.js                                     0.87 kB │ gzip:   0.54 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DSc7xPyf.js                                     1.20 kB │ gzip:   0.66 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/B4yDLBBt.js                                     1.30 kB │ gzip:   0.57 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/B2eXuh9n.js                                     1.31 kB │ gzip:   0.75 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/136_PJH8.js                                     1.71 kB │ gzip:   0.92 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BEzvOSIJ.js                                     2.83 kB │ gzip:   1.36 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Vb7dMyxd.js                                     3.37 kB │ gzip:   1.48 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DrSOHOCQ.js                                     3.48 kB │ gzip:   1.56 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/B9eS0H6H.js                                     3.79 kB │ gzip:   1.71 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BoozPrd_.js                                     3.84 kB │ gzip:   1.85 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Cjj-pCl3.js                                     4.93 kB │ gzip:   2.00 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BhOczs_6.js                                     5.67 kB │ gzip:   2.26 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/KWWpOzOI.js                                     5.88 kB │ gzip:   2.60 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D8Z3pEOO.js                                     6.67 kB │ gzip:   2.95 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DLnsczdL.js                                     7.97 kB │ gzip:   3.01 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Cl1WKXXb.js                                     8.33 kB │ gzip:   3.51 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CdkXb1kt.js                                     8.54 kB │ gzip:   3.65 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/qaUWRbzi.js                                    10.10 kB │ gzip:   3.93 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ChOVPWDE.js                                    10.85 kB │ gzip:   4.23 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Bg0tGrpK.js                                    12.40 kB │ gzip:   4.91 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DYIIeKss.js                                    25.24 kB │ gzip:   8.77 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Dy66BpEj.js                                    33.07 kB │ gzip:  12.07 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BMCBmpPj.js                                    50.26 kB │ gzip:  20.39 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Dig94_vF.js                                   191.28 kB │ gzip:  72.32 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Zi78bNBY.js                                   199.77 kB │ gzip:  59.04 kB
ℹ ✓ built in 2.48s
✔ Client built in 2481ms
ℹ Building server...
ℹ vite v7.3.5 building ssr environment for production...
ℹ transforming...
ℹ ✓ 413 modules transformed.
ℹ rendering chunks...
ℹ ✓ built in 2.40s
✔ Server built in 2414ms
[nitro] ℹ Initializing prerenderer
[nitro] ℹ Prerendering 4 initial routes with crawler
[nitro]   ├─ /200.html (51ms)
[nitro]   ├─ /404.html (51ms)
[nitro]   ├─ / (62ms)
[nitro]   ├─ /__nuxt_content/blog/sql_dump.txt (62ms)
[nitro]   ├─ /mentions-legales (38ms)
[nitro]   ├─ /confidentialite (38ms)
[nitro]   ├─ /services (39ms)
[nitro]   ├─ /contact (39ms)
[nitro]   ├─ /about (39ms)
[nitro]   ├─ /blog (40ms)
[nitro]   ├─ /contact/card (37ms)
[nitro]   ├─ /_ipx/s_48x48/images/logo_black_256x256.png (68ms)
[nitro]   ├─ /_ipx/f_webp&s_380x214/images/projects/keova-signal-dashboard.png (91ms)
[nitro]   ├─ /_ipx/s_44x44/images/logo_black_256x256.png (68ms)
[nitro]   ├─ /_ipx/s_24x24/images/logo_white.png (74ms)
[nitro]   ├─ /_ipx/s_22x22/images/logo_black_256x256.png (73ms)
[nitro]   ├─ /_ipx/s_24x24/images/logo_black_256x256.png (77ms)
[nitro]   ├─ /_ipx/s_48x48/images/logo_white.png (70ms)
[nitro]   ├─ /_ipx/s_22x22/images/logo_white.png (80ms)
[nitro]   ├─ /_ipx/s_44x44/images/logo_white.png (80ms)
[nitro]   ├─ /_ipx/_/images/portrait.jpeg (48ms)
[nitro]   ├─ /_ipx/f_webp&s_380x214/images/projects/debrief-dashboard.png (188ms)
[nitro]   ├─ /_ipx/s_220x165/images/undraw_code_thinking_re_gka2.svg (91ms)
[nitro]   ├─ /_ipx/s_240x240/images/qr-code.svg (96ms)
[nitro]   ├─ /_ipx/s_440x330/images/undraw_code_thinking_re_gka2.svg (91ms)
[nitro]   ├─ /_ipx/s_480x480/images/qr-code.svg (96ms)
[nitro]   ├─ /_ipx/f_webp&s_760x428/images/projects/keova-signal-dashboard.png (188ms)
[nitro]   ├─ /_ipx/f_webp&s_760x428/images/projects/debrief-dashboard.png (188ms)
[nitro] ℹ Prerendered 28 routes in 2.67 seconds
[nitro] ✔ Generated public .output/public
[nitro] ✔ You can preview this build using npx serve .output/public
│
└  ✨ You can now deploy .output/public to any static hosting!

exec
/bin/zsh -lc "printf '%s\\n' '---OLD PRICE SEARCH APP/OUTPUT---'; rg -n -i '3\\s*500|3500|490' app .output/public || true; printf '%s\\n' '---STYLE VALUES IN DIFF ADDITIONS---'; sed -n '/diff --git a\\/app\\/pages\\/services.vue/,/diff --git/p' docs/implementation-artifacts/code-reviews/15-4/full.diff | rg '"'^'"\\+.*(px|opacity|hsl|rgb|#|rem|em)' || true; printf '%s\\n' '---DIFF SERVICE CONTEXT---'; sed -n '1,220p' docs/implementation-artifacts/code-reviews/15-4/full.diff | nl -ba | sed -n '1,220p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---OLD PRICE SEARCH APP/OUTPUT---
.output/public/_nuxt/BMCBmpPj.js:1:import{_ as Lt}from"./Cl1WKXXb.js";import{_ as ve}from"./BhOczs_6.js";import{_ as zt}from"./DV1tRWF9.js";import{L as jt}from"./DSc7xPyf.js";import{e as me,S as P,o as T,c as $,a as d,b as k,w as U,t as O,g as X,F as ce,A as _e,d as z,s as At,aA as qt,I as E,k as ut,R as ht,U as Rt,j as Vt,ac as he,N as Gt,O as Wt,P as Xt,aB as Kt,y as Yt,W as Jt,V as Zt,v as qe,B as Qt,Q as vt,x as ei}from"./Dig94_vF.js";import{_ as Be}from"./DlAUqK2U.js";import{_ as Ht,a as ti}from"./CdkXb1kt.js";import{u as ii}from"./n1zWNR2J.js";const ni={class:"ftr"},oi={class:"ftr__container"},ai={class:"ftr__in"},ri={class:"ftr__brand-col"},si={class:"ftr__tagline"},li={class:"ftr__col","aria-label":"Navigation du pied de page"},ui={class:"ftr__col"},di={class:"ftr__list"},ci={key:1,class:"ftr__link ftr__link--static"},mi={class:"ftr__col"},pi={class:"ftr__bottom-bar"},hi={class:"ftr__container ftr__bottom"},fi=me({__name:"FooterComponent",setup(t){const e=[{to:"/",label:"Accueil"},{to:"/services",label:"Services"},{to:"/about",label:"À propos"},{to:"/blog",label:"Blog"},{to:"/contact",label:"Contact"},{to:"/confidentialite",label:"Confidentialité"},{to:"/mentions-legales",label:"Mentions légales"}],i=P.profile,u=P.projects,f=new Date().getFullYear();return(h,l)=>{const m=Lt,c=ve,v=zt;return T(),$("footer",ni,[d("div",oi,[d("div",ai,[d("div",ri,[k(c,{to:"/",class:"ftr__brand"},{default:U(()=>[k(m,{src:"/images/logo_white.png",alt:"",class:"ftr__logo ftr__logo--dark",width:"22",height:"22"}),k(m,{src:"/images/logo_black_256x256.png",alt:"",class:"ftr__logo ftr__logo--light",width:"22",height:"22"}),l[0]||(l[0]=d("span",null,[d("b",null,"jouan"),d("span",{class:"dim"},".ovh")],-1))]),_:1}),d("p",si,O(X(i).role)+". "+O(X(i).city)+".",1)]),d("nav",li,[l[1]||(l[1]=d("h2",{class:"ftr__title"},"// Navigation",-1)),(T(),$(ce,null,_e(e,w=>k(c,{key:w.to,to:w.to,class:"ftr__link"},{default:U(()=>[z(O(w.label),1)]),_:2},1032,["to"])),64))]),d("div",ui,[l[2]||(l[2]=d("h2",{class:"ftr__title"},"// Projets",-1)),d("ul",di,[(T(!0),$(ce,null,_e(X(u),w=>(T(),$("li",{key:w.name},[w.url?(T(),At(v,{key:0,href:w.url,rel:"noopener noreferrer",class:"ftr__link"},{default:U(()=>[z(O(w.name),1)]),_:2},1032,["href"])):(T(),$("span",ci,O(w.name),1))]))),128))])]),d("div",mi,[l[3]||(l[3]=d("h2",{class:"ftr__title"},"// Réseaux",-1)),k(jt)])])]),d("div",pi,[d("div",hi,[d("span",null,"© "+O(X(f))+" Simon Jouan — jouan.ovh",1),l[4]||(l[4]=d("span",{class:"ftr__term"},[z("anon.@jouan.ovh:~$ "),d("span",{class:"ftr__cmd"},'echo "merci de votre visite"')],-1))])])])}}}),wi=Object.assign(Be(fi,[["__scopeId","data-v-61d5e059"]]),{__name:"FooterComponent"}),bi=["aria-label"],vi={class:"screen-reader-text","aria-live":"polite"},gi=me({__name:"ThemeToggle",setup(t){const{preference:e,resolvedTheme:i,cycleTheme:u}=qt(),f=E(""),h=ut(()=>e.value==="system"?"monitor":e.value==="dark"?"moon":"sun"),l=ut(()=>e.value==="system"?`Thème : Système (${i.value==="dark"?"Sombre":"Clair"} actif). Cliquer pour forcer le mode Sombre.`:e.value==="dark"?"Thème : Sombre forcé. Cliquer pour forcer le mode Clair.":"Thème : Clair forcé. Cliquer pour revenir au mode Système."),m=()=>{u();const c={system:"Système",dark:"Sombre",light:"Clair"};f.value=`Mode ${c[e.value]||"Système"} activé.`};return(c,v)=>{const w=Ht;return T(),$("button",{type:"button",class:"theme-toggle","aria-label":l.value,title:"Changer de thème (Système / Sombre / Clair)",onClick:m},[k(w,{name:h.value,class:"theme-toggle__icon"},null,8,["name"]),d("span",vi,O(f.value),1)],8,bi)}}}),_i=Object.assign(Be(gi,[["__scopeId","data-v-61d5995b"]]),{__name:"ThemeToggle"}),yi=globalThis.setInterval,ki=["datetime","aria-label"],xi={class:"current-time__hours"},Ci={class:"current-time__minutes"},Ei=me({__name:"CurrentTime",setup(t){const e=E("--"),i=E("--"),u=E(""),f=ut(()=>e.value==="--"?"Heure locale":`Heure locale (${P.profile.city}) : ${e.value}h${i.value}`);function h(){const m=new Date,c=new Intl.DateTimeFormat("en-GB",{hour:"2-digit",minute:"2-digit",hour12:!1,timeZone:"Europe/Paris"}).formatToParts(m),v=c.find(g=>g.type==="hour")?.value??"",w=c.find(g=>g.type==="minute")?.value??"";e.value=v.padStart(2,"0"),i.value=w.padStart(2,"0"),u.value=m.toISOString()}const l=E(null);return ht(()=>{h(),l.value=yi(h,1e3)}),Rt(()=>{l.value!==null&&clearInterval(l.value)}),(m,c)=>(T(),$("time",{class:"current-time",datetime:u.value,"aria-label":f.value},[d("span",xi,O(e.value),1),c[0]||(c[0]=d("span",{class:"current-time__colon","aria-hidden":"true"},":",-1)),d("span",Ci,O(i.value),1)],8,ki))}}),Ti=Object.assign(Be(Ei,[["__scopeId","data-v-d0ca7980"]]),{__name:"CurrentTime"}),Si={command:"helloWorld",description:"Un petit Bonjour !",run:function(t){return`Bonjour, ${t?.userName??"anon."} ! Bienvenue dans le terminal.`}},Mi={command:"help",description:"Liste les commandes disponibles.",run:function(){return`<ul>${Object.values(q.programs).map(e=>`<li>${e.command} - ${e.description}</li>`).join("")}</ul>`}},Ii={command:"new",description:"Ouvre un nouveau terminal.",initialData:"Data dans la nouvelle fenêtre.",run:(t,e,i)=>e&&i?(e({initialData:i}),`Nouvelle fenêtre de terminal ouverte avec les données suivantes : ${i}`):e?(e(),"Un nouveau terminal a été ouvert."):"Impossible d'ouvrir un nouveau terminal."};var Oi="2.0.10",Dt=500,gt="user-agent",ye="",_t="?",S={FUNCTION:"function",OBJECT:"object",STRING:"string",UNDEFINED:"undefined"},H="browser",Q="cpu",K="device",j="engine",D="os",ke="result",a="name",n="type",s="vendor",r="version",A="architecture",Ne="major",o="model",Ke="console",p="mobile",y="tablet",M="smarttv",W="wearable",Ve="xr",De="embedded",$i="fetcher",J="inapp",ft="brands",ue="formFactors",wt="fullVersionList",xe="platform",bt="platformVersion",Ze="bitness",ae="sec-ch-ua",Li=ae+"-full-version-list",Ai=ae+"-arch",Ri=ae+"-"+Ze,Hi=ae+"-form-factors",Di=ae+"-"+p,Ni=ae+"-"+o,Nt=ae+"-"+xe,Ui=Nt+"-version",Ut=[ft,wt,p,o,xe,bt,A,ue,Ze],Ge="Amazon",fe="Apple",yt="ASUS",kt="BlackBerry",se="Google",et="Huawei",tt="Lenovo",xt="Honor",We="LG",it="Microsoft",nt="Motorola",Ct="Nvidia",Et="OnePlus",ot="OPPO",Oe="Samsung",Tt="Sharp",$e="Sony",at="Xiaomi",rt="Zebra",St="Chrome",Mt="Chromium",ie="Chromecast",Ye="Edge",Le="Firefox",we="Opera",st="Facebook",It="Sogou",be="Mobile ",le=" Browser",dt="Windows",Pi=typeof window!==S.UNDEFINED,R=Pi&&window.navigator?window.navigator:void 0,de=R&&R.userAgentData?R.userAgentData:void 0,Bi=function(t,e){var i={},u=e;if(!Je(e)){u={};for(var f in e)for(var h in e[f])u[h]=e[f][h].concat(u[h]?u[h]:[])}for(var l in t)i[l]=u[l]&&u[l].length%2===0?u[l].concat(t[l]):t[l];return i},Qe=function(t){for(var e={},i=0;i<t.length;i++)e[t[i].toUpperCase()]=t[i];return e},ct=function(t,e){if(typeof t===S.OBJECT&&t.length>0){for(var i in t)if(ne(e)==ne(t[i]))return!0;return!1}return Ce(t)?ne(e)==ne(t):!1},Je=function(t,e){for(var i in t)return/^(browser|cpu|device|engine|os)$/.test(i)||(e?Je(t[i]):!1)},Ce=function(t){return typeof t===S.STRING},lt=function(t){if(t){for(var e=[],i=ge(t).split(","),u=0;u<i.length;u++)if(i[u].indexOf(";")>-1){var f=Pe(i[u]).split(";v=");e[u]={brand:f[0],version:f[1]}}else e[u]=Pe(i[u]);return e}},ne=function(t){return Ce(t)?t.toLowerCase():t},mt=function(t){return Ce(t)?Ue(/[^\d\.]/g,t).split(".")[0]:void 0},ge=function(t){return Ce(t)?Pe(Ue(/\\?\"/g,t),Dt):void 0},Z=function(t){for(var e in t)if(t.hasOwnProperty(e)){var i=t[e];typeof i==S.OBJECT&&i.length==2?this[i[0]]=i[1]:this[i]=void 0}return this},Ue=function(t,e){return Ce(e)?e.replace(t,ye):e},Pe=function(t,e){return t=Ue(/^\s\s*/,String(t)),typeof e===S.UNDEFINED?t:t.substring(0,e)},pt=function(t,e){if(!(!t||!e))for(var i=0,u,f,h,l,m,c;i<e.length&&!m;){var v=e[i],w=e[i+1];for(u=f=0;u<v.length&&!m&&v[u];)if(m=v[u++].exec(t),m)for(h=0;h<w.length;h++)c=m[++f],l=w[h],typeof l===S.OBJECT&&l.length>0?l.length===2?typeof l[1]==S.FUNCTION?this[l[0]]=l[1].call(this,c):this[l[0]]=l[1]:l.length>=3&&(typeof l[1]===S.FUNCTION&&!(l[1].exec&&l[1].test)?l.length>3?this[l[0]]=c?l[1].apply(this,l.slice(2)):void 0:this[l[0]]=c?l[1].call(this,c,l[2]):void 0:l.length==3?this[l[0]]=c?c.replace(l[1],l[2]):void 0:l.length==4?this[l[0]]=c?l[3].call(this,c.replace(l[1],l[2])):void 0:l.length>4&&(this[l[0]]=c?l[3].apply(this,[c.replace(l[1],l[2])].concat(l.slice(4))):void 0)):this[l]=c||void 0;i+=2}},Fi=function(t,e){return e.test.test(t)?e.ifTrue:e.ifFalse},F=function(t,e){for(var i in e)if(typeof e[i]===S.OBJECT&&e[i].length>0){for(var u=0;u<e[i].length;u++)if(ct(e[i][u],t))return i===_t?void 0:i}else if(ct(e[i],t))return i===_t?void 0:i;return e.hasOwnProperty("*")?e["*"]:t},Ot={ME:"4.90","NT 3.51":"3.51","NT 4.0":"4.0",2e3:["5.0","5.01"],XP:["5.1","5.2"],Vista:"6.0",7:"6.1",8:"6.2","8.1":"6.3",10:["6.4","10.0"],NT:""},$t={embedded:"Automotive",mobile:"Mobile",tablet:["Tablet","EInk"],smarttv:"TV",wearable:"Watch",xr:["VR","XR"],"?":["Desktop","Unknown"],"*":void 0},zi={Chrome:"Google Chrome",Edge:"Microsoft Edge","Edge WebView2":"Microsoft Edge WebView2","Chrome WebView":"Android WebView","Chrome Headless":"HeadlessChrome","Huawei Browser":"HuaweiBrowser","MIUI Browser":"Miui Browser","Opera Mobi":"OperaMobile",Yandex:"YaBrowser"},ji={browser:[[/\b(?:crmo|crios)\/([\w\.]+)/i],[r,[a,be+"Chrome"]],[/webview.+edge\/([\w\.]+)/i],[r,[a,Ye+" WebView"],[n,J]],[/edg(?:e|ios|a)?\/([\w\.]+)/i],[r,[a,"Edge"]],[/(opera mini)\/([-\w\.]+)/i,/(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,/(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i],[a,r],[/opios[\/ ]+([\w\.]+)/i],[r,[a,we+" Mini"]],[/\bop(?:rg)?x\/([\w\.]+)/i],[r,[a,we+" GX"]],[/\bopr\/([\w\.]+)/i],[r,[a,we]],[/\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i],[r,[a,"Baidu"]],[/\b(?:mxbrowser|mxios|myie2)\/?([-\w\.]*)\b/i],[r,[a,"Maxthon"]],[/(kindle)\/([\w\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer|sleipnir)[\/ ]?([\w\.]*)/i,/(avant|iemobile|slim(?:browser|boat|jet))[\/ ]?([\d\.]*)/i,/(?:ms|\()(ie) ([\w\.]+)/i,/(atlas|flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|qupzilla|falkon|rekonq|puffin|whale(?!.+naver)|qqbrowserlite|duckduckgo|klar|helio|(?=comodo_)?dragon|otter|dooble|(?:hi|lg |ovi|qute)browser|palemoon)\/v?([-\w\.]+)/i,/(brave)(?: chrome)?\/([\d\.]+)/i,/(aloha|heytap|ovi|115|surf|qwant)browser\/([\d\.]+)/i,/(qwant)(?:ios|mobile)\/([\d\.]+)/i,/(ecosia|weibo)(?:__| \w+@)([\d\.]+)/i],[a,r],[/quark(?:pc)?\/([-\w\.]+)/i],[r,[a,"Quark"]],[/\bddg\/([\w\.]+)/i],[r,[a,"DuckDuckGo"]],[/(?:\buc? ?browser|(?:juc.+)ucweb| ucpc)[\/ ]?([\w\.]+)/i],[r,[a,"UCBrowser"]],[/microm.+\bqbcore\/([\w\.]+)/i,/\bqbcore\/([\w\.]+).+microm/i,/micromessenger\/([\w\.]+)/i],[r,[a,"WeChat"]],[/konqueror\/([\w\.]+)/i],[r,[a,"Konqueror"]],[/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i],[r,[a,"IE"]],[/ya(?:search)?browser\/([\w\.]+)/i],[r,[a,"Yandex"]],[/slbrowser\/([\w\.]+)/i],[r,[a,"Smart "+tt+le]],[/(av(?:ast|g|ira))\/([\w\.]+)/i],[[a,/(.+)/,"$1 Secure"+le],r],[/norton\/([\w\.]+)/i],[r,[a,"Norton Private"+le]],[/\bfocus\/([\w\.]+)/i],[r,[a,Le+" Focus"]],[/ mms\/([\w\.]+)$/i],[r,[a,we+" Neon"]],[/ opt\/([\w\.]+)$/i],[r,[a,we+" Touch"]],[/coc_coc\w+\/([\w\.]+)/i],[r,[a,"Coc Coc"]],[/dolfin\/([\w\.]+)/i],[r,[a,"Dolphin"]],[/coast\/([\w\.]+)/i],[r,[a,we+" Coast"]],[/miuibrowser\/([\w\.]+)/i],[r,[a,"MIUI"+le]],[/fxios\/([\w\.-]+)/i],[r,[a,be+Le]],[/\bqihoobrowser\/?([\w\.]*)/i],[r,[a,"360"]],[/\b(qq)\/([\w\.]+)/i],[[a,/(.+)/,"$1Browser"],r],[/(oculus|sailfish|huawei|vivo|pico)browser\/([\w\.]+)/i],[[a,/(.+)/,"$1"+le],r],[/ HBPC\/([\w\.]+)/],[r,[a,et+le]],[/samsungbrowser\/([\w\.]+)/i],[r,[a,Oe+" Internet"]],[/metasr[\/ ]?([\d\.]+)/i],[r,[a,It+" Explorer"]],[/(sogou)mo\w+\/([\d\.]+)/i],[[a,It+" Mobile"],r],[/(electron)\/([\w\.]+) safari/i,/(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,/m?(qqbrowser|2345(?=browser|chrome|explorer))\w*[\/ ]?v?([\w\.]+)/i],[a,r],[/(lbbrowser|luakit|rekonq|steam(?= (clie|tenf|gameo)))/i],[a],[/ome\/([\w\.]+).+(iron(?= saf)|360(?=[es]e$))/i],[r,a],[/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i],[[a,st],r,[n,J]],[/(kakao(?:talk|story))[\/ ]([\w\.]+)/i,/(naver)\(.*?(\d+\.[\w\.]+).*\)/i,/(daum)apps[\/ ]([\w\.]+)/i,/safari (line)\/([\w\.]+)/i,/\b(line)\/([\w\.]+)\/iab/i,/(alipay)client\/([\w\.]+)/i,/(twitter)(?:and| f.+e\/([\w\.]+))/i,/(bing)(?:web|sapphire)\/([\w\.]+)/i,/(instagram|snapchat|klarna)[\/ ]([-\w\.]+)/i],[a,r,[n,J]],[/\bgsa\/([\w\.]+) .*safari\//i],[r,[a,"GSA"],[n,J]],[/(?:musical_ly|trill)(?:.+app_?version\/|_)([\w\.]+)/i],[r,[a,"TikTok"],[n,J]],[/\[(linkedin)app\]/i],[a,[n,J]],[/(zalo(?:app)?)[\/\sa-z]*([\w\.-]+)/i],[[a,/(.+)/,"Zalo"],r,[n,J]],[/(chromium)[\/ ]([-\w\.]+)/i],[a,r],[/ome-(lighthouse)$/i],[a,[n,$i]],[/headlesschrome(?:\/([\w\.]+)| )/i],[r,[a,St+" Headless"]],[/wv\).+chrome\/([\w\.]+).+edgw\//i],[r,[a,Ye+" WebView2"],[n,J]],[/; wv\).+(chrome)\/([\w\.]+)/i],[[a,St+" WebView"],r,[n,J]],[/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i],[r,[a,"Android"+le]],[/chrome\/([\w\.]+) mobile/i],[r,[a,be+"Chrome"]],[/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i],[a,r],[/version\/([\w\.\,]+) .*mobile(?:\/\w+ | ?)safari/i],[r,[a,be+"Safari"]],[/iphone .*mobile(?:\/\w+ | ?)safari/i],[[a,be+"Safari"]],[/version\/([\w\.\,]+) .*(safari)/i],[r,a],[/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i],[a,[r,"1"]],[/(webkit|khtml)\/([\w\.]+)/i],[a,r],[/(?:mobile|tablet);.*(firefox)\/([\w\.-]+)/i],[[a,be+Le],r],[/(navigator|netscape\d?)\/([-\w\.]+)/i],[[a,"Netscape"],r],[/(wolvic|librewolf)\/([\w\.]+)/i],[a,r],[/mobile vr; rv:([\w\.]+)\).+firefox/i],[r,[a,Le+" Reality"]],[/ekiohf.+(flow)\/([\w\.]+)/i,/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror)[\/ ]?([\w\.\+]+)/i,/(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|basilisk|waterfox)\/([-\w\.]+)$/i,/(firefox)\/([\w\.]+)/i,/(mozilla)\/([\w\.]+(?= .+rv\:.+gecko\/\d+)|[0-4][\w\.]+(?!.+compatible))/i,/(amaya|dillo|doris|icab|ladybird|lynx|mosaic|netsurf|obigo|polaris|w3m|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,/\b(links) \(([\w\.]+)/i],[a,[r,/_/g,"."]],[/(cobalt)\/([\w\.]+)/i],[a,[r,/[^\d\.]+./,ye]]],cpu:[[/\b((amd|x|x86[-_]?|wow|win)64)\b/i],[[A,"amd64"]],[/(ia32(?=;))/i,/\b((i[346]|x)86)(pc)?\b/i],[[A,"ia32"]],[/\b(aarch64|arm(v?[89]e?l?|_?64))\b/i],[[A,"arm64"]],[/\b(arm(v[67])?ht?n?[fl]p?)\b/i],[[A,"armhf"]],[/( (ce|mobile); ppc;|\/[\w\.]+arm\b)/i],[[A,"arm"]],[/ sun4\w[;\)]/i],[[A,"sparc"]],[/\b(avr32|ia64(?=;)|68k(?=\))|\barm(?=v([1-7]|[5-7]1)l?|;|eabi)|(irix|mips|sparc)(64)?\b|pa-risc)/i,/((ppc|powerpc)(64)?)( mac|;|\))/i,/(?:osf1|[freopnt]{3,4}bsd) (alpha)/i],[[A,/ower/,ye,ne]],[/mc680.0/i],[[A,"68k"]],[/winnt.+\[axp/i],[[A,"alpha"]]],device:[[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i],[o,[s,Oe],[n,y]],[/\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,/samsung[- ]((?!sm-[lr]|browser)[-\w]+)/i,/sec-(sgh\w+)/i],[o,[s,Oe],[n,p]],[/(?:\/|\()(ip(?:hone|od)[\w, ]*)[\/\);]/i],[o,[s,fe],[n,p]],[/\b(?:ios|apple\w+)\/.+[\(\/](ipad)/i,/\b(ipad)[\d,]*[;\] ].+(mac |i(pad)?)os/i],[o,[s,fe],[n,y]],[/(macintosh);/i],[o,[s,fe]],[/\b(sh-?[altvz]?\d\d[a-ekm]?)/i],[o,[s,Tt],[n,p]],[/\b((?:brt|eln|hey2?|gdi|jdn)-a?[lnw]09|(?:ag[rm]3?|jdn2|kob2)-a?[lw]0[09]hn)(?: bui|\)|;)/i],[o,[s,xt],[n,y]],[/honor([-\w ]+)[;\)]/i],[o,[s,xt],[n,p]],[/\b((?:ag[rs][2356]?k?|bah[234]?|bg[2o]|bt[kv]|cmr|cpn|db[ry]2?|jdn2|got|kob2?k?|mon|pce|scm|sht?|[tw]gr|vrd)-[ad]?[lw][0125][09]b?|605hw|bg2-u03|(?:gem|fdr|m2|ple|t1)-[7a]0[1-4][lu]|t1-a2[13][lw]|mediapad[\w\. ]*(?= bui|\)))\b(?!.+d\/s)/i],[o,[s,et],[n,y]],[/(?:huawei) ?([-\w ]+)[;\)]/i,/\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][\dc][adnt]?)\b(?!.+d\/s)/i],[o,[s,et],[n,p]],[/oid[^\)]+; (2[\dbc]{4}(182|283|rp\w{2})[cgl]|m2105k81a?c)(?: bui|\))/i,/\b(?:xiao)?((?:red)?mi[-_ ]?pad[\w- ]*)(?: bui|\))/i],[[o,/_/g," "],[s,at],[n,y]],[/\b; (\w+) build\/hm\1/i,/\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,/oid[^\)]+; (redmi[\-_ ]?(?:note|k)?[\w_ ]+|m?[12]\d[01]\d\w{3,6}|poco[\w ]+|(shark )?\w{3}-[ah]0|qin ?[1-3](s\+|ultra| pro)?)( bui|; wv|\))/i,/\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note|max|cc)?[_ ]?(?:\d{0,2}\w?)[_ ]?(?:plus|se|lite|pro)?( 5g|lte)?)(?: bui|\))/i,/; ([\w ]+) miui\/v?\d/i],[[o,/_/g," "],[s,at],[n,p]],[/droid.+; (cph2[3-6]\d[13579]|((gm|hd)19|(ac|be|in|kb)20|(d[en]|eb|le|mt)21|ne22)[0-2]\d|p[g-l]\w[1m]10)\b/i,/(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i],[o,[s,Et],[n,p]],[/; (\w+) bui.+ oppo/i,/\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i],[o,[s,ot],[n,p]],[/\b(opd2(\d{3}a?))(?: bui|\))/i],[o,[s,F,{OnePlus:["203","304","403","404","413","415"],"*":ot}],[n,y]],[/(vivo (5r?|6|8l?|go|one|s|x[il]?[2-4]?)[\w\+ ]*)(?: bui|\))/i],[o,[s,"BLU"],[n,p]],[/; vivo (\w+)(?: bui|\))/i,/\b(v[12]\d{3}\w?[at])(?: bui|;)/i],[o,[s,"Vivo"],[n,p]],[/\b(rmx[1-3]\d{3})(?: bui|;|\))/i],[o,[s,"Realme"],[n,p]],[/(ideatab[-\w ]+|602lv|d-42a|a101lv|a2109a|a3500-hv|s[56]000|pb-6505[my]|tb-?x?\d{3,4}(?:f[cu]|xu|[av])|yt\d?-[jx]?\d+[lfmx])( bui|;|\)|\/)/i,/lenovo ?(b[68]0[08]0-?[hf]?|tab(?:[\w- ]+?)|tb[\w-]{6,7})( bui|;|\)|\/)/i],[o,[s,tt],[n,y]],[/lenovo[-_ ]?([-\w ]+?)(?: bui|\)|\/)/i],[o,[s,tt],[n,p]],[/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,/\bmot(?:orola)?[- ]([\w\s]+)(\)| bui)/i,/((?:moto(?! 360)[-\w\(\) ]+|xt\d{3,4}[cgkosw\+]?[-\d]*|nexus 6)(?= bui|\)))/i],[o,[s,nt],[n,p]],[/\b(mz60\d|xoom[2 ]{0,2}) build\//i],[o,[s,nt],[n,y]],[/\b(?:lg)?([vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i],[o,[s,We],[n,y]],[/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,/\blg[-e;\/ ]+(?!.*(?:browser|netcast|android tv|watch|webos))(\w+)/i,/\blg-?([\d\w]+) bui/i],[o,[s,We],[n,p]],[/(nokia) (t[12][01])/i],[s,o,[n,y]],[/(?:maemo|nokia).*(n900|lumia \d+|rm-\d+)/i,/nokia[-_ ]?(([-\w\. ]*?))( bui|\)|;|\/)/i],[[o,/_/g," "],[n,p],[s,"Nokia"]],[/(pixel (c|tablet))\b/i],[o,[s,se],[n,y]],[/droid.+;(?: google)? (g(01[13]a|020[aem]|025[jn]|1b60|1f8f|2ybb|4s1m|576d|5nz6|8hhn|8vou|a02099|c15s|d1yq|e2ae|ec77|gh2x|kv4x|p4bc|pj41|r83y|tt9q|ur25|wvk6)|pixel[\d ]*a?( pro)?( xl)?( fold)?( \(5g\))?)( bui|\))/i],[o,[s,se],[n,p]],[/(google) (pixelbook( go)?)/i],[s,o],[/droid.+; (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-\w\w\d\d)(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i],[o,[s,$e],[n,p]],[/sony tablet [ps]/i,/\b(?:sony)?sgp\w+(?: bui|\))/i],[[o,"Xperia Tablet"],[s,$e],[n,y]],[/(alexa)webm/i,/(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,/(kf[a-z]+)( bui|\)).+silk\//i],[o,[s,Ge],[n,y]],[/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i],[[o,/(.+)/g,"Fire Phone $1"],[s,Ge],[n,p]],[/(playbook);[-\w\),; ]+(rim)/i],[o,s,[n,y]],[/\b((?:bb[a-f]|st[hv])100-\d)/i,/(?:blackberry|\(bb10;) (\w+)/i],[o,[s,kt],[n,p]],[/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i],[o,[s,yt],[n,y]],[/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i],[o,[s,yt],[n,p]],[/(nexus 9)/i],[o,[s,"HTC"],[n,y]],[/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,/(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,/(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i],[s,[o,/_/g," "],[n,p]],[/tcl (xess p17aa)/i,/droid [\w\.]+; ((?:8[14]9[16]|9(?:0(?:48|60|8[01])|1(?:3[27]|66)|2(?:6[69]|9[56])|466))[gqswx])(_\w(\w|\w\w))?(\)| bui)/i],[o,[s,"TCL"],[n,y]],[/droid [\w\.]+; (418(?:7d|8v)|5087z|5102l|61(?:02[dh]|25[adfh]|27[ai]|56[dh]|59k|65[ah])|a509dl|t(?:43(?:0w|1[adepqu])|50(?:6d|7[adju])|6(?:09dl|10k|12b|71[efho]|76[hjk])|7(?:66[ahju]|67[hw]|7[045][bh]|71[hk]|73o|76[ho]|79w|81[hks]?|82h|90[bhsy]|99b)|810[hs]))(_\w(\w|\w\w))?(\)| bui)/i],[o,[s,"TCL"],[n,p]],[/(itel) ((\w+))/i],[[s,ne],o,[n,F,{tablet:["p10001l","w7001"],"*":"mobile"}]],[/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i],[o,[s,"Acer"],[n,y]],[/droid.+; (m[1-5] note) bui/i,/\bmz-([-\w]{2,})/i],[o,[s,"Meizu"],[n,p]],[/; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i],[o,[s,"Ulefone"],[n,p]],[/; (energy ?\w+)(?: bui|\))/i,/; energizer ([\w ]+)(?: bui|\))/i],[o,[s,"Energizer"],[n,p]],[/; cat (b35);/i,/; (b15q?|s22 flip|s48c|s62 pro)(?: bui|\))/i],[o,[s,"Cat"],[n,p]],[/((?:new )?andromax[\w- ]+)(?: bui|\))/i],[o,[s,"Smartfren"],[n,p]],[/droid.+; (a(in)?(0(15|59|6[35])|142)p?)/i],[o,[s,"Nothing"],[n,p]],[/; (x67 5g|tikeasy \w+|ac[1789]\d\w+)( b|\))/i,/archos ?(5|gamepad2?|([\w ]*[t1789]|hello) ?\d+[\w ]*)( b|\))/i],[o,[s,"Archos"],[n,y]],[/archos ([\w ]+)( b|\))/i,/; (ac[3-6]\d\w{2,8})( b|\))/i],[o,[s,"Archos"],[n,p]],[/blackview ([-\w ]+)( b|\))/i,/; (bv\d{4}[-\w ]*)( b|\))/i],[o,[s,"Blackview"],[n,p]],[/; (n159v)/i],[o,[s,"HMD"],[n,p]],[/((revvl[ \w\+]+|tm(?:rv|af)\w*[45]g(?:tb)?))( b|\))/i],[o,[n,Fi,{test:/ta?b/i,ifTrue:y,ifFalse:p}],[s,"T-Mobile"]],[/(imo) (tab \w+)/i,/(infinix|tecno) (x1101b?|p904|dp(7c|8d|10a)( pro)?|p70[1-3]a?|p904|t1101)/i],[s,o,[n,y]],[/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus(?! zenw)|dell|jolla|meizu|motorola|polytron|tecno|micromax|advan)[-_ ]?([-\w]*)/i,/; (blu|coolpad|cubot|hmd|imo|infinix|lava|oneplus|tcl|wiko)[_ ]([-\w\+ ]+?)(?: bui|\)|; r)/i,/(hp) ([\w ]+\w)/i,/(microsoft); (lumia[\w ]+)/i,/(oppo) ?([\w ]+) bui/i,/(hisense) ([ehv][\w ]+)\)/i,/droid[^;]+; (philips)[_ ]([sv-x][\d]{3,4}[xz]?)/i],[s,o,[n,p]],[/(kobo)\s(ereader|touch)/i,/(hp).+(touchpad(?!.+tablet)|tablet)/i,/(kindle)\/([\w\.]+)/i],[s,o,[n,y]],[/(surface duo)/i],[o,[s,it],[n,y]],[/droid [\d\.]+; (fp\du?)(?: b|\))/i],[o,[s,"Fairphone"],[n,p]],[/((?:tegranote|shield t(?!.+d tv))[\w- ]*?)(?: b|\))/i],[o,[s,Ct],[n,y]],[/(sprint) (\w+)/i],[s,o,[n,p]],[/(kin\.[onetw]{3})/i],[[o,/\./g," "],[s,it],[n,p]],[/droid.+; ([c6]+|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i],[o,[s,rt],[n,y]],[/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i],[o,[s,rt],[n,p]],[/(philips)[\w ]+tv/i,/smart-tv.+(samsung)/i],[s,[n,M]],[/hbbtv.+maple;(\d+)/i],[[o,/^/,"SmartTV"],[s,Oe],[n,M]],[/(vizio)(?: |.+model\/)(\w+-\w+)/i,/tcast.+(lg)e?. ([-\w]+)/i],[s,o,[n,M]],[/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i],[[s,We],[n,M]],[/(apple) ?tv/i],[s,[o,fe+" TV"],[n,M]],[/crkey.*devicetype\/chromecast/i],[[o,ie+" Third Generation"],[s,se],[n,M]],[/crkey.*devicetype\/([^/]*)/i],[[o,/^/,"Chromecast "],[s,se],[n,M]],[/fuchsia.*crkey/i],[[o,ie+" Nest Hub"],[s,se],[n,M]],[/crkey/i],[[o,ie],[s,se],[n,M]],[/(portaltv)/i],[o,[s,st],[n,M]],[/droid.+aft(\w+)( bui|\))/i],[o,[s,Ge],[n,M]],[/(shield \w+ tv)/i],[o,[s,Ct],[n,M]],[/\(dtv[\);].+(aquos)/i,/(aquos-tv[\w ]+)\)/i],[o,[s,Tt],[n,M]],[/(bravia[\w ]+)( bui|\))/i],[o,[s,$e],[n,M]],[/(mi(tv|box)-?\w+) bui/i],[o,[s,at],[n,M]],[/Hbbtv.*(technisat) (.*);/i],[s,o,[n,M]],[/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,/hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i],[[s,/.+\/(\w+)/,"$1",F,{LG:"lge"}],[o,Pe],[n,M]],[/(playstation \w+)/i],[o,[s,$e],[n,Ke]],[/\b(xbox(?: one)?(?!; xbox))[\); ]/i],[o,[s,it],[n,Ke]],[/(ouya)/i,/(nintendo) (\w+)/i,/(retroid) (pocket ([^\)]+))/i,/(valve).+(steam deck)/i,/droid.+; ((shield|rgcube|gr0006))( bui|\))/i],[[s,F,{Nvidia:"Shield",Anbernic:"RGCUBE",Logitech:"GR0006"}],o,[n,Ke]],[/\b(sm-[lr]\d\d[0156][fnuw]?s?|gear live)\b/i],[o,[s,Oe],[n,W]],[/((pebble))app/i,/(asus|google|lg|oppo|xiaomi) ((pixel |zen)?watch[\w ]*)( bui|\))/i],[s,o,[n,W]],[/(ow(?:19|20)?we?[1-3]{1,3})/i],[o,[s,ot],[n,W]],[/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i],[o,[s,fe],[n,W]],[/(opwwe\d{3})/i],[o,[s,Et],[n,W]],[/(moto 360)/i],[o,[s,nt],[n,W]],[/(smartwatch 3)/i],[o,[s,$e],[n,W]],[/(g watch r)/i],[o,[s,We],[n,W]],[/droid.+; (wt63?0{2,3})\)/i],[o,[s,rt],[n,W]],[/droid.+; (glass) \d/i],[o,[s,se],[n,Ve]],[/(pico) ([\w ]+) os\d/i],[s,o,[n,Ve]],[/(quest( \d| pro)?s?).+vr/i],[o,[s,st],[n,Ve]],[/mobile vr; rv.+firefox/i],[[n,Ve]],[/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i],[s,[n,De]],[/(aeobc)\b/i],[o,[s,Ge],[n,De]],[/(homepod).+mac os/i],[o,[s,fe],[n,De]],[/windows iot/i],[[n,De]],[/droid.+; ([\w- ]+) (4k|android|smart|google)[- ]?tv/i],[o,[n,M]],[/\b((4k|android|smart|opera)[- ]?tv|tv; rv:|large screen[\w ]+safari)\b/i],[[n,M]],[/droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew|; hmsc).+?(mobile|vr|\d) safari/i],[o,[n,F,{mobile:"Mobile",xr:"VR","*":y}]],[/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i],[[n,y]],[/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i],[[n,p]],[/droid .+?; ([\w\. -]+)( bui|\))/i],[o,[s,"Generic"]]],engine:[[/windows.+ edge\/([\w\.]+)/i],[r,[a,Ye+"HTML"]],[/(arkweb)\/([\w\.]+)/i],[a,r],[/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],[r,[a,"Blink"]],[/(presto)\/([\w\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna|servo)\/([\w\.]+)/i,/ekioh(flow)\/([\w\.]+)/i,/(khtml|tasman|links|dillo)[\/ ]\(?([\w\.]+)/i,/(icab)[\/ ]([23]\.[\d\.]+)/i,/\b(libweb)/i],[a,r],[/ladybird\//i],[[a,"LibWeb"]],[/rv\:([\w\.]{1,9})\b.+(gecko)/i],[r,a]],os:[[/(windows nt) (6\.[23]); arm/i],[[a,/N/,"R"],[r,F,Ot]],[/(windows (?:phone|mobile|iot))(?: os)?[\/ ]?([\d\.]*( se)?)/i,/(windows)[\/ ](1[01]|2000|3\.1|7|8(\.1)?|9[58]|me|server 20\d\d( r2)?|vista|xp)/i],[a,r],[/windows nt ?([\d\.\)]*)(?!.+xbox)/i,/\bwin(?=3| ?9|n)(?:nt| 9x )?([\d\.;]*)/i],[[r,/(;|\))/g,"",F,Ot],[a,dt]],[/(windows ce)\/?([\d\.]*)/i],[a,r],[/[adehimnop]{4,7}\b(?:.*os ([\w]+) like mac|; opera)/i,/(?:ios;fbsv|ios(?=.+ip(?:ad|hone)|.+apple ?tv)|ip(?:ad|hone)(?: |.+i(?:pad)?)os|apple ?tv.+ios)[\/ ]([\w\.]+)/i,/\btvos ?([\w\.]+)/i,/cfnetwork\/.+darwin/i],[[r,/_/g,"."],[a,"iOS"]],[/(mac os x) ?([\w\. ]*)/i,/(macintosh|mac_powerpc\b)(?!.+(haiku|morphos))/i],[[a,"macOS"],[r,/_/g,"."]],[/android ([\d\.]+).*crkey/i],[r,[a,ie+" Android"]],[/fuchsia.*crkey\/([\d\.]+)/i],[r,[a,ie+" Fuchsia"]],[/crkey\/([\d\.]+).*devicetype\/smartspeaker/i],[r,[a,ie+" SmartSpeaker"]],[/linux.*crkey\/([\d\.]+)/i],[r,[a,ie+" Linux"]],[/crkey\/([\d\.]+)/i],[r,[a,ie]],[/droid ([\w\.]+)\b.+(android[- ]x86)/i],[r,a],[/(ubuntu) ([\w\.]+) like android/i],[[a,/(.+)/,"$1 Touch"],r],[/(harmonyos)[\/ ]?([\d\.]*)/i,/(android|bada|blackberry|kaios|maemo|meego|openharmony|qnx|rim tablet os|sailfish|series40|symbian|tizen)\w*[-\/\.; ]?([\d\.]*)/i],[a,r],[/\(bb(10);/i],[r,[a,kt]],[/(?:symbian ?os|symbos|s60(?=;)|series ?60)[-\/ ]?([\w\.]*)/i],[r,[a,"Symbian"]],[/mozilla\/[\d\.]+ \((?:mobile[;\w ]*|tablet|tv|[^\)]*(?:viera|lg(?:l25|-d300)|alcatel ?o.+|y300-f1)); rv:([\w\.]+)\).+gecko\//i],[r,[a,Le+" OS"]],[/\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i,/webos(?:[ \/]?|\.tv-20(?=2[2-9]))(\d[\d\.]*)/i],[r,[a,"webOS"]],[/web0s;.+?(?:chr[o0]me|safari)\/(\d+)/i],[[r,F,{25:"120",24:"108",23:"94",22:"87",6:"79",5:"68",4:"53",3:"38",2:"538",1:"537","*":"TV"}],[a,"webOS"]],[/watch(?: ?os[,\/ ]|\d,\d\/)([\d\.]+)/i],[r,[a,"watchOS"]],[/cros [\w]+(?:\)| ([\w\.]+)\b)/i],[r,[a,"Chrome OS"]],[/kepler ([\w\.]+); (aft|aeo)/i],[r,[a,"Vega OS"]],[/(netrange)mmh/i,/(nettv)\/(\d+\.[\w\.]+)/i,/(nintendo|playstation) (\w+)/i,/(xbox); +xbox ([^\);]+)/i,/(pico) .+os([\w\.]+)/i,/\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,/linux.+(mint)[\/\(\) ]?([\w\.]*)/i,/(mageia|vectorlinux|fuchsia|arcaos|arch(?= ?linux))[;l ]([\d\.]*)/i,/([kxln]?ubuntu|debian|suse|opensuse|gentoo|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire|knoppix)(?: gnu[\/ ]linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,/((?:open)?solaris)[-\/ ]?([\w\.]*)/i,/\b(aix)[; ]([1-9\.]{0,4})/i,/(hurd|linux|morphos)(?: (?:arm|x86|ppc)\w*| ?)([\w\.]*)/i,/(gnu) ?([\w\.]*)/i,/\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,/(haiku) ?(r\d)?/i],[a,r],[/(sunos) ?([\d\.]*)/i],[[a,"Solaris"],r],[/\b(beos|os\/2|amigaos|openvms|hp-ux|serenityos)/i,/(unix) ?([\w\.]*)/i],[a,r]]},Xe=(function(){var t={init:{},isIgnore:{},isIgnoreRgx:{},toString:{}};return Z.call(t.init,[[H,[a,r,Ne,n]],[Q,[A]],[K,[n,o,s]],[j,[a,r]],[D,[a,r]]]),Z.call(t.isIgnore,[[H,[r,Ne]],[j,[r]],[D,[r]]]),Z.call(t.isIgnoreRgx,[[H,/ ?browser$/i],[D,/ ?os$/i]]),Z.call(t.toString,[[H,[a,r]],[Q,[A]],[K,[s,o]],[j,[a,r]],[D,[a,r]]]),t})(),qi=function(t,e){var i=Xe.init[e],u=Xe.isIgnore[e]||0,f=Xe.isIgnoreRgx[e]||0,h=Xe.toString[e]||0;function l(){Z.call(this,i)}return l.prototype.getItem=function(){return t},l.prototype.withClientHints=function(){return de?de.getHighEntropyValues(Ut).then(function(m){return t.setCH(new Pt(m,!1)).parseCH().get()}):t.parseCH().get()},l.prototype.withFeatureCheck=function(){return t.detectFeature().get()},e!=ke&&(l.prototype.is=function(m){var c=!1;for(var v in this)if(this.hasOwnProperty(v)&&!ct(u,v)&&ne(f?Ue(f,this[v]):this[v])==ne(f?Ue(f,m):m)){if(c=!0,m!=S.UNDEFINED)break}else if(m==S.UNDEFINED&&c){c=!c;break}return c},l.prototype.toString=function(){var m=ye;for(var c in h)typeof this[h[c]]!==S.UNDEFINED&&(m+=(m?" ":ye)+this[h[c]]);return m||S.UNDEFINED}),l.prototype.then=function(m){var c=this,v=function(){for(var g in c)c.hasOwnProperty(g)&&(this[g]=c[g])};v.prototype={is:l.prototype.is,toString:l.prototype.toString,withClientHints:l.prototype.withClientHints,withFeatureCheck:l.prototype.withFeatureCheck};var w=new v;return m(w),w},new l};function Pt(t,e){if(t=t||{},Z.call(this,Ut),e)Z.call(this,[[ft,lt(t[ae])],[wt,lt(t[Li])],[p,/\?1/.test(t[Di])],[o,ge(t[Ni])],[xe,ge(t[Nt])],[bt,ge(t[Ui])],[A,ge(t[Ai])],[ue,lt(t[Hi])],[Ze,ge(t[Ri])]]);else for(var i in t)this.hasOwnProperty(i)&&typeof t[i]!==S.UNDEFINED&&(this[i]=t[i])}function oe(t,e,i,u){return Z.call(this,[["itemType",t],["ua",e],["uaCH",u],["rgxMap",i],["data",qi(this,t)]]),this}oe.prototype.get=function(t){return t?this.data.hasOwnProperty(t)?this.data[t]:void 0:this.data};oe.prototype.set=function(t,e){return this.data[t]=e,this};oe.prototype.setCH=function(t){return this.uaCH=t,this};oe.prototype.detectFeature=function(){if(R&&R.userAgent==this.ua)switch(this.itemType){case H:R.brave&&typeof R.brave.isBrave==S.FUNCTION&&this.set(a,"Brave");break;case K:!this.get(n)&&de&&de[p]&&this.set(n,p),this.get(o)=="Macintosh"&&R&&typeof R.standalone!==S.UNDEFINED&&R.maxTouchPoints&&R.maxTouchPoints>2&&this.set(o,"iPad").set(n,y);break;case D:!this.get(a)&&de&&de[xe]&&this.set(a,de[xe]);break;case ke:var t=this.data,e=function(i){return t[i].getItem().detectFeature().get()};this.set(H,e(H)).set(Q,e(Q)).set(K,e(K)).set(j,e(j)).set(D,e(D))}return this};oe.prototype.parseUA=function(){switch(this.itemType!=ke&&pt.call(this.data,this.ua,this.rgxMap),this.itemType){case H:this.set(Ne,mt(this.get(r)));break;case D:if(this.get(a)=="iOS"&&this.get(r)&&/^1[89][^\d]/.exec(this.get(r))){var t=/\) Version\/((\d+)[\d\.]*)/.exec(this.ua);t&&parseInt(t[2],10)>=26&&this.set(r,t[1])}break}return this};oe.prototype.parseCH=function(){var t=this.uaCH,e=this.rgxMap;switch(this.itemType){case H:case j:var i=t[wt]||t[ft],u;if(i)for(var f=0;f<i.length;f++){var h=i[f].brand||i[f],l=i[f].version;this.itemType==H&&!/not.a.brand/i.test(h)&&(!u||/Chrom/.test(u)&&h!=Mt||u==Ye&&/WebView2/.test(h))&&(h=F(h,zi),u=this.get(a),u&&!/Chrom/.test(u)&&/Chrom/.test(h)||this.set(a,h).set(r,l).set(Ne,mt(l)),u=h),this.itemType==j&&h==Mt&&this.set(r,l)}break;case Q:var m=t[A];m&&(m&&t[Ze]=="64"&&(m+="64"),pt.call(this.data,m+";",e));break;case K:if(t[p]&&this.set(n,p),t[o]&&(this.set(o,t[o]),!this.get(n)||!this.get(s))){var c={};pt.call(c,"droid 9; "+t[o]+")",e),!this.get(n)&&c.type&&this.set(n,c.type),!this.get(s)&&c.vendor&&this.set(s,c.vendor)}if(t[ue]){var v;if(typeof t[ue]!="string")for(var w=0;!v&&w<t[ue].length;)v=F(t[ue][w++],$t);else v=F(t[ue],$t);this.set(n,v)}break;case D:var g=t[xe];if(g){var I=t[bt];g==dt&&(I=parseInt(mt(I),10)>=13?"11":"10"),this.set(a,g).set(r,I)}this.get(a)==dt&&t[o]=="Xbox"&&this.set(a,"Xbox").set(r,void 0);break;case ke:var re=this.data,V=function(Ee){return re[Ee].getItem().setCH(t).parseCH().get()};this.set(H,V(H)).set(Q,V(Q)).set(K,V(K)).set(j,V(j)).set(D,V(D))}return this};function ee(t,e,i){if(typeof t===S.OBJECT?(Je(t,!0)?(typeof e===S.OBJECT&&(i=e),e=t):(i=t,e=void 0),t=void 0):typeof t===S.STRING&&!Je(e,!0)&&(i=e,e=void 0),i)if(typeof i.append===S.FUNCTION){var u={};i.forEach(function(w,g){u[String(g).toLowerCase()]=w}),i=u}else{var f={};for(var h in i)i.hasOwnProperty(h)&&(f[String(h).toLowerCase()]=i[h]);i=f}if(!(this instanceof ee))return new ee(t,e,i).getResult();var l=typeof t===S.STRING?t:i&&i[gt]?i[gt]:R&&R.userAgent?R.userAgent:ye,m=new Pt(i,!0),c=ji,v=function(w){return w==ke?function(){return new oe(w,l,c,m).set("ua",l).set(H,this.getBrowser()).set(Q,this.getCPU()).set(K,this.getDevice()).set(j,this.getEngine()).set(D,this.getOS()).get()}:function(){return new oe(w,l,c[w],m).parseUA().get()}};return Z.call(this,[["getBrowser",v(H)],["getCPU",v(Q)],["getDevice",v(K)],["getEngine",v(j)],["getOS",v(D)],["getResult",v(ke)],["getUA",function(){return l}],["setUA",function(w){return Ce(w)&&(l=Pe(w,Dt)),this}],["useExtension",function(w){return w&&(c=Bi(c,w)),this}]]).setUA(l).useExtension(e),this}ee.VERSION=Oi;ee.BROWSER=Qe([a,r,Ne,n]);ee.CPU=Qe([A]);ee.DEVICE=Qe([o,s,n,Ke,p,M,y,W,De]);ee.ENGINE=ee.OS=Qe([a,r]);function Vi(){return"_"+Math.random().toString(36).slice(2,11)}function Bt(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const Ae=new ee,G=(t,e="Inconnu")=>Bt(t||e),Gi={command:"system-info",description:"Affiche des informations sur le système de l'utilisateur.",run(){const t=Ae.getBrowser(),e=Ae.getCPU(),i=Ae.getDevice(),u=Ae.getEngine(),f=Ae.getOS();return`
.output/public/_nuxt/sqlite3-worker1-bundler-friendly-Bv6ABw9v.js:2:`)),!e)return null;nt=yt(e)}return nt.shift()},Oe={ttys:[],init(){},shutdown(){},register(e,t){Oe.ttys[e]={input:[],output:[],ops:t},a.registerDevice(e,Oe.stream_ops)},stream_ops:{open(e){var t=Oe.ttys[e.node.rdev];if(!t)throw new a.ErrnoError(43);e.tty=t,e.seekable=!1},close(e){e.tty.ops.fsync(e.tty)},fsync(e){e.tty.ops.fsync(e.tty)},read(e,t,n,r,s){if(!e.tty||!e.tty.ops.get_char)throw new a.ErrnoError(60);for(var o=0,p=0;p<r;p++){var g;try{g=e.tty.ops.get_char(e.tty)}catch{throw new a.ErrnoError(29)}if(g===void 0&&o===0)throw new a.ErrnoError(6);if(g==null)break;o++,t[n+p]=g}return o&&(e.node.timestamp=Date.now()),o},write(e,t,n,r,s){if(!e.tty||!e.tty.ops.put_char)throw new a.ErrnoError(60);try{for(var o=0;o<r;o++)e.tty.ops.put_char(e.tty,t[n+o])}catch{throw new a.ErrnoError(29)}return r&&(e.node.timestamp=Date.now()),o}},default_tty_ops:{get_char(e){return Vt()},put_char(e,t){t===null||t===10?(Xe(Le(e.output)),e.output=[]):t!=0&&e.output.push(t)},fsync(e){e.output&&e.output.length>0&&(Xe(Le(e.output)),e.output=[])},ioctl_tcgets(e){return{c_iflag:25856,c_oflag:5,c_cflag:191,c_lflag:35387,c_cc:[3,28,127,21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},ioctl_tcsets(e,t,n){return 0},ioctl_tiocgwinsz(e){return[24,80]}},default_tty1_ops:{put_char(e,t){t===null||t===10?(ke(Le(e.output)),e.output=[]):t!=0&&e.output.push(t)},fsync(e){e.output&&e.output.length>0&&(ke(Le(e.output)),e.output=[])}}},Gt=(e,t)=>{Pe.fill(0,e,e+t)},wt=(e,t)=>Math.ceil(e/t)*t,vt=e=>{e=wt(e,65536);var t=St(65536,e);return t&&Gt(t,e),t},ie={ops_table:null,mount(e){return ie.createNode(null,"/",16895,0)},createNode(e,t,n,r){if(a.isBlkdev(n)||a.isFIFO(n))throw new a.ErrnoError(63);ie.ops_table||={dir:{node:{getattr:ie.node_ops.getattr,setattr:ie.node_ops.setattr,lookup:ie.node_ops.lookup,mknod:ie.node_ops.mknod,rename:ie.node_ops.rename,unlink:ie.node_ops.unlink,rmdir:ie.node_ops.rmdir,readdir:ie.node_ops.readdir,symlink:ie.node_ops.symlink},stream:{llseek:ie.stream_ops.llseek}},file:{node:{getattr:ie.node_ops.getattr,setattr:ie.node_ops.setattr},stream:{llseek:ie.stream_ops.llseek,read:ie.stream_ops.read,write:ie.stream_ops.write,allocate:ie.stream_ops.allocate,mmap:ie.stream_ops.mmap,msync:ie.stream_ops.msync}},link:{node:{getattr:ie.node_ops.getattr,setattr:ie.node_ops.setattr,readlink:ie.node_ops.readlink},stream:{}},chrdev:{node:{getattr:ie.node_ops.getattr,setattr:ie.node_ops.setattr},stream:a.chrdev_stream_ops}};var s=a.createNode(e,t,n,r);return a.isDir(s.mode)?(s.node_ops=ie.ops_table.dir.node,s.stream_ops=ie.ops_table.dir.stream,s.contents={}):a.isFile(s.mode)?(s.node_ops=ie.ops_table.file.node,s.stream_ops=ie.ops_table.file.stream,s.usedBytes=0,s.contents=null):a.isLink(s.mode)?(s.node_ops=ie.ops_table.link.node,s.stream_ops=ie.ops_table.link.stream):a.isChrdev(s.mode)&&(s.node_ops=ie.ops_table.chrdev.node,s.stream_ops=ie.ops_table.chrdev.stream),s.timestamp=Date.now(),e&&(e.contents[t]=s,e.timestamp=s.timestamp),s},getFileDataAsTypedArray(e){return e.contents?e.contents.subarray?e.contents.subarray(0,e.usedBytes):new Uint8Array(e.contents):new Uint8Array(0)},expandFileStorage(e,t){var n=e.contents?e.contents.length:0;if(!(n>=t)){var r=1024*1024;t=Math.max(t,n*(n<r?2:1.125)>>>0),n!=0&&(t=Math.max(t,256));var s=e.contents;e.contents=new Uint8Array(t),e.usedBytes>0&&e.contents.set(s.subarray(0,e.usedBytes),0)}},resizeFileStorage(e,t){if(e.usedBytes!=t)if(t==0)e.contents=null,e.usedBytes=0;else{var n=e.contents;e.contents=new Uint8Array(t),n&&e.contents.set(n.subarray(0,Math.min(t,e.usedBytes))),e.usedBytes=t}},node_ops:{getattr(e){var t={};return t.dev=a.isChrdev(e.mode)?e.id:1,t.ino=e.id,t.mode=e.mode,t.nlink=1,t.uid=0,t.gid=0,t.rdev=e.rdev,a.isDir(e.mode)?t.size=4096:a.isFile(e.mode)?t.size=e.usedBytes:a.isLink(e.mode)?t.size=e.link.length:t.size=0,t.atime=new Date(e.timestamp),t.mtime=new Date(e.timestamp),t.ctime=new Date(e.timestamp),t.blksize=4096,t.blocks=Math.ceil(t.size/t.blksize),t},setattr(e,t){t.mode!==void 0&&(e.mode=t.mode),t.timestamp!==void 0&&(e.timestamp=t.timestamp),t.size!==void 0&&ie.resizeFileStorage(e,t.size)},lookup(e,t){throw a.genericErrors[44]},mknod(e,t,n,r){return ie.createNode(e,t,n,r)},rename(e,t,n){if(a.isDir(e.mode)){var r;try{r=a.lookupNode(t,n)}catch{}if(r)for(var s in r.contents)throw new a.ErrnoError(55)}delete e.parent.contents[e.name],e.parent.timestamp=Date.now(),e.name=n,t.contents[n]=e,t.timestamp=e.parent.timestamp},unlink(e,t){delete e.contents[t],e.timestamp=Date.now()},rmdir(e,t){var n=a.lookupNode(e,t);for(var r in n.contents)throw new a.ErrnoError(55);delete e.contents[t],e.timestamp=Date.now()},readdir(e){var t=[".",".."];for(var n of Object.keys(e.contents))t.push(n);return t},symlink(e,t,n){var r=ie.createNode(e,t,41471,0);return r.link=n,r},readlink(e){if(!a.isLink(e.mode))throw new a.ErrnoError(28);return e.link}},stream_ops:{read(e,t,n,r,s){var o=e.node.contents;if(s>=e.node.usedBytes)return 0;var p=Math.min(e.node.usedBytes-s,r);if(p>8&&o.subarray)t.set(o.subarray(s,s+p),n);else for(var g=0;g<p;g++)t[n+g]=o[s+g];return p},write(e,t,n,r,s,o){if(t.buffer===ge.buffer&&(o=!1),!r)return 0;var p=e.node;if(p.timestamp=Date.now(),t.subarray&&(!p.contents||p.contents.subarray)){if(o)return p.contents=t.subarray(n,n+r),p.usedBytes=r,r;if(p.usedBytes===0&&s===0)return p.contents=t.slice(n,n+r),p.usedBytes=r,r;if(s+r<=p.usedBytes)return p.contents.set(t.subarray(n,n+r),s),r}if(ie.expandFileStorage(p,s+r),p.contents.subarray&&t.subarray)p.contents.set(t.subarray(n,n+r),s);else for(var g=0;g<r;g++)p.contents[s+g]=t[n+g];return p.usedBytes=Math.max(p.usedBytes,s+r),r},llseek(e,t,n){var r=t;if(n===1?r+=e.position:n===2&&a.isFile(e.node.mode)&&(r+=e.node.usedBytes),r<0)throw new a.ErrnoError(28);return r},allocate(e,t,n){ie.expandFileStorage(e.node,t+n),e.node.usedBytes=Math.max(e.node.usedBytes,t+n)},mmap(e,t,n,r,s){if(!a.isFile(e.node.mode))throw new a.ErrnoError(43);var o,p,g=e.node.contents;if(!(s&2)&&g&&g.buffer===ge.buffer)p=!1,o=g.byteOffset;else{if(p=!0,o=vt(t),!o)throw new a.ErrnoError(48);g&&((n>0||n+t<g.length)&&(g.subarray?g=g.subarray(n,n+t):g=Array.prototype.slice.call(g,n,n+t)),ge.set(g,o))}return{ptr:o,allocated:p}},msync(e,t,n,r,s){return ie.stream_ops.write(e,t,0,r,n,!1),0}}},$t=(e,t,n,r)=>{var s=`al ${e}`;Je(e).then(o=>{t(new Uint8Array(o)),s&&We()},o=>{if(n)n();else throw`Loading data file "${e}" failed.`}),s&&Ye()},Kt=(e,t,n,r,s,o)=>{a.createDataFile(e,t,n,r,s,o)},Jt=i.preloadPlugins||[],Xt=(e,t,n,r)=>{typeof Browser<"u"&&Browser.init();var s=!1;return Jt.forEach(o=>{s||o.canHandle(t)&&(o.handle(e,t,n,r),s=!0)}),s},Yt=(e,t,n,r,s,o,p,g,O,R)=>{var z=t?Se.resolve(_e.join2(e,t)):e;function W(T){function A(D){R?.(),g||Kt(e,t,D,r,s,O),o?.(),We()}Xt(T,z,A,()=>{p?.(),We()})||A(T)}Ye(),typeof n=="string"?$t(n,W,p):W(n)},Zt=e=>{var t={r:0,"r+":2,w:577,"w+":578,a:1089,"a+":1090},n=t[e];if(typeof n>"u")throw new Error(`Unknown file open mode: ${e}`);return n},st=(e,t)=>{var n=0;return e&&(n|=365),t&&(n|=146),n},a={root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:!1,ignorePermissions:!0,ErrnoError:class{constructor(e){this.name="ErrnoError",this.errno=e}},genericErrors:{},filesystems:null,syncFSRequests:0,readFiles:{},FSStream:class{constructor(){this.shared={}}get object(){return this.node}set object(e){this.node=e}get isRead(){return(this.flags&2097155)!==1}get isWrite(){return(this.flags&2097155)!==0}get isAppend(){return this.flags&1024}get flags(){return this.shared.flags}set flags(e){this.shared.flags=e}get position(){return this.shared.position}set position(e){this.shared.position=e}},FSNode:class{constructor(e,t,n,r){e||(e=this),this.parent=e,this.mount=e.mount,this.mounted=null,this.id=a.nextInode++,this.name=t,this.mode=n,this.node_ops={},this.stream_ops={},this.rdev=r,this.readMode=365,this.writeMode=146}get read(){return(this.mode&this.readMode)===this.readMode}set read(e){e?this.mode|=this.readMode:this.mode&=~this.readMode}get write(){return(this.mode&this.writeMode)===this.writeMode}set write(e){e?this.mode|=this.writeMode:this.mode&=~this.writeMode}get isFolder(){return a.isDir(this.mode)}get isDevice(){return a.isChrdev(this.mode)}},lookupPath(e,t={}){if(e=Se.resolve(e),!e)return{path:"",node:null};var n={follow_mount:!0,recurse_count:0};if(t=Object.assign(n,t),t.recurse_count>8)throw new a.ErrnoError(32);for(var r=e.split("/").filter(W=>!!W),s=a.root,o="/",p=0;p<r.length;p++){var g=p===r.length-1;if(g&&t.parent)break;if(s=a.lookupNode(s,r[p]),o=_e.join2(o,r[p]),a.isMountpoint(s)&&(!g||g&&t.follow_mount)&&(s=s.mounted.root),!g||t.follow)for(var O=0;a.isLink(s.mode);){var R=a.readlink(o);o=Se.resolve(_e.dirname(o),R);var z=a.lookupPath(o,{recurse_count:t.recurse_count+1});if(s=z.node,O++>40)throw new a.ErrnoError(32)}}return{path:o,node:s}},getPath(e){for(var t;;){if(a.isRoot(e)){var n=e.mount.mountpoint;return t?n[n.length-1]!=="/"?`${n}/${t}`:n+t:n}t=t?`${e.name}/${t}`:e.name,e=e.parent}},hashName(e,t){for(var n=0,r=0;r<t.length;r++)n=(n<<5)-n+t.charCodeAt(r)|0;return(e+n>>>0)%a.nameTable.length},hashAddNode(e){var t=a.hashName(e.parent.id,e.name);e.name_next=a.nameTable[t],a.nameTable[t]=e},hashRemoveNode(e){var t=a.hashName(e.parent.id,e.name);if(a.nameTable[t]===e)a.nameTable[t]=e.name_next;else for(var n=a.nameTable[t];n;){if(n.name_next===e){n.name_next=e.name_next;break}n=n.name_next}},lookupNode(e,t){var n=a.mayLookup(e);if(n)throw new a.ErrnoError(n);for(var r=a.hashName(e.id,t),s=a.nameTable[r];s;s=s.name_next){var o=s.name;if(s.parent.id===e.id&&o===t)return s}return a.lookup(e,t)},createNode(e,t,n,r){var s=new a.FSNode(e,t,n,r);return a.hashAddNode(s),s},destroyNode(e){a.hashRemoveNode(e)},isRoot(e){return e===e.parent},isMountpoint(e){return!!e.mounted},isFile(e){return(e&61440)===32768},isDir(e){return(e&61440)===16384},isLink(e){return(e&61440)===40960},isChrdev(e){return(e&61440)===8192},isBlkdev(e){return(e&61440)===24576},isFIFO(e){return(e&61440)===4096},isSocket(e){return(e&49152)===49152},flagsToPermissionString(e){var t=["r","w","rw"][e&3];return e&512&&(t+="w"),t},nodePermissions(e,t){return a.ignorePermissions?0:t.includes("r")&&!(e.mode&292)||t.includes("w")&&!(e.mode&146)||t.includes("x")&&!(e.mode&73)?2:0},mayLookup(e){if(!a.isDir(e.mode))return 54;var t=a.nodePermissions(e,"x");return t||(e.node_ops.lookup?0:2)},mayCreate(e,t){try{var n=a.lookupNode(e,t);return 20}catch{}return a.nodePermissions(e,"wx")},mayDelete(e,t,n){var r;try{r=a.lookupNode(e,t)}catch(o){return o.errno}var s=a.nodePermissions(e,"wx");if(s)return s;if(n){if(!a.isDir(r.mode))return 54;if(a.isRoot(r)||a.getPath(r)===a.cwd())return 10}else if(a.isDir(r.mode))return 31;return 0},mayOpen(e,t){return e?a.isLink(e.mode)?32:a.isDir(e.mode)&&(a.flagsToPermissionString(t)!=="r"||t&512)?31:a.nodePermissions(e,a.flagsToPermissionString(t)):44},MAX_OPEN_FDS:4096,nextfd(){for(var e=0;e<=a.MAX_OPEN_FDS;e++)if(!a.streams[e])return e;throw new a.ErrnoError(33)},getStreamChecked(e){var t=a.getStream(e);if(!t)throw new a.ErrnoError(8);return t},getStream:e=>a.streams[e],createStream(e,t=-1){return e=Object.assign(new a.FSStream,e),t==-1&&(t=a.nextfd()),e.fd=t,a.streams[t]=e,e},closeStream(e){a.streams[e]=null},dupStream(e,t=-1){var n=a.createStream(e,t);return n.stream_ops?.dup?.(n),n},chrdev_stream_ops:{open(e){var t=a.getDevice(e.node.rdev);e.stream_ops=t.stream_ops,e.stream_ops.open?.(e)},llseek(){throw new a.ErrnoError(70)}},major:e=>e>>8,minor:e=>e&255,makedev:(e,t)=>e<<8|t,registerDevice(e,t){a.devices[e]={stream_ops:t}},getDevice:e=>a.devices[e],getMounts(e){for(var t=[],n=[e];n.length;){var r=n.pop();t.push(r),n.push(...r.mounts)}return t},syncfs(e,t){typeof e=="function"&&(t=e,e=!1),a.syncFSRequests++,a.syncFSRequests>1&&ke(`warning: ${a.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);var n=a.getMounts(a.root.mount),r=0;function s(p){return a.syncFSRequests--,t(p)}function o(p){if(p)return o.errored?void 0:(o.errored=!0,s(p));++r>=n.length&&s(null)}n.forEach(p=>{if(!p.type.syncfs)return o(null);p.type.syncfs(p,e,o)})},mount(e,t,n){var r=n==="/",s=!n,o;if(r&&a.root)throw new a.ErrnoError(10);if(!r&&!s){var p=a.lookupPath(n,{follow_mount:!1});if(n=p.path,o=p.node,a.isMountpoint(o))throw new a.ErrnoError(10);if(!a.isDir(o.mode))throw new a.ErrnoError(54)}var g={type:e,opts:t,mountpoint:n,mounts:[]},O=e.mount(g);return O.mount=g,g.root=O,r?a.root=O:o&&(o.mounted=g,o.mount&&o.mount.mounts.push(g)),O},unmount(e){var t=a.lookupPath(e,{follow_mount:!1});if(!a.isMountpoint(t.node))throw new a.ErrnoError(28);var n=t.node,r=n.mounted,s=a.getMounts(r);Object.keys(a.nameTable).forEach(p=>{for(var g=a.nameTable[p];g;){var O=g.name_next;s.includes(g.mount)&&a.destroyNode(g),g=O}}),n.mounted=null;var o=n.mount.mounts.indexOf(r);n.mount.mounts.splice(o,1)},lookup(e,t){return e.node_ops.lookup(e,t)},mknod(e,t,n){var r=a.lookupPath(e,{parent:!0}),s=r.node,o=_e.basename(e);if(!o||o==="."||o==="..")throw new a.ErrnoError(28);var p=a.mayCreate(s,o);if(p)throw new a.ErrnoError(p);if(!s.node_ops.mknod)throw new a.ErrnoError(63);return s.node_ops.mknod(s,o,t,n)},create(e,t){return t=t!==void 0?t:438,t&=4095,t|=32768,a.mknod(e,t,0)},mkdir(e,t){return t=t!==void 0?t:511,t&=1023,t|=16384,a.mknod(e,t,0)},mkdirTree(e,t){for(var n=e.split("/"),r="",s=0;s<n.length;++s)if(n[s]){r+="/"+n[s];try{a.mkdir(r,t)}catch(o){if(o.errno!=20)throw o}}},mkdev(e,t,n){return typeof n>"u"&&(n=t,t=438),t|=8192,a.mknod(e,t,n)},symlink(e,t){if(!Se.resolve(e))throw new a.ErrnoError(44);var n=a.lookupPath(t,{parent:!0}),r=n.node;if(!r)throw new a.ErrnoError(44);var s=_e.basename(t),o=a.mayCreate(r,s);if(o)throw new a.ErrnoError(o);if(!r.node_ops.symlink)throw new a.ErrnoError(63);return r.node_ops.symlink(r,s,e)},rename(e,t){var n=_e.dirname(e),r=_e.dirname(t),s=_e.basename(e),o=_e.basename(t),p,g,O;if(p=a.lookupPath(e,{parent:!0}),g=p.node,p=a.lookupPath(t,{parent:!0}),O=p.node,!g||!O)throw new a.ErrnoError(44);if(g.mount!==O.mount)throw new a.ErrnoError(75);var R=a.lookupNode(g,s),z=Se.relative(e,r);if(z.charAt(0)!==".")throw new a.ErrnoError(28);if(z=Se.relative(t,n),z.charAt(0)!==".")throw new a.ErrnoError(55);var W;try{W=a.lookupNode(O,o)}catch{}if(R!==W){var T=a.isDir(R.mode),A=a.mayDelete(g,s,T);if(A)throw new a.ErrnoError(A);if(A=W?a.mayDelete(O,o,T):a.mayCreate(O,o),A)throw new a.ErrnoError(A);if(!g.node_ops.rename)throw new a.ErrnoError(63);if(a.isMountpoint(R)||W&&a.isMountpoint(W))throw new a.ErrnoError(10);if(O!==g&&(A=a.nodePermissions(g,"w"),A))throw new a.ErrnoError(A);a.hashRemoveNode(R);try{g.node_ops.rename(R,O,o),R.parent=O}catch(D){throw D}finally{a.hashAddNode(R)}}},rmdir(e){var t=a.lookupPath(e,{parent:!0}),n=t.node,r=_e.basename(e),s=a.lookupNode(n,r),o=a.mayDelete(n,r,!0);if(o)throw new a.ErrnoError(o);if(!n.node_ops.rmdir)throw new a.ErrnoError(63);if(a.isMountpoint(s))throw new a.ErrnoError(10);n.node_ops.rmdir(n,r),a.destroyNode(s)},readdir(e){var t=a.lookupPath(e,{follow:!0}),n=t.node;if(!n.node_ops.readdir)throw new a.ErrnoError(54);return n.node_ops.readdir(n)},unlink(e){var t=a.lookupPath(e,{parent:!0}),n=t.node;if(!n)throw new a.ErrnoError(44);var r=_e.basename(e),s=a.lookupNode(n,r),o=a.mayDelete(n,r,!1);if(o)throw new a.ErrnoError(o);if(!n.node_ops.unlink)throw new a.ErrnoError(63);if(a.isMountpoint(s))throw new a.ErrnoError(10);n.node_ops.unlink(n,r),a.destroyNode(s)},readlink(e){var t=a.lookupPath(e),n=t.node;if(!n)throw new a.ErrnoError(44);if(!n.node_ops.readlink)throw new a.ErrnoError(28);return Se.resolve(a.getPath(n.parent),n.node_ops.readlink(n))},stat(e,t){var n=a.lookupPath(e,{follow:!t}),r=n.node;if(!r)throw new a.ErrnoError(44);if(!r.node_ops.getattr)throw new a.ErrnoError(63);return r.node_ops.getattr(r)},lstat(e){return a.stat(e,!0)},chmod(e,t,n){var r;if(typeof e=="string"){var s=a.lookupPath(e,{follow:!n});r=s.node}else r=e;if(!r.node_ops.setattr)throw new a.ErrnoError(63);r.node_ops.setattr(r,{mode:t&4095|r.mode&-4096,timestamp:Date.now()})},lchmod(e,t){a.chmod(e,t,!0)},fchmod(e,t){var n=a.getStreamChecked(e);a.chmod(n.node,t)},chown(e,t,n,r){var s;if(typeof e=="string"){var o=a.lookupPath(e,{follow:!r});s=o.node}else s=e;if(!s.node_ops.setattr)throw new a.ErrnoError(63);s.node_ops.setattr(s,{timestamp:Date.now()})},lchown(e,t,n){a.chown(e,t,n,!0)},fchown(e,t,n){var r=a.getStreamChecked(e);a.chown(r.node,t,n)},truncate(e,t){if(t<0)throw new a.ErrnoError(28);var n;if(typeof e=="string"){var r=a.lookupPath(e,{follow:!0});n=r.node}else n=e;if(!n.node_ops.setattr)throw new a.ErrnoError(63);if(a.isDir(n.mode))throw new a.ErrnoError(31);if(!a.isFile(n.mode))throw new a.ErrnoError(28);var s=a.nodePermissions(n,"w");if(s)throw new a.ErrnoError(s);n.node_ops.setattr(n,{size:t,timestamp:Date.now()})},ftruncate(e,t){var n=a.getStreamChecked(e);if((n.flags&2097155)===0)throw new a.ErrnoError(28);a.truncate(n.node,t)},utime(e,t,n){var r=a.lookupPath(e,{follow:!0}),s=r.node;s.node_ops.setattr(s,{timestamp:Math.max(t,n)})},open(e,t,n){if(e==="")throw new a.ErrnoError(44);t=typeof t=="string"?Zt(t):t,t&64?(n=typeof n>"u"?438:n,n=n&4095|32768):n=0;var r;if(typeof e=="object")r=e;else{e=_e.normalize(e);try{var s=a.lookupPath(e,{follow:!(t&131072)});r=s.node}catch{}}var o=!1;if(t&64)if(r){if(t&128)throw new a.ErrnoError(20)}else r=a.mknod(e,n,0),o=!0;if(!r)throw new a.ErrnoError(44);if(a.isChrdev(r.mode)&&(t&=-513),t&65536&&!a.isDir(r.mode))throw new a.ErrnoError(54);if(!o){var p=a.mayOpen(r,t);if(p)throw new a.ErrnoError(p)}t&512&&!o&&a.truncate(r,0),t&=-131713;var g=a.createStream({node:r,path:a.getPath(r),flags:t,seekable:!0,position:0,stream_ops:r.stream_ops,ungotten:[],error:!1});return g.stream_ops.open&&g.stream_ops.open(g),i.logReadFiles&&!(t&1)&&(e in a.readFiles||(a.readFiles[e]=1)),g},close(e){if(a.isClosed(e))throw new a.ErrnoError(8);e.getdents&&(e.getdents=null);try{e.stream_ops.close&&e.stream_ops.close(e)}catch(t){throw t}finally{a.closeStream(e.fd)}e.fd=null},isClosed(e){return e.fd===null},llseek(e,t,n){if(a.isClosed(e))throw new a.ErrnoError(8);if(!e.seekable||!e.stream_ops.llseek)throw new a.ErrnoError(70);if(n!=0&&n!=1&&n!=2)throw new a.ErrnoError(28);return e.position=e.stream_ops.llseek(e,t,n),e.ungotten=[],e.position},read(e,t,n,r,s){if(r<0||s<0)throw new a.ErrnoError(28);if(a.isClosed(e))throw new a.ErrnoError(8);if((e.flags&2097155)===1)throw new a.ErrnoError(8);if(a.isDir(e.node.mode))throw new a.ErrnoError(31);if(!e.stream_ops.read)throw new a.ErrnoError(28);var o=typeof s<"u";if(!o)s=e.position;else if(!e.seekable)throw new a.ErrnoError(70);var p=e.stream_ops.read(e,t,n,r,s);return o||(e.position+=p),p},write(e,t,n,r,s,o){if(r<0||s<0)throw new a.ErrnoError(28);if(a.isClosed(e))throw new a.ErrnoError(8);if((e.flags&2097155)===0)throw new a.ErrnoError(8);if(a.isDir(e.node.mode))throw new a.ErrnoError(31);if(!e.stream_ops.write)throw new a.ErrnoError(28);e.seekable&&e.flags&1024&&a.llseek(e,0,2);var p=typeof s<"u";if(!p)s=e.position;else if(!e.seekable)throw new a.ErrnoError(70);var g=e.stream_ops.write(e,t,n,r,s,o);return p||(e.position+=g),g},allocate(e,t,n){if(a.isClosed(e))throw new a.ErrnoError(8);if(t<0||n<=0)throw new a.ErrnoError(28);if((e.flags&2097155)===0)throw new a.ErrnoError(8);if(!a.isFile(e.node.mode)&&!a.isDir(e.node.mode))throw new a.ErrnoError(43);if(!e.stream_ops.allocate)throw new a.ErrnoError(138);e.stream_ops.allocate(e,t,n)},mmap(e,t,n,r,s){if((r&2)!==0&&(s&2)===0&&(e.flags&2097155)!==2)throw new a.ErrnoError(2);if((e.flags&2097155)===1)throw new a.ErrnoError(2);if(!e.stream_ops.mmap)throw new a.ErrnoError(43);if(!t)throw new a.ErrnoError(28);return e.stream_ops.mmap(e,t,n,r,s)},msync(e,t,n,r,s){return e.stream_ops.msync?e.stream_ops.msync(e,t,n,r,s):0},ioctl(e,t,n){if(!e.stream_ops.ioctl)throw new a.ErrnoError(59);return e.stream_ops.ioctl(e,t,n)},readFile(e,t={}){if(t.flags=t.flags||0,t.encoding=t.encoding||"binary",t.encoding!=="utf8"&&t.encoding!=="binary")throw new Error(`Invalid encoding type "${t.encoding}"`);var n,r=a.open(e,t.flags),s=a.stat(e),o=s.size,p=new Uint8Array(o);return a.read(r,p,0,o,0),t.encoding==="utf8"?n=Le(p):t.encoding==="binary"&&(n=p),a.close(r),n},writeFile(e,t,n={}){n.flags=n.flags||577;var r=a.open(e,n.flags,n.mode);if(typeof t=="string"){var s=new Uint8Array(He(t)+1),o=rt(t,s,0,s.length);a.write(r,s,0,o,void 0,n.canOwn)}else if(ArrayBuffer.isView(t))a.write(r,t,0,t.byteLength,void 0,n.canOwn);else throw new Error("Unsupported data type");a.close(r)},cwd:()=>a.currentPath,chdir(e){var t=a.lookupPath(e,{follow:!0});if(t.node===null)throw new a.ErrnoError(44);if(!a.isDir(t.node.mode))throw new a.ErrnoError(54);var n=a.nodePermissions(t.node,"x");if(n)throw new a.ErrnoError(n);a.currentPath=t.path},createDefaultDirectories(){a.mkdir("/tmp"),a.mkdir("/home"),a.mkdir("/home/web_user")},createDefaultDevices(){a.mkdir("/dev"),a.registerDevice(a.makedev(1,3),{read:()=>0,write:(r,s,o,p,g)=>p}),a.mkdev("/dev/null",a.makedev(1,3)),Oe.register(a.makedev(5,0),Oe.default_tty_ops),Oe.register(a.makedev(6,0),Oe.default_tty1_ops),a.mkdev("/dev/tty",a.makedev(5,0)),a.mkdev("/dev/tty1",a.makedev(6,0));var e=new Uint8Array(1024),t=0,n=()=>(t===0&&(t=qt(e).byteLength),e[--t]);a.createDevice("/dev","random",n),a.createDevice("/dev","urandom",n),a.mkdir("/dev/shm"),a.mkdir("/dev/shm/tmp")},createSpecialDirectories(){a.mkdir("/proc");var e=a.mkdir("/proc/self");a.mkdir("/proc/self/fd"),a.mount({mount(){var t=a.createNode(e,"fd",16895,73);return t.node_ops={lookup(n,r){var s=+r,o=a.getStreamChecked(s),p={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:()=>o.path}};return p.parent=p,p}},t}},{},"/proc/self/fd")},createStandardStreams(e,t,n){e?a.createDevice("/dev","stdin",e):a.symlink("/dev/tty","/dev/stdin"),t?a.createDevice("/dev","stdout",null,t):a.symlink("/dev/tty","/dev/stdout"),n?a.createDevice("/dev","stderr",null,n):a.symlink("/dev/tty1","/dev/stderr"),a.open("/dev/stdin",0),a.open("/dev/stdout",1),a.open("/dev/stderr",1)},staticInit(){[44].forEach(e=>{a.genericErrors[e]=new a.ErrnoError(e),a.genericErrors[e].stack="<generic error, no stack>"}),a.nameTable=new Array(4096),a.mount(ie,{},"/"),a.createDefaultDirectories(),a.createDefaultDevices(),a.createSpecialDirectories(),a.filesystems={MEMFS:ie}},init(e,t,n){a.initialized=!0,e??=i.stdin,t??=i.stdout,n??=i.stderr,a.createStandardStreams(e,t,n)},quit(){a.initialized=!1;for(var e=0;e<a.streams.length;e++){var t=a.streams[e];t&&a.close(t)}},findObject(e,t){var n=a.analyzePath(e,t);return n.exists?n.object:null},analyzePath(e,t){try{var n=a.lookupPath(e,{follow:!t});e=n.path}catch{}var r={isRoot:!1,exists:!1,error:0,name:null,path:null,object:null,parentExists:!1,parentPath:null,parentObject:null};try{var n=a.lookupPath(e,{parent:!0});r.parentExists=!0,r.parentPath=n.path,r.parentObject=n.node,r.name=_e.basename(e),n=a.lookupPath(e,{follow:!t}),r.exists=!0,r.path=n.path,r.object=n.node,r.name=n.node.name,r.isRoot=n.path==="/"}catch(s){r.error=s.errno}return r},createPath(e,t,n,r){e=typeof e=="string"?e:a.getPath(e);for(var s=t.split("/").reverse();s.length;){var o=s.pop();if(o){var p=_e.join2(e,o);try{a.mkdir(p)}catch{}e=p}}return p},createFile(e,t,n,r,s){var o=_e.join2(typeof e=="string"?e:a.getPath(e),t),p=st(r,s);return a.create(o,p)},createDataFile(e,t,n,r,s,o){var p=t;e&&(e=typeof e=="string"?e:a.getPath(e),p=t?_e.join2(e,t):e);var g=st(r,s),O=a.create(p,g);if(n){if(typeof n=="string"){for(var R=new Array(n.length),z=0,W=n.length;z<W;++z)R[z]=n.charCodeAt(z);n=R}a.chmod(O,g|146);var T=a.open(O,577);a.write(T,n,0,n.length,0,o),a.close(T),a.chmod(O,g)}},createDevice(e,t,n,r){var s=_e.join2(typeof e=="string"?e:a.getPath(e),t),o=st(!!n,!!r);a.createDevice.major??=64;var p=a.makedev(a.createDevice.major++,0);return a.registerDevice(p,{open(g){g.seekable=!1},close(g){r?.buffer?.length&&r(10)},read(g,O,R,z,W){for(var T=0,A=0;A<z;A++){var D;try{D=n()}catch{throw new a.ErrnoError(29)}if(D===void 0&&T===0)throw new a.ErrnoError(6);if(D==null)break;T++,O[R+A]=D}return T&&(g.node.timestamp=Date.now()),T},write(g,O,R,z,W){for(var T=0;T<z;T++)try{r(O[R+T])}catch{throw new a.ErrnoError(29)}return z&&(g.node.timestamp=Date.now()),T}}),a.mkdev(s,o,p)},forceLoadFile(e){if(e.isDevice||e.isFolder||e.link||e.contents)return!0;if(typeof XMLHttpRequest<"u")throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");try{e.contents=ze(e.url),e.usedBytes=e.contents.length}catch{throw new a.ErrnoError(29)}},createLazyFile(e,t,n,r,s){class o{constructor(){this.lengthKnown=!1,this.chunks=[]}get(A){if(!(A>this.length-1||A<0)){var D=A%this.chunkSize,q=A/this.chunkSize|0;return this.getter(q)[D]}}setDataGetter(A){this.getter=A}cacheLength(){var A=new XMLHttpRequest;if(A.open("HEAD",n,!1),A.send(null),!(A.status>=200&&A.status<300||A.status===304))throw new Error("Couldn't load "+n+". Status: "+A.status);var D=Number(A.getResponseHeader("Content-length")),q,w=(q=A.getResponseHeader("Accept-Ranges"))&&q==="bytes",x=(q=A.getResponseHeader("Content-Encoding"))&&q==="gzip",N=1024*1024;w||(N=D);var P=(L,$)=>{if(L>$)throw new Error("invalid range ("+L+", "+$+") or no bytes requested!");if($>D-1)throw new Error("only "+D+" bytes available! programmer error!");var c=new XMLHttpRequest;if(c.open("GET",n,!1),D!==N&&c.setRequestHeader("Range","bytes="+L+"-"+$),c.responseType="arraybuffer",c.overrideMimeType&&c.overrideMimeType("text/plain; charset=x-user-defined"),c.send(null),!(c.status>=200&&c.status<300||c.status===304))throw new Error("Couldn't load "+n+". Status: "+c.status);return c.response!==void 0?new Uint8Array(c.response||[]):yt(c.responseText||"")},S=this;S.setDataGetter(L=>{var $=L*N,c=(L+1)*N-1;if(c=Math.min(c,D-1),typeof S.chunks[L]>"u"&&(S.chunks[L]=P($,c)),typeof S.chunks[L]>"u")throw new Error("doXHR failed!");return S.chunks[L]}),(x||!D)&&(N=D=1,D=this.getter(0).length,N=D,Xe("LazyFiles on gzip forces download of the whole file when length is accessed")),this._length=D,this._chunkSize=N,this.lengthKnown=!0}get length(){return this.lengthKnown||this.cacheLength(),this._length}get chunkSize(){return this.lengthKnown||this.cacheLength(),this._chunkSize}}if(typeof XMLHttpRequest<"u"){if(!Ue)throw"Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";var p=new o,g={isDevice:!1,contents:p}}else var g={isDevice:!1,url:n};var O=a.createFile(e,t,g,r,s);g.contents?O.contents=g.contents:g.url&&(O.contents=null,O.url=g.url),Object.defineProperties(O,{usedBytes:{get:function(){return this.contents.length}}});var R={},z=Object.keys(O.stream_ops);z.forEach(T=>{var A=O.stream_ops[T];R[T]=(...D)=>(a.forceLoadFile(O),A(...D))});function W(T,A,D,q,w){var x=T.node.contents;if(w>=x.length)return 0;var N=Math.min(x.length-w,q);if(x.slice)for(var P=0;P<N;P++)A[D+P]=x[w+P];else for(var P=0;P<N;P++)A[D+P]=x.get(w+P);return N}return R.read=(T,A,D,q,w)=>(a.forceLoadFile(O),W(T,A,D,q,w)),R.mmap=(T,A,D,q,w)=>{a.forceLoadFile(O);var x=vt(A);if(!x)throw new a.ErrnoError(48);return W(T,ge,x,A,D),{ptr:x,allocated:!0}},O.stream_ops=R,O}},en=(e,t)=>e?Le(Pe,e,t):"",le={DEFAULT_POLLMASK:5,calculateAt(e,t,n){if(_e.isAbs(t))return t;var r;if(e===-100)r=a.cwd();else{var s=le.getStreamFromFD(e);r=s.path}if(t.length==0){if(!n)throw new a.ErrnoError(44);return r}return _e.join2(r,t)},doStat(e,t,n){var r=e(t);ce[n>>2]=r.dev,ce[n+4>>2]=r.mode,he[n+8>>2]=r.nlink,ce[n+12>>2]=r.uid,ce[n+16>>2]=r.gid,ce[n+20>>2]=r.rdev,xe[n+24>>3]=BigInt(r.size),ce[n+32>>2]=4096,ce[n+36>>2]=r.blocks;var s=r.atime.getTime(),o=r.mtime.getTime(),p=r.ctime.getTime();return xe[n+40>>3]=BigInt(Math.floor(s/1e3)),he[n+48>>2]=s%1e3*1e3*1e3,xe[n+56>>3]=BigInt(Math.floor(o/1e3)),he[n+64>>2]=o%1e3*1e3*1e3,xe[n+72>>3]=BigInt(Math.floor(p/1e3)),he[n+80>>2]=p%1e3*1e3*1e3,xe[n+88>>3]=BigInt(r.ino),0},doMsync(e,t,n,r,s){if(!a.isFile(t.node.mode))throw new a.ErrnoError(43);if(r&2)return 0;var o=Pe.slice(e,e+n);a.msync(t,o,s,n,r)},getStreamFromFD(e){var t=a.getStreamChecked(e);return t},varargs:void 0,getStr(e){var t=en(e);return t}};function tn(e,t){try{return e=le.getStr(e),a.chmod(e,t),0}catch(n){if(typeof a>"u"||n.name!=="ErrnoError")throw n;return-n.errno}}function nn(e,t,n,r){try{if(t=le.getStr(t),t=le.calculateAt(e,t),n&-8)return-28;var s=a.lookupPath(t,{follow:!0}),o=s.node;if(!o)return-44;var p="";return n&4&&(p+="r"),n&2&&(p+="w"),n&1&&(p+="x"),p&&a.nodePermissions(o,p)?-2:0}catch(g){if(typeof a>"u"||g.name!=="ErrnoError")throw g;return-g.errno}}function rn(e,t){try{return a.fchmod(e,t),0}catch(n){if(typeof a>"u"||n.name!=="ErrnoError")throw n;return-n.errno}}function sn(e,t,n){try{return a.fchown(e,t,n),0}catch(r){if(typeof a>"u"||r.name!=="ErrnoError")throw r;return-r.errno}}function Ve(){var e=ce[+le.varargs>>2];return le.varargs+=4,e}var Ce=Ve;function on(e,t,n){le.varargs=n;try{var r=le.getStreamFromFD(e);switch(t){case 0:{var s=Ve();if(s<0)return-28;for(;a.streams[s];)s++;var o;return o=a.dupStream(r,s),o.fd}case 1:case 2:return 0;case 3:return r.flags;case 4:{var s=Ve();return r.flags|=s,0}case 12:{var s=Ce(),p=0;return Ne[s+p>>1]=2,0}case 13:case 14:return 0}return-28}catch(g){if(typeof a>"u"||g.name!=="ErrnoError")throw g;return-g.errno}}function ln(e,t){try{var n=le.getStreamFromFD(e);return le.doStat(a.stat,n.path,t)}catch(r){if(typeof a>"u"||r.name!=="ErrnoError")throw r;return-r.errno}}var an=9007199254740992,cn=-9007199254740992,je=e=>e<cn||e>an?NaN:Number(e);function _n(e,t){t=je(t);try{return isNaN(t)?61:(a.ftruncate(e,t),0)}catch(n){if(typeof a>"u"||n.name!=="ErrnoError")throw n;return-n.errno}}var De=(e,t,n)=>rt(e,Pe,t,n);function un(e,t){try{if(t===0)return-28;var n=a.cwd(),r=He(n)+1;return t<r?-68:(De(n,e,t),r)}catch(s){if(typeof a>"u"||s.name!=="ErrnoError")throw s;return-s.errno}}function fn(e,t,n){le.varargs=n;try{var r=le.getStreamFromFD(e);switch(t){case 21509:return r.tty?0:-59;case 21505:{if(!r.tty)return-59;if(r.tty.ops.ioctl_tcgets){var s=r.tty.ops.ioctl_tcgets(r),o=Ce();ce[o>>2]=s.c_iflag||0,ce[o+4>>2]=s.c_oflag||0,ce[o+8>>2]=s.c_cflag||0,ce[o+12>>2]=s.c_lflag||0;for(var p=0;p<32;p++)ge[o+p+17]=s.c_cc[p]||0;return 0}return 0}case 21510:case 21511:case 21512:return r.tty?0:-59;case 21506:case 21507:case 21508:{if(!r.tty)return-59;if(r.tty.ops.ioctl_tcsets){for(var o=Ce(),g=ce[o>>2],O=ce[o+4>>2],R=ce[o+8>>2],z=ce[o+12>>2],W=[],p=0;p<32;p++)W.push(ge[o+p+17]);return r.tty.ops.ioctl_tcsets(r.tty,t,{c_iflag:g,c_oflag:O,c_cflag:R,c_lflag:z,c_cc:W})}return 0}case 21519:{if(!r.tty)return-59;var o=Ce();return ce[o>>2]=0,0}case 21520:return r.tty?-28:-59;case 21531:{var o=Ce();return a.ioctl(r,t,o)}case 21523:{if(!r.tty)return-59;if(r.tty.ops.ioctl_tiocgwinsz){var T=r.tty.ops.ioctl_tiocgwinsz(r.tty),o=Ce();Ne[o>>1]=T[0],Ne[o+2>>1]=T[1]}return 0}case 21524:return r.tty?0:-59;case 21515:return r.tty?0:-59;default:return-28}}catch(A){if(typeof a>"u"||A.name!=="ErrnoError")throw A;return-A.errno}}function dn(e,t){try{return e=le.getStr(e),le.doStat(a.lstat,e,t)}catch(n){if(typeof a>"u"||n.name!=="ErrnoError")throw n;return-n.errno}}function pn(e,t,n){try{return t=le.getStr(t),t=le.calculateAt(e,t),t=_e.normalize(t),t[t.length-1]==="/"&&(t=t.substr(0,t.length-1)),a.mkdir(t,n,0),0}catch(r){if(typeof a>"u"||r.name!=="ErrnoError")throw r;return-r.errno}}function hn(e,t,n,r){try{t=le.getStr(t);var s=r&256,o=r&4096;return r=r&-6401,t=le.calculateAt(e,t,o),le.doStat(s?a.lstat:a.stat,t,n)}catch(p){if(typeof a>"u"||p.name!=="ErrnoError")throw p;return-p.errno}}function mn(e,t,n,r){le.varargs=r;try{t=le.getStr(t),t=le.calculateAt(e,t);var s=r?Ve():0;return a.open(t,n,s).fd}catch(o){if(typeof a>"u"||o.name!=="ErrnoError")throw o;return-o.errno}}function gn(e,t,n,r){try{if(t=le.getStr(t),t=le.calculateAt(e,t),r<=0)return-28;var s=a.readlink(t),o=Math.min(r,He(s)),p=ge[n+o];return De(s,n,r+1),ge[n+o]=p,o}catch(g){if(typeof a>"u"||g.name!=="ErrnoError")throw g;return-g.errno}}function qn(e){try{return e=le.getStr(e),a.rmdir(e),0}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return-t.errno}}function bn(e,t){try{return e=le.getStr(e),le.doStat(a.stat,e,t)}catch(n){if(typeof a>"u"||n.name!=="ErrnoError")throw n;return-n.errno}}function yn(e,t,n){try{return t=le.getStr(t),t=le.calculateAt(e,t),n===0?a.unlink(t):n===512?a.rmdir(t):Ze("Invalid flags passed to unlinkat"),0}catch(r){if(typeof a>"u"||r.name!=="ErrnoError")throw r;return-r.errno}}var Et=e=>he[e>>2]+ce[e+4>>2]*4294967296;function wn(e,t,n,r){try{t=le.getStr(t),t=le.calculateAt(e,t,!0);var s=Date.now(),o,p;if(!n)o=s,p=s;else{var g=Et(n),O=ce[n+8>>2];O==1073741823?o=s:O==1073741822?o=-1:o=g*1e3+O/1e6,n+=16,g=Et(n),O=ce[n+8>>2],O==1073741823?p=s:O==1073741822?p=-1:p=g*1e3+O/1e6}return(p!=-1||o!=-1)&&a.utime(t,o,p),0}catch(R){if(typeof a>"u"||R.name!=="ErrnoError")throw R;return-R.errno}}var vn=1,En=()=>vn,xn=e=>e%4===0&&(e%100!==0||e%400===0),Sn=[0,31,60,91,121,152,182,213,244,274,305,335],An=[0,31,59,90,120,151,181,212,243,273,304,334],In=e=>{var t=xn(e.getFullYear()),n=t?Sn:An,r=n[e.getMonth()]+e.getDate()-1;return r};function kn(e,t){e=je(e);var n=new Date(e*1e3);ce[t>>2]=n.getSeconds(),ce[t+4>>2]=n.getMinutes(),ce[t+8>>2]=n.getHours(),ce[t+12>>2]=n.getDate(),ce[t+16>>2]=n.getMonth(),ce[t+20>>2]=n.getFullYear()-1900,ce[t+24>>2]=n.getDay();var r=In(n)|0;ce[t+28>>2]=r,ce[t+36>>2]=-(n.getTimezoneOffset()*60);var s=new Date(n.getFullYear(),0,1),o=new Date(n.getFullYear(),6,1).getTimezoneOffset(),p=s.getTimezoneOffset(),g=(o!=p&&n.getTimezoneOffset()==Math.min(p,o))|0;ce[t+32>>2]=g}function Tn(e,t,n,r,s,o,p){s=je(s);try{if(isNaN(s))return 61;var g=le.getStreamFromFD(r),O=a.mmap(g,e,s,t,n),R=O.ptr;return ce[o>>2]=O.allocated,he[p>>2]=R,0}catch(z){if(typeof a>"u"||z.name!=="ErrnoError")throw z;return-z.errno}}function Fn(e,t,n,r,s,o){o=je(o);try{var p=le.getStreamFromFD(s);n&2&&le.doMsync(e,p,t,r,o)}catch(g){if(typeof a>"u"||g.name!=="ErrnoError")throw g;return-g.errno}}var On=(e,t,n,r)=>{var s=new Date().getFullYear(),o=new Date(s,0,1),p=new Date(s,6,1),g=o.getTimezoneOffset(),O=p.getTimezoneOffset(),R=Math.max(g,O);he[e>>2]=R*60,ce[t>>2]=+(g!=O);var z=A=>{var D=A>=0?"-":"+",q=Math.abs(A),w=String(Math.floor(q/60)).padStart(2,"0"),x=String(q%60).padStart(2,"0");return`UTC${D}${w}${x}`},W=z(g),T=z(O);O<g?(De(W,n,17),De(T,r,17)):(De(W,r,17),De(T,n,17))},Pn=()=>Date.now(),Ln=()=>performance.now(),Cn=()=>2147483648,Dn=e=>{var t=Te.buffer,n=(e-t.byteLength+65535)/65536|0;try{return Te.grow(n),ut(),1}catch{}},Rn=e=>{var t=Pe.length;e>>>=0;var n=Cn();if(e>n)return!1;for(var r=1;r<=4;r*=2){var s=t*(1+.2/r);s=Math.min(s,e+100663296);var o=Math.min(n,wt(Math.max(e,s),65536)),p=Dn(o);if(p)return!0}return!1},it={},Nn=()=>ct||"./this.program",Be=()=>{if(!Be.strings){var e=(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",t={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:e,_:Nn()};for(var n in it)it[n]===void 0?delete t[n]:t[n]=it[n];var r=[];for(var n in t)r.push(`${n}=${t[n]}`);Be.strings=r}return Be.strings},Mn=(e,t)=>{for(var n=0;n<e.length;++n)ge[t++]=e.charCodeAt(n);ge[t]=0},jn=(e,t)=>{var n=0;return Be().forEach((r,s)=>{var o=t+n;he[e+s*4>>2]=o,Mn(r,o),n+=r.length+1}),0},Bn=(e,t)=>{var n=Be();he[e>>2]=n.length;var r=0;return n.forEach(s=>r+=s.length+1),he[t>>2]=r,0};function Un(e){try{var t=le.getStreamFromFD(e);return a.close(t),0}catch(n){if(typeof a>"u"||n.name!=="ErrnoError")throw n;return n.errno}}function zn(e,t){try{var n=0,r=0,s=0,o=le.getStreamFromFD(e),p=o.tty?2:a.isDir(o.mode)?3:a.isLink(o.mode)?7:4;return ge[t]=p,Ne[t+2>>1]=s,xe[t+8>>3]=BigInt(n),xe[t+16>>3]=BigInt(r),0}catch(g){if(typeof a>"u"||g.name!=="ErrnoError")throw g;return g.errno}}var Qn=(e,t,n,r)=>{for(var s=0,o=0;o<n;o++){var p=he[t>>2],g=he[t+4>>2];t+=8;var O=a.read(e,ge,p,g,r);if(O<0)return-1;if(s+=O,O<g)break}return s};function Wn(e,t,n,r){try{var s=le.getStreamFromFD(e),o=Qn(s,t,n);return he[r>>2]=o,0}catch(p){if(typeof a>"u"||p.name!=="ErrnoError")throw p;return p.errno}}function Hn(e,t,n,r){t=je(t);try{if(isNaN(t))return 61;var s=le.getStreamFromFD(e);return a.llseek(s,t,n),xe[r>>3]=BigInt(s.position),s.getdents&&t===0&&n===0&&(s.getdents=null),0}catch(o){if(typeof a>"u"||o.name!=="ErrnoError")throw o;return o.errno}}function Vn(e){try{var t=le.getStreamFromFD(e);return t.stream_ops?.fsync?t.stream_ops.fsync(t):0}catch(n){if(typeof a>"u"||n.name!=="ErrnoError")throw n;return n.errno}}var Gn=(e,t,n,r)=>{for(var s=0,o=0;o<n;o++){var p=he[t>>2],g=he[t+4>>2];t+=8;var O=a.write(e,ge,p,g,r);if(O<0)return-1;if(s+=O,O<g)break}return s};function $n(e,t,n,r){try{var s=le.getStreamFromFD(e),o=Gn(s,t,n);return he[r>>2]=o,0}catch(p){if(typeof a>"u"||p.name!=="ErrnoError")throw p;return p.errno}}a.createPreloadedFile=Yt,a.staticInit();var xt={__syscall_chmod:tn,__syscall_faccessat:nn,__syscall_fchmod:rn,__syscall_fchown32:sn,__syscall_fcntl64:on,__syscall_fstat64:ln,__syscall_ftruncate64:_n,__syscall_getcwd:un,__syscall_ioctl:fn,__syscall_lstat64:dn,__syscall_mkdirat:pn,__syscall_newfstatat:hn,__syscall_openat:mn,__syscall_readlinkat:gn,__syscall_rmdir:qn,__syscall_stat64:bn,__syscall_unlinkat:yn,__syscall_utimensat:wn,_emscripten_get_now_is_monotonic:En,_localtime_js:kn,_mmap_js:Tn,_munmap_js:Fn,_tzset_js:On,emscripten_date_now:Pn,emscripten_get_now:Ln,emscripten_resize_heap:Rn,environ_get:jn,environ_sizes_get:Bn,fd_close:Un,fd_fdstat_get:zn,fd_read:Wn,fd_seek:Hn,fd_sync:Vn,fd_write:$n,memory:Te},h=Wt();i._sqlite3_status64=(e,t,n,r)=>(i._sqlite3_status64=h.sqlite3_status64)(e,t,n,r),i._sqlite3_status=(e,t,n,r)=>(i._sqlite3_status=h.sqlite3_status)(e,t,n,r),i._sqlite3_db_status=(e,t,n,r,s)=>(i._sqlite3_db_status=h.sqlite3_db_status)(e,t,n,r,s),i._sqlite3_msize=e=>(i._sqlite3_msize=h.sqlite3_msize)(e),i._sqlite3_vfs_find=e=>(i._sqlite3_vfs_find=h.sqlite3_vfs_find)(e),i._sqlite3_initialize=()=>(i._sqlite3_initialize=h.sqlite3_initialize)(),i._sqlite3_malloc=e=>(i._sqlite3_malloc=h.sqlite3_malloc)(e),i._sqlite3_free=e=>(i._sqlite3_free=h.sqlite3_free)(e),i._sqlite3_vfs_register=(e,t)=>(i._sqlite3_vfs_register=h.sqlite3_vfs_register)(e,t),i._sqlite3_vfs_unregister=e=>(i._sqlite3_vfs_unregister=h.sqlite3_vfs_unregister)(e),i._sqlite3_malloc64=e=>(i._sqlite3_malloc64=h.sqlite3_malloc64)(e),i._sqlite3_realloc=(e,t)=>(i._sqlite3_realloc=h.sqlite3_realloc)(e,t),i._sqlite3_realloc64=(e,t)=>(i._sqlite3_realloc64=h.sqlite3_realloc64)(e,t),i._sqlite3_value_text=e=>(i._sqlite3_value_text=h.sqlite3_value_text)(e),i._sqlite3_randomness=(e,t)=>(i._sqlite3_randomness=h.sqlite3_randomness)(e,t),i._sqlite3_stricmp=(e,t)=>(i._sqlite3_stricmp=h.sqlite3_stricmp)(e,t),i._sqlite3_strnicmp=(e,t,n)=>(i._sqlite3_strnicmp=h.sqlite3_strnicmp)(e,t,n),i._sqlite3_uri_parameter=(e,t)=>(i._sqlite3_uri_parameter=h.sqlite3_uri_parameter)(e,t),i._sqlite3_uri_boolean=(e,t,n)=>(i._sqlite3_uri_boolean=h.sqlite3_uri_boolean)(e,t,n),i._sqlite3_serialize=(e,t,n,r)=>(i._sqlite3_serialize=h.sqlite3_serialize)(e,t,n,r),i._sqlite3_prepare_v2=(e,t,n,r,s)=>(i._sqlite3_prepare_v2=h.sqlite3_prepare_v2)(e,t,n,r,s),i._sqlite3_step=e=>(i._sqlite3_step=h.sqlite3_step)(e),i._sqlite3_column_int64=(e,t)=>(i._sqlite3_column_int64=h.sqlite3_column_int64)(e,t),i._sqlite3_reset=e=>(i._sqlite3_reset=h.sqlite3_reset)(e),i._sqlite3_exec=(e,t,n,r,s)=>(i._sqlite3_exec=h.sqlite3_exec)(e,t,n,r,s),i._sqlite3_column_int=(e,t)=>(i._sqlite3_column_int=h.sqlite3_column_int)(e,t),i._sqlite3_finalize=e=>(i._sqlite3_finalize=h.sqlite3_finalize)(e),i._sqlite3_file_control=(e,t,n,r)=>(i._sqlite3_file_control=h.sqlite3_file_control)(e,t,n,r),i._sqlite3_column_name=(e,t)=>(i._sqlite3_column_name=h.sqlite3_column_name)(e,t),i._sqlite3_column_text=(e,t)=>(i._sqlite3_column_text=h.sqlite3_column_text)(e,t),i._sqlite3_column_type=(e,t)=>(i._sqlite3_column_type=h.sqlite3_column_type)(e,t),i._sqlite3_errmsg=e=>(i._sqlite3_errmsg=h.sqlite3_errmsg)(e),i._sqlite3_deserialize=(e,t,n,r,s,o)=>(i._sqlite3_deserialize=h.sqlite3_deserialize)(e,t,n,r,s,o),i._sqlite3_clear_bindings=e=>(i._sqlite3_clear_bindings=h.sqlite3_clear_bindings)(e),i._sqlite3_value_blob=e=>(i._sqlite3_value_blob=h.sqlite3_value_blob)(e),i._sqlite3_value_bytes=e=>(i._sqlite3_value_bytes=h.sqlite3_value_bytes)(e),i._sqlite3_value_double=e=>(i._sqlite3_value_double=h.sqlite3_value_double)(e),i._sqlite3_value_int=e=>(i._sqlite3_value_int=h.sqlite3_value_int)(e),i._sqlite3_value_int64=e=>(i._sqlite3_value_int64=h.sqlite3_value_int64)(e),i._sqlite3_value_subtype=e=>(i._sqlite3_value_subtype=h.sqlite3_value_subtype)(e),i._sqlite3_value_pointer=(e,t)=>(i._sqlite3_value_pointer=h.sqlite3_value_pointer)(e,t),i._sqlite3_value_type=e=>(i._sqlite3_value_type=h.sqlite3_value_type)(e),i._sqlite3_value_nochange=e=>(i._sqlite3_value_nochange=h.sqlite3_value_nochange)(e),i._sqlite3_value_frombind=e=>(i._sqlite3_value_frombind=h.sqlite3_value_frombind)(e),i._sqlite3_value_dup=e=>(i._sqlite3_value_dup=h.sqlite3_value_dup)(e),i._sqlite3_value_free=e=>(i._sqlite3_value_free=h.sqlite3_value_free)(e),i._sqlite3_result_blob=(e,t,n,r)=>(i._sqlite3_result_blob=h.sqlite3_result_blob)(e,t,n,r),i._sqlite3_result_error_toobig=e=>(i._sqlite3_result_error_toobig=h.sqlite3_result_error_toobig)(e),i._sqlite3_result_error_nomem=e=>(i._sqlite3_result_error_nomem=h.sqlite3_result_error_nomem)(e),i._sqlite3_result_double=(e,t)=>(i._sqlite3_result_double=h.sqlite3_result_double)(e,t),i._sqlite3_result_error=(e,t,n)=>(i._sqlite3_result_error=h.sqlite3_result_error)(e,t,n),i._sqlite3_result_int=(e,t)=>(i._sqlite3_result_int=h.sqlite3_result_int)(e,t),i._sqlite3_result_int64=(e,t)=>(i._sqlite3_result_int64=h.sqlite3_result_int64)(e,t),i._sqlite3_result_null=e=>(i._sqlite3_result_null=h.sqlite3_result_null)(e),i._sqlite3_result_pointer=(e,t,n,r)=>(i._sqlite3_result_pointer=h.sqlite3_result_pointer)(e,t,n,r),i._sqlite3_result_subtype=(e,t)=>(i._sqlite3_result_subtype=h.sqlite3_result_subtype)(e,t),i._sqlite3_result_text=(e,t,n,r)=>(i._sqlite3_result_text=h.sqlite3_result_text)(e,t,n,r),i._sqlite3_result_zeroblob=(e,t)=>(i._sqlite3_result_zeroblob=h.sqlite3_result_zeroblob)(e,t),i._sqlite3_result_zeroblob64=(e,t)=>(i._sqlite3_result_zeroblob64=h.sqlite3_result_zeroblob64)(e,t),i._sqlite3_result_error_code=(e,t)=>(i._sqlite3_result_error_code=h.sqlite3_result_error_code)(e,t),i._sqlite3_user_data=e=>(i._sqlite3_user_data=h.sqlite3_user_data)(e),i._sqlite3_context_db_handle=e=>(i._sqlite3_context_db_handle=h.sqlite3_context_db_handle)(e),i._sqlite3_vtab_nochange=e=>(i._sqlite3_vtab_nochange=h.sqlite3_vtab_nochange)(e),i._sqlite3_vtab_in_first=(e,t)=>(i._sqlite3_vtab_in_first=h.sqlite3_vtab_in_first)(e,t),i._sqlite3_vtab_in_next=(e,t)=>(i._sqlite3_vtab_in_next=h.sqlite3_vtab_in_next)(e,t),i._sqlite3_aggregate_context=(e,t)=>(i._sqlite3_aggregate_context=h.sqlite3_aggregate_context)(e,t),i._sqlite3_get_auxdata=(e,t)=>(i._sqlite3_get_auxdata=h.sqlite3_get_auxdata)(e,t),i._sqlite3_set_auxdata=(e,t,n,r)=>(i._sqlite3_set_auxdata=h.sqlite3_set_auxdata)(e,t,n,r),i._sqlite3_column_count=e=>(i._sqlite3_column_count=h.sqlite3_column_count)(e),i._sqlite3_data_count=e=>(i._sqlite3_data_count=h.sqlite3_data_count)(e),i._sqlite3_column_blob=(e,t)=>(i._sqlite3_column_blob=h.sqlite3_column_blob)(e,t),i._sqlite3_column_bytes=(e,t)=>(i._sqlite3_column_bytes=h.sqlite3_column_bytes)(e,t),i._sqlite3_column_double=(e,t)=>(i._sqlite3_column_double=h.sqlite3_column_double)(e,t),i._sqlite3_column_value=(e,t)=>(i._sqlite3_column_value=h.sqlite3_column_value)(e,t),i._sqlite3_column_decltype=(e,t)=>(i._sqlite3_column_decltype=h.sqlite3_column_decltype)(e,t),i._sqlite3_bind_blob=(e,t,n,r,s)=>(i._sqlite3_bind_blob=h.sqlite3_bind_blob)(e,t,n,r,s),i._sqlite3_bind_double=(e,t,n)=>(i._sqlite3_bind_double=h.sqlite3_bind_double)(e,t,n),i._sqlite3_bind_int=(e,t,n)=>(i._sqlite3_bind_int=h.sqlite3_bind_int)(e,t,n),i._sqlite3_bind_int64=(e,t,n)=>(i._sqlite3_bind_int64=h.sqlite3_bind_int64)(e,t,n),i._sqlite3_bind_null=(e,t)=>(i._sqlite3_bind_null=h.sqlite3_bind_null)(e,t),i._sqlite3_bind_pointer=(e,t,n,r,s)=>(i._sqlite3_bind_pointer=h.sqlite3_bind_pointer)(e,t,n,r,s),i._sqlite3_bind_text=(e,t,n,r,s)=>(i._sqlite3_bind_text=h.sqlite3_bind_text)(e,t,n,r,s),i._sqlite3_bind_parameter_count=e=>(i._sqlite3_bind_parameter_count=h.sqlite3_bind_parameter_count)(e),i._sqlite3_bind_parameter_name=(e,t)=>(i._sqlite3_bind_parameter_name=h.sqlite3_bind_parameter_name)(e,t),i._sqlite3_bind_parameter_index=(e,t)=>(i._sqlite3_bind_parameter_index=h.sqlite3_bind_parameter_index)(e,t),i._sqlite3_db_handle=e=>(i._sqlite3_db_handle=h.sqlite3_db_handle)(e),i._sqlite3_stmt_readonly=e=>(i._sqlite3_stmt_readonly=h.sqlite3_stmt_readonly)(e),i._sqlite3_stmt_isexplain=e=>(i._sqlite3_stmt_isexplain=h.sqlite3_stmt_isexplain)(e),i._sqlite3_stmt_explain=(e,t)=>(i._sqlite3_stmt_explain=h.sqlite3_stmt_explain)(e,t),i._sqlite3_stmt_busy=e=>(i._sqlite3_stmt_busy=h.sqlite3_stmt_busy)(e),i._sqlite3_stmt_status=(e,t,n)=>(i._sqlite3_stmt_status=h.sqlite3_stmt_status)(e,t,n),i._sqlite3_sql=e=>(i._sqlite3_sql=h.sqlite3_sql)(e),i._sqlite3_expanded_sql=e=>(i._sqlite3_expanded_sql=h.sqlite3_expanded_sql)(e),i._sqlite3_preupdate_old=(e,t,n)=>(i._sqlite3_preupdate_old=h.sqlite3_preupdate_old)(e,t,n),i._sqlite3_preupdate_count=e=>(i._sqlite3_preupdate_count=h.sqlite3_preupdate_count)(e),i._sqlite3_preupdate_depth=e=>(i._sqlite3_preupdate_depth=h.sqlite3_preupdate_depth)(e),i._sqlite3_preupdate_blobwrite=e=>(i._sqlite3_preupdate_blobwrite=h.sqlite3_preupdate_blobwrite)(e),i._sqlite3_preupdate_new=(e,t,n)=>(i._sqlite3_preupdate_new=h.sqlite3_preupdate_new)(e,t,n),i._sqlite3_value_numeric_type=e=>(i._sqlite3_value_numeric_type=h.sqlite3_value_numeric_type)(e),i._sqlite3_set_authorizer=(e,t,n)=>(i._sqlite3_set_authorizer=h.sqlite3_set_authorizer)(e,t,n),i._sqlite3_strglob=(e,t)=>(i._sqlite3_strglob=h.sqlite3_strglob)(e,t),i._sqlite3_strlike=(e,t,n)=>(i._sqlite3_strlike=h.sqlite3_strlike)(e,t,n),i._sqlite3_auto_extension=e=>(i._sqlite3_auto_extension=h.sqlite3_auto_extension)(e),i._sqlite3_cancel_auto_extension=e=>(i._sqlite3_cancel_auto_extension=h.sqlite3_cancel_auto_extension)(e),i._sqlite3_reset_auto_extension=()=>(i._sqlite3_reset_auto_extension=h.sqlite3_reset_auto_extension)(),i._sqlite3_prepare_v3=(e,t,n,r,s,o)=>(i._sqlite3_prepare_v3=h.sqlite3_prepare_v3)(e,t,n,r,s,o),i._sqlite3_create_module=(e,t,n,r)=>(i._sqlite3_create_module=h.sqlite3_create_module)(e,t,n,r),i._sqlite3_create_module_v2=(e,t,n,r,s)=>(i._sqlite3_create_module_v2=h.sqlite3_create_module_v2)(e,t,n,r,s),i._sqlite3_drop_modules=(e,t)=>(i._sqlite3_drop_modules=h.sqlite3_drop_modules)(e,t),i._sqlite3_declare_vtab=(e,t)=>(i._sqlite3_declare_vtab=h.sqlite3_declare_vtab)(e,t),i._sqlite3_vtab_on_conflict=e=>(i._sqlite3_vtab_on_conflict=h.sqlite3_vtab_on_conflict)(e),i._sqlite3_vtab_collation=(e,t)=>(i._sqlite3_vtab_collation=h.sqlite3_vtab_collation)(e,t),i._sqlite3_vtab_in=(e,t,n)=>(i._sqlite3_vtab_in=h.sqlite3_vtab_in)(e,t,n),i._sqlite3_vtab_rhs_value=(e,t,n)=>(i._sqlite3_vtab_rhs_value=h.sqlite3_vtab_rhs_value)(e,t,n),i._sqlite3_vtab_distinct=e=>(i._sqlite3_vtab_distinct=h.sqlite3_vtab_distinct)(e),i._sqlite3_keyword_name=(e,t,n)=>(i._sqlite3_keyword_name=h.sqlite3_keyword_name)(e,t,n),i._sqlite3_keyword_count=()=>(i._sqlite3_keyword_count=h.sqlite3_keyword_count)(),i._sqlite3_keyword_check=(e,t)=>(i._sqlite3_keyword_check=h.sqlite3_keyword_check)(e,t),i._sqlite3_complete=e=>(i._sqlite3_complete=h.sqlite3_complete)(e),i._sqlite3_libversion=()=>(i._sqlite3_libversion=h.sqlite3_libversion)(),i._sqlite3_libversion_number=()=>(i._sqlite3_libversion_number=h.sqlite3_libversion_number)(),i._sqlite3_shutdown=()=>(i._sqlite3_shutdown=h.sqlite3_shutdown)(),i._sqlite3_last_insert_rowid=e=>(i._sqlite3_last_insert_rowid=h.sqlite3_last_insert_rowid)(e),i._sqlite3_set_last_insert_rowid=(e,t)=>(i._sqlite3_set_last_insert_rowid=h.sqlite3_set_last_insert_rowid)(e,t),i._sqlite3_changes64=e=>(i._sqlite3_changes64=h.sqlite3_changes64)(e),i._sqlite3_changes=e=>(i._sqlite3_changes=h.sqlite3_changes)(e),i._sqlite3_total_changes64=e=>(i._sqlite3_total_changes64=h.sqlite3_total_changes64)(e),i._sqlite3_total_changes=e=>(i._sqlite3_total_changes=h.sqlite3_total_changes)(e),i._sqlite3_txn_state=(e,t)=>(i._sqlite3_txn_state=h.sqlite3_txn_state)(e,t),i._sqlite3_close_v2=e=>(i._sqlite3_close_v2=h.sqlite3_close_v2)(e),i._sqlite3_busy_handler=(e,t,n)=>(i._sqlite3_busy_handler=h.sqlite3_busy_handler)(e,t,n),i._sqlite3_progress_handler=(e,t,n,r)=>(i._sqlite3_progress_handler=h.sqlite3_progress_handler)(e,t,n,r),i._sqlite3_busy_timeout=(e,t)=>(i._sqlite3_busy_timeout=h.sqlite3_busy_timeout)(e,t),i._sqlite3_interrupt=e=>(i._sqlite3_interrupt=h.sqlite3_interrupt)(e),i._sqlite3_is_interrupted=e=>(i._sqlite3_is_interrupted=h.sqlite3_is_interrupted)(e),i._sqlite3_create_function=(e,t,n,r,s,o,p,g)=>(i._sqlite3_create_function=h.sqlite3_create_function)(e,t,n,r,s,o,p,g),i._sqlite3_create_function_v2=(e,t,n,r,s,o,p,g,O)=>(i._sqlite3_create_function_v2=h.sqlite3_create_function_v2)(e,t,n,r,s,o,p,g,O),i._sqlite3_create_window_function=(e,t,n,r,s,o,p,g,O,R)=>(i._sqlite3_create_window_function=h.sqlite3_create_window_function)(e,t,n,r,s,o,p,g,O,R),i._sqlite3_overload_function=(e,t,n)=>(i._sqlite3_overload_function=h.sqlite3_overload_function)(e,t,n),i._sqlite3_trace_v2=(e,t,n,r)=>(i._sqlite3_trace_v2=h.sqlite3_trace_v2)(e,t,n,r),i._sqlite3_commit_hook=(e,t,n)=>(i._sqlite3_commit_hook=h.sqlite3_commit_hook)(e,t,n),i._sqlite3_update_hook=(e,t,n)=>(i._sqlite3_update_hook=h.sqlite3_update_hook)(e,t,n),i._sqlite3_rollback_hook=(e,t,n)=>(i._sqlite3_rollback_hook=h.sqlite3_rollback_hook)(e,t,n),i._sqlite3_preupdate_hook=(e,t,n)=>(i._sqlite3_preupdate_hook=h.sqlite3_preupdate_hook)(e,t,n),i._sqlite3_error_offset=e=>(i._sqlite3_error_offset=h.sqlite3_error_offset)(e),i._sqlite3_errcode=e=>(i._sqlite3_errcode=h.sqlite3_errcode)(e),i._sqlite3_extended_errcode=e=>(i._sqlite3_extended_errcode=h.sqlite3_extended_errcode)(e),i._sqlite3_errstr=e=>(i._sqlite3_errstr=h.sqlite3_errstr)(e),i._sqlite3_limit=(e,t,n)=>(i._sqlite3_limit=h.sqlite3_limit)(e,t,n),i._sqlite3_open=(e,t)=>(i._sqlite3_open=h.sqlite3_open)(e,t),i._sqlite3_open_v2=(e,t,n,r)=>(i._sqlite3_open_v2=h.sqlite3_open_v2)(e,t,n,r),i._sqlite3_create_collation=(e,t,n,r,s)=>(i._sqlite3_create_collation=h.sqlite3_create_collation)(e,t,n,r,s),i._sqlite3_create_collation_v2=(e,t,n,r,s,o)=>(i._sqlite3_create_collation_v2=h.sqlite3_create_collation_v2)(e,t,n,r,s,o),i._sqlite3_collation_needed=(e,t,n)=>(i._sqlite3_collation_needed=h.sqlite3_collation_needed)(e,t,n),i._sqlite3_get_autocommit=e=>(i._sqlite3_get_autocommit=h.sqlite3_get_autocommit)(e),i._sqlite3_table_column_metadata=(e,t,n,r,s,o,p,g,O)=>(i._sqlite3_table_column_metadata=h.sqlite3_table_column_metadata)(e,t,n,r,s,o,p,g,O),i._sqlite3_extended_result_codes=(e,t)=>(i._sqlite3_extended_result_codes=h.sqlite3_extended_result_codes)(e,t),i._sqlite3_uri_key=(e,t)=>(i._sqlite3_uri_key=h.sqlite3_uri_key)(e,t),i._sqlite3_uri_int64=(e,t,n)=>(i._sqlite3_uri_int64=h.sqlite3_uri_int64)(e,t,n),i._sqlite3_db_name=(e,t)=>(i._sqlite3_db_name=h.sqlite3_db_name)(e,t),i._sqlite3_db_filename=(e,t)=>(i._sqlite3_db_filename=h.sqlite3_db_filename)(e,t),i._sqlite3_db_readonly=(e,t)=>(i._sqlite3_db_readonly=h.sqlite3_db_readonly)(e,t),i._sqlite3_compileoption_used=e=>(i._sqlite3_compileoption_used=h.sqlite3_compileoption_used)(e),i._sqlite3_compileoption_get=e=>(i._sqlite3_compileoption_get=h.sqlite3_compileoption_get)(e),i._sqlite3session_diff=(e,t,n,r)=>(i._sqlite3session_diff=h.sqlite3session_diff)(e,t,n,r),i._sqlite3session_attach=(e,t)=>(i._sqlite3session_attach=h.sqlite3session_attach)(e,t),i._sqlite3session_create=(e,t,n)=>(i._sqlite3session_create=h.sqlite3session_create)(e,t,n),i._sqlite3session_delete=e=>(i._sqlite3session_delete=h.sqlite3session_delete)(e),i._sqlite3session_table_filter=(e,t,n)=>(i._sqlite3session_table_filter=h.sqlite3session_table_filter)(e,t,n),i._sqlite3session_changeset=(e,t,n)=>(i._sqlite3session_changeset=h.sqlite3session_changeset)(e,t,n),i._sqlite3session_changeset_strm=(e,t,n)=>(i._sqlite3session_changeset_strm=h.sqlite3session_changeset_strm)(e,t,n),i._sqlite3session_patchset_strm=(e,t,n)=>(i._sqlite3session_patchset_strm=h.sqlite3session_patchset_strm)(e,t,n),i._sqlite3session_patchset=(e,t,n)=>(i._sqlite3session_patchset=h.sqlite3session_patchset)(e,t,n),i._sqlite3session_enable=(e,t)=>(i._sqlite3session_enable=h.sqlite3session_enable)(e,t),i._sqlite3session_indirect=(e,t)=>(i._sqlite3session_indirect=h.sqlite3session_indirect)(e,t),i._sqlite3session_isempty=e=>(i._sqlite3session_isempty=h.sqlite3session_isempty)(e),i._sqlite3session_memory_used=e=>(i._sqlite3session_memory_used=h.sqlite3session_memory_used)(e),i._sqlite3session_object_config=(e,t,n)=>(i._sqlite3session_object_config=h.sqlite3session_object_config)(e,t,n),i._sqlite3session_changeset_size=e=>(i._sqlite3session_changeset_size=h.sqlite3session_changeset_size)(e),i._sqlite3changeset_start=(e,t,n)=>(i._sqlite3changeset_start=h.sqlite3changeset_start)(e,t,n),i._sqlite3changeset_start_v2=(e,t,n,r)=>(i._sqlite3changeset_start_v2=h.sqlite3changeset_start_v2)(e,t,n,r),i._sqlite3changeset_start_strm=(e,t,n)=>(i._sqlite3changeset_start_strm=h.sqlite3changeset_start_strm)(e,t,n),i._sqlite3changeset_start_v2_strm=(e,t,n,r)=>(i._sqlite3changeset_start_v2_strm=h.sqlite3changeset_start_v2_strm)(e,t,n,r),i._sqlite3changeset_next=e=>(i._sqlite3changeset_next=h.sqlite3changeset_next)(e),i._sqlite3changeset_op=(e,t,n,r,s)=>(i._sqlite3changeset_op=h.sqlite3changeset_op)(e,t,n,r,s),i._sqlite3changeset_pk=(e,t,n)=>(i._sqlite3changeset_pk=h.sqlite3changeset_pk)(e,t,n),i._sqlite3changeset_old=(e,t,n)=>(i._sqlite3changeset_old=h.sqlite3changeset_old)(e,t,n),i._sqlite3changeset_new=(e,t,n)=>(i._sqlite3changeset_new=h.sqlite3changeset_new)(e,t,n),i._sqlite3changeset_conflict=(e,t,n)=>(i._sqlite3changeset_conflict=h.sqlite3changeset_conflict)(e,t,n),i._sqlite3changeset_fk_conflicts=(e,t)=>(i._sqlite3changeset_fk_conflicts=h.sqlite3changeset_fk_conflicts)(e,t),i._sqlite3changeset_finalize=e=>(i._sqlite3changeset_finalize=h.sqlite3changeset_finalize)(e),i._sqlite3changeset_invert=(e,t,n,r)=>(i._sqlite3changeset_invert=h.sqlite3changeset_invert)(e,t,n,r),i._sqlite3changeset_invert_strm=(e,t,n,r)=>(i._sqlite3changeset_invert_strm=h.sqlite3changeset_invert_strm)(e,t,n,r),i._sqlite3changeset_apply_v2=(e,t,n,r,s,o,p,g,O)=>(i._sqlite3changeset_apply_v2=h.sqlite3changeset_apply_v2)(e,t,n,r,s,o,p,g,O),i._sqlite3changeset_apply=(e,t,n,r,s,o)=>(i._sqlite3changeset_apply=h.sqlite3changeset_apply)(e,t,n,r,s,o),i._sqlite3changeset_apply_v2_strm=(e,t,n,r,s,o,p,g,O)=>(i._sqlite3changeset_apply_v2_strm=h.sqlite3changeset_apply_v2_strm)(e,t,n,r,s,o,p,g,O),i._sqlite3changeset_apply_strm=(e,t,n,r,s,o)=>(i._sqlite3changeset_apply_strm=h.sqlite3changeset_apply_strm)(e,t,n,r,s,o),i._sqlite3changegroup_new=e=>(i._sqlite3changegroup_new=h.sqlite3changegroup_new)(e),i._sqlite3changegroup_add=(e,t,n)=>(i._sqlite3changegroup_add=h.sqlite3changegroup_add)(e,t,n),i._sqlite3changegroup_output=(e,t,n)=>(i._sqlite3changegroup_output=h.sqlite3changegroup_output)(e,t,n),i._sqlite3changegroup_add_strm=(e,t,n)=>(i._sqlite3changegroup_add_strm=h.sqlite3changegroup_add_strm)(e,t,n),i._sqlite3changegroup_output_strm=(e,t,n)=>(i._sqlite3changegroup_output_strm=h.sqlite3changegroup_output_strm)(e,t,n),i._sqlite3changegroup_delete=e=>(i._sqlite3changegroup_delete=h.sqlite3changegroup_delete)(e),i._sqlite3changeset_concat=(e,t,n,r,s,o)=>(i._sqlite3changeset_concat=h.sqlite3changeset_concat)(e,t,n,r,s,o),i._sqlite3changeset_concat_strm=(e,t,n,r,s,o)=>(i._sqlite3changeset_concat_strm=h.sqlite3changeset_concat_strm)(e,t,n,r,s,o),i._sqlite3session_config=(e,t)=>(i._sqlite3session_config=h.sqlite3session_config)(e,t),i._sqlite3_sourceid=()=>(i._sqlite3_sourceid=h.sqlite3_sourceid)(),i._sqlite3__wasm_pstack_ptr=()=>(i._sqlite3__wasm_pstack_ptr=h.sqlite3__wasm_pstack_ptr)(),i._sqlite3__wasm_pstack_restore=e=>(i._sqlite3__wasm_pstack_restore=h.sqlite3__wasm_pstack_restore)(e),i._sqlite3__wasm_pstack_alloc=e=>(i._sqlite3__wasm_pstack_alloc=h.sqlite3__wasm_pstack_alloc)(e),i._sqlite3__wasm_pstack_remaining=()=>(i._sqlite3__wasm_pstack_remaining=h.sqlite3__wasm_pstack_remaining)(),i._sqlite3__wasm_pstack_quota=()=>(i._sqlite3__wasm_pstack_quota=h.sqlite3__wasm_pstack_quota)(),i._sqlite3__wasm_db_error=(e,t,n)=>(i._sqlite3__wasm_db_error=h.sqlite3__wasm_db_error)(e,t,n),i._sqlite3__wasm_test_struct=e=>(i._sqlite3__wasm_test_struct=h.sqlite3__wasm_test_struct)(e),i._sqlite3__wasm_enum_json=()=>(i._sqlite3__wasm_enum_json=h.sqlite3__wasm_enum_json)(),i._sqlite3__wasm_vfs_unlink=(e,t)=>(i._sqlite3__wasm_vfs_unlink=h.sqlite3__wasm_vfs_unlink)(e,t),i._sqlite3__wasm_db_vfs=(e,t)=>(i._sqlite3__wasm_db_vfs=h.sqlite3__wasm_db_vfs)(e,t),i._sqlite3__wasm_db_reset=e=>(i._sqlite3__wasm_db_reset=h.sqlite3__wasm_db_reset)(e),i._sqlite3__wasm_db_export_chunked=(e,t)=>(i._sqlite3__wasm_db_export_chunked=h.sqlite3__wasm_db_export_chunked)(e,t),i._sqlite3__wasm_db_serialize=(e,t,n,r,s)=>(i._sqlite3__wasm_db_serialize=h.sqlite3__wasm_db_serialize)(e,t,n,r,s),i._sqlite3__wasm_vfs_create_file=(e,t,n,r)=>(i._sqlite3__wasm_vfs_create_file=h.sqlite3__wasm_vfs_create_file)(e,t,n,r),i._sqlite3__wasm_posix_create_file=(e,t,n)=>(i._sqlite3__wasm_posix_create_file=h.sqlite3__wasm_posix_create_file)(e,t,n),i._sqlite3__wasm_kvvfsMakeKeyOnPstack=(e,t)=>(i._sqlite3__wasm_kvvfsMakeKeyOnPstack=h.sqlite3__wasm_kvvfsMakeKeyOnPstack)(e,t),i._sqlite3__wasm_kvvfs_methods=()=>(i._sqlite3__wasm_kvvfs_methods=h.sqlite3__wasm_kvvfs_methods)(),i._sqlite3__wasm_vtab_config=(e,t,n)=>(i._sqlite3__wasm_vtab_config=h.sqlite3__wasm_vtab_config)(e,t,n),i._sqlite3__wasm_db_config_ip=(e,t,n,r)=>(i._sqlite3__wasm_db_config_ip=h.sqlite3__wasm_db_config_ip)(e,t,n,r),i._sqlite3__wasm_db_config_pii=(e,t,n,r,s)=>(i._sqlite3__wasm_db_config_pii=h.sqlite3__wasm_db_config_pii)(e,t,n,r,s),i._sqlite3__wasm_db_config_s=(e,t,n)=>(i._sqlite3__wasm_db_config_s=h.sqlite3__wasm_db_config_s)(e,t,n),i._sqlite3__wasm_config_i=(e,t)=>(i._sqlite3__wasm_config_i=h.sqlite3__wasm_config_i)(e,t),i._sqlite3__wasm_config_ii=(e,t,n)=>(i._sqlite3__wasm_config_ii=h.sqlite3__wasm_config_ii)(e,t,n),i._sqlite3__wasm_config_j=(e,t)=>(i._sqlite3__wasm_config_j=h.sqlite3__wasm_config_j)(e,t),i._sqlite3__wasm_qfmt_token=(e,t)=>(i._sqlite3__wasm_qfmt_token=h.sqlite3__wasm_qfmt_token)(e,t),i._sqlite3__wasm_init_wasmfs=e=>(i._sqlite3__wasm_init_wasmfs=h.sqlite3__wasm_init_wasmfs)(e),i._sqlite3__wasm_test_intptr=e=>(i._sqlite3__wasm_test_intptr=h.sqlite3__wasm_test_intptr)(e),i._sqlite3__wasm_test_voidptr=e=>(i._sqlite3__wasm_test_voidptr=h.sqlite3__wasm_test_voidptr)(e),i._sqlite3__wasm_test_int64_max=()=>(i._sqlite3__wasm_test_int64_max=h.sqlite3__wasm_test_int64_max)(),i._sqlite3__wasm_test_int64_min=()=>(i._sqlite3__wasm_test_int64_min=h.sqlite3__wasm_test_int64_min)(),i._sqlite3__wasm_test_int64_times2=e=>(i._sqlite3__wasm_test_int64_times2=h.sqlite3__wasm_test_int64_times2)(e),i._sqlite3__wasm_test_int64_minmax=(e,t)=>(i._sqlite3__wasm_test_int64_minmax=h.sqlite3__wasm_test_int64_minmax)(e,t),i._sqlite3__wasm_test_int64ptr=e=>(i._sqlite3__wasm_test_int64ptr=h.sqlite3__wasm_test_int64ptr)(e),i._sqlite3__wasm_test_stack_overflow=e=>(i._sqlite3__wasm_test_stack_overflow=h.sqlite3__wasm_test_stack_overflow)(e),i._sqlite3__wasm_test_str_hello=e=>(i._sqlite3__wasm_test_str_hello=h.sqlite3__wasm_test_str_hello)(e),i._sqlite3__wasm_SQLTester_strglob=(e,t)=>(i._sqlite3__wasm_SQLTester_strglob=h.sqlite3__wasm_SQLTester_strglob)(e,t),i._malloc=e=>(i._malloc=h.malloc)(e),i._free=e=>(i._free=h.free)(e),i._realloc=(e,t)=>(i._realloc=h.realloc)(e,t);var St=(e,t)=>(St=h.emscripten_builtin_memalign)(e,t);i.wasmMemory=Te;var Ge,At;Me=function e(){Ge||It(),Ge||(Me=e)};function It(){if(Fe>0||!At&&(At=1,Lt(),Fe>0))return;function e(){Ge||(Ge=1,i.calledRun=1,!_t&&(Ct(),ve(i),i.onRuntimeInitialized?.(),Dt()))}i.setStatus?(i.setStatus("Running..."),setTimeout(()=>{setTimeout(()=>i.setStatus(""),1),e()},1)):e()}if(i.preInit)for(typeof i.preInit=="function"&&(i.preInit=[i.preInit]);i.preInit.length>0;)i.preInit.pop()();return It(),i.runSQLite3PostLoadInit=function(e){if(globalThis.sqlite3ApiBootstrap=function t(n=globalThis.sqlite3ApiConfig||t.defaultConfig){if(t.sqlite3)return(t.sqlite3.config||console).warn("sqlite3ApiBootstrap() called multiple times.","Config and external initializers are ignored on calls after the first."),t.sqlite3;const r=Object.assign(Object.create(null),{exports:void 0,memory:void 0,bigIntEnabled:typeof i<"u"&&i.HEAPU64?!0:!!globalThis.BigInt64Array,debug:console.debug.bind(console),warn:console.warn.bind(console),error:console.error.bind(console),log:console.log.bind(console),wasmfsOpfsDir:"/opfs",useStdAlloc:!1},n||{});Object.assign(r,{allocExportName:r.useStdAlloc?"malloc":"sqlite3_malloc",deallocExportName:r.useStdAlloc?"free":"sqlite3_free",reallocExportName:r.useStdAlloc?"realloc":"sqlite3_realloc"},r),["exports","memory","wasmfsOpfsDir"].forEach(l=>{typeof r[l]=="function"&&(r[l]=r[l]())}),delete globalThis.sqlite3ApiConfig,delete t.defaultConfig;const s=Object.create(null),o=Object.create(null),p=l=>s.sqlite3_js_rc_str&&s.sqlite3_js_rc_str(l)||"Unknown result code #"+l,g=l=>typeof l=="number"&&l===(l|0);class O extends Error{constructor(..._){let u;if(_.length)if(g(_[0]))if(u=_[0],_.length===1)super(p(_[0]));else{const I=p(u);typeof _[1]=="object"?super(I,_[1]):(_[0]=I+":",super(_.join(" ")))}else _.length===2&&typeof _[1]=="object"?super(..._):super(_.join(" "));this.resultCode=u||s.SQLITE_ERROR,this.name="SQLite3Error"}}O.toss=(...l)=>{throw new O(...l)};const R=O.toss;r.wasmfsOpfsDir&&!/^\/[^/]+$/.test(r.wasmfsOpfsDir)&&R("config.wasmfsOpfsDir must be falsy or in the form '/dir-name'.");const z=l=>typeof l!="bigint"&&l===(l|0)&&l<=2147483647&&l>=-2147483648,W=function l(_){return l._max||(l._max=BigInt("0x7fffffffffffffff"),l._min=~l._max),_>=l._min&&_<=l._max},T=l=>l>=-0x7fffffffn-1n&&l<=0x7fffffffn,A=function l(_){return l._min||(l._min=Number.MIN_SAFE_INTEGER,l._max=Number.MAX_SAFE_INTEGER),_>=l._min&&_<=l._max},D=l=>l&&l.constructor&&z(l.constructor.BYTES_PER_ELEMENT)?l:!1,q=typeof SharedArrayBuffer>"u"?function(){}:SharedArrayBuffer,w=l=>l.buffer instanceof q,x=(l,_,u)=>w(l)?l.slice(_,u):l.subarray(_,u),N=l=>l&&(l instanceof Uint8Array||l instanceof Int8Array||l instanceof ArrayBuffer),P=l=>l&&(l instanceof Uint8Array||l instanceof Int8Array||l instanceof ArrayBuffer),S=l=>N(l)||R("Value is not of a supported TypedArray type."),L=new TextDecoder("utf-8"),$=function(l,_,u){return L.decode(x(l,_,u))},c=function(l){return P(l)?$(l instanceof ArrayBuffer?new Uint8Array(l):l):Array.isArray(l)?l.join(""):(o.isPtr(l)&&(l=o.cstrToJs(l)),l)};class d extends Error{constructor(..._){_.length===2&&typeof _[1]=="object"?super(..._):_.length?super(_.join(" ")):super("Allocation failed."),this.resultCode=s.SQLITE_NOMEM,this.name="WasmAllocError"}}d.toss=(...l)=>{throw new d(...l)},Object.assign(s,{sqlite3_bind_blob:void 0,sqlite3_bind_text:void 0,sqlite3_create_function_v2:(l,_,u,I,U,ee,ne,re,se)=>{},sqlite3_create_function:(l,_,u,I,U,ee,ne,re)=>{},sqlite3_create_window_function:(l,_,u,I,U,ee,ne,re,se,j)=>{},sqlite3_prepare_v3:(l,_,u,I,U,ee)=>{},sqlite3_prepare_v2:(l,_,u,I,U)=>{},sqlite3_exec:(l,_,u,I,U)=>{},sqlite3_randomness:(l,_)=>{}});const y={affirmBindableTypedArray:S,flexibleString:c,bigIntFits32:T,bigIntFits64:W,bigIntFitsDouble:A,isBindableTypedArray:N,isInt32:z,isSQLableTypedArray:P,isTypedArray:D,typedArrayToString:$,isUIThread:()=>globalThis.window===globalThis&&!!globalThis.document,isSharedTypedArray:w,toss:function(...l){throw new Error(l.join(" "))},toss3:R,typedArrayPart:x,affirmDbHeader:function(l){l instanceof ArrayBuffer&&(l=new Uint8Array(l));const _="SQLite format 3";_.length>l.byteLength&&R("Input does not contain an SQLite3 database header.");for(let u=0;u<_.length;++u)_.charCodeAt(u)!==l[u]&&R("Input does not contain an SQLite3 database header.")},affirmIsDb:function(l){l instanceof ArrayBuffer&&(l=new Uint8Array(l));const _=l.byteLength;(_<512||_%512!==0)&&R("Byte array size",_,"is invalid for an SQLite3 db."),y.affirmDbHeader(l)}};Object.assign(o,{ptrSizeof:r.wasmPtrSizeof||4,ptrIR:r.wasmPtrIR||"i32",bigIntEnabled:!!r.bigIntEnabled,exports:r.exports||R("Missing API config.exports (WASM module exports)."),memory:r.memory||r.exports.memory||R("API config object requires a WebAssembly.Memory object","in either config.exports.memory (exported)","or config.memory (imported)."),alloc:void 0,realloc:void 0,dealloc:void 0}),o.allocFromTypedArray=function(l){l instanceof ArrayBuffer&&(l=new Uint8Array(l)),S(l);const _=o.alloc(l.byteLength||1);return o.heapForSize(l.constructor).set(l.byteLength?l:[0],_),_};{const l=r.allocExportName,_=r.deallocExportName,u=r.reallocExportName;for(const I of[l,_,u])o.exports[I]instanceof Function||R("Missing required exports[",I,"] function.");o.alloc=function I(U){return I.impl(U)||d.toss("Failed to allocate",U," bytes.")},o.alloc.impl=o.exports[l],o.realloc=function I(U,ee){const ne=I.impl(U,ee);return ee?ne||d.toss("Failed to reallocate",ee," bytes."):0},o.realloc.impl=o.exports[u],o.dealloc=o.exports[_]}o.compileOptionUsed=function l(_){if(arguments.length){if(Array.isArray(_)){const u={};return _.forEach(I=>{u[I]=s.sqlite3_compileoption_used(I)}),u}else if(typeof _=="object")return Object.keys(_).forEach(u=>{_[u]=s.sqlite3_compileoption_used(u)}),_}else{if(l._result)return l._result;l._opt||(l._rx=/^([^=]+)=(.+)/,l._rxInt=/^-?\d+$/,l._opt=function(ne,re){const se=l._rx.exec(ne);re[0]=se?se[1]:ne,re[1]=se?l._rxInt.test(se[2])?+se[2]:se[2]:!0});const u={},I=[0,0];let U=0,ee;for(;ee=s.sqlite3_compileoption_get(U++);)l._opt(ee,I),u[I[0]]=I[1];return l._result=u}return typeof _=="string"?!!s.sqlite3_compileoption_used(_):!1},o.pstack=Object.assign(Object.create(null),{restore:o.exports.sqlite3__wasm_pstack_restore,alloc:function(l){return typeof l=="string"&&!(l=o.sizeofIR(l))&&d.toss("Invalid value for pstack.alloc(",arguments[0],")"),o.exports.sqlite3__wasm_pstack_alloc(l)||d.toss("Could not allocate",l,"bytes from the pstack.")},allocChunks:function(l,_){typeof _=="string"&&!(_=o.sizeofIR(_))&&d.toss("Invalid size value for allocChunks(",arguments[1],")");const u=o.pstack.alloc(l*_),I=[];let U=0,ee=0;for(;U<l;++U,ee+=_)I.push(u+ee);return I},allocPtr:(l=1,_=!0)=>l===1?o.pstack.alloc(_?8:o.ptrSizeof):o.pstack.allocChunks(l,_?8:o.ptrSizeof),call:function(l){const _=o.pstack.pointer;try{return l(m)}finally{o.pstack.restore(_)}}}),Object.defineProperties(o.pstack,{pointer:{configurable:!1,iterable:!0,writeable:!1,get:o.exports.sqlite3__wasm_pstack_ptr},quota:{configurable:!1,iterable:!0,writeable:!1,get:o.exports.sqlite3__wasm_pstack_quota},remaining:{configurable:!1,iterable:!0,writeable:!1,get:o.exports.sqlite3__wasm_pstack_remaining}}),s.sqlite3_randomness=(...l)=>{if(l.length===1&&y.isTypedArray(l[0])&&l[0].BYTES_PER_ELEMENT===1){const _=l[0];if(_.byteLength===0)return o.exports.sqlite3_randomness(0,0),_;const u=o.pstack.pointer;try{let I=_.byteLength,U=0;const ee=o.exports.sqlite3_randomness,ne=o.heap8u(),re=I<512?I:512,se=o.pstack.alloc(re);do{const j=I>re?re:I;ee(j,se),_.set(x(ne,se,se+j),U),I-=j,U+=j}while(I>0)}catch(I){console.error("Highly unexpected (and ignored!) exception in sqlite3_randomness():",I)}finally{o.pstack.restore(u)}return _}o.exports.sqlite3_randomness(...l)};let B;if(s.sqlite3_wasmfs_opfs_dir=function(){if(B!==void 0)return B;const l=r.wasmfsOpfsDir;if(!l||!globalThis.FileSystemHandle||!globalThis.FileSystemDirectoryHandle||!globalThis.FileSystemFileHandle)return B="";try{return l&&o.xCallWrapped("sqlite3__wasm_init_wasmfs","i32",["string"],l)===0?B=l:B=""}catch{return B=""}},s.sqlite3_wasmfs_filename_is_persistent=function(l){const _=s.sqlite3_wasmfs_opfs_dir();return _&&l?l.startsWith(_+"/"):!1},s.sqlite3_js_db_uses_vfs=function(l,_,u=0){try{const I=s.sqlite3_vfs_find(_);return I?l?I===s.sqlite3_js_db_vfs(l,u)?I:!1:I===s.sqlite3_vfs_find(0)?I:!1:!1}catch{return!1}},s.sqlite3_js_vfs_list=function(){const l=[];let _=s.sqlite3_vfs_find(0);for(;_;){const u=new s.sqlite3_vfs(_);l.push(o.cstrToJs(u.$zName)),_=u.$pNext,u.dispose()}return l},s.sqlite3_js_db_export=function(l,_=0){l=o.xWrap.testConvertArg("sqlite3*",l),l||R("Invalid sqlite3* argument."),o.bigIntEnabled||R("BigInt64 support is not enabled.");const u=o.scopedAllocPush();let I;try{const U=o.scopedAlloc(8+o.ptrSizeof),ee=U+8,ne=_?o.isPtr(_)?_:o.scopedAllocCString(""+_):0;let re=o.exports.sqlite3__wasm_db_serialize(l,ne,ee,U,0);re&&R("Database serialization failed with code",m.capi.sqlite3_js_rc_str(re)),I=o.peekPtr(ee);const se=o.peek(U,"i64");return re=se?o.heap8u().slice(I,I+Number(se)):new Uint8Array,re}finally{I&&o.exports.sqlite3_free(I),o.scopedAllocPop(u)}},s.sqlite3_js_db_vfs=(l,_=0)=>y.sqlite3__wasm_db_vfs(l,_),s.sqlite3_js_aggregate_context=(l,_)=>s.sqlite3_aggregate_context(l,_)||(_?d.toss("Cannot allocate",_,"bytes for sqlite3_aggregate_context()"):0),s.sqlite3_js_posix_create_file=function(l,_,u){let I;_&&o.isPtr(_)?I=_:_ instanceof ArrayBuffer||_ instanceof Uint8Array?(I=o.allocFromTypedArray(_),(arguments.length<3||!y.isInt32(u)||u<0)&&(u=_.byteLength)):O.toss("Invalid 2nd argument for sqlite3_js_posix_create_file().");try{(!y.isInt32(u)||u<0)&&O.toss("Invalid 3rd argument for sqlite3_js_posix_create_file().");const U=y.sqlite3__wasm_posix_create_file(l,I,u);U&&O.toss("Creation of file failed with sqlite3 result code",s.sqlite3_js_rc_str(U))}finally{o.dealloc(I)}},s.sqlite3_js_vfs_create_file=function(l,_,u,I){r.warn("sqlite3_js_vfs_create_file() is deprecated and","should be avoided because it can lead to C-level crashes.","See its documentation for alternative options.");let U;u?(o.isPtr(u)?U=u:u instanceof ArrayBuffer&&(u=new Uint8Array(u)),u instanceof Uint8Array?(U=o.allocFromTypedArray(u),(arguments.length<4||!y.isInt32(I)||I<0)&&(I=u.byteLength)):O.toss("Invalid 3rd argument type for sqlite3_js_vfs_create_file().")):U=0,(!y.isInt32(I)||I<0)&&(o.dealloc(U),O.toss("Invalid 4th argument for sqlite3_js_vfs_create_file()."));try{const ee=y.sqlite3__wasm_vfs_create_file(l,_,U,I);ee&&O.toss("Creation of file failed with sqlite3 result code",s.sqlite3_js_rc_str(ee))}finally{o.dealloc(U)}},s.sqlite3_js_sql_to_string=l=>{if(typeof l=="string")return l;const _=c(v);return _===v?void 0:_},y.isUIThread()){const l=function(_){const u=Object.create(null);return u.prefix="kvvfs-"+_,u.stores=[],(_==="session"||_==="")&&u.stores.push(globalThis.sessionStorage),(_==="local"||_==="")&&u.stores.push(globalThis.localStorage),u};s.sqlite3_js_kvvfs_clear=function(_=""){let u=0;const I=l(_);return I.stores.forEach(U=>{const ee=[];let ne;for(ne=0;ne<U.length;++ne){const re=U.key(ne);re.startsWith(I.prefix)&&ee.push(re)}ee.forEach(re=>U.removeItem(re)),u+=ee.length}),u},s.sqlite3_js_kvvfs_size=function(_=""){let u=0;const I=l(_);return I.stores.forEach(U=>{let ee;for(ee=0;ee<U.length;++ee){const ne=U.key(ee);ne.startsWith(I.prefix)&&(u+=ne.length,u+=U.getItem(ne).length)}}),u*2}}s.sqlite3_db_config=(function(l,_,...u){switch(_){case s.SQLITE_DBCONFIG_ENABLE_FKEY:case s.SQLITE_DBCONFIG_ENABLE_TRIGGER:case s.SQLITE_DBCONFIG_ENABLE_FTS3_TOKENIZER:case s.SQLITE_DBCONFIG_ENABLE_LOAD_EXTENSION:case s.SQLITE_DBCONFIG_NO_CKPT_ON_CLOSE:case s.SQLITE_DBCONFIG_ENABLE_QPSG:case s.SQLITE_DBCONFIG_TRIGGER_EQP:case s.SQLITE_DBCONFIG_RESET_DATABASE:case s.SQLITE_DBCONFIG_DEFENSIVE:case s.SQLITE_DBCONFIG_WRITABLE_SCHEMA:case s.SQLITE_DBCONFIG_LEGACY_ALTER_TABLE:case s.SQLITE_DBCONFIG_DQS_DML:case s.SQLITE_DBCONFIG_DQS_DDL:case s.SQLITE_DBCONFIG_ENABLE_VIEW:case s.SQLITE_DBCONFIG_LEGACY_FILE_FORMAT:case s.SQLITE_DBCONFIG_TRUSTED_SCHEMA:case s.SQLITE_DBCONFIG_STMT_SCANSTATUS:case s.SQLITE_DBCONFIG_REVERSE_SCANORDER:case s.SQLITE_DBCONFIG_ENABLE_ATTACH_CREATE:case s.SQLITE_DBCONFIG_ENABLE_ATTACH_WRITE:case s.SQLITE_DBCONFIG_ENABLE_COMMENTS:return this.ip||(this.ip=o.xWrap("sqlite3__wasm_db_config_ip","int",["sqlite3*","int","int","*"])),this.ip(l,_,u[0],u[1]||0);case s.SQLITE_DBCONFIG_LOOKASIDE:return this.pii||(this.pii=o.xWrap("sqlite3__wasm_db_config_pii","int",["sqlite3*","int","*","int","int"])),this.pii(l,_,u[0],u[1],u[2]);case s.SQLITE_DBCONFIG_MAINDBNAME:return this.s||(this.s=o.xWrap("sqlite3__wasm_db_config_s","int",["sqlite3*","int","string:static"])),this.s(l,_,u[0]);default:return s.SQLITE_MISUSE}}).bind(Object.create(null)),s.sqlite3_value_to_js=function(l,_=!0){let u;const I=s.sqlite3_value_type(l);switch(I){case s.SQLITE_INTEGER:o.bigIntEnabled?(u=s.sqlite3_value_int64(l),y.bigIntFitsDouble(u)&&(u=Number(u))):u=s.sqlite3_value_double(l);break;case s.SQLITE_FLOAT:u=s.sqlite3_value_double(l);break;case s.SQLITE_TEXT:u=s.sqlite3_value_text(l);break;case s.SQLITE_BLOB:{const U=s.sqlite3_value_bytes(l),ee=s.sqlite3_value_blob(l);U&&!ee&&m.WasmAllocError.toss("Cannot allocate memory for blob argument of",U,"byte(s)"),u=U?o.heap8u().slice(ee,ee+Number(U)):null;break}case s.SQLITE_NULL:u=null;break;default:_&&R(s.SQLITE_MISMATCH,"Unhandled sqlite3_value_type():",I),u=void 0}return u},s.sqlite3_values_to_js=function(l,_,u=!0){let I;const U=[];for(I=0;I<l;++I)U.push(s.sqlite3_value_to_js(o.peekPtr(_+o.ptrSizeof*I),u));return U},s.sqlite3_result_error_js=function(l,_){_ instanceof d?s.sqlite3_result_error_nomem(l):s.sqlite3_result_error(l,""+_,-1)},s.sqlite3_result_js=function(l,_){if(_ instanceof Error){s.sqlite3_result_error_js(l,_);return}try{switch(typeof _){case"undefined":break;case"boolean":s.sqlite3_result_int(l,_?1:0);break;case"bigint":y.bigIntFits32(_)?s.sqlite3_result_int(l,Number(_)):y.bigIntFitsDouble(_)?s.sqlite3_result_double(l,Number(_)):o.bigIntEnabled?y.bigIntFits64(_)?s.sqlite3_result_int64(l,_):R("BigInt value",_.toString(),"is too BigInt for int64."):R("BigInt value",_.toString(),"is too BigInt.");break;case"number":{let u;y.isInt32(_)?u=s.sqlite3_result_int:o.bigIntEnabled&&Number.isInteger(_)&&y.bigIntFits64(BigInt(_))?u=s.sqlite3_result_int64:u=s.sqlite3_result_double,u(l,_);break}case"string":{const[u,I]=o.allocCString(_,!0);s.sqlite3_result_text(l,u,I,s.SQLITE_WASM_DEALLOC);break}case"object":if(_===null){s.sqlite3_result_null(l);break}else if(y.isBindableTypedArray(_)){const u=o.allocFromTypedArray(_);s.sqlite3_result_blob(l,u,_.byteLength,s.SQLITE_WASM_DEALLOC);break}default:R("Don't not how to handle this UDF result value:",typeof _,_)}}catch(u){s.sqlite3_result_error_js(l,u)}},s.sqlite3_column_js=function(l,_,u=!0){const I=s.sqlite3_column_value(l,_);return I===0?void 0:s.sqlite3_value_to_js(I,u)};const f=(function(l,_,u){u=s[u],this.ptr?o.pokePtr(this.ptr,0):this.ptr=o.allocPtr();const I=u(l,_,this.ptr);if(I)return O.toss(I,arguments[2]+"() failed with code "+I);const U=o.peekPtr(this.ptr);return U?s.sqlite3_value_to_js(U,!0):void 0}).bind(Object.create(null));s.sqlite3_preupdate_new_js=(l,_)=>f(l,_,"sqlite3_preupdate_new"),s.sqlite3_preupdate_old_js=(l,_)=>f(l,_,"sqlite3_preupdate_old"),s.sqlite3changeset_new_js=(l,_)=>f(l,_,"sqlite3changeset_new"),s.sqlite3changeset_old_js=(l,_)=>f(l,_,"sqlite3changeset_old");const m={WasmAllocError:d,SQLite3Error:O,capi:s,util:y,wasm:o,config:r,version:Object.create(null),client:void 0,asyncPostInit:async function l(){if(l.isReady instanceof Promise)return l.isReady;let _=t.initializersAsync;delete t.initializersAsync;const u=async()=>(m.__isUnderTest||(delete m.util,delete m.StructBinder),m),I=ee=>{throw r.error("an async sqlite3 initializer failed:",ee),ee};if(!_||!_.length)return l.isReady=u().catch(I);_=_.map(ee=>ee instanceof Function?async ne=>ee(m):ee),_.push(u);let U=Promise.resolve(m);for(;_.length;)U=U.then(_.shift());return l.isReady=U.catch(I)},scriptInfo:void 0};try{t.initializers.forEach(l=>{l(m)})}catch(l){throw console.error("sqlite3 bootstrap initializer threw:",l),l}return delete t.initializers,t.sqlite3=m,m},globalThis.sqlite3ApiBootstrap.initializers=[],globalThis.sqlite3ApiBootstrap.initializersAsync=[],globalThis.sqlite3ApiBootstrap.defaultConfig=Object.create(null),globalThis.sqlite3ApiBootstrap.sqlite3=void 0,globalThis.WhWasmUtilInstaller=function(t){t.bigIntEnabled===void 0&&(t.bigIntEnabled=!!globalThis.BigInt64Array);const n=(...c)=>{throw new Error(c.join(" "))};t.exports||Object.defineProperty(t,"exports",{enumerable:!0,configurable:!0,get:()=>t.instance&&t.instance.exports});const r=t.pointerIR||"i32",s=t.ptrSizeof=r==="i32"?4:r==="i64"?8:n("Unhandled ptrSizeof:",r),o=Object.create(null);o.heapSize=0,o.memory=null,o.freeFuncIndexes=[],o.scopedAlloc=[],o.utf8Decoder=new TextDecoder,o.utf8Encoder=new TextEncoder("utf-8"),t.sizeofIR=c=>{switch(c){case"i8":return 1;case"i16":return 2;case"i32":case"f32":case"float":return 4;case"i64":case"f64":case"double":return 8;case"*":return s;default:return(""+c).endsWith("*")?s:void 0}};const p=function(){if(!o.memory)o.memory=t.memory instanceof WebAssembly.Memory?t.memory:t.exports.memory;else if(o.heapSize===o.memory.buffer.byteLength)return o;const c=o.memory.buffer;return o.HEAP8=new Int8Array(c),o.HEAP8U=new Uint8Array(c),o.HEAP16=new Int16Array(c),o.HEAP16U=new Uint16Array(c),o.HEAP32=new Int32Array(c),o.HEAP32U=new Uint32Array(c),t.bigIntEnabled&&(o.HEAP64=new BigInt64Array(c),o.HEAP64U=new BigUint64Array(c)),o.HEAP32F=new Float32Array(c),o.HEAP64F=new Float64Array(c),o.heapSize=c.byteLength,o};t.heap8=()=>p().HEAP8,t.heap8u=()=>p().HEAP8U,t.heap16=()=>p().HEAP16,t.heap16u=()=>p().HEAP16U,t.heap32=()=>p().HEAP32,t.heap32u=()=>p().HEAP32U,t.heapForSize=function(c,d=!0){const y=o.memory&&o.heapSize===o.memory.buffer.byteLength?o:p();switch(c){case Int8Array:return y.HEAP8;case Uint8Array:return y.HEAP8U;case Int16Array:return y.HEAP16;case Uint16Array:return y.HEAP16U;case Int32Array:return y.HEAP32;case Uint32Array:return y.HEAP32U;case 8:return d?y.HEAP8U:y.HEAP8;case 16:return d?y.HEAP16U:y.HEAP16;case 32:return d?y.HEAP32U:y.HEAP32;case 64:if(y.HEAP64)return d?y.HEAP64U:y.HEAP64;break;default:if(t.bigIntEnabled){if(c===globalThis.BigUint64Array)return y.HEAP64U;if(c===globalThis.BigInt64Array)return y.HEAP64;break}}n("Invalid heapForSize() size: expecting 8, 16, 32,","or (if BigInt is enabled) 64.")},t.functionTable=function(){return t.exports.__indirect_function_table},t.functionEntry=function(c){const d=t.functionTable();return c<d.length?d.get(c):void 0},t.jsFuncToWasm=function c(d,y){if(c._||(c._={sigTypes:Object.assign(Object.create(null),{i:"i32",p:"i32",P:"i32",s:"i32",j:"i64",f:"f32",d:"f64"}),typeCodes:Object.assign(Object.create(null),{f64:124,f32:125,i64:126,i32:127}),uleb128Encode:function(m,l,_){_<128?m[l](_):m[l](_%128|128,_>>7)},rxJSig:/^(\w)\((\w*)\)$/,sigParams:function(m){const l=c._.rxJSig.exec(m);return l?l[2]:m.substr(1)},letterType:m=>c._.sigTypes[m]||n("Invalid signature letter:",m),pushSigType:(m,l)=>m.push(c._.typeCodes[c._.letterType(l)])}),typeof d=="string"){const m=y;y=d,d=m}const B=c._.sigParams(y),f=[1,96];c._.uleb128Encode(f,"push",B.length);for(const m of B)c._.pushSigType(f,m);return y[0]==="v"?f.push(0):(f.push(1),c._.pushSigType(f,y[0])),c._.uleb128Encode(f,"unshift",f.length),f.unshift(0,97,115,109,1,0,0,0,1),f.push(2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0),new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array(f)),{e:{f:d}}).exports.f};const g=function(d,y,B){if(B&&!o.scopedAlloc.length&&n("No scopedAllocPush() scope is active."),typeof d=="string"){const _=y;y=d,d=_}(typeof y!="string"||!(d instanceof Function))&&n("Invalid arguments: expecting (function,signature) or (signature,function).");const f=t.functionTable(),m=f.length;let l;for(;o.freeFuncIndexes.length&&(l=o.freeFuncIndexes.pop(),f.get(l));){l=null;continue}l||(l=m,f.grow(1));try{return f.set(l,d),B&&o.scopedAlloc[o.scopedAlloc.length-1].push(l),l}catch(_){if(!(_ instanceof TypeError))throw l===m&&o.freeFuncIndexes.push(m),_}try{const _=t.jsFuncToWasm(d,y);f.set(l,_),B&&o.scopedAlloc[o.scopedAlloc.length-1].push(l)}catch(_){throw l===m&&o.freeFuncIndexes.push(m),_}return l};t.installFunction=(c,d)=>g(c,d,!1),t.scopedInstallFunction=(c,d)=>g(c,d,!0),t.uninstallFunction=function(c){if(!c&&c!==0)return;const d=o.freeFuncIndexes,y=t.functionTable();d.push(c);const B=y.get(c);return y.set(c,null),B},t.peek=function(d,y="i8"){y.endsWith("*")&&(y=r);const B=o.memory&&o.heapSize===o.memory.buffer.byteLength?o:p(),f=Array.isArray(d)?[]:void 0;let m;do{switch(f&&(d=arguments[0].shift()),y){case"i1":case"i8":m=B.HEAP8[d>>0];break;case"i16":m=B.HEAP16[d>>1];break;case"i32":m=B.HEAP32[d>>2];break;case"float":case"f32":m=B.HEAP32F[d>>2];break;case"double":case"f64":m=Number(B.HEAP64F[d>>3]);break;case"i64":if(t.bigIntEnabled){m=BigInt(B.HEAP64[d>>3]);break}default:n("Invalid type for peek():",y)}f&&f.push(m)}while(f&&arguments[0].length);return f||m},t.poke=function(c,d,y="i8"){y.endsWith("*")&&(y=r);const B=o.memory&&o.heapSize===o.memory.buffer.byteLength?o:p();for(const f of Array.isArray(c)?c:[c])switch(y){case"i1":case"i8":B.HEAP8[f>>0]=d;continue;case"i16":B.HEAP16[f>>1]=d;continue;case"i32":B.HEAP32[f>>2]=d;continue;case"float":case"f32":B.HEAP32F[f>>2]=d;continue;case"double":case"f64":B.HEAP64F[f>>3]=d;continue;case"i64":if(B.HEAP64){B.HEAP64[f>>3]=BigInt(d);continue}default:n("Invalid type for poke(): "+y)}return this},t.peekPtr=(...c)=>t.peek(c.length===1?c[0]:c,r),t.pokePtr=(c,d=0)=>t.poke(c,d,r),t.peek8=(...c)=>t.peek(c.length===1?c[0]:c,"i8"),t.poke8=(c,d)=>t.poke(c,d,"i8"),t.peek16=(...c)=>t.peek(c.length===1?c[0]:c,"i16"),t.poke16=(c,d)=>t.poke(c,d,"i16"),t.peek32=(...c)=>t.peek(c.length===1?c[0]:c,"i32"),t.poke32=(c,d)=>t.poke(c,d,"i32"),t.peek64=(...c)=>t.peek(c.length===1?c[0]:c,"i64"),t.poke64=(c,d)=>t.poke(c,d,"i64"),t.peek32f=(...c)=>t.peek(c.length===1?c[0]:c,"f32"),t.poke32f=(c,d)=>t.poke(c,d,"f32"),t.peek64f=(...c)=>t.peek(c.length===1?c[0]:c,"f64"),t.poke64f=(c,d)=>t.poke(c,d,"f64"),t.getMemValue=t.peek,t.getPtrValue=t.peekPtr,t.setMemValue=t.poke,t.setPtrValue=t.pokePtr,t.isPtr32=c=>typeof c=="number"&&c===(c|0)&&c>=0,t.isPtr=t.isPtr32,t.cstrlen=function(c){if(!c||!t.isPtr(c))return null;const d=p().HEAP8U;let y=c;for(;d[y]!==0;++y);return y-c};const O=typeof SharedArrayBuffer>"u"?function(){}:SharedArrayBuffer,R=function(c,d,y){return o.utf8Decoder.decode(c.buffer instanceof O?c.slice(d,y):c.subarray(d,y))};t.cstrToJs=function(c){const d=t.cstrlen(c);return d?R(p().HEAP8U,c,c+d):d===null?d:""},t.jstrlen=function(c){if(typeof c!="string")return null;const d=c.length;let y=0;for(let B=0;B<d;++B){let f=c.charCodeAt(B);f>=55296&&f<=57343&&(f=65536+((f&1023)<<10)|c.charCodeAt(++B)&1023),f<=127?++y:f<=2047?y+=2:f<=65535?y+=3:y+=4}return y},t.jstrcpy=function(c,d,y=0,B=-1,f=!0){if((!d||!(d instanceof Int8Array)&&!(d instanceof Uint8Array))&&n("jstrcpy() target must be an Int8Array or Uint8Array."),B<0&&(B=d.length-y),!(B>0)||!(y>=0))return 0;let m=0,l=c.length;const _=y,u=y+B-(f?1:0);for(;m<l&&y<u;++m){let I=c.charCodeAt(m);if(I>=55296&&I<=57343&&(I=65536+((I&1023)<<10)|c.charCodeAt(++m)&1023),I<=127){if(y>=u)break;d[y++]=I}else if(I<=2047){if(y+1>=u)break;d[y++]=192|I>>6,d[y++]=128|I&63}else if(I<=65535){if(y+2>=u)break;d[y++]=224|I>>12,d[y++]=128|I>>6&63,d[y++]=128|I&63}else{if(y+3>=u)break;d[y++]=240|I>>18,d[y++]=128|I>>12&63,d[y++]=128|I>>6&63,d[y++]=128|I&63}}return f&&(d[y++]=0),y-_},t.cstrncpy=function(c,d,y){if((!c||!d)&&n("cstrncpy() does not accept NULL strings."),y<0)y=t.cstrlen(strPtr)+1;else if(!(y>0))return 0;const B=t.heap8u();let f=0,m;for(;f<y&&(m=B[d+f]);++f)B[c+f]=m;return f<y&&(B[c+f++]=0),f},t.jstrToUintArray=(c,d=!1)=>o.utf8Encoder.encode(d?c+"\0":c);const z=(c,d)=>{(!(c.alloc instanceof Function)||!(c.dealloc instanceof Function))&&n("Object is missing alloc() and/or dealloc() function(s)","required by",d+"().")},W=function(c,d,y,B){if(z(t,B),typeof c!="string")return null;{const f=o.utf8Encoder.encode(c),m=y(f.length+1),l=p().HEAP8U;return l.set(f,m),l[m+f.length]=0,d?[m,f.length]:m}};t.allocCString=(c,d=!1)=>W(c,d,t.alloc,"allocCString()"),t.scopedAllocPush=function(){z(t,"scopedAllocPush");const c=[];return o.scopedAlloc.push(c),c},t.scopedAllocPop=function(c){z(t,"scopedAllocPop");const d=arguments.length?o.scopedAlloc.indexOf(c):o.scopedAlloc.length-1;d<0&&n("Invalid state object for scopedAllocPop()."),arguments.length===0&&(c=o.scopedAlloc[d]),o.scopedAlloc.splice(d,1);for(let y;y=c.pop();)t.functionEntry(y)?t.uninstallFunction(y):t.dealloc(y)},t.scopedAlloc=function(c){o.scopedAlloc.length||n("No scopedAllocPush() scope is active.");const d=t.alloc(c);return o.scopedAlloc[o.scopedAlloc.length-1].push(d),d},Object.defineProperty(t.scopedAlloc,"level",{configurable:!1,enumerable:!1,get:()=>o.scopedAlloc.length,set:()=>n("The 'active' property is read-only.")}),t.scopedAllocCString=(c,d=!1)=>W(c,d,t.scopedAlloc,"scopedAllocCString()");const T=function(c,d){const y=t[c?"scopedAlloc":"alloc"]((d.length+1)*t.ptrSizeof);let B=0;return d.forEach(f=>{t.pokePtr(y+t.ptrSizeof*B++,t[c?"scopedAllocCString":"allocCString"](""+f))}),t.pokePtr(y+t.ptrSizeof*B,0),y};t.scopedAllocMainArgv=c=>T(!0,c),t.allocMainArgv=c=>T(!1,c),t.cArgvToJs=(c,d)=>{const y=[];for(let B=0;B<c;++B){const f=t.peekPtr(d+t.ptrSizeof*B);y.push(f?t.cstrToJs(f):null)}return y},t.scopedAllocCall=function(c){t.scopedAllocPush();try{return c()}finally{t.scopedAllocPop()}};const A=function(c,d,y){z(t,y);const B=d?"i64":r;let f=t[y](c*(d?8:s));if(t.poke(f,0,B),c===1)return f;const m=[f];for(let l=1;l<c;++l)f+=d?8:s,m[l]=f,t.poke(f,0,B);return m};t.allocPtr=(c=1,d=!0)=>A(c,d,"alloc"),t.scopedAllocPtr=(c=1,d=!0)=>A(c,d,"scopedAlloc"),t.xGet=function(c){return t.exports[c]||n("Cannot find exported symbol:",c)};const D=(c,d)=>n(c+"() requires",d,"argument(s).");t.xCall=function(c,...d){const y=c instanceof Function?c:t.xGet(c);return y instanceof Function||n("Exported symbol",c,"is not a function."),y.length!==d.length&&D(y===c?y.name:c,y.length),arguments.length===2&&Array.isArray(arguments[1])?y.apply(null,arguments[1]):y.apply(null,d)},o.xWrap=Object.create(null),o.xWrap.convert=Object.create(null),o.xWrap.convert.arg=new Map,o.xWrap.convert.result=new Map;const q=o.xWrap.convert.arg,w=o.xWrap.convert.result;t.bigIntEnabled&&q.set("i64",c=>BigInt(c));const x=r==="i32"?c=>c|0:c=>BigInt(c)|BigInt(0);q.set("i32",x).set("i16",c=>(c|0)&65535).set("i8",c=>(c|0)&255).set("f32",c=>Number(c).valueOf()).set("float",q.get("f32")).set("f64",q.get("f32")).set("double",q.get("f64")).set("int",q.get("i32")).set("null",c=>c).set(null,q.get("null")).set("**",x).set("*",x),w.set("*",x).set("pointer",x).set("number",c=>Number(c)).set("void",c=>{}).set("null",c=>c).set(null,w.get("null"));{const c=["i8","i16","i32","int","f32","float","f64","double"];t.bigIntEnabled&&c.push("i64");const d=q.get(r);for(const y of c)q.set(y+"*",d),w.set(y+"*",d),w.set(y,q.get(y)||n("Missing arg converter:",y))}const N=function(c){return typeof c=="string"?t.scopedAllocCString(c):c?x(c):null};q.set("string",N).set("utf8",N).set("pointer",N),w.set("string",c=>t.cstrToJs(c)).set("utf8",w.get("string")).set("string:dealloc",c=>{try{return c?t.cstrToJs(c):null}finally{t.dealloc(c)}}).set("utf8:dealloc",w.get("string:dealloc")).set("json",c=>JSON.parse(t.cstrToJs(c))).set("json:dealloc",c=>{try{return c?JSON.parse(t.cstrToJs(c)):null}finally{t.dealloc(c)}});const P=class{constructor(c){this.name=c.name||"unnamed adapter"}convertArg(c,d,y){n("AbstractArgAdapter must be subclassed.")}};q.FuncPtrAdapter=class Ae extends P{constructor(d){super(d),q.FuncPtrAdapter.warnOnUse&&console.warn("xArg.FuncPtrAdapter is an internal-only API","and is not intended to be invoked from","client-level code. Invoked with:",d),this.name=d.name||"unnamed",this.signature=d.signature,d.contextKey instanceof Function&&(this.contextKey=d.contextKey,d.bindScope||(d.bindScope="context")),this.bindScope=d.bindScope||n("FuncPtrAdapter options requires a bindScope (explicit or implied)."),Ae.bindScopes.indexOf(d.bindScope)<0&&n("Invalid options.bindScope ("+d.bindMod+") for FuncPtrAdapter. Expecting one of: ("+Ae.bindScopes.join(", ")+")"),this.isTransient=this.bindScope==="transient",this.isContext=this.bindScope==="context",this.isPermanent=this.bindScope==="permanent",this.singleton=this.bindScope==="singleton"?[]:void 0,this.callProxy=d.callProxy instanceof Function?d.callProxy:void 0}contextKey(d,y){return this}contextMap(d){const y=this.__cmap||(this.__cmap=new Map);let B=y.get(d);return B===void 0&&y.set(d,B=[]),B}convertArg(d,y,B){let f=this.singleton;if(!f&&this.isContext&&(f=this.contextMap(this.contextKey(y,B))),f&&f[0]===d)return f[1];if(d instanceof Function){this.callProxy&&(d=this.callProxy(d));const m=g(d,this.signature,this.isTransient);if(Ae.debugFuncInstall&&Ae.debugOut("FuncPtrAdapter installed",this,this.contextKey(y,B),"@"+m,d),f){if(f[1]){Ae.debugFuncInstall&&Ae.debugOut("FuncPtrAdapter uninstalling",this,this.contextKey(y,B),"@"+f[1],d);try{o.scopedAlloc[o.scopedAlloc.length-1].push(f[1])}catch{}}f[0]=d,f[1]=m}return m}else if(t.isPtr(d)||d===null||d===void 0){if(f&&f[1]&&f[1]!==d){Ae.debugFuncInstall&&Ae.debugOut("FuncPtrAdapter uninstalling",this,this.contextKey(y,B),"@"+f[1],d);try{o.scopedAlloc[o.scopedAlloc.length-1].push(f[1])}catch{}f[0]=f[1]=d|0}return d||0}else throw new TypeError("Invalid FuncPtrAdapter argument type. Expecting a function pointer or a "+(this.name?this.name+" ":"")+"function matching signature "+this.signature+".")}},q.FuncPtrAdapter.warnOnUse=!1,q.FuncPtrAdapter.debugFuncInstall=!1,q.FuncPtrAdapter.debugOut=console.debug.bind(console),q.FuncPtrAdapter.bindScopes=["transient","context","singleton","permanent"];const S=c=>q.get(c)||n("Argument adapter not found:",c),L=c=>w.get(c)||n("Result adapter not found:",c);o.xWrap.convertArg=(c,...d)=>S(c)(...d),o.xWrap.convertArgNoCheck=(c,...d)=>q.get(c)(...d),o.xWrap.convertResult=(c,d)=>c===null?d:c?L(c)(d):void 0,o.xWrap.convertResultNoCheck=(c,d)=>c===null?d:c?w.get(c)(d):void 0,t.xWrap=function(c,d,...y){arguments.length===3&&Array.isArray(arguments[2])&&(y=arguments[2]),t.isPtr(c)&&(c=t.functionEntry(c)||n("Function pointer not found in WASM function table."));const B=c instanceof Function,f=B?c:t.xGet(c);if(B&&(c=f.name||"unnamed function"),y.length!==f.length&&D(c,f.length),d===null&&f.length===0)return f;d!=null&&L(d);for(const l of y)l instanceof P?q.set(l,(..._)=>l.convertArg(..._)):S(l);const m=o.xWrap;return f.length===0?(...l)=>l.length?D(c,f.length):m.convertResult(d,f.call(null)):function(...l){l.length!==f.length&&D(c,f.length);const _=t.scopedAllocPush();try{let u=0;for(;u<l.length;++u)l[u]=m.convertArgNoCheck(y[u],l[u],l,u);return m.convertResultNoCheck(d,f.apply(null,l))}finally{t.scopedAllocPop(_)}}};const $=function(c,d,y,B,f,m){if(typeof y=="string"){if(d===1)return m.get(y);if(d===2){if(B)B instanceof Function||n(f,"requires a function argument.");else return m.delete(y),c;return m.set(y,B),c}}n("Invalid arguments to",f)};return t.xWrap.resultAdapter=function c(d,y){return $(c,arguments.length,d,y,"resultAdapter()",w)},t.xWrap.argAdapter=function c(d,y){return $(c,arguments.length,d,y,"argAdapter()",q)},t.xWrap.FuncPtrAdapter=q.FuncPtrAdapter,t.xCallWrapped=function(c,d,y,...B){return Array.isArray(arguments[3])&&(B=arguments[3]),t.xWrap(c,d,y||[]).apply(null,B||[])},t.xWrap.testConvertArg=o.xWrap.convertArg,t.xWrap.testConvertResult=o.xWrap.convertResult,t},globalThis.WhWasmUtilInstaller.yawl=(function(t){const n=()=>fetch(t.uri,{credentials:"same-origin"}),r=this,s=function(p){if(t.wasmUtilTarget){const g=(...R)=>{throw new Error(R.join(" "))},O=t.wasmUtilTarget;if(O.module=p.module,O.instance=p.instance,O.instance.exports.memory||(O.memory=t.imports&&t.imports.env&&t.imports.env.memory||g("Missing 'memory' object!")),!O.alloc&&p.instance.exports.malloc){const R=p.instance.exports;O.alloc=function(z){return R.malloc(z)||g("Allocation of",z,"bytes failed.")},O.dealloc=function(z){R.free(z)}}r(O)}return t.onload&&t.onload(p,t),p};return WebAssembly.instantiateStreaming?function(){return WebAssembly.instantiateStreaming(n(),t.imports||{}).then(s)}:function(){return n().then(g=>g.arrayBuffer()).then(g=>WebAssembly.instantiate(g,t.imports||{})).then(s)}}).bind(globalThis.WhWasmUtilInstaller),globalThis.Jaccwabyt=function t(n){const r=(...F)=>{throw new Error(F.join(" "))};!(n.heap instanceof WebAssembly.Memory)&&!(n.heap instanceof Function)&&r("config.heap must be WebAssembly.Memory instance or a function."),["alloc","dealloc"].forEach(function(F){n[F]instanceof Function||r("Config option '"+F+"' must be a function.")});const s=t,o=n.heap instanceof Function?n.heap:()=>new Uint8Array(n.heap.buffer),p=n.alloc,g=n.dealloc,O=n.log||console.log.bind(console),R=n.memberPrefix||"",z=n.memberSuffix||"",W=n.bigIntEnabled===void 0?!!globalThis.BigInt64Array:!!n.bigIntEnabled,T=globalThis.BigInt,A=globalThis.BigInt64Array,D=n.ptrSizeof||4,q=n.ptrIR||"i32";s.debugFlags||(s.__makeDebugFlags=function(F=null){F&&F.__flags&&(F=F.__flags);const V=function K(X){return arguments.length===0?K.__flags:(X<0?(delete K.__flags.getter,delete K.__flags.setter,delete K.__flags.alloc,delete K.__flags.dealloc):(K.__flags.getter=(1&X)!==0,K.__flags.setter=(2&X)!==0,K.__flags.alloc=(4&X)!==0,K.__flags.dealloc=(8&X)!==0),K._flags)};return Object.defineProperty(V,"__flags",{iterable:!1,writable:!1,value:Object.create(F)}),F||V(0),V},s.debugFlags=s.__makeDebugFlags());const w=(function(){const F=new ArrayBuffer(2);return new DataView(F).setInt16(0,256,!0),new Int16Array(F)[0]===256})(),x=F=>F[1]==="(",N=F=>F==="P",P=F=>x(F)?"p":F[0],S=function(F){switch(P(F)){case"c":case"C":return"i8";case"i":return"i32";case"p":case"P":case"s":return q;case"j":return"i64";case"f":return"float";case"d":return"double"}r("Unhandled signature IR:",F)},L=A?()=>!0:()=>r("BigInt64Array is not available."),$=function(F){switch(P(F)){case"p":case"P":case"s":{switch(D){case 4:return"getInt32";case 8:return L()&&"getBigInt64"}break}case"i":return"getInt32";case"c":return"getInt8";case"C":return"getUint8";case"j":return L()&&"getBigInt64";case"f":return"getFloat32";case"d":return"getFloat64"}r("Unhandled DataView getter for signature:",F)},c=function(F){switch(P(F)){case"p":case"P":case"s":{switch(D){case 4:return"setInt32";case 8:return L()&&"setBigInt64"}break}case"i":return"setInt32";case"c":return"setInt8";case"C":return"setUint8";case"j":return L()&&"setBigInt64";case"f":return"setFloat32";case"d":return"setFloat64"}r("Unhandled DataView setter for signature:",F)},d=function(F){switch(P(F)){case"i":case"f":case"c":case"C":case"d":return Number;case"j":return L()&&T;case"p":case"P":case"s":switch(D){case 4:return Number;case 8:return L()&&T}break}r("Unhandled DataView set wrapper for signature:",F)},y=(F,V)=>F+"::"+V,B=function(F,V){return()=>r(y(F,V),"is read-only.")},f=new WeakMap,m="(pointer-is-external)",l=function(F,V,K){if(K||(K=f.get(V)),K){if(f.delete(V),Array.isArray(V.ondispose)){let X;for(;X=V.ondispose.shift();)try{X instanceof Function?X.call(V):X instanceof te?X.dispose():typeof X=="number"&&g(X)}catch(ae){console.warn("ondispose() for",F.structName,"@",K,"threw. NOT propagating it.",ae)}}else if(V.ondispose instanceof Function)try{V.ondispose()}catch(X){console.warn("ondispose() for",F.structName,"@",K,"threw. NOT propagating it.",X)}delete V.ondispose,F.debugFlags.__flags.dealloc&&O("debug.dealloc:",V[m]?"EXTERNAL":"",F.structName,"instance:",F.structInfo.sizeof,"bytes @"+K),V[m]||g(K)}},_=F=>({configurable:!1,writable:!1,iterable:!1,value:F}),u=function(F,V,K){let X=!K;K?Object.defineProperty(V,m,_(K)):(K=p(F.structInfo.sizeof),K||r("Allocation of",F.structName,"structure failed."));try{F.debugFlags.__flags.alloc&&O("debug.alloc:",X?"":"EXTERNAL",F.structName,"instance:",F.structInfo.sizeof,"bytes @"+K),X&&o().fill(0,K,K+F.structInfo.sizeof),f.set(V,K)}catch(ae){throw l(F,V,K),ae}},I=function(){const F=this.pointer;return F?new Uint8Array(o().slice(F,F+this.structInfo.sizeof)):null},ee=_(F=>R+F+z),ne=function(F,V,K=!0){let X=F.members[V];if(!X&&(R||z)){for(const ae of Object.values(F.members))if(ae.key===V){X=ae;break}!X&&K&&r(y(F.name,V),"is not a mapped struct member.")}return X},re=function F(V,K,X=!1){F._||(F._=de=>de.replace(/[^vipPsjrdcC]/g,"").replace(/[pPscC]/g,"i"));const ae=ne(V.structInfo,K,!0);return X?F._(ae.signature):ae.signature},se={configurable:!1,enumerable:!1,get:function(){return f.get(this)},set:()=>r("Cannot assign the 'pointer' property of a struct.")},j=_(function(){const F=[];for(const V of Object.keys(this.structInfo.members))F.push(this.memberKey(V));return F}),b=new TextDecoder("utf-8"),k=new TextEncoder,Q=typeof SharedArrayBuffer>"u"?function(){}:SharedArrayBuffer,H=function(F,V,K){return b.decode(F.buffer instanceof Q?F.slice(V,K):F.subarray(V,K))},Z=function(F,V,K=!1){const X=ne(F.structInfo,V,K);return X&&X.signature.length===1&&X.signature[0]==="s"?X:!1},E=function(F){F.signature!=="s"&&r("Invalid member type signature for C-string value:",JSON.stringify(F))},C=function(V,K){const X=ne(V.structInfo,K,!0);E(X);const ae=V[X.key];if(!ae)return null;let de=ae;const ue=o();for(;ue[de]!==0;++de);return ae===de?"":H(ue,ae,de)},M=function(F,...V){F.ondispose?Array.isArray(F.ondispose)||(F.ondispose=[F.ondispose]):F.ondispose=[],F.ondispose.push(...V)},J=function(F){const V=k.encode(F),K=p(V.length+1);K||r("Allocation error while duplicating string:",F);const X=o();return X.set(V,K),X[K+V.length]=0,K},G=function(F,V,K){const X=ne(F.structInfo,V,!0);E(X);const ae=J(K);return F[X.key]=ae,M(F,ae),F},te=function(V,K){arguments[2]!==_&&r("Do not call the StructType constructor","from client-level code."),Object.defineProperties(this,{structName:_(V),structInfo:_(K)})};te.prototype=Object.create(null,{dispose:_(function(){l(this.constructor,this)}),lookupMember:_(function(F,V=!0){return ne(this.structInfo,F,V)}),memberToJsString:_(function(F){return C(this,F)}),memberIsString:_(function(F,V=!0){return Z(this,F,V)}),memberKey:ee,memberKeys:j,memberSignature:_(function(F,V=!1){return re(this,F,V)}),memoryDump:_(I),pointer:se,setMemberCString:_(function(F,V){return G(this,F,V)})}),Object.assign(te.prototype,{addOnDispose:function(...F){return M(this,...F),this}}),Object.defineProperties(te,{allocCString:_(J),isA:_(F=>F instanceof te),hasExternalPointer:_(F=>F instanceof te&&!!F[m]),memberKey:ee});const oe=F=>Number.isFinite(F)||F instanceof(T||Number),Y=function F(V,K,X){if(!F._){F._={getters:{},setters:{},sw:{}};const me=["i","c","C","p","P","s","f","d","v()"];W&&me.push("j"),me.forEach(function(we){F._.getters[we]=$(we),F._.setters[we]=c(we),F._.sw[we]=d(we)});const Kn=/^[ipPsjfdcC]$/,Jn=/^[vipPsjfdcC]\([ipPsjfdcC]*\)$/;F.sigCheck=function(we,Xn,kt,ot){Object.prototype.hasOwnProperty.call(we,kt)&&r(we.structName,"already has a property named",kt+"."),Kn.test(ot)||Jn.test(ot)||r("Malformed signature for",y(we.structName,Xn)+":",ot)}}const ae=V.memberKey(K);F.sigCheck(V.prototype,K,ae,X.signature),X.key=ae,X.name=K;const de=P(X.signature),ue=y(V.prototype.structName,ae),fe=V.prototype.debugFlags.__flags,Re=Object.create(null);Re.configurable=!1,Re.enumerable=!1,Re.get=function(){fe.getter&&O("debug.getter:",F._.getters[de],"for",S(de),ue,"@",this.pointer,"+",X.offset,"sz",X.sizeof);let me=new DataView(o().buffer,this.pointer+X.offset,X.sizeof)[F._.getters[de]](0,w);return fe.getter&&O("debug.getter:",ue,"result =",me),me},X.readOnly?Re.set=B(V.prototype.structName,ae):Re.set=function(me){if(fe.setter&&O("debug.setter:",F._.setters[de],"for",S(de),ue,"@",this.pointer,"+",X.offset,"sz",X.sizeof,me),this.pointer||r("Cannot set struct property on disposed instance."),me===null)me=0;else for(;!oe(me);){if(N(X.signature)&&me instanceof te){me=me.pointer||0,fe.setter&&O("debug.setter:",ue,"resolved to",me);break}r("Invalid value for pointer-type",ue+".")}new DataView(o().buffer,this.pointer+X.offset,X.sizeof)[F._.setters[de]](0,F._.sw[de](me),w)},Object.defineProperty(V.prototype,ae,Re)},pe=function F(V,K){arguments.length===1?(K=V,V=K.name):K.name||(K.name=V),V||r("Struct name is required.");let X=!1;Object.keys(K.members).forEach(ue=>{const fe=K.members[ue];fe.sizeof?fe.sizeof===1?fe.signature==="c"||fe.signature==="C"||r("Unexpected sizeof==1 member",y(K.name,ue),"with signature",fe.signature):(fe.sizeof%4!==0&&(console.warn("Invalid struct member description =",fe,"from",K),r(V,"member",ue,"sizeof is not aligned. sizeof="+fe.sizeof)),fe.offset%4!==0&&(console.warn("Invalid struct member description =",fe,"from",K),r(V,"member",ue,"offset is not aligned. offset="+fe.offset))):r(V,"member",ue,"is missing sizeof."),(!X||X.offset<fe.offset)&&(X=fe)}),X?K.sizeof<X.offset+X.sizeof&&r("Invalid struct config:",V,"max member offset ("+X.offset+") ","extends past end of struct (sizeof="+K.sizeof+")."):r("No member property descriptions found.");const ae=_(s.__makeDebugFlags(F.debugFlags)),de=function ue(fe){this instanceof ue?arguments.length?((fe!==(fe|0)||fe<=0)&&r("Invalid pointer value for",V,"constructor."),u(ue,this,fe)):u(ue,this):r("The",V,"constructor may only be called via 'new'.")};return Object.defineProperties(de,{debugFlags:ae,isA:_(ue=>ue instanceof de),memberKey:ee,memberKeys:j,methodInfoForKey:_(function(ue){}),structInfo:_(K),structName:_(V)}),de.prototype=new te(V,K,_),Object.defineProperties(de.prototype,{debugFlags:ae,constructor:_(de)}),Object.keys(K.members).forEach(ue=>Y(de,ue,K.members[ue])),de};return pe.StructType=te,pe.config=n,pe.allocCString=J,pe.debugFlags||(pe.debugFlags=s.__makeDebugFlags(s.debugFlags)),pe},globalThis.sqlite3ApiBootstrap.initializers.push(function(t){const n=(...q)=>{throw new Error(q.join(" "))};t.SQLite3Error.toss;const r=t.capi,s=t.wasm,o=t.util;if(globalThis.WhWasmUtilInstaller(s),delete globalThis.WhWasmUtilInstaller,s.bindingSignatures=[["sqlite3_aggregate_context","void*","sqlite3_context*","int"],["sqlite3_bind_double","int","sqlite3_stmt*","int","f64"],["sqlite3_bind_int","int","sqlite3_stmt*","int","int"],["sqlite3_bind_null",void 0,"sqlite3_stmt*","int"],["sqlite3_bind_parameter_count","int","sqlite3_stmt*"],["sqlite3_bind_parameter_index","int","sqlite3_stmt*","string"],["sqlite3_bind_parameter_name","string","sqlite3_stmt*","int"],["sqlite3_bind_pointer","int","sqlite3_stmt*","int","*","string:static","*"],["sqlite3_busy_handler","int",["sqlite3*",new s.xWrap.FuncPtrAdapter({signature:"i(pi)",contextKey:(q,w)=>q[0]}),"*"]],["sqlite3_busy_timeout","int","sqlite3*","int"],["sqlite3_changes","int","sqlite3*"],["sqlite3_clear_bindings","int","sqlite3_stmt*"],["sqlite3_collation_needed","int","sqlite3*","*","*"],["sqlite3_column_blob","*","sqlite3_stmt*","int"],["sqlite3_column_bytes","int","sqlite3_stmt*","int"],["sqlite3_column_count","int","sqlite3_stmt*"],["sqlite3_column_decltype","string","sqlite3_stmt*","int"],["sqlite3_column_double","f64","sqlite3_stmt*","int"],["sqlite3_column_int","int","sqlite3_stmt*","int"],["sqlite3_column_name","string","sqlite3_stmt*","int"],["sqlite3_column_text","string","sqlite3_stmt*","int"],["sqlite3_column_type","int","sqlite3_stmt*","int"],["sqlite3_column_value","sqlite3_value*","sqlite3_stmt*","int"],["sqlite3_commit_hook","void*",["sqlite3*",new s.xWrap.FuncPtrAdapter({name:"sqlite3_commit_hook",signature:"i(p)",contextKey:q=>q[0]}),"*"]],["sqlite3_compileoption_get","string","int"],["sqlite3_compileoption_used","int","string"],["sqlite3_complete","int","string:flexible"],["sqlite3_context_db_handle","sqlite3*","sqlite3_context*"],["sqlite3_data_count","int","sqlite3_stmt*"],["sqlite3_db_filename","string","sqlite3*","string"],["sqlite3_db_handle","sqlite3*","sqlite3_stmt*"],["sqlite3_db_name","string","sqlite3*","int"],["sqlite3_db_readonly","int","sqlite3*","string"],["sqlite3_db_status","int","sqlite3*","int","*","*","int"],["sqlite3_errcode","int","sqlite3*"],["sqlite3_errmsg","string","sqlite3*"],["sqlite3_error_offset","int","sqlite3*"],["sqlite3_errstr","string","int"],["sqlite3_exec","int",["sqlite3*","string:flexible",new s.xWrap.FuncPtrAdapter({signature:"i(pipp)",bindScope:"transient",callProxy:q=>{let w;return(x,N,P,S)=>{try{const L=s.cArgvToJs(N,P);return w||(w=s.cArgvToJs(N,S)),q(L,w)|0}catch(L){return L.resultCode||r.SQLITE_ERROR}}}}),"*","**"]],["sqlite3_expanded_sql","string","sqlite3_stmt*"],["sqlite3_extended_errcode","int","sqlite3*"],["sqlite3_extended_result_codes","int","sqlite3*","int"],["sqlite3_file_control","int","sqlite3*","string","int","*"],["sqlite3_finalize","int","sqlite3_stmt*"],["sqlite3_free",void 0,"*"],["sqlite3_get_autocommit","int","sqlite3*"],["sqlite3_get_auxdata","*","sqlite3_context*","int"],["sqlite3_initialize",void 0],["sqlite3_interrupt",void 0,"sqlite3*"],["sqlite3_is_interrupted","int","sqlite3*"],["sqlite3_keyword_count","int"],["sqlite3_keyword_name","int",["int","**","*"]],["sqlite3_keyword_check","int",["string","int"]],["sqlite3_libversion","string"],["sqlite3_libversion_number","int"],["sqlite3_limit","int",["sqlite3*","int","int"]],["sqlite3_malloc","*","int"],["sqlite3_open","int","string","*"],["sqlite3_open_v2","int","string","*","int","string"],["sqlite3_realloc","*","*","int"],["sqlite3_reset","int","sqlite3_stmt*"],["sqlite3_result_blob",void 0,"sqlite3_context*","*","int","*"],["sqlite3_result_double",void 0,"sqlite3_context*","f64"],["sqlite3_result_error",void 0,"sqlite3_context*","string","int"],["sqlite3_result_error_code",void 0,"sqlite3_context*","int"],["sqlite3_result_error_nomem",void 0,"sqlite3_context*"],["sqlite3_result_error_toobig",void 0,"sqlite3_context*"],["sqlite3_result_int",void 0,"sqlite3_context*","int"],["sqlite3_result_null",void 0,"sqlite3_context*"],["sqlite3_result_pointer",void 0,"sqlite3_context*","*","string:static","*"],["sqlite3_result_subtype",void 0,"sqlite3_value*","int"],["sqlite3_result_text",void 0,"sqlite3_context*","string","int","*"],["sqlite3_result_zeroblob",void 0,"sqlite3_context*","int"],["sqlite3_rollback_hook","void*",["sqlite3*",new s.xWrap.FuncPtrAdapter({name:"sqlite3_rollback_hook",signature:"v(p)",contextKey:q=>q[0]}),"*"]],["sqlite3_set_auxdata",void 0,["sqlite3_context*","int","*","*"]],["sqlite3_shutdown",void 0],["sqlite3_sourceid","string"],["sqlite3_sql","string","sqlite3_stmt*"],["sqlite3_status","int","int","*","*","int"],["sqlite3_step","int","sqlite3_stmt*"],["sqlite3_stmt_busy","int","sqlite3_stmt*"],["sqlite3_stmt_readonly","int","sqlite3_stmt*"],["sqlite3_stmt_status","int","sqlite3_stmt*","int","int"],["sqlite3_strglob","int","string","string"],["sqlite3_stricmp","int","string","string"],["sqlite3_strlike","int","string","string","int"],["sqlite3_strnicmp","int","string","string","int"],["sqlite3_table_column_metadata","int","sqlite3*","string","string","string","**","**","*","*","*"],["sqlite3_total_changes","int","sqlite3*"],["sqlite3_trace_v2","int",["sqlite3*","int",new s.xWrap.FuncPtrAdapter({name:"sqlite3_trace_v2::callback",signature:"i(ippp)",contextKey:(q,w)=>q[0]}),"*"]],["sqlite3_txn_state","int",["sqlite3*","string"]],["sqlite3_uri_boolean","int","sqlite3_filename","string","int"],["sqlite3_uri_key","string","sqlite3_filename","int"],["sqlite3_uri_parameter","string","sqlite3_filename","string"],["sqlite3_user_data","void*","sqlite3_context*"],["sqlite3_value_blob","*","sqlite3_value*"],["sqlite3_value_bytes","int","sqlite3_value*"],["sqlite3_value_double","f64","sqlite3_value*"],["sqlite3_value_dup","sqlite3_value*","sqlite3_value*"],["sqlite3_value_free",void 0,"sqlite3_value*"],["sqlite3_value_frombind","int","sqlite3_value*"],["sqlite3_value_int","int","sqlite3_value*"],["sqlite3_value_nochange","int","sqlite3_value*"],["sqlite3_value_numeric_type","int","sqlite3_value*"],["sqlite3_value_pointer","*","sqlite3_value*","string:static"],["sqlite3_value_subtype","int","sqlite3_value*"],["sqlite3_value_text","string","sqlite3_value*"],["sqlite3_value_type","int","sqlite3_value*"],["sqlite3_vfs_find","*","string"],["sqlite3_vfs_register","int","sqlite3_vfs*","int"],["sqlite3_vfs_unregister","int","sqlite3_vfs*"]],s.exports.sqlite3_progress_handler&&s.bindingSignatures.push(["sqlite3_progress_handler",void 0,["sqlite3*","int",new s.xWrap.FuncPtrAdapter({name:"xProgressHandler",signature:"i(p)",bindScope:"context",contextKey:(q,w)=>q[0]}),"*"]]),s.exports.sqlite3_stmt_explain&&s.bindingSignatures.push(["sqlite3_stmt_explain","int","sqlite3_stmt*","int"],["sqlite3_stmt_isexplain","int","sqlite3_stmt*"]),s.exports.sqlite3_set_authorizer&&s.bindingSignatures.push(["sqlite3_set_authorizer","int",["sqlite3*",new s.xWrap.FuncPtrAdapter({name:"sqlite3_set_authorizer::xAuth",signature:"i(pissss)",contextKey:(q,w)=>q[0],callProxy:q=>(w,x,N,P,S,L)=>{try{return N=N&&s.cstrToJs(N),P=P&&s.cstrToJs(P),S=S&&s.cstrToJs(S),L=L&&s.cstrToJs(L),q(w,x,N,P,S,L)||0}catch($){return $.resultCode||r.SQLITE_ERROR}}}),"*"]]),s.bindingSignatures.int64=[["sqlite3_bind_int64","int",["sqlite3_stmt*","int","i64"]],["sqlite3_changes64","i64",["sqlite3*"]],["sqlite3_column_int64","i64",["sqlite3_stmt*","int"]],["sqlite3_deserialize","int","sqlite3*","string","*","i64","i64","int"],["sqlite3_last_insert_rowid","i64",["sqlite3*"]],["sqlite3_malloc64","*","i64"],["sqlite3_msize","i64","*"],["sqlite3_overload_function","int",["sqlite3*","string","int"]],["sqlite3_realloc64","*","*","i64"],["sqlite3_result_int64",void 0,"*","i64"],["sqlite3_result_zeroblob64","int","*","i64"],["sqlite3_serialize","*","sqlite3*","string","*","int"],["sqlite3_set_last_insert_rowid",void 0,["sqlite3*","i64"]],["sqlite3_status64","int","int","*","*","int"],["sqlite3_total_changes64","i64",["sqlite3*"]],["sqlite3_update_hook","*",["sqlite3*",new s.xWrap.FuncPtrAdapter({name:"sqlite3_update_hook",signature:"v(iippj)",contextKey:q=>q[0],callProxy:q=>(w,x,N,P,S)=>{q(w,x,s.cstrToJs(N),s.cstrToJs(P),S)}}),"*"]],["sqlite3_uri_int64","i64",["sqlite3_filename","string","i64"]],["sqlite3_value_int64","i64","sqlite3_value*"]],s.bigIntEnabled&&s.exports.sqlite3_declare_vtab&&s.bindingSignatures.int64.push(["sqlite3_create_module","int",["sqlite3*","string","sqlite3_module*","*"]],["sqlite3_create_module_v2","int",["sqlite3*","string","sqlite3_module*","*","*"]],["sqlite3_declare_vtab","int",["sqlite3*","string:flexible"]],["sqlite3_drop_modules","int",["sqlite3*","**"]],["sqlite3_vtab_collation","string","sqlite3_index_info*","int"],["sqlite3_vtab_distinct","int","sqlite3_index_info*"],["sqlite3_vtab_in","int","sqlite3_index_info*","int","int"],["sqlite3_vtab_in_first","int","sqlite3_value*","**"],["sqlite3_vtab_in_next","int","sqlite3_value*","**"],["sqlite3_vtab_nochange","int","sqlite3_context*"],["sqlite3_vtab_on_conflict","int","sqlite3*"],["sqlite3_vtab_rhs_value","int","sqlite3_index_info*","int","**"]),s.bigIntEnabled&&s.exports.sqlite3_preupdate_hook&&s.bindingSignatures.int64.push(["sqlite3_preupdate_blobwrite","int","sqlite3*"],["sqlite3_preupdate_count","int","sqlite3*"],["sqlite3_preupdate_depth","int","sqlite3*"],["sqlite3_preupdate_hook","*",["sqlite3*",new s.xWrap.FuncPtrAdapter({name:"sqlite3_preupdate_hook",signature:"v(ppippjj)",contextKey:q=>q[0],callProxy:q=>(w,x,N,P,S,L,$)=>{q(w,x,N,s.cstrToJs(P),s.cstrToJs(S),L,$)}}),"*"]],["sqlite3_preupdate_new","int",["sqlite3*","int","**"]],["sqlite3_preupdate_old","int",["sqlite3*","int","**"]]),s.bigIntEnabled&&s.exports.sqlite3changegroup_add&&s.exports.sqlite3session_create&&s.exports.sqlite3_preupdate_hook){const q={signature:"i(ps)",callProxy:w=>(x,N)=>{try{return w(x,s.cstrToJs(N))|0}catch(P){return P.resultCode||r.SQLITE_ERROR}}};s.bindingSignatures.int64.push(["sqlite3changegroup_add","int",["sqlite3_changegroup*","int","void*"]],["sqlite3changegroup_add_strm","int",["sqlite3_changegroup*",new s.xWrap.FuncPtrAdapter({name:"xInput",signature:"i(ppp)",bindScope:"transient"}),"void*"]],["sqlite3changegroup_delete",void 0,["sqlite3_changegroup*"]],["sqlite3changegroup_new","int",["**"]],["sqlite3changegroup_output","int",["sqlite3_changegroup*","int*","**"]],["sqlite3changegroup_output_strm","int",["sqlite3_changegroup*",new s.xWrap.FuncPtrAdapter({name:"xOutput",signature:"i(ppi)",bindScope:"transient"}),"void*"]],["sqlite3changeset_apply","int",["sqlite3*","int","void*",new s.xWrap.FuncPtrAdapter({name:"xFilter",bindScope:"transient",...q}),new s.xWrap.FuncPtrAdapter({name:"xConflict",signature:"i(pip)",bindScope:"transient"}),"void*"]],["sqlite3changeset_apply_strm","int",["sqlite3*",new s.xWrap.FuncPtrAdapter({name:"xInput",signature:"i(ppp)",bindScope:"transient"}),"void*",new s.xWrap.FuncPtrAdapter({name:"xFilter",bindScope:"transient",...q}),new s.xWrap.FuncPtrAdapter({name:"xConflict",signature:"i(pip)",bindScope:"transient"}),"void*"]],["sqlite3changeset_apply_v2","int",["sqlite3*","int","void*",new s.xWrap.FuncPtrAdapter({name:"xFilter",bindScope:"transient",...q}),new s.xWrap.FuncPtrAdapter({name:"xConflict",signature:"i(pip)",bindScope:"transient"}),"void*","**","int*","int"]],["sqlite3changeset_apply_v2_strm","int",["sqlite3*",new s.xWrap.FuncPtrAdapter({name:"xInput",signature:"i(ppp)",bindScope:"transient"}),"void*",new s.xWrap.FuncPtrAdapter({name:"xFilter",bindScope:"transient",...q}),new s.xWrap.FuncPtrAdapter({name:"xConflict",signature:"i(pip)",bindScope:"transient"}),"void*","**","int*","int"]],["sqlite3changeset_concat","int",["int","void*","int","void*","int*","**"]],["sqlite3changeset_concat_strm","int",[new s.xWrap.FuncPtrAdapter({name:"xInputA",signature:"i(ppp)",bindScope:"transient"}),"void*",new s.xWrap.FuncPtrAdapter({name:"xInputB",signature:"i(ppp)",bindScope:"transient"}),"void*",new s.xWrap.FuncPtrAdapter({name:"xOutput",signature:"i(ppi)",bindScope:"transient"}),"void*"]],["sqlite3changeset_conflict","int",["sqlite3_changeset_iter*","int","**"]],["sqlite3changeset_finalize","int",["sqlite3_changeset_iter*"]],["sqlite3changeset_fk_conflicts","int",["sqlite3_changeset_iter*","int*"]],["sqlite3changeset_invert","int",["int","void*","int*","**"]],["sqlite3changeset_invert_strm","int",[new s.xWrap.FuncPtrAdapter({name:"xInput",signature:"i(ppp)",bindScope:"transient"}),"void*",new s.xWrap.FuncPtrAdapter({name:"xOutput",signature:"i(ppi)",bindScope:"transient"}),"void*"]],["sqlite3changeset_new","int",["sqlite3_changeset_iter*","int","**"]],["sqlite3changeset_next","int",["sqlite3_changeset_iter*"]],["sqlite3changeset_old","int",["sqlite3_changeset_iter*","int","**"]],["sqlite3changeset_op","int",["sqlite3_changeset_iter*","**","int*","int*","int*"]],["sqlite3changeset_pk","int",["sqlite3_changeset_iter*","**","int*"]],["sqlite3changeset_start","int",["**","int","*"]],["sqlite3changeset_start_strm","int",["**",new s.xWrap.FuncPtrAdapter({name:"xInput",signature:"i(ppp)",bindScope:"transient"}),"void*"]],["sqlite3changeset_start_v2","int",["**","int","*","int"]],["sqlite3changeset_start_v2_strm","int",["**",new s.xWrap.FuncPtrAdapter({name:"xInput",signature:"i(ppp)",bindScope:"transient"}),"void*","int"]],["sqlite3session_attach","int",["sqlite3_session*","string"]],["sqlite3session_changeset","int",["sqlite3_session*","int*","**"]],["sqlite3session_changeset_size","i64",["sqlite3_session*"]],["sqlite3session_changeset_strm","int",["sqlite3_session*",new s.xWrap.FuncPtrAdapter({name:"xOutput",signature:"i(ppp)",bindScope:"transient"}),"void*"]],["sqlite3session_config","int",["int","void*"]],["sqlite3session_create","int",["sqlite3*","string","**"]],["sqlite3session_diff","int",["sqlite3_session*","string","string","**"]],["sqlite3session_enable","int",["sqlite3_session*","int"]],["sqlite3session_indirect","int",["sqlite3_session*","int"]],["sqlite3session_isempty","int",["sqlite3_session*"]],["sqlite3session_memory_used","i64",["sqlite3_session*"]],["sqlite3session_object_config","int",["sqlite3_session*","int","void*"]],["sqlite3session_patchset","int",["sqlite3_session*","*","**"]],["sqlite3session_patchset_strm","int",["sqlite3_session*",new s.xWrap.FuncPtrAdapter({name:"xOutput",signature:"i(ppp)",bindScope:"transient"}),"void*"]],["sqlite3session_table_filter",void 0,["sqlite3_session*",new s.xWrap.FuncPtrAdapter({name:"xFilter",...q,contextKey:(w,x)=>w[0]}),"*"]])}s.bindingSignatures.wasmInternal=[["sqlite3__wasm_db_reset","int","sqlite3*"],["sqlite3__wasm_db_vfs","sqlite3_vfs*","sqlite3*","string"],["sqlite3__wasm_vfs_create_file","int","sqlite3_vfs*","string","*","int"],["sqlite3__wasm_posix_create_file","int","string","*","int"],["sqlite3__wasm_vfs_unlink","int","sqlite3_vfs*","string"],["sqlite3__wasm_qfmt_token","string:dealloc","string","int"]],t.StructBinder=globalThis.Jaccwabyt({heap:s.heap8u,alloc:s.alloc,dealloc:s.dealloc,bigIntEnabled:s.bigIntEnabled,memberPrefix:"$"}),delete globalThis.Jaccwabyt;{const q=s.xWrap.argAdapter("string");s.xWrap.argAdapter("string:flexible",S=>q(o.flexibleString(S))),s.xWrap.argAdapter("string:static",(function(S){return s.isPtr(S)?S:(S=""+S,this[S]||(this[S]=s.allocCString(S)))}).bind(Object.create(null)));const w=s.xWrap.argAdapter("*"),x=function(){};s.xWrap.argAdapter("sqlite3_filename",w)("sqlite3_context*",w)("sqlite3_value*",w)("void*",w)("sqlite3_changegroup*",w)("sqlite3_changeset_iter*",w)("sqlite3_session*",w)("sqlite3_stmt*",S=>w(S instanceof(t?.oo1?.Stmt||x)?S.pointer:S))("sqlite3*",S=>w(S instanceof(t?.oo1?.DB||x)?S.pointer:S))("sqlite3_vfs*",S=>typeof S=="string"?r.sqlite3_vfs_find(S)||t.SQLite3Error.toss(r.SQLITE_NOTFOUND,"Unknown sqlite3_vfs name:",S):w(S instanceof(r.sqlite3_vfs||x)?S.pointer:S)),s.exports.sqlite3_declare_vtab&&s.xWrap.argAdapter("sqlite3_index_info*",S=>w(S instanceof(r.sqlite3_index_info||x)?S.pointer:S))("sqlite3_module*",S=>w(S instanceof(r.sqlite3_module||x)?S.pointer:S));const N=s.xWrap.resultAdapter("*");s.xWrap.resultAdapter("sqlite3*",N)("sqlite3_context*",N)("sqlite3_stmt*",N)("sqlite3_value*",N)("sqlite3_vfs*",N)("void*",N),s.exports.sqlite3_step.length===0&&(s.xWrap.doArgcCheck=!1,t.config.warn("Disabling sqlite3.wasm.xWrap.doArgcCheck due to environmental quirks."));for(const S of s.bindingSignatures)r[S[0]]=s.xWrap.apply(null,S);for(const S of s.bindingSignatures.wasmInternal)o[S[0]]=s.xWrap.apply(null,S);const P=function(S){return()=>n(S+"() is unavailable due to lack","of BigInt support in this build.")};for(const S of s.bindingSignatures.int64)r[S[0]]=s.bigIntEnabled?s.xWrap.apply(null,S):P(S[0]);if(delete s.bindingSignatures,s.exports.sqlite3__wasm_db_error){const S=s.xWrap("sqlite3__wasm_db_error","int","sqlite3*","int","string");o.sqlite3__wasm_db_error=function(L,$,c){return $ instanceof t.WasmAllocError?($=r.SQLITE_NOMEM,c=0):$ instanceof Error&&(c=c||""+$,$=$.resultCode||r.SQLITE_ERROR),L?S(L,$,c):$}}else o.sqlite3__wasm_db_error=function(S,L,$){return console.warn("sqlite3__wasm_db_error() is not exported.",arguments),L}}{const q=s.xCall("sqlite3__wasm_enum_json");q||n("Maintenance required: increase sqlite3__wasm_enum_json()'s","static buffer size!"),s.ctype=JSON.parse(s.cstrToJs(q));const w=["access","authorizer","blobFinalizers","changeset","config","dataTypes","dbConfig","dbStatus","encodings","fcntl","flock","ioCap","limits","openFlags","prepareFlags","resultCodes","sqlite3Status","stmtStatus","syncFlags","trace","txnState","udfFlags","version"];s.bigIntEnabled&&w.push("serialize","session","vtab");for(const P of w)for(const S of Object.entries(s.ctype[P]))r[S[0]]=S[1];s.functionEntry(r.SQLITE_WASM_DEALLOC)||n("Internal error: cannot resolve exported function","entry SQLITE_WASM_DEALLOC (=="+r.SQLITE_WASM_DEALLOC+").");const x=Object.create(null);for(const P of["resultCodes"])for(const S of Object.entries(s.ctype[P]))x[S[1]]=S[0];r.sqlite3_js_rc_str=P=>x[P];const N=Object.assign(Object.create(null),{WasmTestStruct:!0,sqlite3_kvvfs_methods:!o.isUIThread(),sqlite3_index_info:!s.bigIntEnabled,sqlite3_index_constraint:!s.bigIntEnabled,sqlite3_index_orderby:!s.bigIntEnabled,sqlite3_index_constraint_usage:!s.bigIntEnabled});for(const P of s.ctype.structs)N[P.name]||(r[P.name]=t.StructBinder(P));if(r.sqlite3_index_info){for(const P of["sqlite3_index_constraint","sqlite3_index_orderby","sqlite3_index_constraint_usage"])r.sqlite3_index_info[P]=r[P],delete r[P];r.sqlite3_vtab_config=s.xWrap("sqlite3__wasm_vtab_config","int",["sqlite3*","int","int"])}}const p=(q,w,x)=>o.sqlite3__wasm_db_error(q,r.SQLITE_MISUSE,w+"() requires "+x+" argument"+(x===1?"":"s")+"."),g=q=>o.sqlite3__wasm_db_error(q,r.SQLITE_FORMAT,"SQLITE_UTF8 is the only supported encoding."),O=q=>s.xWrap.argAdapter("sqlite3*")(q),R=q=>s.isPtr(q)?s.cstrToJs(q):q,z=(function(q,w){q=O(q);let x=this.dbMap.get(q);if(w)!x&&w>0&&this.dbMap.set(q,x=Object.create(null));else return this.dbMap.delete(q),x;return x}).bind(Object.assign(Object.create(null),{dbMap:new Map}));z.addCollation=function(q,w){const x=z(q,1);x.collation||(x.collation=new Set),x.collation.add(R(w).toLowerCase())},z._addUDF=function(q,w,x,N){w=R(w).toLowerCase();let P=N.get(w);P||N.set(w,P=new Set),P.add(x<0?-1:x)},z.addFunction=function(q,w,x){const N=z(q,1);N.udf||(N.udf=new Map),this._addUDF(q,w,x,N.udf)},s.exports.sqlite3_create_window_function&&(z.addWindowFunc=function(q,w,x){const N=z(q,1);N.wudf||(N.wudf=new Map),this._addUDF(q,w,x,N.wudf)}),z.cleanup=function(q){q=O(q);const w=[q];for(const P of["sqlite3_busy_handler","sqlite3_commit_hook","sqlite3_preupdate_hook","sqlite3_progress_handler","sqlite3_rollback_hook","sqlite3_set_authorizer","sqlite3_trace_v2","sqlite3_update_hook"]){const S=s.exports[P];if(S){w.length=S.length;try{r[P](...w)}catch(L){t.config.warn("close-time call of",P+"(",w,") threw:",L)}}}const x=z(q,0);if(!x)return;if(x.collation){for(const P of x.collation)try{r.sqlite3_create_collation_v2(q,P,r.SQLITE_UTF8,0,0,0)}catch{}delete x.collation}let N;for(N=0;N<2;++N){const P=N?x.wudf:x.udf;if(!P)continue;const S=N?r.sqlite3_create_window_function:r.sqlite3_create_function_v2;for(const L of P){const $=L[0],c=L[1],d=[q,$,0,r.SQLITE_UTF8,0,0,0,0,0];N&&d.push(0);for(const y of c)try{d[2]=y,S.apply(null,d)}catch{}c.clear()}P.clear()}delete x.udf,delete x.wudf};{const q=s.xWrap("sqlite3_close_v2","int","sqlite3*");r.sqlite3_close_v2=function(w){if(arguments.length!==1)return p(w,"sqlite3_close_v2",1);if(w)try{z.cleanup(w)}catch{}return q(w)}}if(r.sqlite3session_create){const q=s.xWrap("sqlite3session_delete",void 0,["sqlite3_session*"]);r.sqlite3session_delete=function(w){if(arguments.length!==1)return p(pDb,"sqlite3session_delete",1);w&&r.sqlite3session_table_filter(w,0,0),q(w)}}{const q=(x,N)=>"argv["+N+"]:"+x[0]+":"+s.cstrToJs(x[1]).toLowerCase(),w=s.xWrap("sqlite3_create_collation_v2","int",["sqlite3*","string","int","*",new s.xWrap.FuncPtrAdapter({name:"xCompare",signature:"i(pipip)",contextKey:q}),new s.xWrap.FuncPtrAdapter({name:"xDestroy",signature:"v(p)",contextKey:q})]);r.sqlite3_create_collation_v2=function(x,N,P,S,L,$){if(arguments.length!==6)return p(x,"sqlite3_create_collation_v2",6);if((P&15)===0)P|=r.SQLITE_UTF8;else if(r.SQLITE_UTF8!==(P&15))return g(x);try{const c=w(x,N,P,S,L,$);return c===0&&L instanceof Function&&z.addCollation(x,N),c}catch(c){return o.sqlite3__wasm_db_error(x,c)}},r.sqlite3_create_collation=(x,N,P,S,L)=>arguments.length===5?r.sqlite3_create_collation_v2(x,N,P,S,L,0):p(x,"sqlite3_create_collation",5)}{const q=function(P,S){return P[0]+":"+(P[2]<0?-1:P[2])+":"+S+":"+s.cstrToJs(P[1]).toLowerCase()},w=Object.assign(Object.create(null),{xInverseAndStep:{signature:"v(pip)",contextKey:q,callProxy:P=>(S,L,$)=>{try{P(S,...r.sqlite3_values_to_js(L,$))}catch(c){r.sqlite3_result_error_js(S,c)}}},xFinalAndValue:{signature:"v(p)",contextKey:q,callProxy:P=>S=>{try{r.sqlite3_result_js(S,P(S))}catch(L){r.sqlite3_result_error_js(S,L)}}},xFunc:{signature:"v(pip)",contextKey:q,callProxy:P=>(S,L,$)=>{try{r.sqlite3_result_js(S,P(S,...r.sqlite3_values_to_js(L,$)))}catch(c){r.sqlite3_result_error_js(S,c)}}},xDestroy:{signature:"v(p)",contextKey:q,callProxy:P=>S=>{try{P(S)}catch(L){console.error("UDF xDestroy method threw:",L)}}}}),x=s.xWrap("sqlite3_create_function_v2","int",["sqlite3*","string","int","int","*",new s.xWrap.FuncPtrAdapter({name:"xFunc",...w.xFunc}),new s.xWrap.FuncPtrAdapter({name:"xStep",...w.xInverseAndStep}),new s.xWrap.FuncPtrAdapter({name:"xFinal",...w.xFinalAndValue}),new s.xWrap.FuncPtrAdapter({name:"xDestroy",...w.xDestroy})]),N=s.exports.sqlite3_create_window_function?s.xWrap("sqlite3_create_window_function","int",["sqlite3*","string","int","int","*",new s.xWrap.FuncPtrAdapter({name:"xStep",...w.xInverseAndStep}),new s.xWrap.FuncPtrAdapter({name:"xFinal",...w.xFinalAndValue}),new s.xWrap.FuncPtrAdapter({name:"xValue",...w.xFinalAndValue}),new s.xWrap.FuncPtrAdapter({name:"xInverse",...w.xInverseAndStep}),new s.xWrap.FuncPtrAdapter({name:"xDestroy",...w.xDestroy})]):void 0;r.sqlite3_create_function_v2=function P(S,L,$,c,d,y,B,f,m){if(P.length!==arguments.length)return p(S,"sqlite3_create_function_v2",P.length);if((c&15)===0)c|=r.SQLITE_UTF8;else if(r.SQLITE_UTF8!==(c&15))return g(S);try{const l=x(S,L,$,c,d,y,B,f,m);return l===0&&(y instanceof Function||B instanceof Function||f instanceof Function||m instanceof Function)&&z.addFunction(S,L,$),l}catch(l){return console.error("sqlite3_create_function_v2() setup threw:",l),o.sqlite3__wasm_db_error(S,l,"Creation of UDF threw: "+l)}},r.sqlite3_create_function=function P(S,L,$,c,d,y,B,f){return P.length===arguments.length?r.sqlite3_create_function_v2(S,L,$,c,d,y,B,f,0):p(S,"sqlite3_create_function",P.length)},N?r.sqlite3_create_window_function=function P(S,L,$,c,d,y,B,f,m,l){if(P.length!==arguments.length)return p(S,"sqlite3_create_window_function",P.length);if((c&15)===0)c|=r.SQLITE_UTF8;else if(r.SQLITE_UTF8!==(c&15))return g(S);try{const _=N(S,L,$,c,d,y,B,f,m,l);return _===0&&(y instanceof Function||B instanceof Function||f instanceof Function||m instanceof Function||l instanceof Function)&&z.addWindowFunc(S,L,$),_}catch(_){return console.error("sqlite3_create_window_function() setup threw:",_),o.sqlite3__wasm_db_error(S,_,"Creation of UDF threw: "+_)}}:delete r.sqlite3_create_window_function,r.sqlite3_create_function_v2.udfSetResult=r.sqlite3_create_function.udfSetResult=r.sqlite3_result_js,r.sqlite3_create_window_function&&(r.sqlite3_create_window_function.udfSetResult=r.sqlite3_result_js),r.sqlite3_create_function_v2.udfConvertArgs=r.sqlite3_create_function.udfConvertArgs=r.sqlite3_values_to_js,r.sqlite3_create_window_function&&(r.sqlite3_create_window_function.udfConvertArgs=r.sqlite3_values_to_js),r.sqlite3_create_function_v2.udfSetError=r.sqlite3_create_function.udfSetError=r.sqlite3_result_error_js,r.sqlite3_create_window_function&&(r.sqlite3_create_window_function.udfSetError=r.sqlite3_result_error_js)}{const q=(x,N)=>(typeof x=="string"?N=-1:o.isSQLableTypedArray(x)?(N=x.byteLength,x=o.typedArrayToString(x instanceof ArrayBuffer?new Uint8Array(x):x)):Array.isArray(x)&&(x=x.join(""),N=-1),[x,N]),w={basic:s.xWrap("sqlite3_prepare_v3","int",["sqlite3*","string","int","int","**","**"]),full:s.xWrap("sqlite3_prepare_v3","int",["sqlite3*","*","int","int","**","**"])};r.sqlite3_prepare_v3=function x(N,P,S,L,$,c){if(x.length!==arguments.length)return p(N,"sqlite3_prepare_v3",x.length);const[d,y]=q(P,S);switch(typeof d){case"string":return w.basic(N,d,y,L,$,null);case"number":return w.full(N,d,y,L,$,c);default:return o.sqlite3__wasm_db_error(N,r.SQLITE_MISUSE,"Invalid SQL argument type for sqlite3_prepare_v2/v3().")}},r.sqlite3_prepare_v2=function x(N,P,S,L,$){return x.length===arguments.length?r.sqlite3_prepare_v3(N,P,S,0,L,$):p(N,"sqlite3_prepare_v2",x.length)}}{const q=s.xWrap("sqlite3_bind_text","int",["sqlite3_stmt*","int","string","int","*"]),w=s.xWrap("sqlite3_bind_blob","int",["sqlite3_stmt*","int","*","int","*"]);r.sqlite3_bind_text=function x(N,P,S,L,$){if(x.length!==arguments.length)return p(r.sqlite3_db_handle(N),"sqlite3_bind_text",x.length);if(s.isPtr(S)||S===null)return q(N,P,S,L,$);S instanceof ArrayBuffer?S=new Uint8Array(S):Array.isArray(pMem)&&(S=pMem.join(""));let c,d;try{if(o.isSQLableTypedArray(S))c=s.allocFromTypedArray(S),d=S.byteLength;else if(typeof S=="string")[c,d]=s.allocCString(S);else return o.sqlite3__wasm_db_error(r.sqlite3_db_handle(N),r.SQLITE_MISUSE,"Invalid 3rd argument type for sqlite3_bind_text().");return q(N,P,c,d,r.SQLITE_WASM_DEALLOC)}catch(y){return s.dealloc(c),o.sqlite3__wasm_db_error(r.sqlite3_db_handle(N),y)}},r.sqlite3_bind_blob=function x(N,P,S,L,$){if(x.length!==arguments.length)return p(r.sqlite3_db_handle(N),"sqlite3_bind_blob",x.length);if(s.isPtr(S)||S===null)return w(N,P,S,L,$);S instanceof ArrayBuffer?S=new Uint8Array(S):Array.isArray(S)&&(S=S.join(""));let c,d;try{if(o.isBindableTypedArray(S))c=s.allocFromTypedArray(S),d=L>=0?L:S.byteLength;else if(typeof S=="string")[c,d]=s.allocCString(S);else return o.sqlite3__wasm_db_error(r.sqlite3_db_handle(N),r.SQLITE_MISUSE,"Invalid 3rd argument type for sqlite3_bind_blob().");return w(N,P,c,d,r.SQLITE_WASM_DEALLOC)}catch(y){return s.dealloc(c),o.sqlite3__wasm_db_error(r.sqlite3_db_handle(N),y)}}}r.sqlite3_config=function(q,...w){if(arguments.length<2)return r.SQLITE_MISUSE;switch(q){case r.SQLITE_CONFIG_COVERING_INDEX_SCAN:case r.SQLITE_CONFIG_MEMSTATUS:case r.SQLITE_CONFIG_SMALL_MALLOC:case r.SQLITE_CONFIG_SORTERREF_SIZE:case r.SQLITE_CONFIG_STMTJRNL_SPILL:case r.SQLITE_CONFIG_URI:return s.exports.sqlite3__wasm_config_i(q,w[0]);case r.SQLITE_CONFIG_LOOKASIDE:return s.exports.sqlite3__wasm_config_ii(q,w[0],w[1]);case r.SQLITE_CONFIG_MEMDB_MAXSIZE:return s.exports.sqlite3__wasm_config_j(q,w[0]);case r.SQLITE_CONFIG_GETMALLOC:case r.SQLITE_CONFIG_GETMUTEX:case r.SQLITE_CONFIG_GETPCACHE2:case r.SQLITE_CONFIG_GETPCACHE:case r.SQLITE_CONFIG_HEAP:case r.SQLITE_CONFIG_LOG:case r.SQLITE_CONFIG_MALLOC:case r.SQLITE_CONFIG_MMAP_SIZE:case r.SQLITE_CONFIG_MULTITHREAD:case r.SQLITE_CONFIG_MUTEX:case r.SQLITE_CONFIG_PAGECACHE:case r.SQLITE_CONFIG_PCACHE2:case r.SQLITE_CONFIG_PCACHE:case r.SQLITE_CONFIG_PCACHE_HDRSZ:case r.SQLITE_CONFIG_PMASZ:case r.SQLITE_CONFIG_SERIALIZED:case r.SQLITE_CONFIG_SINGLETHREAD:case r.SQLITE_CONFIG_SQLLOG:case r.SQLITE_CONFIG_WIN32_HEAPSIZE:default:return r.SQLITE_NOTFOUND}};{const q=new Set;r.sqlite3_auto_extension=function(w){if(w instanceof Function)w=s.installFunction("i(ppp)",w);else if(arguments.length!==1||!s.isPtr(w))return r.SQLITE_MISUSE;const x=s.exports.sqlite3_auto_extension(w);return w!==arguments[0]&&(x===0?q.add(w):s.uninstallFunction(w)),x},r.sqlite3_cancel_auto_extension=function(w){return!w||arguments.length!==1||!s.isPtr(w)?0:s.exports.sqlite3_cancel_auto_extension(w)},r.sqlite3_reset_auto_extension=function(){s.exports.sqlite3_reset_auto_extension();for(const w of q)s.uninstallFunction(w);q.clear()}}const W=r.sqlite3_vfs_find("kvvfs");if(W)if(o.isUIThread()){const q=new r.sqlite3_kvvfs_methods(s.exports.sqlite3__wasm_kvvfs_methods());delete r.sqlite3_kvvfs_methods;const w=s.exports.sqlite3__wasm_kvvfsMakeKeyOnPstack,x=s.pstack,N=S=>s.peek(S)===115?sessionStorage:localStorage,P={xRead:(S,L,$,c)=>{const d=x.pointer,y=s.scopedAllocPush();try{const B=w(S,L);if(!B)return-3;const f=s.cstrToJs(B),m=N(S).getItem(f);if(!m)return-1;const l=m.length;if(c<=0)return l;if(c===1)return s.poke($,0),l;const _=s.scopedAllocCString(m);return c>l+1&&(c=l+1),s.heap8u().copyWithin($,_,_+c-1),s.poke($+c-1,0),c-1}catch(B){return console.error("kvstorageRead()",B),-2}finally{x.restore(d),s.scopedAllocPop(y)}},xWrite:(S,L,$)=>{const c=x.pointer;try{const d=w(S,L);if(!d)return 1;const y=s.cstrToJs(d);return N(S).setItem(y,s.cstrToJs($)),0}catch(d){return console.error("kvstorageWrite()",d),r.SQLITE_IOERR}finally{x.restore(c)}},xDelete:(S,L)=>{const $=x.pointer;try{const c=w(S,L);return c?(N(S).removeItem(s.cstrToJs(c)),0):1}catch(c){return console.error("kvstorageDelete()",c),r.SQLITE_IOERR}finally{x.restore($)}}};for(const S of Object.keys(P))q[q.memberKey(S)]=s.installFunction(q.memberSignature(S),P[S])}else r.sqlite3_vfs_unregister(W);s.xWrap.FuncPtrAdapter.warnOnUse=!0;const T=t.StructBinder,A=function q(w,x,N,P=q.installMethodArgcCheck){if(w instanceof T.StructType?!(N instanceof Function)&&!s.isPtr(N)&&n("Usage error: expecting a Function or WASM pointer to one."):n("Usage error: target object is-not-a StructType."),arguments.length===1)return(c,d)=>q(w,c,d,P);q.argcProxy||(q.argcProxy=function(c,d,y,B){return function(...f){return y.length!==arguments.length&&n("Argument mismatch for",c.structInfo.name+"::"+d+": Native signature is:",B),y.apply(this,f)}},q.removeFuncList=function(){this.ondispose.__removeFuncList&&(this.ondispose.__removeFuncList.forEach((c,d)=>{if(typeof c=="number")try{s.uninstallFunction(c)}catch{}}),delete this.ondispose.__removeFuncList)});const S=w.memberSignature(x);S.length<2&&n("Member",x,"does not have a function pointer signature:",S);const L=w.memberKey(x),$=P&&!s.isPtr(N)?q.argcProxy(w,L,N,S):N;if(s.isPtr($))$&&!s.functionEntry($)&&n("Pointer",$,"is not a WASM function table entry."),w[L]=$;else{const c=s.installFunction($,w.memberSignature(x,!0));w[L]=c,(!w.ondispose||!w.ondispose.__removeFuncList)&&(w.addOnDispose("ondispose.__removeFuncList handler",q.removeFuncList),w.ondispose.__removeFuncList=[]),w.ondispose.__removeFuncList.push(L,c)}return(c,d)=>q(w,c,d,P)};A.installMethodArgcCheck=!1;const D=function(q,w,x=A.installMethodArgcCheck){const N=new Map;for(const P of Object.keys(w)){const S=w[P],L=N.get(S);if(L){const $=q.memberKey(P);q[$]=q[q.memberKey(L)]}else A(q,P,S,x),N.set(S,P)}return q};T.StructType.prototype.installMethod=function(w,x,N=A.installMethodArgcCheck){return arguments.length<3&&w&&typeof w=="object"?D(this,...arguments):A(this,...arguments)},T.StructType.prototype.installMethods=function(q,w=A.installMethodArgcCheck){return D(this,q,w)}}),globalThis.sqlite3ApiBootstrap.initializers.push(function(t){t.version={libVersion:"3.50.4",libVersionNumber:3050004,sourceId:"2025-07-30 19:33:53 4d8adfb30e03f9cf27f800a2c1ba3c48fb4ca1b08b0f5ed59a4d5ecbf45e20a3",downloadVersion:3500400}}),globalThis.sqlite3ApiBootstrap.initializers.push(function(t){const n=(...f)=>{throw new t.SQLite3Error(...f)},r=t.capi,s=t.wasm,o=t.util,p=new WeakMap,g=new WeakMap,O=(f,m,l)=>{const _=Object.getOwnPropertyDescriptor(f,m);return _?_.value:l},R=function(f,m){return m&&(f instanceof A&&(f=f.pointer),n(m,"sqlite3 result code",m+":",f?r.sqlite3_errmsg(f):r.sqlite3_errstr(m))),arguments[0]},z=s.installFunction("i(ippp)",(function(f,m,l,_){r.SQLITE_TRACE_STMT===f&&console.log("SQL TRACE #"+ ++this.counter+" via sqlite3@"+m+":",s.cstrToJs(_))}).bind({counter:0})),W=Object.create(null),T=function f(...m){if(!f._name2vfs){f._name2vfs=Object.create(null);const j=typeof importScripts=="function"?b=>n("The VFS for",b,"is only available in the main window thread."):!1;f._name2vfs[":localStorage:"]={vfs:"kvvfs",filename:j||(()=>"local")},f._name2vfs[":sessionStorage:"]={vfs:"kvvfs",filename:j||(()=>"session")}}const l=f.normalizeArgs(...m);let _=l.filename,u=l.vfs,I=l.flags;(typeof _!="string"&&typeof _!="number"||typeof I!="string"||u&&typeof u!="string"&&typeof u!="number")&&(t.config.error("Invalid DB ctor args",l,arguments),n("Invalid arguments for DB constructor."));let U=typeof _=="number"?s.cstrToJs(_):_;const ee=f._name2vfs[U];ee&&(u=ee.vfs,_=U=ee.filename(U));let ne,re=0;I.indexOf("c")>=0&&(re|=r.SQLITE_OPEN_CREATE|r.SQLITE_OPEN_READWRITE),I.indexOf("w")>=0&&(re|=r.SQLITE_OPEN_READWRITE),re===0&&(re|=r.SQLITE_OPEN_READONLY),re|=r.SQLITE_OPEN_EXRESCODE;const se=s.pstack.pointer;try{const j=s.pstack.allocPtr();let b=r.sqlite3_open_v2(_,j,re,u||0);ne=s.peekPtr(j),R(ne,b),r.sqlite3_extended_result_codes(ne,1),I.indexOf("t")>=0&&r.sqlite3_trace_v2(ne,r.SQLITE_TRACE_STMT,z,ne)}catch(j){throw ne&&r.sqlite3_close_v2(ne),j}finally{s.pstack.restore(se)}this.filename=U,p.set(this,ne),g.set(this,Object.create(null));try{const j=r.sqlite3_js_db_vfs(ne)||n("Internal error: cannot get VFS for new db handle."),b=W[j];b&&(b instanceof Function?b(this,t):R(ne,r.sqlite3_exec(ne,b,0,0,0)))}catch(j){throw this.close(),j}};T.setVfsPostOpenCallback=function(f,m){m instanceof Function||n("dbCtorHelper.setVfsPostOpenCallback() should not be used with a non-function argument.",arguments),W[f]=m},T.normalizeArgs=function(f=":memory:",m="c",l=null){const _={};return arguments.length===1&&arguments[0]&&typeof arguments[0]=="object"?(Object.assign(_,arguments[0]),_.flags===void 0&&(_.flags="c"),_.vfs===void 0&&(_.vfs=null),_.filename===void 0&&(_.filename=":memory:")):(_.filename=f,_.flags=m,_.vfs=l),_};const A=function(...f){T.apply(this,f)};A.dbCtorHelper=T;const D={null:1,number:2,string:3,boolean:4,blob:5};D.undefined==D.null,s.bigIntEnabled&&(D.bigint=D.number);const q=function(){D!==arguments[2]&&n(r.SQLITE_MISUSE,"Do not call the Stmt constructor directly. Use DB.prepare()."),this.db=arguments[0],p.set(this,arguments[1]),this.parameterCount=r.sqlite3_bind_parameter_count(this.pointer)},w=function(f){return f.pointer||n("DB has been closed."),f},x=function(f,m){return(m!==(m|0)||m<0||m>=f.columnCount)&&n("Column index",m,"is out of range."),f},N=function(f,m){const l=Object.create(null);switch(l.opt=Object.create(null),m.length){case 1:typeof m[0]=="string"||o.isSQLableTypedArray(m[0])||Array.isArray(m[0])?l.sql=m[0]:m[0]&&typeof m[0]=="object"&&(l.opt=m[0],l.sql=l.opt.sql);break;case 2:l.sql=m[0],l.opt=m[1];break;default:n("Invalid argument count for exec().")}l.sql=o.flexibleString(l.sql),typeof l.sql!="string"&&n("Missing SQL argument or unsupported SQL value type.");const _=l.opt;switch(_.returnValue){case"resultRows":_.resultRows||(_.resultRows=[]),l.returnVal=()=>_.resultRows;break;case"saveSql":_.saveSql||(_.saveSql=[]),l.returnVal=()=>_.saveSql;break;case void 0:case"this":l.returnVal=()=>f;break;default:n("Invalid returnValue value:",_.returnValue)}if(!_.callback&&!_.returnValue&&_.rowMode!==void 0&&(_.resultRows||(_.resultRows=[]),l.returnVal=()=>_.resultRows),_.callback||_.resultRows)switch(_.rowMode===void 0?"array":_.rowMode){case"object":l.cbArg=(u,I)=>{I.columnNames||(I.columnNames=u.getColumnNames([]));const U=u.get([]),ee=Object.create(null);for(const ne in I.columnNames)ee[I.columnNames[ne]]=U[ne];return ee};break;case"array":l.cbArg=u=>u.get([]);break;case"stmt":Array.isArray(_.resultRows)&&n("exec(): invalid rowMode for a resultRows array: must","be one of 'array', 'object',","a result column number, or column name reference."),l.cbArg=u=>u;break;default:if(o.isInt32(_.rowMode)){l.cbArg=u=>u.get(_.rowMode);break}else if(typeof _.rowMode=="string"&&_.rowMode.length>1&&_.rowMode[0]==="$"){const u=_.rowMode.substr(1);l.cbArg=I=>{const U=I.get(Object.create(null))[u];return U===void 0?n(r.SQLITE_NOTFOUND,"exec(): unknown result column:",u):U};break}n("Invalid rowMode:",_.rowMode)}return l},P=(f,m,l,..._)=>{const u=f.prepare(m);try{const I=u.bind(l).step()?u.get(..._):void 0;return u.reset(),I}finally{u.finalize()}},S=(f,m,l,_)=>f.exec({sql:m,bind:l,rowMode:_,returnValue:"resultRows"});A.checkRc=(f,m)=>R(f,m),A.prototype={isOpen:function(){return!!this.pointer},affirmOpen:function(){return w(this)},close:function(){if(this.pointer){if(this.onclose&&this.onclose.before instanceof Function)try{this.onclose.before(this)}catch{}const f=this.pointer;if(Object.keys(g.get(this)).forEach((m,l)=>{if(l&&l.pointer)try{l.finalize()}catch{}}),p.delete(this),g.delete(this),r.sqlite3_close_v2(f),this.onclose&&this.onclose.after instanceof Function)try{this.onclose.after(this)}catch{}delete this.filename}},changes:function(f=!1,m=!1){const l=w(this).pointer;return f?m?r.sqlite3_total_changes64(l):r.sqlite3_total_changes(l):m?r.sqlite3_changes64(l):r.sqlite3_changes(l)},dbFilename:function(f="main"){return r.sqlite3_db_filename(w(this).pointer,f)},dbName:function(f=0){return r.sqlite3_db_name(w(this).pointer,f)},dbVfsName:function(f=0){let m;const l=r.sqlite3_js_db_vfs(w(this).pointer,f);if(l){const _=new r.sqlite3_vfs(l);try{m=s.cstrToJs(_.$zName)}finally{_.dispose()}}return m},prepare:function(f){w(this);const m=s.pstack.pointer;let l,_;try{l=s.pstack.alloc(8),A.checkRc(this,r.sqlite3_prepare_v2(this.pointer,f,-1,l,null)),_=s.peekPtr(l)}finally{s.pstack.restore(m)}_||n("Cannot prepare empty SQL.");const u=new q(this,_,D);return g.get(this)[_]=u,u},exec:function(){w(this);const f=N(this,arguments);if(!f.sql)return n("exec() requires an SQL string.");const m=f.opt,l=m.callback,_=Array.isArray(m.resultRows)?m.resultRows:void 0;let u,I=m.bind,U=!!(f.cbArg||m.columnNames||_);const ee=s.scopedAllocPush(),ne=Array.isArray(m.saveSql)?m.saveSql:void 0;try{const re=o.isSQLableTypedArray(f.sql);let se=re?f.sql.byteLength:s.jstrlen(f.sql);const j=s.scopedAlloc(2*s.ptrSizeof+(se+1)),b=j+s.ptrSizeof;let k=b+s.ptrSizeof;const Q=k+se;for(re?s.heap8().set(f.sql,k):s.jstrcpy(f.sql,s.heap8(),k,se,!1),s.poke(k+se,0);k&&s.peek(k,"i8");){s.pokePtr([j,b],0),A.checkRc(this,r.sqlite3_prepare_v3(this.pointer,k,se,0,j,b));const H=s.peekPtr(j);if(k=s.peekPtr(b),se=Q-k,!!H){if(ne&&ne.push(r.sqlite3_sql(H).trim()),u=new q(this,H,D),I&&u.parameterCount&&(u.bind(I),I=null),U&&u.columnCount){let Z=Array.isArray(m.columnNames)?0:1;if(U=!1,f.cbArg||_){const E=Object.create(null);for(;u.step();u._lockedByExec=!1){Z++===0&&u.getColumnNames(E.columnNames=m.columnNames||[]),u._lockedByExec=!0;const C=f.cbArg(u,E);if(_&&_.push(C),l&&l.call(m,C,u)===!1)break}u._lockedByExec=!1}Z===0&&u.getColumnNames(m.columnNames)}else u.step();u.reset().finalize(),u=null}}}finally{s.scopedAllocPop(ee),u&&(delete u._lockedByExec,u.finalize())}return f.returnVal()},createFunction:function(m,l,_){const u=E=>E instanceof Function;switch(arguments.length){case 1:_=m,m=_.name,l=_.xFunc||0;break;case 2:u(l)||(_=l,l=_.xFunc||0);break}_||(_={}),typeof m!="string"&&n("Invalid arguments: missing function name.");let I=_.xStep||0,U=_.xFinal||0;const ee=_.xValue||0,ne=_.xInverse||0;let re;u(l)?(re=!1,(u(I)||u(U))&&n("Ambiguous arguments: scalar or aggregate?"),I=U=null):u(I)?(u(U)||n("Missing xFinal() callback for aggregate or window UDF."),l=null):u(U)?n("Missing xStep() callback for aggregate or window UDF."):n("Missing function-type properties."),re===!1?(u(ee)||u(ne))&&n("xValue and xInverse are not permitted for non-window UDFs."):u(ee)?(u(ne)||n("xInverse must be provided if xValue is."),re=!0):u(ne)&&n("xValue must be provided if xInverse is.");const se=_.pApp;se!=null&&(typeof se!="number"||!o.isInt32(se))&&n("Invalid value for pApp property. Must be a legal WASM pointer value.");const j=_.xDestroy||0;j&&!u(j)&&n("xDestroy property must be a function.");let b=0;O(_,"deterministic")&&(b|=r.SQLITE_DETERMINISTIC),O(_,"directOnly")&&(b|=r.SQLITE_DIRECTONLY),O(_,"innocuous")&&(b|=r.SQLITE_INNOCUOUS),m=m.toLowerCase();const k=l||I,Q=O(_,"arity"),H=typeof Q=="number"?Q:k.length?k.length-1:0;let Z;return re?Z=r.sqlite3_create_window_function(this.pointer,m,H,r.SQLITE_UTF8|b,se||0,I,U,ee,ne,j):Z=r.sqlite3_create_function_v2(this.pointer,m,H,r.SQLITE_UTF8|b,se||0,l,I,U,j),A.checkRc(this,Z),this},selectValue:function(f,m,l){return P(this,f,m,0,l)},selectValues:function(f,m,l){const _=this.prepare(f),u=[];try{for(_.bind(m);_.step();)u.push(_.get(0,l));_.reset()}finally{_.finalize()}return u},selectArray:function(f,m){return P(this,f,m,[])},selectObject:function(f,m){return P(this,f,m,{})},selectArrays:function(f,m){return S(this,f,m,"array")},selectObjects:function(f,m){return S(this,f,m,"object")},openStatementCount:function(){return this.pointer?Object.keys(g.get(this)).length:0},transaction:function(f){let m="BEGIN";arguments.length>1&&(/[^a-zA-Z]/.test(arguments[0])&&n(r.SQLITE_MISUSE,"Invalid argument for BEGIN qualifier."),m+=" "+arguments[0],f=arguments[1]),w(this).exec(m);try{const l=f(this);return this.exec("COMMIT"),l}catch(l){throw this.exec("ROLLBACK"),l}},savepoint:function(f){w(this).exec("SAVEPOINT oo1");try{const m=f(this);return this.exec("RELEASE oo1"),m}catch(m){throw this.exec("ROLLBACK to SAVEPOINT oo1; RELEASE SAVEPOINT oo1"),m}},checkRc:function(f){return R(this,f)}};const L=function(f){return f.pointer||n("Stmt has been closed."),f},$=function(f){let m=D[f==null?"null":typeof f];switch(m){case D.boolean:case D.null:case D.number:case D.string:return m;case D.bigint:if(s.bigIntEnabled)return m;default:return o.isBindableTypedArray(f)?D.blob:void 0}},c=function(f){return $(f)||n("Unsupported bind() argument type:",typeof f)},d=function(f,m){const l=typeof m=="number"?m:r.sqlite3_bind_parameter_index(f.pointer,m);return l===0||!o.isInt32(l)?n("Invalid bind() parameter name: "+m):(l<1||l>f.parameterCount)&&n("Bind index",m,"is out of range."),l},y=function(f,m){return f._lockedByExec&&n("Operation is illegal when statement is locked:",m),f},B=function f(m,l,_,u){y(L(m),"bind()"),f._||(f._tooBigInt=U=>n("BigInt value is too big to store without precision loss:",U),f._={string:function(U,ee,ne,re){const[se,j]=s.allocCString(ne,!0);return(re?r.sqlite3_bind_blob:r.sqlite3_bind_text)(U.pointer,ee,se,j,r.SQLITE_WASM_DEALLOC)}}),c(u),l=d(m,l);let I=0;switch(u==null?D.null:_){case D.null:I=r.sqlite3_bind_null(m.pointer,l);break;case D.string:I=f._.string(m,l,u,!1);break;case D.number:{let U;o.isInt32(u)?U=r.sqlite3_bind_int:typeof u=="bigint"?o.bigIntFits64(u)?s.bigIntEnabled?U=r.sqlite3_bind_int64:o.bigIntFitsDouble(u)?(u=Number(u),U=r.sqlite3_bind_double):f._tooBigInt(u):f._tooBigInt(u):(u=Number(u),s.bigIntEnabled&&Number.isInteger(u)?U=r.sqlite3_bind_int64:U=r.sqlite3_bind_double),I=U(m.pointer,l,u);break}case D.boolean:I=r.sqlite3_bind_int(m.pointer,l,u?1:0);break;case D.blob:{if(typeof u=="string"){I=f._.string(m,l,u,!0);break}else u instanceof ArrayBuffer?u=new Uint8Array(u):o.isBindableTypedArray(u)||n("Binding a value as a blob requires","that it be a string, Uint8Array, Int8Array, or ArrayBuffer.");const U=s.alloc(u.byteLength||1);s.heap8().set(u.byteLength?u:[0],U),I=r.sqlite3_bind_blob(m.pointer,l,U,u.byteLength,r.SQLITE_WASM_DEALLOC);break}default:t.config.warn("Unsupported bind() argument type:",u),n("Unsupported bind() argument type: "+typeof u)}return I&&A.checkRc(m.db.pointer,I),m._mayGet=!1,m};q.prototype={finalize:function(){if(this.pointer){y(this,"finalize()");const f=r.sqlite3_finalize(this.pointer);return delete g.get(this.db)[this.pointer],p.delete(this),delete this._mayGet,delete this.parameterCount,delete this._lockedByExec,delete this.db,f}},clearBindings:function(){return y(L(this),"clearBindings()"),r.sqlite3_clear_bindings(this.pointer),this._mayGet=!1,this},reset:function(f){y(this,"reset()"),f&&this.clearBindings();const m=r.sqlite3_reset(L(this).pointer);return this._mayGet=!1,R(this.db,m),this},bind:function(){L(this);let f,m;switch(arguments.length){case 1:f=1,m=arguments[0];break;case 2:f=arguments[0],m=arguments[1];break;default:n("Invalid bind() arguments.")}return m===void 0?this:(this.parameterCount||n("This statement has no bindable parameters."),this._mayGet=!1,m===null?B(this,f,D.null,m):Array.isArray(m)?(arguments.length!==1&&n("When binding an array, an index argument is not permitted."),m.forEach((l,_)=>B(this,_+1,c(l),l)),this):(m instanceof ArrayBuffer&&(m=new Uint8Array(m)),typeof m=="object"&&!o.isBindableTypedArray(m)?(arguments.length!==1&&n("When binding an object, an index argument is not permitted."),Object.keys(m).forEach(l=>B(this,l,c(m[l]),m[l])),this):B(this,f,c(m),m)))},bindAsBlob:function(f,m){L(this),arguments.length===1&&(m=f,f=1);const l=c(m);return D.string!==l&&D.blob!==l&&D.null!==l&&n("Invalid value type for bindAsBlob()"),B(this,f,D.blob,m)},step:function(){y(this,"step()");const f=r.sqlite3_step(L(this).pointer);switch(f){case r.SQLITE_DONE:return this._mayGet=!1;case r.SQLITE_ROW:return this._mayGet=!0;default:this._mayGet=!1,t.config.warn("sqlite3_step() rc=",f,r.sqlite3_js_rc_str(f),"SQL =",r.sqlite3_sql(this.pointer)),A.checkRc(this.db.pointer,f)}},stepReset:function(){return this.step(),this.reset()},stepFinalize:function(){try{const f=this.step();return this.reset(),f}finally{try{this.finalize()}catch{}}},get:function(f,m){if(L(this)._mayGet||n("Stmt.step() has not (recently) returned true."),Array.isArray(f)){let l=0;const _=this.columnCount;for(;l<_;)f[l]=this.get(l++);return f}else if(f&&typeof f=="object"){let l=0;const _=this.columnCount;for(;l<_;)f[r.sqlite3_column_name(this.pointer,l)]=this.get(l++);return f}switch(x(this,f),m===void 0?r.sqlite3_column_type(this.pointer,f):m){case r.SQLITE_NULL:return null;case r.SQLITE_INTEGER:if(s.bigIntEnabled){const l=r.sqlite3_column_int64(this.pointer,f);return l>=Number.MIN_SAFE_INTEGER&&l<=Number.MAX_SAFE_INTEGER?Number(l).valueOf():l}else{const l=r.sqlite3_column_double(this.pointer,f);return(l>Number.MAX_SAFE_INTEGER||l<Number.MIN_SAFE_INTEGER)&&n("Integer is out of range for JS integer range: "+l),o.isInt32(l)?l|0:l}case r.SQLITE_FLOAT:return r.sqlite3_column_double(this.pointer,f);case r.SQLITE_TEXT:return r.sqlite3_column_text(this.pointer,f);case r.SQLITE_BLOB:{const l=r.sqlite3_column_bytes(this.pointer,f),_=r.sqlite3_column_blob(this.pointer,f),u=new Uint8Array(l);return l&&u.set(s.heap8u().slice(_,_+l),0),l&&this.db._blobXfer instanceof Array&&this.db._blobXfer.push(u.buffer),u}default:n("Don't know how to translate","type of result column #"+f+".")}n("Not reached.")},getInt:function(f){return this.get(f,r.SQLITE_INTEGER)},getFloat:function(f){return this.get(f,r.SQLITE_FLOAT)},getString:function(f){return this.get(f,r.SQLITE_TEXT)},getBlob:function(f){return this.get(f,r.SQLITE_BLOB)},getJSON:function(f){const m=this.get(f,r.SQLITE_STRING);return m===null?m:JSON.parse(m)},getColumnName:function(f){return r.sqlite3_column_name(x(L(this),f).pointer,f)},getColumnNames:function(f=[]){x(L(this),0);const m=this.columnCount;for(let l=0;l<m;++l)f.push(r.sqlite3_column_name(this.pointer,l));return f},getParamIndex:function(f){return L(this).parameterCount?r.sqlite3_bind_parameter_index(this.pointer,f):void 0},getParamName:function(f){return L(this).parameterCount?r.sqlite3_bind_parameter_name(this.pointer,f):void 0},isBusy:function(){return r.sqlite3_stmt_busy(L(this))!==0},isReadOnly:function(){return r.sqlite3_stmt_readonly(L(this))!==0}};{const f={enumerable:!0,get:function(){return p.get(this)},set:()=>n("The pointer property is read-only.")};Object.defineProperty(q.prototype,"pointer",f),Object.defineProperty(A.prototype,"pointer",f)}if(Object.defineProperty(q.prototype,"columnCount",{enumerable:!1,get:function(){return r.sqlite3_column_count(this.pointer)},set:()=>n("The columnCount property is read-only.")}),t.oo1={DB:A,Stmt:q},o.isUIThread()){t.oo1.JsStorageDb=function(m="session"){const l=T.normalizeArgs(...arguments);m=l.filename,m!=="session"&&m!=="local"&&n("JsStorageDb db name must be one of 'session' or 'local'."),l.vfs="kvvfs",T.call(this,l)};const f=t.oo1.JsStorageDb;f.prototype=Object.create(A.prototype),f.clearStorage=r.sqlite3_js_kvvfs_clear,f.prototype.clearStorage=function(){return f.clearStorage(w(this).filename)},f.storageSize=r.sqlite3_js_kvvfs_size,f.prototype.storageSize=function(){return f.storageSize(w(this).filename)}}}),globalThis.sqlite3ApiBootstrap.initializers.push(function(t){const n=t.util;t.initWorker1API=(function(){const r=(...T)=>{throw new Error(T.join(" "))};globalThis.WorkerGlobalScope instanceof Function||r("initWorker1API() must be run from a Worker thread.");const s=this.sqlite3||r("Missing this.sqlite3 object."),o=s.oo1.DB,p=function(T){let A=g.idMap.get(T);return A||(A="db#"+ ++g.idSeq+"@"+T.pointer,g.idMap.set(T,A),A)},g={dbList:[],idSeq:0,idMap:new WeakMap,xfer:[],open:function(T){const A=new o(T);return this.dbs[p(A)]=A,this.dbList.indexOf(A)<0&&this.dbList.push(A),A},close:function(T,A){if(T){delete this.dbs[p(T)];const D=T.filename,q=n.sqlite3__wasm_db_vfs(T.pointer,0);T.close();const w=this.dbList.indexOf(T);w>=0&&this.dbList.splice(w,1),A&&D&&q&&n.sqlite3__wasm_vfs_unlink(q,D)}},post:function(T,A){A&&A.length?(globalThis.postMessage(T,Array.from(A)),A.length=0):globalThis.postMessage(T)},dbs:Object.create(null),getDb:function(T,A=!0){return this.dbs[T]||(A?r("Unknown (or closed) DB ID:",T):void 0)}},O=function(T=g.dbList[0]){return T&&T.pointer?T:r("DB is not opened.")},R=function(T,A=!0){const D=g.getDb(T.dbId,!1)||g.dbList[0];return A?O(D):D},z=function(){return g.dbList[0]&&p(g.dbList[0])},W={open:function(T){const A=Object.create(null),D=T.args||Object.create(null);D.simulateError&&r("Throwing because of simulateError flag.");const q=Object.create(null);A.vfs=D.vfs,A.filename=D.filename||"";const w=g.open(A);return q.filename=w.filename,q.persistent=!!s.capi.sqlite3_js_db_uses_vfs(w.pointer,"opfs"),q.dbId=p(w),q.vfs=w.dbVfsName(),q},close:function(T){const A=R(T,!1),D={filename:A&&A.filename};if(A){const q=T.args&&typeof T.args=="object"?!!T.args.unlink:!1;g.close(A,q)}return D},exec:function(T){const A=typeof T.args=="string"?{sql:T.args}:T.args||Object.create(null);A.rowMode==="stmt"?r("Invalid rowMode for 'exec': stmt mode","does not work in the Worker API."):A.sql||r("'exec' requires input SQL.");const D=R(T);(A.callback||Array.isArray(A.resultRows))&&(D._blobXfer=g.xfer);const q=A.callback;let w=0;const x=!!A.columnNames;typeof q=="string"&&(x||(A.columnNames=[]),A.callback=function(N,P){g.post({type:q,columnNames:A.columnNames,rowNumber:++w,row:N},g.xfer)});try{const N=A.countChanges?D.changes(!0,A.countChanges===64):void 0;D.exec(A),N!==void 0&&(A.changeCount=D.changes(!0,A.countChanges===64)-N);const P=A.lastInsertRowId?s.capi.sqlite3_last_insert_rowid(D):void 0;P!==void 0&&(A.lastInsertRowId=P),A.callback instanceof Function&&(A.callback=q,g.post({type:q,columnNames:A.columnNames,rowNumber:null,row:void 0}))}finally{delete D._blobXfer,A.callback&&(A.callback=q)}return A},"config-get":function(){const T=Object.create(null),A=s.config;return["bigIntEnabled"].forEach(function(D){Object.getOwnPropertyDescriptor(A,D)&&(T[D]=A[D])}),T.version=s.version,T.vfsList=s.capi.sqlite3_js_vfs_list(),T},export:function(T){const A=R(T),D={byteArray:s.capi.sqlite3_js_db_export(A.pointer),filename:A.filename,mimetype:"application/x-sqlite3"};return g.xfer.push(D.byteArray.buffer),D},toss:function(T){r("Testing worker exception")}};globalThis.onmessage=async function(T){T=T.data;let A,D=T.dbId,q=T.type;const w=performance.now();try{W.hasOwnProperty(q)&&W[q]instanceof Function?A=await W[q](T):r("Unknown db worker message type:",T.type)}catch(x){q="error",A={operation:T.type,message:x.message,errorClass:x.name,input:T},x.stack&&(A.stack=typeof x.stack=="string"?x.stack.split(/\n\s*/):x.stack)}D||(D=A.dbId||z()),g.post({type:q,dbId:D,messageId:T.messageId,workerReceivedTime:w,workerRespondTime:performance.now(),departureTime:T.departureTime,result:A},g.xfer)},globalThis.postMessage({type:"sqlite3-api",result:"worker1-ready"})}).bind({sqlite3:t})}),globalThis.sqlite3ApiBootstrap.initializers.push(function(t){const n=t.wasm,r=t.capi,s=t.util.toss3,o=Object.create(null);t.vfs=o,r.sqlite3_vfs.prototype.registerVfs=function(p=!1){this instanceof t.capi.sqlite3_vfs||s("Expecting a sqlite3_vfs-type argument.");const g=r.sqlite3_vfs_register(this,p?1:0);return g&&s("sqlite3_vfs_register(",this,") failed with rc",g),this.pointer!==r.sqlite3_vfs_find(this.$zName)&&s("BUG: sqlite3_vfs_find(vfs.$zName) failed for just-installed VFS",this),this},o.installVfs=function(p){let g=0;const O=["io","vfs"];for(const R of O){const z=p[R];z&&(++g,z.struct.installMethods(z.methods,!!z.applyArgcCheck),R==="vfs"&&(!z.struct.$zName&&typeof z.name=="string"&&z.struct.addOnDispose(z.struct.$zName=n.allocCString(z.name)),z.struct.registerVfs(!!z.asDefault)))}return g||s("Misuse: installVfs() options object requires at least","one of:",O),this}}),globalThis.sqlite3ApiBootstrap.initializers.push(function(t){if(!t.wasm.exports.sqlite3_declare_vtab)return;const n=t.wasm,r=t.capi,s=t.util.toss3,o=Object.create(null);t.vtab=o;const p=r.sqlite3_index_info;p.prototype.nthConstraint=function(R,z=!1){if(R<0||R>=this.$nConstraint)return!1;const W=this.$aConstraint+p.sqlite3_index_constraint.structInfo.sizeof*R;return z?W:new p.sqlite3_index_constraint(W)},p.prototype.nthConstraintUsage=function(R,z=!1){if(R<0||R>=this.$nConstraint)return!1;const W=this.$aConstraintUsage+p.sqlite3_index_constraint_usage.structInfo.sizeof*R;return z?W:new p.sqlite3_index_constraint_usage(W)},p.prototype.nthOrderBy=function(R,z=!1){if(R<0||R>=this.$nOrderBy)return!1;const W=this.$aOrderBy+p.sqlite3_index_orderby.structInfo.sizeof*R;return z?W:new p.sqlite3_index_orderby(W)};const g=function(R,z){return(function(W,T=!1){if(arguments.length===0&&(W=new z),W instanceof z)return this.set(W.pointer,W),W;n.isPtr(W)||t.SQLite3Error.toss("Invalid argument to",R+"()");let A=this.get(W);return T&&this.delete(W),A}).bind(new Map)},O=function(R,z){const W=g(R,z);return Object.assign(Object.create(null),{StructType:z,create:T=>{const A=W();return n.pokePtr(T,A.pointer),A},get:T=>W(T),unget:T=>W(T,!0),dispose:T=>{const A=W(T,!0);A&&A.dispose()}})};o.xVtab=O("xVtab",r.sqlite3_vtab),o.xCursor=O("xCursor",r.sqlite3_vtab_cursor),o.xIndexInfo=R=>new r.sqlite3_index_info(R),o.xError=function R(z,W,T){if(R.errorReporter instanceof Function)try{R.errorReporter("sqlite3_module::"+z+"(): "+W.message)}catch{}let A;return W instanceof t.WasmAllocError?A=r.SQLITE_NOMEM:arguments.length>2?A=T:W instanceof t.SQLite3Error&&(A=W.resultCode),A||r.SQLITE_ERROR},o.xError.errorReporter=console.error.bind(console),o.xRowid=(R,z)=>n.poke(R,z,"i64"),o.setupModule=function(R){let z=!1;const W=this instanceof r.sqlite3_module?this:R.struct||(z=new r.sqlite3_module);try{const T=R.methods||s("Missing 'methods' object.");for(const A of Object.entries({xConnect:"xCreate",xDisconnect:"xDestroy"})){const D=A[0],q=A[1];T[D]===!0?T[D]=T[q]:T[q]===!0&&(T[q]=T[D])}if(R.catchExceptions){const A=function(w,x){return["xConnect","xCreate"].indexOf(w)>=0?function(N,P,S,L,$,c){try{return x(...arguments)||0}catch(d){return d instanceof t.WasmAllocError||(n.dealloc(n.peekPtr(c)),n.pokePtr(c,n.allocCString(d.message))),o.xError(w,d)}}:function(...N){try{return x(...N)||0}catch(P){return o.xError(w,P)}}},D=["xCreate","xConnect","xBestIndex","xDisconnect","xDestroy","xOpen","xClose","xFilter","xNext","xEof","xColumn","xRowid","xUpdate","xBegin","xSync","xCommit","xRollback","xFindFunction","xRename","xSavepoint","xRelease","xRollbackTo","xShadowName"],q=Object.create(null);for(const w of D){const x=T[w];if(x instanceof Function)w==="xConnect"&&T.xCreate===x?q[w]=T.xCreate:w==="xCreate"&&T.xConnect===x?q[w]=T.xConnect:q[w]=A(w,x);else continue}W.installMethods(q,!1)}else W.installMethods(T,!!R.applyArgcCheck);if(W.$iVersion===0){let A;typeof R.iVersion=="number"?A=R.iVersion:W.$xShadowName?A=3:W.$xSavePoint||W.$xRelease||W.$xRollbackTo?A=2:A=1,W.$iVersion=A}}catch(T){throw z&&z.dispose(),T}return W},r.sqlite3_module.prototype.setupModule=function(R){return o.setupModule.call(this,R)}}),globalThis.sqlite3ApiBootstrap.initializers.push(function(t){const n=function r(s){if(!globalThis.SharedArrayBuffer||!globalThis.Atomics)return Promise.reject(new Error("Cannot install OPFS: Missing SharedArrayBuffer and/or Atomics. The server must emit the COOP/COEP response headers to enable those. See https://sqlite.org/wasm/doc/trunk/persistence.md#coop-coep"));if(typeof WorkerGlobalScope>"u")return Promise.reject(new Error("The OPFS sqlite3_vfs cannot run in the main thread because it requires Atomics.wait()."));if(!globalThis.FileSystemHandle||!globalThis.FileSystemDirectoryHandle||!globalThis.FileSystemFileHandle||!globalThis.FileSystemFileHandle.prototype.createSyncAccessHandle||!navigator?.storage?.getDirectory)return Promise.reject(new Error("Missing required OPFS APIs."));(!s||typeof s!="object")&&(s=Object.create(null));const o=new URL(globalThis.location.href).searchParams;return o.has("opfs-disable")?Promise.resolve(t):(s.verbose===void 0&&(s.verbose=o.has("opfs-verbose")?+o.get("opfs-verbose")||2:1),s.sanityChecks===void 0&&(s.sanityChecks=o.has("opfs-sanity-check")),s.proxyUri===void 0&&(s.proxyUri=r.defaultProxyUri),typeof s.proxyUri=="function"&&(s.proxyUri=s.proxyUri()),new Promise(function(g,O){const R=[t.config.error,t.config.warn,t.config.log],z=(E,...C)=>{s.verbose>E&&R[E]("OPFS syncer:",...C)},W=(...E)=>z(2,...E),T=(...E)=>z(1,...E),A=(...E)=>z(0,...E),D=t.util.toss,q=t.capi,w=t.util,x=t.wasm,N=q.sqlite3_vfs,P=q.sqlite3_file,S=q.sqlite3_io_methods,L=Object.create(null),$=()=>globalThis.FileSystemHandle&&globalThis.FileSystemDirectoryHandle&&globalThis.FileSystemFileHandle&&globalThis.FileSystemFileHandle.prototype.createSyncAccessHandle&&navigator?.storage?.getDirectory;L.metrics={dump:function(){let E,C=0,M=0,J=0;for(E in u.opIds){const G=I[E];C+=G.count,M+=G.time,J+=G.wait,G.avgTime=G.count&&G.time?G.time/G.count:0,G.avgWait=G.count&&G.wait?G.wait/G.count:0}t.config.log(globalThis.location.href,"metrics for",globalThis.location.href,":",I,`
.output/public/_nuxt/Zi78bNBY.js:2:`)),!e)return null;ot=wt(e)}return ot.shift()},Re={ttys:[],init(){},shutdown(){},register(e,t){Re.ttys[e]={input:[],output:[],ops:t},a.registerDevice(e,Re.stream_ops)},stream_ops:{open(e){var t=Re.ttys[e.node.rdev];if(!t)throw new a.ErrnoError(43);e.tty=t,e.seekable=!1},close(e){e.tty.ops.fsync(e.tty)},fsync(e){e.tty.ops.fsync(e.tty)},read(e,t,n,r,s){if(!e.tty||!e.tty.ops.get_char)throw new a.ErrnoError(60);for(var o=0,p=0;p<r;p++){var g;try{g=e.tty.ops.get_char(e.tty)}catch{throw new a.ErrnoError(29)}if(g===void 0&&o===0)throw new a.ErrnoError(6);if(g==null)break;o++,t[n+p]=g}return o&&(e.node.timestamp=Date.now()),o},write(e,t,n,r,s){if(!e.tty||!e.tty.ops.put_char)throw new a.ErrnoError(60);try{for(var o=0;o<r;o++)e.tty.ops.put_char(e.tty,t[n+o])}catch{throw new a.ErrnoError(29)}return r&&(e.node.timestamp=Date.now()),o}},default_tty_ops:{get_char(e){return Ht()},put_char(e,t){t===null||t===10?(He(Be(e.output)),e.output=[]):t!=0&&e.output.push(t)},fsync(e){e.output&&e.output.length>0&&(He(Be(e.output)),e.output=[])},ioctl_tcgets(e){return{c_iflag:25856,c_oflag:5,c_cflag:191,c_lflag:35387,c_cc:[3,28,127,21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},ioctl_tcsets(e,t,n){return 0},ioctl_tiocgwinsz(e){return[24,80]}},default_tty1_ops:{put_char(e,t){t===null||t===10?(Pe(Be(e.output)),e.output=[]):t!=0&&e.output.push(t)},fsync(e){e.output&&e.output.length>0&&(Pe(Be(e.output)),e.output=[])}}},Vt=(e,t)=>{je.fill(0,e,e+t)},Et=(e,t)=>Math.ceil(e/t)*t,vt=e=>{e=Et(e,65536);var t=At(65536,e);return t&&Vt(t,e),t},oe={ops_table:null,mount(e){return oe.createNode(null,"/",16895,0)},createNode(e,t,n,r){if(a.isBlkdev(n)||a.isFIFO(n))throw new a.ErrnoError(63);oe.ops_table||={dir:{node:{getattr:oe.node_ops.getattr,setattr:oe.node_ops.setattr,lookup:oe.node_ops.lookup,mknod:oe.node_ops.mknod,rename:oe.node_ops.rename,unlink:oe.node_ops.unlink,rmdir:oe.node_ops.rmdir,readdir:oe.node_ops.readdir,symlink:oe.node_ops.symlink},stream:{llseek:oe.stream_ops.llseek}},file:{node:{getattr:oe.node_ops.getattr,setattr:oe.node_ops.setattr},stream:{llseek:oe.stream_ops.llseek,read:oe.stream_ops.read,write:oe.stream_ops.write,allocate:oe.stream_ops.allocate,mmap:oe.stream_ops.mmap,msync:oe.stream_ops.msync}},link:{node:{getattr:oe.node_ops.getattr,setattr:oe.node_ops.setattr,readlink:oe.node_ops.readlink},stream:{}},chrdev:{node:{getattr:oe.node_ops.getattr,setattr:oe.node_ops.setattr},stream:a.chrdev_stream_ops}};var s=a.createNode(e,t,n,r);return a.isDir(s.mode)?(s.node_ops=oe.ops_table.dir.node,s.stream_ops=oe.ops_table.dir.stream,s.contents={}):a.isFile(s.mode)?(s.node_ops=oe.ops_table.file.node,s.stream_ops=oe.ops_table.file.stream,s.usedBytes=0,s.contents=null):a.isLink(s.mode)?(s.node_ops=oe.ops_table.link.node,s.stream_ops=oe.ops_table.link.stream):a.isChrdev(s.mode)&&(s.node_ops=oe.ops_table.chrdev.node,s.stream_ops=oe.ops_table.chrdev.stream),s.timestamp=Date.now(),e&&(e.contents[t]=s,e.timestamp=s.timestamp),s},getFileDataAsTypedArray(e){return e.contents?e.contents.subarray?e.contents.subarray(0,e.usedBytes):new Uint8Array(e.contents):new Uint8Array(0)},expandFileStorage(e,t){var n=e.contents?e.contents.length:0;if(!(n>=t)){var r=1024*1024;t=Math.max(t,n*(n<r?2:1.125)>>>0),n!=0&&(t=Math.max(t,256));var s=e.contents;e.contents=new Uint8Array(t),e.usedBytes>0&&e.contents.set(s.subarray(0,e.usedBytes),0)}},resizeFileStorage(e,t){if(e.usedBytes!=t)if(t==0)e.contents=null,e.usedBytes=0;else{var n=e.contents;e.contents=new Uint8Array(t),n&&e.contents.set(n.subarray(0,Math.min(t,e.usedBytes))),e.usedBytes=t}},node_ops:{getattr(e){var t={};return t.dev=a.isChrdev(e.mode)?e.id:1,t.ino=e.id,t.mode=e.mode,t.nlink=1,t.uid=0,t.gid=0,t.rdev=e.rdev,a.isDir(e.mode)?t.size=4096:a.isFile(e.mode)?t.size=e.usedBytes:a.isLink(e.mode)?t.size=e.link.length:t.size=0,t.atime=new Date(e.timestamp),t.mtime=new Date(e.timestamp),t.ctime=new Date(e.timestamp),t.blksize=4096,t.blocks=Math.ceil(t.size/t.blksize),t},setattr(e,t){t.mode!==void 0&&(e.mode=t.mode),t.timestamp!==void 0&&(e.timestamp=t.timestamp),t.size!==void 0&&oe.resizeFileStorage(e,t.size)},lookup(e,t){throw a.genericErrors[44]},mknod(e,t,n,r){return oe.createNode(e,t,n,r)},rename(e,t,n){if(a.isDir(e.mode)){var r;try{r=a.lookupNode(t,n)}catch{}if(r)for(var s in r.contents)throw new a.ErrnoError(55)}delete e.parent.contents[e.name],e.parent.timestamp=Date.now(),e.name=n,t.contents[n]=e,t.timestamp=e.parent.timestamp},unlink(e,t){delete e.contents[t],e.timestamp=Date.now()},rmdir(e,t){var n=a.lookupNode(e,t);for(var r in n.contents)throw new a.ErrnoError(55);delete e.contents[t],e.timestamp=Date.now()},readdir(e){var t=[".",".."];for(var n of Object.keys(e.contents))t.push(n);return t},symlink(e,t,n){var r=oe.createNode(e,t,41471,0);return r.link=n,r},readlink(e){if(!a.isLink(e.mode))throw new a.ErrnoError(28);return e.link}},stream_ops:{read(e,t,n,r,s){var o=e.node.contents;if(s>=e.node.usedBytes)return 0;var p=Math.min(e.node.usedBytes-s,r);if(p>8&&o.subarray)t.set(o.subarray(s,s+p),n);else for(var g=0;g<p;g++)t[n+g]=o[s+g];return p},write(e,t,n,r,s,o){if(t.buffer===xe.buffer&&(o=!1),!r)return 0;var p=e.node;if(p.timestamp=Date.now(),t.subarray&&(!p.contents||p.contents.subarray)){if(o)return p.contents=t.subarray(n,n+r),p.usedBytes=r,r;if(p.usedBytes===0&&s===0)return p.contents=t.slice(n,n+r),p.usedBytes=r,r;if(s+r<=p.usedBytes)return p.contents.set(t.subarray(n,n+r),s),r}if(oe.expandFileStorage(p,s+r),p.contents.subarray&&t.subarray)p.contents.set(t.subarray(n,n+r),s);else for(var g=0;g<r;g++)p.contents[s+g]=t[n+g];return p.usedBytes=Math.max(p.usedBytes,s+r),r},llseek(e,t,n){var r=t;if(n===1?r+=e.position:n===2&&a.isFile(e.node.mode)&&(r+=e.node.usedBytes),r<0)throw new a.ErrnoError(28);return r},allocate(e,t,n){oe.expandFileStorage(e.node,t+n),e.node.usedBytes=Math.max(e.node.usedBytes,t+n)},mmap(e,t,n,r,s){if(!a.isFile(e.node.mode))throw new a.ErrnoError(43);var o,p,g=e.node.contents;if(!(s&2)&&g&&g.buffer===xe.buffer)p=!1,o=g.byteOffset;else{if(p=!0,o=vt(t),!o)throw new a.ErrnoError(48);g&&((n>0||n+t<g.length)&&(g.subarray?g=g.subarray(n,n+t):g=Array.prototype.slice.call(g,n,n+t)),xe.set(g,o))}return{ptr:o,allocated:p}},msync(e,t,n,r,s){return oe.stream_ops.write(e,t,0,r,n,!1),0}}},Gt=(e,t,n,r)=>{var s=`al ${e}`;Le(e).then(o=>{t(new Uint8Array(o)),s&&Ye()},o=>{if(n)n();else throw`Loading data file "${e}" failed.`}),s&&nt()},$t=(e,t,n,r,s,o)=>{a.createDataFile(e,t,n,r,s,o)},Kt=i.preloadPlugins||[],Jt=(e,t,n,r)=>{typeof Browser<"u"&&Browser.init();var s=!1;return Kt.forEach(o=>{s||o.canHandle(t)&&(o.handle(e,t,n,r),s=!0)}),s},Xt=(e,t,n,r,s,o,p,g,P,R)=>{var z=t?ke.resolve(fe.join2(e,t)):e;function Q(T){function A(D){R?.(),g||$t(e,t,D,r,s,P),o?.(),Ye()}Jt(T,z,A,()=>{p?.(),Ye()})||A(T)}nt(),typeof n=="string"?Gt(n,Q,p):Q(n)},Yt=e=>{var t={r:0,"r+":2,w:577,"w+":578,a:1089,"a+":1090},n=t[e];if(typeof n>"u")throw new Error(`Unknown file open mode: ${e}`);return n},at=(e,t)=>{var n=0;return e&&(n|=365),t&&(n|=146),n},a={root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:!1,ignorePermissions:!0,ErrnoError:class{constructor(e){this.name="ErrnoError",this.errno=e}},genericErrors:{},filesystems:null,syncFSRequests:0,readFiles:{},FSStream:class{constructor(){this.shared={}}get object(){return this.node}set object(e){this.node=e}get isRead(){return(this.flags&2097155)!==1}get isWrite(){return(this.flags&2097155)!==0}get isAppend(){return this.flags&1024}get flags(){return this.shared.flags}set flags(e){this.shared.flags=e}get position(){return this.shared.position}set position(e){this.shared.position=e}},FSNode:class{constructor(e,t,n,r){e||(e=this),this.parent=e,this.mount=e.mount,this.mounted=null,this.id=a.nextInode++,this.name=t,this.mode=n,this.node_ops={},this.stream_ops={},this.rdev=r,this.readMode=365,this.writeMode=146}get read(){return(this.mode&this.readMode)===this.readMode}set read(e){e?this.mode|=this.readMode:this.mode&=~this.readMode}get write(){return(this.mode&this.writeMode)===this.writeMode}set write(e){e?this.mode|=this.writeMode:this.mode&=~this.writeMode}get isFolder(){return a.isDir(this.mode)}get isDevice(){return a.isChrdev(this.mode)}},lookupPath(e,t={}){if(e=ke.resolve(e),!e)return{path:"",node:null};var n={follow_mount:!0,recurse_count:0};if(t=Object.assign(n,t),t.recurse_count>8)throw new a.ErrnoError(32);for(var r=e.split("/").filter(Q=>!!Q),s=a.root,o="/",p=0;p<r.length;p++){var g=p===r.length-1;if(g&&t.parent)break;if(s=a.lookupNode(s,r[p]),o=fe.join2(o,r[p]),a.isMountpoint(s)&&(!g||g&&t.follow_mount)&&(s=s.mounted.root),!g||t.follow)for(var P=0;a.isLink(s.mode);){var R=a.readlink(o);o=ke.resolve(fe.dirname(o),R);var z=a.lookupPath(o,{recurse_count:t.recurse_count+1});if(s=z.node,P++>40)throw new a.ErrnoError(32)}}return{path:o,node:s}},getPath(e){for(var t;;){if(a.isRoot(e)){var n=e.mount.mountpoint;return t?n[n.length-1]!=="/"?`${n}/${t}`:n+t:n}t=t?`${e.name}/${t}`:e.name,e=e.parent}},hashName(e,t){for(var n=0,r=0;r<t.length;r++)n=(n<<5)-n+t.charCodeAt(r)|0;return(e+n>>>0)%a.nameTable.length},hashAddNode(e){var t=a.hashName(e.parent.id,e.name);e.name_next=a.nameTable[t],a.nameTable[t]=e},hashRemoveNode(e){var t=a.hashName(e.parent.id,e.name);if(a.nameTable[t]===e)a.nameTable[t]=e.name_next;else for(var n=a.nameTable[t];n;){if(n.name_next===e){n.name_next=e.name_next;break}n=n.name_next}},lookupNode(e,t){var n=a.mayLookup(e);if(n)throw new a.ErrnoError(n);for(var r=a.hashName(e.id,t),s=a.nameTable[r];s;s=s.name_next){var o=s.name;if(s.parent.id===e.id&&o===t)return s}return a.lookup(e,t)},createNode(e,t,n,r){var s=new a.FSNode(e,t,n,r);return a.hashAddNode(s),s},destroyNode(e){a.hashRemoveNode(e)},isRoot(e){return e===e.parent},isMountpoint(e){return!!e.mounted},isFile(e){return(e&61440)===32768},isDir(e){return(e&61440)===16384},isLink(e){return(e&61440)===40960},isChrdev(e){return(e&61440)===8192},isBlkdev(e){return(e&61440)===24576},isFIFO(e){return(e&61440)===4096},isSocket(e){return(e&49152)===49152},flagsToPermissionString(e){var t=["r","w","rw"][e&3];return e&512&&(t+="w"),t},nodePermissions(e,t){return a.ignorePermissions?0:t.includes("r")&&!(e.mode&292)||t.includes("w")&&!(e.mode&146)||t.includes("x")&&!(e.mode&73)?2:0},mayLookup(e){if(!a.isDir(e.mode))return 54;var t=a.nodePermissions(e,"x");return t||(e.node_ops.lookup?0:2)},mayCreate(e,t){try{var n=a.lookupNode(e,t);return 20}catch{}return a.nodePermissions(e,"wx")},mayDelete(e,t,n){var r;try{r=a.lookupNode(e,t)}catch(o){return o.errno}var s=a.nodePermissions(e,"wx");if(s)return s;if(n){if(!a.isDir(r.mode))return 54;if(a.isRoot(r)||a.getPath(r)===a.cwd())return 10}else if(a.isDir(r.mode))return 31;return 0},mayOpen(e,t){return e?a.isLink(e.mode)?32:a.isDir(e.mode)&&(a.flagsToPermissionString(t)!=="r"||t&512)?31:a.nodePermissions(e,a.flagsToPermissionString(t)):44},MAX_OPEN_FDS:4096,nextfd(){for(var e=0;e<=a.MAX_OPEN_FDS;e++)if(!a.streams[e])return e;throw new a.ErrnoError(33)},getStreamChecked(e){var t=a.getStream(e);if(!t)throw new a.ErrnoError(8);return t},getStream:e=>a.streams[e],createStream(e,t=-1){return e=Object.assign(new a.FSStream,e),t==-1&&(t=a.nextfd()),e.fd=t,a.streams[t]=e,e},closeStream(e){a.streams[e]=null},dupStream(e,t=-1){var n=a.createStream(e,t);return n.stream_ops?.dup?.(n),n},chrdev_stream_ops:{open(e){var t=a.getDevice(e.node.rdev);e.stream_ops=t.stream_ops,e.stream_ops.open?.(e)},llseek(){throw new a.ErrnoError(70)}},major:e=>e>>8,minor:e=>e&255,makedev:(e,t)=>e<<8|t,registerDevice(e,t){a.devices[e]={stream_ops:t}},getDevice:e=>a.devices[e],getMounts(e){for(var t=[],n=[e];n.length;){var r=n.pop();t.push(r),n.push(...r.mounts)}return t},syncfs(e,t){typeof e=="function"&&(t=e,e=!1),a.syncFSRequests++,a.syncFSRequests>1&&Pe(`warning: ${a.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);var n=a.getMounts(a.root.mount),r=0;function s(p){return a.syncFSRequests--,t(p)}function o(p){if(p)return o.errored?void 0:(o.errored=!0,s(p));++r>=n.length&&s(null)}n.forEach(p=>{if(!p.type.syncfs)return o(null);p.type.syncfs(p,e,o)})},mount(e,t,n){var r=n==="/",s=!n,o;if(r&&a.root)throw new a.ErrnoError(10);if(!r&&!s){var p=a.lookupPath(n,{follow_mount:!1});if(n=p.path,o=p.node,a.isMountpoint(o))throw new a.ErrnoError(10);if(!a.isDir(o.mode))throw new a.ErrnoError(54)}var g={type:e,opts:t,mountpoint:n,mounts:[]},P=e.mount(g);return P.mount=g,g.root=P,r?a.root=P:o&&(o.mounted=g,o.mount&&o.mount.mounts.push(g)),P},unmount(e){var t=a.lookupPath(e,{follow_mount:!1});if(!a.isMountpoint(t.node))throw new a.ErrnoError(28);var n=t.node,r=n.mounted,s=a.getMounts(r);Object.keys(a.nameTable).forEach(p=>{for(var g=a.nameTable[p];g;){var P=g.name_next;s.includes(g.mount)&&a.destroyNode(g),g=P}}),n.mounted=null;var o=n.mount.mounts.indexOf(r);n.mount.mounts.splice(o,1)},lookup(e,t){return e.node_ops.lookup(e,t)},mknod(e,t,n){var r=a.lookupPath(e,{parent:!0}),s=r.node,o=fe.basename(e);if(!o||o==="."||o==="..")throw new a.ErrnoError(28);var p=a.mayCreate(s,o);if(p)throw new a.ErrnoError(p);if(!s.node_ops.mknod)throw new a.ErrnoError(63);return s.node_ops.mknod(s,o,t,n)},create(e,t){return t=t!==void 0?t:438,t&=4095,t|=32768,a.mknod(e,t,0)},mkdir(e,t){return t=t!==void 0?t:511,t&=1023,t|=16384,a.mknod(e,t,0)},mkdirTree(e,t){for(var n=e.split("/"),r="",s=0;s<n.length;++s)if(n[s]){r+="/"+n[s];try{a.mkdir(r,t)}catch(o){if(o.errno!=20)throw o}}},mkdev(e,t,n){return typeof n>"u"&&(n=t,t=438),t|=8192,a.mknod(e,t,n)},symlink(e,t){if(!ke.resolve(e))throw new a.ErrnoError(44);var n=a.lookupPath(t,{parent:!0}),r=n.node;if(!r)throw new a.ErrnoError(44);var s=fe.basename(t),o=a.mayCreate(r,s);if(o)throw new a.ErrnoError(o);if(!r.node_ops.symlink)throw new a.ErrnoError(63);return r.node_ops.symlink(r,s,e)},rename(e,t){var n=fe.dirname(e),r=fe.dirname(t),s=fe.basename(e),o=fe.basename(t),p,g,P;if(p=a.lookupPath(e,{parent:!0}),g=p.node,p=a.lookupPath(t,{parent:!0}),P=p.node,!g||!P)throw new a.ErrnoError(44);if(g.mount!==P.mount)throw new a.ErrnoError(75);var R=a.lookupNode(g,s),z=ke.relative(e,r);if(z.charAt(0)!==".")throw new a.ErrnoError(28);if(z=ke.relative(t,n),z.charAt(0)!==".")throw new a.ErrnoError(55);var Q;try{Q=a.lookupNode(P,o)}catch{}if(R!==Q){var T=a.isDir(R.mode),A=a.mayDelete(g,s,T);if(A)throw new a.ErrnoError(A);if(A=Q?a.mayDelete(P,o,T):a.mayCreate(P,o),A)throw new a.ErrnoError(A);if(!g.node_ops.rename)throw new a.ErrnoError(63);if(a.isMountpoint(R)||Q&&a.isMountpoint(Q))throw new a.ErrnoError(10);if(P!==g&&(A=a.nodePermissions(g,"w"),A))throw new a.ErrnoError(A);a.hashRemoveNode(R);try{g.node_ops.rename(R,P,o),R.parent=P}catch(D){throw D}finally{a.hashAddNode(R)}}},rmdir(e){var t=a.lookupPath(e,{parent:!0}),n=t.node,r=fe.basename(e),s=a.lookupNode(n,r),o=a.mayDelete(n,r,!0);if(o)throw new a.ErrnoError(o);if(!n.node_ops.rmdir)throw new a.ErrnoError(63);if(a.isMountpoint(s))throw new a.ErrnoError(10);n.node_ops.rmdir(n,r),a.destroyNode(s)},readdir(e){var t=a.lookupPath(e,{follow:!0}),n=t.node;if(!n.node_ops.readdir)throw new a.ErrnoError(54);return n.node_ops.readdir(n)},unlink(e){var t=a.lookupPath(e,{parent:!0}),n=t.node;if(!n)throw new a.ErrnoError(44);var r=fe.basename(e),s=a.lookupNode(n,r),o=a.mayDelete(n,r,!1);if(o)throw new a.ErrnoError(o);if(!n.node_ops.unlink)throw new a.ErrnoError(63);if(a.isMountpoint(s))throw new a.ErrnoError(10);n.node_ops.unlink(n,r),a.destroyNode(s)},readlink(e){var t=a.lookupPath(e),n=t.node;if(!n)throw new a.ErrnoError(44);if(!n.node_ops.readlink)throw new a.ErrnoError(28);return ke.resolve(a.getPath(n.parent),n.node_ops.readlink(n))},stat(e,t){var n=a.lookupPath(e,{follow:!t}),r=n.node;if(!r)throw new a.ErrnoError(44);if(!r.node_ops.getattr)throw new a.ErrnoError(63);return r.node_ops.getattr(r)},lstat(e){return a.stat(e,!0)},chmod(e,t,n){var r;if(typeof e=="string"){var s=a.lookupPath(e,{follow:!n});r=s.node}else r=e;if(!r.node_ops.setattr)throw new a.ErrnoError(63);r.node_ops.setattr(r,{mode:t&4095|r.mode&-4096,timestamp:Date.now()})},lchmod(e,t){a.chmod(e,t,!0)},fchmod(e,t){var n=a.getStreamChecked(e);a.chmod(n.node,t)},chown(e,t,n,r){var s;if(typeof e=="string"){var o=a.lookupPath(e,{follow:!r});s=o.node}else s=e;if(!s.node_ops.setattr)throw new a.ErrnoError(63);s.node_ops.setattr(s,{timestamp:Date.now()})},lchown(e,t,n){a.chown(e,t,n,!0)},fchown(e,t,n){var r=a.getStreamChecked(e);a.chown(r.node,t,n)},truncate(e,t){if(t<0)throw new a.ErrnoError(28);var n;if(typeof e=="string"){var r=a.lookupPath(e,{follow:!0});n=r.node}else n=e;if(!n.node_ops.setattr)throw new a.ErrnoError(63);if(a.isDir(n.mode))throw new a.ErrnoError(31);if(!a.isFile(n.mode))throw new a.ErrnoError(28);var s=a.nodePermissions(n,"w");if(s)throw new a.ErrnoError(s);n.node_ops.setattr(n,{size:t,timestamp:Date.now()})},ftruncate(e,t){var n=a.getStreamChecked(e);if((n.flags&2097155)===0)throw new a.ErrnoError(28);a.truncate(n.node,t)},utime(e,t,n){var r=a.lookupPath(e,{follow:!0}),s=r.node;s.node_ops.setattr(s,{timestamp:Math.max(t,n)})},open(e,t,n){if(e==="")throw new a.ErrnoError(44);t=typeof t=="string"?Yt(t):t,t&64?(n=typeof n>"u"?438:n,n=n&4095|32768):n=0;var r;if(typeof e=="object")r=e;else{e=fe.normalize(e);try{var s=a.lookupPath(e,{follow:!(t&131072)});r=s.node}catch{}}var o=!1;if(t&64)if(r){if(t&128)throw new a.ErrnoError(20)}else r=a.mknod(e,n,0),o=!0;if(!r)throw new a.ErrnoError(44);if(a.isChrdev(r.mode)&&(t&=-513),t&65536&&!a.isDir(r.mode))throw new a.ErrnoError(54);if(!o){var p=a.mayOpen(r,t);if(p)throw new a.ErrnoError(p)}t&512&&!o&&a.truncate(r,0),t&=-131713;var g=a.createStream({node:r,path:a.getPath(r),flags:t,seekable:!0,position:0,stream_ops:r.stream_ops,ungotten:[],error:!1});return g.stream_ops.open&&g.stream_ops.open(g),i.logReadFiles&&!(t&1)&&(e in a.readFiles||(a.readFiles[e]=1)),g},close(e){if(a.isClosed(e))throw new a.ErrnoError(8);e.getdents&&(e.getdents=null);try{e.stream_ops.close&&e.stream_ops.close(e)}catch(t){throw t}finally{a.closeStream(e.fd)}e.fd=null},isClosed(e){return e.fd===null},llseek(e,t,n){if(a.isClosed(e))throw new a.ErrnoError(8);if(!e.seekable||!e.stream_ops.llseek)throw new a.ErrnoError(70);if(n!=0&&n!=1&&n!=2)throw new a.ErrnoError(28);return e.position=e.stream_ops.llseek(e,t,n),e.ungotten=[],e.position},read(e,t,n,r,s){if(r<0||s<0)throw new a.ErrnoError(28);if(a.isClosed(e))throw new a.ErrnoError(8);if((e.flags&2097155)===1)throw new a.ErrnoError(8);if(a.isDir(e.node.mode))throw new a.ErrnoError(31);if(!e.stream_ops.read)throw new a.ErrnoError(28);var o=typeof s<"u";if(!o)s=e.position;else if(!e.seekable)throw new a.ErrnoError(70);var p=e.stream_ops.read(e,t,n,r,s);return o||(e.position+=p),p},write(e,t,n,r,s,o){if(r<0||s<0)throw new a.ErrnoError(28);if(a.isClosed(e))throw new a.ErrnoError(8);if((e.flags&2097155)===0)throw new a.ErrnoError(8);if(a.isDir(e.node.mode))throw new a.ErrnoError(31);if(!e.stream_ops.write)throw new a.ErrnoError(28);e.seekable&&e.flags&1024&&a.llseek(e,0,2);var p=typeof s<"u";if(!p)s=e.position;else if(!e.seekable)throw new a.ErrnoError(70);var g=e.stream_ops.write(e,t,n,r,s,o);return p||(e.position+=g),g},allocate(e,t,n){if(a.isClosed(e))throw new a.ErrnoError(8);if(t<0||n<=0)throw new a.ErrnoError(28);if((e.flags&2097155)===0)throw new a.ErrnoError(8);if(!a.isFile(e.node.mode)&&!a.isDir(e.node.mode))throw new a.ErrnoError(43);if(!e.stream_ops.allocate)throw new a.ErrnoError(138);e.stream_ops.allocate(e,t,n)},mmap(e,t,n,r,s){if((r&2)!==0&&(s&2)===0&&(e.flags&2097155)!==2)throw new a.ErrnoError(2);if((e.flags&2097155)===1)throw new a.ErrnoError(2);if(!e.stream_ops.mmap)throw new a.ErrnoError(43);if(!t)throw new a.ErrnoError(28);return e.stream_ops.mmap(e,t,n,r,s)},msync(e,t,n,r,s){return e.stream_ops.msync?e.stream_ops.msync(e,t,n,r,s):0},ioctl(e,t,n){if(!e.stream_ops.ioctl)throw new a.ErrnoError(59);return e.stream_ops.ioctl(e,t,n)},readFile(e,t={}){if(t.flags=t.flags||0,t.encoding=t.encoding||"binary",t.encoding!=="utf8"&&t.encoding!=="binary")throw new Error(`Invalid encoding type "${t.encoding}"`);var n,r=a.open(e,t.flags),s=a.stat(e),o=s.size,p=new Uint8Array(o);return a.read(r,p,0,o,0),t.encoding==="utf8"?n=Be(p):t.encoding==="binary"&&(n=p),a.close(r),n},writeFile(e,t,n={}){n.flags=n.flags||577;var r=a.open(e,n.flags,n.mode);if(typeof t=="string"){var s=new Uint8Array(Ze(t)+1),o=lt(t,s,0,s.length);a.write(r,s,0,o,void 0,n.canOwn)}else if(ArrayBuffer.isView(t))a.write(r,t,0,t.byteLength,void 0,n.canOwn);else throw new Error("Unsupported data type");a.close(r)},cwd:()=>a.currentPath,chdir(e){var t=a.lookupPath(e,{follow:!0});if(t.node===null)throw new a.ErrnoError(44);if(!a.isDir(t.node.mode))throw new a.ErrnoError(54);var n=a.nodePermissions(t.node,"x");if(n)throw new a.ErrnoError(n);a.currentPath=t.path},createDefaultDirectories(){a.mkdir("/tmp"),a.mkdir("/home"),a.mkdir("/home/web_user")},createDefaultDevices(){a.mkdir("/dev"),a.registerDevice(a.makedev(1,3),{read:()=>0,write:(r,s,o,p,g)=>p}),a.mkdev("/dev/null",a.makedev(1,3)),Re.register(a.makedev(5,0),Re.default_tty_ops),Re.register(a.makedev(6,0),Re.default_tty1_ops),a.mkdev("/dev/tty",a.makedev(5,0)),a.mkdev("/dev/tty1",a.makedev(6,0));var e=new Uint8Array(1024),t=0,n=()=>(t===0&&(t=bt(e).byteLength),e[--t]);a.createDevice("/dev","random",n),a.createDevice("/dev","urandom",n),a.mkdir("/dev/shm"),a.mkdir("/dev/shm/tmp")},createSpecialDirectories(){a.mkdir("/proc");var e=a.mkdir("/proc/self");a.mkdir("/proc/self/fd"),a.mount({mount(){var t=a.createNode(e,"fd",16895,73);return t.node_ops={lookup(n,r){var s=+r,o=a.getStreamChecked(s),p={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:()=>o.path}};return p.parent=p,p}},t}},{},"/proc/self/fd")},createStandardStreams(e,t,n){e?a.createDevice("/dev","stdin",e):a.symlink("/dev/tty","/dev/stdin"),t?a.createDevice("/dev","stdout",null,t):a.symlink("/dev/tty","/dev/stdout"),n?a.createDevice("/dev","stderr",null,n):a.symlink("/dev/tty1","/dev/stderr"),a.open("/dev/stdin",0),a.open("/dev/stdout",1),a.open("/dev/stderr",1)},staticInit(){[44].forEach(e=>{a.genericErrors[e]=new a.ErrnoError(e),a.genericErrors[e].stack="<generic error, no stack>"}),a.nameTable=new Array(4096),a.mount(oe,{},"/"),a.createDefaultDirectories(),a.createDefaultDevices(),a.createSpecialDirectories(),a.filesystems={MEMFS:oe}},init(e,t,n){a.initialized=!0,e??=i.stdin,t??=i.stdout,n??=i.stderr,a.createStandardStreams(e,t,n)},quit(){a.initialized=!1;for(var e=0;e<a.streams.length;e++){var t=a.streams[e];t&&a.close(t)}},findObject(e,t){var n=a.analyzePath(e,t);return n.exists?n.object:null},analyzePath(e,t){try{var n=a.lookupPath(e,{follow:!t});e=n.path}catch{}var r={isRoot:!1,exists:!1,error:0,name:null,path:null,object:null,parentExists:!1,parentPath:null,parentObject:null};try{var n=a.lookupPath(e,{parent:!0});r.parentExists=!0,r.parentPath=n.path,r.parentObject=n.node,r.name=fe.basename(e),n=a.lookupPath(e,{follow:!t}),r.exists=!0,r.path=n.path,r.object=n.node,r.name=n.node.name,r.isRoot=n.path==="/"}catch(s){r.error=s.errno}return r},createPath(e,t,n,r){e=typeof e=="string"?e:a.getPath(e);for(var s=t.split("/").reverse();s.length;){var o=s.pop();if(o){var p=fe.join2(e,o);try{a.mkdir(p)}catch{}e=p}}return p},createFile(e,t,n,r,s){var o=fe.join2(typeof e=="string"?e:a.getPath(e),t),p=at(r,s);return a.create(o,p)},createDataFile(e,t,n,r,s,o){var p=t;e&&(e=typeof e=="string"?e:a.getPath(e),p=t?fe.join2(e,t):e);var g=at(r,s),P=a.create(p,g);if(n){if(typeof n=="string"){for(var R=new Array(n.length),z=0,Q=n.length;z<Q;++z)R[z]=n.charCodeAt(z);n=R}a.chmod(P,g|146);var T=a.open(P,577);a.write(T,n,0,n.length,0,o),a.close(T),a.chmod(P,g)}},createDevice(e,t,n,r){var s=fe.join2(typeof e=="string"?e:a.getPath(e),t),o=at(!!n,!!r);a.createDevice.major??=64;var p=a.makedev(a.createDevice.major++,0);return a.registerDevice(p,{open(g){g.seekable=!1},close(g){r?.buffer?.length&&r(10)},read(g,P,R,z,Q){for(var T=0,A=0;A<z;A++){var D;try{D=n()}catch{throw new a.ErrnoError(29)}if(D===void 0&&T===0)throw new a.ErrnoError(6);if(D==null)break;T++,P[R+A]=D}return T&&(g.node.timestamp=Date.now()),T},write(g,P,R,z,Q){for(var T=0;T<z;T++)try{r(P[R+T])}catch{throw new a.ErrnoError(29)}return z&&(g.node.timestamp=Date.now()),T}}),a.mkdev(s,o,p)},forceLoadFile(e){if(e.isDevice||e.isFolder||e.link||e.contents)return!0;if(typeof XMLHttpRequest<"u")throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");try{e.contents=Me(e.url),e.usedBytes=e.contents.length}catch{throw new a.ErrnoError(29)}},createLazyFile(e,t,n,r,s){class o{constructor(){this.lengthKnown=!1,this.chunks=[]}get(A){if(!(A>this.length-1||A<0)){var D=A%this.chunkSize,q=A/this.chunkSize|0;return this.getter(q)[D]}}setDataGetter(A){this.getter=A}cacheLength(){var A=new XMLHttpRequest;if(A.open("HEAD",n,!1),A.send(null),!(A.status>=200&&A.status<300||A.status===304))throw new Error("Couldn't load "+n+". Status: "+A.status);var D=Number(A.getResponseHeader("Content-length")),q,w=(q=A.getResponseHeader("Accept-Ranges"))&&q==="bytes",x=(q=A.getResponseHeader("Content-Encoding"))&&q==="gzip",N=1024*1024;w||(N=D);var O=(L,$)=>{if(L>$)throw new Error("invalid range ("+L+", "+$+") or no bytes requested!");if($>D-1)throw new Error("only "+D+" bytes available! programmer error!");var c=new XMLHttpRequest;if(c.open("GET",n,!1),D!==N&&c.setRequestHeader("Range","bytes="+L+"-"+$),c.responseType="arraybuffer",c.overrideMimeType&&c.overrideMimeType("text/plain; charset=x-user-defined"),c.send(null),!(c.status>=200&&c.status<300||c.status===304))throw new Error("Couldn't load "+n+". Status: "+c.status);return c.response!==void 0?new Uint8Array(c.response||[]):wt(c.responseText||"")},S=this;S.setDataGetter(L=>{var $=L*N,c=(L+1)*N-1;if(c=Math.min(c,D-1),typeof S.chunks[L]>"u"&&(S.chunks[L]=O($,c)),typeof S.chunks[L]>"u")throw new Error("doXHR failed!");return S.chunks[L]}),(x||!D)&&(N=D=1,D=this.getter(0).length,N=D,He("LazyFiles on gzip forces download of the whole file when length is accessed")),this._length=D,this._chunkSize=N,this.lengthKnown=!0}get length(){return this.lengthKnown||this.cacheLength(),this._length}get chunkSize(){return this.lengthKnown||this.cacheLength(),this._chunkSize}}if(typeof XMLHttpRequest<"u"){if(!Oe)throw"Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";var p=new o,g={isDevice:!1,contents:p}}else var g={isDevice:!1,url:n};var P=a.createFile(e,t,g,r,s);g.contents?P.contents=g.contents:g.url&&(P.contents=null,P.url=g.url),Object.defineProperties(P,{usedBytes:{get:function(){return this.contents.length}}});var R={},z=Object.keys(P.stream_ops);z.forEach(T=>{var A=P.stream_ops[T];R[T]=(...D)=>(a.forceLoadFile(P),A(...D))});function Q(T,A,D,q,w){var x=T.node.contents;if(w>=x.length)return 0;var N=Math.min(x.length-w,q);if(x.slice)for(var O=0;O<N;O++)A[D+O]=x[w+O];else for(var O=0;O<N;O++)A[D+O]=x.get(w+O);return N}return R.read=(T,A,D,q,w)=>(a.forceLoadFile(P),Q(T,A,D,q,w)),R.mmap=(T,A,D,q,w)=>{a.forceLoadFile(P);var x=vt(A);if(!x)throw new a.ErrnoError(48);return Q(T,xe,x,A,D),{ptr:x,allocated:!0}},P.stream_ops=R,P}},Zt=(e,t)=>e?Be(je,e,t):"",ae={DEFAULT_POLLMASK:5,calculateAt(e,t,n){if(fe.isAbs(t))return t;var r;if(e===-100)r=a.cwd();else{var s=ae.getStreamFromFD(e);r=s.path}if(t.length==0){if(!n)throw new a.ErrnoError(44);return r}return fe.join2(r,t)},doStat(e,t,n){var r=e(t);ue[n>>2]=r.dev,ue[n+4>>2]=r.mode,we[n+8>>2]=r.nlink,ue[n+12>>2]=r.uid,ue[n+16>>2]=r.gid,ue[n+20>>2]=r.rdev,Ie[n+24>>3]=BigInt(r.size),ue[n+32>>2]=4096,ue[n+36>>2]=r.blocks;var s=r.atime.getTime(),o=r.mtime.getTime(),p=r.ctime.getTime();return Ie[n+40>>3]=BigInt(Math.floor(s/1e3)),we[n+48>>2]=s%1e3*1e3*1e3,Ie[n+56>>3]=BigInt(Math.floor(o/1e3)),we[n+64>>2]=o%1e3*1e3*1e3,Ie[n+72>>3]=BigInt(Math.floor(p/1e3)),we[n+80>>2]=p%1e3*1e3*1e3,Ie[n+88>>3]=BigInt(r.ino),0},doMsync(e,t,n,r,s){if(!a.isFile(t.node.mode))throw new a.ErrnoError(43);if(r&2)return 0;var o=je.slice(e,e+n);a.msync(t,o,s,n,r)},getStreamFromFD(e){var t=a.getStreamChecked(e);return t},varargs:void 0,getStr(e){var t=Zt(e);return t}};function en(e,t){try{return e=ae.getStr(e),a.chmod(e,t),0}catch(n){if(typeof a>"u"||n.name!=="ErrnoError")throw n;return-n.errno}}function tn(e,t,n,r){try{if(t=ae.getStr(t),t=ae.calculateAt(e,t),n&-8)return-28;var s=a.lookupPath(t,{follow:!0}),o=s.node;if(!o)return-44;var p="";return n&4&&(p+="r"),n&2&&(p+="w"),n&1&&(p+="x"),p&&a.nodePermissions(o,p)?-2:0}catch(g){if(typeof a>"u"||g.name!=="ErrnoError")throw g;return-g.errno}}function nn(e,t){try{return a.fchmod(e,t),0}catch(n){if(typeof a>"u"||n.name!=="ErrnoError")throw n;return-n.errno}}function rn(e,t,n){try{return a.fchown(e,t,n),0}catch(r){if(typeof a>"u"||r.name!=="ErrnoError")throw r;return-r.errno}}function et(){var e=ue[+ae.varargs>>2];return ae.varargs+=4,e}var Ue=et;function sn(e,t,n){ae.varargs=n;try{var r=ae.getStreamFromFD(e);switch(t){case 0:{var s=et();if(s<0)return-28;for(;a.streams[s];)s++;var o;return o=a.dupStream(r,s),o.fd}case 1:case 2:return 0;case 3:return r.flags;case 4:{var s=et();return r.flags|=s,0}case 12:{var s=Ue(),p=0;return Ve[s+p>>1]=2,0}case 13:case 14:return 0}return-28}catch(g){if(typeof a>"u"||g.name!=="ErrnoError")throw g;return-g.errno}}function on(e,t){try{var n=ae.getStreamFromFD(e);return ae.doStat(a.stat,n.path,t)}catch(r){if(typeof a>"u"||r.name!=="ErrnoError")throw r;return-r.errno}}var ln=9007199254740992,an=-9007199254740992,$e=e=>e<an||e>ln?NaN:Number(e);function cn(e,t){t=$e(t);try{return isNaN(t)?61:(a.ftruncate(e,t),0)}catch(n){if(typeof a>"u"||n.name!=="ErrnoError")throw n;return-n.errno}}var ze=(e,t,n)=>lt(e,je,t,n);function _n(e,t){try{if(t===0)return-28;var n=a.cwd(),r=Ze(n)+1;return t<r?-68:(ze(n,e,t),r)}catch(s){if(typeof a>"u"||s.name!=="ErrnoError")throw s;return-s.errno}}function un(e,t,n){ae.varargs=n;try{var r=ae.getStreamFromFD(e);switch(t){case 21509:return r.tty?0:-59;case 21505:{if(!r.tty)return-59;if(r.tty.ops.ioctl_tcgets){var s=r.tty.ops.ioctl_tcgets(r),o=Ue();ue[o>>2]=s.c_iflag||0,ue[o+4>>2]=s.c_oflag||0,ue[o+8>>2]=s.c_cflag||0,ue[o+12>>2]=s.c_lflag||0;for(var p=0;p<32;p++)xe[o+p+17]=s.c_cc[p]||0;return 0}return 0}case 21510:case 21511:case 21512:return r.tty?0:-59;case 21506:case 21507:case 21508:{if(!r.tty)return-59;if(r.tty.ops.ioctl_tcsets){for(var o=Ue(),g=ue[o>>2],P=ue[o+4>>2],R=ue[o+8>>2],z=ue[o+12>>2],Q=[],p=0;p<32;p++)Q.push(xe[o+p+17]);return r.tty.ops.ioctl_tcsets(r.tty,t,{c_iflag:g,c_oflag:P,c_cflag:R,c_lflag:z,c_cc:Q})}return 0}case 21519:{if(!r.tty)return-59;var o=Ue();return ue[o>>2]=0,0}case 21520:return r.tty?-28:-59;case 21531:{var o=Ue();return a.ioctl(r,t,o)}case 21523:{if(!r.tty)return-59;if(r.tty.ops.ioctl_tiocgwinsz){var T=r.tty.ops.ioctl_tiocgwinsz(r.tty),o=Ue();Ve[o>>1]=T[0],Ve[o+2>>1]=T[1]}return 0}case 21524:return r.tty?0:-59;case 21515:return r.tty?0:-59;default:return-28}}catch(A){if(typeof a>"u"||A.name!=="ErrnoError")throw A;return-A.errno}}function fn(e,t){try{return e=ae.getStr(e),ae.doStat(a.lstat,e,t)}catch(n){if(typeof a>"u"||n.name!=="ErrnoError")throw n;return-n.errno}}function dn(e,t,n){try{return t=ae.getStr(t),t=ae.calculateAt(e,t),t=fe.normalize(t),t[t.length-1]==="/"&&(t=t.substr(0,t.length-1)),a.mkdir(t,n,0),0}catch(r){if(typeof a>"u"||r.name!=="ErrnoError")throw r;return-r.errno}}function pn(e,t,n,r){try{t=ae.getStr(t);var s=r&256,o=r&4096;return r=r&-6401,t=ae.calculateAt(e,t,o),ae.doStat(s?a.lstat:a.stat,t,n)}catch(p){if(typeof a>"u"||p.name!=="ErrnoError")throw p;return-p.errno}}function mn(e,t,n,r){ae.varargs=r;try{t=ae.getStr(t),t=ae.calculateAt(e,t);var s=r?et():0;return a.open(t,n,s).fd}catch(o){if(typeof a>"u"||o.name!=="ErrnoError")throw o;return-o.errno}}function hn(e,t,n,r){try{if(t=ae.getStr(t),t=ae.calculateAt(e,t),r<=0)return-28;var s=a.readlink(t),o=Math.min(r,Ze(s)),p=xe[n+o];return ze(s,n,r+1),xe[n+o]=p,o}catch(g){if(typeof a>"u"||g.name!=="ErrnoError")throw g;return-g.errno}}function gn(e){try{return e=ae.getStr(e),a.rmdir(e),0}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return-t.errno}}function qn(e,t){try{return e=ae.getStr(e),ae.doStat(a.stat,e,t)}catch(n){if(typeof a>"u"||n.name!=="ErrnoError")throw n;return-n.errno}}function bn(e,t,n){try{return t=ae.getStr(t),t=ae.calculateAt(e,t),n===0?a.unlink(t):n===512?a.rmdir(t):rt("Invalid flags passed to unlinkat"),0}catch(r){if(typeof a>"u"||r.name!=="ErrnoError")throw r;return-r.errno}}var xt=e=>we[e>>2]+ue[e+4>>2]*4294967296;function yn(e,t,n,r){try{t=ae.getStr(t),t=ae.calculateAt(e,t,!0);var s=Date.now(),o,p;if(!n)o=s,p=s;else{var g=xt(n),P=ue[n+8>>2];P==1073741823?o=s:P==1073741822?o=-1:o=g*1e3+P/(1e3*1e3),n+=16,g=xt(n),P=ue[n+8>>2],P==1073741823?p=s:P==1073741822?p=-1:p=g*1e3+P/(1e3*1e3)}return(p!=-1||o!=-1)&&a.utime(t,o,p),0}catch(R){if(typeof a>"u"||R.name!=="ErrnoError")throw R;return-R.errno}}var wn=1,En=()=>wn,vn=e=>e%4===0&&(e%100!==0||e%400===0),xn=[0,31,60,91,121,152,182,213,244,274,305,335],Sn=[0,31,59,90,120,151,181,212,243,273,304,334],An=e=>{var t=vn(e.getFullYear()),n=t?xn:Sn,r=n[e.getMonth()]+e.getDate()-1;return r};function In(e,t){e=$e(e);var n=new Date(e*1e3);ue[t>>2]=n.getSeconds(),ue[t+4>>2]=n.getMinutes(),ue[t+8>>2]=n.getHours(),ue[t+12>>2]=n.getDate(),ue[t+16>>2]=n.getMonth(),ue[t+20>>2]=n.getFullYear()-1900,ue[t+24>>2]=n.getDay();var r=An(n)|0;ue[t+28>>2]=r,ue[t+36>>2]=-(n.getTimezoneOffset()*60);var s=new Date(n.getFullYear(),0,1),o=new Date(n.getFullYear(),6,1).getTimezoneOffset(),p=s.getTimezoneOffset(),g=(o!=p&&n.getTimezoneOffset()==Math.min(p,o))|0;ue[t+32>>2]=g}function kn(e,t,n,r,s,o,p){s=$e(s);try{if(isNaN(s))return 61;var g=ae.getStreamFromFD(r),P=a.mmap(g,e,s,t,n),R=P.ptr;return ue[o>>2]=P.allocated,we[p>>2]=R,0}catch(z){if(typeof a>"u"||z.name!=="ErrnoError")throw z;return-z.errno}}function Tn(e,t,n,r,s,o){o=$e(o);try{var p=ae.getStreamFromFD(s);n&2&&ae.doMsync(e,p,t,r,o)}catch(g){if(typeof a>"u"||g.name!=="ErrnoError")throw g;return-g.errno}}var Fn=(e,t,n,r)=>{var s=new Date().getFullYear(),o=new Date(s,0,1),p=new Date(s,6,1),g=o.getTimezoneOffset(),P=p.getTimezoneOffset(),R=Math.max(g,P);we[e>>2]=R*60,ue[t>>2]=+(g!=P);var z=A=>{var D=A>=0?"-":"+",q=Math.abs(A),w=String(Math.floor(q/60)).padStart(2,"0"),x=String(q%60).padStart(2,"0");return`UTC${D}${w}${x}`},Q=z(g),T=z(P);P<g?(ze(Q,n,17),ze(T,r,17)):(ze(Q,r,17),ze(T,n,17))},Pn=()=>Date.now(),On=()=>performance.now(),Ln=()=>2147483648,Cn=e=>{var t=Ce.buffer,n=(e-t.byteLength+65535)/65536|0;try{return Ce.grow(n),ft(),1}catch{}},Dn=e=>{var t=je.length;e>>>=0;var n=Ln();if(e>n)return!1;for(var r=1;r<=4;r*=2){var s=t*(1+.2/r);s=Math.min(s,e+100663296);var o=Math.min(n,Et(Math.max(e,s),65536)),p=Cn(o);if(p)return!0}return!1},ct={},Rn=()=>re||"./this.program",Ke=()=>{if(!Ke.strings){var e=(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",t={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:e,_:Rn()};for(var n in ct)ct[n]===void 0?delete t[n]:t[n]=ct[n];var r=[];for(var n in t)r.push(`${n}=${t[n]}`);Ke.strings=r}return Ke.strings},Nn=(e,t)=>{for(var n=0;n<e.length;++n)xe[t++]=e.charCodeAt(n);xe[t]=0},Mn=(e,t)=>{var n=0;return Ke().forEach((r,s)=>{var o=t+n;we[e+s*4>>2]=o,Nn(r,o),n+=r.length+1}),0},jn=(e,t)=>{var n=Ke();we[e>>2]=n.length;var r=0;return n.forEach(s=>r+=s.length+1),we[t>>2]=r,0};function Bn(e){try{var t=ae.getStreamFromFD(e);return a.close(t),0}catch(n){if(typeof a>"u"||n.name!=="ErrnoError")throw n;return n.errno}}function Un(e,t){try{var n=0,r=0,s=0,o=ae.getStreamFromFD(e),p=o.tty?2:a.isDir(o.mode)?3:a.isLink(o.mode)?7:4;return xe[t]=p,Ve[t+2>>1]=s,Ie[t+8>>3]=BigInt(n),Ie[t+16>>3]=BigInt(r),0}catch(g){if(typeof a>"u"||g.name!=="ErrnoError")throw g;return g.errno}}var zn=(e,t,n,r)=>{for(var s=0,o=0;o<n;o++){var p=we[t>>2],g=we[t+4>>2];t+=8;var P=a.read(e,xe,p,g,r);if(P<0)return-1;if(s+=P,P<g)break}return s};function Wn(e,t,n,r){try{var s=ae.getStreamFromFD(e),o=zn(s,t,n);return we[r>>2]=o,0}catch(p){if(typeof a>"u"||p.name!=="ErrnoError")throw p;return p.errno}}function Qn(e,t,n,r){t=$e(t);try{if(isNaN(t))return 61;var s=ae.getStreamFromFD(e);return a.llseek(s,t,n),Ie[r>>3]=BigInt(s.position),s.getdents&&t===0&&n===0&&(s.getdents=null),0}catch(o){if(typeof a>"u"||o.name!=="ErrnoError")throw o;return o.errno}}function Hn(e){try{var t=ae.getStreamFromFD(e);return t.stream_ops?.fsync?t.stream_ops.fsync(t):0}catch(n){if(typeof a>"u"||n.name!=="ErrnoError")throw n;return n.errno}}var Vn=(e,t,n,r)=>{for(var s=0,o=0;o<n;o++){var p=we[t>>2],g=we[t+4>>2];t+=8;var P=a.write(e,xe,p,g,r);if(P<0)return-1;if(s+=P,P<g)break}return s};function Gn(e,t,n,r){try{var s=ae.getStreamFromFD(e),o=Vn(s,t,n);return we[r>>2]=o,0}catch(p){if(typeof a>"u"||p.name!=="ErrnoError")throw p;return p.errno}}a.createPreloadedFile=Xt,a.staticInit();var St={__syscall_chmod:en,__syscall_faccessat:tn,__syscall_fchmod:nn,__syscall_fchown32:rn,__syscall_fcntl64:sn,__syscall_fstat64:on,__syscall_ftruncate64:cn,__syscall_getcwd:_n,__syscall_ioctl:un,__syscall_lstat64:fn,__syscall_mkdirat:dn,__syscall_newfstatat:pn,__syscall_openat:mn,__syscall_readlinkat:hn,__syscall_rmdir:gn,__syscall_stat64:qn,__syscall_unlinkat:bn,__syscall_utimensat:yn,_emscripten_get_now_is_monotonic:En,_localtime_js:In,_mmap_js:kn,_munmap_js:Tn,_tzset_js:Fn,emscripten_date_now:Pn,emscripten_get_now:On,emscripten_resize_heap:Dn,environ_get:Mn,environ_sizes_get:jn,fd_close:Bn,fd_fdstat_get:Un,fd_read:Wn,fd_seek:Qn,fd_sync:Hn,fd_write:Gn,memory:Ce},m=Wt();i._sqlite3_status64=(e,t,n,r)=>(i._sqlite3_status64=m.sqlite3_status64)(e,t,n,r),i._sqlite3_status=(e,t,n,r)=>(i._sqlite3_status=m.sqlite3_status)(e,t,n,r),i._sqlite3_db_status=(e,t,n,r,s)=>(i._sqlite3_db_status=m.sqlite3_db_status)(e,t,n,r,s),i._sqlite3_msize=e=>(i._sqlite3_msize=m.sqlite3_msize)(e),i._sqlite3_vfs_find=e=>(i._sqlite3_vfs_find=m.sqlite3_vfs_find)(e),i._sqlite3_initialize=()=>(i._sqlite3_initialize=m.sqlite3_initialize)(),i._sqlite3_malloc=e=>(i._sqlite3_malloc=m.sqlite3_malloc)(e),i._sqlite3_free=e=>(i._sqlite3_free=m.sqlite3_free)(e),i._sqlite3_vfs_register=(e,t)=>(i._sqlite3_vfs_register=m.sqlite3_vfs_register)(e,t),i._sqlite3_vfs_unregister=e=>(i._sqlite3_vfs_unregister=m.sqlite3_vfs_unregister)(e),i._sqlite3_malloc64=e=>(i._sqlite3_malloc64=m.sqlite3_malloc64)(e),i._sqlite3_realloc=(e,t)=>(i._sqlite3_realloc=m.sqlite3_realloc)(e,t),i._sqlite3_realloc64=(e,t)=>(i._sqlite3_realloc64=m.sqlite3_realloc64)(e,t),i._sqlite3_value_text=e=>(i._sqlite3_value_text=m.sqlite3_value_text)(e),i._sqlite3_randomness=(e,t)=>(i._sqlite3_randomness=m.sqlite3_randomness)(e,t),i._sqlite3_stricmp=(e,t)=>(i._sqlite3_stricmp=m.sqlite3_stricmp)(e,t),i._sqlite3_strnicmp=(e,t,n)=>(i._sqlite3_strnicmp=m.sqlite3_strnicmp)(e,t,n),i._sqlite3_uri_parameter=(e,t)=>(i._sqlite3_uri_parameter=m.sqlite3_uri_parameter)(e,t),i._sqlite3_uri_boolean=(e,t,n)=>(i._sqlite3_uri_boolean=m.sqlite3_uri_boolean)(e,t,n),i._sqlite3_serialize=(e,t,n,r)=>(i._sqlite3_serialize=m.sqlite3_serialize)(e,t,n,r),i._sqlite3_prepare_v2=(e,t,n,r,s)=>(i._sqlite3_prepare_v2=m.sqlite3_prepare_v2)(e,t,n,r,s),i._sqlite3_step=e=>(i._sqlite3_step=m.sqlite3_step)(e),i._sqlite3_column_int64=(e,t)=>(i._sqlite3_column_int64=m.sqlite3_column_int64)(e,t),i._sqlite3_reset=e=>(i._sqlite3_reset=m.sqlite3_reset)(e),i._sqlite3_exec=(e,t,n,r,s)=>(i._sqlite3_exec=m.sqlite3_exec)(e,t,n,r,s),i._sqlite3_column_int=(e,t)=>(i._sqlite3_column_int=m.sqlite3_column_int)(e,t),i._sqlite3_finalize=e=>(i._sqlite3_finalize=m.sqlite3_finalize)(e),i._sqlite3_file_control=(e,t,n,r)=>(i._sqlite3_file_control=m.sqlite3_file_control)(e,t,n,r),i._sqlite3_column_name=(e,t)=>(i._sqlite3_column_name=m.sqlite3_column_name)(e,t),i._sqlite3_column_text=(e,t)=>(i._sqlite3_column_text=m.sqlite3_column_text)(e,t),i._sqlite3_column_type=(e,t)=>(i._sqlite3_column_type=m.sqlite3_column_type)(e,t),i._sqlite3_errmsg=e=>(i._sqlite3_errmsg=m.sqlite3_errmsg)(e),i._sqlite3_deserialize=(e,t,n,r,s,o)=>(i._sqlite3_deserialize=m.sqlite3_deserialize)(e,t,n,r,s,o),i._sqlite3_clear_bindings=e=>(i._sqlite3_clear_bindings=m.sqlite3_clear_bindings)(e),i._sqlite3_value_blob=e=>(i._sqlite3_value_blob=m.sqlite3_value_blob)(e),i._sqlite3_value_bytes=e=>(i._sqlite3_value_bytes=m.sqlite3_value_bytes)(e),i._sqlite3_value_double=e=>(i._sqlite3_value_double=m.sqlite3_value_double)(e),i._sqlite3_value_int=e=>(i._sqlite3_value_int=m.sqlite3_value_int)(e),i._sqlite3_value_int64=e=>(i._sqlite3_value_int64=m.sqlite3_value_int64)(e),i._sqlite3_value_subtype=e=>(i._sqlite3_value_subtype=m.sqlite3_value_subtype)(e),i._sqlite3_value_pointer=(e,t)=>(i._sqlite3_value_pointer=m.sqlite3_value_pointer)(e,t),i._sqlite3_value_type=e=>(i._sqlite3_value_type=m.sqlite3_value_type)(e),i._sqlite3_value_nochange=e=>(i._sqlite3_value_nochange=m.sqlite3_value_nochange)(e),i._sqlite3_value_frombind=e=>(i._sqlite3_value_frombind=m.sqlite3_value_frombind)(e),i._sqlite3_value_dup=e=>(i._sqlite3_value_dup=m.sqlite3_value_dup)(e),i._sqlite3_value_free=e=>(i._sqlite3_value_free=m.sqlite3_value_free)(e),i._sqlite3_result_blob=(e,t,n,r)=>(i._sqlite3_result_blob=m.sqlite3_result_blob)(e,t,n,r),i._sqlite3_result_error_toobig=e=>(i._sqlite3_result_error_toobig=m.sqlite3_result_error_toobig)(e),i._sqlite3_result_error_nomem=e=>(i._sqlite3_result_error_nomem=m.sqlite3_result_error_nomem)(e),i._sqlite3_result_double=(e,t)=>(i._sqlite3_result_double=m.sqlite3_result_double)(e,t),i._sqlite3_result_error=(e,t,n)=>(i._sqlite3_result_error=m.sqlite3_result_error)(e,t,n),i._sqlite3_result_int=(e,t)=>(i._sqlite3_result_int=m.sqlite3_result_int)(e,t),i._sqlite3_result_int64=(e,t)=>(i._sqlite3_result_int64=m.sqlite3_result_int64)(e,t),i._sqlite3_result_null=e=>(i._sqlite3_result_null=m.sqlite3_result_null)(e),i._sqlite3_result_pointer=(e,t,n,r)=>(i._sqlite3_result_pointer=m.sqlite3_result_pointer)(e,t,n,r),i._sqlite3_result_subtype=(e,t)=>(i._sqlite3_result_subtype=m.sqlite3_result_subtype)(e,t),i._sqlite3_result_text=(e,t,n,r)=>(i._sqlite3_result_text=m.sqlite3_result_text)(e,t,n,r),i._sqlite3_result_zeroblob=(e,t)=>(i._sqlite3_result_zeroblob=m.sqlite3_result_zeroblob)(e,t),i._sqlite3_result_zeroblob64=(e,t)=>(i._sqlite3_result_zeroblob64=m.sqlite3_result_zeroblob64)(e,t),i._sqlite3_result_error_code=(e,t)=>(i._sqlite3_result_error_code=m.sqlite3_result_error_code)(e,t),i._sqlite3_user_data=e=>(i._sqlite3_user_data=m.sqlite3_user_data)(e),i._sqlite3_context_db_handle=e=>(i._sqlite3_context_db_handle=m.sqlite3_context_db_handle)(e),i._sqlite3_vtab_nochange=e=>(i._sqlite3_vtab_nochange=m.sqlite3_vtab_nochange)(e),i._sqlite3_vtab_in_first=(e,t)=>(i._sqlite3_vtab_in_first=m.sqlite3_vtab_in_first)(e,t),i._sqlite3_vtab_in_next=(e,t)=>(i._sqlite3_vtab_in_next=m.sqlite3_vtab_in_next)(e,t),i._sqlite3_aggregate_context=(e,t)=>(i._sqlite3_aggregate_context=m.sqlite3_aggregate_context)(e,t),i._sqlite3_get_auxdata=(e,t)=>(i._sqlite3_get_auxdata=m.sqlite3_get_auxdata)(e,t),i._sqlite3_set_auxdata=(e,t,n,r)=>(i._sqlite3_set_auxdata=m.sqlite3_set_auxdata)(e,t,n,r),i._sqlite3_column_count=e=>(i._sqlite3_column_count=m.sqlite3_column_count)(e),i._sqlite3_data_count=e=>(i._sqlite3_data_count=m.sqlite3_data_count)(e),i._sqlite3_column_blob=(e,t)=>(i._sqlite3_column_blob=m.sqlite3_column_blob)(e,t),i._sqlite3_column_bytes=(e,t)=>(i._sqlite3_column_bytes=m.sqlite3_column_bytes)(e,t),i._sqlite3_column_double=(e,t)=>(i._sqlite3_column_double=m.sqlite3_column_double)(e,t),i._sqlite3_column_value=(e,t)=>(i._sqlite3_column_value=m.sqlite3_column_value)(e,t),i._sqlite3_column_decltype=(e,t)=>(i._sqlite3_column_decltype=m.sqlite3_column_decltype)(e,t),i._sqlite3_bind_blob=(e,t,n,r,s)=>(i._sqlite3_bind_blob=m.sqlite3_bind_blob)(e,t,n,r,s),i._sqlite3_bind_double=(e,t,n)=>(i._sqlite3_bind_double=m.sqlite3_bind_double)(e,t,n),i._sqlite3_bind_int=(e,t,n)=>(i._sqlite3_bind_int=m.sqlite3_bind_int)(e,t,n),i._sqlite3_bind_int64=(e,t,n)=>(i._sqlite3_bind_int64=m.sqlite3_bind_int64)(e,t,n),i._sqlite3_bind_null=(e,t)=>(i._sqlite3_bind_null=m.sqlite3_bind_null)(e,t),i._sqlite3_bind_pointer=(e,t,n,r,s)=>(i._sqlite3_bind_pointer=m.sqlite3_bind_pointer)(e,t,n,r,s),i._sqlite3_bind_text=(e,t,n,r,s)=>(i._sqlite3_bind_text=m.sqlite3_bind_text)(e,t,n,r,s),i._sqlite3_bind_parameter_count=e=>(i._sqlite3_bind_parameter_count=m.sqlite3_bind_parameter_count)(e),i._sqlite3_bind_parameter_name=(e,t)=>(i._sqlite3_bind_parameter_name=m.sqlite3_bind_parameter_name)(e,t),i._sqlite3_bind_parameter_index=(e,t)=>(i._sqlite3_bind_parameter_index=m.sqlite3_bind_parameter_index)(e,t),i._sqlite3_db_handle=e=>(i._sqlite3_db_handle=m.sqlite3_db_handle)(e),i._sqlite3_stmt_readonly=e=>(i._sqlite3_stmt_readonly=m.sqlite3_stmt_readonly)(e),i._sqlite3_stmt_isexplain=e=>(i._sqlite3_stmt_isexplain=m.sqlite3_stmt_isexplain)(e),i._sqlite3_stmt_explain=(e,t)=>(i._sqlite3_stmt_explain=m.sqlite3_stmt_explain)(e,t),i._sqlite3_stmt_busy=e=>(i._sqlite3_stmt_busy=m.sqlite3_stmt_busy)(e),i._sqlite3_stmt_status=(e,t,n)=>(i._sqlite3_stmt_status=m.sqlite3_stmt_status)(e,t,n),i._sqlite3_sql=e=>(i._sqlite3_sql=m.sqlite3_sql)(e),i._sqlite3_expanded_sql=e=>(i._sqlite3_expanded_sql=m.sqlite3_expanded_sql)(e),i._sqlite3_preupdate_old=(e,t,n)=>(i._sqlite3_preupdate_old=m.sqlite3_preupdate_old)(e,t,n),i._sqlite3_preupdate_count=e=>(i._sqlite3_preupdate_count=m.sqlite3_preupdate_count)(e),i._sqlite3_preupdate_depth=e=>(i._sqlite3_preupdate_depth=m.sqlite3_preupdate_depth)(e),i._sqlite3_preupdate_blobwrite=e=>(i._sqlite3_preupdate_blobwrite=m.sqlite3_preupdate_blobwrite)(e),i._sqlite3_preupdate_new=(e,t,n)=>(i._sqlite3_preupdate_new=m.sqlite3_preupdate_new)(e,t,n),i._sqlite3_value_numeric_type=e=>(i._sqlite3_value_numeric_type=m.sqlite3_value_numeric_type)(e),i._sqlite3_set_authorizer=(e,t,n)=>(i._sqlite3_set_authorizer=m.sqlite3_set_authorizer)(e,t,n),i._sqlite3_strglob=(e,t)=>(i._sqlite3_strglob=m.sqlite3_strglob)(e,t),i._sqlite3_strlike=(e,t,n)=>(i._sqlite3_strlike=m.sqlite3_strlike)(e,t,n),i._sqlite3_auto_extension=e=>(i._sqlite3_auto_extension=m.sqlite3_auto_extension)(e),i._sqlite3_cancel_auto_extension=e=>(i._sqlite3_cancel_auto_extension=m.sqlite3_cancel_auto_extension)(e),i._sqlite3_reset_auto_extension=()=>(i._sqlite3_reset_auto_extension=m.sqlite3_reset_auto_extension)(),i._sqlite3_prepare_v3=(e,t,n,r,s,o)=>(i._sqlite3_prepare_v3=m.sqlite3_prepare_v3)(e,t,n,r,s,o),i._sqlite3_create_module=(e,t,n,r)=>(i._sqlite3_create_module=m.sqlite3_create_module)(e,t,n,r),i._sqlite3_create_module_v2=(e,t,n,r,s)=>(i._sqlite3_create_module_v2=m.sqlite3_create_module_v2)(e,t,n,r,s),i._sqlite3_drop_modules=(e,t)=>(i._sqlite3_drop_modules=m.sqlite3_drop_modules)(e,t),i._sqlite3_declare_vtab=(e,t)=>(i._sqlite3_declare_vtab=m.sqlite3_declare_vtab)(e,t),i._sqlite3_vtab_on_conflict=e=>(i._sqlite3_vtab_on_conflict=m.sqlite3_vtab_on_conflict)(e),i._sqlite3_vtab_collation=(e,t)=>(i._sqlite3_vtab_collation=m.sqlite3_vtab_collation)(e,t),i._sqlite3_vtab_in=(e,t,n)=>(i._sqlite3_vtab_in=m.sqlite3_vtab_in)(e,t,n),i._sqlite3_vtab_rhs_value=(e,t,n)=>(i._sqlite3_vtab_rhs_value=m.sqlite3_vtab_rhs_value)(e,t,n),i._sqlite3_vtab_distinct=e=>(i._sqlite3_vtab_distinct=m.sqlite3_vtab_distinct)(e),i._sqlite3_keyword_name=(e,t,n)=>(i._sqlite3_keyword_name=m.sqlite3_keyword_name)(e,t,n),i._sqlite3_keyword_count=()=>(i._sqlite3_keyword_count=m.sqlite3_keyword_count)(),i._sqlite3_keyword_check=(e,t)=>(i._sqlite3_keyword_check=m.sqlite3_keyword_check)(e,t),i._sqlite3_complete=e=>(i._sqlite3_complete=m.sqlite3_complete)(e),i._sqlite3_libversion=()=>(i._sqlite3_libversion=m.sqlite3_libversion)(),i._sqlite3_libversion_number=()=>(i._sqlite3_libversion_number=m.sqlite3_libversion_number)(),i._sqlite3_shutdown=()=>(i._sqlite3_shutdown=m.sqlite3_shutdown)(),i._sqlite3_last_insert_rowid=e=>(i._sqlite3_last_insert_rowid=m.sqlite3_last_insert_rowid)(e),i._sqlite3_set_last_insert_rowid=(e,t)=>(i._sqlite3_set_last_insert_rowid=m.sqlite3_set_last_insert_rowid)(e,t),i._sqlite3_changes64=e=>(i._sqlite3_changes64=m.sqlite3_changes64)(e),i._sqlite3_changes=e=>(i._sqlite3_changes=m.sqlite3_changes)(e),i._sqlite3_total_changes64=e=>(i._sqlite3_total_changes64=m.sqlite3_total_changes64)(e),i._sqlite3_total_changes=e=>(i._sqlite3_total_changes=m.sqlite3_total_changes)(e),i._sqlite3_txn_state=(e,t)=>(i._sqlite3_txn_state=m.sqlite3_txn_state)(e,t),i._sqlite3_close_v2=e=>(i._sqlite3_close_v2=m.sqlite3_close_v2)(e),i._sqlite3_busy_handler=(e,t,n)=>(i._sqlite3_busy_handler=m.sqlite3_busy_handler)(e,t,n),i._sqlite3_progress_handler=(e,t,n,r)=>(i._sqlite3_progress_handler=m.sqlite3_progress_handler)(e,t,n,r),i._sqlite3_busy_timeout=(e,t)=>(i._sqlite3_busy_timeout=m.sqlite3_busy_timeout)(e,t),i._sqlite3_interrupt=e=>(i._sqlite3_interrupt=m.sqlite3_interrupt)(e),i._sqlite3_is_interrupted=e=>(i._sqlite3_is_interrupted=m.sqlite3_is_interrupted)(e),i._sqlite3_create_function=(e,t,n,r,s,o,p,g)=>(i._sqlite3_create_function=m.sqlite3_create_function)(e,t,n,r,s,o,p,g),i._sqlite3_create_function_v2=(e,t,n,r,s,o,p,g,P)=>(i._sqlite3_create_function_v2=m.sqlite3_create_function_v2)(e,t,n,r,s,o,p,g,P),i._sqlite3_create_window_function=(e,t,n,r,s,o,p,g,P,R)=>(i._sqlite3_create_window_function=m.sqlite3_create_window_function)(e,t,n,r,s,o,p,g,P,R),i._sqlite3_overload_function=(e,t,n)=>(i._sqlite3_overload_function=m.sqlite3_overload_function)(e,t,n),i._sqlite3_trace_v2=(e,t,n,r)=>(i._sqlite3_trace_v2=m.sqlite3_trace_v2)(e,t,n,r),i._sqlite3_commit_hook=(e,t,n)=>(i._sqlite3_commit_hook=m.sqlite3_commit_hook)(e,t,n),i._sqlite3_update_hook=(e,t,n)=>(i._sqlite3_update_hook=m.sqlite3_update_hook)(e,t,n),i._sqlite3_rollback_hook=(e,t,n)=>(i._sqlite3_rollback_hook=m.sqlite3_rollback_hook)(e,t,n),i._sqlite3_preupdate_hook=(e,t,n)=>(i._sqlite3_preupdate_hook=m.sqlite3_preupdate_hook)(e,t,n),i._sqlite3_error_offset=e=>(i._sqlite3_error_offset=m.sqlite3_error_offset)(e),i._sqlite3_errcode=e=>(i._sqlite3_errcode=m.sqlite3_errcode)(e),i._sqlite3_extended_errcode=e=>(i._sqlite3_extended_errcode=m.sqlite3_extended_errcode)(e),i._sqlite3_errstr=e=>(i._sqlite3_errstr=m.sqlite3_errstr)(e),i._sqlite3_limit=(e,t,n)=>(i._sqlite3_limit=m.sqlite3_limit)(e,t,n),i._sqlite3_open=(e,t)=>(i._sqlite3_open=m.sqlite3_open)(e,t),i._sqlite3_open_v2=(e,t,n,r)=>(i._sqlite3_open_v2=m.sqlite3_open_v2)(e,t,n,r),i._sqlite3_create_collation=(e,t,n,r,s)=>(i._sqlite3_create_collation=m.sqlite3_create_collation)(e,t,n,r,s),i._sqlite3_create_collation_v2=(e,t,n,r,s,o)=>(i._sqlite3_create_collation_v2=m.sqlite3_create_collation_v2)(e,t,n,r,s,o),i._sqlite3_collation_needed=(e,t,n)=>(i._sqlite3_collation_needed=m.sqlite3_collation_needed)(e,t,n),i._sqlite3_get_autocommit=e=>(i._sqlite3_get_autocommit=m.sqlite3_get_autocommit)(e),i._sqlite3_table_column_metadata=(e,t,n,r,s,o,p,g,P)=>(i._sqlite3_table_column_metadata=m.sqlite3_table_column_metadata)(e,t,n,r,s,o,p,g,P),i._sqlite3_extended_result_codes=(e,t)=>(i._sqlite3_extended_result_codes=m.sqlite3_extended_result_codes)(e,t),i._sqlite3_uri_key=(e,t)=>(i._sqlite3_uri_key=m.sqlite3_uri_key)(e,t),i._sqlite3_uri_int64=(e,t,n)=>(i._sqlite3_uri_int64=m.sqlite3_uri_int64)(e,t,n),i._sqlite3_db_name=(e,t)=>(i._sqlite3_db_name=m.sqlite3_db_name)(e,t),i._sqlite3_db_filename=(e,t)=>(i._sqlite3_db_filename=m.sqlite3_db_filename)(e,t),i._sqlite3_db_readonly=(e,t)=>(i._sqlite3_db_readonly=m.sqlite3_db_readonly)(e,t),i._sqlite3_compileoption_used=e=>(i._sqlite3_compileoption_used=m.sqlite3_compileoption_used)(e),i._sqlite3_compileoption_get=e=>(i._sqlite3_compileoption_get=m.sqlite3_compileoption_get)(e),i._sqlite3session_diff=(e,t,n,r)=>(i._sqlite3session_diff=m.sqlite3session_diff)(e,t,n,r),i._sqlite3session_attach=(e,t)=>(i._sqlite3session_attach=m.sqlite3session_attach)(e,t),i._sqlite3session_create=(e,t,n)=>(i._sqlite3session_create=m.sqlite3session_create)(e,t,n),i._sqlite3session_delete=e=>(i._sqlite3session_delete=m.sqlite3session_delete)(e),i._sqlite3session_table_filter=(e,t,n)=>(i._sqlite3session_table_filter=m.sqlite3session_table_filter)(e,t,n),i._sqlite3session_changeset=(e,t,n)=>(i._sqlite3session_changeset=m.sqlite3session_changeset)(e,t,n),i._sqlite3session_changeset_strm=(e,t,n)=>(i._sqlite3session_changeset_strm=m.sqlite3session_changeset_strm)(e,t,n),i._sqlite3session_patchset_strm=(e,t,n)=>(i._sqlite3session_patchset_strm=m.sqlite3session_patchset_strm)(e,t,n),i._sqlite3session_patchset=(e,t,n)=>(i._sqlite3session_patchset=m.sqlite3session_patchset)(e,t,n),i._sqlite3session_enable=(e,t)=>(i._sqlite3session_enable=m.sqlite3session_enable)(e,t),i._sqlite3session_indirect=(e,t)=>(i._sqlite3session_indirect=m.sqlite3session_indirect)(e,t),i._sqlite3session_isempty=e=>(i._sqlite3session_isempty=m.sqlite3session_isempty)(e),i._sqlite3session_memory_used=e=>(i._sqlite3session_memory_used=m.sqlite3session_memory_used)(e),i._sqlite3session_object_config=(e,t,n)=>(i._sqlite3session_object_config=m.sqlite3session_object_config)(e,t,n),i._sqlite3session_changeset_size=e=>(i._sqlite3session_changeset_size=m.sqlite3session_changeset_size)(e),i._sqlite3changeset_start=(e,t,n)=>(i._sqlite3changeset_start=m.sqlite3changeset_start)(e,t,n),i._sqlite3changeset_start_v2=(e,t,n,r)=>(i._sqlite3changeset_start_v2=m.sqlite3changeset_start_v2)(e,t,n,r),i._sqlite3changeset_start_strm=(e,t,n)=>(i._sqlite3changeset_start_strm=m.sqlite3changeset_start_strm)(e,t,n),i._sqlite3changeset_start_v2_strm=(e,t,n,r)=>(i._sqlite3changeset_start_v2_strm=m.sqlite3changeset_start_v2_strm)(e,t,n,r),i._sqlite3changeset_next=e=>(i._sqlite3changeset_next=m.sqlite3changeset_next)(e),i._sqlite3changeset_op=(e,t,n,r,s)=>(i._sqlite3changeset_op=m.sqlite3changeset_op)(e,t,n,r,s),i._sqlite3changeset_pk=(e,t,n)=>(i._sqlite3changeset_pk=m.sqlite3changeset_pk)(e,t,n),i._sqlite3changeset_old=(e,t,n)=>(i._sqlite3changeset_old=m.sqlite3changeset_old)(e,t,n),i._sqlite3changeset_new=(e,t,n)=>(i._sqlite3changeset_new=m.sqlite3changeset_new)(e,t,n),i._sqlite3changeset_conflict=(e,t,n)=>(i._sqlite3changeset_conflict=m.sqlite3changeset_conflict)(e,t,n),i._sqlite3changeset_fk_conflicts=(e,t)=>(i._sqlite3changeset_fk_conflicts=m.sqlite3changeset_fk_conflicts)(e,t),i._sqlite3changeset_finalize=e=>(i._sqlite3changeset_finalize=m.sqlite3changeset_finalize)(e),i._sqlite3changeset_invert=(e,t,n,r)=>(i._sqlite3changeset_invert=m.sqlite3changeset_invert)(e,t,n,r),i._sqlite3changeset_invert_strm=(e,t,n,r)=>(i._sqlite3changeset_invert_strm=m.sqlite3changeset_invert_strm)(e,t,n,r),i._sqlite3changeset_apply_v2=(e,t,n,r,s,o,p,g,P)=>(i._sqlite3changeset_apply_v2=m.sqlite3changeset_apply_v2)(e,t,n,r,s,o,p,g,P),i._sqlite3changeset_apply=(e,t,n,r,s,o)=>(i._sqlite3changeset_apply=m.sqlite3changeset_apply)(e,t,n,r,s,o),i._sqlite3changeset_apply_v2_strm=(e,t,n,r,s,o,p,g,P)=>(i._sqlite3changeset_apply_v2_strm=m.sqlite3changeset_apply_v2_strm)(e,t,n,r,s,o,p,g,P),i._sqlite3changeset_apply_strm=(e,t,n,r,s,o)=>(i._sqlite3changeset_apply_strm=m.sqlite3changeset_apply_strm)(e,t,n,r,s,o),i._sqlite3changegroup_new=e=>(i._sqlite3changegroup_new=m.sqlite3changegroup_new)(e),i._sqlite3changegroup_add=(e,t,n)=>(i._sqlite3changegroup_add=m.sqlite3changegroup_add)(e,t,n),i._sqlite3changegroup_output=(e,t,n)=>(i._sqlite3changegroup_output=m.sqlite3changegroup_output)(e,t,n),i._sqlite3changegroup_add_strm=(e,t,n)=>(i._sqlite3changegroup_add_strm=m.sqlite3changegroup_add_strm)(e,t,n),i._sqlite3changegroup_output_strm=(e,t,n)=>(i._sqlite3changegroup_output_strm=m.sqlite3changegroup_output_strm)(e,t,n),i._sqlite3changegroup_delete=e=>(i._sqlite3changegroup_delete=m.sqlite3changegroup_delete)(e),i._sqlite3changeset_concat=(e,t,n,r,s,o)=>(i._sqlite3changeset_concat=m.sqlite3changeset_concat)(e,t,n,r,s,o),i._sqlite3changeset_concat_strm=(e,t,n,r,s,o)=>(i._sqlite3changeset_concat_strm=m.sqlite3changeset_concat_strm)(e,t,n,r,s,o),i._sqlite3session_config=(e,t)=>(i._sqlite3session_config=m.sqlite3session_config)(e,t),i._sqlite3_sourceid=()=>(i._sqlite3_sourceid=m.sqlite3_sourceid)(),i._sqlite3__wasm_pstack_ptr=()=>(i._sqlite3__wasm_pstack_ptr=m.sqlite3__wasm_pstack_ptr)(),i._sqlite3__wasm_pstack_restore=e=>(i._sqlite3__wasm_pstack_restore=m.sqlite3__wasm_pstack_restore)(e),i._sqlite3__wasm_pstack_alloc=e=>(i._sqlite3__wasm_pstack_alloc=m.sqlite3__wasm_pstack_alloc)(e),i._sqlite3__wasm_pstack_remaining=()=>(i._sqlite3__wasm_pstack_remaining=m.sqlite3__wasm_pstack_remaining)(),i._sqlite3__wasm_pstack_quota=()=>(i._sqlite3__wasm_pstack_quota=m.sqlite3__wasm_pstack_quota)(),i._sqlite3__wasm_db_error=(e,t,n)=>(i._sqlite3__wasm_db_error=m.sqlite3__wasm_db_error)(e,t,n),i._sqlite3__wasm_test_struct=e=>(i._sqlite3__wasm_test_struct=m.sqlite3__wasm_test_struct)(e),i._sqlite3__wasm_enum_json=()=>(i._sqlite3__wasm_enum_json=m.sqlite3__wasm_enum_json)(),i._sqlite3__wasm_vfs_unlink=(e,t)=>(i._sqlite3__wasm_vfs_unlink=m.sqlite3__wasm_vfs_unlink)(e,t),i._sqlite3__wasm_db_vfs=(e,t)=>(i._sqlite3__wasm_db_vfs=m.sqlite3__wasm_db_vfs)(e,t),i._sqlite3__wasm_db_reset=e=>(i._sqlite3__wasm_db_reset=m.sqlite3__wasm_db_reset)(e),i._sqlite3__wasm_db_export_chunked=(e,t)=>(i._sqlite3__wasm_db_export_chunked=m.sqlite3__wasm_db_export_chunked)(e,t),i._sqlite3__wasm_db_serialize=(e,t,n,r,s)=>(i._sqlite3__wasm_db_serialize=m.sqlite3__wasm_db_serialize)(e,t,n,r,s),i._sqlite3__wasm_vfs_create_file=(e,t,n,r)=>(i._sqlite3__wasm_vfs_create_file=m.sqlite3__wasm_vfs_create_file)(e,t,n,r),i._sqlite3__wasm_posix_create_file=(e,t,n)=>(i._sqlite3__wasm_posix_create_file=m.sqlite3__wasm_posix_create_file)(e,t,n),i._sqlite3__wasm_kvvfsMakeKeyOnPstack=(e,t)=>(i._sqlite3__wasm_kvvfsMakeKeyOnPstack=m.sqlite3__wasm_kvvfsMakeKeyOnPstack)(e,t),i._sqlite3__wasm_kvvfs_methods=()=>(i._sqlite3__wasm_kvvfs_methods=m.sqlite3__wasm_kvvfs_methods)(),i._sqlite3__wasm_vtab_config=(e,t,n)=>(i._sqlite3__wasm_vtab_config=m.sqlite3__wasm_vtab_config)(e,t,n),i._sqlite3__wasm_db_config_ip=(e,t,n,r)=>(i._sqlite3__wasm_db_config_ip=m.sqlite3__wasm_db_config_ip)(e,t,n,r),i._sqlite3__wasm_db_config_pii=(e,t,n,r,s)=>(i._sqlite3__wasm_db_config_pii=m.sqlite3__wasm_db_config_pii)(e,t,n,r,s),i._sqlite3__wasm_db_config_s=(e,t,n)=>(i._sqlite3__wasm_db_config_s=m.sqlite3__wasm_db_config_s)(e,t,n),i._sqlite3__wasm_config_i=(e,t)=>(i._sqlite3__wasm_config_i=m.sqlite3__wasm_config_i)(e,t),i._sqlite3__wasm_config_ii=(e,t,n)=>(i._sqlite3__wasm_config_ii=m.sqlite3__wasm_config_ii)(e,t,n),i._sqlite3__wasm_config_j=(e,t)=>(i._sqlite3__wasm_config_j=m.sqlite3__wasm_config_j)(e,t),i._sqlite3__wasm_qfmt_token=(e,t)=>(i._sqlite3__wasm_qfmt_token=m.sqlite3__wasm_qfmt_token)(e,t),i._sqlite3__wasm_init_wasmfs=e=>(i._sqlite3__wasm_init_wasmfs=m.sqlite3__wasm_init_wasmfs)(e),i._sqlite3__wasm_test_intptr=e=>(i._sqlite3__wasm_test_intptr=m.sqlite3__wasm_test_intptr)(e),i._sqlite3__wasm_test_voidptr=e=>(i._sqlite3__wasm_test_voidptr=m.sqlite3__wasm_test_voidptr)(e),i._sqlite3__wasm_test_int64_max=()=>(i._sqlite3__wasm_test_int64_max=m.sqlite3__wasm_test_int64_max)(),i._sqlite3__wasm_test_int64_min=()=>(i._sqlite3__wasm_test_int64_min=m.sqlite3__wasm_test_int64_min)(),i._sqlite3__wasm_test_int64_times2=e=>(i._sqlite3__wasm_test_int64_times2=m.sqlite3__wasm_test_int64_times2)(e),i._sqlite3__wasm_test_int64_minmax=(e,t)=>(i._sqlite3__wasm_test_int64_minmax=m.sqlite3__wasm_test_int64_minmax)(e,t),i._sqlite3__wasm_test_int64ptr=e=>(i._sqlite3__wasm_test_int64ptr=m.sqlite3__wasm_test_int64ptr)(e),i._sqlite3__wasm_test_stack_overflow=e=>(i._sqlite3__wasm_test_stack_overflow=m.sqlite3__wasm_test_stack_overflow)(e),i._sqlite3__wasm_test_str_hello=e=>(i._sqlite3__wasm_test_str_hello=m.sqlite3__wasm_test_str_hello)(e),i._sqlite3__wasm_SQLTester_strglob=(e,t)=>(i._sqlite3__wasm_SQLTester_strglob=m.sqlite3__wasm_SQLTester_strglob)(e,t),i._malloc=e=>(i._malloc=m.malloc)(e),i._free=e=>(i._free=m.free)(e),i._realloc=(e,t)=>(i._realloc=m.realloc)(e,t);var At=(e,t)=>(At=m.emscripten_builtin_memalign)(e,t);i.wasmMemory=Ce;var tt,It;Ge=function e(){tt||kt(),tt||(Ge=e)};function kt(){if(De>0||!It&&(It=1,Ot(),De>0))return;function e(){tt||(tt=1,i.calledRun=1,!ut&&(Lt(),ye(i),i.onRuntimeInitialized?.(),Ct()))}i.setStatus?(i.setStatus("Running..."),setTimeout(()=>{setTimeout(()=>i.setStatus(""),1),e()},1)):e()}if(i.preInit)for(typeof i.preInit=="function"&&(i.preInit=[i.preInit]);i.preInit.length>0;)i.preInit.pop()();return kt(),i.runSQLite3PostLoadInit=function(e){if(globalThis.sqlite3ApiBootstrap=function t(n=globalThis.sqlite3ApiConfig||t.defaultConfig){if(t.sqlite3)return(t.sqlite3.config||console).warn("sqlite3ApiBootstrap() called multiple times.","Config and external initializers are ignored on calls after the first."),t.sqlite3;const r=Object.assign(Object.create(null),{exports:void 0,memory:void 0,bigIntEnabled:typeof i<"u"&&i.HEAPU64?!0:!!globalThis.BigInt64Array,debug:console.debug.bind(console),warn:console.warn.bind(console),error:console.error.bind(console),log:console.log.bind(console),wasmfsOpfsDir:"/opfs",useStdAlloc:!1},n||{});Object.assign(r,{allocExportName:r.useStdAlloc?"malloc":"sqlite3_malloc",deallocExportName:r.useStdAlloc?"free":"sqlite3_free",reallocExportName:r.useStdAlloc?"realloc":"sqlite3_realloc"},r),["exports","memory","wasmfsOpfsDir"].forEach(l=>{typeof r[l]=="function"&&(r[l]=r[l]())}),delete globalThis.sqlite3ApiConfig,delete t.defaultConfig;const s=Object.create(null),o=Object.create(null),p=l=>s.sqlite3_js_rc_str&&s.sqlite3_js_rc_str(l)||"Unknown result code #"+l,g=l=>typeof l=="number"&&l===(l|0);class P extends Error{constructor(..._){let u;if(_.length)if(g(_[0]))if(u=_[0],_.length===1)super(p(_[0]));else{const I=p(u);typeof _[1]=="object"?super(I,_[1]):(_[0]=I+":",super(_.join(" ")))}else _.length===2&&typeof _[1]=="object"?super(..._):super(_.join(" "));this.resultCode=u||s.SQLITE_ERROR,this.name="SQLite3Error"}}P.toss=(...l)=>{throw new P(...l)};const R=P.toss;r.wasmfsOpfsDir&&!/^\/[^/]+$/.test(r.wasmfsOpfsDir)&&R("config.wasmfsOpfsDir must be falsy or in the form '/dir-name'.");const z=l=>typeof l!="bigint"&&l===(l|0)&&l<=2147483647&&l>=-2147483648,Q=function l(_){return l._max||(l._max=BigInt("0x7fffffffffffffff"),l._min=~l._max),_>=l._min&&_<=l._max},T=l=>l>=-0x7fffffffn-1n&&l<=0x7fffffffn,A=function l(_){return l._min||(l._min=Number.MIN_SAFE_INTEGER,l._max=Number.MAX_SAFE_INTEGER),_>=l._min&&_<=l._max},D=l=>l&&l.constructor&&z(l.constructor.BYTES_PER_ELEMENT)?l:!1,q=typeof SharedArrayBuffer>"u"?function(){}:SharedArrayBuffer,w=l=>l.buffer instanceof q,x=(l,_,u)=>w(l)?l.slice(_,u):l.subarray(_,u),N=l=>l&&(l instanceof Uint8Array||l instanceof Int8Array||l instanceof ArrayBuffer),O=l=>l&&(l instanceof Uint8Array||l instanceof Int8Array||l instanceof ArrayBuffer),S=l=>N(l)||R("Value is not of a supported TypedArray type."),L=new TextDecoder("utf-8"),$=function(l,_,u){return L.decode(x(l,_,u))},c=function(l){return O(l)?$(l instanceof ArrayBuffer?new Uint8Array(l):l):Array.isArray(l)?l.join(""):(o.isPtr(l)&&(l=o.cstrToJs(l)),l)};class d extends Error{constructor(..._){_.length===2&&typeof _[1]=="object"?super(..._):_.length?super(_.join(" ")):super("Allocation failed."),this.resultCode=s.SQLITE_NOMEM,this.name="WasmAllocError"}}d.toss=(...l)=>{throw new d(...l)},Object.assign(s,{sqlite3_bind_blob:void 0,sqlite3_bind_text:void 0,sqlite3_create_function_v2:(l,_,u,I,U,ee,ne,se,ie)=>{},sqlite3_create_function:(l,_,u,I,U,ee,ne,se)=>{},sqlite3_create_window_function:(l,_,u,I,U,ee,ne,se,ie,j)=>{},sqlite3_prepare_v3:(l,_,u,I,U,ee)=>{},sqlite3_prepare_v2:(l,_,u,I,U)=>{},sqlite3_exec:(l,_,u,I,U)=>{},sqlite3_randomness:(l,_)=>{}});const y={affirmBindableTypedArray:S,flexibleString:c,bigIntFits32:T,bigIntFits64:Q,bigIntFitsDouble:A,isBindableTypedArray:N,isInt32:z,isSQLableTypedArray:O,isTypedArray:D,typedArrayToString:$,isUIThread:()=>globalThis.window===globalThis&&!!globalThis.document,isSharedTypedArray:w,toss:function(...l){throw new Error(l.join(" "))},toss3:R,typedArrayPart:x,affirmDbHeader:function(l){l instanceof ArrayBuffer&&(l=new Uint8Array(l));const _="SQLite format 3";_.length>l.byteLength&&R("Input does not contain an SQLite3 database header.");for(let u=0;u<_.length;++u)_.charCodeAt(u)!==l[u]&&R("Input does not contain an SQLite3 database header.")},affirmIsDb:function(l){l instanceof ArrayBuffer&&(l=new Uint8Array(l));const _=l.byteLength;(_<512||_%512!==0)&&R("Byte array size",_,"is invalid for an SQLite3 db."),y.affirmDbHeader(l)}};Object.assign(o,{ptrSizeof:r.wasmPtrSizeof||4,ptrIR:r.wasmPtrIR||"i32",bigIntEnabled:!!r.bigIntEnabled,exports:r.exports||R("Missing API config.exports (WASM module exports)."),memory:r.memory||r.exports.memory||R("API config object requires a WebAssembly.Memory object","in either config.exports.memory (exported)","or config.memory (imported)."),alloc:void 0,realloc:void 0,dealloc:void 0}),o.allocFromTypedArray=function(l){l instanceof ArrayBuffer&&(l=new Uint8Array(l)),S(l);const _=o.alloc(l.byteLength||1);return o.heapForSize(l.constructor).set(l.byteLength?l:[0],_),_};{const l=r.allocExportName,_=r.deallocExportName,u=r.reallocExportName;for(const I of[l,_,u])o.exports[I]instanceof Function||R("Missing required exports[",I,"] function.");o.alloc=function I(U){return I.impl(U)||d.toss("Failed to allocate",U," bytes.")},o.alloc.impl=o.exports[l],o.realloc=function I(U,ee){const ne=I.impl(U,ee);return ee?ne||d.toss("Failed to reallocate",ee," bytes."):0},o.realloc.impl=o.exports[u],o.dealloc=o.exports[_]}o.compileOptionUsed=function l(_){if(arguments.length){if(Array.isArray(_)){const u={};return _.forEach(I=>{u[I]=s.sqlite3_compileoption_used(I)}),u}else if(typeof _=="object")return Object.keys(_).forEach(u=>{_[u]=s.sqlite3_compileoption_used(u)}),_}else{if(l._result)return l._result;l._opt||(l._rx=/^([^=]+)=(.+)/,l._rxInt=/^-?\d+$/,l._opt=function(ne,se){const ie=l._rx.exec(ne);se[0]=ie?ie[1]:ne,se[1]=ie?l._rxInt.test(ie[2])?+ie[2]:ie[2]:!0});const u={},I=[0,0];let U=0,ee;for(;ee=s.sqlite3_compileoption_get(U++);)l._opt(ee,I),u[I[0]]=I[1];return l._result=u}return typeof _=="string"?!!s.sqlite3_compileoption_used(_):!1},o.pstack=Object.assign(Object.create(null),{restore:o.exports.sqlite3__wasm_pstack_restore,alloc:function(l){return typeof l=="string"&&!(l=o.sizeofIR(l))&&d.toss("Invalid value for pstack.alloc(",arguments[0],")"),o.exports.sqlite3__wasm_pstack_alloc(l)||d.toss("Could not allocate",l,"bytes from the pstack.")},allocChunks:function(l,_){typeof _=="string"&&!(_=o.sizeofIR(_))&&d.toss("Invalid size value for allocChunks(",arguments[1],")");const u=o.pstack.alloc(l*_),I=[];let U=0,ee=0;for(;U<l;++U,ee+=_)I.push(u+ee);return I},allocPtr:(l=1,_=!0)=>l===1?o.pstack.alloc(_?8:o.ptrSizeof):o.pstack.allocChunks(l,_?8:o.ptrSizeof),call:function(l){const _=o.pstack.pointer;try{return l(h)}finally{o.pstack.restore(_)}}}),Object.defineProperties(o.pstack,{pointer:{configurable:!1,iterable:!0,writeable:!1,get:o.exports.sqlite3__wasm_pstack_ptr},quota:{configurable:!1,iterable:!0,writeable:!1,get:o.exports.sqlite3__wasm_pstack_quota},remaining:{configurable:!1,iterable:!0,writeable:!1,get:o.exports.sqlite3__wasm_pstack_remaining}}),s.sqlite3_randomness=(...l)=>{if(l.length===1&&y.isTypedArray(l[0])&&l[0].BYTES_PER_ELEMENT===1){const _=l[0];if(_.byteLength===0)return o.exports.sqlite3_randomness(0,0),_;const u=o.pstack.pointer;try{let I=_.byteLength,U=0;const ee=o.exports.sqlite3_randomness,ne=o.heap8u(),se=I<512?I:512,ie=o.pstack.alloc(se);do{const j=I>se?se:I;ee(j,ie),_.set(x(ne,ie,ie+j),U),I-=j,U+=j}while(I>0)}catch(I){console.error("Highly unexpected (and ignored!) exception in sqlite3_randomness():",I)}finally{o.pstack.restore(u)}return _}o.exports.sqlite3_randomness(...l)};let B;if(s.sqlite3_wasmfs_opfs_dir=function(){if(B!==void 0)return B;const l=r.wasmfsOpfsDir;if(!l||!globalThis.FileSystemHandle||!globalThis.FileSystemDirectoryHandle||!globalThis.FileSystemFileHandle)return B="";try{return l&&o.xCallWrapped("sqlite3__wasm_init_wasmfs","i32",["string"],l)===0?B=l:B=""}catch{return B=""}},s.sqlite3_wasmfs_filename_is_persistent=function(l){const _=s.sqlite3_wasmfs_opfs_dir();return _&&l?l.startsWith(_+"/"):!1},s.sqlite3_js_db_uses_vfs=function(l,_,u=0){try{const I=s.sqlite3_vfs_find(_);return I?l?I===s.sqlite3_js_db_vfs(l,u)?I:!1:I===s.sqlite3_vfs_find(0)?I:!1:!1}catch{return!1}},s.sqlite3_js_vfs_list=function(){const l=[];let _=s.sqlite3_vfs_find(0);for(;_;){const u=new s.sqlite3_vfs(_);l.push(o.cstrToJs(u.$zName)),_=u.$pNext,u.dispose()}return l},s.sqlite3_js_db_export=function(l,_=0){l=o.xWrap.testConvertArg("sqlite3*",l),l||R("Invalid sqlite3* argument."),o.bigIntEnabled||R("BigInt64 support is not enabled.");const u=o.scopedAllocPush();let I;try{const U=o.scopedAlloc(8+o.ptrSizeof),ee=U+8,ne=_?o.isPtr(_)?_:o.scopedAllocCString(""+_):0;let se=o.exports.sqlite3__wasm_db_serialize(l,ne,ee,U,0);se&&R("Database serialization failed with code",h.capi.sqlite3_js_rc_str(se)),I=o.peekPtr(ee);const ie=o.peek(U,"i64");return se=ie?o.heap8u().slice(I,I+Number(ie)):new Uint8Array,se}finally{I&&o.exports.sqlite3_free(I),o.scopedAllocPop(u)}},s.sqlite3_js_db_vfs=(l,_=0)=>y.sqlite3__wasm_db_vfs(l,_),s.sqlite3_js_aggregate_context=(l,_)=>s.sqlite3_aggregate_context(l,_)||(_?d.toss("Cannot allocate",_,"bytes for sqlite3_aggregate_context()"):0),s.sqlite3_js_posix_create_file=function(l,_,u){let I;_&&o.isPtr(_)?I=_:_ instanceof ArrayBuffer||_ instanceof Uint8Array?(I=o.allocFromTypedArray(_),(arguments.length<3||!y.isInt32(u)||u<0)&&(u=_.byteLength)):P.toss("Invalid 2nd argument for sqlite3_js_posix_create_file().");try{(!y.isInt32(u)||u<0)&&P.toss("Invalid 3rd argument for sqlite3_js_posix_create_file().");const U=y.sqlite3__wasm_posix_create_file(l,I,u);U&&P.toss("Creation of file failed with sqlite3 result code",s.sqlite3_js_rc_str(U))}finally{o.dealloc(I)}},s.sqlite3_js_vfs_create_file=function(l,_,u,I){r.warn("sqlite3_js_vfs_create_file() is deprecated and","should be avoided because it can lead to C-level crashes.","See its documentation for alternative options.");let U;u?(o.isPtr(u)?U=u:u instanceof ArrayBuffer&&(u=new Uint8Array(u)),u instanceof Uint8Array?(U=o.allocFromTypedArray(u),(arguments.length<4||!y.isInt32(I)||I<0)&&(I=u.byteLength)):P.toss("Invalid 3rd argument type for sqlite3_js_vfs_create_file().")):U=0,(!y.isInt32(I)||I<0)&&(o.dealloc(U),P.toss("Invalid 4th argument for sqlite3_js_vfs_create_file()."));try{const ee=y.sqlite3__wasm_vfs_create_file(l,_,U,I);ee&&P.toss("Creation of file failed with sqlite3 result code",s.sqlite3_js_rc_str(ee))}finally{o.dealloc(U)}},s.sqlite3_js_sql_to_string=l=>{if(typeof l=="string")return l;const _=c(v);return _===v?void 0:_},y.isUIThread()){const l=function(_){const u=Object.create(null);return u.prefix="kvvfs-"+_,u.stores=[],(_==="session"||_==="")&&u.stores.push(globalThis.sessionStorage),(_==="local"||_==="")&&u.stores.push(globalThis.localStorage),u};s.sqlite3_js_kvvfs_clear=function(_=""){let u=0;const I=l(_);return I.stores.forEach(U=>{const ee=[];let ne;for(ne=0;ne<U.length;++ne){const se=U.key(ne);se.startsWith(I.prefix)&&ee.push(se)}ee.forEach(se=>U.removeItem(se)),u+=ee.length}),u},s.sqlite3_js_kvvfs_size=function(_=""){let u=0;const I=l(_);return I.stores.forEach(U=>{let ee;for(ee=0;ee<U.length;++ee){const ne=U.key(ee);ne.startsWith(I.prefix)&&(u+=ne.length,u+=U.getItem(ne).length)}}),u*2}}s.sqlite3_db_config=(function(l,_,...u){switch(_){case s.SQLITE_DBCONFIG_ENABLE_FKEY:case s.SQLITE_DBCONFIG_ENABLE_TRIGGER:case s.SQLITE_DBCONFIG_ENABLE_FTS3_TOKENIZER:case s.SQLITE_DBCONFIG_ENABLE_LOAD_EXTENSION:case s.SQLITE_DBCONFIG_NO_CKPT_ON_CLOSE:case s.SQLITE_DBCONFIG_ENABLE_QPSG:case s.SQLITE_DBCONFIG_TRIGGER_EQP:case s.SQLITE_DBCONFIG_RESET_DATABASE:case s.SQLITE_DBCONFIG_DEFENSIVE:case s.SQLITE_DBCONFIG_WRITABLE_SCHEMA:case s.SQLITE_DBCONFIG_LEGACY_ALTER_TABLE:case s.SQLITE_DBCONFIG_DQS_DML:case s.SQLITE_DBCONFIG_DQS_DDL:case s.SQLITE_DBCONFIG_ENABLE_VIEW:case s.SQLITE_DBCONFIG_LEGACY_FILE_FORMAT:case s.SQLITE_DBCONFIG_TRUSTED_SCHEMA:case s.SQLITE_DBCONFIG_STMT_SCANSTATUS:case s.SQLITE_DBCONFIG_REVERSE_SCANORDER:case s.SQLITE_DBCONFIG_ENABLE_ATTACH_CREATE:case s.SQLITE_DBCONFIG_ENABLE_ATTACH_WRITE:case s.SQLITE_DBCONFIG_ENABLE_COMMENTS:return this.ip||(this.ip=o.xWrap("sqlite3__wasm_db_config_ip","int",["sqlite3*","int","int","*"])),this.ip(l,_,u[0],u[1]||0);case s.SQLITE_DBCONFIG_LOOKASIDE:return this.pii||(this.pii=o.xWrap("sqlite3__wasm_db_config_pii","int",["sqlite3*","int","*","int","int"])),this.pii(l,_,u[0],u[1],u[2]);case s.SQLITE_DBCONFIG_MAINDBNAME:return this.s||(this.s=o.xWrap("sqlite3__wasm_db_config_s","int",["sqlite3*","int","string:static"])),this.s(l,_,u[0]);default:return s.SQLITE_MISUSE}}).bind(Object.create(null)),s.sqlite3_value_to_js=function(l,_=!0){let u;const I=s.sqlite3_value_type(l);switch(I){case s.SQLITE_INTEGER:o.bigIntEnabled?(u=s.sqlite3_value_int64(l),y.bigIntFitsDouble(u)&&(u=Number(u))):u=s.sqlite3_value_double(l);break;case s.SQLITE_FLOAT:u=s.sqlite3_value_double(l);break;case s.SQLITE_TEXT:u=s.sqlite3_value_text(l);break;case s.SQLITE_BLOB:{const U=s.sqlite3_value_bytes(l),ee=s.sqlite3_value_blob(l);U&&!ee&&h.WasmAllocError.toss("Cannot allocate memory for blob argument of",U,"byte(s)"),u=U?o.heap8u().slice(ee,ee+Number(U)):null;break}case s.SQLITE_NULL:u=null;break;default:_&&R(s.SQLITE_MISMATCH,"Unhandled sqlite3_value_type():",I),u=void 0}return u},s.sqlite3_values_to_js=function(l,_,u=!0){let I;const U=[];for(I=0;I<l;++I)U.push(s.sqlite3_value_to_js(o.peekPtr(_+o.ptrSizeof*I),u));return U},s.sqlite3_result_error_js=function(l,_){_ instanceof d?s.sqlite3_result_error_nomem(l):s.sqlite3_result_error(l,""+_,-1)},s.sqlite3_result_js=function(l,_){if(_ instanceof Error){s.sqlite3_result_error_js(l,_);return}try{switch(typeof _){case"undefined":break;case"boolean":s.sqlite3_result_int(l,_?1:0);break;case"bigint":y.bigIntFits32(_)?s.sqlite3_result_int(l,Number(_)):y.bigIntFitsDouble(_)?s.sqlite3_result_double(l,Number(_)):o.bigIntEnabled?y.bigIntFits64(_)?s.sqlite3_result_int64(l,_):R("BigInt value",_.toString(),"is too BigInt for int64."):R("BigInt value",_.toString(),"is too BigInt.");break;case"number":{let u;y.isInt32(_)?u=s.sqlite3_result_int:o.bigIntEnabled&&Number.isInteger(_)&&y.bigIntFits64(BigInt(_))?u=s.sqlite3_result_int64:u=s.sqlite3_result_double,u(l,_);break}case"string":{const[u,I]=o.allocCString(_,!0);s.sqlite3_result_text(l,u,I,s.SQLITE_WASM_DEALLOC);break}case"object":if(_===null){s.sqlite3_result_null(l);break}else if(y.isBindableTypedArray(_)){const u=o.allocFromTypedArray(_);s.sqlite3_result_blob(l,u,_.byteLength,s.SQLITE_WASM_DEALLOC);break}default:R("Don't not how to handle this UDF result value:",typeof _,_)}}catch(u){s.sqlite3_result_error_js(l,u)}},s.sqlite3_column_js=function(l,_,u=!0){const I=s.sqlite3_column_value(l,_);return I===0?void 0:s.sqlite3_value_to_js(I,u)};const f=(function(l,_,u){u=s[u],this.ptr?o.pokePtr(this.ptr,0):this.ptr=o.allocPtr();const I=u(l,_,this.ptr);if(I)return P.toss(I,arguments[2]+"() failed with code "+I);const U=o.peekPtr(this.ptr);return U?s.sqlite3_value_to_js(U,!0):void 0}).bind(Object.create(null));s.sqlite3_preupdate_new_js=(l,_)=>f(l,_,"sqlite3_preupdate_new"),s.sqlite3_preupdate_old_js=(l,_)=>f(l,_,"sqlite3_preupdate_old"),s.sqlite3changeset_new_js=(l,_)=>f(l,_,"sqlite3changeset_new"),s.sqlite3changeset_old_js=(l,_)=>f(l,_,"sqlite3changeset_old");const h={WasmAllocError:d,SQLite3Error:P,capi:s,util:y,wasm:o,config:r,version:Object.create(null),client:void 0,asyncPostInit:async function l(){if(l.isReady instanceof Promise)return l.isReady;let _=t.initializersAsync;delete t.initializersAsync;const u=async()=>(h.__isUnderTest||(delete h.util,delete h.StructBinder),h),I=ee=>{throw r.error("an async sqlite3 initializer failed:",ee),ee};if(!_||!_.length)return l.isReady=u().catch(I);_=_.map(ee=>ee instanceof Function?async ne=>ee(h):ee),_.push(u);let U=Promise.resolve(h);for(;_.length;)U=U.then(_.shift());return l.isReady=U.catch(I)},scriptInfo:void 0};try{t.initializers.forEach(l=>{l(h)})}catch(l){throw console.error("sqlite3 bootstrap initializer threw:",l),l}return delete t.initializers,t.sqlite3=h,h},globalThis.sqlite3ApiBootstrap.initializers=[],globalThis.sqlite3ApiBootstrap.initializersAsync=[],globalThis.sqlite3ApiBootstrap.defaultConfig=Object.create(null),globalThis.sqlite3ApiBootstrap.sqlite3=void 0,globalThis.WhWasmUtilInstaller=function(t){t.bigIntEnabled===void 0&&(t.bigIntEnabled=!!globalThis.BigInt64Array);const n=(...c)=>{throw new Error(c.join(" "))};t.exports||Object.defineProperty(t,"exports",{enumerable:!0,configurable:!0,get:()=>t.instance&&t.instance.exports});const r=t.pointerIR||"i32",s=t.ptrSizeof=r==="i32"?4:r==="i64"?8:n("Unhandled ptrSizeof:",r),o=Object.create(null);o.heapSize=0,o.memory=null,o.freeFuncIndexes=[],o.scopedAlloc=[],o.utf8Decoder=new TextDecoder,o.utf8Encoder=new TextEncoder("utf-8"),t.sizeofIR=c=>{switch(c){case"i8":return 1;case"i16":return 2;case"i32":case"f32":case"float":return 4;case"i64":case"f64":case"double":return 8;case"*":return s;default:return(""+c).endsWith("*")?s:void 0}};const p=function(){if(!o.memory)o.memory=t.memory instanceof WebAssembly.Memory?t.memory:t.exports.memory;else if(o.heapSize===o.memory.buffer.byteLength)return o;const c=o.memory.buffer;return o.HEAP8=new Int8Array(c),o.HEAP8U=new Uint8Array(c),o.HEAP16=new Int16Array(c),o.HEAP16U=new Uint16Array(c),o.HEAP32=new Int32Array(c),o.HEAP32U=new Uint32Array(c),t.bigIntEnabled&&(o.HEAP64=new BigInt64Array(c),o.HEAP64U=new BigUint64Array(c)),o.HEAP32F=new Float32Array(c),o.HEAP64F=new Float64Array(c),o.heapSize=c.byteLength,o};t.heap8=()=>p().HEAP8,t.heap8u=()=>p().HEAP8U,t.heap16=()=>p().HEAP16,t.heap16u=()=>p().HEAP16U,t.heap32=()=>p().HEAP32,t.heap32u=()=>p().HEAP32U,t.heapForSize=function(c,d=!0){const y=o.memory&&o.heapSize===o.memory.buffer.byteLength?o:p();switch(c){case Int8Array:return y.HEAP8;case Uint8Array:return y.HEAP8U;case Int16Array:return y.HEAP16;case Uint16Array:return y.HEAP16U;case Int32Array:return y.HEAP32;case Uint32Array:return y.HEAP32U;case 8:return d?y.HEAP8U:y.HEAP8;case 16:return d?y.HEAP16U:y.HEAP16;case 32:return d?y.HEAP32U:y.HEAP32;case 64:if(y.HEAP64)return d?y.HEAP64U:y.HEAP64;break;default:if(t.bigIntEnabled){if(c===globalThis.BigUint64Array)return y.HEAP64U;if(c===globalThis.BigInt64Array)return y.HEAP64;break}}n("Invalid heapForSize() size: expecting 8, 16, 32,","or (if BigInt is enabled) 64.")},t.functionTable=function(){return t.exports.__indirect_function_table},t.functionEntry=function(c){const d=t.functionTable();return c<d.length?d.get(c):void 0},t.jsFuncToWasm=function c(d,y){if(c._||(c._={sigTypes:Object.assign(Object.create(null),{i:"i32",p:"i32",P:"i32",s:"i32",j:"i64",f:"f32",d:"f64"}),typeCodes:Object.assign(Object.create(null),{f64:124,f32:125,i64:126,i32:127}),uleb128Encode:function(h,l,_){_<128?h[l](_):h[l](_%128|128,_>>7)},rxJSig:/^(\w)\((\w*)\)$/,sigParams:function(h){const l=c._.rxJSig.exec(h);return l?l[2]:h.substr(1)},letterType:h=>c._.sigTypes[h]||n("Invalid signature letter:",h),pushSigType:(h,l)=>h.push(c._.typeCodes[c._.letterType(l)])}),typeof d=="string"){const h=y;y=d,d=h}const B=c._.sigParams(y),f=[1,96];c._.uleb128Encode(f,"push",B.length);for(const h of B)c._.pushSigType(f,h);return y[0]==="v"?f.push(0):(f.push(1),c._.pushSigType(f,y[0])),c._.uleb128Encode(f,"unshift",f.length),f.unshift(0,97,115,109,1,0,0,0,1),f.push(2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0),new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array(f)),{e:{f:d}}).exports.f};const g=function(d,y,B){if(B&&!o.scopedAlloc.length&&n("No scopedAllocPush() scope is active."),typeof d=="string"){const _=y;y=d,d=_}(typeof y!="string"||!(d instanceof Function))&&n("Invalid arguments: expecting (function,signature) or (signature,function).");const f=t.functionTable(),h=f.length;let l;for(;o.freeFuncIndexes.length&&(l=o.freeFuncIndexes.pop(),f.get(l));){l=null;continue}l||(l=h,f.grow(1));try{return f.set(l,d),B&&o.scopedAlloc[o.scopedAlloc.length-1].push(l),l}catch(_){if(!(_ instanceof TypeError))throw l===h&&o.freeFuncIndexes.push(h),_}try{const _=t.jsFuncToWasm(d,y);f.set(l,_),B&&o.scopedAlloc[o.scopedAlloc.length-1].push(l)}catch(_){throw l===h&&o.freeFuncIndexes.push(h),_}return l};t.installFunction=(c,d)=>g(c,d,!1),t.scopedInstallFunction=(c,d)=>g(c,d,!0),t.uninstallFunction=function(c){if(!c&&c!==0)return;const d=o.freeFuncIndexes,y=t.functionTable();d.push(c);const B=y.get(c);return y.set(c,null),B},t.peek=function(d,y="i8"){y.endsWith("*")&&(y=r);const B=o.memory&&o.heapSize===o.memory.buffer.byteLength?o:p(),f=Array.isArray(d)?[]:void 0;let h;do{switch(f&&(d=arguments[0].shift()),y){case"i1":case"i8":h=B.HEAP8[d>>0];break;case"i16":h=B.HEAP16[d>>1];break;case"i32":h=B.HEAP32[d>>2];break;case"float":case"f32":h=B.HEAP32F[d>>2];break;case"double":case"f64":h=Number(B.HEAP64F[d>>3]);break;case"i64":if(t.bigIntEnabled){h=BigInt(B.HEAP64[d>>3]);break}default:n("Invalid type for peek():",y)}f&&f.push(h)}while(f&&arguments[0].length);return f||h},t.poke=function(c,d,y="i8"){y.endsWith("*")&&(y=r);const B=o.memory&&o.heapSize===o.memory.buffer.byteLength?o:p();for(const f of Array.isArray(c)?c:[c])switch(y){case"i1":case"i8":B.HEAP8[f>>0]=d;continue;case"i16":B.HEAP16[f>>1]=d;continue;case"i32":B.HEAP32[f>>2]=d;continue;case"float":case"f32":B.HEAP32F[f>>2]=d;continue;case"double":case"f64":B.HEAP64F[f>>3]=d;continue;case"i64":if(B.HEAP64){B.HEAP64[f>>3]=BigInt(d);continue}default:n("Invalid type for poke(): "+y)}return this},t.peekPtr=(...c)=>t.peek(c.length===1?c[0]:c,r),t.pokePtr=(c,d=0)=>t.poke(c,d,r),t.peek8=(...c)=>t.peek(c.length===1?c[0]:c,"i8"),t.poke8=(c,d)=>t.poke(c,d,"i8"),t.peek16=(...c)=>t.peek(c.length===1?c[0]:c,"i16"),t.poke16=(c,d)=>t.poke(c,d,"i16"),t.peek32=(...c)=>t.peek(c.length===1?c[0]:c,"i32"),t.poke32=(c,d)=>t.poke(c,d,"i32"),t.peek64=(...c)=>t.peek(c.length===1?c[0]:c,"i64"),t.poke64=(c,d)=>t.poke(c,d,"i64"),t.peek32f=(...c)=>t.peek(c.length===1?c[0]:c,"f32"),t.poke32f=(c,d)=>t.poke(c,d,"f32"),t.peek64f=(...c)=>t.peek(c.length===1?c[0]:c,"f64"),t.poke64f=(c,d)=>t.poke(c,d,"f64"),t.getMemValue=t.peek,t.getPtrValue=t.peekPtr,t.setMemValue=t.poke,t.setPtrValue=t.pokePtr,t.isPtr32=c=>typeof c=="number"&&c===(c|0)&&c>=0,t.isPtr=t.isPtr32,t.cstrlen=function(c){if(!c||!t.isPtr(c))return null;const d=p().HEAP8U;let y=c;for(;d[y]!==0;++y);return y-c};const P=typeof SharedArrayBuffer>"u"?function(){}:SharedArrayBuffer,R=function(c,d,y){return o.utf8Decoder.decode(c.buffer instanceof P?c.slice(d,y):c.subarray(d,y))};t.cstrToJs=function(c){const d=t.cstrlen(c);return d?R(p().HEAP8U,c,c+d):d===null?d:""},t.jstrlen=function(c){if(typeof c!="string")return null;const d=c.length;let y=0;for(let B=0;B<d;++B){let f=c.charCodeAt(B);f>=55296&&f<=57343&&(f=65536+((f&1023)<<10)|c.charCodeAt(++B)&1023),f<=127?++y:f<=2047?y+=2:f<=65535?y+=3:y+=4}return y},t.jstrcpy=function(c,d,y=0,B=-1,f=!0){if((!d||!(d instanceof Int8Array)&&!(d instanceof Uint8Array))&&n("jstrcpy() target must be an Int8Array or Uint8Array."),B<0&&(B=d.length-y),!(B>0)||!(y>=0))return 0;let h=0,l=c.length;const _=y,u=y+B-(f?1:0);for(;h<l&&y<u;++h){let I=c.charCodeAt(h);if(I>=55296&&I<=57343&&(I=65536+((I&1023)<<10)|c.charCodeAt(++h)&1023),I<=127){if(y>=u)break;d[y++]=I}else if(I<=2047){if(y+1>=u)break;d[y++]=192|I>>6,d[y++]=128|I&63}else if(I<=65535){if(y+2>=u)break;d[y++]=224|I>>12,d[y++]=128|I>>6&63,d[y++]=128|I&63}else{if(y+3>=u)break;d[y++]=240|I>>18,d[y++]=128|I>>12&63,d[y++]=128|I>>6&63,d[y++]=128|I&63}}return f&&(d[y++]=0),y-_},t.cstrncpy=function(c,d,y){if((!c||!d)&&n("cstrncpy() does not accept NULL strings."),y<0)y=t.cstrlen(strPtr)+1;else if(!(y>0))return 0;const B=t.heap8u();let f=0,h;for(;f<y&&(h=B[d+f]);++f)B[c+f]=h;return f<y&&(B[c+f++]=0),f},t.jstrToUintArray=(c,d=!1)=>o.utf8Encoder.encode(d?c+"\0":c);const z=(c,d)=>{(!(c.alloc instanceof Function)||!(c.dealloc instanceof Function))&&n("Object is missing alloc() and/or dealloc() function(s)","required by",d+"().")},Q=function(c,d,y,B){if(z(t,B),typeof c!="string")return null;{const f=o.utf8Encoder.encode(c),h=y(f.length+1),l=p().HEAP8U;return l.set(f,h),l[h+f.length]=0,d?[h,f.length]:h}};t.allocCString=(c,d=!1)=>Q(c,d,t.alloc,"allocCString()"),t.scopedAllocPush=function(){z(t,"scopedAllocPush");const c=[];return o.scopedAlloc.push(c),c},t.scopedAllocPop=function(c){z(t,"scopedAllocPop");const d=arguments.length?o.scopedAlloc.indexOf(c):o.scopedAlloc.length-1;d<0&&n("Invalid state object for scopedAllocPop()."),arguments.length===0&&(c=o.scopedAlloc[d]),o.scopedAlloc.splice(d,1);for(let y;y=c.pop();)t.functionEntry(y)?t.uninstallFunction(y):t.dealloc(y)},t.scopedAlloc=function(c){o.scopedAlloc.length||n("No scopedAllocPush() scope is active.");const d=t.alloc(c);return o.scopedAlloc[o.scopedAlloc.length-1].push(d),d},Object.defineProperty(t.scopedAlloc,"level",{configurable:!1,enumerable:!1,get:()=>o.scopedAlloc.length,set:()=>n("The 'active' property is read-only.")}),t.scopedAllocCString=(c,d=!1)=>Q(c,d,t.scopedAlloc,"scopedAllocCString()");const T=function(c,d){const y=t[c?"scopedAlloc":"alloc"]((d.length+1)*t.ptrSizeof);let B=0;return d.forEach(f=>{t.pokePtr(y+t.ptrSizeof*B++,t[c?"scopedAllocCString":"allocCString"](""+f))}),t.pokePtr(y+t.ptrSizeof*B,0),y};t.scopedAllocMainArgv=c=>T(!0,c),t.allocMainArgv=c=>T(!1,c),t.cArgvToJs=(c,d)=>{const y=[];for(let B=0;B<c;++B){const f=t.peekPtr(d+t.ptrSizeof*B);y.push(f?t.cstrToJs(f):null)}return y},t.scopedAllocCall=function(c){t.scopedAllocPush();try{return c()}finally{t.scopedAllocPop()}};const A=function(c,d,y){z(t,y);const B=d?"i64":r;let f=t[y](c*(d?8:s));if(t.poke(f,0,B),c===1)return f;const h=[f];for(let l=1;l<c;++l)f+=d?8:s,h[l]=f,t.poke(f,0,B);return h};t.allocPtr=(c=1,d=!0)=>A(c,d,"alloc"),t.scopedAllocPtr=(c=1,d=!0)=>A(c,d,"scopedAlloc"),t.xGet=function(c){return t.exports[c]||n("Cannot find exported symbol:",c)};const D=(c,d)=>n(c+"() requires",d,"argument(s).");t.xCall=function(c,...d){const y=c instanceof Function?c:t.xGet(c);return y instanceof Function||n("Exported symbol",c,"is not a function."),y.length!==d.length&&D(y===c?y.name:c,y.length),arguments.length===2&&Array.isArray(arguments[1])?y.apply(null,arguments[1]):y.apply(null,d)},o.xWrap=Object.create(null),o.xWrap.convert=Object.create(null),o.xWrap.convert.arg=new Map,o.xWrap.convert.result=new Map;const q=o.xWrap.convert.arg,w=o.xWrap.convert.result;t.bigIntEnabled&&q.set("i64",c=>BigInt(c));const x=r==="i32"?c=>c|0:c=>BigInt(c)|BigInt(0);q.set("i32",x).set("i16",c=>(c|0)&65535).set("i8",c=>(c|0)&255).set("f32",c=>Number(c).valueOf()).set("float",q.get("f32")).set("f64",q.get("f32")).set("double",q.get("f64")).set("int",q.get("i32")).set("null",c=>c).set(null,q.get("null")).set("**",x).set("*",x),w.set("*",x).set("pointer",x).set("number",c=>Number(c)).set("void",c=>{}).set("null",c=>c).set(null,w.get("null"));{const c=["i8","i16","i32","int","f32","float","f64","double"];t.bigIntEnabled&&c.push("i64");const d=q.get(r);for(const y of c)q.set(y+"*",d),w.set(y+"*",d),w.set(y,q.get(y)||n("Missing arg converter:",y))}const N=function(c){return typeof c=="string"?t.scopedAllocCString(c):c?x(c):null};q.set("string",N).set("utf8",N).set("pointer",N),w.set("string",c=>t.cstrToJs(c)).set("utf8",w.get("string")).set("string:dealloc",c=>{try{return c?t.cstrToJs(c):null}finally{t.dealloc(c)}}).set("utf8:dealloc",w.get("string:dealloc")).set("json",c=>JSON.parse(t.cstrToJs(c))).set("json:dealloc",c=>{try{return c?JSON.parse(t.cstrToJs(c)):null}finally{t.dealloc(c)}});const O=class{constructor(c){this.name=c.name||"unnamed adapter"}convertArg(c,d,y){n("AbstractArgAdapter must be subclassed.")}};q.FuncPtrAdapter=class Te extends O{constructor(d){super(d),q.FuncPtrAdapter.warnOnUse&&console.warn("xArg.FuncPtrAdapter is an internal-only API","and is not intended to be invoked from","client-level code. Invoked with:",d),this.name=d.name||"unnamed",this.signature=d.signature,d.contextKey instanceof Function&&(this.contextKey=d.contextKey,d.bindScope||(d.bindScope="context")),this.bindScope=d.bindScope||n("FuncPtrAdapter options requires a bindScope (explicit or implied)."),Te.bindScopes.indexOf(d.bindScope)<0&&n("Invalid options.bindScope ("+d.bindMod+") for FuncPtrAdapter. Expecting one of: ("+Te.bindScopes.join(", ")+")"),this.isTransient=this.bindScope==="transient",this.isContext=this.bindScope==="context",this.isPermanent=this.bindScope==="permanent",this.singleton=this.bindScope==="singleton"?[]:void 0,this.callProxy=d.callProxy instanceof Function?d.callProxy:void 0}contextKey(d,y){return this}contextMap(d){const y=this.__cmap||(this.__cmap=new Map);let B=y.get(d);return B===void 0&&y.set(d,B=[]),B}convertArg(d,y,B){let f=this.singleton;if(!f&&this.isContext&&(f=this.contextMap(this.contextKey(y,B))),f&&f[0]===d)return f[1];if(d instanceof Function){this.callProxy&&(d=this.callProxy(d));const h=g(d,this.signature,this.isTransient);if(Te.debugFuncInstall&&Te.debugOut("FuncPtrAdapter installed",this,this.contextKey(y,B),"@"+h,d),f){if(f[1]){Te.debugFuncInstall&&Te.debugOut("FuncPtrAdapter uninstalling",this,this.contextKey(y,B),"@"+f[1],d);try{o.scopedAlloc[o.scopedAlloc.length-1].push(f[1])}catch{}}f[0]=d,f[1]=h}return h}else if(t.isPtr(d)||d===null||d===void 0){if(f&&f[1]&&f[1]!==d){Te.debugFuncInstall&&Te.debugOut("FuncPtrAdapter uninstalling",this,this.contextKey(y,B),"@"+f[1],d);try{o.scopedAlloc[o.scopedAlloc.length-1].push(f[1])}catch{}f[0]=f[1]=d|0}return d||0}else throw new TypeError("Invalid FuncPtrAdapter argument type. Expecting a function pointer or a "+(this.name?this.name+" ":"")+"function matching signature "+this.signature+".")}},q.FuncPtrAdapter.warnOnUse=!1,q.FuncPtrAdapter.debugFuncInstall=!1,q.FuncPtrAdapter.debugOut=console.debug.bind(console),q.FuncPtrAdapter.bindScopes=["transient","context","singleton","permanent"];const S=c=>q.get(c)||n("Argument adapter not found:",c),L=c=>w.get(c)||n("Result adapter not found:",c);o.xWrap.convertArg=(c,...d)=>S(c)(...d),o.xWrap.convertArgNoCheck=(c,...d)=>q.get(c)(...d),o.xWrap.convertResult=(c,d)=>c===null?d:c?L(c)(d):void 0,o.xWrap.convertResultNoCheck=(c,d)=>c===null?d:c?w.get(c)(d):void 0,t.xWrap=function(c,d,...y){arguments.length===3&&Array.isArray(arguments[2])&&(y=arguments[2]),t.isPtr(c)&&(c=t.functionEntry(c)||n("Function pointer not found in WASM function table."));const B=c instanceof Function,f=B?c:t.xGet(c);if(B&&(c=f.name||"unnamed function"),y.length!==f.length&&D(c,f.length),d===null&&f.length===0)return f;d!=null&&L(d);for(const l of y)l instanceof O?q.set(l,(..._)=>l.convertArg(..._)):S(l);const h=o.xWrap;return f.length===0?(...l)=>l.length?D(c,f.length):h.convertResult(d,f.call(null)):function(...l){l.length!==f.length&&D(c,f.length);const _=t.scopedAllocPush();try{let u=0;for(;u<l.length;++u)l[u]=h.convertArgNoCheck(y[u],l[u],l,u);return h.convertResultNoCheck(d,f.apply(null,l))}finally{t.scopedAllocPop(_)}}};const $=function(c,d,y,B,f,h){if(typeof y=="string"){if(d===1)return h.get(y);if(d===2){if(B)B instanceof Function||n(f,"requires a function argument.");else return h.delete(y),c;return h.set(y,B),c}}n("Invalid arguments to",f)};return t.xWrap.resultAdapter=function c(d,y){return $(c,arguments.length,d,y,"resultAdapter()",w)},t.xWrap.argAdapter=function c(d,y){return $(c,arguments.length,d,y,"argAdapter()",q)},t.xWrap.FuncPtrAdapter=q.FuncPtrAdapter,t.xCallWrapped=function(c,d,y,...B){return Array.isArray(arguments[3])&&(B=arguments[3]),t.xWrap(c,d,y||[]).apply(null,B||[])},t.xWrap.testConvertArg=o.xWrap.convertArg,t.xWrap.testConvertResult=o.xWrap.convertResult,t},globalThis.WhWasmUtilInstaller.yawl=(function(t){const n=()=>fetch(t.uri,{credentials:"same-origin"}),r=this,s=function(p){if(t.wasmUtilTarget){const g=(...R)=>{throw new Error(R.join(" "))},P=t.wasmUtilTarget;if(P.module=p.module,P.instance=p.instance,P.instance.exports.memory||(P.memory=t.imports&&t.imports.env&&t.imports.env.memory||g("Missing 'memory' object!")),!P.alloc&&p.instance.exports.malloc){const R=p.instance.exports;P.alloc=function(z){return R.malloc(z)||g("Allocation of",z,"bytes failed.")},P.dealloc=function(z){R.free(z)}}r(P)}return t.onload&&t.onload(p,t),p};return WebAssembly.instantiateStreaming?function(){return WebAssembly.instantiateStreaming(n(),t.imports||{}).then(s)}:function(){return n().then(g=>g.arrayBuffer()).then(g=>WebAssembly.instantiate(g,t.imports||{})).then(s)}}).bind(globalThis.WhWasmUtilInstaller),globalThis.Jaccwabyt=function t(n){const r=(...F)=>{throw new Error(F.join(" "))};!(n.heap instanceof WebAssembly.Memory)&&!(n.heap instanceof Function)&&r("config.heap must be WebAssembly.Memory instance or a function."),["alloc","dealloc"].forEach(function(F){n[F]instanceof Function||r("Config option '"+F+"' must be a function.")});const s=t,o=n.heap instanceof Function?n.heap:()=>new Uint8Array(n.heap.buffer),p=n.alloc,g=n.dealloc,P=n.log||console.log.bind(console),R=n.memberPrefix||"",z=n.memberSuffix||"",Q=n.bigIntEnabled===void 0?!!globalThis.BigInt64Array:!!n.bigIntEnabled,T=globalThis.BigInt,A=globalThis.BigInt64Array,D=n.ptrSizeof||4,q=n.ptrIR||"i32";s.debugFlags||(s.__makeDebugFlags=function(F=null){F&&F.__flags&&(F=F.__flags);const V=function K(X){return arguments.length===0?K.__flags:(X<0?(delete K.__flags.getter,delete K.__flags.setter,delete K.__flags.alloc,delete K.__flags.dealloc):(K.__flags.getter=(1&X)!==0,K.__flags.setter=(2&X)!==0,K.__flags.alloc=(4&X)!==0,K.__flags.dealloc=(8&X)!==0),K._flags)};return Object.defineProperty(V,"__flags",{iterable:!1,writable:!1,value:Object.create(F)}),F||V(0),V},s.debugFlags=s.__makeDebugFlags());const w=(function(){const F=new ArrayBuffer(2);return new DataView(F).setInt16(0,256,!0),new Int16Array(F)[0]===256})(),x=F=>F[1]==="(",N=F=>F==="P",O=F=>x(F)?"p":F[0],S=function(F){switch(O(F)){case"c":case"C":return"i8";case"i":return"i32";case"p":case"P":case"s":return q;case"j":return"i64";case"f":return"float";case"d":return"double"}r("Unhandled signature IR:",F)},L=A?()=>!0:()=>r("BigInt64Array is not available."),$=function(F){switch(O(F)){case"p":case"P":case"s":{switch(D){case 4:return"getInt32";case 8:return L()&&"getBigInt64"}break}case"i":return"getInt32";case"c":return"getInt8";case"C":return"getUint8";case"j":return L()&&"getBigInt64";case"f":return"getFloat32";case"d":return"getFloat64"}r("Unhandled DataView getter for signature:",F)},c=function(F){switch(O(F)){case"p":case"P":case"s":{switch(D){case 4:return"setInt32";case 8:return L()&&"setBigInt64"}break}case"i":return"setInt32";case"c":return"setInt8";case"C":return"setUint8";case"j":return L()&&"setBigInt64";case"f":return"setFloat32";case"d":return"setFloat64"}r("Unhandled DataView setter for signature:",F)},d=function(F){switch(O(F)){case"i":case"f":case"c":case"C":case"d":return Number;case"j":return L()&&T;case"p":case"P":case"s":switch(D){case 4:return Number;case 8:return L()&&T}break}r("Unhandled DataView set wrapper for signature:",F)},y=(F,V)=>F+"::"+V,B=function(F,V){return()=>r(y(F,V),"is read-only.")},f=new WeakMap,h="(pointer-is-external)",l=function(F,V,K){if(K||(K=f.get(V)),K){if(f.delete(V),Array.isArray(V.ondispose)){let X;for(;X=V.ondispose.shift();)try{X instanceof Function?X.call(V):X instanceof te?X.dispose():typeof X=="number"&&g(X)}catch(_e){console.warn("ondispose() for",F.structName,"@",K,"threw. NOT propagating it.",_e)}}else if(V.ondispose instanceof Function)try{V.ondispose()}catch(X){console.warn("ondispose() for",F.structName,"@",K,"threw. NOT propagating it.",X)}delete V.ondispose,F.debugFlags.__flags.dealloc&&P("debug.dealloc:",V[h]?"EXTERNAL":"",F.structName,"instance:",F.structInfo.sizeof,"bytes @"+K),V[h]||g(K)}},_=F=>({configurable:!1,writable:!1,iterable:!1,value:F}),u=function(F,V,K){let X=!K;K?Object.defineProperty(V,h,_(K)):(K=p(F.structInfo.sizeof),K||r("Allocation of",F.structName,"structure failed."));try{F.debugFlags.__flags.alloc&&P("debug.alloc:",X?"":"EXTERNAL",F.structName,"instance:",F.structInfo.sizeof,"bytes @"+K),X&&o().fill(0,K,K+F.structInfo.sizeof),f.set(V,K)}catch(_e){throw l(F,V,K),_e}},I=function(){const F=this.pointer;return F?new Uint8Array(o().slice(F,F+this.structInfo.sizeof)):null},ee=_(F=>R+F+z),ne=function(F,V,K=!0){let X=F.members[V];if(!X&&(R||z)){for(const _e of Object.values(F.members))if(_e.key===V){X=_e;break}!X&&K&&r(y(F.name,V),"is not a mapped struct member.")}return X},se=function F(V,K,X=!1){F._||(F._=he=>he.replace(/[^vipPsjrdcC]/g,"").replace(/[pPscC]/g,"i"));const _e=ne(V.structInfo,K,!0);return X?F._(_e.signature):_e.signature},ie={configurable:!1,enumerable:!1,get:function(){return f.get(this)},set:()=>r("Cannot assign the 'pointer' property of a struct.")},j=_(function(){const F=[];for(const V of Object.keys(this.structInfo.members))F.push(this.memberKey(V));return F}),b=new TextDecoder("utf-8"),k=new TextEncoder,W=typeof SharedArrayBuffer>"u"?function(){}:SharedArrayBuffer,H=function(F,V,K){return b.decode(F.buffer instanceof W?F.slice(V,K):F.subarray(V,K))},Z=function(F,V,K=!1){const X=ne(F.structInfo,V,K);return X&&X.signature.length===1&&X.signature[0]==="s"?X:!1},E=function(F){F.signature!=="s"&&r("Invalid member type signature for C-string value:",JSON.stringify(F))},C=function(V,K){const X=ne(V.structInfo,K,!0);E(X);const _e=V[X.key];if(!_e)return null;let he=_e;const de=o();for(;de[he]!==0;++he);return _e===he?"":H(de,_e,he)},M=function(F,...V){F.ondispose?Array.isArray(F.ondispose)||(F.ondispose=[F.ondispose]):F.ondispose=[],F.ondispose.push(...V)},J=function(F){const V=k.encode(F),K=p(V.length+1);K||r("Allocation error while duplicating string:",F);const X=o();return X.set(V,K),X[K+V.length]=0,K},G=function(F,V,K){const X=ne(F.structInfo,V,!0);E(X);const _e=J(K);return F[X.key]=_e,M(F,_e),F},te=function(V,K){arguments[2]!==_&&r("Do not call the StructType constructor","from client-level code."),Object.defineProperties(this,{structName:_(V),structInfo:_(K)})};te.prototype=Object.create(null,{dispose:_(function(){l(this.constructor,this)}),lookupMember:_(function(F,V=!0){return ne(this.structInfo,F,V)}),memberToJsString:_(function(F){return C(this,F)}),memberIsString:_(function(F,V=!0){return Z(this,F,V)}),memberKey:ee,memberKeys:j,memberSignature:_(function(F,V=!1){return se(this,F,V)}),memoryDump:_(I),pointer:ie,setMemberCString:_(function(F,V){return G(this,F,V)})}),Object.assign(te.prototype,{addOnDispose:function(...F){return M(this,...F),this}}),Object.defineProperties(te,{allocCString:_(J),isA:_(F=>F instanceof te),hasExternalPointer:_(F=>F instanceof te&&!!F[h]),memberKey:ee});const le=F=>Number.isFinite(F)||F instanceof(T||Number),Y=function F(V,K,X){if(!F._){F._={getters:{},setters:{},sw:{}};const ve=["i","c","C","p","P","s","f","d","v()"];Q&&ve.push("j"),ve.forEach(function(Se){F._.getters[Se]=$(Se),F._.setters[Se]=c(Se),F._.sw[Se]=d(Se)});const $n=/^[ipPsjfdcC]$/,Kn=/^[vipPsjfdcC]\([ipPsjfdcC]*\)$/;F.sigCheck=function(Se,Jn,Tt,_t){Object.prototype.hasOwnProperty.call(Se,Tt)&&r(Se.structName,"already has a property named",Tt+"."),$n.test(_t)||Kn.test(_t)||r("Malformed signature for",y(Se.structName,Jn)+":",_t)}}const _e=V.memberKey(K);F.sigCheck(V.prototype,K,_e,X.signature),X.key=_e,X.name=K;const he=O(X.signature),de=y(V.prototype.structName,_e),pe=V.prototype.debugFlags.__flags,We=Object.create(null);We.configurable=!1,We.enumerable=!1,We.get=function(){pe.getter&&P("debug.getter:",F._.getters[he],"for",S(he),de,"@",this.pointer,"+",X.offset,"sz",X.sizeof);let ve=new DataView(o().buffer,this.pointer+X.offset,X.sizeof)[F._.getters[he]](0,w);return pe.getter&&P("debug.getter:",de,"result =",ve),ve},X.readOnly?We.set=B(V.prototype.structName,_e):We.set=function(ve){if(pe.setter&&P("debug.setter:",F._.setters[he],"for",S(he),de,"@",this.pointer,"+",X.offset,"sz",X.sizeof,ve),this.pointer||r("Cannot set struct property on disposed instance."),ve===null)ve=0;else for(;!le(ve);){if(N(X.signature)&&ve instanceof te){ve=ve.pointer||0,pe.setter&&P("debug.setter:",de,"resolved to",ve);break}r("Invalid value for pointer-type",de+".")}new DataView(o().buffer,this.pointer+X.offset,X.sizeof)[F._.setters[he]](0,F._.sw[he](ve),w)},Object.defineProperty(V.prototype,_e,We)},be=function F(V,K){arguments.length===1?(K=V,V=K.name):K.name||(K.name=V),V||r("Struct name is required.");let X=!1;Object.keys(K.members).forEach(de=>{const pe=K.members[de];pe.sizeof?pe.sizeof===1?pe.signature==="c"||pe.signature==="C"||r("Unexpected sizeof==1 member",y(K.name,de),"with signature",pe.signature):(pe.sizeof%4!==0&&(console.warn("Invalid struct member description =",pe,"from",K),r(V,"member",de,"sizeof is not aligned. sizeof="+pe.sizeof)),pe.offset%4!==0&&(console.warn("Invalid struct member description =",pe,"from",K),r(V,"member",de,"offset is not aligned. offset="+pe.offset))):r(V,"member",de,"is missing sizeof."),(!X||X.offset<pe.offset)&&(X=pe)}),X?K.sizeof<X.offset+X.sizeof&&r("Invalid struct config:",V,"max member offset ("+X.offset+") ","extends past end of struct (sizeof="+K.sizeof+")."):r("No member property descriptions found.");const _e=_(s.__makeDebugFlags(F.debugFlags)),he=function de(pe){this instanceof de?arguments.length?((pe!==(pe|0)||pe<=0)&&r("Invalid pointer value for",V,"constructor."),u(de,this,pe)):u(de,this):r("The",V,"constructor may only be called via 'new'.")};return Object.defineProperties(he,{debugFlags:_e,isA:_(de=>de instanceof he),memberKey:ee,memberKeys:j,methodInfoForKey:_(function(de){}),structInfo:_(K),structName:_(V)}),he.prototype=new te(V,K,_),Object.defineProperties(he.prototype,{debugFlags:_e,constructor:_(he)}),Object.keys(K.members).forEach(de=>Y(he,de,K.members[de])),he};return be.StructType=te,be.config=n,be.allocCString=J,be.debugFlags||(be.debugFlags=s.__makeDebugFlags(s.debugFlags)),be},globalThis.sqlite3ApiBootstrap.initializers.push(function(t){const n=(...q)=>{throw new Error(q.join(" "))};t.SQLite3Error.toss;const r=t.capi,s=t.wasm,o=t.util;if(globalThis.WhWasmUtilInstaller(s),delete globalThis.WhWasmUtilInstaller,s.bindingSignatures=[["sqlite3_aggregate_context","void*","sqlite3_context*","int"],["sqlite3_bind_double","int","sqlite3_stmt*","int","f64"],["sqlite3_bind_int","int","sqlite3_stmt*","int","int"],["sqlite3_bind_null",void 0,"sqlite3_stmt*","int"],["sqlite3_bind_parameter_count","int","sqlite3_stmt*"],["sqlite3_bind_parameter_index","int","sqlite3_stmt*","string"],["sqlite3_bind_parameter_name","string","sqlite3_stmt*","int"],["sqlite3_bind_pointer","int","sqlite3_stmt*","int","*","string:static","*"],["sqlite3_busy_handler","int",["sqlite3*",new s.xWrap.FuncPtrAdapter({signature:"i(pi)",contextKey:(q,w)=>q[0]}),"*"]],["sqlite3_busy_timeout","int","sqlite3*","int"],["sqlite3_changes","int","sqlite3*"],["sqlite3_clear_bindings","int","sqlite3_stmt*"],["sqlite3_collation_needed","int","sqlite3*","*","*"],["sqlite3_column_blob","*","sqlite3_stmt*","int"],["sqlite3_column_bytes","int","sqlite3_stmt*","int"],["sqlite3_column_count","int","sqlite3_stmt*"],["sqlite3_column_decltype","string","sqlite3_stmt*","int"],["sqlite3_column_double","f64","sqlite3_stmt*","int"],["sqlite3_column_int","int","sqlite3_stmt*","int"],["sqlite3_column_name","string","sqlite3_stmt*","int"],["sqlite3_column_text","string","sqlite3_stmt*","int"],["sqlite3_column_type","int","sqlite3_stmt*","int"],["sqlite3_column_value","sqlite3_value*","sqlite3_stmt*","int"],["sqlite3_commit_hook","void*",["sqlite3*",new s.xWrap.FuncPtrAdapter({name:"sqlite3_commit_hook",signature:"i(p)",contextKey:q=>q[0]}),"*"]],["sqlite3_compileoption_get","string","int"],["sqlite3_compileoption_used","int","string"],["sqlite3_complete","int","string:flexible"],["sqlite3_context_db_handle","sqlite3*","sqlite3_context*"],["sqlite3_data_count","int","sqlite3_stmt*"],["sqlite3_db_filename","string","sqlite3*","string"],["sqlite3_db_handle","sqlite3*","sqlite3_stmt*"],["sqlite3_db_name","string","sqlite3*","int"],["sqlite3_db_readonly","int","sqlite3*","string"],["sqlite3_db_status","int","sqlite3*","int","*","*","int"],["sqlite3_errcode","int","sqlite3*"],["sqlite3_errmsg","string","sqlite3*"],["sqlite3_error_offset","int","sqlite3*"],["sqlite3_errstr","string","int"],["sqlite3_exec","int",["sqlite3*","string:flexible",new s.xWrap.FuncPtrAdapter({signature:"i(pipp)",bindScope:"transient",callProxy:q=>{let w;return(x,N,O,S)=>{try{const L=s.cArgvToJs(N,O);return w||(w=s.cArgvToJs(N,S)),q(L,w)|0}catch(L){return L.resultCode||r.SQLITE_ERROR}}}}),"*","**"]],["sqlite3_expanded_sql","string","sqlite3_stmt*"],["sqlite3_extended_errcode","int","sqlite3*"],["sqlite3_extended_result_codes","int","sqlite3*","int"],["sqlite3_file_control","int","sqlite3*","string","int","*"],["sqlite3_finalize","int","sqlite3_stmt*"],["sqlite3_free",void 0,"*"],["sqlite3_get_autocommit","int","sqlite3*"],["sqlite3_get_auxdata","*","sqlite3_context*","int"],["sqlite3_initialize",void 0],["sqlite3_interrupt",void 0,"sqlite3*"],["sqlite3_is_interrupted","int","sqlite3*"],["sqlite3_keyword_count","int"],["sqlite3_keyword_name","int",["int","**","*"]],["sqlite3_keyword_check","int",["string","int"]],["sqlite3_libversion","string"],["sqlite3_libversion_number","int"],["sqlite3_limit","int",["sqlite3*","int","int"]],["sqlite3_malloc","*","int"],["sqlite3_open","int","string","*"],["sqlite3_open_v2","int","string","*","int","string"],["sqlite3_realloc","*","*","int"],["sqlite3_reset","int","sqlite3_stmt*"],["sqlite3_result_blob",void 0,"sqlite3_context*","*","int","*"],["sqlite3_result_double",void 0,"sqlite3_context*","f64"],["sqlite3_result_error",void 0,"sqlite3_context*","string","int"],["sqlite3_result_error_code",void 0,"sqlite3_context*","int"],["sqlite3_result_error_nomem",void 0,"sqlite3_context*"],["sqlite3_result_error_toobig",void 0,"sqlite3_context*"],["sqlite3_result_int",void 0,"sqlite3_context*","int"],["sqlite3_result_null",void 0,"sqlite3_context*"],["sqlite3_result_pointer",void 0,"sqlite3_context*","*","string:static","*"],["sqlite3_result_subtype",void 0,"sqlite3_value*","int"],["sqlite3_result_text",void 0,"sqlite3_context*","string","int","*"],["sqlite3_result_zeroblob",void 0,"sqlite3_context*","int"],["sqlite3_rollback_hook","void*",["sqlite3*",new s.xWrap.FuncPtrAdapter({name:"sqlite3_rollback_hook",signature:"v(p)",contextKey:q=>q[0]}),"*"]],["sqlite3_set_auxdata",void 0,["sqlite3_context*","int","*","*"]],["sqlite3_shutdown",void 0],["sqlite3_sourceid","string"],["sqlite3_sql","string","sqlite3_stmt*"],["sqlite3_status","int","int","*","*","int"],["sqlite3_step","int","sqlite3_stmt*"],["sqlite3_stmt_busy","int","sqlite3_stmt*"],["sqlite3_stmt_readonly","int","sqlite3_stmt*"],["sqlite3_stmt_status","int","sqlite3_stmt*","int","int"],["sqlite3_strglob","int","string","string"],["sqlite3_stricmp","int","string","string"],["sqlite3_strlike","int","string","string","int"],["sqlite3_strnicmp","int","string","string","int"],["sqlite3_table_column_metadata","int","sqlite3*","string","string","string","**","**","*","*","*"],["sqlite3_total_changes","int","sqlite3*"],["sqlite3_trace_v2","int",["sqlite3*","int",new s.xWrap.FuncPtrAdapter({name:"sqlite3_trace_v2::callback",signature:"i(ippp)",contextKey:(q,w)=>q[0]}),"*"]],["sqlite3_txn_state","int",["sqlite3*","string"]],["sqlite3_uri_boolean","int","sqlite3_filename","string","int"],["sqlite3_uri_key","string","sqlite3_filename","int"],["sqlite3_uri_parameter","string","sqlite3_filename","string"],["sqlite3_user_data","void*","sqlite3_context*"],["sqlite3_value_blob","*","sqlite3_value*"],["sqlite3_value_bytes","int","sqlite3_value*"],["sqlite3_value_double","f64","sqlite3_value*"],["sqlite3_value_dup","sqlite3_value*","sqlite3_value*"],["sqlite3_value_free",void 0,"sqlite3_value*"],["sqlite3_value_frombind","int","sqlite3_value*"],["sqlite3_value_int","int","sqlite3_value*"],["sqlite3_value_nochange","int","sqlite3_value*"],["sqlite3_value_numeric_type","int","sqlite3_value*"],["sqlite3_value_pointer","*","sqlite3_value*","string:static"],["sqlite3_value_subtype","int","sqlite3_value*"],["sqlite3_value_text","string","sqlite3_value*"],["sqlite3_value_type","int","sqlite3_value*"],["sqlite3_vfs_find","*","string"],["sqlite3_vfs_register","int","sqlite3_vfs*","int"],["sqlite3_vfs_unregister","int","sqlite3_vfs*"]],s.exports.sqlite3_progress_handler&&s.bindingSignatures.push(["sqlite3_progress_handler",void 0,["sqlite3*","int",new s.xWrap.FuncPtrAdapter({name:"xProgressHandler",signature:"i(p)",bindScope:"context",contextKey:(q,w)=>q[0]}),"*"]]),s.exports.sqlite3_stmt_explain&&s.bindingSignatures.push(["sqlite3_stmt_explain","int","sqlite3_stmt*","int"],["sqlite3_stmt_isexplain","int","sqlite3_stmt*"]),s.exports.sqlite3_set_authorizer&&s.bindingSignatures.push(["sqlite3_set_authorizer","int",["sqlite3*",new s.xWrap.FuncPtrAdapter({name:"sqlite3_set_authorizer::xAuth",signature:"i(pissss)",contextKey:(q,w)=>q[0],callProxy:q=>(w,x,N,O,S,L)=>{try{return N=N&&s.cstrToJs(N),O=O&&s.cstrToJs(O),S=S&&s.cstrToJs(S),L=L&&s.cstrToJs(L),q(w,x,N,O,S,L)||0}catch($){return $.resultCode||r.SQLITE_ERROR}}}),"*"]]),s.bindingSignatures.int64=[["sqlite3_bind_int64","int",["sqlite3_stmt*","int","i64"]],["sqlite3_changes64","i64",["sqlite3*"]],["sqlite3_column_int64","i64",["sqlite3_stmt*","int"]],["sqlite3_deserialize","int","sqlite3*","string","*","i64","i64","int"],["sqlite3_last_insert_rowid","i64",["sqlite3*"]],["sqlite3_malloc64","*","i64"],["sqlite3_msize","i64","*"],["sqlite3_overload_function","int",["sqlite3*","string","int"]],["sqlite3_realloc64","*","*","i64"],["sqlite3_result_int64",void 0,"*","i64"],["sqlite3_result_zeroblob64","int","*","i64"],["sqlite3_serialize","*","sqlite3*","string","*","int"],["sqlite3_set_last_insert_rowid",void 0,["sqlite3*","i64"]],["sqlite3_status64","int","int","*","*","int"],["sqlite3_total_changes64","i64",["sqlite3*"]],["sqlite3_update_hook","*",["sqlite3*",new s.xWrap.FuncPtrAdapter({name:"sqlite3_update_hook",signature:"v(iippj)",contextKey:q=>q[0],callProxy:q=>(w,x,N,O,S)=>{q(w,x,s.cstrToJs(N),s.cstrToJs(O),S)}}),"*"]],["sqlite3_uri_int64","i64",["sqlite3_filename","string","i64"]],["sqlite3_value_int64","i64","sqlite3_value*"]],s.bigIntEnabled&&s.exports.sqlite3_declare_vtab&&s.bindingSignatures.int64.push(["sqlite3_create_module","int",["sqlite3*","string","sqlite3_module*","*"]],["sqlite3_create_module_v2","int",["sqlite3*","string","sqlite3_module*","*","*"]],["sqlite3_declare_vtab","int",["sqlite3*","string:flexible"]],["sqlite3_drop_modules","int",["sqlite3*","**"]],["sqlite3_vtab_collation","string","sqlite3_index_info*","int"],["sqlite3_vtab_distinct","int","sqlite3_index_info*"],["sqlite3_vtab_in","int","sqlite3_index_info*","int","int"],["sqlite3_vtab_in_first","int","sqlite3_value*","**"],["sqlite3_vtab_in_next","int","sqlite3_value*","**"],["sqlite3_vtab_nochange","int","sqlite3_context*"],["sqlite3_vtab_on_conflict","int","sqlite3*"],["sqlite3_vtab_rhs_value","int","sqlite3_index_info*","int","**"]),s.bigIntEnabled&&s.exports.sqlite3_preupdate_hook&&s.bindingSignatures.int64.push(["sqlite3_preupdate_blobwrite","int","sqlite3*"],["sqlite3_preupdate_count","int","sqlite3*"],["sqlite3_preupdate_depth","int","sqlite3*"],["sqlite3_preupdate_hook","*",["sqlite3*",new s.xWrap.FuncPtrAdapter({name:"sqlite3_preupdate_hook",signature:"v(ppippjj)",contextKey:q=>q[0],callProxy:q=>(w,x,N,O,S,L,$)=>{q(w,x,N,s.cstrToJs(O),s.cstrToJs(S),L,$)}}),"*"]],["sqlite3_preupdate_new","int",["sqlite3*","int","**"]],["sqlite3_preupdate_old","int",["sqlite3*","int","**"]]),s.bigIntEnabled&&s.exports.sqlite3changegroup_add&&s.exports.sqlite3session_create&&s.exports.sqlite3_preupdate_hook){const q={signature:"i(ps)",callProxy:w=>(x,N)=>{try{return w(x,s.cstrToJs(N))|0}catch(O){return O.resultCode||r.SQLITE_ERROR}}};s.bindingSignatures.int64.push(["sqlite3changegroup_add","int",["sqlite3_changegroup*","int","void*"]],["sqlite3changegroup_add_strm","int",["sqlite3_changegroup*",new s.xWrap.FuncPtrAdapter({name:"xInput",signature:"i(ppp)",bindScope:"transient"}),"void*"]],["sqlite3changegroup_delete",void 0,["sqlite3_changegroup*"]],["sqlite3changegroup_new","int",["**"]],["sqlite3changegroup_output","int",["sqlite3_changegroup*","int*","**"]],["sqlite3changegroup_output_strm","int",["sqlite3_changegroup*",new s.xWrap.FuncPtrAdapter({name:"xOutput",signature:"i(ppi)",bindScope:"transient"}),"void*"]],["sqlite3changeset_apply","int",["sqlite3*","int","void*",new s.xWrap.FuncPtrAdapter({name:"xFilter",bindScope:"transient",...q}),new s.xWrap.FuncPtrAdapter({name:"xConflict",signature:"i(pip)",bindScope:"transient"}),"void*"]],["sqlite3changeset_apply_strm","int",["sqlite3*",new s.xWrap.FuncPtrAdapter({name:"xInput",signature:"i(ppp)",bindScope:"transient"}),"void*",new s.xWrap.FuncPtrAdapter({name:"xFilter",bindScope:"transient",...q}),new s.xWrap.FuncPtrAdapter({name:"xConflict",signature:"i(pip)",bindScope:"transient"}),"void*"]],["sqlite3changeset_apply_v2","int",["sqlite3*","int","void*",new s.xWrap.FuncPtrAdapter({name:"xFilter",bindScope:"transient",...q}),new s.xWrap.FuncPtrAdapter({name:"xConflict",signature:"i(pip)",bindScope:"transient"}),"void*","**","int*","int"]],["sqlite3changeset_apply_v2_strm","int",["sqlite3*",new s.xWrap.FuncPtrAdapter({name:"xInput",signature:"i(ppp)",bindScope:"transient"}),"void*",new s.xWrap.FuncPtrAdapter({name:"xFilter",bindScope:"transient",...q}),new s.xWrap.FuncPtrAdapter({name:"xConflict",signature:"i(pip)",bindScope:"transient"}),"void*","**","int*","int"]],["sqlite3changeset_concat","int",["int","void*","int","void*","int*","**"]],["sqlite3changeset_concat_strm","int",[new s.xWrap.FuncPtrAdapter({name:"xInputA",signature:"i(ppp)",bindScope:"transient"}),"void*",new s.xWrap.FuncPtrAdapter({name:"xInputB",signature:"i(ppp)",bindScope:"transient"}),"void*",new s.xWrap.FuncPtrAdapter({name:"xOutput",signature:"i(ppi)",bindScope:"transient"}),"void*"]],["sqlite3changeset_conflict","int",["sqlite3_changeset_iter*","int","**"]],["sqlite3changeset_finalize","int",["sqlite3_changeset_iter*"]],["sqlite3changeset_fk_conflicts","int",["sqlite3_changeset_iter*","int*"]],["sqlite3changeset_invert","int",["int","void*","int*","**"]],["sqlite3changeset_invert_strm","int",[new s.xWrap.FuncPtrAdapter({name:"xInput",signature:"i(ppp)",bindScope:"transient"}),"void*",new s.xWrap.FuncPtrAdapter({name:"xOutput",signature:"i(ppi)",bindScope:"transient"}),"void*"]],["sqlite3changeset_new","int",["sqlite3_changeset_iter*","int","**"]],["sqlite3changeset_next","int",["sqlite3_changeset_iter*"]],["sqlite3changeset_old","int",["sqlite3_changeset_iter*","int","**"]],["sqlite3changeset_op","int",["sqlite3_changeset_iter*","**","int*","int*","int*"]],["sqlite3changeset_pk","int",["sqlite3_changeset_iter*","**","int*"]],["sqlite3changeset_start","int",["**","int","*"]],["sqlite3changeset_start_strm","int",["**",new s.xWrap.FuncPtrAdapter({name:"xInput",signature:"i(ppp)",bindScope:"transient"}),"void*"]],["sqlite3changeset_start_v2","int",["**","int","*","int"]],["sqlite3changeset_start_v2_strm","int",["**",new s.xWrap.FuncPtrAdapter({name:"xInput",signature:"i(ppp)",bindScope:"transient"}),"void*","int"]],["sqlite3session_attach","int",["sqlite3_session*","string"]],["sqlite3session_changeset","int",["sqlite3_session*","int*","**"]],["sqlite3session_changeset_size","i64",["sqlite3_session*"]],["sqlite3session_changeset_strm","int",["sqlite3_session*",new s.xWrap.FuncPtrAdapter({name:"xOutput",signature:"i(ppp)",bindScope:"transient"}),"void*"]],["sqlite3session_config","int",["int","void*"]],["sqlite3session_create","int",["sqlite3*","string","**"]],["sqlite3session_diff","int",["sqlite3_session*","string","string","**"]],["sqlite3session_enable","int",["sqlite3_session*","int"]],["sqlite3session_indirect","int",["sqlite3_session*","int"]],["sqlite3session_isempty","int",["sqlite3_session*"]],["sqlite3session_memory_used","i64",["sqlite3_session*"]],["sqlite3session_object_config","int",["sqlite3_session*","int","void*"]],["sqlite3session_patchset","int",["sqlite3_session*","*","**"]],["sqlite3session_patchset_strm","int",["sqlite3_session*",new s.xWrap.FuncPtrAdapter({name:"xOutput",signature:"i(ppp)",bindScope:"transient"}),"void*"]],["sqlite3session_table_filter",void 0,["sqlite3_session*",new s.xWrap.FuncPtrAdapter({name:"xFilter",...q,contextKey:(w,x)=>w[0]}),"*"]])}s.bindingSignatures.wasmInternal=[["sqlite3__wasm_db_reset","int","sqlite3*"],["sqlite3__wasm_db_vfs","sqlite3_vfs*","sqlite3*","string"],["sqlite3__wasm_vfs_create_file","int","sqlite3_vfs*","string","*","int"],["sqlite3__wasm_posix_create_file","int","string","*","int"],["sqlite3__wasm_vfs_unlink","int","sqlite3_vfs*","string"],["sqlite3__wasm_qfmt_token","string:dealloc","string","int"]],t.StructBinder=globalThis.Jaccwabyt({heap:s.heap8u,alloc:s.alloc,dealloc:s.dealloc,bigIntEnabled:s.bigIntEnabled,memberPrefix:"$"}),delete globalThis.Jaccwabyt;{const q=s.xWrap.argAdapter("string");s.xWrap.argAdapter("string:flexible",S=>q(o.flexibleString(S))),s.xWrap.argAdapter("string:static",(function(S){return s.isPtr(S)?S:(S=""+S,this[S]||(this[S]=s.allocCString(S)))}).bind(Object.create(null)));const w=s.xWrap.argAdapter("*"),x=function(){};s.xWrap.argAdapter("sqlite3_filename",w)("sqlite3_context*",w)("sqlite3_value*",w)("void*",w)("sqlite3_changegroup*",w)("sqlite3_changeset_iter*",w)("sqlite3_session*",w)("sqlite3_stmt*",S=>w(S instanceof(t?.oo1?.Stmt||x)?S.pointer:S))("sqlite3*",S=>w(S instanceof(t?.oo1?.DB||x)?S.pointer:S))("sqlite3_vfs*",S=>typeof S=="string"?r.sqlite3_vfs_find(S)||t.SQLite3Error.toss(r.SQLITE_NOTFOUND,"Unknown sqlite3_vfs name:",S):w(S instanceof(r.sqlite3_vfs||x)?S.pointer:S)),s.exports.sqlite3_declare_vtab&&s.xWrap.argAdapter("sqlite3_index_info*",S=>w(S instanceof(r.sqlite3_index_info||x)?S.pointer:S))("sqlite3_module*",S=>w(S instanceof(r.sqlite3_module||x)?S.pointer:S));const N=s.xWrap.resultAdapter("*");s.xWrap.resultAdapter("sqlite3*",N)("sqlite3_context*",N)("sqlite3_stmt*",N)("sqlite3_value*",N)("sqlite3_vfs*",N)("void*",N),s.exports.sqlite3_step.length===0&&(s.xWrap.doArgcCheck=!1,t.config.warn("Disabling sqlite3.wasm.xWrap.doArgcCheck due to environmental quirks."));for(const S of s.bindingSignatures)r[S[0]]=s.xWrap.apply(null,S);for(const S of s.bindingSignatures.wasmInternal)o[S[0]]=s.xWrap.apply(null,S);const O=function(S){return()=>n(S+"() is unavailable due to lack","of BigInt support in this build.")};for(const S of s.bindingSignatures.int64)r[S[0]]=s.bigIntEnabled?s.xWrap.apply(null,S):O(S[0]);if(delete s.bindingSignatures,s.exports.sqlite3__wasm_db_error){const S=s.xWrap("sqlite3__wasm_db_error","int","sqlite3*","int","string");o.sqlite3__wasm_db_error=function(L,$,c){return $ instanceof t.WasmAllocError?($=r.SQLITE_NOMEM,c=0):$ instanceof Error&&(c=c||""+$,$=$.resultCode||r.SQLITE_ERROR),L?S(L,$,c):$}}else o.sqlite3__wasm_db_error=function(S,L,$){return console.warn("sqlite3__wasm_db_error() is not exported.",arguments),L}}{const q=s.xCall("sqlite3__wasm_enum_json");q||n("Maintenance required: increase sqlite3__wasm_enum_json()'s","static buffer size!"),s.ctype=JSON.parse(s.cstrToJs(q));const w=["access","authorizer","blobFinalizers","changeset","config","dataTypes","dbConfig","dbStatus","encodings","fcntl","flock","ioCap","limits","openFlags","prepareFlags","resultCodes","sqlite3Status","stmtStatus","syncFlags","trace","txnState","udfFlags","version"];s.bigIntEnabled&&w.push("serialize","session","vtab");for(const O of w)for(const S of Object.entries(s.ctype[O]))r[S[0]]=S[1];s.functionEntry(r.SQLITE_WASM_DEALLOC)||n("Internal error: cannot resolve exported function","entry SQLITE_WASM_DEALLOC (=="+r.SQLITE_WASM_DEALLOC+").");const x=Object.create(null);for(const O of["resultCodes"])for(const S of Object.entries(s.ctype[O]))x[S[1]]=S[0];r.sqlite3_js_rc_str=O=>x[O];const N=Object.assign(Object.create(null),{WasmTestStruct:!0,sqlite3_kvvfs_methods:!o.isUIThread(),sqlite3_index_info:!s.bigIntEnabled,sqlite3_index_constraint:!s.bigIntEnabled,sqlite3_index_orderby:!s.bigIntEnabled,sqlite3_index_constraint_usage:!s.bigIntEnabled});for(const O of s.ctype.structs)N[O.name]||(r[O.name]=t.StructBinder(O));if(r.sqlite3_index_info){for(const O of["sqlite3_index_constraint","sqlite3_index_orderby","sqlite3_index_constraint_usage"])r.sqlite3_index_info[O]=r[O],delete r[O];r.sqlite3_vtab_config=s.xWrap("sqlite3__wasm_vtab_config","int",["sqlite3*","int","int"])}}const p=(q,w,x)=>o.sqlite3__wasm_db_error(q,r.SQLITE_MISUSE,w+"() requires "+x+" argument"+(x===1?"":"s")+"."),g=q=>o.sqlite3__wasm_db_error(q,r.SQLITE_FORMAT,"SQLITE_UTF8 is the only supported encoding."),P=q=>s.xWrap.argAdapter("sqlite3*")(q),R=q=>s.isPtr(q)?s.cstrToJs(q):q,z=(function(q,w){q=P(q);let x=this.dbMap.get(q);if(w)!x&&w>0&&this.dbMap.set(q,x=Object.create(null));else return this.dbMap.delete(q),x;return x}).bind(Object.assign(Object.create(null),{dbMap:new Map}));z.addCollation=function(q,w){const x=z(q,1);x.collation||(x.collation=new Set),x.collation.add(R(w).toLowerCase())},z._addUDF=function(q,w,x,N){w=R(w).toLowerCase();let O=N.get(w);O||N.set(w,O=new Set),O.add(x<0?-1:x)},z.addFunction=function(q,w,x){const N=z(q,1);N.udf||(N.udf=new Map),this._addUDF(q,w,x,N.udf)},s.exports.sqlite3_create_window_function&&(z.addWindowFunc=function(q,w,x){const N=z(q,1);N.wudf||(N.wudf=new Map),this._addUDF(q,w,x,N.wudf)}),z.cleanup=function(q){q=P(q);const w=[q];for(const O of["sqlite3_busy_handler","sqlite3_commit_hook","sqlite3_preupdate_hook","sqlite3_progress_handler","sqlite3_rollback_hook","sqlite3_set_authorizer","sqlite3_trace_v2","sqlite3_update_hook"]){const S=s.exports[O];if(S){w.length=S.length;try{r[O](...w)}catch(L){t.config.warn("close-time call of",O+"(",w,") threw:",L)}}}const x=z(q,0);if(!x)return;if(x.collation){for(const O of x.collation)try{r.sqlite3_create_collation_v2(q,O,r.SQLITE_UTF8,0,0,0)}catch{}delete x.collation}let N;for(N=0;N<2;++N){const O=N?x.wudf:x.udf;if(!O)continue;const S=N?r.sqlite3_create_window_function:r.sqlite3_create_function_v2;for(const L of O){const $=L[0],c=L[1],d=[q,$,0,r.SQLITE_UTF8,0,0,0,0,0];N&&d.push(0);for(const y of c)try{d[2]=y,S.apply(null,d)}catch{}c.clear()}O.clear()}delete x.udf,delete x.wudf};{const q=s.xWrap("sqlite3_close_v2","int","sqlite3*");r.sqlite3_close_v2=function(w){if(arguments.length!==1)return p(w,"sqlite3_close_v2",1);if(w)try{z.cleanup(w)}catch{}return q(w)}}if(r.sqlite3session_create){const q=s.xWrap("sqlite3session_delete",void 0,["sqlite3_session*"]);r.sqlite3session_delete=function(w){if(arguments.length!==1)return p(pDb,"sqlite3session_delete",1);w&&r.sqlite3session_table_filter(w,0,0),q(w)}}{const q=(x,N)=>"argv["+N+"]:"+x[0]+":"+s.cstrToJs(x[1]).toLowerCase(),w=s.xWrap("sqlite3_create_collation_v2","int",["sqlite3*","string","int","*",new s.xWrap.FuncPtrAdapter({name:"xCompare",signature:"i(pipip)",contextKey:q}),new s.xWrap.FuncPtrAdapter({name:"xDestroy",signature:"v(p)",contextKey:q})]);r.sqlite3_create_collation_v2=function(x,N,O,S,L,$){if(arguments.length!==6)return p(x,"sqlite3_create_collation_v2",6);if((O&15)===0)O|=r.SQLITE_UTF8;else if(r.SQLITE_UTF8!==(O&15))return g(x);try{const c=w(x,N,O,S,L,$);return c===0&&L instanceof Function&&z.addCollation(x,N),c}catch(c){return o.sqlite3__wasm_db_error(x,c)}},r.sqlite3_create_collation=(x,N,O,S,L)=>arguments.length===5?r.sqlite3_create_collation_v2(x,N,O,S,L,0):p(x,"sqlite3_create_collation",5)}{const q=function(O,S){return O[0]+":"+(O[2]<0?-1:O[2])+":"+S+":"+s.cstrToJs(O[1]).toLowerCase()},w=Object.assign(Object.create(null),{xInverseAndStep:{signature:"v(pip)",contextKey:q,callProxy:O=>(S,L,$)=>{try{O(S,...r.sqlite3_values_to_js(L,$))}catch(c){r.sqlite3_result_error_js(S,c)}}},xFinalAndValue:{signature:"v(p)",contextKey:q,callProxy:O=>S=>{try{r.sqlite3_result_js(S,O(S))}catch(L){r.sqlite3_result_error_js(S,L)}}},xFunc:{signature:"v(pip)",contextKey:q,callProxy:O=>(S,L,$)=>{try{r.sqlite3_result_js(S,O(S,...r.sqlite3_values_to_js(L,$)))}catch(c){r.sqlite3_result_error_js(S,c)}}},xDestroy:{signature:"v(p)",contextKey:q,callProxy:O=>S=>{try{O(S)}catch(L){console.error("UDF xDestroy method threw:",L)}}}}),x=s.xWrap("sqlite3_create_function_v2","int",["sqlite3*","string","int","int","*",new s.xWrap.FuncPtrAdapter({name:"xFunc",...w.xFunc}),new s.xWrap.FuncPtrAdapter({name:"xStep",...w.xInverseAndStep}),new s.xWrap.FuncPtrAdapter({name:"xFinal",...w.xFinalAndValue}),new s.xWrap.FuncPtrAdapter({name:"xDestroy",...w.xDestroy})]),N=s.exports.sqlite3_create_window_function?s.xWrap("sqlite3_create_window_function","int",["sqlite3*","string","int","int","*",new s.xWrap.FuncPtrAdapter({name:"xStep",...w.xInverseAndStep}),new s.xWrap.FuncPtrAdapter({name:"xFinal",...w.xFinalAndValue}),new s.xWrap.FuncPtrAdapter({name:"xValue",...w.xFinalAndValue}),new s.xWrap.FuncPtrAdapter({name:"xInverse",...w.xInverseAndStep}),new s.xWrap.FuncPtrAdapter({name:"xDestroy",...w.xDestroy})]):void 0;r.sqlite3_create_function_v2=function O(S,L,$,c,d,y,B,f,h){if(O.length!==arguments.length)return p(S,"sqlite3_create_function_v2",O.length);if((c&15)===0)c|=r.SQLITE_UTF8;else if(r.SQLITE_UTF8!==(c&15))return g(S);try{const l=x(S,L,$,c,d,y,B,f,h);return l===0&&(y instanceof Function||B instanceof Function||f instanceof Function||h instanceof Function)&&z.addFunction(S,L,$),l}catch(l){return console.error("sqlite3_create_function_v2() setup threw:",l),o.sqlite3__wasm_db_error(S,l,"Creation of UDF threw: "+l)}},r.sqlite3_create_function=function O(S,L,$,c,d,y,B,f){return O.length===arguments.length?r.sqlite3_create_function_v2(S,L,$,c,d,y,B,f,0):p(S,"sqlite3_create_function",O.length)},N?r.sqlite3_create_window_function=function O(S,L,$,c,d,y,B,f,h,l){if(O.length!==arguments.length)return p(S,"sqlite3_create_window_function",O.length);if((c&15)===0)c|=r.SQLITE_UTF8;else if(r.SQLITE_UTF8!==(c&15))return g(S);try{const _=N(S,L,$,c,d,y,B,f,h,l);return _===0&&(y instanceof Function||B instanceof Function||f instanceof Function||h instanceof Function||l instanceof Function)&&z.addWindowFunc(S,L,$),_}catch(_){return console.error("sqlite3_create_window_function() setup threw:",_),o.sqlite3__wasm_db_error(S,_,"Creation of UDF threw: "+_)}}:delete r.sqlite3_create_window_function,r.sqlite3_create_function_v2.udfSetResult=r.sqlite3_create_function.udfSetResult=r.sqlite3_result_js,r.sqlite3_create_window_function&&(r.sqlite3_create_window_function.udfSetResult=r.sqlite3_result_js),r.sqlite3_create_function_v2.udfConvertArgs=r.sqlite3_create_function.udfConvertArgs=r.sqlite3_values_to_js,r.sqlite3_create_window_function&&(r.sqlite3_create_window_function.udfConvertArgs=r.sqlite3_values_to_js),r.sqlite3_create_function_v2.udfSetError=r.sqlite3_create_function.udfSetError=r.sqlite3_result_error_js,r.sqlite3_create_window_function&&(r.sqlite3_create_window_function.udfSetError=r.sqlite3_result_error_js)}{const q=(x,N)=>(typeof x=="string"?N=-1:o.isSQLableTypedArray(x)?(N=x.byteLength,x=o.typedArrayToString(x instanceof ArrayBuffer?new Uint8Array(x):x)):Array.isArray(x)&&(x=x.join(""),N=-1),[x,N]),w={basic:s.xWrap("sqlite3_prepare_v3","int",["sqlite3*","string","int","int","**","**"]),full:s.xWrap("sqlite3_prepare_v3","int",["sqlite3*","*","int","int","**","**"])};r.sqlite3_prepare_v3=function x(N,O,S,L,$,c){if(x.length!==arguments.length)return p(N,"sqlite3_prepare_v3",x.length);const[d,y]=q(O,S);switch(typeof d){case"string":return w.basic(N,d,y,L,$,null);case"number":return w.full(N,d,y,L,$,c);default:return o.sqlite3__wasm_db_error(N,r.SQLITE_MISUSE,"Invalid SQL argument type for sqlite3_prepare_v2/v3().")}},r.sqlite3_prepare_v2=function x(N,O,S,L,$){return x.length===arguments.length?r.sqlite3_prepare_v3(N,O,S,0,L,$):p(N,"sqlite3_prepare_v2",x.length)}}{const q=s.xWrap("sqlite3_bind_text","int",["sqlite3_stmt*","int","string","int","*"]),w=s.xWrap("sqlite3_bind_blob","int",["sqlite3_stmt*","int","*","int","*"]);r.sqlite3_bind_text=function x(N,O,S,L,$){if(x.length!==arguments.length)return p(r.sqlite3_db_handle(N),"sqlite3_bind_text",x.length);if(s.isPtr(S)||S===null)return q(N,O,S,L,$);S instanceof ArrayBuffer?S=new Uint8Array(S):Array.isArray(pMem)&&(S=pMem.join(""));let c,d;try{if(o.isSQLableTypedArray(S))c=s.allocFromTypedArray(S),d=S.byteLength;else if(typeof S=="string")[c,d]=s.allocCString(S);else return o.sqlite3__wasm_db_error(r.sqlite3_db_handle(N),r.SQLITE_MISUSE,"Invalid 3rd argument type for sqlite3_bind_text().");return q(N,O,c,d,r.SQLITE_WASM_DEALLOC)}catch(y){return s.dealloc(c),o.sqlite3__wasm_db_error(r.sqlite3_db_handle(N),y)}},r.sqlite3_bind_blob=function x(N,O,S,L,$){if(x.length!==arguments.length)return p(r.sqlite3_db_handle(N),"sqlite3_bind_blob",x.length);if(s.isPtr(S)||S===null)return w(N,O,S,L,$);S instanceof ArrayBuffer?S=new Uint8Array(S):Array.isArray(S)&&(S=S.join(""));let c,d;try{if(o.isBindableTypedArray(S))c=s.allocFromTypedArray(S),d=L>=0?L:S.byteLength;else if(typeof S=="string")[c,d]=s.allocCString(S);else return o.sqlite3__wasm_db_error(r.sqlite3_db_handle(N),r.SQLITE_MISUSE,"Invalid 3rd argument type for sqlite3_bind_blob().");return w(N,O,c,d,r.SQLITE_WASM_DEALLOC)}catch(y){return s.dealloc(c),o.sqlite3__wasm_db_error(r.sqlite3_db_handle(N),y)}}}r.sqlite3_config=function(q,...w){if(arguments.length<2)return r.SQLITE_MISUSE;switch(q){case r.SQLITE_CONFIG_COVERING_INDEX_SCAN:case r.SQLITE_CONFIG_MEMSTATUS:case r.SQLITE_CONFIG_SMALL_MALLOC:case r.SQLITE_CONFIG_SORTERREF_SIZE:case r.SQLITE_CONFIG_STMTJRNL_SPILL:case r.SQLITE_CONFIG_URI:return s.exports.sqlite3__wasm_config_i(q,w[0]);case r.SQLITE_CONFIG_LOOKASIDE:return s.exports.sqlite3__wasm_config_ii(q,w[0],w[1]);case r.SQLITE_CONFIG_MEMDB_MAXSIZE:return s.exports.sqlite3__wasm_config_j(q,w[0]);case r.SQLITE_CONFIG_GETMALLOC:case r.SQLITE_CONFIG_GETMUTEX:case r.SQLITE_CONFIG_GETPCACHE2:case r.SQLITE_CONFIG_GETPCACHE:case r.SQLITE_CONFIG_HEAP:case r.SQLITE_CONFIG_LOG:case r.SQLITE_CONFIG_MALLOC:case r.SQLITE_CONFIG_MMAP_SIZE:case r.SQLITE_CONFIG_MULTITHREAD:case r.SQLITE_CONFIG_MUTEX:case r.SQLITE_CONFIG_PAGECACHE:case r.SQLITE_CONFIG_PCACHE2:case r.SQLITE_CONFIG_PCACHE:case r.SQLITE_CONFIG_PCACHE_HDRSZ:case r.SQLITE_CONFIG_PMASZ:case r.SQLITE_CONFIG_SERIALIZED:case r.SQLITE_CONFIG_SINGLETHREAD:case r.SQLITE_CONFIG_SQLLOG:case r.SQLITE_CONFIG_WIN32_HEAPSIZE:default:return r.SQLITE_NOTFOUND}};{const q=new Set;r.sqlite3_auto_extension=function(w){if(w instanceof Function)w=s.installFunction("i(ppp)",w);else if(arguments.length!==1||!s.isPtr(w))return r.SQLITE_MISUSE;const x=s.exports.sqlite3_auto_extension(w);return w!==arguments[0]&&(x===0?q.add(w):s.uninstallFunction(w)),x},r.sqlite3_cancel_auto_extension=function(w){return!w||arguments.length!==1||!s.isPtr(w)?0:s.exports.sqlite3_cancel_auto_extension(w)},r.sqlite3_reset_auto_extension=function(){s.exports.sqlite3_reset_auto_extension();for(const w of q)s.uninstallFunction(w);q.clear()}}const Q=r.sqlite3_vfs_find("kvvfs");if(Q)if(o.isUIThread()){const q=new r.sqlite3_kvvfs_methods(s.exports.sqlite3__wasm_kvvfs_methods());delete r.sqlite3_kvvfs_methods;const w=s.exports.sqlite3__wasm_kvvfsMakeKeyOnPstack,x=s.pstack,N=S=>s.peek(S)===115?sessionStorage:localStorage,O={xRead:(S,L,$,c)=>{const d=x.pointer,y=s.scopedAllocPush();try{const B=w(S,L);if(!B)return-3;const f=s.cstrToJs(B),h=N(S).getItem(f);if(!h)return-1;const l=h.length;if(c<=0)return l;if(c===1)return s.poke($,0),l;const _=s.scopedAllocCString(h);return c>l+1&&(c=l+1),s.heap8u().copyWithin($,_,_+c-1),s.poke($+c-1,0),c-1}catch(B){return console.error("kvstorageRead()",B),-2}finally{x.restore(d),s.scopedAllocPop(y)}},xWrite:(S,L,$)=>{const c=x.pointer;try{const d=w(S,L);if(!d)return 1;const y=s.cstrToJs(d);return N(S).setItem(y,s.cstrToJs($)),0}catch(d){return console.error("kvstorageWrite()",d),r.SQLITE_IOERR}finally{x.restore(c)}},xDelete:(S,L)=>{const $=x.pointer;try{const c=w(S,L);return c?(N(S).removeItem(s.cstrToJs(c)),0):1}catch(c){return console.error("kvstorageDelete()",c),r.SQLITE_IOERR}finally{x.restore($)}}};for(const S of Object.keys(O))q[q.memberKey(S)]=s.installFunction(q.memberSignature(S),O[S])}else r.sqlite3_vfs_unregister(Q);s.xWrap.FuncPtrAdapter.warnOnUse=!0;const T=t.StructBinder,A=function q(w,x,N,O=q.installMethodArgcCheck){if(w instanceof T.StructType?!(N instanceof Function)&&!s.isPtr(N)&&n("Usage error: expecting a Function or WASM pointer to one."):n("Usage error: target object is-not-a StructType."),arguments.length===1)return(c,d)=>q(w,c,d,O);q.argcProxy||(q.argcProxy=function(c,d,y,B){return function(...f){return y.length!==arguments.length&&n("Argument mismatch for",c.structInfo.name+"::"+d+": Native signature is:",B),y.apply(this,f)}},q.removeFuncList=function(){this.ondispose.__removeFuncList&&(this.ondispose.__removeFuncList.forEach((c,d)=>{if(typeof c=="number")try{s.uninstallFunction(c)}catch{}}),delete this.ondispose.__removeFuncList)});const S=w.memberSignature(x);S.length<2&&n("Member",x,"does not have a function pointer signature:",S);const L=w.memberKey(x),$=O&&!s.isPtr(N)?q.argcProxy(w,L,N,S):N;if(s.isPtr($))$&&!s.functionEntry($)&&n("Pointer",$,"is not a WASM function table entry."),w[L]=$;else{const c=s.installFunction($,w.memberSignature(x,!0));w[L]=c,(!w.ondispose||!w.ondispose.__removeFuncList)&&(w.addOnDispose("ondispose.__removeFuncList handler",q.removeFuncList),w.ondispose.__removeFuncList=[]),w.ondispose.__removeFuncList.push(L,c)}return(c,d)=>q(w,c,d,O)};A.installMethodArgcCheck=!1;const D=function(q,w,x=A.installMethodArgcCheck){const N=new Map;for(const O of Object.keys(w)){const S=w[O],L=N.get(S);if(L){const $=q.memberKey(O);q[$]=q[q.memberKey(L)]}else A(q,O,S,x),N.set(S,O)}return q};T.StructType.prototype.installMethod=function(w,x,N=A.installMethodArgcCheck){return arguments.length<3&&w&&typeof w=="object"?D(this,...arguments):A(this,...arguments)},T.StructType.prototype.installMethods=function(q,w=A.installMethodArgcCheck){return D(this,q,w)}}),globalThis.sqlite3ApiBootstrap.initializers.push(function(t){t.version={libVersion:"3.50.4",libVersionNumber:3050004,sourceId:"2025-07-30 19:33:53 4d8adfb30e03f9cf27f800a2c1ba3c48fb4ca1b08b0f5ed59a4d5ecbf45e20a3",downloadVersion:3500400}}),globalThis.sqlite3ApiBootstrap.initializers.push(function(t){const n=(...f)=>{throw new t.SQLite3Error(...f)},r=t.capi,s=t.wasm,o=t.util,p=new WeakMap,g=new WeakMap,P=(f,h,l)=>{const _=Object.getOwnPropertyDescriptor(f,h);return _?_.value:l},R=function(f,h){return h&&(f instanceof A&&(f=f.pointer),n(h,"sqlite3 result code",h+":",f?r.sqlite3_errmsg(f):r.sqlite3_errstr(h))),arguments[0]},z=s.installFunction("i(ippp)",(function(f,h,l,_){r.SQLITE_TRACE_STMT===f&&console.log("SQL TRACE #"+ ++this.counter+" via sqlite3@"+h+":",s.cstrToJs(_))}).bind({counter:0})),Q=Object.create(null),T=function f(...h){if(!f._name2vfs){f._name2vfs=Object.create(null);const j=typeof importScripts=="function"?b=>n("The VFS for",b,"is only available in the main window thread."):!1;f._name2vfs[":localStorage:"]={vfs:"kvvfs",filename:j||(()=>"local")},f._name2vfs[":sessionStorage:"]={vfs:"kvvfs",filename:j||(()=>"session")}}const l=f.normalizeArgs(...h);let _=l.filename,u=l.vfs,I=l.flags;(typeof _!="string"&&typeof _!="number"||typeof I!="string"||u&&typeof u!="string"&&typeof u!="number")&&(t.config.error("Invalid DB ctor args",l,arguments),n("Invalid arguments for DB constructor."));let U=typeof _=="number"?s.cstrToJs(_):_;const ee=f._name2vfs[U];ee&&(u=ee.vfs,_=U=ee.filename(U));let ne,se=0;I.indexOf("c")>=0&&(se|=r.SQLITE_OPEN_CREATE|r.SQLITE_OPEN_READWRITE),I.indexOf("w")>=0&&(se|=r.SQLITE_OPEN_READWRITE),se===0&&(se|=r.SQLITE_OPEN_READONLY),se|=r.SQLITE_OPEN_EXRESCODE;const ie=s.pstack.pointer;try{const j=s.pstack.allocPtr();let b=r.sqlite3_open_v2(_,j,se,u||0);ne=s.peekPtr(j),R(ne,b),r.sqlite3_extended_result_codes(ne,1),I.indexOf("t")>=0&&r.sqlite3_trace_v2(ne,r.SQLITE_TRACE_STMT,z,ne)}catch(j){throw ne&&r.sqlite3_close_v2(ne),j}finally{s.pstack.restore(ie)}this.filename=U,p.set(this,ne),g.set(this,Object.create(null));try{const j=r.sqlite3_js_db_vfs(ne)||n("Internal error: cannot get VFS for new db handle."),b=Q[j];b&&(b instanceof Function?b(this,t):R(ne,r.sqlite3_exec(ne,b,0,0,0)))}catch(j){throw this.close(),j}};T.setVfsPostOpenCallback=function(f,h){h instanceof Function||n("dbCtorHelper.setVfsPostOpenCallback() should not be used with a non-function argument.",arguments),Q[f]=h},T.normalizeArgs=function(f=":memory:",h="c",l=null){const _={};return arguments.length===1&&arguments[0]&&typeof arguments[0]=="object"?(Object.assign(_,arguments[0]),_.flags===void 0&&(_.flags="c"),_.vfs===void 0&&(_.vfs=null),_.filename===void 0&&(_.filename=":memory:")):(_.filename=f,_.flags=h,_.vfs=l),_};const A=function(...f){T.apply(this,f)};A.dbCtorHelper=T;const D={null:1,number:2,string:3,boolean:4,blob:5};D.undefined==D.null,s.bigIntEnabled&&(D.bigint=D.number);const q=function(){D!==arguments[2]&&n(r.SQLITE_MISUSE,"Do not call the Stmt constructor directly. Use DB.prepare()."),this.db=arguments[0],p.set(this,arguments[1]),this.parameterCount=r.sqlite3_bind_parameter_count(this.pointer)},w=function(f){return f.pointer||n("DB has been closed."),f},x=function(f,h){return(h!==(h|0)||h<0||h>=f.columnCount)&&n("Column index",h,"is out of range."),f},N=function(f,h){const l=Object.create(null);switch(l.opt=Object.create(null),h.length){case 1:typeof h[0]=="string"||o.isSQLableTypedArray(h[0])||Array.isArray(h[0])?l.sql=h[0]:h[0]&&typeof h[0]=="object"&&(l.opt=h[0],l.sql=l.opt.sql);break;case 2:l.sql=h[0],l.opt=h[1];break;default:n("Invalid argument count for exec().")}l.sql=o.flexibleString(l.sql),typeof l.sql!="string"&&n("Missing SQL argument or unsupported SQL value type.");const _=l.opt;switch(_.returnValue){case"resultRows":_.resultRows||(_.resultRows=[]),l.returnVal=()=>_.resultRows;break;case"saveSql":_.saveSql||(_.saveSql=[]),l.returnVal=()=>_.saveSql;break;case void 0:case"this":l.returnVal=()=>f;break;default:n("Invalid returnValue value:",_.returnValue)}if(!_.callback&&!_.returnValue&&_.rowMode!==void 0&&(_.resultRows||(_.resultRows=[]),l.returnVal=()=>_.resultRows),_.callback||_.resultRows)switch(_.rowMode===void 0?"array":_.rowMode){case"object":l.cbArg=(u,I)=>{I.columnNames||(I.columnNames=u.getColumnNames([]));const U=u.get([]),ee=Object.create(null);for(const ne in I.columnNames)ee[I.columnNames[ne]]=U[ne];return ee};break;case"array":l.cbArg=u=>u.get([]);break;case"stmt":Array.isArray(_.resultRows)&&n("exec(): invalid rowMode for a resultRows array: must","be one of 'array', 'object',","a result column number, or column name reference."),l.cbArg=u=>u;break;default:if(o.isInt32(_.rowMode)){l.cbArg=u=>u.get(_.rowMode);break}else if(typeof _.rowMode=="string"&&_.rowMode.length>1&&_.rowMode[0]==="$"){const u=_.rowMode.substr(1);l.cbArg=I=>{const U=I.get(Object.create(null))[u];return U===void 0?n(r.SQLITE_NOTFOUND,"exec(): unknown result column:",u):U};break}n("Invalid rowMode:",_.rowMode)}return l},O=(f,h,l,..._)=>{const u=f.prepare(h);try{const I=u.bind(l).step()?u.get(..._):void 0;return u.reset(),I}finally{u.finalize()}},S=(f,h,l,_)=>f.exec({sql:h,bind:l,rowMode:_,returnValue:"resultRows"});A.checkRc=(f,h)=>R(f,h),A.prototype={isOpen:function(){return!!this.pointer},affirmOpen:function(){return w(this)},close:function(){if(this.pointer){if(this.onclose&&this.onclose.before instanceof Function)try{this.onclose.before(this)}catch{}const f=this.pointer;if(Object.keys(g.get(this)).forEach((h,l)=>{if(l&&l.pointer)try{l.finalize()}catch{}}),p.delete(this),g.delete(this),r.sqlite3_close_v2(f),this.onclose&&this.onclose.after instanceof Function)try{this.onclose.after(this)}catch{}delete this.filename}},changes:function(f=!1,h=!1){const l=w(this).pointer;return f?h?r.sqlite3_total_changes64(l):r.sqlite3_total_changes(l):h?r.sqlite3_changes64(l):r.sqlite3_changes(l)},dbFilename:function(f="main"){return r.sqlite3_db_filename(w(this).pointer,f)},dbName:function(f=0){return r.sqlite3_db_name(w(this).pointer,f)},dbVfsName:function(f=0){let h;const l=r.sqlite3_js_db_vfs(w(this).pointer,f);if(l){const _=new r.sqlite3_vfs(l);try{h=s.cstrToJs(_.$zName)}finally{_.dispose()}}return h},prepare:function(f){w(this);const h=s.pstack.pointer;let l,_;try{l=s.pstack.alloc(8),A.checkRc(this,r.sqlite3_prepare_v2(this.pointer,f,-1,l,null)),_=s.peekPtr(l)}finally{s.pstack.restore(h)}_||n("Cannot prepare empty SQL.");const u=new q(this,_,D);return g.get(this)[_]=u,u},exec:function(){w(this);const f=N(this,arguments);if(!f.sql)return n("exec() requires an SQL string.");const h=f.opt,l=h.callback,_=Array.isArray(h.resultRows)?h.resultRows:void 0;let u,I=h.bind,U=!!(f.cbArg||h.columnNames||_);const ee=s.scopedAllocPush(),ne=Array.isArray(h.saveSql)?h.saveSql:void 0;try{const se=o.isSQLableTypedArray(f.sql);let ie=se?f.sql.byteLength:s.jstrlen(f.sql);const j=s.scopedAlloc(2*s.ptrSizeof+(ie+1)),b=j+s.ptrSizeof;let k=b+s.ptrSizeof;const W=k+ie;for(se?s.heap8().set(f.sql,k):s.jstrcpy(f.sql,s.heap8(),k,ie,!1),s.poke(k+ie,0);k&&s.peek(k,"i8");){s.pokePtr([j,b],0),A.checkRc(this,r.sqlite3_prepare_v3(this.pointer,k,ie,0,j,b));const H=s.peekPtr(j);if(k=s.peekPtr(b),ie=W-k,!!H){if(ne&&ne.push(r.sqlite3_sql(H).trim()),u=new q(this,H,D),I&&u.parameterCount&&(u.bind(I),I=null),U&&u.columnCount){let Z=Array.isArray(h.columnNames)?0:1;if(U=!1,f.cbArg||_){const E=Object.create(null);for(;u.step();u._lockedByExec=!1){Z++===0&&u.getColumnNames(E.columnNames=h.columnNames||[]),u._lockedByExec=!0;const C=f.cbArg(u,E);if(_&&_.push(C),l&&l.call(h,C,u)===!1)break}u._lockedByExec=!1}Z===0&&u.getColumnNames(h.columnNames)}else u.step();u.reset().finalize(),u=null}}}finally{s.scopedAllocPop(ee),u&&(delete u._lockedByExec,u.finalize())}return f.returnVal()},createFunction:function(h,l,_){const u=E=>E instanceof Function;switch(arguments.length){case 1:_=h,h=_.name,l=_.xFunc||0;break;case 2:u(l)||(_=l,l=_.xFunc||0);break}_||(_={}),typeof h!="string"&&n("Invalid arguments: missing function name.");let I=_.xStep||0,U=_.xFinal||0;const ee=_.xValue||0,ne=_.xInverse||0;let se;u(l)?(se=!1,(u(I)||u(U))&&n("Ambiguous arguments: scalar or aggregate?"),I=U=null):u(I)?(u(U)||n("Missing xFinal() callback for aggregate or window UDF."),l=null):u(U)?n("Missing xStep() callback for aggregate or window UDF."):n("Missing function-type properties."),se===!1?(u(ee)||u(ne))&&n("xValue and xInverse are not permitted for non-window UDFs."):u(ee)?(u(ne)||n("xInverse must be provided if xValue is."),se=!0):u(ne)&&n("xValue must be provided if xInverse is.");const ie=_.pApp;ie!=null&&(typeof ie!="number"||!o.isInt32(ie))&&n("Invalid value for pApp property. Must be a legal WASM pointer value.");const j=_.xDestroy||0;j&&!u(j)&&n("xDestroy property must be a function.");let b=0;P(_,"deterministic")&&(b|=r.SQLITE_DETERMINISTIC),P(_,"directOnly")&&(b|=r.SQLITE_DIRECTONLY),P(_,"innocuous")&&(b|=r.SQLITE_INNOCUOUS),h=h.toLowerCase();const k=l||I,W=P(_,"arity"),H=typeof W=="number"?W:k.length?k.length-1:0;let Z;return se?Z=r.sqlite3_create_window_function(this.pointer,h,H,r.SQLITE_UTF8|b,ie||0,I,U,ee,ne,j):Z=r.sqlite3_create_function_v2(this.pointer,h,H,r.SQLITE_UTF8|b,ie||0,l,I,U,j),A.checkRc(this,Z),this},selectValue:function(f,h,l){return O(this,f,h,0,l)},selectValues:function(f,h,l){const _=this.prepare(f),u=[];try{for(_.bind(h);_.step();)u.push(_.get(0,l));_.reset()}finally{_.finalize()}return u},selectArray:function(f,h){return O(this,f,h,[])},selectObject:function(f,h){return O(this,f,h,{})},selectArrays:function(f,h){return S(this,f,h,"array")},selectObjects:function(f,h){return S(this,f,h,"object")},openStatementCount:function(){return this.pointer?Object.keys(g.get(this)).length:0},transaction:function(f){let h="BEGIN";arguments.length>1&&(/[^a-zA-Z]/.test(arguments[0])&&n(r.SQLITE_MISUSE,"Invalid argument for BEGIN qualifier."),h+=" "+arguments[0],f=arguments[1]),w(this).exec(h);try{const l=f(this);return this.exec("COMMIT"),l}catch(l){throw this.exec("ROLLBACK"),l}},savepoint:function(f){w(this).exec("SAVEPOINT oo1");try{const h=f(this);return this.exec("RELEASE oo1"),h}catch(h){throw this.exec("ROLLBACK to SAVEPOINT oo1; RELEASE SAVEPOINT oo1"),h}},checkRc:function(f){return R(this,f)}};const L=function(f){return f.pointer||n("Stmt has been closed."),f},$=function(f){let h=D[f==null?"null":typeof f];switch(h){case D.boolean:case D.null:case D.number:case D.string:return h;case D.bigint:if(s.bigIntEnabled)return h;default:return o.isBindableTypedArray(f)?D.blob:void 0}},c=function(f){return $(f)||n("Unsupported bind() argument type:",typeof f)},d=function(f,h){const l=typeof h=="number"?h:r.sqlite3_bind_parameter_index(f.pointer,h);return l===0||!o.isInt32(l)?n("Invalid bind() parameter name: "+h):(l<1||l>f.parameterCount)&&n("Bind index",h,"is out of range."),l},y=function(f,h){return f._lockedByExec&&n("Operation is illegal when statement is locked:",h),f},B=function f(h,l,_,u){y(L(h),"bind()"),f._||(f._tooBigInt=U=>n("BigInt value is too big to store without precision loss:",U),f._={string:function(U,ee,ne,se){const[ie,j]=s.allocCString(ne,!0);return(se?r.sqlite3_bind_blob:r.sqlite3_bind_text)(U.pointer,ee,ie,j,r.SQLITE_WASM_DEALLOC)}}),c(u),l=d(h,l);let I=0;switch(u==null?D.null:_){case D.null:I=r.sqlite3_bind_null(h.pointer,l);break;case D.string:I=f._.string(h,l,u,!1);break;case D.number:{let U;o.isInt32(u)?U=r.sqlite3_bind_int:typeof u=="bigint"?o.bigIntFits64(u)?s.bigIntEnabled?U=r.sqlite3_bind_int64:o.bigIntFitsDouble(u)?(u=Number(u),U=r.sqlite3_bind_double):f._tooBigInt(u):f._tooBigInt(u):(u=Number(u),s.bigIntEnabled&&Number.isInteger(u)?U=r.sqlite3_bind_int64:U=r.sqlite3_bind_double),I=U(h.pointer,l,u);break}case D.boolean:I=r.sqlite3_bind_int(h.pointer,l,u?1:0);break;case D.blob:{if(typeof u=="string"){I=f._.string(h,l,u,!0);break}else u instanceof ArrayBuffer?u=new Uint8Array(u):o.isBindableTypedArray(u)||n("Binding a value as a blob requires","that it be a string, Uint8Array, Int8Array, or ArrayBuffer.");const U=s.alloc(u.byteLength||1);s.heap8().set(u.byteLength?u:[0],U),I=r.sqlite3_bind_blob(h.pointer,l,U,u.byteLength,r.SQLITE_WASM_DEALLOC);break}default:t.config.warn("Unsupported bind() argument type:",u),n("Unsupported bind() argument type: "+typeof u)}return I&&A.checkRc(h.db.pointer,I),h._mayGet=!1,h};q.prototype={finalize:function(){if(this.pointer){y(this,"finalize()");const f=r.sqlite3_finalize(this.pointer);return delete g.get(this.db)[this.pointer],p.delete(this),delete this._mayGet,delete this.parameterCount,delete this._lockedByExec,delete this.db,f}},clearBindings:function(){return y(L(this),"clearBindings()"),r.sqlite3_clear_bindings(this.pointer),this._mayGet=!1,this},reset:function(f){y(this,"reset()"),f&&this.clearBindings();const h=r.sqlite3_reset(L(this).pointer);return this._mayGet=!1,R(this.db,h),this},bind:function(){L(this);let f,h;switch(arguments.length){case 1:f=1,h=arguments[0];break;case 2:f=arguments[0],h=arguments[1];break;default:n("Invalid bind() arguments.")}return h===void 0?this:(this.parameterCount||n("This statement has no bindable parameters."),this._mayGet=!1,h===null?B(this,f,D.null,h):Array.isArray(h)?(arguments.length!==1&&n("When binding an array, an index argument is not permitted."),h.forEach((l,_)=>B(this,_+1,c(l),l)),this):(h instanceof ArrayBuffer&&(h=new Uint8Array(h)),typeof h=="object"&&!o.isBindableTypedArray(h)?(arguments.length!==1&&n("When binding an object, an index argument is not permitted."),Object.keys(h).forEach(l=>B(this,l,c(h[l]),h[l])),this):B(this,f,c(h),h)))},bindAsBlob:function(f,h){L(this),arguments.length===1&&(h=f,f=1);const l=c(h);return D.string!==l&&D.blob!==l&&D.null!==l&&n("Invalid value type for bindAsBlob()"),B(this,f,D.blob,h)},step:function(){y(this,"step()");const f=r.sqlite3_step(L(this).pointer);switch(f){case r.SQLITE_DONE:return this._mayGet=!1;case r.SQLITE_ROW:return this._mayGet=!0;default:this._mayGet=!1,t.config.warn("sqlite3_step() rc=",f,r.sqlite3_js_rc_str(f),"SQL =",r.sqlite3_sql(this.pointer)),A.checkRc(this.db.pointer,f)}},stepReset:function(){return this.step(),this.reset()},stepFinalize:function(){try{const f=this.step();return this.reset(),f}finally{try{this.finalize()}catch{}}},get:function(f,h){if(L(this)._mayGet||n("Stmt.step() has not (recently) returned true."),Array.isArray(f)){let l=0;const _=this.columnCount;for(;l<_;)f[l]=this.get(l++);return f}else if(f&&typeof f=="object"){let l=0;const _=this.columnCount;for(;l<_;)f[r.sqlite3_column_name(this.pointer,l)]=this.get(l++);return f}switch(x(this,f),h===void 0?r.sqlite3_column_type(this.pointer,f):h){case r.SQLITE_NULL:return null;case r.SQLITE_INTEGER:if(s.bigIntEnabled){const l=r.sqlite3_column_int64(this.pointer,f);return l>=Number.MIN_SAFE_INTEGER&&l<=Number.MAX_SAFE_INTEGER?Number(l).valueOf():l}else{const l=r.sqlite3_column_double(this.pointer,f);return(l>Number.MAX_SAFE_INTEGER||l<Number.MIN_SAFE_INTEGER)&&n("Integer is out of range for JS integer range: "+l),o.isInt32(l)?l|0:l}case r.SQLITE_FLOAT:return r.sqlite3_column_double(this.pointer,f);case r.SQLITE_TEXT:return r.sqlite3_column_text(this.pointer,f);case r.SQLITE_BLOB:{const l=r.sqlite3_column_bytes(this.pointer,f),_=r.sqlite3_column_blob(this.pointer,f),u=new Uint8Array(l);return l&&u.set(s.heap8u().slice(_,_+l),0),l&&this.db._blobXfer instanceof Array&&this.db._blobXfer.push(u.buffer),u}default:n("Don't know how to translate","type of result column #"+f+".")}n("Not reached.")},getInt:function(f){return this.get(f,r.SQLITE_INTEGER)},getFloat:function(f){return this.get(f,r.SQLITE_FLOAT)},getString:function(f){return this.get(f,r.SQLITE_TEXT)},getBlob:function(f){return this.get(f,r.SQLITE_BLOB)},getJSON:function(f){const h=this.get(f,r.SQLITE_STRING);return h===null?h:JSON.parse(h)},getColumnName:function(f){return r.sqlite3_column_name(x(L(this),f).pointer,f)},getColumnNames:function(f=[]){x(L(this),0);const h=this.columnCount;for(let l=0;l<h;++l)f.push(r.sqlite3_column_name(this.pointer,l));return f},getParamIndex:function(f){return L(this).parameterCount?r.sqlite3_bind_parameter_index(this.pointer,f):void 0},getParamName:function(f){return L(this).parameterCount?r.sqlite3_bind_parameter_name(this.pointer,f):void 0},isBusy:function(){return r.sqlite3_stmt_busy(L(this))!==0},isReadOnly:function(){return r.sqlite3_stmt_readonly(L(this))!==0}};{const f={enumerable:!0,get:function(){return p.get(this)},set:()=>n("The pointer property is read-only.")};Object.defineProperty(q.prototype,"pointer",f),Object.defineProperty(A.prototype,"pointer",f)}if(Object.defineProperty(q.prototype,"columnCount",{enumerable:!1,get:function(){return r.sqlite3_column_count(this.pointer)},set:()=>n("The columnCount property is read-only.")}),t.oo1={DB:A,Stmt:q},o.isUIThread()){t.oo1.JsStorageDb=function(h="session"){const l=T.normalizeArgs(...arguments);h=l.filename,h!=="session"&&h!=="local"&&n("JsStorageDb db name must be one of 'session' or 'local'."),l.vfs="kvvfs",T.call(this,l)};const f=t.oo1.JsStorageDb;f.prototype=Object.create(A.prototype),f.clearStorage=r.sqlite3_js_kvvfs_clear,f.prototype.clearStorage=function(){return f.clearStorage(w(this).filename)},f.storageSize=r.sqlite3_js_kvvfs_size,f.prototype.storageSize=function(){return f.storageSize(w(this).filename)}}}),globalThis.sqlite3ApiBootstrap.initializers.push(function(t){const n=t.util;t.initWorker1API=(function(){const r=(...T)=>{throw new Error(T.join(" "))};globalThis.WorkerGlobalScope instanceof Function||r("initWorker1API() must be run from a Worker thread.");const s=this.sqlite3||r("Missing this.sqlite3 object."),o=s.oo1.DB,p=function(T){let A=g.idMap.get(T);return A||(A="db#"+ ++g.idSeq+"@"+T.pointer,g.idMap.set(T,A),A)},g={dbList:[],idSeq:0,idMap:new WeakMap,xfer:[],open:function(T){const A=new o(T);return this.dbs[p(A)]=A,this.dbList.indexOf(A)<0&&this.dbList.push(A),A},close:function(T,A){if(T){delete this.dbs[p(T)];const D=T.filename,q=n.sqlite3__wasm_db_vfs(T.pointer,0);T.close();const w=this.dbList.indexOf(T);w>=0&&this.dbList.splice(w,1),A&&D&&q&&n.sqlite3__wasm_vfs_unlink(q,D)}},post:function(T,A){A&&A.length?(globalThis.postMessage(T,Array.from(A)),A.length=0):globalThis.postMessage(T)},dbs:Object.create(null),getDb:function(T,A=!0){return this.dbs[T]||(A?r("Unknown (or closed) DB ID:",T):void 0)}},P=function(T=g.dbList[0]){return T&&T.pointer?T:r("DB is not opened.")},R=function(T,A=!0){const D=g.getDb(T.dbId,!1)||g.dbList[0];return A?P(D):D},z=function(){return g.dbList[0]&&p(g.dbList[0])},Q={open:function(T){const A=Object.create(null),D=T.args||Object.create(null);D.simulateError&&r("Throwing because of simulateError flag.");const q=Object.create(null);A.vfs=D.vfs,A.filename=D.filename||"";const w=g.open(A);return q.filename=w.filename,q.persistent=!!s.capi.sqlite3_js_db_uses_vfs(w.pointer,"opfs"),q.dbId=p(w),q.vfs=w.dbVfsName(),q},close:function(T){const A=R(T,!1),D={filename:A&&A.filename};if(A){const q=T.args&&typeof T.args=="object"?!!T.args.unlink:!1;g.close(A,q)}return D},exec:function(T){const A=typeof T.args=="string"?{sql:T.args}:T.args||Object.create(null);A.rowMode==="stmt"?r("Invalid rowMode for 'exec': stmt mode","does not work in the Worker API."):A.sql||r("'exec' requires input SQL.");const D=R(T);(A.callback||Array.isArray(A.resultRows))&&(D._blobXfer=g.xfer);const q=A.callback;let w=0;const x=!!A.columnNames;typeof q=="string"&&(x||(A.columnNames=[]),A.callback=function(N,O){g.post({type:q,columnNames:A.columnNames,rowNumber:++w,row:N},g.xfer)});try{const N=A.countChanges?D.changes(!0,A.countChanges===64):void 0;D.exec(A),N!==void 0&&(A.changeCount=D.changes(!0,A.countChanges===64)-N);const O=A.lastInsertRowId?s.capi.sqlite3_last_insert_rowid(D):void 0;O!==void 0&&(A.lastInsertRowId=O),A.callback instanceof Function&&(A.callback=q,g.post({type:q,columnNames:A.columnNames,rowNumber:null,row:void 0}))}finally{delete D._blobXfer,A.callback&&(A.callback=q)}return A},"config-get":function(){const T=Object.create(null),A=s.config;return["bigIntEnabled"].forEach(function(D){Object.getOwnPropertyDescriptor(A,D)&&(T[D]=A[D])}),T.version=s.version,T.vfsList=s.capi.sqlite3_js_vfs_list(),T},export:function(T){const A=R(T),D={byteArray:s.capi.sqlite3_js_db_export(A.pointer),filename:A.filename,mimetype:"application/x-sqlite3"};return g.xfer.push(D.byteArray.buffer),D},toss:function(T){r("Testing worker exception")}};globalThis.onmessage=async function(T){T=T.data;let A,D=T.dbId,q=T.type;const w=performance.now();try{Q.hasOwnProperty(q)&&Q[q]instanceof Function?A=await Q[q](T):r("Unknown db worker message type:",T.type)}catch(x){q="error",A={operation:T.type,message:x.message,errorClass:x.name,input:T},x.stack&&(A.stack=typeof x.stack=="string"?x.stack.split(/\n\s*/):x.stack)}D||(D=A.dbId||z()),g.post({type:q,dbId:D,messageId:T.messageId,workerReceivedTime:w,workerRespondTime:performance.now(),departureTime:T.departureTime,result:A},g.xfer)},globalThis.postMessage({type:"sqlite3-api",result:"worker1-ready"})}).bind({sqlite3:t})}),globalThis.sqlite3ApiBootstrap.initializers.push(function(t){const n=t.wasm,r=t.capi,s=t.util.toss3,o=Object.create(null);t.vfs=o,r.sqlite3_vfs.prototype.registerVfs=function(p=!1){this instanceof t.capi.sqlite3_vfs||s("Expecting a sqlite3_vfs-type argument.");const g=r.sqlite3_vfs_register(this,p?1:0);return g&&s("sqlite3_vfs_register(",this,") failed with rc",g),this.pointer!==r.sqlite3_vfs_find(this.$zName)&&s("BUG: sqlite3_vfs_find(vfs.$zName) failed for just-installed VFS",this),this},o.installVfs=function(p){let g=0;const P=["io","vfs"];for(const R of P){const z=p[R];z&&(++g,z.struct.installMethods(z.methods,!!z.applyArgcCheck),R==="vfs"&&(!z.struct.$zName&&typeof z.name=="string"&&z.struct.addOnDispose(z.struct.$zName=n.allocCString(z.name)),z.struct.registerVfs(!!z.asDefault)))}return g||s("Misuse: installVfs() options object requires at least","one of:",P),this}}),globalThis.sqlite3ApiBootstrap.initializers.push(function(t){if(!t.wasm.exports.sqlite3_declare_vtab)return;const n=t.wasm,r=t.capi,s=t.util.toss3,o=Object.create(null);t.vtab=o;const p=r.sqlite3_index_info;p.prototype.nthConstraint=function(R,z=!1){if(R<0||R>=this.$nConstraint)return!1;const Q=this.$aConstraint+p.sqlite3_index_constraint.structInfo.sizeof*R;return z?Q:new p.sqlite3_index_constraint(Q)},p.prototype.nthConstraintUsage=function(R,z=!1){if(R<0||R>=this.$nConstraint)return!1;const Q=this.$aConstraintUsage+p.sqlite3_index_constraint_usage.structInfo.sizeof*R;return z?Q:new p.sqlite3_index_constraint_usage(Q)},p.prototype.nthOrderBy=function(R,z=!1){if(R<0||R>=this.$nOrderBy)return!1;const Q=this.$aOrderBy+p.sqlite3_index_orderby.structInfo.sizeof*R;return z?Q:new p.sqlite3_index_orderby(Q)};const g=function(R,z){return(function(Q,T=!1){if(arguments.length===0&&(Q=new z),Q instanceof z)return this.set(Q.pointer,Q),Q;n.isPtr(Q)||t.SQLite3Error.toss("Invalid argument to",R+"()");let A=this.get(Q);return T&&this.delete(Q),A}).bind(new Map)},P=function(R,z){const Q=g(R,z);return Object.assign(Object.create(null),{StructType:z,create:T=>{const A=Q();return n.pokePtr(T,A.pointer),A},get:T=>Q(T),unget:T=>Q(T,!0),dispose:T=>{const A=Q(T,!0);A&&A.dispose()}})};o.xVtab=P("xVtab",r.sqlite3_vtab),o.xCursor=P("xCursor",r.sqlite3_vtab_cursor),o.xIndexInfo=R=>new r.sqlite3_index_info(R),o.xError=function R(z,Q,T){if(R.errorReporter instanceof Function)try{R.errorReporter("sqlite3_module::"+z+"(): "+Q.message)}catch{}let A;return Q instanceof t.WasmAllocError?A=r.SQLITE_NOMEM:arguments.length>2?A=T:Q instanceof t.SQLite3Error&&(A=Q.resultCode),A||r.SQLITE_ERROR},o.xError.errorReporter=console.error.bind(console),o.xRowid=(R,z)=>n.poke(R,z,"i64"),o.setupModule=function(R){let z=!1;const Q=this instanceof r.sqlite3_module?this:R.struct||(z=new r.sqlite3_module);try{const T=R.methods||s("Missing 'methods' object.");for(const A of Object.entries({xConnect:"xCreate",xDisconnect:"xDestroy"})){const D=A[0],q=A[1];T[D]===!0?T[D]=T[q]:T[q]===!0&&(T[q]=T[D])}if(R.catchExceptions){const A=function(w,x){return["xConnect","xCreate"].indexOf(w)>=0?function(N,O,S,L,$,c){try{return x(...arguments)||0}catch(d){return d instanceof t.WasmAllocError||(n.dealloc(n.peekPtr(c)),n.pokePtr(c,n.allocCString(d.message))),o.xError(w,d)}}:function(...N){try{return x(...N)||0}catch(O){return o.xError(w,O)}}},D=["xCreate","xConnect","xBestIndex","xDisconnect","xDestroy","xOpen","xClose","xFilter","xNext","xEof","xColumn","xRowid","xUpdate","xBegin","xSync","xCommit","xRollback","xFindFunction","xRename","xSavepoint","xRelease","xRollbackTo","xShadowName"],q=Object.create(null);for(const w of D){const x=T[w];if(x instanceof Function)w==="xConnect"&&T.xCreate===x?q[w]=T.xCreate:w==="xCreate"&&T.xConnect===x?q[w]=T.xConnect:q[w]=A(w,x);else continue}Q.installMethods(q,!1)}else Q.installMethods(T,!!R.applyArgcCheck);if(Q.$iVersion===0){let A;typeof R.iVersion=="number"?A=R.iVersion:Q.$xShadowName?A=3:Q.$xSavePoint||Q.$xRelease||Q.$xRollbackTo?A=2:A=1,Q.$iVersion=A}}catch(T){throw z&&z.dispose(),T}return Q},r.sqlite3_module.prototype.setupModule=function(R){return o.setupModule.call(this,R)}}),globalThis.sqlite3ApiBootstrap.initializers.push(function(t){const n=function r(s){if(!globalThis.SharedArrayBuffer||!globalThis.Atomics)return Promise.reject(new Error("Cannot install OPFS: Missing SharedArrayBuffer and/or Atomics. The server must emit the COOP/COEP response headers to enable those. See https://sqlite.org/wasm/doc/trunk/persistence.md#coop-coep"));if(typeof WorkerGlobalScope>"u")return Promise.reject(new Error("The OPFS sqlite3_vfs cannot run in the main thread because it requires Atomics.wait()."));if(!globalThis.FileSystemHandle||!globalThis.FileSystemDirectoryHandle||!globalThis.FileSystemFileHandle||!globalThis.FileSystemFileHandle.prototype.createSyncAccessHandle||!navigator?.storage?.getDirectory)return Promise.reject(new Error("Missing required OPFS APIs."));(!s||typeof s!="object")&&(s=Object.create(null));const o=new URL(globalThis.location.href).searchParams;return o.has("opfs-disable")?Promise.resolve(t):(s.verbose===void 0&&(s.verbose=o.has("opfs-verbose")?+o.get("opfs-verbose")||2:1),s.sanityChecks===void 0&&(s.sanityChecks=o.has("opfs-sanity-check")),s.proxyUri===void 0&&(s.proxyUri=r.defaultProxyUri),typeof s.proxyUri=="function"&&(s.proxyUri=s.proxyUri()),new Promise(function(g,P){const R=[t.config.error,t.config.warn,t.config.log],z=(E,...C)=>{s.verbose>E&&R[E]("OPFS syncer:",...C)},Q=(...E)=>z(2,...E),T=(...E)=>z(1,...E),A=(...E)=>z(0,...E),D=t.util.toss,q=t.capi,w=t.util,x=t.wasm,N=q.sqlite3_vfs,O=q.sqlite3_file,S=q.sqlite3_io_methods,L=Object.create(null),$=()=>globalThis.FileSystemHandle&&globalThis.FileSystemDirectoryHandle&&globalThis.FileSystemFileHandle&&globalThis.FileSystemFileHandle.prototype.createSyncAccessHandle&&navigator?.storage?.getDirectory;L.metrics={dump:function(){let E,C=0,M=0,J=0;for(E in u.opIds){const G=I[E];C+=G.count,M+=G.time,J+=G.wait,G.avgTime=G.count&&G.time?G.time/G.count:0,G.avgWait=G.count&&G.wait?G.wait/G.count:0}t.config.log(globalThis.location.href,"metrics for",globalThis.location.href,":",I,`
.output/public/images/undraw_programming_re_kg9v.svg:1:<svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" width="786.81995" height="572.25773" viewBox="0 0 786.81995 572.25773" xmlns:xlink="http://www.w3.org/1999/xlink"><circle cx="458.32136" cy="74.18162" r="26.70075" fill="#f2f2f2"/><path d="M872.03753,661.02307c39.6877-30.22889,58.64352-81.02546,46.77635-129.48234q-.44231-1.806-.93367-3.6038c-7.86742-28.76343-27.33167-56.10058-55.7-65.29129-23.81971-7.71694-49.81962-1.78274-74.66936-4.85149-48.78136-6.02417-86.60057-45.494-113.21115-86.81933-26.61064-41.32546-47.06182-87.58331-82.42157-121.72413-58.28479-56.27536-153.36192-68.39149-225.62671-31.76044C293.98673,254.12142,247.95487,335.39062,249.918,416.38554c1.96322,80.995,50.04632,158.43176,119.87492,199.517,25.65222,15.093,55.32138,25.78522,84.84826,22.04377,25.62011-3.24641,48.89908-17.01264,74.39861-21.09959,40.09115-6.42568,79.92687,11.70084,114.60268,32.82375,34.67571,21.12288,68.17007,46.15988,107.57436,55.95242C789.47831,715.13139,836.88051,687.80109,872.03753,661.02307Z" transform="translate(-206.59003 -163.87113)" fill="#f2f2f2"/><path d="M815.016,219.19108c-.87006-.58-1.75-1.13-2.62006-1.69a380.24008,380.24008,0,0,0-80.31-38.93l-6.54,90.22h-41.46v-103.39c-2.61-.54-5.24-1.05-7.87-1.53v104.92H626.94587A102.26992,102.26992,0,0,1,524.67595,166.5212v-.0001c-2.64.57-5.26,1.18-7.88,1.83v100.44h-40.13l-6.23-86.03a380.8581,380.8581,0,0,0-81.94,43.53c-.44.3-.88.61-1.31.91-2.21,1.55-4.39,3.13-6.56,4.73v344.19h118.27l-2.09-28.95-11.5-158.95h231.59l-11.5,158.95-2.09,28.95h116.96v-353.45Q817.65591,220.90114,815.016,219.19108Zm-298.22,142.78h-33.39l-6.17-85.3h39.56Zm159.42,0h-56.08v-1.69a6.17975,6.17975,0,0,0-6.19-6.18h-24.38a6.17757,6.17757,0,0,0-6.18,6.18v1.69h-58.71v-85.3h151.54Zm7.87,0v-85.3h40.89l-6.17,85.3Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><path d="M206.59,598.16193a289.0029,289.0029,0,0,0,28.12,28.95l730.58,1a289.0029,289.0029,0,0,0,28.12-28.95Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><path d="M702.01993,505.46245v85.704a4.12233,4.12233,0,0,0,4.11906,4.11907H833.14348a4.12232,4.12232,0,0,0,4.11907-4.11907v-85.704a4.12433,4.12433,0,0,0-4.11907-4.11452H706.139A4.12434,4.12434,0,0,0,702.01993,505.46245Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><path d="M704.99939,506.52881V590.1092a2.20523,2.20523,0,0,0,2.20141,2.20141H832.08626a2.20522,2.20522,0,0,0,2.20141-2.20141V506.52881a2.20621,2.20621,0,0,0-2.20141-2.206H707.2008A2.20623,2.20623,0,0,0,704.99939,506.52881Z" transform="translate(-206.59003 -163.87113)" fill="#3a182f"/><path d="M699.36376,607.881a2.46985,2.46985,0,0,0,1.94346.92984H837.29917a2.5024,2.5024,0,0,0,2.44606-3.0157l-2.111-10.02722a2.50694,2.50694,0,0,0-1.55811-1.81784,2.42467,2.42467,0,0,0-.888-.1675H703.40985a2.42446,2.42446,0,0,0-.888.1675,2.50671,2.50671,0,0,0-1.55811,1.81784l-2.111,10.02722A2.5005,2.5005,0,0,0,699.36376,607.881Z" transform="translate(-206.59003 -163.87113)" fill="#2f2e41"/><rect x="830.03379" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1457.66604 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="821.65681" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1440.91208 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="813.27982" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1424.15811 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="804.90284" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1407.40415 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="796.52586" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1390.65018 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="788.14888" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1373.89622 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="779.7719" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1357.14226 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="771.39491" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1340.38829 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="763.01793" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1323.63433 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="754.64095" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1306.88037 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="746.26397" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1290.1264 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="737.88699" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1273.37244 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="729.51001" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1256.61847 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="721.13302" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1239.86451 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="712.75604" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1223.11055 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="704.37906" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1206.35658 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="830.13277" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1457.86401 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="821.75579" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1441.11005 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="813.37881" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1424.35608 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="805.00183" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1407.60212 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="796.62485" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1390.84816 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="788.24786" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1374.09419 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="779.87088" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1357.34023 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="771.4939" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1340.58627 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="763.11692" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1323.8323 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="754.73994" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1307.07834 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="746.36295" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1290.32437 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="737.98597" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1273.57041 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="729.60899" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1256.81645 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="721.23201" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1240.06248 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="712.85503" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1223.30852 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="704.47805" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1206.55456 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="760.60382" y="604.80311" width="33.50793" height="2.51309" rx="0.48819" transform="translate(1348.12555 1048.24818) rotate(-180)" fill="#3f3d56"/><rect x="515.63106" y="358.73707" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="548.15407" y="358.73707" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="557.36892" y="358.73707" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="524.47742" y="358.4768" width="20.79613" height="3.12216" rx="1.56108" fill="#fff"/><rect x="567.84144" y="358.4768" width="20.79613" height="3.12216" rx="1.56108" fill="#fff"/><rect x="524.30386" y="365.78373" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="556.82687" y="365.78373" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="566.04172" y="365.78373" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="533.15023" y="365.52345" width="20.79613" height="3.12216" rx="1.56108" fill="#fff"/><rect x="576.51424" y="365.52345" width="20.79613" height="3.12216" rx="1.56108" fill="#fff"/><rect x="532.97666" y="372.83038" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="565.49967" y="372.83038" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="574.71453" y="372.83038" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="541.82303" y="372.57011" width="20.79613" height="3.12216" rx="1.56108" fill="#fff"/><rect x="585.18704" y="372.57011" width="20.79613" height="3.12216" rx="1.56108" fill="#fff"/><rect x="541.64947" y="379.87703" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="574.17248" y="379.87703" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="583.38733" y="379.87703" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="550.49583" y="379.61676" width="20.79613" height="3.12216" rx="1.56108" fill="#fff"/><rect x="548.15407" y="407.89751" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="557.36892" y="407.89751" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="567.84144" y="408.15779" width="20.79613" height="3.12216" rx="1.56108" fill="#fff"/><rect x="515.63106" y="407.89751" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="524.47742" y="408.15779" width="20.79613" height="3.12216" rx="1.56108" fill="#fff"/><rect x="524.30386" y="400.85086" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="556.82687" y="400.85086" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="566.04172" y="400.85086" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="533.15023" y="401.11113" width="20.79613" height="3.12216" rx="1.56108" fill="#fff"/><rect x="532.97666" y="393.80421" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="565.49967" y="393.80421" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="574.71453" y="393.80421" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="541.82303" y="394.06448" width="20.79613" height="3.12216" rx="1.56108" fill="#fff"/><rect x="541.64947" y="386.75755" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="574.17248" y="386.75755" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="583.38733" y="386.75755" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="550.49583" y="387.01783" width="20.79613" height="3.12216" rx="1.56108" fill="#fff"/><path d="M711.50727,654.35273l-13.34954-21.10162,41.902-33.40283,17.29534-19.16107a19.16138,19.16138,0,0,1,32.418,6.8279h0a19.16136,19.16136,0,0,1-11.57015,23.991l-27.3488,10.07535Z" transform="translate(-206.59003 -163.87113)" fill="#ffb6b6"/><path d="M398.28,501.35193v102.56h71.85v-102.56a3.448,3.448,0,0,0-2.43-3.3,3.1749,3.1749,0,0,0-1.03-.16H401.75A3.46328,3.46328,0,0,0,398.28,501.35193Zm28.04,35.24a7.67033,7.67033,0,0,1,15.34,0v11.9a7.6701,7.6701,0,0,1-15.34,0Z" transform="translate(-206.59003 -163.87113)" fill="#2f2e41"/><path d="M398.06006,600.632v9.89a1.94622,1.94622,0,0,0,1.93,1.94h68.43a1.93972,1.93972,0,0,0,1.93-1.94v-9.89Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><path d="M285.25,346.832V534.09192a9.00714,9.00714,0,0,0,9,9h277.5a9.0071,9.0071,0,0,0,9-9V346.832a9.01147,9.01147,0,0,0-9-8.99H294.25A9.01151,9.01151,0,0,0,285.25,346.832Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><path d="M291.76,349.16193v182.62a4.81833,4.81833,0,0,0,4.81,4.81H569.44a4.81829,4.81829,0,0,0,4.81-4.81v-182.62a4.82047,4.82047,0,0,0-4.81-4.82H296.57A4.82051,4.82051,0,0,0,291.76,349.16193Z" transform="translate(-206.59003 -163.87113)" fill="#fff"/><path d="M342.4,611.79193a2.9484,2.9484,0,0,0,2.32,1.11h162.34a2.98725,2.98725,0,0,0,2.92-3.6l-2.52-11.97a2.99264,2.99264,0,0,0-1.86-2.17,2.89454,2.89454,0,0,0-1.06-.19995H347.23a2.8943,2.8943,0,0,0-1.06.19995,2.99239,2.99239,0,0,0-1.86,2.17l-2.52,11.97A2.985,2.985,0,0,0,342.4,611.79193Z" transform="translate(-206.59003 -163.87113)" fill="#2f2e41"/><path d="M560.58451,369.49866H305.26115a1.0156,1.0156,0,0,1,0-2.0307H560.58451a1.0156,1.0156,0,0,1,0,2.0307Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><ellipse cx="116.05131" cy="192.32963" rx="5.95043" ry="6.08304" fill="#3f3d56"/><ellipse cx="136.60733" cy="192.32963" rx="5.95043" ry="6.08304" fill="#3f3d56"/><ellipse cx="157.16336" cy="192.32963" rx="5.95043" ry="6.08304" fill="#3f3d56"/><path d="M548.20637,351.622h-14.6a1.1053,1.1053,0,0,0,0,2.21h14.6a1.10511,1.10511,0,0,0,0-2.21Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><path d="M548.20637,355.772h-14.6a1.10527,1.10527,0,0,0,0,2.21h14.6a1.10508,1.10508,0,0,0,0-2.21Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><path d="M548.20637,359.92194h-14.6a1.1053,1.1053,0,0,0,0,2.21h14.6a1.10511,1.10511,0,0,0,0-2.21Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><path d="M900.18575,604.97238a6.41621,6.41621,0,0,0,6.1831,4.331l26.49183-.68178a6.3285,6.3285,0,0,0,5.98085-4.657l3.74888-40.08721a9.79409,9.79409,0,0,0,4.23793.87079,9.66133,9.66133,0,1,0-.4849-19.31658,8.18393,8.18393,0,0,0-1.73618.18056,6.54764,6.54764,0,0,0-4.87405-2.103l-40.75051,1.05229a5.85294,5.85294,0,0,0-1.00519.1248,6.36455,6.36455,0,0,0-4.87318,8.26464Zm43.17345-43.81684,2.66764-9.55274a6.50649,6.50649,0,0,0,.02036-3.37458c.12944-.00034.24363-.06169.37307-.062a6.91049,6.91049,0,0,1,.32357,13.81714A6.50527,6.50527,0,0,1,943.3592,561.15554Z" transform="translate(-206.59003 -163.87113)" fill="#2f2e41"/><path d="M897.97751,544.68623c.86818,4.96412,10.62909,8.45387,22.36585,7.84729,10.79271-.49726,19.61745-4.287,21.23421-8.7785a6.02511,6.02511,0,0,0-1.84436-.24588l-40.75051,1.05229A5.85294,5.85294,0,0,0,897.97751,544.68623Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><path d="M922.49438,582.94415a.49659.49659,0,0,0,.15091-.06642l5.75315-3.76566a.49923.49923,0,0,0,.00032-.83621l-5.97978-3.91667a.49972.49972,0,1,0-.54792.83585l5.34091,3.49818-5.114,3.34794a.49991.49991,0,0,0,.39637.903Z" transform="translate(-206.59003 -163.87113)" fill="#3a182f"/><path d="M913.40762,583.36319a.5.5,0,0,0,.12608-.91842l-5.30306-3.04034,5.1256-3.80723a.49963.49963,0,1,0-.596-.80208l-5.73862,4.26265a.49951.49951,0,0,0,.04918.83476l5.96525,3.41968A.4997.4997,0,0,0,913.40762,583.36319Z" transform="translate(-206.59003 -163.87113)" fill="#3a182f"/><path d="M921.92215,586.24416a.48233.48233,0,0,0,.137-.05785.49976.49976,0,0,0,.16752-.68714l-8.15548-13.40836a.50026.50026,0,0,0-.85442.52058l8.15548,13.40835A.50035.50035,0,0,0,921.92215,586.24416Z" transform="translate(-206.59003 -163.87113)" fill="#3a182f"/><rect x="209.38454" y="260.82713" width="50.71916" height="10.8457" rx="3.26417" fill="#3a182f"/><rect x="183.62601" y="282.51852" width="102.23622" height="10.8457" rx="3.26417" fill="#e6e6e6"/><rect x="183.62601" y="304.20991" width="102.23622" height="10.8457" rx="3.26417" fill="#e6e6e6"/><path d="M497.30123,540.717l.21675.68444.01142.02283,6.52515,19.838,7.50627,22.86094,14.1227,42.96133.13688,6.67346v.02283l1.04949,53.6845-2.90894,7.2781,3.274,11.93237s-1.50582-18.037-9.5824-7.67884c-4.57448,5.8864-9.92468,11.90961-14.31668,17.55642q9.59964,3.88436,19.50716,7.0271c1.426.45633,2.86334.88983,4.30071,1.32333q.46194.13692.924.27377a266.86342,266.86342,0,0,0,67.35086,10.82587c1.18637.03425,2.35.057,3.47932.07986.39932.01142.78714.02284,1.175.02284,1.27765.01142,2.54389.02277,3.82154.02277q3.86721,0,7.70018-.11405a266.85337,266.85337,0,0,0,56.09149-7.58613c-.12547-7.58606-.46768-16.44984-.9582-25.91819-.22817-4.64293-5.3502-9.67369-5.65823-14.53336-.21675-3.65047,4.38057-7.08419,4.141-10.79169-1.55143-22.82675-3.49075-14.06417-4.92813-30.22882q-.22245-2.37852-.41066-4.55165c-.924-10.381-1.56284-16.872-1.56284-16.872l6.13733-38.68338,9.6395-60.73442-.74153-1.22063-.83274-.41066-50.844-25.16532-2.76064-7.07276a10.97881,10.97881,0,0,0-10.14143-6.94731l-33.4929-.13688a10.93117,10.93117,0,0,0-8.90946,4.52888l-9.069,12.55978Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><path d="M533.40653,617.52479,525.8204,633.758l-5.179,11.08822-8.90939,46.646-4.46044,4.73414L503.45,679.467l-39.99772,8.88094c-1.31191-7.28951-.3512.24662-1.16117-7.75009.22817-.22817.46768-.45634.70727-.68451.63882-.59322,1.175-1.15218,1.1636-1.68831-.45633-27.58374.9126-74.52633,12.34311-102.96564a60.05328,60.05328,0,0,1,7.02709-13.1074c.22817-.308.44492-.61606.66167-.924,5.27034-7.3808,8.60136-14.64748,13.32415-19.81511v-.01142a.53028.53028,0,0,0,.07986-.07987.157.157,0,0,0,.04561-.03425l32.44341-17.20272,1.39177,39.10546.99247,28.10851Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><path d="M650.3914,622.13549l9.476,20.275,3.30742,7.06091,8.90681,46.64162,4.44575,4.72264,3.83039-16.75524,1.7998-.36918,32.4585-6.72243,9.46058,30.04631a17.984,17.984,0,0,0-3.26122-22.50556c-.64606-.58457-1.18444-1.15373-1.16913-1.69211.53847-32.4431-1.446-91.68363-19.36733-116.06588-5.69179-7.73777-9.1068-15.44474-14.07562-20.82885-.0154-.0153-.0154-.0307-.03071-.0307L674.0814,526.1139l-.73836-1.21533-.83066-.41528Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><circle id="a657ec4b-47ce-4d2a-9c58-81a811696ca9" data-name="Ellipse 5" cx="386.3965" cy="267.20052" r="44.55826" fill="#ffb6b6"/><path d="M653.21227,399.94791a3.75933,3.75933,0,0,0-2.69-1.19l.67-1.86a3.52769,3.52769,0,0,0-3.96-4.7l-2.44.47.23-1.63a3.53387,3.53387,0,0,0-4.73-3.82,3.76631,3.76631,0,0,1-3.24-.23,3.84647,3.84647,0,0,1-1.92-2.61005l-.85-4.1-.09-.22c-4.14-6.9-12.1-11.92-21.84-13.76-8.67005-1.65-17.56-.81-26.13-.02-3.4.32-7.24.68-10.44,2.64-2.72,1.68-5.02,5.04-4.55,8.43-8.45-2.59-17.51,2.58-22,9.1-5.32,7.76-6.19,17.48-6.33,25.08-.38,17.98,3.33,32.69,11,43.73.56.8.7,2.47,1.81,3.03l-.23-.37c1.24.62,2.5,1.62,2.03,2.69-1.35,3.08,7.62,9.89,13.94,12.14,11.53,4.11,26.86,3.76,37.64,2.28l.38-2.55c3.89-.53,6.63-1.54,7.4-3.12,1.36005-1.16,2.52-2.2,3.53-3.16l.01-.01c.02-.02.06-.05.08-.07,4.87-4.67,6-7.32995,6.51-11.37994.49-3.97-.38-8-1.27-11.63,18.74,2.9-7.38-19.96,10.08-24.38a5.434,5.434,0,0,1,.61-.15c.51-.12,1.02-.24,1.51-.38a26.44846,26.44846,0,0,0,6.72-2.87c4.88-2.97,6.49-6.91,9.01-11.35A3.42652,3.42652,0,0,0,653.21227,399.94791Z" transform="translate(-206.59003 -163.87113)" fill="#2f2e41"/><path d="M750.58227,625.3079c-.01,1.75-.03,4.2-.11,7.23q-.015.63-.03,1.29c-.13,5.57-.26,10.24-.47,15.43-.01.36-.02.71-.04,1.07-.28,7.24-.72,15.67-1.48,29.02-1.41,24.66-3.87,3.39-6.34,12.04-.12.43-.25.94-.37,1.54a27.91582,27.91582,0,0,1-1.88,6.33c-1.31.78-2.66,1.53-3.99,2.28-3.79,2.11-7.63995,4.13995-11.51995,6.07-2.18006,1.08-4.37,2.14-6.57,3.16-.35.16-.69.32-1.03.47a270.88715,270.88715,0,0,1-34.75,13.26c-2.32.7-4.63,1.38-6.97,2.01-2.44.68-4.88,1.32-7.35,1.92a266.8933,266.8933,0,0,1-56.09,7.59c-2.55.08-5.12.11-7.7.11-1.28,0-2.54-.01-3.82-.02-.39,0-.78-.01-1.17-.02-1.13-.03-2.3-.05-3.48-.08a266.66307,266.66307,0,0,1-67.35-10.83l-.93-.27c-1.44-.44-2.87-.87-4.3-1.33q-9.90006-3.135-19.51-7.02-7.335-2.955-14.5-6.34a.33861.33861,0,0,1-.12-.06c-1-.46-2.01-.94-3.01-1.43-.13-.07-.27-.14-.41-.21q-5.59506-2.73-11.07-5.72c-3.07-7.05005-7.39-8.4-10.07-14.6a25.87356,25.87356,0,0,1-1.68-5.74c0-.02-.01-.04-.01-.07.28,3.72-1.19-6.6-.01-.04-.01-.12-.02-.25-.03-.4-.03-.36-.06994-.8-.12994-1.35-3.43-33.49-3.21-71.79-4.7-103.35q-.15006-3.06-.31-5.86c-.03-.62-.07-1.23-.11005-1.83.07-.18.15-.37.24-.55a1.002,1.002,0,0,1,.07-.15,1.62294,1.62294,0,0,1,.1-.18c.02-.03.05-.07.07-.1a.91693.91693,0,0,1,.05-.1c.09-.14.19-.29.3-.43.05-.06.09-.11005.14-.16a.80824.80824,0,0,1,.12-.14.637.637,0,0,1,.11-.13c.04-.04.08-.09.13-.13995a.30159.30159,0,0,1,.08-.08,2.03313,2.03313,0,0,1,.26-.25,9.62387,9.62387,0,0,1,1.14-.9c.13995-.09.29-.18.43-.28a19.13528,19.13528,0,0,1,3.17-1.52c.38-.14.76-.27,1.17-.41.15-.04.29-.09.44-.14.22-.07.44-.14.67-.19,1.14-.34,2.37-.63,3.7-.9.16-.03.33-.06.5-.1.24-.05.49-.09.74-.13.34-.06.69-.12,1.04-.18,2.97-.47,6.34-.82,10.06-1.05q.525-.03,1.05-.06c.41-.02.82-.04,1.24-.06.35-.02.71-.03,1.07-.04.35-.02.71-.03,1.08-.04,1.01-.03,2.05-.06,3.11-.08,3.02-.06,6.2-.04,9.54.03,1.55.04,3.13.08,4.75.15.11005,0,.21.01.31.01,1.41.05,2.83.11,4.29.19,1.02.05,2.05.1,3.07995.16.97.06,1.95.12,2.94.19.77.04,1.54.1,2.32.15.66.05,1.32.1,1.98.14l.9.06c.49.04.98.07,1.48.12,1.1.09,2.2.18,3.32.27,1.11.1,2.24.2,3.37.3s2.27.21,3.41.32c.12.01.23.02.34.03,1.04.11005,2.08.21,3.13.32.24.02.49.04.73.07,1.0011.10058,2.02173.21832,3.032.32568.31006.03345.61847.06586.92944.09985.79139.08618,1.57154.16089,2.36847.25446,1.05.12,2.12006.23,3.16.37.81.09,1.62.18,2.43.28,1.27.15,2.56.31,3.85.48.49.06.98.12,1.47.19,3.68.46,7.4.97,11.18,1.5,5.73.81,11.55,1.69,17.41,2.64q8.80509,1.425,17.71,3.01c1.5.27,3,.54,4.51.82q1.02.19491,2.04.38995c1.16.21,2.32.43,3.48.65,1.16.22,2.32.44,3.48.67,1.38.27,2.77.54,4.15.81,9.09,1.8,18.12994,3.72,26.95,5.73,1.45.32995,2.9.67,4.34,1q4.32,1.005,8.56,2.04c.78.18,1.55.37,2.32.56,1.92.48,3.84.96,5.73,1.45l.33.09c1.39.34,2.75.69,4.11,1.05q4.815,1.26,9.47,2.55,3.09.855,6.11,1.73c3.01.87,5.96,1.75,8.83,2.64.71.22,1.42.44,2.12.65,2.1.65,4.17,1.31,6.18,1.97,1.6.52,3.16,1.05,4.7,1.58q2.31.795,4.53,1.59c.95.34,1.89.7,2.83,1.04,1.35.5,2.68,1,3.98,1.5.4.15.79.31,1.18.46.25.11.49.2.73.3.47.19.95.37,1.41.56.47.18.93.37,1.39.57.45.18.91.37,1.35.56.45.18.89.37,1.33.57.37.15.73.31,1.08.47.71.31,1.42.62,2.11.94.34.16.68.31,1.02.47l.78.36c.11.06.22.11.33.16.25.12.51.25.76.37.57995.27,1.15.56,1.71.83.75.38,1.48.76,2.18,1.13.71.37994,1.4.76,2.06,1.12994.11.06.21.12006.32.18006.15.07995.3.17.45.25.51.29,1,.59,1.49.87994.96.59,1.87,1.17,2.72,1.75.19.13.37.26.56.38.63.45,1.23.89,1.79,1.34,0,.01,0,.01.01.01.19.14.37.29.55.43.15.14.31.26.46.4.52.45,1,.87994,1.44,1.32a5.667,5.667,0,0,1,.42.43,1.20839,1.20839,0,0,1,.16.16c.2.2.38.4.55.6a.55257.55257,0,0,1,.07.09c.24.28.46.56.67.84.1.14.21.28.3.42.12.17.24.35.34.52.09.14.17.29.25.43006a7.2566,7.2566,0,0,1,.54,1.12994,5.2413,5.2413,0,0,1,.27.82A5.84442,5.84442,0,0,1,750.58227,625.3079Z" transform="translate(-206.59003 -163.87113)" fill="#2f2e41"/><path d="M750.58227,625.3079c-.01,1.75-.03,4.2-.11,7.23-.01.42-.03.85-.04,1.29-.1,4.25-.25,9.5-.46,15.43-.01.36-.02.71-.04,1.07-.28,7.24-.72,15.67-1.48,29.02-1.41,24.66-3.87,3.39-6.34,12.04-6.86-4.22-14.38-8.64-22.42-13.18q-2.175-1.23-4.39-2.47c-16.08-8.97-34.04-18.37006-52.79-27.68-.74-.37-1.49-.74-2.23-1.1-42.95-21.23-89.83-41.88-127.81-55.66-7.33-2.66-14.33-5.06-20.91-7.17005-13.86-4.43-25.84-7.53-35.06-8.87-9.6-1.4-16.23-.9-18.91,1.99q-.15006-3.06-.31-5.86-.06006-.93-.12-1.83c.06171-.16462.14191-.32172.21955-.48017.01111-.02313.019-.047.03045-.06982a1.002,1.002,0,0,1,.07-.15,1.62294,1.62294,0,0,1,.1-.18,1.05985,1.05985,0,0,1,.12-.2c.09-.14.19-.29.3-.43a3.48261,3.48261,0,0,1,.26-.30005.637.637,0,0,1,.11-.13c.04-.04.08-.09.13-.13995a.30159.30159,0,0,1,.08-.08,2.03313,2.03313,0,0,1,.26-.25,9.62387,9.62387,0,0,1,1.14-.9c.13995-.09.29-.18.43-.28a19.13528,19.13528,0,0,1,3.17-1.52c.38-.14.76-.27,1.17-.41.15-.04.29-.09.44-.14.22-.07.44-.14.67-.19,1.14-.34,2.37-.63,3.7-.9.4-.08.82-.16,1.24-.23.34-.06.69-.12,1.04-.18,2.97-.47,6.34-.82,10.06-1.05q.525-.03,1.05-.06c.41-.02.82-.04,1.24-.06.35-.02.71-.03,1.07-.04.35-.02.71-.03,1.08-.04,1.01-.03,2.05-.06,3.11-.08,3.02-.05,6.2-.03,9.54.04,1.55.03,3.13.08,4.75.15.1,0,.21.01.31.01,1.41.04,2.84.11,4.29.18,1.02.05,2.05.1,3.07995.16.97.06,1.95.12,2.94.19.77.04,1.54.1,2.32.15.66.05,1.32.1,1.98.14.79.06,1.58.12,2.38.18,1.1.09,2.2.18,3.32.27,1.11.1,2.24.2,3.37.3s2.27.21,3.41.32c.12.01.23.02.34.03,1.04.11005,2.08.21,3.13.32q8.73.885,17.97,2.07,5.52.705,11.18,1.51c5.73.81,11.55,1.69,17.41,2.63q8.80509,1.425,17.71,3.01c1.5.27,3,.54,4.51.82q2.76.50994,5.52,1.04c1.16.22,2.32.44,3.48.67,1.38.27,2.77.54,4.15.81,9.09,1.8,18.12994,3.72,26.95,5.73,1.45.32995,2.9.67,4.34,1q4.32,1.005,8.56,2.04c.78.19,1.55.38,2.32.57q2.895.72,5.73,1.44v.01c.11.02.22.05.33.08,1.38.35,2.75.7,4.11,1.06q4.815,1.26,9.47,2.54c2.06.57995,4.1,1.15,6.11,1.73,3.01.88,5.96,1.76,8.83,2.64.71.22,1.42.44,2.12.65q3.15.99,6.18,1.97c1.6.52,3.16,1.05,4.7,1.58q2.31.795,4.53,1.59c.96.34,1.9.69,2.83,1.03,1.36.5,2.68,1,3.98,1.51.4.15.79.31,1.18.46.73.28,1.44.57,2.14.86.47.18.93.37,1.39.57.45.18.91.37,1.35.56.45.18.89.37,1.33.57.37.15.73.31,1.08.47.71.31,1.42.62,2.11.94.34.16.68.31,1.02.47l.78.36c.11.06.22.11.33.16.85.4,1.67.8,2.47,1.2.75.38,1.48.76,2.18,1.13.83.43994,1.62.87,2.38,1.31.15.07995.3.17.45.25.51.29,1,.59,1.49.87994.96.59,1.87,1.17,2.72,1.75.84.58,1.62,1.15,2.35,1.72,0,.01,0,.01.01.01.35.28.69.56,1.01.83.52.45,1,.87994,1.44,1.32a5.667,5.667,0,0,1,.42.43,1.20839,1.20839,0,0,1,.16.16c.21.23.42.46.62006.69.24.28.46.56.67.84.1.14.21.28.3.42.12.17.24.35.34.52.09.14.17.29.25.43006a7.2566,7.2566,0,0,1,.54,1.12994,6.05312,6.05312,0,0,1,.27.82A5.84442,5.84442,0,0,1,750.58227,625.3079Z" transform="translate(-206.59003 -163.87113)" opacity="0.2"/></svg>
---STYLE VALUES IN DIFF ADDITIONS---
+            <h4 class="care-card__points-title">Inclus dans l’accompagnement :</h4>
+// Données statiques (3 offres de build, 1 offre de care, 4 étapes) déclarées localement. Prerender-safe, dark-first.
+    "Suivi fin de consommation des tokens & ajustements de prompts",
+    "Consommations tierces d'APIs et tokens (LLM, OCR, scraping...) refacturées au réel ou prises en charge directement par le client. Pas d'engagement imposé au build.",
+  ctaAriaLabel: "Découvrir l'accompagnement AI Care",
+// Étapes du process en 4 temps (Offre V1.1). L'ordre du tableau garantit l'affichage 01 → 04.
+    desc: "Développer uniquement le niveau de système nécessaire (automatisation ciblée, workflow métier ou application sur mesure) et le tester sur des cas réels avant livraison.",
+    itemListElement: [
+        "@type": "ListItem",
+        item: {
+          url: `${siteUrl}/services#${offer.id}`,
+            "@id": `${siteUrl}/#organization`,
+        "@type": "ListItem",
+        item: {
+          url: `${siteUrl}/services#${careOffer.id}`,
+            "@id": `${siteUrl}/#organization`,
+  grid-template-columns: 1fr 1fr;
+  align-items: start;
+  align-items: center;
+  width: var(--space-10); // 40px
+  // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
+  // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
+  font-size: 22px;
+  border-left: 1px solid var(--border-subtle);
+  border-top: 1px solid var(--border-subtle);
+  opacity: 0.85;
+    grid-template-columns: 1fr;
+    border-top: 1px solid var(--border-subtle);
---DIFF SERVICE CONTEXT---
     1	diff --git a/app/pages/services.vue b/app/pages/services.vue
     2	index 0c6e1e1..6d6a6eb 100644
     3	--- a/app/pages/services.vue
     4	+++ b/app/pages/services.vue
     5	@@ -1,6 +1,6 @@
     6	 <template>
     7	   <main class="services">
     8	-    <!-- En-tête + grille d'offres (story 12.5 & story 15.2) -->
     9	+    <!-- En-tête + grille d'offres de build (story 12.5 & story 15.2) -->
    10	     <section class="section">
    11	       <div class="container">
    12	         <p class="eyebrow"><span aria-hidden="true">// </span>services</p>
    13	@@ -49,8 +49,59 @@
    14	       </div>
    15	     </section>
    16	 
    17	-    <!-- Section process : 4 étapes ordonnées + CTA (story 12.5) -->
    18	-    <section class="section section--sunken">
    19	+    <!-- Section AI Care : Maintien en condition opérationnelle (story 15.3) -->
    20	+    <section class="section section--sunken care-section">
    21	+      <div class="container">
    22	+        <p class="eyebrow"><span aria-hidden="true">// </span>après la mise en production</p>
    23	+        <h2 class="care-section__title">Le système doit continuer à fonctionner.</h2>
    24	+        <p class="prose care-section__intro">
    25	+          Une automatisation utile doit continuer à fonctionner après sa mise en production. AI Care couvre le maintien
    26	+          en condition opérationnelle du système : monitoring, maintenance, support, suivi des coûts et adaptations
    27	+          mineures liées aux APIs ou aux modèles.
    28	+        </p>
    29	+
    30	+        <ZCard :id="careOffer.id" class="care-card">
    31	+          <div class="care-card__info">
    32	+            <div class="care-card__badge">
    33	+              <ZBadge tone="neutral">{{ careOffer.badge }}</ZBadge>
    34	+            </div>
    35	+            <div class="care-card__icon"><ZIcon name="bot" /></div>
    36	+            <h3 class="care-card__title">{{ careOffer.title }}</h3>
    37	+            <p class="care-card__desc">{{ careOffer.desc }}</p>
    38	+
    39	+            <div class="care-card__footer">
    40	+              <div class="care-card__price">
    41	+                <b>{{ careOffer.price }}</b>
    42	+              </div>
    43	+              <p v-if="careOffer.disclaimer" class="care-card__disclaimer">
    44	+                {{ careOffer.disclaimer }}
    45	+              </p>
    46	+              <div class="care-card__cta">
    47	+                <ZButton
    48	+                  :as="NuxtLink"
    49	+                  to="/contact"
    50	+                  variant="secondary"
    51	+                  :aria-label="careOffer.ctaAriaLabel"
    52	+                  class="care-card__btn"
    53	+                >
    54	+                  {{ careOffer.ctaText }}
    55	+                </ZButton>
    56	+              </div>
    57	+            </div>
    58	+          </div>
    59	+
    60	+          <div class="care-card__details">
    61	+            <h4 class="care-card__points-title">Inclus dans l’accompagnement :</h4>
    62	+            <ul class="care-card__points">
    63	+              <li v-for="point in careOffer.points" :key="point">{{ point }}</li>
    64	+            </ul>
    65	+          </div>
    66	+        </ZCard>
    67	+      </div>
    68	+    </section>
    69	+
    70	+    <!-- Section process : 4 étapes ordonnées + CTA (story 12.5 & story 15.3) -->
    71	+    <section class="section">
    72	       <div class="container">
    73	         <p class="eyebrow"><span aria-hidden="true">// </span>comment ça se passe</p>
    74	         <h2 class="process__title">Un déroulé simple en quatre temps</h2>
    75	@@ -80,8 +131,8 @@
    76	 </template>
    77	 
    78	 <script setup lang="ts">
    79	-// Page Services : catalogue d'offres de build sur devis (3 niveaux d'intervention) + process 4 étapes + CTA contact.
    80	-// Données statiques (3 offres, 4 étapes) déclarées localement. Prerender-safe, dark-first.
    81	+// Page Services : catalogue d'offres de build sur devis + section dédiée AI Care + process 4 étapes + CTA contact.
    82	+// Données statiques (3 offres de build, 1 offre de care, 4 étapes) déclarées localement. Prerender-safe, dark-first.
    83	 import { NuxtLink } from "#components";
    84	 import { SITE } from "~/data/site";
    85	 
    86	@@ -104,6 +155,18 @@ interface Offer {
    87	   ctaAriaLabel: string;
    88	 }
    89	 
    90	+interface CareOffer {
    91	+  id: string;
    92	+  badge: string;
    93	+  title: string;
    94	+  price: string;
    95	+  desc: string;
    96	+  points: string[];
    97	+  disclaimer: string;
    98	+  ctaText: string;
    99	+  ctaAriaLabel: string;
   100	+}
   101	+
   102	 interface Step {
   103	   n: string;
   104	   title: string;
   105	@@ -178,12 +241,32 @@ const offers: Offer[] = [
   106	   },
   107	 ];
   108	 
   109	-// Étapes du process en 4 temps. L'ordre du tableau garantit l'affichage 01 → 04.
   110	+// Offre de maintien en condition opérationnelle V1.1 (AI Care).
   111	+const careOffer: CareOffer = {
   112	+  id: "ai-care",
   113	+  badge: "MAINTIEN EN CONDITION OPÉRATIONNELLE",
   114	+  title: "AI Care",
   115	+  price: "À partir de 250 € HT / mois",
   116	+  desc: "Pour les systèmes qui ont besoin d'être exploités, surveillés et adaptés dans la durée.",
   117	+  points: [
   118	+    "Monitoring proactif, détection d'erreurs & alertes d'anomalies",
   119	+    "Maintenance corrective & adaptation aux évolutions d'APIs tierces",
   120	+    "Suivi fin de consommation des tokens & ajustements de prompts",
   121	+    "Support technique réactif & veille sur les nouveaux modèles",
   122	+    "Mesure factuelle des KPI et optimisation continue du flux",
   123	+  ],
   124	+  disclaimer:
   125	+    "Consommations tierces d'APIs et tokens (LLM, OCR, scraping...) refacturées au réel ou prises en charge directement par le client. Pas d'engagement imposé au build.",
   126	+  ctaText: "Découvrir AI Care",
   127	+  ctaAriaLabel: "Découvrir l'accompagnement AI Care",
   128	+};
   129	+
   130	+// Étapes du process en 4 temps (Offre V1.1). L'ordre du tableau garantit l'affichage 01 → 04.
   131	 const steps: Step[] = [
   132	   {
   133	     n: "01",
   134	     title: "Diagnostic",
   135	-    desc: "Échange de 20 à 30 minutes pour qualifier le problème, comprendre le workflow existant et identifier les goulots d'étranglement.",
   136	+    desc: "Échange gratuit de 20 à 30 minutes pour qualifier le problème, comprendre le workflow existant, ses volumes, ses outils et identifier la friction réelle.",
   137	     inlineCta: {
   138	       to: "/contact",
   139	       label: "Identifier un workflow →",
   140	@@ -192,17 +275,17 @@ const steps: Step[] = [
   141	   {
   142	     n: "02",
   143	     title: "Cadrage",
   144	-    desc: "Formalisation du workflow cible, des étapes manuelles à conserver sous contrôle humain, des connecteurs API requis et des KPI de mesure. Fait l'objet d'un Blueprint pour les sujets complexes.",
   145	+    desc: "Définir la cible, ce qui doit être automatisé, ce qui reste humain et comment mesurer le résultat. Pour les sujets complexes, un Blueprint facturable (à partir de 750 € HT) peut être proposé lorsque le cadrage nécessite un travail approfondi avant devis.",
   146	   },
   147	   {
   148	     n: "03",
   149	     title: "Construction & intégration",
   150	-    desc: "Développement logiciel du système, connexion aux outils métiers (CRM, ERP, messagerie...), couverture de tests automatisés et mise à l'épreuve sur cas réels avant livraison.",
   151	+    desc: "Développer uniquement le niveau de système nécessaire (automatisation ciblée, workflow métier ou application sur mesure) et le tester sur des cas réels avant livraison.",
   152	   },
   153	   {
   154	     n: "04",
   155	-    title: "Suivi & amélioration",
   156	-    desc: "Monitoring en production, maintenance préventive/corrective, ajustements aux évolutions d'APIs tierces ou modèles d'IA, mesure factuelle des résultats.",
   157	+    title: "Exploitation & mesure",
   158	+    desc: "Mise en production, mesure initiale de performance et maintien en condition opérationnelle lorsque le workflow le justifie (via AI Care).",
   159	   },
   160	 ];
   161	 
   162	@@ -217,24 +300,46 @@ const servicesJsonLd = {
   163	   url: `${siteUrl}/services`,
   164	   mainEntity: {
   165	     "@type": "ItemList",
   166	-    itemListElement: offers.map((offer, index) => ({
   167	-      "@type": "ListItem",
   168	-      position: index + 1,
   169	-      item: {
   170	-        "@type": "Service",
   171	-        name: offer.title,
   172	-        description: offer.desc,
   173	-        provider: {
   174	-          "@type": "Organization",
   175	-          "@id": `${siteUrl}/#organization`,
   176	-          name: SITE.profile.name,
   177	+    itemListElement: [
   178	+      ...offers.map((offer, index) => ({
   179	+        "@type": "ListItem",
   180	+        position: index + 1,
   181	+        item: {
   182	+          "@type": "Service",
   183	+          name: offer.title,
   184	+          description: offer.desc,
   185	+          url: `${siteUrl}/services#${offer.id}`,
   186	+          provider: {
   187	+            "@type": "Organization",
   188	+            "@id": `${siteUrl}/#organization`,
   189	+            name: SITE.profile.name,
   190	+          },
   191	+          offers: {
   192	+            "@type": "Offer",
   193	+            description: offer.price,
   194	+          },
   195	         },
   196	-        offers: {
   197	-          "@type": "Offer",
   198	-          description: offer.price,
   199	+      })),
   200	+      {
   201	+        "@type": "ListItem",
   202	+        position: offers.length + 1,
   203	+        item: {
   204	+          "@type": "Service",
   205	+          name: careOffer.title,
   206	+          description: careOffer.desc,
   207	+          url: `${siteUrl}/services#${careOffer.id}`,
   208	+          provider: {
   209	+            "@type": "Organization",
   210	+            "@id": `${siteUrl}/#organization`,
   211	+            name: SITE.profile.name,
   212	+          },
   213	+          offers: {
   214	+            "@type": "Offer",
   215	+            description: careOffer.price,
   216	+          },
   217	         },
   218	       },
   219	-    })),
   220	+    ],

exec
/bin/zsh -lc "rg -l '3 500|3500|490 €|490€' app .output/public || true; printf '%s\\n' '---ADDED STYLE LINES---'; awk '/diff --git a\\/app\\/pages\\/services.vue/{p=1} p && /"'^diff --git/ && !/services.vue/{exit} p && /''^'"\\+/{print}' docs/implementation-artifacts/code-reviews/15-4/full.diff | rg '(font-size: 22px|opacity: 0\\.85|[0-9]+px|[0-9]+\\.[0-9]+)'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
.output/public/_nuxt/BMCBmpPj.js
.output/public/_nuxt/sqlite3-worker1-bundler-friendly-Bv6ABw9v.js
.output/public/_nuxt/Zi78bNBY.js
---ADDED STYLE LINES---
+    <!-- En-tête + grille d'offres de build (story 12.5 & story 15.2) -->
+    <!-- Section AI Care : Maintien en condition opérationnelle (story 15.3) -->
+    <!-- Section process : 4 étapes ordonnées + CTA (story 12.5 & story 15.3) -->
+// Offre de maintien en condition opérationnelle V1.1 (AI Care).
+// Étapes du process en 4 temps (Offre V1.1). L'ordre du tableau garantit l'affichage 01 → 04.
+  width: var(--space-10); // 40px
+  // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
+  // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
+  font-size: 22px;
+  border-left: 1px solid var(--border-subtle);
+  border-top: 1px solid var(--border-subtle);
+  opacity: 0.85;
+    border-top: 1px solid var(--border-subtle);

exec
/bin/zsh -lc "nl -ba app/pages/services.vue | sed -n '504,650p'; nl -ba app/assets/scss/abstract/_root.scss | sed -n '215,258p'; nl -ba app/pages/about.vue | sed -n '145,184p'; nl -ba app/pages/blog/index.vue | sed -n '90,152p'; nl -ba docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md | sed -n '1,120p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
   504	  width: 100%;
   505	}
   506	
   507	// ---- Section AI Care (.care-section / .care-card*) ----
   508	.care-section__title {
   509	  max-width: 26ch;
   510	  margin-bottom: var(--space-3);
   511	  font-family: var(--font-mono);
   512	  font-size: var(--fs-3xl);
   513	  font-weight: var(--fw-regular);
   514	  line-height: var(--lh-tight);
   515	  color: var(--text-strong);
   516	}
   517	
   518	.care-section__intro {
   519	  max-width: 62ch;
   520	  margin-bottom: var(--space-8);
   521	  color: var(--text-muted);
   522	}
   523	
   524	.care-card {
   525	  display: grid;
   526	  grid-template-columns: 1fr 1fr;
   527	  gap: var(--space-8);
   528	  align-items: start;
   529	  scroll-margin-top: var(--space-16);
   530	}
   531	
   532	.care-card__info {
   533	  display: flex;
   534	  flex-direction: column;
   535	}
   536	
   537	.care-card__badge {
   538	  margin-bottom: var(--space-3);
   539	}
   540	
   541	.care-card__icon {
   542	  display: flex;
   543	  align-items: center;
   544	  justify-content: center;
   545	  width: var(--space-10); // 40px
   546	  height: var(--space-10);
   547	  margin-bottom: var(--space-4);
   548	
   549	  // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
   550	  // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
   551	  font-size: 22px;
   552	  color: var(--accent);
   553	  background: var(--accent-soft);
   554	  border-radius: var(--radius-md);
   555	}
   556	
   557	.care-card__title {
   558	  margin-bottom: var(--space-2);
   559	  font-family: var(--font-mono);
   560	  font-size: var(--fs-2xl);
   561	  font-weight: var(--fw-regular);
   562	  color: var(--text-strong);
   563	}
   564	
   565	.care-card__desc {
   566	  margin: 0 0 var(--space-5);
   567	  font-family: var(--font-sans);
   568	  font-size: var(--fs-sm);
   569	  line-height: var(--lh-relaxed);
   570	  color: var(--text-body);
   571	}
   572	
   573	.care-card__details {
   574	  display: flex;
   575	  flex-direction: column;
   576	  padding-left: var(--space-6);
   577	  border-left: 1px solid var(--border-subtle);
   578	}
   579	
   580	.care-card__points-title {
   581	  margin: 0 0 var(--space-3);
   582	  font-family: var(--font-mono);
   583	  font-size: var(--fs-xs);
   584	  font-weight: var(--fw-medium);
   585	  letter-spacing: var(--ls-wide);
   586	  color: var(--accent);
   587	  text-transform: uppercase;
   588	}
   589	
   590	.care-card__points {
   591	  margin: 0;
   592	  padding: 0;
   593	  list-style: none;
   594	
   595	  li {
   596	    position: relative;
   597	    padding: var(--space-2) 0 var(--space-2) var(--space-5);
   598	    font-family: var(--font-mono);
   599	    font-size: var(--fs-sm);
   600	    color: var(--text-muted);
   601	  }
   602	
   603	  li::before {
   604	    content: "→";
   605	    position: absolute;
   606	    left: 0;
   607	    color: var(--accent);
   608	  }
   609	}
   610	
   611	.care-card__footer {
   612	  display: flex;
   613	  flex-direction: column;
   614	  margin-top: var(--space-4);
   615	  padding-top: var(--space-4);
   616	  border-top: 1px solid var(--border-subtle);
   617	}
   618	
   619	.care-card__price {
   620	  font-family: var(--font-mono);
   621	  font-size: var(--fs-sm);
   622	  color: var(--text-muted);
   623	
   624	  b {
   625	    font-size: var(--fs-lg);
   626	    font-weight: var(--fw-bold);
   627	    color: var(--text-strong);
   628	  }
   629	}
   630	
   631	.care-card__disclaimer {
   632	  margin: var(--space-2) 0 0;
   633	  font-family: var(--font-mono);
   634	  font-size: var(--fs-xs);
   635	  line-height: var(--lh-normal);
   636	  color: var(--text-muted);
   637	  opacity: 0.85;
   638	}
   639	
   640	.care-card__cta {
   641	  margin-top: var(--space-4);
   642	}
   643	
   644	.care-card__btn {
   645	  width: 100%;
   646	}
   647	
   648	// ---- Section process ----
   649	.process__title {
   650	  margin-bottom: var(--space-8);
   215	[data-theme="light"] {
   216	  // ---- Rampe de surfaces neutres primitives ----
   217	  --surface-0: hsl(38deg 25% 97%);
   218	  --surface-1: hsl(38deg 20% 93%);
   219	  --surface-2: hsl(0deg 0% 100%);
   220	  --surface-3: hsl(38deg 30% 99%);
   221	  --surface-4: hsl(38deg 15% 95%);
   222	
   223	  // ---- Bordures / hairlines primitives ----
   224	  --line-subtle: hsl(35deg 15% 88%);
   225	  --line: hsl(35deg 12% 80%);
   226	  --line-strong: hsl(35deg 12% 68%);
   227	
   228	  // ---- Texte encres primitives (contrastes WCAG AAA) ----
   229	  --ink-1: hsl(320deg 30% 12%);
   230	  --ink-2: hsl(320deg 18% 26%);
   231	  --ink-3: hsl(320deg 10% 44%);
   232	  --ink-4: hsl(320deg 8% 58%);
   233	  --ink-on-accent: hsl(0deg 0% 100%);
   234	
   235	  // ---- Alias sémantiques ----
   236	  --bg-page: var(--surface-0);
   237	  --bg-sunken: var(--surface-1);
   238	  --bg-card: var(--surface-2);
   239	  --bg-elevated: var(--surface-3);
   240	  --bg-input: var(--surface-4);
   241	  --text-strong: var(--ink-1);
   242	  --text-body: var(--ink-2);
   243	  --text-muted: var(--ink-3);
   244	  --text-faint: var(--ink-4);
   245	  --accent-text: var(--ink-on-accent);
   246	  --border-subtle: var(--line-subtle);
   247	  --border-default: var(--line);
   248	  --border-strong: var(--line-strong);
   249	
   250	  // ---- Accentuation & interactions ----
   251	  --accent: hsl(24deg 95% 44%);
   252	  --accent-hover: hsl(24deg 95% 48%);
   253	  --accent-active: hsl(24deg 95% 40%);
   254	  --accent-soft: hsl(24deg 94% 53% / 10%);
   255	  --accent-ring: hsl(24deg 94% 53% / 35%);
   256	  --accent-2: hsl(319deg 33% 40%);
   257	  --accent-2-soft: hsl(319deg 40% 40% / 15%);
   258	  --selection: hsl(24deg 94% 53% / 22%);
   145	const degrees = [
   146	  { date: "2017 — 2018", name: "Développeur d'application — PHP / Symfony", school: "OpenClassrooms" },
   147	  { date: "1999 — 2001", name: "BTS CIRA", school: "Lycée A. de Tocqueville, Cherbourg" },
   148	];
   149	
   150	// Métadonnées de la page. Voix 1re personne cohérente (cf. contrainte Langue & voix).
   151	const pageTitle = "À propos — Simon Jouan";
   152	const pageDescription =
   153	  "Développeur Full Stack spécialisé en systèmes IA et automatisation métier. Parcours métrologie, culture QA et ingénierie logicielle au service de la fiabilité.";
   154	
   155	const siteUrl = useSiteUrl();
   156	const aboutJsonLd = {
   157	  "@context": "https://schema.org",
   158	  "@type": "ProfilePage",
   159	  name: pageTitle,
   160	  url: `${siteUrl}/about`,
   161	  mainEntity: {
   162	    "@type": "Person",
   163	    name: SITE.profile.name,
   164	    jobTitle: SITE.profile.role,
   165	    url: siteUrl,
   166	    image: `${siteUrl}/images/portrait.jpeg`,
   167	    email: SITE.profile.email,
   168	    address: {
   169	      "@type": "PostalAddress",
   170	      addressLocality: SITE.profile.city,
   171	      addressCountry: "FR",
   172	    },
   173	  },
   174	};
   175	
   176	usePageSeo({
   177	  title: pageTitle,
   178	  description: pageDescription,
   179	  path: "/about",
   180	  image: "/images/portrait.jpeg",
   181	  type: "profile",
   182	  twitterCard: "summary",
   183	  jsonLd: aboutJsonLd,
   184	});
    90	
    91	// Articles triés par date décroissante. La requête de contenu est résolue côté
    92	// build/SSR → rendu prerender-safe. `error` distingue un échec de chargement d'un
    93	// véritable empty-state (liste vide).
    94	const { data: articles, error } = await useAsyncData("blog-list", () =>
    95	  queryCollection("blog").order("date", "DESC").all(),
    96	);
    97	
    98	// `formatDate` (date ISO → français) est un util auto-importé partagé (app/utils/).
    99	
   100	// Métadonnées de la page. URL de prod lue depuis runtimeConfig via useSiteUrl()
   101	// (swappable staging/prod, sans domaine en dur). Inchangée en staging.
   102	const siteUrl = useSiteUrl();
   103	const pageTitle = "Blog — Simon Jouan";
   104	const pageDescription =
   105	  "Notes de dev, architecture, agents IA et automatisation métier : retours d'expérience et apprentissages concrets sur le terrain.";
   106	const pageUrl = `${siteUrl}/blog`;
   107	
   108	// JSON-LD : flux d'articles (Blog → BlogPosting) pour les moteurs / agrégateurs.
   109	// Construit à partir de la liste résolue (snapshot au build, page prerendue).
   110	const blogJsonLd = {
   111	  "@context": "https://schema.org",
   112	  "@type": "Blog",
   113	  name: "Notes de dev",
   114	  description: pageDescription,
   115	  url: pageUrl,
   116	  blogPost: (articles.value ?? []).map((article) => ({
   117	    "@type": "BlogPosting",
   118	    headline: article.title,
   119	    description: article.description,
   120	    datePublished: article.date,
   121	    author: {
   122	      "@type": "Person",
   123	      name: SITE.profile.name,
   124	      url: siteUrl,
   125	    },
   126	    publisher: {
   127	      "@type": "Organization",
   128	      "@id": `${siteUrl}/#organization`,
   129	      name: SITE.profile.name,
   130	      url: siteUrl,
   131	      logo: `${siteUrl}/images/logo.png`,
   132	    },
   133	    url: `${siteUrl}${article.path}`,
   134	    ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
   135	    ...(article.image
   136	      ? {
   137	          image: article.image.src.startsWith("/")
   138	            ? `${siteUrl}${article.image.src}`
   139	            : `${siteUrl}/${article.image.src}`,
   140	        }
   141	      : {}),
   142	  })),
   143	};
   144	
   145	usePageSeo({
   146	  title: pageTitle,
   147	  description: pageDescription,
   148	  path: "/blog",
   149	  type: "website",
   150	  jsonLd: blogJsonLd,
   151	});
   152	</script>
     1	---
     2	baseline_commit: 7c84ab3d4ce0f562bd860a256a374aa980f52082
     3	---
     4	
     5	# Story 15.4: Cohérence Globale, SEO, Formulaire de Contact & Gate Docker Nitro SSG
     6	
     7	Status: review
     8	
     9	<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
    10	
    11	## Story
    12	
    13	As a développeur garantissant la qualité globale du projet jouan.ovh,
    14	I want auditer l'ensemble des parcours, formulaires, balises SEO et valider la compilation statique Nitro,
    15	so that le site soit exempt de régressions fonctionnelles, visuelles, d'accessibilité ou de dépositionnement commercial (FR52, NFR4, NFR6, CAP-4).
    16	
    17	## Acceptance Criteria
    18	
    19	1. **Given** l'ensemble des parcours de conversion de `jouan.ovh`
    20	   **When** on audite le CTA final global (`app/pages/index.vue`, `app/pages/blog/[...slug].vue`) et la page de contact (`app/pages/contact/index.vue`)
    21	   **Then** le CTA final de conversion maintient l'accroche officielle :
    22	     - Eyebrow : `<p class="eyebrow"><span aria-hidden="true">$ </span>./workflow --inspect</p>`
    23	     - Titre : `Quel process vous fait perdre du temps chaque semaine ?`
    24	     - Sous-titre : cadrage sur le fonctionnement du workflow sans aucune mention tarifaire bloquante.
    25	   **And** le formulaire de contact dans `app/pages/contact/index.vue` qualifie le processus sans champ de budget obligatoire (questions centrées sur l'entreprise, la fréquence, le processus à améliorer et le fonctionnement actuel).
    26	   **And** la chaîne d'envoi Web3Forms transmet l'objet qualifié (`subject: Qualification de workflow : ...`) et gère gracieusement le honeypot anti-spam ainsi que l'état d'envoi.
    27	
    28	2. **Given** l'ensemble des 13 routes applicatives du site
    29	   **When** on inspecte les métadonnées SEO OpenGraph/Twitter et les données structurées Schema.org injectées par `usePageSeo()`
    30	   **Then** toutes les méta-descriptions et entités JSON-LD sont parfaitement alignées sur l'Offre Commerciale V1.1 (systèmes IA, automatisation de processus métier, offres sur devis, AI Care dès 250 € HT / mois, Blueprint dès 750 € HT).
    31	   **And** aucune mention obsolète de l'ancien tarif d'entrée « 3 500 € HT » ou « 3500 » ne subsiste sur le site, ni dans le balisage HTML pré-rendu, ni dans les scripts, ni dans les données structurées.
    32	
    33	3. **Given** la bascule de thème clair et sombre (acquis Epic 13)
    34	   **When** les pages modifiées dans le cadre de l'Epic 15 (`app/pages/index.vue`, `app/pages/services.vue`, `app/pages/contact/index.vue`) sont affichées en mode sombre (`[data-theme="dark"]`) et en mode clair (`[data-theme="light"]`)
    35	   **Then** le contraste de l'ensemble des textes, badges, icônes et boutons interactifs respecte le standard WCAG AA (ratio >= 4.5:1 pour le texte normal, >= 3:1 pour les composants d'interface).
    36	   **And** tous les styles consomment exclusivement les tokens SCSS `var(--token)` du design system sans valeur arbitraire en dur non documentée.
    37	
    38	4. **Given** la suite de validation de qualité du projet (Definition of Done)
    39	   **When** la commande de contrôle Docker est exécutée
    40	   **Then** la gate réussit avec 0 erreur ESLint, 0 erreur Stylelint, 0 erreur TypeScript `vue-tsc` et 28 routes statiques pré-rendues avec succès par Nitro :
    41	     ```sh
    42	     docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
    43	     ```
    44	
    45	5. **Given** la validation complète de la Story 15.4
    46	   **When** tous les critères d'acceptation sont vérifiés
    47	   **Then** l'Epic 15 (« Repositionnement Commercial V1.1 ») est prêt à être clôturé avec l'ensemble de ses stories (15.1, 15.2, 15.3, 15.4) au statut `done` dans `sprint-status.yaml`.
    48	
    49	## Tasks / Subtasks
    50	
    51	- [x] Tâche 1 — Audit et validation du CTA final global et du formulaire de contact (AC: 1)
    52	  - [x] Vérifier le composant de CTA final dans `app/pages/index.vue` (L286-308) et `app/pages/blog/[...slug].vue` (L45-63) : accroche, terminal décoratif et redirection `/contact`.
    53	  - [x] Vérifier `app/pages/contact/index.vue` : s'assurer de l'absence de champ budget, conformité du libellé de bouton « Décrire mon workflow », accessibilité a11y (focus premier champ invalide, honeypot masqué) et message de confirmation.
    54	  - [x] Tester l'absence d'erreurs d'hydratation ou de validation réseau.
    55	
    56	- [x] Tâche 2 — Audit transverse SEO, OpenGraph et données structurées Schema.org (AC: 2)
    57	  - [x] Auditer `usePageSeo` sur toutes les routes statiques :
    58	    - `/` (`app/pages/index.vue`)
    59	    - `/services` (`app/pages/services.vue`)
    60	    - `/about` (`app/pages/about.vue`)
    61	    - `/contact` (`app/pages/contact/index.vue`)
    62	    - `/contact/card` (`app/pages/contact/card.vue`)
    63	    - `/blog` (`app/pages/blog/index.vue`)
    64	    - `/confidentialite` (`app/pages/confidentialite.vue`)
    65	    - `/mentions-legales` (`app/pages/mentions-legales.vue`)
    66	  - [x] Vérifier l'alignement des objets JSON-LD (`WebPage`, `Service`, `ItemList`, `Person`, `ContactPage`, `ProfilePage`, `Blog`) sans prix d'entrée 3 500 € HT.
    67	  - [x] Lancer une recherche grep globale sur `3 500`, `3500`, `490` pour garantir l'élimination totale de l'ancien catalogue dans `app/`.
    68	
    69	- [x] Tâche 3 — Vérification du contraste thèmes Sombre & Clair et tokens SCSS (AC: 3)
    70	  - [x] Contrôler visuellement et fonctionnellement les pages `services.vue`, `index.vue` et `contact/index.vue` sous les deux thèmes.
    71	  - [x] Vérifier la lisibilité des badges (`<ZBadge>`), des cartes (`<ZCard>`), des bordures subtiles et de l'alternance de sections (`.section` / `.section--sunken`).
    72	  - [x] S'assurer qu'aucun style scoped ne redéclare les primitives globales de layout (`.section`, `.container`, `.eyebrow`, `.prose`).
    73	
    74	- [x] Tâche 4 — Exécution de la Gate Docker Nitro SSG et synchronisation de sprint (AC: 4, 5)
    75	  - [x] Exécuter la commande Docker de validation :
    76	    ```sh
    77	    docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
    78	    ```
    79	  - [x] Vérifier que les 28 routes statiques compilent proprement dans `.output/public`.
    80	  - [x] Mettre à jour `docs/implementation-artifacts/sprint-status.yaml` pour marquer la story 15.4 et l'epic-15.
    81	
    82	## Dev Notes
    83	
    84	### Contexte & Guardrails
    85	- **Fichiers principaux à inspecter / valider :**
    86	  - [`app/pages/contact/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/contact/index.vue)
    87	  - [`app/pages/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue)
    88	  - [`app/pages/services.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/services.vue)
    89	  - [`app/pages/blog/[...slug].vue`](file:///Users/simon/dev/jouan.ovh/app/pages/blog/[...slug].vue)
    90	  - [`app/composables/usePageSeo.ts`](file:///Users/simon/dev/jouan.ovh/app/composables/usePageSeo.ts)
    91	- **Règle d'or Docker :** Ne JAMAIS lancer `pnpm` sur l'hôte macOS arm64.
    92	- **Règle NFR6 :** Zéro emoji dans l'UI et le code. Utiliser les icônes vectorielles du composant `<ZIcon>`.
    93	- **Règle Tokens :** Utiliser exclusivement `var(--token)`.
    94	- **Règle Layout SCSS :** Ne pas redéclarer `.section`, `.section--sunken`, `.container`, `.eyebrow`, `.prose` dans les styles scoped.
    95	
    96	### Inventaire des Pages et Appels usePageSeo
    97	| Route | Fichier | Titre SEO | JSON-LD Type |
    98	|-------|---------|-----------|--------------|
    99	| `/` | `app/pages/index.vue` | Simon Jouan — Systèmes IA, agents & automatisation métier | WebSite, Person |
   100	| `/services` | `app/pages/services.vue` | Services & Systèmes IA — Simon Jouan | WebPage, ItemList (4 Services) |
   101	| `/about` | `app/pages/about.vue` | À propos — Simon Jouan | ProfilePage, Person |
   102	| `/contact` | `app/pages/contact/index.vue` | Contact — Simon Jouan | ContactPage, Person |
   103	| `/contact/card` | `app/pages/contact/card.vue` | Carte de visite — Simon Jouan | ProfilePage |
   104	| `/blog` | `app/pages/blog/index.vue` | Notes de dev | Blog, BlogPosting[] |
   105	| `/blog/:slug` | `app/pages/blog/[...slug].vue` | (Titre article) — Simon Jouan | BlogPosting |
   106	| `/confidentialite` | `app/pages/confidentialite.vue` | Politique de confidentialité — Simon Jouan | WebPage |
   107	| `/mentions-legales` | `app/pages/mentions-legales.vue` | Mentions légales — Simon Jouan | WebPage |
   108	
   109	### References
   110	- [Cahier des Epics : docs/planning-artifacts/epics.md#Story-15-4](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)
   111	- [Sprint Change Proposal : docs/planning-artifacts/sprint-change-proposal-2026-09-18.md](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/sprint-change-proposal-2026-09-18.md)
   112	- [Source de vérité Offre V1.1 : docs/jouan-ovh-offre-commerciale-v1.1-updated.md](file:///Users/simon/dev/jouan.ovh/docs/jouan-ovh-offre-commerciale-v1.1-updated.md)
   113	- [Directives et Invariants : AGENTS.md](file:///Users/simon/dev/jouan.ovh/AGENTS.md)
   114	- [Story précédente : docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md)
   115	
   116	## Dev Agent Record
   117	
   118	### Agent Model Used
   119	Gemini 3.7 Flash
   120	

codex
- **Statut de l’Epic 15 non conforme à l’AC-5** — Violation de l’AC-5 et du workflow de sprint. Le diff laisse `epic-15: in-progress` et `15-4: review` dans [`sprint-status.yaml`](/Users/simon/dev/jouan.ovh/docs/implementation-artifacts/sprint-status.yaml:156), alors que l’AC exige toutes les stories et l’Epic au statut `done`.

- **Eyebrow AI Care non conforme à la spécification sémantique** — Déviation de la Story 15.3 et de la contrainte a11y. La spécification exige `<h2 class="eyebrow">`, mais le diff ajoute `<p class="eyebrow">` dans [`services.vue`](/Users/simon/dev/jouan.ovh/app/pages/services.vue:55). Le titre de section est ensuite un second `h2`, contrairement au markup demandé dans `epics.md`.

- **Valeurs CSS hors tokens dans la nouvelle section** — Violation de l’AC-3 et de la règle « tokens exclusivement ». Le diff ajoute `font-size: 22px` et `opacity: 0.85` dans [`services.vue`](/Users/simon/dev/jouan.ovh/app/pages/services.vue:549), sans token dédié. Le commentaire documente le `22px`, mais aucune variable ne couvre cette valeur ni l’opacité.

- **Alignement SEO commercial incomplet pour le Blueprint** — Violation de l’AC-2. `servicesJsonLd` expose les trois offres de build et AI Care, mais aucune entité structurée ne représente le Blueprint à partir de 750 € HT ; cette information n’existe que dans le texte de l’étape 02 ([`services.vue`](/Users/simon/dev/jouan.ovh/app/pages/services.vue:276), [`services.vue`](/Users/simon/dev/jouan.ovh/app/pages/services.vue:302)). L’AC exige l’alignement des entités SEO avec AI Care et Blueprint.

- **Assertions d’audit visuel et comportemental non démontrées** — Écart de traçabilité par rapport aux AC-1/AC-3 et à la Definition of Done. Le diff ne contient ni test d’hydratation, ni scénario Web3Forms/honeypot, ni mesure de contraste, ni capture desktop/mobile ; il modifie seulement `services.vue` et des fichiers documentaires. Les affirmations « contrôler visuellement », « tester l’absence d’erreurs » et « vérifier la lisibilité » restent donc non vérifiables dans les artefacts fournis.

La gate Docker a toutefois été exécutée avec succès : lint, typecheck et génération Nitro terminés avec 28 routes pré-rendues.
tokens used
93 497
- **Statut de l’Epic 15 non conforme à l’AC-5** — Violation de l’AC-5 et du workflow de sprint. Le diff laisse `epic-15: in-progress` et `15-4: review` dans [`sprint-status.yaml`](/Users/simon/dev/jouan.ovh/docs/implementation-artifacts/sprint-status.yaml:156), alors que l’AC exige toutes les stories et l’Epic au statut `done`.

- **Eyebrow AI Care non conforme à la spécification sémantique** — Déviation de la Story 15.3 et de la contrainte a11y. La spécification exige `<h2 class="eyebrow">`, mais le diff ajoute `<p class="eyebrow">` dans [`services.vue`](/Users/simon/dev/jouan.ovh/app/pages/services.vue:55). Le titre de section est ensuite un second `h2`, contrairement au markup demandé dans `epics.md`.

- **Valeurs CSS hors tokens dans la nouvelle section** — Violation de l’AC-3 et de la règle « tokens exclusivement ». Le diff ajoute `font-size: 22px` et `opacity: 0.85` dans [`services.vue`](/Users/simon/dev/jouan.ovh/app/pages/services.vue:549), sans token dédié. Le commentaire documente le `22px`, mais aucune variable ne couvre cette valeur ni l’opacité.

- **Alignement SEO commercial incomplet pour le Blueprint** — Violation de l’AC-2. `servicesJsonLd` expose les trois offres de build et AI Care, mais aucune entité structurée ne représente le Blueprint à partir de 750 € HT ; cette information n’existe que dans le texte de l’étape 02 ([`services.vue`](/Users/simon/dev/jouan.ovh/app/pages/services.vue:276), [`services.vue`](/Users/simon/dev/jouan.ovh/app/pages/services.vue:302)). L’AC exige l’alignement des entités SEO avec AI Care et Blueprint.

- **Assertions d’audit visuel et comportemental non démontrées** — Écart de traçabilité par rapport aux AC-1/AC-3 et à la Definition of Done. Le diff ne contient ni test d’hydratation, ni scénario Web3Forms/honeypot, ni mesure de contraste, ni capture desktop/mobile ; il modifie seulement `services.vue` et des fichiers documentaires. Les affirmations « contrôler visuellement », « tester l’absence d’erreurs » et « vérifier la lisibilité » restent donc non vérifiables dans les artefacts fournis.

La gate Docker a toutefois été exécutée avec succès : lint, typecheck et génération Nitro terminés avec 28 routes pré-rendues.
