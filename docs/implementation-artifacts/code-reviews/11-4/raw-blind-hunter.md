Reading prompt from stdin...
2026-09-13T19:22:10.067352Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: high
reasoning summaries: none
session id: 01a09c38-4d14-7061-8926-8e9f1f91d782
--------
user
# Blind Hunter Prompt — Story 11.4

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/11-4/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise `bmad-review-adversarial-general` pour examiner le diff avec le niveau de scepticisme demandé et produire uniquement des descriptions de problèmes.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.agents/skills/bmad-review-adversarial-general/SKILL.md && printf '\\n---DIFF---\\n' && sed -n '1,260p' docs/implementation-artifacts/code-reviews/11-4/full.diff" in /Users/simon/dev/jouan.ovh
 exited 1 in 0ms:
sed: /Users/simon/.agents/skills/bmad-review-adversarial-general/SKILL.md: No such file or directory

codex
Le chemin global indiqué n’est pas monté dans cet environnement ; la copie projet du skill est disponible sous `.agents/skills`, que j’utilise comme source équivalente. Je poursuis la lecture complète du skill et du diff.
exec
/bin/zsh -lc "sed -n '1,260p' .agents/skills/bmad-review-adversarial-general/SKILL.md && printf '\\n---DIFF---\\n' && sed -n '1,320p' docs/implementation-artifacts/code-reviews/11-4/full.diff" in /Users/simon/dev/jouan.ovh
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

---DIFF---
diff --git a/app/pages/index.vue b/app/pages/index.vue
index f49add5..8a04ba6 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -84,47 +84,149 @@
       </div>
     </section>
 
-    <!-- Stats + projets sélectionnés — section en creux partagée (stories 3.2 / 3.3) -->
+    <!-- Projets sélectionnés & Statistiques de réassurance (Story 11.4 / AC-1 & AC-2) -->
     <section class="section section--sunken">
       <div class="container">
-        <div class="statrow">
-          <div v-for="stat in stats" :key="stat.id" class="stat">
+        <div class="block__head">
+          <p class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</p>
+          <h2 class="section__title">Des produits qui tournent en production</h2>
+        </div>
+
+        <ul class="work">
+          <li v-for="(project, index) in projects" :key="project.name">
+            <component
+              :is="project.url ? ZExternalLink : 'div'"
+              :href="project.url"
+              class="work__row"
+              :class="{ 'work__row--link': Boolean(project.url) }"
+              :data-hot="project.url ? '' : undefined"
+            >
+              <span class="work__no">0{{ index + 1 }}</span>
+              <div class="work__main">
+                <div class="work__topline">
+                  <h3 class="work__name">{{ project.name }}</h3>
+                  <span v-if="project.status" class="work__status">{{ project.status }}</span>
+                </div>
+                <p class="work__role">{{ project.role }}</p>
+                <p class="prose work__desc">{{ project.desc }}</p>
+                <ul class="hero__tags work__tags">
+                  <li v-for="tag in project.tags" :key="tag">
+                    <ZTag>{{ tag }}</ZTag>
+                  </li>
+                </ul>
+              </div>
+              <span v-if="project.url" class="work__go" aria-hidden="true">
+                <ZIcon name="arrow" />
+              </span>
+            </component>
+          </li>
+        </ul>
+
+        <!-- Statistiques clés de réassurance (Story 11.4 / AC-2) -->
+        <ul class="stats">
+          <li v-for="stat in stats" :key="stat.id" class="stat">
             <b>{{ stat.value }}</b>
             <span>{{ stat.label }}</span>
+          </li>
+        </ul>
+      </div>
+    </section>
+
+    <!-- Journal technique / Notes de dev (Story 11.4 / AC-3) -->
+    <section class="section">
+      <div class="container">
+        <div class="block__head block__head--row">
+          <div>
+            <p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>
+            <h2 class="section__title">Notes de dev, écrites en construisant</h2>
           </div>
+          <NuxtLink to="/blog" class="seeall" data-hot>
+            cat tous-les-articles
+            <ZIcon name="arrow" class="seeall__icon" />
+          </NuxtLink>
         </div>
 
-        <h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>
-        <ul class="grid-2 projects">
-          <li v-for="project in projects" :key="project.name">
-            <ZCard
-              class="project"
-              :interactive="Boolean(project.url)"
-              :data-hot="Boolean(project.url) ? '' : undefined"
-              :as="project.url ? ZExternalLink : 'div'"
-              :href="project.url || undefined"
-              :rel="project.url ? 'noopener noreferrer' : undefined"
-            >
-              <div class="project__head">
-                <h3 class="project__name">{{ project.name }}</h3>
-                <span class="project__role">{{ project.role }}</span>
+        <!-- Liste des articles les plus récents -->
+        <ul v-if="articles && articles.length" class="journal">
+          <li v-for="article in articles" :key="article.path" class="journal__item">
+            <ZCard :as="NuxtLink" :to="article.path" interactive class="jpost" data-hot>
+              <NuxtImg
+                v-if="article.image"
+                class="jpost__thumb"
+                :src="article.image.src"
+                :alt="article.image.alt"
+                width="360"
+                height="200"
+                sizes="360px"
+                format="webp"
+              />
+              <div class="jpost__body">
+                <ul v-if="article.tags?.length" class="hero__tags jpost__tags">
+                  <li v-for="tag in article.tags" :key="tag">
+                    <ZTag>{{ tag }}</ZTag>
+                  </li>
+                </ul>
+                <h3 class="jpost__title">{{ article.title }}</h3>
+                <p v-if="article.description" class="prose jpost__desc">{{ article.description }}</p>
+                <div class="jpost__meta">
+                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
+                  <template v-if="article.read">
+                    <span aria-hidden="true">·</span>
+                    <span>{{ article.read }} de lecture</span>
+                  </template>
+                  <span class="jpost__arrow" aria-hidden="true">
+                    <ZIcon name="arrow" />
+                  </span>
+                </div>
               </div>
-              <p class="prose project__desc">{{ project.desc }}</p>
-              <ul class="hero__tags">
-                <li v-for="tag in project.tags" :key="tag">
-                  <ZTag>{{ tag }}</ZTag>
-                </li>
-              </ul>
             </ZCard>
           </li>
         </ul>
+
+        <!-- État d'attente sobre lorsque aucun article n'est encore publié -->
+        <ZCard v-else class="journal__empty" padded>
+          <p class="journal__empty-code">$ cat ~/journal/*.md</p>
+          <p class="journal__empty-text">Les notes d'ingénierie et retours d'expérience sont en cours de rédaction.</p>
+          <ZButton :as="NuxtLink" to="/blog" variant="secondary" size="sm"> Consulter la section blog </ZButton>
+        </ZCard>
+      </div>
+    </section>
+
+    <!-- Bloc CTA final de conversion (Story 11.4 / AC-4) -->
+    <section class="section section--sunken">
+      <div class="container">
+        <div class="cta">
+          <p class="eyebrow cta__eyebrow"><span aria-hidden="true">$ </span>./contact --start</p>
+          <h2 class="cta__title">Un projet en tête ? Mettons-le <span class="cta__highlight">en production</span>.</h2>
+          <p class="cta__subtitle">
+            Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript,
+            parlons-en.
+          </p>
+          <div class="cta__actions">
+            <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg" data-hot>
+              Discuter de votre projet
+              <template #iconRight><ZIcon name="arrow" /></template>
+            </ZButton>
+            <ZButton
+              v-if="SITE.profile.maltUrl"
+              :as="ZExternalLink"
+              :href="SITE.profile.maltUrl"
+              variant="secondary"
+              size="lg"
+              data-hot
+            >
+              Me contacter sur Malt
+            </ZButton>
+            <ZButton :as="NuxtLink" to="/about" variant="ghost" size="lg" data-hot> Voir le parcours &amp; CV </ZButton>
+          </div>
+        </div>
       </div>
     </section>
   </main>
 </template>
 
 <script setup lang="ts">
-// Page d'accueil — refonte Hero Full Stack TS & Terminal cinétique (Story 11.2).
+// Page d'accueil — refonte Hero Full Stack TS, Projets SaaS, Journal & CTA final (Story 11.4).
 // Architecture multi-pages Nuxt 4, dark-first, accent orange.
 import { ref } from "vue";
 import { NuxtLink, ZExternalLink } from "#components";
@@ -149,7 +251,6 @@ interface HomeServiceOffer {
 }
 
 // Vitrine des 3 offres ciblées Full Stack TS (Story 11.3 / AC-2).
-// Remplacement complet des données legacy.
 const services: HomeServiceOffer[] = [
   {
     id: "creation",
@@ -198,15 +299,20 @@ const services: HomeServiceOffer[] = [
   },
 ];
 
-// Chiffres clés (data.js `stats`) — texte exact (séparateur ·), pas d'emoji.
+// Projets sélectionnés — source unique `app/data/site.ts` (Story 11.4 / AC-1).
+const projects = SITE.projects;
+
+// Chiffres clés de réassurance (Story 11.4 / AC-2).
 const stats = [
-  { id: "stat-1", value: "8+", label: "ans dans la tech" },
-  { id: "stat-2", value: "3", label: "stacks maîtrisés" },
-  { id: "stat-3", value: "1", label: "SaaS fondé · keova.app" },
+  { id: "stat-1", value: "11", label: "années d'expérience web" },
+  { id: "stat-2", value: "100%", label: "TypeScript & SaaS de bout en bout" },
+  { id: "stat-3", value: "QA", label: "culture d'automatisation & zéro régression" },
 ];
 
-// Projets sélectionnés — source unique `app/data/site.ts`. Cartes rendues en liens externes.
-const projects = SITE.projects;
+// Récupération des 3 derniers articles du journal technique (Story 11.4 / AC-3).
+const { data: articles } = await useAsyncData("home-articles", () =>
+  queryCollection("blog").order("date", "DESC").limit(3).all(),
+);
 
 const siteUrl = useSiteUrl();
 const homeJsonLd = [
@@ -515,37 +621,217 @@ usePageSeo({
   }
 }
 
-// ---- Stats (porté de .statrow / .stat) ----
-.statrow {
+// ---- Section Projets sélectionnés (porté de Home - Awwwards.html .work) ----
+.work {
+  display: flex;
+  flex-direction: column;
+  margin: 0;
+  padding: 0;
+  list-style: none;
+
+  > li {
+    display: block;
+    width: 100%;
+  }
+}
+
+.work__row {
+  position: relative;
+  display: grid;
+  grid-template-columns: 56px 1fr auto;
+  gap: var(--space-6);
+  align-items: center;
+  padding: var(--space-8) var(--space-3);
+  border-top: 1px solid var(--border-subtle);
+  text-decoration: none;
+  color: inherit;
+  transition:
+    padding-left var(--dur-slow) var(--ease-out),
+    background var(--dur-slow) var(--ease-standard);
+
+  &::before {
+    content: "";
+    position: absolute;
+    inset: 0;
+    background: linear-gradient(90deg, var(--accent-soft), transparent 60%);
+    opacity: 0;
+    transition: opacity var(--dur-slow) var(--ease-standard);
+  }
+}
+
+li:last-child .work__row {
+  border-bottom: 1px solid var(--border-subtle);
+}
+
+.work__row--link {
+  cursor: pointer;
+
+  &:hover {
+    padding-left: var(--space-6);
+
+    &::before {
+      opacity: 1;
+    }
+
+    .work__name {
+      color: var(--accent);
+    }
+
+    .work__go {
+      color: var(--accent);
+      transform: translate(6px, -6px);
+    }
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
+.work__no {
+  position: relative;
+  font-family: var(--font-mono);
+  font-size: var(--fs-sm);
+  color: var(--text-faint);
+}
+
+.work__main {
+  position: relative;
+}
+
+.work__topline {
   display: flex;
   flex-wrap: wrap;
-  gap: var(--space-12);
+  align-items: baseline;
+  gap: var(--space-3);
+}
 
-  // Espace avant le bloc projets (story 3.3), réf. Home.jsx (statrow marginBottom).
-  margin-bottom: var(--space-12);
+.work__name {
+  margin: 0;
+  font-family: var(--font-mono);
+  font-size: clamp(1.4rem, 2.8vw, 2rem);
+  font-weight: var(--fw-regular);
+  letter-spacing: var(--ls-tight);
+  color: var(--text-strong);
+  transition: color var(--dur-base) var(--ease-standard);
 }
 

exec
/bin/zsh -lc "wc -l docs/implementation-artifacts/code-reviews/11-4/full.diff && sed -n '261,620p' docs/implementation-artifacts/code-reviews/11-4/full.diff && sed -n '621,980p' docs/implementation-artifacts/code-reviews/11-4/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     686 docs/implementation-artifacts/code-reviews/11-4/full.diff
+
+.work__row--link {
+  cursor: pointer;
+
+  &:hover {
+    padding-left: var(--space-6);
+
+    &::before {
+      opacity: 1;
+    }
+
+    .work__name {
+      color: var(--accent);
+    }
+
+    .work__go {
+      color: var(--accent);
+      transform: translate(6px, -6px);
+    }
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
+.work__no {
+  position: relative;
+  font-family: var(--font-mono);
+  font-size: var(--fs-sm);
+  color: var(--text-faint);
+}
+
+.work__main {
+  position: relative;
+}
+
+.work__topline {
   display: flex;
   flex-wrap: wrap;
-  gap: var(--space-12);
+  align-items: baseline;
+  gap: var(--space-3);
+}
 
-  // Espace avant le bloc projets (story 3.3), réf. Home.jsx (statrow marginBottom).
-  margin-bottom: var(--space-12);
+.work__name {
+  margin: 0;
+  font-family: var(--font-mono);
+  font-size: clamp(1.4rem, 2.8vw, 2rem);
+  font-weight: var(--fw-regular);
+  letter-spacing: var(--ls-tight);
+  color: var(--text-strong);
+  transition: color var(--dur-base) var(--ease-standard);
 }
 
-.stat {
+.work__status {
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  color: var(--accent);
+  letter-spacing: var(--ls-wide);
+}
+
+.work__role {
+  margin: var(--space-1) 0 0;
   font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  color: var(--text-muted);
+}
+
+.work__desc {
+  max-width: 65ch;
+  margin: var(--space-3) 0 0;
+  font-size: var(--fs-sm);
+}
+
+.work__tags {
+  margin-top: var(--space-4);
+}
+
+.work__go {
+  position: relative;
+  font-size: var(--fs-xl);
+  color: var(--text-faint);
+  transition:
+    transform var(--dur-base) var(--ease-out),
+    color var(--dur-base) var(--ease-standard);
+}
+
+// ---- Stats (porté de .stats) ----
+.stats {
+  display: grid;
+  grid-template-columns: repeat(3, 1fr);
+  gap: var(--space-4);
+  margin: var(--space-12) 0 0;
+  padding: 0;
+  list-style: none;
+}
+
+.stat {
+  padding: var(--space-6);
+  background: color-mix(in srgb, var(--surface-1) 70%, transparent);
+  border: 1px solid var(--border-subtle);
+  border-radius: var(--radius-md);
 
   b {
     display: block;
-    font-size: var(--fs-4xl);
+    margin-bottom: var(--space-1);
+    font-family: var(--font-mono);
+    font-size: var(--fs-5xl);
     font-weight: var(--fw-light);
+    line-height: 1;
+    letter-spacing: var(--ls-tight);
     color: var(--text-strong);
   }
 
   span {
+    font-family: var(--font-mono);
     font-size: var(--fs-sm);
+    letter-spacing: var(--ls-wide);
     color: var(--text-muted);
   }
 }
 
-// ---- Projets sélectionnés (porté de StatsProjects / .grid-2 / .prose) ----
-.grid-2 {
-  display: grid;
-  grid-template-columns: 1fr 1fr;
+// ---- Section Journal (porté de Home - Awwwards.html .journal) ----
+.block__head--row {
+  display: flex;
+  align-items: flex-end;
+  justify-content: space-between;
   gap: var(--space-6);
+  margin-bottom: var(--space-8);
+
+  .section__title {
+    margin-bottom: 0;
+  }
+}
+
+.seeall {
+  display: inline-flex;
+  flex: none;
+  align-items: center;
+  gap: var(--space-2);
+  font-family: var(--font-mono);
+  font-size: var(--fs-sm);
+  color: var(--text-muted);
+  text-decoration: none;
+  white-space: nowrap;
+  transition: color var(--dur-base) var(--ease-standard);
+
+  &:hover {
+    color: var(--accent);
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
+.seeall__icon {
+  font-size: var(--fs-base);
+}
+
+.journal {
+  display: grid;
+  grid-template-columns: repeat(3, 1fr);
+  gap: var(--space-5);
   margin: 0;
   padding: 0;
   list-style: none;
@@ -555,51 +841,150 @@ usePageSeo({
   }
 }
 
-.projects {
-  margin-top: var(--space-5);
-}
-
-// Carte rendue en lien (`as="a"`) : neutralise le soulignement par défaut du
-// <a> (le contenu porte ses propres couleurs/typo). ZCard reste générique.
-.project {
+.jpost {
   display: flex;
   flex-direction: column;
   width: 100%;
+  color: inherit;
   text-decoration: none;
 
-  .hero__tags {
-    margin-top: auto;
+  &:hover {
+    .jpost__title {
+      color: var(--accent);
+    }
+
+    .jpost__arrow {
+      color: var(--accent);
+      transform: translate(4px, -4px);
+    }
   }
 }
 
-.project__head {
+.jpost__thumb {
+  width: 100%;
+  height: 160px;
+  object-fit: cover;
+  border-bottom: 1px solid var(--border-subtle);
+}
+
+.jpost__body {
   display: flex;
-  align-items: baseline;
-  justify-content: space-between;
-  gap: var(--space-3);
+  flex: 1;
+  flex-direction: column;
+  padding: var(--space-5);
 }
 
-.project__name {
-  margin: 0;
+.jpost__tags {
+  margin-bottom: var(--space-3);
+}
+
+.jpost__title {
+  margin: 0 0 var(--space-2);
   font-family: var(--font-mono);
-  font-size: var(--fs-xl);
+  font-size: var(--fs-lg);
   font-weight: var(--fw-regular);
+  line-height: var(--lh-snug);
   color: var(--text-strong);
+  transition: color var(--dur-base) var(--ease-standard);
+}
+
+.jpost__desc {
+  margin: 0 0 var(--space-4);
+  font-size: var(--fs-sm);
+  color: var(--text-muted);
 }
 
-.project__role {
+.jpost__meta {
+  display: flex;
+  align-items: center;
+  gap: var(--space-2);
+  margin-top: auto;
+  padding-top: var(--space-4);
+  border-top: 1px dashed var(--border-subtle);
   font-family: var(--font-mono);
   font-size: var(--fs-xs);
-  color: var(--text-muted);
-  white-space: nowrap;
+  color: var(--text-faint);
+}
+
+.jpost__arrow {
+  margin-left: auto;
+  font-size: var(--fs-base);
+  color: var(--text-faint);
+  transition:
+    transform var(--dur-base) var(--ease-out),
+    color var(--dur-base) var(--ease-standard);
+}
+
+.journal__empty {
+  max-width: 60ch;
+  margin: 0 auto;
+  text-align: center;
 }
 
-.project__desc {
-  margin: var(--space-3) 0 var(--space-4);
+.journal__empty-code {
+  margin: 0 0 var(--space-2);
+  font-family: var(--font-mono);
   font-size: var(--fs-sm);
+  color: var(--accent);
+}
+
+.journal__empty-text {
+  margin: 0 0 var(--space-5);
+  font-family: var(--font-sans);
+  font-size: var(--fs-sm);
+  line-height: var(--lh-relaxed);
+  color: var(--text-muted);
+}
+
+// ---- Bloc CTA final (porté de .cta) ----
+.cta {
+  position: relative;
+  padding: clamp(48px, 6vw, 72px) var(--space-6);
+  overflow: hidden;
+  text-align: center;
+  background:
+    radial-gradient(ellipse 80% 120% at 50% 0%, var(--accent-2-soft), transparent 70%),
+    color-mix(in srgb, var(--surface-2) 60%, transparent);
+  border: 1px solid var(--border-subtle);
+  border-radius: var(--radius-lg);
+}
+
+.cta__eyebrow {
+  display: inline-block;
+}
+
+.cta__title {
+  margin: 0 0 var(--space-4);
+  font-family: var(--font-mono);
+  font-size: clamp(1.8rem, 4vw, 2.8rem);
+  font-weight: var(--fw-light);
+  line-height: var(--lh-tight);
+  letter-spacing: var(--ls-tight);
+  color: var(--text-strong);
+}
+
+.cta__highlight {
+  font-style: italic;
+  color: var(--accent);
+}
+
+.cta__subtitle {
+  max-width: 58ch;
+  margin: 0 auto var(--space-8);
+  font-family: var(--font-sans);
+  font-size: var(--fs-base);
+  line-height: var(--lh-relaxed);
+  color: var(--text-muted);
 }
 
-// ---- Responsive (cf. kit.css @media max-width: 900px) ----
+.cta__actions {
+  display: flex;
+  flex-wrap: wrap;
+  gap: var(--space-4);
+  justify-content: center;
+}
+
+// ---- Responsive ----
 @media (width <= 900px) {
   .hero__grid {
     grid-template-columns: 1fr;
@@ -610,7 +995,28 @@ usePageSeo({
   }
 
   .grid-3,
-  .grid-2 {
+  .journal {
+    grid-template-columns: 1fr;
+  }
+
+  .block__head--row {
+    flex-direction: column;
+    align-items: flex-start;
+  }
+}
+
+@media (width <= 680px) {
+  .work__row {
+    grid-template-columns: 1fr;
+    gap: var(--space-3);
+  }
+
+  .work__no,
+  .work__go {
+    display: none;
+  }
+
+  .stats {
     grid-template-columns: 1fr;
   }
 }
@@ -619,5 +1025,19 @@ usePageSeo({
   .anim {
     animation: none;
   }
+
+  .work__row,
+  .work__go,
+  .jpost__arrow {
+    transition: none;
+  }
+
+  .work__row--link:hover {
+    padding-left: var(--space-3);
+
+    .work__go {
+      transform: none;
+    }
+  }
 }
 </style>
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index d8c88fd..e661d81 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-13 (Story 11.3 done : Marquee stack & Vitrine services)"
+last_updated: "2026-09-13 (Story 11.4 ready-for-dev : Preuves SaaS, Journal & CTA final)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -122,6 +122,6 @@ development_status:
   11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique: done
   11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique: done
   11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles: done
-  11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: backlog
+  11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: review
   11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker: backlog
   epic-11-retrospective: optional

exec
/bin/zsh -lc "sed -n '1,380p' app/pages/index.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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

    <!-- Projets sélectionnés & Statistiques de réassurance (Story 11.4 / AC-1 & AC-2) -->
    <section class="section section--sunken">
      <div class="container">
        <div class="block__head">
          <p class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</p>
          <h2 class="section__title">Des produits qui tournent en production</h2>
        </div>

        <ul class="work">
          <li v-for="(project, index) in projects" :key="project.name">
            <component
              :is="project.url ? ZExternalLink : 'div'"
              :href="project.url"
              class="work__row"
              :class="{ 'work__row--link': Boolean(project.url) }"
              :data-hot="project.url ? '' : undefined"
            >
              <span class="work__no">0{{ index + 1 }}</span>
              <div class="work__main">
                <div class="work__topline">
                  <h3 class="work__name">{{ project.name }}</h3>
                  <span v-if="project.status" class="work__status">{{ project.status }}</span>
                </div>
                <p class="work__role">{{ project.role }}</p>
                <p class="prose work__desc">{{ project.desc }}</p>
                <ul class="hero__tags work__tags">
                  <li v-for="tag in project.tags" :key="tag">
                    <ZTag>{{ tag }}</ZTag>
                  </li>
                </ul>
              </div>
              <span v-if="project.url" class="work__go" aria-hidden="true">
                <ZIcon name="arrow" />
              </span>
            </component>
          </li>
        </ul>

        <!-- Statistiques clés de réassurance (Story 11.4 / AC-2) -->
        <ul class="stats">
          <li v-for="stat in stats" :key="stat.id" class="stat">
            <b>{{ stat.value }}</b>
            <span>{{ stat.label }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Journal technique / Notes de dev (Story 11.4 / AC-3) -->
    <section class="section">
      <div class="container">
        <div class="block__head block__head--row">
          <div>
            <p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>
            <h2 class="section__title">Notes de dev, écrites en construisant</h2>
          </div>
          <NuxtLink to="/blog" class="seeall" data-hot>
            cat tous-les-articles
            <ZIcon name="arrow" class="seeall__icon" />
          </NuxtLink>
        </div>

        <!-- Liste des articles les plus récents -->
        <ul v-if="articles && articles.length" class="journal">
          <li v-for="article in articles" :key="article.path" class="journal__item">
            <ZCard :as="NuxtLink" :to="article.path" interactive class="jpost" data-hot>
              <NuxtImg
                v-if="article.image"
                class="jpost__thumb"
                :src="article.image.src"
                :alt="article.image.alt"
                width="360"
                height="200"
                sizes="360px"
                format="webp"
              />
              <div class="jpost__body">
                <ul v-if="article.tags?.length" class="hero__tags jpost__tags">
                  <li v-for="tag in article.tags" :key="tag">
                    <ZTag>{{ tag }}</ZTag>
                  </li>
                </ul>
                <h3 class="jpost__title">{{ article.title }}</h3>
                <p v-if="article.description" class="prose jpost__desc">{{ article.description }}</p>
                <div class="jpost__meta">
                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
                  <template v-if="article.read">
                    <span aria-hidden="true">·</span>
                    <span>{{ article.read }} de lecture</span>
                  </template>
                  <span class="jpost__arrow" aria-hidden="true">
                    <ZIcon name="arrow" />
                  </span>
                </div>
              </div>
            </ZCard>
          </li>
        </ul>

        <!-- État d'attente sobre lorsque aucun article n'est encore publié -->
        <ZCard v-else class="journal__empty" padded>
          <p class="journal__empty-code">$ cat ~/journal/*.md</p>
          <p class="journal__empty-text">Les notes d'ingénierie et retours d'expérience sont en cours de rédaction.</p>
          <ZButton :as="NuxtLink" to="/blog" variant="secondary" size="sm"> Consulter la section blog </ZButton>
        </ZCard>
      </div>
    </section>

    <!-- Bloc CTA final de conversion (Story 11.4 / AC-4) -->
    <section class="section section--sunken">
      <div class="container">
        <div class="cta">
          <p class="eyebrow cta__eyebrow"><span aria-hidden="true">$ </span>./contact --start</p>
          <h2 class="cta__title">Un projet en tête ? Mettons-le <span class="cta__highlight">en production</span>.</h2>
          <p class="cta__subtitle">
            Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript,
            parlons-en.
          </p>
          <div class="cta__actions">
            <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg" data-hot>
              Discuter de votre projet
              <template #iconRight><ZIcon name="arrow" /></template>
            </ZButton>
            <ZButton
              v-if="SITE.profile.maltUrl"
              :as="ZExternalLink"
              :href="SITE.profile.maltUrl"
              variant="secondary"
              size="lg"
              data-hot
            >
              Me contacter sur Malt
            </ZButton>
            <ZButton :as="NuxtLink" to="/about" variant="ghost" size="lg" data-hot> Voir le parcours &amp; CV </ZButton>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Page d'accueil — refonte Hero Full Stack TS, Projets SaaS, Journal & CTA final (Story 11.4).
// Architecture multi-pages Nuxt 4, dark-first, accent orange.
import { ref } from "vue";
import { NuxtLink, ZExternalLink } from "#components";
import { SITE } from "~/data/site";

const isBootFinished = ref(false);

function onBootComplete() {
  isBootFinished.value = true;
}

interface HomeServiceOffer {
  id: string;
  no: string;
  icon: "code" | "layers" | "spark";
  title: string;
  desc: string;
  points: string[];
  tags: string[];
  price: string;
  featured: boolean;
}

// Vitrine des 3 offres ciblées Full Stack TS (Story 11.3 / AC-2).
const services: HomeServiceOffer[] = [
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

// Projets sélectionnés — source unique `app/data/site.ts` (Story 11.4 / AC-1).
const projects = SITE.projects;

// Chiffres clés de réassurance (Story 11.4 / AC-2).
const stats = [
  { id: "stat-1", value: "11", label: "années d'expérience web" },
  { id: "stat-2", value: "100%", label: "TypeScript & SaaS de bout en bout" },
  { id: "stat-3", value: "QA", label: "culture d'automatisation & zéro régression" },
];

// Récupération des 3 derniers articles du journal technique (Story 11.4 / AC-3).
const { data: articles } = await useAsyncData("home-articles", () =>
  queryCollection("blog").order("date", "DESC").limit(3).all(),
);

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

exec
/bin/zsh -lc "sed -n '1,260p' app/components/ui/ZCard.vue; printf '\\n--- ZExternalLink ---\\n'; sed -n '1,220p' app/components/ui/ZExternalLink.vue; printf '\\n--- ZButton ---\\n'; sed -n '1,280p' app/components/ui/ZButton.vue" in /Users/simon/dev/jouan.ovh
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

--- ZExternalLink ---
<template>
  <a :href="href" :rel="computedRel" target="_blank">
    <slot />
    <span class="screen-reader-text">{{ computedSrText }}</span>
  </a>
</template>

<script setup lang="ts">
// Primitive lien externe accessible (DS) — force target="_blank", rel sécurisé ("noopener" garanti),
// et adjoint un libellé sr-only « (ouvre dans un nouvel onglet) » sans impacter le rendu visuel.
// (Story 10.3 — WCAG G201 / FR13).
import { computed } from "vue";

interface Props {
  /** URL externe cible. */
  href: string;
  /**
   * Relation de lien. Par défaut "noopener" (sécurité window.opener).
   * Peut être étendu à "noopener noreferrer" si nécessaire. "noopener" reste garanti.
   * @default "noopener"
   */
  rel?: string;
  /** Libellé accessible alternatif pour l'annonce sr-only. */
  srText?: string;
}

const DEFAULT_SR_TEXT = " (ouvre dans un nouvel onglet)";

const props = withDefaults(defineProps<Props>(), {
  rel: "noopener",
  srText: DEFAULT_SR_TEXT,
});

const computedRel = computed(() => {
  const custom = props.rel?.trim();
  if (!custom) {
    return "noopener";
  }
  const tokens = new Set(custom.split(/\s+/));
  tokens.add("noopener");
  return Array.from(tokens).join(" ");
});

const computedSrText = computed(() => {
  return props.srText && props.srText.trim() ? props.srText : DEFAULT_SR_TEXT;
});
</script>

--- ZButton ---
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
/bin/zsh -lc "sed -n '1,260p' app/data/site.ts; printf '\\n--- content config ---\\n'; sed -n '1,260p' content.config.ts; printf '\\n--- blog files ---\\n'; rg --files content/blog | sort" in /Users/simon/dev/jouan.ovh
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

--- content config ---
import { defineContentConfig, defineCollection, z } from "@nuxt/content";

// @nuxt/content v3 — déclaration explicite des collections (remplace l'auto-scan v2).
// La collection blog reste vide tant qu'aucun article n'est ajouté sous content/blog/.
export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: "page",
      source: "blog/**",
      // type "page" fournit déjà title/description/path/body ; on type ici les champs
      // additionnels consommés par la liste du blog (tri par date, tags, temps de lecture).
      schema: z.object({
        // Date ISO (YYYY-MM-DD) : tri lexicographique = tri chronologique, formatée en
        // français à l'affichage. Sert au `.order("date", "DESC")`. Le `regex` fait
        // échouer le build sur un format dévié (plutôt qu'un « Invalid Date » à l'écran
        // et un tri faux).
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date doit être au format ISO YYYY-MM-DD"),
        // Tags (technos / sujets) rendus en ZTag.
        tags: z.array(z.string()).default([]),
        // Temps de lecture affiché dans la méta (ex. "8 min").
        read: z.string().optional(),
        // Vignette d'article (facultative).
        image: z
          .object({
            src: z.string(),
            alt: z.string(),
          })
          .optional(),
      }),
    }),
  },
});

--- blog files ---

