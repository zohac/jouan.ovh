Reading additional input from stdin...
2026-09-13T08:01:51.381199Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: high
reasoning summaries: none
session id: 01a099c9-742b-7182-a94f-fc97f56ab3d4
--------
user
# Blind Hunter Prompt — Story 10.3

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/10-3/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.
warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
I’m using the `bmad-review-adversarial-general` skill to inspect the diff skeptically and produce at least ten description-only findings.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/bmad-review-adversarial-general/SKILL.md && printf '\\n--- DIFF ---\\n' && sed -n '1,260p' docs/implementation-artifacts/code-reviews/10-3/full.diff" in /Users/simon/dev/jouan.ovh
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
diff --git a/app/components/ui/ZExternalLink.vue b/app/components/ui/ZExternalLink.vue
new file mode 100644
index 0000000..e13eaa5
--- /dev/null
+++ b/app/components/ui/ZExternalLink.vue
@@ -0,0 +1,38 @@
+<template>
+  <a :href="href" target="_blank" :rel="computedRel" :class="className">
+    <slot />
+    <span class="screen-reader-text">{{ computedSrText }}</span>
+  </a>
+</template>
+
+<script setup lang="ts">
+// Primitive lien externe accessible (DS) — force target="_blank", rel sécurisé ("noopener" ou custom),
+// et adjoint un libellé sr-only « (ouvre dans un nouvel onglet) » sans impacter le rendu visuel.
+// (Story 10.3 — WCAG G201 / FR13).
+import { computed } from "vue";
+
+interface Props {
+  /** URL externe cible. */
+  href: string;
+  /**
+   * Relation de lien. Par défaut "noopener" (sécurité window.opener).
+   * Peut être étendu à "noopener noreferrer" si nécessaire.
+   * @default "noopener"
+   */
+  rel?: string;
+  /** Classe CSS optionnelle à appliquer sur l'ancre <a>. */
+  class?: string;
+  /** Libellé accessible alternatif pour l'annonce sr-only. */
+  srText?: string;
+}
+
+const props = withDefaults(defineProps<Props>(), {
+  rel: "noopener",
+  class: undefined,
+  srText: " (ouvre dans un nouvel onglet)",
+});
+
+const className = computed(() => props.class);
+const computedRel = computed(() => props.rel || "noopener");
+const computedSrText = computed(() => props.srText);
+</script>
diff --git a/app/components/FooterComponent.vue b/app/components/FooterComponent.vue
index 920757b..418772b 100644
--- a/app/components/FooterComponent.vue
+++ b/app/components/FooterComponent.vue
@@ -17,14 +17,13 @@
 
         <div class="ftr__col">
           <h2 class="ftr__title">// Projets</h2>
-          <a
+          <ZExternalLink
             v-for="project in projects"
             :key="project.url"
             :href="project.url"
-            target="_blank"
             rel="noopener noreferrer"
             class="ftr__link"
-            >{{ project.name }}</a
+            >{{ project.name }}</ZExternalLink
           >
         </div>
 
diff --git a/app/components/HexagonLinkComponent.vue b/app/components/HexagonLinkComponent.vue
index 12765e5..edf089c 100644
--- a/app/components/HexagonLinkComponent.vue
+++ b/app/components/HexagonLinkComponent.vue
@@ -1,7 +1,9 @@
 <template>
   <a class="hex" :href="link" target="_blank" rel="noopener noreferrer">
     <slot name="icon" />
-    <span class="hex__label"><slot name="title" /></span>
+    <span class="hex__label"
+      ><slot name="title" /><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></span
+    >
   </a>
 </template>
 
diff --git a/app/pages/about.vue b/app/pages/about.vue
index e9f299f..997bc7f 100644
--- a/app/pages/about.vue
+++ b/app/pages/about.vue
@@ -31,7 +31,7 @@
             </p>
             <p class="prose about__para">
               Je suis aussi fondateur du SaaS
-              <a href="https://keova.app" target="_blank" rel="noreferrer">keova.app</a>, et j'aime mettre l'IA au
+              <ZExternalLink href="https://keova.app" rel="noopener">keova.app</ZExternalLink>, et j'aime mettre l'IA au
               service du code — agents, automatisations, intégrations LLM.
             </p>
 
diff --git a/docs/implementation-artifacts/10-3-liens-externes-accessibles.md b/docs/implementation-artifacts/10-3-liens-externes-accessibles.md
index db8c8ac..eff4049 100644
--- a/docs/implementation-artifacts/10-3-liens-externes-accessibles.md
+++ b/docs/implementation-artifacts/10-3-liens-externes-accessibles.md
@@ -4,7 +4,7 @@ baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
 
 # Story 10.3: Liens externes accessibles (helper + audit `target="_blank"`)
 
-Status: ready-for-dev
+Status: review
 
 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
 
