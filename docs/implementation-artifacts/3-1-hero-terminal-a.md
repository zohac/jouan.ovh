# Story 3.1: Hero Terminal (A)

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur du site jouan.ovh,
I want un hero d'accueil en style terminal,
so that je perçois immédiatement l'identité de marque (« OS de nuit », Ubuntu/terminal) dès l'arrivée sur la page.

## Acceptance Criteria

1. **Given** la direction de hero Terminal (A) de `Home.jsx`, **When** on implémente le hero sur `/`, **Then** le hero rend en style terminal (prompt, caret, accroche française 1re personne).
2. **Given** la même implémentation, **When** le visiteur voit le hero, **Then** un CTA principal mène à un parcours clé (ex. contact/about).

## Tasks / Subtasks

- [ ] Tâche 1 — Refondre `pages/index.vue` pour accueillir le hero Terminal (A) (AC: #1)
  - [ ] Retirer l'ancien hero (`WindowWrapperComponent` + image `undraw_programming`) — il sera remplacé par le hero terminal
  - [ ] Mettre en place la structure `<section class="hero hero__grad">` → `.hero__in.container` → `.hero__grid` à deux colonnes (texte à gauche, fenêtre terminal à droite), conforme à `kit.css` (`.hero__grid { grid-template-columns: 1.05fr 0.95fr; }`)
  - [ ] Colonne gauche : eyebrow `// développeur web freelance`, titre `<h1>` avec `<em>` sur les mots accentués (orange via `.hero h1 em`), sous-titre `S.tagline`, zone CTA, zone tags
  - [ ] Colonne droite : fenêtre terminal stylée (réutiliser le `TerminalWindow`/`Prompt` du DS portés en Epic 2 si disponibles, sinon voir Dev Notes)
- [ ] Tâche 2 — Accroche et contenu français 1re personne (AC: #1)
  - [ ] Titre : `Du code sur-mesure, de l'IA utile.` (`sur-mesure` et `utile` en `<em>` accent orange) — repris de `Home.jsx`
  - [ ] Sous-titre = `tagline` de `data.js` : « Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils. » (1re personne « je », vouvoiement, pas d'emoji)
  - [ ] Eyebrow : `// développeur web freelance`
- [ ] Tâche 3 — Bloc terminal avec prompt + caret (AC: #1)
  - [ ] Reproduire le contenu terminal de `HeroTerminal` (`Home.jsx`) : titre fenêtre `anon.@jouan.ovh: ~`, puis suite de lignes :
    - `whoami` → `Simon Jouan — Développeur web freelance`
    - `cat stack.txt` → `PHP/Symfony · WordPress · Node/Nest · Nuxt` (couleur `--term-blue`)
    - `ls ~/projets` → `keova.app/   patio-conseil.fr/` (couleur `--term-green`)
    - dernière ligne `help` avec **caret clignotant** (`caret`), cliquable pour ouvrir l'easter-egg terminal
  - [ ] Le prompt suit le format DS `anon.@jouan.ovh:~$ <commande>` (réf. `Prompt.jsx` / `Prompt.d.ts`) ; le caret clignotant est la **seule** animation en boucle
  - [ ] Le clic sur la dernière ligne ouvre l'easter-egg terminal existant (déléguer au gestionnaire terminal ; voir Dev Notes — si l'API d'ouverture n'est pas encore exposée, câbler a minima un handler no-op et noter la dépendance vers Epic 8)
- [ ] Tâche 4 — CTA principal + secondaire + tags (AC: #2)
  - [ ] CTA principal : `ZButton` variante `primary` (orange), taille `lg`, libellé `Démarrer un projet`, icône flèche à droite → `NuxtLink`/navigation vers `/contact`
  - [ ] CTA secondaire : `ZButton` variante `secondary`, taille `lg`, libellé `Voir les services` → `/services`
  - [ ] Rangée de tags `ZTag` : `php`, `symfony`, `wordpress`, `nest.js`, `nuxt.js` (réf. `Home.jsx`)
- [ ] Tâche 5 — Styles & responsive (AC: #1)
  - [ ] Porter les classes layout du hero (`.hero`, `.hero__grad`, `.hero__in`, `.hero__grid`, `.hero h1`, `.hero__sub`, `.hero__cta`, `.hero__tags`) depuis `kit.css` vers le SCSS scoped de la page (ou un partial `pages/`), **en consommant les tokens** (aucune valeur hardcodée)
  - [ ] Sur mobile (`max-width: 720px` dans `kit.css`), `.hero__grid` passe en une seule colonne et `.hero h1` réduit à `--fs-4xl`
- [ ] Tâche 6 — Vérification prerender & qualité (AC: #1, #2)
  - [ ] Tout accès DOM lié au terminal est gardé (`onMounted` / `import.meta.client`) — compatibilité `nuxi generate`
  - [ ] `yarn dev` charge `/` sans erreur ; `yarn lint` ne régresse pas

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

### Debug Log References

### Completion Notes List

### File List
