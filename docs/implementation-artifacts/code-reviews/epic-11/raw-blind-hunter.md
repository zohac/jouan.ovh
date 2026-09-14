Reading prompt from stdin...
2026-09-14T13:19:12.399195Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: high
reasoning summaries: none
session id: 01a0a012-5bcf-7c21-85fe-880a8a3e6a29
--------
user
# Blind Hunter Prompt — Epic 11

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/epic-11/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise `bmad-review-adversarial-general` pour examiner le diff avec une posture volontairement hostile et relever au moins dix problèmes concrets, sous forme de descriptions בלבד.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/bmad-review-adversarial-general/SKILL.md && printf '\\n--- DIFF ---\\n' && sed -n '1,260p' docs/implementation-artifacts/code-reviews/epic-11/full.diff" in /Users/simon/dev/jouan.ovh
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
diff --git a/.github/workflows/cd.yml b/.github/workflows/cd.yml
index 0969b79..9a73979 100644
--- a/.github/workflows/cd.yml
+++ b/.github/workflows/cd.yml
@@ -58,15 +58,20 @@ jobs:
           cp public/_headers .output/public/_headers
           cp public/CNAME .output/public/CNAME
 
-      # Garde-fou avant publication : la sortie statique doit contenir les pages,
-      # _headers, le CNAME du domaine custom et le portrait référencé par about.vue.
+      # Garde-fou avant publication : la sortie statique doit contenir toutes les pages,
+      # _headers, le CNAME du domaine custom, le portrait et la clé Web3Forms sur push main.
       - name: Verify static output
+        env:
+          NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY: ${{ secrets.NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY || vars.NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY }}
         run: |
           set -euo pipefail
-          for f in index.html 200.html 404.html about/index.html blog/index.html _headers CNAME images/portrait_512x512_drip_art_8.webp; do
+          for f in index.html 200.html 404.html services/index.html about/index.html blog/index.html contact/index.html confidentialite/index.html mentions-legales/index.html _headers CNAME images/portrait_512x512_drip_art_8.webp; do
             test -f ".output/public/$f" || { echo "::error::Fichier manquant dans la sortie statique : $f"; exit 1; }
           done
           grep -qx "jouan.ovh" .output/public/CNAME || { echo "::error::CNAME ne contient pas le domaine custom attendu"; exit 1; }
+          if [ "${{ github.event_name }}" = "push" ]; then
+            test -n "${NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY:-}" || { echo "::error::NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY manquant pour le déploiement de production"; exit 1; }
+          fi
           echo "Sortie statique validée."
 
       - name: Deploy
