# Story 3.3: Projets sélectionnés

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur du site jouan.ovh,
I want voir des projets sélectionnés présentés en cartes,
so that j'évalue concrètement le travail de Simon avant de le contacter.

## Acceptance Criteria

1. **Given** le contenu projets de `data.js`, **When** on implémente le bloc projets sur `/` avec `ZCard`, **Then** les projets sélectionnés rendent en cartes conformes au DS.

## Tasks / Subtasks

- [ ] Tâche 1 — Bloc « projets sélectionnés » sur `/` (AC: #1)
  - [ ] Ajouter, dans la section `section--sunken` (partagée avec les stats de la story 3.2), sous la rangée de stats : eyebrow `// projets sélectionnés` puis une grille `.grid-2`
  - [ ] Pour chaque projet de `data.js`, une `ZCard` interactive rendue comme lien externe (`as="a"` / `href` + `target="_blank"` + `rel="noreferrer"`) — réf. `StatsProjects` dans `Home.jsx`
- [ ] Tâche 2 — Contenu carte projet depuis `data.js` (AC: #1)
  - [ ] En-tête de carte : `<h3>` nom du projet (`--fs-xl`) à gauche + `<span>` rôle (Ubuntu Mono, `--fs-xs`, `--text-muted`) à droite, alignés baseline (réf. `Home.jsx`)
  - [ ] Description `.prose` (`--fs-sm`, Ubuntu sans)
  - [ ] Rangée de tags `ZTag` (`.hero__tags`) à partir de `p.tags`
  - [ ] Projet 1 — `keova.app`, rôle « Fondateur · SaaS », desc « Plateforme SaaS que je conçois et opère de bout en bout. », tags `nest.js`/`nuxt`/`saas`, url `https://keova.app`
  - [ ] Projet 2 — `patio-conseil.fr`, rôle « Client », desc « Site et outils pour un cabinet de conseil. », tags `wordpress`/`conseil`, url `https://patio-conseil.fr`
- [ ] Tâche 3 — Styles & responsive (AC: #1)
  - [ ] Porter les classes `.grid-2`, l'en-tête flex (space-between, baseline), `.prose`, `.hero__tags` depuis `kit.css` en consommant les tokens (aucune valeur hardcodée)
  - [ ] Mobile (`max-width: 720px`) : `.grid-2` passe en une colonne (réf. `kit.css`)
- [ ] Tâche 4 — Liens externes & sécurité (AC: #1)
  - [ ] Les cartes-liens ouvrent l'URL externe dans un nouvel onglet avec `rel="noreferrer"` (réf. `Home.jsx`)
  - [ ] Vérifier le contraste et l'état focus/hover de la carte interactive (le DS définit l'état interactif de `ZCard`)
- [ ] Tâche 5 — Vérification prerender & qualité (AC: #1)
  - [ ] Rendu statique de la liste de projets (pas d'accès DOM) — prerender-safe
  - [ ] `yarn dev` charge `/` sans erreur ; `yarn lint` ne régresse pas

## Dev Notes

### Contexte & contraintes (depuis project-context.md et SPEC)

- **Dark-first**, orange = seul accent héros ; les cartes projet restent sobres (pas d'accent orange pleine surface). [Source: docs/project-context.md#À préserver]
- **`ZCard` conforme au DS** (UX-DR3) : fond `--bg-card`, bordure hairline, `--radius-md`, ombres + hairline. La carte est **interactive** (lien). [Source: docs/planning-artifacts/epics.md#Epic 2 — Story 2.4 ; docs/design_system/components/core/Card.jsx]
- **Aucune valeur hardcodée** (NFR2) : `--bg-sunken`, `--text-muted`, `--text-body`, `--accent`, `--fs-*`, `--space-*` via tokens. [Source: docs/project-context.md#SCSS]
- **Port, pas copie** (NFR3) : Vue 3 `<script setup lang="ts">` + SCSS `@use`. [Source: docs/project-context.md#Règles critiques à ne pas manquer]
- **Langue & voix** (NFR6) : français, 1re personne, vouvoiement, pas d'emoji. [Source: docs/project-context.md#Langue]
- **Typo** (NFR7) : Ubuntu Mono pour nom/rôle/tags/eyebrow, Ubuntu sans pour la description. [Source: docs/planning-artifacts/epics.md#NonFunctional Requirements (NFR7)]
- **Prerender** (NFR4) : contenu statique, gardes DOM si besoin. [Source: docs/project-context.md#Nuxt]

### Dépendances (épics antérieurs — OK)

- **Epic 2** fournit `ZCard` (story 2.4) et `ZTag` (story 2.5), plus les tokens (2.1/2.2). **Réutiliser** ces primitives — ne pas réécrire de carte/tag ad hoc. [Source: docs/planning-artifacts/epics.md#Epic 2 — Story 2.4, 2.5]
- **Story 3.2** crée la section `section--sunken` (stats) ; cette story y **ajoute** le bloc projets dessous (même section). Coordination requise pour ne pas dupliquer la section.
- ⚠️ Ne jamais dépendre de stories futures. Les projets pointent vers des **URL externes** (keova.app, patio-conseil.fr), pas vers des routes internes à créer.

### Fichiers à modifier / créer

- **`pages/index.vue`** (UPDATE) — ajouter le bloc projets dans la section `section--sunken`, sous les stats (story 3.2). [Source: pages/index.vue ; docs/design_system/ui_kits/jouan-site/Home.jsx]
- **Primitives consommées** (Epic 2, ne pas recréer) : `ZCard` (+ `card/ZCard*`), `ZTag`.
- **SCSS** : styles scoped page ou partial `assets/scss/pages/`. [Source: docs/project-context.md#Organisation]

### Mapping depuis Home.jsx → Vue (`StatsProjects`, partie projets)

| Élément `Home.jsx` | Cible Vue |
|---|---|
| `<p className="eyebrow">// projets sélectionnés</p>` | eyebrow Ubuntu Mono |
| `<div className="grid-2">` + `S.projects.map(...)` | `.grid-2` de `ZCard` |
| `<Card interactive as="a" href={p.url} target="_blank">` | `ZCard` interactive → lien externe (`rel="noreferrer"`) |
| en-tête `display:flex; justify-content:space-between; align-items:baseline` | `<h3>` nom + `<span>` rôle |
| `<h3 style={{fontSize:"var(--fs-xl)"}}>{p.name}</h3>` | nom projet |
| `<span style={{font-mono, --fs-xs, --text-muted}}>{p.role}</span>` | rôle |
| `<p className="prose" style={{--fs-sm}}>{p.desc}</p>` | description |
| `<div className="hero__tags">{p.tags.map(t => <Tag>{t}</Tag>)}</div>` | `ZTag` × n |

### Contenu (source `data.js` / `window.SITE.projects`)

- `{ name: "keova.app", role: "Fondateur · SaaS", desc: "Plateforme SaaS que je conçois et opère de bout en bout.", tags: ["nest.js","nuxt","saas"], url: "https://keova.app" }`
- `{ name: "patio-conseil.fr", role: "Client", desc: "Site et outils pour un cabinet de conseil.", tags: ["wordpress","conseil"], url: "https://patio-conseil.fr" }`
- ⚠️ Reprendre noms/rôles/desc/tags/url exactement (séparateur `·`) ; pas d'emoji.

### Pièges / régressions à éviter

- **Réutiliser `ZCard`/`ZTag`** (Epic 2) — ne pas réécrire de primitives. [Source: docs/planning-artifacts/epics.md#Epic 2]
- **Ne rien hardcoder** (couleurs/espaces/rayons) — tokens uniquement. [Source: docs/project-context.md#SCSS]
- **`@import` interdit** — `@use ... as _alias`. [Source: docs/project-context.md#SCSS]
- **Carte rendue en lien externe** : ne pas oublier `target="_blank"` + `rel="noreferrer"` (sécurité) ; vérifier que `ZCard` accepte un rendu `as="a"`/lien (sinon envelopper proprement sans casser l'accessibilité ni le focus). [Source: docs/design_system/ui_kits/jouan-site/Home.jsx]
- Ne pas dupliquer la section `section--sunken` créée en 3.2.

### Project Structure Notes

- Bloc ajouté dans `pages/index.vue` (route `/`). Aucune base de données / entité.

### Testing standards

- Pas de framework de test. Validation = `yarn lint` (ne pas dégrader) + **`yarn dev` charge `/` sans erreur** + rendu fidèle à la partie projets de `StatsProjects` (`Home.jsx`). Code prerender-safe. [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 3: Page d'accueil — Story 3.3: Projets sélectionnés]
- [Source: docs/specs/spec-design-system-revamp/pages.md — ligne `/` (Home.jsx) ; Notes par page (Home)]
- [Source: docs/design_system/ui_kits/jouan-site/Home.jsx — fonction `StatsProjects` (bloc projets)]
- [Source: docs/design_system/ui_kits/jouan-site/data.js — `window.SITE.projects`]
- [Source: docs/design_system/ui_kits/jouan-site/kit.css — `.grid-2`, `.prose`, `.hero__tags`, `.section--sunken`, `.eyebrow`]
- [Source: docs/design_system/components/core/Card.jsx — carte interactive / rendu lien]
- [Source: docs/project-context.md#Règles Langage & Framework, #Organisation, #Pièges]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
