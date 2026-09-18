Reading prompt from stdin...
2026-09-18T20:40:12.612654Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: medium
reasoning summaries: none
session id: 01a0b63f-8b9f-7fa3-9e89-7867c9fc51e3
--------
user
# Blind Hunter Prompt — Story 15.3

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/15-3/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise `bmad-review-adversarial-general` pour examiner le diff avec une posture adversariale et produire uniquement une liste de constats actionnables, sans classement.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/r0/bmad-review-adversarial-general/SKILL.md && printf '\\n--- DIFF ---\\n' && sed -n '1,260p' docs/implementation-artifacts/code-reviews/15-3/full.diff" in /Users/simon/dev/jouan.ovh
 exited 1 in 0ms:
sed: /Users/simon/.codex/skills/r0/bmad-review-adversarial-general/SKILL.md: No such file or directory

codex
Le chemin abrégé du catalogue ne correspond pas à un fichier présent à cet emplacement ; je localise la copie effectivement installée, puis je poursuis la revue sur le diff demandé.
exec
/bin/zsh -lc "rg --files /Users/simon/.codex/skills /Users/simon/.agents/skills /Users/simon/dev/jouan.ovh/.agents/skills 2>/dev/null | rg 'bmad-review-adversarial-general/SKILL\\.md"'$|15-3/full'"\\.diff"'$'"'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
/Users/simon/dev/jouan.ovh/.agents/skills/bmad-review-adversarial-general/SKILL.md
/Users/simon/.codex/skills/bmad-review-adversarial-general/SKILL.md

exec
/bin/zsh -lc "sed -n '1,260p' /Users/simon/.codex/skills/bmad-review-adversarial-general/SKILL.md; printf '\\n--- DIFF ---\\n'; sed -n '1,320p' docs/implementation-artifacts/code-reviews/15-3/full.diff" in /Users/simon/dev/jouan.ovh
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
/bin/zsh -lc "sed -n '321,700p' docs/implementation-artifacts/code-reviews/15-3/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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
 

