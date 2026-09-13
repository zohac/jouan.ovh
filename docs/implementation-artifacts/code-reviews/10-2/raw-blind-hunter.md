Reading additional input from stdin...
2026-09-13T07:35:09.299993Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: high
reasoning summaries: none
session id: 01a099b1-01fc-7bb1-9568-7cfd9ff35d37
--------
user
# Blind Hunter Prompt — Story 10.2

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/10-2/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.
warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
I’m using `bmad-review-adversarial-general` to perform the requested skeptical review and will return at least ten description-only findings.
  → Read the adversarial review skill instructions
  • Inspect the provided diff and identify skeptical findings
  • Return at least ten Markdown-list findings
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/bmad-review-adversarial-general/SKILL.md" in /Users/simon/dev/jouan.ovh
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

2026-09-13T07:35:18.057221Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
The skill requires a full artifact load, skeptical analysis, and a description-only Markdown list with at least ten findings. I’m now inspecting the diff in full and checking its changed files and test coverage for omissions.
exec
/bin/zsh -lc "wc -l docs/implementation-artifacts/code-reviews/10-2/full.diff && sed -n '1,260p' docs/implementation-artifacts/code-reviews/10-2/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     430 docs/implementation-artifacts/code-reviews/10-2/full.diff
diff --git a/app/assets/scss/base/_layout.scss b/app/assets/scss/base/_layout.scss
index 5d6729f..e59cebe 100644
--- a/app/assets/scss/base/_layout.scss
+++ b/app/assets/scss/base/_layout.scss
@@ -33,10 +33,13 @@
 }
 
 // Sur-titre mono en capitales espacées, accent orange.
