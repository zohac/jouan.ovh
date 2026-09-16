Reading prompt from stdin...
2026-09-16T21:45:12.046611Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: medium
reasoning summaries: none
session id: 01a0ac2e-538b-7900-becf-e92538ced5cf
--------
user
# Blind Hunter Prompt — Story 12.5

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/12-5/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
Je vais charger la consigne du skill demandé, puis lire le diff cible et faire une revue franchement adversariale du contenu.
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
/bin/zsh -lc "wc -l docs/implementation-artifacts/code-reviews/12-5/full.diff && sed -n '1,240p' docs/implementation-artifacts/code-reviews/12-5/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     458 docs/implementation-artifacts/code-reviews/12-5/full.diff
diff --git a/app/pages/services.vue b/app/pages/services.vue
index 349512a..a8d9ea1 100644
--- a/app/pages/services.vue
+++ b/app/pages/services.vue
@@ -1,40 +1,46 @@
 <template>
   <main class="services">
-    <!-- En-tête + grille d'offres (story 4.1). La 2e section (process) viendra en 4.2. -->
+    <!-- En-tête + grille d'offres (story 12.5) -->
     <section class="section">
       <div class="container">
         <p class="eyebrow"><span aria-hidden="true">// </span>services</p>
-        <h1 class="services__title">Des prestations claires, pensées comme des produits.</h1>
+        <h1 class="services__title">Des systèmes IA construits autour de vos vrais processus métier.</h1>
         <p class="prose services__intro">
-          Du site WordPress à l'application sur-mesure, en passant par l'IA appliquée — je m'occupe de la technique,
-          vous gardez la main sur votre projet.
+          Je pars d’un workflow existant, pas d’une technologie à placer. Du cadrage initial jusqu'au maintien en
+          condition opérationnelle, l’IA intervient uniquement là où elle apporte réellement quelque chose.
         </p>
 
         <ul class="grid-3">
           <li v-for="offer in offers" :key="offer.id">
             <ZCard class="offer" :accent="offer.featured" :featured="offer.featured">
               <div v-if="offer.featured" class="offer__badge">
-                <ZBadge tone="accent">Le plus demandé</ZBadge>
+                <ZBadge tone="accent">Format cœur</ZBadge>
               </div>
               <div class="offer__icon"><ZIcon :name="offer.icon" /></div>
               <h2 class="offer__title">{{ offer.title }}</h2>
+              <p v-if="offer.hook" class="offer__hook">{{ offer.hook }}</p>
               <p class="offer__desc">{{ offer.desc }}</p>
               <ul class="offer__points">
                 <li v-for="point in offer.points" :key="point">{{ point }}</li>
               </ul>
-              <div class="offer__price">
-                <b>{{ offer.price }}</b>
-              </div>
-              <div class="offer__cta">
-                <ZButton
-                  :as="NuxtLink"
-                  to="/contact"
-                  :variant="offer.featured ? 'primary' : 'secondary'"
-                  :aria-label="`Discuter du projet — ${offer.title}`"
-                  class="offer__btn"
-                >
-                  Discuter du projet
-                </ZButton>
+              <div class="offer__footer">
+                <div class="offer__price">
+                  <b>{{ offer.price }}</b>
+                </div>
+                <p v-if="offer.disclaimer" class="offer__disclaimer">
+                  {{ offer.disclaimer }}
+                </p>
+                <div class="offer__cta">
+                  <ZButton
+                    :as="NuxtLink"
+                    to="/contact"
+                    :variant="offer.featured ? 'primary' : 'secondary'"
+                    :aria-label="offer.ctaAriaLabel"
+                    class="offer__btn"
+                  >
+                    {{ offer.ctaText }}
+                  </ZButton>
+                </div>
               </div>
             </ZCard>
           </li>
@@ -42,7 +48,7 @@
       </div>
     </section>
 
-    <!-- Section process : 4 étapes ordonnées + CTA (story 4.2). Porté de Services.jsx L45-61. -->
+    <!-- Section process : 4 étapes ordonnées + CTA (story 12.5) -->
     <section class="section section--sunken">
       <div class="container">
         <p class="eyebrow"><span aria-hidden="true">// </span>comment ça se passe</p>
@@ -53,6 +59,11 @@
             <div class="process__num" aria-hidden="true">{{ step.n }}</div>
             <h3 class="process__step-title">{{ step.title }}</h3>
             <p class="prose process__desc">{{ step.desc }}</p>
+            <div v-if="step.inlineCta" class="process__cta-inline-wrapper">
+              <NuxtLink :to="step.inlineCta.to" class="process__inline-cta">
+                {{ step.inlineCta.label }}
+              </NuxtLink>
+            </div>
           </li>
         </ol>
 
@@ -68,7 +79,7 @@
 </template>
 
 <script setup lang="ts">
-// Page Services : catalogue d'offres packagées + process 4 étapes + CTA contact.
+// Page Services : catalogue d'offres IA packagées + process 4 étapes + CTA contact.
 // Données statiques (3 offres, 4 étapes) déclarées localement. Prerender-safe, dark-first.
 import { NuxtLink } from "#components";
 import { SITE } from "~/data/site";
