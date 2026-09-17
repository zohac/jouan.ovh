Reading prompt from stdin...
2026-09-16T22:03:34.805097Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: medium
reasoning summaries: none
session id: 01a0ac3f-2726-7271-b9c3-3681322499e3
--------
user
# Blind Hunter Prompt — Story 12.6

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/12-6/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
I’ll use `bmad-review-adversarial-general` for this, then inspect the provided diff directly and keep the output to findings only, as requested.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/dev/jouan.ovh/.agents/skills/bmad-review-adversarial-general/SKILL.md" in /Users/simon/dev/jouan.ovh
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
/bin/zsh -lc "sed -n '1,260p' docs/implementation-artifacts/code-reviews/12-6/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
diff --git a/app/pages/about.vue b/app/pages/about.vue
index 0fbfd92..e7a44e6 100644
--- a/app/pages/about.vue
+++ b/app/pages/about.vue
@@ -21,26 +21,42 @@
             </div>
           </div>
 
-          <!-- Colonne droite : eyebrow + bio (1re personne, emphases sur les technologies) + stack -->
+          <!-- Colonne droite : eyebrow + bio (1re personne, emphases sur les technologies) + bloc philosophie + stack -->
           <div class="about__bio">
-            <h2 class="eyebrow">// à propos</h2>
+            <h2 class="eyebrow"><span aria-hidden="true">// </span>à propos</h2>
             <p class="prose about__para">
-              Développeur Full Stack freelance basé en <strong>France (Remote)</strong>, je viens d'un parcours
-              technique (métrologie, instrumentation) avant de basculer avec passion dans le code. Aujourd'hui, je
-              conçois et développe des applications web et produits SaaS modernes avec <strong>Vue 3 / Nuxt 4</strong>,
-              <strong>NestJS</strong> et <strong>PostgreSQL</strong>.
+              Je développe des produits et applications depuis plusieurs années, avec un parcours un peu atypique :
+              <strong>douze ans dans la métrologie industrielle</strong> avant de passer au logiciel.
             </p>
             <p class="prose about__para">
-              Je suis également co-fondateur de la plateforme SaaS
-              <ZExternalLink :href="keovaUrl">{{ keovaHostname }}</ZExternalLink
-              >, et j'intègre l'automatisation, l'exigence QA et l'IA au service du code — tests automatisés,
-              architecture modulaire et intégrations d'APIs.
+              Cette première carrière m’a donné des réflexes qui me suivent encore aujourd’hui :
+              <strong>mesurer, tracer, vérifier</strong> et ne pas considérer qu’un système est fiable simplement parce
+              qu’il fonctionne une fois.
             </p>
+            <p class="prose about__para">
+              Aujourd’hui, je combine <strong>développement Full Stack</strong>, <strong>culture QA</strong> et
+              <strong>IA appliquée</strong> pour transformer des processus métier manuels en systèmes logiciels
+              réellement exploitables.
+            </p>
+
+            <!-- Bloc philosophie d'intervention (AC-1) -->
+            <div class="about__philosophy">
+              <p class="about__philo-intro">Je ne pars pas de « où mettre de l'IA ? ».</p>
+              <p class="about__philo-lead">Je pars de :</p>
+              <ul class="about__philo-list">
+                <li>qu’est-ce qui prend du temps ?</li>
+                <li>qu’est-ce qui se répète ?</li>
+                <li>où l’information se perd-elle ?</li>
+                <li>où une personne doit-elle recopier, rechercher ou interpréter ?</li>
+                <li>qu’est-ce qui doit absolument rester sous contrôle humain ?</li>
+              </ul>
+              <p class="about__philo-outro">Ensuite seulement vient la solution technique.</p>
+            </div>
 
             <!-- Stack technique (story 5.2) — sous la bio, conforme à About.jsx. ZTag = pill.
                  Liste sémantique (<ul>/<li>) pour annonce « liste de N éléments » aux lecteurs d'écran. -->
             <div class="about__stack">
-              <h2 class="eyebrow eyebrow--muted">// stack</h2>
+              <h2 class="eyebrow eyebrow--muted"><span aria-hidden="true">// </span>stack</h2>
               <ul class="hero__tags">
                 <li v-for="skill in skills" :key="skill">
                   <ZTag>{{ skill }}</ZTag>
@@ -60,7 +76,7 @@
           <!-- Colonne gauche : timeline d'expériences (la plus récente en haut).
                <ol> : séquence chronologique annoncée comme liste ordonnée aux lecteurs d'écran. -->
           <div>
-            <h2 class="eyebrow">// expériences</h2>
+            <h2 class="eyebrow"><span aria-hidden="true">// </span>expériences</h2>
             <ol class="tl">
               <li v-for="xp in experiences" :key="xp.org" class="tl__item">
                 <div class="tl__date">{{ xp.date }}</div>
@@ -73,7 +89,7 @@
 
           <!-- Colonne droite : formation (une ZCard par diplôme), liste sémantique <ul>/<li>. -->
           <div>
-            <h2 class="eyebrow">// formation</h2>
+            <h2 class="eyebrow"><span aria-hidden="true">// </span>formation</h2>
             <ul class="about__degrees">
               <li v-for="degree in degrees" :key="degree.name">
                 <ZCard padded>
@@ -101,12 +117,6 @@ import { SITE } from "~/data/site";
 // Identité + stack — source unique `app/data/site.ts`.
 const profile = SITE.profile;
 const skills = SITE.skills;
-const city = profile.city.split(",")[0]?.trim() ?? profile.city;
-const keovaProject =
-  SITE.legacyProjects.find((p) => p.name.toLowerCase().includes("keova") && p.url) ??
-  SITE.projects.find((p) => p.name.toLowerCase().includes("keova") && p.url);
-const keovaUrl = keovaProject?.url ?? "";
-const keovaHostname = keovaUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
 
 // Expériences (de la plus récente à la plus ancienne).
 // `org` sert de clé v-for stable (unique).
@@ -115,7 +125,7 @@ const experiences = [
     date: "02/2021 — aujourd'hui",
     role: "Testeur QA & Développeur TypeScript",
     org: "Linkizz",
-    desc: "Tests automatisés et fiabilisation applicative — Node.js, TypeScript, TestCafé.",
+    desc: "Tests automatisés, fiabilisation applicative et conception de systèmes résilients — Node.js, TypeScript, TestCafé. L'expérience QA influence directement la conception d'agents fiables : reproductibilité, cas limites, observabilité.",
   },
   {
     date: "05/2020 — 12/2021",
@@ -127,7 +137,7 @@ const experiences = [
     date: "07/2007 — 05/2019",
     role: "Métrologue",
     org: "A+ Métrologie / Trescal",
-    desc: "Technicien métrologue multi-grandeur, suppléant COFRAC électricité-magnétisme.",
+    desc: "Technicien métrologue multi-grandeur, suppléant COFRAC électricité-magnétisme. 12 ans de métrologie industrielle : rigueur de mesure, traçabilité et validation méthodologique.",
   },
 ];
 
@@ -138,8 +148,9 @@ const degrees = [
 ];
 
 // Métadonnées de la page. Voix 1re personne cohérente (cf. contrainte Langue & voix).