diff --git a/AGENTS.md b/AGENTS.md
new file mode 100644
index 0000000..f44dffa
--- /dev/null
+++ b/AGENTS.md
@@ -0,0 +1,171 @@
+# AGENTS.md — Directives & Contexte Projet pour Agents IA
+
+Ce document constitue la **source de vérité universelle** pour tout agent IA (Claude, Gemini, Antigravity, BMAD, Cursor, Windsurf, Copilot, etc.) intervenant sur le dépôt **jouan.ovh**. Il consigne les règles critiques, l'architecture, l'environnement de développement et les invariants non négociables du projet.
+
+---
+
+## 1. Identité & État du Projet
+
+- **Projet :** `jouan.ovh` — Portfolio, vitrine de services et blog de **Simon Jouan** (développeur web freelance).
+- **URL de production :** [`https://jouan.ovh`](https://jouan.ovh) (déployé sur **GitHub Pages**, domaine custom, HTTPS Let's Encrypt forcé, DNS OVH).
+- **Statut actuel :** **Refonte complète livrée et active en production** (Epics 1 à 10 validés et clôturés). Le projet est en phase d'**exploitation, maintenance et évolutions ciblées (Run)**.
+- **Langue & Voix (NFR6) :** 
+  - Interface et contenu en **FRANÇAIS** (`lang="fr"`).
+  - Voix : **1re personne (« je »)** pour Simon, **vouvoiement** pour le visiteur/client.
+  - **ZÉRO EMOJI** dans le contenu et l'UI (univers sobre et professionnel inspiré du terminal).
+
+---
+
+## 2. Règle d'Or d'Environnement : Docker Uniquement ⚠️
+
+**L'intégralité du développement et de l'outillage DOIT s'exécuter dans le conteneur Docker.**
+
+> ⚠️ **Ne JAMAIS exécuter `pnpm`, `npm`, `yarn` ou `nuxi` directement sur la machine hôte.**
+> Les dépendances natives (`better-sqlite3`, `esbuild`, `sharp`...) sont compilées pour Linux dans un volume Docker isolé nommé `node_modules`. Exécuter des commandes sur l'hôte (macOS arm64) corromprait l'environnement.
+
+### Commandes usuelles via Docker :
+
+```sh
+# Démarrer le serveur de développement (http://localhost:3000)
+docker compose up
+
+# Arrêter les conteneurs
+docker compose down
+
+# Lancer la suite de validation complète (Gate obligatoire avant commit)
+docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
+
+# Commandes ponctuelles
+docker compose run --rm web sh -c "corepack enable && pnpm lint"       # eslint + stylelint
+docker compose run --rm web sh -c "corepack enable && pnpm typecheck"  # vérification TypeScript vue-tsc
+docker compose run --rm web sh -c "corepack enable && pnpm generate"   # build statique SSG (13 routes)
+docker compose run --rm web sh -c "corepack enable && pnpm add -D <pkg>" # ajout de dépendance
+```
+
+*Note SQLite / `@nuxt/content` :* Lancer `pnpm generate` dans un conteneur séparé pendant que le serveur dev tourne peut invalider la base de contenu SQLite du dev. Si `/blog` affiche une erreur en dev, exécuter `docker compose restart web`.
+
+---
+
+## 3. Stack Technique & Versions
+
+- **Framework :** Nuxt 4 (`^4.4.8`), SSR activé, cible de build **statique** (`nuxi generate` via Nitro).
+- **Structure applicative :** Tout le code Nuxt vit sous **`app/`** (`srcDir = "app"` dans `nuxt.config.ts`).
+- **UI / Composants :** Vue 3 avec **`<script setup lang="ts">`** obligatoire pour tout nouveau composant. (Plus aucun décorateur de classe ; le terminal a été intégralement migré en `script setup`).
+- **Langage :** TypeScript `^6.0.3` en mode strict.
+- **Styles :** SCSS (`sass ^1.101.0`) avec `@use ... as _alias` (jamais `@import`).
+- **Tokens & Design System :** Dark-first (pas de mode clair). Tokens CSS custom properties exposés globalement sur `:root` dans `app/assets/scss/abstract/_root.scss`. Consommation via `var(--token)`.
+- **Contenu :** `@nuxt/content ^3.14.0` (v3, stockage SQLite, collections typées dans `content.config.ts`).
+- **Images :** `@nuxt/image ^2.0.0` (`<NuxtImg>` / `<NuxtPicture>`), jamais de balise `<img>` brute.
+- **Linters :** ESLint 10 (flat config `@nuxt/eslint`), Prettier 3, Stylelint 17 (`stylelint-scss`).
+- **Formulaire de contact :** Web3Forms (service tiers sans serveur), clé publique lue via `useRuntimeConfig().public.web3formsAccessKey`.
+- **CI/CD :** GitHub Actions (`.github/workflows/cd.yml`) publiant automatiquement `.output/public` vers la branche `gh-pages` lors d'un push sur `main`.
+
+---
+
+## 4. Architecture & Arborescence Clé
+
+```text
+jouan.ovh/
+├── app/
+│   ├── assets/scss/
+│   │   ├── abstract/        # Tokens, variables, mixins (_root.scss = source vérité CSS vars)
+│   │   ├── base/            # _reset.scss, _layout.scss (primitives globales), _motion.scss
+│   │   └── main.scss        # Point d'entrée SCSS global
+│   ├── components/
+│   │   ├── ui/              # Primitives DS auto-importées sans préfixe (ZButton, ZCard, ZExternalLink...)
+│   │   ├── card/            # Sous-blocs ZCardHeader, ZCardBody, ZCardFooter
+│   │   ├── terminal/        # Sous-système terminal draggable (TerminalComponent, TerminalManagerComponent)
+│   │   │   └── programs/    # Classes TypeScript pures implémentant IProgram
+│   │   ├── HeaderComponent.vue
+│   │   ├── FooterComponent.vue
+│   │   └── HexagonLinkComponent.vue
+│   ├── composables/
+│   │   ├── useSiteUrl.ts    # Source unique pour l'URL de base résolue via runtimeConfig
+│   │   └── usePageSeo.ts    # Helper universel useSeoMeta, canonical et Schema.org / JSON-LD
+│   ├── data/
+│   │   └── site.ts          # SOURCE UNIQUE de vérité pour le profil, compétences et projets (SITE)
+│   ├── layouts/
+│   │   └── default.vue      # Layout principal
+│   └── pages/               # 13 routes statiques pré-rendues
+│       ├── index.vue        # Accueil (Hero terminal, aperçu services, projets phares)
+│       ├── services.vue     # Offres de freelance et déroulé du process en 4 étapes
+│       ├── about.vue        # Biographie, timeline expériences/formations et stack
+│       ├── contact.vue      # Formulaire de contact Web3Forms et coordonnées
+│       ├── confidentialite.vue # Politique de confidentialité RGPD
+│       ├── mentions-legales.vue# Mentions légales
+│       └── blog/
+│           ├── index.vue    # Liste des articles du blog
+│           └── [...slug].vue# Rendu Markdown d'article via <ContentRenderer>
+├── content/
+│   └── blog/                # Articles de blog au format Markdown
+├── content.config.ts        # Schéma et validation Zod des collections @nuxt/content
+├── nuxt.config.ts           # Configuration centrale Nuxt 4
+├── public/
+│   ├── CNAME                # Domaine de production officiel (contient "jouan.ovh")
+│   ├── _headers             # En-têtes HTTP de sécurité pour gh-pages
+│   └── images/              # Assets statiques optimisés
+├── .github/workflows/cd.yml # Pipeline CI/CD GitHub Actions
+└── docs/                    # Documentation projet, specs, artifacts de planning et d'implémentation
+```
+
+---
+
+## 5. Invariants & Règles d'Implémentation Critiques
+
+### 1. URLs et Domaines : Jamais de Hardcoding
+- **Règle :** Ne **JAMAIS** écrire en dur `https://jouan.ovh` ou `https://dev.jouan.ovh` dans le code applicatif ou les métadonnées.
+- **Pattern :** Toujours injecter l'URL via le composable `useSiteUrl()`. Ce composable lit `runtimeConfig.public.siteUrl` (surchargeable par la variable d'environnement `NUXT_PUBLIC_SITE_URL`).
+- **SEO :** Utiliser systématiquement `usePageSeo({ title, description, path, ... })` pour garantir l'unicité des canonicals et des balises OpenGraph/Twitter.
+
+### 2. Contenu Partagé : DRY Strict
+- **Règle :** Ne **JAMAIS** re-hardcoder le nom, la bio, la ville, l'email ou les projets dans une page ou un programme terminal.
+- **Pattern :** Consommer `SITE.profile`, `SITE.skills` ou `SITE.projects` depuis `app/data/site.ts`.
+
+### 3. Tokens & Primitives de Layout SCSS
+- **No Hardcode :** Aucune couleur, rayon, ombre ou marge en dur. Toujours consommer les variables globales `var(--token)`.
+- **Primitives globales :** Les classes de mise en page `.section`, `.section--sunken`, `.container`, `.eyebrow`, `.prose`, `.hero__tags` vivent dans `app/assets/scss/base/_layout.scss`. **Ne JAMAIS les redéclarer dans un `<style scoped>` de page**.
+- **Piège du padding multi-classes :** Lorsqu'un élément cumule `.container` et une classe locale (ex. `.hero__in.container`), ne **JAMAIS** utiliser le raccourci `padding: ...`. Utiliser impérativement les propriétés logiques **`padding-inline`** et **`padding-block`** pour éviter l'écrasement mutuel des axes.
+
+### 4. Accessibilité (a11y) dès la Conception
+- **Liens externes :** TOUT lien ouvrant un nouvel onglet (`target="_blank"`) DOIT utiliser la primitive **`<ZExternalLink>`** (`app/components/ui/ZExternalLink.vue`). Elle impose `rel="noopener"` et injecte le libellé masqué accessible `(ouvre dans un nouvel onglet)`.
+- **Hiérarchie de titres :** Tout libellé de section eyebrow ouvrant une section sans titre h2 propre doit être un **`<h2 class="eyebrow">`** (le style neutralisé hérite de `font-weight`/`line-height` pour une parité visuelle stricte). Les préfixes décoratifs `// ` doivent être encapsulés dans `<span aria-hidden="true">// </span>`.
+- **Séquences :** Toute répétition de cartes ou étapes doit être balisée en listes sémantiques **`<ul>` ou `<ol>` avec `<li>`** (avec `> li { display: flex }` si cartes flex).
+- **Contraste forcé (`forced-colors`) :** Tout élément interactif au focus doit intégrer le repli inline standard `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` pour rester visible en mode contraste élevé système.
+- **Motion réduit :** Respect universel de `prefers-reduced-motion: reduce`. Le caret natif du terminal est la **seule animation en boucle autorisée** sur le site (CAP-11). Les carets décoratifs doivent être figés visibles.
+- **Raccourcis clavier :** La touche `Échap` ferme la fenêtre terminal et restitue automatiquement le focus à l'élément déclencheur.
+
+### 5. Nuxt 4 Gotchas
+- **`<component :is="...">` :** Passer un nom de composant en chaîne de caractères (`:is="'NuxtLink'"`) **ne résout pas** l'auto-import Nuxt. Il faut importer explicitement la référence depuis `#components` (`import { NuxtLink } from "#components"`) et la lier comme valeur.
+- **Prerender compatibility :** Le site étant statique, aucun accès direct à `window`, `document` ou `localStorage` n'est toléré en dehors du hook `onMounted` ou d'une garde `import.meta.client`.
+- **Génération d'IDs :** Toujours utiliser `useId()` de Nuxt/Vue pour générer des attributs `id` de formulaires hydration-safe.
+
+### 6. Pipeline CI/CD & Déploiement
+- Le fichier `public/CNAME` contient **`jouan.ovh`**. Ne jamais le modifier ou le supprimer.
+- Le step `Verify static output` dans `.github/workflows/cd.yml` vérifie `grep -qx "jouan.ovh" .output/public/CNAME`. Tout changement de domaine doit être répercuté simultanément sur ces deux fichiers.
+
+---
+
+## 6. Checklist de Validation Qualité (Definition of Done)
+
+Avant de soumettre tout changement ou de clore une tâche, l'agent IA doit exécuter et valider :
+
+1. **Gate Docker verte à 100 % :**
+   ```sh
+   docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
+   ```
+   - 0 erreur ESLint / Stylelint.
+   - 0 erreur TypeScript vue-tsc.
+   - 13 routes pré-rendues statiquement avec succès par Nitro.
+2. **Vérification visuelle & comportementale :**
+   - Rendu fidèle au Design System (thème sombre aubergine, orange accent, typographie Ubuntu).
+   - Navigation clavier fonctionnelle (focus visible, ordre logique).
+   - Pas de valeurs CSS en dur non justifiées.
+
+---
+
+## 7. Documents de Référence Complémentaires
+
+- [`docs/project-context.md`](file:///Users/simon/dev/jouan.ovh/docs/project-context.md) : Historique détaillé, leçons apprises par épic et règles fines.
+- [`docs/implementation-artifacts/sprint-status.yaml`](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/sprint-status.yaml) : Registre officiel des stories et de leur statut.
+- [`docs/planning-artifacts/epics.md`](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md) : Cahier des charges et critères d'acceptation des Epics 1 à 10.
+- [`docs/implementation-artifacts/deferred-work.md`](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/deferred-work.md) : Inventaire des arbitrages et améliorations futures optionnelles.
diff --git a/app/components/CurrentTime.vue b/app/components/CurrentTime.vue
index c459483..5b21631 100644
--- a/app/components/CurrentTime.vue
+++ b/app/components/CurrentTime.vue
@@ -1,32 +1,49 @@
 <template>
-  <div class="current-time">
-    {{ currentTime }}
-  </div>
+  <time class="current-time" :datetime="currentTimeIso" :aria-label="timeAriaLabel">
+    <span class="current-time__hours">{{ hours }}</span>
+    <span class="current-time__colon" aria-hidden="true">:</span>
+    <span class="current-time__minutes">{{ minutes }}</span>
+  </time>
 </template>
 
 <script lang="ts" setup>
 import type { Ref } from "vue";
-import { onMounted, onUnmounted, ref } from "vue";
+import { computed, onMounted, onUnmounted, ref } from "vue";
+import { SITE } from "~/data/site";
 
-defineComponent({
-  name: "CurrentTime",
-});
+const hours = ref("--");
+const minutes = ref("--");
+const currentTimeIso = ref("");
 
-const currentTime = ref("");
+const timeAriaLabel = computed(() => {
+  if (hours.value === "--") {
+    return "Heure locale";
+  }
+  return `Heure locale (${SITE.profile.city}) : ${hours.value}h${minutes.value}`;
+});
 
 function updateTime() {
   const now = new Date();
-  currentTime.value = now.toLocaleTimeString(undefined, {
+  const parts = new Intl.DateTimeFormat("en-GB", {
     hour: "2-digit",
     minute: "2-digit",
-  });
+    hour12: false,
+    timeZone: "Europe/Paris",
+  }).formatToParts(now);
+
+  const hourPart = parts.find((p) => p.type === "hour")?.value ?? "";
+  const minutePart = parts.find((p) => p.type === "minute")?.value ?? "";
+
+  hours.value = hourPart.padStart(2, "0");
+  minutes.value = minutePart.padStart(2, "0");
+  currentTimeIso.value = now.toISOString();
 }

exec
/bin/zsh -lc "sed -n '261,620p' docs/implementation-artifacts/code-reviews/epic-11/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
 
 const interval: Ref<ReturnType<typeof setInterval> | null> = ref(null);
 
 onMounted(() => {
   updateTime();
-  interval.value = setInterval(updateTime, 15000);
+  interval.value = setInterval(updateTime, 1000);
 });
 
 onUnmounted(() => {
@@ -37,7 +54,19 @@ onUnmounted(() => {
 </script>
 
 <style scoped lang="scss">
+/* stylelint-disable selector-class-pattern -- convention BEM */
 .current-time {
-  /* Ajoutez ici les styles pour personnaliser l'apparence de l'heure */
+  display: inline-flex;
+  align-items: center;
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  font-variant-numeric: tabular-nums;
+  letter-spacing: var(--ls-wide);
+  color: var(--text-muted);
+}
+
+.current-time__colon {
+  display: inline-block;
+  margin: 0 1px;
 }
 </style>
diff --git a/app/components/FooterComponent.vue b/app/components/FooterComponent.vue
index febe415..7750761 100644
--- a/app/components/FooterComponent.vue
+++ b/app/components/FooterComponent.vue
@@ -4,10 +4,10 @@
       <div class="ftr__in">
         <div class="ftr__brand-col">
           <NuxtLink to="/" class="ftr__brand">
-            <ZIcon name="gem" class="ftr__logo" />
-            <b>jouan.ovh</b>
+            <NuxtImg src="/images/logo_white.png" alt="" class="ftr__logo" width="22" height="22" />
+            <span><b>jouan</b><span class="dim">.ovh</span></span>
           </NuxtLink>
-          <p class="ftr__tagline">Développeur web freelance. Valognes, France.</p>
+          <p class="ftr__tagline">{{ profile.role }}. {{ profile.city }}.</p>
         </div>
 
         <nav class="ftr__col" aria-label="Navigation du pied de page">
@@ -17,14 +17,14 @@
 
         <div class="ftr__col">
           <h2 class="ftr__title">// Projets</h2>
-          <ZExternalLink
-            v-for="project in projects"
-            :key="project.url"
-            :href="project.url"
-            rel="noopener noreferrer"
-            class="ftr__link"
-            >{{ project.name }}</ZExternalLink
-          >
+          <ul class="ftr__list">
+            <li v-for="project in projects" :key="project.name">
+              <ZExternalLink v-if="project.url" :href="project.url" rel="noopener noreferrer" class="ftr__link">{{
+                project.name
+              }}</ZExternalLink>
+              <span v-else class="ftr__link ftr__link--static">{{ project.name }}</span>
+            </li>
+          </ul>
         </div>
 
         <div class="ftr__col">
@@ -32,8 +32,11 @@
           <LinkListComponent />
         </div>
       </div>
+    </div>
 
-      <div class="ftr__bottom">
+    <!-- Barre basse pleine largeur (border-top 100% de la fenêtre) -->
+    <div class="ftr__bottom-bar">
+      <div class="ftr__container ftr__bottom">
         <span>© {{ year }} Simon Jouan — jouan.ovh</span>
         <span class="ftr__term">anon.@jouan.ovh:~$ <span class="ftr__cmd">echo "merci de votre visite"</span></span>
       </div>
@@ -55,6 +58,7 @@ const navItems = [
   { to: "/mentions-legales", label: "Mentions légales" },
 ];
 
+const profile = SITE.profile;
 // Projets — source unique `app/data/site.ts` (le footer n'affiche que nom + URL).
 const projects = SITE.projects;
 
@@ -64,10 +68,12 @@ const year = new Date().getFullYear();
 <style lang="scss" scoped>
 /* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis Footer.jsx/kit.css */
 .ftr {
+  position: relative;
+  z-index: 10;
   margin-top: auto;
   background: var(--surface-1);
   border-top: 1px solid var(--border-subtle);
-  padding: var(--space-12) 0 var(--space-8);
+  padding: var(--space-12) 0 0;
 }
 
 .ftr__container {
@@ -92,13 +98,16 @@ const year = new Date().getFullYear();
 .ftr__brand {
   display: inline-flex;
   align-items: center;
-  gap: var(--space-2);
+  gap: var(--space-3);
   margin-bottom: var(--space-3);
   text-decoration: none;
 
   .ftr__logo {
-    font-size: 22px;
-    color: var(--accent);
+    display: block;
+    width: 22px;
+    height: 22px;
+    object-fit: contain;
+    filter: drop-shadow(0 2px 4px color-mix(in srgb, var(--surface-0) 60%, transparent));
   }
 
   b {
@@ -108,6 +117,10 @@ const year = new Date().getFullYear();
     color: var(--text-strong);
   }
 
+  .dim {
+    color: var(--text-muted);
+  }
+
   // Lien focusable (logo + nom) : anneau DS cohérent avec le reste du châssis.
   &:focus-visible {
     outline: 2px solid transparent; // forced-colors : rendu en couleur système
@@ -120,7 +133,7 @@ const year = new Date().getFullYear();
 .ftr__tagline {
   margin: 0;
   font-size: var(--fs-sm);
-  color: var(--text-muted);
+  color: var(--text-body);
 }
 
 .ftr__col {
@@ -132,10 +145,18 @@ const year = new Date().getFullYear();
   margin: 0 0 var(--space-3);
   font-family: var(--font-mono);
   font-size: var(--fs-xs);
-  font-weight: var(--fw-regular);
+  font-weight: var(--fw-medium);
   letter-spacing: var(--ls-wider);
   text-transform: uppercase;
-  color: var(--text-muted);
+  color: var(--accent);
+}
+
+.ftr__list {
+  display: flex;
+  flex-direction: column;
+  padding: 0;
+  margin: 0;
+  list-style: none;
 }
 
 .ftr__link {
@@ -143,12 +164,15 @@ const year = new Date().getFullYear();
   padding: var(--space-1) 0;
   font-family: var(--font-mono);
   font-size: var(--fs-sm);
-  color: var(--text-body);
+  color: var(--text-strong);
   text-decoration: none;
-  transition: color var(--dur-fast) var(--ease-standard);
+  transition:
+    color var(--dur-fast) var(--ease-standard),
+    transform var(--dur-fast) var(--ease-standard);
 
   &:hover {
     color: var(--accent);
+    transform: translateX(2px);
   }
 
   // Anneau de focus DS (les liens du footer n'avaient que l'outline UA par défaut).
@@ -158,6 +182,22 @@ const year = new Date().getFullYear();
     border-radius: var(--radius-xs);
     box-shadow: var(--ring-accent);
   }
+
+  &--static {
+    color: var(--text-body);
+    cursor: default;
+
+    &:hover {
+      color: var(--text-body);
+      transform: none;
+    }
+  }
+}
+
+.ftr__bottom-bar {
+  width: 100%;
+  margin-top: var(--space-8);
+  border-top: 1px solid var(--border-default);
 }
 
 .ftr__bottom {
@@ -165,24 +205,22 @@ const year = new Date().getFullYear();
   flex-wrap: wrap;
   gap: var(--space-3);
   justify-content: space-between;
-  margin-top: var(--space-8);
-  padding-top: var(--space-5);
+  align-items: center;
+  padding-block: var(--space-5);
   font-family: var(--font-mono);
   font-size: var(--fs-xs);
-
-  // Contraste (story 9.2) : --text-faint (~3:1 sur la surface footer) → --text-muted
-  // pour une ligne de copyright lisible (≥ 4.5:1). Token, pas de couleur en dur.
-  color: var(--text-muted);
-  border-top: 1px solid var(--border-subtle);
+  color: var(--text-body);
 }
 
 .ftr__cmd {
   color: var(--term-green);
+  font-weight: var(--fw-medium);
 }
 
 @media (prefers-reduced-motion: reduce) {
   .ftr__link {
     transition: none;
+    transform: none !important;
   }
 }
 </style>
diff --git a/app/components/HeaderComponent.vue b/app/components/HeaderComponent.vue
index b2301e9..3371e17 100644
--- a/app/components/HeaderComponent.vue
+++ b/app/components/HeaderComponent.vue
@@ -1,9 +1,10 @@
 <template>
-  <header class="hdr">
+  <header class="hdr" :class="{ 'hdr--stuck': isScrolled }">
+    <div class="hdr__progress" :style="{ width: `${scrollProgress}%` }" aria-hidden="true" />
     <div class="hdr__in">
-      <NuxtLink to="/" class="hdr__brand" @click="closeMenu">
-        <ZIcon name="gem" class="hdr__logo" />
-        <b>jouan.ovh</b>
+      <NuxtLink to="/" class="hdr__brand" @click="onBrandClick">
+        <NuxtImg src="/images/logo_white.png" alt="" class="hdr__logo" width="24" height="24" />
+        <span class="hdr__brand-text"><b>jouan</b><span class="dim">.ovh</span></span>
       </NuxtLink>
 
       <nav class="hdr__nav" aria-label="Navigation principale">
@@ -15,14 +16,13 @@
           :class="{ 'hdr__link--active': isActive(item.to) }"
           :aria-current="isActive(item.to) ? 'page' : undefined"
         >
-          {{ item.label }}
+          <span class="hdr__link-prefix" aria-hidden="true">{{ item.prefix }} </span>
+          <span class="hdr__link-label">{{ item.label }}</span>
         </NuxtLink>
       </nav>
 
       <div class="hdr__right">
-        <CurrentTime class="hdr__clock" />
-        <ZBadge tone="success" dot class="hdr__badge">Disponible</ZBadge>
-        <ZButton variant="terminal" size="sm" class="hdr__action" @click="addNewTerminal">
+        <ZButton variant="terminal" size="sm" class="hdr__action hdr__action--terminal" @click="addNewTerminal">
           <template #icon><ZIcon name="terminal" /></template>
           Terminal
         </ZButton>
@@ -44,6 +44,15 @@
       </div>
     </div>
 
+    <!-- Dock d'état tout à droite de l'écran (hors container centré) -->
+    <div class="hdr__dock-right" aria-label="Statut et heure">
+      <div class="hdr__status-badge">
+        <span class="hdr__status-dot" aria-hidden="true" />
+        <span class="hdr__status-text">Disponible</span>
+      </div>
+      <CurrentTime class="hdr__dock-clock" />
+    </div>
+
     <!-- Menu mobile -->
     <div v-if="menuOpen" class="hdr__overlay" @click="closeMenuAndRefocus" />
     <nav id="hdr-mobile-menu" class="hdr__menu" :class="{ 'hdr__menu--open': menuOpen }" aria-label="Navigation mobile">
@@ -57,11 +66,19 @@
         :aria-current="isActive(item.to) ? 'page' : undefined"
         @click="closeMenu"
       >
-        {{ item.label }}
+        <span class="hdr__menu-link-prefix" aria-hidden="true">{{ item.prefix }} </span>
+        <span class="hdr__menu-link-label">{{ item.label }}</span>
       </NuxtLink>
 
       <div class="hdr__menu-actions">
-        <ZButton variant="terminal" size="sm" @click="openTerminalFromMenu">
+        <div class="hdr__menu-status">
+          <div class="hdr__status-badge">
+            <span class="hdr__status-dot" aria-hidden="true" />
+            <span class="hdr__status-text">Disponible</span>
+          </div>
+          <CurrentTime class="hdr__menu-clock" />
+        </div>
+        <ZButton variant="terminal" size="sm" class="hdr__action--terminal" @click="openTerminalFromMenu">
           <template #icon><ZIcon name="terminal" /></template>
           Terminal
         </ZButton>
@@ -84,11 +101,11 @@ import TerminalManagerComponent from "~/components/terminal/TerminalManagerCompo
 const route = useRoute();
 
 const navItems = [
-  { to: "/", label: "Accueil" },
-  { to: "/services", label: "Services" },
-  { to: "/about", label: "À propos" },
-  { to: "/blog", label: "Blog" },
-  { to: "/contact", label: "Contact" },
+  { to: "/", label: "Accueil", prefix: "~" },
+  { to: "/services", label: "Services", prefix: "//" },
+  { to: "/about", label: "À propos", prefix: "./" },
+  { to: "/blog", label: "Blog", prefix: "~/" },
+  { to: "/contact", label: "Contact", prefix: "$" },
 ];
 
 // Lien actif : exact pour l'accueil, préfixe pour les autres (couvre /blog/[...slug]).
@@ -99,6 +116,18 @@ function isActive(to: string): boolean {
   return route.path === to || route.path.startsWith(`${to}/`);
 }
 
+// --- Scroll state & progress ---
+const isScrolled = ref(false);
+const scrollProgress = ref(0);
+
+function onScroll() {
+  const top = window.scrollY || document.documentElement.scrollTop || 0;
+  isScrolled.value = top > 20;
+  const h = document.documentElement.scrollHeight - window.innerHeight;
+  const progress = h > 0 ? (top / h) * 100 : 0;
+  scrollProgress.value = Math.min(100, Math.max(0, progress));
+}
+
 // --- Terminal easter-egg (préservé) ---
 const terminalManager = ref<InstanceType<typeof TerminalManagerComponent> | null>(null);
 
@@ -133,6 +162,18 @@ function closeMenu() {
   menuOpen.value = false;
 }
 
+function onBrandClick(event: MouseEvent) {
+  closeMenu();
+  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
+    return;
+  }
+  if (route.path === "/") {

exec
/bin/zsh -lc "sed -n '621,980p' docs/implementation-artifacts/code-reviews/epic-11/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
+    event.preventDefault();
+    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
+    window.scrollTo({ top: 0, behavior: isReducedMotion ? "auto" : "smooth" });
+  }
+}
+
 // Fermeture clavier/overlay : renvoie le focus au burger (déclencheur) — a11y.
 function closeMenuAndRefocus() {
   if (!menuOpen.value) {
@@ -175,30 +216,56 @@ onMounted(() => {
   desktopMq = window.matchMedia("(min-width: 901px)");
   desktopMq.addEventListener("change", onDesktopChange);
   registerTerminalLauncher(addNewTerminal);
+  window.addEventListener("scroll", onScroll, { passive: true });
+  window.addEventListener("resize", onScroll, { passive: true });
+  onScroll();
 });
 
 onBeforeUnmount(() => {
   document.removeEventListener("keydown", onKeydown);
   desktopMq?.removeEventListener("change", onDesktopChange);
   unregisterTerminalLauncher(addNewTerminal);
+  window.removeEventListener("scroll", onScroll);
+  window.removeEventListener("resize", onScroll);
 });
 </script>
 
 <style lang="scss" scoped>
 /* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css */
 .hdr {
-  position: sticky;
+  position: fixed;
   top: 0;
+  left: 0;
+  right: 0;
   z-index: 50;
   height: var(--header-height);
+  background: transparent;
+  border-bottom: 1px solid transparent;
+  transition:
+    background var(--dur-base) var(--ease-standard),
+    border-color var(--dur-base) var(--ease-standard),
+    backdrop-filter var(--dur-base) var(--ease-standard),
+    -webkit-backdrop-filter var(--dur-base) var(--ease-standard);
+}
 
-  // Verre sombre translucide : surface de page (token) à 82 % d'opacité + flou.
-  background: color-mix(in srgb, var(--surface-0) 82%, transparent);
-  border-bottom: 1px solid var(--border-subtle);
+.hdr--stuck {
+  background: color-mix(in srgb, var(--surface-0) 80%, transparent);
+  border-bottom-color: var(--border-subtle);
 
   /* stylelint-disable-next-line property-no-vendor-prefix -- Safari : autoprefixer non câblé, préfixe manuel requis */
-  -webkit-backdrop-filter: blur(10px);
-  backdrop-filter: blur(10px);
+  -webkit-backdrop-filter: blur(12px);
+  backdrop-filter: blur(12px);
+}
+
+.hdr__progress {
+  position: absolute;
+  top: 0;
+  left: 0;
+  height: 2px;
+  background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
+  box-shadow: 0 0 10px var(--accent);
+  pointer-events: none;
+  transition: width 0.05s linear;
 }
 
 .hdr__in {
@@ -215,12 +282,23 @@ onBeforeUnmount(() => {
 .hdr__brand {
   display: inline-flex;
   align-items: center;
-  gap: var(--space-2);
+  gap: var(--space-3);
   text-decoration: none;
+  cursor: pointer;
 
   .hdr__logo {
-    font-size: 24px;
-    color: var(--accent);
+    display: block;
+    width: 24px;
+    height: 24px;
+    object-fit: contain;
+    filter: drop-shadow(0 2px 6px color-mix(in srgb, var(--surface-0) 60%, transparent));
+    transition:
+      transform var(--dur-base) var(--ease-standard),
+      filter var(--dur-base) var(--ease-standard);
+  }
+
+  .hdr__brand-text {
+    transition: transform var(--dur-fast) var(--ease-standard);
   }
 
   b {
@@ -228,6 +306,27 @@ onBeforeUnmount(() => {
     font-size: var(--fs-md);
     font-weight: var(--fw-bold);
     color: var(--text-strong);
+    transition: color var(--dur-fast) var(--ease-standard);
+  }
+
+  .dim {
+    color: var(--text-faint);
+    transition: color var(--dur-fast) var(--ease-standard);
+  }
+
+  &:hover {
+    .hdr__logo {
+      transform: rotate(-12deg) scale(1.15);
+      filter: drop-shadow(0 0 10px color-mix(in srgb, var(--accent) 70%, transparent));
+    }
+
+    b {
+      color: var(--accent);
+    }
+
+    .dim {
+      color: var(--text-body);
+    }
   }
 
   // Lien focusable (logo + nom) : anneau DS comme les autres focusables du châssis.
@@ -240,38 +339,79 @@ onBeforeUnmount(() => {
 }
 
 .hdr__nav {
+  position: absolute;
+  left: 50%;
   display: flex;
   align-items: center;
-  gap: var(--space-1);
-  min-width: 0; // autorise la nav à rétrécir plutôt que de pousser l'overflow
-  margin-left: var(--space-4);
+  gap: var(--space-6);
+  transform: translateX(-50%);
 }
 
 .hdr__link {
-  padding: var(--space-2) var(--space-3);
+  position: relative;
+  display: inline-flex;
+  align-items: center;
+  gap: var(--space-1);
+  padding: 4px 0;
   font-family: var(--font-mono);
   font-size: var(--fs-sm);
-  color: var(--text-muted);
+  color: var(--text-body);
   text-decoration: none;
-  border-radius: var(--radius-sm);
-  transition:
-    color var(--dur-fast) var(--ease-standard),
-    background var(--dur-fast) var(--ease-standard);
+  background: transparent;
+  transition: color var(--dur-fast) var(--ease-standard);
+
+  &::after {
+    content: "";
+    position: absolute;
+    bottom: -2px;
+    left: 0;
+    width: 0;
+    height: 1.5px;
+    background: var(--accent);
+    transition: width var(--dur-base) var(--ease-out);
+  }
 
   &:hover {
     color: var(--text-strong);
-    background: var(--surface-2);
+    background: transparent;
+
+    &::after {
+      width: 100%;
+    }
   }
 
-  // Anneau de focus DS (les liens de nav n'avaient que l'outline UA par défaut).
+  // Anneau de focus DS
   &:focus-visible {
     outline: 2px solid transparent; // forced-colors : rendu en couleur système
-    outline-offset: 2px;
+    outline-offset: 4px;
+    border-radius: var(--radius-xs);
     box-shadow: var(--ring-accent);
   }
 }
 
 .hdr__link--active {
+  color: var(--text-strong);
+
+  &::after {
+    width: 100%;
+  }
+
+  .hdr__link-prefix {
+    color: var(--accent);
+  }
+}
+
+.hdr__link-prefix,
+.hdr__menu-link-prefix {
+  font-family: var(--font-mono);
+  color: var(--text-faint);
+  transition: color var(--dur-fast) var(--ease-standard);
+}
+
+.hdr__link:hover .hdr__link-prefix,
+.hdr__link--active .hdr__link-prefix,
+.hdr__menu-link:hover .hdr__menu-link-prefix,
+.hdr__menu-link--active .hdr__menu-link-prefix {
   color: var(--accent);
 }
 
@@ -282,10 +422,67 @@ onBeforeUnmount(() => {
   margin-left: auto;
 }
 
-.hdr__clock {
+.hdr__action--terminal {
+  border-color: color-mix(in srgb, var(--term-green) 40%, transparent);
+  box-shadow: 0 0 12px color-mix(in srgb, var(--term-green) 22%, transparent);
+
+  &:hover {
+    border-color: var(--term-green);
+    box-shadow:
+      0 0 20px color-mix(in srgb, var(--term-green) 45%, transparent),
+      var(--glow-terminal);
+  }
+}
+
+// Dock de statut & horloge positionné tout à droite de l'écran (hors container centré)
+.hdr__dock-right {
+  position: absolute;
+  top: 50%;
+  right: var(--space-6);
+  z-index: 52;
+  display: flex;
+  gap: var(--space-3);
+  align-items: center;
+  transform: translateY(-50%);
+}
+
+.hdr__status-badge {
+  display: inline-flex;
+  gap: var(--space-2);
+  align-items: center;
+  padding: 4px 10px;
   font-family: var(--font-mono);
   font-size: var(--fs-xs);
-  color: var(--text-muted);
+  color: var(--term-green);
+  user-select: none;
+  background: color-mix(in srgb, var(--term-green) 12%, transparent);
+  border: 1px solid color-mix(in srgb, var(--term-green) 40%, transparent);
+  border-radius: var(--radius-pill);
+  box-shadow: 0 0 10px color-mix(in srgb, var(--term-green) 18%, transparent);
+  transition:
+    box-shadow var(--dur-base) var(--ease-standard),
+    border-color var(--dur-base) var(--ease-standard);
+
+  /* stylelint-disable-next-line property-no-vendor-prefix */
+  -webkit-backdrop-filter: blur(8px);
+  backdrop-filter: blur(8px);
+
+  &:hover {
+    border-color: var(--term-green);
+    box-shadow: 0 0 16px color-mix(in srgb, var(--term-green) 35%, transparent);
+  }
+}
+
+.hdr__status-dot {
+  width: 7px;
+  height: 7px;
+  background: var(--term-green);
+  border-radius: var(--radius-circle);
+  box-shadow: 0 0 6px var(--term-green);
+}
+
+.hdr__dock-clock {
+  margin-left: var(--space-1);
 }
 
 .hdr__burger {
@@ -319,16 +516,18 @@ onBeforeUnmount(() => {
   display: none;
 }
 
-// ---- Dégradé progressif (tablette) pour éviter l'overflow du header
-// avant que le burger ne prenne le relais (< 900px). ----
-@media (width <= 1100px) {
-  .hdr__clock {
-    display: none;
-  }
+.hdr__menu-status {
+  display: flex;
+  align-items: center;
+  justify-content: space-between;
+  padding-bottom: var(--space-2);
+  margin-bottom: var(--space-2);
+  border-bottom: 1px solid var(--border-subtle);
 }
 
-@media (width <= 1000px) {
-  .hdr__badge {
+// Dégradé progressif pour le dock droit sur largeurs moyennes (évite la collision avec le CTA à 1440px)
+@media (width <= 1650px) {
+  .hdr__dock-right {
     display: none;
   }
 }
@@ -343,8 +542,7 @@ onBeforeUnmount(() => {
 // ---- Responsive : < 900px (cf. kit.css) ----
 @media (width <= 900px) {
   .hdr__nav,
-  .hdr__clock,
-  .hdr__badge,
+  .hdr__dock-right,
   .hdr__right .hdr__action {
     display: none;
   }
@@ -412,8 +610,17 @@ onBeforeUnmount(() => {
 }
 
 @media (prefers-reduced-motion: reduce) {
+  .hdr,
+  .hdr__progress,
   .hdr__link,
+  .hdr__link::after,
   .hdr__menu {
+    transition: none !important;
+  }
+
+  .hdr__brand .hdr__logo,
+  .hdr__brand:hover .hdr__logo {
+    transform: none;
     transition: none;
   }
 }
diff --git a/app/components/HexagonLinkComponent.vue b/app/components/HexagonLinkComponent.vue
index e7cb6a4..0187da4 100644
--- a/app/components/HexagonLinkComponent.vue
+++ b/app/components/HexagonLinkComponent.vue
@@ -23,17 +23,19 @@ defineProps<{
   width: 46px;
   height: 53px;
   font-size: 20px; // dimensionne le glyphe ZIcon (1em)
-  color: var(--text-muted);
+  color: var(--text-strong);
   cursor: pointer;
-  background: var(--surface-2);
+  background: var(--surface-3);
   clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
   transition:
     color var(--dur-base) var(--ease-standard),

exec
/bin/zsh -lc "sed -n '981,1340p' docs/implementation-artifacts/code-reviews/epic-11/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
-    background var(--dur-base) var(--ease-standard);
+    background var(--dur-base) var(--ease-standard),
+    transform var(--dur-base) var(--ease-standard);
 
   &:hover {
     color: var(--ink-on-accent);
     background: var(--accent);
+    transform: translateY(-2px);
   }
 
   &:focus-visible {
@@ -58,6 +60,10 @@ defineProps<{
 @media (prefers-reduced-motion: reduce) {
   .hex {
     transition: none;
+
+    &:hover {
+      transform: none;
+    }
   }
 }
 </style>
diff --git a/app/components/home/HomeAtmosComponent.vue b/app/components/home/HomeAtmosComponent.vue
new file mode 100644
index 0000000..38b09be
--- /dev/null
+++ b/app/components/home/HomeAtmosComponent.vue
@@ -0,0 +1,381 @@
+<template>
+  <div class="atmos" :class="{ 'atmos--fallback': isFallback }" aria-hidden="true">
+    <canvas v-if="!isFallback" ref="canvasRef" class="atmos__canvas" />
+    <div class="grid-dots" />
+    <div class="vignette" />
+  </div>
+</template>
+
+<script setup lang="ts">
+// Atmosphère en dégradé fluide animé (Flow WebGL Shader inspiré de gurade.netlify.app).
+// Rendu WebGL 60fps accéléré, déformation fbm organique, zero interaction souris,
+// respect strict de prefers-reduced-motion: reduce et extinction en arrière-plan.
+import { onBeforeUnmount, onMounted, ref } from "vue";
+
+const canvasRef = ref<HTMLCanvasElement | null>(null);
+const isFallback = ref(false);
+
+const VS = `
+attribute vec2 a;
+void main() {
+  gl_Position = vec4(a, 0.0, 1.0);
+}
+`;
+
+const FS = `
+#ifdef GL_FRAGMENT_PRECISION_HIGH
+precision highp float;
+#else
+precision mediump float;
+#endif
+
+uniform vec2 u_res;
+uniform float u_time;
+uniform float u_angle;
+uniform vec3 u_spotCol[2];
+uniform vec2 u_spotPos[2];
+uniform float u_freq;
+uniform float u_warp;
+uniform float u_seed;
+
+#define PI 3.141592653589793
+
+vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
+vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
+vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
+
+float snoise(vec2 v) {
+  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
+  vec2 i = floor(v + dot(v, C.yy));
+  vec2 x0 = v - i + dot(i, C.xx);
+  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
+  vec4 x12 = x0.xyxy + C.xxzz;
+  x12.xy -= i1;
+  i = mod289(i);
+  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
+  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
+  m = m * m;
+  m = m * m;
+  vec3 x = 2.0 * fract(p * C.www) - 1.0;
+  vec3 h = abs(x) - 0.5;
+  vec3 ox = floor(x + 0.5);
+  vec3 a0 = x - ox;
+  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
+  vec3 g;
+  g.x = a0.x * x0.x + h.x * x0.y;
+  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
+  return 130.0 * dot(m, g);
+}
+
+float fbm(vec2 p) {
+  float v = 0.0;
+  float a = 0.5;
+  for (int i = 0; i < 3; i++) {
+    v += a * snoise(p);
+    p = p * 2.03 + vec2(1.7, 9.2);
+    a *= 0.5;
+  }
+  return v * 0.5 + 0.5;
+}
+
+float lum(vec3 c) {
+  return dot(c, vec3(0.299, 0.587, 0.114));
+}
+
+void main() {
+  vec2 uv = gl_FragCoord.xy / u_res;
+  vec2 p = vec2(uv.x, 1.0 - uv.y);
+  float aspect = u_res.x / u_res.y;
+  vec2 dir = vec2(sin(u_angle), -cos(u_angle));
+  float t = u_time;
+
+  vec2 pa = vec2(p.x * aspect, p.y);
+  vec2 q = pa;
+  vec2 np = (q + dir * t * 0.03) * u_freq * 0.75 + u_seed;
+  vec2 w1 = vec2(fbm(np + t * 0.05), fbm(np + vec2(5.2, 1.3) - t * 0.04));
+  q += (w1 - 0.5) * u_warp;
+
+  // Flow deformation (u_type == 7)
+  vec2 w2 = vec2(fbm(q * u_freq * 1.15 + 3.1 + t * 0.03), fbm(q * u_freq * 1.15 + 7.7 - t * 0.02));
+  q += (w2 - 0.5) * u_warp * 0.55;
+
+  float pw = 2.0;
+  float eps = 0.012;
+  vec3 acc = vec3(0.0);
+  float ws = 0.0;
+  for (int i = 0; i < 2; i++) {
+    vec2 s = vec2(u_spotPos[i].x * aspect, u_spotPos[i].y);
+    float d = distance(q, s);
+    float w = 1.0 / (pow(d, pw) + eps);
+    acc += u_spotCol[i] * w;
+    ws += w;
+  }
+  vec3 col = acc / max(ws, 1e-6);
+
+  // Chrome genre finish (u_genre == 1)
+  float n = fbm(pa * u_freq * 0.8 + u_seed * 0.37 + t * 0.02);
+  float s = dot(pa - vec2(aspect * 0.5, 0.5), dir);
+  col = mix(vec3(lum(col)), col, 0.6);
+  float band = sin((s * 1.8 + n * 0.8) * PI);
+  col *= 0.76 + 0.24 * band;
+  col += pow(max(band, 0.0), 4.0) * 0.10;
+  col *= 0.85;
+
+  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
+}
+`;
+
+let gl: WebGLRenderingContext | null = null;
+let program: WebGLProgram | null = null;
+let quadBuffer: WebGLBuffer | null = null;
+let animId: number | null = null;
+let isVisible = true;
+let isReducedMotion = false;
+let motionMq: MediaQueryList | null = null;
+
+interface UniformMap {
+  u_res?: WebGLUniformLocation | null;
+  u_time?: WebGLUniformLocation | null;
+  u_angle?: WebGLUniformLocation | null;
+  u_spotCol?: WebGLUniformLocation | null;
+  u_spotPos?: WebGLUniformLocation | null;
+  u_freq?: WebGLUniformLocation | null;
+  u_warp?: WebGLUniformLocation | null;
+  u_seed?: WebGLUniformLocation | null;
+}
+let uniforms: UniformMap = {};
+
+function compileShader(type: number, source: string): WebGLShader | null {
+  if (!gl) {
+    return null;
+  }
+  const shader = gl.createShader(type);
+  if (!shader) {
+    return null;
+  }
+  gl.shaderSource(shader, source);
+  gl.compileShader(shader);
+  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
+    gl.deleteShader(shader);
+    return null;
+  }
+  return shader;
+}
+
+function initWebGL(canvas: HTMLCanvasElement): boolean {
+  try {
+    gl =
+      canvas.getContext("webgl", {
+        alpha: false,
+        antialias: false,
+        depth: false,
+        stencil: false,
+        preserveDrawingBuffer: false,
+      }) || (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
+  } catch {
+    gl = null;
+  }
+  if (!gl) {
+    return false;
+  }
+
+  const vs = compileShader(gl.VERTEX_SHADER, VS);
+  const fs = compileShader(gl.FRAGMENT_SHADER, FS);
+  if (!vs || !fs) {
+    return false;
+  }
+
+  program = gl.createProgram();
+  if (!program) {
+    return false;
+  }
+  gl.attachShader(program, vs);
+  gl.attachShader(program, fs);
+  gl.linkProgram(program);
+  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
+    return false;
+  }
+
+  gl.useProgram(program);
+
+  quadBuffer = gl.createBuffer();
+  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
+  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
+
+  const aPos = gl.getAttribLocation(program, "a");
+  gl.enableVertexAttribArray(aPos);
+  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
+
+  uniforms = {
+    u_res: gl.getUniformLocation(program, "u_res"),
+    u_time: gl.getUniformLocation(program, "u_time"),
+    u_angle: gl.getUniformLocation(program, "u_angle"),
+    u_spotCol: gl.getUniformLocation(program, "u_spotCol"),
+    u_spotPos: gl.getUniformLocation(program, "u_spotPos"),
+    u_freq: gl.getUniformLocation(program, "u_freq"),
+    u_warp: gl.getUniformLocation(program, "u_warp"),
+    u_seed: gl.getUniformLocation(program, "u_seed"),
+  };
+
+  // Configuration exacte demandée :
+  // Scale 50% -> u_freq = 3.2 + (0.7 - 3.2) * 0.5 = 1.95
+  // Distortion 55% -> u_warp = 0.55 * 1.1 = 0.605
+  // Couleurs : #F87116 (spot 0: 80% 30%) et #7A1F5D (spot 1: 21% 68%)
+  gl.uniform1f(uniforms.u_freq ?? null, 1.95);
+  gl.uniform1f(uniforms.u_warp ?? null, 0.605);
+  gl.uniform1f(uniforms.u_seed ?? null, 7.3);
+  gl.uniform1f(uniforms.u_angle ?? null, (135 * Math.PI) / 180);
+
+  // Spot 0 : #F87116 -> rgb(248, 113, 22)
+  // Spot 1 : #7A1F5D -> rgb(122, 31, 93)
+  const colBuf = new Float32Array([248 / 255, 113 / 255, 22 / 255, 122 / 255, 31 / 255, 93 / 255]);
+  gl.uniform3fv(uniforms.u_spotCol ?? null, colBuf);
+
+  const posBuf = new Float32Array([0.8, 0.3, 0.21, 0.68]);
+  gl.uniform2fv(uniforms.u_spotPos ?? null, posBuf);
+
+  return true;
+}
+
+function resizeCanvas(canvas: HTMLCanvasElement) {
+  if (!gl) {
+    return;
+  }
+  // Rendu à échelle optimisée (0.6x de la résolution physique)
+  // pour un 60fps constant et une diffusion fluide sans aucun aliasing.
+  const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.6;
+  const w = Math.max(320, Math.round(window.innerWidth * scale));
+  const h = Math.max(240, Math.round(window.innerHeight * scale));
+
+  if (canvas.width !== w || canvas.height !== h) {
+    canvas.width = w;
+    canvas.height = h;
+    gl.viewport(0, 0, w, h);
+    gl.uniform2f(uniforms.u_res ?? null, w, h);
+  }
+}
+
+function onVisibilityChange() {
+  isVisible = !document.hidden;
+}
+
+function onMotionChange(e: MediaQueryListEvent) {
+  isReducedMotion = e.matches;
+  if (isReducedMotion && animId !== null) {
+    cancelAnimationFrame(animId);
+    animId = null;
+  }
+}
+
+onMounted(() => {
+  const canvas = canvasRef.value;
+  if (!canvas) {
+    return;
+  }
+
+  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
+  isReducedMotion = motionMq.matches;
+  motionMq.addEventListener("change", onMotionChange);
+  document.addEventListener("visibilitychange", onVisibilityChange);
+
+  const success = initWebGL(canvas);
+  if (!success) {
+    isFallback.value = true;
+    return;
+  }
+
+  resizeCanvas(canvas);
+  window.addEventListener("resize", () => resizeCanvas(canvas), { passive: true });
+
+  const startT = performance.now();
+
+  function loop(now: number) {
+    if (!gl) {
+      return;
+    }
+    if (isVisible) {
+      // Vitesse très douce et vaporeuse (0.35x de la vitesse par défaut)
+      const elapsed = (now - startT) * 0.00035;
+      gl.uniform1f(uniforms.u_time ?? null, elapsed);
+      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
+    }
+    if (!isReducedMotion) {
+      animId = requestAnimationFrame(loop);
+    }
+  }
+
+  if (isReducedMotion) {
+    // Un seul rendu statique pour les préférences d'accessibilité
+    if (gl) {
+      gl.uniform1f(uniforms.u_time ?? null, 1.2);
+      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
+    }
+  } else {
+    animId = requestAnimationFrame(loop);
+  }
+});
+
+onBeforeUnmount(() => {
+  if (animId !== null) {
+    cancelAnimationFrame(animId);
+    animId = null;
+  }
+  document.removeEventListener("visibilitychange", onVisibilityChange);
+  motionMq?.removeEventListener("change", onMotionChange);
+  if (gl && program) {
+    if (quadBuffer) {
+      gl.deleteBuffer(quadBuffer);
+    }
+    gl.deleteProgram(program);
+  }
+});
+</script>

exec
/bin/zsh -lc "sed -n '1341,1700p' docs/implementation-artifacts/code-reviews/epic-11/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
+
+<style lang="scss" scoped>
+/* stylelint-disable selector-class-pattern */
+.atmos {
+  position: fixed;
+  inset: 0;
+  z-index: 0;
+  overflow: hidden;
+  pointer-events: none;
+  background-color: var(--surface-0);
+}
+
+.atmos--fallback {
+  background-color: #7a1f5d;
+  background-image:
+    radial-gradient(at 80% 30%, #f87116 0, transparent 62%), radial-gradient(at 21% 68%, #7a1f5d 0, transparent 62%);
+}
+
+.atmos__canvas {
+  position: absolute;
+  inset: 0;
+  width: 100%;
+  height: 100%;
+  display: block;
+  opacity: 0.52;
+}
+
+.grid-dots {
+  position: absolute;
+  inset: 0;
+  background-image: radial-gradient(color-mix(in srgb, var(--ink-1) 8%, transparent) 1px, transparent 1px);
+  background-size: 34px 34px;
+  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, var(--surface-0) 30%, transparent 78%);
+}
+
+.vignette {
+  position: absolute;
+  inset: 0;
+  background:
+    linear-gradient(180deg, color-mix(in srgb, var(--surface-0) 70%, transparent) 0%, transparent 130px),
+    radial-gradient(ellipse 120% 88% at 50% 12%, transparent 30%, var(--surface-0) 90%);
+}
+
+@media (prefers-reduced-motion: reduce) {
+  .atmos__canvas {
+    animation: none;
+  }
+}
+</style>
diff --git a/app/components/home/HomeBootOverlay.vue b/app/components/home/HomeBootOverlay.vue
new file mode 100644
index 0000000..36b8adc
--- /dev/null
+++ b/app/components/home/HomeBootOverlay.vue
@@ -0,0 +1,256 @@
+<template>
+  <div
+    v-if="!isDismissed"
+    class="boot"
+    :class="{ 'boot--done': isDone }"
+    role="status"
+    aria-live="polite"
+    @click="finishBoot"
+  >
+    <div class="boot__in">
+      <div class="boot__logo">
+        <ZIcon name="gem" class="boot__logo-icon" />
+        <b>jouan.os</b>
+      </div>
+      <div class="boot__line">
+        <span aria-hidden="true">&gt; </span>{{ currentStepText }}
+        <span v-if="currentStepOk" class="boot__ok" aria-hidden="true"> [ok]</span>
+      </div>
+      <div
+        class="boot__bar"
+        role="progressbar"
+        aria-label="Progression du démarrage de jouan.os"
+        :aria-valuenow="progressPercent"
+        aria-valuemin="0"
+        aria-valuemax="100"
+      >
+        <i :style="{ width: `${progressPercent}%` }" />
+      </div>
+      <button type="button" class="boot__skip" aria-label="Passer la séquence de démarrage" @click.stop="finishBoot">
+        [ cliquez ou appuyez sur Échap pour passer ]
+      </button>
+    </div>
+  </div>
+</template>
+
+<script setup lang="ts">
+import { ref, onMounted, onUnmounted } from "vue";
+
+// Séquence de démarrage stylisée jouan.os (Story 11.2 / AC-1 / CAP-2).
+// S'exécute une seule fois par session (sessionStorage jouan_boot_done).
+// Contournement immédiat sous prefers-reduced-motion ou via clic / touche Escape.
+// Émet 'boot-complete' dès la fin de l'animation pour orchestrer le hero terminal.
+
+const emit = defineEmits<{
+  (e: "boot-complete"): void;
+}>();
+
+const isDismissed = ref(false);
+const isDone = ref(false);
+const currentStepText = ref("");
+const currentStepOk = ref(false);
+const progressPercent = ref(0);
+
+const bootSteps = [
+  { text: "initialisation du noyau…", ok: false },
+  { text: "montage de /dev/portfolio", ok: false },
+  { text: "chargement des polices Ubuntu Mono", ok: false },
+  { text: "compilation des projets", ok: true },
+  { text: "démarrage du serveur", ok: true },
+];
+
+let stepTimeoutId: ReturnType<typeof setTimeout> | null = null;
+let dismissTimeoutId: ReturnType<typeof setTimeout> | null = null;
+
+function finishBoot() {
+  if (isDone.value) return;
+  isDone.value = true;
+  progressPercent.value = 100;
+
+  if (stepTimeoutId !== null) {
+    clearTimeout(stepTimeoutId);
+    stepTimeoutId = null;
+  }
+
+  if (import.meta.client) {
+    try {
+      sessionStorage.setItem("jouan_boot_done", "1");
+    } catch {
+      // Ignore sessionStorage exceptions (private browsing / quota)
+    }
+  }
+
+  emit("boot-complete");
+
+  dismissTimeoutId = setTimeout(() => {
+    isDismissed.value = true;
+  }, 350);
+}
+
+function runBoot() {
+  let stepIndex = 0;
+
+  function next() {
+    if (stepIndex >= bootSteps.length) {
+      stepTimeoutId = setTimeout(finishBoot, 180);
+      return;
+    }
+
+    const step = bootSteps[stepIndex];
+    if (step) {
+      currentStepText.value = step.text;
+      currentStepOk.value = step.ok;
+      progressPercent.value = Math.round(((stepIndex + 1) / bootSteps.length) * 100);
+    }
+    stepIndex++;
+    stepTimeoutId = setTimeout(next, 170);
+  }
+
+  next();
+}
+
+function handleKeydown(e: KeyboardEvent) {
+  if (e.key === "Escape" && !isDone.value) {
+    finishBoot();
+  }
+}
+
+onMounted(() => {
+  if (!import.meta.client) return;
+
+  window.addEventListener("keydown", handleKeydown);
+
+  // Vérifier si la session a déjà vu le boot
+  let alreadyBooted = false;
+  try {
+    alreadyBooted = sessionStorage.getItem("jouan_boot_done") === "1";
+  } catch {
+    alreadyBooted = false;
+  }
+
+  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
+
+  if (alreadyBooted || reduceMotion) {
+    try {
+      sessionStorage.setItem("jouan_boot_done", "1");
+    } catch {
+      // Ignore sessionStorage exceptions
+    }
+    isDone.value = true;
+    isDismissed.value = true;
+    emit("boot-complete");
+    return;
+  }
+
+  runBoot();
+});
+
+onUnmounted(() => {
+  if (!import.meta.client) return;
+  window.removeEventListener("keydown", handleKeydown);
+  if (stepTimeoutId !== null) {
+    clearTimeout(stepTimeoutId);
+    stepTimeoutId = null;
+  }
+  if (dismissTimeoutId !== null) {
+    clearTimeout(dismissTimeoutId);
+    dismissTimeoutId = null;
+  }
+});
+</script>
+
+<style lang="scss" scoped>
+/* stylelint-disable selector-class-pattern */
+.boot {
+  position: fixed;
+  inset: 0;
+  z-index: 200;
+  display: flex;
+  align-items: center;
+  justify-content: center;
+  cursor: pointer;
+  background: var(--surface-0);
+  transition:
+    opacity var(--dur-slow) var(--ease-out),
+    visibility var(--dur-slow);
+
+  &.boot--done {
+    pointer-events: none;
+    visibility: hidden;
+    opacity: 0;
+  }
+}
+
+.boot__in {
+  width: min(560px, 88vw);
+  font-family: var(--font-mono);
+  font-size: var(--fs-sm);
+}
+
+.boot__logo {
+  display: flex;
+  align-items: center;
+  gap: var(--space-3);
+  margin-bottom: var(--space-5);
+  color: var(--text-strong);
+
+  b {
+    font-size: var(--fs-lg);
+  }
+}
+
+.boot__logo-icon {
+  font-size: 26px;
+  color: var(--accent);
+}
+
+.boot__line {
+  min-height: 1.6em;
+  color: var(--text-muted);
+}
+
+.boot__ok {
+  color: var(--term-green);
+}
+
+.boot__bar {
+  height: 3px;
+  margin-top: var(--space-5);
+  overflow: hidden;
+  background: var(--surface-3);
+  border-radius: var(--radius-xs);
+
+  i {
+    display: block;
+    width: 0;
+    height: 100%;
+    background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
+    transition: width 0.1s linear;
+  }
+}
+
+.boot__skip {
+  display: inline-block;
+  margin-top: var(--space-4);
+  padding: 0;
+  font-family: inherit;
+  font-size: var(--fs-xs);
+  letter-spacing: var(--ls-wide);
+  color: var(--text-faint);
+  cursor: pointer;
+  background: none;
+  border: none;
+
+  &:focus-visible {
+    outline: 2px solid transparent;
+    outline-offset: 2px;
+    box-shadow: var(--ring-accent);
+  }
+}
+
+@media (prefers-reduced-motion: reduce) {
+  .boot {
+    display: none;
+  }
+}
+</style>
diff --git a/app/components/home/HomeHeroTerminal.vue b/app/components/home/HomeHeroTerminal.vue
new file mode 100644
index 0000000..3a03d11
--- /dev/null
+++ b/app/components/home/HomeHeroTerminal.vue
@@ -0,0 +1,392 @@
+<template>
+  <div class="hero-term">
+    <div class="hero-term__bar">
+      <span class="hero-term__dots" aria-hidden="true">
+        <span class="hero-term__dot hero-term__dot--close" />
+        <span class="hero-term__dot hero-term__dot--min" />
+        <span class="hero-term__dot hero-term__dot--max" />
+      </span>
+      <span class="hero-term__title">anon.@jouan.ovh: ~</span>
+    </div>
+
+    <div class="hero-term__body">
+      <!-- Lignes complètes terminées -->
+      <template v-for="(row, idx) in executedRows" :key="idx">
+        <p class="hero-term__line" aria-hidden="true">
+          <span class="prm">
+            <span class="prm__user">anon.@jouan.ovh</span>
+            <span class="prm__sep">:</span>
+            <span class="prm__dir">~</span>
+            <span class="prm__sep">$ </span>
+            <span class="prm__cmd">{{ row.cmd }}</span>
+          </span>
+        </p>
+        <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
+      </template>
+
+      <!-- Ligne en cours de frappe -->
+      <p v-if="currentTypingLine" class="hero-term__line" aria-hidden="true">
+        <span class="prm">
+          <span class="prm__user">anon.@jouan.ovh</span>
+          <span class="prm__sep">:</span>
+          <span class="prm__dir">~</span>
+          <span class="prm__sep">$ </span>
+          <span class="prm__cmd">{{ currentTypingText }}</span>
+          <span class="prm__caret" />
+        </span>
+      </p>
+
+      <!-- Bouton d'ouverture du terminal interactif / invite finale -->
+      <button
+        v-if="isSequenceComplete"
+        type="button"
+        class="hero-term__open"

exec
/bin/zsh -lc "sed -n '1701,2080p' docs/implementation-artifacts/code-reviews/epic-11/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
+        aria-label="Ouvrir le terminal interactif"
+        aria-haspopup="dialog"
+        @click="openTerminal"
+      >
+        <span class="prm">
+          <span class="prm__user">anon.@jouan.ovh</span>
+          <span class="prm__sep">:</span>
+          <span class="prm__dir">~</span>
+          <span class="prm__sep">$ </span>
+          <span class="prm__cmd">help</span>
+          <span class="prm__caret" aria-hidden="true" />
+        </span>
+      </button>
+
+      <!-- Fallback statique si JavaScript est désactivé -->
+      <noscript>
+        <div>
+          <template v-for="(row, idx) in fullRows" :key="`noscript-${idx}`">
+            <p class="hero-term__line">
+              <span class="prm">
+                <span class="prm__user">anon.@jouan.ovh</span>
+                <span class="prm__sep">:</span>
+                <span class="prm__dir">~</span>
+                <span class="prm__sep">$ </span>
+                <span class="prm__cmd">{{ row.cmd }}</span>
+              </span>
+            </p>
+            <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
+          </template>
+        </div>
+      </noscript>
+    </div>
+  </div>
+</template>
+
+<script setup lang="ts">
+import { ref, watch, onMounted, onUnmounted } from "vue";
+import { useTerminal } from "~/composables/useTerminal";
+import { SITE } from "~/data/site";
+
+// Terminal hero cinétique (Story 11.2 / AC-2 / CAP-3).
+// Déroule une animation de frappe séquentielle pour whoami, cat focus.txt et ls ~/projets.
+// Neutralisé sous prefers-reduced-motion (affichage statique complet immédiat).
+// Ouvre l'easter-egg terminal via useTerminal().open sur l'invite finale help.
+
+const props = withDefaults(
+  defineProps<{
+    autoStart?: boolean;
+  }>(),
+  {
+    autoStart: true,
+  },
+);
+
+const { open: openTerminal } = useTerminal();
+
+interface ITermRow {
+  cmd: string;
+  out: string;
+  tone: "ink" | "blue" | "green";
+}
+
+const projectsOutput = SITE.projects
+  .map((p) => {
+    if (p.name === "keova.app" || p.name === "Keova App") return "keova.app/";
+    if (p.name === "TryOn") return "tryon-saas/";
+    if (p.name === "Nodium") return "nodium-lab/";
+    return `${p.name.toLowerCase()}/`;
+  })
+  .join("  ");
+
+const fullRows: ITermRow[] = [
+  {
+    cmd: "whoami",
+    out: `${SITE.profile.name} — Full Stack TS Engineer (Nuxt / NestJS)`,
+    tone: "ink",
+  },
+  {
+    cmd: "cat focus.txt",
+    out: "SaaS, web apps, clean architecture, automated testing (QA) & AI engineering",
+    tone: "blue",
+  },
+  {
+    cmd: "ls ~/projets",
+    out: projectsOutput,
+    tone: "green",
+  },
+];
+
+const executedRows = ref<ITermRow[]>([]);
+const currentTypingLine = ref<ITermRow | null>(null);
+const currentTypingText = ref("");
+const isSequenceComplete = ref(false);
+
+let typingTimeoutId: ReturnType<typeof setTimeout> | null = null;
+let stepTimeoutId: ReturnType<typeof setTimeout> | null = null;
+let isStarted = false;
+
+function showInstantState() {
+  executedRows.value = [...fullRows];
+  currentTypingLine.value = null;
+  currentTypingText.value = "";
+  isSequenceComplete.value = true;
+}
+
+function startTypingSequence() {
+  if (isStarted) return;
+  isStarted = true;
+
+  const reduceMotion = import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
+
+  if (reduceMotion) {
+    showInstantState();
+    return;
+  }
+
+  let rowIndex = 0;
+
+  function typeRow() {
+    if (rowIndex >= fullRows.length) {
+      currentTypingLine.value = null;
+      currentTypingText.value = "";
+      isSequenceComplete.value = true;
+      return;
+    }
+
+    const row = fullRows[rowIndex];
+    if (!row) return;
+
+    const activeRow: ITermRow = row;
+    currentTypingLine.value = activeRow;
+    currentTypingText.value = "";
+
+    let charIndex = 0;
+    const fullCmd = activeRow.cmd;
+
+    function typeChar() {
+      if (charIndex < fullCmd.length) {
+        currentTypingText.value = fullCmd.slice(0, charIndex + 1);
+        charIndex++;
+        typingTimeoutId = setTimeout(typeChar, 46);
+      } else {
+        // Commande entièrement tapée, afficher le résultat après une pause
+        stepTimeoutId = setTimeout(() => {
+          executedRows.value.push(activeRow);
+          currentTypingLine.value = null;
+          currentTypingText.value = "";
+          rowIndex++;
+          stepTimeoutId = setTimeout(typeRow, 280);
+        }, 200);
+      }
+    }
+
+    typeChar();
+  }
+
+  typeRow();
+}
+
+watch(
+  () => props.autoStart,
+  (shouldStart) => {
+    if (shouldStart && !isStarted) {
+      startTypingSequence();
+    }
+  },
+);
+
+onMounted(() => {
+  if (!import.meta.client) return;
+
+  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
+  if (reduceMotion) {
+    isStarted = true;
+    showInstantState();
+    return;
+  }
+
+  if (props.autoStart) {
+    startTypingSequence();
+  }
+});
+
+onUnmounted(() => {
+  if (typingTimeoutId !== null) {
+    clearTimeout(typingTimeoutId);
+    typingTimeoutId = null;
+  }
+  if (stepTimeoutId !== null) {
+    clearTimeout(stepTimeoutId);
+    stepTimeoutId = null;
+  }
+});
+</script>
+
+<style lang="scss" scoped>
+/* stylelint-disable selector-class-pattern */
+.hero-term {
+  display: flex;
+  flex-direction: column;
+  min-height: 300px;
+  overflow: hidden;
+  border: 1px solid var(--accent-2-soft);
+  border-radius: var(--radius-sm);
+  box-shadow: var(--glow-terminal);
+}
+
+.hero-term__bar {
+  position: relative;
+  display: flex;
+  flex: none;
+  align-items: center;
+  gap: var(--space-2);
+  height: 30px;
+  padding: 0 var(--space-3);
+  background: var(--aubergine-black);
+}
+
+.hero-term__dots {
+  display: flex;
+  align-items: center;
+  gap: 7px;
+}
+
+.hero-term__dot {
+  width: 13px;
+  height: 13px;
+  border-radius: var(--radius-circle);
+}
+
+.hero-term__dot--close {
+  background: var(--term-red);
+}
+
+.hero-term__dot--min {
+  background: var(--term-yellow);
+}
+
+.hero-term__dot--max {
+  background: var(--term-green);
+}
+
+.hero-term__title {
+  position: absolute;
+  inset: 0;
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  letter-spacing: var(--ls-wide);
+  color: var(--text-muted);
+  text-align: center;
+  pointer-events: none;
+}
+
+.hero-term__body {
+  flex: 1;
+  min-height: 0;
+  padding: var(--space-4);
+  overflow: auto;
+  font-family: var(--font-mono);
+  font-size: var(--fs-sm);
+  line-height: var(--lh-snug);
+  color: var(--ink-1);
+  background: var(--bg-terminal);
+  overflow-wrap: break-word;
+}
+
+@supports (backdrop-filter: blur(5px)) {
+  .hero-term__body {
+    background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
+    backdrop-filter: blur(5px);
+  }
+}
+
+.hero-term__line {
+  margin: 0;
+}
+
+.hero-term__out {
+  margin: 0 0 var(--space-4);
+}
+
+.hero-term__out--ink {
+  color: var(--ink-1);
+}
+
+.hero-term__out--blue {
+  color: var(--term-blue);
+}
+
+.hero-term__out--green {
+  color: var(--term-green);
+}
+
+.hero-term__open {
+  display: block;
+  width: 100%;
+  padding: 0;
+  font: inherit;
+  text-align: left;
+  cursor: pointer;
+  background: none;
+  border: none;
+  border-radius: var(--radius-xs);
+
+  &:focus-visible {
+    outline: 2px solid transparent;
+    outline-offset: 2px;
+    box-shadow: var(--ring-accent);
+  }
+}
+
+.prm {
+  font-family: var(--font-mono);
+}
+
+.prm__user {
+  font-weight: var(--fw-bold);
+  color: var(--prompt);
+}
+
+.prm__sep {
+  color: var(--ink-1);
+}
+
+.prm__dir {
+  font-weight: var(--fw-bold);
+  color: var(--term-blue);
+}
+
+.prm__cmd {
+  color: var(--ink-1);
+}
+
+.prm__caret {
+  display: inline-block;
+  width: 0.55em;
+  height: 1.05em;
+  margin-left: 1px;
+  vertical-align: text-bottom;
+  background: var(--prompt);
+  animation: caret-blink 1s steps(1) infinite;
+}
+
+@media (prefers-reduced-motion: reduce) {
+  .prm__caret {
+    animation: none;
+  }
+}
+</style>
diff --git a/app/components/home/HomeStackMarquee.vue b/app/components/home/HomeStackMarquee.vue
new file mode 100644
index 0000000..3be72c8
--- /dev/null
+++ b/app/components/home/HomeStackMarquee.vue
@@ -0,0 +1,116 @@
+<template>
+  <div v-if="skillsList.length" class="marquee" aria-hidden="true">
+    <div class="marquee__track">
+      <!-- Première passe -->
+      <span v-for="(skill, index) in skillsList" :key="`skill-a-${index}`" class="marquee__item">
+        <b class="marquee__label">{{ skill }}</b>
+        <span class="marquee__star" aria-hidden="true">✦</span>
+      </span>
+      <!-- Deuxième passe pour la boucle infinie CSS sans coupure -->
+      <span
+        v-for="(skill, index) in skillsList"
+        :key="`skill-b-${index}`"
+        class="marquee__item marquee__item--duplicate"
+      >
+        <b class="marquee__label">{{ skill }}</b>
+        <span class="marquee__star" aria-hidden="true">✦</span>
+      </span>
+    </div>
+  </div>
+</template>
+
+<script setup lang="ts">
+// Ruban défilant continu de la stack moderne prioritaire (Story 11.3 / AC-1 / CAP-4).
+// Alimenté par SITE.skills (app/data/site.ts) avec mapping soigné des libellés.
+// Défilement continu pur CSS masqué aux lecteurs d'écran (aria-hidden="true").

exec
/bin/zsh -lc "sed -n '2081,2460p' docs/implementation-artifacts/code-reviews/epic-11/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
+// Pause automatique au :hover et arrêt complet sous prefers-reduced-motion.
+import { computed } from "vue";
+import { SITE } from "~/data/site";
+
+const SKILL_LABEL_MAP: Record<string, string> = {
+  typescript: "TypeScript",
+  nuxt: "Nuxt 4",
+  vue: "Vue.js",
+  "nest.js": "NestJS",
+  "node.js": "Node.js",
+  postgresql: "PostgreSQL",
+  typeorm: "TypeORM",
+  stripe: "Stripe Connect",
+  testcafe: "TestCafé",
+  docker: "Docker",
+  "rest-api": "REST API",
+  vitest: "Vitest",
+};
+
+const skillsList = computed(() => {
+  return SITE.skills.map((skillKey) => SKILL_LABEL_MAP[skillKey] ?? skillKey);
+});
+</script>
+
+<style lang="scss" scoped>
+/* stylelint-disable selector-class-pattern */
+.marquee {
+  display: block;
+  width: 100%;
+  padding-block: var(--space-5);
+  overflow: hidden;
+  border-block: 1px solid var(--border-subtle);
+  mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
+
+  &:hover .marquee__track {
+    animation-play-state: paused;
+  }
+}
+
+.marquee__track {
+  display: flex;
+  gap: var(--space-8);
+  width: max-content;
+  will-change: transform;
+  animation: scroll-x 32s linear infinite;
+}
+
+.marquee__item {
+  display: inline-flex;
+  gap: var(--space-8);
+  align-items: center;
+  font-family: var(--font-mono);
+  font-size: var(--fs-xl);
+  letter-spacing: var(--ls-wide);
+  color: var(--text-faint);
+  white-space: nowrap;
+}
+
+.marquee__label {
+  font-weight: var(--fw-regular);
+  color: var(--text-body);
+}
+
+.marquee__star {
+  color: var(--accent);
+}
+
+@keyframes scroll-x {
+  from {
+    transform: translateX(0);
+  }
+
+  to {
+    transform: translateX(calc(-50% - var(--space-8) / 2));
+  }
+}
+
+@media (prefers-reduced-motion: reduce) {
+  .marquee {
+    mask-image: none;
+  }
+
+  .marquee__track {
+    animation: none;
+  }
+
+  .marquee__item--duplicate {
+    display: none;
+  }
+}
+</style>
diff --git a/app/components/terminal/programs/Projets.ts b/app/components/terminal/programs/Projets.ts
index 9333808..28e6ae2 100644
--- a/app/components/terminal/programs/Projets.ts
+++ b/app/components/terminal/programs/Projets.ts
@@ -7,7 +7,13 @@ const projets: IProgram = {
   command: "projets",
   description: "Mes projets.",
   run: function (): string {
-    const items = SITE.projects.map((p) => `<li>${p.name} — ${p.role} — ${p.desc} (${p.url})</li>`).join("");
+    const items = SITE.projects
+      .map((p) => {
+        const status = p.status ? ` [${p.status}]` : "";
+        const url = p.url ? ` (${p.url})` : "";
+        return `<li>${p.name} — ${p.role} — ${p.desc}${status}${url}</li>`;
+      })
+      .join("");
     return `<ul>${items}</ul>`;
   },
 };
diff --git a/app/components/ui/ZButton.vue b/app/components/ui/ZButton.vue
index 1bb4a23..9042733 100644
--- a/app/components/ui/ZButton.vue
+++ b/app/components/ui/ZButton.vue
@@ -1,9 +1,10 @@
 <template>
   <component
     :is="as"
+    ref="buttonEl"
     v-bind="passthroughAttrs"
     class="zbtn"
-    :class="[`zbtn--${variant}`, `zbtn--${size}`]"
+    :class="[`zbtn--${variant}`, `zbtn--${size}`, { 'zbtn--magnetic': magnetic }]"
     :type="buttonType"
     :disabled="isNativeButton ? disabled || undefined : undefined"
     :aria-disabled="!isNativeButton && disabled ? 'true' : undefined"
@@ -11,25 +12,28 @@
     @click="blockDisabledActivation"
     @keydown.enter="blockDisabledActivation"
     @keydown.space="blockDisabledActivation"
+    @mousemove="onMouseMove"
+    @mouseleave="onMouseLeave"
   >
-    <span v-if="icon || $slots.icon" class="zbtn__icon">
-      <component :is="icon" v-if="icon" aria-hidden="true" />
-      <slot v-else name="icon" />
-    </span>
-    <slot />
-    <span v-if="iconRight || $slots.iconRight" class="zbtn__icon">
-      <component :is="iconRight" v-if="iconRight" aria-hidden="true" />
-      <slot v-else name="iconRight" />
+    <span ref="innerEl" class="zbtn__inner">
+      <span v-if="icon || $slots.icon" class="zbtn__icon">
+        <component :is="icon" v-if="icon" aria-hidden="true" />
+        <slot v-else name="icon" />
+      </span>
+      <slot />
+      <span v-if="iconRight || $slots.iconRight" class="zbtn__icon">
+        <component :is="iconRight" v-if="iconRight" aria-hidden="true" />
+        <slot v-else name="iconRight" />
+      </span>
     </span>
   </component>
 </template>
 
 <script setup lang="ts">
-// Primitive bouton du DS — label mono, accent orange Ubuntu en primary.
-// Porté de docs/design_system/components/core/Button.jsx (pas de copie JS :
-// le CSS d'injection `ensureStyles()` devient un <style scoped> token-only).
-import type { Component } from "vue";
-import { computed, useAttrs } from "vue";
+// Primitive bouton du DS — label mono, dimensions généreuses, micro-effet magnétique.
+// Porté de docs/design_system/components/core/Button.jsx et Home - Awwwards.html.
+import type { Component, ComponentPublicInstance } from "vue";
+import { computed, onBeforeUnmount, onMounted, ref, useAttrs, watch } from "vue";
 
 defineOptions({
   inheritAttrs: false,
@@ -40,7 +44,7 @@ type IconProp = string | Component;
 interface Props {
   /** Style visuel. @default "primary" */
   variant?: "primary" | "secondary" | "ghost" | "terminal" | "danger";
-  /** @default "md" — hauteurs 28 / 36 / 44 */
+  /** @default "md" — hauteurs 32 / 46 / 48 */
   size?: "sm" | "md" | "lg";
   /** Icône leading via composant Vue ou nom de composant. */
   icon?: IconProp;
@@ -50,6 +54,8 @@ interface Props {
   as?: string | Component;
   /** Désactivé : natif sur <button>, aria-disabled + pointer-events sur les autres tags. */
   disabled?: boolean;
+  /** Activer le micro-effet magnétique au curseur. @default true */
+  magnetic?: boolean;
 }
 
 const props = withDefaults(defineProps<Props>(), {
@@ -59,9 +65,78 @@ const props = withDefaults(defineProps<Props>(), {
   iconRight: undefined,
   as: "button",
   disabled: false,
+  magnetic: true,
 });
 
 const attrs = useAttrs();
+const buttonEl = ref<Element | ComponentPublicInstance | null>(null);
+const innerEl = ref<HTMLElement | null>(null);
+const isReducedMotion = ref(false);
+let motionMq: MediaQueryList | null = null;
+
+function onMotionChange(event: MediaQueryListEvent) {
+  isReducedMotion.value = event.matches;
+  if (event.matches) {
+    onMouseLeave();
+  }
+}
+
+onMounted(() => {
+  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
+  isReducedMotion.value = motionMq.matches;
+  motionMq.addEventListener("change", onMotionChange);
+});
+
+onBeforeUnmount(() => {
+  motionMq?.removeEventListener("change", onMotionChange);
+});
+
+function onMouseMove(event: MouseEvent) {
+  if (!props.magnetic || isReducedMotion.value || !buttonEl.value || props.disabled) {
+    return;
+  }
+  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
+    return;
+  }
+  const el = ((buttonEl.value as ComponentPublicInstance).$el ?? buttonEl.value) as HTMLElement | null;
+  if (!el || !(el instanceof HTMLElement)) {
+    return;
+  }
+  const rect = el.getBoundingClientRect();
+  if (rect.width <= 0 || rect.height <= 0) {
+    return;
+  }
+  const x = event.clientX - rect.left - rect.width / 2;
+  const y = event.clientY - rect.top - rect.height / 2;
+  el.style.setProperty("--mag-x", `${(x * 0.16).toFixed(2)}px`);
+  el.style.setProperty("--mag-y", `${(y * 0.18).toFixed(2)}px`);
+  if (innerEl.value) {
+    innerEl.value.style.setProperty("--mag-inner-x", `${(x * 0.08).toFixed(2)}px`);
+    innerEl.value.style.setProperty("--mag-inner-y", `${(y * 0.1).toFixed(2)}px`);
+  }
+}
+
+function onMouseLeave() {
+  if (buttonEl.value) {
+    const el = ((buttonEl.value as ComponentPublicInstance).$el ?? buttonEl.value) as HTMLElement | null;
+    if (el instanceof HTMLElement) {
+      el.style.removeProperty("--mag-x");
+      el.style.removeProperty("--mag-y");
+    }
+  }
+  if (innerEl.value) {
+    innerEl.value.style.removeProperty("--mag-inner-x");
+    innerEl.value.style.removeProperty("--mag-inner-y");
+  }
+}
+
+watch(
+  () => [props.magnetic, props.disabled],
+  () => {
+    onMouseLeave();
+  },
+);
+
 // `as` accepte une balise native ("button", "a") ou une référence de composant
 // (ex. NuxtLink importé de "#components") ; ne pas passer un nom de composant en chaîne.
 const isNativeButton = computed(() => props.as === "button");
@@ -70,47 +145,38 @@ const buttonType = computed(() => {
   if (!isNativeButton.value) {
     return undefined;
   }
-
-  return typeof attrs.type === "string" ? attrs.type : "button";
+  return typeof attrs.type === "string" ? (attrs.type as "button" | "submit" | "reset") : "button";
 });
 
+// Transmet tous les attributs au root polymorphe en excluant `type` pour les non-boutons.
 const passthroughAttrs = computed(() => {
-  if (!isDisabledNonNative.value) {
+  if (isNativeButton.value) {
     return attrs;
   }
-
-  return Object.fromEntries(
-    Object.entries(attrs).filter(([key]) => {
-      return key !== "href" && key !== "tabindex" && key !== "tabIndex" && !/^on[A-Z]/.test(key);
-    }),
-  );
+  const { type: _discardedType, ...rest } = attrs;
+  return rest;
 });
 
 function blockDisabledActivation(event: Event) {
-  if (!isDisabledNonNative.value) {
+  if (!props.disabled) {
     return;
   }
-
   event.preventDefault();
   event.stopPropagation();
-
-  if ("stopImmediatePropagation" in event) {
-    event.stopImmediatePropagation();
-  }
 }
 </script>
 
 <style lang="scss" scoped>
 /* stylelint-disable selector-class-pattern, custom-property-pattern -- convention DS portée depuis Button.jsx */
 .zbtn {
-  --_h: 36px;
-  --_px: var(--space-4);
+  --_h: 46px;
+  --_px: var(--space-5);
   --_fs: var(--fs-sm);
+  --_ty: 0;
 
   display: inline-flex;
   align-items: center;
   justify-content: center;
-  gap: var(--space-2);
   box-sizing: border-box;
   height: var(--_h);
   padding: 0 var(--_px);
@@ -125,16 +191,23 @@ function blockDisabledActivation(event: Event) {
   user-select: none;
   border: 1px solid transparent;
   border-radius: var(--radius-md);
+  transform: translate(var(--mag-x, 0), calc(var(--mag-y, 0) + var(--_ty, 0)));
   transition:
     background var(--dur-fast) var(--ease-standard),
     border-color var(--dur-fast) var(--ease-standard),
     color var(--dur-fast) var(--ease-standard),
+    box-shadow var(--dur-fast) var(--ease-standard),
     transform var(--dur-fast) var(--ease-standard);
 
+  &:hover {
+    --_ty: -1px;
+  }
+
+  &:active {
+    --_ty: 0;
+  }
+
   &:focus-visible {
-    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
-    // relais), mais rendu en couleur système sous forced-colors (Windows High
-    // Contrast), où les box-shadow sont neutralisées — focus toujours visible (AC #2).
     outline: 2px solid transparent;
     outline-offset: 2px;
     box-shadow: var(--ring-accent);
@@ -148,10 +221,20 @@ function blockDisabledActivation(event: Event) {
   }
 }
 
+.zbtn__inner {
+  display: inline-flex;
+  align-items: center;
+  justify-content: center;
+  gap: var(--space-2);
+  transform: translate(var(--mag-inner-x, 0), var(--mag-inner-y, 0));
+  transition: transform var(--dur-fast) var(--ease-standard);
+  will-change: transform;
+}
+
 .zbtn__icon {
   display: inline-flex;
-  width: 1.05em;
-  height: 1.05em;
+  width: 1.1em;
+  height: 1.1em;
 
   :deep(svg) {
     width: 100%;
@@ -161,15 +244,15 @@ function blockDisabledActivation(event: Event) {
 
 // ---- Tailles ----
 .zbtn--sm {
-  --_h: 28px;
+  --_h: 32px;
   --_px: var(--space-3);
   --_fs: var(--fs-xs);

exec
/bin/zsh -lc "sed -n '2461,2840p' docs/implementation-artifacts/code-reviews/epic-11/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
 }
 
 .zbtn--lg {
-  --_h: 44px;
-  --_px: var(--space-5);
-  --_fs: var(--fs-base);
+  --_h: 48px;
+  --_px: var(--space-6);
+  --_fs: var(--fs-sm);
 }
 
 // ---- Variantes ----
@@ -177,32 +260,30 @@ function blockDisabledActivation(event: Event) {
   background: var(--accent);
   color: var(--accent-text);
   border-color: var(--accent);
+  box-shadow: var(--glow-accent);
 
   &:hover {
     background: var(--accent-hover);
     border-color: var(--accent-hover);
+    box-shadow: 0 0 16px color-mix(in srgb, var(--accent) 45%, transparent);
   }
 
   &:active {
     background: var(--accent-active);
     border-color: var(--accent-active);
-    transform: translateY(1px);
   }
 }
 
 .zbtn--secondary {
-  background: var(--surface-2);
+  background: color-mix(in srgb, var(--surface-2) 75%, transparent);
   color: var(--text-strong);
   border-color: var(--border-default);
+  backdrop-filter: blur(6px);
 
   &:hover {
     background: var(--surface-3);
     border-color: var(--border-strong);
   }
-
-  &:active {
-    transform: translateY(1px);
-  }
 }
 
 .zbtn--ghost {
@@ -219,11 +300,14 @@ function blockDisabledActivation(event: Event) {
 .zbtn--terminal {
   background: var(--bg-terminal);
   color: var(--term-green);
-  border-color: var(--accent-2-soft);
+  border-color: color-mix(in srgb, var(--term-green) 35%, var(--accent-2-soft));
+  box-shadow: 0 0 10px color-mix(in srgb, var(--term-green) 18%, transparent);
 
   &:hover {
     border-color: var(--term-green);
-    box-shadow: var(--glow-terminal);
+    box-shadow:
+      0 0 18px color-mix(in srgb, var(--term-green) 45%, transparent),
+      var(--glow-terminal);
   }
 }
 
@@ -237,16 +321,15 @@ function blockDisabledActivation(event: Event) {
   }
 
   &:active {
-    transform: translateY(1px);
+    --_ty: 1px;
   }
 }
 
-// Parité a11y avec les autres primitives (ZCard/ZInput/ZTag) : pas de transition
-// de mouvement en motion réduit. Le filet global (base/_motion.scss) couvre aussi
-// ce cas ; on garde la garde locale pour que la primitive soit robuste en isolation.
 @media (prefers-reduced-motion: reduce) {
-  .zbtn {
+  .zbtn,
+  .zbtn__inner {
     transition: none;
+    transform: none !important;
   }
 }
 </style>
diff --git a/app/components/ui/ZCard.vue b/app/components/ui/ZCard.vue
index c58f1cd..afd92e3 100644
--- a/app/components/ui/ZCard.vue
+++ b/app/components/ui/ZCard.vue
@@ -1,6 +1,7 @@
 <template>
   <component
     :is="as"
+    ref="cardRef"
     v-bind="rootAttrs"
     class="zcard"
     :class="{
@@ -8,34 +9,38 @@
       'zcard--interactive': interactive,
       'zcard--accent': accent,
       'zcard--featured': featured,
+      'zcard--tilt': tilt,
     }"
+    @mousemove="onMouseMove"
+    @mouseleave="onMouseLeave"
   >
     <slot />
   </component>
 </template>
 
 <script setup lang="ts">
-// Primitive carte du DS — surface discrète, le contenu est le héros.
-// Portée de docs/design_system/components/core/Card.jsx (pas de copie JS :
-// le CSS d'injection `ensureStyles()` devient un <style scoped> token-only).
-import type { Component } from "vue";
-import { computed, useAttrs } from "vue";
+// Primitive carte du DS — surface discrète, 3D tilt interactif optionnel.
+// Porté de docs/design_system/components/core/Card.jsx et Home - Awwwards.html.
+import type { Component, ComponentPublicInstance } from "vue";
+import { computed, onBeforeUnmount, onMounted, ref, useAttrs, watch } from "vue";
 
 defineOptions({
   inheritAttrs: false,
 });
 
 interface Props {
-  /** Hover lift + bordure plus claire. @default false */
+  /** Rendre la carte interactive (hover state, clickable). @default false */
   interactive?: boolean;
-  /** Barre d'accent orange→aubergine en haut. @default false */
+  /** Filet supérieur dégradé accent (story 2.4). @default false */
   accent?: boolean;
-  /** Anneau de glow orange (offre mise en avant). @default false */
+  /** Variante mise en valeur (bordure accent, glow). @default false */
   featured?: boolean;
-  /** Padding interne `--space-6`. @default true */
+  /** Padding interne (var(--space-6)). Désactivable pour cartes média. @default true */
   padded?: boolean;
   /** Élément rendu (polymorphe). @default "div" */
   as?: string | Component;
+  /** Activer l'effet 3D tilt sur mousemove. @default false */
+  tilt?: boolean;
 }
 
 const props = withDefaults(defineProps<Props>(), {
@@ -44,9 +49,69 @@ const props = withDefaults(defineProps<Props>(), {
   featured: false,
   padded: true,
   as: "div",
+  tilt: false,
 });
 
 const attrs = useAttrs();
+const cardRef = ref<Element | ComponentPublicInstance | null>(null);
+const isReducedMotion = ref(false);
+let motionMq: MediaQueryList | null = null;
+
+function onMotionChange(e: MediaQueryListEvent) {
+  isReducedMotion.value = e.matches;
+  if (e.matches) {
+    onMouseLeave();
+  }
+}
+
+onMounted(() => {
+  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
+  isReducedMotion.value = motionMq.matches;
+  motionMq.addEventListener("change", onMotionChange);
+});
+
+onBeforeUnmount(() => {
+  motionMq?.removeEventListener("change", onMotionChange);
+});
+
+function onMouseMove(event: MouseEvent) {
+  if (!props.tilt || isReducedMotion.value || !cardRef.value) {
+    return;
+  }
+  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
+    return;
+  }
+  const el = ((cardRef.value as ComponentPublicInstance).$el ?? cardRef.value) as HTMLElement | null;
+  if (!el || !(el instanceof HTMLElement)) {
+    return;
+  }
+  const rect = el.getBoundingClientRect();
+  if (rect.width <= 0 || rect.height <= 0) {
+    return;
+  }
+  const px = (event.clientX - rect.left) / rect.width - 0.5;
+  const py = (event.clientY - rect.top) / rect.height - 0.5;
+  el.style.transform = `perspective(800px) rotateX(${-py * 6}deg) rotateY(${px * 8}deg) translateY(-4px)`;
+}
+
+function onMouseLeave() {
+  if (cardRef.value) {
+    const el = ((cardRef.value as ComponentPublicInstance).$el ?? cardRef.value) as HTMLElement | null;
+    if (el instanceof HTMLElement) {
+      el.style.transform = "";
+    }
+  }
+}
+
+watch(
+  () => props.tilt,
+  (newVal) => {
+    if (!newVal) {
+      onMouseLeave();
+    }
+  },
+);
+
 // `as` accepte une balise native ("div", "article") ou une référence de composant
 // (ex. NuxtLink importé de "#components") ; ne pas passer un nom de composant en chaîne.
 const isNativeButton = computed(() => props.as === "button");
@@ -78,6 +143,11 @@ const rootAttrs = computed(() => {
     box-shadow var(--dur-base) var(--ease-standard);
 }
 
+.zcard--tilt {
+  transform-style: preserve-3d;
+  will-change: transform;
+}
+
 .zcard--pad {
   padding: var(--space-6);
 }
@@ -91,12 +161,7 @@ const rootAttrs = computed(() => {
     box-shadow: var(--shadow-3), var(--shadow-hairline);
   }
 
-  // Focus clavier : anneau d'accent visible. Quand la carte est rendue en lien
-  // (`as="a"`, ex. cartes projet story 3.3), elle est focusable — sans cette règle,
-  // aucun indicateur. Sans effet sur les cartes non focusables (div).
   &:focus-visible {
-    // Outline transparent → rendu en couleur système sous forced-colors (où les
-    // box-shadow disparaissent) ; le ring box-shadow reste le focus visuel normal.
     outline: 2px solid transparent;
     outline-offset: 2px;
     box-shadow: var(--ring-accent);
@@ -112,8 +177,6 @@ const rootAttrs = computed(() => {
 }
 
 .zcard--featured {
-  // Bordure orange translucide de mise en avant : --accent-ring (token le plus proche
-  // de la réf. hsl(24 94% 53% / 0.35), même teinte accent en translucide).
   border-color: var(--accent-ring);
   box-shadow: var(--glow-accent), var(--shadow-hairline);
 }
@@ -121,6 +184,7 @@ const rootAttrs = computed(() => {
 @media (prefers-reduced-motion: reduce) {
   .zcard {
     transition: none;
+    transform: none !important;
   }
 
   .zcard--interactive:hover {
diff --git a/app/components/ui/ZCustomCursor.vue b/app/components/ui/ZCustomCursor.vue
new file mode 100644
index 0000000..e5f8033
--- /dev/null
+++ b/app/components/ui/ZCustomCursor.vue
@@ -0,0 +1,188 @@
+<template>
+  <div v-if="isEnabled" aria-hidden="true">
+    <div
+      class="cursor-ring"
+      :class="{ 'is-hot': isHot, 'is-visible': isVisible }"
+      :style="{ transform: `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)` }"
+    />
+    <div
+      class="cursor-dot"
+      :class="{ 'is-visible': isVisible }"
+      :style="{ transform: `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)` }"
+    />
+  </div>
+</template>
+
+<script setup lang="ts">
+import { ref, onMounted, onUnmounted } from "vue";
+
+// Micro-curseur interactif progressif (Story 11.1 / AC-4 / CAP-10).
+// Purement décoratif (aria-hidden="true").
+// Masqué sur mobile/tactile (hover: none) et prefers-reduced-motion.
+// N'altère pas le curseur natif système et supporte le SSR sans effet de bord.
+
+const isEnabled = ref(false);
+const isVisible = ref(false);
+const isHot = ref(false);
+
+const dotX = ref(0);
+const dotY = ref(0);
+const ringX = ref(0);
+const ringY = ref(0);
+
+let mouseX = 0;
+let mouseY = 0;
+let currentRingX = 0;
+let currentRingY = 0;
+let rafId: number | null = null;
+let motionMediaQuery: MediaQueryList | null = null;
+
+function updateAnimationLoop() {
+  const dx = mouseX - currentRingX;
+  const dy = mouseY - currentRingY;
+  currentRingX += dx * 0.18;
+  currentRingY += dy * 0.18;
+  ringX.value = currentRingX;
+  ringY.value = currentRingY;
+
+  if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
+    rafId = requestAnimationFrame(updateAnimationLoop);
+  } else {
+    rafId = null;
+  }
+}
+
+function startAnimationLoop() {
+  if (rafId === null) {
+    rafId = requestAnimationFrame(updateAnimationLoop);
+  }
+}
+
+function handlePointerMove(e: PointerEvent) {
+  if (!isVisible.value) {
+    isVisible.value = true;
+    currentRingX = e.clientX;
+    currentRingY = e.clientY;
+    ringX.value = e.clientX;
+    ringY.value = e.clientY;
+  }
+  mouseX = e.clientX;
+  mouseY = e.clientY;
+  dotX.value = e.clientX;
+  dotY.value = e.clientY;
+  startAnimationLoop();
+}
+
+function handlePointerOver(e: Event) {
+  const target = e.target as HTMLElement | null;
+  if (!target) return;
+  const isInteractive = target.closest("a, button, [data-hot], input, textarea, select, [role='button']");
+  isHot.value = Boolean(isInteractive);
+}
+
+function handlePointerLeave() {
+  isVisible.value = false;
+  isHot.value = false;
+}
+
+function handleMotionChange(e: MediaQueryListEvent) {
+  if (e.matches) {
+    isEnabled.value = false;
+    isVisible.value = false;
+    isHot.value = false;
+    if (rafId !== null) {
+      cancelAnimationFrame(rafId);
+      rafId = null;
+    }
+  } else {
+    const hasHover = window.matchMedia("(hover: hover)").matches;
+    if (hasHover) {
+      isEnabled.value = true;
+    }
+  }
+}
+
+onMounted(() => {
+  if (!import.meta.client) return;
+
+  const hasHover = window.matchMedia("(hover: hover)").matches;
+  motionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
+
+  if (!hasHover || motionMediaQuery.matches) {
+    if (motionMediaQuery) {
+      motionMediaQuery.addEventListener("change", handleMotionChange);
+    }
+    return;

exec
/bin/zsh -lc "sed -n '2841,3220p' docs/implementation-artifacts/code-reviews/epic-11/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
+  }
+
+  isEnabled.value = true;
+  window.addEventListener("pointermove", handlePointerMove, { passive: true });
+  document.addEventListener("pointerover", handlePointerOver, { passive: true });
+  document.documentElement.addEventListener("pointerleave", handlePointerLeave);
+  motionMediaQuery.addEventListener("change", handleMotionChange);
+});
+
+onUnmounted(() => {
+  if (!import.meta.client) return;
+  window.removeEventListener("pointermove", handlePointerMove);
+  document.removeEventListener("pointerover", handlePointerOver);
+  document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
+  if (motionMediaQuery) {
+    motionMediaQuery.removeEventListener("change", handleMotionChange);
+  }
+  if (rafId !== null) {
+    cancelAnimationFrame(rafId);
+    rafId = null;
+  }
+});
+</script>
+
+<style lang="scss" scoped>
+/* stylelint-disable selector-class-pattern */
+.cursor-dot,
+.cursor-ring {
+  position: fixed;
+  top: 0;
+  left: 0;
+  z-index: 90;
+  border-radius: var(--radius-circle);
+  mix-blend-mode: difference;
+  opacity: 0;
+  pointer-events: none;
+  transition: opacity var(--dur-base) var(--ease-standard);
+
+  &.is-visible {
+    opacity: 1;
+  }
+}
+
+.cursor-dot {
+  width: 6px;
+  height: 6px;
+  background: var(--ink-1);
+}
+
+.cursor-ring {
+  width: 34px;
+  height: 34px;
+  border: 1px solid color-mix(in srgb, var(--ink-1) 70%, transparent);
+  transition:
+    width var(--dur-base) var(--ease-out),
+    height var(--dur-base) var(--ease-out),
+    border-color var(--dur-base) var(--ease-out),
+    opacity var(--dur-base) var(--ease-standard);
+
+  &.is-hot {
+    width: 56px;
+    height: 56px;
+    border-color: var(--accent);
+  }
+}
+
+@media (hover: none), (prefers-reduced-motion: reduce) {
+  .cursor-dot,
+  .cursor-ring {
+    display: none;
+  }
+}
+</style>
diff --git a/app/composables/useSiteUrl.ts b/app/composables/useSiteUrl.ts
index 72b8d15..bcc3086 100644
--- a/app/composables/useSiteUrl.ts
+++ b/app/composables/useSiteUrl.ts
@@ -1,5 +1,5 @@
 // URL publique du site (canonical / og:url / JSON-LD) — point d'accès unique.
-// La valeur vient de `runtimeConfig.public.siteUrl` (défaut staging dans nuxt.config,
+// La valeur vient de `runtimeConfig.public.siteUrl` (défaut prod https://jouan.ovh dans nuxt.config,
 // surchargeable par NUXT_PUBLIC_SITE_URL). ⚠️ `useRuntimeConfig()` n'est
 // appelable QUE dans un contexte Nuxt (setup de composant, plugin, middleware) — d'où ce
 // composable, à consommer dans le `<script setup>` des pages, pas au niveau module d'un util
diff --git a/app/data/site.ts b/app/data/site.ts
index 81fd41d..b679da3 100644
--- a/app/data/site.ts
+++ b/app/data/site.ts
@@ -16,54 +16,65 @@ export interface IProfile {
   email: string;
   city: string;
   available: boolean;
+  maltUrl?: string;
 }
 
 export interface IProject {
   name: string;
   role: string;
   desc: string;
-  url: string;
+  url?: string;
+  status?: string;
   tags: string[];
 }
 
 const profile: IProfile = {
   name: "Simon Jouan",
-  role: "Développeur web freelance",
+  role: "Développeur Full Stack TypeScript — Nuxt / NestJS",
   email: "simon@jouan.ovh",
-  city: "Valognes, France",
+  city: "Rouen, France",
   available: true,
+  maltUrl: "https://www.malt.fr/profile/simonjouan",
 };
 
-// Stack technique — ordre conservé (tags hero de la home = sous-ensemble curé, non dérivé d'ici).
+// Stack technique moderne prioritaire ordonnée.
 const skills: string[] = [
-  "php",
-  "symfony",
-  "wordpress",
-  "node.js",
-  "nest.js",
-  "nuxt.js",
-  "vue",
   "typescript",
+  "nuxt",
+  "vue",
+  "nest.js",
+  "node.js",
+  "postgresql",
+  "typeorm",
+  "stripe",
+  "testcafe",
   "docker",
-  "tailwind",
-  "n8n",
-  "mysql",
+  "rest-api",
+  "vitest",
 ];
 
 const projects: IProject[] = [
   {
-    name: "keova.app",
-    role: "Fondateur · SaaS",
-    desc: "Plateforme SaaS que je conçois et opère de bout en bout.",
+    name: "Keova App",
+    role: "Co-fondateur & Développeur Full Stack",
+    desc: "Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).",
     url: "https://keova.app",
-    tags: ["nest.js", "nuxt", "saas"],
+    status: "● En production",
+    tags: ["Nuxt 4", "NestJS", "PostgreSQL", "Stripe Connect", "SaaS"],
+  },
+  {
+    name: "TryOn",
+    role: "CTO & Développeur Full Stack",
+    desc: "Plateforme SaaS B2B d'essayage virtuel de vêtements via l'IA générative (diffusion models, microservices asynchrones, files Redis).",
+    status: "○ Étude de cas (MVP livré)",
+    tags: ["Nuxt 3", "NestJS", "Python", "ComfyUI", "IA"],
   },
   {
-    name: "patio-conseil.fr",
-    role: "Client",
-    desc: "Site et outils pour un cabinet de conseil.",
-    url: "https://patio-conseil.fr",
-    tags: ["wordpress", "conseil"],
+    name: "Nodium",
+    role: "Créateur & Ingénieur IA",
+    desc: "Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.",
+    status: "◐ R&D / En cours",
+    tags: ["TypeScript", "Electron", "Agents", "IA"],
   },
 ];
 
diff --git a/app/pages/about.vue b/app/pages/about.vue
index 6a08e8a..e606d2f 100644
--- a/app/pages/about.vue
+++ b/app/pages/about.vue
@@ -25,14 +25,16 @@
           <div class="about__bio">
             <h2 class="eyebrow">// à propos</h2>
             <p class="prose about__para">
-              Développeur web freelance, je viens d'un parcours technique (métrologie, instrumentation) avant de
-              basculer dans le code. Aujourd'hui je conçois des applications en <strong>PHP/Symfony</strong>, des sites
-              <strong>WordPress</strong> sur-mesure, et des produits en <strong>Node.js / Nest.js / Nuxt.js</strong>.
+              Développeur web freelance basé à <strong>{{ city }}</strong
+              >, je viens d'un parcours technique (métrologie, instrumentation) avant de basculer avec passion dans le
+              code. Aujourd'hui, je conçois et développe des applications web et produits SaaS modernes avec
+              <strong>Vue 3 / Nuxt 4</strong>, <strong>NestJS</strong> et <strong>PostgreSQL</strong>.
             </p>
             <p class="prose about__para">
-              Je suis aussi fondateur du SaaS
-              <ZExternalLink href="https://keova.app" rel="noopener">keova.app</ZExternalLink>, et j'aime mettre l'IA au
-              service du code — agents, automatisations, intégrations LLM.
+              Je suis également co-fondateur de la plateforme SaaS
+              <ZExternalLink :href="keovaUrl">{{ keovaHostname }}</ZExternalLink
+              >, et j'intègre l'automatisation, l'exigence QA et l'IA au service du code — tests automatisés,
+              architecture modulaire et intégrations d'APIs.
             </p>
 
             <!-- Stack technique (story 5.2) — sous la bio, conforme à About.jsx. ZTag = pill.
@@ -99,21 +101,25 @@ import { SITE } from "~/data/site";
 // Identité + stack — source unique `app/data/site.ts`.
 const profile = SITE.profile;
 const skills = SITE.skills;
+const city = profile.city.split(",")[0]?.trim() ?? profile.city;
+const keovaProject = SITE.projects.find((p) => p.url?.includes("keova"));
+const keovaUrl = keovaProject?.url ?? "https://keova.app";
+const keovaHostname = keovaUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
 
-// Expériences (data.js → S.experiences) — de la plus récente à la plus ancienne.
+// Expériences (de la plus récente à la plus ancienne).
 // `org` sert de clé v-for stable (unique).
 const experiences = [
   {
     date: "02/2021 — aujourd'hui",
-    role: "Testeur QA",
+    role: "Testeur QA & Développeur TypeScript",
     org: "Linkizz",
-    desc: "Tests automatisés — Node.js, TypeScript, TestCafé.",
+    desc: "Tests automatisés et fiabilisation applicative — Node.js, TypeScript, TestCafé.",
   },
   {
     date: "05/2020 — 12/2021",
     role: "Développeur Full Stack",
     org: "CINS",
-    desc: "PHP/MySQL, Symfony 4/5, Drupal, Prestashop, WordPress, Docker.",
+    desc: "Développement d'applications web, APIs et intégrations sur-mesure, Docker.",
   },
   {
     date: "07/2007 — 05/2019",
@@ -131,8 +137,7 @@ const degrees = [
 
 // Métadonnées de la page. Voix 1re personne cohérente (cf. contrainte Langue & voix).
 const pageTitle = "À propos — jouan.ovh";
-const pageDescription =
-  "Développeur web freelance à Valognes, je conçois des applications en PHP/Symfony, des sites WordPress sur-mesure et des produits Node.js / Nest.js / Nuxt.js — voici mon parcours.";
+const pageDescription = `Développeur web freelance à ${city}, je conçois des applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL — découvrez mon parcours.`;
 
 const siteUrl = useSiteUrl();
 const aboutJsonLd = {
@@ -146,6 +151,12 @@ const aboutJsonLd = {
     jobTitle: SITE.profile.role,
     url: siteUrl,
     image: `${siteUrl}/images/portrait.jpeg`,
+    email: SITE.profile.email,
+    address: {
+      "@type": "PostalAddress",
+      addressLocality: SITE.profile.city,
+      addressCountry: "FR",
+    },
   },
 };
 
diff --git a/app/pages/index.vue b/app/pages/index.vue
index cb89e65..c513732 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -1,82 +1,80 @@
 <template>
   <main class="home">
-    <section class="hero hero__grad">
+    <ClientOnly>
+      <HomeBootOverlay @boot-complete="onBootComplete" />
+    </ClientOnly>
+    <HomeAtmosComponent />
+    <ZCustomCursor />
+
+    <section class="hero">
       <div class="hero__in container">
         <div class="hero__grid">
-          <!-- Colonne gauche : accroche, CTA, tags -->
+          <!-- Colonne gauche : accroche commerciale, badge dispo, CTAs -->
           <div class="anim hero__text">
-            <p class="eyebrow"><span aria-hidden="true">// </span>développeur web freelance</p>
-            <h1 class="hero__title">Du code <em>sur-mesure</em>,<br />de l'IA <em>utile</em>.</h1>
-            <p class="hero__sub">{{ tagline }}</p>
+            <p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>
+            <h1 class="hero__title">Développeur Full Stack <em>TypeScript</em></h1>
+            <p class="hero__sub">
+              Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De
+              l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.
+            </p>
+
+            <div class="hero__badge-wrap">
+              <span class="hero__pulse-dot" aria-hidden="true" />
+              <span>Disponible pour missions freelance</span>
+              <template v-if="SITE.profile.maltUrl">
+                <span aria-hidden="true"> · </span>
+                <ZExternalLink :href="SITE.profile.maltUrl"> Profil Malt vérifié </ZExternalLink>
+              </template>
+            </div>
+
             <div class="hero__cta">
               <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
-                Démarrer un projet
+                Discuter de votre projet
                 <template #iconRight><ZIcon name="arrow" /></template>
               </ZButton>
-              <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir les services </ZButton>
+              <ZButton :as="NuxtLink" to="/about" variant="secondary" size="lg"> Voir le parcours &amp; CV </ZButton>
             </div>
-            <ul class="hero__tags">
-              <li v-for="tag in tags" :key="tag">
-                <ZTag>{{ tag }}</ZTag>
-              </li>
-            </ul>
           </div>
 
-          <!-- Colonne droite : fenêtre terminal décorative (statique) -->
+          <!-- Colonne droite : terminal hero cinétique -->
           <div class="anim hero__term-col">
-            <div class="hero-term">
-              <div class="hero-term__bar">
-                <span class="hero-term__dots" aria-hidden="true">
-                  <span class="hero-term__dot hero-term__dot--close" />
-                  <span class="hero-term__dot hero-term__dot--min" />
-                  <span class="hero-term__dot hero-term__dot--max" />
-                </span>
-                <span class="hero-term__title">anon.@jouan.ovh: ~</span>
-              </div>
-
-              <div class="hero-term__body">
-                <template v-for="row in terminalRows" :key="row.id">
-                  <p class="hero-term__line" aria-hidden="true">
-                    <span class="prm"
-                      ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
-                      ><span class="prm__dir">~</span><span class="prm__sep">$ </span
-                      ><span class="prm__cmd">{{ row.cmd }}</span></span
-                    >
-                  </p>
-                  <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
-                </template>
-
-                <button
-                  type="button"
-                  class="hero-term__open"
-                  aria-label="Ouvrir le terminal interactif"
-                  aria-haspopup="dialog"
-                  @click="openTerminal"
-                >
-                  <span class="prm"
-                    ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
-                    ><span class="prm__dir">~</span><span class="prm__sep">$ </span><span class="prm__cmd">help</span
-                    ><span class="prm__caret" aria-hidden="true"
-                  /></span>
-                </button>
-              </div>
-            </div>
+            <HomeHeroTerminal :auto-start="isBootFinished" />
           </div>
         </div>
+
+        <!-- Ruban défilant de la stack moderne remonté au sein du hero (fidèle à la maquette) -->
+        <HomeStackMarquee class="hero__marquee" />
       </div>
     </section>
 
-    <!-- Aperçu services (porté de ServicesPreview, Home.jsx) -->
+    <!-- Vitrine des 3 services cibles (Story 11.3 / AC-2) -->
     <section class="section">
       <div class="container">
-        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je fais</p>
-        <h2 class="section__title">Trois façons de travailler ensemble</h2>
+        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
+        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos applications</h2>
         <ul class="grid-3">
           <li v-for="service in services" :key="service.id">
-            <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
-              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
+            <ZCard class="offer" interactive tilt :accent="service.featured" :featured="service.featured">
+              <div class="offer__top">
+                <div class="offer__icon"><ZIcon :name="service.icon" /></div>
+                <span class="offer__no">{{ service.no }}</span>
+              </div>
               <h3 class="offer__title">{{ service.title }}</h3>
               <p class="offer__desc">{{ service.desc }}</p>

exec
/bin/zsh -lc "sed -n '3221,3620p' docs/implementation-artifacts/code-reviews/epic-11/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
+              <ul class="offer__points">
+                <li v-for="point in service.points" :key="point">
+                  <ZIcon name="check" class="offer__check" />
+                  <span>{{ point }}</span>
+                </li>
+              </ul>
+              <ul class="hero__tags offer__tags">
+                <li v-for="tag in service.tags" :key="tag">
+                  <ZTag>{{ tag }}</ZTag>
+                </li>
+              </ul>
+              <div class="offer__price">
+                <span>{{ service.price }}</span>
+              </div>
               <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
                 En savoir plus →
               </NuxtLink>
@@ -86,109 +84,292 @@
       </div>
     </section>
 
-    <!-- Stats + projets sélectionnés — section en creux partagée (stories 3.2 / 3.3) -->
-    <section class="section section--sunken">
+    <!-- Projets sélectionnés & Statistiques de réassurance (Story 11.4 / AC-1 & AC-2) -->
+    <section class="section">
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
+              @mousemove="onProjectMouseMove"
+              @mouseleave="onProjectMouseLeave"
+            >
+              <span class="work__no">{{ String(index + 1).padStart(2, "0") }}</span>
+              <div class="work__main">
+                <div class="work__topline">
+                  <h3 class="work__name">{{ project.name }}</h3>
+                  <span v-if="project.status" class="work__status">{{ project.status }}</span>
+                </div>
+                <p class="work__role">{{ project.role }}</p>
+                <p class="prose work__desc">{{ project.desc }}</p>
+                <ul class="hero__tags work__tags">
+                  <li v-for="(tag, tagIndex) in project.tags" :key="`${tag}-${tagIndex}`">
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
-          <li v-for="project in projects" :key="project.url">
-            <ZCard class="project" interactive :as="ZExternalLink" :href="project.url" rel="noopener noreferrer">
-              <div class="project__head">
-                <h3 class="project__name">{{ project.name }}</h3>
-                <span class="project__role">{{ project.role }}</span>
+        <!-- Liste des articles les plus récents -->
+        <ul v-if="articles && articles.length" class="journal">
+          <li v-for="article in articles" :key="article.path" class="journal__item">
+            <ZCard :as="NuxtLink" :to="article.path" :padded="false" interactive tilt class="jpost" data-hot>
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
+                  <li v-for="(tag, tagIndex) in article.tags" :key="`${tag}-${tagIndex}`">
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
+    <section class="section">
+      <div class="container">
+        <div class="cta">
+          <p class="eyebrow cta__eyebrow"><span aria-hidden="true">$ </span>./contact --start</p>
+          <h2 class="cta__title">
+            Un projet en tête ?<br />
+            Mettons-le <span class="cta__highlight">en production</span>.
+          </h2>
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
-// Page d'accueil — hero Terminal (A) + aperçu services + stats. Porté de Home.jsx
-// (HeroTerminal / ServicesPreview / StatsProjects) du UI kit : recréation Vue 3 +
-// tokens (aucune copie JSX). Dark-first, accent orange. (Stories 3.1, 3.2, 3.3)
+// Page d'accueil — refonte Hero Full Stack TS, Projets SaaS, Journal & CTA final (Story 11.4).
+// Architecture multi-pages Nuxt 4, dark-first, accent orange.
+import { onBeforeUnmount, onMounted, ref } from "vue";
 import { NuxtLink, ZExternalLink } from "#components";
-import { useTerminal } from "~/composables/useTerminal";
 import { SITE } from "~/data/site";
 
-// Contenu repris de data.js (window.SITE) — 1re personne, vouvoiement, pas d'emoji.
-const tagline = "Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils.";
-const tags = ["php", "symfony", "wordpress", "nest.js", "nuxt.js"];
+const isBootFinished = ref(false);
+const isReducedMotion = ref(false);
+let motionMq: MediaQueryList | null = null;
+
+function onMotionChange(e: MediaQueryListEvent) {
+  isReducedMotion.value = e.matches;
+}
+
+onMounted(() => {
+  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
+  isReducedMotion.value = motionMq.matches;
+  motionMq.addEventListener("change", onMotionChange);
+});
+
+onBeforeUnmount(() => {
+  motionMq?.removeEventListener("change", onMotionChange);
+});
+
+function onBootComplete() {
+  isBootFinished.value = true;
+}
+
+function onProjectMouseMove(event: MouseEvent) {
+  if (isReducedMotion.value) {
+    return;
+  }
+  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
+    return;
+  }
+  const target = event.currentTarget as HTMLElement | null;
+  if (!target) {
+    return;
+  }
+  const rect = target.getBoundingClientRect();
+  if (rect.width <= 0 || rect.height <= 0) {
+    return;
+  }
+  const px = (event.clientX - rect.left) / rect.width - 0.5;
+  const py = (event.clientY - rect.top) / rect.height - 0.5;
+  target.style.transform = `perspective(1000px) rotateX(${-py * 3.5}deg) rotateY(${px * 4.5}deg) translateY(-2px)`;
+}
+
+function onProjectMouseLeave(event: MouseEvent) {
+  const target = event.currentTarget as HTMLElement | null;
+  if (target) {
+    target.style.transform = "";
+  }
+}
 
-// Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
-// (accent + glow). Icônes mappées sur le set ZIcon (wp / code / spark, story 2.7).
-// `id` = clé v-for stable (indépendante du contenu affiché), cohérent avec terminalRows.
-const services = [
+interface HomeServiceOffer {
+  id: string;
+  no: string;
+  icon: "code" | "layers" | "spark";
+  title: string;
+  desc: string;
+  points: string[];
+  tags: string[];
+  price: string;
+  featured: boolean;
+}
+
+// Vitrine des 3 offres ciblées Full Stack TS (Story 11.3 / AC-2).
+const services: HomeServiceOffer[] = [
   {
-    id: "wordpress",
-    icon: "wp",
-    title: "WordPress sur-mesure",
-    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
+    id: "creation",
+    no: "01 / 03",
+    icon: "code",
+    title: "Création d'applications web & SaaS",
+    desc: "De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.",
+    points: [
+      "Architecture logicielle & APIs REST",
+      "Applications Vue 3 / Nuxt 4 & NestJS",
+      "Intégration Stripe & PostgreSQL",
+    ],
+    tags: ["Nuxt", "NestJS", "PostgreSQL", "Stripe Connect"],
+    price: "Sur devis / au sprint",
     featured: false,
   },
   {
-    id: "apps",
-    icon: "code",
-    title: "Applications web",
-    desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.",
+    id: "fullstack",
+    no: "02 / 03",
+    icon: "layers",
+    title: "Développement Full Stack TypeScript",
+    desc: "Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.",
+    points: [
+      "Composants Vue 3 / Nuxt avec TypeScript strict",
+      "Microservices & backend modulaire NestJS",
+      "Fiabilisation et optimisation des performances",
+    ],
+    tags: ["TypeScript", "Vue 3", "Nuxt", "NestJS", "Node.js"],
+    price: "Sur devis / TJM",
     featured: true,
   },
   {
-    id: "ia",
+    id: "evolution",
+    no: "03 / 03",
     icon: "spark",
-    title: "IA & automatisation",
-    desc: "L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.",
+    title: "Évolution & Architecture applicative",
+    desc: "Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).",
+    points: [
+      "Audits techniques de code & migrations de versions",
+      "Tests E2E TestCafé & tests unitaires Vitest",
+      "Pipelines CI/CD & conteneurisation Docker",
+    ],
+    tags: ["TestCafé", "Vitest", "Docker", "CI/CD"],
+    price: "Au forfait / audit",
     featured: false,
   },
 ];
 
-// Chiffres clés (data.js `stats`) — texte exact (séparateur ·), pas d'emoji.
-const stats = [
-  { id: "stat-1", value: "8+", label: "ans dans la tech" },
-  { id: "stat-2", value: "3", label: "stacks maîtrisés" },
-  { id: "stat-3", value: "1", label: "SaaS fondé · keova.app" },
-];
-
-// Projets sélectionnés — source unique `app/data/site.ts`. Cartes rendues en liens externes.
+// Projets sélectionnés — source unique `app/data/site.ts` (Story 11.4 / AC-1).
 const projects = SITE.projects;
 
-// Lignes du terminal décoratif, fidèles à HeroTerminal (Home.jsx). Codées en dur
-// côté template (pas de chiffres/projets inventés : stats & projets = stories 3.2 / 3.3).
-// `id` = clé v-for stable (indépendante du contenu affiché), garantie unique.
-const terminalRows = [
-  { id: "line-1", cmd: "whoami", out: "Simon Jouan — Développeur web freelance", tone: "ink" },
-  { id: "line-2", cmd: "cat stack.txt", out: "PHP/Symfony · WordPress · Node/Nest · Nuxt", tone: "blue" },
-  { id: "line-3", cmd: "ls ~/projets", out: "keova.app/   patio-conseil.fr/", tone: "green" },
+// Chiffres clés de réassurance (Story 11.4 / AC-2).
+const stats = [
+  { id: "stat-1", value: "11", label: "années d'expérience web" },
+  { id: "stat-2", value: "100%", label: "TypeScript & SaaS de bout en bout" },
+  { id: "stat-3", value: "QA", label: "culture d'automatisation & zéro régression" },
 ];
 
-// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le
-// header). No-op tant qu'aucun terminal n'est disponible (prerender). La
-// restylisation du terminal lui-même relève d'Epic 8.
-const { open: openTerminal } = useTerminal();
+// Récupération des 3 derniers articles du journal technique (Story 11.4 / AC-3).
+const { data: articles } = await useAsyncData("home-articles", () =>
+  queryCollection("blog").order("date", "DESC").limit(3).all(),
+);
 
 const siteUrl = useSiteUrl();
 const homeJsonLd = [
   {
     "@context": "https://schema.org",
     "@type": "WebSite",
-    name: "Simon Jouan — Développeur web freelance",
+    name: "Simon Jouan — Développeur Full Stack TypeScript",
     url: siteUrl,
-    description: tagline,
+    description: SITE.profile.role,
   },
   {
     "@context": "https://schema.org",
@@ -207,9 +388,9 @@ const homeJsonLd = [
 ];
 
 usePageSeo({
-  title: "Simon Jouan — Développeur web freelance & IA",
+  title: "Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS",
   description:
-    "Développeur web freelance à Valognes (Normandie) : création de sites WordPress sur-mesure, applications web (PHP/Symfony, Nest.js, Nuxt) et intégrations d'IA.",
+    "Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL.",
   path: "/",
   image: "/images/portrait.jpeg",
   type: "website",
@@ -234,55 +415,49 @@ usePageSeo({
   animation-delay: 80ms;
 }
 
-// ---- Hero (porté de kit.css : .hero, .hero__grad, .hero__in, .hero__grid…) ----
+// ---- Hero (porté de kit.css & Home - Awwwards.html) ----
 .hero {
   position: relative;
-  overflow: hidden;
-}
-
-.hero__grad {
-  // Dégradés décoratifs dérivés des tokens (orange accent + aubergine saturé) via
-  // color-mix — pas de valeur HSL en dur. Base = fond de page. Fidèle à kit.css
-  // (.hero__grad : aubergine ~60 % de saturation → token --aubergine-vivid).
-  background:
-    radial-gradient(900px 500px at 78% -10%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%),
-    radial-gradient(

exec
/bin/zsh -lc "sed -n '3621,4020p' docs/implementation-artifacts/code-reviews/epic-11/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
-      700px 500px at 0% 110%,
-      color-mix(in srgb, var(--aubergine-vivid) 28%, transparent),
-      transparent 60%
-    ),
-    var(--bg-page);
+  min-height: 100vh;
+  display: flex;
+  align-items: center;
+  padding: calc(var(--header-height) + var(--space-6)) 0 var(--space-10);
+  background: transparent;
 }
 
 .hero__in {
   position: relative;
   z-index: 1;
-
-  // padding-block uniquement : le gutter horizontal vient de .container
-  // (longhands distincts → pas de conflit de shorthand entre les deux classes).
-  padding-block: var(--space-20);
+  width: 100%;
 }
 
 .hero__grid {
   display: grid;
-  grid-template-columns: 1.05fr 0.95fr;
+  grid-template-columns: 1.1fr 0.9fr;
   gap: var(--space-12);
   align-items: center;
 }
 
+.hero__marquee {
+  margin-top: var(--space-10);
+}
+
 // .section / .container / .eyebrow / .prose : primitives de layout globales
 // (app/assets/scss/base/_layout.scss) — non redéclarées ici.
 
 // ---- Colonne texte ----
 .hero__title {
+  margin: 0;
   font-family: var(--font-mono);
-  font-size: var(--fs-6xl);
-  font-weight: var(--fw-light);
+  font-size: clamp(2.6rem, 6.4vw, 5.2rem);
+  font-weight: var(--fw-regular);
+  line-height: 0.98;
   letter-spacing: var(--ls-tight);
   color: var(--text-strong);
+  text-shadow: 0 2px 14px color-mix(in srgb, var(--surface-0) 80%, transparent);
 
   em {
-    font-style: normal;
+    font-style: italic;
     color: var(--accent);
   }
 }
@@ -294,6 +469,7 @@ usePageSeo({
   font-size: var(--fs-lg);
   line-height: var(--lh-relaxed);
   color: var(--text-body);
+  text-shadow: 0 1px 8px color-mix(in srgb, var(--surface-0) 70%, transparent);
 }
 
 .hero__cta {
@@ -303,168 +479,57 @@ usePageSeo({
   margin-bottom: var(--space-6);
 }
 
-// .hero__tags : primitive de layout globale (app/assets/scss/base/_layout.scss).
-
-// ---- Fenêtre terminal décorative (porté de TerminalWindow.jsx / Prompt.jsx) ----
-// Dérogation tokens-only assumée : les dimensions fixes du chrome (hauteur min
-// de fenêtre 300px, barre 30px, pastilles 13px / gap 7px) reproduisent à
-// l'identique la spec du composant DS et n'ont pas de token d'espacement
-// équivalent (échelle base-4). Couleurs, rayons et ombres restent en tokens.
-// `min-height` (et non `height`) : la fenêtre s'étend au contenu — pas de
-// scrollbar parasite si le rendu mono dépasse de quelques px.
-.hero-term {
-  display: flex;
-  flex-direction: column;
-  min-height: 300px;
-  overflow: hidden;
-  border: 1px solid var(--accent-2-soft);
-  border-radius: var(--radius-sm);
-  box-shadow: var(--glow-terminal);
-}
-
-.hero-term__bar {
-  position: relative;
-  display: flex;
-  flex: none;
+// ---- Badge de disponibilité & CTAs ----
+.hero__badge-wrap {
+  display: inline-flex;
   align-items: center;
   gap: var(--space-2);
-  height: 30px;
-  padding: 0 var(--space-3);
-  background: var(--aubergine-black);
-}
-
-.hero-term__dots {
-  display: flex;
-  align-items: center;
-  gap: 7px;
-}
-
-.hero-term__dot {
-  width: 13px;
-  height: 13px;
-  border-radius: var(--radius-circle);
-}
-
-.hero-term__dot--close {
-  background: var(--term-red);
-}
-
-.hero-term__dot--min {
-  background: var(--term-yellow);
-}
-
-.hero-term__dot--max {
-  background: var(--term-green);
-}
-
-.hero-term__title {
-  position: absolute;
-  inset: 0;
-  font-family: var(--font-mono);
-  font-size: var(--fs-xs);
-  letter-spacing: var(--ls-wide);
-  color: var(--text-muted);
-  text-align: center;
-  pointer-events: none;
-}
-
-.hero-term__body {
-  flex: 1;
-  min-height: 0;
-  padding: var(--space-4);
-  overflow: auto;
+  margin-bottom: var(--space-6);
   font-family: var(--font-mono);
   font-size: var(--fs-sm);
-  line-height: var(--lh-snug);
-  color: var(--ink-1);
-  background: var(--bg-terminal);
-  overflow-wrap: break-word;
-}
-
-@supports (backdrop-filter: blur(5px)) {
-  .hero-term__body {
-    background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
-    backdrop-filter: blur(5px);
-  }
-}
-
-.hero-term__line {
-  margin: 0;
-}
-
-.hero-term__out {
-  margin: 0 0 var(--space-4);
-}
-
-.hero-term__out--ink {
-  color: var(--ink-1);
-}
-
-.hero-term__out--blue {
-  color: var(--term-blue);
-}
+  color: var(--text-body);
 
-.hero-term__out--green {
-  color: var(--term-green);
-}
+  a {
+    color: var(--accent);
+    text-decoration: underline;
 
-// Ligne « help » cliquable → ouvre l'easter-egg terminal (bouton natif = clavier OK).
-.hero-term__open {
-  display: block;
-  width: 100%;
-  padding: 0;
-  font: inherit;
-  text-align: left;
-  cursor: pointer;
-  background: none;
-  border: none;
-  border-radius: var(--radius-xs);
+    &:hover {
+      color: var(--accent-hover);
+    }
 
-  &:focus-visible {
-    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
-    // relais), mais rendu en couleur système sous forced-colors (Windows High
-    // Contrast), où les box-shadow sont neutralisées — focus toujours visible.
-    outline: 2px solid transparent;
-    outline-offset: 2px;
-    box-shadow: var(--ring-accent);
+    &:focus-visible {
+      outline: 2px solid transparent;
+      outline-offset: 2px;
+      box-shadow: var(--ring-accent);
+    }
   }
 }
 
-// ---- Prompt (porté de Prompt.jsx : couleurs héritage) ----
-.prm {
-  font-family: var(--font-mono);
-}
-
-.prm__user {
-  font-weight: var(--fw-bold);
-  color: var(--prompt);
-}
-
-.prm__sep {
-  color: var(--ink-1);
-}
+.hero__pulse-dot {
+  width: 8px;
+  height: 8px;
+  border-radius: var(--radius-circle);
+  background: var(--success);
+  box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 60%, transparent);
+  animation: pulse-dot 2.2s infinite var(--ease-out);
 
-.prm__dir {
-  font-weight: var(--fw-bold);
-  color: var(--term-blue);
+  @media (prefers-reduced-motion: reduce) {
+    animation: none;
+  }
 }
 
-.prm__cmd {
-  color: var(--ink-1);
-}
+@keyframes pulse-dot {
+  0% {
+    box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 60%, transparent);
+  }
 
-// Caret : dimensions en em reprises telles quelles de Prompt.jsx (glyphe
-// proportionnel à la police) — pas de token équivalent pour un curseur.
-.prm__caret {
-  display: inline-block;
-  width: 0.55em;
-  height: 1.05em;
-  margin-left: 1px;
-  vertical-align: text-bottom;
-  background: var(--prompt);
+  70% {
+    box-shadow: 0 0 0 6px color-mix(in srgb, var(--success) 0%, transparent);
+  }
 
-  // Seule animation en boucle de l'UI (caret terminal). Keyframe globale (_root.scss).
-  animation: caret-blink 1s steps(1) infinite;
+  100% {
+    box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 0%, transparent);
+  }
 }
 
 .section__title {
@@ -495,13 +560,19 @@ usePageSeo({
   width: 100%;
 }
 
+.offer__top {
+  display: flex;
+  align-items: center;
+  justify-content: space-between;
+  margin-bottom: var(--space-4);
+}
+
 .offer__icon {
   display: flex;
   align-items: center;
   justify-content: center;
   width: var(--space-10); // 40px
   height: var(--space-10);
-  margin-bottom: var(--space-4);
 
   // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
   // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
@@ -511,6 +582,13 @@ usePageSeo({
   border-radius: var(--radius-md);
 }
 
+.offer__no {
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  letter-spacing: var(--ls-wider);
+  color: var(--text-faint);
+}
+
 .offer__title {
   margin-bottom: var(--space-2);
   font-family: var(--font-mono);
@@ -527,8 +605,47 @@ usePageSeo({
   color: var(--text-body);
 }
 
-.offer__more {
+.offer__points {
+  display: flex;
+  flex-direction: column;
+  gap: var(--space-2);
+  margin: 0 0 var(--space-4);
+  padding: 0;
+  list-style: none;
+
+  li {
+    display: flex;
+    gap: var(--space-2);
+    align-items: flex-start;
+    font-family: var(--font-mono);
+    font-size: var(--fs-xs);
+    line-height: var(--lh-normal);
+    color: var(--text-muted);
+  }
+}
+
+.offer__check {
+  flex-shrink: 0;
+  margin-top: calc(var(--space-1) / 2);
+  font-size: var(--fs-sm);
+  color: var(--term-green);
+}
+
+.offer__tags {
+  margin-bottom: var(--space-4);
+}
+
+.offer__price {
   margin-top: auto;
+  padding-top: var(--space-4);
+  border-top: 1px dashed var(--border-subtle);
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  color: var(--accent);
+}
+
+.offer__more {
+  margin-top: var(--space-3);
   font-family: var(--font-mono);
   font-size: var(--fs-sm);
   color: var(--accent);
@@ -547,37 +664,228 @@ usePageSeo({
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
+  grid-template-columns: var(--fs-6xl) 1fr auto;
+  gap: var(--space-6);
+  align-items: center;
+  padding: var(--space-8) var(--space-3);
+  border-top: 1px solid var(--border-subtle);
+  text-decoration: none;
+  color: inherit;
+  transition:
+    padding-left var(--dur-slow) var(--ease-out),
+    background var(--dur-slow) var(--ease-standard),
+    transform var(--dur-fast) var(--ease-standard);
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

exec
/bin/zsh -lc "sed -n '4021,4420p' docs/implementation-artifacts/code-reviews/epic-11/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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
+  background: color-mix(in srgb, var(--surface-1) 85%, transparent);
+  border: 1px solid var(--border-subtle);
+  border-radius: var(--radius-md);
+  box-shadow: var(--shadow-2);
+  backdrop-filter: blur(8px);
+  transition:
+    border-color var(--dur-fast) var(--ease-standard),
+    transform var(--dur-fast) var(--ease-standard);
+
+  &:hover {
+    border-color: var(--border-strong);
+    transform: translateY(-2px);
+  }
 
   b {
     display: block;
-    font-size: var(--fs-4xl);
-    font-weight: var(--fw-light);
+    margin-bottom: var(--space-2);
+    font-family: var(--font-mono);
+    font-size: clamp(var(--fs-4xl), 4.5vw, var(--fs-5xl));
+    font-weight: var(--fw-bold);
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
@@ -587,51 +895,154 @@ usePageSeo({
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
+  height: 10rem;
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
 }
 
-.project__role {
+.jpost__desc {
+  margin: 0 0 var(--space-4);
+  font-size: var(--fs-sm);
+  color: var(--text-muted);
+}
+
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
 }
 
-.project__desc {
-  margin: var(--space-3) 0 var(--space-4);
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
+}
+
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
 }
 
-// ---- Responsive (cf. kit.css @media max-width: 900px) ----
+// ---- Bloc CTA final (porté de .cta) ----
+.cta {
+  position: relative;
+  padding: clamp(48px, 7vw, 84px) var(--space-6);
+  overflow: hidden;
+  text-align: center;
+  background:
+    radial-gradient(ellipse 80% 120% at 50% 0%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%),
+    color-mix(in srgb, var(--surface-1) 85%, transparent);
+  border: 1px solid var(--border-subtle);
+  border-radius: var(--radius-lg);
+  backdrop-filter: blur(10px);
+  box-shadow: var(--shadow-3), var(--shadow-hairline);
+}
+
+.cta__eyebrow {
+  display: inline-block;
+  margin-bottom: var(--space-4);
+}
+
+.cta__title {
+  margin: 0 0 var(--space-4);
+  font-family: var(--font-mono);
+  font-size: clamp(2rem, 4.5vw, 3.2rem);
+  font-weight: var(--fw-regular);
+  line-height: 1.08;
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
+  font-size: var(--fs-lg);
+  line-height: var(--lh-relaxed);
+  color: var(--text-muted);
+}
+
+.cta__actions {
+  display: flex;
+  flex-wrap: wrap;
+  gap: var(--space-4);
+  justify-content: center;
+  align-items: center;
+}
+
+// ---- Responsive ----
 @media (width <= 900px) {
   .hero__grid {
     grid-template-columns: 1fr;
@@ -642,15 +1053,68 @@ usePageSeo({
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

exec
/bin/zsh -lc "sed -n '4421,4820p' docs/implementation-artifacts/code-reviews/epic-11/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
 }
 
 @media (prefers-reduced-motion: reduce) {
-  .anim,
-  .prm__caret {
+  .anim {
     animation: none;
   }
+
+  .work__row,
+  .work__go,
+  .jpost__arrow,
+  .seeall {
+    transition: none;
+  }
+
+  .stat {
+    transition: none;
+
+    &:hover {
+      transform: none;
+    }
+  }
+
+  .work__row {
+    transform: none !important;
+  }
+
+  .work__row--link:hover {
+    padding-left: var(--space-3);
+
+    .work__go {
+      transform: none;
+    }
+  }
+
+  .jpost:hover {
+    .jpost__arrow {
+      transform: none;
+    }
+  }
 }
 </style>
diff --git a/docs/contexte_malt.md b/docs/contexte_malt.md
new file mode 100644
index 0000000..76b7ec9
--- /dev/null
+++ b/docs/contexte_malt.md
@@ -0,0 +1,1204 @@
+# Contexte — Profil professionnel de Simon Jouan et direction de positionnement
+
+## 1. Objectif général
+
+Le site personnel de Simon doit raconter **exactement la même histoire que son profil Malt**.
+
+Le but n’est pas de présenter toute sa carrière ni toutes ses compétences.
+
+Le but est qu’un prospect comprenne immédiatement :
+
+> **Simon Jouan est un développeur Full Stack TypeScript spécialisé dans la conception et le développement d’applications web et SaaS modernes avec Nuxt et NestJS.**
+
+Son expérience en QA, automatisation et IA constitue un **différenciateur**, mais ne doit pas devenir un second positionnement concurrent.
+
+Le positionnement principal doit donc rester :
+
+**Développeur Full Stack TypeScript — Nuxt / NestJS**
+
+---
+
+# 2. Situation professionnelle actuelle
+
+Simon est actuellement dans une situation hybride :
+
+- salarié chez **Kidizz** ;
+- développeur freelance en micro-entreprise ;
+- créateur de produits SaaS ;
+- développeur de projets personnels autour de l’IA et des agents.
+
+Il ne faut cependant pas construire le site autour de l’idée :
+
+> « salarié qui fait quelques projets à côté ».
+
+La vitrine publique doit le présenter d’abord comme :
+
+> **développeur Full Stack TypeScript freelance / product builder**
+
+Son emploi salarié participe à sa crédibilité et à son expérience, mais n’est pas la proposition de valeur principale du site.
+
+---
+
+# 3. Mission recherchée
+
+Simon cherche prioritairement des missions de :
+
+- développement Full Stack TypeScript ;
+- développement d’applications SaaS ;
+- création de produits web ;
+- développement d’applications métier ;
+- développement frontend Nuxt / Vue ;
+- développement backend NestJS / Node.js ;
+- évolution ou reprise d’applications TypeScript existantes ;
+- architecture et développement de MVP ;
+- intégration d’API et services tiers ;
+- intégration de paiements, authentification, bases de données, etc.
+
+Le profil ne doit **pas** être optimisé prioritairement pour :
+
+- QA pure ;
+- test manuel ;
+- missions WordPress ;
+- Drupal ;
+- Prestashop ;
+- développement PHP legacy ;
+- création de sites vitrines basiques ;
+- SEO ;
+- prompt engineering isolé ;
+- prestations « IA » génériques ;
+- automatisation no-code comme activité principale.
+
+Simon peut réaliser certaines de ces choses, mais elles ne doivent pas être sa porte d’entrée commerciale.
+
+---
+
+# 4. Client cible
+
+Le site doit principalement parler à :
+
+- startups ;
+- PME ;
+- éditeurs SaaS ;
+- équipes produit ;
+- entrepreneurs lançant un produit numérique ;
+- entreprises ayant besoin de faire évoluer une application métier ;
+- petites équipes techniques recherchant un développeur autonome.
+
+Le prospect idéal a typiquement un besoin du type :
+
+> « Nous devons construire ou faire évoluer un SaaS / une application web et nous avons besoin de quelqu’un capable de gérer sérieusement le frontend, le backend et les problématiques produit. »
+
+Simon n’est pas à positionner comme simple exécutant recevant des maquettes et des tickets.
+
+Une partie de sa valeur vient justement de sa capacité à :
+
+- comprendre le produit ;
+- challenger une solution ;
+- concevoir une architecture ;
+- travailler de manière autonome ;
+- raisonner sur la qualité ;
+- construire de bout en bout.
+
+---
+
+# 5. Positionnement recommandé
+
+Formulation conceptuelle :
+
+> **J’aide les startups, PME et équipes produit à concevoir, développer et faire évoluer leurs applications web et SaaS avec TypeScript, Nuxt et NestJS.**
+
+Cette phrase sert de boussole.
+
+Elle n’a pas nécessairement besoin d’être utilisée mot pour mot sur le site.
+
+Une variante plus directe peut être :
+
+> **Développeur Full Stack TypeScript spécialisé dans les applications web et SaaS avec Nuxt et NestJS.**
+
+Le message doit rester extrêmement compréhensible.
+
+Il ne faut pas remplacer cela par une accroche abstraite du type :
+
+> « Je transforme vos idées en expériences numériques innovantes grâce à la puissance de la technologie. »
+
+Ce serait joli et complètement inutile.
+
+---
+
+# 6. Titre professionnel
+
+Le titre retenu sur Malt est :
+
+> **Développeur Full Stack TypeScript — Nuxt / NestJS**
+
+C’est également la direction recommandée pour le site.
+
+Variantes éventuellement acceptables selon l’emplacement :
+
+**Développeur Full Stack TypeScript**
+
+ou :
+
+**Développeur Full Stack TypeScript spécialisé en Nuxt & NestJS**
+
+ou pour une balise SEO / contexte plus descriptif :
+
+**Développeur freelance TypeScript, Nuxt & NestJS — applications web et SaaS**
+
+Mais le site ne doit pas multiplier les identités :
+
+- développeur ;
+- QA Engineer ;
+- AI Engineer ;
+- consultant ;
+- product builder ;
+- CTO ;
+- entrepreneur ;
+- automation expert.
+
+Simon est plusieurs de ces choses dans les faits.
+
+Commercialement, il lui faut néanmoins **une porte d’entrée principale**.
+
+---
+
+# 7. Stack principale à mettre en avant
+
+## Premier niveau
+
+Les technologies qui doivent apparaître très clairement :
+
+- TypeScript ;
+- Nuxt ;
+- Vue.js ;
+- NestJS ;
+- Node.js ;
+- PostgreSQL.
+
+Ce sont les mots qui doivent structurer l’identité technique.
+
+## Deuxième niveau
+
+À utiliser comme éléments de crédibilité selon les projets :
+
+- REST API ;
+- TypeORM ;
+- Stripe ;
+- Stripe Connect ;
+- Docker ;
+- Git ;
+- authentification ;
+- architecture SaaS ;
+- API tierces ;
+- bases de données ;
+- déploiement ;
+- sécurité applicative ;
+- testing ;
+- CI/CD lorsque pertinent.
+
+## Troisième niveau
+
+Compétences réelles mais qui ne doivent pas définir son positionnement :
+
+- Appium ;
+- WebdriverIO ;
+- TestCafe ;
+- automatisation E2E ;
+- agents IA ;
+- LLM ;
+- MCP ;
+- n8n ;
+- Make ;
+- Nuxt UI ;
+- PHP ;
+- Symfony ;
+- WordPress ;
+- Drupal ;
+- Prestashop.
+
+Ces compétences peuvent apparaître dans les expériences ou une page détaillée.
+
+Elles ne doivent pas envahir le hero ou la proposition de valeur.
+
+---
+
+# 8. Nuxt UI
+
+Simon utilise Nuxt UI.
+
+Ce n’est néanmoins **pas suffisamment structurant pour devenir une compétence principale de marque personnelle**.
+
+Sur Malt, l’idée est de faire sortir Nuxt UI des compétences les plus visibles au profit de **Node.js**.
+
+Le site doit suivre la même logique :
+
+**Nuxt** est une expertise structurante.
+
+**Nuxt UI** est un outil utilisé à l’intérieur de cette expertise.
+
+---
+
+# 9. Le rôle de l’IA dans le positionnement
+
+Simon utilise énormément l’IA.
+
+Il utilise notamment régulièrement :
+
+- Codex ;
+- Claude ;
+- Gemini / environnement Antigravity ;
+- agents IA ;
+- automatisations ;
+- outils agentiques.
+
+Il expérimente également des outils comme :
+
+- n8n ;
+- Make.
+
+Il développe des systèmes et workflows agentiques.
+
+Mais il ne faut surtout pas transformer son site en :
+
+> « Consultant IA / Expert IA / Prompt Engineer ».
+
+Ce serait une dilution du positionnement actuel.
+
+L’IA doit plutôt être présentée comme **une compétence transversale et un avantage de productivité / engineering**.
+
+Exemple :
+
+> Utilisation avancée de l’IA et des agents de développement pour accélérer certaines tâches de conception, développement, recherche, QA et code review.
+
+L’idée :
+
+> **Simon est un développeur Full Stack moderne qui maîtrise profondément les outils IA.**
+
+Pas :
+
+> **Simon fait de l’IA et aussi un peu de développement web.**
+
+---
+
+# 10. Le rôle de la QA
+
+Simon possède une expérience importante en QA et automatisation de tests.
+
+C’est historiquement une vraie partie de son parcours professionnel.
+
+Il maîtrise notamment :
+
+- stratégie QA ;
+- tests E2E ;
+- automatisation web ;
+- automatisation mobile ;
+- TypeScript pour le testing ;
+- Appium ;
+- WebdriverIO ;
+- TestCafe ;
+- conception de plans de tests ;
+- industrialisation de la qualité ;
+- agents IA pour des tâches QA.
+
+Cette expertise ne doit **pas disparaître**.
+
+Mais elle doit changer de rôle.
+
+Elle n’est plus :
+
+> « l’un des métiers que Simon essaie de vendre ».
+
+Elle devient :
+
+> **un avantage compétitif de Simon comme développeur Full Stack.**
+
+Message implicite :
+
+> Simon ne sait pas uniquement produire du code. Son parcours QA lui donne une culture particulièrement forte de la fiabilité, des cas limites, de la testabilité et des parcours utilisateurs critiques.
+
+C’est intéressant commercialement parce que cela différencie Simon d’un Full Stack qui ne pense qu’à faire fonctionner le happy path.
+
+---
+
+# 11. Expérience Kidizz
+
+Simon travaille chez Kidizz depuis plusieurs années.
+
+Son expérience y est fortement liée à :
+
+- QA ;
+- automatisation ;
+- applications web ;
+- applications mobiles ;
+- TypeScript ;
+- Node.js ;
+- TestCafe ;
+- Appium ;
+- WebdriverIO ;
+- conception et maintenance des tests ;
+- fiabilisation des parcours critiques ;
+- utilisation d’agents IA et d’outils modernes dans les workflows QA.
+
+Cette expérience doit rester visible.
+
+Mais sur le site, elle doit jouer le rôle suivant :
+
+> **preuve d’expérience professionnelle longue dans une vraie équipe produit et d’une forte culture software engineering / qualité.**
+
+Il ne faut pas essayer artificiellement de transformer Kidizz en mission Full Stack si ce n’est pas ce que Simon y fait réellement.
+
+---
+

exec
/bin/zsh -lc 'wc -l docs/implementation-artifacts/code-reviews/epic-11/full.diff && tail -n 240 docs/implementation-artifacts/code-reviews/epic-11/full.diff' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
    8758 docs/implementation-artifacts/code-reviews/epic-11/full.diff
 - Mettre à jour quand la stack change.
 - Revue périodique ; retirer les règles devenues évidentes.
 
-Dernière mise à jour : 2026-06-29 (post-Epic 8 : refonte terminal **livrée** — `components/terminal/` intégralement en `<script setup>`, commandes `skills`/`projets`/`contact`/`clear` ajoutées, dernier résidu Options API = `WindowWrapperComponent`/`CurrentTime` côté header ; source de contenu partagé unique `app/data/site.ts` (DRY) ; checklist a11y forced-colors/clavier/contraste à embarquer en amont des consignes Epic 9 — dernier épic, puis fin de refonte SEO + RGPD + déploiement gh-pages ; post-Epic 7 : décision Epic 8 = refonte complète du terminal — migration `components/terminal/` vers `<script setup>` + restyle DS, vérif commande-par-commande ; Web3Forms acté côté SPEC pour le formulaire `/contact` ; post-Epic 6 : pipeline `@nuxt/content` v3 — collections typées `content.config.ts`, Shiki désactivé, gotchas Docker/SQLite + `:deep()` ancres de titres ; post-Epic 5 : primitives de layout globales `base/_layout.scss` + convention a11y titres/listes — eyebrow-as-`h2`, séquences en `<ol>`/`<ul>` ; post-Epic 4 : réfs visuelles par page précisées pour la routine de diff avant revue ; post-Epic 3 : pièges `padding` shorthand multi-classes + vérif visuelle Chrome DevTools avant revue pour les stories de page ; post-Epic 2 : stack réelle Nuxt 4 / TS 6 / ESLint 10 flat / @nuxt/content 3, primitives DS `ui/`, tokens CSS globaux, règles a11y)
+Dernière mise à jour : 2026-09-13 (post-Epic 10 : refonte complète livrée en production sur https://jouan.ovh — epics 1→10 done ; 13 routes statiques pré-rendues ; validation runtime a11y émulée ; primitive ZExternalLink ; SEO centralisé usePageSeo/useSiteUrl ; conformité légale RGPD /confidentialite et /mentions-legales ; déploiement réel gh-pages prouvé sur main avec HTTPS forcé et DNS OVH opérationnel).
diff --git a/docs/specs/spec-home-awwwards/.decision-log.md b/docs/specs/spec-home-awwwards/.decision-log.md
new file mode 100644
index 0000000..1374d4a
--- /dev/null
+++ b/docs/specs/spec-home-awwwards/.decision-log.md
@@ -0,0 +1,33 @@
+# Decision log — spec-home-awwwards
+
+## 2026-09-13 — Mise à jour : Intégration du profil Malt & Direction Stratégique
+
+Mise à jour majeure de la spécification pour aligner la refonte d'accueil avec les exigences de positionnement commercial et les éléments factuels du profil Malt officiel de Simon Jouan :
+- **Intrants consommés :** `docs/contexte_malt.md` (extraction du profil officiel Malt et capture `media_1789306841421.png`), `docs/direction_strategique_site.md` (entonnoir commercial, choix de positionnement, ce qu'il faut sacrifier), et la maquette prototype `Home - Awwwards.html`.
+- **Alignement strict du rôle et de la proposition de valeur :**
+  - Titre officiel : « Développeur Full Stack TypeScript — Nuxt / NestJS ».
+  - Cœur de cible : Startups, PME, CTOs et équipes produit avec besoins en applications web et SaaS.
+  - Différenciateurs clés : Culture produit (fondateur SaaS), culture qualité rare (automatisation de tests E2E héritée de Kidizz), et accélération par l'IA avancée.
+  - Relégation formelle de WordPress, PHP legacy et de la QA manuelle au second plan historique (pas d'offres vitrines sur la home).
+- **Refonte des preuves (portfolio) :**
+  - Remplacement de `patio-conseil.fr` par le trio SaaS aligné avec Malt :
+    1. **Keova** : Pièce maîtresse SaaS B2B en production (Nuxt 4 / NestJS / PostgreSQL / TypeORM / Stripe Connect) avec lien live `https://keova.app`.
+    2. **TryOn** : Étude de cas d'ingénierie SaaS & IA générative (CTO & Full Stack). Projet développé et livré, arrêté/hors ligne depuis début 2026 (01/2026). Présenté de manière factuelle et transparente comme étude de cas technique d'architecture et de complexité IA, sans lien externe mort (évite les erreurs 404).
+    3. **Nodium** : Laboratoire technique d'agents IA desktop et orchestration.
+- **Intégration de Malt dans le parcours :**
+  - Ajout d'un badge de statut vérifié avec lien direct vers le profil Malt (`CAP-3`).
+  - Ajout d'un CTA secondaire direct vers Malt dans le bloc final (`CAP-8`).
+
+### Validation Two-Pass (Spec Law) :
+
+**Pass 1 — Cohérence :**
+- Les 10 capacités (CAP-1 à CAP-10) respectent le format strict `intent` (WHAT) et `success` vérifiable.
+- Les contraintes réaffirment l'architecture multi-pages, la centralisation des données dans `app/data/site.ts`, l'usage systématique de `<ZExternalLink>`, et l'exécution exclusive sous conteneur Docker.
+- Les non-goals interdisent expressément le repli vers le one-page à ancres et la dispersion WordPress/PHP en vitrine.
+- Le signal de succès s'appuie sur la validation par la gate Docker (`pnpm lint`, `pnpm typecheck`, `pnpm generate`).
+
+**Pass 2 — Préservation :**
+- Toutes les exigences de `direction_strategique_site.md` et de `contexte_malt.md` sont couvertes sans déperdition : le rôle, la stack ordonnée, les 3 services, les 3 projets SaaS, l'expérience Kidizz, le lien vers Malt et les CTAs orientés mission.
+- Les composants visuels et interactifs de `Home - Awwwards.html` (auroras, boot sequence, terminal cinétique, marquee, cartes en relief) sont intégralement conservés et stylés selon les tokens du Design System.
+
+**Verdict :** Spécification complète, rigoureuse et validée. Prête pour le passage à l'étape suivante : découpage en Epic 11 et stories (`bmad-create-epics-and-stories`).
diff --git a/docs/specs/spec-home-awwwards/SPEC.md b/docs/specs/spec-home-awwwards/SPEC.md
new file mode 100644
index 0000000..9d91973
--- /dev/null
+++ b/docs/specs/spec-home-awwwards/SPEC.md
@@ -0,0 +1,86 @@
+---
+id: SPEC-home-awwwards
+companions:
+  - sections-mapping.md
+  - ../../contexte_malt.md
+  - ../../direction_strategique_site.md
+  - ../../project-context.md
+sources:
+  - ../../design_system/ui_kits/jouan-site/Home - Awwwards.html
+---
+
+> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.
+
+# Refonte immersive et repositionnement commercial de la page d'accueil (Home Awwwards)
+
+## Why
+
+Transformer la page d'accueil de `jouan.ovh` en un **entonnoir de conversion commercial de haut niveau (« Awwwards level »)** pour positionner Simon Jouan comme **Développeur Full Stack TypeScript spécialisé Nuxt / NestJS pour applications web et SaaS**.
+Cette refonte traduit la puissance visuelle de `Home - Awwwards.html` (auroras cinétiques, séquence de boot `jouan.os`, terminal hero interactif, marquee de stack, cartes en relief) tout en alignant rigoureusement le message avec le profil Malt officiel (`contexte_malt.md`) et la stratégie commerciale (`direction_strategique_site.md`) :
+1. **Clarté immédiate du rôle :** Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL), capable de concevoir et faire évoluer des produits web et SaaS de bout en bout.
+2. **Preuves concrètes avant discours marketing :** Remplacement des anciens projets vitrines par le trio SaaS aligné avec Malt : **Keova** (pièce maîtresse ERP équestre), **TryOn** (SaaS IA générative) et **Nodium** (laboratoire d'agents IA), appuyés par l'expertise qualité logicielle issue de Kidizz.
+3. **Maintien de l'architecture multi-pages :** Conserver les routes dédiées existantes (`/services`, `/about`, `/blog`, `/contact`) au lieu du one-page à ancres intra-page `#` de la maquette brute.
+
+## Capabilities
+
+- id: CAP-1
+  intent: Le visiteur arrivant sur la page d'accueil perçoit un arrière-plan atmosphérique immersif composé d'auroras colorées dynamiques, d'une grille de points et de scanlines terminales.
+  success: La pile atmosphérique s'affiche de manière fluide en pur CSS sans altérer les performances de scroll, et neutralise tout mouvement sous `prefers-reduced-motion: reduce`.
+
+- id: CAP-2
+  intent: Le visiteur accédant à la page d'accueil assiste à une séquence de boot interactive optionnelle (`jouan.os`), contournable instantanément.
+  success: L'overlay de démarrage affiche la montée en charge progressive, s'efface automatiquement après 1 à 1.5s ou sur clic / touche Escape, ne s'exécute pas sous `prefers-reduced-motion: reduce`, et déclenche la frappe du terminal hero.
+
+- id: CAP-3
+  intent: Le visiteur visualise un hero commercial percutant combinant le titre officiel (« Développeur Full Stack TypeScript — Nuxt / NestJS »), un pitch orienté création/évolution SaaS, un badge de disponibilité avec lien accessible vers le profil Malt, et une fenêtre terminal hero simulant la frappe de commandes clés.
+  success: Le hero communique instantanément le rôle et la stack clé (Nuxt, NestJS, PostgreSQL), propose un CTA primaire vers `/contact` (« Discuter de votre projet »), un CTA secondaire vers `/about` (« Voir le parcours & CV »), un lien externe vers Malt (`<ZExternalLink>`), et déroule la séquence de frappe terminale avec caret natif.
+
+- id: CAP-4
+  intent: Le visiteur observe un bandeau défilant continu (marquee) exposant la stack technique moderne prioritaire sans dispersion legacy.
+  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
+
+- id: CAP-5
+  intent: Le visiteur découvre sur la home une vitrine des trois offres de services ciblées sous forme de cartes structurées invitant à approfondir.
+  success: Les trois cartes de service (1. Création d'applications web & SaaS, 2. Développement Full Stack TypeScript, 3. Évolution & architecture applicative) affichent numéro, résumé de valeur et compétences clés, avec des liens cliquables guidant l'utilisateur vers `/services`.
+
+- id: CAP-6
+  intent: Le visiteur consulte les preuves concrètes de réalisations à travers les projets phares alignés avec le profil Malt, accompagnés des statistiques clés de parcours.
+  success: Les projets présentés valorisent Keova (pièce maîtresse SaaS en production avec lien live `<ZExternalLink>`), TryOn (étude de cas d'ingénierie SaaS & IA / MVP livré, sans lien mort vers un domaine inactif) et Nodium (lab technique agents IA), chacun avec rôle, stack et description orientée valeur, accompagnés des 3 compteurs statistiques clés (11 ans d'expérience, SaaS fondés/opérés, culture qualité).
+
+- id: CAP-7
+  intent: Le visiteur accède à une mise en avant des derniers articles de veille technique et d'ingénierie logicielle.
+  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.
+
+- id: CAP-8
+  intent: Le visiteur en bas de page dispose d'un bloc d'appel à l'action orienté mission invitant à démarrer une collaboration, avec accès direct au formulaire et à Malt.
+  success: Le bloc CTA offre un bouton d'action principal vers `/contact` (« Discuter de votre projet »), un lien vers le profil Malt (`<ZExternalLink>`), et un lien secondaire vers `/about`, stylés selon les tokens du Design System.
+
+- id: CAP-9
+  intent: Le visiteur naviguant depuis le menu du header ou les liens de la home parcourt des routes complètes indépendantes.
+  success: Les éléments de navigation du header et les liens d'approfondissement ciblent les routes Nuxt `/services`, `/about`, `/blog` et `/contact`, sans repli vers des ancres intra-page `#`.
+
+- id: CAP-10
+  intent: Le visiteur sur ordinateur de bureau bénéficie d'un micro-curseur interactif fluide (`dot` + `ring`) réagissant aux zones cliquables.
+  success: Le curseur custom est désactivé sur les appareils tactiles (`@media (hover: none)`), n'altère pas le curseur système natif en cas d'erreur JS, et s'agrandit au survol des interactifs marqués `data-hot`.
+
+## Constraints
+
+- Le développement de cette refonte doit s'effectuer exclusivement sur une branche dédiée issue de `develop` (ex. `feat/home-awwwards`), préservant la branche `main` de production.
+- Les données partagées (`SITE.profile`, `SITE.skills`, `SITE.projects` dans `app/data/site.ts`) doivent être mises à jour pour refléter l'identité Malt et les nouveaux projets (Keova, TryOn, Nodium), sans jamais de hardcoding local dans la page.
+- Tous les styles doivent consommer les tokens CSS globaux (`var(--token)`) et les primitives partagées du Design System (`ZButton`, `ZCard`, `ZExternalLink`, `ZTag`).
+- Tout lien ouvrant un nouvel onglet (Keova, Malt, GitHub, etc.) DOIT utiliser la primitive `<ZExternalLink>`.
+- Les pages secondaires existantes (`/services`, `/about`, `/blog`, `/contact`, `/confidentialite`, `/mentions-legales`) doivent rester des routes distinctes ; la home sert de portail vitrine et ne doit pas devenir une One-Page.
+- Respect strict de `prefers-reduced-motion: reduce` : animations neutralisées à `0.01ms`, auroras figées, marquee statique, boot overlay passé instantanément. Seul le caret de frappe du terminal est autorisé à clignoter (CAP-11).
+- Compatibilité statique SSG (Nitro) : tout accès au DOM (`document`, `window`, `sessionStorage`, `IntersectionObserver`, `matchMedia`) doit être encapsulé dans `onMounted()` ou protégé par `import.meta.client`.
+
+## Non-goals
+
+- Transformer le site `jouan.ovh` en une application One-Page à scroll vertical exclusif avec ancres intra-page.
+- Présenter WordPress, PHP legacy ou la QA manuelle comme des offres commerciales de premier niveau sur la home.
+- Modifier l'architecture ou le comportement interne de l'easter-egg terminal draggable (`components/terminal/`).
+- Introduire des bibliothèques JavaScript externes lourdes (GSAP, Three.js, Canvas shaders) pour réaliser les effets atmosphériques et cinétiques.
+- Modifier les schémas de collections `@nuxt/content` ou l'API de contact Web3Forms.
+
+## Success signal
+
+- La page d'accueil [`app/pages/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue) communique immédiatement le positionnement « Développeur Full Stack TypeScript — Nuxt / NestJS », restitue l'atmosphère immersive et la fluidité visuelle de `Home - Awwwards.html`, expose les projets Keova, TryOn et Nodium ainsi que le lien vers le profil Malt, assure une navigation fluide vers les routes enfants, et valide la suite de contrôle Docker (`docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`) avec 13 routes pré-rendues sans erreur.
diff --git a/docs/specs/spec-home-awwwards/sections-mapping.md b/docs/specs/spec-home-awwwards/sections-mapping.md
new file mode 100644
index 0000000..4eb2b0b
--- /dev/null
+++ b/docs/specs/spec-home-awwwards/sections-mapping.md
@@ -0,0 +1,98 @@
+# Cartographie des sections & Adaptation Multi-pages
+
+Ce document détaille la transposition de la maquette source `Home - Awwwards.html` vers l'architecture applicative Nuxt 4 de `jouan.ovh`, en application directe de la direction stratégique (`direction_strategique_site.md`) et du profil Malt (`contexte_malt.md`).
+
+---
+
+## 1. Principe directeur : Vitrine immersive vs Pages complètes
+
+La maquette HTML brute `Home - Awwwards.html` a été conçue comme un prototype autonome avec des ancres intra-page (`#services`, `#work`, `#journal`, `#contact`).  
+Dans `jouan.ovh`, la home refondue agit comme un **entonnoir de conversion commercial**, orientant les visiteurs vers les pages complètes du site :
+
+| Section Maquette Awwwards | Rôle sur la Home refondue | Contenu aligné Malt / Direction Stratégique | Destination / Route cible |
+| :--- | :--- | :--- | :--- |
+| **Navigation Header** | Menu de navigation du site | Liens directs vers les pages applicatives Nuxt. | Liens Nuxt vers `/services`, `/about`, `/blog`, `/contact`. |
+| **Hero & Terminal** | Positionnement commercial immédiat | « Développeur Full Stack TypeScript — Nuxt / NestJS » + pitch création/évolution SaaS + badge Malt. | CTA primaire vers `/contact` (« Discuter de votre projet »), secondaire vers `/about`, lien externe vers profil Malt. |
+| **Marquee Stack** | Défilé continu des technologies prioritaires | Stack moderne ciblée : TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API. | Ruban visuel continu alimenté par `SITE.skills`. |
+| **Services (3 cartes)** | Présentation des 3 offres ciblées | 1. Création d'apps web & SaaS<br>2. Dév Full Stack TypeScript<br>3. Évolution & architecture applicative | Cartes cliquables avec renvoi vers `/services` (où se trouve le déroulé du process en 4 étapes). |
+| **Projets sélectionnés** | Preuves concrètes de réalisations SaaS | 1. **Keova** (SaaS ERP équestre Nuxt 4/NestJS/PostgreSQL/Stripe)<br>2. **TryOn** (SaaS IA générative Nuxt/NestJS/Python/ComfyUI)<br>3. **Nodium** (Lab d'agents IA desktop) | Liens externes vers les projets via `<ZExternalLink>`, renvoi vers `/about` pour le parcours complet (Kidizz, CINS). |
+| **Statistiques clés** | Réassurance et crédibilité | 11 ans d'expérience web · 2 SaaS fondés / opérés · Culture QA & automatisation E2E. | Compteurs visuels intégrés à la section projets. |
+| **Journal (Blog)** | Vitrine d'ingénierie logicielle | Les 3 derniers articles techniques du blog. | Lien global « Voir tous les articles » menant vers `/blog`. |
+| **CTA Final** | Appel à la conversion orienté mission | « Un projet d'application web ou SaaS ? Discutons-en. » | Bouton vers `/contact`, lien externe vers profil Malt (`<ZExternalLink>`). |
+
+---
+
+## 2. Découpage technique et éditorial des blocs
+
+### A. Pile Atmosphérique (`.atmos`)
+- **Composants :** 3 auroras (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`) en gradients radiaux floutés avec animations `@keyframes` lentes (26s à 32s).
+- **Textures :** Grille de points (`.grid-dots`) et scanlines terminales (`.scanlines`), grain discret en overlay et vignette périphérique.
+- **Accessibilité :** Balisage en `aria-hidden="true"`, et neutralisation totale des keyframes sous `@media (prefers-reduced-motion: reduce)`.
+
+### B. Boot Sequence (`.boot`)
+- **Comportement :** Écran d'initialisation stylisé `jouan.os` affichant la montée en charge système.
+- **Règles :**
+  - S'efface automatiquement après 1 à 1.5s ou immédiatement au clic / touche Escape.
+  - Contournement immédiat sous `prefers-reduced-motion: reduce` ou si déjà visualisé au cours de la session (`sessionStorage`).
+  - Déclenche la frappe progressive du terminal hero à sa fermeture.
+
+### C. Hero Commercial & Terminal Vitrine
+- **Accroche commerciale :**
+  - Sur-titre : `// DÉVELOPPEUR FREELANCE · NUXT & NESTJS`
+  - Titre principal : `Développeur Full Stack TypeScript`
+  - Sous-titre : `Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.`
+  - Badge de statut : `● Disponible pour missions freelance · Profil Malt vérifié` (avec lien `<ZExternalLink>` vers Malt).
+  - CTAs :
+    - Principal : `<ZButton to="/contact">Discuter de votre projet</ZButton>`
+    - Secondaire : `<ZButton variant="secondary" to="/about">Voir le parcours & CV</ZButton>`
+- **Terminal vitrine :**
+  - Simulation de frappe séquentielle :
+    - `$ whoami` → `Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)`
+    - `$ cat focus.txt` → `SaaS, web apps, clean architecture, automated testing (QA) & AI engineering`
+    - `$ ls ~/projets` → `keova.app/  tryon-saas/  nodium-lab/`
+
+### D. Marquee Stack Moderne
+- **Contenu :** Ruban continu affichant les technologies phares de `SITE.skills` :
+  `TypeScript · Nuxt 4 · Vue.js · NestJS · Node.js · PostgreSQL · TypeORM · Stripe Connect · Cypress · Docker · REST API · Vitest`
+- **Animation :** `@keyframes` fluide, pause automatique au survol de la souris, figeage statique sous `prefers-reduced-motion: reduce`.
+
+### E. Vitrine des Services (3 Offres Ciblées)
+1. **Création d'applications web & SaaS**
+   - *Promesse :* De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.
+   - *Technologies :* Nuxt, NestJS, PostgreSQL, Stripe Connect.
+2. **Développement Full Stack TypeScript**
+   - *Promesse :* Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.
+   - *Technologies :* Vue 3, Nuxt, NestJS, Node.js, TypeORM.
+3. **Évolution & Architecture applicative**
+   - *Promesse :* Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).
+   - *Technologies :* Tests E2E Cypress, CI/CD, audits, optimisations.
+
+### F. Preuves Concrètes & Projets Phares
+- **1. Keova App (Pièce maîtresse SaaS en production) :**
+  - Statut : `● En production`
+  - Rôle : Co-fondateur & Développeur Full Stack
+  - Description : ERP vertical SaaS complet dédié au secteur équestre (gestion de pensions, facturation automatisée, réservations).
+  - Stack : Nuxt 4, NestJS, PostgreSQL, TypeORM, Stripe Connect, Docker.
+  - Lien externe : `<ZExternalLink href="https://keova.app">keova.app</ZExternalLink>`.
+- **2. TryOn (Étude de cas SaaS & IA générative) :**
+  - Statut : `○ Étude de cas (MVP livré)` *(projet non renouvelé en ligne depuis 01/2026 — valorisé pour son architecture technique et son intégration IA sans lien externe 404)*
+  - Rôle : CTO & Développeur Full Stack
+  - Description : Plateforme SaaS B2B d'essayage virtuel de vêtements pour marques de mode via l'IA générative (diffusion models, workflows asynchrones, files Redis).
+  - Stack : Nuxt 3, NestJS, Python microservices, ComfyUI, Stripe, PostgreSQL.
+  - Action : Badge d'étude de cas / renvoi vers le détail de la mission sur `/about` ou profil Malt.
+- **3. Nodium (Laboratoire R&D en cours) :**
+  - Statut : `◐ R&D / En cours`
+  - Rôle : Créateur & Ingénieur IA
+  - Description : Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.
+  - Stack : TypeScript, Electron/Tauri, Agentic workflows, Local runtimes.
+- **Statistiques clés de réassurance :**
+  - `11` Années d'expérience web
+  - `100%` TypeScript & SaaS de bout en bout
+  - `QA` Culture d'automatisation & zéro régression
+
+### G. Bloc CTA Final
+- **Titre :** `Un projet d'application web ou SaaS ?`
+- **Sous-titre :** `Que ce soit pour créer un nouveau produit, accélérer votre roadmap ou fiabiliser votre stack TypeScript, parlons-en.`
+- **Actions :**
+  - Bouton primaire : `<ZButton to="/contact">Discuter de votre projet</ZButton>`
+  - Bouton externe : `<ZExternalLink href="https://www.malt.fr/profile/simonjouan">Me contacter sur Malt</ZExternalLink>`

exec
/bin/zsh -lc 'test -f public/images/logo_white.png && echo exists || echo missing; test -f public/images/portrait_512x512_drip_art_8.webp && echo portrait_exists || echo portrait_missing; rg -n "web3forms|siteUrl|header-height|ftr__container|main" nuxt.config.ts app/layouts app/assets/scss 2>/dev/null | head -80' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
exists
portrait_exists
nuxt.config.ts:32:  css: ["@/assets/scss/main.scss"],
nuxt.config.ts:54:      web3formsAccessKey: "",
nuxt.config.ts:58:      siteUrl: "https://jouan.ovh",
app/layouts/default.vue:26:  // fixe le tronquait). --header-height/--footer-height viennent des tokens (2.1).
app/assets/scss/base/_layout.scss:6://  Mutualisées ici (chargées par main.scss) plutôt que redéclarées
app/assets/scss/base/_reset.scss:61: * Render the `main` element consistently in IE.
app/assets/scss/base/_reset.scss:63:main {
app/assets/scss/abstract/_root.scss:159:  --header-height: 56px;
app/assets/scss/abstract/_variables.scss:49:$header-height: 56px;
app/assets/scss/abstract/_animations.scss:361:    height: calc(25vh - var(--header-height));
app/assets/scss/abstract/_animations.scss:366:    height: calc(50vh - var(--header-height));
app/assets/scss/abstract/_animations.scss:371:    height: calc(75vh - var(--header-height));
app/assets/scss/abstract/_animations.scss:376:    height: calc(100vh - var(--header-height));

exec
/bin/zsh -lc "sed -n '1,100p' app/layouts/default.vue; sed -n '1,220p' app/assets/scss/base/_layout.scss; sed -n '1,100p' nuxt.config.ts" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <div class="init">
    <HeaderComponent />

    <slot />

    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import FooterComponent from "../components/FooterComponent.vue";
import HeaderComponent from "../components/HeaderComponent.vue";
</script>

<style lang="scss" scoped>
.init {
  // Fond de page dark-first (token). Remplace l'ancien dégradé legacy
  // orange/aubergine (anciens tokens SCSS `_color.$`) qui débordait derrière
  // les sections transparentes (révélé par la story 3.2). Le hero porte son
  // propre `hero__grad`, le footer son `--bg-sunken` — inchangés.
  background: var(--bg-page);

  // Flex column : header sticky en haut, footer riche poussé en bas via
  // `margin-top: auto` (le footer dépasse 56px — l'ancienne grille à hauteur
  // fixe le tronquait). --header-height/--footer-height viennent des tokens (2.1).
  display: flex;
  flex-direction: column;
  margin: 0;
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
}
</style>
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

codex
- Le passage du header de `sticky` à `fixed` ne réserve aucun espace dans le layout global : les pages secondaires risquent d’être recouvertes par le header.

- La vérification CI ne contrôle que neuf fichiers HTML alors que le projet annonce treize routes statiques ; les pages d’articles de blog et d’autres sorties peuvent donc manquer sans faire échouer le déploiement.

- La CI vérifie seulement que la variable Web3Forms n’est pas vide, sans vérifier que la clé a réellement été injectée dans la configuration générée ou que le formulaire fonctionne.

- `HomeAtmosComponent` contredit directement la SPEC en introduisant un canvas WebGL et un shader alors que celle-ci exige une atmosphère en pur CSS et interdit les canvas shaders.

- L’implémentation atmosphérique ne fournit ni scanlines ni texture de grain, pourtant annoncées dans la SPEC et la cartographie des sections.

- Le listener `resize` de `HomeAtmosComponent` est enregistré avec une fonction anonyme et n’est jamais supprimé au démontage, ce qui crée une fuite et peut rappeler du code avec un canvas détruit.

- Lorsque `prefers-reduced-motion` repasse à `false`, `HomeAtmosComponent` annule l’animation mais ne relance jamais la boucle `requestAnimationFrame`.

- La boucle WebGL continue à exécuter `requestAnimationFrame` lorsque l’onglet est masqué ; elle cesse uniquement de dessiner, contrairement à la promesse d’extinction en arrière-plan.

- La perte du contexte WebGL n’est pas gérée : le canvas peut rester vide sans basculer vers le fallback visuel.

- Le fallback atmosphérique utilise des couleurs hexadécimales en dur, en contradiction avec la règle du projet imposant l’usage des tokens CSS.

- L’overlay de démarrage ne déplace pas le focus, ne rend pas le contenu sous-jacent inert et ne piège pas la navigation clavier ; un utilisateur peut donc tabuler vers des contrôles invisibles derrière l’écran de boot.

- Le conteneur cliquable de `HomeBootOverlay` est un `div` interactif sans sémantique clavier, alors que seule sa petite balise `button` est réellement accessible.

- Le contenu utile du terminal hero est placé dans des éléments `aria-hidden="true"` sans alternative accessible, ce qui masque les commandes, les résultats et le positionnement commercial aux lecteurs d’écran.

- Le marquee de compétences est entièrement `aria-hidden="true"` sans fournir de liste textuelle alternative ; les technologies mises en avant sont donc absentes de l’expérience assistive.

- Le contenu du terminal hero mélange une interface française avec des sorties éditoriales en anglais, alors que les directives du projet imposent une interface et un contenu en français.

- `HomeHeroTerminal` hardcode encore le rôle, le texte de focus et des règles spéciales sur les noms de projets, ce qui contredit la centralisation des données dans `SITE`.

- La transformation des noms de projets dans `projectsOutput` dépend de comparaisons exactes (`"Keova App"`, `"TryOn"`, `"Nodium"`) et produira des chemins incohérents dès qu’un nom sera modifié ou qu’un nouveau projet sera ajouté.

- La SPEC demande Cypress dans la stack affichée, tandis que `SITE.skills` expose TestCafé et Vitest sans Cypress ; le contrat documentaire et l’interface livrée ne sont pas alignés.

- `ZButton` ne supprime plus `href`, `tabindex` et les handlers des éléments non natifs désactivés ; un bouton rendu en lien avec `disabled` reste donc potentiellement focalisable et navigable.

- L’effet magnétique de `ZButton` appelle `matchMedia()` et `getBoundingClientRect()` à chaque mouvement de souris sur tous les boutons par défaut, ce qui ajoute un coût inutile et global au déplacement du pointeur.

- `ZCard` écrit directement `style.transform`, ce qui écrase tout transform fourni par un consommateur ou par une autre interaction et rend la primitive moins composable.

- `ZCustomCursor` ne réagit pas aux changements de capacité `hover` : s’il est initialisé sur un appareil tactile puis qu’un périphérique de pointage est ajouté, il ne sera jamais activé.

- `Projets.ts` injecte directement les noms, descriptions, statuts et URL de `SITE.projects` dans une chaîne HTML sans échappement ; une donnée contenant du markup devient alors une possibilité d’injection HTML dans le terminal.

- Le fallback `keovaUrl` de `about.vue` réintroduit l’URL `https://keova.app` en dur au lieu de garantir qu’elle provient exclusivement de `SITE.projects`.

- Le JSON-LD utilise `SITE.profile.city` (`"Rouen, France"`) comme `addressLocality` tout en ajoutant `addressCountry: "FR"` ; la localité contient donc déjà le pays et ne respecte pas correctement le modèle `PostalAddress`.

- Les statistiques `"100% TypeScript & SaaS de bout en bout"` et `"zéro régression"` sont des affirmations absolues non étayées par les données du dépôt et peuvent créer une promesse commerciale difficilement défendable.

- Le nouveau logo et plusieurs effets visuels introduisent de nombreuses dimensions et valeurs numériques en dur malgré la règle imposant l’utilisation des tokens de design.

- Aucun test automatisé ou test E2E n’est ajouté pour couvrir le boot overlay, le focus clavier, le changement de reduced motion, le WebGL fallback, le curseur personnalisé, le terminal animé ou le comportement du header fixe.

- Le footer affiche désormais les projets sans URL comme du texte statique, mais aucune indication visuelle ou accessible n’explique pourquoi certains projets ne sont pas cliquables alors que la section est présentée comme une liste de projets.

- Le diff modifie fortement les données professionnelles, le positionnement, les projets et les statistiques sans ajouter de mécanisme de validation éditoriale ou de test empêchant une divergence future entre le site, la SPEC et le profil Malt.
tokens used
85 078
- Le passage du header de `sticky` à `fixed` ne réserve aucun espace dans le layout global : les pages secondaires risquent d’être recouvertes par le header.

- La vérification CI ne contrôle que neuf fichiers HTML alors que le projet annonce treize routes statiques ; les pages d’articles de blog et d’autres sorties peuvent donc manquer sans faire échouer le déploiement.

- La CI vérifie seulement que la variable Web3Forms n’est pas vide, sans vérifier que la clé a réellement été injectée dans la configuration générée ou que le formulaire fonctionne.

- `HomeAtmosComponent` contredit directement la SPEC en introduisant un canvas WebGL et un shader alors que celle-ci exige une atmosphère en pur CSS et interdit les canvas shaders.

- L’implémentation atmosphérique ne fournit ni scanlines ni texture de grain, pourtant annoncées dans la SPEC et la cartographie des sections.

- Le listener `resize` de `HomeAtmosComponent` est enregistré avec une fonction anonyme et n’est jamais supprimé au démontage, ce qui crée une fuite et peut rappeler du code avec un canvas détruit.

- Lorsque `prefers-reduced-motion` repasse à `false`, `HomeAtmosComponent` annule l’animation mais ne relance jamais la boucle `requestAnimationFrame`.

- La boucle WebGL continue à exécuter `requestAnimationFrame` lorsque l’onglet est masqué ; elle cesse uniquement de dessiner, contrairement à la promesse d’extinction en arrière-plan.

- La perte du contexte WebGL n’est pas gérée : le canvas peut rester vide sans basculer vers le fallback visuel.

- Le fallback atmosphérique utilise des couleurs hexadécimales en dur, en contradiction avec la règle du projet imposant l’usage des tokens CSS.

- L’overlay de démarrage ne déplace pas le focus, ne rend pas le contenu sous-jacent inert et ne piège pas la navigation clavier ; un utilisateur peut donc tabuler vers des contrôles invisibles derrière l’écran de boot.

- Le conteneur cliquable de `HomeBootOverlay` est un `div` interactif sans sémantique clavier, alors que seule sa petite balise `button` est réellement accessible.

- Le contenu utile du terminal hero est placé dans des éléments `aria-hidden="true"` sans alternative accessible, ce qui masque les commandes, les résultats et le positionnement commercial aux lecteurs d’écran.

- Le marquee de compétences est entièrement `aria-hidden="true"` sans fournir de liste textuelle alternative ; les technologies mises en avant sont donc absentes de l’expérience assistive.

- Le contenu du terminal hero mélange une interface française avec des sorties éditoriales en anglais, alors que les directives du projet imposent une interface et un contenu en français.

- `HomeHeroTerminal` hardcode encore le rôle, le texte de focus et des règles spéciales sur les noms de projets, ce qui contredit la centralisation des données dans `SITE`.

- La transformation des noms de projets dans `projectsOutput` dépend de comparaisons exactes (`"Keova App"`, `"TryOn"`, `"Nodium"`) et produira des chemins incohérents dès qu’un nom sera modifié ou qu’un nouveau projet sera ajouté.

- La SPEC demande Cypress dans la stack affichée, tandis que `SITE.skills` expose TestCafé et Vitest sans Cypress ; le contrat documentaire et l’interface livrée ne sont pas alignés.

- `ZButton` ne supprime plus `href`, `tabindex` et les handlers des éléments non natifs désactivés ; un bouton rendu en lien avec `disabled` reste donc potentiellement focalisable et navigable.

- L’effet magnétique de `ZButton` appelle `matchMedia()` et `getBoundingClientRect()` à chaque mouvement de souris sur tous les boutons par défaut, ce qui ajoute un coût inutile et global au déplacement du pointeur.

- `ZCard` écrit directement `style.transform`, ce qui écrase tout transform fourni par un consommateur ou par une autre interaction et rend la primitive moins composable.

- `ZCustomCursor` ne réagit pas aux changements de capacité `hover` : s’il est initialisé sur un appareil tactile puis qu’un périphérique de pointage est ajouté, il ne sera jamais activé.

- `Projets.ts` injecte directement les noms, descriptions, statuts et URL de `SITE.projects` dans une chaîne HTML sans échappement ; une donnée contenant du markup devient alors une possibilité d’injection HTML dans le terminal.

- Le fallback `keovaUrl` de `about.vue` réintroduit l’URL `https://keova.app` en dur au lieu de garantir qu’elle provient exclusivement de `SITE.projects`.

- Le JSON-LD utilise `SITE.profile.city` (`"Rouen, France"`) comme `addressLocality` tout en ajoutant `addressCountry: "FR"` ; la localité contient donc déjà le pays et ne respecte pas correctement le modèle `PostalAddress`.

- Les statistiques `"100% TypeScript & SaaS de bout en bout"` et `"zéro régression"` sont des affirmations absolues non étayées par les données du dépôt et peuvent créer une promesse commerciale difficilement défendable.

- Le nouveau logo et plusieurs effets visuels introduisent de nombreuses dimensions et valeurs numériques en dur malgré la règle imposant l’utilisation des tokens de design.

- Aucun test automatisé ou test E2E n’est ajouté pour couvrir le boot overlay, le focus clavier, le changement de reduced motion, le WebGL fallback, le curseur personnalisé, le terminal animé ou le comportement du header fixe.

- Le footer affiche désormais les projets sans URL comme du texte statique, mais aucune indication visuelle ou accessible n’explique pourquoi certains projets ne sont pas cliquables alors que la section est présentée comme une liste de projets.

- Le diff modifie fortement les données professionnelles, le positionnement, les projets et les statistiques sans ajouter de mécanisme de validation éditoriale ou de test empêchant une divergence future entre le site, la SPEC et le profil Malt.
