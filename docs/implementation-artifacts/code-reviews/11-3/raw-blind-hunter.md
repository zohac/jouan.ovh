Reading prompt from stdin...
2026-09-13T18:51:07.099915Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: high
reasoning summaries: none
session id: 01a09c1b-dfa6-7451-962a-c12d25465395
--------
user
# Blind Hunter Prompt — Story 11.3

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/11-3/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise `bmad-review-adversarial-general` pour auditer le diff de Story 11.3 avec le niveau de scepticisme demandé, puis je vérifierai que la sortie contient au moins dix constats formulés uniquement comme descriptions.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.agents/skills/bmad-review-adversarial-general/SKILL.md && printf '\\n--- DIFF ---\\n' && sed -n '1,260p' docs/implementation-artifacts/code-reviews/11-3/full.diff" in /Users/simon/dev/jouan.ovh
 exited 1 in 0ms:
sed: /Users/simon/.agents/skills/bmad-review-adversarial-general/SKILL.md: No such file or directory

codex
Le chemin raccourci initial ne correspond pas à l’emplacement réel de cette compétence dans l’environnement. Je poursuis avec la copie disponible sous `/Users/simon/.codex/skills`, puis j’examine le diff.
exec
/bin/zsh -lc "sed -n '1,260p' /Users/simon/.codex/skills/bmad-review-adversarial-general/SKILL.md && printf '\\n--- DIFF ---\\n' && sed -n '1,320p' docs/implementation-artifacts/code-reviews/11-3/full.diff" in /Users/simon/dev/jouan.ovh
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

--- DIFF ---
diff --git a/app/components/home/HomeStackMarquee.vue b/app/components/home/HomeStackMarquee.vue
new file mode 100644
index 0000000..a65ef1e
--- /dev/null
+++ b/app/components/home/HomeStackMarquee.vue
@@ -0,0 +1,108 @@
+<template>
+  <div class="marquee" aria-hidden="true">
+    <div class="marquee__track">
+      <!-- Première passe -->
+      <span v-for="(skill, index) in skillsList" :key="`skill-a-${index}`" class="marquee__item">
+        <b class="marquee__label">{{ skill }}</b>
+        <span class="marquee__star" aria-hidden="true">✦</span>
+      </span>
+      <!-- Deuxième passe pour la boucle infinie CSS sans coupure -->
+      <span v-for="(skill, index) in skillsList" :key="`skill-b-${index}`" class="marquee__item">
+        <b class="marquee__label">{{ skill }}</b>
+        <span class="marquee__star" aria-hidden="true">✦</span>
+      </span>
+    </div>
+  </div>
+</template>
+
+<script setup lang="ts">
+// Ruban défilant continu de la stack moderne prioritaire (Story 11.3 / AC-1 / CAP-4).
+// Alimenté par SITE.skills (app/data/site.ts) avec mapping soigné des libellés.
+// Défilement continu pur CSS masqué aux lecteurs d'écran (aria-hidden="true").
+// Pause automatique au :hover et arrêt complet sous prefers-reduced-motion.
+import { computed } from "vue";
+import { SITE } from "~/data/site";
+
+const SKILL_LABEL_MAP: Record<string, string> = {
+  typescript: "TypeScript",
+  nuxt: "Nuxt 4",
+  vue: "Vue.js",
+  "nest.js": "NestJS",
+  "node.js": "Node.js",
+  postgresql: "PostgreSQL",
+  typeorm: "TypeORM",
+  stripe: "Stripe Connect",
+  cypress: "Cypress",
+  docker: "Docker",
+  "rest-api": "REST API",
+  vitest: "Vitest",
+};
+
+const skillsList = computed(() => {
+  return SITE.skills.map((skillKey) => SKILL_LABEL_MAP[skillKey] ?? skillKey);
+});
+</script>
+
+<style lang="scss" scoped>
+/* stylelint-disable selector-class-pattern */
+.marquee {
+  display: block;
+  width: 100%;
+  padding-block: var(--space-5);
+  overflow: hidden;
+  border-block: 1px solid var(--border-subtle);
+  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
+
+  &:hover .marquee__track {
+    animation-play-state: paused;
+  }
+}
+
+.marquee__track {
+  display: flex;
+  gap: var(--space-8);
+  width: max-content;
+  will-change: transform;
+  animation: scroll-x 32s linear infinite;
+}
+
+.marquee__item {
+  display: inline-flex;
+  gap: var(--space-8);
+  align-items: center;
+  font-family: var(--font-mono);
+  font-size: var(--fs-xl);
+  letter-spacing: var(--ls-wide);
+  color: var(--text-faint);
+  white-space: nowrap;
+}
+
+.marquee__label {
+  font-weight: var(--fw-regular);
+  color: var(--text-body);
+}
+
+.marquee__star {
+  color: var(--accent);
+}
+
+@keyframes scroll-x {
+  from {
+    transform: translateX(0);
+  }
+
+  to {
+    transform: translateX(-50%);
+  }
+}
+
+@media (prefers-reduced-motion: reduce) {
+  .marquee {
+    mask-image: none;
+  }
+
+  .marquee__track {
+    animation: none;
+  }
+}
+</style>
diff --git a/app/pages/index.vue b/app/pages/index.vue
index 07df568..eaedacd 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -44,17 +44,37 @@
       </div>
     </section>
 
-    <!-- Aperçu services (porté de ServicesPreview, Home.jsx) -->
+    <!-- Ruban défilant de la stack moderne (Story 11.3 / AC-1) -->
+    <HomeStackMarquee />
+
+    <!-- Vitrine des 3 services cibles (Story 11.3 / AC-2) -->
     <section class="section">
       <div class="container">
-        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je fais</p>
-        <h2 class="section__title">Trois façons de travailler ensemble</h2>
+        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
+        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos applications</h2>
         <ul class="grid-3">
           <li v-for="service in services" :key="service.id">
             <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
-              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
+              <div class="offer__top">
+                <div class="offer__icon"><ZIcon :name="service.icon" /></div>
+                <span class="offer__no">{{ service.no }}</span>
+              </div>
               <h3 class="offer__title">{{ service.title }}</h3>
               <p class="offer__desc">{{ service.desc }}</p>
+              <ul class="offer__points">
+                <li v-for="point in service.points" :key="point">
+                  <ZIcon name="check" class="offer__check" />
+                  <span>{{ point }}</span>
+                </li>
+              </ul>
+              <ul class="hero__tags offer__tags">
+                <li v-for="tag in service.tags" :key="tag">
+                  <ZTag>{{ tag }}</ZTag>
+                </li>
+              </ul>
+              <div class="offer__price">
+                <span>{{ service.price }}</span>
+              </div>
               <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
                 En savoir plus →
               </NuxtLink>
@@ -116,29 +136,52 @@ function onBootComplete() {
   isBootFinished.value = true;
 }
 
-// Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
-// (accent + glow). Icônes mappées sur le set ZIcon (wp / code / spark, story 2.7).
-// `id` = clé v-for stable (indépendante du contenu affiché).
+// Vitrine des 3 offres ciblées Full Stack TS (Story 11.3 / AC-2).
+// Remplacement complet des données legacy.
 const services = [
   {
-    id: "wordpress",
-    icon: "wp",
-    title: "WordPress sur-mesure",
-    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
+    id: "creation",
+    no: "01 / 03",
+    icon: "code",
+    title: "Création d'applications web & SaaS",
+    desc: "De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.",
+    points: [
+      "Architecture logicielle & APIs REST",
+      "Applications Vue 3 / Nuxt 4 & NestJS",
+      "Intégration Stripe & PostgreSQL",
+    ],
+    tags: ["Nuxt", "NestJS", "PostgreSQL", "Stripe Connect"],
+    price: "Sur devis / au sprint",
     featured: false,
   },
   {
-    id: "apps",
-    icon: "code",
-    title: "Applications web",
-    desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.",
+    id: "fullstack",
+    no: "02 / 03",
+    icon: "layers",
+    title: "Développement Full Stack TypeScript",
+    desc: "Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.",
+    points: [
+      "Composants Vue 3 / Nuxt avec TypeScript strict",
+      "Microservices & backend modulaire NestJS",
+      "Fiabilisation et optimisation des performances",
+    ],
+    tags: ["TypeScript", "Vue 3", "Nuxt", "NestJS", "Node.js"],
+    price: "Sur devis / TJM",
     featured: true,
   },
   {
-    id: "ia",
+    id: "evolution",
+    no: "03 / 03",
     icon: "spark",
-    title: "IA & automatisation",
-    desc: "L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.",
+    title: "Évolution & Architecture applicative",
+    desc: "Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).",
+    points: [
+      "Audits techniques de code & migrations de versions",
+      "Tests E2E Cypress & tests unitaires Vitest",
+      "Pipelines CI/CD & conteneurisation Docker",
+    ],
+    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
+    price: "Au forfait / audit",
     featured: false,
   },
 ];
