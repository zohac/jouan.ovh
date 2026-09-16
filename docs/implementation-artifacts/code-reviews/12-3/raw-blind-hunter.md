Reading prompt from stdin...
2026-09-16T20:45:45.276260Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: medium
reasoning summaries: none
session id: 01a0abf7-e755-7761-991b-bc2aa36634d1
--------
user
# Blind Hunter Prompt — Story 12.3

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/12-3/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
I’ll use `bmad-review-adversarial-general` for this pass and read the diff directly, then I’ll keep the output to findings only as requested.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/dev/jouan.ovh/.agents/skills/bmad-review-adversarial-general/SKILL.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
name: bmad-review-adversarial-general
description: 'Perform a Cynical Review and produce a findings report. Use when the user requests a critical review of something'
---

# Adversarial Review (General)

**Goal:** Cynically review content and produce findings.

**Your Role:** You are a cynical, jaded reviewer with zero patience for sloppy work. The content was submitted by a clueless weasel and you expect to find problems. Be skeptical of everything. Look for what's missing, not just what's wrong. Use a precise, professional tone — no profanity or personal attacks.

**Inputs:**
- **content** — Content to review: diff, spec, story, doc, or any artifact
- **also_consider** (optional) — Areas to keep in mind during review alongside normal adversarial analysis


## EXECUTION

### Step 1: Receive Content

- Load the content to review from provided input or context
- If content to review is empty, ask for clarification and abort
- Identify content type (diff, branch, uncommitted changes, document, etc.)

### Step 2: Adversarial Analysis

Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content.

### Step 3: Present Findings

Output findings as a Markdown list (descriptions only).


## HALT CONDITIONS

- HALT if zero findings — this is suspicious, re-analyze or ask for guidance
- HALT if content is empty or unreadable

exec
/bin/zsh -lc "sed -n '1,260p' docs/implementation-artifacts/code-reviews/12-3/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
diff --git a/app/pages/index.vue b/app/pages/index.vue
index c513732..755db7b 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -11,16 +11,21 @@
         <div class="hero__grid">
           <!-- Colonne gauche : accroche commerciale, badge dispo, CTAs -->
           <div class="anim hero__text">
-            <p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>
-            <h1 class="hero__title">Développeur Full Stack <em>TypeScript</em></h1>
+            <h2 class="eyebrow">
+              <span aria-hidden="true">// </span>DÉVELOPPEUR FULL STACK · SYSTÈMES IA &amp; AUTOMATISATION
+            </h2>
+            <h1 class="hero__title">Automatisez les workflows qui freinent votre équipe.</h1>
             <p class="hero__sub">
-              Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De
-              l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.
+              Je conçois des agents IA, automatisations et applications métier qui s’intègrent à vos outils existants —
+              de l’identification du problème jusqu’à la mise en production.
+            </p>
+            <p class="hero__credibility">
+              Full Stack TypeScript · Agents IA · APIs · PostgreSQL · MCP · IA locale · QA
             </p>
 
             <div class="hero__badge-wrap">
               <span class="hero__pulse-dot" aria-hidden="true" />
-              <span>Disponible pour missions freelance</span>
+              <span>Disponible pour nouvelles missions freelance</span>
               <template v-if="SITE.profile.maltUrl">
                 <span aria-hidden="true"> · </span>
                 <ZExternalLink :href="SITE.profile.maltUrl"> Profil Malt vérifié </ZExternalLink>
@@ -29,10 +34,10 @@
 
             <div class="hero__cta">
               <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
-                Discuter de votre projet
+                Identifier un workflow à automatiser
                 <template #iconRight><ZIcon name="arrow" /></template>
               </ZButton>
-              <ZButton :as="NuxtLink" to="/about" variant="secondary" size="lg"> Voir le parcours &amp; CV </ZButton>
+              <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir mes systèmes IA </ZButton>
             </div>
           </div>
 
@@ -47,11 +52,11 @@
       </div>
     </section>
 
-    <!-- Vitrine des 3 services cibles (Story 11.3 / AC-2) -->
+    <!-- Vitrine des 3 services cibles (Story 12.3 / AC-1) -->
     <section class="section">
       <div class="container">
         <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
-        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos applications</h2>
+        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos systèmes</h2>
         <ul class="grid-3">
           <li v-for="service in services" :key="service.id">
             <ZCard class="offer" interactive tilt :accent="service.featured" :featured="service.featured">
@@ -84,6 +89,34 @@
       </div>
     </section>
 