codex
J’ai chargé les règles de la compétence et l’intégralité du diff. Je vérifie maintenant les composants et conventions réellement utilisés afin que les constats portent sur des défauts observables, pas seulement sur des réserves stylistiques.
exec
/bin/zsh -lc 'rg -n "defineOptions|<template|usePageSeo|servicesJsonLd|ZCard|ZIcon|care-card|section--sunken|28 routes|13 routes|theme|clair|light" app/components/ui app/pages/services.vue docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md AGENTS.md 2>/dev/null | head -240' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
AGENTS.md:41:docker compose run --rm web sh -c "corepack enable && pnpm generate"   # build statique SSG (13 routes)
AGENTS.md:56:- **Tokens & Design System :** Dark-first (pas de mode clair). Tokens CSS custom properties exposés globalement sur `:root` dans `app/assets/scss/abstract/_root.scss`. Consommation via `var(--token)`.
AGENTS.md:75:│   │   ├── ui/              # Primitives DS auto-importées sans préfixe (ZButton, ZCard, ZExternalLink, ZCustomCursor...)
AGENTS.md:76:│   │   ├── card/            # Sous-blocs ZCardHeader, ZCardBody, ZCardFooter
AGENTS.md:85:│   │   └── usePageSeo.ts    # Helper universel useSeoMeta, canonical et Schema.org / JSON-LD
AGENTS.md:90:│   └── pages/               # 13 routes statiques pré-rendues
AGENTS.md:119:- **SEO :** Utiliser systématiquement `usePageSeo({ title, description, path, ... })` pour garantir l'unicité des canonicals et des balises OpenGraph/Twitter.
AGENTS.md:127:- **Primitives globales :** Les classes de mise en page `.section`, `.section--sunken`, `.container`, `.eyebrow`, `.prose`, `.hero__tags` vivent dans `app/assets/scss/base/_layout.scss`. **Ne JAMAIS les redéclarer dans un `<style scoped>` de page**.
AGENTS.md:151:- **Neutralisation universelle :** Tout effet cinétique (auroras, 3D tilt sur `ZCard`, magnétisme sur `ZButton`, micro-curseur) doit être strictement désactivé sous `prefers-reduced-motion: reduce` et sous `@media (hover: none)`.
AGENTS.md:169:   - 13 routes statiques (+ assets) pré-rendues avec succès par Nitro.
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:22:     - Classe de section : `<section class="section section--sunken care-section">`
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:27:     - Carte dédiée `<ZCard>` pour l'offre AI Care :
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:30:       - Icône : `bot` (`<ZIcon name="bot" />`)
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:31:       - Prix : `À partir de 250 € HT / mois` (dans `.care-card__price`, plancher de maintenance pour système simple)
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:61:   **When** la page est rendue en mode sombre ou en mode clair
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:64:     - AI Care : `.section.section--sunken` (fond sunken discret)
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:69:4. **Given** les données structurées Schema.org (`servicesJsonLd`) et le référencement
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:71:   **Then** l'offre `AI Care` est intégrée à `servicesJsonLd` dans l'ItemList (avec son prix `À partir de 250 € HT / mois` et son ancre `url: "${siteUrl}/services#ai-care"`).
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:76:   **Then** elle réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript vue-tsc et 28 routes statiques pré-rendues :
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:84:  - [x] Structurer la section avec `.section.section--sunken.care-section` insérée entre la grille de build et la section process.
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:88:  - [x] Intégrer une carte `<ZCard>` dédiée (ou layout horizontal adapté) avec badge `MAINTIEN EN CONDITION OPÉRATIONNELLE`, icône `bot`, prix `À partir de 250 € HT / mois`, les 5 points de livrables et le disclaimer des consommations tierces d'APIs/tokens.
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:102:  - [x] Tester le contraste et l'alternance visuelle sur les thèmes sombre et clair.
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:105:  - [x] Ajouter AI Care dans l'objet `servicesJsonLd` comme service d'exploitation (`@type: "Service"`).
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:115:  - [x] Vérifier que les 28 routes statiques compilent sans erreur.
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:123:- **Règle NFR6 :** Zéro emoji dans l'UI et le code. Utiliser les icônes vectorielles du composant `<ZIcon>`.
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:125:- **Règle Layout SCSS :** Ne pas redéclarer `.section`, `.section--sunken`, `.container`, `.eyebrow`, `.prose` dans le `<style scoped>`.
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:204:- `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> Gate 100% verte (0 erreurs lint, 0 erreurs types, 28 routes statiques pré-rendues).
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:207:- Création de la section dédiée AI Care (`.section.section--sunken.care-section`) dans `app/pages/services.vue` avec titre, prose de cadrage, badge « MAINTIEN EN CONDITION OPÉRATIONNELLE », icône `bot`, prix « À partir de 250 € HT / mois », 5 livrables et clause de transparence.
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:209:- Alternance visuelle des sections en 3 temps : Build (`.section`), AI Care (`.section.section--sunken`), Process (`.section`).
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:210:- Synchronisation complète de Schema.org `servicesJsonLd` avec ajout d'AI Care et des attributs `url` pour les 4 offres.
app/pages/services.vue:1:<template>
app/pages/services.vue:16:            <ZCard :id="offer.id" class="offer" :accent="offer.featured" :featured="offer.featured">
app/pages/services.vue:20:              <div class="offer__icon"><ZIcon :name="offer.icon" /></div>
app/pages/services.vue:46:            </ZCard>
app/pages/services.vue:53:    <section class="section section--sunken care-section">
app/pages/services.vue:63:        <ZCard :id="careOffer.id" class="care-card">
app/pages/services.vue:64:          <div class="care-card__info">
app/pages/services.vue:65:            <div class="care-card__badge">
app/pages/services.vue:68:            <div class="care-card__icon"><ZIcon name="bot" /></div>
app/pages/services.vue:69:            <h3 class="care-card__title">{{ careOffer.title }}</h3>
app/pages/services.vue:70:            <p class="care-card__desc">{{ careOffer.desc }}</p>
app/pages/services.vue:72:            <div class="care-card__footer">
app/pages/services.vue:73:              <div class="care-card__price">
app/pages/services.vue:76:              <p v-if="careOffer.disclaimer" class="care-card__disclaimer">
app/pages/services.vue:79:              <div class="care-card__cta">
app/pages/services.vue:85:                  class="care-card__btn"
app/pages/services.vue:93:          <div class="care-card__details">
app/pages/services.vue:94:            <h4 class="care-card__points-title">Inclus dans l’accompagnement :</h4>
app/pages/services.vue:95:            <ul class="care-card__points">
app/pages/services.vue:99:        </ZCard>
app/pages/services.vue:125:            <template #iconRight><ZIcon name="arrow" /></template>
app/pages/services.vue:142:  /** Nom d'icône dans le set ZIcon. */
app/pages/services.vue:294:const servicesJsonLd = {
app/pages/services.vue:346:usePageSeo({
app/pages/services.vue:353:  jsonLd: servicesJsonLd,
app/pages/services.vue:363:// .section / .section--sunken / .container / .eyebrow / .prose : primitives de
app/pages/services.vue:372:  font-weight: var(--fw-light);
app/pages/services.vue:416:  // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
app/pages/services.vue:507:// ---- Section AI Care (.care-section / .care-card*) ----
app/pages/services.vue:524:.care-card {
app/pages/services.vue:532:.care-card__info {
app/pages/services.vue:537:.care-card__badge {
app/pages/services.vue:541:.care-card__icon {
app/pages/services.vue:554:.care-card__title {
app/pages/services.vue:562:.care-card__desc {
app/pages/services.vue:570:.care-card__details {
app/pages/services.vue:577:.care-card__points-title {
app/pages/services.vue:587:.care-card__points {
app/pages/services.vue:608:.care-card__footer {
app/pages/services.vue:616:.care-card__price {
app/pages/services.vue:628:.care-card__disclaimer {
app/pages/services.vue:637:.care-card__cta {
app/pages/services.vue:641:.care-card__btn {
app/pages/services.vue:671:  font-weight: var(--fw-light);
app/pages/services.vue:729:  .care-card {
app/pages/services.vue:734:  .care-card__details {
app/components/ui/ZButton.vue:1:<template>
app/components/ui/ZButton.vue:38:defineOptions({
app/components/ui/ThemeToggle.vue:1:<template>
app/components/ui/ThemeToggle.vue:4:    class="theme-toggle"
app/components/ui/ThemeToggle.vue:9:    <ZIcon :name="currentIcon" class="theme-toggle__icon" />
app/components/ui/ThemeToggle.vue:47:    light: "Clair",
app/components/ui/ThemeToggle.vue:55:.theme-toggle {
app/components/ui/ThemeToggle.vue:93:  &:active .theme-toggle__icon {
app/components/ui/ThemeToggle.vue:99:  .theme-toggle {
app/components/ui/ThemeToggle.vue:106:  .theme-toggle,
app/components/ui/ThemeToggle.vue:107:  .theme-toggle__icon {
app/components/ui/ZBadge.vue:1:<template>
app/components/ui/ZAvatar.vue:1:<template>
app/components/ui/ZAvatar.vue:4:    <template v-else>{{ fallbackInitials }}</template>
app/components/ui/ZInput.vue:1:<template>
app/components/ui/ZInput.vue:48:defineOptions({
app/components/ui/ZExternalLink.vue:1:<template>
app/components/ui/ZCustomCursor.vue:1:<template>
app/components/ui/ZIcon.vue:1:<template>
app/components/ui/ZIcon.vue:64:// Logo diamant (gem) : carré pivoté en currentColor + facette haute éclairée
app/components/ui/ZCard.vue:1:<template>
app/components/ui/ZCard.vue:27:defineOptions({
app/components/ui/ZCard.vue:176:  background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
app/components/ui/ZTag.vue:1:<template>
app/components/ui/ZTag.vue:26:defineOptions({

2026-09-18T20:40:54.114685Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '1,90p' app/components/ui/ZCard.vue; sed -n '1,100p' app/components/ui/ZIcon.vue; sed -n '1,80p' app/components/ui/ZButton.vue; sed -n '1,180p' app/pages/services.vue" in /Users/simon/dev/jouan.ovh
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
  monitor:
    '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
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
<template>
  <component
    :is="as"
    ref="buttonEl"
    v-bind="passthroughAttrs"
    class="zbtn"
    :class="[`zbtn--${variant}`, `zbtn--${size}`, { 'zbtn--magnetic': magnetic }]"
    :type="buttonType"
    :disabled="isNativeButton ? disabled || undefined : undefined"
    :aria-disabled="!isNativeButton && disabled ? 'true' : undefined"
    :tabindex="isDisabledNonNative ? -1 : undefined"
    @click="blockDisabledActivation"
    @keydown.enter="blockDisabledActivation"
    @keydown.space="blockDisabledActivation"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <span ref="innerEl" class="zbtn__inner">
      <span v-if="icon || $slots.icon" class="zbtn__icon">
        <component :is="icon" v-if="icon" aria-hidden="true" />
        <slot v-else name="icon" />
      </span>
      <slot />
      <span v-if="iconRight || $slots.iconRight" class="zbtn__icon">
        <component :is="iconRight" v-if="iconRight" aria-hidden="true" />
        <slot v-else name="iconRight" />
      </span>
    </span>
  </component>
</template>

<script setup lang="ts">
// Primitive bouton du DS — label mono, dimensions généreuses, micro-effet magnétique.
// Porté de docs/design_system/components/core/Button.jsx et Home - Awwwards.html.
import type { Component, ComponentPublicInstance } from "vue";
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, watch } from "vue";

defineOptions({
  inheritAttrs: false,
});

type IconProp = string | Component;

interface Props {
  /** Style visuel. @default "primary" */
  variant?: "primary" | "secondary" | "ghost" | "terminal" | "danger";
  /** @default "md" — hauteurs 32 / 46 / 48 */
  size?: "sm" | "md" | "lg";
  /** Icône leading via composant Vue ou nom de composant. */
  icon?: IconProp;
  /** Icône trailing via composant Vue ou nom de composant. */
  iconRight?: IconProp;
  /** Élément rendu (polymorphe), ex. "a" pour un lien. @default "button" */
  as?: string | Component;
  /** Désactivé : natif sur <button>, aria-disabled + pointer-events sur les autres tags. */
  disabled?: boolean;
  /** Activer le micro-effet magnétique au curseur. @default true */
  magnetic?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  icon: undefined,
  iconRight: undefined,
  as: "button",
  disabled: false,
  magnetic: true,
});

const attrs = useAttrs();
const buttonEl = ref<Element | ComponentPublicInstance | null>(null);
const innerEl = ref<HTMLElement | null>(null);
const isReducedMotion = ref(false);
let motionMq: MediaQueryList | null = null;

function onMotionChange(event: MediaQueryListEvent) {
  isReducedMotion.value = event.matches;
  if (event.matches) {
    onMouseLeave();
<template>
  <main class="services">
    <!-- En-tête + grille d'offres de build (story 12.5 & story 15.2) -->
    <section class="section">
      <div class="container">
        <p class="eyebrow"><span aria-hidden="true">// </span>services</p>
        <h1 class="services__title">Le bon niveau de système pour le bon problème.</h1>
        <p class="prose services__intro">
          Je pars d’un workflow existant, pas d’une technologie à placer. Certaines frictions se règlent avec une
          automatisation simple. D’autres nécessitent plusieurs intégrations, de l’IA ou une véritable application
          métier. Le rôle du diagnostic est justement de déterminer jusqu’où il est utile d’aller.
        </p>

        <ul class="grid-3">
          <li v-for="offer in offers" :key="offer.id">
            <ZCard :id="offer.id" class="offer" :accent="offer.featured" :featured="offer.featured">
              <div v-if="offer.badge" class="offer__badge">
                <ZBadge :tone="offer.badgeTone || 'neutral'">{{ offer.badge }}</ZBadge>
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

    <!-- Section AI Care : Maintien en condition opérationnelle (story 15.3) -->
    <section class="section section--sunken care-section">
      <div class="container">
        <p class="eyebrow"><span aria-hidden="true">// </span>après la mise en production</p>
        <h2 class="care-section__title">Le système doit continuer à fonctionner.</h2>
        <p class="prose care-section__intro">
          Une automatisation utile doit continuer à fonctionner après sa mise en production. AI Care couvre le maintien
          en condition opérationnelle du système : monitoring, maintenance, support, suivi des coûts et adaptations
          mineures liées aux APIs ou aux modèles.
        </p>

        <ZCard :id="careOffer.id" class="care-card">
          <div class="care-card__info">
            <div class="care-card__badge">
              <ZBadge tone="neutral">{{ careOffer.badge }}</ZBadge>
            </div>
            <div class="care-card__icon"><ZIcon name="bot" /></div>
            <h3 class="care-card__title">{{ careOffer.title }}</h3>
            <p class="care-card__desc">{{ careOffer.desc }}</p>

            <div class="care-card__footer">
              <div class="care-card__price">
                <b>{{ careOffer.price }}</b>
              </div>
              <p v-if="careOffer.disclaimer" class="care-card__disclaimer">
                {{ careOffer.disclaimer }}
              </p>
              <div class="care-card__cta">
                <ZButton
                  :as="NuxtLink"
                  to="/contact"
                  variant="secondary"
                  :aria-label="careOffer.ctaAriaLabel"
                  class="care-card__btn"
                >
                  {{ careOffer.ctaText }}
                </ZButton>
              </div>
            </div>
          </div>

          <div class="care-card__details">
            <h4 class="care-card__points-title">Inclus dans l’accompagnement :</h4>
            <ul class="care-card__points">
              <li v-for="point in careOffer.points" :key="point">{{ point }}</li>
            </ul>
          </div>
        </ZCard>
      </div>
    </section>

    <!-- Section process : 4 étapes ordonnées + CTA (story 12.5 & story 15.3) -->
    <section class="section">
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
// Page Services : catalogue d'offres de build sur devis + section dédiée AI Care + process 4 étapes + CTA contact.
// Données statiques (3 offres de build, 1 offre de care, 4 étapes) déclarées localement. Prerender-safe, dark-first.
import { NuxtLink } from "#components";
import { SITE } from "~/data/site";

interface Offer {
  /** Clé v-for et ancre HTML stable (indépendante du contenu affiché). */
  id: string;
  /** Nom d'icône dans le set ZIcon. */
  icon: string;
  badge: string;
  badgeTone?: "accent" | "neutral";
  title: string;
  hook?: string;
  desc: string;
  points: string[];
  price: string;
  disclaimer?: string;
  /** Offre mise en avant : carte accent + glow. */
  featured: boolean;
  ctaText: string;
  ctaAriaLabel: string;
}

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

interface Step {
  n: string;
  title: string;
  desc: string;
  inlineCta?: {
    to: string;
    label: string;
  };
}

// Les 3 offres de build officielles V1.1 — 1re personne, vouvoiement, zéro emoji.

2026-09-18T20:40:57.406904Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '680,750p' app/pages/services.vue; sed -n '270,360p' app/pages/services.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
  color: var(--text-strong);
}

.process__desc {
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.process__cta-inline-wrapper {
  margin-top: auto;
  padding-top: var(--space-3);
}

.process__inline-cta {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--accent);
  text-decoration: none;
  transition:
    color var(--dur-base) var(--ease-standard),
    text-decoration-color var(--dur-base) var(--ease-standard);

  &:hover {
    color: var(--accent-hover);
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
    border-radius: var(--radius-xs);
  }
}

.process__cta {
  margin-top: var(--space-12);
  text-align: center;
}

// ---- Responsive ----
@media (width <= 900px) {
  .grid-3,
  .process {
    grid-template-columns: 1fr;
  }

  .care-card {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }

  .care-card__details {
    padding-top: var(--space-4);
    padding-left: 0;
    border-top: 1px solid var(--border-subtle);
    border-left: none;
  }
}
</style>
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

const siteUrl = useSiteUrl();

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Services & Systèmes IA — Simon Jouan",
  description:
    "Conception et développement de systèmes IA et automatisation de processus métier : automatisation ciblée, workflows complets et applications métier sur mesure.",
  url: `${siteUrl}/services`,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      ...offers.map((offer, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Service",
          name: offer.title,
          description: offer.desc,
          url: `${siteUrl}/services#${offer.id}`,
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
      {
        "@type": "ListItem",
        position: offers.length + 1,
        item: {
          "@type": "Service",
          name: careOffer.title,
          description: careOffer.desc,
          url: `${siteUrl}/services#${careOffer.id}`,
          provider: {
            "@type": "Organization",
            "@id": `${siteUrl}/#organization`,
            name: SITE.profile.name,
          },
          offers: {
            "@type": "Offer",
            description: careOffer.price,
          },
        },
      },
    ],
  },
};

