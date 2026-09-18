Reading prompt from stdin...
2026-09-18T17:11:54.525727Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: medium
reasoning summaries: none
session id: 01a0b580-d7b5-73b1-be01-e846022fbc22
--------
user
# Blind Hunter Prompt — Story 15.1

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/15-1/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise `bmad-review-adversarial-general` pour auditer le diff avec le niveau de scepticisme demandé, puis je vérifierai directement le contenu du fichier ciblé.
exec
/bin/zsh -lc "sed -n '1,240p' '/Users/simon/dev/jouan.ovh/.agents/skills/bmad-review-adversarial-general/SKILL.md'" in /Users/simon/dev/jouan.ovh
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
/bin/zsh -lc "wc -l 'docs/implementation-artifacts/code-reviews/15-1/full.diff' && sed -n '1,260p' 'docs/implementation-artifacts/code-reviews/15-1/full.diff'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     136 docs/implementation-artifacts/code-reviews/15-1/full.diff
diff --git a/app/pages/index.vue b/app/pages/index.vue
index 3c147fc..ce69ab7 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -52,7 +52,7 @@
       </div>
     </section>
 
-    <!-- Vitrine des 3 services cibles (Story 12.3 / AC-1) -->
+    <!-- Vitrine des 3 services cibles (Story 12.3 / AC-1 & Story 15.1 / AC-1, AC-2, AC-3) -->
     <section class="section">
       <div class="container">
         <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
@@ -77,15 +77,21 @@
                   <ZTag>{{ tag }}</ZTag>
                 </li>
               </ul>
-              <div class="offer__price">
-                <span>{{ service.price }}</span>
-              </div>
-              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
-                En savoir plus →
+              <NuxtLink to="/services" class="offer__more" :aria-label="service.actionText">
+                {{ service.actionText }}
               </NuxtLink>
             </ZCard>
           </li>
         </ul>
+
+        <!-- Encart de réassurance désancrage tarifaire (Story 15.1 / AC-3) -->
+        <div class="services-reassurance">
+          <p class="services-reassurance__text">
+            <strong>Un besoin simple ne nécessite pas forcément un gros projet.</strong>
+            Je dimensionne la solution selon le workflow réel : parfois quelques automatisations suffisent ; parfois il
+            faut construire un système métier complet.
+          </p>
+        </div>
       </div>
     </section>
 
@@ -323,7 +329,7 @@ interface HomeServiceOffer {
   desc: string;
   points: string[];
   tags: string[];
-  price: string;
+  actionText: string;
   featured: boolean;
 }
 
@@ -334,7 +340,7 @@ interface ProductionPillar {
   desc: string;
 }
 
-// Vitrine des 3 offres ciblées Systèmes IA & Automatisation (Story 12.3 / AC-1).
+// Vitrine des 3 offres ciblées Systèmes IA & Automatisation (Story 12.3 / AC-1 & Story 15.1 / AC-1, AC-2).
 const services: HomeServiceOffer[] = [
   {
     id: "automation",
@@ -348,7 +354,7 @@ const services: HomeServiceOffer[] = [
       "Synchronisation d'outils métier & reporting",
     ],
     tags: ["Workflow", "APIs", "Automation", "PostgreSQL"],
-    price: "À partir de 3 500 € HT",
+    actionText: "Voir les types d'automatisation →",
     featured: false,
   },
   {
@@ -363,7 +369,7 @@ const services: HomeServiceOffer[] = [
       "Supervision humaine obligatoire (Human-in-the-loop)",
     ],
     tags: ["Agents IA", "LLM", "MCP", "Human-in-the-loop"],
-    price: "À partir de 3 500 € HT",
+    actionText: "Voir quand utiliser un agent →",
     featured: true,
   },
   {
@@ -378,7 +384,7 @@ const services: HomeServiceOffer[] = [
       "Architecture PostgreSQL, tests QA & déploiement",
     ],
     tags: ["TypeScript", "Nuxt", "NestJS", "PostgreSQL", "Tauri"],
-    price: "Sur mesure / Sprint",
+    actionText: "Découvrir les projets sur mesure →",
     featured: false,
   },
 ];
