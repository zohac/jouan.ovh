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
session id: 01a0b621-1056-7443-84c6-c41a0487574d
--------
user
# Acceptance Auditor Prompt — Story 15.2

You are an Acceptance Auditor. Review the diff in `docs/implementation-artifacts/code-reviews/15-2/full.diff` against the story and context specifications:

- Story: `docs/implementation-artifacts/15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint.md`
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
Je vais auditer le diff et les quatre sources de référence, puis recouper chaque écart avec les AC-1 à AC-5 et les contraintes d’architecture/UI. Je restituerai uniquement les findings étayés par des preuves du diff.
exec
/bin/zsh -lc "sed -n '1,240p' docs/implementation-artifacts/15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint.md && printf '\\n--- DIFF ---\\n' && sed -n '1,260p' docs/implementation-artifacts/code-reviews/15-2/full.diff && printf '\\n--- CONTEXT ---\\n' && sed -n '1,220p' docs/project-context.md && printf '\\n--- OFFER ---\\n' && sed -n '1,260p' docs/jouan-ovh-offre-commerciale-v1.1-updated.md && printf '\\n--- DEFERRED ---\\n' && sed -n '1,220p' docs/implementation-artifacts/deferred-work.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
baseline_commit: 7162f14595e42399d234c534fd88d78a7360cbb8
---

# Story 15.2: Page Services — Restructuration des 3 Offres de Build sur Devis & Relégation du Blueprint

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a prospect consultant la page `/services`,
I want apprécier immédiatement les 3 niveaux d'intervention possibles et comprendre le positionnement sans prix plancher bloquant,
so that je puisse identifier le format adapté à mon organisation (FR50, CAP-2).

## Acceptance Criteria

1. **Given** la route `/services` (`app/pages/services.vue`)
   **When** la page est affichée
   **Then** le Hero présente le H1 officiel de l'Offre Commerciale V1.1 :
     > *« Le bon niveau de système pour le bon problème. »*
   **And** le texte d'introduction est centré sur le workflow plutôt que sur la technologie :
     > *« Je pars d'un workflow existant, pas d'une technologie à placer. Certaines frictions se règlent avec une automatisation simple. D'autres nécessitent plusieurs intégrations, de l'IA ou une véritable application métier. Le rôle du diagnostic est justement de déterminer jusqu'où il est utile d'aller. »*
   **And** l'eyebrow conserve la convention standard `<p class="eyebrow"><span aria-hidden="true">// </span>services</p>`.

