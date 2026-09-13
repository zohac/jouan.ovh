Reading prompt from stdin...
2026-09-13T08:36:11.190731Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: high
reasoning summaries: none
session id: 01a099e8-e23d-7ad0-a312-d608ca486551
--------
user
# Blind Hunter Prompt — Story 10.5

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/10-5/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
I’m using `bmad-review-adversarial-general` to perform the requested skeptical review of the specified diff and report only actionable finding descriptions.
exec
/bin/zsh -lc 'cat /Users/simon/dev/jouan.ovh/.agents/skills/bmad-review-adversarial-general/SKILL.md' in /Users/simon/dev/jouan.ovh
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
/bin/zsh -lc "wc -l docs/implementation-artifacts/code-reviews/10-5/full.diff && sed -n '1,260p' docs/implementation-artifacts/code-reviews/10-5/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     517 docs/implementation-artifacts/code-reviews/10-5/full.diff
diff --git a/app/app.vue b/app/app.vue
index 84b23a4..6016dd4 100644
--- a/app/app.vue
+++ b/app/app.vue
@@ -4,4 +4,29 @@
   </NuxtLayout>
 </template>
 
+<script setup lang="ts">
+import { SITE } from "~/data/site";
+
+// Métadonnées Schema.org globales (Organization / publisher du site).
+// Résolues depuis runtimeConfig (useSiteUrl) et les données partagées (SITE).
+const siteUrl = useSiteUrl();
+
+const organizationJsonLd = {
+  "@context": "https://schema.org",
+  "@type": "Organization",
+  name: SITE.profile.name,
+  url: siteUrl,
+  logo: `${siteUrl}/images/logo.png`,
+  email: SITE.profile.email,
+  address: {
+    "@type": "PostalAddress",
+    addressLocality: SITE.profile.city,
+  },
+};
+
+useHead({
+  script: [jsonLdScript(organizationJsonLd)],
+});
+</script>
+
 <style lang="scss" scoped></style>