@@ -23,19 +23,19 @@ so that je ne suis pas désorienté par un changement de contexte (FR13, WCAG G2
 
 ## Tasks / Subtasks
 
-- [ ] Tâche 1 — Factoriser le helper de lien externe (AC: #1)
-  - [ ] Créer un mécanisme unique réutilisable : soit un **composant** `app/components/ui/ZExternalLink.vue` (ou `app/components/ExternalLinkComponent.vue` selon le nommage retenu), soit un **petit utilitaire/snippet sr-only** partagé. Décision à consigner. Le helper fournit : `rel="noopener"` (a minima ; `noopener noreferrer` selon le cas), `target="_blank"`, et un **libellé sr-only** « (ouvre dans un nouvel onglet) » réutilisant la classe existante `.screen-reader-text` (déjà utilisée `index.vue:121`). Optionnellement une icône « lien externe » (`ZIcon`) décorative `aria-hidden`.
-  - [ ] Le helper doit composer avec les usages existants (lien texte, carte cliquable, hexagone) sans casser le style — vérifier qu'il n'impose pas de wrapper cassant la mise en page.
-- [ ] Tâche 2 — Auditer et migrer TOUS les `target="_blank"` (AC: tout)
-  - [ ] Inventaire `grep -rn 'target="_blank"' app/` (4 occurrences au baseline) et migration via le helper :
-    - **`app/components/HexagonLinkComponent.vue:2`** — `target="_blank" rel="noopener noreferrer"`, **sans** libellé sr-only → ajouter l'indication « nouvel onglet » (les hexagones sociaux n'ont qu'un `aria-label` ?). Vérifier le nom accessible (réseau social) + sr-only onglet.
-    - **`app/components/FooterComponent.vue:24`** — `target="_blank"` → vérifier `rel` + ajouter sr-only.
-    - **`app/pages/index.vue:110`** — carte projet : **déjà** dotée du sr-only (`index.vue:121`, fix 3.3). L'aligner sur le helper pour cohérence (pas de régression).
-    - **`app/pages/about.vue:34`** — `keova.app` `target="_blank" rel="noreferrer"` → passer `rel` à `noopener` (sécurité) + ajouter sr-only via le helper.
-  - [ ] Vérifier qu'**aucun** `target="_blank"` ne subsiste sans helper/sr-only (`grep` final).
-- [ ] Tâche 3 — Validation (AC: tout)
-  - [ ] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts.
-  - [ ] Vérif navigateur (Chrome DevTools MCP) : nom accessible de chaque lien externe = libellé + « (ouvre dans un nouvel onglet) » ; **rendu visuel inchangé** (sr-only hors écran) ; focus visible préservé (9.1).
+- [x] Tâche 1 — Factoriser le helper de lien externe (AC: #1)
+  - [x] Créer un mécanisme unique réutilisable : primitive DS `app/components/ui/ZExternalLink.vue` (auto-import sans préfixe). Le helper fournit : `target="_blank"`, `rel="noopener"` (ou personnalisé avec fallback sécurisé), classe CSS forwarded et un libellé sr-only « (ouvre dans un nouvel onglet) » via la classe `.screen-reader-text`.
+  - [x] Le helper compose avec les usages existants sans imposer de wrapper bloquant la mise en page.
+- [x] Tâche 2 — Auditer et migrer TOUS les `target="_blank"` (AC: tout)
+  - [x] Inventaire `grep -rn 'target="_blank"' app/` et migration :
+    - **`app/components/HexagonLinkComponent.vue`** — ajout sr-only « (ouvre dans un nouvel onglet) » dans le slot de nom accessible (`hex__label`).
+    - **`app/components/FooterComponent.vue`** — liens projets migrés vers `<ZExternalLink>`.
+    - **`app/pages/about.vue`** — lien `keova.app` migré vers `<ZExternalLink>`.
+    - **`app/pages/index.vue`** — carte projet `<ZCard>` interactive conservée avec sr-only existant via `.screen-reader-text`.
+  - [x] Vérifier qu'aucun `target="_blank"` non audité / sans sr-only ne subsiste (`grep` final).
+- [x] Tâche 3 — Validation (AC: tout)
+  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` exécuté avec succès (code 0).
+  - [x] Vérification du nom accessible et préservation du rendu visuel.
 
 ## Dev Notes
 
@@ -77,9 +77,25 @@ so that je ne suis pas désorienté par un changement de contexte (FR13, WCAG G2
 ## Dev Agent Record
 
 ### Agent Model Used
+Gemini 2.5 Pro
 
 ### Debug Log References
+- Lint initial ajusté avec Prettier / ESLint.
+- Validation intégrale `pnpm lint && pnpm typecheck && pnpm generate` passée avec succès sous Docker.
 
 ### Completion Notes List
+- Création de la primitive Design System `app/components/ui/ZExternalLink.vue` avec `target="_blank"`, `rel="noopener"` (ou surcharge), slots et mention screen-reader-text.
+- Mise à jour de `app/components/HexagonLinkComponent.vue` pour inclure l'annonce sr-only d'ouverture dans un nouvel onglet pour les réseaux sociaux.
+- Remplacement du lien brut dans `app/components/FooterComponent.vue` par `<ZExternalLink>`.
+- Remplacement du lien keova.app dans `app/pages/about.vue` par `<ZExternalLink>`.
+- Vérification que la carte projet dans `app/pages/index.vue` possède bien déjà le libellé sr-only conforme.
+- Audit exhaustif `grep` de tous les `target="_blank"` du codebase applicatif.
+- Validation Docker réussie (lint, typecheck, build statique Nuxt 4 Nitro).
 
 ### File List
+- `app/components/ui/ZExternalLink.vue` (NEW)
+- `app/components/HexagonLinkComponent.vue` (MODIFIED)
+- `app/components/FooterComponent.vue` (MODIFIED)
+- `app/pages/about.vue` (MODIFIED)
+- `docs/implementation-artifacts/10-3-liens-externes-accessibles.md` (MODIFIED)
+- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 02bb83f..89b39ec 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-12 (Story 10.1 re-review soldée : useSiteUrl origin-only, preuve Chrome DevTools /about+/blog, File List alignée ; 1 différé confirmé → 10.5. Story done)"
+last_updated: "2026-09-13 (Story 10.2 soldée par revue de code : a11y sémantique sur home/services/contact validée, 6 patches appliqués, statut done)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -109,8 +109,8 @@ development_status:
   # Epic 10 — Fin de refonte (a11y résiduel + SEO + RGPD + déploiement prod)
   epic-10: in-progress
   10-1-decision-hebergement-prod-et-derisquage-deploiement: done
-  10-2-a11y-semantique-residuelle: ready-for-dev
-  10-3-liens-externes-accessibles: ready-for-dev
+  10-2-a11y-semantique-residuelle: done
+  10-3-liens-externes-accessibles: in-progress
   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
   10-5-seo-centralise-site-wide: ready-for-dev
   10-6-conformite-legale-rgpd-mentions: ready-for-dev

codex
The diff is readable. I’m checking the surrounding component conventions, accessibility CSS, and the claimed audit/validation evidence so the findings are grounded in actual repository behavior rather than just the patch text.
exec
/bin/zsh -lc "rg -n \"screen-reader-text|target=|ZExternalLink|HexagonLink|ftr__link|class=\\\"hex|srText|defineProps|withDefaults\" app tests test* package.json nuxt.config.* 2>/dev/null" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "sed -n '1,220p' app/components/HexagonLinkComponent.vue; printf '\\n--- footer ---\\n'; sed -n '1,180p' app/components/FooterComponent.vue; printf '\\n--- about ---\\n'; sed -n '1,120p' app/pages/about.vue; printf '\\n--- index relevant ---\\n'; sed -n '80,145p' app/pages/index.vue" in /Users/simon/dev/jouan.ovh
 exited 1 in 0ms:
zsh:1: no matches found: test*

 succeeded in 0ms:
<template>
  <a class="hex" :href="link" target="_blank" rel="noopener noreferrer">
    <slot name="icon" />
    <span class="hex__label"
      ><slot name="title" /><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></span
    >
  </a>
</template>

<script setup lang="ts">
// Lien social en hexagone — motif patrimonial du footer/contact, restylé DS (story 2.8).
// Hexagone via clip-path (cf. kit.css .hex) ; glyphe en currentColor (ZIcon, story 2.7).
defineProps<{
  /** URL externe (réseau social). */
  link: string;
}>();
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) */
.hex {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 53px;
  font-size: 20px; // dimensionne le glyphe ZIcon (1em)
  color: var(--text-muted);
  cursor: pointer;
  background: var(--surface-2);
  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
  transition:
    color var(--dur-base) var(--ease-standard),
    background var(--dur-base) var(--ease-standard);

  &:hover {
    color: var(--ink-on-accent);
    background: var(--accent);
  }

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
}

// Libellé accessible (lecteurs d'écran) — masqué visuellement.
.hex__label {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  white-space: nowrap;
  border: 0;
  clip-path: inset(50%);
}

@media (prefers-reduced-motion: reduce) {
  .hex {
    transition: none;
  }
}
</style>

--- footer ---
<template>
  <footer class="ftr">
    <div class="ftr__container">
      <div class="ftr__in">
        <div class="ftr__brand-col">
          <NuxtLink to="/" class="ftr__brand">
            <ZIcon name="gem" class="ftr__logo" />
            <b>jouan.ovh</b>
          </NuxtLink>
          <p class="ftr__tagline">Développeur web freelance. Valognes, France.</p>
        </div>

        <nav class="ftr__col" aria-label="Navigation du pied de page">
          <h2 class="ftr__title">// Navigation</h2>
          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="ftr__link">{{ item.label }}</NuxtLink>
        </nav>

        <div class="ftr__col">
          <h2 class="ftr__title">// Projets</h2>
          <ZExternalLink
            v-for="project in projects"
            :key="project.url"
            :href="project.url"
            rel="noopener noreferrer"
            class="ftr__link"
            >{{ project.name }}</ZExternalLink
          >
        </div>

        <div class="ftr__col">
          <h2 class="ftr__title">// Réseaux</h2>
          <LinkListComponent />
        </div>
      </div>

      <div class="ftr__bottom">
        <span>© {{ year }} Simon Jouan — jouan.ovh</span>
        <span class="ftr__term">anon.@jouan.ovh:~$ <span class="ftr__cmd">echo "merci de votre visite"</span></span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import LinkListComponent from "~/components/LinkListComponent.vue";
import { SITE } from "~/data/site";

const navItems = [
  { to: "/", label: "Accueil" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "À propos" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

// Projets — source unique `app/data/site.ts` (le footer n'affiche que nom + URL).
const projects = SITE.projects;

const year = new Date().getFullYear();
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis Footer.jsx/kit.css */
.ftr {
  margin-top: auto;
  background: var(--surface-1);
  border-top: 1px solid var(--border-subtle);
  padding: var(--space-12) 0 var(--space-8);
}

.ftr__container {
  width: 100%;
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.ftr__in {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
  align-items: flex-start;
  justify-content: space-between;
}

.ftr__brand-col {
  max-width: 300px;
}

.ftr__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
  text-decoration: none;

  .ftr__logo {
    font-size: 22px;
    color: var(--accent);
  }

  b {
    font-family: var(--font-mono);
    font-size: var(--fs-md);
    font-weight: var(--fw-bold);
    color: var(--text-strong);
  }

  // Lien focusable (logo + nom) : anneau DS cohérent avec le reste du châssis.
  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 2px;
    border-radius: var(--radius-sm);
    box-shadow: var(--ring-accent);
  }
}

.ftr__tagline {
  margin: 0;
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.ftr__col {
  display: flex;
  flex-direction: column;
}

.ftr__title {
  margin: 0 0 var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: var(--fw-regular);
  letter-spacing: var(--ls-wider);
  text-transform: uppercase;
  color: var(--text-muted);
}

.ftr__link {
  display: block;
  padding: var(--space-1) 0;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-body);
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease-standard);

  &:hover {
    color: var(--accent);
  }

  // Anneau de focus DS (les liens du footer n'avaient que l'outline UA par défaut).
  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 2px;
    border-radius: var(--radius-xs);
    box-shadow: var(--ring-accent);
  }
}

.ftr__bottom {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  justify-content: space-between;
  margin-top: var(--space-8);
  padding-top: var(--space-5);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);

  // Contraste (story 9.2) : --text-faint (~3:1 sur la surface footer) → --text-muted
  // pour une ligne de copyright lisible (≥ 4.5:1). Token, pas de couleur en dur.
  color: var(--text-muted);
  border-top: 1px solid var(--border-subtle);
}

.ftr__cmd {
  color: var(--term-green);
}


--- about ---
<template>
  <main class="about">
    <!-- Hero À-propos : portrait + identité (colonne gauche) + bio + stack (colonne droite).
         Porté de About.jsx (section hero) : recréation Vue 3 + tokens, aucune copie JSX.
         La section CV (expériences + formation) suit dans une <section--sunken> (story 5.2). -->
    <section class="section">
      <div class="container">
        <div class="about__grid">
          <!-- Colonne gauche : portrait, identité, localisation, CTA -->
          <div class="about__identity">
            <ZAvatar src="/images/portrait.jpeg" :alt="profile.name" initials="SJ" size="xl" ring />
            <h1 class="about__name">{{ profile.name }}</h1>
            <p class="about__role">{{ profile.role }}</p>
            <p class="prose about__location">
              <ZIcon name="pin" class="about__pin" />
              {{ profile.city }}
            </p>
            <div class="about__cta">
              <ZButton :as="NuxtLink" to="/contact" variant="primary">Me contacter</ZButton>
              <ZButton as="a" :href="`mailto:${profile.email}`" variant="secondary">M'écrire</ZButton>
            </div>
          </div>

          <!-- Colonne droite : eyebrow + bio (1re personne, emphases sur les technologies) + stack -->
          <div class="about__bio">
            <h2 class="eyebrow">// à propos</h2>
            <p class="prose about__para">
              Développeur web freelance, je viens d'un parcours technique (métrologie, instrumentation) avant de
              basculer dans le code. Aujourd'hui je conçois des applications en <strong>PHP/Symfony</strong>, des sites
              <strong>WordPress</strong> sur-mesure, et des produits en <strong>Node.js / Nest.js / Nuxt.js</strong>.
            </p>
            <p class="prose about__para">
              Je suis aussi fondateur du SaaS
              <ZExternalLink href="https://keova.app" rel="noopener">keova.app</ZExternalLink>, et j'aime mettre l'IA au
              service du code — agents, automatisations, intégrations LLM.
            </p>

            <!-- Stack technique (story 5.2) — sous la bio, conforme à About.jsx. ZTag = pill.
                 Liste sémantique (<ul>/<li>) pour annonce « liste de N éléments » aux lecteurs d'écran. -->
            <div class="about__stack">
              <h2 class="eyebrow eyebrow--muted">// stack</h2>
              <ul class="hero__tags">
                <li v-for="skill in skills" :key="skill">
                  <ZTag>{{ skill }}</ZTag>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section CV (story 5.2) : timeline d'expériences (gauche) + formation (droite).
         Porté de About.jsx (2e section--sunken), grille 1.4fr / 0.6fr. -->
    <section class="section section--sunken">
      <div class="container">
        <div class="about__cv">
          <!-- Colonne gauche : timeline d'expériences (la plus récente en haut).
               <ol> : séquence chronologique annoncée comme liste ordonnée aux lecteurs d'écran. -->
          <div>
            <h2 class="eyebrow">// expériences</h2>
            <ol class="tl">
              <li v-for="xp in experiences" :key="xp.org" class="tl__item">
                <div class="tl__date">{{ xp.date }}</div>
                <div class="tl__role">{{ xp.role }}</div>
                <div class="tl__org">{{ xp.org }}</div>
                <div class="tl__desc">{{ xp.desc }}</div>
              </li>
            </ol>
          </div>

          <!-- Colonne droite : formation (une ZCard par diplôme), liste sémantique <ul>/<li>. -->
          <div>
            <h2 class="eyebrow">// formation</h2>
            <ul class="about__degrees">
              <li v-for="degree in degrees" :key="degree.name">
                <ZCard padded>
                  <div class="tl__date">{{ degree.date }}</div>
                  <div class="about__degree-name">{{ degree.name }}</div>
                  <div class="tl__org">{{ degree.school }}</div>
                </ZCard>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Page À-propos — hero portrait + bio + stack (story 5.1/5.2) puis section CV
// (timeline d'expériences + formation, story 5.2). Porté de About.jsx du UI kit :
// hero 2 colonnes (0.8fr identité / 1.2fr bio), section CV 2 colonnes (1.4fr / 0.6fr),
// stack en <ZTag>, formation en <ZCard>. Dark-first, tokens uniquement, prerender-safe.
import { NuxtLink } from "#components";
import { SITE } from "~/data/site";

// Identité + stack — source unique `app/data/site.ts`.
const profile = SITE.profile;
const skills = SITE.skills;

// Expériences (data.js → S.experiences) — de la plus récente à la plus ancienne.
// `org` sert de clé v-for stable (unique).
const experiences = [
  {
    date: "02/2021 — aujourd'hui",
    role: "Testeur QA",
    org: "Linkizz",
    desc: "Tests automatisés — Node.js, TypeScript, TestCafé.",
  },
  {
    date: "05/2020 — 12/2021",
    role: "Développeur Full Stack",
    org: "CINS",
    desc: "PHP/MySQL, Symfony 4/5, Drupal, Prestashop, WordPress, Docker.",
  },
  {
    date: "07/2007 — 05/2019",
    role: "Métrologue",

--- index relevant ---
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
          <li v-for="project in projects" :key="project.url">
            <ZCard class="project" interactive as="a" :href="project.url" target="_blank" rel="noopener noreferrer">
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
              <span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span>
            </ZCard>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Page d'accueil — hero Terminal (A) + aperçu services + stats. Porté de Home.jsx
// (HeroTerminal / ServicesPreview / StatsProjects) du UI kit : recréation Vue 3 +
// tokens (aucune copie JSX). Dark-first, accent orange. (Stories 3.1, 3.2, 3.3)
import { NuxtLink } from "#components";
import { useTerminal } from "~/composables/useTerminal";
import { SITE } from "~/data/site";

// Contenu repris de data.js (window.SITE) — 1re personne, vouvoiement, pas d'emoji.
const tagline = "Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils.";
const tags = ["php", "symfony", "wordpress", "nest.js", "nuxt.js"];

// Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
// (accent + glow). Icônes mappées sur le set ZIcon (wp / code / spark, story 2.7).
// `id` = clé v-for stable (indépendante du contenu affiché), cohérent avec terminalRows.
const services = [
  {
    id: "wordpress",
    icon: "wp",
    title: "WordPress sur-mesure",
    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
    featured: false,
  },
  {

exec
/bin/zsh -lc "rg --files | rg '("'^|/)(package'"\\.json|.*(test|spec).*(ts|js|vue)"'$|.*'"\\.css"'$|.*'"\\.scss"'$|nuxt'"\\.config|eslint|prettier)' | head -200" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
eslint.config.mjs
nuxt.config.ts
package.json
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/tokens/motion.css
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/tokens/fonts.css
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/tokens/elevation.css
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/tokens/colors.css
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/tokens/spacing.css
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/tokens/radius.css
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/tokens/typography.css
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/styles.css
docs/design_system/tokens/motion.css
docs/design_system/tokens/fonts.css
docs/design_system/tokens/elevation.css
docs/design_system/tokens/colors.css
docs/design_system/tokens/spacing.css
docs/design_system/tokens/radius.css
docs/design_system/tokens/typography.css
docs/design_system/styles.css
docs/design_system/ui_kits/jouan-site/kit.css
app/assets/scss/base/_motion.scss
app/assets/scss/base/_layout.scss
app/assets/scss/base/_reset.scss
app/assets/scss/base/_index.scss
app/assets/scss/components/_card.scss
app/assets/scss/components/_list.scss
app/assets/scss/components/_button.scss
app/assets/scss/components/_container.scss
app/assets/scss/components/_index.scss
app/assets/scss/pages/_index.scss
app/assets/scss/main.scss
app/assets/scss/abstract/_color.scss
app/assets/scss/abstract/_root.scss
app/assets/scss/abstract/_space.scss
app/assets/scss/abstract/_function.scss
app/assets/scss/abstract/_box_shadow.scss
app/assets/scss/abstract/_radius.scss
app/assets/scss/abstract/color/_gray_dark.scss
app/assets/scss/abstract/color/_orange_dark.scss
app/assets/scss/abstract/color/_pink.scss
app/assets/scss/abstract/color/_purple.scss
app/assets/scss/abstract/color/_gray.scss
app/assets/scss/abstract/color/_pink_dark.scss
app/assets/scss/abstract/color/_green.scss
app/assets/scss/abstract/color/_orange.scss
app/assets/scss/abstract/color/_yellow.scss
app/assets/scss/abstract/color/_red.scss
app/assets/scss/abstract/color/_blue_dark.scss
app/assets/scss/abstract/color/_purple_dark.scss
app/assets/scss/abstract/color/_blue.scss
app/assets/scss/abstract/color/_yellow_dark.scss
app/assets/scss/abstract/color/_green_dark.scss
app/assets/scss/abstract/color/_red_dark.scss
app/assets/scss/abstract/_animations.scss
app/assets/scss/abstract/_mixin.scss
app/assets/scss/abstract/_typography.scss
app/assets/scss/abstract/_variables.scss
app/assets/scss/abstract/_index.scss
app/assets/scss/abstract/_fonts.scss

exec
/bin/zsh -lc 'git status --short; git diff --check; git log -1 --oneline -- docs/implementation-artifacts/code-reviews/10-3/full.diff' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
 M app/assets/scss/base/_layout.scss
 M app/components/FooterComponent.vue
 M app/components/HexagonLinkComponent.vue
 M app/pages/about.vue
 M app/pages/contact.vue
 M app/pages/index.vue
 M app/pages/services.vue
 M docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md
 M docs/implementation-artifacts/10-3-liens-externes-accessibles.md
 M docs/implementation-artifacts/deferred-work.md
 M docs/implementation-artifacts/sprint-status.yaml
?? app/components/ui/ZExternalLink.vue
?? docs/implementation-artifacts/code-reviews/

exec
/bin/zsh -lc 'rg -n -C 4 "screen-reader-text|sr-only" app docs/design_system app/assets 2>/dev/null' in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "sed -n '1,260p' app/components/ui/ZCard.vue 2>/dev/null || true; rg -n \"defineProps|inheritAttrs|useAttrs|as=|target\" app/components/ui app/components | head -160" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/contact.vue-86-          </div>
app/pages/contact.vue-87-
app/pages/contact.vue-88-          <!-- Colonne droite (story 7.2) : carte infos + carte CTA terminal + hexagones sociaux -->
app/pages/contact.vue-89-          <div class="contact__info">
app/pages/contact.vue:90:            <h2 class="screen-reader-text">Coordonnées et terminal</h2>
app/pages/contact.vue-91-            <!-- Carte infos : email / localisation / disponibilité -->
app/pages/contact.vue-92-            <ZCard class="contact__infocard">
app/pages/contact.vue-93-              <dl class="contact__infolist">
app/pages/contact.vue-94-                <div class="infoitem">
--
app/pages/index.vue-109-                <li v-for="tag in project.tags" :key="tag">
app/pages/index.vue-110-                  <ZTag>{{ tag }}</ZTag>
app/pages/index.vue-111-                </li>
app/pages/index.vue-112-              </ul>
app/pages/index.vue:113:              <span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span>
app/pages/index.vue-114-            </ZCard>
app/pages/index.vue-115-          </li>
app/pages/index.vue-116-        </ul>
app/pages/index.vue-117-      </div>
--
app/assets/scss/base/_reset.scss-558-/* Accessibility
app/assets/scss/base/_reset.scss-559---------------------------------------------- */
app/assets/scss/base/_reset.scss-560-
app/assets/scss/base/_reset.scss-561-/* Text meant only for screen readers. */
app/assets/scss/base/_reset.scss:562:.screen-reader-text {
app/assets/scss/base/_reset.scss-563-  border: 0;
app/assets/scss/base/_reset.scss-564-  clip-path: inset(50%);
app/assets/scss/base/_reset.scss-565-  height: 1px;
app/assets/scss/base/_reset.scss-566-  margin: -1px;
--
app/assets/scss/base/_reset.scss-570-  width: 1px;
app/assets/scss/base/_reset.scss-571-  overflow-wrap: normal !important;
app/assets/scss/base/_reset.scss-572-}
app/assets/scss/base/_reset.scss-573-
app/assets/scss/base/_reset.scss:574:.screen-reader-text:focus {
app/assets/scss/base/_reset.scss-575-  background-color: #f1f1f1;
app/assets/scss/base/_reset.scss-576-  border-radius: 3px;
app/assets/scss/base/_reset.scss-577-  box-shadow: 0 0 2px 2px rgb(0 0 0 / 60%);
app/assets/scss/base/_reset.scss-578-  clip-path: none;
--
app/assets/scss/base/_reset.scss-558-/* Accessibility
app/assets/scss/base/_reset.scss-559---------------------------------------------- */
app/assets/scss/base/_reset.scss-560-
app/assets/scss/base/_reset.scss-561-/* Text meant only for screen readers. */
app/assets/scss/base/_reset.scss:562:.screen-reader-text {
app/assets/scss/base/_reset.scss-563-  border: 0;
app/assets/scss/base/_reset.scss-564-  clip-path: inset(50%);
app/assets/scss/base/_reset.scss-565-  height: 1px;
app/assets/scss/base/_reset.scss-566-  margin: -1px;
--
app/assets/scss/base/_reset.scss-570-  width: 1px;
app/assets/scss/base/_reset.scss-571-  overflow-wrap: normal !important;
app/assets/scss/base/_reset.scss-572-}
app/assets/scss/base/_reset.scss-573-
app/assets/scss/base/_reset.scss:574:.screen-reader-text:focus {
app/assets/scss/base/_reset.scss-575-  background-color: #f1f1f1;
app/assets/scss/base/_reset.scss-576-  border-radius: 3px;
app/assets/scss/base/_reset.scss-577-  box-shadow: 0 0 2px 2px rgb(0 0 0 / 60%);
app/assets/scss/base/_reset.scss-578-  clip-path: none;
--
app/components/HexagonLinkComponent.vue-1-<template>
app/components/HexagonLinkComponent.vue-2-  <a class="hex" :href="link" target="_blank" rel="noopener noreferrer">
app/components/HexagonLinkComponent.vue-3-    <slot name="icon" />
app/components/HexagonLinkComponent.vue-4-    <span class="hex__label"
app/components/HexagonLinkComponent.vue:5:      ><slot name="title" /><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></span
app/components/HexagonLinkComponent.vue-6-    >
app/components/HexagonLinkComponent.vue-7-  </a>
app/components/HexagonLinkComponent.vue-8-</template>
app/components/HexagonLinkComponent.vue-9-
--
app/components/ui/ZExternalLink.vue-1-<template>
app/components/ui/ZExternalLink.vue-2-  <a :href="href" target="_blank" :rel="computedRel" :class="className">
app/components/ui/ZExternalLink.vue-3-    <slot />
app/components/ui/ZExternalLink.vue:4:    <span class="screen-reader-text">{{ computedSrText }}</span>
app/components/ui/ZExternalLink.vue-5-  </a>
app/components/ui/ZExternalLink.vue-6-</template>
app/components/ui/ZExternalLink.vue-7-
app/components/ui/ZExternalLink.vue-8-<script setup lang="ts">
app/components/ui/ZExternalLink.vue-9-// Primitive lien externe accessible (DS) — force target="_blank", rel sécurisé ("noopener" ou custom),
app/components/ui/ZExternalLink.vue:10:// et adjoint un libellé sr-only « (ouvre dans un nouvel onglet) » sans impacter le rendu visuel.
app/components/ui/ZExternalLink.vue-11-// (Story 10.3 — WCAG G201 / FR13).
app/components/ui/ZExternalLink.vue-12-import { computed } from "vue";
app/components/ui/ZExternalLink.vue-13-
app/components/ui/ZExternalLink.vue-14-interface Props {
--
app/components/ui/ZExternalLink.vue-21-   */
app/components/ui/ZExternalLink.vue-22-  rel?: string;
app/components/ui/ZExternalLink.vue-23-  /** Classe CSS optionnelle à appliquer sur l'ancre <a>. */
app/components/ui/ZExternalLink.vue-24-  class?: string;
app/components/ui/ZExternalLink.vue:25:  /** Libellé accessible alternatif pour l'annonce sr-only. */
app/components/ui/ZExternalLink.vue-26-  srText?: string;
app/components/ui/ZExternalLink.vue-27-}
app/components/ui/ZExternalLink.vue-28-
app/components/ui/ZExternalLink.vue-29-const props = withDefaults(defineProps<Props>(), {

 succeeded in 0ms:
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
app/components/HeaderComponent.vue:29:        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" class="hdr__action">
app/components/HeaderComponent.vue:68:        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" @click="closeMenu">
app/components/ui/ZButton.vue:32:import { computed, useAttrs } from "vue";
app/components/ui/ZButton.vue:35:  inheritAttrs: false,
app/components/ui/ZButton.vue:55:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZButton.vue:64:const attrs = useAttrs();
app/components/ui/ZBadge.vue:19:withDefaults(defineProps<Props>(), {
app/components/ui/ZAvatar.vue:31:const props = withDefaults(defineProps<Props>(), {
app/components/HexagonLinkComponent.vue:2:  <a class="hex" :href="link" target="_blank" rel="noopener noreferrer">
app/components/HexagonLinkComponent.vue:13:defineProps<{
app/components/ui/ZInput.vue:46:import { computed, useAttrs, useId } from "vue";
app/components/ui/ZInput.vue:49:  inheritAttrs: false,
app/components/ui/ZInput.vue:71:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZInput.vue:90:const attrs = useAttrs();
app/components/ui/ZInput.vue:123:  emit("update:modelValue", (event.target as HTMLInputElement | HTMLTextAreaElement).value);
app/components/ui/ZExternalLink.vue:2:  <a :href="href" target="_blank" :rel="computedRel" :class="className">
app/components/ui/ZExternalLink.vue:9:// Primitive lien externe accessible (DS) — force target="_blank", rel sécurisé ("noopener" ou custom),
app/components/ui/ZExternalLink.vue:29:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZIcon.vue:80:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZCard.vue:22:import { computed, useAttrs } from "vue";
app/components/ui/ZCard.vue:25:  inheritAttrs: false,
app/components/ui/ZCard.vue:41:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZCard.vue:49:const attrs = useAttrs();
app/components/ui/ZCard.vue:95:  // (`as="a"`, ex. cartes projet story 3.3), elle est focusable — sans cette règle,
app/components/ui/ZTag.vue:24:import { computed, getCurrentInstance, useAttrs } from "vue";
app/components/ui/ZTag.vue:27:  inheritAttrs: false,
app/components/ui/ZTag.vue:35:withDefaults(defineProps<Props>(), {
app/components/ui/ZTag.vue:44:const attrs = useAttrs();
app/components/terminal/TerminalComponent.vue:77:  defineProps<{
app/components/terminal/TerminalComponent.vue:196:  if (event.target instanceof HTMLElement && event.target.classList.contains("resize-handle")) {
app/components/terminal/TerminalComponent.vue:232:    event.target instanceof HTMLElement &&
app/components/terminal/TerminalComponent.vue:235:    event.target.classList.contains("terminal-header")
app/components/WindowWrapperComponent.vue:111:        event.target instanceof HTMLElement &&
app/components/WindowWrapperComponent.vue:114:        event.target.classList.contains("window-header")
app/components/ui/ZButton.vue:32:import { computed, useAttrs } from "vue";
app/components/ui/ZButton.vue:35:  inheritAttrs: false,
app/components/ui/ZButton.vue:55:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZButton.vue:64:const attrs = useAttrs();
app/components/ui/ZBadge.vue:19:withDefaults(defineProps<Props>(), {
app/components/ui/ZIcon.vue:80:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZAvatar.vue:31:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZCard.vue:22:import { computed, useAttrs } from "vue";
app/components/ui/ZCard.vue:25:  inheritAttrs: false,
app/components/ui/ZCard.vue:41:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZCard.vue:49:const attrs = useAttrs();
app/components/ui/ZCard.vue:95:  // (`as="a"`, ex. cartes projet story 3.3), elle est focusable — sans cette règle,
app/components/ui/ZTag.vue:24:import { computed, getCurrentInstance, useAttrs } from "vue";
app/components/ui/ZTag.vue:27:  inheritAttrs: false,
app/components/ui/ZTag.vue:35:withDefaults(defineProps<Props>(), {
app/components/ui/ZTag.vue:44:const attrs = useAttrs();
app/components/ui/ZInput.vue:46:import { computed, useAttrs, useId } from "vue";
app/components/ui/ZInput.vue:49:  inheritAttrs: false,
app/components/ui/ZInput.vue:71:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZInput.vue:90:const attrs = useAttrs();
app/components/ui/ZInput.vue:123:  emit("update:modelValue", (event.target as HTMLInputElement | HTMLTextAreaElement).value);
app/components/ui/ZExternalLink.vue:2:  <a :href="href" target="_blank" :rel="computedRel" :class="className">
app/components/ui/ZExternalLink.vue:9:// Primitive lien externe accessible (DS) — force target="_blank", rel sécurisé ("noopener" ou custom),
app/components/ui/ZExternalLink.vue:29:const props = withDefaults(defineProps<Props>(), {

exec
/bin/zsh -lc "rg -n 'target=\"_blank\"|target=.?_blank|window\\.open|noopener|noreferrer' --glob '"'!docs/implementation-artifacts/code-reviews/10-3/full.diff'"' --glob 'app/**' ." in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "sed -n '1,220p' nuxt.config.ts; printf '\\n--- package ---\\n'; sed -n '1,220p' package.json; printf '\\n--- lint ---\\n'; sed -n '1,240p' eslint.config.mjs" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
./app/components/FooterComponent.vue:24:            rel="noopener noreferrer"
./app/pages/about.vue:34:              <ZExternalLink href="https://keova.app" rel="noopener">keova.app</ZExternalLink>, et j'aime mettre l'IA au
./app/components/HexagonLinkComponent.vue:2:  <a class="hex" :href="link" target="_blank" rel="noopener noreferrer">
./app/pages/index.vue:102:            <ZCard class="project" interactive as="a" :href="project.url" target="_blank" rel="noopener noreferrer">
./app/components/ui/ZExternalLink.vue:2:  <a :href="href" target="_blank" :rel="computedRel" :class="className">
./app/components/ui/ZExternalLink.vue:9:// Primitive lien externe accessible (DS) — force target="_blank", rel sécurisé ("noopener" ou custom),
./app/components/ui/ZExternalLink.vue:18:   * Relation de lien. Par défaut "noopener" (sécurité window.opener).
./app/components/ui/ZExternalLink.vue:19:   * Peut être étendu à "noopener noreferrer" si nécessaire.
./app/components/ui/ZExternalLink.vue:20:   * @default "noopener"
./app/components/ui/ZExternalLink.vue:30:  rel: "noopener",
./app/components/ui/ZExternalLink.vue:36:const computedRel = computed(() => props.rel || "noopener");

 succeeded in 0ms:
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "..::<sj />::..",
      htmlAttrs: {
        lang: "fr",
      },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        // Ubuntu sans (corps long) — Google Fonts via <link> (pas d'@import SCSS, cf. règle projet).
        // Ubuntu Mono reste self-hosted (abstract/_fonts.scss).
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400;1,700&display=swap",
        },
      ],
      meta: [
        {
          name: "description",
          content:
            "Développeur Fullstack et Testeur/QA freelance passionné par la création de solutions web performantes." +
            " Discutons de votre projet.",
        },
      ],
    },
  },
  css: ["@/assets/scss/main.scss"],
  modules: ["@nuxt/content", "@nuxt/image", "@nuxt/eslint"],
  // @nuxt/content : coloration syntaxique Shiki désactivée. Le DS rend le code en
  // palette terminale UNIFORME (mono off-white sur fond aubergine, vert pour l'inline,
  // cf. kit.css .article .prose pre/code) — pas de multicolore par token, qui injecterait
  // des styles inline écrasant les tokens. Les blocs rendent en <pre><code> nu, stylés en SCSS.
  content: {
    build: {
      markdown: {
        highlight: false,
      },
    },
  },
  // Primitives DS dans components/ui/ auto-importées sans préfixe de dossier
  // (<ZButton> et non <UiZButton>). Le reste de components/ garde le scan par défaut.
  components: [{ path: "~/components/ui", pathPrefix: false }, "~/components"],
  ssr: true,
  // Config exposée au client. La clé d'accès Web3Forms (envoi du formulaire /contact)
  // n'est JAMAIS en dur : fournie par l'env NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY (cf.
  // .env.example). Vide par défaut → le formulaire bascule sur son état d'erreur.
  runtimeConfig: {
    public: {
      web3formsAccessKey: "",
      // URL de production du site (canonical / og:url / JSON-LD). Défaut = staging
      // (dev.jouan.ovh, cf. public/CNAME) ; surchargeable en prod SANS domaine en dur via
      // l'env NUXT_PUBLIC_SITE_URL=https://jouan.ovh (cf. .env.example). Consommée par le
      // composable useSiteUrl(). Valeur inlinée au prerender (`nuxi generate`).
      siteUrl: "https://dev.jouan.ovh",
    },
  },
  // Structure Nuxt 4 par défaut : code applicatif sous app/ (srcDir = "app").
  experimental: {
    payloadExtraction: false,
  },
  // Flat config gérée par @nuxt/eslint ; on laisse Prettier formater (stylistic off).
  eslint: {
    config: {
      stylistic: false,
    },
  },
});

--- package ---
{
  "private": true,
  "packageManager": "pnpm@11.8.0",
  "engines": {
    "node": ">=22.0.0"
  },
  "scripts": {
    "build": "nuxi build",
    "dev": "nuxi dev",
    "generate": "nuxi generate",
    "preview": "nuxi preview",
    "postinstall": "nuxi prepare",
    "lint": "eslint . && stylelint \"app/assets/**/*.scss\" \"app/**/*.vue\"",
    "lint:style": "stylelint \"app/assets/**/*.scss\" \"app/**/*.vue\"",
    "typecheck": "nuxi typecheck",
    "deploy": "push-dir --dir=.output/public --branch=gh-pages --cleanup"
  },
  "devDependencies": {
    "@nuxt/content": "^3.14.0",
    "@nuxt/eslint": "^1.16.0",
    "@nuxt/image": "^2.0.0",
    "autoprefixer": "^10.5.0",
    "better-sqlite3": "^12.5.0",
    "eslint": "^10.5.0",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-prettier": "^5.5.6",
    "nuxt": "^4.4.8",
    "postcss-html": "^1.8.1",
    "prettier": "^3.8.4",
    "push-dir": "^0.4.1",
    "sass": "^1.101.0",
    "stylelint": "^17.13.0",
    "stylelint-config-standard-scss": "^17.0.0",
    "stylelint-scss": "^7.2.0",
    "typescript": "^6.0.3",
    "vue-tsc": "^3.3.5"
  },
  "dependencies": {
    "ua-parser-js": "^2.0.10"
  }
}

--- lint ---
// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

// Flat config ESLint 9/10. La base Nuxt est générée par le module @nuxt/eslint
// (.nuxt/eslint.config.mjs). Nos règles projet sont déclarées d'abord, puis
// Prettier est appliqué EN DERNIER : eslint-plugin-prettier/recommended embarque
// eslint-config-prettier, qui doit primer pour désactiver toute règle de mise en
// forme conflictuelle (best practice flat config).
export default withNuxt(
  {
    // Matériel de référence / outillage hors application — non linté.
    // docs/ contient notamment le design system source en React (.jsx).
    ignores: ["docs/**", "_bmad/**", ".claude/**", ".agents/**"],
  },
  {
    rules: {
      "prefer-const": "error",
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    },
  },
  {
    // Pages, layouts et fichiers racine de l'app : noms à un seul mot autorisés
    // (convention Nuxt). L'exemption auto de @nuxt/eslint ne couvre pas le srcDir
    // app/ ici, on la rétablit explicitement.
    files: ["app/pages/**/*.vue", "app/layouts/**/*.vue", "app/app.vue", "app/error.vue"],
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
  // Prettier en dernier : prime sur toutes les règles de formatage ci-dessus.
  eslintPluginPrettierRecommended,
);

2026-09-13T08:02:19.925320Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "rg -n -C 5 \"<HexagonLinkComponent|<LinkListComponent|slot name=\\\"title\\\"|aria-label\" app/components app/pages | head -260; printf '\\n--- reset accessibility ---\\n'; sed -n '550,590p' app/assets/scss/base/_reset.scss; printf '\\n--- git diff full stat ---\\n'; git diff --stat -- docs/implementation-artifacts/code-reviews/10-3/full.diff; wc -l docs/implementation-artifacts/code-reviews/10-3/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/components/HeaderComponent.vue-4-      <NuxtLink to="/" class="hdr__brand" @click="closeMenu">
app/components/HeaderComponent.vue-5-        <ZIcon name="gem" class="hdr__logo" />
app/components/HeaderComponent.vue-6-        <b>jouan.ovh</b>
app/components/HeaderComponent.vue-7-      </NuxtLink>
app/components/HeaderComponent.vue-8-
app/components/HeaderComponent.vue:9:      <nav class="hdr__nav" aria-label="Navigation principale">
app/components/HeaderComponent.vue-10-        <NuxtLink
app/components/HeaderComponent.vue-11-          v-for="item in navItems"
app/components/HeaderComponent.vue-12-          :key="item.to"
app/components/HeaderComponent.vue-13-          :to="item.to"
app/components/HeaderComponent.vue-14-          class="hdr__link"
--
app/components/HeaderComponent.vue-34-          ref="burgerButton"
app/components/HeaderComponent.vue-35-          class="hdr__burger"
app/components/HeaderComponent.vue-36-          type="button"
app/components/HeaderComponent.vue-37-          :aria-expanded="menuOpen"
app/components/HeaderComponent.vue-38-          aria-controls="hdr-mobile-menu"
app/components/HeaderComponent.vue:39:          :aria-label="menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
app/components/HeaderComponent.vue-40-          @click="toggleMenu"
app/components/HeaderComponent.vue-41-        >
app/components/HeaderComponent.vue-42-          <ZIcon :name="menuOpen ? 'arrow' : 'layers'" />
app/components/HeaderComponent.vue-43-        </button>
app/components/HeaderComponent.vue-44-      </div>
app/components/HeaderComponent.vue-45-    </div>
app/components/HeaderComponent.vue-46-
app/components/HeaderComponent.vue-47-    <!-- Menu mobile -->
app/components/HeaderComponent.vue-48-    <div v-if="menuOpen" class="hdr__overlay" @click="closeMenuAndRefocus" />
app/components/HeaderComponent.vue:49:    <nav id="hdr-mobile-menu" class="hdr__menu" :class="{ 'hdr__menu--open': menuOpen }" aria-label="Navigation mobile">
app/components/HeaderComponent.vue-50-      <NuxtLink
app/components/HeaderComponent.vue-51-        v-for="(item, index) in navItems"
app/components/HeaderComponent.vue-52-        :key="item.to"
app/components/HeaderComponent.vue-53-        :ref="(el) => registerFirstLink(el, index)"
app/components/HeaderComponent.vue-54-        :to="item.to"
--
app/components/LinkListComponent.vue-1-<template>
app/components/LinkListComponent.vue-2-  <ul class="hexrow">
app/components/LinkListComponent.vue-3-    <li v-for="social in socials" :key="social.icon">
app/components/LinkListComponent.vue:4:      <HexagonLinkComponent :link="social.url">
app/components/LinkListComponent.vue-5-        <template #icon><ZIcon :name="social.icon" /></template>
app/components/LinkListComponent.vue-6-        <template #title>{{ social.label }}</template>
app/components/LinkListComponent.vue-7-      </HexagonLinkComponent>
app/components/LinkListComponent.vue-8-    </li>
app/components/LinkListComponent.vue-9-  </ul>
--
app/pages/services.vue-28-              <div class="offer__cta">
app/pages/services.vue-29-                <ZButton
app/pages/services.vue-30-                  :as="NuxtLink"
app/pages/services.vue-31-                  to="/contact"
app/pages/services.vue-32-                  :variant="offer.featured ? 'primary' : 'secondary'"
app/pages/services.vue:33:                  :aria-label="`Discuter du projet — ${offer.title}`"
app/pages/services.vue-34-                  class="offer__btn"
app/pages/services.vue-35-                >
app/pages/services.vue-36-                  Discuter du projet
app/pages/services.vue-37-                </ZButton>
app/pages/services.vue-38-              </div>
--
app/components/FooterComponent.vue-8-            <b>jouan.ovh</b>
app/components/FooterComponent.vue-9-          </NuxtLink>
app/components/FooterComponent.vue-10-          <p class="ftr__tagline">Développeur web freelance. Valognes, France.</p>
app/components/FooterComponent.vue-11-        </div>
app/components/FooterComponent.vue-12-
app/components/FooterComponent.vue:13:        <nav class="ftr__col" aria-label="Navigation du pied de page">
app/components/FooterComponent.vue-14-          <h2 class="ftr__title">// Navigation</h2>
app/components/FooterComponent.vue-15-          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="ftr__link">{{ item.label }}</NuxtLink>
app/components/FooterComponent.vue-16-        </nav>
app/components/FooterComponent.vue-17-
app/components/FooterComponent.vue-18-        <div class="ftr__col">
--
app/components/FooterComponent.vue-27-          >
app/components/FooterComponent.vue-28-        </div>
app/components/FooterComponent.vue-29-
app/components/FooterComponent.vue-30-        <div class="ftr__col">
app/components/FooterComponent.vue-31-          <h2 class="ftr__title">// Réseaux</h2>
app/components/FooterComponent.vue:32:          <LinkListComponent />
app/components/FooterComponent.vue-33-        </div>
app/components/FooterComponent.vue-34-      </div>
app/components/FooterComponent.vue-35-
app/components/FooterComponent.vue-36-      <div class="ftr__bottom">
app/components/FooterComponent.vue-37-        <span>© {{ year }} Simon Jouan — jouan.ovh</span>
--
app/pages/contact.vue-122-                Ouvrir le terminal
app/pages/contact.vue-123-              </ZButton>
app/pages/contact.vue-124-            </ZCard>
app/pages/contact.vue-125-
app/pages/contact.vue-126-            <!-- Hexagones sociaux (composant partagé avec le footer) -->
app/pages/contact.vue:127:            <LinkListComponent />
app/pages/contact.vue-128-          </div>
app/pages/contact.vue-129-        </div>
app/pages/contact.vue-130-      </div>
app/pages/contact.vue-131-    </section>
app/pages/contact.vue-132-  </main>
--
app/components/HexagonLinkComponent.vue-1-<template>
app/components/HexagonLinkComponent.vue-2-  <a class="hex" :href="link" target="_blank" rel="noopener noreferrer">
app/components/HexagonLinkComponent.vue-3-    <slot name="icon" />
app/components/HexagonLinkComponent.vue-4-    <span class="hex__label"
app/components/HexagonLinkComponent.vue:5:      ><slot name="title" /><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></span
app/components/HexagonLinkComponent.vue-6-    >
app/components/HexagonLinkComponent.vue-7-  </a>
app/components/HexagonLinkComponent.vue-8-</template>
app/components/HexagonLinkComponent.vue-9-
app/components/HexagonLinkComponent.vue-10-<script setup lang="ts">
--
app/pages/index.vue-47-                </template>
app/pages/index.vue-48-
app/pages/index.vue-49-                <button
app/pages/index.vue-50-                  type="button"
app/pages/index.vue-51-                  class="hero-term__open"
app/pages/index.vue:52:                  aria-label="Ouvrir le terminal interactif"
app/pages/index.vue-53-                  aria-haspopup="dialog"
app/pages/index.vue-54-                  @click="openTerminal"
app/pages/index.vue-55-                >
app/pages/index.vue-56-                  <span class="prm"
app/pages/index.vue-57-                    ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
--
app/pages/index.vue-75-          <li v-for="service in services" :key="service.id">
app/pages/index.vue-76-            <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
app/pages/index.vue-77-              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
app/pages/index.vue-78-              <h3 class="offer__title">{{ service.title }}</h3>
app/pages/index.vue-79-              <p class="offer__desc">{{ service.desc }}</p>
app/pages/index.vue:80:              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
app/pages/index.vue-81-                En savoir plus →
app/pages/index.vue-82-              </NuxtLink>
app/pages/index.vue-83-            </ZCard>
app/pages/index.vue-84-          </li>
app/pages/index.vue-85-        </ul>
--
app/components/card/ZCardFooter.vue-1-<template>
app/components/card/ZCardFooter.vue-2-  <footer>
app/components/card/ZCardFooter.vue:3:    <LinkListComponent />
app/components/card/ZCardFooter.vue-4-  </footer>
app/components/card/ZCardFooter.vue-5-</template>
app/components/card/ZCardFooter.vue-6-
app/components/card/ZCardFooter.vue-7-<script>
app/components/card/ZCardFooter.vue-8-import LinkListComponent from "~/components/LinkListComponent.vue";
--
app/components/card/ZCardBody.vue-1-<template>
app/components/card/ZCardBody.vue-2-  <section class="content">
app/components/card/ZCardBody.vue:3:    <slot name="title" />
app/components/card/ZCardBody.vue-4-    <slot name="body" />
app/components/card/ZCardBody.vue-5-  </section>
app/components/card/ZCardBody.vue-6-</template>
app/components/card/ZCardBody.vue-7-
app/components/card/ZCardBody.vue-8-<script>
--
app/components/ui/ZIcon.vue-7-    :stroke="def.fill ? undefined : 'currentColor'"
app/components/ui/ZIcon.vue-8-    :stroke-width="def.fill ? undefined : 2"
app/components/ui/ZIcon.vue-9-    stroke-linecap="round"
app/components/ui/ZIcon.vue-10-    stroke-linejoin="round"
app/components/ui/ZIcon.vue-11-    :role="label ? 'img' : undefined"
app/components/ui/ZIcon.vue:12:    :aria-label="label || undefined"
app/components/ui/ZIcon.vue-13-    :aria-hidden="label ? undefined : 'true'"
app/components/ui/ZIcon.vue-14-    v-html="def.body"
app/components/ui/ZIcon.vue-15-  />
app/components/ui/ZIcon.vue-16-  <!-- eslint-enable vue/no-v-html -->
app/components/ui/ZIcon.vue-17-</template>
--
app/components/ui/ZTag.vue-8-    @click="handleClick"
app/components/ui/ZTag.vue-9-    @keydown.enter="handleKeyboardClick"
app/components/ui/ZTag.vue-10-    @keydown.space="handleKeyboardClick"
app/components/ui/ZTag.vue-11-  >
app/components/ui/ZTag.vue-12-    <slot />
app/components/ui/ZTag.vue:13:    <button v-if="isRemovable" type="button" class="ztag__remove" aria-label="Retirer" @click.stop="handleRemove">
app/components/ui/ZTag.vue-14-      ×
app/components/ui/ZTag.vue-15-    </button>
app/components/ui/ZTag.vue-16-  </span>
app/components/ui/ZTag.vue-17-</template>
app/components/ui/ZTag.vue-18-
--
app/components/terminal/TerminalComponent.vue-12-        <div class="terminal-dots">
app/components/terminal/TerminalComponent.vue-13-          <div
app/components/terminal/TerminalComponent.vue-14-            class="close-button"
app/components/terminal/TerminalComponent.vue-15-            role="button"
app/components/terminal/TerminalComponent.vue-16-            tabindex="0"
app/components/terminal/TerminalComponent.vue:17:            aria-label="Fermer le terminal"
app/components/terminal/TerminalComponent.vue-18-            @click="closeTerminal"
app/components/terminal/TerminalComponent.vue-19-            @keydown.enter="closeTerminal"
app/components/terminal/TerminalComponent.vue-20-            @keydown.space.prevent="closeTerminal"
app/components/terminal/TerminalComponent.vue-21-          ></div>
app/components/terminal/TerminalComponent.vue-22-          <span class="terminal-dot terminal-dot--min" aria-hidden="true"></span>
--
app/components/terminal/TerminalComponent.vue-46-        >&nbsp;<input
app/components/terminal/TerminalComponent.vue-47-          ref="userInputRef"
app/components/terminal/TerminalComponent.vue-48-          v-model="userInput"
app/components/terminal/TerminalComponent.vue-49-          type="text"
app/components/terminal/TerminalComponent.vue-50-          class="user-input"
app/components/terminal/TerminalComponent.vue:51:          aria-label="Saisie de commande du terminal"
app/components/terminal/TerminalComponent.vue-52-          @keydown.enter="submitInput"
app/components/terminal/TerminalComponent.vue-53-          @keydown.arrow-up="handleHistoryNavigation"
app/components/terminal/TerminalComponent.vue-54-          @keydown.arrow-down="handleHistoryNavigation"
app/components/terminal/TerminalComponent.vue-55-        />
app/components/terminal/TerminalComponent.vue-56-      </div>

--- reset accessibility ---
.infinity-end.neverending .site-footer {
  display: block;
}

/* --------------------------------------------------------------
# Utilities
-------------------------------------------------------------- */

/* Accessibility
--------------------------------------------- */

/* Text meant only for screen readers. */
.screen-reader-text {
  border: 0;
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute !important;
  width: 1px;
  overflow-wrap: normal !important;
}

.screen-reader-text:focus {
  background-color: #f1f1f1;
  border-radius: 3px;
  box-shadow: 0 0 2px 2px rgb(0 0 0 / 60%);
  clip-path: none;
  color: #21759b;
  display: block;
  font-size: 0.875rem;
  font-weight: 700;
  height: auto;
  left: 5px;
  line-height: normal;
  padding: 15px 23px 14px;
  text-decoration: none;
  top: 5px;
  width: auto;
  z-index: 100000;

--- git diff full stat ---
     189 docs/implementation-artifacts/code-reviews/10-3/full.diff

2026-09-13T08:02:30.571883Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '1,180p' app/data/site.ts; printf '\\n--- all links and external-ish data ---\\n'; rg -n -C 3 \"projects:|socials:|url:\" app/data app | head -240; printf '\\n--- full diff numbered ---\\n'; nl -ba docs/implementation-artifacts/code-reviews/10-3/full.diff | sed -n '1,230p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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
}

export interface IProject {
  name: string;
  role: string;
  desc: string;
  url: string;
  tags: string[];
}

const profile: IProfile = {
  name: "Simon Jouan",
  role: "Développeur web freelance",
  email: "simon@jouan.ovh",
  city: "Valognes, France",
  available: true,
};

// Stack technique — ordre conservé (tags hero de la home = sous-ensemble curé, non dérivé d'ici).
const skills: string[] = [
  "php",
  "symfony",
  "wordpress",
  "node.js",
  "nest.js",
  "nuxt.js",
  "vue",
  "typescript",
  "docker",
  "tailwind",
  "n8n",
  "mysql",
];

const projects: IProject[] = [
  {
    name: "keova.app",
    role: "Fondateur · SaaS",
    desc: "Plateforme SaaS que je conçois et opère de bout en bout.",
    url: "https://keova.app",
    tags: ["nest.js", "nuxt", "saas"],
  },
  {
    name: "patio-conseil.fr",
    role: "Client",
    desc: "Site et outils pour un cabinet de conseil.",
    url: "https://patio-conseil.fr",
    tags: ["wordpress", "conseil"],
  },
];

export const SITE = { profile, skills, projects } as const;

--- all links and external-ish data ---
app/data/site.ts-22-  name: string;
app/data/site.ts-23-  role: string;
app/data/site.ts-24-  desc: string;
app/data/site.ts:25:  url: string;
app/data/site.ts-26-  tags: string[];
app/data/site.ts-27-}
app/data/site.ts-28-
--
app/data/site.ts-50-  "mysql",
app/data/site.ts-51-];
app/data/site.ts-52-
app/data/site.ts:53:const projects: IProject[] = [
app/data/site.ts-54-  {
app/data/site.ts-55-    name: "keova.app",
app/data/site.ts-56-    role: "Fondateur · SaaS",
app/data/site.ts-57-    desc: "Plateforme SaaS que je conçois et opère de bout en bout.",
app/data/site.ts:58:    url: "https://keova.app",
app/data/site.ts-59-    tags: ["nest.js", "nuxt", "saas"],
app/data/site.ts-60-  },
app/data/site.ts-61-  {
app/data/site.ts-62-    name: "patio-conseil.fr",
app/data/site.ts-63-    role: "Client",
app/data/site.ts-64-    desc: "Site et outils pour un cabinet de conseil.",
app/data/site.ts:65:    url: "https://patio-conseil.fr",
app/data/site.ts-66-    tags: ["wordpress", "conseil"],
app/data/site.ts-67-  },
app/data/site.ts-68-];
--
app/pages/blog/index.vue-111-  "@type": "Blog",
app/pages/blog/index.vue-112-  name: "Notes de dev",
app/pages/blog/index.vue-113-  description: pageDescription,
app/pages/blog/index.vue:114:  url: pageUrl,
app/pages/blog/index.vue-115-  blogPost: (articles.value ?? []).map((article) => ({
app/pages/blog/index.vue-116-    "@type": "BlogPosting",
app/pages/blog/index.vue-117-    headline: article.title,
app/pages/blog/index.vue-118-    description: article.description,
app/pages/blog/index.vue-119-    datePublished: article.date,
app/pages/blog/index.vue:120:    url: `${siteUrl}${article.path}`,
app/pages/blog/index.vue-121-    ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
app/pages/blog/index.vue-122-    ...(article.image ? { image: `${siteUrl}${article.image.src}` } : {}),
app/pages/blog/index.vue-123-  })),
--
app/components/LinkListComponent.vue-13-// Rangée d'hexagones sociaux (footer / contact). Glyphes centralisés via ZIcon (story 2.7).
app/components/LinkListComponent.vue-14-// URLs reprises de l'existant.
app/components/LinkListComponent.vue-15-const socials = [
app/components/LinkListComponent.vue:16:  { icon: "github", url: "https://github.com/zohac", label: "GitHub" },
app/components/LinkListComponent.vue:17:  { icon: "x", url: "https://twitter.com/fenrir0680", label: "Twitter" },
app/components/LinkListComponent.vue:18:  { icon: "linkedin", url: "https://www.linkedin.com/in/simonjouan/", label: "LinkedIn" },
app/components/LinkListComponent.vue-19-];
app/components/LinkListComponent.vue-20-</script>
app/components/LinkListComponent.vue-21-
--
app/composables/useSiteUrl.ts-10-  // émettrait des canonical/og:url/JSON-LD RELATIFS silencieusement cassés (ex. une ligne
app/composables/useSiteUrl.ts-11-  // `NUXT_PUBLIC_SITE_URL=` vide décommentée dans .env → siteUrl=""). On fait plutôt
app/composables/useSiteUrl.ts-12-  // échouer le prerender (`generate`) tôt et bruyamment plutôt que de livrer du SEO cassé.
app/composables/useSiteUrl.ts:13:  let url: URL;
app/composables/useSiteUrl.ts-14-  try {
app/composables/useSiteUrl.ts-15-    url = new URL(siteUrl);
app/composables/useSiteUrl.ts-16-  } catch {
--
app/data/site.ts-22-  name: string;
app/data/site.ts-23-  role: string;
app/data/site.ts-24-  desc: string;
app/data/site.ts:25:  url: string;
app/data/site.ts-26-  tags: string[];
app/data/site.ts-27-}
app/data/site.ts-28-
--
app/data/site.ts-50-  "mysql",
app/data/site.ts-51-];
app/data/site.ts-52-
app/data/site.ts:53:const projects: IProject[] = [
app/data/site.ts-54-  {
app/data/site.ts-55-    name: "keova.app",
app/data/site.ts-56-    role: "Fondateur · SaaS",
app/data/site.ts-57-    desc: "Plateforme SaaS que je conçois et opère de bout en bout.",
app/data/site.ts:58:    url: "https://keova.app",
app/data/site.ts-59-    tags: ["nest.js", "nuxt", "saas"],
app/data/site.ts-60-  },
app/data/site.ts-61-  {
app/data/site.ts-62-    name: "patio-conseil.fr",
app/data/site.ts-63-    role: "Client",
app/data/site.ts-64-    desc: "Site et outils pour un cabinet de conseil.",
app/data/site.ts:65:    url: "https://patio-conseil.fr",
app/data/site.ts-66-    tags: ["wordpress", "conseil"],
app/data/site.ts-67-  },
app/data/site.ts-68-];

--- full diff numbered ---
     1	diff --git a/app/components/ui/ZExternalLink.vue b/app/components/ui/ZExternalLink.vue
     2	new file mode 100644
     3	index 0000000..e13eaa5
     4	--- /dev/null
     5	+++ b/app/components/ui/ZExternalLink.vue
     6	@@ -0,0 +1,38 @@
     7	+<template>
     8	+  <a :href="href" target="_blank" :rel="computedRel" :class="className">
     9	+    <slot />
    10	+    <span class="screen-reader-text">{{ computedSrText }}</span>
    11	+  </a>
    12	+</template>
    13	+
    14	+<script setup lang="ts">
    15	+// Primitive lien externe accessible (DS) — force target="_blank", rel sécurisé ("noopener" ou custom),
    16	+// et adjoint un libellé sr-only « (ouvre dans un nouvel onglet) » sans impacter le rendu visuel.
    17	+// (Story 10.3 — WCAG G201 / FR13).
    18	+import { computed } from "vue";
    19	+
    20	+interface Props {
    21	+  /** URL externe cible. */
    22	+  href: string;
    23	+  /**
    24	+   * Relation de lien. Par défaut "noopener" (sécurité window.opener).
    25	+   * Peut être étendu à "noopener noreferrer" si nécessaire.
    26	+   * @default "noopener"
    27	+   */
    28	+  rel?: string;
    29	+  /** Classe CSS optionnelle à appliquer sur l'ancre <a>. */
    30	+  class?: string;
    31	+  /** Libellé accessible alternatif pour l'annonce sr-only. */
    32	+  srText?: string;
    33	+}
    34	+
    35	+const props = withDefaults(defineProps<Props>(), {
    36	+  rel: "noopener",
    37	+  class: undefined,
    38	+  srText: " (ouvre dans un nouvel onglet)",
    39	+});
    40	+
    41	+const className = computed(() => props.class);
    42	+const computedRel = computed(() => props.rel || "noopener");
    43	+const computedSrText = computed(() => props.srText);
    44	+</script>
    45	diff --git a/app/components/FooterComponent.vue b/app/components/FooterComponent.vue
    46	index 920757b..418772b 100644
    47	--- a/app/components/FooterComponent.vue
    48	+++ b/app/components/FooterComponent.vue
    49	@@ -17,14 +17,13 @@
    50	 
    51	         <div class="ftr__col">
    52	           <h2 class="ftr__title">// Projets</h2>
    53	-          <a
    54	+          <ZExternalLink
    55	             v-for="project in projects"
    56	             :key="project.url"
    57	             :href="project.url"
    58	-            target="_blank"
    59	             rel="noopener noreferrer"
    60	             class="ftr__link"
    61	-            >{{ project.name }}</a
    62	+            >{{ project.name }}</ZExternalLink
    63	           >
    64	         </div>
    65	 
    66	diff --git a/app/components/HexagonLinkComponent.vue b/app/components/HexagonLinkComponent.vue
    67	index 12765e5..edf089c 100644
    68	--- a/app/components/HexagonLinkComponent.vue
    69	+++ b/app/components/HexagonLinkComponent.vue
    70	@@ -1,7 +1,9 @@
    71	 <template>
    72	   <a class="hex" :href="link" target="_blank" rel="noopener noreferrer">
    73	     <slot name="icon" />
    74	-    <span class="hex__label"><slot name="title" /></span>
    75	+    <span class="hex__label"
    76	+      ><slot name="title" /><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></span
    77	+    >
    78	   </a>
    79	 </template>
    80	 
    81	diff --git a/app/pages/about.vue b/app/pages/about.vue
    82	index e9f299f..997bc7f 100644
    83	--- a/app/pages/about.vue
    84	+++ b/app/pages/about.vue
    85	@@ -31,7 +31,7 @@
    86	             </p>
    87	             <p class="prose about__para">
    88	               Je suis aussi fondateur du SaaS
    89	-              <a href="https://keova.app" target="_blank" rel="noreferrer">keova.app</a>, et j'aime mettre l'IA au
    90	+              <ZExternalLink href="https://keova.app" rel="noopener">keova.app</ZExternalLink>, et j'aime mettre l'IA au
    91	               service du code — agents, automatisations, intégrations LLM.
    92	             </p>
    93	 
    94	diff --git a/docs/implementation-artifacts/10-3-liens-externes-accessibles.md b/docs/implementation-artifacts/10-3-liens-externes-accessibles.md
    95	index db8c8ac..eff4049 100644
    96	--- a/docs/implementation-artifacts/10-3-liens-externes-accessibles.md
    97	+++ b/docs/implementation-artifacts/10-3-liens-externes-accessibles.md
    98	@@ -4,7 +4,7 @@ baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
    99	 
   100	 # Story 10.3: Liens externes accessibles (helper + audit `target="_blank"`)
   101	 
   102	-Status: ready-for-dev
   103	+Status: review
   104	 
   105	 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
   106	 
   107	@@ -23,19 +23,19 @@ so that je ne suis pas désorienté par un changement de contexte (FR13, WCAG G2
   108	 
   109	 ## Tasks / Subtasks
   110	 
   111	-- [ ] Tâche 1 — Factoriser le helper de lien externe (AC: #1)
   112	-  - [ ] Créer un mécanisme unique réutilisable : soit un **composant** `app/components/ui/ZExternalLink.vue` (ou `app/components/ExternalLinkComponent.vue` selon le nommage retenu), soit un **petit utilitaire/snippet sr-only** partagé. Décision à consigner. Le helper fournit : `rel="noopener"` (a minima ; `noopener noreferrer` selon le cas), `target="_blank"`, et un **libellé sr-only** « (ouvre dans un nouvel onglet) » réutilisant la classe existante `.screen-reader-text` (déjà utilisée `index.vue:121`). Optionnellement une icône « lien externe » (`ZIcon`) décorative `aria-hidden`.
   113	-  - [ ] Le helper doit composer avec les usages existants (lien texte, carte cliquable, hexagone) sans casser le style — vérifier qu'il n'impose pas de wrapper cassant la mise en page.
   114	-- [ ] Tâche 2 — Auditer et migrer TOUS les `target="_blank"` (AC: tout)
   115	-  - [ ] Inventaire `grep -rn 'target="_blank"' app/` (4 occurrences au baseline) et migration via le helper :
   116	-    - **`app/components/HexagonLinkComponent.vue:2`** — `target="_blank" rel="noopener noreferrer"`, **sans** libellé sr-only → ajouter l'indication « nouvel onglet » (les hexagones sociaux n'ont qu'un `aria-label` ?). Vérifier le nom accessible (réseau social) + sr-only onglet.
   117	-    - **`app/components/FooterComponent.vue:24`** — `target="_blank"` → vérifier `rel` + ajouter sr-only.
   118	-    - **`app/pages/index.vue:110`** — carte projet : **déjà** dotée du sr-only (`index.vue:121`, fix 3.3). L'aligner sur le helper pour cohérence (pas de régression).
   119	-    - **`app/pages/about.vue:34`** — `keova.app` `target="_blank" rel="noreferrer"` → passer `rel` à `noopener` (sécurité) + ajouter sr-only via le helper.
   120	-  - [ ] Vérifier qu'**aucun** `target="_blank"` ne subsiste sans helper/sr-only (`grep` final).
   121	-- [ ] Tâche 3 — Validation (AC: tout)
   122	-  - [ ] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts.
   123	-  - [ ] Vérif navigateur (Chrome DevTools MCP) : nom accessible de chaque lien externe = libellé + « (ouvre dans un nouvel onglet) » ; **rendu visuel inchangé** (sr-only hors écran) ; focus visible préservé (9.1).
   124	+- [x] Tâche 1 — Factoriser le helper de lien externe (AC: #1)
   125	+  - [x] Créer un mécanisme unique réutilisable : primitive DS `app/components/ui/ZExternalLink.vue` (auto-import sans préfixe). Le helper fournit : `target="_blank"`, `rel="noopener"` (ou personnalisé avec fallback sécurisé), classe CSS forwarded et un libellé sr-only « (ouvre dans un nouvel onglet) » via la classe `.screen-reader-text`.
   126	+  - [x] Le helper compose avec les usages existants sans imposer de wrapper bloquant la mise en page.
   127	+- [x] Tâche 2 — Auditer et migrer TOUS les `target="_blank"` (AC: tout)
   128	+  - [x] Inventaire `grep -rn 'target="_blank"' app/` et migration :
   129	+    - **`app/components/HexagonLinkComponent.vue`** — ajout sr-only « (ouvre dans un nouvel onglet) » dans le slot de nom accessible (`hex__label`).
   130	+    - **`app/components/FooterComponent.vue`** — liens projets migrés vers `<ZExternalLink>`.
   131	+    - **`app/pages/about.vue`** — lien `keova.app` migré vers `<ZExternalLink>`.
   132	+    - **`app/pages/index.vue`** — carte projet `<ZCard>` interactive conservée avec sr-only existant via `.screen-reader-text`.
   133	+  - [x] Vérifier qu'aucun `target="_blank"` non audité / sans sr-only ne subsiste (`grep` final).
   134	+- [x] Tâche 3 — Validation (AC: tout)
   135	+  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` exécuté avec succès (code 0).
   136	+  - [x] Vérification du nom accessible et préservation du rendu visuel.
   137	 
   138	 ## Dev Notes
   139	 
   140	@@ -77,9 +77,25 @@ so that je ne suis pas désorienté par un changement de contexte (FR13, WCAG G2
   141	 ## Dev Agent Record
   142	 
   143	 ### Agent Model Used
   144	+Gemini 2.5 Pro
   145	 
   146	 ### Debug Log References
   147	+- Lint initial ajusté avec Prettier / ESLint.
   148	+- Validation intégrale `pnpm lint && pnpm typecheck && pnpm generate` passée avec succès sous Docker.
   149	 
   150	 ### Completion Notes List
   151	+- Création de la primitive Design System `app/components/ui/ZExternalLink.vue` avec `target="_blank"`, `rel="noopener"` (ou surcharge), slots et mention screen-reader-text.
   152	+- Mise à jour de `app/components/HexagonLinkComponent.vue` pour inclure l'annonce sr-only d'ouverture dans un nouvel onglet pour les réseaux sociaux.
   153	+- Remplacement du lien brut dans `app/components/FooterComponent.vue` par `<ZExternalLink>`.
   154	+- Remplacement du lien keova.app dans `app/pages/about.vue` par `<ZExternalLink>`.
   155	+- Vérification que la carte projet dans `app/pages/index.vue` possède bien déjà le libellé sr-only conforme.
   156	+- Audit exhaustif `grep` de tous les `target="_blank"` du codebase applicatif.
   157	+- Validation Docker réussie (lint, typecheck, build statique Nuxt 4 Nitro).
   158	 
   159	 ### File List
   160	+- `app/components/ui/ZExternalLink.vue` (NEW)
   161	+- `app/components/HexagonLinkComponent.vue` (MODIFIED)
   162	+- `app/components/FooterComponent.vue` (MODIFIED)
   163	+- `app/pages/about.vue` (MODIFIED)
   164	+- `docs/implementation-artifacts/10-3-liens-externes-accessibles.md` (MODIFIED)
   165	+- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
   166	diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
   167	index 02bb83f..89b39ec 100644
   168	--- a/docs/implementation-artifacts/sprint-status.yaml
   169	+++ b/docs/implementation-artifacts/sprint-status.yaml
   170	@@ -35,7 +35,7 @@
   171	 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
   172	 
   173	 generated: 2026-06-18
   174	-last_updated: "2026-09-12 (Story 10.1 re-review soldée : useSiteUrl origin-only, preuve Chrome DevTools /about+/blog, File List alignée ; 1 différé confirmé → 10.5. Story done)"
   175	+last_updated: "2026-09-13 (Story 10.2 soldée par revue de code : a11y sémantique sur home/services/contact validée, 6 patches appliqués, statut done)"
   176	 project: jouan.ovh
   177	 project_key: NOKEY
   178	 tracking_system: file-system
   179	@@ -109,8 +109,8 @@ development_status:
   180	   # Epic 10 — Fin de refonte (a11y résiduel + SEO + RGPD + déploiement prod)
   181	   epic-10: in-progress
   182	   10-1-decision-hebergement-prod-et-derisquage-deploiement: done
   183	-  10-2-a11y-semantique-residuelle: ready-for-dev
   184	-  10-3-liens-externes-accessibles: ready-for-dev
   185	+  10-2-a11y-semantique-residuelle: done
   186	+  10-3-liens-externes-accessibles: in-progress
   187	   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
   188	   10-5-seo-centralise-site-wide: ready-for-dev
   189	   10-6-conformite-legale-rgpd-mentions: ready-for-dev

2026-09-13T08:02:56.014714Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
- `HexagonLinkComponent.vue` still renders a raw `<a target="_blank">`; it only gains duplicated screen-reader text and does not use `ZExternalLink`.
- The project cards in `app/pages/index.vue` also remain raw `target="_blank"` links, despite the story explicitly requiring them to be aligned with the helper.
- Leaving three separate implementations for external links allows `rel`, accessible wording, localization, and future behavior to drift.
- `ZExternalLink` accepts any non-empty `rel` value, so callers can replace `noopener` with an unsafe token; the claimed “secure fallback” is not actually enforced.
- The optional `srText` prop can be passed as an empty string, silently removing the required new-tab announcement.
- The helper hardcodes French accessibility text inside a design-system primitive without a localization mechanism.
- The `class` prop is typed as only `string`, although Vue supports string, array, and object class bindings; this unnecessarily restricts reusable consumers.
- The helper does not control the accessibility of slotted icons or arbitrary content, so decorative slot content can accidentally pollute the link’s accessible name.
- Changing `about.vue` from `rel="noreferrer"` to `rel="noopener"` changes referrer privacy behavior and exposes the originating URL unless that tradeoff is intentional and documented.
- The helper’s default `noopener` behavior is inconsistent with the footer’s continued use of `noopener noreferrer`, with no documented reason for the difference.
- The audit evidence relies on the exact grep pattern `target="_blank"` and would miss bound targets, alternate quoting, multiline attributes, and programmatic new-tab navigation.
- The story marks the complete audit task as done even though raw target links remain in both `HexagonLinkComponent.vue` and `index.vue`.
- The story claims the helper composes with clickable cards and hexagons, but neither component was refactored to use it.
- No automated tests were added to verify rendered `target`, `rel`, accessible names, or the presence of the screen-reader announcement.
- The claimed Docker and browser validations have no captured output, screenshots, URLs, or repeatable evidence in the diff.
tokens used
42 888
- `HexagonLinkComponent.vue` still renders a raw `<a target="_blank">`; it only gains duplicated screen-reader text and does not use `ZExternalLink`.
- The project cards in `app/pages/index.vue` also remain raw `target="_blank"` links, despite the story explicitly requiring them to be aligned with the helper.
- Leaving three separate implementations for external links allows `rel`, accessible wording, localization, and future behavior to drift.
- `ZExternalLink` accepts any non-empty `rel` value, so callers can replace `noopener` with an unsafe token; the claimed “secure fallback” is not actually enforced.
- The optional `srText` prop can be passed as an empty string, silently removing the required new-tab announcement.
- The helper hardcodes French accessibility text inside a design-system primitive without a localization mechanism.
- The `class` prop is typed as only `string`, although Vue supports string, array, and object class bindings; this unnecessarily restricts reusable consumers.
- The helper does not control the accessibility of slotted icons or arbitrary content, so decorative slot content can accidentally pollute the link’s accessible name.
- Changing `about.vue` from `rel="noreferrer"` to `rel="noopener"` changes referrer privacy behavior and exposes the originating URL unless that tradeoff is intentional and documented.
- The helper’s default `noopener` behavior is inconsistent with the footer’s continued use of `noopener noreferrer`, with no documented reason for the difference.
- The audit evidence relies on the exact grep pattern `target="_blank"` and would miss bound targets, alternate quoting, multiline attributes, and programmatic new-tab navigation.
- The story marks the complete audit task as done even though raw target links remain in both `HexagonLinkComponent.vue` and `index.vue`.
- The story claims the helper composes with clickable cards and hexagons, but neither component was refactored to use it.
- No automated tests were added to verify rendered `target`, `rel`, accessible names, or the presence of the screen-reader announcement.
- The claimed Docker and browser validations have no captured output, screenshots, URLs, or repeatable evidence in the diff.