@@ -76,56 +87,115 @@ import { SITE } from "~/data/site";
 interface Offer {
   /** Clé v-for stable (indépendante du contenu affiché). */
   id: string;
-  /** Nom d'icône dans le set ZIcon (story 2.7). */
+  /** Nom d'icône dans le set ZIcon. */
   icon: string;
   title: string;
+  hook?: string;
   desc: string;
   points: string[];
   price: string;
+  disclaimer?: string;
   /** Offre mise en avant : carte accent + glow + badge. */
   featured: boolean;
+  ctaText: string;
+  ctaAriaLabel: string;
+}
+
+interface Step {
+  n: string;
+  title: string;
+  desc: string;
+  inlineCta?: {
+    to: string;
+    label: string;
+  };
 }
 
-// Contenu repris à l'identique de data.js (window.SITE.services) — 1re personne,
-// vouvoiement, pas d'emoji. « Applications web » est l'offre mise en avant.
+// Les 3 offres officielles V1 — 1re personne, vouvoiement, zéro emoji.
 const offers: Offer[] = [
   {
-    id: "wordpress",
-    icon: "wp",
-    title: "WordPress sur-mesure",
-    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
-    points: ["Thème sur-mesure (press-wind / Tailwind)", "Plugins & blocs Gutenberg", "Performance & SEO technique"],
-    price: "à partir de 1 500 €",
-    featured: false,
+    id: "sprint",
+    icon: "zap",
+    title: "AI Workflow Sprint",
+    hook: "Un Sprint = un workflow prioritaire",
+    desc: "Conception, intégration logicielle et mise en production d'un workflow métier complet avec IA ciblée et supervision humaine.",
+    points: [
+      "Diagnostic approfondi & cartographie avant/après",
+      "Architecture système, connecteurs API & intégrations métier",
+      "Modèles d'IA & prompt engineering avec sorties typées",
+      "Tests automatisés sur cas réels & boucle de validation humaine",
+      "Déploiement en production, documentation & mesure initiale",
+    ],
+    price: "À partir de 3 500 € HT",
+    featured: true,
+    ctaText: "Lancer un Sprint",
+    ctaAriaLabel: "Discuter d'un AI Workflow Sprint",
   },
   {
-    id: "apps",
-    icon: "code",
-    title: "Applications web",
-    desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.",
-    points: ["API REST / GraphQL (Symfony · Nest.js)", "Front Vue / Nuxt", "Tests & CI/CD, qualité QA"],
-    price: "sur devis",
-    featured: true,
+    id: "blueprint",
+    icon: "layers",
+    title: "AI Workflow Blueprint",
+    hook: "Cadrage préalable pour problématique complexe",
+    desc: "Pour les projets nécessitant un audit préalable, une modélisation de données et des choix d'architecture avant de s'engager sur le build.",
+    points: [
+      "Audit du processus actuel, volumes & points de friction",
+      "Matrice de décision : code déterministe vs IA vs humain",
+      "Schéma d'architecture technique & flux de données cibles",
+      "Analyse des risques, contraintes de sécurité & secrets",
+      "Spécification des KPI de mesure & estimation budgétaire",
+    ],
+    price: "À partir de 750 € HT",
+    featured: false,
+    ctaText: "Demander un Blueprint",
+    ctaAriaLabel: "Demander un AI Workflow Blueprint",
   },
   {
-    id: "ia",
-    icon: "spark",
-    title: "IA & automatisation",
-    desc: "L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.",
-    points: ["Agents & workflows (n8n)", "Intégration d'API LLM", "Automatisation de contenu"],
-    price: "sur devis",
+    id: "care",
+    icon: "bot",
+    title: "AI Care",
+    hook: "Maintien en condition opérationnelle",
+    desc: "Maintien en condition opérationnelle d'une capacité intégrée au processus métier pour garantir disponibilité, précision et maîtrise des coûts.",
+    points: [
+      "Supervision proactive, alertes & analyse des échecs",
+      "Maintenance corrective & adaptation aux APIs tierces",
+      "Suivi des coûts d'inférence & micro-ajustements de prompts",
+      "Support technique réactif & veille sur les nouveaux modèles",
+    ],
+    disclaimer:
+      "Consommations tierces d'APIs et tokens (LLM, OCR, scraping...) refacturées au réel ou prises en charge directement par le client.",
+    price: "À partir de 490 € HT / mois",
     featured: false,
+    ctaText: "Découvrir AI Care",
+    ctaAriaLabel: "Découvrir l'accompagnement AI Care",
   },
 ];
 
