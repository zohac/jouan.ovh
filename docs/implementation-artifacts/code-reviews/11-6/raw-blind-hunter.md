Reading prompt from stdin...
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: high
reasoning summaries: none
session id: 01a09f78-218e-76d2-9468-79714c7129c5
--------
user
# Blind Hunter Prompt — Story 11.6

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/11-6/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise `bmad-review-adversarial-general` pour auditer le diff avec le niveau de scepticisme demandé, puis je vérifierai directement les éléments concernés dans le dépôt afin de produire au moins dix constats concrets.
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

exec
/bin/zsh -lc "wc -l docs/implementation-artifacts/code-reviews/11-6/full.diff && sed -n '1,260p' docs/implementation-artifacts/code-reviews/11-6/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
    1660 docs/implementation-artifacts/code-reviews/11-6/full.diff
diff --git a/app/components/CurrentTime.vue b/app/components/CurrentTime.vue
index c459483..cf9fd85 100644
--- a/app/components/CurrentTime.vue
+++ b/app/components/CurrentTime.vue
@@ -1,7 +1,11 @@
 <template>
-  <div class="current-time">
-    {{ currentTime }}
-  </div>
+  <time class="current-time" :datetime="currentTimeIso" aria-label="Heure locale de Valognes">
+    <span class="current-time__hours">{{ hours }}</span>
+    <span class="current-time__colon" :class="{ 'current-time__colon--hidden': !isColonVisible }" aria-hidden="true"
+      >:</span
+    >
+    <span class="current-time__minutes">{{ minutes }}</span>
+  </time>
 </template>
 
 <script lang="ts" setup>
@@ -12,21 +16,36 @@ defineComponent({
   name: "CurrentTime",
 });
 
-const currentTime = ref("");
+const hours = ref("--");
+const minutes = ref("--");
+const currentTimeIso = ref("");
+const isColonVisible = ref(true);
 
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
+
+  // Un clignotement exact par seconde (alternance à chaque seconde système)
+  isColonVisible.value = now.getSeconds() % 2 === 0;
 }
 
 const interval: Ref<ReturnType<typeof setInterval> | null> = ref(null);
 
 onMounted(() => {
   updateTime();
-  interval.value = setInterval(updateTime, 15000);
+  interval.value = setInterval(updateTime, 1000);
 });
 
 onUnmounted(() => {
@@ -37,7 +56,32 @@ onUnmounted(() => {
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
+  transition: opacity 0.1s linear;
+
+  &--hidden {
+    opacity: 0;
+  }
+}
+
+@media (prefers-reduced-motion: reduce) {
+  .current-time__colon,
+  .current-time__colon--hidden {
+    opacity: 1;
+    transition: none;
+  }
 }
 </style>
diff --git a/app/components/FooterComponent.vue b/app/components/FooterComponent.vue
index 176765c..a75f1c5 100644
--- a/app/components/FooterComponent.vue
+++ b/app/components/FooterComponent.vue
@@ -4,8 +4,8 @@
       <div class="ftr__in">
         <div class="ftr__brand-col">
           <NuxtLink to="/" class="ftr__brand">
-            <ZIcon name="gem" class="ftr__logo" />
-            <b>jouan.ovh</b>
+            <img src="/images/logo_white.png" alt="" class="ftr__logo" width="22" height="22" />
+            <span><b>jouan</b><span class="dim">.ovh</span></span>
           </NuxtLink>
           <p class="ftr__tagline">{{ profile.role }}. {{ profile.city }}.</p>
         </div>
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
@@ -65,10 +68,12 @@ const year = new Date().getFullYear();
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
@@ -93,13 +98,16 @@ const year = new Date().getFullYear();
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
@@ -109,6 +117,10 @@ const year = new Date().getFullYear();
     color: var(--text-strong);
   }
 
+  .dim {
+    color: var(--text-muted);
+  }
+
   // Lien focusable (logo + nom) : anneau DS cohérent avec le reste du châssis.
   &:focus-visible {
     outline: 2px solid transparent; // forced-colors : rendu en couleur système
@@ -121,7 +133,7 @@ const year = new Date().getFullYear();
 .ftr__tagline {
   margin: 0;
   font-size: var(--fs-sm);
-  color: var(--text-muted);
+  color: var(--text-body);
 }
 
 .ftr__col {
@@ -133,10 +145,10 @@ const year = new Date().getFullYear();
   margin: 0 0 var(--space-3);
   font-family: var(--font-mono);
   font-size: var(--fs-xs);
-  font-weight: var(--fw-regular);
+  font-weight: var(--fw-medium);
   letter-spacing: var(--ls-wider);
   text-transform: uppercase;
-  color: var(--text-muted);
+  color: var(--accent);
 }
 
 .ftr__list {
@@ -152,12 +164,15 @@ const year = new Date().getFullYear();
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
@@ -169,38 +184,43 @@ const year = new Date().getFullYear();
   }
 
   &--static {
-    color: var(--text-muted);
+    color: var(--text-body);
     cursor: default;
 
     &:hover {
-      color: var(--text-muted);
+      color: var(--text-body);
+      transform: none;
     }
   }
 }
 
+.ftr__bottom-bar {
+  width: 100%;
+  margin-top: var(--space-8);
+  border-top: 1px solid var(--border-default);
+}
+
 .ftr__bottom {
   display: flex;
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

exec
/bin/zsh -lc "sed -n '261,620p' docs/implementation-artifacts/code-reviews/11-6/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
diff --git a/app/components/HeaderComponent.vue b/app/components/HeaderComponent.vue
index b2301e9..f209574 100644
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
+        <img src="/images/logo_white.png" alt="" class="hdr__logo" width="24" height="24" />
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
@@ -99,6 +116,17 @@ function isActive(to: string): boolean {
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
+  scrollProgress.value = h > 0 ? (top / h) * 100 : 0;
+}
+
 // --- Terminal easter-egg (préservé) ---
 const terminalManager = ref<InstanceType<typeof TerminalManagerComponent> | null>(null);
 
@@ -133,6 +161,14 @@ function closeMenu() {
   menuOpen.value = false;
 }
 
+function onBrandClick(event: MouseEvent) {
+  closeMenu();
+  if (route.path === "/") {
+    event.preventDefault();
+    window.scrollTo({ top: 0, behavior: "smooth" });
+  }
+}
+
 // Fermeture clavier/overlay : renvoie le focus au burger (déclencheur) — a11y.
 function closeMenuAndRefocus() {
   if (!menuOpen.value) {
@@ -175,30 +211,54 @@ onMounted(() => {
   desktopMq = window.matchMedia("(min-width: 901px)");
   desktopMq.addEventListener("change", onDesktopChange);
   registerTerminalLauncher(addNewTerminal);
+  window.addEventListener("scroll", onScroll, { passive: true });
+  onScroll();
 });
 
 onBeforeUnmount(() => {
   document.removeEventListener("keydown", onKeydown);
   desktopMq?.removeEventListener("change", onDesktopChange);
   unregisterTerminalLauncher(addNewTerminal);
+  window.removeEventListener("scroll", onScroll);
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
@@ -215,12 +275,23 @@ onBeforeUnmount(() => {
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
@@ -228,6 +299,27 @@ onBeforeUnmount(() => {
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
@@ -240,38 +332,79 @@ onBeforeUnmount(() => {
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
   color: var(--text-muted);
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
 
@@ -282,10 +415,67 @@ onBeforeUnmount(() => {
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

exec
/bin/zsh -lc "sed -n '621,980p' docs/implementation-artifacts/code-reviews/11-6/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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
@@ -319,16 +509,18 @@ onBeforeUnmount(() => {
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
+// Dégradé progressif pour le dock droit sur largeurs moyennes
+@media (width <= 1250px) {
+  .hdr__dock-right {
     display: none;
   }
 }
@@ -343,8 +535,7 @@ onBeforeUnmount(() => {
 // ---- Responsive : < 900px (cf. kit.css) ----
 @media (width <= 900px) {
   .hdr__nav,
-  .hdr__clock,
-  .hdr__badge,
+  .hdr__dock-right,
   .hdr__right .hdr__action {
     display: none;
   }
@@ -413,8 +604,15 @@ onBeforeUnmount(() => {
 
 @media (prefers-reduced-motion: reduce) {
   .hdr__link,
+  .hdr__link::after,
   .hdr__menu {
     transition: none;
   }
+
+  .hdr__brand .hdr__logo,
+  .hdr__brand:hover .hdr__logo {
+    transform: none;
+    transition: none;
+  }
 }
 </style>
diff --git a/app/components/HexagonLinkComponent.vue b/app/components/HexagonLinkComponent.vue
index e7cb6a4..0975be2 100644
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
-    background var(--dur-base) var(--ease-standard);
+    background var(--dur-base) var(--ease-standard),
+    transform var(--dur-base) var(--ease-standard);
 
   &:hover {
     color: var(--ink-on-accent);
     background: var(--accent);
+    transform: translateY(-2px);
   }
 
   &:focus-visible {
diff --git a/app/components/home/HomeStackMarquee.vue b/app/components/home/HomeStackMarquee.vue
index 449fa03..3be72c8 100644
--- a/app/components/home/HomeStackMarquee.vue
+++ b/app/components/home/HomeStackMarquee.vue
@@ -36,7 +36,7 @@ const SKILL_LABEL_MAP: Record<string, string> = {
   postgresql: "PostgreSQL",
   typeorm: "TypeORM",
   stripe: "Stripe Connect",
-  cypress: "Cypress",
+  testcafe: "TestCafé",
   docker: "Docker",
   "rest-api": "REST API",
   vitest: "Vitest",
diff --git a/app/components/ui/ZButton.vue b/app/components/ui/ZButton.vue
index 1bb4a23..988025e 100644
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
+import { computed, onMounted, ref, useAttrs } from "vue";
 
 defineOptions({
   inheritAttrs: false,
@@ -40,7 +44,7 @@ type IconProp = string | Component;
 interface Props {
   /** Style visuel. @default "primary" */
   variant?: "primary" | "secondary" | "ghost" | "terminal" | "danger";
-  /** @default "md" — hauteurs 28 / 36 / 44 */
+  /** @default "md" — hauteurs 32 / 40 / 48 */
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
@@ -59,9 +65,47 @@ const props = withDefaults(defineProps<Props>(), {
   iconRight: undefined,
   as: "button",
   disabled: false,
+  magnetic: true,
 });
 
 const attrs = useAttrs();
+const buttonEl = ref<Element | ComponentPublicInstance | null>(null);
+const innerEl = ref<HTMLElement | null>(null);
+const isReducedMotion = ref(false);
+
+onMounted(() => {
+  isReducedMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
+});
+
+function onMouseMove(event: MouseEvent) {
+  if (!props.magnetic || isReducedMotion.value || !buttonEl.value || props.disabled) {
+    return;
+  }
+  const el = ((buttonEl.value as ComponentPublicInstance).$el ?? buttonEl.value) as HTMLElement | null;
+  if (!el || !(el instanceof HTMLElement)) {
+    return;
+  }
+  const rect = el.getBoundingClientRect();
+  const x = event.clientX - rect.left - rect.width / 2;
+  const y = event.clientY - rect.top - rect.height / 2;
+  el.style.transform = `translate(${x * 0.16}px, ${y * 0.18}px)`;
+  if (innerEl.value) {
+    innerEl.value.style.transform = `translate(${x * 0.08}px, ${y * 0.1}px)`;
+  }
+}
+
+function onMouseLeave() {
+  if (buttonEl.value) {
+    const el = ((buttonEl.value as ComponentPublicInstance).$el ?? buttonEl.value) as HTMLElement | null;
+    if (el instanceof HTMLElement) {
+      el.style.transform = "";
+    }
+  }
+  if (innerEl.value) {
+    innerEl.value.style.transform = "";
+  }
+}
+
 // `as` accepte une balise native ("button", "a") ou une référence de composant
 // (ex. NuxtLink importé de "#components") ; ne pas passer un nom de composant en chaîne.
 const isNativeButton = computed(() => props.as === "button");
@@ -103,14 +147,13 @@ function blockDisabledActivation(event: Event) {
 <style lang="scss" scoped>
 /* stylelint-disable selector-class-pattern, custom-property-pattern -- convention DS portée depuis Button.jsx */
 .zbtn {
-  --_h: 36px;
-  --_px: var(--space-4);
+  --_h: 42px;
+  --_px: var(--space-5);
   --_fs: var(--fs-sm);
 
   display: inline-flex;
   align-items: center;
   justify-content: center;
-  gap: var(--space-2);
   box-sizing: border-box;
   height: var(--_h);
   padding: 0 var(--_px);
@@ -129,12 +172,10 @@ function blockDisabledActivation(event: Event) {
     background var(--dur-fast) var(--ease-standard),
     border-color var(--dur-fast) var(--ease-standard),
     color var(--dur-fast) var(--ease-standard),
+    box-shadow var(--dur-fast) var(--ease-standard),
     transform var(--dur-fast) var(--ease-standard);
 
   &:focus-visible {
-    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
-    // relais), mais rendu en couleur système sous forced-colors (Windows High
-    // Contrast), où les box-shadow sont neutralisées — focus toujours visible (AC #2).
     outline: 2px solid transparent;
     outline-offset: 2px;
     box-shadow: var(--ring-accent);
@@ -148,10 +189,19 @@ function blockDisabledActivation(event: Event) {
   }
 }
 
+.zbtn__inner {
+  display: inline-flex;
+  align-items: center;
+  justify-content: center;
+  gap: var(--space-2);
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
@@ -161,15 +211,15 @@ function blockDisabledActivation(event: Event) {
 
 // ---- Tailles ----
 .zbtn--sm {
-  --_h: 28px;
+  --_h: 32px;
   --_px: var(--space-3);
   --_fs: var(--fs-xs);
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
@@ -177,31 +227,36 @@ function blockDisabledActivation(event: Event) {
   background: var(--accent);
   color: var(--accent-text);
   border-color: var(--accent);
+  box-shadow: var(--glow-accent);
 
   &:hover {
     background: var(--accent-hover);
     border-color: var(--accent-hover);
+    box-shadow: 0 0 16px color-mix(in srgb, var(--accent) 45%, transparent);
+    transform: translateY(-1px);
   }
 
   &:active {
     background: var(--accent-active);
     border-color: var(--accent-active);
-    transform: translateY(1px);
+    transform: translateY(0);
   }
 }
 
 .zbtn--secondary {
-  background: var(--surface-2);
+  background: color-mix(in srgb, var(--surface-2) 75%, transparent);
   color: var(--text-strong);
   border-color: var(--border-default);
+  backdrop-filter: blur(6px);
 

exec
/bin/zsh -lc "sed -n '981,1340p' docs/implementation-artifacts/code-reviews/11-6/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
   &:hover {
     background: var(--surface-3);
     border-color: var(--border-strong);
+    transform: translateY(-1px);
   }
 
   &:active {
-    transform: translateY(1px);
+    transform: translateY(0);
   }
 }
 
@@ -213,17 +268,22 @@ function blockDisabledActivation(event: Event) {
   &:hover {
     background: var(--surface-2);
     color: var(--text-strong);
+    transform: translateY(-1px);
   }
 }
 
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
+    transform: translateY(-1px);
   }
 }
 
@@ -241,12 +301,11 @@ function blockDisabledActivation(event: Event) {
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
index c58f1cd..b256fc6 100644
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
@@ -8,18 +9,20 @@
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
+import { computed, onMounted, ref, useAttrs } from "vue";
 
 defineOptions({
   inheritAttrs: false,
@@ -36,6 +39,8 @@ interface Props {
   padded?: boolean;
   /** Élément rendu (polymorphe). @default "div" */
   as?: string | Component;
+  /** Activer l'effet 3D tilt sur mousemove. @default false */
+  tilt?: boolean;
 }
 
 const props = withDefaults(defineProps<Props>(), {
@@ -44,9 +49,41 @@ const props = withDefaults(defineProps<Props>(), {
   featured: false,
   padded: true,
   as: "div",
+  tilt: false,
 });
 
 const attrs = useAttrs();
+const cardRef = ref<Element | ComponentPublicInstance | null>(null);
+const isReducedMotion = ref(false);
+
+onMounted(() => {
+  isReducedMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
+});
+
+function onMouseMove(event: MouseEvent) {
+  if (!props.tilt || isReducedMotion.value || !cardRef.value) {
+    return;
+  }
+  const el = ((cardRef.value as ComponentPublicInstance).$el ?? cardRef.value) as HTMLElement | null;
+  if (!el || !(el instanceof HTMLElement)) {
+    return;
+  }
+  const rect = el.getBoundingClientRect();
+  const px = (event.clientX - rect.left) / rect.width - 0.5;
+  const py = (event.clientY - rect.top) / rect.height - 0.5;
+  el.style.transform = `perspective(800px) rotateX(${-py * 6}deg) rotateY(${px * 8}deg) translateY(-4px)`;
+}
+
+function onMouseLeave() {
+  if (!props.tilt || !cardRef.value) {
+    return;
+  }
+  const el = ((cardRef.value as ComponentPublicInstance).$el ?? cardRef.value) as HTMLElement | null;
+  if (el instanceof HTMLElement) {
+    el.style.transform = "";
+  }
+}
+
 // `as` accepte une balise native ("div", "article") ou une référence de composant
 // (ex. NuxtLink importé de "#components") ; ne pas passer un nom de composant en chaîne.
 const isNativeButton = computed(() => props.as === "button");
@@ -78,6 +115,11 @@ const rootAttrs = computed(() => {
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
@@ -91,12 +133,7 @@ const rootAttrs = computed(() => {
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
@@ -112,8 +149,6 @@ const rootAttrs = computed(() => {
 }
 
 .zcard--featured {
-  // Bordure orange translucide de mise en avant : --accent-ring (token le plus proche
-  // de la réf. hsl(24 94% 53% / 0.35), même teinte accent en translucide).
   border-color: var(--accent-ring);
   box-shadow: var(--glow-accent), var(--shadow-hairline);
 }
@@ -121,6 +156,7 @@ const rootAttrs = computed(() => {
 @media (prefers-reduced-motion: reduce) {
   .zcard {
     transition: none;
+    transform: none !important;
   }
 
   .zcard--interactive:hover {
diff --git a/app/data/site.ts b/app/data/site.ts
index 11fc924..b679da3 100644
--- a/app/data/site.ts
+++ b/app/data/site.ts
@@ -47,7 +47,7 @@ const skills: string[] = [
   "postgresql",
   "typeorm",
   "stripe",
-  "cypress",
+  "testcafe",
   "docker",
   "rest-api",
   "vitest",
diff --git a/app/pages/index.vue b/app/pages/index.vue
index de66670..8246e72 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -6,13 +6,13 @@
     <HomeAtmosComponent />
     <ZCustomCursor />
 
-    <section class="hero hero__grad">
+    <section class="hero">
       <div class="hero__in container">
         <div class="hero__grid">
           <!-- Colonne gauche : accroche commerciale, badge dispo, CTAs -->
           <div class="anim hero__text">
             <p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>
-            <h1 class="hero__title">Développeur Full Stack TypeScript</h1>
+            <h1 class="hero__title">Développeur Full Stack <em>TypeScript</em></h1>
             <p class="hero__sub">
               Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De
               l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.
@@ -41,12 +41,12 @@
             <HomeHeroTerminal :auto-start="isBootFinished" />
           </div>
         </div>
+
+        <!-- Ruban défilant de la stack moderne remonté au sein du hero (fidèle à la maquette) -->
+        <HomeStackMarquee class="hero__marquee" />
       </div>
     </section>
 
-    <!-- Ruban défilant de la stack moderne (Story 11.3 / AC-1) -->
-    <HomeStackMarquee />
-
     <!-- Vitrine des 3 services cibles (Story 11.3 / AC-2) -->
     <section class="section">
       <div class="container">
@@ -54,7 +54,7 @@
         <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos applications</h2>
         <ul class="grid-3">
           <li v-for="service in services" :key="service.id">
-            <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
+            <ZCard class="offer" interactive tilt :accent="service.featured" :featured="service.featured">
               <div class="offer__top">
                 <div class="offer__icon"><ZIcon :name="service.icon" /></div>
                 <span class="offer__no">{{ service.no }}</span>
@@ -85,7 +85,7 @@
     </section>
 
     <!-- Projets sélectionnés & Statistiques de réassurance (Story 11.4 / AC-1 & AC-2) -->
-    <section class="section section--sunken">
+    <section class="section">
       <div class="container">
         <div class="block__head">
           <p class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</p>
@@ -149,7 +149,7 @@
         <!-- Liste des articles les plus récents -->
         <ul v-if="articles && articles.length" class="journal">
           <li v-for="article in articles" :key="article.path" class="journal__item">
-            <ZCard :as="NuxtLink" :to="article.path" :padded="false" interactive class="jpost" data-hot>
+            <ZCard :as="NuxtLink" :to="article.path" :padded="false" interactive tilt class="jpost" data-hot>
               <NuxtImg
                 v-if="article.image"
                 class="jpost__thumb"
@@ -193,11 +193,14 @@
     </section>
 
     <!-- Bloc CTA final de conversion (Story 11.4 / AC-4) -->
-    <section class="section section--sunken">
+    <section class="section">
       <div class="container">
         <div class="cta">
           <p class="eyebrow cta__eyebrow"><span aria-hidden="true">$ </span>./contact --start</p>
-          <h2 class="cta__title">Un projet en tête ? Mettons-le <span class="cta__highlight">en production</span>.</h2>
+          <h2 class="cta__title">
+            Un projet en tête ?<br />
+            Mettons-le <span class="cta__highlight">en production</span>.
+          </h2>
           <p class="cta__subtitle">
             Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript,
             parlons-en.
@@ -290,10 +293,10 @@ const services: HomeServiceOffer[] = [
     desc: "Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).",
     points: [
       "Audits techniques de code & migrations de versions",
-      "Tests E2E Cypress & tests unitaires Vitest",
+      "Tests E2E TestCafé & tests unitaires Vitest",
       "Pipelines CI/CD & conteneurisation Docker",
     ],
-    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
+    tags: ["TestCafé", "Vitest", "Docker", "CI/CD"],
     price: "Au forfait / audit",
     featured: false,
   },
@@ -367,55 +370,48 @@ usePageSeo({
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
+  font-size: clamp(2.4rem, 5.2vw, 4.4rem);
+  font-weight: var(--fw-regular);
+  line-height: 1.05;
   letter-spacing: var(--ls-tight);
   color: var(--text-strong);
 
   em {
-    font-style: normal;
+    font-style: italic;

exec
/bin/zsh -lc "sed -n '1341,1665p' docs/implementation-artifacts/code-reviews/11-6/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     color: var(--accent);
   }
 }
@@ -764,19 +760,29 @@ li:last-child .work__row {
 
 .stat {
   padding: var(--space-6);
-  background: color-mix(in srgb, var(--surface-1) 70%, transparent);
+  background: color-mix(in srgb, var(--surface-1) 85%, transparent);
   border: 1px solid var(--border-subtle);
   border-radius: var(--radius-md);
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
-    margin-bottom: var(--space-1);
+    margin-bottom: var(--space-2);
     font-family: var(--font-mono);
-    font-size: clamp(var(--fs-3xl), 5vw, var(--fs-5xl));
-    font-weight: var(--fw-light);
+    font-size: clamp(var(--fs-4xl), 4.5vw, var(--fs-5xl));
+    font-weight: var(--fw-bold);
     line-height: 1;
     letter-spacing: var(--ls-tight);
-    color: var(--accent);
+    color: var(--text-strong);
   }
 
   span {
@@ -939,26 +945,29 @@ li:last-child .work__row {
 // ---- Bloc CTA final (porté de .cta) ----
 .cta {
   position: relative;
-  padding: clamp(var(--space-12), 6vw, calc(var(--space-16) + var(--space-2))) var(--space-6);
+  padding: clamp(48px, 7vw, 84px) var(--space-6);
   overflow: hidden;
   text-align: center;
   background:
-    radial-gradient(ellipse 80% 120% at 50% 0%, var(--accent-2-soft), transparent 70%),
-    color-mix(in srgb, var(--surface-2) 60%, transparent);
+    radial-gradient(ellipse 80% 120% at 50% 0%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%),
+    color-mix(in srgb, var(--surface-1) 85%, transparent);
   border: 1px solid var(--border-subtle);
   border-radius: var(--radius-lg);
+  backdrop-filter: blur(10px);
+  box-shadow: var(--shadow-3), var(--shadow-hairline);
 }
 
 .cta__eyebrow {
   display: inline-block;
+  margin-bottom: var(--space-4);
 }
 
 .cta__title {
   margin: 0 0 var(--space-4);
   font-family: var(--font-mono);
-  font-size: clamp(1.8rem, 4vw, 2.8rem);
-  font-weight: var(--fw-light);
-  line-height: var(--lh-tight);
+  font-size: clamp(2rem, 4.5vw, 3.2rem);
+  font-weight: var(--fw-regular);
+  line-height: 1.08;
   letter-spacing: var(--ls-tight);
   color: var(--text-strong);
 }
@@ -972,7 +981,7 @@ li:last-child .work__row {
   max-width: 58ch;
   margin: 0 auto var(--space-8);
   font-family: var(--font-sans);
-  font-size: var(--fs-base);
+  font-size: var(--fs-lg);
   line-height: var(--lh-relaxed);
   color: var(--text-muted);
 }
@@ -982,6 +991,7 @@ li:last-child .work__row {
   flex-wrap: wrap;
   gap: var(--space-4);
   justify-content: center;
+  align-items: center;
 }
 
 // ---- Responsive ----
diff --git a/docs/implementation-artifacts/11-6-polissage-visuel-fidelite-maquette-awwwards-et-interactions.md b/docs/implementation-artifacts/11-6-polissage-visuel-fidelite-maquette-awwwards-et-interactions.md
new file mode 100644
index 0000000..e12532d
--- /dev/null
+++ b/docs/implementation-artifacts/11-6-polissage-visuel-fidelite-maquette-awwwards-et-interactions.md
@@ -0,0 +1,168 @@
+---
+baseline_commit: 3ac365cc1a89c92b23a9d9059f13dd45b8543fbe
+---
+
+# Story 11.6: Polissage visuel, fidélité maquette Awwwards & interactions dynamiques
+
+Status: review
+
+<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
+
+## Story
+
+As a visiteur découvrant la page d'accueil de jouan.ovh,
+I want retrouver l'impact visuel immersif, le raffinement typographique et les interactions micro-cinétiques de la maquette Awwwards (hero sans rupture, header transparent puis flouté au scroll, logo officiel blanc, boutons généreux et magnétiques, cartes en 3D tilt, statistiques contrastées, carte CTA ample et aérée, footer parfaitement lisible),
+so that l'expérience soit véritablement au niveau d'un portfolio primé Awwwards et reflète une qualité d'ingénierie web et de design irréprochable (FR18, FR20, FR22, FR23, FR25, FR27, UX-DR18, UX-DR20, UX-DR22, UX-DR24, UX-DR25, NFR1, NFR2, NFR11, NFR12).
+
+## Acceptance Criteria
+
+1. **Hero & Atmosphère continue (Zéro coupure visuelle)** :
+   - **Given** la page d'accueil et la pile atmosphérique fixed `<HomeAtmosComponent />` (auroras, grille de points, scanlines, vignette)
+   - **When** la page est affichée, `.hero` ne possède aucun arrière-plan opaque (`var(--bg-page)`) ni dégradé tronquant l'atmosphère globale
+   - **Then** `.hero` a un fond 100% transparent et une hauteur minimale `min-height: 100vh`, s'intégrant sans rupture visuelle dans l'atmosphère continue
+   - **And** le titre principal du hero adopte les proportions de la maquette (`clamp(2.6rem, 6.4vw, 5.2rem)`, `line-height: 0.98`), avec les mots clés en accentuation orange italique (`<em>...</em>`), pour une scénographie visuelle affirmée.
+
+2. **Header transparent au repos & fondu sombre au scroll** :
+   - **Given** le composant `HeaderComponent.vue` fixé en haut de page
+   - **When** la position de défilement est en haut (`scrollY <= 20`)
+   - **Then** le header est transparent sans bordure inférieure (`background: transparent; border-bottom: 1px solid transparent; backdrop-filter: none;`)
+   - **And** dès le défilement (`scrollY > 20`), la classe `.stuck` est appliquée avec une transition douce de 0.3s (`background: color-mix(in srgb, var(--surface-0) 80%, transparent)` ou `hsl(320 30% 6% / 0.72)`, `backdrop-filter: blur(12px)`, bordure `var(--border-subtle)`)
+   - **And** une barre de progression de scroll discrète (hauteur 2px, dégradé accent) est présente en haut de l'écran.
+
+3. **Logo officiel blanc dans la barre de navigation** :
+   - **Given** le lien de marque `.hdr__brand` dans `HeaderComponent.vue`
+   - **When** le composant est rendu
+   - **Then** l'icône gemme orange `<ZIcon name="gem">` est remplacée par le logo officiel wireframe blanc de la marque (`/images/logo_white.png` ou SVG équivalent)
+   - **And** le logo est accompagné de `jouan.ovh` avec le domaine en nuance atténuée (`<b>jouan</b><span class="dim">.ovh</span>`).
+
+4. **Dimensions et présence des boutons (`ZButton`)** :
+   - **Given** les primitives `ZButton` et les boutons d'appel à l'action sur la home
+   - **When** ils sont affichés en taille `lg` ou standard
+   - **Then** ils bénéficient des dimensions généreuses de la maquette (`height: 46px` à `48px`, padding horizontal `0 var(--space-5)`, typo `var(--font-mono)`, `font-size: var(--fs-sm)`, `letter-spacing: var(--ls-wide)`) pour une ergonomie et un impact visuel accrus.
+
+5. **Animation et micro-interactions des boutons (Effet magnétique & Glow)** :
+   - **Given** les boutons interactifs sur la page d'accueil (ou primitive `ZButton`)
+   - **When** le pointeur de la souris survole le bouton sur ordinateur de bureau
+   - **Then** un micro-effet magnétique attire doucement le bouton et/ou son libellé intérieur (`.mag`) vers les coordonnées du curseur (`translate(x, y)` subtil)
+   - **And** le survol déclenche un feedback lumineux (`transform: translateY(-1px)`, `box-shadow: var(--glow-accent)`)
+   - **And** l'effet est neutralisé instantanément sous `prefers-reduced-motion: reduce` et sous `@media (hover: none)`.
+
+6. **Animation 3D Tilt interactive des cartes** :
+   - **Given** les cartes de la section services (`.offer` / `ZCard`) et projets
+   - **When** l'utilisateur déplace la souris sur la surface d'une carte
+   - **Then** la carte applique une inclinaison 3D dynamique en perspective (`perspective(800px) rotateX(...) rotateY(...) translateY(-4px)`)
+   - **And** lors de la sortie du curseur (`mouseleave`), la carte revient fluidement à sa position neutre
+   - **And** l'animation est strictement désactivée sous `prefers-reduced-motion: reduce`.
+
+7. **Lisibilité & Contraste des statistiques clés** :
+   - **Given** la grille des 3 cartes de statistiques (`11 années d'expérience web`, `100% TypeScript & SaaS`, `QA culture d'automatisation`)
+   - **When** elles sont affichées dans la section `section--sunken`
+   - **Then** chaque carte dispose d'un arrière-plan visible et lisible (`var(--surface-1)` ou `hsl(319 22% 9% / 0.5)` avec bordure `var(--border-subtle)`)
+   - **And** les valeurs numériques/clés `b` sont affichées en blanc pur contrasté (`var(--text-strong)`, `font-size: var(--fs-5xl)`), et les libellés descriptifs `span` en `var(--text-muted)` sans aucune transparence excessive ni zone sombre illisible.
+
+8. **Bloc CTA « Un projet en tête ? » ample et aéré** :
+   - **Given** le conteneur `.cta` de conversion finale
+   - **When** le bloc est rendu
+   - **Then** il dispose d'un espacement généreux fidèle à la maquette (`padding: clamp(48px, 7vw, 84px) var(--space-6)`)
+   - **And** le fond arbore un halo lumineux radial supérieur (`radial-gradient(ellipse 80% 120% at 50% 0%, var(--accent-2-soft), transparent 70%)`)
+   - **And** le titre h2 gagne en échelle (`clamp(2rem, 5vw, 3.4rem)`) avec l'accentuation « *en production* » en italique accentué, et des boutons d'action largement espacés.
+
+9. **Contraste et visibilité du Footer** :
+   - **Given** le composant `FooterComponent.vue`
+   - **When** le footer est affiché
+   - **Then** tous les éléments textuels (titres de colonnes `// NAVIGATION`, `// PROJETS`, `// RÉSEAUX`, description du profil, mentions légales) respectent les critères de contraste WCAG AA sur le fond sombre (`var(--text-muted)` pour les labels, `var(--text-body)` pour le corps, `var(--text-strong)` au hover des liens), garantissant une lisibilité sans effort.
+
+10. **Validation qualité & Gate Docker** :
+    - **Given** l'ensemble des ajustements visuels et interactifs appliqués
+    - **When** on exécute la suite de validation Docker
+    - **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` passe avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript, et 13 routes statiques générées avec succès par Nitro.
+
+## Tasks / Subtasks
+
+- [x] Tâche 1 — Hero & Atmosphère continue (AC: 1)
+  - [x] Supprimer les fonds solides/dégradés opaques `.hero__grad` avec `var(--bg-page)` dans `app/pages/index.vue`.
+  - [x] Passer `.hero` en fond transparent sur `min-height: 100vh` avec padding généreux pour respirer avec le viewport.
+  - [x] Rehausser la typographie du titre `.hero__title` (`clamp(2.4rem, 5.2vw, 4.4rem)`, `line-height: 1.05`) et insérer les spans/italiques accentués (`<em>`) pour un impact éditorial fidèle à la maquette.
+
+- [x] Tâche 2 — Header dynamique au scroll & Barre de progression (AC: 2, 3)
+  - [x] Mettre à jour `HeaderComponent.vue` pour démarrer avec un état transparent sans bordure au repos (`scrollY <= 20`).
+  - [x] Ajouter l'écouteur de scroll (throttlé/passif ou `useEventListener`) activant la classe `.hdr--stuck` avec fond de verre sombre flouté (`backdrop-filter: blur(12px)`) et bordure `var(--border-subtle)`.
+  - [x] Ajouter la barre de progression de défilement (hauteur 2px, dégradé `var(--accent)`) liée au scroll global.
+  - [x] Remplacer l'icône gemme orange `<ZIcon name="gem">` par le logo officiel wireframe blanc [`public/images/logo_white.png`](file:///Users/simon/dev/jouan.ovh/public/images/logo_white.png) avec le texte `jouan.ovh` (`<b>jouan</b><span class="dim">.ovh</span>`).
+
+- [x] Tâche 3 — Tailles des boutons & Effet magnétique (AC: 4, 5)
+  - [x] Ajuster la primitive `ZButton.vue` pour les tailles `lg` et standard (hauteur 48px en lg / 42px en standard, padding horizontal généreux, typo mono, tracking étendu).
+  - [x] Ajouter le support du micro-effet magnétique sur les boutons interactifs desktop (`mousemove` / décalage subtil du texte `.zbtn__inner`), avec réinitialisation sur `mouseleave` et neutralisation sous `prefers-reduced-motion: reduce`.
+  - [x] Ajouter les transitions et ombres portées accentuées au hover (`var(--glow-accent)`, `translateY(-1px)`).
+
+- [x] Tâche 4 — Effet 3D Tilt sur les cartes de services & projets (AC: 6)
+  - [x] Intégrer la directive ou l'écouteur `mousemove` d'inclinaison 3D (`perspective(800px) rotateX(...) rotateY(...) translateY(-4px)`) sur les cartes de services (`ZCard` avec prop `tilt`) et les blocs journal.
+  - [x] S'assurer du retour doux à la normale sur `mouseleave`.
+  - [x] Encapsuler l'effet sous garde `matchMedia('(prefers-reduced-motion: reduce)')` et `import.meta.client`.
+
+- [x] Tâche 5 — Lisibilité des Statistiques & CTA de conversion (AC: 7, 8)
+  - [x] Corriger le style des cartes `.stat` dans `app/pages/index.vue` : fond `var(--surface-1)` / `hsl(319 22% 9% / 0.85)`, bordure subtile, chiffres `b` éclatants en blanc `var(--text-strong)` (`fs-5xl`), libellés `span` en `var(--text-muted)`.
+  - [x] Agrandir le conteneur `.cta` (`padding: clamp(48px, 7vw, 84px) var(--space-6)`), injecter le dégradé radial supérieur d'ambiance, rehausser le titre h2 (`clamp(2rem, 4.5vw, 3.2rem)`) et espacer les CTAs.
+
+- [x] Tâche 6 — Visibilité et contraste du Footer (AC: 9)
+  - [x] Revoir les styles et contrastes de `FooterComponent.vue` pour rehausser les couleurs de texte (`var(--text-muted)` / `var(--text-strong)`, logo white wireframe).
+  - [x] S'assurer que chaque lien de navigation, lien de projet et mention légale ressort clairement sur le fond sombre sans sensation d'invisibilité ou de transparence excessive.
+
+- [x] Tâche 7 — Validation qualité & Gate Docker (AC: 10)
+  - [x] Lancer la suite de validation Docker complète : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
+  - [x] Vérifier la conformité de l'affichage sur navigateur et la non-régression multi-pages (13 routes pré-rendues statiquement).
+
+## Dev Notes
+
+- **Atmosphère & Hero :** La maquette [`Home - Awwwards.html`](file:///Users/simon/dev/jouan.ovh/docs/design_system/ui_kits/jouan-site/Home%20-%20Awwwards.html) repose sur un conteneur d'atmosphère `.atmos` en `position: fixed; inset: 0; z-index: 0;` avec 3 auroras (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`), la grille de points (`.grid-dots`), les scanlines CRT et la vignette. Le Hero est désormais **entièrement transparent** afin de flotter au-dessus de cette atmosphère sans délimitation carrée ou coupure de couleur.
+- **Header scroll behavior :** Dans `HeaderComponent.vue`, le header est fixé en haut avec un fond transparent sans bordure à `scrollY <= 20`, puis bascule vers `.hdr--stuck` avec fond de verre flouté (`backdrop-filter: blur(12px)`) et bordure `var(--border-subtle)` au scroll. La fine barre de progression supérieure suit la position de défilement.
+- **Magnetic buttons & Tilt cards :** Implémentés au cœur des primitives `ZButton.vue` (effet magnétique 2D sur le conteneur et son sous-élément `zbtn__inner`) et `ZCard.vue` (prop `tilt` avec projection `perspective(800px) rotateX(...) rotateY(...)`), neutralisés automatiquement sous reduced-motion.
+- **Tokens SCSS & Docker gate :** Conforme aux invariants `AGENTS.md` — 0 erreur ESLint/Stylelint, 0 erreur TypeScript vue-tsc, 13 routes statiques SSG Nitro générées dans le conteneur Docker.
+
+### Project Structure Notes
+
+- Fichiers modifiés :
+  - `app/pages/index.vue` (hero transparent sans coupure, h1 expressif, cartes stats contrastées et lisibles, CTA ample et aéré, activation tilt sur les cartes)
+  - `app/components/HeaderComponent.vue` (header transparent initialement, classe `.hdr--stuck` au scroll, logo white wireframe, barre de progression)
+  - `app/components/FooterComponent.vue` (logo white wireframe, contrastes renforcés des liens et en-têtes)
+  - `app/components/ui/ZButton.vue` (dimensions généreuses, micro-effet magnétique fluide)
+  - `app/components/ui/ZCard.vue` (support du 3D tilt interactif sur mousemove)
+
+### References
+
+- [Maquette Awwwards concept](file:///Users/simon/dev/jouan.ovh/docs/design_system/ui_kits/jouan-site/Home%20-%20Awwwards.html)
+- [AGENTS.md](file:///Users/simon/dev/jouan.ovh/AGENTS.md)
+- [Sprint Status](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/sprint-status.yaml)
+- [Epics & Stories](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md#epic-11)
+
+## Dev Agent Record
+
+### Agent Model Used
+
+Gemini 3.7 Flash (Medium)
+
+### Debug Log References
+
+- Validation Docker exécutée avec succès (`pnpm lint && pnpm typecheck && pnpm generate`) : 0 erreur, 13 routes pré-rendues statiquement.
+
+### Completion Notes List
+
+- ✅ Hero sans coupure : suppression du fond solide `.hero__grad`, hero 100% transparent sur `min-height: 100vh`, titre ample avec em en orange italique.
+- ✅ Header au scroll : transparent sans bordure au repos (`scrollY <= 20`), fond sombre flouté (`backdrop-filter: blur(12px)`) au scroll (`.hdr--stuck`), barre de progression 2px en haut.
+- ✅ Logo officiel blanc : remplacement du diamant orange par `logo_white.png` dans le header et le footer.
+- ✅ Boutons agrandis et magnétiques : primitive `ZButton` enrichie avec dimensions généreuses (48px en lg, 42px en standard) et micro-effet magnétique sur desktop.
+- ✅ 3D Tilt des cartes : support natif dans `ZCard` (`prop tilt`) sur les services et les articles du journal.
+- ✅ Statistiques lisibles et contrastées : fond `var(--surface-1)` / `85%`, chiffres `b` en blanc pur éclatant `var(--text-strong)` (`fs-5xl`).
+- ✅ Bloc CTA « Un projet en tête ? » : padding ample (`clamp(48px, 7vw, 84px)`), halo lumineux radial supérieur, typographie h2 expressive et boutons aérés.
+- ✅ Footer contrasté : contraste et visibilité rehaussés des rubriques et liens.
+
+### File List
+
+- `app/pages/index.vue`
+- `app/components/HeaderComponent.vue`
+- `app/components/FooterComponent.vue`
+- `app/components/ui/ZButton.vue`
+- `app/components/ui/ZCard.vue`
+- `docs/implementation-artifacts/11-6-polissage-visuel-fidelite-maquette-awwwards-et-interactions.md`
+- `docs/implementation-artifacts/sprint-status.yaml`
+- `docs/planning-artifacts/epics.md`
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 87a6fd7..134eb26 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-13 (Story 11.5 done : Validation transverse a11y, multi-pages & Gate Docker)"
+last_updated: "2026-09-14 (Story 11.6 créée : Polissage visuel, fidélité maquette Awwwards & interactions dynamiques)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -118,10 +118,11 @@ development_status:
   epic-10-retrospective: done
 
   # Epic 11 — Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
-  epic-11: in-progress
+  epic-11: done
   11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique: done
   11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique: done
   11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles: done
   11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: done
   11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker: done
+  11-6-polissage-visuel-fidelite-maquette-awwwards-et-interactions: done
   epic-11-retrospective: optional
diff --git a/docs/planning-artifacts/epics.md b/docs/planning-artifacts/epics.md
index d31ac68..f0abe67 100644
--- a/docs/planning-artifacts/epics.md
+++ b/docs/planning-artifacts/epics.md
@@ -787,3 +787,24 @@ So that la refonte de la home est irréprochable et prête pour la production (C
 **Then** aucun focus trap n'existe, les éléments interactifs sont accessibles au clavier avec focus visible, les animations sont neutralisées sous reduced-motion (seul le caret clignote), et aucun lien avec ancre intra-page `#` n'est présent (les routes `/services`, `/about`, `/blog`, `/contact` restent des pages indépendantes)
 **And** la suite de validation Docker complète (`pnpm lint && pnpm typecheck && pnpm generate`) est exécutée avec succès (0 erreur ESLint/Stylelint, 0 erreur TypeScript, 13 routes pré-rendues)
 
+### Story 11.6: Polissage visuel, fidélité maquette Awwwards & interactions dynamiques
+
+As a visiteur découvrant la page d'accueil de jouan.ovh,
+I want retrouver l'impact visuel immersif, le raffinement typographique et les interactions micro-cinétiques de la maquette Awwwards (hero sans rupture, header transparent puis flouté au scroll, logo officiel blanc, boutons généreux et magnétiques, cartes en 3D tilt, statistiques contrastées, carte CTA ample et aérée, footer parfaitement lisible),
+So that l'expérience soit véritablement au niveau d'un portfolio primé Awwwards et reflète une qualité d'ingénierie web et de design irréprochable (FR18, FR20, FR22, FR23, FR25, FR27, UX-DR18, UX-DR20, UX-DR22, UX-DR24, UX-DR25, NFR1, NFR2, NFR11, NFR12).
+
+**Acceptance Criteria:**
+
+**Given** la maquette de référence `Home - Awwwards.html` et les retours d'évaluation visuelle
+**When** on implémente la passe de polissage UX/UI sur la page d'accueil et le layout
+**Then** `.hero` a un fond 100% transparent sur `min-height: 100vh` sans dégradé opaque de coupure, avec un titre h1 ample (`clamp(2.6rem, 6.4vw, 5.2rem)`) et ses accents en orange italique
+**And** le header démarre 100% transparent sans bordure au repos (`scrollY <= 20`) puis devient flouté translucide (`.stuck`) au scroll avec barre de progression de défilement discrète
+**And** le logo officiel wireframe blanc `logo_white.png` remplace l'icône gemme orange dans le header
+**And** les boutons (`ZButton`) gagnent des dimensions généreuses (hauteur 46-48px, padding étendu) et un micro-effet magnétique fluide desktop neutralisé sous reduced-motion
+**And** les cartes de services et de projets intègrent l'effet 3D tilt au mouvement de la souris (neutralisé sous reduced-motion)
+**And** les 3 cartes statistiques (`11`, `100%`, `QA`) ont un fond de carte visible et des chiffres en blanc contrasté `var(--text-strong)` parfaitement lisibles
+**And** le bloc CTA final `.cta` est aéré (`padding: clamp(48px, 7vw, 84px) var(--space-6)`), avec son halo lumineux radial supérieur et sa typographie h2 valorisée
+**And** le footer rehausse le contraste de l'ensemble de ses libellés et liens pour une lisibilité WCAG AA irréprochable
+**And** la suite de validation Docker complète (`pnpm lint && pnpm typecheck && pnpm generate`) est exécutée avec succès (0 erreur ESLint/Stylelint, 0 erreur TypeScript, 13 routes pré-rendues)
+
+

codex
Le diff couvre cinq composants de production et plusieurs artefacts de suivi. Je poursuis avec une vérification croisée des implémentations et des critères annoncés, notamment les invariants d’accessibilité, le SSR/SSG, le reduced-motion et la cohérence des tokens.
exec
/bin/zsh -lc "sed -n '360,760p' docs/implementation-artifacts/code-reviews/11-6/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
+
+function onScroll() {
+  const top = window.scrollY || document.documentElement.scrollTop || 0;
+  isScrolled.value = top > 20;
+  const h = document.documentElement.scrollHeight - window.innerHeight;
+  scrollProgress.value = h > 0 ? (top / h) * 100 : 0;
+}
+
 // --- Terminal easter-egg (préservé) ---
 const terminalManager = ref<InstanceType<typeof TerminalManagerComponent> | null>(null);
 
@@ -133,6 +161,14 @@ function closeMenu() {
   menuOpen.value = false;
 }
 
+function onBrandClick(event: MouseEvent) {
+  closeMenu();
+  if (route.path === "/") {
+    event.preventDefault();
+    window.scrollTo({ top: 0, behavior: "smooth" });
+  }
+}
+
 // Fermeture clavier/overlay : renvoie le focus au burger (déclencheur) — a11y.
 function closeMenuAndRefocus() {
   if (!menuOpen.value) {
@@ -175,30 +211,54 @@ onMounted(() => {
   desktopMq = window.matchMedia("(min-width: 901px)");
   desktopMq.addEventListener("change", onDesktopChange);
   registerTerminalLauncher(addNewTerminal);
+  window.addEventListener("scroll", onScroll, { passive: true });
+  onScroll();
 });
 
 onBeforeUnmount(() => {
   document.removeEventListener("keydown", onKeydown);
   desktopMq?.removeEventListener("change", onDesktopChange);
   unregisterTerminalLauncher(addNewTerminal);
+  window.removeEventListener("scroll", onScroll);
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
@@ -215,12 +275,23 @@ onBeforeUnmount(() => {
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
@@ -228,6 +299,27 @@ onBeforeUnmount(() => {
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
@@ -240,38 +332,79 @@ onBeforeUnmount(() => {
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
   color: var(--text-muted);
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
 
@@ -282,10 +415,67 @@ onBeforeUnmount(() => {
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
@@ -319,16 +509,18 @@ onBeforeUnmount(() => {
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
+// Dégradé progressif pour le dock droit sur largeurs moyennes
+@media (width <= 1250px) {
+  .hdr__dock-right {
     display: none;
   }
 }
@@ -343,8 +535,7 @@ onBeforeUnmount(() => {
 // ---- Responsive : < 900px (cf. kit.css) ----
 @media (width <= 900px) {
   .hdr__nav,
-  .hdr__clock,
-  .hdr__badge,
+  .hdr__dock-right,
   .hdr__right .hdr__action {
     display: none;
   }
@@ -413,8 +604,15 @@ onBeforeUnmount(() => {
 
 @media (prefers-reduced-motion: reduce) {
   .hdr__link,
+  .hdr__link::after,
   .hdr__menu {
     transition: none;
   }
+
+  .hdr__brand .hdr__logo,
+  .hdr__brand:hover .hdr__logo {
+    transform: none;
+    transition: none;
+  }
 }
 </style>
diff --git a/app/components/HexagonLinkComponent.vue b/app/components/HexagonLinkComponent.vue
index e7cb6a4..0975be2 100644
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
-    background var(--dur-base) var(--ease-standard);
+    background var(--dur-base) var(--ease-standard),
+    transform var(--dur-base) var(--ease-standard);
 
   &:hover {
     color: var(--ink-on-accent);
     background: var(--accent);
+    transform: translateY(-2px);
   }
 
   &:focus-visible {
diff --git a/app/components/home/HomeStackMarquee.vue b/app/components/home/HomeStackMarquee.vue
index 449fa03..3be72c8 100644
--- a/app/components/home/HomeStackMarquee.vue
+++ b/app/components/home/HomeStackMarquee.vue
@@ -36,7 +36,7 @@ const SKILL_LABEL_MAP: Record<string, string> = {
   postgresql: "PostgreSQL",
   typeorm: "TypeORM",
   stripe: "Stripe Connect",
-  cypress: "Cypress",
+  testcafe: "TestCafé",
   docker: "Docker",
   "rest-api": "REST API",
   vitest: "Vitest",
diff --git a/app/components/ui/ZButton.vue b/app/components/ui/ZButton.vue
index 1bb4a23..988025e 100644
--- a/app/components/ui/ZButton.vue
+++ b/app/components/ui/ZButton.vue
@@ -1,9 +1,10 @@

exec
/bin/zsh -lc "rg -n \"HomeAtmos|hero__|stat|ZButton|ZCard|CurrentTime|logo_white|@media \\(hover|prefers-reduced-motion|section--sunken|testcafe|cypress\" app docs/design_system/ui_kits/jouan-site/Home\\ -\\ Awwwards.html public content.config.ts package.json" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "sed -n '1,260p' app/components/HeaderComponent.vue && sed -n '1,240p' app/components/ui/ZButton.vue && sed -n '1,210p' app/components/ui/ZCard.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:55:  @media (hover: none) { .cursor-dot, .cursor-ring { display: none; } }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:96:  .hero__grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: var(--space-12); align-items: center; }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:97:  @media (max-width: 940px) { .hero__grid { grid-template-columns: 1fr; gap: var(--space-10); } }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:104:  .hero__sub { max-width: 44ch; color: var(--text-body); margin: var(--space-6) 0 var(--space-7); font-size: var(--fs-lg); }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:105:  .hero__cta { display: flex; gap: var(--space-4); flex-wrap: wrap; }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:106:  .hero__meta { display: flex; gap: var(--space-6); margin-top: var(--space-8); font-family: var(--font-mono); font-size: var(--fs-sm); color: var(--text-muted); flex-wrap: wrap; }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:107:  .hero__meta .dot { color: var(--term-green); }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:131:  .marquee:hover .marquee__track { animation-play-state: paused; }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:185:  .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); margin-top: var(--space-10); }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:186:  @media (max-width: 680px) { .stats { grid-template-columns: 1fr; } }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:187:  .stat { border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: var(--space-6); background: hsl(319 22% 9% / 0.5); }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:188:  .stat b { display: block; font-family: var(--font-mono); font-size: var(--fs-5xl); color: var(--text-strong); line-height: 1; letter-spacing: var(--ls-tight); }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:189:  .stat span { font-family: var(--font-mono); font-size: var(--fs-sm); color: var(--text-muted); letter-spacing: var(--ls-wide); }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:269:  @media (prefers-reduced-motion: reduce) {
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:323:        <div class="hero__grid">
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:330:            <p class="hero__sub reveal">Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils — Symfony, Nest.js, Nuxt.js.</p>
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:331:            <div class="hero__cta reveal">
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:335:            <div class="hero__meta reveal">
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:378:        <div class="stats" id="stats"></div>
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:431:    stats: [ {n:"8+",l:"ans dans la tech"}, {n:"3",l:"stacks maîtrisés"}, {n:"1",l:"SaaS fondé"} ],
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:444:  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:473:  // ---- Render stats ----
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:474:  document.getElementById('stats').innerHTML = SITE.stats.map(s=>`
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:475:    <div class="stat reveal"><b>${s.n}</b><span>${s.l}</span></div>`).join('');
app/pages/about.vue:5:         La section CV (expériences + formation) suit dans une <section--sunken> (story 5.2). -->
app/pages/about.vue:19:              <ZButton :as="NuxtLink" to="/contact" variant="primary">Me contacter</ZButton>
app/pages/about.vue:20:              <ZButton as="a" :href="`mailto:${profile.email}`" variant="secondary">M'écrire</ZButton>
app/pages/about.vue:44:              <ul class="hero__tags">
app/pages/about.vue:56:         Porté de About.jsx (2e section--sunken), grille 1.4fr / 0.6fr. -->
app/pages/about.vue:57:    <section class="section section--sunken">
app/pages/about.vue:74:          <!-- Colonne droite : formation (une ZCard par diplôme), liste sémantique <ul>/<li>. -->
app/pages/about.vue:79:                <ZCard padded>
app/pages/about.vue:83:                </ZCard>
app/pages/about.vue:97:// stack en <ZTag>, formation en <ZCard>. Dark-first, tokens uniquement, prerender-safe.
app/pages/about.vue:176:// .section / .container / .eyebrow / .prose / .hero__tags sont des primitives de
app/pages/about.vue:267:// .hero__tags (rangée de chips) = primitive de layout globale (base/_layout.scss).
app/pages/blog/[...slug].vue:11:          <ul v-if="page.tags?.length" class="hero__tags article__tags">
app/pages/blog/[...slug].vue:48:            <ZButton :as="NuxtLink" to="/contact" variant="primary">
app/pages/blog/[...slug].vue:51:            </ZButton>
app/pages/blog/[...slug].vue:84:    return createError({ statusCode: 500, statusMessage: "Erreur lors du chargement de l'article" });
app/pages/blog/[...slug].vue:87:    return createError({ statusCode: 404, statusMessage: "Article introuvable" });
app/pages/blog/[...slug].vue:92:// Rendu initial (SSR / prerender) : throw pour fixer le bon statut HTTP. Pas besoin de
app/pages/blog/[...slug].vue:164:// .section / .container / .prose / .hero__tags / .post__meta sont des primitives de
app/pages/blog/index.vue:15:            <ZCard :as="NuxtLink" :to="article.path" interactive class="post">
app/pages/blog/index.vue:27:                <ul v-if="article.tags?.length" class="hero__tags post__tags">
app/pages/blog/index.vue:43:            </ZCard>
app/pages/blog/index.vue:47:        <!-- Erreur de chargement (distincte d'un véritable empty-state) -->
app/pages/blog/index.vue:48:        <ZCard v-else-if="error" class="blog__notice" padded>
app/pages/blog/index.vue:61:        </ZCard>
app/pages/blog/index.vue:63:        <!-- Empty-state : aucun article publié (texte français conservé, restylé via tokens) -->
app/pages/blog/index.vue:64:        <ZCard v-else class="blog__notice" padded>
app/pages/blog/index.vue:77:        </ZCard>
app/pages/blog/index.vue:85:// cartes ZCard interactives, méta mono, empty-state restylé. Contenu via @nuxt/content
app/pages/blog/index.vue:93:// véritable empty-state (liste vide).
app/pages/blog/index.vue:156:// .section / .container / .eyebrow / .prose / .hero__tags / .post__meta sont des
app/pages/blog/index.vue:189:// Carte article = ZCard interactive rendue en lien : grille vignette / contenu.
app/pages/blog/index.vue:229:// ---- Empty-state / erreur (ZCard centrée, illustration + message) ----
app/pages/services.vue:7:        <h1 class="services__title">Des prestations claires, pensées comme des produits.</h1>
app/pages/services.vue:15:            <ZCard class="offer" :accent="offer.featured" :featured="offer.featured">
app/pages/services.vue:29:                <ZButton
app/pages/services.vue:37:                </ZButton>
app/pages/services.vue:39:            </ZCard>
app/pages/services.vue:46:    <section class="section section--sunken">
app/pages/services.vue:60:          <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
app/pages/services.vue:63:          </ZButton>
app/pages/services.vue:72:// Données statiques (3 offres, 4 étapes) déclarées localement. Prerender-safe, dark-first.
app/pages/services.vue:138:    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
app/pages/services.vue:166:    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
app/pages/services.vue:180:// .section / .section--sunken / .container / .eyebrow / .prose : primitives de
app/pages/contact.vue:15:            <!-- État « envoyé » : carte accent + ligne mono verte. role="status" + focus
app/pages/contact.vue:17:            <ZCard v-if="sent" ref="sentCard" accent class="contact__sent" role="status" tabindex="-1">
app/pages/contact.vue:20:            </ZCard>
app/pages/contact.vue:24:                 natives). Compatible site statique : le fetch ne tourne qu'au clic, côté client. -->
app/pages/contact.vue:75:                <ZButton type="submit" variant="primary" size="lg" :disabled="sending">
app/pages/contact.vue:78:                </ZButton>
app/pages/contact.vue:93:            <ZCard class="contact__infocard">
app/pages/contact.vue:112:            </ZCard>
app/pages/contact.vue:115:            <ZCard class="contact__term">
app/pages/contact.vue:121:              <ZButton variant="terminal" size="sm" aria-haspopup="dialog" @click="openTerminal">
app/pages/contact.vue:124:              </ZButton>
app/pages/contact.vue:125:            </ZCard>
app/pages/contact.vue:456:// Surcharge du fond/bordure de ZCard ; nesting sous .contact__info pour la spécificité.
app/pages/mentions-legales.vue:43:              Le site est hébergé sous forme statique par :<br />
app/pages/confidentialite.vue:140:              Le site <strong>jouan.ovh</strong> est un site statique hébergé sur GitHub Pages. Il
app/pages/index.vue:6:    <HomeAtmosComponent />
app/pages/index.vue:10:      <div class="hero__in container">
app/pages/index.vue:11:        <div class="hero__grid">
app/pages/index.vue:13:          <div class="anim hero__text">
app/pages/index.vue:15:            <h1 class="hero__title">Développeur Full Stack <em>TypeScript</em></h1>
app/pages/index.vue:16:            <p class="hero__sub">
app/pages/index.vue:21:            <div class="hero__badge-wrap">
app/pages/index.vue:22:              <span class="hero__pulse-dot" aria-hidden="true" />
app/pages/index.vue:30:            <div class="hero__cta">
app/pages/index.vue:31:              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
app/pages/index.vue:34:              </ZButton>
app/pages/index.vue:35:              <ZButton :as="NuxtLink" to="/about" variant="secondary" size="lg"> Voir le parcours &amp; CV </ZButton>
app/pages/index.vue:40:          <div class="anim hero__term-col">
app/pages/index.vue:46:        <HomeStackMarquee class="hero__marquee" />
app/pages/index.vue:57:            <ZCard class="offer" interactive tilt :accent="service.featured" :featured="service.featured">
app/pages/index.vue:70:              <ul class="hero__tags offer__tags">
app/pages/index.vue:81:            </ZCard>
app/pages/index.vue:108:                  <span v-if="project.status" class="work__status">{{ project.status }}</span>
app/pages/index.vue:112:                <ul class="hero__tags work__tags">
app/pages/index.vue:126:        <ul class="stats">
app/pages/index.vue:127:          <li v-for="stat in stats" :key="stat.id" class="stat">
app/pages/index.vue:128:            <b>{{ stat.value }}</b>
app/pages/index.vue:129:            <span>{{ stat.label }}</span>
app/pages/index.vue:152:            <ZCard :as="NuxtLink" :to="article.path" :padded="false" interactive tilt class="jpost" data-hot>
app/pages/index.vue:164:                <ul v-if="article.tags?.length" class="hero__tags jpost__tags">
app/pages/index.vue:182:            </ZCard>
app/pages/index.vue:187:        <ZCard v-else class="journal__empty" padded>
app/pages/index.vue:190:          <ZButton :as="NuxtLink" to="/blog" variant="secondary" size="sm"> Consulter la section blog </ZButton>
app/pages/index.vue:191:        </ZCard>
app/pages/index.vue:209:            <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg" data-hot>
app/pages/index.vue:212:            </ZButton>
app/pages/index.vue:213:            <ZButton
app/pages/index.vue:222:            </ZButton>
app/pages/index.vue:223:            <ZButton :as="NuxtLink" to="/about" variant="ghost" size="lg" data-hot> Voir le parcours &amp; CV </ZButton>
app/pages/index.vue:309:const stats = [
app/pages/index.vue:310:  { id: "stat-1", value: "11", label: "années d'expérience web" },
app/pages/index.vue:311:  { id: "stat-2", value: "100%", label: "TypeScript & SaaS de bout en bout" },
app/pages/index.vue:312:  { id: "stat-3", value: "QA", label: "culture d'automatisation & zéro régression" },
app/pages/index.vue:367:.hero__term-col {
app/pages/index.vue:383:.hero__in {
app/pages/index.vue:389:.hero__grid {
app/pages/index.vue:396:.hero__marquee {
app/pages/index.vue:404:.hero__title {
app/pages/index.vue:419:.hero__sub {
app/pages/index.vue:428:.hero__cta {
app/pages/index.vue:436:.hero__badge-wrap {
app/pages/index.vue:461:.hero__pulse-dot {
app/pages/index.vue:469:  @media (prefers-reduced-motion: reduce) {
app/pages/index.vue:718:.work__status {
app/pages/index.vue:751:// ---- Stats (porté de .stats) ----
app/pages/index.vue:752:.stats {
app/pages/index.vue:761:.stat {
app/pages/index.vue:999:  .hero__grid {
app/pages/index.vue:1003:  .hero__title {
app/pages/index.vue:1029:  .stats {
app/pages/index.vue:1034:@media (prefers-reduced-motion: reduce) {
app/assets/scss/abstract/_color.scss:52:// * Step 3 is for normal states.
app/assets/scss/abstract/_color.scss:53:// * Step 4 is for hover states.
app/assets/scss/abstract/_color.scss:54:// * Step 5 is for pressed or selected states.
app/assets/scss/abstract/_color.scss:56:// Even if your component has a transparent background in its default state,
app/assets/scss/abstract/_color.scss:57:// you should skip Step 3 and use Step 4 for its hover state.
app/assets/scss/abstract/_color.scss:78:// * Step 8 is designed for borders on interactive components in their hover state.
app/assets/scss/abstract/_color.scss:95:// Step 10 is designed for component hover states, where step 9 is the component's normal state background.
app/assets/scss/abstract/_color.scss:146:// Colors that help identify status,
app/assets/scss/base/_motion.scss:2://  Accessibilité — prefers-reduced-motion (story 9.2, CAP-11)
app/assets/scss/base/_motion.scss:6:// l'instantané. Les gardes par composant (ZCard / ZInput / ZTag / index.vue…)
app/assets/scss/base/_motion.scss:7:// restent en place et cohérentes ; cette règle couvre le reste (ZButton, etc.)
app/assets/scss/base/_motion.scss:24:@media (prefers-reduced-motion: reduce) {
app/assets/scss/base/_layout.scss:4://  .section / .section--sunken / .container / .eyebrow / .prose
app/assets/scss/base/_layout.scss:11:/* stylelint-disable selector-class-pattern -- convention DS BEM (.section--sunken) portée depuis kit.css */
app/assets/scss/base/_layout.scss:21:.section--sunken {
app/assets/scss/base/_layout.scss:62:.hero__tags {
app/components/HeaderComponent.vue:6:        <img src="/images/logo_white.png" alt="" class="hdr__logo" width="24" height="24" />
app/components/HeaderComponent.vue:25:        <ZButton variant="terminal" size="sm" class="hdr__action hdr__action--terminal" @click="addNewTerminal">
app/components/HeaderComponent.vue:28:        </ZButton>
app/components/HeaderComponent.vue:29:        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" class="hdr__action">
app/components/HeaderComponent.vue:31:        </ZButton>
app/components/HeaderComponent.vue:49:      <div class="hdr__status-badge">
app/components/HeaderComponent.vue:50:        <span class="hdr__status-dot" aria-hidden="true" />
app/components/HeaderComponent.vue:51:        <span class="hdr__status-text">Disponible</span>
app/components/HeaderComponent.vue:53:      <CurrentTime class="hdr__dock-clock" />
app/components/HeaderComponent.vue:74:        <div class="hdr__menu-status">
app/components/HeaderComponent.vue:75:          <div class="hdr__status-badge">
app/components/HeaderComponent.vue:76:            <span class="hdr__status-dot" aria-hidden="true" />
app/components/HeaderComponent.vue:77:            <span class="hdr__status-text">Disponible</span>
app/components/HeaderComponent.vue:79:          <CurrentTime class="hdr__menu-clock" />
app/components/HeaderComponent.vue:81:        <ZButton variant="terminal" size="sm" class="hdr__action--terminal" @click="openTerminalFromMenu">
app/components/HeaderComponent.vue:84:        </ZButton>
app/components/HeaderComponent.vue:85:        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" @click="closeMenu">
app/components/HeaderComponent.vue:87:        </ZButton>
app/components/HeaderComponent.vue:119:// --- Scroll state & progress ---
app/components/HeaderComponent.vue:430:// Dock de statut & horloge positionné tout à droite de l'écran (hors container centré)
app/components/HeaderComponent.vue:442:.hdr__status-badge {
app/components/HeaderComponent.vue:469:.hdr__status-dot {
app/components/HeaderComponent.vue:512:.hdr__menu-status {
app/components/HeaderComponent.vue:605:@media (prefers-reduced-motion: reduce) {
app/data/site.ts:27:  status?: string;
app/data/site.ts:50:  "testcafe",
app/data/site.ts:62:    status: "● En production",
app/data/site.ts:69:    status: "○ Étude de cas (MVP livré)",
app/data/site.ts:76:    status: "◐ R&D / En cours",
app/assets/scss/main.scss:6:@use "base/motion"; // filet a11y global prefers-reduced-motion (story 9.2)
app/layouts/default.vue:21:  // propre `hero__grad`, le footer son `--bg-sunken` — inchangés.
app/components/CurrentTime.vue:16:  name: "CurrentTime",
app/components/CurrentTime.vue:80:@media (prefers-reduced-motion: reduce) {
app/components/HexagonLinkComponent.vue:60:@media (prefers-reduced-motion: reduce) {
app/components/FooterComponent.vue:7:            <img src="/images/logo_white.png" alt="" class="ftr__logo" width="22" height="22" />
app/components/FooterComponent.vue:25:              <span v-else class="ftr__link ftr__link--static">{{ project.name }}</span>
app/components/FooterComponent.vue:186:  &--static {
app/components/FooterComponent.vue:220:@media (prefers-reduced-motion: reduce) {
app/components/terminal/TerminalComponent.vue:68:// Import statique : les valeurs par défaut sont disponibles dès l'exécution du setup,
app/components/terminal/TerminalComponent.vue:468:      // prefers-reduced-motion ; aucune boucle CSS n'étant introduite, il n'y a rien à neutraliser.)
app/components/home/HomeStackMarquee.vue:26:// Pause automatique au :hover et arrêt complet sous prefers-reduced-motion.
app/components/home/HomeStackMarquee.vue:39:  testcafe: "TestCafé",
app/components/home/HomeStackMarquee.vue:61:    animation-play-state: paused;
app/components/home/HomeStackMarquee.vue:103:@media (prefers-reduced-motion: reduce) {
app/components/card/ZCardFooter.vue:11:  name: "ZCardFooter",
app/components/home/HomeBootOverlay.vue:6:    role="status"
app/components/home/HomeBootOverlay.vue:41:// Contournement immédiat sous prefers-reduced-motion ou via clic / touche Escape.
app/components/home/HomeBootOverlay.vue:131:  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
app/components/home/HomeBootOverlay.vue:251:@media (prefers-reduced-motion: reduce) {
app/components/terminal/programs/Projets.ts:12:        const status = p.status ? ` [${p.status}]` : "";
app/components/terminal/programs/Projets.ts:14:        return `<li>${p.name} — ${p.role} — ${p.desc}${status}${url}</li>`;
app/components/home/HomeHeroTerminal.vue:58:      <!-- Fallback statique si JavaScript est désactivé -->
app/components/home/HomeHeroTerminal.vue:86:// Neutralisé sous prefers-reduced-motion (affichage statique complet immédiat).
app/components/home/HomeHeroTerminal.vue:153:  const reduceMotion = import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
app/components/home/HomeHeroTerminal.vue:215:  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
app/components/home/HomeHeroTerminal.vue:387:@media (prefers-reduced-motion: reduce) {
app/components/home/HomeAtmosComponent.vue:14:// Entièrement rendu en pur CSS, marqué aria-hidden="true", animations neutralisées sous prefers-reduced-motion.
app/components/home/HomeAtmosComponent.vue:123:@media (prefers-reduced-motion: reduce) {
app/components/terminal/programs/Contact.ts:10:    const statut = SITE.profile.available ? "disponible pour de nouveaux projets" : "indisponible pour le moment";
app/components/terminal/programs/Contact.ts:15:      `<li>statut : ${statut}</li>`,
app/components/ui/ZButton.vue:77:  isReducedMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
app/components/ui/ZButton.vue:304:@media (prefers-reduced-motion: reduce) {
app/components/card/ZCardBody.vue:10:  name: "ZCardBody",
app/components/card/ZCardBody.vue:19:  // illisible sur le fond sombre --bg-card de ZCard → encre claire --text-strong.
app/components/card/ZCardBody.vue:33:@media (prefers-reduced-motion: reduce) {
app/components/card/ZCardHeader.vue:26:  name: "ZCardHeader",
app/components/ui/ZBadge.vue:9:// Primitive badge du DS — petit libellé de statut / catégorie (palette terminale/sémantique).
app/components/ui/ZBadge.vue:15:  /** Point de statut en tête. @default false */
app/components/ui/ZCustomCursor.vue:21:// Masqué sur mobile/tactile (hover: none) et prefers-reduced-motion.
app/components/ui/ZCustomCursor.vue:109:  motionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
app/components/ui/ZCustomCursor.vue:182:@media (hover: none), (prefers-reduced-motion: reduce) {
app/components/ui/ZCard.vue:60:  isReducedMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
app/components/ui/ZCard.vue:156:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZInput.vue:233:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZIcon.vue:25:// Le `v-html` du template injecte uniquement ces chaînes internes statiques.
app/components/ui/ZTag.vue:184:@media (prefers-reduced-motion: reduce) {

 succeeded in 0ms:
<template>
  <header class="hdr" :class="{ 'hdr--stuck': isScrolled }">
    <div class="hdr__progress" :style="{ width: `${scrollProgress}%` }" aria-hidden="true" />
    <div class="hdr__in">
      <NuxtLink to="/" class="hdr__brand" @click="onBrandClick">
        <img src="/images/logo_white.png" alt="" class="hdr__logo" width="24" height="24" />
        <span class="hdr__brand-text"><b>jouan</b><span class="dim">.ovh</span></span>
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
          <span class="hdr__link-prefix" aria-hidden="true">{{ item.prefix }} </span>
          <span class="hdr__link-label">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="hdr__right">
        <ZButton variant="terminal" size="sm" class="hdr__action hdr__action--terminal" @click="addNewTerminal">
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

    <!-- Dock d'état tout à droite de l'écran (hors container centré) -->
    <div class="hdr__dock-right" aria-label="Statut et heure">
      <div class="hdr__status-badge">
        <span class="hdr__status-dot" aria-hidden="true" />
        <span class="hdr__status-text">Disponible</span>
      </div>
      <CurrentTime class="hdr__dock-clock" />
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
        <span class="hdr__menu-link-prefix" aria-hidden="true">{{ item.prefix }} </span>
        <span class="hdr__menu-link-label">{{ item.label }}</span>
      </NuxtLink>

      <div class="hdr__menu-actions">
        <div class="hdr__menu-status">
          <div class="hdr__status-badge">
            <span class="hdr__status-dot" aria-hidden="true" />
            <span class="hdr__status-text">Disponible</span>
          </div>
          <CurrentTime class="hdr__menu-clock" />
        </div>
        <ZButton variant="terminal" size="sm" class="hdr__action--terminal" @click="openTerminalFromMenu">
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
  { to: "/", label: "Accueil", prefix: "~" },
  { to: "/services", label: "Services", prefix: "//" },
  { to: "/about", label: "À propos", prefix: "./" },
  { to: "/blog", label: "Blog", prefix: "~/" },
  { to: "/contact", label: "Contact", prefix: "$" },
];

// Lien actif : exact pour l'accueil, préfixe pour les autres (couvre /blog/[...slug]).
function isActive(to: string): boolean {
  if (to === "/") {
    return route.path === "/";
  }
  return route.path === to || route.path.startsWith(`${to}/`);
}

// --- Scroll state & progress ---
const isScrolled = ref(false);
const scrollProgress = ref(0);

function onScroll() {
  const top = window.scrollY || document.documentElement.scrollTop || 0;
  isScrolled.value = top > 20;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.value = h > 0 ? (top / h) * 100 : 0;
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

function onBrandClick(event: MouseEvent) {
  closeMenu();
  if (route.path === "/") {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
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
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKeydown);
  desktopMq?.removeEventListener("change", onDesktopChange);
  unregisterTerminalLauncher(addNewTerminal);
  window.removeEventListener("scroll", onScroll);
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css */
.hdr {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  height: var(--header-height);
  background: transparent;
  border-bottom: 1px solid transparent;
  transition:
    background var(--dur-base) var(--ease-standard),
    border-color var(--dur-base) var(--ease-standard),
    backdrop-filter var(--dur-base) var(--ease-standard),
    -webkit-backdrop-filter var(--dur-base) var(--ease-standard);
}

.hdr--stuck {
  background: color-mix(in srgb, var(--surface-0) 80%, transparent);
  border-bottom-color: var(--border-subtle);

  /* stylelint-disable-next-line property-no-vendor-prefix -- Safari : autoprefixer non câblé, préfixe manuel requis */
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}

.hdr__progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
  box-shadow: 0 0 10px var(--accent);
  pointer-events: none;
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
import { computed, onMounted, ref, useAttrs } from "vue";

defineOptions({
  inheritAttrs: false,
});

type IconProp = string | Component;

interface Props {
  /** Style visuel. @default "primary" */
  variant?: "primary" | "secondary" | "ghost" | "terminal" | "danger";
  /** @default "md" — hauteurs 32 / 40 / 48 */
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

onMounted(() => {
  isReducedMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
});

function onMouseMove(event: MouseEvent) {
  if (!props.magnetic || isReducedMotion.value || !buttonEl.value || props.disabled) {
    return;
  }
  const el = ((buttonEl.value as ComponentPublicInstance).$el ?? buttonEl.value) as HTMLElement | null;
  if (!el || !(el instanceof HTMLElement)) {
    return;
  }
  const rect = el.getBoundingClientRect();
  const x = event.clientX - rect.left - rect.width / 2;
  const y = event.clientY - rect.top - rect.height / 2;
  el.style.transform = `translate(${x * 0.16}px, ${y * 0.18}px)`;
  if (innerEl.value) {
    innerEl.value.style.transform = `translate(${x * 0.08}px, ${y * 0.1}px)`;
  }
}

function onMouseLeave() {
  if (buttonEl.value) {
    const el = ((buttonEl.value as ComponentPublicInstance).$el ?? buttonEl.value) as HTMLElement | null;
    if (el instanceof HTMLElement) {
      el.style.transform = "";
    }
  }
  if (innerEl.value) {
    innerEl.value.style.transform = "";
  }
}

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
  --_h: 42px;
  --_px: var(--space-5);
  --_fs: var(--fs-sm);

  display: inline-flex;
  align-items: center;
  justify-content: center;
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
    box-shadow var(--dur-fast) var(--ease-standard),
    transform var(--dur-fast) var(--ease-standard);

  &:focus-visible {
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

.zbtn__inner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  transition: transform var(--dur-fast) var(--ease-standard);
  will-change: transform;
}

.zbtn__icon {
  display: inline-flex;
  width: 1.1em;
  height: 1.1em;

  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}

// ---- Tailles ----
.zbtn--sm {
  --_h: 32px;
  --_px: var(--space-3);
  --_fs: var(--fs-xs);
}

.zbtn--lg {
  --_h: 48px;
  --_px: var(--space-6);
  --_fs: var(--fs-sm);
}

// ---- Variantes ----
.zbtn--primary {
  background: var(--accent);
  color: var(--accent-text);
  border-color: var(--accent);
  box-shadow: var(--glow-accent);

  &:hover {
    background: var(--accent-hover);
    border-color: var(--accent-hover);
    box-shadow: 0 0 16px color-mix(in srgb, var(--accent) 45%, transparent);
    transform: translateY(-1px);
  }

  &:active {
    background: var(--accent-active);
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
import { computed, onMounted, ref, useAttrs } from "vue";

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

onMounted(() => {
  isReducedMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
});

function onMouseMove(event: MouseEvent) {
  if (!props.tilt || isReducedMotion.value || !cardRef.value) {
    return;
  }
  const el = ((cardRef.value as ComponentPublicInstance).$el ?? cardRef.value) as HTMLElement | null;
  if (!el || !(el instanceof HTMLElement)) {
    return;
  }
  const rect = el.getBoundingClientRect();
  const px = (event.clientX - rect.left) / rect.width - 0.5;
  const py = (event.clientY - rect.top) / rect.height - 0.5;
  el.style.transform = `perspective(800px) rotateX(${-py * 6}deg) rotateY(${px * 8}deg) translateY(-4px)`;
}

function onMouseLeave() {
  if (!props.tilt || !cardRef.value) {
    return;
  }
  const el = ((cardRef.value as ComponentPublicInstance).$el ?? cardRef.value) as HTMLElement | null;
  if (el instanceof HTMLElement) {
    el.style.transform = "";
  }
}

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

exec
/bin/zsh -lc "nl -ba app/components/ui/ZButton.vue | sed -n '1,360p'" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "nl -ba app/pages/index.vue | sed -n '1,540p'; nl -ba app/pages/index.vue | sed -n '730,1080p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	<template>
     2	  <component
     3	    :is="as"
     4	    ref="buttonEl"
     5	    v-bind="passthroughAttrs"
     6	    class="zbtn"
     7	    :class="[`zbtn--${variant}`, `zbtn--${size}`, { 'zbtn--magnetic': magnetic }]"
     8	    :type="buttonType"
     9	    :disabled="isNativeButton ? disabled || undefined : undefined"
    10	    :aria-disabled="!isNativeButton && disabled ? 'true' : undefined"
    11	    :tabindex="isDisabledNonNative ? -1 : undefined"
    12	    @click="blockDisabledActivation"
    13	    @keydown.enter="blockDisabledActivation"
    14	    @keydown.space="blockDisabledActivation"
    15	    @mousemove="onMouseMove"
    16	    @mouseleave="onMouseLeave"
    17	  >
    18	    <span ref="innerEl" class="zbtn__inner">
    19	      <span v-if="icon || $slots.icon" class="zbtn__icon">
    20	        <component :is="icon" v-if="icon" aria-hidden="true" />
    21	        <slot v-else name="icon" />
    22	      </span>
    23	      <slot />
    24	      <span v-if="iconRight || $slots.iconRight" class="zbtn__icon">
    25	        <component :is="iconRight" v-if="iconRight" aria-hidden="true" />
    26	        <slot v-else name="iconRight" />
    27	      </span>
    28	    </span>
    29	  </component>
    30	</template>
    31	
    32	<script setup lang="ts">
    33	// Primitive bouton du DS — label mono, dimensions généreuses, micro-effet magnétique.
    34	// Porté de docs/design_system/components/core/Button.jsx et Home - Awwwards.html.
    35	import type { Component, ComponentPublicInstance } from "vue";
    36	import { computed, onMounted, ref, useAttrs } from "vue";
    37	
    38	defineOptions({
    39	  inheritAttrs: false,
    40	});
    41	
    42	type IconProp = string | Component;
    43	
    44	interface Props {
    45	  /** Style visuel. @default "primary" */
    46	  variant?: "primary" | "secondary" | "ghost" | "terminal" | "danger";
    47	  /** @default "md" — hauteurs 32 / 40 / 48 */
    48	  size?: "sm" | "md" | "lg";
    49	  /** Icône leading via composant Vue ou nom de composant. */
    50	  icon?: IconProp;
    51	  /** Icône trailing via composant Vue ou nom de composant. */
    52	  iconRight?: IconProp;
    53	  /** Élément rendu (polymorphe), ex. "a" pour un lien. @default "button" */
    54	  as?: string | Component;
    55	  /** Désactivé : natif sur <button>, aria-disabled + pointer-events sur les autres tags. */
    56	  disabled?: boolean;
    57	  /** Activer le micro-effet magnétique au curseur. @default true */
    58	  magnetic?: boolean;
    59	}
    60	
    61	const props = withDefaults(defineProps<Props>(), {
    62	  variant: "primary",
    63	  size: "md",
    64	  icon: undefined,
    65	  iconRight: undefined,
    66	  as: "button",
    67	  disabled: false,
    68	  magnetic: true,
    69	});
    70	
    71	const attrs = useAttrs();
    72	const buttonEl = ref<Element | ComponentPublicInstance | null>(null);
    73	const innerEl = ref<HTMLElement | null>(null);
    74	const isReducedMotion = ref(false);
    75	
    76	onMounted(() => {
    77	  isReducedMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    78	});
    79	
    80	function onMouseMove(event: MouseEvent) {
    81	  if (!props.magnetic || isReducedMotion.value || !buttonEl.value || props.disabled) {
    82	    return;
    83	  }
    84	  const el = ((buttonEl.value as ComponentPublicInstance).$el ?? buttonEl.value) as HTMLElement | null;
    85	  if (!el || !(el instanceof HTMLElement)) {
    86	    return;
    87	  }
    88	  const rect = el.getBoundingClientRect();
    89	  const x = event.clientX - rect.left - rect.width / 2;
    90	  const y = event.clientY - rect.top - rect.height / 2;
    91	  el.style.transform = `translate(${x * 0.16}px, ${y * 0.18}px)`;
    92	  if (innerEl.value) {
    93	    innerEl.value.style.transform = `translate(${x * 0.08}px, ${y * 0.1}px)`;
    94	  }
    95	}
    96	
    97	function onMouseLeave() {
    98	  if (buttonEl.value) {
    99	    const el = ((buttonEl.value as ComponentPublicInstance).$el ?? buttonEl.value) as HTMLElement | null;
   100	    if (el instanceof HTMLElement) {
   101	      el.style.transform = "";
   102	    }
   103	  }
   104	  if (innerEl.value) {
   105	    innerEl.value.style.transform = "";
   106	  }
   107	}
   108	
   109	// `as` accepte une balise native ("button", "a") ou une référence de composant
   110	// (ex. NuxtLink importé de "#components") ; ne pas passer un nom de composant en chaîne.
   111	const isNativeButton = computed(() => props.as === "button");
   112	const isDisabledNonNative = computed(() => !isNativeButton.value && props.disabled);
   113	const buttonType = computed(() => {
   114	  if (!isNativeButton.value) {
   115	    return undefined;
   116	  }
   117	
   118	  return typeof attrs.type === "string" ? attrs.type : "button";
   119	});
   120	
   121	const passthroughAttrs = computed(() => {
   122	  if (!isDisabledNonNative.value) {
   123	    return attrs;
   124	  }
   125	
   126	  return Object.fromEntries(
   127	    Object.entries(attrs).filter(([key]) => {
   128	      return key !== "href" && key !== "tabindex" && key !== "tabIndex" && !/^on[A-Z]/.test(key);
   129	    }),
   130	  );
   131	});
   132	
   133	function blockDisabledActivation(event: Event) {
   134	  if (!isDisabledNonNative.value) {
   135	    return;
   136	  }
   137	
   138	  event.preventDefault();
   139	  event.stopPropagation();
   140	
   141	  if ("stopImmediatePropagation" in event) {
   142	    event.stopImmediatePropagation();
   143	  }
   144	}
   145	</script>
   146	
   147	<style lang="scss" scoped>
   148	/* stylelint-disable selector-class-pattern, custom-property-pattern -- convention DS portée depuis Button.jsx */
   149	.zbtn {
   150	  --_h: 42px;
   151	  --_px: var(--space-5);
   152	  --_fs: var(--fs-sm);
   153	
   154	  display: inline-flex;
   155	  align-items: center;
   156	  justify-content: center;
   157	  box-sizing: border-box;
   158	  height: var(--_h);
   159	  padding: 0 var(--_px);
   160	  font-family: var(--font-mono);
   161	  font-size: var(--_fs);
   162	  font-weight: var(--fw-medium);
   163	  line-height: 1;
   164	  letter-spacing: var(--ls-wide);
   165	  white-space: nowrap;
   166	  text-decoration: none;
   167	  cursor: pointer;
   168	  user-select: none;
   169	  border: 1px solid transparent;
   170	  border-radius: var(--radius-md);
   171	  transition:
   172	    background var(--dur-fast) var(--ease-standard),
   173	    border-color var(--dur-fast) var(--ease-standard),
   174	    color var(--dur-fast) var(--ease-standard),
   175	    box-shadow var(--dur-fast) var(--ease-standard),
   176	    transform var(--dur-fast) var(--ease-standard);
   177	
   178	  &:focus-visible {
   179	    outline: 2px solid transparent;
   180	    outline-offset: 2px;
   181	    box-shadow: var(--ring-accent);
   182	  }
   183	
   184	  &:disabled,
   185	  &[aria-disabled="true"] {
   186	    opacity: 0.45;
   187	    cursor: not-allowed;
   188	    pointer-events: none;
   189	  }
   190	}
   191	
   192	.zbtn__inner {
   193	  display: inline-flex;
   194	  align-items: center;
   195	  justify-content: center;
   196	  gap: var(--space-2);
   197	  transition: transform var(--dur-fast) var(--ease-standard);
   198	  will-change: transform;
   199	}
   200	
   201	.zbtn__icon {
   202	  display: inline-flex;
   203	  width: 1.1em;
   204	  height: 1.1em;
   205	
   206	  :deep(svg) {
   207	    width: 100%;
   208	    height: 100%;
   209	  }
   210	}
   211	
   212	// ---- Tailles ----
   213	.zbtn--sm {
   214	  --_h: 32px;
   215	  --_px: var(--space-3);
   216	  --_fs: var(--fs-xs);
   217	}
   218	
   219	.zbtn--lg {
   220	  --_h: 48px;
   221	  --_px: var(--space-6);
   222	  --_fs: var(--fs-sm);
   223	}
   224	
   225	// ---- Variantes ----
   226	.zbtn--primary {
   227	  background: var(--accent);
   228	  color: var(--accent-text);
   229	  border-color: var(--accent);
   230	  box-shadow: var(--glow-accent);
   231	
   232	  &:hover {
   233	    background: var(--accent-hover);
   234	    border-color: var(--accent-hover);
   235	    box-shadow: 0 0 16px color-mix(in srgb, var(--accent) 45%, transparent);
   236	    transform: translateY(-1px);
   237	  }
   238	
   239	  &:active {
   240	    background: var(--accent-active);
   241	    border-color: var(--accent-active);
   242	    transform: translateY(0);
   243	  }
   244	}
   245	
   246	.zbtn--secondary {
   247	  background: color-mix(in srgb, var(--surface-2) 75%, transparent);
   248	  color: var(--text-strong);
   249	  border-color: var(--border-default);
   250	  backdrop-filter: blur(6px);
   251	
   252	  &:hover {
   253	    background: var(--surface-3);
   254	    border-color: var(--border-strong);
   255	    transform: translateY(-1px);
   256	  }
   257	
   258	  &:active {
   259	    transform: translateY(0);
   260	  }
   261	}
   262	
   263	.zbtn--ghost {
   264	  background: transparent;
   265	  color: var(--text-body);
   266	  border-color: transparent;
   267	
   268	  &:hover {
   269	    background: var(--surface-2);
   270	    color: var(--text-strong);
   271	    transform: translateY(-1px);
   272	  }
   273	}
   274	
   275	.zbtn--terminal {
   276	  background: var(--bg-terminal);
   277	  color: var(--term-green);
   278	  border-color: color-mix(in srgb, var(--term-green) 35%, var(--accent-2-soft));
   279	  box-shadow: 0 0 10px color-mix(in srgb, var(--term-green) 18%, transparent);
   280	
   281	  &:hover {
   282	    border-color: var(--term-green);
   283	    box-shadow:
   284	      0 0 18px color-mix(in srgb, var(--term-green) 45%, transparent),
   285	      var(--glow-terminal);
   286	    transform: translateY(-1px);
   287	  }
   288	}
   289	
   290	.zbtn--danger {
   291	  background: var(--danger);
   292	  color: var(--ink-on-accent);
   293	  border-color: var(--danger);
   294	
   295	  &:hover {
   296	    filter: brightness(1.08);
   297	  }
   298	
   299	  &:active {
   300	    transform: translateY(1px);
   301	  }
   302	}
   303	
   304	@media (prefers-reduced-motion: reduce) {
   305	  .zbtn,
   306	  .zbtn__inner {
   307	    transition: none;
   308	    transform: none !important;
   309	  }
   310	}
   311	</style>

 succeeded in 0ms:
     1	<template>
     2	  <main class="home">
     3	    <ClientOnly>
     4	      <HomeBootOverlay @boot-complete="onBootComplete" />
     5	    </ClientOnly>
     6	    <HomeAtmosComponent />
     7	    <ZCustomCursor />
     8	
     9	    <section class="hero">
    10	      <div class="hero__in container">
    11	        <div class="hero__grid">
    12	          <!-- Colonne gauche : accroche commerciale, badge dispo, CTAs -->
    13	          <div class="anim hero__text">
    14	            <p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>
    15	            <h1 class="hero__title">Développeur Full Stack <em>TypeScript</em></h1>
    16	            <p class="hero__sub">
    17	              Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De
    18	              l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.
    19	            </p>
    20	
    21	            <div class="hero__badge-wrap">
    22	              <span class="hero__pulse-dot" aria-hidden="true" />
    23	              <span>Disponible pour missions freelance</span>
    24	              <template v-if="SITE.profile.maltUrl">
    25	                <span aria-hidden="true"> · </span>
    26	                <ZExternalLink :href="SITE.profile.maltUrl"> Profil Malt vérifié </ZExternalLink>
    27	              </template>
    28	            </div>
    29	
    30	            <div class="hero__cta">
    31	              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
    32	                Discuter de votre projet
    33	                <template #iconRight><ZIcon name="arrow" /></template>
    34	              </ZButton>
    35	              <ZButton :as="NuxtLink" to="/about" variant="secondary" size="lg"> Voir le parcours &amp; CV </ZButton>
    36	            </div>
    37	          </div>
    38	
    39	          <!-- Colonne droite : terminal hero cinétique -->
    40	          <div class="anim hero__term-col">
    41	            <HomeHeroTerminal :auto-start="isBootFinished" />
    42	          </div>
    43	        </div>
    44	
    45	        <!-- Ruban défilant de la stack moderne remonté au sein du hero (fidèle à la maquette) -->
    46	        <HomeStackMarquee class="hero__marquee" />
    47	      </div>
    48	    </section>
    49	
    50	    <!-- Vitrine des 3 services cibles (Story 11.3 / AC-2) -->
    51	    <section class="section">
    52	      <div class="container">
    53	        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
    54	        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos applications</h2>
    55	        <ul class="grid-3">
    56	          <li v-for="service in services" :key="service.id">
    57	            <ZCard class="offer" interactive tilt :accent="service.featured" :featured="service.featured">
    58	              <div class="offer__top">
    59	                <div class="offer__icon"><ZIcon :name="service.icon" /></div>
    60	                <span class="offer__no">{{ service.no }}</span>
    61	              </div>
    62	              <h3 class="offer__title">{{ service.title }}</h3>
    63	              <p class="offer__desc">{{ service.desc }}</p>
    64	              <ul class="offer__points">
    65	                <li v-for="point in service.points" :key="point">
    66	                  <ZIcon name="check" class="offer__check" />
    67	                  <span>{{ point }}</span>
    68	                </li>
    69	              </ul>
    70	              <ul class="hero__tags offer__tags">
    71	                <li v-for="tag in service.tags" :key="tag">
    72	                  <ZTag>{{ tag }}</ZTag>
    73	                </li>
    74	              </ul>
    75	              <div class="offer__price">
    76	                <span>{{ service.price }}</span>
    77	              </div>
    78	              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
    79	                En savoir plus →
    80	              </NuxtLink>
    81	            </ZCard>
    82	          </li>
    83	        </ul>
    84	      </div>
    85	    </section>
    86	
    87	    <!-- Projets sélectionnés & Statistiques de réassurance (Story 11.4 / AC-1 & AC-2) -->
    88	    <section class="section">
    89	      <div class="container">
    90	        <div class="block__head">
    91	          <p class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</p>
    92	          <h2 class="section__title">Des produits qui tournent en production</h2>
    93	        </div>
    94	
    95	        <ul class="work">
    96	          <li v-for="(project, index) in projects" :key="project.name">
    97	            <component
    98	              :is="project.url ? ZExternalLink : 'div'"
    99	              :href="project.url"
   100	              class="work__row"
   101	              :class="{ 'work__row--link': Boolean(project.url) }"
   102	              :data-hot="project.url ? '' : undefined"
   103	            >
   104	              <span class="work__no">{{ String(index + 1).padStart(2, "0") }}</span>
   105	              <div class="work__main">
   106	                <div class="work__topline">
   107	                  <h3 class="work__name">{{ project.name }}</h3>
   108	                  <span v-if="project.status" class="work__status">{{ project.status }}</span>
   109	                </div>
   110	                <p class="work__role">{{ project.role }}</p>
   111	                <p class="prose work__desc">{{ project.desc }}</p>
   112	                <ul class="hero__tags work__tags">
   113	                  <li v-for="(tag, tagIndex) in project.tags" :key="`${tag}-${tagIndex}`">
   114	                    <ZTag>{{ tag }}</ZTag>
   115	                  </li>
   116	                </ul>
   117	              </div>
   118	              <span v-if="project.url" class="work__go" aria-hidden="true">
   119	                <ZIcon name="arrow" />
   120	              </span>
   121	            </component>
   122	          </li>
   123	        </ul>
   124	
   125	        <!-- Statistiques clés de réassurance (Story 11.4 / AC-2) -->
   126	        <ul class="stats">
   127	          <li v-for="stat in stats" :key="stat.id" class="stat">
   128	            <b>{{ stat.value }}</b>
   129	            <span>{{ stat.label }}</span>
   130	          </li>
   131	        </ul>
   132	      </div>
   133	    </section>
   134	
   135	    <!-- Journal technique / Notes de dev (Story 11.4 / AC-3) -->
   136	    <section class="section">
   137	      <div class="container">
   138	        <div class="block__head block__head--row">
   139	          <div>
   140	            <p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>
   141	            <h2 class="section__title">Notes de dev, écrites en construisant</h2>
   142	          </div>
   143	          <NuxtLink to="/blog" class="seeall" data-hot>
   144	            cat tous-les-articles
   145	            <ZIcon name="arrow" class="seeall__icon" />
   146	          </NuxtLink>
   147	        </div>
   148	
   149	        <!-- Liste des articles les plus récents -->
   150	        <ul v-if="articles && articles.length" class="journal">
   151	          <li v-for="article in articles" :key="article.path" class="journal__item">
   152	            <ZCard :as="NuxtLink" :to="article.path" :padded="false" interactive tilt class="jpost" data-hot>
   153	              <NuxtImg
   154	                v-if="article.image"
   155	                class="jpost__thumb"
   156	                :src="article.image.src"
   157	                :alt="article.image.alt"
   158	                width="360"
   159	                height="200"
   160	                sizes="360px"
   161	                format="webp"
   162	              />
   163	              <div class="jpost__body">
   164	                <ul v-if="article.tags?.length" class="hero__tags jpost__tags">
   165	                  <li v-for="(tag, tagIndex) in article.tags" :key="`${tag}-${tagIndex}`">
   166	                    <ZTag>{{ tag }}</ZTag>
   167	                  </li>
   168	                </ul>
   169	                <h3 class="jpost__title">{{ article.title }}</h3>
   170	                <p v-if="article.description" class="prose jpost__desc">{{ article.description }}</p>
   171	                <div class="jpost__meta">
   172	                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
   173	                  <template v-if="article.read">
   174	                    <span aria-hidden="true">·</span>
   175	                    <span>{{ article.read }} de lecture</span>
   176	                  </template>
   177	                  <span class="jpost__arrow" aria-hidden="true">
   178	                    <ZIcon name="arrow" />
   179	                  </span>
   180	                </div>
   181	              </div>
   182	            </ZCard>
   183	          </li>
   184	        </ul>
   185	
   186	        <!-- État d'attente sobre lorsque aucun article n'est encore publié -->
   187	        <ZCard v-else class="journal__empty" padded>
   188	          <p class="journal__empty-code">$ cat ~/journal/*.md</p>
   189	          <p class="journal__empty-text">Les notes d'ingénierie et retours d'expérience sont en cours de rédaction.</p>
   190	          <ZButton :as="NuxtLink" to="/blog" variant="secondary" size="sm"> Consulter la section blog </ZButton>
   191	        </ZCard>
   192	      </div>
   193	    </section>
   194	
   195	    <!-- Bloc CTA final de conversion (Story 11.4 / AC-4) -->
   196	    <section class="section">
   197	      <div class="container">
   198	        <div class="cta">
   199	          <p class="eyebrow cta__eyebrow"><span aria-hidden="true">$ </span>./contact --start</p>
   200	          <h2 class="cta__title">
   201	            Un projet en tête ?<br />
   202	            Mettons-le <span class="cta__highlight">en production</span>.
   203	          </h2>
   204	          <p class="cta__subtitle">
   205	            Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript,
   206	            parlons-en.
   207	          </p>
   208	          <div class="cta__actions">
   209	            <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg" data-hot>
   210	              Discuter de votre projet
   211	              <template #iconRight><ZIcon name="arrow" /></template>
   212	            </ZButton>
   213	            <ZButton
   214	              v-if="SITE.profile.maltUrl"
   215	              :as="ZExternalLink"
   216	              :href="SITE.profile.maltUrl"
   217	              variant="secondary"
   218	              size="lg"
   219	              data-hot
   220	            >
   221	              Me contacter sur Malt
   222	            </ZButton>
   223	            <ZButton :as="NuxtLink" to="/about" variant="ghost" size="lg" data-hot> Voir le parcours &amp; CV </ZButton>
   224	          </div>
   225	        </div>
   226	      </div>
   227	    </section>
   228	  </main>
   229	</template>
   230	
   231	<script setup lang="ts">
   232	// Page d'accueil — refonte Hero Full Stack TS, Projets SaaS, Journal & CTA final (Story 11.4).
   233	// Architecture multi-pages Nuxt 4, dark-first, accent orange.
   234	import { ref } from "vue";
   235	import { NuxtLink, ZExternalLink } from "#components";
   236	import { SITE } from "~/data/site";
   237	
   238	const isBootFinished = ref(false);
   239	
   240	function onBootComplete() {
   241	  isBootFinished.value = true;
   242	}
   243	
   244	interface HomeServiceOffer {
   245	  id: string;
   246	  no: string;
   247	  icon: "code" | "layers" | "spark";
   248	  title: string;
   249	  desc: string;
   250	  points: string[];
   251	  tags: string[];
   252	  price: string;
   253	  featured: boolean;
   254	}
   255	
   256	// Vitrine des 3 offres ciblées Full Stack TS (Story 11.3 / AC-2).
   257	const services: HomeServiceOffer[] = [
   258	  {
   259	    id: "creation",
   260	    no: "01 / 03",
   261	    icon: "code",
   262	    title: "Création d'applications web & SaaS",
   263	    desc: "De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.",
   264	    points: [
   265	      "Architecture logicielle & APIs REST",
   266	      "Applications Vue 3 / Nuxt 4 & NestJS",
   267	      "Intégration Stripe & PostgreSQL",
   268	    ],
   269	    tags: ["Nuxt", "NestJS", "PostgreSQL", "Stripe Connect"],
   270	    price: "Sur devis / au sprint",
   271	    featured: false,
   272	  },
   273	  {
   274	    id: "fullstack",
   275	    no: "02 / 03",
   276	    icon: "layers",
   277	    title: "Développement Full Stack TypeScript",
   278	    desc: "Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.",
   279	    points: [
   280	      "Composants Vue 3 / Nuxt avec TypeScript strict",
   281	      "Microservices & backend modulaire NestJS",
   282	      "Fiabilisation et optimisation des performances",
   283	    ],
   284	    tags: ["TypeScript", "Vue 3", "Nuxt", "NestJS", "Node.js"],
   285	    price: "Sur devis / TJM",
   286	    featured: true,
   287	  },
   288	  {
   289	    id: "evolution",
   290	    no: "03 / 03",
   291	    icon: "spark",
   292	    title: "Évolution & Architecture applicative",
   293	    desc: "Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).",
   294	    points: [
   295	      "Audits techniques de code & migrations de versions",
   296	      "Tests E2E TestCafé & tests unitaires Vitest",
   297	      "Pipelines CI/CD & conteneurisation Docker",
   298	    ],
   299	    tags: ["TestCafé", "Vitest", "Docker", "CI/CD"],
   300	    price: "Au forfait / audit",
   301	    featured: false,
   302	  },
   303	];
   304	
   305	// Projets sélectionnés — source unique `app/data/site.ts` (Story 11.4 / AC-1).
   306	const projects = SITE.projects;
   307	
   308	// Chiffres clés de réassurance (Story 11.4 / AC-2).
   309	const stats = [
   310	  { id: "stat-1", value: "11", label: "années d'expérience web" },
   311	  { id: "stat-2", value: "100%", label: "TypeScript & SaaS de bout en bout" },
   312	  { id: "stat-3", value: "QA", label: "culture d'automatisation & zéro régression" },
   313	];
   314	
   315	// Récupération des 3 derniers articles du journal technique (Story 11.4 / AC-3).
   316	const { data: articles } = await useAsyncData("home-articles", () =>
   317	  queryCollection("blog").order("date", "DESC").limit(3).all(),
   318	);
   319	
   320	const siteUrl = useSiteUrl();
   321	const homeJsonLd = [
   322	  {
   323	    "@context": "https://schema.org",
   324	    "@type": "WebSite",
   325	    name: "Simon Jouan — Développeur Full Stack TypeScript",
   326	    url: siteUrl,
   327	    description: SITE.profile.role,
   328	  },
   329	  {
   330	    "@context": "https://schema.org",
   331	    "@type": "Person",
   332	    name: SITE.profile.name,
   333	    jobTitle: SITE.profile.role,
   334	    url: siteUrl,
   335	    image: `${siteUrl}/images/portrait.jpeg`,
   336	    email: SITE.profile.email,
   337	    address: {
   338	      "@type": "PostalAddress",
   339	      addressLocality: SITE.profile.city,
   340	      addressCountry: "FR",
   341	    },
   342	  },
   343	];
   344	
   345	usePageSeo({
   346	  title: "Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS",
   347	  description:
   348	    "Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL.",
   349	  path: "/",
   350	  image: "/images/portrait.jpeg",
   351	  type: "website",
   352	  jsonLd: homeJsonLd,
   353	});
   354	</script>
   355	
   356	<style lang="scss" scoped>
   357	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Home.jsx */
   358	.home {
   359	  display: block;
   360	}
   361	
   362	// Entrée one-shot (pas une boucle) — keyframe globale fade-rise (_root.scss).
   363	.anim {
   364	  animation: fade-rise var(--dur-slow) var(--ease-out) both;
   365	}
   366	
   367	.hero__term-col {
   368	  // Décalage d'entrée fidèle à Home.jsx (animationDelay 80ms) — pas de token motion
   369	  // équivalent (les --dur-* couvrent les transitions, pas les délais d'orchestration).
   370	  animation-delay: 80ms;
   371	}
   372	
   373	// ---- Hero (porté de kit.css & Home - Awwwards.html) ----
   374	.hero {
   375	  position: relative;
   376	  min-height: 100vh;
   377	  display: flex;
   378	  align-items: center;
   379	  padding: calc(var(--header-height) + var(--space-6)) 0 var(--space-10);
   380	  background: transparent;
   381	}
   382	
   383	.hero__in {
   384	  position: relative;
   385	  z-index: 1;
   386	  width: 100%;
   387	}
   388	
   389	.hero__grid {
   390	  display: grid;
   391	  grid-template-columns: 1.1fr 0.9fr;
   392	  gap: var(--space-12);
   393	  align-items: center;
   394	}
   395	
   396	.hero__marquee {
   397	  margin-top: var(--space-10);
   398	}
   399	
   400	// .section / .container / .eyebrow / .prose : primitives de layout globales
   401	// (app/assets/scss/base/_layout.scss) — non redéclarées ici.
   402	
   403	// ---- Colonne texte ----
   404	.hero__title {
   405	  margin: 0;
   406	  font-family: var(--font-mono);
   407	  font-size: clamp(2.4rem, 5.2vw, 4.4rem);
   408	  font-weight: var(--fw-regular);
   409	  line-height: 1.05;
   410	  letter-spacing: var(--ls-tight);
   411	  color: var(--text-strong);
   412	
   413	  em {
   414	    font-style: italic;
   415	    color: var(--accent);
   416	  }
   417	}
   418	
   419	.hero__sub {
   420	  max-width: 46ch;
   421	  margin: var(--space-5) 0 var(--space-6);
   422	  font-family: var(--font-sans);
   423	  font-size: var(--fs-lg);
   424	  line-height: var(--lh-relaxed);
   425	  color: var(--text-body);
   426	}
   427	
   428	.hero__cta {
   429	  display: flex;
   430	  flex-wrap: wrap;
   431	  gap: var(--space-3);
   432	  margin-bottom: var(--space-6);
   433	}
   434	
   435	// ---- Badge de disponibilité & CTAs ----
   436	.hero__badge-wrap {
   437	  display: inline-flex;
   438	  align-items: center;
   439	  gap: var(--space-2);
   440	  margin-bottom: var(--space-6);
   441	  font-family: var(--font-mono);
   442	  font-size: var(--fs-sm);
   443	  color: var(--text-muted);
   444	
   445	  a {
   446	    color: var(--accent);
   447	    text-decoration: underline;
   448	
   449	    &:hover {
   450	      color: var(--accent-hover);
   451	    }
   452	
   453	    &:focus-visible {
   454	      outline: 2px solid transparent;
   455	      outline-offset: 2px;
   456	      box-shadow: var(--ring-accent);
   457	    }
   458	  }
   459	}
   460	
   461	.hero__pulse-dot {
   462	  width: 8px;
   463	  height: 8px;
   464	  border-radius: var(--radius-circle);
   465	  background: var(--success);
   466	  box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 60%, transparent);
   467	  animation: pulse-dot 2.2s infinite var(--ease-out);
   468	
   469	  @media (prefers-reduced-motion: reduce) {
   470	    animation: none;
   471	  }
   472	}
   473	
   474	@keyframes pulse-dot {
   475	  0% {
   476	    box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 60%, transparent);
   477	  }
   478	
   479	  70% {
   480	    box-shadow: 0 0 0 6px color-mix(in srgb, var(--success) 0%, transparent);
   481	  }
   482	
   483	  100% {
   484	    box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 0%, transparent);
   485	  }
   486	}
   487	
   488	.section__title {
   489	  margin-bottom: var(--space-8);
   490	  font-family: var(--font-mono);
   491	  font-size: var(--fs-3xl);
   492	  font-weight: var(--fw-regular);
   493	  color: var(--text-strong);
   494	}
   495	
   496	// ---- Aperçu services (porté de .grid-3 / .offer*) ----
   497	.grid-3 {
   498	  display: grid;
   499	  grid-template-columns: repeat(3, 1fr);
   500	  gap: var(--space-5);
   501	  margin: 0;
   502	  padding: 0;
   503	  list-style: none;
   504	
   505	  > li {
   506	    display: flex;
   507	  }
   508	}
   509	
   510	.offer {
   511	  display: flex;
   512	  flex-direction: column;
   513	  width: 100%;
   514	}
   515	
   516	.offer__top {
   517	  display: flex;
   518	  align-items: center;
   519	  justify-content: space-between;
   520	  margin-bottom: var(--space-4);
   521	}
   522	
   523	.offer__icon {
   524	  display: flex;
   525	  align-items: center;
   526	  justify-content: center;
   527	  width: var(--space-10); // 40px
   528	  height: var(--space-10);
   529	
   530	  // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
   531	  // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
   532	  font-size: 22px;
   533	  color: var(--accent);
   534	  background: var(--accent-soft);
   535	  border-radius: var(--radius-md);
   536	}
   537	
   538	.offer__no {
   539	  font-family: var(--font-mono);
   540	  font-size: var(--fs-xs);
   730	}
   731	
   732	.work__desc {
   733	  max-width: 65ch;
   734	  margin: var(--space-3) 0 0;
   735	  font-size: var(--fs-sm);
   736	}
   737	
   738	.work__tags {
   739	  margin-top: var(--space-4);
   740	}
   741	
   742	.work__go {
   743	  position: relative;
   744	  font-size: var(--fs-xl);
   745	  color: var(--text-faint);
   746	  transition:
   747	    transform var(--dur-base) var(--ease-out),
   748	    color var(--dur-base) var(--ease-standard);
   749	}
   750	
   751	// ---- Stats (porté de .stats) ----
   752	.stats {
   753	  display: grid;
   754	  grid-template-columns: repeat(3, 1fr);
   755	  gap: var(--space-4);
   756	  margin: var(--space-12) 0 0;
   757	  padding: 0;
   758	  list-style: none;
   759	}
   760	
   761	.stat {
   762	  padding: var(--space-6);
   763	  background: color-mix(in srgb, var(--surface-1) 85%, transparent);
   764	  border: 1px solid var(--border-subtle);
   765	  border-radius: var(--radius-md);
   766	  box-shadow: var(--shadow-2);
   767	  backdrop-filter: blur(8px);
   768	  transition:
   769	    border-color var(--dur-fast) var(--ease-standard),
   770	    transform var(--dur-fast) var(--ease-standard);
   771	
   772	  &:hover {
   773	    border-color: var(--border-strong);
   774	    transform: translateY(-2px);
   775	  }
   776	
   777	  b {
   778	    display: block;
   779	    margin-bottom: var(--space-2);
   780	    font-family: var(--font-mono);
   781	    font-size: clamp(var(--fs-4xl), 4.5vw, var(--fs-5xl));
   782	    font-weight: var(--fw-bold);
   783	    line-height: 1;
   784	    letter-spacing: var(--ls-tight);
   785	    color: var(--text-strong);
   786	  }
   787	
   788	  span {
   789	    font-family: var(--font-mono);
   790	    font-size: var(--fs-sm);
   791	    letter-spacing: var(--ls-wide);
   792	    color: var(--text-muted);
   793	  }
   794	}
   795	
   796	// ---- Section Journal (porté de Home - Awwwards.html .journal) ----
   797	.block__head--row {
   798	  display: flex;
   799	  align-items: flex-end;
   800	  justify-content: space-between;
   801	  gap: var(--space-6);
   802	  margin-bottom: var(--space-8);
   803	
   804	  .section__title {
   805	    margin-bottom: 0;
   806	  }
   807	}
   808	
   809	.seeall {
   810	  display: inline-flex;
   811	  flex: none;
   812	  align-items: center;
   813	  gap: var(--space-2);
   814	  font-family: var(--font-mono);
   815	  font-size: var(--fs-sm);
   816	  color: var(--text-muted);
   817	  text-decoration: none;
   818	  white-space: nowrap;
   819	  transition: color var(--dur-base) var(--ease-standard);
   820	
   821	  &:hover {
   822	    color: var(--accent);
   823	  }
   824	
   825	  &:focus-visible {
   826	    outline: 2px solid transparent;
   827	    outline-offset: 2px;
   828	    box-shadow: var(--ring-accent);
   829	    border-radius: var(--radius-xs);
   830	  }
   831	}
   832	
   833	.seeall__icon {
   834	  font-size: var(--fs-base);
   835	}
   836	
   837	.journal {
   838	  display: grid;
   839	  grid-template-columns: repeat(3, 1fr);
   840	  gap: var(--space-5);
   841	  margin: 0;
   842	  padding: 0;
   843	  list-style: none;
   844	
   845	  > li {
   846	    display: flex;
   847	  }
   848	}
   849	
   850	.jpost {
   851	  display: flex;
   852	  flex-direction: column;
   853	  width: 100%;
   854	  color: inherit;
   855	  text-decoration: none;
   856	
   857	  &:hover {
   858	    .jpost__title {
   859	      color: var(--accent);
   860	    }
   861	
   862	    .jpost__arrow {
   863	      color: var(--accent);
   864	      transform: translate(4px, -4px);
   865	    }
   866	  }
   867	}
   868	
   869	.jpost__thumb {
   870	  width: 100%;
   871	  height: 10rem;
   872	  object-fit: cover;
   873	  border-bottom: 1px solid var(--border-subtle);
   874	}
   875	
   876	.jpost__body {
   877	  display: flex;
   878	  flex: 1;
   879	  flex-direction: column;
   880	  padding: var(--space-5);
   881	}
   882	
   883	.jpost__tags {
   884	  margin-bottom: var(--space-3);
   885	}
   886	
   887	.jpost__title {
   888	  margin: 0 0 var(--space-2);
   889	  font-family: var(--font-mono);
   890	  font-size: var(--fs-lg);
   891	  font-weight: var(--fw-regular);
   892	  line-height: var(--lh-snug);
   893	  color: var(--text-strong);
   894	  transition: color var(--dur-base) var(--ease-standard);
   895	}
   896	
   897	.jpost__desc {
   898	  margin: 0 0 var(--space-4);
   899	  font-size: var(--fs-sm);
   900	  color: var(--text-muted);
   901	}
   902	
   903	.jpost__meta {
   904	  display: flex;
   905	  align-items: center;
   906	  gap: var(--space-2);
   907	  margin-top: auto;
   908	  padding-top: var(--space-4);
   909	  border-top: 1px dashed var(--border-subtle);
   910	  font-family: var(--font-mono);
   911	  font-size: var(--fs-xs);
   912	  color: var(--text-faint);
   913	}
   914	
   915	.jpost__arrow {
   916	  margin-left: auto;
   917	  font-size: var(--fs-base);
   918	  color: var(--text-faint);
   919	  transition:
   920	    transform var(--dur-base) var(--ease-out),
   921	    color var(--dur-base) var(--ease-standard);
   922	}
   923	
   924	.journal__empty {
   925	  max-width: 60ch;
   926	  margin: 0 auto;
   927	  text-align: center;
   928	}
   929	
   930	.journal__empty-code {
   931	  margin: 0 0 var(--space-2);
   932	  font-family: var(--font-mono);
   933	  font-size: var(--fs-sm);
   934	  color: var(--accent);
   935	}
   936	
   937	.journal__empty-text {
   938	  margin: 0 0 var(--space-5);
   939	  font-family: var(--font-sans);
   940	  font-size: var(--fs-sm);
   941	  line-height: var(--lh-relaxed);
   942	  color: var(--text-muted);
   943	}
   944	
   945	// ---- Bloc CTA final (porté de .cta) ----
   946	.cta {
   947	  position: relative;
   948	  padding: clamp(48px, 7vw, 84px) var(--space-6);
   949	  overflow: hidden;
   950	  text-align: center;
   951	  background:
   952	    radial-gradient(ellipse 80% 120% at 50% 0%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%),
   953	    color-mix(in srgb, var(--surface-1) 85%, transparent);
   954	  border: 1px solid var(--border-subtle);
   955	  border-radius: var(--radius-lg);
   956	  backdrop-filter: blur(10px);
   957	  box-shadow: var(--shadow-3), var(--shadow-hairline);
   958	}
   959	
   960	.cta__eyebrow {
   961	  display: inline-block;
   962	  margin-bottom: var(--space-4);
   963	}
   964	
   965	.cta__title {
   966	  margin: 0 0 var(--space-4);
   967	  font-family: var(--font-mono);
   968	  font-size: clamp(2rem, 4.5vw, 3.2rem);
   969	  font-weight: var(--fw-regular);
   970	  line-height: 1.08;
   971	  letter-spacing: var(--ls-tight);
   972	  color: var(--text-strong);
   973	}
   974	
   975	.cta__highlight {
   976	  font-style: italic;
   977	  color: var(--accent);
   978	}
   979	
   980	.cta__subtitle {
   981	  max-width: 58ch;
   982	  margin: 0 auto var(--space-8);
   983	  font-family: var(--font-sans);
   984	  font-size: var(--fs-lg);
   985	  line-height: var(--lh-relaxed);
   986	  color: var(--text-muted);
   987	}
   988	
   989	.cta__actions {
   990	  display: flex;
   991	  flex-wrap: wrap;
   992	  gap: var(--space-4);
   993	  justify-content: center;
   994	  align-items: center;
   995	}
   996	
   997	// ---- Responsive ----
   998	@media (width <= 900px) {
   999	  .hero__grid {
  1000	    grid-template-columns: 1fr;
  1001	  }
  1002	
  1003	  .hero__title {
  1004	    font-size: var(--fs-4xl);
  1005	  }
  1006	
  1007	  .grid-3,
  1008	  .journal {
  1009	    grid-template-columns: 1fr;
  1010	  }
  1011	
  1012	  .block__head--row {
  1013	    flex-direction: column;
  1014	    align-items: flex-start;
  1015	  }
  1016	}
  1017	
  1018	@media (width <= 680px) {
  1019	  .work__row {
  1020	    grid-template-columns: 1fr;
  1021	    gap: var(--space-3);
  1022	  }
  1023	
  1024	  .work__no,
  1025	  .work__go {
  1026	    display: none;
  1027	  }
  1028	
  1029	  .stats {
  1030	    grid-template-columns: 1fr;
  1031	  }
  1032	}
  1033	
  1034	@media (prefers-reduced-motion: reduce) {
  1035	  .anim {
  1036	    animation: none;
  1037	  }
  1038	
  1039	  .work__row,
  1040	  .work__go,
  1041	  .jpost__arrow,
  1042	  .seeall {
  1043	    transition: none;
  1044	  }
  1045	
  1046	  .work__row--link:hover {
  1047	    padding-left: var(--space-3);
  1048	
  1049	    .work__go {
  1050	      transform: none;
  1051	    }
  1052	  }
  1053	
  1054	  .jpost:hover {
  1055	    .jpost__arrow {
  1056	      transform: none;
  1057	    }
  1058	  }
  1059	}
  1060	</style>

exec
/bin/zsh -lc "nl -ba app/components/ui/ZCard.vue | sed -n '1,230p'; nl -ba app/components/CurrentTime.vue | sed -n '1,130p'; nl -ba app/components/FooterComponent.vue | sed -n '1,260p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	<template>
     2	  <component
     3	    :is="as"
     4	    ref="cardRef"
     5	    v-bind="rootAttrs"
     6	    class="zcard"
     7	    :class="{
     8	      'zcard--pad': padded,
     9	      'zcard--interactive': interactive,
    10	      'zcard--accent': accent,
    11	      'zcard--featured': featured,
    12	      'zcard--tilt': tilt,
    13	    }"
    14	    @mousemove="onMouseMove"
    15	    @mouseleave="onMouseLeave"
    16	  >
    17	    <slot />
    18	  </component>
    19	</template>
    20	
    21	<script setup lang="ts">
    22	// Primitive carte du DS — surface discrète, 3D tilt interactif optionnel.
    23	// Porté de docs/design_system/components/core/Card.jsx et Home - Awwwards.html.
    24	import type { Component, ComponentPublicInstance } from "vue";
    25	import { computed, onMounted, ref, useAttrs } from "vue";
    26	
    27	defineOptions({
    28	  inheritAttrs: false,
    29	});
    30	
    31	interface Props {
    32	  /** Hover lift + bordure plus claire. @default false */
    33	  interactive?: boolean;
    34	  /** Barre d'accent orange→aubergine en haut. @default false */
    35	  accent?: boolean;
    36	  /** Anneau de glow orange (offre mise en avant). @default false */
    37	  featured?: boolean;
    38	  /** Padding interne `--space-6`. @default true */
    39	  padded?: boolean;
    40	  /** Élément rendu (polymorphe). @default "div" */
    41	  as?: string | Component;
    42	  /** Activer l'effet 3D tilt sur mousemove. @default false */
    43	  tilt?: boolean;
    44	}
    45	
    46	const props = withDefaults(defineProps<Props>(), {
    47	  interactive: false,
    48	  accent: false,
    49	  featured: false,
    50	  padded: true,
    51	  as: "div",
    52	  tilt: false,
    53	});
    54	
    55	const attrs = useAttrs();
    56	const cardRef = ref<Element | ComponentPublicInstance | null>(null);
    57	const isReducedMotion = ref(false);
    58	
    59	onMounted(() => {
    60	  isReducedMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    61	});
    62	
    63	function onMouseMove(event: MouseEvent) {
    64	  if (!props.tilt || isReducedMotion.value || !cardRef.value) {
    65	    return;
    66	  }
    67	  const el = ((cardRef.value as ComponentPublicInstance).$el ?? cardRef.value) as HTMLElement | null;
    68	  if (!el || !(el instanceof HTMLElement)) {
    69	    return;
    70	  }
    71	  const rect = el.getBoundingClientRect();
    72	  const px = (event.clientX - rect.left) / rect.width - 0.5;
    73	  const py = (event.clientY - rect.top) / rect.height - 0.5;
    74	  el.style.transform = `perspective(800px) rotateX(${-py * 6}deg) rotateY(${px * 8}deg) translateY(-4px)`;
    75	}
    76	
    77	function onMouseLeave() {
    78	  if (!props.tilt || !cardRef.value) {
    79	    return;
    80	  }
    81	  const el = ((cardRef.value as ComponentPublicInstance).$el ?? cardRef.value) as HTMLElement | null;
    82	  if (el instanceof HTMLElement) {
    83	    el.style.transform = "";
    84	  }
    85	}
    86	
    87	// `as` accepte une balise native ("div", "article") ou une référence de composant
    88	// (ex. NuxtLink importé de "#components") ; ne pas passer un nom de composant en chaîne.
    89	const isNativeButton = computed(() => props.as === "button");
    90	const rootAttrs = computed(() => {
    91	  if (!isNativeButton.value) {
    92	    return attrs;
    93	  }
    94	
    95	  return {
    96	    ...attrs,
    97	    type: typeof attrs.type === "string" ? attrs.type : "button",
    98	  };
    99	});
   100	</script>
   101	
   102	<style lang="scss" scoped>
   103	/* stylelint-disable selector-class-pattern -- convention DS BEM (block--modifier) portée depuis Card.jsx */
   104	.zcard {
   105	  position: relative;
   106	  overflow: hidden;
   107	  background: var(--bg-card);
   108	  color: var(--text-body);
   109	  border: 1px solid var(--border-subtle);
   110	  border-radius: var(--radius-md);
   111	  box-shadow: var(--shadow-2), var(--shadow-hairline);
   112	  transition:
   113	    border-color var(--dur-base) var(--ease-standard),
   114	    transform var(--dur-base) var(--ease-out),
   115	    box-shadow var(--dur-base) var(--ease-standard);
   116	}
   117	
   118	.zcard--tilt {
   119	  transform-style: preserve-3d;
   120	  will-change: transform;
   121	}
   122	
   123	.zcard--pad {
   124	  padding: var(--space-6);
   125	}
   126	
   127	.zcard--interactive {
   128	  cursor: pointer;
   129	
   130	  &:hover {
   131	    border-color: var(--border-strong);
   132	    transform: translateY(-2px);
   133	    box-shadow: var(--shadow-3), var(--shadow-hairline);
   134	  }
   135	
   136	  &:focus-visible {
   137	    outline: 2px solid transparent;
   138	    outline-offset: 2px;
   139	    box-shadow: var(--ring-accent);
   140	  }
   141	}
   142	
   143	.zcard--accent::before {
   144	  content: "";
   145	  position: absolute;
   146	  inset: 0 0 auto;
   147	  height: 2px;
   148	  background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
   149	}
   150	
   151	.zcard--featured {
   152	  border-color: var(--accent-ring);
   153	  box-shadow: var(--glow-accent), var(--shadow-hairline);
   154	}
   155	
   156	@media (prefers-reduced-motion: reduce) {
   157	  .zcard {
   158	    transition: none;
   159	    transform: none !important;
   160	  }
   161	
   162	  .zcard--interactive:hover {
   163	    transform: none;
   164	  }
   165	}
   166	</style>
     1	<template>
     2	  <time class="current-time" :datetime="currentTimeIso" aria-label="Heure locale de Valognes">
     3	    <span class="current-time__hours">{{ hours }}</span>
     4	    <span class="current-time__colon" :class="{ 'current-time__colon--hidden': !isColonVisible }" aria-hidden="true"
     5	      >:</span
     6	    >
     7	    <span class="current-time__minutes">{{ minutes }}</span>
     8	  </time>
     9	</template>
    10	
    11	<script lang="ts" setup>
    12	import type { Ref } from "vue";
    13	import { onMounted, onUnmounted, ref } from "vue";
    14	
    15	defineComponent({
    16	  name: "CurrentTime",
    17	});
    18	
    19	const hours = ref("--");
    20	const minutes = ref("--");
    21	const currentTimeIso = ref("");
    22	const isColonVisible = ref(true);
    23	
    24	function updateTime() {
    25	  const now = new Date();
    26	  const parts = new Intl.DateTimeFormat("en-GB", {
    27	    hour: "2-digit",
    28	    minute: "2-digit",
    29	    hour12: false,
    30	    timeZone: "Europe/Paris",
    31	  }).formatToParts(now);
    32	
    33	  const hourPart = parts.find((p) => p.type === "hour")?.value ?? "";
    34	  const minutePart = parts.find((p) => p.type === "minute")?.value ?? "";
    35	
    36	  hours.value = hourPart.padStart(2, "0");
    37	  minutes.value = minutePart.padStart(2, "0");
    38	  currentTimeIso.value = now.toISOString();
    39	
    40	  // Un clignotement exact par seconde (alternance à chaque seconde système)
    41	  isColonVisible.value = now.getSeconds() % 2 === 0;
    42	}
    43	
    44	const interval: Ref<ReturnType<typeof setInterval> | null> = ref(null);
    45	
    46	onMounted(() => {
    47	  updateTime();
    48	  interval.value = setInterval(updateTime, 1000);
    49	});
    50	
    51	onUnmounted(() => {
    52	  if (interval.value !== null) {
    53	    clearInterval(interval.value);
    54	  }
    55	});
    56	</script>
    57	
    58	<style scoped lang="scss">
    59	/* stylelint-disable selector-class-pattern -- convention BEM */
    60	.current-time {
    61	  display: inline-flex;
    62	  align-items: center;
    63	  font-family: var(--font-mono);
    64	  font-size: var(--fs-xs);
    65	  font-variant-numeric: tabular-nums;
    66	  letter-spacing: var(--ls-wide);
    67	  color: var(--text-muted);
    68	}
    69	
    70	.current-time__colon {
    71	  display: inline-block;
    72	  margin: 0 1px;
    73	  transition: opacity 0.1s linear;
    74	
    75	  &--hidden {
    76	    opacity: 0;
    77	  }
    78	}
    79	
    80	@media (prefers-reduced-motion: reduce) {
    81	  .current-time__colon,
    82	  .current-time__colon--hidden {
    83	    opacity: 1;
    84	    transition: none;
    85	  }
    86	}
    87	</style>
     1	<template>
     2	  <footer class="ftr">
     3	    <div class="ftr__container">
     4	      <div class="ftr__in">
     5	        <div class="ftr__brand-col">
     6	          <NuxtLink to="/" class="ftr__brand">
     7	            <img src="/images/logo_white.png" alt="" class="ftr__logo" width="22" height="22" />
     8	            <span><b>jouan</b><span class="dim">.ovh</span></span>
     9	          </NuxtLink>
    10	          <p class="ftr__tagline">{{ profile.role }}. {{ profile.city }}.</p>
    11	        </div>
    12	
    13	        <nav class="ftr__col" aria-label="Navigation du pied de page">
    14	          <h2 class="ftr__title">// Navigation</h2>
    15	          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="ftr__link">{{ item.label }}</NuxtLink>
    16	        </nav>
    17	
    18	        <div class="ftr__col">
    19	          <h2 class="ftr__title">// Projets</h2>
    20	          <ul class="ftr__list">
    21	            <li v-for="project in projects" :key="project.name">
    22	              <ZExternalLink v-if="project.url" :href="project.url" rel="noopener noreferrer" class="ftr__link">{{
    23	                project.name
    24	              }}</ZExternalLink>
    25	              <span v-else class="ftr__link ftr__link--static">{{ project.name }}</span>
    26	            </li>
    27	          </ul>
    28	        </div>
    29	
    30	        <div class="ftr__col">
    31	          <h2 class="ftr__title">// Réseaux</h2>
    32	          <LinkListComponent />
    33	        </div>
    34	      </div>
    35	    </div>
    36	
    37	    <!-- Barre basse pleine largeur (border-top 100% de la fenêtre) -->
    38	    <div class="ftr__bottom-bar">
    39	      <div class="ftr__container ftr__bottom">
    40	        <span>© {{ year }} Simon Jouan — jouan.ovh</span>
    41	        <span class="ftr__term">anon.@jouan.ovh:~$ <span class="ftr__cmd">echo "merci de votre visite"</span></span>
    42	      </div>
    43	    </div>
    44	  </footer>
    45	</template>
    46	
    47	<script setup lang="ts">
    48	import LinkListComponent from "~/components/LinkListComponent.vue";
    49	import { SITE } from "~/data/site";
    50	
    51	const navItems = [
    52	  { to: "/", label: "Accueil" },
    53	  { to: "/services", label: "Services" },
    54	  { to: "/about", label: "À propos" },
    55	  { to: "/blog", label: "Blog" },
    56	  { to: "/contact", label: "Contact" },
    57	  { to: "/confidentialite", label: "Confidentialité" },
    58	  { to: "/mentions-legales", label: "Mentions légales" },
    59	];
    60	
    61	const profile = SITE.profile;
    62	// Projets — source unique `app/data/site.ts` (le footer n'affiche que nom + URL).
    63	const projects = SITE.projects;
    64	
    65	const year = new Date().getFullYear();
    66	</script>
    67	
    68	<style lang="scss" scoped>
    69	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis Footer.jsx/kit.css */
    70	.ftr {
    71	  position: relative;
    72	  z-index: 10;
    73	  margin-top: auto;
    74	  background: var(--surface-1);
    75	  border-top: 1px solid var(--border-subtle);
    76	  padding: var(--space-12) 0 0;
    77	}
    78	
    79	.ftr__container {
    80	  width: 100%;
    81	  max-width: var(--container-xl);
    82	  margin: 0 auto;
    83	  padding: 0 var(--space-6);
    84	}
    85	
    86	.ftr__in {
    87	  display: flex;
    88	  flex-wrap: wrap;
    89	  gap: var(--space-8);
    90	  align-items: flex-start;
    91	  justify-content: space-between;
    92	}
    93	
    94	.ftr__brand-col {
    95	  max-width: 300px;
    96	}
    97	
    98	.ftr__brand {
    99	  display: inline-flex;
   100	  align-items: center;
   101	  gap: var(--space-3);
   102	  margin-bottom: var(--space-3);
   103	  text-decoration: none;
   104	
   105	  .ftr__logo {
   106	    display: block;
   107	    width: 22px;
   108	    height: 22px;
   109	    object-fit: contain;
   110	    filter: drop-shadow(0 2px 4px color-mix(in srgb, var(--surface-0) 60%, transparent));
   111	  }
   112	
   113	  b {
   114	    font-family: var(--font-mono);
   115	    font-size: var(--fs-md);
   116	    font-weight: var(--fw-bold);
   117	    color: var(--text-strong);
   118	  }
   119	
   120	  .dim {
   121	    color: var(--text-muted);
   122	  }
   123	
   124	  // Lien focusable (logo + nom) : anneau DS cohérent avec le reste du châssis.
   125	  &:focus-visible {
   126	    outline: 2px solid transparent; // forced-colors : rendu en couleur système
   127	    outline-offset: 2px;
   128	    border-radius: var(--radius-sm);
   129	    box-shadow: var(--ring-accent);
   130	  }
   131	}
   132	
   133	.ftr__tagline {
   134	  margin: 0;
   135	  font-size: var(--fs-sm);
   136	  color: var(--text-body);
   137	}
   138	
   139	.ftr__col {
   140	  display: flex;
   141	  flex-direction: column;
   142	}
   143	
   144	.ftr__title {
   145	  margin: 0 0 var(--space-3);
   146	  font-family: var(--font-mono);
   147	  font-size: var(--fs-xs);
   148	  font-weight: var(--fw-medium);
   149	  letter-spacing: var(--ls-wider);
   150	  text-transform: uppercase;
   151	  color: var(--accent);
   152	}
   153	
   154	.ftr__list {
   155	  display: flex;
   156	  flex-direction: column;
   157	  padding: 0;
   158	  margin: 0;
   159	  list-style: none;
   160	}
   161	
   162	.ftr__link {
   163	  display: block;
   164	  padding: var(--space-1) 0;
   165	  font-family: var(--font-mono);
   166	  font-size: var(--fs-sm);
   167	  color: var(--text-strong);
   168	  text-decoration: none;
   169	  transition:
   170	    color var(--dur-fast) var(--ease-standard),
   171	    transform var(--dur-fast) var(--ease-standard);
   172	
   173	  &:hover {
   174	    color: var(--accent);
   175	    transform: translateX(2px);
   176	  }
   177	
   178	  // Anneau de focus DS (les liens du footer n'avaient que l'outline UA par défaut).
   179	  &:focus-visible {
   180	    outline: 2px solid transparent; // forced-colors : rendu en couleur système
   181	    outline-offset: 2px;
   182	    border-radius: var(--radius-xs);
   183	    box-shadow: var(--ring-accent);
   184	  }
   185	
   186	  &--static {
   187	    color: var(--text-body);
   188	    cursor: default;
   189	
   190	    &:hover {
   191	      color: var(--text-body);
   192	      transform: none;
   193	    }
   194	  }
   195	}
   196	
   197	.ftr__bottom-bar {
   198	  width: 100%;
   199	  margin-top: var(--space-8);
   200	  border-top: 1px solid var(--border-default);
   201	}
   202	
   203	.ftr__bottom {
   204	  display: flex;
   205	  flex-wrap: wrap;
   206	  gap: var(--space-3);
   207	  justify-content: space-between;
   208	  align-items: center;
   209	  padding-block: var(--space-5);
   210	  font-family: var(--font-mono);
   211	  font-size: var(--fs-xs);
   212	  color: var(--text-body);
   213	}
   214	
   215	.ftr__cmd {
   216	  color: var(--term-green);
   217	  font-weight: var(--fw-medium);
   218	}
   219	
   220	@media (prefers-reduced-motion: reduce) {
   221	  .ftr__link {
   222	    transition: none;
   223	    transform: none !important;
   224	  }
   225	}
   226	</style>

exec
/bin/zsh -lc "nl -ba app/layouts/default.vue | sed -n '1,180p'; nl -ba app/assets/scss/base/_layout.scss | sed -n '1,130p'; nl -ba app/assets/scss/abstract/_root.scss | sed -n '1,260p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	<template>
     2	  <div class="init">
     3	    <HeaderComponent />
     4	
     5	    <slot />
     6	
     7	    <FooterComponent />
     8	  </div>
     9	</template>
    10	
    11	<script setup lang="ts">
    12	import FooterComponent from "../components/FooterComponent.vue";
    13	import HeaderComponent from "../components/HeaderComponent.vue";
    14	</script>
    15	
    16	<style lang="scss" scoped>
    17	.init {
    18	  // Fond de page dark-first (token). Remplace l'ancien dégradé legacy
    19	  // orange/aubergine (anciens tokens SCSS `_color.$`) qui débordait derrière
    20	  // les sections transparentes (révélé par la story 3.2). Le hero porte son
    21	  // propre `hero__grad`, le footer son `--bg-sunken` — inchangés.
    22	  background: var(--bg-page);
    23	
    24	  // Flex column : header sticky en haut, footer riche poussé en bas via
    25	  // `margin-top: auto` (le footer dépasse 56px — l'ancienne grille à hauteur
    26	  // fixe le tronquait). --header-height/--footer-height viennent des tokens (2.1).
    27	  display: flex;
    28	  flex-direction: column;
    29	  margin: 0;
    30	  min-height: 100vh;
    31	  width: 100%;
    32	  max-width: 100vw;
    33	}
    34	</style>
     1	// ============================================================
     2	//  Primitives de layout du design system — GLOBALES
     3	//
     4	//  .section / .section--sunken / .container / .eyebrow / .prose
     5	//  Portées de docs/design_system/ui_kits/jouan-site/kit.css.
     6	//  Mutualisées ici (chargées par main.scss) plutôt que redéclarées
     7	//  à l'identique en <style scoped> dans chaque page (index, services,
     8	//  about, …). Tokens uniquement — aucune valeur en dur (CAP-2).
     9	// ============================================================
    10	
    11	/* stylelint-disable selector-class-pattern -- convention DS BEM (.section--sunken) portée depuis kit.css */
    12	
    13	// Bloc de section vertical. padding-block uniquement : le gutter
    14	// horizontal vient de .container (enfant) — évite le conflit de
    15	// shorthand padding multi-axes (cf. project-context, piège story 3.1).
    16	.section {
    17	  padding-block: var(--space-16);
    18	}
    19	
    20	// Section en creux : fond teinté + filets haut/bas.
    21	.section--sunken {
    22	  background: var(--bg-sunken);
    23	  border-top: 1px solid var(--border-subtle);
    24	  border-bottom: 1px solid var(--border-subtle);
    25	}
    26	
    27	// Conteneur centré à largeur max ; gutter horizontal en longhand.
    28	.container {
    29	  width: 100%;
    30	  max-width: var(--container-xl);
    31	  margin: 0 auto;
    32	  padding-inline: var(--space-6);
    33	}
    34	
    35	// Sur-titre mono en capitales espacées, accent orange.
    36	// font-weight et line-height neutralisés pour un rendu identique sur <h2 class="eyebrow"> et <p class="eyebrow">.
    37	.eyebrow {
    38	  margin: 0 0 var(--space-3);
    39	  font-family: var(--font-mono);
    40	  font-size: var(--fs-xs);
    41	  font-weight: var(--fw-regular);
    42	  line-height: var(--lh-relaxed);
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
    76	  align-items: center;
    77	  font-family: var(--font-mono);
    78	  font-size: var(--fs-xs);
    79	
    80	  // Contraste (story 9.2) : méta d'article (date · lecture) = info réelle → palier
    81	  // au-dessus (--text-faint échouait ~2.95:1 sur carte ; --text-muted ≥ 4.5:1).
    82	  color: var(--text-muted);
    83	}
     1	// ============================================================
     2	//  Tokens du design system — SOURCE DE VÉRITÉ du style
     3	//  Porté depuis docs/design_system/tokens/*.css (dark-first,
     4	//  héritage Ubuntu/terminal : orange + aubergine).
     5	//
     6	//  RÈGLE : aucune valeur de couleur / espace / rayon / ombre /
     7	//  motion ne doit être hardcodée dans un composant. Tout passe
     8	//  par ces CSS custom properties via var(--token). (NFR2 / CAP-2)
     9	//
    10	//  Les valeurs sont reproduites à l'identique des tokens source
    11	//  (notation couleur normalisée par Stylelint : hsl angle/%).
    12	// ============================================================
    13	
    14	:root {
    15	  // ---- Brand : Ubuntu orange (accent primaire) ----
    16	  --orange-50: hsl(24deg 100% 96%);
    17	  --orange-100: hsl(25deg 100% 92%);
    18	  --orange-300: hsl(24deg 100% 75%);
    19	  --orange-500: hsl(24deg 94% 53%); // accent héros
    20	  --orange-600: hsl(24deg 100% 47%);
    21	  --orange-700: hsl(24deg 100% 37%);
    22	  --orange-900: hsl(15deg 60% 17%);
    23	
    24	  // ---- Brand : Aubergine (violet Ubuntu) ----
    25	  --aubergine-light: hsl(319deg 26% 70%);
    26	  --aubergine: hsl(319deg 33% 30%);
    27	  --aubergine-vivid: hsl(319deg 60% 30%); // variante saturée — glows/dégradés héros
    28	  --aubergine-deep: hsl(319deg 100% 9%); // corps terminal
    29	  --aubergine-black: hsl(320deg 60% 5%);
    30	
    31	  // ---- Rampe de surfaces neutres (teintées aubergine, sombre→clair) ----
    32	  --surface-0: hsl(320deg 30% 6%); // fond de page, le plus profond
    33	  --surface-1: hsl(319deg 22% 9%); // sections en creux
    34	  --surface-2: hsl(318deg 18% 12%); // cartes / panneaux
    35	  --surface-3: hsl(317deg 16% 16%); // éléments surélevés / hover
    36	  --surface-4: hsl(316deg 14% 21%); // popovers, inputs
    37	
    38	  // ---- Bordures / hairlines ----
    39	  --line-subtle: hsl(316deg 14% 18%);
    40	  --line: hsl(315deg 12% 25%);
    41	  --line-strong: hsl(314deg 11% 34%);
    42	
    43	  // ---- Texte (off-whites chauds sur fond sombre) ----
    44	  --ink-1: hsl(30deg 18% 95%); // titres haut contraste
    45	  --ink-2: hsl(28deg 10% 74%); // corps
    46	  --ink-3: hsl(25deg 7% 54%); // discret / légendes
    47	  --ink-4: hsl(22deg 6% 40%); // estompé / désactivé
    48	  --ink-on-accent: hsl(320deg 60% 5%); // texte sombre sur orange
    49	
    50	  // ---- Palette terminale / syntaxe ----
    51	  --term-green: hsl(143deg 60% 52%); // prompt, succès
    52	  --term-blue: hsl(204deg 72% 62%); // répertoires, liens
    53	  --term-cyan: hsl(186deg 64% 56%);
    54	  --term-red: hsl(0deg 85% 64%);
    55	  --term-yellow: hsl(48deg 90% 58%);
    56	  --term-purple: hsl(280deg 60% 70%);
    57	
    58	  // ---- Sémantique ----
    59	  --success: hsl(143deg 58% 46%);
    60	  --success-soft: hsl(143deg 45% 14%);
    61	  --warning: hsl(38deg 92% 56%);
    62	  --warning-soft: hsl(38deg 60% 14%);
    63	  --danger: hsl(0deg 78% 60%);
    64	  --danger-soft: hsl(0deg 55% 15%);
    65	  --info: hsl(204deg 72% 56%);
    66	  --info-soft: hsl(204deg 55% 14%);
    67	
    68	  // ============================================================
    69	  //  Alias sémantiques — à préférer dans les composants
    70	  // ============================================================
    71	  --bg-page: var(--surface-0);
    72	  --bg-sunken: var(--surface-1);
    73	  --bg-card: var(--surface-2);
    74	  --bg-elevated: var(--surface-3);
    75	  --bg-input: var(--surface-4);
    76	  --bg-terminal: var(--aubergine-deep);
    77	  --text-strong: var(--ink-1);
    78	  --text-body: var(--ink-2);
    79	  --text-muted: var(--ink-3);
    80	  --text-faint: var(--ink-4);
    81	  --border-subtle: var(--line-subtle);
    82	  --border-default: var(--line);
    83	  --border-strong: var(--line-strong);
    84	  --accent: var(--orange-500);
    85	  --accent-hover: hsl(24deg 100% 60%);
    86	  --accent-active: var(--orange-600);
    87	  --accent-text: var(--ink-on-accent);
    88	  --accent-soft: hsl(24deg 94% 53% / 13%); // fond teinté
    89	  --accent-ring: hsl(24deg 94% 53% / 45%);
    90	  --accent-2: var(--aubergine-light); // accent secondaire
    91	  --accent-2-soft: hsl(319deg 40% 30% / 28%);
    92	  --border-terminal: hsl(319deg 40% 30% / 40%); // bordure fenêtre terminal (TerminalWindow.jsx)
    93	  --link: var(--term-blue);
    94	  --prompt: var(--term-green);
    95	  --overlay: hsl(320deg 60% 3% / 66%);
    96	  --selection: hsl(24deg 94% 53% / 28%);
    97	
    98	  // ============================================================
    99	  //  Typographie
   100	  // ============================================================
   101	  --font-mono: "Ubuntu Mono", "SF Mono", ui-monospace, monospace;
   102	  --font-sans: "Ubuntu", system-ui, -apple-system, "Segoe UI", sans-serif;
   103	  --font-display: var(--font-mono);
   104	
   105	  // Tailles de police (échelle px : 12 14 16 18 20 24 28 32 40 48 56)
   106	  --fs-xs: 0.75rem; // 12
   107	  --fs-sm: 0.875rem; // 14
   108	  --fs-base: 1rem; // 16
   109	  --fs-md: 1.125rem; // 18
   110	  --fs-lg: 1.25rem; // 20
   111	  --fs-xl: 1.5rem; // 24
   112	  --fs-2xl: 1.75rem; // 28
   113	  --fs-3xl: 2rem; // 32
   114	  --fs-4xl: 2.5rem; // 40
   115	  --fs-5xl: 3rem; // 48
   116	  --fs-6xl: 3.5rem; // 56
   117	
   118	  // Graisses
   119	  --fw-light: 300;
   120	  --fw-regular: 400;
   121	  --fw-medium: 500;
   122	  --fw-bold: 700;
   123	
   124	  // Interlignes
   125	  --lh-tight: 1.1;
   126	  --lh-snug: 1.3;
   127	  --lh-normal: 1.5;
   128	  --lh-relaxed: 1.65;
   129	
   130	  // Interlettrage — les eyebrows/labels mono reçoivent des capitales espacées
   131	  --ls-tight: -0.02em;
   132	  --ls-normal: 0;
   133	  --ls-wide: 0.04em;
   134	  --ls-wider: 0.14em;
   135	
   136	  // ============================================================
   137	  //  Espacement — base 4px (token = px / 4)
   138	  // ============================================================
   139	  --space-0: 0;
   140	  --space-1: 0.25rem; // 4
   141	  --space-2: 0.5rem; // 8
   142	  --space-3: 0.75rem; // 12
   143	  --space-4: 1rem; // 16
   144	  --space-5: 1.25rem; // 20
   145	  --space-6: 1.5rem; // 24
   146	  --space-8: 2rem; // 32
   147	  --space-10: 2.5rem; // 40
   148	  --space-12: 3rem; // 48
   149	  --space-16: 4rem; // 64
   150	  --space-20: 5rem; // 80
   151	  --space-24: 6rem; // 96
   152	
   153	  // Layout
   154	  --container-sm: 640px;
   155	  --container-md: 768px;
   156	  --container-lg: 992px;
   157	  --container-xl: 1200px;
   158	  --container-2xl: 1400px;
   159	  --header-height: 56px;
   160	  --footer-height: 56px;
   161	  --gutter: var(--space-6);
   162	
   163	  // ============================================================
   164	  //  Rayons (héritage : 0 / 4 / 8 / pill / 50% ; terminal = 5px)
   165	  // ============================================================
   166	  --radius-none: 0;
   167	  --radius-xs: 3px;
   168	  --radius-sm: 5px; // fenêtre terminal, chips
   169	  --radius-md: 8px; // cartes, inputs, boutons
   170	  --radius-lg: 12px; // grands panneaux
   171	  --radius-xl: 18px;
   172	  --radius-pill: 999px;
   173	  --radius-circle: 50%;
   174	
   175	  // ============================================================
   176	  //  Élévation — ombres calibrées pour une UI sombre
   177	  // ============================================================
   178	  --shadow-1: 0 1px 3px hsl(320deg 60% 2% / 50%);
   179	  --shadow-2: 0 2px 8px hsl(320deg 60% 2% / 55%);
   180	  --shadow-3: 0 8px 24px hsl(320deg 60% 2% / 60%);
   181	  --shadow-4: 0 18px 48px hsl(320deg 60% 2% / 66%);
   182	
   183	  // Hairline interne en haut : donne l'impression d'une carte éclairée du dessus
   184	  --shadow-hairline: inset 0 1px 0 hsl(30deg 20% 100% / 5%);
   185	
   186	  // Glows focaux
   187	  --glow-accent: 0 0 0 1px hsl(24deg 94% 53% / 40%), 0 8px 30px hsl(24deg 94% 53% / 22%);
   188	  --glow-terminal: 0 12px 40px hsl(319deg 100% 9% / 70%), 0 0 0 1px hsl(319deg 40% 40% / 30%);
   189	
   190	  // Anneau de focus
   191	  --ring-accent: 0 0 0 3px var(--accent-ring);
   192	
   193	  // ============================================================
   194	  //  Motion — easings sobres et mécaniques (esprit terminal)
   195	  // ============================================================
   196	  --dur-fast: 120ms;
   197	  --dur-base: 180ms;
   198	  --dur-slow: 320ms;
   199	  --dur-slower: 600ms;
   200	  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
   201	  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
   202	  --ease-standard: ease-in-out;
   203	}
   204	
   205	::selection {
   206	  background: var(--selection);
   207	}
   208	
   209	// Keyframes globaux (hors :root). Seul caret-blink est une boucle UI (caret terminal).
   210	@keyframes caret-blink {
   211	  0%,
   212	  49% {
   213	    opacity: 1;
   214	  }
   215	
   216	  50%,
   217	  100% {
   218	    opacity: 0;
   219	  }
   220	}
   221	
   222	@keyframes fade-rise {
   223	  from {
   224	    opacity: 0;
   225	    transform: translateY(8px);
   226	  }
   227	
   228	  to {
   229	    opacity: 1;
   230	    transform: translateY(0);
   231	  }
   232	}

exec
/bin/zsh -lc "nl -ba app/components/HeaderComponent.vue | sed -n '1,230p'; nl -ba app/components/HeaderComponent.vue | sed -n '230,680p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	<template>
     2	  <header class="hdr" :class="{ 'hdr--stuck': isScrolled }">
     3	    <div class="hdr__progress" :style="{ width: `${scrollProgress}%` }" aria-hidden="true" />
     4	    <div class="hdr__in">
     5	      <NuxtLink to="/" class="hdr__brand" @click="onBrandClick">
     6	        <img src="/images/logo_white.png" alt="" class="hdr__logo" width="24" height="24" />
     7	        <span class="hdr__brand-text"><b>jouan</b><span class="dim">.ovh</span></span>
     8	      </NuxtLink>
     9	
    10	      <nav class="hdr__nav" aria-label="Navigation principale">
    11	        <NuxtLink
    12	          v-for="item in navItems"
    13	          :key="item.to"
    14	          :to="item.to"
    15	          class="hdr__link"
    16	          :class="{ 'hdr__link--active': isActive(item.to) }"
    17	          :aria-current="isActive(item.to) ? 'page' : undefined"
    18	        >
    19	          <span class="hdr__link-prefix" aria-hidden="true">{{ item.prefix }} </span>
    20	          <span class="hdr__link-label">{{ item.label }}</span>
    21	        </NuxtLink>
    22	      </nav>
    23	
    24	      <div class="hdr__right">
    25	        <ZButton variant="terminal" size="sm" class="hdr__action hdr__action--terminal" @click="addNewTerminal">
    26	          <template #icon><ZIcon name="terminal" /></template>
    27	          Terminal
    28	        </ZButton>
    29	        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" class="hdr__action">
    30	          Démarrer un projet
    31	        </ZButton>
    32	
    33	        <button
    34	          ref="burgerButton"
    35	          class="hdr__burger"
    36	          type="button"
    37	          :aria-expanded="menuOpen"
    38	          aria-controls="hdr-mobile-menu"
    39	          :aria-label="menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
    40	          @click="toggleMenu"
    41	        >
    42	          <ZIcon :name="menuOpen ? 'arrow' : 'layers'" />
    43	        </button>
    44	      </div>
    45	    </div>
    46	
    47	    <!-- Dock d'état tout à droite de l'écran (hors container centré) -->
    48	    <div class="hdr__dock-right" aria-label="Statut et heure">
    49	      <div class="hdr__status-badge">
    50	        <span class="hdr__status-dot" aria-hidden="true" />
    51	        <span class="hdr__status-text">Disponible</span>
    52	      </div>
    53	      <CurrentTime class="hdr__dock-clock" />
    54	    </div>
    55	
    56	    <!-- Menu mobile -->
    57	    <div v-if="menuOpen" class="hdr__overlay" @click="closeMenuAndRefocus" />
    58	    <nav id="hdr-mobile-menu" class="hdr__menu" :class="{ 'hdr__menu--open': menuOpen }" aria-label="Navigation mobile">
    59	      <NuxtLink
    60	        v-for="(item, index) in navItems"
    61	        :key="item.to"
    62	        :ref="(el) => registerFirstLink(el, index)"
    63	        :to="item.to"
    64	        class="hdr__menu-link"
    65	        :class="{ 'hdr__menu-link--active': isActive(item.to) }"
    66	        :aria-current="isActive(item.to) ? 'page' : undefined"
    67	        @click="closeMenu"
    68	      >
    69	        <span class="hdr__menu-link-prefix" aria-hidden="true">{{ item.prefix }} </span>
    70	        <span class="hdr__menu-link-label">{{ item.label }}</span>
    71	      </NuxtLink>
    72	
    73	      <div class="hdr__menu-actions">
    74	        <div class="hdr__menu-status">
    75	          <div class="hdr__status-badge">
    76	            <span class="hdr__status-dot" aria-hidden="true" />
    77	            <span class="hdr__status-text">Disponible</span>
    78	          </div>
    79	          <CurrentTime class="hdr__menu-clock" />
    80	        </div>
    81	        <ZButton variant="terminal" size="sm" class="hdr__action--terminal" @click="openTerminalFromMenu">
    82	          <template #icon><ZIcon name="terminal" /></template>
    83	          Terminal
    84	        </ZButton>
    85	        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" @click="closeMenu">
    86	          Démarrer un projet
    87	        </ZButton>
    88	      </div>
    89	    </nav>
    90	
    91	    <TerminalManagerComponent ref="terminalManager" />
    92	  </header>
    93	</template>
    94	
    95	<script lang="ts" setup>
    96	import type { ComponentPublicInstance } from "vue";
    97	import { onBeforeUnmount, onMounted, nextTick, ref } from "vue";
    98	import { NuxtLink } from "#components";
    99	import TerminalManagerComponent from "~/components/terminal/TerminalManagerComponent.vue";
   100	
   101	const route = useRoute();
   102	
   103	const navItems = [
   104	  { to: "/", label: "Accueil", prefix: "~" },
   105	  { to: "/services", label: "Services", prefix: "//" },
   106	  { to: "/about", label: "À propos", prefix: "./" },
   107	  { to: "/blog", label: "Blog", prefix: "~/" },
   108	  { to: "/contact", label: "Contact", prefix: "$" },
   109	];
   110	
   111	// Lien actif : exact pour l'accueil, préfixe pour les autres (couvre /blog/[...slug]).
   112	function isActive(to: string): boolean {
   113	  if (to === "/") {
   114	    return route.path === "/";
   115	  }
   116	  return route.path === to || route.path.startsWith(`${to}/`);
   117	}
   118	
   119	// --- Scroll state & progress ---
   120	const isScrolled = ref(false);
   121	const scrollProgress = ref(0);
   122	
   123	function onScroll() {
   124	  const top = window.scrollY || document.documentElement.scrollTop || 0;
   125	  isScrolled.value = top > 20;
   126	  const h = document.documentElement.scrollHeight - window.innerHeight;
   127	  scrollProgress.value = h > 0 ? (top / h) * 100 : 0;
   128	}
   129	
   130	// --- Terminal easter-egg (préservé) ---
   131	const terminalManager = ref<InstanceType<typeof TerminalManagerComponent> | null>(null);
   132	
   133	function addNewTerminal() {
   134	  terminalManager.value?.createNewTerminal();
   135	}
   136	
   137	// Expose l'ouverture du terminal au reste du site via le lanceur partagé
   138	// (ex. ligne « help » du hero d'accueil, story 3.1). Le gestionnaire reste
   139	// monté ici ; on enregistre seulement une référence vers sa méthode.
   140	const { register: registerTerminalLauncher, unregister: unregisterTerminalLauncher } = useTerminal();
   141	
   142	// --- Menu mobile accessible ---
   143	const menuOpen = ref(false);
   144	const firstMenuLink = ref<HTMLElement | null>(null);
   145	const burgerButton = ref<HTMLElement | null>(null);
   146	
   147	function registerFirstLink(el: Element | ComponentPublicInstance | null, index: number) {
   148	  if (index !== 0) {
   149	    return;
   150	  }
   151	  const instance = el as ComponentPublicInstance | null;
   152	  firstMenuLink.value = (instance?.$el ?? el) as HTMLElement | null;
   153	}
   154	
   155	function openMenu() {
   156	  menuOpen.value = true;
   157	  nextTick(() => firstMenuLink.value?.focus());
   158	}
   159	
   160	function closeMenu() {
   161	  menuOpen.value = false;
   162	}
   163	
   164	function onBrandClick(event: MouseEvent) {
   165	  closeMenu();
   166	  if (route.path === "/") {
   167	    event.preventDefault();
   168	    window.scrollTo({ top: 0, behavior: "smooth" });
   169	  }
   170	}
   171	
   172	// Fermeture clavier/overlay : renvoie le focus au burger (déclencheur) — a11y.
   173	function closeMenuAndRefocus() {
   174	  if (!menuOpen.value) {
   175	    return;
   176	  }
   177	  closeMenu();
   178	  nextTick(() => burgerButton.value?.focus());
   179	}
   180	
   181	function toggleMenu() {
   182	  if (menuOpen.value) {
   183	    closeMenu();
   184	  } else {
   185	    openMenu();
   186	  }
   187	}
   188	
   189	function openTerminalFromMenu() {
   190	  addNewTerminal();
   191	  closeMenu();
   192	}
   193	
   194	function onKeydown(event: KeyboardEvent) {
   195	  if (event.key === "Escape" && menuOpen.value) {
   196	    closeMenuAndRefocus();
   197	  }
   198	}
   199	
   200	// Passage en desktop alors que le menu mobile est ouvert : on le ferme (sinon
   201	// l'overlay fixed resterait actif et le menu deviendrait incohérent au resize).
   202	let desktopMq: MediaQueryList | null = null;
   203	function onDesktopChange(event: MediaQueryListEvent) {
   204	  if (event.matches) {
   205	    closeMenu();
   206	  }
   207	}
   208	
   209	onMounted(() => {
   210	  document.addEventListener("keydown", onKeydown);
   211	  desktopMq = window.matchMedia("(min-width: 901px)");
   212	  desktopMq.addEventListener("change", onDesktopChange);
   213	  registerTerminalLauncher(addNewTerminal);
   214	  window.addEventListener("scroll", onScroll, { passive: true });
   215	  onScroll();
   216	});
   217	
   218	onBeforeUnmount(() => {
   219	  document.removeEventListener("keydown", onKeydown);
   220	  desktopMq?.removeEventListener("change", onDesktopChange);
   221	  unregisterTerminalLauncher(addNewTerminal);
   222	  window.removeEventListener("scroll", onScroll);
   223	});
   224	</script>
   225	
   226	<style lang="scss" scoped>
   227	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css */
   228	.hdr {
   229	  position: fixed;
   230	  top: 0;
   230	  top: 0;
   231	  left: 0;
   232	  right: 0;
   233	  z-index: 50;
   234	  height: var(--header-height);
   235	  background: transparent;
   236	  border-bottom: 1px solid transparent;
   237	  transition:
   238	    background var(--dur-base) var(--ease-standard),
   239	    border-color var(--dur-base) var(--ease-standard),
   240	    backdrop-filter var(--dur-base) var(--ease-standard),
   241	    -webkit-backdrop-filter var(--dur-base) var(--ease-standard);
   242	}
   243	
   244	.hdr--stuck {
   245	  background: color-mix(in srgb, var(--surface-0) 80%, transparent);
   246	  border-bottom-color: var(--border-subtle);
   247	
   248	  /* stylelint-disable-next-line property-no-vendor-prefix -- Safari : autoprefixer non câblé, préfixe manuel requis */
   249	  -webkit-backdrop-filter: blur(12px);
   250	  backdrop-filter: blur(12px);
   251	}
   252	
   253	.hdr__progress {
   254	  position: absolute;
   255	  top: 0;
   256	  left: 0;
   257	  height: 2px;
   258	  background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
   259	  box-shadow: 0 0 10px var(--accent);
   260	  pointer-events: none;
   261	  transition: width 0.05s linear;
   262	}
   263	
   264	.hdr__in {
   265	  display: flex;
   266	  align-items: center;
   267	  gap: var(--space-6);
   268	  width: 100%;
   269	  max-width: var(--container-xl);
   270	  height: 100%;
   271	  margin: 0 auto;
   272	  padding: 0 var(--space-6);
   273	}
   274	
   275	.hdr__brand {
   276	  display: inline-flex;
   277	  align-items: center;
   278	  gap: var(--space-3);
   279	  text-decoration: none;
   280	  cursor: pointer;
   281	
   282	  .hdr__logo {
   283	    display: block;
   284	    width: 24px;
   285	    height: 24px;
   286	    object-fit: contain;
   287	    filter: drop-shadow(0 2px 6px color-mix(in srgb, var(--surface-0) 60%, transparent));
   288	    transition:
   289	      transform var(--dur-base) var(--ease-standard),
   290	      filter var(--dur-base) var(--ease-standard);
   291	  }
   292	
   293	  .hdr__brand-text {
   294	    transition: transform var(--dur-fast) var(--ease-standard);
   295	  }
   296	
   297	  b {
   298	    font-family: var(--font-mono);
   299	    font-size: var(--fs-md);
   300	    font-weight: var(--fw-bold);
   301	    color: var(--text-strong);
   302	    transition: color var(--dur-fast) var(--ease-standard);
   303	  }
   304	
   305	  .dim {
   306	    color: var(--text-faint);
   307	    transition: color var(--dur-fast) var(--ease-standard);
   308	  }
   309	
   310	  &:hover {
   311	    .hdr__logo {
   312	      transform: rotate(-12deg) scale(1.15);
   313	      filter: drop-shadow(0 0 10px color-mix(in srgb, var(--accent) 70%, transparent));
   314	    }
   315	
   316	    b {
   317	      color: var(--accent);
   318	    }
   319	
   320	    .dim {
   321	      color: var(--text-body);
   322	    }
   323	  }
   324	
   325	  // Lien focusable (logo + nom) : anneau DS comme les autres focusables du châssis.
   326	  &:focus-visible {
   327	    outline: 2px solid transparent; // forced-colors : rendu en couleur système
   328	    outline-offset: 2px;
   329	    border-radius: var(--radius-sm);
   330	    box-shadow: var(--ring-accent);
   331	  }
   332	}
   333	
   334	.hdr__nav {
   335	  position: absolute;
   336	  left: 50%;
   337	  display: flex;
   338	  align-items: center;
   339	  gap: var(--space-6);
   340	  transform: translateX(-50%);
   341	}
   342	
   343	.hdr__link {
   344	  position: relative;
   345	  display: inline-flex;
   346	  align-items: center;
   347	  gap: var(--space-1);
   348	  padding: 4px 0;
   349	  font-family: var(--font-mono);
   350	  font-size: var(--fs-sm);
   351	  color: var(--text-muted);
   352	  text-decoration: none;
   353	  background: transparent;
   354	  transition: color var(--dur-fast) var(--ease-standard);
   355	
   356	  &::after {
   357	    content: "";
   358	    position: absolute;
   359	    bottom: -2px;
   360	    left: 0;
   361	    width: 0;
   362	    height: 1.5px;
   363	    background: var(--accent);
   364	    transition: width var(--dur-base) var(--ease-out);
   365	  }
   366	
   367	  &:hover {
   368	    color: var(--text-strong);
   369	    background: transparent;
   370	
   371	    &::after {
   372	      width: 100%;
   373	    }
   374	  }
   375	
   376	  // Anneau de focus DS
   377	  &:focus-visible {
   378	    outline: 2px solid transparent; // forced-colors : rendu en couleur système
   379	    outline-offset: 4px;
   380	    border-radius: var(--radius-xs);
   381	    box-shadow: var(--ring-accent);
   382	  }
   383	}
   384	
   385	.hdr__link--active {
   386	  color: var(--text-strong);
   387	
   388	  &::after {
   389	    width: 100%;
   390	  }
   391	
   392	  .hdr__link-prefix {
   393	    color: var(--accent);
   394	  }
   395	}
   396	
   397	.hdr__link-prefix,
   398	.hdr__menu-link-prefix {
   399	  font-family: var(--font-mono);
   400	  color: var(--text-faint);
   401	  transition: color var(--dur-fast) var(--ease-standard);
   402	}
   403	
   404	.hdr__link:hover .hdr__link-prefix,
   405	.hdr__link--active .hdr__link-prefix,
   406	.hdr__menu-link:hover .hdr__menu-link-prefix,
   407	.hdr__menu-link--active .hdr__menu-link-prefix {
   408	  color: var(--accent);
   409	}
   410	
   411	.hdr__right {
   412	  display: flex;
   413	  align-items: center;
   414	  gap: var(--space-3);
   415	  margin-left: auto;
   416	}
   417	
   418	.hdr__action--terminal {
   419	  border-color: color-mix(in srgb, var(--term-green) 40%, transparent);
   420	  box-shadow: 0 0 12px color-mix(in srgb, var(--term-green) 22%, transparent);
   421	
   422	  &:hover {
   423	    border-color: var(--term-green);
   424	    box-shadow:
   425	      0 0 20px color-mix(in srgb, var(--term-green) 45%, transparent),
   426	      var(--glow-terminal);
   427	  }
   428	}
   429	
   430	// Dock de statut & horloge positionné tout à droite de l'écran (hors container centré)
   431	.hdr__dock-right {
   432	  position: absolute;
   433	  top: 50%;
   434	  right: var(--space-6);
   435	  z-index: 52;
   436	  display: flex;
   437	  gap: var(--space-3);
   438	  align-items: center;
   439	  transform: translateY(-50%);
   440	}
   441	
   442	.hdr__status-badge {
   443	  display: inline-flex;
   444	  gap: var(--space-2);
   445	  align-items: center;
   446	  padding: 4px 10px;
   447	  font-family: var(--font-mono);
   448	  font-size: var(--fs-xs);
   449	  color: var(--term-green);
   450	  user-select: none;
   451	  background: color-mix(in srgb, var(--term-green) 12%, transparent);
   452	  border: 1px solid color-mix(in srgb, var(--term-green) 40%, transparent);
   453	  border-radius: var(--radius-pill);
   454	  box-shadow: 0 0 10px color-mix(in srgb, var(--term-green) 18%, transparent);
   455	  transition:
   456	    box-shadow var(--dur-base) var(--ease-standard),
   457	    border-color var(--dur-base) var(--ease-standard);
   458	
   459	  /* stylelint-disable-next-line property-no-vendor-prefix */
   460	  -webkit-backdrop-filter: blur(8px);
   461	  backdrop-filter: blur(8px);
   462	
   463	  &:hover {
   464	    border-color: var(--term-green);
   465	    box-shadow: 0 0 16px color-mix(in srgb, var(--term-green) 35%, transparent);
   466	  }
   467	}
   468	
   469	.hdr__status-dot {
   470	  width: 7px;
   471	  height: 7px;
   472	  background: var(--term-green);
   473	  border-radius: var(--radius-circle);
   474	  box-shadow: 0 0 6px var(--term-green);
   475	}
   476	
   477	.hdr__dock-clock {
   478	  margin-left: var(--space-1);
   479	}
   480	
   481	.hdr__burger {
   482	  display: none;
   483	  align-items: center;
   484	  justify-content: center;
   485	  width: 36px;
   486	  height: 36px;
   487	  font-size: 20px;
   488	  color: var(--text-strong);
   489	  cursor: pointer;
   490	  background: none;
   491	  border: 1px solid var(--border-default);
   492	  border-radius: var(--radius-md);
   493	
   494	  &:focus-visible {
   495	    outline: 2px solid transparent; // forced-colors : rendu en couleur système
   496	    outline-offset: 2px;
   497	    box-shadow: var(--ring-accent);
   498	  }
   499	}
   500	
   501	.hdr__overlay {
   502	  position: fixed;
   503	  inset: var(--header-height) 0 0;
   504	  z-index: 40;
   505	  background: var(--overlay);
   506	}
   507	
   508	.hdr__menu {
   509	  display: none;
   510	}
   511	
   512	.hdr__menu-status {
   513	  display: flex;
   514	  align-items: center;
   515	  justify-content: space-between;
   516	  padding-bottom: var(--space-2);
   517	  margin-bottom: var(--space-2);
   518	  border-bottom: 1px solid var(--border-subtle);
   519	}
   520	
   521	// Dégradé progressif pour le dock droit sur largeurs moyennes
   522	@media (width <= 1250px) {
   523	  .hdr__dock-right {
   524	    display: none;
   525	  }
   526	}
   527	
   528	// Sécurité : pas d'overlay en desktop (le menu mobile y est fermé par JS).
   529	@media (width >= 901px) {
   530	  .hdr__overlay {
   531	    display: none;
   532	  }
   533	}
   534	
   535	// ---- Responsive : < 900px (cf. kit.css) ----
   536	@media (width <= 900px) {
   537	  .hdr__nav,
   538	  .hdr__dock-right,
   539	  .hdr__right .hdr__action {
   540	    display: none;
   541	  }
   542	
   543	  .hdr__burger {
   544	    display: inline-flex;
   545	  }
   546	
   547	  .hdr__menu {
   548	    position: fixed;
   549	    inset: var(--header-height) 0 auto 0;
   550	    z-index: 45;
   551	    display: flex;
   552	    flex-direction: column;
   553	    gap: var(--space-1);
   554	    padding: var(--space-4) var(--space-6) var(--space-6);
   555	    background: var(--surface-1);
   556	    border-bottom: 1px solid var(--border-subtle);
   557	    box-shadow: var(--shadow-3);
   558	    transform: translateY(-8px);
   559	    opacity: 0;
   560	    visibility: hidden;
   561	    transition:
   562	      transform var(--dur-base) var(--ease-out),
   563	      opacity var(--dur-base) var(--ease-standard),
   564	      visibility var(--dur-base);
   565	  }
   566	
   567	  .hdr__menu--open {
   568	    transform: translateY(0);
   569	    opacity: 1;
   570	    visibility: visible;
   571	  }
   572	}
   573	
   574	.hdr__menu-link {
   575	  padding: var(--space-3);
   576	  font-family: var(--font-mono);
   577	  font-size: var(--fs-base);
   578	  color: var(--text-body);
   579	  text-decoration: none;
   580	  border-radius: var(--radius-sm);
   581	
   582	  &:hover {
   583	    color: var(--text-strong);
   584	    background: var(--surface-2);
   585	  }
   586	
   587	  &:focus-visible {
   588	    outline: 2px solid transparent; // forced-colors : rendu en couleur système
   589	    outline-offset: 2px;
   590	    box-shadow: var(--ring-accent);
   591	  }
   592	}
   593	
   594	.hdr__menu-link--active {
   595	  color: var(--accent);
   596	}
   597	
   598	.hdr__menu-actions {
   599	  display: flex;
   600	  flex-direction: column;
   601	  gap: var(--space-2);
   602	  margin-top: var(--space-3);
   603	}
   604	
   605	@media (prefers-reduced-motion: reduce) {
   606	  .hdr__link,
   607	  .hdr__link::after,
   608	  .hdr__menu {
   609	    transition: none;
   610	  }
   611	
   612	  .hdr__brand .hdr__logo,
   613	  .hdr__brand:hover .hdr__logo {
   614	    transform: none;
   615	    transition: none;
   616	  }
   617	}
   618	</style>

exec
/bin/zsh -lc "for f in app/pages/services.vue app/pages/about.vue app/pages/blog/index.vue app/pages/contact.vue app/pages/blog/'[...slug].vue'; do echo \"--- "'$f"; rg -n "<template>|<header|<section|class='"\\\"(page|hero|section|.*title)|padding|margin-top\" \""'$f"; done' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
--- app/pages/services.vue
1:<template>
4:    <section class="section">
7:        <h1 class="services__title">Des prestations claires, pensées comme des produits.</h1>
20:              <h2 class="offer__title">{{ offer.title }}</h2>
46:    <section class="section section--sunken">
49:        <h2 class="process__title">Un déroulé simple en quatre temps</h2>
54:            <h3 class="process__step-title">{{ step.title }}</h3>
206:  padding: 0;
215:// `margin-top: auto`, alignant les pieds de carte sur des hauteurs inégales.
260:  padding: 0;
265:    padding: var(--space-1) 0 var(--space-1) var(--space-5);
281:  // `margin-top: auto` colle le prix (et le CTA qui suit) au bas de la carte ;
282:  // `padding-top` reprend l'inline JSX (space-5) au lieu du margin-top du kit.
283:  margin-top: auto;
284:  padding-top: var(--space-5);
297:  margin-top: var(--space-4);
319:  padding: 0;
344:  margin-top: var(--space-12);
--- app/pages/about.vue
1:<template>
5:         La section CV (expériences + formation) suit dans une <section--sunken> (story 5.2). -->
6:    <section class="section">
44:              <ul class="hero__tags">
57:    <section class="section section--sunken">
219:  margin-top: var(--space-4);
227:  margin-top: var(--space-5);
280:// `margin-top` repris de l'inline JSX (<div class="tl" style="margin-top: var(--space-5)">).
283:// (left:-22px sur .tl__item, décalé du padding-left) tombait ~2px à droite du rail
294:  padding-left: var(--space-6);
311:  padding-bottom: var(--space-6);
314:// `left` ramène le point sur --tl-axis en compensant le padding-left de .tl
352:  margin-top: var(--space-2);
365:  padding: 0;
--- app/pages/blog/index.vue
1:<template>
3:    <section class="section">
7:        <h1 class="blog__title">Notes de dev</h1>
8:        <p class="prose blog__subtitle">
27:                <ul v-if="article.tags?.length" class="hero__tags post__tags">
32:                <h2 class="post__title">{{ article.title }}</h2>
56:          <h2 class="blog__notice-title">Le chargement des articles a échoué.</h2>
72:          <h2 class="blog__notice-title">Pas encore d'articles.</h2>
185:  padding: 0;
--- app/pages/contact.vue
1:<template>
3:    <section class="section">
9:            <h1 class="contact__title">Parlons de votre projet</h1>
409:  padding: 0;
452:  margin-top: var(--space-2);
--- app/pages/blog/[...slug].vue
1:<template>
3:    <section class="section">
11:          <ul v-if="page.tags?.length" class="hero__tags article__tags">
17:          <h1 class="article__title">{{ page.title }}</h1>
298:    padding: var(--space-4);
324:    padding-left: var(--space-6);
338:    padding: var(--space-1) 0 var(--space-1) var(--space-4);
365:    padding: var(--space-2) var(--space-3);
393:  margin-top: var(--space-10);
394:  padding-top: var(--space-6);

exec
/bin/zsh -lc 'git status --short && git diff --check -- docs/implementation-artifacts/code-reviews/11-6/full.diff && file public/images/logo_white.png && identify public/images/logo_white.png 2>/dev/null || true' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
?? docs/implementation-artifacts/code-reviews/11-6/
public/images/logo_white.png: PNG image data, 1024 x 1024, 8-bit/color RGBA, non-interlaced

exec
/bin/zsh -lc "rg -n \"<section class=\\\"section|hero__title|cta__title|cta__highlight|stats|section--sunken\" app/pages/index.vue docs/implementation-artifacts/11-6-polissage-visuel-fidelite-maquette-awwwards-et-interactions.md docs/planning-artifacts/epics.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/implementation-artifacts/11-6-polissage-visuel-fidelite-maquette-awwwards-et-interactions.md:59:   - **When** elles sont affichées dans la section `section--sunken`
docs/implementation-artifacts/11-6-polissage-visuel-fidelite-maquette-awwwards-et-interactions.md:85:  - [x] Rehausser la typographie du titre `.hero__title` (`clamp(2.4rem, 5.2vw, 4.4rem)`, `line-height: 1.05`) et insérer les spans/italiques accentués (`<em>`) pour un impact éditorial fidèle à la maquette.
docs/implementation-artifacts/11-6-polissage-visuel-fidelite-maquette-awwwards-et-interactions.md:125:  - `app/pages/index.vue` (hero transparent sans coupure, h1 expressif, cartes stats contrastées et lisibles, CTA ample et aéré, activation tilt sur les cartes)
docs/planning-artifacts/epics.md:35:FR5: Page d'accueil = hero Terminal (A) + aperçu services + stats + projets sélectionnés. _(CAP-5)_
docs/planning-artifacts/epics.md:100:UX-DR12: Home — hero Terminal (A), aperçu services, stats, projets sélectionnés (réf. `Home.jsx`, contenu `data.js`).
docs/planning-artifacts/epics.md:156:Le visiteur découvre Simon via le hero Terminal (A) + aperçu services + stats + projets sélectionnés.
docs/planning-artifacts/epics.md:361:Le visiteur découvre Simon via le hero Terminal (A) + aperçu services + stats + projets.
docs/planning-artifacts/epics.md:376:### Story 3.2: Aperçu services et stats
docs/planning-artifacts/epics.md:384:**Given** le contenu `data.js` (services, stats)
docs/planning-artifacts/epics.md:385:**When** on implémente les blocs aperçu services + stats sur `/`
docs/planning-artifacts/epics.md:386:**Then** les 3 services et les stats rendent conformément à `Home.jsx`
docs/planning-artifacts/epics.md:663:**And** les constats sont consignés ; rendu en mode normal inchangé ; gate verte
app/pages/index.vue:15:            <h1 class="hero__title">Développeur Full Stack <em>TypeScript</em></h1>
app/pages/index.vue:51:    <section class="section">
app/pages/index.vue:88:    <section class="section">
app/pages/index.vue:126:        <ul class="stats">
app/pages/index.vue:127:          <li v-for="stat in stats" :key="stat.id" class="stat">
app/pages/index.vue:136:    <section class="section">
app/pages/index.vue:196:    <section class="section">
app/pages/index.vue:200:          <h2 class="cta__title">
app/pages/index.vue:202:            Mettons-le <span class="cta__highlight">en production</span>.
app/pages/index.vue:309:const stats = [
app/pages/index.vue:404:.hero__title {
app/pages/index.vue:751:// ---- Stats (porté de .stats) ----
app/pages/index.vue:752:.stats {
app/pages/index.vue:965:.cta__title {
app/pages/index.vue:975:.cta__highlight {
app/pages/index.vue:1003:  .hero__title {
app/pages/index.vue:1029:  .stats {

exec
/bin/zsh -lc "nl -ba app/pages/services.vue | sed -n '1,95p'; nl -ba app/pages/about.vue | sed -n '1,75p'; nl -ba app/pages/blog/index.vue | sed -n '1,90p'; nl -ba app/pages/contact.vue | sed -n '1,45p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	<template>
     2	  <main class="services">
     3	    <!-- En-tête + grille d'offres (story 4.1). La 2e section (process) viendra en 4.2. -->
     4	    <section class="section">
     5	      <div class="container">
     6	        <p class="eyebrow"><span aria-hidden="true">// </span>services</p>
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
    48	        <p class="eyebrow"><span aria-hidden="true">// </span>comment ça se passe</p>
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
    61	            Me parler de votre besoin
    62	            <template #iconRight><ZIcon name="arrow" /></template>
    63	          </ZButton>
    64	        </div>
    65	      </div>
    66	    </section>
    67	  </main>
    68	</template>
    69	
    70	<script setup lang="ts">
    71	// Page Services : catalogue d'offres packagées + process 4 étapes + CTA contact.
    72	// Données statiques (3 offres, 4 étapes) déclarées localement. Prerender-safe, dark-first.
    73	import { NuxtLink } from "#components";
    74	import { SITE } from "~/data/site";
    75	
    76	interface Offer {
    77	  /** Clé v-for stable (indépendante du contenu affiché). */
    78	  id: string;
    79	  /** Nom d'icône dans le set ZIcon (story 2.7). */
    80	  icon: string;
    81	  title: string;
    82	  desc: string;
    83	  points: string[];
    84	  price: string;
    85	  /** Offre mise en avant : carte accent + glow + badge. */
    86	  featured: boolean;
    87	}
    88	
    89	// Contenu repris à l'identique de data.js (window.SITE.services) — 1re personne,
    90	// vouvoiement, pas d'emoji. « Applications web » est l'offre mise en avant.
    91	const offers: Offer[] = [
    92	  {
    93	    id: "wordpress",
    94	    icon: "wp",
    95	    title: "WordPress sur-mesure",
     1	<template>
     2	  <main class="about">
     3	    <!-- Hero À-propos : portrait + identité (colonne gauche) + bio + stack (colonne droite).
     4	         Porté de About.jsx (section hero) : recréation Vue 3 + tokens, aucune copie JSX.
     5	         La section CV (expériences + formation) suit dans une <section--sunken> (story 5.2). -->
     6	    <section class="section">
     7	      <div class="container">
     8	        <div class="about__grid">
     9	          <!-- Colonne gauche : portrait, identité, localisation, CTA -->
    10	          <div class="about__identity">
    11	            <ZAvatar src="/images/portrait.jpeg" :alt="profile.name" initials="SJ" size="xl" ring />
    12	            <h1 class="about__name">{{ profile.name }}</h1>
    13	            <p class="about__role">{{ profile.role }}</p>
    14	            <p class="prose about__location">
    15	              <ZIcon name="pin" class="about__pin" />
    16	              {{ profile.city }}
    17	            </p>
    18	            <div class="about__cta">
    19	              <ZButton :as="NuxtLink" to="/contact" variant="primary">Me contacter</ZButton>
    20	              <ZButton as="a" :href="`mailto:${profile.email}`" variant="secondary">M'écrire</ZButton>
    21	            </div>
    22	          </div>
    23	
    24	          <!-- Colonne droite : eyebrow + bio (1re personne, emphases sur les technologies) + stack -->
    25	          <div class="about__bio">
    26	            <h2 class="eyebrow">// à propos</h2>
    27	            <p class="prose about__para">
    28	              Développeur web freelance basé à <strong>{{ city }}</strong
    29	              >, je viens d'un parcours technique (métrologie, instrumentation) avant de basculer avec passion dans le
    30	              code. Aujourd'hui, je conçois et développe des applications web et produits SaaS modernes avec
    31	              <strong>Vue 3 / Nuxt 4</strong>, <strong>NestJS</strong> et <strong>PostgreSQL</strong>.
    32	            </p>
    33	            <p class="prose about__para">
    34	              Je suis également co-fondateur de la plateforme SaaS
    35	              <ZExternalLink :href="keovaUrl">{{ keovaHostname }}</ZExternalLink
    36	              >, et j'intègre l'automatisation, l'exigence QA et l'IA au service du code — tests automatisés,
    37	              architecture modulaire et intégrations d'APIs.
    38	            </p>
    39	
    40	            <!-- Stack technique (story 5.2) — sous la bio, conforme à About.jsx. ZTag = pill.
    41	                 Liste sémantique (<ul>/<li>) pour annonce « liste de N éléments » aux lecteurs d'écran. -->
    42	            <div class="about__stack">
    43	              <h2 class="eyebrow eyebrow--muted">// stack</h2>
    44	              <ul class="hero__tags">
    45	                <li v-for="skill in skills" :key="skill">
    46	                  <ZTag>{{ skill }}</ZTag>
    47	                </li>
    48	              </ul>
    49	            </div>
    50	          </div>
    51	        </div>
    52	      </div>
    53	    </section>
    54	
    55	    <!-- Section CV (story 5.2) : timeline d'expériences (gauche) + formation (droite).
    56	         Porté de About.jsx (2e section--sunken), grille 1.4fr / 0.6fr. -->
    57	    <section class="section section--sunken">
    58	      <div class="container">
    59	        <div class="about__cv">
    60	          <!-- Colonne gauche : timeline d'expériences (la plus récente en haut).
    61	               <ol> : séquence chronologique annoncée comme liste ordonnée aux lecteurs d'écran. -->
    62	          <div>
    63	            <h2 class="eyebrow">// expériences</h2>
    64	            <ol class="tl">
    65	              <li v-for="xp in experiences" :key="xp.org" class="tl__item">
    66	                <div class="tl__date">{{ xp.date }}</div>
    67	                <div class="tl__role">{{ xp.role }}</div>
    68	                <div class="tl__org">{{ xp.org }}</div>
    69	                <div class="tl__desc">{{ xp.desc }}</div>
    70	              </li>
    71	            </ol>
    72	          </div>
    73	
    74	          <!-- Colonne droite : formation (une ZCard par diplôme), liste sémantique <ul>/<li>. -->
    75	          <div>
     1	<template>
     2	  <main class="blog">
     3	    <section class="section">
     4	      <div class="container">
     5	        <!-- En-tête (porté de Blog.jsx : eyebrow + titre + sous-titre prose) -->
     6	        <p class="eyebrow">// ~/blog</p>
     7	        <h1 class="blog__title">Notes de dev</h1>
     8	        <p class="prose blog__subtitle">
     9	          WordPress, architecture, IA appliquée — ce que j'apprends en construisant des choses.
    10	        </p>
    11	
    12	        <!-- Liste des articles (triés par date décroissante), cartes interactives -->
    13	        <ul v-if="articles && articles.length" class="blog__list">
    14	          <li v-for="article in articles" :key="article.path" class="blog__item">
    15	            <ZCard :as="NuxtLink" :to="article.path" interactive class="post">
    16	              <NuxtImg
    17	                v-if="article.image"
    18	                class="post__thumb"
    19	                :src="article.image.src"
    20	                :alt="article.image.alt"
    21	                width="200"
    22	                height="130"
    23	                sizes="200px"
    24	                format="webp"
    25	              />
    26	              <div class="post__body">
    27	                <ul v-if="article.tags?.length" class="hero__tags post__tags">
    28	                  <li v-for="tag in article.tags" :key="tag">
    29	                    <ZTag>{{ tag }}</ZTag>
    30	                  </li>
    31	                </ul>
    32	                <h2 class="post__title">{{ article.title }}</h2>
    33	                <p class="post__desc">{{ article.description }}</p>
    34	                <div class="post__meta">
    35	                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
    36	                  <!-- `read` est optionnel : pas de séparateur ni de « de lecture » orphelins. -->
    37	                  <template v-if="article.read">
    38	                    <span aria-hidden="true">·</span>
    39	                    <span>{{ article.read }} de lecture</span>
    40	                  </template>
    41	                </div>
    42	              </div>
    43	            </ZCard>
    44	          </li>
    45	        </ul>
    46	
    47	        <!-- Erreur de chargement (distincte d'un véritable empty-state) -->
    48	        <ZCard v-else-if="error" class="blog__notice" padded>
    49	          <NuxtImg
    50	            class="blog__notice-img"
    51	            src="/images/undraw_code_thinking_re_gka2.svg"
    52	            alt=""
    53	            width="220"
    54	            height="165"
    55	          />
    56	          <h2 class="blog__notice-title">Le chargement des articles a échoué.</h2>
    57	          <p class="prose blog__notice-text">
    58	            Une erreur est survenue lors de la récupération des articles. Ce n'est pas vous, c'est moi : merci de
    59	            réessayer dans quelques instants.
    60	          </p>
    61	        </ZCard>
    62	
    63	        <!-- Empty-state : aucun article publié (texte français conservé, restylé via tokens) -->
    64	        <ZCard v-else class="blog__notice" padded>
    65	          <NuxtImg
    66	            class="blog__notice-img"
    67	            src="/images/undraw_code_thinking_re_gka2.svg"
    68	            alt=""
    69	            width="220"
    70	            height="165"
    71	          />
    72	          <h2 class="blog__notice-title">Pas encore d'articles.</h2>
    73	          <p class="prose blog__notice-text">
    74	            Je travaille actuellement sur de nouveaux contenus pour partager ce que j'apprends en développement web.
    75	            Revenez bientôt pour découvrir mes prochaines publications.
    76	          </p>
    77	        </ZCard>
    78	      </div>
    79	    </section>
    80	  </main>
    81	</template>
    82	
    83	<script setup lang="ts">
    84	// Index du blog (story 6.1) — porté de Blog.jsx : en-tête + liste d'articles en
    85	// cartes ZCard interactives, méta mono, empty-state restylé. Contenu via @nuxt/content
    86	// v3 (queryCollection). Dark-first, tokens uniquement, prerender-safe (requête résolue
    87	// au build par useAsyncData). La vue article (/blog/[...slug]) est la story 6.2.
    88	import { NuxtLink } from "#components";
    89	import { SITE } from "~/data/site";
    90	
     1	<template>
     2	  <main class="contact">
     3	    <section class="section">
     4	      <div class="container">
     5	        <div class="contact__grid">
     6	          <!-- Colonne gauche : en-tête + formulaire (story 7.1) -->
     7	          <div class="contact__main">
     8	            <p class="eyebrow"><span aria-hidden="true">// </span>contact</p>
     9	            <h1 class="contact__title">Parlons de votre projet</h1>
    10	            <p class="prose contact__intro">
    11	              Une idée, un site à refaire, une automatisation à mettre en place ? Décrivez-moi le besoin — je réponds
    12	              sous 48h.
    13	            </p>
    14	
    15	            <!-- État « envoyé » : carte accent + ligne mono verte. role="status" + focus
    16	                 programmatique (tabindex -1) → annonce fiable aux lecteurs d'écran. -->
    17	            <ZCard v-if="sent" ref="sentCard" accent class="contact__sent" role="status" tabindex="-1">
    18	              <p class="contact__sent-line"><span aria-hidden="true">✓</span> Message envoyé</p>
    19	              <p class="prose contact__sent-text">Merci ! Je vous réponds très vite à votre adresse.</p>
    20	            </ZCard>
    21	
    22	            <!-- Formulaire — envoi via Web3Forms (service sans serveur, clé en env). Validation
    23	                 front d'abord ; `novalidate` pour afficher nos messages FR (et non les bulles
    24	                 natives). Compatible site statique : le fetch ne tourne qu'au clic, côté client. -->
    25	            <form v-else ref="formRef" class="contact__form" novalidate @submit.prevent="onSubmit">
    26	              <!-- Honeypot anti-spam : hors flux visuel et hors tabulation ; rempli = bot. -->
    27	              <div class="contact__hp" aria-hidden="true">
    28	                <label>
    29	                  Ne remplissez pas ce champ
    30	                  <input v-model="honeypot" type="text" tabindex="-1" autocomplete="off" />
    31	                </label>
    32	              </div>
    33	
    34	              <div class="contact__row">
    35	                <ZInput
    36	                  v-model="form.name"
    37	                  label="Nom"
    38	                  placeholder="Votre nom"
    39	                  required
    40	                  autocomplete="name"
    41	                  :error="Boolean(errors.name)"
    42	                  :hint="errors.name"
    43	                />
    44	                <ZInput
    45	                  v-model="form.email"

exec
/bin/zsh -lc "rg -n -i \"cypress|testcafe|testcafé\" --glob '"'!docs/implementation-artifacts/code-reviews/11-6/full.diff'"' ." in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
./docs/planning-artifacts/epics.md:751:**Given** la stack moderne définie dans `SITE.skills` (TypeScript, Nuxt 4, Vue.js, NestJS, Node.js, PostgreSQL, TypeORM, Stripe Connect, Cypress, Docker, REST API, Vitest)
./docs/contexte_malt.md:205:- TestCafe ;
./docs/contexte_malt.md:298:- TestCafe ;
./docs/contexte_malt.md:335:- TestCafe ;
./app/pages/about.vue:116:    desc: "Tests automatisés et fiabilisation applicative — Node.js, TypeScript, TestCafé.",
./app/pages/index.vue:296:      "Tests E2E TestCafé & tests unitaires Vitest",
./app/pages/index.vue:299:    tags: ["TestCafé", "Vitest", "Docker", "CI/CD"],
./app/data/site.ts:50:  "testcafe",
./docs/design_system/_ds_bundle.js:1831:    desc: "Tests automatisés — Node.js, TypeScript, TestCafé."
./docs/specs/spec-home-awwwards/sections-mapping.md:16:| **Marquee Stack** | Défilé continu des technologies prioritaires | Stack moderne ciblée : TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API. | Ruban visuel continu alimenté par `SITE.skills`. |
./docs/specs/spec-home-awwwards/sections-mapping.md:56:  `TypeScript · Nuxt 4 · Vue.js · NestJS · Node.js · PostgreSQL · TypeORM · Stripe Connect · Cypress · Docker · REST API · Vitest`
./docs/specs/spec-home-awwwards/sections-mapping.md:68:   - *Technologies :* Tests E2E Cypress, CI/CD, audits, optimisations.
./docs/specs/spec-home-awwwards/SPEC.md:40:  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
./docs/design_system/ui_kits/jouan-site/data.js:51:    { date: "02/2021 — aujourd'hui", org: "Linkizz", role: "Testeur QA", desc: "Tests automatisés — Node.js, TypeScript, TestCafé." },
./app/components/terminal/programs/About.ts:77:      technology: "nodejs Typesript Testcafé",
./docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1831:    desc: "Tests automatisés — Node.js, TypeScript, TestCafé."
./app/components/home/HomeStackMarquee.vue:39:  testcafe: "TestCafé",
./docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:26:   **And** `SITE.skills` reflète la stack moderne ordonnée : `["typescript", "nuxt", "vue", "nest.js", "node.js", "postgresql", "typeorm", "stripe", "cypress", "docker", "rest-api", "vitest"]` sans dispersion WordPress/PHP en premier plan
./docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:121:   - Stack ordonnée moderne : TypeScript, Nuxt, Vue, NestJS, Node.js, PostgreSQL, TypeORM, Stripe, Cypress, Docker, REST API, Vitest.
./docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:45:       - Points livrables clés avec icône de validation : Audits techniques de code & migrations de versions, Tests E2E Cypress & tests unitaires Vitest, Pipelines CI/CD & conteneurisation Docker.
./docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:46:       - Tags technologiques : `Cypress`, `Vitest`, `Docker`, `CI/CD`.
./docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:62:  - [x] Consommer les compétences directement depuis `SITE.skills` (`app/data/site.ts`) et formater les libellés de stack pour l'affichage (ex. TypeScript, Nuxt 4, Vue.js, NestJS, Node.js, PostgreSQL, TypeORM, Stripe Connect, Cypress, Docker, REST API, Vitest).
./docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:112:  - Dérivés de `SITE.skills` : `TypeScript`, `Nuxt 4`, `Vue.js`, `NestJS`, `Node.js`, `PostgreSQL`, `TypeORM`, `Stripe Connect`, `Cypress`, `Docker`, `REST API`, `Vitest`.
./docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:125:     - Points : `Audits techniques de code & migrations de versions`, `Tests E2E Cypress & tests unitaires Vitest`, `Pipelines CI/CD & conteneurisation Docker`.
./docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md:126:     - Tags : `Cypress`, `Vitest`, `Docker`, `CI/CD`.
./docs/implementation-artifacts/5-2-timeline-formation-et-stack.md:92:  - `02/2021 — aujourd'hui` · **Testeur QA** · Linkizz · « Tests automatisés — Node.js, TypeScript, TestCafé. »
./docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md:94:- **Pas de framework de test non installé :** Le projet n'embarque pas Vitest ou Cypress dans ses dépendances actuelles. La barre de conformité logicielle s'appuie sur ESLint, Stylelint, vue-tsc, le prerender Nitro 13 routes et l'audit émulé OS-level.
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:80:       - Points livrables clés avec icône de validation : Audits techniques de code & migrations de versions, Tests E2E Cypress & tests unitaires Vitest, Pipelines CI/CD & conteneurisation Docker.
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:81:       - Tags technologiques : `Cypress`, `Vitest`, `Docker`, `CI/CD`.
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:97:  - [x] Consommer les compétences directement depuis `SITE.skills` (`app/data/site.ts`) et formater les libellés de stack pour l'affichage (ex. TypeScript, Nuxt 4, Vue.js, NestJS, Node.js, PostgreSQL, TypeORM, Stripe Connect, Cypress, Docker, REST API, Vitest).
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:138:  - Dérivés de `SITE.skills` : `TypeScript`, `Nuxt 4`, `Vue.js`, `NestJS`, `Node.js`, `PostgreSQL`, `TypeORM`, `Stripe Connect`, `Cypress`, `Docker`, `REST API`, `Vitest`.
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:151:     - Points : `Audits techniques de code & migrations de versions`, `Tests E2E Cypress & tests unitaires Vitest`, `Pipelines CI/CD & conteneurisation Docker`.
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:152:     - Tags : `Cypress`, `Vitest`, `Docker`, `CI/CD`.
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:665:  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:757:+  cypress: "Cypress",
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:936:+      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:939:+    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:1290:       - Points livrables clés avec icône de validation : Audits techniques de code & migrations de versions, Tests E2E Cypress & tests unitaires Vitest, Pipelines CI/CD & conteneurisation Docker.
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:1291:       - Tags technologiques : `Cypress`, `Vitest`, `Docker`, `CI/CD`.
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:1307:  - [x] Consommer les compétences directement depuis `SITE.skills` (`app/data/site.ts`) et formater les libellés de stack pour l'affichage (ex. TypeScript, Nuxt 4, Vue.js, NestJS, Node.js, PostgreSQL, TypeORM, Stripe Connect, Cypress, Docker, REST API, Vitest).
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:1348:  - Dérivés de `SITE.skills` : `TypeScript`, `Nuxt 4`, `Vue.js`, `NestJS`, `Node.js`, `PostgreSQL`, `TypeORM`, `Stripe Connect`, `Cypress`, `Docker`, `REST API`, `Vitest`.
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:1361:     - Points : `Audits techniques de code & migrations de versions`, `Tests E2E Cypress & tests unitaires Vitest`, `Pipelines CI/CD & conteneurisation Docker`.
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:1362:     - Tags : `Cypress`, `Vitest`, `Docker`, `CI/CD`.
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:1547:40:  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:1695:751-**Given** la stack moderne définie dans `SITE.skills` (TypeScript, Nuxt 4, Vue.js, NestJS, Node.js, PostgreSQL, TypeORM, Stripe Connect, Cypress, Docker, REST API, Vitest)
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:1744:+  cypress: "Cypress",
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:1923:+      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:1926:+    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:2059:  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:2141:40:  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:2438:  "cypress",
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:2752:      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:2755:    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:3493:docs/planning-artifacts/epics.md-751-**Given** la stack moderne définie dans `SITE.skills` (TypeScript, Nuxt 4, Vue.js, NestJS, Node.js, PostgreSQL, TypeORM, Stripe Connect, Cypress, Docker, REST API, Vitest)
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:3512:50-  "cypress",
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:3712:**Given** la stack moderne définie dans `SITE.skills` (TypeScript, Nuxt 4, Vue.js, NestJS, Node.js, PostgreSQL, TypeORM, Stripe Connect, Cypress, Docker, REST API, Vitest)
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:4055:   220	+      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:4058:   223	+    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-3/raw-acceptance-auditor.md:4141:    41	+  cypress: "Cypress",
./docs/implementation-artifacts/code-reviews/11-2/raw-acceptance-auditor.md:472:docs/specs/spec-home-awwwards/SPEC.md-40-  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
./docs/implementation-artifacts/code-reviews/11-2/raw-acceptance-auditor.md:686:  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
./docs/implementation-artifacts/code-reviews/11-2/raw-acceptance-auditor.md:1060:  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
./docs/implementation-artifacts/code-reviews/11-2/raw-acceptance-auditor.md:1177:**Given** la stack moderne définie dans `SITE.skills` (TypeScript, Nuxt 4, Vue.js, NestJS, Node.js, PostgreSQL, TypeORM, Stripe Connect, Cypress, Docker, REST API, Vitest)
./docs/implementation-artifacts/code-reviews/11-2/raw-acceptance-auditor.md:6004:  "cypress",
./docs/implementation-artifacts/code-reviews/11-2/raw-acceptance-auditor.md:6473:16-| **Marquee Stack** | Défilé continu des technologies prioritaires | Stack moderne ciblée : TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API. | Ruban visuel continu alimenté par `SITE.skills`. |
./docs/implementation-artifacts/code-reviews/11-2/raw-acceptance-auditor.md:6513:56-  `TypeScript · Nuxt 4 · Vue.js · NestJS · Node.js · PostgreSQL · TypeORM · Stripe Connect · Cypress · Docker · REST API · Vitest`
./docs/implementation-artifacts/code-reviews/11-3/full.diff:41:+  cypress: "Cypress",
./docs/implementation-artifacts/code-reviews/11-3/full.diff:220:+      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-3/full.diff:223:+    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/10-7/raw-acceptance-auditor.md:2899:./docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:683:/bin/zsh -lc "git status --short && rg --files | rg '(test|spec|playwright|cypress|vitest|package.json|10-2)' | head -200" in /Users/simon/dev/jouan.ovh
./docs/implementation-artifacts/code-reviews/11-2/raw-blind-hunter.md:1400:  "cypress",
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:116:+  cypress: "Cypress",
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:295:+      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:298:+    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:486:docs/planning-artifacts/epics.md:751:**Given** la stack moderne définie dans `SITE.skills` (TypeScript, Nuxt 4, Vue.js, NestJS, Node.js, PostgreSQL, TypeORM, Stripe Connect, Cypress, Docker, REST API, Vitest)
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:512:docs/specs/spec-home-awwwards/sections-mapping.md:16:| **Marquee Stack** | Défilé continu des technologies prioritaires | Stack moderne ciblée : TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API. | Ruban visuel continu alimenté par `SITE.skills`. |
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:539:docs/specs/spec-home-awwwards/SPEC.md:40:  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:588:docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:26:   **And** `SITE.skills` reflète la stack moderne ordonnée : `["typescript", "nuxt", "vue", "nest.js", "node.js", "postgresql", "typeorm", "stripe", "cypress", "docker", "rest-api", "vitest"]` sans dispersion WordPress/PHP en premier plan
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:703:       - Points livrables clés avec icône de validation : Audits techniques de code & migrations de versions, Tests E2E Cypress & tests unitaires Vitest, Pipelines CI/CD & conteneurisation Docker.
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:704:       - Tags technologiques : `Cypress`, `Vitest`, `Docker`, `CI/CD`.
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:720:  - [x] Consommer les compétences directement depuis `SITE.skills` (`app/data/site.ts`) et formater les libellés de stack pour l'affichage (ex. TypeScript, Nuxt 4, Vue.js, NestJS, Node.js, PostgreSQL, TypeORM, Stripe Connect, Cypress, Docker, REST API, Vitest).
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:761:  - Dérivés de `SITE.skills` : `TypeScript`, `Nuxt 4`, `Vue.js`, `NestJS`, `Node.js`, `PostgreSQL`, `TypeORM`, `Stripe Connect`, `Cypress`, `Docker`, `REST API`, `Vitest`.
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:774:     - Points : `Audits techniques de code & migrations de versions`, `Tests E2E Cypress & tests unitaires Vitest`, `Pipelines CI/CD & conteneurisation Docker`.
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:775:     - Tags : `Cypress`, `Vitest`, `Docker`, `CI/CD`.
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:853:  "cypress",
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:1065:      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:1068:    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:2370:       - Points livrables clés avec icône de validation : Audits techniques de code & migrations de versions, Tests E2E Cypress & tests unitaires Vitest, Pipelines CI/CD & conteneurisation Docker.
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:2371:       - Tags technologiques : `Cypress`, `Vitest`, `Docker`, `CI/CD`.
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:2387:  - [x] Consommer les compétences directement depuis `SITE.skills` (`app/data/site.ts`) et formater les libellés de stack pour l'affichage (ex. TypeScript, Nuxt 4, Vue.js, NestJS, Node.js, PostgreSQL, TypeORM, Stripe Connect, Cypress, Docker, REST API, Vitest).
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:2428:  - Dérivés de `SITE.skills` : `TypeScript`, `Nuxt 4`, `Vue.js`, `NestJS`, `Node.js`, `PostgreSQL`, `TypeORM`, `Stripe Connect`, `Cypress`, `Docker`, `REST API`, `Vitest`.
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:2441:     - Points : `Audits techniques de code & migrations de versions`, `Tests E2E Cypress & tests unitaires Vitest`, `Pipelines CI/CD & conteneurisation Docker`.
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:2442:     - Tags : `Cypress`, `Vitest`, `Docker`, `CI/CD`.
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:2627:+  cypress: "Cypress",
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:2793:+  cypress: "Cypress",
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:2949:  `TypeScript · Nuxt 4 · Vue.js · NestJS · Node.js · PostgreSQL · TypeORM · Stripe Connect · Cypress · Docker · REST API · Vitest`
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:2961:   - *Technologies :* Tests E2E Cypress, CI/CD, audits, optimisations.
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:3199:/bin/zsh -lc "printf '%s\\n' '--- package scripts ---' && node -e 'const p=require(\"./package.json\"); console.log(JSON.stringify(p.scripts,null,2))' 2>/dev/null || sed -n '1,180p' package.json && printf '%s\\n' '--- test/config files ---' && rg --files | rg '("'^|/)(test|tests|e2e|playwright|cypress|vitest|jest|.*spec'"\\.)' | head -100 && printf '%s\\n' '--- git metadata for diff ---' && git status --short && git diff --stat -- docs/implementation-artifacts/code-reviews/11-3/full.diff" in /Users/simon/dev/jouan.ovh
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:3291:352:+      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:3292:355:+    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:3318:629:      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:3319:632:    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:3421:1922:   220	+      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-3/raw-blind-hunter.md:3422:1925:   223	+    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:1288:-  cypress: "Cypress",
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:1289:+  testcafe: "TestCafé",
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:1710:-  "cypress",
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:1711:+  "testcafe",
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:1799:-      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:1800:+      "Tests E2E TestCafé & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:1803:-    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:1804:+    tags: ["TestCafé", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:3657:-      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:3658:+      "Tests E2E TestCafé & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:3661:-    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:3662:+    tags: ["TestCafé", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:4412:-  cypress: "Cypress",
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:4413:+  testcafe: "TestCafé",
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:4836:-  "cypress",
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:4837:+  "testcafe",
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:4927:-      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:4928:+      "Tests E2E TestCafé & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:4931:-    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:4932:+    tags: ["TestCafé", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:5655:-  "cypress",
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:5656:+  "testcafe",
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:5744:-      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:5745:+      "Tests E2E TestCafé & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:5748:-    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:5749:+    tags: ["TestCafé", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:8331:-  "cypress",
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:8332:+  "testcafe",
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:8420:-      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:8421:+      "Tests E2E TestCafé & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:8424:-    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:8425:+    tags: ["TestCafé", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:802:751-**Given** la stack moderne définie dans `SITE.skills` (TypeScript, Nuxt 4, Vue.js, NestJS, Node.js, PostgreSQL, TypeORM, Stripe Connect, Cypress, Docker, REST API, Vitest)
./docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1170:  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
./docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1232:| **Marquee Stack** | Défilé continu des technologies prioritaires | Stack moderne ciblée : TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API. | Ruban visuel continu alimenté par `SITE.skills`. |
./docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1272:  `TypeScript · Nuxt 4 · Vue.js · NestJS · Node.js · PostgreSQL · TypeORM · Stripe Connect · Cypress · Docker · REST API · Vitest`
./docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:1284:   - *Technologies :* Tests E2E Cypress, CI/CD, audits, optimisations.
./docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:3235:      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:3238:    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:3820:  "cypress",
./docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:4503:| **Marquee Stack** | Défilé continu des technologies prioritaires | Stack moderne ciblée : TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API. | Ruban visuel continu alimenté par `SITE.skills`. |
./docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:4543:  `TypeScript · Nuxt 4 · Vue.js · NestJS · Node.js · PostgreSQL · TypeORM · Stripe Connect · Cypress · Docker · REST API · Vitest`
./docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:4555:   - *Technologies :* Tests E2E Cypress, CI/CD, audits, optimisations.
./docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:4625:  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
./docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:4837:    50	  "cypress",
./docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:4909:    56	  `TypeScript · Nuxt 4 · Vue.js · NestJS · Node.js · PostgreSQL · TypeORM · Stripe Connect · Cypress · Docker · REST API · Vitest`
./docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:4921:    68	   - *Technologies :* Tests E2E Cypress, CI/CD, audits, optimisations.
./docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:5537:1:<!DOCTYPE html><html  lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Simon Jouan — Développeur Full Stack TypeScript · Nuxt &amp; NestJS</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400;1,700&display=swap"><style>.ftr[data-v-ec74c766]{margin-top:auto;background:var(--surface-1);border-top:1px solid var(--border-subtle);padding:var(--space-12) 0 var(--space-8)}.ftr__container[data-v-ec74c766]{width:100%;max-width:var(--container-xl);margin:0 auto;padding:0 var(--space-6)}.ftr__in[data-v-ec74c766]{display:flex;flex-wrap:wrap;gap:var(--space-8);align-items:flex-start;justify-content:space-between}.ftr__brand-col[data-v-ec74c766]{max-width:300px}.ftr__brand[data-v-ec74c766]{display:inline-flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-3);text-decoration:none}.ftr__brand .ftr__logo[data-v-ec74c766]{font-size:22px;color:var(--accent)}.ftr__brand b[data-v-ec74c766]{font-family:var(--font-mono);font-size:var(--fs-md);font-weight:var(--fw-bold);color:var(--text-strong)}.ftr__brand[data-v-ec74c766]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-sm);box-shadow:var(--ring-accent)}.ftr__tagline[data-v-ec74c766]{margin:0;font-size:var(--fs-sm);color:var(--text-muted)}.ftr__col[data-v-ec74c766]{display:flex;flex-direction:column}.ftr__title[data-v-ec74c766]{margin:0 0 var(--space-3);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:var(--fw-regular);letter-spacing:var(--ls-wider);text-transform:uppercase;color:var(--text-muted)}.ftr__list[data-v-ec74c766]{display:flex;flex-direction:column;padding:0;margin:0;list-style:none}.ftr__link[data-v-ec74c766]{display:block;padding:var(--space-1) 0;font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-body);text-decoration:none;transition:color var(--dur-fast) var(--ease-standard)}.ftr__link[data-v-ec74c766]:hover{color:var(--accent)}.ftr__link[data-v-ec74c766]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-xs);box-shadow:var(--ring-accent)}.ftr__link--static[data-v-ec74c766]{cursor:default}.ftr__bottom[data-v-ec74c766],.ftr__link--static[data-v-ec74c766],.ftr__link--static[data-v-ec74c766]:hover{color:var(--text-muted)}.ftr__bottom[data-v-ec74c766]{display:flex;flex-wrap:wrap;gap:var(--space-3);justify-content:space-between;margin-top:var(--space-8);padding-top:var(--space-5);font-family:var(--font-mono);font-size:var(--fs-xs);border-top:1px solid var(--border-subtle)}.ftr__cmd[data-v-ec74c766]{color:var(--term-green)}@media(prefers-reduced-motion:reduce){.ftr__link[data-v-ec74c766]{transition:none}}</style><style>.terminal{box-sizing:border-box;position:fixed;top:60px;left:15px;z-index:1000;width:600px;height:400px;overflow:hidden;resize:both;font-family:var(--font-mono);color:var(--ink-1);border:1px solid var(--border-terminal);border-radius:var(--radius-sm);box-shadow:var(--glow-terminal)}.terminal-header{position:relative;z-index:1;display:flex;flex-wrap:nowrap;align-items:center;gap:var(--space-2);height:30px;padding:0 var(--space-3);background:var(--aubergine-black);cursor:move}.terminal-header .terminal-dots{display:flex;align-items:center;gap:7px}.terminal-header .close-button{width:13px;height:13px;cursor:pointer;background-image:linear-gradient(to bottom right,var(--term-red),#8a0000);border-radius:var(--radius-circle);box-shadow:1px 1px 2px #080206}.terminal-header .close-button:hover{filter:brightness(1.2)}.terminal-header .close-button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.terminal-header .terminal-dot{width:13px;height:13px;border-radius:var(--radius-circle);opacity:.85}.terminal-header .terminal-dot--min{background:var(--term-yellow)}.terminal-header .terminal-dot--max{background:var(--term-green)}.terminal-header .header-text{position:absolute;inset:0;font-family:var(--font-mono);font-size:var(--fs-xs);letter-spacing:var(--ls-wide);line-height:30px;color:var(--text-muted);text-align:center;pointer-events:none}.terminal-body{height:calc(100% - 30px);margin:0;padding:var(--space-4);overflow:auto;font-size:var(--fs-sm);line-height:var(--lh-snug);white-space:pre-wrap;overflow-wrap:break-word;background:var(--bg-terminal)}.terminal-body .git-prompt,.terminal-body .git-prompt-directory,.terminal-body .git-prompt-separator{display:inline}.terminal-body .git-prompt,.terminal-body .git-prompt-directory{font-weight:var(--fw-bold)}.terminal-body .git-prompt{color:var(--prompt)}.terminal-body .git-prompt-separator{color:var(--ink-1);font-weight:var(--fw-regular)}.terminal-body .git-prompt-directory{color:var(--term-blue)}.terminal-body .user-input{margin:0;padding:0;font-family:inherit;font-size:inherit;color:inherit;background-color:transparent;border:none;outline:none;caret-color:var(--prompt);caret-shape:block}.terminal-body .terminal-response{white-space:normal}.terminal-body::-webkit-scrollbar{width:10px}.terminal-body::-webkit-scrollbar-thumb{background:var(--aubergine);border-radius:var(--radius-pill)}@supports (backdrop-filter:blur(5px)) or (-webkit-backdrop-filter:blur(5px)){.terminal .terminal-body{background:color-mix(in srgb,var(--bg-terminal) 86%,transparent);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px)}}.terminal .resize-handle{position:absolute;right:0;bottom:0;width:16px;height:16px;background-color:transparent;cursor:nwse-resize}.table,table{--color-light:#ebebeb;--color-dark:#141414;--color-grey-light:#adadad;--margin:1em;border:1px dashed var(--color-light);margin:var(--margin)}.table thead,table thead{color:var(--color-dark);text-align:center;background-color:var(--color-light)}.table td,table td{padding:0 .5em}.table tbody tr:nth-child(2n),table tbody tr:nth-child(2n){background-color:var(--color-grey-light);color:var(--color-dark)}.table.w-100,table.w-100{width:calc(100% - var(--margin)*2)}.table.w-50,table.w-50{width:calc(50% - var(--margin)*2)}</style><style>.hdr[data-v-a782489c]{position:sticky;top:0;z-index:50;height:var(--header-height);background:color-mix(in srgb,var(--surface-0) 82%,transparent);border-bottom:1px solid var(--border-subtle);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}.hdr__in[data-v-a782489c]{display:flex;align-items:center;gap:var(--space-6);width:100%;max-width:var(--container-xl);height:100%;margin:0 auto;padding:0 var(--space-6)}.hdr__brand[data-v-a782489c]{display:inline-flex;align-items:center;gap:var(--space-2);text-decoration:none}.hdr__brand .hdr__logo[data-v-a782489c]{font-size:24px;color:var(--accent)}.hdr__brand b[data-v-a782489c]{font-family:var(--font-mono);font-size:var(--fs-md);font-weight:var(--fw-bold);color:var(--text-strong)}.hdr__brand[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-sm);box-shadow:var(--ring-accent)}.hdr__nav[data-v-a782489c]{display:flex;align-items:center;gap:var(--space-1);min-width:0;margin-left:var(--space-4)}.hdr__link[data-v-a782489c]{padding:var(--space-2) var(--space-3);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-muted);text-decoration:none;border-radius:var(--radius-sm);transition:color var(--dur-fast) var(--ease-standard),background var(--dur-fast) var(--ease-standard)}.hdr__link[data-v-a782489c]:hover{color:var(--text-strong);background:var(--surface-2)}.hdr__link[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hdr__link--active[data-v-a782489c]{color:var(--accent)}.hdr__right[data-v-a782489c]{display:flex;align-items:center;gap:var(--space-3);margin-left:auto}.hdr__clock[data-v-a782489c]{font-family:var(--font-mono);font-size:var(--fs-xs);color:var(--text-muted)}.hdr__burger[data-v-a782489c]{display:none;align-items:center;justify-content:center;width:36px;height:36px;font-size:20px;color:var(--text-strong);cursor:pointer;background:none;border:1px solid var(--border-default);border-radius:var(--radius-md)}.hdr__burger[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hdr__overlay[data-v-a782489c]{position:fixed;inset:var(--header-height) 0 0;z-index:40;background:var(--overlay)}.hdr__menu[data-v-a782489c]{display:none}@media(max-width:1100px){.hdr__clock[data-v-a782489c]{display:none}}@media(max-width:1000px){.hdr__badge[data-v-a782489c]{display:none}}@media(min-width:901px){.hdr__overlay[data-v-a782489c]{display:none}}@media(max-width:900px){.hdr__badge[data-v-a782489c],.hdr__clock[data-v-a782489c],.hdr__nav[data-v-a782489c],.hdr__right .hdr__action[data-v-a782489c]{display:none}.hdr__burger[data-v-a782489c]{display:inline-flex}.hdr__menu[data-v-a782489c]{position:fixed;inset:var(--header-height) 0 auto 0;z-index:45;display:flex;flex-direction:column;gap:var(--space-1);padding:var(--space-4) var(--space-6) var(--space-6);background:var(--surface-1);border-bottom:1px solid var(--border-subtle);box-shadow:var(--shadow-3);transform:translateY(-8px);opacity:0;visibility:hidden;transition:transform var(--dur-base) var(--ease-out),opacity var(--dur-base) var(--ease-standard),visibility var(--dur-base)}.hdr__menu--open[data-v-a782489c]{transform:translateY(0);opacity:1;visibility:visible}}.hdr__menu-link[data-v-a782489c]{padding:var(--space-3);font-family:var(--font-mono);font-size:var(--fs-base);color:var(--text-body);text-decoration:none;border-radius:var(--radius-sm)}.hdr__menu-link[data-v-a782489c]:hover{color:var(--text-strong);background:var(--surface-2)}.hdr__menu-link[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hdr__menu-link--active[data-v-a782489c]{color:var(--accent)}.hdr__menu-actions[data-v-a782489c]{display:flex;flex-direction:column;gap:var(--space-2);margin-top:var(--space-3)}@media(prefers-reduced-motion:reduce){.hdr__link[data-v-a782489c],.hdr__menu[data-v-a782489c]{transition:none}}</style><style>.init[data-v-e3708db0]{background:var(--bg-page);display:flex;flex-direction:column;margin:0;min-height:100vh;width:100%;max-width:100vw}</style><style>.zicon[data-v-70d98695]{display:inline-block;flex:none;width:1em;height:1em;vertical-align:middle}</style><style>.zbadge[data-v-fc077828]{display:inline-flex;align-items:center;gap:var(--space-2);box-sizing:border-box;height:22px;padding:0 var(--space-2);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:var(--fw-medium);line-height:1;letter-spacing:var(--ls-wide);white-space:nowrap;border:1px solid transparent;border-radius:var(--radius-sm)}.zbadge__dot[data-v-fc077828]{width:6px;height:6px;background:currentcolor;border-radius:var(--radius-circle)}.zbadge--neutral[data-v-fc077828]{background:var(--surface-3);color:var(--text-body);border-color:var(--border-default)}.zbadge--accent[data-v-fc077828]{background:var(--accent-soft);color:var(--accent);border-color:#f871164d}.zbadge--success[data-v-fc077828]{background:var(--success-soft);color:var(--success);border-color:#297a4880}.zbadge--warning[data-v-fc077828]{background:var(--warning-soft);color:var(--warning);border-color:#8b611880}.zbadge--danger[data-v-fc077828]{background:var(--danger-soft);color:var(--danger);border-color:#8a282880}.zbadge--info[data-v-fc077828]{background:var(--info-soft);color:var(--info);border-color:#255b7e80}</style><style>.zbtn[data-v-c154e5b1]{--_h:36px;--_px:var(--space-4);--_fs:var(--fs-sm);display:inline-flex;align-items:center;justify-content:center;gap:var(--space-2);box-sizing:border-box;height:var(--_h);padding:0 var(--_px);font-family:var(--font-mono);font-size:var(--_fs);font-weight:var(--fw-medium);line-height:1;letter-spacing:var(--ls-wide);white-space:nowrap;text-decoration:none;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;border:1px solid transparent;border-radius:var(--radius-md);transition:background var(--dur-fast) var(--ease-standard),border-color var(--dur-fast) var(--ease-standard),color var(--dur-fast) var(--ease-standard),transform var(--dur-fast) var(--ease-standard)}.zbtn[data-v-c154e5b1]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.zbtn[data-v-c154e5b1]:disabled,.zbtn[aria-disabled=true][data-v-c154e5b1]{opacity:.45;cursor:not-allowed;pointer-events:none}.zbtn__icon[data-v-c154e5b1]{display:inline-flex;width:1.05em;height:1.05em}.zbtn__icon[data-v-c154e5b1] svg{width:100%;height:100%}.zbtn--sm[data-v-c154e5b1]{--_h:28px;--_px:var(--space-3);--_fs:var(--fs-xs)}.zbtn--lg[data-v-c154e5b1]{--_h:44px;--_px:var(--space-5);--_fs:var(--fs-base)}.zbtn--primary[data-v-c154e5b1]{background:var(--accent);color:var(--accent-text);border-color:var(--accent)}.zbtn--primary[data-v-c154e5b1]:hover{background:var(--accent-hover);border-color:var(--accent-hover)}.zbtn--primary[data-v-c154e5b1]:active{background:var(--accent-active);border-color:var(--accent-active);transform:translateY(1px)}.zbtn--secondary[data-v-c154e5b1]{background:var(--surface-2);color:var(--text-strong);border-color:var(--border-default)}.zbtn--secondary[data-v-c154e5b1]:hover{background:var(--surface-3);border-color:var(--border-strong)}.zbtn--secondary[data-v-c154e5b1]:active{transform:translateY(1px)}.zbtn--ghost[data-v-c154e5b1]{background:transparent;color:var(--text-body);border-color:transparent}.zbtn--ghost[data-v-c154e5b1]:hover{background:var(--surface-2);color:var(--text-strong)}.zbtn--terminal[data-v-c154e5b1]{background:var(--bg-terminal);color:var(--term-green);border-color:var(--accent-2-soft)}.zbtn--terminal[data-v-c154e5b1]:hover{border-color:var(--term-green);box-shadow:var(--glow-terminal)}.zbtn--danger[data-v-c154e5b1]{background:var(--danger);color:var(--ink-on-accent);border-color:var(--danger)}.zbtn--danger[data-v-c154e5b1]:hover{filter:brightness(1.08)}.zbtn--danger[data-v-c154e5b1]:active{transform:translateY(1px)}@media(prefers-reduced-motion:reduce){.zbtn[data-v-c154e5b1]{transition:none}}</style><style>.boot[data-v-f59a7d91]{position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;cursor:pointer;background:var(--surface-0);transition:opacity var(--dur-slow) var(--ease-out),visibility var(--dur-slow)}.boot.boot--done[data-v-f59a7d91]{pointer-events:none;visibility:hidden;opacity:0}.boot__in[data-v-f59a7d91]{width:min(560px,88vw);font-family:var(--font-mono);font-size:var(--fs-sm)}.boot__logo[data-v-f59a7d91]{display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-5);color:var(--text-strong)}.boot__logo b[data-v-f59a7d91]{font-size:var(--fs-lg)}.boot__logo-icon[data-v-f59a7d91]{font-size:26px;color:var(--accent)}.boot__line[data-v-f59a7d91]{min-height:1.6em;color:var(--text-muted)}.boot__ok[data-v-f59a7d91]{color:var(--term-green)}.boot__bar[data-v-f59a7d91]{height:3px;margin-top:var(--space-5);overflow:hidden;background:var(--surface-3);border-radius:var(--radius-xs)}.boot__bar i[data-v-f59a7d91]{display:block;width:0;height:100%;background:linear-gradient(90deg,var(--accent),var(--aubergine-light));transition:width .1s linear}.boot__skip[data-v-f59a7d91]{display:inline-block;margin-top:var(--space-4);padding:0;font-family:inherit;font-size:var(--fs-xs);letter-spacing:var(--ls-wide);color:var(--text-faint);cursor:pointer;background:none;border:none}.boot__skip[data-v-f59a7d91]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}@media(prefers-reduced-motion:reduce){.boot[data-v-f59a7d91]{display:none}}</style><style>.atmos[data-v-796c86c1]{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none}.aurora[data-v-796c86c1]{position:absolute;border-radius:var(--radius-circle);filter:blur(80px);mix-blend-mode:screen;will-change:transform}.aurora--orange[data-v-796c86c1]{top:-22%;left:48%;width:60vw;height:60vw;background:radial-gradient(circle at center,var(--orange-500),transparent 62%);opacity:.55;animation:drift-orange-796c86c1 26s var(--ease-in-out) infinite}.aurora--auberg[data-v-796c86c1]{top:6%;left:-22%;width:64vw;height:64vw;background:radial-gradient(circle at center,var(--aubergine-vivid),transparent 62%);opacity:.7;animation:drift-auberg-796c86c1 32s var(--ease-in-out) infinite}.aurora--red[data-v-796c86c1]{top:44%;left:26%;width:44vw;height:44vw;background:radial-gradient(circle at center,var(--term-red),transparent 64%);opacity:.4;animation:drift-red-796c86c1 30s var(--ease-in-out) infinite}.grid-dots[data-v-796c86c1]{background-image:radial-gradient(color-mix(in srgb,var(--ink-1) 6%,transparent) 1px,transparent 1px);background-size:34px 34px;-webkit-mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,var(--surface-0) 30%,transparent 78%);mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,var(--surface-0) 30%,transparent 78%)}.grid-dots[data-v-796c86c1],.scanlines[data-v-796c86c1]{position:absolute;inset:0}.scanlines[data-v-796c86c1]{opacity:.35;background:repeating-linear-gradient(0deg,color-mix(in srgb,var(--surface-0) 24%,transparent) 0 1px,transparent 1px 3px)}.vignette[data-v-796c86c1]{position:absolute;inset:0;background:radial-gradient(ellipse 120% 90% at 50% 0,transparent 55%,var(--surface-0) 100%)}@keyframes drift-orange-796c86c1{0%,to{transform:translate(0) scale(1)}50%{transform:translate(-6vw,5vh) scale(1.12)}}@keyframes drift-auberg-796c86c1{0%,to{transform:translate(0) scale(1)}50%{transform:translate(7vw,-4vh) scale(1.08)}}@keyframes drift-red-796c86c1{0%,to{transform:translate(0) scale(1)}50%{transform:translate(-4vw,-6vh) scale(1.15)}}@media(prefers-reduced-motion:reduce){.aurora[data-v-796c86c1]{animation:none}}</style><style>.cursor-dot[data-v-0096a69c],.cursor-ring[data-v-0096a69c]{position:fixed;top:0;left:0;z-index:90;border-radius:var(--radius-circle);mix-blend-mode:difference;opacity:0;pointer-events:none;transition:opacity var(--dur-base) var(--ease-standard)}.cursor-dot.is-visible[data-v-0096a69c],.cursor-ring.is-visible[data-v-0096a69c]{opacity:1}.cursor-dot[data-v-0096a69c]{width:6px;height:6px;background:var(--ink-1)}.cursor-ring[data-v-0096a69c]{width:34px;height:34px;border:1px solid color-mix(in srgb,var(--ink-1) 70%,transparent);transition:width var(--dur-base) var(--ease-out),height var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out),opacity var(--dur-base) var(--ease-standard)}.cursor-ring.is-hot[data-v-0096a69c]{width:56px;height:56px;border-color:var(--accent)}@media(hover:none),(prefers-reduced-motion:reduce){.cursor-dot[data-v-0096a69c],.cursor-ring[data-v-0096a69c]{display:none}}</style><style>.hero-term[data-v-313a6524]{display:flex;flex-direction:column;min-height:300px;overflow:hidden;border:1px solid var(--accent-2-soft);border-radius:var(--radius-sm);box-shadow:var(--glow-terminal)}.hero-term__bar[data-v-313a6524]{position:relative;display:flex;flex:none;align-items:center;gap:var(--space-2);height:30px;padding:0 var(--space-3);background:var(--aubergine-black)}.hero-term__dots[data-v-313a6524]{display:flex;align-items:center;gap:7px}.hero-term__dot[data-v-313a6524]{width:13px;height:13px;border-radius:var(--radius-circle)}.hero-term__dot--close[data-v-313a6524]{background:var(--term-red)}.hero-term__dot--min[data-v-313a6524]{background:var(--term-yellow)}.hero-term__dot--max[data-v-313a6524]{background:var(--term-green)}.hero-term__title[data-v-313a6524]{position:absolute;inset:0;font-family:var(--font-mono);font-size:var(--fs-xs);letter-spacing:var(--ls-wide);color:var(--text-muted);text-align:center;pointer-events:none}.hero-term__body[data-v-313a6524]{flex:1;min-height:0;padding:var(--space-4);overflow:auto;font-family:var(--font-mono);font-size:var(--fs-sm);line-height:var(--lh-snug);color:var(--ink-1);background:var(--bg-terminal);overflow-wrap:break-word}@supports (backdrop-filter:blur(5px)){.hero-term__body[data-v-313a6524]{background:color-mix(in srgb,var(--bg-terminal) 86%,transparent);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px)}}.hero-term__line[data-v-313a6524]{margin:0}.hero-term__out[data-v-313a6524]{margin:0 0 var(--space-4)}.hero-term__out--ink[data-v-313a6524]{color:var(--ink-1)}.hero-term__out--blue[data-v-313a6524]{color:var(--term-blue)}.hero-term__out--green[data-v-313a6524]{color:var(--term-green)}.hero-term__open[data-v-313a6524]{display:block;width:100%;padding:0;font:inherit;text-align:left;cursor:pointer;background:none;border:none;border-radius:var(--radius-xs)}.hero-term__open[data-v-313a6524]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.prm[data-v-313a6524]{font-family:var(--font-mono)}.prm__user[data-v-313a6524]{font-weight:var(--fw-bold);color:var(--prompt)}.prm__sep[data-v-313a6524]{color:var(--ink-1)}.prm__dir[data-v-313a6524]{font-weight:var(--fw-bold);color:var(--term-blue)}.prm__cmd[data-v-313a6524]{color:var(--ink-1)}.prm__caret[data-v-313a6524]{display:inline-block;width:.55em;height:1.05em;margin-left:1px;vertical-align:text-bottom;background:var(--prompt);animation:caret-blink 1s steps(1) infinite}@media(prefers-reduced-motion:reduce){.prm__caret[data-v-313a6524]{animation:none}}</style><style>.marquee[data-v-19576991]{display:block;width:100%;padding-block:var(--space-5);overflow:hidden;border-block:1px solid var(--border-subtle);-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}.marquee:hover .marquee__track[data-v-19576991]{animation-play-state:paused}.marquee__track[data-v-19576991]{display:flex;gap:var(--space-8);width:-moz-max-content;width:max-content;will-change:transform;animation:scroll-x-19576991 32s linear infinite}.marquee__item[data-v-19576991]{display:inline-flex;gap:var(--space-8);align-items:center;font-family:var(--font-mono);font-size:var(--fs-xl);letter-spacing:var(--ls-wide);color:var(--text-faint);white-space:nowrap}.marquee__label[data-v-19576991]{font-weight:var(--fw-regular);color:var(--text-body)}.marquee__star[data-v-19576991]{color:var(--accent)}@keyframes scroll-x-19576991{0%{transform:translate(0)}to{transform:translate(calc(-50% - var(--space-8)/2))}}@media(prefers-reduced-motion:reduce){.marquee[data-v-19576991]{-webkit-mask-image:none;mask-image:none}.marquee__track[data-v-19576991]{animation:none}.marquee__item--duplicate[data-v-19576991]{display:none}}</style><style>.home[data-v-80e32bdd]{display:block}.anim[data-v-80e32bdd]{animation:fade-rise var(--dur-slow) var(--ease-out) both}.hero__term-col[data-v-80e32bdd]{animation-delay:80ms}.hero[data-v-80e32bdd]{position:relative;overflow:hidden}.hero__grad[data-v-80e32bdd]{background:radial-gradient(900px 500px at 78% -10%,color-mix(in srgb,var(--accent) 16%,transparent),transparent 60%),radial-gradient(700px 500px at 0 110%,color-mix(in srgb,var(--aubergine-vivid) 28%,transparent),transparent 60%),var(--bg-page)}.hero__in[data-v-80e32bdd]{position:relative;z-index:1;padding-block:var(--space-20)}.hero__grid[data-v-80e32bdd]{display:grid;grid-template-columns:1.05fr .95fr;gap:var(--space-12);align-items:center}.hero__title[data-v-80e32bdd]{font-family:var(--font-mono);font-size:var(--fs-6xl);font-weight:var(--fw-light);letter-spacing:var(--ls-tight);color:var(--text-strong)}.hero__title em[data-v-80e32bdd]{font-style:normal;color:var(--accent)}.hero__sub[data-v-80e32bdd]{max-width:46ch;margin:var(--space-5) 0 var(--space-6);font-family:var(--font-sans);font-size:var(--fs-lg);line-height:var(--lh-relaxed);color:var(--text-body)}.hero__cta[data-v-80e32bdd]{display:flex;flex-wrap:wrap;gap:var(--space-3);margin-bottom:var(--space-6)}.hero__badge-wrap[data-v-80e32bdd]{display:inline-flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-6);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-muted)}.hero__badge-wrap a[data-v-80e32bdd]{color:var(--accent);text-decoration:underline}.hero__badge-wrap a[data-v-80e32bdd]:hover{color:var(--accent-hover)}.hero__badge-wrap a[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hero__pulse-dot[data-v-80e32bdd]{width:8px;height:8px;border-radius:var(--radius-circle);background:var(--success);box-shadow:0 0 color-mix(in srgb,var(--success) 60%,transparent);animation:pulse-dot-80e32bdd 2.2s infinite var(--ease-out)}@media(prefers-reduced-motion:reduce){.hero__pulse-dot[data-v-80e32bdd]{animation:none}}@keyframes pulse-dot-80e32bdd{0%{box-shadow:0 0 color-mix(in srgb,var(--success) 60%,transparent)}70%{box-shadow:0 0 0 6px color-mix(in srgb,var(--success) 0%,transparent)}to{box-shadow:0 0 color-mix(in srgb,var(--success) 0%,transparent)}}.section__title[data-v-80e32bdd]{margin-bottom:var(--space-8);font-family:var(--font-mono);font-size:var(--fs-3xl);font-weight:var(--fw-regular);color:var(--text-strong)}.grid-3[data-v-80e32bdd]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-5);margin:0;padding:0;list-style:none}.grid-3>li[data-v-80e32bdd],.offer[data-v-80e32bdd]{display:flex}.offer[data-v-80e32bdd]{flex-direction:column;width:100%}.offer__top[data-v-80e32bdd]{justify-content:space-between;margin-bottom:var(--space-4)}.offer__icon[data-v-80e32bdd],.offer__top[data-v-80e32bdd]{display:flex;align-items:center}.offer__icon[data-v-80e32bdd]{justify-content:center;width:var(--space-10);height:var(--space-10);font-size:22px;color:var(--accent);background:var(--accent-soft);border-radius:var(--radius-md)}.offer__no[data-v-80e32bdd]{font-size:var(--fs-xs);letter-spacing:var(--ls-wider);color:var(--text-faint)}.offer__no[data-v-80e32bdd],.offer__title[data-v-80e32bdd]{font-family:var(--font-mono)}.offer__title[data-v-80e32bdd]{margin-bottom:var(--space-2);font-size:var(--fs-xl);font-weight:var(--fw-regular);color:var(--text-strong)}.offer__desc[data-v-80e32bdd]{margin:0 0 var(--space-4);font-family:var(--font-sans);font-size:var(--fs-sm);line-height:var(--lh-relaxed);color:var(--text-body)}.offer__points[data-v-80e32bdd]{display:flex;flex-direction:column;gap:var(--space-2);margin:0 0 var(--space-4);padding:0;list-style:none}.offer__points li[data-v-80e32bdd]{display:flex;gap:var(--space-2);align-items:flex-start;font-family:var(--font-mono);font-size:var(--fs-xs);line-height:var(--lh-normal);color:var(--text-muted)}.offer__check[data-v-80e32bdd]{flex-shrink:0;margin-top:calc(var(--space-1)/2);font-size:var(--fs-sm);color:var(--term-green)}.offer__tags[data-v-80e32bdd]{margin-bottom:var(--space-4)}.offer__price[data-v-80e32bdd]{margin-top:auto;padding-top:var(--space-4);border-top:1px dashed var(--border-subtle);font-size:var(--fs-xs)}.offer__more[data-v-80e32bdd],.offer__price[data-v-80e32bdd]{font-family:var(--font-mono);color:var(--accent)}.offer__more[data-v-80e32bdd]{margin-top:var(--space-3);font-size:var(--fs-sm);text-decoration:none}.offer__more[data-v-80e32bdd]:hover{text-decoration:underline}.offer__more[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent);border-radius:var(--radius-xs)}.work[data-v-80e32bdd]{display:flex;flex-direction:column;margin:0;padding:0;list-style:none}.work>li[data-v-80e32bdd]{display:block;width:100%}.work__row[data-v-80e32bdd]{position:relative;display:grid;grid-template-columns:56px 1fr auto;gap:var(--space-6);align-items:center;padding:var(--space-8) var(--space-3);border-top:1px solid var(--border-subtle);text-decoration:none;color:inherit;transition:padding-left var(--dur-slow) var(--ease-out),background var(--dur-slow) var(--ease-standard)}.work__row[data-v-80e32bdd]:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,var(--accent-soft),transparent 60%);opacity:0;transition:opacity var(--dur-slow) var(--ease-standard)}li:last-child .work__row[data-v-80e32bdd]{border-bottom:1px solid var(--border-subtle)}.work__row--link[data-v-80e32bdd]{cursor:pointer}.work__row--link[data-v-80e32bdd]:hover{padding-left:var(--space-6)}.work__row--link[data-v-80e32bdd]:hover:before{opacity:1}.work__row--link:hover .work__name[data-v-80e32bdd]{color:var(--accent)}.work__row--link:hover .work__go[data-v-80e32bdd]{color:var(--accent);transform:translate(6px,-6px)}.work__row--link[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent);border-radius:var(--radius-xs)}.work__no[data-v-80e32bdd]{font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-faint)}.work__main[data-v-80e32bdd],.work__no[data-v-80e32bdd]{position:relative}.work__topline[data-v-80e32bdd]{display:flex;flex-wrap:wrap;align-items:baseline;gap:var(--space-3)}.work__name[data-v-80e32bdd]{margin:0;font-family:var(--font-mono);font-size:clamp(1.4rem,2.8vw,2rem);font-weight:var(--fw-regular);letter-spacing:var(--ls-tight);color:var(--text-strong);transition:color var(--dur-base) var(--ease-standard)}.work__status[data-v-80e32bdd]{color:var(--accent);letter-spacing:var(--ls-wide)}.work__role[data-v-80e32bdd],.work__status[data-v-80e32bdd]{font-family:var(--font-mono);font-size:var(--fs-xs)}.work__role[data-v-80e32bdd]{margin:var(--space-1) 0 0;color:var(--text-muted)}.work__desc[data-v-80e32bdd]{max-width:65ch;margin:var(--space-3) 0 0;font-size:var(--fs-sm)}.work__tags[data-v-80e32bdd]{margin-top:var(--space-4)}.work__go[data-v-80e32bdd]{position:relative;font-size:var(--fs-xl);color:var(--text-faint);transition:transform var(--dur-base) var(--ease-out),color var(--dur-base) var(--ease-standard)}.stats[data-v-80e32bdd]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin:var(--space-12) 0 0;padding:0;list-style:none}.stat[data-v-80e32bdd]{padding:var(--space-6);background:color-mix(in srgb,var(--surface-1) 70%,transparent);border:1px solid var(--border-subtle);border-radius:var(--radius-md)}.stat b[data-v-80e32bdd]{display:block;margin-bottom:var(--space-1);font-size:var(--fs-5xl);font-weight:var(--fw-light);line-height:1;letter-spacing:var(--ls-tight);color:var(--text-strong)}.stat b[data-v-80e32bdd],.stat span[data-v-80e32bdd]{font-family:var(--font-mono)}.stat span[data-v-80e32bdd]{font-size:var(--fs-sm);letter-spacing:var(--ls-wide);color:var(--text-muted)}.block__head--row[data-v-80e32bdd]{display:flex;align-items:flex-end;justify-content:space-between;gap:var(--space-6);margin-bottom:var(--space-8)}.block__head--row .section__title[data-v-80e32bdd]{margin-bottom:0}.seeall[data-v-80e32bdd]{display:inline-flex;flex:none;align-items:center;gap:var(--space-2);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-muted);text-decoration:none;white-space:nowrap;transition:color var(--dur-base) var(--ease-standard)}.seeall[data-v-80e32bdd]:hover{color:var(--accent)}.seeall[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent);border-radius:var(--radius-xs)}.seeall__icon[data-v-80e32bdd]{font-size:var(--fs-base)}.journal[data-v-80e32bdd]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-5);margin:0;padding:0;list-style:none}.journal>li[data-v-80e32bdd],.jpost[data-v-80e32bdd]{display:flex}.jpost[data-v-80e32bdd]{flex-direction:column;width:100%;color:inherit;text-decoration:none}.jpost:hover .jpost__title[data-v-80e32bdd]{color:var(--accent)}.jpost:hover .jpost__arrow[data-v-80e32bdd]{color:var(--accent);transform:translate(4px,-4px)}.jpost__thumb[data-v-80e32bdd]{width:100%;height:160px;-o-object-fit:cover;object-fit:cover;border-bottom:1px solid var(--border-subtle)}.jpost__body[data-v-80e32bdd]{display:flex;flex:1;flex-direction:column;padding:var(--space-5)}.jpost__tags[data-v-80e32bdd]{margin-bottom:var(--space-3)}.jpost__title[data-v-80e32bdd]{margin:0 0 var(--space-2);font-family:var(--font-mono);font-size:var(--fs-lg);font-weight:var(--fw-regular);line-height:var(--lh-snug);color:var(--text-strong);transition:color var(--dur-base) var(--ease-standard)}.jpost__desc[data-v-80e32bdd]{margin:0 0 var(--space-4);font-size:var(--fs-sm);color:var(--text-muted)}.jpost__meta[data-v-80e32bdd]{display:flex;align-items:center;gap:var(--space-2);margin-top:auto;padding-top:var(--space-4);border-top:1px dashed var(--border-subtle);font-family:var(--font-mono);font-size:var(--fs-xs);color:var(--text-faint)}.jpost__arrow[data-v-80e32bdd]{margin-left:auto;font-size:var(--fs-base);color:var(--text-faint);transition:transform var(--dur-base) var(--ease-out),color var(--dur-base) var(--ease-standard)}.journal__empty[data-v-80e32bdd]{max-width:60ch;margin:0 auto;text-align:center}.journal__empty-code[data-v-80e32bdd]{margin:0 0 var(--space-2);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--accent)}.journal__empty-text[data-v-80e32bdd]{margin:0 0 var(--space-5);font-family:var(--font-sans);font-size:var(--fs-sm);line-height:var(--lh-relaxed);color:var(--text-muted)}.cta[data-v-80e32bdd]{position:relative;padding:clamp(48px,6vw,72px) var(--space-6);overflow:hidden;text-align:center;background:radial-gradient(ellipse 80% 120% at 50% 0,var(--accent-2-soft),transparent 70%),color-mix(in srgb,var(--surface-2) 60%,transparent);border:1px solid var(--border-subtle);border-radius:var(--radius-lg)}.cta__eyebrow[data-v-80e32bdd]{display:inline-block}.cta__title[data-v-80e32bdd]{margin:0 0 var(--space-4);font-family:var(--font-mono);font-size:clamp(1.8rem,4vw,2.8rem);font-weight:var(--fw-light);line-height:var(--lh-tight);letter-spacing:var(--ls-tight);color:var(--text-strong)}.cta__highlight[data-v-80e32bdd]{font-style:italic;color:var(--accent)}.cta__subtitle[data-v-80e32bdd]{max-width:58ch;margin:0 auto var(--space-8);font-family:var(--font-sans);font-size:var(--fs-base);line-height:var(--lh-relaxed);color:var(--text-muted)}.cta__actions[data-v-80e32bdd]{display:flex;flex-wrap:wrap;gap:var(--space-4);justify-content:center}@media(max-width:900px){.hero__grid[data-v-80e32bdd]{grid-template-columns:1fr}.hero__title[data-v-80e32bdd]{font-size:var(--fs-4xl)}.grid-3[data-v-80e32bdd],.journal[data-v-80e32bdd]{grid-template-columns:1fr}.block__head--row[data-v-80e32bdd]{flex-direction:column;align-items:flex-start}}@media(max-width:680px){.work__row[data-v-80e32bdd]{grid-template-columns:1fr;gap:var(--space-3)}.work__go[data-v-80e32bdd],.work__no[data-v-80e32bdd]{display:none}.stats[data-v-80e32bdd]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.anim[data-v-80e32bdd]{animation:none}.jpost__arrow[data-v-80e32bdd],.work__go[data-v-80e32bdd],.work__row[data-v-80e32bdd]{transition:none}.work__row--link[data-v-80e32bdd]:hover{padding-left:var(--space-3)}.work__row--link:hover .work__go[data-v-80e32bdd]{transform:none}}</style><style>.hexrow[data-v-a86d2094]{display:flex;gap:var(--space-5);margin:0;padding:0;list-style:none}</style><style>.hex[data-v-274e53e2]{display:inline-flex;align-items:center;justify-content:center;width:46px;height:53px;font-size:20px;color:var(--text-muted);cursor:pointer;background:var(--surface-2);clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);transition:color var(--dur-base) var(--ease-standard),background var(--dur-base) var(--ease-standard)}.hex[data-v-274e53e2]:hover{color:var(--ink-on-accent);background:var(--accent)}.hex[data-v-274e53e2]:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.hex__label[data-v-274e53e2]{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;white-space:nowrap;border:0;clip-path:inset(50%)}@media(prefers-reduced-motion:reduce){.hex[data-v-274e53e2]{transition:none}}</style><style>.zcard[data-v-c5ec7be1]{position:relative;overflow:hidden;background:var(--bg-card);color:var(--text-body);border:1px solid var(--border-subtle);border-radius:var(--radius-md);box-shadow:var(--shadow-2),var(--shadow-hairline);transition:border-color var(--dur-base) var(--ease-standard),transform var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-standard)}.zcard--pad[data-v-c5ec7be1]{padding:var(--space-6)}.zcard--interactive[data-v-c5ec7be1]{cursor:pointer}.zcard--interactive[data-v-c5ec7be1]:hover{border-color:var(--border-strong);transform:translateY(-2px);box-shadow:var(--shadow-3),var(--shadow-hairline)}.zcard--interactive[data-v-c5ec7be1]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.zcard--accent[data-v-c5ec7be1]:before{content:"";position:absolute;inset:0 0 auto;height:2px;background:linear-gradient(90deg,var(--accent),var(--aubergine-light))}.zcard--featured[data-v-c5ec7be1]{border-color:var(--accent-ring);box-shadow:var(--glow-accent),var(--shadow-hairline)}@media(prefers-reduced-motion:reduce){.zcard[data-v-c5ec7be1]{transition:none}.zcard--interactive[data-v-c5ec7be1]:hover{transform:none}}</style><style>.ztag[data-v-6db1c85c]{display:inline-flex;align-items:center;gap:var(--space-2);box-sizing:border-box;height:26px;padding:0 var(--space-3);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:var(--fw-regular);line-height:1;white-space:nowrap;color:var(--text-body);background:var(--surface-2);border:1px solid var(--border-subtle);border-radius:var(--radius-pill);transition:border-color var(--dur-fast) var(--ease-standard),color var(--dur-fast) var(--ease-standard)}.ztag[data-v-6db1c85c]:before{content:"#";color:var(--accent)}.ztag--plain[data-v-6db1c85c]:before{display:none;content:none}.ztag--clickable[data-v-6db1c85c]{cursor:pointer}.ztag--clickable[data-v-6db1c85c]:hover{border-color:var(--border-strong);color:var(--text-strong)}.ztag--clickable[data-v-6db1c85c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.ztag__remove[data-v-6db1c85c]{display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;margin-right:-2px;padding:0;font-family:var(--font-mono);font-size:var(--fs-sm);line-height:1;color:var(--text-muted);cursor:pointer;background:none;border:none;border-radius:var(--radius-circle)}.ztag__remove[data-v-6db1c85c]:hover{color:var(--term-red)}.ztag__remove[data-v-6db1c85c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}@media(prefers-reduced-motion:reduce){.ztag[data-v-6db1c85c]{transition:none}}</style><link rel="stylesheet" href="/_nuxt/entry.QaoIl47T.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZButton.CyAD_ftR.css" crossorigin><link rel="stylesheet" href="/_nuxt/LinkListComponent.BRYW5MSq.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZBadge.BAw1B01J.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZTag.f2Aq6DLg.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZCard.C5C9a-aj.css" crossorigin><link rel="modulepreload" as="script" crossorigin href="/_nuxt/kT-s8AA-.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/94XchtD0.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CZy76wlf.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/DlAUqK2U.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CDaHTzsF.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/DMhLy-fw.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CMQEDqfi.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/OpxrMEpG.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/C93KKm9n.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/1LEPDT53.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/ZsGxQ2mD.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/p0temu7u.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/BGMjmYXP.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CXmFvnQY.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/DvmfV0_A.js"><script type="module" src="/_nuxt/kT-s8AA-.js" crossorigin></script><meta name="description" content="Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL."><link rel="icon" type="image/x-icon" href="/favicon.ico"><script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","@id":"https://jouan.ovh/#organization","name":"Simon Jouan","url":"https://jouan.ovh","logo":"https://jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Rouen, France","addressCountry":"FR"}}</script><link rel="canonical" href="https://jouan.ovh"><script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"Simon Jouan — Développeur Full Stack TypeScript","url":"https://jouan.ovh","description":"Développeur Full Stack TypeScript — Nuxt / NestJS"}</script><script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Simon Jouan","jobTitle":"Développeur Full Stack TypeScript — Nuxt / NestJS","url":"https://jouan.ovh","image":"https://jouan.ovh/images/portrait.jpeg","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Rouen, France","addressCountry":"FR"}}</script><meta property="og:title" content="Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS"><meta property="og:description" content="Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL."><meta property="og:url" content="https://jouan.ovh"><meta property="og:type" content="website"><meta property="og:image" content="https://jouan.ovh/images/portrait.jpeg"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS"><meta name="twitter:description" content="Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL."><meta name="twitter:image" content="https://jouan.ovh/images/portrait.jpeg"></head><body><div id="__nuxt"><div class="init" data-v-e3708db0><header class="hdr" data-v-e3708db0 data-v-a782489c><div class="hdr__in" data-v-a782489c><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__brand" data-v-a782489c><svg class="zicon hdr__logo" viewbox="0 0 24 24" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><path d="M12 1.5 22.5 12 12 22.5 1.5 12z" fill="currentColor"/><path d="M12 1.5 22.5 12 12 12z" fill="#fff" fill-opacity="0.12"/></svg><b data-v-a782489c>jouan.ovh</b></a><nav class="hdr__nav" aria-label="Navigation principale" data-v-a782489c><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__link hdr__link--active" data-v-a782489c>Accueil</a><a href="/services" class="hdr__link" data-v-a782489c>Services</a><a href="/about" class="hdr__link" data-v-a782489c>À propos</a><a href="/blog" class="hdr__link" data-v-a782489c>Blog</a><a href="/contact" class="hdr__link" data-v-a782489c>Contact</a><!--]--></nav><div class="hdr__right" data-v-a782489c><div class="current-time hdr__clock" data-v-a782489c data-v-1e5503b4></div><span class="zbadge zbadge--success hdr__badge" data-v-a782489c data-v-fc077828><span class="zbadge__dot" aria-hidden="true" data-v-fc077828></span><!--[-->Disponible<!--]--></span><button class="hdr__action zbtn zbtn--terminal zbtn--sm" type="button" data-v-a782489c data-v-c154e5b1><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg><!--]--></span><!--[--> Terminal <!--]--><!----></button><a href="/contact" class="hdr__action zbtn zbtn--primary zbtn--sm" data-v-a782489c data-v-c154e5b1><!----><!--[--> Démarrer un projet <!--]--><!----></a><button class="hdr__burger" type="button" aria-expanded="false" aria-controls="hdr-mobile-menu" aria-label="Ouvrir le menu" data-v-a782489c><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg></button></div></div><!----><nav id="hdr-mobile-menu" class="hdr__menu" aria-label="Navigation mobile" data-v-a782489c><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__menu-link hdr__menu-link--active" data-v-a782489c>Accueil</a><a href="/services" class="hdr__menu-link" data-v-a782489c>Services</a><a href="/about" class="hdr__menu-link" data-v-a782489c>À propos</a><a href="/blog" class="hdr__menu-link" data-v-a782489c>Blog</a><a href="/contact" class="hdr__menu-link" data-v-a782489c>Contact</a><!--]--><div class="hdr__menu-actions" data-v-a782489c><button class="zbtn zbtn--terminal zbtn--sm" type="button" data-v-a782489c data-v-c154e5b1><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg><!--]--></span><!--[--> Terminal <!--]--><!----></button><a href="/contact" class="zbtn zbtn--primary zbtn--sm" data-v-a782489c data-v-c154e5b1><!----><!--[--> Démarrer un projet <!--]--><!----></a></div></nav><div data-v-a782489c><!--[--><!--]--></div></header><!--[--><main class="home" data-v-80e32bdd><span data-v-80e32bdd></span><div class="atmos" aria-hidden="true" data-v-80e32bdd data-v-796c86c1><div class="aurora aurora--auberg" data-v-796c86c1></div><div class="aurora aurora--orange" data-v-796c86c1></div><div class="aurora aurora--red" data-v-796c86c1></div><div class="grid-dots" data-v-796c86c1></div><div class="scanlines" data-v-796c86c1></div><div class="vignette" data-v-796c86c1></div></div><!----><section class="hero hero__grad" data-v-80e32bdd><div class="hero__in container" data-v-80e32bdd><div class="hero__grid" data-v-80e32bdd><div class="anim hero__text" data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p><h1 class="hero__title" data-v-80e32bdd>Développeur Full Stack TypeScript</h1><p class="hero__sub" data-v-80e32bdd> Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l&#39;architecture au déploiement, j&#39;interviens sur des produits neufs comme sur des applications existantes. </p><div class="hero__badge-wrap" data-v-80e32bdd><span class="hero__pulse-dot" aria-hidden="true" data-v-80e32bdd></span><span data-v-80e32bdd>Disponible pour missions freelance</span><!--[--><span aria-hidden="true" data-v-80e32bdd> · </span><a href="https://www.malt.fr/profile/simonjouan" rel="noopener" target="_blank" data-v-80e32bdd><!--[--> Profil Malt vérifié <!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a><!--]--></div><div class="hero__cta" data-v-80e32bdd><a href="/contact" class="zbtn zbtn--primary zbtn--lg" data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Discuter de votre projet <!--]--><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg><!--]--></span></a><a href="/about" class="zbtn zbtn--secondary zbtn--lg" data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Voir le parcours &amp; CV <!--]--><!----></a></div></div><div class="anim hero__term-col" data-v-80e32bdd><div class="hero-term" data-v-80e32bdd data-v-313a6524><div class="hero-term__bar" data-v-313a6524><span class="hero-term__dots" aria-hidden="true" data-v-313a6524><span class="hero-term__dot hero-term__dot--close" data-v-313a6524></span><span class="hero-term__dot hero-term__dot--min" data-v-313a6524></span><span class="hero-term__dot hero-term__dot--max" data-v-313a6524></span></span><span class="hero-term__title" data-v-313a6524>anon.@jouan.ovh: ~</span></div><div class="hero-term__body" data-v-313a6524><!--[--><!--]--><!----><!----><noscript data-v-313a6524><div data-v-313a6524><!--[--><!--[--><p class="hero-term__line" data-v-313a6524><span class="prm" data-v-313a6524><span class="prm__user" data-v-313a6524>anon.@jouan.ovh</span><span class="prm__sep" data-v-313a6524>:</span><span class="prm__dir" data-v-313a6524>~</span><span class="prm__sep" data-v-313a6524>$ </span><span class="prm__cmd" data-v-313a6524>whoami</span></span></p><p class="hero-term__out--ink hero-term__out" data-v-313a6524>Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)</p><!--]--><!--[--><p class="hero-term__line" data-v-313a6524><span class="prm" data-v-313a6524><span class="prm__user" data-v-313a6524>anon.@jouan.ovh</span><span class="prm__sep" data-v-313a6524>:</span><span class="prm__dir" data-v-313a6524>~</span><span class="prm__sep" data-v-313a6524>$ </span><span class="prm__cmd" data-v-313a6524>cat focus.txt</span></span></p><p class="hero-term__out--blue hero-term__out" data-v-313a6524>SaaS, web apps, clean architecture, automated testing (QA) &amp; AI engineering</p><!--]--><!--[--><p class="hero-term__line" data-v-313a6524><span class="prm" data-v-313a6524><span class="prm__user" data-v-313a6524>anon.@jouan.ovh</span><span class="prm__sep" data-v-313a6524>:</span><span class="prm__dir" data-v-313a6524>~</span><span class="prm__sep" data-v-313a6524>$ </span><span class="prm__cmd" data-v-313a6524>ls ~/projets</span></span></p><p class="hero-term__out--green hero-term__out" data-v-313a6524>keova.app/  tryon-saas/  nodium-lab/</p><!--]--><!--]--></div></noscript></div></div></div></div></div></section><div class="marquee" aria-hidden="true" data-v-80e32bdd data-v-19576991><div class="marquee__track" data-v-19576991><!--[--><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>TypeScript</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Nuxt 4</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Vue.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>NestJS</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Node.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>PostgreSQL</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>TypeORM</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Stripe Connect</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Cypress</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Docker</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>REST API</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Vitest</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><!--]--><!--[--><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>TypeScript</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Nuxt 4</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Vue.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>NestJS</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Node.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>PostgreSQL</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>TypeORM</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Stripe Connect</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Cypress</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Docker</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>REST API</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Vitest</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><!--]--></div></div><section class="section" data-v-80e32bdd><div class="container" data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>ce que je propose</p><h2 class="section__title" data-v-80e32bdd>Trois expertises pour concevoir et faire évoluer vos applications</h2><ul class="grid-3" data-v-80e32bdd><!--[--><li data-v-80e32bdd><div class="offer zcard zcard--pad zcard--interactive" data-v-80e32bdd data-v-c5ec7be1><!--[--><div class="offer__top" data-v-80e32bdd><div class="offer__icon" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div><span class="offer__no" data-v-80e32bdd>01 / 03</span></div><h3 class="offer__title" data-v-80e32bdd>Création d&#39;applications web &amp; SaaS</h3><p class="offer__desc" data-v-80e32bdd>De l&#39;idée à la production : architecture, développement front &amp; back, base de données, authentification et paiements Stripe.</p><ul class="offer__points" data-v-80e32bdd><!--[--><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Architecture logicielle &amp; APIs REST</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Applications Vue 3 / Nuxt 4 &amp; NestJS</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Intégration Stripe &amp; PostgreSQL</span></li><!--]--></ul><ul class="hero__tags offer__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->NestJS<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->PostgreSQL<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Stripe Connect<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-80e32bdd><span data-v-80e32bdd>Sur devis / au sprint</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Création d&#39;applications web &amp; SaaS" data-v-80e32bdd> En savoir plus → </a><!--]--></div></li><li data-v-80e32bdd><div class="offer zcard zcard--pad zcard--interactive zcard--accent zcard--featured" data-v-80e32bdd data-v-c5ec7be1><!--[--><div class="offer__top" data-v-80e32bdd><div class="offer__icon" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg></div><span class="offer__no" data-v-80e32bdd>02 / 03</span></div><h3 class="offer__title" data-v-80e32bdd>Développement Full Stack TypeScript</h3><p class="offer__desc" data-v-80e32bdd>Renfort d&#39;équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.</p><ul class="offer__points" data-v-80e32bdd><!--[--><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Composants Vue 3 / Nuxt avec TypeScript strict</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Microservices &amp; backend modulaire NestJS</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Fiabilisation et optimisation des performances</span></li><!--]--></ul><ul class="hero__tags offer__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->TypeScript<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Vue 3<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->NestJS<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Node.js<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-80e32bdd><span data-v-80e32bdd>Sur devis / TJM</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Développement Full Stack TypeScript" data-v-80e32bdd> En savoir plus → </a><!--]--></div></li><li data-v-80e32bdd><div class="offer zcard zcard--pad zcard--interactive" data-v-80e32bdd data-v-c5ec7be1><!--[--><div class="offer__top" data-v-80e32bdd><div class="offer__icon" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M12 3l1.8 5.6L19.5 10l-5.7 1.4L12 17l-1.8-5.6L4.5 10l5.7-1.4z"/><path d="M19 15l.7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9z"/></svg></div><span class="offer__no" data-v-80e32bdd>03 / 03</span></div><h3 class="offer__title" data-v-80e32bdd>Évolution &amp; Architecture applicative</h3><p class="offer__desc" data-v-80e32bdd>Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).</p><ul class="offer__points" data-v-80e32bdd><!--[--><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Audits techniques de code &amp; migrations de versions</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Tests E2E Cypress &amp; tests unitaires Vitest</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Pipelines CI/CD &amp; conteneurisation Docker</span></li><!--]--></ul><ul class="hero__tags offer__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Cypress<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Vitest<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Docker<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->CI/CD<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-80e32bdd><span data-v-80e32bdd>Au forfait / audit</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Évolution &amp; Architecture applicative" data-v-80e32bdd> En savoir plus → </a><!--]--></div></li><!--]--></ul></div></section><section class="section section--sunken" data-v-80e32bdd><div class="container" data-v-80e32bdd><div class="block__head" data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>projets sélectionnés</p><h2 class="section__title" data-v-80e32bdd>Des produits qui tournent en production</h2></div><ul class="work" data-v-80e32bdd><!--[--><li data-v-80e32bdd><a href="https://keova.app" rel="noopener" target="_blank" class="work__row work__row--link" data-hot data-v-80e32bdd><!--[--><span class="work__no" data-v-80e32bdd>01</span><div class="work__main" data-v-80e32bdd><div class="work__topline" data-v-80e32bdd><h3 class="work__name" data-v-80e32bdd>keova.app</h3><span class="work__status" data-v-80e32bdd>En production</span></div><p class="work__role" data-v-80e32bdd>Co-fondateur &amp; Développeur Full Stack</p><p class="prose work__desc" data-v-80e32bdd>Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).</p><ul class="hero__tags work__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nest.js<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->postgresql<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->stripe<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->saas<!--]--><!----></span></li><!--]--></ul></div><span class="work__go" aria-hidden="true" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-80e32bdd><div class="work__row" data-v-80e32bdd><span class="work__no" data-v-80e32bdd>02</span><div class="work__main" data-v-80e32bdd><div class="work__topline" data-v-80e32bdd><h3 class="work__name" data-v-80e32bdd>TryOn</h3><span class="work__status" data-v-80e32bdd>Étude de cas (MVP livré)</span></div><p class="work__role" data-v-80e32bdd>CTO &amp; Développeur Full Stack</p><p class="prose work__desc" data-v-80e32bdd>Plateforme SaaS B2B d&#39;essayage virtuel de vêtements via l&#39;IA générative (diffusion models, microservices asynchrones, files Redis).</p><ul class="hero__tags work__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nest.js<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->python<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->comfyui<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->ia<!--]--><!----></span></li><!--]--></ul></div><!----></div></li><li data-v-80e32bdd><div class="work__row" data-v-80e32bdd><span class="work__no" data-v-80e32bdd>03</span><div class="work__main" data-v-80e32bdd><div class="work__topline" data-v-80e32bdd><h3 class="work__name" data-v-80e32bdd>Nodium</h3><span class="work__status" data-v-80e32bdd>R&amp;D / En cours</span></div><p class="work__role" data-v-80e32bdd>Créateur &amp; Ingénieur IA</p><p class="prose work__desc" data-v-80e32bdd>Plateforme desktop d&#39;orchestration d&#39;agents IA autonomes, gestion de permissions et mémoire contextuelle.</p><ul class="hero__tags work__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->typescript<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->electron<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->agents<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->ia<!--]--><!----></span></li><!--]--></ul></div><!----></div></li><!--]--></ul><ul class="stats" data-v-80e32bdd><!--[--><li class="stat" data-v-80e32bdd><b data-v-80e32bdd>11</b><span data-v-80e32bdd>années d&#39;expérience web</span></li><li class="stat" data-v-80e32bdd><b data-v-80e32bdd>100%</b><span data-v-80e32bdd>TypeScript &amp; SaaS de bout en bout</span></li><li class="stat" data-v-80e32bdd><b data-v-80e32bdd>QA</b><span data-v-80e32bdd>culture d&#39;automatisation &amp; zéro régression</span></li><!--]--></ul></div></section><section class="section" data-v-80e32bdd><div class="container" data-v-80e32bdd><div class="block__head block__head--row" data-v-80e32bdd><div data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>~/journal</p><h2 class="section__title" data-v-80e32bdd>Notes de dev, écrites en construisant</h2></div><a href="/blog" class="seeall" data-hot data-v-80e32bdd> cat tous-les-articles <svg class="zicon seeall__icon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></a></div><div class="journal__empty zcard zcard--pad" data-v-80e32bdd data-v-c5ec7be1><!--[--><p class="journal__empty-code" data-v-80e32bdd>$ cat ~/journal/*.md</p><p class="journal__empty-text" data-v-80e32bdd>Les notes d&#39;ingénierie et retours d&#39;expérience sont en cours de rédaction.</p><a href="/blog" class="zbtn zbtn--secondary zbtn--sm" data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Consulter la section blog <!--]--><!----></a><!--]--></div></div></section><section class="section section--sunken" data-v-80e32bdd><div class="container" data-v-80e32bdd><div class="cta" data-v-80e32bdd><p class="eyebrow cta__eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>$ </span>./contact --start</p><h2 class="cta__title" data-v-80e32bdd>Un projet en tête ? Mettons-le <span class="cta__highlight" data-v-80e32bdd>en production</span>.</h2><p class="cta__subtitle" data-v-80e32bdd> Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript, parlons-en. </p><div class="cta__actions" data-v-80e32bdd><a href="/contact" class="zbtn zbtn--primary zbtn--lg" data-hot data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Discuter de votre projet <!--]--><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg><!--]--></span></a><a href="https://www.malt.fr/profile/simonjouan" rel="noopener" target="_blank" data-hot class="zbtn zbtn--secondary zbtn--lg" data-v-80e32bdd data-v-c154e5b1><!--[--><!----><!--[--> Me contacter sur Malt <!--]--><!----><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a><a href="/about" class="zbtn zbtn--ghost zbtn--lg" data-hot data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Voir le parcours &amp; CV <!--]--><!----></a></div></div></div></section></main><!--]--><footer class="ftr" data-v-e3708db0 data-v-ec74c766><div class="ftr__container" data-v-ec74c766><div class="ftr__in" data-v-ec74c766><div class="ftr__brand-col" data-v-ec74c766><a aria-current="page" href="/" class="router-link-active router-link-exact-active ftr__brand" data-v-ec74c766><svg class="zicon ftr__logo" viewbox="0 0 24 24" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-ec74c766 data-v-70d98695><path d="M12 1.5 22.5 12 12 22.5 1.5 12z" fill="currentColor"/><path d="M12 1.5 22.5 12 12 12z" fill="#fff" fill-opacity="0.12"/></svg><b data-v-ec74c766>jouan.ovh</b></a><p class="ftr__tagline" data-v-ec74c766>Développeur Full Stack TypeScript — Nuxt / NestJS. Rouen, France.</p></div><nav class="ftr__col" aria-label="Navigation du pied de page" data-v-ec74c766><h2 class="ftr__title" data-v-ec74c766>// Navigation</h2><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active ftr__link" data-v-ec74c766>Accueil</a><a href="/services" class="ftr__link" data-v-ec74c766>Services</a><a href="/about" class="ftr__link" data-v-ec74c766>À propos</a><a href="/blog" class="ftr__link" data-v-ec74c766>Blog</a><a href="/contact" class="ftr__link" data-v-ec74c766>Contact</a><a href="/confidentialite" class="ftr__link" data-v-ec74c766>Confidentialité</a><a href="/mentions-legales" class="ftr__link" data-v-ec74c766>Mentions légales</a><!--]--></nav><div class="ftr__col" data-v-ec74c766><h2 class="ftr__title" data-v-ec74c766>// Projets</h2><ul class="ftr__list" data-v-ec74c766><!--[--><li data-v-ec74c766><a href="https://keova.app" rel="noopener noreferrer" target="_blank" class="ftr__link" data-v-ec74c766><!--[-->keova.app<!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-ec74c766><span class="ftr__link ftr__link--static" data-v-ec74c766>TryOn</span></li><li data-v-ec74c766><span class="ftr__link ftr__link--static" data-v-ec74c766>Nodium</span></li><!--]--></ul></div><div class="ftr__col" data-v-ec74c766><h2 class="ftr__title" data-v-ec74c766>// Réseaux</h2><ul class="hexrow" data-v-ec74c766 data-v-a86d2094><!--[--><li data-v-a86d2094><a href="https://github.com/zohac" rel="noopener noreferrer" target="_blank" class="hex" data-v-a86d2094 data-v-274e53e2><!--[--><!--[--><svg class="zicon" viewbox="0 0 16 16" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a86d2094 data-v-70d98695><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg><!--]--><span class="hex__label" data-v-274e53e2><!--[-->GitHub<!--]--></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-a86d2094><a href="https://twitter.com/fenrir0680" rel="noopener noreferrer" target="_blank" class="hex" data-v-a86d2094 data-v-274e53e2><!--[--><!--[--><svg class="zicon" viewbox="0 0 16 16" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a86d2094 data-v-70d98695><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/></svg><!--]--><span class="hex__label" data-v-274e53e2><!--[-->Twitter<!--]--></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-a86d2094><a href="https://www.linkedin.com/in/simonjouan/" rel="noopener noreferrer" target="_blank" class="hex" data-v-a86d2094 data-v-274e53e2><!--[--><!--[--><svg class="zicon" viewbox="0 0 16 16" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a86d2094 data-v-70d98695><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg><!--]--><span class="hex__label" data-v-274e53e2><!--[-->LinkedIn<!--]--></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><!--]--></ul></div></div><div class="ftr__bottom" data-v-ec74c766><span data-v-ec74c766>© 2026 Simon Jouan — jouan.ovh</span><span class="ftr__term" data-v-ec74c766>anon.@jouan.ovh:~$ <span class="ftr__cmd" data-v-ec74c766>echo &quot;merci de votre visite&quot;</span></span></div></div></footer></div></div><div id="teleports"></div><script>window.__NUXT__={};window.__NUXT__.config={public:{web3formsAccessKey:"320b7ade-7b76-421e-a4bd-f353fd22348b",siteUrl:"https://jouan.ovh",mdc:{components:{prose:true,map:{},customElements:[]},headings:{anchorLinks:{h1:false,h2:true,h3:true,h4:true,h5:false,h6:false}},highlight:false},content:{wsUrl:""}},app:{baseURL:"/",buildId:"47020e4c-64d1-4922-b979-d9f58139e1fe",buildAssetsDir:"/_nuxt/",cdnURL:""}}</script><script type="application/json" data-nuxt-data="nuxt-app" data-ssr="true" id="__NUXT_DATA__">[["ShallowReactive",1],{"prerenderedAt":2,"data":3,"state":6,"once":8,"_errors":9,"serverRendered":11,"path":12},1789327459772,["ShallowReactive",4],{"home-articles":5},[],["Reactive",7],{},["Set"],["ShallowReactive",10],{"home-articles":-1},true,"\u002F"]</script></body></html>
./docs/implementation-artifacts/code-reviews/11-5/raw-acceptance-auditor.md:338:-    desc: "Tests automatisés — Node.js, TypeScript, TestCafé.",
./docs/implementation-artifacts/code-reviews/11-5/raw-acceptance-auditor.md:339:+    desc: "Tests automatisés et fiabilisation applicative — Node.js, TypeScript, TestCafé.",
./docs/implementation-artifacts/code-reviews/11-5/raw-acceptance-auditor.md:512:- **Pas de framework de test non installé :** Le projet n'embarque pas Vitest ou Cypress dans ses dépendances actuelles. La barre de conformité logicielle s'appuie sur ESLint, Stylelint, vue-tsc, le prerender Nitro 13 routes et l'audit émulé OS-level.
./docs/implementation-artifacts/code-reviews/11-5/raw-acceptance-auditor.md:1001:  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
./docs/implementation-artifacts/code-reviews/11-5/raw-acceptance-auditor.md:1711:  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
./docs/implementation-artifacts/code-reviews/11-5/raw-acceptance-auditor.md:1800:    41	-    desc: "Tests automatisés — Node.js, TypeScript, TestCafé.",
./docs/implementation-artifacts/code-reviews/11-5/raw-acceptance-auditor.md:1801:    42	+    desc: "Tests automatisés et fiabilisation applicative — Node.js, TypeScript, TestCafé.",
./docs/implementation-artifacts/code-reviews/11-5/raw-acceptance-auditor.md:1993:   112	    desc: "Tests automatisés et fiabilisation applicative — Node.js, TypeScript, TestCafé.",
./docs/implementation-artifacts/code-reviews/11-5/raw-acceptance-auditor.md:2142:    50	  "cypress",
./docs/implementation-artifacts/code-reviews/11-5/raw-acceptance-auditor.md:2872:   110	    desc: "Tests automatisés — Node.js, TypeScript, TestCafé.",
./docs/implementation-artifacts/code-reviews/11-5/raw-acceptance-auditor.md:3103:298-- TestCafe ;
./docs/implementation-artifacts/code-reviews/11-5/raw-acceptance-auditor.md:3130:335-- TestCafe ;
./docs/implementation-artifacts/code-reviews/11-5/raw-acceptance-auditor.md:3416:| **Marquee Stack** | Défilé continu des technologies prioritaires | Stack moderne ciblée : TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API. | Ruban visuel continu alimenté par `SITE.skills`. |
./docs/implementation-artifacts/code-reviews/11-5/raw-acceptance-auditor.md:3456:  `TypeScript · Nuxt 4 · Vue.js · NestJS · Node.js · PostgreSQL · TypeORM · Stripe Connect · Cypress · Docker · REST API · Vitest`
./docs/implementation-artifacts/code-reviews/11-5/raw-acceptance-auditor.md:3468:   - *Technologies :* Tests E2E Cypress, CI/CD, audits, optimisations.
./docs/implementation-artifacts/code-reviews/11-5/raw-acceptance-auditor.md:3906:app/pages/about.vue:112:    desc: "Tests automatisés et fiabilisation applicative — Node.js, TypeScript, TestCafé.",
./docs/implementation-artifacts/code-reviews/11-5/raw-acceptance-auditor.md:4388:-    desc: "Tests automatisés — Node.js, TypeScript, TestCafé.",
./docs/implementation-artifacts/code-reviews/11-5/raw-acceptance-auditor.md:4389:+    desc: "Tests automatisés et fiabilisation applicative — Node.js, TypeScript, TestCafé.",
./docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:525:docs/specs/spec-home-awwwards/SPEC.md-40-  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
./docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:598:docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-26-   **And** `SITE.skills` reflète la stack moderne ordonnée : `["typescript", "nuxt", "vue", "nest.js", "node.js", "postgresql", "typeorm", "stripe", "cypress", "docker", "rest-api", "vitest"]` sans dispersion WordPress/PHP en premier plan
./docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:664:docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-107-   - Stack ordonnée moderne : TypeScript, Nuxt, Vue, NestJS, Node.js, PostgreSQL, TypeORM, Stripe, Cypress, Docker, REST API, Vitest.
./docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:1416:docs/planning-artifacts/epics.md-751-**Given** la stack moderne définie dans `SITE.skills` (TypeScript, Nuxt 4, Vue.js, NestJS, Node.js, PostgreSQL, TypeORM, Stripe Connect, Cypress, Docker, REST API, Vitest)
./docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:1478:   **And** `SITE.skills` reflète la stack moderne ordonnée : `["typescript", "nuxt", "vue", "nest.js", "node.js", "postgresql", "typeorm", "stripe", "cypress", "docker", "rest-api", "vitest"]` sans dispersion WordPress/PHP en premier plan
./docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:1559:   - Stack ordonnée moderne : TypeScript, Nuxt, Vue, NestJS, Node.js, PostgreSQL, TypeORM, Stripe, Cypress, Docker, REST API, Vitest.
./docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:2196:  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
./docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:2375:+  "cypress",
./docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:2541:+   - Stack ordonnée moderne : TypeScript, Nuxt, Vue, NestJS, Node.js, PostgreSQL, TypeORM, Stripe, Cypress, Docker, REST API, Vitest.
./docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:3273:+  "cypress",
./docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:3439:+   - Stack ordonnée moderne : TypeScript, Nuxt, Vue, NestJS, Node.js, PostgreSQL, TypeORM, Stripe, Cypress, Docker, REST API, Vitest.
./docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:3878:docs/specs/spec-home-awwwards/SPEC.md:40:  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
./docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:6310:   389	+  "cypress",
./docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:6403:    50	  "cypress",
./docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:6556:    40	  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
./docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:7352:   555	+   - Stack ordonnée moderne : TypeScript, Nuxt, Vue, NestJS, Node.js, PostgreSQL, TypeORM, Stripe, Cypress, Docker, REST API, Vitest.
./docs/implementation-artifacts/code-reviews/11-6/raw-edge-case-hunter.json:869:-  cypress: "Cypress",
./docs/implementation-artifacts/code-reviews/11-6/raw-edge-case-hunter.json:870:+  testcafe: "TestCafé",
./docs/implementation-artifacts/code-reviews/11-6/raw-edge-case-hunter.json:1299:-  "cypress",
./docs/implementation-artifacts/code-reviews/11-6/raw-edge-case-hunter.json:1300:+  "testcafe",
./docs/implementation-artifacts/code-reviews/11-6/raw-edge-case-hunter.json:1388:-      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-6/raw-edge-case-hunter.json:1389:+      "Tests E2E TestCafé & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-6/raw-edge-case-hunter.json:1392:-    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-6/raw-edge-case-hunter.json:1393:+    tags: ["TestCafé", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-5/full.diff:41:-    desc: "Tests automatisés — Node.js, TypeScript, TestCafé.",
./docs/implementation-artifacts/code-reviews/11-5/full.diff:42:+    desc: "Tests automatisés et fiabilisation applicative — Node.js, TypeScript, TestCafé.",
./docs/implementation-artifacts/code-reviews/11-5/raw-edge-case-hunter.json:151:-    desc: "Tests automatisés — Node.js, TypeScript, TestCafé.",
./docs/implementation-artifacts/code-reviews/11-5/raw-edge-case-hunter.json:152:+    desc: "Tests automatisés et fiabilisation applicative — Node.js, TypeScript, TestCafé.",
./docs/implementation-artifacts/code-reviews/11-5/raw-edge-case-hunter.json:320:   112	    desc: "Tests automatisés et fiabilisation applicative — Node.js, TypeScript, TestCafé.",
./docs/implementation-artifacts/code-reviews/11-5/raw-edge-case-hunter.json:515:    41	-    desc: "Tests automatisés — Node.js, TypeScript, TestCafé.",
./docs/implementation-artifacts/code-reviews/11-5/raw-edge-case-hunter.json:516:    42	+    desc: "Tests automatisés et fiabilisation applicative — Node.js, TypeScript, TestCafé.",
./docs/implementation-artifacts/code-reviews/11-4/raw-edge-case-hunter.json:1096:   293	      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-4/raw-edge-case-hunter.json:1099:   296	    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-4/raw-edge-case-hunter.json:1237:    50	  "cypress",
./docs/implementation-artifacts/code-reviews/11-4/raw-edge-case-hunter.json:3620:   192	      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-4/raw-edge-case-hunter.json:3623:   195	    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-2/raw-edge-case-hunter.json:1682:  "cypress",
./docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:173:+  cypress: "Cypress",
./docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:352:+      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:355:+    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:629:      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:632:    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1028:  "cypress",
./docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1743:    41	+  cypress: "Cypress",
./docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1922:   220	+      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-3/raw-edge-case-hunter.json:1925:   223	+    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-1/full.diff:389:+  "cypress",
./docs/implementation-artifacts/code-reviews/11-1/full.diff:555:+   - Stack ordonnée moderne : TypeScript, Nuxt, Vue, NestJS, Node.js, PostgreSQL, TypeORM, Stripe, Cypress, Docker, REST API, Vitest.
./docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:1631:   110	    desc: "Tests automatisés — Node.js, TypeScript, TestCafé.",
./docs/implementation-artifacts/code-reviews/11-4/raw-blind-hunter.md:1123:      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-4/raw-blind-hunter.md:1126:    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-4/raw-blind-hunter.md:1701:  "cypress",
./docs/implementation-artifacts/code-reviews/11-4/raw-blind-hunter.md:2836:docs/design_system/ui_kits/jouan-site/data.js:51:    { date: "02/2021 — aujourd'hui", org: "Linkizz", role: "Testeur QA", desc: "Tests automatisés — Node.js, TypeScript, TestCafé." },
./docs/implementation-artifacts/code-reviews/11-4/raw-blind-hunter.md:3092:      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-4/raw-blind-hunter.md:3095:    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-4/raw-blind-hunter.md:4737:1:<!DOCTYPE html><html  lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Simon Jouan — Développeur Full Stack TypeScript · Nuxt &amp; NestJS</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400;1,700&display=swap"><style>.ftr[data-v-ec74c766]{margin-top:auto;background:var(--surface-1);border-top:1px solid var(--border-subtle);padding:var(--space-12) 0 var(--space-8)}.ftr__container[data-v-ec74c766]{width:100%;max-width:var(--container-xl);margin:0 auto;padding:0 var(--space-6)}.ftr__in[data-v-ec74c766]{display:flex;flex-wrap:wrap;gap:var(--space-8);align-items:flex-start;justify-content:space-between}.ftr__brand-col[data-v-ec74c766]{max-width:300px}.ftr__brand[data-v-ec74c766]{display:inline-flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-3);text-decoration:none}.ftr__brand .ftr__logo[data-v-ec74c766]{font-size:22px;color:var(--accent)}.ftr__brand b[data-v-ec74c766]{font-family:var(--font-mono);font-size:var(--fs-md);font-weight:var(--fw-bold);color:var(--text-strong)}.ftr__brand[data-v-ec74c766]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-sm);box-shadow:var(--ring-accent)}.ftr__tagline[data-v-ec74c766]{margin:0;font-size:var(--fs-sm);color:var(--text-muted)}.ftr__col[data-v-ec74c766]{display:flex;flex-direction:column}.ftr__title[data-v-ec74c766]{margin:0 0 var(--space-3);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:var(--fw-regular);letter-spacing:var(--ls-wider);text-transform:uppercase;color:var(--text-muted)}.ftr__list[data-v-ec74c766]{display:flex;flex-direction:column;padding:0;margin:0;list-style:none}.ftr__link[data-v-ec74c766]{display:block;padding:var(--space-1) 0;font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-body);text-decoration:none;transition:color var(--dur-fast) var(--ease-standard)}.ftr__link[data-v-ec74c766]:hover{color:var(--accent)}.ftr__link[data-v-ec74c766]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-xs);box-shadow:var(--ring-accent)}.ftr__link--static[data-v-ec74c766]{cursor:default}.ftr__bottom[data-v-ec74c766],.ftr__link--static[data-v-ec74c766],.ftr__link--static[data-v-ec74c766]:hover{color:var(--text-muted)}.ftr__bottom[data-v-ec74c766]{display:flex;flex-wrap:wrap;gap:var(--space-3);justify-content:space-between;margin-top:var(--space-8);padding-top:var(--space-5);font-family:var(--font-mono);font-size:var(--fs-xs);border-top:1px solid var(--border-subtle)}.ftr__cmd[data-v-ec74c766]{color:var(--term-green)}@media(prefers-reduced-motion:reduce){.ftr__link[data-v-ec74c766]{transition:none}}</style><style>.terminal{box-sizing:border-box;position:fixed;top:60px;left:15px;z-index:1000;width:600px;height:400px;overflow:hidden;resize:both;font-family:var(--font-mono);color:var(--ink-1);border:1px solid var(--border-terminal);border-radius:var(--radius-sm);box-shadow:var(--glow-terminal)}.terminal-header{position:relative;z-index:1;display:flex;flex-wrap:nowrap;align-items:center;gap:var(--space-2);height:30px;padding:0 var(--space-3);background:var(--aubergine-black);cursor:move}.terminal-header .terminal-dots{display:flex;align-items:center;gap:7px}.terminal-header .close-button{width:13px;height:13px;cursor:pointer;background-image:linear-gradient(to bottom right,var(--term-red),#8a0000);border-radius:var(--radius-circle);box-shadow:1px 1px 2px #080206}.terminal-header .close-button:hover{filter:brightness(1.2)}.terminal-header .close-button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.terminal-header .terminal-dot{width:13px;height:13px;border-radius:var(--radius-circle);opacity:.85}.terminal-header .terminal-dot--min{background:var(--term-yellow)}.terminal-header .terminal-dot--max{background:var(--term-green)}.terminal-header .header-text{position:absolute;inset:0;font-family:var(--font-mono);font-size:var(--fs-xs);letter-spacing:var(--ls-wide);line-height:30px;color:var(--text-muted);text-align:center;pointer-events:none}.terminal-body{height:calc(100% - 30px);margin:0;padding:var(--space-4);overflow:auto;font-size:var(--fs-sm);line-height:var(--lh-snug);white-space:pre-wrap;overflow-wrap:break-word;background:var(--bg-terminal)}.terminal-body .git-prompt,.terminal-body .git-prompt-directory,.terminal-body .git-prompt-separator{display:inline}.terminal-body .git-prompt,.terminal-body .git-prompt-directory{font-weight:var(--fw-bold)}.terminal-body .git-prompt{color:var(--prompt)}.terminal-body .git-prompt-separator{color:var(--ink-1);font-weight:var(--fw-regular)}.terminal-body .git-prompt-directory{color:var(--term-blue)}.terminal-body .user-input{margin:0;padding:0;font-family:inherit;font-size:inherit;color:inherit;background-color:transparent;border:none;outline:none;caret-color:var(--prompt);caret-shape:block}.terminal-body .terminal-response{white-space:normal}.terminal-body::-webkit-scrollbar{width:10px}.terminal-body::-webkit-scrollbar-thumb{background:var(--aubergine);border-radius:var(--radius-pill)}@supports (backdrop-filter:blur(5px)) or (-webkit-backdrop-filter:blur(5px)){.terminal .terminal-body{background:color-mix(in srgb,var(--bg-terminal) 86%,transparent);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px)}}.terminal .resize-handle{position:absolute;right:0;bottom:0;width:16px;height:16px;background-color:transparent;cursor:nwse-resize}.table,table{--color-light:#ebebeb;--color-dark:#141414;--color-grey-light:#adadad;--margin:1em;border:1px dashed var(--color-light);margin:var(--margin)}.table thead,table thead{color:var(--color-dark);text-align:center;background-color:var(--color-light)}.table td,table td{padding:0 .5em}.table tbody tr:nth-child(2n),table tbody tr:nth-child(2n){background-color:var(--color-grey-light);color:var(--color-dark)}.table.w-100,table.w-100{width:calc(100% - var(--margin)*2)}.table.w-50,table.w-50{width:calc(50% - var(--margin)*2)}</style><style>.hdr[data-v-a782489c]{position:sticky;top:0;z-index:50;height:var(--header-height);background:color-mix(in srgb,var(--surface-0) 82%,transparent);border-bottom:1px solid var(--border-subtle);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}.hdr__in[data-v-a782489c]{display:flex;align-items:center;gap:var(--space-6);width:100%;max-width:var(--container-xl);height:100%;margin:0 auto;padding:0 var(--space-6)}.hdr__brand[data-v-a782489c]{display:inline-flex;align-items:center;gap:var(--space-2);text-decoration:none}.hdr__brand .hdr__logo[data-v-a782489c]{font-size:24px;color:var(--accent)}.hdr__brand b[data-v-a782489c]{font-family:var(--font-mono);font-size:var(--fs-md);font-weight:var(--fw-bold);color:var(--text-strong)}.hdr__brand[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-sm);box-shadow:var(--ring-accent)}.hdr__nav[data-v-a782489c]{display:flex;align-items:center;gap:var(--space-1);min-width:0;margin-left:var(--space-4)}.hdr__link[data-v-a782489c]{padding:var(--space-2) var(--space-3);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-muted);text-decoration:none;border-radius:var(--radius-sm);transition:color var(--dur-fast) var(--ease-standard),background var(--dur-fast) var(--ease-standard)}.hdr__link[data-v-a782489c]:hover{color:var(--text-strong);background:var(--surface-2)}.hdr__link[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hdr__link--active[data-v-a782489c]{color:var(--accent)}.hdr__right[data-v-a782489c]{display:flex;align-items:center;gap:var(--space-3);margin-left:auto}.hdr__clock[data-v-a782489c]{font-family:var(--font-mono);font-size:var(--fs-xs);color:var(--text-muted)}.hdr__burger[data-v-a782489c]{display:none;align-items:center;justify-content:center;width:36px;height:36px;font-size:20px;color:var(--text-strong);cursor:pointer;background:none;border:1px solid var(--border-default);border-radius:var(--radius-md)}.hdr__burger[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hdr__overlay[data-v-a782489c]{position:fixed;inset:var(--header-height) 0 0;z-index:40;background:var(--overlay)}.hdr__menu[data-v-a782489c]{display:none}@media(max-width:1100px){.hdr__clock[data-v-a782489c]{display:none}}@media(max-width:1000px){.hdr__badge[data-v-a782489c]{display:none}}@media(min-width:901px){.hdr__overlay[data-v-a782489c]{display:none}}@media(max-width:900px){.hdr__badge[data-v-a782489c],.hdr__clock[data-v-a782489c],.hdr__nav[data-v-a782489c],.hdr__right .hdr__action[data-v-a782489c]{display:none}.hdr__burger[data-v-a782489c]{display:inline-flex}.hdr__menu[data-v-a782489c]{position:fixed;inset:var(--header-height) 0 auto 0;z-index:45;display:flex;flex-direction:column;gap:var(--space-1);padding:var(--space-4) var(--space-6) var(--space-6);background:var(--surface-1);border-bottom:1px solid var(--border-subtle);box-shadow:var(--shadow-3);transform:translateY(-8px);opacity:0;visibility:hidden;transition:transform var(--dur-base) var(--ease-out),opacity var(--dur-base) var(--ease-standard),visibility var(--dur-base)}.hdr__menu--open[data-v-a782489c]{transform:translateY(0);opacity:1;visibility:visible}}.hdr__menu-link[data-v-a782489c]{padding:var(--space-3);font-family:var(--font-mono);font-size:var(--fs-base);color:var(--text-body);text-decoration:none;border-radius:var(--radius-sm)}.hdr__menu-link[data-v-a782489c]:hover{color:var(--text-strong);background:var(--surface-2)}.hdr__menu-link[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hdr__menu-link--active[data-v-a782489c]{color:var(--accent)}.hdr__menu-actions[data-v-a782489c]{display:flex;flex-direction:column;gap:var(--space-2);margin-top:var(--space-3)}@media(prefers-reduced-motion:reduce){.hdr__link[data-v-a782489c],.hdr__menu[data-v-a782489c]{transition:none}}</style><style>.init[data-v-e3708db0]{background:var(--bg-page);display:flex;flex-direction:column;margin:0;min-height:100vh;width:100%;max-width:100vw}</style><style>.zicon[data-v-70d98695]{display:inline-block;flex:none;width:1em;height:1em;vertical-align:middle}</style><style>.zbadge[data-v-fc077828]{display:inline-flex;align-items:center;gap:var(--space-2);box-sizing:border-box;height:22px;padding:0 var(--space-2);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:var(--fw-medium);line-height:1;letter-spacing:var(--ls-wide);white-space:nowrap;border:1px solid transparent;border-radius:var(--radius-sm)}.zbadge__dot[data-v-fc077828]{width:6px;height:6px;background:currentcolor;border-radius:var(--radius-circle)}.zbadge--neutral[data-v-fc077828]{background:var(--surface-3);color:var(--text-body);border-color:var(--border-default)}.zbadge--accent[data-v-fc077828]{background:var(--accent-soft);color:var(--accent);border-color:#f871164d}.zbadge--success[data-v-fc077828]{background:var(--success-soft);color:var(--success);border-color:#297a4880}.zbadge--warning[data-v-fc077828]{background:var(--warning-soft);color:var(--warning);border-color:#8b611880}.zbadge--danger[data-v-fc077828]{background:var(--danger-soft);color:var(--danger);border-color:#8a282880}.zbadge--info[data-v-fc077828]{background:var(--info-soft);color:var(--info);border-color:#255b7e80}</style><style>.zbtn[data-v-c154e5b1]{--_h:36px;--_px:var(--space-4);--_fs:var(--fs-sm);display:inline-flex;align-items:center;justify-content:center;gap:var(--space-2);box-sizing:border-box;height:var(--_h);padding:0 var(--_px);font-family:var(--font-mono);font-size:var(--_fs);font-weight:var(--fw-medium);line-height:1;letter-spacing:var(--ls-wide);white-space:nowrap;text-decoration:none;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;border:1px solid transparent;border-radius:var(--radius-md);transition:background var(--dur-fast) var(--ease-standard),border-color var(--dur-fast) var(--ease-standard),color var(--dur-fast) var(--ease-standard),transform var(--dur-fast) var(--ease-standard)}.zbtn[data-v-c154e5b1]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.zbtn[data-v-c154e5b1]:disabled,.zbtn[aria-disabled=true][data-v-c154e5b1]{opacity:.45;cursor:not-allowed;pointer-events:none}.zbtn__icon[data-v-c154e5b1]{display:inline-flex;width:1.05em;height:1.05em}.zbtn__icon[data-v-c154e5b1] svg{width:100%;height:100%}.zbtn--sm[data-v-c154e5b1]{--_h:28px;--_px:var(--space-3);--_fs:var(--fs-xs)}.zbtn--lg[data-v-c154e5b1]{--_h:44px;--_px:var(--space-5);--_fs:var(--fs-base)}.zbtn--primary[data-v-c154e5b1]{background:var(--accent);color:var(--accent-text);border-color:var(--accent)}.zbtn--primary[data-v-c154e5b1]:hover{background:var(--accent-hover);border-color:var(--accent-hover)}.zbtn--primary[data-v-c154e5b1]:active{background:var(--accent-active);border-color:var(--accent-active);transform:translateY(1px)}.zbtn--secondary[data-v-c154e5b1]{background:var(--surface-2);color:var(--text-strong);border-color:var(--border-default)}.zbtn--secondary[data-v-c154e5b1]:hover{background:var(--surface-3);border-color:var(--border-strong)}.zbtn--secondary[data-v-c154e5b1]:active{transform:translateY(1px)}.zbtn--ghost[data-v-c154e5b1]{background:transparent;color:var(--text-body);border-color:transparent}.zbtn--ghost[data-v-c154e5b1]:hover{background:var(--surface-2);color:var(--text-strong)}.zbtn--terminal[data-v-c154e5b1]{background:var(--bg-terminal);color:var(--term-green);border-color:var(--accent-2-soft)}.zbtn--terminal[data-v-c154e5b1]:hover{border-color:var(--term-green);box-shadow:var(--glow-terminal)}.zbtn--danger[data-v-c154e5b1]{background:var(--danger);color:var(--ink-on-accent);border-color:var(--danger)}.zbtn--danger[data-v-c154e5b1]:hover{filter:brightness(1.08)}.zbtn--danger[data-v-c154e5b1]:active{transform:translateY(1px)}@media(prefers-reduced-motion:reduce){.zbtn[data-v-c154e5b1]{transition:none}}</style><style>.boot[data-v-f59a7d91]{position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;cursor:pointer;background:var(--surface-0);transition:opacity var(--dur-slow) var(--ease-out),visibility var(--dur-slow)}.boot.boot--done[data-v-f59a7d91]{pointer-events:none;visibility:hidden;opacity:0}.boot__in[data-v-f59a7d91]{width:min(560px,88vw);font-family:var(--font-mono);font-size:var(--fs-sm)}.boot__logo[data-v-f59a7d91]{display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-5);color:var(--text-strong)}.boot__logo b[data-v-f59a7d91]{font-size:var(--fs-lg)}.boot__logo-icon[data-v-f59a7d91]{font-size:26px;color:var(--accent)}.boot__line[data-v-f59a7d91]{min-height:1.6em;color:var(--text-muted)}.boot__ok[data-v-f59a7d91]{color:var(--term-green)}.boot__bar[data-v-f59a7d91]{height:3px;margin-top:var(--space-5);overflow:hidden;background:var(--surface-3);border-radius:var(--radius-xs)}.boot__bar i[data-v-f59a7d91]{display:block;width:0;height:100%;background:linear-gradient(90deg,var(--accent),var(--aubergine-light));transition:width .1s linear}.boot__skip[data-v-f59a7d91]{display:inline-block;margin-top:var(--space-4);padding:0;font-family:inherit;font-size:var(--fs-xs);letter-spacing:var(--ls-wide);color:var(--text-faint);cursor:pointer;background:none;border:none}.boot__skip[data-v-f59a7d91]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}@media(prefers-reduced-motion:reduce){.boot[data-v-f59a7d91]{display:none}}</style><style>.atmos[data-v-796c86c1]{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none}.aurora[data-v-796c86c1]{position:absolute;border-radius:var(--radius-circle);filter:blur(80px);mix-blend-mode:screen;will-change:transform}.aurora--orange[data-v-796c86c1]{top:-22%;left:48%;width:60vw;height:60vw;background:radial-gradient(circle at center,var(--orange-500),transparent 62%);opacity:.55;animation:drift-orange-796c86c1 26s var(--ease-in-out) infinite}.aurora--auberg[data-v-796c86c1]{top:6%;left:-22%;width:64vw;height:64vw;background:radial-gradient(circle at center,var(--aubergine-vivid),transparent 62%);opacity:.7;animation:drift-auberg-796c86c1 32s var(--ease-in-out) infinite}.aurora--red[data-v-796c86c1]{top:44%;left:26%;width:44vw;height:44vw;background:radial-gradient(circle at center,var(--term-red),transparent 64%);opacity:.4;animation:drift-red-796c86c1 30s var(--ease-in-out) infinite}.grid-dots[data-v-796c86c1]{background-image:radial-gradient(color-mix(in srgb,var(--ink-1) 6%,transparent) 1px,transparent 1px);background-size:34px 34px;-webkit-mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,var(--surface-0) 30%,transparent 78%);mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,var(--surface-0) 30%,transparent 78%)}.grid-dots[data-v-796c86c1],.scanlines[data-v-796c86c1]{position:absolute;inset:0}.scanlines[data-v-796c86c1]{opacity:.35;background:repeating-linear-gradient(0deg,color-mix(in srgb,var(--surface-0) 24%,transparent) 0 1px,transparent 1px 3px)}.vignette[data-v-796c86c1]{position:absolute;inset:0;background:radial-gradient(ellipse 120% 90% at 50% 0,transparent 55%,var(--surface-0) 100%)}@keyframes drift-orange-796c86c1{0%,to{transform:translate(0) scale(1)}50%{transform:translate(-6vw,5vh) scale(1.12)}}@keyframes drift-auberg-796c86c1{0%,to{transform:translate(0) scale(1)}50%{transform:translate(7vw,-4vh) scale(1.08)}}@keyframes drift-red-796c86c1{0%,to{transform:translate(0) scale(1)}50%{transform:translate(-4vw,-6vh) scale(1.15)}}@media(prefers-reduced-motion:reduce){.aurora[data-v-796c86c1]{animation:none}}</style><style>.cursor-dot[data-v-0096a69c],.cursor-ring[data-v-0096a69c]{position:fixed;top:0;left:0;z-index:90;border-radius:var(--radius-circle);mix-blend-mode:difference;opacity:0;pointer-events:none;transition:opacity var(--dur-base) var(--ease-standard)}.cursor-dot.is-visible[data-v-0096a69c],.cursor-ring.is-visible[data-v-0096a69c]{opacity:1}.cursor-dot[data-v-0096a69c]{width:6px;height:6px;background:var(--ink-1)}.cursor-ring[data-v-0096a69c]{width:34px;height:34px;border:1px solid color-mix(in srgb,var(--ink-1) 70%,transparent);transition:width var(--dur-base) var(--ease-out),height var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out),opacity var(--dur-base) var(--ease-standard)}.cursor-ring.is-hot[data-v-0096a69c]{width:56px;height:56px;border-color:var(--accent)}@media(hover:none),(prefers-reduced-motion:reduce){.cursor-dot[data-v-0096a69c],.cursor-ring[data-v-0096a69c]{display:none}}</style><style>.hero-term[data-v-313a6524]{display:flex;flex-direction:column;min-height:300px;overflow:hidden;border:1px solid var(--accent-2-soft);border-radius:var(--radius-sm);box-shadow:var(--glow-terminal)}.hero-term__bar[data-v-313a6524]{position:relative;display:flex;flex:none;align-items:center;gap:var(--space-2);height:30px;padding:0 var(--space-3);background:var(--aubergine-black)}.hero-term__dots[data-v-313a6524]{display:flex;align-items:center;gap:7px}.hero-term__dot[data-v-313a6524]{width:13px;height:13px;border-radius:var(--radius-circle)}.hero-term__dot--close[data-v-313a6524]{background:var(--term-red)}.hero-term__dot--min[data-v-313a6524]{background:var(--term-yellow)}.hero-term__dot--max[data-v-313a6524]{background:var(--term-green)}.hero-term__title[data-v-313a6524]{position:absolute;inset:0;font-family:var(--font-mono);font-size:var(--fs-xs);letter-spacing:var(--ls-wide);color:var(--text-muted);text-align:center;pointer-events:none}.hero-term__body[data-v-313a6524]{flex:1;min-height:0;padding:var(--space-4);overflow:auto;font-family:var(--font-mono);font-size:var(--fs-sm);line-height:var(--lh-snug);color:var(--ink-1);background:var(--bg-terminal);overflow-wrap:break-word}@supports (backdrop-filter:blur(5px)){.hero-term__body[data-v-313a6524]{background:color-mix(in srgb,var(--bg-terminal) 86%,transparent);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px)}}.hero-term__line[data-v-313a6524]{margin:0}.hero-term__out[data-v-313a6524]{margin:0 0 var(--space-4)}.hero-term__out--ink[data-v-313a6524]{color:var(--ink-1)}.hero-term__out--blue[data-v-313a6524]{color:var(--term-blue)}.hero-term__out--green[data-v-313a6524]{color:var(--term-green)}.hero-term__open[data-v-313a6524]{display:block;width:100%;padding:0;font:inherit;text-align:left;cursor:pointer;background:none;border:none;border-radius:var(--radius-xs)}.hero-term__open[data-v-313a6524]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.prm[data-v-313a6524]{font-family:var(--font-mono)}.prm__user[data-v-313a6524]{font-weight:var(--fw-bold);color:var(--prompt)}.prm__sep[data-v-313a6524]{color:var(--ink-1)}.prm__dir[data-v-313a6524]{font-weight:var(--fw-bold);color:var(--term-blue)}.prm__cmd[data-v-313a6524]{color:var(--ink-1)}.prm__caret[data-v-313a6524]{display:inline-block;width:.55em;height:1.05em;margin-left:1px;vertical-align:text-bottom;background:var(--prompt);animation:caret-blink 1s steps(1) infinite}@media(prefers-reduced-motion:reduce){.prm__caret[data-v-313a6524]{animation:none}}</style><style>.marquee[data-v-19576991]{display:block;width:100%;padding-block:var(--space-5);overflow:hidden;border-block:1px solid var(--border-subtle);-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}.marquee:hover .marquee__track[data-v-19576991]{animation-play-state:paused}.marquee__track[data-v-19576991]{display:flex;gap:var(--space-8);width:-moz-max-content;width:max-content;will-change:transform;animation:scroll-x-19576991 32s linear infinite}.marquee__item[data-v-19576991]{display:inline-flex;gap:var(--space-8);align-items:center;font-family:var(--font-mono);font-size:var(--fs-xl);letter-spacing:var(--ls-wide);color:var(--text-faint);white-space:nowrap}.marquee__label[data-v-19576991]{font-weight:var(--fw-regular);color:var(--text-body)}.marquee__star[data-v-19576991]{color:var(--accent)}@keyframes scroll-x-19576991{0%{transform:translate(0)}to{transform:translate(calc(-50% - var(--space-8)/2))}}@media(prefers-reduced-motion:reduce){.marquee[data-v-19576991]{-webkit-mask-image:none;mask-image:none}.marquee__track[data-v-19576991]{animation:none}.marquee__item--duplicate[data-v-19576991]{display:none}}</style><style>.home[data-v-80e32bdd]{display:block}.anim[data-v-80e32bdd]{animation:fade-rise var(--dur-slow) var(--ease-out) both}.hero__term-col[data-v-80e32bdd]{animation-delay:80ms}.hero[data-v-80e32bdd]{position:relative;overflow:hidden}.hero__grad[data-v-80e32bdd]{background:radial-gradient(900px 500px at 78% -10%,color-mix(in srgb,var(--accent) 16%,transparent),transparent 60%),radial-gradient(700px 500px at 0 110%,color-mix(in srgb,var(--aubergine-vivid) 28%,transparent),transparent 60%),var(--bg-page)}.hero__in[data-v-80e32bdd]{position:relative;z-index:1;padding-block:var(--space-20)}.hero__grid[data-v-80e32bdd]{display:grid;grid-template-columns:1.05fr .95fr;gap:var(--space-12);align-items:center}.hero__title[data-v-80e32bdd]{font-family:var(--font-mono);font-size:var(--fs-6xl);font-weight:var(--fw-light);letter-spacing:var(--ls-tight);color:var(--text-strong)}.hero__title em[data-v-80e32bdd]{font-style:normal;color:var(--accent)}.hero__sub[data-v-80e32bdd]{max-width:46ch;margin:var(--space-5) 0 var(--space-6);font-family:var(--font-sans);font-size:var(--fs-lg);line-height:var(--lh-relaxed);color:var(--text-body)}.hero__cta[data-v-80e32bdd]{display:flex;flex-wrap:wrap;gap:var(--space-3);margin-bottom:var(--space-6)}.hero__badge-wrap[data-v-80e32bdd]{display:inline-flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-6);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-muted)}.hero__badge-wrap a[data-v-80e32bdd]{color:var(--accent);text-decoration:underline}.hero__badge-wrap a[data-v-80e32bdd]:hover{color:var(--accent-hover)}.hero__badge-wrap a[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hero__pulse-dot[data-v-80e32bdd]{width:8px;height:8px;border-radius:var(--radius-circle);background:var(--success);box-shadow:0 0 color-mix(in srgb,var(--success) 60%,transparent);animation:pulse-dot-80e32bdd 2.2s infinite var(--ease-out)}@media(prefers-reduced-motion:reduce){.hero__pulse-dot[data-v-80e32bdd]{animation:none}}@keyframes pulse-dot-80e32bdd{0%{box-shadow:0 0 color-mix(in srgb,var(--success) 60%,transparent)}70%{box-shadow:0 0 0 6px color-mix(in srgb,var(--success) 0%,transparent)}to{box-shadow:0 0 color-mix(in srgb,var(--success) 0%,transparent)}}.section__title[data-v-80e32bdd]{margin-bottom:var(--space-8);font-family:var(--font-mono);font-size:var(--fs-3xl);font-weight:var(--fw-regular);color:var(--text-strong)}.grid-3[data-v-80e32bdd]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-5);margin:0;padding:0;list-style:none}.grid-3>li[data-v-80e32bdd],.offer[data-v-80e32bdd]{display:flex}.offer[data-v-80e32bdd]{flex-direction:column;width:100%}.offer__top[data-v-80e32bdd]{justify-content:space-between;margin-bottom:var(--space-4)}.offer__icon[data-v-80e32bdd],.offer__top[data-v-80e32bdd]{display:flex;align-items:center}.offer__icon[data-v-80e32bdd]{justify-content:center;width:var(--space-10);height:var(--space-10);font-size:22px;color:var(--accent);background:var(--accent-soft);border-radius:var(--radius-md)}.offer__no[data-v-80e32bdd]{font-size:var(--fs-xs);letter-spacing:var(--ls-wider);color:var(--text-faint)}.offer__no[data-v-80e32bdd],.offer__title[data-v-80e32bdd]{font-family:var(--font-mono)}.offer__title[data-v-80e32bdd]{margin-bottom:var(--space-2);font-size:var(--fs-xl);font-weight:var(--fw-regular);color:var(--text-strong)}.offer__desc[data-v-80e32bdd]{margin:0 0 var(--space-4);font-family:var(--font-sans);font-size:var(--fs-sm);line-height:var(--lh-relaxed);color:var(--text-body)}.offer__points[data-v-80e32bdd]{display:flex;flex-direction:column;gap:var(--space-2);margin:0 0 var(--space-4);padding:0;list-style:none}.offer__points li[data-v-80e32bdd]{display:flex;gap:var(--space-2);align-items:flex-start;font-family:var(--font-mono);font-size:var(--fs-xs);line-height:var(--lh-normal);color:var(--text-muted)}.offer__check[data-v-80e32bdd]{flex-shrink:0;margin-top:calc(var(--space-1)/2);font-size:var(--fs-sm);color:var(--term-green)}.offer__tags[data-v-80e32bdd]{margin-bottom:var(--space-4)}.offer__price[data-v-80e32bdd]{margin-top:auto;padding-top:var(--space-4);border-top:1px dashed var(--border-subtle);font-size:var(--fs-xs)}.offer__more[data-v-80e32bdd],.offer__price[data-v-80e32bdd]{font-family:var(--font-mono);color:var(--accent)}.offer__more[data-v-80e32bdd]{margin-top:var(--space-3);font-size:var(--fs-sm);text-decoration:none}.offer__more[data-v-80e32bdd]:hover{text-decoration:underline}.offer__more[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent);border-radius:var(--radius-xs)}.work[data-v-80e32bdd]{display:flex;flex-direction:column;margin:0;padding:0;list-style:none}.work>li[data-v-80e32bdd]{display:block;width:100%}.work__row[data-v-80e32bdd]{position:relative;display:grid;grid-template-columns:56px 1fr auto;gap:var(--space-6);align-items:center;padding:var(--space-8) var(--space-3);border-top:1px solid var(--border-subtle);text-decoration:none;color:inherit;transition:padding-left var(--dur-slow) var(--ease-out),background var(--dur-slow) var(--ease-standard)}.work__row[data-v-80e32bdd]:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,var(--accent-soft),transparent 60%);opacity:0;transition:opacity var(--dur-slow) var(--ease-standard)}li:last-child .work__row[data-v-80e32bdd]{border-bottom:1px solid var(--border-subtle)}.work__row--link[data-v-80e32bdd]{cursor:pointer}.work__row--link[data-v-80e32bdd]:hover{padding-left:var(--space-6)}.work__row--link[data-v-80e32bdd]:hover:before{opacity:1}.work__row--link:hover .work__name[data-v-80e32bdd]{color:var(--accent)}.work__row--link:hover .work__go[data-v-80e32bdd]{color:var(--accent);transform:translate(6px,-6px)}.work__row--link[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent);border-radius:var(--radius-xs)}.work__no[data-v-80e32bdd]{font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-faint)}.work__main[data-v-80e32bdd],.work__no[data-v-80e32bdd]{position:relative}.work__topline[data-v-80e32bdd]{display:flex;flex-wrap:wrap;align-items:baseline;gap:var(--space-3)}.work__name[data-v-80e32bdd]{margin:0;font-family:var(--font-mono);font-size:clamp(1.4rem,2.8vw,2rem);font-weight:var(--fw-regular);letter-spacing:var(--ls-tight);color:var(--text-strong);transition:color var(--dur-base) var(--ease-standard)}.work__status[data-v-80e32bdd]{color:var(--accent);letter-spacing:var(--ls-wide)}.work__role[data-v-80e32bdd],.work__status[data-v-80e32bdd]{font-family:var(--font-mono);font-size:var(--fs-xs)}.work__role[data-v-80e32bdd]{margin:var(--space-1) 0 0;color:var(--text-muted)}.work__desc[data-v-80e32bdd]{max-width:65ch;margin:var(--space-3) 0 0;font-size:var(--fs-sm)}.work__tags[data-v-80e32bdd]{margin-top:var(--space-4)}.work__go[data-v-80e32bdd]{position:relative;font-size:var(--fs-xl);color:var(--text-faint);transition:transform var(--dur-base) var(--ease-out),color var(--dur-base) var(--ease-standard)}.stats[data-v-80e32bdd]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin:var(--space-12) 0 0;padding:0;list-style:none}.stat[data-v-80e32bdd]{padding:var(--space-6);background:color-mix(in srgb,var(--surface-1) 70%,transparent);border:1px solid var(--border-subtle);border-radius:var(--radius-md)}.stat b[data-v-80e32bdd]{display:block;margin-bottom:var(--space-1);font-size:var(--fs-5xl);font-weight:var(--fw-light);line-height:1;letter-spacing:var(--ls-tight);color:var(--text-strong)}.stat b[data-v-80e32bdd],.stat span[data-v-80e32bdd]{font-family:var(--font-mono)}.stat span[data-v-80e32bdd]{font-size:var(--fs-sm);letter-spacing:var(--ls-wide);color:var(--text-muted)}.block__head--row[data-v-80e32bdd]{display:flex;align-items:flex-end;justify-content:space-between;gap:var(--space-6);margin-bottom:var(--space-8)}.block__head--row .section__title[data-v-80e32bdd]{margin-bottom:0}.seeall[data-v-80e32bdd]{display:inline-flex;flex:none;align-items:center;gap:var(--space-2);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-muted);text-decoration:none;white-space:nowrap;transition:color var(--dur-base) var(--ease-standard)}.seeall[data-v-80e32bdd]:hover{color:var(--accent)}.seeall[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent);border-radius:var(--radius-xs)}.seeall__icon[data-v-80e32bdd]{font-size:var(--fs-base)}.journal[data-v-80e32bdd]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-5);margin:0;padding:0;list-style:none}.journal>li[data-v-80e32bdd],.jpost[data-v-80e32bdd]{display:flex}.jpost[data-v-80e32bdd]{flex-direction:column;width:100%;color:inherit;text-decoration:none}.jpost:hover .jpost__title[data-v-80e32bdd]{color:var(--accent)}.jpost:hover .jpost__arrow[data-v-80e32bdd]{color:var(--accent);transform:translate(4px,-4px)}.jpost__thumb[data-v-80e32bdd]{width:100%;height:160px;-o-object-fit:cover;object-fit:cover;border-bottom:1px solid var(--border-subtle)}.jpost__body[data-v-80e32bdd]{display:flex;flex:1;flex-direction:column;padding:var(--space-5)}.jpost__tags[data-v-80e32bdd]{margin-bottom:var(--space-3)}.jpost__title[data-v-80e32bdd]{margin:0 0 var(--space-2);font-family:var(--font-mono);font-size:var(--fs-lg);font-weight:var(--fw-regular);line-height:var(--lh-snug);color:var(--text-strong);transition:color var(--dur-base) var(--ease-standard)}.jpost__desc[data-v-80e32bdd]{margin:0 0 var(--space-4);font-size:var(--fs-sm);color:var(--text-muted)}.jpost__meta[data-v-80e32bdd]{display:flex;align-items:center;gap:var(--space-2);margin-top:auto;padding-top:var(--space-4);border-top:1px dashed var(--border-subtle);font-family:var(--font-mono);font-size:var(--fs-xs);color:var(--text-faint)}.jpost__arrow[data-v-80e32bdd]{margin-left:auto;font-size:var(--fs-base);color:var(--text-faint);transition:transform var(--dur-base) var(--ease-out),color var(--dur-base) var(--ease-standard)}.journal__empty[data-v-80e32bdd]{max-width:60ch;margin:0 auto;text-align:center}.journal__empty-code[data-v-80e32bdd]{margin:0 0 var(--space-2);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--accent)}.journal__empty-text[data-v-80e32bdd]{margin:0 0 var(--space-5);font-family:var(--font-sans);font-size:var(--fs-sm);line-height:var(--lh-relaxed);color:var(--text-muted)}.cta[data-v-80e32bdd]{position:relative;padding:clamp(48px,6vw,72px) var(--space-6);overflow:hidden;text-align:center;background:radial-gradient(ellipse 80% 120% at 50% 0,var(--accent-2-soft),transparent 70%),color-mix(in srgb,var(--surface-2) 60%,transparent);border:1px solid var(--border-subtle);border-radius:var(--radius-lg)}.cta__eyebrow[data-v-80e32bdd]{display:inline-block}.cta__title[data-v-80e32bdd]{margin:0 0 var(--space-4);font-family:var(--font-mono);font-size:clamp(1.8rem,4vw,2.8rem);font-weight:var(--fw-light);line-height:var(--lh-tight);letter-spacing:var(--ls-tight);color:var(--text-strong)}.cta__highlight[data-v-80e32bdd]{font-style:italic;color:var(--accent)}.cta__subtitle[data-v-80e32bdd]{max-width:58ch;margin:0 auto var(--space-8);font-family:var(--font-sans);font-size:var(--fs-base);line-height:var(--lh-relaxed);color:var(--text-muted)}.cta__actions[data-v-80e32bdd]{display:flex;flex-wrap:wrap;gap:var(--space-4);justify-content:center}@media(max-width:900px){.hero__grid[data-v-80e32bdd]{grid-template-columns:1fr}.hero__title[data-v-80e32bdd]{font-size:var(--fs-4xl)}.grid-3[data-v-80e32bdd],.journal[data-v-80e32bdd]{grid-template-columns:1fr}.block__head--row[data-v-80e32bdd]{flex-direction:column;align-items:flex-start}}@media(max-width:680px){.work__row[data-v-80e32bdd]{grid-template-columns:1fr;gap:var(--space-3)}.work__go[data-v-80e32bdd],.work__no[data-v-80e32bdd]{display:none}.stats[data-v-80e32bdd]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.anim[data-v-80e32bdd]{animation:none}.jpost__arrow[data-v-80e32bdd],.work__go[data-v-80e32bdd],.work__row[data-v-80e32bdd]{transition:none}.work__row--link[data-v-80e32bdd]:hover{padding-left:var(--space-3)}.work__row--link:hover .work__go[data-v-80e32bdd]{transform:none}}</style><style>.hexrow[data-v-a86d2094]{display:flex;gap:var(--space-5);margin:0;padding:0;list-style:none}</style><style>.hex[data-v-274e53e2]{display:inline-flex;align-items:center;justify-content:center;width:46px;height:53px;font-size:20px;color:var(--text-muted);cursor:pointer;background:var(--surface-2);clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);transition:color var(--dur-base) var(--ease-standard),background var(--dur-base) var(--ease-standard)}.hex[data-v-274e53e2]:hover{color:var(--ink-on-accent);background:var(--accent)}.hex[data-v-274e53e2]:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.hex__label[data-v-274e53e2]{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;white-space:nowrap;border:0;clip-path:inset(50%)}@media(prefers-reduced-motion:reduce){.hex[data-v-274e53e2]{transition:none}}</style><style>.zcard[data-v-c5ec7be1]{position:relative;overflow:hidden;background:var(--bg-card);color:var(--text-body);border:1px solid var(--border-subtle);border-radius:var(--radius-md);box-shadow:var(--shadow-2),var(--shadow-hairline);transition:border-color var(--dur-base) var(--ease-standard),transform var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-standard)}.zcard--pad[data-v-c5ec7be1]{padding:var(--space-6)}.zcard--interactive[data-v-c5ec7be1]{cursor:pointer}.zcard--interactive[data-v-c5ec7be1]:hover{border-color:var(--border-strong);transform:translateY(-2px);box-shadow:var(--shadow-3),var(--shadow-hairline)}.zcard--interactive[data-v-c5ec7be1]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.zcard--accent[data-v-c5ec7be1]:before{content:"";position:absolute;inset:0 0 auto;height:2px;background:linear-gradient(90deg,var(--accent),var(--aubergine-light))}.zcard--featured[data-v-c5ec7be1]{border-color:var(--accent-ring);box-shadow:var(--glow-accent),var(--shadow-hairline)}@media(prefers-reduced-motion:reduce){.zcard[data-v-c5ec7be1]{transition:none}.zcard--interactive[data-v-c5ec7be1]:hover{transform:none}}</style><style>.ztag[data-v-6db1c85c]{display:inline-flex;align-items:center;gap:var(--space-2);box-sizing:border-box;height:26px;padding:0 var(--space-3);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:var(--fw-regular);line-height:1;white-space:nowrap;color:var(--text-body);background:var(--surface-2);border:1px solid var(--border-subtle);border-radius:var(--radius-pill);transition:border-color var(--dur-fast) var(--ease-standard),color var(--dur-fast) var(--ease-standard)}.ztag[data-v-6db1c85c]:before{content:"#";color:var(--accent)}.ztag--plain[data-v-6db1c85c]:before{display:none;content:none}.ztag--clickable[data-v-6db1c85c]{cursor:pointer}.ztag--clickable[data-v-6db1c85c]:hover{border-color:var(--border-strong);color:var(--text-strong)}.ztag--clickable[data-v-6db1c85c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.ztag__remove[data-v-6db1c85c]{display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;margin-right:-2px;padding:0;font-family:var(--font-mono);font-size:var(--fs-sm);line-height:1;color:var(--text-muted);cursor:pointer;background:none;border:none;border-radius:var(--radius-circle)}.ztag__remove[data-v-6db1c85c]:hover{color:var(--term-red)}.ztag__remove[data-v-6db1c85c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}@media(prefers-reduced-motion:reduce){.ztag[data-v-6db1c85c]{transition:none}}</style><link rel="stylesheet" href="/_nuxt/entry.QaoIl47T.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZButton.CyAD_ftR.css" crossorigin><link rel="stylesheet" href="/_nuxt/LinkListComponent.BRYW5MSq.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZBadge.BAw1B01J.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZTag.f2Aq6DLg.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZCard.C5C9a-aj.css" crossorigin><link rel="modulepreload" as="script" crossorigin href="/_nuxt/kT-s8AA-.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/94XchtD0.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CZy76wlf.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/DlAUqK2U.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CDaHTzsF.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/DMhLy-fw.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CMQEDqfi.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/OpxrMEpG.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/C93KKm9n.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/1LEPDT53.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/ZsGxQ2mD.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/p0temu7u.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/BGMjmYXP.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CXmFvnQY.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/DvmfV0_A.js"><script type="module" src="/_nuxt/kT-s8AA-.js" crossorigin></script><meta name="description" content="Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL."><link rel="icon" type="image/x-icon" href="/favicon.ico"><script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","@id":"https://jouan.ovh/#organization","name":"Simon Jouan","url":"https://jouan.ovh","logo":"https://jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Rouen, France","addressCountry":"FR"}}</script><link rel="canonical" href="https://jouan.ovh"><script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"Simon Jouan — Développeur Full Stack TypeScript","url":"https://jouan.ovh","description":"Développeur Full Stack TypeScript — Nuxt / NestJS"}</script><script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Simon Jouan","jobTitle":"Développeur Full Stack TypeScript — Nuxt / NestJS","url":"https://jouan.ovh","image":"https://jouan.ovh/images/portrait.jpeg","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Rouen, France","addressCountry":"FR"}}</script><meta property="og:title" content="Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS"><meta property="og:description" content="Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL."><meta property="og:url" content="https://jouan.ovh"><meta property="og:type" content="website"><meta property="og:image" content="https://jouan.ovh/images/portrait.jpeg"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS"><meta name="twitter:description" content="Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL."><meta name="twitter:image" content="https://jouan.ovh/images/portrait.jpeg"></head><body><div id="__nuxt"><div class="init" data-v-e3708db0><header class="hdr" data-v-e3708db0 data-v-a782489c><div class="hdr__in" data-v-a782489c><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__brand" data-v-a782489c><svg class="zicon hdr__logo" viewbox="0 0 24 24" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><path d="M12 1.5 22.5 12 12 22.5 1.5 12z" fill="currentColor"/><path d="M12 1.5 22.5 12 12 12z" fill="#fff" fill-opacity="0.12"/></svg><b data-v-a782489c>jouan.ovh</b></a><nav class="hdr__nav" aria-label="Navigation principale" data-v-a782489c><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__link hdr__link--active" data-v-a782489c>Accueil</a><a href="/services" class="hdr__link" data-v-a782489c>Services</a><a href="/about" class="hdr__link" data-v-a782489c>À propos</a><a href="/blog" class="hdr__link" data-v-a782489c>Blog</a><a href="/contact" class="hdr__link" data-v-a782489c>Contact</a><!--]--></nav><div class="hdr__right" data-v-a782489c><div class="current-time hdr__clock" data-v-a782489c data-v-1e5503b4></div><span class="zbadge zbadge--success hdr__badge" data-v-a782489c data-v-fc077828><span class="zbadge__dot" aria-hidden="true" data-v-fc077828></span><!--[-->Disponible<!--]--></span><button class="hdr__action zbtn zbtn--terminal zbtn--sm" type="button" data-v-a782489c data-v-c154e5b1><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg><!--]--></span><!--[--> Terminal <!--]--><!----></button><a href="/contact" class="hdr__action zbtn zbtn--primary zbtn--sm" data-v-a782489c data-v-c154e5b1><!----><!--[--> Démarrer un projet <!--]--><!----></a><button class="hdr__burger" type="button" aria-expanded="false" aria-controls="hdr-mobile-menu" aria-label="Ouvrir le menu" data-v-a782489c><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg></button></div></div><!----><nav id="hdr-mobile-menu" class="hdr__menu" aria-label="Navigation mobile" data-v-a782489c><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__menu-link hdr__menu-link--active" data-v-a782489c>Accueil</a><a href="/services" class="hdr__menu-link" data-v-a782489c>Services</a><a href="/about" class="hdr__menu-link" data-v-a782489c>À propos</a><a href="/blog" class="hdr__menu-link" data-v-a782489c>Blog</a><a href="/contact" class="hdr__menu-link" data-v-a782489c>Contact</a><!--]--><div class="hdr__menu-actions" data-v-a782489c><button class="zbtn zbtn--terminal zbtn--sm" type="button" data-v-a782489c data-v-c154e5b1><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg><!--]--></span><!--[--> Terminal <!--]--><!----></button><a href="/contact" class="zbtn zbtn--primary zbtn--sm" data-v-a782489c data-v-c154e5b1><!----><!--[--> Démarrer un projet <!--]--><!----></a></div></nav><div data-v-a782489c><!--[--><!--]--></div></header><!--[--><main class="home" data-v-80e32bdd><span data-v-80e32bdd></span><div class="atmos" aria-hidden="true" data-v-80e32bdd data-v-796c86c1><div class="aurora aurora--auberg" data-v-796c86c1></div><div class="aurora aurora--orange" data-v-796c86c1></div><div class="aurora aurora--red" data-v-796c86c1></div><div class="grid-dots" data-v-796c86c1></div><div class="scanlines" data-v-796c86c1></div><div class="vignette" data-v-796c86c1></div></div><!----><section class="hero hero__grad" data-v-80e32bdd><div class="hero__in container" data-v-80e32bdd><div class="hero__grid" data-v-80e32bdd><div class="anim hero__text" data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p><h1 class="hero__title" data-v-80e32bdd>Développeur Full Stack TypeScript</h1><p class="hero__sub" data-v-80e32bdd> Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l&#39;architecture au déploiement, j&#39;interviens sur des produits neufs comme sur des applications existantes. </p><div class="hero__badge-wrap" data-v-80e32bdd><span class="hero__pulse-dot" aria-hidden="true" data-v-80e32bdd></span><span data-v-80e32bdd>Disponible pour missions freelance</span><!--[--><span aria-hidden="true" data-v-80e32bdd> · </span><a href="https://www.malt.fr/profile/simonjouan" rel="noopener" target="_blank" data-v-80e32bdd><!--[--> Profil Malt vérifié <!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a><!--]--></div><div class="hero__cta" data-v-80e32bdd><a href="/contact" class="zbtn zbtn--primary zbtn--lg" data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Discuter de votre projet <!--]--><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg><!--]--></span></a><a href="/about" class="zbtn zbtn--secondary zbtn--lg" data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Voir le parcours &amp; CV <!--]--><!----></a></div></div><div class="anim hero__term-col" data-v-80e32bdd><div class="hero-term" data-v-80e32bdd data-v-313a6524><div class="hero-term__bar" data-v-313a6524><span class="hero-term__dots" aria-hidden="true" data-v-313a6524><span class="hero-term__dot hero-term__dot--close" data-v-313a6524></span><span class="hero-term__dot hero-term__dot--min" data-v-313a6524></span><span class="hero-term__dot hero-term__dot--max" data-v-313a6524></span></span><span class="hero-term__title" data-v-313a6524>anon.@jouan.ovh: ~</span></div><div class="hero-term__body" data-v-313a6524><!--[--><!--]--><!----><!----><noscript data-v-313a6524><div data-v-313a6524><!--[--><!--[--><p class="hero-term__line" data-v-313a6524><span class="prm" data-v-313a6524><span class="prm__user" data-v-313a6524>anon.@jouan.ovh</span><span class="prm__sep" data-v-313a6524>:</span><span class="prm__dir" data-v-313a6524>~</span><span class="prm__sep" data-v-313a6524>$ </span><span class="prm__cmd" data-v-313a6524>whoami</span></span></p><p class="hero-term__out--ink hero-term__out" data-v-313a6524>Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)</p><!--]--><!--[--><p class="hero-term__line" data-v-313a6524><span class="prm" data-v-313a6524><span class="prm__user" data-v-313a6524>anon.@jouan.ovh</span><span class="prm__sep" data-v-313a6524>:</span><span class="prm__dir" data-v-313a6524>~</span><span class="prm__sep" data-v-313a6524>$ </span><span class="prm__cmd" data-v-313a6524>cat focus.txt</span></span></p><p class="hero-term__out--blue hero-term__out" data-v-313a6524>SaaS, web apps, clean architecture, automated testing (QA) &amp; AI engineering</p><!--]--><!--[--><p class="hero-term__line" data-v-313a6524><span class="prm" data-v-313a6524><span class="prm__user" data-v-313a6524>anon.@jouan.ovh</span><span class="prm__sep" data-v-313a6524>:</span><span class="prm__dir" data-v-313a6524>~</span><span class="prm__sep" data-v-313a6524>$ </span><span class="prm__cmd" data-v-313a6524>ls ~/projets</span></span></p><p class="hero-term__out--green hero-term__out" data-v-313a6524>keova.app/  tryon-saas/  nodium-lab/</p><!--]--><!--]--></div></noscript></div></div></div></div></div></section><div class="marquee" aria-hidden="true" data-v-80e32bdd data-v-19576991><div class="marquee__track" data-v-19576991><!--[--><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>TypeScript</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Nuxt 4</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Vue.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>NestJS</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Node.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>PostgreSQL</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>TypeORM</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Stripe Connect</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Cypress</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Docker</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>REST API</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Vitest</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><!--]--><!--[--><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>TypeScript</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Nuxt 4</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Vue.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>NestJS</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Node.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>PostgreSQL</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>TypeORM</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Stripe Connect</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Cypress</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Docker</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>REST API</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Vitest</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><!--]--></div></div><section class="section" data-v-80e32bdd><div class="container" data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>ce que je propose</p><h2 class="section__title" data-v-80e32bdd>Trois expertises pour concevoir et faire évoluer vos applications</h2><ul class="grid-3" data-v-80e32bdd><!--[--><li data-v-80e32bdd><div class="offer zcard zcard--pad zcard--interactive" data-v-80e32bdd data-v-c5ec7be1><!--[--><div class="offer__top" data-v-80e32bdd><div class="offer__icon" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div><span class="offer__no" data-v-80e32bdd>01 / 03</span></div><h3 class="offer__title" data-v-80e32bdd>Création d&#39;applications web &amp; SaaS</h3><p class="offer__desc" data-v-80e32bdd>De l&#39;idée à la production : architecture, développement front &amp; back, base de données, authentification et paiements Stripe.</p><ul class="offer__points" data-v-80e32bdd><!--[--><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Architecture logicielle &amp; APIs REST</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Applications Vue 3 / Nuxt 4 &amp; NestJS</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Intégration Stripe &amp; PostgreSQL</span></li><!--]--></ul><ul class="hero__tags offer__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->NestJS<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->PostgreSQL<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Stripe Connect<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-80e32bdd><span data-v-80e32bdd>Sur devis / au sprint</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Création d&#39;applications web &amp; SaaS" data-v-80e32bdd> En savoir plus → </a><!--]--></div></li><li data-v-80e32bdd><div class="offer zcard zcard--pad zcard--interactive zcard--accent zcard--featured" data-v-80e32bdd data-v-c5ec7be1><!--[--><div class="offer__top" data-v-80e32bdd><div class="offer__icon" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg></div><span class="offer__no" data-v-80e32bdd>02 / 03</span></div><h3 class="offer__title" data-v-80e32bdd>Développement Full Stack TypeScript</h3><p class="offer__desc" data-v-80e32bdd>Renfort d&#39;équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.</p><ul class="offer__points" data-v-80e32bdd><!--[--><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Composants Vue 3 / Nuxt avec TypeScript strict</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Microservices &amp; backend modulaire NestJS</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Fiabilisation et optimisation des performances</span></li><!--]--></ul><ul class="hero__tags offer__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->TypeScript<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Vue 3<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->NestJS<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Node.js<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-80e32bdd><span data-v-80e32bdd>Sur devis / TJM</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Développement Full Stack TypeScript" data-v-80e32bdd> En savoir plus → </a><!--]--></div></li><li data-v-80e32bdd><div class="offer zcard zcard--pad zcard--interactive" data-v-80e32bdd data-v-c5ec7be1><!--[--><div class="offer__top" data-v-80e32bdd><div class="offer__icon" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M12 3l1.8 5.6L19.5 10l-5.7 1.4L12 17l-1.8-5.6L4.5 10l5.7-1.4z"/><path d="M19 15l.7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9z"/></svg></div><span class="offer__no" data-v-80e32bdd>03 / 03</span></div><h3 class="offer__title" data-v-80e32bdd>Évolution &amp; Architecture applicative</h3><p class="offer__desc" data-v-80e32bdd>Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).</p><ul class="offer__points" data-v-80e32bdd><!--[--><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Audits techniques de code &amp; migrations de versions</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Tests E2E Cypress &amp; tests unitaires Vitest</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Pipelines CI/CD &amp; conteneurisation Docker</span></li><!--]--></ul><ul class="hero__tags offer__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Cypress<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Vitest<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Docker<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->CI/CD<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-80e32bdd><span data-v-80e32bdd>Au forfait / audit</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Évolution &amp; Architecture applicative" data-v-80e32bdd> En savoir plus → </a><!--]--></div></li><!--]--></ul></div></section><section class="section section--sunken" data-v-80e32bdd><div class="container" data-v-80e32bdd><div class="block__head" data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>projets sélectionnés</p><h2 class="section__title" data-v-80e32bdd>Des produits qui tournent en production</h2></div><ul class="work" data-v-80e32bdd><!--[--><li data-v-80e32bdd><a href="https://keova.app" rel="noopener" target="_blank" class="work__row work__row--link" data-hot data-v-80e32bdd><!--[--><span class="work__no" data-v-80e32bdd>01</span><div class="work__main" data-v-80e32bdd><div class="work__topline" data-v-80e32bdd><h3 class="work__name" data-v-80e32bdd>keova.app</h3><span class="work__status" data-v-80e32bdd>En production</span></div><p class="work__role" data-v-80e32bdd>Co-fondateur &amp; Développeur Full Stack</p><p class="prose work__desc" data-v-80e32bdd>Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).</p><ul class="hero__tags work__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nest.js<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->postgresql<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->stripe<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->saas<!--]--><!----></span></li><!--]--></ul></div><span class="work__go" aria-hidden="true" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-80e32bdd><div class="work__row" data-v-80e32bdd><span class="work__no" data-v-80e32bdd>02</span><div class="work__main" data-v-80e32bdd><div class="work__topline" data-v-80e32bdd><h3 class="work__name" data-v-80e32bdd>TryOn</h3><span class="work__status" data-v-80e32bdd>Étude de cas (MVP livré)</span></div><p class="work__role" data-v-80e32bdd>CTO &amp; Développeur Full Stack</p><p class="prose work__desc" data-v-80e32bdd>Plateforme SaaS B2B d&#39;essayage virtuel de vêtements via l&#39;IA générative (diffusion models, microservices asynchrones, files Redis).</p><ul class="hero__tags work__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nest.js<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->python<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->comfyui<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->ia<!--]--><!----></span></li><!--]--></ul></div><!----></div></li><li data-v-80e32bdd><div class="work__row" data-v-80e32bdd><span class="work__no" data-v-80e32bdd>03</span><div class="work__main" data-v-80e32bdd><div class="work__topline" data-v-80e32bdd><h3 class="work__name" data-v-80e32bdd>Nodium</h3><span class="work__status" data-v-80e32bdd>R&amp;D / En cours</span></div><p class="work__role" data-v-80e32bdd>Créateur &amp; Ingénieur IA</p><p class="prose work__desc" data-v-80e32bdd>Plateforme desktop d&#39;orchestration d&#39;agents IA autonomes, gestion de permissions et mémoire contextuelle.</p><ul class="hero__tags work__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->typescript<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->electron<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->agents<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->ia<!--]--><!----></span></li><!--]--></ul></div><!----></div></li><!--]--></ul><ul class="stats" data-v-80e32bdd><!--[--><li class="stat" data-v-80e32bdd><b data-v-80e32bdd>11</b><span data-v-80e32bdd>années d&#39;expérience web</span></li><li class="stat" data-v-80e32bdd><b data-v-80e32bdd>100%</b><span data-v-80e32bdd>TypeScript &amp; SaaS de bout en bout</span></li><li class="stat" data-v-80e32bdd><b data-v-80e32bdd>QA</b><span data-v-80e32bdd>culture d&#39;automatisation &amp; zéro régression</span></li><!--]--></ul></div></section><section class="section" data-v-80e32bdd><div class="container" data-v-80e32bdd><div class="block__head block__head--row" data-v-80e32bdd><div data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>~/journal</p><h2 class="section__title" data-v-80e32bdd>Notes de dev, écrites en construisant</h2></div><a href="/blog" class="seeall" data-hot data-v-80e32bdd> cat tous-les-articles <svg class="zicon seeall__icon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></a></div><div class="journal__empty zcard zcard--pad" data-v-80e32bdd data-v-c5ec7be1><!--[--><p class="journal__empty-code" data-v-80e32bdd>$ cat ~/journal/*.md</p><p class="journal__empty-text" data-v-80e32bdd>Les notes d&#39;ingénierie et retours d&#39;expérience sont en cours de rédaction.</p><a href="/blog" class="zbtn zbtn--secondary zbtn--sm" data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Consulter la section blog <!--]--><!----></a><!--]--></div></div></section><section class="section section--sunken" data-v-80e32bdd><div class="container" data-v-80e32bdd><div class="cta" data-v-80e32bdd><p class="eyebrow cta__eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>$ </span>./contact --start</p><h2 class="cta__title" data-v-80e32bdd>Un projet en tête ? Mettons-le <span class="cta__highlight" data-v-80e32bdd>en production</span>.</h2><p class="cta__subtitle" data-v-80e32bdd> Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript, parlons-en. </p><div class="cta__actions" data-v-80e32bdd><a href="/contact" class="zbtn zbtn--primary zbtn--lg" data-hot data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Discuter de votre projet <!--]--><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg><!--]--></span></a><a href="https://www.malt.fr/profile/simonjouan" rel="noopener" target="_blank" data-hot class="zbtn zbtn--secondary zbtn--lg" data-v-80e32bdd data-v-c154e5b1><!--[--><!----><!--[--> Me contacter sur Malt <!--]--><!----><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a><a href="/about" class="zbtn zbtn--ghost zbtn--lg" data-hot data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Voir le parcours &amp; CV <!--]--><!----></a></div></div></div></section></main><!--]--><footer class="ftr" data-v-e3708db0 data-v-ec74c766><div class="ftr__container" data-v-ec74c766><div class="ftr__in" data-v-ec74c766><div class="ftr__brand-col" data-v-ec74c766><a aria-current="page" href="/" class="router-link-active router-link-exact-active ftr__brand" data-v-ec74c766><svg class="zicon ftr__logo" viewbox="0 0 24 24" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-ec74c766 data-v-70d98695><path d="M12 1.5 22.5 12 12 22.5 1.5 12z" fill="currentColor"/><path d="M12 1.5 22.5 12 12 12z" fill="#fff" fill-opacity="0.12"/></svg><b data-v-ec74c766>jouan.ovh</b></a><p class="ftr__tagline" data-v-ec74c766>Développeur Full Stack TypeScript — Nuxt / NestJS. Rouen, France.</p></div><nav class="ftr__col" aria-label="Navigation du pied de page" data-v-ec74c766><h2 class="ftr__title" data-v-ec74c766>// Navigation</h2><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active ftr__link" data-v-ec74c766>Accueil</a><a href="/services" class="ftr__link" data-v-ec74c766>Services</a><a href="/about" class="ftr__link" data-v-ec74c766>À propos</a><a href="/blog" class="ftr__link" data-v-ec74c766>Blog</a><a href="/contact" class="ftr__link" data-v-ec74c766>Contact</a><a href="/confidentialite" class="ftr__link" data-v-ec74c766>Confidentialité</a><a href="/mentions-legales" class="ftr__link" data-v-ec74c766>Mentions légales</a><!--]--></nav><div class="ftr__col" data-v-ec74c766><h2 class="ftr__title" data-v-ec74c766>// Projets</h2><ul class="ftr__list" data-v-ec74c766><!--[--><li data-v-ec74c766><a href="https://keova.app" rel="noopener noreferrer" target="_blank" class="ftr__link" data-v-ec74c766><!--[-->keova.app<!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-ec74c766><span class="ftr__link ftr__link--static" data-v-ec74c766>TryOn</span></li><li data-v-ec74c766><span class="ftr__link ftr__link--static" data-v-ec74c766>Nodium</span></li><!--]--></ul></div><div class="ftr__col" data-v-ec74c766><h2 class="ftr__title" data-v-ec74c766>// Réseaux</h2><ul class="hexrow" data-v-ec74c766 data-v-a86d2094><!--[--><li data-v-a86d2094><a href="https://github.com/zohac" rel="noopener noreferrer" target="_blank" class="hex" data-v-a86d2094 data-v-274e53e2><!--[--><!--[--><svg class="zicon" viewbox="0 0 16 16" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a86d2094 data-v-70d98695><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg><!--]--><span class="hex__label" data-v-274e53e2><!--[-->GitHub<!--]--></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-a86d2094><a href="https://twitter.com/fenrir0680" rel="noopener noreferrer" target="_blank" class="hex" data-v-a86d2094 data-v-274e53e2><!--[--><!--[--><svg class="zicon" viewbox="0 0 16 16" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a86d2094 data-v-70d98695><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/></svg><!--]--><span class="hex__label" data-v-274e53e2><!--[-->Twitter<!--]--></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-a86d2094><a href="https://www.linkedin.com/in/simonjouan/" rel="noopener noreferrer" target="_blank" class="hex" data-v-a86d2094 data-v-274e53e2><!--[--><!--[--><svg class="zicon" viewbox="0 0 16 16" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a86d2094 data-v-70d98695><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg><!--]--><span class="hex__label" data-v-274e53e2><!--[-->LinkedIn<!--]--></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><!--]--></ul></div></div><div class="ftr__bottom" data-v-ec74c766><span data-v-ec74c766>© 2026 Simon Jouan — jouan.ovh</span><span class="ftr__term" data-v-ec74c766>anon.@jouan.ovh:~$ <span class="ftr__cmd" data-v-ec74c766>echo &quot;merci de votre visite&quot;</span></span></div></div></footer></div></div><div id="teleports"></div><script>window.__NUXT__={};window.__NUXT__.config={public:{web3formsAccessKey:"320b7ade-7b76-421e-a4bd-f353fd22348b",siteUrl:"https://jouan.ovh",mdc:{components:{prose:true,map:{},customElements:[]},headings:{anchorLinks:{h1:false,h2:true,h3:true,h4:true,h5:false,h6:false}},highlight:false},content:{wsUrl:""}},app:{baseURL:"/",buildId:"2fb32740-4322-408a-893a-7d31d08f3e02",buildAssetsDir:"/_nuxt/",cdnURL:""}}</script><script type="application/json" data-nuxt-data="nuxt-app" data-ssr="true" id="__NUXT_DATA__">[["ShallowReactive",1],{"prerenderedAt":2,"data":3,"state":6,"once":8,"_errors":9,"serverRendered":11,"path":12},1789327523310,["ShallowReactive",4],{"home-articles":5},[],["Reactive",7],{},["Set"],["ShallowReactive",10],{"home-articles":-1},true,"\u002F"]</script></body></html>
./docs/implementation-artifacts/code-reviews/11-1/raw-blind-hunter.md:466:+  "cypress",
./docs/implementation-artifacts/code-reviews/11-1/raw-blind-hunter.md:632:+   - Stack ordonnée moderne : TypeScript, Nuxt, Vue, NestJS, Node.js, PostgreSQL, TypeORM, Stripe, Cypress, Docker, REST API, Vitest.
./docs/implementation-artifacts/code-reviews/11-1/raw-blind-hunter.md:701:docs/specs/spec-home-awwwards/sections-mapping.md:16:| **Marquee Stack** | Défilé continu des technologies prioritaires | Stack moderne ciblée : TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API. | Ruban visuel continu alimenté par `SITE.skills`. |
./docs/implementation-artifacts/code-reviews/11-1/raw-blind-hunter.md:1565:  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
./docs/implementation-artifacts/code-reviews/11-1/raw-blind-hunter.md:1665:docs/specs/spec-home-awwwards/sections-mapping.md:16:| **Marquee Stack** | Défilé continu des technologies prioritaires | Stack moderne ciblée : TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API. | Ruban visuel continu alimenté par `SITE.skills`. |
./docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md:626:    desc: "Tests automatisés — Node.js, TypeScript, TestCafé.",
./docs/implementation-artifacts/code-reviews/11-5/raw-blind-hunter.md:112:-    desc: "Tests automatisés — Node.js, TypeScript, TestCafé.",
./docs/implementation-artifacts/code-reviews/11-5/raw-blind-hunter.md:113:+    desc: "Tests automatisés et fiabilisation applicative — Node.js, TypeScript, TestCafé.",
./docs/implementation-artifacts/code-reviews/11-5/raw-blind-hunter.md:240:  "cypress",
./docs/implementation-artifacts/code-reviews/11-5/raw-blind-hunter.md:691:docs/implementation-artifacts/code-reviews/11-4/raw-acceptance-auditor.md:5537:1:<!DOCTYPE html><html  lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Simon Jouan — Développeur Full Stack TypeScript · Nuxt &amp; NestJS</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400;1,700&display=swap"><style>.ftr[data-v-ec74c766]{margin-top:auto;background:var(--surface-1);border-top:1px solid var(--border-subtle);padding:var(--space-12) 0 var(--space-8)}.ftr__container[data-v-ec74c766]{width:100%;max-width:var(--container-xl);margin:0 auto;padding:0 var(--space-6)}.ftr__in[data-v-ec74c766]{display:flex;flex-wrap:wrap;gap:var(--space-8);align-items:flex-start;justify-content:space-between}.ftr__brand-col[data-v-ec74c766]{max-width:300px}.ftr__brand[data-v-ec74c766]{display:inline-flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-3);text-decoration:none}.ftr__brand .ftr__logo[data-v-ec74c766]{font-size:22px;color:var(--accent)}.ftr__brand b[data-v-ec74c766]{font-family:var(--font-mono);font-size:var(--fs-md);font-weight:var(--fw-bold);color:var(--text-strong)}.ftr__brand[data-v-ec74c766]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-sm);box-shadow:var(--ring-accent)}.ftr__tagline[data-v-ec74c766]{margin:0;font-size:var(--fs-sm);color:var(--text-muted)}.ftr__col[data-v-ec74c766]{display:flex;flex-direction:column}.ftr__title[data-v-ec74c766]{margin:0 0 var(--space-3);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:var(--fw-regular);letter-spacing:var(--ls-wider);text-transform:uppercase;color:var(--text-muted)}.ftr__list[data-v-ec74c766]{display:flex;flex-direction:column;padding:0;margin:0;list-style:none}.ftr__link[data-v-ec74c766]{display:block;padding:var(--space-1) 0;font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-body);text-decoration:none;transition:color var(--dur-fast) var(--ease-standard)}.ftr__link[data-v-ec74c766]:hover{color:var(--accent)}.ftr__link[data-v-ec74c766]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-xs);box-shadow:var(--ring-accent)}.ftr__link--static[data-v-ec74c766]{cursor:default}.ftr__bottom[data-v-ec74c766],.ftr__link--static[data-v-ec74c766],.ftr__link--static[data-v-ec74c766]:hover{color:var(--text-muted)}.ftr__bottom[data-v-ec74c766]{display:flex;flex-wrap:wrap;gap:var(--space-3);justify-content:space-between;margin-top:var(--space-8);padding-top:var(--space-5);font-family:var(--font-mono);font-size:var(--fs-xs);border-top:1px solid var(--border-subtle)}.ftr__cmd[data-v-ec74c766]{color:var(--term-green)}@media(prefers-reduced-motion:reduce){.ftr__link[data-v-ec74c766]{transition:none}}</style><style>.terminal{box-sizing:border-box;position:fixed;top:60px;left:15px;z-index:1000;width:600px;height:400px;overflow:hidden;resize:both;font-family:var(--font-mono);color:var(--ink-1);border:1px solid var(--border-terminal);border-radius:var(--radius-sm);box-shadow:var(--glow-terminal)}.terminal-header{position:relative;z-index:1;display:flex;flex-wrap:nowrap;align-items:center;gap:var(--space-2);height:30px;padding:0 var(--space-3);background:var(--aubergine-black);cursor:move}.terminal-header .terminal-dots{display:flex;align-items:center;gap:7px}.terminal-header .close-button{width:13px;height:13px;cursor:pointer;background-image:linear-gradient(to bottom right,var(--term-red),#8a0000);border-radius:var(--radius-circle);box-shadow:1px 1px 2px #080206}.terminal-header .close-button:hover{filter:brightness(1.2)}.terminal-header .close-button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.terminal-header .terminal-dot{width:13px;height:13px;border-radius:var(--radius-circle);opacity:.85}.terminal-header .terminal-dot--min{background:var(--term-yellow)}.terminal-header .terminal-dot--max{background:var(--term-green)}.terminal-header .header-text{position:absolute;inset:0;font-family:var(--font-mono);font-size:var(--fs-xs);letter-spacing:var(--ls-wide);line-height:30px;color:var(--text-muted);text-align:center;pointer-events:none}.terminal-body{height:calc(100% - 30px);margin:0;padding:var(--space-4);overflow:auto;font-size:var(--fs-sm);line-height:var(--lh-snug);white-space:pre-wrap;overflow-wrap:break-word;background:var(--bg-terminal)}.terminal-body .git-prompt,.terminal-body .git-prompt-directory,.terminal-body .git-prompt-separator{display:inline}.terminal-body .git-prompt,.terminal-body .git-prompt-directory{font-weight:var(--fw-bold)}.terminal-body .git-prompt{color:var(--prompt)}.terminal-body .git-prompt-separator{color:var(--ink-1);font-weight:var(--fw-regular)}.terminal-body .git-prompt-directory{color:var(--term-blue)}.terminal-body .user-input{margin:0;padding:0;font-family:inherit;font-size:inherit;color:inherit;background-color:transparent;border:none;outline:none;caret-color:var(--prompt);caret-shape:block}.terminal-body .terminal-response{white-space:normal}.terminal-body::-webkit-scrollbar{width:10px}.terminal-body::-webkit-scrollbar-thumb{background:var(--aubergine);border-radius:var(--radius-pill)}@supports (backdrop-filter:blur(5px)) or (-webkit-backdrop-filter:blur(5px)){.terminal .terminal-body{background:color-mix(in srgb,var(--bg-terminal) 86%,transparent);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px)}}.terminal .resize-handle{position:absolute;right:0;bottom:0;width:16px;height:16px;background-color:transparent;cursor:nwse-resize}.table,table{--color-light:#ebebeb;--color-dark:#141414;--color-grey-light:#adadad;--margin:1em;border:1px dashed var(--color-light);margin:var(--margin)}.table thead,table thead{color:var(--color-dark);text-align:center;background-color:var(--color-light)}.table td,table td{padding:0 .5em}.table tbody tr:nth-child(2n),table tbody tr:nth-child(2n){background-color:var(--color-grey-light);color:var(--color-dark)}.table.w-100,table.w-100{width:calc(100% - var(--margin)*2)}.table.w-50,table.w-50{width:calc(50% - var(--margin)*2)}</style><style>.hdr[data-v-a782489c]{position:sticky;top:0;z-index:50;height:var(--header-height);background:color-mix(in srgb,var(--surface-0) 82%,transparent);border-bottom:1px solid var(--border-subtle);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}.hdr__in[data-v-a782489c]{display:flex;align-items:center;gap:var(--space-6);width:100%;max-width:var(--container-xl);height:100%;margin:0 auto;padding:0 var(--space-6)}.hdr__brand[data-v-a782489c]{display:inline-flex;align-items:center;gap:var(--space-2);text-decoration:none}.hdr__brand .hdr__logo[data-v-a782489c]{font-size:24px;color:var(--accent)}.hdr__brand b[data-v-a782489c]{font-family:var(--font-mono);font-size:var(--fs-md);font-weight:var(--fw-bold);color:var(--text-strong)}.hdr__brand[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-sm);box-shadow:var(--ring-accent)}.hdr__nav[data-v-a782489c]{display:flex;align-items:center;gap:var(--space-1);min-width:0;margin-left:var(--space-4)}.hdr__link[data-v-a782489c]{padding:var(--space-2) var(--space-3);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-muted);text-decoration:none;border-radius:var(--radius-sm);transition:color var(--dur-fast) var(--ease-standard),background var(--dur-fast) var(--ease-standard)}.hdr__link[data-v-a782489c]:hover{color:var(--text-strong);background:var(--surface-2)}.hdr__link[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hdr__link--active[data-v-a782489c]{color:var(--accent)}.hdr__right[data-v-a782489c]{display:flex;align-items:center;gap:var(--space-3);margin-left:auto}.hdr__clock[data-v-a782489c]{font-family:var(--font-mono);font-size:var(--fs-xs);color:var(--text-muted)}.hdr__burger[data-v-a782489c]{display:none;align-items:center;justify-content:center;width:36px;height:36px;font-size:20px;color:var(--text-strong);cursor:pointer;background:none;border:1px solid var(--border-default);border-radius:var(--radius-md)}.hdr__burger[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hdr__overlay[data-v-a782489c]{position:fixed;inset:var(--header-height) 0 0;z-index:40;background:var(--overlay)}.hdr__menu[data-v-a782489c]{display:none}@media(max-width:1100px){.hdr__clock[data-v-a782489c]{display:none}}@media(max-width:1000px){.hdr__badge[data-v-a782489c]{display:none}}@media(min-width:901px){.hdr__overlay[data-v-a782489c]{display:none}}@media(max-width:900px){.hdr__badge[data-v-a782489c],.hdr__clock[data-v-a782489c],.hdr__nav[data-v-a782489c],.hdr__right .hdr__action[data-v-a782489c]{display:none}.hdr__burger[data-v-a782489c]{display:inline-flex}.hdr__menu[data-v-a782489c]{position:fixed;inset:var(--header-height) 0 auto 0;z-index:45;display:flex;flex-direction:column;gap:var(--space-1);padding:var(--space-4) var(--space-6) var(--space-6);background:var(--surface-1);border-bottom:1px solid var(--border-subtle);box-shadow:var(--shadow-3);transform:translateY(-8px);opacity:0;visibility:hidden;transition:transform var(--dur-base) var(--ease-out),opacity var(--dur-base) var(--ease-standard),visibility var(--dur-base)}.hdr__menu--open[data-v-a782489c]{transform:translateY(0);opacity:1;visibility:visible}}.hdr__menu-link[data-v-a782489c]{padding:var(--space-3);font-family:var(--font-mono);font-size:var(--fs-base);color:var(--text-body);text-decoration:none;border-radius:var(--radius-sm)}.hdr__menu-link[data-v-a782489c]:hover{color:var(--text-strong);background:var(--surface-2)}.hdr__menu-link[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hdr__menu-link--active[data-v-a782489c]{color:var(--accent)}.hdr__menu-actions[data-v-a782489c]{display:flex;flex-direction:column;gap:var(--space-2);margin-top:var(--space-3)}@media(prefers-reduced-motion:reduce){.hdr__link[data-v-a782489c],.hdr__menu[data-v-a782489c]{transition:none}}</style><style>.init[data-v-e3708db0]{background:var(--bg-page);display:flex;flex-direction:column;margin:0;min-height:100vh;width:100%;max-width:100vw}</style><style>.zicon[data-v-70d98695]{display:inline-block;flex:none;width:1em;height:1em;vertical-align:middle}</style><style>.zbadge[data-v-fc077828]{display:inline-flex;align-items:center;gap:var(--space-2);box-sizing:border-box;height:22px;padding:0 var(--space-2);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:var(--fw-medium);line-height:1;letter-spacing:var(--ls-wide);white-space:nowrap;border:1px solid transparent;border-radius:var(--radius-sm)}.zbadge__dot[data-v-fc077828]{width:6px;height:6px;background:currentcolor;border-radius:var(--radius-circle)}.zbadge--neutral[data-v-fc077828]{background:var(--surface-3);color:var(--text-body);border-color:var(--border-default)}.zbadge--accent[data-v-fc077828]{background:var(--accent-soft);color:var(--accent);border-color:#f871164d}.zbadge--success[data-v-fc077828]{background:var(--success-soft);color:var(--success);border-color:#297a4880}.zbadge--warning[data-v-fc077828]{background:var(--warning-soft);color:var(--warning);border-color:#8b611880}.zbadge--danger[data-v-fc077828]{background:var(--danger-soft);color:var(--danger);border-color:#8a282880}.zbadge--info[data-v-fc077828]{background:var(--info-soft);color:var(--info);border-color:#255b7e80}</style><style>.zbtn[data-v-c154e5b1]{--_h:36px;--_px:var(--space-4);--_fs:var(--fs-sm);display:inline-flex;align-items:center;justify-content:center;gap:var(--space-2);box-sizing:border-box;height:var(--_h);padding:0 var(--_px);font-family:var(--font-mono);font-size:var(--_fs);font-weight:var(--fw-medium);line-height:1;letter-spacing:var(--ls-wide);white-space:nowrap;text-decoration:none;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;border:1px solid transparent;border-radius:var(--radius-md);transition:background var(--dur-fast) var(--ease-standard),border-color var(--dur-fast) var(--ease-standard),color var(--dur-fast) var(--ease-standard),transform var(--dur-fast) var(--ease-standard)}.zbtn[data-v-c154e5b1]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.zbtn[data-v-c154e5b1]:disabled,.zbtn[aria-disabled=true][data-v-c154e5b1]{opacity:.45;cursor:not-allowed;pointer-events:none}.zbtn__icon[data-v-c154e5b1]{display:inline-flex;width:1.05em;height:1.05em}.zbtn__icon[data-v-c154e5b1] svg{width:100%;height:100%}.zbtn--sm[data-v-c154e5b1]{--_h:28px;--_px:var(--space-3);--_fs:var(--fs-xs)}.zbtn--lg[data-v-c154e5b1]{--_h:44px;--_px:var(--space-5);--_fs:var(--fs-base)}.zbtn--primary[data-v-c154e5b1]{background:var(--accent);color:var(--accent-text);border-color:var(--accent)}.zbtn--primary[data-v-c154e5b1]:hover{background:var(--accent-hover);border-color:var(--accent-hover)}.zbtn--primary[data-v-c154e5b1]:active{background:var(--accent-active);border-color:var(--accent-active);transform:translateY(1px)}.zbtn--secondary[data-v-c154e5b1]{background:var(--surface-2);color:var(--text-strong);border-color:var(--border-default)}.zbtn--secondary[data-v-c154e5b1]:hover{background:var(--surface-3);border-color:var(--border-strong)}.zbtn--secondary[data-v-c154e5b1]:active{transform:translateY(1px)}.zbtn--ghost[data-v-c154e5b1]{background:transparent;color:var(--text-body);border-color:transparent}.zbtn--ghost[data-v-c154e5b1]:hover{background:var(--surface-2);color:var(--text-strong)}.zbtn--terminal[data-v-c154e5b1]{background:var(--bg-terminal);color:var(--term-green);border-color:var(--accent-2-soft)}.zbtn--terminal[data-v-c154e5b1]:hover{border-color:var(--term-green);box-shadow:var(--glow-terminal)}.zbtn--danger[data-v-c154e5b1]{background:var(--danger);color:var(--ink-on-accent);border-color:var(--danger)}.zbtn--danger[data-v-c154e5b1]:hover{filter:brightness(1.08)}.zbtn--danger[data-v-c154e5b1]:active{transform:translateY(1px)}@media(prefers-reduced-motion:reduce){.zbtn[data-v-c154e5b1]{transition:none}}</style><style>.boot[data-v-f59a7d91]{position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;cursor:pointer;background:var(--surface-0);transition:opacity var(--dur-slow) var(--ease-out),visibility var(--dur-slow)}.boot.boot--done[data-v-f59a7d91]{pointer-events:none;visibility:hidden;opacity:0}.boot__in[data-v-f59a7d91]{width:min(560px,88vw);font-family:var(--font-mono);font-size:var(--fs-sm)}.boot__logo[data-v-f59a7d91]{display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-5);color:var(--text-strong)}.boot__logo b[data-v-f59a7d91]{font-size:var(--fs-lg)}.boot__logo-icon[data-v-f59a7d91]{font-size:26px;color:var(--accent)}.boot__line[data-v-f59a7d91]{min-height:1.6em;color:var(--text-muted)}.boot__ok[data-v-f59a7d91]{color:var(--term-green)}.boot__bar[data-v-f59a7d91]{height:3px;margin-top:var(--space-5);overflow:hidden;background:var(--surface-3);border-radius:var(--radius-xs)}.boot__bar i[data-v-f59a7d91]{display:block;width:0;height:100%;background:linear-gradient(90deg,var(--accent),var(--aubergine-light));transition:width .1s linear}.boot__skip[data-v-f59a7d91]{display:inline-block;margin-top:var(--space-4);padding:0;font-family:inherit;font-size:var(--fs-xs);letter-spacing:var(--ls-wide);color:var(--text-faint);cursor:pointer;background:none;border:none}.boot__skip[data-v-f59a7d91]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}@media(prefers-reduced-motion:reduce){.boot[data-v-f59a7d91]{display:none}}</style><style>.atmos[data-v-796c86c1]{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none}.aurora[data-v-796c86c1]{position:absolute;border-radius:var(--radius-circle);filter:blur(80px);mix-blend-mode:screen;will-change:transform}.aurora--orange[data-v-796c86c1]{top:-22%;left:48%;width:60vw;height:60vw;background:radial-gradient(circle at center,var(--orange-500),transparent 62%);opacity:.55;animation:drift-orange-796c86c1 26s var(--ease-in-out) infinite}.aurora--auberg[data-v-796c86c1]{top:6%;left:-22%;width:64vw;height:64vw;background:radial-gradient(circle at center,var(--aubergine-vivid),transparent 62%);opacity:.7;animation:drift-auberg-796c86c1 32s var(--ease-in-out) infinite}.aurora--red[data-v-796c86c1]{top:44%;left:26%;width:44vw;height:44vw;background:radial-gradient(circle at center,var(--term-red),transparent 64%);opacity:.4;animation:drift-red-796c86c1 30s var(--ease-in-out) infinite}.grid-dots[data-v-796c86c1]{background-image:radial-gradient(color-mix(in srgb,var(--ink-1) 6%,transparent) 1px,transparent 1px);background-size:34px 34px;-webkit-mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,var(--surface-0) 30%,transparent 78%);mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,var(--surface-0) 30%,transparent 78%)}.grid-dots[data-v-796c86c1],.scanlines[data-v-796c86c1]{position:absolute;inset:0}.scanlines[data-v-796c86c1]{opacity:.35;background:repeating-linear-gradient(0deg,color-mix(in srgb,var(--surface-0) 24%,transparent) 0 1px,transparent 1px 3px)}.vignette[data-v-796c86c1]{position:absolute;inset:0;background:radial-gradient(ellipse 120% 90% at 50% 0,transparent 55%,var(--surface-0) 100%)}@keyframes drift-orange-796c86c1{0%,to{transform:translate(0) scale(1)}50%{transform:translate(-6vw,5vh) scale(1.12)}}@keyframes drift-auberg-796c86c1{0%,to{transform:translate(0) scale(1)}50%{transform:translate(7vw,-4vh) scale(1.08)}}@keyframes drift-red-796c86c1{0%,to{transform:translate(0) scale(1)}50%{transform:translate(-4vw,-6vh) scale(1.15)}}@media(prefers-reduced-motion:reduce){.aurora[data-v-796c86c1]{animation:none}}</style><style>.cursor-dot[data-v-0096a69c],.cursor-ring[data-v-0096a69c]{position:fixed;top:0;left:0;z-index:90;border-radius:var(--radius-circle);mix-blend-mode:difference;opacity:0;pointer-events:none;transition:opacity var(--dur-base) var(--ease-standard)}.cursor-dot.is-visible[data-v-0096a69c],.cursor-ring.is-visible[data-v-0096a69c]{opacity:1}.cursor-dot[data-v-0096a69c]{width:6px;height:6px;background:var(--ink-1)}.cursor-ring[data-v-0096a69c]{width:34px;height:34px;border:1px solid color-mix(in srgb,var(--ink-1) 70%,transparent);transition:width var(--dur-base) var(--ease-out),height var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out),opacity var(--dur-base) var(--ease-standard)}.cursor-ring.is-hot[data-v-0096a69c]{width:56px;height:56px;border-color:var(--accent)}@media(hover:none),(prefers-reduced-motion:reduce){.cursor-dot[data-v-0096a69c],.cursor-ring[data-v-0096a69c]{display:none}}</style><style>.hero-term[data-v-313a6524]{display:flex;flex-direction:column;min-height:300px;overflow:hidden;border:1px solid var(--accent-2-soft);border-radius:var(--radius-sm);box-shadow:var(--glow-terminal)}.hero-term__bar[data-v-313a6524]{position:relative;display:flex;flex:none;align-items:center;gap:var(--space-2);height:30px;padding:0 var(--space-3);background:var(--aubergine-black)}.hero-term__dots[data-v-313a6524]{display:flex;align-items:center;gap:7px}.hero-term__dot[data-v-313a6524]{width:13px;height:13px;border-radius:var(--radius-circle)}.hero-term__dot--close[data-v-313a6524]{background:var(--term-red)}.hero-term__dot--min[data-v-313a6524]{background:var(--term-yellow)}.hero-term__dot--max[data-v-313a6524]{background:var(--term-green)}.hero-term__title[data-v-313a6524]{position:absolute;inset:0;font-family:var(--font-mono);font-size:var(--fs-xs);letter-spacing:var(--ls-wide);color:var(--text-muted);text-align:center;pointer-events:none}.hero-term__body[data-v-313a6524]{flex:1;min-height:0;padding:var(--space-4);overflow:auto;font-family:var(--font-mono);font-size:var(--fs-sm);line-height:var(--lh-snug);color:var(--ink-1);background:var(--bg-terminal);overflow-wrap:break-word}@supports (backdrop-filter:blur(5px)){.hero-term__body[data-v-313a6524]{background:color-mix(in srgb,var(--bg-terminal) 86%,transparent);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px)}}.hero-term__line[data-v-313a6524]{margin:0}.hero-term__out[data-v-313a6524]{margin:0 0 var(--space-4)}.hero-term__out--ink[data-v-313a6524]{color:var(--ink-1)}.hero-term__out--blue[data-v-313a6524]{color:var(--term-blue)}.hero-term__out--green[data-v-313a6524]{color:var(--term-green)}.hero-term__open[data-v-313a6524]{display:block;width:100%;padding:0;font:inherit;text-align:left;cursor:pointer;background:none;border:none;border-radius:var(--radius-xs)}.hero-term__open[data-v-313a6524]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.prm[data-v-313a6524]{font-family:var(--font-mono)}.prm__user[data-v-313a6524]{font-weight:var(--fw-bold);color:var(--prompt)}.prm__sep[data-v-313a6524]{color:var(--ink-1)}.prm__dir[data-v-313a6524]{font-weight:var(--fw-bold);color:var(--term-blue)}.prm__cmd[data-v-313a6524]{color:var(--ink-1)}.prm__caret[data-v-313a6524]{display:inline-block;width:.55em;height:1.05em;margin-left:1px;vertical-align:text-bottom;background:var(--prompt);animation:caret-blink 1s steps(1) infinite}@media(prefers-reduced-motion:reduce){.prm__caret[data-v-313a6524]{animation:none}}</style><style>.marquee[data-v-19576991]{display:block;width:100%;padding-block:var(--space-5);overflow:hidden;border-block:1px solid var(--border-subtle);-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}.marquee:hover .marquee__track[data-v-19576991]{animation-play-state:paused}.marquee__track[data-v-19576991]{display:flex;gap:var(--space-8);width:-moz-max-content;width:max-content;will-change:transform;animation:scroll-x-19576991 32s linear infinite}.marquee__item[data-v-19576991]{display:inline-flex;gap:var(--space-8);align-items:center;font-family:var(--font-mono);font-size:var(--fs-xl);letter-spacing:var(--ls-wide);color:var(--text-faint);white-space:nowrap}.marquee__label[data-v-19576991]{font-weight:var(--fw-regular);color:var(--text-body)}.marquee__star[data-v-19576991]{color:var(--accent)}@keyframes scroll-x-19576991{0%{transform:translate(0)}to{transform:translate(calc(-50% - var(--space-8)/2))}}@media(prefers-reduced-motion:reduce){.marquee[data-v-19576991]{-webkit-mask-image:none;mask-image:none}.marquee__track[data-v-19576991]{animation:none}.marquee__item--duplicate[data-v-19576991]{display:none}}</style><style>.home[data-v-80e32bdd]{display:block}.anim[data-v-80e32bdd]{animation:fade-rise var(--dur-slow) var(--ease-out) both}.hero__term-col[data-v-80e32bdd]{animation-delay:80ms}.hero[data-v-80e32bdd]{position:relative;overflow:hidden}.hero__grad[data-v-80e32bdd]{background:radial-gradient(900px 500px at 78% -10%,color-mix(in srgb,var(--accent) 16%,transparent),transparent 60%),radial-gradient(700px 500px at 0 110%,color-mix(in srgb,var(--aubergine-vivid) 28%,transparent),transparent 60%),var(--bg-page)}.hero__in[data-v-80e32bdd]{position:relative;z-index:1;padding-block:var(--space-20)}.hero__grid[data-v-80e32bdd]{display:grid;grid-template-columns:1.05fr .95fr;gap:var(--space-12);align-items:center}.hero__title[data-v-80e32bdd]{font-family:var(--font-mono);font-size:var(--fs-6xl);font-weight:var(--fw-light);letter-spacing:var(--ls-tight);color:var(--text-strong)}.hero__title em[data-v-80e32bdd]{font-style:normal;color:var(--accent)}.hero__sub[data-v-80e32bdd]{max-width:46ch;margin:var(--space-5) 0 var(--space-6);font-family:var(--font-sans);font-size:var(--fs-lg);line-height:var(--lh-relaxed);color:var(--text-body)}.hero__cta[data-v-80e32bdd]{display:flex;flex-wrap:wrap;gap:var(--space-3);margin-bottom:var(--space-6)}.hero__badge-wrap[data-v-80e32bdd]{display:inline-flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-6);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-muted)}.hero__badge-wrap a[data-v-80e32bdd]{color:var(--accent);text-decoration:underline}.hero__badge-wrap a[data-v-80e32bdd]:hover{color:var(--accent-hover)}.hero__badge-wrap a[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hero__pulse-dot[data-v-80e32bdd]{width:8px;height:8px;border-radius:var(--radius-circle);background:var(--success);box-shadow:0 0 color-mix(in srgb,var(--success) 60%,transparent);animation:pulse-dot-80e32bdd 2.2s infinite var(--ease-out)}@media(prefers-reduced-motion:reduce){.hero__pulse-dot[data-v-80e32bdd]{animation:none}}@keyframes pulse-dot-80e32bdd{0%{box-shadow:0 0 color-mix(in srgb,var(--success) 60%,transparent)}70%{box-shadow:0 0 0 6px color-mix(in srgb,var(--success) 0%,transparent)}to{box-shadow:0 0 color-mix(in srgb,var(--success) 0%,transparent)}}.section__title[data-v-80e32bdd]{margin-bottom:var(--space-8);font-family:var(--font-mono);font-size:var(--fs-3xl);font-weight:var(--fw-regular);color:var(--text-strong)}.grid-3[data-v-80e32bdd]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-5);margin:0;padding:0;list-style:none}.grid-3>li[data-v-80e32bdd],.offer[data-v-80e32bdd]{display:flex}.offer[data-v-80e32bdd]{flex-direction:column;width:100%}.offer__top[data-v-80e32bdd]{justify-content:space-between;margin-bottom:var(--space-4)}.offer__icon[data-v-80e32bdd],.offer__top[data-v-80e32bdd]{display:flex;align-items:center}.offer__icon[data-v-80e32bdd]{justify-content:center;width:var(--space-10);height:var(--space-10);font-size:22px;color:var(--accent);background:var(--accent-soft);border-radius:var(--radius-md)}.offer__no[data-v-80e32bdd]{font-size:var(--fs-xs);letter-spacing:var(--ls-wider);color:var(--text-faint)}.offer__no[data-v-80e32bdd],.offer__title[data-v-80e32bdd]{font-family:var(--font-mono)}.offer__title[data-v-80e32bdd]{margin-bottom:var(--space-2);font-size:var(--fs-xl);font-weight:var(--fw-regular);color:var(--text-strong)}.offer__desc[data-v-80e32bdd]{margin:0 0 var(--space-4);font-family:var(--font-sans);font-size:var(--fs-sm);line-height:var(--lh-relaxed);color:var(--text-body)}.offer__points[data-v-80e32bdd]{display:flex;flex-direction:column;gap:var(--space-2);margin:0 0 var(--space-4);padding:0;list-style:none}.offer__points li[data-v-80e32bdd]{display:flex;gap:var(--space-2);align-items:flex-start;font-family:var(--font-mono);font-size:var(--fs-xs);line-height:var(--lh-normal);color:var(--text-muted)}.offer__check[data-v-80e32bdd]{flex-shrink:0;margin-top:calc(var(--space-1)/2);font-size:var(--fs-sm);color:var(--term-green)}.offer__tags[data-v-80e32bdd]{margin-bottom:var(--space-4)}.offer__price[data-v-80e32bdd]{margin-top:auto;padding-top:var(--space-4);border-top:1px dashed var(--border-subtle);font-size:var(--fs-xs)}.offer__more[data-v-80e32bdd],.offer__price[data-v-80e32bdd]{font-family:var(--font-mono);color:var(--accent)}.offer__more[data-v-80e32bdd]{margin-top:var(--space-3);font-size:var(--fs-sm);text-decoration:none}.offer__more[data-v-80e32bdd]:hover{text-decoration:underline}.offer__more[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent);border-radius:var(--radius-xs)}.work[data-v-80e32bdd]{display:flex;flex-direction:column;margin:0;padding:0;list-style:none}.work>li[data-v-80e32bdd]{display:block;width:100%}.work__row[data-v-80e32bdd]{position:relative;display:grid;grid-template-columns:56px 1fr auto;gap:var(--space-6);align-items:center;padding:var(--space-8) var(--space-3);border-top:1px solid var(--border-subtle);text-decoration:none;color:inherit;transition:padding-left var(--dur-slow) var(--ease-out),background var(--dur-slow) var(--ease-standard)}.work__row[data-v-80e32bdd]:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,var(--accent-soft),transparent 60%);opacity:0;transition:opacity var(--dur-slow) var(--ease-standard)}li:last-child .work__row[data-v-80e32bdd]{border-bottom:1px solid var(--border-subtle)}.work__row--link[data-v-80e32bdd]{cursor:pointer}.work__row--link[data-v-80e32bdd]:hover{padding-left:var(--space-6)}.work__row--link[data-v-80e32bdd]:hover:before{opacity:1}.work__row--link:hover .work__name[data-v-80e32bdd]{color:var(--accent)}.work__row--link:hover .work__go[data-v-80e32bdd]{color:var(--accent);transform:translate(6px,-6px)}.work__row--link[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent);border-radius:var(--radius-xs)}.work__no[data-v-80e32bdd]{font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-faint)}.work__main[data-v-80e32bdd],.work__no[data-v-80e32bdd]{position:relative}.work__topline[data-v-80e32bdd]{display:flex;flex-wrap:wrap;align-items:baseline;gap:var(--space-3)}.work__name[data-v-80e32bdd]{margin:0;font-family:var(--font-mono);font-size:clamp(1.4rem,2.8vw,2rem);font-weight:var(--fw-regular);letter-spacing:var(--ls-tight);color:var(--text-strong);transition:color var(--dur-base) var(--ease-standard)}.work__status[data-v-80e32bdd]{color:var(--accent);letter-spacing:var(--ls-wide)}.work__role[data-v-80e32bdd],.work__status[data-v-80e32bdd]{font-family:var(--font-mono);font-size:var(--fs-xs)}.work__role[data-v-80e32bdd]{margin:var(--space-1) 0 0;color:var(--text-muted)}.work__desc[data-v-80e32bdd]{max-width:65ch;margin:var(--space-3) 0 0;font-size:var(--fs-sm)}.work__tags[data-v-80e32bdd]{margin-top:var(--space-4)}.work__go[data-v-80e32bdd]{position:relative;font-size:var(--fs-xl);color:var(--text-faint);transition:transform var(--dur-base) var(--ease-out),color var(--dur-base) var(--ease-standard)}.stats[data-v-80e32bdd]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin:var(--space-12) 0 0;padding:0;list-style:none}.stat[data-v-80e32bdd]{padding:var(--space-6);background:color-mix(in srgb,var(--surface-1) 70%,transparent);border:1px solid var(--border-subtle);border-radius:var(--radius-md)}.stat b[data-v-80e32bdd]{display:block;margin-bottom:var(--space-1);font-size:var(--fs-5xl);font-weight:var(--fw-light);line-height:1;letter-spacing:var(--ls-tight);color:var(--text-strong)}.stat b[data-v-80e32bdd],.stat span[data-v-80e32bdd]{font-family:var(--font-mono)}.stat span[data-v-80e32bdd]{font-size:var(--fs-sm);letter-spacing:var(--ls-wide);color:var(--text-muted)}.block__head--row[data-v-80e32bdd]{display:flex;align-items:flex-end;justify-content:space-between;gap:var(--space-6);margin-bottom:var(--space-8)}.block__head--row .section__title[data-v-80e32bdd]{margin-bottom:0}.seeall[data-v-80e32bdd]{display:inline-flex;flex:none;align-items:center;gap:var(--space-2);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-muted);text-decoration:none;white-space:nowrap;transition:color var(--dur-base) var(--ease-standard)}.seeall[data-v-80e32bdd]:hover{color:var(--accent)}.seeall[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent);border-radius:var(--radius-xs)}.seeall__icon[data-v-80e32bdd]{font-size:var(--fs-base)}.journal[data-v-80e32bdd]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-5);margin:0;padding:0;list-style:none}.journal>li[data-v-80e32bdd],.jpost[data-v-80e32bdd]{display:flex}.jpost[data-v-80e32bdd]{flex-direction:column;width:100%;color:inherit;text-decoration:none}.jpost:hover .jpost__title[data-v-80e32bdd]{color:var(--accent)}.jpost:hover .jpost__arrow[data-v-80e32bdd]{color:var(--accent);transform:translate(4px,-4px)}.jpost__thumb[data-v-80e32bdd]{width:100%;height:160px;-o-object-fit:cover;object-fit:cover;border-bottom:1px solid var(--border-subtle)}.jpost__body[data-v-80e32bdd]{display:flex;flex:1;flex-direction:column;padding:var(--space-5)}.jpost__tags[data-v-80e32bdd]{margin-bottom:var(--space-3)}.jpost__title[data-v-80e32bdd]{margin:0 0 var(--space-2);font-family:var(--font-mono);font-size:var(--fs-lg);font-weight:var(--fw-regular);line-height:var(--lh-snug);color:var(--text-strong);transition:color var(--dur-base) var(--ease-standard)}.jpost__desc[data-v-80e32bdd]{margin:0 0 var(--space-4);font-size:var(--fs-sm);color:var(--text-muted)}.jpost__meta[data-v-80e32bdd]{display:flex;align-items:center;gap:var(--space-2);margin-top:auto;padding-top:var(--space-4);border-top:1px dashed var(--border-subtle);font-family:var(--font-mono);font-size:var(--fs-xs);color:var(--text-faint)}.jpost__arrow[data-v-80e32bdd]{margin-left:auto;font-size:var(--fs-base);color:var(--text-faint);transition:transform var(--dur-base) var(--ease-out),color var(--dur-base) var(--ease-standard)}.journal__empty[data-v-80e32bdd]{max-width:60ch;margin:0 auto;text-align:center}.journal__empty-code[data-v-80e32bdd]{margin:0 0 var(--space-2);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--accent)}.journal__empty-text[data-v-80e32bdd]{margin:0 0 var(--space-5);font-family:var(--font-sans);font-size:var(--fs-sm);line-height:var(--lh-relaxed);color:var(--text-muted)}.cta[data-v-80e32bdd]{position:relative;padding:clamp(48px,6vw,72px) var(--space-6);overflow:hidden;text-align:center;background:radial-gradient(ellipse 80% 120% at 50% 0,var(--accent-2-soft),transparent 70%),color-mix(in srgb,var(--surface-2) 60%,transparent);border:1px solid var(--border-subtle);border-radius:var(--radius-lg)}.cta__eyebrow[data-v-80e32bdd]{display:inline-block}.cta__title[data-v-80e32bdd]{margin:0 0 var(--space-4);font-family:var(--font-mono);font-size:clamp(1.8rem,4vw,2.8rem);font-weight:var(--fw-light);line-height:var(--lh-tight);letter-spacing:var(--ls-tight);color:var(--text-strong)}.cta__highlight[data-v-80e32bdd]{font-style:italic;color:var(--accent)}.cta__subtitle[data-v-80e32bdd]{max-width:58ch;margin:0 auto var(--space-8);font-family:var(--font-sans);font-size:var(--fs-base);line-height:var(--lh-relaxed);color:var(--text-muted)}.cta__actions[data-v-80e32bdd]{display:flex;flex-wrap:wrap;gap:var(--space-4);justify-content:center}@media(max-width:900px){.hero__grid[data-v-80e32bdd]{grid-template-columns:1fr}.hero__title[data-v-80e32bdd]{font-size:var(--fs-4xl)}.grid-3[data-v-80e32bdd],.journal[data-v-80e32bdd]{grid-template-columns:1fr}.block__head--row[data-v-80e32bdd]{flex-direction:column;align-items:flex-start}}@media(max-width:680px){.work__row[data-v-80e32bdd]{grid-template-columns:1fr;gap:var(--space-3)}.work__go[data-v-80e32bdd],.work__no[data-v-80e32bdd]{display:none}.stats[data-v-80e32bdd]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.anim[data-v-80e32bdd]{animation:none}.jpost__arrow[data-v-80e32bdd],.work__go[data-v-80e32bdd],.work__row[data-v-80e32bdd]{transition:none}.work__row--link[data-v-80e32bdd]:hover{padding-left:var(--space-3)}.work__row--link:hover .work__go[data-v-80e32bdd]{transform:none}}</style><style>.hexrow[data-v-a86d2094]{display:flex;gap:var(--space-5);margin:0;padding:0;list-style:none}</style><style>.hex[data-v-274e53e2]{display:inline-flex;align-items:center;justify-content:center;width:46px;height:53px;font-size:20px;color:var(--text-muted);cursor:pointer;background:var(--surface-2);clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);transition:color var(--dur-base) var(--ease-standard),background var(--dur-base) var(--ease-standard)}.hex[data-v-274e53e2]:hover{color:var(--ink-on-accent);background:var(--accent)}.hex[data-v-274e53e2]:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.hex__label[data-v-274e53e2]{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;white-space:nowrap;border:0;clip-path:inset(50%)}@media(prefers-reduced-motion:reduce){.hex[data-v-274e53e2]{transition:none}}</style><style>.zcard[data-v-c5ec7be1]{position:relative;overflow:hidden;background:var(--bg-card);color:var(--text-body);border:1px solid var(--border-subtle);border-radius:var(--radius-md);box-shadow:var(--shadow-2),var(--shadow-hairline);transition:border-color var(--dur-base) var(--ease-standard),transform var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-standard)}.zcard--pad[data-v-c5ec7be1]{padding:var(--space-6)}.zcard--interactive[data-v-c5ec7be1]{cursor:pointer}.zcard--interactive[data-v-c5ec7be1]:hover{border-color:var(--border-strong);transform:translateY(-2px);box-shadow:var(--shadow-3),var(--shadow-hairline)}.zcard--interactive[data-v-c5ec7be1]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.zcard--accent[data-v-c5ec7be1]:before{content:"";position:absolute;inset:0 0 auto;height:2px;background:linear-gradient(90deg,var(--accent),var(--aubergine-light))}.zcard--featured[data-v-c5ec7be1]{border-color:var(--accent-ring);box-shadow:var(--glow-accent),var(--shadow-hairline)}@media(prefers-reduced-motion:reduce){.zcard[data-v-c5ec7be1]{transition:none}.zcard--interactive[data-v-c5ec7be1]:hover{transform:none}}</style><style>.ztag[data-v-6db1c85c]{display:inline-flex;align-items:center;gap:var(--space-2);box-sizing:border-box;height:26px;padding:0 var(--space-3);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:var(--fw-regular);line-height:1;white-space:nowrap;color:var(--text-body);background:var(--surface-2);border:1px solid var(--border-subtle);border-radius:var(--radius-pill);transition:border-color var(--dur-fast) var(--ease-standard),color var(--dur-fast) var(--ease-standard)}.ztag[data-v-6db1c85c]:before{content:"#";color:var(--accent)}.ztag--plain[data-v-6db1c85c]:before{display:none;content:none}.ztag--clickable[data-v-6db1c85c]{cursor:pointer}.ztag--clickable[data-v-6db1c85c]:hover{border-color:var(--border-strong);color:var(--text-strong)}.ztag--clickable[data-v-6db1c85c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.ztag__remove[data-v-6db1c85c]{display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;margin-right:-2px;padding:0;font-family:var(--font-mono);font-size:var(--fs-sm);line-height:1;color:var(--text-muted);cursor:pointer;background:none;border:none;border-radius:var(--radius-circle)}.ztag__remove[data-v-6db1c85c]:hover{color:var(--term-red)}.ztag__remove[data-v-6db1c85c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}@media(prefers-reduced-motion:reduce){.ztag[data-v-6db1c85c]{transition:none}}</style><link rel="stylesheet" href="/_nuxt/entry.QaoIl47T.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZButton.CyAD_ftR.css" crossorigin><link rel="stylesheet" href="/_nuxt/LinkListComponent.BRYW5MSq.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZBadge.BAw1B01J.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZTag.f2Aq6DLg.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZCard.C5C9a-aj.css" crossorigin><link rel="modulepreload" as="script" crossorigin href="/_nuxt/kT-s8AA-.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/94XchtD0.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CZy76wlf.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/DlAUqK2U.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CDaHTzsF.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/DMhLy-fw.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CMQEDqfi.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/OpxrMEpG.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/C93KKm9n.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/1LEPDT53.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/ZsGxQ2mD.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/p0temu7u.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/BGMjmYXP.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CXmFvnQY.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/DvmfV0_A.js"><script type="module" src="/_nuxt/kT-s8AA-.js" crossorigin></script><meta name="description" content="Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL."><link rel="icon" type="image/x-icon" href="/favicon.ico"><script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","@id":"https://jouan.ovh/#organization","name":"Simon Jouan","url":"https://jouan.ovh","logo":"https://jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Rouen, France","addressCountry":"FR"}}</script><link rel="canonical" href="https://jouan.ovh"><script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"Simon Jouan — Développeur Full Stack TypeScript","url":"https://jouan.ovh","description":"Développeur Full Stack TypeScript — Nuxt / NestJS"}</script><script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Simon Jouan","jobTitle":"Développeur Full Stack TypeScript — Nuxt / NestJS","url":"https://jouan.ovh","image":"https://jouan.ovh/images/portrait.jpeg","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Rouen, France","addressCountry":"FR"}}</script><meta property="og:title" content="Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS"><meta property="og:description" content="Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL."><meta property="og:url" content="https://jouan.ovh"><meta property="og:type" content="website"><meta property="og:image" content="https://jouan.ovh/images/portrait.jpeg"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS"><meta name="twitter:description" content="Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL."><meta name="twitter:image" content="https://jouan.ovh/images/portrait.jpeg"></head><body><div id="__nuxt"><div class="init" data-v-e3708db0><header class="hdr" data-v-e3708db0 data-v-a782489c><div class="hdr__in" data-v-a782489c><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__brand" data-v-a782489c><svg class="zicon hdr__logo" viewbox="0 0 24 24" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><path d="M12 1.5 22.5 12 12 22.5 1.5 12z" fill="currentColor"/><path d="M12 1.5 22.5 12 12 12z" fill="#fff" fill-opacity="0.12"/></svg><b data-v-a782489c>jouan.ovh</b></a><nav class="hdr__nav" aria-label="Navigation principale" data-v-a782489c><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__link hdr__link--active" data-v-a782489c>Accueil</a><a href="/services" class="hdr__link" data-v-a782489c>Services</a><a href="/about" class="hdr__link" data-v-a782489c>À propos</a><a href="/blog" class="hdr__link" data-v-a782489c>Blog</a><a href="/contact" class="hdr__link" data-v-a782489c>Contact</a><!--]--></nav><div class="hdr__right" data-v-a782489c><div class="current-time hdr__clock" data-v-a782489c data-v-1e5503b4></div><span class="zbadge zbadge--success hdr__badge" data-v-a782489c data-v-fc077828><span class="zbadge__dot" aria-hidden="true" data-v-fc077828></span><!--[-->Disponible<!--]--></span><button class="hdr__action zbtn zbtn--terminal zbtn--sm" type="button" data-v-a782489c data-v-c154e5b1><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg><!--]--></span><!--[--> Terminal <!--]--><!----></button><a href="/contact" class="hdr__action zbtn zbtn--primary zbtn--sm" data-v-a782489c data-v-c154e5b1><!----><!--[--> Démarrer un projet <!--]--><!----></a><button class="hdr__burger" type="button" aria-expanded="false" aria-controls="hdr-mobile-menu" aria-label="Ouvrir le menu" data-v-a782489c><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg></button></div></div><!----><nav id="hdr-mobile-menu" class="hdr__menu" aria-label="Navigation mobile" data-v-a782489c><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__menu-link hdr__menu-link--active" data-v-a782489c>Accueil</a><a href="/services" class="hdr__menu-link" data-v-a782489c>Services</a><a href="/about" class="hdr__menu-link" data-v-a782489c>À propos</a><a href="/blog" class="hdr__menu-link" data-v-a782489c>Blog</a><a href="/contact" class="hdr__menu-link" data-v-a782489c>Contact</a><!--]--><div class="hdr__menu-actions" data-v-a782489c><button class="zbtn zbtn--terminal zbtn--sm" type="button" data-v-a782489c data-v-c154e5b1><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg><!--]--></span><!--[--> Terminal <!--]--><!----></button><a href="/contact" class="zbtn zbtn--primary zbtn--sm" data-v-a782489c data-v-c154e5b1><!----><!--[--> Démarrer un projet <!--]--><!----></a></div></nav><div data-v-a782489c><!--[--><!--]--></div></header><!--[--><main class="home" data-v-80e32bdd><span data-v-80e32bdd></span><div class="atmos" aria-hidden="true" data-v-80e32bdd data-v-796c86c1><div class="aurora aurora--auberg" data-v-796c86c1></div><div class="aurora aurora--orange" data-v-796c86c1></div><div class="aurora aurora--red" data-v-796c86c1></div><div class="grid-dots" data-v-796c86c1></div><div class="scanlines" data-v-796c86c1></div><div class="vignette" data-v-796c86c1></div></div><!----><section class="hero hero__grad" data-v-80e32bdd><div class="hero__in container" data-v-80e32bdd><div class="hero__grid" data-v-80e32bdd><div class="anim hero__text" data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p><h1 class="hero__title" data-v-80e32bdd>Développeur Full Stack TypeScript</h1><p class="hero__sub" data-v-80e32bdd> Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l&#39;architecture au déploiement, j&#39;interviens sur des produits neufs comme sur des applications existantes. </p><div class="hero__badge-wrap" data-v-80e32bdd><span class="hero__pulse-dot" aria-hidden="true" data-v-80e32bdd></span><span data-v-80e32bdd>Disponible pour missions freelance</span><!--[--><span aria-hidden="true" data-v-80e32bdd> · </span><a href="https://www.malt.fr/profile/simonjouan" rel="noopener" target="_blank" data-v-80e32bdd><!--[--> Profil Malt vérifié <!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a><!--]--></div><div class="hero__cta" data-v-80e32bdd><a href="/contact" class="zbtn zbtn--primary zbtn--lg" data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Discuter de votre projet <!--]--><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg><!--]--></span></a><a href="/about" class="zbtn zbtn--secondary zbtn--lg" data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Voir le parcours &amp; CV <!--]--><!----></a></div></div><div class="anim hero__term-col" data-v-80e32bdd><div class="hero-term" data-v-80e32bdd data-v-313a6524><div class="hero-term__bar" data-v-313a6524><span class="hero-term__dots" aria-hidden="true" data-v-313a6524><span class="hero-term__dot hero-term__dot--close" data-v-313a6524></span><span class="hero-term__dot hero-term__dot--min" data-v-313a6524></span><span class="hero-term__dot hero-term__dot--max" data-v-313a6524></span></span><span class="hero-term__title" data-v-313a6524>anon.@jouan.ovh: ~</span></div><div class="hero-term__body" data-v-313a6524><!--[--><!--]--><!----><!----><noscript data-v-313a6524><div data-v-313a6524><!--[--><!--[--><p class="hero-term__line" data-v-313a6524><span class="prm" data-v-313a6524><span class="prm__user" data-v-313a6524>anon.@jouan.ovh</span><span class="prm__sep" data-v-313a6524>:</span><span class="prm__dir" data-v-313a6524>~</span><span class="prm__sep" data-v-313a6524>$ </span><span class="prm__cmd" data-v-313a6524>whoami</span></span></p><p class="hero-term__out--ink hero-term__out" data-v-313a6524>Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)</p><!--]--><!--[--><p class="hero-term__line" data-v-313a6524><span class="prm" data-v-313a6524><span class="prm__user" data-v-313a6524>anon.@jouan.ovh</span><span class="prm__sep" data-v-313a6524>:</span><span class="prm__dir" data-v-313a6524>~</span><span class="prm__sep" data-v-313a6524>$ </span><span class="prm__cmd" data-v-313a6524>cat focus.txt</span></span></p><p class="hero-term__out--blue hero-term__out" data-v-313a6524>SaaS, web apps, clean architecture, automated testing (QA) &amp; AI engineering</p><!--]--><!--[--><p class="hero-term__line" data-v-313a6524><span class="prm" data-v-313a6524><span class="prm__user" data-v-313a6524>anon.@jouan.ovh</span><span class="prm__sep" data-v-313a6524>:</span><span class="prm__dir" data-v-313a6524>~</span><span class="prm__sep" data-v-313a6524>$ </span><span class="prm__cmd" data-v-313a6524>ls ~/projets</span></span></p><p class="hero-term__out--green hero-term__out" data-v-313a6524>keova.app/  tryon-saas/  nodium-lab/</p><!--]--><!--]--></div></noscript></div></div></div></div></div></section><div class="marquee" aria-hidden="true" data-v-80e32bdd data-v-19576991><div class="marquee__track" data-v-19576991><!--[--><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>TypeScript</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Nuxt 4</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Vue.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>NestJS</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Node.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>PostgreSQL</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>TypeORM</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Stripe Connect</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Cypress</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Docker</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>REST API</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Vitest</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><!--]--><!--[--><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>TypeScript</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Nuxt 4</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Vue.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>NestJS</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Node.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>PostgreSQL</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>TypeORM</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Stripe Connect</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Cypress</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Docker</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>REST API</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Vitest</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><!--]--></div></div><section class="section" data-v-80e32bdd><div class="container" data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>ce que je propose</p><h2 class="section__title" data-v-80e32bdd>Trois expertises pour concevoir et faire évoluer vos applications</h2><ul class="grid-3" data-v-80e32bdd><!--[--><li data-v-80e32bdd><div class="offer zcard zcard--pad zcard--interactive" data-v-80e32bdd data-v-c5ec7be1><!--[--><div class="offer__top" data-v-80e32bdd><div class="offer__icon" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div><span class="offer__no" data-v-80e32bdd>01 / 03</span></div><h3 class="offer__title" data-v-80e32bdd>Création d&#39;applications web &amp; SaaS</h3><p class="offer__desc" data-v-80e32bdd>De l&#39;idée à la production : architecture, développement front &amp; back, base de données, authentification et paiements Stripe.</p><ul class="offer__points" data-v-80e32bdd><!--[--><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Architecture logicielle &amp; APIs REST</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Applications Vue 3 / Nuxt 4 &amp; NestJS</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Intégration Stripe &amp; PostgreSQL</span></li><!--]--></ul><ul class="hero__tags offer__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->NestJS<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->PostgreSQL<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Stripe Connect<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-80e32bdd><span data-v-80e32bdd>Sur devis / au sprint</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Création d&#39;applications web &amp; SaaS" data-v-80e32bdd> En savoir plus → </a><!--]--></div></li><li data-v-80e32bdd><div class="offer zcard zcard--pad zcard--interactive zcard--accent zcard--featured" data-v-80e32bdd data-v-c5ec7be1><!--[--><div class="offer__top" data-v-80e32bdd><div class="offer__icon" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg></div><span class="offer__no" data-v-80e32bdd>02 / 03</span></div><h3 class="offer__title" data-v-80e32bdd>Développement Full Stack TypeScript</h3><p class="offer__desc" data-v-80e32bdd>Renfort d&#39;équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.</p><ul class="offer__points" data-v-80e32bdd><!--[--><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Composants Vue 3 / Nuxt avec TypeScript strict</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Microservices &amp; backend modulaire NestJS</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Fiabilisation et optimisation des performances</span></li><!--]--></ul><ul class="hero__tags offer__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->TypeScript<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Vue 3<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->NestJS<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Node.js<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-80e32bdd><span data-v-80e32bdd>Sur devis / TJM</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Développement Full Stack TypeScript" data-v-80e32bdd> En savoir plus → </a><!--]--></div></li><li data-v-80e32bdd><div class="offer zcard zcard--pad zcard--interactive" data-v-80e32bdd data-v-c5ec7be1><!--[--><div class="offer__top" data-v-80e32bdd><div class="offer__icon" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M12 3l1.8 5.6L19.5 10l-5.7 1.4L12 17l-1.8-5.6L4.5 10l5.7-1.4z"/><path d="M19 15l.7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9z"/></svg></div><span class="offer__no" data-v-80e32bdd>03 / 03</span></div><h3 class="offer__title" data-v-80e32bdd>Évolution &amp; Architecture applicative</h3><p class="offer__desc" data-v-80e32bdd>Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).</p><ul class="offer__points" data-v-80e32bdd><!--[--><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Audits techniques de code &amp; migrations de versions</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Tests E2E Cypress &amp; tests unitaires Vitest</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Pipelines CI/CD &amp; conteneurisation Docker</span></li><!--]--></ul><ul class="hero__tags offer__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Cypress<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Vitest<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Docker<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->CI/CD<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-80e32bdd><span data-v-80e32bdd>Au forfait / audit</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Évolution &amp; Architecture applicative" data-v-80e32bdd> En savoir plus → </a><!--]--></div></li><!--]--></ul></div></section><section class="section section--sunken" data-v-80e32bdd><div class="container" data-v-80e32bdd><div class="block__head" data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>projets sélectionnés</p><h2 class="section__title" data-v-80e32bdd>Des produits qui tournent en production</h2></div><ul class="work" data-v-80e32bdd><!--[--><li data-v-80e32bdd><a href="https://keova.app" rel="noopener" target="_blank" class="work__row work__row--link" data-hot data-v-80e32bdd><!--[--><span class="work__no" data-v-80e32bdd>01</span><div class="work__main" data-v-80e32bdd><div class="work__topline" data-v-80e32bdd><h3 class="work__name" data-v-80e32bdd>keova.app</h3><span class="work__status" data-v-80e32bdd>En production</span></div><p class="work__role" data-v-80e32bdd>Co-fondateur &amp; Développeur Full Stack</p><p class="prose work__desc" data-v-80e32bdd>Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).</p><ul class="hero__tags work__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nest.js<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->postgresql<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->stripe<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->saas<!--]--><!----></span></li><!--]--></ul></div><span class="work__go" aria-hidden="true" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-80e32bdd><div class="work__row" data-v-80e32bdd><span class="work__no" data-v-80e32bdd>02</span><div class="work__main" data-v-80e32bdd><div class="work__topline" data-v-80e32bdd><h3 class="work__name" data-v-80e32bdd>TryOn</h3><span class="work__status" data-v-80e32bdd>Étude de cas (MVP livré)</span></div><p class="work__role" data-v-80e32bdd>CTO &amp; Développeur Full Stack</p><p class="prose work__desc" data-v-80e32bdd>Plateforme SaaS B2B d&#39;essayage virtuel de vêtements via l&#39;IA générative (diffusion models, microservices asynchrones, files Redis).</p><ul class="hero__tags work__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nest.js<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->python<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->comfyui<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->ia<!--]--><!----></span></li><!--]--></ul></div><!----></div></li><li data-v-80e32bdd><div class="work__row" data-v-80e32bdd><span class="work__no" data-v-80e32bdd>03</span><div class="work__main" data-v-80e32bdd><div class="work__topline" data-v-80e32bdd><h3 class="work__name" data-v-80e32bdd>Nodium</h3><span class="work__status" data-v-80e32bdd>R&amp;D / En cours</span></div><p class="work__role" data-v-80e32bdd>Créateur &amp; Ingénieur IA</p><p class="prose work__desc" data-v-80e32bdd>Plateforme desktop d&#39;orchestration d&#39;agents IA autonomes, gestion de permissions et mémoire contextuelle.</p><ul class="hero__tags work__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->typescript<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->electron<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->agents<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->ia<!--]--><!----></span></li><!--]--></ul></div><!----></div></li><!--]--></ul><ul class="stats" data-v-80e32bdd><!--[--><li class="stat" data-v-80e32bdd><b data-v-80e32bdd>11</b><span data-v-80e32bdd>années d&#39;expérience web</span></li><li class="stat" data-v-80e32bdd><b data-v-80e32bdd>100%</b><span data-v-80e32bdd>TypeScript &amp; SaaS de bout en bout</span></li><li class="stat" data-v-80e32bdd><b data-v-80e32bdd>QA</b><span data-v-80e32bdd>culture d&#39;automatisation &amp; zéro régression</span></li><!--]--></ul></div></section><section class="section" data-v-80e32bdd><div class="container" data-v-80e32bdd><div class="block__head block__head--row" data-v-80e32bdd><div data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>~/journal</p><h2 class="section__title" data-v-80e32bdd>Notes de dev, écrites en construisant</h2></div><a href="/blog" class="seeall" data-hot data-v-80e32bdd> cat tous-les-articles <svg class="zicon seeall__icon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></a></div><div class="journal__empty zcard zcard--pad" data-v-80e32bdd data-v-c5ec7be1><!--[--><p class="journal__empty-code" data-v-80e32bdd>$ cat ~/journal/*.md</p><p class="journal__empty-text" data-v-80e32bdd>Les notes d&#39;ingénierie et retours d&#39;expérience sont en cours de rédaction.</p><a href="/blog" class="zbtn zbtn--secondary zbtn--sm" data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Consulter la section blog <!--]--><!----></a><!--]--></div></div></section><section class="section section--sunken" data-v-80e32bdd><div class="container" data-v-80e32bdd><div class="cta" data-v-80e32bdd><p class="eyebrow cta__eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>$ </span>./contact --start</p><h2 class="cta__title" data-v-80e32bdd>Un projet en tête ? Mettons-le <span class="cta__highlight" data-v-80e32bdd>en production</span>.</h2><p class="cta__subtitle" data-v-80e32bdd> Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript, parlons-en. </p><div class="cta__actions" data-v-80e32bdd><a href="/contact" class="zbtn zbtn--primary zbtn--lg" data-hot data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Discuter de votre projet <!--]--><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg><!--]--></span></a><a href="https://www.malt.fr/profile/simonjouan" rel="noopener" target="_blank" data-hot class="zbtn zbtn--secondary zbtn--lg" data-v-80e32bdd data-v-c154e5b1><!--[--><!----><!--[--> Me contacter sur Malt <!--]--><!----><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a><a href="/about" class="zbtn zbtn--ghost zbtn--lg" data-hot data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Voir le parcours &amp; CV <!--]--><!----></a></div></div></div></section></main><!--]--><footer class="ftr" data-v-e3708db0 data-v-ec74c766><div class="ftr__container" data-v-ec74c766><div class="ftr__in" data-v-ec74c766><div class="ftr__brand-col" data-v-ec74c766><a aria-current="page" href="/" class="router-link-active router-link-exact-active ftr__brand" data-v-ec74c766><svg class="zicon ftr__logo" viewbox="0 0 24 24" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-ec74c766 data-v-70d98695><path d="M12 1.5 22.5 12 12 22.5 1.5 12z" fill="currentColor"/><path d="M12 1.5 22.5 12 12 12z" fill="#fff" fill-opacity="0.12"/></svg><b data-v-ec74c766>jouan.ovh</b></a><p class="ftr__tagline" data-v-ec74c766>Développeur Full Stack TypeScript — Nuxt / NestJS. Rouen, France.</p></div><nav class="ftr__col" aria-label="Navigation du pied de page" data-v-ec74c766><h2 class="ftr__title" data-v-ec74c766>// Navigation</h2><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active ftr__link" data-v-ec74c766>Accueil</a><a href="/services" class="ftr__link" data-v-ec74c766>Services</a><a href="/about" class="ftr__link" data-v-ec74c766>À propos</a><a href="/blog" class="ftr__link" data-v-ec74c766>Blog</a><a href="/contact" class="ftr__link" data-v-ec74c766>Contact</a><a href="/confidentialite" class="ftr__link" data-v-ec74c766>Confidentialité</a><a href="/mentions-legales" class="ftr__link" data-v-ec74c766>Mentions légales</a><!--]--></nav><div class="ftr__col" data-v-ec74c766><h2 class="ftr__title" data-v-ec74c766>// Projets</h2><ul class="ftr__list" data-v-ec74c766><!--[--><li data-v-ec74c766><a href="https://keova.app" rel="noopener noreferrer" target="_blank" class="ftr__link" data-v-ec74c766><!--[-->keova.app<!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-ec74c766><span class="ftr__link ftr__link--static" data-v-ec74c766>TryOn</span></li><li data-v-ec74c766><span class="ftr__link ftr__link--static" data-v-ec74c766>Nodium</span></li><!--]--></ul></div><div class="ftr__col" data-v-ec74c766><h2 class="ftr__title" data-v-ec74c766>// Réseaux</h2><ul class="hexrow" data-v-ec74c766 data-v-a86d2094><!--[--><li data-v-a86d2094><a href="https://github.com/zohac" rel="noopener noreferrer" target="_blank" class="hex" data-v-a86d2094 data-v-274e53e2><!--[--><!--[--><svg class="zicon" viewbox="0 0 16 16" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a86d2094 data-v-70d98695><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg><!--]--><span class="hex__label" data-v-274e53e2><!--[-->GitHub<!--]--></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-a86d2094><a href="https://twitter.com/fenrir0680" rel="noopener noreferrer" target="_blank" class="hex" data-v-a86d2094 data-v-274e53e2><!--[--><!--[--><svg class="zicon" viewbox="0 0 16 16" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a86d2094 data-v-70d98695><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/></svg><!--]--><span class="hex__label" data-v-274e53e2><!--[-->Twitter<!--]--></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-a86d2094><a href="https://www.linkedin.com/in/simonjouan/" rel="noopener noreferrer" target="_blank" class="hex" data-v-a86d2094 data-v-274e53e2><!--[--><!--[--><svg class="zicon" viewbox="0 0 16 16" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a86d2094 data-v-70d98695><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg><!--]--><span class="hex__label" data-v-274e53e2><!--[-->LinkedIn<!--]--></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><!--]--></ul></div></div><div class="ftr__bottom" data-v-ec74c766><span data-v-ec74c766>© 2026 Simon Jouan — jouan.ovh</span><span class="ftr__term" data-v-ec74c766>anon.@jouan.ovh:~$ <span class="ftr__cmd" data-v-ec74c766>echo &quot;merci de votre visite&quot;</span></span></div></div></footer></div></div><div id="teleports"></div><script>window.__NUXT__={};window.__NUXT__.config={public:{web3formsAccessKey:"320b7ade-7b76-421e-a4bd-f353fd22348b",siteUrl:"https://jouan.ovh",mdc:{components:{prose:true,map:{},customElements:[]},headings:{anchorLinks:{h1:false,h2:true,h3:true,h4:true,h5:false,h6:false}},highlight:false},content:{wsUrl:""}},app:{baseURL:"/",buildId:"47020e4c-64d1-4922-b979-d9f58139e1fe",buildAssetsDir:"/_nuxt/",cdnURL:""}}</script><script type="application/json" data-nuxt-data="nuxt-app" data-ssr="true" id="__NUXT_DATA__">[["ShallowReactive",1],{"prerenderedAt":2,"data":3,"state":6,"once":8,"_errors":9,"serverRendered":11,"path":12},1789327459772,["ShallowReactive",4],{"home-articles":5},[],["Reactive",7],{},["Set"],["ShallowReactive",10],{"home-articles":-1},true,"\u002F"]</script></body></html>
./docs/implementation-artifacts/code-reviews/11-5/raw-blind-hunter.md:784:docs/implementation-artifacts/code-reviews/11-4/raw-blind-hunter.md:4737:1:<!DOCTYPE html><html  lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Simon Jouan — Développeur Full Stack TypeScript · Nuxt &amp; NestJS</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400;1,700&display=swap"><style>.ftr[data-v-ec74c766]{margin-top:auto;background:var(--surface-1);border-top:1px solid var(--border-subtle);padding:var(--space-12) 0 var(--space-8)}.ftr__container[data-v-ec74c766]{width:100%;max-width:var(--container-xl);margin:0 auto;padding:0 var(--space-6)}.ftr__in[data-v-ec74c766]{display:flex;flex-wrap:wrap;gap:var(--space-8);align-items:flex-start;justify-content:space-between}.ftr__brand-col[data-v-ec74c766]{max-width:300px}.ftr__brand[data-v-ec74c766]{display:inline-flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-3);text-decoration:none}.ftr__brand .ftr__logo[data-v-ec74c766]{font-size:22px;color:var(--accent)}.ftr__brand b[data-v-ec74c766]{font-family:var(--font-mono);font-size:var(--fs-md);font-weight:var(--fw-bold);color:var(--text-strong)}.ftr__brand[data-v-ec74c766]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-sm);box-shadow:var(--ring-accent)}.ftr__tagline[data-v-ec74c766]{margin:0;font-size:var(--fs-sm);color:var(--text-muted)}.ftr__col[data-v-ec74c766]{display:flex;flex-direction:column}.ftr__title[data-v-ec74c766]{margin:0 0 var(--space-3);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:var(--fw-regular);letter-spacing:var(--ls-wider);text-transform:uppercase;color:var(--text-muted)}.ftr__list[data-v-ec74c766]{display:flex;flex-direction:column;padding:0;margin:0;list-style:none}.ftr__link[data-v-ec74c766]{display:block;padding:var(--space-1) 0;font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-body);text-decoration:none;transition:color var(--dur-fast) var(--ease-standard)}.ftr__link[data-v-ec74c766]:hover{color:var(--accent)}.ftr__link[data-v-ec74c766]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-xs);box-shadow:var(--ring-accent)}.ftr__link--static[data-v-ec74c766]{cursor:default}.ftr__bottom[data-v-ec74c766],.ftr__link--static[data-v-ec74c766],.ftr__link--static[data-v-ec74c766]:hover{color:var(--text-muted)}.ftr__bottom[data-v-ec74c766]{display:flex;flex-wrap:wrap;gap:var(--space-3);justify-content:space-between;margin-top:var(--space-8);padding-top:var(--space-5);font-family:var(--font-mono);font-size:var(--fs-xs);border-top:1px solid var(--border-subtle)}.ftr__cmd[data-v-ec74c766]{color:var(--term-green)}@media(prefers-reduced-motion:reduce){.ftr__link[data-v-ec74c766]{transition:none}}</style><style>.terminal{box-sizing:border-box;position:fixed;top:60px;left:15px;z-index:1000;width:600px;height:400px;overflow:hidden;resize:both;font-family:var(--font-mono);color:var(--ink-1);border:1px solid var(--border-terminal);border-radius:var(--radius-sm);box-shadow:var(--glow-terminal)}.terminal-header{position:relative;z-index:1;display:flex;flex-wrap:nowrap;align-items:center;gap:var(--space-2);height:30px;padding:0 var(--space-3);background:var(--aubergine-black);cursor:move}.terminal-header .terminal-dots{display:flex;align-items:center;gap:7px}.terminal-header .close-button{width:13px;height:13px;cursor:pointer;background-image:linear-gradient(to bottom right,var(--term-red),#8a0000);border-radius:var(--radius-circle);box-shadow:1px 1px 2px #080206}.terminal-header .close-button:hover{filter:brightness(1.2)}.terminal-header .close-button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.terminal-header .terminal-dot{width:13px;height:13px;border-radius:var(--radius-circle);opacity:.85}.terminal-header .terminal-dot--min{background:var(--term-yellow)}.terminal-header .terminal-dot--max{background:var(--term-green)}.terminal-header .header-text{position:absolute;inset:0;font-family:var(--font-mono);font-size:var(--fs-xs);letter-spacing:var(--ls-wide);line-height:30px;color:var(--text-muted);text-align:center;pointer-events:none}.terminal-body{height:calc(100% - 30px);margin:0;padding:var(--space-4);overflow:auto;font-size:var(--fs-sm);line-height:var(--lh-snug);white-space:pre-wrap;overflow-wrap:break-word;background:var(--bg-terminal)}.terminal-body .git-prompt,.terminal-body .git-prompt-directory,.terminal-body .git-prompt-separator{display:inline}.terminal-body .git-prompt,.terminal-body .git-prompt-directory{font-weight:var(--fw-bold)}.terminal-body .git-prompt{color:var(--prompt)}.terminal-body .git-prompt-separator{color:var(--ink-1);font-weight:var(--fw-regular)}.terminal-body .git-prompt-directory{color:var(--term-blue)}.terminal-body .user-input{margin:0;padding:0;font-family:inherit;font-size:inherit;color:inherit;background-color:transparent;border:none;outline:none;caret-color:var(--prompt);caret-shape:block}.terminal-body .terminal-response{white-space:normal}.terminal-body::-webkit-scrollbar{width:10px}.terminal-body::-webkit-scrollbar-thumb{background:var(--aubergine);border-radius:var(--radius-pill)}@supports (backdrop-filter:blur(5px)) or (-webkit-backdrop-filter:blur(5px)){.terminal .terminal-body{background:color-mix(in srgb,var(--bg-terminal) 86%,transparent);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px)}}.terminal .resize-handle{position:absolute;right:0;bottom:0;width:16px;height:16px;background-color:transparent;cursor:nwse-resize}.table,table{--color-light:#ebebeb;--color-dark:#141414;--color-grey-light:#adadad;--margin:1em;border:1px dashed var(--color-light);margin:var(--margin)}.table thead,table thead{color:var(--color-dark);text-align:center;background-color:var(--color-light)}.table td,table td{padding:0 .5em}.table tbody tr:nth-child(2n),table tbody tr:nth-child(2n){background-color:var(--color-grey-light);color:var(--color-dark)}.table.w-100,table.w-100{width:calc(100% - var(--margin)*2)}.table.w-50,table.w-50{width:calc(50% - var(--margin)*2)}</style><style>.hdr[data-v-a782489c]{position:sticky;top:0;z-index:50;height:var(--header-height);background:color-mix(in srgb,var(--surface-0) 82%,transparent);border-bottom:1px solid var(--border-subtle);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}.hdr__in[data-v-a782489c]{display:flex;align-items:center;gap:var(--space-6);width:100%;max-width:var(--container-xl);height:100%;margin:0 auto;padding:0 var(--space-6)}.hdr__brand[data-v-a782489c]{display:inline-flex;align-items:center;gap:var(--space-2);text-decoration:none}.hdr__brand .hdr__logo[data-v-a782489c]{font-size:24px;color:var(--accent)}.hdr__brand b[data-v-a782489c]{font-family:var(--font-mono);font-size:var(--fs-md);font-weight:var(--fw-bold);color:var(--text-strong)}.hdr__brand[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-sm);box-shadow:var(--ring-accent)}.hdr__nav[data-v-a782489c]{display:flex;align-items:center;gap:var(--space-1);min-width:0;margin-left:var(--space-4)}.hdr__link[data-v-a782489c]{padding:var(--space-2) var(--space-3);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-muted);text-decoration:none;border-radius:var(--radius-sm);transition:color var(--dur-fast) var(--ease-standard),background var(--dur-fast) var(--ease-standard)}.hdr__link[data-v-a782489c]:hover{color:var(--text-strong);background:var(--surface-2)}.hdr__link[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hdr__link--active[data-v-a782489c]{color:var(--accent)}.hdr__right[data-v-a782489c]{display:flex;align-items:center;gap:var(--space-3);margin-left:auto}.hdr__clock[data-v-a782489c]{font-family:var(--font-mono);font-size:var(--fs-xs);color:var(--text-muted)}.hdr__burger[data-v-a782489c]{display:none;align-items:center;justify-content:center;width:36px;height:36px;font-size:20px;color:var(--text-strong);cursor:pointer;background:none;border:1px solid var(--border-default);border-radius:var(--radius-md)}.hdr__burger[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hdr__overlay[data-v-a782489c]{position:fixed;inset:var(--header-height) 0 0;z-index:40;background:var(--overlay)}.hdr__menu[data-v-a782489c]{display:none}@media(max-width:1100px){.hdr__clock[data-v-a782489c]{display:none}}@media(max-width:1000px){.hdr__badge[data-v-a782489c]{display:none}}@media(min-width:901px){.hdr__overlay[data-v-a782489c]{display:none}}@media(max-width:900px){.hdr__badge[data-v-a782489c],.hdr__clock[data-v-a782489c],.hdr__nav[data-v-a782489c],.hdr__right .hdr__action[data-v-a782489c]{display:none}.hdr__burger[data-v-a782489c]{display:inline-flex}.hdr__menu[data-v-a782489c]{position:fixed;inset:var(--header-height) 0 auto 0;z-index:45;display:flex;flex-direction:column;gap:var(--space-1);padding:var(--space-4) var(--space-6) var(--space-6);background:var(--surface-1);border-bottom:1px solid var(--border-subtle);box-shadow:var(--shadow-3);transform:translateY(-8px);opacity:0;visibility:hidden;transition:transform var(--dur-base) var(--ease-out),opacity var(--dur-base) var(--ease-standard),visibility var(--dur-base)}.hdr__menu--open[data-v-a782489c]{transform:translateY(0);opacity:1;visibility:visible}}.hdr__menu-link[data-v-a782489c]{padding:var(--space-3);font-family:var(--font-mono);font-size:var(--fs-base);color:var(--text-body);text-decoration:none;border-radius:var(--radius-sm)}.hdr__menu-link[data-v-a782489c]:hover{color:var(--text-strong);background:var(--surface-2)}.hdr__menu-link[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hdr__menu-link--active[data-v-a782489c]{color:var(--accent)}.hdr__menu-actions[data-v-a782489c]{display:flex;flex-direction:column;gap:var(--space-2);margin-top:var(--space-3)}@media(prefers-reduced-motion:reduce){.hdr__link[data-v-a782489c],.hdr__menu[data-v-a782489c]{transition:none}}</style><style>.init[data-v-e3708db0]{background:var(--bg-page);display:flex;flex-direction:column;margin:0;min-height:100vh;width:100%;max-width:100vw}</style><style>.zicon[data-v-70d98695]{display:inline-block;flex:none;width:1em;height:1em;vertical-align:middle}</style><style>.zbadge[data-v-fc077828]{display:inline-flex;align-items:center;gap:var(--space-2);box-sizing:border-box;height:22px;padding:0 var(--space-2);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:var(--fw-medium);line-height:1;letter-spacing:var(--ls-wide);white-space:nowrap;border:1px solid transparent;border-radius:var(--radius-sm)}.zbadge__dot[data-v-fc077828]{width:6px;height:6px;background:currentcolor;border-radius:var(--radius-circle)}.zbadge--neutral[data-v-fc077828]{background:var(--surface-3);color:var(--text-body);border-color:var(--border-default)}.zbadge--accent[data-v-fc077828]{background:var(--accent-soft);color:var(--accent);border-color:#f871164d}.zbadge--success[data-v-fc077828]{background:var(--success-soft);color:var(--success);border-color:#297a4880}.zbadge--warning[data-v-fc077828]{background:var(--warning-soft);color:var(--warning);border-color:#8b611880}.zbadge--danger[data-v-fc077828]{background:var(--danger-soft);color:var(--danger);border-color:#8a282880}.zbadge--info[data-v-fc077828]{background:var(--info-soft);color:var(--info);border-color:#255b7e80}</style><style>.zbtn[data-v-c154e5b1]{--_h:36px;--_px:var(--space-4);--_fs:var(--fs-sm);display:inline-flex;align-items:center;justify-content:center;gap:var(--space-2);box-sizing:border-box;height:var(--_h);padding:0 var(--_px);font-family:var(--font-mono);font-size:var(--_fs);font-weight:var(--fw-medium);line-height:1;letter-spacing:var(--ls-wide);white-space:nowrap;text-decoration:none;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;border:1px solid transparent;border-radius:var(--radius-md);transition:background var(--dur-fast) var(--ease-standard),border-color var(--dur-fast) var(--ease-standard),color var(--dur-fast) var(--ease-standard),transform var(--dur-fast) var(--ease-standard)}.zbtn[data-v-c154e5b1]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.zbtn[data-v-c154e5b1]:disabled,.zbtn[aria-disabled=true][data-v-c154e5b1]{opacity:.45;cursor:not-allowed;pointer-events:none}.zbtn__icon[data-v-c154e5b1]{display:inline-flex;width:1.05em;height:1.05em}.zbtn__icon[data-v-c154e5b1] svg{width:100%;height:100%}.zbtn--sm[data-v-c154e5b1]{--_h:28px;--_px:var(--space-3);--_fs:var(--fs-xs)}.zbtn--lg[data-v-c154e5b1]{--_h:44px;--_px:var(--space-5);--_fs:var(--fs-base)}.zbtn--primary[data-v-c154e5b1]{background:var(--accent);color:var(--accent-text);border-color:var(--accent)}.zbtn--primary[data-v-c154e5b1]:hover{background:var(--accent-hover);border-color:var(--accent-hover)}.zbtn--primary[data-v-c154e5b1]:active{background:var(--accent-active);border-color:var(--accent-active);transform:translateY(1px)}.zbtn--secondary[data-v-c154e5b1]{background:var(--surface-2);color:var(--text-strong);border-color:var(--border-default)}.zbtn--secondary[data-v-c154e5b1]:hover{background:var(--surface-3);border-color:var(--border-strong)}.zbtn--secondary[data-v-c154e5b1]:active{transform:translateY(1px)}.zbtn--ghost[data-v-c154e5b1]{background:transparent;color:var(--text-body);border-color:transparent}.zbtn--ghost[data-v-c154e5b1]:hover{background:var(--surface-2);color:var(--text-strong)}.zbtn--terminal[data-v-c154e5b1]{background:var(--bg-terminal);color:var(--term-green);border-color:var(--accent-2-soft)}.zbtn--terminal[data-v-c154e5b1]:hover{border-color:var(--term-green);box-shadow:var(--glow-terminal)}.zbtn--danger[data-v-c154e5b1]{background:var(--danger);color:var(--ink-on-accent);border-color:var(--danger)}.zbtn--danger[data-v-c154e5b1]:hover{filter:brightness(1.08)}.zbtn--danger[data-v-c154e5b1]:active{transform:translateY(1px)}@media(prefers-reduced-motion:reduce){.zbtn[data-v-c154e5b1]{transition:none}}</style><style>.boot[data-v-f59a7d91]{position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;cursor:pointer;background:var(--surface-0);transition:opacity var(--dur-slow) var(--ease-out),visibility var(--dur-slow)}.boot.boot--done[data-v-f59a7d91]{pointer-events:none;visibility:hidden;opacity:0}.boot__in[data-v-f59a7d91]{width:min(560px,88vw);font-family:var(--font-mono);font-size:var(--fs-sm)}.boot__logo[data-v-f59a7d91]{display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-5);color:var(--text-strong)}.boot__logo b[data-v-f59a7d91]{font-size:var(--fs-lg)}.boot__logo-icon[data-v-f59a7d91]{font-size:26px;color:var(--accent)}.boot__line[data-v-f59a7d91]{min-height:1.6em;color:var(--text-muted)}.boot__ok[data-v-f59a7d91]{color:var(--term-green)}.boot__bar[data-v-f59a7d91]{height:3px;margin-top:var(--space-5);overflow:hidden;background:var(--surface-3);border-radius:var(--radius-xs)}.boot__bar i[data-v-f59a7d91]{display:block;width:0;height:100%;background:linear-gradient(90deg,var(--accent),var(--aubergine-light));transition:width .1s linear}.boot__skip[data-v-f59a7d91]{display:inline-block;margin-top:var(--space-4);padding:0;font-family:inherit;font-size:var(--fs-xs);letter-spacing:var(--ls-wide);color:var(--text-faint);cursor:pointer;background:none;border:none}.boot__skip[data-v-f59a7d91]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}@media(prefers-reduced-motion:reduce){.boot[data-v-f59a7d91]{display:none}}</style><style>.atmos[data-v-796c86c1]{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none}.aurora[data-v-796c86c1]{position:absolute;border-radius:var(--radius-circle);filter:blur(80px);mix-blend-mode:screen;will-change:transform}.aurora--orange[data-v-796c86c1]{top:-22%;left:48%;width:60vw;height:60vw;background:radial-gradient(circle at center,var(--orange-500),transparent 62%);opacity:.55;animation:drift-orange-796c86c1 26s var(--ease-in-out) infinite}.aurora--auberg[data-v-796c86c1]{top:6%;left:-22%;width:64vw;height:64vw;background:radial-gradient(circle at center,var(--aubergine-vivid),transparent 62%);opacity:.7;animation:drift-auberg-796c86c1 32s var(--ease-in-out) infinite}.aurora--red[data-v-796c86c1]{top:44%;left:26%;width:44vw;height:44vw;background:radial-gradient(circle at center,var(--term-red),transparent 64%);opacity:.4;animation:drift-red-796c86c1 30s var(--ease-in-out) infinite}.grid-dots[data-v-796c86c1]{background-image:radial-gradient(color-mix(in srgb,var(--ink-1) 6%,transparent) 1px,transparent 1px);background-size:34px 34px;-webkit-mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,var(--surface-0) 30%,transparent 78%);mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,var(--surface-0) 30%,transparent 78%)}.grid-dots[data-v-796c86c1],.scanlines[data-v-796c86c1]{position:absolute;inset:0}.scanlines[data-v-796c86c1]{opacity:.35;background:repeating-linear-gradient(0deg,color-mix(in srgb,var(--surface-0) 24%,transparent) 0 1px,transparent 1px 3px)}.vignette[data-v-796c86c1]{position:absolute;inset:0;background:radial-gradient(ellipse 120% 90% at 50% 0,transparent 55%,var(--surface-0) 100%)}@keyframes drift-orange-796c86c1{0%,to{transform:translate(0) scale(1)}50%{transform:translate(-6vw,5vh) scale(1.12)}}@keyframes drift-auberg-796c86c1{0%,to{transform:translate(0) scale(1)}50%{transform:translate(7vw,-4vh) scale(1.08)}}@keyframes drift-red-796c86c1{0%,to{transform:translate(0) scale(1)}50%{transform:translate(-4vw,-6vh) scale(1.15)}}@media(prefers-reduced-motion:reduce){.aurora[data-v-796c86c1]{animation:none}}</style><style>.cursor-dot[data-v-0096a69c],.cursor-ring[data-v-0096a69c]{position:fixed;top:0;left:0;z-index:90;border-radius:var(--radius-circle);mix-blend-mode:difference;opacity:0;pointer-events:none;transition:opacity var(--dur-base) var(--ease-standard)}.cursor-dot.is-visible[data-v-0096a69c],.cursor-ring.is-visible[data-v-0096a69c]{opacity:1}.cursor-dot[data-v-0096a69c]{width:6px;height:6px;background:var(--ink-1)}.cursor-ring[data-v-0096a69c]{width:34px;height:34px;border:1px solid color-mix(in srgb,var(--ink-1) 70%,transparent);transition:width var(--dur-base) var(--ease-out),height var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out),opacity var(--dur-base) var(--ease-standard)}.cursor-ring.is-hot[data-v-0096a69c]{width:56px;height:56px;border-color:var(--accent)}@media(hover:none),(prefers-reduced-motion:reduce){.cursor-dot[data-v-0096a69c],.cursor-ring[data-v-0096a69c]{display:none}}</style><style>.hero-term[data-v-313a6524]{display:flex;flex-direction:column;min-height:300px;overflow:hidden;border:1px solid var(--accent-2-soft);border-radius:var(--radius-sm);box-shadow:var(--glow-terminal)}.hero-term__bar[data-v-313a6524]{position:relative;display:flex;flex:none;align-items:center;gap:var(--space-2);height:30px;padding:0 var(--space-3);background:var(--aubergine-black)}.hero-term__dots[data-v-313a6524]{display:flex;align-items:center;gap:7px}.hero-term__dot[data-v-313a6524]{width:13px;height:13px;border-radius:var(--radius-circle)}.hero-term__dot--close[data-v-313a6524]{background:var(--term-red)}.hero-term__dot--min[data-v-313a6524]{background:var(--term-yellow)}.hero-term__dot--max[data-v-313a6524]{background:var(--term-green)}.hero-term__title[data-v-313a6524]{position:absolute;inset:0;font-family:var(--font-mono);font-size:var(--fs-xs);letter-spacing:var(--ls-wide);color:var(--text-muted);text-align:center;pointer-events:none}.hero-term__body[data-v-313a6524]{flex:1;min-height:0;padding:var(--space-4);overflow:auto;font-family:var(--font-mono);font-size:var(--fs-sm);line-height:var(--lh-snug);color:var(--ink-1);background:var(--bg-terminal);overflow-wrap:break-word}@supports (backdrop-filter:blur(5px)){.hero-term__body[data-v-313a6524]{background:color-mix(in srgb,var(--bg-terminal) 86%,transparent);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px)}}.hero-term__line[data-v-313a6524]{margin:0}.hero-term__out[data-v-313a6524]{margin:0 0 var(--space-4)}.hero-term__out--ink[data-v-313a6524]{color:var(--ink-1)}.hero-term__out--blue[data-v-313a6524]{color:var(--term-blue)}.hero-term__out--green[data-v-313a6524]{color:var(--term-green)}.hero-term__open[data-v-313a6524]{display:block;width:100%;padding:0;font:inherit;text-align:left;cursor:pointer;background:none;border:none;border-radius:var(--radius-xs)}.hero-term__open[data-v-313a6524]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.prm[data-v-313a6524]{font-family:var(--font-mono)}.prm__user[data-v-313a6524]{font-weight:var(--fw-bold);color:var(--prompt)}.prm__sep[data-v-313a6524]{color:var(--ink-1)}.prm__dir[data-v-313a6524]{font-weight:var(--fw-bold);color:var(--term-blue)}.prm__cmd[data-v-313a6524]{color:var(--ink-1)}.prm__caret[data-v-313a6524]{display:inline-block;width:.55em;height:1.05em;margin-left:1px;vertical-align:text-bottom;background:var(--prompt);animation:caret-blink 1s steps(1) infinite}@media(prefers-reduced-motion:reduce){.prm__caret[data-v-313a6524]{animation:none}}</style><style>.marquee[data-v-19576991]{display:block;width:100%;padding-block:var(--space-5);overflow:hidden;border-block:1px solid var(--border-subtle);-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}.marquee:hover .marquee__track[data-v-19576991]{animation-play-state:paused}.marquee__track[data-v-19576991]{display:flex;gap:var(--space-8);width:-moz-max-content;width:max-content;will-change:transform;animation:scroll-x-19576991 32s linear infinite}.marquee__item[data-v-19576991]{display:inline-flex;gap:var(--space-8);align-items:center;font-family:var(--font-mono);font-size:var(--fs-xl);letter-spacing:var(--ls-wide);color:var(--text-faint);white-space:nowrap}.marquee__label[data-v-19576991]{font-weight:var(--fw-regular);color:var(--text-body)}.marquee__star[data-v-19576991]{color:var(--accent)}@keyframes scroll-x-19576991{0%{transform:translate(0)}to{transform:translate(calc(-50% - var(--space-8)/2))}}@media(prefers-reduced-motion:reduce){.marquee[data-v-19576991]{-webkit-mask-image:none;mask-image:none}.marquee__track[data-v-19576991]{animation:none}.marquee__item--duplicate[data-v-19576991]{display:none}}</style><style>.home[data-v-80e32bdd]{display:block}.anim[data-v-80e32bdd]{animation:fade-rise var(--dur-slow) var(--ease-out) both}.hero__term-col[data-v-80e32bdd]{animation-delay:80ms}.hero[data-v-80e32bdd]{position:relative;overflow:hidden}.hero__grad[data-v-80e32bdd]{background:radial-gradient(900px 500px at 78% -10%,color-mix(in srgb,var(--accent) 16%,transparent),transparent 60%),radial-gradient(700px 500px at 0 110%,color-mix(in srgb,var(--aubergine-vivid) 28%,transparent),transparent 60%),var(--bg-page)}.hero__in[data-v-80e32bdd]{position:relative;z-index:1;padding-block:var(--space-20)}.hero__grid[data-v-80e32bdd]{display:grid;grid-template-columns:1.05fr .95fr;gap:var(--space-12);align-items:center}.hero__title[data-v-80e32bdd]{font-family:var(--font-mono);font-size:var(--fs-6xl);font-weight:var(--fw-light);letter-spacing:var(--ls-tight);color:var(--text-strong)}.hero__title em[data-v-80e32bdd]{font-style:normal;color:var(--accent)}.hero__sub[data-v-80e32bdd]{max-width:46ch;margin:var(--space-5) 0 var(--space-6);font-family:var(--font-sans);font-size:var(--fs-lg);line-height:var(--lh-relaxed);color:var(--text-body)}.hero__cta[data-v-80e32bdd]{display:flex;flex-wrap:wrap;gap:var(--space-3);margin-bottom:var(--space-6)}.hero__badge-wrap[data-v-80e32bdd]{display:inline-flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-6);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-muted)}.hero__badge-wrap a[data-v-80e32bdd]{color:var(--accent);text-decoration:underline}.hero__badge-wrap a[data-v-80e32bdd]:hover{color:var(--accent-hover)}.hero__badge-wrap a[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hero__pulse-dot[data-v-80e32bdd]{width:8px;height:8px;border-radius:var(--radius-circle);background:var(--success);box-shadow:0 0 color-mix(in srgb,var(--success) 60%,transparent);animation:pulse-dot-80e32bdd 2.2s infinite var(--ease-out)}@media(prefers-reduced-motion:reduce){.hero__pulse-dot[data-v-80e32bdd]{animation:none}}@keyframes pulse-dot-80e32bdd{0%{box-shadow:0 0 color-mix(in srgb,var(--success) 60%,transparent)}70%{box-shadow:0 0 0 6px color-mix(in srgb,var(--success) 0%,transparent)}to{box-shadow:0 0 color-mix(in srgb,var(--success) 0%,transparent)}}.section__title[data-v-80e32bdd]{margin-bottom:var(--space-8);font-family:var(--font-mono);font-size:var(--fs-3xl);font-weight:var(--fw-regular);color:var(--text-strong)}.grid-3[data-v-80e32bdd]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-5);margin:0;padding:0;list-style:none}.grid-3>li[data-v-80e32bdd],.offer[data-v-80e32bdd]{display:flex}.offer[data-v-80e32bdd]{flex-direction:column;width:100%}.offer__top[data-v-80e32bdd]{justify-content:space-between;margin-bottom:var(--space-4)}.offer__icon[data-v-80e32bdd],.offer__top[data-v-80e32bdd]{display:flex;align-items:center}.offer__icon[data-v-80e32bdd]{justify-content:center;width:var(--space-10);height:var(--space-10);font-size:22px;color:var(--accent);background:var(--accent-soft);border-radius:var(--radius-md)}.offer__no[data-v-80e32bdd]{font-size:var(--fs-xs);letter-spacing:var(--ls-wider);color:var(--text-faint)}.offer__no[data-v-80e32bdd],.offer__title[data-v-80e32bdd]{font-family:var(--font-mono)}.offer__title[data-v-80e32bdd]{margin-bottom:var(--space-2);font-size:var(--fs-xl);font-weight:var(--fw-regular);color:var(--text-strong)}.offer__desc[data-v-80e32bdd]{margin:0 0 var(--space-4);font-family:var(--font-sans);font-size:var(--fs-sm);line-height:var(--lh-relaxed);color:var(--text-body)}.offer__points[data-v-80e32bdd]{display:flex;flex-direction:column;gap:var(--space-2);margin:0 0 var(--space-4);padding:0;list-style:none}.offer__points li[data-v-80e32bdd]{display:flex;gap:var(--space-2);align-items:flex-start;font-family:var(--font-mono);font-size:var(--fs-xs);line-height:var(--lh-normal);color:var(--text-muted)}.offer__check[data-v-80e32bdd]{flex-shrink:0;margin-top:calc(var(--space-1)/2);font-size:var(--fs-sm);color:var(--term-green)}.offer__tags[data-v-80e32bdd]{margin-bottom:var(--space-4)}.offer__price[data-v-80e32bdd]{margin-top:auto;padding-top:var(--space-4);border-top:1px dashed var(--border-subtle);font-size:var(--fs-xs)}.offer__more[data-v-80e32bdd],.offer__price[data-v-80e32bdd]{font-family:var(--font-mono);color:var(--accent)}.offer__more[data-v-80e32bdd]{margin-top:var(--space-3);font-size:var(--fs-sm);text-decoration:none}.offer__more[data-v-80e32bdd]:hover{text-decoration:underline}.offer__more[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent);border-radius:var(--radius-xs)}.work[data-v-80e32bdd]{display:flex;flex-direction:column;margin:0;padding:0;list-style:none}.work>li[data-v-80e32bdd]{display:block;width:100%}.work__row[data-v-80e32bdd]{position:relative;display:grid;grid-template-columns:56px 1fr auto;gap:var(--space-6);align-items:center;padding:var(--space-8) var(--space-3);border-top:1px solid var(--border-subtle);text-decoration:none;color:inherit;transition:padding-left var(--dur-slow) var(--ease-out),background var(--dur-slow) var(--ease-standard)}.work__row[data-v-80e32bdd]:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,var(--accent-soft),transparent 60%);opacity:0;transition:opacity var(--dur-slow) var(--ease-standard)}li:last-child .work__row[data-v-80e32bdd]{border-bottom:1px solid var(--border-subtle)}.work__row--link[data-v-80e32bdd]{cursor:pointer}.work__row--link[data-v-80e32bdd]:hover{padding-left:var(--space-6)}.work__row--link[data-v-80e32bdd]:hover:before{opacity:1}.work__row--link:hover .work__name[data-v-80e32bdd]{color:var(--accent)}.work__row--link:hover .work__go[data-v-80e32bdd]{color:var(--accent);transform:translate(6px,-6px)}.work__row--link[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent);border-radius:var(--radius-xs)}.work__no[data-v-80e32bdd]{font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-faint)}.work__main[data-v-80e32bdd],.work__no[data-v-80e32bdd]{position:relative}.work__topline[data-v-80e32bdd]{display:flex;flex-wrap:wrap;align-items:baseline;gap:var(--space-3)}.work__name[data-v-80e32bdd]{margin:0;font-family:var(--font-mono);font-size:clamp(1.4rem,2.8vw,2rem);font-weight:var(--fw-regular);letter-spacing:var(--ls-tight);color:var(--text-strong);transition:color var(--dur-base) var(--ease-standard)}.work__status[data-v-80e32bdd]{color:var(--accent);letter-spacing:var(--ls-wide)}.work__role[data-v-80e32bdd],.work__status[data-v-80e32bdd]{font-family:var(--font-mono);font-size:var(--fs-xs)}.work__role[data-v-80e32bdd]{margin:var(--space-1) 0 0;color:var(--text-muted)}.work__desc[data-v-80e32bdd]{max-width:65ch;margin:var(--space-3) 0 0;font-size:var(--fs-sm)}.work__tags[data-v-80e32bdd]{margin-top:var(--space-4)}.work__go[data-v-80e32bdd]{position:relative;font-size:var(--fs-xl);color:var(--text-faint);transition:transform var(--dur-base) var(--ease-out),color var(--dur-base) var(--ease-standard)}.stats[data-v-80e32bdd]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin:var(--space-12) 0 0;padding:0;list-style:none}.stat[data-v-80e32bdd]{padding:var(--space-6);background:color-mix(in srgb,var(--surface-1) 70%,transparent);border:1px solid var(--border-subtle);border-radius:var(--radius-md)}.stat b[data-v-80e32bdd]{display:block;margin-bottom:var(--space-1);font-size:var(--fs-5xl);font-weight:var(--fw-light);line-height:1;letter-spacing:var(--ls-tight);color:var(--text-strong)}.stat b[data-v-80e32bdd],.stat span[data-v-80e32bdd]{font-family:var(--font-mono)}.stat span[data-v-80e32bdd]{font-size:var(--fs-sm);letter-spacing:var(--ls-wide);color:var(--text-muted)}.block__head--row[data-v-80e32bdd]{display:flex;align-items:flex-end;justify-content:space-between;gap:var(--space-6);margin-bottom:var(--space-8)}.block__head--row .section__title[data-v-80e32bdd]{margin-bottom:0}.seeall[data-v-80e32bdd]{display:inline-flex;flex:none;align-items:center;gap:var(--space-2);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-muted);text-decoration:none;white-space:nowrap;transition:color var(--dur-base) var(--ease-standard)}.seeall[data-v-80e32bdd]:hover{color:var(--accent)}.seeall[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent);border-radius:var(--radius-xs)}.seeall__icon[data-v-80e32bdd]{font-size:var(--fs-base)}.journal[data-v-80e32bdd]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-5);margin:0;padding:0;list-style:none}.journal>li[data-v-80e32bdd],.jpost[data-v-80e32bdd]{display:flex}.jpost[data-v-80e32bdd]{flex-direction:column;width:100%;color:inherit;text-decoration:none}.jpost:hover .jpost__title[data-v-80e32bdd]{color:var(--accent)}.jpost:hover .jpost__arrow[data-v-80e32bdd]{color:var(--accent);transform:translate(4px,-4px)}.jpost__thumb[data-v-80e32bdd]{width:100%;height:160px;-o-object-fit:cover;object-fit:cover;border-bottom:1px solid var(--border-subtle)}.jpost__body[data-v-80e32bdd]{display:flex;flex:1;flex-direction:column;padding:var(--space-5)}.jpost__tags[data-v-80e32bdd]{margin-bottom:var(--space-3)}.jpost__title[data-v-80e32bdd]{margin:0 0 var(--space-2);font-family:var(--font-mono);font-size:var(--fs-lg);font-weight:var(--fw-regular);line-height:var(--lh-snug);color:var(--text-strong);transition:color var(--dur-base) var(--ease-standard)}.jpost__desc[data-v-80e32bdd]{margin:0 0 var(--space-4);font-size:var(--fs-sm);color:var(--text-muted)}.jpost__meta[data-v-80e32bdd]{display:flex;align-items:center;gap:var(--space-2);margin-top:auto;padding-top:var(--space-4);border-top:1px dashed var(--border-subtle);font-family:var(--font-mono);font-size:var(--fs-xs);color:var(--text-faint)}.jpost__arrow[data-v-80e32bdd]{margin-left:auto;font-size:var(--fs-base);color:var(--text-faint);transition:transform var(--dur-base) var(--ease-out),color var(--dur-base) var(--ease-standard)}.journal__empty[data-v-80e32bdd]{max-width:60ch;margin:0 auto;text-align:center}.journal__empty-code[data-v-80e32bdd]{margin:0 0 var(--space-2);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--accent)}.journal__empty-text[data-v-80e32bdd]{margin:0 0 var(--space-5);font-family:var(--font-sans);font-size:var(--fs-sm);line-height:var(--lh-relaxed);color:var(--text-muted)}.cta[data-v-80e32bdd]{position:relative;padding:clamp(48px,6vw,72px) var(--space-6);overflow:hidden;text-align:center;background:radial-gradient(ellipse 80% 120% at 50% 0,var(--accent-2-soft),transparent 70%),color-mix(in srgb,var(--surface-2) 60%,transparent);border:1px solid var(--border-subtle);border-radius:var(--radius-lg)}.cta__eyebrow[data-v-80e32bdd]{display:inline-block}.cta__title[data-v-80e32bdd]{margin:0 0 var(--space-4);font-family:var(--font-mono);font-size:clamp(1.8rem,4vw,2.8rem);font-weight:var(--fw-light);line-height:var(--lh-tight);letter-spacing:var(--ls-tight);color:var(--text-strong)}.cta__highlight[data-v-80e32bdd]{font-style:italic;color:var(--accent)}.cta__subtitle[data-v-80e32bdd]{max-width:58ch;margin:0 auto var(--space-8);font-family:var(--font-sans);font-size:var(--fs-base);line-height:var(--lh-relaxed);color:var(--text-muted)}.cta__actions[data-v-80e32bdd]{display:flex;flex-wrap:wrap;gap:var(--space-4);justify-content:center}@media(max-width:900px){.hero__grid[data-v-80e32bdd]{grid-template-columns:1fr}.hero__title[data-v-80e32bdd]{font-size:var(--fs-4xl)}.grid-3[data-v-80e32bdd],.journal[data-v-80e32bdd]{grid-template-columns:1fr}.block__head--row[data-v-80e32bdd]{flex-direction:column;align-items:flex-start}}@media(max-width:680px){.work__row[data-v-80e32bdd]{grid-template-columns:1fr;gap:var(--space-3)}.work__go[data-v-80e32bdd],.work__no[data-v-80e32bdd]{display:none}.stats[data-v-80e32bdd]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.anim[data-v-80e32bdd]{animation:none}.jpost__arrow[data-v-80e32bdd],.work__go[data-v-80e32bdd],.work__row[data-v-80e32bdd]{transition:none}.work__row--link[data-v-80e32bdd]:hover{padding-left:var(--space-3)}.work__row--link:hover .work__go[data-v-80e32bdd]{transform:none}}</style><style>.hexrow[data-v-a86d2094]{display:flex;gap:var(--space-5);margin:0;padding:0;list-style:none}</style><style>.hex[data-v-274e53e2]{display:inline-flex;align-items:center;justify-content:center;width:46px;height:53px;font-size:20px;color:var(--text-muted);cursor:pointer;background:var(--surface-2);clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);transition:color var(--dur-base) var(--ease-standard),background var(--dur-base) var(--ease-standard)}.hex[data-v-274e53e2]:hover{color:var(--ink-on-accent);background:var(--accent)}.hex[data-v-274e53e2]:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.hex__label[data-v-274e53e2]{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;white-space:nowrap;border:0;clip-path:inset(50%)}@media(prefers-reduced-motion:reduce){.hex[data-v-274e53e2]{transition:none}}</style><style>.zcard[data-v-c5ec7be1]{position:relative;overflow:hidden;background:var(--bg-card);color:var(--text-body);border:1px solid var(--border-subtle);border-radius:var(--radius-md);box-shadow:var(--shadow-2),var(--shadow-hairline);transition:border-color var(--dur-base) var(--ease-standard),transform var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-standard)}.zcard--pad[data-v-c5ec7be1]{padding:var(--space-6)}.zcard--interactive[data-v-c5ec7be1]{cursor:pointer}.zcard--interactive[data-v-c5ec7be1]:hover{border-color:var(--border-strong);transform:translateY(-2px);box-shadow:var(--shadow-3),var(--shadow-hairline)}.zcard--interactive[data-v-c5ec7be1]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.zcard--accent[data-v-c5ec7be1]:before{content:"";position:absolute;inset:0 0 auto;height:2px;background:linear-gradient(90deg,var(--accent),var(--aubergine-light))}.zcard--featured[data-v-c5ec7be1]{border-color:var(--accent-ring);box-shadow:var(--glow-accent),var(--shadow-hairline)}@media(prefers-reduced-motion:reduce){.zcard[data-v-c5ec7be1]{transition:none}.zcard--interactive[data-v-c5ec7be1]:hover{transform:none}}</style><style>.ztag[data-v-6db1c85c]{display:inline-flex;align-items:center;gap:var(--space-2);box-sizing:border-box;height:26px;padding:0 var(--space-3);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:var(--fw-regular);line-height:1;white-space:nowrap;color:var(--text-body);background:var(--surface-2);border:1px solid var(--border-subtle);border-radius:var(--radius-pill);transition:border-color var(--dur-fast) var(--ease-standard),color var(--dur-fast) var(--ease-standard)}.ztag[data-v-6db1c85c]:before{content:"#";color:var(--accent)}.ztag--plain[data-v-6db1c85c]:before{display:none;content:none}.ztag--clickable[data-v-6db1c85c]{cursor:pointer}.ztag--clickable[data-v-6db1c85c]:hover{border-color:var(--border-strong);color:var(--text-strong)}.ztag--clickable[data-v-6db1c85c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.ztag__remove[data-v-6db1c85c]{display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;margin-right:-2px;padding:0;font-family:var(--font-mono);font-size:var(--fs-sm);line-height:1;color:var(--text-muted);cursor:pointer;background:none;border:none;border-radius:var(--radius-circle)}.ztag__remove[data-v-6db1c85c]:hover{color:var(--term-red)}.ztag__remove[data-v-6db1c85c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}@media(prefers-reduced-motion:reduce){.ztag[data-v-6db1c85c]{transition:none}}</style><link rel="stylesheet" href="/_nuxt/entry.QaoIl47T.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZButton.CyAD_ftR.css" crossorigin><link rel="stylesheet" href="/_nuxt/LinkListComponent.BRYW5MSq.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZBadge.BAw1B01J.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZTag.f2Aq6DLg.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZCard.C5C9a-aj.css" crossorigin><link rel="modulepreload" as="script" crossorigin href="/_nuxt/kT-s8AA-.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/94XchtD0.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CZy76wlf.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/DlAUqK2U.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CDaHTzsF.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/DMhLy-fw.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CMQEDqfi.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/OpxrMEpG.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/C93KKm9n.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/1LEPDT53.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/ZsGxQ2mD.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/p0temu7u.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/BGMjmYXP.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CXmFvnQY.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/DvmfV0_A.js"><script type="module" src="/_nuxt/kT-s8AA-.js" crossorigin></script><meta name="description" content="Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL."><link rel="icon" type="image/x-icon" href="/favicon.ico"><script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","@id":"https://jouan.ovh/#organization","name":"Simon Jouan","url":"https://jouan.ovh","logo":"https://jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Rouen, France","addressCountry":"FR"}}</script><link rel="canonical" href="https://jouan.ovh"><script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"Simon Jouan — Développeur Full Stack TypeScript","url":"https://jouan.ovh","description":"Développeur Full Stack TypeScript — Nuxt / NestJS"}</script><script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Simon Jouan","jobTitle":"Développeur Full Stack TypeScript — Nuxt / NestJS","url":"https://jouan.ovh","image":"https://jouan.ovh/images/portrait.jpeg","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Rouen, France","addressCountry":"FR"}}</script><meta property="og:title" content="Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS"><meta property="og:description" content="Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL."><meta property="og:url" content="https://jouan.ovh"><meta property="og:type" content="website"><meta property="og:image" content="https://jouan.ovh/images/portrait.jpeg"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS"><meta name="twitter:description" content="Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL."><meta name="twitter:image" content="https://jouan.ovh/images/portrait.jpeg"></head><body><div id="__nuxt"><div class="init" data-v-e3708db0><header class="hdr" data-v-e3708db0 data-v-a782489c><div class="hdr__in" data-v-a782489c><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__brand" data-v-a782489c><svg class="zicon hdr__logo" viewbox="0 0 24 24" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><path d="M12 1.5 22.5 12 12 22.5 1.5 12z" fill="currentColor"/><path d="M12 1.5 22.5 12 12 12z" fill="#fff" fill-opacity="0.12"/></svg><b data-v-a782489c>jouan.ovh</b></a><nav class="hdr__nav" aria-label="Navigation principale" data-v-a782489c><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__link hdr__link--active" data-v-a782489c>Accueil</a><a href="/services" class="hdr__link" data-v-a782489c>Services</a><a href="/about" class="hdr__link" data-v-a782489c>À propos</a><a href="/blog" class="hdr__link" data-v-a782489c>Blog</a><a href="/contact" class="hdr__link" data-v-a782489c>Contact</a><!--]--></nav><div class="hdr__right" data-v-a782489c><div class="current-time hdr__clock" data-v-a782489c data-v-1e5503b4></div><span class="zbadge zbadge--success hdr__badge" data-v-a782489c data-v-fc077828><span class="zbadge__dot" aria-hidden="true" data-v-fc077828></span><!--[-->Disponible<!--]--></span><button class="hdr__action zbtn zbtn--terminal zbtn--sm" type="button" data-v-a782489c data-v-c154e5b1><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg><!--]--></span><!--[--> Terminal <!--]--><!----></button><a href="/contact" class="hdr__action zbtn zbtn--primary zbtn--sm" data-v-a782489c data-v-c154e5b1><!----><!--[--> Démarrer un projet <!--]--><!----></a><button class="hdr__burger" type="button" aria-expanded="false" aria-controls="hdr-mobile-menu" aria-label="Ouvrir le menu" data-v-a782489c><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg></button></div></div><!----><nav id="hdr-mobile-menu" class="hdr__menu" aria-label="Navigation mobile" data-v-a782489c><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__menu-link hdr__menu-link--active" data-v-a782489c>Accueil</a><a href="/services" class="hdr__menu-link" data-v-a782489c>Services</a><a href="/about" class="hdr__menu-link" data-v-a782489c>À propos</a><a href="/blog" class="hdr__menu-link" data-v-a782489c>Blog</a><a href="/contact" class="hdr__menu-link" data-v-a782489c>Contact</a><!--]--><div class="hdr__menu-actions" data-v-a782489c><button class="zbtn zbtn--terminal zbtn--sm" type="button" data-v-a782489c data-v-c154e5b1><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg><!--]--></span><!--[--> Terminal <!--]--><!----></button><a href="/contact" class="zbtn zbtn--primary zbtn--sm" data-v-a782489c data-v-c154e5b1><!----><!--[--> Démarrer un projet <!--]--><!----></a></div></nav><div data-v-a782489c><!--[--><!--]--></div></header><!--[--><main class="home" data-v-80e32bdd><span data-v-80e32bdd></span><div class="atmos" aria-hidden="true" data-v-80e32bdd data-v-796c86c1><div class="aurora aurora--auberg" data-v-796c86c1></div><div class="aurora aurora--orange" data-v-796c86c1></div><div class="aurora aurora--red" data-v-796c86c1></div><div class="grid-dots" data-v-796c86c1></div><div class="scanlines" data-v-796c86c1></div><div class="vignette" data-v-796c86c1></div></div><!----><section class="hero hero__grad" data-v-80e32bdd><div class="hero__in container" data-v-80e32bdd><div class="hero__grid" data-v-80e32bdd><div class="anim hero__text" data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p><h1 class="hero__title" data-v-80e32bdd>Développeur Full Stack TypeScript</h1><p class="hero__sub" data-v-80e32bdd> Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l&#39;architecture au déploiement, j&#39;interviens sur des produits neufs comme sur des applications existantes. </p><div class="hero__badge-wrap" data-v-80e32bdd><span class="hero__pulse-dot" aria-hidden="true" data-v-80e32bdd></span><span data-v-80e32bdd>Disponible pour missions freelance</span><!--[--><span aria-hidden="true" data-v-80e32bdd> · </span><a href="https://www.malt.fr/profile/simonjouan" rel="noopener" target="_blank" data-v-80e32bdd><!--[--> Profil Malt vérifié <!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a><!--]--></div><div class="hero__cta" data-v-80e32bdd><a href="/contact" class="zbtn zbtn--primary zbtn--lg" data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Discuter de votre projet <!--]--><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg><!--]--></span></a><a href="/about" class="zbtn zbtn--secondary zbtn--lg" data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Voir le parcours &amp; CV <!--]--><!----></a></div></div><div class="anim hero__term-col" data-v-80e32bdd><div class="hero-term" data-v-80e32bdd data-v-313a6524><div class="hero-term__bar" data-v-313a6524><span class="hero-term__dots" aria-hidden="true" data-v-313a6524><span class="hero-term__dot hero-term__dot--close" data-v-313a6524></span><span class="hero-term__dot hero-term__dot--min" data-v-313a6524></span><span class="hero-term__dot hero-term__dot--max" data-v-313a6524></span></span><span class="hero-term__title" data-v-313a6524>anon.@jouan.ovh: ~</span></div><div class="hero-term__body" data-v-313a6524><!--[--><!--]--><!----><!----><noscript data-v-313a6524><div data-v-313a6524><!--[--><!--[--><p class="hero-term__line" data-v-313a6524><span class="prm" data-v-313a6524><span class="prm__user" data-v-313a6524>anon.@jouan.ovh</span><span class="prm__sep" data-v-313a6524>:</span><span class="prm__dir" data-v-313a6524>~</span><span class="prm__sep" data-v-313a6524>$ </span><span class="prm__cmd" data-v-313a6524>whoami</span></span></p><p class="hero-term__out--ink hero-term__out" data-v-313a6524>Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)</p><!--]--><!--[--><p class="hero-term__line" data-v-313a6524><span class="prm" data-v-313a6524><span class="prm__user" data-v-313a6524>anon.@jouan.ovh</span><span class="prm__sep" data-v-313a6524>:</span><span class="prm__dir" data-v-313a6524>~</span><span class="prm__sep" data-v-313a6524>$ </span><span class="prm__cmd" data-v-313a6524>cat focus.txt</span></span></p><p class="hero-term__out--blue hero-term__out" data-v-313a6524>SaaS, web apps, clean architecture, automated testing (QA) &amp; AI engineering</p><!--]--><!--[--><p class="hero-term__line" data-v-313a6524><span class="prm" data-v-313a6524><span class="prm__user" data-v-313a6524>anon.@jouan.ovh</span><span class="prm__sep" data-v-313a6524>:</span><span class="prm__dir" data-v-313a6524>~</span><span class="prm__sep" data-v-313a6524>$ </span><span class="prm__cmd" data-v-313a6524>ls ~/projets</span></span></p><p class="hero-term__out--green hero-term__out" data-v-313a6524>keova.app/  tryon-saas/  nodium-lab/</p><!--]--><!--]--></div></noscript></div></div></div></div></div></section><div class="marquee" aria-hidden="true" data-v-80e32bdd data-v-19576991><div class="marquee__track" data-v-19576991><!--[--><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>TypeScript</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Nuxt 4</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Vue.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>NestJS</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Node.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>PostgreSQL</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>TypeORM</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Stripe Connect</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Cypress</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Docker</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>REST API</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Vitest</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><!--]--><!--[--><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>TypeScript</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Nuxt 4</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Vue.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>NestJS</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Node.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>PostgreSQL</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>TypeORM</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Stripe Connect</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Cypress</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Docker</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>REST API</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Vitest</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><!--]--></div></div><section class="section" data-v-80e32bdd><div class="container" data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>ce que je propose</p><h2 class="section__title" data-v-80e32bdd>Trois expertises pour concevoir et faire évoluer vos applications</h2><ul class="grid-3" data-v-80e32bdd><!--[--><li data-v-80e32bdd><div class="offer zcard zcard--pad zcard--interactive" data-v-80e32bdd data-v-c5ec7be1><!--[--><div class="offer__top" data-v-80e32bdd><div class="offer__icon" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div><span class="offer__no" data-v-80e32bdd>01 / 03</span></div><h3 class="offer__title" data-v-80e32bdd>Création d&#39;applications web &amp; SaaS</h3><p class="offer__desc" data-v-80e32bdd>De l&#39;idée à la production : architecture, développement front &amp; back, base de données, authentification et paiements Stripe.</p><ul class="offer__points" data-v-80e32bdd><!--[--><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Architecture logicielle &amp; APIs REST</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Applications Vue 3 / Nuxt 4 &amp; NestJS</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Intégration Stripe &amp; PostgreSQL</span></li><!--]--></ul><ul class="hero__tags offer__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->NestJS<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->PostgreSQL<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Stripe Connect<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-80e32bdd><span data-v-80e32bdd>Sur devis / au sprint</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Création d&#39;applications web &amp; SaaS" data-v-80e32bdd> En savoir plus → </a><!--]--></div></li><li data-v-80e32bdd><div class="offer zcard zcard--pad zcard--interactive zcard--accent zcard--featured" data-v-80e32bdd data-v-c5ec7be1><!--[--><div class="offer__top" data-v-80e32bdd><div class="offer__icon" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg></div><span class="offer__no" data-v-80e32bdd>02 / 03</span></div><h3 class="offer__title" data-v-80e32bdd>Développement Full Stack TypeScript</h3><p class="offer__desc" data-v-80e32bdd>Renfort d&#39;équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.</p><ul class="offer__points" data-v-80e32bdd><!--[--><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Composants Vue 3 / Nuxt avec TypeScript strict</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Microservices &amp; backend modulaire NestJS</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Fiabilisation et optimisation des performances</span></li><!--]--></ul><ul class="hero__tags offer__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->TypeScript<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Vue 3<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->NestJS<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Node.js<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-80e32bdd><span data-v-80e32bdd>Sur devis / TJM</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Développement Full Stack TypeScript" data-v-80e32bdd> En savoir plus → </a><!--]--></div></li><li data-v-80e32bdd><div class="offer zcard zcard--pad zcard--interactive" data-v-80e32bdd data-v-c5ec7be1><!--[--><div class="offer__top" data-v-80e32bdd><div class="offer__icon" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M12 3l1.8 5.6L19.5 10l-5.7 1.4L12 17l-1.8-5.6L4.5 10l5.7-1.4z"/><path d="M19 15l.7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9z"/></svg></div><span class="offer__no" data-v-80e32bdd>03 / 03</span></div><h3 class="offer__title" data-v-80e32bdd>Évolution &amp; Architecture applicative</h3><p class="offer__desc" data-v-80e32bdd>Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).</p><ul class="offer__points" data-v-80e32bdd><!--[--><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Audits techniques de code &amp; migrations de versions</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Tests E2E Cypress &amp; tests unitaires Vitest</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Pipelines CI/CD &amp; conteneurisation Docker</span></li><!--]--></ul><ul class="hero__tags offer__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Cypress<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Vitest<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Docker<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->CI/CD<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-80e32bdd><span data-v-80e32bdd>Au forfait / audit</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Évolution &amp; Architecture applicative" data-v-80e32bdd> En savoir plus → </a><!--]--></div></li><!--]--></ul></div></section><section class="section section--sunken" data-v-80e32bdd><div class="container" data-v-80e32bdd><div class="block__head" data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>projets sélectionnés</p><h2 class="section__title" data-v-80e32bdd>Des produits qui tournent en production</h2></div><ul class="work" data-v-80e32bdd><!--[--><li data-v-80e32bdd><a href="https://keova.app" rel="noopener" target="_blank" class="work__row work__row--link" data-hot data-v-80e32bdd><!--[--><span class="work__no" data-v-80e32bdd>01</span><div class="work__main" data-v-80e32bdd><div class="work__topline" data-v-80e32bdd><h3 class="work__name" data-v-80e32bdd>keova.app</h3><span class="work__status" data-v-80e32bdd>En production</span></div><p class="work__role" data-v-80e32bdd>Co-fondateur &amp; Développeur Full Stack</p><p class="prose work__desc" data-v-80e32bdd>Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).</p><ul class="hero__tags work__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nest.js<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->postgresql<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->stripe<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->saas<!--]--><!----></span></li><!--]--></ul></div><span class="work__go" aria-hidden="true" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-80e32bdd><div class="work__row" data-v-80e32bdd><span class="work__no" data-v-80e32bdd>02</span><div class="work__main" data-v-80e32bdd><div class="work__topline" data-v-80e32bdd><h3 class="work__name" data-v-80e32bdd>TryOn</h3><span class="work__status" data-v-80e32bdd>Étude de cas (MVP livré)</span></div><p class="work__role" data-v-80e32bdd>CTO &amp; Développeur Full Stack</p><p class="prose work__desc" data-v-80e32bdd>Plateforme SaaS B2B d&#39;essayage virtuel de vêtements via l&#39;IA générative (diffusion models, microservices asynchrones, files Redis).</p><ul class="hero__tags work__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nest.js<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->python<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->comfyui<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->ia<!--]--><!----></span></li><!--]--></ul></div><!----></div></li><li data-v-80e32bdd><div class="work__row" data-v-80e32bdd><span class="work__no" data-v-80e32bdd>03</span><div class="work__main" data-v-80e32bdd><div class="work__topline" data-v-80e32bdd><h3 class="work__name" data-v-80e32bdd>Nodium</h3><span class="work__status" data-v-80e32bdd>R&amp;D / En cours</span></div><p class="work__role" data-v-80e32bdd>Créateur &amp; Ingénieur IA</p><p class="prose work__desc" data-v-80e32bdd>Plateforme desktop d&#39;orchestration d&#39;agents IA autonomes, gestion de permissions et mémoire contextuelle.</p><ul class="hero__tags work__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->typescript<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->electron<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->agents<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->ia<!--]--><!----></span></li><!--]--></ul></div><!----></div></li><!--]--></ul><ul class="stats" data-v-80e32bdd><!--[--><li class="stat" data-v-80e32bdd><b data-v-80e32bdd>11</b><span data-v-80e32bdd>années d&#39;expérience web</span></li><li class="stat" data-v-80e32bdd><b data-v-80e32bdd>100%</b><span data-v-80e32bdd>TypeScript &amp; SaaS de bout en bout</span></li><li class="stat" data-v-80e32bdd><b data-v-80e32bdd>QA</b><span data-v-80e32bdd>culture d&#39;automatisation &amp; zéro régression</span></li><!--]--></ul></div></section><section class="section" data-v-80e32bdd><div class="container" data-v-80e32bdd><div class="block__head block__head--row" data-v-80e32bdd><div data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>~/journal</p><h2 class="section__title" data-v-80e32bdd>Notes de dev, écrites en construisant</h2></div><a href="/blog" class="seeall" data-hot data-v-80e32bdd> cat tous-les-articles <svg class="zicon seeall__icon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></a></div><div class="journal__empty zcard zcard--pad" data-v-80e32bdd data-v-c5ec7be1><!--[--><p class="journal__empty-code" data-v-80e32bdd>$ cat ~/journal/*.md</p><p class="journal__empty-text" data-v-80e32bdd>Les notes d&#39;ingénierie et retours d&#39;expérience sont en cours de rédaction.</p><a href="/blog" class="zbtn zbtn--secondary zbtn--sm" data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Consulter la section blog <!--]--><!----></a><!--]--></div></div></section><section class="section section--sunken" data-v-80e32bdd><div class="container" data-v-80e32bdd><div class="cta" data-v-80e32bdd><p class="eyebrow cta__eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>$ </span>./contact --start</p><h2 class="cta__title" data-v-80e32bdd>Un projet en tête ? Mettons-le <span class="cta__highlight" data-v-80e32bdd>en production</span>.</h2><p class="cta__subtitle" data-v-80e32bdd> Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript, parlons-en. </p><div class="cta__actions" data-v-80e32bdd><a href="/contact" class="zbtn zbtn--primary zbtn--lg" data-hot data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Discuter de votre projet <!--]--><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg><!--]--></span></a><a href="https://www.malt.fr/profile/simonjouan" rel="noopener" target="_blank" data-hot class="zbtn zbtn--secondary zbtn--lg" data-v-80e32bdd data-v-c154e5b1><!--[--><!----><!--[--> Me contacter sur Malt <!--]--><!----><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a><a href="/about" class="zbtn zbtn--ghost zbtn--lg" data-hot data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Voir le parcours &amp; CV <!--]--><!----></a></div></div></div></section></main><!--]--><footer class="ftr" data-v-e3708db0 data-v-ec74c766><div class="ftr__container" data-v-ec74c766><div class="ftr__in" data-v-ec74c766><div class="ftr__brand-col" data-v-ec74c766><a aria-current="page" href="/" class="router-link-active router-link-exact-active ftr__brand" data-v-ec74c766><svg class="zicon ftr__logo" viewbox="0 0 24 24" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-ec74c766 data-v-70d98695><path d="M12 1.5 22.5 12 12 22.5 1.5 12z" fill="currentColor"/><path d="M12 1.5 22.5 12 12 12z" fill="#fff" fill-opacity="0.12"/></svg><b data-v-ec74c766>jouan.ovh</b></a><p class="ftr__tagline" data-v-ec74c766>Développeur Full Stack TypeScript — Nuxt / NestJS. Rouen, France.</p></div><nav class="ftr__col" aria-label="Navigation du pied de page" data-v-ec74c766><h2 class="ftr__title" data-v-ec74c766>// Navigation</h2><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active ftr__link" data-v-ec74c766>Accueil</a><a href="/services" class="ftr__link" data-v-ec74c766>Services</a><a href="/about" class="ftr__link" data-v-ec74c766>À propos</a><a href="/blog" class="ftr__link" data-v-ec74c766>Blog</a><a href="/contact" class="ftr__link" data-v-ec74c766>Contact</a><a href="/confidentialite" class="ftr__link" data-v-ec74c766>Confidentialité</a><a href="/mentions-legales" class="ftr__link" data-v-ec74c766>Mentions légales</a><!--]--></nav><div class="ftr__col" data-v-ec74c766><h2 class="ftr__title" data-v-ec74c766>// Projets</h2><ul class="ftr__list" data-v-ec74c766><!--[--><li data-v-ec74c766><a href="https://keova.app" rel="noopener noreferrer" target="_blank" class="ftr__link" data-v-ec74c766><!--[-->keova.app<!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-ec74c766><span class="ftr__link ftr__link--static" data-v-ec74c766>TryOn</span></li><li data-v-ec74c766><span class="ftr__link ftr__link--static" data-v-ec74c766>Nodium</span></li><!--]--></ul></div><div class="ftr__col" data-v-ec74c766><h2 class="ftr__title" data-v-ec74c766>// Réseaux</h2><ul class="hexrow" data-v-ec74c766 data-v-a86d2094><!--[--><li data-v-a86d2094><a href="https://github.com/zohac" rel="noopener noreferrer" target="_blank" class="hex" data-v-a86d2094 data-v-274e53e2><!--[--><!--[--><svg class="zicon" viewbox="0 0 16 16" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a86d2094 data-v-70d98695><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg><!--]--><span class="hex__label" data-v-274e53e2><!--[-->GitHub<!--]--></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-a86d2094><a href="https://twitter.com/fenrir0680" rel="noopener noreferrer" target="_blank" class="hex" data-v-a86d2094 data-v-274e53e2><!--[--><!--[--><svg class="zicon" viewbox="0 0 16 16" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a86d2094 data-v-70d98695><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/></svg><!--]--><span class="hex__label" data-v-274e53e2><!--[-->Twitter<!--]--></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-a86d2094><a href="https://www.linkedin.com/in/simonjouan/" rel="noopener noreferrer" target="_blank" class="hex" data-v-a86d2094 data-v-274e53e2><!--[--><!--[--><svg class="zicon" viewbox="0 0 16 16" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a86d2094 data-v-70d98695><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg><!--]--><span class="hex__label" data-v-274e53e2><!--[-->LinkedIn<!--]--></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><!--]--></ul></div></div><div class="ftr__bottom" data-v-ec74c766><span data-v-ec74c766>© 2026 Simon Jouan — jouan.ovh</span><span class="ftr__term" data-v-ec74c766>anon.@jouan.ovh:~$ <span class="ftr__cmd" data-v-ec74c766>echo &quot;merci de votre visite&quot;</span></span></div></div></footer></div></div><div id="teleports"></div><script>window.__NUXT__={};window.__NUXT__.config={public:{web3formsAccessKey:"320b7ade-7b76-421e-a4bd-f353fd22348b",siteUrl:"https://jouan.ovh",mdc:{components:{prose:true,map:{},customElements:[]},headings:{anchorLinks:{h1:false,h2:true,h3:true,h4:true,h5:false,h6:false}},highlight:false},content:{wsUrl:""}},app:{baseURL:"/",buildId:"2fb32740-4322-408a-893a-7d31d08f3e02",buildAssetsDir:"/_nuxt/",cdnURL:""}}</script><script type="application/json" data-nuxt-data="nuxt-app" data-ssr="true" id="__NUXT_DATA__">[["ShallowReactive",1],{"prerenderedAt":2,"data":3,"state":6,"once":8,"_errors":9,"serverRendered":11,"path":12},1789327523310,["ShallowReactive",4],{"home-articles":5},[],["Reactive",7],{},["Set"],["ShallowReactive",10],{"home-articles":-1},true,"\u002F"]</script></body></html>
./docs/implementation-artifacts/code-reviews/11-5/raw-blind-hunter.md:3329:- **Pas de framework de test non installé :** Le projet n'embarque pas Vitest ou Cypress dans ses dépendances actuelles. La barre de conformité logicielle s'appuie sur ESLint, Stylelint, vue-tsc, le prerender Nitro 13 routes et l'audit émulé OS-level.
./docs/implementation-artifacts/code-reviews/11-5/raw-blind-hunter.md:3781:    desc: "Tests automatisés et fiabilisation applicative — Node.js, TypeScript, TestCafé.",
./docs/implementation-artifacts/code-reviews/11-5/raw-blind-hunter.md:3997:   112	    desc: "Tests automatisés et fiabilisation applicative — Node.js, TypeScript, TestCafé.",
./docs/implementation-artifacts/code-reviews/11-5/raw-blind-hunter.md:4140:    87	- **Pas de framework de test non installé :** Le projet n'embarque pas Vitest ou Cypress dans ses dépendances actuelles. La barre de conformité logicielle s'appuie sur ESLint, Stylelint, vue-tsc, le prerender Nitro 13 routes et l'audit émulé OS-level.
./docs/implementation-artifacts/code-reviews/11-6/raw-blind-hunter.md:829:-  cypress: "Cypress",
./docs/implementation-artifacts/code-reviews/11-6/raw-blind-hunter.md:830:+  testcafe: "TestCafé",
./docs/implementation-artifacts/code-reviews/11-6/raw-blind-hunter.md:1255:-  "cypress",
./docs/implementation-artifacts/code-reviews/11-6/raw-blind-hunter.md:1256:+  "testcafe",
./docs/implementation-artifacts/code-reviews/11-6/raw-blind-hunter.md:1344:-      "Tests E2E Cypress & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-6/raw-blind-hunter.md:1345:+      "Tests E2E TestCafé & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-6/raw-blind-hunter.md:1348:-    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-6/raw-blind-hunter.md:1349:+    tags: ["TestCafé", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-6/raw-blind-hunter.md:2144:-  cypress: "Cypress",
./docs/implementation-artifacts/code-reviews/11-6/raw-blind-hunter.md:2145:+  testcafe: "TestCafé",
./docs/implementation-artifacts/code-reviews/11-6/raw-blind-hunter.md:2156:/bin/zsh -lc "rg -n \"HomeAtmos|hero__|stat|ZButton|ZCard|CurrentTime|logo_white|@media \\(hover|prefers-reduced-motion|section--sunken|testcafe|cypress\" app docs/design_system/ui_kits/jouan-site/Home\\ -\\ Awwwards.html public content.config.ts package.json" in /Users/simon/dev/jouan.ovh
./docs/implementation-artifacts/code-reviews/11-6/raw-blind-hunter.md:2341:app/data/site.ts:50:  "testcafe",
./docs/implementation-artifacts/code-reviews/11-6/raw-blind-hunter.md:2357:app/components/home/HomeStackMarquee.vue:39:  testcafe: "TestCafé",
./docs/implementation-artifacts/code-reviews/11-6/raw-blind-hunter.md:3674:   296	      "Tests E2E TestCafé & tests unitaires Vitest",
./docs/implementation-artifacts/code-reviews/11-6/raw-blind-hunter.md:3677:   299	    tags: ["TestCafé", "Vitest", "Docker", "CI/CD"],
./docs/implementation-artifacts/code-reviews/11-1/raw-edge-case-hunter.json:502:+  "cypress",
./docs/implementation-artifacts/code-reviews/11-1/raw-edge-case-hunter.json:668:+   - Stack ordonnée moderne : TypeScript, Nuxt, Vue, NestJS, Node.js, PostgreSQL, TypeORM, Stripe, Cypress, Docker, REST API, Vitest.
./docs/implementation-artifacts/code-reviews/11-1/raw-edge-case-hunter.json:1181:    50	  "cypress",
./docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:683:/bin/zsh -lc "git status --short && rg --files | rg '(test|spec|playwright|cypress|vitest|package.json|10-2)' | head -200" in /Users/simon/dev/jouan.ovh

exec
/bin/zsh -lc "sed -n '1,170p' app/components/home/HomeAtmosComponent.vue; sed -n '1,140p' app/components/home/HomeStackMarquee.vue; git diff --stat -- docs/implementation-artifacts/code-reviews/11-6/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <div class="atmos" aria-hidden="true">
    <div class="aurora aurora--auberg" />
    <div class="aurora aurora--orange" />
    <div class="aurora aurora--red" />
    <div class="grid-dots" />
    <div class="scanlines" />
    <div class="vignette" />
  </div>
</template>

<script setup lang="ts">
// Composant atmosphérique décoratif pour la page d'accueil (Story 11.1 / CAP-1).
// Entièrement rendu en pur CSS, marqué aria-hidden="true", animations neutralisées sous prefers-reduced-motion.
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern */
.atmos {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.aurora {
  position: absolute;
  border-radius: var(--radius-circle);
  filter: blur(80px);
  mix-blend-mode: screen;
  will-change: transform;
}

.aurora--orange {
  top: -22%;
  left: 48%;
  width: 60vw;
  height: 60vw;
  background: radial-gradient(circle at center, var(--orange-500), transparent 62%);
  opacity: 0.55;
  animation: drift-orange 26s var(--ease-in-out) infinite;
}

.aurora--auberg {
  top: 6%;
  left: -22%;
  width: 64vw;
  height: 64vw;
  background: radial-gradient(circle at center, var(--aubergine-vivid), transparent 62%);
  opacity: 0.7;
  animation: drift-auberg 32s var(--ease-in-out) infinite;
}

.aurora--red {
  top: 44%;
  left: 26%;
  width: 44vw;
  height: 44vw;
  background: radial-gradient(circle at center, var(--term-red), transparent 64%);
  opacity: 0.4;
  animation: drift-red 30s var(--ease-in-out) infinite;
}

.grid-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(color-mix(in srgb, var(--ink-1) 6%, transparent) 1px, transparent 1px);
  background-size: 34px 34px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, var(--surface-0) 30%, transparent 78%);
}

.scanlines {
  position: absolute;
  inset: 0;
  opacity: 0.35;
  background: repeating-linear-gradient(
    0deg,
    color-mix(in srgb, var(--surface-0) 24%, transparent) 0 1px,
    transparent 1px 3px
  );
}

.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 120% 90% at 50% 0%, transparent 55%, var(--surface-0) 100%);
}

@keyframes drift-orange {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(-6vw, 5vh) scale(1.12);
  }
}

@keyframes drift-auberg {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(7vw, -4vh) scale(1.08);
  }
}

@keyframes drift-red {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(-4vw, -6vh) scale(1.15);
  }
}

@media (prefers-reduced-motion: reduce) {
  .aurora {
    animation: none;
  }
}
</style>
<template>
  <div v-if="skillsList.length" class="marquee" aria-hidden="true">
    <div class="marquee__track">
      <!-- Première passe -->
      <span v-for="(skill, index) in skillsList" :key="`skill-a-${index}`" class="marquee__item">
        <b class="marquee__label">{{ skill }}</b>
        <span class="marquee__star" aria-hidden="true">✦</span>
      </span>
      <!-- Deuxième passe pour la boucle infinie CSS sans coupure -->
      <span
        v-for="(skill, index) in skillsList"
        :key="`skill-b-${index}`"
        class="marquee__item marquee__item--duplicate"
      >
        <b class="marquee__label">{{ skill }}</b>
        <span class="marquee__star" aria-hidden="true">✦</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
// Ruban défilant continu de la stack moderne prioritaire (Story 11.3 / AC-1 / CAP-4).
// Alimenté par SITE.skills (app/data/site.ts) avec mapping soigné des libellés.
// Défilement continu pur CSS masqué aux lecteurs d'écran (aria-hidden="true").
// Pause automatique au :hover et arrêt complet sous prefers-reduced-motion.
import { computed } from "vue";
import { SITE } from "~/data/site";

const SKILL_LABEL_MAP: Record<string, string> = {
  typescript: "TypeScript",
  nuxt: "Nuxt 4",
  vue: "Vue.js",
  "nest.js": "NestJS",
  "node.js": "Node.js",
  postgresql: "PostgreSQL",
  typeorm: "TypeORM",
  stripe: "Stripe Connect",
  testcafe: "TestCafé",
  docker: "Docker",
  "rest-api": "REST API",
  vitest: "Vitest",
};

const skillsList = computed(() => {
  return SITE.skills.map((skillKey) => SKILL_LABEL_MAP[skillKey] ?? skillKey);
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern */
.marquee {
  display: block;
  width: 100%;
  padding-block: var(--space-5);
  overflow: hidden;
  border-block: 1px solid var(--border-subtle);
  mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);

  &:hover .marquee__track {
    animation-play-state: paused;
  }
}

.marquee__track {
  display: flex;
  gap: var(--space-8);
  width: max-content;
  will-change: transform;
  animation: scroll-x 32s linear infinite;
}

.marquee__item {
  display: inline-flex;
  gap: var(--space-8);
  align-items: center;
  font-family: var(--font-mono);
  font-size: var(--fs-xl);
  letter-spacing: var(--ls-wide);
  color: var(--text-faint);
  white-space: nowrap;
}

.marquee__label {
  font-weight: var(--fw-regular);
  color: var(--text-body);
}

.marquee__star {
  color: var(--accent);
}

@keyframes scroll-x {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(calc(-50% - var(--space-8) / 2));
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee {
    mask-image: none;
  }

  .marquee__track {
    animation: none;
  }

  .marquee__item--duplicate {
    display: none;
  }
}
</style>

2026-09-14T10:32:26.758809Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "nl -ba app/pages/index.vue | sed -n '1,245p'; nl -ba app/pages/index.vue | sed -n '285,490p'; nl -ba app/pages/index.vue | sed -n '735,825p'; nl -ba app/pages/index.vue | sed -n '1028,1065p'" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "nl -ba docs/implementation-artifacts/11-6-polissage-visuel-fidelite-maquette-awwwards-et-interactions.md | sed -n '1,190p'; nl -ba docs/implementation-artifacts/sprint-status.yaml | sed -n '108,140p'; tail -50 docs/planning-artifacts/epics.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	<template>
     2	  <main class="home">
     3	    <ClientOnly>
     4	      <HomeBootOverlay @boot-complete="onBootComplete" />
     5	    </ClientOnly>
     6	    <HomeAtmosComponent />
     7	    <ZCustomCursor />
     8	
     9	    <section class="hero">
    10	      <div class="hero__in container">
    11	        <div class="hero__grid">
    12	          <!-- Colonne gauche : accroche commerciale, badge dispo, CTAs -->
    13	          <div class="anim hero__text">
    14	            <p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>
    15	            <h1 class="hero__title">Développeur Full Stack <em>TypeScript</em></h1>
    16	            <p class="hero__sub">
    17	              Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De
    18	              l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.
    19	            </p>
    20	
    21	            <div class="hero__badge-wrap">
    22	              <span class="hero__pulse-dot" aria-hidden="true" />
    23	              <span>Disponible pour missions freelance</span>
    24	              <template v-if="SITE.profile.maltUrl">
    25	                <span aria-hidden="true"> · </span>
    26	                <ZExternalLink :href="SITE.profile.maltUrl"> Profil Malt vérifié </ZExternalLink>
    27	              </template>
    28	            </div>
    29	
    30	            <div class="hero__cta">
    31	              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
    32	                Discuter de votre projet
    33	                <template #iconRight><ZIcon name="arrow" /></template>
    34	              </ZButton>
    35	              <ZButton :as="NuxtLink" to="/about" variant="secondary" size="lg"> Voir le parcours &amp; CV </ZButton>
    36	            </div>
    37	          </div>
    38	
    39	          <!-- Colonne droite : terminal hero cinétique -->
    40	          <div class="anim hero__term-col">
    41	            <HomeHeroTerminal :auto-start="isBootFinished" />
    42	          </div>
    43	        </div>
    44	
    45	        <!-- Ruban défilant de la stack moderne remonté au sein du hero (fidèle à la maquette) -->
    46	        <HomeStackMarquee class="hero__marquee" />
    47	      </div>
    48	    </section>
    49	
    50	    <!-- Vitrine des 3 services cibles (Story 11.3 / AC-2) -->
    51	    <section class="section">
    52	      <div class="container">
    53	        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
    54	        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos applications</h2>
    55	        <ul class="grid-3">
    56	          <li v-for="service in services" :key="service.id">
    57	            <ZCard class="offer" interactive tilt :accent="service.featured" :featured="service.featured">
    58	              <div class="offer__top">
    59	                <div class="offer__icon"><ZIcon :name="service.icon" /></div>
    60	                <span class="offer__no">{{ service.no }}</span>
    61	              </div>
    62	              <h3 class="offer__title">{{ service.title }}</h3>
    63	              <p class="offer__desc">{{ service.desc }}</p>
    64	              <ul class="offer__points">
    65	                <li v-for="point in service.points" :key="point">
    66	                  <ZIcon name="check" class="offer__check" />
    67	                  <span>{{ point }}</span>
    68	                </li>
    69	              </ul>
    70	              <ul class="hero__tags offer__tags">
    71	                <li v-for="tag in service.tags" :key="tag">
    72	                  <ZTag>{{ tag }}</ZTag>
    73	                </li>
    74	              </ul>
    75	              <div class="offer__price">
    76	                <span>{{ service.price }}</span>
    77	              </div>
    78	              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
    79	                En savoir plus →
    80	              </NuxtLink>
    81	            </ZCard>
    82	          </li>
    83	        </ul>
    84	      </div>
    85	    </section>
    86	
    87	    <!-- Projets sélectionnés & Statistiques de réassurance (Story 11.4 / AC-1 & AC-2) -->
    88	    <section class="section">
    89	      <div class="container">
    90	        <div class="block__head">
    91	          <p class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</p>
    92	          <h2 class="section__title">Des produits qui tournent en production</h2>
    93	        </div>
    94	
    95	        <ul class="work">
    96	          <li v-for="(project, index) in projects" :key="project.name">
    97	            <component
    98	              :is="project.url ? ZExternalLink : 'div'"
    99	              :href="project.url"
   100	              class="work__row"
   101	              :class="{ 'work__row--link': Boolean(project.url) }"
   102	              :data-hot="project.url ? '' : undefined"
   103	            >
   104	              <span class="work__no">{{ String(index + 1).padStart(2, "0") }}</span>
   105	              <div class="work__main">
   106	                <div class="work__topline">
   107	                  <h3 class="work__name">{{ project.name }}</h3>
   108	                  <span v-if="project.status" class="work__status">{{ project.status }}</span>
   109	                </div>
   110	                <p class="work__role">{{ project.role }}</p>
   111	                <p class="prose work__desc">{{ project.desc }}</p>
   112	                <ul class="hero__tags work__tags">
   113	                  <li v-for="(tag, tagIndex) in project.tags" :key="`${tag}-${tagIndex}`">
   114	                    <ZTag>{{ tag }}</ZTag>
   115	                  </li>
   116	                </ul>
   117	              </div>
   118	              <span v-if="project.url" class="work__go" aria-hidden="true">
   119	                <ZIcon name="arrow" />
   120	              </span>
   121	            </component>
   122	          </li>
   123	        </ul>
   124	
   125	        <!-- Statistiques clés de réassurance (Story 11.4 / AC-2) -->
   126	        <ul class="stats">
   127	          <li v-for="stat in stats" :key="stat.id" class="stat">
   128	            <b>{{ stat.value }}</b>
   129	            <span>{{ stat.label }}</span>
   130	          </li>
   131	        </ul>
   132	      </div>
   133	    </section>
   134	
   135	    <!-- Journal technique / Notes de dev (Story 11.4 / AC-3) -->
   136	    <section class="section">
   137	      <div class="container">
   138	        <div class="block__head block__head--row">
   139	          <div>
   140	            <p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>
   141	            <h2 class="section__title">Notes de dev, écrites en construisant</h2>
   142	          </div>
   143	          <NuxtLink to="/blog" class="seeall" data-hot>
   144	            cat tous-les-articles
   145	            <ZIcon name="arrow" class="seeall__icon" />
   146	          </NuxtLink>
   147	        </div>
   148	
   149	        <!-- Liste des articles les plus récents -->
   150	        <ul v-if="articles && articles.length" class="journal">
   151	          <li v-for="article in articles" :key="article.path" class="journal__item">
   152	            <ZCard :as="NuxtLink" :to="article.path" :padded="false" interactive tilt class="jpost" data-hot>
   153	              <NuxtImg
   154	                v-if="article.image"
   155	                class="jpost__thumb"
   156	                :src="article.image.src"
   157	                :alt="article.image.alt"
   158	                width="360"
   159	                height="200"
   160	                sizes="360px"
   161	                format="webp"
   162	              />
   163	              <div class="jpost__body">
   164	                <ul v-if="article.tags?.length" class="hero__tags jpost__tags">
   165	                  <li v-for="(tag, tagIndex) in article.tags" :key="`${tag}-${tagIndex}`">
   166	                    <ZTag>{{ tag }}</ZTag>
   167	                  </li>
   168	                </ul>
   169	                <h3 class="jpost__title">{{ article.title }}</h3>
   170	                <p v-if="article.description" class="prose jpost__desc">{{ article.description }}</p>
   171	                <div class="jpost__meta">
   172	                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
   173	                  <template v-if="article.read">
   174	                    <span aria-hidden="true">·</span>
   175	                    <span>{{ article.read }} de lecture</span>
   176	                  </template>
   177	                  <span class="jpost__arrow" aria-hidden="true">
   178	                    <ZIcon name="arrow" />
   179	                  </span>
   180	                </div>
   181	              </div>
   182	            </ZCard>
   183	          </li>
   184	        </ul>
   185	
   186	        <!-- État d'attente sobre lorsque aucun article n'est encore publié -->
   187	        <ZCard v-else class="journal__empty" padded>
   188	          <p class="journal__empty-code">$ cat ~/journal/*.md</p>
   189	          <p class="journal__empty-text">Les notes d'ingénierie et retours d'expérience sont en cours de rédaction.</p>
   190	          <ZButton :as="NuxtLink" to="/blog" variant="secondary" size="sm"> Consulter la section blog </ZButton>
   191	        </ZCard>
   192	      </div>
   193	    </section>
   194	
   195	    <!-- Bloc CTA final de conversion (Story 11.4 / AC-4) -->
   196	    <section class="section">
   197	      <div class="container">
   198	        <div class="cta">
   199	          <p class="eyebrow cta__eyebrow"><span aria-hidden="true">$ </span>./contact --start</p>
   200	          <h2 class="cta__title">
   201	            Un projet en tête ?<br />
   202	            Mettons-le <span class="cta__highlight">en production</span>.
   203	          </h2>
   204	          <p class="cta__subtitle">
   205	            Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript,
   206	            parlons-en.
   207	          </p>
   208	          <div class="cta__actions">
   209	            <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg" data-hot>
   210	              Discuter de votre projet
   211	              <template #iconRight><ZIcon name="arrow" /></template>
   212	            </ZButton>
   213	            <ZButton
   214	              v-if="SITE.profile.maltUrl"
   215	              :as="ZExternalLink"
   216	              :href="SITE.profile.maltUrl"
   217	              variant="secondary"
   218	              size="lg"
   219	              data-hot
   220	            >
   221	              Me contacter sur Malt
   222	            </ZButton>
   223	            <ZButton :as="NuxtLink" to="/about" variant="ghost" size="lg" data-hot> Voir le parcours &amp; CV </ZButton>
   224	          </div>
   225	        </div>
   226	      </div>
   227	    </section>
   228	  </main>
   229	</template>
   230	
   231	<script setup lang="ts">
   232	// Page d'accueil — refonte Hero Full Stack TS, Projets SaaS, Journal & CTA final (Story 11.4).
   233	// Architecture multi-pages Nuxt 4, dark-first, accent orange.
   234	import { ref } from "vue";
   235	import { NuxtLink, ZExternalLink } from "#components";
   236	import { SITE } from "~/data/site";
   237	
   238	const isBootFinished = ref(false);
   239	
   240	function onBootComplete() {
   241	  isBootFinished.value = true;
   242	}
   243	
   244	interface HomeServiceOffer {
   245	  id: string;
   285	    price: "Sur devis / TJM",
   286	    featured: true,
   287	  },
   288	  {
   289	    id: "evolution",
   290	    no: "03 / 03",
   291	    icon: "spark",
   292	    title: "Évolution & Architecture applicative",
   293	    desc: "Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).",
   294	    points: [
   295	      "Audits techniques de code & migrations de versions",
   296	      "Tests E2E TestCafé & tests unitaires Vitest",
   297	      "Pipelines CI/CD & conteneurisation Docker",
   298	    ],
   299	    tags: ["TestCafé", "Vitest", "Docker", "CI/CD"],
   300	    price: "Au forfait / audit",
   301	    featured: false,
   302	  },
   303	];
   304	
   305	// Projets sélectionnés — source unique `app/data/site.ts` (Story 11.4 / AC-1).
   306	const projects = SITE.projects;
   307	
   308	// Chiffres clés de réassurance (Story 11.4 / AC-2).
   309	const stats = [
   310	  { id: "stat-1", value: "11", label: "années d'expérience web" },
   311	  { id: "stat-2", value: "100%", label: "TypeScript & SaaS de bout en bout" },
   312	  { id: "stat-3", value: "QA", label: "culture d'automatisation & zéro régression" },
   313	];
   314	
   315	// Récupération des 3 derniers articles du journal technique (Story 11.4 / AC-3).
   316	const { data: articles } = await useAsyncData("home-articles", () =>
   317	  queryCollection("blog").order("date", "DESC").limit(3).all(),
   318	);
   319	
   320	const siteUrl = useSiteUrl();
   321	const homeJsonLd = [
   322	  {
   323	    "@context": "https://schema.org",
   324	    "@type": "WebSite",
   325	    name: "Simon Jouan — Développeur Full Stack TypeScript",
   326	    url: siteUrl,
   327	    description: SITE.profile.role,
   328	  },
   329	  {
   330	    "@context": "https://schema.org",
   331	    "@type": "Person",
   332	    name: SITE.profile.name,
   333	    jobTitle: SITE.profile.role,
   334	    url: siteUrl,
   335	    image: `${siteUrl}/images/portrait.jpeg`,
   336	    email: SITE.profile.email,
   337	    address: {
   338	      "@type": "PostalAddress",
   339	      addressLocality: SITE.profile.city,
   340	      addressCountry: "FR",
   341	    },
   342	  },
   343	];
   344	
   345	usePageSeo({
   346	  title: "Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS",
   347	  description:
   348	    "Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL.",
   349	  path: "/",
   350	  image: "/images/portrait.jpeg",
   351	  type: "website",
   352	  jsonLd: homeJsonLd,
   353	});
   354	</script>
   355	
   356	<style lang="scss" scoped>
   357	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Home.jsx */
   358	.home {
   359	  display: block;
   360	}
   361	
   362	// Entrée one-shot (pas une boucle) — keyframe globale fade-rise (_root.scss).
   363	.anim {
   364	  animation: fade-rise var(--dur-slow) var(--ease-out) both;
   365	}
   366	
   367	.hero__term-col {
   368	  // Décalage d'entrée fidèle à Home.jsx (animationDelay 80ms) — pas de token motion
   369	  // équivalent (les --dur-* couvrent les transitions, pas les délais d'orchestration).
   370	  animation-delay: 80ms;
   371	}
   372	
   373	// ---- Hero (porté de kit.css & Home - Awwwards.html) ----
   374	.hero {
   375	  position: relative;
   376	  min-height: 100vh;
   377	  display: flex;
   378	  align-items: center;
   379	  padding: calc(var(--header-height) + var(--space-6)) 0 var(--space-10);
   380	  background: transparent;
   381	}
   382	
   383	.hero__in {
   384	  position: relative;
   385	  z-index: 1;
   386	  width: 100%;
   387	}
   388	
   389	.hero__grid {
   390	  display: grid;
   391	  grid-template-columns: 1.1fr 0.9fr;
   392	  gap: var(--space-12);
   393	  align-items: center;
   394	}
   395	
   396	.hero__marquee {
   397	  margin-top: var(--space-10);
   398	}
   399	
   400	// .section / .container / .eyebrow / .prose : primitives de layout globales
   401	// (app/assets/scss/base/_layout.scss) — non redéclarées ici.
   402	
   403	// ---- Colonne texte ----
   404	.hero__title {
   405	  margin: 0;
   406	  font-family: var(--font-mono);
   407	  font-size: clamp(2.4rem, 5.2vw, 4.4rem);
   408	  font-weight: var(--fw-regular);
   409	  line-height: 1.05;
   410	  letter-spacing: var(--ls-tight);
   411	  color: var(--text-strong);
   412	
   413	  em {
   414	    font-style: italic;
   415	    color: var(--accent);
   416	  }
   417	}
   418	
   419	.hero__sub {
   420	  max-width: 46ch;
   421	  margin: var(--space-5) 0 var(--space-6);
   422	  font-family: var(--font-sans);
   423	  font-size: var(--fs-lg);
   424	  line-height: var(--lh-relaxed);
   425	  color: var(--text-body);
   426	}
   427	
   428	.hero__cta {
   429	  display: flex;
   430	  flex-wrap: wrap;
   431	  gap: var(--space-3);
   432	  margin-bottom: var(--space-6);
   433	}
   434	
   435	// ---- Badge de disponibilité & CTAs ----
   436	.hero__badge-wrap {
   437	  display: inline-flex;
   438	  align-items: center;
   439	  gap: var(--space-2);
   440	  margin-bottom: var(--space-6);
   441	  font-family: var(--font-mono);
   442	  font-size: var(--fs-sm);
   443	  color: var(--text-muted);
   444	
   445	  a {
   446	    color: var(--accent);
   447	    text-decoration: underline;
   448	
   449	    &:hover {
   450	      color: var(--accent-hover);
   451	    }
   452	
   453	    &:focus-visible {
   454	      outline: 2px solid transparent;
   455	      outline-offset: 2px;
   456	      box-shadow: var(--ring-accent);
   457	    }
   458	  }
   459	}
   460	
   461	.hero__pulse-dot {
   462	  width: 8px;
   463	  height: 8px;
   464	  border-radius: var(--radius-circle);
   465	  background: var(--success);
   466	  box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 60%, transparent);
   467	  animation: pulse-dot 2.2s infinite var(--ease-out);
   468	
   469	  @media (prefers-reduced-motion: reduce) {
   470	    animation: none;
   471	  }
   472	}
   473	
   474	@keyframes pulse-dot {
   475	  0% {
   476	    box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 60%, transparent);
   477	  }
   478	
   479	  70% {
   480	    box-shadow: 0 0 0 6px color-mix(in srgb, var(--success) 0%, transparent);
   481	  }
   482	
   483	  100% {
   484	    box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 0%, transparent);
   485	  }
   486	}
   487	
   488	.section__title {
   489	  margin-bottom: var(--space-8);
   490	  font-family: var(--font-mono);
   735	  font-size: var(--fs-sm);
   736	}
   737	
   738	.work__tags {
   739	  margin-top: var(--space-4);
   740	}
   741	
   742	.work__go {
   743	  position: relative;
   744	  font-size: var(--fs-xl);
   745	  color: var(--text-faint);
   746	  transition:
   747	    transform var(--dur-base) var(--ease-out),
   748	    color var(--dur-base) var(--ease-standard);
   749	}
   750	
   751	// ---- Stats (porté de .stats) ----
   752	.stats {
   753	  display: grid;
   754	  grid-template-columns: repeat(3, 1fr);
   755	  gap: var(--space-4);
   756	  margin: var(--space-12) 0 0;
   757	  padding: 0;
   758	  list-style: none;
   759	}
   760	
   761	.stat {
   762	  padding: var(--space-6);
   763	  background: color-mix(in srgb, var(--surface-1) 85%, transparent);
   764	  border: 1px solid var(--border-subtle);
   765	  border-radius: var(--radius-md);
   766	  box-shadow: var(--shadow-2);
   767	  backdrop-filter: blur(8px);
   768	  transition:
   769	    border-color var(--dur-fast) var(--ease-standard),
   770	    transform var(--dur-fast) var(--ease-standard);
   771	
   772	  &:hover {
   773	    border-color: var(--border-strong);
   774	    transform: translateY(-2px);
   775	  }
   776	
   777	  b {
   778	    display: block;
   779	    margin-bottom: var(--space-2);
   780	    font-family: var(--font-mono);
   781	    font-size: clamp(var(--fs-4xl), 4.5vw, var(--fs-5xl));
   782	    font-weight: var(--fw-bold);
   783	    line-height: 1;
   784	    letter-spacing: var(--ls-tight);
   785	    color: var(--text-strong);
   786	  }
   787	
   788	  span {
   789	    font-family: var(--font-mono);
   790	    font-size: var(--fs-sm);
   791	    letter-spacing: var(--ls-wide);
   792	    color: var(--text-muted);
   793	  }
   794	}
   795	
   796	// ---- Section Journal (porté de Home - Awwwards.html .journal) ----
   797	.block__head--row {
   798	  display: flex;
   799	  align-items: flex-end;
   800	  justify-content: space-between;
   801	  gap: var(--space-6);
   802	  margin-bottom: var(--space-8);
   803	
   804	  .section__title {
   805	    margin-bottom: 0;
   806	  }
   807	}
   808	
   809	.seeall {
   810	  display: inline-flex;
   811	  flex: none;
   812	  align-items: center;
   813	  gap: var(--space-2);
   814	  font-family: var(--font-mono);
   815	  font-size: var(--fs-sm);
   816	  color: var(--text-muted);
   817	  text-decoration: none;
   818	  white-space: nowrap;
   819	  transition: color var(--dur-base) var(--ease-standard);
   820	
   821	  &:hover {
   822	    color: var(--accent);
   823	  }
   824	
   825	  &:focus-visible {
  1028	
  1029	  .stats {
  1030	    grid-template-columns: 1fr;
  1031	  }
  1032	}
  1033	
  1034	@media (prefers-reduced-motion: reduce) {
  1035	  .anim {
  1036	    animation: none;
  1037	  }
  1038	
  1039	  .work__row,
  1040	  .work__go,
  1041	  .jpost__arrow,
  1042	  .seeall {
  1043	    transition: none;
  1044	  }
  1045	
  1046	  .work__row--link:hover {
  1047	    padding-left: var(--space-3);
  1048	
  1049	    .work__go {
  1050	      transform: none;
  1051	    }
  1052	  }
  1053	
  1054	  .jpost:hover {
  1055	    .jpost__arrow {
  1056	      transform: none;
  1057	    }
  1058	  }
  1059	}
  1060	</style>

 succeeded in 0ms:
     1	---
     2	baseline_commit: 3ac365cc1a89c92b23a9d9059f13dd45b8543fbe
     3	---
     4	
     5	# Story 11.6: Polissage visuel, fidélité maquette Awwwards & interactions dynamiques
     6	
     7	Status: review
     8	
     9	<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
    10	
    11	## Story
    12	
    13	As a visiteur découvrant la page d'accueil de jouan.ovh,
    14	I want retrouver l'impact visuel immersif, le raffinement typographique et les interactions micro-cinétiques de la maquette Awwwards (hero sans rupture, header transparent puis flouté au scroll, logo officiel blanc, boutons généreux et magnétiques, cartes en 3D tilt, statistiques contrastées, carte CTA ample et aérée, footer parfaitement lisible),
    15	so that l'expérience soit véritablement au niveau d'un portfolio primé Awwwards et reflète une qualité d'ingénierie web et de design irréprochable (FR18, FR20, FR22, FR23, FR25, FR27, UX-DR18, UX-DR20, UX-DR22, UX-DR24, UX-DR25, NFR1, NFR2, NFR11, NFR12).
    16	
    17	## Acceptance Criteria
    18	
    19	1. **Hero & Atmosphère continue (Zéro coupure visuelle)** :
    20	   - **Given** la page d'accueil et la pile atmosphérique fixed `<HomeAtmosComponent />` (auroras, grille de points, scanlines, vignette)
    21	   - **When** la page est affichée, `.hero` ne possède aucun arrière-plan opaque (`var(--bg-page)`) ni dégradé tronquant l'atmosphère globale
    22	   - **Then** `.hero` a un fond 100% transparent et une hauteur minimale `min-height: 100vh`, s'intégrant sans rupture visuelle dans l'atmosphère continue
    23	   - **And** le titre principal du hero adopte les proportions de la maquette (`clamp(2.6rem, 6.4vw, 5.2rem)`, `line-height: 0.98`), avec les mots clés en accentuation orange italique (`<em>...</em>`), pour une scénographie visuelle affirmée.
    24	
    25	2. **Header transparent au repos & fondu sombre au scroll** :
    26	   - **Given** le composant `HeaderComponent.vue` fixé en haut de page
    27	   - **When** la position de défilement est en haut (`scrollY <= 20`)
    28	   - **Then** le header est transparent sans bordure inférieure (`background: transparent; border-bottom: 1px solid transparent; backdrop-filter: none;`)
    29	   - **And** dès le défilement (`scrollY > 20`), la classe `.stuck` est appliquée avec une transition douce de 0.3s (`background: color-mix(in srgb, var(--surface-0) 80%, transparent)` ou `hsl(320 30% 6% / 0.72)`, `backdrop-filter: blur(12px)`, bordure `var(--border-subtle)`)
    30	   - **And** une barre de progression de scroll discrète (hauteur 2px, dégradé accent) est présente en haut de l'écran.
    31	
    32	3. **Logo officiel blanc dans la barre de navigation** :
    33	   - **Given** le lien de marque `.hdr__brand` dans `HeaderComponent.vue`
    34	   - **When** le composant est rendu
    35	   - **Then** l'icône gemme orange `<ZIcon name="gem">` est remplacée par le logo officiel wireframe blanc de la marque (`/images/logo_white.png` ou SVG équivalent)
    36	   - **And** le logo est accompagné de `jouan.ovh` avec le domaine en nuance atténuée (`<b>jouan</b><span class="dim">.ovh</span>`).
    37	
    38	4. **Dimensions et présence des boutons (`ZButton`)** :
    39	   - **Given** les primitives `ZButton` et les boutons d'appel à l'action sur la home
    40	   - **When** ils sont affichés en taille `lg` ou standard
    41	   - **Then** ils bénéficient des dimensions généreuses de la maquette (`height: 46px` à `48px`, padding horizontal `0 var(--space-5)`, typo `var(--font-mono)`, `font-size: var(--fs-sm)`, `letter-spacing: var(--ls-wide)`) pour une ergonomie et un impact visuel accrus.
    42	
    43	5. **Animation et micro-interactions des boutons (Effet magnétique & Glow)** :
    44	   - **Given** les boutons interactifs sur la page d'accueil (ou primitive `ZButton`)
    45	   - **When** le pointeur de la souris survole le bouton sur ordinateur de bureau
    46	   - **Then** un micro-effet magnétique attire doucement le bouton et/ou son libellé intérieur (`.mag`) vers les coordonnées du curseur (`translate(x, y)` subtil)
    47	   - **And** le survol déclenche un feedback lumineux (`transform: translateY(-1px)`, `box-shadow: var(--glow-accent)`)
    48	   - **And** l'effet est neutralisé instantanément sous `prefers-reduced-motion: reduce` et sous `@media (hover: none)`.
    49	
    50	6. **Animation 3D Tilt interactive des cartes** :
    51	   - **Given** les cartes de la section services (`.offer` / `ZCard`) et projets
    52	   - **When** l'utilisateur déplace la souris sur la surface d'une carte
    53	   - **Then** la carte applique une inclinaison 3D dynamique en perspective (`perspective(800px) rotateX(...) rotateY(...) translateY(-4px)`)
    54	   - **And** lors de la sortie du curseur (`mouseleave`), la carte revient fluidement à sa position neutre
    55	   - **And** l'animation est strictement désactivée sous `prefers-reduced-motion: reduce`.
    56	
    57	7. **Lisibilité & Contraste des statistiques clés** :
    58	   - **Given** la grille des 3 cartes de statistiques (`11 années d'expérience web`, `100% TypeScript & SaaS`, `QA culture d'automatisation`)
    59	   - **When** elles sont affichées dans la section `section--sunken`
    60	   - **Then** chaque carte dispose d'un arrière-plan visible et lisible (`var(--surface-1)` ou `hsl(319 22% 9% / 0.5)` avec bordure `var(--border-subtle)`)
    61	   - **And** les valeurs numériques/clés `b` sont affichées en blanc pur contrasté (`var(--text-strong)`, `font-size: var(--fs-5xl)`), et les libellés descriptifs `span` en `var(--text-muted)` sans aucune transparence excessive ni zone sombre illisible.
    62	
    63	8. **Bloc CTA « Un projet en tête ? » ample et aéré** :
    64	   - **Given** le conteneur `.cta` de conversion finale
    65	   - **When** le bloc est rendu
    66	   - **Then** il dispose d'un espacement généreux fidèle à la maquette (`padding: clamp(48px, 7vw, 84px) var(--space-6)`)
    67	   - **And** le fond arbore un halo lumineux radial supérieur (`radial-gradient(ellipse 80% 120% at 50% 0%, var(--accent-2-soft), transparent 70%)`)
    68	   - **And** le titre h2 gagne en échelle (`clamp(2rem, 5vw, 3.4rem)`) avec l'accentuation « *en production* » en italique accentué, et des boutons d'action largement espacés.
    69	
    70	9. **Contraste et visibilité du Footer** :
    71	   - **Given** le composant `FooterComponent.vue`
    72	   - **When** le footer est affiché
    73	   - **Then** tous les éléments textuels (titres de colonnes `// NAVIGATION`, `// PROJETS`, `// RÉSEAUX`, description du profil, mentions légales) respectent les critères de contraste WCAG AA sur le fond sombre (`var(--text-muted)` pour les labels, `var(--text-body)` pour le corps, `var(--text-strong)` au hover des liens), garantissant une lisibilité sans effort.
    74	
    75	10. **Validation qualité & Gate Docker** :
    76	    - **Given** l'ensemble des ajustements visuels et interactifs appliqués
    77	    - **When** on exécute la suite de validation Docker
    78	    - **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` passe avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript, et 13 routes statiques générées avec succès par Nitro.
    79	
    80	## Tasks / Subtasks
    81	
    82	- [x] Tâche 1 — Hero & Atmosphère continue (AC: 1)
    83	  - [x] Supprimer les fonds solides/dégradés opaques `.hero__grad` avec `var(--bg-page)` dans `app/pages/index.vue`.
    84	  - [x] Passer `.hero` en fond transparent sur `min-height: 100vh` avec padding généreux pour respirer avec le viewport.
    85	  - [x] Rehausser la typographie du titre `.hero__title` (`clamp(2.4rem, 5.2vw, 4.4rem)`, `line-height: 1.05`) et insérer les spans/italiques accentués (`<em>`) pour un impact éditorial fidèle à la maquette.
    86	
    87	- [x] Tâche 2 — Header dynamique au scroll & Barre de progression (AC: 2, 3)
    88	  - [x] Mettre à jour `HeaderComponent.vue` pour démarrer avec un état transparent sans bordure au repos (`scrollY <= 20`).
    89	  - [x] Ajouter l'écouteur de scroll (throttlé/passif ou `useEventListener`) activant la classe `.hdr--stuck` avec fond de verre sombre flouté (`backdrop-filter: blur(12px)`) et bordure `var(--border-subtle)`.
    90	  - [x] Ajouter la barre de progression de défilement (hauteur 2px, dégradé `var(--accent)`) liée au scroll global.
    91	  - [x] Remplacer l'icône gemme orange `<ZIcon name="gem">` par le logo officiel wireframe blanc [`public/images/logo_white.png`](file:///Users/simon/dev/jouan.ovh/public/images/logo_white.png) avec le texte `jouan.ovh` (`<b>jouan</b><span class="dim">.ovh</span>`).
    92	
    93	- [x] Tâche 3 — Tailles des boutons & Effet magnétique (AC: 4, 5)
    94	  - [x] Ajuster la primitive `ZButton.vue` pour les tailles `lg` et standard (hauteur 48px en lg / 42px en standard, padding horizontal généreux, typo mono, tracking étendu).
    95	  - [x] Ajouter le support du micro-effet magnétique sur les boutons interactifs desktop (`mousemove` / décalage subtil du texte `.zbtn__inner`), avec réinitialisation sur `mouseleave` et neutralisation sous `prefers-reduced-motion: reduce`.
    96	  - [x] Ajouter les transitions et ombres portées accentuées au hover (`var(--glow-accent)`, `translateY(-1px)`).
    97	
    98	- [x] Tâche 4 — Effet 3D Tilt sur les cartes de services & projets (AC: 6)
    99	  - [x] Intégrer la directive ou l'écouteur `mousemove` d'inclinaison 3D (`perspective(800px) rotateX(...) rotateY(...) translateY(-4px)`) sur les cartes de services (`ZCard` avec prop `tilt`) et les blocs journal.
   100	  - [x] S'assurer du retour doux à la normale sur `mouseleave`.
   101	  - [x] Encapsuler l'effet sous garde `matchMedia('(prefers-reduced-motion: reduce)')` et `import.meta.client`.
   102	
   103	- [x] Tâche 5 — Lisibilité des Statistiques & CTA de conversion (AC: 7, 8)
   104	  - [x] Corriger le style des cartes `.stat` dans `app/pages/index.vue` : fond `var(--surface-1)` / `hsl(319 22% 9% / 0.85)`, bordure subtile, chiffres `b` éclatants en blanc `var(--text-strong)` (`fs-5xl`), libellés `span` en `var(--text-muted)`.
   105	  - [x] Agrandir le conteneur `.cta` (`padding: clamp(48px, 7vw, 84px) var(--space-6)`), injecter le dégradé radial supérieur d'ambiance, rehausser le titre h2 (`clamp(2rem, 4.5vw, 3.2rem)`) et espacer les CTAs.
   106	
   107	- [x] Tâche 6 — Visibilité et contraste du Footer (AC: 9)
   108	  - [x] Revoir les styles et contrastes de `FooterComponent.vue` pour rehausser les couleurs de texte (`var(--text-muted)` / `var(--text-strong)`, logo white wireframe).
   109	  - [x] S'assurer que chaque lien de navigation, lien de projet et mention légale ressort clairement sur le fond sombre sans sensation d'invisibilité ou de transparence excessive.
   110	
   111	- [x] Tâche 7 — Validation qualité & Gate Docker (AC: 10)
   112	  - [x] Lancer la suite de validation Docker complète : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
   113	  - [x] Vérifier la conformité de l'affichage sur navigateur et la non-régression multi-pages (13 routes pré-rendues statiquement).
   114	
   115	## Dev Notes
   116	
   117	- **Atmosphère & Hero :** La maquette [`Home - Awwwards.html`](file:///Users/simon/dev/jouan.ovh/docs/design_system/ui_kits/jouan-site/Home%20-%20Awwwards.html) repose sur un conteneur d'atmosphère `.atmos` en `position: fixed; inset: 0; z-index: 0;` avec 3 auroras (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`), la grille de points (`.grid-dots`), les scanlines CRT et la vignette. Le Hero est désormais **entièrement transparent** afin de flotter au-dessus de cette atmosphère sans délimitation carrée ou coupure de couleur.
   118	- **Header scroll behavior :** Dans `HeaderComponent.vue`, le header est fixé en haut avec un fond transparent sans bordure à `scrollY <= 20`, puis bascule vers `.hdr--stuck` avec fond de verre flouté (`backdrop-filter: blur(12px)`) et bordure `var(--border-subtle)` au scroll. La fine barre de progression supérieure suit la position de défilement.
   119	- **Magnetic buttons & Tilt cards :** Implémentés au cœur des primitives `ZButton.vue` (effet magnétique 2D sur le conteneur et son sous-élément `zbtn__inner`) et `ZCard.vue` (prop `tilt` avec projection `perspective(800px) rotateX(...) rotateY(...)`), neutralisés automatiquement sous reduced-motion.
   120	- **Tokens SCSS & Docker gate :** Conforme aux invariants `AGENTS.md` — 0 erreur ESLint/Stylelint, 0 erreur TypeScript vue-tsc, 13 routes statiques SSG Nitro générées dans le conteneur Docker.
   121	
   122	### Project Structure Notes
   123	
   124	- Fichiers modifiés :
   125	  - `app/pages/index.vue` (hero transparent sans coupure, h1 expressif, cartes stats contrastées et lisibles, CTA ample et aéré, activation tilt sur les cartes)
   126	  - `app/components/HeaderComponent.vue` (header transparent initialement, classe `.hdr--stuck` au scroll, logo white wireframe, barre de progression)
   127	  - `app/components/FooterComponent.vue` (logo white wireframe, contrastes renforcés des liens et en-têtes)
   128	  - `app/components/ui/ZButton.vue` (dimensions généreuses, micro-effet magnétique fluide)
   129	  - `app/components/ui/ZCard.vue` (support du 3D tilt interactif sur mousemove)
   130	
   131	### References
   132	
   133	- [Maquette Awwwards concept](file:///Users/simon/dev/jouan.ovh/docs/design_system/ui_kits/jouan-site/Home%20-%20Awwwards.html)
   134	- [AGENTS.md](file:///Users/simon/dev/jouan.ovh/AGENTS.md)
   135	- [Sprint Status](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/sprint-status.yaml)
   136	- [Epics & Stories](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md#epic-11)
   137	
   138	## Dev Agent Record
   139	
   140	### Agent Model Used
   141	
   142	Gemini 3.7 Flash (Medium)
   143	
   144	### Debug Log References
   145	
   146	- Validation Docker exécutée avec succès (`pnpm lint && pnpm typecheck && pnpm generate`) : 0 erreur, 13 routes pré-rendues statiquement.
   147	
   148	### Completion Notes List
   149	
   150	- ✅ Hero sans coupure : suppression du fond solide `.hero__grad`, hero 100% transparent sur `min-height: 100vh`, titre ample avec em en orange italique.
   151	- ✅ Header au scroll : transparent sans bordure au repos (`scrollY <= 20`), fond sombre flouté (`backdrop-filter: blur(12px)`) au scroll (`.hdr--stuck`), barre de progression 2px en haut.
   152	- ✅ Logo officiel blanc : remplacement du diamant orange par `logo_white.png` dans le header et le footer.
   153	- ✅ Boutons agrandis et magnétiques : primitive `ZButton` enrichie avec dimensions généreuses (48px en lg, 42px en standard) et micro-effet magnétique sur desktop.
   154	- ✅ 3D Tilt des cartes : support natif dans `ZCard` (`prop tilt`) sur les services et les articles du journal.
   155	- ✅ Statistiques lisibles et contrastées : fond `var(--surface-1)` / `85%`, chiffres `b` en blanc pur éclatant `var(--text-strong)` (`fs-5xl`).
   156	- ✅ Bloc CTA « Un projet en tête ? » : padding ample (`clamp(48px, 7vw, 84px)`), halo lumineux radial supérieur, typographie h2 expressive et boutons aérés.
   157	- ✅ Footer contrasté : contraste et visibilité rehaussés des rubriques et liens.
   158	
   159	### File List
   160	
   161	- `app/pages/index.vue`
   162	- `app/components/HeaderComponent.vue`
   163	- `app/components/FooterComponent.vue`
   164	- `app/components/ui/ZButton.vue`
   165	- `app/components/ui/ZCard.vue`
   166	- `docs/implementation-artifacts/11-6-polissage-visuel-fidelite-maquette-awwwards-et-interactions.md`
   167	- `docs/implementation-artifacts/sprint-status.yaml`
   168	- `docs/planning-artifacts/epics.md`
   108	
   109	  # Epic 10 — Fin de refonte (a11y résiduel + SEO + RGPD + déploiement prod)
   110	  epic-10: done
   111	  10-1-decision-hebergement-prod-et-derisquage-deploiement: done
   112	  10-2-a11y-semantique-residuelle: done
   113	  10-3-liens-externes-accessibles: done
   114	  10-4-validation-a11y-emulee-et-unification-forced-colors: done
   115	  10-5-seo-centralise-site-wide: done
   116	  10-6-conformite-legale-rgpd-mentions: done
   117	  10-7-mise-en-production-reelle: done
   118	  epic-10-retrospective: done
   119	
   120	  # Epic 11 — Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
   121	  epic-11: done
   122	  11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique: done
   123	  11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique: done
   124	  11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles: done
   125	  11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: done
   126	  11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker: done
   127	  11-6-polissage-visuel-fidelite-maquette-awwwards-et-interactions: done
   128	  epic-11-retrospective: optional
I want consulter les réalisations SaaS phares (Keova, TryOn, Nodium), les statistiques clés et les derniers articles du journal,
So that je suis convaincu par des preuves concrètes de conception applicative et engagé à initier une collaboration via le formulaire ou Malt (FR23, FR24, FR25, NFR12, UX-DR23, UX-DR24).

**Acceptance Criteria:**

**Given** les projets définis dans `SITE.projects`, les articles du blog et le profil Malt
**When** on intègre la section des projets sélectionnés, les statistiques, le journal technique et le bloc CTA final
**Then** les projets affichent :
  - **Keova App** avec statut `● En production`, rôle Co-fondateur & Full Stack, stack (Nuxt 4 / NestJS / PostgreSQL / Stripe Connect) et lien direct accessible via `<ZExternalLink href="https://keova.app">`
  - **TryOn** avec statut `○ Étude de cas (MVP livré)` valorisant l'ingénierie SaaS & IA générative, **sans lien externe mort 404** (renvoi vers description détaillée/Malt)
  - **Nodium** avec statut `◐ R&D / En cours` valorisant le laboratoire d'agents IA desktop
**And** les 3 compteurs statistiques clés sont affichés (11 ans d'expérience, SaaS opérés, culture qualité & automatisation)
**And** la section journal présente les articles récents du blog avec lien vers `/blog`
**And** le bloc CTA final de conversion propose un bouton primaire vers `/contact` (« Discuter de votre projet »), un bouton externe direct vers le profil Malt (`<ZExternalLink href="https://www.malt.fr/profile/simonjouan">`) et un lien vers `/about`
**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)

### Story 11.5: Validation transverse a11y, multi-pages, SSG Nitro & Gate Docker

As a mainteneur du site et garant de la qualité logicielle,
I want valider l'accessibilité globale, l'absence de régression multi-pages et la conformité du build statique,
So that la refonte de la home est irréprochable et prête pour la production (CAP-1 à CAP-10, NFR10, NFR11, NFR12).

**Acceptance Criteria:**

**Given** la home refondue intégrant l'ensemble des composants des stories 11.1 à 11.4
**When** on exécute l'audit complet d'accessibilité (contraste forcé `forced-colors: active`, `prefers-reduced-motion: reduce`, navigation clavier, `<ZExternalLink>` audités)
**Then** aucun focus trap n'existe, les éléments interactifs sont accessibles au clavier avec focus visible, les animations sont neutralisées sous reduced-motion (seul le caret clignote), et aucun lien avec ancre intra-page `#` n'est présent (les routes `/services`, `/about`, `/blog`, `/contact` restent des pages indépendantes)
**And** la suite de validation Docker complète (`pnpm lint && pnpm typecheck && pnpm generate`) est exécutée avec succès (0 erreur ESLint/Stylelint, 0 erreur TypeScript, 13 routes pré-rendues)

### Story 11.6: Polissage visuel, fidélité maquette Awwwards & interactions dynamiques

As a visiteur découvrant la page d'accueil de jouan.ovh,
I want retrouver l'impact visuel immersif, le raffinement typographique et les interactions micro-cinétiques de la maquette Awwwards (hero sans rupture, header transparent puis flouté au scroll, logo officiel blanc, boutons généreux et magnétiques, cartes en 3D tilt, statistiques contrastées, carte CTA ample et aérée, footer parfaitement lisible),
So that l'expérience soit véritablement au niveau d'un portfolio primé Awwwards et reflète une qualité d'ingénierie web et de design irréprochable (FR18, FR20, FR22, FR23, FR25, FR27, UX-DR18, UX-DR20, UX-DR22, UX-DR24, UX-DR25, NFR1, NFR2, NFR11, NFR12).

**Acceptance Criteria:**

**Given** la maquette de référence `Home - Awwwards.html` et les retours d'évaluation visuelle
**When** on implémente la passe de polissage UX/UI sur la page d'accueil et le layout
**Then** `.hero` a un fond 100% transparent sur `min-height: 100vh` sans dégradé opaque de coupure, avec un titre h1 ample (`clamp(2.6rem, 6.4vw, 5.2rem)`) et ses accents en orange italique
**And** le header démarre 100% transparent sans bordure au repos (`scrollY <= 20`) puis devient flouté translucide (`.stuck`) au scroll avec barre de progression de défilement discrète
**And** le logo officiel wireframe blanc `logo_white.png` remplace l'icône gemme orange dans le header
**And** les boutons (`ZButton`) gagnent des dimensions généreuses (hauteur 46-48px, padding étendu) et un micro-effet magnétique fluide desktop neutralisé sous reduced-motion
**And** les cartes de services et de projets intègrent l'effet 3D tilt au mouvement de la souris (neutralisé sous reduced-motion)
**And** les 3 cartes statistiques (`11`, `100%`, `QA`) ont un fond de carte visible et des chiffres en blanc contrasté `var(--text-strong)` parfaitement lisibles
**And** le bloc CTA final `.cta` est aéré (`padding: clamp(48px, 7vw, 84px) var(--space-6)`), avec son halo lumineux radial supérieur et sa typographie h2 valorisée
**And** le footer rehausse le contraste de l'ensemble de ses libellés et liens pour une lisibilité WCAG AA irréprochable
**And** la suite de validation Docker complète (`pnpm lint && pnpm typecheck && pnpm generate`) est exécutée avec succès (0 erreur ESLint/Stylelint, 0 erreur TypeScript, 13 routes pré-rendues)



exec
/bin/zsh -lc "git diff --no-index -- /dev/null docs/implementation-artifacts/code-reviews/11-6/full.diff | head -20; git show HEAD:app/components/HeaderComponent.vue | sed -n '1,80p'; git show HEAD:app/layouts/default.vue | sed -n '1,60p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
diff --git a/docs/implementation-artifacts/code-reviews/11-6/full.diff b/docs/implementation-artifacts/code-reviews/11-6/full.diff
new file mode 100644
index 0000000..14ea7dd
--- /dev/null
+++ b/docs/implementation-artifacts/code-reviews/11-6/full.diff
@@ -0,0 +1,1660 @@
+diff --git a/app/components/CurrentTime.vue b/app/components/CurrentTime.vue
+index c459483..cf9fd85 100644
+--- a/app/components/CurrentTime.vue
++++ b/app/components/CurrentTime.vue
+@@ -1,7 +1,11 @@
+ <template>
+-  <div class="current-time">
+-    {{ currentTime }}
+-  </div>
++  <time class="current-time" :datetime="currentTimeIso" aria-label="Heure locale de Valognes">
++    <span class="current-time__hours">{{ hours }}</span>
++    <span class="current-time__colon" :class="{ 'current-time__colon--hidden': !isColonVisible }" aria-hidden="true"
++      >:</span
++    >
<template>
  <header class="hdr" :class="{ 'hdr--stuck': isScrolled }">
    <div class="hdr__progress" :style="{ width: `${scrollProgress}%` }" aria-hidden="true" />
    <div class="hdr__in">
      <NuxtLink to="/" class="hdr__brand" @click="onBrandClick">
        <img src="/images/logo_white.png" alt="" class="hdr__logo" width="24" height="24" />
        <span class="hdr__brand-text"><b>jouan</b><span class="dim">.ovh</span></span>
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
          <span class="hdr__link-prefix" aria-hidden="true">{{ item.prefix }} </span>
          <span class="hdr__link-label">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="hdr__right">
        <ZButton variant="terminal" size="sm" class="hdr__action hdr__action--terminal" @click="addNewTerminal">
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

    <!-- Dock d'état tout à droite de l'écran (hors container centré) -->
    <div class="hdr__dock-right" aria-label="Statut et heure">
      <div class="hdr__status-badge">
        <span class="hdr__status-dot" aria-hidden="true" />
        <span class="hdr__status-text">Disponible</span>
      </div>
      <CurrentTime class="hdr__dock-clock" />
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
        <span class="hdr__menu-link-prefix" aria-hidden="true">{{ item.prefix }} </span>
        <span class="hdr__menu-link-label">{{ item.label }}</span>
      </NuxtLink>

      <div class="hdr__menu-actions">
        <div class="hdr__menu-status">
          <div class="hdr__status-badge">
            <span class="hdr__status-dot" aria-hidden="true" />
            <span class="hdr__status-text">Disponible</span>
          </div>
          <CurrentTime class="hdr__menu-clock" />
        </div>
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

2026-09-14T10:32:36.609629Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "rg -n \"section--sunken|FooterComponent|HeaderComponent|hero__grad\" app docs/design_system/ui_kits/jouan-site/kit.css docs/design_system/ui_kits/jouan-site/'Home - Awwwards.html'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/design_system/ui_kits/jouan-site/kit.css:28:.section--sunken { background: var(--bg-sunken); border-top: 1px solid var(--border-subtle);
docs/design_system/ui_kits/jouan-site/kit.css:70:.hero__grad {
app/pages/about.vue:5:         La section CV (expériences + formation) suit dans une <section--sunken> (story 5.2). -->
app/pages/about.vue:56:         Porté de About.jsx (2e section--sunken), grille 1.4fr / 0.6fr. -->
app/pages/about.vue:57:    <section class="section section--sunken">
app/pages/services.vue:46:    <section class="section section--sunken">
app/pages/services.vue:180:// .section / .section--sunken / .container / .eyebrow / .prose : primitives de
app/assets/scss/base/_layout.scss:4://  .section / .section--sunken / .container / .eyebrow / .prose
app/assets/scss/base/_layout.scss:11:/* stylelint-disable selector-class-pattern -- convention DS BEM (.section--sunken) portée depuis kit.css */
app/assets/scss/base/_layout.scss:21:.section--sunken {
app/data/site.ts:5:// Consommé par : pages (`index.vue`, `about.vue`, `contact.vue`), `FooterComponent.vue`,
app/layouts/default.vue:3:    <HeaderComponent />
app/layouts/default.vue:7:    <FooterComponent />
app/layouts/default.vue:12:import FooterComponent from "../components/FooterComponent.vue";
app/layouts/default.vue:13:import HeaderComponent from "../components/HeaderComponent.vue";
app/layouts/default.vue:21:  // propre `hero__grad`, le footer son `--bg-sunken` — inchangés.
app/composables/useTerminal.ts:6:// le `HeaderComponent` ; il n'existe pas d'API globale d'ouverture. Ce registre
app/components/terminal/TerminalManagerComponent.vue:33:// (`terminalManager.value?.createNewTerminal()`, HeaderComponent.vue). Le hero et /contact

exec
/bin/zsh -lc 'git diff HEAD -- app/components/CurrentTime.vue app/components/FooterComponent.vue app/components/HeaderComponent.vue app/components/ui/ZButton.vue app/components/ui/ZCard.vue app/pages/index.vue app/data/site.ts' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
exec
/bin/zsh -lc "git show HEAD:app/components/CurrentTime.vue | nl -ba | sed -n '1,100p'; git show HEAD:app/components/FooterComponent.vue | nl -ba | sed -n '1,240p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	<template>
     2	  <time class="current-time" :datetime="currentTimeIso" aria-label="Heure locale de Valognes">
     3	    <span class="current-time__hours">{{ hours }}</span>
     4	    <span class="current-time__colon" :class="{ 'current-time__colon--hidden': !isColonVisible }" aria-hidden="true"
     5	      >:</span
     6	    >
     7	    <span class="current-time__minutes">{{ minutes }}</span>
     8	  </time>
     9	</template>
    10	
    11	<script lang="ts" setup>
    12	import type { Ref } from "vue";
    13	import { onMounted, onUnmounted, ref } from "vue";
    14	
    15	defineComponent({
    16	  name: "CurrentTime",
    17	});
    18	
    19	const hours = ref("--");
    20	const minutes = ref("--");
    21	const currentTimeIso = ref("");
    22	const isColonVisible = ref(true);
    23	
    24	function updateTime() {
    25	  const now = new Date();
    26	  const parts = new Intl.DateTimeFormat("en-GB", {
    27	    hour: "2-digit",
    28	    minute: "2-digit",
    29	    hour12: false,
    30	    timeZone: "Europe/Paris",
    31	  }).formatToParts(now);
    32	
    33	  const hourPart = parts.find((p) => p.type === "hour")?.value ?? "";
    34	  const minutePart = parts.find((p) => p.type === "minute")?.value ?? "";
    35	
    36	  hours.value = hourPart.padStart(2, "0");
    37	  minutes.value = minutePart.padStart(2, "0");
    38	  currentTimeIso.value = now.toISOString();
    39	
    40	  // Un clignotement exact par seconde (alternance à chaque seconde système)
    41	  isColonVisible.value = now.getSeconds() % 2 === 0;
    42	}
    43	
    44	const interval: Ref<ReturnType<typeof setInterval> | null> = ref(null);
    45	
    46	onMounted(() => {
    47	  updateTime();
    48	  interval.value = setInterval(updateTime, 1000);
    49	});
    50	
    51	onUnmounted(() => {
    52	  if (interval.value !== null) {
    53	    clearInterval(interval.value);
    54	  }
    55	});
    56	</script>
    57	
    58	<style scoped lang="scss">
    59	/* stylelint-disable selector-class-pattern -- convention BEM */
    60	.current-time {
    61	  display: inline-flex;
    62	  align-items: center;
    63	  font-family: var(--font-mono);
    64	  font-size: var(--fs-xs);
    65	  font-variant-numeric: tabular-nums;
    66	  letter-spacing: var(--ls-wide);
    67	  color: var(--text-muted);
    68	}
    69	
    70	.current-time__colon {
    71	  display: inline-block;
    72	  margin: 0 1px;
    73	  transition: opacity 0.1s linear;
    74	
    75	  &--hidden {
    76	    opacity: 0;
    77	  }
    78	}
    79	
    80	@media (prefers-reduced-motion: reduce) {
    81	  .current-time__colon,
    82	  .current-time__colon--hidden {
    83	    opacity: 1;
    84	    transition: none;
    85	  }
    86	}
    87	</style>
     1	<template>
     2	  <footer class="ftr">
     3	    <div class="ftr__container">
     4	      <div class="ftr__in">
     5	        <div class="ftr__brand-col">
     6	          <NuxtLink to="/" class="ftr__brand">
     7	            <img src="/images/logo_white.png" alt="" class="ftr__logo" width="22" height="22" />
     8	            <span><b>jouan</b><span class="dim">.ovh</span></span>
     9	          </NuxtLink>
    10	          <p class="ftr__tagline">{{ profile.role }}. {{ profile.city }}.</p>
    11	        </div>
    12	
    13	        <nav class="ftr__col" aria-label="Navigation du pied de page">
    14	          <h2 class="ftr__title">// Navigation</h2>
    15	          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="ftr__link">{{ item.label }}</NuxtLink>
    16	        </nav>
    17	
    18	        <div class="ftr__col">
    19	          <h2 class="ftr__title">// Projets</h2>
    20	          <ul class="ftr__list">
    21	            <li v-for="project in projects" :key="project.name">
    22	              <ZExternalLink v-if="project.url" :href="project.url" rel="noopener noreferrer" class="ftr__link">{{
    23	                project.name
    24	              }}</ZExternalLink>
    25	              <span v-else class="ftr__link ftr__link--static">{{ project.name }}</span>
    26	            </li>
    27	          </ul>
    28	        </div>
    29	
    30	        <div class="ftr__col">
    31	          <h2 class="ftr__title">// Réseaux</h2>
    32	          <LinkListComponent />
    33	        </div>
    34	      </div>
    35	    </div>
    36	
    37	    <!-- Barre basse pleine largeur (border-top 100% de la fenêtre) -->
    38	    <div class="ftr__bottom-bar">
    39	      <div class="ftr__container ftr__bottom">
    40	        <span>© {{ year }} Simon Jouan — jouan.ovh</span>
    41	        <span class="ftr__term">anon.@jouan.ovh:~$ <span class="ftr__cmd">echo "merci de votre visite"</span></span>
    42	      </div>
    43	    </div>
    44	  </footer>
    45	</template>
    46	
    47	<script setup lang="ts">
    48	import LinkListComponent from "~/components/LinkListComponent.vue";
    49	import { SITE } from "~/data/site";
    50	
    51	const navItems = [
    52	  { to: "/", label: "Accueil" },
    53	  { to: "/services", label: "Services" },
    54	  { to: "/about", label: "À propos" },
    55	  { to: "/blog", label: "Blog" },
    56	  { to: "/contact", label: "Contact" },
    57	  { to: "/confidentialite", label: "Confidentialité" },
    58	  { to: "/mentions-legales", label: "Mentions légales" },
    59	];
    60	
    61	const profile = SITE.profile;
    62	// Projets — source unique `app/data/site.ts` (le footer n'affiche que nom + URL).
    63	const projects = SITE.projects;
    64	
    65	const year = new Date().getFullYear();
    66	</script>
    67	
    68	<style lang="scss" scoped>
    69	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis Footer.jsx/kit.css */
    70	.ftr {
    71	  position: relative;
    72	  z-index: 10;
    73	  margin-top: auto;
    74	  background: var(--surface-1);
    75	  border-top: 1px solid var(--border-subtle);
    76	  padding: var(--space-12) 0 0;
    77	}
    78	
    79	.ftr__container {
    80	  width: 100%;
    81	  max-width: var(--container-xl);
    82	  margin: 0 auto;
    83	  padding: 0 var(--space-6);
    84	}
    85	
    86	.ftr__in {
    87	  display: flex;
    88	  flex-wrap: wrap;
    89	  gap: var(--space-8);
    90	  align-items: flex-start;
    91	  justify-content: space-between;
    92	}
    93	
    94	.ftr__brand-col {
    95	  max-width: 300px;
    96	}
    97	
    98	.ftr__brand {
    99	  display: inline-flex;
   100	  align-items: center;
   101	  gap: var(--space-3);
   102	  margin-bottom: var(--space-3);
   103	  text-decoration: none;
   104	
   105	  .ftr__logo {
   106	    display: block;
   107	    width: 22px;
   108	    height: 22px;
   109	    object-fit: contain;
   110	    filter: drop-shadow(0 2px 4px color-mix(in srgb, var(--surface-0) 60%, transparent));
   111	  }
   112	
   113	  b {
   114	    font-family: var(--font-mono);
   115	    font-size: var(--fs-md);
   116	    font-weight: var(--fw-bold);
   117	    color: var(--text-strong);
   118	  }
   119	
   120	  .dim {
   121	    color: var(--text-muted);
   122	  }
   123	
   124	  // Lien focusable (logo + nom) : anneau DS cohérent avec le reste du châssis.
   125	  &:focus-visible {
   126	    outline: 2px solid transparent; // forced-colors : rendu en couleur système
   127	    outline-offset: 2px;
   128	    border-radius: var(--radius-sm);
   129	    box-shadow: var(--ring-accent);
   130	  }
   131	}
   132	
   133	.ftr__tagline {
   134	  margin: 0;
   135	  font-size: var(--fs-sm);
   136	  color: var(--text-body);
   137	}
   138	
   139	.ftr__col {
   140	  display: flex;
   141	  flex-direction: column;
   142	}
   143	
   144	.ftr__title {
   145	  margin: 0 0 var(--space-3);
   146	  font-family: var(--font-mono);
   147	  font-size: var(--fs-xs);
   148	  font-weight: var(--fw-medium);
   149	  letter-spacing: var(--ls-wider);
   150	  text-transform: uppercase;
   151	  color: var(--accent);
   152	}
   153	
   154	.ftr__list {
   155	  display: flex;
   156	  flex-direction: column;
   157	  padding: 0;
   158	  margin: 0;
   159	  list-style: none;
   160	}
   161	
   162	.ftr__link {
   163	  display: block;
   164	  padding: var(--space-1) 0;
   165	  font-family: var(--font-mono);
   166	  font-size: var(--fs-sm);
   167	  color: var(--text-strong);
   168	  text-decoration: none;
   169	  transition:
   170	    color var(--dur-fast) var(--ease-standard),
   171	    transform var(--dur-fast) var(--ease-standard);
   172	
   173	  &:hover {
   174	    color: var(--accent);
   175	    transform: translateX(2px);
   176	  }
   177	
   178	  // Anneau de focus DS (les liens du footer n'avaient que l'outline UA par défaut).
   179	  &:focus-visible {
   180	    outline: 2px solid transparent; // forced-colors : rendu en couleur système
   181	    outline-offset: 2px;
   182	    border-radius: var(--radius-xs);
   183	    box-shadow: var(--ring-accent);
   184	  }
   185	
   186	  &--static {
   187	    color: var(--text-body);
   188	    cursor: default;
   189	
   190	    &:hover {
   191	      color: var(--text-body);
   192	      transform: none;
   193	    }
   194	  }
   195	}
   196	
   197	.ftr__bottom-bar {
   198	  width: 100%;
   199	  margin-top: var(--space-8);
   200	  border-top: 1px solid var(--border-default);
   201	}
   202	
   203	.ftr__bottom {
   204	  display: flex;
   205	  flex-wrap: wrap;
   206	  gap: var(--space-3);
   207	  justify-content: space-between;
   208	  align-items: center;
   209	  padding-block: var(--space-5);
   210	  font-family: var(--font-mono);
   211	  font-size: var(--fs-xs);
   212	  color: var(--text-body);
   213	}
   214	
   215	.ftr__cmd {
   216	  color: var(--term-green);
   217	  font-weight: var(--fw-medium);
   218	}
   219	
   220	@media (prefers-reduced-motion: reduce) {
   221	  .ftr__link {
   222	    transition: none;
   223	    transform: none !important;
   224	  }
   225	}
   226	</style>

2026-09-14T10:32:43.604963Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "nl -ba app/data/site.ts | sed -n '1,100p'; rg -n \"Valognes|city|timezone|Heure locale\" app docs | head -80" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	// Source de vérité unique du CONTENU partagé du site (DRY / SRP : les données vivent ici,
     2	// les composants/programmes ne font que les présenter). Forme portée de
     3	// `docs/design_system/ui_kits/jouan-site/data.js` (référence du UI kit).
     4	//
     5	// Consommé par : pages (`index.vue`, `about.vue`, `contact.vue`), `FooterComponent.vue`,
     6	// et les programmes terminal (`programs/Skills|Projets|Contact|About.ts`).
     7	//
     8	// NB : `experiences` / `degrees` ne sont PAS centralisés ici — leurs formes et leur niveau
     9	// de détail divergent volontairement entre le CV terminal (`About.ts`, détaillé) et la page
    10	// `/about` (condensée). Leur réconciliation est une décision de contenu, suivie dans
    11	// `deferred-work.md`, pas un simple refactor.
    12	
    13	export interface IProfile {
    14	  name: string;
    15	  role: string;
    16	  email: string;
    17	  city: string;
    18	  available: boolean;
    19	  maltUrl?: string;
    20	}
    21	
    22	export interface IProject {
    23	  name: string;
    24	  role: string;
    25	  desc: string;
    26	  url?: string;
    27	  status?: string;
    28	  tags: string[];
    29	}
    30	
    31	const profile: IProfile = {
    32	  name: "Simon Jouan",
    33	  role: "Développeur Full Stack TypeScript — Nuxt / NestJS",
    34	  email: "simon@jouan.ovh",
    35	  city: "Rouen, France",
    36	  available: true,
    37	  maltUrl: "https://www.malt.fr/profile/simonjouan",
    38	};
    39	
    40	// Stack technique moderne prioritaire ordonnée.
    41	const skills: string[] = [
    42	  "typescript",
    43	  "nuxt",
    44	  "vue",
    45	  "nest.js",
    46	  "node.js",
    47	  "postgresql",
    48	  "typeorm",
    49	  "stripe",
    50	  "testcafe",
    51	  "docker",
    52	  "rest-api",
    53	  "vitest",
    54	];
    55	
    56	const projects: IProject[] = [
    57	  {
    58	    name: "Keova App",
    59	    role: "Co-fondateur & Développeur Full Stack",
    60	    desc: "Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).",
    61	    url: "https://keova.app",
    62	    status: "● En production",
    63	    tags: ["Nuxt 4", "NestJS", "PostgreSQL", "Stripe Connect", "SaaS"],
    64	  },
    65	  {
    66	    name: "TryOn",
    67	    role: "CTO & Développeur Full Stack",
    68	    desc: "Plateforme SaaS B2B d'essayage virtuel de vêtements via l'IA générative (diffusion models, microservices asynchrones, files Redis).",
    69	    status: "○ Étude de cas (MVP livré)",
    70	    tags: ["Nuxt 3", "NestJS", "Python", "ComfyUI", "IA"],
    71	  },
    72	  {
    73	    name: "Nodium",
    74	    role: "Créateur & Ingénieur IA",
    75	    desc: "Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.",
    76	    status: "◐ R&D / En cours",
    77	    tags: ["TypeScript", "Electron", "Agents", "IA"],
    78	  },
    79	];
    80	
    81	export const SITE = { profile, skills, projects } as const;
app/pages/about.vue:16:              {{ profile.city }}
app/pages/about.vue:28:              Développeur web freelance basé à <strong>{{ city }}</strong
app/pages/about.vue:104:const city = profile.city.split(",")[0]?.trim() ?? profile.city;
app/pages/about.vue:140:const pageDescription = `Développeur web freelance à ${city}, je conçois des applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL — découvrez mon parcours.`;
app/pages/about.vue:157:      addressLocality: SITE.profile.city,
app/data/site.ts:17:  city: string;
app/data/site.ts:35:  city: "Rouen, France",
docs/contexte_malt.md:1018:Simon est basé en Normandie, dans le Cotentin / secteur de Cherbourg-Valognes.
app/pages/mentions-legales.vue:21:              Localisation : {{ profile.city }}<br />
app/pages/index.vue:339:      addressLocality: SITE.profile.city,
app/pages/index.vue:653:    opacity: 0;
app/pages/index.vue:654:    transition: opacity var(--dur-slow) var(--ease-standard);
app/pages/index.vue:669:      opacity: 1;
app/pages/confidentialite.vue:19:              {{ profile.role }} — {{ profile.city }}.<br />
app/pages/contact.vue:103:                  <dd class="infoitem__v">{{ contact.city }}</dd>
app/pages/contact.vue:269:      addressLocality: SITE.profile.city,
docs/design_system/README.md:113:  Subtle scanline / grid textures are optional and low-opacity.
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/tokens/motion.css:19:  0%, 49% { opacity: 1; }
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/tokens/motion.css:20:  50%, 100% { opacity: 0; }
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/tokens/motion.css:24:  from { opacity: 0; transform: translateY(8px); }
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/tokens/motion.css:25:  to { opacity: 1; transform: translateY(0); }
docs/implementation-artifacts/consignes-corrections-pre-epic-3.md:40:   Le mixin `background-opacity` utilise `rgba(red($c), green($c), blue($c), $o)`. Le remplacer par l'équivalent moderne **`rgba($color, $opacity)`** (Sass accepte directement couleur + alpha) — plus simple, supprime les 3 fonctions globales. *(Fallback explicite : `@use "sass:color"` + `color.channel($c, "red", $space: rgb)`.)* Vérifier que `_typography.scss` (`@include mixin.font-style-normal`) compile toujours.
app/components/HeaderComponent.vue:559:    opacity: 0;
app/components/HeaderComponent.vue:563:      opacity var(--dur-base) var(--ease-standard),
app/components/HeaderComponent.vue:569:    opacity: 1;
app/components/CurrentTime.vue:2:  <time class="current-time" :datetime="currentTimeIso" aria-label="Heure locale de Valognes">
app/components/CurrentTime.vue:73:  transition: opacity 0.1s linear;
app/components/CurrentTime.vue:76:    opacity: 0;
app/components/CurrentTime.vue:83:    opacity: 1;
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:30:  - [x] Émuler le motion réduit (Chrome DevTools : Rendering › « Emulate CSS media feature prefers-reduced-motion: reduce »). Vérifier que le filet global `app/assets/scss/base/_motion.scss` (9.2) **ramène à l'instantané** les entrées `fade-rise` et transitions ; qu'**aucune autre boucle** ne tourne ; que le **caret du terminal reste** (exception CAP-11) et que le caret déco du hero (`.prm__caret`) est **figé visible** (pas `opacity:0`).
app/app.vue:24:    addressLocality: SITE.profile.city,
docs/design_system/ui_kits/jouan-site/Contact.jsx:47:                  <div className="v">{S.city}</div>
app/components/FooterComponent.vue:10:          <p class="ftr__tagline">{{ profile.role }}. {{ profile.city }}.</p>
docs/design_system/tokens/motion.css:19:  0%, 49% { opacity: 1; }
docs/design_system/tokens/motion.css:20:  50%, 100% { opacity: 0; }
docs/design_system/tokens/motion.css:24:  from { opacity: 0; transform: translateY(8px); }
docs/design_system/tokens/motion.css:25:  to { opacity: 1; transform: translateY(0); }
docs/implementation-artifacts/deferred-work.md:58:- ~~**DRY — données de contact inline**~~ — ✅ **Résolu en 8.2** : `contact.email`/`city` (`/contact`) et `profile.email`/`city` (`/about`) consomment désormais la source unique `app/data/site.ts` (`SITE.profile`). _(La consolidation `SITE_URL` SEO reste un sujet distinct, item 4.)_
docs/implementation-artifacts/sprint-status.yaml:33:# - Stories can be worked in parallel if team capacity allows
docs/implementation-artifacts/7-2-infos-cta-terminal-et-socials.md:73:  - **Carte infos** (`<Card>`) : trois `infoitem` (`k` = label mono, `v` = valeur) — `// email` (`<a mailto:>` `var(--term-blue)`), `// localisation` (`S.city`), `// disponibilité` (`<Badge tone="success" dot>Ouvert aux missions freelance</Badge>`). → `ZCard` + `ZBadge`.
docs/implementation-artifacts/7-2-infos-cta-terminal-et-socials.md:101:- [Source: docs/design_system/ui_kits/jouan-site/data.js — `window.SITE` (email, city, social)]
docs/implementation-artifacts/7-2-infos-cta-terminal-et-socials.md:121:  - **Carte infos** (`ZCard`) : 3 `infoitem` (label mono `// email`/`// localisation`/`// disponibilité`) — email `mailto:` en `--term-blue` (ring de focus a11y), ville, et `ZBadge tone="success" dot` « Ouvert aux missions freelance ». Données `contact = { email, city }` (data.js).
docs/implementation-artifacts/7-2-infos-cta-terminal-et-socials.md:145:- [x] [Review][Defer] a11y sémantique de la carte infos : les `infoitem` sont des `<div>` label/valeur (pas de `<dl>/<dt>/<dd>` ni `aria`), le préfixe `//` est lu « slash slash », la colonne droite n'a pas de titre, et le CTA terminal pourrait porter `aria-haspopup="dialog"`. Fidèle au kit mais améliorable. — deferred, lot a11y Epic 9 (avec eyebrow→titre + listes home/services). _(Note DRY : `contact.email`/`city` sont inline ici comme `profile.email` dans `/about` — candidat à une constante `SITE` partagée, future consolidation.)_
app/assets/scss/base/_motion.scss:14://    VISIBLE (bloc plein) plutôt que de sauter à la frame finale (opacity: 0).
app/assets/scss/base/_motion.scss:35:  // Caret : arrêté sur l'état visible (ne pas sauter à la frame opacity:0).
docs/implementation-artifacts/2-3-primitive-zbutton.md:36:  - [x] `:disabled` / `[aria-disabled="true"]` : `opacity .45`, `cursor: not-allowed`, `pointer-events: none`.
docs/design_system/ui_kits/jouan-site/TerminalScreen.jsx:6:  about: () => "Développeur web freelance basé à Valognes.\nPHP/Symfony · WordPress · Node.js / Nest.js / Nuxt.js.\nFondateur du SaaS keova.app.",
docs/design_system/ui_kits/jouan-site/TerminalScreen.jsx:9:  contact: () => "email   : simon@jouan.ovh\nville   : Valognes, France\nstatut  : disponible",
docs/design_system/components/terminal/TerminalWindow.jsx:18:.ds-term__dot--min { background: hsl(48 89% 50%); opacity: 0.85; }
docs/design_system/components/terminal/TerminalWindow.jsx:19:.ds-term__dot--max { background: hsl(143 60% 45%); opacity: 0.85; }
docs/implementation-artifacts/5-1-portrait-et-bio.md:31:  - [x] Colonne gauche : portrait via `<nuxt-img>` (radius pill / `ZAvatar` une fois disponible — voir Dev Notes), nom (`Simon Jouan`), rôle en mono accent (`Développeur web freelance`), localisation (`Valognes, France`) avec icône pin, et deux CTA (« Me contacter » → `/contact`, « CV » → `mailto:`).
docs/implementation-artifacts/5-1-portrait-et-bio.md:34:  - [x] Reprendre la bio depuis `About.jsx` (texte 1re personne « je » déjà rédigé) ; libellés depuis `data.js` (`name`, `role`, `city`, `email`).
docs/implementation-artifacts/5-1-portrait-et-bio.md:80:  - `<p className="prose">… {S.city}</p>` avec icône pin → « Valognes, France ».
docs/implementation-artifacts/5-1-portrait-et-bio.md:93:- `name: "Simon Jouan"`, `role: "Développeur web freelance"`, `city: "Valognes, France"`, `email: "simon@jouan.ovh"`. [Source: docs/design_system/ui_kits/jouan-site/data.js]
docs/implementation-artifacts/5-1-portrait-et-bio.md:119:- [Source: docs/design_system/ui_kits/jouan-site/data.js — name, role, city, email]
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:547:+  <time class="current-time" :datetime="currentTimeIso" aria-label="Heure locale de Valognes">
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:617:+  transition: opacity 0.1s linear;
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:620:+    opacity: 0;
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:627:+    opacity: 1;
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:645:           <p class="ftr__tagline">{{ profile.role }}. {{ profile.city }}.</p>
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:2464:10:+  <time class="current-time" :datetime="currentTimeIso" aria-label="Heure locale de Valognes">
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:2501:80:+  transition: opacity 0.1s linear;
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:2503:83:+    opacity: 0;
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:2509:90:+    opacity: 1;
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:3841:           <p class="ftr__tagline">{{ profile.role }}. {{ profile.city }}.</p>
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:6598:   186	    opacity: 0.45;
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:7446:   559	    opacity: 0;
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:7450:   563	      opacity var(--dur-base) var(--ease-standard),
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:7456:   569	    opacity: 1;
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:7516:    10	          <p class="ftr__tagline">{{ profile.role }}. {{ profile.city }}.</p>
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:8089:   186	    opacity: 0.45;
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:8219:   653	    opacity: 0;
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:8220:   654	    transition: opacity var(--dur-slow) var(--ease-standard);
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:8235:   669	      opacity: 1;
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:8745:/bin/zsh -lc "rg -n \"city:|Valognes|Rouen|TestCafé|Cypress\" app/data/site.ts app/components/CurrentTime.vue docs/planning-artifacts/epics.md docs/project-context.md | sed -n '1,160p'; printf '%s\\n' '--- CURRENT GIT STATUS ---'; git status --short" in /Users/simon/dev/jouan.ovh
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:8747:app/components/CurrentTime.vue:2:  <time class="current-time" :datetime="currentTimeIso" aria-label="Heure locale de Valognes">
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:8748:app/components/CurrentTime.vue:76:    opacity: 0;
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:8749:app/components/CurrentTime.vue:83:    opacity: 1;
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:8750:app/data/site.ts:17:  city: string;
docs/implementation-artifacts/code-reviews/11-6/raw-acceptance-auditor.md:8751:app/data/site.ts:35:  city: "Rouen, France",

2026-09-14T10:33:14.830739Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '1,120p' app/assets/scss/base/_reset.scss; sed -n '1,120p' app/assets/scss/base/_motion.scss; sed -n '1,120p' docs/design_system/ui_kits/jouan-site/kit.css; sed -n '1,120p' docs/design_system/ui_kits/jouan-site/'Home - Awwwards.html'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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
// ============================================================
//  Accessibilité — prefers-reduced-motion (story 9.2, CAP-11)
// ============================================================
// Filet de sécurité GLOBAL : dès que l'utilisateur demande moins de mouvement,
// les animations d'entrée et les transitions non essentielles sont ramenées à
// l'instantané. Les gardes par composant (ZCard / ZInput / ZTag / index.vue…)
// restent en place et cohérentes ; cette règle couvre le reste (ZButton, etc.)
// et tout ajout futur, sans avoir à y penser au cas par cas.
//
// EXCEPTION (DS / CAP-11) — le caret du terminal est la SEULE boucle autorisée :
//  - terminal réel : caret NATIF de l'<input> (caret-color/caret-shape), non
//    piloté par CSS → intact ici ;
//  - caret décoratif du hero (`.prm__caret`, animation CSS) : figé sur son état
//    VISIBLE (bloc plein) plutôt que de sauter à la frame finale (opacity: 0).
//    Reste donc lisible, ne boucle plus (cf. story 9.2, tâche 1).
//
// DÉROGATION « valeurs en dur » (règle SCSS projet) — les durées `0.01ms` / `0ms`
// ci-dessous sont volontairement littérales : c'est la recette a11y standard de
// neutralisation du mouvement (quasi-instantané, sans casser les callbacks
// `animationend`/`transitionend`). Aucun token de durée nulle n'existe (les
// `--dur-*` sont des durées d'animation positives) → pas de `var()` applicable ici.

/* stylelint-disable declaration-no-important, selector-class-pattern -- réduction de motion : surcharge volontaire et globale (a11y) ; .prm__caret = convention BEM DS */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    transition-delay: 0ms !important;
    scroll-behavior: auto !important;
  }

  // Caret : arrêté sur l'état visible (ne pas sauter à la frame opacity:0).
  .prm__caret {
    animation: none !important;
  }
}
/* stylelint-enable declaration-no-important, selector-class-pattern */
/* ============================================================
   jouan-site UI kit — layout-only CSS (not part of styles.css).
   Tokens come from the design system (../../styles.css).
   ============================================================ */

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0; background: var(--bg-page); color: var(--text-body);
  font-family: var(--font-sans); font-size: var(--fs-base); line-height: var(--lh-normal);
  -webkit-font-smoothing: antialiased;
}
a { color: var(--link); text-decoration: none; }

.app { min-height: 100vh; display: flex; flex-direction: column; }

/* ---- Layout helpers ---- */
.container { width: 100%; max-width: var(--container-xl); margin: 0 auto; padding: 0 var(--space-6); }
.eyebrow {
  font-family: var(--font-mono); font-size: var(--fs-xs); letter-spacing: var(--ls-wider);
  text-transform: uppercase; color: var(--accent); margin: 0 0 var(--space-3);
}
.eyebrow--muted { color: var(--text-muted); }
h1, h2, h3 { font-family: var(--font-mono); color: var(--text-strong); font-weight: var(--fw-regular);
  line-height: var(--lh-tight); margin: 0; }
.prose { font-family: var(--font-sans); color: var(--text-body); line-height: var(--lh-relaxed); }
.section { padding: var(--space-16) 0; }
.section--sunken { background: var(--bg-sunken); border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle); }

/* ---- Header ---- */
.hdr { position: sticky; top: 0; z-index: 50; height: var(--header-height);
  background: hsl(320 40% 5% / 0.82); backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-subtle); }
.hdr__in { height: 100%; display: flex; align-items: center; gap: var(--space-6); }
.hdr__brand { display: flex; align-items: center; gap: var(--space-2); cursor: pointer; }
.hdr__brand img { width: 24px; height: 24px; }
.hdr__brand b { font-family: var(--font-mono); color: var(--text-strong); font-size: var(--fs-md); font-weight: var(--fw-bold); }
.hdr__nav { display: flex; align-items: center; gap: var(--space-1); margin-left: var(--space-4); }
.hdr__link { font-family: var(--font-mono); font-size: var(--fs-sm); color: var(--text-muted);
  padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm); cursor: pointer;
  background: none; border: none; transition: color var(--dur-fast), background var(--dur-fast); }
.hdr__link:hover { color: var(--text-strong); background: var(--surface-2); }
.hdr__link--active { color: var(--accent); }
.hdr__right { margin-left: auto; display: flex; align-items: center; gap: var(--space-3); }

/* ---- Footer ---- */
.ftr { margin-top: auto; background: var(--surface-1); border-top: 1px solid var(--border-subtle);
  padding: var(--space-12) 0 var(--space-8); }
.ftr__in { display: flex; flex-wrap: wrap; gap: var(--space-8); align-items: flex-start; justify-content: space-between; }
.ftr__col h4 { font-family: var(--font-mono); font-size: var(--fs-xs); letter-spacing: var(--ls-wider);
  text-transform: uppercase; color: var(--text-muted); margin: 0 0 var(--space-3); }
.ftr__col a { display: block; font-family: var(--font-mono); font-size: var(--fs-sm); color: var(--text-body); padding: var(--space-1) 0; }
.ftr__col a:hover { color: var(--accent); }
.ftr__bottom { margin-top: var(--space-8); padding-top: var(--space-5); border-top: 1px solid var(--border-subtle);
  display: flex; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3);
  font-family: var(--font-mono); font-size: var(--fs-xs); color: var(--text-faint); }

/* ---- Hexagon social link (heritage motif) ---- */
.hexrow { display: flex; gap: var(--space-5); }
.hex { width: 46px; height: 53px; display: flex; align-items: center; justify-content: center;
  color: var(--text-muted); background: var(--surface-2);
  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
  transition: color var(--dur-base), background var(--dur-base); cursor: pointer; }
.hex:hover { color: var(--ink-on-accent); background: var(--accent); }
.hex svg { width: 20px; height: 20px; }

/* ---- Hero ---- */
.hero { position: relative; overflow: hidden; }
.hero__grad {
  background:
    radial-gradient(900px 500px at 78% -10%, hsl(24 94% 53% / 0.16), transparent 60%),
    radial-gradient(700px 500px at 0% 110%, hsl(319 60% 30% / 0.28), transparent 60%),
    var(--bg-page);
}
.hero__heritage {
  background:
    linear-gradient(127deg, var(--aubergine-deep), transparent 60%),
    linear-gradient(217deg, hsl(24 100% 40%), transparent 62%),
    linear-gradient(0deg, hsl(0 60% 22%), transparent 58%),
    var(--surface-0);
}
.hero__img { position: absolute; inset: 0; background-size: cover; background-position: center; }
.hero__img::after { content: ""; position: absolute; inset: 0;
  background: linear-gradient(180deg, hsl(320 50% 4% / 0.62), hsl(320 50% 4% / 0.9)); }
.hero__in { position: relative; z-index: 1; padding: var(--space-20) 0; }
.hero__grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: var(--space-12); align-items: center; }
.hero h1 { font-size: var(--fs-6xl); font-weight: var(--fw-light); letter-spacing: var(--ls-tight); }
.hero h1 em { font-style: normal; color: var(--accent); }
.hero__sub { font-family: var(--font-sans); font-size: var(--fs-lg); color: var(--text-body);
  line-height: var(--lh-relaxed); max-width: 46ch; margin: var(--space-5) 0 var(--space-6); }
.hero__cta { display: flex; flex-wrap: wrap; gap: var(--space-3); margin-bottom: var(--space-6); }
.hero__tags { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.hero--center { text-align: center; }
.hero--center .hero__sub { margin-left: auto; margin-right: auto; }
.hero--center .hero__cta, .hero--center .hero__tags { justify-content: center; }

/* ---- Variant switcher (kit dev control) ---- */
.switcher { position: fixed; right: var(--space-4); bottom: var(--space-4); z-index: 80;
  display: flex; flex-direction: column; gap: var(--space-2);
  background: hsl(320 40% 6% / 0.92); border: 1px solid var(--border-default); border-radius: var(--radius-md);
  padding: var(--space-3); backdrop-filter: blur(8px); box-shadow: var(--shadow-3); }
.switcher__lbl { font-family: var(--font-mono); font-size: 10px; letter-spacing: var(--ls-wider);
  text-transform: uppercase; color: var(--text-faint); }
.seg { display: flex; gap: 2px; background: var(--surface-1); border-radius: var(--radius-sm); padding: 2px; }
.seg button { font-family: var(--font-mono); font-size: var(--fs-xs); color: var(--text-muted);
  background: none; border: none; padding: var(--space-1) var(--space-2); border-radius: var(--radius-xs); cursor: pointer; }
.seg button.on { background: var(--accent); color: var(--ink-on-accent); }

/* ---- Generic grids ---- */
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); }
.stat { font-family: var(--font-mono); }
.stat b { display: block; font-size: var(--fs-4xl); color: var(--text-strong); font-weight: var(--fw-light); }
.stat span { font-size: var(--fs-sm); color: var(--text-muted); }
.statrow { display: flex; gap: var(--space-12); flex-wrap: wrap; }

/* ---- Service / offer card body ---- */
.offer__icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius-md); background: var(--accent-soft); color: var(--accent); margin-bottom: var(--space-4); }
<!-- @dsCard group="jouan-site" viewport="1440x900" name="Home — Awwwards concept" subtitle="Immersive terminal-OS homepage: aurora hero, boot sequence, kinetic type" -->
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Simon Jouan — Développeur web freelance</title>
<link rel="stylesheet" href="../../styles.css">
<style>
  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    background: var(--bg-page);
    color: var(--text-body);
    font-family: var(--font-sans);
    font-size: var(--fs-md);
    line-height: var(--lh-relaxed);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  a { color: inherit; text-decoration: none; }
  h1, h2, h3 { font-family: var(--font-mono); font-weight: var(--fw-regular); margin: 0; color: var(--text-strong); }
  ::selection { background: var(--selection); }

  /* ---------- Atmosphere: fixed background stack ---------- */
  .atmos { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
  .aurora { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.55; mix-blend-mode: screen; will-change: transform; }
  .aurora--orange { width: 60vw; height: 60vw; left: 48%; top: -22%; background: radial-gradient(circle at center, var(--orange-500), transparent 62%); animation: drift1 26s var(--ease-in-out) infinite; }
  .aurora--auberg { width: 64vw; height: 64vw; left: -22%; top: 6%; background: radial-gradient(circle at center, var(--aubergine), transparent 62%); opacity: 0.7; animation: drift2 32s var(--ease-in-out) infinite; }
  .aurora--red    { width: 44vw; height: 44vw; left: 26%; top: 44%; background: radial-gradient(circle at center, hsl(8 80% 42%), transparent 64%); opacity: 0.4; animation: drift3 30s var(--ease-in-out) infinite; }
  @keyframes drift1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-6vw,5vh) scale(1.12)} }
  @keyframes drift2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(7vw,-4vh) scale(1.08)} }
  @keyframes drift3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-4vw,-6vh) scale(1.15)} }

  .grid-dots { position: absolute; inset: 0;
    background-image: radial-gradient(hsl(30 20% 100% / 0.05) 1px, transparent 1px);
    background-size: 34px 34px; mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 78%); }
  .scanlines { position: absolute; inset: 0; opacity: 0.4;
    background: repeating-linear-gradient(0deg, hsl(0 0% 0% / 0.18) 0 1px, transparent 1px 3px); }
  .grain { position: fixed; inset: 0; z-index: 60; pointer-events: none; opacity: 0.05; mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
  .vignette { position: fixed; inset: 0; z-index: 1; pointer-events: none;
    background: radial-gradient(ellipse 120% 90% at 50% 0%, transparent 55%, var(--surface-0) 100%); }

  /* ---------- Scroll progress ---------- */
  .progress { position: fixed; top: 0; left: 0; height: 2px; width: 0; z-index: 80;
    background: linear-gradient(90deg, var(--accent), var(--aubergine-light)); box-shadow: 0 0 12px var(--accent); }

  /* ---------- Custom cursor ---------- */
  .cursor-dot, .cursor-ring { position: fixed; top: 0; left: 0; z-index: 90; pointer-events: none; border-radius: 50%; mix-blend-mode: difference; }
  .cursor-dot { width: 6px; height: 6px; background: #fff; transform: translate(-50%,-50%); }
  .cursor-ring { width: 34px; height: 34px; border: 1px solid hsl(0 0% 100% / 0.7); transform: translate(-50%,-50%); transition: width .2s var(--ease-out), height .2s var(--ease-out), border-color .2s; }
  .cursor-ring.is-hot { width: 56px; height: 56px; border-color: var(--accent); }
  @media (hover: none) { .cursor-dot, .cursor-ring { display: none; } }

  /* ---------- Layout ---------- */
  .wrap { position: relative; z-index: 2; }
  .container { width: min(1200px, 92vw); margin: 0 auto; }
  .eyebrow { font-family: var(--font-mono); font-size: var(--fs-sm); letter-spacing: var(--ls-wider);
    text-transform: uppercase; color: var(--accent); margin: 0 0 var(--space-4); }
  .eyebrow .c { color: var(--text-faint); }

  /* ---------- Header ---------- */
  header { position: fixed; top: 0; left: 0; right: 0; z-index: 70; height: 64px;
    display: flex; align-items: center; transition: background .3s, border-color .3s, backdrop-filter .3s;
    border-bottom: 1px solid transparent; }
  header.stuck { background: hsl(320 30% 6% / 0.72); backdrop-filter: blur(12px); border-bottom-color: var(--border-subtle); }
  .nav { display: flex; align-items: center; justify-content: space-between; width: 100%; }
  .brand { display: flex; align-items: center; gap: var(--space-3); font-family: var(--font-mono); color: var(--text-strong); font-size: var(--fs-md); }
  .brand img { width: 26px; height: 26px; display: block; filter: drop-shadow(0 2px 6px hsl(0 0% 0% / .5)); }
  .brand b { font-weight: var(--fw-bold); }
  .brand .dim { color: var(--text-faint); }
  .nav__links { display: flex; gap: var(--space-6); font-family: var(--font-mono); font-size: var(--fs-sm); }
  .nav__links a { color: var(--text-muted); position: relative; padding: 4px 0; transition: color .2s; }
  .nav__links a::after { content: ""; position: absolute; left: 0; bottom: 0; height: 1px; width: 0; background: var(--accent); transition: width .25s var(--ease-out); }
  .nav__links a:hover { color: var(--text-strong); }
  .nav__links a:hover::after { width: 100%; }
  @media (max-width: 720px) { .nav__links { display: none; } }

  /* ---------- Buttons ---------- */
  .btn { display: inline-flex; align-items: center; gap: var(--space-2); font-family: var(--font-mono);
    font-size: var(--fs-sm); letter-spacing: var(--ls-wide); border-radius: var(--radius-md);
    padding: 0 var(--space-5); height: 46px; border: 1px solid transparent; cursor: pointer; white-space: nowrap;
    transition: background .18s, color .18s, border-color .18s, transform .12s, box-shadow .2s; }
  .btn svg { width: 17px; height: 17px; }
  .btn--primary { background: var(--accent); color: var(--accent-text); font-weight: var(--fw-bold); box-shadow: var(--glow-accent); }
  .btn--primary:hover { background: var(--accent-hover); transform: translateY(-1px); }
  .btn--primary:active { background: var(--accent-active); transform: translateY(0); }
  .btn--ghost { background: hsl(316 14% 21% / 0.4); color: var(--text-strong); border-color: var(--border-default); backdrop-filter: blur(4px); }
  .btn--ghost:hover { border-color: var(--border-strong); background: hsl(316 14% 21% / 0.7); }
  .btn .mag { display: inline-flex; align-items: center; gap: var(--space-2); will-change: transform; }

  /* ---------- Hero ---------- */
  .hero { min-height: 100vh; display: flex; align-items: center; padding: 120px 0 80px; }
  .hero__grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: var(--space-12); align-items: center; }
  @media (max-width: 940px) { .hero__grid { grid-template-columns: 1fr; gap: var(--space-10); } }

  .h1 { font-size: clamp(2.6rem, 6.4vw, 5.2rem); line-height: 0.98; letter-spacing: var(--ls-tight); color: var(--text-strong); }
  .h1 em { font-style: italic; color: var(--accent); }
  .h1 .ln { display: block; overflow: hidden; }
  .h1 .word { display: inline-block; transform: translateY(110%); transition: transform .9s var(--ease-out); }
  .ready .h1 .word { transform: translateY(0); }
  .hero__sub { max-width: 44ch; color: var(--text-body); margin: var(--space-6) 0 var(--space-7); font-size: var(--fs-lg); }
  .hero__cta { display: flex; gap: var(--space-4); flex-wrap: wrap; }
  .hero__meta { display: flex; gap: var(--space-6); margin-top: var(--space-8); font-family: var(--font-mono); font-size: var(--fs-sm); color: var(--text-muted); flex-wrap: wrap; }
  .hero__meta .dot { color: var(--term-green); }

  .reveal { opacity: 0; transform: translateY(16px); transition: opacity .7s var(--ease-out), transform .7s var(--ease-out); }
  .reveal.in { opacity: 1; transform: none; }

  /* ---------- Terminal window ---------- */
  .term { border-radius: var(--radius-sm); overflow: hidden; background: hsl(319 100% 9% / 0.82);
    backdrop-filter: blur(6px); box-shadow: var(--glow-terminal), var(--shadow-4); border: 1px solid hsl(319 40% 40% / 0.35); }
  .term__bar { display: flex; align-items: center; gap: var(--space-3); padding: 10px var(--space-4); background: linear-gradient(hsl(318 30% 18%), hsl(319 32% 14%)); border-bottom: 1px solid hsl(319 40% 30% / 0.5); }
  .term__dots { display: flex; gap: 7px; }
  .term__dots i { width: 11px; height: 11px; border-radius: 50%; display: block; }
  .term__title { font-family: var(--font-mono); font-size: var(--fs-xs); color: var(--aubergine-light); letter-spacing: var(--ls-wide); }
  .term__body { padding: var(--space-4) var(--space-5) var(--space-5); font-family: var(--font-mono); font-size: var(--fs-sm); line-height: 1.7; min-height: 244px; white-space: pre-wrap; }
  .term__body .pmt { color: var(--term-green); }

2026-09-14T10:33:27.031830Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc 'rg -n -C 3 "__cta|ZButton" app/pages/about.vue app/pages/services.vue app/pages/contact.vue | head -220' in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "rg -n \"<img\" app/components app/pages | sed -n '1,120p'; rg -n \"NuxtImg|NuxtPicture\" app/components/ui/ZAvatar.vue app/components | head -100" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/services.vue-25-              <div class="offer__price">
app/pages/services.vue-26-                <b>{{ offer.price }}</b>
app/pages/services.vue-27-              </div>
app/pages/services.vue:28:              <div class="offer__cta">
app/pages/services.vue:29:                <ZButton
app/pages/services.vue-30-                  :as="NuxtLink"
app/pages/services.vue-31-                  to="/contact"
app/pages/services.vue-32-                  :variant="offer.featured ? 'primary' : 'secondary'"
--
app/pages/services.vue-34-                  class="offer__btn"
app/pages/services.vue-35-                >
app/pages/services.vue-36-                  Discuter du projet
app/pages/services.vue:37:                </ZButton>
app/pages/services.vue-38-              </div>
app/pages/services.vue-39-            </ZCard>
app/pages/services.vue-40-          </li>
--
app/pages/services.vue-56-          </li>
app/pages/services.vue-57-        </ol>
app/pages/services.vue-58-
app/pages/services.vue:59:        <div class="process__cta">
app/pages/services.vue:60:          <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
app/pages/services.vue-61-            Me parler de votre besoin
app/pages/services.vue-62-            <template #iconRight><ZIcon name="arrow" /></template>
app/pages/services.vue:63:          </ZButton>
app/pages/services.vue-64-        </div>
app/pages/services.vue-65-      </div>
app/pages/services.vue-66-    </section>
--
app/pages/services.vue-293-  }
app/pages/services.vue-294-}
app/pages/services.vue-295-
app/pages/services.vue:296:.offer__cta {
app/pages/services.vue-297-  margin-top: var(--space-4);
app/pages/services.vue-298-}
app/pages/services.vue-299-
--
app/pages/services.vue-340-  color: var(--text-muted);
app/pages/services.vue-341-}
app/pages/services.vue-342-
app/pages/services.vue:343:.process__cta {
app/pages/services.vue-344-  margin-top: var(--space-12);
app/pages/services.vue-345-  text-align: center;
app/pages/services.vue-346-}
--
app/pages/contact.vue-72-              <p v-if="submitError" class="contact__error" role="alert">{{ submitError }}</p>
app/pages/contact.vue-73-
app/pages/contact.vue-74-              <div>
app/pages/contact.vue:75:                <ZButton type="submit" variant="primary" size="lg" :disabled="sending">
app/pages/contact.vue-76-                  {{ sending ? "Envoi en cours…" : "Envoyer le message" }}
app/pages/contact.vue-77-                  <template #iconRight><ZIcon name="arrow" /></template>
app/pages/contact.vue:78:                </ZButton>
app/pages/contact.vue-79-              </div>
app/pages/contact.vue-80-
app/pages/contact.vue-81-              <p class="contact__rgpd">
--
app/pages/contact.vue-118-                anon.@jouan.ovh:~$ <span class="contact__prompt-cmd">./contact</span>
app/pages/contact.vue-119-              </p>
app/pages/contact.vue-120-              <p class="prose contact__term-text">Vous préférez la ligne de commande ? Ouvrez le terminal.</p>
app/pages/contact.vue:121:              <ZButton variant="terminal" size="sm" aria-haspopup="dialog" @click="openTerminal">
app/pages/contact.vue-122-                <template #icon><ZIcon name="terminal" /></template>
app/pages/contact.vue-123-                Ouvrir le terminal
app/pages/contact.vue:124:              </ZButton>
app/pages/contact.vue-125-            </ZCard>
app/pages/contact.vue-126-
app/pages/contact.vue-127-            <!-- Hexagones sociaux (composant partagé avec le footer) -->
--
app/pages/about.vue-15-              <ZIcon name="pin" class="about__pin" />
app/pages/about.vue-16-              {{ profile.city }}
app/pages/about.vue-17-            </p>
app/pages/about.vue:18:            <div class="about__cta">
app/pages/about.vue:19:              <ZButton :as="NuxtLink" to="/contact" variant="primary">Me contacter</ZButton>
app/pages/about.vue:20:              <ZButton as="a" :href="`mailto:${profile.email}`" variant="secondary">M'écrire</ZButton>
app/pages/about.vue-21-            </div>
app/pages/about.vue-22-          </div>
app/pages/about.vue-23-
--
app/pages/about.vue-221-  color: var(--text-muted);
app/pages/about.vue-222-}
app/pages/about.vue-223-
app/pages/about.vue:224:.about__cta {
app/pages/about.vue-225-  display: flex;
app/pages/about.vue-226-  gap: var(--space-3);
app/pages/about.vue-227-  margin-top: var(--space-5);

 succeeded in 0ms:
app/components/HeaderComponent.vue:6:        <img src="/images/logo_white.png" alt="" class="hdr__logo" width="24" height="24" />
app/components/FooterComponent.vue:7:            <img src="/images/logo_white.png" alt="" class="ftr__logo" width="22" height="22" />
app/components/ui/ZAvatar.vue:11:// (jamais <img> brut — règle images projet). CSS en <style scoped>, prerender-safe.
app/components/ui/ZAvatar.vue:3:    <NuxtImg v-if="showImage" class="zavatar__img" :src="src" :alt="alt" @error="onImageError" />
app/components/ui/ZAvatar.vue:10:// Porté de docs/design_system/components/core/Avatar.jsx. Image via <NuxtImg>
app/components/ui/ZAvatar.vue:3:    <NuxtImg v-if="showImage" class="zavatar__img" :src="src" :alt="alt" @error="onImageError" />
app/components/ui/ZAvatar.vue:10:// Porté de docs/design_system/components/core/Avatar.jsx. Image via <NuxtImg>

exec
/bin/zsh -lc "rg -n -C 4 \"\\.about__cta|\\.offer__cta|\\.contact__|\\.process__cta\" app/pages/about.vue app/pages/services.vue app/pages/contact.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/services.vue-292-    color: var(--text-strong);
app/pages/services.vue-293-  }
app/pages/services.vue-294-}
app/pages/services.vue-295-
app/pages/services.vue:296:.offer__cta {
app/pages/services.vue-297-  margin-top: var(--space-4);
app/pages/services.vue-298-}
app/pages/services.vue-299-
app/pages/services.vue-300-// Bouton CTA en pleine largeur (porté de l'inline `width: 100%` du JSX).
--
app/pages/services.vue-339-  font-size: var(--fs-sm);
app/pages/services.vue-340-  color: var(--text-muted);
app/pages/services.vue-341-}
app/pages/services.vue-342-
app/pages/services.vue:343:.process__cta {
app/pages/services.vue-344-  margin-top: var(--space-12);
app/pages/services.vue-345-  text-align: center;
app/pages/services.vue-346-}
app/pages/services.vue-347-
--
app/pages/about.vue-220-  font-size: var(--fs-sm);
app/pages/about.vue-221-  color: var(--text-muted);
app/pages/about.vue-222-}
app/pages/about.vue-223-
app/pages/about.vue:224:.about__cta {
app/pages/about.vue-225-  display: flex;
app/pages/about.vue-226-  gap: var(--space-3);
app/pages/about.vue-227-  margin-top: var(--space-5);
app/pages/about.vue-228-}
--
app/pages/contact.vue-290-.contact {
app/pages/contact.vue-291-  display: block;
app/pages/contact.vue-292-}
app/pages/contact.vue-293-
app/pages/contact.vue:294:// ---- Grille (porté de kit.css : .contact__grid 1fr / 0.8fr) ----
app/pages/contact.vue:295:.contact__grid {
app/pages/contact.vue-296-  display: grid;
app/pages/contact.vue-297-  grid-template-columns: 1fr 0.8fr;
app/pages/contact.vue-298-  gap: var(--space-12);
app/pages/contact.vue-299-  align-items: start;
app/pages/contact.vue-300-}
app/pages/contact.vue-301-
app/pages/contact.vue-302-// ---- En-tête (porté de Contact.jsx) ----
app/pages/contact.vue:303:.contact__title {
app/pages/contact.vue-304-  margin-bottom: var(--space-3);
app/pages/contact.vue-305-  font-family: var(--font-mono);
app/pages/contact.vue-306-  font-size: var(--fs-4xl);
app/pages/contact.vue-307-  font-weight: var(--fw-light);
app/pages/contact.vue-308-  line-height: var(--lh-tight);
app/pages/contact.vue-309-  color: var(--text-strong);
app/pages/contact.vue-310-}
app/pages/contact.vue-311-
app/pages/contact.vue:312:.contact__intro {
app/pages/contact.vue-313-  max-width: 48ch;
app/pages/contact.vue-314-  margin-bottom: var(--space-8);
app/pages/contact.vue-315-  color: var(--text-muted);
app/pages/contact.vue-316-}
app/pages/contact.vue-317-
app/pages/contact.vue:318:// ---- Formulaire (porté de kit.css : .contact__form) ----
app/pages/contact.vue:319:.contact__form {
app/pages/contact.vue-320-  display: flex;
app/pages/contact.vue-321-  flex-direction: column;
app/pages/contact.vue-322-  gap: var(--space-4);
app/pages/contact.vue-323-}
app/pages/contact.vue-324-
app/pages/contact.vue-325-// Rangée Nom + Email (porté de Contact.jsx : grid-2, gap space-4).
app/pages/contact.vue:326:.contact__row {
app/pages/contact.vue-327-  display: grid;
app/pages/contact.vue-328-  grid-template-columns: 1fr 1fr;
app/pages/contact.vue-329-  gap: var(--space-4);
app/pages/contact.vue-330-}
app/pages/contact.vue-331-
app/pages/contact.vue-332-// Honeypot : hors écran et hors tabulation (piège à bots, invisible aux humains).
app/pages/contact.vue-333-// On évite display:none (certains bots l'ignorent).
app/pages/contact.vue:334:.contact__hp {
app/pages/contact.vue-335-  position: absolute;
app/pages/contact.vue-336-  left: -9999px;
app/pages/contact.vue-337-  width: 1px;
app/pages/contact.vue-338-  height: 1px;
app/pages/contact.vue-339-  overflow: hidden;
app/pages/contact.vue-340-}
app/pages/contact.vue-341-
app/pages/contact.vue-342-// Erreur d'envoi réseau.
app/pages/contact.vue:343:.contact__error {
app/pages/contact.vue-344-  margin: 0;
app/pages/contact.vue-345-  font-family: var(--font-mono);
app/pages/contact.vue-346-  font-size: var(--fs-sm);
app/pages/contact.vue-347-  color: var(--danger);
app/pages/contact.vue-348-}
app/pages/contact.vue-349-
app/pages/contact.vue-350-// Notice RGPD discrète sous le bouton.
app/pages/contact.vue:351:.contact__rgpd {
app/pages/contact.vue-352-  margin: 0;
app/pages/contact.vue-353-  font-family: var(--font-mono);
app/pages/contact.vue-354-  font-size: var(--fs-xs);
app/pages/contact.vue-355-  line-height: var(--lh-normal);
--
app/pages/contact.vue-358-  // plus lisible que --text-faint. Reste discrète. Token, pas de couleur en dur.
app/pages/contact.vue-359-  color: var(--text-muted);
app/pages/contact.vue-360-}
app/pages/contact.vue-361-
app/pages/contact.vue:362:.contact__rgpd-link {
app/pages/contact.vue-363-  color: var(--term-blue);
app/pages/contact.vue-364-  text-decoration: underline;
app/pages/contact.vue-365-
app/pages/contact.vue-366-  &:hover {
--
app/pages/contact.vue-375-  }
app/pages/contact.vue-376-}
app/pages/contact.vue-377-
app/pages/contact.vue-378-// Carte « envoyé » focalisée par programme (tabindex -1) : pas de contour UA résiduel.
app/pages/contact.vue:379:.contact__sent:focus {
app/pages/contact.vue-380-  outline: none;
app/pages/contact.vue-381-}
app/pages/contact.vue-382-
app/pages/contact.vue-383-// ---- État envoyé (porté de Contact.jsx : Card accent + ligne mono verte) ----
app/pages/contact.vue:384:.contact__sent-line {
app/pages/contact.vue-385-  margin-bottom: var(--space-2);
app/pages/contact.vue-386-  font-family: var(--font-mono);
app/pages/contact.vue-387-  font-size: var(--fs-md);
app/pages/contact.vue-388-  color: var(--term-green);
app/pages/contact.vue-389-}
app/pages/contact.vue-390-
app/pages/contact.vue:391:.contact__sent-text {
app/pages/contact.vue-392-  margin: 0;
app/pages/contact.vue-393-  font-size: var(--fs-sm);
app/pages/contact.vue-394-}
app/pages/contact.vue-395-
app/pages/contact.vue-396-// ============================================================
app/pages/contact.vue-397-//  Colonne droite (story 7.2) : infos / CTA terminal / socials
app/pages/contact.vue-398-// ============================================================
app/pages/contact.vue:399:// Colonne (porté de kit.css : .contact__info — flex column).
app/pages/contact.vue:400:.contact__info {
app/pages/contact.vue-401-  display: flex;
app/pages/contact.vue-402-  flex-direction: column;
app/pages/contact.vue-403-  gap: var(--space-5);
app/pages/contact.vue-404-}
app/pages/contact.vue-405-
app/pages/contact.vue-406-// ---- Carte infos (porté de kit.css : .infoitem / .k / .v) ----
app/pages/contact.vue:407:.contact__infolist {
app/pages/contact.vue-408-  margin: 0;
app/pages/contact.vue-409-  padding: 0;
app/pages/contact.vue-410-}
app/pages/contact.vue-411-
--
app/pages/contact.vue-431-  color: var(--text-strong);
app/pages/contact.vue-432-}
app/pages/contact.vue-433-
app/pages/contact.vue-434-// Lien email en bleu terminal (porté de Contact.jsx), ring de focus accessible.
app/pages/contact.vue:435:.contact__email {
app/pages/contact.vue-436-  text-decoration: none;
app/pages/contact.vue-437-  color: var(--term-blue);
app/pages/contact.vue-438-
app/pages/contact.vue-439-  &:hover {
--
app/pages/contact.vue-447-    box-shadow: var(--ring-accent);
app/pages/contact.vue-448-  }
app/pages/contact.vue-449-}
app/pages/contact.vue-450-
app/pages/contact.vue:451:.contact__avail {
app/pages/contact.vue-452-  margin-top: var(--space-2);
app/pages/contact.vue-453-}
app/pages/contact.vue-454-
app/pages/contact.vue-455-// ---- Carte CTA terminal (porté de Contact.jsx : Card .offer fond terminal) ----
app/pages/contact.vue:456:// Surcharge du fond/bordure de ZCard ; nesting sous .contact__info pour la spécificité.
app/pages/contact.vue:457:.contact__info .contact__term {
app/pages/contact.vue-458-  background: var(--bg-terminal);
app/pages/contact.vue-459-  border-color: var(--accent-2-soft);
app/pages/contact.vue-460-}
app/pages/contact.vue-461-
app/pages/contact.vue:462:.contact__prompt {
app/pages/contact.vue-463-  margin: 0 0 var(--space-2);
app/pages/contact.vue-464-  font-family: var(--font-mono);
app/pages/contact.vue-465-  font-size: var(--fs-sm);
app/pages/contact.vue-466-  color: var(--term-green);
app/pages/contact.vue-467-}
app/pages/contact.vue-468-
app/pages/contact.vue-469-// Commande tapée : off-white (porté de l'inline ink-1 de Contact.jsx).
app/pages/contact.vue:470:.contact__prompt-cmd {
app/pages/contact.vue-471-  color: var(--text-strong);
app/pages/contact.vue-472-}
app/pages/contact.vue-473-
app/pages/contact.vue:474:.contact__term-text {
app/pages/contact.vue-475-  margin: 0 0 var(--space-3);
app/pages/contact.vue-476-  font-size: var(--fs-sm);
app/pages/contact.vue-477-  color: var(--text-muted);
app/pages/contact.vue-478-}
app/pages/contact.vue-479-
app/pages/contact.vue-480-// ---- Responsive (cf. kit.css @media max-width: 900px : grilles → 1 colonne) ----
app/pages/contact.vue-481-@media (width <= 900px) {
app/pages/contact.vue:482:  .contact__grid,
app/pages/contact.vue:483:  .contact__row {
app/pages/contact.vue-484-    grid-template-columns: 1fr;
app/pages/contact.vue-485-  }
app/pages/contact.vue-486-}
app/pages/contact.vue-487-</style>

2026-09-14T10:33:37.971844Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "nl -ba app/components/terminal/TerminalManagerComponent.vue | sed -n '1,260p'; rg -n \"position:|z-index|terminal\" app/components/terminal/TerminalManagerComponent.vue app/components/terminal/TerminalComponent.vue | head -100" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	<template>
     2	  <div>
     3	    <div v-for="(terminal, index) in terminals" :key="index">
     4	      <TerminalComponent
     5	        :id="index"
     6	        :create-new-terminal="createNewTerminal"
     7	        :terminal-config="terminal.terminalConfig"
     8	      />
     9	    </div>
    10	  </div>
    11	</template>
    12	
    13	<script setup lang="ts">
    14	import type { ITerminalConfig } from "~/components/terminal/interfaces";
    15	import { uniqueId } from "~/utils/functions";
    16	
    17	// Migration Options API → <script setup> (story 8.3) : comportement strictement constant.
    18	defineOptions({ name: "TerminalManagerComponent" });
    19	
    20	const terminals = ref<Array<{ id: string; terminalConfig: ITerminalConfig }>>([]);
    21	
    22	const createNewTerminal = (terminalConfig: ITerminalConfig = {}) => {
    23	  // Créez une nouvelle instance de terminal et ajoutez-la à la liste des terminaux.
    24	  const newTerminal = {
    25	    id: uniqueId(),
    26	    terminalConfig,
    27	  };
    28	  terminals.value.push(newTerminal);
    29	};
    30	
    31	// En <script setup> les bindings ne sont PAS exposés au parent sans defineExpose. Seul le
    32	// header détient une ref de ce composant et appelle la méthode directement
    33	// (`terminalManager.value?.createNewTerminal()`, HeaderComponent.vue). Le hero et /contact
    34	// passent par `useTerminal().open()` → le lanceur que le header enregistre, lequel finit par
    35	// appeler cette même méthode via sa ref. → on l'expose explicitement.
    36	defineExpose({ createNewTerminal });
    37	</script>
    38	
    39	<style scoped></style>
app/components/terminal/TerminalManagerComponent.vue:3:    <div v-for="(terminal, index) in terminals" :key="index">
app/components/terminal/TerminalManagerComponent.vue:6:        :create-new-terminal="createNewTerminal"
app/components/terminal/TerminalManagerComponent.vue:7:        :terminal-config="terminal.terminalConfig"
app/components/terminal/TerminalManagerComponent.vue:14:import type { ITerminalConfig } from "~/components/terminal/interfaces";
app/components/terminal/TerminalManagerComponent.vue:20:const terminals = ref<Array<{ id: string; terminalConfig: ITerminalConfig }>>([]);
app/components/terminal/TerminalManagerComponent.vue:22:const createNewTerminal = (terminalConfig: ITerminalConfig = {}) => {
app/components/terminal/TerminalManagerComponent.vue:23:  // Créez une nouvelle instance de terminal et ajoutez-la à la liste des terminaux.
app/components/terminal/TerminalManagerComponent.vue:26:    terminalConfig,
app/components/terminal/TerminalManagerComponent.vue:28:  terminals.value.push(newTerminal);
app/components/terminal/TerminalManagerComponent.vue:33:// (`terminalManager.value?.createNewTerminal()`, HeaderComponent.vue). Le hero et /contact
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
app/components/terminal/TerminalComponent.vue:80:    terminalConfig?: ITerminalConfig;
app/components/terminal/TerminalComponent.vue:85:    terminalConfig: () => ({}),
app/components/terminal/TerminalComponent.vue:94:const terminalElement = ref<HTMLElement | null>(null);
app/components/terminal/TerminalComponent.vue:102:  width: props.terminalConfig.width || terminalDefaults.width,
app/components/terminal/TerminalComponent.vue:103:  height: props.terminalConfig.height || terminalDefaults.height,
app/components/terminal/TerminalComponent.vue:104:  userName: props.terminalConfig.userName || terminalDefaults.userName,
app/components/terminal/TerminalComponent.vue:105:  domainName: props.terminalConfig.domainName || terminalDefaults.domainName,
app/components/terminal/TerminalComponent.vue:106:  initialData: props.terminalConfig.initialData || terminalDefaults.initialData,
app/components/terminal/TerminalComponent.vue:117:  if (terminalElement.value) {
app/components/terminal/TerminalComponent.vue:119:    terminalElement.value.style.zIndex = (Date.now() % 2147483647).toString();
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
app/components/terminal/TerminalComponent.vue:330:  position: fixed;
app/components/terminal/TerminalComponent.vue:333:  z-index: 1000;
app/components/terminal/TerminalComponent.vue:340:  border: 1px solid var(--border-terminal);
app/components/terminal/TerminalComponent.vue:342:  box-shadow: var(--glow-terminal);
app/components/terminal/TerminalComponent.vue:345:    position: relative;
app/components/terminal/TerminalComponent.vue:346:    z-index: 1;
app/components/terminal/TerminalComponent.vue:357:    .terminal-dots {
app/components/terminal/TerminalComponent.vue:385:    .terminal-dot {
app/components/terminal/TerminalComponent.vue:392:    .terminal-dot--min {
app/components/terminal/TerminalComponent.vue:396:    .terminal-dot--max {
app/components/terminal/TerminalComponent.vue:402:      position: absolute;
app/components/terminal/TerminalComponent.vue:423:    background: var(--bg-terminal);
app/components/terminal/TerminalComponent.vue:477:    .terminal-response {
app/components/terminal/TerminalComponent.vue:498:    .terminal-body {
app/components/terminal/TerminalComponent.vue:499:      background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
app/components/terminal/TerminalComponent.vue:507:    position: absolute;
app/components/terminal/TerminalComponent.vue:549:      // --color-dark est redéfini localement ci-dessus (le bloc `.terminal` qui exposait

exec
/bin/zsh -lc "nl -ba app/components/HexagonLinkComponent.vue | sed -n '1,120p'; nl -ba app/pages/index.vue | sed -n '760,810p'; nl -ba app/components/FooterComponent.vue | sed -n '130,230p'; rg -n -C 4 \"transform: translateY\\(-2px\\)|transform: translateY\\(-1px\\)|@media \\(prefers-reduced-motion\" app/components app/pages | sed -n '1,260p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	<template>
     2	  <ZExternalLink class="hex" :href="link" rel="noopener noreferrer">
     3	    <slot name="icon" />
     4	    <span class="hex__label"><slot name="title" /></span>
     5	  </ZExternalLink>
     6	</template>
     7	
     8	<script setup lang="ts">
     9	// Lien social en hexagone — motif patrimonial du footer/contact, restylé DS (story 2.8).
    10	// Hexagone via clip-path (cf. kit.css .hex) ; glyphe en currentColor (ZIcon, story 2.7).
    11	defineProps<{
    12	  /** URL externe (réseau social). */
    13	  link: string;
    14	}>();
    15	</script>
    16	
    17	<style lang="scss" scoped>
    18	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) */
    19	.hex {
    20	  display: inline-flex;
    21	  align-items: center;
    22	  justify-content: center;
    23	  width: 46px;
    24	  height: 53px;
    25	  font-size: 20px; // dimensionne le glyphe ZIcon (1em)
    26	  color: var(--text-strong);
    27	  cursor: pointer;
    28	  background: var(--surface-3);
    29	  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
    30	  transition:
    31	    color var(--dur-base) var(--ease-standard),
    32	    background var(--dur-base) var(--ease-standard),
    33	    transform var(--dur-base) var(--ease-standard);
    34	
    35	  &:hover {
    36	    color: var(--ink-on-accent);
    37	    background: var(--accent);
    38	    transform: translateY(-2px);
    39	  }
    40	
    41	  &:focus-visible {
    42	    outline: 2px solid var(--accent);
    43	    outline-offset: 2px;
    44	  }
    45	}
    46	
    47	// Libellé accessible (lecteurs d'écran) — masqué visuellement.
    48	.hex__label {
    49	  position: absolute;
    50	  width: 1px;
    51	  height: 1px;
    52	  margin: -1px;
    53	  padding: 0;
    54	  overflow: hidden;
    55	  white-space: nowrap;
    56	  border: 0;
    57	  clip-path: inset(50%);
    58	}
    59	
    60	@media (prefers-reduced-motion: reduce) {
    61	  .hex {
    62	    transition: none;
    63	  }
    64	}
    65	</style>
   760	
   761	.stat {
   762	  padding: var(--space-6);
   763	  background: color-mix(in srgb, var(--surface-1) 85%, transparent);
   764	  border: 1px solid var(--border-subtle);
   765	  border-radius: var(--radius-md);
   766	  box-shadow: var(--shadow-2);
   767	  backdrop-filter: blur(8px);
   768	  transition:
   769	    border-color var(--dur-fast) var(--ease-standard),
   770	    transform var(--dur-fast) var(--ease-standard);
   771	
   772	  &:hover {
   773	    border-color: var(--border-strong);
   774	    transform: translateY(-2px);
   775	  }
   776	
   777	  b {
   778	    display: block;
   779	    margin-bottom: var(--space-2);
   780	    font-family: var(--font-mono);
   781	    font-size: clamp(var(--fs-4xl), 4.5vw, var(--fs-5xl));
   782	    font-weight: var(--fw-bold);
   783	    line-height: 1;
   784	    letter-spacing: var(--ls-tight);
   785	    color: var(--text-strong);
   786	  }
   787	
   788	  span {
   789	    font-family: var(--font-mono);
   790	    font-size: var(--fs-sm);
   791	    letter-spacing: var(--ls-wide);
   792	    color: var(--text-muted);
   793	  }
   794	}
   795	
   796	// ---- Section Journal (porté de Home - Awwwards.html .journal) ----
   797	.block__head--row {
   798	  display: flex;
   799	  align-items: flex-end;
   800	  justify-content: space-between;
   801	  gap: var(--space-6);
   802	  margin-bottom: var(--space-8);
   803	
   804	  .section__title {
   805	    margin-bottom: 0;
   806	  }
   807	}
   808	
   809	.seeall {
   810	  display: inline-flex;
   130	  }
   131	}
   132	
   133	.ftr__tagline {
   134	  margin: 0;
   135	  font-size: var(--fs-sm);
   136	  color: var(--text-body);
   137	}
   138	
   139	.ftr__col {
   140	  display: flex;
   141	  flex-direction: column;
   142	}
   143	
   144	.ftr__title {
   145	  margin: 0 0 var(--space-3);
   146	  font-family: var(--font-mono);
   147	  font-size: var(--fs-xs);
   148	  font-weight: var(--fw-medium);
   149	  letter-spacing: var(--ls-wider);
   150	  text-transform: uppercase;
   151	  color: var(--accent);
   152	}
   153	
   154	.ftr__list {
   155	  display: flex;
   156	  flex-direction: column;
   157	  padding: 0;
   158	  margin: 0;
   159	  list-style: none;
   160	}
   161	
   162	.ftr__link {
   163	  display: block;
   164	  padding: var(--space-1) 0;
   165	  font-family: var(--font-mono);
   166	  font-size: var(--fs-sm);
   167	  color: var(--text-strong);
   168	  text-decoration: none;
   169	  transition:
   170	    color var(--dur-fast) var(--ease-standard),
   171	    transform var(--dur-fast) var(--ease-standard);
   172	
   173	  &:hover {
   174	    color: var(--accent);
   175	    transform: translateX(2px);
   176	  }
   177	
   178	  // Anneau de focus DS (les liens du footer n'avaient que l'outline UA par défaut).
   179	  &:focus-visible {
   180	    outline: 2px solid transparent; // forced-colors : rendu en couleur système
   181	    outline-offset: 2px;
   182	    border-radius: var(--radius-xs);
   183	    box-shadow: var(--ring-accent);
   184	  }
   185	
   186	  &--static {
   187	    color: var(--text-body);
   188	    cursor: default;
   189	
   190	    &:hover {
   191	      color: var(--text-body);
   192	      transform: none;
   193	    }
   194	  }
   195	}
   196	
   197	.ftr__bottom-bar {
   198	  width: 100%;
   199	  margin-top: var(--space-8);
   200	  border-top: 1px solid var(--border-default);
   201	}
   202	
   203	.ftr__bottom {
   204	  display: flex;
   205	  flex-wrap: wrap;
   206	  gap: var(--space-3);
   207	  justify-content: space-between;
   208	  align-items: center;
   209	  padding-block: var(--space-5);
   210	  font-family: var(--font-mono);
   211	  font-size: var(--fs-xs);
   212	  color: var(--text-body);
   213	}
   214	
   215	.ftr__cmd {
   216	  color: var(--term-green);
   217	  font-weight: var(--fw-medium);
   218	}
   219	
   220	@media (prefers-reduced-motion: reduce) {
   221	  .ftr__link {
   222	    transition: none;
   223	    transform: none !important;
   224	  }
   225	}
   226	</style>
app/components/HeaderComponent.vue-601-  gap: var(--space-2);
app/components/HeaderComponent.vue-602-  margin-top: var(--space-3);
app/components/HeaderComponent.vue-603-}
app/components/HeaderComponent.vue-604-
app/components/HeaderComponent.vue:605:@media (prefers-reduced-motion: reduce) {
app/components/HeaderComponent.vue-606-  .hdr__link,
app/components/HeaderComponent.vue-607-  .hdr__link::after,
app/components/HeaderComponent.vue-608-  .hdr__menu {
app/components/HeaderComponent.vue-609-    transition: none;
--
app/components/CurrentTime.vue-76-    opacity: 0;
app/components/CurrentTime.vue-77-  }
app/components/CurrentTime.vue-78-}
app/components/CurrentTime.vue-79-
app/components/CurrentTime.vue:80:@media (prefers-reduced-motion: reduce) {
app/components/CurrentTime.vue-81-  .current-time__colon,
app/components/CurrentTime.vue-82-  .current-time__colon--hidden {
app/components/CurrentTime.vue-83-    opacity: 1;
app/components/CurrentTime.vue-84-    transition: none;
--
app/components/FooterComponent.vue-216-  color: var(--term-green);
app/components/FooterComponent.vue-217-  font-weight: var(--fw-medium);
app/components/FooterComponent.vue-218-}
app/components/FooterComponent.vue-219-
app/components/FooterComponent.vue:220:@media (prefers-reduced-motion: reduce) {
app/components/FooterComponent.vue-221-  .ftr__link {
app/components/FooterComponent.vue-222-    transition: none;
app/components/FooterComponent.vue-223-    transform: none !important;
app/components/FooterComponent.vue-224-  }
--
app/pages/index.vue-465-  background: var(--success);
app/pages/index.vue-466-  box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 60%, transparent);
app/pages/index.vue-467-  animation: pulse-dot 2.2s infinite var(--ease-out);
app/pages/index.vue-468-
app/pages/index.vue:469:  @media (prefers-reduced-motion: reduce) {
app/pages/index.vue-470-    animation: none;
app/pages/index.vue-471-  }
app/pages/index.vue-472-}
app/pages/index.vue-473-
--
app/pages/index.vue-770-    transform var(--dur-fast) var(--ease-standard);
app/pages/index.vue-771-
app/pages/index.vue-772-  &:hover {
app/pages/index.vue-773-    border-color: var(--border-strong);
app/pages/index.vue:774:    transform: translateY(-2px);
app/pages/index.vue-775-  }
app/pages/index.vue-776-
app/pages/index.vue-777-  b {
app/pages/index.vue-778-    display: block;
--
app/pages/index.vue-1030-    grid-template-columns: 1fr;
app/pages/index.vue-1031-  }
app/pages/index.vue-1032-}
app/pages/index.vue-1033-
app/pages/index.vue:1034:@media (prefers-reduced-motion: reduce) {
app/pages/index.vue-1035-  .anim {
app/pages/index.vue-1036-    animation: none;
app/pages/index.vue-1037-  }
app/pages/index.vue-1038-
--
app/components/HexagonLinkComponent.vue-34-
app/components/HexagonLinkComponent.vue-35-  &:hover {
app/components/HexagonLinkComponent.vue-36-    color: var(--ink-on-accent);
app/components/HexagonLinkComponent.vue-37-    background: var(--accent);
app/components/HexagonLinkComponent.vue:38:    transform: translateY(-2px);
app/components/HexagonLinkComponent.vue-39-  }
app/components/HexagonLinkComponent.vue-40-
app/components/HexagonLinkComponent.vue-41-  &:focus-visible {
app/components/HexagonLinkComponent.vue-42-    outline: 2px solid var(--accent);
--
app/components/HexagonLinkComponent.vue-56-  border: 0;
app/components/HexagonLinkComponent.vue-57-  clip-path: inset(50%);
app/components/HexagonLinkComponent.vue-58-}
app/components/HexagonLinkComponent.vue-59-
app/components/HexagonLinkComponent.vue:60:@media (prefers-reduced-motion: reduce) {
app/components/HexagonLinkComponent.vue-61-  .hex {
app/components/HexagonLinkComponent.vue-62-    transition: none;
app/components/HexagonLinkComponent.vue-63-  }
app/components/HexagonLinkComponent.vue-64-}
--
app/components/card/ZCardBody.vue-29-    animation: fadeIn var(--dur-slower) var(--ease-out) forwards;
app/components/card/ZCardBody.vue-30-  }
app/components/card/ZCardBody.vue-31-}
app/components/card/ZCardBody.vue-32-
app/components/card/ZCardBody.vue:33:@media (prefers-reduced-motion: reduce) {
app/components/card/ZCardBody.vue-34-  section.content {
app/components/card/ZCardBody.vue-35-    animation: none;
app/components/card/ZCardBody.vue-36-  }
app/components/card/ZCardBody.vue-37-}
--
app/components/home/HomeAtmosComponent.vue-119-    transform: translate(-4vw, -6vh) scale(1.15);
app/components/home/HomeAtmosComponent.vue-120-  }
app/components/home/HomeAtmosComponent.vue-121-}
app/components/home/HomeAtmosComponent.vue-122-
app/components/home/HomeAtmosComponent.vue:123:@media (prefers-reduced-motion: reduce) {
app/components/home/HomeAtmosComponent.vue-124-  .aurora {
app/components/home/HomeAtmosComponent.vue-125-    animation: none;
app/components/home/HomeAtmosComponent.vue-126-  }
app/components/home/HomeAtmosComponent.vue-127-}
--
app/components/home/HomeBootOverlay.vue-247-    box-shadow: var(--ring-accent);
app/components/home/HomeBootOverlay.vue-248-  }
app/components/home/HomeBootOverlay.vue-249-}
app/components/home/HomeBootOverlay.vue-250-
app/components/home/HomeBootOverlay.vue:251:@media (prefers-reduced-motion: reduce) {
app/components/home/HomeBootOverlay.vue-252-  .boot {
app/components/home/HomeBootOverlay.vue-253-    display: none;
app/components/home/HomeBootOverlay.vue-254-  }
app/components/home/HomeBootOverlay.vue-255-}
--
app/components/home/HomeStackMarquee.vue-99-    transform: translateX(calc(-50% - var(--space-8) / 2));
app/components/home/HomeStackMarquee.vue-100-  }
app/components/home/HomeStackMarquee.vue-101-}
app/components/home/HomeStackMarquee.vue-102-
app/components/home/HomeStackMarquee.vue:103:@media (prefers-reduced-motion: reduce) {
app/components/home/HomeStackMarquee.vue-104-  .marquee {
app/components/home/HomeStackMarquee.vue-105-    mask-image: none;
app/components/home/HomeStackMarquee.vue-106-  }
app/components/home/HomeStackMarquee.vue-107-
--
app/components/home/HomeHeroTerminal.vue-383-  background: var(--prompt);
app/components/home/HomeHeroTerminal.vue-384-  animation: caret-blink 1s steps(1) infinite;
app/components/home/HomeHeroTerminal.vue-385-}
app/components/home/HomeHeroTerminal.vue-386-
app/components/home/HomeHeroTerminal.vue:387:@media (prefers-reduced-motion: reduce) {
app/components/home/HomeHeroTerminal.vue-388-  .prm__caret {
app/components/home/HomeHeroTerminal.vue-389-    animation: none;
app/components/home/HomeHeroTerminal.vue-390-  }
app/components/home/HomeHeroTerminal.vue-391-}
--
app/components/ui/ZButton.vue-232-  &:hover {
app/components/ui/ZButton.vue-233-    background: var(--accent-hover);
app/components/ui/ZButton.vue-234-    border-color: var(--accent-hover);
app/components/ui/ZButton.vue-235-    box-shadow: 0 0 16px color-mix(in srgb, var(--accent) 45%, transparent);
app/components/ui/ZButton.vue:236:    transform: translateY(-1px);
app/components/ui/ZButton.vue-237-  }
app/components/ui/ZButton.vue-238-
app/components/ui/ZButton.vue-239-  &:active {
app/components/ui/ZButton.vue-240-    background: var(--accent-active);
--
app/components/ui/ZButton.vue-251-
app/components/ui/ZButton.vue-252-  &:hover {
app/components/ui/ZButton.vue-253-    background: var(--surface-3);
app/components/ui/ZButton.vue-254-    border-color: var(--border-strong);
app/components/ui/ZButton.vue:255:    transform: translateY(-1px);
app/components/ui/ZButton.vue-256-  }
app/components/ui/ZButton.vue-257-
app/components/ui/ZButton.vue-258-  &:active {
app/components/ui/ZButton.vue-259-    transform: translateY(0);
--
app/components/ui/ZButton.vue-267-
app/components/ui/ZButton.vue-268-  &:hover {
app/components/ui/ZButton.vue-269-    background: var(--surface-2);
app/components/ui/ZButton.vue-270-    color: var(--text-strong);
app/components/ui/ZButton.vue:271:    transform: translateY(-1px);
app/components/ui/ZButton.vue-272-  }
app/components/ui/ZButton.vue-273-}
app/components/ui/ZButton.vue-274-
app/components/ui/ZButton.vue-275-.zbtn--terminal {
--
app/components/ui/ZButton.vue-282-    border-color: var(--term-green);
app/components/ui/ZButton.vue-283-    box-shadow:
app/components/ui/ZButton.vue-284-      0 0 18px color-mix(in srgb, var(--term-green) 45%, transparent),
app/components/ui/ZButton.vue-285-      var(--glow-terminal);
app/components/ui/ZButton.vue:286:    transform: translateY(-1px);
app/components/ui/ZButton.vue-287-  }
app/components/ui/ZButton.vue-288-}
app/components/ui/ZButton.vue-289-
app/components/ui/ZButton.vue-290-.zbtn--danger {
--
app/components/ui/ZButton.vue-300-    transform: translateY(1px);
app/components/ui/ZButton.vue-301-  }
app/components/ui/ZButton.vue-302-}
app/components/ui/ZButton.vue-303-
app/components/ui/ZButton.vue:304:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZButton.vue-305-  .zbtn,
app/components/ui/ZButton.vue-306-  .zbtn__inner {
app/components/ui/ZButton.vue-307-    transition: none;
app/components/ui/ZButton.vue-308-    transform: none !important;
--
app/components/ui/ZInput.vue-229-    height: 100%;
app/components/ui/ZInput.vue-230-  }
app/components/ui/ZInput.vue-231-}
app/components/ui/ZInput.vue-232-
app/components/ui/ZInput.vue:233:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZInput.vue-234-  .zinput,
app/components/ui/ZInput.vue-235-  .ztextarea {
app/components/ui/ZInput.vue-236-    transition: none;
app/components/ui/ZInput.vue-237-  }
--
app/components/ui/ZCard.vue-128-  cursor: pointer;
app/components/ui/ZCard.vue-129-
app/components/ui/ZCard.vue-130-  &:hover {
app/components/ui/ZCard.vue-131-    border-color: var(--border-strong);
app/components/ui/ZCard.vue:132:    transform: translateY(-2px);
app/components/ui/ZCard.vue-133-    box-shadow: var(--shadow-3), var(--shadow-hairline);
app/components/ui/ZCard.vue-134-  }
app/components/ui/ZCard.vue-135-
app/components/ui/ZCard.vue-136-  &:focus-visible {
--
app/components/ui/ZCard.vue-152-  border-color: var(--accent-ring);
app/components/ui/ZCard.vue-153-  box-shadow: var(--glow-accent), var(--shadow-hairline);
app/components/ui/ZCard.vue-154-}
app/components/ui/ZCard.vue-155-
app/components/ui/ZCard.vue:156:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZCard.vue-157-  .zcard {
app/components/ui/ZCard.vue-158-    transition: none;
app/components/ui/ZCard.vue-159-    transform: none !important;
app/components/ui/ZCard.vue-160-  }
--
app/components/ui/ZTag.vue-180-    box-shadow: var(--ring-accent);
app/components/ui/ZTag.vue-181-  }
app/components/ui/ZTag.vue-182-}
app/components/ui/ZTag.vue-183-
app/components/ui/ZTag.vue:184:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZTag.vue-185-  .ztag {
app/components/ui/ZTag.vue-186-    transition: none;
app/components/ui/ZTag.vue-187-  }
app/components/ui/ZTag.vue-188-}

exec
/bin/zsh -lc 'rg -n "routes|prerender|13|generate|routeRules" nuxt.config.ts .github docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md package.json | head -160; rg --files app/pages | sort' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
package.json:10:    "generate": "nuxi generate",
package.json:32:    "stylelint": "^17.13.0",
docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md:28:   **And** les routes cibles `/services`, `/about`, `/blog`, `/contact`, `/confidentialite` et `/mentions-legales` restent des pages autonomes, fonctionnelles et pré-rendues statiquement
docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md:39:   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript vue-tsc, et 13 routes statiques générées avec succès par Nitro.
docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md:50:  - [x] Valider que toutes les routes enfants (`/services`, `/about`, `/blog`, `/contact`, `/confidentialite`, `/mentions-legales`) sont joignables et rendent correctement leur contenu.
docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md:59:  - [x] Exécuter la commande de validation Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md:60:  - [x] Vérifier que les 13 routes statiques sont pré-rendues sans erreur ni avertissement par Nitro.
docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md:73:- **Environnement Docker STRICT :** Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker via `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. Ne jamais lancer `pnpm` sur la machine hôte macOS. [Source: AGENTS.md#Section 2]
docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md:92:- **Ne pas introduire de fausse One-Page :** La home est un portail vitrine commercial ; les liens du header et des cartes de services mènent vers les vraies routes multi-pages `/services`, `/about`, etc. Ne pas restaurer les ancres `#` issues du prototype `Home - Awwwards.html`.
docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md:94:- **Pas de framework de test non installé :** Le projet n'embarque pas Vitest ou Cypress dans ses dépendances actuelles. La barre de conformité logicielle s'appuie sur ESLint, Stylelint, vue-tsc, le prerender Nitro 13 routes et l'audit émulé OS-level.
docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md:103:- Gate finale 100% verte : 0 erreur ESLint / Stylelint, 0 erreur vue-tsc, 13 routes statiques Nitro pré-rendues en 2.84s.
docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md:107:- Navigation multi-pages auditée : aucune ancre interne `#` résiduelle sur la home, intégrité des routes `/services`, `/about`, `/blog`, `/contact`, `/confidentialite` et `/mentions-legales`, utilisation systématique de `<ZExternalLink>` pour tous les liens externes (`target="_blank"`).
docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md:110:- Gate Docker 100% verte validée (`corepack enable && pnpm lint && pnpm typecheck && pnpm generate`).
docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md:119:- 2026-09-13 : Implémentation et validation complète de la Story 11.5 (Harmonisation About.vue, soldage des différés 11.1, audit a11y & liens, Gate Docker verte). Statut passé à review.
docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md:120:- 2026-09-13 : Création de la spécification de la Story 11.5 (Validation transverse a11y, multi-pages, SSG Nitro & Gate Docker). Statut initialisé à ready-for-dev.
nuxt.config.ts:57:      // (cf. .env.example). Consommée par le composable useSiteUrl(). Valeur inlinée au prerender (`nuxi generate`).
.github/workflows/cd.yml:52:        run: pnpm generate
.github/workflows/cd.yml:55:      # .output/public par `nuxi generate`. La copie reste par sécurité (no-op si déjà présent).
app/pages/about.vue
app/pages/blog/[...slug].vue
app/pages/blog/index.vue
app/pages/confidentialite.vue
app/pages/contact.vue
app/pages/index.vue
app/pages/mentions-legales.vue
app/pages/services.vue

codex
- `HeaderComponent.vue` changes the header to `position: fixed` without reserving its height in the layout, so headings on `/services`, `/about`, `/blog`, and `/contact` can be hidden beneath it.

- The centered navigation and right-side actions remain visible between 901px and 1250px, creating likely collisions or horizontal overflow at tablet widths.

- The right-side status dock shares horizontal space with the header actions at wide widths but no space is reserved for it, allowing the dock to overlap the CTA buttons.

- `onScroll()` runs on every scroll event and repeatedly reads layout dimensions without throttling or `requestAnimationFrame`, undermining the claimed performance optimization.

- Scroll progress is not recalculated on viewport resize or orientation changes and is not clamped, so its width can become stale or exceed 100%.

- `onBrandClick()` prevents the default action for every click on the home route, including modified clicks intended to open the homepage in a new tab or window.

- The header and progress bar retain transitions under `prefers-reduced-motion: reduce`; only selected child transitions are disabled.

- The new logo instances use raw `<img>` elements instead of the mandatory `<NuxtImg>` primitive, bypassing the project’s image pipeline and violating the repository invariant.

- `CurrentTime.vue` hardcodes “Valognes” while `SITE.profile.city` is currently “Rouen, France”, producing factually incorrect accessible content.

- The static `aria-label` on the `<time>` element can replace the actual numeric clock value in the accessibility tree, so assistive technology may announce only “Heure locale de Valognes”.

- The clock colon now toggles every second, introducing a continuous non-caret animation despite the project rule that the terminal caret is the only permitted looping animation.

- Both the desktop dock clock and the mobile-menu clock remain mounted even when hidden, so multiple one-second intervals run unnecessarily on every page.

- The magnetic button implementation has no explicit `@media (hover: none)` guard, despite the acceptance criterion requiring the interaction to be disabled on non-hover devices.

- `ZButton` and `ZCard` sample `prefers-reduced-motion` only once during mount, so changing the operating-system preference while the page is open does not disable their JavaScript-driven motion.

- `ZButton` writes an inline `transform` on every mouse move, replacing the CSS hover transform and potentially destroying any transform supplied by a consumer through `style`.

- The new hover lift on `.stat` cards is not disabled in the local reduced-motion rules, so reduced-motion users still receive a transform jump when hovering statistics.

- The new hover lift on `.hex` links is likewise left active under reduced motion; its media query disables only the transition, not the transform itself.

- The statistics section was changed from `section section--sunken` to `section`, contradicting the story’s explicit requirement that the statistics be displayed in the sunken section treatment.

- The hero title uses `clamp(2.4rem, 5.2vw, 4.4rem)` and `line-height: 1.05` instead of the acceptance criterion’s `clamp(2.6rem, 6.4vw, 5.2rem)` and `line-height: 0.98`.

- The CTA uses an orange `color-mix()` halo instead of the specified `var(--accent-2-soft)` halo, and its title scale also differs from the documented acceptance values.

- Replacing Cypress with TestCafé in `SITE.skills` and the service copy conflicts with the existing Epic 11.3 acceptance criteria and specifications, which still define Cypress as part of the canonical stack.

- The new shadows, filters, pixel dimensions, and transition values in the polished components introduce additional hardcoded visual values despite the project’s token-only styling invariant.

- The story is marked `Status: review` while `sprint-status.yaml` marks Story 11.6 and Epic 11 as `done`, making the review state and project tracking inconsistent.

- The completion notes claim browser verification, accessibility validation, and successful generation without including screenshots, route output, or behavioral test evidence; the listed Docker gate cannot establish those visual and interaction claims.
tokens used
173 157
- `HeaderComponent.vue` changes the header to `position: fixed` without reserving its height in the layout, so headings on `/services`, `/about`, `/blog`, and `/contact` can be hidden beneath it.

- The centered navigation and right-side actions remain visible between 901px and 1250px, creating likely collisions or horizontal overflow at tablet widths.

- The right-side status dock shares horizontal space with the header actions at wide widths but no space is reserved for it, allowing the dock to overlap the CTA buttons.

- `onScroll()` runs on every scroll event and repeatedly reads layout dimensions without throttling or `requestAnimationFrame`, undermining the claimed performance optimization.

- Scroll progress is not recalculated on viewport resize or orientation changes and is not clamped, so its width can become stale or exceed 100%.

- `onBrandClick()` prevents the default action for every click on the home route, including modified clicks intended to open the homepage in a new tab or window.

- The header and progress bar retain transitions under `prefers-reduced-motion: reduce`; only selected child transitions are disabled.

- The new logo instances use raw `<img>` elements instead of the mandatory `<NuxtImg>` primitive, bypassing the project’s image pipeline and violating the repository invariant.

- `CurrentTime.vue` hardcodes “Valognes” while `SITE.profile.city` is currently “Rouen, France”, producing factually incorrect accessible content.

- The static `aria-label` on the `<time>` element can replace the actual numeric clock value in the accessibility tree, so assistive technology may announce only “Heure locale de Valognes”.

- The clock colon now toggles every second, introducing a continuous non-caret animation despite the project rule that the terminal caret is the only permitted looping animation.

- Both the desktop dock clock and the mobile-menu clock remain mounted even when hidden, so multiple one-second intervals run unnecessarily on every page.

- The magnetic button implementation has no explicit `@media (hover: none)` guard, despite the acceptance criterion requiring the interaction to be disabled on non-hover devices.

- `ZButton` and `ZCard` sample `prefers-reduced-motion` only once during mount, so changing the operating-system preference while the page is open does not disable their JavaScript-driven motion.

- `ZButton` writes an inline `transform` on every mouse move, replacing the CSS hover transform and potentially destroying any transform supplied by a consumer through `style`.

- The new hover lift on `.stat` cards is not disabled in the local reduced-motion rules, so reduced-motion users still receive a transform jump when hovering statistics.

- The new hover lift on `.hex` links is likewise left active under reduced motion; its media query disables only the transition, not the transform itself.

- The statistics section was changed from `section section--sunken` to `section`, contradicting the story’s explicit requirement that the statistics be displayed in the sunken section treatment.

- The hero title uses `clamp(2.4rem, 5.2vw, 4.4rem)` and `line-height: 1.05` instead of the acceptance criterion’s `clamp(2.6rem, 6.4vw, 5.2rem)` and `line-height: 0.98`.

- The CTA uses an orange `color-mix()` halo instead of the specified `var(--accent-2-soft)` halo, and its title scale also differs from the documented acceptance values.

- Replacing Cypress with TestCafé in `SITE.skills` and the service copy conflicts with the existing Epic 11.3 acceptance criteria and specifications, which still define Cypress as part of the canonical stack.

- The new shadows, filters, pixel dimensions, and transition values in the polished components introduce additional hardcoded visual values despite the project’s token-only styling invariant.

- The story is marked `Status: review` while `sprint-status.yaml` marks Story 11.6 and Epic 11 as `done`, making the review state and project tracking inconsistent.

- The completion notes claim browser verification, accessibility validation, and successful generation without including screenshots, route output, or behavioral test evidence; the listed Docker gate cannot establish those visual and interaction claims.
