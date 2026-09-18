Reading prompt from stdin...
2026-09-18T21:12:23.351980Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: medium
reasoning summaries: none
session id: 01a0b65d-01b6-71e0-b30a-e1e0170a3d83
--------
user
# Blind Hunter Prompt — Story 15.4

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/15-4/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise la skill `bmad-review-adversarial-general` pour auditer le diff de Story 15.4 avec le niveau de scepticisme demandé, puis je fournirai uniquement une liste Markdown de constats actionnables.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/bmad-review-adversarial-general/SKILL.md && printf '\\n---DIFF---\\n' && sed -n '1,260p' docs/implementation-artifacts/code-reviews/15-4/full.diff" in /Users/simon/dev/jouan.ovh
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

exec
/bin/zsh -lc "sed -n '261,620p' docs/implementation-artifacts/code-reviews/15-4/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '621,900p' docs/implementation-artifacts/code-reviews/15-4/full.diff && printf '\\n---REPO STATUS---\\n' && git status --short && printf '\\n---SPRINT/DEFERRED HITS---\\n' && rg -n \"15-4|15.4|15-3|15.3|deferred|AI Care|3.?500|3500|490\" docs/implementation-artifacts/sprint-status.yaml docs/implementation-artifacts/deferred-work.md docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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
 
 

---REPO STATUS---
 M docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md
 M docs/implementation-artifacts/sprint-status.yaml
?? docs/implementation-artifacts/code-reviews/15-4/

