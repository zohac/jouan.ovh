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
session id: 01a0b63f-9604-7fb1-a133-793caaf3946c
--------
user
# Acceptance Auditor Prompt — Story 15.3

You are an Acceptance Auditor. Review the diff in `docs/implementation-artifacts/code-reviews/15-3/full.diff` against the story and context specifications:

- Story: `docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md`
- Context:
  - `AGENTS.md` (Standards UI, SCSS tokens, zero emoji, a11y, layout, Docker rule)
  - `docs/project-context.md`
  - `docs/jouan-ovh-offre-commerciale-v1.1-updated.md`
  - `docs/implementation-artifacts/deferred-work.md`

Check for:
- Violations of acceptance criteria (AC-1, AC-2, AC-3, AC-4, AC-5)
- Deviations from spec intent (Offre Commerciale V1.1)
- Missing implementation of specified behavior
- Inconsistencies or visual regressions in design system and typography
- Contradictions between spec constraints and actual code

Output findings as a Markdown list. Each finding must include:
- A one-line title
- Which AC or architectural constraint it violates
- Evidence from the diff and references

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
Je vais auditer le diff contre la story, les règles projet et l’offre V1.1, puis vérifier chaque finding directement dans le code concerné pour éviter les faux positifs. J’utilise le skill de revue de code du projet, car la demande est un audit adversarial d’acceptation.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/bmad-code-review/SKILL.md && printf '\\n---FILES---\\n' && sed -n '1,260p' docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md && printf '\\n---DIFF HEAD---\\n' && sed -n '1,320p' docs/implementation-artifacts/code-reviews/15-3/full.diff" in /Users/simon/dev/jouan.ovh
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

---FILES---
---
baseline_commit: 7162f14595e42399d234c534fd88d78a7360cbb8
---

# Story 15.3: Page Services — Section Dédiée AI Care Après Mise en Production & Process 4 Étapes

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a client ayant déployé ou envisageant de déployer un système,
I want comprendre comment Simon garantit la fiabilité, la supervision et la maintenance de la capacité dans la durée,
so that mon investissement reste opérationnel, adapté aux évolutions d'APIs et maîtrisé en coûts (FR51, CAP-3).

## Acceptance Criteria

1. **Given** la route `/services` (`app/pages/services.vue`)
   **When** le visiteur fait défiler la page sous la grille des 3 offres de build
   **Then** une section autonome dédiée à l'exploitation post-déploiement est insérée avant le process :
     - Classe de section : `<section class="section section--sunken care-section">`
     - Eyebrow : `<p class="eyebrow"><span aria-hidden="true">// </span>après la mise en production</p>`
     - Titre de section : `<h2 class="care-section__title">Le système doit continuer à fonctionner.</h2>`
     - Paragraphe d'introduction :
       > *« Une automatisation utile doit continuer à fonctionner après sa mise en production. AI Care couvre le maintien en condition opérationnelle du système : monitoring, maintenance, support, suivi des coûts et adaptations mineures liées aux APIs ou aux modèles. »*
     - Carte dédiée `<ZCard>` pour l'offre AI Care :
       - Badge : `MAINTIEN EN CONDITION OPÉRATIONNELLE` (affiché via `<ZBadge tone="neutral">`)
       - Titre : `AI Care`
       - Icône : `bot` (`<ZIcon name="bot" />`)
       - Prix : `À partir de 250 € HT / mois` (dans `.care-card__price`, plancher de maintenance pour système simple)
       - Livrables clés (liste sémantique `<ul>` + `<li>`) :
         - `Monitoring proactif, détection d'erreurs & alertes d'anomalies`
         - `Maintenance corrective & adaptation aux évolutions d'APIs tierces`
         - `Suivi fin de consommation des tokens & ajustements de prompts`
         - `Support technique réactif & veille sur les nouveaux modèles`
         - `Mesure factuelle des KPI et optimisation continue du flux`
       - Clause de transparence / disclaimer :
         > *« Consommations tierces d'APIs et tokens (LLM, OCR, scraping...) refacturées au réel ou prises en charge directement par le client. Pas d'engagement imposé au build. »*
       - Bouton CTA : `<ZButton>` pointant vers `/contact` avec `:aria-label="Découvrir l'accompagnement AI Care"` et libellé `Découvrir AI Care` (variante `secondary`)
       - Ancre HTML : `id="ai-care"` avec `scroll-margin-top: var(--space-16)`

