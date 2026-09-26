# AGENTS.md — Directives & Contexte Projet pour Agents IA

Ce document constitue la **source de vérité universelle** pour tout agent IA (Claude, Gemini, Antigravity, BMAD, Cursor, Windsurf, Copilot, etc.) intervenant sur le dépôt **jouan.ovh**. Il consigne les règles critiques, l'architecture, l'environnement de développement et les invariants non négociables du projet.

---

## 1. Identité & État du Projet

- **Projet :** `jouan.ovh` — Portfolio, vitrine de services et blog de **Simon Jouan** (développeur Full Stack spécialisé en systèmes IA & automatisation métier).
- **URL de production :** [`https://jouan.ovh`](https://jouan.ovh) (déployé sur **GitHub Pages**, domaine custom, HTTPS Let's Encrypt forcé, DNS OVH).
- **Statut actuel :** **Repositionnement commercial V1.1 livré** (désancrage tarifaire, 3 niveaux d'intervention sur devis, section AI Care à partir de 250 € HT/mois, Blueprint en cadrage). Les Epics 1 à 15 sont livrés ; les six tâches de l'Epic 14 sont terminées, la rétrospective est enregistrée et la réconciliation documentaire est réconciliée mais non ratifiée, avec des réserves explicites dans `docs/implementation-artifacts/epic-14-checkpoint-2026-09-25.md`. Les huit réserves suivies (Google Search Console, couverture analytics, rétention des événements, inspection visuelle du rejeu, mesure d'effet AEO, synchronisation inter-onglets, chaîne d'approvisionnement CI, préflight SEO) sont détaillées avec leur propriétaire dans `docs/implementation-artifacts/epic-14-checkpoint-2026-09-25.md`. L'Epic 16 demeure en `backlog` jusqu'à la ratification du point de contrôle et des contrats éditoriaux. Le projet est en phase d'**exploitation, maintenance et évolutions ciblées (Run)**.
- **Langue & Voix (NFR6) :**
  - Interface et contenu en **FRANÇAIS** (`lang="fr"`).
  - Voix : **1re personne (« je »)** pour Simon, **vouvoiement** pour le visiteur/client.
  - **ZÉRO EMOJI** dans le contenu et l'UI (univers sobre et professionnel inspiré du terminal).

---

## 2. Règle d'Or d'Environnement : Docker Uniquement ⚠️

**L'intégralité du développement et de l'outillage DOIT s'exécuter dans le conteneur Docker.**

> ⚠️ **Ne JAMAIS exécuter `pnpm`, `npm`, `yarn` ou `nuxi` directement sur la machine hôte.**
> Les dépendances natives (`better-sqlite3`, `esbuild`, `sharp`...) sont compilées pour Linux dans un volume Docker isolé nommé `node_modules`. Exécuter des commandes sur l'hôte (macOS arm64) corromprait l'environnement.

### Commandes usuelles via Docker :

```sh
# Démarrer le serveur de développement (http://localhost:3000)
docker compose up

# Arrêter les conteneurs
docker compose down

# Lancer la suite de validation complète (Gate obligatoire avant commit)
docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"

# Commandes ponctuelles
docker compose run --rm web sh -c "corepack enable && pnpm lint"       # eslint + stylelint
docker compose run --rm web sh -c "corepack enable && pnpm typecheck"  # vérification TypeScript vue-tsc
docker compose run --rm web sh -c "corepack enable && pnpm generate"   # build statique SSG (routes publiques + articles)
docker compose run --rm web sh -c "corepack enable && pnpm add -D <pkg>" # ajout de dépendance
```

_Note SQLite / `@nuxt/content` :_ Lancer `pnpm generate` dans un conteneur séparé pendant que le serveur dev tourne peut invalider la base de contenu SQLite du dev. Si `/blog` affiche une erreur en dev, exécuter `docker compose restart web`.

---

## 3. Stack Technique & Versions

- **Framework :** Nuxt 4 (`^4.4.8`), SSR activé, cible de build **statique** (`nuxi generate` via Nitro).
- **Structure applicative :** Tout le code Nuxt vit sous **`app/`** (`srcDir = "app"` dans `nuxt.config.ts`).
- **UI / Composants :** Vue 3 avec **`<script setup lang="ts">`** obligatoire pour tout nouveau composant. (Plus aucun décorateur de classe ; le terminal a été intégralement migré en `script setup`).
- **Langage :** TypeScript `^6.0.3` en mode strict.
- **Styles :** SCSS (`sass ^1.101.0`) avec `@use ... as _alias` (jamais `@import`).
- **Tokens & Design System :** priorité au thème sombre avec thème clair « Papier technique / Crème solaire » et terminal sombre sanctuarisé. Tokens CSS exposés globalement sur `:root` dans `app/assets/scss/abstract/_root.scss`. Consommation via `var(--token)`.
- **Contenu :** `@nuxt/content ^3.14.0` (v3, stockage SQLite, collections typées dans `content.config.ts`).
- **Images :** `@nuxt/image ^2.0.0` (`<NuxtImg>` / `<NuxtPicture>`), jamais de balise `<img>` brute.
- **Linters :** ESLint 10 (flat config `@nuxt/eslint`), Prettier 3, Stylelint 17 (`stylelint-scss`).
- **Formulaire de contact :** Web3Forms (service tiers sans serveur), clé publique lue via `useRuntimeConfig().public.web3formsAccessKey`.
- **CI/CD :** GitHub Actions (`.github/workflows/cd.yml`) publiant automatiquement `.output/public` vers la branche `gh-pages` lors d'un push sur `main`.

---

## 4. Architecture & Arborescence Clé

```text
jouan.ovh/
├── app/
│   ├── assets/scss/
│   │   ├── abstract/        # Tokens, variables, mixins (_root.scss = source vérité CSS vars)
│   │   ├── base/            # _reset.scss, _layout.scss (primitives globales), _motion.scss
│   │   └── main.scss        # Point d'entrée SCSS global
│   ├── components/
│   │   ├── ui/              # Primitives DS auto-importées sans préfixe (ZButton, ZCard, ZExternalLink, ZCustomCursor...)
│   │   ├── card/            # Sous-blocs ZCardHeader, ZCardBody, ZCardFooter
│   │   ├── home/            # Composants immersifs d'accueil (HomeAtmosComponent, HomeBootOverlay, HomeHeroTerminal, HomeStackMarquee)
│   │   ├── terminal/        # Sous-système terminal draggable (TerminalComponent, TerminalManagerComponent)
│   │   │   └── programs/    # Classes TypeScript pures implémentant IProgram
│   │   ├── HeaderComponent.vue
│   │   ├── FooterComponent.vue
│   │   └── HexagonLinkComponent.vue
│   ├── composables/
│   │   ├── useSiteUrl.ts    # Source unique pour l'URL de base résolue via Nuxt Site Config
│   │   └── usePageSeo.ts    # Helper universel useSeoMeta, canonical et Schema.org / JSON-LD
│   ├── data/
│   │   └── site.ts          # SOURCE UNIQUE de vérité pour le profil, compétences et projets (SITE)
│   ├── layouts/
│   │   └── default.vue      # Layout principal
│   └── pages/               # routes publiques + articles dynamiques pré-rendus
│       ├── index.vue        # Accueil (Hero terminal, aperçu services, projets phares)
│       ├── services.vue     # Offres de freelance et déroulé du process en 4 étapes
│       ├── about.vue        # Biographie, timeline expériences/formations et stack
│       ├── contact/            # Pages Contact
│       │   ├── index.vue       # Formulaire Web3Forms et coordonnées
│       │   └── card.vue        # Carte de visite numérique
│       ├── confidentialite.vue # Politique de confidentialité RGPD
│       ├── mentions-legales.vue# Mentions légales
│       └── blog/
│           ├── index.vue    # Liste des articles du blog
│           └── [...slug].vue# Rendu Markdown d'article via <ContentRenderer>
├── content/
│   └── blog/                # Articles de blog au format Markdown
├── content.config.ts        # Schéma et validation Zod des collections @nuxt/content
├── nuxt.config.ts           # Configuration centrale Nuxt 4
├── server/plugins/
│   ├── seo-content.ts       # Réconciliation Content/Sitemap après fusion des sources
│   └── ai-ready-markdown.ts # Nettoyage contrôlé des exports Markdown AI Ready
├── public/
│   ├── CNAME                # Domaine de production officiel (contient "jouan.ovh")
│   ├── _headers             # En-têtes HTTP de sécurité pour gh-pages
│   └── images/              # Assets statiques optimisés
├── .github/workflows/cd.yml # Pipeline CI/CD GitHub Actions
└── docs/                    # Documentation projet, specs, artifacts de planning et d'implémentation
```

---

## 5. Invariants & Règles d'Implémentation Critiques

### 1. URLs et Domaines : Jamais de Hardcoding

- **Règle :** Ne **JAMAIS** écrire en dur `https://jouan.ovh` ou `https://dev.jouan.ovh` dans le code applicatif ou les métadonnées.
- **Pattern :** Toujours injecter l'URL via le composable `useSiteUrl()`. Ce composable lit `useSiteConfig().url`, alimenté au build par `NUXT_SITE_URL` (avec `NUXT_SITE_NAME` et `NUXT_SITE_ENV`). `runtimeConfig.public.siteUrl` et `NUXT_PUBLIC_SITE_URL` ne sont plus des sources SEO.
- **SEO :** Utiliser systématiquement `usePageSeo({ title, description, path, ... })` pour garantir l'unicité des canonicals et des balises OpenGraph/Twitter.

### 2. Contenu Partagé : DRY Strict

- **Règle :** Ne **JAMAIS** re-hardcoder le nom, la bio, la ville, l'email ou les projets dans une page ou un programme terminal.
- **Pattern :** Consommer `SITE.profile`, `SITE.skills` ou `SITE.projects` depuis `app/data/site.ts`.

### 3. Tokens & Primitives de Layout SCSS

- **No Hardcode :** Aucune couleur, rayon, ombre ou marge en dur. Toujours consommer les variables globales `var(--token)`.
- **Primitives globales :** Les classes de mise en page `.section`, `.section--sunken`, `.container`, `.eyebrow`, `.prose`, `.hero__tags` vivent dans `app/assets/scss/base/_layout.scss`. **Ne JAMAIS les redéclarer dans un `<style scoped>` de page**.
- **Piège du padding multi-classes :** Lorsqu'un élément cumule `.container` et une classe locale (ex. `.hero__in.container`), ne **JAMAIS** utiliser le raccourci `padding: ...`. Utiliser impérativement les propriétés logiques **`padding-inline`** et **`padding-block`** pour éviter l'écrasement mutuel des axes.

### 4. Accessibilité (a11y) dès la Conception

- **Liens externes :** TOUT lien ouvrant un nouvel onglet (`target="_blank"`) DOIT utiliser la primitive **`<ZExternalLink>`** (`app/components/ui/ZExternalLink.vue`). Elle impose `rel="noopener"` et injecte le libellé masqué accessible `(ouvre dans un nouvel onglet)`.
- **Hiérarchie de titres :** Tout libellé de section eyebrow ouvrant une section sans titre h2 propre doit être un **`<h2 class="eyebrow">`** (le style neutralisé hérite de `font-weight`/`line-height` pour une parité visuelle stricte). Les préfixes décoratifs `// ` doivent être encapsulés dans `<span aria-hidden="true">// </span>`.
- **Séquences :** Toute répétition de cartes ou étapes doit être balisée en listes sémantiques **`<ul>` ou `<ol>` avec `<li>`** (avec `> li { display: flex }` si cartes flex).
- **Contraste forcé (`forced-colors`) :** Tout élément interactif au focus doit intégrer le repli inline standard `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` pour rester visible en mode contraste élevé système.
- **Motion réduit :** Respect universel de `prefers-reduced-motion: reduce`. Le caret natif du terminal est la **seule animation en boucle autorisée** sur le site (CAP-11). Les carets décoratifs doivent être figés visibles.
- **Raccourcis clavier :** La touche `Échap` ferme la fenêtre terminal et restitue automatiquement le focus à l'élément déclencheur.

### 5. Nuxt 4 Gotchas

- **`<component :is="...">` :** Passer un nom de composant en chaîne de caractères (`:is="'NuxtLink'"`) **ne résout pas** l'auto-import Nuxt. Il faut importer explicitement la référence depuis `#components` (`import { NuxtLink } from "#components"`) et la lier comme valeur.
- **Prerender compatibility :** Le site étant statique, aucun accès direct à `window`, `document` ou `localStorage` n'est toléré en dehors du hook `onMounted` ou d'une garde `import.meta.client`.
- **Génération d'IDs :** Toujours utiliser `useId()` de Nuxt/Vue pour générer des attributs `id` de formulaires hydration-safe.

### 6. Pipeline CI/CD & Déploiement

- Le fichier `public/CNAME` contient **`jouan.ovh`**. Ne jamais le modifier ou le supprimer.
- Le step `Verify static output` dans `.github/workflows/cd.yml` vérifie `grep -qx "jouan.ovh" .output/public/CNAME`. Tout changement de domaine doit être répercuté simultanément sur ces deux fichiers.

### 7. Composants Immersifs, Canvas & WebGL (Acquis Epic 11)

- **Cycle de vie client strict :** Tout accès WebGL, animation canvas ou écouteur de souris (`mousemove`, `resize`, `scroll`) DOIT être instancié dans `onMounted()` et obligatoirement démonté/nettoyé dans `onBeforeUnmount()`.
- **Résilience WebGL :** Toujours écouter l'événement `webglcontextlost` sur le canvas et basculer gracieusement vers le repli CSS pur sans interrompre la navigation.
- **Économie de ressources :** Mettre en pause les boucles de rendu (`requestAnimationFrame`) lorsque l'onglet est masqué via l'API `document.visibilitychange`.
- **Neutralisation universelle :** Tout effet cinétique (auroras, 3D tilt sur `ZCard`, magnétisme sur `ZButton`, micro-curseur) doit être strictement désactivé sous `prefers-reduced-motion: reduce` et sous `@media (hover: none)`.

### 8. Fidélité Visuelle & Spécifications (Accords Rétro Epic 11)

- **Spécifications complètes dès la rédaction :** Toute nouvelle tâche d'interface doit stipuler les contraintes de rendu spatial (dimensions, échelles `clamp`, transparences, gestion de l'arrière-plan d'ambiance) directement dérivées de la maquette cible.
- **Revue visuelle obligatoire :** L'obtention d'une barre de validation verte (analyse statique et génération) est une condition nécessaire mais NON suffisante pour valider une tâche d'interface. Un contrôle visuel comparatif (navigateur / captures) est obligatoire avant clôture.

### 9. Propriété des surfaces partagées (Epic 14)

- `useSiteUrl()` et `usePageSeo()` restent les propriétaires de l'origine, des canonicals et des métadonnées SEO ; `@nuxtjs/sitemap`, `@nuxtjs/robots` et `nuxt-ai-ready` sont les propriétaires uniques de leurs artefacts.
- Toute évolution T0 du blog ne doit créer ni second sitemap, ni second robots, ni seconde projection AEO, ni nouvel événement ou nouvelle propriété de télémétrie sans revue de vie privée explicite.
- Les artefacts AEO et la politique d'exploration sont vérifiés en production ; cette vérification ne vaut ni certification Google Search Console, ni mesure d'effet AEO, ni garantie de citation ou de classement.
- Les réserves du point de contrôle Epic 14 sont suivies dans `docs/implementation-artifacts/epic-14-checkpoint-2026-09-25.md`. L'Epic 16 reste bloqué jusqu'à la ratification de ce point de contrôle et des contrats D-01 à D-08.

---

## 6. Liste de contrôle de validation qualité (définition de terminé)

Avant de soumettre tout changement ou de clore une tâche, l'agent IA doit exécuter et valider :

1. **Gate Docker verte à 100 % :**
   ```sh
   docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
   ```
   - 0 erreur ESLint / Stylelint.
   - 0 erreur TypeScript vue-tsc.
   - Routes publiques, articles et artefacts SEO/AEO pré-rendus avec succès par Nitro ; les assertions CI contrôlent `llms.txt`, `llms-full.txt`, les jumeaux `.md`, les liens alternatifs et les budgets.
2. **Vérification visuelle & comportementale :**
   - Contrôle visuel comparatif sur navigateur (desktop et mobile) conforme à la maquette cible.
   - Rendu fidèle au Design System (thème sombre aubergine, thème clair « Papier technique », orange accent, typographie Ubuntu ; terminal sanctuarisé).
   - Navigation clavier fonctionnelle (focus visible, ordre logique).
   - Pas de valeurs CSS en dur non justifiées.

---

## 7. Documents de Référence Complémentaires

- [`docs/project-context.md`](file:///Users/simon/dev/jouan.ovh/docs/project-context.md) : Historique détaillé, leçons apprises par épic et règles fines.
- [`docs/implementation-artifacts/sprint-status.yaml`](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/sprint-status.yaml) : Registre officiel des stories et de leur statut.
- [`docs/planning-artifacts/epics.md`](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md) : cahier des charges et critères d'acceptation des Epics 1 à 16 ; les critères historiques supersédés restent explicites et ne doivent pas être réinterprétés silencieusement.
- [`docs/implementation-artifacts/deferred-work.md`](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/deferred-work.md) : Inventaire des arbitrages et améliorations futures optionnelles.