-// Étapes du process — texte repris à l'identique de Services.jsx (tableau `steps`,
-// pas dans data.js). L'ordre du tableau garantit l'affichage 01 → 04 (AC #1).
-// `n` (numéro affiché) sert aussi de clé v-for stable et unique.
-const steps = [
-  { n: "01", title: "Échange", desc: "On cadre le besoin, le périmètre et le budget — sans jargon inutile." },
-  { n: "02", title: "Conception", desc: "Architecture, maquette, et plan de livraison clair." },
-  { n: "03", title: "Développement", desc: "Code propre, testé, livré par itérations visibles." },
-  { n: "04", title: "Livraison & suivi", desc: "Mise en ligne, documentation, et accompagnement." },
+// Étapes du process en 4 temps. L'ordre du tableau garantit l'affichage 01 → 04.
+const steps: Step[] = [
+  {
+    n: "01",
+    title: "Diagnostic",
+    desc: "Échange de 20 à 30 minutes pour qualifier le problème, comprendre le workflow existant et identifier les goulots d'étranglement.",
+    inlineCta: {
+      to: "/contact",
+      label: "Identifier un workflow →",
+    },
+  },
+  {
+    n: "02",
+    title: "Cadrage",
+    desc: "Formalisation du workflow cible, des étapes manuelles à conserver sous contrôle humain, des connecteurs API requis et des KPI de mesure. Fait l'objet d'un Blueprint pour les sujets complexes.",
+  },
+  {
+    n: "03",
+    title: "Construction & intégration",
+    desc: "Développement logiciel du système, connexion aux outils métiers (CRM, ERP, messagerie...), couverture de tests automatisés et mise à l'épreuve sur cas réels avant livraison.",
+  },
+  {
+    n: "04",

codex
Le diff fait 458 lignes et ne se limite pas à du texte : il touche aussi structure, accessibilité et styles. Je poursuis la lecture complète avant de sortir les points, pour éviter de rater les régressions discrètes.
exec
/bin/zsh -lc "sed -n '1,220p' app/components/ui/ZIcon.vue 2>/dev/null || true" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "sed -n '241,520p' docs/implementation-artifacts/code-reviews/12-5/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <!-- eslint-disable vue/no-v-html -->
  <svg
    class="zicon"
    :viewBox="def.box"
    :fill="def.fill ? 'currentColor' : 'none'"
    :stroke="def.fill ? undefined : 'currentColor'"
    :stroke-width="def.fill ? undefined : 2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
    v-html="def.body"
  />
  <!-- eslint-enable vue/no-v-html -->
</template>

<script setup lang="ts">
// Système d'icônes du DS — SVG inline, `currentColor` (héritent de la couleur du texte),
// taille en `em`. Choix prerender-safe : set inline (pas de script Lucide CDN qui muterait
// le DOM client et laisserait un trou au `nuxi generate`). Aucune police d'icône (AC #2).
// Icônes au trait = style Lucide ; glyphes de marque (github/twitter/linkedin/wp) + logo
// diamant (gem) = fill. Porté de docs/design_system/ui_kits/jouan-site/icons.jsx.
// Le `v-html` du template injecte uniquement ces chaînes internes statiques.
import { computed } from "vue";

type IconDef = { box: string; fill: boolean; body: string };

// Icônes au trait (viewBox 24, stroke currentColor).
const STROKE: Record<string, string> = {
  arrow: '<path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>',
  terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  layers: '<path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
  bot: '<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 4v4"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/><path d="M2 14h2M20 14h2"/>',
  spark:
    '<path d="M12 3l1.8 5.6L19.5 10l-5.7 1.4L12 17l-1.8-5.6L4.5 10l5.7-1.4z"/><path d="M19 15l.7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  phone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  qr: '<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>',
  download:
    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
};

// Glyphes de marque (fill currentColor). viewBox 16 pour les réseaux, 24 pour wp/gem.
const GITHUB =
  '<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>';
const TWITTER =
  '<path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>';
const LINKEDIN =
  '<path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>';
const WP =
  '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 1.5a8.5 8.5 0 0 1 4.9 1.55h-.34c-.62 0-1.06.54-1.06 1.12 0 .52.3.96.62 1.48.24.42.52.96.52 1.74 0 .54-.2 1.18-.48 2.06l-.64 2.12-2.3-6.84c.38-.02.72-.06.72-.06.34-.04.3-.54-.04-.52 0 0-1.02.08-1.68.08-.62 0-1.66-.08-1.66-.08-.34-.02-.38.5-.04.52 0 0 .32.04.66.06l.96 2.62-1.34 4.02L7.2 7.34c.38-.02.72-.06.72-.06.34-.04.3-.54-.04-.52 0 0-1.02.08-1.68.08-.12 0-.26 0-.4-.01A8.5 8.5 0 0 1 12 3.5zM3.6 8.7l3.7 10.16A8.5 8.5 0 0 1 3.6 8.7zm8.76 3.18 2.34 6.4c.02.04.04.08.06.1a8.5 8.5 0 0 1-5.04.16l2.64-6.66zm5.96-3.4a8.5 8.5 0 0 1-2.16 9.42l2.58-7.46c.24-.6.4-1.18.48-1.7l.06.04c.24.46.42 1.02.42 1.64 0 .8-.16 1.7-.62 2.86z"/>';

// Logo diamant (gem) : carré pivoté en currentColor + facette haute éclairée
// (overlay blanc très léger, esprit "lit from above" du logo de marque).
const GEM =
  '<path d="M12 1.5 22.5 12 12 22.5 1.5 12z" fill="currentColor"/>' +
  '<path d="M12 1.5 22.5 12 12 12z" fill="#fff" fill-opacity="0.12"/>';

const ICONS: Record<string, IconDef> = {
  ...Object.fromEntries(Object.entries(STROKE).map(([k, body]) => [k, { box: "0 0 24 24", fill: false, body }])),
  github: { box: "0 0 16 16", fill: true, body: GITHUB },
  x: { box: "0 0 16 16", fill: true, body: TWITTER },
  twitter: { box: "0 0 16 16", fill: true, body: TWITTER },
  linkedin: { box: "0 0 16 16", fill: true, body: LINKEDIN },
  wp: { box: "0 0 24 24", fill: true, body: WP },
  gem: { box: "0 0 24 24", fill: true, body: GEM },
};

const EMPTY: IconDef = { box: "0 0 24 24", fill: false, body: "" };

interface Props {
  /** Nom de l'icône dans le set (arrow, terminal, github, gem…). */
  name: string;
  /** Libellé accessible : si fourni, l'icône devient `role="img"` ; sinon décorative (`aria-hidden`). */
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
});

const def = computed<IconDef>(() => ICONS[props.name] ?? EMPTY);
</script>

<style scoped>
.zicon {
  display: inline-block;
  flex: none;
  width: 1em;
  height: 1em;
  vertical-align: middle;
}
</style>

 succeeded in 0ms:
+    title: "Suivi & amélioration",
+    desc: "Monitoring en production, maintenance préventive/corrective, ajustements aux évolutions d'APIs tierces ou modèles d'IA, mesure factuelle des résultats.",
+  },
 ];
 
 const siteUrl = useSiteUrl();