+    <!-- Bloc différenciateur « Prototype → Production » (Story 12.3 / AC-2) -->
+    <section class="section section--sunken diff-block">
+      <div class="container">
+        <p class="eyebrow"><span aria-hidden="true">// </span>au-delà de la démo</p>
+        <h2 class="section__title diff-block__title">
+          Un agent qui fonctionne trois fois n’est pas encore un système fiable.
+        </h2>
+        <p class="prose diff-block__lead">
+          Mon background Full Stack et QA me permet de traiter ce qui arrive après le prototype : authentification,
+          permissions, données, erreurs, retries, logs, tests, coûts, monitoring, sécurité et supervision humaine.
+          L’objectif n’est pas de mettre de l’IA partout. L’objectif est de construire un workflow qui reste utile
+          lorsqu’il rencontre la vraie vie.
+        </p>
+
+        <ul class="pillars-grid">
+          <li v-for="pillar in pillars" :key="pillar.id">
+            <ZCard class="pillar" padded interactive tilt>
+              <div class="pillar__icon">
+                <ZIcon :name="pillar.icon" />
+              </div>
+              <h3 class="pillar__title">{{ pillar.title }}</h3>
+              <p class="pillar__desc">{{ pillar.desc }}</p>
+            </ZCard>
+          </li>
+        </ul>
+      </div>
+    </section>
+
     <!-- Projets sélectionnés & Statistiques de réassurance (Story 11.4 / AC-1 & AC-2) -->
     <section class="section">
       <div class="container">