---SPRINT/DEFERRED HITS---
docs/implementation-artifacts/deferred-work.md:45:- ~~**Nuancer la mention du Blueprint dans l'étape Cadrage** (`app/pages/services.vue`)~~ — ✅ **Résolu en 15.3** : étape 02 Cadrage mise à jour avec mention du Blueprint facturable optionnel à partir de 750 € HT pour sujets complexes.
docs/implementation-artifacts/deferred-work.md:46:- ~~**Enrichir les entités Service de `servicesJsonLd` avec leur URL d'ancrage respective** (`app/pages/services.vue`)~~ — ✅ **Résolu en 15.3** : attributs `url` pointant vers `#automatisation`, `#workflow`, `#sur-mesure` et `#ai-care` intégrés dans Schema.org `servicesJsonLd`.
docs/implementation-artifacts/deferred-work.md:51:- ~~**Désancrage tarifaire résiduel sur la page catalogue `/services`**~~ — ✅ **Résolu en 15.2** (`app/pages/services.vue` : 3 offres sur devis, élimination définitive du prix d'entrée 3 500 € HT et restructuration du catalogue de build).
docs/implementation-artifacts/sprint-status.yaml:38:last_updated: "2026-09-18 (Story 15.4 terminée et prête pour review)"
docs/implementation-artifacts/sprint-status.yaml:160:  15-3-page-services-section-dediee-ai-care-et-process-4-etapes: done
docs/implementation-artifacts/sprint-status.yaml:161:  15-4-coherence-globale-seo-formulaire-contact-et-gate-docker: review
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:5:# Story 15.3: Page Services — Section Dédiée AI Care Après Mise en Production & Process 4 Étapes
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:26:       > *« Une automatisation utile doit continuer à fonctionner après sa mise en production. AI Care couvre le maintien en condition opérationnelle du système : monitoring, maintenance, support, suivi des coûts et adaptations mineures liées aux APIs ou aux modèles. »*
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:27:     - Carte dédiée `<ZCard>` pour l'offre AI Care :
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:29:       - Titre : `AI Care`
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:40:       - Bouton CTA : `<ZButton>` pointant vers `/contact` avec `:aria-label="Découvrir l'accompagnement AI Care"` et libellé `Découvrir AI Care` (variante `secondary`)
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:58:        - Description : `Mise en production, mesure initiale de performance et maintien en condition opérationnelle lorsque le workflow le justifie (via AI Care).`
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:64:     - AI Care : `.section.section--sunken` (fond sunken discret)
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:71:   **Then** l'offre `AI Care` est intégrée à `servicesJsonLd` dans l'ItemList (avec son prix `À partir de 250 € HT / mois` et son ancre `url: "${siteUrl}/services#ai-care"`).
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:83:- [x] Tâche 1 — Création de la section dédiée « AI Care » dans `app/pages/services.vue` (AC: 1, 3)
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:96:  - [x] Mettre à jour l'étape `04` : Renommer en `Exploitation & mesure` avec mention de la transition vers AI Care.
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:97:  - [x] Marquer comme résolu le point de dette différé correspondant dans `docs/implementation-artifacts/deferred-work.md`.
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:100:  - [x] Déclarer les styles scoped de la carte AI Care dans `app/pages/services.vue` en utilisant exclusivement les tokens de spacing, border, typography et color.
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:105:  - [x] Ajouter AI Care dans l'objet `servicesJsonLd` comme service d'exploitation (`@type: "Service"`).
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:107:  - [x] Marquer comme résolu le point de dette différé Schema.org dans `docs/implementation-artifacts/deferred-work.md`.
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:119:- [x] [Review][Patch] Typographie et dimensionnement du glyphe de l'icône AI Care : documenter l'exception design kit 22px de ZIcon pour alignement architectural avec `.offer__icon` [`app/pages/services.vue:548`]
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:125:- **Fichier de suivi de dette :** [`docs/implementation-artifacts/deferred-work.md`](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/deferred-work.md).
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:132:### Données Officielles V1.1 pour AI Care
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:149:  title: "AI Care",
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:161:  ctaText: "Découvrir AI Care",
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:162:  ctaAriaLabel: "Découvrir l'accompagnement AI Care",
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:191:    desc: "Mise en production, mesure initiale de performance et maintien en condition opérationnelle lorsque le workflow le justifie (via AI Care).",
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:197:- [Cahier des Epics : docs/planning-artifacts/epics.md#Story-15-3](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:199:- [Dette différée : docs/implementation-artifacts/deferred-work.md](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/deferred-work.md)
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:211:- Création de la section dédiée AI Care (`.section.section--sunken.care-section`) dans `app/pages/services.vue` avec titre, prose de cadrage, badge « MAINTIEN EN CONDITION OPÉRATIONNELLE », icône `bot`, prix « À partir de 250 € HT / mois », 5 livrables et clause de transparence.
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:212:- Réalignement des 4 étapes du process avec mention du Blueprint facturable (à partir de 750 € HT) pour l'étape 02 Cadrage et renommage de l'étape 04 en « Exploitation & mesure » avec mention de transition vers AI Care.
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:213:- Alternance visuelle des sections en 3 temps : Build (`.section`), AI Care (`.section.section--sunken`), Process (`.section`).
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:214:- Synchronisation complète de Schema.org `servicesJsonLd` avec ajout d'AI Care et des attributs `url` pour les 4 offres.
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:215:- Résolution des deux dettes techniques différées de la story 15.2 dans `docs/implementation-artifacts/deferred-work.md`.
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:219:- `docs/implementation-artifacts/deferred-work.md` (modifié)
docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md:221:- `docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md` (modifié)
docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md:5:# Story 15.4: Cohérence Globale, SEO, Formulaire de Contact & Gate Docker Nitro SSG
docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md:30:   **Then** toutes les méta-descriptions et entités JSON-LD sont parfaitement alignées sur l'Offre Commerciale V1.1 (systèmes IA, automatisation de processus métier, offres sur devis, AI Care dès 250 € HT / mois, Blueprint dès 750 € HT).
docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md:31:   **And** aucune mention obsolète de l'ancien tarif d'entrée « 3 500 € HT » ou « 3500 » ne subsiste sur le site, ni dans le balisage HTML pré-rendu, ni dans les scripts, ni dans les données structurées.
docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md:45:5. **Given** la validation complète de la Story 15.4
docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md:47:   **Then** l'Epic 15 (« Repositionnement Commercial V1.1 ») est prêt à être clôturé avec l'ensemble de ses stories (15.1, 15.2, 15.3, 15.4) au statut `done` dans `sprint-status.yaml`.
docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md:66:  - [x] Vérifier l'alignement des objets JSON-LD (`WebPage`, `Service`, `ItemList`, `Person`, `ContactPage`, `ProfilePage`, `Blog`) sans prix d'entrée 3 500 € HT.
docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md:67:  - [x] Lancer une recherche grep globale sur `3 500`, `3500`, `490` pour garantir l'élimination totale de l'ancien catalogue dans `app/`.
docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md:80:  - [x] Mettre à jour `docs/implementation-artifacts/sprint-status.yaml` pour marquer la story 15.4 et l'epic-15.
docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md:110:- [Cahier des Epics : docs/planning-artifacts/epics.md#Story-15-4](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)
docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md:114:- [Story précédente : docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md)
docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md:123:- Grep checks: zéro occurrence de prix obsolètes (`3500`, `3 500`, `490`) dans l'arborescence `app/`.
docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md:132:- `docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md`
docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md:136:- 2026-09-18: Audit de cohérence globale, SEO, formulaire de contact et passage de la gate Docker Nitro SSG (Story 15.4 complétée et passée en review).

exec
/bin/zsh -lc "rg --files app/pages app/components app/composables | sort && printf '\\n--- claim targets ---\\n' && rg -n \"usePageSeo|Web3Forms|honeypot|subject|3.?500|490|3500|data-theme|light|dark|jsonld|JSON-LD|servicesJsonLd\" app public content nuxt.config.ts | head -240" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/components/CurrentTime.vue
app/components/FooterComponent.vue
app/components/HeaderComponent.vue
app/components/HexagonLinkComponent.vue
app/components/LinkListComponent.vue
app/components/MainComponent.vue
app/components/WindowWrapperComponent.vue
app/components/card/ZCardBody.vue
app/components/card/ZCardFooter.vue
app/components/card/ZCardHeader.vue
app/components/home/HomeAtmosComponent.vue
app/components/home/HomeBootOverlay.vue
app/components/home/HomeHeroTerminal.vue
app/components/home/HomeStackMarquee.vue
app/components/terminal/TerminalComponent.vue
app/components/terminal/TerminalManagerComponent.vue
app/components/terminal/interfaces/IProgram.ts
app/components/terminal/interfaces/IProgramManager.ts
app/components/terminal/interfaces/ITerminalConfig.ts
app/components/terminal/interfaces/index.ts
app/components/terminal/programs/About.ts
app/components/terminal/programs/Clear.ts
app/components/terminal/programs/Contact.ts
app/components/terminal/programs/HelloWorld.ts
app/components/terminal/programs/Help.ts
app/components/terminal/programs/NewTerminal.ts
app/components/terminal/programs/ProgramManager.ts
app/components/terminal/programs/Projets.ts
app/components/terminal/programs/Skills.ts
app/components/terminal/programs/SystemInfos.ts
app/components/terminal/programs/index.ts
app/components/ui/ThemeToggle.vue
app/components/ui/ZAvatar.vue
app/components/ui/ZBadge.vue
app/components/ui/ZButton.vue
app/components/ui/ZCard.vue
app/components/ui/ZCustomCursor.vue
app/components/ui/ZExternalLink.vue
app/components/ui/ZIcon.vue
app/components/ui/ZInput.vue
app/components/ui/ZTag.vue
app/composables/usePageSeo.ts
app/composables/useSiteUrl.ts
app/composables/useTerminal.ts
app/composables/useTheme.ts
app/pages/about.vue
app/pages/blog/[...slug].vue
app/pages/blog/index.vue
app/pages/confidentialite.vue
app/pages/contact/card.vue
app/pages/contact/index.vue
app/pages/index.vue
app/pages/mentions-legales.vue
app/pages/services.vue

--- claim targets ---
nuxt.config.ts:34:            "(function(){try{var stored=localStorage.getItem('jouan_theme_mode');var pref=(stored==='dark'||stored==='light'||stored==='system')?stored:'system';var isDark=pref==='dark'||(pref==='system'&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);var resolved=isDark?'dark':'light';document.documentElement.setAttribute('data-theme',resolved);document.documentElement.setAttribute('data-theme-source',pref);document.documentElement.style.colorScheme=resolved;}catch(e){var fallback=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';document.documentElement.setAttribute('data-theme',fallback);document.documentElement.setAttribute('data-theme-source','system');document.documentElement.style.colorScheme=fallback;}})();",
nuxt.config.ts:48:        highlight: false,
nuxt.config.ts:56:  // Config exposée au client. La clé d'accès Web3Forms (envoi du formulaire /contact)
nuxt.config.ts:62:      // URL de production du site (canonical / og:url / JSON-LD). Défaut = prod
app/pages/about.vue:176:usePageSeo({
app/pages/blog/[...slug].vue:122:// SEO par article (centralisé via usePageSeo, parité /about, /blog).
app/pages/blog/[...slug].vue:123:// usePageSeo résout siteUrl, canonical, og:*, twitter:* et le JSON-LD échappé.
app/pages/blog/[...slug].vue:125:usePageSeo(() => {
app/pages/blog/[...slug].vue:216:  font-weight: var(--fw-light);
app/pages/blog/index.vue:108:// JSON-LD : flux d'articles (Blog → BlogPosting) pour les moteurs / agrégateurs.
app/pages/blog/index.vue:145:usePageSeo({
app/pages/blog/index.vue:167:  font-weight: var(--fw-light);
app/pages/services.vue:135:// Données statiques (3 offres de build, 1 offre de care, 4 étapes) déclarées localement. Prerender-safe, dark-first.
app/pages/services.vue:294:const servicesJsonLd = {
app/pages/services.vue:346:usePageSeo({
app/pages/services.vue:353:  jsonLd: servicesJsonLd,
app/pages/services.vue:372:  font-weight: var(--fw-light);
app/pages/services.vue:674:  font-weight: var(--fw-light);
app/pages/mentions-legales.vue:93:import { usePageSeo } from "~/composables/usePageSeo";
app/pages/mentions-legales.vue:97:usePageSeo({
app/pages/mentions-legales.vue:119:  font-weight: var(--fw-light);
app/pages/contact/card.vue:103:usePageSeo({
app/pages/contact/index.vue:24:            <!-- Formulaire — envoi via Web3Forms (service sans serveur, clé en env). Validation
app/pages/contact/index.vue:32:                  <input v-model="honeypot" type="text" tabindex="-1" autocomplete="off" />
app/pages/contact/index.vue:105:                Web3Forms à seule fin de qualifier votre besoin et vous répondre. Consultez la
app/pages/contact/index.vue:169:// Page Contact — colonne gauche : en-tête + formulaire (story 7.1, envoi Web3Forms,
app/pages/contact/index.vue:191:interface Web3FormsResponse {
app/pages/contact/index.vue:198:// Clé Web3Forms injectée par l'env (NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY) — jamais en dur.
app/pages/contact/index.vue:218:const honeypot = ref("");
app/pages/contact/index.vue:229:// faux négatifs d'une regex stricte ; Web3Forms revalide côté service.
app/pages/contact/index.vue:278:  if (honeypot.value) {
app/pages/contact/index.vue:294:    const res = await $fetch<Web3FormsResponse>("https://api.web3forms.com/submit", {
app/pages/contact/index.vue:301:        subject: `Qualification de workflow : ${workflowSubject || "Nouveau projet"}`,
app/pages/contact/index.vue:343:usePageSeo({
app/pages/contact/index.vue:375:  font-weight: var(--fw-light);
app/pages/confidentialite.vue:53:              Le formulaire de contact s'appuie sur le service tiers <strong>Web3Forms</strong> pour acheminer les
app/pages/confidentialite.vue:58:                <strong>Sous-traitant :</strong> Web3Forms (<ZExternalLink
app/pages/confidentialite.vue:68:                Web3Forms est hébergée aux États-Unis (AWS us-east).
app/pages/confidentialite.vue:155:import { usePageSeo } from "~/composables/usePageSeo";
app/pages/confidentialite.vue:159:usePageSeo({
app/pages/confidentialite.vue:182:  font-weight: var(--fw-light);
app/pages/index.vue:292:            Quel process vous fait perdre du temps <span class="cta__highlight">chaque semaine</span> ?
app/pages/index.vue:315:// Architecture multi-pages Nuxt 4, dark-first, accent orange.
app/pages/index.vue:482:usePageSeo({
app/pages/index.vue:1342:.cta__highlight {
app/assets/fonts/Ubuntu_Mono/UFL.txt:49:copy of the Font Software, to propagate the Font Software, subject to
app/composables/useSiteUrl.ts:1:// URL publique du site (canonical / og:url / JSON-LD) — point d'accès unique.
app/composables/useSiteUrl.ts:10:  // émettrait des canonical/og:url/JSON-LD RELATIFS silencieusement cassés (ex. une ligne
app/composables/useTheme.ts:1:export type ThemePreference = "system" | "dark" | "light";
app/composables/useTheme.ts:2:export type ResolvedTheme = "dark" | "light";
app/composables/useTheme.ts:16:  const resolvedTheme = useState<ResolvedTheme>("theme-resolved", () => "dark");
app/composables/useTheme.ts:20:      return "dark";
app/composables/useTheme.ts:22:    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
app/composables/useTheme.ts:29:    document.documentElement.setAttribute("data-theme", resolved);
app/composables/useTheme.ts:30:    document.documentElement.setAttribute("data-theme-source", pref);
app/composables/useTheme.ts:35:    if (pref !== "system" && pref !== "dark" && pref !== "light") {
app/composables/useTheme.ts:54:      system: "dark",
app/composables/useTheme.ts:55:      dark: "light",
app/composables/useTheme.ts:56:      light: "system",
app/composables/useTheme.ts:69:      if (stored === "dark" || stored === "light" || stored === "system") {
app/composables/useTheme.ts:85:    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
app/composables/useTheme.ts:88:        const newResolved: ResolvedTheme = e.matches ? "dark" : "light";
public/images/undraw_programming_re_kg9v.svg:1:<svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" width="786.81995" height="572.25773" viewBox="0 0 786.81995 572.25773" xmlns:xlink="http://www.w3.org/1999/xlink"><circle cx="458.32136" cy="74.18162" r="26.70075" fill="#f2f2f2"/><path d="M872.03753,661.02307c39.6877-30.22889,58.64352-81.02546,46.77635-129.48234q-.44231-1.806-.93367-3.6038c-7.86742-28.76343-27.33167-56.10058-55.7-65.29129-23.81971-7.71694-49.81962-1.78274-74.66936-4.85149-48.78136-6.02417-86.60057-45.494-113.21115-86.81933-26.61064-41.32546-47.06182-87.58331-82.42157-121.72413-58.28479-56.27536-153.36192-68.39149-225.62671-31.76044C293.98673,254.12142,247.95487,335.39062,249.918,416.38554c1.96322,80.995,50.04632,158.43176,119.87492,199.517,25.65222,15.093,55.32138,25.78522,84.84826,22.04377,25.62011-3.24641,48.89908-17.01264,74.39861-21.09959,40.09115-6.42568,79.92687,11.70084,114.60268,32.82375,34.67571,21.12288,68.17007,46.15988,107.57436,55.95242C789.47831,715.13139,836.88051,687.80109,872.03753,661.02307Z" transform="translate(-206.59003 -163.87113)" fill="#f2f2f2"/><path d="M815.016,219.19108c-.87006-.58-1.75-1.13-2.62006-1.69a380.24008,380.24008,0,0,0-80.31-38.93l-6.54,90.22h-41.46v-103.39c-2.61-.54-5.24-1.05-7.87-1.53v104.92H626.94587A102.26992,102.26992,0,0,1,524.67595,166.5212v-.0001c-2.64.57-5.26,1.18-7.88,1.83v100.44h-40.13l-6.23-86.03a380.8581,380.8581,0,0,0-81.94,43.53c-.44.3-.88.61-1.31.91-2.21,1.55-4.39,3.13-6.56,4.73v344.19h118.27l-2.09-28.95-11.5-158.95h231.59l-11.5,158.95-2.09,28.95h116.96v-353.45Q817.65591,220.90114,815.016,219.19108Zm-298.22,142.78h-33.39l-6.17-85.3h39.56Zm159.42,0h-56.08v-1.69a6.17975,6.17975,0,0,0-6.19-6.18h-24.38a6.17757,6.17757,0,0,0-6.18,6.18v1.69h-58.71v-85.3h151.54Zm7.87,0v-85.3h40.89l-6.17,85.3Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><path d="M206.59,598.16193a289.0029,289.0029,0,0,0,28.12,28.95l730.58,1a289.0029,289.0029,0,0,0,28.12-28.95Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><path d="M702.01993,505.46245v85.704a4.12233,4.12233,0,0,0,4.11906,4.11907H833.14348a4.12232,4.12232,0,0,0,4.11907-4.11907v-85.704a4.12433,4.12433,0,0,0-4.11907-4.11452H706.139A4.12434,4.12434,0,0,0,702.01993,505.46245Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><path d="M704.99939,506.52881V590.1092a2.20523,2.20523,0,0,0,2.20141,2.20141H832.08626a2.20522,2.20522,0,0,0,2.20141-2.20141V506.52881a2.20621,2.20621,0,0,0-2.20141-2.206H707.2008A2.20623,2.20623,0,0,0,704.99939,506.52881Z" transform="translate(-206.59003 -163.87113)" fill="#3a182f"/><path d="M699.36376,607.881a2.46985,2.46985,0,0,0,1.94346.92984H837.29917a2.5024,2.5024,0,0,0,2.44606-3.0157l-2.111-10.02722a2.50694,2.50694,0,0,0-1.55811-1.81784,2.42467,2.42467,0,0,0-.888-.1675H703.40985a2.42446,2.42446,0,0,0-.888.1675,2.50671,2.50671,0,0,0-1.55811,1.81784l-2.111,10.02722A2.5005,2.5005,0,0,0,699.36376,607.881Z" transform="translate(-206.59003 -163.87113)" fill="#2f2e41"/><rect x="830.03379" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1457.66604 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="821.65681" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1440.91208 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="813.27982" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1424.15811 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="804.90284" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1407.40415 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="796.52586" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1390.65018 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="788.14888" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1373.89622 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="779.7719" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1357.14226 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="771.39491" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1340.38829 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="763.01793" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1323.63433 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="754.64095" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1306.88037 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="746.26397" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1290.1264 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="737.88699" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1273.37244 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="729.51001" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1256.61847 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="721.13302" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1239.86451 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="712.75604" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1223.11055 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="704.37906" y="595.58843" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1206.35658 1029.81882) rotate(-180)" fill="#3f3d56"/><rect x="830.13277" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1457.86401 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="821.75579" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1441.11005 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="813.37881" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1424.35608 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="805.00183" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1407.60212 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="796.62485" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1390.84816 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="788.24786" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1374.09419 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="779.87088" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1357.34023 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="771.4939" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1340.58627 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="763.11692" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1323.8323 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="754.73994" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1307.07834 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="746.36295" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1290.32437 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="737.98597" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1273.57041 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="729.60899" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1256.81645 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="721.23201" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1240.06248 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="712.85503" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1223.30852 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="704.47805" y="599.77692" width="4.18849" height="2.51309" rx="0.48819" transform="translate(1206.55456 1038.1958) rotate(-180)" fill="#3f3d56"/><rect x="760.60382" y="604.80311" width="33.50793" height="2.51309" rx="0.48819" transform="translate(1348.12555 1048.24818) rotate(-180)" fill="#3f3d56"/><rect x="515.63106" y="358.73707" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="548.15407" y="358.73707" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="557.36892" y="358.73707" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="524.47742" y="358.4768" width="20.79613" height="3.12216" rx="1.56108" fill="#fff"/><rect x="567.84144" y="358.4768" width="20.79613" height="3.12216" rx="1.56108" fill="#fff"/><rect x="524.30386" y="365.78373" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="556.82687" y="365.78373" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="566.04172" y="365.78373" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="533.15023" y="365.52345" width="20.79613" height="3.12216" rx="1.56108" fill="#fff"/><rect x="576.51424" y="365.52345" width="20.79613" height="3.12216" rx="1.56108" fill="#fff"/><rect x="532.97666" y="372.83038" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="565.49967" y="372.83038" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="574.71453" y="372.83038" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="541.82303" y="372.57011" width="20.79613" height="3.12216" rx="1.56108" fill="#fff"/><rect x="585.18704" y="372.57011" width="20.79613" height="3.12216" rx="1.56108" fill="#fff"/><rect x="541.64947" y="379.87703" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="574.17248" y="379.87703" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="583.38733" y="379.87703" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="550.49583" y="379.61676" width="20.79613" height="3.12216" rx="1.56108" fill="#fff"/><rect x="548.15407" y="407.89751" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="557.36892" y="407.89751" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="567.84144" y="408.15779" width="20.79613" height="3.12216" rx="1.56108" fill="#fff"/><rect x="515.63106" y="407.89751" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="524.47742" y="408.15779" width="20.79613" height="3.12216" rx="1.56108" fill="#fff"/><rect x="524.30386" y="400.85086" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="556.82687" y="400.85086" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="566.04172" y="400.85086" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="533.15023" y="401.11113" width="20.79613" height="3.12216" rx="1.56108" fill="#fff"/><rect x="532.97666" y="393.80421" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="565.49967" y="393.80421" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="574.71453" y="393.80421" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="541.82303" y="394.06448" width="20.79613" height="3.12216" rx="1.56108" fill="#fff"/><rect x="541.64947" y="386.75755" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="574.17248" y="386.75755" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="583.38733" y="386.75755" width="5.96585" height="3.12216" rx="1.56108" fill="#fff"/><rect x="550.49583" y="387.01783" width="20.79613" height="3.12216" rx="1.56108" fill="#fff"/><path d="M711.50727,654.35273l-13.34954-21.10162,41.902-33.40283,17.29534-19.16107a19.16138,19.16138,0,0,1,32.418,6.8279h0a19.16136,19.16136,0,0,1-11.57015,23.991l-27.3488,10.07535Z" transform="translate(-206.59003 -163.87113)" fill="#ffb6b6"/><path d="M398.28,501.35193v102.56h71.85v-102.56a3.448,3.448,0,0,0-2.43-3.3,3.1749,3.1749,0,0,0-1.03-.16H401.75A3.46328,3.46328,0,0,0,398.28,501.35193Zm28.04,35.24a7.67033,7.67033,0,0,1,15.34,0v11.9a7.6701,7.6701,0,0,1-15.34,0Z" transform="translate(-206.59003 -163.87113)" fill="#2f2e41"/><path d="M398.06006,600.632v9.89a1.94622,1.94622,0,0,0,1.93,1.94h68.43a1.93972,1.93972,0,0,0,1.93-1.94v-9.89Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><path d="M285.25,346.832V534.09192a9.00714,9.00714,0,0,0,9,9h277.5a9.0071,9.0071,0,0,0,9-9V346.832a9.01147,9.01147,0,0,0-9-8.99H294.25A9.01151,9.01151,0,0,0,285.25,346.832Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><path d="M291.76,349.16193v182.62a4.81833,4.81833,0,0,0,4.81,4.81H569.44a4.81829,4.81829,0,0,0,4.81-4.81v-182.62a4.82047,4.82047,0,0,0-4.81-4.82H296.57A4.82051,4.82051,0,0,0,291.76,349.16193Z" transform="translate(-206.59003 -163.87113)" fill="#fff"/><path d="M342.4,611.79193a2.9484,2.9484,0,0,0,2.32,1.11h162.34a2.98725,2.98725,0,0,0,2.92-3.6l-2.52-11.97a2.99264,2.99264,0,0,0-1.86-2.17,2.89454,2.89454,0,0,0-1.06-.19995H347.23a2.8943,2.8943,0,0,0-1.06.19995,2.99239,2.99239,0,0,0-1.86,2.17l-2.52,11.97A2.985,2.985,0,0,0,342.4,611.79193Z" transform="translate(-206.59003 -163.87113)" fill="#2f2e41"/><path d="M560.58451,369.49866H305.26115a1.0156,1.0156,0,0,1,0-2.0307H560.58451a1.0156,1.0156,0,0,1,0,2.0307Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><ellipse cx="116.05131" cy="192.32963" rx="5.95043" ry="6.08304" fill="#3f3d56"/><ellipse cx="136.60733" cy="192.32963" rx="5.95043" ry="6.08304" fill="#3f3d56"/><ellipse cx="157.16336" cy="192.32963" rx="5.95043" ry="6.08304" fill="#3f3d56"/><path d="M548.20637,351.622h-14.6a1.1053,1.1053,0,0,0,0,2.21h14.6a1.10511,1.10511,0,0,0,0-2.21Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><path d="M548.20637,355.772h-14.6a1.10527,1.10527,0,0,0,0,2.21h14.6a1.10508,1.10508,0,0,0,0-2.21Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><path d="M548.20637,359.92194h-14.6a1.1053,1.1053,0,0,0,0,2.21h14.6a1.10511,1.10511,0,0,0,0-2.21Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><path d="M900.18575,604.97238a6.41621,6.41621,0,0,0,6.1831,4.331l26.49183-.68178a6.3285,6.3285,0,0,0,5.98085-4.657l3.74888-40.08721a9.79409,9.79409,0,0,0,4.23793.87079,9.66133,9.66133,0,1,0-.4849-19.31658,8.18393,8.18393,0,0,0-1.73618.18056,6.54764,6.54764,0,0,0-4.87405-2.103l-40.75051,1.05229a5.85294,5.85294,0,0,0-1.00519.1248,6.36455,6.36455,0,0,0-4.87318,8.26464Zm43.17345-43.81684,2.66764-9.55274a6.50649,6.50649,0,0,0,.02036-3.37458c.12944-.00034.24363-.06169.37307-.062a6.91049,6.91049,0,0,1,.32357,13.81714A6.50527,6.50527,0,0,1,943.3592,561.15554Z" transform="translate(-206.59003 -163.87113)" fill="#2f2e41"/><path d="M897.97751,544.68623c.86818,4.96412,10.62909,8.45387,22.36585,7.84729,10.79271-.49726,19.61745-4.287,21.23421-8.7785a6.02511,6.02511,0,0,0-1.84436-.24588l-40.75051,1.05229A5.85294,5.85294,0,0,0,897.97751,544.68623Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><path d="M922.49438,582.94415a.49659.49659,0,0,0,.15091-.06642l5.75315-3.76566a.49923.49923,0,0,0,.00032-.83621l-5.97978-3.91667a.49972.49972,0,1,0-.54792.83585l5.34091,3.49818-5.114,3.34794a.49991.49991,0,0,0,.39637.903Z" transform="translate(-206.59003 -163.87113)" fill="#3a182f"/><path d="M913.40762,583.36319a.5.5,0,0,0,.12608-.91842l-5.30306-3.04034,5.1256-3.80723a.49963.49963,0,1,0-.596-.80208l-5.73862,4.26265a.49951.49951,0,0,0,.04918.83476l5.96525,3.41968A.4997.4997,0,0,0,913.40762,583.36319Z" transform="translate(-206.59003 -163.87113)" fill="#3a182f"/><path d="M921.92215,586.24416a.48233.48233,0,0,0,.137-.05785.49976.49976,0,0,0,.16752-.68714l-8.15548-13.40836a.50026.50026,0,0,0-.85442.52058l8.15548,13.40835A.50035.50035,0,0,0,921.92215,586.24416Z" transform="translate(-206.59003 -163.87113)" fill="#3a182f"/><rect x="209.38454" y="260.82713" width="50.71916" height="10.8457" rx="3.26417" fill="#3a182f"/><rect x="183.62601" y="282.51852" width="102.23622" height="10.8457" rx="3.26417" fill="#e6e6e6"/><rect x="183.62601" y="304.20991" width="102.23622" height="10.8457" rx="3.26417" fill="#e6e6e6"/><path d="M497.30123,540.717l.21675.68444.01142.02283,6.52515,19.838,7.50627,22.86094,14.1227,42.96133.13688,6.67346v.02283l1.04949,53.6845-2.90894,7.2781,3.274,11.93237s-1.50582-18.037-9.5824-7.67884c-4.57448,5.8864-9.92468,11.90961-14.31668,17.55642q9.59964,3.88436,19.50716,7.0271c1.426.45633,2.86334.88983,4.30071,1.32333q.46194.13692.924.27377a266.86342,266.86342,0,0,0,67.35086,10.82587c1.18637.03425,2.35.057,3.47932.07986.39932.01142.78714.02284,1.175.02284,1.27765.01142,2.54389.02277,3.82154.02277q3.86721,0,7.70018-.11405a266.85337,266.85337,0,0,0,56.09149-7.58613c-.12547-7.58606-.46768-16.44984-.9582-25.91819-.22817-4.64293-5.3502-9.67369-5.65823-14.53336-.21675-3.65047,4.38057-7.08419,4.141-10.79169-1.55143-22.82675-3.49075-14.06417-4.92813-30.22882q-.22245-2.37852-.41066-4.55165c-.924-10.381-1.56284-16.872-1.56284-16.872l6.13733-38.68338,9.6395-60.73442-.74153-1.22063-.83274-.41066-50.844-25.16532-2.76064-7.07276a10.97881,10.97881,0,0,0-10.14143-6.94731l-33.4929-.13688a10.93117,10.93117,0,0,0-8.90946,4.52888l-9.069,12.55978Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><path d="M533.40653,617.52479,525.8204,633.758l-5.179,11.08822-8.90939,46.646-4.46044,4.73414L503.45,679.467l-39.99772,8.88094c-1.31191-7.28951-.3512.24662-1.16117-7.75009.22817-.22817.46768-.45634.70727-.68451.63882-.59322,1.175-1.15218,1.1636-1.68831-.45633-27.58374.9126-74.52633,12.34311-102.96564a60.05328,60.05328,0,0,1,7.02709-13.1074c.22817-.308.44492-.61606.66167-.924,5.27034-7.3808,8.60136-14.64748,13.32415-19.81511v-.01142a.53028.53028,0,0,0,.07986-.07987.157.157,0,0,0,.04561-.03425l32.44341-17.20272,1.39177,39.10546.99247,28.10851Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><path d="M650.3914,622.13549l9.476,20.275,3.30742,7.06091,8.90681,46.64162,4.44575,4.72264,3.83039-16.75524,1.7998-.36918,32.4585-6.72243,9.46058,30.04631a17.984,17.984,0,0,0-3.26122-22.50556c-.64606-.58457-1.18444-1.15373-1.16913-1.69211.53847-32.4431-1.446-91.68363-19.36733-116.06588-5.69179-7.73777-9.1068-15.44474-14.07562-20.82885-.0154-.0153-.0154-.0307-.03071-.0307L674.0814,526.1139l-.73836-1.21533-.83066-.41528Z" transform="translate(-206.59003 -163.87113)" fill="#3f3d56"/><circle id="a657ec4b-47ce-4d2a-9c58-81a811696ca9" data-name="Ellipse 5" cx="386.3965" cy="267.20052" r="44.55826" fill="#ffb6b6"/><path d="M653.21227,399.94791a3.75933,3.75933,0,0,0-2.69-1.19l.67-1.86a3.52769,3.52769,0,0,0-3.96-4.7l-2.44.47.23-1.63a3.53387,3.53387,0,0,0-4.73-3.82,3.76631,3.76631,0,0,1-3.24-.23,3.84647,3.84647,0,0,1-1.92-2.61005l-.85-4.1-.09-.22c-4.14-6.9-12.1-11.92-21.84-13.76-8.67005-1.65-17.56-.81-26.13-.02-3.4.32-7.24.68-10.44,2.64-2.72,1.68-5.02,5.04-4.55,8.43-8.45-2.59-17.51,2.58-22,9.1-5.32,7.76-6.19,17.48-6.33,25.08-.38,17.98,3.33,32.69,11,43.73.56.8.7,2.47,1.81,3.03l-.23-.37c1.24.62,2.5,1.62,2.03,2.69-1.35,3.08,7.62,9.89,13.94,12.14,11.53,4.11,26.86,3.76,37.64,2.28l.38-2.55c3.89-.53,6.63-1.54,7.4-3.12,1.36005-1.16,2.52-2.2,3.53-3.16l.01-.01c.02-.02.06-.05.08-.07,4.87-4.67,6-7.32995,6.51-11.37994.49-3.97-.38-8-1.27-11.63,18.74,2.9-7.38-19.96,10.08-24.38a5.434,5.434,0,0,1,.61-.15c.51-.12,1.02-.24,1.51-.38a26.44846,26.44846,0,0,0,6.72-2.87c4.88-2.97,6.49-6.91,9.01-11.35A3.42652,3.42652,0,0,0,653.21227,399.94791Z" transform="translate(-206.59003 -163.87113)" fill="#2f2e41"/><path d="M750.58227,625.3079c-.01,1.75-.03,4.2-.11,7.23q-.015.63-.03,1.29c-.13,5.57-.26,10.24-.47,15.43-.01.36-.02.71-.04,1.07-.28,7.24-.72,15.67-1.48,29.02-1.41,24.66-3.87,3.39-6.34,12.04-.12.43-.25.94-.37,1.54a27.91582,27.91582,0,0,1-1.88,6.33c-1.31.78-2.66,1.53-3.99,2.28-3.79,2.11-7.63995,4.13995-11.51995,6.07-2.18006,1.08-4.37,2.14-6.57,3.16-.35.16-.69.32-1.03.47a270.88715,270.88715,0,0,1-34.75,13.26c-2.32.7-4.63,1.38-6.97,2.01-2.44.68-4.88,1.32-7.35,1.92a266.8933,266.8933,0,0,1-56.09,7.59c-2.55.08-5.12.11-7.7.11-1.28,0-2.54-.01-3.82-.02-.39,0-.78-.01-1.17-.02-1.13-.03-2.3-.05-3.48-.08a266.66307,266.66307,0,0,1-67.35-10.83l-.93-.27c-1.44-.44-2.87-.87-4.3-1.33q-9.90006-3.135-19.51-7.02-7.335-2.955-14.5-6.34a.33861.33861,0,0,1-.12-.06c-1-.46-2.01-.94-3.01-1.43-.13-.07-.27-.14-.41-.21q-5.59506-2.73-11.07-5.72c-3.07-7.05005-7.39-8.4-10.07-14.6a25.87356,25.87356,0,0,1-1.68-5.74c0-.02-.01-.04-.01-.07.28,3.72-1.19-6.6-.01-.04-.01-.12-.02-.25-.03-.4-.03-.36-.06994-.8-.12994-1.35-3.43-33.49-3.21-71.79-4.7-103.35q-.15006-3.06-.31-5.86c-.03-.62-.07-1.23-.11005-1.83.07-.18.15-.37.24-.55a1.002,1.002,0,0,1,.07-.15,1.62294,1.62294,0,0,1,.1-.18c.02-.03.05-.07.07-.1a.91693.91693,0,0,1,.05-.1c.09-.14.19-.29.3-.43.05-.06.09-.11005.14-.16a.80824.80824,0,0,1,.12-.14.637.637,0,0,1,.11-.13c.04-.04.08-.09.13-.13995a.30159.30159,0,0,1,.08-.08,2.03313,2.03313,0,0,1,.26-.25,9.62387,9.62387,0,0,1,1.14-.9c.13995-.09.29-.18.43-.28a19.13528,19.13528,0,0,1,3.17-1.52c.38-.14.76-.27,1.17-.41.15-.04.29-.09.44-.14.22-.07.44-.14.67-.19,1.14-.34,2.37-.63,3.7-.9.16-.03.33-.06.5-.1.24-.05.49-.09.74-.13.34-.06.69-.12,1.04-.18,2.97-.47,6.34-.82,10.06-1.05q.525-.03,1.05-.06c.41-.02.82-.04,1.24-.06.35-.02.71-.03,1.07-.04.35-.02.71-.03,1.08-.04,1.01-.03,2.05-.06,3.11-.08,3.02-.06,6.2-.04,9.54.03,1.55.04,3.13.08,4.75.15.11005,0,.21.01.31.01,1.41.05,2.83.11,4.29.19,1.02.05,2.05.1,3.07995.16.97.06,1.95.12,2.94.19.77.04,1.54.1,2.32.15.66.05,1.32.1,1.98.14l.9.06c.49.04.98.07,1.48.12,1.1.09,2.2.18,3.32.27,1.11.1,2.24.2,3.37.3s2.27.21,3.41.32c.12.01.23.02.34.03,1.04.11005,2.08.21,3.13.32.24.02.49.04.73.07,1.0011.10058,2.02173.21832,3.032.32568.31006.03345.61847.06586.92944.09985.79139.08618,1.57154.16089,2.36847.25446,1.05.12,2.12006.23,3.16.37.81.09,1.62.18,2.43.28,1.27.15,2.56.31,3.85.48.49.06.98.12,1.47.19,3.68.46,7.4.97,11.18,1.5,5.73.81,11.55,1.69,17.41,2.64q8.80509,1.425,17.71,3.01c1.5.27,3,.54,4.51.82q1.02.19491,2.04.38995c1.16.21,2.32.43,3.48.65,1.16.22,2.32.44,3.48.67,1.38.27,2.77.54,4.15.81,9.09,1.8,18.12994,3.72,26.95,5.73,1.45.32995,2.9.67,4.34,1q4.32,1.005,8.56,2.04c.78.18,1.55.37,2.32.56,1.92.48,3.84.96,5.73,1.45l.33.09c1.39.34,2.75.69,4.11,1.05q4.815,1.26,9.47,2.55,3.09.855,6.11,1.73c3.01.87,5.96,1.75,8.83,2.64.71.22,1.42.44,2.12.65,2.1.65,4.17,1.31,6.18,1.97,1.6.52,3.16,1.05,4.7,1.58q2.31.795,4.53,1.59c.95.34,1.89.7,2.83,1.04,1.35.5,2.68,1,3.98,1.5.4.15.79.31,1.18.46.25.11.49.2.73.3.47.19.95.37,1.41.56.47.18.93.37,1.39.57.45.18.91.37,1.35.56.45.18.89.37,1.33.57.37.15.73.31,1.08.47.71.31,1.42.62,2.11.94.34.16.68.31,1.02.47l.78.36c.11.06.22.11.33.16.25.12.51.25.76.37.57995.27,1.15.56,1.71.83.75.38,1.48.76,2.18,1.13.71.37994,1.4.76,2.06,1.12994.11.06.21.12006.32.18006.15.07995.3.17.45.25.51.29,1,.59,1.49.87994.96.59,1.87,1.17,2.72,1.75.19.13.37.26.56.38.63.45,1.23.89,1.79,1.34,0,.01,0,.01.01.01.19.14.37.29.55.43.15.14.31.26.46.4.52.45,1,.87994,1.44,1.32a5.667,5.667,0,0,1,.42.43,1.20839,1.20839,0,0,1,.16.16c.2.2.38.4.55.6a.55257.55257,0,0,1,.07.09c.24.28.46.56.67.84.1.14.21.28.3.42.12.17.24.35.34.52.09.14.17.29.25.43006a7.2566,7.2566,0,0,1,.54,1.12994,5.2413,5.2413,0,0,1,.27.82A5.84442,5.84442,0,0,1,750.58227,625.3079Z" transform="translate(-206.59003 -163.87113)" fill="#2f2e41"/><path d="M750.58227,625.3079c-.01,1.75-.03,4.2-.11,7.23-.01.42-.03.85-.04,1.29-.1,4.25-.25,9.5-.46,15.43-.01.36-.02.71-.04,1.07-.28,7.24-.72,15.67-1.48,29.02-1.41,24.66-3.87,3.39-6.34,12.04-6.86-4.22-14.38-8.64-22.42-13.18q-2.175-1.23-4.39-2.47c-16.08-8.97-34.04-18.37006-52.79-27.68-.74-.37-1.49-.74-2.23-1.1-42.95-21.23-89.83-41.88-127.81-55.66-7.33-2.66-14.33-5.06-20.91-7.17005-13.86-4.43-25.84-7.53-35.06-8.87-9.6-1.4-16.23-.9-18.91,1.99q-.15006-3.06-.31-5.86-.06006-.93-.12-1.83c.06171-.16462.14191-.32172.21955-.48017.01111-.02313.019-.047.03045-.06982a1.002,1.002,0,0,1,.07-.15,1.62294,1.62294,0,0,1,.1-.18,1.05985,1.05985,0,0,1,.12-.2c.09-.14.19-.29.3-.43a3.48261,3.48261,0,0,1,.26-.30005.637.637,0,0,1,.11-.13c.04-.04.08-.09.13-.13995a.30159.30159,0,0,1,.08-.08,2.03313,2.03313,0,0,1,.26-.25,9.62387,9.62387,0,0,1,1.14-.9c.13995-.09.29-.18.43-.28a19.13528,19.13528,0,0,1,3.17-1.52c.38-.14.76-.27,1.17-.41.15-.04.29-.09.44-.14.22-.07.44-.14.67-.19,1.14-.34,2.37-.63,3.7-.9.4-.08.82-.16,1.24-.23.34-.06.69-.12,1.04-.18,2.97-.47,6.34-.82,10.06-1.05q.525-.03,1.05-.06c.41-.02.82-.04,1.24-.06.35-.02.71-.03,1.07-.04.35-.02.71-.03,1.08-.04,1.01-.03,2.05-.06,3.11-.08,3.02-.05,6.2-.03,9.54.04,1.55.03,3.13.08,4.75.15.1,0,.21.01.31.01,1.41.04,2.84.11,4.29.18,1.02.05,2.05.1,3.07995.16.97.06,1.95.12,2.94.19.77.04,1.54.1,2.32.15.66.05,1.32.1,1.98.14.79.06,1.58.12,2.38.18,1.1.09,2.2.18,3.32.27,1.11.1,2.24.2,3.37.3s2.27.21,3.41.32c.12.01.23.02.34.03,1.04.11005,2.08.21,3.13.32q8.73.885,17.97,2.07,5.52.705,11.18,1.51c5.73.81,11.55,1.69,17.41,2.63q8.80509,1.425,17.71,3.01c1.5.27,3,.54,4.51.82q2.76.50994,5.52,1.04c1.16.22,2.32.44,3.48.67,1.38.27,2.77.54,4.15.81,9.09,1.8,18.12994,3.72,26.95,5.73,1.45.32995,2.9.67,4.34,1q4.32,1.005,8.56,2.04c.78.19,1.55.38,2.32.57q2.895.72,5.73,1.44v.01c.11.02.22.05.33.08,1.38.35,2.75.7,4.11,1.06q4.815,1.26,9.47,2.54c2.06.57995,4.1,1.15,6.11,1.73,3.01.88,5.96,1.76,8.83,2.64.71.22,1.42.44,2.12.65q3.15.99,6.18,1.97c1.6.52,3.16,1.05,4.7,1.58q2.31.795,4.53,1.59c.96.34,1.9.69,2.83,1.03,1.36.5,2.68,1,3.98,1.51.4.15.79.31,1.18.46.73.28,1.44.57,2.14.86.47.18.93.37,1.39.57.45.18.91.37,1.35.56.45.18.89.37,1.33.57.37.15.73.31,1.08.47.71.31,1.42.62,2.11.94.34.16.68.31,1.02.47l.78.36c.11.06.22.11.33.16.85.4,1.67.8,2.47,1.2.75.38,1.48.76,2.18,1.13.83.43994,1.62.87,2.38,1.31.15.07995.3.17.45.25.51.29,1,.59,1.49.87994.96.59,1.87,1.17,2.72,1.75.84.58,1.62,1.15,2.35,1.72,0,.01,0,.01.01.01.35.28.69.56,1.01.83.52.45,1,.87994,1.44,1.32a5.667,5.667,0,0,1,.42.43,1.20839,1.20839,0,0,1,.16.16c.21.23.42.46.62006.69.24.28.46.56.67.84.1.14.21.28.3.42.12.17.24.35.34.52.09.14.17.29.25.43006a7.2566,7.2566,0,0,1,.54,1.12994,6.05312,6.05312,0,0,1,.27.82A5.84442,5.84442,0,0,1,750.58227,625.3079Z" transform="translate(-206.59003 -163.87113)" opacity="0.2"/></svg>
app/composables/usePageSeo.ts:21:  /** Données JSON-LD (objet Schema.org ou tableau d'objets) injectées via jsonLdScript. */
app/composables/usePageSeo.ts:28: * et Twitter Card (card, title, desc, image, alt) + JSON-LD échappé.
app/composables/usePageSeo.ts:32:export function usePageSeo(options: MaybeRefOrGetter<PageSeoOptions | undefined | null>): void {
app/layouts/default.vue:18:  // Fond de page dark-first (token). Remplace l'ancien dégradé legacy
app/components/HeaderComponent.vue:6:        <NuxtImg src="/images/logo_white.png" alt="" class="hdr__logo hdr__logo--dark" width="24" height="24" />
app/components/HeaderComponent.vue:10:          class="hdr__logo hdr__logo--light"
app/components/HeaderComponent.vue:274:  background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
app/assets/scss/abstract/_color.scss:6:@use "color/gray_dark" as _gray_dark;
app/assets/scss/abstract/_color.scss:8:@use "color/pink_dark" as _pinkDark;
app/assets/scss/abstract/_color.scss:45:// You may want to use white for your app background in light mode,
app/assets/scss/abstract/_color.scss:46:// and Step 1 or 2 from a gray or coloured scale in dark mode.
app/assets/scss/abstract/_color.scss:124:$dark-background: $gray-6;
app/assets/scss/abstract/_color.scss:125:$dark-background-hover: $gray-5;
app/assets/scss/abstract/_color.scss:126:$dark-border: $gray-4;
app/assets/scss/abstract/_color.scss:127:$dark-border-hover: $gray-3;
app/assets/scss/abstract/_color.scss:128:$dark-text: $gray-2;
app/assets/scss/abstract/_color.scss:129:$dark-text-hover: $gray-1;
app/assets/scss/abstract/_color.scss:130:$dark-text-active: $gray-0;
app/assets/scss/abstract/_color.scss:131:$dark-shapes: $dark-border-hover;
app/assets/scss/abstract/_color.scss:132:$dark-shapes-hover: $dark-text;
app/assets/scss/abstract/_color.scss:133:$dark-shapes-active: $dark-text-hover;
app/assets/scss/abstract/_color.scss:141:$red-light: _red.$red7;
app/assets/scss/abstract/_color.scss:142:$aubergine-dark: _pinkDark.$pink3;
app/assets/scss/base/_reset.scss:358:@link http://css-tricks.com/inheriting-box-sizing-probably-slightly-better-best-practice/ */
app/assets/scss/base/_reset.scss:376:/* Base dark-first : fond sombre par défaut (tokens DS, story 2.1).
app/assets/scss/base/_reset.scss:377:   Neutralise l'ancien `background: #fff` du reset (incompatible dark-first). */
app/assets/scss/components/_button.scss:171:  &.btn-dark {
app/assets/scss/components/_button.scss:174:    --btn-dark-color-background: #{_color.$dark-background};
app/assets/scss/components/_button.scss:175:    --btn-dark-color-background-hover: #{_color.$dark-background-hover};
app/assets/scss/components/_button.scss:176:    --btn-dark-color-border: #{_color.$dark-border};
app/assets/scss/components/_button.scss:177:    --btn-dark-color-border-hover: #{_color.$dark-border-hover};
app/assets/scss/components/_button.scss:178:    --btn-dark-color-text: #{_color.$dark-text};
app/assets/scss/components/_button.scss:179:    --btn-dark-color-text-hover: #{_color.$dark-text-hover};
app/assets/scss/components/_button.scss:180:    --btn-dark-color-text-active: #{_color.$dark-text-active};
app/assets/scss/components/_button.scss:181:    --btn-dark-color-shapes: var(--btn-dark-color-border-hover);
app/assets/scss/components/_button.scss:182:    --btn-dark-color-shapes-hover: var(--btn-dark-color-text-hover);
app/assets/scss/components/_button.scss:183:    --btn-dark-color-shapes-active: var(--btn-dark-color-text-hover);
app/assets/scss/components/_button.scss:185:    background-color: var(--btn-dark-color-background);
app/assets/scss/components/_button.scss:186:    border: 1px solid var(--btn-dark-color-border);
app/assets/scss/components/_button.scss:187:    color: var(--btn-dark-color-text);
app/assets/scss/components/_button.scss:191:      background-color: var(--btn-dark-color-background-hover);
app/assets/scss/components/_button.scss:192:      border: 1px solid var(--btn-dark-color-border-hover);
app/assets/scss/components/_button.scss:193:      color: var(--btn-dark-color-text-hover);
app/assets/scss/abstract/_root.scss:3://  Porté depuis docs/design_system/tokens/*.css (dark-first,
app/assets/scss/abstract/_root.scss:25:  --aubergine-light: hsl(319deg 26% 70%);
app/assets/scss/abstract/_root.scss:90:  --accent-2: var(--aubergine-light); // accent secondaire
app/assets/scss/abstract/_root.scss:119:  --fw-light: 300;
app/assets/scss/abstract/_root.scss:215:[data-theme="light"] {
app/assets/scss/abstract/_root.scss:313:  --accent-2: var(--aubergine-light);
app/assets/scss/abstract/_root.scss:328:.hdr__logo--light,
app/assets/scss/abstract/_root.scss:329:.ftr__logo--light {
app/assets/scss/abstract/_root.scss:333:[data-theme="light"] {
app/assets/scss/abstract/_root.scss:334:  .hdr__logo--dark,
app/assets/scss/abstract/_root.scss:335:  .ftr__logo--dark {
app/assets/scss/abstract/_root.scss:339:  .hdr__logo--light,
app/assets/scss/abstract/_root.scss:340:  .ftr__logo--light {
app/components/FooterComponent.vue:7:            <NuxtImg src="/images/logo_white.png" alt="" class="ftr__logo ftr__logo--dark" width="22" height="22" />
app/components/FooterComponent.vue:11:              class="ftr__logo ftr__logo--light"
app/components/WindowWrapperComponent.vue:38:      default: "var(--wwc-color-aubergine-dark)",
app/components/WindowWrapperComponent.vue:264:  // --wwc-color-text-hover: var(--color-dark-text-hover);
app/components/WindowWrapperComponent.vue:270:  --wwc-color-dark: hsl(0deg 0% 8% / 100%);
app/components/WindowWrapperComponent.vue:272:  --wwc-color-grey-light: hsl(0deg 0% 68%);
app/components/WindowWrapperComponent.vue:273:  --wwc-color-grey-dark: hsl(0deg 0% 20%);
app/components/WindowWrapperComponent.vue:275:  --wwc-color-aubergine-light: hsl(319deg 26% 70% / 100%);
app/components/WindowWrapperComponent.vue:276:  --wwc-color-aubergine-dark: hsl(319deg 100% 9% / 100%);
app/components/WindowWrapperComponent.vue:278:  --wwc-color-red-light: hsl(0deg 72% 72% / 100%);
app/components/WindowWrapperComponent.vue:279:  --wwc-color-red-dark: hsl(0deg 100% 27% / 100%);
app/components/WindowWrapperComponent.vue:309:    background-color: var(--wwc-color-grey-dark);
app/components/WindowWrapperComponent.vue:329:      background-image: linear-gradient(to bottom right, var(--wwc-color-red), var(--wwc-color-red-dark));
app/components/WindowWrapperComponent.vue:345:    background-color: var(--wwc-color-aubergine-dark);
app/components/terminal/TerminalComponent.vue:519:  --color-light: hsl(0deg 0% 92% / 100%);
app/components/terminal/TerminalComponent.vue:520:  --color-dark: hsl(0deg 0% 8% / 100%);
app/components/terminal/TerminalComponent.vue:521:  --color-grey-light: hsl(0deg 0% 68%);
app/components/terminal/TerminalComponent.vue:524:  border: 1px dashed var(--color-light);
app/components/terminal/TerminalComponent.vue:528:    color: var(--color-dark);
app/components/terminal/TerminalComponent.vue:530:    background-color: var(--color-light);
app/components/terminal/TerminalComponent.vue:547:      background-color: var(--color-grey-light);
app/components/terminal/TerminalComponent.vue:549:      // --color-dark est redéfini localement ci-dessus (le bloc `.terminal` qui exposait
app/components/terminal/TerminalComponent.vue:550:      // --color-text-dark a été retiré au profit des tokens DS) : table auto-suffisante.
app/components/terminal/TerminalComponent.vue:551:      color: var(--color-dark);
app/components/card/ZCardBody.vue:18:  // Tokens DS (dark-first) : le titre était en gris foncé (fond clair legacy),
app/components/home/HomeBootOverlay.vue:237:    background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
app/components/ui/ThemeToggle.vue:25:  if (preference.value === "dark") {
app/components/ui/ThemeToggle.vue:33:    const activeResolved = resolvedTheme.value === "dark" ? "Sombre" : "Clair";
app/components/ui/ThemeToggle.vue:36:  if (preference.value === "dark") {
app/components/ui/ThemeToggle.vue:46:    dark: "Sombre",
app/components/ui/ThemeToggle.vue:47:    light: "Clair",
app/components/ui/ZCard.vue:176:  background: linear-gradient(90deg, var(--accent), var(--aubergine-light));

codex
- Le diff ne modifie aucun fichier applicatif pour Story 15.4 : les affirmations concernant le formulaire, le SEO, l’accessibilité et les thèmes reposent uniquement sur des déclarations documentaires non vérifiables dans ce changement.

- Le périmètre annoncé de 13 routes est incohérent avec l’inventaire fourni, qui ne détaille que neuf routes et ne liste pas explicitement toutes les pages générées.

- La validation revendique 28 routes statiques alors que les instructions projet parlent de 13 routes ; aucune explication ne justifie cet écart ni ne fournit la liste exacte des sorties Nitro.

- Le contrôle des anciens tarifs utilise uniquement une recherche dans `app/`, alors que le critère exige aussi l’absence dans le HTML pré-rendu, les scripts, les données structurées, `public/`, `content/` et `.output/public`.

- La recherche limitée aux chaînes `3 500`, `3500` et `490` ne couvre pas les variantes typographiques, HTML-échappées, décimales, libellés indirects ou montants présents dans les métadonnées.

- Le critère exige l’alignement de toutes les méta-descriptions sur l’offre V1.1, mais aucune méta-description effective ni comparaison avant/après n’est fournie dans le diff.

- Le document affirme avoir contrôlé les entités Schema.org, mais ne fournit ni sortie générée, ni validation avec un parseur JSON-LD, ni vérification des propriétés obligatoires.

- Les objets `Offer` de `servicesJsonLd` encodent le tarif uniquement dans `description`, sans propriétés `price`, `priceCurrency` ou structure adaptée à un prix « à partir de », ce qui limite fortement l’interprétation par les moteurs.

- L’audit SEO mentionne les pages d’articles de blog dans l’inventaire, mais les tâches de validation ne démontrent pas que chaque slug dynamique et chaque article réel ont été inspectés.

- La validation du formulaire ne teste pas réellement l’envoi Web3Forms, les erreurs réseau, les réponses HTTP non-200, les doubles soumissions ou l’échec lorsque la clé publique est absente.

- La mention « gère gracieusement le honeypot » n’est pas étayée par un scénario de test montrant qu’un formulaire rempli par un bot est rejeté sans afficher un faux succès à l’utilisateur.

- L’accessibilité est déclarée validée sans preuve de test clavier, lecteur d’écran, ordre de focus, annonce du succès ou restitution du focus après erreur.

- Le contrôle de contraste est annoncé pour les thèmes clair et sombre, mais aucune mesure de ratio WCAG ni aucun couple couleur/arrière-plan problématique n’est documenté.

- La story demande que tous les styles utilisent exclusivement les tokens, alors que la modification de `services.vue` conserve une valeur typographique arbitraire de `22px` et une opacité arbitraire de `0.85`.

- La valeur `22px` est explicitement justifiée comme exception locale, mais aucune modification du design system ni règle formelle n’autorise cette exception ; le résultat contredit donc directement le critère de consommation exclusive des tokens.

- La nouvelle offre AI Care promet du « support technique réactif » et du « monitoring proactif » sans préciser les horaires, délais, périmètre, outils de surveillance ou conditions de service.

- Le prix « À partir de 250 € HT / mois » ne définit ni le périmètre inclus, ni les limites de volume, ni les conditions qui déclenchent une facturation supérieure, ce qui rend l’offre commercialement ambiguë.

- Le CTA « Découvrir AI Care » redirige directement vers `/contact` sans page, ancre ou contenu complémentaire décrivant l’offre ; le libellé promet une découverte qui n’existe pas réellement.

- L’étape « Exploitation & mesure » mentionne AI Care sans lien vers `#ai-care` ou vers une action dédiée, ce qui affaiblit le parcours de conversion et rend la transition annoncée difficile à suivre.

- La documentation de Story 15.3 marque toutes les tâches comme terminées alors que le diff ne montre aucune preuve indépendante de revue visuelle desktop/mobile ou de validation avec un lecteur d’écran.

- La story 15.4 reste au statut `review` tandis que ses notes parlent d’une story « complétée » et que l’acceptance criterion évoque la clôture de l’Epic 15 ; l’état documentaire ne permet pas de savoir si la clôture a réellement été autorisée.

- Le champ `last_updated` de `sprint-status.yaml` indique que la Story 15.4 est terminée et prête pour review, mais l’Epic 15 reste `in-progress`, sans explication de l’état attendu après cette validation.

- Les notes de debug citent « Gemini 3.7 Flash » et des commandes réussies, mais ne fournissent ni date d’exécution fiable, ni commit testé, ni hash d’artefact, ce qui empêche de relier les résultats au diff examiné.

- La gate Docker valide lint, typecheck et génération, mais ne vérifie ni les assertions de contenu commercial, ni les contrastes, ni les liens, ni le JSON-LD, ni le comportement du formulaire ; elle ne peut donc pas justifier les critères fonctionnels revendiqués.

- Le diff inclut une modification substantielle de Story 15.3 dans une revue annoncée comme Story 15.4, ce qui brouille la frontière de responsabilité et rend impossible l’attribution précise des régressions.
tokens used
47 465
- Le diff ne modifie aucun fichier applicatif pour Story 15.4 : les affirmations concernant le formulaire, le SEO, l’accessibilité et les thèmes reposent uniquement sur des déclarations documentaires non vérifiables dans ce changement.

- Le périmètre annoncé de 13 routes est incohérent avec l’inventaire fourni, qui ne détaille que neuf routes et ne liste pas explicitement toutes les pages générées.

- La validation revendique 28 routes statiques alors que les instructions projet parlent de 13 routes ; aucune explication ne justifie cet écart ni ne fournit la liste exacte des sorties Nitro.

- Le contrôle des anciens tarifs utilise uniquement une recherche dans `app/`, alors que le critère exige aussi l’absence dans le HTML pré-rendu, les scripts, les données structurées, `public/`, `content/` et `.output/public`.

- La recherche limitée aux chaînes `3 500`, `3500` et `490` ne couvre pas les variantes typographiques, HTML-échappées, décimales, libellés indirects ou montants présents dans les métadonnées.

- Le critère exige l’alignement de toutes les méta-descriptions sur l’offre V1.1, mais aucune méta-description effective ni comparaison avant/après n’est fournie dans le diff.

- Le document affirme avoir contrôlé les entités Schema.org, mais ne fournit ni sortie générée, ni validation avec un parseur JSON-LD, ni vérification des propriétés obligatoires.

- Les objets `Offer` de `servicesJsonLd` encodent le tarif uniquement dans `description`, sans propriétés `price`, `priceCurrency` ou structure adaptée à un prix « à partir de », ce qui limite fortement l’interprétation par les moteurs.

- L’audit SEO mentionne les pages d’articles de blog dans l’inventaire, mais les tâches de validation ne démontrent pas que chaque slug dynamique et chaque article réel ont été inspectés.

- La validation du formulaire ne teste pas réellement l’envoi Web3Forms, les erreurs réseau, les réponses HTTP non-200, les doubles soumissions ou l’échec lorsque la clé publique est absente.

- La mention « gère gracieusement le honeypot » n’est pas étayée par un scénario de test montrant qu’un formulaire rempli par un bot est rejeté sans afficher un faux succès à l’utilisateur.

- L’accessibilité est déclarée validée sans preuve de test clavier, lecteur d’écran, ordre de focus, annonce du succès ou restitution du focus après erreur.

- Le contrôle de contraste est annoncé pour les thèmes clair et sombre, mais aucune mesure de ratio WCAG ni aucun couple couleur/arrière-plan problématique n’est documenté.

- La story demande que tous les styles utilisent exclusivement les tokens, alors que la modification de `services.vue` conserve une valeur typographique arbitraire de `22px` et une opacité arbitraire de `0.85`.

- La valeur `22px` est explicitement justifiée comme exception locale, mais aucune modification du design system ni règle formelle n’autorise cette exception ; le résultat contredit donc directement le critère de consommation exclusive des tokens.

- La nouvelle offre AI Care promet du « support technique réactif » et du « monitoring proactif » sans préciser les horaires, délais, périmètre, outils de surveillance ou conditions de service.

- Le prix « À partir de 250 € HT / mois » ne définit ni le périmètre inclus, ni les limites de volume, ni les conditions qui déclenchent une facturation supérieure, ce qui rend l’offre commercialement ambiguë.

- Le CTA « Découvrir AI Care » redirige directement vers `/contact` sans page, ancre ou contenu complémentaire décrivant l’offre ; le libellé promet une découverte qui n’existe pas réellement.

- L’étape « Exploitation & mesure » mentionne AI Care sans lien vers `#ai-care` ou vers une action dédiée, ce qui affaiblit le parcours de conversion et rend la transition annoncée difficile à suivre.

- La documentation de Story 15.3 marque toutes les tâches comme terminées alors que le diff ne montre aucune preuve indépendante de revue visuelle desktop/mobile ou de validation avec un lecteur d’écran.

- La story 15.4 reste au statut `review` tandis que ses notes parlent d’une story « complétée » et que l’acceptance criterion évoque la clôture de l’Epic 15 ; l’état documentaire ne permet pas de savoir si la clôture a réellement été autorisée.

- Le champ `last_updated` de `sprint-status.yaml` indique que la Story 15.4 est terminée et prête pour review, mais l’Epic 15 reste `in-progress`, sans explication de l’état attendu après cette validation.

- Les notes de debug citent « Gemini 3.7 Flash » et des commandes réussies, mais ne fournissent ni date d’exécution fiable, ni commit testé, ni hash d’artefact, ce qui empêche de relier les résultats au diff examiné.

- La gate Docker valide lint, typecheck et génération, mais ne vérifie ni les assertions de contenu commercial, ni les contrastes, ni les liens, ni le JSON-LD, ni le comportement du formulaire ; elle ne peut donc pas justifier les critères fonctionnels revendiqués.

- Le diff inclut une modification substantielle de Story 15.3 dans une revue annoncée comme Story 15.4, ce qui brouille la frontière de responsabilité et rend impossible l’attribution précise des régressions.