@@ -133,9 +203,9 @@ const siteUrl = useSiteUrl();
 const servicesJsonLd = {
   "@context": "https://schema.org",
   "@type": "WebPage",
-  name: "Services — jouan.ovh",
+  name: "Services & Tarifs — Simon Jouan",
   description:
-    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
+    "Développement de systèmes IA et automatisation de processus métier : offres packagées (AI Workflow Sprint, Blueprint, AI Care) et déroulement d'intervention transparent.",
   url: `${siteUrl}/services`,
   mainEntity: {
     "@type": "ItemList",
@@ -161,9 +231,9 @@ const servicesJsonLd = {
 };
 
 usePageSeo({
-  title: "Services — jouan.ovh",
+  title: "Services & Tarifs — Simon Jouan",
   description:
-    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
+    "Développement de systèmes IA et automatisation de processus métier : offres packagées (AI Workflow Sprint, Blueprint, AI Care) et déroulement d'intervention transparent.",
   path: "/services",
   image: "/images/portrait.jpeg",
   type: "website",
@@ -172,7 +242,7 @@ usePageSeo({
 </script>
 
 <style lang="scss" scoped>
-/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Services.jsx */
+/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) */
 .services {
   display: block;
 }
@@ -180,9 +250,9 @@ usePageSeo({
 // .section / .section--sunken / .container / .eyebrow / .prose : primitives de
 // layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
 
-// ---- En-tête (porté de Services.jsx L13-21) ----
+// ---- En-tête ----
 .services__title {
-  max-width: 16ch;
+  max-width: 22ch;
   margin-bottom: var(--space-3);
   font-family: var(--font-mono);
   font-size: var(--fs-4xl);
@@ -192,12 +262,12 @@ usePageSeo({
 }
 
 .services__intro {
-  max-width: 60ch;
+  max-width: 62ch;
   margin-bottom: var(--space-10);
   color: var(--text-muted);
 }
 
-// ---- Grille des offres (porté de kit.css : .grid-3 / .offer*) ----
+// ---- Grille des offres (.grid-3 / .offer*) ----
 .grid-3 {
   display: grid;
   grid-template-columns: repeat(3, 1fr);
@@ -211,8 +281,6 @@ usePageSeo({
   }
 }
 
-// `display:flex` (porté de l'inline JSX) : le prix + CTA sont poussés en bas via
-// `margin-top: auto`, alignant les pieds de carte sur des hauteurs inégales.
 .offer {
   display: flex;
   flex-direction: column;
@@ -230,9 +298,6 @@ usePageSeo({
   width: var(--space-10); // 40px
   height: var(--space-10);
   margin-bottom: var(--space-4);
-
-  // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
-  // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
   font-size: 22px;
   color: var(--accent);
   background: var(--accent-soft);
@@ -240,13 +305,22 @@ usePageSeo({
 }
 
 .offer__title {
-  margin-bottom: var(--space-2);
+  margin-bottom: var(--space-1);
   font-family: var(--font-mono);
   font-size: var(--fs-xl);
   font-weight: var(--fw-regular);
   color: var(--text-strong);
 }
 
+.offer__hook {
+  margin: 0 0 var(--space-3);
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  font-weight: var(--fw-medium);
+  letter-spacing: var(--ls-wide);
+  color: var(--accent);
+}
+
 .offer__desc {
   margin: 0 0 var(--space-4);
   font-family: var(--font-sans);
@@ -268,7 +342,7 @@ usePageSeo({
     color: var(--text-muted);
   }
 
-  // Puce fléchée « → » (porté de kit.css .offer li::before).
+  // Puce fléchée « → »
   li::before {
     content: "→";
     position: absolute;
@@ -277,11 +351,14 @@ usePageSeo({
   }
 }
 
-.offer__price {
-  // `margin-top: auto` colle le prix (et le CTA qui suit) au bas de la carte ;
-  // `padding-top` reprend l'inline JSX (space-5) au lieu du margin-top du kit.
+.offer__footer {
+  display: flex;
+  flex-direction: column;
   margin-top: auto;
   padding-top: var(--space-5);
+}
+
+.offer__price {
   font-family: var(--font-mono);
   font-size: var(--fs-sm);
   color: var(--text-muted);
@@ -293,16 +370,24 @@ usePageSeo({
   }
 }
 
+.offer__disclaimer {
+  margin: var(--space-2) 0 0;
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  line-height: var(--lh-normal);
+  color: var(--text-muted);
+  opacity: 0.85;
+}
+
 .offer__cta {
   margin-top: var(--space-4);
 }
 
-// Bouton CTA en pleine largeur (porté de l'inline `width: 100%` du JSX).
 .offer__btn {
   width: 100%;
 }
 
-// ---- Section process (porté de Services.jsx L45-61) ----
+// ---- Section process ----
 .process__title {
   margin-bottom: var(--space-8);
   font-family: var(--font-mono);
@@ -320,6 +405,11 @@ usePageSeo({
   list-style: none;
 }
 
+.process__step {
+  display: flex;
+  flex-direction: column;
+}
+
 .process__num {
   font-family: var(--font-mono);
   font-size: var(--fs-3xl);
@@ -340,12 +430,41 @@ usePageSeo({
   color: var(--text-muted);
 }
 
+.process__cta-inline-wrapper {
+  margin-top: auto;
+  padding-top: var(--space-3);
+}
+
+.process__inline-cta {
+  display: inline-flex;
+  align-items: center;
+  font-family: var(--font-mono);
+  font-size: var(--fs-sm);
+  color: var(--accent);
+  text-decoration: none;
+  transition:
+    color var(--dur-base) var(--ease-standard),
+    text-decoration-color var(--dur-base) var(--ease-standard);
+
+  &:hover {
+    color: var(--accent-hover);
+    text-decoration: underline;
+  }
+
+  &:focus-visible {
+    outline: 2px solid transparent;
+    outline-offset: 2px;
+    box-shadow: var(--ring-accent);
+    border-radius: var(--radius-xs);
+  }
+}
+
 .process__cta {
   margin-top: var(--space-12);
   text-align: center;
 }
 
-// ---- Responsive (cf. kit.css @media max-width: 900px) ----
+// ---- Responsive ----
 @media (width <= 900px) {
   .grid-3,
   .process {

exec
/bin/zsh -lc 'rg -n "zap|layers|bot|spark|wp|code" app/components app/data app/pages -S' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/about.vue:29:              technique (métrologie, instrumentation) avant de basculer avec passion dans le code. Aujourd'hui, je
app/pages/about.vue:36:              >, et j'intègre l'automatisation, l'exigence QA et l'IA au service du code — tests automatisés,
app/pages/about.vue:238:    margin-bottom: 0;
app/pages/about.vue:304:  bottom: 6px;
app/pages/about.vue:313:  padding-bottom: var(--space-6);
app/components/HeaderComponent.vue:42:          <ZIcon :name="menuOpen ? 'arrow' : 'layers'" />
app/components/HeaderComponent.vue:243:  border-bottom: 1px solid transparent;
app/components/HeaderComponent.vue:253:  border-bottom-color: var(--border-subtle);
app/components/HeaderComponent.vue:366:    bottom: -2px;
app/components/HeaderComponent.vue:523:  padding-bottom: var(--space-2);
app/components/HeaderComponent.vue:524:  margin-bottom: var(--space-2);
app/components/HeaderComponent.vue:525:  border-bottom: 1px solid var(--border-subtle);
app/components/HeaderComponent.vue:563:    border-bottom: 1px solid var(--border-subtle);
app/pages/blog/[...slug].vue:61:// .article (760px), en-tête tags/titre/méta/héro, prose Ubuntu sans, blocs de code en
app/pages/blog/[...slug].vue:84:    return createError({ statusCode: 500, statusMessage: "Erreur lors du chargement de l'article" });
app/pages/blog/[...slug].vue:87:    return createError({ statusCode: 404, statusMessage: "Article introuvable" });
app/pages/blog/[...slug].vue:179:  margin-bottom: var(--space-5);
app/pages/blog/[...slug].vue:198:  margin-bottom: var(--space-4);
app/pages/blog/[...slug].vue:203:  margin-bottom: var(--space-4);
app/pages/blog/[...slug].vue:220:  margin-bottom: var(--space-8);
app/pages/blog/[...slug].vue:228:// vertical + titres + code, fidèles à kit.css (.article .prose ...).
app/pages/blog/[...slug].vue:294:  // Bloc de code : palette terminale (fond aubergine, mono off-white). Shiki est
app/pages/blog/[...slug].vue:295:  // désactivé → <pre><code> nu, donc pas de styles inline par token à surcharger.
app/pages/blog/[...slug].vue:309:  // Code inline = vert terminal ; le code en bloc hérite la couleur du <pre> (off-white).
app/pages/blog/[...slug].vue:310:  :deep(code) {
app/pages/blog/[...slug].vue:316:  :deep(pre code) {
app/pages/blog/[...slug].vue:328:    margin-bottom: var(--space-2);
app/pages/blog/[...slug].vue:345:    margin-bottom: 0;
app/pages/blog/index.vue:51:            src="/images/undraw_code_thinking_re_gka2.svg"
app/pages/blog/index.vue:67:            src="/images/undraw_code_thinking_re_gka2.svg"
app/pages/blog/index.vue:164:  margin-bottom: var(--space-2);
app/pages/blog/index.vue:174:  margin-bottom: var(--space-10);
app/pages/blog/index.vue:207:  margin-bottom: var(--space-2);
app/pages/blog/index.vue:211:  margin-bottom: var(--space-2);
app/pages/blog/index.vue:243:  margin-bottom: var(--space-3);
app/components/FooterComponent.vue:38:    <div class="ftr__bottom-bar">
app/components/FooterComponent.vue:39:      <div class="ftr__container ftr__bottom">
app/components/FooterComponent.vue:102:  margin-bottom: var(--space-3);
app/components/FooterComponent.vue:197:.ftr__bottom-bar {
app/components/FooterComponent.vue:203:.ftr__bottom {
app/pages/services.vue:118:    icon: "zap",
app/pages/services.vue:136:    icon: "layers",
app/pages/services.vue:142:      "Matrice de décision : code déterministe vs IA vs humain",
app/pages/services.vue:154:    icon: "bot",
app/pages/services.vue:256:  margin-bottom: var(--space-3);
app/pages/services.vue:266:  margin-bottom: var(--space-10);
app/pages/services.vue:291:  margin-bottom: var(--space-3);
app/pages/services.vue:300:  margin-bottom: var(--space-4);
app/pages/services.vue:308:  margin-bottom: var(--space-1);
app/pages/services.vue:392:  margin-bottom: var(--space-8);
app/pages/confidentialite.vue:177:  margin-bottom: var(--space-4);
app/pages/confidentialite.vue:187:  margin-bottom: var(--space-10);
app/pages/mentions-legales.vue:65:              L'ensemble des contenus présents sur ce site (textes, articles, visuels, charte graphique, codes sources
app/pages/mentions-legales.vue:72:              et constituerait une contrefaçon sanctionnée par le Code de la propriété intellectuelle.
app/pages/mentions-legales.vue:116:  margin-bottom: var(--space-4);
app/pages/mentions-legales.vue:126:  margin-bottom: var(--space-10);
app/pages/contact/card.vue:55:        <!-- Colonne / Bloc QR Code haute lisibilité -->
app/pages/contact/card.vue:59:              src="/images/qr-code.svg"
app/pages/contact/card.vue:60:              alt="QR Code vCard pour enregistrer le contact de Simon Jouan"
app/pages/contact/card.vue:105:  description: "Fiche contact et QR code vCard de Simon Jouan, Développeur Full Stack TypeScript.",
app/pages/contact/card.vue:255:// ---- Volet QR Code ----
app/pages/contact/card.vue:308:    order: -1; // En portrait mobile, le QR code est immédiatement visible au premier coup d'œil
app/pages/index.vue:151:                      <ZIcon name="layers" class="project-card__node-icon" />
app/pages/index.vue:156:                      <ZIcon name="zap" class="project-card__node-icon" />
app/pages/index.vue:161:                      <ZIcon name="code" class="project-card__node-icon" />
app/pages/index.vue:255:          <p class="journal__empty-code">$ cat ~/journal/*.md</p>
app/pages/index.vue:330:  icon: "code" | "layers" | "spark" | "bot" | "terminal" | "zap";
app/pages/index.vue:341:  icon: "code" | "layers" | "spark" | "bot" | "terminal" | "zap";
app/pages/index.vue:351:    icon: "layers",
app/pages/index.vue:366:    icon: "bot",
app/pages/index.vue:381:    icon: "code",
app/pages/index.vue:399:    icon: "layers",
app/pages/index.vue:405:    icon: "zap",
app/pages/index.vue:411:    icon: "bot",
app/pages/index.vue:482:  animation: fade-rise var(--dur-slow) var(--ease-out) both;
app/pages/index.vue:560:  margin-bottom: var(--space-6);
app/pages/index.vue:568:  margin-bottom: var(--space-6);
app/pages/index.vue:617:  margin-bottom: var(--space-8);
app/pages/index.vue:648:  margin-bottom: var(--space-4);
app/pages/index.vue:674:  margin-bottom: var(--space-2);
app/pages/index.vue:716:  margin-bottom: var(--space-4);
app/pages/index.vue:757:  margin-bottom: var(--space-4);
app/pages/index.vue:793:  margin-bottom: var(--space-4);
app/pages/index.vue:842:  border-bottom: 1px solid var(--border-subtle);
app/pages/index.vue:942:  margin-bottom: var(--space-3);
app/pages/index.vue:956:  margin-bottom: var(--space-2);
app/pages/index.vue:1028:    margin-bottom: var(--space-2);
app/pages/index.vue:1051:  margin-bottom: var(--space-8);
app/pages/index.vue:1054:    margin-bottom: 0;
app/pages/index.vue:1122:  border-bottom: 1px solid var(--border-subtle);
app/pages/index.vue:1133:  margin-bottom: var(--space-3);
app/pages/index.vue:1179:.journal__empty-code {
app/pages/index.vue:1211:  margin-bottom: var(--space-4);
app/pages/contact/index.vue:26:              <!-- Honeypot anti-spam : hors flux visuel et hors tabulation ; rempli = bot. -->
app/pages/contact/index.vue:114:            <!-- Carte d'accès carte de visite digitale & QR Code -->
app/pages/contact/index.vue:117:              <p class="prose contact__cardcta-text">Fiche contact prête à scanner avec QR code vCard.</p>
app/pages/contact/index.vue:120:                Carte de visite &amp; QR Code
app/pages/contact/index.vue:232:  // Honeypot rempli = bot : on n'envoie rien et on affiche l'état de succès.
app/pages/contact/index.vue:249:        botcheck: "",
app/pages/contact/index.vue:315:  margin-bottom: var(--space-3);
app/pages/contact/index.vue:325:  margin-bottom: var(--space-8);
app/pages/contact/index.vue:343:// Honeypot : hors écran et hors tabulation (piège à bots, invisible aux humains).
app/pages/contact/index.vue:344:// On évite display:none (certains bots l'ignorent).
app/pages/contact/index.vue:396:  margin-bottom: var(--space-2);
app/pages/contact/index.vue:427:    margin-bottom: var(--space-5);
app/pages/contact/index.vue:491:// ---- Carte CTA Carte de visite & QR Code ----
app/components/WindowWrapperComponent.vue:132:        // Borne haute clampée à 0 : si la fenêtre est plus large/haute que le viewport,
app/components/WindowWrapperComponent.vue:329:      background-image: linear-gradient(to bottom right, var(--wwc-color-red), var(--wwc-color-red-dark));
app/components/terminal/TerminalComponent.vue:253:    // Borne haute clampée à 0 : si le terminal est plus large/haut que le viewport,
app/components/terminal/TerminalComponent.vue:325:  // son backdrop-filter rende hors du <header> filtré) ; fixed le garde relatif au VIEWPORT,
app/components/terminal/TerminalComponent.vue:337:  resize: both;
app/components/terminal/TerminalComponent.vue:369:      background-image: linear-gradient(to bottom right, var(--term-red), hsl(0deg 100% 27%));
app/components/terminal/TerminalComponent.vue:509:    bottom: 0;
app/components/home/HomeAtmosComponent.vue:253:    gl.viewport(0, 0, w, h);
app/components/ui/ZIcon.vue:23:// Icônes au trait = style Lucide ; glyphes de marque (github/twitter/linkedin/wp) + logo
app/components/ui/ZIcon.vue:34:  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
app/components/ui/ZIcon.vue:35:  layers: '<path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
app/components/ui/ZIcon.vue:36:  bot: '<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 4v4"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/><path d="M2 14h2M20 14h2"/>',
app/components/ui/ZIcon.vue:37:  spark:
app/components/ui/ZIcon.vue:42:  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
app/components/ui/ZIcon.vue:50:// Glyphes de marque (fill currentColor). viewBox 16 pour les réseaux, 24 pour wp/gem.
app/components/ui/ZIcon.vue:57:const WP =
app/components/ui/ZIcon.vue:72:  wp: { box: "0 0 24 24", fill: true, body: WP },
app/components/home/HomeBootOverlay.vue:204:  margin-bottom: var(--space-5);
app/components/home/HomeHeroTerminal.vue:400:  vertical-align: text-bottom;

codex
- Le repositionnement complet des services vers “systèmes IA” supprime les offres WordPress et applications web sans preuve que le reste du site, le positionnement de Simon, les pages d’accueil/about/contact et les données partagées aient été alignés.

- Le contenu introduit beaucoup d’anglais marketing (“AI Workflow Sprint”, “Blueprint”, “AI Care”) alors que l’interface est censée être en français sobre et professionnel.

- Le H1 promet des “systèmes IA” mais les offres restent vagues sur les livrables concrets, les limites fonctionnelles, les prérequis client et les cas d’usage réellement couverts.

- Les tarifs “à partir de” sont affichés sans expliquer ce qui est inclus, ce qui est exclu, ni ce qui fait varier le prix, ce qui risque de créer une attente commerciale floue.

- L’offre “AI Workflow Sprint” mélange cadrage, architecture, intégrations, IA, tests, déploiement, documentation et mesure initiale dans un prix d’appel de 3 500 € HT qui paraît sous-spécifié, voire peu crédible sans périmètre strict.

- L’offre “AI Care” parle de supervision proactive, alertes, analyse des échecs, support réactif et veille modèles, mais ne définit aucun SLA, horaire de support, fréquence d’intervention ou délai de correction.

- Le disclaimer de l’offre AI Care est long, technique et chargé en parenthèses, ce qui alourdit fortement la carte et peut déséquilibrer visuellement la grille.

- Le texte “Consommations tierces d’APIs et tokens” utilise une graphie maladroite en français ; “API tierces” serait plus cohérent avec le reste du site.

- Le CTA inline “Identifier un workflow →” ajoute une flèche textuelle visible qui n’est pas cohérente avec le système d’icônes déjà en place et risque de sonner plus bricolé que design-system.

- Le CTA inline dans la première étape du process crée un deuxième point d’entrée vers contact avant le CTA principal de fin de section, ce qui peut fragmenter le parcours sans justification claire.

- Les libellés CTA des cartes ne sont pas homogènes : “Lancer”, “Demander”, “Découvrir” ne traduisent pas le même niveau d’engagement alors qu’ils mènent tous à la même page contact.

- Les `aria-label` des boutons répètent presque le texte visible sans apporter de contexte utile, et certains perdent l’intention “contact / devis / échange” qui aiderait davantage les utilisateurs de lecteurs d’écran.

- La description SEO devient très longue et chargée en parenthèses, avec une tonalité plus catalogue que proposition claire ; elle risque d’être tronquée et peu convaincante dans les résultats de recherche.

- Le JSON-LD décrit seulement une `WebPage` avec `ItemList`, mais les offres tarifées pourraient être mieux structurées en `Service` ou `Offer`; en l’état, les prix affichés dans la page ne semblent pas exploités sémantiquement.

- La page ajoute beaucoup de promesses autour de l’IA, des secrets, des connecteurs API et du monitoring sans mentionner confidentialité, traitement de données, conformité, propriété des données ou garde-fous opérationnels.

- Le texte “modèles d’IA & prompt engineering avec sorties typées” est très jargon et peut perdre un prospect non technique, alors que la page prétend partir des vrais processus métier.

- Le contenu du process affirme “mesure factuelle des résultats” mais ne définit pas de méthode, d’exemples de KPI ou de livrable de mesure, ce qui rend la promesse creuse.

- Le commentaire indique “Les 3 offres officielles V1”, ce qui ressemble à une note interne produit laissée dans le code plutôt qu’à une information utile et stable pour la maintenance.

- Le remplacement des anciens services historiques peut casser la cohérence avec d’éventuels articles de blog, mentions, projets ou textes existants qui positionnent encore Simon comme développeur web freelance généraliste.

- La section conserve une grille de trois cartes pour des offres aux longueurs très différentes ; l’offre AI Care a un disclaimer supplémentaire qui risque de produire une carte visuellement plus dense et moins scannable que les deux autres.
tokens used
15 860
- Le repositionnement complet des services vers “systèmes IA” supprime les offres WordPress et applications web sans preuve que le reste du site, le positionnement de Simon, les pages d’accueil/about/contact et les données partagées aient été alignés.

- Le contenu introduit beaucoup d’anglais marketing (“AI Workflow Sprint”, “Blueprint”, “AI Care”) alors que l’interface est censée être en français sobre et professionnel.

- Le H1 promet des “systèmes IA” mais les offres restent vagues sur les livrables concrets, les limites fonctionnelles, les prérequis client et les cas d’usage réellement couverts.

- Les tarifs “à partir de” sont affichés sans expliquer ce qui est inclus, ce qui est exclu, ni ce qui fait varier le prix, ce qui risque de créer une attente commerciale floue.

- L’offre “AI Workflow Sprint” mélange cadrage, architecture, intégrations, IA, tests, déploiement, documentation et mesure initiale dans un prix d’appel de 3 500 € HT qui paraît sous-spécifié, voire peu crédible sans périmètre strict.

- L’offre “AI Care” parle de supervision proactive, alertes, analyse des échecs, support réactif et veille modèles, mais ne définit aucun SLA, horaire de support, fréquence d’intervention ou délai de correction.

- Le disclaimer de l’offre AI Care est long, technique et chargé en parenthèses, ce qui alourdit fortement la carte et peut déséquilibrer visuellement la grille.

- Le texte “Consommations tierces d’APIs et tokens” utilise une graphie maladroite en français ; “API tierces” serait plus cohérent avec le reste du site.

- Le CTA inline “Identifier un workflow →” ajoute une flèche textuelle visible qui n’est pas cohérente avec le système d’icônes déjà en place et risque de sonner plus bricolé que design-system.

- Le CTA inline dans la première étape du process crée un deuxième point d’entrée vers contact avant le CTA principal de fin de section, ce qui peut fragmenter le parcours sans justification claire.

- Les libellés CTA des cartes ne sont pas homogènes : “Lancer”, “Demander”, “Découvrir” ne traduisent pas le même niveau d’engagement alors qu’ils mènent tous à la même page contact.

- Les `aria-label` des boutons répètent presque le texte visible sans apporter de contexte utile, et certains perdent l’intention “contact / devis / échange” qui aiderait davantage les utilisateurs de lecteurs d’écran.

- La description SEO devient très longue et chargée en parenthèses, avec une tonalité plus catalogue que proposition claire ; elle risque d’être tronquée et peu convaincante dans les résultats de recherche.

- Le JSON-LD décrit seulement une `WebPage` avec `ItemList`, mais les offres tarifées pourraient être mieux structurées en `Service` ou `Offer`; en l’état, les prix affichés dans la page ne semblent pas exploités sémantiquement.

- La page ajoute beaucoup de promesses autour de l’IA, des secrets, des connecteurs API et du monitoring sans mentionner confidentialité, traitement de données, conformité, propriété des données ou garde-fous opérationnels.

- Le texte “modèles d’IA & prompt engineering avec sorties typées” est très jargon et peut perdre un prospect non technique, alors que la page prétend partir des vrais processus métier.

- Le contenu du process affirme “mesure factuelle des résultats” mais ne définit pas de méthode, d’exemples de KPI ou de livrable de mesure, ce qui rend la promesse creuse.

- Le commentaire indique “Les 3 offres officielles V1”, ce qui ressemble à une note interne produit laissée dans le code plutôt qu’à une information utile et stable pour la maintenance.

- Le remplacement des anciens services historiques peut casser la cohérence avec d’éventuels articles de blog, mentions, projets ou textes existants qui positionnent encore Simon comme développeur web freelance généraliste.

- La section conserve une grille de trois cartes pour des offres aux longueurs très différentes ; l’offre AI Care a un disclaimer supplémentaire qui risque de produire une carte visuellement plus dense et moins scannable que les deux autres.