@@ -356,13 +399,19 @@ usePageSeo({
   width: 100%;
 }
 
+.offer__top {
+  display: flex;
+  align-items: center;
+  justify-content: space-between;
+  margin-bottom: var(--space-4);
+}
+
 .offer__icon {
   display: flex;
   align-items: center;
   justify-content: center;
   width: var(--space-10); // 40px
   height: var(--space-10);
-  margin-bottom: var(--space-4);
 
   // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
   // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
@@ -372,6 +421,13 @@ usePageSeo({
   border-radius: var(--radius-md);
 }
 
+.offer__no {
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  letter-spacing: var(--ls-wider);
+  color: var(--text-faint);
+}
+
 .offer__title {
   margin-bottom: var(--space-2);
   font-family: var(--font-mono);
@@ -388,8 +444,46 @@ usePageSeo({
   color: var(--text-body);
 }
 
-.offer__more {
+.offer__points {
+  display: flex;
+  flex-direction: column;
+  gap: var(--space-2);
+  margin: 0 0 var(--space-4);
+  padding: 0;
+  list-style: none;
+
+  li {
+    display: flex;
+    gap: var(--space-2);
+    align-items: flex-start;
+    font-family: var(--font-mono);
+    font-size: var(--fs-xs);
+    line-height: var(--lh-normal);
+    color: var(--text-muted);
+  }
+}
+
+.offer__check {
+  font-size: var(--fs-sm);
+  color: var(--term-green);
+  margin-top: 2px;
+}
+
+.offer__tags {
+  margin-bottom: var(--space-4);
+}
+
+.offer__price {
   margin-top: auto;
+  padding-top: var(--space-4);
+  border-top: 1px dashed var(--border-subtle);
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  color: var(--accent);
+}
+
+.offer__more {
+  margin-top: var(--space-3);
   font-family: var(--font-mono);
   font-size: var(--fs-sm);
   color: var(--accent);

codex
La compétence confirme les contraintes : diff lisible, analyse adversariale, au moins dix problèmes, et sortie limitée à une liste Markdown de descriptions. Je recoupe maintenant les hypothèses du diff avec les composants, les tokens, les données partagées et les critères de Story 11.3.
exec
/bin/zsh -lc "printf '%s\\n' '--- candidate files ---' && rg --files app docs | rg '(11[-.]3|HomeStack|ZCard|ZTag|ZIcon|site\\.ts|index\\.vue|_root\\.scss|_layout\\.scss)' && printf '%s\\n' '--- story references ---' && rg -n -i '11\\.3|stack moderne|marquee|ruban|expertises|applications web|SaaS' docs app content | head -240" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
--- candidate files ---
app/data/site.ts
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md
app/components/ui/ZIcon.vue
app/components/ui/ZCard.vue
app/components/ui/ZTag.vue
app/components/home/HomeStackMarquee.vue
app/pages/index.vue
app/components/card/ZCardFooter.vue
app/components/card/ZCardBody.vue
app/components/card/ZCardHeader.vue
app/pages/blog/index.vue
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md
docs/implementation-artifacts/code-reviews/11-3/prompt-acceptance-auditor.md
docs/implementation-artifacts/code-reviews/11-3/full.diff
docs/implementation-artifacts/code-reviews/11-3/prompt-blind-hunter.md
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json
docs/implementation-artifacts/code-reviews/11-3/prompt-edge-case-hunter.md
docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md
app/assets/scss/base/_layout.scss
app/assets/scss/abstract/_root.scss
--- story references ---
app/pages/about.vue:33:              Je suis aussi fondateur du SaaS
app/pages/services.vue:90:// vouvoiement, pas d'emoji. « Applications web » est l'offre mise en avant.
app/pages/services.vue:104:    title: "Applications web",
app/pages/services.vue:138:    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
app/pages/services.vue:166:    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
app/data/site.ts:60:    desc: "Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).",
app/data/site.ts:63:    tags: ["nuxt", "nest.js", "postgresql", "stripe", "saas"],
app/data/site.ts:68:    desc: "Plateforme SaaS B2B d'essayage virtuel de vêtements via l'IA générative (diffusion models, microservices asynchrones, files Redis).",
docs/contexte_malt.md:11:> **Simon Jouan est un développeur Full Stack TypeScript spécialisé dans la conception et le développement d’applications web et SaaS modernes avec Nuxt et NestJS.**
docs/contexte_malt.md:27:- créateur de produits SaaS ;
docs/contexte_malt.md:47:- développement d’applications SaaS ;
docs/contexte_malt.md:81:- éditeurs SaaS ;
docs/contexte_malt.md:89:> « Nous devons construire ou faire évoluer un SaaS / une application web et nous avons besoin de quelqu’un capable de gérer sérieusement le frontend, le backend et les problématiques produit. »
docs/contexte_malt.md:108:> **J’aide les startups, PME et équipes produit à concevoir, développer et faire évoluer leurs applications web et SaaS avec TypeScript, Nuxt et NestJS.**
docs/contexte_malt.md:116:> **Développeur Full Stack TypeScript spécialisé dans les applications web et SaaS avec Nuxt et NestJS.**
docs/contexte_malt.md:146:**Développeur freelance TypeScript, Nuxt & NestJS — applications web et SaaS**
docs/contexte_malt.md:191:- architecture SaaS ;
docs/contexte_malt.md:275:> **Simon est un développeur Full Stack moderne qui maîtrise profondément les outils IA.**
docs/contexte_malt.md:331:- applications web ;
docs/contexte_malt.md:356:Keova est un SaaS métier développé par Simon.
docs/contexte_malt.md:389:Sur le portfolio personnel de Simon, Keova doit surtout devenir une **étude de cas démontrant sa capacité à construire un véritable produit SaaS de bout en bout**.
docs/contexte_malt.md:395:Besoin de créer une plateforme SaaS métier centralisant plusieurs fonctions auparavant réparties dans différents outils.
docs/contexte_malt.md:411:Application SaaS Full Stack moderne construite autour de Nuxt / NestJS / PostgreSQL.
docs/contexte_malt.md:425:- architecture SaaS ;
docs/contexte_malt.md:440:Il s’agit d’un SaaS / produit utilisant notamment des technologies d’IA générative autour de l’image.
docs/contexte_malt.md:562:- SaaS ;
docs/contexte_malt.md:590:- le fonctionnement d’un SaaS ;
docs/contexte_malt.md:600:> **Développeur Full Stack avec une forte culture produit, nourrie par la création de mes propres SaaS.**
docs/contexte_malt.md:647:> **Je conçois et développe des applications web et SaaS en TypeScript avec Nuxt et NestJS.**
docs/contexte_malt.md:651:> Mon parcours en QA et automatisation m’apporte une forte culture de la qualité logicielle, tandis que mes propres projets SaaS me permettent de comprendre les contraintes produit au-delà du simple développement.
docs/contexte_malt.md:688:Preuve principale de capacité Full Stack SaaS.
docs/contexte_malt.md:730:- SaaS mis en production ;
docs/contexte_malt.md:830:Applications web et SaaS.
docs/contexte_malt.md:842:### Créer un SaaS ou une application métier
docs/contexte_malt.md:886:### SaaS & intégrations
docs/contexte_malt.md:908:- création de SaaS ;
docs/contexte_malt.md:932:**Métrologie → développement → QA → Full Stack → SaaS → IA**
docs/contexte_malt.md:956:## Développement SaaS / application web
docs/contexte_malt.md:980:SaaS métier Full Stack.
docs/contexte_malt.md:984:SaaS intégrant IA générative.
docs/contexte_malt.md:1004:- développeur SaaS ;
docs/contexte_malt.md:1005:- développement application SaaS ;
docs/contexte_malt.md:1088:**expérience produit / SaaS**
docs/contexte_malt.md:1112:> « Il construit réellement des applications SaaS complètes, pas seulement des interfaces. »
docs/contexte_malt.md:1170:**Applications web / SaaS / applications métier**
docs/contexte_malt.md:1188:> **Est-ce que cet élément renforce l’idée que Simon est le développeur Full Stack TypeScript que je pourrais engager pour construire ou faire évoluer mon application SaaS ?**
docs/contexte_malt.md:1202:> **Refondre le site de Simon Jouan afin de l’aligner avec son positionnement Malt : Développeur Full Stack TypeScript spécialisé Nuxt / NestJS, intervenant sur la conception, le développement et l’évolution d’applications web et SaaS. Keova et TryOn doivent servir de principales preuves de sa capacité à construire des produits complets. Son expérience QA doit être présentée comme un différenciateur de qualité logicielle, et son expertise IA comme une compétence avancée complémentaire, jamais comme un positionnement concurrent. Le visiteur doit comprendre le métier, la spécialisation et le type de missions recherchées en moins de dix secondes. L’ensemble du site doit privilégier clarté, preuves, projets réels et expertise technique plutôt qu’une présentation exhaustive de toutes ses compétences.**
app/pages/index.vue:17:              Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De
app/pages/index.vue:47:    <!-- Ruban défilant de la stack moderne (Story 11.3 / AC-1) -->
app/pages/index.vue:48:    <HomeStackMarquee />
app/pages/index.vue:50:    <!-- Vitrine des 3 services cibles (Story 11.3 / AC-2) -->
app/pages/index.vue:54:        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos applications</h2>
app/pages/index.vue:139:// Vitrine des 3 offres ciblées Full Stack TS (Story 11.3 / AC-2).
app/pages/index.vue:146:    title: "Création d'applications web & SaaS",
app/pages/index.vue:162:    desc: "Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.",
app/pages/index.vue:193:  { id: "stat-3", value: "1", label: "SaaS fondé · keova.app" },
app/pages/index.vue:227:    "Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL.",
docs/planning-artifacts/epics.md:36:FR6: Page Services = 3 offres (WordPress / Applications web / IA) + étapes du process (route `/services`). _(CAP-6)_
docs/planning-artifacts/epics.md:52:FR20: Hero commercial cinétique affichant le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS », le pitch SaaS/web apps, le badge de statut vérifié Malt (`<ZExternalLink>`), les CTAs vers `/contact` et `/about`, et la fenêtre terminal hero simulant la frappe de commandes clés avec caret natif. _(CAP-3)_
docs/planning-artifacts/epics.md:53:FR21: Marquee infini de la stack technique moderne prioritaire alimenté par `SITE.skills`, défilant en continu avec pause au survol et arrêt sans débordement horizontal sous reduced-motion. _(CAP-4)_
docs/planning-artifacts/epics.md:109:UX-DR21: Composant `StackMarquee` avec doublement des éléments pour défilement infini CSS fluide et pause sur `:hover`.
docs/planning-artifacts/epics.md:137:FR21: Epic 11 — Marquee infini de la stack moderne ciblée
docs/planning-artifacts/epics.md:148:Le site tourne sur une stack moderne (Nuxt 4, deps à jour, abandon de `@nuxt/bridge-edge`), build & déploiement verts — base saine et bloquante pour la refonte.
docs/planning-artifacts/epics.md:160:Le visiteur comprend les trois offres (WordPress / Applications web / IA) et le process (nouvelle route `/services`).
docs/planning-artifacts/epics.md:188:Le visiteur arrivant sur la page d'accueil de `jouan.ovh` découvre une vitrine immersive haute performance (« Awwwards level ») et comprend instantanément le positionnement de Simon Jouan comme Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL) pour applications web et SaaS, appuyé par des preuves concrètes de réalisations (Keova en production, TryOn en étude de cas, Nodium en lab R&D), une réassurance chiffrée (11 ans d'expérience, culture qualité logicielle), et des points de contact directs (formulaire et profil Malt) sans altérer l'architecture multi-pages existante.
docs/planning-artifacts/epics.md:195:Le site tourne sur une stack moderne, build & déploiement verts — base saine et bloquante pour la refonte (NFR8).
docs/planning-artifacts/epics.md:416:**When** on crée la route `/services` avec 3 cartes (WordPress / Applications web / IA)
docs/planning-artifacts/epics.md:708:Le visiteur arrivant sur la page d'accueil de `jouan.ovh` découvre une vitrine immersive haute performance (« Awwwards level ») et comprend instantanément le positionnement de Simon Jouan comme Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL) pour applications web et SaaS, appuyé par des preuves concrètes de réalisations (Keova en production, TryOn en étude de cas, Nodium en lab R&D), une réassurance chiffrée (11 ans d'expérience, culture qualité logicielle), et des points de contact directs (formulaire et profil Malt) sans altérer l'architecture multi-pages existante.
docs/planning-artifacts/epics.md:719:**When** on crée et checkout la branche dédiée `feat/home-awwwards` issue de `develop`, qu'on met à jour `app/data/site.ts` avec le profil Malt (`SITE.profile` rôle « Développeur Full Stack TypeScript — Nuxt / NestJS », ville « Rouen, France » ; `SITE.skills` stack moderne ciblée ; `SITE.projects` avec Keova, TryOn et Nodium), et qu'on intègre le conteneur atmosphérique `.atmos` et le micro-curseur desktop progressif
docs/planning-artifacts/epics.md:738:  - Sous-titre orienté création et évolution d'applications web et SaaS (Nuxt, NestJS, PostgreSQL)
docs/planning-artifacts/epics.md:743:### Story 11.3: Marquee de stack moderne & Vitrine des 3 services ciblés
docs/planning-artifacts/epics.md:746:I want observer le défilé continu de la stack moderne maîtrisée et découvrir les 3 cartes d'offres de services,
docs/planning-artifacts/epics.md:751:**Given** la stack moderne définie dans `SITE.skills` (TypeScript, Nuxt 4, Vue.js, NestJS, Node.js, PostgreSQL, TypeORM, Stripe Connect, Cypress, Docker, REST API, Vitest)
docs/planning-artifacts/epics.md:752:**When** on intègre le composant `StackMarquee` et la section des 3 services phares
docs/planning-artifacts/epics.md:754:**And** la vitrine expose 3 cartes structurées `ZCard` (1. Création d'applications web & SaaS, 2. Développement Full Stack TypeScript, 3. Évolution & architecture applicative) avec numérotation terminale, proposition de valeur claire et tags technologiques
docs/planning-artifacts/epics.md:758:### Story 11.4: Preuves concrètes SaaS, Journal technique & CTA final de conversion
docs/planning-artifacts/epics.md:761:I want consulter les réalisations SaaS phares (Keova, TryOn, Nodium), les statistiques clés et les derniers articles du journal,
docs/planning-artifacts/epics.md:770:  - **TryOn** avec statut `○ Étude de cas (MVP livré)` valorisant l'ingénierie SaaS & IA générative, **sans lien externe mort 404** (renvoi vers description détaillée/Malt)
docs/planning-artifacts/epics.md:772:**And** les 3 compteurs statistiques clés sont affichés (11 ans d'expérience, SaaS opérés, culture qualité & automatisation)
app/components/home/HomeStackMarquee.vue:2:  <div class="marquee" aria-hidden="true">
app/components/home/HomeStackMarquee.vue:3:    <div class="marquee__track">
app/components/home/HomeStackMarquee.vue:5:      <span v-for="(skill, index) in skillsList" :key="`skill-a-${index}`" class="marquee__item">
app/components/home/HomeStackMarquee.vue:6:        <b class="marquee__label">{{ skill }}</b>
app/components/home/HomeStackMarquee.vue:7:        <span class="marquee__star" aria-hidden="true">✦</span>
app/components/home/HomeStackMarquee.vue:10:      <span v-for="(skill, index) in skillsList" :key="`skill-b-${index}`" class="marquee__item">
app/components/home/HomeStackMarquee.vue:11:        <b class="marquee__label">{{ skill }}</b>
app/components/home/HomeStackMarquee.vue:12:        <span class="marquee__star" aria-hidden="true">✦</span>
app/components/home/HomeStackMarquee.vue:19:// Ruban défilant continu de la stack moderne prioritaire (Story 11.3 / AC-1 / CAP-4).
app/components/home/HomeStackMarquee.vue:48:.marquee {
app/components/home/HomeStackMarquee.vue:56:  &:hover .marquee__track {
app/components/home/HomeStackMarquee.vue:61:.marquee__track {
app/components/home/HomeStackMarquee.vue:69:.marquee__item {
app/components/home/HomeStackMarquee.vue:80:.marquee__label {
app/components/home/HomeStackMarquee.vue:85:.marquee__star {
app/components/home/HomeStackMarquee.vue:100:  .marquee {
app/components/home/HomeStackMarquee.vue:104:  .marquee__track {
docs/specs/spec-design-system-revamp/pages.md:10:| `/services` | `Services.jsx` | **à créer** | 3 offres (WordPress / Applications web / IA) · étapes du process |
docs/specs/spec-home-awwwards/sections-mapping.md:15:| **Hero & Terminal** | Positionnement commercial immédiat | « Développeur Full Stack TypeScript — Nuxt / NestJS » + pitch création/évolution SaaS + badge Malt. | CTA primaire vers `/contact` (« Discuter de votre projet »), secondaire vers `/about`, lien externe vers profil Malt. |
docs/specs/spec-home-awwwards/sections-mapping.md:16:| **Marquee Stack** | Défilé continu des technologies prioritaires | Stack moderne ciblée : TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API. | Ruban visuel continu alimenté par `SITE.skills`. |
docs/specs/spec-home-awwwards/sections-mapping.md:17:| **Services (3 cartes)** | Présentation des 3 offres ciblées | 1. Création d'apps web & SaaS<br>2. Dév Full Stack TypeScript<br>3. Évolution & architecture applicative | Cartes cliquables avec renvoi vers `/services` (où se trouve le déroulé du process en 4 étapes). |
docs/specs/spec-home-awwwards/sections-mapping.md:18:| **Projets sélectionnés** | Preuves concrètes de réalisations SaaS | 1. **Keova** (SaaS ERP équestre Nuxt 4/NestJS/PostgreSQL/Stripe)<br>2. **TryOn** (SaaS IA générative Nuxt/NestJS/Python/ComfyUI)<br>3. **Nodium** (Lab d'agents IA desktop) | Liens externes vers les projets via `<ZExternalLink>`, renvoi vers `/about` pour le parcours complet (Kidizz, CINS). |
docs/specs/spec-home-awwwards/sections-mapping.md:19:| **Statistiques clés** | Réassurance et crédibilité | 11 ans d'expérience web · 2 SaaS fondés / opérés · Culture QA & automatisation E2E. | Compteurs visuels intégrés à la section projets. |
docs/specs/spec-home-awwwards/sections-mapping.md:21:| **CTA Final** | Appel à la conversion orienté mission | « Un projet d'application web ou SaaS ? Discutons-en. » | Bouton vers `/contact`, lien externe vers profil Malt (`<ZExternalLink>`). |
docs/specs/spec-home-awwwards/sections-mapping.md:43:  - Sous-titre : `Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.`
docs/specs/spec-home-awwwards/sections-mapping.md:51:    - `$ cat focus.txt` → `SaaS, web apps, clean architecture, automated testing (QA) & AI engineering`
docs/specs/spec-home-awwwards/sections-mapping.md:52:    - `$ ls ~/projets` → `keova.app/  tryon-saas/  nodium-lab/`
docs/specs/spec-home-awwwards/sections-mapping.md:54:### D. Marquee Stack Moderne
docs/specs/spec-home-awwwards/sections-mapping.md:55:- **Contenu :** Ruban continu affichant les technologies phares de `SITE.skills` :
docs/specs/spec-home-awwwards/sections-mapping.md:60:1. **Création d'applications web & SaaS**
docs/specs/spec-home-awwwards/sections-mapping.md:64:   - *Promesse :* Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.
docs/specs/spec-home-awwwards/sections-mapping.md:71:- **1. Keova App (Pièce maîtresse SaaS en production) :**
docs/specs/spec-home-awwwards/sections-mapping.md:74:  - Description : ERP vertical SaaS complet dédié au secteur équestre (gestion de pensions, facturation automatisée, réservations).
docs/specs/spec-home-awwwards/sections-mapping.md:77:- **2. TryOn (Étude de cas SaaS & IA générative) :**
docs/specs/spec-home-awwwards/sections-mapping.md:80:  - Description : Plateforme SaaS B2B d'essayage virtuel de vêtements pour marques de mode via l'IA générative (diffusion models, workflows asynchrones, files Redis).
docs/specs/spec-home-awwwards/sections-mapping.md:90:  - `100%` TypeScript & SaaS de bout en bout
docs/specs/spec-home-awwwards/sections-mapping.md:94:- **Titre :** `Un projet d'application web ou SaaS ?`
app/components/home/HomeHeroTerminal.vue:109:    if (p.name === "TryOn") return "tryon-saas/";
app/components/home/HomeHeroTerminal.vue:123:    out: "SaaS, web apps, clean architecture, automated testing (QA) & AI engineering",
docs/specs/spec-design-system-revamp/SPEC.md:43:  intent: Une page Services présente les trois offres (WordPress / Applications web / IA) et les étapes du process.
docs/specs/spec-home-awwwards/SPEC.md:18:Transformer la page d'accueil de `jouan.ovh` en un **entonnoir de conversion commercial de haut niveau (« Awwwards level »)** pour positionner Simon Jouan comme **Développeur Full Stack TypeScript spécialisé Nuxt / NestJS pour applications web et SaaS**.
docs/specs/spec-home-awwwards/SPEC.md:19:Cette refonte traduit la puissance visuelle de `Home - Awwwards.html` (auroras cinétiques, séquence de boot `jouan.os`, terminal hero interactif, marquee de stack, cartes en relief) tout en alignant rigoureusement le message avec le profil Malt officiel (`contexte_malt.md`) et la stratégie commerciale (`direction_strategique_site.md`) :
docs/specs/spec-home-awwwards/SPEC.md:20:1. **Clarté immédiate du rôle :** Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL), capable de concevoir et faire évoluer des produits web et SaaS de bout en bout.
docs/specs/spec-home-awwwards/SPEC.md:21:2. **Preuves concrètes avant discours marketing :** Remplacement des anciens projets vitrines par le trio SaaS aligné avec Malt : **Keova** (pièce maîtresse ERP équestre), **TryOn** (SaaS IA générative) et **Nodium** (laboratoire d'agents IA), appuyés par l'expertise qualité logicielle issue de Kidizz.
docs/specs/spec-home-awwwards/SPEC.md:35:  intent: Le visiteur visualise un hero commercial percutant combinant le titre officiel (« Développeur Full Stack TypeScript — Nuxt / NestJS »), un pitch orienté création/évolution SaaS, un badge de disponibilité avec lien accessible vers le profil Malt, et une fenêtre terminal hero simulant la frappe de commandes clés.
docs/specs/spec-home-awwwards/SPEC.md:39:  intent: Le visiteur observe un bandeau défilant continu (marquee) exposant la stack technique moderne prioritaire sans dispersion legacy.
docs/specs/spec-home-awwwards/SPEC.md:40:  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
docs/specs/spec-home-awwwards/SPEC.md:44:  success: Les trois cartes de service (1. Création d'applications web & SaaS, 2. Développement Full Stack TypeScript, 3. Évolution & architecture applicative) affichent numéro, résumé de valeur et compétences clés, avec des liens cliquables guidant l'utilisateur vers `/services`.
docs/specs/spec-home-awwwards/SPEC.md:48:  success: Les projets présentés valorisent Keova (pièce maîtresse SaaS en production avec lien live `<ZExternalLink>`), TryOn (étude de cas d'ingénierie SaaS & IA / MVP livré, sans lien mort vers un domaine inactif) et Nodium (lab technique agents IA), chacun avec rôle, stack et description orientée valeur, accompagnés des 3 compteurs statistiques clés (11 ans d'expérience, SaaS fondés/opérés, culture qualité).
docs/specs/spec-home-awwwards/SPEC.md:73:- Respect strict de `prefers-reduced-motion: reduce` : animations neutralisées à `0.01ms`, auroras figées, marquee statique, boot overlay passé instantanément. Seul le caret de frappe du terminal est autorisé à clignoter (CAP-11).
docs/animations_jouan.ovh/Home animée.dc.html:107:            <h3 style="font-family:var(--font-mono); color:var(--text-strong); font-weight:400; font-size:var(--fs-xl); margin:0 0 8px;">Applications web</h3>
docs/animations_jouan.ovh/Home animée.dc.html:140:          <span style="font-size:14px; color:var(--text-muted);">SaaS fondé · keova.app</span>
docs/animations_jouan.ovh/Home animée.dc.html:149:              <span style="font-family:var(--font-mono); font-size:12px; color:var(--text-muted);">Fondateur · SaaS</span>
docs/animations_jouan.ovh/Home animée.dc.html:151:            <p style="font-family:var(--font-sans); font-size:14px; color:var(--text-body); line-height:var(--lh-relaxed); margin:12px 0 16px;">Plateforme SaaS que je conçois et opère de bout en bout.</p>
docs/animations_jouan.ovh/Home animée.dc.html:155:              <x-import component-from-global-scope="JouanOvhDesignSystem_c7aa28.Tag" hint-size="auto,24px">saas</x-import>
app/assets/scss/abstract/color/_purple.scss:24:$purpleA12: hsl(272deg 99.2% 11.3% / 94.6%);
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:628:  }, "Je suis aussi fondateur du SaaS ", /*#__PURE__*/React.createElement("a", {
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1681:  about: () => "Développeur web freelance basé à Valognes.\nPHP/Symfony · WordPress · Node.js / Nest.js / Nuxt.js.\nFondateur du SaaS keova.app.",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1790:    l: "SaaS fondé · keova.app"
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1801:    title: "Applications web",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1816:    role: "Fondateur · SaaS",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1817:    desc: "Plateforme SaaS que je conçois et opère de bout en bout.",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1818:    tags: ["nest.js", "nuxt", "saas"],
docs/direction_strategique_site.md:17:> **Développeur Full Stack TypeScript spécialisé Nuxt / NestJS pour applications web et SaaS.**
docs/direction_strategique_site.md:29:- créateur de SaaS ;
docs/direction_strategique_site.md:38:→ **applications web / SaaS**  
docs/direction_strategique_site.md:74:- développement de SaaS ;
docs/direction_strategique_site.md:83:- architecture d’applications web.
docs/direction_strategique_site.md:108:- éditeurs SaaS ;
docs/direction_strategique_site.md:153:Applications web et SaaS.
docs/direction_strategique_site.md:167:> Je conçois et développe des applications web et SaaS avec Nuxt, NestJS et PostgreSQL.
docs/direction_strategique_site.md:195:Cela affaiblit directement le positionnement SaaS / Full Stack TypeScript.
docs/direction_strategique_site.md:205:## 1. Création d’applications web et SaaS
docs/direction_strategique_site.md:243:> **Simon ne dit pas simplement qu’il sait construire des SaaS. Il en construit réellement.**
docs/direction_strategique_site.md:284:- produit SaaS.
docs/direction_strategique_site.md:406:- lancer un SaaS ;
docs/direction_strategique_site.md:424:Architecture SaaS.
docs/direction_strategique_site.md:514:**SaaS**  
docs/direction_strategique_site.md:550:> **Applications web et SaaS**
docs/direction_strategique_site.md:567:- développeur SaaS ;
docs/direction_strategique_site.md:568:- développement SaaS ;
docs/direction_strategique_site.md:585:> **Il construit des SaaS complets et semble très autonome.**
docs/direction_strategique_site.md:629:> **Le site et Malt doivent raconter exactement la même histoire : développeur Full Stack TypeScript spécialisé Nuxt/NestJS, capable de construire et faire évoluer des applications web et SaaS de bout en bout, avec comme différenciateurs une forte culture produit, QA et IA.**
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md:9:> Node.js / Nest.js / Nuxt.js developer. Founder of the SaaS platform
docs/implementation-artifacts/3-3-projets-selectionnes.md:30:  - [x] Projet 1 — `keova.app`, rôle « Fondateur · SaaS », desc « Plateforme SaaS que je conçois et opère de bout en bout. », tags `nest.js`/`nuxt`/`saas`, url `https://keova.app`
docs/implementation-artifacts/3-3-projets-selectionnes.md:88:- `{ name: "keova.app", role: "Fondateur · SaaS", desc: "Plateforme SaaS que je conçois et opère de bout en bout.", tags: ["nest.js","nuxt","saas"], url: "https://keova.app" }`
docs/implementation-artifacts/5-1-portrait-et-bio.md:87:    > Je suis aussi fondateur du SaaS [keova.app](https://keova.app), et j'aime mettre l'IA au service du code — agents, automatisations, intégrations LLM.
docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md:31:     - `$ cat focus.txt` → `SaaS, web apps, clean architecture, automated testing (QA) & AI engineering`
docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md:32:     - `$ ls ~/projets` → `keova.app/  tryon-saas/  nodium-lab/`
docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md:41:     - Sous-titre descriptif : `Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.`
docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md:114:- **Pitch sous-titre :** `Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.`
docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md:118:  2. `$ cat focus.txt` → `SaaS, web apps, clean architecture, automated testing (QA) & AI engineering`
docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md:119:  3. `$ ls ~/projets` → `keova.app/  tryon-saas/  nodium-lab/`
docs/implementation-artifacts/deferred-work.md:146:- **Marquee de stack moderne ordonnée et mise en avant des 3 services** (`app/pages/index.vue`) — La section des compétences et des services n'affiche pas encore le marquee ni les 3 offres commerciales. → Prévu dans la **Story 11.3** (Marquee de stack moderne et vitrine des 3 services cibles).
docs/implementation-artifacts/deferred-work.md:147:- **Preuves statistiques SaaS (100k+, 85%), journal technique et bouton CTA vers profil Malt** (`app/pages/index.vue`) — Les indicateurs chiffrés, le journal et le lien de conversion Malt ne sont pas encore intégrés sur la home. → Prévu dans la **Story 11.4** (Preuves concrètes SaaS, journal technique et CTA final de conversion).
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:26:   **And** `SITE.skills` reflète la stack moderne ordonnée : `["typescript", "nuxt", "vue", "nest.js", "node.js", "postgresql", "typeorm", "stripe", "cypress", "docker", "rest-api", "vitest"]` sans dispersion WordPress/PHP en premier plan
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:56:  - [x] Mettre à jour `SITE.skills` avec la stack moderne ciblée.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:89:- [x] [Review][Defer] Marquee de stack moderne ordonnée et mise en avant des 3 services [app/pages/index.vue] — deferred, prévu dans la Story 11.3
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:90:- [x] [Review][Defer] Preuves statistiques SaaS (100k+, 85%), journal technique et bouton CTA vers profil Malt [app/pages/index.vue] — deferred, prévu dans la Story 11.4
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:103:  - *Modifications :* Rôle mis à jour (« Développeur Full Stack TypeScript — Nuxt / NestJS »), ville « Rouen, France », stack moderne ciblée, et projets Keova (live), TryOn (étude de cas) et Nodium (lab).
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:122:   - Projets phares : Keova (live SaaS), TryOn (étude de cas MVP IA), Nodium (lab R&D agents IA).
docs/implementation-artifacts/epic-4-retro-2026-06-23.md:18:  - 4.1 — Route `/services` + cartes d'offre : en-tête (eyebrow `// services`, h1, prose) + grille `.grid-3` des 3 offres (WordPress / Applications web *featured* / IA), portées de `Services.jsx` + `data.js`, rendues en `ZCard`/`ZBadge`/`ZButton`/`ZIcon`.
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:31:  - [x] Service 2 — `Applications web` (icône `code`), desc « Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre. », `featured: true` (carte accent/mise en avant)
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:37:  - [x] Contenu (réf. `data.js` `stats`) : `8+` « ans dans la tech » · `3` « stacks maîtrisés » · `1` « SaaS fondé · keova.app »
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:99:- `stats` : `[{n:"8+", l:"ans dans la tech"}, {n:"3", l:"stacks maîtrisés"}, {n:"1", l:"SaaS fondé · keova.app"}]`
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:144:- Section « aperçu services » sous le hero : eyebrow `// ce que je fais`, `<h2>Trois façons de travailler ensemble`, grille `.grid-3` de 3 `ZCard` (Epic 2). La carte `featured` (Applications web) reçoit `accent` + `featured` (barre + glow orange) ; les 3 cartes sont `interactive`.
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:5:# Story 11.3: Marquee de stack moderne & Vitrine des 3 services cibles
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:14:I want observer le défilé continu de la stack moderne maîtrisée et découvrir les 3 cartes d'offres de services,
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:19:1. **Given** la stack moderne définie dans `app/data/site.ts` (`SITE.skills`)
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:21:   **Then** le composant `HomeStackMarquee.vue` affiche un bandeau défilant continu en pur CSS (animation `scroll-x` avec masque d'atténuation horizontal `mask-image: linear-gradient(...)`)
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:24:   **And** le ruban animé est masqué aux technologies d'assistance (`aria-hidden="true"`) pour éviter la pollution sonore des lecteurs d'écran
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:31:     - Titre de section : `<h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos applications</h2>`
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:32:   **And** la grille présente exactement 3 cartes `ZCard` orientées Full Stack TypeScript & SaaS :
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:33:     - **Carte 1 — Création d'applications web & SaaS** (`01 / 03`) :
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:39:       - Proposition de valeur : `Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.`
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:60:- [x] Tâche 1 — Création du composant `app/components/home/HomeStackMarquee.vue` (AC: 1)
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:61:  - [x] Définir la structure de template (`.marquee`, `.marquee__track`, `.marquee__item`, séparateur `.star` avec symbole `✦`).
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:76:  - [x] Placer `<HomeStackMarquee />` sous le hero commercial `.hero` et avant la section des services.
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:91:  - Le marquee est décoratif et en boucle continue : il DOIT porter `aria-hidden="true"`.
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:95:- **DRY & Données :** La liste des compétences du marquee doit s'appuyer sur `SITE.skills` issu de `app/data/site.ts`.
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:98:- **`app/components/home/HomeStackMarquee.vue`** (NEW) : Composant bandeau défilant infini de la stack moderne.
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:99:- **`app/pages/index.vue`** (UPDATE) : Insertion du marquee, refonte complète de la section services en 3 offres ciblées, suppression des reliquats WordPress.
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:102:- **Marquee items :**
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:106:  1. `01 / 03` — `Création d'applications web & SaaS`
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:111:     - Proposition : `Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.`
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:128:- Implémentation du composant `HomeStackMarquee.vue` avec boucle infinie CSS, mask-image et `aria-hidden="true"`, pause au survol `:hover` et arrêt sous `prefers-reduced-motion: reduce`.
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:130:- Mise à jour de l'en-tête de section (`// ce que je propose` et `Trois expertises pour concevoir et faire évoluer vos applications`).
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:134:- `app/components/home/HomeStackMarquee.vue` (NEW)
docs/implementation-artifacts/4-1-route-services-et-cartes-doffre.md:19:1. **Given** la référence `Services.jsx` et le contenu `data.js`, **When** on crée la route `/services` avec 3 cartes (WordPress / Applications web / IA), **Then** les 3 offres rendent conformément à la référence.
docs/implementation-artifacts/4-1-route-services-et-cartes-doffre.md:32:  - [x] Reprendre les 3 entrées `services` de `data.js` (WordPress sur-mesure / Applications web / IA & automatisation) : `icon`, `title`, `desc`, `points[]`, `price`, `featured`
docs/implementation-artifacts/4-1-route-services-et-cartes-doffre.md:33:  - [x] Déclarer ce contenu dans le `<script setup>` (tableau typé) ; l'offre « Applications web » est `featured: true`
docs/implementation-artifacts/4-1-route-services-et-cartes-doffre.md:51:- [x] [Review][Patch] CTA « Discuter du projet » identique ×3 sans libellé distinct (a11y) [app/pages/services.vue — `ZButton` de carte] — Les 3 cartes rendent le même bouton-lien « Discuter du projet » → `/contact` ; navigation par liste de liens d'un lecteur d'écran = 3 cibles indistinctes (même problème que les « En savoir plus » corrigés en story 3.2). Fix : `aria-label` par offre (ex. « Discuter du projet — Applications web »), cohérent avec le correctif 3.2. [blind] — ✅ Résolu : `:aria-label="`Discuter du projet — ${offer.title}`"` sur chaque `ZButton` ; les 3 libellés distincts vérifiés dans le HTML généré.
docs/implementation-artifacts/4-1-route-services-et-cartes-doffre.md:75:2. `code` — **Applications web** — desc « Des produits complets en Symfony, Nest.js et Nuxt.js… » — points : `API REST / GraphQL (Symfony · Nest.js)`, `Front Vue / Nuxt`, `Tests & CI/CD, qualité QA` — prix `sur devis` — `featured: true`.
docs/implementation-artifacts/4-1-route-services-et-cartes-doffre.md:133:- Contenu des 3 offres repris à l'identique de `data.js` (`window.SITE.services`), modélisé en tableau typé `Offer[]` dans le `<script setup>`. « Applications web » est `featured: true`.
docs/implementation-artifacts/sprint-status.yaml:38:last_updated: "2026-09-13 (Story 11.3 ready-for-dev : Marquee stack & Vitrine services)"
docs/implementation-artifacts/sprint-status.yaml:124:  11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles: review
docs/implementation-artifacts/sprint-status.yaml:125:  11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: backlog
docs/implementation-artifacts/code-reviews/11-1/raw-edge-case-hunter.json:514:-    role: "Fondateur · SaaS",
docs/implementation-artifacts/code-reviews/11-1/raw-edge-case-hunter.json:515:-    desc: "Plateforme SaaS que je conçois et opère de bout en bout.",
docs/implementation-artifacts/code-reviews/11-1/raw-edge-case-hunter.json:517:+    desc: "Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).",
docs/implementation-artifacts/code-reviews/11-1/raw-edge-case-hunter.json:519:-    tags: ["nest.js", "nuxt", "saas"],
docs/implementation-artifacts/code-reviews/11-1/raw-edge-case-hunter.json:521:+    tags: ["nuxt", "nest.js", "postgresql", "stripe", "saas"],
docs/implementation-artifacts/code-reviews/11-1/raw-edge-case-hunter.json:526:+    desc: "Plateforme SaaS B2B d'essayage virtuel de vêtements via l'IA générative (diffusion models, microservices asynchrones, files Redis).",
docs/implementation-artifacts/code-reviews/11-1/raw-edge-case-hunter.json:602:-  - [ ] Mettre à jour `SITE.skills` avec la stack moderne ciblée.
docs/implementation-artifacts/code-reviews/11-1/raw-edge-case-hunter.json:632:+  - [x] Mettre à jour `SITE.skills` avec la stack moderne ciblée.
docs/implementation-artifacts/code-reviews/11-1/raw-edge-case-hunter.json:669:+   - Projets phares : Keova (live SaaS), TryOn (étude de cas MVP IA), Nodium (lab R&D agents IA).
docs/implementation-artifacts/code-reviews/11-1/raw-edge-case-hunter.json:729:   11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles: backlog
docs/implementation-artifacts/code-reviews/11-1/raw-edge-case-hunter.json:730:   11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: backlog
docs/implementation-artifacts/code-reviews/11-1/raw-edge-case-hunter.json:1191:    60	    desc: "Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).",
docs/implementation-artifacts/code-reviews/11-1/raw-edge-case-hunter.json:1194:    63	    tags: ["nuxt", "nest.js", "postgresql", "stripe", "saas"],
docs/implementation-artifacts/code-reviews/11-1/raw-edge-case-hunter.json:1199:    68	    desc: "Plateforme SaaS B2B d'essayage virtuel de vêtements via l'IA générative (diffusion models, microservices asynchrones, files Redis).",
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:14:# Acceptance Auditor Prompt — Story 11.3
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:17:- Spec file: `docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md`
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:18:- Context specs: `docs/planning-artifacts/epics.md` (Epic 11 / Story 11.3), `docs/project-context.md`, `docs/specs/spec-home-awwwards/SPEC.md`, `AGENTS.md`
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:31:Je vais comparer directement le diff aux critères de la Story 11.3 et aux contraintes de contexte, puis restituer uniquement les écarts constatés sous forme de liste Markdown.
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:33:/bin/zsh -lc "wc -l \"docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md\" && sed -n '1,260p' \"docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md\"" in /Users/simon/dev/jouan.ovh
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:35:     144 docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:40:# Story 11.3: Marquee de stack moderne & Vitrine des 3 services cibles
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:49:I want observer le défilé continu de la stack moderne maîtrisée et découvrir les 3 cartes d'offres de services,
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:54:1. **Given** la stack moderne définie dans `app/data/site.ts` (`SITE.skills`)
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:56:   **Then** le composant `HomeStackMarquee.vue` affiche un bandeau défilant continu en pur CSS (animation `scroll-x` avec masque d'atténuation horizontal `mask-image: linear-gradient(...)`)

exec
/bin/zsh -lc "printf '%s\\n' '--- story ---' && sed -n '1,180p' docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md && printf '%s\\n' '--- site data ---' && sed -n '1,180p' app/data/site.ts && printf '%s\\n' '--- index.vue (1-250) ---' && sed -n '1,250p' app/pages/index.vue && printf '%s\\n' '--- index.vue (251-520) ---' && sed -n '251,520p' app/pages/index.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
--- story ---
---
baseline_commit: edfab0ecf3859790926fdae447ce7256a2f03565
---

# Story 11.3: Marquee de stack moderne & Vitrine des 3 services cibles

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur explorant la page d'accueil,
I want observer le défilé continu de la stack moderne maîtrisée et découvrir les 3 cartes d'offres de services,
so that j'identifie clairement les compétences techniques et accède au détail des prestations sur la page dédiée `/services` (FR21, FR22, FR26, UX-DR21, UX-DR22, CAP-4, CAP-5).

## Acceptance Criteria

1. **Given** la stack moderne définie dans `app/data/site.ts` (`SITE.skills`)
   **When** le visiteur visualise la zone située immédiatement sous le Hero
   **Then** le composant `HomeStackMarquee.vue` affiche un bandeau défilant continu en pur CSS (animation `scroll-x` avec masque d'atténuation horizontal `mask-image: linear-gradient(...)`)
   **And** les compétences sont affichées avec un séparateur visuel distinctif (étoile accent `✦` ou puce stylisée)
   **And** le défilement se met automatiquement en pause au survol de la souris (`:hover`)
   **And** le ruban animé est masqué aux technologies d'assistance (`aria-hidden="true"`) pour éviter la pollution sonore des lecteurs d'écran
   **And** sous `@media (prefers-reduced-motion: reduce)`, l'animation est totalement arrêtée (`animation: none`), les éléments restent alignés proprement sans débordement horizontal (`overflow: hidden`).

2. **Given** la section des services sur `app/pages/index.vue`
   **When** le visiteur découvre la vitrine d'offres
   **Then** l'en-tête de section affiche :
     - Eyebrow : `<p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>`
     - Titre de section : `<h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos applications</h2>`
   **And** la grille présente exactement 3 cartes `ZCard` orientées Full Stack TypeScript & SaaS :
     - **Carte 1 — Création d'applications web & SaaS** (`01 / 03`) :
       - Proposition de valeur : `De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.`
       - Points livrables clés avec icône de validation : Architecture logicielle & APIs REST, Applications Vue 3 / Nuxt 4 & NestJS, Intégration Stripe & PostgreSQL.
       - Tags technologiques : `Nuxt`, `NestJS`, `PostgreSQL`, `Stripe Connect`.
       - Tarif indicatif : `Sur devis / au sprint`.
     - **Carte 2 — Développement Full Stack TypeScript** (`02 / 03`, carte vedette / `featured`) :
       - Proposition de valeur : `Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.`
       - Points livrables clés avec icône de validation : Composants Vue 3 / Nuxt avec TypeScript strict, Microservices & backend modulaire NestJS, Fiabilisation et optimisation des performances.
       - Tags technologiques : `TypeScript`, `Vue 3`, `Nuxt`, `NestJS`, `Node.js`.
       - Tarif indicatif : `Sur devis / TJM`.
     - **Carte 3 — Évolution & Architecture applicative** (`03 / 03`) :
       - Proposition de valeur : `Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).`
       - Points livrables clés avec icône de validation : Audits techniques de code & migrations de versions, Tests E2E Cypress & tests unitaires Vitest, Pipelines CI/CD & conteneurisation Docker.
       - Tags technologiques : `Cypress`, `Vitest`, `Docker`, `CI/CD`.
       - Tarif indicatif : `Au forfait / audit`.
   **And** chaque carte ou lien d'approfondissement cible directement la route `/services` (aucune ancre intra-page `#`).

3. **Given** le template `app/pages/index.vue`
   **When** les nouvelles sections sont intégrées
   **Then** les anciennes données de services legacy (`wordpress`, `apps`, `ia` de l'ancien portfolio) et leur code mort sont intégralement supprimés du script et du template de la page d'accueil.

4. **Given** l'ensemble des intégrations de la story
   **When** on exécute la gate de validation Docker
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript, et 13 routes statiques générées avec succès par Nitro.

## Tasks / Subtasks

- [x] Tâche 1 — Création du composant `app/components/home/HomeStackMarquee.vue` (AC: 1)
  - [x] Définir la structure de template (`.marquee`, `.marquee__track`, `.marquee__item`, séparateur `.star` avec symbole `✦`).
  - [x] Consommer les compétences directement depuis `SITE.skills` (`app/data/site.ts`) et formater les libellés de stack pour l'affichage (ex. TypeScript, Nuxt 4, Vue.js, NestJS, Node.js, PostgreSQL, TypeORM, Stripe Connect, Cypress, Docker, REST API, Vitest).
  - [x] Doubler la liste des items dans le track pour assurer une boucle infinie continue sans à-coup visuel.
  - [x] Configurer l'animation CSS `@keyframes scroll-x` avec masquage horizontal `mask-image` et pause au survol (`:hover`).
  - [x] Appliquer `aria-hidden="true"` sur le conteneur décoratif et neutraliser l'animation sous `@media (prefers-reduced-motion: reduce)`.
  - [x] Styliser en SCSS scoped avec les tokens du Design System (`--border-subtle`, `--space-5`, `--space-8`, `--font-mono`, `--fs-xl`, `--text-faint`, `--text-body`, `--accent`, `--fw-regular`, `--ls-wide`).

- [x] Tâche 2 — Refonte de la vitrine des 3 services dans `app/pages/index.vue` (AC: 2, 3)
  - [x] Supprimer le tableau de données legacy `services` (WordPress, etc.) de `app/pages/index.vue`.
  - [x] Déclarer les 3 offres ciblées Full Stack TS (`creation`, `fullstack`, `evolution`) avec leur numérotation (`01 / 03`), description, points livrables, tags et liens vers `/services`.
  - [x] Baliser les cartes avec `ZCard` (support de `:accent="service.featured"` et `:featured="service.featured"`).
  - [x] Baliser la liste de points avec `<ul>` et `<li>`, utilisant une icône de validation accessible.
  - [x] Assurer que chaque lien d'action pointe vers `/services` (`<NuxtLink to="/services">`).

- [x] Tâche 3 — Intégration et disposition sur `app/pages/index.vue` (AC: 1, 2, 3)
  - [x] Placer `<HomeStackMarquee />` sous le hero commercial `.hero` et avant la section des services.
  - [x] Mettre à jour l'eyebrow de section (`// ce que je propose`) et le titre `h2`.
  - [x] Vérifier la cohérence responsive (grille 3 colonnes sur desktop, 1 colonne sous 860px) et l'espacement avec les primitives globales (`.section`, `.container`).

- [x] Tâche 4 — Validation qualité & Gate Docker (AC: 4)
  - [x] Exécuter la suite de validation Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [x] Vérifier la propreté du rendu, l'absence de régression d'hydratation et le comportement au clavier (`Tab`, `:focus-visible`).
  - [x] Vérifier l'arrêt complet du défilement sous `prefers-reduced-motion: reduce`.

## Dev Notes

### Architecture & Contraintes d'environnement
- **Environnement Docker STRICT :** Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. Ne jamais lancer `pnpm` sur la machine hôte macOS. [Source: AGENTS.md#Section 2]
- **Tokens CSS & Design System :** Aucune couleur ou espacement en dur. Consommer exclusivement les variables de tokens exposées dans `:root` (`var(--border-subtle)`, `var(--surface-1)`, `var(--text-strong)`, `var(--text-muted)`, `var(--accent)`, `var(--success)`, etc.). [Source: AGENTS.md#Section 3]
- **Accessibilité (a11y) :**
  - Le marquee est décoratif et en boucle continue : il DOIT porter `aria-hidden="true"`.
  - Respect strict de `prefers-reduced-motion: reduce` : l'animation de défilement doit être désactivée (`animation: none`).
  - Les cartes et listes doivent utiliser une sémantique `<ul>` / `<li>` propre.
  - Liens vers `/services` accessibles avec libellés explicites (`aria-label`).
- **DRY & Données :** La liste des compétences du marquee doit s'appuyer sur `SITE.skills` issu de `app/data/site.ts`.

### Fichiers modifiés et créés
- **`app/components/home/HomeStackMarquee.vue`** (NEW) : Composant bandeau défilant infini de la stack moderne.
- **`app/pages/index.vue`** (UPDATE) : Insertion du marquee, refonte complète de la section services en 3 offres ciblées, suppression des reliquats WordPress.

### Données & Textes exacts (Source : `sections-mapping.md` et `Home - Awwwards.html`)
- **Marquee items :**
  - Dérivés de `SITE.skills` : `TypeScript`, `Nuxt 4`, `Vue.js`, `NestJS`, `Node.js`, `PostgreSQL`, `TypeORM`, `Stripe Connect`, `Cypress`, `Docker`, `REST API`, `Vitest`.
  - Séparateur : `<span class="star" aria-hidden="true">✦</span>` en couleur `var(--accent)`.
- **Services (3 offres) :**
  1. `01 / 03` — `Création d'applications web & SaaS`
     - Proposition : `De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.`
     - Points : `Architecture logicielle & APIs REST`, `Applications Vue 3 / Nuxt 4 & NestJS`, `Intégration Stripe & PostgreSQL`.
     - Tags : `Nuxt`, `NestJS`, `PostgreSQL`, `Stripe Connect`.
  2. `02 / 03` (Featured) — `Développement Full Stack TypeScript`
     - Proposition : `Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.`
     - Points : `Composants Vue 3 / Nuxt avec TypeScript strict`, `Microservices & backend modulaire NestJS`, `Fiabilisation et optimisation des performances`.
     - Tags : `TypeScript`, `Vue 3`, `Nuxt`, `NestJS`, `Node.js`.
  3. `03 / 03` — `Évolution & Architecture applicative`
     - Proposition : `Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).`
     - Points : `Audits techniques de code & migrations de versions`, `Tests E2E Cypress & tests unitaires Vitest`, `Pipelines CI/CD & conteneurisation Docker`.
     - Tags : `Cypress`, `Vitest`, `Docker`, `CI/CD`.

## Dev Agent Record

### Agent Model Used
- Gemini 3.7 Flash

### Debug Log References
- Gate Docker validée avec 0 erreur ESLint / 0 erreur Stylelint / 0 erreur TypeScript (vue-tsc) / 13 routes SSG Nitro pré-rendues.

### Completion Notes List
- Implémentation du composant `HomeStackMarquee.vue` avec boucle infinie CSS, mask-image et `aria-hidden="true"`, pause au survol `:hover` et arrêt sous `prefers-reduced-motion: reduce`.
- Refonte de la vitrine des services sur `app/pages/index.vue` : suppression des reliquats WordPress, intégration des 3 offres ciblées Full Stack TypeScript avec tags `ZTag`, points livrables avec `ZIcon name="check"`, tarification indicative et liens explicites vers `/services`.
- Mise à jour de l'en-tête de section (`// ce que je propose` et `Trois expertises pour concevoir et faire évoluer vos applications`).
- Validation réussie de la suite complète d'outillage via Docker.

### File List
- `app/components/home/HomeStackMarquee.vue` (NEW)
- `app/pages/index.vue` (MODIFIED)

## References

- [Contrat canonique : docs/specs/spec-home-awwwards/SPEC.md]
- [Cartographie détaillée : docs/specs/spec-home-awwwards/sections-mapping.md]
- [Maquette prototype : docs/design_system/ui_kits/jouan-site/Home - Awwwards.html]
- [Profil Malt officiel : docs/contexte_malt.md]
- [Directives globales pour agents : AGENTS.md]
- [Leçons de la Story 11.2 : docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md]
--- site data ---
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
  email: string;
  city: string;
  available: boolean;
  maltUrl?: string;
}

export interface IProject {
  name: string;
  role: string;
  desc: string;
  url?: string;
  status?: string;
  tags: string[];
}

const profile: IProfile = {
  name: "Simon Jouan",
  role: "Développeur Full Stack TypeScript — Nuxt / NestJS",
  email: "simon@jouan.ovh",
  city: "Rouen, France",
  available: true,
  maltUrl: "https://www.malt.fr/profile/simonjouan",
};

// Stack technique moderne prioritaire ordonnée.
const skills: string[] = [
  "typescript",
  "nuxt",
  "vue",
  "nest.js",
  "node.js",
  "postgresql",
  "typeorm",
  "stripe",
  "cypress",
  "docker",
  "rest-api",
  "vitest",
];

const projects: IProject[] = [
  {
    name: "keova.app",
    role: "Co-fondateur & Développeur Full Stack",
    desc: "Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).",
    url: "https://keova.app",
    status: "En production",
    tags: ["nuxt", "nest.js", "postgresql", "stripe", "saas"],
  },
  {
    name: "TryOn",
    role: "CTO & Développeur Full Stack",
    desc: "Plateforme SaaS B2B d'essayage virtuel de vêtements via l'IA générative (diffusion models, microservices asynchrones, files Redis).",
    status: "Étude de cas (MVP livré)",
    tags: ["nuxt", "nest.js", "python", "comfyui", "ia"],
  },
  {
    name: "Nodium",
    role: "Créateur & Ingénieur IA",
    desc: "Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.",
    status: "R&D / En cours",
    tags: ["typescript", "electron", "agents", "ia"],
  },
];

export const SITE = { profile, skills, projects } as const;
--- index.vue (1-250) ---
<template>
  <main class="home">
    <ClientOnly>
      <HomeBootOverlay @boot-complete="onBootComplete" />
    </ClientOnly>
    <HomeAtmosComponent />
    <ZCustomCursor />

    <section class="hero hero__grad">
      <div class="hero__in container">
        <div class="hero__grid">
          <!-- Colonne gauche : accroche commerciale, badge dispo, CTAs -->
          <div class="anim hero__text">
            <p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>
            <h1 class="hero__title">Développeur Full Stack TypeScript</h1>
            <p class="hero__sub">
              Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De
              l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.
            </p>

            <div class="hero__badge-wrap">
              <span class="hero__pulse-dot" aria-hidden="true" />
              <span>Disponible pour missions freelance</span>
              <template v-if="SITE.profile.maltUrl">
                <span aria-hidden="true"> · </span>
                <ZExternalLink :href="SITE.profile.maltUrl"> Profil Malt vérifié </ZExternalLink>
              </template>
            </div>

            <div class="hero__cta">
              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
                Discuter de votre projet
                <template #iconRight><ZIcon name="arrow" /></template>
              </ZButton>
              <ZButton :as="NuxtLink" to="/about" variant="secondary" size="lg"> Voir le parcours &amp; CV </ZButton>
            </div>
          </div>

          <!-- Colonne droite : terminal hero cinétique -->
          <div class="anim hero__term-col">
            <HomeHeroTerminal :auto-start="isBootFinished" />
          </div>
        </div>
      </div>
    </section>

    <!-- Ruban défilant de la stack moderne (Story 11.3 / AC-1) -->
    <HomeStackMarquee />

    <!-- Vitrine des 3 services cibles (Story 11.3 / AC-2) -->
    <section class="section">
      <div class="container">
        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos applications</h2>
        <ul class="grid-3">
          <li v-for="service in services" :key="service.id">
            <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
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
              <div class="offer__price">
                <span>{{ service.price }}</span>
              </div>
              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
                En savoir plus →
              </NuxtLink>
            </ZCard>
          </li>
        </ul>
      </div>
    </section>

    <!-- Stats + projets sélectionnés — section en creux partagée (stories 3.2 / 3.3) -->
    <section class="section section--sunken">
      <div class="container">
        <div class="statrow">
          <div v-for="stat in stats" :key="stat.id" class="stat">
            <b>{{ stat.value }}</b>
            <span>{{ stat.label }}</span>
          </div>
        </div>

        <h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>
        <ul class="grid-2 projects">
          <li v-for="project in projects" :key="project.name">
            <ZCard
              class="project"
              :interactive="Boolean(project.url)"
              :data-hot="Boolean(project.url) ? '' : undefined"
              :as="project.url ? ZExternalLink : 'div'"
              :href="project.url || undefined"
              :rel="project.url ? 'noopener noreferrer' : undefined"
            >
              <div class="project__head">
                <h3 class="project__name">{{ project.name }}</h3>
                <span class="project__role">{{ project.role }}</span>
              </div>
              <p class="prose project__desc">{{ project.desc }}</p>
              <ul class="hero__tags">
                <li v-for="tag in project.tags" :key="tag">
                  <ZTag>{{ tag }}</ZTag>
                </li>
              </ul>
            </ZCard>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Page d'accueil — refonte Hero Full Stack TS & Terminal cinétique (Story 11.2).
// Architecture multi-pages Nuxt 4, dark-first, accent orange.
import { ref } from "vue";
import { NuxtLink, ZExternalLink } from "#components";
import { SITE } from "~/data/site";

const isBootFinished = ref(false);

function onBootComplete() {
  isBootFinished.value = true;
}

// Vitrine des 3 offres ciblées Full Stack TS (Story 11.3 / AC-2).
// Remplacement complet des données legacy.
const services = [
  {
    id: "creation",
    no: "01 / 03",
    icon: "code",
    title: "Création d'applications web & SaaS",
    desc: "De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.",
    points: [
      "Architecture logicielle & APIs REST",
      "Applications Vue 3 / Nuxt 4 & NestJS",
      "Intégration Stripe & PostgreSQL",
    ],
    tags: ["Nuxt", "NestJS", "PostgreSQL", "Stripe Connect"],
    price: "Sur devis / au sprint",
    featured: false,
  },
  {
    id: "fullstack",
    no: "02 / 03",
    icon: "layers",
    title: "Développement Full Stack TypeScript",
    desc: "Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.",
    points: [
      "Composants Vue 3 / Nuxt avec TypeScript strict",
      "Microservices & backend modulaire NestJS",
      "Fiabilisation et optimisation des performances",
    ],
    tags: ["TypeScript", "Vue 3", "Nuxt", "NestJS", "Node.js"],
    price: "Sur devis / TJM",
    featured: true,
  },
  {
    id: "evolution",
    no: "03 / 03",
    icon: "spark",
    title: "Évolution & Architecture applicative",
    desc: "Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).",
    points: [
      "Audits techniques de code & migrations de versions",
      "Tests E2E Cypress & tests unitaires Vitest",
      "Pipelines CI/CD & conteneurisation Docker",
    ],
    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
    price: "Au forfait / audit",
    featured: false,
  },
];

// Chiffres clés (data.js `stats`) — texte exact (séparateur ·), pas d'emoji.
const stats = [
  { id: "stat-1", value: "8+", label: "ans dans la tech" },
  { id: "stat-2", value: "3", label: "stacks maîtrisés" },
  { id: "stat-3", value: "1", label: "SaaS fondé · keova.app" },
];

// Projets sélectionnés — source unique `app/data/site.ts`. Cartes rendues en liens externes.
const projects = SITE.projects;

const siteUrl = useSiteUrl();
const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Simon Jouan — Développeur Full Stack TypeScript",
    url: siteUrl,
    description: SITE.profile.role,
  },
  {
    "@context": "https://schema.org",
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
];

usePageSeo({
  title: "Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS",
  description:
    "Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL.",
  path: "/",
  image: "/images/portrait.jpeg",
  type: "website",
  jsonLd: homeJsonLd,
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Home.jsx */
.home {
  display: block;
}

// Entrée one-shot (pas une boucle) — keyframe globale fade-rise (_root.scss).
.anim {
  animation: fade-rise var(--dur-slow) var(--ease-out) both;
}

.hero__term-col {
  // Décalage d'entrée fidèle à Home.jsx (animationDelay 80ms) — pas de token motion
  // équivalent (les --dur-* couvrent les transitions, pas les délais d'orchestration).
  animation-delay: 80ms;
}
--- index.vue (251-520) ---

// ---- Hero (porté de kit.css : .hero, .hero__grad, .hero__in, .hero__grid…) ----
.hero {
  position: relative;
  overflow: hidden;
}

.hero__grad {
  // Dégradés décoratifs dérivés des tokens (orange accent + aubergine saturé) via
  // color-mix — pas de valeur HSL en dur. Base = fond de page. Fidèle à kit.css
  // (.hero__grad : aubergine ~60 % de saturation → token --aubergine-vivid).
  background:
    radial-gradient(900px 500px at 78% -10%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%),
    radial-gradient(
      700px 500px at 0% 110%,
      color-mix(in srgb, var(--aubergine-vivid) 28%, transparent),
      transparent 60%
    ),
    var(--bg-page);
}

.hero__in {
  position: relative;
  z-index: 1;

  // padding-block uniquement : le gutter horizontal vient de .container
  // (longhands distincts → pas de conflit de shorthand entre les deux classes).
  padding-block: var(--space-20);
}

.hero__grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: var(--space-12);
  align-items: center;
}

// .section / .container / .eyebrow / .prose : primitives de layout globales
// (app/assets/scss/base/_layout.scss) — non redéclarées ici.

// ---- Colonne texte ----
.hero__title {
  font-family: var(--font-mono);
  font-size: var(--fs-6xl);
  font-weight: var(--fw-light);
  letter-spacing: var(--ls-tight);
  color: var(--text-strong);

  em {
    font-style: normal;
    color: var(--accent);
  }
}

.hero__sub {
  max-width: 46ch;
  margin: var(--space-5) 0 var(--space-6);
  font-family: var(--font-sans);
  font-size: var(--fs-lg);
  line-height: var(--lh-relaxed);
  color: var(--text-body);
}

.hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

// ---- Badge de disponibilité & CTAs ----
.hero__badge-wrap {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);

  a {
    color: var(--accent);
    text-decoration: underline;

    &:hover {
      color: var(--accent-hover);
    }

    &:focus-visible {
      outline: 2px solid transparent;
      outline-offset: 2px;
      box-shadow: var(--ring-accent);
    }
  }
}

.hero__pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-circle);
  background: var(--success);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 60%, transparent);
  animation: pulse-dot 2.2s infinite var(--ease-out);

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
}

@keyframes pulse-dot {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 60%, transparent);
  }

  70% {
    box-shadow: 0 0 0 6px color-mix(in srgb, var(--success) 0%, transparent);
  }

  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 0%, transparent);
  }
}

.section__title {
  margin-bottom: var(--space-8);
  font-family: var(--font-mono);
  font-size: var(--fs-3xl);
  font-weight: var(--fw-regular);
  color: var(--text-strong);
}

// ---- Aperçu services (porté de .grid-3 / .offer*) ----
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    display: flex;
  }
}

.offer {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.offer__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.offer__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-10); // 40px
  height: var(--space-10);

  // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
  // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
  font-size: 22px;
  color: var(--accent);
  background: var(--accent-soft);
  border-radius: var(--radius-md);
}

.offer__no {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: var(--ls-wider);
  color: var(--text-faint);
}

.offer__title {
  margin-bottom: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-xl);
  font-weight: var(--fw-regular);
  color: var(--text-strong);
}

.offer__desc {
  margin: 0 0 var(--space-4);
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  line-height: var(--lh-relaxed);
  color: var(--text-body);
}

.offer__points {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin: 0 0 var(--space-4);
  padding: 0;
  list-style: none;

  li {
    display: flex;
    gap: var(--space-2);
    align-items: flex-start;
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    line-height: var(--lh-normal);
    color: var(--text-muted);
  }
}

.offer__check {
  font-size: var(--fs-sm);
  color: var(--term-green);
  margin-top: 2px;
}

.offer__tags {
  margin-bottom: var(--space-4);
}

.offer__price {
  margin-top: auto;
  padding-top: var(--space-4);
  border-top: 1px dashed var(--border-subtle);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--accent);
}

.offer__more {
  margin-top: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--accent);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    // Outline transparent : rendu en couleur système sous forced-colors.
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
    border-radius: var(--radius-xs);
  }
}

// ---- Stats (porté de .statrow / .stat) ----
.statrow {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-12);

  // Espace avant le bloc projets (story 3.3), réf. Home.jsx (statrow marginBottom).
  margin-bottom: var(--space-12);
}

.stat {
  font-family: var(--font-mono);

  b {
    display: block;
    font-size: var(--fs-4xl);

2026-09-13T18:51:37.032011Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
exec
/bin/zsh -lc "sed -n '520,760p' app/pages/index.vue && printf '%s\\n' '--- card/tag/icon ---' && sed -n '1,240p' app/components/ui/ZCard.vue && sed -n '1,200p' app/components/ui/ZTag.vue && sed -n '1,240p' app/components/ui/ZIcon.vue && printf '%s\\n' '--- layout/root relevant ---' && rg -n -C 3 'grid-3|container|section|hero__tags|term-green|ring-accent|fs-xl|space-8|font-mono|focus-visible' app/assets/scss/base/_layout.scss app/assets/scss/abstract/_root.scss" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
    font-size: var(--fs-4xl);
    font-weight: var(--fw-light);
    color: var(--text-strong);
  }

  span {
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }
}

// ---- Projets sélectionnés (porté de StatsProjects / .grid-2 / .prose) ----
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    display: flex;
  }
}

.projects {
  margin-top: var(--space-5);
}

// Carte rendue en lien (`as="a"`) : neutralise le soulignement par défaut du
// <a> (le contenu porte ses propres couleurs/typo). ZCard reste générique.
.project {
  display: flex;
  flex-direction: column;
  width: 100%;
  text-decoration: none;

  .hero__tags {
    margin-top: auto;
  }
}

.project__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
}

.project__name {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-xl);
  font-weight: var(--fw-regular);
  color: var(--text-strong);
}

.project__role {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--text-muted);
  white-space: nowrap;
}

.project__desc {
  margin: var(--space-3) 0 var(--space-4);
  font-size: var(--fs-sm);
}

// ---- Responsive (cf. kit.css @media max-width: 900px) ----
@media (width <= 900px) {
  .hero__grid {
    grid-template-columns: 1fr;
  }

  .hero__title {
    font-size: var(--fs-4xl);
  }

  .grid-3,
  .grid-2 {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .anim {
    animation: none;
  }
}
</style>
--- card/tag/icon ---
<template>
  <component
    :is="as"
    v-bind="rootAttrs"
    class="zcard"
    :class="{
      'zcard--pad': padded,
      'zcard--interactive': interactive,
      'zcard--accent': accent,
      'zcard--featured': featured,
    }"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
// Primitive carte du DS — surface discrète, le contenu est le héros.
// Portée de docs/design_system/components/core/Card.jsx (pas de copie JS :
// le CSS d'injection `ensureStyles()` devient un <style scoped> token-only).
import type { Component } from "vue";
import { computed, useAttrs } from "vue";

defineOptions({
  inheritAttrs: false,
});

interface Props {
  /** Hover lift + bordure plus claire. @default false */
  interactive?: boolean;
  /** Barre d'accent orange→aubergine en haut. @default false */
  accent?: boolean;
  /** Anneau de glow orange (offre mise en avant). @default false */
  featured?: boolean;
  /** Padding interne `--space-6`. @default true */
  padded?: boolean;
  /** Élément rendu (polymorphe). @default "div" */
  as?: string | Component;
}

const props = withDefaults(defineProps<Props>(), {
  interactive: false,
  accent: false,
  featured: false,
  padded: true,
  as: "div",
});

const attrs = useAttrs();
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

.zcard--pad {
  padding: var(--space-6);
}

.zcard--interactive {
  cursor: pointer;

  &:hover {
    border-color: var(--border-strong);
    transform: translateY(-2px);
    box-shadow: var(--shadow-3), var(--shadow-hairline);
  }

  // Focus clavier : anneau d'accent visible. Quand la carte est rendue en lien
  // (`as="a"`, ex. cartes projet story 3.3), elle est focusable — sans cette règle,
  // aucun indicateur. Sans effet sur les cartes non focusables (div).
  &:focus-visible {
    // Outline transparent → rendu en couleur système sous forced-colors (où les
    // box-shadow disparaissent) ; le ring box-shadow reste le focus visuel normal.
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }
}

.zcard--accent::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
}

.zcard--featured {
  // Bordure orange translucide de mise en avant : --accent-ring (token le plus proche
  // de la réf. hsl(24 94% 53% / 0.35), même teinte accent en translucide).
  border-color: var(--accent-ring);
  box-shadow: var(--glow-accent), var(--shadow-hairline);
}

@media (prefers-reduced-motion: reduce) {
  .zcard {
    transition: none;
  }

  .zcard--interactive:hover {
    transform: none;
  }
}
</style>
<template>
  <span
    v-bind="rootAttrs"
    class="ztag"
    :class="{ 'ztag--plain': !hash, 'ztag--clickable': isClickable }"
    :role="clickableRole"
    :tabindex="clickableTabindex"
    @click="handleClick"
    @keydown.enter="handleKeyboardClick"
    @keydown.space="handleKeyboardClick"
  >
    <slot />
    <button v-if="isRemovable" type="button" class="ztag__remove" aria-label="Retirer" @click.stop="handleRemove">
      ×
    </button>
  </span>
</template>

<script setup lang="ts">
// Primitive tag du DS — chip pill mono avec préfixe "#" orange (techno / sujets).
// Porté de docs/design_system/components/core/Tag.jsx (CSS en <style scoped>, prerender-safe).
// API React → Vue : `onRemove`/`onClick` (callbacks React) deviennent des listeners
// détectés via les attrs (le `×` et l'état cliquable n'apparaissent que si fournis).
import { computed, getCurrentInstance, useAttrs } from "vue";

defineOptions({
  inheritAttrs: false,
});

interface Props {
  /** Affiche le préfixe "#". @default true */
  hash?: boolean;
}

withDefaults(defineProps<Props>(), {
  hash: true,
});

const emit = defineEmits<{
  click: [event: MouseEvent | KeyboardEvent];
  remove: [event: MouseEvent];
}>();

const attrs = useAttrs();
const instance = getCurrentInstance();

function hasListener(name: "onClick" | "onRemove") {
  const listener = instance?.vnode.props?.[name];
  return typeof listener === "function" || Array.isArray(listener);
}

const isClickable = computed(() => hasListener("onClick"));
const isRemovable = computed(() => hasListener("onRemove"));

const rootAttrs = computed(() => {
  if (!isClickable.value) {
    return attrs;
  }

  return Object.fromEntries(
    Object.entries(attrs).filter(([key]) => {
      return key !== "role" && key !== "tabindex" && key !== "tabIndex";
    }),
  );
});

const clickableRole = computed(() => {
  if (!isClickable.value) {
    return undefined;
  }

  return typeof attrs.role === "string" ? attrs.role : "button";
});

const clickableTabindex = computed(() => {
  if (!isClickable.value) {
    return undefined;
  }

  const tabindex = attrs.tabindex ?? attrs.tabIndex;
  return typeof tabindex === "string" || typeof tabindex === "number" ? tabindex : 0;
});

function handleClick(event: MouseEvent) {
  if (!isClickable.value) {
    return;
  }

  emit("click", event);
}

function handleKeyboardClick(event: KeyboardEvent) {
  if (!isClickable.value) {
    return;
  }

  event.preventDefault();
  emit("click", event);
}

function handleRemove(event: MouseEvent) {
  emit("remove", event);
}
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis Tag.jsx */
.ztag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  box-sizing: border-box;
  height: 26px;
  padding: 0 var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: var(--fw-regular);
  line-height: 1;
  white-space: nowrap;
  color: var(--text-body);
  background: var(--surface-2);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-pill);
  transition:
    border-color var(--dur-fast) var(--ease-standard),
    color var(--dur-fast) var(--ease-standard);

  &::before {
    content: "#";
    color: var(--accent);
  }
}