-const pageTitle = "À propos — jouan.ovh";
-const pageDescription = `Développeur web freelance à ${city}, je conçois des applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL — découvrez mon parcours.`;
+const pageTitle = "À propos — Simon Jouan";
+const pageDescription =
+  "Développeur Full Stack spécialisé en systèmes IA et automatisation métier. Parcours métrologie, culture QA et ingénierie logicielle au service de la fiabilité.";
 
 const siteUrl = useSiteUrl();
 const aboutJsonLd = {
@@ -265,6 +276,64 @@ usePageSeo({
   }
 }
 
+// ---- Bloc Philosophie ----
+.about__philosophy {
+  margin: var(--space-6) 0;
+  padding: var(--space-5);
+  border: 1px solid var(--border-subtle);
+  border-left: 3px solid var(--accent);
+  border-radius: var(--radius-md);
+  background: var(--surface-1);
+}
+
+.about__philo-intro {
+  margin: 0 0 var(--space-2);
+  font-family: var(--font-mono);
+  font-size: var(--fs-sm);
+  font-weight: var(--fw-medium);
+  color: var(--text-strong);
+}
+
+.about__philo-lead {
+  margin: 0 0 var(--space-3);
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  color: var(--text-muted);
+}
+
+.about__philo-list {
+  display: flex;
+  flex-direction: column;
+  gap: var(--space-2);
+  margin: 0 0 var(--space-4);
+  padding: 0;
+  list-style: none;
+
+  li {
+    position: relative;
+    padding-left: var(--space-5);
+    font-family: var(--font-mono);
+    font-size: var(--fs-xs);
+    line-height: var(--lh-normal);
+    color: var(--text-body);
+
+    &::before {
+      content: "→";
+      position: absolute;
+      left: 0;
+      color: var(--accent);
+    }
+  }
+}
+
+.about__philo-outro {
+  margin: 0;
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  font-style: italic;
+  color: var(--accent);
+}
+
 // ---- Stack (porté de About.jsx : bloc sous la bio) ----
 // .hero__tags (rangée de chips) = primitive de layout globale (base/_layout.scss).
 .about__stack {
diff --git a/app/pages/blog/[...slug].vue b/app/pages/blog/[...slug].vue
index 0668f84..e803f07 100644
--- a/app/pages/blog/[...slug].vue
+++ b/app/pages/blog/[...slug].vue
@@ -42,11 +42,11 @@
             <ContentRenderer :value="page" />
           </div>
 
-          <!-- Bloc CTA de fin (porté de Blog.jsx) -->
+          <!-- Bloc CTA de fin (porté de Blog.jsx / Story 12.6) -->
           <div class="article__cta">
-            <span class="article__cta-label">Un projet en tête ?</span>
+            <span class="article__cta-label">Un process vous fait perdre du temps ?</span>
             <ZButton :as="NuxtLink" to="/contact" variant="primary">
-              Démarrer un projet
+              Identifier un workflow
               <template #iconRight><ZIcon name="arrow" /></template>
             </ZButton>
           </div>
@@ -147,7 +147,7 @@ usePageSeo(() => {
   };
 
   return {
-    title: `${article.title} — jouan.ovh`,
+    title: `${article.title} — Simon Jouan`,
     ogTitle: article.title,
     description: article.description,
     path: article.path,
diff --git a/app/pages/blog/index.vue b/app/pages/blog/index.vue
index 63903b5..6bbacb6 100644
--- a/app/pages/blog/index.vue
+++ b/app/pages/blog/index.vue
@@ -3,10 +3,10 @@
     <section class="section">
       <div class="container">
         <!-- En-tête (porté de Blog.jsx : eyebrow + titre + sous-titre prose) -->
-        <p class="eyebrow">// ~/blog</p>
+        <p class="eyebrow"><span aria-hidden="true">// </span>~/blog</p>
         <h1 class="blog__title">Notes de dev</h1>
         <p class="prose blog__subtitle">
-          WordPress, architecture, IA appliquée — ce que j'apprends en construisant des choses.
+          Systèmes IA, agents, architecture et automatisation métier — ce que j'apprends en construisant des choses.
         </p>
 
         <!-- Liste des articles (triés par date décroissante), cartes interactives -->
@@ -100,9 +100,9 @@ const { data: articles, error } = await useAsyncData("blog-list", () =>
 // Métadonnées de la page. URL de prod lue depuis runtimeConfig via useSiteUrl()
 // (swappable staging/prod, sans domaine en dur). Inchangée en staging.
 const siteUrl = useSiteUrl();
-const pageTitle = "Blog — jouan.ovh";
+const pageTitle = "Blog — Simon Jouan";
 const pageDescription =
-  "Notes de dev — WordPress, architecture et IA appliquée : ce que j'apprends en construisant des produits web.";
+  "Notes de dev, architecture, agents IA et automatisation métier : retours d'expérience et apprentissages concrets sur le terrain.";
 const pageUrl = `${siteUrl}/blog`;
 
 // JSON-LD : flux d'articles (Blog → BlogPosting) pour les moteurs / agrégateurs.
@@ -110,7 +110,7 @@ const pageUrl = `${siteUrl}/blog`;
 const blogJsonLd = {
   "@context": "https://schema.org",
   "@type": "Blog",
-  name: "Notes de dev",
+  name: pageTitle,
   description: pageDescription,
   url: pageUrl,
   blogPost: (articles.value ?? []).map((article) => ({
diff --git a/app/pages/confidentialite.vue b/app/pages/confidentialite.vue
index d86e33e..c61beaa 100644
--- a/app/pages/confidentialite.vue
+++ b/app/pages/confidentialite.vue
@@ -27,11 +27,13 @@
             <p>Le site <strong>jouan.ovh</strong> limite la collecte des données personnelles au strict nécessaire :</p>
             <ul>
               <li>
-                <strong>Formulaire de contact :</strong> lorsque vous envoyez un message via la page
+                <strong>Formulaire de contact :</strong> lorsque vous envoyez une demande via la page

codex
I’ve got the skill instructions and the first chunk of the diff. I’m reading the rest now so the findings cover the whole patch, not just the visible top half.
exec
/bin/zsh -lc "sed -n '261,620p' docs/implementation-artifacts/code-reviews/12-6/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
                 <NuxtLink to="/contact" class="legal__link">Contact</NuxtLink>, je collecte votre <strong>nom</strong>,
-                votre <strong>adresse email</strong>, ainsi que le <strong>sujet</strong> (facultatif) et le
-                <strong>contenu de votre message</strong>. Les champs nom, email et message sont obligatoires pour me
-                permettre de vous répondre.
+                votre <strong>adresse email</strong>, le nom de votre <strong>entreprise</strong> (facultatif), la
+                <strong>fréquence</strong> du processus (facultatif), ainsi que la description de votre workflow
+                (<strong>processus à améliorer</strong> et <strong>fonctionnement actuel</strong>). Les champs nom,
+                email, processus et fonctionnement actuel sont obligatoires pour me permettre de qualifier votre besoin
+                et vous répondre.
               </li>
               <li>
                 <strong>Finalité :</strong> ces informations sont utilisées exclusivement pour traiter votre demande, y
@@ -155,7 +157,7 @@ import { usePageSeo } from "~/composables/usePageSeo";
 const profile = SITE.profile;
 
 usePageSeo({
-  title: "Politique de confidentialité — jouan.ovh",
+  title: "Politique de confidentialité — Simon Jouan",
   description:
     "Politique de confidentialité et protection des données personnelles (RGPD) du site jouan.ovh — Simon Jouan.",
   path: "/confidentialite",
diff --git a/app/pages/contact/card.vue b/app/pages/contact/card.vue
index 0fb22a4..060472f 100644
--- a/app/pages/contact/card.vue
+++ b/app/pages/contact/card.vue
@@ -102,7 +102,8 @@ const cardJsonLd = {
 
 usePageSeo({
   title: "Carte de visite — Simon Jouan",
-  description: "Fiche contact et QR code vCard de Simon Jouan, Développeur Full Stack TypeScript.",
+  description:
+    "Fiche contact et QR code vCard de Simon Jouan, Développeur Full Stack spécialisé en systèmes IA et automatisation métier.",
   path: "/contact/card",
   image: "/images/portrait.jpeg",
   type: "profile",
diff --git a/app/pages/contact/index.vue b/app/pages/contact/index.vue
index 77e0ece..972f6ef 100644
--- a/app/pages/contact/index.vue
+++ b/app/pages/contact/index.vue
@@ -3,13 +3,13 @@
     <section class="section">
       <div class="container">
         <div class="contact__grid">
-          <!-- Colonne gauche : en-tête + formulaire (story 7.1) -->
+          <!-- Colonne gauche : en-tête + formulaire (story 7.1 / story 12.6) -->
           <div class="contact__main">
             <p class="eyebrow"><span aria-hidden="true">// </span>contact</p>
-            <h1 class="contact__title">Parlons de votre projet</h1>
+            <h1 class="contact__title">Parlons de votre workflow</h1>
             <p class="prose contact__intro">
-              Une idée, un site à refaire, une automatisation à mettre en place ? Décrivez-moi le besoin — je réponds
-              sous 48h.
+              Décrivez-moi simplement le processus qui vous ralentit ou vous fait perdre du temps au quotidien. Je vous
+              réponds sous 48h avec une première analyse de faisabilité.
             </p>
 
             <!-- État « envoyé » : carte accent + ligne mono verte. role="status" + focus
@@ -43,29 +43,49 @@
                 />
                 <ZInput
                   v-model="form.email"
-                  label="Email"
+                  label="Email professionnel"
                   type="email"
-                  placeholder="vous@exemple.com"
+                  placeholder="vous@entreprise.com"
                   required
                   autocomplete="email"
                   :error="Boolean(errors.email)"
                   :hint="errors.email"
                 />
               </div>
+
+              <div class="contact__row">
+                <ZInput
+                  v-model="form.company"
+                  label="Entreprise"
+                  placeholder="Nom de votre structure"
+                  autocomplete="organization"
+                />
+                <ZInput
+                  v-model="form.frequency"
+                  label="Combien de fois ce process se répète-t-il ?"
+                  placeholder="Ex : quotidien, 10x par semaine…"
+                  autocomplete="off"
+                />
+              </div>
+
               <ZInput
-                v-model="form.subject"
-                label="Sujet"
-                placeholder="Site WordPress, application, IA…"
+                v-model="form.workflow"
+                label="Quel processus souhaitez-vous améliorer ?"
+                placeholder="Ex : qualification des leads, devis BTP, extraction de factures…"
+                required
                 autocomplete="off"
+                :error="Boolean(errors.workflow)"
+                :hint="errors.workflow"
               />
+
               <ZInput
-                v-model="form.message"
-                label="Message"
+                v-model="form.currentState"
+                label="Comment fonctionne-t-il aujourd’hui ?"
                 multiline
-                placeholder="Parlez-moi de votre projet…"
+                placeholder="Outils utilisés, étapes manuelles, qui intervient, où l’information se perd…"
                 required
-                :error="Boolean(errors.message)"
-                :hint="errors.message"
+                :error="Boolean(errors.currentState)"
+                :hint="errors.currentState"
               />
 
               <!-- Erreur d'envoi réseau (distincte des erreurs de validation par champ). -->
@@ -73,14 +93,14 @@
 
               <div>
                 <ZButton type="submit" variant="primary" size="lg" :disabled="sending">
-                  {{ sending ? "Envoi en cours…" : "Envoyer le message" }}
+                  {{ sending ? "Envoi en cours…" : "Décrire mon workflow" }}
                   <template #iconRight><ZIcon name="arrow" /></template>
                 </ZButton>
               </div>
 
               <p class="contact__rgpd">
-                En envoyant ce formulaire, vos nom, email, sujet et message sont transmis via Web3Forms à seule fin de
-                traiter votre demande. Consultez la
+                En envoyant ce formulaire, vos coordonnées et la description de votre workflow sont transmises via
+                Web3Forms à seule fin de qualifier votre besoin et vous répondre. Consultez la
                 <NuxtLink to="/confidentialite" class="contact__rgpd-link">politique de confidentialité</NuxtLink>.
               </p>
             </form>
@@ -146,7 +166,7 @@
 <script setup lang="ts">
 // Page Contact — colonne gauche : en-tête + formulaire (story 7.1, envoi Web3Forms,
 // service tiers SANS serveur). Colonne droite : infos + CTA terminal + socials (story 7.2).
-import { nextTick } from "vue";
+import { nextTick, reactive, ref, watch } from "vue";
 import { NuxtLink } from "#components";
 import { SITE } from "~/data/site";
 
@@ -160,8 +180,10 @@ const { open: openTerminal } = useTerminal();
 interface ContactForm {
   name: string;
   email: string;
-  subject: string;
-  message: string;
+  company: string;
+  workflow: string;
+  currentState: string;
+  frequency: string;
 }
 
 interface Web3FormsResponse {
@@ -174,9 +196,23 @@ const ERROR_MESSAGE = `L'envoi a échoué. Réessayez, ou écrivez-moi directeme
 // Clé Web3Forms injectée par l'env (NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY) — jamais en dur.
 const accessKey = useRuntimeConfig().public.web3formsAccessKey;
 
-const form = reactive<ContactForm>({ name: "", email: "", subject: "", message: "" });
+const form = reactive<ContactForm>({
+  name: "",
+  email: "",
+  company: "",
+  workflow: "",
+  currentState: "",
+  frequency: "",
+});
+
 // Message d'erreur par champ requis ("" = valide). Rendu sous le champ via ZInput.
-const errors = reactive({ name: "", email: "", message: "" });
+const errors = reactive({
+  name: "",
+  email: "",
+  workflow: "",
+  currentState: "",
+});
+
 const honeypot = ref("");
 const sent = ref(false);
 const sending = ref(false);
@@ -198,14 +234,15 @@ function validate(): boolean {
     : EMAIL_RE.test(form.email.trim())
       ? ""
       : "Cet email ne semble pas valide.";
-  errors.message = form.message.trim() ? "" : "Un message est requis.";
-  return !errors.name && !errors.email && !errors.message;
+  errors.workflow = form.workflow.trim() ? "" : "Veuillez préciser le processus à améliorer.";
+  errors.currentState = form.currentState.trim() ? "" : "Veuillez décrire le fonctionnement actuel.";
+  return !errors.name && !errors.email && !errors.workflow && !errors.currentState;
 }
 
 // Après un 1er envoi, re-valider à la saisie : corriger un champ lève son message d'erreur
 // sans attendre une nouvelle soumission.
 watch(
-  () => [form.name, form.email, form.message],
+  () => [form.name, form.email, form.workflow, form.currentState],
   () => {
     if (submitted.value) {
       validate();
@@ -244,8 +281,12 @@ async function onSubmit(): Promise<void> {
         access_key: accessKey,
         name: form.name.trim(),
         email: form.email.trim(),
-        subject: form.subject.trim() || "Nouveau message depuis jouan.ovh",
-        message: form.message.trim(),
+        company: form.company.trim(),
+        subject: `Qualification de workflow : ${form.workflow.trim() || "Nouveau projet"}`,
+        workflow: form.workflow.trim(),
+        current_state: form.currentState.trim(),
+        frequency: form.frequency.trim(),
+        message: `Processus à améliorer : ${form.workflow.trim()}\n\nFonctionnement actuel :\n${form.currentState.trim()}\n\nFréquence : ${form.frequency.trim() || "Non spécifiée"}\nEntreprise : ${form.company.trim() || "Non spécifiée"}`,
         botcheck: "",
       },
     });
@@ -267,9 +308,9 @@ const siteUrl = useSiteUrl();
 const contactJsonLd = {
   "@context": "https://schema.org",
   "@type": "ContactPage",
-  name: "Contact — jouan.ovh",
+  name: "Contact — Simon Jouan",
   description:
-    "Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h.",
+    "Parlons de votre workflow : décrivez le processus métier qui vous ralentit pour identifier les opportunités d'automatisation et d'agents IA adaptés.",
   url: `${siteUrl}/contact`,
   mainEntity: {
     "@type": "Person",
@@ -284,9 +325,9 @@ const contactJsonLd = {
 };
 
 usePageSeo({
-  title: "Contact — jouan.ovh",
+  title: "Contact — Simon Jouan",
   description:
-    "Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h.",
+    "Parlons de votre workflow : décrivez le processus métier qui vous ralentit pour identifier les opportunités d'automatisation et d'agents IA adaptés.",
   path: "/contact",
   image: "/images/portrait.jpeg",
   type: "website",
diff --git a/app/pages/index.vue b/app/pages/index.vue
index 7f84950..bd728b5 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -259,35 +259,26 @@
       </div>
     </section>
 
-    <!-- Bloc CTA final de conversion (Story 11.4 / AC-4) -->
+    <!-- Bloc CTA final de conversion (Story 12.6 / AC-2) -->
     <section class="section">
       <div class="container">
         <div class="cta">
-          <p class="eyebrow cta__eyebrow"><span aria-hidden="true">$ </span>./contact --start</p>
+          <p class="eyebrow cta__eyebrow"><span aria-hidden="true">$ </span>./workflow --inspect</p>
           <h2 class="cta__title">
-            Un projet en tête ?<br />
-            Mettons-le <span class="cta__highlight">en production</span>.
+            Quel process vous fait perdre du temps <span class="cta__highlight">chaque semaine</span> ?
           </h2>
           <p class="cta__subtitle">
-            Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript,
-            parlons-en.
+            Décrivez-moi simplement comment il fonctionne aujourd’hui. Je vous dirai ce qui mérite d’être automatisé, ce
+            qui doit rester humain et si l’IA apporte réellement quelque chose.
           </p>
           <div class="cta__actions">
             <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg" data-hot>
-              Discuter de votre projet
+              Identifier un workflow à automatiser
               <template #iconRight><ZIcon name="arrow" /></template>
             </ZButton>
-            <ZButton
-              v-if="SITE.profile.maltUrl"
-              :as="ZExternalLink"
-              :href="SITE.profile.maltUrl"
-              variant="secondary"
-              size="lg"
-              data-hot
-            >
-              Me contacter sur Malt
+            <ZButton as="a" :href="`mailto:${SITE.profile.email}`" variant="secondary" size="lg" data-hot>
+              M’écrire directement
             </ZButton>
-            <ZButton :as="NuxtLink" to="/about" variant="ghost" size="lg" data-hot> Voir le parcours &amp; CV </ZButton>
           </div>
         </div>
       </div>
@@ -440,7 +431,7 @@ const homeJsonLd = [
   {
     "@context": "https://schema.org",
     "@type": "WebSite",
-    name: "Simon Jouan — Développeur Full Stack TypeScript",
+    name: "Simon Jouan — Systèmes IA, agents & automatisation métier",
     url: siteUrl,
     description: SITE.profile.role,
   },
@@ -461,9 +452,9 @@ const homeJsonLd = [
 ];
 
 usePageSeo({
-  title: "Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS",
+  title: "Simon Jouan — Systèmes IA, agents & automatisation métier",
   description:
-    "Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL.",
+    "Développeur Full Stack spécialisé en systèmes IA et automatisation métier. Agents IA, intégrations, applications sur mesure et workflows mis en production.",
   path: "/",
   image: "/images/portrait.jpeg",
   type: "website",
diff --git a/app/pages/mentions-legales.vue b/app/pages/mentions-legales.vue
index baf3a9c..1990a55 100644
--- a/app/pages/mentions-legales.vue
+++ b/app/pages/mentions-legales.vue
@@ -95,7 +95,7 @@ import { usePageSeo } from "~/composables/usePageSeo";
 const profile = SITE.profile;
 
 usePageSeo({
-  title: "Mentions légales — jouan.ovh",
+  title: "Mentions légales — Simon Jouan",
   description: "Mentions légales, informations éditeur et hébergement du site jouan.ovh — Simon Jouan.",
   path: "/mentions-legales",
   type: "website",
diff --git a/docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md b/docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md
index e445d7b..c6c8864 100644
--- a/docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md
+++ b/docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md
@@ -4,7 +4,7 @@ baseline_commit: c1b8a200419751d2817144be71e60d508b413626
 
 # Story 12.6: Page À propos, CTA d'inspection de workflow, formulaire & SEO site-wide
 
-Status: ready-for-dev
+Status: review
 
 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
 
@@ -77,51 +77,84 @@ so that j'envoie une demande précise et pertinente (FR33, FR34, FR35, FR36, NFR
 
 ## Tasks / Subtasks
 
-- [ ] Tâche 1 — Refonte de la page À propos (`app/pages/about.vue`) (AC: 1, 4, 5)
-  - [ ] Mettre à jour la biographie hero en intégrant les paragraphes officiels sur les 12 ans de métrologie, la bascule dans le code et la culture QA.
-  - [ ] Insérer le bloc philosophie d'intervention sous forme de carte ou bloc stylisé (`ZCard` ou section typographique BEM).
-  - [ ] Mettre en valeur l'expérience Linkizz dans la timeline des expériences en explicitant l'apport de la QA à la conception d'agents fiables.
-  - [ ] Vérifier la consommation de `SITE.profile.role` et `SITE.profile.city`.
-  - [ ] Aligner les métadonnées SEO et le JSON-LD `aboutJsonLd` (`addressLocality: "France · Remote"`).
+- [x] Tâche 1 — Refonte de la page À propos (`app/pages/about.vue`) (AC: 1, 4, 5)
+  - [x] Mettre à jour la biographie hero en intégrant les paragraphes officiels sur les 12 ans de métrologie, la bascule dans le code et la culture QA.
+  - [x] Insérer le bloc philosophie d'intervention sous forme de carte ou bloc stylisé (`ZCard` ou section typographique BEM).
+  - [x] Mettre en valeur l'expérience Linkizz dans la timeline des expériences en explicitant l'apport de la QA à la conception d'agents fiables.
+  - [x] Vérifier la consommation de `SITE.profile.role` et `SITE.profile.city`.
+  - [x] Aligner les métadonnées SEO et le JSON-LD `aboutJsonLd` (`addressLocality: "France · Remote"`).
 
-- [ ] Tâche 2 — Mise à jour du CTA final global sur la Homepage et le Blog (AC: 2, 5)
-  - [ ] Dans `app/pages/index.vue`, remplacer le bloc CTA final actuel par la formulation officielle :
+- [x] Tâche 2 — Mise à jour du CTA final global sur la Homepage et le Blog (AC: 2, 5)
+  - [x] Dans `app/pages/index.vue`, remplacer le bloc CTA final actuel par la formulation officielle :
     - Eyebrow : `<span aria-hidden="true">$ </span>./workflow --inspect`
     - H2 : `Quel process vous fait perdre du temps chaque semaine ?`
     - Sous-titre : `Décrivez-moi simplement comment il fonctionne aujourd’hui. Je vous dirai ce qui mérite d’être automatisé, ce qui doit rester humain et si l’IA apporte réellement quelque chose.`

exec
/bin/zsh -lc 'wc -l docs/implementation-artifacts/code-reviews/12-6/full.diff' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     740 docs/implementation-artifacts/code-reviews/12-6/full.diff

codex
The diff is broader than a copy tweak: it changes contact form semantics, SEO, legal copy, CTAs, and the story artifact. I’m checking the remaining tail now and then I’ll turn it into a cynical findings list.
exec
/bin/zsh -lc "sed -n '1,380p' app/pages/about.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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

          <!-- Colonne droite : eyebrow + bio (1re personne, emphases sur les technologies) + bloc philosophie + stack -->
          <div class="about__bio">
            <h2 class="eyebrow"><span aria-hidden="true">// </span>à propos</h2>
            <p class="prose about__para">
              Je développe des produits et applications depuis plusieurs années, avec un parcours un peu atypique :
              <strong>douze ans dans la métrologie industrielle</strong> avant de passer au logiciel.
            </p>
            <p class="prose about__para">
              Cette première carrière m’a donné des réflexes qui me suivent encore aujourd’hui :
              <strong>mesurer, tracer, vérifier</strong> et ne pas considérer qu’un système est fiable simplement parce
              qu’il fonctionne une fois.
            </p>
            <p class="prose about__para">
              Aujourd’hui, je combine <strong>développement Full Stack</strong>, <strong>culture QA</strong> et
              <strong>IA appliquée</strong> pour transformer des processus métier manuels en systèmes logiciels
              réellement exploitables.
            </p>

            <!-- Bloc philosophie d'intervention (AC-1) -->
            <div class="about__philosophy">
              <p class="about__philo-intro">Je ne pars pas de « où mettre de l'IA ? ».</p>
              <p class="about__philo-lead">Je pars de :</p>
              <ul class="about__philo-list">
                <li>qu’est-ce qui prend du temps ?</li>
                <li>qu’est-ce qui se répète ?</li>
                <li>où l’information se perd-elle ?</li>
                <li>où une personne doit-elle recopier, rechercher ou interpréter ?</li>
                <li>qu’est-ce qui doit absolument rester sous contrôle humain ?</li>
              </ul>
              <p class="about__philo-outro">Ensuite seulement vient la solution technique.</p>
            </div>

            <!-- Stack technique (story 5.2) — sous la bio, conforme à About.jsx. ZTag = pill.
                 Liste sémantique (<ul>/<li>) pour annonce « liste de N éléments » aux lecteurs d'écran. -->
            <div class="about__stack">
              <h2 class="eyebrow eyebrow--muted"><span aria-hidden="true">// </span>stack</h2>
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
            <h2 class="eyebrow"><span aria-hidden="true">// </span>expériences</h2>
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
            <h2 class="eyebrow"><span aria-hidden="true">// </span>formation</h2>
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

// Expériences (de la plus récente à la plus ancienne).
// `org` sert de clé v-for stable (unique).
const experiences = [
  {
    date: "02/2021 — aujourd'hui",
    role: "Testeur QA & Développeur TypeScript",
    org: "Linkizz",
    desc: "Tests automatisés, fiabilisation applicative et conception de systèmes résilients — Node.js, TypeScript, TestCafé. L'expérience QA influence directement la conception d'agents fiables : reproductibilité, cas limites, observabilité.",
  },
  {
    date: "05/2020 — 12/2021",
    role: "Développeur Full Stack",
    org: "CINS",
    desc: "Développement d'applications web, APIs et intégrations sur-mesure, Docker.",
  },
  {
    date: "07/2007 — 05/2019",
    role: "Métrologue",
    org: "A+ Métrologie / Trescal",
    desc: "Technicien métrologue multi-grandeur, suppléant COFRAC électricité-magnétisme. 12 ans de métrologie industrielle : rigueur de mesure, traçabilité et validation méthodologique.",
  },
];

// Formation (data.js → S.degrees). `name` sert de clé v-for stable (unique).
const degrees = [
  { date: "2017 — 2018", name: "Développeur d'application — PHP / Symfony", school: "OpenClassrooms" },
  { date: "1999 — 2001", name: "BTS CIRA", school: "Lycée A. de Tocqueville, Cherbourg" },
];

// Métadonnées de la page. Voix 1re personne cohérente (cf. contrainte Langue & voix).
const pageTitle = "À propos — Simon Jouan";
const pageDescription =
  "Développeur Full Stack spécialisé en systèmes IA et automatisation métier. Parcours métrologie, culture QA et ingénierie logicielle au service de la fiabilité.";

const siteUrl = useSiteUrl();
const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: pageTitle,
  url: `${siteUrl}/about`,
  mainEntity: {
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
};

usePageSeo({
  title: pageTitle,
  description: pageDescription,
  path: "/about",
  image: "/images/portrait.jpeg",
  type: "profile",
  twitterCard: "summary",
  jsonLd: aboutJsonLd,
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / About.jsx */
// .section / .container / .eyebrow / .prose / .hero__tags sont des primitives de
// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
.about {
  display: block;
}

// Les libellés de section sont des <h2> (outline a11y navigable au lecteur d'écran),
// stylés en eyebrow. Neutralise le poids et l'interligne propres au <h2> pour un
// rendu strictement identique au <p class="eyebrow"> initial (line-height: inherit
// reproduit l'héritage du corps, comme le ferait un <p>).
.eyebrow {
  font-weight: var(--fw-regular);
  line-height: inherit;
}

// ---- Grille du hero (porté de About.jsx : grid-2 + gridTemplateColumns "0.8fr 1.2fr") ----
.about__grid {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  align-items: start;
  gap: var(--space-6);
}

// ---- Colonne gauche : identité ----
.about__name {
  margin: var(--space-5) 0 var(--space-1);
  font-family: var(--font-mono);
  font-size: var(--fs-3xl);
  font-weight: var(--fw-regular);
  line-height: var(--lh-tight);
  color: var(--text-strong);
}

.about__role {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--accent);
}

.about__location {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-4);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.about__cta {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-5);
}

// ---- Colonne droite : bio ----
.about__para {
  margin: 0 0 var(--space-4);
  font-size: var(--fs-md);

  &:last-child {
    margin-bottom: 0;
  }

  // Emphases sur les technologies (porté des <strong> d'About.jsx).
  strong {
    color: var(--text-strong);
  }

  // Lien externe keova.app (porté de l'<a> d'About.jsx) — couleur lien du DS,
  // soulignement au survol + ring de focus accessible (pas d'outline: none nu).
  a {
    color: var(--link);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }

    // Anneau de focus accent + outline transparent : ce dernier reste invisible
    // en rendu normal mais devient une couleur système en `forced-colors`
    // (High Contrast), où le box-shadow est neutralisé. A11y : focus toujours visible.
    &:focus-visible {
      outline: 2px solid transparent;
      outline-offset: 2px;
      border-radius: var(--radius-xs);
      box-shadow: var(--ring-accent);
    }
  }
}

// ---- Bloc Philosophie ----
.about__philosophy {
  margin: var(--space-6) 0;
  padding: var(--space-5);
  border: 1px solid var(--border-subtle);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius-md);
  background: var(--surface-1);
}

.about__philo-intro {
  margin: 0 0 var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  color: var(--text-strong);
}

.about__philo-lead {
  margin: 0 0 var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--text-muted);
}

.about__philo-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin: 0 0 var(--space-4);
  padding: 0;
  list-style: none;

  li {
    position: relative;
    padding-left: var(--space-5);
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    line-height: var(--lh-normal);
    color: var(--text-body);

    &::before {
      content: "→";
      position: absolute;
      left: 0;
      color: var(--accent);
    }
  }
}

.about__philo-outro {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-style: italic;
  color: var(--accent);
}

// ---- Stack (porté de About.jsx : bloc sous la bio) ----
// .hero__tags (rangée de chips) = primitive de layout globale (base/_layout.scss).
.about__stack {
  margin: var(--space-6) 0;
}

// ---- Section CV : grille expériences / formation (porté de About.jsx : 1.4fr / 0.6fr) ----
.about__cv {
  display: grid;
  grid-template-columns: 1.4fr 0.6fr;
  gap: var(--space-12);
}

// ---- Timeline d'expériences (porté de kit.css : .tl*) ----
// `margin-top` repris de l'inline JSX (<div class="tl" style="margin-top: var(--space-5)">).
// Rail vertical + points partagent un même axe (--tl-axis) et sont centrés dessus via
// translateX(-50%). Correction d'un défaut de la maquette : dans kit.css le point
// (left:-22px sur .tl__item, décalé du padding-left) tombait ~2px à droite du rail
// (left:5px sur .tl), les deux centres n'étant pas sur le même axe.
// Px restants = géométrie décorative fine (épaisseur 1px, point 11px, bord 2px,
// retraits verticaux 6px) sans équivalent dans l'échelle de tokens d'espacement.
.tl {
  // Axe du rail, mesuré depuis le bord gauche de .tl.
  --tl-axis: 5px;

  // <ol> : neutraliser puces/numéros et marges UA (reset : margin 0 0 16px 32px).
  position: relative;
  margin: var(--space-5) 0 0;
  padding-left: var(--space-6);
  list-style: none;
}

.tl::before {
  content: "";
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: var(--tl-axis);
  width: 1px;
  background: var(--border-default);
  transform: translateX(-50%);
}

.tl__item {

exec
/bin/zsh -lc "sed -n '621,780p' docs/implementation-artifacts/code-reviews/12-6/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     - CTA 1 : `Identifier un workflow à automatiser` (vers `/contact`) avec icône flèche droite
     - CTA 2 : `M’écrire directement` (vers `mailto:simon@jouan.ovh`)
-  - [ ] Dans `app/pages/blog/[...slug].vue`, harmoniser le CTA de fin d'article pour orienter vers la qualification de workflow.
+  - [x] Dans `app/pages/blog/[...slug].vue`, harmoniser le CTA de fin d'article pour orienter vers la qualification de workflow.
 
-- [ ] Tâche 3 — Réorientation du formulaire de contact vers la qualification de workflow (`app/pages/contact/index.vue`) (AC: 3, 5)
-  - [ ] Adapter l'en-tête et l'introduction de la page : `Parlons de votre workflow` et message d'accueil orienté gain de temps/process.
-  - [ ] Mettre à jour l'interface `ContactForm` :
+- [x] Tâche 3 — Réorientation du formulaire de contact vers la qualification de workflow (`app/pages/contact/index.vue`) (AC: 3, 5)
+  - [x] Adapter l'en-tête et l'introduction de la page : `Parlons de votre workflow` et message d'accueil orienté gain de temps/process.
+  - [x] Mettre à jour l'interface `ContactForm` :
     - `name: string`
     - `email: string`
     - `company: string`
     - `workflow: string` (Quel processus souhaitez-vous améliorer ?)
     - `currentState: string` (Comment fonctionne-t-il aujourd’hui ?)
     - `frequency?: string` (Combien de fois ce process se répète-t-il ?)
-  - [ ] Adapter le template du formulaire avec les composants `ZInput` (champs texte et multiligne) et les attributs d'accessibilité.
-  - [ ] Modifier le bouton de soumission : `Décrire mon workflow`.
-  - [ ] Adapter la fonction de validation `validate()` et l'envoi vers l'API Web3Forms (`body` avec clés explicites `name`, `email`, `company`, `workflow`, `current_state`, `frequency`, `message`).
-  - [ ] Mettre à jour le texte RGPD d'information sous le formulaire.
-
-- [ ] Tâche 4 — Harmonisation SEO transverse site-wide (`usePageSeo`) (AC: 4)
-  - [ ] Mettre à jour le titre et la description dans `app/pages/index.vue` : `Simon Jouan — Systèmes IA, agents & automatisation métier`.
-  - [ ] Mettre à jour le titre et la description dans `app/pages/about.vue`.
-  - [ ] Mettre à jour le titre et la description dans `app/pages/contact/index.vue` : `Contact — Simon Jouan`.
-  - [ ] Mettre à jour le titre dans `app/pages/blog/index.vue` : `Blog — Simon Jouan`.
-  - [ ] Vérifier et unifier les métadonnées dans `app/pages/confidentialite.vue` et `app/pages/mentions-legales.vue`.
-
-- [ ] Tâche 5 — Styles SCSS, responsive et accessibilité (AC: 5)
-  - [ ] Styliser le bloc philosophie sur `/about` en utilisant les tokens du Design System (`--bg-surface`, `--border-subtle`, `--accent`).
-  - [ ] Vérifier la disposition responsive du formulaire de contact sur mobile et desktop.
-  - [ ] Contrôler les contrastes, le focus visible (`:focus-visible`) et l'absence totale d'emoji.
-
-- [ ] Tâche 6 — Validation qualité Docker (AC: 6)
-  - [ ] Exécuter la gate de validation complète : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
-  - [ ] Vérifier 0 erreur ESLint / Stylelint, 0 erreur vue-tsc et la génération SSG Nitro sans avertissement.
+  - [x] Adapter le template du formulaire avec les composants `ZInput` (champs texte et multiligne) et les attributs d'accessibilité.
+  - [x] Modifier le bouton de soumission : `Décrire mon workflow`.
+  - [x] Adapter la fonction de validation `validate()` et l'envoi vers l'API Web3Forms (`body` avec clés explicites `name`, `email`, `company`, `workflow`, `current_state`, `frequency`, `message`).
+  - [x] Mettre à jour le texte RGPD d'information sous le formulaire.
+
+- [x] Tâche 4 — Harmonisation SEO transverse site-wide (`usePageSeo`) (AC: 4)
+  - [x] Mettre à jour le titre et la description dans `app/pages/index.vue` : `Simon Jouan — Systèmes IA, agents & automatisation métier`.
+  - [x] Mettre à jour le titre et la description dans `app/pages/about.vue`.
+  - [x] Mettre à jour le titre et la description dans `app/pages/contact/index.vue` : `Contact — Simon Jouan`.
+  - [x] Mettre à jour le titre dans `app/pages/blog/index.vue` : `Blog — Simon Jouan`.
+  - [x] Vérifier et unifier les métadonnées dans `app/pages/confidentialite.vue` et `app/pages/mentions-legales.vue`.
+
+- [x] Tâche 5 — Styles SCSS, responsive et accessibilité (AC: 5)
+  - [x] Styliser le bloc philosophie sur `/about` en utilisant les tokens du Design System (`--bg-surface`, `--border-subtle`, `--accent`).
+  - [x] Vérifier la disposition responsive du formulaire de contact sur mobile et desktop.
+  - [x] Contrôler les contrastes, le focus visible (`:focus-visible`) et l'absence totale d'emoji.
+
+- [x] Tâche 6 — Validation qualité Docker (AC: 6)
+  - [x] Exécuter la gate de validation complète : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
+  - [x] Vérifier 0 erreur ESLint / Stylelint, 0 erreur vue-tsc et la génération SSG Nitro sans avertissement.
+
+## Dev Agent Record
+
+### Implementation Plan
+- **Tâche 1 (Page À propos) :** Refonte de la bio (`about.vue`) avec mise en avant du parcours métrologie industrielle (12 ans) et culture QA au service de la robustesse des systèmes IA. Insertion du bloc philosophie d'intervention stylisé avec les tokens DS. Mise à jour de la timeline d'expériences (Linkizz et A+ Métrologie / Trescal) et alignement de `aboutJsonLd.addressLocality`.
+- **Tâche 2 (CTA final global) :** Refonte du CTA final sur `index.vue` avec le prompt `./workflow --inspect`, le H2 ciblant le gain de temps hebdomadaire et les boutons d'action. Harmonisation du CTA de fin d'article dans `blog/[...slug].vue`.
+- **Tâche 3 (Formulaire de contact) :** Transformation du formulaire sur `contact/index.vue` en formulaire de qualification de workflow métier (Nom, Email pro, Entreprise, Processus à améliorer, Fonctionnement actuel, Fréquence). Validation reactive et payload Web3Forms enrichi.
+- **Tâche 4 (SEO site-wide) :** Harmonisation des titres, méta-descriptions et JSON-LD Schema.org sur toutes les pages (`/`, `/about`, `/contact`, `/blog`, `/blog/[...slug]`, `/confidentialite`, `/mentions-legales`, `/contact/card`).
+- **Tâche 5 & 6 (Styles, a11y & Validation) :** Validation rigoureuse des tokens DS, de l'accessibilité a11y et exécution de la gate complète Docker (0 erreur ESLint, 0 erreur vue-tsc, build statique SSG Nitro de 24 routes / assets réussi).
+
+### Completion Notes
+- Page À propos (`about.vue`) refondue conformément à la charte et au brief : bio officielle, bloc philosophie d'intervention, valorisation de la QA (Linkizz) et de la métrologie dans la timeline.
+- CTA final sur `index.vue` et `blog/[...slug].vue` aligné sur `./workflow --inspect` et l'orientation gain de temps opérationnel.
+- Formulaire de contact (`contact/index.vue`) adapté pour la qualification de flux avec conservation du honeypot, focus accessible sur erreurs et transmission des champs détaillés à Web3Forms.
+- Titres SEO, descriptions et données structurées unifiés sur toutes les routes du site.
+- Validation Docker 100% verte : ESLint/Stylelint sans erreur, vérification de types TypeScript vue-tsc validée, pré-rendu statique SSG Nitro réussi.
+
+## File List
+
+- [MODIFY] [app/pages/about.vue](file:///Users/simon/dev/jouan.ovh/app/pages/about.vue)
+- [MODIFY] [app/pages/contact/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/contact/index.vue)
+- [MODIFY] [app/pages/contact/card.vue](file:///Users/simon/dev/jouan.ovh/app/pages/contact/card.vue)
+- [MODIFY] [app/pages/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue)
+- [MODIFY] [app/pages/blog/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/blog/index.vue)
+- [MODIFY] [app/pages/blog/[...slug].vue](file:///Users/simon/dev/jouan.ovh/app/pages/blog/%5B...slug%5D.vue)
+- [MODIFY] [app/pages/confidentialite.vue](file:///Users/simon/dev/jouan.ovh/app/pages/confidentialite.vue)
+- [MODIFY] [app/pages/mentions-legales.vue](file:///Users/simon/dev/jouan.ovh/app/pages/mentions-legales.vue)
+- [MODIFY] [docs/implementation-artifacts/sprint-status.yaml](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/sprint-status.yaml)
+- [MODIFY] [docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md)
+
+## Change Log
+
+- 2026-09-16 : Implémentation complète de la Story 12.6 — Refonte de la page À propos avec bloc philosophie et timeline métrologie/QA, CTA d'inspection de workflow sur la Homepage et le Blog, formulaire de qualification de workflow sur Contact, et harmonisation transverse du SEO et des données structurées Schema.org sur l'ensemble des 13 routes statiques. Gate Docker (lint, typecheck, SSG) verte à 100%.
 
 ## Dev Notes
 
@@ -133,15 +166,6 @@ so that j'envoie une demande précise et pertinente (FR33, FR34, FR35, FR36, NFR
 - **Zéro Emoji :** Règle stricte NFR6 / NFR13.
 - **Formulaire Web3Forms :** Conserve la clé injectée via `useRuntimeConfig().public.web3formsAccessKey`. Web3Forms accepte n'importe quelles propriétés additionnelles dans le corps JSON et les retransmet dans le corps du courriel.
 
-### Fichiers concernés
-- [MODIFY] [app/pages/about.vue](file:///Users/simon/dev/jouan.ovh/app/pages/about.vue)
-- [MODIFY] [app/pages/contact/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/contact/index.vue)
-- [MODIFY] [app/pages/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue)
-- [MODIFY] [app/pages/blog/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/blog/index.vue)
-- [MODIFY] [app/pages/blog/[...slug].vue](file:///Users/simon/dev/jouan.ovh/app/pages/blog/%5B...slug%5D.vue)
-- [MODIFY] [app/pages/confidentialite.vue](file:///Users/simon/dev/jouan.ovh/app/pages/confidentialite.vue)
-- [MODIFY] [app/pages/mentions-legales.vue](file:///Users/simon/dev/jouan.ovh/app/pages/mentions-legales.vue)
-
 ### Ce qui doit être préservé
 - Le fonctionnement du honeypot anti-spam (`honeypot` invisible pour les humains) sur le formulaire de contact.
 - L'annonce accessible `role="status"` et le focus sur la confirmation d'envoi.
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index d241058..78a6268 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -134,5 +134,5 @@ development_status:
   12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur: done
   12-4-homepage-vitrine-des-3-projets-phares: done
   12-5-page-services-restructuration-des-offres-et-process-4-etapes: done
-  12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide: ready-for-dev
+  12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide: review
   epic-12-retrospective: optional

exec
/bin/zsh -lc "sed -n '1,380p' app/pages/contact/index.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <main class="contact">
    <section class="section">
      <div class="container">
        <div class="contact__grid">
          <!-- Colonne gauche : en-tête + formulaire (story 7.1 / story 12.6) -->
          <div class="contact__main">
            <p class="eyebrow"><span aria-hidden="true">// </span>contact</p>
            <h1 class="contact__title">Parlons de votre workflow</h1>
            <p class="prose contact__intro">
              Décrivez-moi simplement le processus qui vous ralentit ou vous fait perdre du temps au quotidien. Je vous
              réponds sous 48h avec une première analyse de faisabilité.
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
                  label="Email professionnel"
                  type="email"
                  placeholder="vous@entreprise.com"
                  required
                  autocomplete="email"
                  :error="Boolean(errors.email)"
                  :hint="errors.email"
                />
              </div>

              <div class="contact__row">
                <ZInput
                  v-model="form.company"
                  label="Entreprise"
                  placeholder="Nom de votre structure"
                  autocomplete="organization"
                />
                <ZInput
                  v-model="form.frequency"
                  label="Combien de fois ce process se répète-t-il ?"
                  placeholder="Ex : quotidien, 10x par semaine…"
                  autocomplete="off"
                />
              </div>

              <ZInput
                v-model="form.workflow"
                label="Quel processus souhaitez-vous améliorer ?"
                placeholder="Ex : qualification des leads, devis BTP, extraction de factures…"
                required
                autocomplete="off"
                :error="Boolean(errors.workflow)"
                :hint="errors.workflow"
              />

              <ZInput
                v-model="form.currentState"
                label="Comment fonctionne-t-il aujourd’hui ?"
                multiline
                placeholder="Outils utilisés, étapes manuelles, qui intervient, où l’information se perd…"
                required
                :error="Boolean(errors.currentState)"
                :hint="errors.currentState"
              />

              <!-- Erreur d'envoi réseau (distincte des erreurs de validation par champ). -->
              <p v-if="submitError" class="contact__error" role="alert">{{ submitError }}</p>

              <div>
                <ZButton type="submit" variant="primary" size="lg" :disabled="sending">
                  {{ sending ? "Envoi en cours…" : "Décrire mon workflow" }}
                  <template #iconRight><ZIcon name="arrow" /></template>
                </ZButton>
              </div>

              <p class="contact__rgpd">
                En envoyant ce formulaire, vos coordonnées et la description de votre workflow sont transmises via
                Web3Forms à seule fin de qualifier votre besoin et vous répondre. Consultez la
                <NuxtLink to="/confidentialite" class="contact__rgpd-link">politique de confidentialité</NuxtLink>.
              </p>
            </form>
          </div>

          <!-- Colonne droite (story 7.2) : carte infos + carte CTA terminal + hexagones sociaux -->
          <div class="contact__info">
            <h2 class="screen-reader-text">Coordonnées et terminal</h2>
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

            <!-- Carte d'accès carte de visite digitale & QR Code -->
            <ZCard class="contact__cardcta">
              <p class="contact__cardcta-eyebrow"><span aria-hidden="true">// </span>carte de visite digitale</p>
              <p class="prose contact__cardcta-text">Fiche contact prête à scanner avec QR code vCard.</p>
              <ZButton :as="NuxtLink" to="/contact/card" variant="secondary" size="sm">
                <template #icon><ZIcon name="qr" /></template>
                Carte de visite &amp; QR Code
              </ZButton>
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
import { nextTick, reactive, ref, watch } from "vue";
import { NuxtLink } from "#components";
import { SITE } from "~/data/site";

// Infos de contact — source unique `app/data/site.ts`.
const contact = SITE.profile;

// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le header).
// no-op au prerender (aucun lanceur) → prerender-safe ; ouvre le terminal côté client.
const { open: openTerminal } = useTerminal();

interface ContactForm {
  name: string;
  email: string;
  company: string;
  workflow: string;
  currentState: string;
  frequency: string;
}

interface Web3FormsResponse {
  success: boolean;
  message: string;
}

const ERROR_MESSAGE = `L'envoi a échoué. Réessayez, ou écrivez-moi directement à ${SITE.profile.email}.`;

// Clé Web3Forms injectée par l'env (NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY) — jamais en dur.
const accessKey = useRuntimeConfig().public.web3formsAccessKey;

const form = reactive<ContactForm>({
  name: "",
  email: "",
  company: "",
  workflow: "",
  currentState: "",
  frequency: "",
});

// Message d'erreur par champ requis ("" = valide). Rendu sous le champ via ZInput.
const errors = reactive({
  name: "",
  email: "",
  workflow: "",
  currentState: "",
});

const honeypot = ref("");
const sent = ref(false);
const sending = ref(false);
const submitError = ref("");
// Passe à true au 1er envoi → active la re-validation live (les erreurs se lèvent à la saisie).
const submitted = ref(false);

const formRef = ref<HTMLFormElement | null>(null);
const sentCard = ref<{ $el: HTMLElement } | null>(null);

// Format email volontairement permissif (un @, un point dans le domaine) : on évite les
// faux négatifs d'une regex stricte ; Web3Forms revalide côté service.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(): boolean {
  errors.name = form.name.trim() ? "" : "Votre nom est requis.";
  errors.email = !form.email.trim()
    ? "Votre email est requis."
    : EMAIL_RE.test(form.email.trim())
      ? ""
      : "Cet email ne semble pas valide.";
  errors.workflow = form.workflow.trim() ? "" : "Veuillez préciser le processus à améliorer.";
  errors.currentState = form.currentState.trim() ? "" : "Veuillez décrire le fonctionnement actuel.";
  return !errors.name && !errors.email && !errors.workflow && !errors.currentState;
}

// Après un 1er envoi, re-valider à la saisie : corriger un champ lève son message d'erreur
// sans attendre une nouvelle soumission.
watch(
  () => [form.name, form.email, form.workflow, form.currentState],
  () => {
    if (submitted.value) {
      validate();
    }
  },
);

async function focusSentCard(): Promise<void> {
  await nextTick();
  sentCard.value?.$el?.focus();
}

async function onSubmit(): Promise<void> {
  submitted.value = true;
  submitError.value = "";

  if (!validate()) {
    // a11y : amener le focus sur le 1er champ invalide.
    await nextTick();
    formRef.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    return;
  }

  // Honeypot rempli = bot : on n'envoie rien et on affiche l'état de succès.
  if (honeypot.value) {
    sent.value = true;
    await focusSentCard();
    return;
  }

  sending.value = true;
  try {
    const res = await $fetch<Web3FormsResponse>("https://api.web3forms.com/submit", {
      method: "POST",
      body: {
        access_key: accessKey,
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        subject: `Qualification de workflow : ${form.workflow.trim() || "Nouveau projet"}`,
        workflow: form.workflow.trim(),
        current_state: form.currentState.trim(),
        frequency: form.frequency.trim(),
        message: `Processus à améliorer : ${form.workflow.trim()}\n\nFonctionnement actuel :\n${form.currentState.trim()}\n\nFréquence : ${form.frequency.trim() || "Non spécifiée"}\nEntreprise : ${form.company.trim() || "Non spécifiée"}`,
        botcheck: "",
      },
    });
    if (res.success) {
      sent.value = true;
      await focusSentCard();
    } else {
      submitError.value = ERROR_MESSAGE;
    }
  } catch {
    submitError.value = ERROR_MESSAGE;
  } finally {
    sending.value = false;
  }
}

const siteUrl = useSiteUrl();

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact — Simon Jouan",
  description:
    "Parlons de votre workflow : décrivez le processus métier qui vous ralentit pour identifier les opportunités d'automatisation et d'agents IA adaptés.",
  url: `${siteUrl}/contact`,
  mainEntity: {
    "@type": "Person",
    name: SITE.profile.name,
    email: SITE.profile.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.profile.city,
      addressCountry: "FR",
    },
  },
};

usePageSeo({
  title: "Contact — Simon Jouan",
  description:
    "Parlons de votre workflow : décrivez le processus métier qui vous ralentit pour identifier les opportunités d'automatisation et d'agents IA adaptés.",
  path: "/contact",
  image: "/images/portrait.jpeg",
  type: "website",
  jsonLd: contactJsonLd,
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / Contact.jsx */
// .section / .container / .eyebrow / .prose sont des primitives de layout globales
// (app/assets/scss/base/_layout.scss) — non redéclarées ici.
.contact {
  display: block;
}

// ---- Grille (porté de kit.css : .contact__grid 1fr / 0.8fr) ----
.contact__grid {
  display: grid;
  grid-template-columns: 1fr 0.8fr;
  gap: var(--space-12);
  align-items: start;
}

// ---- En-tête (porté de Contact.jsx) ----
.contact__title {
  margin-bottom: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-4xl);
  font-weight: var(--fw-light);
  line-height: var(--lh-tight);
  color: var(--text-strong);
}

.contact__intro {
  max-width: 48ch;
  margin-bottom: var(--space-8);
  color: var(--text-muted);
}

// ---- Formulaire (porté de kit.css : .contact__form) ----
.contact__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

// Rangée Nom + Email (porté de Contact.jsx : grid-2, gap space-4).
.contact__row {
  display: grid;
  grid-template-columns: 1fr 1fr;

codex
- The About page now claims a specialization in “systèmes IA et automatisation métier” without showing concrete project proof, client outcomes, or examples in the same section, so the positioning reads more asserted than demonstrated.

- The About bio removed the previous Keova co-founder mention, which was a strong credibility signal, and replaced it with more generic IA/QA positioning.

- The About page task says to verify consumption of `SITE.profile.city`, but the SEO description no longer uses the city and the implementation does not clearly preserve the locality angle outside the visible identity block and JSON-LD.

- The story expected `aboutJsonLd.addressLocality: "France · Remote"`, but the code still uses `SITE.profile.city`, so the acceptance note and implementation may not match.

- The About code comments still describe “emphases sur les technologies”, but the rewritten bio no longer names the actual stack there, making the comment stale and misleading.

- The new philosophy block uses a custom styled `div` rather than an existing card primitive, which may drift from the design system and duplicates card-like styling locally.

- The philosophy list removes native bullets and replaces them with decorative arrows, but the arrows are not hidden from assistive tech; screen readers may announce extra punctuation before each item.

- The contact form now asks for an “Email professionnel”, but validation accepts any email and the privacy policy says only “adresse email”, creating a mismatch between UI expectation, validation, and legal wording.

- The repeated use of “workflow” and “process” weakens the French-only voice requirement; “processus” would be clearer and more consistent with the rest of the French UI.

- The form no longer has a free-form “message” field, which may block prospects whose need does not fit the workflow framing, especially for maintenance, audit, bug fixing, or standard web projects.

- The Web3Forms payload duplicates the same information across explicit fields and the generated `message`, increasing email noise and making downstream processing harder.

- The generated Web3Forms `subject` includes raw user input from `workflow`, which could produce extremely long, messy, or awkward email subjects.

- Optional fields like `company` and `frequency` are always submitted as empty strings, which can create clutter in Web3Forms notifications instead of omitting absent data cleanly.

- The `ContactForm` interface makes `frequency` mandatory even though the story specifies it as optional, so the type model does not reflect the product requirement.

- The success message still says “Message envoyé” and “Je vous réponds très vite”, while the surrounding page promises a “première analyse de faisabilité sous 48h”; the post-submit confirmation should match the new workflow-qualification promise.

- The homepage CTA removes the Malt button and About/CV path, reducing trust and discovery options at the exact conversion point.

- The homepage secondary CTA uses a direct `mailto:` button instead of the project’s external-link/contact conventions, and it bypasses the newly redesigned qualification form the rest of the page is trying to promote.

- Blog article CTA copy changed to “Identifier un workflow”, which may feel unrelated on technical articles that are not about business automation or process improvement.

- `blogJsonLd.name` now uses `pageTitle` (`Blog — Simon Jouan`) instead of the visible blog name (`Notes de dev`), so structured data no longer matches the on-page identity.

- Legal and utility page titles were changed from `jouan.ovh` to `Simon Jouan`, while descriptions still reference `jouan.ovh`, creating inconsistent branding across SEO metadata.

- The privacy policy describes the new contact fields, but it does not clearly explain that the submitted workflow details may include business-process information, which could be more sensitive than an ordinary contact message.

- The story completion notes claim SSG succeeded for “24 routes / assets”, while the project DoD says the expected static generation is 13 routes; that discrepancy needs explanation or correction.

- The story marks responsive, contrast, focus, and visual checks as complete, but the diff provides no evidence of screenshots, viewport checks, or manual visual review despite the project’s explicit visual-review requirement.

- The story marks Docker validation as green, but the diff only records a claim; there is no captured command output or validation artifact to substantiate the gate.
tokens used
23 828
- The About page now claims a specialization in “systèmes IA et automatisation métier” without showing concrete project proof, client outcomes, or examples in the same section, so the positioning reads more asserted than demonstrated.

- The About bio removed the previous Keova co-founder mention, which was a strong credibility signal, and replaced it with more generic IA/QA positioning.

- The About page task says to verify consumption of `SITE.profile.city`, but the SEO description no longer uses the city and the implementation does not clearly preserve the locality angle outside the visible identity block and JSON-LD.

- The story expected `aboutJsonLd.addressLocality: "France · Remote"`, but the code still uses `SITE.profile.city`, so the acceptance note and implementation may not match.

- The About code comments still describe “emphases sur les technologies”, but the rewritten bio no longer names the actual stack there, making the comment stale and misleading.

- The new philosophy block uses a custom styled `div` rather than an existing card primitive, which may drift from the design system and duplicates card-like styling locally.

- The philosophy list removes native bullets and replaces them with decorative arrows, but the arrows are not hidden from assistive tech; screen readers may announce extra punctuation before each item.

- The contact form now asks for an “Email professionnel”, but validation accepts any email and the privacy policy says only “adresse email”, creating a mismatch between UI expectation, validation, and legal wording.

- The repeated use of “workflow” and “process” weakens the French-only voice requirement; “processus” would be clearer and more consistent with the rest of the French UI.

- The form no longer has a free-form “message” field, which may block prospects whose need does not fit the workflow framing, especially for maintenance, audit, bug fixing, or standard web projects.

- The Web3Forms payload duplicates the same information across explicit fields and the generated `message`, increasing email noise and making downstream processing harder.

- The generated Web3Forms `subject` includes raw user input from `workflow`, which could produce extremely long, messy, or awkward email subjects.

- Optional fields like `company` and `frequency` are always submitted as empty strings, which can create clutter in Web3Forms notifications instead of omitting absent data cleanly.

- The `ContactForm` interface makes `frequency` mandatory even though the story specifies it as optional, so the type model does not reflect the product requirement.

- The success message still says “Message envoyé” and “Je vous réponds très vite”, while the surrounding page promises a “première analyse de faisabilité sous 48h”; the post-submit confirmation should match the new workflow-qualification promise.

- The homepage CTA removes the Malt button and About/CV path, reducing trust and discovery options at the exact conversion point.

- The homepage secondary CTA uses a direct `mailto:` button instead of the project’s external-link/contact conventions, and it bypasses the newly redesigned qualification form the rest of the page is trying to promote.

- Blog article CTA copy changed to “Identifier un workflow”, which may feel unrelated on technical articles that are not about business automation or process improvement.

- `blogJsonLd.name` now uses `pageTitle` (`Blog — Simon Jouan`) instead of the visible blog name (`Notes de dev`), so structured data no longer matches the on-page identity.

- Legal and utility page titles were changed from `jouan.ovh` to `Simon Jouan`, while descriptions still reference `jouan.ovh`, creating inconsistent branding across SEO metadata.

- The privacy policy describes the new contact fields, but it does not clearly explain that the submitted workflow details may include business-process information, which could be more sensitive than an ordinary contact message.

- The story completion notes claim SSG succeeded for “24 routes / assets”, while the project DoD says the expected static generation is 13 routes; that discrepancy needs explanation or correction.

- The story marks responsive, contrast, focus, and visual checks as complete, but the diff provides no evidence of screenshots, viewport checks, or manual visual review despite the project’s explicit visual-review requirement.

- The story marks Docker validation as green, but the diff only records a claim; there is no captured command output or validation artifact to substantiate the gate.
