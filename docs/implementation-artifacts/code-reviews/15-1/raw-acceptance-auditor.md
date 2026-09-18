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
session id: 01a0b581-0302-7471-aa99-ec677d2e223f
--------
user
# Acceptance Auditor Prompt — Story 15.1

You are an Acceptance Auditor. Review the diff in `docs/implementation-artifacts/code-reviews/15-1/full.diff` against the story and context specifications:

- Story: `docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md`
- Context:
  - `AGENTS.md` (Standards UI, SCSS tokens, zero emoji, a11y, layout)
  - `docs/project-context.md`
  - `docs/specs/spec-repositionnement-ia/SPEC.md`
  - `docs/jouan-ovh-offre-commerciale-v1.1-updated.md`

Check for:
- Violations of acceptance criteria (AC-1, AC-2, AC-3, AC-4)
- Deviations from spec intent
- Missing implementation of specified behavior
- Inconsistencies or visual regressions in design system and typography
- Contradictions between spec constraints and actual code

Output findings as a Markdown list. Each finding must include:
- A one-line title
- Which AC or architectural constraint it violates
- Evidence from the diff and references

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
Je vais comparer le diff aux critères AC-1 à AC-4 et aux quatre sources de référence, puis produire uniquement les écarts vérifiables avec leur preuve.
exec
/bin/zsh -lc "sed -n '1,240p' docs/implementation-artifacts/code-reviews/15-1/full.diff && printf '\\n--- STORY ---\\n' && sed -n '1,260p' docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md && printf '\\n--- PROJECT CONTEXT ---\\n' && sed -n '1,220p' docs/project-context.md && printf '\\n--- SPEC ---\\n' && sed -n '1,280p' docs/specs/spec-repositionnement-ia/SPEC.md && printf '\\n--- OFFER ---\\n' && sed -n '1,300p' docs/jouan-ovh-offre-commerciale-v1.1-updated.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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

--- STORY ---
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

--- PROJECT CONTEXT ---
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

--- SPEC ---
---
id: SPEC-repositionnement-ia
companions:
  - messaging-matrix.md
  - services-and-pricing.md
  - projects-showcase.md
sources:
  - docs/jouan-ovh-offre-v1-brief-codex.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Repositionnement Offre V1 — Systèmes IA & Automatisation Métier

## Why

Le site actuel positionne Simon Jouan comme développeur Full Stack technique (Nuxt/NestJS/SaaS), ce qui dilue la valeur perçue et attire des demandes génériques ou peu qualifiées. Le nouveau positionnement commercial cible directement la douleur opérationnelle des entreprises : automatiser les processus métier chronophages et intégrer des systèmes et agents IA fiables en production. Le savoir-faire Full Stack et la culture QA deviennent le garant d'industrialisation (au-delà du prototype ou de l'automatisation fragile), sans renier l'identité sobre d'inspiration terminal du portfolio.

## Capabilities

- id: CAP-1
  intent: La source unique de données du site (`site.ts`) et les éléments globaux de marque (footer, bio, tags, métadonnées) reflètent le positionnement d'expert systèmes IA et automatisation métier, en éliminant les intitulés proscrits (ingénieur IA, ERP équestre, WordPress principal, localisation erronée).
  success: Une inspection de `app/data/site.ts` et des pieds de page confirme la présence du titre "Développeur Full Stack spécialisé en systèmes IA & automatisation métier", la localisation "France · Remote", la mise à jour des bios et l'absence totale de "Ingénieur IA" ou "ERP équestre".

- id: CAP-2
  intent: Le visiteur arrivant sur la page d'accueil identifie en moins de 15 secondes la promesse d'automatisation des workflows d'équipe via un Hero restructuré et un terminal interactif mis à jour.
  success: Le hero affiche le H1 "Automatisez les workflows qui freinent votre équipe", le sous-titre orienté intégration métier, les CTAs dédiés ("Identifier un workflow à automatiser" et "Voir mes systèmes IA"), et les sorties de commande du terminal hero reflètent les commandes `whoami`, `focus.txt` et `~/systems`.

- id: CAP-3
  intent: La page d'accueil présente la nouvelle offre en 3 cartes de services et un bloc différenciateur "prototype vers production" valorisant la robustesse technique et la QA.
  success: La section "Ce que je propose" expose les 3 offres (Automatisation de processus métier, Agents IA intégrés à vos outils, Applications IA sur mesure) avec leurs tags respectifs, immédiatement suivie du bloc "Un agent qui fonctionne trois fois n'est pas encore un système fiable" détaillant les piliers Données, Fiabilité, IA et Exploitation.