.ztag--plain::before {
  display: none;
  content: none;
}

.ztag--clickable {
  cursor: pointer;

  &:hover {
    border-color: var(--border-strong);
    color: var(--text-strong);
  }

  &:focus-visible {
    // Outline transparent → couleur système sous forced-colors (box-shadow neutralisée).
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }
}

.ztag__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-right: -2px;
  padding: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  line-height: 1;
  color: var(--text-muted);
  cursor: pointer;
  background: none;
  border: none;
  border-radius: var(--radius-circle);

  &:hover {
    color: var(--term-red);
  }

  &:focus-visible {
    // Outline transparent → couleur système sous forced-colors (box-shadow neutralisée).
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ztag {
    transition: none;
  }
}
</style>
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
--- layout/root relevant ---
app/assets/scss/base/_layout.scss-1-// ============================================================
app/assets/scss/base/_layout.scss-2-//  Primitives de layout du design system — GLOBALES
app/assets/scss/base/_layout.scss-3-//
app/assets/scss/base/_layout.scss:4://  .section / .section--sunken / .container / .eyebrow / .prose
app/assets/scss/base/_layout.scss-5-//  Portées de docs/design_system/ui_kits/jouan-site/kit.css.
app/assets/scss/base/_layout.scss-6-//  Mutualisées ici (chargées par main.scss) plutôt que redéclarées
app/assets/scss/base/_layout.scss-7-//  à l'identique en <style scoped> dans chaque page (index, services,
app/assets/scss/base/_layout.scss-8-//  about, …). Tokens uniquement — aucune valeur en dur (CAP-2).
app/assets/scss/base/_layout.scss-9-// ============================================================
app/assets/scss/base/_layout.scss-10-
app/assets/scss/base/_layout.scss:11:/* stylelint-disable selector-class-pattern -- convention DS BEM (.section--sunken) portée depuis kit.css */
app/assets/scss/base/_layout.scss-12-
app/assets/scss/base/_layout.scss:13:// Bloc de section vertical. padding-block uniquement : le gutter
app/assets/scss/base/_layout.scss:14:// horizontal vient de .container (enfant) — évite le conflit de
app/assets/scss/base/_layout.scss-15-// shorthand padding multi-axes (cf. project-context, piège story 3.1).
app/assets/scss/base/_layout.scss:16:.section {
app/assets/scss/base/_layout.scss-17-  padding-block: var(--space-16);
app/assets/scss/base/_layout.scss-18-}
app/assets/scss/base/_layout.scss-19-
app/assets/scss/base/_layout.scss-20-// Section en creux : fond teinté + filets haut/bas.
app/assets/scss/base/_layout.scss:21:.section--sunken {
app/assets/scss/base/_layout.scss-22-  background: var(--bg-sunken);
app/assets/scss/base/_layout.scss-23-  border-top: 1px solid var(--border-subtle);
app/assets/scss/base/_layout.scss-24-  border-bottom: 1px solid var(--border-subtle);
app/assets/scss/base/_layout.scss-25-}
app/assets/scss/base/_layout.scss-26-
app/assets/scss/base/_layout.scss-27-// Conteneur centré à largeur max ; gutter horizontal en longhand.
app/assets/scss/base/_layout.scss:28:.container {
app/assets/scss/base/_layout.scss-29-  width: 100%;
app/assets/scss/base/_layout.scss:30:  max-width: var(--container-xl);
app/assets/scss/base/_layout.scss-31-  margin: 0 auto;
app/assets/scss/base/_layout.scss-32-  padding-inline: var(--space-6);
app/assets/scss/base/_layout.scss-33-}
--
app/assets/scss/base/_layout.scss-36-// font-weight et line-height neutralisés pour un rendu identique sur <h2 class="eyebrow"> et <p class="eyebrow">.
app/assets/scss/base/_layout.scss-37-.eyebrow {
app/assets/scss/base/_layout.scss-38-  margin: 0 0 var(--space-3);
app/assets/scss/base/_layout.scss:39:  font-family: var(--font-mono);
app/assets/scss/base/_layout.scss-40-  font-size: var(--fs-xs);
app/assets/scss/base/_layout.scss-41-  font-weight: var(--fw-regular);
app/assets/scss/base/_layout.scss-42-  line-height: var(--lh-relaxed);
--
app/assets/scss/base/_layout.scss-59-
app/assets/scss/base/_layout.scss-60-// Rangée de tags (chips) qui passent à la ligne — hero, stack /about, etc.
app/assets/scss/base/_layout.scss-61-// Reset de liste inclus pour un rendu propre en <ul>/<li> (no-op sur un <div>).
app/assets/scss/base/_layout.scss:62:.hero__tags {
app/assets/scss/base/_layout.scss-63-  display: flex;
app/assets/scss/base/_layout.scss-64-  flex-wrap: wrap;
app/assets/scss/base/_layout.scss-65-  gap: var(--space-2);
--
app/assets/scss/base/_layout.scss-74-  display: flex;
app/assets/scss/base/_layout.scss-75-  gap: var(--space-3);
app/assets/scss/base/_layout.scss-76-  align-items: center;
app/assets/scss/base/_layout.scss:77:  font-family: var(--font-mono);
app/assets/scss/base/_layout.scss-78-  font-size: var(--fs-xs);
app/assets/scss/base/_layout.scss-79-
app/assets/scss/base/_layout.scss-80-  // Contraste (story 9.2) : méta d'article (date · lecture) = info réelle → palier
--
app/assets/scss/abstract/_root.scss-30-
app/assets/scss/abstract/_root.scss-31-  // ---- Rampe de surfaces neutres (teintées aubergine, sombre→clair) ----
app/assets/scss/abstract/_root.scss-32-  --surface-0: hsl(320deg 30% 6%); // fond de page, le plus profond
app/assets/scss/abstract/_root.scss:33:  --surface-1: hsl(319deg 22% 9%); // sections en creux
app/assets/scss/abstract/_root.scss-34-  --surface-2: hsl(318deg 18% 12%); // cartes / panneaux
app/assets/scss/abstract/_root.scss-35-  --surface-3: hsl(317deg 16% 16%); // éléments surélevés / hover
app/assets/scss/abstract/_root.scss-36-  --surface-4: hsl(316deg 14% 21%); // popovers, inputs
--
app/assets/scss/abstract/_root.scss-48-  --ink-on-accent: hsl(320deg 60% 5%); // texte sombre sur orange
app/assets/scss/abstract/_root.scss-49-
app/assets/scss/abstract/_root.scss-50-  // ---- Palette terminale / syntaxe ----
app/assets/scss/abstract/_root.scss:51:  --term-green: hsl(143deg 60% 52%); // prompt, succès
app/assets/scss/abstract/_root.scss-52-  --term-blue: hsl(204deg 72% 62%); // répertoires, liens
app/assets/scss/abstract/_root.scss-53-  --term-cyan: hsl(186deg 64% 56%);
app/assets/scss/abstract/_root.scss-54-  --term-red: hsl(0deg 85% 64%);
--
app/assets/scss/abstract/_root.scss-91-  --accent-2-soft: hsl(319deg 40% 30% / 28%);
app/assets/scss/abstract/_root.scss-92-  --border-terminal: hsl(319deg 40% 30% / 40%); // bordure fenêtre terminal (TerminalWindow.jsx)
app/assets/scss/abstract/_root.scss-93-  --link: var(--term-blue);
app/assets/scss/abstract/_root.scss:94:  --prompt: var(--term-green);
app/assets/scss/abstract/_root.scss-95-  --overlay: hsl(320deg 60% 3% / 66%);
app/assets/scss/abstract/_root.scss-96-  --selection: hsl(24deg 94% 53% / 28%);
app/assets/scss/abstract/_root.scss-97-
app/assets/scss/abstract/_root.scss-98-  // ============================================================
app/assets/scss/abstract/_root.scss-99-  //  Typographie
app/assets/scss/abstract/_root.scss-100-  // ============================================================
app/assets/scss/abstract/_root.scss:101:  --font-mono: "Ubuntu Mono", "SF Mono", ui-monospace, monospace;
app/assets/scss/abstract/_root.scss-102-  --font-sans: "Ubuntu", system-ui, -apple-system, "Segoe UI", sans-serif;
app/assets/scss/abstract/_root.scss:103:  --font-display: var(--font-mono);
app/assets/scss/abstract/_root.scss-104-
app/assets/scss/abstract/_root.scss-105-  // Tailles de police (échelle px : 12 14 16 18 20 24 28 32 40 48 56)
app/assets/scss/abstract/_root.scss-106-  --fs-xs: 0.75rem; // 12
--
app/assets/scss/abstract/_root.scss-108-  --fs-base: 1rem; // 16
app/assets/scss/abstract/_root.scss-109-  --fs-md: 1.125rem; // 18
app/assets/scss/abstract/_root.scss-110-  --fs-lg: 1.25rem; // 20
app/assets/scss/abstract/_root.scss:111:  --fs-xl: 1.5rem; // 24
app/assets/scss/abstract/_root.scss-112-  --fs-2xl: 1.75rem; // 28
app/assets/scss/abstract/_root.scss-113-  --fs-3xl: 2rem; // 32
app/assets/scss/abstract/_root.scss-114-  --fs-4xl: 2.5rem; // 40
--
app/assets/scss/abstract/_root.scss-143-  --space-4: 1rem; // 16
app/assets/scss/abstract/_root.scss-144-  --space-5: 1.25rem; // 20
app/assets/scss/abstract/_root.scss-145-  --space-6: 1.5rem; // 24
app/assets/scss/abstract/_root.scss:146:  --space-8: 2rem; // 32
app/assets/scss/abstract/_root.scss-147-  --space-10: 2.5rem; // 40
app/assets/scss/abstract/_root.scss-148-  --space-12: 3rem; // 48
app/assets/scss/abstract/_root.scss-149-  --space-16: 4rem; // 64
--
app/assets/scss/abstract/_root.scss-151-  --space-24: 6rem; // 96
app/assets/scss/abstract/_root.scss-152-
app/assets/scss/abstract/_root.scss-153-  // Layout
app/assets/scss/abstract/_root.scss:154:  --container-sm: 640px;
app/assets/scss/abstract/_root.scss:155:  --container-md: 768px;
app/assets/scss/abstract/_root.scss:156:  --container-lg: 992px;
app/assets/scss/abstract/_root.scss:157:  --container-xl: 1200px;
app/assets/scss/abstract/_root.scss:158:  --container-2xl: 1400px;
app/assets/scss/abstract/_root.scss-159-  --header-height: 56px;
app/assets/scss/abstract/_root.scss-160-  --footer-height: 56px;
app/assets/scss/abstract/_root.scss-161-  --gutter: var(--space-6);
--
app/assets/scss/abstract/_root.scss-188-  --glow-terminal: 0 12px 40px hsl(319deg 100% 9% / 70%), 0 0 0 1px hsl(319deg 40% 40% / 30%);
app/assets/scss/abstract/_root.scss-189-
app/assets/scss/abstract/_root.scss-190-  // Anneau de focus
app/assets/scss/abstract/_root.scss:191:  --ring-accent: 0 0 0 3px var(--accent-ring);
app/assets/scss/abstract/_root.scss-192-
app/assets/scss/abstract/_root.scss-193-  // ============================================================
app/assets/scss/abstract/_root.scss-194-  //  Motion — easings sobres et mécaniques (esprit terminal)

2026-09-13T18:51:42.338938Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
exec
/bin/zsh -lc "sed -n '1,240p' app/pages/services.vue && printf '%s\\n' '--- raw prior review outputs (for context only) ---' && sed -n '1,220p' docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md && printf '%s\\n' '--- raw blind hunter ---' && sed -n '1,260p' docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <main class="services">
    <!-- En-tête + grille d'offres (story 4.1). La 2e section (process) viendra en 4.2. -->
    <section class="section">
      <div class="container">
        <p class="eyebrow"><span aria-hidden="true">// </span>services</p>
        <h1 class="services__title">Des prestations claires, pensées comme des produits.</h1>
        <p class="prose services__intro">
          Du site WordPress à l'application sur-mesure, en passant par l'IA appliquée — je m'occupe de la technique,
          vous gardez la main sur votre projet.
        </p>

        <ul class="grid-3">
          <li v-for="offer in offers" :key="offer.id">
            <ZCard class="offer" :accent="offer.featured" :featured="offer.featured">
              <div v-if="offer.featured" class="offer__badge">
                <ZBadge tone="accent">Le plus demandé</ZBadge>
              </div>
              <div class="offer__icon"><ZIcon :name="offer.icon" /></div>
              <h2 class="offer__title">{{ offer.title }}</h2>
              <p class="offer__desc">{{ offer.desc }}</p>
              <ul class="offer__points">
                <li v-for="point in offer.points" :key="point">{{ point }}</li>
              </ul>
              <div class="offer__price">
                <b>{{ offer.price }}</b>
              </div>
              <div class="offer__cta">
                <ZButton
                  :as="NuxtLink"
                  to="/contact"
                  :variant="offer.featured ? 'primary' : 'secondary'"
                  :aria-label="`Discuter du projet — ${offer.title}`"
                  class="offer__btn"
                >
                  Discuter du projet
                </ZButton>
              </div>
            </ZCard>
          </li>
        </ul>
      </div>
    </section>

    <!-- Section process : 4 étapes ordonnées + CTA (story 4.2). Porté de Services.jsx L45-61. -->
    <section class="section section--sunken">
      <div class="container">
        <p class="eyebrow"><span aria-hidden="true">// </span>comment ça se passe</p>
        <h2 class="process__title">Un déroulé simple en quatre temps</h2>

        <ol class="process">
          <li v-for="step in steps" :key="step.n" class="process__step">
            <div class="process__num" aria-hidden="true">{{ step.n }}</div>
            <h3 class="process__step-title">{{ step.title }}</h3>
            <p class="prose process__desc">{{ step.desc }}</p>
          </li>
        </ol>

        <div class="process__cta">
          <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
            Me parler de votre besoin
            <template #iconRight><ZIcon name="arrow" /></template>
          </ZButton>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Page Services : catalogue d'offres packagées + process 4 étapes + CTA contact.
// Données statiques (3 offres, 4 étapes) déclarées localement. Prerender-safe, dark-first.
import { NuxtLink } from "#components";
import { SITE } from "~/data/site";

interface Offer {
  /** Clé v-for stable (indépendante du contenu affiché). */
  id: string;
  /** Nom d'icône dans le set ZIcon (story 2.7). */
  icon: string;
  title: string;
  desc: string;
  points: string[];
  price: string;
  /** Offre mise en avant : carte accent + glow + badge. */
  featured: boolean;
}

// Contenu repris à l'identique de data.js (window.SITE.services) — 1re personne,
// vouvoiement, pas d'emoji. « Applications web » est l'offre mise en avant.
const offers: Offer[] = [
  {
    id: "wordpress",
    icon: "wp",
    title: "WordPress sur-mesure",
    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
    points: ["Thème sur-mesure (press-wind / Tailwind)", "Plugins & blocs Gutenberg", "Performance & SEO technique"],
    price: "à partir de 1 500 €",
    featured: false,
  },
  {
    id: "apps",
    icon: "code",
    title: "Applications web",
    desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.",
    points: ["API REST / GraphQL (Symfony · Nest.js)", "Front Vue / Nuxt", "Tests & CI/CD, qualité QA"],
    price: "sur devis",
    featured: true,
  },
  {
    id: "ia",
    icon: "spark",
    title: "IA & automatisation",
    desc: "L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.",
    points: ["Agents & workflows (n8n)", "Intégration d'API LLM", "Automatisation de contenu"],
    price: "sur devis",
    featured: false,
  },
];

// Étapes du process — texte repris à l'identique de Services.jsx (tableau `steps`,
// pas dans data.js). L'ordre du tableau garantit l'affichage 01 → 04 (AC #1).
// `n` (numéro affiché) sert aussi de clé v-for stable et unique.
const steps = [
  { n: "01", title: "Échange", desc: "On cadre le besoin, le périmètre et le budget — sans jargon inutile." },
  { n: "02", title: "Conception", desc: "Architecture, maquette, et plan de livraison clair." },
  { n: "03", title: "Développement", desc: "Code propre, testé, livré par itérations visibles." },
  { n: "04", title: "Livraison & suivi", desc: "Mise en ligne, documentation, et accompagnement." },
];

const siteUrl = useSiteUrl();

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Services — jouan.ovh",
  description:
    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
  url: `${siteUrl}/services`,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: offers.map((offer, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: offer.title,
        description: offer.desc,
        provider: {
          "@type": "Organization",
          "@id": `${siteUrl}/#organization`,
          name: SITE.profile.name,
        },
        offers: {
          "@type": "Offer",
          description: offer.price,
        },
      },
    })),
  },
};

