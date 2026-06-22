---
baseline_commit: b45cefbf578a4c3273526d14692974283955e787
---

# Story 3.2: Aperçu services et stats

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur du site jouan.ovh,
I want voir un aperçu des services et des chiffres clés sur la page d'accueil,
so that je comprends rapidement l'offre et la crédibilité de Simon, avec un accès direct à la page Services.

## Acceptance Criteria

1. **Given** le contenu `data.js` (services, stats), **When** on implémente les blocs aperçu services + stats sur `/`, **Then** les 3 services et les stats rendent conformément à `Home.jsx`.
2. **Given** la même implémentation, **When** le visiteur voit l'aperçu services, **Then** un lien mène à la page Services.

## Tasks / Subtasks

- [x] Tâche 1 — Bloc « aperçu services » sur `/` (AC: #1, #2)
  - [x] Ajouter dans `pages/index.vue`, sous le hero (story 3.1), une `<section class="section">` → `.container`
  - [x] Eyebrow `// ce que je fais` + titre `<h2>Trois façons de travailler ensemble` (réf. `ServicesPreview` dans `Home.jsx`)
  - [x] Grille `.grid-3` de 3 cartes `ZCard` (variante interactive ; carte « featured » mise en avant pour le service marqué `featured: true` dans `data.js`)
  - [x] Chaque carte : icône du service, `<h3>` titre, `<p>` description, lien `En savoir plus →` vers `/services`
- [x] Tâche 2 — Contenu des 3 services depuis `data.js` (AC: #1)
  - [x] Service 1 — `WordPress sur-mesure` (icône `wp`), desc « Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous. », `featured: false`
  - [x] Service 2 — `Applications web` (icône `code`), desc « Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre. », `featured: true` (carte accent/mise en avant)
  - [x] Service 3 — `IA & automatisation` (icône `spark`), desc « L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils. », `featured: false`
  - [x] Mapper les icônes (`wp`, `code`, `spark`) vers le système d'icônes du DS porté en Epic 2 (Lucide CDN + SVG inline, `currentColor`)
- [x] Tâche 3 — Bloc « stats » sur `/` (AC: #1)
  - [x] Ajouter une `<section class="section section--sunken">` → `.container` (fond `--bg-sunken`, bordure `--border-subtle` haut — réf. `kit.css`)
  - [x] Rangée `.statrow` de 3 stats `.stat` : chiffre `<b>` (Ubuntu Mono, `--fs-4xl`) + libellé `<span>` (`--fs-sm`, `--text-muted`)
  - [x] Contenu (réf. `data.js` `stats`) : `8+` « ans dans la tech » · `3` « stacks maîtrisés » · `1` « SaaS fondé · keova.app »
  - [x] NB : ce bloc `section--sunken` héberge aussi les projets (story 3.3, `grid-2`) — coordonner pour ne pas dupliquer la section ; les stats sont en tête, les projets en dessous (réf. `StatsProjects` dans `Home.jsx`)
- [x] Tâche 4 — Styles & responsive (AC: #1)
  - [x] Porter les classes `.section`, `.section--sunken`, `.grid-3`, `.statrow`, `.stat`, `.offer*`, `.eyebrow` depuis `kit.css` en consommant les tokens (aucune valeur hardcodée)
  - [x] Mobile (`max-width: 720px`) : `.grid-3` passe en une colonne (réf. `kit.css`)
- [x] Tâche 5 — Vérification prerender & qualité (AC: #1, #2)
  - [x] Boucle de rendu des services/stats statique (pas d'accès DOM) — prerender-safe
  - [x] Les liens `En savoir plus →` pointent vers `/services` (route créée en Epic 4 ; le lien doit exister même si la page est livrée plus tard)
  - [x] `yarn dev` charge `/` sans erreur ; `yarn lint` ne régresse pas

## Dev Notes

### Contexte & contraintes (depuis project-context.md et SPEC)

- **Dark-first**, orange = seul accent héros ; la carte `featured` peut porter un accent discret conforme au DS (réf. `Card.jsx` `accent`/`featured`). [Source: docs/project-context.md#À préserver ; docs/design_system/components/core/Card.jsx]
- **Aucune valeur hardcodée** (NFR2) : couleurs, espaces, rayons via tokens (`--bg-sunken`, `--border-subtle`, `--accent`, `--text-muted`, `--text-strong`, `--fs-*`, `--space-*`). [Source: docs/project-context.md#SCSS]
- **Port, pas copie** (NFR3) : recréer en Vue 3 `<script setup lang="ts">` + SCSS `@use`. [Source: docs/project-context.md#Règles critiques à ne pas manquer]
- **Langue & voix** (NFR6) : français, 1re personne « je », vouvoiement, pas d'emoji. [Source: docs/project-context.md#Langue]
- **Typo** (NFR7) : Ubuntu Mono pour eyebrow, libellés stats, lien « En savoir plus », chiffres ; Ubuntu sans pour les descriptions (`.offer p` utilise `--font-sans`). [Source: docs/planning-artifacts/epics.md#NonFunctional Requirements (NFR7)]
- **Prerender** (NFR4) : contenu statique, pas d'accès DOM non gardé. [Source: docs/project-context.md#Nuxt]

### Dépendances (épics antérieurs — OK)

- **Epic 2** fournit : `ZCard` (story 2.4 — fond `--bg-card`, bordure hairline, `--radius-md`, ombres + hairline), iconographie (story 2.7 — `wp`/`code`/`spark` glyphes ou Lucide), tokens (2.1/2.2). **Réutiliser** ces primitives. [Source: docs/planning-artifacts/epics.md#Epic 2 — Story 2.4, 2.7]
- **Epic 4** crée la route `/services` ; cette story ne fait que **lier** vers elle (lien autorisé même si la page arrive après — ne pas implémenter `/services` ici). Ne PAS dépendre du contenu d'Epic 4.
- ⚠️ Ne jamais dépendre de stories futures pour le rendu : si l'icône `wp`/`code`/`spark` n'est pas encore mappée par Epic 2, prévoir un fallback Lucide neutre et le noter.

### Fichiers à modifier / créer

- **`pages/index.vue`** (UPDATE) — ajouter les sections « aperçu services » et « stats » sous le hero de la story 3.1. La section `section--sunken` est partagée avec les projets (story 3.3). [Source: pages/index.vue ; docs/design_system/ui_kits/jouan-site/Home.jsx]
- **Primitives consommées** (Epic 2, ne pas recréer) : `ZCard` (+ sous-composants `card/ZCard*` existants à migrer/réutiliser), composant d'icône DS.
- **SCSS** : styles scoped page ou partial `assets/scss/pages/`. [Source: docs/project-context.md#Organisation]

### Mapping depuis Home.jsx → Vue

| Élément `Home.jsx` | Cible Vue |
|---|---|
| `ServicesPreview` `<section className="section">` | section aperçu services |
| `<p className="eyebrow">// ce que je fais</p>` | eyebrow Ubuntu Mono |
| `<h2>Trois façons de travailler ensemble</h2>` | titre section |
| `<div className="grid-3">` + `S.services.map(...)` | `.grid-3` de 3 `ZCard` |
| `<Card interactive accent={sv.featured} featured={sv.featured} className="offer">` | `ZCard` interactive/featured |
| `<div className="offer__icon"><G /></div>` | icône service (mapping `sv.icon`) |
| `<h3>{sv.title}</h3>` / `<p>{sv.desc}</p>` | titre + desc |
| `<a onClick={() => go("services")}>En savoir plus →</a>` | `NuxtLink` → `/services` (Ubuntu Mono, `--accent`) |
| `StatsProjects` `<section className="section section--sunken">` | section stats (+ projets, story 3.3) |
| `<div className="statrow">` + `S.stats.map(...)` | `.statrow` de 3 `.stat` |
| `<div className="stat"><b>{s.n}</b><span>{s.l}</span></div>` | chiffre + libellé |

### Contenu (source `data.js` / `window.SITE`)

- `services` : 3 entrées (voir Tâche 2) — utiliser `title`, `desc`, `icon`, `featured`. (Les `points`/`price` détaillés relèvent d'Epic 4 — ne pas les afficher dans l'aperçu home, conformément à `ServicesPreview` qui ne montre que titre + desc + lien.)
- `stats` : `[{n:"8+", l:"ans dans la tech"}, {n:"3", l:"stacks maîtrisés"}, {n:"1", l:"SaaS fondé · keova.app"}]`
- ⚠️ Reprendre le texte exactement (séparateur `·`, accents) ; pas d'emoji ; ne pas inventer de chiffres.

### Pièges / régressions à éviter

- **Réutiliser `ZCard`** (Epic 2) — ne pas réécrire une carte ad hoc. Les `card/ZCard*` existants ont été refondus en 2.4 ; s'appuyer dessus. [Source: docs/planning-artifacts/epics.md#Epic 2 — Story 2.4]
- **Ne rien hardcoder** (couleurs/espaces/rayons) — tokens uniquement. [Source: docs/project-context.md#SCSS]
- **`@import` interdit** — `@use ... as _alias`. [Source: docs/project-context.md#SCSS]
- Le bloc `section--sunken` ne doit pas être dupliqué entre stories 3.2 (stats) et 3.3 (projets) : une seule section, stats en haut puis projets.
- Ne pas afficher d'emoji ni de prix dans l'aperçu (l'aperçu est volontairement court).

### Project Structure Notes

- Sections ajoutées dans `pages/index.vue` (route `/`). Aucune base de données / entité.

### Testing standards

- Pas de framework de test. Validation = `yarn lint` (ne pas dégrader) + **`yarn dev` charge `/` sans erreur** + rendu fidèle à `ServicesPreview`/`StatsProjects` de `Home.jsx`. Code prerender-safe. [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 3: Page d'accueil — Story 3.2: Aperçu services et stats]
- [Source: docs/specs/spec-design-system-revamp/pages.md — ligne `/` (Home.jsx) ; Notes par page (Home)]
- [Source: docs/design_system/ui_kits/jouan-site/Home.jsx — fonctions `ServicesPreview`, `StatsProjects`]
- [Source: docs/design_system/ui_kits/jouan-site/data.js — `window.SITE.services`, `window.SITE.stats`]
- [Source: docs/design_system/ui_kits/jouan-site/kit.css — `.section`, `.section--sunken`, `.grid-3`, `.statrow`, `.stat`, `.offer*`, `.eyebrow`]
- [Source: docs/design_system/components/core/Card.jsx — props `interactive`/`accent`/`featured`]
- [Source: docs/project-context.md#Règles Langage & Framework, #Organisation, #Pièges]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.8 (1M context) — `claude-opus-4-8[1m]`

### Debug Log References

- `pnpm lint` / `typecheck` / `generate` : verts (Docker, 24 routes prérendues).
- Findings stylelint corrigés : ligne vide avant commentaire `//` dans `.offer__icon`.
- Vérification visuelle via **Chrome DevTools MCP** (viewport desktop, serveur dev) : 2 sections, grille 3 colonnes égales, carte `featured` avec bordure `--accent-ring` + glow, icônes 22px, fond `--bg-sunken` sur les stats, liens `→ /services`.

### Completion Notes List

**Implémenté (port de `ServicesPreview` + `StatsProjects`, Home.jsx → `pages/index.vue`) :**

- Section « aperçu services » sous le hero : eyebrow `// ce que je fais`, `<h2>Trois façons de travailler ensemble`, grille `.grid-3` de 3 `ZCard` (Epic 2). La carte `featured` (Applications web) reçoit `accent` + `featured` (barre + glow orange) ; les 3 cartes sont `interactive`.
- Chaque carte : `.offer__icon` (boîte `--space-10`/40px, fond `--accent-soft`, glyphe `ZIcon` dimensionné via `font-size`), `<h3>` titre, `<p>` description (Ubuntu sans), lien `NuxtLink` `En savoir plus →` vers `/services`.
- Icônes mappées sur le set `ZIcon` (story 2.7) : `wp` / `code` / `spark` (présents, pas de fallback nécessaire).
- Section « stats » `.section.section--sunken` (fond `--bg-sunken`, bordures `--border-subtle`) : `.statrow` de 3 `.stat` — chiffre `<b>` (`--fs-4xl`, `--fw-light`) + libellé (`--fs-sm`, `--text-muted`). Texte exact de `data.js` (séparateur `·`).
- Données portées dans le `<script setup>` (`services`, `stats`), rendu statique (`v-for`) — prerender-safe, aucun accès DOM.
- Lien vers `/services` (route Epic 4) : le lien existe même si la page arrive plus tard. Aucune dépendance au contenu d'Epic 4.

**Correction de fidélité (fond de page) — surfacée par cette story :**

- La 1re section pleine largeur sans fond opaque a révélé un **dégradé legacy** (`default.vue` `.init`, anciens tokens SCSS `_color.$` orange/aubergine/rouge) qui débordait derrière le contenu. Remplacé par `background: var(--bg-page)` (dark-first, tokens-only) + suppression de l'import `_color` devenu inutile. Hero (`hero__grad` opaque) et footer (`--bg-sunken`) inchangés ; vérifié au Chrome DevTools.

**Coordination story 3.3 :**

- La section `section--sunken` héberge les **stats en tête** ; les **projets** (`grid-2`, story 3.3) viendront **dans la même section**, sous les stats. Pas de `margin-bottom` ajouté sur `.statrow` pour l'instant — 3.3 gérera l'espacement stats↔projets (réf. `StatsProjects`).

**Écart signalé :**

- Breakpoint mobile : la fiche cite `max-width: 720px` ; `kit.css` (source de vérité) utilise `@media (max-width: 900px)` pour `.grid-3` → 1 colonne. J'ai suivi `kit.css` (900px), cohérent avec la story 3.1.

### File List

- `app/pages/index.vue` (ajout sections aperçu services + stats sous le hero ; données services/stats ; styles `.section*`, `.grid-3`, `.offer*`, `.statrow`, `.stat`)
- `app/layouts/default.vue` (fond de page legacy → `var(--bg-page)` dark-first ; retrait import `_color`)
- `docs/implementation-artifacts/3-2-apercu-services-et-stats.md` (frontmatter `baseline_commit`, statut, Dev Agent Record)
- `docs/implementation-artifacts/sprint-status.yaml` (statut 3-2 → in-progress → review)

## Change Log

- 2026-06-22 — Implémentation story 3.2 (aperçu services + stats) : sections portées de `ServicesPreview`/`StatsProjects` (Home.jsx) dans `pages/index.vue`, 3 `ZCard` (carte featured) + statrow, tokens-only. Correctif fidélité : fond de page legacy → `--bg-page` (dark-first). Lint/typecheck/generate verts, vérifié au Chrome DevTools. Statut → review.
