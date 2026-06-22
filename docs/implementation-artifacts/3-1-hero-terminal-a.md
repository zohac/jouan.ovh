---
baseline_commit: d010077872a594a62da828f5aec69abf29ed3f0d
---

# Story 3.1: Hero Terminal (A)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur du site jouan.ovh,
I want un hero d'accueil en style terminal,
so that je perçois immédiatement l'identité de marque (« OS de nuit », Ubuntu/terminal) dès l'arrivée sur la page.

## Acceptance Criteria

1. **Given** la direction de hero Terminal (A) de `Home.jsx`, **When** on implémente le hero sur `/`, **Then** le hero rend en style terminal (prompt, caret, accroche française 1re personne).
2. **Given** la même implémentation, **When** le visiteur voit le hero, **Then** un CTA principal mène à un parcours clé (ex. contact/about).

## Tasks / Subtasks

- [x] Tâche 1 — Refondre `pages/index.vue` pour accueillir le hero Terminal (A) (AC: #1)
  - [x] Retirer l'ancien hero (`WindowWrapperComponent` + image `undraw_programming`) — il sera remplacé par le hero terminal
  - [x] Mettre en place la structure `<section class="hero hero__grad">` → `.hero__in.container` → `.hero__grid` à deux colonnes (texte à gauche, fenêtre terminal à droite), conforme à `kit.css` (`.hero__grid { grid-template-columns: 1.05fr 0.95fr; }`)
  - [x] Colonne gauche : eyebrow `// développeur web freelance`, titre `<h1>` avec `<em>` sur les mots accentués (orange via `.hero h1 em`), sous-titre `S.tagline`, zone CTA, zone tags
  - [x] Colonne droite : fenêtre terminal stylée (réutiliser le `TerminalWindow`/`Prompt` du DS portés en Epic 2 si disponibles, sinon voir Dev Notes)
- [x] Tâche 2 — Accroche et contenu français 1re personne (AC: #1)
  - [x] Titre : `Du code sur-mesure, de l'IA utile.` (`sur-mesure` et `utile` en `<em>` accent orange) — repris de `Home.jsx`
  - [x] Sous-titre = `tagline` de `data.js` : « Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils. » (1re personne « je », vouvoiement, pas d'emoji)
  - [x] Eyebrow : `// développeur web freelance`
- [x] Tâche 3 — Bloc terminal avec prompt + caret (AC: #1)
  - [x] Reproduire le contenu terminal de `HeroTerminal` (`Home.jsx`) : titre fenêtre `anon.@jouan.ovh: ~`, puis suite de lignes :
    - `whoami` → `Simon Jouan — Développeur web freelance`
    - `cat stack.txt` → `PHP/Symfony · WordPress · Node/Nest · Nuxt` (couleur `--term-blue`)
    - `ls ~/projets` → `keova.app/   patio-conseil.fr/` (couleur `--term-green`)
    - dernière ligne `help` avec **caret clignotant** (`caret`), cliquable pour ouvrir l'easter-egg terminal
  - [x] Le prompt suit le format DS `anon.@jouan.ovh:~$ <commande>` (réf. `Prompt.jsx` / `Prompt.d.ts`) ; le caret clignotant est la **seule** animation en boucle
  - [x] Le clic sur la dernière ligne ouvre l'easter-egg terminal existant (déléguer au gestionnaire terminal ; voir Dev Notes — si l'API d'ouverture n'est pas encore exposée, câbler a minima un handler no-op et noter la dépendance vers Epic 8)
- [x] Tâche 4 — CTA principal + secondaire + tags (AC: #2)
  - [x] CTA principal : `ZButton` variante `primary` (orange), taille `lg`, libellé `Démarrer un projet`, icône flèche à droite → `NuxtLink`/navigation vers `/contact`
  - [x] CTA secondaire : `ZButton` variante `secondary`, taille `lg`, libellé `Voir les services` → `/services`
  - [x] Rangée de tags `ZTag` : `php`, `symfony`, `wordpress`, `nest.js`, `nuxt.js` (réf. `Home.jsx`)
- [x] Tâche 5 — Styles & responsive (AC: #1)
  - [x] Porter les classes layout du hero (`.hero`, `.hero__grad`, `.hero__in`, `.hero__grid`, `.hero h1`, `.hero__sub`, `.hero__cta`, `.hero__tags`) depuis `kit.css` vers le SCSS scoped de la page (ou un partial `pages/`), **en consommant les tokens** (aucune valeur hardcodée)
  - [x] Sur mobile (`max-width: 720px` dans `kit.css`), `.hero__grid` passe en une seule colonne et `.hero h1` réduit à `--fs-4xl`
- [x] Tâche 6 — Vérification prerender & qualité (AC: #1, #2)
  - [x] Tout accès DOM lié au terminal est gardé (`onMounted` / `import.meta.client`) — compatibilité `nuxi generate`
  - [x] `yarn dev` charge `/` sans erreur ; `yarn lint` ne régresse pas

### Review Findings

_Revue de code 2026-06-22 (baseline `d010077` → `79f1019`) — couches Blind Hunter, Edge Case Hunter, Acceptance Auditor. 2 decision-needed, 2 patch, 0 defer, 13 dismissed._

- [x] [Review][Patch] (ex-Decision D1 — résolu : garder le payload, nettoyer les décorations) Traiter l'a11y du terminal décoratif — conserver les sorties lisibles (nom/stack/projets) mais passer en `aria-hidden` les lignes de prompt décoratives (`anon.@jouan.ovh:~$ <cmd>`) et le caret, pour une lecture cohérente par les lecteurs d'écran. `app/pages/index.vue` (`.hero-term__body`). [blind+auditor]
- [x] [Review][Patch] (ex-Decision D2 — résolu : ajouter un token) Ajouter un token aubergine ~60 % de saturation dans `_root.scss` et l'utiliser dans `.hero__grad` pour retrouver la fidélité `kit.css` tout en restant tokens-only. `app/assets/scss/abstract/_root.scss` + `app/pages/index.vue` (`.hero__grad`). [auditor]
- [x] [Review][Patch] Pas de désenregistrement du lanceur terminal au démontage (asymétrie cycle de vie) [app/composables/useTerminal.ts:18 / app/components/HeaderComponent.vue:180] — `register()` appelé en `onMounted` sans `unregister` en `onBeforeUnmount` ; `launcher` est un singleton module. Impact réel faible (header persistant, optional chaining = no-op sûr) mais dette d'hygiène. Fix : `unregister(fn)` (ne nullifier que si `launcher.value === fn`) appelé au démontage. [blind+edge]
- [x] [Review][Patch] Clé `v-for` basée sur le contenu (`row.cmd`) — fragile si une commande se répète [app/pages/index.vue:`terminalRows` v-for] — `cmd` uniques aujourd'hui (tableau statique, aucun bug actuel) mais keyer sur une chaîne de contenu casse le diffing Vue en cas de doublon. Fix : `:key` sur l'index ou un id stable. [blind+edge]

## Dev Notes

### Contexte & contraintes (depuis project-context.md et SPEC)

- **Dark-first uniquement**, aucun thème clair ; **orange Ubuntu = unique accent héros** (NFR1). Le `<em>` du titre et le CTA primaire portent l'accent. [Source: docs/project-context.md#À préserver pendant la refonte ; docs/planning-artifacts/epics.md#NonFunctional Requirements (NFR1)]
- **Aucune valeur de couleur/espace/rayon hardcodée** (NFR2) : passer par les tokens portés en Epic 2 (`assets/scss/abstract/`) et/ou CSS vars (`var(--accent)`, `var(--space-*)`, `var(--fs-*)`, `var(--term-blue)`, `var(--term-green)`, `var(--prompt)`). [Source: docs/project-context.md#SCSS]
- **Port, pas copie** (NFR3) : ne PAS copier le `.jsx`. Recréer en Vue 3 `<script setup lang="ts">` + SCSS `@use` (jamais `@import`). [Source: docs/project-context.md#Règles critiques à ne pas manquer]
- **Langue & voix** (NFR6) : français, 1re personne « je », vouvoiement, **pas d'emoji**. [Source: docs/project-context.md#Langue]
- **Typo signature** (NFR7) : Ubuntu Mono pour titres/labels/code (le prompt, l'eyebrow, les tags), Ubuntu sans pour le corps long (`.hero__sub` utilise déjà `--font-sans`). [Source: docs/planning-artifacts/epics.md#NonFunctional Requirements (NFR7)]
- **Compatibilité prerender** (NFR4) : site statique `nuxi generate`, gardes DOM obligatoires. [Source: docs/project-context.md#Nuxt]
- **Motion** : `prefers-reduced-motion` respecté ; seule boucle = le caret du terminal. La ref `Prompt.jsx` désactive déjà l'animation du caret sous `prefers-reduced-motion: reduce`. [Source: docs/project-context.md#À préserver ; docs/design_system/components/terminal/Prompt.jsx]

### Dépendances (épics antérieurs — OK)

- **Epic 1 (migration Nuxt 4)** doit être vert avant cette story (NFR8). [Source: docs/planning-artifacts/epics.md#NonFunctional Requirements (NFR8)]
- **Epic 2 (fondations DS)** fournit : tokens (`2.1`/`2.2`), `ZButton` (`2.3`), `ZTag` (`2.5`), iconographie/`Icon.arrow` (`2.7`), et le style `TerminalWindow`/`Prompt` (livré en Epic 8 / réf. dans le kit). **Réutiliser ces primitives** — ne pas les redéfinir. [Source: docs/planning-artifacts/epics.md#Epic 2]
- ⚠️ Ne JAMAIS dépendre de stories futures. L'**ouverture** de l'easter-egg terminal (Epic 8, stories 8.1/8.2) n'est pas requise par les AC de cette story : si le hook d'ouverture n'existe pas encore, câbler un handler neutre et documenter la dépendance, sans bloquer.

### Fichiers à modifier / créer

- **`pages/index.vue`** (UPDATE — à refondre) — état actuel : ancien hero `WindowWrapperComponent` + image `undraw_programming_re_kg9v.svg`, styles scoped legacy (`fs-5x`, `hero-banner`…). À **remplacer** par le hero Terminal (A). Le `<script>` actuel utilise `defineComponent({ name: "Home" })` + `defineProps`-like `getAttr` — passer en `<script setup lang="ts">` propre. [Source: pages/index.vue]
- **Primitives consommées** (déjà créées en Epic 2, ne pas recréer) : `ZButton.vue`, `ZTag.vue`, le composant terminal stylé (`TerminalWindow`/`Prompt`).
- **SCSS** : styles scoped dans `pages/index.vue` ou partial sous `assets/scss/pages/` (architecture `abstract/ base/ components/ pages/`). [Source: docs/project-context.md#Organisation]

### Mapping depuis Home.jsx → Vue (composant `HeroTerminal`)

| Élément `Home.jsx` | Cible Vue |
|---|---|
| `<section className="hero hero__grad">` | `<section class="hero hero__grad">` |
| `.hero__in.container` / `.hero__grid` | idem (classes layout portées du `kit.css`) |
| `<p className="eyebrow">// développeur web freelance</p>` | eyebrow Ubuntu Mono |
| `<h1>Du code <em>sur-mesure</em>,<br />de l'IA <em>utile</em>.</h1>` | `<h1>` avec `<em>` accent |
| `<p className="hero__sub">{S.tagline}</p>` | sous-titre = `tagline` data |
| `<Button variant="primary" size="lg" iconRight={arrow} onClick={() => go("contact")}>Démarrer un projet</Button>` | `ZButton` primary lg → `/contact` |
| `<Button variant="secondary" size="lg" onClick={() => go("services")}>Voir les services</Button>` | `ZButton` secondary lg → `/services` |
| `["php","symfony","wordpress","nest.js","nuxt.js"].map(t => <Tag>{t}</Tag>)` | `ZTag` × 5 |
| `<TerminalWindow title="anon.@jouan.ovh: ~" height={300}>` | composant terminal stylé du DS |
| `<Prompt command="whoami" />` + sortie | lignes prompt + sorties colorées (voir Tâche 3) |
| `<span onClick={openTerminal}><Prompt command="help" caret /></span>` | ligne `help` caret, clic → ouverture terminal |

### Contenu (source `data.js` / `window.SITE`)

- `role` : « Développeur web freelance »
- `tagline` : « Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils. »
- Lignes terminal (codées en dur côté template, fidèles à `Home.jsx`) : `whoami`, `cat stack.txt`, `ls ~/projets`, `help`.
- ⚠️ Ne pas inventer d'autres chiffres/projets ici — stats & projets sont les stories 3.2 / 3.3.

### Pièges / régressions à éviter

- **Réutiliser** `ZButton`/`ZTag` (Epic 2) — ne pas réécrire de boutons/tags ad hoc. [Source: docs/planning-artifacts/epics.md#Epic 2]
- **Ne rien hardcoder** : couleurs (`--accent`, `--term-blue`, `--term-green`, `--prompt`), espaces, rayons, tailles de police via tokens. [Source: docs/project-context.md#SCSS]
- **Caret = seule animation en boucle** ; respecter `prefers-reduced-motion`. [Source: docs/project-context.md#À préserver]
- **Prerender** : pas d'accès `window`/`document` hors garde. Le handler d'ouverture du terminal ne doit pas casser `nuxi generate`.
- **`@import` interdit** en SCSS — `@use ... as _alias` uniquement. [Source: docs/project-context.md#SCSS]
- Ne pas réintroduire l'image `undraw` ni `WindowWrapperComponent` dans le hero refondu.

### Project Structure Notes

- Page d'accueil = `pages/index.vue` (route `/`), layout `layouts/default.vue` (header/footer fixes refondus en Epic 2). Auto-import des composants actif. [Source: docs/project-context.md#Nuxt]
- Aucune base de données / entité.

### Testing standards

- Pas de framework de test. Validation = `yarn lint` (eslint + stylelint, ne pas dégrader) + **`yarn dev` charge `/` sans erreur** + rendu fidèle à `Home.jsx`. La validation `yarn generate` globale relève d'Epic 1 (story 1.4) mais le code de cette story doit rester prerender-safe. [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 3: Page d'accueil — Story 3.1: Hero Terminal (A)]
- [Source: docs/specs/spec-design-system-revamp/pages.md — ligne `/` (Home.jsx) ; Notes par page (Home)]
- [Source: docs/design_system/ui_kits/jouan-site/Home.jsx — fonction `HeroTerminal`]
- [Source: docs/design_system/ui_kits/jouan-site/data.js — `window.SITE` (role, tagline)]
- [Source: docs/design_system/ui_kits/jouan-site/kit.css — `.hero`, `.hero__grad`, `.hero__grid`, `.hero__sub`, `.hero__cta`, `.hero__tags`, `.eyebrow`]
- [Source: docs/design_system/components/terminal/Prompt.jsx, Prompt.d.ts, TerminalWindow.jsx]
- [Source: docs/project-context.md#Règles Langage & Framework, #À préserver pendant la refonte, #Pièges]
- [Source: pages/index.vue — état actuel à refondre]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.8 (1M context) — `claude-opus-4-8[1m]`

### Debug Log References

- `pnpm lint` (eslint + stylelint) : 0 erreur / 0 warning (via Docker).
- `pnpm typecheck` (nuxi/vue-tsc) : vert.
- `pnpm generate` : vert, 24 routes prérendues, `/` inclus (hero rendu côté SSR — vérifié par grep des marqueurs `hero__grad`, `hero-term__open`, `prm__caret`, `whoami`, etc. dans `.output/public/index.html`).
- Findings stylelint corrigés en cours de route : `word-break: break-word` → `overflow-wrap: break-word` ; ligne vide avant commentaire `//` ; formatage Prettier des spans de prompt (`eslint --fix`).

### Completion Notes List

**Implémenté (port de `Home.jsx` → Vue 3, tokens-only) :**

- `pages/index.vue` entièrement refondu : ancien hero (`WindowWrapperComponent` + image `undraw_programming`) retiré, remplacé par le hero Terminal (A) en `<script setup lang="ts">`. Structure `<main class="home">` → `<section class="hero hero__grad">` → `.hero__in.container` → `.hero__grid` deux colonnes.
- Colonne gauche : eyebrow `// développeur web freelance`, `<h1>` avec `<em>` accent orange (`Du code sur-mesure, de l'IA utile.`), sous-titre = `tagline` de `data.js` (1re personne, vouvoiement, pas d'emoji), CTA, tags.
- CTA : `ZButton` primary `lg` → `/contact` (`Démarrer un projet`, icône `ZIcon name="arrow"` via slot `#iconRight`) + `ZButton` secondary `lg` → `/services` (`Voir les services`). `:as="NuxtLink"` importé de `#components` (évite le piège `<component :is="string">`).
- Tags : `ZTag` × 5 (`php`, `symfony`, `wordpress`, `nest.js`, `nuxt.js`).
- Colonne droite : fenêtre terminal **statique décorative** (port de `TerminalWindow.jsx` + `Prompt.jsx`), barre titre `anon.@jouan.ovh: ~`, 3 pastilles, puis prompts `whoami` / `cat stack.txt` (sortie `--term-blue`) / `ls ~/projets` (sortie `--term-green`), et ligne `help` avec **caret clignotant** (seule animation en boucle, keyframe globale `caret-blink`, neutralisée sous `prefers-reduced-motion`).
- Format prompt fidèle au DS : `anon.@jouan.ovh:~$ <commande>` (user/dir colorés `--prompt` / `--term-blue`).

**Ouverture du terminal (Tâche 3) — délégation au gestionnaire existant :**

- Le `TerminalManagerComponent` (méthode `createNewTerminal()`) est monté dans `HeaderComponent` sans API globale. Plutôt qu'un handler no-op, j'ai exposé l'ouverture via un composable launcher minimal et additif `app/composables/useTerminal.ts` (`register` / `open`). `HeaderComponent` enregistre son lanceur en `onMounted` ; le hero appelle `open()` au clic sur la ligne `help` (bouton natif → clavier OK, `aria-label`).
- Prerender-safe : `register` se fait côté client (`onMounted`), `open()` est un no-op tant qu'aucun lanceur n'est enregistré (rendu statique). La **restylisation** du terminal lui-même reste explicitement du périmètre d'**Epic 8** ; cette story ne touche pas à `components/terminal/`.

**a11y & tokens (checklist pré-revue) :**

- Tokens-only : couleurs/rayons/ombres/typo via `var(--…)`. Dégradés `.hero__grad` dérivés des tokens via `color-mix` (pas de HSL en dur). Dérogations px du chrome terminal (fenêtre 300px, barre 30px, pastilles 13px/gap 7px, caret en em, délai 80ms) **commentées explicitement** — specs DS sans token équivalent (cf. tolérance documentée Epic 2).
- Focus visible (`--ring-accent`) sur la ligne `help` ; pastilles décoratives `aria-hidden` ; `prefers-reduced-motion` neutralise l'entrée `.anim` et le caret.

**Écarts signalés :**

- Breakpoint mobile : la fiche citait `max-width: 720px`, mais `kit.css` (source de vérité) utilise `@media (max-width: 900px)` pour `.hero__grid` (1 colonne) et `.hero h1` (`--fs-4xl`). J'ai suivi `kit.css` (900px).
- `WindowWrapperComponent.vue` et l'image `undraw_programming_re_kg9v.svg` ne sont plus référencés par `/` mais ne sont pas supprimés (hors périmètre ; possiblement utilisés ailleurs / legacy à traiter séparément).

**Résolution de revue (2026-06-22, baseline `d010077` → `79f1019`) — 4/4 findings [Patch] corrigés, 0 dette :**

- ✅ Resolved review finding [Patch] a11y terminal décoratif : `aria-hidden="true"` sur les 3 lignes de prompt décoratives (`.hero-term__line`) ; le caret l'était déjà ; les sorties (`whoami`/stack/projets) restent lisibles par les lecteurs d'écran. La ligne `help` reste un `<button>` avec `aria-label`.
- ✅ Resolved review finding [Patch] fidélité dégradé : nouveau token `--aubergine-vivid: hsl(319deg 60% 30%)` dans `_root.scss`, consommé par `.hero__grad` via `color-mix` (≈ `hsl(319 60% 30% / .28)` du kit) — tokens-only préservé.
- ✅ Resolved review finding [Patch] cycle de vie du lanceur : ajout de `unregister(fn)` dans `useTerminal` (nullifie seulement si `launcher.value === fn`), appelé en `onBeforeUnmount` du header — symétrie register/unregister, plus de singleton orphelin.
- ✅ Resolved review finding [Patch] clé `v-for` : `terminalRows` reçoit un champ `id` stable (`line-1/2/3`), `:key="row.id"` au lieu de `row.cmd` (contenu).

Validation post-fix (Docker) : `pnpm lint` 0/0, `typecheck` vert, `generate` vert (24 routes).

### File List

- `app/pages/index.vue` (refonte complète — hero Terminal A ; a11y prompts décoratifs, clé v-for stable, token dégradé)
- `app/components/HeaderComponent.vue` (enregistre/désenregistre le lanceur terminal partagé — onMounted / onBeforeUnmount)
- `app/composables/useTerminal.ts` (nouveau — registre/launcher du terminal partagé : register/unregister/open)
- `app/assets/scss/abstract/_root.scss` (nouveau token `--aubergine-vivid` — dégradé héros fidèle au kit, tokens-only)
- `docs/implementation-artifacts/3-1-hero-terminal-a.md` (frontmatter `baseline_commit`, statut, Dev Agent Record, findings de revue)
- `docs/implementation-artifacts/sprint-status.yaml` (statut 3-1 → in-progress → review)

## Change Log

- 2026-06-22 — Implémentation story 3.1 (hero Terminal A) : refonte `pages/index.vue`, composable `useTerminal`, câblage ouverture terminal depuis le header. Lint/typecheck/generate verts. Statut → review.
- 2026-06-22 — Corrections de revue de code : 4 findings [Patch] résolus (a11y prompts décoratifs, token `--aubergine-vivid`, unregister du lanceur, clé v-for stable). Lint/typecheck/generate verts. Statut → review.