usePageSeo({
  title: "Services — jouan.ovh",
  description:
    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
  path: "/services",
  image: "/images/portrait.jpeg",
  type: "website",
  jsonLd: servicesJsonLd,
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Services.jsx */
.services {
  display: block;
}

// .section / .section--sunken / .container / .eyebrow / .prose : primitives de
// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.

// ---- En-tête (porté de Services.jsx L13-21) ----
.services__title {
  max-width: 16ch;
  margin-bottom: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-4xl);
  font-weight: var(--fw-light);
  line-height: var(--lh-tight);
  color: var(--text-strong);
}

.services__intro {
  max-width: 60ch;
  margin-bottom: var(--space-10);
  color: var(--text-muted);
}

// ---- Grille des offres (porté de kit.css : .grid-3 / .offer*) ----
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    display: flex;
  }
}

// `display:flex` (porté de l'inline JSX) : le prix + CTA sont poussés en bas via
// `margin-top: auto`, alignant les pieds de carte sur des hauteurs inégales.
.offer {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.offer__badge {
  margin-bottom: var(--space-3);
}

.offer__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-10); // 40px
  height: var(--space-10);
  margin-bottom: var(--space-4);

  // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
  // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
  font-size: 22px;
  color: var(--accent);
  background: var(--accent-soft);
  border-radius: var(--radius-md);
}
--- raw prior review outputs (for context only) ---
Reading prompt from stdin...
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: high
reasoning summaries: none
session id: 01a09c1b-ec92-7d73-b158-11b0060d0a7e
--------
user
# Acceptance Auditor Prompt — Story 11.3

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md`
- Context specs: `docs/planning-artifacts/epics.md` (Epic 11 / Story 11.3), `docs/project-context.md`, `docs/specs/spec-home-awwwards/SPEC.md`, `AGENTS.md`
- Diff file: `docs/implementation-artifacts/code-reviews/11-3/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
Je vais comparer directement le diff aux critères de la Story 11.3 et aux contraintes de contexte, puis restituer uniquement les écarts constatés sous forme de liste Markdown.
exec
/bin/zsh -lc "wc -l \"docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md\" && sed -n '1,260p' \"docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md\"" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     144 docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md
---
baseline_commit: edfab0ecf3859790926fdae447ce7256a2f03565
---