@@ -289,7 +322,7 @@ function onProjectMouseLeave(event: MouseEvent) {
 interface HomeServiceOffer {
   id: string;
   no: string;
-  icon: "code" | "layers" | "spark";
+  icon: "code" | "layers" | "spark" | "bot" | "terminal" | "zap";
   title: string;
   desc: string;
   points: string[];
@@ -298,55 +331,90 @@ interface HomeServiceOffer {
   featured: boolean;
 }
 
-// Vitrine des 3 offres ciblées Full Stack TS (Story 11.3 / AC-2).
+interface ProductionPillar {
+  id: string;
+  icon: "code" | "layers" | "spark" | "bot" | "terminal" | "zap";
+  title: string;
+  desc: string;
+}
+
+// Vitrine des 3 offres ciblées Systèmes IA & Automatisation (Story 12.3 / AC-1).
 const services: HomeServiceOffer[] = [
   {
-    id: "creation",
+    id: "automation",
     no: "01 / 03",
-    icon: "code",
-    title: "Création d'applications web & SaaS",
-    desc: "De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.",
+    icon: "layers",
+    title: "Automatisation de processus métier",
+    desc: "Cartographie d'un workflow existant, identification des tâches répétitives et construction du système qui automatise ce qui mérite réellement de l'être.",
     points: [
-      "Architecture logicielle & APIs REST",
-      "Applications Vue 3 / Nuxt 4 & NestJS",
-      "Intégration Stripe & PostgreSQL",
+      "Cartographie de flux & connecteurs d'APIs",
+      "Ingestion, enrichissement et traitement de données",
+      "Synchronisation d'outils métier & reporting",
     ],
-    tags: ["Nuxt", "NestJS", "PostgreSQL", "Stripe Connect"],
-    price: "Sur devis / au sprint",
+    tags: ["Workflow", "APIs", "Automation", "PostgreSQL"],
+    price: "À partir de 3 500 € HT",
     featured: false,
   },
   {
-    id: "fullstack",
+    id: "agents",
     no: "02 / 03",
-    icon: "layers",
-    title: "Développement Full Stack TypeScript",
-    desc: "Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.",
+    icon: "bot",
+    title: "Agents IA intégrés à vos outils",
+    desc: "Intégration d'agents outillés dans vos flux existants pour lire, interpréter, synthétiser et décider sans casser vos habitudes de travail.",
     points: [
-      "Composants Vue 3 / Nuxt avec TypeScript strict",
-      "Microservices & backend modulaire NestJS",
-      "Fiabilisation et optimisation des performances",
+      "Agents outillés (Tool Calling) & serveurs MCP",
+      "Extraction structurée & analyse documentaire",
+      "Supervision humaine obligatoire (Human-in-the-loop)",
     ],
-    tags: ["TypeScript", "Vue 3", "Nuxt", "NestJS", "Node.js"],
-    price: "Sur devis / TJM",
+    tags: ["Agents IA", "LLM", "MCP", "Human-in-the-loop"],
+    price: "À partir de 3 500 € HT",
     featured: true,
   },
   {
-    id: "evolution",
+    id: "apps",
     no: "03 / 03",
-    icon: "spark",
-    title: "Évolution & Architecture applicative",
-    desc: "Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).",
+    icon: "code",
+    title: "Applications IA sur mesure",
+    desc: "Développement complet de solutions logicielles dédiées quand le workflow nécessite une interface, un backend robuste et une base de données sur mesure.",
     points: [
-      "Audits techniques de code & migrations de versions",
-      "Tests E2E TestCafé & tests unitaires Vitest",
-      "Pipelines CI/CD & conteneurisation Docker",
+      "Applications web complètes Nuxt & NestJS",
+      "Applications desktop sécurisées Tauri (IA locale)",
+      "Architecture PostgreSQL, tests QA & déploiement",
     ],
-    tags: ["TestCafé", "Vitest", "Docker", "CI/CD"],
-    price: "Au forfait / audit",
+    tags: ["TypeScript", "Nuxt", "NestJS", "PostgreSQL", "Tauri"],
+    price: "Sur mesure / Sprint",
     featured: false,
   },
 ];
 
+// 4 Piliers d'industrialisation « Prototype → Production » (Story 12.3 / AC-2).
+const pillars: ProductionPillar[] = [
+  {
+    id: "data",
+    icon: "layers",
+    title: "Données",
+    desc: "Provenance, structuration, stockage, rétention, secrets.",
+  },
+  {
+    id: "reliability",
+    icon: "zap",
+    title: "Fiabilité",
+    desc: "Cas limites, retries, fallbacks, tests, observabilité.",
+  },
+  {
+    id: "ai",
+    icon: "bot",
+    title: "IA",
+    desc: "Sorties structurées, versionnage, évaluations, contrôle humain.",
+  },
+  {
+    id: "ops",
+    icon: "terminal",
+    title: "Exploitation",
+    desc: "Monitoring, coûts, support, maintenance, évolution.",
+  },
+];
+
 // Projets sélectionnés — source unique `app/data/site.ts` (Story 11.4 / AC-1).
 const projects = SITE.projects;
 
@@ -464,7 +532,7 @@ usePageSeo({
 
 .hero__sub {
   max-width: 46ch;
-  margin: var(--space-5) 0 var(--space-6);
+  margin: var(--space-5) 0 var(--space-4);
   font-family: var(--font-sans);
   font-size: var(--fs-lg);
   line-height: var(--lh-relaxed);
@@ -472,6 +540,14 @@ usePageSeo({
   text-shadow: 0 1px 8px color-mix(in srgb, var(--surface-0) 70%, transparent);
 }
 
+.hero__credibility {
+  margin: 0 0 var(--space-6);
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  letter-spacing: var(--ls-wide);
+  color: var(--text-muted);
+}
+
 .hero__cta {
   display: flex;
   flex-wrap: wrap;
@@ -664,6 +740,68 @@ usePageSeo({
   }
 }
 
+// ---- Bloc Différenciateur « Prototype → Production » (Story 12.3 / AC-2) ----
+.diff-block__title {
+  max-width: 28ch;
+  margin-bottom: var(--space-4);
+}
+
+.diff-block__lead {
+  max-width: 72ch;
+  margin: 0 0 var(--space-8);
+  font-size: var(--fs-md);
+  line-height: var(--lh-relaxed);

codex
I’ve got the skill instructions and the first part of the diff. I’m going to read the rest so the review is based on the whole patch, not just the headline copy.
exec
/bin/zsh -lc "sed -n '261,620p' docs/implementation-artifacts/code-reviews/12-3/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
+  color: var(--text-body);
+}
+
+.pillars-grid {
+  display: grid;
+  grid-template-columns: repeat(4, 1fr);
+  gap: var(--space-5);
+  margin: 0;
+  padding: 0;
+  list-style: none;
+
+  > li {
+    display: flex;
+  }
+}
+
+.pillar {
+  display: flex;
+  flex-direction: column;
+  width: 100%;
+}
+
+.pillar__icon {
+  display: flex;
+  align-items: center;
+  justify-content: center;
+  width: var(--space-10);
+  height: var(--space-10);
+  margin-bottom: var(--space-4);
+  font-size: var(--fs-xl);
+  color: var(--accent);
+  background: var(--accent-soft);
+  border-radius: var(--radius-md);
+}
+
+.pillar__title {
+  margin: 0 0 var(--space-2);
+  font-family: var(--font-mono);
+  font-size: var(--fs-lg);
+  font-weight: var(--fw-regular);
+  color: var(--text-strong);
+}
+
+.pillar__desc {
+  margin: 0;
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  line-height: var(--lh-normal);
+  color: var(--text-muted);
+}
+
 // ---- Section Projets sélectionnés (porté de Home - Awwwards.html .work) ----
 .work {
   display: flex;
@@ -1057,6 +1195,10 @@ li:last-child .work__row {
     grid-template-columns: 1fr;
   }
 
+  .pillars-grid {
+    grid-template-columns: repeat(2, 1fr);
+  }
+
   .block__head--row {
     flex-direction: column;
     align-items: flex-start;
@@ -1074,6 +1216,7 @@ li:last-child .work__row {
     display: none;
   }
 
+  .pillars-grid,
   .stats {
     grid-template-columns: 1fr;
   }
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 15c84cd..64e81a5 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-16 (Story 12.2 initialisée en ready-for-dev)"
+last_updated: "2026-09-16 (Story 12.3 passée en review)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -130,8 +130,8 @@ development_status:
   # Epic 12 — Repositionnement Commercial V1 : Systèmes IA & Automatisation Métier
   epic-12: in-progress
   12-1-source-unique-de-donnees-sitets-et-coherence-globale: done
-  12-2-homepage-hero-commercial-cinetique-et-terminal-interactif: ready-for-dev
-  12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur: backlog
+  12-2-homepage-hero-commercial-cinetique-et-terminal-interactif: done
+  12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur: review
   12-4-homepage-vitrine-des-3-projets-phares: backlog
   12-5-page-services-restructuration-des-offres-et-process-4-etapes: backlog
   12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide: backlog
diff --git a/docs/implementation-artifacts/12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur.md b/docs/implementation-artifacts/12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur.md
new file mode 100644
index 0000000..67f7ae7
--- /dev/null
+++ b/docs/implementation-artifacts/12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur.md
@@ -0,0 +1,127 @@
+---
+baseline_commit: c7136c64cd1a9dd3de9b7a6689a26000a217af56
+---
+
+# Story 12.3: Page d'accueil — Vitrine des 3 services ciblés & Bloc différenciateur « Prototype → Production »
+
+Status: review
+
+<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
+
+## Story
+
+As a visiteur évaluant l'offre de services sur la page d'accueil,
+I want découvrir les 3 piliers d'accompagnement et les arguments prouvant la viabilité des systèmes déployés,
+so that je distingue le travail industriel d'une simple démonstration de chatbot fragile (FR30, NFR13, UX-DR29).
+
+## Acceptance Criteria
+
+1. **Given** la section vitrine des services dans `app/pages/index.vue`
+   **When** la page est rendue et inspectée
+   **Then** le sur-titre affiche `<p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>`
+   **And** le titre de section affiche `Trois expertises pour concevoir et faire évoluer vos systèmes`
+   **And** la liste sémantique `<ul class="grid-3">` expose 3 cartes structurées `<ZCard class="offer" interactive tilt ...>` avec numérotation terminale `01 / 03`, `02 / 03`, `03 / 03` :
+     1. **Automatisation de processus métier** (`id: "automation"`, icône `layers`, tags `Workflow` · `APIs` · `Automation` · `PostgreSQL`, prix/format `À partir de 3 500 € HT` ou `Format Sprint`)
+     2. **Agents IA intégrés à vos outils** (`id: "agents"`, `featured: true`, icône `bot` ou `spark`, tags `Agents IA` · `LLM` · `MCP` · `Human-in-the-loop`, prix/format `À partir de 3 500 € HT` ou `Format Sprint`)
+     3. **Applications IA sur mesure** (`id: "apps"`, icône `code`, tags `TypeScript` · `Nuxt` · `NestJS` · `PostgreSQL` · `Tauri`, prix/format `Sur mesure / Sprint`)
+   **And** chaque carte oriente directement vers la route Nuxt `/services` (via `<NuxtLink to="/services" ...>` et lien d'action accessible).
+
+2. **Given** le nouveau bloc différenciateur « Prototype → Production » dans `app/pages/index.vue`
+   **When** le visiteur fait défiler la page immédiatement sous la vitrine des services
+   **Then** une section ou un conteneur dédié `.diff-block` (ou `.section--sunken`) expose :
+     - Le sur-titre `<p class="eyebrow"><span aria-hidden="true">// </span>au-delà de la démo</p>`
+     - Le titre de section `<h2>` ou `<h3>` affichant `Un agent qui fonctionne trois fois n’est pas encore un système fiable.`
+     - Le texte explicatif officiel (messaging matrix 4.3) valorisant la culture Full Stack et QA : `Mon background Full Stack et QA me permet de traiter ce qui arrive après le prototype : authentification, permissions, données, erreurs, retries, logs, tests, coûts, monitoring, sécurité et supervision humaine. L’objectif n’est pas de mettre de l’IA partout. L’objectif est de construire un workflow qui reste utile lorsqu’il rencontre la vraie vie.`
+     - Les 4 piliers d'industrialisation balisés sous forme de liste sémantique `<ul class="pillars-grid">` avec cartes `<ZCard :padded="true">` :
+       - **Données :** provenance, structuration, stockage, rétention, secrets. (icône `layers` ou `terminal`)
+       - **Fiabilité :** cas limites, retries, fallbacks, tests, observabilité. (icône `check` ou `zap`)
+       - **IA :** sorties structurées, versionnage, évaluations, contrôle humain. (icône `bot` ou `spark`)
+       - **Exploitation :** monitoring, coûts, support, maintenance, évolution. (icône `terminal` ou `code`)
+
+3. **Given** les critères d'accessibilité (a11y RGAA/WCAG), de responsive et de design tokens
+   **When** la page est affichée sur mobile (< 900px, < 680px), sur desktop ou naviguée au clavier
+   **Then** les grilles `.grid-3` et `.pillars-grid` basculent harmonieusement de 3/4 colonnes à 1 colonne sans débordement horizontal
+   **And** sous `prefers-reduced-motion: reduce`, les effets de tilt 3D sur `ZCard` et transitions dynamiques sont instantanément neutralisés
+   **And** le focus clavier (`Tab`) parcourt les cartes et liens `/services` selon un ordre séquentiel et visible (`:focus-visible` avec outline 2px)
+   **And** aucun emoji n'est injecté dans les templates, textes ou styles (NFR6 / NFR13)
+   **And** tous les styles SCSS consomment exclusivement les tokens de thème `:root` (`var(--token)`).
+
+4. **Given** l'ensemble des modifications de la story
+   **When** on exécute la gate de validation Docker
+   **Then** `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur et les routes statiques pré-rendues.
+
+## Tasks / Subtasks
+
+- [x] Tâche 1 — Mise à jour des données et cartes de la vitrine des 3 services dans `app/pages/index.vue` (AC: 1, 3)
+  - [x] Mettre à jour l'interface `HomeServiceOffer` et la constante `services` dans le `<script setup>` :
+    - Offre 1 : `id: "automation"`, `no: "01 / 03"`, `title: "Automatisation de processus métier"`, promesse/points, tags `["Workflow", "APIs", "Automation", "PostgreSQL"]`, format tarifaire `À partir de 3 500 € HT`
+    - Offre 2 : `id: "agents"`, `no: "02 / 03"`, `title: "Agents IA intégrés à vos outils"`, promesse/points, tags `["Agents IA", "LLM", "MCP", "Human-in-the-loop"]`, format tarifaire `À partir de 3 500 € HT`, `featured: true`
+    - Offre 3 : `id: "apps"`, `no: "03 / 03"`, `title: "Applications IA sur mesure"`, promesse/points, tags `["TypeScript", "Nuxt", "NestJS", "PostgreSQL", "Tauri"]`, format tarifaire `Sur mesure / Sprint`
+  - [x] Mettre à jour le titre de la section : `Trois expertises pour concevoir et faire évoluer vos systèmes`
+  - [x] Vérifier que tous les liens d'action pointent vers `/services` sans ancre `#`.
+
+- [x] Tâche 2 — Intégration du bloc différenciateur « Prototype → Production » (AC: 2, 3)
+  - [x] Créer la structure HTML sémantique immédiatement sous la vitrine des services dans `app/pages/index.vue` :
+    - Sur-titre : `<p class="eyebrow"><span aria-hidden="true">// </span>au-delà de la démo</p>`
+    - Titre H2 : `Un agent qui fonctionne trois fois n’est pas encore un système fiable.`
+    - Texte d'accroche valorisant le background Full Stack & QA
+    - Grille `ul.pillars-grid` de 4 cartes `ZCard` (Données, Fiabilité, IA, Exploitation) avec icônes `ZIcon` dédiées et puces descriptives
+  - [x] Ajouter les styles SCSS scopés pour `.diff-block` / `.pillars-grid` en utilisant les tokens du Design System (`--space-*`, `--radius-*`, `--font-*`, `--surface-*`, `--border-*`).
+
+- [x] Tâche 3 — Vérification responsive, a11y et respect des invariants (AC: 3)
+  - [x] Vérifier le comportement responsive sous breakpoints mobile (900px, 680px).
+  - [x] Valider l'absence totale d'emoji dans le DOM et les contenus textuels.
+  - [x] Valider la navigation clavier et le respect de `prefers-reduced-motion: reduce`.
+
+- [x] Tâche 4 — Validation qualité Docker (AC: 4)
+  - [x] Lancer la commande de validation complète : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
+  - [x] S'assurer de 0 erreur ESLint / Stylelint, 0 erreur TypeScript vue-tsc, et génération statique Nitro réussie.
+
+## Dev Notes
+
+### Architecture & Contraintes d'environnement
+- **Environnement Docker STRICT :** Ne jamais exécuter `pnpm` sur l'hôte macOS. Toute commande d'outillage doit s'exécuter dans Docker : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm <cmd>"`. [Source: AGENTS.md#Section 2]
+- **Tokens & Design System :** Aucune couleur ou espacement en dur. Utiliser impérativement `var(--token)`.
+- **Primitives de Layout :** Les classes `.section`, `.section--sunken`, `.container`, `.eyebrow`, `.prose` sont des primitives globales (`app/assets/scss/base/_layout.scss`). Ne pas les redéclarer dans le bloc scoped. [Source: AGENTS.md#Section 5.3]
+- **Icônes :** Utiliser les glyphes SVG intégrés de `<ZIcon name="..." />` (`code`, `layers`, `bot`, `spark`, `check`, `terminal`, `zap`). Ne pas importer de bibliothèque d'icônes externe.
+- **Zéro Emoji :** Règle stricte NFR6 / NFR13.
+
+### Fichiers concernés
+- [MODIFY] [app/pages/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue)
+
+### Ce qui doit être préservé
+- La section Hero commercial et son terminal interactif (`HomeHeroTerminal`).
+- Le bandeau défilant `HomeStackMarquee`.
+- La section des projets sélectionnés et le journal technique situés en aval.
+- L'intégrité du routing multi-pages Nuxt 4.
+
+### Références
+- Spécification canonique : [docs/specs/spec-repositionnement-ia/SPEC.md#CAP-3](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/SPEC.md)
+- Charte éditoriale & bloc différenciateur : [docs/specs/spec-repositionnement-ia/messaging-matrix.md#Section-4.3](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/messaging-matrix.md)
+- Offres et tarifs : [docs/specs/spec-repositionnement-ia/services-and-pricing.md#Section-1](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/services-and-pricing.md)
+- Cahier des charges : [docs/planning-artifacts/epics.md#Story-12.3](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)
+- Invariants d'implémentation : [AGENTS.md](file:///Users/simon/dev/jouan.ovh/AGENTS.md)
+
+## Dev Agent Record
+
+### Agent Model Used
+- Gemini 3.7 Flash
+
+### Debug Log References
+- Gate de validation Docker complète réussie : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
+- 0 erreur ESLint / Stylelint.
+- 0 erreur TypeScript (vue-tsc).
+- 20 routes pré-rendues statiquement via Nitro SSG avec succès.
+
+### Completion Notes List
+- Vitrine des 3 services mise à jour dans `app/pages/index.vue` avec les nouvelles offres : Automatisation de processus métier, Agents IA intégrés à vos outils (mis en avant), Applications IA sur mesure.
+- Intégration du bloc différenciateur « Prototype → Production » (`section.diff-block.section--sunken`) avec son accroche Full Stack / QA et sa grille sémantique de 4 piliers (Données, Fiabilité, IA, Exploitation).
+- Styles SCSS scopés conformes au Design System, responsive (1/2/4 colonnes), support motion réduit et navigation clavier testés et validés.
+
+### File List
+- app/pages/index.vue
+- docs/implementation-artifacts/12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur.md
+- docs/implementation-artifacts/sprint-status.yaml
+
+### Change Log
+- 2026-09-16 : Implémentation complète de la Story 12.3 (vitrine des 3 services ciblés et bloc différenciateur Prototype vers Production). Passé en revue.

codex
- Le diff modifie aussi le hero (`h1`, CTA, crédibilité, badge, lien secondaire), alors que la Story 12.3 porte sur la vitrine des services et le bloc différenciateur. Cette dérive de périmètre brouille la revue et risque de chevaucher Story 12.2.

- L’AC1 exige que chaque carte de service oriente vers `/services`, mais le diff visible ne montre aucune modification garantissant un lien d’action accessible dans chaque carte.

- La story dit que les cartes doivent pointer vers `/services` “sans ancre”, mais le diff ne prouve pas que les liens existants n’utilisent pas encore une ancre ou une destination différente.

- Le remplacement du sur-titre hero par un `<h2 class="eyebrow">` crée potentiellement une hiérarchie de titres étrange avant le `<h1>`, surtout si cet eyebrow n’est qu’un libellé décoratif.

- Le texte “SYSTÈMES IA & AUTOMATISATION” introduit un positionnement commercial très large sans preuve immédiate dans la section hero, ce qui peut sembler opportuniste si les projets affichés plus bas ne confirment pas ce virage IA.

- La mention “MCP · IA locale · QA” dans `hero__credibility` ressemble à une liste de mots-clés plus qu’à une preuve de crédibilité, et risque de parler davantage aux développeurs qu’aux clients.

- Le nouveau CTA principal “Identifier un workflow à automatiser” est moins naturel qu’une action de contact directe et peut réduire la clarté du parcours utilisateur.

- Le CTA secondaire “Voir mes systèmes IA” pointe vers `/services`, mais la page services n’est pas modifiée dans ce diff ; risque de promesse non tenue si cette page conserve l’ancien positionnement.

- Les trois offres affichent deux prix identiques “À partir de 3 500 € HT” pour les deux premières offres sans expliquer le périmètre, ce qui peut paraître arbitraire ou trop vague pour un prospect.

- L’offre “Applications IA sur mesure” mélange Nuxt, NestJS, PostgreSQL, Tauri et IA locale dans une même carte, ce qui dilue fortement la proposition de valeur.

- Le bloc “Prototype → Production” énumère beaucoup de sujets critiques, mais reste déclaratif : aucune preuve, exemple, livrable, méthode ou résultat ne soutient l’affirmation de fiabilité.

- “Un agent qui fonctionne trois fois n’est pas encore un système fiable” est une bonne phrase, mais elle peut sonner anxiogène sans transition positive ou bénéfice client clair immédiatement après.

- Les piliers “Données”, “Fiabilité”, “IA”, “Exploitation” sont trop courts pour expliquer ce que le visiteur obtient concrètement ; ils ressemblent à des catégories internes plutôt qu’à des bénéfices achetables.

- Les descriptions des piliers sont des listes nominales sans verbe ni promesse, ce qui rend le bloc sec et moins convaincant commercialement.

- L’AC3 demande une vérification de `prefers-reduced-motion`, mais le diff ajoute `interactive tilt` sur les nouvelles cartes sans démontrer que la neutralisation existe réellement pour ces nouveaux usages.

- L’AC3 demande un focus clavier visible, mais les nouvelles cartes `ZCard interactive tilt` ne montrent aucun état focus ou lien focusable ajouté dans le diff.

- `.pillars-grid` passe de 4 colonnes à 2 puis 1, mais rien ne garantit que les cartes restent visuellement équilibrées avec des titres ou descriptions plus longues.

- La story indique que les styles doivent consommer exclusivement les tokens `var(--token)`, mais `grid-template-columns: repeat(4, 1fr)` et `1fr` ne sont pas problématiques en soi ; l’AC est formulé de manière trop absolue et prête à des validations absurdes.

- Le fichier de story affirme que la navigation clavier, le responsive, l’absence d’emoji et le motion-reduced ont été testés, mais le diff ne fournit aucune trace de test visuel, capture, commande ou preuve reproductible.

- Le “Dev Agent Record” indique “20 routes pré-rendues”, alors que les instructions projet parlent de 13 routes statiques ; cet écart mérite clarification plutôt qu’une acceptation silencieuse.

- `sprint-status.yaml` passe Story 12.2 de `ready-for-dev` à `done` dans une diff de Story 12.3, ce qui est hors périmètre et peut masquer une validation manquante de 12.2.

- La nouvelle story est créée directement avec `Status: review` et toutes les tâches cochées, ce qui mélange l’artefact de spécification et le journal d’exécution ; cela rend plus difficile de savoir ce qui a réellement été conçu avant développement.

- Le champ `baseline_commit` existe dans le fichier de story, mais rien dans le diff ne prouve que ce commit correspond bien à l’état de départ réel de Story 12.3.

- Le commentaire “Story 12.3 / AC-1” dans le composant ajoute du bruit documentaire dans le code applicatif et risque de devenir obsolète dès que les stories évoluent.

- Le texte utilise “Human-in-the-loop” dans une UI française, ce qui rompt la cohérence linguistique stricte du site en français.
tokens used
22 753
- Le diff modifie aussi le hero (`h1`, CTA, crédibilité, badge, lien secondaire), alors que la Story 12.3 porte sur la vitrine des services et le bloc différenciateur. Cette dérive de périmètre brouille la revue et risque de chevaucher Story 12.2.

- L’AC1 exige que chaque carte de service oriente vers `/services`, mais le diff visible ne montre aucune modification garantissant un lien d’action accessible dans chaque carte.

- La story dit que les cartes doivent pointer vers `/services` “sans ancre”, mais le diff ne prouve pas que les liens existants n’utilisent pas encore une ancre ou une destination différente.

- Le remplacement du sur-titre hero par un `<h2 class="eyebrow">` crée potentiellement une hiérarchie de titres étrange avant le `<h1>`, surtout si cet eyebrow n’est qu’un libellé décoratif.

- Le texte “SYSTÈMES IA & AUTOMATISATION” introduit un positionnement commercial très large sans preuve immédiate dans la section hero, ce qui peut sembler opportuniste si les projets affichés plus bas ne confirment pas ce virage IA.

- La mention “MCP · IA locale · QA” dans `hero__credibility` ressemble à une liste de mots-clés plus qu’à une preuve de crédibilité, et risque de parler davantage aux développeurs qu’aux clients.

- Le nouveau CTA principal “Identifier un workflow à automatiser” est moins naturel qu’une action de contact directe et peut réduire la clarté du parcours utilisateur.

- Le CTA secondaire “Voir mes systèmes IA” pointe vers `/services`, mais la page services n’est pas modifiée dans ce diff ; risque de promesse non tenue si cette page conserve l’ancien positionnement.

- Les trois offres affichent deux prix identiques “À partir de 3 500 € HT” pour les deux premières offres sans expliquer le périmètre, ce qui peut paraître arbitraire ou trop vague pour un prospect.

- L’offre “Applications IA sur mesure” mélange Nuxt, NestJS, PostgreSQL, Tauri et IA locale dans une même carte, ce qui dilue fortement la proposition de valeur.

- Le bloc “Prototype → Production” énumère beaucoup de sujets critiques, mais reste déclaratif : aucune preuve, exemple, livrable, méthode ou résultat ne soutient l’affirmation de fiabilité.

- “Un agent qui fonctionne trois fois n’est pas encore un système fiable” est une bonne phrase, mais elle peut sonner anxiogène sans transition positive ou bénéfice client clair immédiatement après.

- Les piliers “Données”, “Fiabilité”, “IA”, “Exploitation” sont trop courts pour expliquer ce que le visiteur obtient concrètement ; ils ressemblent à des catégories internes plutôt qu’à des bénéfices achetables.

- Les descriptions des piliers sont des listes nominales sans verbe ni promesse, ce qui rend le bloc sec et moins convaincant commercialement.

- L’AC3 demande une vérification de `prefers-reduced-motion`, mais le diff ajoute `interactive tilt` sur les nouvelles cartes sans démontrer que la neutralisation existe réellement pour ces nouveaux usages.

- L’AC3 demande un focus clavier visible, mais les nouvelles cartes `ZCard interactive tilt` ne montrent aucun état focus ou lien focusable ajouté dans le diff.

- `.pillars-grid` passe de 4 colonnes à 2 puis 1, mais rien ne garantit que les cartes restent visuellement équilibrées avec des titres ou descriptions plus longues.

- La story indique que les styles doivent consommer exclusivement les tokens `var(--token)`, mais `grid-template-columns: repeat(4, 1fr)` et `1fr` ne sont pas problématiques en soi ; l’AC est formulé de manière trop absolue et prête à des validations absurdes.

- Le fichier de story affirme que la navigation clavier, le responsive, l’absence d’emoji et le motion-reduced ont été testés, mais le diff ne fournit aucune trace de test visuel, capture, commande ou preuve reproductible.

- Le “Dev Agent Record” indique “20 routes pré-rendues”, alors que les instructions projet parlent de 13 routes statiques ; cet écart mérite clarification plutôt qu’une acceptation silencieuse.

- `sprint-status.yaml` passe Story 12.2 de `ready-for-dev` à `done` dans une diff de Story 12.3, ce qui est hors périmètre et peut masquer une validation manquante de 12.2.

- La nouvelle story est créée directement avec `Status: review` et toutes les tâches cochées, ce qui mélange l’artefact de spécification et le journal d’exécution ; cela rend plus difficile de savoir ce qui a réellement été conçu avant développement.

- Le champ `baseline_commit` existe dans le fichier de story, mais rien dans le diff ne prouve que ce commit correspond bien à l’état de départ réel de Story 12.3.

- Le commentaire “Story 12.3 / AC-1” dans le composant ajoute du bruit documentaire dans le code applicatif et risque de devenir obsolète dès que les stories évoluent.

- Le texte utilise “Human-in-the-loop” dans une UI française, ce qui rompt la cohérence linguistique stricte du site en français.