- id: CAP-4
  intent: La page d'accueil met en avant 3 projets phares démontrant la résolution de problèmes métier concrets (Keova Signal, Debrief, Devis-Assist), tout en conservant les réalisations antérieures dans un statut d'archives ou de parcours.
  success: Les trois projets affichés en vitrine principale sont Keova Signal (commercial / signaux d'achat), Debrief (desktop / IA locale privacy-first) et Devis-Assist (BTP / OCR & extraction documentaire), avec leurs statuts réels (interne, R&D, MVP) et sans métrique ni ROI fictif.

- id: CAP-5
  intent: La page Services (`/services`) détaille la méthodologie d'intervention en 4 étapes et la grille tarifaire transparente des 3 formats d'engagement.
  success: La page `/services` articule le processus (Diagnostic, Cadrage, Build, Exploitation) et affiche les offres "AI Workflow Sprint" (à partir de 3 500 € HT), "AI Workflow Blueprint" (à partir de 750 € HT) et "AI Care" (à partir de 490 € HT/mois) en dissociant explicitement les coûts d'infrastructure et d'APIs tierces.

- id: CAP-6
  intent: La page À propos (`/about`) retrace la trajectoire professionnelle en articulant la métrologie industrielle, le contrôle qualité (QA), le développement Full Stack et l'ingénierie des systèmes IA.
  success: Le contenu d'introduction et la timeline relient explicitement la rigueur de métrologie et QA à la fiabilité des agents IA en production (reproductibilité, gestion des cas limites, observabilité).

- id: CAP-7
  intent: Le visiteur peut qualifier directement son workflow problématique via les CTA de bas de page et le formulaire de contact mis à jour.
  success: Le CTA final global pose la question "Quel process vous fait perdre du temps chaque semaine ?" avec le prompt inspecteur `$ ./workflow --inspect`, et le formulaire de contact permet de saisir la description du processus et son fonctionnement actuel.

- id: CAP-8
  intent: Les métadonnées SEO, OpenGraph et données structurées Schema.org intègrent les nouveaux mots-clés sans allégations trompeuses.
  success: `usePageSeo` injecte les balises de titres ("Simon Jouan — Systèmes IA, agents & automatisation métier") et descriptions cibles sur l'ensemble des 13 routes pré-rendues.

- id: CAP-9
  intent: La refonte de contenu préserve intégralement les acquis d'accessibilité (a11y WCAG / RGAA), le responsive mobile et l'univers graphique terminal dark-first sans régression technique.
  success: La validation Docker `pnpm lint && pnpm typecheck && pnpm generate` passe avec 0 erreur et les contrastes, focus clavier et comportements motion réduit sont maintenus conformes aux standards du projet.

## Constraints

- **Direction artistique pérenne :** Conservation stricte du thème sombre aubergine, de l'accent orange, de la typographie Ubuntu/monospace et de l'ambiance terminal. Zéro cliché visuel d'IA générique (pas de cerveaux lumineux, néons bleus/violets, robots ou logos OpenAI partout).
- **Zéro Emoji :** Conformité stricte à la règle NFR6 du projet (aucun emoji dans les contenus textuels ou l'UI).
- **Vérité des faits :** Aucun ROI inventé, aucune promesse magique de remplacement d'employés, respect des statuts réels des projets (R&D, MVP, interne).
- **Environnement Docker exclusif :** Toute validation et compilation s'exécute dans Docker via `docker compose run --rm web ...`.
- **DRY & Pas d'URL en dur :** Données centralisées dans `app/data/site.ts`, URL résolue via `useSiteUrl()`.

## Non-goals

- Ne pas refondre l'identité graphique, le logo ou le Design System de base.
- Ne pas construire de système d'authentification ou d'espace client sur `jouan.ovh`.
- Ne pas supprimer brutalement les anciens projets du code (conservation propre pour archives ou parcours).
- Ne pas créer de calculateur de devis automatisé complexe en V1.

## Success signal

Le site déployé sur `jouan.ovh` (ou prévisualisé en local) permet à un prospect ou client en moins de 20 secondes d'identifier Simon comme développeur Full Stack capable d'automatiser un processus métier via des systèmes IA robustes, avec 3 démonstrateurs techniques crédibles et une proposition d'audit initial immédiate, validé par une gate CI/Docker verte à 100 %.

## Assumptions

- Les dépôts `zohac/keova_signal`, `zohac/debrief` et `zohac/devis-assist` sont des projets privés sous propriété intellectuelle : ils sont présentés avec le statut `Projet interne / Dépôt privé` sans lien GitHub sortant direct.
- Keova Signal dispose déjà de 3 visuels haute définition copiés dans `public/images/projects/`.
- Debrief dispose de 3 captures de référence prêtes à l'import depuis son Design System.
- Devis-Assist est représenté fidèlement sous son statut de phase de spécification et d'architecture BMM validées (pipeline Mistral OCR 3, BullMQ, pg_trgm).
- Les anciens projets restent référencés dans le code de `site.ts` sous une section secondaire d'archives/parcours.

## Open Questions

- L'expérience `Linkizz` sur la page À propos doit-elle être conservée telle quelle, ajustée ou complétée ?


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

Dans ce cas, utiliser `Workflow métier` comme explication, afin de ne pas obliger le prospect à comprendre le terme "Sprint".

## Positionnement

C'est **l'offre cœur**.

Elle s'adresse à un processus complet qui traverse plusieurs étapes, personnes ou outils.

Exemples :

```text
nouveau lead
→ enrichissement
→ qualification
→ scoring
→ CRM
→ préparation commerciale
→ validation humaine
```

ou :

```text
document reçu
→ lecture
→ extraction
→ normalisation
→ vérification
→ stockage
→ restitution métier
```

## Texte public recommandé

> **Quand le problème dépasse une tâche isolée, je traite le workflow de bout en bout.**
>
> Je cartographie le processus actuel, construis le flux cible, connecte les outils nécessaires et mets en production un système mesurable, avec supervision humaine là où elle reste utile.

## Inclus typiquement


exec
/bin/zsh -lc "rg -n -C 4 \"15\\.1|suppression|3 500|réassurance|contextuel|prix\" docs/project-context.md docs/specs/spec-repositionnement-ia/SPEC.md docs/jouan-ovh-offre-commerciale-v1.1-updated.md AGENTS.md docs/planning-artifacts/epics.md" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "sed -n '1,130p' app/pages/index.vue; sed -n '680,790p' app/pages/index.vue; rg -n \"offer__more|services-reassurance|surface-1|surface-card|surface-sunken|text-muted|text-body|@media \\(max-width\" app docs/specs/spec-repositionnement-ia docs/jouan-ovh-offre-commerciale-v1.1-updated.md" in /Users/simon/dev/jouan.ovh
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
app/pages/about.vue:234:  color: var(--text-muted);
app/pages/about.vue:286:  background: var(--surface-1);
app/pages/about.vue:301:  color: var(--text-muted);
app/pages/about.vue:318:    color: var(--text-body);
app/pages/about.vue:419:  color: var(--text-muted);
app/pages/about.vue:426:  color: var(--text-body);
app/pages/blog/[...slug].vue:192:  color: var(--text-muted);
app/pages/blog/[...slug].vue:237:// .prose (global) donne déjà font-sans / lh-relaxed / text-body. Ici : taille + rythme
app/pages/blog/[...slug].vue:349:    color: var(--text-muted);
app/pages/blog/[...slug].vue:405:  background: var(--surface-1);
app/pages/blog/[...slug].vue:425:  color: var(--text-muted);
app/pages/blog/index.vue:175:  color: var(--text-muted);
app/pages/blog/index.vue:224:  color: var(--text-body);
app/pages/blog/index.vue:251:  color: var(--text-muted);
app/pages/services.vue:267:  color: var(--text-muted);
app/pages/services.vue:332:  color: var(--text-body);
app/pages/services.vue:345:    color: var(--text-muted);
app/pages/services.vue:367:  color: var(--text-muted);
app/pages/services.vue:381:  color: var(--text-muted);
app/pages/services.vue:433:  color: var(--text-muted);
app/components/HeaderComponent.vue:337:      color: var(--text-body);
app/components/HeaderComponent.vue:367:  color: var(--text-body);
app/components/HeaderComponent.vue:572:    background: var(--surface-1);
app/components/HeaderComponent.vue:595:  color: var(--text-body);
app/pages/mentions-legales.vue:128:  color: var(--text-muted);
app/components/CurrentTime.vue:65:  color: var(--text-muted);
app/pages/contact/card.vue:127:  color: var(--text-body);
app/pages/contact/card.vue:186:  color: var(--text-muted);
app/pages/contact/card.vue:213:  background: color-mix(in srgb, var(--surface-1) 60%, transparent);
app/pages/contact/card.vue:291:  color: var(--text-muted);
app/components/FooterComponent.vue:81:  background: var(--surface-1);
app/components/FooterComponent.vue:128:    color: var(--text-muted);
app/components/FooterComponent.vue:143:  color: var(--text-body);
app/components/FooterComponent.vue:194:    color: var(--text-body);
app/components/FooterComponent.vue:198:      color: var(--text-body);
app/components/FooterComponent.vue:219:  color: var(--text-body);
app/pages/contact/index.vue:383:  color: var(--text-muted);
app/pages/contact/index.vue:425:  // Contraste (story 9.2) : notice légale = info réelle → --text-muted (≥ 4.5:1),
app/pages/contact/index.vue:427:  color: var(--text-muted);
app/pages/contact/index.vue:493:  color: var(--text-muted);
app/pages/contact/index.vue:545:  color: var(--text-muted);
app/pages/contact/index.vue:553:  color: var(--text-muted);
app/pages/contact/index.vue:559:  color: var(--text-muted);
app/pages/confidentialite.vue:191:  color: var(--text-muted);
app/pages/index.vue:80:              <NuxtLink to="/services" class="offer__more" :aria-label="service.actionText">
app/pages/index.vue:88:        <div class="services-reassurance">
app/pages/index.vue:89:          <p class="services-reassurance__text">
app/pages/index.vue:541:  color: var(--text-body);
app/pages/index.vue:550:  color: var(--text-muted);
app/pages/index.vue:568:  color: var(--text-body);
app/pages/index.vue:683:  color: var(--text-body);
app/pages/index.vue:701:    color: var(--text-muted);
app/pages/index.vue:716:.offer__more {
app/pages/index.vue:745:.services-reassurance {
app/pages/index.vue:748:  background: var(--surface-1);
app/pages/index.vue:754:.services-reassurance__text {
app/pages/index.vue:760:  color: var(--text-body);
app/pages/index.vue:779:  color: var(--text-body);
app/pages/index.vue:827:  color: var(--text-muted);
app/pages/index.vue:893:  background: color-mix(in srgb, var(--surface-1) 60%, transparent);
app/pages/index.vue:939:  color: var(--text-muted);
app/pages/index.vue:999:  color: var(--text-body);
app/pages/index.vue:1007:  color: var(--text-muted);
app/pages/index.vue:1055:    color: var(--text-muted);
app/pages/index.vue:1079:  color: var(--text-muted);
app/pages/index.vue:1163:  color: var(--text-muted);
app/pages/index.vue:1205:  color: var(--text-muted);
app/pages/index.vue:1216:    color-mix(in srgb, var(--surface-1) 85%, transparent);
app/pages/index.vue:1249:  color: var(--text-muted);
app/components/terminal/TerminalComponent.vue:408:      color: var(--text-muted);
app/components/card/ZCardBody.vue:21:  color: var(--text-body);
app/assets/scss/base/_layout.scss:54:  color: var(--text-muted);
app/assets/scss/base/_layout.scss:61:  color: var(--text-body);
app/assets/scss/base/_layout.scss:85:  // au-dessus (--text-faint échouait ~2.95:1 sur carte ; --text-muted ≥ 4.5:1).
app/assets/scss/base/_layout.scss:86:  color: var(--text-muted);
app/assets/scss/base/_reset.scss:384:  color: var(--text-body);
app/components/ui/ZButton.vue:298:  color: var(--text-body);
app/components/ui/ZCard.vue:136:  color: var(--text-body);
app/components/ui/ZTag.vue:120:  color: var(--text-body);
app/components/ui/ZTag.vue:166:  color: var(--text-muted);
app/components/ui/ZBadge.vue:55:  color: var(--text-body);
app/components/ui/ThemeToggle.vue:62:  color: var(--text-muted);
app/components/ui/ThemeToggle.vue:64:  background: var(--surface-1);
app/components/home/HomeHeroTerminal.vue:310:  color: var(--text-muted);
app/components/home/HomeBootOverlay.vue:219:  color: var(--text-muted);
app/components/home/HomeStackMarquee.vue:88:  color: var(--text-body);
app/components/ui/ZInput.vue:140:  color: var(--text-muted);
app/components/ui/ZInput.vue:165:    // Contraste (story 9.2) : remonté d'un palier (--text-faint → --text-muted).
app/components/ui/ZInput.vue:167:    color: var(--text-muted);
app/components/ui/ZInput.vue:206:  color: var(--text-muted);
app/components/ui/ZInput.vue:225:  color: var(--text-muted);
app/assets/scss/abstract/_root.scss:33:  --surface-1: hsl(319deg 22% 9%); // sections en creux
app/assets/scss/abstract/_root.scss:72:  --bg-sunken: var(--surface-1);
app/assets/scss/abstract/_root.scss:78:  --text-body: var(--ink-2);
app/assets/scss/abstract/_root.scss:79:  --text-muted: var(--ink-3);
app/assets/scss/abstract/_root.scss:218:  --surface-1: hsl(38deg 20% 93%);
app/assets/scss/abstract/_root.scss:237:  --bg-sunken: var(--surface-1);
app/assets/scss/abstract/_root.scss:242:  --text-body: var(--ink-2);
app/assets/scss/abstract/_root.scss:243:  --text-muted: var(--ink-3);
app/assets/scss/abstract/_root.scss:284:  --surface-1: hsl(319deg 22% 9%);
app/assets/scss/abstract/_root.scss:296:  --bg-sunken: var(--surface-1);
app/assets/scss/abstract/_root.scss:302:  --text-body: hsl(28deg 10% 74%);
app/assets/scss/abstract/_root.scss:303:  --text-muted: hsl(25deg 7% 54%);

 succeeded in 0ms:
docs/specs/spec-repositionnement-ia/SPEC.md-35-  success: Les trois projets affichés en vitrine principale sont Keova Signal (commercial / signaux d'achat), Debrief (desktop / IA locale privacy-first) et Devis-Assist (BTP / OCR & extraction documentaire), avec leurs statuts réels (interne, R&D, MVP) et sans métrique ni ROI fictif.
docs/specs/spec-repositionnement-ia/SPEC.md-36-
docs/specs/spec-repositionnement-ia/SPEC.md-37-- id: CAP-5
docs/specs/spec-repositionnement-ia/SPEC.md-38-  intent: La page Services (`/services`) détaille la méthodologie d'intervention en 4 étapes et la grille tarifaire transparente des 3 formats d'engagement.
docs/specs/spec-repositionnement-ia/SPEC.md:39:  success: La page `/services` articule le processus (Diagnostic, Cadrage, Build, Exploitation) et affiche les offres "AI Workflow Sprint" (à partir de 3 500 € HT), "AI Workflow Blueprint" (à partir de 750 € HT) et "AI Care" (à partir de 490 € HT/mois) en dissociant explicitement les coûts d'infrastructure et d'APIs tierces.
docs/specs/spec-repositionnement-ia/SPEC.md-40-
docs/specs/spec-repositionnement-ia/SPEC.md-41-- id: CAP-6
docs/specs/spec-repositionnement-ia/SPEC.md-42-  intent: La page À propos (`/about`) retrace la trajectoire professionnelle en articulant la métrologie industrielle, le contrôle qualité (QA), le développement Full Stack et l'ingénierie des systèmes IA.
docs/specs/spec-repositionnement-ia/SPEC.md-43-  success: Le contenu d'introduction et la timeline relient explicitement la rigueur de métrologie et QA à la fiabilité des agents IA en production (reproductibilité, gestion des cas limites, observabilité).
--
docs/planning-artifacts/epics.md-77-FR28: Source de données unique (`site.ts`), assainissement sémantique et cohérence globale du profil (nouveau titre, bio, localisation « France · Remote », stack ciblée, vitrine Keova Signal / Debrief / Devis-Assist, élimination de « Ingénieur IA » et « ERP équestre »). _(CAP-1)_
docs/planning-artifacts/epics.md-78-FR29: Page d'accueil — Hero commercial cinétique & Terminal interactif (H1 « Automatisez les workflows qui freinent votre équipe », sous-titre d'intégration de systèmes, CTAs vers workflow, commandes terminal `whoami`, `cat focus.txt`, `ls ~/systems`). _(CAP-2)_
docs/planning-artifacts/epics.md-79-FR30: Page d'accueil — Vitrine des 3 services ciblés & Bloc différenciateur « Prototype → Production » (Automatisation, Agents IA, Applications sur mesure, suivi de « Un agent qui fonctionne trois fois n'est pas encore un système fiable » articulé sur 4 piliers). _(CAP-3)_
docs/planning-artifacts/epics.md-80-FR31: Page d'accueil — Vitrine des 3 projets phares (Keova Signal avec dashboard réel HD, Debrief 100% on-device avec capture HD, Devis-Assist avec pipeline OCR BTP et matching pg_trgm, sans faux ROI, relégation des anciens projets en archives/parcours). _(CAP-4)_
docs/planning-artifacts/epics.md:81:FR32: Page Services — Restructuration complète des offres & Processus en 4 étapes (Workflow Sprint à 3 500 € HT, Blueprint à 750 € HT, AI Care à 490 € HT/mois hors consommations tierces, et process Diagnostic → Cadrage → Build → Suivi). _(CAP-5)_
docs/planning-artifacts/epics.md-82-FR33: Page À propos — Trajectoire professionnelle et rigueur QA (métrologie industrielle → QA logicielle → Full Stack → systèmes IA en production). _(CAP-6)_
docs/planning-artifacts/epics.md-83-FR34: CTA global inspecteur de workflow (`$ ./workflow --inspect`) et formulaire de contact orienté qualification de processus. _(CAP-7)_
docs/planning-artifacts/epics.md-84-FR35: SEO centralisé, OpenGraph et Schema.org/JSON-LD alignés sur « Systèmes IA, agents & automatisation métier ». _(CAP-8)_
docs/planning-artifacts/epics.md-85-FR36: Préservation de la DA terminal dark-first, accessibilité WCAG AA, conformité motion réduit et validation de la gate Docker 100% verte. _(CAP-9)_
--
docs/planning-artifacts/epics.md-100-FR47: Observabilité SEO via vérification DNS TXT chez OVH, génération dynamique du `sitemap.xml` et déclaration conforme dans `robots.txt`. _(CAP-5, CAP-6)_
docs/planning-artifacts/epics.md-101-FR48: Outillage agentic MCP PostHog et validation Docker sans régression (`lint`, `typecheck`, `generate`). _(CAP-7, CAP-8)_
docs/planning-artifacts/epics.md-102-
docs/planning-artifacts/epics.md-103-#### Epic 15 — Repositionnement Commercial V1.1 : Désancrage Tarifaire & Offres par Niveaux d'Intervention (Offre V1.1)
docs/planning-artifacts/epics.md:104:FR49: Page d'accueil — Retrait de toute mention « À partir de 3 500 € HT », intégration des liens contextuels vers les types de systèmes et insertion de la phrase de réassurance sur le dimensionnement selon le workflow réel. _(CAP-1)_
docs/planning-artifacts/epics.md-105-FR50: Page Services — Restructuration complète des offres de build en 3 niveaux d'intervention sur devis (Automatisation ciblée, Workflow métier, Système métier sur mesure) et relégation du Blueprint en cadrage préalable optionnel. _(CAP-2)_
docs/planning-artifacts/epics.md-106-FR51: Page Services — Section dédiée AI Care après mise en production (à partir de 250 € HT / mois) et réalignement du déroulé d'intervention en 4 étapes (Diagnostic gratuit 20-30 min, Cadrage, Construction & intégration, Exploitation & mesure). _(CAP-3)_
docs/planning-artifacts/epics.md-107-FR52: Cohérence globale, SEO, accessibilité et validation transversale — Formulaire de contact sans budget imposé, alignement des métadonnées SEO, parité des thèmes clair/sombre et validation de la gate Docker 100% verte. _(CAP-4)_
docs/planning-artifacts/epics.md-108-
--
docs/planning-artifacts/epics.md-270-La refonte est réellement livrée : a11y résiduelle bouclée et validée, SEO centralisé, conformité légale publiée, et le site déployé en production sur `jouan.ovh` (gh-pages prouvé, `CNAME` intact). _(Ajouté après la rétro Epic 9 — décision Simon : consolider la pile `deferred-work.md` « fin de refonte » en un épic.)_
docs/planning-artifacts/epics.md-271-**FRs covered:** FR12, FR13, FR14, FR15, FR16, FR17 _(NFR5)_
docs/planning-artifacts/epics.md-272-
docs/planning-artifacts/epics.md-273-### Epic 11: Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
docs/planning-artifacts/epics.md:274:Le visiteur arrivant sur la page d'accueil de `jouan.ovh` découvre une vitrine immersive haute performance (« Awwwards level ») et comprend instantanément le positionnement de Simon Jouan comme Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL) pour applications web et SaaS, appuyé par des preuves concrètes de réalisations (Keova en production, TryOn en étude de cas, Nodium en lab R&D), une réassurance chiffrée (11 ans d'expérience, culture qualité logicielle), et des points de contact directs (formulaire et profil Malt) sans altérer l'architecture multi-pages existante.
docs/planning-artifacts/epics.md-275-**FRs covered:** FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27 _(NFR10, NFR11, NFR12, UX-DR18 à UX-DR25)_
docs/planning-artifacts/epics.md-276-
docs/planning-artifacts/epics.md-277-### Epic 12: Repositionnement Commercial V1 — Systèmes IA & Automatisation Métier
docs/planning-artifacts/epics.md:278:Le visiteur arrivant sur `jouan.ovh` (prospect ou client) comprend en moins de 15 secondes que Simon Jouan automatise les workflows métier des entreprises grâce à des systèmes IA robustes et industriels, validés par des réalisations concrètes (Keova Signal, Debrief, Devis-Assist) et une culture QA éprouvée, avec une grille tarifaire claire (Sprint à partir de 3 500 € HT) et un appel direct à qualifier son processus sans friction.
docs/planning-artifacts/epics.md-279-**FRs covered:** FR28, FR29, FR30, FR31, FR32, FR33, FR34, FR35, FR36 _(NFR13 à NFR16, UX-DR28 à UX-DR31)_
docs/planning-artifacts/epics.md-280-
docs/planning-artifacts/epics.md-281-### Epic 13: Thème Light & Dark et Bascule Utilisateur
docs/planning-artifacts/epics.md-282-Le visiteur peut consulter l'ensemble du site dans un thème clair « Papier technique / Crème solaire » reposant et contrasté tout en profitant de l'authenticité des terminaux sombres sanctuarisés. Il bénéficie d'une synchronisation automatique avec son OS, d'une bascule manuelle rapide dans le header (desktop et tiroir mobile) et d'une persistance locale sans aucun clignotement visuel (anti-FOUC) au rechargement statique.
--
docs/planning-artifacts/epics.md-802----
docs/planning-artifacts/epics.md-803-
docs/planning-artifacts/epics.md-804-## Epic 11: Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
docs/planning-artifacts/epics.md-805-
docs/planning-artifacts/epics.md:806:Le visiteur arrivant sur la page d'accueil de `jouan.ovh` découvre une vitrine immersive haute performance (« Awwwards level ») et comprend instantanément le positionnement de Simon Jouan comme Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL) pour applications web et SaaS, appuyé par des preuves concrètes de réalisations (Keova en production, TryOn en étude de cas, Nodium en lab R&D), une réassurance chiffrée (11 ans d'expérience, culture qualité logicielle), et des points de contact directs (formulaire et profil Malt) sans altérer l'architecture multi-pages existante.
docs/planning-artifacts/epics.md-807-
docs/planning-artifacts/epics.md-808-### Story 11.1: Préparation de branche, mise à jour des données `site.ts` & Atmosphère cinétique
docs/planning-artifacts/epics.md-809-
docs/planning-artifacts/epics.md-810-As a visiteur découvrant la page d'accueil,
--
docs/planning-artifacts/epics.md-908----
docs/planning-artifacts/epics.md-909-
docs/planning-artifacts/epics.md-910-## Epic 12: Repositionnement Commercial V1 — Systèmes IA & Automatisation Métier
docs/planning-artifacts/epics.md-911-
docs/planning-artifacts/epics.md:912:Le visiteur arrivant sur `jouan.ovh` (prospect ou client) comprend en moins de 15 secondes que Simon Jouan automatise les workflows métier des entreprises grâce à des systèmes IA robustes et industriels, validés par des réalisations concrètes (Keova Signal, Debrief, Devis-Assist) et une culture QA éprouvée, avec une grille tarifaire claire (Sprint à partir de 3 500 € HT) et un appel direct à qualifier son processus sans friction.
docs/planning-artifacts/epics.md-913-
docs/planning-artifacts/epics.md-914-### Story 12.1: Source unique de données `site.ts`, assainissement sémantique & cohérence globale
docs/planning-artifacts/epics.md-915-
docs/planning-artifacts/epics.md-916-As a visiteur du site,
--
docs/planning-artifacts/epics.md-921-
docs/planning-artifacts/epics.md-922-**Given** le fichier source unique `app/data/site.ts` et le composant Footer
docs/planning-artifacts/epics.md-923-**When** on met à jour les données de `SITE` :
docs/planning-artifacts/epics.md-924-  - `profile.role` devient `Développeur Full Stack spécialisé en systèmes IA & automatisation métier`
docs/planning-artifacts/epics.md:925:  - `profile.location` devient `France · Remote` (suppression définitive de `Rouen, France`)
docs/planning-artifacts/epics.md-926-  - `profile.bio` reflète la promesse d'automatisation des workflows et d'industrialisation IA
docs/planning-artifacts/epics.md-927-  - `skills` met en avant la stack ciblée (`TypeScript`, `Node.js 22`, `NestJS`, `Nuxt`, `PostgreSQL`, `MCP`, `Docker`, `whisper.cpp`, `sherpa-onnx`, `llama.cpp`, `BullMQ`, `Mistral OCR`)
docs/planning-artifacts/epics.md-928-  - `projects` intègre les entrées de `keova-signal` (interne/privé), `debrief` (R&D/privé) et `devis-assist` (architecture validée/privé) avec leurs tags et statuts réels
docs/planning-artifacts/epics.md:929:  - Les projets historiques (`keova-app`, `tryon`, `nodium`, web) sont maintenus dans une catégorie d'archives ou parcours, avec correction de la mention « ERP équestre » remplacée par « Application SaaS de gestion opérationnelle » et suppression du terme « Ingénieur IA » au profit de « Créateur · R&D agents IA »
docs/planning-artifacts/epics.md-930-**Then** aucun terme « Ingénieur IA » ni « ERP équestre » ne subsiste dans `site.ts` et les pieds de page
docs/planning-artifacts/epics.md-931-**And** la validation Docker (`pnpm lint && pnpm typecheck && pnpm generate`) est exécutée avec succès (0 erreur ESLint/Stylelint, 0 erreur TypeScript, 13 routes pré-rendues).
docs/planning-artifacts/epics.md-932-
docs/planning-artifacts/epics.md-933-### Story 12.2: Page d'accueil — Hero commercial cinétique & Terminal interactif
--
docs/planning-artifacts/epics.md-1006-**Then** le hero affiche :
docs/planning-artifacts/epics.md-1007-  - H1 : `Des systèmes IA construits autour de vos vrais processus métier.`
docs/planning-artifacts/epics.md-1008-  - Intro : `Je pars d’un workflow existant, pas d’une technologie à placer... L’IA intervient uniquement là où elle apporte réellement quelque chose.`
docs/planning-artifacts/epics.md-1009-**And** les 3 offres commerciales sont détaillées :
docs/planning-artifacts/epics.md:1010:  1. **AI Workflow Sprint** (Offre principale) : `À partir de 3 500 € HT`. Règle : `Un Sprint = un workflow prioritaire`. Liste complète des livrables inclus (diagnostic, cartographie, KPI, architecture, dev, intégrations, tests, MEP, documentation, mesure initiale).
docs/planning-artifacts/epics.md-1011-  2. **AI Workflow Blueprint** : `À partir de 750 € HT`. Cadrage préalable pour problématique complexe (processus actuel, volumes, risques, flux cible, matrice IA vs automation vs humain, KPI, estimation).
docs/planning-artifacts/epics.md-1012-  3. **AI Care** : `À partir de 490 € HT / mois`. Maintien en condition opérationnelle (monitoring, maintenance, support, veille coûts et modèles), avec exclusion explicite des consommations tierces d'APIs/tokens refacturées au réel.
docs/planning-artifacts/epics.md-1013-**And** le processus en 4 étapes est balisé sémantiquement en liste ordonnée `<ol>` :
docs/planning-artifacts/epics.md-1014-  - Étape 1 : *Diagnostic* (20-30 min pour qualifier le problème) avec CTA `Identifier un workflow`
--
docs/planning-artifacts/epics.md-1226----
docs/planning-artifacts/epics.md-1227-
docs/planning-artifacts/epics.md-1228-## Epic 15: Repositionnement Commercial V1.1 — Désancrage Tarifaire & Niveaux d'Intervention
docs/planning-artifacts/epics.md-1229-
docs/planning-artifacts/epics.md:1230:Simon Jouan souhaite supprimer l'affichage récurrent du prix d'entrée public de 3 500 € HT qui freinait les prospects ayant des besoins d'automatisation ciblée, et restructurer l'offre en 3 niveaux d'intervention sur devis, tout en conservant le Workflow métier comme offre cœur, AI Care isolé après mise en production à partir de 250 € HT/mois, et le Blueprint en cadrage optionnel.
docs/planning-artifacts/epics.md-1231-
docs/planning-artifacts/epics.md:1232:### Story 15.1: Homepage — Suppression des Prix d'Entrée, Liens Contextuels & Phrase de Réassurance
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
docs/planning-artifacts/epics.md:1243:**And** chaque carte intègre un lien d'exploration contextuel ciblant `/services` :
docs/planning-artifacts/epics.md-1244-  - *Automatisation :* « Voir les types d'automatisation → »
docs/planning-artifacts/epics.md-1245-  - *Agents IA :* « Voir quand utiliser un agent → »
docs/planning-artifacts/epics.md-1246-  - *Applications sur mesure :* « Découvrir les projets sur mesure → »
docs/planning-artifacts/epics.md:1247:**And** la phrase de réassurance officielle est insérée à proximité des expertises ou du CTA intermédiaire :
docs/planning-artifacts/epics.md-1248-  > *« Un besoin simple ne nécessite pas forcément un gros projet. Je dimensionne la solution selon le workflow réel : parfois quelques automatisations suffisent ; parfois il faut construire un système métier complet. »*
docs/planning-artifacts/epics.md-1249-**And** le style est strictement conforme aux tokens du design system (`var(--token)`), responsive et sans régression visuelle.
docs/planning-artifacts/epics.md-1250-
docs/planning-artifacts/epics.md-1251-### Story 15.2: Page Services — Restructuration des 3 Offres de Build sur Devis & Relégation du Blueprint
docs/planning-artifacts/epics.md-1252-
docs/planning-artifacts/epics.md-1253-As a prospect consultant la page `/services`,
docs/planning-artifacts/epics.md:1254:I want apprécier immédiatement les 3 niveaux d'intervention possibles et comprendre le positionnement sans prix plancher bloquant,
docs/planning-artifacts/epics.md-1255-So that je puisse identifier le format adapté à mon organisation (FR50, CAP-2).
docs/planning-artifacts/epics.md-1256-
docs/planning-artifacts/epics.md-1257-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-1258-
--
docs/planning-artifacts/epics.md-1261-**Then** le Hero présente le H1 officiel :
docs/planning-artifacts/epics.md-1262-  > *« Le bon niveau de système pour le bon problème. »*
docs/planning-artifacts/epics.md-1263-  avec le texte d'introduction centré sur le workflow plutôt que sur la technologie
docs/planning-artifacts/epics.md-1264-**And** la grille principale présente les 3 offres de build :
docs/planning-artifacts/epics.md:1265:  1. *Automatisation ciblée :* (Eyebrow `BESOIN PRÉCIS`, titre, accroche « Supprimer une tâche répétitive sans reconstruire tout le processus », prix `Sur devis`, CTA « Décrire mon besoin »)
docs/planning-artifacts/epics.md:1266:  2. *Workflow métier :* (Eyebrow `OFFRE CŒUR`, titre, accroche « Transformer un processus complet en système opérationnel », prix `Sur devis`, carte visuellement mise en avant / featured, CTA « Identifier un workflow »)
docs/planning-artifacts/epics.md:1267:  3. *Système métier sur mesure :* (Eyebrow `PROJET COMPLEXE`, titre, accroche « Construire l'application lorsque l'automatisation devient un vrai produit », prix `Sur devis`, CTA « Parler du projet »)
docs/planning-artifacts/epics.md-1268-**And** l'offre *AI Workflow Blueprint* est retirée des cartes de build principales pour devenir une option de cadrage dans la section process.
docs/planning-artifacts/epics.md-1269-
docs/planning-artifacts/epics.md-1270-### Story 15.3: Page Services — Section Dédiée AI Care Après Mise en Production & Process 4 Étapes
docs/planning-artifacts/epics.md-1271-
--
docs/planning-artifacts/epics.md-1301-**Given** l'ensemble des routes statiques de `jouan.ovh`
docs/planning-artifacts/epics.md-1302-**When** on audite le CTA final global et la page `/contact`
docs/planning-artifacts/epics.md-1303-**Then** le CTA global maintient la question « Quel process vous fait perdre du temps chaque semaine ? » avec le terminal `$ ./workflow --inspect`
docs/planning-artifacts/epics.md-1304-**And** le formulaire de contact dans `app/pages/contact.vue` qualifie le processus sans champ de budget obligatoire
docs/planning-artifacts/epics.md:1305:**And** les méta-descriptions SEO et OpenGraph gérées par `usePageSeo()` sont alignées sur l'Offre V1.1 sans référence obsolète aux 3 500 €
docs/planning-artifacts/epics.md-1306-**And** les thèmes clair et sombre s'affichent avec un contraste conforme WCAG AA
docs/planning-artifacts/epics.md-1307-**And** la suite de validation Docker s'exécute avec un succès complet à 100% :
docs/planning-artifacts/epics.md-1308-  ```sh
docs/planning-artifacts/epics.md-1309-  docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-17-Il sert de **source de vérité pour Codex** lors de la mise à jour du site.
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
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:29:Le prix reste un sujet commercial important, mais il doit intervenir **après compréhension du processus, de sa fréquence, de son impact et du périmètre réel**.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-30-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-31----
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-32-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-33-# 1. Positionnement
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-67-L'offre ne doit plus être comprise comme :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-68-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-69-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-70-Projet IA
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:71:→ minimum 3 500 €
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-72-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-73-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-74-Elle doit être comprise comme :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-75-
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-79-→ niveau d'intervention adapté
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-80-→ automatisation ciblée OU workflow complet OU système métier
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-81-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-82-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:83:Le prix dépend notamment :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-84-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-85-- du problème traité ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-86-- du volume ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-87-- de la fréquence ;
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-218-- documentation courte.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-219-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-220-## Prix public
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-221-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:222:**Ne pas afficher de prix minimum.**
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-223-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-224-Afficher :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-225-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-226-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-227-Sur devis selon le workflow
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-228-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-229-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:230:ou ne pas afficher de prix du tout.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-231-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-232-## Hypothèse commerciale interne
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-233-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-234-Cette catégorie sert à accepter des missions plus petites lorsqu'elles sont :
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-313-- mesure initiale.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-314-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-315-## Prix public
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-316-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:317:**Ne pas afficher `À partir de 3 500 € HT`.**
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-318-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-319-Afficher :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-320-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-321-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-322-Projet sur devis
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-323-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-324-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:325:ou ne pas afficher de prix.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-326-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-327-## Hypothèse commerciale interne
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-328-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-329-Le Workflow AI Sprint reste une **hypothèse d'offre cœur autour de 3 900 € HT**, à ajuster selon le scope et la valeur.
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-380-Ne pas afficher de ticket d'entrée public dans cette version.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-381-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-382-## Logique commerciale interne
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-383-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:384:Le prix dépend fortement :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-385-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-386-- du périmètre ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-387-- du nombre de workflows ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-388-- des intégrations ;
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-514-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-515-À partir de 250 € HT / mois
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-516-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-517-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:518:Ce prix reste une hypothèse commerciale à tester.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-519-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-520-Le `250 € HT / mois` constitue un **plancher de maintenance**, adapté à une automatisation simple, peu critique et peu consommatrice de support.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-521-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-522-Repères internes de travail, non destinés à devenir une grille publique rigide :
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-575-1. Automatisation de processus métier
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-576-2. Agents IA intégrés à vos outils
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-577-3. Applications IA sur mesure
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-578-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:579:Mais **supprimer les prix actuellement affichés sous les cartes**.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-580-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-581-En particulier, retirer :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-582-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-583-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:584:À partir de 3 500 € HT
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-585-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-586-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-587-des cartes :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-588-
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-590-- Agents IA intégrés à vos outils.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-591-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-592-## Remplacement recommandé
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-593-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:594:Sous les cartes, remplacer le prix par un lien contextuel :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-595-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-596-### Automatisation de processus métier
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-597-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-598-```text
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-618-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-619-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-620----
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-621-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:622:# 12. Homepage — ajouter une phrase de réassurance
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-623-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-624-Ajouter à proximité des trois expertises ou avant le CTA final :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-625-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-626-> **Un besoin simple ne nécessite pas forcément un gros projet.**
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-631-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-632-Elle corrige directement l'interprétation actuelle :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-633-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-634-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:635:"Simon = projet minimum à 3 500 €"
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-636-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-637-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-638-sans pour autant positionner Simon comme prestataire low-cost.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-639-
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-984-## À ne plus afficher dans cette version
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
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1005-# 19. Règles de qualification commerciale associées
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1021-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1022-- bricolage ponctuel sans valeur ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1023-- support permanent non payé ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1024-- scope flou ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1025:- prix attendu irréaliste ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1026-- automatisation d'un processus déjà mauvais ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1027-- demande gadget « parce que c'est de l'IA » ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1028-- maintenance disproportionnée ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1029-- besoin extrêmement spécifique sans intérêt économique.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1030-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1031----
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1032-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1033:# 20. Logique de prix interne
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1034-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1035:Le prix ne doit pas être calculé uniquement à partir du temps de développement.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1036-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1037-Le raisonnement commercial doit suivre :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1038-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1039-```text
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1045-→ coût du statu quo
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1046-→ situation cible
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1047-→ valeur du changement
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1048-→ risque / périmètre
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1049:→ prix
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1050-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1051-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1052-Le temps de réalisation intervient comme contrainte de rentabilité, pas comme seule base de pricing.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1053-
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1072-- fréquence ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1073-- impact ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1074-- solution proposée ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1075-- niveau d'offre ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1076:- prix proposé ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1077:- prix signé ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1078-- temps estimé ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1079-- temps réel ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1080-- marge ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1081:- objection prix ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1082-- raison WON / LOST ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1083-- besoin de maintenance ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1084-- potentiel de réutilisation.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1085-
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1105-Après suffisamment de signal terrain, une V1.2 pourra éventuellement :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1106-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1107-- afficher un ticket minimum ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1108-- publier une fourchette ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1109:- définir un vrai prix d'entrée ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1110-- créer un package d'automatisation ciblée ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1111:- augmenter le prix du Workflow Sprint ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1112-- supprimer une catégorie peu rentable ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1113-- spécialiser une offre par verticale ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1114-- rendre AI Care obligatoire sur certains systèmes critiques.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1115-
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1125-4. Modifier en priorité :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1126-   - homepage ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1127-   - page Services ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1128-   - CTA ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1129:   - libellés de prix ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1130-   - éventuels textes associés à l'offre.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1131:5. Supprimer les prix `À partir de 3 500 € HT` des cartes publiques concernées.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1132:6. Ne pas remplacer ces prix par un prix plus bas.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1133-7. Ne pas créer une grille SaaS rigide.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1134-8. Présenter :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1135-   - Automatisation ciblée ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1136-   - Workflow métier ;
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1143-   - ROI ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1144-   - résultats ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1145-   - témoignages ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1146-   - clients ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1147:   - prix supplémentaires ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1148-   - fonctionnalités.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1149-13. Conserver les preuves existantes :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1150-   - Keova Signal ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1151-   - Debrief ;
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1168-# 24. Critères d'acceptation
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1169-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1170-La mise à jour est réussie si :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1171-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1172:- [ ] aucun `À partir de 3 500 € HT` n'est affiché sur les cartes Automatisation / Agents IA ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1173:- [ ] le site ne donne plus l'impression que toute intervention coûte au minimum 3 500 € ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1174-- [ ] l'offre distingue clairement automatisation ciblée, workflow métier et système métier ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1175-- [ ] le Workflow métier reste visuellement identifiable comme offre cœur ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1176-- [ ] aucune offre low-cost artificielle n'est créée ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1177:- [ ] aucun prix fictif n'est ajouté ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1178-- [ ] le Diagnostic reste accessible ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1179-- [ ] le Blueprint devient secondaire / optionnel ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1180-- [ ] AI Care reste séparé du build ;
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1181-- [ ] `À partir de 250 € HT / mois` reste affiché pour AI Care ;
--
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1249----
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1250-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1251-# 27. Décision V1.1
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1252-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1253:La V1.1 retire le ticket d'entrée public de **3 500 € HT**.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1254-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1255-Ce changement ne signifie pas :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1256-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1257-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1258:baisser les prix
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1259-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1260-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1261-Il signifie :
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1262-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1263-```text
docs/jouan-ovh-offre-commerciale-v1.1-updated.md:1264:ne pas annoncer le prix d'un workflow complet
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1265-à un prospect qui a peut-être un problème beaucoup plus simple.
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1266-```
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1267-
docs/jouan-ovh-offre-commerciale-v1.1-updated.md-1268-La priorité commerciale devient :

exec
/bin/zsh -lc "git diff --no-index /dev/null docs/implementation-artifacts/code-reviews/15-1/full.diff >/dev/null; sed -n '1,220p' app/components/ui/ZCard.vue; sed -n '1,240p' app/assets/scss/abstract/_root.scss" in /Users/simon/dev/jouan.ovh
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

  &:focus-visible {
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
  border-color: var(--accent-ring);
  box-shadow: var(--glow-accent), var(--shadow-hairline);
}

@media (prefers-reduced-motion: reduce) {
  .zcard {
    transition: none;
    transform: none !important;
  }

  .zcard--interactive:hover {
    transform: none;
  }
}
</style>
// ============================================================
//  Tokens du design system — SOURCE DE VÉRITÉ du style
//  Porté depuis docs/design_system/tokens/*.css (dark-first,
//  héritage Ubuntu/terminal : orange + aubergine).
//
//  RÈGLE : aucune valeur de couleur / espace / rayon / ombre /
//  motion ne doit être hardcodée dans un composant. Tout passe
//  par ces CSS custom properties via var(--token). (NFR2 / CAP-2)
//
//  Les valeurs sont reproduites à l'identique des tokens source
//  (notation couleur normalisée par Stylelint : hsl angle/%).
// ============================================================

:root {
  // ---- Brand : Ubuntu orange (accent primaire) ----
  --orange-50: hsl(24deg 100% 96%);
  --orange-100: hsl(25deg 100% 92%);
  --orange-300: hsl(24deg 100% 75%);
  --orange-500: hsl(24deg 94% 53%); // accent héros
  --orange-600: hsl(24deg 100% 47%);
  --orange-700: hsl(24deg 100% 37%);
  --orange-900: hsl(15deg 60% 17%);

  // ---- Brand : Aubergine (violet Ubuntu) ----
  --aubergine-light: hsl(319deg 26% 70%);
  --aubergine: hsl(319deg 33% 30%);
  --aubergine-vivid: hsl(319deg 60% 30%); // variante saturée — glows/dégradés héros
  --aubergine-deep: hsl(319deg 100% 9%); // corps terminal
  --aubergine-black: hsl(320deg 60% 5%);

  // ---- Rampe de surfaces neutres (teintées aubergine, sombre→clair) ----
  --surface-0: hsl(320deg 30% 6%); // fond de page, le plus profond
  --surface-1: hsl(319deg 22% 9%); // sections en creux
  --surface-2: hsl(318deg 18% 12%); // cartes / panneaux
  --surface-3: hsl(317deg 16% 16%); // éléments surélevés / hover
  --surface-4: hsl(316deg 14% 21%); // popovers, inputs

  // ---- Bordures / hairlines ----
  --line-subtle: hsl(316deg 14% 18%);
  --line: hsl(315deg 12% 25%);
  --line-strong: hsl(314deg 11% 34%);

  // ---- Texte (off-whites chauds sur fond sombre) ----
  --ink-1: hsl(30deg 18% 95%); // titres haut contraste
  --ink-2: hsl(28deg 10% 74%); // corps
  --ink-3: hsl(25deg 7% 54%); // discret / légendes
  --ink-4: hsl(22deg 6% 40%); // estompé / désactivé
  --ink-on-accent: hsl(320deg 60% 5%); // texte sombre sur orange

  // ---- Palette terminale / syntaxe ----
  --term-green: hsl(143deg 60% 52%); // prompt, succès
  --term-blue: hsl(204deg 72% 62%); // répertoires, liens
  --term-cyan: hsl(186deg 64% 56%);
  --term-red: hsl(0deg 85% 64%);
  --term-yellow: hsl(48deg 90% 58%);
  --term-purple: hsl(280deg 60% 70%);

  // ---- Sémantique ----
  --success: hsl(143deg 58% 46%);
  --success-soft: hsl(143deg 45% 14%);
  --warning: hsl(38deg 92% 56%);
  --warning-soft: hsl(38deg 60% 14%);
  --danger: hsl(0deg 78% 60%);
  --danger-soft: hsl(0deg 55% 15%);
  --info: hsl(204deg 72% 56%);
  --info-soft: hsl(204deg 55% 14%);

  // ============================================================
  //  Alias sémantiques — à préférer dans les composants
  // ============================================================
  --bg-page: var(--surface-0);
  --bg-sunken: var(--surface-1);
  --bg-card: var(--surface-2);
  --bg-elevated: var(--surface-3);
  --bg-input: var(--surface-4);
  --bg-terminal: var(--aubergine-deep);
  --text-strong: var(--ink-1);
  --text-body: var(--ink-2);
  --text-muted: var(--ink-3);
  --text-faint: var(--ink-4);
  --border-subtle: var(--line-subtle);
  --border-default: var(--line);
  --border-strong: var(--line-strong);
  --accent: var(--orange-500);
  --accent-hover: hsl(24deg 100% 60%);
  --accent-active: var(--orange-600);
  --accent-text: var(--ink-on-accent);
  --accent-soft: hsl(24deg 94% 53% / 13%); // fond teinté
  --accent-ring: hsl(24deg 94% 53% / 45%);
  --accent-2: var(--aubergine-light); // accent secondaire
  --accent-2-soft: hsl(319deg 40% 30% / 28%);
  --border-terminal: hsl(319deg 40% 30% / 40%); // bordure fenêtre terminal (TerminalWindow.jsx)
  --link: var(--term-blue);
  --prompt: var(--term-green);
  --overlay: hsl(320deg 60% 3% / 66%);
  --selection: hsl(24deg 94% 53% / 28%);

  // ============================================================
  //  Typographie
  // ============================================================
  --font-mono: "Ubuntu Mono", "SF Mono", ui-monospace, monospace;
  --font-sans: "Ubuntu", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-display: var(--font-mono);

  // Tailles de police (échelle px : 12 14 16 18 20 24 28 32 40 48 56)
  --fs-xs: 0.75rem; // 12
  --fs-sm: 0.875rem; // 14
  --fs-base: 1rem; // 16
  --fs-md: 1.125rem; // 18
  --fs-lg: 1.25rem; // 20
  --fs-xl: 1.5rem; // 24
  --fs-2xl: 1.75rem; // 28
  --fs-3xl: 2rem; // 32
  --fs-4xl: 2.5rem; // 40
  --fs-5xl: 3rem; // 48
  --fs-6xl: 3.5rem; // 56

  // Graisses
  --fw-light: 300;
  --fw-regular: 400;
  --fw-medium: 500;
  --fw-bold: 700;

  // Interlignes
  --lh-tight: 1.1;
  --lh-snug: 1.3;
  --lh-normal: 1.5;
  --lh-relaxed: 1.65;

  // Interlettrage — les eyebrows/labels mono reçoivent des capitales espacées
  --ls-tight: -0.02em;
  --ls-normal: 0;
  --ls-wide: 0.04em;
  --ls-wider: 0.14em;

  // ============================================================
  //  Espacement — base 4px (token = px / 4)
  // ============================================================
  --space-0: 0;
  --space-1: 0.25rem; // 4
  --space-2: 0.5rem; // 8
  --space-3: 0.75rem; // 12
  --space-4: 1rem; // 16
  --space-5: 1.25rem; // 20
  --space-6: 1.5rem; // 24
  --space-8: 2rem; // 32
  --space-10: 2.5rem; // 40
  --space-12: 3rem; // 48
  --space-16: 4rem; // 64
  --space-20: 5rem; // 80
  --space-24: 6rem; // 96

  // Layout
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 992px;
  --container-xl: 1200px;
  --container-2xl: 1400px;
  --header-height: 56px;
  --footer-height: 56px;
  --gutter: var(--space-6);

  // ============================================================
  //  Rayons (héritage : 0 / 4 / 8 / pill / 50% ; terminal = 5px)
  // ============================================================
  --radius-none: 0;
  --radius-xs: 3px;
  --radius-sm: 5px; // fenêtre terminal, chips
  --radius-md: 8px; // cartes, inputs, boutons
  --radius-lg: 12px; // grands panneaux
  --radius-xl: 18px;
  --radius-pill: 999px;
  --radius-circle: 50%;

  // ============================================================
  //  Élévation — ombres calibrées pour une UI sombre
  // ============================================================
  --shadow-1: 0 1px 3px hsl(320deg 60% 2% / 50%);
  --shadow-2: 0 2px 8px hsl(320deg 60% 2% / 55%);
  --shadow-3: 0 8px 24px hsl(320deg 60% 2% / 60%);
  --shadow-4: 0 18px 48px hsl(320deg 60% 2% / 66%);

  // Hairline interne en haut : donne l'impression d'une carte éclairée du dessus
  --shadow-hairline: inset 0 1px 0 hsl(30deg 20% 100% / 5%);

  // Glows focaux
  --glow-accent: 0 0 0 1px hsl(24deg 94% 53% / 40%), 0 8px 30px hsl(24deg 94% 53% / 22%);
  --glow-terminal: 0 12px 40px hsl(319deg 100% 9% / 70%), 0 0 0 1px hsl(319deg 40% 40% / 30%);

  // Anneau de focus
  --ring-accent: 0 0 0 3px var(--accent-ring);

  // ============================================================
  //  Motion — easings sobres et mécaniques (esprit terminal)
  // ============================================================
  --dur-fast: 120ms;
  --dur-base: 180ms;
  --dur-slow: 320ms;
  --dur-slower: 600ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-standard: ease-in-out;

  // Ambiance & contrastes héro
  --atmos-opacity: 0.52;
  --atmos-fallback-accent: var(--accent-soft);
  --atmos-fallback-accent-2: var(--accent-2-soft);
  --hero-title-shadow: 0 2px 14px color-mix(in srgb, var(--surface-0) 80%, transparent);
  --hero-sub-shadow: 0 1px 8px color-mix(in srgb, var(--surface-0) 70%, transparent);
}

// ============================================================
//  Surcharge Thème Clair — Palette « Papier technique / Crème solaire »
// ============================================================
[data-theme="light"] {
  // ---- Rampe de surfaces neutres primitives ----
  --surface-0: hsl(38deg 25% 97%);
  --surface-1: hsl(38deg 20% 93%);
  --surface-2: hsl(0deg 0% 100%);
  --surface-3: hsl(38deg 30% 99%);
  --surface-4: hsl(38deg 15% 95%);

  // ---- Bordures / hairlines primitives ----
  --line-subtle: hsl(35deg 15% 88%);
  --line: hsl(35deg 12% 80%);
  --line-strong: hsl(35deg 12% 68%);

  // ---- Texte encres primitives (contrastes WCAG AAA) ----
  --ink-1: hsl(320deg 30% 12%);
  --ink-2: hsl(320deg 18% 26%);
  --ink-3: hsl(320deg 10% 44%);
  --ink-4: hsl(320deg 8% 58%);
  --ink-on-accent: hsl(0deg 0% 100%);

  // ---- Alias sémantiques ----
  --bg-page: var(--surface-0);
  --bg-sunken: var(--surface-1);
  --bg-card: var(--surface-2);
  --bg-elevated: var(--surface-3);
  --bg-input: var(--surface-4);

exec
/bin/zsh -lc "sed -n '1120,1195p' docs/jouan-ovh-offre-commerciale-v1.1-updated.md; sed -n '1195,1280p' docs/jouan-ovh-offre-commerciale-v1.1-updated.md; sed -n '100,130p' docs/planning-artifacts/epics.md; rg -n -C 3 \"focus-visible|grid-3|services-reassurance|offer__more\" docs/implementation-artifacts/code-reviews/15-1/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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

```text
AI WORKFLOW BLUEPRINT
Cadrage approfondi avant engagement.
À partir de 750 € HT.
Optionnel.
```

---

# 26. Message de référence

Si un prospect demande simplement :

> « Qu'est-ce que vous faites exactement ? »

La réponse de référence est :

> **Je regarde les processus qui font perdre du temps à une équipe et je construis le bon niveau d'automatisation pour les simplifier.**
>
> Parfois une automatisation ciblée suffit. Parfois il faut connecter plusieurs outils, ajouter de l'IA ou construire une vraie application métier.
>
> Je pars du processus et de son impact, pas d'une technologie ou d'un package à vendre.

---

# 27. Décision V1.1

La V1.1 retire le ticket d'entrée public de **3 500 € HT**.

Ce changement ne signifie pas :

```text
baisser les prix
```

Il signifie :

```text
ne pas annoncer le prix d'un workflow complet
à un prospect qui a peut-être un problème beaucoup plus simple.
```

La priorité commerciale devient :

> **Obtenir la conversation, comprendre le problème, qualifier sa valeur, puis dimensionner l'intervention.**

Le pricing sera resserré lorsque suffisamment de données terrain permettront de distinguer clairement les missions petites, moyennes et complexes.

---

**Fin — Offre commerciale jouan.ovh V1.1 — 18 septembre 2026**
FR47: Observabilité SEO via vérification DNS TXT chez OVH, génération dynamique du `sitemap.xml` et déclaration conforme dans `robots.txt`. _(CAP-5, CAP-6)_
FR48: Outillage agentic MCP PostHog et validation Docker sans régression (`lint`, `typecheck`, `generate`). _(CAP-7, CAP-8)_

#### Epic 15 — Repositionnement Commercial V1.1 : Désancrage Tarifaire & Offres par Niveaux d'Intervention (Offre V1.1)
FR49: Page d'accueil — Retrait de toute mention « À partir de 3 500 € HT », intégration des liens contextuels vers les types de systèmes et insertion de la phrase de réassurance sur le dimensionnement selon le workflow réel. _(CAP-1)_
FR50: Page Services — Restructuration complète des offres de build en 3 niveaux d'intervention sur devis (Automatisation ciblée, Workflow métier, Système métier sur mesure) et relégation du Blueprint en cadrage préalable optionnel. _(CAP-2)_
FR51: Page Services — Section dédiée AI Care après mise en production (à partir de 250 € HT / mois) et réalignement du déroulé d'intervention en 4 étapes (Diagnostic gratuit 20-30 min, Cadrage, Construction & intégration, Exploitation & mesure). _(CAP-3)_
FR52: Cohérence globale, SEO, accessibilité et validation transversale — Formulaire de contact sans budget imposé, alignement des métadonnées SEO, parité des thèmes clair/sombre et validation de la gate Docker 100% verte. _(CAP-4)_

### NonFunctional Requirements

NFR1: Dark-first uniquement — aucun thème clair ; orange Ubuntu = unique accent héros.
NFR2: Aucune valeur de couleur/espace/rayon hardcodée ; tout passe par les tokens.
NFR3: Port, pas copie — recréation en Vue 3 `<script setup>` + SCSS `@use` (jamais `@import`).
NFR4: Compatibilité prerender — tout passe `nuxi generate`, accès DOM gardés.
NFR5: Déploiement préservé — `CNAME` + chaîne `yarn generate` → `gh-pages` non régressés.
NFR6: Langue & voix — français, 1re personne « je », vouvoiement, pas d'emoji.
NFR7: Typo signature — Ubuntu Mono (titres/labels/code), Ubuntu sans (corps long).
NFR8: Séquencement — la migration (FR1) doit être livrée et verte avant FR2+.
NFR9: Easter-egg terminal préservé — aucune commande existante cassée.
NFR10: Isolement Git — le développement de l'Epic 11 s'exécute sur une branche dédiée issue de `develop` (ex. `feat/home-awwwards`), préservant la branche `main` de production.
NFR11: Alignement commercial & Malt strict — aucun élément de WordPress, PHP legacy ou QA manuelle en offre de premier niveau sur la home ; harmonisation intégrale avec `docs/contexte_malt.md` et `docs/direction_strategique_site.md`.
NFR12: Fiabilité des liens et accessibilité — zéro lien externe mort (TryOn sans lien 404), balisage systématique de tout lien externe via `<ZExternalLink>`, et respect des standards a11y (titres, listes, contrastes, motion réduit).
NFR13: Sobriété & Zéro Emoji — aucun emoji dans les contenus et composants (NFR6), aucun visuel générique d'IA (pas de robots, cerveaux lumineux ou gradients néon SaaS).
NFR14: Confidentialité & Propriété intellectuelle — respect strict des dépôts privés (`zohac/*`), aucun lien sortant 404, mention transparente des statuts réels.
NFR15: Exécution Docker stricte — toute compilation et validation de gate s'effectue dans le conteneur Docker.
NFR16: Performance SSG & Zéro régression — génération statique Nitro préservée avec 13 routes pré-rendues.
NFR17: Exécution stricte de la suite de validation dans l'environnement Docker (`pnpm lint`, `pnpm typecheck`, `pnpm generate`).
NFR18: Zéro emoji dans les libellés, composants ou infobulles du sélecteur de thème (règle NFR6).
NFR19: Sanctuarisation absolue du terminal (Terminal Hero et fenêtres flottantes conservent impérativement leur fond sombre aubergine `#2E0024` et leurs couleurs syntaxiques).
NFR20: Compatibilité SSG totale sous GitHub Pages sans dépendance dynamique serveur.
18--              <div class="offer__price">
19--                <span>{{ service.price }}</span>
20--              </div>
21:-              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
22--                En savoir plus →
23:+              <NuxtLink to="/services" class="offer__more" :aria-label="service.actionText">
24-+                {{ service.actionText }}
25-               </NuxtLink>
26-             </ZCard>
--
28-         </ul>
29-+
30-+        <!-- Encart de réassurance désancrage tarifaire (Story 15.1 / AC-3) -->
31:+        <div class="services-reassurance">
32:+          <p class="services-reassurance__text">
33-+            <strong>Un besoin simple ne nécessite pas forcément un gros projet.</strong>
34-+            Je dimensionne la solution selon le workflow réel : parfois quelques automatisations suffisent ; parfois il
35-+            faut construire un système métier complet.
--
88- }
89- 
90--.offer__price {
91:+.offer__more {
92-   margin-top: auto;
93-   padding-top: var(--space-4);
94-   border-top: 1px dashed var(--border-subtle);
--
97--  color: var(--accent);
98--}
99--
100:-.offer__more {
101--  margin-top: var(--space-3);
102--  font-family: var(--font-mono);
103-   font-size: var(--fs-sm);
--
108- }
109- 
110-+// ---- Encart de Réassurance Désancrage Tarifaire (Story 15.1 / AC-3) ----
111:+.services-reassurance {
112-+  margin-top: var(--space-6);
113-+  padding: var(--space-5) var(--space-6);
114-+  background: var(--surface-1);
--
117-+  box-shadow: var(--shadow-1);
118-+}
119-+
120:+.services-reassurance__text {
121-+  max-width: 80ch;
122-+  margin: 0;
123-+  font-family: var(--font-sans);

codex
La comparaison ne révèle pas d’écart fonctionnel évident sur AC-1 à AC-3 : les prix sont retirés, les trois libellés contextuels et le lien de carte sont conservés, et l’encart utilise bien les tokens requis. Je vérifie encore les contraintes transverses et les preuves de validation avant de conclure.
exec
/bin/zsh -lc "nl -ba docs/implementation-artifacts/code-reviews/15-1/full.diff | sed -n '1,150p'; nl -ba app/pages/index.vue | sed -n '65,100p;710,780p'; nl -ba docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md | sed -n '18,82p'; nl -ba docs/jouan-ovh-offre-commerciale-v1.1-updated.md | sed -n '1128,1185p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	diff --git a/app/pages/index.vue b/app/pages/index.vue
     2	index 3c147fc..ce69ab7 100644
     3	--- a/app/pages/index.vue
     4	+++ b/app/pages/index.vue
     5	@@ -52,7 +52,7 @@
     6	       </div>
     7	     </section>
     8	 
     9	-    <!-- Vitrine des 3 services cibles (Story 12.3 / AC-1) -->
    10	+    <!-- Vitrine des 3 services cibles (Story 12.3 / AC-1 & Story 15.1 / AC-1, AC-2, AC-3) -->
    11	     <section class="section">
    12	       <div class="container">
    13	         <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
    14	@@ -77,15 +77,21 @@
    15	                   <ZTag>{{ tag }}</ZTag>
    16	                 </li>
    17	               </ul>
    18	-              <div class="offer__price">
    19	-                <span>{{ service.price }}</span>
    20	-              </div>
    21	-              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
    22	-                En savoir plus →
    23	+              <NuxtLink to="/services" class="offer__more" :aria-label="service.actionText">
    24	+                {{ service.actionText }}
    25	               </NuxtLink>
    26	             </ZCard>
    27	           </li>
    28	         </ul>
    29	+
    30	+        <!-- Encart de réassurance désancrage tarifaire (Story 15.1 / AC-3) -->
    31	+        <div class="services-reassurance">
    32	+          <p class="services-reassurance__text">
    33	+            <strong>Un besoin simple ne nécessite pas forcément un gros projet.</strong>
    34	+            Je dimensionne la solution selon le workflow réel : parfois quelques automatisations suffisent ; parfois il
    35	+            faut construire un système métier complet.
    36	+          </p>
    37	+        </div>
    38	       </div>
    39	     </section>
    40	 
    41	@@ -323,7 +329,7 @@ interface HomeServiceOffer {
    42	   desc: string;
    43	   points: string[];
    44	   tags: string[];
    45	-  price: string;
    46	+  actionText: string;
    47	   featured: boolean;
    48	 }
    49	 
    50	@@ -334,7 +340,7 @@ interface ProductionPillar {
    51	   desc: string;
    52	 }
    53	 
    54	-// Vitrine des 3 offres ciblées Systèmes IA & Automatisation (Story 12.3 / AC-1).
    55	+// Vitrine des 3 offres ciblées Systèmes IA & Automatisation (Story 12.3 / AC-1 & Story 15.1 / AC-1, AC-2).
    56	 const services: HomeServiceOffer[] = [
    57	   {
    58	     id: "automation",
    59	@@ -348,7 +354,7 @@ const services: HomeServiceOffer[] = [
    60	       "Synchronisation d'outils métier & reporting",
    61	     ],
    62	     tags: ["Workflow", "APIs", "Automation", "PostgreSQL"],
    63	-    price: "À partir de 3 500 € HT",
    64	+    actionText: "Voir les types d'automatisation →",
    65	     featured: false,
    66	   },
    67	   {
    68	@@ -363,7 +369,7 @@ const services: HomeServiceOffer[] = [
    69	       "Supervision humaine obligatoire (Human-in-the-loop)",
    70	     ],
    71	     tags: ["Agents IA", "LLM", "MCP", "Human-in-the-loop"],
    72	-    price: "À partir de 3 500 € HT",
    73	+    actionText: "Voir quand utiliser un agent →",
    74	     featured: true,
    75	   },
    76	   {
    77	@@ -378,7 +384,7 @@ const services: HomeServiceOffer[] = [
    78	       "Architecture PostgreSQL, tests QA & déploiement",
    79	     ],
    80	     tags: ["TypeScript", "Nuxt", "NestJS", "PostgreSQL", "Tauri"],
    81	-    price: "Sur mesure / Sprint",
    82	+    actionText: "Découvrir les projets sur mesure →",
    83	     featured: false,
    84	   },
    85	 ];
    86	@@ -707,18 +713,11 @@ usePageSeo({
    87	   margin-bottom: var(--space-4);
    88	 }
    89	 
    90	-.offer__price {
    91	+.offer__more {
    92	   margin-top: auto;
    93	   padding-top: var(--space-4);
    94	   border-top: 1px dashed var(--border-subtle);
    95	   font-family: var(--font-mono);
    96	-  font-size: var(--fs-xs);
    97	-  color: var(--accent);
    98	-}
    99	-
   100	-.offer__more {
   101	-  margin-top: var(--space-3);
   102	-  font-family: var(--font-mono);
   103	   font-size: var(--fs-sm);
   104	   color: var(--accent);
   105	   text-decoration: none;
   106	@@ -742,6 +741,30 @@ usePageSeo({
   107	   }
   108	 }
   109	 
   110	+// ---- Encart de Réassurance Désancrage Tarifaire (Story 15.1 / AC-3) ----
   111	+.services-reassurance {
   112	+  margin-top: var(--space-6);
   113	+  padding: var(--space-5) var(--space-6);
   114	+  background: var(--surface-1);
   115	+  border: 1px solid var(--border-subtle);
   116	+  border-radius: var(--radius-md);
   117	+  box-shadow: var(--shadow-1);
   118	+}
   119	+
   120	+.services-reassurance__text {
   121	+  max-width: 80ch;
   122	+  margin: 0;
   123	+  font-family: var(--font-sans);
   124	+  font-size: var(--fs-sm);
   125	+  line-height: var(--lh-relaxed);
   126	+  color: var(--text-body);
   127	+
   128	+  strong {
   129	+    font-weight: var(--fw-medium);
   130	+    color: var(--text-strong);
   131	+  }
   132	+}
   133	+
   134	 // ---- Bloc Différenciateur « Prototype → Production » (Story 12.3 / AC-2) ----
   135	 .diff-block__title {
   136	   max-width: 28ch;
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
    80	              <NuxtLink to="/services" class="offer__more" :aria-label="service.actionText">
    81	                {{ service.actionText }}
    82	              </NuxtLink>
    83	            </ZCard>
    84	          </li>
    85	        </ul>
    86	
    87	        <!-- Encart de réassurance désancrage tarifaire (Story 15.1 / AC-3) -->
    88	        <div class="services-reassurance">
    89	          <p class="services-reassurance__text">
    90	            <strong>Un besoin simple ne nécessite pas forcément un gros projet.</strong>
    91	            Je dimensionne la solution selon le workflow réel : parfois quelques automatisations suffisent ; parfois il
    92	            faut construire un système métier complet.
    93	          </p>
    94	        </div>
    95	      </div>
    96	    </section>
    97	
    98	    <!-- Bloc différenciateur « Prototype → Production » (Story 12.3 / AC-2) -->
    99	    <section class="section diff-block">
   100	      <div class="container">
   710	}
   711	
   712	.offer__tags {
   713	  margin-bottom: var(--space-4);
   714	}
   715	
   716	.offer__more {
   717	  margin-top: auto;
   718	  padding-top: var(--space-4);
   719	  border-top: 1px dashed var(--border-subtle);
   720	  font-family: var(--font-mono);
   721	  font-size: var(--fs-sm);
   722	  color: var(--accent);
   723	  text-decoration: none;
   724	
   725	  &::after {
   726	    position: absolute;
   727	    inset: 0;
   728	    content: "";
   729	  }
   730	
   731	  &:hover {
   732	    text-decoration: underline;
   733	  }
   734	
   735	  &:focus-visible {
   736	    // Outline transparent : rendu en couleur système sous forced-colors.
   737	    outline: 2px solid transparent;
   738	    outline-offset: 2px;
   739	    box-shadow: var(--ring-accent);
   740	    border-radius: var(--radius-xs);
   741	  }
   742	}
   743	
   744	// ---- Encart de Réassurance Désancrage Tarifaire (Story 15.1 / AC-3) ----
   745	.services-reassurance {
   746	  margin-top: var(--space-6);
   747	  padding: var(--space-5) var(--space-6);
   748	  background: var(--surface-1);
   749	  border: 1px solid var(--border-subtle);
   750	  border-radius: var(--radius-md);
   751	  box-shadow: var(--shadow-1);
   752	}
   753	
   754	.services-reassurance__text {
   755	  max-width: 80ch;
   756	  margin: 0;
   757	  font-family: var(--font-sans);
   758	  font-size: var(--fs-sm);
   759	  line-height: var(--lh-relaxed);
   760	  color: var(--text-body);
   761	
   762	  strong {
   763	    font-weight: var(--fw-medium);
   764	    color: var(--text-strong);
   765	  }
   766	}
   767	
   768	// ---- Bloc Différenciateur « Prototype → Production » (Story 12.3 / AC-2) ----
   769	.diff-block__title {
   770	  max-width: 28ch;
   771	  margin-bottom: var(--space-4);
   772	}
   773	
   774	.diff-block__lead {
   775	  max-width: 72ch;
   776	  margin: 0 0 var(--space-8);
   777	  font-size: var(--fs-md);
   778	  line-height: var(--lh-relaxed);
   779	  color: var(--text-body);
   780	}
    18	
    19	1. **Given** la section expertises de `app/pages/index.vue`
    20	   **When** le visiteur consulte les 3 cartes de services (`services`)
    21	   **Then** la propriété `price: "À partir de 3 500 € HT"` est intégralement retirée des données des cartes *Automatisation de processus métier* et *Agents IA intégrés à vos outils*
    22	   **And** l'élément `.offer__price` affichant ce montant est supprimé du template HTML pour éliminer tout ancrage tarifaire public à 3 500 € HT.
    23	
    24	2. **Given** les 3 cartes de services de la homepage dans `app/pages/index.vue`
    25	   **When** le visiteur lit le bas de chaque carte
    26	   **Then** le lien générique `En savoir plus →` est remplacé par un lien d'exploration contextuel ciblant `/services` spécifique à chaque offre :
    27	     - *Automatisation de processus métier :* `Voir les types d'automatisation →`
    28	     - *Agents IA intégrés à vos outils :* `Voir quand utiliser un agent →`
    29	     - *Applications IA sur mesure :* `Découvrir les projets sur mesure →`
    30	   **And** chaque lien conserve l'attribut `:aria-label` accessible explicite et le pseudo-élément étendu `&::after` rendant toute la carte cliquable.
    31	
    32	3. **Given** la section des expertises ou sa transition vers le bloc différenciateur dans `app/pages/index.vue`
    33	   **When** l'utilisateur parcourt la zone
    34	   **Then** un bloc ou paragraphe de réassurance sobre inspiré du terminal est affiché :
    35	     > *« Un besoin simple ne nécessite pas forcément un gros projet. Je dimensionne la solution selon le workflow réel : parfois quelques automatisations suffisent ; parfois il faut construire un système métier complet. »*
    36	   **And** la mise en forme utilise une bordure subtile (`var(--border-subtle)`), une couleur de texte secondaire (`var(--text-muted)` ou `var(--text-body)`), et respecte la parité des thèmes sombre et clair.
    37	
    38	4. **Given** les exigences d'accessibilité (a11y), responsive et qualité globale
    39	   **When** la page d'accueil est affichée sur mobile (< 900px, < 680px), sur desktop ou naviguée au clavier
    40	   **Then** aucun emoji n'est présent dans l'interface ou les textes (NFR6)
    41	   **And** le focus clavier (`Tab`) met en évidence les liens contextuels avec l'outline accessible (`:focus-visible`)
    42	   **And** la suite de validation Docker Nitro SSG s'exécute avec 100% de succès :
    43	     ```sh
    44	     docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
    45	     ```
    46	
    47	## Tasks / Subtasks
    48	
    49	- [x] Tâche 1 — Mise à jour des données et suppression des prix dans `app/pages/index.vue` (AC: 1, 2)
    50	  - [x] Modifier l'interface `HomeServiceOffer` dans `<script setup>` pour ajouter `actionText: string` et retirer `price?: string`.
    51	  - [x] Mettre à jour le tableau `services` :
    52	    - *Automatisation :* retirer `price: "À partir de 3 500 € HT"`, ajouter `actionText: "Voir les types d'automatisation →"`
    53	    - *Agents IA :* retirer `price: "À partir de 3 500 € HT"`, ajouter `actionText: "Voir quand utiliser un agent →"`
    54	    - *Applications sur mesure :* retirer `price: "Sur mesure / Sprint"`, ajouter `actionText: "Découvrir les projets sur mesure →"`
    55	  - [x] Supprimer le bloc `<div class="offer__price">` du template et afficher `service.actionText` dans le `<NuxtLink class="offer__more">`.
    56	
    57	- [x] Tâche 2 — Intégration du composant / bloc de réassurance (AC: 3)
    58	  - [x] Insérer l'encart de réassurance sous la grille des services `.grid-3` ou en amont du bloc `.diff-block` dans `app/pages/index.vue`.
    59	  - [x] Styliser l'encart avec les tokens SCSS (`var(--space-*)`, `var(--radius-*)`, `var(--border-subtle)`, `var(--surface-sunken)` ou `var(--surface-card)`).
    60	  - [x] Vérifier la lisibilité sur thème sombre aubergine et thème clair technique.
    61	
    62	- [x] Tâche 3 — Nettoyage SCSS et vérification a11y & responsive (AC: 2, 4)
    63	  - [x] Adapter la règle `.offer__more` pour qu'elle assure la séparation visuelle supérieure précédemment portée par `.offer__price` (`margin-top: auto; padding-top: var(--space-4); border-top: 1px dashed var(--border-subtle);`).
    64	  - [x] Nettoyer la classe `.offer__price` devenue obsolète.
    65	  - [x] Valider l'adaptation responsive sur petit écran.
    66	
    67	- [x] Tâche 4 — Validation Docker Nitro SSG (AC: 4)
    68	  - [x] Exécuter la commande `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
    69	  - [x] Valider 0 erreur ESLint / Stylelint, 0 erreur TypeScript et 13 routes statiques générées.
    70	
    71	## Dev Notes
    72	
    73	### Contexte & Guardrails
    74	- **Fichier unique à modifier :** [`app/pages/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue).
    75	- **Zéro Emoji :** Règle NFR6 absolue. Les puces et icônes passent par `<ZIcon>` ou du pur CSS.
    76	- **Tokens uniquement :** Consommer les variables de design system `var(--token)`.
    77	- **Règle Docker :** Ne JAMAIS lancer `pnpm` sur l'hôte macOS arm64.
    78	
    79	### Structure Actuelle de la Carte dans `index.vue`
    80	```vue
    81	<ZCard class="offer" interactive tilt :accent="service.featured" :featured="service.featured">
    82	  <div class="offer__top">
  1128	   - CTA ;
  1129	   - libellés de prix ;
  1130	   - éventuels textes associés à l'offre.
  1131	5. Supprimer les prix `À partir de 3 500 € HT` des cartes publiques concernées.
  1132	6. Ne pas remplacer ces prix par un prix plus bas.
  1133	7. Ne pas créer une grille SaaS rigide.
  1134	8. Présenter :
  1135	   - Automatisation ciblée ;
  1136	   - Workflow métier ;
  1137	   - Système métier sur mesure ;
  1138	   comme trois niveaux d'intervention.
  1139	9. Conserver AI Care comme offre d'exploitation séparée.
  1140	10. Garder le Blueprint comme option de cadrage complexe, pas comme offre cœur.
  1141	11. Réutiliser les composants existants autant que possible.
  1142	12. Ne pas inventer :
  1143	   - ROI ;
  1144	   - résultats ;
  1145	   - témoignages ;
  1146	   - clients ;
  1147	   - prix supplémentaires ;
  1148	   - fonctionnalités.
  1149	13. Conserver les preuves existantes :
  1150	   - Keova Signal ;
  1151	   - Debrief ;
  1152	   - Devis-Assist.
  1153	14. Lancer les vérifications disponibles :
  1154	   - lint ;
  1155	   - typecheck ;
  1156	   - tests ;
  1157	   - build.
  1158	15. Vérifier mobile et desktop.
  1159	16. Fournir à la fin :
  1160	   - fichiers modifiés ;
  1161	   - textes remplacés ;
  1162	   - décisions prises ;
  1163	   - commandes exécutées ;
  1164	   - éventuels points restant à valider.
  1165	
  1166	---
  1167	
  1168	# 24. Critères d'acceptation
  1169	
  1170	La mise à jour est réussie si :
  1171	
  1172	- [ ] aucun `À partir de 3 500 € HT` n'est affiché sur les cartes Automatisation / Agents IA ;
  1173	- [ ] le site ne donne plus l'impression que toute intervention coûte au minimum 3 500 € ;
  1174	- [ ] l'offre distingue clairement automatisation ciblée, workflow métier et système métier ;
  1175	- [ ] le Workflow métier reste visuellement identifiable comme offre cœur ;
  1176	- [ ] aucune offre low-cost artificielle n'est créée ;
  1177	- [ ] aucun prix fictif n'est ajouté ;
  1178	- [ ] le Diagnostic reste accessible ;
  1179	- [ ] le Blueprint devient secondaire / optionnel ;
  1180	- [ ] AI Care reste séparé du build ;
  1181	- [ ] `À partir de 250 € HT / mois` reste affiché pour AI Care ;
  1182	- [ ] le CTA principal parle toujours d'un workflow ou processus ;
  1183	- [ ] le discours reste centré sur le problème métier ;
  1184	- [ ] le Full Stack reste une preuve de capacité et non le produit principal ;
  1185	- [ ] la DA actuelle est conservée ;

2026-09-18T17:12:50.273080Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
- **Section eyebrow remains semantically incorrect** — Violates the project a11y constraint requiring section-opening eyebrows to use `<h2 class="eyebrow">`; the touched services section still uses `<p class="eyebrow">` ([full.diff:13](/Users/simon/dev/jouan.ovh/docs/implementation-artifacts/code-reviews/15-1/full.diff:13), [AGENTS.md](/Users/simon/dev/jouan.ovh/AGENTS.md)).
- **Docker validation is not independently evidenced** — AC-4 requires a successful Docker lint/typecheck/generate run, but the diff contains no command output or generated-artifact evidence; success appears only as an unchecked claim in the story record ([story:67-69](/Users/simon/dev/jouan.ovh/docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:67)).
tokens used
49 703
- **Section eyebrow remains semantically incorrect** — Violates the project a11y constraint requiring section-opening eyebrows to use `<h2 class="eyebrow">`; the touched services section still uses `<p class="eyebrow">` ([full.diff:13](/Users/simon/dev/jouan.ovh/docs/implementation-artifacts/code-reviews/15-1/full.diff:13), [AGENTS.md](/Users/simon/dev/jouan.ovh/AGENTS.md)).
- **Docker validation is not independently evidenced** — AC-4 requires a successful Docker lint/typecheck/generate run, but the diff contains no command output or generated-artifact evidence; success appears only as an unchecked claim in the story record ([story:67-69](/Users/simon/dev/jouan.ovh/docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md:67)).