# Story 11.3: Marquee de stack moderne & Vitrine des 3 services cibles

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur explorant la page d'accueil,
I want observer le défilé continu de la stack moderne maîtrisée et découvrir les 3 cartes d'offres de services,
so that j'identifie clairement les compétences techniques et accède au détail des prestations sur la page dédiée `/services` (FR21, FR22, FR26, UX-DR21, UX-DR22, CAP-4, CAP-5).

## Acceptance Criteria

1. **Given** la stack moderne définie dans `app/data/site.ts` (`SITE.skills`)
   **When** le visiteur visualise la zone située immédiatement sous le Hero
   **Then** le composant `HomeStackMarquee.vue` affiche un bandeau défilant continu en pur CSS (animation `scroll-x` avec masque d'atténuation horizontal `mask-image: linear-gradient(...)`)
   **And** les compétences sont affichées avec un séparateur visuel distinctif (étoile accent `✦` ou puce stylisée)
   **And** le défilement se met automatiquement en pause au survol de la souris (`:hover`)
   **And** le ruban animé est masqué aux technologies d'assistance (`aria-hidden="true"`) pour éviter la pollution sonore des lecteurs d'écran
   **And** sous `@media (prefers-reduced-motion: reduce)`, l'animation est totalement arrêtée (`animation: none`), les éléments restent alignés proprement sans débordement horizontal (`overflow: hidden`).

2. **Given** la section des services sur `app/pages/index.vue`
   **When** le visiteur découvre la vitrine d'offres
   **Then** l'en-tête de section affiche :
     - Eyebrow : `<p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>`
     - Titre de section : `<h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos applications</h2>`
   **And** la grille présente exactement 3 cartes `ZCard` orientées Full Stack TypeScript & SaaS :
     - **Carte 1 — Création d'applications web & SaaS** (`01 / 03`) :
       - Proposition de valeur : `De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.`
       - Points livrables clés avec icône de validation : Architecture logicielle & APIs REST, Applications Vue 3 / Nuxt 4 & NestJS, Intégration Stripe & PostgreSQL.
       - Tags technologiques : `Nuxt`, `NestJS`, `PostgreSQL`, `Stripe Connect`.
       - Tarif indicatif : `Sur devis / au sprint`.
     - **Carte 2 — Développement Full Stack TypeScript** (`02 / 03`, carte vedette / `featured`) :
       - Proposition de valeur : `Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.`
       - Points livrables clés avec icône de validation : Composants Vue 3 / Nuxt avec TypeScript strict, Microservices & backend modulaire NestJS, Fiabilisation et optimisation des performances.
       - Tags technologiques : `TypeScript`, `Vue 3`, `Nuxt`, `NestJS`, `Node.js`.
       - Tarif indicatif : `Sur devis / TJM`.
     - **Carte 3 — Évolution & Architecture applicative** (`03 / 03`) :
       - Proposition de valeur : `Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).`
       - Points livrables clés avec icône de validation : Audits techniques de code & migrations de versions, Tests E2E Cypress & tests unitaires Vitest, Pipelines CI/CD & conteneurisation Docker.
       - Tags technologiques : `Cypress`, `Vitest`, `Docker`, `CI/CD`.
       - Tarif indicatif : `Au forfait / audit`.
   **And** chaque carte ou lien d'approfondissement cible directement la route `/services` (aucune ancre intra-page `#`).

3. **Given** le template `app/pages/index.vue`
   **When** les nouvelles sections sont intégrées
   **Then** les anciennes données de services legacy (`wordpress`, `apps`, `ia` de l'ancien portfolio) et leur code mort sont intégralement supprimés du script et du template de la page d'accueil.

4. **Given** l'ensemble des intégrations de la story
   **When** on exécute la gate de validation Docker
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript, et 13 routes statiques générées avec succès par Nitro.

## Tasks / Subtasks

- [x] Tâche 1 — Création du composant `app/components/home/HomeStackMarquee.vue` (AC: 1)
  - [x] Définir la structure de template (`.marquee`, `.marquee__track`, `.marquee__item`, séparateur `.star` avec symbole `✦`).
  - [x] Consommer les compétences directement depuis `SITE.skills` (`app/data/site.ts`) et formater les libellés de stack pour l'affichage (ex. TypeScript, Nuxt 4, Vue.js, NestJS, Node.js, PostgreSQL, TypeORM, Stripe Connect, Cypress, Docker, REST API, Vitest).
  - [x] Doubler la liste des items dans le track pour assurer une boucle infinie continue sans à-coup visuel.
  - [x] Configurer l'animation CSS `@keyframes scroll-x` avec masquage horizontal `mask-image` et pause au survol (`:hover`).
  - [x] Appliquer `aria-hidden="true"` sur le conteneur décoratif et neutraliser l'animation sous `@media (prefers-reduced-motion: reduce)`.
  - [x] Styliser en SCSS scoped avec les tokens du Design System (`--border-subtle`, `--space-5`, `--space-8`, `--font-mono`, `--fs-xl`, `--text-faint`, `--text-body`, `--accent`, `--fw-regular`, `--ls-wide`).

- [x] Tâche 2 — Refonte de la vitrine des 3 services dans `app/pages/index.vue` (AC: 2, 3)
  - [x] Supprimer le tableau de données legacy `services` (WordPress, etc.) de `app/pages/index.vue`.
  - [x] Déclarer les 3 offres ciblées Full Stack TS (`creation`, `fullstack`, `evolution`) avec leur numérotation (`01 / 03`), description, points livrables, tags et liens vers `/services`.
  - [x] Baliser les cartes avec `ZCard` (support de `:accent="service.featured"` et `:featured="service.featured"`).
  - [x] Baliser la liste de points avec `<ul>` et `<li>`, utilisant une icône de validation accessible.
  - [x] Assurer que chaque lien d'action pointe vers `/services` (`<NuxtLink to="/services">`).

- [x] Tâche 3 — Intégration et disposition sur `app/pages/index.vue` (AC: 1, 2, 3)
  - [x] Placer `<HomeStackMarquee />` sous le hero commercial `.hero` et avant la section des services.
  - [x] Mettre à jour l'eyebrow de section (`// ce que je propose`) et le titre `h2`.
  - [x] Vérifier la cohérence responsive (grille 3 colonnes sur desktop, 1 colonne sous 860px) et l'espacement avec les primitives globales (`.section`, `.container`).

- [x] Tâche 4 — Validation qualité & Gate Docker (AC: 4)
  - [x] Exécuter la suite de validation Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [x] Vérifier la propreté du rendu, l'absence de régression d'hydratation et le comportement au clavier (`Tab`, `:focus-visible`).
  - [x] Vérifier l'arrêt complet du défilement sous `prefers-reduced-motion: reduce`.

## Dev Notes

### Architecture & Contraintes d'environnement
- **Environnement Docker STRICT :** Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. Ne jamais lancer `pnpm` sur la machine hôte macOS. [Source: AGENTS.md#Section 2]
- **Tokens CSS & Design System :** Aucune couleur ou espacement en dur. Consommer exclusivement les variables de tokens exposées dans `:root` (`var(--border-subtle)`, `var(--surface-1)`, `var(--text-strong)`, `var(--text-muted)`, `var(--accent)`, `var(--success)`, etc.). [Source: AGENTS.md#Section 3]
- **Accessibilité (a11y) :**
  - Le marquee est décoratif et en boucle continue : il DOIT porter `aria-hidden="true"`.
  - Respect strict de `prefers-reduced-motion: reduce` : l'animation de défilement doit être désactivée (`animation: none`).
  - Les cartes et listes doivent utiliser une sémantique `<ul>` / `<li>` propre.
  - Liens vers `/services` accessibles avec libellés explicites (`aria-label`).
- **DRY & Données :** La liste des compétences du marquee doit s'appuyer sur `SITE.skills` issu de `app/data/site.ts`.

### Fichiers modifiés et créés
- **`app/components/home/HomeStackMarquee.vue`** (NEW) : Composant bandeau défilant infini de la stack moderne.
- **`app/pages/index.vue`** (UPDATE) : Insertion du marquee, refonte complète de la section services en 3 offres ciblées, suppression des reliquats WordPress.

### Données & Textes exacts (Source : `sections-mapping.md` et `Home - Awwwards.html`)
- **Marquee items :**
  - Dérivés de `SITE.skills` : `TypeScript`, `Nuxt 4`, `Vue.js`, `NestJS`, `Node.js`, `PostgreSQL`, `TypeORM`, `Stripe Connect`, `Cypress`, `Docker`, `REST API`, `Vitest`.
  - Séparateur : `<span class="star" aria-hidden="true">✦</span>` en couleur `var(--accent)`.
- **Services (3 offres) :**
  1. `01 / 03` — `Création d'applications web & SaaS`
     - Proposition : `De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.`
     - Points : `Architecture logicielle & APIs REST`, `Applications Vue 3 / Nuxt 4 & NestJS`, `Intégration Stripe & PostgreSQL`.
     - Tags : `Nuxt`, `NestJS`, `PostgreSQL`, `Stripe Connect`.
  2. `02 / 03` (Featured) — `Développement Full Stack TypeScript`
     - Proposition : `Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.`
     - Points : `Composants Vue 3 / Nuxt avec TypeScript strict`, `Microservices & backend modulaire NestJS`, `Fiabilisation et optimisation des performances`.
     - Tags : `TypeScript`, `Vue 3`, `Nuxt`, `NestJS`, `Node.js`.
  3. `03 / 03` — `Évolution & Architecture applicative`
     - Proposition : `Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).`
     - Points : `Audits techniques de code & migrations de versions`, `Tests E2E Cypress & tests unitaires Vitest`, `Pipelines CI/CD & conteneurisation Docker`.
     - Tags : `Cypress`, `Vitest`, `Docker`, `CI/CD`.

## Dev Agent Record

### Agent Model Used
- Gemini 3.7 Flash

### Debug Log References
- Gate Docker validée avec 0 erreur ESLint / 0 erreur Stylelint / 0 erreur TypeScript (vue-tsc) / 13 routes SSG Nitro pré-rendues.

### Completion Notes List
- Implémentation du composant `HomeStackMarquee.vue` avec boucle infinie CSS, mask-image et `aria-hidden="true"`, pause au survol `:hover` et arrêt sous `prefers-reduced-motion: reduce`.
- Refonte de la vitrine des services sur `app/pages/index.vue` : suppression des reliquats WordPress, intégration des 3 offres ciblées Full Stack TypeScript avec tags `ZTag`, points livrables avec `ZIcon name="check"`, tarification indicative et liens explicites vers `/services`.
- Mise à jour de l'en-tête de section (`// ce que je propose` et `Trois expertises pour concevoir et faire évoluer vos applications`).
- Validation réussie de la suite complète d'outillage via Docker.

### File List
- `app/components/home/HomeStackMarquee.vue` (NEW)
- `app/pages/index.vue` (MODIFIED)

## References

- [Contrat canonique : docs/specs/spec-home-awwwards/SPEC.md]
- [Cartographie détaillée : docs/specs/spec-home-awwwards/sections-mapping.md]
- [Maquette prototype : docs/design_system/ui_kits/jouan-site/Home - Awwwards.html]
- [Profil Malt officiel : docs/contexte_malt.md]
- [Directives globales pour agents : AGENTS.md]
- [Leçons de la Story 11.2 : docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md]

exec
/bin/zsh -lc "wc -l \"docs/planning-artifacts/epics.md\" && sed -n '1,260p' \"docs/planning-artifacts/epics.md\"" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     789 docs/planning-artifacts/epics.md
---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments:
  - docs/specs/spec-design-system-revamp/SPEC.md
  - docs/specs/spec-design-system-revamp/pages.md
  - docs/specs/spec-design-system-revamp/primitives.md
  - docs/project-context.md
  - docs/implementation-artifacts/deferred-work.md
  - docs/implementation-artifacts/epic-9-retro-2026-06-29.md
  - docs/specs/spec-home-awwwards/SPEC.md
  - docs/specs/spec-home-awwwards/sections-mapping.md
  - docs/specs/spec-home-awwwards/.decision-log.md
  - docs/contexte_malt.md
  - docs/direction_strategique_site.md
  - AGENTS.md
---

# jouan.ovh - Epic Breakdown

## Overview

Ce document décompose la refonte de jouan.ovh sur le nouveau design system
(contrat : `SPEC-design-system-revamp`) en épics et stories implémentables.
Sources : SPEC.md (capacités/contraintes), pages.md + primitives.md (UX),
project-context.md (technique).

## Requirements Inventory

### Functional Requirements

FR1: Migrer le projet vers une stack à jour (Nuxt 4, abandon de `@nuxt/bridge-edge`, deps actuelles) avant toute refonte visuelle. _(CAP-1)_
FR2: Rendre les tokens du design system (couleurs, typo, espacement, rayons, élévation, motion, polices) disponibles comme source unique de vérité du style. _(CAP-2)_
FR3: Recréer les primitives du DS en composants Vue 3 réutilisables. _(CAP-3)_
FR4: Refondre le châssis global (header fixe, footer, navigation, liens sociaux hexagonaux). _(CAP-4)_
FR5: Page d'accueil = hero Terminal (A) + aperçu services + stats + projets sélectionnés. _(CAP-5)_
FR6: Page Services = 3 offres (WordPress / Applications web / IA) + étapes du process (route `/services`). _(CAP-6)_
--- raw blind hunter ---
Reading prompt from stdin...
2026-09-13T18:51:07.099915Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: high
reasoning summaries: none
session id: 01a09c1b-dfa6-7451-962a-c12d25465395
--------
user
# Blind Hunter Prompt — Story 11.3

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/11-3/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise `bmad-review-adversarial-general` pour auditer le diff de Story 11.3 avec le niveau de scepticisme demandé, puis je vérifierai que la sortie contient au moins dix constats formulés uniquement comme descriptions.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.agents/skills/bmad-review-adversarial-general/SKILL.md && printf '\\n--- DIFF ---\\n' && sed -n '1,260p' docs/implementation-artifacts/code-reviews/11-3/full.diff" in /Users/simon/dev/jouan.ovh
 exited 1 in 0ms:
sed: /Users/simon/.agents/skills/bmad-review-adversarial-general/SKILL.md: No such file or directory

codex
Le chemin raccourci initial ne correspond pas à l’emplacement réel de cette compétence dans l’environnement. Je poursuis avec la copie disponible sous `/Users/simon/.codex/skills`, puis j’examine le diff.
exec
/bin/zsh -lc "sed -n '1,260p' /Users/simon/.codex/skills/bmad-review-adversarial-general/SKILL.md && printf '\\n--- DIFF ---\\n' && sed -n '1,320p' docs/implementation-artifacts/code-reviews/11-3/full.diff" in /Users/simon/dev/jouan.ovh
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

--- DIFF ---
diff --git a/app/components/home/HomeStackMarquee.vue b/app/components/home/HomeStackMarquee.vue
new file mode 100644
index 0000000..a65ef1e
--- /dev/null
+++ b/app/components/home/HomeStackMarquee.vue
@@ -0,0 +1,108 @@
+<template>
+  <div class="marquee" aria-hidden="true">
+    <div class="marquee__track">
+      <!-- Première passe -->
+      <span v-for="(skill, index) in skillsList" :key="`skill-a-${index}`" class="marquee__item">
+        <b class="marquee__label">{{ skill }}</b>
+        <span class="marquee__star" aria-hidden="true">✦</span>
+      </span>
+      <!-- Deuxième passe pour la boucle infinie CSS sans coupure -->
+      <span v-for="(skill, index) in skillsList" :key="`skill-b-${index}`" class="marquee__item">
+        <b class="marquee__label">{{ skill }}</b>
+        <span class="marquee__star" aria-hidden="true">✦</span>
+      </span>
+    </div>
+  </div>
+</template>
+
+<script setup lang="ts">
+// Ruban défilant continu de la stack moderne prioritaire (Story 11.3 / AC-1 / CAP-4).
+// Alimenté par SITE.skills (app/data/site.ts) avec mapping soigné des libellés.
+// Défilement continu pur CSS masqué aux lecteurs d'écran (aria-hidden="true").
+// Pause automatique au :hover et arrêt complet sous prefers-reduced-motion.
+import { computed } from "vue";
+import { SITE } from "~/data/site";
+
+const SKILL_LABEL_MAP: Record<string, string> = {
+  typescript: "TypeScript",
+  nuxt: "Nuxt 4",
+  vue: "Vue.js",
+  "nest.js": "NestJS",
+  "node.js": "Node.js",
+  postgresql: "PostgreSQL",
+  typeorm: "TypeORM",
+  stripe: "Stripe Connect",
+  cypress: "Cypress",
+  docker: "Docker",
+  "rest-api": "REST API",
+  vitest: "Vitest",
+};
+
+const skillsList = computed(() => {
+  return SITE.skills.map((skillKey) => SKILL_LABEL_MAP[skillKey] ?? skillKey);
+});
+</script>
+
+<style lang="scss" scoped>
+/* stylelint-disable selector-class-pattern */
+.marquee {
+  display: block;
+  width: 100%;
+  padding-block: var(--space-5);
+  overflow: hidden;
+  border-block: 1px solid var(--border-subtle);
+  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
+
+  &:hover .marquee__track {
+    animation-play-state: paused;
+  }
+}
+
+.marquee__track {
+  display: flex;
+  gap: var(--space-8);
+  width: max-content;
+  will-change: transform;
+  animation: scroll-x 32s linear infinite;
+}
+
+.marquee__item {
+  display: inline-flex;
+  gap: var(--space-8);
+  align-items: center;
+  font-family: var(--font-mono);
+  font-size: var(--fs-xl);
+  letter-spacing: var(--ls-wide);
+  color: var(--text-faint);
+  white-space: nowrap;
+}
+
+.marquee__label {
+  font-weight: var(--fw-regular);
+  color: var(--text-body);
+}
+
+.marquee__star {
+  color: var(--accent);
+}
+
+@keyframes scroll-x {
+  from {
+    transform: translateX(0);
+  }
+
+  to {
+    transform: translateX(-50%);
+  }
+}
+
+@media (prefers-reduced-motion: reduce) {
+  .marquee {
+    mask-image: none;
+  }
+
+  .marquee__track {
+    animation: none;
+  }
+}
+</style>
diff --git a/app/pages/index.vue b/app/pages/index.vue
index 07df568..eaedacd 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -44,17 +44,37 @@
       </div>
     </section>
 
-    <!-- Aperçu services (porté de ServicesPreview, Home.jsx) -->
+    <!-- Ruban défilant de la stack moderne (Story 11.3 / AC-1) -->
+    <HomeStackMarquee />
+
+    <!-- Vitrine des 3 services cibles (Story 11.3 / AC-2) -->
     <section class="section">
       <div class="container">
-        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je fais</p>
-        <h2 class="section__title">Trois façons de travailler ensemble</h2>
+        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
+        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos applications</h2>
         <ul class="grid-3">
           <li v-for="service in services" :key="service.id">
             <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
-              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
+              <div class="offer__top">
+                <div class="offer__icon"><ZIcon :name="service.icon" /></div>
+                <span class="offer__no">{{ service.no }}</span>
+              </div>
               <h3 class="offer__title">{{ service.title }}</h3>
               <p class="offer__desc">{{ service.desc }}</p>
+              <ul class="offer__points">
+                <li v-for="point in service.points" :key="point">
+                  <ZIcon name="check" class="offer__check" />
+                  <span>{{ point }}</span>
+                </li>
+              </ul>
+              <ul class="hero__tags offer__tags">
+                <li v-for="tag in service.tags" :key="tag">
+                  <ZTag>{{ tag }}</ZTag>
+                </li>
+              </ul>
+              <div class="offer__price">
+                <span>{{ service.price }}</span>
+              </div>
               <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
                 En savoir plus →
               </NuxtLink>
@@ -116,29 +136,52 @@ function onBootComplete() {
   isBootFinished.value = true;
 }
 
-// Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
-// (accent + glow). Icônes mappées sur le set ZIcon (wp / code / spark, story 2.7).
-// `id` = clé v-for stable (indépendante du contenu affiché).
+// Vitrine des 3 offres ciblées Full Stack TS (Story 11.3 / AC-2).
+// Remplacement complet des données legacy.
 const services = [
   {
-    id: "wordpress",
-    icon: "wp",
-    title: "WordPress sur-mesure",
-    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
+    id: "creation",
+    no: "01 / 03",
+    icon: "code",
+    title: "Création d'applications web & SaaS",
+    desc: "De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.",
+    points: [
+      "Architecture logicielle & APIs REST",
+      "Applications Vue 3 / Nuxt 4 & NestJS",
+      "Intégration Stripe & PostgreSQL",
+    ],

2026-09-13T18:51:50.686264Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
exec
/bin/zsh -lc "wc -l docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json && tail -160 docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md && printf '%s\\n' '--- mapping marquee/services ---' && sed -n '48,100p' docs/specs/spec-home-awwwards/sections-mapping.md && printf '%s\\n' '--- prototype relevant ---' && rg -n -C 8 'marquee|Création d|Développement Full|Évolution|ce que je propose|offer__price' 'docs/design_system/ui_kits/jouan-site/Home - Awwwards.html' | head -260" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
    2773 docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md
    1498 docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json
    4271 total
+// Pause automatique au :hover et arrêt complet sous prefers-reduced-motion.
+import { computed } from "vue";
+import { SITE } from "~/data/site";
+
+const SKILL_LABEL_MAP: Record<string, string> = {
+  typescript: "TypeScript",
+  nuxt: "Nuxt 4",
+  vue: "Vue.js",
+  "nest.js": "NestJS",
+  "node.js": "Node.js",
+  postgresql: "PostgreSQL",
+  typeorm: "TypeORM",
+  stripe: "Stripe Connect",
+  cypress: "Cypress",
+  docker: "Docker",
+  "rest-api": "REST API",
+  vitest: "Vitest",
+};
+
+const skillsList = computed(() => {
+  return SITE.skills.map((skillKey) => SKILL_LABEL_MAP[skillKey] ?? skillKey);
+});
+</script>
+
+<style lang="scss" scoped>
+/* stylelint-disable selector-class-pattern */
+.marquee {
+  display: block;
+  width: 100%;
+  padding-block: var(--space-5);
+  overflow: hidden;
+  border-block: 1px solid var(--border-subtle);
+  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
+
+  &:hover .marquee__track {
+    animation-play-state: paused;
+  }
+}
+
+.marquee__track {
+  display: flex;
+  gap: var(--space-8);
+  width: max-content;
+  will-change: transform;
+  animation: scroll-x 32s linear infinite;
+}
+
+.marquee__item {
+  display: inline-flex;
+  gap: var(--space-8);
+  align-items: center;
+  font-family: var(--font-mono);
+  font-size: var(--fs-xl);
+  letter-spacing: var(--ls-wide);
+  color: var(--text-faint);
+  white-space: nowrap;
+}
+
+.marquee__label {
+  font-weight: var(--fw-regular);
+  color: var(--text-body);
+}
+
+.marquee__star {
+  color: var(--accent);
+}
+
+@keyframes scroll-x {
+  from {
+    transform: translateX(0);
+  }
+
+  to {
+    transform: translateX(-50%);
+  }
+}
+
+@media (prefers-reduced-motion: reduce) {
+  .marquee {
+    mask-image: none;
+  }
+
+  .marquee__track {
+    animation: none;
+  }
+}
+</style>
diff --git a/app/pages/index.vue b/app/pages/index.vue
index 07df568..eaedacd 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -44,17 +44,37 @@
       </div>
     </section>
 
-    <!-- Aperçu services (porté de ServicesPreview, Home.jsx) -->
+    <!-- Ruban défilant de la stack moderne (Story 11.3 / AC-1) -->
+    <HomeStackMarquee />
+
+    <!-- Vitrine des 3 services cibles (Story 11.3 / AC-2) -->
     <section class="section">
       <div class="container">
-        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je fais</p>
-        <h2 class="section__title">Trois façons de travailler ensemble</h2>
+        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
+        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos applications</h2>
         <ul class="grid-3">
           <li v-for="service in services" :key="service.id">
             <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
-              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
+              <div class="offer__top">
+                <div class="offer__icon"><ZIcon :name="service.icon" /></div>
+                <span class="offer__no">{{ service.no }}</span>
+              </div>
               <h3 class="offer__title">{{ service.title }}</h3>
               <p class="offer__desc">{{ service.desc }}</p>
+              <ul class="offer__points">
+                <li v-for="point in service.points" :key="point">
+                  <ZIcon name="check" class="offer__check" />
+                  <span>{{ point }}</span>
+                </li>
+              </ul>
+              <ul class="hero__tags offer__tags">
+                <li v-for="tag in service.tags" :key="tag">
+                  <ZTag>{{ tag }}</ZTag>
+                </li>
+              </ul>
+              <div class="offer__price">
+                <span>{{ service.price }}</span>
+              </div>
               <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
                 En savoir plus →
               </NuxtLink>
@@ -116,29 +136,52 @@ function onBootComplete() {
   isBootFinished.value = true;
 }
 
-// Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
-// (accent + glow). Icônes mappées sur le set ZIcon (wp / code / spark, story 2.7).
-// `id` = clé v-for stable (indépendante du contenu affiché).
+// Vitrine des 3 offres ciblées Full Stack TS (Story 11.3 / AC-2).
+// Remplacement complet des données legacy.
 const services = [
   {
-    id: "wordpress",
-    icon: "wp",
-    title: "WordPress sur-mesure",
-    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
+    id: "creation",
+    no: "01 / 03",
+    icon: "code",
+    title: "Création d'applications web & SaaS",
+    desc: "De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.",
+    points: [
+      "Architecture logicielle & APIs REST",
+      "Applications Vue 3 / Nuxt 4 & NestJS",
+      "Intégration Stripe & PostgreSQL",
+    ],

2026-09-13T18:51:50.686264Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
--- mapping marquee/services ---
- **Terminal vitrine :**
  - Simulation de frappe séquentielle :
    - `$ whoami` → `Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)`
    - `$ cat focus.txt` → `SaaS, web apps, clean architecture, automated testing (QA) & AI engineering`
    - `$ ls ~/projets` → `keova.app/  tryon-saas/  nodium-lab/`

### D. Marquee Stack Moderne
- **Contenu :** Ruban continu affichant les technologies phares de `SITE.skills` :
  `TypeScript · Nuxt 4 · Vue.js · NestJS · Node.js · PostgreSQL · TypeORM · Stripe Connect · Cypress · Docker · REST API · Vitest`
- **Animation :** `@keyframes` fluide, pause automatique au survol de la souris, figeage statique sous `prefers-reduced-motion: reduce`.

### E. Vitrine des Services (3 Offres Ciblées)
1. **Création d'applications web & SaaS**
   - *Promesse :* De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.
   - *Technologies :* Nuxt, NestJS, PostgreSQL, Stripe Connect.
2. **Développement Full Stack TypeScript**
   - *Promesse :* Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.
   - *Technologies :* Vue 3, Nuxt, NestJS, Node.js, TypeORM.
3. **Évolution & Architecture applicative**
   - *Promesse :* Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).
   - *Technologies :* Tests E2E Cypress, CI/CD, audits, optimisations.

### F. Preuves Concrètes & Projets Phares
- **1. Keova App (Pièce maîtresse SaaS en production) :**
  - Statut : `● En production`
  - Rôle : Co-fondateur & Développeur Full Stack
  - Description : ERP vertical SaaS complet dédié au secteur équestre (gestion de pensions, facturation automatisée, réservations).
  - Stack : Nuxt 4, NestJS, PostgreSQL, TypeORM, Stripe Connect, Docker.
  - Lien externe : `<ZExternalLink href="https://keova.app">keova.app</ZExternalLink>`.
- **2. TryOn (Étude de cas SaaS & IA générative) :**
  - Statut : `○ Étude de cas (MVP livré)` *(projet non renouvelé en ligne depuis 01/2026 — valorisé pour son architecture technique et son intégration IA sans lien externe 404)*
  - Rôle : CTO & Développeur Full Stack
  - Description : Plateforme SaaS B2B d'essayage virtuel de vêtements pour marques de mode via l'IA générative (diffusion models, workflows asynchrones, files Redis).
  - Stack : Nuxt 3, NestJS, Python microservices, ComfyUI, Stripe, PostgreSQL.
  - Action : Badge d'étude de cas / renvoi vers le détail de la mission sur `/about` ou profil Malt.
- **3. Nodium (Laboratoire R&D en cours) :**
  - Statut : `◐ R&D / En cours`
  - Rôle : Créateur & Ingénieur IA
  - Description : Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.
  - Stack : TypeScript, Electron/Tauri, Agentic workflows, Local runtimes.
- **Statistiques clés de réassurance :**
  - `11` Années d'expérience web
  - `100%` TypeScript & SaaS de bout en bout
  - `QA` Culture d'automatisation & zéro régression

### G. Bloc CTA Final
- **Titre :** `Un projet d'application web ou SaaS ?`
- **Sous-titre :** `Que ce soit pour créer un nouveau produit, accélérer votre roadmap ou fiabiliser votre stack TypeScript, parlons-en.`
- **Actions :**
  - Bouton primaire : `<ZButton to="/contact">Discuter de votre projet</ZButton>`
  - Bouton externe : `<ZExternalLink href="https://www.malt.fr/profile/simonjouan">Me contacter sur Malt</ZExternalLink>`
--- prototype relevant ---
120-  .term__body .pmt { color: var(--term-green); }
121-  .term__body .path { color: var(--term-blue); }
122-  .term__body .out { color: var(--ink-1); }
123-  .term__body .dir { color: var(--term-blue); }
124-  .term__body .com { color: var(--text-faint); }
125-  .caret { display: inline-block; width: 9px; height: 1.05em; background: var(--accent); vertical-align: text-bottom; animation: caret-blink 1.05s steps(1) infinite; }
126-
127-  /* ---------- Marquee ---------- */
128:  .marquee { border-block: 1px solid var(--border-subtle); padding: var(--space-5) 0; margin-top: 30px; overflow: hidden;
129-    -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
130:  .marquee__track { display: flex; gap: var(--space-8); width: max-content; animation: scroll-x 32s linear infinite; }
131:  .marquee:hover .marquee__track { animation-play-state: paused; }
132:  .marquee__item { font-family: var(--font-mono); font-size: var(--fs-xl); color: var(--text-faint); letter-spacing: var(--ls-wide); display: inline-flex; align-items: center; gap: var(--space-8); }
133:  .marquee__item b { color: var(--text-body); font-weight: var(--fw-regular); }
134:  .marquee__item .star { color: var(--accent); }
135-  @keyframes scroll-x { to { transform: translateX(-50%); } }
136-
137-  /* ---------- Section shell ---------- */
138-  section.block { padding: clamp(80px, 12vh, 150px) 0; position: relative; }
139-  .block__head { max-width: 720px; margin-bottom: var(--space-10); }
140-  .block__head h2 { font-size: clamp(1.8rem, 3.6vw, 2.75rem); line-height: 1.08; letter-spacing: var(--ls-tight); }
141-  .block__head p { color: var(--text-muted); margin: var(--space-4) 0 0; }
142-
--
265-  .block__head--row .seeall:hover { color: var(--accent); }
266-  .block__head--row .seeall svg { width: 15px; height: 15px; }
267-  @media (max-width: 620px) { .block__head--row { flex-direction: column; align-items: flex-start; } }
268-
269-  @media (prefers-reduced-motion: reduce) {
270-    .aurora { animation: none; }
271-    .h1 .word { transform: none; transition: none; }
272-    .reveal { opacity: 1; transform: none; transition: none; }
273:    .marquee__track { animation: none; }
274-    .caret { animation: none; }
275-  }
276-</style>
277-</head>
278-<body>
279-  <div class="atmos">
280-    <div class="aurora aurora--auberg"></div>
281-    <div class="aurora aurora--orange"></div>
--
344-                <div class="term__dots"><i style="background:var(--term-red)"></i><i style="background:var(--term-yellow)"></i><i style="background:var(--term-green)"></i></div>
345-                <span class="term__title">anon.@jouan.ovh: ~</span>
346-              </div>
347-              <div class="term__body" id="termbody"></div>
348-            </div>
349-          </div>
350-        </div>
351-
352:        <div class="marquee" aria-hidden="true">
353:          <div class="marquee__track" id="track"></div>
354-        </div>
355-      </div>
356-    </section>
357-
358-    <!-- SERVICES -->
359-    <section class="block" id="services">
360-      <div class="container">
361-        <div class="block__head reveal">
--
498-    document.getElementById('journal-grid').innerHTML = featHtml + sideHtml;
499-  })();
500-
501-  // ---- Render social ----
502-  document.getElementById('social').innerHTML = SITE.social.map(s=>`
503-    <a class="hex" href="${s.url}" target="_blank" rel="noreferrer" data-hot><svg viewBox="${s.vb}" fill="currentColor">${s.svg}</svg></a>`).join('');
504-
505-  // ---- Marquee ----
506:  const items = SITE.stack.map(t=>`<span class="marquee__item"><b>${t}</b><span class="star">✦</span></span>`).join('');
507-  document.getElementById('track').innerHTML = items + items;
508-
509-  // ---- Reveal observer ----
510-  const io = new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }); }, {threshold:.14});
511-  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
512-
513-  // ---- Header stick + progress ----
514-  const header = document.getElementById('header'), progress = document.getElementById('progress');

2026-09-13T18:51:57.441939Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
exec
/bin/zsh -lc "rg -n '"'^[-*] '"' docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md | tail -40 && tail -80 docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
2460:- `app/pages/index.vue` (MODIFIED)
2464:- [Contrat canonique : docs/specs/spec-home-awwwards/SPEC.md]
2465:- [Cartographie détaillée : docs/specs/spec-home-awwwards/sections-mapping.md]
2466:- [Maquette prototype : docs/design_system/ui_kits/jouan-site/Home - Awwwards.html]
2467:- [Profil Malt officiel : docs/contexte_malt.md]
2468:- [Directives globales pour agents : AGENTS.md]
2469:- [Leçons de la Story 11.2 : docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md]
2560:- **content** — Content to review: diff, spec, story, doc, or any artifact
2561:- **also_consider** (optional) — Areas to keep in mind during review alongside normal adversarial analysis
2568:- Load the content to review from provided input or context
2569:- If content to review is empty, ask for clarification and abort
2570:- Identify content type (diff, branch, uncommitted changes, document, etc.)
2583:- HALT if zero findings — this is suspicious, re-analyze or ask for guidance
2584:- HALT if content is empty or unreadable
2709:-    <!-- Aperçu services (porté de ServicesPreview, Home.jsx) -->
2716:-        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je fais</p>
2717:-        <h2 class="section__title">Trois façons de travailler ensemble</h2>
2723:-              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
2758:-    id: "wordpress",
2759:-    icon: "wp",
2760:-    title: "WordPress sur-mesure",
2761:-    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
2875:-    <!-- Aperçu services (porté de ServicesPreview, Home.jsx) -->
2882:-        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je fais</p>
2883:-        <h2 class="section__title">Trois façons de travailler ensemble</h2>
2889:-              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
2924:-    id: "wordpress",
2925:-    icon: "wp",
2926:-    title: "WordPress sur-mesure",
2927:-    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
2941:- **Terminal vitrine :**
2948:- **Contenu :** Ruban continu affichant les technologies phares de `SITE.skills` :
2950:- **Animation :** `@keyframes` fluide, pause automatique au survol de la souris, figeage statique sous `prefers-reduced-motion: reduce`.
2964:- **1. Keova App (Pièce maîtresse SaaS en production) :**
2970:- **2. TryOn (Étude de cas SaaS & IA générative) :**
2976:- **3. Nodium (Laboratoire R&D en cours) :**
2981:- **Statistiques clés de réassurance :**
2987:- **Titre :** `Un projet d'application web ou SaaS ?`
2988:- **Sous-titre :** `Que ce soit pour créer un nouveau produit, accélérer votre roadmap ou fiabiliser votre stack TypeScript, parlons-en.`
2989:- **Actions :**
120-  .term__body .pmt { color: var(--term-green); }
121-  .term__body .path { color: var(--term-blue); }
122-  .term__body .out { color: var(--ink-1); }
123-  .term__body .dir { color: var(--term-blue); }
124-  .term__body .com { color: var(--text-faint); }
125-  .caret { display: inline-block; width: 9px; height: 1.05em; background: var(--accent); vertical-align: text-bottom; animation: caret-blink 1.05s steps(1) infinite; }
126-
127-  /* ---------- Marquee ---------- */
128:  .marquee { border-block: 1px solid var(--border-subtle); padding: var(--space-5) 0; margin-top: 30px; overflow: hidden;
129-    -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
130:  .marquee__track { display: flex; gap: var(--space-8); width: max-content; animation: scroll-x 32s linear infinite; }
131:  .marquee:hover .marquee__track { animation-play-state: paused; }
132:  .marquee__item { font-family: var(--font-mono); font-size: var(--fs-xl); color: var(--text-faint); letter-spacing: var(--ls-wide); display: inline-flex; align-items: center; gap: var(--space-8); }
133:  .marquee__item b { color: var(--text-body); font-weight: var(--fw-regular); }
134:  .marquee__item .star { color: var(--accent); }
135-  @keyframes scroll-x { to { transform: translateX(-50%); } }
136-
137-  /* ---------- Section shell ---------- */
138-  section.block { padding: clamp(80px, 12vh, 150px) 0; position: relative; }
139-  .block__head { max-width: 720px; margin-bottom: var(--space-10); }
140-  .block__head h2 { font-size: clamp(1.8rem, 3.6vw, 2.75rem); line-height: 1.08; letter-spacing: var(--ls-tight); }
141-  .block__head p { color: var(--text-muted); margin: var(--space-4) 0 0; }
142-
--
265-  .block__head--row .seeall:hover { color: var(--accent); }
266-  .block__head--row .seeall svg { width: 15px; height: 15px; }
267-  @media (max-width: 620px) { .block__head--row { flex-direction: column; align-items: flex-start; } }
268-
269-  @media (prefers-reduced-motion: reduce) {
270-    .aurora { animation: none; }
271-    .h1 .word { transform: none; transition: none; }
272-    .reveal { opacity: 1; transform: none; transition: none; }
273:    .marquee__track { animation: none; }
274-    .caret { animation: none; }
275-  }
276-</style>
277-</head>
278-<body>
279-  <div class="atmos">
280-    <div class="aurora aurora--auberg"></div>
281-    <div class="aurora aurora--orange"></div>
--
344-                <div class="term__dots"><i style="background:var(--term-red)"></i><i style="background:var(--term-yellow)"></i><i style="background:var(--term-green)"></i></div>
345-                <span class="term__title">anon.@jouan.ovh: ~</span>
346-              </div>
347-              <div class="term__body" id="termbody"></div>
348-            </div>
349-          </div>
350-        </div>
351-
352:        <div class="marquee" aria-hidden="true">
353:          <div class="marquee__track" id="track"></div>
354-        </div>
355-      </div>
356-    </section>
357-
358-    <!-- SERVICES -->
359-    <section class="block" id="services">
360-      <div class="container">
361-        <div class="block__head reveal">
--
498-    document.getElementById('journal-grid').innerHTML = featHtml + sideHtml;
499-  })();
500-
501-  // ---- Render social ----
502-  document.getElementById('social').innerHTML = SITE.social.map(s=>`
503-    <a class="hex" href="${s.url}" target="_blank" rel="noreferrer" data-hot><svg viewBox="${s.vb}" fill="currentColor">${s.svg}</svg></a>`).join('');
504-
505-  // ---- Marquee ----
506:  const items = SITE.stack.map(t=>`<span class="marquee__item"><b>${t}</b><span class="star">✦</span></span>`).join('');
507-  document.getElementById('track').innerHTML = items + items;
508-
509-  // ---- Reveal observer ----
510-  const io = new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }); }, {threshold:.14});
511-  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
512-
513-  // ---- Header stick + progress ----
514-  const header = document.getElementById('header'), progress = document.getElementById('progress');