+// font-weight et line-height neutralisés pour un rendu identique lorsqu'appliqué sur un <h2 class="eyebrow">.
 .eyebrow {
   margin: 0 0 var(--space-3);
   font-family: var(--font-mono);
   font-size: var(--fs-xs);
+  font-weight: var(--fw-regular);
+  line-height: inherit;
   letter-spacing: var(--ls-wider);
   text-transform: uppercase;
   color: var(--accent);
diff --git a/app/pages/contact.vue b/app/pages/contact.vue
index ba80d43..5191532 100644
--- a/app/pages/contact.vue
+++ b/app/pages/contact.vue
@@ -89,18 +89,24 @@
           <div class="contact__info">
             <!-- Carte infos : email / localisation / disponibilité -->
             <ZCard class="contact__infocard">
-              <div class="infoitem">
-                <div class="infoitem__k">// email</div>
-                <a class="infoitem__v contact__email" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
-              </div>
-              <div class="infoitem">
-                <div class="infoitem__k">// localisation</div>
-                <div class="infoitem__v">{{ contact.city }}</div>
-              </div>
-              <div class="infoitem">
-                <div class="infoitem__k">// disponibilité</div>
-                <div class="contact__avail"><ZBadge tone="success" dot>Ouvert aux missions freelance</ZBadge></div>
-              </div>
+              <dl class="contact__infolist">
+                <div class="infoitem">
+                  <dt class="infoitem__k"><span aria-hidden="true">// </span>email</dt>
+                  <dd class="infoitem__v">
+                    <a class="contact__email" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
+                  </dd>
+                </div>
+                <div class="infoitem">
+                  <dt class="infoitem__k"><span aria-hidden="true">// </span>localisation</dt>
+                  <dd class="infoitem__v">{{ contact.city }}</dd>
+                </div>
+                <div class="infoitem">
+                  <dt class="infoitem__k"><span aria-hidden="true">// </span>disponibilité</dt>
+                  <dd class="infoitem__v">
+                    <div class="contact__avail"><ZBadge tone="success" dot>Ouvert aux missions freelance</ZBadge></div>
+                  </dd>
+                </div>
+              </dl>
             </ZCard>
 
             <!-- Carte CTA terminal : ouvre l'easter-egg via le lanceur partagé (useTerminal) -->
@@ -110,7 +116,7 @@
                 anon.@jouan.ovh:~$ <span class="contact__prompt-cmd">./contact</span>
               </p>
               <p class="prose contact__term-text">Vous préférez la ligne de commande ? Ouvrez le terminal.</p>
-              <ZButton variant="terminal" size="sm" @click="openTerminal">
+              <ZButton variant="terminal" size="sm" aria-haspopup="dialog" @click="openTerminal">
                 <template #icon><ZIcon name="terminal" /></template>
                 Ouvrir le terminal
               </ZButton>
@@ -360,6 +366,11 @@ useHead({
 }
 
 // ---- Carte infos (porté de kit.css : .infoitem / .k / .v) ----
+.contact__infolist {
+  margin: 0;
+  padding: 0;
+}
+
 .infoitem {
   font-family: var(--font-mono);
 
@@ -370,12 +381,14 @@ useHead({
 
 .infoitem__k {
   font-size: var(--fs-xs);
+  font-weight: var(--fw-regular);
   letter-spacing: var(--ls-wider);
   text-transform: uppercase;
   color: var(--text-muted);
 }
 
 .infoitem__v {
+  margin: 0;
   font-size: var(--fs-md);
   color: var(--text-strong);
 }
diff --git a/app/pages/index.vue b/app/pages/index.vue
index 1b36402..69ee46d 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -15,9 +15,11 @@
               </ZButton>
               <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir les services </ZButton>
             </div>
-            <div class="hero__tags">
-              <ZTag v-for="tag in tags" :key="tag">{{ tag }}</ZTag>
-            </div>
+            <ul class="hero__tags">
+              <li v-for="tag in tags" :key="tag">
+                <ZTag>{{ tag }}</ZTag>
+              </li>
+            </ul>
           </div>
 
           <!-- Colonne droite : fenêtre terminal décorative (statique) -->
@@ -68,23 +70,18 @@
       <div class="container">
         <p class="eyebrow">// ce que je fais</p>
         <h2 class="section__title">Trois façons de travailler ensemble</h2>
-        <div class="grid-3">
-          <ZCard
-            v-for="service in services"
-            :key="service.id"
-            class="offer"
-            interactive
-            :accent="service.featured"
-            :featured="service.featured"
-          >
-            <div class="offer__icon"><ZIcon :name="service.icon" /></div>
-            <h3 class="offer__title">{{ service.title }}</h3>
-            <p class="offer__desc">{{ service.desc }}</p>
-            <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
-              En savoir plus →
-            </NuxtLink>
-          </ZCard>
-        </div>
+        <ul class="grid-3">
+          <li v-for="service in services" :key="service.id">
+            <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
+              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
+              <h3 class="offer__title">{{ service.title }}</h3>
+              <p class="offer__desc">{{ service.desc }}</p>
+              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
+                En savoir plus →
+              </NuxtLink>
+            </ZCard>
+          </li>
+        </ul>
       </div>
     </section>
 
@@ -98,29 +95,24 @@
           </div>
         </div>
 
-        <p class="eyebrow">// projets sélectionnés</p>
-        <div class="grid-2 projects">
-          <ZCard
-            v-for="project in projects"
-            :key="project.url"
-            class="project"
-            interactive
-            as="a"
-            :href="project.url"
-            target="_blank"
-            rel="noopener noreferrer"
-          >
-            <div class="project__head">
-              <h3 class="project__name">{{ project.name }}</h3>
-              <span class="project__role">{{ project.role }}</span>
-            </div>
-            <p class="prose project__desc">{{ project.desc }}</p>
-            <div class="hero__tags">
-              <ZTag v-for="tag in project.tags" :key="tag">{{ tag }}</ZTag>
-            </div>
-            <span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span>
-          </ZCard>
-        </div>
+        <h2 class="eyebrow">// projets sélectionnés</h2>
+        <ul class="grid-2 projects">
+          <li v-for="project in projects" :key="project.url">
+            <ZCard class="project" interactive as="a" :href="project.url" target="_blank" rel="noopener noreferrer">
+              <div class="project__head">
+                <h3 class="project__name">{{ project.name }}</h3>
+                <span class="project__role">{{ project.role }}</span>
+              </div>
+              <p class="prose project__desc">{{ project.desc }}</p>
+              <ul class="hero__tags">
+                <li v-for="tag in project.tags" :key="tag">
+                  <ZTag>{{ tag }}</ZTag>
+                </li>
+              </ul>
+              <span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span>
+            </ZCard>
+          </li>
+        </ul>
       </div>
     </section>
   </main>
@@ -449,6 +441,9 @@ const { open: openTerminal } = useTerminal();
   display: grid;
   grid-template-columns: repeat(3, 1fr);
   gap: var(--space-5);
+  margin: 0;
+  padding: 0;
+  list-style: none;
 }
 
 .offer__icon {
@@ -531,6 +526,9 @@ const { open: openTerminal } = useTerminal();
   display: grid;
   grid-template-columns: 1fr 1fr;
   gap: var(--space-6);
+  margin: 0;
+  padding: 0;
+  list-style: none;
 }
 
 .projects {
diff --git a/app/pages/services.vue b/app/pages/services.vue
index 14b739f..c8d81d8 100644
--- a/app/pages/services.vue
+++ b/app/pages/services.vue
@@ -10,39 +10,35 @@
           vous gardez la main sur votre projet.
         </p>
 
-        <div class="grid-3">
-          <ZCard
-            v-for="offer in offers"
-            :key="offer.id"
-            class="offer"
-            :accent="offer.featured"
-            :featured="offer.featured"
-          >
-            <div v-if="offer.featured" class="offer__badge">
-              <ZBadge tone="accent">Le plus demandé</ZBadge>
-            </div>
-            <div class="offer__icon"><ZIcon :name="offer.icon" /></div>
-            <h2 class="offer__title">{{ offer.title }}</h2>
-            <p class="offer__desc">{{ offer.desc }}</p>
-            <ul class="offer__points">
-              <li v-for="point in offer.points" :key="point">{{ point }}</li>
-            </ul>
-            <div class="offer__price">
-              <b>{{ offer.price }}</b>
-            </div>
-            <div class="offer__cta">
-              <ZButton
-                :as="NuxtLink"
-                to="/contact"
-                :variant="offer.featured ? 'primary' : 'secondary'"
-                :aria-label="`Discuter du projet — ${offer.title}`"
-                class="offer__btn"
-              >
-                Discuter du projet
-              </ZButton>
-            </div>
-          </ZCard>
-        </div>
+        <ul class="grid-3">

2026-09-13T07:35:23.033074Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '261,520p' docs/implementation-artifacts/code-reviews/10-2/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
+          <li v-for="offer in offers" :key="offer.id">
+            <ZCard class="offer" :accent="offer.featured" :featured="offer.featured">
+              <div v-if="offer.featured" class="offer__badge">
+                <ZBadge tone="accent">Le plus demandé</ZBadge>
+              </div>
+              <div class="offer__icon"><ZIcon :name="offer.icon" /></div>
+              <h2 class="offer__title">{{ offer.title }}</h2>
+              <p class="offer__desc">{{ offer.desc }}</p>
+              <ul class="offer__points">
+                <li v-for="point in offer.points" :key="point">{{ point }}</li>
+              </ul>
+              <div class="offer__price">
+                <b>{{ offer.price }}</b>
+              </div>
+              <div class="offer__cta">
+                <ZButton
+                  :as="NuxtLink"
+                  to="/contact"
+                  :variant="offer.featured ? 'primary' : 'secondary'"
+                  :aria-label="`Discuter du projet — ${offer.title}`"
+                  class="offer__btn"
+                >
+                  Discuter du projet
+                </ZButton>
+              </div>
+            </ZCard>
+          </li>
+        </ul>
       </div>
     </section>
 
@@ -52,13 +48,13 @@
         <p class="eyebrow">// comment ça se passe</p>
         <h2 class="process__title">Un déroulé simple en quatre temps</h2>
 
-        <div class="process">
-          <div v-for="step in steps" :key="step.n" class="process__step">
-            <div class="process__num">{{ step.n }}</div>
+        <ol class="process">
+          <li v-for="step in steps" :key="step.n" class="process__step">
+            <div class="process__num" aria-hidden="true">{{ step.n }}</div>
             <h3 class="process__step-title">{{ step.title }}</h3>
             <p class="prose process__desc">{{ step.desc }}</p>
-          </div>
-        </div>
+          </li>
+        </ol>
 
         <div class="process__cta">
           <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
@@ -175,6 +171,9 @@ useHead({
   display: grid;
   grid-template-columns: repeat(3, 1fr);
   gap: var(--space-5);
+  margin: 0;
+  padding: 0;
+  list-style: none;
 }
 
 // `display:flex` (porté de l'inline JSX) : le prix + CTA sont poussés en bas via
@@ -280,6 +279,9 @@ useHead({
   display: grid;
   grid-template-columns: repeat(4, 1fr);
   gap: var(--space-5);
+  margin: 0;
+  padding: 0;
+  list-style: none;
 }
 
 .process__num {
diff --git a/docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md b/docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md
index 2ac1617..d8cc22b 100644
--- a/docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md
+++ b/docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md
@@ -4,7 +4,7 @@ baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
 
 # Story 10.2: A11y sémantique résiduelle (home / services / contact)
 
-Status: ready-for-dev
+Status: review
 
 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
 
@@ -23,18 +23,18 @@ so that la structure du site m'est annoncée correctement (FR12).
 
 ## Tasks / Subtasks
 
-- [ ] Tâche 1 — Home (`app/pages/index.vue`) : titres + listes (AC: tout)
-  - [ ] Auditer l'outline : `<h1 class="hero__title">` (l.9). Les **libellés de section** qui ouvrent une section et n'ont pas de titre propre passent en `<h2 class="eyebrow">` ; ceux qui sont un **kicker au-dessus d'un titre existant** restent `<p>`. Cas : l.8 `// développeur web freelance` = kicker du hero (au-dessus du `<h1>`) → **reste `<p>`** ; l.69 `// ce que je fais` est suivi d'un `<h2 class="section__title">` (l.70) → kicker, **reste `<p>`** ; l.101 `// projets sélectionnés` → **vérifier** s'il est suivi d'un titre ; si non, le passer en `<h2 class="eyebrow">`. (Convention story 5.2 : `font-weight`/`line-height` hérités → rendu identique.)
-  - [ ] **Séquences répétées en listes** : la grille des 3 offres (aperçu services) et la grille des projets sélectionnés (cartes `v-for`) → `<ul>` + `<li>` (`list-style: none` + reset marges UA → rendu identique). Numéros/ordre éventuels en `aria-hidden`.
-- [ ] Tâche 2 — Services (`app/pages/services.vue`) : process en `<ol>` + titres (AC: tout)
-  - [ ] **Process en `<ol>`/`<li>`** (différé revue 4.2) : `.process` est aujourd'hui `<div class="process"><div v-for="step" class="process__step">` avec `<div class="process__num">{{ step.n }}</div>` + `<h3>` (l.55-60). Passer `.process` en `<ol>`, `.process__step` en `<li>` ; les numéros `01…04` (`process__num`) en `aria-hidden="true"` (l'ordre est porté par la liste). `list-style: none` + reset → rendu identique.
-  - [ ] La grille des **3 offres** (`v-for` offer, l.~25) → `<ul>`/`<li>` ; `offer__points` est déjà un `<ul>` (l.27) — OK. Vérifier l'outline : `<h1>` (l.7), `<h2 class="offer__title">` (l.25 — ⚠️ il y a un h2 par offre dans une grille ; acceptable si la section a un libellé), `<h2 class="process__title">` (l.53). Eyebrows l.6/l.52 = kickers de titres existants → restent `<p>`.
-- [ ] Tâche 3 — Contact (`app/pages/contact.vue`) : colonne infos en `<dl>` + CTA terminal (AC: tout)
-  - [ ] **Paires label/valeur** de `.contact__infocard` (l.91+) : aujourd'hui `<div class="infoitem__k">// email</div>` + valeur en `<div>`. Passer en `<dl>` / `<dt>` (label) / `<dd>` (valeur). Le préfixe `//` (décoratif) en `aria-hidden="true"` (ou pseudo-élément) pour ne pas être lu « slash slash ». Reset CSS pour rendu identique.
-  - [ ] **CTA terminal** (carte ouvrant l'easter-egg) : ajouter `aria-haspopup="dialog"` (signale l'ouverture d'un overlay). Vérifier qu'un libellé/titre de section structure la colonne droite (un `<h2 class="eyebrow">` si elle ouvre une région sans titre).
-- [ ] Tâche 4 — Validation (AC: tout)
-  - [ ] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts.
-  - [ ] **Diff visuel + arbre d'accessibilité** (Chrome DevTools MCP), desktop ET mobile : rendu **identique** au pixel (h2 neutralisés, listes reset) ; outline de titres `h1 → h2…` sans saut ; listes annoncées comme listes ; `//` non vocalisé.
+- [x] Tâche 1 — Home (`app/pages/index.vue`) : titres + listes (AC: tout)
+  - [x] Auditer l'outline : `<h1 class="hero__title">` (l.9). Les **libellés de section** qui ouvrent une section et n'ont pas de titre propre passent en `<h2 class="eyebrow">` ; ceux qui sont un **kicker au-dessus d'un titre existant** restent `<p>`. Cas : l.8 `// développeur web freelance` = kicker du hero (au-dessus du `<h1>`) → **reste `<p>`** ; l.69 `// ce que je fais` est suivi d'un `<h2 class="section__title">` (l.70) → kicker, **reste `<p>`** ; l.101 `// projets sélectionnés` → **vérifier** s'il est suivi d'un titre ; si non, le passer en `<h2 class="eyebrow">`. (Convention story 5.2 : `font-weight`/`line-height` hérités → rendu identique.)
+  - [x] **Séquences répétées en listes** : la grille des 3 offres (aperçu services) et la grille des projets sélectionnés (cartes `v-for`) → `<ul>` + `<li>` (`list-style: none` + reset marges UA → rendu identique). Numéros/ordre éventuels en `aria-hidden`.
+- [x] Tâche 2 — Services (`app/pages/services.vue`) : process en `<ol>` + titres (AC: tout)
+  - [x] **Process en `<ol>`/`<li>`** (différé revue 4.2) : `.process` est aujourd'hui `<div class="process"><div v-for="step" class="process__step">` avec `<div class="process__num">{{ step.n }}</div>` + `<h3>` (l.55-60). Passer `.process` en `<ol>`, `.process__step` en `<li>` ; les numéros `01…04` (`process__num`) en `aria-hidden="true"` (l'ordre est porté par la liste). `list-style: none` + reset → rendu identique.
+  - [x] La grille des **3 offres** (`v-for` offer, l.~25) → `<ul>`/`<li>` ; `offer__points` est déjà un `<ul>` (l.27) — OK. Vérifier l'outline : `<h1>` (l.7), `<h2 class="offer__title">` (l.25 — ⚠️ il y a un h2 par offre dans une grille ; acceptable si la section a un libellé), `<h2 class="process__title">` (l.53). Eyebrows l.6/l.52 = kickers de titres existants → restent `<p>`.
+- [x] Tâche 3 — Contact (`app/pages/contact.vue`) : colonne infos en `<dl>` + CTA terminal (AC: tout)
+  - [x] **Paires label/valeur** de `.contact__infocard` (l.91+) : aujourd'hui `<div class="infoitem__k">// email</div>` + valeur en `<div>`. Passer en `<dl>` / `<dt>` (label) / `<dd>` (valeur). Le préfixe `//` (décoratif) en `aria-hidden="true"` (ou pseudo-élément) pour ne pas être lu « slash slash ». Reset CSS pour rendu identique.
+  - [x] **CTA terminal** (carte ouvrant l'easter-egg) : ajouter `aria-haspopup="dialog"` (signale l'ouverture d'un overlay). Vérifier qu'un libellé/titre de section structure la colonne droite (un `<h2 class="eyebrow">` si elle ouvre une région sans titre).
+- [x] Tâche 4 — Validation (AC: tout)
+  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts.
+  - [x] **Diff visuel + arbre d'accessibilité** (Chrome DevTools MCP), desktop ET mobile : rendu **identique** au pixel (h2 neutralisés, listes reset) ; outline de titres `h1 → h2…` sans saut ; listes annoncées comme listes ; `//` non vocalisé.
 
 ## Dev Notes
 
@@ -74,8 +74,33 @@ so that la structure du site m'est annoncée correctement (FR12).
 
 ### Agent Model Used
 
+- Gemini 3.7 Flash (Low)
+
 ### Debug Log References
 
+- Validation Docker `pnpm lint`, `pnpm typecheck`, `pnpm generate` exécutée avec succès (11 routes prerendered).
+
 ### Completion Notes List
 
+- `app/assets/scss/base/_layout.scss` : neutralisation de `font-weight` et `line-height` sur `.eyebrow` pour les balises `<h2>`.
+- `app/pages/index.vue` :
+  - `hero__tags` encapsulé en `<ul>`/`<li>` (hero et projets).
+  - Titre de section `// projets sélectionnés` passé en `<h2 class="eyebrow">` (l'eyebrow ouvre la section projets sans titre secondaire).
+  - Grille des 3 services et grille des 2 projets passées en `<ul>`/`<li>` avec reset CSS (`margin: 0; padding: 0; list-style: none`).
+- `app/pages/services.vue` :
+  - Grille des 3 offres passée en `<ul>`/`<li>` avec reset CSS.
+  - Process 4 étapes passé en `<ol class="process">` / `<li class="process__step">` avec `process__num` marqué en `aria-hidden="true"` et reset CSS.
+- `app/pages/contact.vue` :
+  - Carte infos structurée en `<dl class="contact__infolist">`, `<dt class="infoitem__k">`, `<dd class="infoitem__v">`.
+  - Préfixe `// ` encapsulé dans `<span aria-hidden="true">// </span>` pour éviter la vocalisation "slash slash" par les lecteurs d'écran.
+  - Reset CSS sur `dl`, `dt`, `dd` pour garantir la stricte conformité visuelle.
+  - Bouton CTA terminal enrichi de `aria-haspopup="dialog"`.
+
 ### File List
+
+- `app/assets/scss/base/_layout.scss` (MODIFIED)
+- `app/pages/index.vue` (MODIFIED)
+- `app/pages/services.vue` (MODIFIED)
+- `app/pages/contact.vue` (MODIFIED)
+- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
+- `docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md` (MODIFIED)
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 02bb83f..37ac8d5 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-12 (Story 10.1 re-review soldée : useSiteUrl origin-only, preuve Chrome DevTools /about+/blog, File List alignée ; 1 différé confirmé → 10.5. Story done)"
+last_updated: "2026-09-13 (Story 10.2 terminée : a11y sémantique résiduelle sur home/services/contact, statut review)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -109,7 +109,7 @@ development_status:
   # Epic 10 — Fin de refonte (a11y résiduel + SEO + RGPD + déploiement prod)
   epic-10: in-progress
   10-1-decision-hebergement-prod-et-derisquage-deploiement: done
-  10-2-a11y-semantique-residuelle: ready-for-dev
+  10-2-a11y-semantique-residuelle: review
   10-3-liens-externes-accessibles: ready-for-dev
   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
   10-5-seo-centralise-site-wide: ready-for-dev

2026-09-13T07:35:25.450405Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '1,180p' app/components/ZCard.vue; sed -n '1,220p' app/components/ZButton.vue; sed -n '1,160p' app/composables/useTerminal.ts 2>/dev/null || true" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
sed: app/components/ZCard.vue: No such file or directory
sed: app/components/ZButton.vue: No such file or directory
import { ref } from "vue";

// Lanceur partagé de l'easter-egg terminal.
//
// Le `TerminalManagerComponent` (qui expose `createNewTerminal()`) est monté dans
// le `HeaderComponent` ; il n'existe pas d'API globale d'ouverture. Ce registre
// minimal expose cette ouverture aux autres parties du site (ex. le hero d'accueil
// story 3.1) sans dupliquer le gestionnaire ni dépendre d'Epic 8.
//
// Le header enregistre son lanceur au montage (`register`), les appelants
// déclenchent l'ouverture (`open`). Tant qu'aucun lanceur n'est enregistré (ex.
// au prerender `nuxi generate`, avant hydratation), `open()` est un no-op sûr.
// La restylisation complète du terminal reste du périmètre d'Epic 8.

type TerminalLauncher = () => void;

const launcher = ref<TerminalLauncher | null>(null);

export function useTerminal() {
  return {
    /** Enregistre le lanceur réel (appelé par le header au montage). */
    register(fn: TerminalLauncher) {
      launcher.value = fn;
    },
    /**
     * Désenregistre le lanceur au démontage. Ne nullifie que si le lanceur
     * courant est bien `fn` (évite d'effacer un enregistrement plus récent).
     */
    unregister(fn: TerminalLauncher) {
      if (launcher.value === fn) {
        launcher.value = null;
      }
    },
    /** Ouvre un terminal si un lanceur est disponible ; no-op sinon. */
    open() {
      launcher.value?.();
    },
  };
}

exec
/bin/zsh -lc 'rg -n "defineProps|<slot|as=|interactive|aria-haspopup|process__step|hero__tags|grid-3|grid-2|infoitem|contact__infocard|ZCard" app/components app/pages app/composables app/assets tests 2>/dev/null' in /Users/simon/dev/jouan.ovh
 exited 2 in 0ms:
app/components/HeaderComponent.vue:29:        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" class="hdr__action">
app/components/HeaderComponent.vue:68:        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" @click="closeMenu">
app/pages/about.vue:19:              <ZButton :as="NuxtLink" to="/contact" variant="primary">Me contacter</ZButton>
app/pages/about.vue:20:              <ZButton as="a" :href="`mailto:${profile.email}`" variant="secondary">M'écrire</ZButton>
app/pages/about.vue:42:              <ul class="hero__tags">
app/pages/about.vue:72:          <!-- Colonne droite : formation (une ZCard par diplôme), liste sémantique <ul>/<li>. -->
app/pages/about.vue:77:                <ZCard padded>
app/pages/about.vue:81:                </ZCard>
app/pages/about.vue:95:// stack en <ZTag>, formation en <ZCard>. Dark-first, tokens uniquement, prerender-safe.
app/pages/about.vue:164:// .section / .container / .eyebrow / .prose / .hero__tags sont des primitives de
app/pages/about.vue:179:// ---- Grille du hero (porté de About.jsx : grid-2 + gridTemplateColumns "0.8fr 1.2fr") ----
app/pages/about.vue:255:// .hero__tags (rangée de chips) = primitive de layout globale (base/_layout.scss).
app/pages/about.vue:364:// ---- Responsive (cf. kit.css @media max-width: 900px : .grid-2 → 1 colonne) ----
app/pages/contact.vue:17:            <ZCard v-if="sent" ref="sentCard" accent class="contact__sent" role="status" tabindex="-1">
app/pages/contact.vue:20:            </ZCard>
app/pages/contact.vue:91:            <ZCard class="contact__infocard">
app/pages/contact.vue:93:                <div class="infoitem">
app/pages/contact.vue:94:                  <dt class="infoitem__k"><span aria-hidden="true">// </span>email</dt>
app/pages/contact.vue:95:                  <dd class="infoitem__v">
app/pages/contact.vue:99:                <div class="infoitem">
app/pages/contact.vue:100:                  <dt class="infoitem__k"><span aria-hidden="true">// </span>localisation</dt>
app/pages/contact.vue:101:                  <dd class="infoitem__v">{{ contact.city }}</dd>
app/pages/contact.vue:103:                <div class="infoitem">
app/pages/contact.vue:104:                  <dt class="infoitem__k"><span aria-hidden="true">// </span>disponibilité</dt>
app/pages/contact.vue:105:                  <dd class="infoitem__v">
app/pages/contact.vue:110:            </ZCard>
app/pages/contact.vue:113:            <ZCard class="contact__term">
app/pages/contact.vue:119:              <ZButton variant="terminal" size="sm" aria-haspopup="dialog" @click="openTerminal">
app/pages/contact.vue:123:            </ZCard>
app/pages/contact.vue:303:// Rangée Nom + Email (porté de Contact.jsx : grid-2, gap space-4).
app/pages/contact.vue:368:// ---- Carte infos (porté de kit.css : .infoitem / .k / .v) ----
app/pages/contact.vue:374:.infoitem {
app/pages/contact.vue:382:.infoitem__k {
app/pages/contact.vue:390:.infoitem__v {
app/pages/contact.vue:418:// Surcharge du fond/bordure de ZCard ; nesting sous .contact__info pour la spécificité.
app/pages/index.vue:12:              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
app/pages/index.vue:16:              <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir les services </ZButton>
app/pages/index.vue:18:            <ul class="hero__tags">
app/pages/index.vue:73:        <ul class="grid-3">
app/pages/index.vue:75:            <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
app/pages/index.vue:82:            </ZCard>
app/pages/index.vue:99:        <ul class="grid-2 projects">
app/pages/index.vue:101:            <ZCard class="project" interactive as="a" :href="project.url" target="_blank" rel="noopener noreferrer">
app/pages/index.vue:107:              <ul class="hero__tags">
app/pages/index.vue:113:            </ZCard>
app/pages/index.vue:271:// .hero__tags : primitive de layout globale (app/assets/scss/base/_layout.scss).
app/pages/index.vue:439:// ---- Aperçu services (porté de .grid-3 / .offer*) ----
app/pages/index.vue:440:.grid-3 {
app/pages/index.vue:524:// ---- Projets sélectionnés (porté de StatsProjects / .grid-2 / .prose) ----
app/pages/index.vue:525:.grid-2 {
app/pages/index.vue:538:// Carte rendue en lien (`as="a"`) : neutralise le soulignement par défaut du
app/pages/index.vue:539:// <a> (le contenu porte ses propres couleurs/typo). ZCard reste générique.
app/pages/index.vue:581:  .grid-3,
app/pages/index.vue:582:  .grid-2 {
app/pages/index.vue:597:// ZCard, focus via box-shadow) est un correctif central qui relève d'Epic 9.
app/components/MainComponent.vue:3:    <slot />
app/pages/blog/[...slug].vue:11:          <ul v-if="page.tags?.length" class="hero__tags article__tags">
app/pages/blog/[...slug].vue:48:            <ZButton :as="NuxtLink" to="/contact" variant="primary">
app/pages/blog/[...slug].vue:155:// .section / .container / .prose / .hero__tags / .post__meta sont des primitives de
app/pages/services.vue:13:        <ul class="grid-3">
app/pages/services.vue:15:            <ZCard class="offer" :accent="offer.featured" :featured="offer.featured">
app/pages/services.vue:30:                  :as="NuxtLink"
app/pages/services.vue:39:            </ZCard>
app/pages/services.vue:52:          <li v-for="step in steps" :key="step.n" class="process__step">
app/pages/services.vue:54:            <h3 class="process__step-title">{{ step.title }}</h3>
app/pages/services.vue:60:          <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
app/pages/services.vue:169:// ---- Grille des offres (porté de kit.css : .grid-3 / .offer*) ----
app/pages/services.vue:170:.grid-3 {
app/pages/services.vue:294:.process__step-title {
app/pages/services.vue:314:  .grid-3,
app/components/WindowWrapperComponent.vue:22:            <slot />
app/pages/blog/index.vue:12:        <!-- Liste des articles (triés par date décroissante), cartes interactives -->
app/pages/blog/index.vue:15:            <ZCard :as="NuxtLink" :to="article.path" interactive class="post">
app/pages/blog/index.vue:27:                <ul v-if="article.tags?.length" class="hero__tags post__tags">
app/pages/blog/index.vue:43:            </ZCard>
app/pages/blog/index.vue:48:        <ZCard v-else-if="error" class="blog__notice" padded>
app/pages/blog/index.vue:61:        </ZCard>
app/pages/blog/index.vue:64:        <ZCard v-else class="blog__notice" padded>
app/pages/blog/index.vue:77:        </ZCard>
app/pages/blog/index.vue:85:// cartes ZCard interactives, méta mono, empty-state restylé. Contenu via @nuxt/content
app/pages/blog/index.vue:147:// .section / .container / .eyebrow / .prose / .hero__tags / .post__meta sont des
app/pages/blog/index.vue:180:// Carte article = ZCard interactive rendue en lien : grille vignette / contenu.
app/pages/blog/index.vue:220:// ---- Empty-state / erreur (ZCard centrée, illustration + message) ----
app/components/HexagonLinkComponent.vue:3:    <slot name="icon" />
app/components/HexagonLinkComponent.vue:4:    <span class="hex__label"><slot name="title" /></span>
app/components/HexagonLinkComponent.vue:11:defineProps<{
app/assets/scss/base/_motion.scss:6:// l'instantané. Les gardes par composant (ZCard / ZInput / ZTag / index.vue…)
app/assets/scss/base/_layout.scss:62:.hero__tags {
app/components/card/ZCardFooter.vue:11:  name: "ZCardFooter",
app/components/ui/ZIcon.vue:80:const props = withDefaults(defineProps<Props>(), {
app/assets/scss/abstract/_color.scss:75:// * Step 6 is designed for subtle borders on components which are not interactive.
app/assets/scss/abstract/_color.scss:77:// * Step 7 is designed for borders on interactive components, but can also be used for focus rings.
app/assets/scss/abstract/_color.scss:78:// * Step 8 is designed for borders on interactive components in their hover state.
app/components/ui/ZButton.vue:17:      <slot v-else name="icon" />
app/components/ui/ZButton.vue:19:    <slot />
app/components/ui/ZButton.vue:22:      <slot v-else name="iconRight" />
app/components/ui/ZButton.vue:55:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZButton.vue:244:// Parité a11y avec les autres primitives (ZCard/ZInput/ZTag) : pas de transition
app/components/card/ZCardBody.vue:3:    <slot name="title" />
app/components/card/ZCardBody.vue:4:    <slot name="body" />
app/components/card/ZCardBody.vue:10:  name: "ZCardBody",
app/components/card/ZCardBody.vue:19:  // illisible sur le fond sombre --bg-card de ZCard → encre claire --text-strong.
app/components/ui/ZCard.vue:8:      'zcard--interactive': interactive,
app/components/ui/ZCard.vue:13:    <slot />
app/components/ui/ZCard.vue:30:  interactive?: boolean;
app/components/ui/ZCard.vue:41:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZCard.vue:42:  interactive: false,
app/components/ui/ZCard.vue:85:.zcard--interactive {
app/components/ui/ZCard.vue:95:  // (`as="a"`, ex. cartes projet story 3.3), elle est focusable — sans cette règle,
app/components/ui/ZCard.vue:126:  .zcard--interactive:hover {
app/components/ui/ZBadge.vue:4:    <slot />
app/components/ui/ZBadge.vue:19:withDefaults(defineProps<Props>(), {
app/components/ui/ZTag.vue:12:    <slot />
app/components/ui/ZTag.vue:35:withDefaults(defineProps<Props>(), {
app/components/card/ZCardHeader.vue:26:  name: "ZCardHeader",
app/components/ui/ZAvatar.vue:31:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZInput.vue:22:        <slot v-else name="icon" />
app/components/ui/ZInput.vue:71:const props = withDefaults(defineProps<Props>(), {
app/components/terminal/TerminalComponent.vue:77:  defineProps<{

exec
/bin/zsh -lc "git status --short && rg --files | rg '(test|spec|playwright|cypress|vitest|package.json|10-2)' | head -200" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
 M app/assets/scss/base/_layout.scss
 M app/pages/contact.vue
 M app/pages/index.vue
 M app/pages/services.vue
 M docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md
 M docs/implementation-artifacts/sprint-status.yaml
?? docs/implementation-artifacts/code-reviews/
package.json
docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md
docs/implementation-artifacts/code-reviews/10-2/prompt-acceptance-auditor.md
docs/implementation-artifacts/code-reviews/10-2/full.diff
docs/implementation-artifacts/code-reviews/10-2/prompt-blind-hunter.md
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json
docs/implementation-artifacts/code-reviews/10-2/prompt-edge-case-hunter.md
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md
docs/specs/spec-design-system-revamp/primitives.md
docs/specs/spec-design-system-revamp/SPEC.md
docs/specs/spec-design-system-revamp/pages.md
_bmad/scripts/tests/test_resolve_customization.py
_bmad/wds/data/agent-guides/freya/specification-quality.md

2026-09-13T07:35:32.818622Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '1,290p' app/components/ui/ZButton.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <component
    :is="as"
    v-bind="passthroughAttrs"
    class="zbtn"
    :class="[`zbtn--${variant}`, `zbtn--${size}`]"
    :type="buttonType"
    :disabled="isNativeButton ? disabled || undefined : undefined"
    :aria-disabled="!isNativeButton && disabled ? 'true' : undefined"
    :tabindex="isDisabledNonNative ? -1 : undefined"
    @click="blockDisabledActivation"
    @keydown.enter="blockDisabledActivation"
    @keydown.space="blockDisabledActivation"
  >
    <span v-if="icon || $slots.icon" class="zbtn__icon">
      <component :is="icon" v-if="icon" aria-hidden="true" />
      <slot v-else name="icon" />
    </span>
    <slot />
    <span v-if="iconRight || $slots.iconRight" class="zbtn__icon">
      <component :is="iconRight" v-if="iconRight" aria-hidden="true" />
      <slot v-else name="iconRight" />
    </span>
  </component>
</template>

<script setup lang="ts">
// Primitive bouton du DS — label mono, accent orange Ubuntu en primary.
// Porté de docs/design_system/components/core/Button.jsx (pas de copie JS :
// le CSS d'injection `ensureStyles()` devient un <style scoped> token-only).
import type { Component } from "vue";
import { computed, useAttrs } from "vue";

defineOptions({
  inheritAttrs: false,
});

type IconProp = string | Component;

interface Props {
  /** Style visuel. @default "primary" */
  variant?: "primary" | "secondary" | "ghost" | "terminal" | "danger";
  /** @default "md" — hauteurs 28 / 36 / 44 */
  size?: "sm" | "md" | "lg";
  /** Icône leading via composant Vue ou nom de composant. */
  icon?: IconProp;
  /** Icône trailing via composant Vue ou nom de composant. */
  iconRight?: IconProp;
  /** Élément rendu (polymorphe), ex. "a" pour un lien. @default "button" */
  as?: string | Component;
  /** Désactivé : natif sur <button>, aria-disabled + pointer-events sur les autres tags. */
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  icon: undefined,
  iconRight: undefined,
  as: "button",
  disabled: false,
});

const attrs = useAttrs();
// `as` accepte une balise native ("button", "a") ou une référence de composant
// (ex. NuxtLink importé de "#components") ; ne pas passer un nom de composant en chaîne.
const isNativeButton = computed(() => props.as === "button");
const isDisabledNonNative = computed(() => !isNativeButton.value && props.disabled);
const buttonType = computed(() => {
  if (!isNativeButton.value) {
    return undefined;
  }

  return typeof attrs.type === "string" ? attrs.type : "button";
});

const passthroughAttrs = computed(() => {
  if (!isDisabledNonNative.value) {
    return attrs;
  }

  return Object.fromEntries(
    Object.entries(attrs).filter(([key]) => {
      return key !== "href" && key !== "tabindex" && key !== "tabIndex" && !/^on[A-Z]/.test(key);
    }),
  );
});

function blockDisabledActivation(event: Event) {
  if (!isDisabledNonNative.value) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  if ("stopImmediatePropagation" in event) {
    event.stopImmediatePropagation();
  }
}
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern, custom-property-pattern -- convention DS portée depuis Button.jsx */
.zbtn {
  --_h: 36px;
  --_px: var(--space-4);
  --_fs: var(--fs-sm);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  box-sizing: border-box;
  height: var(--_h);
  padding: 0 var(--_px);
  font-family: var(--font-mono);
  font-size: var(--_fs);
  font-weight: var(--fw-medium);
  line-height: 1;
  letter-spacing: var(--ls-wide);
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  transition:
    background var(--dur-fast) var(--ease-standard),
    border-color var(--dur-fast) var(--ease-standard),
    color var(--dur-fast) var(--ease-standard),
    transform var(--dur-fast) var(--ease-standard);

  &:focus-visible {
    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
    // relais), mais rendu en couleur système sous forced-colors (Windows High
    // Contrast), où les box-shadow sont neutralisées — focus toujours visible (AC #2).
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }

  &:disabled,
  &[aria-disabled="true"] {
    opacity: 0.45;
    cursor: not-allowed;
    pointer-events: none;
  }
}

.zbtn__icon {
  display: inline-flex;
  width: 1.05em;
  height: 1.05em;

  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}

// ---- Tailles ----
.zbtn--sm {
  --_h: 28px;
  --_px: var(--space-3);
  --_fs: var(--fs-xs);
}

.zbtn--lg {
  --_h: 44px;
  --_px: var(--space-5);
  --_fs: var(--fs-base);
}

// ---- Variantes ----
.zbtn--primary {
  background: var(--accent);
  color: var(--accent-text);
  border-color: var(--accent);

  &:hover {
    background: var(--accent-hover);
    border-color: var(--accent-hover);
  }

  &:active {
    background: var(--accent-active);
    border-color: var(--accent-active);
    transform: translateY(1px);
  }
}

.zbtn--secondary {
  background: var(--surface-2);
  color: var(--text-strong);
  border-color: var(--border-default);

  &:hover {
    background: var(--surface-3);
    border-color: var(--border-strong);
  }

  &:active {
    transform: translateY(1px);
  }
}

.zbtn--ghost {
  background: transparent;
  color: var(--text-body);
  border-color: transparent;

  &:hover {
    background: var(--surface-2);
    color: var(--text-strong);
  }
}

.zbtn--terminal {
  background: var(--bg-terminal);
  color: var(--term-green);
  border-color: var(--accent-2-soft);

  &:hover {
    border-color: var(--term-green);
    box-shadow: var(--glow-terminal);
  }
}

.zbtn--danger {
  background: var(--danger);
  color: var(--ink-on-accent);
  border-color: var(--danger);

  &:hover {
    filter: brightness(1.08);
  }

  &:active {
    transform: translateY(1px);
  }
}

// Parité a11y avec les autres primitives (ZCard/ZInput/ZTag) : pas de transition
// de mouvement en motion réduit. Le filet global (base/_motion.scss) couvre aussi
// ce cas ; on garde la garde locale pour que la primitive soit robuste en isolation.
@media (prefers-reduced-motion: reduce) {
  .zbtn {
    transition: none;
  }
}
</style>

exec
/bin/zsh -lc "sed -n '1,145p' app/pages/index.vue; sed -n '1,100p' app/pages/services.vue; sed -n '1,145p' app/pages/contact.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <main class="home">
    <section class="hero hero__grad">
      <div class="hero__in container">
        <div class="hero__grid">
          <!-- Colonne gauche : accroche, CTA, tags -->
          <div class="anim hero__text">
            <p class="eyebrow">// développeur web freelance</p>
            <h1 class="hero__title">Du code <em>sur-mesure</em>,<br />de l'IA <em>utile</em>.</h1>
            <p class="hero__sub">{{ tagline }}</p>
            <div class="hero__cta">
              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
                Démarrer un projet
                <template #iconRight><ZIcon name="arrow" /></template>
              </ZButton>
              <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir les services </ZButton>
            </div>
            <ul class="hero__tags">
              <li v-for="tag in tags" :key="tag">
                <ZTag>{{ tag }}</ZTag>
              </li>
            </ul>
          </div>

          <!-- Colonne droite : fenêtre terminal décorative (statique) -->
          <div class="anim hero__term-col">
            <div class="hero-term">
              <div class="hero-term__bar">
                <span class="hero-term__dots" aria-hidden="true">
                  <span class="hero-term__dot hero-term__dot--close" />
                  <span class="hero-term__dot hero-term__dot--min" />
                  <span class="hero-term__dot hero-term__dot--max" />
                </span>
                <span class="hero-term__title">anon.@jouan.ovh: ~</span>
              </div>

              <div class="hero-term__body">
                <template v-for="row in terminalRows" :key="row.id">
                  <p class="hero-term__line" aria-hidden="true">
                    <span class="prm"
                      ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
                      ><span class="prm__dir">~</span><span class="prm__sep">$ </span
                      ><span class="prm__cmd">{{ row.cmd }}</span></span
                    >
                  </p>
                  <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
                </template>

                <button
                  type="button"
                  class="hero-term__open"
                  aria-label="Ouvrir le terminal interactif"
                  @click="openTerminal"
                >
                  <span class="prm"
                    ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
                    ><span class="prm__dir">~</span><span class="prm__sep">$ </span><span class="prm__cmd">help</span
                    ><span class="prm__caret" aria-hidden="true"
                  /></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Aperçu services (porté de ServicesPreview, Home.jsx) -->
    <section class="section">
      <div class="container">
        <p class="eyebrow">// ce que je fais</p>
        <h2 class="section__title">Trois façons de travailler ensemble</h2>
        <ul class="grid-3">
          <li v-for="service in services" :key="service.id">
            <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
              <h3 class="offer__title">{{ service.title }}</h3>
              <p class="offer__desc">{{ service.desc }}</p>
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

        <h2 class="eyebrow">// projets sélectionnés</h2>
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
    id: "apps",
<template>
  <main class="services">
    <!-- En-tête + grille d'offres (story 4.1). La 2e section (process) viendra en 4.2. -->
    <section class="section">
      <div class="container">
        <p class="eyebrow">// services</p>
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
        <p class="eyebrow">// comment ça se passe</p>
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
            Demander un devis
            <template #iconRight><ZIcon name="arrow" /></template>
          </ZButton>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Page Services — en-tête + grille des 3 offres (story 4.1) puis section process
// (4 étapes ordonnées + CTA « Demander un devis », story 4.2). Porté de Services.jsx
// du UI kit : recréation Vue 3 + tokens (aucune copie JSX). Dark-first, accent orange.
import { NuxtLink } from "#components";

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
<template>
  <main class="contact">
    <section class="section">
      <div class="container">
        <div class="contact__grid">
          <!-- Colonne gauche : en-tête + formulaire (story 7.1) -->
          <div class="contact__main">
            <p class="eyebrow">// contact</p>
            <h1 class="contact__title">Parlons de votre projet</h1>
            <p class="prose contact__intro">
              Une idée, un site à refaire, une automatisation à mettre en place ? Décrivez-moi le besoin — je réponds
              sous 48h.
            </p>

            <!-- État « envoyé » : carte accent + ligne mono verte. role="status" + focus
                 programmatique (tabindex -1) → annonce fiable aux lecteurs d'écran. -->
            <ZCard v-if="sent" ref="sentCard" accent class="contact__sent" role="status" tabindex="-1">
              <p class="contact__sent-line"><span aria-hidden="true">✓</span> Message envoyé</p>
              <p class="prose contact__sent-text">Merci ! Je vous réponds très vite à votre adresse.</p>
            </ZCard>

            <!-- Formulaire — envoi via Web3Forms (service sans serveur, clé en env). Validation
                 front d'abord ; `novalidate` pour afficher nos messages FR (et non les bulles
                 natives). Compatible site statique : le fetch ne tourne qu'au clic, côté client. -->
            <form v-else ref="formRef" class="contact__form" novalidate @submit.prevent="onSubmit">
              <!-- Honeypot anti-spam : hors flux visuel et hors tabulation ; rempli = bot. -->
              <div class="contact__hp" aria-hidden="true">
                <label>
                  Ne remplissez pas ce champ
                  <input v-model="honeypot" type="text" tabindex="-1" autocomplete="off" />
                </label>
              </div>

              <div class="contact__row">
                <ZInput
                  v-model="form.name"
                  label="Nom"
                  placeholder="Votre nom"
                  required
                  autocomplete="name"
                  :error="Boolean(errors.name)"
                  :hint="errors.name"
                />
                <ZInput
                  v-model="form.email"
                  label="Email"
                  type="email"
                  placeholder="vous@exemple.com"
                  required
                  autocomplete="email"
                  :error="Boolean(errors.email)"
                  :hint="errors.email"
                />
              </div>
              <ZInput
                v-model="form.subject"
                label="Sujet"
                placeholder="Site WordPress, application, IA…"
                autocomplete="off"
              />
              <ZInput
                v-model="form.message"
                label="Message"
                multiline
                placeholder="Parlez-moi de votre projet…"
                required
                :error="Boolean(errors.message)"
                :hint="errors.message"
              />

              <!-- Erreur d'envoi réseau (distincte des erreurs de validation par champ). -->
              <p v-if="submitError" class="contact__error" role="alert">{{ submitError }}</p>

              <div>
                <ZButton type="submit" variant="primary" size="lg" :disabled="sending">
                  {{ sending ? "Envoi en cours…" : "Envoyer le message" }}
                  <template #iconRight><ZIcon name="arrow" /></template>
                </ZButton>
              </div>

              <p class="contact__rgpd">
                En envoyant ce formulaire, vos nom, email et message sont transmis via Web3Forms à seule fin de traiter
                votre demande.
              </p>
            </form>
          </div>

          <!-- Colonne droite (story 7.2) : carte infos + carte CTA terminal + hexagones sociaux -->
          <div class="contact__info">
            <!-- Carte infos : email / localisation / disponibilité -->
            <ZCard class="contact__infocard">
              <dl class="contact__infolist">
                <div class="infoitem">
                  <dt class="infoitem__k"><span aria-hidden="true">// </span>email</dt>
                  <dd class="infoitem__v">
                    <a class="contact__email" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
                  </dd>
                </div>
                <div class="infoitem">
                  <dt class="infoitem__k"><span aria-hidden="true">// </span>localisation</dt>
                  <dd class="infoitem__v">{{ contact.city }}</dd>
                </div>
                <div class="infoitem">
                  <dt class="infoitem__k"><span aria-hidden="true">// </span>disponibilité</dt>
                  <dd class="infoitem__v">
                    <div class="contact__avail"><ZBadge tone="success" dot>Ouvert aux missions freelance</ZBadge></div>
                  </dd>
                </div>
              </dl>
            </ZCard>

            <!-- Carte CTA terminal : ouvre l'easter-egg via le lanceur partagé (useTerminal) -->
            <ZCard class="contact__term">
              <!-- Prompt décoratif (flavor terminal) : aria-hidden — le bouton + l'invite portent le sens. -->
              <p class="contact__prompt" aria-hidden="true">
                anon.@jouan.ovh:~$ <span class="contact__prompt-cmd">./contact</span>
              </p>
              <p class="prose contact__term-text">Vous préférez la ligne de commande ? Ouvrez le terminal.</p>
              <ZButton variant="terminal" size="sm" aria-haspopup="dialog" @click="openTerminal">
                <template #icon><ZIcon name="terminal" /></template>
                Ouvrir le terminal
              </ZButton>
            </ZCard>

            <!-- Hexagones sociaux (composant partagé avec le footer) -->
            <LinkListComponent />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Page Contact — colonne gauche : en-tête + formulaire (story 7.1, envoi Web3Forms,
// service tiers SANS serveur). Colonne droite : infos + CTA terminal + socials (story 7.2).
import { nextTick } from "vue";
import { SITE } from "~/data/site";

// Infos de contact — source unique `app/data/site.ts`.
const contact = SITE.profile;

// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le header).
// no-op au prerender (aucun lanceur) → prerender-safe ; ouvre le terminal côté client.
const { open: openTerminal } = useTerminal();

exec
/bin/zsh -lc "sed -n '1,180p' app/components/ui/ZCard.vue" in /Users/simon/dev/jouan.ovh
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

exec
/bin/zsh -lc "sed -n '1,120p' app/assets/scss/base/_layout.scss; sed -n '430,620p' app/pages/index.vue; sed -n '160,330p' app/pages/services.vue; sed -n '350,440p' app/pages/contact.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
// ============================================================
//  Primitives de layout du design system — GLOBALES
//
//  .section / .section--sunken / .container / .eyebrow / .prose
//  Portées de docs/design_system/ui_kits/jouan-site/kit.css.
//  Mutualisées ici (chargées par main.scss) plutôt que redéclarées
//  à l'identique en <style scoped> dans chaque page (index, services,
//  about, …). Tokens uniquement — aucune valeur en dur (CAP-2).
// ============================================================

/* stylelint-disable selector-class-pattern -- convention DS BEM (.section--sunken) portée depuis kit.css */

// Bloc de section vertical. padding-block uniquement : le gutter
// horizontal vient de .container (enfant) — évite le conflit de
// shorthand padding multi-axes (cf. project-context, piège story 3.1).
.section {
  padding-block: var(--space-16);
}

// Section en creux : fond teinté + filets haut/bas.
.section--sunken {
  background: var(--bg-sunken);
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}

// Conteneur centré à largeur max ; gutter horizontal en longhand.
.container {
  width: 100%;
  max-width: var(--container-xl);
  margin: 0 auto;
  padding-inline: var(--space-6);
}

// Sur-titre mono en capitales espacées, accent orange.
// font-weight et line-height neutralisés pour un rendu identique lorsqu'appliqué sur un <h2 class="eyebrow">.
.eyebrow {
  margin: 0 0 var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: var(--fw-regular);
  line-height: inherit;
  letter-spacing: var(--ls-wider);
  text-transform: uppercase;
  color: var(--accent);
}

// Variante discrète (sur-titre secondaire, ex. « // stack »).
.eyebrow--muted {
  color: var(--text-muted);
}

// Texte long-forme : Ubuntu sans, interligne détendu.
.prose {
  font-family: var(--font-sans);
  line-height: var(--lh-relaxed);
  color: var(--text-body);
}

// Rangée de tags (chips) qui passent à la ligne — hero, stack /about, etc.
// Reset de liste inclus pour un rendu propre en <ul>/<li> (no-op sur un <div>).
.hero__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

// Ligne de méta mono discrète, items séparés par « · » (porté de kit.css .post__meta).
// Réutilisée par le feed blog (/blog) et l'en-tête d'article (/blog/[...slug]).
.post__meta {
  display: flex;
  gap: var(--space-3);
  align-items: center;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);

  // Contraste (story 9.2) : méta d'article (date · lecture) = info réelle → palier
  // au-dessus (--text-faint échouait ~2.95:1 sur carte ; --text-muted ≥ 4.5:1).
  color: var(--text-muted);
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

.offer__more {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--accent);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: none;
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
}

.projects {
  margin-top: var(--space-5);
}

// Carte rendue en lien (`as="a"`) : neutralise le soulignement par défaut du
// <a> (le contenu porte ses propres couleurs/typo). ZCard reste générique.
.project {
  text-decoration: none;
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
  .anim,
  .prm__caret {
    animation: none;
  }
}

// Mode contraste forcé (forced-colors) : les `box-shadow` (ring de focus) sont
// neutralisées → on restaure un outline système visible sur les éléments focusables
// propres à cette page. Le repli équivalent pour les primitives DS (ZButton/ZTag/
// ZCard, focus via box-shadow) est un correctif central qui relève d'Epic 9.
@media (forced-colors: active) {
  .hero-term__open:focus-visible,
  .offer__more:focus-visible {
    outline: 2px solid;
    outline-offset: 2px;
  }
}
</style>
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
}

// `display:flex` (porté de l'inline JSX) : le prix + CTA sont poussés en bas via
// `margin-top: auto`, alignant les pieds de carte sur des hauteurs inégales.
.offer {
  display: flex;
  flex-direction: column;
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
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    padding: var(--space-1) 0 var(--space-1) var(--space-5);
    font-family: var(--font-mono);
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }

  // Puce fléchée « → » (porté de kit.css .offer li::before).
  li::before {
    content: "→";
    position: absolute;
    left: 0;
    color: var(--accent);
  }
}

.offer__price {
  // `margin-top: auto` colle le prix (et le CTA qui suit) au bas de la carte ;
  // `padding-top` reprend l'inline JSX (space-5) au lieu du margin-top du kit.
  margin-top: auto;
  padding-top: var(--space-5);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);

  b {
    font-size: var(--fs-lg);
    font-weight: var(--fw-bold);
    color: var(--text-strong);
  }
}

.offer__cta {
  margin-top: var(--space-4);
}

// Bouton CTA en pleine largeur (porté de l'inline `width: 100%` du JSX).
.offer__btn {
  width: 100%;
}

// ---- Section process (porté de Services.jsx L45-61) ----
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

.process__cta {
  margin-top: var(--space-12);
  text-align: center;
}

// ---- Responsive (cf. kit.css @media max-width: 900px) ----
@media (width <= 900px) {
  .grid-3,
  .process {
    grid-template-columns: 1fr;
  }
}
</style>
  color: var(--term-green);
}

.contact__sent-text {
  margin: 0;
  font-size: var(--fs-sm);
}

// ============================================================
//  Colonne droite (story 7.2) : infos / CTA terminal / socials
// ============================================================
// Colonne (porté de kit.css : .contact__info — flex column).
.contact__info {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

// ---- Carte infos (porté de kit.css : .infoitem / .k / .v) ----
.contact__infolist {
  margin: 0;
  padding: 0;
}

.infoitem {
  font-family: var(--font-mono);

  &:not(:last-child) {
    margin-bottom: var(--space-5);
  }
}

.infoitem__k {
  font-size: var(--fs-xs);
  font-weight: var(--fw-regular);
  letter-spacing: var(--ls-wider);
  text-transform: uppercase;
  color: var(--text-muted);
}

.infoitem__v {
  margin: 0;
  font-size: var(--fs-md);
  color: var(--text-strong);
}

// Lien email en bleu terminal (porté de Contact.jsx), ring de focus accessible.
.contact__email {
  text-decoration: none;
  color: var(--term-blue);

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 2px;
    border-radius: var(--radius-xs);
    box-shadow: var(--ring-accent);
  }
}

.contact__avail {
  margin-top: var(--space-2);
}

// ---- Carte CTA terminal (porté de Contact.jsx : Card .offer fond terminal) ----
// Surcharge du fond/bordure de ZCard ; nesting sous .contact__info pour la spécificité.
.contact__info .contact__term {
  background: var(--bg-terminal);
  border-color: var(--accent-2-soft);
}

.contact__prompt {
  margin: 0 0 var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--term-green);
}

// Commande tapée : off-white (porté de l'inline ink-1 de Contact.jsx).
.contact__prompt-cmd {
  color: var(--text-strong);
}

.contact__term-text {
  margin: 0 0 var(--space-3);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

2026-09-13T07:35:39.558402Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "rg -n \"TerminalManager|role=\\\"dialog\\\"|aria-modal|createNewTerminal|openTerminal|terminal\" app/components app/layouts app | head -240" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc 'rg -n "font-weight|line-height|h2|eyebrow|ul|ol|dl|grid-3|grid-2|process" docs/specs docs/implementation-artifacts app/assets app/pages | head -260' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/components/HeaderComponent.vue:25:        <ZButton variant="terminal" size="sm" class="hdr__action" @click="addNewTerminal">
app/components/HeaderComponent.vue:26:          <template #icon><ZIcon name="terminal" /></template>
app/components/HeaderComponent.vue:64:        <ZButton variant="terminal" size="sm" @click="openTerminalFromMenu">
app/components/HeaderComponent.vue:65:          <template #icon><ZIcon name="terminal" /></template>
app/components/HeaderComponent.vue:74:    <TerminalManagerComponent ref="terminalManager" />
app/components/HeaderComponent.vue:82:import TerminalManagerComponent from "~/components/terminal/TerminalManagerComponent.vue";
app/components/HeaderComponent.vue:103:const terminalManager = ref<InstanceType<typeof TerminalManagerComponent> | null>(null);
app/components/HeaderComponent.vue:106:  terminalManager.value?.createNewTerminal();
app/components/HeaderComponent.vue:109:// Expose l'ouverture du terminal au reste du site via le lanceur partagé
app/components/HeaderComponent.vue:153:function openTerminalFromMenu() {
app/pages/blog/[...slug].vue:62:// palette terminale (Shiki désactivé, cf. nuxt.config), CTA de fin. Contenu via
app/pages/blog/[...slug].vue:285:  // Bloc de code : palette terminale (fond aubergine, mono off-white). Shiki est
app/pages/blog/[...slug].vue:295:    background: var(--bg-terminal);
app/pages/blog/[...slug].vue:300:  // Code inline = vert terminal ; le code en bloc hérite la couleur du <pre> (off-white).
app/pages/contact.vue:88:          <!-- Colonne droite (story 7.2) : carte infos + carte CTA terminal + hexagones sociaux -->
app/pages/contact.vue:112:            <!-- Carte CTA terminal : ouvre l'easter-egg via le lanceur partagé (useTerminal) -->
app/pages/contact.vue:114:              <!-- Prompt décoratif (flavor terminal) : aria-hidden — le bouton + l'invite portent le sens. -->
app/pages/contact.vue:118:              <p class="prose contact__term-text">Vous préférez la ligne de commande ? Ouvrez le terminal.</p>
app/pages/contact.vue:119:              <ZButton variant="terminal" size="sm" aria-haspopup="dialog" @click="openTerminal">
app/pages/contact.vue:120:                <template #icon><ZIcon name="terminal" /></template>
app/pages/contact.vue:121:                Ouvrir le terminal
app/pages/contact.vue:136:// service tiers SANS serveur). Colonne droite : infos + CTA terminal + socials (story 7.2).
app/pages/contact.vue:143:// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le header).
app/pages/contact.vue:144:// no-op au prerender (aucun lanceur) → prerender-safe ; ouvre le terminal côté client.
app/pages/contact.vue:145:const { open: openTerminal } = useTerminal();
app/pages/contact.vue:359://  Colonne droite (story 7.2) : infos / CTA terminal / socials
app/pages/contact.vue:396:// Lien email en bleu terminal (porté de Contact.jsx), ring de focus accessible.
app/pages/contact.vue:417:// ---- Carte CTA terminal (porté de Contact.jsx : Card .offer fond terminal) ----
app/pages/contact.vue:420:  background: var(--bg-terminal);
app/components/terminal/interfaces/IProgram.ts:1:import type { ITerminalConfig } from "~/components/terminal/interfaces/ITerminalConfig";
app/components/terminal/interfaces/IProgram.ts:9:    createNewTerminal?: (config?: ITerminalConfig) => void,
app/pages/index.vue:25:          <!-- Colonne droite : fenêtre terminal décorative (statique) -->
app/pages/index.vue:38:                <template v-for="row in terminalRows" :key="row.id">
app/pages/index.vue:52:                  aria-label="Ouvrir le terminal interactif"
app/pages/index.vue:53:                  @click="openTerminal"
app/pages/index.vue:135:// `id` = clé v-for stable (indépendante du contenu affiché), cohérent avec terminalRows.
app/pages/index.vue:170:// Lignes du terminal décoratif, fidèles à HeroTerminal (Home.jsx). Codées en dur
app/pages/index.vue:173:const terminalRows = [
app/pages/index.vue:179:// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le
app/pages/index.vue:180:// header). No-op tant qu'aucun terminal n'est disponible (prerender). La
app/pages/index.vue:181:// restylisation du terminal lui-même relève d'Epic 8.
app/pages/index.vue:182:const { open: openTerminal } = useTerminal();
app/pages/index.vue:273:// ---- Fenêtre terminal décorative (porté de TerminalWindow.jsx / Prompt.jsx) ----
app/pages/index.vue:287:  box-shadow: var(--glow-terminal);
app/pages/index.vue:345:  background: var(--bg-terminal);
app/pages/index.vue:351:    background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
app/pages/index.vue:376:// Ligne « help » cliquable → ouvre l'easter-egg terminal (bouton natif = clavier OK).
app/pages/index.vue:427:  // Seule animation en boucle de l'UI (caret terminal). Keyframe globale (_root.scss).
app/components/HeaderComponent.vue:25:        <ZButton variant="terminal" size="sm" class="hdr__action" @click="addNewTerminal">
app/components/HeaderComponent.vue:26:          <template #icon><ZIcon name="terminal" /></template>
app/components/HeaderComponent.vue:64:        <ZButton variant="terminal" size="sm" @click="openTerminalFromMenu">
app/components/HeaderComponent.vue:65:          <template #icon><ZIcon name="terminal" /></template>
app/components/HeaderComponent.vue:74:    <TerminalManagerComponent ref="terminalManager" />
app/components/HeaderComponent.vue:82:import TerminalManagerComponent from "~/components/terminal/TerminalManagerComponent.vue";
app/components/HeaderComponent.vue:103:const terminalManager = ref<InstanceType<typeof TerminalManagerComponent> | null>(null);
app/components/HeaderComponent.vue:106:  terminalManager.value?.createNewTerminal();
app/components/HeaderComponent.vue:109:// Expose l'ouverture du terminal au reste du site via le lanceur partagé
app/components/HeaderComponent.vue:153:function openTerminalFromMenu() {
app/components/terminal/interfaces/IProgramManager.ts:1:import type { IProgram } from "~/components/terminal/interfaces/IProgram";
app/components/terminal/programs/Projets.ts:2:import type { IProgram } from "~/components/terminal/interfaces";
app/components/terminal/TerminalManagerComponent.vue:3:    <div v-for="(terminal, index) in terminals" :key="index">
app/components/terminal/TerminalManagerComponent.vue:6:        :create-new-terminal="createNewTerminal"
app/components/terminal/TerminalManagerComponent.vue:7:        :terminal-config="terminal.terminalConfig"
app/components/terminal/TerminalManagerComponent.vue:14:import type { ITerminalConfig } from "~/components/terminal/interfaces";
app/components/terminal/TerminalManagerComponent.vue:18:defineOptions({ name: "TerminalManagerComponent" });
app/components/terminal/TerminalManagerComponent.vue:20:const terminals = ref<Array<{ id: string; terminalConfig: ITerminalConfig }>>([]);
app/components/terminal/TerminalManagerComponent.vue:22:const createNewTerminal = (terminalConfig: ITerminalConfig = {}) => {
app/components/terminal/TerminalManagerComponent.vue:23:  // Créez une nouvelle instance de terminal et ajoutez-la à la liste des terminaux.
app/components/terminal/TerminalManagerComponent.vue:26:    terminalConfig,
app/components/terminal/TerminalManagerComponent.vue:28:  terminals.value.push(newTerminal);
app/components/terminal/TerminalManagerComponent.vue:33:// (`terminalManager.value?.createNewTerminal()`, HeaderComponent.vue). Le hero et /contact
app/components/terminal/TerminalManagerComponent.vue:36:defineExpose({ createNewTerminal });
app/components/terminal/TerminalComponent.vue:3:    Téléporté sur <body> : le terminal est monté dans le <header>, qui porte un
app/components/terminal/TerminalComponent.vue:10:    <div ref="terminalElement" :data-id="id" class="terminal" @click="focusUserInput" @keydown.esc="closeTerminal">
app/components/terminal/TerminalComponent.vue:11:      <div class="terminal-header" @mousedown="handleHeaderMouseDown" @mouseup="handleMouseUp">
app/components/terminal/TerminalComponent.vue:12:        <div class="terminal-dots">
app/components/terminal/TerminalComponent.vue:17:            aria-label="Fermer le terminal"
app/components/terminal/TerminalComponent.vue:22:          <span class="terminal-dot terminal-dot--min" aria-hidden="true"></span>
app/components/terminal/TerminalComponent.vue:23:          <span class="terminal-dot terminal-dot--max" aria-hidden="true"></span>
app/components/terminal/TerminalComponent.vue:28:      <div class="terminal-body">
app/components/terminal/TerminalComponent.vue:31:            <!-- eslint-disable-next-line vue/no-v-html -- sortie générée en interne par les programmes du terminal (contenu maîtrisé) -->
app/components/terminal/TerminalComponent.vue:32:            <span class="terminal-response" v-html="line.text"></span>
app/components/terminal/TerminalComponent.vue:51:          aria-label="Saisie de commande du terminal"
app/components/terminal/TerminalComponent.vue:65:import type { ITerminalConfig } from "~/components/terminal/interfaces";
app/components/terminal/TerminalComponent.vue:66:import programManager from "~/components/terminal/programs/ProgramManager";
app/components/terminal/TerminalComponent.vue:70:import { terminalDefaults } from "~/terminal.config";
app/components/terminal/TerminalComponent.vue:79:    createNewTerminal?: (config?: ITerminalConfig) => void;
app/components/terminal/TerminalComponent.vue:80:    terminalConfig?: ITerminalConfig;
app/components/terminal/TerminalComponent.vue:84:    createNewTerminal: () => {},
app/components/terminal/TerminalComponent.vue:85:    terminalConfig: () => ({}),
app/components/terminal/TerminalComponent.vue:94:const terminalElement = ref<HTMLElement | null>(null);
app/components/terminal/TerminalComponent.vue:102:  width: props.terminalConfig.width || terminalDefaults.width,
app/components/terminal/TerminalComponent.vue:103:  height: props.terminalConfig.height || terminalDefaults.height,
app/components/terminal/TerminalComponent.vue:104:  userName: props.terminalConfig.userName || terminalDefaults.userName,
app/components/terminal/TerminalComponent.vue:105:  domainName: props.terminalConfig.domainName || terminalDefaults.domainName,
app/components/terminal/TerminalComponent.vue:106:  initialData: props.terminalConfig.initialData || terminalDefaults.initialData,
app/components/terminal/TerminalComponent.vue:117:  if (terminalElement.value) {
app/components/terminal/TerminalComponent.vue:119:    terminalElement.value.style.zIndex = (Date.now() % 2147483647).toString();
app/components/terminal/TerminalComponent.vue:169:      props.createNewTerminal as (config?: ITerminalConfig) => void,
app/components/terminal/TerminalComponent.vue:207:  if (resizing.value && terminalElement.value) {
app/components/terminal/TerminalComponent.vue:208:    const terminalRect = terminalElement.value.getBoundingClientRect();
app/components/terminal/TerminalComponent.vue:211:    const newWidth = Math.max(minWidth, event.clientX - terminalRect.left);
app/components/terminal/TerminalComponent.vue:212:    const newHeight = Math.max(minHeight, event.clientY - terminalRect.top);
app/components/terminal/TerminalComponent.vue:214:    terminalElement.value.style.width = `${newWidth}px`;
app/components/terminal/TerminalComponent.vue:215:    terminalElement.value.style.height = `${newHeight}px`;
app/components/terminal/TerminalComponent.vue:235:    event.target.classList.contains("terminal-header")
app/components/terminal/TerminalComponent.vue:251:  if (dragging.value && terminalElement.value) {
app/components/terminal/TerminalComponent.vue:252:    const terminalElementValue = terminalElement.value;
app/components/terminal/TerminalComponent.vue:253:    // Borne haute clampée à 0 : si le terminal est plus large/haut que le viewport,
app/components/terminal/TerminalComponent.vue:255:    const maxLeft = Math.max(0, window.innerWidth - terminalElementValue.offsetWidth);
app/components/terminal/TerminalComponent.vue:256:    const maxTop = Math.max(0, window.innerHeight - terminalElementValue.offsetHeight);
app/components/terminal/TerminalComponent.vue:260:    terminalElementValue.style.left = `${newLeft}px`;
app/components/terminal/TerminalComponent.vue:261:    terminalElementValue.style.top = `${newTop}px`;
app/components/terminal/TerminalComponent.vue:277:  if (terminalElement.value) {
app/components/terminal/TerminalComponent.vue:278:    terminalElement.value.style.width = defaultConfig.value.width;
app/components/terminal/TerminalComponent.vue:279:    terminalElement.value.style.height = defaultConfig.value.height;
app/components/terminal/TerminalComponent.vue:284:  if (terminalElement.value) {
app/components/terminal/TerminalComponent.vue:285:    terminalElement.value.style.display = "none";
app/components/terminal/TerminalComponent.vue:294:  // Mémorise le déclencheur AVANT de déplacer le focus dans le terminal : à ce
app/components/terminal/TerminalComponent.vue:295:  // stade, l'élément actif est encore le bouton qui a ouvert le terminal.
app/components/terminal/TerminalComponent.vue:320:.terminal {
app/components/terminal/TerminalComponent.vue:323:  // handlers (terminal-header, close-button, user-input, resize-handle) sont préservées.
app/components/terminal/TerminalComponent.vue:324:  // `position: fixed` (et non absolute) : le terminal est <Teleport>é sur <body> (pour que
app/components/terminal/TerminalComponent.vue:340:  border: 1px solid var(--border-terminal);
app/components/terminal/TerminalComponent.vue:342:  box-shadow: var(--glow-terminal);
app/components/terminal/TerminalComponent.vue:357:    .terminal-dots {
app/components/terminal/TerminalComponent.vue:385:    .terminal-dot {
app/components/terminal/TerminalComponent.vue:392:    .terminal-dot--min {
app/components/terminal/TerminalComponent.vue:396:    .terminal-dot--max {
app/components/terminal/TerminalComponent.vue:423:    background: var(--bg-terminal);
app/components/terminal/TerminalComponent.vue:477:    .terminal-response {
app/components/terminal/TerminalComponent.vue:498:    .terminal-body {
app/components/terminal/TerminalComponent.vue:499:      background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
app/components/terminal/TerminalComponent.vue:549:      // --color-dark est redéfini localement ci-dessus (le bloc `.terminal` qui exposait
app/data/site.ts:6:// et les programmes terminal (`programs/Skills|Projets|Contact|About.ts`).
app/data/site.ts:9:// de détail divergent volontairement entre le CV terminal (`About.ts`, détaillé) et la page
app/components/terminal/TerminalComponent.vue:3:    Téléporté sur <body> : le terminal est monté dans le <header>, qui porte un
app/components/terminal/TerminalComponent.vue:10:    <div ref="terminalElement" :data-id="id" class="terminal" @click="focusUserInput" @keydown.esc="closeTerminal">
app/components/terminal/TerminalComponent.vue:11:      <div class="terminal-header" @mousedown="handleHeaderMouseDown" @mouseup="handleMouseUp">
app/components/terminal/TerminalComponent.vue:12:        <div class="terminal-dots">
app/components/terminal/TerminalComponent.vue:17:            aria-label="Fermer le terminal"
app/components/terminal/TerminalComponent.vue:22:          <span class="terminal-dot terminal-dot--min" aria-hidden="true"></span>
app/components/terminal/TerminalComponent.vue:23:          <span class="terminal-dot terminal-dot--max" aria-hidden="true"></span>
app/components/terminal/TerminalComponent.vue:28:      <div class="terminal-body">
app/components/terminal/TerminalComponent.vue:31:            <!-- eslint-disable-next-line vue/no-v-html -- sortie générée en interne par les programmes du terminal (contenu maîtrisé) -->
app/components/terminal/TerminalComponent.vue:32:            <span class="terminal-response" v-html="line.text"></span>
app/components/terminal/TerminalComponent.vue:51:          aria-label="Saisie de commande du terminal"
app/components/terminal/TerminalComponent.vue:65:import type { ITerminalConfig } from "~/components/terminal/interfaces";
app/components/terminal/TerminalComponent.vue:66:import programManager from "~/components/terminal/programs/ProgramManager";
app/components/terminal/TerminalComponent.vue:70:import { terminalDefaults } from "~/terminal.config";
app/components/terminal/TerminalComponent.vue:79:    createNewTerminal?: (config?: ITerminalConfig) => void;
app/components/terminal/TerminalComponent.vue:80:    terminalConfig?: ITerminalConfig;
app/components/terminal/TerminalComponent.vue:84:    createNewTerminal: () => {},
app/components/terminal/TerminalComponent.vue:85:    terminalConfig: () => ({}),
app/components/terminal/TerminalComponent.vue:94:const terminalElement = ref<HTMLElement | null>(null);
app/components/terminal/TerminalComponent.vue:102:  width: props.terminalConfig.width || terminalDefaults.width,
app/components/terminal/TerminalComponent.vue:103:  height: props.terminalConfig.height || terminalDefaults.height,
app/components/terminal/TerminalComponent.vue:104:  userName: props.terminalConfig.userName || terminalDefaults.userName,
app/components/terminal/TerminalComponent.vue:105:  domainName: props.terminalConfig.domainName || terminalDefaults.domainName,
app/components/terminal/TerminalComponent.vue:106:  initialData: props.terminalConfig.initialData || terminalDefaults.initialData,
app/components/terminal/TerminalComponent.vue:117:  if (terminalElement.value) {
app/components/terminal/TerminalComponent.vue:119:    terminalElement.value.style.zIndex = (Date.now() % 2147483647).toString();
app/components/terminal/TerminalComponent.vue:169:      props.createNewTerminal as (config?: ITerminalConfig) => void,
app/components/terminal/TerminalComponent.vue:207:  if (resizing.value && terminalElement.value) {
app/components/terminal/TerminalComponent.vue:208:    const terminalRect = terminalElement.value.getBoundingClientRect();
app/components/terminal/TerminalComponent.vue:211:    const newWidth = Math.max(minWidth, event.clientX - terminalRect.left);
app/components/terminal/TerminalComponent.vue:212:    const newHeight = Math.max(minHeight, event.clientY - terminalRect.top);
app/components/terminal/TerminalComponent.vue:214:    terminalElement.value.style.width = `${newWidth}px`;
app/components/terminal/TerminalComponent.vue:215:    terminalElement.value.style.height = `${newHeight}px`;
app/components/terminal/TerminalComponent.vue:235:    event.target.classList.contains("terminal-header")
app/components/terminal/TerminalComponent.vue:251:  if (dragging.value && terminalElement.value) {
app/components/terminal/TerminalComponent.vue:252:    const terminalElementValue = terminalElement.value;
app/components/terminal/TerminalComponent.vue:253:    // Borne haute clampée à 0 : si le terminal est plus large/haut que le viewport,
app/components/terminal/TerminalComponent.vue:255:    const maxLeft = Math.max(0, window.innerWidth - terminalElementValue.offsetWidth);
app/components/terminal/TerminalComponent.vue:256:    const maxTop = Math.max(0, window.innerHeight - terminalElementValue.offsetHeight);
app/components/terminal/TerminalComponent.vue:260:    terminalElementValue.style.left = `${newLeft}px`;
app/components/terminal/TerminalComponent.vue:261:    terminalElementValue.style.top = `${newTop}px`;
app/components/terminal/TerminalComponent.vue:277:  if (terminalElement.value) {
app/components/terminal/TerminalComponent.vue:278:    terminalElement.value.style.width = defaultConfig.value.width;
app/components/terminal/TerminalComponent.vue:279:    terminalElement.value.style.height = defaultConfig.value.height;
app/components/terminal/TerminalComponent.vue:284:  if (terminalElement.value) {
app/components/terminal/TerminalComponent.vue:285:    terminalElement.value.style.display = "none";
app/components/terminal/TerminalComponent.vue:294:  // Mémorise le déclencheur AVANT de déplacer le focus dans le terminal : à ce
app/components/terminal/TerminalComponent.vue:295:  // stade, l'élément actif est encore le bouton qui a ouvert le terminal.
app/components/terminal/TerminalComponent.vue:320:.terminal {
app/components/terminal/TerminalComponent.vue:323:  // handlers (terminal-header, close-button, user-input, resize-handle) sont préservées.
app/components/terminal/TerminalComponent.vue:324:  // `position: fixed` (et non absolute) : le terminal est <Teleport>é sur <body> (pour que
app/components/terminal/TerminalComponent.vue:340:  border: 1px solid var(--border-terminal);
app/components/terminal/TerminalComponent.vue:342:  box-shadow: var(--glow-terminal);
app/components/terminal/TerminalComponent.vue:357:    .terminal-dots {
app/components/terminal/TerminalComponent.vue:385:    .terminal-dot {
app/components/terminal/TerminalComponent.vue:392:    .terminal-dot--min {
app/components/terminal/TerminalComponent.vue:396:    .terminal-dot--max {
app/components/terminal/TerminalComponent.vue:423:    background: var(--bg-terminal);
app/components/terminal/TerminalComponent.vue:477:    .terminal-response {
app/components/terminal/TerminalComponent.vue:498:    .terminal-body {
app/components/terminal/TerminalComponent.vue:499:      background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
app/components/terminal/TerminalComponent.vue:549:      // --color-dark est redéfini localement ci-dessus (le bloc `.terminal` qui exposait
app/components/terminal/TerminalManagerComponent.vue:3:    <div v-for="(terminal, index) in terminals" :key="index">
app/components/terminal/TerminalManagerComponent.vue:6:        :create-new-terminal="createNewTerminal"
app/components/terminal/TerminalManagerComponent.vue:7:        :terminal-config="terminal.terminalConfig"
app/components/terminal/TerminalManagerComponent.vue:14:import type { ITerminalConfig } from "~/components/terminal/interfaces";
app/components/terminal/TerminalManagerComponent.vue:18:defineOptions({ name: "TerminalManagerComponent" });
app/components/terminal/TerminalManagerComponent.vue:20:const terminals = ref<Array<{ id: string; terminalConfig: ITerminalConfig }>>([]);
app/components/terminal/TerminalManagerComponent.vue:22:const createNewTerminal = (terminalConfig: ITerminalConfig = {}) => {
app/components/terminal/TerminalManagerComponent.vue:23:  // Créez une nouvelle instance de terminal et ajoutez-la à la liste des terminaux.
app/components/terminal/TerminalManagerComponent.vue:26:    terminalConfig,
app/components/terminal/TerminalManagerComponent.vue:28:  terminals.value.push(newTerminal);
app/components/terminal/TerminalManagerComponent.vue:33:// (`terminalManager.value?.createNewTerminal()`, HeaderComponent.vue). Le hero et /contact
app/components/terminal/TerminalManagerComponent.vue:36:defineExpose({ createNewTerminal });
app/components/terminal/programs/SystemInfos.ts:2:import type { IProgram } from "~/components/terminal/interfaces";
app/components/terminal/interfaces/IProgramManager.ts:1:import type { IProgram } from "~/components/terminal/interfaces/IProgram";
app/components/ui/ZButton.vue:42:  variant?: "primary" | "secondary" | "ghost" | "terminal" | "danger";
app/components/ui/ZButton.vue:219:.zbtn--terminal {
app/components/ui/ZButton.vue:220:  background: var(--bg-terminal);
app/components/ui/ZButton.vue:226:    box-shadow: var(--glow-terminal);
app/components/ui/ZButton.vue:42:  variant?: "primary" | "secondary" | "ghost" | "terminal" | "danger";
app/components/ui/ZButton.vue:219:.zbtn--terminal {
app/components/ui/ZButton.vue:220:  background: var(--bg-terminal);
app/components/ui/ZButton.vue:226:    box-shadow: var(--glow-terminal);
app/components/ui/ZIcon.vue:33:  terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
app/components/ui/ZIcon.vue:74:  /** Nom de l'icône dans le set (arrow, terminal, github, gem…). */
app/components/terminal/interfaces/IProgram.ts:1:import type { ITerminalConfig } from "~/components/terminal/interfaces/ITerminalConfig";
app/components/terminal/interfaces/IProgram.ts:9:    createNewTerminal?: (config?: ITerminalConfig) => void,
app/components/terminal/programs/Clear.ts:1:import type { IProgram } from "~/components/terminal/interfaces";
app/components/terminal/programs/Clear.ts:10:  description: "Vide le terminal.",
app/assets/scss/base/_motion.scss:10:// EXCEPTION (DS / CAP-11) — le caret du terminal est la SEULE boucle autorisée :
app/assets/scss/base/_motion.scss:11://  - terminal réel : caret NATIF de l'<input> (caret-color/caret-shape), non
app/components/ui/ZBadge.vue:9:// Primitive badge du DS — petit libellé de statut / catégorie (palette terminale/sémantique).
app/components/terminal/programs/HelloWorld.ts:1:import type { IProgram, ITerminalConfig } from "~/components/terminal/interfaces";
app/components/terminal/programs/HelloWorld.ts:7:    return `Bonjour, ${config?.userName ?? "anon."} ! Bienvenue dans le terminal.`;
app/components/terminal/programs/Projets.ts:2:import type { IProgram } from "~/components/terminal/interfaces";
app/components/terminal/programs/SystemInfos.ts:2:import type { IProgram } from "~/components/terminal/interfaces";
app/components/ui/ZBadge.vue:9:// Primitive badge du DS — petit libellé de statut / catégorie (palette terminale/sémantique).
app/composables/useTerminal.ts:3:// Lanceur partagé de l'easter-egg terminal.
app/composables/useTerminal.ts:5:// Le `TerminalManagerComponent` (qui expose `createNewTerminal()`) est monté dans
app/composables/useTerminal.ts:13:// La restylisation complète du terminal reste du périmètre d'Epic 8.
app/composables/useTerminal.ts:34:    /** Ouvre un terminal si un lanceur est disponible ; no-op sinon. */
app/components/terminal/programs/About.ts:2:import type { IProgram } from "~/components/terminal/interfaces";
app/components/terminal/programs/About.ts:250:  run: (_, createNewTerminal, initialData?: string) => {

 succeeded in 0ms:
app/pages/about.vue:3:    <!-- Hero À-propos : portrait + identité (colonne gauche) + bio + stack (colonne droite).
app/pages/about.vue:9:          <!-- Colonne gauche : portrait, identité, localisation, CTA -->
app/pages/about.vue:13:            <p class="about__role">{{ profile.role }}</p>
app/pages/about.vue:24:          <!-- Colonne droite : eyebrow + bio (1re personne, emphases sur les technologies) + stack -->
app/pages/about.vue:26:            <h2 class="eyebrow">// à propos</h2>
app/pages/about.vue:28:              Développeur web freelance, je viens d'un parcours technique (métrologie, instrumentation) avant de
app/pages/about.vue:29:              basculer dans le code. Aujourd'hui je conçois des applications en <strong>PHP/Symfony</strong>, des sites
app/pages/about.vue:39:                 Liste sémantique (<ul>/<li>) pour annonce « liste de N éléments » aux lecteurs d'écran. -->
app/pages/about.vue:41:              <h2 class="eyebrow eyebrow--muted">// stack</h2>
app/pages/about.vue:42:              <ul class="hero__tags">
app/pages/about.vue:46:              </ul>
app/pages/about.vue:58:          <!-- Colonne gauche : timeline d'expériences (la plus récente en haut).
app/pages/about.vue:59:               <ol> : séquence chronologique annoncée comme liste ordonnée aux lecteurs d'écran. -->
app/pages/about.vue:61:            <h2 class="eyebrow">// expériences</h2>
app/pages/about.vue:62:            <ol class="tl">
app/pages/about.vue:65:                <div class="tl__role">{{ xp.role }}</div>
app/pages/about.vue:69:            </ol>
app/pages/about.vue:72:          <!-- Colonne droite : formation (une ZCard par diplôme), liste sémantique <ul>/<li>. -->
app/pages/about.vue:74:            <h2 class="eyebrow">// formation</h2>
app/pages/about.vue:75:            <ul class="about__degrees">
app/pages/about.vue:80:                  <div class="tl__org">{{ degree.school }}</div>
app/pages/about.vue:83:            </ul>
app/pages/about.vue:94:// hero 2 colonnes (0.8fr identité / 1.2fr bio), section CV 2 colonnes (1.4fr / 0.6fr),
app/pages/about.vue:108:    role: "Testeur QA",
app/pages/about.vue:114:    role: "Développeur Full Stack",
app/pages/about.vue:120:    role: "Métrologue",
app/pages/about.vue:121:    org: "A+ Métrologie / Trescal",
app/pages/about.vue:122:    desc: "Technicien métrologue multi-grandeur, suppléant COFRAC électricité-magnétisme.",
app/pages/about.vue:128:  { date: "2017 — 2018", name: "Développeur d'application — PHP / Symfony", school: "OpenClassrooms" },
app/pages/about.vue:129:  { date: "1999 — 2001", name: "BTS CIRA", school: "Lycée A. de Tocqueville, Cherbourg" },
app/pages/about.vue:164:// .section / .container / .eyebrow / .prose / .hero__tags sont des primitives de
app/pages/about.vue:170:// Les libellés de section sont des <h2> (outline a11y navigable au lecteur d'écran),
app/pages/about.vue:171:// stylés en eyebrow. Neutralise le poids et l'interligne propres au <h2> pour un
app/pages/about.vue:172:// rendu strictement identique au <p class="eyebrow"> initial (line-height: inherit
app/pages/about.vue:174:.eyebrow {
app/pages/about.vue:175:  font-weight: var(--fw-regular);
app/pages/about.vue:176:  line-height: inherit;
app/pages/about.vue:179:// ---- Grille du hero (porté de About.jsx : grid-2 + gridTemplateColumns "0.8fr 1.2fr") ----
app/pages/about.vue:182:  grid-template-columns: 0.8fr 1.2fr;
app/pages/about.vue:187:// ---- Colonne gauche : identité ----
app/pages/about.vue:192:  font-weight: var(--fw-regular);
app/pages/about.vue:193:  line-height: var(--lh-tight);
app/pages/about.vue:194:  color: var(--text-strong);
app/pages/about.vue:197:.about__role {
app/pages/about.vue:200:  color: var(--accent);
app/pages/about.vue:209:  color: var(--text-muted);
app/pages/about.vue:218:// ---- Colonne droite : bio ----
app/pages/about.vue:227:  // Emphases sur les technologies (porté des <strong> d'About.jsx).
app/pages/about.vue:229:    color: var(--text-strong);
app/pages/about.vue:232:  // Lien externe keova.app (porté de l'<a> d'About.jsx) — couleur lien du DS,
app/pages/about.vue:233:  // soulignement au survol + ring de focus accessible (pas d'outline: none nu).
app/pages/about.vue:235:    color: var(--link);
app/pages/about.vue:243:    // en rendu normal mais devient une couleur système en `forced-colors`
app/pages/about.vue:246:      outline: 2px solid transparent;
app/pages/about.vue:263:  grid-template-columns: 1.4fr 0.6fr;
app/pages/about.vue:279:  // <ol> : neutraliser puces/numéros et marges UA (reset : margin 0 0 16px 32px).
app/pages/about.vue:288:  position: absolute;
app/pages/about.vue:293:  background: var(--border-default);
app/pages/about.vue:306:  position: absolute;
app/pages/about.vue:312:  border: 2px solid var(--accent);
app/pages/about.vue:321:  color: var(--accent);
app/pages/about.vue:324:.tl__role {
app/pages/about.vue:330:  color: var(--text-strong);
app/pages/about.vue:336:  color: var(--text-muted);
app/pages/about.vue:343:  color: var(--text-body);
app/pages/about.vue:346:// ---- Formation (porté de About.jsx : flex column + <Card padded>) ----
app/pages/about.vue:347:// <ul> : neutraliser puces et marges UA (reset : margin 0 0 16px 32px).
app/pages/about.vue:350:  flex-direction: column;
app/pages/about.vue:361:  color: var(--text-strong);
app/pages/about.vue:364:// ---- Responsive (cf. kit.css @media max-width: 900px : .grid-2 → 1 colonne) ----
app/pages/about.vue:368:    grid-template-columns: 1fr;
app/pages/blog/[...slug].vue:11:          <ul v-if="page.tags?.length" class="hero__tags article__tags">
app/pages/blog/[...slug].vue:15:          </ul>
app/pages/blog/[...slug].vue:63:// @nuxt/content v3 (queryCollection + ContentRenderer). Prerender-safe (useAsyncData).
app/pages/blog/[...slug].vue:75:  () => queryCollection("blog").path(path.value).first(),
app/pages/blog/[...slug].vue:81:const resolveContentError = () => {
app/pages/blog/[...slug].vue:88:  return null;
app/pages/blog/[...slug].vue:93:const initialError = resolveContentError();
app/pages/blog/[...slug].vue:102:    const clientError = resolveContentError();
app/pages/blog/[...slug].vue:125:    headline: article.title,
app/pages/blog/[...slug].vue:167:// Lien retour (porté de kit.css : .hdr__link) — mono discret, soulignement + ring au focus.
app/pages/blog/[...slug].vue:173:  color: var(--text-muted);
app/pages/blog/[...slug].vue:177:    color: var(--text-strong);
app/pages/blog/[...slug].vue:181:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/pages/blog/[...slug].vue:197:  font-weight: var(--fw-light);
app/pages/blog/[...slug].vue:198:  line-height: var(--lh-tight);
app/pages/blog/[...slug].vue:199:  color: var(--text-strong);
app/pages/blog/[...slug].vue:213:  border: 1px solid var(--border-subtle);
app/pages/blog/[...slug].vue:227:  :deep(h2) {
app/pages/blog/[...slug].vue:231:    font-weight: var(--fw-regular);
app/pages/blog/[...slug].vue:232:    line-height: var(--lh-snug);
app/pages/blog/[...slug].vue:233:    color: var(--text-strong);
app/pages/blog/[...slug].vue:240:    font-weight: var(--fw-regular);
app/pages/blog/[...slug].vue:241:    line-height: var(--lh-snug);
app/pages/blog/[...slug].vue:242:    color: var(--text-strong);
app/pages/blog/[...slug].vue:249:    font-weight: var(--fw-medium);
app/pages/blog/[...slug].vue:250:    color: var(--text-strong);
app/pages/blog/[...slug].vue:253:  // Emphase forte = couleur titre (cf. emphases bio /about).
app/pages/blog/[...slug].vue:255:    font-weight: var(--fw-bold);
app/pages/blog/[...slug].vue:256:    color: var(--text-strong);
app/pages/blog/[...slug].vue:259:  // Liens du corps prose : couleur lien DS + ring de focus accessible.
app/pages/blog/[...slug].vue:261:    color: var(--link);
app/pages/blog/[...slug].vue:269:      outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/pages/blog/[...slug].vue:277:  // garder le titre neutre (couleur héritée, pas de soulignement bleu).
app/pages/blog/[...slug].vue:278:  :deep(h2 a),
app/pages/blog/[...slug].vue:281:    color: inherit;
app/pages/blog/[...slug].vue:293:    line-height: var(--lh-snug);
app/pages/blog/[...slug].vue:294:    color: var(--text-strong);
app/pages/blog/[...slug].vue:296:    border: 1px solid var(--border-default);
app/pages/blog/[...slug].vue:300:  // Code inline = vert terminal ; le code en bloc hérite la couleur du <pre> (off-white).
app/pages/blog/[...slug].vue:304:    color: var(--term-green);
app/pages/blog/[...slug].vue:308:    color: inherit;
app/pages/blog/[...slug].vue:312:  :deep(ul),
app/pages/blog/[...slug].vue:313:  :deep(ol) {
app/pages/blog/[...slug].vue:323:    color: var(--accent);
app/pages/blog/[...slug].vue:330:    color: var(--text-muted);
app/pages/blog/[...slug].vue:332:    border-left: 2px solid var(--accent);
app/pages/blog/[...slug].vue:343:    border-top: 1px solid var(--border-subtle);
app/pages/blog/[...slug].vue:351:    border-collapse: collapse;
app/pages/blog/[...slug].vue:358:    border: 1px solid var(--border-default);
app/pages/blog/[...slug].vue:363:    font-weight: var(--fw-medium);
app/pages/blog/[...slug].vue:364:    color: var(--text-strong);
app/pages/blog/[...slug].vue:386:  border-top: 1px solid var(--border-subtle);
app/pages/blog/[...slug].vue:392:  color: var(--text-muted);
app/assets/fonts/Ubuntu_Mono/UFL.txt:8:bundled, embedded, and redistributed provided the terms of this licence
app/assets/fonts/Ubuntu_Mono/UFL.txt:18:Holder(s) under this licence and clearly marked as such. This may
app/assets/fonts/Ubuntu_Mono/UFL.txt:21:"Original Version" refers to the collection of Font Software components
app/assets/fonts/Ubuntu_Mono/UFL.txt:25:or substituting -- in part or in whole -- any of the components of the
app/assets/fonts/Ubuntu_Mono/UFL.txt:29:"Copyright Holder(s)" refers to all individuals and companies who have a
app/assets/fonts/Ubuntu_Mono/UFL.txt:37:permission, would make you directly or secondarily liable for
app/assets/fonts/Ubuntu_Mono/UFL.txt:58:2) The font name complies with the following:
app/assets/fonts/Ubuntu_Mono/UFL.txt:69:3) The name(s) of the Copyright Holder(s) and any contributor to the
app/assets/fonts/Ubuntu_Mono/UFL.txt:72:acknowledge the contribution(s) of the Copyright Holder(s) or (iii) with
app/assets/fonts/Ubuntu_Mono/UFL.txt:75:4) The Font Software, modified or unmodified, in part or in whole, must
app/assets/fonts/Ubuntu_Mono/UFL.txt:84:This licence becomes null and void if any of the above conditions are
docs/implementation-artifacts/2-4-primitive-zcard.md:27:  - [x] `<script setup lang="ts">`, `defineProps` typé (`withDefaults`) d'après `Card.d.ts` : `interactive`, `accent`, `featured`, `padded` (défaut `true`), `as` (défaut `"div"`).
docs/implementation-artifacts/2-4-primitive-zcard.md:28:  - [x] Élément polymorphe via `as` (`<component :is="as">`), slot par défaut. `class`/attrs hérités sur la racine (inheritAttrs par défaut → `class="home-card-w"` fusionne).
docs/implementation-artifacts/2-4-primitive-zcard.md:30:  - [x] Base : `var(--bg-card)`, `var(--text-body)`, `1px solid var(--border-subtle)`, `var(--radius-md)`, `box-shadow var(--shadow-2), var(--shadow-hairline)`, `overflow:hidden`, `position:relative`.
docs/implementation-artifacts/2-4-primitive-zcard.md:32:  - [x] `interactive` → `cursor:pointer` + hover `border-color var(--border-strong)`, `translateY(-2px)`, `box-shadow var(--shadow-3), var(--shadow-hairline)`.
docs/implementation-artifacts/2-4-primitive-zcard.md:35:  - [x] Transitions border-color/transform/box-shadow en `--dur-base` (`--ease-out` pour transform).
docs/implementation-artifacts/2-4-primitive-zcard.md:41:  - [x] Rendu prouvé par build : `about/index.html`/`blog/index.html` → `<article class="zcard ...">` pour préserver la sémantique legacy ; CSS scoped émis : `.zcard{background:var(--bg-card)…}` + modifiers `--pad`/`--interactive`/`--accent`/`--featured` ; body title `color:var(--text-strong)`.
docs/implementation-artifacts/2-4-primitive-zcard.md:59:- **Cartes DS** : `--bg-card`, 1px `--border-subtle`, `--radius-md`, `--shadow-2 + --shadow-hairline` ; quiet by default (le contenu est le héros) ; accent left/top optionnel sur cartes en vedette. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Cards]
docs/implementation-artifacts/2-4-primitive-zcard.md:65:- **`components/card/ZCardComponent.vue`** (état actuel) — `<article>` + slot ; style legacy : `--article-color-background: #{_color.$background}` (gris clair !), `box-shadow` legacy, animation `bounce-in-fwd`, grille `header/section/footer`. **À refondre/remplacer** : le fond clair et le bounce sont incompatibles dark-first/motion DS.
docs/implementation-artifacts/2-4-primitive-zcard.md:67:- **`components/card/ZCardBody.vue`** (état actuel) — `<section>` slots `title`/`body`, couleur `--zcb-color-text: #{_color.$gray-5}`, animation `fadeIn`. À restyler via tokens (`--text-body`/`--text-strong`).
docs/implementation-artifacts/2-4-primitive-zcard.md:75:| `interactive` | `boolean` | `false` | hover lift + bordure plus claire |
docs/implementation-artifacts/2-4-primitive-zcard.md:76:| `accent` | `boolean` | `false` | barre orange→aubergine en haut |
docs/implementation-artifacts/2-4-primitive-zcard.md:77:| `featured` | `boolean` | `false` | anneau de glow orange (offre recommandée) |
docs/implementation-artifacts/2-4-primitive-zcard.md:78:| `padded` | `boolean` | `true` | padding interne `--space-6` |
docs/implementation-artifacts/2-4-primitive-zcard.md:79:| `as` | élément | `"div"` | polymorphe |
docs/implementation-artifacts/2-4-primitive-zcard.md:87:- **Naming** : `ZCard` (famille `ui/`), distinct des `ZCard*Component` legacy ; éviter collision de noms d'auto-import (le legacy est `ZCardComponent`, pas `ZCard` → pas de collision directe, mais vérifier).
docs/implementation-artifacts/2-4-primitive-zcard.md:115:- Preuves sortie initiales : `.zcard[data-v-…]{position:relative;overflow:hidden;background:var(--bg-card);color:var(--text-body);border:1px solid var(--border-subtle)…}` ; 4 modifiers `.zcard--{pad,interactive,accent,featured}` émis ; `color:var(--text-strong)` (titre body). Revue : usages migrés rendus en `as="article"` pour préserver la sémantique.
docs/implementation-artifacts/2-4-primitive-zcard.md:119:- **`components/ui/ZCard.vue` créé** (`<script setup lang="ts">`) : props `interactive`/`accent`/`featured`/`padded`(def. true)/`as`(def. "div"), polymorphe `<component :is>`, slot par défaut. CSS porté de `Card.jsx` en `<style scoped>` 100 % tokens (pas de `ensureStyles()`/`document` → prerender-safe). Auto-import `ui/` sans préfixe (`<ZCard>`, config posée en 2.3).
docs/implementation-artifacts/2-4-primitive-zcard.md:126:  - `ZCardBody.vue` : `padding var(--space-4)`, `color var(--text-body)`, **titre slotté `:slotted(h1)` en `color var(--text-strong)`** — corrige la régression dark-first (le titre était en gris foncé, illisible sur le fond sombre `--bg-card`). Animation `fadeIn` conservée via tokens `--dur-slower`/`--ease-out`, désactivée si `prefers-reduced-motion: reduce`.
docs/specs/spec-design-system-revamp/primitives.md:14:| Input | `components/core/Input.jsx` | `components/ui/ZInput.vue` | bordure `--border-default` → `--border-strong` au focus |
docs/specs/spec-design-system-revamp/primitives.md:23:- Icônes : Lucide via CDN (stand-in), `currentColor` ; glyphes sociaux et logo
app/pages/blog/index.vue:5:        <!-- En-tête (porté de Blog.jsx : eyebrow + titre + sous-titre prose) -->
app/pages/blog/index.vue:6:        <p class="eyebrow">// ~/blog</p>
app/pages/blog/index.vue:13:        <ul v-if="articles && articles.length" class="blog__list">
app/pages/blog/index.vue:27:                <ul v-if="article.tags?.length" class="hero__tags post__tags">
app/pages/blog/index.vue:31:                </ul>
app/pages/blog/index.vue:32:                <h2 class="post__title">{{ article.title }}</h2>
app/pages/blog/index.vue:45:        </ul>
app/pages/blog/index.vue:56:          <h2 class="blog__notice-title">Le chargement des articles a échoué.</h2>
app/pages/blog/index.vue:72:          <h2 class="blog__notice-title">Pas encore d'articles.</h2>
app/pages/blog/index.vue:86:// v3 (queryCollection). Dark-first, tokens uniquement, prerender-safe (requête résolue
app/pages/blog/index.vue:90:// Articles triés par date décroissante. La requête de contenu est résolue côté
app/pages/blog/index.vue:94:  queryCollection("blog").order("date", "DESC").all(),
app/pages/blog/index.vue:108:// Construit à partir de la liste résolue (snapshot au build, page prerendue).
app/pages/blog/index.vue:117:    headline: article.title,
app/pages/blog/index.vue:147:// .section / .container / .eyebrow / .prose / .hero__tags / .post__meta sont des
app/pages/blog/index.vue:158:  font-weight: var(--fw-light);
app/pages/blog/index.vue:159:  line-height: var(--lh-tight);
app/pages/blog/index.vue:160:  color: var(--text-strong);
app/pages/blog/index.vue:166:  color: var(--text-muted);
app/pages/blog/index.vue:169:// ---- Liste d'articles (porté de Blog.jsx : flex column + .post de kit.css) ----
app/pages/blog/index.vue:170:// <ul> sémantique (annonce « liste de N articles ») : reset des puces et marges UA.
app/pages/blog/index.vue:173:  flex-direction: column;
app/pages/blog/index.vue:183:  grid-template-columns: 200px 1fr;
app/pages/blog/index.vue:186:  color: inherit;
app/pages/blog/index.vue:193:  border: 1px solid var(--border-subtle);
app/pages/blog/index.vue:205:  font-weight: var(--fw-regular);
app/pages/blog/index.vue:206:  line-height: var(--lh-snug);
app/pages/blog/index.vue:207:  color: var(--text-strong);
app/pages/blog/index.vue:214:  line-height: var(--lh-relaxed);
app/pages/blog/index.vue:215:  color: var(--text-body);
app/pages/blog/index.vue:237:  font-weight: var(--fw-regular);
app/pages/blog/index.vue:238:  color: var(--text-strong);
app/pages/blog/index.vue:242:  color: var(--text-muted);
app/pages/blog/index.vue:245:// ---- Responsive (cf. kit.css @media max-width: 900px : .post → 1 colonne) ----
app/pages/blog/index.vue:248:    grid-template-columns: 1fr;
app/pages/services.vue:3:    <!-- En-tête + grille d'offres (story 4.1). La 2e section (process) viendra en 4.2. -->
app/pages/services.vue:6:        <p class="eyebrow">// services</p>
app/pages/services.vue:13:        <ul class="grid-3">
app/pages/services.vue:20:              <h2 class="offer__title">{{ offer.title }}</h2>
app/pages/services.vue:22:              <ul class="offer__points">
app/pages/services.vue:24:              </ul>
app/pages/services.vue:41:        </ul>
app/pages/services.vue:45:    <!-- Section process : 4 étapes ordonnées + CTA (story 4.2). Porté de Services.jsx L45-61. -->
app/pages/services.vue:48:        <p class="eyebrow">// comment ça se passe</p>
app/pages/services.vue:49:        <h2 class="process__title">Un déroulé simple en quatre temps</h2>
app/pages/services.vue:51:        <ol class="process">
app/pages/services.vue:52:          <li v-for="step in steps" :key="step.n" class="process__step">
app/pages/services.vue:53:            <div class="process__num" aria-hidden="true">{{ step.n }}</div>
app/pages/services.vue:54:            <h3 class="process__step-title">{{ step.title }}</h3>
app/pages/services.vue:55:            <p class="prose process__desc">{{ step.desc }}</p>
app/pages/services.vue:57:        </ol>
app/pages/services.vue:59:        <div class="process__cta">
app/pages/services.vue:71:// Page Services — en-tête + grille des 3 offres (story 4.1) puis section process
app/pages/services.vue:86:  featured: boolean;
app/pages/services.vue:121:// Étapes du process — texte repris à l'identique de Services.jsx (tableau `steps`,
app/pages/services.vue:149:// .section / .section--sunken / .container / .eyebrow / .prose : primitives de
app/pages/services.vue:158:  font-weight: var(--fw-light);
app/pages/services.vue:159:  line-height: var(--lh-tight);
app/pages/services.vue:160:  color: var(--text-strong);
app/pages/services.vue:166:  color: var(--text-muted);
app/pages/services.vue:169:// ---- Grille des offres (porté de kit.css : .grid-3 / .offer*) ----
app/pages/services.vue:170:.grid-3 {
app/pages/services.vue:172:  grid-template-columns: repeat(3, 1fr);
app/pages/services.vue:183:  flex-direction: column;
app/pages/services.vue:201:  color: var(--accent);
app/pages/services.vue:210:  font-weight: var(--fw-regular);
app/pages/services.vue:211:  color: var(--text-strong);
app/pages/services.vue:218:  line-height: var(--lh-relaxed);
app/pages/services.vue:219:  color: var(--text-body);
app/pages/services.vue:232:    color: var(--text-muted);
app/pages/services.vue:238:    position: absolute;
app/pages/services.vue:240:    color: var(--accent);
app/pages/services.vue:245:  // `margin-top: auto` colle le prix (et le CTA qui suit) au bas de la carte ;
app/pages/services.vue:251:  color: var(--text-muted);
app/pages/services.vue:255:    font-weight: var(--fw-bold);
app/pages/services.vue:256:    color: var(--text-strong);
app/pages/services.vue:269:// ---- Section process (porté de Services.jsx L45-61) ----
app/pages/services.vue:270:.process__title {
app/pages/services.vue:274:  font-weight: var(--fw-regular);
app/pages/services.vue:275:  color: var(--text-strong);
app/pages/services.vue:278:.process {
app/pages/services.vue:280:  grid-template-columns: repeat(4, 1fr);
app/pages/services.vue:287:.process__num {
app/pages/services.vue:290:  font-weight: var(--fw-light);
app/pages/services.vue:291:  color: var(--accent);
app/pages/services.vue:294:.process__step-title {
app/pages/services.vue:298:  font-weight: var(--fw-regular);
app/pages/services.vue:299:  color: var(--text-strong);
app/pages/services.vue:302:.process__desc {
app/pages/services.vue:304:  color: var(--text-muted);
app/pages/services.vue:307:.process__cta {
app/pages/services.vue:314:  .grid-3,
app/pages/services.vue:315:  .process {
app/pages/services.vue:316:    grid-template-columns: 1fr;
app/pages/index.vue:6:          <!-- Colonne gauche : accroche, CTA, tags -->
app/pages/index.vue:8:            <p class="eyebrow">// développeur web freelance</p>
app/pages/index.vue:18:            <ul class="hero__tags">
app/pages/index.vue:22:            </ul>
app/pages/index.vue:25:          <!-- Colonne droite : fenêtre terminal décorative (statique) -->
app/pages/index.vue:26:          <div class="anim hero__term-col">
app/pages/index.vue:71:        <p class="eyebrow">// ce que je fais</p>
app/pages/index.vue:72:        <h2 class="section__title">Trois façons de travailler ensemble</h2>
app/pages/index.vue:73:        <ul class="grid-3">
app/pages/index.vue:84:        </ul>
app/pages/index.vue:98:        <h2 class="eyebrow">// projets sélectionnés</h2>

exec
/bin/zsh -lc "git diff --check -- docs/implementation-artifacts/code-reviews/10-2/full.diff; sed -n '1,120p' docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md; sed -n '1,160p' docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
Reading additional input from stdin...
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: high
reasoning summaries: none
session id: 01a099b1-13a5-7e33-9808-bf62f4c5d88e
--------
user
# Acceptance Auditor Prompt — Story 10.2

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md`
- Context specs: `docs/planning-artifacts/epics.md` (Story 10.2), `docs/project-context.md`
- Diff file: `docs/implementation-artifacts/code-reviews/10-2/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
2026-09-13T07:35:16.518798Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
I’m using the code-review skill because this is a repository-grounded acceptance audit. I’ll read the review guidance, then compare the story spec, context, and full diff criterion by criterion.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/bmad-code-review/SKILL.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
name: bmad-code-review
description: 'Adversarial code review using parallel review layers and structured triage. Use when the user says "run code review" or "review this code"'
---

# Code Review Workflow

**Goal:** Review code changes adversarially. No noise, no filler.

Subagents, when the capability is available, are an important part of this workflow. Use them as directed by the workflow steps.
If you need an explicit user instruction to run them, ask once now for the whole workflow run.

## Conventions

- Bare paths (e.g. `checklist.md`) resolve from the skill root.
- `{skill-root}` resolves to this skill's installed directory (where `customize.toml` lives).
- `{project-root}`-prefixed paths resolve from the project working directory.
- `{skill-name}` resolves to the skill directory's basename.

## On Activation

### Step 1: Resolve the Workflow Block

Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`

**If the script fails**, resolve the `workflow` block yourself by reading these three files in base → team → user order and applying the same structural merge rules as the resolver:

1. `{skill-root}/customize.toml` — defaults
2. `{project-root}/_bmad/custom/{skill-name}.toml` — team overrides
3. `{project-root}/_bmad/custom/{skill-name}.user.toml` — personal overrides

Any missing file is skipped. Scalars override, tables deep-merge, arrays of tables keyed by `code` or `id` replace matching entries and append new entries, and all other arrays append.

### Step 2: Execute Prepend Steps

Execute each entry in `{workflow.activation_steps_prepend}` in order before proceeding.

### Step 3: Load Persistent Facts

Treat every entry in `{workflow.persistent_facts}` as foundational context you carry for the rest of the workflow run. Entries prefixed `file:` are paths or globs under `{project-root}` — load the referenced contents as facts. All other entries are facts verbatim.

### Step 4: Load Config

Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `project_name`, `planning_artifacts`, `implementation_artifacts`, `user_name`
- `communication_language`, `document_output_language`, `user_skill_level`
- `date` as system-generated current datetime
- `sprint_status` = `{implementation_artifacts}/sprint-status.yaml`
- `project_context` = `**/project-context.md` (load if exists)
- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

### Step 5: Greet the User

Greet `{user_name}`, speaking in `{communication_language}`.

### Step 6: Execute Append Steps

Execute each entry in `{workflow.activation_steps_append}` in order.

Activation is complete. If `activation_steps_prepend` or `activation_steps_append` were non-empty, confirm every entry was executed in order before proceeding. Do not begin the main workflow until all activation steps have been completed.

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** for disciplined execution:

- **Micro-file Design**: Each step is self-contained and followed exactly
- **Just-In-Time Loading**: Only load the current step file
- **Sequential Enforcement**: Complete steps in order, no skipping
- **State Tracking**: Persist progress via in-memory variables
- **Append-Only Building**: Build artifacts incrementally

### Step Processing Rules

1. **READ COMPLETELY**: Read the entire step file before acting
2. **FOLLOW SEQUENCE**: Execute sections in order
3. **WAIT FOR INPUT**: Halt at checkpoints and wait for human
4. **LOAD NEXT**: When directed, read fully and follow the next step file

### Critical Rules (NO EXCEPTIONS)

- **NEVER** load multiple step files simultaneously
- **ALWAYS** read entire step file before execution
- **NEVER** skip steps or optimize the sequence
- **ALWAYS** follow the exact instructions in the step file
- **ALWAYS** halt at checkpoints and wait for human input
Reading additional input from stdin...
2026-09-13T07:35:11.503222Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: high
reasoning summaries: none
session id: 01a099b1-0aaf-7ba1-90fe-362289679cfd
--------
user
# Edge Case Hunter Prompt — Story 10.2

Invoke the `bmad-review-edge-case-hunter` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/10-2/full.diff`

Goal: Walk every branching path and boundary condition in content, report only unhandled edge cases.
Method: Exhaustive path enumeration — mechanically walk every branch, report ONLY paths and conditions that lack handling. Discard handled ones silently. Do NOT editorialize or add filler. Do not assign severity labels, rankings, or priority levels.

Return ONLY a valid JSON array of objects. Each edge-case finding contains exactly these four fields:
[
  {
    "location": "file:start-end (or file:line)",
    "trigger_condition": "one-line description (max 15 words)",
    "guard_snippet": "minimal code sketch that closes the gap (single-line escaped string)",
    "potential_consequence": "what could actually go wrong (max 15 words)"
  }
]
warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
I’m using `bmad-review-edge-case-hunter` to mechanically enumerate unhandled branches in the supplied diff.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/dev/jouan.ovh/.agents/skills/bmad-review-edge-case-hunter/SKILL.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
name: bmad-review-edge-case-hunter
description: 'Walk every branching path and boundary condition in content, report only unhandled edge cases. Orthogonal to adversarial review - method-driven not attitude-driven. Use when you need exhaustive edge-case analysis of code, specs, or diffs.'
---

# Edge Case Hunter Review

**Goal:** You are a pure path tracer. Never comment on whether code is good or bad; only list missing handling.
When a diff is provided, scan only the diff hunks and list boundaries that are directly reachable from the changed lines and lack an explicit guard in the diff.
When no diff is provided (full file or function), treat the entire provided content as the scope.
Ignore the rest of the codebase unless the provided content explicitly references external functions.

**Inputs:**
- **content** — Content to review: diff, full file, or function
- **also_consider** (optional) — Areas to keep in mind during review alongside normal edge-case analysis

**MANDATORY: Execute steps in the Execution section IN EXACT ORDER. DO NOT skip steps or change the sequence. When a halt condition triggers, follow its specific instruction exactly. Each action within a step is a REQUIRED action to complete that step.**

**Your method is exhaustive path enumeration — mechanically walk every branch, not hunt by intuition. Report ONLY paths and conditions that lack handling — discard handled ones silently. Do NOT editorialize or add filler — findings only.**


## EXECUTION

### Step 1: Receive Content

- Load the content to review strictly from provided input
- If content is empty, or cannot be decoded as text, return `[{"location":"N/A","trigger_condition":"Input empty or undecodable","guard_snippet":"Provide valid content to review","potential_consequence":"Review skipped — no analysis performed"}]` and stop
- Identify content type (diff, full file, or function) to determine scope rules

### Step 2: Exhaustive Path Analysis

**Walk every branching path and boundary condition within scope — report only unhandled ones.**

- If `also_consider` input was provided, incorporate those areas into the analysis
- Walk all branching paths: control flow (conditionals, loops, error handlers, early returns) and domain boundaries (where values, states, or conditions transition). Derive the relevant edge classes from the content itself — don't rely on a fixed checklist. Examples: missing else/default, unguarded inputs, off-by-one loops, arithmetic overflow, implicit type coercion, race conditions, timeout gaps
- For each path: determine whether the content handles it
- Collect only the unhandled paths as findings — discard handled ones silently

### Step 3: Validate Completeness

- Revisit every edge class from Step 2 — e.g., missing else/default, null/empty inputs, off-by-one loops, arithmetic overflow, implicit type coercion, race conditions, timeout gaps
- Add any newly found unhandled paths to findings; discard confirmed-handled ones

### Step 4: Present Findings

Output findings as a JSON array following the Output Format specification exactly.


## OUTPUT FORMAT

Return ONLY a valid JSON array of objects. Each object must contain exactly these four fields and nothing else:

```json
[{
  "location": "file:start-end (or file:line when single line, or file:hunk when exact line unavailable)",
  "trigger_condition": "one-line description (max 15 words)",
  "guard_snippet": "minimal code sketch that closes the gap (single-line escaped string, no raw newlines or unescaped quotes)",
  "potential_consequence": "what could actually go wrong (max 15 words)"
}]
```

No extra text, no explanations, no markdown wrapping. An empty array `[]` is valid when no unhandled paths are found.


## HALT CONDITIONS

- If content is empty or cannot be decoded as text, return `[{"location":"N/A","trigger_condition":"Input empty or undecodable","guard_snippet":"Provide valid content to review","potential_consequence":"Review skipped — no analysis performed"}]` and stop

2026-09-13T07:35:20.568046Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "wc -l -c docs/implementation-artifacts/code-reviews/10-2/full.diff && sed -n '1,260p' docs/implementation-artifacts/code-reviews/10-2/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     430   22287 docs/implementation-artifacts/code-reviews/10-2/full.diff
diff --git a/app/assets/scss/base/_layout.scss b/app/assets/scss/base/_layout.scss
index 5d6729f..e59cebe 100644
--- a/app/assets/scss/base/_layout.scss
+++ b/app/assets/scss/base/_layout.scss
@@ -33,10 +33,13 @@
 }
 
 // Sur-titre mono en capitales espacées, accent orange.
+// font-weight et line-height neutralisés pour un rendu identique lorsqu'appliqué sur un <h2 class="eyebrow">.
 .eyebrow {
   margin: 0 0 var(--space-3);
   font-family: var(--font-mono);
   font-size: var(--fs-xs);
+  font-weight: var(--fw-regular);
+  line-height: inherit;
   letter-spacing: var(--ls-wider);
   text-transform: uppercase;
   color: var(--accent);
diff --git a/app/pages/contact.vue b/app/pages/contact.vue
index ba80d43..5191532 100644
--- a/app/pages/contact.vue
+++ b/app/pages/contact.vue
@@ -89,18 +89,24 @@
           <div class="contact__info">
             <!-- Carte infos : email / localisation / disponibilité -->
             <ZCard class="contact__infocard">
-              <div class="infoitem">
-                <div class="infoitem__k">// email</div>
-                <a class="infoitem__v contact__email" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
-              </div>
-              <div class="infoitem">
-                <div class="infoitem__k">// localisation</div>
-                <div class="infoitem__v">{{ contact.city }}</div>
-              </div>
-              <div class="infoitem">
-                <div class="infoitem__k">// disponibilité</div>
-                <div class="contact__avail"><ZBadge tone="success" dot>Ouvert aux missions freelance</ZBadge></div>
-              </div>
+              <dl class="contact__infolist">
+                <div class="infoitem">
+                  <dt class="infoitem__k"><span aria-hidden="true">// </span>email</dt>
+                  <dd class="infoitem__v">
+                    <a class="contact__email" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
+                  </dd>
+                </div>
+                <div class="infoitem">
+                  <dt class="infoitem__k"><span aria-hidden="true">// </span>localisation</dt>
+                  <dd class="infoitem__v">{{ contact.city }}</dd>
+                </div>

2026-09-13T07:35:50.234121Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '1,90p' app/components/terminal/TerminalManagerComponent.vue; sed -n '1,75p' app/components/terminal/TerminalComponent.vue; sed -n '270,325p' app/components/terminal/TerminalComponent.vue; sed -n '1,190p' app/components/HeaderComponent.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <div>
    <div v-for="(terminal, index) in terminals" :key="index">
      <TerminalComponent
        :id="index"
        :create-new-terminal="createNewTerminal"
        :terminal-config="terminal.terminalConfig"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ITerminalConfig } from "~/components/terminal/interfaces";
import { uniqueId } from "~/utils/functions";

// Migration Options API → <script setup> (story 8.3) : comportement strictement constant.
defineOptions({ name: "TerminalManagerComponent" });

const terminals = ref<Array<{ id: string; terminalConfig: ITerminalConfig }>>([]);

const createNewTerminal = (terminalConfig: ITerminalConfig = {}) => {
  // Créez une nouvelle instance de terminal et ajoutez-la à la liste des terminaux.
  const newTerminal = {
    id: uniqueId(),
    terminalConfig,
  };
  terminals.value.push(newTerminal);
};

// En <script setup> les bindings ne sont PAS exposés au parent sans defineExpose. Seul le
// header détient une ref de ce composant et appelle la méthode directement
// (`terminalManager.value?.createNewTerminal()`, HeaderComponent.vue). Le hero et /contact
// passent par `useTerminal().open()` → le lanceur que le header enregistre, lequel finit par
// appeler cette même méthode via sa ref. → on l'expose explicitement.
defineExpose({ createNewTerminal });
</script>

<style scoped></style>
<template>
  <!--
    Téléporté sur <body> : le terminal est monté dans le <header>, qui porte un
    `backdrop-filter: blur(10px)`. Un ancêtre filtré devient "backdrop root" et
    neutralise le `backdrop-filter` du corps (le blur DS ne s'applique alors qu'au
    contenu du header, pas à la page). Hors du header, le flou aubergine rend bien.
    Déplacement de rendu uniquement — drag/resize/focus/historique inchangés.
  -->
  <Teleport to="body">
    <div ref="terminalElement" :data-id="id" class="terminal" @click="focusUserInput" @keydown.esc="closeTerminal">
      <div class="terminal-header" @mousedown="handleHeaderMouseDown" @mouseup="handleMouseUp">
        <div class="terminal-dots">
          <div
            class="close-button"
            role="button"
            tabindex="0"
            aria-label="Fermer le terminal"
            @click="closeTerminal"
            @keydown.enter="closeTerminal"
            @keydown.space.prevent="closeTerminal"
          ></div>
          <span class="terminal-dot terminal-dot--min" aria-hidden="true"></span>
          <span class="terminal-dot terminal-dot--max" aria-hidden="true"></span>
        </div>
        <div class="header-text">{{ defaultConfig.domainName }}</div>
      </div>

      <div class="terminal-body">
        <div v-for="(line, index) in commandLines" :key="index">
          <template v-if="line.isResponse">
            <!-- eslint-disable-next-line vue/no-v-html -- sortie générée en interne par les programmes du terminal (contenu maîtrisé) -->
            <span class="terminal-response" v-html="line.text"></span>
          </template>
          <template v-else>
            <span class="git-prompt"
              >{{ defaultConfig.userName }}@{{ defaultConfig.domainName }}<span class="git-prompt-separator">:</span>
              <span class="git-prompt-directory">~</span>
              <span class="git-prompt-separator">$</span></span
            >&nbsp;{{ line.text }}
          </template>
        </div>
        <span class="git-prompt"
          >{{ defaultConfig.userName }}@{{ defaultConfig.domainName }}<span class="git-prompt-separator">:</span>
          <span class="git-prompt-directory">~</span>
          <span class="git-prompt-separator">$</span></span
        >&nbsp;<input
          ref="userInputRef"
          v-model="userInput"
          type="text"
          class="user-input"
          aria-label="Saisie de commande du terminal"
          @keydown.enter="submitInput"
          @keydown.arrow-up="handleHistoryNavigation"
          @keydown.arrow-down="handleHistoryNavigation"
        />
      </div>

      <div class="resize-handle" @mousedown="handleResizeMouseDown"></div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import type { ITerminalConfig } from "~/components/terminal/interfaces";
import programManager from "~/components/terminal/programs/ProgramManager";
import { escapeHtml } from "~/utils/functions";
// Import statique : les valeurs par défaut sont disponibles dès l'exécution du setup,
// sans course asynchrone qui laissait parfois la config vide à l'initialisation.
import { terminalDefaults } from "~/terminal.config";

// Migration Options API → <script setup> (story 8.3) : comportement strictement constant
// (props/refs/cycle de vie/handlers identiques). `defineOptions` préserve le nom du composant.
defineOptions({ name: "TerminalComponent" });

    // Supprimer les écouteurs d'événements globaux
    window.removeEventListener("mousemove", handleGlobalMouseMove);
    window.removeEventListener("mouseup", handleGlobalMouseUp);
  }
};

const updateTerminalDimensions = (): void => {
  if (terminalElement.value) {
    terminalElement.value.style.width = defaultConfig.value.width;
    terminalElement.value.style.height = defaultConfig.value.height;
  }
};

const closeTerminal = () => {
  if (terminalElement.value) {
    terminalElement.value.style.display = "none";
  }
  // Retour du focus au déclencheur (a11y : ne pas perdre le focus sur <body>
  // à la fermeture clavier — Échap ou Entrée/Espace sur la pastille close).
  openerElement.value?.focus();
};

onMounted(() => {
  updateTerminalDimensions();
  // Mémorise le déclencheur AVANT de déplacer le focus dans le terminal : à ce
  // stade, l'élément actif est encore le bouton qui a ouvert le terminal.
  if (import.meta.client && document.activeElement instanceof HTMLElement) {
    openerElement.value = document.activeElement;
  }
  focusUserInput();
});

watch(
  () => [defaultConfig.value.width, defaultConfig.value.height],
  () => {
    updateTerminalDimensions();
  },
);

onUnmounted(() => {
  // Filet de sécurité : retrait des écouteurs globaux si le composant est démonté en plein drag/resize.
  window.removeEventListener("mousemove", handleGlobalMouseMove);
  window.removeEventListener("mouseup", handleGlobalMouseUp);
  window.removeEventListener("mousemove", handleGlobalResizeMouseMove);
  window.removeEventListener("mouseup", handleGlobalResizeMouseUp);
});
</script>

<style lang="scss">
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée de TerminalWindow.jsx */
.terminal {
  // Châssis fenêtre — porté de TerminalWindow.jsx (.ds-term). STYLE uniquement : la
  // logique (drag/resize/close/focus/historique/commandes) et les classes porteuses de
  // handlers (terminal-header, close-button, user-input, resize-handle) sont préservées.
  // `position: fixed` (et non absolute) : le terminal est <Teleport>é sur <body> (pour que
  // son backdrop-filter rende hors du <header> filtré) ; fixed le garde relatif au VIEWPORT,
<template>
  <header class="hdr">
    <div class="hdr__in">
      <NuxtLink to="/" class="hdr__brand" @click="closeMenu">
        <ZIcon name="gem" class="hdr__logo" />
        <b>jouan.ovh</b>
      </NuxtLink>

      <nav class="hdr__nav" aria-label="Navigation principale">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="hdr__link"
          :class="{ 'hdr__link--active': isActive(item.to) }"
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="hdr__right">
        <CurrentTime class="hdr__clock" />
        <ZBadge tone="success" dot class="hdr__badge">Disponible</ZBadge>
        <ZButton variant="terminal" size="sm" class="hdr__action" @click="addNewTerminal">
          <template #icon><ZIcon name="terminal" /></template>
          Terminal
        </ZButton>
        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" class="hdr__action">
          Démarrer un projet
        </ZButton>

        <button
          ref="burgerButton"
          class="hdr__burger"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="hdr-mobile-menu"
          :aria-label="menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
          @click="toggleMenu"
        >
          <ZIcon :name="menuOpen ? 'arrow' : 'layers'" />
        </button>
      </div>
    </div>

    <!-- Menu mobile -->
    <div v-if="menuOpen" class="hdr__overlay" @click="closeMenuAndRefocus" />
    <nav id="hdr-mobile-menu" class="hdr__menu" :class="{ 'hdr__menu--open': menuOpen }" aria-label="Navigation mobile">
      <NuxtLink
        v-for="(item, index) in navItems"
        :key="item.to"
        :ref="(el) => registerFirstLink(el, index)"
        :to="item.to"
        class="hdr__menu-link"
        :class="{ 'hdr__menu-link--active': isActive(item.to) }"
        :aria-current="isActive(item.to) ? 'page' : undefined"
        @click="closeMenu"
      >
        {{ item.label }}
      </NuxtLink>

      <div class="hdr__menu-actions">
        <ZButton variant="terminal" size="sm" @click="openTerminalFromMenu">
          <template #icon><ZIcon name="terminal" /></template>
          Terminal
        </ZButton>
        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" @click="closeMenu">
          Démarrer un projet
        </ZButton>
      </div>
    </nav>

    <TerminalManagerComponent ref="terminalManager" />
  </header>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance } from "vue";
import { onBeforeUnmount, onMounted, nextTick, ref } from "vue";
import { NuxtLink } from "#components";
import TerminalManagerComponent from "~/components/terminal/TerminalManagerComponent.vue";

const route = useRoute();

const navItems = [
  { to: "/", label: "Accueil" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "À propos" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

// Lien actif : exact pour l'accueil, préfixe pour les autres (couvre /blog/[...slug]).
function isActive(to: string): boolean {
  if (to === "/") {
    return route.path === "/";
  }
  return route.path === to || route.path.startsWith(`${to}/`);
}

// --- Terminal easter-egg (préservé) ---
const terminalManager = ref<InstanceType<typeof TerminalManagerComponent> | null>(null);

function addNewTerminal() {
  terminalManager.value?.createNewTerminal();
}

// Expose l'ouverture du terminal au reste du site via le lanceur partagé
// (ex. ligne « help » du hero d'accueil, story 3.1). Le gestionnaire reste
// monté ici ; on enregistre seulement une référence vers sa méthode.
const { register: registerTerminalLauncher, unregister: unregisterTerminalLauncher } = useTerminal();

// --- Menu mobile accessible ---
const menuOpen = ref(false);
const firstMenuLink = ref<HTMLElement | null>(null);
const burgerButton = ref<HTMLElement | null>(null);

function registerFirstLink(el: Element | ComponentPublicInstance | null, index: number) {
  if (index !== 0) {
    return;
  }
  const instance = el as ComponentPublicInstance | null;
  firstMenuLink.value = (instance?.$el ?? el) as HTMLElement | null;
}

function openMenu() {
  menuOpen.value = true;
  nextTick(() => firstMenuLink.value?.focus());
}

function closeMenu() {
  menuOpen.value = false;
}

// Fermeture clavier/overlay : renvoie le focus au burger (déclencheur) — a11y.
function closeMenuAndRefocus() {
  if (!menuOpen.value) {
    return;
  }
  closeMenu();
  nextTick(() => burgerButton.value?.focus());
}

function toggleMenu() {
  if (menuOpen.value) {
    closeMenu();
  } else {
    openMenu();
  }
}

function openTerminalFromMenu() {
  addNewTerminal();
  closeMenu();
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && menuOpen.value) {
    closeMenuAndRefocus();
  }
}

// Passage en desktop alors que le menu mobile est ouvert : on le ferme (sinon
// l'overlay fixed resterait actif et le menu deviendrait incohérent au resize).
let desktopMq: MediaQueryList | null = null;
function onDesktopChange(event: MediaQueryListEvent) {
  if (event.matches) {
    closeMenu();
  }
}

onMounted(() => {
  document.addEventListener("keydown", onKeydown);
  desktopMq = window.matchMedia("(min-width: 901px)");
  desktopMq.addEventListener("change", onDesktopChange);
  registerTerminalLauncher(addNewTerminal);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKeydown);
  desktopMq?.removeEventListener("change", onDesktopChange);
  unregisterTerminalLauncher(addNewTerminal);
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css */
.hdr {
  position: sticky;

2026-09-13T07:35:54.531823Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "rg -n \"body|html|line-height|h1|h2|h3|ul|ol|dl|li|dt|dd\" app/assets/scss | head -240; sed -n '1,180p' app/assets/scss/base/_root.scss 2>/dev/null; sed -n '1,130p' app/assets/scss/main.scss 2>/dev/null" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/assets/scss/base/_motion.scss:2://  Accessibilité — prefers-reduced-motion (story 9.2, CAP-11)
app/assets/scss/base/_motion.scss:4:// Filet de sécurité GLOBAL : dès que l'utilisateur demande moins de mouvement,
app/assets/scss/base/_motion.scss:11://  - terminal réel : caret NATIF de l'<input> (caret-color/caret-shape), non
app/assets/scss/base/_motion.scss:15://    Reste donc lisible, ne boucle plus (cf. story 9.2, tâche 1).
app/assets/scss/base/_motion.scss:18:// ci-dessous sont volontairement littérales : c'est la recette a11y standard de
app/assets/scss/base/_motion.scss:19:// neutralisation du mouvement (quasi-instantané, sans casser les callbacks
app/assets/scss/base/_motion.scss:20:// `animationend`/`transitionend`). Aucun token de durée nulle n'existe (les
app/assets/scss/base/_motion.scss:21:// `--dur-*` sont des durées d'animation positives) → pas de `var()` applicable ici.
app/assets/scss/base/_motion.scss:23:/* stylelint-disable declaration-no-important, selector-class-pattern -- réduction de motion : surcharge volontaire et globale (a11y) ; .prm__caret = convention BEM DS */
app/assets/scss/base/_motion.scss:32:    scroll-behavior: auto !important;
app/assets/scss/base/_motion.scss:40:/* stylelint-enable declaration-no-important, selector-class-pattern */
app/assets/scss/base/_layout.scss:6://  Mutualisées ici (chargées par main.scss) plutôt que redéclarées
app/assets/scss/base/_layout.scss:11:/* stylelint-disable selector-class-pattern -- convention DS BEM (.section--sunken) portée depuis kit.css */
app/assets/scss/base/_layout.scss:13:// Bloc de section vertical. padding-block uniquement : le gutter
app/assets/scss/base/_layout.scss:14:// horizontal vient de .container (enfant) — évite le conflit de
app/assets/scss/base/_layout.scss:15:// shorthand padding multi-axes (cf. project-context, piège story 3.1).
app/assets/scss/base/_layout.scss:17:  padding-block: var(--space-16);
app/assets/scss/base/_layout.scss:23:  border-top: 1px solid var(--border-subtle);
app/assets/scss/base/_layout.scss:24:  border-bottom: 1px solid var(--border-subtle);
app/assets/scss/base/_layout.scss:29:  width: 100%;
app/assets/scss/base/_layout.scss:30:  max-width: var(--container-xl);
app/assets/scss/base/_layout.scss:32:  padding-inline: var(--space-6);
app/assets/scss/base/_layout.scss:36:// font-weight et line-height neutralisés pour un rendu identique lorsqu'appliqué sur un <h2 class="eyebrow">.
app/assets/scss/base/_layout.scss:41:  font-weight: var(--fw-regular);
app/assets/scss/base/_layout.scss:42:  line-height: inherit;
app/assets/scss/base/_layout.scss:45:  color: var(--accent);
app/assets/scss/base/_layout.scss:50:  color: var(--text-muted);
app/assets/scss/base/_layout.scss:53:// Texte long-forme : Ubuntu sans, interligne détendu.
app/assets/scss/base/_layout.scss:56:  line-height: var(--lh-relaxed);
app/assets/scss/base/_layout.scss:57:  color: var(--text-body);
app/assets/scss/base/_layout.scss:60:// Rangée de tags (chips) qui passent à la ligne — hero, stack /about, etc.
app/assets/scss/base/_layout.scss:61:// Reset de liste inclus pour un rendu propre en <ul>/<li> (no-op sur un <div>).
app/assets/scss/base/_layout.scss:67:  padding: 0;
app/assets/scss/base/_layout.scss:68:  list-style: none;
app/assets/scss/base/_layout.scss:72:// Réutilisée par le feed blog (/blog) et l'en-tête d'article (/blog/[...slug]).
app/assets/scss/base/_layout.scss:76:  align-items: center;
app/assets/scss/base/_layout.scss:80:  // Contraste (story 9.2) : méta d'article (date · lecture) = info réelle → palier
app/assets/scss/base/_layout.scss:82:  color: var(--text-muted);
app/assets/scss/base/_reset.scss:4:Normalizing styles have been helped along thanks to the fine work of
app/assets/scss/base/_reset.scss:5:Nicolas Gallagher and Jonathan Neal https://necolas.github.io/normalize.css/
app/assets/scss/base/_reset.scss:12:	- Normalize
app/assets/scss/base/_reset.scss:21:	- Jetpack infinite scroll
app/assets/scss/base/_reset.scss:22:# Utilities
app/assets/scss/base/_reset.scss:23:	- Accessibility
app/assets/scss/base/_reset.scss:24:	- Alignments
app/assets/scss/base/_reset.scss:32:/* Normalize
app/assets/scss/base/_reset.scss:35:/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */
app/assets/scss/base/_reset.scss:41: * 1. Correct the line height in all browsers.
app/assets/scss/base/_reset.scss:44:html {
app/assets/scss/base/_reset.scss:46:  line-height: 1.15;
app/assets/scss/base/_reset.scss:56:body {
app/assets/scss/base/_reset.scss:68: * Correct the font size and margin on `h1` elements within `section` and
app/assets/scss/base/_reset.scss:71:h1 {
app/assets/scss/base/_reset.scss:80: * 1. Add the correct box sizing in Firefox.
app/assets/scss/base/_reset.scss:90: * 1. Correct the inheritance and scaling of font size in all browsers.
app/assets/scss/base/_reset.scss:91: * 2. Correct the odd `em` font sizing in all browsers.
app/assets/scss/base/_reset.scss:102: * Remove the gray background on active links in IE 10.
app/assets/scss/base/_reset.scss:105:  background-color: transparent;
app/assets/scss/base/_reset.scss:110: * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.
app/assets/scss/base/_reset.scss:114:  text-decoration: underline;
app/assets/scss/base/_reset.scss:115:  text-decoration: underline dotted;
app/assets/scss/base/_reset.scss:119: * Add the correct font weight in Chrome, Edge, and Safari.
app/assets/scss/base/_reset.scss:123:  font-weight: bolder;
app/assets/scss/base/_reset.scss:127: * 1. Correct the inheritance and scaling of font size in all browsers.
app/assets/scss/base/_reset.scss:128: * 2. Correct the odd `em` font sizing in all browsers.
app/assets/scss/base/_reset.scss:138: * Add the correct font size in all browsers.
app/assets/scss/base/_reset.scss:145: * Prevent `sub` and `sup` elements from affecting the line height in
app/assets/scss/base/_reset.scss:151:  line-height: 0;
app/assets/scss/base/_reset.scss:153:  vertical-align: baseline;
app/assets/scss/base/_reset.scss:164:/* Embedded content
app/assets/scss/base/_reset.scss:168: * Remove the border on images inside links in IE 10.
app/assets/scss/base/_reset.scss:188:  line-height: 1.15;
app/assets/scss/base/_reset.scss:211: * Correct the inability to style clickable types in iOS and Safari.
app/assets/scss/base/_reset.scss:221: * Remove the inner border and padding in Firefox.
app/assets/scss/base/_reset.scss:228:  padding: 0;
app/assets/scss/base/_reset.scss:232: * Restore the focus styles unset by the previous rule.
app/assets/scss/base/_reset.scss:238:  outline: 1px dotted ButtonText;
app/assets/scss/base/_reset.scss:242: * Correct the padding in Firefox.
app/assets/scss/base/_reset.scss:245:  padding: 0.35rem 0.75rem 0.625rem;
app/assets/scss/base/_reset.scss:250: * 2. Correct the color inheritance from `fieldset` elements in IE.
app/assets/scss/base/_reset.scss:251: * 3. Remove the padding so developers are not caught out when they zero out
app/assets/scss/base/_reset.scss:256:  color: inherit;
app/assets/scss/base/_reset.scss:258:  max-width: 100%;
app/assets/scss/base/_reset.scss:259:  padding: 0;
app/assets/scss/base/_reset.scss:264: * Add the correct vertical alignment in Chrome, Firefox, and Opera.
app/assets/scss/base/_reset.scss:267:  vertical-align: baseline;
app/assets/scss/base/_reset.scss:271: * Remove the default vertical scrollbar in IE 10+.
app/assets/scss/base/_reset.scss:278: * 1. Add the correct box sizing in IE 10.
app/assets/scss/base/_reset.scss:279: * 2. Remove the padding in IE 10.
app/assets/scss/base/_reset.scss:284:  padding: 0;
app/assets/scss/base/_reset.scss:296: * 1. Correct the odd appearance in Chrome and Safari.
app/assets/scss/base/_reset.scss:297: * 2. Correct the outline style in Safari.
app/assets/scss/base/_reset.scss:301:  outline-offset: -2px;
app/assets/scss/base/_reset.scss:305: * Remove the inner padding in Chrome and Safari on macOS.
app/assets/scss/base/_reset.scss:312: * 1. Correct the inability to style clickable types in iOS and Safari.
app/assets/scss/base/_reset.scss:324: * Add the correct display in Edge, IE 10+, and Firefox.
app/assets/scss/base/_reset.scss:331: * Add the correct display in all browsers.
app/assets/scss/base/_reset.scss:334:  display: list-item;
app/assets/scss/base/_reset.scss:341: * Add the correct display in IE 10+.
app/assets/scss/base/_reset.scss:348: * Add the correct display in IE 10.
app/assets/scss/base/_reset.scss:350:[hidden] {
app/assets/scss/base/_reset.scss:358:@link http://css-tricks.com/inheriting-box-sizing-probably-slightly-better-best-practice/ */
app/assets/scss/base/_reset.scss:365:html {
app/assets/scss/base/_reset.scss:377:   Neutralise l'ancien `background: #fff` du reset (incompatible dark-first). */
app/assets/scss/base/_reset.scss:378:html {
app/assets/scss/base/_reset.scss:382:body {
app/assets/scss/base/_reset.scss:384:  color: var(--text-body);
app/assets/scss/base/_reset.scss:388:  background-color: #ccc;
app/assets/scss/base/_reset.scss:394:ul,
app/assets/scss/base/_reset.scss:395:ol {
app/assets/scss/base/_reset.scss:396:  --reset-ul-space-stack: #{space.$space-stack-16x};
app/assets/scss/base/_reset.scss:397:  --reset-ul-space-inline: #{space.$space-inline-32x};
app/assets/scss/base/_reset.scss:399:  margin: 0 0 var(--reset-ul-space-stack) var(--reset-ul-space-inline);
app/assets/scss/base/_reset.scss:402:ul {
app/assets/scss/base/_reset.scss:403:  list-style: disc;
app/assets/scss/base/_reset.scss:406:ol {
app/assets/scss/base/_reset.scss:407:  list-style: decimal;
app/assets/scss/base/_reset.scss:410:li > ul,
app/assets/scss/base/_reset.scss:411:li > ol {
app/assets/scss/base/_reset.scss:416:dt {
app/assets/scss/base/_reset.scss:420:dd {
app/assets/scss/base/_reset.scss:428:  max-width: 100%;
app/assets/scss/base/_reset.scss:433:  max-width: 100%;
app/assets/scss/base/_reset.scss:442:  width: 100%;
app/assets/scss/base/_reset.scss:457:  padding: 0;
app/assets/scss/base/_reset.scss:460:/* Make sure logo link wraps around logo image. */
app/assets/scss/base/_reset.scss:461:.custom-logo-link {
app/assets/scss/base/_reset.scss:462:  display: inline-block;
app/assets/scss/base/_reset.scss:469:  max-width: 100%;
app/assets/scss/base/_reset.scss:483:  text-align: center;
app/assets/scss/base/_reset.scss:495:  display: inline-block;
app/assets/scss/base/_reset.scss:496:  text-align: center;
app/assets/scss/base/_reset.scss:497:  width: 100%;
app/assets/scss/base/_reset.scss:500:.gallery-columns-2 {
app/assets/scss/base/_reset.scss:501:  grid-template-columns: repeat(2, 1fr);
app/assets/scss/base/_reset.scss:504:.gallery-columns-3 {
app/assets/scss/base/_reset.scss:505:  grid-template-columns: repeat(3, 1fr);
app/assets/scss/base/_reset.scss:508:.gallery-columns-4 {
app/assets/scss/base/_reset.scss:509:  grid-template-columns: repeat(4, 1fr);
app/assets/scss/base/_reset.scss:512:.gallery-columns-5 {
app/assets/scss/base/_reset.scss:513:  grid-template-columns: repeat(5, 1fr);
app/assets/scss/base/_reset.scss:516:.gallery-columns-6 {
app/assets/scss/base/_reset.scss:517:  grid-template-columns: repeat(6, 1fr);
app/assets/scss/base/_reset.scss:520:.gallery-columns-7 {
app/assets/scss/base/_reset.scss:521:  grid-template-columns: repeat(7, 1fr);
app/assets/scss/base/_reset.scss:524:.gallery-columns-8 {
app/assets/scss/base/_reset.scss:525:  grid-template-columns: repeat(8, 1fr);
app/assets/scss/base/_reset.scss:528:.gallery-columns-9 {
app/assets/scss/base/_reset.scss:529:  grid-template-columns: repeat(9, 1fr);
app/assets/scss/base/_reset.scss:540:/* Jetpack infinite scroll
app/assets/scss/base/_reset.scss:543:/* Hide the Posts Navigation and the Footer when Infinite Scroll is in use. */
app/assets/scss/base/_reset.scss:544:.infinite-scroll .posts-navigation,
app/assets/scss/base/_reset.scss:545:.infinite-scroll.neverending .site-footer {
app/assets/scss/base/_reset.scss:549:/* Re-display the Theme Footer when Infinite Scroll has reached its end. */
app/assets/scss/base/_reset.scss:555:# Utilities
app/assets/scss/base/_reset.scss:558:/* Accessibility
app/assets/scss/base/_reset.scss:564:  clip-path: inset(50%);
app/assets/scss/base/_reset.scss:567:  overflow: hidden;
app/assets/scss/base/_reset.scss:568:  padding: 0;
app/assets/scss/base/_reset.scss:569:  position: absolute !important;
app/assets/scss/base/_reset.scss:570:  width: 1px;
app/assets/scss/base/_reset.scss:575:  background-color: #f1f1f1;
app/assets/scss/base/_reset.scss:578:  clip-path: none;
app/assets/scss/base/_reset.scss:579:  color: #21759b;
app/assets/scss/base/_reset.scss:585:  line-height: normal;
app/assets/scss/base/_reset.scss:586:  padding: 15px 23px 14px;
app/assets/scss/base/_reset.scss:589:  width: auto;
app/assets/scss/base/_reset.scss:593:/* Do not show the outline on the skip link target. */
app/assets/scss/base/_reset.scss:595:  outline: 0;
app/assets/scss/base/_reset.scss:598:/* Alignments
app/assets/scss/base/_reset.scss:600:.alignleft {
app/assets/scss/base/_reset.scss:609:.alignright {
app/assets/scss/base/_reset.scss:618:.aligncenter {
app/assets/scss/main.scss:5:@use "base/layout"; // primitives de layout DS (.section / .container / .eyebrow / .prose) mutualisées
app/assets/scss/main.scss:9:  width: auto;
app/assets/scss/components/_card.scss:9://              font-weight-regular
app/assets/scss/components/_card.scss:11://              font-height-default
app/assets/scss/components/_card.scss:13://              font-weight-regular
app/assets/scss/components/_card.scss:15://              font-height-default
app/assets/scss/components/_card.scss:17://              font-weight-regular
app/assets/scss/components/_card.scss:19://              font-height-default
app/assets/scss/components/_card.scss:23:// 4px    space-inline-4x
app/assets/scss/components/_card.scss:24:// 8px    space-inline-8x
app/assets/scss/components/_card.scss:43:$-font-weight: variables.$font-weight-regular;
app/assets/scss/components/_card.scss:44:$-line-height: function.line-height($-font-size);
app/assets/scss/components/_card.scss:51:  --card-line-height: #{$-line-height};
app/assets/scss/components/_card.scss:54:  // color system
app/assets/scss/components/_card.scss:56:  --card-color-background: var(--color-background);
app/assets/scss/components/_card.scss:57:  --card-color-background-hover: var(--color-background-hover);
app/assets/scss/components/_card.scss:58:  --card-color-border: var(--color-border);
app/assets/scss/components/_card.scss:59:  --card-color-border-hover: var(--color-border-hover);
app/assets/scss/components/_card.scss:62:  --card-color-shapes: var(--card-color-border-hover);
app/assets/scss/components/_card.scss:63:  --card-color-shapes-hover: var(--card-color-text-hover);
app/assets/scss/components/_card.scss:64:  --card-color-shapes-active: var(--card-color-text-hover);
app/assets/scss/components/_card.scss:65:  --card-color-text: var(--color-text);
app/assets/scss/components/_card.scss:66:  --card-color-text-hover: var(--color-text-hover);
app/assets/scss/components/_card.scss:67:  --card-color-text-active: var(--color-text-active);
app/assets/scss/components/_card.scss:69:  background-color: var(--card-color-background);
app/assets/scss/components/_card.scss:70:  color: var(--card-color-text);
app/assets/scss/components/_card.scss:71:  border: 1px solid var(--card-color-border);
app/assets/scss/components/_card.scss:73:  padding: var(--card-space-inset);
app/assets/scss/components/_card.scss:75:  overflow: hidden;
app/assets/scss/components/_card.scss:76:  text-align: center;
app/assets/scss/components/_list.scss:7:$list-space-stack-4x: space.$space-stack-4x;
app/assets/scss/components/_list.scss:8:$list-space-stack-8x: space.$space-stack-8x;
app/assets/scss/components/_list.scss:12:// 4px         space-inline-4x
app/assets/scss/components/_list.scss:13:// 16px        space-inline-16x
app/assets/scss/components/_list.scss:14:$list-space-inline-4x: space.$space-inline-4x;
app/assets/scss/components/_list.scss:15:$list-space-inline-16x: space.$space-inline-16x;
app/assets/scss/components/_list.scss:19:// horizontal padding twice the vertical padding in list
app/assets/scss/components/_list.scss:23:$list-space-inset-4x-y: space.$space-inset-4x;
app/assets/scss/components/_list.scss:24:$list-space-inset-4x-x: space.$space-inset-8x;
app/assets/scss/components/_list.scss:25:$list-space-inset-8x-x: space.$space-inset-8x;
app/assets/scss/components/_list.scss:26:$list-space-inset-8x-y: space.$space-inset-16x;
app/assets/scss/components/_button.scss:5:@use "../abstract/color" as _color;
app/assets/scss/components/_button.scss:10://              font-weight-regular
app/assets/scss/components/_button.scss:12://              font-height-default
app/assets/scss/components/_button.scss:14://              font-weight-regular
app/assets/scss/components/_button.scss:16://              font-height-default
app/assets/scss/components/_button.scss:18://              font-weight-regular
app/assets/scss/components/_button.scss:20://              font-height-default
app/assets/scss/components/_button.scss:24:// 4px    space-inline-4x
app/assets/scss/components/_button.scss:25:// 12px   space-inline-12x
app/assets/scss/components/_button.scss:40:$-font-weight-large: variables.$font-weight-regular;
app/assets/scss/components/_button.scss:41:$-line-height-large: function.line-height($-font-size-large);
app/assets/scss/components/_button.scss:47:$-font-weight: variables.$font-weight-regular;
app/assets/scss/components/_button.scss:48:$-line-height: function.line-height($-font-size);
app/assets/scss/components/_button.scss:54:$-font-weight-small: variables.$font-weight-regular;
app/assets/scss/components/_button.scss:55:$-line-height-small: function.line-height($-font-size-small);
app/assets/scss/components/_button.scss:63:  --btn-line-height: #{$-line-height};
app/assets/scss/components/_button.scss:66:  --btn-min-width: #{function.min-width($-height)};
app/assets/scss/components/_button.scss:69:  // color system
app/assets/scss/components/_button.scss:71:  --btn-color-background: #{_color.$background};
app/assets/scss/components/_button.scss:72:  --btn-color-background-hover: #{_color.$background-hover};
app/assets/scss/components/_button.scss:73:  --btn-color-border: #{_color.$border};
app/assets/scss/components/_button.scss:74:  --btn-color-border-hover: #{_color.$border-hover};
app/assets/scss/components/_button.scss:75:  --btn-color-text: #{_color.$text};
app/assets/scss/components/_button.scss:76:  --btn-color-text-hover: #{_color.$text-hover};
app/assets/scss/components/_button.scss:77:  --btn-color-text-active: #{_color.$text-active};
app/assets/scss/components/_button.scss:80:  --btn-color-shapes: var(--btn-color-border-hover);
@use "base/reset";
@use "abstract/root"; // tokens DS globaux (:root CSS custom properties) — source de vérité
@use "abstract/fonts";
@use "abstract/typography";
@use "base/layout"; // primitives de layout DS (.section / .container / .eyebrow / .prose) mutualisées
@use "base/motion"; // filet a11y global prefers-reduced-motion (story 9.2)

.fixed-height {
  width: auto;
  height: 100%;
}

.img-center {
  display: flex;
  margin: 0 auto;
}

2026-09-13T07:36:13.030571Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '35,155p' app/assets/scss/base/_reset.scss; sed -n '365,430p' app/assets/scss/base/_reset.scss; sed -n '1,150p' app/assets/scss/abstract/_typography.scss; sed -n '1,100p' app/assets/scss/abstract/_root.scss" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */

/* Document
	 ========================================================================== */

/**
 * 1. Correct the line height in all browsers.
 * 2. Prevent adjustments of font size after orientation changes in iOS.
 */
html {
  font-size: 100%;
  line-height: 1.15;
  text-size-adjust: 100%;
}

/* Sections
	 ========================================================================== */

/**
 * Remove the margin in all browsers.
 */
body {
  margin: 0;
}

/**
 * Render the `main` element consistently in IE.
 */
main {
  display: block;
}

/**
 * Correct the font size and margin on `h1` elements within `section` and
 * `article` contexts in Chrome, Firefox, and Safari.
 */
h1 {
  font-size: 2rem;
  margin: 0.67rem 0;
}

/* Grouping content
	 ========================================================================== */

/**
 * 1. Add the correct box sizing in Firefox.
 * 2. Show the overflow in Edge and IE.
 */
hr {
  box-sizing: content-box;
  height: 0;
  overflow: visible;
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd `em` font sizing in all browsers.
 */
pre {
  font-family: monospace;
  font-size: 1rem;
}

/* Text-level semantics
	 ========================================================================== */

/**
 * Remove the gray background on active links in IE 10.
 */
a {
  background-color: transparent;
}

/**
 * 1. Remove the bottom border in Chrome 57-
 * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.
 */
abbr[title] {
  border-bottom: none;
  text-decoration: underline;
  text-decoration: underline dotted;
}

/**
 * Add the correct font weight in Chrome, Edge, and Safari.
 */
b,
strong {
  font-weight: bolder;
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd `em` font sizing in all browsers.
 */
code,
kbd,
samp {
  font-family: monospace;
  font-size: 1rem;
}

/**
 * Add the correct font size in all browsers.
 */
small {
  font-size: 80%;
}

/**
 * Prevent `sub` and `sup` elements from affecting the line height in
 * all browsers.
 */
sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

html {
  box-sizing: border-box;
}

/* --------------------------------------------------------------
# Base
-------------------------------------------------------------- */

/* Elements
--------------------------------------------- */

/* Base dark-first : fond sombre par défaut (tokens DS, story 2.1).
   Neutralise l'ancien `background: #fff` du reset (incompatible dark-first). */
html {
  background: var(--bg-page);
}

body {
  background: var(--bg-page);
  color: var(--text-body);
}

hr {
  background-color: #ccc;
  border: 0;
  height: 1px;
  margin-bottom: 1.5rem;
}

ul,
ol {
  --reset-ul-space-stack: #{space.$space-stack-16x};
  --reset-ul-space-inline: #{space.$space-inline-32x};

  margin: 0 0 var(--reset-ul-space-stack) var(--reset-ul-space-inline);
}

ul {
  list-style: disc;
}

ol {
  list-style: decimal;
}

li > ul,
li > ol {
  margin-bottom: 0;
  margin-left: 1.5rem;
}

dt {
  font-weight: 700;
}

dd {
  margin: 0 1.5rem 1.5rem;
}

/* Make sure embeds and iframes fit their containers. */
embed,
iframe,
object {
  max-width: 100%;
}

@use "function";
@use "variables";
@use "mixin";
@use "space";

body,
button,
input,
select,
optgroup,
textarea {
  --font-size: #{variables.$font-size-base};

  // Corps long : Ubuntu sans (token DS). Les titres/labels/code passent en mono ci-dessous.
  font-family: var(--font-sans);
  font-size: var(--font-size);
  font-weight: #{variables.$font-weight-regular};
  line-height: #{function.line-height(var(--font-size))};

  @include mixin.font-style-normal;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  clear: both;

  // Ubuntu Mono = voix signature pour les titres (token DS).
  font-family: var(--font-mono);
}

h1 {
  font-weight: #{variables.$font-weight-regular};
  font-size: #{variables.$font-size-3x-large};
  line-height: #{function.line-height(variables.$font-size-3x-large)};
}

h2 {
  font-weight: #{variables.$font-weight-thin};
  font-size: #{variables.$font-size-2x-large};
  line-height: #{function.line-height(variables.$font-size-2x-large)};
}

label,
legend {
  // Labels : Ubuntu Mono = voix signature pour les micro-libelles.
  font-family: var(--font-mono);
}

p {
  font-size: #{variables.$font-size-medium};

  // Long-form lisible : interligne détendu (token DS).
  line-height: var(--lh-relaxed);
  margin-bottom: #{space.$space-stack-24x};
}

dfn,
cite,
em,
i {
  font-style: italic;
}

blockquote {
  margin: 0 #{space.$space-stack-16x};
}

address {
  margin: 0 0 #{space.$space-stack-16x};
}

pre {
  font-family: var(--font-mono);
  font-size: #{variables.$font-size-base};
  line-height: #{function.line-height(variables.$font-size-base)};
  overflow: auto;
  padding: #{space.$space-inset-16x};
  margin-bottom: #{space.$space-stack-16x};
  max-width: 100%;
}

code,
kbd,
tt,
var {
  font-family: var(--font-mono);
}

abbr,
acronym {
  border: 1px dotted;
  cursor: help;
}

mark,
ins {
  background: var(--mark-color-background);
  text-decoration: none;
}

big {
  font-size: #{variables.$font-size-large};
  line-height: #{function.line-height(variables.$font-size-large)};
}
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

2026-09-13T07:36:16.485051Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "rg -n \"lh-relaxed|lh-tight|lh-snug|font-size-base|line-height\\(\" app/assets/scss/abstract app/assets/scss | head -120; sed -n '100,200p' app/assets/scss/abstract/_root.scss; sed -n '1,120p' app/assets/scss/abstract/_function.scss" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/assets/scss/base/_layout.scss:56:  line-height: var(--lh-relaxed);
app/assets/scss/abstract/_root.scss:125:  --lh-tight: 1.1;
app/assets/scss/abstract/_root.scss:126:  --lh-snug: 1.3;
app/assets/scss/abstract/_root.scss:128:  --lh-relaxed: 1.65;
app/assets/scss/abstract/_function.scss:23:@function line-height($font-size) {
app/assets/scss/components/_card.scss:12:// Medium       font-size-base
app/assets/scss/components/_card.scss:16:// Small        font-size-base
app/assets/scss/components/_card.scss:42:$-font-size: variables.$font-size-base;
app/assets/scss/components/_card.scss:44:$-line-height: function.line-height($-font-size);
app/assets/scss/components/_button.scss:13:// Medium       font-size-base
app/assets/scss/components/_button.scss:17:// Small        font-size-base
app/assets/scss/components/_button.scss:41:$-line-height-large: function.line-height($-font-size-large);
app/assets/scss/components/_button.scss:46:$-font-size: variables.$font-size-base;
app/assets/scss/components/_button.scss:48:$-line-height: function.line-height($-font-size);
app/assets/scss/components/_button.scss:53:$-font-size-small: variables.$font-size-base;
app/assets/scss/components/_button.scss:55:$-line-height-small: function.line-height($-font-size-small);
app/assets/scss/abstract/_root.scss:125:  --lh-tight: 1.1;
app/assets/scss/abstract/_root.scss:126:  --lh-snug: 1.3;
app/assets/scss/abstract/_root.scss:128:  --lh-relaxed: 1.65;
app/assets/scss/abstract/_function.scss:23:@function line-height($font-size) {
app/assets/scss/abstract/_typography.scss:12:  --font-size: #{variables.$font-size-base};
app/assets/scss/abstract/_typography.scss:18:  line-height: #{function.line-height(var(--font-size))};
app/assets/scss/abstract/_typography.scss:38:  line-height: #{function.line-height(variables.$font-size-3x-large)};
app/assets/scss/abstract/_typography.scss:44:  line-height: #{function.line-height(variables.$font-size-2x-large)};
app/assets/scss/abstract/_typography.scss:57:  line-height: var(--lh-relaxed);
app/assets/scss/abstract/_typography.scss:78:  font-size: #{variables.$font-size-base};
app/assets/scss/abstract/_typography.scss:79:  line-height: #{function.line-height(variables.$font-size-base)};
app/assets/scss/abstract/_typography.scss:107:  line-height: #{function.line-height(variables.$font-size-large)};
app/assets/scss/abstract/_variables.scss:20:// font-size-base      16px   1rem      Body text
app/assets/scss/abstract/_variables.scss:31:$font-size-base: 1rem;
app/assets/scss/abstract/_typography.scss:12:  --font-size: #{variables.$font-size-base};
app/assets/scss/abstract/_typography.scss:18:  line-height: #{function.line-height(var(--font-size))};
app/assets/scss/abstract/_typography.scss:38:  line-height: #{function.line-height(variables.$font-size-3x-large)};
app/assets/scss/abstract/_typography.scss:44:  line-height: #{function.line-height(variables.$font-size-2x-large)};
app/assets/scss/abstract/_typography.scss:57:  line-height: var(--lh-relaxed);
app/assets/scss/abstract/_typography.scss:78:  font-size: #{variables.$font-size-base};
app/assets/scss/abstract/_typography.scss:79:  line-height: #{function.line-height(variables.$font-size-base)};
app/assets/scss/abstract/_typography.scss:107:  line-height: #{function.line-height(variables.$font-size-large)};
app/assets/scss/abstract/_variables.scss:20:// font-size-base      16px   1rem      Body text
app/assets/scss/abstract/_variables.scss:31:$font-size-base: 1rem;
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
@use "variables";
@use "sass:map";

@function breakpoint($key) {
  @if map.has-key(variables.$breakpoints-container, $key) {
    @return map.get(variables.$breakpoints-container, $key);
  }

  @warn "Unknown `#{$key}` in $breakpoints-container.";
  @return null;
}

// line height = font size x 1.5
// ==========================================================
$-font-height: variables.$font-height-default or 1;

@function height($space-stack: 0, $font-size: 0) {
  $result: calc(#{$space-stack} * 2 + #{$font-size});

  @return $result;
}

@function line-height($font-size) {
  $result: calc(#{$font-size} * #{$-font-height});

  @return $result;
}

@function min-width($height) {
  $result: calc(#{$height} * 2);

  @return $result;
}

2026-09-13T07:36:25.300193Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
Several concrete gaps are emerging: the new heading exposes decorative `//`, the claimed line-height neutralization changes the rendered metrics, and the list wrappers can change card sizing. I’m checking the remaining semantic and documentation claims before consolidating the findings.
exec
/bin/zsh -lc "nl -ba app/pages/index.vue | sed -n '1,125p'; nl -ba app/pages/services.vue | sed -n '1,75p'; nl -ba app/pages/contact.vue | sed -n '88,128p'; nl -ba app/assets/scss/base/_layout.scss | sed -n '30,75p'; nl -ba docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md | sed -n '1,125p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	<template>
     2	  <main class="home">
     3	    <section class="hero hero__grad">
     4	      <div class="hero__in container">
     5	        <div class="hero__grid">
     6	          <!-- Colonne gauche : accroche, CTA, tags -->
     7	          <div class="anim hero__text">
     8	            <p class="eyebrow">// développeur web freelance</p>
     9	            <h1 class="hero__title">Du code <em>sur-mesure</em>,<br />de l'IA <em>utile</em>.</h1>
    10	            <p class="hero__sub">{{ tagline }}</p>
    11	            <div class="hero__cta">
    12	              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
    13	                Démarrer un projet
    14	                <template #iconRight><ZIcon name="arrow" /></template>
    15	              </ZButton>
    16	              <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir les services </ZButton>
    17	            </div>
    18	            <ul class="hero__tags">
    19	              <li v-for="tag in tags" :key="tag">
    20	                <ZTag>{{ tag }}</ZTag>
    21	              </li>
    22	            </ul>
    23	          </div>
    24	
    25	          <!-- Colonne droite : fenêtre terminal décorative (statique) -->
    26	          <div class="anim hero__term-col">
    27	            <div class="hero-term">
    28	              <div class="hero-term__bar">
    29	                <span class="hero-term__dots" aria-hidden="true">
    30	                  <span class="hero-term__dot hero-term__dot--close" />
    31	                  <span class="hero-term__dot hero-term__dot--min" />
    32	                  <span class="hero-term__dot hero-term__dot--max" />
    33	                </span>
    34	                <span class="hero-term__title">anon.@jouan.ovh: ~</span>
    35	              </div>
    36	
    37	              <div class="hero-term__body">
    38	                <template v-for="row in terminalRows" :key="row.id">
    39	                  <p class="hero-term__line" aria-hidden="true">
    40	                    <span class="prm"
    41	                      ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
    42	                      ><span class="prm__dir">~</span><span class="prm__sep">$ </span
    43	                      ><span class="prm__cmd">{{ row.cmd }}</span></span
    44	                    >
    45	                  </p>
    46	                  <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
    47	                </template>
    48	
    49	                <button
    50	                  type="button"
    51	                  class="hero-term__open"
    52	                  aria-label="Ouvrir le terminal interactif"
    53	                  @click="openTerminal"
    54	                >
    55	                  <span class="prm"
    56	                    ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
    57	                    ><span class="prm__dir">~</span><span class="prm__sep">$ </span><span class="prm__cmd">help</span
    58	                    ><span class="prm__caret" aria-hidden="true"
    59	                  /></span>
    60	                </button>
    61	              </div>
    62	            </div>
    63	          </div>
    64	        </div>
    65	      </div>
    66	    </section>
    67	
    68	    <!-- Aperçu services (porté de ServicesPreview, Home.jsx) -->
    69	    <section class="section">
    70	      <div class="container">
    71	        <p class="eyebrow">// ce que je fais</p>
    72	        <h2 class="section__title">Trois façons de travailler ensemble</h2>
    73	        <ul class="grid-3">
    74	          <li v-for="service in services" :key="service.id">
    75	            <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
    76	              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
    77	              <h3 class="offer__title">{{ service.title }}</h3>
    78	              <p class="offer__desc">{{ service.desc }}</p>
    79	              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
    80	                En savoir plus →
    81	              </NuxtLink>
    82	            </ZCard>
    83	          </li>
    84	        </ul>
    85	      </div>
    86	    </section>
    87	
    88	    <!-- Stats + projets sélectionnés — section en creux partagée (stories 3.2 / 3.3) -->
    89	    <section class="section section--sunken">
    90	      <div class="container">
    91	        <div class="statrow">
    92	          <div v-for="stat in stats" :key="stat.id" class="stat">
    93	            <b>{{ stat.value }}</b>
    94	            <span>{{ stat.label }}</span>
    95	          </div>
    96	        </div>
    97	
    98	        <h2 class="eyebrow">// projets sélectionnés</h2>
    99	        <ul class="grid-2 projects">
   100	          <li v-for="project in projects" :key="project.url">
   101	            <ZCard class="project" interactive as="a" :href="project.url" target="_blank" rel="noopener noreferrer">
   102	              <div class="project__head">
   103	                <h3 class="project__name">{{ project.name }}</h3>
   104	                <span class="project__role">{{ project.role }}</span>
   105	              </div>
   106	              <p class="prose project__desc">{{ project.desc }}</p>
   107	              <ul class="hero__tags">
   108	                <li v-for="tag in project.tags" :key="tag">
   109	                  <ZTag>{{ tag }}</ZTag>
   110	                </li>
   111	              </ul>
   112	              <span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span>
   113	            </ZCard>
   114	          </li>
   115	        </ul>
   116	      </div>
   117	    </section>
   118	  </main>
   119	</template>
   120	
   121	<script setup lang="ts">
   122	// Page d'accueil — hero Terminal (A) + aperçu services + stats. Porté de Home.jsx
   123	// (HeroTerminal / ServicesPreview / StatsProjects) du UI kit : recréation Vue 3 +
   124	// tokens (aucune copie JSX). Dark-first, accent orange. (Stories 3.1, 3.2, 3.3)
   125	import { NuxtLink } from "#components";
     1	<template>
     2	  <main class="services">
     3	    <!-- En-tête + grille d'offres (story 4.1). La 2e section (process) viendra en 4.2. -->
     4	    <section class="section">
     5	      <div class="container">
     6	        <p class="eyebrow">// services</p>
     7	        <h1 class="services__title">Des prestations claires, pensées comme des produits.</h1>
     8	        <p class="prose services__intro">
     9	          Du site WordPress à l'application sur-mesure, en passant par l'IA appliquée — je m'occupe de la technique,
    10	          vous gardez la main sur votre projet.
    11	        </p>
    12	
    13	        <ul class="grid-3">
    14	          <li v-for="offer in offers" :key="offer.id">
    15	            <ZCard class="offer" :accent="offer.featured" :featured="offer.featured">
    16	              <div v-if="offer.featured" class="offer__badge">
    17	                <ZBadge tone="accent">Le plus demandé</ZBadge>
    18	              </div>
    19	              <div class="offer__icon"><ZIcon :name="offer.icon" /></div>
    20	              <h2 class="offer__title">{{ offer.title }}</h2>
    21	              <p class="offer__desc">{{ offer.desc }}</p>
    22	              <ul class="offer__points">
    23	                <li v-for="point in offer.points" :key="point">{{ point }}</li>
    24	              </ul>
    25	              <div class="offer__price">
    26	                <b>{{ offer.price }}</b>
    27	              </div>
    28	              <div class="offer__cta">
    29	                <ZButton
    30	                  :as="NuxtLink"
    31	                  to="/contact"
    32	                  :variant="offer.featured ? 'primary' : 'secondary'"
    33	                  :aria-label="`Discuter du projet — ${offer.title}`"
    34	                  class="offer__btn"
    35	                >
    36	                  Discuter du projet
    37	                </ZButton>
    38	              </div>
    39	            </ZCard>
    40	          </li>
    41	        </ul>
    42	      </div>
    43	    </section>
    44	
    45	    <!-- Section process : 4 étapes ordonnées + CTA (story 4.2). Porté de Services.jsx L45-61. -->
    46	    <section class="section section--sunken">
    47	      <div class="container">
    48	        <p class="eyebrow">// comment ça se passe</p>
    49	        <h2 class="process__title">Un déroulé simple en quatre temps</h2>
    50	
    51	        <ol class="process">
    52	          <li v-for="step in steps" :key="step.n" class="process__step">
    53	            <div class="process__num" aria-hidden="true">{{ step.n }}</div>
    54	            <h3 class="process__step-title">{{ step.title }}</h3>
    55	            <p class="prose process__desc">{{ step.desc }}</p>
    56	          </li>
    57	        </ol>
    58	
    59	        <div class="process__cta">
    60	          <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
    61	            Demander un devis
    62	            <template #iconRight><ZIcon name="arrow" /></template>
    63	          </ZButton>
    64	        </div>
    65	      </div>
    66	    </section>
    67	  </main>
    68	</template>
    69	
    70	<script setup lang="ts">
    71	// Page Services — en-tête + grille des 3 offres (story 4.1) puis section process
    72	// (4 étapes ordonnées + CTA « Demander un devis », story 4.2). Porté de Services.jsx
    73	// du UI kit : recréation Vue 3 + tokens (aucune copie JSX). Dark-first, accent orange.
    74	import { NuxtLink } from "#components";
    75	
    88	          <!-- Colonne droite (story 7.2) : carte infos + carte CTA terminal + hexagones sociaux -->
    89	          <div class="contact__info">
    90	            <!-- Carte infos : email / localisation / disponibilité -->
    91	            <ZCard class="contact__infocard">
    92	              <dl class="contact__infolist">
    93	                <div class="infoitem">
    94	                  <dt class="infoitem__k"><span aria-hidden="true">// </span>email</dt>
    95	                  <dd class="infoitem__v">
    96	                    <a class="contact__email" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
    97	                  </dd>
    98	                </div>
    99	                <div class="infoitem">
   100	                  <dt class="infoitem__k"><span aria-hidden="true">// </span>localisation</dt>
   101	                  <dd class="infoitem__v">{{ contact.city }}</dd>
   102	                </div>
   103	                <div class="infoitem">
   104	                  <dt class="infoitem__k"><span aria-hidden="true">// </span>disponibilité</dt>
   105	                  <dd class="infoitem__v">
   106	                    <div class="contact__avail"><ZBadge tone="success" dot>Ouvert aux missions freelance</ZBadge></div>
   107	                  </dd>
   108	                </div>
   109	              </dl>
   110	            </ZCard>
   111	
   112	            <!-- Carte CTA terminal : ouvre l'easter-egg via le lanceur partagé (useTerminal) -->
   113	            <ZCard class="contact__term">
   114	              <!-- Prompt décoratif (flavor terminal) : aria-hidden — le bouton + l'invite portent le sens. -->
   115	              <p class="contact__prompt" aria-hidden="true">
   116	                anon.@jouan.ovh:~$ <span class="contact__prompt-cmd">./contact</span>
   117	              </p>
   118	              <p class="prose contact__term-text">Vous préférez la ligne de commande ? Ouvrez le terminal.</p>
   119	              <ZButton variant="terminal" size="sm" aria-haspopup="dialog" @click="openTerminal">
   120	                <template #icon><ZIcon name="terminal" /></template>
   121	                Ouvrir le terminal
   122	              </ZButton>
   123	            </ZCard>
   124	
   125	            <!-- Hexagones sociaux (composant partagé avec le footer) -->
   126	            <LinkListComponent />
   127	          </div>
   128	        </div>
    30	  max-width: var(--container-xl);
    31	  margin: 0 auto;
    32	  padding-inline: var(--space-6);
    33	}
    34	
    35	// Sur-titre mono en capitales espacées, accent orange.
    36	// font-weight et line-height neutralisés pour un rendu identique lorsqu'appliqué sur un <h2 class="eyebrow">.
    37	.eyebrow {
    38	  margin: 0 0 var(--space-3);
    39	  font-family: var(--font-mono);
    40	  font-size: var(--fs-xs);
    41	  font-weight: var(--fw-regular);
    42	  line-height: inherit;
    43	  letter-spacing: var(--ls-wider);
    44	  text-transform: uppercase;
    45	  color: var(--accent);
    46	}
    47	
    48	// Variante discrète (sur-titre secondaire, ex. « // stack »).
    49	.eyebrow--muted {
    50	  color: var(--text-muted);
    51	}
    52	
    53	// Texte long-forme : Ubuntu sans, interligne détendu.
    54	.prose {
    55	  font-family: var(--font-sans);
    56	  line-height: var(--lh-relaxed);
    57	  color: var(--text-body);
    58	}
    59	
    60	// Rangée de tags (chips) qui passent à la ligne — hero, stack /about, etc.
    61	// Reset de liste inclus pour un rendu propre en <ul>/<li> (no-op sur un <div>).
    62	.hero__tags {
    63	  display: flex;
    64	  flex-wrap: wrap;
    65	  gap: var(--space-2);
    66	  margin: 0;
    67	  padding: 0;
    68	  list-style: none;
    69	}
    70	
    71	// Ligne de méta mono discrète, items séparés par « · » (porté de kit.css .post__meta).
    72	// Réutilisée par le feed blog (/blog) et l'en-tête d'article (/blog/[...slug]).
    73	.post__meta {
    74	  display: flex;
    75	  gap: var(--space-3);
     1	---
     2	baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
     3	---
     4	
     5	# Story 10.2: A11y sémantique résiduelle (home / services / contact)
     6	
     7	Status: review
     8	
     9	<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
    10	
    11	## Story
    12	
    13	As a visiteur utilisant un lecteur d'écran,
    14	I want une sémantique de titres, de listes et de régions cohérente sur toutes les pages,
    15	so that la structure du site m'est annoncée correctement (FR12).
    16	
    17	## Acceptance Criteria
    18	
    19	**Given** home, services et la colonne d'infos `/contact`, encore en `<div>`/`<p>` à certains endroits
    20	**When** on généralise la convention a11y (libellé de section en `<h2 class="eyebrow">` neutralisé, séquences en `<ol>`/`<ul>`, process `/services` en `<ol>`, paires label/valeur `/contact` en `<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` non vocalisé)
    21	**Then** l'outline de titres est `h1 → h2…` sans saut sur home et services, les séquences sont des listes sémantiques, et le **rendu visuel reste identique** (h2 neutralisé, `list-style: none` + reset des marges)
    22	**And** `pnpm lint`/`typecheck`/`generate` verts ; arbre d'accessibilité vérifié au navigateur (desktop + mobile)
    23	
    24	## Tasks / Subtasks
    25	
    26	- [x] Tâche 1 — Home (`app/pages/index.vue`) : titres + listes (AC: tout)
    27	  - [x] Auditer l'outline : `<h1 class="hero__title">` (l.9). Les **libellés de section** qui ouvrent une section et n'ont pas de titre propre passent en `<h2 class="eyebrow">` ; ceux qui sont un **kicker au-dessus d'un titre existant** restent `<p>`. Cas : l.8 `// développeur web freelance` = kicker du hero (au-dessus du `<h1>`) → **reste `<p>`** ; l.69 `// ce que je fais` est suivi d'un `<h2 class="section__title">` (l.70) → kicker, **reste `<p>`** ; l.101 `// projets sélectionnés` → **vérifier** s'il est suivi d'un titre ; si non, le passer en `<h2 class="eyebrow">`. (Convention story 5.2 : `font-weight`/`line-height` hérités → rendu identique.)
    28	  - [x] **Séquences répétées en listes** : la grille des 3 offres (aperçu services) et la grille des projets sélectionnés (cartes `v-for`) → `<ul>` + `<li>` (`list-style: none` + reset marges UA → rendu identique). Numéros/ordre éventuels en `aria-hidden`.
    29	- [x] Tâche 2 — Services (`app/pages/services.vue`) : process en `<ol>` + titres (AC: tout)
    30	  - [x] **Process en `<ol>`/`<li>`** (différé revue 4.2) : `.process` est aujourd'hui `<div class="process"><div v-for="step" class="process__step">` avec `<div class="process__num">{{ step.n }}</div>` + `<h3>` (l.55-60). Passer `.process` en `<ol>`, `.process__step` en `<li>` ; les numéros `01…04` (`process__num`) en `aria-hidden="true"` (l'ordre est porté par la liste). `list-style: none` + reset → rendu identique.
    31	  - [x] La grille des **3 offres** (`v-for` offer, l.~25) → `<ul>`/`<li>` ; `offer__points` est déjà un `<ul>` (l.27) — OK. Vérifier l'outline : `<h1>` (l.7), `<h2 class="offer__title">` (l.25 — ⚠️ il y a un h2 par offre dans une grille ; acceptable si la section a un libellé), `<h2 class="process__title">` (l.53). Eyebrows l.6/l.52 = kickers de titres existants → restent `<p>`.
    32	- [x] Tâche 3 — Contact (`app/pages/contact.vue`) : colonne infos en `<dl>` + CTA terminal (AC: tout)
    33	  - [x] **Paires label/valeur** de `.contact__infocard` (l.91+) : aujourd'hui `<div class="infoitem__k">// email</div>` + valeur en `<div>`. Passer en `<dl>` / `<dt>` (label) / `<dd>` (valeur). Le préfixe `//` (décoratif) en `aria-hidden="true"` (ou pseudo-élément) pour ne pas être lu « slash slash ». Reset CSS pour rendu identique.
    34	  - [x] **CTA terminal** (carte ouvrant l'easter-egg) : ajouter `aria-haspopup="dialog"` (signale l'ouverture d'un overlay). Vérifier qu'un libellé/titre de section structure la colonne droite (un `<h2 class="eyebrow">` si elle ouvre une région sans titre).
    35	- [x] Tâche 4 — Validation (AC: tout)
    36	  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts.
    37	  - [x] **Diff visuel + arbre d'accessibilité** (Chrome DevTools MCP), desktop ET mobile : rendu **identique** au pixel (h2 neutralisés, listes reset) ; outline de titres `h1 → h2…` sans saut ; listes annoncées comme listes ; `//` non vocalisé.
    38	
    39	## Dev Notes
    40	
    41	### Périmètre & frontières
    42	
    43	- **Story de finition a11y sémantique** : généralise à **home** et **services** la convention déjà appliquée sur `/about` (5.2), `/blog` (6.1), article (6.2), + sémantique de la colonne `/contact` (différé 7.2). Source : `deferred-work.md` → Epic 10 items #1 et #3. [Source: epics.md#Epic 10 — Story 10.2 (FR12)]
    44	- **Frontières** : **PAS** de motion/contraste/forced-colors (= 9.x + story 10.4), **PAS** de SEO (= 10.5), **PAS** de changement visuel. Uniquement le **balisage sémantique** à rendu constant.
    45	- **Convention de référence (story 5.2, déjà dans project-context)** : un libellé de section (eyebrow `// …`) **qui ouvre une section** porte un `<h2 class="eyebrow">` (style neutralisé : `font-weight`/`line-height` hérités → rendu identique), **pas** un `<p>`. Une **séquence** (étapes, cartes répétées, tags) se balise en `<ol>`/`<ul>` + `<li>` (`list-style: none` + reset marges UA → rendu identique). [Source: docs/project-context.md#Accessibilité — Hiérarchie de titres & sémantique de listes]
    46	
    47	### Fichiers concernés (lus — baseline `3e82045`)
    48	
    49	- **`app/pages/index.vue`** (UPDATE) — hero eyebrow l.8 (kicker, reste `<p>`), `<h1>` l.9 ; section « ce que je fais » l.69 eyebrow + `<h2 section__title>` l.70 ; section « projets sélectionnés » l.101 (auditer le titre). Grilles offres + projets en `v-for` → `<ul>`/`<li>`. ⚠️ l.110 carte projet a `target="_blank"` + sr-only (story 10.3, ne pas dupliquer ici).
    50	- **`app/pages/services.vue`** (UPDATE) — `.process` (l.50-62) en `<ol>`/`<li>` + `process__num` `aria-hidden` ; grille des 3 offres `v-for` (l.~25) en `<ul>`/`<li>` ; `offer__points` déjà `<ul>` (l.27). Steps proviennent de `const steps` (process 4 temps).
    51	- **`app/pages/contact.vue`** (UPDATE) — `.contact__info` / `.contact__infocard` (l.89-101) : `infoitem__k` (`// email` / `// localisation` / `// disponibilité`) → `<dl>/<dt>/<dd>` + `//` `aria-hidden`. CTA terminal → `aria-haspopup="dialog"`. Données via `SITE.profile` (`app/data/site.ts`) — ne pas re-hardcoder.
    52	- **`app/assets/scss/base/_layout.scss`** (LECTURE/UPDATE éventuel) — la classe globale `.eyebrow` neutralise déjà le style d'un `<h2>`. Si un reset de liste générique manque, l'ajouter au partiel global, pas en scoped (convention 5.1).
    53	
    54	### Pièges / régressions à éviter
    55	
    56	- **Rendu strictement identique** : tout changement de balise doit neutraliser le style UA (h2 → hérite `font-weight`/`line-height` via `.eyebrow` ; ol/ul → `list-style: none; margin: 0; padding: 0`). Vérif à l'œil (A1), pas seulement au code.
    57	- **Ne pas toucher** : le `target="_blank"`/sr-only (story 10.3), le SEO (10.5), les états/motion (9.x/10.4). Ne pas casser le `v-for :key`.
    58	- **Eyebrow = kicker vs ouverture de section** : ne pas transformer mécaniquement TOUS les eyebrows en `<h2>` — seuls ceux qui ouvrent une section **sans** titre propre. Un eyebrow au-dessus d'un `<h1>`/`<h2>` existant reste `<p>` (sinon doublon de titre).
    59	- **Prerender (NFR4)** : pur markup, safe. **pnpm + Docker** pour toute commande.
    60	- **Contraste `//`** : si `//` passe en pseudo-élément, garder le token de couleur (pas de hardcode).
    61	
    62	### Testing standards
    63	
    64	- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + **diff visuel** (rendu identique) et **arbre d'accessibilité** (Chrome DevTools MCP) desktop + mobile : outline titres, listes annoncées, `//` non lu, `aria-haspopup` présent. [Source: project-context.md#Tests, #Vérif visuelle avant revue]
    65	
    66	### References
    67	
    68	- [Source: docs/planning-artifacts/epics.md#Epic 10 — Story 10.2 (FR12)]
    69	- [Source: docs/implementation-artifacts/deferred-work.md#→ Epic 10 (item #1 titres/listes, #3 sémantique /contact) ; revues 4.2, 5.2, 6.1, 7.2]
    70	- [Source: docs/project-context.md#Accessibilité (convention titres/listes 5.2), #Vérif visuelle avant revue]
    71	- [Source: app/pages/index.vue, app/pages/services.vue, app/pages/contact.vue, app/assets/scss/base/_layout.scss, app/data/site.ts]
    72	
    73	## Dev Agent Record
    74	
    75	### Agent Model Used
    76	
    77	- Gemini 3.7 Flash (Low)
    78	
    79	### Debug Log References
    80	
    81	- Validation Docker `pnpm lint`, `pnpm typecheck`, `pnpm generate` exécutée avec succès (11 routes prerendered).
    82	
    83	### Completion Notes List
    84	
    85	- `app/assets/scss/base/_layout.scss` : neutralisation de `font-weight` et `line-height` sur `.eyebrow` pour les balises `<h2>`.
    86	- `app/pages/index.vue` :
    87	  - `hero__tags` encapsulé en `<ul>`/`<li>` (hero et projets).
    88	  - Titre de section `// projets sélectionnés` passé en `<h2 class="eyebrow">` (l'eyebrow ouvre la section projets sans titre secondaire).
    89	  - Grille des 3 services et grille des 2 projets passées en `<ul>`/`<li>` avec reset CSS (`margin: 0; padding: 0; list-style: none`).
    90	- `app/pages/services.vue` :
    91	  - Grille des 3 offres passée en `<ul>`/`<li>` avec reset CSS.
    92	  - Process 4 étapes passé en `<ol class="process">` / `<li class="process__step">` avec `process__num` marqué en `aria-hidden="true"` et reset CSS.
    93	- `app/pages/contact.vue` :
    94	  - Carte infos structurée en `<dl class="contact__infolist">`, `<dt class="infoitem__k">`, `<dd class="infoitem__v">`.
    95	  - Préfixe `// ` encapsulé dans `<span aria-hidden="true">// </span>` pour éviter la vocalisation "slash slash" par les lecteurs d'écran.
    96	  - Reset CSS sur `dl`, `dt`, `dd` pour garantir la stricte conformité visuelle.
    97	  - Bouton CTA terminal enrichi de `aria-haspopup="dialog"`.
    98	
    99	### File List
   100	
   101	- `app/assets/scss/base/_layout.scss` (MODIFIED)
   102	- `app/pages/index.vue` (MODIFIED)
   103	- `app/pages/services.vue` (MODIFIED)
   104	- `app/pages/contact.vue` (MODIFIED)
   105	- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
   106	- `docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md` (MODIFIED)

2026-09-13T07:36:54.722791Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
The diff has been fully inspected, including the affected component behavior, global reset/typography rules, terminal implementation, and completion notes. I identified more than ten concrete issues and am ready to report them.
  ✓ Read the adversarial review skill instructions
  ✓ Inspect the provided diff and identify skeptical findings
  ✓ Return at least ten Markdown-list findings
2026-09-13T07:37:59.746507Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
- `app/assets/scss/base/_layout.scss:37-42` changes eyebrow line-height from paragraph spacing to inherited body spacing, so existing and converted eyebrows are not visually identical.
- `app/pages/index.vue:98` leaves the decorative `//` inside the new heading’s accessible name, causing screen readers to announce “slash slash”.
- `app/pages/index.vue:8,71` and `app/pages/services.vue:6,48` still expose decorative `//` prefixes, contradicting the stated non-vocalization requirement.
- `app/pages/contact.vue:119` announces a dialog popup, but the opened terminal has no `role="dialog"`, accessible name, or dialog state.
- The home terminal trigger in `app/pages/index.vue:49-60` opens the same terminal without the new `aria-haspopup="dialog"` semantics, leaving equivalent triggers inconsistent.
- `app/pages/services.vue:13-41` moves cards beneath grid `<li>` wrappers without giving `.offer` `height: 100%`; the existing `margin-top: auto` alignment no longer operates on the stretched grid height.
- `app/pages/index.vue:73-84` similarly makes each `<li>` the stretched grid item while the nested service card remains intrinsic-height, changing card backgrounds and row alignment.
- `app/pages/index.vue:99-115` similarly prevents project cards from filling their grid cells, changing the original card geometry.
- `app/pages/index.vue:101` renders the project card as an inline `<a>` inside an `<li>`; unlike the former grid-level anchor, it is not explicitly block-level and may not paint its border, padding, hover area, and focus ring across the full card.
- The new list wrappers add an extra layout box around every card, but the diff does not verify overflow, focus-ring coverage, hover bounds, or click-area parity at desktop and mobile widths.
- `app/pages/index.vue:107-111` nests a block-level tag list inside the inline project anchor without adding display/layout rules to the anchor, making its formatting behavior browser-dependent.
- The documentation marks all validation tasks complete even though the diff contains no screenshots, accessibility-tree captures, browser output, or reproducible validation artifacts.
- `docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md:81` claims successful Docker validation and eleven prerendered routes without recording command output or generated-route evidence.
- The completion note claims a reset of `dl`, `dt`, and `dd`, but the implementation only resets `.contact__infolist`, `.infoitem__k`, and `.infoitem__v`, so the documentation does not accurately describe the CSS change.
- The completed task descriptions retain provisional wording such as “vérifier” and stale pre-change line references, making the story record ambiguous about what was actually validated.
tokens used
85 301
- `app/assets/scss/base/_layout.scss:37-42` changes eyebrow line-height from paragraph spacing to inherited body spacing, so existing and converted eyebrows are not visually identical.
- `app/pages/index.vue:98` leaves the decorative `//` inside the new heading’s accessible name, causing screen readers to announce “slash slash”.
- `app/pages/index.vue:8,71` and `app/pages/services.vue:6,48` still expose decorative `//` prefixes, contradicting the stated non-vocalization requirement.
- `app/pages/contact.vue:119` announces a dialog popup, but the opened terminal has no `role="dialog"`, accessible name, or dialog state.
- The home terminal trigger in `app/pages/index.vue:49-60` opens the same terminal without the new `aria-haspopup="dialog"` semantics, leaving equivalent triggers inconsistent.
- `app/pages/services.vue:13-41` moves cards beneath grid `<li>` wrappers without giving `.offer` `height: 100%`; the existing `margin-top: auto` alignment no longer operates on the stretched grid height.
- `app/pages/index.vue:73-84` similarly makes each `<li>` the stretched grid item while the nested service card remains intrinsic-height, changing card backgrounds and row alignment.
- `app/pages/index.vue:99-115` similarly prevents project cards from filling their grid cells, changing the original card geometry.
- `app/pages/index.vue:101` renders the project card as an inline `<a>` inside an `<li>`; unlike the former grid-level anchor, it is not explicitly block-level and may not paint its border, padding, hover area, and focus ring across the full card.
- The new list wrappers add an extra layout box around every card, but the diff does not verify overflow, focus-ring coverage, hover bounds, or click-area parity at desktop and mobile widths.
- `app/pages/index.vue:107-111` nests a block-level tag list inside the inline project anchor without adding display/layout rules to the anchor, making its formatting behavior browser-dependent.
- The documentation marks all validation tasks complete even though the diff contains no screenshots, accessibility-tree captures, browser output, or reproducible validation artifacts.
- `docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md:81` claims successful Docker validation and eleven prerendered routes without recording command output or generated-route evidence.
- The completion note claims a reset of `dl`, `dt`, and `dd`, but the implementation only resets `.contact__infolist`, `.infoitem__k`, and `.infoitem__v`, so the documentation does not accurately describe the CSS change.
- The completed task descriptions retain provisional wording such as “vérifier” and stale pre-change line references, making the story record ambiguous about what was actually validated.
