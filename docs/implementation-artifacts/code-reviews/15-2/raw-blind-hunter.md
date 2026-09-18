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
session id: 01a0b621-00ae-77a1-94fc-4b4c9e205573
--------
user
# Blind Hunter Prompt — Story 15.2

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/15-2/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise `bmad-review-adversarial-general` pour examiner le diff avec une approche volontairement hostile et relever au moins dix problèmes concrets. Je vais d’abord charger ses règles, puis lire directement le fichier demandé.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/bmad-review-adversarial-general/SKILL.md && printf '\\n---DIFF---\\n' && sed -n '1,260p' docs/implementation-artifacts/code-reviews/15-2/full.diff" in /Users/simon/dev/jouan.ovh
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

Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.


## HALT CONDITIONS

- HALT if zero findings — this is suspicious, re-analyze or ask for guidance
- HALT if content is empty or unreadable

---DIFF---
diff --git a/app/pages/index.vue b/app/pages/index.vue
index d8ed24f..d3c20e2 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -78,7 +78,7 @@
                 </li>
               </ul>
               <NuxtLink
-                to="/services"
+                :to="service.to"
                 class="offer__more"
                 :aria-label="`${service.actionText.replace(' →', '')} - ${service.title}`"
               >
@@ -348,6 +348,7 @@ interface HomeServiceOffer {
   points: string[];
   tags: string[];
   actionText: string;
+  to: string;
   featured: boolean;
 }
 
@@ -358,7 +359,7 @@ interface ProductionPillar {
   desc: string;
 }
 
-// Vitrine des 3 offres ciblées Systèmes IA & Automatisation (Story 12.3 / AC-1 & Story 15.1 / AC-1, AC-2).
+// Vitrine des 3 offres ciblées Systèmes IA & Automatisation (Story 12.3 / AC-1 & Story 15.1 / AC-1, AC-2 & Story 15.2 / AC-4).
 const services: HomeServiceOffer[] = [
   {
     id: "automation",
@@ -373,6 +374,7 @@ const services: HomeServiceOffer[] = [
     ],
     tags: ["Workflow", "APIs", "Automation", "PostgreSQL"],
     actionText: "Voir les types d'automatisation →",
+    to: "/services#automatisation",
     featured: false,
   },
   {
@@ -388,6 +390,7 @@ const services: HomeServiceOffer[] = [
     ],
     tags: ["Agents IA", "LLM", "MCP", "Human-in-the-loop"],
     actionText: "Voir quand utiliser un agent →",
+    to: "/services#workflow",
     featured: true,
   },
   {
@@ -403,6 +406,7 @@ const services: HomeServiceOffer[] = [
     ],
     tags: ["TypeScript", "Nuxt", "NestJS", "PostgreSQL", "Tauri"],
     actionText: "Découvrir les projets sur mesure →",
+    to: "/services#sur-mesure",
     featured: false,
   },
 ];
diff --git a/app/pages/services.vue b/app/pages/services.vue
index f92678b..e7d4d91 100644
--- a/app/pages/services.vue
+++ b/app/pages/services.vue
@@ -1,20 +1,21 @@
 <template>
   <main class="services">
-    <!-- En-tête + grille d'offres (story 12.5) -->
+    <!-- En-tête + grille d'offres (story 12.5 & story 15.2) -->
     <section class="section">
       <div class="container">
         <p class="eyebrow"><span aria-hidden="true">// </span>services</p>
-        <h1 class="services__title">Des systèmes IA construits autour de vos vrais processus métier.</h1>
+        <h1 class="services__title">Le bon niveau de système pour le bon problème.</h1>
         <p class="prose services__intro">
-          Je pars d’un workflow existant, pas d’une technologie à placer. Du cadrage initial jusqu'au maintien en
-          condition opérationnelle, l’IA intervient uniquement là où elle apporte réellement quelque chose.
+          Je pars d’un workflow existant, pas d’une technologie à placer. Certaines frictions se règlent avec une
+          automatisation simple. D’autres nécessitent plusieurs intégrations, de l’IA ou une véritable application
+          métier. Le rôle du diagnostic est justement de déterminer jusqu’où il est utile d’aller.
         </p>
 
         <ul class="grid-3">
           <li v-for="offer in offers" :key="offer.id">
-            <ZCard class="offer" :accent="offer.featured" :featured="offer.featured">
-              <div v-if="offer.featured" class="offer__badge">
-                <ZBadge tone="accent">Format cœur</ZBadge>
+            <ZCard :id="offer.id" class="offer" :accent="offer.featured" :featured="offer.featured">
+              <div v-if="offer.badge" class="offer__badge">
+                <ZBadge :tone="offer.badgeTone || 'neutral'">{{ offer.badge }}</ZBadge>
               </div>
               <div class="offer__icon"><ZIcon :name="offer.icon" /></div>
               <h2 class="offer__title">{{ offer.title }}</h2>
@@ -85,17 +86,19 @@ import { NuxtLink } from "#components";
 import { SITE } from "~/data/site";
 
 interface Offer {
-  /** Clé v-for stable (indépendante du contenu affiché). */
+  /** Clé v-for et ancre HTML stable (indépendante du contenu affiché). */
   id: string;
   /** Nom d'icône dans le set ZIcon. */
   icon: string;
+  badge: string;
+  badgeTone?: "accent" | "neutral";
   title: string;
   hook?: string;
   desc: string;
   points: string[];
   price: string;
   disclaimer?: string;
-  /** Offre mise en avant : carte accent + glow + badge. */
+  /** Offre mise en avant : carte accent + glow. */
   featured: boolean;
   ctaText: string;
   ctaAriaLabel: string;
@@ -111,62 +114,67 @@ interface Step {
   };
 }
 
-// Les 3 offres officielles V1 — 1re personne, vouvoiement, zéro emoji.
+// Les 3 offres de build officielles V1.1 — 1re personne, vouvoiement, zéro emoji.
 const offers: Offer[] = [
   {
-    id: "sprint",
+    id: "automatisation",
     icon: "zap",
-    title: "AI Workflow Sprint",
-    hook: "Un Sprint = un workflow prioritaire",
-    desc: "Conception, intégration logicielle et mise en production d'un workflow métier complet avec IA ciblée et supervision humaine.",
+    badge: "BESOIN PRÉCIS",
+    badgeTone: "neutral",
+    title: "Automatisation ciblée",
+    hook: "Supprimer une tâche répétitive sans reconstruire tout le processus.",
+    desc: "Pour les besoins bien délimités : données, emails, documents, CRM, synchronisation, génération ou traitement automatisé.",
     points: [
-      "Diagnostic approfondi & cartographie avant/après",
-      "Architecture système, connecteurs API & intégrations métier",
-      "Modèles d'IA & prompt engineering avec sorties typées",
-      "Tests automatisés sur cas réels & boucle de validation humaine",
-      "Déploiement en production, documentation & mesure initiale",
+      "Cartographie rapide du flux & cadrage du besoin",
+      "Automatisation logicielle & connecteurs API / webhooks",
+      "Traitement de données ou IA ciblée si pertinent",
+      "Contrôle ou validation humaine si requis",
+      "Tests, mise en production & documentation courte",
     ],
-    price: "À partir de 3 500 € HT",
-    featured: true,
-    ctaText: "Lancer un Sprint",
-    ctaAriaLabel: "Discuter d'un AI Workflow Sprint",
+    price: "Sur devis",
+    featured: false,
+    ctaText: "Décrire mon besoin",
+    ctaAriaLabel: "Décrire mon besoin pour une automatisation ciblée",
   },
   {
-    id: "blueprint",
+    id: "workflow",
     icon: "layers",
-    title: "AI Workflow Blueprint",
-    hook: "Cadrage préalable pour problématique complexe",
-    desc: "Pour les projets nécessitant un audit préalable, une modélisation de données et des choix d'architecture avant de s'engager sur le build.",
+    badge: "OFFRE CŒUR",
+    badgeTone: "accent",
+    title: "Workflow métier",
+    hook: "Transformer un processus complet en système opérationnel.",
+    desc: "Pour les workflows qui traversent plusieurs étapes ou outils : cartographie, intégrations, automatisation, IA ciblée, contrôle humain, tests et mise en production.",
     points: [
-      "Audit du processus actuel, volumes & points de friction",
-      "Matrice de décision : code déterministe vs IA vs humain",
-      "Schéma d'architecture technique & flux de données cibles",
-      "Analyse des risques, contraintes de sécurité & secrets",
-      "Spécification des KPI de mesure & estimation budgétaire",
+      "Diagnostic approfondi & cartographie avant/après",
+      "Architecture système & connecteurs API métier",
+      "Modèles d'IA & prompt engineering avec sorties typées",
+      "Tests automatisés sur cas réels & boucle de validation humaine",
+      "Déploiement en production, documentation & mesure initiale",
     ],
-    price: "À partir de 750 € HT",
-    featured: false,
-    ctaText: "Demander un Blueprint",
-    ctaAriaLabel: "Demander un AI Workflow Blueprint",
+    price: "Sur devis",
+    featured: true,
+    ctaText: "Identifier un workflow",
+    ctaAriaLabel: "Identifier un workflow métier",
   },
   {
-    id: "care",
-    icon: "bot",
-    title: "AI Care",
-    hook: "Maintien en condition opérationnelle",
-    desc: "Maintien en condition opérationnelle d'une capacité intégrée au processus métier pour garantir disponibilité, précision et maîtrise des coûts.",
+    id: "sur-mesure",
+    icon: "terminal",
+    badge: "PROJET COMPLEXE",
+    badgeTone: "neutral",
+    title: "Système métier sur mesure",
+    hook: "Construire l'application lorsque l'automatisation devient un vrai produit.",
+    desc: "Interface, backend, base de données, authentification, intégrations, IA, rôles, supervision et déploiement.",
     points: [
-      "Supervision proactive, alertes & analyse des échecs",
-      "Maintenance corrective & adaptation aux APIs tierces",
-      "Suivi des coûts d'inférence & micro-ajustements de prompts",
-      "Support technique réactif & veille sur les nouveaux modèles",
+      "Interface web ou desktop adaptée aux opérateurs",
+      "Backend, base de données relationnelle & gestion des rôles",
+      "Orchestration multi-modèles & pipelines de données",
+      "Intégration profonde au SI (CRM, ERP, APIs métier)",
+      "Supervision avancée, tests automatisés & déploiement souverain",
     ],
-    disclaimer:
-      "Consommations tierces d'APIs et tokens (LLM, OCR, scraping...) refacturées au réel ou prises en charge directement par le client.",
-    price: "À partir de 490 € HT / mois",
+    price: "Sur devis",
     featured: false,
-    ctaText: "Découvrir AI Care",
-    ctaAriaLabel: "Découvrir l'accompagnement AI Care",
+    ctaText: "Parler du projet",
+    ctaAriaLabel: "Parler d'un projet de système métier sur mesure",
   },
 ];
 