diff --git a/app/composables/usePageSeo.ts b/app/composables/usePageSeo.ts
new file mode 100644
index 0000000..6a238eb
--- /dev/null
+++ b/app/composables/usePageSeo.ts
@@ -0,0 +1,103 @@
+import { computed, toValue, type MaybeRefOrGetter } from "vue";
+import { useSiteUrl } from "./useSiteUrl";
+
+export interface PageSeoOptions {
+  /** Titre de la page (utilisé pour <title>, og:title, twitter:title). */
+  title: string;
+  /** Description de la page (utilisée pour <meta name="description">, og:description, twitter:description). */
+  description: string;
+  /** Chemin relatif de la page (ex. "/" ou "/services" ou "/blog/slug"). Si omis, résolu sur siteUrl. */
+  path?: string;
+  /** Chemin relatif ou absolu de l'image OG/Twitter (ex. "/images/portrait.jpeg"). Résolue en URL absolue. */
+  image?: string;
+  /** Type Open Graph : "website" (défaut), "article" ou "profile". */
+  type?: "website" | "article" | "profile";
+  /** Format Twitter Card : si omis, "summary_large_image" si type article avec image, sinon "summary". */
+  twitterCard?: "summary" | "summary_large_image";
+  /** Données JSON-LD (objet Schema.org ou tableau d'objets) injectées via jsonLdScript. */
+  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
+}
+
+/**
+ * Composable centralisant la déclaration des métadonnées SEO par page :
+ * <title>, canonical, description, Open Graph (type, title, desc, url, image)
+ * et Twitter Card (card, title, desc, image) + JSON-LD échappé.
+ *
+ * Résout automatiquement les URLs absolues à partir de `useSiteUrl()` (runtimeConfig).
+ */
+export function usePageSeo(options: MaybeRefOrGetter<PageSeoOptions | undefined | null>): void {
+  const siteUrl = useSiteUrl();
+
+  const seo = computed(() => {
+    const opts = toValue(options);
+    if (!opts) {
+      return null;
+    }
+
+    const rawPath = opts.path ?? "";
+    const cleanPath = rawPath === "" || rawPath === "/" ? "" : rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
+    const canonicalUrl = cleanPath ? `${siteUrl}${cleanPath}` : siteUrl;
+
+    let imageUrl: string | undefined;
+    if (opts.image) {
+      imageUrl =
+        opts.image.startsWith("http://") || opts.image.startsWith("https://")
+          ? opts.image
+          : `${siteUrl}${opts.image.startsWith("/") ? opts.image : `/${opts.image}`}`;
+    }
+
+    const type = opts.type ?? "website";
+    const twitterCard =
+      opts.twitterCard ??
+      (imageUrl && (type === "article" || opts.twitterCard === "summary_large_image")
+        ? "summary_large_image"
+        : "summary");
+
+    return {
+      title: opts.title,
+      description: opts.description,
+      canonicalUrl,
+      imageUrl,
+      type,
+      twitterCard,
+      jsonLd: opts.jsonLd,
+    };
+  });
+
+  useHead(() => {
+    if (!seo.value) {
+      return {};
+    }
+
+    const scripts: Array<{ type: string; innerHTML: string }> = [];
+    if (seo.value.jsonLd) {
+      if (Array.isArray(seo.value.jsonLd)) {
+        for (const item of seo.value.jsonLd) {
+          scripts.push(jsonLdScript(item));
+        }
+      } else {
+        scripts.push(jsonLdScript(seo.value.jsonLd));
+      }
+    }
+
+    return {
+      title: seo.value.title,
+      link: [{ rel: "canonical", href: seo.value.canonicalUrl }],
+      script: scripts,
+    };
+  });
+
+  useSeoMeta({
+    title: () => seo.value?.title,
+    description: () => seo.value?.description,
+    ogTitle: () => seo.value?.title,
+    ogDescription: () => seo.value?.description,
+    ogUrl: () => seo.value?.canonicalUrl,
+    ogType: () => seo.value?.type,
+    ogImage: () => seo.value?.imageUrl,
+    twitterCard: () => seo.value?.twitterCard,
+    twitterTitle: () => seo.value?.title,
+    twitterDescription: () => seo.value?.description,
+    twitterImage: () => seo.value?.imageUrl,
+  });
+}
diff --git a/app/pages/about.vue b/app/pages/about.vue
index 997bc7f..3266cce 100644
--- a/app/pages/about.vue
+++ b/app/pages/about.vue
@@ -133,29 +133,30 @@ const degrees = [
 const pageTitle = "À propos — jouan.ovh";
 const pageDescription =
   "Développeur web freelance à Valognes, je conçois des applications en PHP/Symfony, des sites WordPress sur-mesure et des produits Node.js / Nest.js / Nuxt.js — voici mon parcours.";
-// URL de prod lue depuis runtimeConfig via useSiteUrl() (swappable staging/prod, sans
-// domaine en dur). Inchangée en staging → canonical/og restent sur le domaine staging.
+
 const siteUrl = useSiteUrl();
-const pageUrl = `${siteUrl}/about`;
-const pageImage = `${siteUrl}/images/portrait.jpeg`;
+const aboutJsonLd = {
+  "@context": "https://schema.org",
+  "@type": "ProfilePage",
+  name: pageTitle,
+  url: `${siteUrl}/about`,
+  mainEntity: {
+    "@type": "Person",
+    name: "Simon Jouan",
+    jobTitle: "Développeur web freelance",
+    url: siteUrl,
+    image: `${siteUrl}/images/portrait.jpeg`,
+  },
+};
 
-useHead({
+usePageSeo({
   title: pageTitle,
-  link: [{ rel: "canonical", href: pageUrl }],
-  meta: [
-    { name: "description", content: pageDescription },
-    // Open Graph (partage Facebook/LinkedIn…).
-    { property: "og:type", content: "profile" },
-    { property: "og:title", content: pageTitle },
-    { property: "og:description", content: pageDescription },
-    { property: "og:url", content: pageUrl },
-    { property: "og:image", content: pageImage },
-    // Twitter Card.
-    { name: "twitter:card", content: "summary" },
-    { name: "twitter:title", content: pageTitle },
-    { name: "twitter:description", content: pageDescription },
-    { name: "twitter:image", content: pageImage },
-  ],
+  description: pageDescription,
+  path: "/about",
+  image: "/images/portrait.jpeg",
+  type: "profile",
+  twitterCard: "summary",
+  jsonLd: aboutJsonLd,
 });
 </script>
 
diff --git a/app/pages/blog/[...slug].vue b/app/pages/blog/[...slug].vue
index 155153b..0cda25f 100644
--- a/app/pages/blog/[...slug].vue
+++ b/app/pages/blog/[...slug].vue
@@ -108,14 +108,13 @@ if (import.meta.client) {
   });
 }
 
-// SEO par article (parité avec /about et /blog). URL de prod via useSiteUrl()
-// (runtimeConfig, swappable staging/prod) ; capturée dans le setup, hors du getter useHead
-// (un composable ne s'appelle pas dans un callback).
+// SEO par article (centralisé via usePageSeo, parité /about, /blog).
+// usePageSeo résout siteUrl, canonical, og:*, twitter:* et le JSON-LD échappé.
 const siteUrl = useSiteUrl();
-useHead(() => {
+usePageSeo(() => {
   const article = page.value;
   if (!article) {
-    return {};
+    return null;
   }
   const url = `${siteUrl}${article.path}`;
   const image = article.image ? `${siteUrl}${article.image.src}` : undefined;
@@ -130,22 +129,14 @@ useHead(() => {
     ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
     ...(image ? { image } : {}),
   };
+
   return {
     title: `${article.title} — jouan.ovh`,
-    link: [{ rel: "canonical", href: url }],
-    meta: [
-      { name: "description", content: article.description },
-      { property: "og:type", content: "article" },
-      { property: "og:title", content: article.title },
-      { property: "og:description", content: article.description },
-      { property: "og:url", content: url },
-      ...(image ? [{ property: "og:image", content: image }] : []),
-      { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
-      { name: "twitter:title", content: article.title },
-      { name: "twitter:description", content: article.description },
-      ...(image ? [{ name: "twitter:image", content: image }] : []),
-    ],
-    script: [jsonLdScript(jsonLd)],
+    description: article.description,
+    path: article.path,
+    image: article.image?.src,
+    type: "article",
+    jsonLd,
   };
 });
 </script>
diff --git a/app/pages/blog/index.vue b/app/pages/blog/index.vue
index a4fcc16..73aca76 100644
--- a/app/pages/blog/index.vue
+++ b/app/pages/blog/index.vue
@@ -123,22 +123,12 @@ const blogJsonLd = {
   })),
 };
 
-useHead({
+usePageSeo({

exec
/bin/zsh -lc "sed -n '261,560p' docs/implementation-artifacts/code-reviews/10-5/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
   title: pageTitle,
-  link: [{ rel: "canonical", href: pageUrl }],
-  meta: [
-    { name: "description", content: pageDescription },
-    // Open Graph (partage Facebook/LinkedIn…).
-    { property: "og:type", content: "website" },
-    { property: "og:title", content: pageTitle },
-    { property: "og:description", content: pageDescription },
-    { property: "og:url", content: pageUrl },
-    // Twitter Card.
-    { name: "twitter:card", content: "summary" },
-    { name: "twitter:title", content: pageTitle },
-    { name: "twitter:description", content: pageDescription },
-  ],
-  script: [jsonLdScript(blogJsonLd)],
+  description: pageDescription,
+  path: "/blog",
+  type: "website",
+  jsonLd: blogJsonLd,
 });
 </script>
 
diff --git a/app/pages/contact.vue b/app/pages/contact.vue
index 0680a12..ce95b45 100644
--- a/app/pages/contact.vue
+++ b/app/pages/contact.vue
@@ -250,15 +250,34 @@ async function onSubmit(): Promise<void> {
   }
 }
 
-useHead({
-  title: "Contact — jouan.ovh",
-  meta: [
-    {
-      name: "description",
-      content:
-        "Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h.",
+const siteUrl = useSiteUrl();
+
+const contactJsonLd = {
+  "@context": "https://schema.org",
+  "@type": "ContactPage",
+  name: "Contact — jouan.ovh",
+  description:
+    "Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h.",
+  url: `${siteUrl}/contact`,
+  mainEntity: {
+    "@type": "Person",
+    name: SITE.profile.name,
+    email: SITE.profile.email,
+    address: {
+      "@type": "PostalAddress",
+      addressLocality: SITE.profile.city,
     },
-  ],
+  },
+};
+
+usePageSeo({
+  title: "Contact — jouan.ovh",
+  description:
+    "Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h.",
+  path: "/contact",
+  image: "/images/portrait.jpeg",
+  type: "website",
+  jsonLd: contactJsonLd,
 });
 </script>
 
diff --git a/app/pages/index.vue b/app/pages/index.vue
index f6139f4..6d5bc04 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -180,6 +180,40 @@ const terminalRows = [
 // header). No-op tant qu'aucun terminal n'est disponible (prerender). La
 // restylisation du terminal lui-même relève d'Epic 8.
 const { open: openTerminal } = useTerminal();
+
+const siteUrl = useSiteUrl();
+const homeJsonLd = [
+  {
+    "@context": "https://schema.org",
+    "@type": "WebSite",
+    name: "Simon Jouan — Développeur web freelance",
+    url: siteUrl,
+    description: tagline,
+  },
+  {
+    "@context": "https://schema.org",
+    "@type": "Person",
+    name: SITE.profile.name,
+    jobTitle: SITE.profile.role,
+    url: siteUrl,
+    image: `${siteUrl}/images/portrait.jpeg`,
+    email: SITE.profile.email,
+    address: {
+      "@type": "PostalAddress",
+      addressLocality: SITE.profile.city,
+    },
+  },
+];
+
+usePageSeo({
+  title: "Simon Jouan — Développeur web freelance & IA",
+  description:
+    "Développeur web freelance à Valognes (Normandie) : création de sites WordPress sur-mesure, applications web (PHP/Symfony, Nest.js, Nuxt) et intégrations d'IA.",
+  path: "/",
+  image: "/images/portrait.jpeg",
+  type: "website",
+  jsonLd: homeJsonLd,
+});
 </script>
 
 <style lang="scss" scoped>
diff --git a/app/pages/services.vue b/app/pages/services.vue
index 83fb5a1..b458474 100644
--- a/app/pages/services.vue
+++ b/app/pages/services.vue
@@ -127,15 +127,35 @@ const steps = [
   { n: "04", title: "Livraison & suivi", desc: "Mise en ligne, documentation, et accompagnement." },
 ];
 
-useHead({
+const siteUrl = useSiteUrl();
+
+const servicesJsonLd = {
+  "@context": "https://schema.org",
+  "@type": "WebPage",
+  name: "Services — jouan.ovh",
+  description:
+    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
+  url: `${siteUrl}/services`,
+  mainEntity: {
+    "@type": "ItemList",
+    itemListElement: offers.map((offer, index) => ({
+      "@type": "Offer",
+      position: index + 1,
+      name: offer.title,
+      description: offer.desc,
+      price: offer.price,
+    })),
+  },
+};
+
+usePageSeo({
   title: "Services — jouan.ovh",
-  meta: [
-    {
-      name: "description",
-      content:
-        "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
-    },
-  ],
+  description:
+    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
+  path: "/services",
+  image: "/images/portrait.jpeg",
+  type: "website",
+  jsonLd: servicesJsonLd,
 });
 </script>
 
diff --git a/docs/implementation-artifacts/10-5-seo-centralise-site-wide.md b/docs/implementation-artifacts/10-5-seo-centralise-site-wide.md
index 1c23450..fbbe359 100644
--- a/docs/implementation-artifacts/10-5-seo-centralise-site-wide.md
+++ b/docs/implementation-artifacts/10-5-seo-centralise-site-wide.md
@@ -4,7 +4,7 @@ baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
 
 # Story 10.5: SEO centralisé site-wide
 
-Status: ready-for-dev
+Status: review
 
 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
 
@@ -23,17 +23,17 @@ so that le site est correctement indexé et présenté lors d'un partage (FR15).
 
 ## Tasks / Subtasks
 
-- [ ] Tâche 1 — Factoriser un helper SEO partagé (AC: #1)
-  - [ ] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
-  - [ ] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).
-- [ ] Tâche 2 — Étendre aux pages nues (AC: tout)
-  - [ ] **Home `app/pages/index.vue`** : ajouter `usePageSeo` (aujourd'hui **aucune** meta dédiée → hérite seulement de `app.head` de `nuxt.config.ts`). OG/Twitter/canonical + JSON-LD (`WebSite`/`Person` selon pertinence) + image OG.
-  - [ ] **Services `app/pages/services.vue`** : passer de `title`+`description` seuls à OG/Twitter/canonical + JSON-LD (`Service`/`WebPage`).
-  - [ ] **Contact `app/pages/contact.vue`** : idem (OG/Twitter/canonical + `ContactPage`).
-  - [ ] **Migrer `/about` + `/blog` + article** vers le helper partagé **sans régresser** leur SEO existant (ils ont déjà OG/Twitter/canonical + JSON-LD via `SITE_URL`/`jsonLdScript`) — dédup, rendu identique.
-- [ ] Tâche 3 — Validation (AC: tout)
-  - [ ] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts (11 routes).
-  - [ ] Inspecter le HTML **prerendu** (`.output/public/index.html`, `services/index.html`, `contact/index.html`, + re-vérifier `about`/`blog`) : présence de `og:*`, `twitter:*`, `<link rel="canonical">`, `<script type="application/ld+json">` ; URLs absolues résolues depuis `runtimeConfig` (staging tant que non basculé).
+- [x] Tâche 1 — Factoriser un helper SEO partagé (AC: #1)
+  - [x] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
+  - [x] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).
+- [x] Tâche 2 — Étendre aux pages nues (AC: tout)
+  - [x] **Home `app/pages/index.vue`** : ajouter `usePageSeo` (aujourd'hui **aucune** meta dédiée → hérite seulement de `app.head` de `nuxt.config.ts`). OG/Twitter/canonical + JSON-LD (`WebSite`/`Person` selon pertinence) + image OG.
+  - [x] **Services `app/pages/services.vue`** : passer de `title`+`description` seuls à OG/Twitter/canonical + JSON-LD (`Service`/`WebPage`).
+  - [x] **Contact `app/pages/contact.vue`** : idem (OG/Twitter/canonical + `ContactPage`).
+  - [x] **Migrer `/about` + `/blog` + article** vers le helper partagé **sans régresser** leur SEO existant (ils ont déjà OG/Twitter/canonical + JSON-LD via `SITE_URL`/`jsonLdScript`) — dédup, rendu identique.
+- [x] Tâche 3 — Validation (AC: tout)
+  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts (11 routes).
+  - [x] Inspecter le HTML **prerendu** (`.output/public/index.html`, `services/index.html`, `contact/index.html`, + re-vérifier `about`/`blog`) : présence de `og:*`, `twitter:*`, `<link rel="canonical">`, `<script type="application/ld+json">` ; URLs absolues résolues depuis `runtimeConfig` (staging tant que non basculé).
 
 ## Dev Notes
 
@@ -79,9 +79,30 @@ so that le site est correctement indexé et présenté lors d'un partage (FR15).
 ## Dev Agent Record
 
 ### Agent Model Used
+- Gemini 3.7 Flash
 
 ### Debug Log References
+- Build & gate : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> 0 error, 11 prerendered routes.
+- HTML inspection : `.output/public/{index,services,contact,about,blog}/index.html` checked for `<title>`, `<meta name="description">`, `og:*`, `twitter:*`, `<link rel="canonical">`, and `<script type="application/ld+json">`.
 
 ### Completion Notes List
+- Création de `app/composables/usePageSeo.ts` qui centralise `useSeoMeta`, `<link rel="canonical">` et l'injection JSON-LD échappée via `jsonLdScript()`.
+- Injection du schéma global `Organization` dans `app/app.vue` alimenté par `useSiteUrl()` et `SITE.profile`.
+- Ajout des métadonnées SEO et schémas Schema.org (`WebSite`, `Person`, `Service`/`WebPage`, `ContactPage`, `ProfilePage`, `Blog`, `BlogPosting`) sur toutes les pages (`/`, `/services`, `/contact`, `/about`, `/blog`, `/blog/[...slug]`).
+- Aucune URL hardcodée : résolution dynamique via `useSiteUrl()`.
+- Validation complète via Docker (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) avec 11 routes prerendues avec succès et inspection conforme du HTML généré.
 
 ### File List
+- `app/composables/usePageSeo.ts` (NEW)
+- `app/app.vue` (MODIFIED)
+- `app/pages/index.vue` (MODIFIED)
+- `app/pages/services.vue` (MODIFIED)
+- `app/pages/contact.vue` (MODIFIED)
+- `app/pages/about.vue` (MODIFIED)
+- `app/pages/blog/index.vue` (MODIFIED)
+- `app/pages/blog/[...slug].vue` (MODIFIED)
+- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
+- `docs/implementation-artifacts/10-5-seo-centralise-site-wide.md` (MODIFIED)
+
+## Change Log
+- 2026-09-13 : Implémentation complète de la Story 10.5 — Centralisation du SEO et Schema.org site-wide via `usePageSeo` et `useSiteUrl()`. Statut passé à `review`.
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 7ccabba..dd09c09 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-13 (Story 10.3 soldée par revue de code : 100% liens _blank unifiés sur ZExternalLink, noopener garanti, statut done)"
+last_updated: "2026-09-13 (Story 10.5 prête pour revue : SEO centralisé site-wide via usePageSeo, statut review)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -112,7 +112,7 @@ development_status:
   10-2-a11y-semantique-residuelle: done
   10-3-liens-externes-accessibles: done
   10-4-validation-a11y-emulee-et-unification-forced-colors: done
-  10-5-seo-centralise-site-wide: ready-for-dev
+  10-5-seo-centralise-site-wide: review
   10-6-conformite-legale-rgpd-mentions: ready-for-dev
   10-7-mise-en-production-reelle: ready-for-dev
   epic-10-retrospective: optional

codex
The diff is readable. I’m checking the surrounding composables, runtime configuration, and existing JSON-LD helpers now so the findings distinguish real regressions from merely stylistic concerns.
exec
/bin/zsh -lc "sed -n '1,180p' nuxt.config.ts; sed -n '1,220p' app/pages/blog/'[...slug].vue'; sed -n '1,220p' app/pages/blog/index.vue" in /Users/simon/dev/jouan.ovh
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
  const image = article.image ? `${siteUrl}${article.image.src}` : undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: { "@type": "Person", name: "Simon Jouan" },
    url,
    ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
    ...(image ? { image } : {}),
  };

  return {
    title: `${article.title} — jouan.ovh`,
    description: article.description,
    path: article.path,
    image: article.image?.src,
    type: "article",
    jsonLd,
  };
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / Blog.jsx */
// .section / .container / .prose / .hero__tags / .post__meta sont des primitives de
// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
.blog-article {
  display: block;
}

// ---- Conteneur article (porté de kit.css : .article) ----
.article {
  max-width: 760px;
  margin: 0 auto;
}

// Lien retour (porté de kit.css : .hdr__link) — mono discret, soulignement + ring au focus.
.article__back {
  display: inline-block;
  margin-bottom: var(--space-5);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
  text-decoration: none;

  &:hover {
    color: var(--text-strong);
  }

  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 2px;
    border-radius: var(--radius-xs);
    box-shadow: var(--ring-accent);
  }
}

.article__tags {
  margin-bottom: var(--space-4);
}

// Titre article (porté de kit.css : .article h1).
.article__title {
  margin-bottom: var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--fs-4xl);
  font-weight: var(--fw-light);
  line-height: var(--lh-tight);
  color: var(--text-strong);
}

// Méta : base mono via .post__meta (global) ; ici on ajoute la marge de l'en-tête.
.article__meta {
  margin: var(--space-4) 0 var(--space-8);
}

// Image héro (porté de kit.css : .article__hero).
.article__hero {
  width: 100%;
  height: 320px;
  margin-bottom: var(--space-8);
  object-fit: cover;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
}

// ---- Prose (HTML généré par @nuxt/content → cibler via :deep()) ----
// .prose (global) donne déjà font-sans / lh-relaxed / text-body. Ici : taille + rythme
// vertical + titres + code, fidèles à kit.css (.article .prose ...).
.article__prose {
  font-size: var(--fs-md);

  :deep(p) {
    margin: 0 0 var(--space-5);
  }

  :deep(h2) {
    margin: var(--space-8) 0 var(--space-3);
    font-family: var(--font-mono);
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
    url: `${siteUrl}${article.path}`,
    ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
    ...(article.image ? { image: `${siteUrl}${article.image.src}` } : {}),
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
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  line-height: var(--lh-relaxed);
  color: var(--text-body);
}

// .post__meta : primitive globale (base/_layout.scss), partagée avec la vue article.

// ---- Empty-state / erreur (ZCard centrée, illustration + message) ----
.blog__notice {
  max-width: 60ch;
  margin: 0 auto;
  text-align: center;
}

.blog__notice-img {
  width: 220px;
  height: auto;
  margin: 0 auto var(--space-6);

exec
/bin/zsh -lc "sed -n '1,220p' app/composables/useSiteUrl.ts; sed -n '1,180p' app/utils/jsonLdScript.ts 2>/dev/null || true; sed -n '1,180p' app/data/site.ts" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
// URL publique du site (canonical / og:url / JSON-LD) — point d'accès unique.
// La valeur vient de `runtimeConfig.public.siteUrl` (défaut staging dans nuxt.config,
// surchargeable par NUXT_PUBLIC_SITE_URL). ⚠️ `useRuntimeConfig()` n'est
// appelable QUE dans un contexte Nuxt (setup de composant, plugin, middleware) — d'où ce
// composable, à consommer dans le `<script setup>` des pages, pas au niveau module d'un util
// pur (raison pour laquelle l'ancienne constante `SITE_URL` de app/utils/seo.ts a été retirée).
export function useSiteUrl(): string {
  const siteUrl = useRuntimeConfig().public.siteUrl;
  // Garde-fou fail-fast (décision D1, revue 2026-07-02) : une valeur vide ou non absolue
  // émettrait des canonical/og:url/JSON-LD RELATIFS silencieusement cassés (ex. une ligne
  // `NUXT_PUBLIC_SITE_URL=` vide décommentée dans .env → siteUrl=""). On fait plutôt
  // échouer le prerender (`generate`) tôt et bruyamment plutôt que de livrer du SEO cassé.
  let url: URL;
  try {
    url = new URL(siteUrl);
  } catch {
    throw new Error(
      `[useSiteUrl] runtimeConfig.public.siteUrl doit être une URL absolue (http[s]://), ` +
        `reçu ${JSON.stringify(siteUrl)}. Corriger le défaut dans nuxt.config.ts ou l'env NUXT_PUBLIC_SITE_URL.`,
    );
  }

  const isHttpProtocol = url.protocol === "http:" || url.protocol === "https:";
  const isOriginOnly = url.pathname === "/" && url.search === "" && url.hash === "";
  if (!isHttpProtocol || !url.hostname || !isOriginOnly) {
    throw new Error(
      `[useSiteUrl] runtimeConfig.public.siteUrl doit être une origin http(s) sans chemin, query ni hash, ` +
        `reçu ${JSON.stringify(siteUrl)}. Corriger le défaut dans nuxt.config.ts ou l'env NUXT_PUBLIC_SITE_URL.`,
    );
  }

  // Retourne l'origin normalisée pour une concaténation sûre (`${siteUrl}/about`),
  // y compris si l'override est saisi avec un slash final.
  return url.origin;
}
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

exec
/bin/zsh -lc 'rg -n "function jsonLdScript|const jsonLdScript|jsonLdScript|useSiteUrl|siteUrl|usePageSeo|useSeoMeta|Organization|offers|price" app nuxt.config.* package.json' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
nuxt.config.ts:58:      // composable useSiteUrl(). Valeur inlinée au prerender (`nuxi generate`).
nuxt.config.ts:59:      siteUrl: "https://dev.jouan.ovh",
app/pages/about.vue:137:const siteUrl = useSiteUrl();
app/pages/about.vue:142:  url: `${siteUrl}/about`,
app/pages/about.vue:147:    url: siteUrl,
app/pages/about.vue:148:    image: `${siteUrl}/images/portrait.jpeg`,
app/pages/about.vue:152:usePageSeo({
app/pages/blog/[...slug].vue:111:// SEO par article (centralisé via usePageSeo, parité /about, /blog).
app/pages/blog/[...slug].vue:112:// usePageSeo résout siteUrl, canonical, og:*, twitter:* et le JSON-LD échappé.
app/pages/blog/[...slug].vue:113:const siteUrl = useSiteUrl();
app/pages/blog/[...slug].vue:114:usePageSeo(() => {
app/pages/blog/[...slug].vue:119:  const url = `${siteUrl}${article.path}`;
app/pages/blog/[...slug].vue:120:  const image = article.image ? `${siteUrl}${article.image.src}` : undefined;
app/pages/blog/index.vue:99:// Métadonnées de la page. URL de prod lue depuis runtimeConfig via useSiteUrl()
app/pages/blog/index.vue:101:const siteUrl = useSiteUrl();
app/pages/blog/index.vue:105:const pageUrl = `${siteUrl}/blog`;
app/pages/blog/index.vue:120:    url: `${siteUrl}${article.path}`,
app/pages/blog/index.vue:122:    ...(article.image ? { image: `${siteUrl}${article.image.src}` } : {}),
app/pages/blog/index.vue:126:usePageSeo({
app/pages/services.vue:14:          <li v-for="offer in offers" :key="offer.id">
app/pages/services.vue:25:              <div class="offer__price">
app/pages/services.vue:26:                <b>{{ offer.price }}</b>
app/pages/services.vue:83:  price: string;
app/pages/services.vue:90:const offers: Offer[] = [
app/pages/services.vue:97:    price: "à partir de 1 500 €",
app/pages/services.vue:106:    price: "sur devis",
app/pages/services.vue:115:    price: "sur devis",
app/pages/services.vue:130:const siteUrl = useSiteUrl();
app/pages/services.vue:138:  url: `${siteUrl}/services`,
app/pages/services.vue:141:    itemListElement: offers.map((offer, index) => ({
app/pages/services.vue:146:      price: offer.price,
app/pages/services.vue:151:usePageSeo({
app/pages/services.vue:268:.offer__price {
app/pages/contact.vue:253:const siteUrl = useSiteUrl();
app/pages/contact.vue:261:  url: `${siteUrl}/contact`,
app/pages/contact.vue:273:usePageSeo({
app/pages/index.vue:184:const siteUrl = useSiteUrl();
app/pages/index.vue:190:    url: siteUrl,
app/pages/index.vue:198:    url: siteUrl,
app/pages/index.vue:199:    image: `${siteUrl}/images/portrait.jpeg`,
app/pages/index.vue:208:usePageSeo({
app/composables/useSiteUrl.ts:2:// La valeur vient de `runtimeConfig.public.siteUrl` (défaut staging dans nuxt.config,
app/composables/useSiteUrl.ts:7:export function useSiteUrl(): string {
app/composables/useSiteUrl.ts:8:  const siteUrl = useRuntimeConfig().public.siteUrl;
app/composables/useSiteUrl.ts:11:  // `NUXT_PUBLIC_SITE_URL=` vide décommentée dans .env → siteUrl=""). On fait plutôt
app/composables/useSiteUrl.ts:15:    url = new URL(siteUrl);
app/composables/useSiteUrl.ts:18:      `[useSiteUrl] runtimeConfig.public.siteUrl doit être une URL absolue (http[s]://), ` +
app/composables/useSiteUrl.ts:19:        `reçu ${JSON.stringify(siteUrl)}. Corriger le défaut dans nuxt.config.ts ou l'env NUXT_PUBLIC_SITE_URL.`,
app/composables/useSiteUrl.ts:27:      `[useSiteUrl] runtimeConfig.public.siteUrl doit être une origin http(s) sans chemin, query ni hash, ` +
app/composables/useSiteUrl.ts:28:        `reçu ${JSON.stringify(siteUrl)}. Corriger le défaut dans nuxt.config.ts ou l'env NUXT_PUBLIC_SITE_URL.`,
app/composables/useSiteUrl.ts:32:  // Retourne l'origin normalisée pour une concaténation sûre (`${siteUrl}/about`),
app/utils/seo.ts:4:// `runtimeConfig.public.siteUrl` via le composable `useSiteUrl()`
app/utils/seo.ts:5:// (app/composables/useSiteUrl.ts) — swappable staging/prod sans domaine en dur.
app/utils/seo.ts:12:export function jsonLdScript(data: Record<string, unknown>) {
app/composables/usePageSeo.ts:2:import { useSiteUrl } from "./useSiteUrl";
app/composables/usePageSeo.ts:9:  /** Chemin relatif de la page (ex. "/" ou "/services" ou "/blog/slug"). Si omis, résolu sur siteUrl. */
app/composables/usePageSeo.ts:17:  /** Données JSON-LD (objet Schema.org ou tableau d'objets) injectées via jsonLdScript. */
app/composables/usePageSeo.ts:26: * Résout automatiquement les URLs absolues à partir de `useSiteUrl()` (runtimeConfig).
app/composables/usePageSeo.ts:28:export function usePageSeo(options: MaybeRefOrGetter<PageSeoOptions | undefined | null>): void {
app/composables/usePageSeo.ts:29:  const siteUrl = useSiteUrl();
app/composables/usePageSeo.ts:39:    const canonicalUrl = cleanPath ? `${siteUrl}${cleanPath}` : siteUrl;
app/composables/usePageSeo.ts:46:          : `${siteUrl}${opts.image.startsWith("/") ? opts.image : `/${opts.image}`}`;
app/composables/usePageSeo.ts:76:          scripts.push(jsonLdScript(item));
app/composables/usePageSeo.ts:79:        scripts.push(jsonLdScript(seo.value.jsonLd));
app/composables/usePageSeo.ts:90:  useSeoMeta({
app/app.vue:10:// Métadonnées Schema.org globales (Organization / publisher du site).
app/app.vue:11:// Résolues depuis runtimeConfig (useSiteUrl) et les données partagées (SITE).
app/app.vue:12:const siteUrl = useSiteUrl();
app/app.vue:16:  "@type": "Organization",
app/app.vue:18:  url: siteUrl,
app/app.vue:19:  logo: `${siteUrl}/images/logo.png`,
app/app.vue:28:  script: [jsonLdScript(organizationJsonLd)],

exec
/bin/zsh -lc "sed -n '1,160p' app/utils/seo.ts; rg -n \"export default|interface Blog|defineCollection|content\" content app server tests docs package.json | head -200; find . -maxdepth 3 -type f \\( -name '*test*' -o -name '*spec*' \\) -print | sort | head -100" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
// Helpers SEO partagés (auto-importés depuis app/utils/).
//
// L'URL de production du site n'est plus une constante ici : elle est lue depuis
// `runtimeConfig.public.siteUrl` via le composable `useSiteUrl()`
// (app/composables/useSiteUrl.ts) — swappable staging/prod sans domaine en dur.
// `useRuntimeConfig()` étant un composable (contexte Nuxt requis), elle ne peut pas
// vivre dans ce module pur.

// Construit l'entrée <script type="application/ld+json"> pour useHead, en échappant
// « < » → « < ». Garantit qu'aucune séquence "</script>" éventuellement présente
// dans les données (titres, descriptions d'articles…) ne ferme la balise prématurément.
export function jsonLdScript(data: Record<string, unknown>) {
  return {
    type: "application/ld+json",
    innerHTML: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}
rg: server: No such file or directory (os error 2)
rg: tests: No such file or directory (os error 2)
package.json:19:    "@nuxt/content": "^3.14.0",
docs/project-context.md:27:- **Contenu :** `@nuxt/content ^3.14.0` (**v3** — stockage SQLite via `better-sqlite3`, blog). Images : `@nuxt/image ^2.0.0` (`<NuxtImg>` / `<NuxtPicture>`).
docs/project-context.md:65:- Blog alimenté par `@nuxt/content` **v3** (markdown sous `content/blog/`) — index
docs/project-context.md:67:  dans `content.config.ts`** (schéma `blog` : `date` validée ISO via `z.string().regex`,
docs/project-context.md:70:  (`content.build.markdown.highlight: false`) pour imposer la palette terminale du DS —
docs/project-context.md:254:- **`@nuxt/content` v3 + Docker — base SQLite du dev périmée** : lancer `pnpm generate`
docs/project-context.md:258:- **Styler le HTML généré par `@nuxt/content`** : le rendu (`<ContentRenderer>`) n'est pas
docs/project-context.md:272:    attrapé un bug d'ancres de titres `@nuxt/content` (6.2) et validé la refonte terminal
docs/project-context.md:293:Dernière mise à jour : 2026-06-29 (post-Epic 8 : refonte terminal **livrée** — `components/terminal/` intégralement en `<script setup>`, commandes `skills`/`projets`/`contact`/`clear` ajoutées, dernier résidu Options API = `WindowWrapperComponent`/`CurrentTime` côté header ; source de contenu partagé unique `app/data/site.ts` (DRY) ; checklist a11y forced-colors/clavier/contraste à embarquer en amont des consignes Epic 9 — dernier épic, puis fin de refonte SEO + RGPD + déploiement gh-pages ; post-Epic 7 : décision Epic 8 = refonte complète du terminal — migration `components/terminal/` vers `<script setup>` + restyle DS, vérif commande-par-commande ; Web3Forms acté côté SPEC pour le formulaire `/contact` ; post-Epic 6 : pipeline `@nuxt/content` v3 — collections typées `content.config.ts`, Shiki désactivé, gotchas Docker/SQLite + `:deep()` ancres de titres ; post-Epic 5 : primitives de layout globales `base/_layout.scss` + convention a11y titres/listes — eyebrow-as-`h2`, séquences en `<ol>`/`<ul>` ; post-Epic 4 : réfs visuelles par page précisées pour la routine de diff avant revue ; post-Epic 3 : pièges `padding` shorthand multi-classes + vérif visuelle Chrome DevTools avant revue pour les stories de page ; post-Epic 2 : stack réelle Nuxt 4 / TS 6 / ESLint 10 flat / @nuxt/content 3, primitives DS `ui/`, tokens CSS globaux, règles a11y)
app/pages/about.vue:288:  content: "";
app/pages/about.vue:306:  content: "";
app/pages/blog/[...slug].vue:40:          <!-- Corps de l'article : HTML généré par @nuxt/content, stylé via :deep() -->
app/pages/blog/[...slug].vue:63:// @nuxt/content v3 (queryCollection + ContentRenderer). Prerender-safe (useAsyncData).
app/pages/blog/[...slug].vue:208:// ---- Prose (HTML généré par @nuxt/content → cibler via :deep()) ----
app/pages/blog/[...slug].vue:267:  // Ancres d'auto-lien des titres (@nuxt/content enrobe chaque titre d'un <a href="#…">) :
app/pages/blog/[...slug].vue:374:  justify-content: space-between;
app/pages/blog/index.vue:85:// cartes ZCard interactives, méta mono, empty-state restylé. Contenu via @nuxt/content
app/pages/services.vue:217:  justify-content: center;
app/pages/services.vue:261:    content: "→";
app/pages/index.vue:500:  justify-content: center;
app/pages/index.vue:609:  justify-content: space-between;
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:19:1. **Given** le pipeline `@nuxt/content` et la référence `Blog.jsx`, **When** on crée le dossier `content/` et on refond `/blog` (index + empty-state), **Then** la liste rend en cartes conformes au DS.
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:20:2. **Given** le pipeline `@nuxt/content` et la référence `Blog.jsx`, **When** la liste d'articles est vide, **Then** l'empty-state français soigné s'affiche quand il n'y a aucun article.
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:22:> Périmètre : **index du blog (`pages/blog/index.vue`) + création du dossier `content/` + empty-state**. La vue article (`pages/blog/[...slug].vue`, prose + code) est la **story 6.2** — ne pas la traiter ici. Réutiliser les primitives livrées par l'Epic 2 (`ZCard`, `ZTag`/`ZBadge`) et les tokens (Epic 2). Ne pas créer de nouvelles primitives.
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:26:- [x] Tâche 1 — Créer le dossier `content/` et un (ou plusieurs) article(s) markdown (AC: #1, #2)
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:27:  - [x] Créer le dossier `content/` à la racine du projet (n'existe pas encore)
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:28:  - [x] Y placer au moins un article markdown de démonstration (`content/blog/<slug>.md`) avec front-matter (`title`, `description`, `date`, `tags`, `image`/`img`, `read`) pour valider le rendu de la liste en cartes
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:29:  - [x] Vérifier que la collection/source `blog` est bien résolue par `@nuxt/content` (voir Dev Notes pour l'API v2 vs v3 selon ce qui est installé après story 1.2)
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:34:  - [x] Récupérer les articles via l'API `@nuxt/content` (voir Dev Notes), triés par date décroissante
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:43:  - [x] `yarn dev` : `/blog` se charge, liste les articles présents dans `content/`
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:44:  - [x] Cas vide : retirer/vider temporairement le dossier `content/blog` → l'empty-state s'affiche
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:51:- **Blog via `@nuxt/content` markdown** — le dossier `content/` n'existe PAS encore : à créer dans cette story. [Source: docs/project-context.md#Nuxt ; docs/specs/spec-design-system-revamp/pages.md#Notes par page]
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:62:- **`content/`** (CREATE) — dossier racine à créer. Sous-dossier `content/blog/` + au moins un `.md` de démonstration avec front-matter. C'est le pipeline `@nuxt/content` qui résout ce dossier.
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:63:- **`pages/blog/index.vue`** (UPDATE / refonte) — état actuel : utilise `<ContentList path="/blog">` (API content v2) avec un slot `#default` (liste brute `<ul>`/`<li>`) et un slot `#not-found` portant l'empty-state en `ZCardComponent`/`ZCardHeader`/`ZCardBody`. Styles legacy : fonds blancs, `width: 50vw`, `.container-w50`. À refondre : header eyebrow/titre/sous-titre, cartes `ZCard` interactives, méta mono, empty-state restylé via tokens.
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:66:### API @nuxt/content — attention v2 vs v3 (selon story 1.2)
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:68:> Le code actuel utilise l'API **content v2** (`<ContentList>`, `article._path`, slot `#not-found`). La **story 1.2** met à jour `@nuxt/content` ; si elle installe **v3 (sur Nuxt 4)**, l'API change. Vérifier la version réellement installée avant d'implémenter, et adapter :
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:71:- **Content v3 (cible probable Nuxt 4)** : **collections** définies dans `content.config.ts` (ex. collection `blog` typée) ; requêtes via `await queryCollection("blog").order("date", "DESC").all()` dans un `useAsyncData` ; rendu de liste en clair (plus de `<ContentList>` magique) ; champ chemin `path`. L'empty-state se gère par un `v-if` sur la longueur de la liste (plus de slot `#not-found`).
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:73:- Si besoin de détails d'API à jour : consulter context7 (lib `/nuxt/content` pour content v3, ou `/websites/nuxt_4_x`).
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:85:- **`content/` absent** : sans ce dossier, `@nuxt/content` n'a aucune source → s'assurer qu'il existe et qu'il contient au moins un article pour valider le rendu en cartes (AC #1), tout en validant aussi le cas vide (AC #2).
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:86:- **Empty-state** : ne pas le supprimer — le **conserver** (texte français) et le **restyler**. Vérifier le bon mécanisme selon la version content (slot `#not-found` en v2 vs `v-if` sur liste vide en v3).
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:88:- **Prerender** : ne pas accéder au DOM hors garde ; la requête content doit être résolue au build (`useAsyncData`).
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:90:- **Dépendances** : cette story dépend de l'Epic 1 (module content à jour) et de l'Epic 2 (primitives `ZCard`/`ZTag`/`ZBadge` + tokens). Ne pas dépendre de stories futures.
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:94:- Nouveau dossier racine `content/` (avec `content/blog/`). Cohérent avec la structure attendue par `@nuxt/content`.
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:121:- **Sanity-check `@nuxt/content` (préalable Epic 6)** : après création de `content/blog/` + 3 articles et restart du conteneur dev → `[@nuxt/content] ✔ Processed 2 collections and 3 files`. `/blog` liste les 3 titres, `/blog/ia-dans-wordpress` rend le markdown (`<pre>`/`<code>`). Pipeline (better-sqlite3 + rendu) **opérationnel depuis la migration Nuxt 4**.
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:129:- **Pipeline content (Tâche 1)** : créé `content/blog/` + 3 articles markdown (repris des posts de `data.js` : `ia-dans-wordpress`, `nuxt-symfony-archi`, `n8n-automatisation`) avec front-matter `title`/`description`/`date` (ISO)/`tags`/`read`/`image`. Corps markdown réels (le 1er porté de la démo `Article` de `Blog.jsx`) → pré-amorce aussi la vue article 6.2. Schéma de la collection `blog` (`content.config.ts`) étendu : `date`/`tags`/`read` typés (en plus de `image`).
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:137:- `content.config.ts` (MODIFIÉ — schéma collection `blog` étendu : `date` (validée ISO `regex`)/`tags`/`read`)
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:138:- `content/blog/ia-dans-wordpress.md` (CRÉÉ ; `image.src` → `.webp`)
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:139:- `content/blog/nuxt-symfony-archi.md` (CRÉÉ ; `image.src` → `.webp`)
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:140:- `content/blog/n8n-automatisation.md` (CRÉÉ ; `image.src` → `.webp`)
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:150:| 2026-06-23 | 0.1     | Implémentation story 6.1 — pipeline `content/` + 3 articles, refonte de l'index `/blog` (cartes `ZCard`, méta, tri par date) + empty-state restylé. Sanity-check `@nuxt/content` v3 OK. |
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:156:_Code review (bmad-code-review) — 2026-06-23. Couches : Blind Hunter (diff seul) · Edge Case Hunter (diff + projet) · Acceptance Auditor (diff + SPEC/ticket/`Blog.jsx`/`kit.css`). Verdict : AC #1 (cartes conformes DS) et AC #2 (empty-state) satisfaites, aucune violation dure ; API content v3, tokens, `ZCard`/`ZTag`, prerender tous vérifiés sains._
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:161:- [x] [Review][Patch] `date` non validée (`z.string()`) → `formatDate` rend « Invalid Date » et le tri `.order("date","DESC")` se trompe si le format dévie. Valider au schéma (`z.string().regex(/^\d{4}-\d{2}-\d{2}$/)`) — échec au build plutôt qu'à l'affichage. [content.config.ts] — ✅ résolu : `z.string().regex(/^\d{4}-\d{2}-\d{2}$/, …)`.
docs/implementation-artifacts/7-2-infos-cta-terminal-et-socials.md:116:- ⚠️ Faux négatif initial : le 1er clic n'ouvrait rien à cause de `504 (Outdated Optimize Dep)` Vite (cache de pré-bundling périmé après `docker compose restart`) → l'import dynamique du terminal échouait. **Un reload purge le cache** ; ensuite l'ouverture fonctionne. (Même famille de piège transitoire dev que la base SQLite content après generate.)
docs/implementation-artifacts/1-4-valider-build-statique-et-deploiement-gh-pages.md:47:- [x] [Review][Patch] Déclarer explicitement les permissions d'écriture pour publier `gh-pages` [.github/workflows/cd.yml:1] — le déploiement utilise `GITHUB_TOKEN`, mais le workflow ne fixe pas `permissions: contents: write`; selon les réglages du dépôt, le publish peut échouer en 403. **→ Résolu** : bloc `permissions: contents: write` au niveau workflow.
docs/implementation-artifacts/1-4-valider-build-statique-et-deploiement-gh-pages.md:114:- `pnpm generate` → exit 0, « Prerendered 24 routes ». `.output/public` contient `index.html`, `200.html`, `404.html`, `about/`, `blog/`, `_ipx/` (18 variantes), `_nuxt/`, `__nuxt_content/`, `images/`, `CNAME` (`dev.jouan.ovh`), `_headers`, `favicon.ico`.
docs/implementation-artifacts/1-4-valider-build-statique-et-deploiement-gh-pages.md:119:- **Build statique validé** sur la stack migrée (Nuxt 4 + pnpm). Pages, images optimisées (`_ipx`) et dump blog statique (`__nuxt_content`) émis.
docs/implementation-artifacts/1-4-valider-build-statique-et-deploiement-gh-pages.md:130:- ✅ [Patch] **Permissions explicites** : `permissions: contents: write` au niveau workflow (publish gh-pages via `GITHUB_TOKEN` sans risque de 403).
docs/implementation-artifacts/8-3-migrer-composants-terminal-script-setup.md:120:- **Migration mécanique à comportement constant** : `TerminalComponent.vue` et `TerminalManagerComponent.vue` passent d'Options API (`defineComponent` / `export default {}`) à **`<script setup lang="ts">`**. Le `<template>` et le `<style>` (restyle 8.1) sont **inchangés**.
app/assets/scss/base/_reset.scss:76:/* Grouping content
app/assets/scss/base/_reset.scss:84:  box-sizing: content-box;
app/assets/scss/base/_reset.scss:164:/* Embedded content
app/assets/scss/base/_reset.scss:451:.page-content .wp-smiley,
app/assets/scss/base/_reset.scss:452:.entry-content .wp-smiley,
app/assets/scss/base/_reset.scss:453:.comment-content .wp-smiley {
docs/implementation-artifacts/epic-2-retro-2026-06-22.md:84:3. **Réconcilier les docs de stack avec la réalité** (`Yarn/ESLint9/TS5` → `pnpm / ESLint 10 flat / TS 6 / Nuxt 4 / @nuxt/content 3 / @nuxt/image 2`).
app/assets/scss/components/_button.scss:86:  justify-content: center;
docs/implementation-artifacts/epic-5-retro-2026-06-23.md:102:- ⚠️ **Surface technique neuve** : Epic 6 est la **première vraie mise en service de `@nuxt/content` v3** (SQLite/`better-sqlite3`) dans la refonte. Le module est installé mais **le dossier `content/` n'existe pas encore** et le pipeline n'a jamais été exercé post-migration. *Prep recommandée : sanity-check du pipeline (créer `content/` + 1 article de test, vérifier `queryContent`/rendu en dev Docker) avant 6.1.*
docs/implementation-artifacts/epic-5-retro-2026-06-23.md:107:**Découverte significative invalidant le plan d'Epic 6 ? → Non.** Primitives prêtes, pipeline `@nuxt/content` à amorcer (prep, pas re-planification). Plan sain.
docs/implementation-artifacts/epic-5-retro-2026-06-23.md:129:1. Avant la story 6.1 : **sanity-check du pipeline `@nuxt/content` v3** (créer `content/` + article de test, vérifier le rendu en dev Docker).
docs/implementation-artifacts/3-3-projets-selectionnes.md:80:| en-tête `display:flex; justify-content:space-between; align-items:baseline` | `<h3>` nom + `<span>` rôle |
docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:47:  - [x] Vérif navigateur (Chrome DevTools MCP) : `/about` et `/blog` — `canonical`/`og:url` rendus, domaine résolu depuis `runtimeConfig` (inchangé en staging). Vue article non vérifiable en navigateur faute d'article réel (`content/blog/` vide), mais couverte par typecheck/prerender.
docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:80:- **`.github/workflows/cd.yml`** (existe, bien construit) : `on: push main` + `pull_request main` ; `permissions: contents: write` ; concurrency sérialisée. Étapes : setup pnpm + Node 22 → `pnpm install --frozen-lockfile` → **`pnpm lint`** → **`pnpm typecheck`** → **`pnpm generate`** → copie `_headers`+`CNAME` dans `.output/public` → **`Verify static output`** (présence des fichiers clés + `grep -qx "dev.jouan.ovh"` sur le `CNAME`) → **Deploy** `peaceiris/actions-gh-pages@v3` (publish `.output/public`), **gardé `if: github.event_name == 'push'`** → les **PR valident sans publier**.
docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:96:- **`nuxt.config.ts`** (UPDATE) — possède déjà `runtimeConfig.public.web3formsAccessKey: ""`. **Ajouter** `siteUrl: "https://dev.jouan.ovh"`. Ne pas toucher au reste (head, modules, content highlight off, components ui/, ssr, experimental, eslint).
docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:156:# Piège Docker/SQLite connu : `generate` en `run --rm` périme la DB @nuxt/content du dev
docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:166:- **Vérif navigateur.** Chrome DevTools MCP a vérifié `/about` et `/blog` en navigateur (2026-09-12) : canonical/og résolus depuis `runtimeConfig`, inchangés en staging (`https://dev.jouan.ovh/about`, `https://dev.jouan.ovh/blog`) ; JSON-LD `/blog` présent avec `blogPost: []`. Aucun article réel n'existe aujourd'hui (`content/blog/` vide), donc la vue article ne peut pas être rendue au navigateur ; elle reste couverte par typecheck + prerender.
docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:167:- **Blog sans article.** `content/blog/` est vide → blog en empty-state (`blogPost:[]`), aucune sous-route `/blog/*` prerendue (cohérent avec 11 routes). La vue article partage le même `useSiteUrl()` (validé par typecheck + prerender) ; pas d'article réel à rendre en dry-run.
docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:173:- ℹ️ Finding [Defer] **image `src` sans slash initial** (déjà trié `[x]` en revue) : confirmé **pré-existant** (déjà vrai avec l'ancienne constante `SITE_URL`), **non déclenchable** (`content/blog/` vide), et la normalisation/factorisation d'URL relève explicitement de **story 10.5** (frontière 10.1↔10.5 posée par les Dev Notes — la toucher ici déborderait le périmètre). **Non introduit par 10.1 → pas une dette de cette story** ; laissé différé conformément au triage de revue (tracé `deferred-work.md` #6).
docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:201:- [x] [Review][Defer] `article.image.src` sans slash initial → URL d'image malformée (`https://dev.jouan.ovhimages/x.webp`) [app/pages/blog/index.vue:122, app/pages/blog/[...slug].vue:121] — deferred, pre-existing (déjà vrai avec l'ancienne `SITE_URL` ; non déclenchable : `content/blog/` vide ; à traiter à la factorisation URL de 10.5)
docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:209:- [x] [Review][Defer] `article.image.src` sans slash initial → URL d'image malformée [app/pages/blog/index.vue:122, app/pages/blog/[...slug].vue:121] — deferred, pre-existing ; déjà confirmé non introduit par 10.1, non déclenchable avec `content/blog/` vide, et routé vers la normalisation/factorisation SEO de 10.5.
docs/implementation-artifacts/epic-7-retro-2026-06-26.md:36:4. **Vérification *comportementale*, pas que visuelle.** `ZInput` exercé pour la première fois en conditions réelles : la vérif Chrome DevTools a couvert la **logique** (validation, focus, ré-validation live, bascule d'état), pas seulement le rendu. Un piège dev transitoire attrapé (504 Vite « Outdated Optimize Dep » après `restart` → un reload purge le cache ; même famille que la base SQLite content de l'Epic 6).
docs/implementation-artifacts/epic-6-retro-2026-06-25.md:14:Le blog est refondu sur le DS et **alimenté pour la première fois par `@nuxt/content` v3** : index `/blog` en cartes + empty-state, vue article prose + code en palette terminale (CAP-8, FR8, UX-DR15). **Premier épic à mettre en service le pipeline contenu** (SQLite/`better-sqlite3`) depuis la migration Nuxt 4.
docs/implementation-artifacts/epic-6-retro-2026-06-25.md:18:  - 6.1 — Index + empty-state : création de `content/` (+ 3 articles markdown portés de `data.js`), schéma de collection `blog` typé (`content.config.ts`), refonte de `pages/blog/index.vue` (Options API legacy → `<script setup>`) en cartes `ZCard`, tri par date, empty-state restylé.
docs/implementation-artifacts/epic-6-retro-2026-06-25.md:30:1. **La prep recommandée par la rétro Epic 5 a été exécutée, au pied de la lettre.** La rétro Epic 5 demandait un *sanity-check `@nuxt/content` avant 6.1* : le debug log de 6.1 s'ouvre sur « Sanity-check `@nuxt/content` (préalable Epic 6) » → 2 collections, 3 fichiers, **pipeline opérationnel depuis la migration Nuxt 4**. La boucle rétro→prep→story tient pour la 4ᵉ fois. Bonus : un **gotcha Docker** découvert et documenté — lancer `pnpm generate` dans un conteneur `run --rm` séparé pendant que le dev tourne **périme la base SQLite de contenu** du dev (volume partagé) ; `docker compose restart web` réindexe.
docs/implementation-artifacts/epic-6-retro-2026-06-25.md:32:2. **Première surface contenu, maîtrisée d'un coup.** Collections typées (`content.config.ts`), `queryCollection().order("date","DESC").all()` via `useAsyncData` (prerender-safe), `ContentRenderer`, et **désactivation de Shiki** (`content.build.markdown.highlight: false`) pour imposer la palette terminale du DS (sinon Shiki injecte des styles inline par token qui écrasent la palette). Pattern défensif notable : **validation ISO de `date` au schéma** (`z.string().regex(...)`) → échec au *build* plutôt qu'« Invalid Date » à l'affichage.
docs/implementation-artifacts/epic-6-retro-2026-06-25.md:36:4. **Le filet visuel (A1) a encore attrapé un bug invisible à la revue de code.** `@nuxt/content` enrobe chaque titre d'une ancre `<a href="#…">` → titres rendus **bleu souligné** (pas de reset global d'`<a>`). Attrapé à l'œil, corrigé via `:deep(h2/h3/h4 a){ color: inherit; text-decoration: none }`. 3ᵉ épic d'affilée où A1 capte ce que la revue logique ne voit pas (ici, du HTML généré par le renderer).
docs/implementation-artifacts/epic-6-retro-2026-06-25.md:48:| **#1 — Sanity-check `@nuxt/content` avant 6.1** | ✅ **Fait** | Debug log 6.1 (« préalable Epic 6 »), pipeline confirmé. |
docs/implementation-artifacts/epic-6-retro-2026-06-25.md:54:**Lecture (John / Winston) :** 4ᵉ épic d'affilée où les actions tiennent, et la prep technique (sanity-check content) a été suivie sans qu'on ait à y revenir. Les conventions documentées en rétro Epic 5 ont été **écrites dès la story** plutôt que rattrapées en revue — le but recherché.
docs/implementation-artifacts/epic-6-retro-2026-06-25.md:60:- **Prep technique suivie** : le sanity-check `@nuxt/content` a dé-risqué l'épic le plus technique avant d'écrire la moindre page.
docs/implementation-artifacts/epic-6-retro-2026-06-25.md:88:- Ajouter à `project-context.md` les **gotchas `@nuxt/content` v3** découverts en Epic 6, utiles aux épics restants et à la maintenance :
docs/implementation-artifacts/epic-6-retro-2026-06-25.md:90:  - **Shiki désactivé** (`content.build.markdown.highlight: false`) volontairement, pour la palette terminale du DS — ne pas réactiver sans surcharge.
docs/implementation-artifacts/epic-6-retro-2026-06-25.md:123:| Pipeline `@nuxt/content` v3 | ✅ **opérationnel** (sanity-check + 3 articles prerendus) |
docs/implementation-artifacts/epic-6-retro-2026-06-25.md:134:1. (Recommandé) Ajouter à `project-context.md` les gotchas `@nuxt/content` v3 (Docker/SQLite, Shiki off, `:deep()` ancres) — cf. §6.
docs/implementation-artifacts/1-1-migrer-le-coeur-vers-nuxt-4.md:24:> Périmètre : **cœur Nuxt + config + structure** uniquement. La mise à jour fine des modules (`@nuxt/content`, `@nuxt/image`) et le réalignement lint ESLint 9 sont les stories 1.2 et 1.3. La validation `generate` + déploiement gh-pages est la story 1.4. Cette story doit néanmoins laisser le projet **démarrant et compilant** (`yarn dev` OK).
docs/implementation-artifacts/1-1-migrer-le-coeur-vers-nuxt-4.md:28:> ⚠️ **Note de périmètre (décision utilisateur) :** sur demande explicite, le gestionnaire de paquets est **pnpm** (et non Yarn) et **toutes** les dépendances ont été passées en **latest réel** — ce qui absorbe de fait les stories **1.2** (modules `@nuxt/content`→3, `@nuxt/image`→2, sass) et **1.3** (outillage lint ESLint 9/10 flat config via `@nuxt/eslint`, TypeScript 6, Prettier 3, Stylelint 17). Un `docker-compose.yml` (Node 22 LTS + pnpm) a aussi été ajouté pour isoler l'environnement de dev. Voir Completion Notes.
docs/implementation-artifacts/1-1-migrer-le-coeur-vers-nuxt-4.md:37:  - [x] **Structure Nuxt 4 par défaut adoptée** : code applicatif déplacé sous `app/` (`app.vue`, `components/`, `pages/`, `layouts/`, `assets/`, `utils/`, `terminal.config.ts`). `content/`, `public/`, `nuxt.config.ts`, `content.config.ts` restent à la racine. Aucun override `srcDir`/`dir` (défaut `srcDir: "app"`).
docs/implementation-artifacts/1-1-migrer-le-coeur-vers-nuxt-4.md:81:- **`nuxt.config.ts`** (UPDATE) — état actuel : `css: ["@/assets/scss/main.scss"]`, `modules: ["@nuxt/content", "@nuxt/image-edge"]`, `ssr: true`, `experimental.payloadExtraction: false`, `webpack: { extractCSS: true }`, et un `app.head` (title, htmlAttrs lang=fr, meta description).
docs/implementation-artifacts/1-1-migrer-le-coeur-vers-nuxt-4.md:92:- **Nouvelle structure par défaut** : `srcDir` passe à `app/` (avec `app/components`, `app/pages`, `app/layouts`, `app/assets`, `app/app.vue`, etc.) + dossiers racine `shared/`, `server/`, `public/`, `content/`. Pour **conserver la structure actuelle** sans tout déplacer :
docs/implementation-artifacts/1-1-migrer-le-coeur-vers-nuxt-4.md:94:  export default defineNuxtConfig({ srcDir: '.', dir: { app: 'app' } })
docs/implementation-artifacts/1-1-migrer-le-coeur-vers-nuxt-4.md:102:- `@nuxt/image-edge` et `@nuxt/content` peuvent émettre des avertissements de version sur Nuxt 4 ; leur mise à jour fine est la **story 1.2**. Ici, n'intervenir que si ça empêche `yarn dev` de démarrer (alors, noter le contournement pour 1.2).
docs/implementation-artifacts/1-1-migrer-le-coeur-vers-nuxt-4.md:140:- **Modules (1.2 absorbée)** : `@nuxt/content@^3.14` (v2→v3 : ajout de `content.config.ts`, adaptation du blog à `queryCollection`/`<ContentRenderer>`, ajout de `better-sqlite3`), `@nuxt/image@^2` (remplace `@nuxt/image-edge`), `sass@^1.101`. `ua-parser-js@^2` (import nommé `{ UAParser }`, `@types/ua-parser-js` retiré car types embarqués).
docs/implementation-artifacts/1-1-migrer-le-coeur-vers-nuxt-4.md:169:- `content.config.ts` — collections @nuxt/content v3
docs/implementation-artifacts/1-1-migrer-le-coeur-vers-nuxt-4.md:177:- `.gitignore` — ignore `.data` (DB content v3)
docs/implementation-artifacts/1-1-migrer-le-coeur-vers-nuxt-4.md:178:- `pages/blog/index.vue`, `pages/blog/[...slug].vue` — migration content v3 (`queryCollection`/`ContentRenderer`)
docs/implementation-artifacts/1-1-migrer-le-coeur-vers-nuxt-4.md:199:- `content.config.ts` — schéma `image` optionnel de la collection blog
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:19:1. **Given** un article markdown dans `content/`, **When** on refond `/blog/[...slug]`, **Then** la prose (Ubuntu sans) et les blocs de code (Ubuntu Mono, palette terminal) rendent conformément au DS.
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:21:> Périmètre : **vue article (`pages/blog/[...slug].vue`)** — rendu prose + blocs de code stylés. L'index du blog et l'empty-state sont la **story 6.1** (dépendance amont : le dossier `content/` y est créé). Réutiliser les primitives livrées par l'Epic 2 (`ZTag`, `ZButton`) et les tokens (Epic 2). Ne pas créer de nouvelles primitives.
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:25:- [x] Tâche 1 — S'appuyer sur un article markdown de `content/` (AC: #1)
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:26:  - [x] Réutiliser le dossier `content/blog/` créé en story 6.1 (au moins un article avec front-matter : `title`, `description`, `date`, `tags`, `image`/`img`, `read`)
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:29:  - [x] Récupérer le document courant via l'API `@nuxt/content` (voir Dev Notes v2 vs v3) et le rendre via le composant de rendu de contenu de la version installée (`<ContentDoc>` v2 / `<ContentRenderer>` v3)
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:37:  - [x] Styler le contenu généré par le renderer (cibler les éléments produits via un sélecteur de scope, p. ex. `:deep()`), car le HTML vient de `@nuxt/content`
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:41:  - [x] Valider le rendu d'un bloc de code issu du markdown (la coloration syntaxique éventuelle de content ne doit pas casser la palette terminale — voir pièges)
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:52:- **Blog via `@nuxt/content` markdown** — la vue article rend un document du dossier `content/` (créé en story 6.1). [Source: docs/project-context.md#Nuxt ; docs/specs/spec-design-system-revamp/pages.md]
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:63:- **`pages/blog/[...slug].vue`** (UPDATE / refonte) — état actuel : minimal, `<main><ContentDoc /></main>` (API content v2, aucun style). À refondre : structure `.article`, lien retour, en-tête (tags/titre/méta/héro), rendu prose stylé, blocs de code en palette terminale, bloc CTA de fin. Conserver le rendu du document via le composant de la version content installée.
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:64:- **`content/blog/<slug>.md`** (réutilisé de 6.1) — doit contenir prose + au moins un bloc de code pour valider tous les styles.
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:66:### API @nuxt/content — attention v2 vs v3 (selon story 1.2)
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:68:> Le code actuel utilise `<ContentDoc />` (content v2). La **story 1.2** met à jour `@nuxt/content` ; vérifier la version installée et adapter :
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:73:- Si besoin de détails d'API à jour : consulter context7 (lib `/nuxt/content` pour content v3, ou `/websites/nuxt_4_x`).
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:87:- **Styler du HTML généré** : la prose est rendue par `@nuxt/content`, donc le scope `scoped` ne l'atteint pas directement — utiliser `:deep()` (ou configurer les composants prose) pour `p`, `h2`, `pre`, `code`.
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:88:- **Palette de code** : si content active une coloration syntaxique (Shiki) en v3, elle peut injecter ses propres couleurs/fond. Veiller à ce que le rendu reste fidèle à la palette terminale (fond aubergine, texte/accents verts) — désactiver ou surcharger le highlight si nécessaire pour rester conforme au DS.
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:91:- **Prerender** : pas d'accès DOM hors garde ; le document content doit être résolu au build (`useAsyncData`).
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:93:- **Dépendances** : dépend de l'Epic 1 (module content à jour), de la story 6.1 (dossier `content/`) et de l'Epic 2 (primitives `ZTag`/`ZButton` + tokens, polices Ubuntu). Ne pas dépendre de stories futures.
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:98:- Le contenu reste du markdown sous `content/blog/`. Aucune base de données / entité à créer.
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:127:- **Bug attrapé à l'œil** : `@nuxt/content` enrobe chaque titre d'une ancre `<a href="#…">` → titres rendus en **bleu UA souligné** (l'app n'a pas de reset global d'`<a>`). Corrigé via `:deep(h2/h3/h4 a) { color: inherit; text-decoration: none }` (+ style de lien DS pour le corps prose). Re-vérifié : ancre h2 = `text-strong`, sans soulignement.
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:133:- **Code** : Shiki **désactivé** (`nuxt.config` → `content.build.markdown.highlight: false`) pour un rendu terminal uniforme conforme au kit (fond aubergine `--bg-terminal`, mono off-white `--text-strong` ; `code` inline `--term-green` ; `pre code { color: inherit }`). Sans cette désactivation, Shiki injectait des styles inline par token (thèmes github) écrasant la palette.
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:141:- `nuxt.config.ts` (MODIFIÉ — `content.build.markdown.highlight: false`)
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:160:_Code review (bmad-code-review) — 2026-06-25. Couches : Blind Hunter (diff seul) · Edge Case Hunter (diff + projet, retour `[]`) · Acceptance Auditor (diff + SPEC/ticket/`Blog.jsx`/`kit.css`). Verdict : AC #1 satisfaite (prose Ubuntu sans + code Ubuntu Mono palette terminale, conformes DS), aucune violation dure ; API content v3, gestion 404/500, SEO, refactor index préservé tous vérifiés sains._
docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:166:_Rejetés (bruit / faux positifs vérifiés)_ : « listes sans puces » et « images qui débordent » (FAUX — le reset global fournit `disc/decimal` + `img max-width:100%`) ; `h3` en défaut navigateur (FAUX — règle globale `_typography.scss` `h1-h6`) ; clé `useAsyncData` en fonction (typecheck + generate des 3 articles passent — Edge `[]`) ; ordre 404/500 (`.first()` renvoie `null`, pas de throw → 404 ; erreur réelle → 500) ; `clearError` client (transitions correctes) ; path traversal (requête content, pas FS ; `null`→404) ; canonical/trailing-slash (canonical = `article.path` propre, dédoublonne) ; contraste `code` inline vert (fidèle kit, token DS) ; héro `object-fit:cover` (recadre sans déformer) + `alt=""` (décoratif, schéma requis) ; `description`/`datePublished` non gardés (schéma garantit la chaîne) ; classes globales `hero__tags`/`post__meta` réutilisées (primitives voulues) ; `formatDate` sans garde (date regex-validée en 6.1) ; `NuxtLink` template vs `:as` ref (les deux corrects) ; `760px` répété (littéral structurel mandaté kit) ; refactor `index.vue`/`_layout.scss` (DRY in-scope, valeurs préservées — Auditor + Edge).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:63:- **Shiki off / content** : ne pas toucher au pipeline `@nuxt/content`. **Prerender** : `useSeoMeta` est prerender-safe ; `generate` doit rester vert (11 routes).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:75:- [Source: docs/project-context.md#Helpers partagés SEO/date (app/utils/seo.ts), #Nuxt (@nuxt/content, prerender)]
app/components/HeaderComponent.vue:294:  justify-content: center;
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:12:I want mettre à jour Vue 3, TypeScript 5, sass, `@nuxt/content` et `@nuxt/image`,
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:17:1. **Given** les versions héritées dans `package.json`, **When** on met à jour les modules et on remplace `@nuxt/image-edge` par `@nuxt/image` stable, **Then** le blog (`@nuxt/content`) et les images (`<nuxt-img>` / `<nuxt-picture>`) fonctionnent.
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:29:- [x] Tâche 2 — Mettre à jour `@nuxt/content` (AC: #1)
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:30:  - [x] `@nuxt/content@^3.14.0` (latest) — ajout de `better-sqlite3` (requis par v3)
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:31:  - [x] Entrée `"@nuxt/content"` conservée dans `modules`
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:32:  - [x] Pipeline blog se charge sans erreur (dump statique `__nuxt_content/blog/sql_dump.txt` généré)
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:33:  - [x] **Breaking change v2→v3 traité ici** (et non reporté) : `content.config.ts` ajouté, blog migré vers `queryCollection`/`<ContentRenderer>` (cf. story 1.1). Le redesign blog complet reste l'épopée 6.
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:52:- [x] [Review][Patch] Faire remonter les erreurs `@nuxt/content` article au lieu de les convertir en faux 404 [app/pages/blog/[...slug].vue:10]
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:65:- **Blog alimenté par `@nuxt/content`** (markdown), route `blog/[...slug].vue`, dossier `content/` à créer ultérieurement (Epic 6). Ici, on ne casse pas le pipeline existant. [Source: docs/project-context.md#Nuxt ; docs/specs/spec-design-system-revamp/SPEC.md#Assumptions]
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:72:- **`package.json`** (UPDATE) — état actuel `devDependencies` pertinentes : `@nuxt/content ^2.5.2`, `@nuxt/image-edge 1.0.0-27968280.9739e4d`, `typescript ^4.9.5`, `sass ^1.59.2`, `vue-property-decorator ^9.1.2`. Scripts à conserver (`dev`/`build`/`generate`/`preview`/`postinstall`/`deploy`).
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:73:  - À changer : retirer `@nuxt/image-edge`, ajouter `@nuxt/image` stable ; monter `@nuxt/content` (stable Nuxt 4) ; monter `typescript` → `^5` ; aligner `sass`.
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:76:- **`nuxt.config.ts`** (UPDATE) — état actuel : `modules: ["@nuxt/content", "@nuxt/image-edge"]`. Remplacer `"@nuxt/image-edge"` par `"@nuxt/image"`. Ne pas toucher `app.head`, `css`, `ssr: true`, `experimental.payloadExtraction: false`.
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:82:- **`@nuxt/content`** : installation `yarn dlx nuxi module add content`. Vérifier la majeure résolue — `@nuxt/content` v3 introduit des changements d'API (collections / `content.config.ts`, requêtes via `queryCollection` au lieu de `queryContent`). Si la résolution monte en v3, **noter le breaking change** pour l'implémentation blog (Epic 6) ; l'objectif ici est seulement que le module **se charge** et que le pipeline existant ne casse pas le démarrage. [Source: https://nuxt.com/docs/4.x/directory-structure/content — Enable Nuxt Content]
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:90:- **`@nuxt/content` v2 → v3** : si la majeure saute, `queryContent()` et la structure de dossier peuvent changer ; ne pas réécrire le blog ici, juste constater que le module se charge et **documenter** l'écart pour Epic 6.
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:98:- Le dossier `content/` du blog est créé plus tard (Epic 6) ; ici on ne fait que mettre à jour le module `@nuxt/content`.
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:111:- [Source: https://nuxt.com/docs/4.x/directory-structure/content — Enable Nuxt Content]
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:122:- Modules vérifiés au `pnpm generate` : `@nuxt/image` produit les variantes `_ipx` (logo + portrait), `@nuxt/content` v3 émet `__nuxt_content/blog/sql_dump.txt`.
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:126:- Versions finales : `@nuxt/content@3.14`, `@nuxt/image@2.0`, `sass@1.101`, `typescript@6.0`, `ua-parser-js@2.0`. Gestionnaire **pnpm** (et non Yarn).
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:127:- **`@nuxt/content` v2→v3** : breaking change traité (pas seulement constaté) — `content.config.ts` + migration des requêtes blog (`queryCollection`/`<ContentRenderer>`). Redesign blog complet = épopée 6.
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:134:- ✅ Résolu finding [Erreur vs 404] : `useAsyncData` expose désormais `error` ; une vraie erreur de requête `@nuxt/content` remonte en **500** au lieu d'un faux 404 (`blog/[...slug].vue`).
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:144:Voir story 1.1 (changements réalisés conjointement). Spécifiques aux modules : `package.json` (deps modules), `nuxt.config.ts` (`@nuxt/image`), `content.config.ts` (créé), `pages/blog/index.vue`, `pages/blog/[...slug].vue`, `components/terminal/programs/SystemInfos.ts`.
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:148:- `app/pages/blog/[...slug].vue` — erreurs content en 500 (vs faux 404), 404 réactive sur refetch client (`showError`/`clearError`), retrait `fatal: true`, normalisation du chemin
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:155:| 2026-06-18 | 0.1 | Modules en latest (content 3, image 2, sass, TS 6, ua-parser 2) — réalisé avec 1.1. Status → review. | Amelia (dev-story) |
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:156:| 2026-06-19 | 0.2 | Correction des 6 findings de revue (NuxtImg vignette, erreurs content vs faux 404, 404 client réactive + retrait fatal, normalisation path, état d'erreur liste vs empty-state, engines Node). `typecheck`/`lint`/`generate` verts. Status → review. | Amelia (dev-story) |
app/components/MainComponent.vue:8:export default {
docs/implementation-artifacts/2-5-primitives-zbadge-et-ztag.md:38:  - [x] `::before { content:"#"; color: var(--accent); }` ; clic → hover `border-color var(--border-strong)` + `color var(--text-strong)`. `prefers-reduced-motion` neutralise la transition.
docs/implementation-artifacts/2-5-primitives-zbadge-et-ztag.md:84:- `::before { content:"#"; color: var(--accent); }` ; variante `plain` → `content:""`.
docs/implementation-artifacts/2-5-primitives-zbadge-et-ztag.md:130:  - **Plain tag** : `hash=false` applique `display:none`/`content:none` au pseudo-élément `::before` pour retirer le préfixe du layout.
app/components/FooterComponent.vue:83:  justify-content: space-between;
app/components/FooterComponent.vue:165:  justify-content: space-between;
app/components/HexagonLinkComponent.vue:22:  justify-content: center;
docs/implementation-artifacts/deferred-work.md:116:- **`article.image.src` sans slash initial → URL d'image malformée** — Dans `blog/index.vue` (JSON-LD `image`) et `blog/[...slug].vue` (`og:image` + JSON-LD), `` `${siteUrl}${article.image.src}` `` concatène sans séparateur : un frontmatter d'article avec `image: { src: "images/x.webp" }` (sans `/` initial) produirait `https://dev.jouan.ovhimages/x.webp`. **Pré-existant** (identique avec l'ancienne constante `SITE_URL`, non introduit par 10.1) et **non déclenchable aujourd'hui** (`content/blog/` vide → 0 article). `content.config.ts` type `image.src` en `z.string()` sans contrainte de format. À corriger à la **factorisation de la construction d'URL SEO de la story 10.5** (helper unique + normalisation slash, ou schéma `image.src` `startsWith("/")`). _(revue 10.1 — Edge Case Hunter)_
docs/implementation-artifacts/deferred-work.md:120:- **`article.image.src` sans slash initial → URL d'image malformée** — Reconfirmé par re-review 10.1 (`app/pages/blog/index.vue:122`, `app/pages/blog/[...slug].vue:121`). Même verdict : pré-existant au baseline, non déclenchable avec `content/blog/` vide, déjà routé vers la normalisation/factorisation SEO de la story 10.5.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:74:Treat every entry in `{workflow.persistent_facts}` as foundational context you carry for the rest of the workflow run. Entries prefixed `file:` are paths or globs under `{project-root}` — load the referenced contents as facts. All other entries are facts verbatim.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:223:   - For **provided diff**: validate the content is non-empty and parseable as a unified diff. If it is not parseable, HALT and ask the user to provide a valid diff.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:224:   - For **file list**: validate each path exists in the working tree. Construct `{diff_output}` by running `git diff HEAD -- <path1> <path2> ...`. If any paths are untracked (new files not yet staged), use `git diff --no-index /dev/null <path>` to include them. If the diff is empty (files have no uncommitted changes and are not untracked), ask the user whether to review the full file contents or to specify a different baseline.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:338:- **Shiki off / content** : ne pas toucher au pipeline `@nuxt/content`. **Prerender** : `useSeoMeta` est prerender-safe ; `generate` doit rester vert (11 routes).
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:350:- [Source: docs/project-context.md#Helpers partagés SEO/date (app/utils/seo.ts), #Nuxt (@nuxt/content, prerender)]
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:402:32-FR8: Blog = index (+ empty-state) et vue article prose + code via `@nuxt/content`. _(CAP-8)_
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:430:60-- Blog via `@nuxt/content` markdown — dossier `content/` à créer.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:486:128-Le visiteur lit les articles : index (+ empty-state soigné) et vue article prose + code via `@nuxt/content`.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:663:- **Contenu :** `@nuxt/content ^3.14.0` (**v3** — stockage SQLite via `better-sqlite3`, blog). Images : `@nuxt/image ^2.0.0` (`<NuxtImg>` / `<NuxtPicture>`).
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:701:- Blog alimenté par `@nuxt/content` **v3** (markdown sous `content/blog/`) — index
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:703:  dans `content.config.ts`** (schéma `blog` : `date` validée ISO via `z.string().regex`,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:706:  (`content.build.markdown.highlight: false`) pour imposer la palette terminale du DS —
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:890:- **`@nuxt/content` v3 + Docker — base SQLite du dev périmée** : lancer `pnpm generate`
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:894:- **Styler le HTML généré par `@nuxt/content`** : le rendu (`<ContentRenderer>`) n'est pas
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:908:    attrapé un bug d'ancres de titres `@nuxt/content` (6.2) et validé la refonte terminal
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:929:Dernière mise à jour : 2026-06-29 (post-Epic 8 : refonte terminal **livrée** — `components/terminal/` intégralement en `<script setup>`, commandes `skills`/`projets`/`contact`/`clear` ajoutées, dernier résidu Options API = `WindowWrapperComponent`/`CurrentTime` côté header ; source de contenu partagé unique `app/data/site.ts` (DRY) ; checklist a11y forced-colors/clavier/contraste à embarquer en amont des consignes Epic 9 — dernier épic, puis fin de refonte SEO + RGPD + déploiement gh-pages ; post-Epic 7 : décision Epic 8 = refonte complète du terminal — migration `components/terminal/` vers `<script setup>` + restyle DS, vérif commande-par-commande ; Web3Forms acté côté SPEC pour le formulaire `/contact` ; post-Epic 6 : pipeline `@nuxt/content` v3 — collections typées `content.config.ts`, Shiki désactivé, gotchas Docker/SQLite + `:deep()` ancres de titres ; post-Epic 5 : primitives de layout globales `base/_layout.scss` + convention a11y titres/listes — eyebrow-as-`h2`, séquences en `<ol>`/`<ul>` ; post-Epic 4 : réfs visuelles par page précisées pour la routine de diff avant revue ; post-Epic 3 : pièges `padding` shorthand multi-classes + vérif visuelle Chrome DevTools avant revue pour les stories de page ; post-Epic 2 : stack réelle Nuxt 4 / TS 6 / ESLint 10 flat / @nuxt/content 3, primitives DS `ui/`, tokens CSS globaux, règles a11y)
app/components/terminal/programs/Projets.ts:15:export default projets;
app/components/terminal/programs/SystemInfos.ts:34:export default systemInfo;
docs/implementation-artifacts/code-reviews/10-5/full.diff:177:-    { name: "description", content: pageDescription },
docs/implementation-artifacts/code-reviews/10-5/full.diff:179:-    { property: "og:type", content: "profile" },
docs/implementation-artifacts/code-reviews/10-5/full.diff:180:-    { property: "og:title", content: pageTitle },
docs/implementation-artifacts/code-reviews/10-5/full.diff:181:-    { property: "og:description", content: pageDescription },
docs/implementation-artifacts/code-reviews/10-5/full.diff:182:-    { property: "og:url", content: pageUrl },
docs/implementation-artifacts/code-reviews/10-5/full.diff:183:-    { property: "og:image", content: pageImage },
docs/implementation-artifacts/code-reviews/10-5/full.diff:185:-    { name: "twitter:card", content: "summary" },
docs/implementation-artifacts/code-reviews/10-5/full.diff:186:-    { name: "twitter:title", content: pageTitle },
docs/implementation-artifacts/code-reviews/10-5/full.diff:187:-    { name: "twitter:description", content: pageDescription },
docs/implementation-artifacts/code-reviews/10-5/full.diff:188:-    { name: "twitter:image", content: pageImage },
docs/implementation-artifacts/code-reviews/10-5/full.diff:231:-      { name: "description", content: article.description },
docs/implementation-artifacts/code-reviews/10-5/full.diff:232:-      { property: "og:type", content: "article" },
docs/implementation-artifacts/code-reviews/10-5/full.diff:233:-      { property: "og:title", content: article.title },
docs/implementation-artifacts/code-reviews/10-5/full.diff:234:-      { property: "og:description", content: article.description },
docs/implementation-artifacts/code-reviews/10-5/full.diff:235:-      { property: "og:url", content: url },
docs/implementation-artifacts/code-reviews/10-5/full.diff:236:-      ...(image ? [{ property: "og:image", content: image }] : []),
docs/implementation-artifacts/code-reviews/10-5/full.diff:237:-      { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
docs/implementation-artifacts/code-reviews/10-5/full.diff:238:-      { name: "twitter:title", content: article.title },
docs/implementation-artifacts/code-reviews/10-5/full.diff:239:-      { name: "twitter:description", content: article.description },
./.nuxt/manifest/latest.json

exec
/bin/zsh -lc 'rg -n "10-5|usePageSeo|canonical|Organization|Offer|logo|publisher|twitter" docs/implementation-artifacts/code-reviews/10-5 docs/implementation-artifacts/10-5-seo-centralise-site-wide.md docs/implementation-artifacts/deferred-work.md' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/implementation-artifacts/deferred-work.md:15:- ~~**Repli `forced-colors` DS-wide**~~ — ✅ **Résolu (story 9.1)** : repli posé une seule fois au niveau des primitives DS (`ZButton`, `ZCard`, `ZTag`, `ZInput`) via `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (rendu en couleur système sous forced-colors, le ring `box-shadow` restant le focus normal) ; anneau DS `--ring-accent` + même repli ajoutés aux liens du châssis (logo + nav header/menu, liens footer) qui n'avaient que l'outline UA. _(revues 3.2, 5.1)_
docs/implementation-artifacts/deferred-work.md:32:6. **Centralisation SEO site-wide** — la **dette concrète est soldée** (6.2) : `SITE_URL` unique dans `app/utils/seo.ts` (dédup `/about`+`/blog`+article), JSON-LD via `jsonLdScript()` qui échappe `</script>`. ✅ **`SITE_URL` sourcé depuis `runtimeConfig` fait en 10.1** (`runtimeConfig.public.siteUrl` + composable `useSiteUrl()`, surchargeable `NUXT_PUBLIC_SITE_URL`). **Reste** (architecture, non-dette) : migrer vers `useSeoMeta`/`app.head` partagé, ajouter `publisher`/`Organization` (ou `nuxt-schema-org`), et étendre OG/JSON-LD aux pages encore nues (home, services, contact). → **story 10.5**. _(revues 5.1, 6.1, 6.2)_
docs/implementation-artifacts/deferred-work.md:62:- **SEO `/contact`** — `useHead` ne pose que `title`+`description` (pas d'OG/canonical/JSON-LD), comme `/services`. Déjà couvert par l'**item 4 consolidé** (« étendre OG/JSON-LD aux pages encore nues : home, services, **contact** »). → story SEO dédiée / Epic 9. _(Les 2 autres findings 7.1 — focus a11y à l'envoi, erreurs collantes — sont des **patchs** de la story, pas des différés ; cf. Review Findings du ticket.)_
docs/implementation-artifacts/deferred-work.md:68:- **Centralisation SEO site-wide (consolidation)** — _Dette concrète résolue en 6.2_ : `SITE_URL` extrait dans `app/utils/seo.ts` (source unique, dédup `/about`+`/blog`+`/blog/[...slug]`) ; JSON-LD via helper `jsonLdScript()` qui **échappe `<`** (plus de risque `</script>`). _Reste_ (architecture, non-dette) : migration `useSeoMeta`/`app.head` partagé, `SITE_URL` depuis `runtimeConfig`, `publisher`/`Organization` (ou `nuxt-schema-org`). → story SEO dédiée / Epic 9.
docs/implementation-artifacts/deferred-work.md:73:- ~~**SEO `/blog`**~~ — ✅ **Résolu sur `/blog`** (décision Simon : zéro dette) : `og:*`/`twitter:*`/`canonical` + JSON-LD `Blog`→`BlogPosting` ajoutés au `useHead`, vérifiés dans le HTML prerendu. _Reste_ la **centralisation SEO site-wide** (autres pages que `/about` + `/blog`, via `useSeoMeta` partagé / `app.head`) — Epic 9.
docs/implementation-artifacts/deferred-work.md:86:- ~~**Balises Open Graph / Twitter / canonical absentes**~~ — ✅ **Résolu** pour `/about` : `og:*`, `twitter:*` et `canonical` ajoutés au `useHead` (domaine `dev.jouan.ovh`), vérifiés dans le HTML prérendu. _Reste à étendre aux autres pages_ (centralisation possible via `useSeoMeta` partagé / `app.head`) — amélioration SEO site-wide à planifier hors 5.1.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:20:**When** on centralise via `useSeoMeta`/`app.head` partagé, on source l'URL depuis `runtimeConfig` (posé en 10.1), on ajoute `publisher`/`Organization`, et on étend OG/Twitter/canonical + JSON-LD à home/services/contact
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:21:**Then** chaque page expose OG/Twitter/canonical + JSON-LD pertinent dans le HTML prerendu, sans domaine hardcodé (résolu via `runtimeConfig`)
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:27:  - [x] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:28:  - [x] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:30:  - [x] **Home `app/pages/index.vue`** : ajouter `usePageSeo` (aujourd'hui **aucune** meta dédiée → hérite seulement de `app.head` de `nuxt.config.ts`). OG/Twitter/canonical + JSON-LD (`WebSite`/`Person` selon pertinence) + image OG.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:31:  - [x] **Services `app/pages/services.vue`** : passer de `title`+`description` seuls à OG/Twitter/canonical + JSON-LD (`Service`/`WebPage`).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:32:  - [x] **Contact `app/pages/contact.vue`** : idem (OG/Twitter/canonical + `ContactPage`).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:33:  - [x] **Migrer `/about` + `/blog` + article** vers le helper partagé **sans régresser** leur SEO existant (ils ont déjà OG/Twitter/canonical + JSON-LD via `SITE_URL`/`jsonLdScript`) — dédup, rendu identique.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:36:  - [x] Inspecter le HTML **prerendu** (`.output/public/index.html`, `services/index.html`, `contact/index.html`, + re-vérifier `about`/`blog`) : présence de `og:*`, `twitter:*`, `<link rel="canonical">`, `<script type="application/ld+json">` ; URLs absolues résolues depuis `runtimeConfig` (staging tant que non basculé).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:45:- **Réutiliser, ne pas réinventer** : `app/utils/seo.ts` fournit déjà `jsonLdScript()` (échappe `</script>`). `/about` (`app/pages/about.vue`) et `/blog` (`index.vue` + `[...slug].vue`) ont déjà un pattern OG/Twitter/canonical + JSON-LD **fonctionnel** — le helper doit **généraliser ce pattern existant**, pas en inventer un autre.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:50:- **Nouveau** : `app/composables/usePageSeo.ts` (helper `useSeoMeta` partagé).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:51:- **`nuxt.config.ts`** (UPDATE) — `app.head` global (déjà : title, htmlAttrs lang fr, description) ; ajouter le JSON-LD `Organization`/`publisher` global si retenu (ou via plugin). `runtimeConfig.public.siteUrl` (posé en 10.1).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:55:- **`app/data/site.ts`** (LECTURE) — `SITE.profile` (nom/rôle) pour `Organization`/`Person`.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:69:- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + inspection du **HTML prerendu** (`.output/public`) pour home/services/contact (+ non-régression about/blog) : `og:*`/`twitter:*`/canonical/JSON-LD présents, URLs absolues via runtimeConfig. [Source: project-context.md#Tests, #Helpers partagés SEO/date]
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:86:- HTML inspection : `.output/public/{index,services,contact,about,blog}/index.html` checked for `<title>`, `<meta name="description">`, `og:*`, `twitter:*`, `<link rel="canonical">`, and `<script type="application/ld+json">`.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:89:- Création de `app/composables/usePageSeo.ts` qui centralise `useSeoMeta`, `<link rel="canonical">` et l'injection JSON-LD échappée via `jsonLdScript()`.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:90:- Injection du schéma global `Organization` dans `app/app.vue` alimenté par `useSiteUrl()` et `SITE.profile`.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:96:- `app/composables/usePageSeo.ts` (NEW)
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:105:- `docs/implementation-artifacts/10-5-seo-centralise-site-wide.md` (MODIFIED)
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:108:- 2026-09-13 : Implémentation complète de la Story 10.5 — Centralisation du SEO et Schema.org site-wide via `usePageSeo` et `useSiteUrl()`. Statut passé à `review`.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:17:- Spec file: `docs/implementation-artifacts/10-5-seo-centralise-site-wide.md`
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:19:- Diff file: `docs/implementation-artifacts/code-reviews/10-5/full.diff`
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:250:/bin/zsh -lc "printf '%s\\n' '--- files ---'; wc -l docs/implementation-artifacts/10-5-seo-centralise-site-wide.md docs/planning-artifacts/epics.md docs/project-context.md docs/implementation-artifacts/code-reviews/10-5/full.diff; printf '%s\\n' '--- config ---'; sed -n '1,220p' _bmad/bmm/config.yaml; printf '%s\\n' '--- spec ---'; sed -n '1,260p' docs/implementation-artifacts/10-5-seo-centralise-site-wide.md; printf '%s\\n' '--- epics story matches ---'; rg -n -C 24 '10\\.5|SEO|seo|centralise|centralize' docs/planning-artifacts/epics.md; printf '%s\\n' '--- project context ---'; sed -n '1,300p' docs/project-context.md" in /Users/simon/dev/jouan.ovh
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:253:     108 docs/implementation-artifacts/10-5-seo-centralise-site-wide.md
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:256:     517 docs/implementation-artifacts/code-reviews/10-5/full.diff
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:295:**When** on centralise via `useSeoMeta`/`app.head` partagé, on source l'URL depuis `runtimeConfig` (posé en 10.1), on ajoute `publisher`/`Organization`, et on étend OG/Twitter/canonical + JSON-LD à home/services/contact
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:296:**Then** chaque page expose OG/Twitter/canonical + JSON-LD pertinent dans le HTML prerendu, sans domaine hardcodé (résolu via `runtimeConfig`)
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:302:  - [x] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:303:  - [x] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:305:  - [x] **Home `app/pages/index.vue`** : ajouter `usePageSeo` (aujourd'hui **aucune** meta dédiée → hérite seulement de `app.head` de `nuxt.config.ts`). OG/Twitter/canonical + JSON-LD (`WebSite`/`Person` selon pertinence) + image OG.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:306:  - [x] **Services `app/pages/services.vue`** : passer de `title`+`description` seuls à OG/Twitter/canonical + JSON-LD (`Service`/`WebPage`).
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:307:  - [x] **Contact `app/pages/contact.vue`** : idem (OG/Twitter/canonical + `ContactPage`).
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:308:  - [x] **Migrer `/about` + `/blog` + article** vers le helper partagé **sans régresser** leur SEO existant (ils ont déjà OG/Twitter/canonical + JSON-LD via `SITE_URL`/`jsonLdScript`) — dédup, rendu identique.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:311:  - [x] Inspecter le HTML **prerendu** (`.output/public/index.html`, `services/index.html`, `contact/index.html`, + re-vérifier `about`/`blog`) : présence de `og:*`, `twitter:*`, `<link rel="canonical">`, `<script type="application/ld+json">` ; URLs absolues résolues depuis `runtimeConfig` (staging tant que non basculé).
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:320:- **Réutiliser, ne pas réinventer** : `app/utils/seo.ts` fournit déjà `jsonLdScript()` (échappe `</script>`). `/about` (`app/pages/about.vue`) et `/blog` (`index.vue` + `[...slug].vue`) ont déjà un pattern OG/Twitter/canonical + JSON-LD **fonctionnel** — le helper doit **généraliser ce pattern existant**, pas en inventer un autre.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:325:- **Nouveau** : `app/composables/usePageSeo.ts` (helper `useSeoMeta` partagé).
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:326:- **`nuxt.config.ts`** (UPDATE) — `app.head` global (déjà : title, htmlAttrs lang fr, description) ; ajouter le JSON-LD `Organization`/`publisher` global si retenu (ou via plugin). `runtimeConfig.public.siteUrl` (posé en 10.1).
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:330:- **`app/data/site.ts`** (LECTURE) — `SITE.profile` (nom/rôle) pour `Organization`/`Person`.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:344:- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + inspection du **HTML prerendu** (`.output/public`) pour home/services/contact (+ non-régression about/blog) : `og:*`/`twitter:*`/canonical/JSON-LD présents, URLs absolues via runtimeConfig. [Source: project-context.md#Tests, #Helpers partagés SEO/date]
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:361:- HTML inspection : `.output/public/{index,services,contact,about,blog}/index.html` checked for `<title>`, `<meta name="description">`, `og:*`, `twitter:*`, `<link rel="canonical">`, and `<script type="application/ld+json">`.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:364:- Création de `app/composables/usePageSeo.ts` qui centralise `useSeoMeta`, `<link rel="canonical">` et l'injection JSON-LD échappée via `jsonLdScript()`.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:365:- Injection du schéma global `Organization` dans `app/app.vue` alimenté par `useSiteUrl()` et `SITE.profile`.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:371:- `app/composables/usePageSeo.ts` (NEW)
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:380:- `docs/implementation-artifacts/10-5-seo-centralise-site-wide.md` (MODIFIED)
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:383:- 2026-09-13 : Implémentation complète de la Story 10.5 — Centralisation du SEO et Schema.org site-wide via `usePageSeo` et `useSiteUrl()`. Statut passé à `review`.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:409:39:FR15: Centraliser le SEO site-wide (`useSeoMeta`/`app.head` partagé, `SITE_URL` depuis `runtimeConfig`, `publisher`/`Organization`) et étendre OG/JSON-LD aux pages encore nues (home, services, contact). _(deferred-work SEO #6)_
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:435:77-UX-DR11: Layout global — header fixe 56px (logo diamant), footer 56px, hexagones sociaux (footer/contact).
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:611:630:**When** on centralise via `useSeoMeta`/`app.head` partagé, on source `SITE_URL` depuis `runtimeConfig`, on ajoute `publisher`/`Organization`, et on étend OG/Twitter/canonical + JSON-LD à home/services/contact
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:612:631-**Then** chaque page expose OG/Twitter/canonical + JSON-LD pertinent dans le HTML prerendu, sans domaine hardcodé (résolu via `runtimeConfig`)
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:968:/bin/zsh -lc "printf '%s\\n' '--- Story 10.5 in epics ---'; sed -n '610,658p' docs/planning-artifacts/epics.md; printf '%s\\n' '--- spec complete ---'; sed -n '1,140p' docs/implementation-artifacts/10-5-seo-centralise-site-wide.md; printf '%s\\n' '--- diff 1/2 ---'; sed -n '1,280p' docs/implementation-artifacts/code-reviews/10-5/full.diff" in /Users/simon/dev/jouan.ovh
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:991:**When** on centralise via `useSeoMeta`/`app.head` partagé, on source `SITE_URL` depuis `runtimeConfig`, on ajoute `publisher`/`Organization`, et on étend OG/Twitter/canonical + JSON-LD à home/services/contact
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:992:**Then** chaque page expose OG/Twitter/canonical + JSON-LD pertinent dans le HTML prerendu, sans domaine hardcodé (résolu via `runtimeConfig`)
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1019:**And** non-régression post-déploiement (pages + terminal + formulaire) vérifiée ; `canonical`/`og:url` pointent sur `jouan.ovh`
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1040:**When** on centralise via `useSeoMeta`/`app.head` partagé, on source l'URL depuis `runtimeConfig` (posé en 10.1), on ajoute `publisher`/`Organization`, et on étend OG/Twitter/canonical + JSON-LD à home/services/contact
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1041:**Then** chaque page expose OG/Twitter/canonical + JSON-LD pertinent dans le HTML prerendu, sans domaine hardcodé (résolu via `runtimeConfig`)
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1047:  - [x] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1048:  - [x] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1050:  - [x] **Home `app/pages/index.vue`** : ajouter `usePageSeo` (aujourd'hui **aucune** meta dédiée → hérite seulement de `app.head` de `nuxt.config.ts`). OG/Twitter/canonical + JSON-LD (`WebSite`/`Person` selon pertinence) + image OG.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1051:  - [x] **Services `app/pages/services.vue`** : passer de `title`+`description` seuls à OG/Twitter/canonical + JSON-LD (`Service`/`WebPage`).
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1052:  - [x] **Contact `app/pages/contact.vue`** : idem (OG/Twitter/canonical + `ContactPage`).
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1053:  - [x] **Migrer `/about` + `/blog` + article** vers le helper partagé **sans régresser** leur SEO existant (ils ont déjà OG/Twitter/canonical + JSON-LD via `SITE_URL`/`jsonLdScript`) — dédup, rendu identique.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1056:  - [x] Inspecter le HTML **prerendu** (`.output/public/index.html`, `services/index.html`, `contact/index.html`, + re-vérifier `about`/`blog`) : présence de `og:*`, `twitter:*`, `<link rel="canonical">`, `<script type="application/ld+json">` ; URLs absolues résolues depuis `runtimeConfig` (staging tant que non basculé).
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1065:- **Réutiliser, ne pas réinventer** : `app/utils/seo.ts` fournit déjà `jsonLdScript()` (échappe `</script>`). `/about` (`app/pages/about.vue`) et `/blog` (`index.vue` + `[...slug].vue`) ont déjà un pattern OG/Twitter/canonical + JSON-LD **fonctionnel** — le helper doit **généraliser ce pattern existant**, pas en inventer un autre.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1070:- **Nouveau** : `app/composables/usePageSeo.ts` (helper `useSeoMeta` partagé).
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1071:- **`nuxt.config.ts`** (UPDATE) — `app.head` global (déjà : title, htmlAttrs lang fr, description) ; ajouter le JSON-LD `Organization`/`publisher` global si retenu (ou via plugin). `runtimeConfig.public.siteUrl` (posé en 10.1).
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1075:- **`app/data/site.ts`** (LECTURE) — `SITE.profile` (nom/rôle) pour `Organization`/`Person`.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1089:- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + inspection du **HTML prerendu** (`.output/public`) pour home/services/contact (+ non-régression about/blog) : `og:*`/`twitter:*`/canonical/JSON-LD présents, URLs absolues via runtimeConfig. [Source: project-context.md#Tests, #Helpers partagés SEO/date]
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1106:- HTML inspection : `.output/public/{index,services,contact,about,blog}/index.html` checked for `<title>`, `<meta name="description">`, `og:*`, `twitter:*`, `<link rel="canonical">`, and `<script type="application/ld+json">`.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1109:- Création de `app/composables/usePageSeo.ts` qui centralise `useSeoMeta`, `<link rel="canonical">` et l'injection JSON-LD échappée via `jsonLdScript()`.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1110:- Injection du schéma global `Organization` dans `app/app.vue` alimenté par `useSiteUrl()` et `SITE.profile`.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1116:- `app/composables/usePageSeo.ts` (NEW)
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1125:- `docs/implementation-artifacts/10-5-seo-centralise-site-wide.md` (MODIFIED)
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1128:- 2026-09-13 : Implémentation complète de la Story 10.5 — Centralisation du SEO et Schema.org site-wide via `usePageSeo` et `useSiteUrl()`. Statut passé à `review`.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1141:+// Métadonnées Schema.org globales (Organization / publisher du site).
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1147:+  "@type": "Organization",
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1150:+  logo: `${siteUrl}/images/logo.png`,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1164:diff --git a/app/composables/usePageSeo.ts b/app/composables/usePageSeo.ts
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1168:+++ b/app/composables/usePageSeo.ts
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1174:+  /** Titre de la page (utilisé pour <title>, og:title, twitter:title). */
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1176:+  /** Description de la page (utilisée pour <meta name="description">, og:description, twitter:description). */
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1185:+  twitterCard?: "summary" | "summary_large_image";
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1192:+ * <title>, canonical, description, Open Graph (type, title, desc, url, image)
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1197:+export function usePageSeo(options: MaybeRefOrGetter<PageSeoOptions | undefined | null>): void {
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1208:+    const canonicalUrl = cleanPath ? `${siteUrl}${cleanPath}` : siteUrl;
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1219:+    const twitterCard =
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1220:+      opts.twitterCard ??
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1221:+      (imageUrl && (type === "article" || opts.twitterCard === "summary_large_image")
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1228:+      canonicalUrl,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1231:+      twitterCard,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1254:+      link: [{ rel: "canonical", href: seo.value.canonicalUrl }],
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1264:+    ogUrl: () => seo.value?.canonicalUrl,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1267:+    twitterCard: () => seo.value?.twitterCard,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1268:+    twitterTitle: () => seo.value?.title,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1269:+    twitterDescription: () => seo.value?.description,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1270:+    twitterImage: () => seo.value?.imageUrl,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1282:-// domaine en dur). Inchangée en staging → canonical/og restent sur le domaine staging.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1302:+usePageSeo({
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1304:-  link: [{ rel: "canonical", href: pageUrl }],
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1314:-    { name: "twitter:card", content: "summary" },
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1315:-    { name: "twitter:title", content: pageTitle },
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1316:-    { name: "twitter:description", content: pageDescription },
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1317:-    { name: "twitter:image", content: pageImage },
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1323:+  twitterCard: "summary",
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1339:+// SEO par article (centralisé via usePageSeo, parité /about, /blog).
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1340:+// usePageSeo résout siteUrl, canonical, og:*, twitter:* et le JSON-LD échappé.
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1343:+usePageSeo(() => {
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1358:-    link: [{ rel: "canonical", href: url }],
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1366:-      { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1367:-      { name: "twitter:title", content: article.title },
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1368:-      { name: "twitter:description", content: article.description },
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1369:-      ...(image ? [{ name: "twitter:image", content: image }] : []),
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1389:+usePageSeo({
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1391:-  link: [{ rel: "canonical", href: pageUrl }],
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1400:-    { name: "twitter:card", content: "summary" },
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1401:-    { name: "twitter:title", content: pageTitle },
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1402:-    { name: "twitter:description", content: pageDescription },
docs/implementation-artifacts/code-reviews/10-5/prompt-acceptance-auditor.md:4:- Spec file: `docs/implementation-artifacts/10-5-seo-centralise-site-wide.md`
docs/implementation-artifacts/code-reviews/10-5/prompt-acceptance-auditor.md:6:- Diff file: `docs/implementation-artifacts/code-reviews/10-5/full.diff`
docs/implementation-artifacts/code-reviews/10-5/full.diff:12:+// Métadonnées Schema.org globales (Organization / publisher du site).
docs/implementation-artifacts/code-reviews/10-5/full.diff:18:+  "@type": "Organization",
docs/implementation-artifacts/code-reviews/10-5/full.diff:21:+  logo: `${siteUrl}/images/logo.png`,
docs/implementation-artifacts/code-reviews/10-5/full.diff:35:diff --git a/app/composables/usePageSeo.ts b/app/composables/usePageSeo.ts
docs/implementation-artifacts/code-reviews/10-5/full.diff:39:+++ b/app/composables/usePageSeo.ts
docs/implementation-artifacts/code-reviews/10-5/full.diff:45:+  /** Titre de la page (utilisé pour <title>, og:title, twitter:title). */
docs/implementation-artifacts/code-reviews/10-5/full.diff:47:+  /** Description de la page (utilisée pour <meta name="description">, og:description, twitter:description). */
docs/implementation-artifacts/code-reviews/10-5/full.diff:56:+  twitterCard?: "summary" | "summary_large_image";
docs/implementation-artifacts/code-reviews/10-5/full.diff:63:+ * <title>, canonical, description, Open Graph (type, title, desc, url, image)
docs/implementation-artifacts/code-reviews/10-5/full.diff:68:+export function usePageSeo(options: MaybeRefOrGetter<PageSeoOptions | undefined | null>): void {
docs/implementation-artifacts/code-reviews/10-5/full.diff:79:+    const canonicalUrl = cleanPath ? `${siteUrl}${cleanPath}` : siteUrl;
docs/implementation-artifacts/code-reviews/10-5/full.diff:90:+    const twitterCard =
docs/implementation-artifacts/code-reviews/10-5/full.diff:91:+      opts.twitterCard ??
docs/implementation-artifacts/code-reviews/10-5/full.diff:92:+      (imageUrl && (type === "article" || opts.twitterCard === "summary_large_image")
docs/implementation-artifacts/code-reviews/10-5/full.diff:99:+      canonicalUrl,
docs/implementation-artifacts/code-reviews/10-5/full.diff:102:+      twitterCard,
docs/implementation-artifacts/code-reviews/10-5/full.diff:125:+      link: [{ rel: "canonical", href: seo.value.canonicalUrl }],
docs/implementation-artifacts/code-reviews/10-5/full.diff:135:+    ogUrl: () => seo.value?.canonicalUrl,
docs/implementation-artifacts/code-reviews/10-5/full.diff:138:+    twitterCard: () => seo.value?.twitterCard,
docs/implementation-artifacts/code-reviews/10-5/full.diff:139:+    twitterTitle: () => seo.value?.title,
docs/implementation-artifacts/code-reviews/10-5/full.diff:140:+    twitterDescription: () => seo.value?.description,
docs/implementation-artifacts/code-reviews/10-5/full.diff:141:+    twitterImage: () => seo.value?.imageUrl,
docs/implementation-artifacts/code-reviews/10-5/full.diff:153:-// domaine en dur). Inchangée en staging → canonical/og restent sur le domaine staging.
docs/implementation-artifacts/code-reviews/10-5/full.diff:173:+usePageSeo({
docs/implementation-artifacts/code-reviews/10-5/full.diff:175:-  link: [{ rel: "canonical", href: pageUrl }],
docs/implementation-artifacts/code-reviews/10-5/full.diff:185:-    { name: "twitter:card", content: "summary" },
docs/implementation-artifacts/code-reviews/10-5/full.diff:186:-    { name: "twitter:title", content: pageTitle },
docs/implementation-artifacts/code-reviews/10-5/full.diff:187:-    { name: "twitter:description", content: pageDescription },
docs/implementation-artifacts/code-reviews/10-5/full.diff:188:-    { name: "twitter:image", content: pageImage },
docs/implementation-artifacts/code-reviews/10-5/full.diff:194:+  twitterCard: "summary",
docs/implementation-artifacts/code-reviews/10-5/full.diff:210:+// SEO par article (centralisé via usePageSeo, parité /about, /blog).
docs/implementation-artifacts/code-reviews/10-5/full.diff:211:+// usePageSeo résout siteUrl, canonical, og:*, twitter:* et le JSON-LD échappé.
docs/implementation-artifacts/code-reviews/10-5/full.diff:214:+usePageSeo(() => {
docs/implementation-artifacts/code-reviews/10-5/full.diff:229:-    link: [{ rel: "canonical", href: url }],
docs/implementation-artifacts/code-reviews/10-5/full.diff:237:-      { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
docs/implementation-artifacts/code-reviews/10-5/full.diff:238:-      { name: "twitter:title", content: article.title },
docs/implementation-artifacts/code-reviews/10-5/full.diff:239:-      { name: "twitter:description", content: article.description },
docs/implementation-artifacts/code-reviews/10-5/full.diff:240:-      ...(image ? [{ name: "twitter:image", content: image }] : []),
docs/implementation-artifacts/code-reviews/10-5/full.diff:260:+usePageSeo({
docs/implementation-artifacts/code-reviews/10-5/full.diff:262:-  link: [{ rel: "canonical", href: pageUrl }],
docs/implementation-artifacts/code-reviews/10-5/full.diff:271:-    { name: "twitter:card", content: "summary" },
docs/implementation-artifacts/code-reviews/10-5/full.diff:272:-    { name: "twitter:title", content: pageTitle },
docs/implementation-artifacts/code-reviews/10-5/full.diff:273:-    { name: "twitter:description", content: pageDescription },
docs/implementation-artifacts/code-reviews/10-5/full.diff:319:+usePageSeo({
docs/implementation-artifacts/code-reviews/10-5/full.diff:363:+usePageSeo({
docs/implementation-artifacts/code-reviews/10-5/full.diff:396:+      "@type": "Offer",
docs/implementation-artifacts/code-reviews/10-5/full.diff:405:+usePageSeo({
docs/implementation-artifacts/code-reviews/10-5/full.diff:423:diff --git a/docs/implementation-artifacts/10-5-seo-centralise-site-wide.md b/docs/implementation-artifacts/10-5-seo-centralise-site-wide.md
docs/implementation-artifacts/code-reviews/10-5/full.diff:425:--- a/docs/implementation-artifacts/10-5-seo-centralise-site-wide.md
docs/implementation-artifacts/code-reviews/10-5/full.diff:426:+++ b/docs/implementation-artifacts/10-5-seo-centralise-site-wide.md
docs/implementation-artifacts/code-reviews/10-5/full.diff:441:-  - [ ] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
docs/implementation-artifacts/code-reviews/10-5/full.diff:442:-  - [ ] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).
docs/implementation-artifacts/code-reviews/10-5/full.diff:444:-  - [ ] **Home `app/pages/index.vue`** : ajouter `usePageSeo` (aujourd'hui **aucune** meta dédiée → hérite seulement de `app.head` de `nuxt.config.ts`). OG/Twitter/canonical + JSON-LD (`WebSite`/`Person` selon pertinence) + image OG.
docs/implementation-artifacts/code-reviews/10-5/full.diff:445:-  - [ ] **Services `app/pages/services.vue`** : passer de `title`+`description` seuls à OG/Twitter/canonical + JSON-LD (`Service`/`WebPage`).
docs/implementation-artifacts/code-reviews/10-5/full.diff:446:-  - [ ] **Contact `app/pages/contact.vue`** : idem (OG/Twitter/canonical + `ContactPage`).
docs/implementation-artifacts/code-reviews/10-5/full.diff:447:-  - [ ] **Migrer `/about` + `/blog` + article** vers le helper partagé **sans régresser** leur SEO existant (ils ont déjà OG/Twitter/canonical + JSON-LD via `SITE_URL`/`jsonLdScript`) — dédup, rendu identique.
docs/implementation-artifacts/code-reviews/10-5/full.diff:450:-  - [ ] Inspecter le HTML **prerendu** (`.output/public/index.html`, `services/index.html`, `contact/index.html`, + re-vérifier `about`/`blog`) : présence de `og:*`, `twitter:*`, `<link rel="canonical">`, `<script type="application/ld+json">` ; URLs absolues résolues depuis `runtimeConfig` (staging tant que non basculé).
docs/implementation-artifacts/code-reviews/10-5/full.diff:452:+  - [x] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
docs/implementation-artifacts/code-reviews/10-5/full.diff:453:+  - [x] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).
docs/implementation-artifacts/code-reviews/10-5/full.diff:455:+  - [x] **Home `app/pages/index.vue`** : ajouter `usePageSeo` (aujourd'hui **aucune** meta dédiée → hérite seulement de `app.head` de `nuxt.config.ts`). OG/Twitter/canonical + JSON-LD (`WebSite`/`Person` selon pertinence) + image OG.
docs/implementation-artifacts/code-reviews/10-5/full.diff:456:+  - [x] **Services `app/pages/services.vue`** : passer de `title`+`description` seuls à OG/Twitter/canonical + JSON-LD (`Service`/`WebPage`).
docs/implementation-artifacts/code-reviews/10-5/full.diff:457:+  - [x] **Contact `app/pages/contact.vue`** : idem (OG/Twitter/canonical + `ContactPage`).
docs/implementation-artifacts/code-reviews/10-5/full.diff:458:+  - [x] **Migrer `/about` + `/blog` + article** vers le helper partagé **sans régresser** leur SEO existant (ils ont déjà OG/Twitter/canonical + JSON-LD via `SITE_URL`/`jsonLdScript`) — dédup, rendu identique.
docs/implementation-artifacts/code-reviews/10-5/full.diff:461:+  - [x] Inspecter le HTML **prerendu** (`.output/public/index.html`, `services/index.html`, `contact/index.html`, + re-vérifier `about`/`blog`) : présence de `og:*`, `twitter:*`, `<link rel="canonical">`, `<script type="application/ld+json">` ; URLs absolues résolues depuis `runtimeConfig` (staging tant que non basculé).
docs/implementation-artifacts/code-reviews/10-5/full.diff:473:+- HTML inspection : `.output/public/{index,services,contact,about,blog}/index.html` checked for `<title>`, `<meta name="description">`, `og:*`, `twitter:*`, `<link rel="canonical">`, and `<script type="application/ld+json">`.
docs/implementation-artifacts/code-reviews/10-5/full.diff:476:+- Création de `app/composables/usePageSeo.ts` qui centralise `useSeoMeta`, `<link rel="canonical">` et l'injection JSON-LD échappée via `jsonLdScript()`.
docs/implementation-artifacts/code-reviews/10-5/full.diff:477:+- Injection du schéma global `Organization` dans `app/app.vue` alimenté par `useSiteUrl()` et `SITE.profile`.
docs/implementation-artifacts/code-reviews/10-5/full.diff:483:+- `app/composables/usePageSeo.ts` (NEW)
docs/implementation-artifacts/code-reviews/10-5/full.diff:492:+- `docs/implementation-artifacts/10-5-seo-centralise-site-wide.md` (MODIFIED)
docs/implementation-artifacts/code-reviews/10-5/full.diff:495:+- 2026-09-13 : Implémentation complète de la Story 10.5 — Centralisation du SEO et Schema.org site-wide via `usePageSeo` et `useSiteUrl()`. Statut passé à `review`.
docs/implementation-artifacts/code-reviews/10-5/full.diff:505:+last_updated: "2026-09-13 (Story 10.5 prête pour revue : SEO centralisé site-wide via usePageSeo, statut review)"
docs/implementation-artifacts/code-reviews/10-5/full.diff:513:-  10-5-seo-centralise-site-wide: ready-for-dev
docs/implementation-artifacts/code-reviews/10-5/full.diff:514:+  10-5-seo-centralise-site-wide: review
docs/implementation-artifacts/code-reviews/10-5/prompt-blind-hunter.md:5:Diff file: `docs/implementation-artifacts/code-reviews/10-5/full.diff`
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:18:Diff file: `docs/implementation-artifacts/code-reviews/10-5/full.diff`
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:108:/bin/zsh -lc "wc -l docs/implementation-artifacts/code-reviews/10-5/full.diff && sed -n '1,260p' docs/implementation-artifacts/code-reviews/10-5/full.diff" in /Users/simon/dev/jouan.ovh
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:110:     517 docs/implementation-artifacts/code-reviews/10-5/full.diff
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:122:+// Métadonnées Schema.org globales (Organization / publisher du site).
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:128:+  "@type": "Organization",
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:131:+  logo: `${siteUrl}/images/logo.png`,
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:145:diff --git a/app/composables/usePageSeo.ts b/app/composables/usePageSeo.ts
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:149:+++ b/app/composables/usePageSeo.ts
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:155:+  /** Titre de la page (utilisé pour <title>, og:title, twitter:title). */
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:157:+  /** Description de la page (utilisée pour <meta name="description">, og:description, twitter:description). */
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:166:+  twitterCard?: "summary" | "summary_large_image";
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:173:+ * <title>, canonical, description, Open Graph (type, title, desc, url, image)
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:178:+export function usePageSeo(options: MaybeRefOrGetter<PageSeoOptions | undefined | null>): void {
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:189:+    const canonicalUrl = cleanPath ? `${siteUrl}${cleanPath}` : siteUrl;
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:200:+    const twitterCard =
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:201:+      opts.twitterCard ??
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:202:+      (imageUrl && (type === "article" || opts.twitterCard === "summary_large_image")
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:209:+      canonicalUrl,
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:212:+      twitterCard,
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:235:+      link: [{ rel: "canonical", href: seo.value.canonicalUrl }],
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:245:+    ogUrl: () => seo.value?.canonicalUrl,
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:248:+    twitterCard: () => seo.value?.twitterCard,
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:249:+    twitterTitle: () => seo.value?.title,
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:250:+    twitterDescription: () => seo.value?.description,
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:251:+    twitterImage: () => seo.value?.imageUrl,
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:263:-// domaine en dur). Inchangée en staging → canonical/og restent sur le domaine staging.
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:283:+usePageSeo({
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:285:-  link: [{ rel: "canonical", href: pageUrl }],
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:295:-    { name: "twitter:card", content: "summary" },
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:296:-    { name: "twitter:title", content: pageTitle },
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:297:-    { name: "twitter:description", content: pageDescription },
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:298:-    { name: "twitter:image", content: pageImage },
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:304:+  twitterCard: "summary",
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:320:+// SEO par article (centralisé via usePageSeo, parité /about, /blog).
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:321:+// usePageSeo résout siteUrl, canonical, og:*, twitter:* et le JSON-LD échappé.
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:324:+usePageSeo(() => {
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:339:-    link: [{ rel: "canonical", href: url }],
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:347:-      { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:348:-      { name: "twitter:title", content: article.title },
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:349:-      { name: "twitter:description", content: article.description },
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:350:-      ...(image ? [{ name: "twitter:image", content: image }] : []),
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:370:+usePageSeo({
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:373:/bin/zsh -lc "sed -n '261,560p' docs/implementation-artifacts/code-reviews/10-5/full.diff" in /Users/simon/dev/jouan.ovh
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:376:-  link: [{ rel: "canonical", href: pageUrl }],
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:385:-    { name: "twitter:card", content: "summary" },
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:386:-    { name: "twitter:title", content: pageTitle },
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:387:-    { name: "twitter:description", content: pageDescription },
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:433:+usePageSeo({
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:477:+usePageSeo({
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:510:+      "@type": "Offer",
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:519:+usePageSeo({
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:537:diff --git a/docs/implementation-artifacts/10-5-seo-centralise-site-wide.md b/docs/implementation-artifacts/10-5-seo-centralise-site-wide.md
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:539:--- a/docs/implementation-artifacts/10-5-seo-centralise-site-wide.md
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:540:+++ b/docs/implementation-artifacts/10-5-seo-centralise-site-wide.md
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:555:-  - [ ] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:556:-  - [ ] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:558:-  - [ ] **Home `app/pages/index.vue`** : ajouter `usePageSeo` (aujourd'hui **aucune** meta dédiée → hérite seulement de `app.head` de `nuxt.config.ts`). OG/Twitter/canonical + JSON-LD (`WebSite`/`Person` selon pertinence) + image OG.
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:559:-  - [ ] **Services `app/pages/services.vue`** : passer de `title`+`description` seuls à OG/Twitter/canonical + JSON-LD (`Service`/`WebPage`).
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:560:-  - [ ] **Contact `app/pages/contact.vue`** : idem (OG/Twitter/canonical + `ContactPage`).
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:561:-  - [ ] **Migrer `/about` + `/blog` + article** vers le helper partagé **sans régresser** leur SEO existant (ils ont déjà OG/Twitter/canonical + JSON-LD via `SITE_URL`/`jsonLdScript`) — dédup, rendu identique.
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:564:-  - [ ] Inspecter le HTML **prerendu** (`.output/public/index.html`, `services/index.html`, `contact/index.html`, + re-vérifier `about`/`blog`) : présence de `og:*`, `twitter:*`, `<link rel="canonical">`, `<script type="application/ld+json">` ; URLs absolues résolues depuis `runtimeConfig` (staging tant que non basculé).
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:566:+  - [x] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:567:+  - [x] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:569:+  - [x] **Home `app/pages/index.vue`** : ajouter `usePageSeo` (aujourd'hui **aucune** meta dédiée → hérite seulement de `app.head` de `nuxt.config.ts`). OG/Twitter/canonical + JSON-LD (`WebSite`/`Person` selon pertinence) + image OG.
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:570:+  - [x] **Services `app/pages/services.vue`** : passer de `title`+`description` seuls à OG/Twitter/canonical + JSON-LD (`Service`/`WebPage`).
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:571:+  - [x] **Contact `app/pages/contact.vue`** : idem (OG/Twitter/canonical + `ContactPage`).
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:572:+  - [x] **Migrer `/about` + `/blog` + article** vers le helper partagé **sans régresser** leur SEO existant (ils ont déjà OG/Twitter/canonical + JSON-LD via `SITE_URL`/`jsonLdScript`) — dédup, rendu identique.
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:575:+  - [x] Inspecter le HTML **prerendu** (`.output/public/index.html`, `services/index.html`, `contact/index.html`, + re-vérifier `about`/`blog`) : présence de `og:*`, `twitter:*`, `<link rel="canonical">`, `<script type="application/ld+json">` ; URLs absolues résolues depuis `runtimeConfig` (staging tant que non basculé).
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:587:+- HTML inspection : `.output/public/{index,services,contact,about,blog}/index.html` checked for `<title>`, `<meta name="description">`, `og:*`, `twitter:*`, `<link rel="canonical">`, and `<script type="application/ld+json">`.
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:590:+- Création de `app/composables/usePageSeo.ts` qui centralise `useSeoMeta`, `<link rel="canonical">` et l'injection JSON-LD échappée via `jsonLdScript()`.
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:591:+- Injection du schéma global `Organization` dans `app/app.vue` alimenté par `useSiteUrl()` et `SITE.profile`.
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:597:+- `app/composables/usePageSeo.ts` (NEW)
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:606:+- `docs/implementation-artifacts/10-5-seo-centralise-site-wide.md` (MODIFIED)
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:609:+- 2026-09-13 : Implémentation complète de la Story 10.5 — Centralisation du SEO et Schema.org site-wide via `usePageSeo` et `useSiteUrl()`. Statut passé à `review`.
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:619:+last_updated: "2026-09-13 (Story 10.5 prête pour revue : SEO centralisé site-wide via usePageSeo, statut review)"
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:627:-  10-5-seo-centralise-site-wide: ready-for-dev
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:628:+  10-5-seo-centralise-site-wide: review
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:642:app/pages/blog/[...slug].vue:112:// usePageSeo résout siteUrl, canonical, og:*, twitter:* et le JSON-LD échappé.
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:669:app/composables/usePageSeo.ts:9:  /** Chemin relatif de la page (ex. "/" ou "/services" ou "/blog/slug"). Si omis, résolu sur siteUrl. */
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:670:app/composables/usePageSeo.ts:17:  /** Données JSON-LD (objet Schema.org ou tableau d'objets) injectées via jsonLdScript. */
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:671:app/composables/usePageSeo.ts:26: * Résout automatiquement les URLs absolues à partir de `useSiteUrl()` (runtimeConfig).
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:672:app/composables/usePageSeo.ts:29:  const siteUrl = useSiteUrl();
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:673:app/composables/usePageSeo.ts:39:    const canonicalUrl = cleanPath ? `${siteUrl}${cleanPath}` : siteUrl;
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:674:app/composables/usePageSeo.ts:46:          : `${siteUrl}${opts.image.startsWith("/") ? opts.image : `/${opts.image}`}`;
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:675:app/composables/usePageSeo.ts:76:          scripts.push(jsonLdScript(item));
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:676:app/composables/usePageSeo.ts:79:        scripts.push(jsonLdScript(seo.value.jsonLd));
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:680:app/app.vue:19:  logo: `${siteUrl}/images/logo.png`,
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:686:/bin/zsh -lc 'nl -ba app/composables/useSiteUrl.ts; nl -ba app/utils/seo.ts; nl -ba app/composables/usePageSeo.ts' in /Users/simon/dev/jouan.ovh
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:688:     1	// URL publique du site (canonical / og:url / JSON-LD) — point d'accès unique.
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:697:    10	  // émettrait des canonical/og:url/JSON-LD RELATIFS silencieusement cassés (ex. une ligne
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:744:     5	  /** Titre de la page (utilisé pour <title>, og:title, twitter:title). */
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:746:     7	  /** Description de la page (utilisée pour <meta name="description">, og:description, twitter:description). */
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:755:    16	  twitterCard?: "summary" | "summary_large_image";
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:762:    23	 * <title>, canonical, description, Open Graph (type, title, desc, url, image)
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:767:    28	export function usePageSeo(options: MaybeRefOrGetter<PageSeoOptions | undefined | null>): void {
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:778:    39	    const canonicalUrl = cleanPath ? `${siteUrl}${cleanPath}` : siteUrl;
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:789:    50	    const twitterCard =
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:790:    51	      opts.twitterCard ??
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:791:    52	      (imageUrl && (type === "article" || opts.twitterCard === "summary_large_image")
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:798:    59	      canonicalUrl,
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:801:    62	      twitterCard,
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:824:    85	      link: [{ rel: "canonical", href: seo.value.canonicalUrl }],
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:834:    95	    ogUrl: () => seo.value?.canonicalUrl,
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:837:    98	    twitterCard: () => seo.value?.twitterCard,
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:838:    99	    twitterTitle: () => seo.value?.title,
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:839:   100	    twitterDescription: () => seo.value?.description,
docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:840:   101	    twitterImage: () => seo.value?.imageUrl,
docs/implementation-artifacts/code-reviews/10-5/prompt-edge-case-hunter.md:5:Diff file: `docs/implementation-artifacts/code-reviews/10-5/full.diff`
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:19:Diff file: `docs/implementation-artifacts/code-reviews/10-5/full.diff`
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:69:/bin/zsh -lc "wc -l docs/implementation-artifacts/code-reviews/10-5/full.diff && sed -n '1,260p' docs/implementation-artifacts/code-reviews/10-5/full.diff" in /Users/simon/dev/jouan.ovh
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:71:     517 docs/implementation-artifacts/code-reviews/10-5/full.diff
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:83:+// Métadonnées Schema.org globales (Organization / publisher du site).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:89:+  "@type": "Organization",
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:92:+  logo: `${siteUrl}/images/logo.png`,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:106:diff --git a/app/composables/usePageSeo.ts b/app/composables/usePageSeo.ts
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:110:+++ b/app/composables/usePageSeo.ts
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:116:+  /** Titre de la page (utilisé pour <title>, og:title, twitter:title). */
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:118:+  /** Description de la page (utilisée pour <meta name="description">, og:description, twitter:description). */
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:127:+  twitterCard?: "summary" | "summary_large_image";
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:134:+ * <title>, canonical, description, Open Graph (type, title, desc, url, image)
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:139:+export function usePageSeo(options: MaybeRefOrGetter<PageSeoOptions | undefined | null>): void {
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:150:+    const canonicalUrl = cleanPath ? `${siteUrl}${cleanPath}` : siteUrl;
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:161:+    const twitterCard =
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:162:+      opts.twitterCard ??
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:163:+      (imageUrl && (type === "article" || opts.twitterCard === "summary_large_image")
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:170:+      canonicalUrl,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:173:+      twitterCard,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:196:+      link: [{ rel: "canonical", href: seo.value.canonicalUrl }],
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:206:+    ogUrl: () => seo.value?.canonicalUrl,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:209:+    twitterCard: () => seo.value?.twitterCard,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:210:+    twitterTitle: () => seo.value?.title,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:211:+    twitterDescription: () => seo.value?.description,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:212:+    twitterImage: () => seo.value?.imageUrl,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:224:-// domaine en dur). Inchangée en staging → canonical/og restent sur le domaine staging.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:244:+usePageSeo({
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:246:-  link: [{ rel: "canonical", href: pageUrl }],
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:256:-    { name: "twitter:card", content: "summary" },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:257:-    { name: "twitter:title", content: pageTitle },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:258:-    { name: "twitter:description", content: pageDescription },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:259:-    { name: "twitter:image", content: pageImage },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:265:+  twitterCard: "summary",
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:281:+// SEO par article (centralisé via usePageSeo, parité /about, /blog).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:282:+// usePageSeo résout siteUrl, canonical, og:*, twitter:* et le JSON-LD échappé.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:285:+usePageSeo(() => {
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:300:-    link: [{ rel: "canonical", href: url }],
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:308:-      { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:309:-      { name: "twitter:title", content: article.title },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:310:-      { name: "twitter:description", content: article.description },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:311:-      ...(image ? [{ name: "twitter:image", content: image }] : []),
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:331:+usePageSeo({
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:334:/bin/zsh -lc "sed -n '261,560p' docs/implementation-artifacts/code-reviews/10-5/full.diff" in /Users/simon/dev/jouan.ovh
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:337:-  link: [{ rel: "canonical", href: pageUrl }],
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:346:-    { name: "twitter:card", content: "summary" },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:347:-    { name: "twitter:title", content: pageTitle },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:348:-    { name: "twitter:description", content: pageDescription },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:394:+usePageSeo({
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:438:+usePageSeo({
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:471:+      "@type": "Offer",
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:480:+usePageSeo({
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:498:diff --git a/docs/implementation-artifacts/10-5-seo-centralise-site-wide.md b/docs/implementation-artifacts/10-5-seo-centralise-site-wide.md
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:500:--- a/docs/implementation-artifacts/10-5-seo-centralise-site-wide.md
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:501:+++ b/docs/implementation-artifacts/10-5-seo-centralise-site-wide.md
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:516:-  - [ ] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:517:-  - [ ] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:519:-  - [ ] **Home `app/pages/index.vue`** : ajouter `usePageSeo` (aujourd'hui **aucune** meta dédiée → hérite seulement de `app.head` de `nuxt.config.ts`). OG/Twitter/canonical + JSON-LD (`WebSite`/`Person` selon pertinence) + image OG.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:520:-  - [ ] **Services `app/pages/services.vue`** : passer de `title`+`description` seuls à OG/Twitter/canonical + JSON-LD (`Service`/`WebPage`).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:521:-  - [ ] **Contact `app/pages/contact.vue`** : idem (OG/Twitter/canonical + `ContactPage`).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:522:-  - [ ] **Migrer `/about` + `/blog` + article** vers le helper partagé **sans régresser** leur SEO existant (ils ont déjà OG/Twitter/canonical + JSON-LD via `SITE_URL`/`jsonLdScript`) — dédup, rendu identique.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:525:-  - [ ] Inspecter le HTML **prerendu** (`.output/public/index.html`, `services/index.html`, `contact/index.html`, + re-vérifier `about`/`blog`) : présence de `og:*`, `twitter:*`, `<link rel="canonical">`, `<script type="application/ld+json">` ; URLs absolues résolues depuis `runtimeConfig` (staging tant que non basculé).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:527:+  - [x] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:528:+  - [x] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:530:+  - [x] **Home `app/pages/index.vue`** : ajouter `usePageSeo` (aujourd'hui **aucune** meta dédiée → hérite seulement de `app.head` de `nuxt.config.ts`). OG/Twitter/canonical + JSON-LD (`WebSite`/`Person` selon pertinence) + image OG.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:531:+  - [x] **Services `app/pages/services.vue`** : passer de `title`+`description` seuls à OG/Twitter/canonical + JSON-LD (`Service`/`WebPage`).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:532:+  - [x] **Contact `app/pages/contact.vue`** : idem (OG/Twitter/canonical + `ContactPage`).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:533:+  - [x] **Migrer `/about` + `/blog` + article** vers le helper partagé **sans régresser** leur SEO existant (ils ont déjà OG/Twitter/canonical + JSON-LD via `SITE_URL`/`jsonLdScript`) — dédup, rendu identique.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:536:+  - [x] Inspecter le HTML **prerendu** (`.output/public/index.html`, `services/index.html`, `contact/index.html`, + re-vérifier `about`/`blog`) : présence de `og:*`, `twitter:*`, `<link rel="canonical">`, `<script type="application/ld+json">` ; URLs absolues résolues depuis `runtimeConfig` (staging tant que non basculé).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:548:+- HTML inspection : `.output/public/{index,services,contact,about,blog}/index.html` checked for `<title>`, `<meta name="description">`, `og:*`, `twitter:*`, `<link rel="canonical">`, and `<script type="application/ld+json">`.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:551:+- Création de `app/composables/usePageSeo.ts` qui centralise `useSeoMeta`, `<link rel="canonical">` et l'injection JSON-LD échappée via `jsonLdScript()`.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:552:+- Injection du schéma global `Organization` dans `app/app.vue` alimenté par `useSiteUrl()` et `SITE.profile`.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:558:+- `app/composables/usePageSeo.ts` (NEW)
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:567:+- `docs/implementation-artifacts/10-5-seo-centralise-site-wide.md` (MODIFIED)
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:570:+- 2026-09-13 : Implémentation complète de la Story 10.5 — Centralisation du SEO et Schema.org site-wide via `usePageSeo` et `useSiteUrl()`. Statut passé à `review`.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:580:+last_updated: "2026-09-13 (Story 10.5 prête pour revue : SEO centralisé site-wide via usePageSeo, statut review)"
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:588:-  10-5-seo-centralise-site-wide: ready-for-dev
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:589:+  10-5-seo-centralise-site-wide: review
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:653:      // URL de production du site (canonical / og:url / JSON-LD). Défaut = staging
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:781:// SEO par article (centralisé via usePageSeo, parité /about, /blog).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:782:// usePageSeo résout siteUrl, canonical, og:*, twitter:* et le JSON-LD échappé.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:784:usePageSeo(() => {
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1016:usePageSeo({
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1115:// URL publique du site (canonical / og:url / JSON-LD) — point d'accès unique.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1124:  // émettrait des canonical/og:url/JSON-LD RELATIFS silencieusement cassés (ex. une ligne
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1222:/bin/zsh -lc 'rg -n "function jsonLdScript|const jsonLdScript|jsonLdScript|useSiteUrl|siteUrl|usePageSeo|useSeoMeta|Organization|offers|price" app nuxt.config.* package.json' in /Users/simon/dev/jouan.ovh
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1230:app/pages/about.vue:152:usePageSeo({
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1231:app/pages/blog/[...slug].vue:111:// SEO par article (centralisé via usePageSeo, parité /about, /blog).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1232:app/pages/blog/[...slug].vue:112:// usePageSeo résout siteUrl, canonical, og:*, twitter:* et le JSON-LD échappé.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1234:app/pages/blog/[...slug].vue:114:usePageSeo(() => {
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1242:app/pages/blog/index.vue:126:usePageSeo({
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1247:app/pages/services.vue:90:const offers: Offer[] = [
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1255:app/pages/services.vue:151:usePageSeo({
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1259:app/pages/contact.vue:273:usePageSeo({
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1264:app/pages/index.vue:208:usePageSeo({
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1278:app/composables/usePageSeo.ts:2:import { useSiteUrl } from "./useSiteUrl";
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1279:app/composables/usePageSeo.ts:9:  /** Chemin relatif de la page (ex. "/" ou "/services" ou "/blog/slug"). Si omis, résolu sur siteUrl. */
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1280:app/composables/usePageSeo.ts:17:  /** Données JSON-LD (objet Schema.org ou tableau d'objets) injectées via jsonLdScript. */
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1281:app/composables/usePageSeo.ts:26: * Résout automatiquement les URLs absolues à partir de `useSiteUrl()` (runtimeConfig).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1282:app/composables/usePageSeo.ts:28:export function usePageSeo(options: MaybeRefOrGetter<PageSeoOptions | undefined | null>): void {
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1283:app/composables/usePageSeo.ts:29:  const siteUrl = useSiteUrl();
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1284:app/composables/usePageSeo.ts:39:    const canonicalUrl = cleanPath ? `${siteUrl}${cleanPath}` : siteUrl;
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1285:app/composables/usePageSeo.ts:46:          : `${siteUrl}${opts.image.startsWith("/") ? opts.image : `/${opts.image}`}`;
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1286:app/composables/usePageSeo.ts:76:          scripts.push(jsonLdScript(item));
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1287:app/composables/usePageSeo.ts:79:        scripts.push(jsonLdScript(seo.value.jsonLd));
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1288:app/composables/usePageSeo.ts:90:  useSeoMeta({
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1289:app/app.vue:10:// Métadonnées Schema.org globales (Organization / publisher du site).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1292:app/app.vue:16:  "@type": "Organization",
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1294:app/app.vue:19:  logo: `${siteUrl}/images/logo.png`,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1389:docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:47:  - [x] Vérif navigateur (Chrome DevTools MCP) : `/about` et `/blog` — `canonical`/`og:url` rendus, domaine résolu depuis `runtimeConfig` (inchangé en staging). Vue article non vérifiable en navigateur faute d'article réel (`content/blog/` vide), mais couverte par typecheck/prerender.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1393:docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:166:- **Vérif navigateur.** Chrome DevTools MCP a vérifié `/about` et `/blog` en navigateur (2026-09-12) : canonical/og résolus depuis `runtimeConfig`, inchangés en staging (`https://dev.jouan.ovh/about`, `https://dev.jouan.ovh/blog`) ; JSON-LD `/blog` présent avec `blogPost: []`. Aucun article réel n'existe aujourd'hui (`content/blog/` vide), donc la vue article ne peut pas être rendue au navigateur ; elle reste couverte par typecheck + prerender.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1445:docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:166:_Rejetés (bruit / faux positifs vérifiés)_ : « listes sans puces » et « images qui débordent » (FAUX — le reset global fournit `disc/decimal` + `img max-width:100%`) ; `h3` en défaut navigateur (FAUX — règle globale `_typography.scss` `h1-h6`) ; clé `useAsyncData` en fonction (typecheck + generate des 3 articles passent — Edge `[]`) ; ordre 404/500 (`.first()` renvoie `null`, pas de throw → 404 ; erreur réelle → 500) ; `clearError` client (transitions correctes) ; path traversal (requête content, pas FS ; `null`→404) ; canonical/trailing-slash (canonical = `article.path` propre, dédoublonne) ; contraste `code` inline vert (fidèle kit, token DS) ; héro `object-fit:cover` (recadre sans déformer) + `alt=""` (décoratif, schéma requis) ; `description`/`datePublished` non gardés (schéma garantit la chaîne) ; classes globales `hero__tags`/`post__meta` réutilisées (primitives voulues) ; `formatDate` sans garde (date regex-validée en 6.1) ; `NuxtLink` template vs `:as` ref (les deux corrects) ; `760px` répété (littéral structurel mandaté kit) ; refactor `index.vue`/`_layout.scss` (DRY in-scope, valeurs préservées — Auditor + Edge).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1446:docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:63:- **Shiki off / content** : ne pas toucher au pipeline `@nuxt/content`. **Prerender** : `useSeoMeta` est prerender-safe ; `generate` doit rester vert (11 routes).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1447:docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:75:- [Source: docs/project-context.md#Helpers partagés SEO/date (app/utils/seo.ts), #Nuxt (@nuxt/content, prerender)]
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1465:docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:122:- Modules vérifiés au `pnpm generate` : `@nuxt/image` produit les variantes `_ipx` (logo + portrait), `@nuxt/content` v3 émet `__nuxt_content/blog/sql_dump.txt`.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1482:docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:74:Treat every entry in `{workflow.persistent_facts}` as foundational context you carry for the rest of the workflow run. Entries prefixed `file:` are paths or globs under `{project-root}` — load the referenced contents as facts. All other entries are facts verbatim.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1483:docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:223:   - For **provided diff**: validate the content is non-empty and parseable as a unified diff. If it is not parseable, HALT and ask the user to provide a valid diff.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1484:docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:224:   - For **file list**: validate each path exists in the working tree. Construct `{diff_output}` by running `git diff HEAD -- <path1> <path2> ...`. If any paths are untracked (new files not yet staged), use `git diff --no-index /dev/null <path>` to include them. If the diff is empty (files have no uncommitted changes and are not untracked), ask the user whether to review the full file contents or to specify a different baseline.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1485:docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:338:- **Shiki off / content** : ne pas toucher au pipeline `@nuxt/content`. **Prerender** : `useSeoMeta` est prerender-safe ; `generate` doit rester vert (11 routes).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1486:docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:350:- [Source: docs/project-context.md#Helpers partagés SEO/date (app/utils/seo.ts), #Nuxt (@nuxt/content, prerender)]
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1487:docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:402:32-FR8: Blog = index (+ empty-state) et vue article prose + code via `@nuxt/content`. _(CAP-8)_
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1488:docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:430:60-- Blog via `@nuxt/content` markdown — dossier `content/` à créer.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1489:docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:486:128-Le visiteur lit les articles : index (+ empty-state soigné) et vue article prose + code via `@nuxt/content`.
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1490:docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:663:- **Contenu :** `@nuxt/content ^3.14.0` (**v3** — stockage SQLite via `better-sqlite3`, blog). Images : `@nuxt/image ^2.0.0` (`<NuxtImg>` / `<NuxtPicture>`).
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1491:docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:701:- Blog alimenté par `@nuxt/content` **v3** (markdown sous `content/blog/`) — index
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1492:docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:703:  dans `content.config.ts`** (schéma `blog` : `date` validée ISO via `z.string().regex`,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1493:docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:706:  (`content.build.markdown.highlight: false`) pour imposer la palette terminale du DS —
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1494:docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:890:- **`@nuxt/content` v3 + Docker — base SQLite du dev périmée** : lancer `pnpm generate`
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1495:docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:894:- **Styler le HTML généré par `@nuxt/content`** : le rendu (`<ContentRenderer>`) n'est pas
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1496:docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:908:    attrapé un bug d'ancres de titres `@nuxt/content` (6.2) et validé la refonte terminal
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1497:docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:929:Dernière mise à jour : 2026-06-29 (post-Epic 8 : refonte terminal **livrée** — `components/terminal/` intégralement en `<script setup>`, commandes `skills`/`projets`/`contact`/`clear` ajoutées, dernier résidu Options API = `WindowWrapperComponent`/`CurrentTime` côté header ; source de contenu partagé unique `app/data/site.ts` (DRY) ; checklist a11y forced-colors/clavier/contraste à embarquer en amont des consignes Epic 9 — dernier épic, puis fin de refonte SEO + RGPD + déploiement gh-pages ; post-Epic 7 : décision Epic 8 = refonte complète du terminal — migration `components/terminal/` vers `<script setup>` + restyle DS, vérif commande-par-commande ; Web3Forms acté côté SPEC pour le formulaire `/contact` ; post-Epic 6 : pipeline `@nuxt/content` v3 — collections typées `content.config.ts`, Shiki désactivé, gotchas Docker/SQLite + `:deep()` ancres de titres ; post-Epic 5 : primitives de layout globales `base/_layout.scss` + convention a11y titres/listes — eyebrow-as-`h2`, séquences en `<ol>`/`<ul>` ; post-Epic 4 : réfs visuelles par page précisées pour la routine de diff avant revue ; post-Epic 3 : pièges `padding` shorthand multi-classes + vérif visuelle Chrome DevTools avant revue pour les stories de page ; post-Epic 2 : stack réelle Nuxt 4 / TS 6 / ESLint 10 flat / @nuxt/content 3, primitives DS `ui/`, tokens CSS globaux, règles a11y)
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1500:docs/implementation-artifacts/code-reviews/10-5/full.diff:177:-    { name: "description", content: pageDescription },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1501:docs/implementation-artifacts/code-reviews/10-5/full.diff:179:-    { property: "og:type", content: "profile" },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1502:docs/implementation-artifacts/code-reviews/10-5/full.diff:180:-    { property: "og:title", content: pageTitle },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1503:docs/implementation-artifacts/code-reviews/10-5/full.diff:181:-    { property: "og:description", content: pageDescription },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1504:docs/implementation-artifacts/code-reviews/10-5/full.diff:182:-    { property: "og:url", content: pageUrl },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1505:docs/implementation-artifacts/code-reviews/10-5/full.diff:183:-    { property: "og:image", content: pageImage },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1506:docs/implementation-artifacts/code-reviews/10-5/full.diff:185:-    { name: "twitter:card", content: "summary" },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1507:docs/implementation-artifacts/code-reviews/10-5/full.diff:186:-    { name: "twitter:title", content: pageTitle },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1508:docs/implementation-artifacts/code-reviews/10-5/full.diff:187:-    { name: "twitter:description", content: pageDescription },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1509:docs/implementation-artifacts/code-reviews/10-5/full.diff:188:-    { name: "twitter:image", content: pageImage },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1510:docs/implementation-artifacts/code-reviews/10-5/full.diff:231:-      { name: "description", content: article.description },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1511:docs/implementation-artifacts/code-reviews/10-5/full.diff:232:-      { property: "og:type", content: "article" },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1512:docs/implementation-artifacts/code-reviews/10-5/full.diff:233:-      { property: "og:title", content: article.title },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1513:docs/implementation-artifacts/code-reviews/10-5/full.diff:234:-      { property: "og:description", content: article.description },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1514:docs/implementation-artifacts/code-reviews/10-5/full.diff:235:-      { property: "og:url", content: url },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1515:docs/implementation-artifacts/code-reviews/10-5/full.diff:236:-      ...(image ? [{ property: "og:image", content: image }] : []),
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1516:docs/implementation-artifacts/code-reviews/10-5/full.diff:237:-      { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1517:docs/implementation-artifacts/code-reviews/10-5/full.diff:238:-      { name: "twitter:title", content: article.title },
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1518:docs/implementation-artifacts/code-reviews/10-5/full.diff:239:-      { name: "twitter:description", content: article.description },

exec
/bin/zsh -lc "sed -n '1,260p' docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md | tail -120" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> Invoke the `bmad-review-adversarial-general` skill on this diff:\n>\n> {diff_output}\n"
      },
      {
        "id": "edge-case-hunter",
        "name": "Edge Case Hunter",
        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> Invoke the `bmad-review-edge-case-hunter` skill on this diff:\n>\n> {diff_output}\n"
      },
      {
        "id": "verification-gap",
        "name": "Verification Gap Reviewer",
        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> Invoke the `bmad-review-verification-gap` skill on this diff:\n>\n> {diff_output}\n"
      },
      {
        "id": "acceptance-auditor",
        "name": "Acceptance Auditor",
        "when": "Only when {review_mode} = \"full\".",
        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> You are an Acceptance Auditor. Review the provided diff against `{spec_file}` and any loaded context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code. Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.\n>\n> Diff:\n> {diff_output}\n"
      }
    ]
  }
}
---
diff_output: '' # set at runtime
spec_file: '' # set at runtime (path or empty)
review_mode: '' # set at runtime: "full" or "no-spec"
story_key: '' # set at runtime when discovered from sprint status
---

# Step 1: Gather Context

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- The prompt that triggered this workflow IS the intent — not a hint.
- Do not modify any files. This step is read-only.

## INSTRUCTIONS

1. **Find the review target.** The conversation context before this skill was triggered IS your starting point — not a blank slate. Check in this order — stop as soon as the review target is identified:

   **Tier 1 — Explicit argument.**
   Did the user pass a PR, commit SHA, branch, spec file, or diff source this message?
   - PR reference → resolve to branch/commit via `gh pr view`. If resolution fails, ask for a SHA or branch.
   - Commit or branch → use directly.
   - Spec file → set `{spec_file}` to the provided path. Check its frontmatter for `baseline_commit`. If found, use as diff baseline. If not found, continue the cascade (a spec alone does not identify a diff source).
   - Also scan the argument for diff-mode keywords that narrow the scope:
     - "staged" / "staged changes" → Staged changes only
     - "uncommitted" / "working tree" / "all changes" → Uncommitted changes (staged + unstaged)
     - "branch diff" / "vs main" / "against main" / "compared to <branch>" → Branch diff (extract base branch if mentioned)
     - "commit range" / "last N commits" / "<from-sha>..<to-sha>" → Specific commit range
     - "this diff" / "provided diff" / "paste" → User-provided diff (do not match bare "diff" — it appears in other modes)
   - When multiple keywords match, prefer the most specific (e.g., "branch diff" over bare "diff").

   **Tier 2 — Recent conversation.**
   Do the last few messages reveal what the user wants to be reviewed? Look for spec paths, commit refs, branches, PRs, or descriptions of a change. Apply the same diff-mode keyword scan and routing as Tier 1.

   **Tier 3 — Sprint tracking.**
   Look for a sprint status file (`*sprint-status*`) in `{implementation_artifacts}` or `{planning_artifacts}`. If found, scan for stories with status `review`:
   - **Exactly one `review` story:** Set `{story_key}` to the story's key (e.g., `1-2-user-auth`). Suggest it: "I found story <story-id> in `review` status. Would you like to review its changes? [Y] Yes / [N] No, let me choose". If confirmed, use the story context to determine the diff source (branch name derived from story slug, or uncommitted changes). If declined, clear `{story_key}` and fall through.
   - **Multiple `review` stories:** Present them as numbered options alongside a manual choice option. Wait for user selection. If a story is selected, set `{story_key}` and use its context to determine the diff source. If manual choice is selected, clear `{story_key}` and fall through.
   - **None:** Fall through.

   **Tier 4 — Current git state.**
   If version control is unavailable, skip to Tier 5. Otherwise, check the current branch and HEAD. If the branch is not `main` (or the default branch), confirm: "I see HEAD is `<short-sha>` on `<branch>` — do you want to review this branch's changes?" If confirmed, treat as a branch diff against `main`. If declined, fall through.

   **Tier 5 — Ask.**
   Fall through to instruction 2.

   Never ask extra questions beyond what the cascade prescribes. If a tier above already identified the target, skip the remaining tiers and proceed to instruction 3 (construct diff).

2. HALT. Ask the user: **What do you want to review?** Present these options:
   - **Uncommitted changes** (staged + unstaged)
   - **Staged changes only**
   - **Branch diff** vs a base branch (ask which base branch)
   - **Specific commit range** (ask for the range)
   - **Provided diff or file list** (user pastes or provides a path)

3. Construct `{diff_output}` from the chosen source.
   - For **staged changes only**: run `git diff --cached`.
   - For **uncommitted changes** (staged + unstaged): run `git diff HEAD`.
   - For **branch diff**: verify the base branch exists before running `git diff`. If it does not exist, HALT and ask the user for a valid branch.
   - For **commit range**: verify the range resolves. If it does not, HALT and ask the user for a valid range.
   - For **provided diff**: validate the content is non-empty and parseable as a unified diff. If it is not parseable, HALT and ask the user to provide a valid diff.
   - For **file list**: validate each path exists in the working tree. Construct `{diff_output}` by running `git diff HEAD -- <path1> <path2> ...`. If any paths are untracked (new files not yet staged), use `git diff --no-index /dev/null <path>` to include them. If the diff is empty (files have no uncommitted changes and are not untracked), ask the user whether to review the full file contents or to specify a different baseline.
   - After constructing `{diff_output}`, verify it is non-empty regardless of source type. If empty, HALT and tell the user there is nothing to review.

4. **Set the spec context.**
   - If `{spec_file}` is already set (from Tier 1 or Tier 2): verify the file exists and is readable, then set `{review_mode}` = `"full"`.
   - Otherwise, ask the user: **Is there a spec or story file that provides context for these changes?**
     - If yes: set `{spec_file}` to the path provided, verify the file exists and is readable, then set `{review_mode}` = `"full"`.
     - If no: set `{review_mode}` = `"no-spec"`.

5. If `{review_mode}` = `"full"` and the file at `{spec_file}` has a `context` field in its frontmatter listing additional docs, load each referenced document. Warn the user about any docs that cannot be found.

6. Sanity check: if `{diff_output}` exceeds approximately 3000 lines, warn the user and offer to chunk the review by file group.
   - If the user opts to chunk: agree on the first group, narrow `{diff_output}` accordingly, and list the remaining groups for the user to note for follow-up runs.
   - If the user declines: proceed as-is with the full diff.

### CHECKPOINT

Present a summary before proceeding: diff stats (files changed, lines added/removed), `{review_mode}`, and loaded spec/context docs (if any). HALT and wait for user confirmation to proceed.

## NEXT

Read fully and follow `./step-02-review.md`

codex
The target and spec are explicit, so I’m treating the supplied `full.diff` as the review source and running the full acceptance mode. I’m loading the exact story spec, Story 10.5 context, project rules, and the diff now; I’ll proceed without the workflow’s confirmation checkpoint per your instruction.
exec
/bin/zsh -lc "printf '%s\\n' '--- files ---'; wc -l docs/implementation-artifacts/10-5-seo-centralise-site-wide.md docs/planning-artifacts/epics.md docs/project-context.md docs/implementation-artifacts/code-reviews/10-5/full.diff; printf '%s\\n' '--- config ---'; sed -n '1,220p' _bmad/bmm/config.yaml; printf '%s\\n' '--- spec ---'; sed -n '1,260p' docs/implementation-artifacts/10-5-seo-centralise-site-wide.md; printf '%s\\n' '--- epics story matches ---'; rg -n -C 24 '10\\.5|SEO|seo|centralise|centralize' docs/planning-artifacts/epics.md; printf '%s\\n' '--- project context ---'; sed -n '1,300p' docs/project-context.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
--- files ---
     108 docs/implementation-artifacts/10-5-seo-centralise-site-wide.md
     658 docs/planning-artifacts/epics.md
     293 docs/project-context.md
     517 docs/implementation-artifacts/code-reviews/10-5/full.diff
    1576 total
--- config ---
# BMM Module Configuration
# Generated by BMAD installer

exec
/bin/zsh -lc "if [ -d .output/public ]; then find .output/public -maxdepth 3 -type f | sort | head -100; else echo no-output; fi; if [ -f content.config.ts ]; then sed -n '1,180p' content.config.ts; fi; find content -maxdepth 3 -type f -print 2>/dev/null | sort" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
.output/public/200.html
.output/public/404.html
.output/public/CNAME
.output/public/__nuxt_content/blog/sql_dump.txt
.output/public/_headers
.output/public/_nuxt/3JCRz6lv.js
.output/public/_nuxt/7aYiFbNO.js
.output/public/_nuxt/7tOpXIIM.js
.output/public/_nuxt/9UfCg06-.js
.output/public/_nuxt/A7iJyabv.js
.output/public/_nuxt/B3XAL9TF.js
.output/public/_nuxt/B6mXn3co.js
.output/public/_nuxt/BGEXL5Gu.js
.output/public/_nuxt/BIRIX3ZF.js
.output/public/_nuxt/BK6bKpmh.js
.output/public/_nuxt/BLPwvjTA.js
.output/public/_nuxt/BOBTTWF0.js
.output/public/_nuxt/BUEoJ5Bd.js
.output/public/_nuxt/BgNGmv6W.js
.output/public/_nuxt/BkGd__4j.js
.output/public/_nuxt/BoviyLWL.js
.output/public/_nuxt/BvwDQc2C.js
.output/public/_nuxt/CB70Z7Ya.js
.output/public/_nuxt/CEP5-_Us.js
.output/public/_nuxt/CEtDha0H.js
.output/public/_nuxt/CFgWZEEp.js
.output/public/_nuxt/CJV6Jzoc.js
.output/public/_nuxt/CXi3cvGG.js
.output/public/_nuxt/CZ1SZu0f.js
.output/public/_nuxt/CcKbyKfr.js
.output/public/_nuxt/CjgUC_QF.js
.output/public/_nuxt/CnnDdhXX.js
.output/public/_nuxt/Cwy5ZDuP.js
.output/public/_nuxt/Cxb3J1cf.js
.output/public/_nuxt/CxlQZYrj.js
.output/public/_nuxt/D-k7rLdV.js
.output/public/_nuxt/D2g1RPey.js
.output/public/_nuxt/D7f-lCIX.js
.output/public/_nuxt/DVmMlLn9.js
.output/public/_nuxt/Df_NIof0.js
.output/public/_nuxt/DlAUqK2U.js
.output/public/_nuxt/DvOHFShh.js
.output/public/_nuxt/DzWZJn4U.js
.output/public/_nuxt/LinkListComponent.BRYW5MSq.css
.output/public/_nuxt/MOnqPcsr.js
.output/public/_nuxt/ProsePre.D5orA6B_.css
.output/public/_nuxt/U6vo5jtL.js
.output/public/_nuxt/UbuntuMono-Bold.DxtomZAI.ttf
.output/public/_nuxt/UbuntuMono-BoldItalic.TXXgaKQw.ttf
.output/public/_nuxt/UbuntuMono-Italic.B29yKq6H.ttf
.output/public/_nuxt/UbuntuMono-Regular.C0QEQ_U4.ttf
.output/public/_nuxt/WjsIUcnj.js
.output/public/_nuxt/ZBadge.BAw1B01J.css
.output/public/_nuxt/ZButton.CyAD_ftR.css
.output/public/_nuxt/ZCard.C5C9a-aj.css
.output/public/_nuxt/ZTag.f2Aq6DLg.css
.output/public/_nuxt/ZgUbhe05.js
.output/public/_nuxt/_...CPiAFn3m.css
.output/public/_nuxt/about.ox_hIrdj.css
.output/public/_nuxt/builds/latest.json
.output/public/_nuxt/contact.Co71VCIU.css
.output/public/_nuxt/default.e0doGEOD.css
.output/public/_nuxt/entry.QaoIl47T.css
.output/public/_nuxt/error-404.BvOk15Jd.css
.output/public/_nuxt/error-500.CIKAhgAS.css
.output/public/_nuxt/index.DWliMmIh.css
.output/public/_nuxt/index.DYn9lnq-.css
.output/public/_nuxt/jgeOKlzh.js
.output/public/_nuxt/lubjcR-3.js
.output/public/_nuxt/n0XdkQXy.js
.output/public/_nuxt/services.C9Fgnb_o.css
.output/public/_nuxt/sqlite3-DBpDb1lf.wasm
.output/public/_nuxt/sqlite3-opfs-async-proxy-C_otN2ZJ.js
.output/public/_nuxt/sqlite3-worker1-bundler-friendly-Bv6ABw9v.js
.output/public/_nuxt/sqlite3.DBpDb1lf.wasm
.output/public/_nuxt/u8mfYzvJ.js
.output/public/_nuxt/wf6Hx6Mx.js
.output/public/_nuxt/zIph1mJz.js
.output/public/_nuxt/ztlGNUSh.js
.output/public/about/index.html
.output/public/blog/index.html
.output/public/contact/index.html
.output/public/favicon.ico
.output/public/images/favicon.ico
.output/public/images/logo - 128x128.png
.output/public/images/logo - 256x256.png
.output/public/images/logo - 512x512.png
.output/public/images/logo.png
.output/public/images/logo.xcf
.output/public/images/logo_black_1024x1024.png
.output/public/images/logo_black_256x256.png
.output/public/images/logo_black_512x512.png
.output/public/images/logo_white.png
.output/public/images/logo_white_256x256.png
.output/public/images/logo_white_32x32.png
.output/public/images/logo_white_512x512.png
.output/public/images/portrait-256x256.jpeg
.output/public/images/portrait-256x256.webp
.output/public/images/portrait-512x512.jpeg
.output/public/images/portrait-512x512.webp
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
content/blog/.gitkeep

exec
/bin/zsh -lc "sed -n '1,180p' docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md 2>/dev/null" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
Reading prompt from stdin...
2026-09-13T08:36:11.190731Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: high
reasoning summaries: none
session id: 01a099e8-e23d-7ad0-a312-d608ca486551
--------
user
# Blind Hunter Prompt — Story 10.5

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/10-5/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
I’m using `bmad-review-adversarial-general` to perform the requested skeptical review of the specified diff and report only actionable finding descriptions.
exec
/bin/zsh -lc 'cat /Users/simon/dev/jouan.ovh/.agents/skills/bmad-review-adversarial-general/SKILL.md' in /Users/simon/dev/jouan.ovh
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
/bin/zsh -lc "wc -l docs/implementation-artifacts/code-reviews/10-5/full.diff && sed -n '1,260p' docs/implementation-artifacts/code-reviews/10-5/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     517 docs/implementation-artifacts/code-reviews/10-5/full.diff
diff --git a/app/app.vue b/app/app.vue
index 84b23a4..6016dd4 100644
--- a/app/app.vue
+++ b/app/app.vue
@@ -4,4 +4,29 @@
   </NuxtLayout>
 </template>
 
+<script setup lang="ts">
+import { SITE } from "~/data/site";
+
+// Métadonnées Schema.org globales (Organization / publisher du site).
+// Résolues depuis runtimeConfig (useSiteUrl) et les données partagées (SITE).
+const siteUrl = useSiteUrl();
+
+const organizationJsonLd = {
+  "@context": "https://schema.org",
+  "@type": "Organization",
+  name: SITE.profile.name,
+  url: siteUrl,
+  logo: `${siteUrl}/images/logo.png`,
+  email: SITE.profile.email,
+  address: {
+    "@type": "PostalAddress",
+    addressLocality: SITE.profile.city,
+  },
+};
+
+useHead({
+  script: [jsonLdScript(organizationJsonLd)],
+});
+</script>
+
 <style lang="scss" scoped></style>
diff --git a/app/composables/usePageSeo.ts b/app/composables/usePageSeo.ts
new file mode 100644
index 0000000..6a238eb
--- /dev/null
+++ b/app/composables/usePageSeo.ts
@@ -0,0 +1,103 @@
+import { computed, toValue, type MaybeRefOrGetter } from "vue";
+import { useSiteUrl } from "./useSiteUrl";
+
+export interface PageSeoOptions {
+  /** Titre de la page (utilisé pour <title>, og:title, twitter:title). */
+  title: string;
+  /** Description de la page (utilisée pour <meta name="description">, og:description, twitter:description). */
+  description: string;
+  /** Chemin relatif de la page (ex. "/" ou "/services" ou "/blog/slug"). Si omis, résolu sur siteUrl. */
+  path?: string;
+  /** Chemin relatif ou absolu de l'image OG/Twitter (ex. "/images/portrait.jpeg"). Résolue en URL absolue. */
+  image?: string;
+  /** Type Open Graph : "website" (défaut), "article" ou "profile". */
+  type?: "website" | "article" | "profile";
+  /** Format Twitter Card : si omis, "summary_large_image" si type article avec image, sinon "summary". */
+  twitterCard?: "summary" | "summary_large_image";
+  /** Données JSON-LD (objet Schema.org ou tableau d'objets) injectées via jsonLdScript. */
+  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
+}
+
+/**
+ * Composable centralisant la déclaration des métadonnées SEO par page :
+ * <title>, canonical, description, Open Graph (type, title, desc, url, image)
+ * et Twitter Card (card, title, desc, image) + JSON-LD échappé.
+ *
+ * Résout automatiquement les URLs absolues à partir de `useSiteUrl()` (runtimeConfig).
+ */
+export function usePageSeo(options: MaybeRefOrGetter<PageSeoOptions | undefined | null>): void {
+  const siteUrl = useSiteUrl();
+
+  const seo = computed(() => {
+    const opts = toValue(options);
+    if (!opts) {
+      return null;
+    }
+
+    const rawPath = opts.path ?? "";
+    const cleanPath = rawPath === "" || rawPath === "/" ? "" : rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
+    const canonicalUrl = cleanPath ? `${siteUrl}${cleanPath}` : siteUrl;
+
+    let imageUrl: string | undefined;
+    if (opts.image) {
+      imageUrl =
+        opts.image.startsWith("http://") || opts.image.startsWith("https://")
+          ? opts.image
+          : `${siteUrl}${opts.image.startsWith("/") ? opts.image : `/${opts.image}`}`;
+    }
+
+    const type = opts.type ?? "website";
+    const twitterCard =
+      opts.twitterCard ??
+      (imageUrl && (type === "article" || opts.twitterCard === "summary_large_image")
+        ? "summary_large_image"
+        : "summary");
+
+    return {
+      title: opts.title,
+      description: opts.description,
+      canonicalUrl,
+      imageUrl,
+      type,
+      twitterCard,
+      jsonLd: opts.jsonLd,
+    };
+  });
+
+  useHead(() => {
+    if (!seo.value) {
+      return {};

exec
/bin/zsh -lc "rg -n \"article\\.image\\.src|article\\.path|mainEntity|itemListElement|@type.*Offer|publisher|twitterCard|siteUrl\" docs/implementation-artifacts/code-reviews/10-5/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
12:+// Métadonnées Schema.org globales (Organization / publisher du site).
14:+const siteUrl = useSiteUrl();
20:+  url: siteUrl,
21:+  logo: `${siteUrl}/images/logo.png`,
49:+  /** Chemin relatif de la page (ex. "/" ou "/services" ou "/blog/slug"). Si omis, résolu sur siteUrl. */
56:+  twitterCard?: "summary" | "summary_large_image";
69:+  const siteUrl = useSiteUrl();
79:+    const canonicalUrl = cleanPath ? `${siteUrl}${cleanPath}` : siteUrl;
86:+          : `${siteUrl}${opts.image.startsWith("/") ? opts.image : `/${opts.image}`}`;
90:+    const twitterCard =
91:+      opts.twitterCard ??
92:+      (imageUrl && (type === "article" || opts.twitterCard === "summary_large_image")
102:+      twitterCard,
138:+    twitterCard: () => seo.value?.twitterCard,
155: const siteUrl = useSiteUrl();
156:-const pageUrl = `${siteUrl}/about`;
157:-const pageImage = `${siteUrl}/images/portrait.jpeg`;
162:+  url: `${siteUrl}/about`,
163:+  mainEntity: {
167:+    url: siteUrl,
168:+    image: `${siteUrl}/images/portrait.jpeg`,
194:+  twitterCard: "summary",
211:+// usePageSeo résout siteUrl, canonical, og:*, twitter:* et le JSON-LD échappé.
212: const siteUrl = useSiteUrl();
220:   const url = `${siteUrl}${article.path}`;
221:   const image = article.image ? `${siteUrl}${article.image.src}` : undefined;
244:+    path: article.path,
298:+const siteUrl = useSiteUrl();
306:+  url: `${siteUrl}/contact`,
307:+  mainEntity: {
339:+const siteUrl = useSiteUrl();
345:+    url: siteUrl,
353:+    url: siteUrl,
354:+    image: `${siteUrl}/images/portrait.jpeg`,
384:+const siteUrl = useSiteUrl();
392:+  url: `${siteUrl}/services`,
393:+  mainEntity: {
395:+    itemListElement: offers.map((offer, index) => ({
396:+      "@type": "Offer",
441:-  - [ ] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
442:-  - [ ] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).
452:+  - [x] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
453:+  - [x] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).

exec
/bin/zsh -lc 'for f in .output/public/index.html .output/public/services/index.html .output/public/contact/index.html .output/public/about/index.html .output/public/blog/index.html; do echo "--- $f"; rg -o '"'<title>["'^<]*|<meta[''^>]+(description|og:|twitter:)[''^>]*|<link[''^>]+canonical[''^>]*|<script type="application/ld'"\\+json\">["'^<]*'"' \""'$f" | head -80; done' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
--- .output/public/index.html
<title>Simon Jouan — Développeur web freelance &amp; IA
<meta name="description" content="Développeur web freelance à Valognes (Normandie) : création de sites WordPress sur-mesure, applications web (PHP/Symfony, Nest.js, Nuxt) et intégrations d'IA."
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
<link rel="canonical" href="https://dev.jouan.ovh"
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"Simon Jouan — Développeur web freelance","url":"https://dev.jouan.ovh","description":"Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils."}
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Simon Jouan","jobTitle":"Développeur web freelance","url":"https://dev.jouan.ovh","image":"https://dev.jouan.ovh/images/portrait.jpeg","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
<meta property="og:title" content="Simon Jouan — Développeur web freelance & IA"
<meta property="og:description" content="Développeur web freelance à Valognes (Normandie) : création de sites WordPress sur-mesure, applications web (PHP/Symfony, Nest.js, Nuxt) et intégrations d'IA."
<meta property="og:url" content="https://dev.jouan.ovh"
<meta property="og:type" content="website"
<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
<meta name="twitter:card" content="summary"
<meta name="twitter:title" content="Simon Jouan — Développeur web freelance & IA"
<meta name="twitter:description" content="Développeur web freelance à Valognes (Normandie) : création de sites WordPress sur-mesure, applications web (PHP/Symfony, Nest.js, Nuxt) et intégrations d'IA."
<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
--- .output/public/services/index.html
<title>Services — jouan.ovh
<meta name="description" content="Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation."
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
<link rel="canonical" href="https://dev.jouan.ovh/services"
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"Services — jouan.ovh","description":"Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.","url":"https://dev.jouan.ovh/services","mainEntity":{"@type":"ItemList","itemListElement":[{"@type":"Offer","position":1,"name":"WordPress sur-mesure","description":"Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.","price":"à partir de 1 500 €"},{"@type":"Offer","position":2,"name":"Applications web","description":"Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.","price":"sur devis"},{"@type":"Offer","position":3,"name":"IA & automatisation","description":"L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.","price":"sur devis"}]}}
<meta property="og:title" content="Services — jouan.ovh"
<meta property="og:description" content="Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation."
<meta property="og:url" content="https://dev.jouan.ovh/services"
<meta property="og:type" content="website"
<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
<meta name="twitter:card" content="summary"
<meta name="twitter:title" content="Services — jouan.ovh"
<meta name="twitter:description" content="Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation."
<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
--- .output/public/contact/index.html
<title>Contact — jouan.ovh
<meta name="description" content="Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h."
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
<link rel="canonical" href="https://dev.jouan.ovh/contact"
<script type="application/ld+json">{"@context":"https://schema.org","@type":"ContactPage","name":"Contact — jouan.ovh","description":"Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h.","url":"https://dev.jouan.ovh/contact","mainEntity":{"@type":"Person","name":"Simon Jouan","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}}
<meta property="og:title" content="Contact — jouan.ovh"
<meta property="og:description" content="Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h."
<meta property="og:url" content="https://dev.jouan.ovh/contact"
<meta property="og:type" content="website"
<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
<meta name="twitter:card" content="summary"
<meta name="twitter:title" content="Contact — jouan.ovh"
<meta name="twitter:description" content="Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h."
<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
--- .output/public/about/index.html
<title>À propos — jouan.ovh
<meta name="description" content="Développeur web freelance à Valognes, je conçois des applications en PHP/Symfony, des sites WordPress sur-mesure et des produits Node.js / Nest.js / Nuxt.js — voici mon parcours."
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
<link rel="canonical" href="https://dev.jouan.ovh/about"
<script type="application/ld+json">{"@context":"https://schema.org","@type":"ProfilePage","name":"À propos — jouan.ovh","url":"https://dev.jouan.ovh/about","mainEntity":{"@type":"Person","name":"Simon Jouan","jobTitle":"Développeur web freelance","url":"https://dev.jouan.ovh","image":"https://dev.jouan.ovh/images/portrait.jpeg"}}
<meta property="og:title" content="À propos — jouan.ovh"
<meta property="og:description" content="Développeur web freelance à Valognes, je conçois des applications en PHP/Symfony, des sites WordPress sur-mesure et des produits Node.js / Nest.js / Nuxt.js — voici mon parcours."
<meta property="og:url" content="https://dev.jouan.ovh/about"
<meta property="og:type" content="profile"
<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
<meta name="twitter:card" content="summary"
<meta name="twitter:title" content="À propos — jouan.ovh"
<meta name="twitter:description" content="Développeur web freelance à Valognes, je conçois des applications en PHP/Symfony, des sites WordPress sur-mesure et des produits Node.js / Nest.js / Nuxt.js — voici mon parcours."
<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
--- .output/public/blog/index.html
<title>Blog — jouan.ovh
<meta name="description" content="Notes de dev — WordPress, architecture et IA appliquée : ce que j'apprends en construisant des produits web."
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
<link rel="canonical" href="https://dev.jouan.ovh/blog"
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Blog","name":"Notes de dev","description":"Notes de dev — WordPress, architecture et IA appliquée : ce que j'apprends en construisant des produits web.","url":"https://dev.jouan.ovh/blog","blogPost":[]}
<meta property="og:title" content="Blog — jouan.ovh"
<meta property="og:description" content="Notes de dev — WordPress, architecture et IA appliquée : ce que j'apprends en construisant des produits web."
<meta property="og:url" content="https://dev.jouan.ovh/blog"
<meta property="og:type" content="website"
<meta name="twitter:card" content="summary"
<meta name="twitter:title" content="Blog — jouan.ovh"
<meta name="twitter:description" content="Notes de dev — WordPress, architecture et IA appliquée : ce que j'apprends en construisant des produits web."

exec
/bin/zsh -lc 'tail -180 docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md 2>/dev/null' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
+  twitterCard?: "summary" | "summary_large_image";
+  /** Données JSON-LD (objet Schema.org ou tableau d'objets) injectées via jsonLdScript. */
+  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
+}
+
+/**
+ * Composable centralisant la déclaration des métadonnées SEO par page :
+ * <title>, canonical, description, Open Graph (type, title, desc, url, image)
+ * et Twitter Card (card, title, desc, image) + JSON-LD échappé.
+ *
+ * Résout automatiquement les URLs absolues à partir de `useSiteUrl()` (runtimeConfig).
+ */
+export function usePageSeo(options: MaybeRefOrGetter<PageSeoOptions | undefined | null>): void {
+  const siteUrl = useSiteUrl();
+
+  const seo = computed(() => {
+    const opts = toValue(options);
+    if (!opts) {
+      return null;
+    }
+
+    const rawPath = opts.path ?? "";
+    const cleanPath = rawPath === "" || rawPath === "/" ? "" : rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
+    const canonicalUrl = cleanPath ? `${siteUrl}${cleanPath}` : siteUrl;
+
+    let imageUrl: string | undefined;
+    if (opts.image) {
+      imageUrl =
+        opts.image.startsWith("http://") || opts.image.startsWith("https://")
+          ? opts.image
+          : `${siteUrl}${opts.image.startsWith("/") ? opts.image : `/${opts.image}`}`;
+    }
+
+    const type = opts.type ?? "website";
+    const twitterCard =
+      opts.twitterCard ??
+      (imageUrl && (type === "article" || opts.twitterCard === "summary_large_image")
+        ? "summary_large_image"
+        : "summary");
+
+    return {
+      title: opts.title,
+      description: opts.description,
+      canonicalUrl,
+      imageUrl,
+      type,
+      twitterCard,
+      jsonLd: opts.jsonLd,
+    };
+  });
+
+  useHead(() => {
+    if (!seo.value) {
+      return {};

exec
/bin/zsh -lc "rg -n \"article\\.image\\.src|article\\.path|mainEntity|itemListElement|@type.*Offer|publisher|twitterCard|siteUrl\" docs/implementation-artifacts/code-reviews/10-5/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
12:+// Métadonnées Schema.org globales (Organization / publisher du site).
14:+const siteUrl = useSiteUrl();
20:+  url: siteUrl,
21:+  logo: `${siteUrl}/images/logo.png`,
49:+  /** Chemin relatif de la page (ex. "/" ou "/services" ou "/blog/slug"). Si omis, résolu sur siteUrl. */
56:+  twitterCard?: "summary" | "summary_large_image";
69:+  const siteUrl = useSiteUrl();
79:+    const canonicalUrl = cleanPath ? `${siteUrl}${cleanPath}` : siteUrl;
86:+          : `${siteUrl}${opts.image.startsWith("/") ? opts.image : `/${opts.image}`}`;
90:+    const twitterCard =
91:+      opts.twitterCard ??
92:+      (imageUrl && (type === "article" || opts.twitterCard === "summary_large_image")
102:+      twitterCard,
138:+    twitterCard: () => seo.value?.twitterCard,
155: const siteUrl = useSiteUrl();
156:-const pageUrl = `${siteUrl}/about`;
157:-const pageImage = `${siteUrl}/images/portrait.jpeg`;
162:+  url: `${siteUrl}/about`,
163:+  mainEntity: {
167:+    url: siteUrl,
168:+    image: `${siteUrl}/images/portrait.jpeg`,
194:+  twitterCard: "summary",
211:+// usePageSeo résout siteUrl, canonical, og:*, twitter:* et le JSON-LD échappé.
212: const siteUrl = useSiteUrl();
220:   const url = `${siteUrl}${article.path}`;
221:   const image = article.image ? `${siteUrl}${article.image.src}` : undefined;
244:+    path: article.path,
298:+const siteUrl = useSiteUrl();
306:+  url: `${siteUrl}/contact`,
307:+  mainEntity: {
339:+const siteUrl = useSiteUrl();
345:+    url: siteUrl,
353:+    url: siteUrl,
354:+    image: `${siteUrl}/images/portrait.jpeg`,
384:+const siteUrl = useSiteUrl();
392:+  url: `${siteUrl}/services`,
393:+  mainEntity: {
395:+    itemListElement: offers.map((offer, index) => ({
396:+      "@type": "Offer",
441:-  - [ ] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
442:-  - [ ] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).
452:+  - [x] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
453:+  - [x] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).

exec
/bin/zsh -lc 'for f in .output/public/index.html .output/public/services/index.html .output/public/contact/index.html .output/public/about/index.html .output/public/blog/index.html; do echo "--- $f"; rg -o '"'<title>["'^<]*|<meta[''^>]+(description|og:|twitter:)[''^>]*|<link[''^>]+canonical[''^>]*|<script type="application/ld'"\\+json\">["'^<]*'"' \""'$f" | head -80; done' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
--- .output/public/index.html
<title>Simon Jouan — Développeur web freelance &amp; IA
<meta name="description" content="Développeur web freelance à Valognes (Normandie) : création de sites WordPress sur-mesure, applications web (PHP/Symfony, Nest.js, Nuxt) et intégrations d'IA."
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
<link rel="canonical" href="https://dev.jouan.ovh"
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"Simon Jouan — Développeur web freelance","url":"https://dev.jouan.ovh","description":"Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils."}
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Simon Jouan","jobTitle":"Développeur web freelance","url":"https://dev.jouan.ovh","image":"https://dev.jouan.ovh/images/portrait.jpeg","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
<meta property="og:title" content="Simon Jouan — Développeur web freelance & IA"
<meta property="og:description" content="Développeur web freelance à Valognes (Normandie) : création de sites WordPress sur-mesure, applications web (PHP/Symfony, Nest.js, Nuxt) et intégrations d'IA."
<meta property="og:url" content="https://dev.jouan.ovh"
<meta property="og:type" content="website"
<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
<meta name="twitter:card" content="summary"
<meta name="twitter:title" content="Simon Jouan — Développeur web freelance & IA"
<meta name="twitter:description" content="Développeur web freelance à Valognes (Normandie) : création de sites WordPress sur-mesure, applications web (PHP/Symfony, Nest.js, Nuxt) et intégrations d'IA."
<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
--- .output/public/services/index.html
<title>Services — jouan.ovh
<meta name="description" content="Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation."
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
<link rel="canonical" href="https://dev.jouan.ovh/services"
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"Services — jouan.ovh","description":"Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.","url":"https://dev.jouan.ovh/services","mainEntity":{"@type":"ItemList","itemListElement":[{"@type":"Offer","position":1,"name":"WordPress sur-mesure","description":"Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.","price":"à partir de 1 500 €"},{"@type":"Offer","position":2,"name":"Applications web","description":"Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.","price":"sur devis"},{"@type":"Offer","position":3,"name":"IA & automatisation","description":"L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.","price":"sur devis"}]}}
<meta property="og:title" content="Services — jouan.ovh"
<meta property="og:description" content="Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation."
<meta property="og:url" content="https://dev.jouan.ovh/services"
<meta property="og:type" content="website"
<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
<meta name="twitter:card" content="summary"
<meta name="twitter:title" content="Services — jouan.ovh"
<meta name="twitter:description" content="Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation."
<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
--- .output/public/contact/index.html
<title>Contact — jouan.ovh
<meta name="description" content="Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h."
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
<link rel="canonical" href="https://dev.jouan.ovh/contact"
<script type="application/ld+json">{"@context":"https://schema.org","@type":"ContactPage","name":"Contact — jouan.ovh","description":"Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h.","url":"https://dev.jouan.ovh/contact","mainEntity":{"@type":"Person","name":"Simon Jouan","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}}
<meta property="og:title" content="Contact — jouan.ovh"
<meta property="og:description" content="Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h."
<meta property="og:url" content="https://dev.jouan.ovh/contact"
<meta property="og:type" content="website"
<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
<meta name="twitter:card" content="summary"
<meta name="twitter:title" content="Contact — jouan.ovh"
<meta name="twitter:description" content="Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h."
<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
--- .output/public/about/index.html
<title>À propos — jouan.ovh
<meta name="description" content="Développeur web freelance à Valognes, je conçois des applications en PHP/Symfony, des sites WordPress sur-mesure et des produits Node.js / Nest.js / Nuxt.js — voici mon parcours."
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
<link rel="canonical" href="https://dev.jouan.ovh/about"
<script type="application/ld+json">{"@context":"https://schema.org","@type":"ProfilePage","name":"À propos — jouan.ovh","url":"https://dev.jouan.ovh/about","mainEntity":{"@type":"Person","name":"Simon Jouan","jobTitle":"Développeur web freelance","url":"https://dev.jouan.ovh","image":"https://dev.jouan.ovh/images/portrait.jpeg"}}
<meta property="og:title" content="À propos — jouan.ovh"
<meta property="og:description" content="Développeur web freelance à Valognes, je conçois des applications en PHP/Symfony, des sites WordPress sur-mesure et des produits Node.js / Nest.js / Nuxt.js — voici mon parcours."
<meta property="og:url" content="https://dev.jouan.ovh/about"
<meta property="og:type" content="profile"
<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
<meta name="twitter:card" content="summary"
<meta name="twitter:title" content="À propos — jouan.ovh"
<meta name="twitter:description" content="Développeur web freelance à Valognes, je conçois des applications en PHP/Symfony, des sites WordPress sur-mesure et des produits Node.js / Nest.js / Nuxt.js — voici mon parcours."
<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
--- .output/public/blog/index.html
<title>Blog — jouan.ovh
<meta name="description" content="Notes de dev — WordPress, architecture et IA appliquée : ce que j'apprends en construisant des produits web."
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
<link rel="canonical" href="https://dev.jouan.ovh/blog"
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Blog","name":"Notes de dev","description":"Notes de dev — WordPress, architecture et IA appliquée : ce que j'apprends en construisant des produits web.","url":"https://dev.jouan.ovh/blog","blogPost":[]}
<meta property="og:title" content="Blog — jouan.ovh"
<meta property="og:description" content="Notes de dev — WordPress, architecture et IA appliquée : ce que j'apprends en construisant des produits web."
<meta property="og:url" content="https://dev.jouan.ovh/blog"
<meta property="og:type" content="website"
<meta name="twitter:card" content="summary"
<meta name="twitter:title" content="Blog — jouan.ovh"
<meta name="twitter:description" content="Notes de dev — WordPress, architecture et IA appliquée : ce que j'apprends en construisant des produits web."


exec
/bin/zsh -lc 'wc -l docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md 2>/dev/null; rg -n "''^- |''^'"\\* |Findings|findings|issue|probl|publisher|Offer|title|trailing|image\" docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md 2>/dev/null | tail -120" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
    2733 docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md
2370:+  twitterCard?: "summary" | "summary_large_image";
2377:+ * <title>, canonical, description, Open Graph (type, title, desc, url, image)
2378:+ * et Twitter Card (card, title, desc, image) + JSON-LD échappé.
2395:+    let imageUrl: string | undefined;
2396:+    if (opts.image) {
2397:+      imageUrl =
2398:+        opts.image.startsWith("http://") || opts.image.startsWith("https://")
2399:+          ? opts.image
2400:+          : `${siteUrl}${opts.image.startsWith("/") ? opts.image : `/${opts.image}`}`;
2406:+      (imageUrl && (type === "article" || opts.twitterCard === "summary_large_image")
2407:+        ? "summary_large_image"
2411:+      title: opts.title,
2414:+      imageUrl,
2426:/bin/zsh -lc "rg -n \"article\\.image\\.src|article\\.path|mainEntity|itemListElement|@type.*Offer|publisher|twitterCard|siteUrl\" docs/implementation-artifacts/code-reviews/10-5/full.diff" in /Users/simon/dev/jouan.ovh
2428:12:+// Métadonnées Schema.org globales (Organization / publisher du site).
2431:21:+  logo: `${siteUrl}/images/logo.png`,
2433:56:+  twitterCard?: "summary" | "summary_large_image";
2436:86:+          : `${siteUrl}${opts.image.startsWith("/") ? opts.image : `/${opts.image}`}`;
2439:92:+      (imageUrl && (type === "article" || opts.twitterCard === "summary_large_image")
2444:157:-const pageImage = `${siteUrl}/images/portrait.jpeg`;
2448:168:+    image: `${siteUrl}/images/portrait.jpeg`,
2453:221:   const image = article.image ? `${siteUrl}${article.image.src}` : undefined;
2461:354:+    image: `${siteUrl}/images/portrait.jpeg`,
2466:396:+      "@type": "Offer",
2467:441:-  - [ ] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
2468:442:-  - [ ] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).
2469:452:+  - [x] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
2470:453:+  - [x] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).
2473:/bin/zsh -lc 'for f in .output/public/index.html .output/public/services/index.html .output/public/contact/index.html .output/public/about/index.html .output/public/blog/index.html; do echo "--- $f"; rg -o '"'<title>["'^<]*|<meta[''^>]+(description|og:|twitter:)[''^>]*|<link[''^>]+canonical[''^>]*|<script type="application/ld'"\\+json\">["'^<]*'"' \""'$f" | head -80; done' in /Users/simon/dev/jouan.ovh
2476:<title>Simon Jouan — Développeur web freelance &amp; IA
2478:<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
2481:<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Simon Jouan","jobTitle":"Développeur web freelance","url":"https://dev.jouan.ovh","image":"https://dev.jouan.ovh/images/portrait.jpeg","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
2482:<meta property="og:title" content="Simon Jouan — Développeur web freelance & IA"
2486:<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
2488:<meta name="twitter:title" content="Simon Jouan — Développeur web freelance & IA"
2490:<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
2492:<title>Services — jouan.ovh
2494:<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
2496:<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"Services — jouan.ovh","description":"Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.","url":"https://dev.jouan.ovh/services","mainEntity":{"@type":"ItemList","itemListElement":[{"@type":"Offer","position":1,"name":"WordPress sur-mesure","description":"Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.","price":"à partir de 1 500 €"},{"@type":"Offer","position":2,"name":"Applications web","description":"Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.","price":"sur devis"},{"@type":"Offer","position":3,"name":"IA & automatisation","description":"L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.","price":"sur devis"}]}}
2497:<meta property="og:title" content="Services — jouan.ovh"
2501:<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
2503:<meta name="twitter:title" content="Services — jouan.ovh"
2505:<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
2507:<title>Contact — jouan.ovh
2509:<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
2512:<meta property="og:title" content="Contact — jouan.ovh"
2516:<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
2518:<meta name="twitter:title" content="Contact — jouan.ovh"
2520:<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
2522:<title>À propos — jouan.ovh
2524:<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
2526:<script type="application/ld+json">{"@context":"https://schema.org","@type":"ProfilePage","name":"À propos — jouan.ovh","url":"https://dev.jouan.ovh/about","mainEntity":{"@type":"Person","name":"Simon Jouan","jobTitle":"Développeur web freelance","url":"https://dev.jouan.ovh","image":"https://dev.jouan.ovh/images/portrait.jpeg"}}
2527:<meta property="og:title" content="À propos — jouan.ovh"
2531:<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
2533:<meta name="twitter:title" content="À propos — jouan.ovh"
2535:<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
2537:<title>Blog — jouan.ovh
2539:<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
2542:<meta property="og:title" content="Blog — jouan.ovh"
2547:<meta name="twitter:title" content="Blog — jouan.ovh"
2553:+  twitterCard?: "summary" | "summary_large_image";
2560:+ * <title>, canonical, description, Open Graph (type, title, desc, url, image)
2561:+ * et Twitter Card (card, title, desc, image) + JSON-LD échappé.
2578:+    let imageUrl: string | undefined;
2579:+    if (opts.image) {
2580:+      imageUrl =
2581:+        opts.image.startsWith("http://") || opts.image.startsWith("https://")
2582:+          ? opts.image
2583:+          : `${siteUrl}${opts.image.startsWith("/") ? opts.image : `/${opts.image}`}`;
2589:+      (imageUrl && (type === "article" || opts.twitterCard === "summary_large_image")
2590:+        ? "summary_large_image"
2594:+      title: opts.title,
2597:+      imageUrl,
2609:/bin/zsh -lc "rg -n \"article\\.image\\.src|article\\.path|mainEntity|itemListElement|@type.*Offer|publisher|twitterCard|siteUrl\" docs/implementation-artifacts/code-reviews/10-5/full.diff" in /Users/simon/dev/jouan.ovh
2611:12:+// Métadonnées Schema.org globales (Organization / publisher du site).
2614:21:+  logo: `${siteUrl}/images/logo.png`,
2616:56:+  twitterCard?: "summary" | "summary_large_image";
2619:86:+          : `${siteUrl}${opts.image.startsWith("/") ? opts.image : `/${opts.image}`}`;
2622:92:+      (imageUrl && (type === "article" || opts.twitterCard === "summary_large_image")
2627:157:-const pageImage = `${siteUrl}/images/portrait.jpeg`;
2631:168:+    image: `${siteUrl}/images/portrait.jpeg`,
2636:221:   const image = article.image ? `${siteUrl}${article.image.src}` : undefined;
2644:354:+    image: `${siteUrl}/images/portrait.jpeg`,
2649:396:+      "@type": "Offer",
2650:441:-  - [ ] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
2651:442:-  - [ ] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).
2652:452:+  - [x] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
2653:453:+  - [x] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).
2656:/bin/zsh -lc 'for f in .output/public/index.html .output/public/services/index.html .output/public/contact/index.html .output/public/about/index.html .output/public/blog/index.html; do echo "--- $f"; rg -o '"'<title>["'^<]*|<meta[''^>]+(description|og:|twitter:)[''^>]*|<link[''^>]+canonical[''^>]*|<script type="application/ld'"\\+json\">["'^<]*'"' \""'$f" | head -80; done' in /Users/simon/dev/jouan.ovh
2659:<title>Simon Jouan — Développeur web freelance &amp; IA
2661:<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
2664:<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Simon Jouan","jobTitle":"Développeur web freelance","url":"https://dev.jouan.ovh","image":"https://dev.jouan.ovh/images/portrait.jpeg","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
2665:<meta property="og:title" content="Simon Jouan — Développeur web freelance & IA"
2669:<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
2671:<meta name="twitter:title" content="Simon Jouan — Développeur web freelance & IA"
2673:<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
2675:<title>Services — jouan.ovh
2677:<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
2679:<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"Services — jouan.ovh","description":"Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.","url":"https://dev.jouan.ovh/services","mainEntity":{"@type":"ItemList","itemListElement":[{"@type":"Offer","position":1,"name":"WordPress sur-mesure","description":"Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.","price":"à partir de 1 500 €"},{"@type":"Offer","position":2,"name":"Applications web","description":"Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.","price":"sur devis"},{"@type":"Offer","position":3,"name":"IA & automatisation","description":"L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.","price":"sur devis"}]}}
2680:<meta property="og:title" content="Services — jouan.ovh"
2684:<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
2686:<meta name="twitter:title" content="Services — jouan.ovh"
2688:<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
2690:<title>Contact — jouan.ovh
2692:<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
2695:<meta property="og:title" content="Contact — jouan.ovh"
2699:<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
2701:<meta name="twitter:title" content="Contact — jouan.ovh"
2703:<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
2705:<title>À propos — jouan.ovh
2707:<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
2709:<script type="application/ld+json">{"@context":"https://schema.org","@type":"ProfilePage","name":"À propos — jouan.ovh","url":"https://dev.jouan.ovh/about","mainEntity":{"@type":"Person","name":"Simon Jouan","jobTitle":"Développeur web freelance","url":"https://dev.jouan.ovh","image":"https://dev.jouan.ovh/images/portrait.jpeg"}}
2710:<meta property="og:title" content="À propos — jouan.ovh"
2714:<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
2716:<meta name="twitter:title" content="À propos — jouan.ovh"
2718:<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
2720:<title>Blog — jouan.ovh
2722:<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
2725:<meta property="og:title" content="Blog — jouan.ovh"
2730:<meta name="twitter:title" content="Blog — jouan.ovh"

exec
/bin/zsh -lc "find public app -type f \\( -iname '*portrait*' -o -iname '*logo*' \\) -print | sort; ls -l public/images 2>/dev/null | sed -n '1,120p'; rg -n \"portrait\\.jpeg|logo\\.png|image:.*src\" app content public docs | head -120" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
public/images/logo - 128x128.png
public/images/logo - 256x256.png
public/images/logo - 512x512.png
public/images/logo.png
public/images/logo.xcf
public/images/logo_black_1024x1024.png
public/images/logo_black_256x256.png
public/images/logo_black_512x512.png
public/images/logo_white.png
public/images/logo_white_256x256.png
public/images/logo_white_32x32.png
public/images/logo_white_512x512.png
public/images/portrait-256x256.jpeg
public/images/portrait-256x256.webp
public/images/portrait-512x512.jpeg
public/images/portrait-512x512.webp
public/images/portrait-512x709.jpeg
public/images/portrait-512x709.webp
public/images/portrait.jpeg
public/images/portrait_512x512_drip_art_1.png
public/images/portrait_512x512_drip_art_1.webp
public/images/portrait_512x512_drip_art_2.png
public/images/portrait_512x512_drip_art_2.webp
public/images/portrait_512x512_drip_art_3.png
public/images/portrait_512x512_drip_art_3.webp
public/images/portrait_512x512_drip_art_4.png
public/images/portrait_512x512_drip_art_4.webp
public/images/portrait_512x512_drip_art_5.png
public/images/portrait_512x512_drip_art_5.webp
public/images/portrait_512x512_drip_art_6.png
public/images/portrait_512x512_drip_art_6.webp
public/images/portrait_512x512_drip_art_7.png
public/images/portrait_512x512_drip_art_7.webp
public/images/portrait_512x512_drip_art_8.png
public/images/portrait_512x512_drip_art_8.webp
public/images/portrait_512x512_drip_art_9.png
public/images/portrait_512x512_drip_art_9.webp
total 12344
-rw-r--r--@ 1 simon  staff  249998 Jun 18 08:28 favicon.ico
-rw-r--r--@ 1 simon  staff    6207 Jun 18 08:28 logo - 128x128.png
-rw-r--r--@ 1 simon  staff   14209 Jun 18 08:28 logo - 256x256.png
-rw-r--r--@ 1 simon  staff   43474 Jun 18 08:28 logo - 512x512.png
-rw-r--r--@ 1 simon  staff  188437 Jun 18 08:28 logo.png
-rw-r--r--@ 1 simon  staff  188316 Jun 18 08:28 logo.xcf
-rw-r--r--@ 1 simon  staff   27390 Jun 18 08:28 logo_black_1024x1024.png
-rw-r--r--@ 1 simon  staff    6769 Jun 18 08:28 logo_black_256x256.png
-rw-r--r--@ 1 simon  staff   15615 Jun 18 08:28 logo_black_512x512.png
-rw-r--r--@ 1 simon  staff   36000 Jun 18 08:28 logo_white.png
-rw-r--r--@ 1 simon  staff    8103 Jun 18 08:28 logo_white_256x256.png
-rw-r--r--@ 1 simon  staff    1093 Jun 18 08:28 logo_white_32x32.png
-rw-r--r--@ 1 simon  staff   19466 Jun 18 08:28 logo_white_512x512.png
-rw-r--r--@ 1 simon  staff   31572 Jun 18 23:34 portrait-256x256.jpeg
-rw-r--r--@ 1 simon  staff   24648 Jun 18 23:34 portrait-256x256.webp
-rw-r--r--@ 1 simon  staff   66444 Jun 18 23:34 portrait-512x512.jpeg
-rw-r--r--@ 1 simon  staff   49860 Jun 18 23:34 portrait-512x512.webp
-rw-r--r--@ 1 simon  staff  251750 Jun 18 23:34 portrait-512x709.jpeg
-rw-r--r--@ 1 simon  staff   69114 Jun 18 23:34 portrait-512x709.webp
-rw-r--r--@ 1 simon  staff   31572 Jun 23 09:46 portrait.jpeg
-rw-r--r--@ 1 simon  staff  520781 Jun 18 23:34 portrait_512x512_drip_art_1.png
-rw-r--r--@ 1 simon  staff  103108 Jun 18 23:34 portrait_512x512_drip_art_1.webp
-rw-r--r--@ 1 simon  staff  488184 Jun 18 23:34 portrait_512x512_drip_art_2.png
-rw-r--r--@ 1 simon  staff   92408 Jun 18 23:34 portrait_512x512_drip_art_2.webp
-rw-r--r--@ 1 simon  staff  457363 Jun 18 23:34 portrait_512x512_drip_art_3.png
-rw-r--r--@ 1 simon  staff   82786 Jun 18 23:34 portrait_512x512_drip_art_3.webp
-rw-r--r--@ 1 simon  staff  368077 Jun 18 23:34 portrait_512x512_drip_art_4.png
-rw-r--r--@ 1 simon  staff   46706 Jun 18 23:34 portrait_512x512_drip_art_4.webp
-rw-r--r--@ 1 simon  staff  578467 Jun 18 23:34 portrait_512x512_drip_art_5.png
-rw-r--r--@ 1 simon  staff  154212 Jun 18 23:34 portrait_512x512_drip_art_5.webp
-rw-r--r--@ 1 simon  staff  490495 Jun 18 23:34 portrait_512x512_drip_art_6.png
-rw-r--r--@ 1 simon  staff   95006 Jun 18 23:34 portrait_512x512_drip_art_6.webp
-rw-r--r--@ 1 simon  staff  431762 Jun 18 23:34 portrait_512x512_drip_art_7.png
-rw-r--r--@ 1 simon  staff   73580 Jun 18 23:34 portrait_512x512_drip_art_7.webp
-rw-r--r--@ 1 simon  staff  385312 Jun 18 23:34 portrait_512x512_drip_art_8.png
-rw-r--r--@ 1 simon  staff   56654 Jun 18 23:34 portrait_512x512_drip_art_8.webp
-rw-r--r--@ 1 simon  staff  391168 Jun 18 23:34 portrait_512x512_drip_art_9.png
-rw-r--r--@ 1 simon  staff   57658 Jun 18 23:34 portrait_512x512_drip_art_9.webp
-rw-r--r--@ 1 simon  staff    7735 Jun 18 08:29 undraw_code_thinking_re_gka2.svg
-rw-r--r--@ 1 simon  staff   25635 Jun 18 08:29 undraw_programming_re_kg9v.svg
app/pages/about.vue:11:            <ZAvatar src="/images/portrait.jpeg" :alt="profile.name" initials="SJ" size="xl" ring />
app/pages/about.vue:148:    image: `${siteUrl}/images/portrait.jpeg`,
app/pages/about.vue:156:  image: "/images/portrait.jpeg",
app/pages/blog/[...slug].vue:137:    image: article.image?.src,
app/composables/usePageSeo.ts:11:  /** Chemin relatif ou absolu de l'image OG/Twitter (ex. "/images/portrait.jpeg"). Résolue en URL absolue. */
app/pages/blog/index.vue:122:    ...(article.image ? { image: `${siteUrl}${article.image.src}` } : {}),
app/pages/services.vue:156:  image: "/images/portrait.jpeg",
app/app.vue:19:  logo: `${siteUrl}/images/logo.png`,
app/pages/contact.vue:278:  image: "/images/portrait.jpeg",
app/pages/index.vue:199:    image: `${siteUrl}/images/portrait.jpeg`,
app/pages/index.vue:213:  image: "/images/portrait.jpeg",
docs/implementation-artifacts/deferred-work.md:116:- **`article.image.src` sans slash initial → URL d'image malformée** — Dans `blog/index.vue` (JSON-LD `image`) et `blog/[...slug].vue` (`og:image` + JSON-LD), `` `${siteUrl}${article.image.src}` `` concatène sans séparateur : un frontmatter d'article avec `image: { src: "images/x.webp" }` (sans `/` initial) produirait `https://dev.jouan.ovhimages/x.webp`. **Pré-existant** (identique avec l'ancienne constante `SITE_URL`, non introduit par 10.1) et **non déclenchable aujourd'hui** (`content/blog/` vide → 0 article). `content.config.ts` type `image.src` en `z.string()` sans contrainte de format. À corriger à la **factorisation de la construction d'URL SEO de la story 10.5** (helper unique + normalisation slash, ou schéma `image.src` `startsWith("/")`). _(revue 10.1 — Edge Case Hunter)_
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:65:- **Portrait** : `docs/design_system/assets/brand/portrait.jpeg` à copier vers `public/images/` (ou `assets/`) lors de l'usage (story Avatar dans Home/About — Epics 3/5). [Source: docs/project-context.md#Organisation]
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:131:- Vérif par page de smoke-test temporaire (`app/pages/__zinputavatar_smoke.vue`) générée puis **supprimée** (zéro résidu). Le portrait `docs/design_system/assets/brand/portrait.jpeg` sera copié vers `public/images/` à l'usage réel (Epics 3/5) — hors périmètre de cette primitive.
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:1532:    11	            <ZAvatar src="/images/portrait.jpeg" :alt="profile.name" initials="SJ" size="xl" ring />
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:1661:   140	const pageImage = `${siteUrl}/images/portrait.jpeg`;
docs/implementation-artifacts/epic-5-retro-2026-06-23.md:18:  - 5.1 — Portrait + bio : refonte complète de `app/pages/about.vue`, **suppression du legacy Options API** (`MainComponent` + `ZCardComponent` monolithique) au profit de `<script setup lang="ts">` ; portrait porté (`public/images/portrait.jpeg`) via `ZAvatar`, bio `.prose` 1ʳᵉ personne, 2 CTA `ZButton`.
docs/implementation-artifacts/epic-5-retro-2026-06-23.md:47:| **Prep : porter le portrait** `design_system/assets/` → `public/images/` | ✅ **Fait** | 5.1 tâche 1 (`portrait.jpeg` copié, servi via `ZAvatar`/`NuxtImg`). |
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1150:+  logo: `${siteUrl}/images/logo.png`,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1180:+  /** Chemin relatif ou absolu de l'image OG/Twitter (ex. "/images/portrait.jpeg"). Résolue en URL absolue. */
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1286:-const pageImage = `${siteUrl}/images/portrait.jpeg`;
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1297:+    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1321:+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1374:+    image: article.image?.src,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1457:+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1487:+    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1501:+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1550:+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1858:public/images/logo.png
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1873:public/images/portrait.jpeg
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1941:199:    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2077:148:    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2085:156-  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2187:122:    ...(article.image ? { image: `${siteUrl}${article.image.src}` } : {}),
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2331:137:    image: article.image?.src,
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2416:.output/public/_ipx/_/images/portrait.jpeg
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2548:<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2551:<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Simon Jouan","jobTitle":"Développeur web freelance","url":"https://dev.jouan.ovh","image":"https://dev.jouan.ovh/images/portrait.jpeg","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2556:<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2560:<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2564:<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2571:<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2575:<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2579:<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2586:<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2590:<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2594:<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2596:<script type="application/ld+json">{"@context":"https://schema.org","@type":"ProfilePage","name":"À propos — jouan.ovh","url":"https://dev.jouan.ovh/about","mainEntity":{"@type":"Person","name":"Simon Jouan","jobTitle":"Développeur web freelance","url":"https://dev.jouan.ovh","image":"https://dev.jouan.ovh/images/portrait.jpeg"}}
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2601:<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2605:<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2609:<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2621:{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2623:{"@context":"https://schema.org","@type":"Person","name":"Simon Jouan","jobTitle":"Développeur web freelance","url":"https://dev.jouan.ovh","image":"https://dev.jouan.ovh/images/portrait.jpeg","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2625:{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2628:{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2631:{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2632:{"@context":"https://schema.org","@type":"ProfilePage","name":"À propos — jouan.ovh","url":"https://dev.jouan.ovh/about","mainEntity":{"@type":"Person","name":"Simon Jouan","jobTitle":"Développeur web freelance","url":"https://dev.jouan.ovh","image":"https://dev.jouan.ovh/images/portrait.jpeg"}}
docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:2634:{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:2037:docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md-131-- Vérif par page de smoke-test temporaire (`app/pages/__zinputavatar_smoke.vue`) générée puis **supprimée** (zéro résidu). Le portrait `docs/design_system/assets/brand/portrait.jpeg` sera copié vers `public/images/` à l'usage réel (Epics 3/5) — hors périmètre de cette primitive.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:2915:docs/implementation-artifacts/5-1-portrait-et-bio.md-148-- `public/images/portrait.jpeg` (CRÉÉ — copie de `docs/design_system/assets/brand/portrait.jpeg`)
docs/implementation-artifacts/code-reviews/10-5/full.diff:21:+  logo: `${siteUrl}/images/logo.png`,
docs/implementation-artifacts/code-reviews/10-5/full.diff:51:+  /** Chemin relatif ou absolu de l'image OG/Twitter (ex. "/images/portrait.jpeg"). Résolue en URL absolue. */
docs/implementation-artifacts/code-reviews/10-5/full.diff:157:-const pageImage = `${siteUrl}/images/portrait.jpeg`;
docs/implementation-artifacts/code-reviews/10-5/full.diff:168:+    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/full.diff:192:+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/full.diff:245:+    image: article.image?.src,
docs/implementation-artifacts/code-reviews/10-5/full.diff:324:+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/full.diff:354:+    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/full.diff:368:+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/full.diff:417:+  image: "/images/portrait.jpeg",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:569:    src: "../../assets/brand/portrait.jpeg",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1349:    src: "../../assets/brand/portrait.jpeg",
docs/implementation-artifacts/5-1-portrait-et-bio.md:26:  - [x] Copier `docs/design_system/assets/brand/portrait.jpeg` vers `public/images/portrait.jpeg` (assets statiques servis par `@nuxt/image` → cible `public/images/`, cf. project-context).
docs/implementation-artifacts/5-1-portrait-et-bio.md:27:  - [x] Vérifier que l'image est bien servie en dev (`/images/portrait.jpeg`).
docs/implementation-artifacts/5-1-portrait-et-bio.md:62:- **`public/images/portrait.jpeg`** (CREATE) — copie de `docs/design_system/assets/brand/portrait.jpeg`.
docs/implementation-artifacts/5-1-portrait-et-bio.md:77:  - `<Avatar src="../../assets/brand/portrait.jpeg" alt={S.name} size="xl" ring />` → `<ZAvatar src="/images/portrait.jpeg" :alt="name" size="xl" ring />` (chemin **réécrit** vers `public/`).
docs/implementation-artifacts/5-1-portrait-et-bio.md:98:- Chemin portrait : `About.jsx` référence `../../assets/brand/portrait.jpeg` (relatif au kit). Dans le site, copier vers `public/images/portrait.jpeg` et référencer `/images/portrait.jpeg` via `<nuxt-img>`.
docs/implementation-artifacts/5-1-portrait-et-bio.md:120:- [Source: docs/design_system/assets/brand/portrait.jpeg — asset portrait]
docs/implementation-artifacts/5-1-portrait-et-bio.md:134:- `pnpm generate` (Docker) : prerender OK — `/about` (24 ms) + `/_ipx/_/images/portrait.jpeg` générés, aucune erreur.
docs/implementation-artifacts/5-1-portrait-et-bio.md:143:- Portrait copié vers `public/images/portrait.jpeg` et servi via `<NuxtImg>` (`ZAvatar`), optimisé par `@nuxt/image` (route `/_ipx/...` prerendue).
docs/implementation-artifacts/5-1-portrait-et-bio.md:148:- `public/images/portrait.jpeg` (CRÉÉ — copie de `docs/design_system/assets/brand/portrait.jpeg`)
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md:527:            <ZAvatar src="/images/portrait.jpeg" :alt="profile.name" initials="SJ" size="xl" ring />
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md:1604:app/pages/blog/index.vue-122-    ...(article.image ? { image: `${siteUrl}${article.image.src}` } : {}),
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:92:+  logo: `${siteUrl}/images/logo.png`,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:122:+  /** Chemin relatif ou absolu de l'image OG/Twitter (ex. "/images/portrait.jpeg"). Résolue en URL absolue. */
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:228:-const pageImage = `${siteUrl}/images/portrait.jpeg`;
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:239:+    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:263:+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:316:+    image: article.image?.src,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:399:+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:429:+    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:443:+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:492:+  image: "/images/portrait.jpeg",
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:807:    image: article.image?.src,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1012:    ...(article.image ? { image: `${siteUrl}${article.image.src}` } : {}),
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1229:app/pages/about.vue:148:    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1241:app/pages/blog/index.vue:122:    ...(article.image ? { image: `${siteUrl}${article.image.src}` } : {}),
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1263:app/pages/index.vue:199:    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1294:app/app.vue:19:  logo: `${siteUrl}/images/logo.png`,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1480:docs/implementation-artifacts/deferred-work.md:116:- **`article.image.src` sans slash initial → URL d'image malformée** — Dans `blog/index.vue` (JSON-LD `image`) et `blog/[...slug].vue` (`og:image` + JSON-LD), `` `${siteUrl}${article.image.src}` `` concatène sans séparateur : un frontmatter d'article avec `image: { src: "images/x.webp" }` (sans `/` initial) produirait `https://dev.jouan.ovhimages/x.webp`. **Pré-existant** (identique avec l'ancienne constante `SITE_URL`, non introduit par 10.1) et **non déclenchable aujourd'hui** (`content/blog/` vide → 0 article). `content.config.ts` type `image.src` en `z.string()` sans contrainte de format. À corriger à la **factorisation de la construction d'URL SEO de la story 10.5** (helper unique + normalisation slash, ou schéma `image.src` `startsWith("/")`). _(revue 10.1 — Edge Case Hunter)_
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1605:docs/implementation-artifacts/code-reviews/10-5/raw-acceptance-auditor.md:1150:+  logo: `${siteUrl}/images/logo.png`,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1650:docs/implementation-artifacts/code-reviews/10-5/full.diff:21:+  logo: `${siteUrl}/images/logo.png`,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1727:docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:131:+  logo: `${siteUrl}/images/logo.png`,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1808:docs/implementation-artifacts/code-reviews/10-5/raw-edge-case-hunter.json:680:app/app.vue:19:  logo: `${siteUrl}/images/logo.png`,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1835:docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:92:+  logo: `${siteUrl}/images/logo.png`,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1937:docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:1294:app/app.vue:19:  logo: `${siteUrl}/images/logo.png`,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:2194:.output/public/images/logo.png
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:2335:+  logo: `${siteUrl}/images/logo.png`,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:2365:+  /** Chemin relatif ou absolu de l'image OG/Twitter (ex. "/images/portrait.jpeg"). Résolue en URL absolue. */
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:2431:21:+  logo: `${siteUrl}/images/logo.png`,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:2444:157:-const pageImage = `${siteUrl}/images/portrait.jpeg`;
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:2448:168:+    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:2461:354:+    image: `${siteUrl}/images/portrait.jpeg`,
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:2478:<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:2481:<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Simon Jouan","jobTitle":"Développeur web freelance","url":"https://dev.jouan.ovh","image":"https://dev.jouan.ovh/images/portrait.jpeg","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:2486:<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:2490:<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:2494:<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:2501:<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md:2505:<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"

exec
/bin/zsh -lc "sed -n '1,180p' docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md; rg -n '"'^##|''^###|''^Findings|''^'"\\*\\*' docs/implementation-artifacts/code-reviews/10-5/raw-blind-hunter.md | head -80" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
Reading prompt from stdin...
2026-09-13T08:36:11.190731Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: high
reasoning summaries: none
session id: 01a099e8-e23d-7ad0-a312-d608ca486551
--------
user
# Blind Hunter Prompt — Story 10.5

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/10-5/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
I’m using `bmad-review-adversarial-general` to perform the requested skeptical review of the specified diff and report only actionable finding descriptions.
exec
/bin/zsh -lc 'cat /Users/simon/dev/jouan.ovh/.agents/skills/bmad-review-adversarial-general/SKILL.md' in /Users/simon/dev/jouan.ovh
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
/bin/zsh -lc "wc -l docs/implementation-artifacts/code-reviews/10-5/full.diff && sed -n '1,260p' docs/implementation-artifacts/code-reviews/10-5/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     517 docs/implementation-artifacts/code-reviews/10-5/full.diff
diff --git a/app/app.vue b/app/app.vue
index 84b23a4..6016dd4 100644
--- a/app/app.vue
+++ b/app/app.vue
@@ -4,4 +4,29 @@
   </NuxtLayout>
 </template>
 
+<script setup lang="ts">
+import { SITE } from "~/data/site";
+
+// Métadonnées Schema.org globales (Organization / publisher du site).
+// Résolues depuis runtimeConfig (useSiteUrl) et les données partagées (SITE).
+const siteUrl = useSiteUrl();
+
+const organizationJsonLd = {
+  "@context": "https://schema.org",
+  "@type": "Organization",
+  name: SITE.profile.name,
+  url: siteUrl,
+  logo: `${siteUrl}/images/logo.png`,
+  email: SITE.profile.email,
+  address: {
+    "@type": "PostalAddress",
+    addressLocality: SITE.profile.city,
+  },
+};
+
+useHead({
+  script: [jsonLdScript(organizationJsonLd)],
+});
+</script>
+
 <style lang="scss" scoped></style>
diff --git a/app/composables/usePageSeo.ts b/app/composables/usePageSeo.ts
new file mode 100644
index 0000000..6a238eb
--- /dev/null
+++ b/app/composables/usePageSeo.ts
@@ -0,0 +1,103 @@
+import { computed, toValue, type MaybeRefOrGetter } from "vue";
+import { useSiteUrl } from "./useSiteUrl";
+
+export interface PageSeoOptions {
+  /** Titre de la page (utilisé pour <title>, og:title, twitter:title). */
+  title: string;
+  /** Description de la page (utilisée pour <meta name="description">, og:description, twitter:description). */
+  description: string;
+  /** Chemin relatif de la page (ex. "/" ou "/services" ou "/blog/slug"). Si omis, résolu sur siteUrl. */
+  path?: string;
+  /** Chemin relatif ou absolu de l'image OG/Twitter (ex. "/images/portrait.jpeg"). Résolue en URL absolue. */
+  image?: string;
+  /** Type Open Graph : "website" (défaut), "article" ou "profile". */
+  type?: "website" | "article" | "profile";
+  /** Format Twitter Card : si omis, "summary_large_image" si type article avec image, sinon "summary". */
+  twitterCard?: "summary" | "summary_large_image";
+  /** Données JSON-LD (objet Schema.org ou tableau d'objets) injectées via jsonLdScript. */
+  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
+}
+
+/**
+ * Composable centralisant la déclaration des métadonnées SEO par page :
+ * <title>, canonical, description, Open Graph (type, title, desc, url, image)
+ * et Twitter Card (card, title, desc, image) + JSON-LD échappé.
+ *
+ * Résout automatiquement les URLs absolues à partir de `useSiteUrl()` (runtimeConfig).
+ */
+export function usePageSeo(options: MaybeRefOrGetter<PageSeoOptions | undefined | null>): void {
+  const siteUrl = useSiteUrl();
+
+  const seo = computed(() => {
+    const opts = toValue(options);
+    if (!opts) {
+      return null;
+    }
+
+    const rawPath = opts.path ?? "";
+    const cleanPath = rawPath === "" || rawPath === "/" ? "" : rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
+    const canonicalUrl = cleanPath ? `${siteUrl}${cleanPath}` : siteUrl;
+
+    let imageUrl: string | undefined;
+    if (opts.image) {
+      imageUrl =
+        opts.image.startsWith("http://") || opts.image.startsWith("https://")
+          ? opts.image
+          : `${siteUrl}${opts.image.startsWith("/") ? opts.image : `/${opts.image}`}`;
+    }
+
+    const type = opts.type ?? "website";
+    const twitterCard =
+      opts.twitterCard ??
+      (imageUrl && (type === "article" || opts.twitterCard === "summary_large_image")
+        ? "summary_large_image"
+        : "summary");
+
+    return {
+      title: opts.title,
+      description: opts.description,
+      canonicalUrl,
+      imageUrl,
+      type,
+      twitterCard,
+      jsonLd: opts.jsonLd,
+    };
+  });
+
+  useHead(() => {
+    if (!seo.value) {
+      return {};
37:**Goal:** Cynically review content and produce findings.
39:**Your Role:** You are a cynical, jaded reviewer with zero patience for sloppy work. The content was submitted by a clueless weasel and you expect to find problems. Be skeptical of everything. Look for what's missing, not just what's wrong. Use a precise, professional tone — no profanity or personal attacks.
41:**Inputs:**
46:## EXECUTION
48:### Step 1: Receive Content
54:### Step 2: Adversarial Analysis
58:### Step 3: Present Findings
63:## HALT CONDITIONS
2013:## RULES
2019:## INSTRUCTIONS
2081:### CHECKPOINT
2085:## NEXT
2280:**Goal:** Cynically review content and produce findings.
2282:**Your Role:** You are a cynical, jaded reviewer with zero patience for sloppy work. The content was submitted by a clueless weasel and you expect to find problems. Be skeptical of everything. Look for what's missing, not just what's wrong. Use a precise, professional tone — no profanity or personal attacks.
2284:**Inputs:**
2289:## EXECUTION
2291:### Step 1: Receive Content
2297:### Step 2: Adversarial Analysis
2301:### Step 3: Present Findings
2306:## HALT CONDITIONS

exec
/bin/zsh -lc "sed -n '1,220p' .github/workflows/cd.yml 2>/dev/null; sed -n '1,130p' docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md; git status --short" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
name: cd

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

# Le déploiement publie sur la branche gh-pages via GITHUB_TOKEN → écriture requise.
permissions:
  contents: write

# Sérialise les exécutions : deux pushes rapprochés sur main ne peuvent pas
# publier dans le désordre (un ancien build écrasant un plus récent).
concurrency:
  group: deploy-gh-pages
  cancel-in-progress: false

jobs:
  cd:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup node env
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      # Gate de qualité : lint + typecheck avant le build (validation minimale du projet).
      # S'exécute aussi sur les PR pour valider sans publier.
      - name: Lint
        run: pnpm lint

      - name: Typecheck
        run: pnpm typecheck

      - name: Generate
        run: pnpm generate

      # CNAME et _headers vivent dans public/ et sont émis automatiquement dans
      # .output/public par `nuxi generate`. La copie reste par sécurité (no-op si déjà présent).
      - name: Ensure _headers + CNAME in output
        run: |
          cp public/_headers .output/public/_headers
          cp public/CNAME .output/public/CNAME

      # Garde-fou avant publication : la sortie statique doit contenir les pages,
      # _headers, le CNAME du domaine custom et le portrait référencé par about.vue.
      - name: Verify static output
        run: |
          set -euo pipefail
          for f in index.html 200.html 404.html about/index.html blog/index.html _headers CNAME images/portrait_512x512_drip_art_8.webp; do
            test -f ".output/public/$f" || { echo "::error::Fichier manquant dans la sortie statique : $f"; exit 1; }
          done
          grep -qx "dev.jouan.ovh" .output/public/CNAME || { echo "::error::CNAME ne contient pas le domaine custom attendu"; exit 1; }
          echo "Sortie statique validée."

      - name: Deploy
        # Publication uniquement sur push (main) ; les PR exécutent la validation sans déployer.
        if: github.event_name == 'push'
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .output/public
---
baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
---

# Story 10.1: Décision hébergement prod et dé-risquage du déploiement gh-pages

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a mainteneur du site,
I want trancher l'hébergement de production et prouver la chaîne de déploiement gh-pages (`CNAME` inclus) sur un dry-run,
so that la première mise en production de la refonte ne révèle pas de surprise (chaîne CI jamais exécutée en réel, ~28 stories empilées sur `feat/design-system-revamp`).

## Acceptance Criteria

**Given** la cible prod `jouan.ovh` et la chaîne `pnpm generate` → publication `gh-pages`
**When** on tranche l'hébergement prod (domaine, branche de déploiement, `CNAME`) et on exécute un dry-run de la chaîne depuis le staging
**Then** la décision est consignée et `SITE_URL` est lu depuis `runtimeConfig` (valeur staging/prod swappable, sans domaine hardcodé)
**And** le dry-run prouve `pnpm generate` vert (11 routes) + un artefact `gh-pages` servant le site avec `CNAME` intact (régression `cf1829e` non reproduite), documenté dans la story

> **Découpage AC (numérotation pour les tâches) :**
> 1. **Décision d'hébergement prod consignée** (domaine, branche→environnement, mécanisme `CNAME` staging vs prod) dans la story (+ `deferred-work.md`/`project-context.md` si besoin).
> 2. **`SITE_URL` lu depuis `runtimeConfig.public`** (plus de domaine hardcodé dans `app/utils/seo.ts`), valeur **staging par défaut inchangée** (`dev.jouan.ovh`) et **surchargeable** vers prod par env — sans casser le staging actuel.
> 3. **Dry-run de la chaîne prouvé** : `pnpm generate` vert (11 routes) + artefact `.output/public` valide (pages + `_headers` + `CNAME` + portrait) servant le site, `CNAME` intact ; consigné (logs/captures) dans le Dev Agent Record.

## Tasks / Subtasks

- [x] Tâche 1 — Trancher et consigner l'hébergement de production (AC: #1) — **⚠️ décision Simon requise, cf. Dev Notes › Décision requise**
  - [x] Acter le **domaine prod** (`jouan.ovh`) et la **correspondance branche → environnement** (ex. `develop` → staging `dev.jouan.ovh`, `main` → prod `jouan.ovh`).
  - [x] Acter le **mécanisme `CNAME`** : aujourd'hui `public/CNAME` = `dev.jouan.ovh` (committé, émis tel quel par `generate`). Décider comment le prod sert `jouan.ovh` (option A : `public/CNAME` devient `jouan.ovh` au moment du merge prod en 10.7 ; option B : `CNAME` écrit par le job CI selon la branche). **Ne PAS basculer la valeur live `dev.jouan.ovh` dans cette story** (le staging doit continuer à fonctionner) — la bascule réelle est la story 10.7.
  - [x] Consigner la décision dans la story (section Décision) ; mettre à jour `deferred-work.md` items #7/#9 si la décision les précise.
- [x] Tâche 2 — Rendre `SITE_URL` swappable via `runtimeConfig` (AC: #2)
  - [x] Ajouter `runtimeConfig.public.siteUrl` dans `nuxt.config.ts` (à côté de `web3formsAccessKey`), **valeur par défaut `https://dev.jouan.ovh`** (staging, identique à l'actuel), surchargeable par env `NUXT_PUBLIC_SITE_URL` (ajouter au `.env.example`).
  - [x] Repointer les consommateurs de `SITE_URL` (`app/utils/seo.ts` + `app/pages/about.vue`, `app/pages/blog/index.vue`, `app/pages/blog/[...slug].vue`) pour lire la valeur depuis `useRuntimeConfig().public.siteUrl`. ⚠️ `useRuntimeConfig()` est un composable → l'appeler **dans le `setup`/contexte Nuxt**, pas au niveau module d'un util pur (cf. Dev Notes › `SITE_URL` → runtimeConfig). Conserver `jsonLdScript()` tel quel.
  - [x] Vérifier qu'aucune **URL canonique complète** du site ne reste hardcodée dans le code applicatif ; le seul littéral admis pour l'URL de base = le défaut dans `nuxt.config.ts` et `public/CNAME`.
  - [x] Confirmer le rendu **identique** du HTML prerendu pour `/about`, `/blog`, `/blog/[...slug]` (canonical/og:url toujours en `https://dev.jouan.ovh/...` tant que l'env n'est pas surchargée).
- [x] Tâche 3 — Dry-run de la chaîne de déploiement (AC: #3)
  - [x] Lire et comprendre la chaîne **déjà en place** : `.github/workflows/cd.yml` (gate lint+typecheck+generate → copie `_headers`/`CNAME` → `Verify static output` → `peaceiris/actions-gh-pages` **sur push `main` uniquement**, PR `main` = validation sans déploiement) ET le script local `pnpm deploy` (`push-dir` → `gh-pages`). **Ne pas réinventer** : la chaîne existe, on la **prouve**.
  - [x] Exécuter le dry-run **sans publier en prod**. Option recommandée : ouvrir une **PR vers `main`** (déclenche la validation CI — lint/typecheck/generate/`Verify static output` — **sans** l'étape Deploy, gardée `if: github.event_name == 'push'`). Alternative locale : `docker compose run --rm web sh -c "corepack enable && pnpm generate"` puis inspecter `.output/public`.
  - [x] Vérifier l'artefact `.output/public` : présence de `index.html`, `200.html`, `404.html`, `about/index.html`, `blog/index.html`, `_headers`, `CNAME` (= domaine attendu), `images/portrait_512x512_drip_art_8.webp` (les fichiers contrôlés par le step `Verify static output`). Confirmer **11 routes** prerendered et `CNAME` intact (régression `cf1829e` non reproduite).
  - [x] Consigner le résultat du dry-run (sortie CI / logs `generate` / liste `.output/public`) dans le Dev Agent Record.
- [x] Tâche 4 — Validation qualité (AC: #2, #3)
  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` **verts** (11 routes), aucune valeur hardcodée réintroduite.
  - [x] Vérif navigateur (Chrome DevTools MCP) : `/about` et `/blog` — `canonical`/`og:url` rendus, domaine résolu depuis `runtimeConfig` (inchangé en staging). Vue article non vérifiable en navigateur faute d'article réel (`content/blog/` vide), mais couverte par typecheck/prerender.

## Dev Notes

### Périmètre & décision

- **Story d'ouverture de l'Epic 10 (« fin de refonte »)** : elle (a) **tranche l'hébergement prod** — input qui débloque tout l'épic, (b) pose le **mécanisme `SITE_URL` swappable** via `runtimeConfig`, (c) **dé-risque la chaîne de déploiement** par un dry-run, **avant** la mise en prod réelle. Décision rétro Epic 9 : dé-risquer le déploiement **tôt** (chaîne jamais exécutée sur `main`, report assumé depuis l'Epic 1). [Source: `docs/implementation-artifacts/epic-9-retro-2026-06-29.md` §6/§7 ; `deferred-work.md` items #7, #9]
- **Frontières à respecter (ne pas déborder) :**
  - **Story 10.5 (SEO)** fera la **centralisation SEO** (`useSeoMeta`/`app.head` partagé, `publisher`/`Organization`, OG/JSON-LD des pages nues). Ici on ne fait QUE déplacer `SITE_URL` vers `runtimeConfig` (plomberie minimale) — **pas** de refonte des métadonnées.
  - **Story 10.7 (mise en prod réelle)** fera la **bascule live** `dev.jouan.ovh` → `jouan.ovh` (`CNAME` + valeur prod), le **merge `main`** et le **déploiement prod**. Ici on **ne bascule pas** le domaine live et **on ne merge pas** — on prouve seulement la chaîne en dry-run.
- **Nature « décision + spike + plomberie légère »** : une bonne part de la valeur est la **décision consignée** + la **preuve** que la chaîne marche. Le code touché est volontairement **minimal et non destructif** (staging reste vert).

### Décision requise — hébergement de production (input Simon)

> **À trancher avant/au lancement de `dev-story`.** Le code par défaut garde le staging intact ; seule la décision oriente 10.7.

> **✅ Décision actée (Simon, 2026-06-30) :**
> 1. **Environnements** : 2 envs souhaités *idéalement*. ⚠️ **Contrainte GitHub Pages : un repo = un seul site Pages = un seul domaine custom** (un seul `CNAME`) → impossible de servir `jouan.ovh` ET `dev.jouan.ovh` depuis ce repo. **Décision : prod `jouan.ovh` sur CE repo** (`main` → `gh-pages`, Option A). Le **staging `dev.jouan.ovh` permanent = setup séparé** (repo dédié ou 2ᵉ host type Cloudflare Pages/Netlify, ou PR previews) — **hors chemin critique**, à mettre en place séparément (ne bloque pas la livraison prod ; traçable comme tâche distincte, pas dans Epic 10 sauf décision contraire).
> 2. **Mécanisme `CNAME` : Option A** — `public/CNAME` passe à `jouan.ovh` au merge prod (story 10.7), en même temps que le `grep -qx` du step `Verify static output` de `cd.yml`.
> 3. **DNS** : OK — Simon configure l'enregistrement `jouan.ovh` → GitHub Pages chez OVH avant 10.7.
>
> _Conséquence pour 10.1_ : la valeur par défaut de `siteUrl` **reste `https://dev.jouan.ovh`** (staging) ; la bascule vers `jouan.ovh` (valeur + `CNAME` + guard CI) est faite en **10.7**. Le dry-run de 10.1 se fait avec le `CNAME` actuel (`dev.jouan.ovh`), donc le guard CI passe.

Contexte : `public/CNAME` = `dev.jouan.ovh` (staging, branche `develop` → `gh-pages` historiquement) ; la prod cible est `jouan.ovh`, **hébergement encore non décidé**. Questions ouvertes :

1. **Modèle d'environnements** — confirme-t-on `develop` → staging (`dev.jouan.ovh`) et `main` → prod (`jouan.ovh`) sur **le même repo / la même branche `gh-pages`** ? (cd.yml déploie aujourd'hui depuis `main` uniquement.) Si staging et prod doivent coexister, il faut **deux cibles `gh-pages`** (deux repos ou deux domaines) — à acter.
2. **Mécanisme `CNAME`** — _Option A (simple)_ : `public/CNAME` passe à `jouan.ovh` au merge prod (10.7), et le staging vit sur une autre cible. _Option B (paramétré)_ : le job CI écrit le `CNAME` selon la branche/l'environnement. **Recommandation : Option A** (le moins de magie ; cohérent avec « `CNAME` committé émis par `generate` »), sauf si tu veux conserver un staging permanent en parallèle de la prod.
3. **DNS `jouan.ovh`** — l'enregistrement DNS (A/ALIAS/CNAME GitHub Pages) doit pointer vers GitHub Pages avant 10.7. Hors code, mais à acter par Simon (registrar OVH).

⚠️ Le step CI `Verify static output` **épingle `grep -qx "dev.jouan.ovh" .output/public/CNAME`** : tant que le `CNAME` reste `dev.jouan.ovh`, le dry-run passe ; **10.7 devra mettre à jour cette ligne** en même temps que le `CNAME`. À tracer pour 10.7, ne pas oublier.

### État actuel de la chaîne de déploiement (déjà en place — NE PAS réinventer)

- **`.github/workflows/cd.yml`** (existe, bien construit) : `on: push main` + `pull_request main` ; `permissions: contents: write` ; concurrency sérialisée. Étapes : setup pnpm + Node 22 → `pnpm install --frozen-lockfile` → **`pnpm lint`** → **`pnpm typecheck`** → **`pnpm generate`** → copie `_headers`+`CNAME` dans `.output/public` → **`Verify static output`** (présence des fichiers clés + `grep -qx "dev.jouan.ovh"` sur le `CNAME`) → **Deploy** `peaceiris/actions-gh-pages@v3` (publish `.output/public`), **gardé `if: github.event_name == 'push'`** → les **PR valident sans publier**.
- **Script local `pnpm deploy`** : `push-dir --dir=.output/public --branch=gh-pages --cleanup` (dép. `push-dir@^0.4.1`). Fallback manuel de publication.
- **Conséquence pour le dry-run** : ouvrir une **PR vers `main`** exécute exactement le gate + `Verify static output` **sans déployer** → c'est le dry-run **le plus sûr et le plus représentatif** (mêmes étapes que la prod, étape Deploy sautée). C'est le chemin recommandé.

### `SITE_URL` → `runtimeConfig` (implémentation, piège à éviter)

- **État actuel** : `app/utils/seo.ts` exporte `export const SITE_URL = "https://dev.jouan.ovh";` (constante **module**, auto-importée). Consommée par `app/pages/about.vue` (`pageUrl`/`pageImage`), `app/pages/blog/index.vue` (`pageUrl` + `url`/`image` JSON-LD), `app/pages/blog/[...slug].vue` (`url`/`image`).
- **Cible** : la valeur vient de `useRuntimeConfig().public.siteUrl` (défaut `https://dev.jouan.ovh` dans `nuxt.config.ts`, surchargeable par `NUXT_PUBLIC_SITE_URL`).
- **⚠️ Piège** : `useRuntimeConfig()` ne s'appelle **que dans un contexte Nuxt** (setup de composant, plugin, route middleware) — **pas** au niveau module d'un util pur. Donc on ne peut pas garder `export const SITE_URL = useRuntimeConfig()…` dans `seo.ts`. Deux approches valides :
  - (a) **Lire `useRuntimeConfig().public.siteUrl` dans le `<script setup>` de chaque page** (about/blog/article) — explicite, local au contexte ; `seo.ts` ne garde que `jsonLdScript()`.
  - (b) Exposer un **composable** `useSiteUrl()` dans `app/composables/` qui retourne `useRuntimeConfig().public.siteUrl` ; les pages l'appellent. (Plus DRY, prépare 10.5.)
  - **Recommandation : (b)** (un point d'accès, cohérent avec la centralisation SEO de 10.5), mais (a) est acceptable si plus simple. Documenter le choix dans Completion Notes.
- **Invariant** : tant que `NUXT_PUBLIC_SITE_URL` n'est pas surchargée, le rendu reste `https://dev.jouan.ovh/...` (zéro changement visible en staging).

### Fichiers concernés (lus — état actuel au baseline `3e82045`)

- **`nuxt.config.ts`** (UPDATE) — possède déjà `runtimeConfig.public.web3formsAccessKey: ""`. **Ajouter** `siteUrl: "https://dev.jouan.ovh"`. Ne pas toucher au reste (head, modules, content highlight off, components ui/, ssr, experimental, eslint).
- **`app/utils/seo.ts`** (UPDATE) — retirer le hardcode `SITE_URL`, garder `jsonLdScript()`. (Ou transformer en `useSiteUrl()` composable, cf. approche b.)
- **`app/pages/about.vue`**, **`app/pages/blog/index.vue`**, **`app/pages/blog/[...slug].vue`** (UPDATE) — repointer la lecture de l'URL de prod sur `runtimeConfig`. **Préserver** la forme exacte des canonical/og/JSON-LD (mêmes chemins, même rendu en staging).
- **`public/CNAME`** (LECTURE en 10.1, UPDATE en 10.7) — `dev.jouan.ovh`. **Ne pas changer ici.**
- **`.github/workflows/cd.yml`** (LECTURE en 10.1) — chaîne CI ; le `grep -qx "dev.jouan.ovh"` du step `Verify static output` est couplé au `CNAME` (à mettre à jour en 10.7).
- **`package.json`** (LECTURE) — script `deploy` (`push-dir`), dép. `push-dir`. Pas de changement attendu.
- **`.env.example`** (UPDATE) — ajouter `NUXT_PUBLIC_SITE_URL=` (commenté : défaut = staging ; renseigner `https://jouan.ovh` en prod).

### Pièges / régressions à éviter

- **Ne pas casser le staging** : la valeur par défaut de `siteUrl` reste `https://dev.jouan.ovh` ; `public/CNAME` reste `dev.jouan.ovh`. Aucune bascule live dans cette story.
- **`useRuntimeConfig()` hors contexte** : ne pas l'appeler au top-level d'un util/module (erreur runtime / prerender). Cf. ci-dessus.
- **CNAME guard CI couplé** : ne pas modifier `public/CNAME` sans aussi le `grep` du `Verify static output` (sinon CI rouge) — concerne surtout 10.7, mais à connaître.
- **Compatibilité prerender (NFR4)** : `pnpm generate` doit rester vert (11 routes) ; `runtimeConfig.public` est inliné au prerender, OK.
- **Ne pas régresser le `CNAME`** (régression historique `cf1829e`) : le dry-run doit **prouver** la présence du `CNAME` dans `.output/public`.
- **pnpm + Docker** : toutes les commandes via `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"` (jamais sur l'hôte). [Source: `docs/project-context.md#Environnement de dev`]
- **Ne pas merger sur `main` ni publier en prod** dans cette story (c'est 10.7). Le dry-run via PR `main` valide **sans** déployer (étape Deploy gardée `if push`).

### Testing standards

- Pas de framework de test (`docs/project-context.md#Tests`). Barre = `pnpm lint` (eslint + stylelint) + `pnpm typecheck` (vue-tsc) + `pnpm generate` (Docker) **verts**, + **dry-run** de la chaîne (PR `main` ou `generate` local + inspection `.output/public`), + vérif navigateur (Chrome DevTools MCP) des canonical/og inchangés en staging. Consigner les preuves (logs/captures) dans le Dev Agent Record.

### References

- [Source: docs/planning-artifacts/epics.md#Epic 10 — Story 10.1 (FR17)]
- [Source: docs/implementation-artifacts/deferred-work.md#→ Epic 10 (items #7 domaine, #9 déploiement)]
- [Source: docs/implementation-artifacts/epic-9-retro-2026-06-29.md §5/§6/§7 (dé-risquer le déploiement, trancher l'hébergement)]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#CAP-1, #Constraints (Déploiement préservé), #NFR (CNAME/gh-pages)]
- [Source: docs/project-context.md#Déploiement, #Environnement de dev (Docker), #Pièges (CNAME `cf1829e`)]
- [Source: .github/workflows/cd.yml ; nuxt.config.ts ; app/utils/seo.ts ; public/CNAME ; package.json ; .env.example]

## Dev Agent Record

### Agent Model Used

 M app/app.vue
 A app/composables/usePageSeo.ts
 M app/pages/about.vue
 M app/pages/blog/[...slug].vue
 M app/pages/blog/index.vue
 M app/pages/contact.vue
 M app/pages/index.vue
 M app/pages/services.vue
 M docs/implementation-artifacts/10-5-seo-centralise-site-wide.md
 M docs/implementation-artifacts/sprint-status.yaml
?? docs/implementation-artifacts/code-reviews/10-5/

2026-09-13T08:38:33.113546Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "nl -ba app/composables/usePageSeo.ts | sed -n '28,105p'; nl -ba app/pages/blog/'[...slug].vue' | sed -n '108,150p'; nl -ba app/pages/blog/index.vue | sed -n '98,135p'; nl -ba app/pages/services.vue | sed -n '130,160p'; nl -ba app/app.vue | sed -n '8,32p'; nl -ba .github/workflows/cd.yml | sed -n '35,90p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
    28	export function usePageSeo(options: MaybeRefOrGetter<PageSeoOptions | undefined | null>): void {
    29	  const siteUrl = useSiteUrl();
    30	
    31	  const seo = computed(() => {
    32	    const opts = toValue(options);
    33	    if (!opts) {
    34	      return null;
    35	    }
    36	
    37	    const rawPath = opts.path ?? "";
    38	    const cleanPath = rawPath === "" || rawPath === "/" ? "" : rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
    39	    const canonicalUrl = cleanPath ? `${siteUrl}${cleanPath}` : siteUrl;
    40	
    41	    let imageUrl: string | undefined;
    42	    if (opts.image) {
    43	      imageUrl =
    44	        opts.image.startsWith("http://") || opts.image.startsWith("https://")
    45	          ? opts.image
    46	          : `${siteUrl}${opts.image.startsWith("/") ? opts.image : `/${opts.image}`}`;
    47	    }
    48	
    49	    const type = opts.type ?? "website";
    50	    const twitterCard =
    51	      opts.twitterCard ??
    52	      (imageUrl && (type === "article" || opts.twitterCard === "summary_large_image")
    53	        ? "summary_large_image"
    54	        : "summary");
    55	
    56	    return {
    57	      title: opts.title,
    58	      description: opts.description,
    59	      canonicalUrl,
    60	      imageUrl,
    61	      type,
    62	      twitterCard,
    63	      jsonLd: opts.jsonLd,
    64	    };
    65	  });
    66	
    67	  useHead(() => {
    68	    if (!seo.value) {
    69	      return {};
    70	    }
    71	
    72	    const scripts: Array<{ type: string; innerHTML: string }> = [];
    73	    if (seo.value.jsonLd) {
    74	      if (Array.isArray(seo.value.jsonLd)) {
    75	        for (const item of seo.value.jsonLd) {
    76	          scripts.push(jsonLdScript(item));
    77	        }
    78	      } else {
    79	        scripts.push(jsonLdScript(seo.value.jsonLd));
    80	      }
    81	    }
    82	
    83	    return {
    84	      title: seo.value.title,
    85	      link: [{ rel: "canonical", href: seo.value.canonicalUrl }],
    86	      script: scripts,
    87	    };
    88	  });
    89	
    90	  useSeoMeta({
    91	    title: () => seo.value?.title,
    92	    description: () => seo.value?.description,
    93	    ogTitle: () => seo.value?.title,
    94	    ogDescription: () => seo.value?.description,
    95	    ogUrl: () => seo.value?.canonicalUrl,
    96	    ogType: () => seo.value?.type,
    97	    ogImage: () => seo.value?.imageUrl,
    98	    twitterCard: () => seo.value?.twitterCard,
    99	    twitterTitle: () => seo.value?.title,
   100	    twitterDescription: () => seo.value?.description,
   101	    twitterImage: () => seo.value?.imageUrl,
   102	  });
   103	}
   108	  });
   109	}
   110	
   111	// SEO par article (centralisé via usePageSeo, parité /about, /blog).
   112	// usePageSeo résout siteUrl, canonical, og:*, twitter:* et le JSON-LD échappé.
   113	const siteUrl = useSiteUrl();
   114	usePageSeo(() => {
   115	  const article = page.value;
   116	  if (!article) {
   117	    return null;
   118	  }
   119	  const url = `${siteUrl}${article.path}`;
   120	  const image = article.image ? `${siteUrl}${article.image.src}` : undefined;
   121	  const jsonLd = {
   122	    "@context": "https://schema.org",
   123	    "@type": "BlogPosting",
   124	    headline: article.title,
   125	    description: article.description,
   126	    datePublished: article.date,
   127	    author: { "@type": "Person", name: "Simon Jouan" },
   128	    url,
   129	    ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
   130	    ...(image ? { image } : {}),
   131	  };
   132	
   133	  return {
   134	    title: `${article.title} — jouan.ovh`,
   135	    description: article.description,
   136	    path: article.path,
   137	    image: article.image?.src,
   138	    type: "article",
   139	    jsonLd,
   140	  };
   141	});
   142	</script>
   143	
   144	<style lang="scss" scoped>
   145	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / Blog.jsx */
   146	// .section / .container / .prose / .hero__tags / .post__meta sont des primitives de
   147	// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
   148	.blog-article {
   149	  display: block;
   150	}
    98	
    99	// Métadonnées de la page. URL de prod lue depuis runtimeConfig via useSiteUrl()
   100	// (swappable staging/prod, sans domaine en dur). Inchangée en staging.
   101	const siteUrl = useSiteUrl();
   102	const pageTitle = "Blog — jouan.ovh";
   103	const pageDescription =
   104	  "Notes de dev — WordPress, architecture et IA appliquée : ce que j'apprends en construisant des produits web.";
   105	const pageUrl = `${siteUrl}/blog`;
   106	
   107	// JSON-LD : flux d'articles (Blog → BlogPosting) pour les moteurs / agrégateurs.
   108	// Construit à partir de la liste résolue (snapshot au build, page prerendue).
   109	const blogJsonLd = {
   110	  "@context": "https://schema.org",
   111	  "@type": "Blog",
   112	  name: "Notes de dev",
   113	  description: pageDescription,
   114	  url: pageUrl,
   115	  blogPost: (articles.value ?? []).map((article) => ({
   116	    "@type": "BlogPosting",
   117	    headline: article.title,
   118	    description: article.description,
   119	    datePublished: article.date,
   120	    url: `${siteUrl}${article.path}`,
   121	    ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
   122	    ...(article.image ? { image: `${siteUrl}${article.image.src}` } : {}),
   123	  })),
   124	};
   125	
   126	usePageSeo({
   127	  title: pageTitle,
   128	  description: pageDescription,
   129	  path: "/blog",
   130	  type: "website",
   131	  jsonLd: blogJsonLd,
   132	});
   133	</script>
   134	
   135	<style lang="scss" scoped>
   130	const siteUrl = useSiteUrl();
   131	
   132	const servicesJsonLd = {
   133	  "@context": "https://schema.org",
   134	  "@type": "WebPage",
   135	  name: "Services — jouan.ovh",
   136	  description:
   137	    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
   138	  url: `${siteUrl}/services`,
   139	  mainEntity: {
   140	    "@type": "ItemList",
   141	    itemListElement: offers.map((offer, index) => ({
   142	      "@type": "Offer",
   143	      position: index + 1,
   144	      name: offer.title,
   145	      description: offer.desc,
   146	      price: offer.price,
   147	    })),
   148	  },
   149	};
   150	
   151	usePageSeo({
   152	  title: "Services — jouan.ovh",
   153	  description:
   154	    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
   155	  path: "/services",
   156	  image: "/images/portrait.jpeg",
   157	  type: "website",
   158	  jsonLd: servicesJsonLd,
   159	});
   160	</script>
     8	import { SITE } from "~/data/site";
     9	
    10	// Métadonnées Schema.org globales (Organization / publisher du site).
    11	// Résolues depuis runtimeConfig (useSiteUrl) et les données partagées (SITE).
    12	const siteUrl = useSiteUrl();
    13	
    14	const organizationJsonLd = {
    15	  "@context": "https://schema.org",
    16	  "@type": "Organization",
    17	  name: SITE.profile.name,
    18	  url: siteUrl,
    19	  logo: `${siteUrl}/images/logo.png`,
    20	  email: SITE.profile.email,
    21	  address: {
    22	    "@type": "PostalAddress",
    23	    addressLocality: SITE.profile.city,
    24	  },
    25	};
    26	
    27	useHead({
    28	  script: [jsonLdScript(organizationJsonLd)],
    29	});
    30	</script>
    31	
    32	<style lang="scss" scoped></style>
    35	          node-version: 22
    36	          cache: pnpm
    37	
    38	      - name: Install dependencies
    39	        run: pnpm install --frozen-lockfile
    40	
    41	      # Gate de qualité : lint + typecheck avant le build (validation minimale du projet).
    42	      # S'exécute aussi sur les PR pour valider sans publier.
    43	      - name: Lint
    44	        run: pnpm lint
    45	
    46	      - name: Typecheck
    47	        run: pnpm typecheck
    48	
    49	      - name: Generate
    50	        run: pnpm generate
    51	
    52	      # CNAME et _headers vivent dans public/ et sont émis automatiquement dans
    53	      # .output/public par `nuxi generate`. La copie reste par sécurité (no-op si déjà présent).
    54	      - name: Ensure _headers + CNAME in output
    55	        run: |
    56	          cp public/_headers .output/public/_headers
    57	          cp public/CNAME .output/public/CNAME
    58	
    59	      # Garde-fou avant publication : la sortie statique doit contenir les pages,
    60	      # _headers, le CNAME du domaine custom et le portrait référencé par about.vue.
    61	      - name: Verify static output
    62	        run: |
    63	          set -euo pipefail
    64	          for f in index.html 200.html 404.html about/index.html blog/index.html _headers CNAME images/portrait_512x512_drip_art_8.webp; do
    65	            test -f ".output/public/$f" || { echo "::error::Fichier manquant dans la sortie statique : $f"; exit 1; }
    66	          done
    67	          grep -qx "dev.jouan.ovh" .output/public/CNAME || { echo "::error::CNAME ne contient pas le domaine custom attendu"; exit 1; }
    68	          echo "Sortie statique validée."
    69	
    70	      - name: Deploy
    71	        # Publication uniquement sur push (main) ; les PR exécutent la validation sans déployer.
    72	        if: github.event_name == 'push'
    73	        uses: peaceiris/actions-gh-pages@v3
    74	        with:
    75	          github_token: ${{ secrets.GITHUB_TOKEN }}
    76	          publish_dir: .output/public

2026-09-13T08:39:09.122251Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
- `app/pages/blog/[...slug].vue` changes article titles from `article.title` to `article.title — jouan.ovh`, altering the existing `<title>`, `og:title`, and `twitter:title` despite the requirement to preserve SEO output.

- Article JSON-LD image URLs still use `${siteUrl}${article.image.src}` without slash normalization, so valid content such as `images/cover.webp` produces a malformed absolute URL.

- Article JSON-LD URLs are manually concatenated instead of using the helper’s normalized canonical URL logic.

- Blog index JSON-LD repeats the same unsafe URL and image concatenation for every article.

- SEO centralization is incomplete: every page still constructs its own JSON-LD objects, absolute URLs, identity data, and image URLs independently.

- The global `Organization` entity has no `@id`, and the page schemas do not reference it as `publisher`, leaving the structured-data entities disconnected.

- `BlogPosting` schemas contain an author but no publisher, so the newly advertised site-wide publisher metadata is not actually attached to the articles.

- The services page claims Service structured data in the story, but the implementation only emits a `WebPage` containing an `ItemList` of offers.

- The services `ItemList` places `position` directly on `Offer` objects rather than wrapping them in `ListItem` objects, so consumers may ignore the ordering metadata.

- Service prices are copied as display strings such as `à partir de 1 500 €` and `sur devis`, with no `priceCurrency` or machine-readable numeric value, limiting structured-data consumers.

- `addressLocality` receives `Valognes, France` instead of only the locality, and no `addressCountry` is emitted in the Organization, Person, or ContactPage schemas.

- Identity values are inconsistently hardcoded: `Simon Jouan` and the author name appear in several page schemas instead of consistently using `SITE.profile.name`.

- `path` is optional and defaults to the site root, so forgetting it on any non-home page silently creates a homepage canonical URL.

- The helper does not reject or correctly handle absolute or protocol-relative values passed as `path`; values such as `https://example.com` or `//example.com` are converted into invalid site-relative URLs.

- Image URL handling only recognizes lowercase `http://` and `https://`, so protocol-relative URLs and other valid absolute URL forms are incorrectly prefixed with `siteUrl`.

- `usePageSeo` does not normalize trailing slashes or duplicate separators, allowing equivalent route variants to emit different canonical URLs.

- The `twitterCard` fallback contains a dead condition checking `opts.twitterCard === "summary_large_image"` inside the branch where `opts.twitterCard` is already nullish, indicating misleading and untested logic.

- The helper discards image alternative text and emits no `og:image:alt`, even though article image metadata already contains alt text.

- The production workflow does not set or verify `NUXT_PUBLIC_SITE_URL`; without an external environment override, production builds will embed the staging domain in canonical, Open Graph, Twitter, and JSON-LD URLs.

- The documented validation does not exercise a real article route because `content/blog/` contains no article fixture, leaving the changed reactive article SEO path and BlogPosting output unverified.

- The story marks structured-data validation complete based mainly on tag presence, without validating JSON-LD semantics, publisher relationships, URL correctness, or schema compatibility.
tokens used
105 902
- `app/pages/blog/[...slug].vue` changes article titles from `article.title` to `article.title — jouan.ovh`, altering the existing `<title>`, `og:title`, and `twitter:title` despite the requirement to preserve SEO output.

- Article JSON-LD image URLs still use `${siteUrl}${article.image.src}` without slash normalization, so valid content such as `images/cover.webp` produces a malformed absolute URL.

- Article JSON-LD URLs are manually concatenated instead of using the helper’s normalized canonical URL logic.

- Blog index JSON-LD repeats the same unsafe URL and image concatenation for every article.

- SEO centralization is incomplete: every page still constructs its own JSON-LD objects, absolute URLs, identity data, and image URLs independently.

- The global `Organization` entity has no `@id`, and the page schemas do not reference it as `publisher`, leaving the structured-data entities disconnected.

- `BlogPosting` schemas contain an author but no publisher, so the newly advertised site-wide publisher metadata is not actually attached to the articles.

- The services page claims Service structured data in the story, but the implementation only emits a `WebPage` containing an `ItemList` of offers.

- The services `ItemList` places `position` directly on `Offer` objects rather than wrapping them in `ListItem` objects, so consumers may ignore the ordering metadata.

- Service prices are copied as display strings such as `à partir de 1 500 €` and `sur devis`, with no `priceCurrency` or machine-readable numeric value, limiting structured-data consumers.

- `addressLocality` receives `Valognes, France` instead of only the locality, and no `addressCountry` is emitted in the Organization, Person, or ContactPage schemas.

- Identity values are inconsistently hardcoded: `Simon Jouan` and the author name appear in several page schemas instead of consistently using `SITE.profile.name`.

- `path` is optional and defaults to the site root, so forgetting it on any non-home page silently creates a homepage canonical URL.

- The helper does not reject or correctly handle absolute or protocol-relative values passed as `path`; values such as `https://example.com` or `//example.com` are converted into invalid site-relative URLs.

- Image URL handling only recognizes lowercase `http://` and `https://`, so protocol-relative URLs and other valid absolute URL forms are incorrectly prefixed with `siteUrl`.

- `usePageSeo` does not normalize trailing slashes or duplicate separators, allowing equivalent route variants to emit different canonical URLs.

- The `twitterCard` fallback contains a dead condition checking `opts.twitterCard === "summary_large_image"` inside the branch where `opts.twitterCard` is already nullish, indicating misleading and untested logic.

- The helper discards image alternative text and emits no `og:image:alt`, even though article image metadata already contains alt text.

- The production workflow does not set or verify `NUXT_PUBLIC_SITE_URL`; without an external environment override, production builds will embed the staging domain in canonical, Open Graph, Twitter, and JSON-LD URLs.

- The documented validation does not exercise a real article route because `content/blog/` contains no article fixture, leaving the changed reactive article SEO path and BlogPosting output unverified.

- The story marks structured-data validation complete based mainly on tag presence, without validating JSON-LD semantics, publisher relationships, URL correctness, or schema compatibility.