2026-09-13T18:51:57.441939Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5

2026-09-13T18:52:00.976770Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
exec
/bin/zsh -lc "printf '%s\\n' '--- package scripts ---' && node -e 'const p=require(\"./package.json\"); console.log(JSON.stringify(p.scripts,null,2))' 2>/dev/null || sed -n '1,180p' package.json && printf '%s\\n' '--- test/config files ---' && rg --files | rg '("'^|/)(test|tests|e2e|playwright|cypress|vitest|jest|.*spec'"\\.)' | head -100 && printf '%s\\n' '--- git metadata for diff ---' && git status --short && git diff --stat -- docs/implementation-artifacts/code-reviews/11-3/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
--- package scripts ---
{
  "build": "nuxi build",
  "dev": "nuxi dev",
  "generate": "nuxi generate",
  "preview": "nuxi preview",
  "postinstall": "nuxi prepare",
  "lint": "eslint . && stylelint \"app/assets/**/*.scss\" \"app/**/*.vue\"",
  "lint:style": "stylelint \"app/assets/**/*.scss\" \"app/**/*.vue\"",
  "typecheck": "nuxi typecheck",
  "deploy": "push-dir --dir=.output/public --branch=gh-pages --cleanup"
}
--- test/config files ---
_bmad/scripts/tests/test_resolve_customization.py
--- git metadata for diff ---
 M app/pages/index.vue
 M docs/implementation-artifacts/sprint-status.yaml
?? app/components/home/HomeStackMarquee.vue
?? docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md
?? docs/implementation-artifacts/code-reviews/11-3/