usePageSeo({
  title: "Services & Systèmes IA — Simon Jouan",
  description:
    "Conception et développement de systèmes IA et automatisation de processus métier : automatisation ciblée, workflows complets et applications métier sur mesure.",
  path: "/services",
  image: "/images/portrait.jpeg",
  type: "website",
  jsonLd: servicesJsonLd,
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) */
.services {
  display: block;

2026-09-18T20:41:04.909246Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
- La story affirme une validation visuelle desktop/mobile, mais le diff ne fournit aucune capture, URL testée, scénario de vérification ni preuve de contrôle navigateur.
- Le critère de test en « mode clair » est incohérent avec le projet, dont le design system est explicitement dark-first sans mode clair.
- La documentation annonce 28 routes statiques alors que les instructions projet indiquent 13 routes ; cette divergence n’est pas expliquée ni vérifiée.
- Le journal de validation affirme une gate Docker verte, mais ne fournit ni sortie de commande ni artefact permettant de confirmer réellement le résultat.
- Le prix AI Care est uniquement rendu comme une chaîne textuelle et n’est pas décrit avec `price`, `priceCurrency` ou une période exploitable dans Schema.org.
- Les objets `Offer` utilisent `description` pour contenir un prix, ce qui réduit fortement la qualité sémantique des données structurées.
- Les offres JSON-LD ne précisent ni disponibilité, ni conditions, ni périmètre, alors que le texte marketing introduit un abonnement mensuel.
- Le prix « à partir de 250 € HT / mois » ne précise pas ce qui est inclus dans ce plancher, ce qui rend l’offre impossible à comparer ou à comprendre sans échange commercial.
- « Monitoring proactif », « support réactif » et « mesure factuelle des KPI » ne définissent aucune fréquence, canal, délai de réponse, astreinte ou livrable concret.
- « Maintenance corrective », « adaptations mineures » et « optimisation continue » n’ont aucune limite de volume, de temps ou de complexité et peuvent être interprétés comme une promesse de support illimité.
- La clause sur les consommations tierces mélange refacturation au réel et prise en charge directe par le client sans préciser le mécanisme choisi, la responsabilité de paiement ou la gestion des dépassements.
- La phrase « Pas d'engagement imposé au build » est ambiguë : elle ne dit pas clairement si AI Care est optionnel après livraison, résiliable mensuellement ou nécessaire pour maintenir la garantie de fonctionnement.
- Le bouton intitulé « Découvrir AI Care » redirige directement vers `/contact` sans fournir de contenu supplémentaire permettant réellement de découvrir l’offre.
- L’étape « Exploitation & mesure » mentionne AI Care comme une transition possible, mais ne décrit ni les conditions de déclenchement, ni le transfert de responsabilité après la mise en production.
- Le Blueprint facturable à partir de 750 € HT est ajouté sans préciser ses livrables, sa durée, ses critères de déclenchement ni son articulation avec le devis final.
- Le texte du diagnostic le qualifie de gratuit, mais ne précise pas si cette gratuité couvre uniquement l’appel de 20 à 30 minutes ou également une analyse préparatoire.
- La nouvelle taille d’icône `22px` est codée en dur alors que les règles du projet imposent l’utilisation des tokens de design.
- L’opacité `0.85` du disclaimer est également une valeur visuelle non tokenisée, sans justification dans la spécification.
- La carte AI Care reprend une structure et des informations proches des offres de build sans composant ou modèle de données partagé, ce qui augmente le risque de divergence future entre les deux présentations.
- Le diff ne modifie aucun test automatisé ni contrôle dédié aux nouvelles ancres, au JSON-LD ajouté ou à l’accessibilité de la section AI Care.
- Les cases de toutes les tâches sont cochées alors que les éléments de preuve nécessaires à la revue visuelle, au contraste et à la validation comportementale ne figurent pas dans le diff.
- La mise à jour du statut de la story vers `review` et du sprint status est présentée comme terminée alors que la revue adversariale et la vérification visuelle obligatoire restent encore à effectuer.
tokens used
38 035
- La story affirme une validation visuelle desktop/mobile, mais le diff ne fournit aucune capture, URL testée, scénario de vérification ni preuve de contrôle navigateur.
- Le critère de test en « mode clair » est incohérent avec le projet, dont le design system est explicitement dark-first sans mode clair.
- La documentation annonce 28 routes statiques alors que les instructions projet indiquent 13 routes ; cette divergence n’est pas expliquée ni vérifiée.
- Le journal de validation affirme une gate Docker verte, mais ne fournit ni sortie de commande ni artefact permettant de confirmer réellement le résultat.
- Le prix AI Care est uniquement rendu comme une chaîne textuelle et n’est pas décrit avec `price`, `priceCurrency` ou une période exploitable dans Schema.org.
- Les objets `Offer` utilisent `description` pour contenir un prix, ce qui réduit fortement la qualité sémantique des données structurées.
- Les offres JSON-LD ne précisent ni disponibilité, ni conditions, ni périmètre, alors que le texte marketing introduit un abonnement mensuel.
- Le prix « à partir de 250 € HT / mois » ne précise pas ce qui est inclus dans ce plancher, ce qui rend l’offre impossible à comparer ou à comprendre sans échange commercial.
- « Monitoring proactif », « support réactif » et « mesure factuelle des KPI » ne définissent aucune fréquence, canal, délai de réponse, astreinte ou livrable concret.
- « Maintenance corrective », « adaptations mineures » et « optimisation continue » n’ont aucune limite de volume, de temps ou de complexité et peuvent être interprétés comme une promesse de support illimité.
- La clause sur les consommations tierces mélange refacturation au réel et prise en charge directe par le client sans préciser le mécanisme choisi, la responsabilité de paiement ou la gestion des dépassements.
- La phrase « Pas d'engagement imposé au build » est ambiguë : elle ne dit pas clairement si AI Care est optionnel après livraison, résiliable mensuellement ou nécessaire pour maintenir la garantie de fonctionnement.
- Le bouton intitulé « Découvrir AI Care » redirige directement vers `/contact` sans fournir de contenu supplémentaire permettant réellement de découvrir l’offre.
- L’étape « Exploitation & mesure » mentionne AI Care comme une transition possible, mais ne décrit ni les conditions de déclenchement, ni le transfert de responsabilité après la mise en production.
- Le Blueprint facturable à partir de 750 € HT est ajouté sans préciser ses livrables, sa durée, ses critères de déclenchement ni son articulation avec le devis final.
- Le texte du diagnostic le qualifie de gratuit, mais ne précise pas si cette gratuité couvre uniquement l’appel de 20 à 30 minutes ou également une analyse préparatoire.
- La nouvelle taille d’icône `22px` est codée en dur alors que les règles du projet imposent l’utilisation des tokens de design.
- L’opacité `0.85` du disclaimer est également une valeur visuelle non tokenisée, sans justification dans la spécification.
- La carte AI Care reprend une structure et des informations proches des offres de build sans composant ou modèle de données partagé, ce qui augmente le risque de divergence future entre les deux présentations.
- Le diff ne modifie aucun test automatisé ni contrôle dédié aux nouvelles ancres, au JSON-LD ajouté ou à l’accessibilité de la section AI Care.
- Les cases de toutes les tâches sont cochées alors que les éléments de preuve nécessaires à la revue visuelle, au contraste et à la validation comportementale ne figurent pas dans le diff.
- La mise à jour du statut de la story vers `review` et du sprint status est présentée comme terminée alors que la revue adversariale et la vérification visuelle obligatoire restent encore à effectuer.