@@ -203,9 +211,9 @@ const siteUrl = useSiteUrl();
 const servicesJsonLd = {
   "@context": "https://schema.org",
   "@type": "WebPage",
-  name: "Services & Tarifs — Simon Jouan",
+  name: "Services & Systèmes IA — Simon Jouan",
   description:
-    "Développement de systèmes IA et automatisation de processus métier : offres packagées (AI Workflow Sprint, Blueprint, AI Care) et déroulement d'intervention transparent.",
+    "Conception et développement de systèmes IA et automatisation de processus métier : automatisation ciblée, workflows complets et applications métier sur mesure.",
   url: `${siteUrl}/services`,
   mainEntity: {
     "@type": "ItemList",
@@ -231,9 +239,9 @@ const servicesJsonLd = {
 };
 
 usePageSeo({
-  title: "Services & Tarifs — Simon Jouan",
+  title: "Services & Systèmes IA — Simon Jouan",
   description:
-    "Développement de systèmes IA et automatisation de processus métier : offres packagées (AI Workflow Sprint, Blueprint, AI Care) et déroulement d'intervention transparent.",
+    "Conception et développement de systèmes IA et automatisation de processus métier : automatisation ciblée, workflows complets et applications métier sur mesure.",
   path: "/services",
   image: "/images/portrait.jpeg",
   type: "website",
@@ -285,6 +293,7 @@ usePageSeo({
   display: flex;
   flex-direction: column;
   width: 100%;
+  scroll-margin-top: var(--space-16);
 }
 
 .offer__badge {
diff --git a/docs/implementation-artifacts/15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint.md b/docs/implementation-artifacts/15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint.md
index 7f0dc1e..6a40a57 100644
--- a/docs/implementation-artifacts/15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint.md
+++ b/docs/implementation-artifacts/15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint.md
@@ -1,6 +1,10 @@
+---
+baseline_commit: 7162f14595e42399d234c534fd88d78a7360cbb8
+---
+
 # Story 15.2: Page Services — Restructuration des 3 Offres de Build sur Devis & Relégation du Blueprint

codex
Le diff est lisible et révèle déjà des changements de routage, d’ancres, de données d’offres et de SEO. Je poursuis la lecture complète pour ne pas limiter les constats aux seuls premiers hunks.
exec
/bin/zsh -lc "sed -n '261,620p' docs/implementation-artifacts/code-reviews/15-2/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
 
-Status: ready-for-dev
+Status: review
 
 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
 
@@ -93,38 +97,38 @@ so that je puisse identifier le format adapté à mon organisation (FR50, CAP-2)
 
 ## Tasks / Subtasks
 
-- [ ] Tâche 1 — Mise à jour du Hero H1 et de l'introduction dans `app/pages/services.vue` (AC: 1)
-  - [ ] Mettre à jour le titre `h1.services__title` : `Le bon niveau de système pour le bon problème.`
-  - [ ] Mettre à jour le paragraphe `p.prose.services__intro` avec le texte officiel V1.1 en 3 phrases.
-  - [ ] Vérifier la typographie, les marges et la lisibilité sur mobile et desktop.
+- [x] Tâche 1 — Mise à jour du Hero H1 et de l'introduction dans `app/pages/services.vue` (AC: 1)
+  - [x] Mettre à jour le titre `h1.services__title` : `Le bon niveau de système pour le bon problème.`
+  - [x] Mettre à jour le paragraphe `p.prose.services__intro` avec le texte officiel V1.1 en 3 phrases.
+  - [x] Vérifier la typographie, les marges et la lisibilité sur mobile et desktop.
 
-- [ ] Tâche 2 — Restructuration des données et du modèle `offers` (AC: 2, 3)
-  - [ ] Adapter l'interface TypeScript `Offer` dans `<script setup>` pour supporter `badgeText?: string` ou `badgeTone?: "accent" | "neutral"`.
-  - [ ] Remplacer les 3 anciennes offres (`sprint`, `blueprint`, `care`) par les 3 offres de build :
+- [x] Tâche 2 — Restructuration des données et du modèle `offers` (AC: 2, 3)
+  - [x] Adapter l'interface TypeScript `Offer` dans `<script setup>` pour supporter `badge: string` et `badgeTone?: "accent" | "neutral"`.
+  - [x] Remplacer les 3 anciennes offres (`sprint`, `blueprint`, `care`) par les 3 offres de build :
     - `automatisation` (id: `automatisation`, icon: `zap`, badge: `BESOIN PRÉCIS`, price: `Sur devis`)
     - `workflow` (id: `workflow`, icon: `layers`, badge: `OFFRE CŒUR`, featured: true, price: `Sur devis`)
     - `sur-mesure` (id: `sur-mesure`, icon: `terminal`, badge: `PROJET COMPLEXE`, price: `Sur devis`)
-  - [ ] Renseigner pour chacune les 5 points de livrables précis.
-  - [ ] Configurer les libellés de CTA et `:aria-label` accessibles (`Décrire mon besoin`, `Identifier un workflow`, `Parler du projet`).
-
-- [ ] Tâche 3 — Template, ancres et intégration visuelle des badges (AC: 2, 4)
-  - [ ] Ajouter l'attribut `:id="offer.id"` sur le conteneur de carte `<li>` ou `<ZCard>` avec la classe de scroll margin (`scroll-margin-top`).
-  - [ ] Afficher `<ZBadge>` pour chaque carte selon son niveau d'intervention (`BESOIN PRÉCIS`, `OFFRE CŒUR`, `PROJET COMPLEXE`).
-  - [ ] S'assurer que le bas de carte (`.offer__footer`) aligne proprement le prix `Sur devis` et le bouton `<ZButton>`.
-  - [ ] Mettre à jour les 3 liens contextuels de `app/pages/index.vue` pour cibler `/services#automatisation`, `/services#workflow`, `/services#sur-mesure`.
-
-- [ ] Tâche 4 — Synchronisation SEO et données structurées Schema.org (AC: 5)
-  - [ ] Aligner `servicesJsonLd` sur les 3 nouvelles offres de build avec `offers.description = "Sur devis"`.
-  - [ ] Mettre à jour la balise meta `description` dans `usePageSeo` pour supprimer toute référence à l'ancien catalogue tarifaire (3 500 € HT, Blueprint en build).
-
-- [ ] Tâche 5 — Validation a11y, responsive et Gate Docker Nitro SSG (AC: 5)
-  - [ ] Tester la navigation clavier (`Tab`) et le focus visible sur les boutons des 3 cartes.
-  - [ ] Vérifier le rendu sur mobile (< 900px) et la parité visuelle sur les thèmes clair et sombre.
-  - [ ] Exécuter la commande de validation Docker :
+  - [x] Renseigner pour chacune les 5 points de livrables précis.
+  - [x] Configurer les libellés de CTA et `:aria-label` accessibles (`Décrire mon besoin`, `Identifier un workflow`, `Parler du projet`).
+
+- [x] Tâche 3 — Template, ancres et intégration visuelle des badges (AC: 2, 4)
+  - [x] Ajouter l'attribut `:id="offer.id"` sur le conteneur `<ZCard>` avec la classe de scroll margin (`scroll-margin-top: var(--space-16)`).
+  - [x] Afficher `<ZBadge>` pour chaque carte selon son niveau d'intervention (`BESOIN PRÉCIS`, `OFFRE CŒUR`, `PROJET COMPLEXE`).
+  - [x] S'assurer que le bas de carte (`.offer__footer`) aligne proprement le prix `Sur devis` et le bouton `<ZButton>`.
+  - [x] Mettre à jour les 3 liens contextuels de `app/pages/index.vue` pour cibler `/services#automatisation`, `/services#workflow`, `/services#sur-mesure`.
+
+- [x] Tâche 4 — Synchronisation SEO et données structurées Schema.org (AC: 5)
+  - [x] Aligner `servicesJsonLd` sur les 3 nouvelles offres de build avec `offers.description = "Sur devis"`.
+  - [x] Mettre à jour la balise meta `description` dans `usePageSeo` pour supprimer toute référence à l'ancien catalogue tarifaire (3 500 € HT, Blueprint en build).
+
+- [x] Tâche 5 — Validation a11y, responsive et Gate Docker Nitro SSG (AC: 5)
+  - [x] Tester la navigation clavier (`Tab`) et le focus visible sur les boutons des 3 cartes.
+  - [x] Vérifier le rendu sur mobile (< 900px) et la parité visuelle sur les thèmes clair et sombre.
+  - [x] Exécuter la commande de validation Docker :
     ```sh
     docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
     ```
-  - [ ] Vérifier que les 28 routes statiques pré-rendues compilent sans erreur ni avertissement.
+  - [x] Vérifier que les 28 routes statiques pré-rendues compilent sans erreur ni avertissement.
 
 ## Dev Notes
 
@@ -239,11 +243,28 @@ Ajouter sur l'élément cible :
 ## Dev Agent Record
 
 ### Agent Model Used
+- Gemini 3.7 Flash
 
 ### Debug Log References
+- Docker gate validation: `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> 0 error (ESLint + Stylelint + vue-tsc + 28 Nitro routes SSG).
+- Local dev server curl check: `http://localhost:3000/services` -> 200 OK.
+- Verified generated HTML `.output/public/services/index.html` (badges, H1, intro, prices, JSON-LD Schema.org ItemList).
+- Verified generated HTML `.output/public/index.html` (direct anchor links `/services#automatisation`, `/services#workflow`, `/services#sur-mesure`).
 
 ### Completion Notes List
+- ✅ **Hero & Introduction V1.1 :** H1 mis à jour vers *« Le bon niveau de système pour le bon problème. »*, texte d'introduction axé sur le diagnostic workflow avant la technologie.
+- ✅ **Restructuration des 3 offres de build :** `automatisation` (BESOIN PRÉCIS, Sur devis), `workflow` (OFFRE CŒUR, Sur devis, featured: true), `sur-mesure` (PROJET COMPLEXE, Sur devis). Suppression intégrale du prix d'entrée « À partir de 3 500 € HT ».
+- ✅ **Badges de statut & Accessibilité :** Utilisation de `<ZBadge>` avec `tone="accent"` pour l'offre cœur et `tone="neutral"` pour les autres ; boutons `<ZButton>` avec labels et `aria-label` contextuels (`/contact`).
+- ✅ **Ancres HTML & Scroll Margin :** Identifiants stables (`id="automatisation"`, `id="workflow"`, `id="sur-mesure"`) et `scroll-margin-top: var(--space-16)` sur `.offer`.
+- ✅ **Résolution Dette Différée 15.1 :** Mise à jour de `app/pages/index.vue` pour router directement les 3 liens contextuels de la vitrine vers leurs ancres de build respectives.
+- ✅ **SEO & Schema.org :** Synchronisation de `servicesJsonLd` (WebPage / ItemList / Service) et de `usePageSeo` sans mentions tarifaires chiffrées obsolètes.
 
 ### File List
+- `app/pages/services.vue` (modifié)
+- `app/pages/index.vue` (modifié)
+- `docs/implementation-artifacts/deferred-work.md` (modifié)
+- `docs/implementation-artifacts/sprint-status.yaml` (modifié)
+- `docs/implementation-artifacts/15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint.md` (modifié)
 
 ### Change Log
+- 2026-09-18: Implémentation complète de la Story 15.2 (restructuration des 3 offres de build sur devis, Hero V1.1, ancres de navigation, synchronisation SEO/JSON-LD et résolution de la dette différée de liens d'accueil).
diff --git a/docs/implementation-artifacts/deferred-work.md b/docs/implementation-artifacts/deferred-work.md
index 788f4ae..3fbef01 100644
--- a/docs/implementation-artifacts/deferred-work.md
+++ b/docs/implementation-artifacts/deferred-work.md
@@ -42,8 +42,8 @@ _Vue d'ensemble par destination. Le détail par story est conservé dans les sec
 
 ## Deferred from: code review of 15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance (2026-09-18)
 
-- **Ancrage direct des 3 liens contextuels de la homepage vers les offres `/services`** (`app/pages/index.vue:80`) — Les liens pointent vers `/services` au sens large ; ils devront être enrichis d'ancres spécifiques (ex: `#automation`, `#agents`, `#apps`) lors de la restructuration des offres de la page Services dans la Story 15.2.
-- **Désancrage tarifaire résiduel sur la page catalogue `/services`** (`app/pages/services.vue`) — Le prix d'entrée « À partir de 3 500 € HT » est encore visible sur `/services` ; son élimination fait l'objet de la Story 15.2.
+- ~~**Ancrage direct des 3 liens contextuels de la homepage vers les offres `/services`**~~ — ✅ **Résolu en 15.2** (`app/pages/index.vue` : ancres `/services#automatisation`, `/services#workflow`, `/services#sur-mesure`).
+- ~~**Désancrage tarifaire résiduel sur la page catalogue `/services`**~~ — ✅ **Résolu en 15.2** (`app/pages/services.vue` : 3 offres sur devis, élimination définitive du prix d'entrée 3 500 € HT et restructuration du catalogue de build).
 
 ## Deferred from: code review of 13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg (2026-09-18)
 
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 5a751da..415b379 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -1,5 +1,5 @@
 # generated: 2026-06-18
-# last_updated: 2026-09-18 (Story 15.2 créée et prête pour le dev)
+# last_updated: 2026-09-18 (Story 15.2 terminée et prête pour review)
 # project: jouan.ovh
 # project_key: NOKEY
 # tracking_system: file-system
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-18 (Story 15.2 prête pour le dev)"
+last_updated: "2026-09-18 (Story 15.2 prête pour review)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -156,7 +156,7 @@ development_status:
   # Epic 15 — Repositionnement Commercial V1.1 : Désancrage Tarifaire & Offres par Niveaux d'Intervention
   epic-15: in-progress
   15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance: done
-  15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint: ready-for-dev
+  15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint: review
   15-3-page-services-section-dediee-ai-care-et-process-4-etapes: backlog
   15-4-coherence-globale-seo-formulaire-contact-et-gate-docker: backlog
   epic-15-retrospective: optional

exec
/bin/zsh -lc "nl -ba app/pages/services.vue | sed -n '1,275p'; printf '\\n--- index relevant ---\\n'; nl -ba app/pages/index.vue | sed -n '55,95p;340,425p'; printf '\\n--- story acceptance ---\\n'; nl -ba docs/implementation-artifacts/15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint.md | sed -n '1,190p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	<template>
     2	  <main class="services">
     3	    <!-- En-tête + grille d'offres (story 12.5 & story 15.2) -->
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
    52	    <!-- Section process : 4 étapes ordonnées + CTA (story 12.5) -->
    53	    <section class="section section--sunken">
    54	      <div class="container">
    55	        <p class="eyebrow"><span aria-hidden="true">// </span>comment ça se passe</p>
    56	        <h2 class="process__title">Un déroulé simple en quatre temps</h2>
    57	
    58	        <ol class="process">
    59	          <li v-for="step in steps" :key="step.n" class="process__step">
    60	            <div class="process__num" aria-hidden="true">{{ step.n }}</div>
    61	            <h3 class="process__step-title">{{ step.title }}</h3>
    62	            <p class="prose process__desc">{{ step.desc }}</p>
    63	            <div v-if="step.inlineCta" class="process__cta-inline-wrapper">
    64	              <NuxtLink :to="step.inlineCta.to" class="process__inline-cta">
    65	                {{ step.inlineCta.label }}
    66	              </NuxtLink>
    67	            </div>
    68	          </li>
    69	        </ol>
    70	
    71	        <div class="process__cta">
    72	          <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
    73	            Me parler de votre besoin
    74	            <template #iconRight><ZIcon name="arrow" /></template>
    75	          </ZButton>
    76	        </div>
    77	      </div>
    78	    </section>
    79	  </main>
    80	</template>
    81	
    82	<script setup lang="ts">
    83	// Page Services : catalogue d'offres IA packagées + process 4 étapes + CTA contact.
    84	// Données statiques (3 offres, 4 étapes) déclarées localement. Prerender-safe, dark-first.
    85	import { NuxtLink } from "#components";
    86	import { SITE } from "~/data/site";
    87	
    88	interface Offer {
    89	  /** Clé v-for et ancre HTML stable (indépendante du contenu affiché). */
    90	  id: string;
    91	  /** Nom d'icône dans le set ZIcon. */
    92	  icon: string;
    93	  badge: string;
    94	  badgeTone?: "accent" | "neutral";
    95	  title: string;
    96	  hook?: string;
    97	  desc: string;
    98	  points: string[];
    99	  price: string;
   100	  disclaimer?: string;
   101	  /** Offre mise en avant : carte accent + glow. */
   102	  featured: boolean;
   103	  ctaText: string;
   104	  ctaAriaLabel: string;
   105	}
   106	
   107	interface Step {
   108	  n: string;
   109	  title: string;
   110	  desc: string;
   111	  inlineCta?: {
   112	    to: string;
   113	    label: string;
   114	  };
   115	}
   116	
   117	// Les 3 offres de build officielles V1.1 — 1re personne, vouvoiement, zéro emoji.
   118	const offers: Offer[] = [
   119	  {
   120	    id: "automatisation",
   121	    icon: "zap",
   122	    badge: "BESOIN PRÉCIS",
   123	    badgeTone: "neutral",
   124	    title: "Automatisation ciblée",
   125	    hook: "Supprimer une tâche répétitive sans reconstruire tout le processus.",
   126	    desc: "Pour les besoins bien délimités : données, emails, documents, CRM, synchronisation, génération ou traitement automatisé.",
   127	    points: [
   128	      "Cartographie rapide du flux & cadrage du besoin",
   129	      "Automatisation logicielle & connecteurs API / webhooks",
   130	      "Traitement de données ou IA ciblée si pertinent",
   131	      "Contrôle ou validation humaine si requis",
   132	      "Tests, mise en production & documentation courte",
   133	    ],
   134	    price: "Sur devis",
   135	    featured: false,
   136	    ctaText: "Décrire mon besoin",
   137	    ctaAriaLabel: "Décrire mon besoin pour une automatisation ciblée",
   138	  },
   139	  {
   140	    id: "workflow",
   141	    icon: "layers",
   142	    badge: "OFFRE CŒUR",
   143	    badgeTone: "accent",
   144	    title: "Workflow métier",
   145	    hook: "Transformer un processus complet en système opérationnel.",
   146	    desc: "Pour les workflows qui traversent plusieurs étapes ou outils : cartographie, intégrations, automatisation, IA ciblée, contrôle humain, tests et mise en production.",
   147	    points: [
   148	      "Diagnostic approfondi & cartographie avant/après",
   149	      "Architecture système & connecteurs API métier",
   150	      "Modèles d'IA & prompt engineering avec sorties typées",
   151	      "Tests automatisés sur cas réels & boucle de validation humaine",
   152	      "Déploiement en production, documentation & mesure initiale",
   153	    ],
   154	    price: "Sur devis",
   155	    featured: true,
   156	    ctaText: "Identifier un workflow",
   157	    ctaAriaLabel: "Identifier un workflow métier",
   158	  },
   159	  {
   160	    id: "sur-mesure",
   161	    icon: "terminal",
   162	    badge: "PROJET COMPLEXE",
   163	    badgeTone: "neutral",
   164	    title: "Système métier sur mesure",
   165	    hook: "Construire l'application lorsque l'automatisation devient un vrai produit.",
   166	    desc: "Interface, backend, base de données, authentification, intégrations, IA, rôles, supervision et déploiement.",
   167	    points: [
   168	      "Interface web ou desktop adaptée aux opérateurs",
   169	      "Backend, base de données relationnelle & gestion des rôles",
   170	      "Orchestration multi-modèles & pipelines de données",
   171	      "Intégration profonde au SI (CRM, ERP, APIs métier)",
   172	      "Supervision avancée, tests automatisés & déploiement souverain",
   173	    ],
   174	    price: "Sur devis",
   175	    featured: false,
   176	    ctaText: "Parler du projet",
   177	    ctaAriaLabel: "Parler d'un projet de système métier sur mesure",
   178	  },
   179	];
   180	
   181	// Étapes du process en 4 temps. L'ordre du tableau garantit l'affichage 01 → 04.
   182	const steps: Step[] = [
   183	  {
   184	    n: "01",
   185	    title: "Diagnostic",
   186	    desc: "Échange de 20 à 30 minutes pour qualifier le problème, comprendre le workflow existant et identifier les goulots d'étranglement.",
   187	    inlineCta: {
   188	      to: "/contact",
   189	      label: "Identifier un workflow →",
   190	    },
   191	  },
   192	  {
   193	    n: "02",
   194	    title: "Cadrage",
   195	    desc: "Formalisation du workflow cible, des étapes manuelles à conserver sous contrôle humain, des connecteurs API requis et des KPI de mesure. Fait l'objet d'un Blueprint pour les sujets complexes.",
   196	  },
   197	  {
   198	    n: "03",
   199	    title: "Construction & intégration",
   200	    desc: "Développement logiciel du système, connexion aux outils métiers (CRM, ERP, messagerie...), couverture de tests automatisés et mise à l'épreuve sur cas réels avant livraison.",
   201	  },
   202	  {
   203	    n: "04",
   204	    title: "Suivi & amélioration",
   205	    desc: "Monitoring en production, maintenance préventive/corrective, ajustements aux évolutions d'APIs tierces ou modèles d'IA, mesure factuelle des résultats.",
   206	  },
   207	];
   208	
   209	const siteUrl = useSiteUrl();
   210	
   211	const servicesJsonLd = {
   212	  "@context": "https://schema.org",
   213	  "@type": "WebPage",
   214	  name: "Services & Systèmes IA — Simon Jouan",
   215	  description:
   216	    "Conception et développement de systèmes IA et automatisation de processus métier : automatisation ciblée, workflows complets et applications métier sur mesure.",
   217	  url: `${siteUrl}/services`,
   218	  mainEntity: {
   219	    "@type": "ItemList",
   220	    itemListElement: offers.map((offer, index) => ({
   221	      "@type": "ListItem",
   222	      position: index + 1,
   223	      item: {
   224	        "@type": "Service",
   225	        name: offer.title,
   226	        description: offer.desc,
   227	        provider: {
   228	          "@type": "Organization",
   229	          "@id": `${siteUrl}/#organization`,
   230	          name: SITE.profile.name,
   231	        },
   232	        offers: {
   233	          "@type": "Offer",
   234	          description: offer.price,
   235	        },
   236	      },
   237	    })),
   238	  },
   239	};
   240	
   241	usePageSeo({
   242	  title: "Services & Systèmes IA — Simon Jouan",
   243	  description:
   244	    "Conception et développement de systèmes IA et automatisation de processus métier : automatisation ciblée, workflows complets et applications métier sur mesure.",
   245	  path: "/services",
   246	  image: "/images/portrait.jpeg",
   247	  type: "website",
   248	  jsonLd: servicesJsonLd,
   249	});
   250	</script>
   251	
   252	<style lang="scss" scoped>
   253	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) */
   254	.services {
   255	  display: block;
   256	}
   257	
   258	// .section / .section--sunken / .container / .eyebrow / .prose : primitives de
   259	// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
   260	
   261	// ---- En-tête ----
   262	.services__title {
   263	  max-width: 22ch;
   264	  margin-bottom: var(--space-3);
   265	  font-family: var(--font-mono);
   266	  font-size: var(--fs-4xl);
   267	  font-weight: var(--fw-light);
   268	  line-height: var(--lh-tight);
   269	  color: var(--text-strong);
   270	}
   271	
   272	.services__intro {
   273	  max-width: 62ch;
   274	  margin-bottom: var(--space-10);
   275	  color: var(--text-muted);

--- index relevant ---
    55	    <!-- Vitrine des 3 services cibles (Story 12.3 / AC-1 & Story 15.1 / AC-1, AC-2, AC-3) -->
    56	    <section class="section">
    57	      <div class="container">
    58	        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
    59	        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos systèmes</h2>
    60	        <ul class="grid-3">
    61	          <li v-for="service in services" :key="service.id">
    62	            <ZCard class="offer" interactive tilt :accent="service.featured" :featured="service.featured">
    63	              <div class="offer__top">
    64	                <div class="offer__icon"><ZIcon :name="service.icon" /></div>
    65	                <span class="offer__no">{{ service.no }}</span>
    66	              </div>
    67	              <h3 class="offer__title">{{ service.title }}</h3>
    68	              <p class="offer__desc">{{ service.desc }}</p>
    69	              <ul class="offer__points">
    70	                <li v-for="point in service.points" :key="point">
    71	                  <ZIcon name="check" class="offer__check" />
    72	                  <span>{{ point }}</span>
    73	                </li>
    74	              </ul>
    75	              <ul class="hero__tags offer__tags">
    76	                <li v-for="tag in service.tags" :key="tag">
    77	                  <ZTag>{{ tag }}</ZTag>
    78	                </li>
    79	              </ul>
    80	              <NuxtLink
    81	                :to="service.to"
    82	                class="offer__more"
    83	                :aria-label="`${service.actionText.replace(' →', '')} - ${service.title}`"
    84	              >
    85	                <span>{{ service.actionText.replace(" →", "") }}</span>
    86	                <span class="offer__arrow" aria-hidden="true">→</span>
    87	              </NuxtLink>
    88	            </ZCard>
    89	          </li>
    90	        </ul>
    91	
    92	        <!-- Encart de réassurance désancrage tarifaire (Story 15.1 / AC-3) -->
    93	        <div class="services-reassurance">
    94	          <div class="services-reassurance__bar" aria-hidden="true">
    95	            <span class="services-reassurance__dots">
   340	}
   341	
   342	interface HomeServiceOffer {
   343	  id: string;
   344	  no: string;
   345	  icon: "code" | "layers" | "spark" | "bot" | "terminal" | "zap";
   346	  title: string;
   347	  desc: string;
   348	  points: string[];
   349	  tags: string[];
   350	  actionText: string;
   351	  to: string;
   352	  featured: boolean;
   353	}
   354	
   355	interface ProductionPillar {
   356	  id: string;
   357	  icon: "code" | "layers" | "spark" | "bot" | "terminal" | "zap";
   358	  title: string;
   359	  desc: string;
   360	}
   361	
   362	// Vitrine des 3 offres ciblées Systèmes IA & Automatisation (Story 12.3 / AC-1 & Story 15.1 / AC-1, AC-2 & Story 15.2 / AC-4).
   363	const services: HomeServiceOffer[] = [
   364	  {
   365	    id: "automation",
   366	    no: "01 / 03",
   367	    icon: "layers",
   368	    title: "Automatisation de processus métier",
   369	    desc: "Cartographie d'un workflow existant, identification des tâches répétitives et construction du système qui automatise ce qui mérite réellement de l'être.",
   370	    points: [
   371	      "Cartographie de flux & connecteurs d'APIs",
   372	      "Ingestion, enrichissement et traitement de données",
   373	      "Synchronisation d'outils métier & reporting",
   374	    ],
   375	    tags: ["Workflow", "APIs", "Automation", "PostgreSQL"],
   376	    actionText: "Voir les types d'automatisation →",
   377	    to: "/services#automatisation",
   378	    featured: false,
   379	  },
   380	  {
   381	    id: "agents",
   382	    no: "02 / 03",
   383	    icon: "bot",
   384	    title: "Agents IA intégrés à vos outils",
   385	    desc: "Intégration d'agents outillés dans vos flux existants pour lire, interpréter, synthétiser et décider sans casser vos habitudes de travail.",
   386	    points: [
   387	      "Agents outillés (Tool Calling) & serveurs MCP",
   388	      "Extraction structurée & analyse documentaire",
   389	      "Supervision humaine obligatoire (Human-in-the-loop)",
   390	    ],
   391	    tags: ["Agents IA", "LLM", "MCP", "Human-in-the-loop"],
   392	    actionText: "Voir quand utiliser un agent →",
   393	    to: "/services#workflow",
   394	    featured: true,
   395	  },
   396	  {
   397	    id: "apps",
   398	    no: "03 / 03",
   399	    icon: "code",
   400	    title: "Applications IA sur mesure",
   401	    desc: "Développement complet de solutions logicielles dédiées quand le workflow nécessite une interface, un backend robuste et une base de données sur mesure.",
   402	    points: [
   403	      "Applications web complètes Nuxt & NestJS",
   404	      "Applications desktop sécurisées Tauri (IA locale)",
   405	      "Architecture PostgreSQL, tests QA & déploiement",
   406	    ],
   407	    tags: ["TypeScript", "Nuxt", "NestJS", "PostgreSQL", "Tauri"],
   408	    actionText: "Découvrir les projets sur mesure →",
   409	    to: "/services#sur-mesure",
   410	    featured: false,
   411	  },
   412	];
   413	
   414	// 4 Piliers d'industrialisation « Prototype → Production » (Story 12.3 / AC-2).
   415	const pillars: ProductionPillar[] = [
   416	  {
   417	    id: "data",
   418	    icon: "layers",
   419	    title: "Données",
   420	    desc: "Provenance, structuration, stockage, rétention, secrets.",
   421	  },
   422	  {
   423	    id: "reliability",
   424	    icon: "zap",
   425	    title: "Fiabilité",

--- story acceptance ---
     1	---
     2	baseline_commit: 7162f14595e42399d234c534fd88d78a7360cbb8
     3	---
     4	
     5	# Story 15.2: Page Services — Restructuration des 3 Offres de Build sur Devis & Relégation du Blueprint
     6	
     7	Status: review
     8	
     9	<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
    10	
    11	## Story
    12	
    13	As a prospect consultant la page `/services`,
    14	I want apprécier immédiatement les 3 niveaux d'intervention possibles et comprendre le positionnement sans prix plancher bloquant,
    15	so that je puisse identifier le format adapté à mon organisation (FR50, CAP-2).
    16	
    17	## Acceptance Criteria
    18	
    19	1. **Given** la route `/services` (`app/pages/services.vue`)
    20	   **When** la page est affichée
    21	   **Then** le Hero présente le H1 officiel de l'Offre Commerciale V1.1 :
    22	     > *« Le bon niveau de système pour le bon problème. »*
    23	   **And** le texte d'introduction est centré sur le workflow plutôt que sur la technologie :
    24	     > *« Je pars d'un workflow existant, pas d'une technologie à placer. Certaines frictions se règlent avec une automatisation simple. D'autres nécessitent plusieurs intégrations, de l'IA ou une véritable application métier. Le rôle du diagnostic est justement de déterminer jusqu'où il est utile d'aller. »*
    25	   **And** l'eyebrow conserve la convention standard `<p class="eyebrow"><span aria-hidden="true">// </span>services</p>`.
    26	
    27	2. **Given** la grille principale des offres de build (`.grid-3`) dans `app/pages/services.vue`
    28	   **When** le visiteur consulte les offres
    29	   **Then** les 3 cartes d'intervention sont présentées via `<ZCard>`, identifiées par des ancres HTML stables (`id="automatisation"`, `id="workflow"`, `id="sur-mesure"`) :
    30	     1. **Automatisation ciblée :**
    31	        - Badge / Eyebrow : `BESOIN PRÉCIS` (affiché via `<ZBadge tone="neutral">` ou `.offer__badge`)
    32	        - Titre : `Automatisation ciblée`
    33	        - Icône : `zap` (`<ZIcon name="zap" />`)
    34	        - Accroche : `Supprimer une tâche répétitive sans reconstruire tout le processus.`
    35	        - Description : `Pour les besoins bien délimités : données, emails, documents, CRM, synchronisation, génération ou traitement automatisé.`
    36	        - Points clés / Livrables :
    37	          - `Cartographie rapide du flux & cadrage du besoin`
    38	          - `Automatisation logicielle & connecteurs API / webhooks`
    39	          - `Traitement de données ou IA ciblée si pertinent`
    40	          - `Contrôle ou validation humaine si requis`
    41	          - `Tests, mise en production & documentation courte`
    42	        - Prix : `Sur devis` (dans `.offer__price`, aucun prix d'entrée chiffré)
    43	        - CTA : `Décrire mon besoin`, bouton `<ZButton>` pointant vers `/contact` avec `:aria-label="Décrire mon besoin pour une automatisation ciblée"` (variante `secondary`)
    44	        - featured : `false`
    45	     2. **Workflow métier :**
    46	        - Badge / Eyebrow : `OFFRE CŒUR` (affiché via `<ZBadge tone="accent">`)
    47	        - Titre : `Workflow métier` (mention optionnelle `AI Workflow Sprint`)
    48	        - Icône : `layers` (`<ZIcon name="layers" />`)
    49	        - Accroche : `Transformer un processus complet en système opérationnel.`
    50	        - Description : `Pour les workflows qui traversent plusieurs étapes ou outils : cartographie, intégrations, automatisation, IA ciblée, contrôle humain, tests et mise en production.`
    51	        - Points clés / Livrables :
    52	          - `Diagnostic approfondi & cartographie avant/après`
    53	          - `Architecture système & connecteurs API métier`
    54	          - `Modèles d'IA & prompt engineering avec sorties typées`
    55	          - `Tests automatisés sur cas réels & boucle de validation humaine`
    56	          - `Déploiement en production, documentation & mesure initiale`
    57	        - Prix : `Sur devis` (dans `.offer__price`, suppression définitive de `À partir de 3 500 € HT`)
    58	        - CTA : `Identifier un workflow`, bouton `<ZButton>` pointant vers `/contact` avec `:aria-label="Identifier un workflow métier"` (variante `primary`)
    59	        - featured : `true` (carte mise en avant avec `:accent="true"` et `:featured="true"`)
    60	     3. **Système métier sur mesure :**
    61	        - Badge / Eyebrow : `PROJET COMPLEXE` (affiché via `<ZBadge tone="neutral">`)
    62	        - Titre : `Système métier sur mesure`
    63	        - Icône : `terminal` (`<ZIcon name="terminal" />`)
    64	        - Accroche : `Construire l'application lorsque l'automatisation devient un vrai produit.`
    65	        - Description : `Interface, backend, base de données, authentification, intégrations, IA, rôles, supervision et déploiement.`
    66	        - Points clés / Livrables :
    67	          - `Interface web ou desktop adaptée aux opérateurs`
    68	          - `Backend, base de données relationnelle & gestion des rôles`
    69	          - `Orchestration multi-modèles & pipelines de données`
    70	          - `Intégration profonde au SI (CRM, ERP, APIs métier)`
    71	          - `Supervision avancée, tests automatisés & déploiement souverain`
    72	        - Prix : `Sur devis` (dans `.offer__price`)
    73	        - CTA : `Parler du projet`, bouton `<ZButton>` pointant vers `/contact` avec `:aria-label="Parler d'un projet de système métier sur mesure"` (variante `secondary`)
    74	        - featured : `false`
    75	
    76	3. **Given** la structure du catalogue d'offres
    77	   **When** le visiteur visualise la page `/services`
    78	   **Then** l'offre *AI Workflow Blueprint* est retirée des cartes de build principales pour devenir une option de cadrage dans la section process (anticipation Story 15.3).
    79	   **And** la carte *AI Care* est retirée de la grille de build `.grid-3` pour ne pas la présenter comme un build équivalent (sa section dédiée post-déploiement fera l'objet de la Story 15.3).
    80	
    81	4. **Given** les liens contextuels de la page d'accueil dans `app/pages/index.vue`
    82	   **When** le visiteur clique sur l'un des liens d'exploration vers `/services`
    83	   **Then** les liens pointent directement vers les ancres correspondantes (résolution de la dette différée issue de la Story 15.1) :
    84	     - *Automatisation :* `/services#automatisation`
    85	     - *Agents IA :* `/services#workflow`
    86	     - *Applications sur mesure :* `/services#sur-mesure`
    87	   **And** chaque carte cible dans `app/pages/services.vue` possède l'attribut `id` adéquat et un `scroll-margin-top: var(--space-16)` pour garantir un positionnement propre sous le header fixe.
    88	
    89	5. **Given** les exigences de référencement (SEO), accessibilité (a11y) et qualité
    90	   **When** la page est générée en statique (`pnpm generate`)
    91	   **Then** l'objet JSON-LD `servicesJsonLd` (Schema.org `ItemList`) et `usePageSeo` sont alignés sur les 3 offres de build sans mention de "3 500 € HT".
    92	   **And** aucun emoji n'est présent dans le code, les textes ou les composants (NFR6).
    93	   **And** la suite de validation Docker Nitro SSG s'exécute avec 100% de succès :
    94	     ```sh
    95	     docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
    96	     ```
    97	
    98	## Tasks / Subtasks
    99	
   100	- [x] Tâche 1 — Mise à jour du Hero H1 et de l'introduction dans `app/pages/services.vue` (AC: 1)
   101	  - [x] Mettre à jour le titre `h1.services__title` : `Le bon niveau de système pour le bon problème.`
   102	  - [x] Mettre à jour le paragraphe `p.prose.services__intro` avec le texte officiel V1.1 en 3 phrases.
   103	  - [x] Vérifier la typographie, les marges et la lisibilité sur mobile et desktop.
   104	
   105	- [x] Tâche 2 — Restructuration des données et du modèle `offers` (AC: 2, 3)
   106	  - [x] Adapter l'interface TypeScript `Offer` dans `<script setup>` pour supporter `badge: string` et `badgeTone?: "accent" | "neutral"`.
   107	  - [x] Remplacer les 3 anciennes offres (`sprint`, `blueprint`, `care`) par les 3 offres de build :
   108	    - `automatisation` (id: `automatisation`, icon: `zap`, badge: `BESOIN PRÉCIS`, price: `Sur devis`)
   109	    - `workflow` (id: `workflow`, icon: `layers`, badge: `OFFRE CŒUR`, featured: true, price: `Sur devis`)
   110	    - `sur-mesure` (id: `sur-mesure`, icon: `terminal`, badge: `PROJET COMPLEXE`, price: `Sur devis`)
   111	  - [x] Renseigner pour chacune les 5 points de livrables précis.
   112	  - [x] Configurer les libellés de CTA et `:aria-label` accessibles (`Décrire mon besoin`, `Identifier un workflow`, `Parler du projet`).
   113	
   114	- [x] Tâche 3 — Template, ancres et intégration visuelle des badges (AC: 2, 4)
   115	  - [x] Ajouter l'attribut `:id="offer.id"` sur le conteneur `<ZCard>` avec la classe de scroll margin (`scroll-margin-top: var(--space-16)`).
   116	  - [x] Afficher `<ZBadge>` pour chaque carte selon son niveau d'intervention (`BESOIN PRÉCIS`, `OFFRE CŒUR`, `PROJET COMPLEXE`).
   117	  - [x] S'assurer que le bas de carte (`.offer__footer`) aligne proprement le prix `Sur devis` et le bouton `<ZButton>`.
   118	  - [x] Mettre à jour les 3 liens contextuels de `app/pages/index.vue` pour cibler `/services#automatisation`, `/services#workflow`, `/services#sur-mesure`.
   119	
   120	- [x] Tâche 4 — Synchronisation SEO et données structurées Schema.org (AC: 5)
   121	  - [x] Aligner `servicesJsonLd` sur les 3 nouvelles offres de build avec `offers.description = "Sur devis"`.
   122	  - [x] Mettre à jour la balise meta `description` dans `usePageSeo` pour supprimer toute référence à l'ancien catalogue tarifaire (3 500 € HT, Blueprint en build).
   123	
   124	- [x] Tâche 5 — Validation a11y, responsive et Gate Docker Nitro SSG (AC: 5)
   125	  - [x] Tester la navigation clavier (`Tab`) et le focus visible sur les boutons des 3 cartes.
   126	  - [x] Vérifier le rendu sur mobile (< 900px) et la parité visuelle sur les thèmes clair et sombre.
   127	  - [x] Exécuter la commande de validation Docker :
   128	    ```sh
   129	    docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
   130	    ```
   131	  - [x] Vérifier que les 28 routes statiques pré-rendues compilent sans erreur ni avertissement.
   132	
   133	## Dev Notes
   134	
   135	### Contexte & Guardrails
   136	- **Fichier principal à modifier :** [`app/pages/services.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/services.vue).
   137	- **Fichier secondaire (résolution dette différée 15.1) :** [`app/pages/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue) (mise à jour des liens `to="/services#..."`).
   138	- **Fichier de suivi :** [`docs/implementation-artifacts/deferred-work.md`](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/deferred-work.md).
   139	- **Règle d'or Docker :** Ne JAMAIS lancer `pnpm` sur l'hôte macOS arm64.
   140	- **Règle NFR6 :** Zéro emoji dans l'UI et le code. Utiliser les icônes vectorielles du composant `<ZIcon>`.
   141	- **Règle Tokens :** Utiliser exclusivement `var(--token)`.
   142	- **Nuxt 4 Gotcha :** Ne pas injecter de chaîne brute pour `:as="NuxtLink"`, conserver l'import explicite `import { NuxtLink } from "#components"`.
   143	
   144	### Modèle TypeScript des Offres de Build
   145	```typescript
   146	interface Offer {
   147	  id: string;
   148	  icon: string;
   149	  badge: string;
   150	  badgeTone?: "accent" | "neutral";
   151	  title: string;
   152	  hook?: string;
   153	  desc: string;
   154	  points: string[];
   155	  price: string;
   156	  disclaimer?: string;
   157	  featured: boolean;
   158	  ctaText: string;
   159	  ctaAriaLabel: string;
   160	}
   161	```
   162	
   163	### Données Officielles V1.1 pour les 3 Offres de Build
   164	```typescript
   165	const offers: Offer[] = [
   166	  {
   167	    id: "automatisation",
   168	    icon: "zap",
   169	    badge: "BESOIN PRÉCIS",
   170	    badgeTone: "neutral",
   171	    title: "Automatisation ciblée",
   172	    hook: "Supprimer une tâche répétitive sans reconstruire tout le processus.",
   173	    desc: "Pour les besoins bien délimités : données, emails, documents, CRM, synchronisation, génération ou traitement automatisé.",
   174	    points: [
   175	      "Cartographie rapide du flux & cadrage du besoin",
   176	      "Automatisation logicielle & connecteurs API / webhooks",
   177	      "Traitement de données ou IA ciblée si pertinent",
   178	      "Contrôle ou validation humaine si requis",
   179	      "Tests, mise en production & documentation courte",
   180	    ],
   181	    price: "Sur devis",
   182	    featured: false,
   183	    ctaText: "Décrire mon besoin",
   184	    ctaAriaLabel: "Décrire mon besoin pour une automatisation ciblée",
   185	  },
   186	  {
   187	    id: "workflow",
   188	    icon: "layers",
   189	    badge: "OFFRE CŒUR",
   190	    badgeTone: "accent",

exec
/bin/zsh -lc 'rg -n "AI Workflow Sprint|AI Workflow Blueprint|AI Care|Services & Tarifs|3 500|/services#(automation|agents|apps)|28 routes|theme clair|offre cœur|sur devis" app docs content public | head -200' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/jouan-ovh-offre-v1-brief-codex.md:475:AI Workflow Sprint
docs/jouan-ovh-offre-v1-brief-codex.md:476:Projet à partir de 3 500 € HT
docs/jouan-ovh-offre-v1-brief-codex.md:491:Seul le **“à partir de 3 500 € HT”** doit éventuellement apparaître publiquement.
docs/jouan-ovh-offre-v1-brief-codex.md:496:AI Workflow Blueprint
docs/jouan-ovh-offre-v1-brief-codex.md:505:AI Care
docs/jouan-ovh-offre-v1-brief-codex.md:530:Ne jamais présenter AI Care comme :
docs/jouan-ovh-offre-v1-brief-codex.md:793:## Offre 1 — AI Workflow Sprint
docs/jouan-ovh-offre-v1-brief-codex.md:804:AI Workflow Sprint
docs/jouan-ovh-offre-v1-brief-codex.md:810:à partir de 3 500 € HT
docs/jouan-ovh-offre-v1-brief-codex.md:855:## Offre 2 — AI Workflow Blueprint
docs/jouan-ovh-offre-v1-brief-codex.md:860:AI Workflow Blueprint
docs/jouan-ovh-offre-v1-brief-codex.md:892:## Offre 3 — AI Care
docs/jouan-ovh-offre-v1-brief-codex.md:897:AI Care
docs/jouan-ovh-offre-v1-brief-codex.md:1234:- [ ] le prix public éventuel est “à partir de 3 500 € HT” ;
docs/jouan-ovh-offre-v1-brief-codex.md:1235:- [ ] AI Care sépare honoraires et coûts tiers ;
docs/simon_jouan_playbook_commercial_ia_v1.2.md:188:### AI Care
docs/simon_jouan_playbook_commercial_ia_v1.2.md:919:### AI Care — inclus
docs/simon_jouan_playbook_commercial_ia_v1.2.md:1242:1. **09:00 — Verrouille l'offre.** “Workflow AI Sprint — 3 900 € + AI Care 490 €/mois” comme hypothèse de départ.
docs/specs/spec-repositionnement-ia/SPEC.md:39:  success: La page `/services` articule le processus (Diagnostic, Cadrage, Build, Exploitation) et affiche les offres "AI Workflow Sprint" (à partir de 3 500 € HT), "AI Workflow Blueprint" (à partir de 750 € HT) et "AI Care" (à partir de 490 € HT/mois) en dissociant explicitement les coûts d'infrastructure et d'APIs tierces.
docs/specs/spec-repositionnement-ia/services-and-pricing.md:47:### Format Cœur — AI Workflow Sprint
docs/specs/spec-repositionnement-ia/services-and-pricing.md:48:- **Tarif public affiché :** *À partir de 3 500 € HT*
docs/specs/spec-repositionnement-ia/services-and-pricing.md:56:### Format Cadrage — AI Workflow Blueprint
docs/specs/spec-repositionnement-ia/services-and-pricing.md:61:### Format Exploitation — AI Care
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:21:> **Permettre à un prospect de comprendre que Simon peut traiter aussi bien une automatisation ciblée qu'un workflow métier complet, sans donner l'impression qu'un projet démarre obligatoirement à 3 500 € HT.**
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:26:À partir de 3 500 € HT
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:71:→ minimum 3 500 €
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:115:5. AI Care
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:258:AI Workflow Sprint
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:265:C'est **l'offre cœur**.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:317:**Ne pas afficher `À partir de 3 500 € HT`.**
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:322:Projet sur devis
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:329:Le Workflow AI Sprint reste une **hypothèse d'offre cœur autour de 3 900 € HT**, à ajuster selon le scope et la valeur.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:405:AI Workflow Blueprint
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:461:# 9. Offre 5 — AI Care
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:466:AI Care
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:471:AI Care n'est pas un abonnement ajouté automatiquement à tous les projets.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:486:> AI Care couvre le maintien en condition opérationnelle du système : monitoring, maintenance, support, suivi des coûts et adaptations mineures liées aux APIs ou aux modèles.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:584:À partir de 3 500 € HT
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:635:"Simon = projet minimum à 3 500 €"
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:737:AI Workflow Sprint
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:808:# 14. Page Services — AI Care séparé
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:810:Ne pas afficher AI Care comme une alternative équivalente aux trois offres de build.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:829:AI Care
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:840:Découvrir AI Care
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:968:### AI Care
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:988:À partir de 3 500 € HT
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:993:À partir de 3 500 € HT
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:997:AI Workflow Sprint
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:998:À partir de 3 500 € HT
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1001:Le prix de 3 500 / 3 900 € reste une hypothèse commerciale interne pour les projets correspondant réellement au niveau Workflow Sprint.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1114:- rendre AI Care obligatoire sur certains systèmes critiques.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1131:5. Supprimer les prix `À partir de 3 500 € HT` des cartes publiques concernées.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1139:9. Conserver AI Care comme offre d'exploitation séparée.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1140:10. Garder le Blueprint comme option de cadrage complexe, pas comme offre cœur.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1172:- [ ] aucun `À partir de 3 500 € HT` n'est affiché sur les cartes Automatisation / Agents IA ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1173:- [ ] le site ne donne plus l'impression que toute intervention coûte au minimum 3 500 € ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1175:- [ ] le Workflow métier reste visuellement identifiable comme offre cœur ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1180:- [ ] AI Care reste séparé du build ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1181:- [ ] `À partir de 250 € HT / mois` reste affiché pour AI Care ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1253:La V1.1 retire le ticket d'entrée public de **3 500 € HT**.
docs/project-context.md:287:Dernière mise à jour : 2026-09-18 (post-Epic 12 : repositionnement commercial V1 « Systèmes IA & Automatisation Métier » livré et déployé en production — epics 1→12 done ; refonte du Hero commercial, vitrine des 3 services et bloc différenciateur Prototype → Production ; 3 projets phares V1 Keova Signal, Debrief, Devis-Assist ; page Services avec offres Sprint, Blueprint, AI Care et process 4 étapes ; page À propos avec trajectoire métrologie/QA ; formulaire de contact avec qualification de workflow ; CTA inspecteur workflow ; SEO et Schema.org site-wide ; patch layout z-index .section stabilisé ; PR #7 mergée sur main et déploiement gh-pages actif sur https://jouan.ovh).
docs/planning-artifacts/epics.md:81:FR32: Page Services — Restructuration complète des offres & Processus en 4 étapes (Workflow Sprint à 3 500 € HT, Blueprint à 750 € HT, AI Care à 490 € HT/mois hors consommations tierces, et process Diagnostic → Cadrage → Build → Suivi). _(CAP-5)_
docs/planning-artifacts/epics.md:104:FR49: Page d'accueil — Retrait de toute mention « À partir de 3 500 € HT », intégration des liens contextuels vers les types de systèmes et insertion de la phrase de réassurance sur le dimensionnement selon le workflow réel. _(CAP-1)_
docs/planning-artifacts/epics.md:105:FR50: Page Services — Restructuration complète des offres de build en 3 niveaux d'intervention sur devis (Automatisation ciblée, Workflow métier, Système métier sur mesure) et relégation du Blueprint en cadrage préalable optionnel. _(CAP-2)_
docs/planning-artifacts/epics.md:106:FR51: Page Services — Section dédiée AI Care après mise en production (à partir de 250 € HT / mois) et réalignement du déroulé d'intervention en 4 étapes (Diagnostic gratuit 20-30 min, Cadrage, Construction & intégration, Exploitation & mesure). _(CAP-3)_
docs/planning-artifacts/epics.md:278:Le visiteur arrivant sur `jouan.ovh` (prospect ou client) comprend en moins de 15 secondes que Simon Jouan automatise les workflows métier des entreprises grâce à des systèmes IA robustes et industriels, validés par des réalisations concrètes (Keova Signal, Debrief, Devis-Assist) et une culture QA éprouvée, avec une grille tarifaire claire (Sprint à partir de 3 500 € HT) et un appel direct à qualifier son processus sans friction.
docs/planning-artifacts/epics.md:912:Le visiteur arrivant sur `jouan.ovh` (prospect ou client) comprend en moins de 15 secondes que Simon Jouan automatise les workflows métier des entreprises grâce à des systèmes IA robustes et industriels, validés par des réalisations concrètes (Keova Signal, Debrief, Devis-Assist) et une culture QA éprouvée, avec une grille tarifaire claire (Sprint à partir de 3 500 € HT) et un appel direct à qualifier son processus sans friction.
docs/planning-artifacts/epics.md:1010:  1. **AI Workflow Sprint** (Offre principale) : `À partir de 3 500 € HT`. Règle : `Un Sprint = un workflow prioritaire`. Liste complète des livrables inclus (diagnostic, cartographie, KPI, architecture, dev, intégrations, tests, MEP, documentation, mesure initiale).
docs/planning-artifacts/epics.md:1011:  2. **AI Workflow Blueprint** : `À partir de 750 € HT`. Cadrage préalable pour problématique complexe (processus actuel, volumes, risques, flux cible, matrice IA vs automation vs humain, KPI, estimation).
docs/planning-artifacts/epics.md:1012:  3. **AI Care** : `À partir de 490 € HT / mois`. Maintien en condition opérationnelle (monitoring, maintenance, support, veille coûts et modèles), avec exclusion explicite des consommations tierces d'APIs/tokens refacturées au réel.
docs/planning-artifacts/epics.md:1230:Simon Jouan souhaite supprimer l'affichage récurrent du prix d'entrée public de 3 500 € HT qui freinait les prospects ayant des besoins d'automatisation ciblée, et restructurer l'offre en 3 niveaux d'intervention sur devis, tout en conservant le Workflow métier comme offre cœur, AI Care isolé après mise en production à partir de 250 € HT/mois, et le Blueprint en cadrage optionnel.
docs/planning-artifacts/epics.md:1235:I want comprendre que Simon intervient aussi bien sur une automatisation ciblée que sur un workflow complet sans imposer un ticket d'entrée public à 3 500 € HT,
docs/planning-artifacts/epics.md:1242:**Then** la mention `À partir de 3 500 € HT` est intégralement retirée des cartes *Automatisation de processus métier* et *Agents IA intégrés à vos outils*
docs/planning-artifacts/epics.md:1268:**And** l'offre *AI Workflow Blueprint* est retirée des cartes de build principales pour devenir une option de cadrage dans la section process.
docs/planning-artifacts/epics.md:1270:### Story 15.3: Page Services — Section Dédiée AI Care Après Mise en Production & Process 4 Étapes
docs/planning-artifacts/epics.md:1283:  - Carte ou bloc dédié `AI Care` affichant `À partir de 250 € HT / mois`
docs/planning-artifacts/epics.md:1286:  - CTA orienté « Découvrir AI Care »
docs/planning-artifacts/epics.md:1305:**And** les méta-descriptions SEO et OpenGraph gérées par `usePageSeo()` sont alignées sur l'Offre V1.1 sans référence obsolète aux 3 500 €
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1804:    price: "sur devis",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1811:    price: "sur devis",
docs/planning-artifacts/sprint-change-proposal-2026-09-18.md:17:Suite aux récents retours et échanges commerciaux, l'offre publique actuellement déployée sur `jouan.ovh` (issue de l'Epic 12) souffre d'un biais d'ancrage tarifaire bloquant : l'affichage récurrent de la mention **« À partir de 3 500 € HT »** sous les cartes d'accueil et de services donne l'impression erronée qu'aucun projet ne démarre en deçà de ce montant.
docs/planning-artifacts/sprint-change-proposal-2026-09-18.md:25:* `app/pages/index.vue` (L351, L366) : cartes 1 et 2 affichant en dur `price: "À partir de 3 500 € HT"`.
docs/planning-artifacts/sprint-change-proposal-2026-09-18.md:26:* `app/pages/services.vue` (L129) : carte principale *AI Workflow Sprint* affichant `price: "À partir de 3 500 € HT"`.
docs/planning-artifacts/sprint-change-proposal-2026-09-18.md:27:* `app/pages/services.vue` (L147, L166) : *AI Workflow Blueprint* présenté comme l'un des 3 piliers principaux de build, et *AI Care* affiché à 490 € HT/mois au même rang que le développement initial.
docs/planning-artifacts/sprint-change-proposal-2026-09-18.md:40:* **PRD / SPEC (`docs/specs/spec-repositionnement-ia/SPEC.md`) :** Les capacités CAP-3 et CAP-5 sont amendées par l'Offre V1.1 (abandon de la contrainte de prix public à 3 500 € HT, passage aux 3 niveaux d'intervention sur devis, AI Care à 250 €/mois, Blueprint optionnel).
docs/planning-artifacts/sprint-change-proposal-2026-09-18.md:61:FR49: Homepage — Suppression de tout affichage public de « À partir de 3 500 € HT », intégration des liens contextuels d'approfondissement vers `/services` et de la phrase de réassurance workflow.
docs/planning-artifacts/sprint-change-proposal-2026-09-18.md:62:FR50: Page Services — Restructuration complète en 3 niveaux d'intervention sur devis (Automatisation ciblée, Workflow métier, Système métier sur mesure) et relégation du Blueprint en cadrage préalable optionnel (à partir de 750 € HT).
docs/planning-artifacts/sprint-change-proposal-2026-09-18.md:63:FR51: Page Services — Isolation d'AI Care en section dédiée après mise en production (à partir de 250 € HT / mois) et réalignement du déroulé d'intervention en 4 étapes.
docs/planning-artifacts/sprint-change-proposal-2026-09-18.md:71:* **Objectif :** Supprimer `price: "À partir de 3 500 € HT"` sous les cartes expertises, insérer les liens d'exploration (« Voir les types d'automatisation → », etc.) et injecter la phrase de réassurance :
docs/planning-artifacts/sprint-change-proposal-2026-09-18.md:74:#### Story 15.2 : Page Services — Restructuration des 3 offres de build sur devis & intégration Blueprint optionnel
docs/planning-artifacts/sprint-change-proposal-2026-09-18.md:82:#### Story 15.3 : Page Services — Section dédiée AI Care après mise en production et process 4 étapes
docs/planning-artifacts/sprint-change-proposal-2026-09-18.md:87:  * Carte : `AI Care` à partir de `250 € HT / mois`.
docs/planning-artifacts/sprint-change-proposal-2026-09-18.md:110:  - [ ] 0 mention de `3 500 € HT` sur l'Accueil et les cartes de build Services.
docs/planning-artifacts/sprint-change-proposal-2026-09-18.md:113:  - [ ] AI Care est séparé du build et affiche `À partir de 250 € HT / mois`.
docs/design_system/_ds_bundle.js:1804:    price: "sur devis",
docs/design_system/_ds_bundle.js:1811:    price: "sur devis",
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:424:      { ico: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>', title: "Applications web", desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, en architecture propre.", points: ["API REST / GraphQL", "Front Vue / Nuxt", "Tests & CI/CD"], price: "sur devis", feat: true },
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:425:      { ico: '<path d="M12 3l1.8 5.6L19.5 10l-5.7 1.4L12 17l-1.8-5.6L4.5 10l5.7-1.4z"/>', title: "IA & automatisation", desc: "L'IA au service du code : agents, workflows n8n, intégrations LLM.", points: ["Agents & workflows n8n", "Intégration d'API LLM", "Automatisation de contenu"], price: "sur devis", feat: false },
docs/design_system/ui_kits/jouan-site/data.js:32:      price: "sur devis",
docs/design_system/ui_kits/jouan-site/data.js:40:      price: "sur devis",
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:14:I want comprendre que Simon intervient aussi bien sur une automatisation ciblée que sur un workflow complet sans imposer un ticket d'entrée public à 3 500 € HT,
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:21:   **Then** la propriété `price: "À partir de 3 500 € HT"` est intégralement retirée des données des cartes *Automatisation de processus métier* et *Agents IA intégrés à vos outils*
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:22:   **And** l'élément `.offer__price` affichant ce montant est supprimé du template HTML pour éliminer tout ancrage tarifaire public à 3 500 € HT.
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:52:    - *Automatisation :* retirer `price: "À partir de 3 500 € HT"`, ajouter `actionText: "Voir les types d'automatisation →"`
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:53:    - *Agents IA :* retirer `price: "À partir de 3 500 € HT"`, ajouter `actionText: "Voir quand utiliser un agent →"`
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:77:- [x] [Review][Defer] Prix résiduels de 3 500 € HT sur la page `/services` [`app/pages/services.vue`] — deferred, pre-existing (prévu dans Story 15.2 dédiée au catalogue services).
docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md:63:     - Services (`/services`) : titre `Services & Tarifs — Simon Jouan` (conforme à la story 12.5)
docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md:136:- Gate Docker 100% verte : ESLint 0 erreur, Stylelint 0 erreur, vue-tsc 0 erreur, Nitro SSG 28 routes statiques pré-rendues.
docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md:146:- Validation de conformité 100% verte de la gate de production Docker Nitro SSG (28 routes pré-rendues).
docs/implementation-artifacts/12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur.md:24:     1. **Automatisation de processus métier** (`id: "automation"`, icône `layers`, tags `Workflow` · `APIs` · `Automation` · `PostgreSQL`, prix/format `À partir de 3 500 € HT` ou `Format Sprint`)
docs/implementation-artifacts/12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur.md:25:     2. **Agents IA intégrés à vos outils** (`id: "agents"`, `featured: true`, icône `bot` ou `spark`, tags `Agents IA` · `LLM` · `MCP` · `Human-in-the-loop`, prix/format `À partir de 3 500 € HT` ou `Format Sprint`)
docs/implementation-artifacts/12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur.md:57:    - Offre 1 : `id: "automation"`, `no: "01 / 03"`, `title: "Automatisation de processus métier"`, promesse/points, tags `["Workflow", "APIs", "Automation", "PostgreSQL"]`, format tarifaire `À partir de 3 500 € HT`
docs/implementation-artifacts/12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur.md:58:    - Offre 2 : `id: "agents"`, `no: "02 / 03"`, `title: "Agents IA intégrés à vos outils"`, promesse/points, tags `["Agents IA", "LLM", "MCP", "Human-in-the-loop"]`, format tarifaire `À partir de 3 500 € HT`, `featured: true`
docs/implementation-artifacts/15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint.md:47:        - Titre : `Workflow métier` (mention optionnelle `AI Workflow Sprint`)
docs/implementation-artifacts/15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint.md:57:        - Prix : `Sur devis` (dans `.offer__price`, suppression définitive de `À partir de 3 500 € HT`)
docs/implementation-artifacts/15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint.md:78:   **Then** l'offre *AI Workflow Blueprint* est retirée des cartes de build principales pour devenir une option de cadrage dans la section process (anticipation Story 15.3).
docs/implementation-artifacts/15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint.md:79:   **And** la carte *AI Care* est retirée de la grille de build `.grid-3` pour ne pas la présenter comme un build équivalent (sa section dédiée post-déploiement fera l'objet de la Story 15.3).
docs/implementation-artifacts/15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint.md:91:   **Then** l'objet JSON-LD `servicesJsonLd` (Schema.org `ItemList`) et `usePageSeo` sont alignés sur les 3 offres de build sans mention de "3 500 € HT".
docs/implementation-artifacts/15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint.md:122:  - [x] Mettre à jour la balise meta `description` dans `usePageSeo` pour supprimer toute référence à l'ancien catalogue tarifaire (3 500 € HT, Blueprint en build).
docs/implementation-artifacts/15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint.md:131:  - [x] Vérifier que les 28 routes statiques pré-rendues compilent sans erreur ni avertissement.
docs/implementation-artifacts/15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint.md:256:- ✅ **Restructuration des 3 offres de build :** `automatisation` (BESOIN PRÉCIS, Sur devis), `workflow` (OFFRE CŒUR, Sur devis, featured: true), `sur-mesure` (PROJET COMPLEXE, Sur devis). Suppression intégrale du prix d'entrée « À partir de 3 500 € HT ».
docs/implementation-artifacts/15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint.md:257:- ✅ **Badges de statut & Accessibilité :** Utilisation de `<ZBadge>` avec `tone="accent"` pour l'offre cœur et `tone="neutral"` pour les autres ; boutons `<ZButton>` avec labels et `aria-label` contextuels (`/contact`).
docs/implementation-artifacts/15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint.md:270:- 2026-09-18: Implémentation complète de la Story 15.2 (restructuration des 3 offres de build sur devis, Hero V1.1, ancres de navigation, synchronisation SEO/JSON-LD et résolution de la dette différée de liens d'accueil).
docs/implementation-artifacts/4-1-route-services-et-cartes-doffre.md:75:2. `code` — **Applications web** — desc « Des produits complets en Symfony, Nest.js et Nuxt.js… » — points : `API REST / GraphQL (Symfony · Nest.js)`, `Front Vue / Nuxt`, `Tests & CI/CD, qualité QA` — prix `sur devis` — `featured: true`.
docs/implementation-artifacts/4-1-route-services-et-cartes-doffre.md:76:3. `spark` — **IA & automatisation** — desc « L'IA au service du code… » — points : `Agents & workflows (n8n)`, `Intégration d'API LLM`, `Automatisation de contenu` — prix `sur devis` — `featured: false`.
docs/implementation-artifacts/deferred-work.md:46:- ~~**Désancrage tarifaire résiduel sur la page catalogue `/services`**~~ — ✅ **Résolu en 15.2** (`app/pages/services.vue` : 3 offres sur devis, élimination définitive du prix d'entrée 3 500 € HT et restructuration du catalogue de build).
docs/implementation-artifacts/deferred-work.md:164:- **Prix numériques et devise structurée (`priceCurrency`) pour les offres dans Schema.org** (`app/pages/services.vue:141-147`) — Les prestations exposent des libellés UI de présentation (« à partir de 1 500 € », « sur devis »). Une formalisation stricte sous forme de grille tarifaire machine-readable Schema.org (`priceCurrency: 'EUR'`, `price: 1500`) relève d'une décision de contenu/commerciale sur la formalisation tarifaire.
docs/implementation-artifacts/epic-12-retro-2026-09-18.md:23:  - **12.5 — Page Services — Restructuration complète des offres & Processus en 4 étapes :** Grille tarifaire forfaitaire et transparente des 3 formats d'engagement (*AI Workflow Sprint* à partir de 3 500 € HT, *AI Workflow Blueprint* à partir de 750 € HT, *AI Care* à partir de 490 € HT/mois) avec dissociation explicite des coûts tiers d'infrastructure et d'APIs, couplée au déroulé méthodologique en 4 étapes sémantiques (Diagnostic, Cadrage, Construction & intégration, Suivi & amélioration) avec CTA inline.
docs/implementation-artifacts/12-5-page-services-restructuration-des-offres-et-process-4-etapes.md:29:     1. **AI Workflow Sprint** (`id: "sprint"`, `featured: true` avec badge `<ZBadge tone="accent">Format cœur</ZBadge>`, icône `zap`) :
docs/implementation-artifacts/12-5-page-services-restructuration-des-offres-et-process-4-etapes.md:30:        - Titre : `AI Workflow Sprint`
docs/implementation-artifacts/12-5-page-services-restructuration-des-offres-et-process-4-etapes.md:39:        - Prix : `À partir de 3 500 € HT`
docs/implementation-artifacts/12-5-page-services-restructuration-des-offres-et-process-4-etapes.md:40:        - Bouton d'action : `<ZButton :as="NuxtLink" to="/contact" variant="primary" class="offer__btn" :aria-label="'Discuter d\'un AI Workflow Sprint'">Lancer un Sprint</ZButton>`
docs/implementation-artifacts/12-5-page-services-restructuration-des-offres-et-process-4-etapes.md:41:     2. **AI Workflow Blueprint** (`id: "blueprint"`, `featured: false`, icône `layers`) :
docs/implementation-artifacts/12-5-page-services-restructuration-des-offres-et-process-4-etapes.md:42:        - Titre : `AI Workflow Blueprint`
docs/implementation-artifacts/12-5-page-services-restructuration-des-offres-et-process-4-etapes.md:52:        - Bouton d'action : `<ZButton :as="NuxtLink" to="/contact" variant="secondary" class="offer__btn" :aria-label="'Demander un AI Workflow Blueprint'">Demander un Blueprint</ZButton>`
docs/implementation-artifacts/12-5-page-services-restructuration-des-offres-et-process-4-etapes.md:53:     3. **AI Care** (`id: "care"`, `featured: false`, icône `bot`) :
docs/implementation-artifacts/12-5-page-services-restructuration-des-offres-et-process-4-etapes.md:54:        - Titre : `AI Care`
docs/implementation-artifacts/12-5-page-services-restructuration-des-offres-et-process-4-etapes.md:64:        - Bouton d'action : `<ZButton :as="NuxtLink" to="/contact" variant="secondary" class="offer__btn" :aria-label="'Découvrir l\'accompagnement AI Care'">Découvrir AI Care</ZButton>`
docs/implementation-artifacts/12-5-page-services-restructuration-des-offres-et-process-4-etapes.md:81:     - `title` : `Services & Tarifs — Simon Jouan`
docs/implementation-artifacts/12-5-page-services-restructuration-des-offres-et-process-4-etapes.md:82:     - `description` : `Développement de systèmes IA et automatisation de processus métier : offres packagées (AI Workflow Sprint, Blueprint, AI Care) et déroulement d'intervention transparent.`
docs/implementation-artifacts/12-5-page-services-restructuration-des-offres-et-process-4-etapes.md:83:   **And** l'objet JSON-LD `servicesJsonLd` (`@type: "ItemList"` / `Service`) référence fidèlement les 3 nouvelles offres (AI Workflow Sprint, AI Workflow Blueprint, AI Care) sans aucune mention obsolète.
docs/implementation-artifacts/12-5-page-services-restructuration-des-offres-et-process-4-etapes.md:101:    - `id: "sprint"` : AI Workflow Sprint (3 500 € HT, format cœur `featured: true`, livrables complets)
docs/implementation-artifacts/12-5-page-services-restructuration-des-offres-et-process-4-etapes.md:102:    - `id: "blueprint"` : AI Workflow Blueprint (750 € HT, cadrage complexe)
docs/implementation-artifacts/12-5-page-services-restructuration-des-offres-et-process-4-etapes.md:103:    - `id: "care"` : AI Care (490 € HT / mois, maintien en condition opérationnelle, exclusion consommations tierces)
docs/implementation-artifacts/12-5-page-services-restructuration-des-offres-et-process-4-etapes.md:117:  - [x] Aligner l'objet `servicesJsonLd` sur les 3 nouvelles offres (AI Workflow Sprint, AI Workflow Blueprint, AI Care).
docs/implementation-artifacts/12-5-page-services-restructuration-des-offres-et-process-4-etapes.md:178:  - **AI Workflow Sprint** : format cœur mis en avant avec badge `<ZBadge tone="accent">Format cœur</ZBadge>`, prix à partir de 3 500 € HT, icône `zap`, 5 livrables clés et CTA primaire.
docs/implementation-artifacts/12-5-page-services-restructuration-des-offres-et-process-4-etapes.md:179:  - **AI Workflow Blueprint** : cadrage complexe préalable, prix à partir de 750 € HT, icône `layers`, 5 livrables clés et CTA secondaire.
docs/implementation-artifacts/12-5-page-services-restructuration-des-offres-et-process-4-etapes.md:180:  - **AI Care** : maintien en condition opérationnelle, prix à partir de 490 € HT / mois, icône `bot`, 4 livrables clés, clause de transparence sur les consommations tierces d'APIs/tokens et CTA secondaire.
docs/implementation-artifacts/code-reviews/12-3/raw-acceptance-auditor.md:154:     1. **Automatisation de processus métier** (`id: "automation"`, icône `layers`, tags `Workflow` · `APIs` · `Automation` · `PostgreSQL`, prix/format `À partir de 3 500 € HT` ou `Format Sprint`)
docs/implementation-artifacts/code-reviews/12-3/raw-acceptance-auditor.md:155:     2. **Agents IA intégrés à vos outils** (`id: "agents"`, `featured: true`, icône `bot` ou `spark`, tags `Agents IA` · `LLM` · `MCP` · `Human-in-the-loop`, prix/format `À partir de 3 500 € HT` ou `Format Sprint`)
docs/implementation-artifacts/code-reviews/12-3/raw-acceptance-auditor.md:187:    - Offre 1 : `id: "automation"`, `no: "01 / 03"`, `title: "Automatisation de processus métier"`, promesse/points, tags `["Workflow", "APIs", "Automation", "PostgreSQL"]`, format tarifaire `À partir de 3 500 € HT`
docs/implementation-artifacts/code-reviews/12-3/raw-acceptance-auditor.md:188:    - Offre 2 : `id: "agents"`, `no: "02 / 03"`, `title: "Agents IA intégrés à vos outils"`, promesse/points, tags `["Agents IA", "LLM", "MCP", "Human-in-the-loop"]`, format tarifaire `À partir de 3 500 € HT`, `featured: true`
docs/implementation-artifacts/code-reviews/12-3/raw-acceptance-auditor.md:379:  success: La page `/services` articule le processus (Diagnostic, Cadrage, Build, Exploitation) et affiche les offres "AI Workflow Sprint" (à partir de 3 500 € HT), "AI Workflow Blueprint" (à partir de 750 € HT) et "AI Care" (à partir de 490 € HT/mois) en dissociant explicitement les coûts d'infrastructure et d'APIs tierces.
docs/implementation-artifacts/code-reviews/12-3/raw-acceptance-auditor.md:478:### Format Cœur — AI Workflow Sprint
docs/implementation-artifacts/code-reviews/12-3/raw-acceptance-auditor.md:479:- **Tarif public affiché :** *À partir de 3 500 € HT*
docs/implementation-artifacts/code-reviews/12-3/raw-acceptance-auditor.md:487:### Format Cadrage — AI Workflow Blueprint
docs/implementation-artifacts/code-reviews/12-3/raw-acceptance-auditor.md:492:### Format Exploitation — AI Care
docs/implementation-artifacts/code-reviews/12-3/raw-acceptance-auditor.md:926:+    price: "À partir de 3 500 € HT",
docs/implementation-artifacts/code-reviews/12-3/raw-acceptance-auditor.md:950:+    price: "À partir de 3 500 € HT",
docs/implementation-artifacts/code-reviews/12-3/raw-acceptance-auditor.md:1194:+     1. **Automatisation de processus métier** (`id: "automation"`, icône `layers`, tags `Workflow` · `APIs` · `Automation` · `PostgreSQL`, prix/format `À partir de 3 500 € HT` ou `Format Sprint`)
docs/implementation-artifacts/code-reviews/12-3/raw-acceptance-auditor.md:1195:+     2. **Agents IA intégrés à vos outils** (`id: "agents"`, `featured: true`, icône `bot` ou `spark`, tags `Agents IA` · `LLM` · `MCP` · `Human-in-the-loop`, prix/format `À partir de 3 500 € HT` ou `Format Sprint`)
docs/implementation-artifacts/code-reviews/12-3/raw-acceptance-auditor.md:1227:+    - Offre 1 : `id: "automation"`, `no: "01 / 03"`, `title: "Automatisation de processus métier"`, promesse/points, tags `["Workflow", "APIs", "Automation", "PostgreSQL"]`, format tarifaire `À partir de 3 500 € HT`
docs/implementation-artifacts/code-reviews/12-3/raw-acceptance-auditor.md:1228:+    - Offre 2 : `id: "agents"`, `no: "02 / 03"`, `title: "Agents IA intégrés à vos outils"`, promesse/points, tags `["Agents IA", "LLM", "MCP", "Human-in-the-loop"]`, format tarifaire `À partir de 3 500 € HT`, `featured: true`
docs/implementation-artifacts/code-reviews/12-3/raw-edge-case-hunter.json:243:+    price: "À partir de 3 500 € HT",
docs/implementation-artifacts/code-reviews/12-3/raw-edge-case-hunter.json:267:+    price: "À partir de 3 500 € HT",
docs/implementation-artifacts/code-reviews/12-3/raw-edge-case-hunter.json:496:+     1. **Automatisation de processus métier** (`id: "automation"`, icône `layers`, tags `Workflow` · `APIs` · `Automation` · `PostgreSQL`, prix/format `À partir de 3 500 € HT` ou `Format Sprint`)
docs/implementation-artifacts/code-reviews/12-3/raw-edge-case-hunter.json:497:+     2. **Agents IA intégrés à vos outils** (`id: "agents"`, `featured: true`, icône `bot` ou `spark`, tags `Agents IA` · `LLM` · `MCP` · `Human-in-the-loop`, prix/format `À partir de 3 500 € HT` ou `Format Sprint`)
docs/implementation-artifacts/code-reviews/12-3/raw-edge-case-hunter.json:529:+    - Offre 1 : `id: "automation"`, `no: "01 / 03"`, `title: "Automatisation de processus métier"`, promesse/points, tags `["Workflow", "APIs", "Automation", "PostgreSQL"]`, format tarifaire `À partir de 3 500 € HT`
docs/implementation-artifacts/code-reviews/12-3/raw-edge-case-hunter.json:530:+    - Offre 2 : `id: "agents"`, `no: "02 / 03"`, `title: "Agents IA intégrés à vos outils"`, promesse/points, tags `["Agents IA", "LLM", "MCP", "Human-in-the-loop"]`, format tarifaire `À partir de 3 500 € HT`, `featured: true`
docs/implementation-artifacts/code-reviews/12-3/raw-edge-case-hunter.json:938:   355	    price: "À partir de 3 500 € HT",
docs/implementation-artifacts/code-reviews/12-3/raw-edge-case-hunter.json:953:   370	    price: "À partir de 3 500 € HT",
docs/implementation-artifacts/code-reviews/13-2/raw-acceptance-auditor.md:1108:docs/planning-artifacts/epics.md-270-Le visiteur arrivant sur `jouan.ovh` (prospect ou client) comprend en moins de 15 secondes que Simon Jouan automatise les workflows métier des entreprises grâce à des systèmes IA robustes et industriels, validés par des réalisations concrètes (Keova Signal, Debrief, Devis-Assist) et une culture QA éprouvée, avec une grille tarifaire claire (Sprint à partir de 3 500 € HT) et un appel direct à qualifier son processus sans friction.
docs/implementation-artifacts/code-reviews/epic-11/raw-acceptance-auditor.md:3850:   136	- **Prix numériques et devise structurée (`priceCurrency`) pour les offres dans Schema.org** (`app/pages/services.vue:141-147`) — Les prestations exposent des libellés UI de présentation (« à partir de 1 500 € », « sur devis »). Une formalisation stricte sous forme de grille tarifaire machine-readable Schema.org (`priceCurrency: 'EUR'`, `price: 1500`) relève d'une décision de contenu/commerciale sur la formalisation tarifaire.
docs/implementation-artifacts/code-reviews/12-3/full.diff:138:+    price: "À partir de 3 500 € HT",
docs/implementation-artifacts/code-reviews/12-3/full.diff:162:+    price: "À partir de 3 500 € HT",
docs/implementation-artifacts/code-reviews/12-3/full.diff:387:+     1. **Automatisation de processus métier** (`id: "automation"`, icône `layers`, tags `Workflow` · `APIs` · `Automation` · `PostgreSQL`, prix/format `À partir de 3 500 € HT` ou `Format Sprint`)
docs/implementation-artifacts/code-reviews/12-3/full.diff:388:+     2. **Agents IA intégrés à vos outils** (`id: "agents"`, `featured: true`, icône `bot` ou `spark`, tags `Agents IA` · `LLM` · `MCP` · `Human-in-the-loop`, prix/format `À partir de 3 500 € HT` ou `Format Sprint`)
docs/implementation-artifacts/code-reviews/12-3/full.diff:420:+    - Offre 1 : `id: "automation"`, `no: "01 / 03"`, `title: "Automatisation de processus métier"`, promesse/points, tags `["Workflow", "APIs", "Automation", "PostgreSQL"]`, format tarifaire `À partir de 3 500 € HT`
docs/implementation-artifacts/code-reviews/12-3/full.diff:421:+    - Offre 2 : `id: "agents"`, `no: "02 / 03"`, `title: "Agents IA intégrés à vos outils"`, promesse/points, tags `["Agents IA", "LLM", "MCP", "Human-in-the-loop"]`, format tarifaire `À partir de 3 500 € HT`, `featured: true`
docs/implementation-artifacts/code-reviews/12-3/raw-blind-hunter.md:208:+    price: "À partir de 3 500 € HT",
docs/implementation-artifacts/code-reviews/12-3/raw-blind-hunter.md:232:+    price: "À partir de 3 500 € HT",
docs/implementation-artifacts/code-reviews/12-3/raw-blind-hunter.md:463:+     1. **Automatisation de processus métier** (`id: "automation"`, icône `layers`, tags `Workflow` · `APIs` · `Automation` · `PostgreSQL`, prix/format `À partir de 3 500 € HT` ou `Format Sprint`)
docs/implementation-artifacts/code-reviews/12-3/raw-blind-hunter.md:464:+     2. **Agents IA intégrés à vos outils** (`id: "agents"`, `featured: true`, icône `bot` ou `spark`, tags `Agents IA` · `LLM` · `MCP` · `Human-in-the-loop`, prix/format `À partir de 3 500 € HT` ou `Format Sprint`)
docs/implementation-artifacts/code-reviews/12-3/raw-blind-hunter.md:496:+    - Offre 1 : `id: "automation"`, `no: "01 / 03"`, `title: "Automatisation de processus métier"`, promesse/points, tags `["Workflow", "APIs", "Automation", "PostgreSQL"]`, format tarifaire `À partir de 3 500 € HT`
docs/implementation-artifacts/code-reviews/12-3/raw-blind-hunter.md:497:+    - Offre 2 : `id: "agents"`, `no: "02 / 03"`, `title: "Agents IA intégrés à vos outils"`, promesse/points, tags `["Agents IA", "LLM", "MCP", "Human-in-the-loop"]`, format tarifaire `À partir de 3 500 € HT`, `featured: true`
docs/implementation-artifacts/code-reviews/12-3/raw-blind-hunter.md:585:- Les trois offres affichent deux prix identiques “À partir de 3 500 € HT” pour les deux premières offres sans expliquer le périmètre, ce qui peut paraître arbitraire ou trop vague pour un prospect.
docs/implementation-artifacts/code-reviews/12-3/raw-blind-hunter.md:636:- Les trois offres affichent deux prix identiques “À partir de 3 500 € HT” pour les deux premières offres sans expliquer le périmètre, ce qui peut paraître arbitraire ou trop vague pour un prospect.
docs/implementation-artifacts/code-reviews/10-7/raw-acceptance-auditor.md:2189:./docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2566:<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"Services — jouan.ovh","description":"Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.","url":"https://dev.jouan.ovh/services","mainEntity":{"@type":"ItemList","itemListElement":[{"@type":"Offer","position":1,"name":"WordPress sur-mesure","description":"Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.","price":"à partir de 1 500 €"},{"@type":"Offer","position":2,"name":"Applications web","description":"Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.","price":"sur devis"},{"@type":"Offer","position":3,"name":"IA & automatisation","description":"L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.","price":"sur devis"}]}}
docs/implementation-artifacts/code-reviews/10-7/raw-acceptance-auditor.md:2224:./docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2626:{"@context":"https://schema.org","@type":"WebPage","name":"Services — jouan.ovh","description":"Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.","url":"https://dev.jouan.ovh/services","mainEntity":{"@type":"ItemList","itemListElement":[{"@type":"Offer","position":1,"name":"WordPress sur-mesure","description":"Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.","price":"à partir de 1 500 €"},{"@type":"Offer","position":2,"name":"Applications web","description":"Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.","price":"sur devis"},{"@type":"Offer","position":3,"name":"IA & automatisation","description":"L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.","price":"sur devis"}]}}
docs/implementation-artifacts/code-reviews/10-7/raw-acceptance-auditor.md:2268:./docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:3243:docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1804-    price: "sur devis",
docs/implementation-artifacts/code-reviews/10-7/raw-acceptance-auditor.md:2463:./docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:2114:<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"Services — jouan.ovh","description":"Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.","url":"https://dev.jouan.ovh/services","mainEntity":{"@type":"ItemList","itemListElement":[{"@type":"Offer","position":1,"name":"WordPress sur-mesure","description":"Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.","price":"à partir de 1 500 €"},{"@type":"Offer","position":2,"name":"Applications web","description":"Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.","price":"sur devis"},{"@type":"Offer","position":3,"name":"IA & automatisation","description":"L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.","price":"sur devis"}]}}
docs/implementation-artifacts/code-reviews/10-7/raw-acceptance-auditor.md:2629:./docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:2496:<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"Services — jouan.ovh","description":"Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.","url":"https://dev.jouan.ovh/services","mainEntity":{"@type":"ItemList","itemListElement":[{"@type":"Offer","position":1,"name":"WordPress sur-mesure","description":"Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.","price":"à partir de 1 500 €"},{"@type":"Offer","position":2,"name":"Applications web","description":"Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.","price":"sur devis"},{"@type":"Offer","position":3,"name":"IA & automatisation","description":"L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.","price":"sur devis"}]}}
docs/implementation-artifacts/code-reviews/10-7/raw-acceptance-auditor.md:2673:./docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:2679:<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"Services — jouan.ovh","description":"Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.","url":"https://dev.jouan.ovh/services","mainEntity":{"@type":"ItemList","itemListElement":[{"@type":"Offer","position":1,"name":"WordPress sur-mesure","description":"Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.","price":"à partir de 1 500 €"},{"@type":"Offer","position":2,"name":"Applications web","description":"Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.","price":"sur devis"},{"@type":"Offer","position":3,"name":"IA & automatisation","description":"L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.","price":"sur devis"}]}}
docs/implementation-artifacts/code-reviews/10-7/raw-acceptance-auditor.md:2713:./docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:2776:2496:<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"Services — jouan.ovh","description":"Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.","url":"https://dev.jouan.ovh/services","mainEntity":{"@type":"ItemList","itemListElement":[{"@type":"Offer","position":1,"name":"WordPress sur-mesure","description":"Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.","price":"à partir de 1 500 €"},{"@type":"Offer","position":2,"name":"Applications web","description":"Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.","price":"sur devis"},{"@type":"Offer","position":3,"name":"IA & automatisation","description":"L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.","price":"sur devis"}]}}
docs/implementation-artifacts/code-reviews/10-7/raw-acceptance-auditor.md:2743:./docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:2836:2679:<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"Services — jouan.ovh","description":"Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.","url":"https://dev.jouan.ovh/services","mainEntity":{"@type":"ItemList","itemListElement":[{"@type":"Offer","position":1,"name":"WordPress sur-mesure","description":"Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.","price":"à partir de 1 500 €"},{"@type":"Offer","position":2,"name":"Applications web","description":"Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.","price":"sur devis"},{"@type":"Offer","position":3,"name":"IA & automatisation","description":"L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.","price":"sur devis"}]}}
docs/implementation-artifacts/code-reviews/epic-11/full.diff:6113:+      { ico: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>', title: "Applications web", desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, en architecture propre.", points: ["API REST / GraphQL", "Front Vue / Nuxt", "Tests & CI/CD"], price: "sur devis", feat: true },
docs/implementation-artifacts/code-reviews/epic-11/full.diff:6114:+      { ico: '<path d="M12 3l1.8 5.6L19.5 10l-5.7 1.4L12 17l-1.8-5.6L4.5 10l5.7-1.4z"/>', title: "IA & automatisation", desc: "L'IA au service du code : agents, workflows n8n, intégrations LLM.", points: ["Agents & workflows n8n", "Intégration d'API LLM", "Automatisation de contenu"], price: "sur devis", feat: false },
docs/implementation-artifacts/code-reviews/15-2/raw-acceptance-auditor.md:89:        - Titre : `Workflow métier` (mention optionnelle `AI Workflow Sprint`)
docs/implementation-artifacts/code-reviews/15-2/raw-acceptance-auditor.md:99:        - Prix : `Sur devis` (dans `.offer__price`, suppression définitive de `À partir de 3 500 € HT`)
docs/implementation-artifacts/code-reviews/15-2/raw-acceptance-auditor.md:120:   **Then** l'offre *AI Workflow Blueprint* est retirée des cartes de build principales pour devenir une option de cadrage dans la section process (anticipation Story 15.3).

codex
- Les liens « Agents IA » de l’accueil aboutissent à une carte intitulée « Workflow métier », sans reprendre ni expliquer explicitement la notion d’agent IA.

- La mention du Blueprint est réduite à une phrase dans l’étape « Cadrage », sans description de son contenu, de ses livrables, de son prix ou de CTA permettant de le demander.

- L’étape « Suivi & amélioration » continue de promettre monitoring, maintenance et support, alors qu’AI Care a été retiré sans section dédiée ni périmètre commercial visible.

- Les trois offres affichent uniquement « Sur devis », sans aucun repère de périmètre, durée, charge ou ordre de grandeur permettant réellement au prospect d’identifier le format adapté.

- Le JSON-LD encode « Sur devis » comme `offers.description`, mais ne fournit ni `price`, ni `priceCurrency`, ni autre indication structurée cohérente pour une offre commerciale non tarifée.

- Les objets `Service` du JSON-LD ne contiennent pas d’URL vers leurs ancres respectives, ce qui empêche de relier les entrées structurées aux cartes réellement accessibles dans la page.

- Le fournisseur Schema.org est déclaré comme une `Organization`, alors que le contenu présente une prestation portée par une personne individuelle et que le modèle de données du site semble distinguer le profil de Simon.

- La classe `scroll-margin-top` est appliquée au composant `<ZCard>` plutôt qu’à un élément HTML explicitement contrôlé dans cette page ; le comportement dépend donc du transfert effectif de `id` et des attributs de classe par l’implémentation interne de `ZCard`.

- La valeur fixe `var(--space-16)` est utilisée pour toutes les ancres alors que la hauteur du header peut varier selon les breakpoints et les états de navigation ; aucun contrôle ne démontre que les titres ne sont pas masqués sur mobile.

- Le changement du titre SEO de « Services & Tarifs » vers « Services & Systèmes IA » supprime le terme « tarifs » sans vérification des liens internes, des attentes SEO existantes ou des métadonnées historiques qui pourraient encore référencer l’ancien intitulé.

- Les documents de référence du projet restent contradictoires avec cette implémentation : `project-context.md`, `epics.md`, les spécifications de repositionnement et plusieurs briefs décrivent encore les offres Sprint, Blueprint et AI Care comme catalogue principal.

- Les anciens montants et noms d’offres restent présents dans les documents commerciaux et les artefacts de spécification, ce qui permet de réintroduire accidentellement les informations obsolètes lors d’une prochaine évolution.

- Le modèle `Offer` rend `badge` obligatoire tout en conservant un rendu conditionnel `v-if="offer.badge"` et un fallback `offer.badgeTone || 'neutral'`, ce qui mélange deux contrats de données incompatibles et laisse croire que les badges peuvent être absents.

- La nouvelle copie décrit le système métier sur mesure comme incluant authentification, rôles, supervision et déploiement souverain, mais ne précise aucune limite de périmètre, condition ou distinction entre inclusions et options.

- Les tâches de validation sont marquées comme réalisées, mais le diff ne fournit ni capture, ni rapport de test, ni preuve de navigation clavier, de rendu responsive ou de contrôle visuel comparatif.

- La story affirme une vérification de parité sur les thèmes clair et sombre alors que les directives du projet imposent une interface dark-first et ne documentent pas l’existence d’un thème clair testable.

- La story annonce « 28 routes statiques » sans que le diff fournisse la liste des routes générées ni une preuve exploitable permettant de vérifier que toutes ont réellement été pré-rendues.

- Le commentaire du composant continue de présenter la page comme un « catalogue d'offres IA packagées », alors que le nouveau positionnement repose sur des prestations sur devis et des niveaux d’intervention ; cette incohérence entretient l’ancien modèle mental dans le code.

- La mise à jour du statut de la story vers `review` et la clôture de toutes les tâches donnent une impression de livraison complète alors que la section AI Care, explicitement prévue dans la story suivante, n’est pas encore visible et que le Blueprint n’est pas réellement présenté comme une offre exploitable.
tokens used
44 657
- Les liens « Agents IA » de l’accueil aboutissent à une carte intitulée « Workflow métier », sans reprendre ni expliquer explicitement la notion d’agent IA.

- La mention du Blueprint est réduite à une phrase dans l’étape « Cadrage », sans description de son contenu, de ses livrables, de son prix ou de CTA permettant de le demander.

- L’étape « Suivi & amélioration » continue de promettre monitoring, maintenance et support, alors qu’AI Care a été retiré sans section dédiée ni périmètre commercial visible.

- Les trois offres affichent uniquement « Sur devis », sans aucun repère de périmètre, durée, charge ou ordre de grandeur permettant réellement au prospect d’identifier le format adapté.

- Le JSON-LD encode « Sur devis » comme `offers.description`, mais ne fournit ni `price`, ni `priceCurrency`, ni autre indication structurée cohérente pour une offre commerciale non tarifée.

- Les objets `Service` du JSON-LD ne contiennent pas d’URL vers leurs ancres respectives, ce qui empêche de relier les entrées structurées aux cartes réellement accessibles dans la page.

- Le fournisseur Schema.org est déclaré comme une `Organization`, alors que le contenu présente une prestation portée par une personne individuelle et que le modèle de données du site semble distinguer le profil de Simon.

- La classe `scroll-margin-top` est appliquée au composant `<ZCard>` plutôt qu’à un élément HTML explicitement contrôlé dans cette page ; le comportement dépend donc du transfert effectif de `id` et des attributs de classe par l’implémentation interne de `ZCard`.

- La valeur fixe `var(--space-16)` est utilisée pour toutes les ancres alors que la hauteur du header peut varier selon les breakpoints et les états de navigation ; aucun contrôle ne démontre que les titres ne sont pas masqués sur mobile.

- Le changement du titre SEO de « Services & Tarifs » vers « Services & Systèmes IA » supprime le terme « tarifs » sans vérification des liens internes, des attentes SEO existantes ou des métadonnées historiques qui pourraient encore référencer l’ancien intitulé.

- Les documents de référence du projet restent contradictoires avec cette implémentation : `project-context.md`, `epics.md`, les spécifications de repositionnement et plusieurs briefs décrivent encore les offres Sprint, Blueprint et AI Care comme catalogue principal.

- Les anciens montants et noms d’offres restent présents dans les documents commerciaux et les artefacts de spécification, ce qui permet de réintroduire accidentellement les informations obsolètes lors d’une prochaine évolution.

- Le modèle `Offer` rend `badge` obligatoire tout en conservant un rendu conditionnel `v-if="offer.badge"` et un fallback `offer.badgeTone || 'neutral'`, ce qui mélange deux contrats de données incompatibles et laisse croire que les badges peuvent être absents.

- La nouvelle copie décrit le système métier sur mesure comme incluant authentification, rôles, supervision et déploiement souverain, mais ne précise aucune limite de périmètre, condition ou distinction entre inclusions et options.

- Les tâches de validation sont marquées comme réalisées, mais le diff ne fournit ni capture, ni rapport de test, ni preuve de navigation clavier, de rendu responsive ou de contrôle visuel comparatif.

- La story affirme une vérification de parité sur les thèmes clair et sombre alors que les directives du projet imposent une interface dark-first et ne documentent pas l’existence d’un thème clair testable.

- La story annonce « 28 routes statiques » sans que le diff fournisse la liste des routes générées ni une preuve exploitable permettant de vérifier que toutes ont réellement été pré-rendues.

- Le commentaire du composant continue de présenter la page comme un « catalogue d'offres IA packagées », alors que le nouveau positionnement repose sur des prestations sur devis et des niveaux d’intervention ; cette incohérence entretient l’ancien modèle mental dans le code.

- La mise à jour du statut de la story vers `review` et la clôture de toutes les tâches donnent une impression de livraison complète alors que la section AI Care, explicitement prévue dans la story suivante, n’est pas encore visible et que le Blueprint n’est pas réellement présenté comme une offre exploitable.