2. **Given** la grille principale des offres de build (`.grid-3`) dans `app/pages/services.vue`
   **When** le visiteur consulte les offres
   **Then** les 3 cartes d'intervention sont présentées via `<ZCard>`, identifiées par des ancres HTML stables (`id="automatisation"`, `id="workflow"`, `id="sur-mesure"`) :
     1. **Automatisation ciblée :**
        - Badge / Eyebrow : `BESOIN PRÉCIS` (affiché via `<ZBadge tone="neutral">` ou `.offer__badge`)
        - Titre : `Automatisation ciblée`
        - Icône : `zap` (`<ZIcon name="zap" />`)
        - Accroche : `Supprimer une tâche répétitive sans reconstruire tout le processus.`
        - Description : `Pour les besoins bien délimités : données, emails, documents, CRM, synchronisation, génération ou traitement automatisé.`
        - Points clés / Livrables :
          - `Cartographie rapide du flux & cadrage du besoin`
          - `Automatisation logicielle & connecteurs API / webhooks`
          - `Traitement de données ou IA ciblée si pertinent`
          - `Contrôle ou validation humaine si requis`
          - `Tests, mise en production & documentation courte`
        - Prix : `Sur devis` (dans `.offer__price`, aucun prix d'entrée chiffré)
        - CTA : `Décrire mon besoin`, bouton `<ZButton>` pointant vers `/contact` avec `:aria-label="Décrire mon besoin pour une automatisation ciblée"` (variante `secondary`)
        - featured : `false`
     2. **Workflow métier :**
        - Badge / Eyebrow : `OFFRE CŒUR` (affiché via `<ZBadge tone="accent">`)
        - Titre : `Workflow métier` (mention optionnelle `AI Workflow Sprint`)
        - Icône : `layers` (`<ZIcon name="layers" />`)
        - Accroche : `Transformer un processus complet en système opérationnel.`
        - Description : `Pour les workflows qui traversent plusieurs étapes ou outils : cartographie, intégrations, automatisation, IA ciblée, contrôle humain, tests et mise en production.`
        - Points clés / Livrables :
          - `Diagnostic approfondi & cartographie avant/après`
          - `Architecture système & connecteurs API métier`
          - `Modèles d'IA & prompt engineering avec sorties typées`
          - `Tests automatisés sur cas réels & boucle de validation humaine`
          - `Déploiement en production, documentation & mesure initiale`
        - Prix : `Sur devis` (dans `.offer__price`, suppression définitive de `À partir de 3 500 € HT`)
        - CTA : `Identifier un workflow`, bouton `<ZButton>` pointant vers `/contact` avec `:aria-label="Identifier un workflow métier"` (variante `primary`)
        - featured : `true` (carte mise en avant avec `:accent="true"` et `:featured="true"`)
     3. **Système métier sur mesure :**
        - Badge / Eyebrow : `PROJET COMPLEXE` (affiché via `<ZBadge tone="neutral">`)
        - Titre : `Système métier sur mesure`
        - Icône : `terminal` (`<ZIcon name="terminal" />`)
        - Accroche : `Construire l'application lorsque l'automatisation devient un vrai produit.`
        - Description : `Interface, backend, base de données, authentification, intégrations, IA, rôles, supervision et déploiement.`
        - Points clés / Livrables :
          - `Interface web ou desktop adaptée aux opérateurs`
          - `Backend, base de données relationnelle & gestion des rôles`
          - `Orchestration multi-modèles & pipelines de données`
          - `Intégration profonde au SI (CRM, ERP, APIs métier)`
          - `Supervision avancée, tests automatisés & déploiement souverain`
        - Prix : `Sur devis` (dans `.offer__price`)
        - CTA : `Parler du projet`, bouton `<ZButton>` pointant vers `/contact` avec `:aria-label="Parler d'un projet de système métier sur mesure"` (variante `secondary`)
        - featured : `false`

3. **Given** la structure du catalogue d'offres
   **When** le visiteur visualise la page `/services`
   **Then** l'offre *AI Workflow Blueprint* est retirée des cartes de build principales pour devenir une option de cadrage dans la section process (anticipation Story 15.3).
   **And** la carte *AI Care* est retirée de la grille de build `.grid-3` pour ne pas la présenter comme un build équivalent (sa section dédiée post-déploiement fera l'objet de la Story 15.3).

4. **Given** les liens contextuels de la page d'accueil dans `app/pages/index.vue`
   **When** le visiteur clique sur l'un des liens d'exploration vers `/services`
   **Then** les liens pointent directement vers les ancres correspondantes (résolution de la dette différée issue de la Story 15.1) :
     - *Automatisation :* `/services#automatisation`
     - *Agents IA :* `/services#workflow`
     - *Applications sur mesure :* `/services#sur-mesure`
   **And** chaque carte cible dans `app/pages/services.vue` possède l'attribut `id` adéquat et un `scroll-margin-top: var(--space-16)` pour garantir un positionnement propre sous le header fixe.

5. **Given** les exigences de référencement (SEO), accessibilité (a11y) et qualité
   **When** la page est générée en statique (`pnpm generate`)
   **Then** l'objet JSON-LD `servicesJsonLd` (Schema.org `ItemList`) et `usePageSeo` sont alignés sur les 3 offres de build sans mention de "3 500 € HT".
   **And** aucun emoji n'est présent dans le code, les textes ou les composants (NFR6).
   **And** la suite de validation Docker Nitro SSG s'exécute avec 100% de succès :
     ```sh
     docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
     ```

## Tasks / Subtasks

- [x] Tâche 1 — Mise à jour du Hero H1 et de l'introduction dans `app/pages/services.vue` (AC: 1)
  - [x] Mettre à jour le titre `h1.services__title` : `Le bon niveau de système pour le bon problème.`
  - [x] Mettre à jour le paragraphe `p.prose.services__intro` avec le texte officiel V1.1 en 3 phrases.
  - [x] Vérifier la typographie, les marges et la lisibilité sur mobile et desktop.

- [x] Tâche 2 — Restructuration des données et du modèle `offers` (AC: 2, 3)
  - [x] Adapter l'interface TypeScript `Offer` dans `<script setup>` pour supporter `badge: string` et `badgeTone?: "accent" | "neutral"`.
  - [x] Remplacer les 3 anciennes offres (`sprint`, `blueprint`, `care`) par les 3 offres de build :
    - `automatisation` (id: `automatisation`, icon: `zap`, badge: `BESOIN PRÉCIS`, price: `Sur devis`)
    - `workflow` (id: `workflow`, icon: `layers`, badge: `OFFRE CŒUR`, featured: true, price: `Sur devis`)
    - `sur-mesure` (id: `sur-mesure`, icon: `terminal`, badge: `PROJET COMPLEXE`, price: `Sur devis`)
  - [x] Renseigner pour chacune les 5 points de livrables précis.
  - [x] Configurer les libellés de CTA et `:aria-label` accessibles (`Décrire mon besoin`, `Identifier un workflow`, `Parler du projet`).

- [x] Tâche 3 — Template, ancres et intégration visuelle des badges (AC: 2, 4)
  - [x] Ajouter l'attribut `:id="offer.id"` sur le conteneur `<ZCard>` avec la classe de scroll margin (`scroll-margin-top: var(--space-16)`).
  - [x] Afficher `<ZBadge>` pour chaque carte selon son niveau d'intervention (`BESOIN PRÉCIS`, `OFFRE CŒUR`, `PROJET COMPLEXE`).
  - [x] S'assurer que le bas de carte (`.offer__footer`) aligne proprement le prix `Sur devis` et le bouton `<ZButton>`.
  - [x] Mettre à jour les 3 liens contextuels de `app/pages/index.vue` pour cibler `/services#automatisation`, `/services#workflow`, `/services#sur-mesure`.

- [x] Tâche 4 — Synchronisation SEO et données structurées Schema.org (AC: 5)
  - [x] Aligner `servicesJsonLd` sur les 3 nouvelles offres de build avec `offers.description = "Sur devis"`.
  - [x] Mettre à jour la balise meta `description` dans `usePageSeo` pour supprimer toute référence à l'ancien catalogue tarifaire (3 500 € HT, Blueprint en build).

- [x] Tâche 5 — Validation a11y, responsive et Gate Docker Nitro SSG (AC: 5)
  - [x] Tester la navigation clavier (`Tab`) et le focus visible sur les boutons des 3 cartes.
  - [x] Vérifier le rendu sur mobile (< 900px) et la parité visuelle sur les thèmes clair et sombre.
  - [x] Exécuter la commande de validation Docker :
    ```sh
    docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
    ```
  - [x] Vérifier que les 28 routes statiques pré-rendues compilent sans erreur ni avertissement.

## Dev Notes

### Contexte & Guardrails
- **Fichier principal à modifier :** [`app/pages/services.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/services.vue).
- **Fichier secondaire (résolution dette différée 15.1) :** [`app/pages/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue) (mise à jour des liens `to="/services#..."`).
- **Fichier de suivi :** [`docs/implementation-artifacts/deferred-work.md`](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/deferred-work.md).
- **Règle d'or Docker :** Ne JAMAIS lancer `pnpm` sur l'hôte macOS arm64.
- **Règle NFR6 :** Zéro emoji dans l'UI et le code. Utiliser les icônes vectorielles du composant `<ZIcon>`.
- **Règle Tokens :** Utiliser exclusivement `var(--token)`.
- **Nuxt 4 Gotcha :** Ne pas injecter de chaîne brute pour `:as="NuxtLink"`, conserver l'import explicite `import { NuxtLink } from "#components"`.

### Modèle TypeScript des Offres de Build
```typescript
interface Offer {
  id: string;
  icon: string;
  badge: string;
  badgeTone?: "accent" | "neutral";
  title: string;
  hook?: string;
  desc: string;
  points: string[];
  price: string;
  disclaimer?: string;
  featured: boolean;
  ctaText: string;
  ctaAriaLabel: string;
}
```

### Données Officielles V1.1 pour les 3 Offres de Build
```typescript
const offers: Offer[] = [
  {
    id: "automatisation",
    icon: "zap",
    badge: "BESOIN PRÉCIS",
    badgeTone: "neutral",
    title: "Automatisation ciblée",
    hook: "Supprimer une tâche répétitive sans reconstruire tout le processus.",
    desc: "Pour les besoins bien délimités : données, emails, documents, CRM, synchronisation, génération ou traitement automatisé.",
    points: [
      "Cartographie rapide du flux & cadrage du besoin",
      "Automatisation logicielle & connecteurs API / webhooks",
      "Traitement de données ou IA ciblée si pertinent",
      "Contrôle ou validation humaine si requis",
      "Tests, mise en production & documentation courte",
    ],
    price: "Sur devis",
    featured: false,
    ctaText: "Décrire mon besoin",
    ctaAriaLabel: "Décrire mon besoin pour une automatisation ciblée",
  },
  {
    id: "workflow",
    icon: "layers",
    badge: "OFFRE CŒUR",
    badgeTone: "accent",
    title: "Workflow métier",
    hook: "Transformer un processus complet en système opérationnel.",
    desc: "Pour les workflows qui traversent plusieurs étapes ou outils : cartographie, intégrations, automatisation, IA ciblée, contrôle humain, tests et mise en production.",
    points: [
      "Diagnostic approfondi & cartographie avant/après",
      "Architecture système & connecteurs API métier",
      "Modèles d'IA & prompt engineering avec sorties typées",
      "Tests automatisés sur cas réels & boucle de validation humaine",
      "Déploiement en production, documentation & mesure initiale",
    ],
    price: "Sur devis",
    featured: true,
    ctaText: "Identifier un workflow",
    ctaAriaLabel: "Identifier un workflow métier",
  },
  {
    id: "sur-mesure",
    icon: "terminal",
    badge: "PROJET COMPLEXE",
    badgeTone: "neutral",
    title: "Système métier sur mesure",
    hook: "Construire l'application lorsque l'automatisation devient un vrai produit.",
    desc: "Interface, backend, base de données, authentification, intégrations, IA, rôles, supervision et déploiement.",
    points: [
      "Interface web ou desktop adaptée aux opérateurs",
      "Backend, base de données relationnelle & gestion des rôles",
      "Orchestration multi-modèles & pipelines de données",
      "Intégration profonde au SI (CRM, ERP, APIs métier)",
      "Supervision avancée, tests automatisés & déploiement souverain",
    ],
    price: "Sur devis",
    featured: false,
    ctaText: "Parler du projet",
    ctaAriaLabel: "Parler d'un projet de système métier sur mesure",
  },
];
```

### Style de l'Ancrage et du Scroll Margin
Ajouter sur l'élément cible :
```scss
.offer {
  scroll-margin-top: var(--space-16); // Évite que l'en-tête fixe ne masque le haut de la carte
}
```

### References
- [Cahier des Epics : docs/planning-artifacts/epics.md#Story-15-2](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)
- [Source de vérité Offre V1.1 : docs/jouan-ovh-offre-commerciale-v1.1-updated.md#Section-13](file:///Users/simon/dev/jouan.ovh/docs/jouan-ovh-offre-commerciale-v1.1-updated.md)
- [Dette différée : docs/implementation-artifacts/deferred-work.md](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/deferred-work.md)

--- DIFF ---
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

--- CONTEXT ---
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

--- OFFER ---
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


--- DEFERRED ---
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

- **Centralisation SEO site-wide (consolidation)** — _Dette concrète résolue en 6.2_ : `SITE_URL` extrait dans `app/utils/seo.ts` (source unique, dédup `/about`+`/blog`+`/blog/[...slug]`) ; JSON-LD via helper `jsonLdScript()` qui **échappe `<`** (plus de risque `</script>`). _Reste_ (architecture, non-dette) : migration `useSeoMeta`/`app.head` partagé, `SITE_URL` depuis `runtimeConfig`, `publisher`/`Organization` (ou `nuxt-schema-org`). → story SEO dédiée / Epic 9.
- ~~**a11y dates blog + flèche retour**~~ — ✅ **Résolu** : dates en `<time :datetime>` (article + index) ; `←` du lien retour en `<span aria-hidden="true">`. _Reste_ la généralisation a11y (eyebrow→titre + listes home/services) → Epic 9.

## Deferred from: code review of 6-1-index-du-blog-et-empty-state (2026-06-23)

- ~~**SEO `/blog`**~~ — ✅ **Résolu sur `/blog`** (décision Simon : zéro dette) : `og:*`/`twitter:*`/`canonical` + JSON-LD `Blog`→`BlogPosting` ajoutés au `useHead`, vérifiés dans le HTML prerendu. _Reste_ la **centralisation SEO site-wide** (autres pages que `/about` + `/blog`, via `useSeoMeta` partagé / `app.head`) — Epic 9.
- ~~**Sémantique liste du feed d'articles**~~ — ✅ **Résolu** : feed en `<ul class="blog__list">` + `<li>` par article (reset de liste, rendu identique). _Reste_ la **généralisation a11y** (eyebrow→titre + listes home/services) — Epic 9.

## Deferred from: code review of 5-2-timeline-formation-et-stack (2026-06-23)

- ~~**Sémantique a11y des sections CV de `/about`**~~ — ✅ **Résolu sur `/about`** (décision Simon : zéro dette) : libellés de section en `<h2 class="eyebrow">` (outline `h1 → h2×4`), expériences en `<ol>/<li>`, formation et stack en `<ul>/<li>` ; rendu visuel identique (h2 neutralisé `font-weight`/`line-height`, listes `list-style:none` + marges reset). `<time datetime>` écarté (dates = plages, pas de valeur machine). _Reste à généraliser_ la convention (eyebrow→titre + listes) à **home / services**, en lot avec les items a11y ci-dessous (process `<ol>` 4.2, liens `_blank` 3.3) — **passage a11y d'Epic 9**.

## Deferred from: code review of 5-1-portrait-et-bio (2026-06-23)

_Décision Simon : zéro dette technique → les 3 items ci-dessous ont été traités immédiatement (commit de correctifs de revue), pas reportés._

- ~~**Duplication inter-pages des primitives de layout**~~ — ✅ **Résolu** : primitives `.section` / `.section--sunken` / `.container` / `.eyebrow` / `.prose` extraites dans `app/assets/scss/base/_layout.scss` (global, chargé par `main.scss`) ; duplications scoped retirées de `index.vue`, `services.vue`, `about.vue`. Vérif visuelle desktop des 3 pages : aucune régression.
- ~~**Repli `forced-colors` du ring de focus (lien bio `keova.app`)**~~ — ✅ **Résolu localement** : `outline: 2px solid transparent` + `outline-offset` sur le `:focus-visible` du lien (rendu en couleur système en contraste forcé). Le **pattern DS-wide** identique (`ZButton`/`ZTag`/`ZCard`/`ZInput`) reste tracé ci-dessous (revue 3.2) pour un correctif unique au niveau du DS — Epic 9.
- ~~**Balises Open Graph / Twitter / canonical absentes**~~ — ✅ **Résolu** pour `/about` : `og:*`, `twitter:*` et `canonical` ajoutés au `useHead` (domaine `dev.jouan.ovh`), vérifiés dans le HTML prérendu. _Reste à étendre aux autres pages_ (centralisation possible via `useSeoMeta` partagé / `app.head`) — amélioration SEO site-wide à planifier hors 5.1.

## Deferred from: code review of 4-2-section-process (2026-06-22)

- **Sémantique `<ol>` pour la séquence du process (`/services`)** — Les 4 étapes ordonnées sont rendues en grille de `<div>` (numéros « 01 »…« 04 » en texte). Fidèle à `Services.jsx` et l'ordre est déjà annoncé aux lecteurs d'écran (AC satisfait, non bloquant). Amélioration : passer en `<ol>`/`<li>` avec les numéros `aria-hidden` (ordre porté par la liste). Décision Simon : accepté tel quel pour 4.2, amélioration différée au passage a11y d'Epic 9.

## Deferred from: code review of 3-3-projets-selectionnes (2026-06-22)

- **Audit site-wide des liens `target="_blank"` sans indication « nouvel onglet »** — _Les cartes projet de `/` ont été traitées localement (span sr-only « (ouvre dans un nouvel onglet) ») lors du fix 3.3._ Reste à auditer/uniformiser les **autres** liens `_blank` du site (hexagones sociaux du header/footer, etc.) et idéalement à factoriser un helper de lien externe (icône + libellé sr-only). Recommandation WCAG G201. À traiter dans le passage a11y d'Epic 9.

## Deferred from: code review of 3-2-apercu-services-et-stats (2026-06-22)

- ~~`role="img" title=""` résiduel sur le wrapper racine `.init`~~ — ✅ **Résolu** lors du fix 3.2 (commit `132093d`) : attribut retiré de `app/layouts/default.vue`.
- **Repli `forced-colors` DS-wide (rings de focus en `box-shadow`)** — En mode contraste forcé (Windows High Contrast), les `box-shadow` sont supprimées → le ring de focus disparaît. _Les focusables propres aux pages `/` (`.offer__more`, `.hero-term__open`) ont reçu un repli `@media (forced-colors: active)` lors du fix 3.2._ Reste le pattern **systémique des primitives DS** (`ZButton`, `ZTag`, `ZCard`, `ZInput`, liens…) qui utilisent `box-shadow: var(--ring-accent)` : à corriger une seule fois au niveau du DS (repli `outline` sous `forced-colors`). Relève d'Epic 9 (contraste & clavier).

## Deferred from: code review of 8-1-style-terminalwindow-et-prompt (2026-06-26)

_Décision Simon : zéro dette technique → l'item ci-dessous a été traité dans la story 8.1 (non reporté en 8.3)._

- ~~**CSS mort `.command-prefix` / `.git-prompt-branch` dans `TerminalComponent.vue`**~~ — ✅ **Résolu en 8.1** : classes mortes confirmées par `grep` (aucun usage dans le `<template>` ni dans `programs/`) et **supprimées**. Plus de nettoyage à reporter en 8.3.

## Deferred from: code review of 8-2-preserver-les-commandes-et-louverture (2026-06-26)

_Décision Simon (approche DRY/SOLID) : zéro dette → les items ci-dessous ont été traités dans la story 8.2, pas reportés._

- ~~**DRY — données dupliquées en dur dans les programmes terminal**~~ — ✅ **Résolu en 8.2** : **source de vérité unique `app/data/site.ts`** (`SITE.profile`/`skills`/`projects`, typée `IProfile`/`IProject`). Tous les consommateurs branchés — `Skills/Projets/Contact/About.ts` (terminal), `index.vue`, `about.vue`, `contact.vue`, `FooterComponent.vue` — rendu **identique** vérifié au navigateur. **Solde aussi** l'item « données de contact inline » de la revue 7.2 (ci-dessus). _Reste, hors-scope DRY_ : les `experiences`/`degrees` divergent de **contenu** entre le CV terminal (`About.ts`, 4 xp / 3 diplômes détaillés) et `/about` (3 xp / 2 diplômes condensés) — leur unification est une **décision de contenu** (choisir la version canonique + adapter l'affichage), à trancher en passage CV dédié, pas un refactor mécanique.
- ~~**Duplication du bookkeeping d'historique dans la branche `clear`**~~ — ✅ **Résolu en 8.2** : helper `recordHistoryAndResetInput()` partagé entre la branche `clear` et le flux normal de `submitInput`. Plus de report en 8.3.

## Deferred from: code review of 10-1-decision-hebergement-prod-et-derisquage-deploiement (2026-07-02)

- **`article.image.src` sans slash initial → URL d'image malformée** — Dans `blog/index.vue` (JSON-LD `image`) et `blog/[...slug].vue` (`og:image` + JSON-LD), `` `${siteUrl}${article.image.src}` `` concatène sans séparateur : un frontmatter d'article avec `image: { src: "images/x.webp" }` (sans `/` initial) produirait `https://dev.jouan.ovhimages/x.webp`. **Pré-existant** (identique avec l'ancienne constante `SITE_URL`, non introduit par 10.1) et **non déclenchable aujourd'hui** (`content/blog/` vide → 0 article). `content.config.ts` type `image.src` en `z.string()` sans contrainte de format. À corriger à la **factorisation de la construction d'URL SEO de la story 10.5** (helper unique + normalisation slash, ou schéma `image.src` `startsWith("/")`). _(revue 10.1 — Edge Case Hunter)_

## Deferred from: code review of 10-1-decision-hebergement-prod-et-derisquage-deploiement (2026-09-12)

- **`article.image.src` sans slash initial → URL d'image malformée** — Reconfirmé par re-review 10.1 (`app/pages/blog/index.vue:122`, `app/pages/blog/[...slug].vue:121`). Même verdict : pré-existant au baseline, non déclenchable avec `content/blog/` vide, déjà routé vers la normalisation/factorisation SEO de la story 10.5.

## Deferred from: code review of 10-2-a11y-semantique-residuelle (2026-09-13)

- **Rôle dialog et accessibilité interne de la fenêtre terminal** — Les déclencheurs du terminal (`contact.vue`, `index.vue`) portent désormais `aria-haspopup="dialog"`, mais la fenêtre elle-même (`WindowWrapperComponent.vue`) ne porte pas encore de `role="dialog"`, `aria-modal="true"`, ni de piège de focus. Composant hérité Options API propre au header (hors périmètre 10.2). À traiter lors d'une refonte / consolidation a11y du terminal ou en story 10.4. _(revue 10.2 — Blind + Edge Case Hunter)_

## Deferred from: code review of 10-4-validation-a11y-emulee-et-unification-forced-colors (2026-09-13)

- **Terminal input `.user-input` sans outline de focus en contraste forcé** (`TerminalComponent.vue:461`) — CLI terminal avec caret natif coloré (`caret-color`, `caret-shape: block`). En mode contraste forcé, le caret natif sert d'indicateur de focus sans ring de focus extérieur. Préexistant (Epic 8).
- **`ZInput` utilise `&:focus` plutôt que `:focus-visible`** (`ZInput.vue:173`) — Stylage du focus appliqué au focus natif des formulaires plutôt qu'exclusivement au clavier. Préexistant (Epic 2).
- **Terminal resize handle manipulable uniquement à la souris** (`TerminalComponent.vue:320`) — `<div>` de redimensionnement de fenêtre avec drag à la souris, sans contrôle clavier équivalent. Préexistant (Epic 8).
- **Accessibilité interne de la fenêtre terminal (rôle dialog / focus trap)** (`TerminalComponent.vue:1`) — Fenêtre terminal interactive sans `role="dialog"`, nom accessible ou confinement de focus (déjà tracé en revue 10.2). Préexistant (Epic 8).
- **Honeypot input sous `aria-hidden="true"`** (`contact.vue:178`) — Champ antispam masqué visuellement et aux technologies d'assistance. Préexistant (Epic 7).

## Deferred from: code review of 10-5-seo-centralise-site-wide (2026-09-13)

- **Prix numériques et devise structurée (`priceCurrency`) pour les offres dans Schema.org** (`app/pages/services.vue:141-147`) — Les prestations exposent des libellés UI de présentation (« à partir de 1 500 € », « sur devis »). Une formalisation stricte sous forme de grille tarifaire machine-readable Schema.org (`priceCurrency: 'EUR'`, `price: 1500`) relève d'une décision de contenu/commerciale sur la formalisation tarifaire.

## Deferred from: code review of 10-6-conformite-legale-rgpd-mentions (2026-09-13)

- **Mutualisation des styles partagés `.legal__*`** (`app/pages/confidentialite.vue`, `app/pages/mentions-legales.vue`) — Les deux pages dupliquent actuellement leur bloc `<style scoped>` `.legal__*`. Préexistant/standard pour des pages Vue distinctes ; factorisable dans un partiel SCSS si d'autres pages légales devaient être créées.
- **Domaine canonique staging par défaut en build local (`dev.jouan.ovh`)** (`nuxt.config.ts:59`) — Dépend de la story 10.7 (Mise en production réelle, FR17 : bascule de `SITE_URL` vers `https://jouan.ovh` et domaine de production). Déjà tracé et planifié en story 10.7.

## Deferred from: code review of 11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique (2026-09-13)

- ~~**Alignement de la copie commerciale, terminal JouanOS et tags hero de la page d'accueil**~~ — ✅ **Résolu en 11.2** (`HomeBootOverlay.vue`, `HomeHeroTerminal.vue`, `index.vue`).
- ~~**Marquee de stack moderne ordonnée et mise en avant des 3 services**~~ — ✅ **Résolu en 11.3** (`HomeStackMarquee.vue`, `index.vue`).
- ~~**Preuves statistiques SaaS (100k+, 85%), journal technique et bouton CTA vers profil Malt**~~ — ✅ **Résolu en 11.4** (projets SaaS, stats clés, journal, cta final dans `index.vue`).
- ~~**Audit SEO transverse et mise à jour des métadonnées secondaires** (`app/pages/about.vue`)~~ — ✅ **Résolu en 11.5** (`about.vue` : bio, rôle Full Stack TS, localisation Rouen, expériences et JSON-LD synchronisés).

## Deferred from: code review of 11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles (2026-09-13)

- **Aligner le catalogue de la page dédiée `/services` et ses métadonnées SEO/JSON-LD avec les 3 nouvelles offres de l'accueil** (`app/pages/services.vue`) — La page `/services` actuelle présente toujours le catalogue historique (WordPress, applications, IA) et les descriptions associées. La refonte complète de `/services` pour calquer les 3 offres SaaS Full Stack TS relève d'une future story d'évolution de la page services.
- **Couverture automatisée par tests E2E / visuels de la boucle continue du marquee** (`app/components/home/HomeStackMarquee.vue`) — Validation automatisée du défilement, du `:hover` et de l'arrêt sous reduced-motion. Prévu dans la validation transverse de la **Story 11.5**.

## Deferred from: code review of 11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion (2026-09-13)

- **Différenciation éditoriale d'une carte vedette dans le journal (CAP-7)** (`app/pages/index.vue:150`) — La spécification CAP-7 envisageait une carte vedette et des vignettes secondaires. L'AC3 de la story 11.4 a implémenté une grille uniforme élégante à 3 cartes conforme à la maquette `Home - Awwwards.html`. La hiérarchisation avancée (première carte mise en avant) pourra être reprise lors de l'enrichissement éditorial du blog.

## Deferred from: code review of 11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker (2026-09-13)

- **Nettoyage résiduel des mentions « WordPress » sur les autres pages secondaires** (`app/pages/contact.vue`, `app/pages/blog/index.vue`) — Si la page `about.vue` a été harmonisée en Story 11.5 et `/services` fait l'objet d'un suivi différé dédié, `contact.vue` (placeholder de formulaire et description SEO) et `blog/index.vue` (sous-titre et meta description) conservent des mentions WordPress historiques à réaligner lors d'un futur rafraîchissement éditorial transversal.
 
## Deferred from: code review of 13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc (2026-09-18)
 
- **Suite de tests automatisés unitaires pour la logique réactive de `useTheme`** (`test/`) — Le projet ne possède pas de banc de tests unitaires client (Vitest/Playwright). La validation actuelle repose sur la gate Docker (lint, typecheck, generate SSG 24 routes). L'ajout d'une suite de tests unitaires pour `useTheme` et l'anti-FOUC relève d'une mise en place globale d'outillage de test.

exec
/bin/zsh -lc "sed -n '1,420p' docs/implementation-artifacts/code-reviews/15-2/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba app/pages/services.vue | sed -n '1,380p'; printf '\\n--- offer source relevant ---\\n'; rg -n \"AI Workflow|Blueprint|AI Care|3 500|Sur devis|servicesJsonLd|services__title|grid-3|offer__footer|theme|clair|dark\" docs/jouan-ovh-offre-commerciale-v1.1-updated.md docs/project-context.md docs/implementation-artifacts/deferred-work.md app/pages/services.vue app/pages/index.vue" in /Users/simon/dev/jouan.ovh
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
   276	}
   277	
   278	// ---- Grille des offres (.grid-3 / .offer*) ----
   279	.grid-3 {
   280	  display: grid;
   281	  grid-template-columns: repeat(3, 1fr);
   282	  gap: var(--space-5);
   283	  margin: 0;
   284	  padding: 0;
   285	  list-style: none;
   286	
   287	  > li {
   288	    display: flex;
   289	  }
   290	}
   291	
   292	.offer {
   293	  display: flex;
   294	  flex-direction: column;
   295	  width: 100%;
   296	  scroll-margin-top: var(--space-16);
   297	}
   298	
   299	.offer__badge {
   300	  margin-bottom: var(--space-3);
   301	}
   302	
   303	.offer__icon {
   304	  display: flex;
   305	  align-items: center;
   306	  justify-content: center;
   307	  width: var(--space-10); // 40px
   308	  height: var(--space-10);
   309	  margin-bottom: var(--space-4);
   310	
   311	  // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
   312	  // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
   313	  font-size: 22px;
   314	  color: var(--accent);
   315	  background: var(--accent-soft);
   316	  border-radius: var(--radius-md);
   317	}
   318	
   319	.offer__title {
   320	  margin-bottom: var(--space-1);
   321	  font-family: var(--font-mono);
   322	  font-size: var(--fs-xl);
   323	  font-weight: var(--fw-regular);
   324	  color: var(--text-strong);
   325	}
   326	
   327	.offer__hook {
   328	  margin: 0 0 var(--space-3);
   329	  font-family: var(--font-mono);
   330	  font-size: var(--fs-xs);
   331	  font-weight: var(--fw-medium);
   332	  letter-spacing: var(--ls-wide);
   333	  color: var(--accent);
   334	}
   335	
   336	.offer__desc {
   337	  margin: 0 0 var(--space-4);
   338	  font-family: var(--font-sans);
   339	  font-size: var(--fs-sm);
   340	  line-height: var(--lh-relaxed);
   341	  color: var(--text-body);
   342	}
   343	
   344	.offer__points {
   345	  margin: 0;
   346	  padding: 0;
   347	  list-style: none;
   348	
   349	  li {
   350	    position: relative;
   351	    padding: var(--space-1) 0 var(--space-1) var(--space-5);
   352	    font-family: var(--font-mono);
   353	    font-size: var(--fs-sm);
   354	    color: var(--text-muted);
   355	  }
   356	
   357	  // Puce fléchée « → »
   358	  li::before {
   359	    content: "→";
   360	    position: absolute;
   361	    left: 0;
   362	    color: var(--accent);
   363	  }
   364	}
   365	
   366	.offer__footer {
   367	  display: flex;
   368	  flex-direction: column;
   369	  margin-top: auto;
   370	  padding-top: var(--space-5);
   371	}
   372	
   373	.offer__price {
   374	  font-family: var(--font-mono);
   375	  font-size: var(--fs-sm);
   376	  color: var(--text-muted);
   377	
   378	  b {
   379	    font-size: var(--fs-lg);
   380	    font-weight: var(--fw-bold);

--- offer source relevant ---
docs/project-context.md:96:  anciens tokens SCSS `$` (ex. `--header-color-background: #{_color.$dark-background};`).
docs/project-context.md:228:- Le **dark-first** : pas de thème clair. Surfaces sombres teintées aubergine,
docs/project-context.md:287:Dernière mise à jour : 2026-09-18 (post-Epic 12 : repositionnement commercial V1 « Systèmes IA & Automatisation Métier » livré et déployé en production — epics 1→12 done ; refonte du Hero commercial, vitrine des 3 services et bloc différenciateur Prototype → Production ; 3 projets phares V1 Keova Signal, Debrief, Devis-Assist ; page Services avec offres Sprint, Blueprint, AI Care et process 4 étapes ; page À propos avec trajectoire métrologie/QA ; formulaire de contact avec qualification de workflow ; CTA inspecteur workflow ; SEO et Schema.org site-wide ; patch layout z-index .section stabilisé ; PR #7 mergée sur main et déploiement gh-pages actif sur https://jouan.ovh).
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:21:> **Permettre à un prospect de comprendre que Simon peut traiter aussi bien une automatisation ciblée qu'un workflow métier complet, sans donner l'impression qu'un projet démarre obligatoirement à 3 500 € HT.**
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:26:À partir de 3 500 € HT
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:71:→ minimum 3 500 €
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:115:5. AI Care
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:117:Le **Blueprint** n'est plus présenté comme une offre principale au même niveau que les autres. Il devient un **cadrage facturable optionnel** pour les sujets complexes.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:227:Sur devis selon le workflow
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:237:- clairement bornées ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:258:AI Workflow Sprint
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:317:**Ne pas afficher `À partir de 3 500 € HT`.**
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:377:Sur devis
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:400:# 8. Cadrage complexe — Blueprint optionnel
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:405:AI Workflow Blueprint
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:453:Le Blueprint doit apparaître comme :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:461:# 9. Offre 5 — AI Care
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:466:AI Care
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:471:AI Care n'est pas un abonnement ajouté automatiquement à tous les projets.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:486:> AI Care couvre le maintien en condition opérationnelle du système : monitoring, maintenance, support, suivi des coûts et adaptations mineures liées aux APIs ou aux modèles.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:584:À partir de 3 500 € HT
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:635:"Simon = projet minimum à 3 500 €"
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:709:Sur devis
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:737:AI Workflow Sprint
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:755:Sur devis
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:797:Sur devis
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:808:# 14. Page Services — AI Care séparé
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:810:Ne pas afficher AI Care comme une alternative équivalente aux trois offres de build.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:829:AI Care
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:840:Découvrir AI Care
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:864:Un Blueprint facturable peut être proposé lorsque le cadrage nécessite un travail approfondi avant devis.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:953:Sur devis
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:959:Sur devis
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:965:Sur devis
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:968:### AI Care
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:974:### Blueprint
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
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1174:- [ ] l'offre distingue clairement automatisation ciblée, workflow métier et système métier ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1179:- [ ] le Blueprint devient secondaire / optionnel ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1180:- [ ] AI Care reste séparé du build ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1181:- [ ] `À partir de 250 € HT / mois` reste affiché pour AI Care ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1202:Sur devis.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1208:Sur devis.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1215:Sur devis.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1253:La V1.1 retire le ticket d'entrée public de **3 500 € HT**.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1272:Le pricing sera resserré lorsque suffisamment de données terrain permettront de distinguer clairement les missions petites, moyennes et complexes.
app/pages/services.vue:7:        <h1 class="services__title">Le bon niveau de système pour le bon problème.</h1>
app/pages/services.vue:14:        <ul class="grid-3">
app/pages/services.vue:27:              <div class="offer__footer">
app/pages/services.vue:84:// Données statiques (3 offres, 4 étapes) déclarées localement. Prerender-safe, dark-first.
app/pages/services.vue:134:    price: "Sur devis",
app/pages/services.vue:154:    price: "Sur devis",
app/pages/services.vue:174:    price: "Sur devis",
app/pages/services.vue:195:    desc: "Formalisation du workflow cible, des étapes manuelles à conserver sous contrôle humain, des connecteurs API requis et des KPI de mesure. Fait l'objet d'un Blueprint pour les sujets complexes.",
app/pages/services.vue:211:const servicesJsonLd = {
app/pages/services.vue:248:  jsonLd: servicesJsonLd,
app/pages/services.vue:262:.services__title {
app/pages/services.vue:278:// ---- Grille des offres (.grid-3 / .offer*) ----
app/pages/services.vue:279:.grid-3 {
app/pages/services.vue:366:.offer__footer {
app/pages/services.vue:481:  .grid-3,
docs/implementation-artifacts/deferred-work.md:46:- ~~**Désancrage tarifaire résiduel sur la page catalogue `/services`**~~ — ✅ **Résolu en 15.2** (`app/pages/services.vue` : 3 offres sur devis, élimination définitive du prix d'entrée 3 500 € HT et restructuration du catalogue de build).
docs/implementation-artifacts/deferred-work.md:52:## Deferred from: code review of 13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile (2026-09-18)
docs/implementation-artifacts/deferred-work.md:56:## Deferred from: code review of 13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal (2026-09-18)
docs/implementation-artifacts/deferred-work.md:58:- **Ajustement des tokens d'état d'accentuation (--accent-hover, --accent-active) et des composants transverses en mode clair** (`app/assets/scss/abstract/_root.scss`) — La Story 13.1 pose la fondation de la palette de surface et de texte crème/aubergine. L'adaptation fine des états d'interaction hover/active et l'audit transverse de l'atmosphère d'ambiance et des pages spécifiques sont explicitement planifiés pour la Story 13.4.
docs/implementation-artifacts/deferred-work.md:75:- **Placeholder `ZInput` ~3.7:1 sur `--bg-input` (< 4.5:1 AA)** — résidu conscient : `--text-muted` (relevé de `--text-faint` ~2.2:1) reste sous AA sur la surface la plus claire, mais le champ porte un `<label>` visible persistant (placeholder = texte supplémentaire, zone grise WCAG) ; monter encore le ferait passer pour une saisie. Acceptable tel quel ; à revoir si un token de placeholder dédié ≥ 4.5:1 est introduit. _(revue 9.2)_
docs/implementation-artifacts/deferred-work.md:191:## Deferred from: code review of 13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc (2026-09-18)
app/pages/index.vue:60:        <ul class="grid-3">
app/pages/index.vue:315:// Architecture multi-pages Nuxt 4, dark-first, accent orange.
app/pages/index.vue:643:// ---- Aperçu services (porté de .grid-3 / .offer*) ----
app/pages/index.vue:644:.grid-3 {
app/pages/index.vue:1374:  .grid-3,

exec
/bin/zsh -lc "sed -n '300,490p' docs/jouan-ovh-offre-commerciale-v1.1-updated.md; sed -n '690,875p' docs/jouan-ovh-offre-commerciale-v1.1-updated.md; sed -n '1120,1225p' docs/jouan-ovh-offre-commerciale-v1.1-updated.md; sed -n '380,510p' app/pages/services.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:

- diagnostic approfondi ;
- cartographie avant / après ;
- définition des KPI ;
- architecture ;
- automatisations ;
- intégrations API ;
- IA ciblée lorsque pertinente ;
- interface légère si nécessaire ;
- tests ;
- gestion des erreurs ;
- déploiement ;
- documentation ;
- mesure initiale.

## Prix public

**Ne pas afficher `À partir de 3 500 € HT`.**

Afficher :

```text
Projet sur devis
```

ou ne pas afficher de prix.

## Hypothèse commerciale interne

Le Workflow AI Sprint reste une **hypothèse d'offre cœur autour de 3 900 € HT**, à ajuster selon le scope et la valeur.

Fourchette interne de travail, non destinée à être automatiquement publiée :

```text
≈ 2 500 à 7 500 € HT
```

Cette fourchette n'est pas un benchmark de marché.

Elle doit évoluer avec les opportunités réellement gagnées et perdues.

---

# 7. Offre 4 — Système métier sur mesure

## Nom

```text
Système métier sur mesure
```

## Positionnement

Pour les projets où le workflow nécessite un véritable produit logiciel.

## Exemples

- application métier interne ;
- interface de supervision ;
- pipeline documentaire ;
- plusieurs workflows connectés ;
- gestion d'utilisateurs et de rôles ;
- historique et base de données ;
- application desktop ;
- portail client ;
- système multi-tenant ;
- orchestration de plusieurs agents ou services.

## Texte public recommandé

> **Quand l'automatisation devient un véritable outil métier, je développe le système complet.**
>
> Interface, backend, données, authentification, intégrations, IA, tests, sécurité, supervision et déploiement peuvent être réunis dans une application conçue autour du processus réel.

## Prix public

```text
Sur devis
```

Ne pas afficher de ticket d'entrée public dans cette version.

## Logique commerciale interne

Le prix dépend fortement :

- du périmètre ;
- du nombre de workflows ;
- des intégrations ;
- de la criticité ;
- de la sécurité ;
- de l'authentification ;
- des rôles ;
- du volume ;
- des contraintes d'exploitation.

Les projets dépassant significativement le périmètre d'un Workflow Sprint doivent être chiffrés comme de vrais projets logiciels, pas forcés dans un package artificiel.

---

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
```text
Automatisation ciblée
```

Accroche :

```text
Supprimer une tâche répétitive sans reconstruire tout le processus.
```

Résumé :

```text
Pour les besoins bien délimités : données, emails, documents, CRM, synchronisation, génération ou traitement automatisé.
```

Prix :

```text
Sur devis
```

CTA :

```text
Décrire mon besoin
```

---

### 02 — Workflow métier

Eyebrow :

```text
OFFRE CŒUR
```

Titre :

```text
Workflow métier
```

Sous-label facultatif :

```text
AI Workflow Sprint
```

Accroche :

```text
Transformer un processus complet en système opérationnel.
```

Résumé :

```text
Pour les workflows qui traversent plusieurs étapes ou outils : cartographie, intégrations, automatisation, IA ciblée, contrôle humain, tests et mise en production.
```

Prix :

```text
Sur devis
```

CTA :

```text
Identifier un workflow
```

Cette carte peut rester visuellement mise en avant.

---

### 03 — Système métier sur mesure

Eyebrow :

```text
PROJET COMPLEXE
```

Titre :

```text
Système métier sur mesure
```

Accroche :

```text
Construire l'application lorsque l'automatisation devient un vrai produit.
```

Résumé :

```text
Interface, backend, base de données, authentification, intégrations, IA, rôles, supervision et déploiement.
```

Prix :

```text
Sur devis
```

CTA :

```text
Parler du projet
```

---

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
# 23. Consignes Codex

1. Utiliser ce document comme **source de vérité pour l'offre V1.1**.
2. Conserver le design system actuel de `jouan.ovh`.
3. Ne pas refaire la direction artistique.
4. Modifier en priorité :
   - homepage ;
   - page Services ;
   - CTA ;
   - libellés de prix ;
   - éventuels textes associés à l'offre.
5. Supprimer les prix `À partir de 3 500 € HT` des cartes publiques concernées.
6. Ne pas remplacer ces prix par un prix plus bas.
7. Ne pas créer une grille SaaS rigide.
8. Présenter :
   - Automatisation ciblée ;
   - Workflow métier ;
   - Système métier sur mesure ;
   comme trois niveaux d'intervention.
9. Conserver AI Care comme offre d'exploitation séparée.
10. Garder le Blueprint comme option de cadrage complexe, pas comme offre cœur.
11. Réutiliser les composants existants autant que possible.
12. Ne pas inventer :
   - ROI ;
   - résultats ;
   - témoignages ;
   - clients ;
   - prix supplémentaires ;
   - fonctionnalités.
13. Conserver les preuves existantes :
   - Keova Signal ;
   - Debrief ;
   - Devis-Assist.
14. Lancer les vérifications disponibles :
   - lint ;
   - typecheck ;
   - tests ;
   - build.
15. Vérifier mobile et desktop.
16. Fournir à la fin :
   - fichiers modifiés ;
   - textes remplacés ;
   - décisions prises ;
   - commandes exécutées ;
   - éventuels points restant à valider.

---

# 24. Critères d'acceptation

La mise à jour est réussie si :

- [ ] aucun `À partir de 3 500 € HT` n'est affiché sur les cartes Automatisation / Agents IA ;
- [ ] le site ne donne plus l'impression que toute intervention coûte au minimum 3 500 € ;
- [ ] l'offre distingue clairement automatisation ciblée, workflow métier et système métier ;
- [ ] le Workflow métier reste visuellement identifiable comme offre cœur ;
- [ ] aucune offre low-cost artificielle n'est créée ;
- [ ] aucun prix fictif n'est ajouté ;
- [ ] le Diagnostic reste accessible ;
- [ ] le Blueprint devient secondaire / optionnel ;
- [ ] AI Care reste séparé du build ;
- [ ] `À partir de 250 € HT / mois` reste affiché pour AI Care ;
- [ ] le CTA principal parle toujours d'un workflow ou processus ;
- [ ] le discours reste centré sur le problème métier ;
- [ ] le Full Stack reste une preuve de capacité et non le produit principal ;
- [ ] la DA actuelle est conservée ;
- [ ] le site reste responsive ;
- [ ] le build passe sans erreur.

---

# 25. Résumé de l'offre

```text
DIAGNOSTIC
Comprendre le problème.
Gratuit — 20 à 30 min.

        ↓

AUTOMATISATION CIBLÉE
Supprimer une tâche précise.
Sur devis.

        ↓

WORKFLOW MÉTIER
Transformer un processus complet.
Sur devis.
Offre cœur.

        ↓

SYSTÈME MÉTIER SUR MESURE
Construire l'application lorsque le workflow l'exige.
Sur devis.

        ↓

AI CARE
Maintenir la capacité en production.
À partir de 250 € HT / mois.
```

Pour les sujets complexes :

    font-weight: var(--fw-bold);
    color: var(--text-strong);
  }
}

.offer__disclaimer {
  margin: var(--space-2) 0 0;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  line-height: var(--lh-normal);
  color: var(--text-muted);
  opacity: 0.85;
}

.offer__cta {
  margin-top: var(--space-4);
}

.offer__btn {
  width: 100%;
}

// ---- Section process ----
.process__title {
  margin-bottom: var(--space-8);
  font-family: var(--font-mono);
  font-size: var(--fs-3xl);
  font-weight: var(--fw-regular);
  color: var(--text-strong);
}

.process {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;
}

.process__step {
  display: flex;
  flex-direction: column;
}

.process__num {
  font-family: var(--font-mono);
  font-size: var(--fs-3xl);
  font-weight: var(--fw-light);
  color: var(--accent);
}

.process__step-title {
  margin: var(--space-2) 0;
  font-family: var(--font-mono);
  font-size: var(--fs-lg);
  font-weight: var(--fw-regular);
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
}
</style>

codex
- **Le Blueprint est présenté comme obligatoire pour les sujets complexes** — Violation de l’AC-3 et de l’intention V1.1 (« option de cadrage »). Dans `app/pages/services.vue:195`, le texte indique : « Fait l'objet d'un Blueprint pour les sujets complexes », alors que la spécification demande qu’un Blueprint « peut être proposé » lorsque le cadrage approfondi est nécessaire (`docs/jouan-ovh-offre-commerciale-v1.1-updated.md`, section 8 et section 15).
tokens used
42 741
- **Le Blueprint est présenté comme obligatoire pour les sujets complexes** — Violation de l’AC-3 et de l’intention V1.1 (« option de cadrage »). Dans `app/pages/services.vue:195`, le texte indique : « Fait l'objet d'un Blueprint pour les sujets complexes », alors que la spécification demande qu’un Blueprint « peut être proposé » lorsque le cadrage approfondi est nécessaire (`docs/jouan-ovh-offre-commerciale-v1.1-updated.md`, section 8 et section 15).