2. **Given** la section process (`.process`) dans `app/pages/services.vue`
   **When** le visiteur consulte les 4 étapes
   **Then** les données de `steps` sont mises à jour conformément à l'Offre Commerciale V1.1 (Sections 8 et 15) :
     1. **01 — Diagnostic :**
        - Titre : `Diagnostic`
        - Description : `Échange gratuit de 20 à 30 minutes pour qualifier le problème, comprendre le workflow existant, ses volumes, ses outils et identifier la friction réelle.`
        - Inline CTA : `Identifier un workflow →` pointant vers `/contact`
     2. **02 — Cadrage :**
        - Titre : `Cadrage`
        - Description : `Définir la cible, ce qui doit être automatisé, ce qui reste humain et comment mesurer le résultat. Pour les sujets complexes, un Blueprint facturable (à partir de 750 € HT) peut être proposé lorsque le cadrage nécessite un travail approfondi avant devis.` (Résolution de la dette différée Story 15.2)
     3. **03 — Construction & intégration :**
        - Titre : `Construction & intégration`
        - Description : `Développer uniquement le niveau de système nécessaire (automatisation ciblée, workflow métier ou application sur mesure) et le tester sur des cas réels avant livraison.`
     4. **04 — Exploitation & mesure :**
        - Titre : `Exploitation & mesure` (remplace l'ancien libellé `Suivi & amélioration`)
        - Description : `Mise en production, mesure initiale de performance et maintien en condition opérationnelle lorsque le workflow le justifie (via AI Care).`

3. **Given** l'organisation visuelle et le Design System
   **When** la page est rendue en mode sombre ou en mode clair
   **Then** l'alternance des sections assure un rythme visuel naturel :
     - Build : `.section` (fond base)
     - AI Care : `.section.section--sunken` (fond sunken discret)
     - Process 4 étapes : `.section` (fond base)
   **And** aucun style ne comporte de couleur, marge ou rayon en dur (utilisation stricte des tokens `var(--token)`).
   **And** aucun emoji n'est présent dans les textes ou composants (NFR6).

4. **Given** les données structurées Schema.org (`servicesJsonLd`) et le référencement
   **When** la page est générée en statique (`pnpm generate`)
   **Then** l'offre `AI Care` est intégrée à `servicesJsonLd` dans l'ItemList (avec son prix `À partir de 250 € HT / mois` et son ancre `url: "${siteUrl}/services#ai-care"`).
   **And** les offres de build existantes reçoivent également leur champ `url` pointant vers `#automatisation`, `#workflow`, `#sur-mesure` (résolution de la dette différée Schema.org de la Story 15.2).

5. **Given** les exigences de qualité et de non-régression
   **When** la suite de validation Docker est exécutée
   **Then** elle réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript vue-tsc et 28 routes statiques pré-rendues :
     ```sh
     docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
     ```

## Tasks / Subtasks

- [x] Tâche 1 — Création de la section dédiée « AI Care » dans `app/pages/services.vue` (AC: 1, 3)
  - [x] Structurer la section avec `.section.section--sunken.care-section` insérée entre la grille de build et la section process.
  - [x] Insérer l'eyebrow standard `<p class="eyebrow"><span aria-hidden="true">// </span>après la mise en production</p>`.
  - [x] Insérer le titre `h2.care-section__title` : `Le système doit continuer à fonctionner.`
  - [x] Rédiger le texte de cadrage d'exploitation en 2 phrases (prose).
  - [x] Intégrer une carte `<ZCard>` dédiée (ou layout horizontal adapté) avec badge `MAINTIEN EN CONDITION OPÉRATIONNELLE`, icône `bot`, prix `À partir de 250 € HT / mois`, les 5 points de livrables et le disclaimer des consommations tierces d'APIs/tokens.
  - [x] Ajouter le bouton `<ZButton>` vers `/contact` avec `:aria-label="careOffer.ctaAriaLabel"`.
  - [x] Configurer l'ancre `id="ai-care"` et la règle `scroll-margin-top: var(--space-16)`.

- [x] Tâche 2 — Réalignement des 4 étapes du process et intégration Blueprint (AC: 2)
  - [x] Mettre à jour l'étape `01` : Diagnostic gratuit 20 à 30 min.
  - [x] Mettre à jour l'étape `02` : Cadrage avec mention explicite du Blueprint facturable optionnel à partir de 750 € HT pour sujets complexes.
  - [x] Mettre à jour l'étape `03` : Construction & intégration centrée sur le bon niveau de système.
  - [x] Mettre à jour l'étape `04` : Renommer en `Exploitation & mesure` avec mention de la transition vers AI Care.
  - [x] Marquer comme résolu le point de dette différé correspondant dans `docs/implementation-artifacts/deferred-work.md`.

- [x] Tâche 3 — Intégration SCSS, tokens et responsive (AC: 1, 3)
  - [x] Déclarer les styles scoped de la carte AI Care dans `app/pages/services.vue` en utilisant exclusivement les tokens de spacing, border, typography et color.
  - [x] S'assurer d'un rendu soigné en desktop et mobile (< 900px).
  - [x] Tester le contraste et l'alternance visuelle sur les thèmes sombre et clair.

- [x] Tâche 4 — Synchronisation Schema.org JSON-LD (AC: 4)
  - [x] Ajouter AI Care dans l'objet `servicesJsonLd` comme service d'exploitation (`@type: "Service"`).
  - [x] Enrichir les 3 services de build avec leur attribut `url` (`${siteUrl}/services#${offer.id}`, etc.).
  - [x] Marquer comme résolu le point de dette différé Schema.org dans `docs/implementation-artifacts/deferred-work.md`.

- [x] Tâche 5 — Validation transverse, accessibilité et Gate Docker Nitro SSG (AC: 5)
  - [x] Vérifier la navigation clavier, le focus visible et les attributs ARIA des nouveaux éléments interactifs.
  - [x] Exécuter la commande de validation Docker :
    ```sh
    docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
    ```
  - [x] Vérifier que les 28 routes statiques compilent sans erreur.

## Dev Notes

### Contexte & Guardrails
- **Fichier principal à modifier :** [`app/pages/services.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/services.vue).
- **Fichier de suivi de dette :** [`docs/implementation-artifacts/deferred-work.md`](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/deferred-work.md).
- **Règle d'or Docker :** Ne JAMAIS lancer `pnpm` sur l'hôte macOS arm64.
- **Règle NFR6 :** Zéro emoji dans l'UI et le code. Utiliser les icônes vectorielles du composant `<ZIcon>`.
- **Règle Tokens :** Utiliser exclusivement `var(--token)`.
- **Règle Layout SCSS :** Ne pas redéclarer `.section`, `.section--sunken`, `.container`, `.eyebrow`, `.prose` dans le `<style scoped>`.
- **Nuxt 4 Gotcha :** Conserver l'import explicite `import { NuxtLink } from "#components"` pour `:as="NuxtLink"`.

### Données Officielles V1.1 pour AI Care
```typescript
interface CareOffer {
  id: string;
  badge: string;
  title: string;
  price: string;
  desc: string;
  points: string[];
  disclaimer: string;
  ctaText: string;
  ctaAriaLabel: string;
}

const careOffer: CareOffer = {
  id: "ai-care",
  badge: "MAINTIEN EN CONDITION OPÉRATIONNELLE",
  title: "AI Care",
  price: "À partir de 250 € HT / mois",
  desc: "Pour les systèmes qui ont besoin d'être exploités, surveillés et adaptés dans la durée.",
  points: [
    "Monitoring proactif, détection d'erreurs & alertes d'anomalies",
    "Maintenance corrective & adaptation aux évolutions d'APIs tierces",
    "Suivi fin de consommation des tokens & ajustements de prompts",
    "Support technique réactif & veille sur les nouveaux modèles",
    "Mesure factuelle des KPI et optimisation continue du flux",
  ],
  disclaimer:
    "Consommations tierces d'APIs et tokens (LLM, OCR, scraping...) refacturées au réel ou prises en charge directement par le client. Pas d'engagement imposé au build.",
  ctaText: "Découvrir AI Care",
  ctaAriaLabel: "Découvrir l'accompagnement AI Care",
};
```

### Données Officielles V1.1 pour les 4 Étapes de Process
```typescript
const steps: Step[] = [
  {
    n: "01",
    title: "Diagnostic",
    desc: "Échange gratuit de 20 à 30 minutes pour qualifier le problème, comprendre le workflow existant, ses volumes, ses outils et identifier la friction réelle.",
    inlineCta: {
      to: "/contact",
      label: "Identifier un workflow →",
    },
  },
  {
    n: "02",
    title: "Cadrage",
    desc: "Définir la cible, ce qui doit être automatisé, ce qui reste humain et comment mesurer le résultat. Pour les sujets complexes, un Blueprint facturable (à partir de 750 € HT) peut être proposé lorsque le cadrage nécessite un travail approfondi avant devis.",
  },
  {
    n: "03",
    title: "Construction & intégration",
    desc: "Développer uniquement le niveau de système nécessaire (automatisation ciblée, workflow métier ou application sur mesure) et le tester sur des cas réels avant livraison.",
  },
  {
    n: "04",
    title: "Exploitation & mesure",
    desc: "Mise en production, mesure initiale de performance et maintien en condition opérationnelle lorsque le workflow le justifie (via AI Care).",
  },
];
```

### References
- [Cahier des Epics : docs/planning-artifacts/epics.md#Story-15-3](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)
- [Source de vérité Offre V1.1 : docs/jouan-ovh-offre-commerciale-v1.1-updated.md#Section-14](file:///Users/simon/dev/jouan.ovh/docs/jouan-ovh-offre-commerciale-v1.1-updated.md)
- [Dette différée : docs/implementation-artifacts/deferred-work.md](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/deferred-work.md)
- [Story précédente : docs/implementation-artifacts/15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint.md](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint.md)

## Dev Agent Record

### Agent Model Used
- Gemini 3.7 Flash

### Debug Log References
- `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> Gate 100% verte (0 erreurs lint, 0 erreurs types, 28 routes statiques pré-rendues).

### Completion Notes List
- Création de la section dédiée AI Care (`.section.section--sunken.care-section`) dans `app/pages/services.vue` avec titre, prose de cadrage, badge « MAINTIEN EN CONDITION OPÉRATIONNELLE », icône `bot`, prix « À partir de 250 € HT / mois », 5 livrables et clause de transparence.
- Réalignement des 4 étapes du process avec mention du Blueprint facturable (à partir de 750 € HT) pour l'étape 02 Cadrage et renommage de l'étape 04 en « Exploitation & mesure » avec mention de transition vers AI Care.
- Alternance visuelle des sections en 3 temps : Build (`.section`), AI Care (`.section.section--sunken`), Process (`.section`).
- Synchronisation complète de Schema.org `servicesJsonLd` avec ajout d'AI Care et des attributs `url` pour les 4 offres.
- Résolution des deux dettes techniques différées de la story 15.2 dans `docs/implementation-artifacts/deferred-work.md`.

### File List
- `app/pages/services.vue` (modifié)
- `docs/implementation-artifacts/deferred-work.md` (modifié)
- `docs/implementation-artifacts/sprint-status.yaml` (modifié)
- `docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md` (modifié)

---DIFF HEAD---
diff --git a/app/pages/services.vue b/app/pages/services.vue
index 0c6e1e1..13111e5 100644
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
 
@@ -399,6 +504,144 @@ usePageSeo({
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

exec
/bin/zsh -lc "cat /Users/simon/.codex/skills/bmad-code-review/steps/step-01-gather-context.md && printf '\\n---CUSTOMIZE---\\n' && python3 _bmad/scripts/resolve_customization.py --skill /Users/simon/.codex/skills/bmad-code-review --key workflow && printf '\\n---DIFF REST---\\n' && sed -n '321,760p' docs/implementation-artifacts/code-reviews/15-3/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
diff_output: '' # set at runtime
spec_file: '' # set at runtime (path or empty)
review_mode: '' # set at runtime: "full" or "no-spec"
story_key: '' # set at runtime when discovered from sprint status
---

# Step 1: Gather Context

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- The prompt that triggered this workflow IS the intent — not a hint.
- Do not modify any files. This step is read-only.

## INSTRUCTIONS

1. **Find the review target.** The conversation context before this skill was triggered IS your starting point — not a blank slate. Check in this order — stop as soon as the review target is identified:

   **Tier 1 — Explicit argument.**
   Did the user pass a PR, commit SHA, branch, spec file, or diff source this message?
   - PR reference → resolve to branch/commit via `gh pr view`. If resolution fails, ask for a SHA or branch.
   - Commit or branch → use directly.
   - Spec file → set `{spec_file}` to the provided path. Check its frontmatter for `baseline_commit`. If found, use as diff baseline. If not found, continue the cascade (a spec alone does not identify a diff source).
   - Also scan the argument for diff-mode keywords that narrow the scope:
     - "staged" / "staged changes" → Staged changes only
     - "uncommitted" / "working tree" / "all changes" → Uncommitted changes (staged + unstaged)
     - "branch diff" / "vs main" / "against main" / "compared to <branch>" → Branch diff (extract base branch if mentioned)
     - "commit range" / "last N commits" / "<from-sha>..<to-sha>" → Specific commit range
     - "this diff" / "provided diff" / "paste" → User-provided diff (do not match bare "diff" — it appears in other modes)
   - When multiple keywords match, prefer the most specific (e.g., "branch diff" over bare "diff").

   **Tier 2 — Recent conversation.**
   Do the last few messages reveal what the user wants to be reviewed? Look for spec paths, commit refs, branches, PRs, or descriptions of a change. Apply the same diff-mode keyword scan and routing as Tier 1.

   **Tier 3 — Sprint tracking.**
   Look for a sprint status file (`*sprint-status*`) in `{implementation_artifacts}` or `{planning_artifacts}`. If found, scan for stories with status `review`:
   - **Exactly one `review` story:** Set `{story_key}` to the story's key (e.g., `1-2-user-auth`). Suggest it: "I found story <story-id> in `review` status. Would you like to review its changes? [Y] Yes / [N] No, let me choose". If confirmed, use the story context to determine the diff source (branch name derived from story slug, or uncommitted changes). If declined, clear `{story_key}` and fall through.
   - **Multiple `review` stories:** Present them as numbered options alongside a manual choice option. Wait for user selection. If a story is selected, set `{story_key}` and use its context to determine the diff source. If manual choice is selected, clear `{story_key}` and fall through.
   - **None:** Fall through.

   **Tier 4 — Current git state.**
   If version control is unavailable, skip to Tier 5. Otherwise, check the current branch and HEAD. If the branch is not `main` (or the default branch), confirm: "I see HEAD is `<short-sha>` on `<branch>` — do you want to review this branch's changes?" If confirmed, treat as a branch diff against `main`. If declined, fall through.

   **Tier 5 — Ask.**
   Fall through to instruction 2.

   Never ask extra questions beyond what the cascade prescribes. If a tier above already identified the target, skip the remaining tiers and proceed to instruction 3 (construct diff).

2. HALT. Ask the user: **What do you want to review?** Present these options:
   - **Uncommitted changes** (staged + unstaged)
   - **Staged changes only**
   - **Branch diff** vs a base branch (ask which base branch)
   - **Specific commit range** (ask for the range)
   - **Provided diff or file list** (user pastes or provides a path)

3. Construct `{diff_output}` from the chosen source.
   - For **staged changes only**: run `git diff --cached`.
   - For **uncommitted changes** (staged + unstaged): run `git diff HEAD`.
   - For **branch diff**: verify the base branch exists before running `git diff`. If it does not exist, HALT and ask the user for a valid branch.
   - For **commit range**: verify the range resolves. If it does not, HALT and ask the user for a valid range.
   - For **provided diff**: validate the content is non-empty and parseable as a unified diff. If it is not parseable, HALT and ask the user to provide a valid diff.
   - For **file list**: validate each path exists in the working tree. Construct `{diff_output}` by running `git diff HEAD -- <path1> <path2> ...`. If any paths are untracked (new files not yet staged), use `git diff --no-index /dev/null <path>` to include them. If the diff is empty (files have no uncommitted changes and are not untracked), ask the user whether to review the full file contents or to specify a different baseline.
   - After constructing `{diff_output}`, verify it is non-empty regardless of source type. If empty, HALT and tell the user there is nothing to review.

4. **Set the spec context.**
   - If `{spec_file}` is already set (from Tier 1 or Tier 2): verify the file exists and is readable, then set `{review_mode}` = `"full"`.
   - Otherwise, ask the user: **Is there a spec or story file that provides context for these changes?**
     - If yes: set `{spec_file}` to the path provided, verify the file exists and is readable, then set `{review_mode}` = `"full"`.
     - If no: set `{review_mode}` = `"no-spec"`.

5. If `{review_mode}` = `"full"` and the file at `{spec_file}` has a `context` field in its frontmatter listing additional docs, load each referenced document. Warn the user about any docs that cannot be found.

6. Sanity check: if `{diff_output}` exceeds approximately 3000 lines, warn the user and offer to chunk the review by file group.
   - If the user opts to chunk: agree on the first group, narrow `{diff_output}` accordingly, and list the remaining groups for the user to note for follow-up runs.
   - If the user declines: proceed as-is with the full diff.

### CHECKPOINT

Present a summary before proceeding: diff stats (files changed, lines added/removed), `{review_mode}`, and loaded spec/context docs (if any). HALT and wait for user confirmation to proceed.

## NEXT

Read fully and follow `./step-02-review.md`

---CUSTOMIZE---
{
  "workflow": {
    "activation_steps_prepend": [],
    "activation_steps_append": [],
    "persistent_facts": [
      "file:{project-root}/**/project-context.md"
    ],
    "on_complete": "",
    "review_layers": [
      {
        "id": "blind-hunter",
        "name": "Blind Hunter",
        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> Invoke the `bmad-review-adversarial-general` skill on this diff:\n>\n> {diff_output}\n"
      },
      {
        "id": "edge-case-hunter",
        "name": "Edge Case Hunter",
        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> Invoke the `bmad-review-edge-case-hunter` skill on this diff:\n>\n> {diff_output}\n"
      },
      {
        "id": "verification-gap",
        "name": "Verification Gap Reviewer",
        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> Invoke the `bmad-review-verification-gap` skill on this diff:\n>\n> {diff_output}\n"
      },
      {
        "id": "acceptance-auditor",
        "name": "Acceptance Auditor",
        "when": "Only when {review_mode} = \"full\".",
        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> You are an Acceptance Auditor. Review the provided diff against `{spec_file}` and any loaded context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code. Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.\n>\n> Diff:\n> {diff_output}\n"
      }
    ]
  }
}

---DIFF REST---
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
@@ -482,5 +725,17 @@ usePageSeo({
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
index 3b2a14b..94bf1ef 100644
--- a/docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md
+++ b/docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md
@@ -4,7 +4,7 @@ baseline_commit: 7162f14595e42399d234c534fd88d78a7360cbb8
 
 # Story 15.3: Page Services — Section Dédiée AI Care Après Mise en Production & Process 4 Étapes
 
-Status: ready-for-dev
+Status: review
 
 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
 
@@ -80,39 +80,39 @@ so that mon investissement reste opérationnel, adapté aux évolutions d'APIs e
 
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
 
 ## Dev Notes
 
@@ -198,9 +198,20 @@ const steps: Step[] = [
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
index 0b0e021..03d7d64 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-18 (Story 15.3 prête pour le dev)"
+last_updated: "2026-09-18 (Story 15.3 terminée et prête pour review)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -157,7 +157,7 @@ development_status:
   epic-15: in-progress
   15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance: done
   15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint: done
-  15-3-page-services-section-dediee-ai-care-et-process-4-etapes: ready-for-dev
+  15-3-page-services-section-dediee-ai-care-et-process-4-etapes: review
   15-4-coherence-globale-seo-formulaire-contact-et-gate-docker: backlog
   epic-15-retrospective: optional
 

exec
/bin/zsh -lc "cat /Users/simon/.codex/skills/bmad-code-review/steps/step-02-review.md && printf '\\n---PROJECT CONTEXT---\\n' && sed -n '1,260p' docs/project-context.md && printf '\\n---OFFER RELEVANT---\\n' && rg -n -C 5 \"AI Care|mise en production|Diagnostic|Cadrage|Construction|Exploitation|Blueprint|250|750|services\" docs/jouan-ovh-offre-commerciale-v1.1-updated.md && printf '\\n---DEFERRED---\\n' && sed -n '1,100p' docs/implementation-artifacts/deferred-work.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
failed_layers: '' # set at runtime: comma-separated list of layers that failed or returned empty
---

# Step 2: Review

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- All review subagents must run at the same model capability as the current session.
- Run subagents synchronously: launch them together, then wait for all results before continuing.

## INSTRUCTIONS

1. The review layers are `{workflow.review_layers}`, resolved during activation.

2. For each layer in `{workflow.review_layers}`:
   - `instruction` empty or missing → drop the layer silently (an override disabled it).
   - `when` condition present and not satisfied by the current context (`{review_mode}`, `{spec_file}`) → drop the layer and tell the user, e.g. "Acceptance Auditor skipped — no spec file provided."
   - otherwise → the layer is active.

   If no layer is active, HALT with status `blocked` and blocking condition `no active review layers`.

3. Execute all active layers in parallel wherever their execution methods allow: substitute the runtime placeholders (`{diff_output}`, `{spec_file}`) into each layer's `instruction`, then follow it verbatim. If a layer's instruction requires subagents and subagents are not available, generate prompt files in `{implementation_artifacts}` for each such layer and HALT. Ask the user to run each in a separate session (ideally a different LLM) and paste back the findings. When findings are pasted, treat them as those layers' findings and resume from this point.

4. **Layer failure handling**: If any layer fails, times out, or returns empty results, append the layer's `name` to `{failed_layers}` (comma-separated) and proceed with findings from the remaining layers.

5. Collect all findings from the completed layers, keeping track of each finding's originating layer `id`.

## NEXT

Read fully and follow `./step-03-triage.md`

---PROJECT CONTEXT---
---
project_name: "jouan.ovh"
user_name: "Simon"
date: "2026-09-18"
sections_completed: ["technology_stack", "language_framework", "code_quality", "workflow_testing", "critical_rules"]
status: "complete"
optimized_for_llm: true
existing_patterns_found: 12
---

# Project Context for AI Agents

_Ce fichier contient les règles et patterns critiques que les agents IA doivent suivre lors de l'implémentation de code dans ce projet. Il se concentre sur les détails non évidents que les agents pourraient manquer._

---

## Technology Stack & Versions

> ✅ **Migration de stack terminée (Epic 1).** Les versions ci-dessous sont l'état
> ACTUEL, post-migration. `@nuxt/bridge-edge` a été abandonné ; le code applicatif
> vit désormais sous `app/` (structure Nuxt 4 par défaut, `srcDir = "app"`).

- **Framework :** Nuxt 4 (`^4.4.8`), SSR activé. `experimental.payloadExtraction: false`. Code applicatif sous `app/` (`srcDir = "app"`).
- **UI :** Vue 3 — `<script setup lang="ts">` pour tout nouveau composant. `vue-property-decorator` et l'option `experimentalDecorators` ont été **retirés** (Epic 3, aucun usage réel). ✅ **Epic 8 terminé : le sous-système `components/terminal/` est intégralement migré en `<script setup>`** (coquilles `TerminalComponent` + `TerminalManagerComponent` ; stories 8.1 restyle DS, 8.2 commandes, 8.3 migration). Les classes `programs/*` (`IProgram`) sont du TS pur et ne bougent pas. **Dernier résidu Options API du codebase : `WindowWrapperComponent` / `CurrentTime`, propres au header** (`defineComponent`, sans décorateur) — ne pas les étendre ; cleanup optionnel séparé (hors « refonte du terminal », non planifié). Toute migration future sans framework de test : vérifier **commande/comportement avant-après** au navigateur (Chrome DevTools MCP).
- **Langage :** TypeScript `^6.0.3`.
- **Styles :** SCSS (`sass ^1.101.0`) via `@use ... as`. **Deux couches de tokens coexistent :** (1) tokens DS portés en **CSS custom properties globales** dans `app/assets/scss/abstract/_root.scss` (chargé via `main.scss`) = source de vérité du nouveau code ; (2) anciens tokens SCSS `$` sous `abstract/` encore consommés par le legacy restant. Cf. règle SCSS.
- **Contenu :** `@nuxt/content ^3.14.0` (**v3** — stockage SQLite via `better-sqlite3`, blog). Images : `@nuxt/image ^2.0.0` (`<NuxtImg>` / `<NuxtPicture>`).
- **Lint :** ESLint `^10` en **flat config** via `@nuxt/eslint` (`eslint.config.mjs`, `eslint: { config: { stylistic: false } }` → Prettier formate). Prettier `^3` (double quotes, points-virgules). Stylelint `^17` + `stylelint-config-standard-scss` + `stylelint-scss`. Script : `eslint . && stylelint "app/assets/**/*.scss" "app/**/*.vue"`.
- **Gestionnaire de paquets :** pnpm (`packageManager: pnpm@11.8.0`, `pnpm-lock.yaml`), Node `>=22` — dev via Docker (cf. Workflow).
- **Déploiement :** site statique (`nuxi generate`) → publication vers la branche `gh-pages` (GitHub Pages, domaine custom via `CNAME` = `jouan.ovh`). ✅ La chaîne CI de déploiement est **prouvée en réel** sur `main` (Story 10.7), avec 13 routes pré-rendues, HTTPS Let's Encrypt forcé et DNS OVH opérationnel.
- **Divers :** `ua-parser-js ^2` (détection device, terminal).

## Critical Implementation Rules

### Règles Langage & Framework (TypeScript · Nuxt · Vue · SCSS)

**TypeScript / Vue**

- Préférer `<script setup lang="ts">` pour tout NOUVEAU composant. Le sous-système
  `components/terminal/` a été **intégralement migré en Epic 8** (`<script setup>`,
  décision rétro Epic 7). **Reste un seul résidu Options API** (`defineComponent`,
  sans décorateur) : `WindowWrapperComponent` / `CurrentTime`, **côté header** — ne
  pas l'étendre ; le migrer vers `<script setup>` lors d'une refonte du header
  (cleanup optionnel, non planifié).
- `vue-property-decorator` et l'option `experimentalDecorators` ont été retirés
  (Epic 3) : plus aucun décorateur de classe, ne pas en réintroduire.
- Imports composants via l'alias `~/` ou `@/` (les deux pointent sur project-root).

**Nuxt**

- Cible de build = site **STATIQUE** (`nuxi generate`) → tout code doit être
  compatible prerender : pas d'accès `window`/`document` hors `onMounted` ou
  garde `import.meta.client`.
- Pages dans `app/pages/`, layout `app/layouts/default.vue`, auto-import des
  composants activé (pas d'import manuel pour la plupart).
- **Primitives DS sous `app/components/ui/` auto-importées SANS préfixe de dossier**
  (`<ZButton>`, pas `<UiZButton>`) via `components: [{ path: "~/components/ui", pathPrefix: false }, "~/components"]`.
  Le reste de `components/` garde le scan par défaut.
- ⚠️ **Piège `<component :is>` :** un nom de composant passé en _string_
  (`<component :is="'NuxtLink'">`) **ne résout pas** l'auto-import. Importer la
  référence depuis `#components` (`import { NuxtLink } from "#components"`) et la
  passer comme valeur. (Régression rencontrée en story 2.8.)
- Images TOUJOURS via `<NuxtImg>` / `<NuxtPicture>` (@nuxt/image), jamais
  `<img>` brut. Assets statiques dans `public/images/`.
- Blog alimenté par `@nuxt/content` **v3** (markdown sous `content/blog/`) — index
  `app/pages/blog/index.vue`, article `app/pages/blog/[...slug].vue`. Collections **typées
  dans `content.config.ts`** (schéma `blog` : `date` validée ISO via `z.string().regex`,
  `tags`, `read`, `image`). Requêtes via `queryCollection("blog")…` dans `useAsyncData`
  (prerender-safe) ; rendu article via `<ContentRenderer>`. **Coloration Shiki désactivée**
  (`content.build.markdown.highlight: false`) pour imposer la palette terminale du DS —
  ne pas réactiver sans surcharge (sinon styles inline par token écrasant le DS).
- **Formulaire `/contact` (Epic 7)** : envoi via **Web3Forms** (tiers _sans serveur_, site
  reste statique), clé via `runtimeConfig.public.web3formsAccessKey` (env
  `NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY`, cf. `.env.example`). ⚠️ **Sans la clé, l'envoi échoue** —
  la provisionner en env. `$fetch` **client-only** (prerender-safe) + honeypot anti-spam ;
  validation/feedback front. Notice RGPD sous le form + page politique de confidentialité dédiée
  (`/confidentialite`, livrée en story 10.6).

**SCSS (règle critique)**

- Système `@use ... as _alias` UNIQUEMENT — jamais `@import` (déprécié).
- **Nouveau code (DS) : consommer directement les tokens CSS globaux via `var(--token)`**
  (ex. `background: var(--bg-card); border-radius: var(--radius-md);`). Les tokens
  sont exposés sur `:root` par `app/assets/scss/abstract/_root.scss` — source unique
  de vérité (couleurs, typo, espacement, rayons, élévation, motion).
- **Aucune valeur en dur** (couleur/espace/rayon/durée) dans le nouveau code — tout
  passe par un token. Si aucun token n'existe pour un besoin légitime (ex. teintes de
  palette syntaxe), commenter explicitement la dérogation.
- **Primitives de layout GLOBALES** : `.section` / `.section--sunken` / `.container` /
  `.eyebrow` (+ `.eyebrow--muted`) / `.prose` / `.hero__tags` vivent dans
  `app/assets/scss/base/_layout.scss` (chargé par `main.scss`). **Les consommer, ne PAS
  les redéclarer en `<style scoped>` par page** (sinon duplication divergente). Si un
  modifieur DS manque, l'ajouter au partiel global, pas en local. (Convention extraite
  en story 5.1 après duplication scoped dans index/services/about.)
- Legacy : certains composants déclarent encore des CSS props locales à partir des
  anciens tokens SCSS `$` (ex. `--header-color-background: #{_color.$dark-background};`).
  Ne pas étendre ce pattern ; migrer vers `var(--token)` lors d'une refonte.
- Styles dans `<style lang="scss" scoped>` par composant. Exceptions Stylelint
  (`:deep`/`:slotted`/`:global`) en `/* stylelint-disable */` **inline et commenté**,
  pas en config globale.

### Qualité de code & conventions

**Lint / format**

- ESLint + Prettier : double quotes, points-virgules, `max-len: 120`.
  `prefer-const` en erreur. Stylelint + `stylelint-scss` pour le SCSS.
- `no-console` / `no-debugger` : warning en production uniquement.

**Conventions de nommage**

- **Primitives du design system : préfixe `Z`, sous `app/components/ui/`**
  (`ZButton`, `ZCard`, `ZBadge`, `ZTag`, `ZInput`, `ZAvatar`, `ZIcon`, `ZExternalLink`, `ZCustomCursor`) — `<script setup>`,
  auto-importées sans préfixe de dossier.
- Sous-blocs de carte : `app/components/card/` (`ZCardHeader`, `ZCardBody`,
  `ZCardFooter`), restylés via tokens et composés avec `<ZCard>` (supportant le 3D tilt via prop `tilt`).
- Composants d'accueil immersifs sous `app/components/home/` : `HomeAtmosComponent.vue`
  (shader WebGL Flow Chrome accéléré avec repli CSS pur automatique, écouteurs `webglcontextlost` et `visibilitychange`),
  `HomeBootOverlay.vue` (boot interactif jouan.os), `HomeHeroTerminal.vue` (terminal Hero à frappe dynamique)
  et `HomeStackMarquee.vue` (défilement infini CSS pur).
- Composants applicatifs legacy : PascalCase suffixé `Component`
  (`HeaderComponent.vue`, `FooterComponent.vue`, `HexagonLinkComponent.vue`…).
- Sous-système terminal sous `components/terminal/` : coquilles Vue
  (`TerminalComponent`, `TerminalManagerComponent`) en **`<script setup>`** (migrées
  Epic 8) ; `programs/` = classes TS implémentant `IProgram`, `interfaces/` =
  contrats (`I*` + barrel `index.ts`).
- Tokens SCSS : fichiers partiels `_nom.scss`, importés en `_alias`
  (ex. `@use "...color" as _color`).

**Organisation**

- SCSS structuré en `abstract/` (tokens, mixins, fonctions), `base/` (reset),
  `components/`, `pages/`. Point d'entrée global `assets/scss/main.scss`.
- Copier les SVG/PNG du design system depuis `docs/design_system/assets/` vers
  `public/images/` ou `assets/` lors de l'implémentation.
- **Contenu partagé, URLs & SEO :**
  - Source unique de contenu : `app/data/site.ts` (`SITE.profile` / `SITE.skills` / `SITE.projects`, typés `IProfile`/`IProject`) — consommée par les programmes terminal (`skills`/`projets`/`contact`/`about`), `index.vue`, `about.vue`, `contact.vue` et `FooterComponent`. **Ne pas re-hardcoder** profil/skills/projets/email/ville ailleurs (DRY, consolidé en 8.2).
  - Source unique d'URL de base : `app/composables/useSiteUrl.ts` (lit `runtimeConfig.public.siteUrl`, surchargeable via `NUXT_PUBLIC_SITE_URL`). **Ne jamais hardcoder l'URL de domaine** dans le code applicatif.
  - Helper SEO centralisé : `app/composables/usePageSeo.ts` — pose `useSeoMeta`, liens canonicals et JSON-LD Schema.org échappé via `jsonLdScript()`. _(Les `experiences`/`degrees` divergent volontairement entre le CV terminal détaillé et `/about` condensé — non unifiés, suivi dans `deferred-work.md`.)_

**Langue**

- UI et contenu en FRANÇAIS (`lang="fr"`). Voix : 1re personne « je »,
  vouvoiement. Pas d'emoji (cf. guidelines du design system).

### Workflow de développement

**Git**

- Branche principale : `main`. Intégration : `develop`. Travail par branches de
  feature (ex. refonte en cours : `feat/design-system-revamp`).
- Commits conventionnels : `feat:`, `fix:`, `style:`, etc. (cf. historique).

**Environnement de dev : Docker (obligatoire)**

- ⚠️ **Tout le dev passe par Docker** (`docker-compose.yml`, Node 22 LTS + pnpm
  via corepack). Ne PAS lancer `pnpm`/`nuxi` directement sur l'hôte (macOS arm64) :
  les `node_modules` natifs (better-sqlite3, sharp, esbuild…) sont compilés pour
  le conteneur Linux et vivent dans un volume nommé isolé de l'hôte.
- Lancer le dev : `docker compose up` → `pnpm dev` sur http://localhost:3000.
- Commande ponctuelle (lint, typecheck, generate…) :
  `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`.
- Stopper : `docker compose down`.

**Build & déploiement**

- Gestionnaire de paquets : **pnpm** (`packageManager: pnpm@11.8.0`, lockfile
  `pnpm-lock.yaml`). **Ne JAMAIS utiliser `npm`/`yarn`.**
- ⚠️ **Toutes les commandes `pnpm` ci-dessous passent par Docker** (cf. section
  « Environnement de dev »), jamais directement sur l'hôte :
  `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`.
- Validation : `pnpm lint` (eslint + stylelint) + `pnpm typecheck` (`nuxi typecheck`
  / vue-tsc) + build `pnpm generate` — tout doit passer (cf. section Tests).
- Build statique : `pnpm generate` → sortie `.output/public`.
- Déploiement : automatisé par GitHub Actions (`.github/workflows/cd.yml` via `peaceiris/actions-gh-pages` sur push `main`). Sortie statique avec `CNAME` vérifié.
- ⚠️ Le domaine custom dépend du fichier `CNAME` — ne pas le perdre lors du
  déploiement gh-pages (régression déjà survenue, cf. commit `cf1829e`).

### Tests

- ❌ Aucun framework de test configuré à ce jour (pas de Vitest/Jest/Playwright).
- Validation actuelle = lint (`eslint`, `stylelint`) + `pnpm typecheck` (vue-tsc) +
  build `pnpm generate`, le tout via Docker et sans erreur. Barre de qualité minimale.
- Si des tests sont introduits pendant la migration, documenter la convention ici.

### Règles critiques à ne pas manquer

**Port du design system (React/CSS → Vue/SCSS)**

- Le design system source (`docs/design_system/`) est en **React + CSS custom
  properties**. NE PAS copier les `.jsx` tels quels : recréer chaque primitive en
  composant Vue 3 (`<script setup>`), en réutilisant les tokens.
- Source de vérité des valeurs = `docs/design_system/tokens/*.css` et
  `styles.css`. Stratégie : porter ces tokens vers `assets/scss/abstract/` (ou
  les exposer en CSS vars globales) plutôt que de redéfinir des valeurs.
- Le `ui_kits/jouan-site/` est la **référence visuelle cible** des pages (Home,
  Services, About, Blog, Contact, Terminal) — s'y reporter pour le rendu.

**Accessibilité (à intégrer dès l'écriture, pas seulement en revue)**

- Tout élément interactif : **focus visible** (ring `--ring-accent`, jamais
  `outline: none` sans alternative), **navigation clavier** (Enter/Space sur les
  éléments non natifs cliquables, retour de focus après fermeture d'overlay/menu),
  attributs `aria-*` pertinents (`aria-current`, `aria-label`, `aria-describedby`…).
- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
- Images via `<NuxtImg>` avec `alt` ; fallback visuel si l'image échoue.
- **Hiérarchie de titres & sémantique de listes (convention story 5.2)** : un libellé
  de section (eyebrow `// ...`) qui ouvre une section porte un **`<h2 class="eyebrow">`**
  (style neutralisé : `font-weight`/`line-height` hérités → rendu identique), pas un
  `<p>` — pour un outline `h1 → h2…` sans saut. Une **séquence** (étapes, expériences,
  diplômes, tags, cartes répétées) se balise en **`<ol>`/`<ul>` + `<li>`** (`list-style:
  none` + reset marges UA → rendu identique), pas en `<div>`. Écrire ces deux points
  **dès la story**, ils étaient sinon systématiquement rattrapés en revue.
- Leçon rétro Epic 2 : ces points étaient systématiquement rattrapés en revue —
  les traiter en amont (checklist pré-revue dans la consigne de story).
- **Acquis d'accessibilité consolidés (Epics 9 & 10) :**
  - **Forced colors unifié** : repli inline standard `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` au niveau des primitives (`ZButton`/`ZCard`/`ZTag`/`ZInput`) et liens du châssis. Plus aucun bloc `@media (forced-colors)` page-level dispersé.
  - **Liens externes** : TOUJOURS via la primitive `<ZExternalLink>` pour tout `target="_blank"` (`rel="noopener"` forcé + mention sr-only « (ouvre dans un nouvel onglet) » via `.screen-reader-text`).
  - **Sémantique titres, listes et régions** : eyebrow ouvrant une section en `<h2 class="eyebrow">` avec préfixes `// ` décoratifs en `<span aria-hidden="true">// </span>` ; séquences répétées en listes `<ol>`/`<ul>` + `<li>` (avec `> li { display: flex }` si cartes flex) ; paires label/valeur en `<dl>/<dt>/<dd>` ; déclencheurs d'overlay terminal en `aria-haspopup="dialog"`.
  - **Motion réduit global** : `base/_motion.scss` ramène animations/transitions à l'instantané (`0.01ms`) sous `prefers-reduced-motion: reduce`. Seule animation en boucle autorisée : le caret natif de frappe du terminal (CAP-11). Les carets décoratifs sont figés visibles.
  - **Clavier** : `Échap` ferme le terminal avec retour de focus au déclencheur. Navigation Tab logique sur tout le site.
  - **Contraste** : `--text-muted` minimum pour les textes informatifs réels (pas de `--text-faint` sur du contenu signifiant).

**À préserver pendant la refonte**

- La **fonctionnalité terminal** draggable (`components/terminal/`) est un
  easter-egg à conserver — le design system la garde comme feature secondaire.
- Le **dark-first** : pas de thème clair. Surfaces sombres teintées aubergine,
  orange Ubuntu comme unique accent héros.
- Respect de `prefers-reduced-motion` ; seule animation en boucle = le caret du
  terminal.

**Pièges**

- Compatibilité prerender (site statique) : tout accès DOM doit être gardé ;
  IDs déterministes via `useId()` (pas d'aléatoire qui casse l'hydration).
- Ne pas casser `CNAME` / le déploiement gh-pages.
- `<component :is="...">` : passer une référence importée, jamais un nom en string
  (cf. règles Nuxt).
- **Piège `padding` shorthand sur élément multi-classes** : quand deux classes de
  layout cohabitent sur le même élément (typiquement `.container` + wrapper de
  section, ex. `.hero__in.container`), **ne pas** styler le `padding` en shorthand
  dans les deux — la dernière déclarée écrase l'autre axe (ici `.container { padding: 0 24px }`
  effaçait le vertical de `.hero__in`). Utiliser les **longhands** `padding-inline` /
  `padding-block`, qui composent sans conflit quel que soit l'ordre. (Régression de
  padding du hero, story 3.1 — invisible à la revue de code, attrapée à l'œil.)
- **`@nuxt/content` v3 + Docker — base SQLite du dev périmée** : lancer `pnpm generate`
  dans un conteneur `run --rm` séparé pendant que le conteneur dev tourne **invalide la
  base de contenu** du dev (volume partagé) → `/blog` tombe en erreur. Correctif :
  `docker compose restart web` réindexe le contenu. Sans impact sur le build lui-même.
- **Styler le HTML généré par `@nuxt/content`** : le rendu (`<ContentRenderer>`) n'est pas
  atteint par `scoped` → cibler via `:deep()`. Piège : le renderer enrobe chaque titre
  d'une ancre `<a href="#…">` → titres rendus **bleu souligné** si pas de reset → ajouter
  `:deep(h2 a, h3 a, h4 a){ color: inherit; text-decoration: none }`. (Story 6.2.)
- **Vérif visuelle avant revue (stories de page)** : lancer le dev, ouvrir la page
  dans **Chrome DevTools MCP** ET la référence visuelle correspondante, puis comparer
  le rendu (padding/marges/espacement/fidélité), en desktop ET mobile. La revue de code
  est aveugle aux régressions de rendu. Réfs par page :
  - **Home** → `docs/design_system/ui_kits/jouan-site/Home - Awwwards.html` (maquette cible Awwwards officielle depuis l'Epic 11).
  - **Services / About / Blog / Contact** → `docs/design_system/ui_kits/jouan-site/index.html`

---OFFER RELEVANT---
40-
41-> **J'automatise les processus commerciaux et opérationnels qui font perdre du temps, des opportunités ou de la capacité aux entreprises.**
42-
43-## Explication courte
44-
45:> Je conçois des automatisations, agents IA et applications métier qui s'intègrent aux outils existants — du problème initial jusqu'à la mise en production.
46-
47-## Différenciateur
48-
49-> **Je ne construis pas seulement l'automatisation. Je construis le système autour : données, API, interface, sécurité, tests, supervision et déploiement.**
50-
--
103-
104-# 3. Architecture de l'offre
105-
106-L'offre publique repose sur **4 briques** :
107-
108:1. Diagnostic
109-2. Automatisation ciblée
110-3. Workflow métier
111-4. Système métier sur mesure
112-
113-Une cinquième brique intervient après livraison lorsque cela se justifie :
114-
115:5. AI Care
116-
117:Le **Blueprint** n'est plus présenté comme une offre principale au même niveau que les autres. Il devient un **cadrage facturable optionnel** pour les sujets complexes.
118-
119----
120-
121:# 4. Offre 1 — Diagnostic
122-
123-## Nom
124-
125-```text
126:Diagnostic
127-```
128-
129-## Prix public
130-
131-```text
--
212-- API / webhook ;
213-- traitement de données ;
214-- IA si utile ;
215-- validation humaine si nécessaire ;
216-- tests ;
217:- mise en production ;
218-- documentation courte.
219-
220-## Prix public
221-
222-**Ne pas afficher de prix minimum.**
--
361-- gestion d'utilisateurs et de rôles ;
362-- historique et base de données ;
363-- application desktop ;
364-- portail client ;
365-- système multi-tenant ;
366:- orchestration de plusieurs agents ou services.
367-
368-## Texte public recommandé
369-
370-> **Quand l'automatisation devient un véritable outil métier, je développe le système complet.**
371->
--
395-
396-Les projets dépassant significativement le périmètre d'un Workflow Sprint doivent être chiffrés comme de vrais projets logiciels, pas forcés dans un package artificiel.
397-
398----
399-
400:# 8. Cadrage complexe — Blueprint optionnel
401-
402-## Nom
403-
404-```text
405:AI Workflow Blueprint
406-```
407-
408-## Statut
409-
410-**Optionnel.**
--
443-## Prix public
444-
445-Il est possible de conserver :
446-
447-```text
448:À partir de 750 € HT
449-```
450-
451-Mais **ne pas en faire une des trois offres principales de la page Services**.
452-
453:Le Blueprint doit apparaître comme :
454-
455-```text
456-Pour les sujets complexes, un cadrage détaillé peut être proposé avant le développement.
457-```
458-
459----
460-
461:# 9. Offre 5 — AI Care
462-
463-## Nom
464-
465-```text
466:AI Care
467-```
468-
469-## Positionnement
470-
471:AI Care n'est pas un abonnement ajouté automatiquement à tous les projets.
472-
473:Il est proposé lorsqu'une capacité mise en production doit être :
474-
475-- surveillée ;
476-- maintenue ;
477-- corrigée ;
478-- adaptée ;
479-- optimisée ;
480-- suivie dans le temps.
481-
482-## Texte public recommandé
483-
484:> **Une automatisation utile doit continuer à fonctionner après sa mise en production.**
485->
486:> AI Care couvre le maintien en condition opérationnelle du système : monitoring, maintenance, support, suivi des coûts et adaptations mineures liées aux APIs ou aux modèles.
487-
488-## Peut inclure
489-
490-- monitoring ;
491-- alertes ;
--
510-## Prix public
511-
512-Conserver pour cette version :
513-
514-```text
515:À partir de 250 € HT / mois
516-```
517-
518-Ce prix reste une hypothèse commerciale à tester.
519-
520:Le `250 € HT / mois` constitue un **plancher de maintenance**, adapté à une automatisation simple, peu critique et peu consommatrice de support.
521-
522-Repères internes de travail, non destinés à devenir une grille publique rigide :
523-
524-```text
525:≈ 250–350 € / mois
526-Automatisation simple, faible criticité, faible volume, surveillance légère.
527-
528-≈ 400–700 € / mois
529-Workflow métier important, plusieurs intégrations, interventions plus régulières.
530-
--
559-↓
560-Si le workflow est important, il peut construire quelque chose de plus complet.
561-↓
562-S'il faut une vraie application, il sait également la développer.
563-↓
564:Et il peut maintenir le système après la mise en production.
565-```
566-
567-C'est la progression commerciale recherchée.
568-
569----
--
744-```
745-
746-Résumé :
747-
748-```text
749:Pour les workflows qui traversent plusieurs étapes ou outils : cartographie, intégrations, automatisation, IA ciblée, contrôle humain, tests et mise en production.
750-```
751-
752-Prix :
753-
754-```text
--
803-Parler du projet
804-```
805-
806----
807-
808:# 14. Page Services — AI Care séparé
809-
810:Ne pas afficher AI Care comme une alternative équivalente aux trois offres de build.
811-
812-Créer une section après les offres principales.
813-
814-## Eyebrow
815-
--
824-```
825-
826-## Carte ou bloc
827-
828-```text
829:AI Care
830:À partir de 250 € HT / mois
831-```
832-
833-Texte :
834-
835-> Monitoring, maintenance, support, suivi des coûts et adaptations mineures pour les systèmes qui ont besoin d'être exploités dans la durée.
836-
837-CTA :
838-
839-```text
840:Découvrir AI Care
841-```
842-
843----
844-
845-# 15. Page Services — déroulé commercial
846-
847-Conserver une logique en quatre temps, mais modifier légèrement les intitulés.
848-
849:## 01 — Diagnostic
850-
851-```text
852-Comprendre le workflow, son volume, ses outils et la friction réelle.
853-```
854-
855:## 02 — Cadrage
856-
857-```text
858-Définir la cible, ce qui doit être automatisé, ce qui reste humain et comment mesurer le résultat.
859-```
860-
861-Pour les sujets complexes :
862-
863-```text
864:Un Blueprint facturable peut être proposé lorsque le cadrage nécessite un travail approfondi avant devis.
865-```
866-
867:## 03 — Construction & intégration
868-
869-```text
870-Développer uniquement le niveau de système nécessaire et le tester sur des cas réels.
871-```
872-
873:## 04 — Exploitation & mesure
874-
875-```text
876-Mettre en production, mesurer et maintenir lorsque le workflow le justifie.
877-```
878-
--
939-
940-# 18. Pricing — règles d'affichage public
941-
942-## À afficher
943-
944:### Diagnostic
945-
946-```text
947-Gratuit
948-```
949-
--
963-
964-```text
965-Sur devis
966-```
967-
968:### AI Care
969-
970-```text
971:À partir de 250 € HT / mois
972-```
973-
974:### Blueprint
975-
976-Seulement lorsqu'il est présenté :
977-
978-```text
979:À partir de 750 € HT
980-```
981-
982----
983-
984-## À ne plus afficher dans cette version
--
1109-- définir un vrai prix d'entrée ;
1110-- créer un package d'automatisation ciblée ;
1111-- augmenter le prix du Workflow Sprint ;
1112-- supprimer une catégorie peu rentable ;
1113-- spécialiser une offre par verticale ;
1114:- rendre AI Care obligatoire sur certains systèmes critiques.
1115-
1116-Mais aucune de ces décisions ne doit être prise avant d'avoir observé plusieurs opportunités réelles.
1117-
1118----
1119-
--
1134-8. Présenter :
1135-   - Automatisation ciblée ;
1136-   - Workflow métier ;
1137-   - Système métier sur mesure ;
1138-   comme trois niveaux d'intervention.
1139:9. Conserver AI Care comme offre d'exploitation séparée.
1140:10. Garder le Blueprint comme option de cadrage complexe, pas comme offre cœur.
1141-11. Réutiliser les composants existants autant que possible.
1142-12. Ne pas inventer :
1143-   - ROI ;
1144-   - résultats ;
1145-   - témoignages ;
--
1173-- [ ] le site ne donne plus l'impression que toute intervention coûte au minimum 3 500 € ;
1174-- [ ] l'offre distingue clairement automatisation ciblée, workflow métier et système métier ;
1175-- [ ] le Workflow métier reste visuellement identifiable comme offre cœur ;
1176-- [ ] aucune offre low-cost artificielle n'est créée ;
1177-- [ ] aucun prix fictif n'est ajouté ;
1178:- [ ] le Diagnostic reste accessible ;
1179:- [ ] le Blueprint devient secondaire / optionnel ;
1180:- [ ] AI Care reste séparé du build ;
1181:- [ ] `À partir de 250 € HT / mois` reste affiché pour AI Care ;
1182-- [ ] le CTA principal parle toujours d'un workflow ou processus ;
1183-- [ ] le discours reste centré sur le problème métier ;
1184-- [ ] le Full Stack reste une preuve de capacité et non le produit principal ;
1185-- [ ] la DA actuelle est conservée ;
1186-- [ ] le site reste responsive ;
--
1216-
1217-        ↓
1218-
1219-AI CARE
1220-Maintenir la capacité en production.
1221:À partir de 250 € HT / mois.
1222-```
1223-
1224-Pour les sujets complexes :
1225-
1226-```text
1227-AI WORKFLOW BLUEPRINT
1228:Cadrage approfondi avant engagement.
1229:À partir de 750 € HT.
1230-Optionnel.
1231-```
1232-
1233----
1234-

---DEFERRED---
# Deferred work

_Travaux réels mais reportés, remontés par les revues de code. À reprendre dans la story/epic indiquée._

---

## 📋 Inventaire consolidé (synthèse — maj rétro Epic 9, 2026-06-29)

_Vue d'ensemble par destination. Le détail par story est conservé dans les sections chronologiques ci-dessous. Aucune dette technique laissée dans les épics (chaque story a soldé ses findings) ; ce sont des **généralisations DS-wide / d'architecture** délibérément regroupées pour être traitées en un seul passage._

> **Décision rétro Epic 9 (2026-06-29) :** les épics 1→9 sont `done`, **mais la refonte n'est pas livrée**. Tout le reste (a11y résiduel non couvert par 9.1/9.2, SEO, RGPD, déploiement, audit a11y émulé) est **consolidé dans un futur Epic 10 « fin de refonte »** — épic à écrire (handoff `bmad` planification). Epic 9 se clôt tel quel.

### ✅ Soldé en Epic 9

- ~~**Repli `forced-colors` DS-wide**~~ — ✅ **Résolu (story 9.1)** : repli posé une seule fois au niveau des primitives DS (`ZButton`, `ZCard`, `ZTag`, `ZInput`) via `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (rendu en couleur système sous forced-colors, le ring `box-shadow` restant le focus normal) ; anneau DS `--ring-accent` + même repli ajoutés aux liens du châssis (logo + nav header/menu, liens footer) qui n'avaient que l'outline UA. _(revues 3.2, 5.1)_
- ~~**Filet `prefers-reduced-motion` global + exception caret**~~ — ✅ **Résolu (story 9.2)** : `base/_motion.scss` ramène animations/transitions à l'instantané site-wide ; caret natif du terminal intact, caret déco du hero figé visible.
- ~~**Contraste — `--text-faint` sous AA**~~ — ✅ **Résolu (story 9.2)** : 4 textes informatifs réels remontés à `--text-muted` (token-only).
- ~~**Clavier — Échap + retour de focus terminal**~~ — ✅ **Résolu (story 9.2)**.

### → Epic 10 — Fin de refonte (épic à écrire ; décision rétro Epic 9)

**A11y résiduel (non couvert par les AC de 9.1/9.2) :**

1. ~~**Généralisation de la convention a11y titres + listes**~~ — ✅ **Résolu en 10.2**
2. ~~**Audit site-wide des liens `target="_blank"`**~~ — ✅ **Résolu en 10.3**
3. ~~**Sémantique a11y de la colonne `/contact`**~~ — ✅ **Résolu en 10.2**
4. ~~**Audit a11y émulé OS-level**~~ — ✅ **Résolu (story 10.4)** : validation runtime `forced-colors: active` et `prefers-reduced-motion: reduce` + parcours lecteur d'écran VoiceOver. _(revues 9.1, 9.2, 10.4)_
5. ~~**Unifier les deux idiomes forced-colors**~~ — ✅ **Résolu (story 10.4)** : bloc page-level `@media` d'`index.vue` rabattu sur le repli inline standard DS `outline: 2px solid transparent; outline-offset: 2px;`. 100% des focusables unifiés. _(revues 9.1, 10.4)_

**SEO :**

6. **Centralisation SEO site-wide** — la **dette concrète est soldée** (6.2) : `SITE_URL` unique dans `app/utils/seo.ts` (dédup `/about`+`/blog`+article), JSON-LD via `jsonLdScript()` qui échappe `</script>`. ✅ **`SITE_URL` sourcé depuis `runtimeConfig` fait en 10.1** (`runtimeConfig.public.siteUrl` + composable `useSiteUrl()`, surchargeable `NUXT_PUBLIC_SITE_URL`). **Reste** (architecture, non-dette) : migrer vers `useSeoMeta`/`app.head` partagé, ajouter `publisher`/`Organization` (ou `nuxt-schema-org`), et étendre OG/JSON-LD aux pages encore nues (home, services, contact). → **story 10.5**. _(revues 5.1, 6.1, 6.2)_
7. ~~**Domaine de production**~~ — ✅ **Résolu en 10.7** : DNS OVH configuré (`jouan.ovh` → 4 IPs GitHub Pages, `www` → CNAME), `public/CNAME` = `jouan.ovh`, `nuxt.config.ts` `siteUrl` = `https://jouan.ovh`, CI guard `Verify static output` aligné sur `jouan.ovh`, HTTPS actif et forcé sur GitHub Pages.

**Légal / RGPD :**

8. ~~**Politique de confidentialité (RGPD)**~~ — ✅ **Résolu en 10.6** : pages `/confidentialite` et `/mentions-legales` créées et liées depuis le footer et le formulaire, avec mention de Web3Forms, des droits RGPD et de l'hébergement.

**Déploiement :**

9. ~~**Déploiement gh-pages réel**~~ — ✅ **Résolu en 10.7** : premier merge sur `main` et déploiement réel `gh-pages` exécuté et validé. Site servi en production avec HTTPS sur `https://jouan.ovh`.

## Deferred from: code review of 15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint (2026-09-18)

- ~~**Nuancer la mention du Blueprint dans l'étape Cadrage** (`app/pages/services.vue`)~~ — ✅ **Résolu en 15.3** : étape 02 Cadrage mise à jour avec mention du Blueprint facturable optionnel à partir de 750 € HT pour sujets complexes.
- ~~**Enrichir les entités Service de `servicesJsonLd` avec leur URL d'ancrage respective** (`app/pages/services.vue`)~~ — ✅ **Résolu en 15.3** : attributs `url` pointant vers `#automatisation`, `#workflow`, `#sur-mesure` et `#ai-care` intégrés dans Schema.org `servicesJsonLd`.

## Deferred from: code review of 15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance (2026-09-18)

- ~~**Ancrage direct des 3 liens contextuels de la homepage vers les offres `/services`**~~ — ✅ **Résolu en 15.2** (`app/pages/index.vue` : ancres `/services#automatisation`, `/services#workflow`, `/services#sur-mesure`).
- ~~**Désancrage tarifaire résiduel sur la page catalogue `/services`**~~ — ✅ **Résolu en 15.2** (`app/pages/services.vue` : 3 offres sur devis, élimination définitive du prix d'entrée 3 500 € HT et restructuration du catalogue de build).

## Deferred from: code review of 13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg (2026-09-18)

- **Isolation du sélecteur global `pre` vis-à-vis des composants Markdown blog** (`app/assets/scss/abstract/_root.scss:268`) — La sanctuarisation actuelle applique les styles sombres directement sur la balise `pre`. Préexistant et cohérent avec le style par défaut du blog, mais factorisable sous une classe dédiée pour isoler formellement les terminaux des blocs de code du contenu éditorial lors d'une future refonte du blog.

## Deferred from: code review of 13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile (2026-09-18)

- **Focus clavier non réinitialisé lors du redimensionnement dynamique mobile vers desktop (> 900px) avec menu ouvert** (`app/components/HeaderComponent.vue:209-214`) — Comportement préexistant commun à tous les contrôles du menu mobile (`.hdr__menu-link`, boutons terminal et contact) lors du passage desktop via `onDesktopChange()`. À traiter lors d'une passe de refactorisation globale du composant Header.

## Deferred from: code review of 13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal (2026-09-18)

- **Ajustement des tokens d'état d'accentuation (--accent-hover, --accent-active) et des composants transverses en mode clair** (`app/assets/scss/abstract/_root.scss`) — La Story 13.1 pose la fondation de la palette de surface et de texte crème/aubergine. L'adaptation fine des états d'interaction hover/active et l'audit transverse de l'atmosphère d'ambiance et des pages spécifiques sont explicitement planifiés pour la Story 13.4.

## Deferred from: code review of 12-5-page-services-restructuration-des-offres-et-process-4-etapes (2026-09-16)

- **Ajustement responsive de la grille du process à 4 colonnes entre 900px et 1100px** (`app/pages/services.vue:401`) — La grille passe de 4 colonnes à 1 colonne sous le breakpoint 900px. Entre 900px et 1100px, les 4 colonnes rendent des descriptions d'étapes relativement denses. Un palier intermédiaire à 2 colonnes (ex. sous 1050px) pourra être introduit lors d'une passe de polissage responsive globale.

## Deferred from: code review of 12-4-homepage-vitrine-des-3-projets-phares (2026-09-16)

- **Rendu d'un lien dynamique si `project.url` est défini** (`app/pages/index.vue:130`) — Si un projet définit une URL publique ultérieurement, la carte ne dispose pas actuellement d'un composant de lien englobant (`<ZExternalLink>` ou `<NuxtLink>`). Délibéré pour le MVP car les 3 projets phares actuels sont des dépôts privés sans lien sortant. À prévoir si des projets publics sont intégrés à la vitrine.

## Deferred from: code review of 12-1-source-unique-de-donnees-sitets-et-coherence-globale (2026-09-16)

- **Description SEO `/about` non encore repositionnée sur les systèmes IA** (`app/pages/about.vue:142`) — la description de la page mentionne encore le profil antérieur Nuxt/NestJS/SaaS. Prévu au scope de la Story 12.6 (refonte page À propos & SEO site-wide).
- **Format de `addressLocality` Schema.org sur `/about`** (`app/pages/about.vue:159`) — `addressLocality` hérite de `"France · Remote"`. Prévu pour révision et ajustement structuré dans la Story 12.6.

## Deferred from: code review of 9-2-motion-reduit-contraste-et-clavier (2026-06-29)

- **Placeholder `ZInput` ~3.7:1 sur `--bg-input` (< 4.5:1 AA)** — résidu conscient : `--text-muted` (relevé de `--text-faint` ~2.2:1) reste sous AA sur la surface la plus claire, mais le champ porte un `<label>` visible persistant (placeholder = texte supplémentaire, zone grise WCAG) ; monter encore le ferait passer pour une saisie. Acceptable tel quel ; à revoir si un token de placeholder dédié ≥ 4.5:1 est introduit. _(revue 9.2)_
- ~~**Audit a11y émulé OS-level (reduced-motion + forced-colors + lecteur d'écran)**~~ — ✅ **Résolu en 10.4** : validation runtime complète effectuée sous émulation navigateur & VoiceOver. _(revues 9.2, 10.4)_

## Deferred from: code review of 9-1-etats-interactifs-coherents (2026-06-29)

- ~~**Unifier les deux idiomes forced-colors**~~ — ✅ **Résolu en 10.4** : repli inline `outline: 2px solid transparent; outline-offset: 2px;` généralisé à `index.vue`, suppression du bloc `@media` local. _(revues 9.1, 10.4)_
- ~~**Émulation `forced-colors: active` non rejouée**~~ — ✅ **Résolu en 10.4** : vérification runtime sous contraste forcé émulé sur l'ensemble des routes. _(revues 9.1, 10.4)_

## Deferred from: code review of 7-2-infos-cta-terminal-et-socials (2026-06-26)

- **a11y sémantique de la colonne droite `/contact`** — la carte infos rend les paires label/valeur en `<div>` (pas de `<dl>/<dt>/<dd>`), le préfixe `//` est lu « slash slash », pas de titre de section, et le CTA terminal n'a pas `aria-haspopup="dialog"`. Fidèle au kit, non bloquant. À reprendre dans le **lot a11y Epic 9** (item 2 consolidé : sémantique titres/listes/régions). _(La ligne de prompt décorative a été traitée en patch 7.2 — `aria-hidden`.)_
- ~~**DRY — données de contact inline**~~ — ✅ **Résolu en 8.2** : `contact.email`/`city` (`/contact`) et `profile.email`/`city` (`/about`) consomment désormais la source unique `app/data/site.ts` (`SITE.profile`). _(La consolidation `SITE_URL` SEO reste un sujet distinct, item 4.)_

## Deferred from: code review of 7-1-route-contact-et-formulaire (2026-06-26)

- **SEO `/contact`** — `useHead` ne pose que `title`+`description` (pas d'OG/canonical/JSON-LD), comme `/services`. Déjà couvert par l'**item 4 consolidé** (« étendre OG/JSON-LD aux pages encore nues : home, services, **contact** »). → story SEO dédiée / Epic 9. _(Les 2 autres findings 7.1 — focus a11y à l'envoi, erreurs collantes — sont des **patchs** de la story, pas des différés ; cf. Review Findings du ticket.)_
- ~~**Clé d'accès Web3Forms à provisionner**~~ — ✅ **OK** (Simon, 2026-06-26) : clé créée et renseignée dans l'env `NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY`. L'envoi réel du formulaire `/contact` est opérationnel.
- **Politique de confidentialité (RGPD)** — le formulaire collecte nom/email/message transmis à un tiers (Web3Forms) ; une **notice courte est posée sous le formulaire**. Reste à publier une **page « politique de confidentialité »** dédiée (base légale, finalité, durée, sous-traitant Web3Forms, droits) et à la lier — cf. skill `rgpd-france`. → tâche légale de fin de refonte (hors périmètre 7.1/7.2).

## Deferred from: code review of 6-2-vue-article-prose-et-code (2026-06-25)


codex
Le diff est ciblé sur `services.vue` et la documentation de suivi. J’ai chargé la story, le contexte projet, l’offre V1.1 et les dettes différées ; je vérifie maintenant les primitives réellement utilisées et les tokens pour distinguer les écarts d’acceptation des choix déjà conformes.
exec
/bin/zsh -lc "nl -ba app/pages/services.vue | sed -n '1,380p'; printf '\\n---SCSS---\\n'; nl -ba app/pages/services.vue | sed -n '480,760p'; printf '\\n---PRIMITIVES---\\n'; rg -n -C 5 \"defineProps|id=|inheritAttrs|name:|bot|ZBadge|ZCard\" app/components/ui/ZCard.vue app/components/ui/ZBadge.vue app/components/ui/ZIcon.vue; printf '\\n---TOKENS---\\n'; rg -n \"--(space|fs|border|radius|opacity|icon|lh|accent)\" app/assets/scss/abstract/_root.scss | head -120; printf '\\n---OFFER CONTEXT 8/9/14/15---\\n'; sed -n '400,540p' docs/jouan-ovh-offre-commerciale-v1.1-updated.md; sed -n '808,885p' docs/jouan-ovh-offre-commerciale-v1.1-updated.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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
   361	}
   362	
   363	// .section / .section--sunken / .container / .eyebrow / .prose : primitives de
   364	// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
   365	
   366	// ---- En-tête ----
   367	.services__title {
   368	  max-width: 22ch;
   369	  margin-bottom: var(--space-3);
   370	  font-family: var(--font-mono);
   371	  font-size: var(--fs-4xl);
   372	  font-weight: var(--fw-light);
   373	  line-height: var(--lh-tight);
   374	  color: var(--text-strong);
   375	}
   376	
   377	.services__intro {
   378	  max-width: 62ch;
   379	  margin-bottom: var(--space-10);
   380	  color: var(--text-muted);

---SCSS---
   480	  font-size: var(--fs-sm);
   481	  color: var(--text-muted);
   482	
   483	  b {
   484	    font-size: var(--fs-lg);
   485	    font-weight: var(--fw-bold);
   486	    color: var(--text-strong);
   487	  }
   488	}
   489	
   490	.offer__disclaimer {
   491	  margin: var(--space-2) 0 0;
   492	  font-family: var(--font-mono);
   493	  font-size: var(--fs-xs);
   494	  line-height: var(--lh-normal);
   495	  color: var(--text-muted);
   496	  opacity: 0.85;
   497	}
   498	
   499	.offer__cta {
   500	  margin-top: var(--space-4);
   501	}
   502	
   503	.offer__btn {
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
   548	  font-size: 22px;
   549	  color: var(--accent);
   550	  background: var(--accent-soft);
   551	  border-radius: var(--radius-md);
   552	}
   553	
   554	.care-card__title {
   555	  margin-bottom: var(--space-2);
   556	  font-family: var(--font-mono);
   557	  font-size: var(--fs-2xl);
   558	  font-weight: var(--fw-regular);
   559	  color: var(--text-strong);
   560	}
   561	
   562	.care-card__desc {
   563	  margin: 0 0 var(--space-5);
   564	  font-family: var(--font-sans);
   565	  font-size: var(--fs-sm);
   566	  line-height: var(--lh-relaxed);
   567	  color: var(--text-body);
   568	}
   569	
   570	.care-card__details {
   571	  display: flex;
   572	  flex-direction: column;
   573	  padding-left: var(--space-6);
   574	  border-left: 1px solid var(--border-subtle);
   575	}
   576	
   577	.care-card__points-title {
   578	  margin: 0 0 var(--space-3);
   579	  font-family: var(--font-mono);
   580	  font-size: var(--fs-xs);
   581	  font-weight: var(--fw-medium);
   582	  letter-spacing: var(--ls-wide);
   583	  color: var(--accent);
   584	  text-transform: uppercase;
   585	}
   586	
   587	.care-card__points {
   588	  margin: 0;
   589	  padding: 0;
   590	  list-style: none;
   591	
   592	  li {
   593	    position: relative;
   594	    padding: var(--space-2) 0 var(--space-2) var(--space-5);
   595	    font-family: var(--font-mono);
   596	    font-size: var(--fs-sm);
   597	    color: var(--text-muted);
   598	  }
   599	
   600	  li::before {
   601	    content: "→";
   602	    position: absolute;
   603	    left: 0;
   604	    color: var(--accent);
   605	  }
   606	}
   607	
   608	.care-card__footer {
   609	  display: flex;
   610	  flex-direction: column;
   611	  margin-top: var(--space-4);
   612	  padding-top: var(--space-4);
   613	  border-top: 1px solid var(--border-subtle);
   614	}
   615	
   616	.care-card__price {
   617	  font-family: var(--font-mono);
   618	  font-size: var(--fs-sm);
   619	  color: var(--text-muted);
   620	
   621	  b {
   622	    font-size: var(--fs-lg);
   623	    font-weight: var(--fw-bold);
   624	    color: var(--text-strong);
   625	  }
   626	}
   627	
   628	.care-card__disclaimer {
   629	  margin: var(--space-2) 0 0;
   630	  font-family: var(--font-mono);
   631	  font-size: var(--fs-xs);
   632	  line-height: var(--lh-normal);
   633	  color: var(--text-muted);
   634	  opacity: 0.85;
   635	}
   636	
   637	.care-card__cta {
   638	  margin-top: var(--space-4);
   639	}
   640	
   641	.care-card__btn {
   642	  width: 100%;
   643	}
   644	
   645	// ---- Section process ----
   646	.process__title {
   647	  margin-bottom: var(--space-8);
   648	  font-family: var(--font-mono);
   649	  font-size: var(--fs-3xl);
   650	  font-weight: var(--fw-regular);
   651	  color: var(--text-strong);
   652	}
   653	
   654	.process {
   655	  display: grid;
   656	  grid-template-columns: repeat(4, 1fr);
   657	  gap: var(--space-5);
   658	  margin: 0;
   659	  padding: 0;
   660	  list-style: none;
   661	}
   662	
   663	.process__step {
   664	  display: flex;
   665	  flex-direction: column;
   666	}
   667	
   668	.process__num {
   669	  font-family: var(--font-mono);
   670	  font-size: var(--fs-3xl);
   671	  font-weight: var(--fw-light);
   672	  color: var(--accent);
   673	}
   674	
   675	.process__step-title {
   676	  margin: var(--space-2) 0;
   677	  font-family: var(--font-mono);
   678	  font-size: var(--fs-lg);
   679	  font-weight: var(--fw-regular);
   680	  color: var(--text-strong);
   681	}
   682	
   683	.process__desc {
   684	  font-size: var(--fs-sm);
   685	  color: var(--text-muted);
   686	}
   687	
   688	.process__cta-inline-wrapper {
   689	  margin-top: auto;
   690	  padding-top: var(--space-3);
   691	}
   692	
   693	.process__inline-cta {
   694	  display: inline-flex;
   695	  align-items: center;
   696	  font-family: var(--font-mono);
   697	  font-size: var(--fs-sm);
   698	  color: var(--accent);
   699	  text-decoration: none;
   700	  transition:
   701	    color var(--dur-base) var(--ease-standard),
   702	    text-decoration-color var(--dur-base) var(--ease-standard);
   703	
   704	  &:hover {
   705	    color: var(--accent-hover);
   706	    text-decoration: underline;
   707	  }
   708	
   709	  &:focus-visible {
   710	    outline: 2px solid transparent;
   711	    outline-offset: 2px;
   712	    box-shadow: var(--ring-accent);
   713	    border-radius: var(--radius-xs);
   714	  }
   715	}
   716	
   717	.process__cta {
   718	  margin-top: var(--space-12);
   719	  text-align: center;
   720	}
   721	
   722	// ---- Responsive ----
   723	@media (width <= 900px) {
   724	  .grid-3,
   725	  .process {
   726	    grid-template-columns: 1fr;
   727	  }
   728	
   729	  .care-card {
   730	    grid-template-columns: 1fr;
   731	    gap: var(--space-6);
   732	  }
   733	
   734	  .care-card__details {
   735	    padding-top: var(--space-4);
   736	    padding-left: 0;
   737	    border-top: 1px solid var(--border-subtle);
   738	    border-left: none;
   739	  }
   740	}
   741	</style>

---PRIMITIVES---
app/components/ui/ZBadge.vue-14-  tone?: "neutral" | "accent" | "success" | "warning" | "danger" | "info";
app/components/ui/ZBadge.vue-15-  /** Point de statut en tête. @default false */
app/components/ui/ZBadge.vue-16-  dot?: boolean;
app/components/ui/ZBadge.vue-17-}
app/components/ui/ZBadge.vue-18-
app/components/ui/ZBadge.vue:19:withDefaults(defineProps<Props>(), {
app/components/ui/ZBadge.vue-20-  tone: "neutral",
app/components/ui/ZBadge.vue-21-  dot: false,
app/components/ui/ZBadge.vue-22-});
app/components/ui/ZBadge.vue-23-</script>
app/components/ui/ZBadge.vue-24-
--
app/components/ui/ZCard.vue-23-// Porté de docs/design_system/components/core/Card.jsx et Home - Awwwards.html.
app/components/ui/ZCard.vue-24-import type { Component, ComponentPublicInstance } from "vue";
app/components/ui/ZCard.vue-25-import { computed, onBeforeUnmount, onMounted, ref, useAttrs, watch } from "vue";
app/components/ui/ZCard.vue-26-
app/components/ui/ZCard.vue-27-defineOptions({
app/components/ui/ZCard.vue:28:  inheritAttrs: false,
app/components/ui/ZCard.vue-29-});
app/components/ui/ZCard.vue-30-
app/components/ui/ZCard.vue-31-interface Props {
app/components/ui/ZCard.vue-32-  /** Rendre la carte interactive (hover state, clickable). @default false */
app/components/ui/ZCard.vue-33-  interactive?: boolean;
--
app/components/ui/ZCard.vue-41-  as?: string | Component;
app/components/ui/ZCard.vue-42-  /** Activer l'effet 3D tilt sur mousemove. @default false */
app/components/ui/ZCard.vue-43-  tilt?: boolean;
app/components/ui/ZCard.vue-44-}
app/components/ui/ZCard.vue-45-
app/components/ui/ZCard.vue:46:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZCard.vue-47-  interactive: false,
app/components/ui/ZCard.vue-48-  accent: false,
app/components/ui/ZCard.vue-49-  featured: false,
app/components/ui/ZCard.vue-50-  padded: true,
app/components/ui/ZCard.vue-51-  as: "div",
--
app/components/ui/ZIcon.vue-31-const STROKE: Record<string, string> = {
app/components/ui/ZIcon.vue-32-  arrow: '<path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>',
app/components/ui/ZIcon.vue-33-  terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
app/components/ui/ZIcon.vue-34-  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
app/components/ui/ZIcon.vue-35-  layers: '<path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
app/components/ui/ZIcon.vue:36:  bot: '<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 4v4"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/><path d="M2 14h2M20 14h2"/>',
app/components/ui/ZIcon.vue-37-  spark:
app/components/ui/ZIcon.vue-38-    '<path d="M12 3l1.8 5.6L19.5 10l-5.7 1.4L12 17l-1.8-5.6L4.5 10l5.7-1.4z"/><path d="M19 15l.7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9z"/>',
app/components/ui/ZIcon.vue-39-  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>',
app/components/ui/ZIcon.vue-40-  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
app/components/ui/ZIcon.vue-41-  check: '<polyline points="20 6 9 17 4 12"/>',
--
app/components/ui/ZIcon.vue-79-
app/components/ui/ZIcon.vue-80-const EMPTY: IconDef = { box: "0 0 24 24", fill: false, body: "" };
app/components/ui/ZIcon.vue-81-
app/components/ui/ZIcon.vue-82-interface Props {
app/components/ui/ZIcon.vue-83-  /** Nom de l'icône dans le set (arrow, terminal, github, gem…). */
app/components/ui/ZIcon.vue:84:  name: string;
app/components/ui/ZIcon.vue-85-  /** Libellé accessible : si fourni, l'icône devient `role="img"` ; sinon décorative (`aria-hidden`). */
app/components/ui/ZIcon.vue-86-  label?: string;
app/components/ui/ZIcon.vue-87-}
app/components/ui/ZIcon.vue-88-
app/components/ui/ZIcon.vue:89:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZIcon.vue-90-  label: undefined,
app/components/ui/ZIcon.vue-91-});
app/components/ui/ZIcon.vue-92-
app/components/ui/ZIcon.vue-93-const def = computed<IconDef>(() => ICONS[props.name] ?? EMPTY);
app/components/ui/ZIcon.vue-94-</script>

---TOKENS---
rg: unrecognized flag --(space|fs|border|radius|opacity|icon|lh|accent)

---OFFER CONTEXT 8/9/14/15---
# 8. Cadrage complexe — Blueprint optionnel

## Nom

```text
AI Workflow Blueprint
```

## Statut

**Optionnel.**

Ce n'est pas une étape obligatoire pour chaque prospect.

## Quand le proposer

Lorsque le projet exige plusieurs heures de travail avant qu'un devis fiable soit possible :

- processus complexe ;
- plusieurs équipes ;
- plusieurs intégrations ;
- données mal connues ;
- architecture à arbitrer ;
- legacy ;
- risque important ;
- scope encore flou.

## Livrable

- processus actuel ;
- frictions ;
- volumes ;
- acteurs ;
- outils ;
- données ;
- workflow cible ;
- automatisation vs IA vs humain ;
- risques ;
- architecture ;
- KPI ;
- périmètre ;
- estimation budgétaire.

## Prix public

Il est possible de conserver :

```text
À partir de 750 € HT
```

Mais **ne pas en faire une des trois offres principales de la page Services**.

Le Blueprint doit apparaître comme :

```text
Pour les sujets complexes, un cadrage détaillé peut être proposé avant le développement.
```

---

# 9. Offre 5 — AI Care

## Nom

```text
AI Care
```

## Positionnement

AI Care n'est pas un abonnement ajouté automatiquement à tous les projets.

Il est proposé lorsqu'une capacité mise en production doit être :

- surveillée ;
- maintenue ;
- corrigée ;
- adaptée ;
- optimisée ;
- suivie dans le temps.

## Texte public recommandé

> **Une automatisation utile doit continuer à fonctionner après sa mise en production.**
>
> AI Care couvre le maintien en condition opérationnelle du système : monitoring, maintenance, support, suivi des coûts et adaptations mineures liées aux APIs ou aux modèles.

## Peut inclure

- monitoring ;
- alertes ;
- maintenance corrective ;
- support ;
- suivi des coûts ;
- adaptations mineures fournisseurs / APIs ;
- mise à jour de modèles ;
- petites optimisations ;
- suivi de KPI.

## N'inclut pas

- nouveau workflow ;
- nouvelle intégration majeure ;
- refonte importante ;
- migration ;
- nouvelle fonctionnalité métier distincte ;
- consommations tierces illimitées ;
- SLA ou astreinte non contractualisés.

## Prix public

Conserver pour cette version :

```text
À partir de 250 € HT / mois
```

Ce prix reste une hypothèse commerciale à tester.

Le `250 € HT / mois` constitue un **plancher de maintenance**, adapté à une automatisation simple, peu critique et peu consommatrice de support.

Repères internes de travail, non destinés à devenir une grille publique rigide :

```text
≈ 250–350 € / mois
Automatisation simple, faible criticité, faible volume, surveillance légère.

≈ 400–700 € / mois
Workflow métier important, plusieurs intégrations, interventions plus régulières.

≈ 700 €+ / mois
Système critique, plusieurs workflows, fort volume ou niveau de service supérieur.
```

Ces montants sont des hypothèses commerciales internes à recalibrer avec les projets réellement signés et exploités.

Les coûts variables restent séparés :

- LLM ;
- OCR ;
# 14. Page Services — AI Care séparé

Ne pas afficher AI Care comme une alternative équivalente aux trois offres de build.

Créer une section après les offres principales.

## Eyebrow

```text
// APRÈS LA MISE EN PRODUCTION
```

## Titre

```text
Le système doit continuer à fonctionner.
```

## Carte ou bloc

```text
AI Care
À partir de 250 € HT / mois
```

Texte :

> Monitoring, maintenance, support, suivi des coûts et adaptations mineures pour les systèmes qui ont besoin d'être exploités dans la durée.

CTA :

```text
Découvrir AI Care
```

---

# 15. Page Services — déroulé commercial

Conserver une logique en quatre temps, mais modifier légèrement les intitulés.

## 01 — Diagnostic

```text
Comprendre le workflow, son volume, ses outils et la friction réelle.
```

## 02 — Cadrage

```text
Définir la cible, ce qui doit être automatisé, ce qui reste humain et comment mesurer le résultat.
```

Pour les sujets complexes :

```text
Un Blueprint facturable peut être proposé lorsque le cadrage nécessite un travail approfondi avant devis.
```

## 03 — Construction & intégration

```text
Développer uniquement le niveau de système nécessaire et le tester sur des cas réels.
```

## 04 — Exploitation & mesure

```text
Mettre en production, mesurer et maintenir lorsque le workflow le justifie.
```

---

# 16. CTA global

## Eyebrow

```text

2026-09-18T20:40:49.318011Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '1,150p' app/components/ui/ZCard.vue; printf '\\n---ROOT TOKENS---\\n'; rg -n -- \"--(space|fs|border|radius|opacity|icon|lh|accent)\" app/assets/scss/abstract/_root.scss | head -160; printf '\\n---DIFF CHECK---\\n'; git diff --check -- docs/implementation-artifacts/code-reviews/15-3/full.diff; printf '\\n---STAT---\\n'; awk '/"'^diff --git /{f++} /''^'"\\+["'^+]/ {a++} /''^-[''^-]/ {d++} END{print "files=" f, "added=" a, "removed=" d}'"' docs/implementation-artifacts/code-reviews/15-3/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <component
    :is="as"
    ref="cardRef"
    v-bind="rootAttrs"
    class="zcard"
    :class="{
      'zcard--pad': padded,
      'zcard--interactive': interactive,
      'zcard--accent': accent,
      'zcard--featured': featured,
      'zcard--tilt': tilt,
    }"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
// Primitive carte du DS — surface discrète, 3D tilt interactif optionnel.
// Porté de docs/design_system/components/core/Card.jsx et Home - Awwwards.html.
import type { Component, ComponentPublicInstance } from "vue";
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, watch } from "vue";

defineOptions({
  inheritAttrs: false,
});

interface Props {
  /** Rendre la carte interactive (hover state, clickable). @default false */
  interactive?: boolean;
  /** Filet supérieur dégradé accent (story 2.4). @default false */
  accent?: boolean;
  /** Variante mise en valeur (bordure accent, glow). @default false */
  featured?: boolean;
  /** Padding interne (var(--space-6)). Désactivable pour cartes média. @default true */
  padded?: boolean;
  /** Élément rendu (polymorphe). @default "div" */
  as?: string | Component;
  /** Activer l'effet 3D tilt sur mousemove. @default false */
  tilt?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  interactive: false,
  accent: false,
  featured: false,
  padded: true,
  as: "div",
  tilt: false,
});

const attrs = useAttrs();
const cardRef = ref<Element | ComponentPublicInstance | null>(null);
const isReducedMotion = ref(false);
let motionMq: MediaQueryList | null = null;

function onMotionChange(e: MediaQueryListEvent) {
  isReducedMotion.value = e.matches;
  if (e.matches) {
    onMouseLeave();
  }
}

onMounted(() => {
  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  isReducedMotion.value = motionMq.matches;
  motionMq.addEventListener("change", onMotionChange);
});

onBeforeUnmount(() => {
  motionMq?.removeEventListener("change", onMotionChange);
});

function onMouseMove(event: MouseEvent) {
  if (!props.tilt || isReducedMotion.value || !cardRef.value) {
    return;
  }
  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
    return;
  }
  const el = ((cardRef.value as ComponentPublicInstance).$el ?? cardRef.value) as HTMLElement | null;
  if (!el || !(el instanceof HTMLElement)) {
    return;
  }
  const rect = el.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return;
  }
  const px = (event.clientX - rect.left) / rect.width - 0.5;
  const py = (event.clientY - rect.top) / rect.height - 0.5;
  el.style.transform = `perspective(800px) rotateX(${-py * 6}deg) rotateY(${px * 8}deg) translateY(-4px)`;
}

function onMouseLeave() {
  if (cardRef.value) {
    const el = ((cardRef.value as ComponentPublicInstance).$el ?? cardRef.value) as HTMLElement | null;
    if (el instanceof HTMLElement) {
      el.style.transform = "";
    }
  }
}

watch(
  () => props.tilt,
  (newVal) => {
    if (!newVal) {
      onMouseLeave();
    }
  },
);

// `as` accepte une balise native ("div", "article") ou une référence de composant
// (ex. NuxtLink importé de "#components") ; ne pas passer un nom de composant en chaîne.
const isNativeButton = computed(() => props.as === "button");
const rootAttrs = computed(() => {
  if (!isNativeButton.value) {
    return attrs;
  }

  return {
    ...attrs,
    type: typeof attrs.type === "string" ? attrs.type : "button",
  };
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block--modifier) portée depuis Card.jsx */
.zcard {
  position: relative;
  overflow: hidden;
  background: var(--bg-card);
  color: var(--text-body);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-2), var(--shadow-hairline);
  transition:
    border-color var(--dur-base) var(--ease-standard),
    transform var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-standard);
}

.zcard--tilt {
  transform-style: preserve-3d;
  will-change: transform;
}


---ROOT TOKENS---
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
106:  --fs-xs: 0.75rem; // 12
107:  --fs-sm: 0.875rem; // 14
108:  --fs-base: 1rem; // 16
109:  --fs-md: 1.125rem; // 18
110:  --fs-lg: 1.25rem; // 20
111:  --fs-xl: 1.5rem; // 24
112:  --fs-2xl: 1.75rem; // 28
113:  --fs-3xl: 2rem; // 32
114:  --fs-4xl: 2.5rem; // 40
115:  --fs-5xl: 3rem; // 48
116:  --fs-6xl: 3.5rem; // 56
125:  --lh-tight: 1.1;
126:  --lh-snug: 1.3;
127:  --lh-normal: 1.5;
128:  --lh-relaxed: 1.65;
139:  --space-0: 0;
140:  --space-1: 0.25rem; // 4
141:  --space-2: 0.5rem; // 8
142:  --space-3: 0.75rem; // 12
143:  --space-4: 1rem; // 16
144:  --space-5: 1.25rem; // 20
145:  --space-6: 1.5rem; // 24
146:  --space-8: 2rem; // 32
147:  --space-10: 2.5rem; // 40
148:  --space-12: 3rem; // 48
149:  --space-16: 4rem; // 64
150:  --space-20: 5rem; // 80
151:  --space-24: 6rem; // 96
161:  --gutter: var(--space-6);
166:  --radius-none: 0;
167:  --radius-xs: 3px;
168:  --radius-sm: 5px; // fenêtre terminal, chips
169:  --radius-md: 8px; // cartes, inputs, boutons
170:  --radius-lg: 12px; // grands panneaux
171:  --radius-xl: 18px;
172:  --radius-pill: 999px;
173:  --radius-circle: 50%;
191:  --ring-accent: 0 0 0 3px var(--accent-ring);
206:  --atmos-fallback-accent: var(--accent-soft);
207:  --atmos-fallback-accent-2: var(--accent-2-soft);
245:  --accent-text: var(--ink-on-accent);
246:  --border-subtle: var(--line-subtle);
247:  --border-default: var(--line);
248:  --border-strong: var(--line-strong);
251:  --accent: hsl(24deg 95% 44%);
252:  --accent-hover: hsl(24deg 95% 48%);
253:  --accent-active: hsl(24deg 95% 40%);
254:  --accent-soft: hsl(24deg 94% 53% / 10%);
255:  --accent-ring: hsl(24deg 94% 53% / 35%);
256:  --accent-2: hsl(319deg 33% 40%);
257:  --accent-2-soft: hsl(319deg 40% 40% / 15%);
269:  --atmos-fallback-accent: color-mix(in srgb, var(--accent) 22%, transparent);
270:  --atmos-fallback-accent-2: color-mix(in srgb, var(--accent-2) 20%, transparent);
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
316:  --accent-text: var(--ink-on-accent);

---DIFF CHECK---

---STAT---
files=4 added=296 removed=50

2026-09-18T20:40:54.775820Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "cat /Users/simon/.codex/skills/bmad-code-review/steps/step-03-triage.md && printf '\\n---GIT BASE STATUS---\\n' && git status --short && printf '\\n---FULL DIFF SEARCH HARD-CODE/A11Y---\\n' && rg -n \"font-size: [0-9]|opacity: [0-9]|border-(top|left): [0-9]|content:|<p class=\\\"eyebrow|<h[234]\" docs/implementation-artifacts/code-reviews/15-3/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
---

# Step 3: Triage

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

## INSTRUCTIONS

1. **Normalize** findings from all layers into a unified list where each finding has:
   - `id` -- sequential integer
   - `source` -- the `id` of the layer that produced the finding (e.g., `blind-hunter`), or merged sources joined with `+` (e.g., `blind-hunter+edge-case-hunter`)
   - `title` -- one-line summary
   - `detail` -- full description
   - `location` -- file and line reference (if available)

2. **Deduplicate.** Deduplicate only findings with the same claim and same required action. If two or more findings meet both conditions, merge them into one:
   - Use the most specific finding as the base (prefer findings with a precise location over prose-only findings).
   - Append any unique detail, reasoning, or location references from the other finding(s) into the surviving `detail` field.
   - Set `source` to the merged sources (e.g., `blind-hunter+edge-case-hunter`).

3. Then evaluate each remaining finding independently. Do not reject a finding because a related finding was rejected.

4. **Read the code before rating.** Before assigning severity, open the source at each finding's location and read enough surrounding code to judge reachability -- call sites, guards, and validation that live outside the diff hunk. Do not rate from the diff hunk alone. Severity reflects the real consequence at a real call site, not the worst theoretical reading.

5. **Assign severity** to each finding by consequence for the artifact's main consumer (software user, document reader, etc).
   Disregard any severity assigned by a reviewing subagent. Review subagents operate under by-design information asymmetry and do not have enough context to set final severity for this workflow.
   - `low` -- none or cosmetic
   - `medium` -- tolerable
   - `high` -- intolerable

6. **Route** each finding into exactly one triage bucket:
   - **decision_needed** -- There is an ambiguous choice that requires human input. The code cannot be correctly patched without knowing the user's intent. Only possible if `{review_mode}` = `"full"`.
   - **patch** -- Code issue that is fixable without human input. The correct fix is unambiguous.
   - **defer** -- Pre-existing issue not caused by the current change. Real but not actionable now.
   - **dismiss** -- Noise, false positive, or handled elsewhere.

   If `{review_mode}` = `"no-spec"` and a finding would otherwise be `decision_needed`, reclassify it as `patch` (if the fix is unambiguous) or `defer` (if not).

7. **Drop** all `dismiss` findings. Record the dismiss count for the summary.

8. If `{failed_layers}` is non-empty, report which layers failed before announcing results. If zero findings remain after dropping dismissed AND `{failed_layers}` is non-empty, warn the user that the review may be incomplete rather than announcing a clean review.

9. If zero findings remain after triage (all rejected or none raised): state "✅ Clean review — all layers passed." (Step 3 already warned if any review layers failed via `{failed_layers}`.)

## NEXT

Read fully and follow `./step-04-present.md`

---GIT BASE STATUS---
 M app/pages/services.vue
 M docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md
 M docs/implementation-artifacts/deferred-work.md
 M docs/implementation-artifacts/sprint-status.yaml
?? docs/implementation-artifacts/code-reviews/15-3/

---FULL DIFF SEARCH HARD-CODE/A11Y---
12:         <p class="eyebrow"><span aria-hidden="true">// </span>services</p>
22:+        <p class="eyebrow"><span aria-hidden="true">// </span>après la mise en production</p>
23:+        <h2 class="care-section__title">Le système doit continuer à fonctionner.</h2>
36:+            <h3 class="care-card__title">{{ careOffer.title }}</h3>
61:+            <h4 class="care-card__points-title">Inclus dans l’accompagnement :</h4>
73:         <p class="eyebrow"><span aria-hidden="true">// </span>comment ça se passe</p>
74:         <h2 class="process__title">Un déroulé simple en quatre temps</h2>
265:+  justify-content: center;
269:+  font-size: 22px;
295:+  border-left: 1px solid var(--border-subtle);
322:+    content: "→";
334:+  border-top: 1px solid var(--border-subtle);
355:+  opacity: 0.85;
382:+    border-top: 1px solid var(--border-subtle);
406:-  - [ ] Insérer l'eyebrow standard `<p class="eyebrow"><span aria-hidden="true">// </span>après la mise en production</p>`.
435:+  - [x] Insérer l'eyebrow standard `<p class="eyebrow"><span aria-hidden="true">// </span>après la mise en production</p>`.

2026-09-18T20:40:59.708691Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc 'cat /Users/simon/.codex/skills/bmad-code-review/steps/step-04-present.md' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
deferred_work_file: '{implementation_artifacts}/deferred-work.md'
---

# Step 4: Present and Act

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- When `{spec_file}` is set, always write findings to the story file before offering action choices.
- `decision-needed` findings must be resolved before handling `patch` findings.

## INSTRUCTIONS

### 1. Clean review shortcut

If zero findings remain after triage (all dismissed or none raised): state that and proceed to section 6 (Sprint Status Update).

### 2. Write findings to the story file

If `{spec_file}` exists and contains a Tasks/Subtasks section, append a `### Review Findings` subsection. Write all findings in this order:

1. **`decision-needed`** findings (unchecked):
   `- [ ] [Review][Decision] <Title> — <Detail>`

2. **`patch`** findings (unchecked):
   `- [ ] [Review][Patch] <Title> [<file>:<line>]`

3. **`defer`** findings (checked off, marked deferred):
   `- [x] [Review][Defer] <Title> [<file>:<line>] — deferred, pre-existing`

Also append each `defer` finding to `{deferred_work_file}` under a heading `## Deferred from: code review ({date})`. If `{spec_file}` is set, include its basename in the heading (e.g., `code review of story-3.3 (2026-03-18)`). One bullet per finding with description.

### 3. Present summary

Announce what was written:

> **Code review complete.** <D> `decision-needed`, <P> `patch`, <W> `defer`, <R> dismissed as noise.

If `{spec_file}` is set, add: `Findings written to the review findings section in {spec_file}.`
Otherwise add: `Findings are listed above. No story file was provided, so nothing was persisted.`

### 4. Resolve decision-needed findings

If `decision_needed` findings exist, present each one with its detail and the options available. The user must decide — the correct fix is ambiguous without their input. Walk through each finding (or batch related ones) and get the user's call. Once resolved, each becomes a `patch`, `defer`, or is dismissed.

If the user chooses to defer, ask: Quick one-line reason for deferring this item? (helps future reviews): — then append that reason to both the story file bullet and the `{deferred_work_file}` entry.

**HALT** — I am waiting for your numbered choice. Reply with only the number. Do not proceed until you select an option.

### 5. Handle `patch` findings

If `patch` findings exist (including any resolved from step 4), HALT. Ask the user:

If `{spec_file}` is set, present all three options:

> **How would you like to handle the `<P>` `patch` findings?**
> 1. **Apply every patch** — fix all of them now, no per-finding confirmation. Defer and decision-needed items are not touched.
> 2. **Leave as action items** — they are already in the story file
> 3. **Walk through each patch** — show details for each before deciding

If `{spec_file}` is **not** set, present only options 1 and 2 (omit "Leave as action items" — findings were not written to a file):

> **How would you like to handle the `<P>` `patch` findings?**
> 1. **Apply every patch** — fix all of them now, no per-finding confirmation. Defer and decision-needed items are not touched.
> 2. **Walk through each patch** — show details for each before deciding

**HALT** — I am waiting for your numbered choice. Reply with only the number. Do not proceed until you select an option.

- **Apply every patch**: Apply every patch finding without per-finding confirmation. Do not modify defer or decision-needed items. After all patches are applied, present a summary of changes made. If `{spec_file}` is set, check off the patch items in the story file (leave defer items as-is).
- **Leave as action items** (only when `{spec_file}` is set): Done — findings are already written to the story.
- **Walk through each patch**: Present each finding with full detail, diff context, and suggested fix. After walkthrough, re-offer the applicable options above.

  **HALT** — I am waiting for your numbered choice. Do not proceed until you select an option.

**✅ Code review actions complete**

- Decision-needed resolved: <D>
- Patches handled: <P>
- Deferred: <W>
- Dismissed: <R>

### 6. Update story status and sync sprint tracking

Skip this section if `{spec_file}` is not set.

#### Determine new status based on review outcome

- If all `decision-needed` and `patch` findings were resolved (fixed or dismissed) AND no unresolved `high`/`medium` findings remain: set `{new_status}` = `done`. Update the story file Status section to `done`.
- If `patch` findings were left as action items, or unresolved issues remain: set `{new_status}` = `in-progress`. Update the story file Status section to `in-progress`.

Save the story file.

#### Sync sprint-status.yaml

If `{story_key}` is not set, skip this subsection and note that sprint status was not synced because no story key was available.

If `{sprint_status}` file exists:

1. Load the FULL `{sprint_status}` file.
2. Find the `development_status` entry matching `{story_key}`.
3. If found: update `development_status[{story_key}]` to `{new_status}`. Update `last_updated` to current date. Save the file, preserving ALL comments and structure including STATUS DEFINITIONS.
4. If `{story_key}` not found in sprint status: warn the user that the story file was updated but sprint-status sync failed.

If `{sprint_status}` file does not exist, note that story status was updated in the story file only.

#### Completion summary

> **Review Complete!**
>
> **Story Status:** `{new_status}`
> **Issues Fixed:** <fixed_count>
> **Action Items Created:** <action_count>
> **Deferred:** <W>
> **Dismissed:** <R>

### 7. Next steps

Present the user with follow-up options:

> **What would you like to do next?**
> 1. **Start the next story** — run `dev-story` to pick up the next `ready-for-dev` story
> 2. **Re-run code review** — address findings and review again
> 3. **Done** — end the workflow

**HALT** — I am waiting for your choice. Do not proceed until the user selects an option.

## On Complete

Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow.on_complete`

If the resolved `workflow.on_complete` is non-empty, follow it as the final terminal instruction before exiting.

2026-09-18T20:41:02.288108Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
Les exigences fonctionnelles et le JSON-LD correspondent au texte attendu. Deux points restent à trancher par vérification : la conformité stricte des nouveaux styles aux tokens et la réalité de la gate Docker annoncée dans la story. Je lance uniquement la validation prévue par le projet, dans Docker.
exec
/bin/zsh -lc 'docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"' in /Users/simon/dev/jouan.ovh
2026-09-18T20:41:12.476153Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
2026-09-18T20:41:19.197911Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
2026-09-18T20:41:26.609845Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
 succeeded in 15244ms:
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

[@nuxt/content] ✔ Processed 2 collections and 1 files in 9.26ms (0 cached, 1 parsed)

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
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/manifest.json                                        34.97 kB │ gzip:   2.78 kB
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
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/services.ClqnBLKy.css                           6.84 kB │ gzip:   1.24 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/entry.Dla0HiAk.css                             13.24 kB │ gzip:   4.04 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/default.CrVG7B4r.css                           15.56 kB │ gzip:   3.13 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/index.C-IV2i1o.css                             23.56 kB │ gzip:   4.08 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DlAUqK2U.js                                     0.09 kB │ gzip:   0.10 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BVRJhc02.js                                     0.17 kB │ gzip:   0.15 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DDQN75CI.js                                     0.21 kB │ gzip:   0.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CJ7T2MII.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/QxShBHvE.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CM8XL0nd.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DEc9Ulj4.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BvfkPJXR.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/2474gcoo.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DWi-4PCg.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Dx4naPQz.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/eA1gtUtE.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DcTKWkzI.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DiDz6-cG.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/RPsdxQ65.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/C-D1qVCo.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/W2BHMj_G.js                                     0.26 kB │ gzip:   0.22 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DvM3Kzi2.js                                     0.38 kB │ gzip:   0.27 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/29oWFA_E.js                                     0.41 kB │ gzip:   0.25 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D81wsGBf.js                                     0.48 kB │ gzip:   0.36 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/B1blzbO4.js                                     0.49 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DMSqBACR.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BSRPe306.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CelNvSDM.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BUsdfHc6.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BlCUUDsB.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CGOP6yJA.js                                     0.51 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DuTkPXe7.js                                     0.63 kB │ gzip:   0.37 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DcgJVay1.js                                     0.64 kB │ gzip:   0.42 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BYE98ulg.js                                     0.87 kB │ gzip:   0.54 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DBNuaWkU.js                                     1.20 kB │ gzip:   0.66 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Cp82qgR3.js                                     1.30 kB │ gzip:   0.58 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DuPX6mMt.js                                     1.31 kB │ gzip:   0.75 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Bps0on9e.js                                     1.71 kB │ gzip:   0.92 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/kWjoI0GX.js                                     2.83 kB │ gzip:   1.36 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Bna4Zkba.js                                     3.37 kB │ gzip:   1.49 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BAGvSi-_.js                                     3.48 kB │ gzip:   1.56 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DzPCHDxi.js                                     3.79 kB │ gzip:   1.71 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Siykoj70.js                                     3.84 kB │ gzip:   1.84 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Dpiq1lm6.js                                     4.93 kB │ gzip:   2.00 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/QinVlqs1.js                                     5.67 kB │ gzip:   2.26 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DvBc1lXS.js                                     5.88 kB │ gzip:   2.60 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CrSzw0Qr.js                                     6.67 kB │ gzip:   2.95 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BhgsEaX6.js                                     7.97 kB │ gzip:   3.01 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Bo2pUkSw.js                                     8.33 kB │ gzip:   3.51 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DpQib7pM.js                                     8.54 kB │ gzip:   3.65 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BmwvGIRf.js                                    10.10 kB │ gzip:   3.92 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CLb-k2zN.js                                    10.85 kB │ gzip:   4.23 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DMvA1tXJ.js                                    12.40 kB │ gzip:   4.91 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/B7wo1Oiy.js                                    25.24 kB │ gzip:   8.76 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/2vrfCc6i.js                                    33.07 kB │ gzip:  12.07 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Ce1To2g4.js                                    50.26 kB │ gzip:  20.39 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CQc0FpYx.js                                   191.28 kB │ gzip:  72.31 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BYu-VCuL.js                                   199.77 kB │ gzip:  59.04 kB
ℹ ✓ built in 2.44s
✔ Client built in 2447ms
ℹ Building server...
ℹ vite v7.3.5 building ssr environment for production...
ℹ transforming...
ℹ ✓ 413 modules transformed.
ℹ rendering chunks...
ℹ ✓ built in 2.43s
✔ Server built in 2435ms
[nitro] ℹ Initializing prerenderer
[nitro] ℹ Prerendering 4 initial routes with crawler
[nitro]   ├─ /200.html (53ms)
[nitro]   ├─ /404.html (53ms)
[nitro]   ├─ / (63ms)
[nitro]   ├─ /__nuxt_content/blog/sql_dump.txt (63ms)
[nitro]   ├─ /confidentialite (38ms)
[nitro]   ├─ /about (39ms)
[nitro]   ├─ /services (40ms)
[nitro]   ├─ /mentions-legales (39ms)
[nitro]   ├─ /contact (40ms)
[nitro]   ├─ /blog (41ms)
[nitro]   ├─ /contact/card (38ms)
[nitro]   ├─ /_ipx/s_24x24/images/logo_black_256x256.png (68ms)
[nitro]   ├─ /_ipx/f_webp&s_380x214/images/projects/keova-signal-dashboard.png (89ms)
[nitro]   ├─ /_ipx/s_48x48/images/logo_black_256x256.png (68ms)
[nitro]   ├─ /_ipx/s_44x44/images/logo_white.png (78ms)
[nitro]   ├─ /_ipx/s_22x22/images/logo_black_256x256.png (76ms)
[nitro]   ├─ /_ipx/s_24x24/images/logo_white.png (75ms)
[nitro]   ├─ /_ipx/_/images/portrait.jpeg (50ms)
[nitro]   ├─ /_ipx/f_webp&s_380x214/images/projects/debrief-dashboard.png (156ms)
[nitro]   ├─ /_ipx/s_48x48/images/logo_white.png (74ms)
[nitro]   ├─ /_ipx/s_22x22/images/logo_white.png (80ms)
[nitro]   ├─ /_ipx/s_44x44/images/logo_black_256x256.png (79ms)
[nitro]   ├─ /_ipx/s_220x165/images/undraw_code_thinking_re_gka2.svg (87ms)
[nitro]   ├─ /_ipx/s_440x330/images/undraw_code_thinking_re_gka2.svg (90ms)
[nitro]   ├─ /_ipx/s_240x240/images/qr-code.svg (98ms)
[nitro]   ├─ /_ipx/s_480x480/images/qr-code.svg (98ms)
[nitro]   ├─ /_ipx/f_webp&s_760x428/images/projects/debrief-dashboard.png (156ms)
[nitro]   ├─ /_ipx/f_webp&s_760x428/images/projects/keova-signal-dashboard.png (156ms)
[nitro] ℹ Prerendered 28 routes in 2.678 seconds
[nitro] ✔ Generated public .output/public
[nitro] ✔ You can preview this build using npx serve .output/public
│
└  ✨ You can now deploy .output/public to any static hosting!

exec
/bin/zsh -lc "rg -o 'id=\"ai-care\"|services#(automatisation|workflow|sur-mesure|ai-care)|À partir de 250["'^<]*|MAINTIEN EN CONDITION OPÉRATIONNELLE|Découvrir AI Care'"' .output/public/services/index.html | head -30; printf '\\n---OUTPUT STATUS---\\n'; git status --short" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
services#automatisation
services#workflow
services#sur-mesure
services#ai-care
À partir de 250 € HT / mois"}}}]}}
id="ai-care"
MAINTIEN EN CONDITION OPÉRATIONNELLE
À partir de 250 € HT / mois
Découvrir AI Care

---OUTPUT STATUS---
 M app/pages/services.vue
 M docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md
 M docs/implementation-artifacts/deferred-work.md
 M docs/implementation-artifacts/sprint-status.yaml
?? docs/implementation-artifacts/code-reviews/15-3/

2026-09-18T20:41:30.685423Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
- **Typographie de l’icône AI Care codée en dur** — Violation de l’AC-3 et de la contrainte Design System « tokens uniquement » (`project-context.md`, section SCSS). Le diff ajoute `font-size: 22px` dans [`app/pages/services.vue:548`](/Users/simon/dev/jouan.ovh/app/pages/services.vue:548), alors que la typographie doit utiliser un token `var(--fs-*)`.

Validation Docker effectuée avec succès : lint, typecheck et génération statique des 28 routes. Aucun autre écart d’acceptation identifié.
tokens used
69 997
- **Typographie de l’icône AI Care codée en dur** — Violation de l’AC-3 et de la contrainte Design System « tokens uniquement » (`project-context.md`, section SCSS). Le diff ajoute `font-size: 22px` dans [`app/pages/services.vue:548`](/Users/simon/dev/jouan.ovh/app/pages/services.vue:548), alors que la typographie doit utiliser un token `var(--fs-*)`.

Validation Docker effectuée avec succès : lint, typecheck et génération statique des 28 routes. Aucun autre écart d’acceptation identifié.