2026-09-13T18:52:35.692845Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "rg -n -i 'finding|issue|probl|fail|débord|focus|marquee|service|mask|webkit|gap|aria|réduit|reduced|drift|legacy|test' docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json | head -220" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
2:2026-09-13T18:51:09.037319Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
24:Return ONLY a valid JSON array of objects. Each edge-case finding contains exactly these four fields:
29:    "guard_snippet": "minimal code sketch that closes the gap (single-line escaped string)",
42:description: 'Walk every branching path and boundary condition in content, report only unhandled edge cases. Orthogonal to adversarial review - method-driven not attitude-driven. Use when you need exhaustive edge-case analysis of code, specs, or diffs.'
75:- Walk all branching paths: control flow (conditionals, loops, error handlers, early returns) and domain boundaries (where values, states, or conditions transition). Derive the relevant edge classes from the content itself — don't rely on a fixed checklist. Examples: missing else/default, unguarded inputs, off-by-one loops, arithmetic overflow, implicit type coercion, race conditions, timeout gaps
78:- Collect only the unhandled paths as findings — discard handled ones silently
82:- Revisit every edge class from Step 2 — e.g., missing else/default, null/empty inputs, off-by-one loops, arithmetic overflow, implicit type coercion, race conditions, timeout gaps
83:- Add any newly found unhandled paths to findings; discard confirmed-handled ones
89:### Step 5: Present Findings
91:Output all findings as a single JSON array following the Output Format specification exactly.
96:Return ONLY a valid JSON array of objects. Each edge-case finding contains exactly these four fields:
102:  "guard_snippet": "minimal code sketch that closes the gap (single-line escaped string, no raw newlines or unescaped quotes)",
107:No extra text, no explanations, no markdown wrapping. An empty array `[]` is valid when nothing is found. Deletion findings from Step 4, if any, go in the same array with the extra fields defined in `references/deletion-check.md`.
119:Secondary pass for the Edge Case Hunter — runs only when the diff removed meaningful code. Subordinate to the edge-case pass; findings are usually few or none.
121:For each chunk of removed or replaced code (ignore pure renames and whitespace), ask: did it carry behavior or a contract that the change neither re-established nor intentionally retired? Add a finding for any resulting regression, orphaned reference, or newly-dead code. Skip anything already covered by your edge-case findings.
123:Append each finding to the same JSON array as the edge-case findings, with the four standard fields plus:
128:For a deletion finding the standard fields read as: `location` = the removed item; `trigger_condition` = the behavior or contract it enforced; `guard_snippet` = where or how to re-establish it; `potential_consequence` = the regression or orphan.
133:diff --git a/app/components/home/HomeStackMarquee.vue b/app/components/home/HomeStackMarquee.vue
137:+++ b/app/components/home/HomeStackMarquee.vue
140:+  <div class="marquee" aria-hidden="true">
141:+    <div class="marquee__track">
143:+      <span v-for="(skill, index) in skillsList" :key="`skill-a-${index}`" class="marquee__item">
144:+        <b class="marquee__label">{{ skill }}</b>
145:+        <span class="marquee__star" aria-hidden="true">✦</span>
148:+      <span v-for="(skill, index) in skillsList" :key="`skill-b-${index}`" class="marquee__item">
149:+        <b class="marquee__label">{{ skill }}</b>
150:+        <span class="marquee__star" aria-hidden="true">✦</span>
159:+// Défilement continu pur CSS masqué aux lecteurs d'écran (aria-hidden="true").
160:+// Pause automatique au :hover et arrêt complet sous prefers-reduced-motion.
176:+  vitest: "Vitest",
186:+.marquee {
192:+  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
194:+  &:hover .marquee__track {
199:+.marquee__track {
201:+  gap: var(--space-8);
207:+.marquee__item {
209:+  gap: var(--space-8);
218:+.marquee__label {
223:+.marquee__star {
237:+@media (prefers-reduced-motion: reduce) {
238:+  .marquee {
239:+    mask-image: none;
242:+  .marquee__track {
255:-    <!-- Aperçu services (porté de ServicesPreview, Home.jsx) -->
257:+    <HomeStackMarquee />
259:+    <!-- Vitrine des 3 services cibles (Story 11.3 / AC-2) -->
262:-        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je fais</p>
264:+        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
267:           <li v-for="service in services" :key="service.id">
268:             <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
269:-              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
271:+                <div class="offer__icon"><ZIcon :name="service.icon" /></div>
272:+                <span class="offer__no">{{ service.no }}</span>
274:               <h3 class="offer__title">{{ service.title }}</h3>
275:               <p class="offer__desc">{{ service.desc }}</p>
277:+                <li v-for="point in service.points" :key="point">
283:+                <li v-for="tag in service.tags" :key="tag">
288:+                <span>{{ service.price }}</span>
290:               <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
297:-// Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
301:+// Remplacement complet des données legacy.
302: const services = [
334:+      "Microservices & backend modulaire NestJS",
347:-    desc: "L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.",
349:+    desc: "Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).",
352:+      "Tests E2E Cypress & tests unitaires Vitest",
355:+    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
408:+  gap: var(--space-2);
415:+    gap: var(--space-2);
463:            <p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>
471:              <span class="hero__pulse-dot" aria-hidden="true" />
474:                <span aria-hidden="true"> · </span>
480:              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
484:              <ZButton :as="NuxtLink" to="/about" variant="secondary" size="lg"> Voir le parcours &amp; CV </ZButton>
497:    <HomeStackMarquee />
499:    <!-- Vitrine des 3 services cibles (Story 11.3 / AC-2) -->
502:        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
505:          <li v-for="service in services" :key="service.id">
506:            <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
508:                <div class="offer__icon"><ZIcon :name="service.icon" /></div>
509:                <span class="offer__no">{{ service.no }}</span>
511:              <h3 class="offer__title">{{ service.title }}</h3>
512:              <p class="offer__desc">{{ service.desc }}</p>
514:                <li v-for="point in service.points" :key="point">
520:                <li v-for="tag in service.tags" :key="tag">
525:                <span>{{ service.price }}</span>
527:              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
546:        <h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>
589:// Remplacement complet des données legacy.
590:const services = [
614:      "Microservices & backend modulaire NestJS",
626:    desc: "Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).",
629:      "Tests E2E Cypress & tests unitaires Vitest",
632:    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
736:  gap: var(--space-12);
769:  gap: var(--space-3);
777:  gap: var(--space-2);
791:    &:focus-visible {
807:  @media (prefers-reduced-motion: reduce) {
834:// ---- Aperçu services (porté de .grid-3 / .offer*) ----
838:  gap: var(--space-5);
902:  gap: var(--space-2);
909:    gap: var(--space-2);
948:  &:focus-visible {
961:  gap: var(--space-12);
975:The diff is a new marquee plus a replacement services dataset/rendering; I’m checking referenced contracts and deletion behavior before emitting findings.
1031:  "vitest",
1046:    desc: "Plateforme SaaS B2B d'essayage virtuel de vêtements via l'IA générative (diffusion models, microservices asynchrones, files Redis).",
1073:app/pages/services.vue:19:              <div class="offer__icon"><ZIcon :name="offer.icon" /></div>
1074:app/pages/services.vue:62:            <template #iconRight><ZIcon name="arrow" /></template>
1075:app/pages/services.vue:79:  /** Nom d'icône dans le set ZIcon (story 2.7). */
1076:app/pages/services.vue:234:  // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
1077:app/pages/services.vue:19:              <div class="offer__icon"><ZIcon :name="offer.icon" /></div>
1078:app/pages/services.vue:62:            <template #iconRight><ZIcon name="arrow" /></template>
1079:app/pages/services.vue:79:  /** Nom d'icône dans le set ZIcon (story 2.7). */
1080:app/pages/services.vue:234:  // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
1088:app/pages/index.vue:59:                <div class="offer__icon"><ZIcon :name="service.icon" /></div>
1093:app/pages/index.vue:59:                <div class="offer__icon"><ZIcon :name="service.icon" /></div>
1205:  // Focus clavier : anneau d'accent visible. Quand la carte est rendue en lien
1206:  // (`as="a"`, ex. cartes projet story 3.3), elle est focusable — sans cette règle,
1207:  // aucun indicateur. Sans effet sur les cartes non focusables (div).
1208:  &:focus-visible {
1210:    // box-shadow disparaissent) ; le ring box-shadow reste le focus visuel normal.
1232:@media (prefers-reduced-motion: reduce) {
1253:    :aria-label="label || undefined"
1254:    :aria-hidden="label ? undefined : 'true'"
1317:  /** Libellé accessible : si fourni, l'icône devient `role="img"` ; sinon décorative (`aria-hidden`). */
1349:    <button v-if="isRemovable" type="button" class="ztag__remove" aria-label="Retirer" @click.stop="handleRemove">
1447:  gap: var(--space-2);
1483:  &:focus-visible {
1498:2026-09-13T18:51:39.148081Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
1502:app/pages/index.vue-50-    <!-- Vitrine des 3 services cibles (Story 11.3 / AC-2) -->
1505:app/pages/index.vue-53-        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
1508:app/pages/index.vue-56-          <li v-for="service in services" :key="service.id">
1509:app/pages/index.vue:57:            <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
1511:app/pages/index.vue:59:                <div class="offer__icon"><ZIcon :name="service.icon" /></div>
1512:app/pages/index.vue:60:                <span class="offer__no">{{ service.no }}</span>
1514:app/pages/index.vue:62:              <h3 class="offer__title">{{ service.title }}</h3>
1515:app/pages/index.vue:63:              <p class="offer__desc">{{ service.desc }}</p>
1517:app/pages/index.vue-65-                <li v-for="point in service.points" :key="point">
1523:app/pages/index.vue-71-                <li v-for="tag in service.tags" :key="tag">
1528:app/pages/index.vue-76-                <span>{{ service.price }}</span>
1530:app/pages/index.vue:78:              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
1554:app/pages/index.vue:382:// ---- Aperçu services (porté de .grid-3 / .offer*) ----
1558:app/pages/index.vue-386-  gap: var(--space-5);
1621:app/pages/index.vue-450-  gap: var(--space-2);
1698:app/assets/scss/base/_layout.scss-65-  gap: var(--space-2);
1703:     1	diff --git a/app/components/home/HomeStackMarquee.vue b/app/components/home/HomeStackMarquee.vue
1707:     5	+++ b/app/components/home/HomeStackMarquee.vue
1710:     8	+  <div class="marquee" aria-hidden="true">
1711:     9	+    <div class="marquee__track">
1713:    11	+      <span v-for="(skill, index) in skillsList" :key="`skill-a-${index}`" class="marquee__item">
1714:    12	+        <b class="marquee__label">{{ skill }}</b>
1715:    13	+        <span class="marquee__star" aria-hidden="true">✦</span>
1718:    16	+      <span v-for="(skill, index) in skillsList" :key="`skill-b-${index}`" class="marquee__item">
1719:    17	+        <b class="marquee__label">{{ skill }}</b>
1720:    18	+        <span class="marquee__star" aria-hidden="true">✦</span>
1729:    27	+// Défilement continu pur CSS masqué aux lecteurs d'écran (aria-hidden="true").
1730:    28	+// Pause automatique au :hover et arrêt complet sous prefers-reduced-motion.
1746:    44	+  vitest: "Vitest",
1756:    54	+.marquee {
1762:    60	+  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
1764:    62	+  &:hover .marquee__track {
1769:    67	+.marquee__track {
1771:    69	+  gap: var(--space-8);
1777:    75	+.marquee__item {
1779:    77	+  gap: var(--space-8);
1788:    86	+.marquee__label {
1793:    91	+.marquee__star {
1807:   105	+@media (prefers-reduced-motion: reduce) {
1808:   106	+  .marquee {
1809:   107	+    mask-image: none;
1812:   110	+  .marquee__track {
1825:   123	-    <!-- Aperçu services (porté de ServicesPreview, Home.jsx) -->
1827:   125	+    <HomeStackMarquee />
1829:   127	+    <!-- Vitrine des 3 services cibles (Story 11.3 / AC-2) -->
1832:   130	-        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je fais</p>
1834:   132	+        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
1837:   135	           <li v-for="service in services" :key="service.id">
1838:   136	             <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
1839:   137	-              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
1841:   139	+                <div class="offer__icon"><ZIcon :name="service.icon" /></div>
1842:   140	+                <span class="offer__no">{{ service.no }}</span>
1844:   142	               <h3 class="offer__title">{{ service.title }}</h3>
1845:   143	               <p class="offer__desc">{{ service.desc }}</p>
1847:   145	+                <li v-for="point in service.points" :key="point">
1853:   151	+                <li v-for="tag in service.tags" :key="tag">
1858:   156	+                <span>{{ service.price }}</span>
1860:   158	               <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
1867:   165	-// Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
1871:   169	+// Remplacement complet des données legacy.
1872:   170	 const services = [
1904:   202	+      "Microservices & backend modulaire NestJS",
1917:   215	-    desc: "L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.",
1919:   217	+    desc: "Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).",
1922:   220	+      "Tests E2E Cypress & tests unitaires Vitest",
1925:   223	+    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
1973:   271	+  gap: var(--space-2);
1980:   278	+    gap: var(--space-2);
2014:2026-09-13T18:52:11.044157Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5

2026-09-13T18:52:40.827712Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '1480,1535p' docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json && sed -n '2000,2050p' docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
    color: var(--text-strong);
  }

  &:focus-visible {
    // Outline transparent → couleur système sous forced-colors (box-shadow neutralisée).
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }
}

.ztag__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;

2026-09-13T18:51:39.148081Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
exec
/bin/zsh -lc "rg -n -C 5 'hero__tags|grid-3|@media.*(max|small)|offer' app/assets/scss/base app/pages/index.vue | head -260 && printf '\\n--- diff with line numbers ---\\n' && nl -ba docs/implementation-artifacts/code-reviews/11-3/full.diff | sed -n '1,340p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/index.vue-50-    <!-- Vitrine des 3 services cibles (Story 11.3 / AC-2) -->
app/pages/index.vue-51-    <section class="section">
app/pages/index.vue-52-      <div class="container">
app/pages/index.vue-53-        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
app/pages/index.vue-54-        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos applications</h2>
app/pages/index.vue:55:        <ul class="grid-3">
app/pages/index.vue-56-          <li v-for="service in services" :key="service.id">
app/pages/index.vue:57:            <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
app/pages/index.vue:58:              <div class="offer__top">
app/pages/index.vue:59:                <div class="offer__icon"><ZIcon :name="service.icon" /></div>
app/pages/index.vue:60:                <span class="offer__no">{{ service.no }}</span>
app/pages/index.vue-61-              </div>
app/pages/index.vue:62:              <h3 class="offer__title">{{ service.title }}</h3>
app/pages/index.vue:63:              <p class="offer__desc">{{ service.desc }}</p>
app/pages/index.vue:64:              <ul class="offer__points">
app/pages/index.vue-65-                <li v-for="point in service.points" :key="point">
app/pages/index.vue:66:                  <ZIcon name="check" class="offer__check" />
app/pages/index.vue-67-                  <span>{{ point }}</span>
app/pages/index.vue-68-                </li>
app/pages/index.vue-69-              </ul>
app/pages/index.vue:70:              <ul class="hero__tags offer__tags">
app/pages/index.vue-71-                <li v-for="tag in service.tags" :key="tag">
app/pages/index.vue-72-                  <ZTag>{{ tag }}</ZTag>
app/pages/index.vue-73-                </li>
app/pages/index.vue-74-              </ul>
app/pages/index.vue:75:              <div class="offer__price">
app/pages/index.vue-76-                <span>{{ service.price }}</span>
app/pages/index.vue-77-              </div>
app/pages/index.vue:78:              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
app/pages/index.vue-79-                En savoir plus →
app/pages/index.vue-80-              </NuxtLink>
app/pages/index.vue-81-            </ZCard>
app/pages/index.vue-82-          </li>
app/pages/index.vue-83-        </ul>
   298	   margin-top: auto;
   299	+  padding-top: var(--space-4);
   300	+  border-top: 1px dashed var(--border-subtle);
   301	+  font-family: var(--font-mono);
   302	+  font-size: var(--fs-xs);
   303	+  color: var(--accent);
   304	+}
   305	+
   306	+.offer__more {
   307	+  margin-top: var(--space-3);
   308	   font-family: var(--font-mono);
   309	   font-size: var(--fs-sm);
   310	   color: var(--accent);

2026-09-13T18:52:11.044157Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5

2026-09-13T18:52:45.748499Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
Le recoupement fait déjà ressortir plusieurs écarts concrets : l’animation n’est pas parfaitement bouclée avec le `gap`, la page `/services` conserve l’ancien catalogue, et plusieurs contraintes d’accessibilité/Design System sont seulement simulées. Je fais une dernière vérification outillée dans Docker pour distinguer les défauts vérifiables des améliorations de robustesse.
exec
/bin/zsh -lc 'docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"' in /Users/simon/dev/jouan.ovh
2026-09-13T18:52:54.073602Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
2026-09-13T18:53:01.266935Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
2026-09-13T18:53:09.179353Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
 succeeded in 17749ms:
 Container jouanovh-web-run-790b985b21d7 Created 
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

[@nuxt/content] ✔ Processed 2 collections and 1 files in 10.89ms (0 cached, 1 parsed)

 WARN  Payload extraction is recommended for full-static output. You can enable it by setting experimental.payloadExtraction to true or 'client'.

│
●  Nitro preset: static
ℹ Building client...
ℹ vite v7.3.5 building client environment for production...

 WARN  [plugin nuxt:module-preload-polyfill] Sourcemap is likely to be incorrect: a plugin (nuxt:module-preload-polyfill) was used to transform files, but didn't generate a sourcemap for the transformation. Consult the plugin documentation for help

ℹ transforming...
ℹ ✓ 356 modules transformed.
ℹ rendering chunks...
ℹ computing gzip size...
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/sqlite3-opfs-async-proxy-C_otN2ZJ.js            9.45 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/manifest.json                                        33.61 kB │ gzip:   2.65 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/UbuntuMono-Bold.DxtomZAI.ttf                  174.01 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/UbuntuMono-Regular.C0QEQ_U4.ttf               189.00 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/UbuntuMono-Italic.B29yKq6H.ttf                193.38 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/sqlite3-worker1-bundler-friendly-Bv6ABw9v.js  196.87 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/UbuntuMono-BoldItalic.TXXgaKQw.ttf            198.23 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/sqlite3.DBpDb1lf.wasm                         856.45 kB │ gzip: 393.51 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/sqlite3-DBpDb1lf.wasm                         856.45 kB │ gzip: 393.51 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ProsePre.D5orA6B_.css                           0.03 kB │ gzip:   0.05 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/LinkListComponent.BRYW5MSq.css                  0.85 kB │ gzip:   0.45 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ZBadge.BAw1B01J.css                             1.11 kB │ gzip:   0.43 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ZCard.C5C9a-aj.css                              1.19 kB │ gzip:   0.47 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/confidentialite.6cyJdYTo.css                    1.31 kB │ gzip:   0.45 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/mentions-legales.NzlifB_e.css                   1.31 kB │ gzip:   0.45 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ZTag.f2Aq6DLg.css                               1.46 kB │ gzip:   0.53 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/index.DsdfcI12.css                              1.65 kB │ gzip:   0.53 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/error-500.CIKAhgAS.css                          1.91 kB │ gzip:   0.73 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/error-404.BvOk15Jd.css                          2.43 kB │ gzip:   0.86 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ZButton.CyAD_ftR.css                            2.70 kB │ gzip:   0.84 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/services.Cbyd59f6.css                           2.83 kB │ gzip:   0.71 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/about.CJ89_QfO.css                              3.78 kB │ gzip:   1.06 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/_...Xw9nepfy.css                                4.30 kB │ gzip:   0.90 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/contact.CccJ7Dqb.css                            5.08 kB │ gzip:   1.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/default.CvwmGadH.css                            9.77 kB │ gzip:   2.20 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/entry.QaoIl47T.css                             10.41 kB │ gzip:   3.56 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/index.CwUPexnA.css                             14.30 kB │ gzip:   3.05 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DlAUqK2U.js                                     0.09 kB │ gzip:   0.10 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DzUV1eN9.js                                     0.17 kB │ gzip:   0.15 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/M1JNenf5.js                                     0.21 kB │ gzip:   0.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/C02ta1V8.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CG-jHOew.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CEPlAwA6.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ByRVFtXv.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CtAQEdW5.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DyThWos2.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BmOw84Q_.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/C4pMqLx5.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/7CGCl70s.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/blEhzp2Z.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D6ebrIEI.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Dm8ug_jb.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D0hdI8gC.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CpE0SPBT.js                                     0.26 kB │ gzip:   0.22 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/C1KUjY_5.js                                     0.38 kB │ gzip:   0.27 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ZK5FflQF.js                                     0.41 kB │ gzip:   0.25 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Bur-ix-P.js                                     0.48 kB │ gzip:   0.36 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BzhC-2ZP.js                                     0.49 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/r7IcYfZK.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/hBjQhbzQ.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BIvwxlRf.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BSfQHNLK.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D0inICi7.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Cn3m5CkS.js                                     0.51 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/iRFQX-DN.js                                     0.59 kB │ gzip:   0.38 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D8H0n_NK.js                                     0.63 kB │ gzip:   0.38 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DukvR-Qp.js                                     0.64 kB │ gzip:   0.42 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BtbNp3mP.js                                     0.79 kB │ gzip:   0.47 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/B_mzGgTO.js                                     1.20 kB │ gzip:   0.66 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D8hPKp8A.js                                     1.30 kB │ gzip:   0.57 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/B3t_qBzk.js                                     1.32 kB │ gzip:   0.75 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D35Zk-vZ.js                                     2.84 kB │ gzip:   1.37 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CIwT1kz-.js                                     3.48 kB │ gzip:   1.56 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Y3NPjUXz.js                                     3.78 kB │ gzip:   1.81 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/811QLj9J.js                                     3.79 kB │ gzip:   1.71 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D3HEaEDA.js                                     4.77 kB │ gzip:   2.18 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DGCPLsDT.js                                     4.92 kB │ gzip:   2.00 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/p9p9HqL6.js                                     5.14 kB │ gzip:   2.39 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Dq5mIhiX.js                                     5.67 kB │ gzip:   2.26 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/KGKv4NfL.js                                     6.01 kB │ gzip:   2.78 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Dt14r2gn.js                                     7.68 kB │ gzip:   2.92 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BNJvsSRv.js                                     8.33 kB │ gzip:   3.51 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BdX46kVG.js                                     8.97 kB │ gzip:   3.57 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CPrD3O5O.js                                    11.86 kB │ gzip:   4.65 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CfAk-xw6.js                                    16.53 kB │ gzip:   6.00 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CoGvlOvD.js                                    32.44 kB │ gzip:  11.78 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ydE7LHlt.js                                    46.45 kB │ gzip:  19.11 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BRqZYJwD.js                                   187.38 kB │ gzip:  70.79 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D16vBkZS.js                                   199.77 kB │ gzip:  59.04 kB
ℹ ✓ built in 2.52s
✔ Client built in 2522ms
ℹ Building server...
ℹ vite v7.3.5 building ssr environment for production...
ℹ transforming...
ℹ ✓ 399 modules transformed.
ℹ rendering chunks...
ℹ ✓ built in 2.41s
✔ Server built in 2421ms
[nitro] ℹ Initializing prerenderer
[nitro] ℹ Prerendering 4 initial routes with crawler
[nitro]   ├─ /200.html (57ms)
[nitro]   ├─ / (59ms)
[nitro]   ├─ /404.html (57ms)
[nitro]   ├─ /confidentialite (37ms)
[nitro]   ├─ /__nuxt_content/blog/sql_dump.txt (59ms)
[nitro]   ├─ /services (37ms)
[nitro]   ├─ /mentions-legales (36ms)
[nitro]   ├─ /contact (38ms)
[nitro]   ├─ /blog (41ms)
[nitro]   ├─ /about (38ms)
[nitro]   ├─ /_ipx/_/images/portrait.jpeg (112ms)
[nitro]   ├─ /_ipx/s_220x165/images/undraw_code_thinking_re_gka2.svg (113ms)
[nitro]   ├─ /_ipx/s_440x330/images/undraw_code_thinking_re_gka2.svg (112ms)
[nitro] ℹ Prerendered 13 routes in 2.872 seconds
[nitro] ✔ Generated public .output/public
[nitro] ✔ You can preview this build using npx serve .output/public
│
└  ✨ You can now deploy .output/public to any static hosting!

2026-09-13T18:53:11.621272Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "rg -n 'scroll-x|\\.marquee|offer__top|offer__price|grid-3' app docs | head -160 && printf '%s\\n' '--- rendered home excerpt ---' && rg -o -n '.{0,180}(HomeStackMarquee|Ce que je|Création d.applications|Nuxt 4|services).{0,240}' .output/public/index.html | head -30" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/services.vue:13:        <ul class="grid-3">
app/pages/services.vue:25:              <div class="offer__price">
app/pages/services.vue:200:// ---- Grille des offres (porté de kit.css : .grid-3 / .offer*) ----
app/pages/services.vue:201:.grid-3 {
app/pages/services.vue:280:.offer__price {
app/pages/services.vue:350:  .grid-3,
app/pages/index.vue:55:        <ul class="grid-3">
app/pages/index.vue:58:              <div class="offer__top">
app/pages/index.vue:75:              <div class="offer__price">
app/pages/index.vue:382:// ---- Aperçu services (porté de .grid-3 / .offer*) ----
app/pages/index.vue:383:.grid-3 {
app/pages/index.vue:402:.offer__top {
app/pages/index.vue:476:.offer__price {
app/pages/index.vue:599:  .grid-3,
app/components/home/HomeStackMarquee.vue:48:.marquee {
app/components/home/HomeStackMarquee.vue:56:  &:hover .marquee__track {
app/components/home/HomeStackMarquee.vue:61:.marquee__track {
app/components/home/HomeStackMarquee.vue:66:  animation: scroll-x 32s linear infinite;
app/components/home/HomeStackMarquee.vue:69:.marquee__item {
app/components/home/HomeStackMarquee.vue:80:.marquee__label {
app/components/home/HomeStackMarquee.vue:85:.marquee__star {
app/components/home/HomeStackMarquee.vue:89:@keyframes scroll-x {
app/components/home/HomeStackMarquee.vue:100:  .marquee {
app/components/home/HomeStackMarquee.vue:104:  .marquee__track {
docs/design_system/ui_kits/jouan-site/Home.jsx:88:        <div className="grid-3">
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1451:    className: "grid-3"
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1581:    className: "grid-3"
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1604:      className: "offer__price",
docs/design_system/ui_kits/jouan-site/Services.jsx:22:          <div className="grid-3">
docs/design_system/ui_kits/jouan-site/Services.jsx:32:                  <div className="offer__price" style={{ marginTop: "auto", paddingTop: "var(--space-5)" }}>
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:128:  .marquee { border-block: 1px solid var(--border-subtle); padding: var(--space-5) 0; margin-top: 30px; overflow: hidden;
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:130:  .marquee__track { display: flex; gap: var(--space-8); width: max-content; animation: scroll-x 32s linear infinite; }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:131:  .marquee:hover .marquee__track { animation-play-state: paused; }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:132:  .marquee__item { font-family: var(--font-mono); font-size: var(--fs-xl); color: var(--text-faint); letter-spacing: var(--ls-wide); display: inline-flex; align-items: center; gap: var(--space-8); }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:133:  .marquee__item b { color: var(--text-body); font-weight: var(--fw-regular); }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:134:  .marquee__item .star { color: var(--accent); }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:135:  @keyframes scroll-x { to { transform: translateX(-50%); } }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:273:    .marquee__track { animation: none; }
docs/design_system/_ds_bundle.js:1451:    className: "grid-3"
docs/design_system/_ds_bundle.js:1581:    className: "grid-3"
docs/design_system/_ds_bundle.js:1604:      className: "offer__price",
docs/design_system/ui_kits/jouan-site/kit.css:111:.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
docs/design_system/ui_kits/jouan-site/kit.css:128:.offer__price { font-family: var(--font-mono); font-size: var(--fs-sm); color: var(--text-muted); margin-top: var(--space-4); }
docs/design_system/ui_kits/jouan-site/kit.css:129:.offer__price b { color: var(--text-strong); font-size: var(--fs-lg); font-weight: var(--fw-bold); }
docs/design_system/ui_kits/jouan-site/kit.css:187:  .grid-3 { grid-template-columns: 1fr; }
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:21:   **Then** le composant `HomeStackMarquee.vue` affiche un bandeau défilant continu en pur CSS (animation `scroll-x` avec masque d'atténuation horizontal `mask-image: linear-gradient(...)`)
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:61:  - [x] Définir la structure de template (`.marquee`, `.marquee__track`, `.marquee__item`, séparateur `.star` avec symbole `✦`).
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:64:  - [x] Configurer l'animation CSS `@keyframes scroll-x` avec masquage horizontal `mask-image` et pause au survol (`:hover`).
docs/implementation-artifacts/4-1-route-services-et-cartes-doffre.md:35:  - [x] Boucler sur les offres dans une `.grid-3` ; chaque offre = primitive `ZCard` (réutilisée de l'Epic 2), variante accent/featured pour la carte mise en avant
docs/implementation-artifacts/4-1-route-services-et-cartes-doffre.md:37:  - [x] Afficher l'icône d'offre (`wp` / `code` / `spark`) via le système d'icônes de la story 2.7, le titre `h3`, la description, la liste de `points` (puces `→` via la classe `.offer li`), le prix (`.offer__price` + `<b>`)
docs/implementation-artifacts/4-1-route-services-et-cartes-doffre.md:41:  - [x] Vérifier le rendu responsive : `.grid-3` passe en 1 colonne sur mobile (déjà prévu par le DS)
docs/implementation-artifacts/4-1-route-services-et-cartes-doffre.md:83:- Grille : `.grid-3`, une `Card` par offre avec `accent`/`featured` sur la carte mise en avant. [Source: Services.jsx L22-41]
docs/implementation-artifacts/4-1-route-services-et-cartes-doffre.md:85:- Corps de carte : `.offer__icon` (icône), `h3` titre, `p` desc, `ul/li` points (puce `→` via `.offer li::before`), `.offer__price > b` prix, `Button` pleine largeur « Discuter du projet » → `contact`. [Source: Services.jsx L28-38]
docs/implementation-artifacts/4-1-route-services-et-cartes-doffre.md:86:- Classes DS disponibles dans `kit.css` : `.section`, `.container`, `.eyebrow`, `.prose`, `.grid-3`, `.offer`, `.offer__icon`, `.offer h3/p/ul/li`, `.offer__price`. À porter en SCSS via tokens (ne pas hardcoder). [Source: docs/design_system/ui_kits/jouan-site/kit.css L18-27, L111-129]
docs/implementation-artifacts/4-1-route-services-et-cartes-doffre.md:95:- Respecter le responsive : `.grid-3` → 1 colonne sous le breakpoint mobile du DS.
docs/implementation-artifacts/4-1-route-services-et-cartes-doffre.md:114:- [Source: docs/design_system/ui_kits/jouan-site/kit.css — `.section`, `.grid-3`, `.offer*`]
docs/implementation-artifacts/4-1-route-services-et-cartes-doffre.md:132:- Remplacement du stub `pages/services.vue` (créé en story 2.8 pour la nav/prerender) par la vraie page : `<main>` → première `<section class="section">` avec en-tête (eyebrow `// services`, h1 `fs-4xl`/`fw-light`/16ch, prose intro `fs`/60ch en `text-muted`) + grille `.grid-3` des 3 offres. Un seul `<main>` avec la 1re section : la page est prête à accueillir la section process (story 4.2) en 2e `<section>`.
docs/implementation-artifacts/4-1-route-services-et-cartes-doffre.md:135:- Styles `<style scoped>` token-only (aucune valeur en dur) : portage SCSS de `.section`/`.container`/`.eyebrow`/`.grid-3`/`.offer*` depuis `kit.css`. Dérogation assumée et commentée : `font-size: 22px` sur `.offer__icon` pour dimensionner le glyphe ZIcon (pas de token d'espacement à 22px) — même choix qu'en story 3.2. `.section` en `padding-block` seul (le gutter horizontal vient de `.container` via `padding-inline`), cohérent avec le piège shorthand documenté.
docs/implementation-artifacts/epic-4-retro-2026-06-23.md:18:  - 4.1 — Route `/services` + cartes d'offre : en-tête (eyebrow `// services`, h1, prose) + grille `.grid-3` des 3 offres (WordPress / Applications web *featured* / IA), portées de `Services.jsx` + `data.js`, rendues en `ZCard`/`ZBadge`/`ZButton`/`ZIcon`.
docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md:84:  - `index.html` : `<h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>`, `aria-haspopup="dialog"`, listes `<ul>` sur `.grid-3` et `.grid-2.projects`.
docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md:85:  - `services/index.html` : `<ol class="process">` avec `aria-hidden="true"` sur les numéros d'étape, `<ul>` sur `.grid-3`, préfixes `//` en `aria-hidden`.
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:27:  - [x] Grille `.grid-3` de 3 cartes `ZCard` (variante interactive ; carte « featured » mise en avant pour le service marqué `featured: true` dans `data.js`)
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:40:  - [x] Porter les classes `.section`, `.section--sunken`, `.grid-3`, `.statrow`, `.stat`, `.offer*`, `.eyebrow` depuis `kit.css` en consommant les tokens (aucune valeur hardcodée)
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:41:  - [x] Mobile (`max-width: 720px`) : `.grid-3` passe en une colonne (réf. `kit.css`)
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:87:| `<div className="grid-3">` + `S.services.map(...)` | `.grid-3` de 3 `ZCard` |
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:124:- [Source: docs/design_system/ui_kits/jouan-site/kit.css — `.section`, `.section--sunken`, `.grid-3`, `.statrow`, `.stat`, `.offer*`, `.eyebrow`]
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:144:- Section « aperçu services » sous le hero : eyebrow `// ce que je fais`, `<h2>Trois façons de travailler ensemble`, grille `.grid-3` de 3 `ZCard` (Epic 2). La carte `featured` (Applications web) reçoit `accent` + `featured` (barre + glow orange) ; les 3 cartes sont `interactive`.
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:161:- Breakpoint mobile : la fiche cite `max-width: 720px` ; `kit.css` (source de vérité) utilise `@media (max-width: 900px)` pour `.grid-3` → 1 colonne. J'ai suivi `kit.css` (900px), cohérent avec la story 3.1.
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:174:- `app/pages/index.vue` (sections services + stats ; données services/stats ; aria-label liens ; clés `v-for` stables ; styles `.section*`/`.grid-3`/`.offer*`/`.statrow`/`.stat` ; repli `forced-colors`)
docs/implementation-artifacts/4-2-section-process.md:128:- Responsive : la grille process passe en 1 colonne sous 900px (même breakpoint que `.grid-3`), vérifié à l'écran.
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:186:+.marquee {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:194:+  &:hover .marquee__track {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:199:+.marquee__track {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:204:+  animation: scroll-x 32s linear infinite;
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:207:+.marquee__item {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:218:+.marquee__label {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:223:+.marquee__star {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:227:+@keyframes scroll-x {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:238:+  .marquee {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:242:+  .marquee__track {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:266:         <ul class="grid-3">
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:270:+              <div class="offer__top">
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:287:+              <div class="offer__price">
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:364:+.offer__top {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:434:+.offer__price {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:504:        <ul class="grid-3">
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:507:              <div class="offer__top">
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:524:              <div class="offer__price">
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:834:// ---- Aperçu services (porté de .grid-3 / .offer*) ----
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:835:.grid-3 {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:854:.offer__top {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:928:.offer__price {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1500:/bin/zsh -lc "rg -n -C 5 'hero__tags|grid-3|@media.*(max|small)|offer' app/assets/scss/base app/pages/index.vue | head -260 && printf '\\n--- diff with line numbers ---\\n' && nl -ba docs/implementation-artifacts/code-reviews/11-3/full.diff | sed -n '1,340p'" in /Users/simon/dev/jouan.ovh
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1507:app/pages/index.vue:55:        <ul class="grid-3">
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1510:app/pages/index.vue:58:              <div class="offer__top">
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1527:app/pages/index.vue:75:              <div class="offer__price">
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1554:app/pages/index.vue:382:// ---- Aperçu services (porté de .grid-3 / .offer*) ----
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1555:app/pages/index.vue:383:.grid-3 {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1573:app/pages/index.vue:402:.offer__top {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1640:app/pages/index.vue:476:.offer__price {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1683:app/pages/index.vue:599:  .grid-3,
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1756:    54	+.marquee {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1764:    62	+  &:hover .marquee__track {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1769:    67	+.marquee__track {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1774:    72	+  animation: scroll-x 32s linear infinite;
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1777:    75	+.marquee__item {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1788:    86	+.marquee__label {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1793:    91	+.marquee__star {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1797:    95	+@keyframes scroll-x {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1808:   106	+  .marquee {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1812:   110	+  .marquee__track {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1836:   134	         <ul class="grid-3">
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1840:   138	+              <div class="offer__top">
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1857:   155	+              <div class="offer__price">
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1934:   232	+.offer__top {
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1999:   297	+.offer__price {
docs/implementation-artifacts/code-reviews/11-3/full.diff:54:+.marquee {
docs/implementation-artifacts/code-reviews/11-3/full.diff:62:+  &:hover .marquee__track {
docs/implementation-artifacts/code-reviews/11-3/full.diff:67:+.marquee__track {
docs/implementation-artifacts/code-reviews/11-3/full.diff:72:+  animation: scroll-x 32s linear infinite;
docs/implementation-artifacts/code-reviews/11-3/full.diff:75:+.marquee__item {
docs/implementation-artifacts/code-reviews/11-3/full.diff:86:+.marquee__label {
docs/implementation-artifacts/code-reviews/11-3/full.diff:91:+.marquee__star {
docs/implementation-artifacts/code-reviews/11-3/full.diff:95:+@keyframes scroll-x {
docs/implementation-artifacts/code-reviews/11-3/full.diff:106:+  .marquee {
docs/implementation-artifacts/code-reviews/11-3/full.diff:110:+  .marquee__track {
docs/implementation-artifacts/code-reviews/11-3/full.diff:134:         <ul class="grid-3">
docs/implementation-artifacts/code-reviews/11-3/full.diff:138:+              <div class="offer__top">
docs/implementation-artifacts/code-reviews/11-3/full.diff:155:+              <div class="offer__price">
docs/implementation-artifacts/code-reviews/11-3/full.diff:232:+.offer__top {
docs/implementation-artifacts/code-reviews/11-3/full.diff:297:+.offer__price {
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:4023:docs/implementation-artifacts/3-2-apercu-services-et-stats.md:174:- `app/pages/index.vue` (sections services + stats ; données services/stats ; aria-label liens ; clés `v-for` stables ; styles `.section*`/`.grid-3`/`.offer*`/`.statrow`/`.stat` ; repli `forced-colors`)
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:4185:    77	        <ul class="grid-3">
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:4910:app/pages/services.vue:13:        <ul class="grid-3">
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:4917:app/pages/services.vue:25:              <div class="offer__price">
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:5469:    77	        <ul class="grid-3">
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:7083:docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-273-    .marquee__track { animation: none; }
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:56:   **Then** le composant `HomeStackMarquee.vue` affiche un bandeau défilant continu en pur CSS (animation `scroll-x` avec masque d'atténuation horizontal `mask-image: linear-gradient(...)`)
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:96:  - [x] Définir la structure de template (`.marquee`, `.marquee__track`, `.marquee__item`, séparateur `.star` avec symbole `✦`).
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:99:  - [x] Configurer l'animation CSS `@keyframes scroll-x` avec masquage horizontal `mask-image` et pause au survol (`:hover`).
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:770:+.marquee {
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:778:+  &:hover .marquee__track {
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:783:+.marquee__track {
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:788:+  animation: scroll-x 32s linear infinite;
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:791:+.marquee__item {
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:802:+.marquee__label {
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:807:+.marquee__star {
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:811:+@keyframes scroll-x {
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:822:+  .marquee {
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:826:+  .marquee__track {
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:850:         <ul class="grid-3">
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:854:+              <div class="offer__top">
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:871:+              <div class="offer__price">
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:948:+.offer__top {
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:1266:   **Then** le composant `HomeStackMarquee.vue` affiche un bandeau défilant continu en pur CSS (animation `scroll-x` avec masque d'atténuation horizontal `mask-image: linear-gradient(...)`)
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:1306:  - [x] Définir la structure de template (`.marquee`, `.marquee__track`, `.marquee__item`, séparateur `.star` avec symbole `✦`).
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:1309:  - [x] Configurer l'animation CSS `@keyframes scroll-x` avec masquage horizontal `mask-image` et pause au survol (`:hover`).
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:1757:+.marquee {
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:1765:+  &:hover .marquee__track {
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:1770:+.marquee__track {
--- rendered home excerpt ---
1:ipale" data-v-a782489c><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__link hdr__link--active" data-v-a782489c>Accueil</a><a href="/services" class="hdr__link" data-v-a782489c>Services</a><a href="/about" class="hdr__link" data-v-a782489c>À propos</a><a href="/blog" class="hdr__link" data-v-a782489c>Blog</a><a href="/contact" class="hdr__link" data-v-a782489c>Contact</a><!--]--
1:a-v-a782489c><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__menu-link hdr__menu-link--active" data-v-a782489c>Accueil</a><a href="/services" class="hdr__menu-link" data-v-a782489c>Services</a><a href="/about" class="hdr__menu-link" data-v-a782489c>À propos</a><a href="/blog" class="hdr__menu-link" data-v-a782489c>Blog</a><a href="/contact" class="hdr__menu-link" data-v-a782489
1:c>TypeScript</b><span class="marquee__star" aria-hidden="true" data-v-a14a21ec>✦</span></span><span class="marquee__item" data-v-a14a21ec><b class="marquee__label" data-v-a14a21ec>Nuxt 4</b><span class="marquee__star" aria-hidden="true" data-v-a14a21ec>✦</span></span><span class="marquee__item" data-v-a14a21ec><b class="marquee__label" data-v-a14a21ec>Vue.js</b><span class="marquee__star" aria-hidden="true" data-v-a14a21ec
1:c>TypeScript</b><span class="marquee__star" aria-hidden="true" data-v-a14a21ec>✦</span></span><span class="marquee__item" data-v-a14a21ec><b class="marquee__label" data-v-a14a21ec>Nuxt 4</b><span class="marquee__star" aria-hidden="true" data-v-a14a21ec>✦</span></span><span class="marquee__item" data-v-a14a21ec><b class="marquee__label" data-v-a14a21ec>Vue.js</b><span class="marquee__star" aria-hidden="true" data-v-a14a21ec
1:roke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-e4069fd1 data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-e4069fd1>Applications Vue 3 / Nuxt 4 &amp; NestJS</span></li><li data-v-e4069fd1><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-e4069fd1 data-v-70d
1:-6db1c85c><!--[-->Stripe Connect<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-e4069fd1><span data-v-e4069fd1>Sur devis / au sprint</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Création d&#39;applications web &amp; SaaS" data-v-e4069fd1> En savoir plus → </a><!--]--></div></li><li data-v-e4069fd1><div class="offer zcard zcard--pad zcard--interactive zcard--accen
1:oke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-e4069fd1 data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-e4069fd1>Microservices &amp; backend modulaire NestJS</span></li><li data-v-e4069fd1><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-e
1:069fd1 data-v-6db1c85c><!--[-->Node.js<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-e4069fd1><span data-v-e4069fd1>Sur devis / TJM</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Développement Full Stack TypeScript" data-v-e4069fd1> En savoir plus → </a><!--]--></div></li><li data-v-e4069fd1><div class="offer zcard zcard--pad zcard--interactive" data-v-e4069fd1 da
1:69fd1 data-v-6db1c85c><!--[-->CI/CD<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-e4069fd1><span data-v-e4069fd1>Au forfait / audit</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Évolution &amp; Architecture applicative" data-v-e4069fd1> En savoir plus → </a><!--]--></div></li><!--]--></ul></div></section><section class="section section--sunken" data-v-e4069fd1><d
1:ppeur Full Stack</span></div><p class="prose project__desc" data-v-e4069fd1>Plateforme SaaS B2B d&#39;essayage virtuel de vêtements via l&#39;IA générative (diffusion models, microservices asynchrones, files Redis).</p><ul class="hero__tags" data-v-e4069fd1><!--[--><li data-v-e4069fd1><span class="ztag" data-v-e4069fd1 data-v-6db1c85c><!--[-->nuxt<!--]--><!----></span></li><li data-v-e4069fd1><span class="ztag" data-v-e4069f
1:title" data-v-ec74c766>// Navigation</h2><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active ftr__link" data-v-ec74c766>Accueil</a><a href="/services" class="ftr__link" data-v-ec74c766>Services</a><a href="/about" class="ftr__link" data-v-ec74c766>À propos</a><a href="/blog" class="ftr__link" data-v-ec74c766>Blog</a><a href="/contact" class="ftr__link" data-v-ec74c766>Contact</a><a href

2026-09-13T18:53:43.967503Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '358,450p' 'docs/design_system/ui_kits/jouan-site/Home - Awwwards.html' && sed -n '75,130p' docs/design_system/ui_kits/jouan-site/Home.jsx" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
    <!-- SERVICES -->
    <section class="block" id="services">
      <div class="container">
        <div class="block__head reveal">
          <p class="eyebrow"><span class="c">//</span> ce que je fais</p>
          <h2>Trois façons de<br>travailler ensemble.</h2>
          <p>Du produit complet au coup de main ciblé — toujours du code propre, documenté, et pensé pour durer.</p>
        </div>
        <div class="svc" id="svc"></div>
      </div>
    </section>

    <!-- WORK -->
    <section class="block" id="work">
      <div class="container">
        <div class="block__head reveal">
          <p class="eyebrow"><span class="c">//</span> projets sélectionnés</p>
          <h2>Des produits qui tournent<br>en production.</h2>
        </div>
        <div class="work" id="worklist"></div>
        <div class="stats" id="stats"></div>
      </div>
    </section>

    <!-- JOURNAL -->
    <section class="block" id="journal">
      <div class="container">
        <div class="block__head block__head--row reveal">
          <div>
            <p class="eyebrow"><span class="c">//</span> ~/journal</p>
            <h2>Notes de dev,<br>écrites en construisant.</h2>
          </div>
          <a class="seeall" href="#journal" data-hot>cat tous-les-articles <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></a>
        </div>
        <div class="journal" id="journal-grid"></div>
      </div>
    </section>

    <!-- CTA -->
    <section class="block" id="contact">
      <div class="container reveal">
        <div class="cta">
          <p class="eyebrow" style="display:inline-block"><span class="c">$</span> ./contact --start</p>
          <h2>Un projet en tête ?<br>Mettons-le <em>en production</em>.</h2>
          <p>Décrivez-moi votre besoin — je reviens vers vous sous 24 h avec une première piste, en français, sans jargon inutile.</p>
          <div class="cta__cta">
            <a class="btn btn--primary" href="mailto:simon@jouan.ovh" data-hot><span class="mag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg> simon@jouan.ovh</span></a>
            <a class="btn btn--ghost" href="#top" data-hot><span class="mag">Voir le CV</span></a>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer id="about">
      <div class="container foot">
        <div class="foot__l">© 2026 Simon Jouan — built with <span style="color:var(--accent)">♦</span> &amp; Ubuntu Mono · valognes, fr</div>
        <div class="hexrow" id="social"></div>
      </div>
    </footer>
  </div>

<script>
  const SITE = {
    services: [
      { ico: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="m8 9 1.5 6 2.5-7 2.5 7L16 9"/>', title: "WordPress sur-mesure", desc: "Thèmes et plugins développés à la main — rapides, maintenables, faciles à éditer.", points: ["Thème sur-mesure (Tailwind)", "Blocs Gutenberg & plugins", "Perf & SEO technique"], price: "à partir de 1 500 €", feat: false },
      { ico: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>', title: "Applications web", desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, en architecture propre.", points: ["API REST / GraphQL", "Front Vue / Nuxt", "Tests & CI/CD"], price: "sur devis", feat: true },
      { ico: '<path d="M12 3l1.8 5.6L19.5 10l-5.7 1.4L12 17l-1.8-5.6L4.5 10l5.7-1.4z"/>', title: "IA & automatisation", desc: "L'IA au service du code : agents, workflows n8n, intégrations LLM.", points: ["Agents & workflows n8n", "Intégration d'API LLM", "Automatisation de contenu"], price: "sur devis", feat: false },
    ],
    work: [
      { name: "keova.app", role: "Fondateur · SaaS", desc: "Plateforme SaaS conçue et opérée de bout en bout — du schéma de données au déploiement.", tags: ["nest.js","nuxt","saas"], url: "https://keova.app" },
      { name: "patio-conseil.fr", role: "Client", desc: "Site et outils sur-mesure pour un cabinet de conseil.", tags: ["wordpress","conseil"], url: "https://patio-conseil.fr" },
    ],
    stats: [ {n:"8+",l:"ans dans la tech"}, {n:"3",l:"stacks maîtrisés"}, {n:"1",l:"SaaS fondé"} ],
    posts: [
      { title: "Intégrer un agent IA dans WordPress proprement", desc: "Brancher un LLM sur WordPress sans transformer le site en usine à gaz — architecture, sécurité et coûts maîtrisés.", date: "12 juin 2026", read: "8 min", tags: ["wordpress","ia"], img: "../../assets/backgrounds/hacker-den-1.png", url: "#journal" },
      { title: "Nuxt + Symfony : une architecture qui tient la route", desc: "Le découpage front/back de keova.app.", date: "28 mai 2026", read: "11 min", tags: ["nuxt","symfony"], img: "../../assets/backgrounds/hacker-den-2.png", url: "#journal" },
      { title: "Automatiser sa veille avec n8n et un peu de code", desc: "Collecter, résumer, publier.", date: "9 mai 2026", read: "6 min", tags: ["n8n","ia"], img: "../../assets/backgrounds/hacker-den-3.png", url: "#journal" },
    ],
    stack: ["php","symfony","wordpress","node.js","nest.js","nuxt.js","vue","typescript","docker","tailwind","n8n","mysql"],
    social: [
      { url:"https://github.com/zohac", svg:'<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>', vb:"0 0 16 16" },
      { url:"https://twitter.com/fenrir0680", svg:'<path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>', vb:"0 0 16 16" },
      { url:"https://www.linkedin.com/in/simonjouan/", svg:'<path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>', vb:"0 0 16 16" },
    ],
  };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  const arrowUR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>';

  // ---- Render services ----
  document.getElementById('svc').innerHTML = SITE.services.map((s,i)=>`
    <article class="card reveal ${s.feat?'card--feat':''}" data-tilt>
        </div>
      </div>
    </section>
  );
}

function ServicesPreview({ go }) {
  const S = window.SITE;
  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">// ce que je fais</p>
        <h2 style={{ fontSize: "var(--fs-3xl)", marginBottom: "var(--space-8)" }}>Trois façons de travailler ensemble</h2>
        <div className="grid-3">
          {S.services.map((sv) => {
            const G = window.Icon[sv.icon];
            return (
              <Card key={sv.title} interactive accent={sv.featured} featured={sv.featured} className="offer">
                <div className="offer__icon"><G /></div>
                <h3>{sv.title}</h3>
                <p>{sv.desc}</p>
                <a onClick={() => go("services")} style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-sm)", color: "var(--accent)", cursor: "pointer" }}>En savoir plus →</a>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StatsProjects({ go }) {
  const S = window.SITE;
  return (
    <section className="section section--sunken">
      <div className="container">
        <div className="statrow" style={{ marginBottom: "var(--space-12)" }}>
          {S.stats.map((s) => <div className="stat" key={s.l}><b>{s.n}</b><span>{s.l}</span></div>)}
        </div>
        <p className="eyebrow">// projets sélectionnés</p>
        <div className="grid-2" style={{ marginTop: "var(--space-5)" }}>
          {S.projects.map((p) => (
            <Card key={p.name} interactive as="a" href={p.url} target="_blank">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h3 style={{ fontSize: "var(--fs-xl)" }}>{p.name}</h3>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-xs)", color: "var(--text-muted)" }}>{p.role}</span>
              </div>
              <p className="prose" style={{ fontSize: "var(--fs-sm)", margin: "var(--space-3) 0 var(--space-4)" }}>{p.desc}</p>
              <div className="hero__tags">{p.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

codex
- `translateX(-50%)` ne correspond pas exactement à la largeur de la première série, car le `gap` entre les deux séries est inclus dans la largeur totale ; l’animation produira un saut visible à chaque boucle.

- En mode `prefers-reduced-motion`, le track conserve `width: max-content` et une seule ligne non wrapping ; `overflow: hidden` masque donc une partie des compétences au lieu de les rendre toutes consultables statiquement.

- `aria-hidden="true"` retire l’intégralité des compétences de l’arbre d’accessibilité sans fournir de liste ou d’alternative accessible.

- Le composant utilise uniquement `mask-image`, sans `-webkit-mask-image`, ce qui peut supprimer le fondu horizontal sur Safari.

- La couleur `#000` utilisée dans le dégradé de masque viole la règle imposant l’utilisation des tokens CSS.

- La valeur `margin-top: 2px` de `.offer__check` constitue un espacement hardcodé contraire aux contraintes du Design System.

- Les `ZCard` reçoivent `interactive` mais sont rendues comme des `<div>` sans gestion de clic ; seul le petit lien final est réellement actionnable, ce qui rend toute la surface visuellement trompeuse.

- La route `/services` ciblée par les trois liens affiche encore les offres WordPress, Applications web et IA legacy, et ne détaille aucune des trois nouvelles offres présentées sur l’accueil.

- Les données des offres sont dupliquées dans `index.vue` et `services.vue`, ce qui garantit une dérive future des titres, descriptions, tarifs et technologies.

- Les métadonnées SEO et le JSON-LD de `/services` décrivent toujours l’ancien catalogue, créant une incohérence entre le contenu visible de l’accueil, la page cible et les moteurs de recherche.

- Le tableau `services` de `index.vue` n’est pas typé, de sorte que les champs manquants ou les noms d’icônes invalides ne sont pas détectés par TypeScript et peuvent produire silencieusement une icône vide.

- Le fallback `SKILL_LABEL_MAP[skillKey] ?? skillKey` expose directement les identifiants internes de `SITE.skills` si une nouvelle compétence est ajoutée sans mapping.

- Le code passe la grille en une colonne jusqu’à `900px`, alors que la tâche de la story spécifie un basculement sous `860px`, modifiant la mise en page sur toute la plage 861–900px.

- Le prix est rendu en simple `<span>` en `--fs-xs`, alors que le Design System prévoit une mise en avant plus forte via `.offer__price > b` ; les tarifs indicatifs deviennent visuellement secondaires.

- La classe globale `.hero__tags` est réutilisée pour les tags des offres, ce qui couple une structure de page d’accueil à un composant qui n’appartient pas au hero et rend les évolutions de style risquées.

- Aucun test automatisé ou test d’intégration n’est ajouté pour vérifier la continuité de la boucle, la pause, le reduced-motion, l’absence de débordement ou le comportement réel des liens ; la gate lint/typecheck/generate ne couvre pas ces comportements.
tokens used
118 272
- `translateX(-50%)` ne correspond pas exactement à la largeur de la première série, car le `gap` entre les deux séries est inclus dans la largeur totale ; l’animation produira un saut visible à chaque boucle.

- En mode `prefers-reduced-motion`, le track conserve `width: max-content` et une seule ligne non wrapping ; `overflow: hidden` masque donc une partie des compétences au lieu de les rendre toutes consultables statiquement.

- `aria-hidden="true"` retire l’intégralité des compétences de l’arbre d’accessibilité sans fournir de liste ou d’alternative accessible.

- Le composant utilise uniquement `mask-image`, sans `-webkit-mask-image`, ce qui peut supprimer le fondu horizontal sur Safari.

- La couleur `#000` utilisée dans le dégradé de masque viole la règle imposant l’utilisation des tokens CSS.

- La valeur `margin-top: 2px` de `.offer__check` constitue un espacement hardcodé contraire aux contraintes du Design System.

- Les `ZCard` reçoivent `interactive` mais sont rendues comme des `<div>` sans gestion de clic ; seul le petit lien final est réellement actionnable, ce qui rend toute la surface visuellement trompeuse.

- La route `/services` ciblée par les trois liens affiche encore les offres WordPress, Applications web et IA legacy, et ne détaille aucune des trois nouvelles offres présentées sur l’accueil.

- Les données des offres sont dupliquées dans `index.vue` et `services.vue`, ce qui garantit une dérive future des titres, descriptions, tarifs et technologies.

- Les métadonnées SEO et le JSON-LD de `/services` décrivent toujours l’ancien catalogue, créant une incohérence entre le contenu visible de l’accueil, la page cible et les moteurs de recherche.

- Le tableau `services` de `index.vue` n’est pas typé, de sorte que les champs manquants ou les noms d’icônes invalides ne sont pas détectés par TypeScript et peuvent produire silencieusement une icône vide.

- Le fallback `SKILL_LABEL_MAP[skillKey] ?? skillKey` expose directement les identifiants internes de `SITE.skills` si une nouvelle compétence est ajoutée sans mapping.

- Le code passe la grille en une colonne jusqu’à `900px`, alors que la tâche de la story spécifie un basculement sous `860px`, modifiant la mise en page sur toute la plage 861–900px.

- Le prix est rendu en simple `<span>` en `--fs-xs`, alors que le Design System prévoit une mise en avant plus forte via `.offer__price > b` ; les tarifs indicatifs deviennent visuellement secondaires.

- La classe globale `.hero__tags` est réutilisée pour les tags des offres, ce qui couple une structure de page d’accueil à un composant qui n’appartient pas au hero et rend les évolutions de style risquées.

- Aucun test automatisé ou test d’intégration n’est ajouté pour vérifier la continuité de la boucle, la pause, le reduced-motion, l’absence de débordement ou le comportement réel des liens ; la gate lint/typecheck/generate ne couvre pas ces comportements.