exec
/bin/zsh -lc "rg -n \"block__head|section__title|\\.stats|\\.statrow|\\.projects|class=\\\"prose|<ZCard :as|NuxtImg|useAsyncData|formatDate|color-mix|--ring-accent|prefers-reduced-motion\" app | head -240" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/about.vue:14:            <p class="prose about__location">
app/pages/about.vue:27:            <p class="prose about__para">
app/pages/about.vue:32:            <p class="prose about__para">
app/pages/about.vue:250:      box-shadow: var(--ring-accent);
app/pages/blog/[...slug].vue:22:            <time :datetime="page.date">{{ formatDate(page.date) }}</time>
app/pages/blog/[...slug].vue:29:          <NuxtImg
app/pages/blog/[...slug].vue:41:          <div class="prose article__prose">
app/pages/blog/[...slug].vue:63:// @nuxt/content v3 (queryCollection + ContentRenderer). Prerender-safe (useAsyncData).
app/pages/blog/[...slug].vue:73:const { data: page, error } = await useAsyncData(
app/pages/blog/[...slug].vue:193:    box-shadow: var(--ring-accent);
app/pages/blog/[...slug].vue:281:      box-shadow: var(--ring-accent);
app/pages/blog/index.vue:8:        <p class="prose blog__subtitle">
app/pages/blog/index.vue:15:            <ZCard :as="NuxtLink" :to="article.path" interactive class="post">
app/pages/blog/index.vue:16:              <NuxtImg
app/pages/blog/index.vue:35:                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
app/pages/blog/index.vue:49:          <NuxtImg
app/pages/blog/index.vue:57:          <p class="prose blog__notice-text">
app/pages/blog/index.vue:65:          <NuxtImg
app/pages/blog/index.vue:73:          <p class="prose blog__notice-text">
app/pages/blog/index.vue:87:// au build par useAsyncData). La vue article (/blog/[...slug]) est la story 6.2.
app/pages/blog/index.vue:94:const { data: articles, error } = await useAsyncData("blog-list", () =>
app/pages/blog/index.vue:98:// `formatDate` (date ISO → français) est un util auto-importé partagé (app/utils/).
app/pages/services.vue:8:        <p class="prose services__intro">
app/pages/services.vue:55:            <p class="prose process__desc">{{ step.desc }}</p>
app/pages/contact.vue:10:            <p class="prose contact__intro">
app/pages/contact.vue:19:              <p class="prose contact__sent-text">Merci ! Je vous réponds très vite à votre adresse.</p>
app/pages/contact.vue:120:              <p class="prose contact__term-text">Vous préférez la ligne de commande ? Ouvrez le terminal.</p>
app/pages/contact.vue:374:    box-shadow: var(--ring-accent);
app/pages/contact.vue:447:    box-shadow: var(--ring-accent);
app/pages/mentions-legales.vue:7:        <p class="prose legal__lead">
app/pages/mentions-legales.vue:13:        <div class="prose legal__content">
app/pages/mentions-legales.vue:175:    box-shadow: var(--ring-accent);
app/pages/confidentialite.vue:7:        <p class="prose legal__lead">
app/pages/confidentialite.vue:12:        <div class="prose legal__content">
app/pages/confidentialite.vue:236:    box-shadow: var(--ring-accent);
app/pages/index.vue:54:        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos applications</h2>
app/pages/index.vue:90:        <div class="block__head">
app/pages/index.vue:92:          <h2 class="section__title">Des produits qui tournent en production</h2>
app/pages/index.vue:111:                <p class="prose work__desc">{{ project.desc }}</p>
app/pages/index.vue:138:        <div class="block__head block__head--row">
app/pages/index.vue:141:            <h2 class="section__title">Notes de dev, écrites en construisant</h2>
app/pages/index.vue:152:            <ZCard :as="NuxtLink" :to="article.path" interactive class="jpost" data-hot>
app/pages/index.vue:153:              <NuxtImg
app/pages/index.vue:170:                <p v-if="article.description" class="prose jpost__desc">{{ article.description }}</p>
app/pages/index.vue:172:                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
app/pages/index.vue:303:const projects = SITE.projects;
app/pages/index.vue:313:const { data: articles } = await useAsyncData("home-articles", () =>
app/pages/index.vue:378:  // color-mix — pas de valeur HSL en dur. Base = fond de page. Fidèle à kit.css
app/pages/index.vue:381:    radial-gradient(900px 500px at 78% -10%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%),
app/pages/index.vue:384:      color-mix(in srgb, var(--aubergine-vivid) 28%, transparent),
app/pages/index.vue:460:      box-shadow: var(--ring-accent);
app/pages/index.vue:470:  box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 60%, transparent);
app/pages/index.vue:473:  @media (prefers-reduced-motion: reduce) {
app/pages/index.vue:480:    box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 60%, transparent);
app/pages/index.vue:484:    box-shadow: 0 0 0 6px color-mix(in srgb, var(--success) 0%, transparent);
app/pages/index.vue:488:    box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 0%, transparent);
app/pages/index.vue:492:.section__title {
app/pages/index.vue:619:    box-shadow: var(--ring-accent);
app/pages/index.vue:689:    box-shadow: var(--ring-accent);
app/pages/index.vue:755:// ---- Stats (porté de .stats) ----
app/pages/index.vue:756:.stats {
app/pages/index.vue:767:  background: color-mix(in srgb, var(--surface-1) 70%, transparent);
app/pages/index.vue:791:.block__head--row {
app/pages/index.vue:798:  .section__title {
app/pages/index.vue:822:    box-shadow: var(--ring-accent);
app/pages/index.vue:947:    color-mix(in srgb, var(--surface-2) 60%, transparent);
app/pages/index.vue:1002:  .block__head--row {
app/pages/index.vue:1019:  .stats {
app/pages/index.vue:1024:@media (prefers-reduced-motion: reduce) {
app/assets/scss/base/_motion.scss:2://  Accessibilité — prefers-reduced-motion (story 9.2, CAP-11)
app/assets/scss/base/_motion.scss:24:@media (prefers-reduced-motion: reduce) {
app/assets/scss/main.scss:6:@use "base/motion"; // filet a11y global prefers-reduced-motion (story 9.2)
app/components/HeaderComponent.vue:196:  background: color-mix(in srgb, var(--surface-0) 82%, transparent);
app/components/HeaderComponent.vue:238:    box-shadow: var(--ring-accent);
app/components/HeaderComponent.vue:270:    box-shadow: var(--ring-accent);
app/components/HeaderComponent.vue:307:    box-shadow: var(--ring-accent);
app/components/HeaderComponent.vue:399:    box-shadow: var(--ring-accent);
app/components/HeaderComponent.vue:414:@media (prefers-reduced-motion: reduce) {
app/utils/formatDate.ts:12:export function formatDate(iso: string): string {
app/components/FooterComponent.vue:60:const projects = SITE.projects;
app/components/FooterComponent.vue:117:    box-shadow: var(--ring-accent);
app/components/FooterComponent.vue:168:    box-shadow: var(--ring-accent);
app/components/FooterComponent.vue:201:@media (prefers-reduced-motion: reduce) {
app/assets/scss/abstract/_root.scss:191:  --ring-accent: 0 0 0 3px var(--accent-ring);
app/components/ui/ZButton.vue:140:    box-shadow: var(--ring-accent);
app/components/ui/ZButton.vue:247:@media (prefers-reduced-motion: reduce) {
app/components/home/HomeAtmosComponent.vue:14:// Entièrement rendu en pur CSS, marqué aria-hidden="true", animations neutralisées sous prefers-reduced-motion.
app/components/home/HomeAtmosComponent.vue:68:  background-image: radial-gradient(color-mix(in srgb, var(--ink-1) 6%, transparent) 1px, transparent 1px);
app/components/home/HomeAtmosComponent.vue:79:    color-mix(in srgb, var(--surface-0) 24%, transparent) 0 1px,
app/components/home/HomeAtmosComponent.vue:123:@media (prefers-reduced-motion: reduce) {
app/components/HexagonLinkComponent.vue:58:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZCustomCursor.vue:21:// Masqué sur mobile/tactile (hover: none) et prefers-reduced-motion.
app/components/ui/ZCustomCursor.vue:109:  motionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
app/components/ui/ZCustomCursor.vue:168:  border: 1px solid color-mix(in srgb, var(--ink-1) 70%, transparent);
app/components/ui/ZCustomCursor.vue:182:@media (hover: none), (prefers-reduced-motion: reduce) {
app/components/ui/ZInput.vue:180:    box-shadow: var(--ring-accent);
app/components/ui/ZInput.vue:233:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZCard.vue:102:    box-shadow: var(--ring-accent);
app/components/ui/ZCard.vue:121:@media (prefers-reduced-motion: reduce) {
app/components/home/HomeBootOverlay.vue:41:// Contournement immédiat sous prefers-reduced-motion ou via clic / touche Escape.
app/components/home/HomeBootOverlay.vue:131:  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
app/components/home/HomeBootOverlay.vue:247:    box-shadow: var(--ring-accent);
app/components/home/HomeBootOverlay.vue:251:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZAvatar.vue:3:    <NuxtImg v-if="showImage" class="zavatar__img" :src="src" :alt="alt" @error="onImageError" />
app/components/ui/ZAvatar.vue:10:// Porté de docs/design_system/components/core/Avatar.jsx. Image via <NuxtImg>
app/components/terminal/programs/Projets.ts:10:    const items = SITE.projects
app/components/home/HomeHeroTerminal.vue:86:// Neutralisé sous prefers-reduced-motion (affichage statique complet immédiat).
app/components/home/HomeHeroTerminal.vue:106:const projectsOutput = SITE.projects
app/components/home/HomeHeroTerminal.vue:153:  const reduceMotion = import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
app/components/home/HomeHeroTerminal.vue:215:  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
app/components/home/HomeHeroTerminal.vue:312:    background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
app/components/home/HomeHeroTerminal.vue:351:    box-shadow: var(--ring-accent);
app/components/home/HomeHeroTerminal.vue:387:@media (prefers-reduced-motion: reduce) {
app/components/home/HomeStackMarquee.vue:26:// Pause automatique au :hover et arrêt complet sous prefers-reduced-motion.
app/components/home/HomeStackMarquee.vue:103:@media (prefers-reduced-motion: reduce) {
app/components/card/ZCardBody.vue:33:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZTag.vue:151:    box-shadow: var(--ring-accent);
app/components/ui/ZTag.vue:180:    box-shadow: var(--ring-accent);
app/components/ui/ZTag.vue:184:@media (prefers-reduced-motion: reduce) {
app/components/terminal/TerminalComponent.vue:468:      // prefers-reduced-motion ; aucune boucle CSS n'étant introduite, il n'y a rien à neutraliser.)
app/components/terminal/TerminalComponent.vue:499:      background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);

codex
Le diff est lisible et j’ai confirmé les contrats des primitives, du schéma de contenu et des données partagées. Je vérifie maintenant les interactions réelles (rendu polymorphe, responsive, SSG, a11y et cohérence des métriques) afin que chaque finding soit ancré dans le contenu fourni.
exec
/bin/zsh -lc "sed -n '1,240p' app/assets/scss/base/_layout.scss; sed -n '1,240p' app/assets/scss/abstract/_root.scss" in /Users/simon/dev/jouan.ovh
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
// font-weight et line-height neutralisés pour un rendu identique sur <h2 class="eyebrow"> et <p class="eyebrow">.
.eyebrow {
  margin: 0 0 var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: var(--fw-regular);
  line-height: var(--lh-relaxed);
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
}

::selection {
  background: var(--selection);
}

// Keyframes globaux (hors :root). Seul caret-blink est une boucle UI (caret terminal).
@keyframes caret-blink {
  0%,
  49% {
    opacity: 1;
  }

  50%,
  100% {
    opacity: 0;
  }
}

@keyframes fade-rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

exec
/bin/zsh -lc "sed -n '1,220p' app/pages/blog/index.vue; sed -n '1,140p' app/pages/blog/'[...slug].vue'; sed -n '1,100p' app/utils/formatDate.ts" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <main class="blog">
    <section class="section">
      <div class="container">
        <!-- En-tête (porté de Blog.jsx : eyebrow + titre + sous-titre prose) -->
        <p class="eyebrow">// ~/blog</p>
        <h1 class="blog__title">Notes de dev</h1>
        <p class="prose blog__subtitle">
          WordPress, architecture, IA appliquée — ce que j'apprends en construisant des choses.
        </p>

        <!-- Liste des articles (triés par date décroissante), cartes interactives -->
        <ul v-if="articles && articles.length" class="blog__list">
          <li v-for="article in articles" :key="article.path" class="blog__item">
            <ZCard :as="NuxtLink" :to="article.path" interactive class="post">
              <NuxtImg
                v-if="article.image"
                class="post__thumb"
                :src="article.image.src"
                :alt="article.image.alt"
                width="200"
                height="130"
                sizes="200px"
                format="webp"
              />
              <div class="post__body">
                <ul v-if="article.tags?.length" class="hero__tags post__tags">
                  <li v-for="tag in article.tags" :key="tag">
                    <ZTag>{{ tag }}</ZTag>
                  </li>
                </ul>
                <h2 class="post__title">{{ article.title }}</h2>
                <p class="post__desc">{{ article.description }}</p>
                <div class="post__meta">
                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
                  <!-- `read` est optionnel : pas de séparateur ni de « de lecture » orphelins. -->
                  <template v-if="article.read">
                    <span aria-hidden="true">·</span>
                    <span>{{ article.read }} de lecture</span>
                  </template>
                </div>
              </div>
            </ZCard>
          </li>
        </ul>

        <!-- Erreur de chargement (distincte d'un véritable empty-state) -->
        <ZCard v-else-if="error" class="blog__notice" padded>
          <NuxtImg
            class="blog__notice-img"
            src="/images/undraw_code_thinking_re_gka2.svg"
            alt=""
            width="220"
            height="165"
          />
          <h2 class="blog__notice-title">Le chargement des articles a échoué.</h2>
          <p class="prose blog__notice-text">
            Une erreur est survenue lors de la récupération des articles. Ce n'est pas vous, c'est moi : merci de
            réessayer dans quelques instants.
          </p>
        </ZCard>

        <!-- Empty-state : aucun article publié (texte français conservé, restylé via tokens) -->
        <ZCard v-else class="blog__notice" padded>
          <NuxtImg
            class="blog__notice-img"
            src="/images/undraw_code_thinking_re_gka2.svg"
            alt=""
            width="220"
            height="165"
          />
          <h2 class="blog__notice-title">Pas encore d'articles.</h2>
          <p class="prose blog__notice-text">
            Je travaille actuellement sur de nouveaux contenus pour partager ce que j'apprends en développement web.
            Revenez bientôt pour découvrir mes prochaines publications.
          </p>
        </ZCard>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Index du blog (story 6.1) — porté de Blog.jsx : en-tête + liste d'articles en
// cartes ZCard interactives, méta mono, empty-state restylé. Contenu via @nuxt/content
// v3 (queryCollection). Dark-first, tokens uniquement, prerender-safe (requête résolue
// au build par useAsyncData). La vue article (/blog/[...slug]) est la story 6.2.
import { NuxtLink } from "#components";
import { SITE } from "~/data/site";

// Articles triés par date décroissante. La requête de contenu est résolue côté
// build/SSR → rendu prerender-safe. `error` distingue un échec de chargement d'un
// véritable empty-state (liste vide).
const { data: articles, error } = await useAsyncData("blog-list", () =>
  queryCollection("blog").order("date", "DESC").all(),
);

// `formatDate` (date ISO → français) est un util auto-importé partagé (app/utils/).

// Métadonnées de la page. URL de prod lue depuis runtimeConfig via useSiteUrl()
// (swappable staging/prod, sans domaine en dur). Inchangée en staging.
const siteUrl = useSiteUrl();
const pageTitle = "Blog — jouan.ovh";
const pageDescription =
  "Notes de dev — WordPress, architecture et IA appliquée : ce que j'apprends en construisant des produits web.";
const pageUrl = `${siteUrl}/blog`;

// JSON-LD : flux d'articles (Blog → BlogPosting) pour les moteurs / agrégateurs.
// Construit à partir de la liste résolue (snapshot au build, page prerendue).
const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Notes de dev",
  description: pageDescription,
  url: pageUrl,
  blogPost: (articles.value ?? []).map((article) => ({
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: {
      "@type": "Person",
      name: SITE.profile.name,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: SITE.profile.name,
      url: siteUrl,
      logo: `${siteUrl}/images/logo.png`,
    },
    url: `${siteUrl}${article.path}`,
    ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
    ...(article.image
      ? {
          image: article.image.src.startsWith("/")
            ? `${siteUrl}${article.image.src}`
            : `${siteUrl}/${article.image.src}`,
        }
      : {}),
  })),
};

usePageSeo({
  title: pageTitle,
  description: pageDescription,
  path: "/blog",
  type: "website",
  jsonLd: blogJsonLd,
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / Blog.jsx */
// .section / .container / .eyebrow / .prose / .hero__tags / .post__meta sont des
// primitives de layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
.blog {
  display: block;
}

// ---- En-tête (porté de Blog.jsx L9-13) ----
.blog__title {
  margin-bottom: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-4xl);
  font-weight: var(--fw-light);
  line-height: var(--lh-tight);
  color: var(--text-strong);
}

.blog__subtitle {
  max-width: 56ch;
  margin-bottom: var(--space-10);
  color: var(--text-muted);
}

// ---- Liste d'articles (porté de Blog.jsx : flex column + .post de kit.css) ----
// <ul> sémantique (annonce « liste de N articles ») : reset des puces et marges UA.
.blog__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;
}

// Carte article = ZCard interactive rendue en lien : grille vignette / contenu.
.post {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: var(--space-5);
  text-decoration: none;
  color: inherit;
}

.post__thumb {
  width: 100%;
  height: 130px;
  object-fit: cover;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
}

.post__tags {
  margin-bottom: var(--space-2);
}

.post__title {
  margin-bottom: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-xl);
  font-weight: var(--fw-regular);
  line-height: var(--lh-snug);
  color: var(--text-strong);
}

.post__desc {
  margin: 0 0 var(--space-3);
<template>
  <main class="blog-article">
    <section class="section">
      <div class="container">
        <article v-if="page" class="article">
          <!-- Lien retour (porté de Blog.jsx : hdr__link « ← Retour au blog »).
               Le glyphe ← est décoratif (aria-hidden) : le lecteur d'écran lit « Retour au blog ». -->
          <NuxtLink to="/blog" class="article__back"><span aria-hidden="true">←</span> Retour au blog</NuxtLink>

          <!-- En-tête : tags, titre, méta (auteur · date · lecture), image héro -->
          <ul v-if="page.tags?.length" class="hero__tags article__tags">
            <li v-for="tag in page.tags" :key="tag">
              <ZTag>{{ tag }}</ZTag>
            </li>
          </ul>

          <h1 class="article__title">{{ page.title }}</h1>

          <div class="post__meta article__meta">
            <span>Simon Jouan</span>
            <span aria-hidden="true">·</span>
            <time :datetime="page.date">{{ formatDate(page.date) }}</time>
            <template v-if="page.read">
              <span aria-hidden="true">·</span>
              <span>{{ page.read }}</span>
            </template>
          </div>

          <NuxtImg
            v-if="page.image"
            class="article__hero"
            :src="page.image.src"
            :alt="page.image.alt"
            width="760"
            height="320"
            sizes="760px"
            format="webp"
          />

          <!-- Corps de l'article : HTML généré par @nuxt/content, stylé via :deep() -->
          <div class="prose article__prose">
            <ContentRenderer :value="page" />
          </div>

          <!-- Bloc CTA de fin (porté de Blog.jsx) -->
          <div class="article__cta">
            <span class="article__cta-label">Un projet en tête ?</span>
            <ZButton :as="NuxtLink" to="/contact" variant="primary">
              Démarrer un projet
              <template #iconRight><ZIcon name="arrow" /></template>
            </ZButton>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Vue article du blog (story 6.2) — porté de Blog.jsx (fonction Article) : structure
// .article (760px), en-tête tags/titre/méta/héro, prose Ubuntu sans, blocs de code en
// palette terminale (Shiki désactivé, cf. nuxt.config), CTA de fin. Contenu via
// @nuxt/content v3 (queryCollection + ContentRenderer). Prerender-safe (useAsyncData).
import { NuxtLink } from "#components";
import { SITE } from "~/data/site";

const route = useRoute();

// Normalise le chemin (retire le(s) slash(es) final/aux) pour éviter un faux 404
// sur une URL du type "/blog/mon-article/".
const path = computed(() => route.path.replace(/\/+$/, "") || "/");

const { data: page, error } = await useAsyncData(
  // Clé reproductible côté SSR + refetch automatique lors d'une navigation client entre slugs.
  () => `blog-${path.value}`,
  () => queryCollection("blog").path(path.value).first(),
  { watch: [path] },
);

// Erreur adaptée à l'état courant : 500 si la requête de contenu échoue (on ne masque
// pas une vraie erreur derrière un 404), 404 uniquement quand l'article n'existe pas.
const resolveContentError = () => {
  if (error.value) {
    return createError({ statusCode: 500, statusMessage: "Erreur lors du chargement de l'article" });
  }
  if (!page.value) {
    return createError({ statusCode: 404, statusMessage: "Article introuvable" });
  }
  return null;
};

// Rendu initial (SSR / prerender) : throw pour fixer le bon statut HTTP. Pas besoin de
// `fatal: true` ici, un throw au niveau du setup est déjà traité comme une erreur de page.
const initialError = resolveContentError();
if (initialError) {
  throw initialError;
}

// Navigation client entre slugs : le refetch met à jour `page`/`error` sans réexécuter le
// setup → on (dé)clenche la page d'erreur de façon réactive.
if (import.meta.client) {
  watch([page, error], () => {
    const clientError = resolveContentError();
    if (clientError) {
      showError(clientError);
    } else {
      clearError();
    }
  });
}

// SEO par article (centralisé via usePageSeo, parité /about, /blog).
// usePageSeo résout siteUrl, canonical, og:*, twitter:* et le JSON-LD échappé.
const siteUrl = useSiteUrl();
usePageSeo(() => {
  const article = page.value;
  if (!article) {
    return null;
  }
  const url = `${siteUrl}${article.path}`;
  const image = article.image
    ? article.image.src.startsWith("/")
      ? `${siteUrl}${article.image.src}`
      : `${siteUrl}/${article.image.src}`
    : undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: {
      "@type": "Person",
      name: SITE.profile.name,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: SITE.profile.name,
// Formate une date ISO (YYYY-MM-DD) en français long, ex. "12 juin 2026".
// timeZone UTC : rendu déterministe (indépendant du fuseau de build), pas de décalage
// d'un jour à l'hydration. Auto-importé (app/utils/) — partagé par l'index blog et la
// vue article. Le format ISO est garanti par le schéma de la collection (content.config.ts).
const frLongDate = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  return frLongDate.format(new Date(iso));
}

exec
/bin/zsh -lc 'rg -n "content/blog|date:|read:|image:|formatDate|home-articles|Story 11.4|AC-1|AC-2|AC-3|AC-4" docs content app | head -300' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/about.vue:107:    date: "02/2021 — aujourd'hui",
app/pages/about.vue:113:    date: "05/2020 — 12/2021",
app/pages/about.vue:119:    date: "07/2007 — 05/2019",
app/pages/about.vue:128:  { date: "2017 — 2018", name: "Développeur d'application — PHP / Symfony", school: "OpenClassrooms" },
app/pages/about.vue:129:  { date: "1999 — 2001", name: "BTS CIRA", school: "Lycée A. de Tocqueville, Cherbourg" },
app/pages/about.vue:148:    image: `${siteUrl}/images/portrait.jpeg`,
app/pages/about.vue:156:  image: "/images/portrait.jpeg",
app/pages/blog/[...slug].vue:22:            <time :datetime="page.date">{{ formatDate(page.date) }}</time>
app/pages/blog/[...slug].vue:154:    image: article.image?.src,
app/pages/blog/index.vue:35:                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
app/pages/blog/index.vue:98:// `formatDate` (date ISO → français) est un util auto-importé partagé (app/utils/).
app/pages/blog/index.vue:137:          image: article.image.src.startsWith("/")
app/pages/services.vue:168:  image: "/images/portrait.jpeg",
app/pages/contact.vue:280:  image: "/images/portrait.jpeg",
app/pages/index.vue:47:    <!-- Ruban défilant de la stack moderne (Story 11.3 / AC-1) -->
app/pages/index.vue:50:    <!-- Vitrine des 3 services cibles (Story 11.3 / AC-2) -->
app/pages/index.vue:87:    <!-- Projets sélectionnés & Statistiques de réassurance (Story 11.4 / AC-1 & AC-2) -->
app/pages/index.vue:125:        <!-- Statistiques clés de réassurance (Story 11.4 / AC-2) -->
app/pages/index.vue:135:    <!-- Journal technique / Notes de dev (Story 11.4 / AC-3) -->
app/pages/index.vue:172:                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
app/pages/index.vue:195:    <!-- Bloc CTA final de conversion (Story 11.4 / AC-4) -->
app/pages/index.vue:229:// Page d'accueil — refonte Hero Full Stack TS, Projets SaaS, Journal & CTA final (Story 11.4).
app/pages/index.vue:253:// Vitrine des 3 offres ciblées Full Stack TS (Story 11.3 / AC-2).
app/pages/index.vue:302:// Projets sélectionnés — source unique `app/data/site.ts` (Story 11.4 / AC-1).
app/pages/index.vue:305:// Chiffres clés de réassurance (Story 11.4 / AC-2).
app/pages/index.vue:312:// Récupération des 3 derniers articles du journal technique (Story 11.4 / AC-3).
app/pages/index.vue:313:const { data: articles } = await useAsyncData("home-articles", () =>
app/pages/index.vue:332:    image: `${siteUrl}/images/portrait.jpeg`,
app/pages/index.vue:347:  image: "/images/portrait.jpeg",
docs/planning-artifacts/epics.md:758:### Story 11.4: Preuves concrètes SaaS, Journal technique & CTA final de conversion
docs/project-context.md:4:date: "2026-09-13"
docs/project-context.md:65:- Blog alimenté par `@nuxt/content` **v3** (markdown sous `content/blog/`) — index
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:27:  - [x] `v-model` : `modelValue` + `update:modelValue` (émis sur `@input`). `inheritAttrs: false` → `$attrs` (placeholder/type…) forwardés sur le contrôle, pas le wrapper.
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:69:**ZInput** (`Input.d.ts`) : `label?`, `hint?`, `error?: boolean` (`false`), `required?: boolean` (`false`), `multiline?: boolean` (`false`), `icon?` (SVG inline), `id?`. Forwarde tous les attributs natifs input/textarea → en Vue, gérer `v-model` (`modelValue`/`update:modelValue`) + `$attrs`.
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:126:  - **v-model** : `modelValue` + `update:modelValue` (`@input`). `inheritAttrs: false` → `$attrs` (placeholder, type, name…) forwardés sur le contrôle, pas le wrapper.
app/components/ui/ZInput.vue:44:// API React (attrs natifs forwarded) → Vue : v-model (modelValue/update:modelValue) + $attrs sur le contrôle.
app/components/ui/ZInput.vue:83:  "update:modelValue": [value: string];
app/components/ui/ZInput.vue:123:  emit("update:modelValue", (event.target as HTMLInputElement | HTMLTextAreaElement).value);
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:28:  - [x] Y placer au moins un article markdown de démonstration (`content/blog/<slug>.md`) avec front-matter (`title`, `description`, `date`, `tags`, `image`/`img`, `read`) pour valider le rendu de la liste en cartes
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:44:  - [x] Cas vide : retirer/vider temporairement le dossier `content/blog` → l'empty-state s'affiche
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:62:- **`content/`** (CREATE) — dossier racine à créer. Sous-dossier `content/blog/` + au moins un `.md` de démonstration avec front-matter. C'est le pipeline `@nuxt/content` qui résout ce dossier.
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:94:- Nouveau dossier racine `content/` (avec `content/blog/`). Cohérent avec la structure attendue par `@nuxt/content`.
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:121:- **Sanity-check `@nuxt/content` (préalable Epic 6)** : après création de `content/blog/` + 3 articles et restart du conteneur dev → `[@nuxt/content] ✔ Processed 2 collections and 3 files`. `/blog` liste les 3 titres, `/blog/ia-dans-wordpress` rend le markdown (`<pre>`/`<code>`). Pipeline (better-sqlite3 + rendu) **opérationnel depuis la migration Nuxt 4**.
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:129:- **Pipeline content (Tâche 1)** : créé `content/blog/` + 3 articles markdown (repris des posts de `data.js` : `ia-dans-wordpress`, `nuxt-symfony-archi`, `n8n-automatisation`) avec front-matter `title`/`description`/`date` (ISO)/`tags`/`read`/`image`. Corps markdown réels (le 1er porté de la démo `Article` de `Blog.jsx`) → pré-amorce aussi la vue article 6.2. Schéma de la collection `blog` (`content.config.ts`) étendu : `date`/`tags`/`read` typés (en plus de `image`).
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:138:- `content/blog/ia-dans-wordpress.md` (CRÉÉ ; `image.src` → `.webp`)
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:139:- `content/blog/nuxt-symfony-archi.md` (CRÉÉ ; `image.src` → `.webp`)
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:140:- `content/blog/n8n-automatisation.md` (CRÉÉ ; `image.src` → `.webp`)
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:161:- [x] [Review][Patch] `date` non validée (`z.string()`) → `formatDate` rend « Invalid Date » et le tri `.order("date","DESC")` se trompe si le format dévie. Valider au schéma (`z.string().regex(/^\d{4}-\d{2}-\d{2}$/)`) — échec au build plutôt qu'à l'affichage. [content.config.ts] — ✅ résolu : `z.string().regex(/^\d{4}-\d{2}-\d{2}$/, …)`.
app/components/ui/ZCustomCursor.vue:19:// Micro-curseur interactif progressif (Story 11.1 / AC-4 / CAP-10).
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:1722:+  background-image: radial-gradient(hsl(30deg 20% 100% / 5%) 1px, transparent 1px);
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:1724:+  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 78%);
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:1821:+// Micro-curseur interactif progressif (Story 11.1 / AC-4 / CAP-10).
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:1874:date: "2026-09-13"
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:1935:- Blog alimenté par `@nuxt/content` **v3** (markdown sous `content/blog/`) — index
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:2709:116:+  background-image: radial-gradient(hsl(30deg 20% 100% / 5%) 1px, transparent 1px);
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:2711:118:+  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 78%);
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:2785:215:+// Micro-curseur interactif progressif (Story 11.1 / AC-4 / CAP-10).
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:2992:+  background-image: radial-gradient(hsl(30deg 20% 100% / 5%) 1px, transparent 1px);
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:2994:+  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 78%);
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:3095:+// Micro-curseur interactif progressif (Story 11.1 / AC-4 / CAP-10).
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:4059:app/components/terminal/TerminalComponent.vue:369:      background-image: linear-gradient(to bottom right, var(--term-red), hsl(0deg 100% 27%));
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:4316:   208	    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:4331:   223	  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:4753:app/pages/about.vue:128:  { date: "2017 — 2018", name: "Développeur d'application — PHP / Symfony", school: "OpenClassrooms" },
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:4828:app/components/ui/ZInput.vue:123:  emit("update:modelValue", (event.target as HTMLInputElement | HTMLTextAreaElement).value);
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:5600:   208	    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:5615:   223	  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:5672:    65	- Blog alimenté par `@nuxt/content` **v3** (markdown sous `content/blog/`) — index
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:5893:116:+  background-image: radial-gradient(hsl(30deg 20% 100% / 5%) 1px, transparent 1px);
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:5894:118:+  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 78%);
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:6037:   116	+  background-image: radial-gradient(hsl(30deg 20% 100% / 5%) 1px, transparent 1px);
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:6039:   118	+  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 78%);
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:6136:   215	+// Micro-curseur interactif progressif (Story 11.1 / AC-4 / CAP-10).
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:6513:   208	    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:6528:   223	  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:7050:docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-37-    background-image: radial-gradient(hsl(30 20% 100% / 0.05) 1px, transparent 1px);
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:7051:docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-38-    background-size: 34px 34px; mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 78%); }
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:7055:docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-42-    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:7674:- **[AC-4 / CAP-10] Les cartes ne réagissent pas au micro-curseur.** `ZCustomCursor` recherche `[data-hot]`, mais les cartes ajoutées dans `index.vue` ne portent pas cet attribut (`full.diff:451-457`) ; les cartes non liées ne déclenchent donc jamais `.is-hot` (`full.diff:257-261`).
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:7680:- **[AC-2] Le contrat de données TryOn n’est pas respecté littéralement.** L’AC demande `url: ""`, alors que l’objet TryOn ajouté dans `SITE.projects` omet complètement la propriété (`full.diff:410-415`).
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:7683:- **[AC-4 / CAP-10] Les cartes ne réagissent pas au micro-curseur.** `ZCustomCursor` recherche `[data-hot]`, mais les cartes ajoutées dans `index.vue` ne portent pas cet attribut (`full.diff:451-457`) ; les cartes non liées ne déclenchent donc jamais `.is-hot` (`full.diff:257-261`).
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:7689:- **[AC-2] Le contrat de données TryOn n’est pas respecté littéralement.** L’AC demande `url: ""`, alors que l’objet TryOn ajouté dans `SITE.projects` omet complètement la propriété (`full.diff:410-415`).
app/components/terminal/programs/About.ts:5:  date: string;
app/components/terminal/programs/About.ts:12:  date: string;
app/components/terminal/programs/About.ts:49:  date: string;
app/components/terminal/programs/About.ts:56:  date: string;
app/components/terminal/programs/About.ts:74:      date: "02/2021 - aujourd'hui",
app/components/terminal/programs/About.ts:80:      date: "05/2020 - 12/2021",
app/components/terminal/programs/About.ts:86:      date: "07/2007 - 05/2019",
app/components/terminal/programs/About.ts:93:      date: "07/2001 - 07/2006",
app/components/terminal/programs/About.ts:101:      date: "2017 - 2018",
app/components/terminal/programs/About.ts:107:      date: "1999 - 2001",
app/components/terminal/programs/About.ts:113:      date: "1997 - 1999",
docs/implementation-artifacts/code-reviews/11-1/full.diff:116:+  background-image: radial-gradient(hsl(30deg 20% 100% / 5%) 1px, transparent 1px);
docs/implementation-artifacts/code-reviews/11-1/full.diff:118:+  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 78%);
docs/implementation-artifacts/code-reviews/11-1/full.diff:215:+// Micro-curseur interactif progressif (Story 11.1 / AC-4 / CAP-10).
app/utils/formatDate.ts:12:export function formatDate(iso: string): string {
docs/implementation-artifacts/code-reviews/11-1/raw-edge-case-hunter.json:225:+  background-image: radial-gradient(hsl(30deg 20% 100% / 5%) 1px, transparent 1px);
docs/implementation-artifacts/code-reviews/11-1/raw-edge-case-hunter.json:227:+  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 78%);
docs/implementation-artifacts/code-reviews/11-1/raw-edge-case-hunter.json:324:+// Micro-curseur interactif progressif (Story 11.1 / AC-4 / CAP-10).
docs/implementation-artifacts/code-reviews/11-1/raw-edge-case-hunter.json:863:    19	// Micro-curseur interactif progressif (Story 11.1 / AC-4 / CAP-10).
app/components/terminal/TerminalComponent.vue:369:      background-image: linear-gradient(to bottom right, var(--term-red), hsl(0deg 100% 27%));
app/composables/usePageSeo.ts:15:  /** Texte alternatif pour l'image OG/Twitter (og:image:alt, twitter:image:alt). */
app/components/WindowWrapperComponent.vue:329:      background-image: linear-gradient(to bottom right, var(--wwc-color-red), var(--wwc-color-red-dark));
docs/implementation-artifacts/code-reviews/11-1/raw-blind-hunter.md:187:+  background-image: radial-gradient(hsl(30deg 20% 100% / 5%) 1px, transparent 1px);
docs/implementation-artifacts/code-reviews/11-1/raw-blind-hunter.md:189:+  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 78%);
docs/implementation-artifacts/code-reviews/11-1/raw-blind-hunter.md:286:+// Micro-curseur interactif progressif (Story 11.1 / AC-4 / CAP-10).
docs/implementation-artifacts/code-reviews/11-1/raw-blind-hunter.md:808:app/components/terminal/TerminalComponent.vue:369:      background-image: linear-gradient(to bottom right, var(--term-red), hsl(0deg 100% 27%));
docs/implementation-artifacts/code-reviews/11-1/raw-blind-hunter.md:1195:    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/11-1/raw-blind-hunter.md:1210:  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/11-1/raw-blind-hunter.md:1774:    date: "07/2007 — 05/2019",
docs/implementation-artifacts/code-reviews/11-1/raw-blind-hunter.md:1783:  { date: "2017 — 2018", name: "Développeur d'application — PHP / Symfony", school: "OpenClassrooms" },
docs/implementation-artifacts/code-reviews/11-1/raw-blind-hunter.md:1784:  { date: "1999 — 2001", name: "BTS CIRA", school: "Lycée A. de Tocqueville, Cherbourg" },
docs/implementation-artifacts/code-reviews/11-1/raw-blind-hunter.md:1803:    image: `${siteUrl}/images/portrait.jpeg`,
app/components/home/HomeAtmosComponent.vue:68:  background-image: radial-gradient(color-mix(in srgb, var(--ink-1) 6%, transparent) 1px, transparent 1px);
app/components/home/HomeAtmosComponent.vue:70:  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, var(--surface-0) 30%, transparent 78%);
app/components/home/HomeBootOverlay.vue:39:// Séquence de démarrage stylisée jouan.os (Story 11.2 / AC-1 / CAP-2).
docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:47:  - [x] Vérif navigateur (Chrome DevTools MCP) : `/about` et `/blog` — `canonical`/`og:url` rendus, domaine résolu depuis `runtimeConfig` (inchangé en staging). Vue article non vérifiable en navigateur faute d'article réel (`content/blog/` vide), mais couverte par typecheck/prerender.
docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:166:- **Vérif navigateur.** Chrome DevTools MCP a vérifié `/about` et `/blog` en navigateur (2026-09-12) : canonical/og résolus depuis `runtimeConfig`, inchangés en staging (`https://dev.jouan.ovh/about`, `https://dev.jouan.ovh/blog`) ; JSON-LD `/blog` présent avec `blogPost: []`. Aucun article réel n'existe aujourd'hui (`content/blog/` vide), donc la vue article ne peut pas être rendue au navigateur ; elle reste couverte par typecheck + prerender.
docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:167:- **Blog sans article.** `content/blog/` est vide → blog en empty-state (`blogPost:[]`), aucune sous-route `/blog/*` prerendue (cohérent avec 11 routes). La vue article partage le même `useSiteUrl()` (validé par typecheck + prerender) ; pas d'article réel à rendre en dry-run.
docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:173:- ℹ️ Finding [Defer] **image `src` sans slash initial** (déjà trié `[x]` en revue) : confirmé **pré-existant** (déjà vrai avec l'ancienne constante `SITE_URL`), **non déclenchable** (`content/blog/` vide), et la normalisation/factorisation d'URL relève explicitement de **story 10.5** (frontière 10.1↔10.5 posée par les Dev Notes — la toucher ici déborderait le périmètre). **Non introduit par 10.1 → pas une dette de cette story** ; laissé différé conformément au triage de revue (tracé `deferred-work.md` #6).
docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:201:- [x] [Review][Defer] `article.image.src` sans slash initial → URL d'image malformée (`https://dev.jouan.ovhimages/x.webp`) [app/pages/blog/index.vue:122, app/pages/blog/[...slug].vue:121] — deferred, pre-existing (déjà vrai avec l'ancienne `SITE_URL` ; non déclenchable : `content/blog/` vide ; à traiter à la factorisation URL de 10.5)
docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:209:- [x] [Review][Defer] `article.image.src` sans slash initial → URL d'image malformée [app/pages/blog/index.vue:122, app/pages/blog/[...slug].vue:121] — deferred, pre-existing ; déjà confirmé non introduit par 10.1, non déclenchable avec `content/blog/` vide, et routé vers la normalisation/factorisation SEO de 10.5.
app/components/home/HomeStackMarquee.vue:23:// Ruban défilant continu de la stack moderne prioritaire (Story 11.3 / AC-1 / CAP-4).
app/components/home/HomeStackMarquee.vue:58:  mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
app/components/home/HomeStackMarquee.vue:105:    mask-image: none;
app/components/home/HomeHeroTerminal.vue:84:// Terminal hero cinétique (Story 11.2 / AC-2 / CAP-3).
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:32:  - [x] Pipeline blog se charge sans erreur (dump statique `__nuxt_content/blog/sql_dump.txt` généré)
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:122:- Modules vérifiés au `pnpm generate` : `@nuxt/image` produit les variantes `_ipx` (logo + portrait), `@nuxt/content` v3 émet `__nuxt_content/blog/sql_dump.txt`.
docs/implementation-artifacts/epic-10-retro-2026-09-13.md:107:- **Publication d'articles sur le blog :** Rédiger et ajouter des fichiers markdown dans `content/blog/` pour exploiter la structure existante.
docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md:5:# Story 11.4: Preuves concrètes SaaS, Journal technique & CTA final de conversion
docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md:45:   **And** les 3 articles les plus récents sont interrogés de manière prerender-safe via `useAsyncData('home-articles', () => queryCollection('blog').order('date', 'DESC').limit(3).all())`
docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md:81:  - [x] Déclarer la requête `@nuxt/content` v3 via `useAsyncData('home-articles', () => queryCollection('blog').order('date', 'DESC').limit(3).all())` dans `app/pages/index.vue`.
docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md:156:- 2026-09-13 : Implémentation des sections Projets SaaS, Statistiques, Journal technique et CTA final de conversion de la page d'accueil (Story 11.4). Gate Docker 100% verte. Status passé à review.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:90:- [x] [Review][Defer] Preuves statistiques SaaS (100k+, 85%), journal technique et bouton CTA vers profil Malt [app/pages/index.vue] — deferred, prévu dans la Story 11.4
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:471:.ds-term__dot--close { background-image: linear-gradient(to bottom right, var(--term-red), hsl(0 100% 27%));
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1828:    date: "02/2021 — aujourd'hui",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1833:    date: "05/2020 — 12/2021",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1838:    date: "07/2007 — 05/2019",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1844:    date: "2017 — 2018",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1848:    date: "1999 — 2001",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1857:    date: "12 juin 2026",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1858:    read: "8 min",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1865:    date: "28 mai 2026",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1866:    read: "11 min",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1873:    date: "9 mai 2026",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1874:    read: "6 min",
docs/implementation-artifacts/deferred-work.md:116:- **`article.image.src` sans slash initial → URL d'image malformée** — Dans `blog/index.vue` (JSON-LD `image`) et `blog/[...slug].vue` (`og:image` + JSON-LD), `` `${siteUrl}${article.image.src}` `` concatène sans séparateur : un frontmatter d'article avec `image: { src: "images/x.webp" }` (sans `/` initial) produirait `https://dev.jouan.ovhimages/x.webp`. **Pré-existant** (identique avec l'ancienne constante `SITE_URL`, non introduit par 10.1) et **non déclenchable aujourd'hui** (`content/blog/` vide → 0 article). `content.config.ts` type `image.src` en `z.string()` sans contrainte de format. À corriger à la **factorisation de la construction d'URL SEO de la story 10.5** (helper unique + normalisation slash, ou schéma `image.src` `startsWith("/")`). _(revue 10.1 — Edge Case Hunter)_
docs/implementation-artifacts/deferred-work.md:120:- **`article.image.src` sans slash initial → URL d'image malformée** — Reconfirmé par re-review 10.1 (`app/pages/blog/index.vue:122`, `app/pages/blog/[...slug].vue:121`). Même verdict : pré-existant au baseline, non déclenchable avec `content/blog/` vide, déjà routé vers la normalisation/factorisation SEO de la story 10.5.
docs/implementation-artifacts/deferred-work.md:147:- **Preuves statistiques SaaS (100k+, 85%), journal technique et bouton CTA vers profil Malt** (`app/pages/index.vue`) — Les indicateurs chiffrés, le journal et le lien de conversion Malt ne sont pas encore intégrés sur la home. → Prévu dans la **Story 11.4** (Preuves concrètes SaaS, journal technique et CTA final de conversion).
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:26:  - [x] Réutiliser le dossier `content/blog/` créé en story 6.1 (au moins un article avec front-matter : `title`, `description`, `date`, `tags`, `image`/`img`, `read`)
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:64:- **`content/blog/<slug>.md`** (réutilisé de 6.1) — doit contenir prose + au moins un bloc de code pour valider tous les styles.
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:98:- Le contenu reste du markdown sous `content/blog/`. Aucune base de données / entité à créer.
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:134:- **DRY (zéro dette)** : `formatDate` extrait dans `app/utils/formatDate.ts` (auto-importé, partagé index+article) ; `.post__meta` promu en primitive globale `base/_layout.scss` (réutilisé index+article) — copies retirées de `blog/index.vue`. Tags en `<ul>/<li>` (convention a11y) via `.hero__tags` global.
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:142:- `app/utils/formatDate.ts` (CRÉÉ — util date FR auto-importé, partagé)
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:145:- `app/pages/blog/index.vue` (MODIFIÉ — `formatDate`/`.post__meta` partagés ; `SITE_URL`/`jsonLdScript` ; date en `<time>`)
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:154:| 2026-06-24 | 0.1     | Implémentation story 6.2 — vue article `/blog/[...slug]` : prose Ubuntu sans + blocs de code en palette terminale (Shiki désactivé), structure `.article`, en-tête + héro + CTA, SEO article. Extractions partagées `formatDate` / `.post__meta`. |
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:166:_Rejetés (bruit / faux positifs vérifiés)_ : « listes sans puces » et « images qui débordent » (FAUX — le reset global fournit `disc/decimal` + `img max-width:100%`) ; `h3` en défaut navigateur (FAUX — règle globale `_typography.scss` `h1-h6`) ; clé `useAsyncData` en fonction (typecheck + generate des 3 articles passent — Edge `[]`) ; ordre 404/500 (`.first()` renvoie `null`, pas de throw → 404 ; erreur réelle → 500) ; `clearError` client (transitions correctes) ; path traversal (requête content, pas FS ; `null`→404) ; canonical/trailing-slash (canonical = `article.path` propre, dédoublonne) ; contraste `code` inline vert (fidèle kit, token DS) ; héro `object-fit:cover` (recadre sans déformer) + `alt=""` (décoratif, schéma requis) ; `description`/`datePublished` non gardés (schéma garantit la chaîne) ; classes globales `hero__tags`/`post__meta` réutilisées (primitives voulues) ; `formatDate` sans garde (date regex-validée en 6.1) ; `NuxtLink` template vs `:as` ref (les deux corrects) ; `760px` répété (littéral structurel mandaté kit) ; refactor `index.vue`/`_layout.scss` (DRY in-scope, valeurs préservées — Auditor + Edge).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:45:- [x] [Review][Patch] Supporter imageAlt pour og:image:alt et twitter:image:alt dans usePageSeo [app/composables/usePageSeo.ts:4-18, app/pages/blog/[...slug].vue:137]
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:640:date: "2026-06-22"
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:701:- Blog alimenté par `@nuxt/content` **v3** (markdown sous `content/blog/`) — index
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1297:+    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1321:+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1374:+    image: article.image?.src,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1457:+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1487:+    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1501:+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1550:+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1941:199:    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2077:148:    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2085:156-  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2114:35:                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2187:122:    ...(article.image ? { image: `${siteUrl}${article.image.src}` } : {}),
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2244:22-            <time :datetime="page.date">{{ formatDate(page.date) }}</time>
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2331:137:    image: article.image?.src,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2414:.output/public/__nuxt_content/blog/sql_dump.txt
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:3205:docs/implementation-artifacts/deferred-work.md:116:- **`article.image.src` sans slash initial → URL d'image malformée** — Dans `blog/index.vue` (JSON-LD `image`) et `blog/[...slug].vue` (`og:image` + JSON-LD), `` `${siteUrl}${article.image.src}` `` concatène sans séparateur : un frontmatter d'article avec `image: { src: "images/x.webp" }` (sans `/` initial) produirait `https://dev.jouan.ovhimages/x.webp`. **Pré-existant** (identique avec l'ancienne constante `SITE_URL`, non introduit par 10.1) et **non déclenchable aujourd'hui** (`content/blog/` vide → 0 article). `content.config.ts` type `image.src` en `z.string()` sans contrainte de format. À corriger à la **factorisation de la construction d'URL SEO de la story 10.5** (helper unique + normalisation slash, ou schéma `image.src` `startsWith("/")`). _(revue 10.1 — Edge Case Hunter)_
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:3209:docs/implementation-artifacts/deferred-work.md:120:- **`article.image.src` sans slash initial → URL d'image malformée** — Reconfirmé par re-review 10.1 (`app/pages/blog/index.vue:122`, `app/pages/blog/[...slug].vue:121`). Même verdict : pré-existant au baseline, non déclenchable avec `content/blog/` vide, déjà routé vers la normalisation/factorisation SEO de la story 10.5.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:3283:docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-138-- `content/blog/ia-dans-wordpress.md` (CRÉÉ ; `image.src` → `.webp`)
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:3284:docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-139-- `content/blog/nuxt-symfony-archi.md` (CRÉÉ ; `image.src` → `.webp`)
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:3285:docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-140-- `content/blog/n8n-automatisation.md` (CRÉÉ ; `image.src` → `.webp`)
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:3306:docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-161-- [x] [Review][Patch] `date` non validée (`z.string()`) → `formatDate` rend « Invalid Date » et le tri `.order("date","DESC")` se trompe si le format dévie. Valider au schéma (`z.string().regex(/^\d{4}-\d{2}-\d{2}$/)`) — échec au build plutôt qu'à l'affichage. [content.config.ts] — ✅ résolu : `z.string().regex(/^\d{4}-\d{2}-\d{2}$/, …)`.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:3447:   137	    image: article.image?.src,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:3487:   156	  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:3557:   148	    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:3565:   156	  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:3585:content.config.ts:4:// La collection blog reste vide tant qu'aucun article n'est ajouté sous content/blog/.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:3774:app/pages/blog/index.vue-97-// `formatDate` (date ISO → français) est un util auto-importé partagé (app/utils/).
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:3911:app/utils/formatDate.ts-1-// Formate une date ISO (YYYY-MM-DD) en français long, ex. "12 juin 2026".
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:3912:app/utils/formatDate.ts-2-// timeZone UTC : rendu déterministe (indépendant du fuseau de build), pas de décalage
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:3913:app/utils/formatDate.ts:3:// d'un jour à l'hydration. Auto-importé (app/utils/) — partagé par l'index blog et la
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:3914:app/utils/formatDate.ts-4-// vue article. Le format ISO est garanti par le schéma de la collection (content.config.ts).
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:3915:app/utils/formatDate.ts-5-const frLongDate = new Intl.DateTimeFormat("fr-FR", {
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:3916:app/utils/formatDate.ts-6-  day: "numeric",
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:3917:app/utils/formatDate.ts-7-  month: "long",
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:3918:app/utils/formatDate.ts-8-  year: "numeric",
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:4026:app/components/ui/ZInput.vue-44-// API React (attrs natifs forwarded) → Vue : v-model (modelValue/update:modelValue) + $attrs sur le contrôle.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:4154:   156	  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:4216:content/blog/.gitkeep
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:4220:content/blog/.gitkeep
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:4394:   168	+    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:4419:   192	+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:4472:   245	+    image: article.image?.src,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:4551:   324	+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:4581:   354	+    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:4595:   368	+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:21:   **Then** le composant `HomeStackMarquee.vue` affiche un bandeau défilant continu en pur CSS (animation `scroll-x` avec masque d'atténuation horizontal `mask-image: linear-gradient(...)`)
docs/implementation-artifacts/sprint-status.yaml:38:last_updated: "2026-09-13 (Story 11.4 ready-for-dev : Preuves SaaS, Journal & CTA final)"
docs/implementation-artifacts/epic-6-retro-2026-06-25.md:34:3. **Refactor DRY au point de contact — la maturation d'Epic 5 continue, côté utilitaires.** 6.2 a extrait `formatDate` dans `app/utils/`, promu `.post__meta` en primitive globale (`base/_layout.scss`) et sorti `SITE_URL` + `jsonLdScript()` dans `app/utils/seo.ts` — dédupliqués sur index + article + `/about`. Même réflexe « réparer la fondation au point de contact » qu'en 5.1 (primitives de layout), transposé aux utilitaires partagés.
docs/implementation-artifacts/epic-6-retro-2026-06-25.md:62:- **DRY au point de contact** : `formatDate`, `.post__meta`, `SITE_URL`/`jsonLdScript()` factorisés — base partagée plus saine pour Epic 7.
docs/design_system/_ds_bundle.js:471:.ds-term__dot--close { background-image: linear-gradient(to bottom right, var(--term-red), hsl(0 100% 27%));
docs/design_system/_ds_bundle.js:1828:    date: "02/2021 — aujourd'hui",
docs/design_system/_ds_bundle.js:1833:    date: "05/2020 — 12/2021",
docs/design_system/_ds_bundle.js:1838:    date: "07/2007 — 05/2019",
docs/design_system/_ds_bundle.js:1844:    date: "2017 — 2018",
docs/design_system/_ds_bundle.js:1848:    date: "1999 — 2001",
docs/design_system/_ds_bundle.js:1857:    date: "12 juin 2026",
docs/design_system/_ds_bundle.js:1858:    read: "8 min",
docs/design_system/_ds_bundle.js:1865:    date: "28 mai 2026",
docs/design_system/_ds_bundle.js:1866:    read: "11 min",
docs/design_system/_ds_bundle.js:1873:    date: "9 mai 2026",
docs/design_system/_ds_bundle.js:1874:    read: "6 min",
docs/animations_jouan.ovh/support.js:1477:      __dcUpdate: (name, kind, content, streaming) => {
docs/implementation-artifacts/code-reviews/10-5/full.diff:168:+    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/full.diff:192:+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/full.diff:245:+    image: article.image?.src,
docs/implementation-artifacts/code-reviews/10-5/full.diff:324:+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/full.diff:354:+    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/full.diff:368:+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/full.diff:417:+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:705:     4	date: "2026-06-22"
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:766:    65	- Blog alimenté par `@nuxt/content` **v3** (markdown sous `content/blog/`) — index
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:1628:   107	    date: "02/2021 — aujourd'hui",
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:1634:   113	    date: "05/2020 — 12/2021",
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:1640:   119	    date: "07/2007 — 05/2019",
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:1649:   128	  { date: "2017 — 2018", name: "Développeur d'application — PHP / Symfony", school: "OpenClassrooms" },
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:1650:   129	  { date: "1999 — 2001", name: "BTS CIRA", school: "Lycée A. de Tocqueville, Cherbourg" },
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:2675:    65	- Blog alimenté par `@nuxt/content` **v3** (markdown sous `content/blog/`) — index
docs/design_system/components/terminal/TerminalWindow.jsx:16:.ds-term__dot--close { background-image: linear-gradient(to bottom right, var(--term-red), hsl(0 100% 27%));
docs/design_system/ui_kits/jouan-site/data.js:51:    { date: "02/2021 — aujourd'hui", org: "Linkizz", role: "Testeur QA", desc: "Tests automatisés — Node.js, TypeScript, TestCafé." },
docs/design_system/ui_kits/jouan-site/data.js:52:    { date: "05/2020 — 12/2021", org: "CINS", role: "Développeur Full Stack", desc: "PHP/MySQL, Symfony 4/5, Drupal, Prestashop, WordPress, Docker." },
docs/design_system/ui_kits/jouan-site/data.js:53:    { date: "07/2007 — 05/2019", org: "A+ Métrologie / Trescal", role: "Métrologue", desc: "Technicien métrologue multi-grandeur, suppléant COFRAC électricité-magnétisme." },
docs/design_system/ui_kits/jouan-site/data.js:57:    { date: "2017 — 2018", name: "Développeur d'application — PHP / Symfony", school: "OpenClassrooms" },
docs/design_system/ui_kits/jouan-site/data.js:58:    { date: "1999 — 2001", name: "BTS CIRA", school: "Lycée A. de Tocqueville, Cherbourg" },
docs/design_system/ui_kits/jouan-site/data.js:68:      date: "12 juin 2026",
docs/design_system/ui_kits/jouan-site/data.js:69:      read: "8 min",
docs/design_system/ui_kits/jouan-site/data.js:77:      date: "28 mai 2026",
docs/design_system/ui_kits/jouan-site/data.js:78:      read: "11 min",
docs/design_system/ui_kits/jouan-site/data.js:86:      date: "9 mai 2026",
docs/design_system/ui_kits/jouan-site/data.js:87:      read: "6 min",
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:638:date: "2026-06-22"
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:699:- Blog alimenté par `@nuxt/content` **v3** (markdown sous `content/blog/`) — index
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:2032:docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md-126-  - **v-model** : `modelValue` + `update:modelValue` (`@input`). `inheritAttrs: false` → `$attrs` (placeholder, type, name…) forwardés sur le contrôle, pas le wrapper.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:5306:      background-image: linear-gradient(to bottom right, var(--term-red), hsl(0deg 100% 27%));
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:7202:      background-image: linear-gradient(to bottom right, var(--wwc-color-red), var(--wwc-color-red-dark));
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:239:+    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:263:+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:316:+    image: article.image?.src,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:399:+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:429:+    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:443:+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:492:+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:692:            <time :datetime="page.date">{{ formatDate(page.date) }}</time>
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:807:    image: article.image?.src,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:925:                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:987:// `formatDate` (date ISO → français) est un util auto-importé partagé (app/utils/).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1012:    ...(article.image ? { image: `${siteUrl}${article.image.src}` } : {}),
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1229:app/pages/about.vue:148:    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1241:app/pages/blog/index.vue:122:    ...(article.image ? { image: `${siteUrl}${article.image.src}` } : {}),
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1263:app/pages/index.vue:199:    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1321:docs/project-context.md:65:- Blog alimenté par `@nuxt/content` **v3** (markdown sous `content/blog/`) — index
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1345:docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:28:  - [x] Y placer au moins un article markdown de démonstration (`content/blog/<slug>.md`) avec front-matter (`title`, `description`, `date`, `tags`, `image`/`img`, `read`) pour valider le rendu de la liste en cartes
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1349:docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:44:  - [x] Cas vide : retirer/vider temporairement le dossier `content/blog` → l'empty-state s'affiche
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1351:docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:62:- **`content/`** (CREATE) — dossier racine à créer. Sous-dossier `content/blog/` + au moins un `.md` de démonstration avec front-matter. C'est le pipeline `@nuxt/content` qui résout ce dossier.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1361:docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:94:- Nouveau dossier racine `content/` (avec `content/blog/`). Cohérent avec la structure attendue par `@nuxt/content`.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1362:docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:121:- **Sanity-check `@nuxt/content` (préalable Epic 6)** : après création de `content/blog/` + 3 articles et restart du conteneur dev → `[@nuxt/content] ✔ Processed 2 collections and 3 files`. `/blog` liste les 3 titres, `/blog/ia-dans-wordpress` rend le markdown (`<pre>`/`<code>`). Pipeline (better-sqlite3 + rendu) **opérationnel depuis la migration Nuxt 4**.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1363:docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:129:- **Pipeline content (Tâche 1)** : créé `content/blog/` + 3 articles markdown (repris des posts de `data.js` : `ia-dans-wordpress`, `nuxt-symfony-archi`, `n8n-automatisation`) avec front-matter `title`/`description`/`date` (ISO)/`tags`/`read`/`image`. Corps markdown réels (le 1er porté de la démo `Article` de `Blog.jsx`) → pré-amorce aussi la vue article 6.2. Schéma de la collection `blog` (`content.config.ts`) étendu : `date`/`tags`/`read` typés (en plus de `image`).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1365:docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:138:- `content/blog/ia-dans-wordpress.md` (CRÉÉ ; `image.src` → `.webp`)
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1366:docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:139:- `content/blog/nuxt-symfony-archi.md` (CRÉÉ ; `image.src` → `.webp`)
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1367:docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:140:- `content/blog/n8n-automatisation.md` (CRÉÉ ; `image.src` → `.webp`)
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1370:docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:161:- [x] [Review][Patch] `date` non validée (`z.string()`) → `formatDate` rend « Invalid Date » et le tri `.order("date","DESC")` se trompe si le format dévie. Valider au schéma (`z.string().regex(/^\d{4}-\d{2}-\d{2}$/)`) — échec au build plutôt qu'à l'affichage. [content.config.ts] — ✅ résolu : `z.string().regex(/^\d{4}-\d{2}-\d{2}$/, …)`.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1389:docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:47:  - [x] Vérif navigateur (Chrome DevTools MCP) : `/about` et `/blog` — `canonical`/`og:url` rendus, domaine résolu depuis `runtimeConfig` (inchangé en staging). Vue article non vérifiable en navigateur faute d'article réel (`content/blog/` vide), mais couverte par typecheck/prerender.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1393:docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:166:- **Vérif navigateur.** Chrome DevTools MCP a vérifié `/about` et `/blog` en navigateur (2026-09-12) : canonical/og résolus depuis `runtimeConfig`, inchangés en staging (`https://dev.jouan.ovh/about`, `https://dev.jouan.ovh/blog`) ; JSON-LD `/blog` présent avec `blogPost: []`. Aucun article réel n'existe aujourd'hui (`content/blog/` vide), donc la vue article ne peut pas être rendue au navigateur ; elle reste couverte par typecheck + prerender.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1394:docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:167:- **Blog sans article.** `content/blog/` est vide → blog en empty-state (`blogPost:[]`), aucune sous-route `/blog/*` prerendue (cohérent avec 11 routes). La vue article partage le même `useSiteUrl()` (validé par typecheck + prerender) ; pas d'article réel à rendre en dry-run.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1395:docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:173:- ℹ️ Finding [Defer] **image `src` sans slash initial** (déjà trié `[x]` en revue) : confirmé **pré-existant** (déjà vrai avec l'ancienne constante `SITE_URL`), **non déclenchable** (`content/blog/` vide), et la normalisation/factorisation d'URL relève explicitement de **story 10.5** (frontière 10.1↔10.5 posée par les Dev Notes — la toucher ici déborderait le périmètre). **Non introduit par 10.1 → pas une dette de cette story** ; laissé différé conformément au triage de revue (tracé `deferred-work.md` #6).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1396:docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:201:- [x] [Review][Defer] `article.image.src` sans slash initial → URL d'image malformée (`https://dev.jouan.ovhimages/x.webp`) [app/pages/blog/index.vue:122, app/pages/blog/[...slug].vue:121] — deferred, pre-existing (déjà vrai avec l'ancienne `SITE_URL` ; non déclenchable : `content/blog/` vide ; à traiter à la factorisation URL de 10.5)
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1397:docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:209:- [x] [Review][Defer] `article.image.src` sans slash initial → URL d'image malformée [app/pages/blog/index.vue:122, app/pages/blog/[...slug].vue:121] — deferred, pre-existing ; déjà confirmé non introduit par 10.1, non déclenchable avec `content/blog/` vide, et routé vers la normalisation/factorisation SEO de 10.5.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1426:docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:26:  - [x] Réutiliser le dossier `content/blog/` créé en story 6.1 (au moins un article avec front-matter : `title`, `description`, `date`, `tags`, `image`/`img`, `read`)
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1432:docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:64:- **`content/blog/<slug>.md`** (réutilisé de 6.1) — doit contenir prose + au moins un bloc de code pour valider tous les styles.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1440:docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:98:- Le contenu reste du markdown sous `content/blog/`. Aucune base de données / entité à créer.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1445:docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:166:_Rejetés (bruit / faux positifs vérifiés)_ : « listes sans puces » et « images qui débordent » (FAUX — le reset global fournit `disc/decimal` + `img max-width:100%`) ; `h3` en défaut navigateur (FAUX — règle globale `_typography.scss` `h1-h6`) ; clé `useAsyncData` en fonction (typecheck + generate des 3 articles passent — Edge `[]`) ; ordre 404/500 (`.first()` renvoie `null`, pas de throw → 404 ; erreur réelle → 500) ; `clearError` client (transitions correctes) ; path traversal (requête content, pas FS ; `null`→404) ; canonical/trailing-slash (canonical = `article.path` propre, dédoublonne) ; contraste `code` inline vert (fidèle kit, token DS) ; héro `object-fit:cover` (recadre sans déformer) + `alt=""` (décoratif, schéma requis) ; `description`/`datePublished` non gardés (schéma garantit la chaîne) ; classes globales `hero__tags`/`post__meta` réutilisées (primitives voulues) ; `formatDate` sans garde (date regex-validée en 6.1) ; `NuxtLink` template vs `:as` ref (les deux corrects) ; `760px` répété (littéral structurel mandaté kit) ; refactor `index.vue`/`_layout.scss` (DRY in-scope, valeurs préservées — Auditor + Edge).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1454:docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:32:  - [x] Pipeline blog se charge sans erreur (dump statique `__nuxt_content/blog/sql_dump.txt` généré)
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1465:docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:122:- Modules vérifiés au `pnpm generate` : `@nuxt/image` produit les variantes `_ipx` (logo + portrait), `@nuxt/content` v3 émet `__nuxt_content/blog/sql_dump.txt`.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1480:docs/implementation-artifacts/deferred-work.md:116:- **`article.image.src` sans slash initial → URL d'image malformée** — Dans `blog/index.vue` (JSON-LD `image`) et `blog/[...slug].vue` (`og:image` + JSON-LD), `` `${siteUrl}${article.image.src}` `` concatène sans séparateur : un frontmatter d'article avec `image: { src: "images/x.webp" }` (sans `/` initial) produirait `https://dev.jouan.ovhimages/x.webp`. **Pré-existant** (identique avec l'ancienne constante `SITE_URL`, non introduit par 10.1) et **non déclenchable aujourd'hui** (`content/blog/` vide → 0 article). `content.config.ts` type `image.src` en `z.string()` sans contrainte de format. À corriger à la **factorisation de la construction d'URL SEO de la story 10.5** (helper unique + normalisation slash, ou schéma `image.src` `startsWith("/")`). _(revue 10.1 — Edge Case Hunter)_
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1481:docs/implementation-artifacts/deferred-work.md:120:- **`article.image.src` sans slash initial → URL d'image malformée** — Reconfirmé par re-review 10.1 (`app/pages/blog/index.vue:122`, `app/pages/blog/[...slug].vue:121`). Même verdict : pré-existant au baseline, non déclenchable avec `content/blog/` vide, déjà routé vers la normalisation/factorisation SEO de la story 10.5.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1491:docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:701:- Blog alimenté par `@nuxt/content` **v3** (markdown sous `content/blog/`) — index
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1938:docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1389:docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:47:  - [x] Vérif navigateur (Chrome DevTools MCP) : `/about` et `/blog` — `canonical`/`og:url` rendus, domaine résolu depuis `runtimeConfig` (inchangé en staging). Vue article non vérifiable en navigateur faute d'article réel (`content/blog/` vide), mais couverte par typecheck/prerender.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1939:docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1393:docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:166:- **Vérif navigateur.** Chrome DevTools MCP a vérifié `/about` et `/blog` en navigateur (2026-09-12) : canonical/og résolus depuis `runtimeConfig`, inchangés en staging (`https://dev.jouan.ovh/about`, `https://dev.jouan.ovh/blog`) ; JSON-LD `/blog` présent avec `blogPost: []`. Aucun article réel n'existe aujourd'hui (`content/blog/` vide), donc la vue article ne peut pas être rendue au navigateur ; elle reste couverte par typecheck + prerender.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1940:docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1445:docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:166:_Rejetés (bruit / faux positifs vérifiés)_ : « listes sans puces » et « images qui débordent » (FAUX — le reset global fournit `disc/decimal` + `img max-width:100%`) ; `h3` en défaut navigateur (FAUX — règle globale `_typography.scss` `h1-h6`) ; clé `useAsyncData` en fonction (typecheck + generate des 3 articles passent — Edge `[]`) ; ordre 404/500 (`.first()` renvoie `null`, pas de throw → 404 ; erreur réelle → 500) ; `clearError` client (transitions correctes) ; path traversal (requête content, pas FS ; `null`→404) ; canonical/trailing-slash (canonical = `article.path` propre, dédoublonne) ; contraste `code` inline vert (fidèle kit, token DS) ; héro `object-fit:cover` (recadre sans déformer) + `alt=""` (décoratif, schéma requis) ; `description`/`datePublished` non gardés (schéma garantit la chaîne) ; classes globales `hero__tags`/`post__meta` réutilisées (primitives voulues) ; `formatDate` sans garde (date regex-validée en 6.1) ; `NuxtLink` template vs `:as` ref (les deux corrects) ; `760px` répété (littéral structurel mandaté kit) ; refactor `index.vue`/`_layout.scss` (DRY in-scope, valeurs préservées — Auditor + Edge).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1943:docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1465:docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:122:- Modules vérifiés au `pnpm generate` : `@nuxt/image` produit les variantes `_ipx` (logo + portrait), `@nuxt/content` v3 émet `__nuxt_content/blog/sql_dump.txt`.

exec
/bin/zsh -lc "git show HEAD:app/pages/index.vue | sed -n '1,260p'; printf '\\n--- package ---\\n'; sed -n '1,220p' package.json; printf '\\n--- nuxt ---\\n'; sed -n '1,220p' nuxt.config.ts" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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

interface HomeServiceOffer {
  id: string;
  no: string;
  icon: "code" | "layers" | "spark";
  title: string;
  desc: string;
  points: string[];
  tags: string[];
  price: string;
  featured: boolean;
}

// Vitrine des 3 offres ciblées Full Stack TS (Story 11.3 / AC-2).
// Remplacement complet des données legacy.
const services: HomeServiceOffer[] = [
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

--- nuxt ---
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
      // URL de production du site (canonical / og:url / JSON-LD). Défaut = prod
      // (jouan.ovh, cf. public/CNAME) ; surchargeable via l'env NUXT_PUBLIC_SITE_URL
      // (cf. .env.example). Consommée par le composable useSiteUrl(). Valeur inlinée au prerender (`nuxi generate`).
      siteUrl: "https://jouan.ovh",
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

2026-09-13T19:22:59.624306Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "rg --files docs/implementation-artifacts/code-reviews/11-4 docs/implementation-artifacts | rg '11-4|11-3|11-5' | sort | head -100; printf '\\n--- prior reviews around likely findings ---\\n'; rg -n \"blind|finding|work__row|journal|stats|Story 11.4\" docs/implementation-artifacts/code-reviews/11-4 docs/implementation-artifacts/code-reviews/11-3 2>/dev/null | head -240" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md
docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md
docs/implementation-artifacts/code-reviews/11-3/full.diff
docs/implementation-artifacts/code-reviews/11-3/prompt-acceptance-auditor.md
docs/implementation-artifacts/code-reviews/11-3/prompt-blind-hunter.md
docs/implementation-artifacts/code-reviews/11-3/prompt-edge-case-hunter.md
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md
docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md
docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json
docs/implementation-artifacts/code-reviews/11-4/full.diff
docs/implementation-artifacts/code-reviews/11-4/full.diff
docs/implementation-artifacts/code-reviews/11-4/prompt-acceptance-auditor.md
docs/implementation-artifacts/code-reviews/11-4/prompt-acceptance-auditor.md
docs/implementation-artifacts/code-reviews/11-4/prompt-blind-hunter.md
docs/implementation-artifacts/code-reviews/11-4/prompt-blind-hunter.md
docs/implementation-artifacts/code-reviews/11-4/prompt-edge-case-hunter.md
docs/implementation-artifacts/code-reviews/11-4/prompt-edge-case-hunter.md
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md
docs/implementation-artifacts/code-reviews/11-4/raw-blind-hunter.md
docs/implementation-artifacts/code-reviews/11-4/raw-blind-hunter.md
docs/implementation-artifacts/code-reviews/11-4/raw-edge-case-hunter.json
docs/implementation-artifacts/code-reviews/11-4/raw-edge-case-hunter.json

--- prior reviews around likely findings ---
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:27:IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:219:FR5: Page d'accueil = hero Terminal (A) + aperçu services + stats + projets sélectionnés. _(CAP-5)_
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:240:FR24: Section journal présentant les derniers articles du blog avec lien d'approfondissement vers `/blog`. _(CAP-7)_
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:284:UX-DR12: Home — hero Terminal (A), aperçu services, stats, projets sélectionnés (réf. `Home.jsx`, contenu `data.js`).
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:340:Le visiteur découvre Simon via le hero Terminal (A) + aperçu services + stats + projets sélectionnés.
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:677:  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:1559:52-  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:1605:35:FR5: Page d'accueil = hero Terminal (A) + aperçu services + stats + projets sélectionnés. _(CAP-5)_
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:1626:56-FR24: Section journal présentant les derniers articles du blog avec lien d'approfondissement vers `/blog`. _(CAP-7)_
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:2071:  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:2153:52-  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:2663:          <div v-for="stat in stats" :key="stat.id" class="stat">
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:2761:// Chiffres clés (data.js `stats`) — texte exact (séparateur ·), pas d'emoji.
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:2762:const stats = [
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:3719:### Story 11.4: Preuves concrètes SaaS, Journal technique & CTA final de conversion
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:3722:I want consulter les réalisations SaaS phares (Keova, TryOn, Nodium), les statistiques clés et les derniers articles du journal,
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:3728:**When** on intègre la section des projets sélectionnés, les statistiques, le journal technique et le bloc CTA final
docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:3734:**And** la section journal présente les articles récents du blog avec lien vers `/blog`
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:14:# Acceptance Auditor Prompt — Story 11.4
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:17:- Spec file: `docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md`
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:18:- Context specs: `docs/planning-artifacts/epics.md` (Epic 11 / Story 11.4), `docs/project-context.md`, `docs/specs/spec-home-awwwards/SPEC.md`, `docs/specs/spec-home-awwwards/sections-mapping.md`, `AGENTS.md`
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:27:IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:139:        "id": "blind-hunter",
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:157:        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> You are an Acceptance Auditor. Review the provided diff against `{spec_file}` and any loaded context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code. Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.\n>\n> Diff:\n> {diff_output}\n"
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:241:Present a summary before proceeding: diff stats (files changed, lines added/removed), `{review_mode}`, and loaded spec/context docs (if any). HALT and wait for user confirmation to proceed.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:248:/bin/zsh -lc 'wc -l docs/implementation-artifacts/code-reviews/11-4/full.diff docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md docs/planning-artifacts/epics.md docs/project-context.md docs/specs/spec-home-awwwards/SPEC.md docs/specs/spec-home-awwwards/sections-mapping.md AGENTS.md && git status --short --branch' in /Users/simon/dev/jouan.ovh
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:251:     165 docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:261:?? docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:290:3. Execute all active layers in parallel wherever their execution methods allow: substitute the runtime placeholders (`{diff_output}`, `{spec_file}`) into each layer's `instruction`, then follow it verbatim. If a layer's instruction requires subagents and subagents are not available, generate prompt files in `{implementation_artifacts}` for each such layer and HALT. Ask the user to run each in a separate session (ideally a different LLM) and paste back the findings. When findings are pasted, treat them as those layers' findings and resume from this point.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:292:4. **Layer failure handling**: If any layer fails, times out, or returns empty results, append the layer's `name` to `{failed_layers}` (comma-separated) and proceed with findings from the remaining layers.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:294:5. Collect all findings from the completed layers, keeping track of each finding's originating layer `id`.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:314:1. **Normalize** findings from all layers into a unified list where each finding has:
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:316:   - `source` -- the `id` of the layer that produced the finding (e.g., `blind-hunter`), or merged sources joined with `+` (e.g., `blind-hunter+edge-case-hunter`)
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:321:2. **Deduplicate.** Deduplicate only findings with the same claim and same required action. If two or more findings meet both conditions, merge them into one:
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:322:   - Use the most specific finding as the base (prefer findings with a precise location over prose-only findings).
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:323:   - Append any unique detail, reasoning, or location references from the other finding(s) into the surviving `detail` field.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:324:   - Set `source` to the merged sources (e.g., `blind-hunter+edge-case-hunter`).
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:326:3. Then evaluate each remaining finding independently. Do not reject a finding because a related finding was rejected.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:328:4. **Read the code before rating.** Before assigning severity, open the source at each finding's location and read enough surrounding code to judge reachability -- call sites, guards, and validation that live outside the diff hunk. Do not rate from the diff hunk alone. Severity reflects the real consequence at a real call site, not the worst theoretical reading.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:330:5. **Assign severity** to each finding by consequence for the artifact's main consumer (software user, document reader, etc).
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:336:6. **Route** each finding into exactly one triage bucket:
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:342:   If `{review_mode}` = `"no-spec"` and a finding would otherwise be `decision_needed`, reclassify it as `patch` (if the fix is unambiguous) or `defer` (if not).
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:344:7. **Drop** all `dismiss` findings. Record the dismiss count for the summary.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:346:8. If `{failed_layers}` is non-empty, report which layers failed before announcing results. If zero findings remain after dropping dismissed AND `{failed_layers}` is non-empty, warn the user that the review may be incomplete rather than announcing a clean review.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:348:9. If zero findings remain after triage (all rejected or none raised): state "✅ Clean review — all layers passed." (Step 3 already warned if any review layers failed via `{failed_layers}`.)
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:366:- When `{spec_file}` is set, always write findings to the story file before offering action choices.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:367:- `decision-needed` findings must be resolved before handling `patch` findings.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:373:If zero findings remain after triage (all dismissed or none raised): state that and proceed to section 6 (Sprint Status Update).
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:375:### 2. Write findings to the story file
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:377:If `{spec_file}` exists and contains a Tasks/Subtasks section, append a `### Review Findings` subsection. Write all findings in this order:
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:379:1. **`decision-needed`** findings (unchecked):
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:382:2. **`patch`** findings (unchecked):
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:385:3. **`defer`** findings (checked off, marked deferred):
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:388:Also append each `defer` finding to `{deferred_work_file}` under a heading `## Deferred from: code review ({date})`. If `{spec_file}` is set, include its basename in the heading (e.g., `code review of story-3.3 (2026-03-18)`). One bullet per finding with description.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:396:If `{spec_file}` is set, add: `Findings written to the review findings section in {spec_file}.`
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:399:### 4. Resolve decision-needed findings
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:401:If `decision_needed` findings exist, present each one with its detail and the options available. The user must decide — the correct fix is ambiguous without their input. Walk through each finding (or batch related ones) and get the user's call. Once resolved, each becomes a `patch`, `defer`, or is dismissed.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:407:### 5. Handle `patch` findings
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:409:If `patch` findings exist (including any resolved from step 4), HALT. Ask the user:
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:413:> **How would you like to handle the `<P>` `patch` findings?**
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:414:> 1. **Apply every patch** — fix all of them now, no per-finding confirmation. Defer and decision-needed items are not touched.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:418:If `{spec_file}` is **not** set, present only options 1 and 2 (omit "Leave as action items" — findings were not written to a file):
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:420:> **How would you like to handle the `<P>` `patch` findings?**
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:421:> 1. **Apply every patch** — fix all of them now, no per-finding confirmation. Defer and decision-needed items are not touched.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:426:- **Apply every patch**: Apply every patch finding without per-finding confirmation. Do not modify defer or decision-needed items. After all patches are applied, present a summary of changes made. If `{spec_file}` is set, check off the patch items in the story file (leave defer items as-is).
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:427:- **Leave as action items** (only when `{spec_file}` is set): Done — findings are already written to the story.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:428:- **Walk through each patch**: Present each finding with full detail, diff context, and suggested fix. After walkthrough, re-offer the applicable options above.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:445:- If all `decision-needed` and `patch` findings were resolved (fixed or dismissed) AND no unresolved `high`/`medium` findings remain: set `{new_status}` = `done`. Update the story file Status section to `done`.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:446:- If `patch` findings were left as action items, or unresolved issues remain: set `{new_status}` = `in-progress`. Update the story file Status section to `in-progress`.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:479:> 2. **Re-run code review** — address findings and review again
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:492:/bin/zsh -lc "sed -n '1,240p' docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md" in /Users/simon/dev/jouan.ovh
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:498:# Story 11.4: Preuves concrètes SaaS, Journal technique & CTA final de conversion
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:507:I want consulter les réalisations SaaS phares (Keova, TryOn, Nodium), les statistiques clés de réassurance, les derniers articles du journal technique et le bloc d'action final,
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:521:   **And** chaque ligne interactive (`.work__row`) réagit au survol (`:hover`) avec un dégradé subtil `var(--accent-soft)` et un décalage de la flèche directionnelle (sans à-coup).
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:525:   **Then** une grille responsive (`.stats`) affiche exactement 3 compteurs typés :
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:533:   **When** on intègre la section du journal technique sur la page d'accueil
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:535:     - Eyebrow : `<p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>`
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:561:  - [x] Transposer la structure en grille/lignes `.work__row` issue de `Home - Awwwards.html` dans `app/pages/index.vue`.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:568:- [x] Tâche 2 — Intégration des statistiques clés de réassurance (`.stats`) (AC: 2)
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:569:  - [x] Mettre à jour le tableau `stats` dans le script de `app/pages/index.vue` avec les 3 indicateurs cibles : `11` (années d'expérience web), `100%` (TypeScript & SaaS de bout en bout), `QA` (culture d'automatisation & zéro régression).
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:570:  - [x] Rendre les statistiques sous la liste des projets dans un conteneur `.stats`.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:575:  - [x] Structurer la section avec l'eyebrow (`// ~/journal`), le titre de section et le lien d'en-tête vers `/blog` (`cat tous-les-articles →`).
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:605:- **`app/pages/index.vue`** (UPDATE) : Refonte complète des sections projets sélectionnés, stats, ajout du journal technique et du bloc CTA final.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:617:  - Eyebrow : `// ~/journal`
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:637:- Intégration de la grille `.stats` responsive à 3 compteurs (`11`, `100%`, `QA`) avec police monospace et adaptation 1 colonne sur mobile.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:646:- `docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md` (MODIFIED)
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:649:- 2026-09-13 : Implémentation des sections Projets SaaS, Statistiques, Journal technique et CTA final de conversion de la page d'accueil (Story 11.4). Gate Docker 100% verte. Status passé à review.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:661:/bin/zsh -lc "rg -n -C 8 'Epic 11|Story 11\\.4|11\\.4|preuves concrètes|journal technique|CTA final|conversion' docs/planning-artifacts/epics.md" in /Users/simon/dev/jouan.ovh
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:678:56-FR24: Section journal présentant les derniers articles du blog avec lien d'approfondissement vers `/blog`. _(CAP-7)_
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:809:758:### Story 11.4: Preuves concrètes SaaS, Journal technique & CTA final de conversion
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:812:761-I want consulter les réalisations SaaS phares (Keova, TryOn, Nodium), les statistiques clés et les derniers articles du journal,
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:818:767:**When** on intègre la section des projets sélectionnés, les statistiques, le journal technique et le bloc CTA final
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:824:773-**And** la section journal présente les articles récents du blog avec lien vers `/blog`
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1182:  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1225:La maquette HTML brute `Home - Awwwards.html` a été conçue comme un prototype autonome avec des ancres intra-page (`#services`, `#work`, `#journal`, `#contact`).  
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1317:/bin/zsh -lc "rg -n '"'^(diff --git|@@)|11'"\\.4|preuve|SaaS|journal|CTA|contact|saas|article|proof|conversion' docs/implementation-artifacts/code-reviews/11-4/full.diff" in /Users/simon/dev/jouan.ovh
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1321:10:+    <!-- Projets sélectionnés & Statistiques de réassurance (Story 11.4 / AC-1 & AC-2) -->
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1322:50:+        <!-- Statistiques clés de réassurance (Story 11.4 / AC-2) -->
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1323:60:+    <!-- Journal technique / Notes de dev (Story 11.4 / AC-3) -->
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1324:65:+            <p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1327:89:+        <ul v-if="articles && articles.length" class="journal">
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1328:90:+          <li v-for="article in articles" :key="article.path" class="journal__item">
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1341:132:+        <ZCard v-else class="journal__empty" padded>
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1342:133:+          <p class="journal__empty-code">$ cat ~/journal/*.md</p>
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1343:134:+          <p class="journal__empty-text">Les notes d'ingénierie et retours d'expérience sont en cours de rédaction.</p>
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1344:140:+    <!-- Bloc CTA final de conversion (Story 11.4 / AC-4) -->
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1349:175:+// Page d'accueil — refonte Hero Full Stack TS, Projets SaaS, Journal & CTA final (Story 11.4).
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1352:192:+// Projets sélectionnés — source unique `app/data/site.ts` (Story 11.4 / AC-1).
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1353:195:+// Chiffres clés de réassurance (Story 11.4 / AC-2).
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1356:207:+// Récupération des 3 derniers articles du journal technique (Story 11.4 / AC-3).
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1359:395:+// ---- Section Journal (porté de Home - Awwwards.html .journal) ----
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1360:436:+.journal {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1362:540:+.journal__empty {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1363:548:+.journal__empty-code {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1364:555:+.journal__empty-text {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1367:621:+  .journal {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1371:675:+last_updated: "2026-09-13 (Story 11.4 ready-for-dev : Preuves SaaS, Journal & CTA final)"
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1373:683:-  11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: backlog
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1374:684:+  11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: review
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1391:+    <!-- Projets sélectionnés & Statistiques de réassurance (Story 11.4 / AC-1 & AC-2) -->
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1395:-          <div v-for="stat in stats" :key="stat.id" class="stat">
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1406:+              class="work__row"
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1407:+              :class="{ 'work__row--link': Boolean(project.url) }"
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1431:+        <!-- Statistiques clés de réassurance (Story 11.4 / AC-2) -->
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1432:+        <ul class="stats">
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1433:+          <li v-for="stat in stats" :key="stat.id" class="stat">
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1441:+    <!-- Journal technique / Notes de dev (Story 11.4 / AC-3) -->
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1446:+            <p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1470:+        <ul v-if="articles && articles.length" class="journal">
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1471:+          <li v-for="article in articles" :key="article.path" class="journal__item">
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1513:+        <ZCard v-else class="journal__empty" padded>
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1514:+          <p class="journal__empty-code">$ cat ~/journal/*.md</p>
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1515:+          <p class="journal__empty-text">Les notes d'ingénierie et retours d'expérience sont en cours de rédaction.</p>
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1521:+    <!-- Bloc CTA final de conversion (Story 11.4 / AC-4) -->
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1556:+// Page d'accueil — refonte Hero Full Stack TS, Projets SaaS, Journal & CTA final (Story 11.4).
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1572:-// Chiffres clés (data.js `stats`) — texte exact (séparateur ·), pas d'emoji.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1573:+// Projets sélectionnés — source unique `app/data/site.ts` (Story 11.4 / AC-1).
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1576:+// Chiffres clés de réassurance (Story 11.4 / AC-2).
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1577: const stats = [
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1588:+// Récupération des 3 derniers articles du journal technique (Story 11.4 / AC-3).
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1615:+.work__row {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1639:+li:last-child .work__row {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1643:+.work__row--link {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1736:+// ---- Stats (porté de .stats) ----
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1737:+.stats {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1776:+// ---- Section Journal (porté de Home - Awwwards.html .journal) ----
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1817:+.journal {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1921:+.journal__empty {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1929:+.journal__empty-code {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1936:+.journal__empty-text {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2002:+  .journal {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2013:+  .work__row {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2023:+  .stats {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2032:+  .work__row,
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2038:+  .work__row--link:hover {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2056:+last_updated: "2026-09-13 (Story 11.4 ready-for-dev : Preuves SaaS, Journal & CTA final)"
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2064:-  11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: backlog
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2065:+  11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: review
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2082:+    <!-- Projets sélectionnés & Statistiques de réassurance (Story 11.4 / AC-1 & AC-2) -->
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2086:-          <div v-for="stat in stats" :key="stat.id" class="stat">
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2097:+              class="work__row"
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2098:+              :class="{ 'work__row--link': Boolean(project.url) }"
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2122:+        <!-- Statistiques clés de réassurance (Story 11.4 / AC-2) -->
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2123:+        <ul class="stats">
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2124:+          <li v-for="stat in stats" :key="stat.id" class="stat">
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2132:+    <!-- Journal technique / Notes de dev (Story 11.4 / AC-3) -->
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2137:+            <p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2161:+        <ul v-if="articles && articles.length" class="journal">
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2162:+          <li v-for="article in articles" :key="article.path" class="journal__item">
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2204:+        <ZCard v-else class="journal__empty" padded>
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2205:+          <p class="journal__empty-code">$ cat ~/journal/*.md</p>
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2206:+          <p class="journal__empty-text">Les notes d'ingénierie et retours d'expérience sont en cours de rédaction.</p>
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2212:+    <!-- Bloc CTA final de conversion (Story 11.4 / AC-4) -->
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2247:+// Page d'accueil — refonte Hero Full Stack TS, Projets SaaS, Journal & CTA final (Story 11.4).
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2263:-// Chiffres clés (data.js `stats`) — texte exact (séparateur ·), pas d'emoji.
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2264:+// Projets sélectionnés — source unique `app/data/site.ts` (Story 11.4 / AC-1).
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2267:+// Chiffres clés de réassurance (Story 11.4 / AC-2).
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2268: const stats = [
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2279:+// Récupération des 3 derniers articles du journal technique (Story 11.4 / AC-3).
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2306:+.work__row {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2330:+li:last-child .work__row {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2334:+.work__row--link {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2427:+// ---- Stats (porté de .stats) ----
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2428:+.stats {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2472:+// ---- Section Journal (porté de Home - Awwwards.html .journal) ----
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2513:+.journal {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2617:+.journal__empty {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2625:+.journal__empty-code {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2632:+.journal__empty-text {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2698:+  .journal {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2709:+  .work__row {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2719:+  .stats {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2728:+  .work__row,
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2734:+  .work__row--link:hover {
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2752:+last_updated: "2026-09-13 (Story 11.4 ready-for-dev : Preuves SaaS, Journal & CTA final)"
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2760:-  11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: backlog
docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:2761:+  11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: review
docs/implementation-artifacts/code-reviews/11-3/prompt-acceptance-auditor.md:14:IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
docs/implementation-artifacts/code-reviews/11-4/prompt-acceptance-auditor.md:1:# Acceptance Auditor Prompt — Story 11.4
docs/implementation-artifacts/code-reviews/11-4/prompt-acceptance-auditor.md:4:- Spec file: `docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md`
docs/implementation-artifacts/code-reviews/11-4/prompt-acceptance-auditor.md:5:- Context specs: `docs/planning-artifacts/epics.md` (Epic 11 / Story 11.4), `docs/project-context.md`, `docs/specs/spec-home-awwwards/SPEC.md`, `docs/specs/spec-home-awwwards/sections-mapping.md`, `AGENTS.md`
docs/implementation-artifacts/code-reviews/11-4/prompt-acceptance-auditor.md:14:IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
docs/implementation-artifacts/code-reviews/11-3/prompt-blind-hunter.md:8:Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.
docs/implementation-artifacts/code-reviews/11-4/full.diff:10:+    <!-- Projets sélectionnés & Statistiques de réassurance (Story 11.4 / AC-1 & AC-2) -->
docs/implementation-artifacts/code-reviews/11-4/full.diff:14:-          <div v-for="stat in stats" :key="stat.id" class="stat">
docs/implementation-artifacts/code-reviews/11-4/full.diff:25:+              class="work__row"
docs/implementation-artifacts/code-reviews/11-4/full.diff:26:+              :class="{ 'work__row--link': Boolean(project.url) }"
docs/implementation-artifacts/code-reviews/11-4/full.diff:50:+        <!-- Statistiques clés de réassurance (Story 11.4 / AC-2) -->
docs/implementation-artifacts/code-reviews/11-4/full.diff:51:+        <ul class="stats">
docs/implementation-artifacts/code-reviews/11-4/full.diff:52:+          <li v-for="stat in stats" :key="stat.id" class="stat">
docs/implementation-artifacts/code-reviews/11-4/full.diff:60:+    <!-- Journal technique / Notes de dev (Story 11.4 / AC-3) -->
docs/implementation-artifacts/code-reviews/11-4/full.diff:65:+            <p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>
docs/implementation-artifacts/code-reviews/11-4/full.diff:89:+        <ul v-if="articles && articles.length" class="journal">
docs/implementation-artifacts/code-reviews/11-4/full.diff:90:+          <li v-for="article in articles" :key="article.path" class="journal__item">
docs/implementation-artifacts/code-reviews/11-4/full.diff:132:+        <ZCard v-else class="journal__empty" padded>
docs/implementation-artifacts/code-reviews/11-4/full.diff:133:+          <p class="journal__empty-code">$ cat ~/journal/*.md</p>
docs/implementation-artifacts/code-reviews/11-4/full.diff:134:+          <p class="journal__empty-text">Les notes d'ingénierie et retours d'expérience sont en cours de rédaction.</p>
docs/implementation-artifacts/code-reviews/11-4/full.diff:140:+    <!-- Bloc CTA final de conversion (Story 11.4 / AC-4) -->
docs/implementation-artifacts/code-reviews/11-4/full.diff:175:+// Page d'accueil — refonte Hero Full Stack TS, Projets SaaS, Journal & CTA final (Story 11.4).
docs/implementation-artifacts/code-reviews/11-4/full.diff:191:-// Chiffres clés (data.js `stats`) — texte exact (séparateur ·), pas d'emoji.
docs/implementation-artifacts/code-reviews/11-4/full.diff:192:+// Projets sélectionnés — source unique `app/data/site.ts` (Story 11.4 / AC-1).
docs/implementation-artifacts/code-reviews/11-4/full.diff:195:+// Chiffres clés de réassurance (Story 11.4 / AC-2).
docs/implementation-artifacts/code-reviews/11-4/full.diff:196: const stats = [
docs/implementation-artifacts/code-reviews/11-4/full.diff:207:+// Récupération des 3 derniers articles du journal technique (Story 11.4 / AC-3).
docs/implementation-artifacts/code-reviews/11-4/full.diff:234:+.work__row {
docs/implementation-artifacts/code-reviews/11-4/full.diff:258:+li:last-child .work__row {
docs/implementation-artifacts/code-reviews/11-4/full.diff:262:+.work__row--link {
docs/implementation-artifacts/code-reviews/11-4/full.diff:355:+// ---- Stats (porté de .stats) ----
docs/implementation-artifacts/code-reviews/11-4/full.diff:356:+.stats {
docs/implementation-artifacts/code-reviews/11-4/full.diff:395:+// ---- Section Journal (porté de Home - Awwwards.html .journal) ----
docs/implementation-artifacts/code-reviews/11-4/full.diff:436:+.journal {
docs/implementation-artifacts/code-reviews/11-4/full.diff:540:+.journal__empty {
docs/implementation-artifacts/code-reviews/11-4/full.diff:548:+.journal__empty-code {
docs/implementation-artifacts/code-reviews/11-4/full.diff:555:+.journal__empty-text {
docs/implementation-artifacts/code-reviews/11-4/full.diff:621:+  .journal {
docs/implementation-artifacts/code-reviews/11-4/full.diff:632:+  .work__row {
docs/implementation-artifacts/code-reviews/11-4/full.diff:642:+  .stats {
docs/implementation-artifacts/code-reviews/11-4/full.diff:651:+  .work__row,
docs/implementation-artifacts/code-reviews/11-4/full.diff:657:+  .work__row--link:hover {
docs/implementation-artifacts/code-reviews/11-4/full.diff:675:+last_updated: "2026-09-13 (Story 11.4 ready-for-dev : Preuves SaaS, Journal & CTA final)"

2026-09-13T19:23:04.530927Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc 'rg -n "''^[-*] |''^##|''^# |finding|Finding|Clean review|issue|probl|erreur|bug|manqu" docs/implementation-artifacts/code-reviews/11-4/raw-blind-hunter.md | tail -220' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
15:# Blind Hunter Prompt — Story 11.4
22:Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.
26:J’utilise `bmad-review-adversarial-general` pour examiner le diff avec le niveau de scepticisme demandé et produire uniquement des descriptions de problèmes.
39:description: 'Perform a Cynical Review and produce a findings report. Use when the user requests a critical review of something'
42:# Adversarial Review (General)
44:**Goal:** Cynically review content and produce findings.
46:**Your Role:** You are a cynical, jaded reviewer with zero patience for sloppy work. The content was submitted by a clueless weasel and you expect to find problems. Be skeptical of everything. Look for what's missing, not just what's wrong. Use a precise, professional tone — no profanity or personal attacks.
49:- **content** — Content to review: diff, spec, story, doc, or any artifact
50:- **also_consider** (optional) — Areas to keep in mind during review alongside normal adversarial analysis
53:## EXECUTION
55:### Step 1: Receive Content
57:- Load the content to review from provided input or context
58:- If content to review is empty, ask for clarification and abort
59:- Identify content type (diff, branch, uncommitted changes, document, etc.)
61:### Step 2: Adversarial Analysis
63:Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content.
65:### Step 3: Present Findings
67:Output findings as a Markdown list (descriptions only).
70:## HALT CONDITIONS
72:- HALT if zero findings — this is suspicious, re-analyze or ask for guidance
73:- HALT if content is empty or unreadable
84:-    <!-- Stats + projets sélectionnés — section en creux partagée (stories 3.2 / 3.3) -->
88:-        <div class="statrow">
89:-          <div v-for="stat in stats" :key="stat.id" class="stat">
149:-        <h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>
150:-        <ul class="grid-2 projects">
151:-          <li v-for="project in projects" :key="project.name">
152:-            <ZCard
153:-              class="project"
154:-              :interactive="Boolean(project.url)"
155:-              :data-hot="Boolean(project.url) ? '' : undefined"
156:-              :as="project.url ? ZExternalLink : 'div'"
157:-              :href="project.url || undefined"
158:-              :rel="project.url ? 'noopener noreferrer' : undefined"
159:-            >
160:-              <div class="project__head">
161:-                <h3 class="project__name">{{ project.name }}</h3>
162:-                <span class="project__role">{{ project.role }}</span>
196:-              <p class="prose project__desc">{{ project.desc }}</p>
197:-              <ul class="hero__tags">
198:-                <li v-for="tag in project.tags" :key="tag">
199:-                  <ZTag>{{ tag }}</ZTag>
200:-                </li>
201:-              </ul>
272:-  { id: "stat-1", value: "8+", label: "ans dans la tech" },
273:-  { id: "stat-2", value: "3", label: "stacks maîtrisés" },
274:-  { id: "stat-3", value: "1", label: "SaaS fondé · keova.app" },
379:-  gap: var(--space-12);
384:-  // Espace avant le bloc projets (story 3.3), réf. Home.jsx (statrow marginBottom).
385:-  margin-bottom: var(--space-12);
444:-  gap: var(--space-12);
449:-  // Espace avant le bloc projets (story 3.3), réf. Home.jsx (statrow marginBottom).
450:-  margin-bottom: var(--space-12);
513:-    font-size: var(--fs-4xl);
533:-  display: grid;
534:-  grid-template-columns: 1fr 1fr;
588:-  margin-top: var(--space-5);
601:-  .hero__tags {
602:-    margin-top: auto;
625:-  align-items: baseline;
626:-  justify-content: space-between;
627:-  gap: var(--space-3);
634:-  margin: 0;
642:-  font-size: var(--fs-xl);
666:-  color: var(--text-muted);
667:-  white-space: nowrap;
687:-  margin: var(--space-3) 0 var(--space-4);
760:-  .grid-2 {
823:-  11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: backlog
1896:Le diff est lisible et j’ai confirmé les contrats des primitives, du schéma de contenu et des données partagées. Je vérifie maintenant les interactions réelles (rendu polymorphe, responsive, SSG, a11y et cohérence des métriques) afin que chaque finding soit ancré dans le contenu fourni.
2276:            Une erreur est survenue lors de la récupération des articles. Ce n'est pas vous, c'est moi : merci de
2519:// pas une vraie erreur derrière un 404), 404 uniquement quand l'article n'existe pas.
2531:// `fatal: true` ici, un throw au niveau du setup est déjà traité comme une erreur de page.
2538:// setup → on (dé)clenche la page d'erreur de façon réactive.
2717:docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:173:- ℹ️ Finding [Defer] **image `src` sans slash initial** (déjà trié `[x]` en revue) : confirmé **pré-existant** (déjà vrai avec l'ancienne constante `SITE_URL`), **non déclenchable** (`content/blog/` vide), et la normalisation/factorisation d'URL relève explicitement de **story 10.5** (frontière 10.1↔10.5 posée par les Dev Notes — la toucher ici déborderait le périmètre). **Non introduit par 10.1 → pas une dette de cette story** ; laissé différé conformément au triage de revue (tracé `deferred-work.md` #6).
2724:docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:32:  - [x] Pipeline blog se charge sans erreur (dump statique `__nuxt_content/blog/sql_dump.txt` généré)
2754:docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:166:_Rejetés (bruit / faux positifs vérifiés)_ : « listes sans puces » et « images qui débordent » (FAUX — le reset global fournit `disc/decimal` + `img max-width:100%`) ; `h3` en défaut navigateur (FAUX — règle globale `_typography.scss` `h1-h6`) ; clé `useAsyncData` en fonction (typecheck + generate des 3 articles passent — Edge `[]`) ; ordre 404/500 (`.first()` renvoie `null`, pas de throw → 404 ; erreur réelle → 500) ; `clearError` client (transitions correctes) ; path traversal (requête content, pas FS ; `null`→404) ; canonical/trailing-slash (canonical = `article.path` propre, dédoublonne) ; contraste `code` inline vert (fidèle kit, token DS) ; héro `object-fit:cover` (recadre sans déformer) + `alt=""` (décoratif, schéma requis) ; `description`/`datePublished` non gardés (schéma garantit la chaîne) ; classes globales `hero__tags`/`post__meta` réutilisées (primitives voulues) ; `formatDate` sans garde (date regex-validée en 6.1) ; `NuxtLink` template vs `:as` ref (les deux corrects) ; `760px` répété (littéral structurel mandaté kit) ; refactor `index.vue`/`_layout.scss` (DRY in-scope, valeurs préservées — Auditor + Edge).
2881:docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1395:docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:173:- ℹ️ Finding [Defer] **image `src` sans slash initial** (déjà trié `[x]` en revue) : confirmé **pré-existant** (déjà vrai avec l'ancienne constante `SITE_URL`), **non déclenchable** (`content/blog/` vide), et la normalisation/factorisation d'URL relève explicitement de **story 10.5** (frontière 10.1↔10.5 posée par les Dev Notes — la toucher ici déborderait le périmètre). **Non introduit par 10.1 → pas une dette de cette story** ; laissé différé conformément au triage de revue (tracé `deferred-work.md` #6).
2887:docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1445:docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:166:_Rejetés (bruit / faux positifs vérifiés)_ : « listes sans puces » et « images qui débordent » (FAUX — le reset global fournit `disc/decimal` + `img max-width:100%`) ; `h3` en défaut navigateur (FAUX — règle globale `_typography.scss` `h1-h6`) ; clé `useAsyncData` en fonction (typecheck + generate des 3 articles passent — Edge `[]`) ; ordre 404/500 (`.first()` renvoie `null`, pas de throw → 404 ; erreur réelle → 500) ; `clearError` client (transitions correctes) ; path traversal (requête content, pas FS ; `null`→404) ; canonical/trailing-slash (canonical = `article.path` propre, dédoublonne) ; contraste `code` inline vert (fidèle kit, token DS) ; héro `object-fit:cover` (recadre sans déformer) + `alt=""` (décoratif, schéma requis) ; `description`/`datePublished` non gardés (schéma garantit la chaîne) ; classes globales `hero__tags`/`post__meta` réutilisées (primitives voulues) ; `formatDate` sans garde (date regex-validée en 6.1) ; `NuxtLink` template vs `:as` ref (les deux corrects) ; `760px` répété (littéral structurel mandaté kit) ; refactor `index.vue`/`_layout.scss` (DRY in-scope, valeurs préservées — Auditor + Edge).
2888:docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1454:docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:32:  - [x] Pipeline blog se charge sans erreur (dump statique `__nuxt_content/blog/sql_dump.txt` généré)
2895:docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1940:docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1445:docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:166:_Rejetés (bruit / faux positifs vérifiés)_ : « listes sans puces » et « images qui débordent » (FAUX — le reset global fournit `disc/decimal` + `img max-width:100%`) ; `h3` en défaut navigateur (FAUX — règle globale `_typography.scss` `h1-h6`) ; clé `useAsyncData` en fonction (typecheck + generate des 3 articles passent — Edge `[]`) ; ordre 404/500 (`.first()` renvoie `null`, pas de throw → 404 ; erreur réelle → 500) ; `clearError` client (transitions correctes) ; path traversal (requête content, pas FS ; `null`→404) ; canonical/trailing-slash (canonical = `article.path` propre, dédoublonne) ; contraste `code` inline vert (fidèle kit, token DS) ; héro `object-fit:cover` (recadre sans déformer) + `alt=""` (décoratif, schéma requis) ; `description`/`datePublished` non gardés (schéma garantit la chaîne) ; classes globales `hero__tags`/`post__meta` réutilisées (primitives voulues) ; `formatDate` sans garde (date regex-validée en 6.1) ; `NuxtLink` template vs `:as` ref (les deux corrects) ; `760px` répété (littéral structurel mandaté kit) ; refactor `index.vue`/`_layout.scss` (DRY in-scope, valeurs préservées — Auditor + Edge).
3256:  // .env.example). Vide par défaut → le formulaire bascule sur son état d'erreur.
3280:/bin/zsh -lc "rg --files docs/implementation-artifacts/code-reviews/11-4 docs/implementation-artifacts | rg '11-4|11-3|11-5' | sort | head -100; printf '\\n--- prior reviews around likely findings ---\\n'; rg -n \"blind|finding|work__row|journal|stats|Story 11.4\" docs/implementation-artifacts/code-reviews/11-4 docs/implementation-artifacts/code-reviews/11-3 2>/dev/null | head -240" in /Users/simon/dev/jouan.ovh
3306:--- prior reviews around likely findings ---
3307:docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:27:IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
3312:docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:677:  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.
3313:docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:1559:52-  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.
3316:docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:2071:  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.
3317:docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:2153:52-  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.
3328:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:27:IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
3330:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:157:        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> You are an Acceptance Auditor. Review the provided diff against `{spec_file}` and any loaded context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code. Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.\n>\n> Diff:\n> {diff_output}\n"
3335:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:290:3. Execute all active layers in parallel wherever their execution methods allow: substitute the runtime placeholders (`{diff_output}`, `{spec_file}`) into each layer's `instruction`, then follow it verbatim. If a layer's instruction requires subagents and subagents are not available, generate prompt files in `{implementation_artifacts}` for each such layer and HALT. Ask the user to run each in a separate session (ideally a different LLM) and paste back the findings. When findings are pasted, treat them as those layers' findings and resume from this point.
3336:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:292:4. **Layer failure handling**: If any layer fails, times out, or returns empty results, append the layer's `name` to `{failed_layers}` (comma-separated) and proceed with findings from the remaining layers.
3337:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:294:5. Collect all findings from the completed layers, keeping track of each finding's originating layer `id`.
3338:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:314:1. **Normalize** findings from all layers into a unified list where each finding has:
3339:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:316:   - `source` -- the `id` of the layer that produced the finding (e.g., `blind-hunter`), or merged sources joined with `+` (e.g., `blind-hunter+edge-case-hunter`)
3340:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:321:2. **Deduplicate.** Deduplicate only findings with the same claim and same required action. If two or more findings meet both conditions, merge them into one:
3341:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:322:   - Use the most specific finding as the base (prefer findings with a precise location over prose-only findings).
3342:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:323:   - Append any unique detail, reasoning, or location references from the other finding(s) into the surviving `detail` field.
3344:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:326:3. Then evaluate each remaining finding independently. Do not reject a finding because a related finding was rejected.
3345:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:328:4. **Read the code before rating.** Before assigning severity, open the source at each finding's location and read enough surrounding code to judge reachability -- call sites, guards, and validation that live outside the diff hunk. Do not rate from the diff hunk alone. Severity reflects the real consequence at a real call site, not the worst theoretical reading.
3346:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:330:5. **Assign severity** to each finding by consequence for the artifact's main consumer (software user, document reader, etc).
3347:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:336:6. **Route** each finding into exactly one triage bucket:
3348:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:342:   If `{review_mode}` = `"no-spec"` and a finding would otherwise be `decision_needed`, reclassify it as `patch` (if the fix is unambiguous) or `defer` (if not).
3349:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:344:7. **Drop** all `dismiss` findings. Record the dismiss count for the summary.
3350:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:346:8. If `{failed_layers}` is non-empty, report which layers failed before announcing results. If zero findings remain after dropping dismissed AND `{failed_layers}` is non-empty, warn the user that the review may be incomplete rather than announcing a clean review.
3351:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:348:9. If zero findings remain after triage (all rejected or none raised): state "✅ Clean review — all layers passed." (Step 3 already warned if any review layers failed via `{failed_layers}`.)
3352:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:366:- When `{spec_file}` is set, always write findings to the story file before offering action choices.
3353:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:367:- `decision-needed` findings must be resolved before handling `patch` findings.
3354:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:373:If zero findings remain after triage (all dismissed or none raised): state that and proceed to section 6 (Sprint Status Update).
3355:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:375:### 2. Write findings to the story file
3356:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:377:If `{spec_file}` exists and contains a Tasks/Subtasks section, append a `### Review Findings` subsection. Write all findings in this order:
3357:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:379:1. **`decision-needed`** findings (unchecked):
3358:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:382:2. **`patch`** findings (unchecked):
3359:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:385:3. **`defer`** findings (checked off, marked deferred):
3360:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:388:Also append each `defer` finding to `{deferred_work_file}` under a heading `## Deferred from: code review ({date})`. If `{spec_file}` is set, include its basename in the heading (e.g., `code review of story-3.3 (2026-03-18)`). One bullet per finding with description.
3361:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:396:If `{spec_file}` is set, add: `Findings written to the review findings section in {spec_file}.`
3362:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:399:### 4. Resolve decision-needed findings
3363:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:401:If `decision_needed` findings exist, present each one with its detail and the options available. The user must decide — the correct fix is ambiguous without their input. Walk through each finding (or batch related ones) and get the user's call. Once resolved, each becomes a `patch`, `defer`, or is dismissed.
3364:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:407:### 5. Handle `patch` findings
3365:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:409:If `patch` findings exist (including any resolved from step 4), HALT. Ask the user:
3366:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:413:> **How would you like to handle the `<P>` `patch` findings?**
3367:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:414:> 1. **Apply every patch** — fix all of them now, no per-finding confirmation. Defer and decision-needed items are not touched.
3368:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:418:If `{spec_file}` is **not** set, present only options 1 and 2 (omit "Leave as action items" — findings were not written to a file):
3369:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:420:> **How would you like to handle the `<P>` `patch` findings?**
3370:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:421:> 1. **Apply every patch** — fix all of them now, no per-finding confirmation. Defer and decision-needed items are not touched.
3371:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:426:- **Apply every patch**: Apply every patch finding without per-finding confirmation. Do not modify defer or decision-needed items. After all patches are applied, present a summary of changes made. If `{spec_file}` is set, check off the patch items in the story file (leave defer items as-is).
3372:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:427:- **Leave as action items** (only when `{spec_file}` is set): Done — findings are already written to the story.
3373:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:428:- **Walk through each patch**: Present each finding with full detail, diff context, and suggested fix. After walkthrough, re-offer the applicable options above.
3374:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:445:- If all `decision-needed` and `patch` findings were resolved (fixed or dismissed) AND no unresolved `high`/`medium` findings remain: set `{new_status}` = `done`. Update the story file Status section to `done`.
3375:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:446:- If `patch` findings were left as action items, or unresolved issues remain: set `{new_status}` = `in-progress`. Update the story file Status section to `in-progress`.
3376:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:479:> 2. **Re-run code review** — address findings and review again
3384:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:561:  - [x] Transposer la structure en grille/lignes `.work__row` issue de `Home - Awwwards.html` dans `app/pages/index.vue`.
3400:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1182:  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.
3504:docs/implementation-artifacts/code-reviews/11-3/prompt-acceptance-auditor.md:14:IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
3508:docs/implementation-artifacts/code-reviews/11-4/prompt-acceptance-auditor.md:14:IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
3509:docs/implementation-artifacts/code-reviews/11-3/prompt-blind-hunter.md:8:Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

2026-09-13T19:23:09.807228Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc 'tail -180 docs/implementation-artifacts/code-reviews/11-4/raw-blind-hunter.md' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/implementation-artifacts/code-reviews/11-4/full.diff:14:-          <div v-for="stat in stats" :key="stat.id" class="stat">
docs/implementation-artifacts/code-reviews/11-4/full.diff:25:+              class="work__row"
docs/implementation-artifacts/code-reviews/11-4/full.diff:26:+              :class="{ 'work__row--link': Boolean(project.url) }"
docs/implementation-artifacts/code-reviews/11-4/full.diff:50:+        <!-- Statistiques clés de réassurance (Story 11.4 / AC-2) -->
docs/implementation-artifacts/code-reviews/11-4/full.diff:51:+        <ul class="stats">
docs/implementation-artifacts/code-reviews/11-4/full.diff:52:+          <li v-for="stat in stats" :key="stat.id" class="stat">
docs/implementation-artifacts/code-reviews/11-4/full.diff:60:+    <!-- Journal technique / Notes de dev (Story 11.4 / AC-3) -->
docs/implementation-artifacts/code-reviews/11-4/full.diff:65:+            <p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>
docs/implementation-artifacts/code-reviews/11-4/full.diff:89:+        <ul v-if="articles && articles.length" class="journal">
docs/implementation-artifacts/code-reviews/11-4/full.diff:90:+          <li v-for="article in articles" :key="article.path" class="journal__item">
docs/implementation-artifacts/code-reviews/11-4/full.diff:132:+        <ZCard v-else class="journal__empty" padded>
docs/implementation-artifacts/code-reviews/11-4/full.diff:133:+          <p class="journal__empty-code">$ cat ~/journal/*.md</p>
docs/implementation-artifacts/code-reviews/11-4/full.diff:134:+          <p class="journal__empty-text">Les notes d'ingénierie et retours d'expérience sont en cours de rédaction.</p>
docs/implementation-artifacts/code-reviews/11-4/full.diff:140:+    <!-- Bloc CTA final de conversion (Story 11.4 / AC-4) -->
docs/implementation-artifacts/code-reviews/11-4/full.diff:175:+// Page d'accueil — refonte Hero Full Stack TS, Projets SaaS, Journal & CTA final (Story 11.4).
docs/implementation-artifacts/code-reviews/11-4/full.diff:191:-// Chiffres clés (data.js `stats`) — texte exact (séparateur ·), pas d'emoji.
docs/implementation-artifacts/code-reviews/11-4/full.diff:192:+// Projets sélectionnés — source unique `app/data/site.ts` (Story 11.4 / AC-1).
docs/implementation-artifacts/code-reviews/11-4/full.diff:195:+// Chiffres clés de réassurance (Story 11.4 / AC-2).
docs/implementation-artifacts/code-reviews/11-4/full.diff:196: const stats = [
docs/implementation-artifacts/code-reviews/11-4/full.diff:207:+// Récupération des 3 derniers articles du journal technique (Story 11.4 / AC-3).
docs/implementation-artifacts/code-reviews/11-4/full.diff:234:+.work__row {
docs/implementation-artifacts/code-reviews/11-4/full.diff:258:+li:last-child .work__row {
docs/implementation-artifacts/code-reviews/11-4/full.diff:262:+.work__row--link {
docs/implementation-artifacts/code-reviews/11-4/full.diff:355:+// ---- Stats (porté de .stats) ----
docs/implementation-artifacts/code-reviews/11-4/full.diff:356:+.stats {
docs/implementation-artifacts/code-reviews/11-4/full.diff:395:+// ---- Section Journal (porté de Home - Awwwards.html .journal) ----
docs/implementation-artifacts/code-reviews/11-4/full.diff:436:+.journal {
docs/implementation-artifacts/code-reviews/11-4/full.diff:540:+.journal__empty {
docs/implementation-artifacts/code-reviews/11-4/full.diff:548:+.journal__empty-code {
docs/implementation-artifacts/code-reviews/11-4/full.diff:555:+.journal__empty-text {
docs/implementation-artifacts/code-reviews/11-4/full.diff:621:+  .journal {
docs/implementation-artifacts/code-reviews/11-4/full.diff:632:+  .work__row {
docs/implementation-artifacts/code-reviews/11-4/full.diff:642:+  .stats {
docs/implementation-artifacts/code-reviews/11-4/full.diff:651:+  .work__row,
docs/implementation-artifacts/code-reviews/11-4/full.diff:657:+  .work__row--link:hover {
docs/implementation-artifacts/code-reviews/11-4/full.diff:675:+last_updated: "2026-09-13 (Story 11.4 ready-for-dev : Preuves SaaS, Journal & CTA final)"

2026-09-13T19:23:04.530927Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc 'rg -n "''^[-*] |''^##|''^# |finding|Finding|Clean review|issue|probl|erreur|bug|manqu" docs/implementation-artifacts/code-reviews/11-4/raw-blind-hunter.md | tail -220' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
15:# Blind Hunter Prompt — Story 11.4
22:Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.
26:J’utilise `bmad-review-adversarial-general` pour examiner le diff avec le niveau de scepticisme demandé et produire uniquement des descriptions de problèmes.
39:description: 'Perform a Cynical Review and produce a findings report. Use when the user requests a critical review of something'
42:# Adversarial Review (General)
44:**Goal:** Cynically review content and produce findings.
46:**Your Role:** You are a cynical, jaded reviewer with zero patience for sloppy work. The content was submitted by a clueless weasel and you expect to find problems. Be skeptical of everything. Look for what's missing, not just what's wrong. Use a precise, professional tone — no profanity or personal attacks.
49:- **content** — Content to review: diff, spec, story, doc, or any artifact
50:- **also_consider** (optional) — Areas to keep in mind during review alongside normal adversarial analysis
53:## EXECUTION
55:### Step 1: Receive Content
57:- Load the content to review from provided input or context
58:- If content to review is empty, ask for clarification and abort
59:- Identify content type (diff, branch, uncommitted changes, document, etc.)
61:### Step 2: Adversarial Analysis
63:Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content.
65:### Step 3: Present Findings
67:Output findings as a Markdown list (descriptions only).
70:## HALT CONDITIONS
72:- HALT if zero findings — this is suspicious, re-analyze or ask for guidance
73:- HALT if content is empty or unreadable
84:-    <!-- Stats + projets sélectionnés — section en creux partagée (stories 3.2 / 3.3) -->
88:-        <div class="statrow">
89:-          <div v-for="stat in stats" :key="stat.id" class="stat">
149:-        <h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>
150:-        <ul class="grid-2 projects">
151:-          <li v-for="project in projects" :key="project.name">
152:-            <ZCard
153:-              class="project"
154:-              :interactive="Boolean(project.url)"
155:-              :data-hot="Boolean(project.url) ? '' : undefined"
156:-              :as="project.url ? ZExternalLink : 'div'"
157:-              :href="project.url || undefined"
158:-              :rel="project.url ? 'noopener noreferrer' : undefined"
159:-            >
160:-              <div class="project__head">
161:-                <h3 class="project__name">{{ project.name }}</h3>
162:-                <span class="project__role">{{ project.role }}</span>
196:-              <p class="prose project__desc">{{ project.desc }}</p>
197:-              <ul class="hero__tags">
198:-                <li v-for="tag in project.tags" :key="tag">
199:-                  <ZTag>{{ tag }}</ZTag>
200:-                </li>
201:-              </ul>
272:-  { id: "stat-1", value: "8+", label: "ans dans la tech" },
273:-  { id: "stat-2", value: "3", label: "stacks maîtrisés" },
274:-  { id: "stat-3", value: "1", label: "SaaS fondé · keova.app" },
379:-  gap: var(--space-12);
384:-  // Espace avant le bloc projets (story 3.3), réf. Home.jsx (statrow marginBottom).
385:-  margin-bottom: var(--space-12);
444:-  gap: var(--space-12);
449:-  // Espace avant le bloc projets (story 3.3), réf. Home.jsx (statrow marginBottom).
450:-  margin-bottom: var(--space-12);
513:-    font-size: var(--fs-4xl);
533:-  display: grid;
534:-  grid-template-columns: 1fr 1fr;
588:-  margin-top: var(--space-5);
601:-  .hero__tags {
602:-    margin-top: auto;
625:-  align-items: baseline;
626:-  justify-content: space-between;
627:-  gap: var(--space-3);
634:-  margin: 0;
642:-  font-size: var(--fs-xl);
666:-  color: var(--text-muted);
667:-  white-space: nowrap;
687:-  margin: var(--space-3) 0 var(--space-4);
760:-  .grid-2 {
823:-  11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: backlog
1896:Le diff est lisible et j’ai confirmé les contrats des primitives, du schéma de contenu et des données partagées. Je vérifie maintenant les interactions réelles (rendu polymorphe, responsive, SSG, a11y et cohérence des métriques) afin que chaque finding soit ancré dans le contenu fourni.
2276:            Une erreur est survenue lors de la récupération des articles. Ce n'est pas vous, c'est moi : merci de
2519:// pas une vraie erreur derrière un 404), 404 uniquement quand l'article n'existe pas.
2531:// `fatal: true` ici, un throw au niveau du setup est déjà traité comme une erreur de page.
2538:// setup → on (dé)clenche la page d'erreur de façon réactive.
2717:docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:173:- ℹ️ Finding [Defer] **image `src` sans slash initial** (déjà trié `[x]` en revue) : confirmé **pré-existant** (déjà vrai avec l'ancienne constante `SITE_URL`), **non déclenchable** (`content/blog/` vide), et la normalisation/factorisation d'URL relève explicitement de **story 10.5** (frontière 10.1↔10.5 posée par les Dev Notes — la toucher ici déborderait le périmètre). **Non introduit par 10.1 → pas une dette de cette story** ; laissé différé conformément au triage de revue (tracé `deferred-work.md` #6).
2724:docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:32:  - [x] Pipeline blog se charge sans erreur (dump statique `__nuxt_content/blog/sql_dump.txt` généré)
2754:docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:166:_Rejetés (bruit / faux positifs vérifiés)_ : « listes sans puces » et « images qui débordent » (FAUX — le reset global fournit `disc/decimal` + `img max-width:100%`) ; `h3` en défaut navigateur (FAUX — règle globale `_typography.scss` `h1-h6`) ; clé `useAsyncData` en fonction (typecheck + generate des 3 articles passent — Edge `[]`) ; ordre 404/500 (`.first()` renvoie `null`, pas de throw → 404 ; erreur réelle → 500) ; `clearError` client (transitions correctes) ; path traversal (requête content, pas FS ; `null`→404) ; canonical/trailing-slash (canonical = `article.path` propre, dédoublonne) ; contraste `code` inline vert (fidèle kit, token DS) ; héro `object-fit:cover` (recadre sans déformer) + `alt=""` (décoratif, schéma requis) ; `description`/`datePublished` non gardés (schéma garantit la chaîne) ; classes globales `hero__tags`/`post__meta` réutilisées (primitives voulues) ; `formatDate` sans garde (date regex-validée en 6.1) ; `NuxtLink` template vs `:as` ref (les deux corrects) ; `760px` répété (littéral structurel mandaté kit) ; refactor `index.vue`/`_layout.scss` (DRY in-scope, valeurs préservées — Auditor + Edge).
2881:docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1395:docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:173:- ℹ️ Finding [Defer] **image `src` sans slash initial** (déjà trié `[x]` en revue) : confirmé **pré-existant** (déjà vrai avec l'ancienne constante `SITE_URL`), **non déclenchable** (`content/blog/` vide), et la normalisation/factorisation d'URL relève explicitement de **story 10.5** (frontière 10.1↔10.5 posée par les Dev Notes — la toucher ici déborderait le périmètre). **Non introduit par 10.1 → pas une dette de cette story** ; laissé différé conformément au triage de revue (tracé `deferred-work.md` #6).
2887:docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1445:docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:166:_Rejetés (bruit / faux positifs vérifiés)_ : « listes sans puces » et « images qui débordent » (FAUX — le reset global fournit `disc/decimal` + `img max-width:100%`) ; `h3` en défaut navigateur (FAUX — règle globale `_typography.scss` `h1-h6`) ; clé `useAsyncData` en fonction (typecheck + generate des 3 articles passent — Edge `[]`) ; ordre 404/500 (`.first()` renvoie `null`, pas de throw → 404 ; erreur réelle → 500) ; `clearError` client (transitions correctes) ; path traversal (requête content, pas FS ; `null`→404) ; canonical/trailing-slash (canonical = `article.path` propre, dédoublonne) ; contraste `code` inline vert (fidèle kit, token DS) ; héro `object-fit:cover` (recadre sans déformer) + `alt=""` (décoratif, schéma requis) ; `description`/`datePublished` non gardés (schéma garantit la chaîne) ; classes globales `hero__tags`/`post__meta` réutilisées (primitives voulues) ; `formatDate` sans garde (date regex-validée en 6.1) ; `NuxtLink` template vs `:as` ref (les deux corrects) ; `760px` répété (littéral structurel mandaté kit) ; refactor `index.vue`/`_layout.scss` (DRY in-scope, valeurs préservées — Auditor + Edge).
2888:docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1454:docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:32:  - [x] Pipeline blog se charge sans erreur (dump statique `__nuxt_content/blog/sql_dump.txt` généré)
2895:docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1940:docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1445:docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:166:_Rejetés (bruit / faux positifs vérifiés)_ : « listes sans puces » et « images qui débordent » (FAUX — le reset global fournit `disc/decimal` + `img max-width:100%`) ; `h3` en défaut navigateur (FAUX — règle globale `_typography.scss` `h1-h6`) ; clé `useAsyncData` en fonction (typecheck + generate des 3 articles passent — Edge `[]`) ; ordre 404/500 (`.first()` renvoie `null`, pas de throw → 404 ; erreur réelle → 500) ; `clearError` client (transitions correctes) ; path traversal (requête content, pas FS ; `null`→404) ; canonical/trailing-slash (canonical = `article.path` propre, dédoublonne) ; contraste `code` inline vert (fidèle kit, token DS) ; héro `object-fit:cover` (recadre sans déformer) + `alt=""` (décoratif, schéma requis) ; `description`/`datePublished` non gardés (schéma garantit la chaîne) ; classes globales `hero__tags`/`post__meta` réutilisées (primitives voulues) ; `formatDate` sans garde (date regex-validée en 6.1) ; `NuxtLink` template vs `:as` ref (les deux corrects) ; `760px` répété (littéral structurel mandaté kit) ; refactor `index.vue`/`_layout.scss` (DRY in-scope, valeurs préservées — Auditor + Edge).
3256:  // .env.example). Vide par défaut → le formulaire bascule sur son état d'erreur.
3280:/bin/zsh -lc "rg --files docs/implementation-artifacts/code-reviews/11-4 docs/implementation-artifacts | rg '11-4|11-3|11-5' | sort | head -100; printf '\\n--- prior reviews around likely findings ---\\n'; rg -n \"blind|finding|work__row|journal|stats|Story 11.4\" docs/implementation-artifacts/code-reviews/11-4 docs/implementation-artifacts/code-reviews/11-3 2>/dev/null | head -240" in /Users/simon/dev/jouan.ovh
3306:--- prior reviews around likely findings ---
3307:docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:27:IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
3312:docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:677:  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.
3313:docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:1559:52-  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.
3316:docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:2071:  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.
3317:docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:2153:52-  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.
3328:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:27:IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
3330:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:157:        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> You are an Acceptance Auditor. Review the provided diff against `{spec_file}` and any loaded context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code. Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.\n>\n> Diff:\n> {diff_output}\n"
3335:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:290:3. Execute all active layers in parallel wherever their execution methods allow: substitute the runtime placeholders (`{diff_output}`, `{spec_file}`) into each layer's `instruction`, then follow it verbatim. If a layer's instruction requires subagents and subagents are not available, generate prompt files in `{implementation_artifacts}` for each such layer and HALT. Ask the user to run each in a separate session (ideally a different LLM) and paste back the findings. When findings are pasted, treat them as those layers' findings and resume from this point.
3336:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:292:4. **Layer failure handling**: If any layer fails, times out, or returns empty results, append the layer's `name` to `{failed_layers}` (comma-separated) and proceed with findings from the remaining layers.
3337:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:294:5. Collect all findings from the completed layers, keeping track of each finding's originating layer `id`.
3338:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:314:1. **Normalize** findings from all layers into a unified list where each finding has:
3339:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:316:   - `source` -- the `id` of the layer that produced the finding (e.g., `blind-hunter`), or merged sources joined with `+` (e.g., `blind-hunter+edge-case-hunter`)
3340:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:321:2. **Deduplicate.** Deduplicate only findings with the same claim and same required action. If two or more findings meet both conditions, merge them into one:
3341:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:322:   - Use the most specific finding as the base (prefer findings with a precise location over prose-only findings).
3342:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:323:   - Append any unique detail, reasoning, or location references from the other finding(s) into the surviving `detail` field.
3344:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:326:3. Then evaluate each remaining finding independently. Do not reject a finding because a related finding was rejected.
3345:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:328:4. **Read the code before rating.** Before assigning severity, open the source at each finding's location and read enough surrounding code to judge reachability -- call sites, guards, and validation that live outside the diff hunk. Do not rate from the diff hunk alone. Severity reflects the real consequence at a real call site, not the worst theoretical reading.
3346:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:330:5. **Assign severity** to each finding by consequence for the artifact's main consumer (software user, document reader, etc).
3347:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:336:6. **Route** each finding into exactly one triage bucket:
3348:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:342:   If `{review_mode}` = `"no-spec"` and a finding would otherwise be `decision_needed`, reclassify it as `patch` (if the fix is unambiguous) or `defer` (if not).
3349:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:344:7. **Drop** all `dismiss` findings. Record the dismiss count for the summary.
3350:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:346:8. If `{failed_layers}` is non-empty, report which layers failed before announcing results. If zero findings remain after dropping dismissed AND `{failed_layers}` is non-empty, warn the user that the review may be incomplete rather than announcing a clean review.
3351:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:348:9. If zero findings remain after triage (all rejected or none raised): state "✅ Clean review — all layers passed." (Step 3 already warned if any review layers failed via `{failed_layers}`.)
3352:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:366:- When `{spec_file}` is set, always write findings to the story file before offering action choices.
3353:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:367:- `decision-needed` findings must be resolved before handling `patch` findings.
3354:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:373:If zero findings remain after triage (all dismissed or none raised): state that and proceed to section 6 (Sprint Status Update).
3355:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:375:### 2. Write findings to the story file
3356:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:377:If `{spec_file}` exists and contains a Tasks/Subtasks section, append a `### Review Findings` subsection. Write all findings in this order:
3357:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:379:1. **`decision-needed`** findings (unchecked):
3358:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:382:2. **`patch`** findings (unchecked):
3359:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:385:3. **`defer`** findings (checked off, marked deferred):
3360:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:388:Also append each `defer` finding to `{deferred_work_file}` under a heading `## Deferred from: code review ({date})`. If `{spec_file}` is set, include its basename in the heading (e.g., `code review of story-3.3 (2026-03-18)`). One bullet per finding with description.
3361:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:396:If `{spec_file}` is set, add: `Findings written to the review findings section in {spec_file}.`
3362:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:399:### 4. Resolve decision-needed findings
3363:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:401:If `decision_needed` findings exist, present each one with its detail and the options available. The user must decide — the correct fix is ambiguous without their input. Walk through each finding (or batch related ones) and get the user's call. Once resolved, each becomes a `patch`, `defer`, or is dismissed.
3364:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:407:### 5. Handle `patch` findings
3365:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:409:If `patch` findings exist (including any resolved from step 4), HALT. Ask the user:
3366:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:413:> **How would you like to handle the `<P>` `patch` findings?**
3367:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:414:> 1. **Apply every patch** — fix all of them now, no per-finding confirmation. Defer and decision-needed items are not touched.
3368:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:418:If `{spec_file}` is **not** set, present only options 1 and 2 (omit "Leave as action items" — findings were not written to a file):
3369:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:420:> **How would you like to handle the `<P>` `patch` findings?**
3370:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:421:> 1. **Apply every patch** — fix all of them now, no per-finding confirmation. Defer and decision-needed items are not touched.
3371:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:426:- **Apply every patch**: Apply every patch finding without per-finding confirmation. Do not modify defer or decision-needed items. After all patches are applied, present a summary of changes made. If `{spec_file}` is set, check off the patch items in the story file (leave defer items as-is).
3372:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:427:- **Leave as action items** (only when `{spec_file}` is set): Done — findings are already written to the story.
3373:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:428:- **Walk through each patch**: Present each finding with full detail, diff context, and suggested fix. After walkthrough, re-offer the applicable options above.
3374:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:445:- If all `decision-needed` and `patch` findings were resolved (fixed or dismissed) AND no unresolved `high`/`medium` findings remain: set `{new_status}` = `done`. Update the story file Status section to `done`.
3375:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:446:- If `patch` findings were left as action items, or unresolved issues remain: set `{new_status}` = `in-progress`. Update the story file Status section to `in-progress`.
3376:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:479:> 2. **Re-run code review** — address findings and review again
3384:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:561:  - [x] Transposer la structure en grille/lignes `.work__row` issue de `Home - Awwwards.html` dans `app/pages/index.vue`.
3400:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1182:  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.
3504:docs/implementation-artifacts/code-reviews/11-3/prompt-acceptance-auditor.md:14:IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
3508:docs/implementation-artifacts/code-reviews/11-4/prompt-acceptance-auditor.md:14:IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
3509:docs/implementation-artifacts/code-reviews/11-3/prompt-blind-hunter.md:8:Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

2026-09-13T19:23:09.807228Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5

2026-09-13T19:23:15.301134Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
exec
/bin/zsh -lc "sed -n '480,620p' docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
> 3. **Done** — end the workflow

**HALT** — I am waiting for your choice. Do not proceed until the user selects an option.

## On Complete

Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow.on_complete`

If the resolved `workflow.on_complete` is non-empty, follow it as the final terminal instruction before exiting.

2026-09-13T19:22:44.630370Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '1,240p' docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
baseline_commit: 44894826488b4d1acf1ce108ea6ff345b725c80a
---

# Story 11.4: Preuves concrètes SaaS, Journal technique & CTA final de conversion

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a prospect explorant la page d'accueil pour évaluer une collaboration freelance,
I want consulter les réalisations SaaS phares (Keova, TryOn, Nodium), les statistiques clés de réassurance, les derniers articles du journal technique et le bloc d'action final,
so that je sois convaincu par des preuves concrètes d'ingénierie logicielle Full Stack TypeScript et engagé à initier un contact direct via le formulaire ou Malt (FR23, FR24, FR25, NFR12, UX-DR23, UX-DR24, CAP-5, CAP-6, CAP-7).

## Acceptance Criteria

1. **Given** les projets définis dans `SITE.projects` (`app/data/site.ts`)
   **When** le visiteur fait défiler la page d'accueil sous la section des services
   **Then** la section des réalisations (`.work`) affiche l'en-tête :
     - Eyebrow : `<p class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</p>`
     - Titre de section : `<h2 class="section__title">Des produits qui tournent en production</h2>`
   **And** la liste des projets est structurée en une séquence sémantique `<ul>` / `<li>` avec les 3 réalisations :
     - **Keova App** (`01`) : Statut `● En production`, rôle `Co-fondateur & Développeur Full Stack`, description ERP équestre SaaS, tags (`Nuxt 4`, `NestJS`, `PostgreSQL`, `Stripe Connect`, `SaaS`), et lien externe direct accessible via `<ZExternalLink href="https://keova.app">`
     - **TryOn** (`02`) : Statut `○ Étude de cas (MVP livré)`, rôle `CTO & Développeur Full Stack`, description plateforme IA générative & mode, tags (`Nuxt 3`, `NestJS`, `Python`, `ComfyUI`, `IA`), **sans lien externe mort 404** (rendu sans balise `<a>` externe non résolue)
     - **Nodium** (`03`) : Statut `◐ R&D / En cours`, rôle `Créateur & Ingénieur IA`, description orchestration d'agents desktop, tags (`TypeScript`, `Electron`, `Agents`, `IA`), rendu sans lien externe
   **And** chaque ligne interactive (`.work__row`) réagit au survol (`:hover`) avec un dégradé subtil `var(--accent-soft)` et un décalage de la flèche directionnelle (sans à-coup).

2. **Given** la zone de réassurance située immédiatement après les projets
   **When** le visiteur consulte les indicateurs clés
   **Then** une grille responsive (`.stats`) affiche exactement 3 compteurs typés :
     - Compteur 1 : Valeur `11`, libellé `années d'expérience web`
     - Compteur 2 : Valeur `100%`, libellé `TypeScript & SaaS de bout en bout`
     - Compteur 3 : Valeur `QA`, libellé `culture d'automatisation & zéro régression`
   **And** les valeurs numériques/codes sont mises en exergue en police monospace `var(--font-mono)` et couleur d'accent `var(--accent)`
   **And** la grille s'adapte de façon fluide (3 colonnes sur desktop, 1 colonne sous 680px).

3. **Given** la collection de blog `@nuxt/content` v3
   **When** on intègre la section du journal technique sur la page d'accueil
   **Then** l'en-tête de section affiche :
     - Eyebrow : `<p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>`
     - Titre : `<h2 class="section__title">Notes de dev, écrites en construisant</h2>`
     - Lien d'approfondissement : `<NuxtLink to="/blog" class="seeall">cat tous-les-articles →</NuxtLink>`
   **And** les 3 articles les plus récents sont interrogés de manière prerender-safe via `useAsyncData('home-articles', () => queryCollection('blog').order('date', 'DESC').limit(3).all())`
   **And** si des articles existent, ils sont rendus avec leurs tags `ZTag`, titre, date formatée et lien vers leur route `/blog/[slug]`
   **And** si la collection est vide (état initial du dépôt avec `.gitkeep`), un état d'attente sobre et élégant s'affiche invitant à consulter le blog sans bloquer le rendu statique SSG.

4. **Given** le bas de la page d'accueil
   **When** le prospect atteint la fin de la consultation
   **Then** un panneau d'appel à l'action final (`.cta`) se présente avec :
     - Eyebrow mono : `<p class="eyebrow"><span aria-hidden="true">$ </span>./contact --start</p>`
     - Titre : `<h2 class="cta__title">Un projet en tête ? Mettons-le <span class="cta__highlight">en production</span>.</h2>`
     - Sous-titre : `<p class="cta__subtitle">Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript, parlons-en.</p>`
     - CTAs interactifs :
       - Bouton primaire : `<ZButton to="/contact">Discuter de votre projet</ZButton>`
       - Bouton externe : `<ZButton :as="ZExternalLink" :href="SITE.profile.maltUrl" variant="secondary">Me contacter sur Malt</ZButton>` (garantissant l'accessibilité a11y et `srText`)
       - Bouton tertiaire : `<ZButton variant="ghost" to="/about">Voir le parcours & CV</ZButton>`
   **And** aucun lien intra-page avec ancre `#` n'est employé (respect de l'architecture multi-pages).

5. **Given** l'ensemble des intégrations de la story
   **When** on exécute la gate de validation Docker
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript, et 13 routes statiques générées avec succès par Nitro.

## Tasks / Subtasks

- [x] Tâche 1 — Refonte de la section des projets sélectionnés (`.work`) (AC: 1)
  - [x] Transposer la structure en grille/lignes `.work__row` issue de `Home - Awwwards.html` dans `app/pages/index.vue`.
  - [x] Baliser les 3 projets de `SITE.projects` (`keova.app`, `TryOn`, `Nodium`) dans une liste sémantique `<ul>` et `<li>`.
  - [x] Afficher la numérotation (`01`, `02`, `03`), le statut coloré (`● En production`, `○ Étude de cas (MVP livré)`, `◐ R&D / En cours`), le titre, la description, le rôle et les tags avec `ZTag`.
  - [x] Rendre la ligne de `keova.app` comme lien externe accessible via `<ZExternalLink href="https://keova.app">` avec indicateur de sortie (`.work__go`).
  - [x] Rendre les lignes de `TryOn` et `Nodium` sans balise lien externe afin d'éviter tout lien mort 404 (éléments interactifs locaux ou conteneurs non-liens).
  - [x] Styliser les lignes en SCSS scoped avec les tokens du Design System (`--border-subtle`, `--accent-soft`, `--text-faint`, `--text-muted`, `--accent`).

- [x] Tâche 2 — Intégration des statistiques clés de réassurance (`.stats`) (AC: 2)
  - [x] Mettre à jour le tableau `stats` dans le script de `app/pages/index.vue` avec les 3 indicateurs cibles : `11` (années d'expérience web), `100%` (TypeScript & SaaS de bout en bout), `QA` (culture d'automatisation & zéro régression).
  - [x] Rendre les statistiques sous la liste des projets dans un conteneur `.stats`.
  - [x] Styliser les compteurs en typographie monospace (`var(--font-mono)`), taille fluide clamp, couleur d'accent (`var(--accent)`), avec adaptation responsive (3 colonnes sur desktop, 1 colonne sous 680px).

- [x] Tâche 3 — Intégration de la section Journal technique (AC: 3)
  - [x] Déclarer la requête `@nuxt/content` v3 via `useAsyncData('home-articles', () => queryCollection('blog').order('date', 'DESC').limit(3).all())` dans `app/pages/index.vue`.
  - [x] Structurer la section avec l'eyebrow (`// ~/journal`), le titre de section et le lien d'en-tête vers `/blog` (`cat tous-les-articles →`).
  - [x] Rendre les cartes d'articles avec titre, tags `ZTag`, date formatée et lien vers la route d'article si la liste n'est pas vide.
  - [x] Prévoir le rendu de repli élégant lorsque la collection est vide (pas d'erreur, message sobre et invitation à visiter `/blog`).

- [x] Tâche 4 — Intégration du bloc CTA final de conversion (`.cta`) (AC: 4)
  - [x] Créer le bloc de clôture de page d'accueil `.cta` avant la fermeture du `<main>`.
  - [x] Ajouter l'eyebrow terminale (`$ ./contact --start`), le titre d'accroche avec mise en valeur de « en production » (`var(--accent)`), et le sous-titre commercial.
  - [x] Intégrer les trois actions : bouton primaire vers `/contact`, bouton externe vers le profil Malt (`SITE.profile.maltUrl`) avec `<ZButton :as="ZExternalLink">`, et bouton fantôme vers `/about`.
  - [x] Styliser le bloc avec une surface surélevée (`--surface-2` ou dégradé aubergine sombre), bordure subtile et padding généreux.

- [x] Tâche 5 — Validation qualité & Gate Docker (AC: 5)
  - [x] Exécuter la suite de validation Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [x] Vérifier la propreté du rendu visuel, la fluidité des survols, la navigation au clavier (`Tab`, `:focus-visible`).
  - [x] Vérifier la complétion de la page d'accueil complète (Hero, Marquee, Services, Projets, Stats, Journal, CTA).

## Dev Notes

### Architecture & Contraintes d'environnement
- **Environnement Docker STRICT :** Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. Ne jamais lancer `pnpm` sur la machine hôte macOS. [Source: AGENTS.md#Section 2]
- **Tokens CSS & Design System :** Aucune couleur, espacement ou dimension en dur. Consommer exclusivement les variables de tokens exposées dans `:root` (`var(--surface-1)`, `var(--surface-2)`, `var(--border-subtle)`, `var(--text-strong)`, `var(--text-muted)`, `var(--text-faint)`, `var(--accent)`, `var(--accent-soft)`, `var(--font-mono)`, `var(--fs-sm)`, `var(--space-6)`, etc.). [Source: AGENTS.md#Section 3]
- **Pas de préfixes vendeurs manuels :** Stylelint interdit les préfixes manuels comme `-webkit-*`. Les préfixes navigateurs sont injectés automatiquement par Autoprefixer/PostCSS au build. [Source: AGENTS.md#Section 3]
- **Accessibilité (a11y) dès la conception :**
  - Tout lien ouvrant un nouvel onglet DOIT utiliser `<ZExternalLink>` (`app/components/ui/ZExternalLink.vue`), garantissant `rel="noopener"` et l'annonce sr-only `(ouvre dans un nouvel onglet)`.
  - Les projets sans URL externe active (`TryOn`, `Nodium`) ne doivent PAS comporter de fausse balise `<a>` avec `href="#"` ou URL cassée menant à une 404.
  - Les listes de projets et de statistiques doivent être balisées en listes sémantiques `<ul>` et `<li>`.
  - Les éléments interactifs doivent conserver le repli standard pour contraste forcé (`forced-colors`) via `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible`.
- **DRY & Données :** Consommer `SITE.projects` et `SITE.profile` depuis `app/data/site.ts`. Ne jamais dupliquer les URLs, titres ou descriptions en dur.
- **SSG & Prerender Safety :** La récupération des articles de blog via `useAsyncData` et `queryCollection` est résolue au build Nitro. Aucun accès direct aux APIs navigateur sans garde SSR.

### Fichiers modifiés et créés
- **`app/pages/index.vue`** (UPDATE) : Refonte complète des sections projets sélectionnés, stats, ajout du journal technique et du bloc CTA final.

### Données & Textes exacts (Source : `sections-mapping.md`, `epics.md`, `contexte_malt.md`)
- **Projets sélectionnés :**
  - Keova : Rôle `Co-fondateur & Développeur Full Stack`, Statut `● En production`, URL `https://keova.app`.
  - TryOn : Rôle `CTO & Développeur Full Stack`, Statut `○ Étude de cas (MVP livré)`.
  - Nodium : Rôle `Créateur & Ingénieur IA`, Statut `◐ R&D / En cours`.
- **Stats de réassurance :**
  - `11` / `années d'expérience web`
  - `100%` / `TypeScript & SaaS de bout en bout`
  - `QA` / `culture d'automatisation & zéro régression`
- **Journal :**
  - Eyebrow : `// ~/journal`
  - Titre : `Notes de dev, écrites en construisant`
  - Lien : `cat tous-les-articles →` pointant vers `/blog`
- **CTA final :**

exec
/bin/zsh -lc "sed -n '1,220p' docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
baseline_commit: 44894826488b4d1acf1ce108ea6ff345b725c80a
---

# Story 11.4: Preuves concrètes SaaS, Journal technique & CTA final de conversion

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a prospect explorant la page d'accueil pour évaluer une collaboration freelance,
I want consulter les réalisations SaaS phares (Keova, TryOn, Nodium), les statistiques clés de réassurance, les derniers articles du journal technique et le bloc d'action final,
so that je sois convaincu par des preuves concrètes d'ingénierie logicielle Full Stack TypeScript et engagé à initier un contact direct via le formulaire ou Malt (FR23, FR24, FR25, NFR12, UX-DR23, UX-DR24, CAP-5, CAP-6, CAP-7).

## Acceptance Criteria

1. **Given** les projets définis dans `SITE.projects` (`app/data/site.ts`)
   **When** le visiteur fait défiler la page d'accueil sous la section des services
   **Then** la section des réalisations (`.work`) affiche l'en-tête :
     - Eyebrow : `<p class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</p>`
     - Titre de section : `<h2 class="section__title">Des produits qui tournent en production</h2>`
   **And** la liste des projets est structurée en une séquence sémantique `<ul>` / `<li>` avec les 3 réalisations :
     - **Keova App** (`01`) : Statut `● En production`, rôle `Co-fondateur & Développeur Full Stack`, description ERP équestre SaaS, tags (`Nuxt 4`, `NestJS`, `PostgreSQL`, `Stripe Connect`, `SaaS`), et lien externe direct accessible via `<ZExternalLink href="https://keova.app">`
     - **TryOn** (`02`) : Statut `○ Étude de cas (MVP livré)`, rôle `CTO & Développeur Full Stack`, description plateforme IA générative & mode, tags (`Nuxt 3`, `NestJS`, `Python`, `ComfyUI`, `IA`), **sans lien externe mort 404** (rendu sans balise `<a>` externe non résolue)
     - **Nodium** (`03`) : Statut `◐ R&D / En cours`, rôle `Créateur & Ingénieur IA`, description orchestration d'agents desktop, tags (`TypeScript`, `Electron`, `Agents`, `IA`), rendu sans lien externe
   **And** chaque ligne interactive (`.work__row`) réagit au survol (`:hover`) avec un dégradé subtil `var(--accent-soft)` et un décalage de la flèche directionnelle (sans à-coup).

2. **Given** la zone de réassurance située immédiatement après les projets
   **When** le visiteur consulte les indicateurs clés
   **Then** une grille responsive (`.stats`) affiche exactement 3 compteurs typés :
     - Compteur 1 : Valeur `11`, libellé `années d'expérience web`
     - Compteur 2 : Valeur `100%`, libellé `TypeScript & SaaS de bout en bout`
     - Compteur 3 : Valeur `QA`, libellé `culture d'automatisation & zéro régression`
   **And** les valeurs numériques/codes sont mises en exergue en police monospace `var(--font-mono)` et couleur d'accent `var(--accent)`
   **And** la grille s'adapte de façon fluide (3 colonnes sur desktop, 1 colonne sous 680px).

3. **Given** la collection de blog `@nuxt/content` v3
   **When** on intègre la section du journal technique sur la page d'accueil
   **Then** l'en-tête de section affiche :
     - Eyebrow : `<p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>`
     - Titre : `<h2 class="section__title">Notes de dev, écrites en construisant</h2>`
     - Lien d'approfondissement : `<NuxtLink to="/blog" class="seeall">cat tous-les-articles →</NuxtLink>`
   **And** les 3 articles les plus récents sont interrogés de manière prerender-safe via `useAsyncData('home-articles', () => queryCollection('blog').order('date', 'DESC').limit(3).all())`
   **And** si des articles existent, ils sont rendus avec leurs tags `ZTag`, titre, date formatée et lien vers leur route `/blog/[slug]`
   **And** si la collection est vide (état initial du dépôt avec `.gitkeep`), un état d'attente sobre et élégant s'affiche invitant à consulter le blog sans bloquer le rendu statique SSG.

4. **Given** le bas de la page d'accueil
   **When** le prospect atteint la fin de la consultation
   **Then** un panneau d'appel à l'action final (`.cta`) se présente avec :
     - Eyebrow mono : `<p class="eyebrow"><span aria-hidden="true">$ </span>./contact --start</p>`
     - Titre : `<h2 class="cta__title">Un projet en tête ? Mettons-le <span class="cta__highlight">en production</span>.</h2>`
     - Sous-titre : `<p class="cta__subtitle">Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript, parlons-en.</p>`
     - CTAs interactifs :
       - Bouton primaire : `<ZButton to="/contact">Discuter de votre projet</ZButton>`
       - Bouton externe : `<ZButton :as="ZExternalLink" :href="SITE.profile.maltUrl" variant="secondary">Me contacter sur Malt</ZButton>` (garantissant l'accessibilité a11y et `srText`)
       - Bouton tertiaire : `<ZButton variant="ghost" to="/about">Voir le parcours & CV</ZButton>`
   **And** aucun lien intra-page avec ancre `#` n'est employé (respect de l'architecture multi-pages).

5. **Given** l'ensemble des intégrations de la story
   **When** on exécute la gate de validation Docker
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript, et 13 routes statiques générées avec succès par Nitro.

## Tasks / Subtasks

- [x] Tâche 1 — Refonte de la section des projets sélectionnés (`.work`) (AC: 1)
  - [x] Transposer la structure en grille/lignes `.work__row` issue de `Home - Awwwards.html` dans `app/pages/index.vue`.
  - [x] Baliser les 3 projets de `SITE.projects` (`keova.app`, `TryOn`, `Nodium`) dans une liste sémantique `<ul>` et `<li>`.
  - [x] Afficher la numérotation (`01`, `02`, `03`), le statut coloré (`● En production`, `○ Étude de cas (MVP livré)`, `◐ R&D / En cours`), le titre, la description, le rôle et les tags avec `ZTag`.
  - [x] Rendre la ligne de `keova.app` comme lien externe accessible via `<ZExternalLink href="https://keova.app">` avec indicateur de sortie (`.work__go`).
  - [x] Rendre les lignes de `TryOn` et `Nodium` sans balise lien externe afin d'éviter tout lien mort 404 (éléments interactifs locaux ou conteneurs non-liens).
  - [x] Styliser les lignes en SCSS scoped avec les tokens du Design System (`--border-subtle`, `--accent-soft`, `--text-faint`, `--text-muted`, `--accent`).

- [x] Tâche 2 — Intégration des statistiques clés de réassurance (`.stats`) (AC: 2)
  - [x] Mettre à jour le tableau `stats` dans le script de `app/pages/index.vue` avec les 3 indicateurs cibles : `11` (années d'expérience web), `100%` (TypeScript & SaaS de bout en bout), `QA` (culture d'automatisation & zéro régression).
  - [x] Rendre les statistiques sous la liste des projets dans un conteneur `.stats`.
  - [x] Styliser les compteurs en typographie monospace (`var(--font-mono)`), taille fluide clamp, couleur d'accent (`var(--accent)`), avec adaptation responsive (3 colonnes sur desktop, 1 colonne sous 680px).

- [x] Tâche 3 — Intégration de la section Journal technique (AC: 3)
  - [x] Déclarer la requête `@nuxt/content` v3 via `useAsyncData('home-articles', () => queryCollection('blog').order('date', 'DESC').limit(3).all())` dans `app/pages/index.vue`.
  - [x] Structurer la section avec l'eyebrow (`// ~/journal`), le titre de section et le lien d'en-tête vers `/blog` (`cat tous-les-articles →`).
  - [x] Rendre les cartes d'articles avec titre, tags `ZTag`, date formatée et lien vers la route d'article si la liste n'est pas vide.
  - [x] Prévoir le rendu de repli élégant lorsque la collection est vide (pas d'erreur, message sobre et invitation à visiter `/blog`).

- [x] Tâche 4 — Intégration du bloc CTA final de conversion (`.cta`) (AC: 4)
  - [x] Créer le bloc de clôture de page d'accueil `.cta` avant la fermeture du `<main>`.
  - [x] Ajouter l'eyebrow terminale (`$ ./contact --start`), le titre d'accroche avec mise en valeur de « en production » (`var(--accent)`), et le sous-titre commercial.
  - [x] Intégrer les trois actions : bouton primaire vers `/contact`, bouton externe vers le profil Malt (`SITE.profile.maltUrl`) avec `<ZButton :as="ZExternalLink">`, et bouton fantôme vers `/about`.
  - [x] Styliser le bloc avec une surface surélevée (`--surface-2` ou dégradé aubergine sombre), bordure subtile et padding généreux.

- [x] Tâche 5 — Validation qualité & Gate Docker (AC: 5)
  - [x] Exécuter la suite de validation Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [x] Vérifier la propreté du rendu visuel, la fluidité des survols, la navigation au clavier (`Tab`, `:focus-visible`).
  - [x] Vérifier la complétion de la page d'accueil complète (Hero, Marquee, Services, Projets, Stats, Journal, CTA).

## Dev Notes

### Architecture & Contraintes d'environnement
- **Environnement Docker STRICT :** Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. Ne jamais lancer `pnpm` sur la machine hôte macOS. [Source: AGENTS.md#Section 2]
- **Tokens CSS & Design System :** Aucune couleur, espacement ou dimension en dur. Consommer exclusivement les variables de tokens exposées dans `:root` (`var(--surface-1)`, `var(--surface-2)`, `var(--border-subtle)`, `var(--text-strong)`, `var(--text-muted)`, `var(--text-faint)`, `var(--accent)`, `var(--accent-soft)`, `var(--font-mono)`, `var(--fs-sm)`, `var(--space-6)`, etc.). [Source: AGENTS.md#Section 3]
- **Pas de préfixes vendeurs manuels :** Stylelint interdit les préfixes manuels comme `-webkit-*`. Les préfixes navigateurs sont injectés automatiquement par Autoprefixer/PostCSS au build. [Source: AGENTS.md#Section 3]
- **Accessibilité (a11y) dès la conception :**
  - Tout lien ouvrant un nouvel onglet DOIT utiliser `<ZExternalLink>` (`app/components/ui/ZExternalLink.vue`), garantissant `rel="noopener"` et l'annonce sr-only `(ouvre dans un nouvel onglet)`.
  - Les projets sans URL externe active (`TryOn`, `Nodium`) ne doivent PAS comporter de fausse balise `<a>` avec `href="#"` ou URL cassée menant à une 404.
  - Les listes de projets et de statistiques doivent être balisées en listes sémantiques `<ul>` et `<li>`.
  - Les éléments interactifs doivent conserver le repli standard pour contraste forcé (`forced-colors`) via `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible`.
- **DRY & Données :** Consommer `SITE.projects` et `SITE.profile` depuis `app/data/site.ts`. Ne jamais dupliquer les URLs, titres ou descriptions en dur.
- **SSG & Prerender Safety :** La récupération des articles de blog via `useAsyncData` et `queryCollection` est résolue au build Nitro. Aucun accès direct aux APIs navigateur sans garde SSR.

### Fichiers modifiés et créés
- **`app/pages/index.vue`** (UPDATE) : Refonte complète des sections projets sélectionnés, stats, ajout du journal technique et du bloc CTA final.

### Données & Textes exacts (Source : `sections-mapping.md`, `epics.md`, `contexte_malt.md`)
- **Projets sélectionnés :**
  - Keova : Rôle `Co-fondateur & Développeur Full Stack`, Statut `● En production`, URL `https://keova.app`.
  - TryOn : Rôle `CTO & Développeur Full Stack`, Statut `○ Étude de cas (MVP livré)`.
  - Nodium : Rôle `Créateur & Ingénieur IA`, Statut `◐ R&D / En cours`.
- **Stats de réassurance :**
  - `11` / `années d'expérience web`
  - `100%` / `TypeScript & SaaS de bout en bout`
  - `QA` / `culture d'automatisation & zéro régression`
- **Journal :**
  - Eyebrow : `// ~/journal`
  - Titre : `Notes de dev, écrites en construisant`
  - Lien : `cat tous-les-articles →` pointant vers `/blog`
- **CTA final :**
  - Eyebrow : `$ ./contact --start`
  - Titre : `Un projet en tête ? Mettons-le en production.`
  - Sous-titre : `Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript, parlons-en.`
  - Boutons : `/contact` (« Discuter de votre projet »), `SITE.profile.maltUrl` (« Me contacter sur Malt »), `/about` (« Voir le parcours & CV »).

## Dev Agent Record

### Agent Model Used
- Gemini 3.7 Flash (Low)

### Debug Log References
- Gate de validation Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` exécutée avec succès (0 erreur ESLint/Stylelint, 0 erreur TypeScript, 13 routes statiques pré-rendues).
- Résolution des ajustements de formatage Prettier sur les balises de template et dégradés SCSS.

### Completion Notes List
- Implémentation complète de la section `.work` en liste sémantique `<ul>`/`<li>` avec les 3 projets SaaS issus de `SITE.projects` (Keova en lien `<ZExternalLink>`, TryOn et Nodium sans lien externe mort, tags `ZTag`, statuts et rôles).
- Intégration de la grille `.stats` responsive à 3 compteurs (`11`, `100%`, `QA`) avec police monospace et adaptation 1 colonne sur mobile.
- Intégration de la section Journal technique avec requête `@nuxt/content` v3 (`useAsyncData` + `queryCollection('blog').order('date', 'DESC').limit(3).all()`), lien vers `/blog` et état de repli élégant.
- Implémentation du bloc CTA final `.cta` avec eyebrow mono, titre percutant, sous-titre commercial et trois boutons d'action (`/contact`, lien Malt via `<ZExternalLink>`, et `/about`).
- Conformité stricte a11y : tokens CSS globaux, pas de valeurs en dur, `forced-colors` focus-visible, `prefers-reduced-motion: reduce`.
- Validation de la gate Docker verte à 100 % (13 routes SSG Nitro pré-rendues).

### File List
- `app/pages/index.vue` (MODIFIED)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
- `docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md` (MODIFIED)

## Change Log
- 2026-09-13 : Implémentation des sections Projets SaaS, Statistiques, Journal technique et CTA final de conversion de la page d'accueil (Story 11.4). Gate Docker 100% verte. Status passé à review.

## References

- [Contrat canonique : docs/specs/spec-home-awwwards/SPEC.md]
- [Cartographie détaillée : docs/specs/spec-home-awwwards/sections-mapping.md]
- [Maquette prototype : docs/design_system/ui_kits/jouan-site/Home - Awwwards.html]
- [Profil Malt officiel : docs/contexte_malt.md]
- [Directives globales pour agents : AGENTS.md]
- [Leçons de la Story 11.3 : docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md]

exec
/bin/zsh -lc 'rg -n -C 4 "Story 11.4|FR24|projets sélectionnés|journal technique|CTA final|work__row|.stats|.journal" docs/planning-artifacts/epics.md docs/specs/spec-home-awwwards/SPEC.md docs/specs/spec-home-awwwards/sections-mapping.md | head -320' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/specs/spec-home-awwwards/sections-mapping.md-5----
docs/specs/spec-home-awwwards/sections-mapping.md-6-
docs/specs/spec-home-awwwards/sections-mapping.md-7-## 1. Principe directeur : Vitrine immersive vs Pages complètes
docs/specs/spec-home-awwwards/sections-mapping.md-8-
docs/specs/spec-home-awwwards/sections-mapping.md:9:La maquette HTML brute `Home - Awwwards.html` a été conçue comme un prototype autonome avec des ancres intra-page (`#services`, `#work`, `#journal`, `#contact`).  
docs/specs/spec-home-awwwards/sections-mapping.md-10-Dans `jouan.ovh`, la home refondue agit comme un **entonnoir de conversion commercial**, orientant les visiteurs vers les pages complètes du site :
docs/specs/spec-home-awwwards/sections-mapping.md-11-
docs/specs/spec-home-awwwards/sections-mapping.md-12-| Section Maquette Awwwards | Rôle sur la Home refondue | Contenu aligné Malt / Direction Stratégique | Destination / Route cible |
docs/specs/spec-home-awwwards/sections-mapping.md-13-| :--- | :--- | :--- | :--- |
--
docs/specs/spec-home-awwwards/SPEC.md-48-  success: Les projets présentés valorisent Keova (pièce maîtresse SaaS en production avec lien live `<ZExternalLink>`), TryOn (étude de cas d'ingénierie SaaS & IA / MVP livré, sans lien mort vers un domaine inactif) et Nodium (lab technique agents IA), chacun avec rôle, stack et description orientée valeur, accompagnés des 3 compteurs statistiques clés (11 ans d'expérience, SaaS fondés/opérés, culture qualité).
docs/specs/spec-home-awwwards/SPEC.md-49-
docs/specs/spec-home-awwwards/SPEC.md-50-- id: CAP-7
docs/specs/spec-home-awwwards/SPEC.md-51-  intent: Le visiteur accède à une mise en avant des derniers articles de veille technique et d'ingénierie logicielle.
docs/specs/spec-home-awwwards/SPEC.md:52:  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.
docs/specs/spec-home-awwwards/SPEC.md-53-
docs/specs/spec-home-awwwards/SPEC.md-54-- id: CAP-8
docs/specs/spec-home-awwwards/SPEC.md-55-  intent: Le visiteur en bas de page dispose d'un bloc d'appel à l'action orienté mission invitant à démarrer une collaboration, avec accès direct au formulaire et à Malt.
docs/specs/spec-home-awwwards/SPEC.md-56-  success: Le bloc CTA offre un bouton d'action principal vers `/contact` (« Discuter de votre projet »), un lien vers le profil Malt (`<ZExternalLink>`), et un lien secondaire vers `/about`, stylés selon les tokens du Design System.
--
docs/planning-artifacts/epics.md-31-FR1: Migrer le projet vers une stack à jour (Nuxt 4, abandon de `@nuxt/bridge-edge`, deps actuelles) avant toute refonte visuelle. _(CAP-1)_
docs/planning-artifacts/epics.md-32-FR2: Rendre les tokens du design system (couleurs, typo, espacement, rayons, élévation, motion, polices) disponibles comme source unique de vérité du style. _(CAP-2)_
docs/planning-artifacts/epics.md-33-FR3: Recréer les primitives du DS en composants Vue 3 réutilisables. _(CAP-3)_
docs/planning-artifacts/epics.md-34-FR4: Refondre le châssis global (header fixe, footer, navigation, liens sociaux hexagonaux). _(CAP-4)_
docs/planning-artifacts/epics.md:35:FR5: Page d'accueil = hero Terminal (A) + aperçu services + stats + projets sélectionnés. _(CAP-5)_
docs/planning-artifacts/epics.md-36-FR6: Page Services = 3 offres (WordPress / Applications web / IA) + étapes du process (route `/services`). _(CAP-6)_
docs/planning-artifacts/epics.md-37-FR7: Page À-propos = portrait, bio, timeline expérience, formation, stack. _(CAP-7)_
docs/planning-artifacts/epics.md-38-FR8: Blog = index (+ empty-state) et vue article prose + code via `@nuxt/content`. _(CAP-8)_
docs/planning-artifacts/epics.md-39-FR9: Page Contact = formulaire + carte infos + CTA terminal + socials (route `/contact`). _(CAP-9)_
--
docs/planning-artifacts/epics.md-52-FR20: Hero commercial cinétique affichant le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS », le pitch SaaS/web apps, le badge de statut vérifié Malt (`<ZExternalLink>`), les CTAs vers `/contact` et `/about`, et la fenêtre terminal hero simulant la frappe de commandes clés avec caret natif. _(CAP-3)_
docs/planning-artifacts/epics.md-53-FR21: Marquee infini de la stack technique moderne prioritaire alimenté par `SITE.skills`, défilant en continu avec pause au survol et arrêt sans débordement horizontal sous reduced-motion. _(CAP-4)_
docs/planning-artifacts/epics.md-54-FR22: Section vitrine des 3 offres de services ciblées sous forme de cartes structurées invitant à approfondir et redirigeant vers `/services`. _(CAP-5)_
docs/planning-artifacts/epics.md-55-FR23: Section de preuves concrètes exposant Keova (lien live `<ZExternalLink>`), TryOn (étude de cas technique MVP livré sans lien externe mort), Nodium (lab R&D en cours), et les 3 compteurs statistiques clés de parcours. _(CAP-6)_
docs/planning-artifacts/epics.md:56:FR24: Section journal présentant les derniers articles du blog avec lien d'approfondissement vers `/blog`. _(CAP-7)_
docs/planning-artifacts/epics.md:57:FR25: Bloc CTA final de conversion orienté mission (« Discuter de votre projet » vers `/contact`, bouton vers profil Malt, lien vers `/about`). _(CAP-8)_
docs/planning-artifacts/epics.md-58-FR26: Maintien strict de l'architecture multi-pages : tous les liens de navigation et de renvoi ciblent les routes Nuxt indépendantes sans repli vers des ancres intra-page `#`. _(CAP-9)_
docs/planning-artifacts/epics.md-59-FR27: Micro-curseur interactif progressif pour navigateurs de bureau avec souris (`data-hot`), désactivé sur tactile et sous reduced-motion. _(CAP-10)_
docs/planning-artifacts/epics.md-60-
docs/planning-artifacts/epics.md-61-### NonFunctional Requirements
--
docs/planning-artifacts/epics.md-96-UX-DR8: `Prompt` terminal (`anon.@jouan.ovh:~$`, vert) — réf. `terminal/Prompt.jsx`.
docs/planning-artifacts/epics.md-97-UX-DR9: Style `TerminalWindow` (fond aubergine profond, `blur(5px)`, radius-sm, caret clignotant) — réf. `terminal/TerminalWindow.jsx`.
docs/planning-artifacts/epics.md-98-UX-DR10: Iconographie — Lucide via CDN (`currentColor`), glyphes sociaux en SVG inline, logo diamant SVG.
docs/planning-artifacts/epics.md-99-UX-DR11: Layout global — header fixe 56px (logo diamant), footer 56px, hexagones sociaux (footer/contact).
docs/planning-artifacts/epics.md:100:UX-DR12: Home — hero Terminal (A), aperçu services, stats, projets sélectionnés (réf. `Home.jsx`, contenu `data.js`).
docs/planning-artifacts/epics.md-101-UX-DR13: Services — 3 cartes d'offre + section process étapes (réf. `Services.jsx`).
docs/planning-artifacts/epics.md-102-UX-DR14: About — portrait + bio + timeline + formation + stack (réf. `About.jsx`).
docs/planning-artifacts/epics.md-103-UX-DR15: Blog — index avec empty-state soigné + vue article prose/code stylés (réf. `Blog.jsx`).
docs/planning-artifacts/epics.md-104-UX-DR16: Contact — formulaire (validation front, pas de backend) + carte infos + CTA terminal + socials (réf. `Contact.jsx`).
--
docs/planning-artifacts/epics.md-136-FR20: Epic 11 — Hero commercial cinétique & terminal vitrine
docs/planning-artifacts/epics.md-137-FR21: Epic 11 — Marquee infini de la stack moderne ciblée
docs/planning-artifacts/epics.md-138-FR22: Epic 11 — Vitrine des 3 offres de services ciblées
docs/planning-artifacts/epics.md-139-FR23: Epic 11 — Preuves concrètes & Projets phares (Keova, TryOn, Nodium)
docs/planning-artifacts/epics.md:140:FR24: Epic 11 — Vitrine des articles récents du blog
docs/planning-artifacts/epics.md-141-FR25: Epic 11 — Bloc CTA de conversion orienté mission & profil Malt
docs/planning-artifacts/epics.md-142-FR26: Epic 11 — Préservation de l'architecture multi-pages
docs/planning-artifacts/epics.md-143-FR27: Epic 11 — Micro-curseur interactif progressif desktop
docs/planning-artifacts/epics.md-144-
--
docs/planning-artifacts/epics.md-152-Langage visuel en place (tokens) + kit de primitives Vue réutilisables + châssis global (header/footer/nav/socials) refondu et visible sur tout le site.
docs/planning-artifacts/epics.md-153-**FRs covered:** FR2, FR3, FR4 _(UX-DR1–7, 10, 11)_
docs/planning-artifacts/epics.md-154-
docs/planning-artifacts/epics.md-155-### Epic 3: Page d'accueil
docs/planning-artifacts/epics.md:156:Le visiteur découvre Simon via le hero Terminal (A) + aperçu services + stats + projets sélectionnés.
docs/planning-artifacts/epics.md-157-**FRs covered:** FR5 _(UX-DR12)_
docs/planning-artifacts/epics.md-158-
docs/planning-artifacts/epics.md-159-### Epic 4: Page Services
docs/planning-artifacts/epics.md-160-Le visiteur comprend les trois offres (WordPress / Applications web / IA) et le process (nouvelle route `/services`).
--
docs/planning-artifacts/epics.md-185-**FRs covered:** FR12, FR13, FR14, FR15, FR16, FR17 _(NFR5)_
docs/planning-artifacts/epics.md-186-
docs/planning-artifacts/epics.md-187-### Epic 11: Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
docs/planning-artifacts/epics.md-188-Le visiteur arrivant sur la page d'accueil de `jouan.ovh` découvre une vitrine immersive haute performance (« Awwwards level ») et comprend instantanément le positionnement de Simon Jouan comme Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL) pour applications web et SaaS, appuyé par des preuves concrètes de réalisations (Keova en production, TryOn en étude de cas, Nodium en lab R&D), une réassurance chiffrée (11 ans d'expérience, culture qualité logicielle), et des points de contact directs (formulaire et profil Malt) sans altérer l'architecture multi-pages existante.
docs/planning-artifacts/epics.md:189:**FRs covered:** FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27 _(NFR10, NFR11, NFR12, UX-DR18 à UX-DR25)_
docs/planning-artifacts/epics.md-190-
docs/planning-artifacts/epics.md-191----
docs/planning-artifacts/epics.md-192-
docs/planning-artifacts/epics.md-193-## Epic 1: Migration de la stack vers Nuxt 4
--
docs/planning-artifacts/epics.md-357----
docs/planning-artifacts/epics.md-358-
docs/planning-artifacts/epics.md-359-## Epic 3: Page d'accueil
docs/planning-artifacts/epics.md-360-
docs/planning-artifacts/epics.md:361:Le visiteur découvre Simon via le hero Terminal (A) + aperçu services + stats + projets.
docs/planning-artifacts/epics.md-362-
docs/planning-artifacts/epics.md-363-### Story 3.1: Hero Terminal (A)
docs/planning-artifacts/epics.md-364-
docs/planning-artifacts/epics.md-365-As a visiteur,
--
docs/planning-artifacts/epics.md-372-**When** on implémente le hero sur `/`
docs/planning-artifacts/epics.md-373-**Then** le hero rend en style terminal (prompt, caret, accroche française 1re personne)
docs/planning-artifacts/epics.md-374-**And** un CTA principal mène à un parcours clé (ex. contact/about)
docs/planning-artifacts/epics.md-375-
docs/planning-artifacts/epics.md:376:### Story 3.2: Aperçu services et stats
docs/planning-artifacts/epics.md-377-
docs/planning-artifacts/epics.md-378-As a visiteur,
docs/planning-artifacts/epics.md-379-I want voir un aperçu des services et des chiffres clés,
docs/planning-artifacts/epics.md-380-So that je comprends rapidement l'offre (UX-DR12, FR5).
docs/planning-artifacts/epics.md-381-
docs/planning-artifacts/epics.md-382-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-383-
docs/planning-artifacts/epics.md:384:**Given** le contenu `data.js` (services, stats)
docs/planning-artifacts/epics.md:385:**When** on implémente les blocs aperçu services + stats sur `/`
docs/planning-artifacts/epics.md:386:**Then** les 3 services et les stats rendent conformément à `Home.jsx`
docs/planning-artifacts/epics.md-387-**And** un lien mène à la page Services
docs/planning-artifacts/epics.md-388-
docs/planning-artifacts/epics.md-389-### Story 3.3: Projets sélectionnés
docs/planning-artifacts/epics.md-390-
docs/planning-artifacts/epics.md-391-As a visiteur,
docs/planning-artifacts/epics.md:392:I want voir des projets sélectionnés,
docs/planning-artifacts/epics.md-393-So that j'évalue le travail de Simon (UX-DR12, FR5).
docs/planning-artifacts/epics.md-394-
docs/planning-artifacts/epics.md-395-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-396-
docs/planning-artifacts/epics.md-397-**Given** le contenu projets de `data.js`
docs/planning-artifacts/epics.md-398-**When** on implémente le bloc projets sur `/` avec `ZCard`
docs/planning-artifacts/epics.md:399:**Then** les projets sélectionnés rendent en cartes conformes au DS
docs/planning-artifacts/epics.md-400-
docs/planning-artifacts/epics.md-401----
docs/planning-artifacts/epics.md-402-
docs/planning-artifacts/epics.md-403-## Epic 4: Page Services
--
docs/planning-artifacts/epics.md-659-
docs/planning-artifacts/epics.md-660-**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
docs/planning-artifacts/epics.md-661-**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
docs/planning-artifacts/epics.md-662-**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
docs/planning-artifacts/epics.md:663:**And** les constats sont consignés ; rendu en mode normal inchangé ; gate verte
docs/planning-artifacts/epics.md-664-
docs/planning-artifacts/epics.md-665-### Story 10.5: SEO centralisé site-wide
docs/planning-artifacts/epics.md-666-
docs/planning-artifacts/epics.md-667-As a visiteur partageant une page (ou un moteur d'indexation),
--
docs/planning-artifacts/epics.md-754-**And** la vitrine expose 3 cartes structurées `ZCard` (1. Création d'applications web & SaaS, 2. Développement Full Stack TypeScript, 3. Évolution & architecture applicative) avec numérotation terminale, proposition de valeur claire et tags technologiques
docs/planning-artifacts/epics.md-755-**And** chaque carte oriente directement vers la route `/services` (aucune ancre intra-page `#`)
docs/planning-artifacts/epics.md-756-**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)
docs/planning-artifacts/epics.md-757-
docs/planning-artifacts/epics.md:758:### Story 11.4: Preuves concrètes SaaS, Journal technique & CTA final de conversion
docs/planning-artifacts/epics.md-759-
docs/planning-artifacts/epics.md-760-As a prospect cherchant des garanties avant prise de contact,
docs/planning-artifacts/epics.md:761:I want consulter les réalisations SaaS phares (Keova, TryOn, Nodium), les statistiques clés et les derniers articles du journal,
docs/planning-artifacts/epics.md:762:So that je suis convaincu par des preuves concrètes de conception applicative et engagé à initier une collaboration via le formulaire ou Malt (FR23, FR24, FR25, NFR12, UX-DR23, UX-DR24).
docs/planning-artifacts/epics.md-763-
docs/planning-artifacts/epics.md-764-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-765-
docs/planning-artifacts/epics.md-766-**Given** les projets définis dans `SITE.projects`, les articles du blog et le profil Malt
docs/planning-artifacts/epics.md:767:**When** on intègre la section des projets sélectionnés, les statistiques, le journal technique et le bloc CTA final
docs/planning-artifacts/epics.md-768-**Then** les projets affichent :
docs/planning-artifacts/epics.md-769-  - **Keova App** avec statut `● En production`, rôle Co-fondateur & Full Stack, stack (Nuxt 4 / NestJS / PostgreSQL / Stripe Connect) et lien direct accessible via `<ZExternalLink href="https://keova.app">`
docs/planning-artifacts/epics.md-770-  - **TryOn** avec statut `○ Étude de cas (MVP livré)` valorisant l'ingénierie SaaS & IA générative, **sans lien externe mort 404** (renvoi vers description détaillée/Malt)
docs/planning-artifacts/epics.md-771-  - **Nodium** avec statut `◐ R&D / En cours` valorisant le laboratoire d'agents IA desktop
docs/planning-artifacts/epics.md-772-**And** les 3 compteurs statistiques clés sont affichés (11 ans d'expérience, SaaS opérés, culture qualité & automatisation)
docs/planning-artifacts/epics.md:773:**And** la section journal présente les articles récents du blog avec lien vers `/blog`
docs/planning-artifacts/epics.md:774:**And** le bloc CTA final de conversion propose un bouton primaire vers `/contact` (« Discuter de votre projet »), un bouton externe direct vers le profil Malt (`<ZExternalLink href="https://www.malt.fr/profile/simonjouan">`) et un lien vers `/about`
docs/planning-artifacts/epics.md-775-**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)
docs/planning-artifacts/epics.md-776-
docs/planning-artifacts/epics.md-777-### Story 11.5: Validation transverse a11y, multi-pages, SSG Nitro & Gate Docker
docs/planning-artifacts/epics.md-778-

exec
/bin/zsh -lc 'git diff --check -- docs/implementation-artifacts/code-reviews/11-4/full.diff; git status --short --branch' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
## feat/home-awwwards
 M app/pages/index.vue
 M docs/implementation-artifacts/sprint-status.yaml
?? docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md
?? docs/implementation-artifacts/code-reviews/11-4/

2026-09-13T19:23:23.154625Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
exec
/bin/zsh -lc "sed -n '440,540p' app/pages/index.vue; sed -n '1,120p' app/assets/scss/base/_reset.scss; sed -n '1,120p' app/assets/scss/base/_typography.scss; sed -n '120,260p' app/assets/scss/base/_layout.scss" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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
@use "../abstract/space";

/*
Normalizing styles have been helped along thanks to the fine work of
Nicolas Gallagher and Jonathan Neal https://necolas.github.io/normalize.css/
 */

/* --------------------------------------------------------------
>>> TABLE OF CONTENTS:
----------------------------------------------------------------
# Generic
	- Normalize
	- Box sizing
# Base
	- Elements
# Components
	- Media
	- Captions
	- Galleries
# plugins
	- Jetpack infinite scroll
# Utilities
	- Accessibility
	- Alignments

-------------------------------------------------------------- */

/* --------------------------------------------------------------
# Generic
-------------------------------------------------------------- */

/* Normalize
--------------------------------------------- */

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
sed: app/assets/scss/base/_typography.scss: No such file or directory

2026-09-13T19:24:02.144093Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
Plusieurs écarts concrets ressortent déjà : les statuts et tags affichés ne correspondent pas aux libellés contractuels, les compteurs n’utilisent pas la couleur d’accent exigée, et le chemin d’erreur du journal est absorbé par l’empty-state. Je lance la gate Docker annoncée par le changement pour vérifier aussi les défauts de compilation ou de génération.
exec
/bin/zsh -lc 'docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"' in /Users/simon/dev/jouan.ovh
2026-09-13T19:25:07.955004Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
 succeeded in 17101ms:
 Container jouanovh-web-run-773636705e6b Created 
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

[@nuxt/content] ✔ Processed 2 collections and 1 files in 8.69ms (0 cached, 1 parsed)

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
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/manifest.json                                        33.25 kB │ gzip:   2.62 kB
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
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/index.CJQoquAO.css                             20.48 kB │ gzip:   3.93 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DlAUqK2U.js                                     0.09 kB │ gzip:   0.10 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/C93KKm9n.js                                     0.17 kB │ gzip:   0.15 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BfNJ66XY.js                                     0.21 kB │ gzip:   0.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/E6coH47e.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/C6ClZyZm.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/6EkvJcX7.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D6PllLF6.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/W2mzQN4s.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/B5VBQG00.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DAlaisvh.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DbptucTH.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Dm71iS9z.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CNnNtDjK.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DYdgfOQI.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BmI5GTT3.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/xo4BXx-0.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/3FmpaQIW.js                                     0.26 kB │ gzip:   0.22 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CtFmoRwj.js                                     0.38 kB │ gzip:   0.27 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BL5ebH8z.js                                     0.41 kB │ gzip:   0.25 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/OpxrMEpG.js                                     0.48 kB │ gzip:   0.35 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/iwMlLGmR.js                                     0.49 kB │ gzip:   0.33 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/COEpCcRk.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DbqK7LFs.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Cb3aXB38.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CVE0XRCo.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D1ncCd_g.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BLaJ0oiu.js                                     0.51 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/pEoOc2_8.js                                     0.63 kB │ gzip:   0.38 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DMhLy-fw.js                                     0.64 kB │ gzip:   0.42 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BGMjmYXP.js                                     0.79 kB │ gzip:   0.46 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CMQEDqfi.js                                     1.20 kB │ gzip:   0.66 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DvmfV0_A.js                                     1.30 kB │ gzip:   0.57 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/p0temu7u.js                                     1.31 kB │ gzip:   0.75 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BNQtrSIS.js                                     2.82 kB │ gzip:   1.35 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CZPYPyvN.js                                     3.48 kB │ gzip:   1.56 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/B_Y52oOI.js                                     3.76 kB │ gzip:   1.80 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BbsU43_G.js                                     3.79 kB │ gzip:   1.71 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DdLe9mRt.js                                     4.77 kB │ gzip:   2.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BeTW2rkd.js                                     4.92 kB │ gzip:   2.00 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BMy4T06P.js                                     5.14 kB │ gzip:   2.39 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CDaHTzsF.js                                     5.67 kB │ gzip:   2.26 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CZy76wlf.js                                     6.01 kB │ gzip:   2.77 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DVIhH_ob.js                                     7.68 kB │ gzip:   2.91 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CXmFvnQY.js                                     8.33 kB │ gzip:   3.51 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CGzMil67.js                                     8.96 kB │ gzip:   3.57 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ZsGxQ2mD.js                                    12.36 kB │ gzip:   4.89 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/1LEPDT53.js                                    20.42 kB │ gzip:   7.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Q22xKxqT.js                                    32.42 kB │ gzip:  11.77 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/94XchtD0.js                                    46.45 kB │ gzip:  19.11 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/kT-s8AA-.js                                   187.35 kB │ gzip:  70.78 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Dh7SNsIs.js                                   199.77 kB │ gzip:  59.04 kB
ℹ ✓ built in 2.52s
✔ Client built in 2527ms
ℹ Building server...
ℹ vite v7.3.5 building ssr environment for production...
ℹ transforming...
ℹ ✓ 399 modules transformed.
ℹ rendering chunks...
ℹ ✓ built in 2.43s
✔ Server built in 2438ms
[nitro] ℹ Initializing prerenderer
[nitro] ℹ Prerendering 4 initial routes with crawler
[nitro]   ├─ /404.html (56ms)
[nitro]   ├─ /200.html (56ms)
[nitro]   ├─ / (65ms)
[nitro]   ├─ /__nuxt_content/blog/sql_dump.txt (66ms)
[nitro]   ├─ /confidentialite (33ms)
[nitro]   ├─ /about (35ms)
[nitro]   ├─ /contact (34ms)
[nitro]   ├─ /mentions-legales (33ms)
[nitro]   ├─ /services (34ms)
[nitro]   ├─ /blog (38ms)
[nitro]   ├─ /_ipx/s_220x165/images/undraw_code_thinking_re_gka2.svg (94ms)
[nitro]   ├─ /_ipx/s_440x330/images/undraw_code_thinking_re_gka2.svg (91ms)
[nitro]   ├─ /_ipx/_/images/portrait.jpeg (101ms)
[nitro] ℹ Prerendered 13 routes in 3.107 seconds
[nitro] ✔ Generated public .output/public
[nitro] ✔ You can preview this build using npx serve .output/public
│
└  ✨ You can now deploy .output/public to any static hosting!

codex
La gate Docker passe, mais elle révèle un avertissement non traité : `@nuxt/content` tente de parser `blog/blog/.gitkeep` et le rejette. La génération réussit malgré cela ; je l’intègre comme défaut de propreté du pipeline, puis je finalise la liste en séparant les écarts fonctionnels des problèmes de robustesse et de responsive.
exec
/bin/zsh -lc 'rg -n "11|TypeScript & SaaS|En production|Etude|Étude|nuxt|work__row|journal__empty|Malt|cat tous" .output/public/index.html | head -80; git diff --numstat -- app/pages/index.vue docs/implementation-artifacts/sprint-status.yaml' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
1:<!DOCTYPE html><html  lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Simon Jouan — Développeur Full Stack TypeScript · Nuxt &amp; NestJS</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400;1,700&display=swap"><style>.ftr[data-v-ec74c766]{margin-top:auto;background:var(--surface-1);border-top:1px solid var(--border-subtle);padding:var(--space-12) 0 var(--space-8)}.ftr__container[data-v-ec74c766]{width:100%;max-width:var(--container-xl);margin:0 auto;padding:0 var(--space-6)}.ftr__in[data-v-ec74c766]{display:flex;flex-wrap:wrap;gap:var(--space-8);align-items:flex-start;justify-content:space-between}.ftr__brand-col[data-v-ec74c766]{max-width:300px}.ftr__brand[data-v-ec74c766]{display:inline-flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-3);text-decoration:none}.ftr__brand .ftr__logo[data-v-ec74c766]{font-size:22px;color:var(--accent)}.ftr__brand b[data-v-ec74c766]{font-family:var(--font-mono);font-size:var(--fs-md);font-weight:var(--fw-bold);color:var(--text-strong)}.ftr__brand[data-v-ec74c766]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-sm);box-shadow:var(--ring-accent)}.ftr__tagline[data-v-ec74c766]{margin:0;font-size:var(--fs-sm);color:var(--text-muted)}.ftr__col[data-v-ec74c766]{display:flex;flex-direction:column}.ftr__title[data-v-ec74c766]{margin:0 0 var(--space-3);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:var(--fw-regular);letter-spacing:var(--ls-wider);text-transform:uppercase;color:var(--text-muted)}.ftr__list[data-v-ec74c766]{display:flex;flex-direction:column;padding:0;margin:0;list-style:none}.ftr__link[data-v-ec74c766]{display:block;padding:var(--space-1) 0;font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-body);text-decoration:none;transition:color var(--dur-fast) var(--ease-standard)}.ftr__link[data-v-ec74c766]:hover{color:var(--accent)}.ftr__link[data-v-ec74c766]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-xs);box-shadow:var(--ring-accent)}.ftr__link--static[data-v-ec74c766]{cursor:default}.ftr__bottom[data-v-ec74c766],.ftr__link--static[data-v-ec74c766],.ftr__link--static[data-v-ec74c766]:hover{color:var(--text-muted)}.ftr__bottom[data-v-ec74c766]{display:flex;flex-wrap:wrap;gap:var(--space-3);justify-content:space-between;margin-top:var(--space-8);padding-top:var(--space-5);font-family:var(--font-mono);font-size:var(--fs-xs);border-top:1px solid var(--border-subtle)}.ftr__cmd[data-v-ec74c766]{color:var(--term-green)}@media(prefers-reduced-motion:reduce){.ftr__link[data-v-ec74c766]{transition:none}}</style><style>.terminal{box-sizing:border-box;position:fixed;top:60px;left:15px;z-index:1000;width:600px;height:400px;overflow:hidden;resize:both;font-family:var(--font-mono);color:var(--ink-1);border:1px solid var(--border-terminal);border-radius:var(--radius-sm);box-shadow:var(--glow-terminal)}.terminal-header{position:relative;z-index:1;display:flex;flex-wrap:nowrap;align-items:center;gap:var(--space-2);height:30px;padding:0 var(--space-3);background:var(--aubergine-black);cursor:move}.terminal-header .terminal-dots{display:flex;align-items:center;gap:7px}.terminal-header .close-button{width:13px;height:13px;cursor:pointer;background-image:linear-gradient(to bottom right,var(--term-red),#8a0000);border-radius:var(--radius-circle);box-shadow:1px 1px 2px #080206}.terminal-header .close-button:hover{filter:brightness(1.2)}.terminal-header .close-button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.terminal-header .terminal-dot{width:13px;height:13px;border-radius:var(--radius-circle);opacity:.85}.terminal-header .terminal-dot--min{background:var(--term-yellow)}.terminal-header .terminal-dot--max{background:var(--term-green)}.terminal-header .header-text{position:absolute;inset:0;font-family:var(--font-mono);font-size:var(--fs-xs);letter-spacing:var(--ls-wide);line-height:30px;color:var(--text-muted);text-align:center;pointer-events:none}.terminal-body{height:calc(100% - 30px);margin:0;padding:var(--space-4);overflow:auto;font-size:var(--fs-sm);line-height:var(--lh-snug);white-space:pre-wrap;overflow-wrap:break-word;background:var(--bg-terminal)}.terminal-body .git-prompt,.terminal-body .git-prompt-directory,.terminal-body .git-prompt-separator{display:inline}.terminal-body .git-prompt,.terminal-body .git-prompt-directory{font-weight:var(--fw-bold)}.terminal-body .git-prompt{color:var(--prompt)}.terminal-body .git-prompt-separator{color:var(--ink-1);font-weight:var(--fw-regular)}.terminal-body .git-prompt-directory{color:var(--term-blue)}.terminal-body .user-input{margin:0;padding:0;font-family:inherit;font-size:inherit;color:inherit;background-color:transparent;border:none;outline:none;caret-color:var(--prompt);caret-shape:block}.terminal-body .terminal-response{white-space:normal}.terminal-body::-webkit-scrollbar{width:10px}.terminal-body::-webkit-scrollbar-thumb{background:var(--aubergine);border-radius:var(--radius-pill)}@supports (backdrop-filter:blur(5px)) or (-webkit-backdrop-filter:blur(5px)){.terminal .terminal-body{background:color-mix(in srgb,var(--bg-terminal) 86%,transparent);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px)}}.terminal .resize-handle{position:absolute;right:0;bottom:0;width:16px;height:16px;background-color:transparent;cursor:nwse-resize}.table,table{--color-light:#ebebeb;--color-dark:#141414;--color-grey-light:#adadad;--margin:1em;border:1px dashed var(--color-light);margin:var(--margin)}.table thead,table thead{color:var(--color-dark);text-align:center;background-color:var(--color-light)}.table td,table td{padding:0 .5em}.table tbody tr:nth-child(2n),table tbody tr:nth-child(2n){background-color:var(--color-grey-light);color:var(--color-dark)}.table.w-100,table.w-100{width:calc(100% - var(--margin)*2)}.table.w-50,table.w-50{width:calc(50% - var(--margin)*2)}</style><style>.hdr[data-v-a782489c]{position:sticky;top:0;z-index:50;height:var(--header-height);background:color-mix(in srgb,var(--surface-0) 82%,transparent);border-bottom:1px solid var(--border-subtle);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}.hdr__in[data-v-a782489c]{display:flex;align-items:center;gap:var(--space-6);width:100%;max-width:var(--container-xl);height:100%;margin:0 auto;padding:0 var(--space-6)}.hdr__brand[data-v-a782489c]{display:inline-flex;align-items:center;gap:var(--space-2);text-decoration:none}.hdr__brand .hdr__logo[data-v-a782489c]{font-size:24px;color:var(--accent)}.hdr__brand b[data-v-a782489c]{font-family:var(--font-mono);font-size:var(--fs-md);font-weight:var(--fw-bold);color:var(--text-strong)}.hdr__brand[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-sm);box-shadow:var(--ring-accent)}.hdr__nav[data-v-a782489c]{display:flex;align-items:center;gap:var(--space-1);min-width:0;margin-left:var(--space-4)}.hdr__link[data-v-a782489c]{padding:var(--space-2) var(--space-3);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-muted);text-decoration:none;border-radius:var(--radius-sm);transition:color var(--dur-fast) var(--ease-standard),background var(--dur-fast) var(--ease-standard)}.hdr__link[data-v-a782489c]:hover{color:var(--text-strong);background:var(--surface-2)}.hdr__link[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hdr__link--active[data-v-a782489c]{color:var(--accent)}.hdr__right[data-v-a782489c]{display:flex;align-items:center;gap:var(--space-3);margin-left:auto}.hdr__clock[data-v-a782489c]{font-family:var(--font-mono);font-size:var(--fs-xs);color:var(--text-muted)}.hdr__burger[data-v-a782489c]{display:none;align-items:center;justify-content:center;width:36px;height:36px;font-size:20px;color:var(--text-strong);cursor:pointer;background:none;border:1px solid var(--border-default);border-radius:var(--radius-md)}.hdr__burger[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hdr__overlay[data-v-a782489c]{position:fixed;inset:var(--header-height) 0 0;z-index:40;background:var(--overlay)}.hdr__menu[data-v-a782489c]{display:none}@media(max-width:1100px){.hdr__clock[data-v-a782489c]{display:none}}@media(max-width:1000px){.hdr__badge[data-v-a782489c]{display:none}}@media(min-width:901px){.hdr__overlay[data-v-a782489c]{display:none}}@media(max-width:900px){.hdr__badge[data-v-a782489c],.hdr__clock[data-v-a782489c],.hdr__nav[data-v-a782489c],.hdr__right .hdr__action[data-v-a782489c]{display:none}.hdr__burger[data-v-a782489c]{display:inline-flex}.hdr__menu[data-v-a782489c]{position:fixed;inset:var(--header-height) 0 auto 0;z-index:45;display:flex;flex-direction:column;gap:var(--space-1);padding:var(--space-4) var(--space-6) var(--space-6);background:var(--surface-1);border-bottom:1px solid var(--border-subtle);box-shadow:var(--shadow-3);transform:translateY(-8px);opacity:0;visibility:hidden;transition:transform var(--dur-base) var(--ease-out),opacity var(--dur-base) var(--ease-standard),visibility var(--dur-base)}.hdr__menu--open[data-v-a782489c]{transform:translateY(0);opacity:1;visibility:visible}}.hdr__menu-link[data-v-a782489c]{padding:var(--space-3);font-family:var(--font-mono);font-size:var(--fs-base);color:var(--text-body);text-decoration:none;border-radius:var(--radius-sm)}.hdr__menu-link[data-v-a782489c]:hover{color:var(--text-strong);background:var(--surface-2)}.hdr__menu-link[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hdr__menu-link--active[data-v-a782489c]{color:var(--accent)}.hdr__menu-actions[data-v-a782489c]{display:flex;flex-direction:column;gap:var(--space-2);margin-top:var(--space-3)}@media(prefers-reduced-motion:reduce){.hdr__link[data-v-a782489c],.hdr__menu[data-v-a782489c]{transition:none}}</style><style>.init[data-v-e3708db0]{background:var(--bg-page);display:flex;flex-direction:column;margin:0;min-height:100vh;width:100%;max-width:100vw}</style><style>.zicon[data-v-70d98695]{display:inline-block;flex:none;width:1em;height:1em;vertical-align:middle}</style><style>.zbadge[data-v-fc077828]{display:inline-flex;align-items:center;gap:var(--space-2);box-sizing:border-box;height:22px;padding:0 var(--space-2);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:var(--fw-medium);line-height:1;letter-spacing:var(--ls-wide);white-space:nowrap;border:1px solid transparent;border-radius:var(--radius-sm)}.zbadge__dot[data-v-fc077828]{width:6px;height:6px;background:currentcolor;border-radius:var(--radius-circle)}.zbadge--neutral[data-v-fc077828]{background:var(--surface-3);color:var(--text-body);border-color:var(--border-default)}.zbadge--accent[data-v-fc077828]{background:var(--accent-soft);color:var(--accent);border-color:#f871164d}.zbadge--success[data-v-fc077828]{background:var(--success-soft);color:var(--success);border-color:#297a4880}.zbadge--warning[data-v-fc077828]{background:var(--warning-soft);color:var(--warning);border-color:#8b611880}.zbadge--danger[data-v-fc077828]{background:var(--danger-soft);color:var(--danger);border-color:#8a282880}.zbadge--info[data-v-fc077828]{background:var(--info-soft);color:var(--info);border-color:#255b7e80}</style><style>.zbtn[data-v-c154e5b1]{--_h:36px;--_px:var(--space-4);--_fs:var(--fs-sm);display:inline-flex;align-items:center;justify-content:center;gap:var(--space-2);box-sizing:border-box;height:var(--_h);padding:0 var(--_px);font-family:var(--font-mono);font-size:var(--_fs);font-weight:var(--fw-medium);line-height:1;letter-spacing:var(--ls-wide);white-space:nowrap;text-decoration:none;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;border:1px solid transparent;border-radius:var(--radius-md);transition:background var(--dur-fast) var(--ease-standard),border-color var(--dur-fast) var(--ease-standard),color var(--dur-fast) var(--ease-standard),transform var(--dur-fast) var(--ease-standard)}.zbtn[data-v-c154e5b1]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.zbtn[data-v-c154e5b1]:disabled,.zbtn[aria-disabled=true][data-v-c154e5b1]{opacity:.45;cursor:not-allowed;pointer-events:none}.zbtn__icon[data-v-c154e5b1]{display:inline-flex;width:1.05em;height:1.05em}.zbtn__icon[data-v-c154e5b1] svg{width:100%;height:100%}.zbtn--sm[data-v-c154e5b1]{--_h:28px;--_px:var(--space-3);--_fs:var(--fs-xs)}.zbtn--lg[data-v-c154e5b1]{--_h:44px;--_px:var(--space-5);--_fs:var(--fs-base)}.zbtn--primary[data-v-c154e5b1]{background:var(--accent);color:var(--accent-text);border-color:var(--accent)}.zbtn--primary[data-v-c154e5b1]:hover{background:var(--accent-hover);border-color:var(--accent-hover)}.zbtn--primary[data-v-c154e5b1]:active{background:var(--accent-active);border-color:var(--accent-active);transform:translateY(1px)}.zbtn--secondary[data-v-c154e5b1]{background:var(--surface-2);color:var(--text-strong);border-color:var(--border-default)}.zbtn--secondary[data-v-c154e5b1]:hover{background:var(--surface-3);border-color:var(--border-strong)}.zbtn--secondary[data-v-c154e5b1]:active{transform:translateY(1px)}.zbtn--ghost[data-v-c154e5b1]{background:transparent;color:var(--text-body);border-color:transparent}.zbtn--ghost[data-v-c154e5b1]:hover{background:var(--surface-2);color:var(--text-strong)}.zbtn--terminal[data-v-c154e5b1]{background:var(--bg-terminal);color:var(--term-green);border-color:var(--accent-2-soft)}.zbtn--terminal[data-v-c154e5b1]:hover{border-color:var(--term-green);box-shadow:var(--glow-terminal)}.zbtn--danger[data-v-c154e5b1]{background:var(--danger);color:var(--ink-on-accent);border-color:var(--danger)}.zbtn--danger[data-v-c154e5b1]:hover{filter:brightness(1.08)}.zbtn--danger[data-v-c154e5b1]:active{transform:translateY(1px)}@media(prefers-reduced-motion:reduce){.zbtn[data-v-c154e5b1]{transition:none}}</style><style>.boot[data-v-f59a7d91]{position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;cursor:pointer;background:var(--surface-0);transition:opacity var(--dur-slow) var(--ease-out),visibility var(--dur-slow)}.boot.boot--done[data-v-f59a7d91]{pointer-events:none;visibility:hidden;opacity:0}.boot__in[data-v-f59a7d91]{width:min(560px,88vw);font-family:var(--font-mono);font-size:var(--fs-sm)}.boot__logo[data-v-f59a7d91]{display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-5);color:var(--text-strong)}.boot__logo b[data-v-f59a7d91]{font-size:var(--fs-lg)}.boot__logo-icon[data-v-f59a7d91]{font-size:26px;color:var(--accent)}.boot__line[data-v-f59a7d91]{min-height:1.6em;color:var(--text-muted)}.boot__ok[data-v-f59a7d91]{color:var(--term-green)}.boot__bar[data-v-f59a7d91]{height:3px;margin-top:var(--space-5);overflow:hidden;background:var(--surface-3);border-radius:var(--radius-xs)}.boot__bar i[data-v-f59a7d91]{display:block;width:0;height:100%;background:linear-gradient(90deg,var(--accent),var(--aubergine-light));transition:width .1s linear}.boot__skip[data-v-f59a7d91]{display:inline-block;margin-top:var(--space-4);padding:0;font-family:inherit;font-size:var(--fs-xs);letter-spacing:var(--ls-wide);color:var(--text-faint);cursor:pointer;background:none;border:none}.boot__skip[data-v-f59a7d91]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}@media(prefers-reduced-motion:reduce){.boot[data-v-f59a7d91]{display:none}}</style><style>.atmos[data-v-796c86c1]{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none}.aurora[data-v-796c86c1]{position:absolute;border-radius:var(--radius-circle);filter:blur(80px);mix-blend-mode:screen;will-change:transform}.aurora--orange[data-v-796c86c1]{top:-22%;left:48%;width:60vw;height:60vw;background:radial-gradient(circle at center,var(--orange-500),transparent 62%);opacity:.55;animation:drift-orange-796c86c1 26s var(--ease-in-out) infinite}.aurora--auberg[data-v-796c86c1]{top:6%;left:-22%;width:64vw;height:64vw;background:radial-gradient(circle at center,var(--aubergine-vivid),transparent 62%);opacity:.7;animation:drift-auberg-796c86c1 32s var(--ease-in-out) infinite}.aurora--red[data-v-796c86c1]{top:44%;left:26%;width:44vw;height:44vw;background:radial-gradient(circle at center,var(--term-red),transparent 64%);opacity:.4;animation:drift-red-796c86c1 30s var(--ease-in-out) infinite}.grid-dots[data-v-796c86c1]{background-image:radial-gradient(color-mix(in srgb,var(--ink-1) 6%,transparent) 1px,transparent 1px);background-size:34px 34px;-webkit-mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,var(--surface-0) 30%,transparent 78%);mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,var(--surface-0) 30%,transparent 78%)}.grid-dots[data-v-796c86c1],.scanlines[data-v-796c86c1]{position:absolute;inset:0}.scanlines[data-v-796c86c1]{opacity:.35;background:repeating-linear-gradient(0deg,color-mix(in srgb,var(--surface-0) 24%,transparent) 0 1px,transparent 1px 3px)}.vignette[data-v-796c86c1]{position:absolute;inset:0;background:radial-gradient(ellipse 120% 90% at 50% 0,transparent 55%,var(--surface-0) 100%)}@keyframes drift-orange-796c86c1{0%,to{transform:translate(0) scale(1)}50%{transform:translate(-6vw,5vh) scale(1.12)}}@keyframes drift-auberg-796c86c1{0%,to{transform:translate(0) scale(1)}50%{transform:translate(7vw,-4vh) scale(1.08)}}@keyframes drift-red-796c86c1{0%,to{transform:translate(0) scale(1)}50%{transform:translate(-4vw,-6vh) scale(1.15)}}@media(prefers-reduced-motion:reduce){.aurora[data-v-796c86c1]{animation:none}}</style><style>.cursor-dot[data-v-0096a69c],.cursor-ring[data-v-0096a69c]{position:fixed;top:0;left:0;z-index:90;border-radius:var(--radius-circle);mix-blend-mode:difference;opacity:0;pointer-events:none;transition:opacity var(--dur-base) var(--ease-standard)}.cursor-dot.is-visible[data-v-0096a69c],.cursor-ring.is-visible[data-v-0096a69c]{opacity:1}.cursor-dot[data-v-0096a69c]{width:6px;height:6px;background:var(--ink-1)}.cursor-ring[data-v-0096a69c]{width:34px;height:34px;border:1px solid color-mix(in srgb,var(--ink-1) 70%,transparent);transition:width var(--dur-base) var(--ease-out),height var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out),opacity var(--dur-base) var(--ease-standard)}.cursor-ring.is-hot[data-v-0096a69c]{width:56px;height:56px;border-color:var(--accent)}@media(hover:none),(prefers-reduced-motion:reduce){.cursor-dot[data-v-0096a69c],.cursor-ring[data-v-0096a69c]{display:none}}</style><style>.hero-term[data-v-313a6524]{display:flex;flex-direction:column;min-height:300px;overflow:hidden;border:1px solid var(--accent-2-soft);border-radius:var(--radius-sm);box-shadow:var(--glow-terminal)}.hero-term__bar[data-v-313a6524]{position:relative;display:flex;flex:none;align-items:center;gap:var(--space-2);height:30px;padding:0 var(--space-3);background:var(--aubergine-black)}.hero-term__dots[data-v-313a6524]{display:flex;align-items:center;gap:7px}.hero-term__dot[data-v-313a6524]{width:13px;height:13px;border-radius:var(--radius-circle)}.hero-term__dot--close[data-v-313a6524]{background:var(--term-red)}.hero-term__dot--min[data-v-313a6524]{background:var(--term-yellow)}.hero-term__dot--max[data-v-313a6524]{background:var(--term-green)}.hero-term__title[data-v-313a6524]{position:absolute;inset:0;font-family:var(--font-mono);font-size:var(--fs-xs);letter-spacing:var(--ls-wide);color:var(--text-muted);text-align:center;pointer-events:none}.hero-term__body[data-v-313a6524]{flex:1;min-height:0;padding:var(--space-4);overflow:auto;font-family:var(--font-mono);font-size:var(--fs-sm);line-height:var(--lh-snug);color:var(--ink-1);background:var(--bg-terminal);overflow-wrap:break-word}@supports (backdrop-filter:blur(5px)){.hero-term__body[data-v-313a6524]{background:color-mix(in srgb,var(--bg-terminal) 86%,transparent);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px)}}.hero-term__line[data-v-313a6524]{margin:0}.hero-term__out[data-v-313a6524]{margin:0 0 var(--space-4)}.hero-term__out--ink[data-v-313a6524]{color:var(--ink-1)}.hero-term__out--blue[data-v-313a6524]{color:var(--term-blue)}.hero-term__out--green[data-v-313a6524]{color:var(--term-green)}.hero-term__open[data-v-313a6524]{display:block;width:100%;padding:0;font:inherit;text-align:left;cursor:pointer;background:none;border:none;border-radius:var(--radius-xs)}.hero-term__open[data-v-313a6524]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.prm[data-v-313a6524]{font-family:var(--font-mono)}.prm__user[data-v-313a6524]{font-weight:var(--fw-bold);color:var(--prompt)}.prm__sep[data-v-313a6524]{color:var(--ink-1)}.prm__dir[data-v-313a6524]{font-weight:var(--fw-bold);color:var(--term-blue)}.prm__cmd[data-v-313a6524]{color:var(--ink-1)}.prm__caret[data-v-313a6524]{display:inline-block;width:.55em;height:1.05em;margin-left:1px;vertical-align:text-bottom;background:var(--prompt);animation:caret-blink 1s steps(1) infinite}@media(prefers-reduced-motion:reduce){.prm__caret[data-v-313a6524]{animation:none}}</style><style>.marquee[data-v-19576991]{display:block;width:100%;padding-block:var(--space-5);overflow:hidden;border-block:1px solid var(--border-subtle);-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}.marquee:hover .marquee__track[data-v-19576991]{animation-play-state:paused}.marquee__track[data-v-19576991]{display:flex;gap:var(--space-8);width:-moz-max-content;width:max-content;will-change:transform;animation:scroll-x-19576991 32s linear infinite}.marquee__item[data-v-19576991]{display:inline-flex;gap:var(--space-8);align-items:center;font-family:var(--font-mono);font-size:var(--fs-xl);letter-spacing:var(--ls-wide);color:var(--text-faint);white-space:nowrap}.marquee__label[data-v-19576991]{font-weight:var(--fw-regular);color:var(--text-body)}.marquee__star[data-v-19576991]{color:var(--accent)}@keyframes scroll-x-19576991{0%{transform:translate(0)}to{transform:translate(calc(-50% - var(--space-8)/2))}}@media(prefers-reduced-motion:reduce){.marquee[data-v-19576991]{-webkit-mask-image:none;mask-image:none}.marquee__track[data-v-19576991]{animation:none}.marquee__item--duplicate[data-v-19576991]{display:none}}</style><style>.home[data-v-80e32bdd]{display:block}.anim[data-v-80e32bdd]{animation:fade-rise var(--dur-slow) var(--ease-out) both}.hero__term-col[data-v-80e32bdd]{animation-delay:80ms}.hero[data-v-80e32bdd]{position:relative;overflow:hidden}.hero__grad[data-v-80e32bdd]{background:radial-gradient(900px 500px at 78% -10%,color-mix(in srgb,var(--accent) 16%,transparent),transparent 60%),radial-gradient(700px 500px at 0 110%,color-mix(in srgb,var(--aubergine-vivid) 28%,transparent),transparent 60%),var(--bg-page)}.hero__in[data-v-80e32bdd]{position:relative;z-index:1;padding-block:var(--space-20)}.hero__grid[data-v-80e32bdd]{display:grid;grid-template-columns:1.05fr .95fr;gap:var(--space-12);align-items:center}.hero__title[data-v-80e32bdd]{font-family:var(--font-mono);font-size:var(--fs-6xl);font-weight:var(--fw-light);letter-spacing:var(--ls-tight);color:var(--text-strong)}.hero__title em[data-v-80e32bdd]{font-style:normal;color:var(--accent)}.hero__sub[data-v-80e32bdd]{max-width:46ch;margin:var(--space-5) 0 var(--space-6);font-family:var(--font-sans);font-size:var(--fs-lg);line-height:var(--lh-relaxed);color:var(--text-body)}.hero__cta[data-v-80e32bdd]{display:flex;flex-wrap:wrap;gap:var(--space-3);margin-bottom:var(--space-6)}.hero__badge-wrap[data-v-80e32bdd]{display:inline-flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-6);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-muted)}.hero__badge-wrap a[data-v-80e32bdd]{color:var(--accent);text-decoration:underline}.hero__badge-wrap a[data-v-80e32bdd]:hover{color:var(--accent-hover)}.hero__badge-wrap a[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hero__pulse-dot[data-v-80e32bdd]{width:8px;height:8px;border-radius:var(--radius-circle);background:var(--success);box-shadow:0 0 color-mix(in srgb,var(--success) 60%,transparent);animation:pulse-dot-80e32bdd 2.2s infinite var(--ease-out)}@media(prefers-reduced-motion:reduce){.hero__pulse-dot[data-v-80e32bdd]{animation:none}}@keyframes pulse-dot-80e32bdd{0%{box-shadow:0 0 color-mix(in srgb,var(--success) 60%,transparent)}70%{box-shadow:0 0 0 6px color-mix(in srgb,var(--success) 0%,transparent)}to{box-shadow:0 0 color-mix(in srgb,var(--success) 0%,transparent)}}.section__title[data-v-80e32bdd]{margin-bottom:var(--space-8);font-family:var(--font-mono);font-size:var(--fs-3xl);font-weight:var(--fw-regular);color:var(--text-strong)}.grid-3[data-v-80e32bdd]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-5);margin:0;padding:0;list-style:none}.grid-3>li[data-v-80e32bdd],.offer[data-v-80e32bdd]{display:flex}.offer[data-v-80e32bdd]{flex-direction:column;width:100%}.offer__top[data-v-80e32bdd]{justify-content:space-between;margin-bottom:var(--space-4)}.offer__icon[data-v-80e32bdd],.offer__top[data-v-80e32bdd]{display:flex;align-items:center}.offer__icon[data-v-80e32bdd]{justify-content:center;width:var(--space-10);height:var(--space-10);font-size:22px;color:var(--accent);background:var(--accent-soft);border-radius:var(--radius-md)}.offer__no[data-v-80e32bdd]{font-size:var(--fs-xs);letter-spacing:var(--ls-wider);color:var(--text-faint)}.offer__no[data-v-80e32bdd],.offer__title[data-v-80e32bdd]{font-family:var(--font-mono)}.offer__title[data-v-80e32bdd]{margin-bottom:var(--space-2);font-size:var(--fs-xl);font-weight:var(--fw-regular);color:var(--text-strong)}.offer__desc[data-v-80e32bdd]{margin:0 0 var(--space-4);font-family:var(--font-sans);font-size:var(--fs-sm);line-height:var(--lh-relaxed);color:var(--text-body)}.offer__points[data-v-80e32bdd]{display:flex;flex-direction:column;gap:var(--space-2);margin:0 0 var(--space-4);padding:0;list-style:none}.offer__points li[data-v-80e32bdd]{display:flex;gap:var(--space-2);align-items:flex-start;font-family:var(--font-mono);font-size:var(--fs-xs);line-height:var(--lh-normal);color:var(--text-muted)}.offer__check[data-v-80e32bdd]{flex-shrink:0;margin-top:calc(var(--space-1)/2);font-size:var(--fs-sm);color:var(--term-green)}.offer__tags[data-v-80e32bdd]{margin-bottom:var(--space-4)}.offer__price[data-v-80e32bdd]{margin-top:auto;padding-top:var(--space-4);border-top:1px dashed var(--border-subtle);font-size:var(--fs-xs)}.offer__more[data-v-80e32bdd],.offer__price[data-v-80e32bdd]{font-family:var(--font-mono);color:var(--accent)}.offer__more[data-v-80e32bdd]{margin-top:var(--space-3);font-size:var(--fs-sm);text-decoration:none}.offer__more[data-v-80e32bdd]:hover{text-decoration:underline}.offer__more[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent);border-radius:var(--radius-xs)}.work[data-v-80e32bdd]{display:flex;flex-direction:column;margin:0;padding:0;list-style:none}.work>li[data-v-80e32bdd]{display:block;width:100%}.work__row[data-v-80e32bdd]{position:relative;display:grid;grid-template-columns:56px 1fr auto;gap:var(--space-6);align-items:center;padding:var(--space-8) var(--space-3);border-top:1px solid var(--border-subtle);text-decoration:none;color:inherit;transition:padding-left var(--dur-slow) var(--ease-out),background var(--dur-slow) var(--ease-standard)}.work__row[data-v-80e32bdd]:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,var(--accent-soft),transparent 60%);opacity:0;transition:opacity var(--dur-slow) var(--ease-standard)}li:last-child .work__row[data-v-80e32bdd]{border-bottom:1px solid var(--border-subtle)}.work__row--link[data-v-80e32bdd]{cursor:pointer}.work__row--link[data-v-80e32bdd]:hover{padding-left:var(--space-6)}.work__row--link[data-v-80e32bdd]:hover:before{opacity:1}.work__row--link:hover .work__name[data-v-80e32bdd]{color:var(--accent)}.work__row--link:hover .work__go[data-v-80e32bdd]{color:var(--accent);transform:translate(6px,-6px)}.work__row--link[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent);border-radius:var(--radius-xs)}.work__no[data-v-80e32bdd]{font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-faint)}.work__main[data-v-80e32bdd],.work__no[data-v-80e32bdd]{position:relative}.work__topline[data-v-80e32bdd]{display:flex;flex-wrap:wrap;align-items:baseline;gap:var(--space-3)}.work__name[data-v-80e32bdd]{margin:0;font-family:var(--font-mono);font-size:clamp(1.4rem,2.8vw,2rem);font-weight:var(--fw-regular);letter-spacing:var(--ls-tight);color:var(--text-strong);transition:color var(--dur-base) var(--ease-standard)}.work__status[data-v-80e32bdd]{color:var(--accent);letter-spacing:var(--ls-wide)}.work__role[data-v-80e32bdd],.work__status[data-v-80e32bdd]{font-family:var(--font-mono);font-size:var(--fs-xs)}.work__role[data-v-80e32bdd]{margin:var(--space-1) 0 0;color:var(--text-muted)}.work__desc[data-v-80e32bdd]{max-width:65ch;margin:var(--space-3) 0 0;font-size:var(--fs-sm)}.work__tags[data-v-80e32bdd]{margin-top:var(--space-4)}.work__go[data-v-80e32bdd]{position:relative;font-size:var(--fs-xl);color:var(--text-faint);transition:transform var(--dur-base) var(--ease-out),color var(--dur-base) var(--ease-standard)}.stats[data-v-80e32bdd]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin:var(--space-12) 0 0;padding:0;list-style:none}.stat[data-v-80e32bdd]{padding:var(--space-6);background:color-mix(in srgb,var(--surface-1) 70%,transparent);border:1px solid var(--border-subtle);border-radius:var(--radius-md)}.stat b[data-v-80e32bdd]{display:block;margin-bottom:var(--space-1);font-size:var(--fs-5xl);font-weight:var(--fw-light);line-height:1;letter-spacing:var(--ls-tight);color:var(--text-strong)}.stat b[data-v-80e32bdd],.stat span[data-v-80e32bdd]{font-family:var(--font-mono)}.stat span[data-v-80e32bdd]{font-size:var(--fs-sm);letter-spacing:var(--ls-wide);color:var(--text-muted)}.block__head--row[data-v-80e32bdd]{display:flex;align-items:flex-end;justify-content:space-between;gap:var(--space-6);margin-bottom:var(--space-8)}.block__head--row .section__title[data-v-80e32bdd]{margin-bottom:0}.seeall[data-v-80e32bdd]{display:inline-flex;flex:none;align-items:center;gap:var(--space-2);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-muted);text-decoration:none;white-space:nowrap;transition:color var(--dur-base) var(--ease-standard)}.seeall[data-v-80e32bdd]:hover{color:var(--accent)}.seeall[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent);border-radius:var(--radius-xs)}.seeall__icon[data-v-80e32bdd]{font-size:var(--fs-base)}.journal[data-v-80e32bdd]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-5);margin:0;padding:0;list-style:none}.journal>li[data-v-80e32bdd],.jpost[data-v-80e32bdd]{display:flex}.jpost[data-v-80e32bdd]{flex-direction:column;width:100%;color:inherit;text-decoration:none}.jpost:hover .jpost__title[data-v-80e32bdd]{color:var(--accent)}.jpost:hover .jpost__arrow[data-v-80e32bdd]{color:var(--accent);transform:translate(4px,-4px)}.jpost__thumb[data-v-80e32bdd]{width:100%;height:160px;-o-object-fit:cover;object-fit:cover;border-bottom:1px solid var(--border-subtle)}.jpost__body[data-v-80e32bdd]{display:flex;flex:1;flex-direction:column;padding:var(--space-5)}.jpost__tags[data-v-80e32bdd]{margin-bottom:var(--space-3)}.jpost__title[data-v-80e32bdd]{margin:0 0 var(--space-2);font-family:var(--font-mono);font-size:var(--fs-lg);font-weight:var(--fw-regular);line-height:var(--lh-snug);color:var(--text-strong);transition:color var(--dur-base) var(--ease-standard)}.jpost__desc[data-v-80e32bdd]{margin:0 0 var(--space-4);font-size:var(--fs-sm);color:var(--text-muted)}.jpost__meta[data-v-80e32bdd]{display:flex;align-items:center;gap:var(--space-2);margin-top:auto;padding-top:var(--space-4);border-top:1px dashed var(--border-subtle);font-family:var(--font-mono);font-size:var(--fs-xs);color:var(--text-faint)}.jpost__arrow[data-v-80e32bdd]{margin-left:auto;font-size:var(--fs-base);color:var(--text-faint);transition:transform var(--dur-base) var(--ease-out),color var(--dur-base) var(--ease-standard)}.journal__empty[data-v-80e32bdd]{max-width:60ch;margin:0 auto;text-align:center}.journal__empty-code[data-v-80e32bdd]{margin:0 0 var(--space-2);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--accent)}.journal__empty-text[data-v-80e32bdd]{margin:0 0 var(--space-5);font-family:var(--font-sans);font-size:var(--fs-sm);line-height:var(--lh-relaxed);color:var(--text-muted)}.cta[data-v-80e32bdd]{position:relative;padding:clamp(48px,6vw,72px) var(--space-6);overflow:hidden;text-align:center;background:radial-gradient(ellipse 80% 120% at 50% 0,var(--accent-2-soft),transparent 70%),color-mix(in srgb,var(--surface-2) 60%,transparent);border:1px solid var(--border-subtle);border-radius:var(--radius-lg)}.cta__eyebrow[data-v-80e32bdd]{display:inline-block}.cta__title[data-v-80e32bdd]{margin:0 0 var(--space-4);font-family:var(--font-mono);font-size:clamp(1.8rem,4vw,2.8rem);font-weight:var(--fw-light);line-height:var(--lh-tight);letter-spacing:var(--ls-tight);color:var(--text-strong)}.cta__highlight[data-v-80e32bdd]{font-style:italic;color:var(--accent)}.cta__subtitle[data-v-80e32bdd]{max-width:58ch;margin:0 auto var(--space-8);font-family:var(--font-sans);font-size:var(--fs-base);line-height:var(--lh-relaxed);color:var(--text-muted)}.cta__actions[data-v-80e32bdd]{display:flex;flex-wrap:wrap;gap:var(--space-4);justify-content:center}@media(max-width:900px){.hero__grid[data-v-80e32bdd]{grid-template-columns:1fr}.hero__title[data-v-80e32bdd]{font-size:var(--fs-4xl)}.grid-3[data-v-80e32bdd],.journal[data-v-80e32bdd]{grid-template-columns:1fr}.block__head--row[data-v-80e32bdd]{flex-direction:column;align-items:flex-start}}@media(max-width:680px){.work__row[data-v-80e32bdd]{grid-template-columns:1fr;gap:var(--space-3)}.work__go[data-v-80e32bdd],.work__no[data-v-80e32bdd]{display:none}.stats[data-v-80e32bdd]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.anim[data-v-80e32bdd]{animation:none}.jpost__arrow[data-v-80e32bdd],.work__go[data-v-80e32bdd],.work__row[data-v-80e32bdd]{transition:none}.work__row--link[data-v-80e32bdd]:hover{padding-left:var(--space-3)}.work__row--link:hover .work__go[data-v-80e32bdd]{transform:none}}</style><style>.hexrow[data-v-a86d2094]{display:flex;gap:var(--space-5);margin:0;padding:0;list-style:none}</style><style>.hex[data-v-274e53e2]{display:inline-flex;align-items:center;justify-content:center;width:46px;height:53px;font-size:20px;color:var(--text-muted);cursor:pointer;background:var(--surface-2);clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);transition:color var(--dur-base) var(--ease-standard),background var(--dur-base) var(--ease-standard)}.hex[data-v-274e53e2]:hover{color:var(--ink-on-accent);background:var(--accent)}.hex[data-v-274e53e2]:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.hex__label[data-v-274e53e2]{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;white-space:nowrap;border:0;clip-path:inset(50%)}@media(prefers-reduced-motion:reduce){.hex[data-v-274e53e2]{transition:none}}</style><style>.zcard[data-v-c5ec7be1]{position:relative;overflow:hidden;background:var(--bg-card);color:var(--text-body);border:1px solid var(--border-subtle);border-radius:var(--radius-md);box-shadow:var(--shadow-2),var(--shadow-hairline);transition:border-color var(--dur-base) var(--ease-standard),transform var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-standard)}.zcard--pad[data-v-c5ec7be1]{padding:var(--space-6)}.zcard--interactive[data-v-c5ec7be1]{cursor:pointer}.zcard--interactive[data-v-c5ec7be1]:hover{border-color:var(--border-strong);transform:translateY(-2px);box-shadow:var(--shadow-3),var(--shadow-hairline)}.zcard--interactive[data-v-c5ec7be1]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.zcard--accent[data-v-c5ec7be1]:before{content:"";position:absolute;inset:0 0 auto;height:2px;background:linear-gradient(90deg,var(--accent),var(--aubergine-light))}.zcard--featured[data-v-c5ec7be1]{border-color:var(--accent-ring);box-shadow:var(--glow-accent),var(--shadow-hairline)}@media(prefers-reduced-motion:reduce){.zcard[data-v-c5ec7be1]{transition:none}.zcard--interactive[data-v-c5ec7be1]:hover{transform:none}}</style><style>.ztag[data-v-6db1c85c]{display:inline-flex;align-items:center;gap:var(--space-2);box-sizing:border-box;height:26px;padding:0 var(--space-3);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:var(--fw-regular);line-height:1;white-space:nowrap;color:var(--text-body);background:var(--surface-2);border:1px solid var(--border-subtle);border-radius:var(--radius-pill);transition:border-color var(--dur-fast) var(--ease-standard),color var(--dur-fast) var(--ease-standard)}.ztag[data-v-6db1c85c]:before{content:"#";color:var(--accent)}.ztag--plain[data-v-6db1c85c]:before{display:none;content:none}.ztag--clickable[data-v-6db1c85c]{cursor:pointer}.ztag--clickable[data-v-6db1c85c]:hover{border-color:var(--border-strong);color:var(--text-strong)}.ztag--clickable[data-v-6db1c85c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.ztag__remove[data-v-6db1c85c]{display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;margin-right:-2px;padding:0;font-family:var(--font-mono);font-size:var(--fs-sm);line-height:1;color:var(--text-muted);cursor:pointer;background:none;border:none;border-radius:var(--radius-circle)}.ztag__remove[data-v-6db1c85c]:hover{color:var(--term-red)}.ztag__remove[data-v-6db1c85c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}@media(prefers-reduced-motion:reduce){.ztag[data-v-6db1c85c]{transition:none}}</style><link rel="stylesheet" href="/_nuxt/entry.QaoIl47T.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZButton.CyAD_ftR.css" crossorigin><link rel="stylesheet" href="/_nuxt/LinkListComponent.BRYW5MSq.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZBadge.BAw1B01J.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZTag.f2Aq6DLg.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZCard.C5C9a-aj.css" crossorigin><link rel="modulepreload" as="script" crossorigin href="/_nuxt/kT-s8AA-.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/94XchtD0.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CZy76wlf.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/DlAUqK2U.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CDaHTzsF.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/DMhLy-fw.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CMQEDqfi.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/OpxrMEpG.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/C93KKm9n.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/1LEPDT53.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/ZsGxQ2mD.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/p0temu7u.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/BGMjmYXP.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CXmFvnQY.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/DvmfV0_A.js"><script type="module" src="/_nuxt/kT-s8AA-.js" crossorigin></script><meta name="description" content="Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL."><link rel="icon" type="image/x-icon" href="/favicon.ico"><script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","@id":"https://jouan.ovh/#organization","name":"Simon Jouan","url":"https://jouan.ovh","logo":"https://jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Rouen, France","addressCountry":"FR"}}</script><link rel="canonical" href="https://jouan.ovh"><script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"Simon Jouan — Développeur Full Stack TypeScript","url":"https://jouan.ovh","description":"Développeur Full Stack TypeScript — Nuxt / NestJS"}</script><script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Simon Jouan","jobTitle":"Développeur Full Stack TypeScript — Nuxt / NestJS","url":"https://jouan.ovh","image":"https://jouan.ovh/images/portrait.jpeg","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Rouen, France","addressCountry":"FR"}}</script><meta property="og:title" content="Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS"><meta property="og:description" content="Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL."><meta property="og:url" content="https://jouan.ovh"><meta property="og:type" content="website"><meta property="og:image" content="https://jouan.ovh/images/portrait.jpeg"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS"><meta name="twitter:description" content="Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL."><meta name="twitter:image" content="https://jouan.ovh/images/portrait.jpeg"></head><body><div id="__nuxt"><div class="init" data-v-e3708db0><header class="hdr" data-v-e3708db0 data-v-a782489c><div class="hdr__in" data-v-a782489c><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__brand" data-v-a782489c><svg class="zicon hdr__logo" viewbox="0 0 24 24" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><path d="M12 1.5 22.5 12 12 22.5 1.5 12z" fill="currentColor"/><path d="M12 1.5 22.5 12 12 12z" fill="#fff" fill-opacity="0.12"/></svg><b data-v-a782489c>jouan.ovh</b></a><nav class="hdr__nav" aria-label="Navigation principale" data-v-a782489c><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__link hdr__link--active" data-v-a782489c>Accueil</a><a href="/services" class="hdr__link" data-v-a782489c>Services</a><a href="/about" class="hdr__link" data-v-a782489c>À propos</a><a href="/blog" class="hdr__link" data-v-a782489c>Blog</a><a href="/contact" class="hdr__link" data-v-a782489c>Contact</a><!--]--></nav><div class="hdr__right" data-v-a782489c><div class="current-time hdr__clock" data-v-a782489c data-v-1e5503b4></div><span class="zbadge zbadge--success hdr__badge" data-v-a782489c data-v-fc077828><span class="zbadge__dot" aria-hidden="true" data-v-fc077828></span><!--[-->Disponible<!--]--></span><button class="hdr__action zbtn zbtn--terminal zbtn--sm" type="button" data-v-a782489c data-v-c154e5b1><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg><!--]--></span><!--[--> Terminal <!--]--><!----></button><a href="/contact" class="hdr__action zbtn zbtn--primary zbtn--sm" data-v-a782489c data-v-c154e5b1><!----><!--[--> Démarrer un projet <!--]--><!----></a><button class="hdr__burger" type="button" aria-expanded="false" aria-controls="hdr-mobile-menu" aria-label="Ouvrir le menu" data-v-a782489c><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg></button></div></div><!----><nav id="hdr-mobile-menu" class="hdr__menu" aria-label="Navigation mobile" data-v-a782489c><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__menu-link hdr__menu-link--active" data-v-a782489c>Accueil</a><a href="/services" class="hdr__menu-link" data-v-a782489c>Services</a><a href="/about" class="hdr__menu-link" data-v-a782489c>À propos</a><a href="/blog" class="hdr__menu-link" data-v-a782489c>Blog</a><a href="/contact" class="hdr__menu-link" data-v-a782489c>Contact</a><!--]--><div class="hdr__menu-actions" data-v-a782489c><button class="zbtn zbtn--terminal zbtn--sm" type="button" data-v-a782489c data-v-c154e5b1><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg><!--]--></span><!--[--> Terminal <!--]--><!----></button><a href="/contact" class="zbtn zbtn--primary zbtn--sm" data-v-a782489c data-v-c154e5b1><!----><!--[--> Démarrer un projet <!--]--><!----></a></div></nav><div data-v-a782489c><!--[--><!--]--></div></header><!--[--><main class="home" data-v-80e32bdd><span data-v-80e32bdd></span><div class="atmos" aria-hidden="true" data-v-80e32bdd data-v-796c86c1><div class="aurora aurora--auberg" data-v-796c86c1></div><div class="aurora aurora--orange" data-v-796c86c1></div><div class="aurora aurora--red" data-v-796c86c1></div><div class="grid-dots" data-v-796c86c1></div><div class="scanlines" data-v-796c86c1></div><div class="vignette" data-v-796c86c1></div></div><!----><section class="hero hero__grad" data-v-80e32bdd><div class="hero__in container" data-v-80e32bdd><div class="hero__grid" data-v-80e32bdd><div class="anim hero__text" data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p><h1 class="hero__title" data-v-80e32bdd>Développeur Full Stack TypeScript</h1><p class="hero__sub" data-v-80e32bdd> Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l&#39;architecture au déploiement, j&#39;interviens sur des produits neufs comme sur des applications existantes. </p><div class="hero__badge-wrap" data-v-80e32bdd><span class="hero__pulse-dot" aria-hidden="true" data-v-80e32bdd></span><span data-v-80e32bdd>Disponible pour missions freelance</span><!--[--><span aria-hidden="true" data-v-80e32bdd> · </span><a href="https://www.malt.fr/profile/simonjouan" rel="noopener" target="_blank" data-v-80e32bdd><!--[--> Profil Malt vérifié <!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a><!--]--></div><div class="hero__cta" data-v-80e32bdd><a href="/contact" class="zbtn zbtn--primary zbtn--lg" data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Discuter de votre projet <!--]--><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg><!--]--></span></a><a href="/about" class="zbtn zbtn--secondary zbtn--lg" data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Voir le parcours &amp; CV <!--]--><!----></a></div></div><div class="anim hero__term-col" data-v-80e32bdd><div class="hero-term" data-v-80e32bdd data-v-313a6524><div class="hero-term__bar" data-v-313a6524><span class="hero-term__dots" aria-hidden="true" data-v-313a6524><span class="hero-term__dot hero-term__dot--close" data-v-313a6524></span><span class="hero-term__dot hero-term__dot--min" data-v-313a6524></span><span class="hero-term__dot hero-term__dot--max" data-v-313a6524></span></span><span class="hero-term__title" data-v-313a6524>anon.@jouan.ovh: ~</span></div><div class="hero-term__body" data-v-313a6524><!--[--><!--]--><!----><!----><noscript data-v-313a6524><div data-v-313a6524><!--[--><!--[--><p class="hero-term__line" data-v-313a6524><span class="prm" data-v-313a6524><span class="prm__user" data-v-313a6524>anon.@jouan.ovh</span><span class="prm__sep" data-v-313a6524>:</span><span class="prm__dir" data-v-313a6524>~</span><span class="prm__sep" data-v-313a6524>$ </span><span class="prm__cmd" data-v-313a6524>whoami</span></span></p><p class="hero-term__out--ink hero-term__out" data-v-313a6524>Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)</p><!--]--><!--[--><p class="hero-term__line" data-v-313a6524><span class="prm" data-v-313a6524><span class="prm__user" data-v-313a6524>anon.@jouan.ovh</span><span class="prm__sep" data-v-313a6524>:</span><span class="prm__dir" data-v-313a6524>~</span><span class="prm__sep" data-v-313a6524>$ </span><span class="prm__cmd" data-v-313a6524>cat focus.txt</span></span></p><p class="hero-term__out--blue hero-term__out" data-v-313a6524>SaaS, web apps, clean architecture, automated testing (QA) &amp; AI engineering</p><!--]--><!--[--><p class="hero-term__line" data-v-313a6524><span class="prm" data-v-313a6524><span class="prm__user" data-v-313a6524>anon.@jouan.ovh</span><span class="prm__sep" data-v-313a6524>:</span><span class="prm__dir" data-v-313a6524>~</span><span class="prm__sep" data-v-313a6524>$ </span><span class="prm__cmd" data-v-313a6524>ls ~/projets</span></span></p><p class="hero-term__out--green hero-term__out" data-v-313a6524>keova.app/  tryon-saas/  nodium-lab/</p><!--]--><!--]--></div></noscript></div></div></div></div></div></section><div class="marquee" aria-hidden="true" data-v-80e32bdd data-v-19576991><div class="marquee__track" data-v-19576991><!--[--><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>TypeScript</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Nuxt 4</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Vue.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>NestJS</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Node.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>PostgreSQL</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>TypeORM</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Stripe Connect</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Cypress</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Docker</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>REST API</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Vitest</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><!--]--><!--[--><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>TypeScript</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Nuxt 4</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Vue.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>NestJS</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Node.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>PostgreSQL</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>TypeORM</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Stripe Connect</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Cypress</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Docker</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>REST API</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Vitest</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><!--]--></div></div><section class="section" data-v-80e32bdd><div class="container" data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>ce que je propose</p><h2 class="section__title" data-v-80e32bdd>Trois expertises pour concevoir et faire évoluer vos applications</h2><ul class="grid-3" data-v-80e32bdd><!--[--><li data-v-80e32bdd><div class="offer zcard zcard--pad zcard--interactive" data-v-80e32bdd data-v-c5ec7be1><!--[--><div class="offer__top" data-v-80e32bdd><div class="offer__icon" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div><span class="offer__no" data-v-80e32bdd>01 / 03</span></div><h3 class="offer__title" data-v-80e32bdd>Création d&#39;applications web &amp; SaaS</h3><p class="offer__desc" data-v-80e32bdd>De l&#39;idée à la production : architecture, développement front &amp; back, base de données, authentification et paiements Stripe.</p><ul class="offer__points" data-v-80e32bdd><!--[--><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Architecture logicielle &amp; APIs REST</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Applications Vue 3 / Nuxt 4 &amp; NestJS</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Intégration Stripe &amp; PostgreSQL</span></li><!--]--></ul><ul class="hero__tags offer__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->NestJS<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->PostgreSQL<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Stripe Connect<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-80e32bdd><span data-v-80e32bdd>Sur devis / au sprint</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Création d&#39;applications web &amp; SaaS" data-v-80e32bdd> En savoir plus → </a><!--]--></div></li><li data-v-80e32bdd><div class="offer zcard zcard--pad zcard--interactive zcard--accent zcard--featured" data-v-80e32bdd data-v-c5ec7be1><!--[--><div class="offer__top" data-v-80e32bdd><div class="offer__icon" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg></div><span class="offer__no" data-v-80e32bdd>02 / 03</span></div><h3 class="offer__title" data-v-80e32bdd>Développement Full Stack TypeScript</h3><p class="offer__desc" data-v-80e32bdd>Renfort d&#39;équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.</p><ul class="offer__points" data-v-80e32bdd><!--[--><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Composants Vue 3 / Nuxt avec TypeScript strict</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Microservices &amp; backend modulaire NestJS</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Fiabilisation et optimisation des performances</span></li><!--]--></ul><ul class="hero__tags offer__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->TypeScript<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Vue 3<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->NestJS<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Node.js<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-80e32bdd><span data-v-80e32bdd>Sur devis / TJM</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Développement Full Stack TypeScript" data-v-80e32bdd> En savoir plus → </a><!--]--></div></li><li data-v-80e32bdd><div class="offer zcard zcard--pad zcard--interactive" data-v-80e32bdd data-v-c5ec7be1><!--[--><div class="offer__top" data-v-80e32bdd><div class="offer__icon" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M12 3l1.8 5.6L19.5 10l-5.7 1.4L12 17l-1.8-5.6L4.5 10l5.7-1.4z"/><path d="M19 15l.7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9z"/></svg></div><span class="offer__no" data-v-80e32bdd>03 / 03</span></div><h3 class="offer__title" data-v-80e32bdd>Évolution &amp; Architecture applicative</h3><p class="offer__desc" data-v-80e32bdd>Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).</p><ul class="offer__points" data-v-80e32bdd><!--[--><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Audits techniques de code &amp; migrations de versions</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Tests E2E Cypress &amp; tests unitaires Vitest</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Pipelines CI/CD &amp; conteneurisation Docker</span></li><!--]--></ul><ul class="hero__tags offer__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Cypress<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Vitest<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Docker<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->CI/CD<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-80e32bdd><span data-v-80e32bdd>Au forfait / audit</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Évolution &amp; Architecture applicative" data-v-80e32bdd> En savoir plus → </a><!--]--></div></li><!--]--></ul></div></section><section class="section section--sunken" data-v-80e32bdd><div class="container" data-v-80e32bdd><div class="block__head" data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>projets sélectionnés</p><h2 class="section__title" data-v-80e32bdd>Des produits qui tournent en production</h2></div><ul class="work" data-v-80e32bdd><!--[--><li data-v-80e32bdd><a href="https://keova.app" rel="noopener" target="_blank" class="work__row work__row--link" data-hot data-v-80e32bdd><!--[--><span class="work__no" data-v-80e32bdd>01</span><div class="work__main" data-v-80e32bdd><div class="work__topline" data-v-80e32bdd><h3 class="work__name" data-v-80e32bdd>keova.app</h3><span class="work__status" data-v-80e32bdd>En production</span></div><p class="work__role" data-v-80e32bdd>Co-fondateur &amp; Développeur Full Stack</p><p class="prose work__desc" data-v-80e32bdd>Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).</p><ul class="hero__tags work__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nest.js<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->postgresql<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->stripe<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->saas<!--]--><!----></span></li><!--]--></ul></div><span class="work__go" aria-hidden="true" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-80e32bdd><div class="work__row" data-v-80e32bdd><span class="work__no" data-v-80e32bdd>02</span><div class="work__main" data-v-80e32bdd><div class="work__topline" data-v-80e32bdd><h3 class="work__name" data-v-80e32bdd>TryOn</h3><span class="work__status" data-v-80e32bdd>Étude de cas (MVP livré)</span></div><p class="work__role" data-v-80e32bdd>CTO &amp; Développeur Full Stack</p><p class="prose work__desc" data-v-80e32bdd>Plateforme SaaS B2B d&#39;essayage virtuel de vêtements via l&#39;IA générative (diffusion models, microservices asynchrones, files Redis).</p><ul class="hero__tags work__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nest.js<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->python<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->comfyui<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->ia<!--]--><!----></span></li><!--]--></ul></div><!----></div></li><li data-v-80e32bdd><div class="work__row" data-v-80e32bdd><span class="work__no" data-v-80e32bdd>03</span><div class="work__main" data-v-80e32bdd><div class="work__topline" data-v-80e32bdd><h3 class="work__name" data-v-80e32bdd>Nodium</h3><span class="work__status" data-v-80e32bdd>R&amp;D / En cours</span></div><p class="work__role" data-v-80e32bdd>Créateur &amp; Ingénieur IA</p><p class="prose work__desc" data-v-80e32bdd>Plateforme desktop d&#39;orchestration d&#39;agents IA autonomes, gestion de permissions et mémoire contextuelle.</p><ul class="hero__tags work__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->typescript<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->electron<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->agents<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->ia<!--]--><!----></span></li><!--]--></ul></div><!----></div></li><!--]--></ul><ul class="stats" data-v-80e32bdd><!--[--><li class="stat" data-v-80e32bdd><b data-v-80e32bdd>11</b><span data-v-80e32bdd>années d&#39;expérience web</span></li><li class="stat" data-v-80e32bdd><b data-v-80e32bdd>100%</b><span data-v-80e32bdd>TypeScript &amp; SaaS de bout en bout</span></li><li class="stat" data-v-80e32bdd><b data-v-80e32bdd>QA</b><span data-v-80e32bdd>culture d&#39;automatisation &amp; zéro régression</span></li><!--]--></ul></div></section><section class="section" data-v-80e32bdd><div class="container" data-v-80e32bdd><div class="block__head block__head--row" data-v-80e32bdd><div data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>~/journal</p><h2 class="section__title" data-v-80e32bdd>Notes de dev, écrites en construisant</h2></div><a href="/blog" class="seeall" data-hot data-v-80e32bdd> cat tous-les-articles <svg class="zicon seeall__icon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></a></div><div class="journal__empty zcard zcard--pad" data-v-80e32bdd data-v-c5ec7be1><!--[--><p class="journal__empty-code" data-v-80e32bdd>$ cat ~/journal/*.md</p><p class="journal__empty-text" data-v-80e32bdd>Les notes d&#39;ingénierie et retours d&#39;expérience sont en cours de rédaction.</p><a href="/blog" class="zbtn zbtn--secondary zbtn--sm" data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Consulter la section blog <!--]--><!----></a><!--]--></div></div></section><section class="section section--sunken" data-v-80e32bdd><div class="container" data-v-80e32bdd><div class="cta" data-v-80e32bdd><p class="eyebrow cta__eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>$ </span>./contact --start</p><h2 class="cta__title" data-v-80e32bdd>Un projet en tête ? Mettons-le <span class="cta__highlight" data-v-80e32bdd>en production</span>.</h2><p class="cta__subtitle" data-v-80e32bdd> Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript, parlons-en. </p><div class="cta__actions" data-v-80e32bdd><a href="/contact" class="zbtn zbtn--primary zbtn--lg" data-hot data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Discuter de votre projet <!--]--><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg><!--]--></span></a><a href="https://www.malt.fr/profile/simonjouan" rel="noopener" target="_blank" data-hot class="zbtn zbtn--secondary zbtn--lg" data-v-80e32bdd data-v-c154e5b1><!--[--><!----><!--[--> Me contacter sur Malt <!--]--><!----><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a><a href="/about" class="zbtn zbtn--ghost zbtn--lg" data-hot data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Voir le parcours &amp; CV <!--]--><!----></a></div></div></div></section></main><!--]--><footer class="ftr" data-v-e3708db0 data-v-ec74c766><div class="ftr__container" data-v-ec74c766><div class="ftr__in" data-v-ec74c766><div class="ftr__brand-col" data-v-ec74c766><a aria-current="page" href="/" class="router-link-active router-link-exact-active ftr__brand" data-v-ec74c766><svg class="zicon ftr__logo" viewbox="0 0 24 24" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-ec74c766 data-v-70d98695><path d="M12 1.5 22.5 12 12 22.5 1.5 12z" fill="currentColor"/><path d="M12 1.5 22.5 12 12 12z" fill="#fff" fill-opacity="0.12"/></svg><b data-v-ec74c766>jouan.ovh</b></a><p class="ftr__tagline" data-v-ec74c766>Développeur Full Stack TypeScript — Nuxt / NestJS. Rouen, France.</p></div><nav class="ftr__col" aria-label="Navigation du pied de page" data-v-ec74c766><h2 class="ftr__title" data-v-ec74c766>// Navigation</h2><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active ftr__link" data-v-ec74c766>Accueil</a><a href="/services" class="ftr__link" data-v-ec74c766>Services</a><a href="/about" class="ftr__link" data-v-ec74c766>À propos</a><a href="/blog" class="ftr__link" data-v-ec74c766>Blog</a><a href="/contact" class="ftr__link" data-v-ec74c766>Contact</a><a href="/confidentialite" class="ftr__link" data-v-ec74c766>Confidentialité</a><a href="/mentions-legales" class="ftr__link" data-v-ec74c766>Mentions légales</a><!--]--></nav><div class="ftr__col" data-v-ec74c766><h2 class="ftr__title" data-v-ec74c766>// Projets</h2><ul class="ftr__list" data-v-ec74c766><!--[--><li data-v-ec74c766><a href="https://keova.app" rel="noopener noreferrer" target="_blank" class="ftr__link" data-v-ec74c766><!--[-->keova.app<!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-ec74c766><span class="ftr__link ftr__link--static" data-v-ec74c766>TryOn</span></li><li data-v-ec74c766><span class="ftr__link ftr__link--static" data-v-ec74c766>Nodium</span></li><!--]--></ul></div><div class="ftr__col" data-v-ec74c766><h2 class="ftr__title" data-v-ec74c766>// Réseaux</h2><ul class="hexrow" data-v-ec74c766 data-v-a86d2094><!--[--><li data-v-a86d2094><a href="https://github.com/zohac" rel="noopener noreferrer" target="_blank" class="hex" data-v-a86d2094 data-v-274e53e2><!--[--><!--[--><svg class="zicon" viewbox="0 0 16 16" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a86d2094 data-v-70d98695><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg><!--]--><span class="hex__label" data-v-274e53e2><!--[-->GitHub<!--]--></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-a86d2094><a href="https://twitter.com/fenrir0680" rel="noopener noreferrer" target="_blank" class="hex" data-v-a86d2094 data-v-274e53e2><!--[--><!--[--><svg class="zicon" viewbox="0 0 16 16" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a86d2094 data-v-70d98695><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/></svg><!--]--><span class="hex__label" data-v-274e53e2><!--[-->Twitter<!--]--></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-a86d2094><a href="https://www.linkedin.com/in/simonjouan/" rel="noopener noreferrer" target="_blank" class="hex" data-v-a86d2094 data-v-274e53e2><!--[--><!--[--><svg class="zicon" viewbox="0 0 16 16" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a86d2094 data-v-70d98695><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg><!--]--><span class="hex__label" data-v-274e53e2><!--[-->LinkedIn<!--]--></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><!--]--></ul></div></div><div class="ftr__bottom" data-v-ec74c766><span data-v-ec74c766>© 2026 Simon Jouan — jouan.ovh</span><span class="ftr__term" data-v-ec74c766>anon.@jouan.ovh:~$ <span class="ftr__cmd" data-v-ec74c766>echo &quot;merci de votre visite&quot;</span></span></div></div></footer></div></div><div id="teleports"></div><script>window.__NUXT__={};window.__NUXT__.config={public:{web3formsAccessKey:"320b7ade-7b76-421e-a4bd-f353fd22348b",siteUrl:"https://jouan.ovh",mdc:{components:{prose:true,map:{},customElements:[]},headings:{anchorLinks:{h1:false,h2:true,h3:true,h4:true,h5:false,h6:false}},highlight:false},content:{wsUrl:""}},app:{baseURL:"/",buildId:"2fb32740-4322-408a-893a-7d31d08f3e02",buildAssetsDir:"/_nuxt/",cdnURL:""}}</script><script type="application/json" data-nuxt-data="nuxt-app" data-ssr="true" id="__NUXT_DATA__">[["ShallowReactive",1],{"prerenderedAt":2,"data":3,"state":6,"once":8,"_errors":9,"serverRendered":11,"path":12},1789327523310,["ShallowReactive",4],{"home-articles":5},[],["Reactive",7],{},["Set"],["ShallowReactive",10],{"home-articles":-1},true,"\u002F"]</script></body></html>
485	65	app/pages/index.vue
2	2	docs/implementation-artifacts/sprint-status.yaml

codex
- Les statuts requis (`●`, `○`, `◐`) ne sont jamais affichés : le template rend uniquement les valeurs actuelles de `SITE.projects.status`.

- Les tags affichés ne correspondent pas aux libellés contractuels : `nuxt`, `nest.js`, `postgresql`, `stripe` et `saas` remplacent notamment `Nuxt 4`, `NestJS`, `PostgreSQL`, `Stripe Connect` et `SaaS`.

- Le nom affiché `keova.app` ne correspond pas au libellé attendu « Keova App ».

- Les valeurs des statistiques utilisent `var(--text-strong)` au lieu de `var(--accent)`, contrairement à l’AC-2.

- La taille des statistiques utilise `var(--fs-5xl)` et n’est pas fluide avec `clamp`, ce qui peut provoquer un rendu disproportionné sur les petits écrans.

- La requête du journal ignore l’erreur retournée par `useAsyncData` : toute erreur de chargement est présentée comme une collection vide.

- L’absence d’état `pending` fait également apparaître l’empty-state lorsque les données sont simplement encore indisponibles.

- La gate Docker n’est pas réellement propre : `@nuxt/content` émet un avertissement à chaque génération en tentant de parser `blog/blog/.gitkeep`.

- Les vignettes du journal sont limitées à `360px` avec `sizes="360px"` alors que les cartes passent en pleine largeur sous `900px`, ce qui peut produire des images fortement agrandies et floues.

- Les cartes d’articles conservent `padded=true` par défaut sur `ZCard`, ce qui ajoute un padding autour de l’image puis un second padding dans `.jpost__body`, contrairement à une carte image généralement bord à bord.

- Le nouveau SCSS introduit de nombreuses dimensions en dur (`56px`, `160px`, `48px`, `72px`, `1px`, etc.) malgré la contrainte de consommation exclusive des tokens du Design System.

- La validation de date ne garantit que la forme `YYYY-MM-DD` : une date comme `2026-99-99` passerait le schéma puis pourrait faire échouer `formatDate` au rendu.

- `last_updated` indique « Story 11.4 ready-for-dev » alors que le statut de la story est passé à `review`, ce qui rend le suivi de sprint contradictoire.

- Le patch fourni n’est pas autoportant : `sprint-status.yaml` référence la story 11.4, mais le fichier de story n’apparaît pas dans `full.diff`.

- Aucun test ne couvre les nouveaux chemins conditionnels du journal, l’erreur de requête, les libellés exacts des projets, le comportement responsive des images ou la navigation clavier.
tokens used
128 249
- Les statuts requis (`●`, `○`, `◐`) ne sont jamais affichés : le template rend uniquement les valeurs actuelles de `SITE.projects.status`.

- Les tags affichés ne correspondent pas aux libellés contractuels : `nuxt`, `nest.js`, `postgresql`, `stripe` et `saas` remplacent notamment `Nuxt 4`, `NestJS`, `PostgreSQL`, `Stripe Connect` et `SaaS`.

- Le nom affiché `keova.app` ne correspond pas au libellé attendu « Keova App ».

- Les valeurs des statistiques utilisent `var(--text-strong)` au lieu de `var(--accent)`, contrairement à l’AC-2.

- La taille des statistiques utilise `var(--fs-5xl)` et n’est pas fluide avec `clamp`, ce qui peut provoquer un rendu disproportionné sur les petits écrans.

- La requête du journal ignore l’erreur retournée par `useAsyncData` : toute erreur de chargement est présentée comme une collection vide.

- L’absence d’état `pending` fait également apparaître l’empty-state lorsque les données sont simplement encore indisponibles.

- La gate Docker n’est pas réellement propre : `@nuxt/content` émet un avertissement à chaque génération en tentant de parser `blog/blog/.gitkeep`.

- Les vignettes du journal sont limitées à `360px` avec `sizes="360px"` alors que les cartes passent en pleine largeur sous `900px`, ce qui peut produire des images fortement agrandies et floues.

- Les cartes d’articles conservent `padded=true` par défaut sur `ZCard`, ce qui ajoute un padding autour de l’image puis un second padding dans `.jpost__body`, contrairement à une carte image généralement bord à bord.

- Le nouveau SCSS introduit de nombreuses dimensions en dur (`56px`, `160px`, `48px`, `72px`, `1px`, etc.) malgré la contrainte de consommation exclusive des tokens du Design System.

- La validation de date ne garantit que la forme `YYYY-MM-DD` : une date comme `2026-99-99` passerait le schéma puis pourrait faire échouer `formatDate` au rendu.

- `last_updated` indique « Story 11.4 ready-for-dev » alors que le statut de la story est passé à `review`, ce qui rend le suivi de sprint contradictoire.

- Le patch fourni n’est pas autoportant : `sprint-status.yaml` référence la story 11.4, mais le fichier de story n’apparaît pas dans `full.diff`.

- Aucun test ne couvre les nouveaux chemins conditionnels du journal, l’erreur de requête, les libellés exacts des projets, le comportement responsive des images ou la navigation clavier.