@@ -707,18 +713,11 @@ usePageSeo({
   margin-bottom: var(--space-4);
 }
 
-.offer__price {
+.offer__more {
   margin-top: auto;
   padding-top: var(--space-4);
   border-top: 1px dashed var(--border-subtle);
   font-family: var(--font-mono);
-  font-size: var(--fs-xs);
-  color: var(--accent);
-}
-
-.offer__more {
-  margin-top: var(--space-3);
-  font-family: var(--font-mono);
   font-size: var(--fs-sm);
   color: var(--accent);
   text-decoration: none;
@@ -742,6 +741,30 @@ usePageSeo({
   }
 }
 
+// ---- Encart de Réassurance Désancrage Tarifaire (Story 15.1 / AC-3) ----
+.services-reassurance {
+  margin-top: var(--space-6);
+  padding: var(--space-5) var(--space-6);
+  background: var(--surface-1);
+  border: 1px solid var(--border-subtle);
+  border-radius: var(--radius-md);
+  box-shadow: var(--shadow-1);
+}
+
+.services-reassurance__text {
+  max-width: 80ch;
+  margin: 0;
+  font-family: var(--font-sans);
+  font-size: var(--fs-sm);
+  line-height: var(--lh-relaxed);
+  color: var(--text-body);
+
+  strong {
+    font-weight: var(--fw-medium);
+    color: var(--text-strong);
+  }
+}
+
 // ---- Bloc Différenciateur « Prototype → Production » (Story 12.3 / AC-2) ----
 .diff-block__title {
   max-width: 28ch;

exec
/bin/zsh -lc "sed -n '1,150p' app/pages/index.vue; sed -n '300,410p' app/pages/index.vue; sed -n '650,790p' app/pages/index.vue; rg -n \"actionText|offer__price|services-reassurance|En savoir plus|types d'automatisation|quand utiliser un agent|projets sur mesure\" app content docs | head -120" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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
              <NuxtLink to="/services" class="offer__more" :aria-label="service.actionText">
                {{ service.actionText }}
              </NuxtLink>
            </ZCard>
          </li>
        </ul>

        <!-- Encart de réassurance désancrage tarifaire (Story 15.1 / AC-3) -->
        <div class="services-reassurance">
          <p class="services-reassurance__text">
            <strong>Un besoin simple ne nécessite pas forcément un gros projet.</strong>
            Je dimensionne la solution selon le workflow réel : parfois quelques automatisations suffisent ; parfois il
            faut construire un système métier complet.
          </p>
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
  featured: boolean;
}

interface ProductionPillar {
  id: string;
  icon: "code" | "layers" | "spark" | "bot" | "terminal" | "zap";
  title: string;
  desc: string;
}

// Vitrine des 3 offres ciblées Systèmes IA & Automatisation (Story 12.3 / AC-1 & Story 15.1 / AC-1, AC-2).
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
    featured: false,
  },
  {
    id: "agents",
    no: "02 / 03",
    icon: "bot",
    title: "Agents IA intégrés à vos outils",
    desc: "Intégration d'agents outillés dans vos flux existants pour lire, interpréter, synthétiser et décider sans casser vos habitudes de travail.",
    points: [
      "Agents outillés (Tool Calling) & serveurs MCP",
      "Extraction structurée & analyse documentaire",
      "Supervision humaine obligatoire (Human-in-the-loop)",
    ],
    tags: ["Agents IA", "LLM", "MCP", "Human-in-the-loop"],
    actionText: "Voir quand utiliser un agent →",
    featured: true,
  },
  {
    id: "apps",
    no: "03 / 03",
    icon: "code",
    title: "Applications IA sur mesure",
    desc: "Développement complet de solutions logicielles dédiées quand le workflow nécessite une interface, un backend robuste et une base de données sur mesure.",
    points: [
      "Applications web complètes Nuxt & NestJS",
      "Applications desktop sécurisées Tauri (IA locale)",
      "Architecture PostgreSQL, tests QA & déploiement",
    ],
    tags: ["TypeScript", "Nuxt", "NestJS", "PostgreSQL", "Tauri"],
    actionText: "Découvrir les projets sur mesure →",
    featured: false,
  },
];

// 4 Piliers d'industrialisation « Prototype → Production » (Story 12.3 / AC-2).
const pillars: ProductionPillar[] = [
  {
    id: "data",
    icon: "layers",
    title: "Données",
    desc: "Provenance, structuration, stockage, rétention, secrets.",
  },
  {
    id: "reliability",
    icon: "zap",
    title: "Fiabilité",
    desc: "Cas limites, retries, fallbacks, tests, observabilité.",
  },
  {
    id: "ai",
    icon: "bot",
    title: "IA",
    desc: "Sorties structurées, versionnage, évaluations, contrôle humain.",
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
  flex-shrink: 0;
  margin-top: calc(var(--space-1) / 2);
  font-size: var(--fs-sm);
  color: var(--term-green);
}

.offer__tags {
  margin-bottom: var(--space-4);
}

.offer__more {
  margin-top: auto;
  padding-top: var(--space-4);
  border-top: 1px dashed var(--border-subtle);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--accent);
  text-decoration: none;

  &::after {
    position: absolute;
    inset: 0;
    content: "";
  }

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

// ---- Encart de Réassurance Désancrage Tarifaire (Story 15.1 / AC-3) ----
.services-reassurance {
  margin-top: var(--space-6);
  padding: var(--space-5) var(--space-6);
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-1);
}

.services-reassurance__text {
  max-width: 80ch;
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  line-height: var(--lh-relaxed);
  color: var(--text-body);

  strong {
    font-weight: var(--fw-medium);
    color: var(--text-strong);
  }
}

// ---- Bloc Différenciateur « Prototype → Production » (Story 12.3 / AC-2) ----
.diff-block__title {
  max-width: 28ch;
  margin-bottom: var(--space-4);
}

.diff-block__lead {
  max-width: 72ch;
  margin: 0 0 var(--space-8);
  font-size: var(--fs-md);
  line-height: var(--lh-relaxed);
  color: var(--text-body);
}

.pillars-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:599:Voir les types d'automatisation →
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:605:Voir quand utiliser un agent →
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:611:Découvrir les projets sur mesure →
docs/planning-artifacts/epics.md:1161:  - Lien discret `En savoir plus` vers `/confidentialite`
docs/planning-artifacts/epics.md:1244:  - *Automatisation :* « Voir les types d'automatisation → »
docs/planning-artifacts/epics.md:1245:  - *Agents IA :* « Voir quand utiliser un agent → »
docs/planning-artifacts/epics.md:1246:  - *Applications sur mesure :* « Découvrir les projets sur mesure → »
docs/planning-artifacts/sprint-change-proposal-2026-09-18.md:71:* **Objectif :** Supprimer `price: "À partir de 3 500 € HT"` sous les cartes expertises, insérer les liens d'exploration (« Voir les types d'automatisation → », etc.) et injecter la phrase de réassurance :
docs/specs/spec-analytics-search-console/compliance-gdpr.md:49:  - Lien discret : `En savoir plus` renvoyant vers `/confidentialite`.
app/pages/services.vue:27:                <div class="offer__price">
app/pages/services.vue:364:.offer__price {
docs/animations_jouan.ovh/Home animée.dc.html:99:            <span style="font-family:var(--font-mono); font-size:14px; color:var(--accent);">En savoir plus →</span>
docs/animations_jouan.ovh/Home animée.dc.html:109:            <span style="font-family:var(--font-mono); font-size:14px; color:var(--accent);">En savoir plus →</span>
docs/animations_jouan.ovh/Home animée.dc.html:119:            <span style="font-family:var(--font-mono); font-size:14px; color:var(--accent);">En savoir plus →</span>
app/pages/index.vue:80:              <NuxtLink to="/services" class="offer__more" :aria-label="service.actionText">
app/pages/index.vue:81:                {{ service.actionText }}
app/pages/index.vue:88:        <div class="services-reassurance">
app/pages/index.vue:89:          <p class="services-reassurance__text">
app/pages/index.vue:332:  actionText: string;
app/pages/index.vue:357:    actionText: "Voir les types d'automatisation →",
app/pages/index.vue:372:    actionText: "Voir quand utiliser un agent →",
app/pages/index.vue:387:    actionText: "Découvrir les projets sur mesure →",
app/pages/index.vue:745:.services-reassurance {
app/pages/index.vue:754:.services-reassurance__text {
docs/design_system/ui_kits/jouan-site/Home.jsx:96:                <a onClick={() => go("services")} style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-sm)", color: "var(--accent)", cursor: "pointer" }}>En savoir plus →</a>
docs/design_system/ui_kits/jouan-site/Services.jsx:32:                  <div className="offer__price" style={{ marginTop: "auto", paddingTop: "var(--space-5)" }}>
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:22:   **And** l'élément `.offer__price` affichant ce montant est supprimé du template HTML pour éliminer tout ancrage tarifaire public à 3 500 € HT.
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:26:   **Then** le lien générique `En savoir plus →` est remplacé par un lien d'exploration contextuel ciblant `/services` spécifique à chaque offre :
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:27:     - *Automatisation de processus métier :* `Voir les types d'automatisation →`
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:28:     - *Agents IA intégrés à vos outils :* `Voir quand utiliser un agent →`
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:29:     - *Applications IA sur mesure :* `Découvrir les projets sur mesure →`
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:50:  - [x] Modifier l'interface `HomeServiceOffer` dans `<script setup>` pour ajouter `actionText: string` et retirer `price?: string`.
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:52:    - *Automatisation :* retirer `price: "À partir de 3 500 € HT"`, ajouter `actionText: "Voir les types d'automatisation →"`
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:53:    - *Agents IA :* retirer `price: "À partir de 3 500 € HT"`, ajouter `actionText: "Voir quand utiliser un agent →"`
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:54:    - *Applications sur mesure :* retirer `price: "Sur mesure / Sprint"`, ajouter `actionText: "Découvrir les projets sur mesure →"`
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:55:  - [x] Supprimer le bloc `<div class="offer__price">` du template et afficher `service.actionText` dans le `<NuxtLink class="offer__more">`.
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:63:  - [x] Adapter la règle `.offer__more` pour qu'elle assure la séparation visuelle supérieure précédemment portée par `.offer__price` (`margin-top: auto; padding-top: var(--space-4); border-top: 1px dashed var(--border-subtle);`).
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:64:  - [x] Nettoyer la classe `.offer__price` devenue obsolète.
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:90:  <!-- SUPPRIMER : <div class="offer__price"><span>{{ service.price }}</span></div> -->
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:91:  <NuxtLink to="/services" class="offer__more" :aria-label="service.actionText">
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:92:    {{ service.actionText }}
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:100:<div class="services-reassurance">
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:101:  <p class="services-reassurance__text">
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:122:- ✅ **AC1 & AC2 :** Retrait de la propriété `price` et de la classe `.offer__price` dans `app/pages/index.vue`. Remplacement par `actionText` avec libellés contextuels (`Voir les types d'automatisation →`, `Voir quand utiliser un agent →`, `Découvrir les projets sur mesure →`) et accessibilité conservée.
docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:123:- ✅ **AC3 :** Intégration de l'encart `.services-reassurance` avec la phrase clé de désancrage tarifaire et stylisation via les tokens (`var(--surface-1)`, `var(--border-subtle)`, `var(--radius-md)`, `var(--text-body)`, `var(--text-strong)`).
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:28:  - [x] Chaque carte : icône du service, `<h3>` titre, `<p>` description, lien `En savoir plus →` vers `/services`
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:44:  - [x] Les liens `En savoir plus →` pointent vers `/services` (route créée en Epic 4 ; le lien doit exister même si la page est livrée plus tard)
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:52:- [x] [Review][Patch] Liens « En savoir plus → » identiques ×3 sans libellé distinct (a11y, WCAG 2.4.4) [app/pages/index.vue `.offer__more`] — Les 3 cartes pointent vers `/services` avec le même texte ; navigation par liens d'un lecteur d'écran = 3 liens indistincts ; le `→` littéral est aussi vocalisé. Fix : `aria-label` distinct par carte (ex. « En savoir plus sur WordPress sur-mesure ») — l'aria-label remplace le texte et neutralise le `→`. Fidèle à `Home.jsx` mais l'a11y prime (règle projet). [blind]
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:65:- **Typo** (NFR7) : Ubuntu Mono pour eyebrow, libellés stats, lien « En savoir plus », chiffres ; Ubuntu sans pour les descriptions (`.offer p` utilise `--font-sans`). [Source: docs/planning-artifacts/epics.md#NonFunctional Requirements (NFR7)]
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:91:| `<a onClick={() => go("services")}>En savoir plus →</a>` | `NuxtLink` → `/services` (Ubuntu Mono, `--accent`) |
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:145:- Chaque carte : `.offer__icon` (boîte `--space-10`/40px, fond `--accent-soft`, glyphe `ZIcon` dimensionné via `font-size`), `<h3>` titre, `<p>` description (Ubuntu sans), lien `NuxtLink` `En savoir plus →` vers `/services`.
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:165:- ✅ Resolved review finding [Patch] a11y liens : `aria-label` distinct par carte (« En savoir plus sur {titre} ») — remplace le texte identique ×3 et neutralise le `→` vocalisé. Vérifié au Chrome DevTools (3 labels distincts).
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1470:    }, "En savoir plus \u2192"));
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1604:      className: "offer__price",
docs/design_system/ui_kits/jouan-site/kit.css:128:.offer__price { font-family: var(--font-mono); font-size: var(--fs-sm); color: var(--text-muted); margin-top: var(--space-4); }
docs/design_system/ui_kits/jouan-site/kit.css:129:.offer__price b { color: var(--text-strong); font-size: var(--fs-lg); font-weight: var(--fw-bold); }
docs/implementation-artifacts/4-1-route-services-et-cartes-doffre.md:37:  - [x] Afficher l'icône d'offre (`wp` / `code` / `spark`) via le système d'icônes de la story 2.7, le titre `h3`, la description, la liste de `points` (puces `→` via la classe `.offer li`), le prix (`.offer__price` + `<b>`)
docs/implementation-artifacts/4-1-route-services-et-cartes-doffre.md:51:- [x] [Review][Patch] CTA « Discuter du projet » identique ×3 sans libellé distinct (a11y) [app/pages/services.vue — `ZButton` de carte] — Les 3 cartes rendent le même bouton-lien « Discuter du projet » → `/contact` ; navigation par liste de liens d'un lecteur d'écran = 3 cibles indistinctes (même problème que les « En savoir plus » corrigés en story 3.2). Fix : `aria-label` par offre (ex. « Discuter du projet — Applications web »), cohérent avec le correctif 3.2. [blind] — ✅ Résolu : `:aria-label="`Discuter du projet — ${offer.title}`"` sur chaque `ZButton` ; les 3 libellés distincts vérifiés dans le HTML généré.
docs/implementation-artifacts/4-1-route-services-et-cartes-doffre.md:85:- Corps de carte : `.offer__icon` (icône), `h3` titre, `p` desc, `ul/li` points (puce `→` via `.offer li::before`), `.offer__price > b` prix, `Button` pleine largeur « Discuter du projet » → `contact`. [Source: Services.jsx L28-38]
docs/implementation-artifacts/4-1-route-services-et-cartes-doffre.md:86:- Classes DS disponibles dans `kit.css` : `.section`, `.container`, `.eyebrow`, `.prose`, `.grid-3`, `.offer`, `.offer__icon`, `.offer h3/p/ul/li`, `.offer__price`. À porter en SCSS via tokens (ne pas hardcoder). [Source: docs/design_system/ui_kits/jouan-site/kit.css L18-27, L111-129]
docs/design_system/_ds_bundle.js:1470:    }, "En savoir plus \u2192"));
docs/design_system/_ds_bundle.js:1604:      className: "offer__price",
docs/design_system/components/core/Button.prompt.md:5:<Button variant="secondary">En savoir plus</Button>
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:6012:    75	              <div class="offer__price">
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:6015:    78	              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:6016:    79	                En savoir plus →
docs/design_system/components/core/Button.card.html:33:          <Button variant="secondary">En savoir plus</Button>
docs/implementation-artifacts/code-reviews/11-2/raw-acceptance-auditor.md:2790:              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
docs/implementation-artifacts/code-reviews/11-2/raw-acceptance-auditor.md:2791:                En savoir plus →
docs/implementation-artifacts/code-reviews/11-2/raw-acceptance-auditor.md:5338:    55	              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
docs/implementation-artifacts/code-reviews/11-2/raw-acceptance-auditor.md:5339:    56	                En savoir plus →
docs/implementation-artifacts/code-reviews/11-2/raw-blind-hunter.md:1844:              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
docs/implementation-artifacts/code-reviews/11-2/raw-blind-hunter.md:1845:                En savoir plus →
docs/implementation-artifacts/code-reviews/11-2/raw-blind-hunter.md:3035:    55	              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
docs/implementation-artifacts/code-reviews/11-2/raw-blind-hunter.md:3036:    56	                En savoir plus →
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:3581:              <div class="offer__price">
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:3584:              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:3585:                En savoir plus →
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:5537:1:<!DOCTYPE html><html  lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Simon Jouan — Développeur Full Stack TypeScript · Nuxt &amp; NestJS</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400;1,700&display=swap"><style>.ftr[data-v-ec74c766]{margin-top:auto;background:var(--surface-1);border-top:1px solid var(--border-subtle);padding:var(--space-12) 0 var(--space-8)}.ftr__container[data-v-ec74c766]{width:100%;max-width:var(--container-xl);margin:0 auto;padding:0 var(--space-6)}.ftr__in[data-v-ec74c766]{display:flex;flex-wrap:wrap;gap:var(--space-8);align-items:flex-start;justify-content:space-between}.ftr__brand-col[data-v-ec74c766]{max-width:300px}.ftr__brand[data-v-ec74c766]{display:inline-flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-3);text-decoration:none}.ftr__brand .ftr__logo[data-v-ec74c766]{font-size:22px;color:var(--accent)}.ftr__brand b[data-v-ec74c766]{font-family:var(--font-mono);font-size:var(--fs-md);font-weight:var(--fw-bold);color:var(--text-strong)}.ftr__brand[data-v-ec74c766]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-sm);box-shadow:var(--ring-accent)}.ftr__tagline[data-v-ec74c766]{margin:0;font-size:var(--fs-sm);color:var(--text-muted)}.ftr__col[data-v-ec74c766]{display:flex;flex-direction:column}.ftr__title[data-v-ec74c766]{margin:0 0 var(--space-3);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:var(--fw-regular);letter-spacing:var(--ls-wider);text-transform:uppercase;color:var(--text-muted)}.ftr__list[data-v-ec74c766]{display:flex;flex-direction:column;padding:0;margin:0;list-style:none}.ftr__link[data-v-ec74c766]{display:block;padding:var(--space-1) 0;font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-body);text-decoration:none;transition:color var(--dur-fast) var(--ease-standard)}.ftr__link[data-v-ec74c766]:hover{color:var(--accent)}.ftr__link[data-v-ec74c766]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-xs);box-shadow:var(--ring-accent)}.ftr__link--static[data-v-ec74c766]{cursor:default}.ftr__bottom[data-v-ec74c766],.ftr__link--static[data-v-ec74c766],.ftr__link--static[data-v-ec74c766]:hover{color:var(--text-muted)}.ftr__bottom[data-v-ec74c766]{display:flex;flex-wrap:wrap;gap:var(--space-3);justify-content:space-between;margin-top:var(--space-8);padding-top:var(--space-5);font-family:var(--font-mono);font-size:var(--fs-xs);border-top:1px solid var(--border-subtle)}.ftr__cmd[data-v-ec74c766]{color:var(--term-green)}@media(prefers-reduced-motion:reduce){.ftr__link[data-v-ec74c766]{transition:none}}</style><style>.terminal{box-sizing:border-box;position:fixed;top:60px;left:15px;z-index:1000;width:600px;height:400px;overflow:hidden;resize:both;font-family:var(--font-mono);color:var(--ink-1);border:1px solid var(--border-terminal);border-radius:var(--radius-sm);box-shadow:var(--glow-terminal)}.terminal-header{position:relative;z-index:1;display:flex;flex-wrap:nowrap;align-items:center;gap:var(--space-2);height:30px;padding:0 var(--space-3);background:var(--aubergine-black);cursor:move}.terminal-header .terminal-dots{display:flex;align-items:center;gap:7px}.terminal-header .close-button{width:13px;height:13px;cursor:pointer;background-image:linear-gradient(to bottom right,var(--term-red),#8a0000);border-radius:var(--radius-circle);box-shadow:1px 1px 2px #080206}.terminal-header .close-button:hover{filter:brightness(1.2)}.terminal-header .close-button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.terminal-header .terminal-dot{width:13px;height:13px;border-radius:var(--radius-circle);opacity:.85}.terminal-header .terminal-dot--min{background:var(--term-yellow)}.terminal-header .terminal-dot--max{background:var(--term-green)}.terminal-header .header-text{position:absolute;inset:0;font-family:var(--font-mono);font-size:var(--fs-xs);letter-spacing:var(--ls-wide);line-height:30px;color:var(--text-muted);text-align:center;pointer-events:none}.terminal-body{height:calc(100% - 30px);margin:0;padding:var(--space-4);overflow:auto;font-size:var(--fs-sm);line-height:var(--lh-snug);white-space:pre-wrap;overflow-wrap:break-word;background:var(--bg-terminal)}.terminal-body .git-prompt,.terminal-body .git-prompt-directory,.terminal-body .git-prompt-separator{display:inline}.terminal-body .git-prompt,.terminal-body .git-prompt-directory{font-weight:var(--fw-bold)}.terminal-body .git-prompt{color:var(--prompt)}.terminal-body .git-prompt-separator{color:var(--ink-1);font-weight:var(--fw-regular)}.terminal-body .git-prompt-directory{color:var(--term-blue)}.terminal-body .user-input{margin:0;padding:0;font-family:inherit;font-size:inherit;color:inherit;background-color:transparent;border:none;outline:none;caret-color:var(--prompt);caret-shape:block}.terminal-body .terminal-response{white-space:normal}.terminal-body::-webkit-scrollbar{width:10px}.terminal-body::-webkit-scrollbar-thumb{background:var(--aubergine);border-radius:var(--radius-pill)}@supports (backdrop-filter:blur(5px)) or (-webkit-backdrop-filter:blur(5px)){.terminal .terminal-body{background:color-mix(in srgb,var(--bg-terminal) 86%,transparent);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px)}}.terminal .resize-handle{position:absolute;right:0;bottom:0;width:16px;height:16px;background-color:transparent;cursor:nwse-resize}.table,table{--color-light:#ebebeb;--color-dark:#141414;--color-grey-light:#adadad;--margin:1em;border:1px dashed var(--color-light);margin:var(--margin)}.table thead,table thead{color:var(--color-dark);text-align:center;background-color:var(--color-light)}.table td,table td{padding:0 .5em}.table tbody tr:nth-child(2n),table tbody tr:nth-child(2n){background-color:var(--color-grey-light);color:var(--color-dark)}.table.w-100,table.w-100{width:calc(100% - var(--margin)*2)}.table.w-50,table.w-50{width:calc(50% - var(--margin)*2)}</style><style>.hdr[data-v-a782489c]{position:sticky;top:0;z-index:50;height:var(--header-height);background:color-mix(in srgb,var(--surface-0) 82%,transparent);border-bottom:1px solid var(--border-subtle);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}.hdr__in[data-v-a782489c]{display:flex;align-items:center;gap:var(--space-6);width:100%;max-width:var(--container-xl);height:100%;margin:0 auto;padding:0 var(--space-6)}.hdr__brand[data-v-a782489c]{display:inline-flex;align-items:center;gap:var(--space-2);text-decoration:none}.hdr__brand .hdr__logo[data-v-a782489c]{font-size:24px;color:var(--accent)}.hdr__brand b[data-v-a782489c]{font-family:var(--font-mono);font-size:var(--fs-md);font-weight:var(--fw-bold);color:var(--text-strong)}.hdr__brand[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-sm);box-shadow:var(--ring-accent)}.hdr__nav[data-v-a782489c]{display:flex;align-items:center;gap:var(--space-1);min-width:0;margin-left:var(--space-4)}.hdr__link[data-v-a782489c]{padding:var(--space-2) var(--space-3);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-muted);text-decoration:none;border-radius:var(--radius-sm);transition:color var(--dur-fast) var(--ease-standard),background var(--dur-fast) var(--ease-standard)}.hdr__link[data-v-a782489c]:hover{color:var(--text-strong);background:var(--surface-2)}.hdr__link[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hdr__link--active[data-v-a782489c]{color:var(--accent)}.hdr__right[data-v-a782489c]{display:flex;align-items:center;gap:var(--space-3);margin-left:auto}.hdr__clock[data-v-a782489c]{font-family:var(--font-mono);font-size:var(--fs-xs);color:var(--text-muted)}.hdr__burger[data-v-a782489c]{display:none;align-items:center;justify-content:center;width:36px;height:36px;font-size:20px;color:var(--text-strong);cursor:pointer;background:none;border:1px solid var(--border-default);border-radius:var(--radius-md)}.hdr__burger[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hdr__overlay[data-v-a782489c]{position:fixed;inset:var(--header-height) 0 0;z-index:40;background:var(--overlay)}.hdr__menu[data-v-a782489c]{display:none}@media(max-width:1100px){.hdr__clock[data-v-a782489c]{display:none}}@media(max-width:1000px){.hdr__badge[data-v-a782489c]{display:none}}@media(min-width:901px){.hdr__overlay[data-v-a782489c]{display:none}}@media(max-width:900px){.hdr__badge[data-v-a782489c],.hdr__clock[data-v-a782489c],.hdr__nav[data-v-a782489c],.hdr__right .hdr__action[data-v-a782489c]{display:none}.hdr__burger[data-v-a782489c]{display:inline-flex}.hdr__menu[data-v-a782489c]{position:fixed;inset:var(--header-height) 0 auto 0;z-index:45;display:flex;flex-direction:column;gap:var(--space-1);padding:var(--space-4) var(--space-6) var(--space-6);background:var(--surface-1);border-bottom:1px solid var(--border-subtle);box-shadow:var(--shadow-3);transform:translateY(-8px);opacity:0;visibility:hidden;transition:transform var(--dur-base) var(--ease-out),opacity var(--dur-base) var(--ease-standard),visibility var(--dur-base)}.hdr__menu--open[data-v-a782489c]{transform:translateY(0);opacity:1;visibility:visible}}.hdr__menu-link[data-v-a782489c]{padding:var(--space-3);font-family:var(--font-mono);font-size:var(--fs-base);color:var(--text-body);text-decoration:none;border-radius:var(--radius-sm)}.hdr__menu-link[data-v-a782489c]:hover{color:var(--text-strong);background:var(--surface-2)}.hdr__menu-link[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hdr__menu-link--active[data-v-a782489c]{color:var(--accent)}.hdr__menu-actions[data-v-a782489c]{display:flex;flex-direction:column;gap:var(--space-2);margin-top:var(--space-3)}@media(prefers-reduced-motion:reduce){.hdr__link[data-v-a782489c],.hdr__menu[data-v-a782489c]{transition:none}}</style><style>.init[data-v-e3708db0]{background:var(--bg-page);display:flex;flex-direction:column;margin:0;min-height:100vh;width:100%;max-width:100vw}</style><style>.zicon[data-v-70d98695]{display:inline-block;flex:none;width:1em;height:1em;vertical-align:middle}</style><style>.zbadge[data-v-fc077828]{display:inline-flex;align-items:center;gap:var(--space-2);box-sizing:border-box;height:22px;padding:0 var(--space-2);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:var(--fw-medium);line-height:1;letter-spacing:var(--ls-wide);white-space:nowrap;border:1px solid transparent;border-radius:var(--radius-sm)}.zbadge__dot[data-v-fc077828]{width:6px;height:6px;background:currentcolor;border-radius:var(--radius-circle)}.zbadge--neutral[data-v-fc077828]{background:var(--surface-3);color:var(--text-body);border-color:var(--border-default)}.zbadge--accent[data-v-fc077828]{background:var(--accent-soft);color:var(--accent);border-color:#f871164d}.zbadge--success[data-v-fc077828]{background:var(--success-soft);color:var(--success);border-color:#297a4880}.zbadge--warning[data-v-fc077828]{background:var(--warning-soft);color:var(--warning);border-color:#8b611880}.zbadge--danger[data-v-fc077828]{background:var(--danger-soft);color:var(--danger);border-color:#8a282880}.zbadge--info[data-v-fc077828]{background:var(--info-soft);color:var(--info);border-color:#255b7e80}</style><style>.zbtn[data-v-c154e5b1]{--_h:36px;--_px:var(--space-4);--_fs:var(--fs-sm);display:inline-flex;align-items:center;justify-content:center;gap:var(--space-2);box-sizing:border-box;height:var(--_h);padding:0 var(--_px);font-family:var(--font-mono);font-size:var(--_fs);font-weight:var(--fw-medium);line-height:1;letter-spacing:var(--ls-wide);white-space:nowrap;text-decoration:none;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;border:1px solid transparent;border-radius:var(--radius-md);transition:background var(--dur-fast) var(--ease-standard),border-color var(--dur-fast) var(--ease-standard),color var(--dur-fast) var(--ease-standard),transform var(--dur-fast) var(--ease-standard)}.zbtn[data-v-c154e5b1]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.zbtn[data-v-c154e5b1]:disabled,.zbtn[aria-disabled=true][data-v-c154e5b1]{opacity:.45;cursor:not-allowed;pointer-events:none}.zbtn__icon[data-v-c154e5b1]{display:inline-flex;width:1.05em;height:1.05em}.zbtn__icon[data-v-c154e5b1] svg{width:100%;height:100%}.zbtn--sm[data-v-c154e5b1]{--_h:28px;--_px:var(--space-3);--_fs:var(--fs-xs)}.zbtn--lg[data-v-c154e5b1]{--_h:44px;--_px:var(--space-5);--_fs:var(--fs-base)}.zbtn--primary[data-v-c154e5b1]{background:var(--accent);color:var(--accent-text);border-color:var(--accent)}.zbtn--primary[data-v-c154e5b1]:hover{background:var(--accent-hover);border-color:var(--accent-hover)}.zbtn--primary[data-v-c154e5b1]:active{background:var(--accent-active);border-color:var(--accent-active);transform:translateY(1px)}.zbtn--secondary[data-v-c154e5b1]{background:var(--surface-2);color:var(--text-strong);border-color:var(--border-default)}.zbtn--secondary[data-v-c154e5b1]:hover{background:var(--surface-3);border-color:var(--border-strong)}.zbtn--secondary[data-v-c154e5b1]:active{transform:translateY(1px)}.zbtn--ghost[data-v-c154e5b1]{background:transparent;color:var(--text-body);border-color:transparent}.zbtn--ghost[data-v-c154e5b1]:hover{background:var(--surface-2);color:var(--text-strong)}.zbtn--terminal[data-v-c154e5b1]{background:var(--bg-terminal);color:var(--term-green);border-color:var(--accent-2-soft)}.zbtn--terminal[data-v-c154e5b1]:hover{border-color:var(--term-green);box-shadow:var(--glow-terminal)}.zbtn--danger[data-v-c154e5b1]{background:var(--danger);color:var(--ink-on-accent);border-color:var(--danger)}.zbtn--danger[data-v-c154e5b1]:hover{filter:brightness(1.08)}.zbtn--danger[data-v-c154e5b1]:active{transform:translateY(1px)}@media(prefers-reduced-motion:reduce){.zbtn[data-v-c154e5b1]{transition:none}}</style><style>.boot[data-v-f59a7d91]{position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;cursor:pointer;background:var(--surface-0);transition:opacity var(--dur-slow) var(--ease-out),visibility var(--dur-slow)}.boot.boot--done[data-v-f59a7d91]{pointer-events:none;visibility:hidden;opacity:0}.boot__in[data-v-f59a7d91]{width:min(560px,88vw);font-family:var(--font-mono);font-size:var(--fs-sm)}.boot__logo[data-v-f59a7d91]{display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-5);color:var(--text-strong)}.boot__logo b[data-v-f59a7d91]{font-size:var(--fs-lg)}.boot__logo-icon[data-v-f59a7d91]{font-size:26px;color:var(--accent)}.boot__line[data-v-f59a7d91]{min-height:1.6em;color:var(--text-muted)}.boot__ok[data-v-f59a7d91]{color:var(--term-green)}.boot__bar[data-v-f59a7d91]{height:3px;margin-top:var(--space-5);overflow:hidden;background:var(--surface-3);border-radius:var(--radius-xs)}.boot__bar i[data-v-f59a7d91]{display:block;width:0;height:100%;background:linear-gradient(90deg,var(--accent),var(--aubergine-light));transition:width .1s linear}.boot__skip[data-v-f59a7d91]{display:inline-block;margin-top:var(--space-4);padding:0;font-family:inherit;font-size:var(--fs-xs);letter-spacing:var(--ls-wide);color:var(--text-faint);cursor:pointer;background:none;border:none}.boot__skip[data-v-f59a7d91]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}@media(prefers-reduced-motion:reduce){.boot[data-v-f59a7d91]{display:none}}</style><style>.atmos[data-v-796c86c1]{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none}.aurora[data-v-796c86c1]{position:absolute;border-radius:var(--radius-circle);filter:blur(80px);mix-blend-mode:screen;will-change:transform}.aurora--orange[data-v-796c86c1]{top:-22%;left:48%;width:60vw;height:60vw;background:radial-gradient(circle at center,var(--orange-500),transparent 62%);opacity:.55;animation:drift-orange-796c86c1 26s var(--ease-in-out) infinite}.aurora--auberg[data-v-796c86c1]{top:6%;left:-22%;width:64vw;height:64vw;background:radial-gradient(circle at center,var(--aubergine-vivid),transparent 62%);opacity:.7;animation:drift-auberg-796c86c1 32s var(--ease-in-out) infinite}.aurora--red[data-v-796c86c1]{top:44%;left:26%;width:44vw;height:44vw;background:radial-gradient(circle at center,var(--term-red),transparent 64%);opacity:.4;animation:drift-red-796c86c1 30s var(--ease-in-out) infinite}.grid-dots[data-v-796c86c1]{background-image:radial-gradient(color-mix(in srgb,var(--ink-1) 6%,transparent) 1px,transparent 1px);background-size:34px 34px;-webkit-mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,var(--surface-0) 30%,transparent 78%);mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,var(--surface-0) 30%,transparent 78%)}.grid-dots[data-v-796c86c1],.scanlines[data-v-796c86c1]{position:absolute;inset:0}.scanlines[data-v-796c86c1]{opacity:.35;background:repeating-linear-gradient(0deg,color-mix(in srgb,var(--surface-0) 24%,transparent) 0 1px,transparent 1px 3px)}.vignette[data-v-796c86c1]{position:absolute;inset:0;background:radial-gradient(ellipse 120% 90% at 50% 0,transparent 55%,var(--surface-0) 100%)}@keyframes drift-orange-796c86c1{0%,to{transform:translate(0) scale(1)}50%{transform:translate(-6vw,5vh) scale(1.12)}}@keyframes drift-auberg-796c86c1{0%,to{transform:translate(0) scale(1)}50%{transform:translate(7vw,-4vh) scale(1.08)}}@keyframes drift-red-796c86c1{0%,to{transform:translate(0) scale(1)}50%{transform:translate(-4vw,-6vh) scale(1.15)}}@media(prefers-reduced-motion:reduce){.aurora[data-v-796c86c1]{animation:none}}</style><style>.cursor-dot[data-v-0096a69c],.cursor-ring[data-v-0096a69c]{position:fixed;top:0;left:0;z-index:90;border-radius:var(--radius-circle);mix-blend-mode:difference;opacity:0;pointer-events:none;transition:opacity var(--dur-base) var(--ease-standard)}.cursor-dot.is-visible[data-v-0096a69c],.cursor-ring.is-visible[data-v-0096a69c]{opacity:1}.cursor-dot[data-v-0096a69c]{width:6px;height:6px;background:var(--ink-1)}.cursor-ring[data-v-0096a69c]{width:34px;height:34px;border:1px solid color-mix(in srgb,var(--ink-1) 70%,transparent);transition:width var(--dur-base) var(--ease-out),height var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out),opacity var(--dur-base) var(--ease-standard)}.cursor-ring.is-hot[data-v-0096a69c]{width:56px;height:56px;border-color:var(--accent)}@media(hover:none),(prefers-reduced-motion:reduce){.cursor-dot[data-v-0096a69c],.cursor-ring[data-v-0096a69c]{display:none}}</style><style>.hero-term[data-v-313a6524]{display:flex;flex-direction:column;min-height:300px;overflow:hidden;border:1px solid var(--accent-2-soft);border-radius:var(--radius-sm);box-shadow:var(--glow-terminal)}.hero-term__bar[data-v-313a6524]{position:relative;display:flex;flex:none;align-items:center;gap:var(--space-2);height:30px;padding:0 var(--space-3);background:var(--aubergine-black)}.hero-term__dots[data-v-313a6524]{display:flex;align-items:center;gap:7px}.hero-term__dot[data-v-313a6524]{width:13px;height:13px;border-radius:var(--radius-circle)}.hero-term__dot--close[data-v-313a6524]{background:var(--term-red)}.hero-term__dot--min[data-v-313a6524]{background:var(--term-yellow)}.hero-term__dot--max[data-v-313a6524]{background:var(--term-green)}.hero-term__title[data-v-313a6524]{position:absolute;inset:0;font-family:var(--font-mono);font-size:var(--fs-xs);letter-spacing:var(--ls-wide);color:var(--text-muted);text-align:center;pointer-events:none}.hero-term__body[data-v-313a6524]{flex:1;min-height:0;padding:var(--space-4);overflow:auto;font-family:var(--font-mono);font-size:var(--fs-sm);line-height:var(--lh-snug);color:var(--ink-1);background:var(--bg-terminal);overflow-wrap:break-word}@supports (backdrop-filter:blur(5px)){.hero-term__body[data-v-313a6524]{background:color-mix(in srgb,var(--bg-terminal) 86%,transparent);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px)}}.hero-term__line[data-v-313a6524]{margin:0}.hero-term__out[data-v-313a6524]{margin:0 0 var(--space-4)}.hero-term__out--ink[data-v-313a6524]{color:var(--ink-1)}.hero-term__out--blue[data-v-313a6524]{color:var(--term-blue)}.hero-term__out--green[data-v-313a6524]{color:var(--term-green)}.hero-term__open[data-v-313a6524]{display:block;width:100%;padding:0;font:inherit;text-align:left;cursor:pointer;background:none;border:none;border-radius:var(--radius-xs)}.hero-term__open[data-v-313a6524]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.prm[data-v-313a6524]{font-family:var(--font-mono)}.prm__user[data-v-313a6524]{font-weight:var(--fw-bold);color:var(--prompt)}.prm__sep[data-v-313a6524]{color:var(--ink-1)}.prm__dir[data-v-313a6524]{font-weight:var(--fw-bold);color:var(--term-blue)}.prm__cmd[data-v-313a6524]{color:var(--ink-1)}.prm__caret[data-v-313a6524]{display:inline-block;width:.55em;height:1.05em;margin-left:1px;vertical-align:text-bottom;background:var(--prompt);animation:caret-blink 1s steps(1) infinite}@media(prefers-reduced-motion:reduce){.prm__caret[data-v-313a6524]{animation:none}}</style><style>.marquee[data-v-19576991]{display:block;width:100%;padding-block:var(--space-5);overflow:hidden;border-block:1px solid var(--border-subtle);-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}.marquee:hover .marquee__track[data-v-19576991]{animation-play-state:paused}.marquee__track[data-v-19576991]{display:flex;gap:var(--space-8);width:-moz-max-content;width:max-content;will-change:transform;animation:scroll-x-19576991 32s linear infinite}.marquee__item[data-v-19576991]{display:inline-flex;gap:var(--space-8);align-items:center;font-family:var(--font-mono);font-size:var(--fs-xl);letter-spacing:var(--ls-wide);color:var(--text-faint);white-space:nowrap}.marquee__label[data-v-19576991]{font-weight:var(--fw-regular);color:var(--text-body)}.marquee__star[data-v-19576991]{color:var(--accent)}@keyframes scroll-x-19576991{0%{transform:translate(0)}to{transform:translate(calc(-50% - var(--space-8)/2))}}@media(prefers-reduced-motion:reduce){.marquee[data-v-19576991]{-webkit-mask-image:none;mask-image:none}.marquee__track[data-v-19576991]{animation:none}.marquee__item--duplicate[data-v-19576991]{display:none}}</style><style>.home[data-v-80e32bdd]{display:block}.anim[data-v-80e32bdd]{animation:fade-rise var(--dur-slow) var(--ease-out) both}.hero__term-col[data-v-80e32bdd]{animation-delay:80ms}.hero[data-v-80e32bdd]{position:relative;overflow:hidden}.hero__grad[data-v-80e32bdd]{background:radial-gradient(900px 500px at 78% -10%,color-mix(in srgb,var(--accent) 16%,transparent),transparent 60%),radial-gradient(700px 500px at 0 110%,color-mix(in srgb,var(--aubergine-vivid) 28%,transparent),transparent 60%),var(--bg-page)}.hero__in[data-v-80e32bdd]{position:relative;z-index:1;padding-block:var(--space-20)}.hero__grid[data-v-80e32bdd]{display:grid;grid-template-columns:1.05fr .95fr;gap:var(--space-12);align-items:center}.hero__title[data-v-80e32bdd]{font-family:var(--font-mono);font-size:var(--fs-6xl);font-weight:var(--fw-light);letter-spacing:var(--ls-tight);color:var(--text-strong)}.hero__title em[data-v-80e32bdd]{font-style:normal;color:var(--accent)}.hero__sub[data-v-80e32bdd]{max-width:46ch;margin:var(--space-5) 0 var(--space-6);font-family:var(--font-sans);font-size:var(--fs-lg);line-height:var(--lh-relaxed);color:var(--text-body)}.hero__cta[data-v-80e32bdd]{display:flex;flex-wrap:wrap;gap:var(--space-3);margin-bottom:var(--space-6)}.hero__badge-wrap[data-v-80e32bdd]{display:inline-flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-6);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-muted)}.hero__badge-wrap a[data-v-80e32bdd]{color:var(--accent);text-decoration:underline}.hero__badge-wrap a[data-v-80e32bdd]:hover{color:var(--accent-hover)}.hero__badge-wrap a[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hero__pulse-dot[data-v-80e32bdd]{width:8px;height:8px;border-radius:var(--radius-circle);background:var(--success);box-shadow:0 0 color-mix(in srgb,var(--success) 60%,transparent);animation:pulse-dot-80e32bdd 2.2s infinite var(--ease-out)}@media(prefers-reduced-motion:reduce){.hero__pulse-dot[data-v-80e32bdd]{animation:none}}@keyframes pulse-dot-80e32bdd{0%{box-shadow:0 0 color-mix(in srgb,var(--success) 60%,transparent)}70%{box-shadow:0 0 0 6px color-mix(in srgb,var(--success) 0%,transparent)}to{box-shadow:0 0 color-mix(in srgb,var(--success) 0%,transparent)}}.section__title[data-v-80e32bdd]{margin-bottom:var(--space-8);font-family:var(--font-mono);font-size:var(--fs-3xl);font-weight:var(--fw-regular);color:var(--text-strong)}.grid-3[data-v-80e32bdd]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-5);margin:0;padding:0;list-style:none}.grid-3>li[data-v-80e32bdd],.offer[data-v-80e32bdd]{display:flex}.offer[data-v-80e32bdd]{flex-direction:column;width:100%}.offer__top[data-v-80e32bdd]{justify-content:space-between;margin-bottom:var(--space-4)}.offer__icon[data-v-80e32bdd],.offer__top[data-v-80e32bdd]{display:flex;align-items:center}.offer__icon[data-v-80e32bdd]{justify-content:center;width:var(--space-10);height:var(--space-10);font-size:22px;color:var(--accent);background:var(--accent-soft);border-radius:var(--radius-md)}.offer__no[data-v-80e32bdd]{font-size:var(--fs-xs);letter-spacing:var(--ls-wider);color:var(--text-faint)}.offer__no[data-v-80e32bdd],.offer__title[data-v-80e32bdd]{font-family:var(--font-mono)}.offer__title[data-v-80e32bdd]{margin-bottom:var(--space-2);font-size:var(--fs-xl);font-weight:var(--fw-regular);color:var(--text-strong)}.offer__desc[data-v-80e32bdd]{margin:0 0 var(--space-4);font-family:var(--font-sans);font-size:var(--fs-sm);line-height:var(--lh-relaxed);color:var(--text-body)}.offer__points[data-v-80e32bdd]{display:flex;flex-direction:column;gap:var(--space-2);margin:0 0 var(--space-4);padding:0;list-style:none}.offer__points li[data-v-80e32bdd]{display:flex;gap:var(--space-2);align-items:flex-start;font-family:var(--font-mono);font-size:var(--fs-xs);line-height:var(--lh-normal);color:var(--text-muted)}.offer__check[data-v-80e32bdd]{flex-shrink:0;margin-top:calc(var(--space-1)/2);font-size:var(--fs-sm);color:var(--term-green)}.offer__tags[data-v-80e32bdd]{margin-bottom:var(--space-4)}.offer__price[data-v-80e32bdd]{margin-top:auto;padding-top:var(--space-4);border-top:1px dashed var(--border-subtle);font-size:var(--fs-xs)}.offer__more[data-v-80e32bdd],.offer__price[data-v-80e32bdd]{font-family:var(--font-mono);color:var(--accent)}.offer__more[data-v-80e32bdd]{margin-top:var(--space-3);font-size:var(--fs-sm);text-decoration:none}.offer__more[data-v-80e32bdd]:hover{text-decoration:underline}.offer__more[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent);border-radius:var(--radius-xs)}.work[data-v-80e32bdd]{display:flex;flex-direction:column;margin:0;padding:0;list-style:none}.work>li[data-v-80e32bdd]{display:block;width:100%}.work__row[data-v-80e32bdd]{position:relative;display:grid;grid-template-columns:56px 1fr auto;gap:var(--space-6);align-items:center;padding:var(--space-8) var(--space-3);border-top:1px solid var(--border-subtle);text-decoration:none;color:inherit;transition:padding-left var(--dur-slow) var(--ease-out),background var(--dur-slow) var(--ease-standard)}.work__row[data-v-80e32bdd]:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,var(--accent-soft),transparent 60%);opacity:0;transition:opacity var(--dur-slow) var(--ease-standard)}li:last-child .work__row[data-v-80e32bdd]{border-bottom:1px solid var(--border-subtle)}.work__row--link[data-v-80e32bdd]{cursor:pointer}.work__row--link[data-v-80e32bdd]:hover{padding-left:var(--space-6)}.work__row--link[data-v-80e32bdd]:hover:before{opacity:1}.work__row--link:hover .work__name[data-v-80e32bdd]{color:var(--accent)}.work__row--link:hover .work__go[data-v-80e32bdd]{color:var(--accent);transform:translate(6px,-6px)}.work__row--link[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent);border-radius:var(--radius-xs)}.work__no[data-v-80e32bdd]{font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-faint)}.work__main[data-v-80e32bdd],.work__no[data-v-80e32bdd]{position:relative}.work__topline[data-v-80e32bdd]{display:flex;flex-wrap:wrap;align-items:baseline;gap:var(--space-3)}.work__name[data-v-80e32bdd]{margin:0;font-family:var(--font-mono);font-size:clamp(1.4rem,2.8vw,2rem);font-weight:var(--fw-regular);letter-spacing:var(--ls-tight);color:var(--text-strong);transition:color var(--dur-base) var(--ease-standard)}.work__status[data-v-80e32bdd]{color:var(--accent);letter-spacing:var(--ls-wide)}.work__role[data-v-80e32bdd],.work__status[data-v-80e32bdd]{font-family:var(--font-mono);font-size:var(--fs-xs)}.work__role[data-v-80e32bdd]{margin:var(--space-1) 0 0;color:var(--text-muted)}.work__desc[data-v-80e32bdd]{max-width:65ch;margin:var(--space-3) 0 0;font-size:var(--fs-sm)}.work__tags[data-v-80e32bdd]{margin-top:var(--space-4)}.work__go[data-v-80e32bdd]{position:relative;font-size:var(--fs-xl);color:var(--text-faint);transition:transform var(--dur-base) var(--ease-out),color var(--dur-base) var(--ease-standard)}.stats[data-v-80e32bdd]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin:var(--space-12) 0 0;padding:0;list-style:none}.stat[data-v-80e32bdd]{padding:var(--space-6);background:color-mix(in srgb,var(--surface-1) 70%,transparent);border:1px solid var(--border-subtle);border-radius:var(--radius-md)}.stat b[data-v-80e32bdd]{display:block;margin-bottom:var(--space-1);font-size:var(--fs-5xl);font-weight:var(--fw-light);line-height:1;letter-spacing:var(--ls-tight);color:var(--text-strong)}.stat b[data-v-80e32bdd],.stat span[data-v-80e32bdd]{font-family:var(--font-mono)}.stat span[data-v-80e32bdd]{font-size:var(--fs-sm);letter-spacing:var(--ls-wide);color:var(--text-muted)}.block__head--row[data-v-80e32bdd]{display:flex;align-items:flex-end;justify-content:space-between;gap:var(--space-6);margin-bottom:var(--space-8)}.block__head--row .section__title[data-v-80e32bdd]{margin-bottom:0}.seeall[data-v-80e32bdd]{display:inline-flex;flex:none;align-items:center;gap:var(--space-2);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-muted);text-decoration:none;white-space:nowrap;transition:color var(--dur-base) var(--ease-standard)}.seeall[data-v-80e32bdd]:hover{color:var(--accent)}.seeall[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent);border-radius:var(--radius-xs)}.seeall__icon[data-v-80e32bdd]{font-size:var(--fs-base)}.journal[data-v-80e32bdd]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-5);margin:0;padding:0;list-style:none}.journal>li[data-v-80e32bdd],.jpost[data-v-80e32bdd]{display:flex}.jpost[data-v-80e32bdd]{flex-direction:column;width:100%;color:inherit;text-decoration:none}.jpost:hover .jpost__title[data-v-80e32bdd]{color:var(--accent)}.jpost:hover .jpost__arrow[data-v-80e32bdd]{color:var(--accent);transform:translate(4px,-4px)}.jpost__thumb[data-v-80e32bdd]{width:100%;height:160px;-o-object-fit:cover;object-fit:cover;border-bottom:1px solid var(--border-subtle)}.jpost__body[data-v-80e32bdd]{display:flex;flex:1;flex-direction:column;padding:var(--space-5)}.jpost__tags[data-v-80e32bdd]{margin-bottom:var(--space-3)}.jpost__title[data-v-80e32bdd]{margin:0 0 var(--space-2);font-family:var(--font-mono);font-size:var(--fs-lg);font-weight:var(--fw-regular);line-height:var(--lh-snug);color:var(--text-strong);transition:color var(--dur-base) var(--ease-standard)}.jpost__desc[data-v-80e32bdd]{margin:0 0 var(--space-4);font-size:var(--fs-sm);color:var(--text-muted)}.jpost__meta[data-v-80e32bdd]{display:flex;align-items:center;gap:var(--space-2);margin-top:auto;padding-top:var(--space-4);border-top:1px dashed var(--border-subtle);font-family:var(--font-mono);font-size:var(--fs-xs);color:var(--text-faint)}.jpost__arrow[data-v-80e32bdd]{margin-left:auto;font-size:var(--fs-base);color:var(--text-faint);transition:transform var(--dur-base) var(--ease-out),color var(--dur-base) var(--ease-standard)}.journal__empty[data-v-80e32bdd]{max-width:60ch;margin:0 auto;text-align:center}.journal__empty-code[data-v-80e32bdd]{margin:0 0 var(--space-2);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--accent)}.journal__empty-text[data-v-80e32bdd]{margin:0 0 var(--space-5);font-family:var(--font-sans);font-size:var(--fs-sm);line-height:var(--lh-relaxed);color:var(--text-muted)}.cta[data-v-80e32bdd]{position:relative;padding:clamp(48px,6vw,72px) var(--space-6);overflow:hidden;text-align:center;background:radial-gradient(ellipse 80% 120% at 50% 0,var(--accent-2-soft),transparent 70%),color-mix(in srgb,var(--surface-2) 60%,transparent);border:1px solid var(--border-subtle);border-radius:var(--radius-lg)}.cta__eyebrow[data-v-80e32bdd]{display:inline-block}.cta__title[data-v-80e32bdd]{margin:0 0 var(--space-4);font-family:var(--font-mono);font-size:clamp(1.8rem,4vw,2.8rem);font-weight:var(--fw-light);line-height:var(--lh-tight);letter-spacing:var(--ls-tight);color:var(--text-strong)}.cta__highlight[data-v-80e32bdd]{font-style:italic;color:var(--accent)}.cta__subtitle[data-v-80e32bdd]{max-width:58ch;margin:0 auto var(--space-8);font-family:var(--font-sans);font-size:var(--fs-base);line-height:var(--lh-relaxed);color:var(--text-muted)}.cta__actions[data-v-80e32bdd]{display:flex;flex-wrap:wrap;gap:var(--space-4);justify-content:center}@media(max-width:900px){.hero__grid[data-v-80e32bdd]{grid-template-columns:1fr}.hero__title[data-v-80e32bdd]{font-size:var(--fs-4xl)}.grid-3[data-v-80e32bdd],.journal[data-v-80e32bdd]{grid-template-columns:1fr}.block__head--row[data-v-80e32bdd]{flex-direction:column;align-items:flex-start}}@media(max-width:680px){.work__row[data-v-80e32bdd]{grid-template-columns:1fr;gap:var(--space-3)}.work__go[data-v-80e32bdd],.work__no[data-v-80e32bdd]{display:none}.stats[data-v-80e32bdd]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.anim[data-v-80e32bdd]{animation:none}.jpost__arrow[data-v-80e32bdd],.work__go[data-v-80e32bdd],.work__row[data-v-80e32bdd]{transition:none}.work__row--link[data-v-80e32bdd]:hover{padding-left:var(--space-3)}.work__row--link:hover .work__go[data-v-80e32bdd]{transform:none}}</style><style>.hexrow[data-v-a86d2094]{display:flex;gap:var(--space-5);margin:0;padding:0;list-style:none}</style><style>.hex[data-v-274e53e2]{display:inline-flex;align-items:center;justify-content:center;width:46px;height:53px;font-size:20px;color:var(--text-muted);cursor:pointer;background:var(--surface-2);clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);transition:color var(--dur-base) var(--ease-standard),background var(--dur-base) var(--ease-standard)}.hex[data-v-274e53e2]:hover{color:var(--ink-on-accent);background:var(--accent)}.hex[data-v-274e53e2]:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.hex__label[data-v-274e53e2]{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;white-space:nowrap;border:0;clip-path:inset(50%)}@media(prefers-reduced-motion:reduce){.hex[data-v-274e53e2]{transition:none}}</style><style>.zcard[data-v-c5ec7be1]{position:relative;overflow:hidden;background:var(--bg-card);color:var(--text-body);border:1px solid var(--border-subtle);border-radius:var(--radius-md);box-shadow:var(--shadow-2),var(--shadow-hairline);transition:border-color var(--dur-base) var(--ease-standard),transform var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-standard)}.zcard--pad[data-v-c5ec7be1]{padding:var(--space-6)}.zcard--interactive[data-v-c5ec7be1]{cursor:pointer}.zcard--interactive[data-v-c5ec7be1]:hover{border-color:var(--border-strong);transform:translateY(-2px);box-shadow:var(--shadow-3),var(--shadow-hairline)}.zcard--interactive[data-v-c5ec7be1]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.zcard--accent[data-v-c5ec7be1]:before{content:"";position:absolute;inset:0 0 auto;height:2px;background:linear-gradient(90deg,var(--accent),var(--aubergine-light))}.zcard--featured[data-v-c5ec7be1]{border-color:var(--accent-ring);box-shadow:var(--glow-accent),var(--shadow-hairline)}@media(prefers-reduced-motion:reduce){.zcard[data-v-c5ec7be1]{transition:none}.zcard--interactive[data-v-c5ec7be1]:hover{transform:none}}</style><style>.ztag[data-v-6db1c85c]{display:inline-flex;align-items:center;gap:var(--space-2);box-sizing:border-box;height:26px;padding:0 var(--space-3);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:var(--fw-regular);line-height:1;white-space:nowrap;color:var(--text-body);background:var(--surface-2);border:1px solid var(--border-subtle);border-radius:var(--radius-pill);transition:border-color var(--dur-fast) var(--ease-standard),color var(--dur-fast) var(--ease-standard)}.ztag[data-v-6db1c85c]:before{content:"#";color:var(--accent)}.ztag--plain[data-v-6db1c85c]:before{display:none;content:none}.ztag--clickable[data-v-6db1c85c]{cursor:pointer}.ztag--clickable[data-v-6db1c85c]:hover{border-color:var(--border-strong);color:var(--text-strong)}.ztag--clickable[data-v-6db1c85c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.ztag__remove[data-v-6db1c85c]{display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;margin-right:-2px;padding:0;font-family:var(--font-mono);font-size:var(--fs-sm);line-height:1;color:var(--text-muted);cursor:pointer;background:none;border:none;border-radius:var(--radius-circle)}.ztag__remove[data-v-6db1c85c]:hover{color:var(--term-red)}.ztag__remove[data-v-6db1c85c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}@media(prefers-reduced-motion:reduce){.ztag[data-v-6db1c85c]{transition:none}}</style><link rel="stylesheet" href="/_nuxt/entry.QaoIl47T.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZButton.CyAD_ftR.css" crossorigin><link rel="stylesheet" href="/_nuxt/LinkListComponent.BRYW5MSq.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZBadge.BAw1B01J.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZTag.f2Aq6DLg.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZCard.C5C9a-aj.css" crossorigin><link rel="modulepreload" as="script" crossorigin href="/_nuxt/kT-s8AA-.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/94XchtD0.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CZy76wlf.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/DlAUqK2U.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CDaHTzsF.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/DMhLy-fw.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CMQEDqfi.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/OpxrMEpG.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/C93KKm9n.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/1LEPDT53.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/ZsGxQ2mD.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/p0temu7u.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/BGMjmYXP.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CXmFvnQY.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/DvmfV0_A.js"><script type="module" src="/_nuxt/kT-s8AA-.js" crossorigin></script><meta name="description" content="Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL."><link rel="icon" type="image/x-icon" href="/favicon.ico"><script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","@id":"https://jouan.ovh/#organization","name":"Simon Jouan","url":"https://jouan.ovh","logo":"https://jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Rouen, France","addressCountry":"FR"}}</script><link rel="canonical" href="https://jouan.ovh"><script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"Simon Jouan — Développeur Full Stack TypeScript","url":"https://jouan.ovh","description":"Développeur Full Stack TypeScript — Nuxt / NestJS"}</script><script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Simon Jouan","jobTitle":"Développeur Full Stack TypeScript — Nuxt / NestJS","url":"https://jouan.ovh","image":"https://jouan.ovh/images/portrait.jpeg","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Rouen, France","addressCountry":"FR"}}</script><meta property="og:title" content="Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS"><meta property="og:description" content="Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL."><meta property="og:url" content="https://jouan.ovh"><meta property="og:type" content="website"><meta property="og:image" content="https://jouan.ovh/images/portrait.jpeg"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS"><meta name="twitter:description" content="Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL."><meta name="twitter:image" content="https://jouan.ovh/images/portrait.jpeg"></head><body><div id="__nuxt"><div class="init" data-v-e3708db0><header class="hdr" data-v-e3708db0 data-v-a782489c><div class="hdr__in" data-v-a782489c><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__brand" data-v-a782489c><svg class="zicon hdr__logo" viewbox="0 0 24 24" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><path d="M12 1.5 22.5 12 12 22.5 1.5 12z" fill="currentColor"/><path d="M12 1.5 22.5 12 12 12z" fill="#fff" fill-opacity="0.12"/></svg><b data-v-a782489c>jouan.ovh</b></a><nav class="hdr__nav" aria-label="Navigation principale" data-v-a782489c><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__link hdr__link--active" data-v-a782489c>Accueil</a><a href="/services" class="hdr__link" data-v-a782489c>Services</a><a href="/about" class="hdr__link" data-v-a782489c>À propos</a><a href="/blog" class="hdr__link" data-v-a782489c>Blog</a><a href="/contact" class="hdr__link" data-v-a782489c>Contact</a><!--]--></nav><div class="hdr__right" data-v-a782489c><div class="current-time hdr__clock" data-v-a782489c data-v-1e5503b4></div><span class="zbadge zbadge--success hdr__badge" data-v-a782489c data-v-fc077828><span class="zbadge__dot" aria-hidden="true" data-v-fc077828></span><!--[-->Disponible<!--]--></span><button class="hdr__action zbtn zbtn--terminal zbtn--sm" type="button" data-v-a782489c data-v-c154e5b1><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg><!--]--></span><!--[--> Terminal <!--]--><!----></button><a href="/contact" class="hdr__action zbtn zbtn--primary zbtn--sm" data-v-a782489c data-v-c154e5b1><!----><!--[--> Démarrer un projet <!--]--><!----></a><button class="hdr__burger" type="button" aria-expanded="false" aria-controls="hdr-mobile-menu" aria-label="Ouvrir le menu" data-v-a782489c><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg></button></div></div><!----><nav id="hdr-mobile-menu" class="hdr__menu" aria-label="Navigation mobile" data-v-a782489c><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__menu-link hdr__menu-link--active" data-v-a782489c>Accueil</a><a href="/services" class="hdr__menu-link" data-v-a782489c>Services</a><a href="/about" class="hdr__menu-link" data-v-a782489c>À propos</a><a href="/blog" class="hdr__menu-link" data-v-a782489c>Blog</a><a href="/contact" class="hdr__menu-link" data-v-a782489c>Contact</a><!--]--><div class="hdr__menu-actions" data-v-a782489c><button class="zbtn zbtn--terminal zbtn--sm" type="button" data-v-a782489c data-v-c154e5b1><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg><!--]--></span><!--[--> Terminal <!--]--><!----></button><a href="/contact" class="zbtn zbtn--primary zbtn--sm" data-v-a782489c data-v-c154e5b1><!----><!--[--> Démarrer un projet <!--]--><!----></a></div></nav><div data-v-a782489c><!--[--><!--]--></div></header><!--[--><main class="home" data-v-80e32bdd><span data-v-80e32bdd></span><div class="atmos" aria-hidden="true" data-v-80e32bdd data-v-796c86c1><div class="aurora aurora--auberg" data-v-796c86c1></div><div class="aurora aurora--orange" data-v-796c86c1></div><div class="aurora aurora--red" data-v-796c86c1></div><div class="grid-dots" data-v-796c86c1></div><div class="scanlines" data-v-796c86c1></div><div class="vignette" data-v-796c86c1></div></div><!----><section class="hero hero__grad" data-v-80e32bdd><div class="hero__in container" data-v-80e32bdd><div class="hero__grid" data-v-80e32bdd><div class="anim hero__text" data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p><h1 class="hero__title" data-v-80e32bdd>Développeur Full Stack TypeScript</h1><p class="hero__sub" data-v-80e32bdd> Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l&#39;architecture au déploiement, j&#39;interviens sur des produits neufs comme sur des applications existantes. </p><div class="hero__badge-wrap" data-v-80e32bdd><span class="hero__pulse-dot" aria-hidden="true" data-v-80e32bdd></span><span data-v-80e32bdd>Disponible pour missions freelance</span><!--[--><span aria-hidden="true" data-v-80e32bdd> · </span><a href="https://www.malt.fr/profile/simonjouan" rel="noopener" target="_blank" data-v-80e32bdd><!--[--> Profil Malt vérifié <!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a><!--]--></div><div class="hero__cta" data-v-80e32bdd><a href="/contact" class="zbtn zbtn--primary zbtn--lg" data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Discuter de votre projet <!--]--><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg><!--]--></span></a><a href="/about" class="zbtn zbtn--secondary zbtn--lg" data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Voir le parcours &amp; CV <!--]--><!----></a></div></div><div class="anim hero__term-col" data-v-80e32bdd><div class="hero-term" data-v-80e32bdd data-v-313a6524><div class="hero-term__bar" data-v-313a6524><span class="hero-term__dots" aria-hidden="true" data-v-313a6524><span class="hero-term__dot hero-term__dot--close" data-v-313a6524></span><span class="hero-term__dot hero-term__dot--min" data-v-313a6524></span><span class="hero-term__dot hero-term__dot--max" data-v-313a6524></span></span><span class="hero-term__title" data-v-313a6524>anon.@jouan.ovh: ~</span></div><div class="hero-term__body" data-v-313a6524><!--[--><!--]--><!----><!----><noscript data-v-313a6524><div data-v-313a6524><!--[--><!--[--><p class="hero-term__line" data-v-313a6524><span class="prm" data-v-313a6524><span class="prm__user" data-v-313a6524>anon.@jouan.ovh</span><span class="prm__sep" data-v-313a6524>:</span><span class="prm__dir" data-v-313a6524>~</span><span class="prm__sep" data-v-313a6524>$ </span><span class="prm__cmd" data-v-313a6524>whoami</span></span></p><p class="hero-term__out--ink hero-term__out" data-v-313a6524>Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)</p><!--]--><!--[--><p class="hero-term__line" data-v-313a6524><span class="prm" data-v-313a6524><span class="prm__user" data-v-313a6524>anon.@jouan.ovh</span><span class="prm__sep" data-v-313a6524>:</span><span class="prm__dir" data-v-313a6524>~</span><span class="prm__sep" data-v-313a6524>$ </span><span class="prm__cmd" data-v-313a6524>cat focus.txt</span></span></p><p class="hero-term__out--blue hero-term__out" data-v-313a6524>SaaS, web apps, clean architecture, automated testing (QA) &amp; AI engineering</p><!--]--><!--[--><p class="hero-term__line" data-v-313a6524><span class="prm" data-v-313a6524><span class="prm__user" data-v-313a6524>anon.@jouan.ovh</span><span class="prm__sep" data-v-313a6524>:</span><span class="prm__dir" data-v-313a6524>~</span><span class="prm__sep" data-v-313a6524>$ </span><span class="prm__cmd" data-v-313a6524>ls ~/projets</span></span></p><p class="hero-term__out--green hero-term__out" data-v-313a6524>keova.app/  tryon-saas/  nodium-lab/</p><!--]--><!--]--></div></noscript></div></div></div></div></div></section><div class="marquee" aria-hidden="true" data-v-80e32bdd data-v-19576991><div class="marquee__track" data-v-19576991><!--[--><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>TypeScript</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Nuxt 4</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Vue.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>NestJS</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Node.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>PostgreSQL</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>TypeORM</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Stripe Connect</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Cypress</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Docker</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>REST API</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Vitest</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><!--]--><!--[--><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>TypeScript</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Nuxt 4</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Vue.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>NestJS</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Node.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>PostgreSQL</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>TypeORM</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Stripe Connect</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Cypress</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Docker</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>REST API</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Vitest</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><!--]--></div></div><section class="section" data-v-80e32bdd><div class="container" data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>ce que je propose</p><h2 class="section__title" data-v-80e32bdd>Trois expertises pour concevoir et faire évoluer vos applications</h2><ul class="grid-3" data-v-80e32bdd><!--[--><li data-v-80e32bdd><div class="offer zcard zcard--pad zcard--interactive" data-v-80e32bdd data-v-c5ec7be1><!--[--><div class="offer__top" data-v-80e32bdd><div class="offer__icon" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div><span class="offer__no" data-v-80e32bdd>01 / 03</span></div><h3 class="offer__title" data-v-80e32bdd>Création d&#39;applications web &amp; SaaS</h3><p class="offer__desc" data-v-80e32bdd>De l&#39;idée à la production : architecture, développement front &amp; back, base de données, authentification et paiements Stripe.</p><ul class="offer__points" data-v-80e32bdd><!--[--><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Architecture logicielle &amp; APIs REST</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Applications Vue 3 / Nuxt 4 &amp; NestJS</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Intégration Stripe &amp; PostgreSQL</span></li><!--]--></ul><ul class="hero__tags offer__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->NestJS<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->PostgreSQL<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Stripe Connect<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-80e32bdd><span data-v-80e32bdd>Sur devis / au sprint</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Création d&#39;applications web &amp; SaaS" data-v-80e32bdd> En savoir plus → </a><!--]--></div></li><li data-v-80e32bdd><div class="offer zcard zcard--pad zcard--interactive zcard--accent zcard--featured" data-v-80e32bdd data-v-c5ec7be1><!--[--><div class="offer__top" data-v-80e32bdd><div class="offer__icon" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg></div><span class="offer__no" data-v-80e32bdd>02 / 03</span></div><h3 class="offer__title" data-v-80e32bdd>Développement Full Stack TypeScript</h3><p class="offer__desc" data-v-80e32bdd>Renfort d&#39;équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.</p><ul class="offer__points" data-v-80e32bdd><!--[--><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Composants Vue 3 / Nuxt avec TypeScript strict</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Microservices &amp; backend modulaire NestJS</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Fiabilisation et optimisation des performances</span></li><!--]--></ul><ul class="hero__tags offer__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->TypeScript<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Vue 3<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->NestJS<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Node.js<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-80e32bdd><span data-v-80e32bdd>Sur devis / TJM</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Développement Full Stack TypeScript" data-v-80e32bdd> En savoir plus → </a><!--]--></div></li><li data-v-80e32bdd><div class="offer zcard zcard--pad zcard--interactive" data-v-80e32bdd data-v-c5ec7be1><!--[--><div class="offer__top" data-v-80e32bdd><div class="offer__icon" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M12 3l1.8 5.6L19.5 10l-5.7 1.4L12 17l-1.8-5.6L4.5 10l5.7-1.4z"/><path d="M19 15l.7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9z"/></svg></div><span class="offer__no" data-v-80e32bdd>03 / 03</span></div><h3 class="offer__title" data-v-80e32bdd>Évolution &amp; Architecture applicative</h3><p class="offer__desc" data-v-80e32bdd>Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).</p><ul class="offer__points" data-v-80e32bdd><!--[--><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Audits techniques de code &amp; migrations de versions</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Tests E2E Cypress &amp; tests unitaires Vitest</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Pipelines CI/CD &amp; conteneurisation Docker</span></li><!--]--></ul><ul class="hero__tags offer__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Cypress<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Vitest<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Docker<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->CI/CD<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-80e32bdd><span data-v-80e32bdd>Au forfait / audit</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Évolution &amp; Architecture applicative" data-v-80e32bdd> En savoir plus → </a><!--]--></div></li><!--]--></ul></div></section><section class="section section--sunken" data-v-80e32bdd><div class="container" data-v-80e32bdd><div class="block__head" data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>projets sélectionnés</p><h2 class="section__title" data-v-80e32bdd>Des produits qui tournent en production</h2></div><ul class="work" data-v-80e32bdd><!--[--><li data-v-80e32bdd><a href="https://keova.app" rel="noopener" target="_blank" class="work__row work__row--link" data-hot data-v-80e32bdd><!--[--><span class="work__no" data-v-80e32bdd>01</span><div class="work__main" data-v-80e32bdd><div class="work__topline" data-v-80e32bdd><h3 class="work__name" data-v-80e32bdd>keova.app</h3><span class="work__status" data-v-80e32bdd>En production</span></div><p class="work__role" data-v-80e32bdd>Co-fondateur &amp; Développeur Full Stack</p><p class="prose work__desc" data-v-80e32bdd>Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).</p><ul class="hero__tags work__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nest.js<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->postgresql<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->stripe<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->saas<!--]--><!----></span></li><!--]--></ul></div><span class="work__go" aria-hidden="true" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-80e32bdd><div class="work__row" data-v-80e32bdd><span class="work__no" data-v-80e32bdd>02</span><div class="work__main" data-v-80e32bdd><div class="work__topline" data-v-80e32bdd><h3 class="work__name" data-v-80e32bdd>TryOn</h3><span class="work__status" data-v-80e32bdd>Étude de cas (MVP livré)</span></div><p class="work__role" data-v-80e32bdd>CTO &amp; Développeur Full Stack</p><p class="prose work__desc" data-v-80e32bdd>Plateforme SaaS B2B d&#39;essayage virtuel de vêtements via l&#39;IA générative (diffusion models, microservices asynchrones, files Redis).</p><ul class="hero__tags work__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nest.js<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->python<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->comfyui<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->ia<!--]--><!----></span></li><!--]--></ul></div><!----></div></li><li data-v-80e32bdd><div class="work__row" data-v-80e32bdd><span class="work__no" data-v-80e32bdd>03</span><div class="work__main" data-v-80e32bdd><div class="work__topline" data-v-80e32bdd><h3 class="work__name" data-v-80e32bdd>Nodium</h3><span class="work__status" data-v-80e32bdd>R&amp;D / En cours</span></div><p class="work__role" data-v-80e32bdd>Créateur &amp; Ingénieur IA</p><p class="prose work__desc" data-v-80e32bdd>Plateforme desktop d&#39;orchestration d&#39;agents IA autonomes, gestion de permissions et mémoire contextuelle.</p><ul class="hero__tags work__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->typescript<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->electron<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->agents<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->ia<!--]--><!----></span></li><!--]--></ul></div><!----></div></li><!--]--></ul><ul class="stats" data-v-80e32bdd><!--[--><li class="stat" data-v-80e32bdd><b data-v-80e32bdd>11</b><span data-v-80e32bdd>années d&#39;expérience web</span></li><li class="stat" data-v-80e32bdd><b data-v-80e32bdd>100%</b><span data-v-80e32bdd>TypeScript &amp; SaaS de bout en bout</span></li><li class="stat" data-v-80e32bdd><b data-v-80e32bdd>QA</b><span data-v-80e32bdd>culture d&#39;automatisation &amp; zéro régression</span></li><!--]--></ul></div></section><section class="section" data-v-80e32bdd><div class="container" data-v-80e32bdd><div class="block__head block__head--row" data-v-80e32bdd><div data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>~/journal</p><h2 class="section__title" data-v-80e32bdd>Notes de dev, écrites en construisant</h2></div><a href="/blog" class="seeall" data-hot data-v-80e32bdd> cat tous-les-articles <svg class="zicon seeall__icon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></a></div><div class="journal__empty zcard zcard--pad" data-v-80e32bdd data-v-c5ec7be1><!--[--><p class="journal__empty-code" data-v-80e32bdd>$ cat ~/journal/*.md</p><p class="journal__empty-text" data-v-80e32bdd>Les notes d&#39;ingénierie et retours d&#39;expérience sont en cours de rédaction.</p><a href="/blog" class="zbtn zbtn--secondary zbtn--sm" data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Consulter la section blog <!--]--><!----></a><!--]--></div></div></section><section class="section section--sunken" data-v-80e32bdd><div class="container" data-v-80e32bdd><div class="cta" data-v-80e32bdd><p class="eyebrow cta__eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>$ </span>./contact --start</p><h2 class="cta__title" data-v-80e32bdd>Un projet en tête ? Mettons-le <span class="cta__highlight" data-v-80e32bdd>en production</span>.</h2><p class="cta__subtitle" data-v-80e32bdd> Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript, parlons-en. </p><div class="cta__actions" data-v-80e32bdd><a href="/contact" class="zbtn zbtn--primary zbtn--lg" data-hot data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Discuter de votre projet <!--]--><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg><!--]--></span></a><a href="https://www.malt.fr/profile/simonjouan" rel="noopener" target="_blank" data-hot class="zbtn zbtn--secondary zbtn--lg" data-v-80e32bdd data-v-c154e5b1><!--[--><!----><!--[--> Me contacter sur Malt <!--]--><!----><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a><a href="/about" class="zbtn zbtn--ghost zbtn--lg" data-hot data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Voir le parcours &amp; CV <!--]--><!----></a></div></div></div></section></main><!--]--><footer class="ftr" data-v-e3708db0 data-v-ec74c766><div class="ftr__container" data-v-ec74c766><div class="ftr__in" data-v-ec74c766><div class="ftr__brand-col" data-v-ec74c766><a aria-current="page" href="/" class="router-link-active router-link-exact-active ftr__brand" data-v-ec74c766><svg class="zicon ftr__logo" viewbox="0 0 24 24" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-ec74c766 data-v-70d98695><path d="M12 1.5 22.5 12 12 22.5 1.5 12z" fill="currentColor"/><path d="M12 1.5 22.5 12 12 12z" fill="#fff" fill-opacity="0.12"/></svg><b data-v-ec74c766>jouan.ovh</b></a><p class="ftr__tagline" data-v-ec74c766>Développeur Full Stack TypeScript — Nuxt / NestJS. Rouen, France.</p></div><nav class="ftr__col" aria-label="Navigation du pied de page" data-v-ec74c766><h2 class="ftr__title" data-v-ec74c766>// Navigation</h2><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active ftr__link" data-v-ec74c766>Accueil</a><a href="/services" class="ftr__link" data-v-ec74c766>Services</a><a href="/about" class="ftr__link" data-v-ec74c766>À propos</a><a href="/blog" class="ftr__link" data-v-ec74c766>Blog</a><a href="/contact" class="ftr__link" data-v-ec74c766>Contact</a><a href="/confidentialite" class="ftr__link" data-v-ec74c766>Confidentialité</a><a href="/mentions-legales" class="ftr__link" data-v-ec74c766>Mentions légales</a><!--]--></nav><div class="ftr__col" data-v-ec74c766><h2 class="ftr__title" data-v-ec74c766>// Projets</h2><ul class="ftr__list" data-v-ec74c766><!--[--><li data-v-ec74c766><a href="https://keova.app" rel="noopener noreferrer" target="_blank" class="ftr__link" data-v-ec74c766><!--[-->keova.app<!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-ec74c766><span class="ftr__link ftr__link--static" data-v-ec74c766>TryOn</span></li><li data-v-ec74c766><span class="ftr__link ftr__link--static" data-v-ec74c766>Nodium</span></li><!--]--></ul></div><div class="ftr__col" data-v-ec74c766><h2 class="ftr__title" data-v-ec74c766>// Réseaux</h2><ul class="hexrow" data-v-ec74c766 data-v-a86d2094><!--[--><li data-v-a86d2094><a href="https://github.com/zohac" rel="noopener noreferrer" target="_blank" class="hex" data-v-a86d2094 data-v-274e53e2><!--[--><!--[--><svg class="zicon" viewbox="0 0 16 16" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a86d2094 data-v-70d98695><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg><!--]--><span class="hex__label" data-v-274e53e2><!--[-->GitHub<!--]--></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-a86d2094><a href="https://twitter.com/fenrir0680" rel="noopener noreferrer" target="_blank" class="hex" data-v-a86d2094 data-v-274e53e2><!--[--><!--[--><svg class="zicon" viewbox="0 0 16 16" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a86d2094 data-v-70d98695><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/></svg><!--]--><span class="hex__label" data-v-274e53e2><!--[-->Twitter<!--]--></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-a86d2094><a href="https://www.linkedin.com/in/simonjouan/" rel="noopener noreferrer" target="_blank" class="hex" data-v-a86d2094 data-v-274e53e2><!--[--><!--[--><svg class="zicon" viewbox="0 0 16 16" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a86d2094 data-v-70d98695><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg><!--]--><span class="hex__label" data-v-274e53e2><!--[-->LinkedIn<!--]--></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><!--]--></ul></div></div><div class="ftr__bottom" data-v-ec74c766><span data-v-ec74c766>© 2026 Simon Jouan — jouan.ovh</span><span class="ftr__term" data-v-ec74c766>anon.@jouan.ovh:~$ <span class="ftr__cmd" data-v-ec74c766>echo &quot;merci de votre visite&quot;</span></span></div></div></footer></div></div><div id="teleports"></div><script>window.__NUXT__={};window.__NUXT__.config={public:{web3formsAccessKey:"320b7ade-7b76-421e-a4bd-f353fd22348b",siteUrl:"https://jouan.ovh",mdc:{components:{prose:true,map:{},customElements:[]},headings:{anchorLinks:{h1:false,h2:true,h3:true,h4:true,h5:false,h6:false}},highlight:false},content:{wsUrl:""}},app:{baseURL:"/",buildId:"47020e4c-64d1-4922-b979-d9f58139e1fe",buildAssetsDir:"/_nuxt/",cdnURL:""}}</script><script type="application/json" data-nuxt-data="nuxt-app" data-ssr="true" id="__NUXT_DATA__">[["ShallowReactive",1],{"prerenderedAt":2,"data":3,"state":6,"once":8,"_errors":9,"serverRendered":11,"path":12},1789327459772,["ShallowReactive",4],{"home-articles":5},[],["Reactive",7],{},["Set"],["ShallowReactive",10],{"home-articles":-1},true,"\u002F"]</script></body></html>
docs/implementation-artifacts/code-reviews/11-5/raw-acceptance-auditor.md:4085:app/pages/index.vue:78:              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
docs/implementation-artifacts/code-reviews/11-2/raw-edge-case-hunter.json:1569:    55	              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
docs/implementation-artifacts/code-reviews/epic-11/raw-edge-case-hunter.json:3569:+              <div class="offer__price">
docs/implementation-artifacts/code-reviews/epic-11/raw-edge-case-hunter.json:3572:               <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
docs/implementation-artifacts/code-reviews/epic-11/raw-edge-case-hunter.json:3573:                 En savoir plus →
docs/implementation-artifacts/code-reviews/epic-11/raw-edge-case-hunter.json:4297:+.offer__price {
docs/implementation-artifacts/code-reviews/epic-11/raw-edge-case-hunter.json:4888:    75	              <div class="offer__price">
docs/implementation-artifacts/code-reviews/epic-11/raw-edge-case-hunter.json:4891:    78	              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
docs/implementation-artifacts/code-reviews/epic-11/raw-edge-case-hunter.json:4892:    79	                En savoir plus →
docs/implementation-artifacts/code-reviews/epic-11/raw-edge-case-hunter.json:5453:   638	.offer__price {
docs/implementation-artifacts/code-reviews/11-4/raw-edge-case-hunter.json:878:    75	              <div class="offer__price">
docs/implementation-artifacts/code-reviews/11-4/raw-edge-case-hunter.json:881:    78	              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
docs/implementation-artifacts/code-reviews/11-4/raw-edge-case-hunter.json:882:    79	                En savoir plus →
docs/implementation-artifacts/code-reviews/11-4/raw-edge-case-hunter.json:1522:   595	.offer__price {
docs/implementation-artifacts/code-reviews/11-4/raw-edge-case-hunter.json:3873:   297	+.offer__price {
docs/implementation-artifacts/code-reviews/epic-11/full.diff:3232:+              <div class="offer__price">
docs/implementation-artifacts/code-reviews/epic-11/full.diff:3235:               <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
docs/implementation-artifacts/code-reviews/epic-11/full.diff:3236:                 En savoir plus →
docs/implementation-artifacts/code-reviews/epic-11/full.diff:3960:+.offer__price {
docs/implementation-artifacts/code-reviews/epic-11/raw-blind-hunter.md:3336:+              <div class="offer__price">
docs/implementation-artifacts/code-reviews/epic-11/raw-blind-hunter.md:3339:               <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
docs/implementation-artifacts/code-reviews/epic-11/raw-blind-hunter.md:3340:                 En savoir plus →
docs/implementation-artifacts/code-reviews/epic-11/raw-blind-hunter.md:4068:+.offer__price {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1140:-            <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1141:-              En savoir plus →
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1151:+              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1152:+                En savoir plus →
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1253:-            <div class="offer__price">
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1281:+              <div class="offer__price">
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1469:app/pages/services.vue-25-              <div class="offer__price">
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1700:app/pages/index.vue-79-              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1701:app/pages/index.vue-80-                En savoir plus →
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2082:            <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2083:              En savoir plus →
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2580:142:+              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3113:.offer__price {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:6155:   131	-            <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:6156:   132	-              En savoir plus →
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:6166:   142	+              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:6167:   143	+                En savoir plus →
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:6269:   244	-            <div class="offer__price">

exec
/bin/zsh -lc "sed -n '1,130p' app/pages/services.vue; rg -n \"id=|section|automation|agent|sur mesure|Automatisation|Agents IA|Applications IA\" app/pages/services.vue | head -100; sed -n '1,180p' docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <main class="services">
    <!-- En-tête + grille d'offres (story 12.5) -->
    <section class="section">
      <div class="container">
        <p class="eyebrow"><span aria-hidden="true">// </span>services</p>
        <h1 class="services__title">Des systèmes IA construits autour de vos vrais processus métier.</h1>
        <p class="prose services__intro">
          Je pars d’un workflow existant, pas d’une technologie à placer. Du cadrage initial jusqu'au maintien en
          condition opérationnelle, l’IA intervient uniquement là où elle apporte réellement quelque chose.
        </p>

        <ul class="grid-3">
          <li v-for="offer in offers" :key="offer.id">
            <ZCard class="offer" :accent="offer.featured" :featured="offer.featured">
              <div v-if="offer.featured" class="offer__badge">
                <ZBadge tone="accent">Format cœur</ZBadge>
              </div>
              <div class="offer__icon"><ZIcon :name="offer.icon" /></div>
              <h2 class="offer__title">{{ offer.title }}</h2>
              <p v-if="offer.hook" class="offer__hook">{{ offer.hook }}</p>
              <p class="offer__desc">{{ offer.desc }}</p>
              <ul class="offer__points">
                <li v-for="point in offer.points" :key="point">{{ point }}</li>
              </ul>
              <div class="offer__footer">
                <div class="offer__price">
                  <b>{{ offer.price }}</b>
                </div>
                <p v-if="offer.disclaimer" class="offer__disclaimer">
                  {{ offer.disclaimer }}
                </p>
                <div class="offer__cta">
                  <ZButton
                    :as="NuxtLink"
                    to="/contact"
                    :variant="offer.featured ? 'primary' : 'secondary'"
                    :aria-label="offer.ctaAriaLabel"
                    class="offer__btn"
                  >
                    {{ offer.ctaText }}
                  </ZButton>
                </div>
              </div>
            </ZCard>
          </li>
        </ul>
      </div>
    </section>

    <!-- Section process : 4 étapes ordonnées + CTA (story 12.5) -->
    <section class="section section--sunken">
      <div class="container">
        <p class="eyebrow"><span aria-hidden="true">// </span>comment ça se passe</p>
        <h2 class="process__title">Un déroulé simple en quatre temps</h2>

        <ol class="process">
          <li v-for="step in steps" :key="step.n" class="process__step">
            <div class="process__num" aria-hidden="true">{{ step.n }}</div>
            <h3 class="process__step-title">{{ step.title }}</h3>
            <p class="prose process__desc">{{ step.desc }}</p>
            <div v-if="step.inlineCta" class="process__cta-inline-wrapper">
              <NuxtLink :to="step.inlineCta.to" class="process__inline-cta">
                {{ step.inlineCta.label }}
              </NuxtLink>
            </div>
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
// Page Services : catalogue d'offres IA packagées + process 4 étapes + CTA contact.
// Données statiques (3 offres, 4 étapes) déclarées localement. Prerender-safe, dark-first.
import { NuxtLink } from "#components";
import { SITE } from "~/data/site";

interface Offer {
  /** Clé v-for stable (indépendante du contenu affiché). */
  id: string;
  /** Nom d'icône dans le set ZIcon. */
  icon: string;
  title: string;
  hook?: string;
  desc: string;
  points: string[];
  price: string;
  disclaimer?: string;
  /** Offre mise en avant : carte accent + glow + badge. */
  featured: boolean;
  ctaText: string;
  ctaAriaLabel: string;
}

interface Step {
  n: string;
  title: string;
  desc: string;
  inlineCta?: {
    to: string;
    label: string;
  };
}

// Les 3 offres officielles V1 — 1re personne, vouvoiement, zéro emoji.
const offers: Offer[] = [
  {
    id: "sprint",
    icon: "zap",
    title: "AI Workflow Sprint",
    hook: "Un Sprint = un workflow prioritaire",
    desc: "Conception, intégration logicielle et mise en production d'un workflow métier complet avec IA ciblée et supervision humaine.",
    points: [
      "Diagnostic approfondi & cartographie avant/après",
      "Architecture système, connecteurs API & intégrations métier",
      "Modèles d'IA & prompt engineering avec sorties typées",
      "Tests automatisés sur cas réels & boucle de validation humaine",
      "Déploiement en production, documentation & mesure initiale",
    ],
    price: "À partir de 3 500 € HT",
    featured: true,
4:    <section class="section">
49:    </section>
52:    <section class="section section--sunken">
77:    </section>
250:// .section / .section--sunken / .container / .eyebrow / .prose : primitives de
---
baseline_commit: f17191467b2cd4aabf147f50b0dace4121255040
---

# Story 15.1: Homepage — Suppression des Prix d'Entrée, Liens Contextuels & Phrase de Réassurance

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur découvrant la page d'accueil,
I want comprendre que Simon intervient aussi bien sur une automatisation ciblée que sur un workflow complet sans imposer un ticket d'entrée public à 3 500 € HT,
so that je me sente libre de le contacter pour qualifier mon besoin réel (FR49, NFR6, CAP-1).

## Acceptance Criteria

1. **Given** la section expertises de `app/pages/index.vue`
   **When** le visiteur consulte les 3 cartes de services (`services`)
   **Then** la propriété `price: "À partir de 3 500 € HT"` est intégralement retirée des données des cartes *Automatisation de processus métier* et *Agents IA intégrés à vos outils*
   **And** l'élément `.offer__price` affichant ce montant est supprimé du template HTML pour éliminer tout ancrage tarifaire public à 3 500 € HT.

2. **Given** les 3 cartes de services de la homepage dans `app/pages/index.vue`
   **When** le visiteur lit le bas de chaque carte
   **Then** le lien générique `En savoir plus →` est remplacé par un lien d'exploration contextuel ciblant `/services` spécifique à chaque offre :
     - *Automatisation de processus métier :* `Voir les types d'automatisation →`
     - *Agents IA intégrés à vos outils :* `Voir quand utiliser un agent →`
     - *Applications IA sur mesure :* `Découvrir les projets sur mesure →`
   **And** chaque lien conserve l'attribut `:aria-label` accessible explicite et le pseudo-élément étendu `&::after` rendant toute la carte cliquable.

3. **Given** la section des expertises ou sa transition vers le bloc différenciateur dans `app/pages/index.vue`
   **When** l'utilisateur parcourt la zone
   **Then** un bloc ou paragraphe de réassurance sobre inspiré du terminal est affiché :
     > *« Un besoin simple ne nécessite pas forcément un gros projet. Je dimensionne la solution selon le workflow réel : parfois quelques automatisations suffisent ; parfois il faut construire un système métier complet. »*
   **And** la mise en forme utilise une bordure subtile (`var(--border-subtle)`), une couleur de texte secondaire (`var(--text-muted)` ou `var(--text-body)`), et respecte la parité des thèmes sombre et clair.

4. **Given** les exigences d'accessibilité (a11y), responsive et qualité globale
   **When** la page d'accueil est affichée sur mobile (< 900px, < 680px), sur desktop ou naviguée au clavier
   **Then** aucun emoji n'est présent dans l'interface ou les textes (NFR6)
   **And** le focus clavier (`Tab`) met en évidence les liens contextuels avec l'outline accessible (`:focus-visible`)
   **And** la suite de validation Docker Nitro SSG s'exécute avec 100% de succès :
     ```sh
     docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
     ```

## Tasks / Subtasks

- [x] Tâche 1 — Mise à jour des données et suppression des prix dans `app/pages/index.vue` (AC: 1, 2)
  - [x] Modifier l'interface `HomeServiceOffer` dans `<script setup>` pour ajouter `actionText: string` et retirer `price?: string`.
  - [x] Mettre à jour le tableau `services` :
    - *Automatisation :* retirer `price: "À partir de 3 500 € HT"`, ajouter `actionText: "Voir les types d'automatisation →"`
    - *Agents IA :* retirer `price: "À partir de 3 500 € HT"`, ajouter `actionText: "Voir quand utiliser un agent →"`
    - *Applications sur mesure :* retirer `price: "Sur mesure / Sprint"`, ajouter `actionText: "Découvrir les projets sur mesure →"`
  - [x] Supprimer le bloc `<div class="offer__price">` du template et afficher `service.actionText` dans le `<NuxtLink class="offer__more">`.

- [x] Tâche 2 — Intégration du composant / bloc de réassurance (AC: 3)
  - [x] Insérer l'encart de réassurance sous la grille des services `.grid-3` ou en amont du bloc `.diff-block` dans `app/pages/index.vue`.
  - [x] Styliser l'encart avec les tokens SCSS (`var(--space-*)`, `var(--radius-*)`, `var(--border-subtle)`, `var(--surface-sunken)` ou `var(--surface-card)`).
  - [x] Vérifier la lisibilité sur thème sombre aubergine et thème clair technique.

- [x] Tâche 3 — Nettoyage SCSS et vérification a11y & responsive (AC: 2, 4)
  - [x] Adapter la règle `.offer__more` pour qu'elle assure la séparation visuelle supérieure précédemment portée par `.offer__price` (`margin-top: auto; padding-top: var(--space-4); border-top: 1px dashed var(--border-subtle);`).
  - [x] Nettoyer la classe `.offer__price` devenue obsolète.
  - [x] Valider l'adaptation responsive sur petit écran.

- [x] Tâche 4 — Validation Docker Nitro SSG (AC: 4)
  - [x] Exécuter la commande `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [x] Valider 0 erreur ESLint / Stylelint, 0 erreur TypeScript et 13 routes statiques générées.

## Dev Notes

### Contexte & Guardrails
- **Fichier unique à modifier :** [`app/pages/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue).
- **Zéro Emoji :** Règle NFR6 absolue. Les puces et icônes passent par `<ZIcon>` ou du pur CSS.
- **Tokens uniquement :** Consommer les variables de design system `var(--token)`.
- **Règle Docker :** Ne JAMAIS lancer `pnpm` sur l'hôte macOS arm64.

### Structure Actuelle de la Carte dans `index.vue`
```vue
<ZCard class="offer" interactive tilt :accent="service.featured" :featured="service.featured">
  <div class="offer__top">
    <div class="offer__icon"><ZIcon :name="service.icon" /></div>
    <span class="offer__no">{{ service.no }}</span>
  </div>
  <h3 class="offer__title">{{ service.title }}</h3>
  <p class="offer__desc">{{ service.desc }}</p>
  <ul class="offer__points">...</ul>
  <ul class="hero__tags offer__tags">...</ul>
  <!-- SUPPRIMER : <div class="offer__price"><span>{{ service.price }}</span></div> -->
  <NuxtLink to="/services" class="offer__more" :aria-label="service.actionText">
    {{ service.actionText }}
  </NuxtLink>
</ZCard>
```

### Emplacement Recommandé pour la Réassurance
Immédiatement après le `</ul>` de `.grid-3` :
```vue
<div class="services-reassurance">
  <p class="services-reassurance__text">
    <strong>Un besoin simple ne nécessite pas forcément un gros projet.</strong>
    Je dimensionne la solution selon le workflow réel : parfois quelques automatisations suffisent ; parfois il faut construire un système métier complet.
  </p>
</div>
```

### References
- [Source de vérité Offre V1.1 : docs/jouan-ovh-offre-commerciale-v1.1-updated.md#Section-11-et-12](file:///Users/simon/dev/jouan.ovh/docs/jouan-ovh-offre-commerciale-v1.1-updated.md)
- [Sprint Change Proposal : docs/planning-artifacts/sprint-change-proposal-2026-09-18.md](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/sprint-change-proposal-2026-09-18.md)
- [Cahier des Epics : docs/planning-artifacts/epics.md#Story-15-1](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)

## Dev Agent Record

### Agent Model Used
Gemini 3.7 Flash / Antigravity

### Debug Log References
- Résolution d'un saut de ligne Prettier sur `app/pages/index.vue`.

### Completion Notes List
- ✅ **AC1 & AC2 :** Retrait de la propriété `price` et de la classe `.offer__price` dans `app/pages/index.vue`. Remplacement par `actionText` avec libellés contextuels (`Voir les types d'automatisation →`, `Voir quand utiliser un agent →`, `Découvrir les projets sur mesure →`) et accessibilité conservée.
- ✅ **AC3 :** Intégration de l'encart `.services-reassurance` avec la phrase clé de désancrage tarifaire et stylisation via les tokens (`var(--surface-1)`, `var(--border-subtle)`, `var(--radius-md)`, `var(--text-body)`, `var(--text-strong)`).
- ✅ **AC4 :** Validation complète via Docker Nitro SSG (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) avec 0 erreur et 100% de succès.

### File List
- `app/pages/index.vue` (modifié)

### Change Log
- 2026-09-18 : Implémentation complète de la Story 15.1 (Désancrage tarifaire homepage, liens contextuels et encart de réassurance).

exec
/bin/zsh -lc 'rg -n -- "--surface-1|--surface-card|--surface-sunken|--text-body|--text-muted|--shadow-1" app/assets/scss/abstract app/assets/scss | head -100; rg -n "grid-3|offer__more|offer" app/assets/scss app/pages/index.vue | head -100; git status --short' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/assets/scss/base/_layout.scss:54:  color: var(--text-muted);
app/assets/scss/base/_layout.scss:61:  color: var(--text-body);
app/assets/scss/base/_layout.scss:85:  // au-dessus (--text-faint échouait ~2.95:1 sur carte ; --text-muted ≥ 4.5:1).
app/assets/scss/base/_layout.scss:86:  color: var(--text-muted);
app/assets/scss/abstract/_root.scss:33:  --surface-1: hsl(319deg 22% 9%); // sections en creux
app/assets/scss/abstract/_root.scss:72:  --bg-sunken: var(--surface-1);
app/assets/scss/abstract/_root.scss:78:  --text-body: var(--ink-2);
app/assets/scss/abstract/_root.scss:79:  --text-muted: var(--ink-3);
app/assets/scss/abstract/_root.scss:178:  --shadow-1: 0 1px 3px hsl(320deg 60% 2% / 50%);
app/assets/scss/abstract/_root.scss:218:  --surface-1: hsl(38deg 20% 93%);
app/assets/scss/abstract/_root.scss:237:  --bg-sunken: var(--surface-1);
app/assets/scss/abstract/_root.scss:242:  --text-body: var(--ink-2);
app/assets/scss/abstract/_root.scss:243:  --text-muted: var(--ink-3);
app/assets/scss/abstract/_root.scss:262:  --shadow-1: 0 1px 3px hsl(35deg 20% 40% / 8%);
app/assets/scss/abstract/_root.scss:284:  --surface-1: hsl(319deg 22% 9%);
app/assets/scss/abstract/_root.scss:296:  --bg-sunken: var(--surface-1);
app/assets/scss/abstract/_root.scss:302:  --text-body: hsl(28deg 10% 74%);
app/assets/scss/abstract/_root.scss:303:  --text-muted: hsl(25deg 7% 54%);
app/assets/scss/base/_reset.scss:384:  color: var(--text-body);
app/assets/scss/abstract/_root.scss:33:  --surface-1: hsl(319deg 22% 9%); // sections en creux
app/assets/scss/abstract/_root.scss:72:  --bg-sunken: var(--surface-1);
app/assets/scss/abstract/_root.scss:78:  --text-body: var(--ink-2);
app/assets/scss/abstract/_root.scss:79:  --text-muted: var(--ink-3);
app/assets/scss/abstract/_root.scss:178:  --shadow-1: 0 1px 3px hsl(320deg 60% 2% / 50%);
app/assets/scss/abstract/_root.scss:218:  --surface-1: hsl(38deg 20% 93%);
app/assets/scss/abstract/_root.scss:237:  --bg-sunken: var(--surface-1);
app/assets/scss/abstract/_root.scss:242:  --text-body: var(--ink-2);
app/assets/scss/abstract/_root.scss:243:  --text-muted: var(--ink-3);
app/assets/scss/abstract/_root.scss:262:  --shadow-1: 0 1px 3px hsl(35deg 20% 40% / 8%);
app/assets/scss/abstract/_root.scss:284:  --surface-1: hsl(319deg 22% 9%);
app/assets/scss/abstract/_root.scss:296:  --bg-sunken: var(--surface-1);
app/assets/scss/abstract/_root.scss:302:  --text-body: hsl(28deg 10% 74%);
app/assets/scss/abstract/_root.scss:303:  --text-muted: hsl(25deg 7% 54%);
app/pages/index.vue:60:        <ul class="grid-3">
app/pages/index.vue:62:            <ZCard class="offer" interactive tilt :accent="service.featured" :featured="service.featured">
app/pages/index.vue:63:              <div class="offer__top">
app/pages/index.vue:64:                <div class="offer__icon"><ZIcon :name="service.icon" /></div>
app/pages/index.vue:65:                <span class="offer__no">{{ service.no }}</span>
app/pages/index.vue:67:              <h3 class="offer__title">{{ service.title }}</h3>
app/pages/index.vue:68:              <p class="offer__desc">{{ service.desc }}</p>
app/pages/index.vue:69:              <ul class="offer__points">
app/pages/index.vue:71:                  <ZIcon name="check" class="offer__check" />
app/pages/index.vue:75:              <ul class="hero__tags offer__tags">
app/pages/index.vue:80:              <NuxtLink to="/services" class="offer__more" :aria-label="service.actionText">
app/pages/index.vue:621:// ---- Aperçu services (porté de .grid-3 / .offer*) ----
app/pages/index.vue:622:.grid-3 {
app/pages/index.vue:635:.offer {
app/pages/index.vue:641:.offer__top {
app/pages/index.vue:648:.offer__icon {
app/pages/index.vue:655:  // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
app/pages/index.vue:663:.offer__no {
app/pages/index.vue:670:.offer__title {
app/pages/index.vue:678:.offer__desc {
app/pages/index.vue:686:.offer__points {
app/pages/index.vue:705:.offer__check {
app/pages/index.vue:712:.offer__tags {
app/pages/index.vue:716:.offer__more {
app/pages/index.vue:1270:  .grid-3,
 M app/pages/index.vue
 M docs/implementation-artifacts/sprint-status.yaml
 M docs/planning-artifacts/epics.md
?? docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md
?? docs/implementation-artifacts/code-reviews/15-1/
?? docs/jouan-ovh-offre-commerciale-v1.1-updated.md
?? docs/planning-artifacts/sprint-change-proposal-2026-09-18.md

exec
/bin/zsh -lc "sed -n '615,735p' app/pages/index.vue; sed -n '1240,1305p' app/pages/index.vue; sed -n '1,120p' app/components/ui/ZCard.vue; rg -n \"zcard|offer\" app/assets/scss app/components/ui/ZCard.vue | head -120" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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
  flex-shrink: 0;
  margin-top: calc(var(--space-1) / 2);
  font-size: var(--fs-sm);
  color: var(--term-green);
}

.offer__tags {
  margin-bottom: var(--space-4);
}

.offer__more {
  margin-top: auto;
  padding-top: var(--space-4);
  border-top: 1px dashed var(--border-subtle);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--accent);
  text-decoration: none;

  &::after {
    position: absolute;
    inset: 0;
    content: "";
  }

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
  color: var(--accent);
}

.cta__subtitle {
  max-width: 58ch;
  margin: 0 auto var(--space-8);
  font-family: var(--font-sans);
  font-size: var(--fs-lg);
  line-height: var(--lh-relaxed);
  color: var(--text-muted);
}

.cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  justify-content: center;
  align-items: center;
}

// ---- Responsive ----
@media (width <= 900px) {
  .hero__grid {
    grid-template-columns: 1fr;
  }

  .hero__title {
    font-size: var(--fs-4xl);
  }

  .grid-3,
  .projects-grid,
  .journal {
    grid-template-columns: 1fr;
  }

  .pillars-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .block__head--row {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (width <= 680px) {
  .pillars-grid,
  .stats {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .anim {
    animation: none;
  }

  .project-card__img,
  .project-card__title,
  .jpost__arrow,
  .seeall {
    transition: none;
  }

  .stat {
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
app/components/ui/ZCard.vue:6:    class="zcard"
app/components/ui/ZCard.vue:8:      'zcard--pad': padded,
app/components/ui/ZCard.vue:9:      'zcard--interactive': interactive,
app/components/ui/ZCard.vue:10:      'zcard--accent': accent,
app/components/ui/ZCard.vue:11:      'zcard--featured': featured,
app/components/ui/ZCard.vue:12:      'zcard--tilt': tilt,
app/components/ui/ZCard.vue:132:.zcard {
app/components/ui/ZCard.vue:146:.zcard--tilt {
app/components/ui/ZCard.vue:151:.zcard--pad {
app/components/ui/ZCard.vue:155:.zcard--interactive {
app/components/ui/ZCard.vue:171:.zcard--accent::before {
app/components/ui/ZCard.vue:179:.zcard--featured {
app/components/ui/ZCard.vue:185:  .zcard {
app/components/ui/ZCard.vue:190:  .zcard--interactive:hover {

codex
- Les trois liens contextuels pointent tous vers `/services` sans ancre ni paramètre identifiant l’offre, si bien que le visiteur n’arrive pas directement au contenu promis.

- La page `/services` continue d’afficher publiquement « À partir de 3 500 € HT » ; le parcours depuis la homepage réintroduit donc immédiatement l’ancrage tarifaire supprimé.

- Les `aria-label` reprennent uniquement le texte visible et n’indiquent pas l’offre concernée, ce qui rend la liste de liens moins compréhensible avec un lecteur d’écran.

- La flèche `→` fait partie du nom accessible du lien et peut être verbalisée inutilement ; elle devrait être décorative ou séparée du libellé accessible.

- Le pseudo-élément `::after` rend toujours toute la carte cliquable, mais aucun test ne vérifie que cette zone étendue ne recouvre pas le texte, le focus ou d’éventuels éléments interactifs futurs.

- Le changement transforme une information tarifaire immédiatement lisible en trois appels à l’action très longs, sans validation visible du retour à la ligne dans les cartes desktop étroites.

- Aucun test automatisé ne couvre la disparition effective des anciens prix, les trois libellés exacts, le texte de réassurance ou le nom accessible des liens.

- La tâche revendique une validation responsive mobile, mais le diff n’ajoute aucune règle spécifique pour l’encart de réassurance ni pour les libellés d’action allongés aux seuils de 900 px et 680 px.

- La tâche revendique une validation visuelle, mais le diff ne fournit aucun élément permettant de vérifier la hauteur homogène des cartes, l’alignement de la nouvelle bordure ou le rendu de l’encart sur les deux thèmes.

- Le bloc de réassurance est un simple `div` ajouté après la liste, sans structure sémantique ni relation explicite avec la section des services ; son rôle peut être perdu dans la navigation par régions ou technologies d’assistance.

- Le texte de réassurance reste entièrement codé en dur dans la page, alors que les libellés commerciaux sont désormais modélisés dans les données ; cette organisation rend les futures variantes éditoriales incohérentes et difficiles à maintenir.

- Le commentaire de section mentionne les critères AC-1, AC-2 et AC-3, mais omet AC-4 alors que cette modification prétend aussi préserver l’accessibilité et le responsive.

- La suppression de `.offer__price` est limitée à la homepage, tandis que les mêmes concepts et classes tarifaires existent encore dans `services.vue`, ce qui laisse une expérience incohérente entre les deux pages.

- Les liens promettent des contenus distincts (« types d’automatisation », « quand utiliser un agent », « projets sur mesure »), mais rien dans le diff ne garantit que ces trois sujets sont effectivement identifiables ou facilement trouvables sur la page cible.

- Aucun contrôle n’est ajouté pour vérifier que l’encart conserve un contraste suffisant avec `var(--surface-1)` et `var(--text-body)` dans chaque thème, malgré l’exigence explicite de parité visuelle.
tokens used
41 627
- Les trois liens contextuels pointent tous vers `/services` sans ancre ni paramètre identifiant l’offre, si bien que le visiteur n’arrive pas directement au contenu promis.

- La page `/services` continue d’afficher publiquement « À partir de 3 500 € HT » ; le parcours depuis la homepage réintroduit donc immédiatement l’ancrage tarifaire supprimé.

- Les `aria-label` reprennent uniquement le texte visible et n’indiquent pas l’offre concernée, ce qui rend la liste de liens moins compréhensible avec un lecteur d’écran.

- La flèche `→` fait partie du nom accessible du lien et peut être verbalisée inutilement ; elle devrait être décorative ou séparée du libellé accessible.

- Le pseudo-élément `::after` rend toujours toute la carte cliquable, mais aucun test ne vérifie que cette zone étendue ne recouvre pas le texte, le focus ou d’éventuels éléments interactifs futurs.

- Le changement transforme une information tarifaire immédiatement lisible en trois appels à l’action très longs, sans validation visible du retour à la ligne dans les cartes desktop étroites.

- Aucun test automatisé ne couvre la disparition effective des anciens prix, les trois libellés exacts, le texte de réassurance ou le nom accessible des liens.

- La tâche revendique une validation responsive mobile, mais le diff n’ajoute aucune règle spécifique pour l’encart de réassurance ni pour les libellés d’action allongés aux seuils de 900 px et 680 px.

- La tâche revendique une validation visuelle, mais le diff ne fournit aucun élément permettant de vérifier la hauteur homogène des cartes, l’alignement de la nouvelle bordure ou le rendu de l’encart sur les deux thèmes.

- Le bloc de réassurance est un simple `div` ajouté après la liste, sans structure sémantique ni relation explicite avec la section des services ; son rôle peut être perdu dans la navigation par régions ou technologies d’assistance.

- Le texte de réassurance reste entièrement codé en dur dans la page, alors que les libellés commerciaux sont désormais modélisés dans les données ; cette organisation rend les futures variantes éditoriales incohérentes et difficiles à maintenir.

- Le commentaire de section mentionne les critères AC-1, AC-2 et AC-3, mais omet AC-4 alors que cette modification prétend aussi préserver l’accessibilité et le responsive.

- La suppression de `.offer__price` est limitée à la homepage, tandis que les mêmes concepts et classes tarifaires existent encore dans `services.vue`, ce qui laisse une expérience incohérente entre les deux pages.

- Les liens promettent des contenus distincts (« types d’automatisation », « quand utiliser un agent », « projets sur mesure »), mais rien dans le diff ne garantit que ces trois sujets sont effectivement identifiables ou facilement trouvables sur la page cible.

- Aucun contrôle n’est ajouté pour vérifier que l’encart conserve un contraste suffisant avec `var(--surface-1)` et `var(--text-body)` dans chaque thème, malgré l’exigence explicite de parité visuelle.
