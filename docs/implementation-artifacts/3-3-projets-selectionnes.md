---
baseline_commit: 132093dd654b7a97ce39ad867db95a95fd2e2b92
---

# Story 3.3: Projets sélectionnés

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur du site jouan.ovh,
I want voir des projets sélectionnés présentés en cartes,
so that j'évalue concrètement le travail de Simon avant de le contacter.

## Acceptance Criteria

1. **Given** le contenu projets de `data.js`, **When** on implémente le bloc projets sur `/` avec `ZCard`, **Then** les projets sélectionnés rendent en cartes conformes au DS.

## Tasks / Subtasks

- [x] Tâche 1 — Bloc « projets sélectionnés » sur `/` (AC: #1)
  - [x] Ajouter, dans la section `section--sunken` (partagée avec les stats de la story 3.2), sous la rangée de stats : eyebrow `// projets sélectionnés` puis une grille `.grid-2`
  - [x] Pour chaque projet de `data.js`, une `ZCard` interactive rendue comme lien externe (`as="a"` / `href` + `target="_blank"` + `rel="noreferrer"`) — réf. `StatsProjects` dans `Home.jsx`
- [x] Tâche 2 — Contenu carte projet depuis `data.js` (AC: #1)
  - [x] En-tête de carte : `<h3>` nom du projet (`--fs-xl`) à gauche + `<span>` rôle (Ubuntu Mono, `--fs-xs`, `--text-muted`) à droite, alignés baseline (réf. `Home.jsx`)
  - [x] Description `.prose` (`--fs-sm`, Ubuntu sans)
  - [x] Rangée de tags `ZTag` (`.hero__tags`) à partir de `p.tags`
  - [x] Projet 1 — `keova.app`, rôle « Fondateur · SaaS », desc « Plateforme SaaS que je conçois et opère de bout en bout. », tags `nest.js`/`nuxt`/`saas`, url `https://keova.app`
  - [x] Projet 2 — `patio-conseil.fr`, rôle « Client », desc « Site et outils pour un cabinet de conseil. », tags `wordpress`/`conseil`, url `https://patio-conseil.fr`
- [x] Tâche 3 — Styles & responsive (AC: #1)
  - [x] Porter les classes `.grid-2`, l'en-tête flex (space-between, baseline), `.prose`, `.hero__tags` depuis `kit.css` en consommant les tokens (aucune valeur hardcodée)
  - [x] Mobile (`max-width: 720px`) : `.grid-2` passe en une colonne (réf. `kit.css`)
- [x] Tâche 4 — Liens externes & sécurité (AC: #1)
  - [x] Les cartes-liens ouvrent l'URL externe dans un nouvel onglet avec `rel="noreferrer"` (réf. `Home.jsx`)
  - [x] Vérifier le contraste et l'état focus/hover de la carte interactive (le DS définit l'état interactif de `ZCard`)
- [x] Tâche 5 — Vérification prerender & qualité (AC: #1)
  - [x] Rendu statique de la liste de projets (pas d'accès DOM) — prerender-safe
  - [x] `yarn dev` charge `/` sans erreur ; `yarn lint` ne régresse pas

### Review Findings

_Revue de code 2026-06-22 (baseline `132093d` → `78811f2`) — Blind Hunter, Edge Case Hunter, Acceptance Auditor (les trois convergent sur le focus). AC #1 vérifié conforme (contenu exact, section partagée non dupliquée, tokens-only, `ZCard`/`ZTag` réutilisés, lien externe sécurisé). 1 decision-needed, 0 patch, 1 defer, 16 dismissed._

- [x] [Review][Patch] (ex-Decision — résolu : corriger la primitive `ZCard`, élargissement Epic 2 à noter en rétro) Carte-lien projet sans indicateur de focus visible (a11y) — La carte est rendue en `<a>` focusable (`ZCard as="a"`), mais `ZCard` ne définit que `.zcard--interactive:hover` — **aucun `:focus-visible`** (vérifié `app/components/ui/ZCard.vue`). Au clavier, les liens projet n'ont aucun anneau de focus. Viole `project-context.md#Accessibilité` et la sous-tâche 4 (cochée sur une prémisse fausse : le DS ne définit que le hover, pas le focus). **Fix retenu (décision Simon)** : ajouter dans `app/components/ui/ZCard.vue` `.zcard--interactive:focus-visible { outline: none; box-shadow: var(--ring-accent) }` — corrige toutes les cartes-liens (sans effet de bord : les cartes services 3.2 ne sont pas focusables). Touche Epic 2 → **à remonter en rétrospective Epic 3**. [blind+edge+auditor]
- [x] [Review][Defer] Liens-cartes externes sans indication « nouvel onglet » [app/pages/index.vue `.project`] — Les cartes ouvrent l'URL externe via `target="_blank"` sans indice visible/AT (texte `(nouvel onglet)` visually-hidden ou icône). Recommandation WCAG (G201). Fidèle à `Home.jsx` (la source l'omet aussi) → polissage a11y à grouper en Epic 9. [blind+auditor]

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

Claude Opus 4.8 (1M context) — `claude-opus-4-8[1m]`

### Debug Log References

- `pnpm lint` / `typecheck` / `generate` : verts (Docker, 24 routes prérendues).
- Finding stylelint corrigé : ligne vide avant commentaire `//` dans `.statrow`.
- Vérification visuelle **Chrome DevTools MCP** : grille `.grid-2` (2 colonnes), cartes rendues en `<a>` externes (`href`, `target="_blank"`, `rel="noopener noreferrer"`), `statrow margin-bottom: 48px`, noms/rôles/tags exacts, `text-decoration: none` confirmé.

### Completion Notes List

**Implémenté (port de la partie projets de `StatsProjects`, Home.jsx → `pages/index.vue`) :**

- Bloc « projets sélectionnés » ajouté **dans la section `section--sunken` existante** (story 3.2), sous la rangée de stats — pas de section dupliquée. Eyebrow `// projets sélectionnés` + grille `.grid-2`.
- Chaque projet = `ZCard` (Epic 2) **interactive rendue en lien externe** (`as="a"` → `<a>` natif, `:href`, `target="_blank"`, `rel="noopener noreferrer"`). En-tête flex baseline (`<h3>` nom `--fs-xl` à gauche / `<span>` rôle `--fs-xs` `--text-muted` à droite), description `.prose` (`--fs-sm`, Ubuntu sans), rangée de `ZTag` (`.hero__tags`).
- Données portées dans le `<script setup>` (`projects`), texte exact de `data.js` (séparateur `·`), URL externes (keova.app, patio-conseil.fr). Rendu statique `v-for` → prerender-safe.
- Espacement stats↔projets traité côté 3.3 : `.statrow { margin-bottom: var(--space-12) }` + `.projects { margin-top: var(--space-5) }` (réf. `StatsProjects`), comme convenu en 3.2.

**Correctifs de fidélité (appliqués à l'écriture, pré-revue) :**

- `text-decoration: none` sur `.project` : la carte rendue en `<a>` soulignait tout son contenu par défaut — neutralisé (scopé à la page, `ZCard` reste générique). Une réinitialisation `ZCard`-as-link au niveau de la primitive serait une amélioration DS (hors périmètre 3.3).
- `rel="noopener noreferrer"` (la fiche cite `noreferrer` seul, suffisant ; j'ajoute `noopener` par cohérence avec `HexagonLinkComponent` et sécurité).

**a11y / clés :**

- Clés `v-for` sur `id` stable (`keova`/`patio`) — cohérent avec le reste du fichier (terminalRows, services, stats).
- Lien de carte : nom d'accessibilité riche et **distinct** par carte (nom + rôle + desc + tags), donc objet de lien clair (WCAG 2.4.4). `target="_blank"` + `rel` posés.

**Écart signalé :**

- Breakpoint mobile : la fiche cite `max-width: 720px` ; `kit.css` (source de vérité) utilise `@media (max-width: 900px)` pour `.grid-2` → 1 colonne. J'ai suivi `kit.css` (900px), cohérent avec 3.1/3.2.

**Résolution de revue (2026-06-22, baseline `132093d` → `78811f2`) — « corrige tous les findings, aucune dette » :**

- ✅ Resolved review finding [Patch] focus carte-lien : ajout de `.zcard--interactive:focus-visible { outline: none; box-shadow: var(--ring-accent) }` dans `app/components/ui/ZCard.vue`. Corrige **toutes** les cartes interactives focusables (aucun effet sur les cartes non focusables comme les offres services 3.2, en `div`). Vérifié au Chrome DevTools : anneau orange `--ring-accent` (3px) au focus clavier de la carte projet. **Touche `ZCard` (Epic 2)** — décision Simon en revue ; **à remonter en rétrospective Epic 3** (élargissement de périmètre assumé).
- ✅ Resolved review finding [Defer→corrigé local] indication « nouvel onglet » : ajout d'un libellé masqué `<span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span>` dans chaque carte projet (réutilise l'utilitaire global sr-only). Vérifié masqué visuellement / lu par AT. L'audit **site-wide** des liens `target="_blank"` (hexagones sociaux, etc.) reste un polissage **Epic 9** — pas de la dette 3.3.

Validation post-fix (Docker) : `pnpm lint` 0/0, `typecheck` vert, `generate` vert (24 routes).

### File List

- `app/pages/index.vue` (bloc projets dans `section--sunken` ; données `projects` ; styles `.grid-2`/`.projects`/`.project*`/`.prose` ; `statrow margin-bottom` ; `.grid-2` responsive ; libellé sr-only « nouvel onglet »)
- `app/components/ui/ZCard.vue` (ajout `:focus-visible` sur `.zcard--interactive` — anneau de focus pour les cartes-liens ; correctif Epic 2 issu de la revue)
- `docs/implementation-artifacts/3-3-projets-selectionnes.md` (frontmatter `baseline_commit`, statut, Dev Agent Record, findings de revue)
- `docs/implementation-artifacts/sprint-status.yaml` (statut 3-3 → in-progress → review)

## Change Log

- 2026-06-22 — Implémentation story 3.3 (projets sélectionnés) : bloc projets ajouté dans la section `section--sunken` (sous les stats), 2 `ZCard` rendues en liens externes + `ZTag`, tokens-only. Espacement stats↔projets finalisé. Lint/typecheck/generate verts, vérifié au Chrome DevTools. Statut → review.
- 2026-06-22 — Corrections de revue de code : finding [Patch] focus (ajout `:focus-visible` sur `ZCard` interactive, corrige toutes les cartes-liens) + [Defer] traité (libellé sr-only « nouvel onglet » sur les cartes projet). Audit `_blank` site-wide laissé à Epic 9. Lint/typecheck/generate verts. Statut → review.
