---
baseline_commit: fb78c74f84b82e10b96e4464770e835f50f218b9
---

# Story 5.2: Timeline, formation et stack

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want voir l'expérience, la formation et la stack technique,
so that j'évalue les compétences de Simon (UX-DR14, FR7).

## Acceptance Criteria

**Given** le contenu CV de `data.js`
**When** on implémente la timeline d'expérience, la formation et la stack sur `/about`
**Then** les trois sections rendent conformément à la référence
**And** la stack utilise des `ZTag`/`ZBadge`

## Tasks / Subtasks

- [x] Tâche 1 — Ajouter la section CV sous le hero portrait/bio (AC)
  - [x] Dans `pages/about.vue` (déjà refondu en story 5.1), ajouter une `<section class="section section--sunken">` + `<div class="container">` conforme à `About.jsx`.
  - [x] Grille 2 colonnes (gauche ≈ `1.4fr` expériences, droite ≈ `0.6fr` formation), `gap: var(--space-12)`.
- [x] Tâche 2 — Timeline d'expérience (AC)
  - [x] Eyebrow `// expériences`.
  - [x] Boucler sur `S.experiences` (3 entrées) et rendre, par item : date, rôle, organisation, description (classes `tl` / `tl__item` / `tl__date` / `tl__role` / `tl__org` / `tl__desc`).
  - [x] Contenu exact depuis `data.js` (voir Dev Notes), dans l'ordre de la référence.
- [x] Tâche 3 — Formation (AC)
  - [x] Eyebrow `// formation`.
  - [x] Boucler sur `S.degrees` (2 entrées) et rendre chaque diplôme dans une carte (`ZCard` padded) : date, intitulé (mono, `--text-strong`), école.
- [x] Tâche 4 — Stack (AC + AND `ZTag`/`ZBadge`)
  - [x] Eyebrow `// stack`.
  - [x] Boucler sur `S.skills` (12 technos) et rendre chaque techno en **`ZTag`** (radius pill) — ou `ZBadge` selon la primitive disponible de l'Epic 2.
  - [x] Selon le découpage retenu en story 5.1, le bloc `// stack` est soit dans la colonne droite du hero (comme `About.jsx`), soit dans la section CV ; le placer une seule fois, conforme à la référence (dans `About.jsx` il est sous la bio, colonne droite du hero).
- [x] Tâche 5 — Style via tokens (AC)
  - [x] Styles en `<style lang="scss" scoped>` consommant les tokens du DS, `@use` jamais `@import`.
  - [x] Aucune valeur de couleur/espace/rayon hardcodée (`--space-*`, `--fs-*`, `--text-*`, `--font-mono`, surface sunken via token).
- [x] Tâche 6 — Vérification
  - [x] `yarn dev` : `/about` affiche les trois sections (timeline, formation, stack) sous le portrait/bio.
  - [x] La stack rend bien en `ZTag`/`ZBadge` (pill).
  - [x] Compatibilité prerender (aucun accès DOM non gardé) ; `yarn lint` ne régresse pas.

## Dev Notes

### Périmètre

- **Cette story complète `/about`** avec timeline d'expérience + formation + stack. Elle **s'appuie sur la story 5.1** (portrait + bio) qui a refondu `pages/about.vue` en `<script setup lang="ts">` et copié le portrait. Ne pas refaire le hero ici ; ajouter la/les section(s) manquante(s).

### Contexte & contraintes (depuis project-context.md et SPEC)

- **Port, pas copie** : `About.jsx` est React + CSS vars ; recréer en Vue 3 `<script setup>` + SCSS `@use`. [Source: docs/project-context.md#Port du design system]
- **Tokens, pas de valeurs en dur** : couleurs/espaces/rayons via tokens DS. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]
- **Langue & voix** : français, 1re personne « je », vouvoiement, pas d'emoji. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]
- **Compatibilité prerender** (site statique) : tout accès DOM gardé. [Source: docs/project-context.md#Nuxt]
- **SCSS** : `<style lang="scss" scoped>`, système `@use ... as _alias` uniquement. [Source: docs/project-context.md#SCSS (règle critique)]

### Fichiers à modifier

- **`pages/about.vue`** (UPDATE) — ajouter la `<section class="section section--sunken">` (expériences + formation) et le bloc `// stack`, à la suite du hero portrait/bio livré en 5.1. [Source: pages/about.vue ; docs/design_system/ui_kits/jouan-site/About.jsx]

### Dépendances (Epic 2)

- **`ZTag.vue`** (story 2.5, UX-DR5, radius pill) — primitive cible pour la stack (chaque techno = un tag). [Source: epics.md#Story 2.5]
- **`ZBadge.vue`** (story 2.5, UX-DR4) — alternative/complément selon la primitive disponible ; l'AC exige `ZTag`/`ZBadge` pour la stack.
- **`ZCard.vue`** (story 2.4, UX-DR3) — pour les cartes de formation (`padded`).
- **Tokens** (story 2.1) + **polices Ubuntu** (story 2.2) : dates/intitulés/labels en Ubuntu Mono.
- **Layout global** (story 2.8) : la page s'insère dans `layouts/default.vue`.
- Ces dépendances pointent vers l'**Epic 2** (autorisé). Aucune dépendance vers des stories futures.

### Mapping About.jsx → Vue (sections concernées par cette story)

- `<section className="section section--sunken">` → `<section class="section section--sunken">` + `<div class="container">`.
- `grid-2` avec `gridTemplateColumns: "1.4fr 0.6fr"`, `gap: var(--space-12)`.
- **Expériences** (`S.experiences.map`) :
  - `<p className="eyebrow">// expériences</p>`.
  - `<div className="tl">` puis, par item : `tl__item` > `tl__date` / `tl__role` / `tl__org` / `tl__desc`.
- **Formation** (`S.degrees.map`) :
  - `<p className="eyebrow">// formation</p>`.
  - Colonne en `flex column`, `gap: var(--space-5)` ; chaque `<Card padded>` → `<ZCard padded>` : `tl__date` + intitulé (mono, `--text-strong`) + `tl__org` (école).
- **Stack** (`S.skills.map`) — dans `About.jsx` ce bloc est sous la bio (colonne droite du hero) :
  - `<p className="eyebrow eyebrow--muted">// stack</p>`.
  - `<div className="hero__tags">{S.skills.map(t => <Tag>{t}</Tag>)}</div>` → `<ZTag v-for=...>` (radius pill).

### Contenu (data.js — exact, dans l'ordre)

- **experiences** : [Source: docs/design_system/ui_kits/jouan-site/data.js]
  - `02/2021 — aujourd'hui` · **Testeur QA** · Linkizz · « Tests automatisés — Node.js, TypeScript, TestCafé. »
  - `05/2020 — 12/2021` · **Développeur Full Stack** · CINS · « PHP/MySQL, Symfony 4/5, Drupal, Prestashop, WordPress, Docker. »
  - `07/2007 — 05/2019` · **Métrologue** · A+ Métrologie / Trescal · « Technicien métrologue multi-grandeur, suppléant COFRAC électricité-magnétisme. »
- **degrees** :
  - `2017 — 2018` · « Développeur d'application — PHP / Symfony » · OpenClassrooms
  - `1999 — 2001` · « BTS CIRA » · Lycée A. de Tocqueville, Cherbourg
- **skills** (12, ordre conservé) : `php`, `symfony`, `wordpress`, `node.js`, `nest.js`, `nuxt.js`, `vue`, `typescript`, `docker`, `tailwind`, `n8n`, `mysql`.

### Pièges / régressions à éviter

- Ne pas dupliquer le bloc `// stack` (s'il a déjà été esquissé en 5.1, le finaliser ici en `ZTag`/`ZBadge`, sans le rendre deux fois).
- Ne pas hardcoder couleurs/espaces ; mapper sur tokens (`--space-12`, `--space-5`, `--fs-sm`, `--text-strong`, `--text-muted`, `--font-mono`, surface `section--sunken` via token de fond).
- Respecter l'ordre des entrées CV de `data.js` (de la plus récente à la plus ancienne pour les expériences).
- Prerender : pas d'accès DOM non gardé (contenu statique, `v-for` sur tableaux locaux).
- Ne pas réintroduire de composant legacy / Options API.
- Ne pas casser le `CNAME` ni la chaîne de déploiement.

### Project Structure Notes

- Page sous `pages/about.vue` (structure racine conservée, cf. story 1.1 `srcDir: '.'`).
- Aucune base de données / entité à créer.

### Testing standards

- Pas de framework de test. Validation = `yarn lint` (ne pas dégrader) + **`yarn dev` affiche les trois sections sur `/about`** (timeline, formation, stack en `ZTag`/`ZBadge`) + compatibilité `yarn generate` (prerender). [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 5: Page À-propos — Story 5.2]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#Capabilities (CAP-7), #Constraints]
- [Source: docs/specs/spec-design-system-revamp/pages.md#/about]
- [Source: docs/design_system/ui_kits/jouan-site/About.jsx — sections expériences / formation / stack]
- [Source: docs/design_system/ui_kits/jouan-site/data.js — experiences, degrees, skills]
- [Source: docs/project-context.md#Port du design system, #Nuxt, #SCSS (règle critique), #Langue, #Tests]
- [Source: pages/about.vue — page à compléter (après story 5.1)]

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Claude Code, workflow bmad-dev-story)

### Debug Log References

- `pnpm lint` (Docker) : PASS.
- `pnpm typecheck` (Docker, `nuxi typecheck`) : PASS.
- `pnpm generate` (Docker) : prerender OK — `/about` (25 ms) généré, aucune erreur.
- Vérif visuelle Chrome DevTools MCP (desktop 1280 + mobile 375) : 3 sections fidèles à `About.jsx`, console propre.

### Completion Notes List

- Complète `app/pages/about.vue` (livré en 5.1) sans toucher au hero : ajout du bloc **stack** sous la bio (colonne droite du hero, conforme à `About.jsx`) et d'une **section CV `--sunken`** sous le hero.
- **Stack** : `S.skills` (12 technos, ordre conservé) en `<ZTag>` (pill mono, préfixe `#`) dans `.hero__tags` ; eyebrow `// stack` en `eyebrow--muted`.
- **Section CV** : grille `1.4fr / 0.6fr`, `gap: var(--space-12)`, → 1 colonne sous 900px.
  - Gauche : eyebrow `// expériences` + timeline `.tl` (rail + points), 3 entrées `S.experiences` (date accent / rôle mono strong / org muted / desc), ordre récent→ancien.
  - Droite : eyebrow `// formation` + 2 `<ZCard padded>` (`S.degrees`) : date + intitulé mono `--text-strong` + école.
- **Tokens uniquement** ; seules dérogations : géométrie décorative de la timeline (rail 1px, point 11px, décalages px) portée de `kit.css`, sans équivalent dans l'échelle de tokens — commentée explicitement.
- **Primitive globale** : `.eyebrow--muted` ajoutée à `app/assets/scss/base/_layout.scss` (modifieur de `.eyebrow`, convention DS depuis 5.1) plutôt que redéclarée scoped.
- Aucun accès DOM (contenu statique, `v-for` sur tableaux locaux) → prerender-safe.
- **Correctif post-implémentation (retour Simon)** : dans `kit.css`, les points de la timeline n'étaient pas centrés sur le rail (point à `left:-22px` sur `.tl__item` → centre ~2px à droite du rail à `left:5px` sur `.tl`). Refondu avec un axe commun `--tl-axis` + `transform: translateX(-50%)` sur le rail ET les points → centres alignés (vérifié : rail et point centrés à x=5px). Amélioration par rapport à la maquette.

### File List

- `app/pages/about.vue` (MODIFIÉ — ajout stack sous la bio + section CV `--sunken` : timeline expériences + formation ; données `skills`/`experiences`/`degrees`)
- `app/assets/scss/base/_layout.scss` (MODIFIÉ — ajout du modifieur global `.eyebrow--muted` ; globalisation de `.hero__tags` avec reset de liste)
- `app/pages/index.vue` (MODIFIÉ — `.hero__tags` scoped retirée au profit du global)
- `docs/implementation-artifacts/5-2-timeline-formation-et-stack.md` (MODIFIÉ — frontmatter `baseline_commit`, tâches cochées, Dev Agent Record, statut)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIÉ — statut story `ready-for-dev` → `in-progress` → `review`)

## Change Log

| Date       | Version | Description                                                                              |
| ---------- | ------- | ---------------------------------------------------------------------------------------- |
| 2026-06-23 | 0.1     | Implémentation story 5.2 — stack (`ZTag`) + section CV (timeline expériences + formation) sur `/about` |
| 2026-06-23 | 0.2     | Fix retour Simon — points de la timeline recentrés sur le rail (axe `--tl-axis` + `translateX(-50%)`), corrige un défaut de la maquette |
| 2026-06-23 | 0.3     | Correctifs de revue — 3 findings résolus (zéro dette) : commentaire mapping `.tl__role` ; `.hero__tags` globalisée ; sémantique a11y /about (titres `h2` + listes `ol`/`ul`/`li`), rendu identique |

## Review Findings

_Code review (bmad-code-review) — 2026-06-23. Couches : Blind Hunter (diff seul) · Edge Case Hunter (diff + projet, retour `[]` : tokens/composants/clés/calc tous vérifiés) · Acceptance Auditor (diff + SPEC/ticket/`kit.css`/`About.jsx`). Verdict : contenu `data.js` exact, stack `ZTag` conforme, périmètre 5.1 intact — un écart de fidélité mineur + une duplication._

- [x] [Review][Patch] Documenter le mapping `.tl__role` : garder `var(--space-1)` (4px) et commenter que c'est le token le plus proche du `2px` du kit (`kit.css:138`) — décision Simon : pureté tokens, delta imperceptible (était `decision-needed`). [app/pages/about.vue (.tl__role)] — ✅ résolu : commentaire ajouté.
- [x] [Review][Patch] Globaliser `.hero__tags` dans `base/_layout.scss` + retirer les déclarations scoped dupliquées de `index.vue` et `about.vue` — décision Simon : cohérence convention 5.1, zéro dette (était `decision-needed`). [app/assets/scss/base/_layout.scss ; app/pages/index.vue ; app/pages/about.vue] — ✅ résolu : `.hero__tags` (avec reset de liste) déplacée dans le global, copies scoped retirées d'`index.vue` et `about.vue` ; home vérifiée (rangée de tags OK).
- [x] [Review][Defer→Fixed] Sémantique a11y des sections CV `/about` — libellés en `<p class="eyebrow">` (pas de hiérarchie `h2`/`h3`), expériences/diplômes/skills en `<div>`/`<ZTag>` (pas de `<ul>`/`<li>`). — ✅ résolu (décision Simon : fix local /about) : libellés `// à propos` / `// stack` / `// expériences` / `// formation` en `<h2 class="eyebrow">` (outline `h1 → h2×4` vérifié), expériences en `<ol>/<li>`, formation et stack en `<ul>/<li>`. Rendu strictement identique (h2 neutralisé : `font-weight: regular` + `line-height: inherit` ; listes : `list-style: none` + marges UA reset). `<time datetime>` écarté : les dates sont des **plages** (« 02/2021 — aujourd'hui »), sans valeur machine mono-datetime. La **généralisation de la convention** (home/services + items 3.3/4.2) reste tracée pour l'Epic 9.

_Rejetés (bruit / faux positifs vérifiés)_ : recentrage des points (sanctionné par Simon, changelog 0.2) ; clés `v-for` (uniques/stables, Edge) ; nom `.hero__tags` (classe du kit) ; `noopener` (SPEC impose `rel="noreferrer"` exact, lien inchangé depuis 5.1) ; px décoratifs de la timeline (dérogations commentées, autorisées) ; « couplage fragile » du point sur `--space-6` (compensation auto-cohérente, géométrie correcte) ; ratio 1.4/0.6fr (fidèle `About.jsx`) ; responsive (mobile 375 vérifié) ; empty-state (consts statiques) ; données CV inline (conforme SPEC, pas de couche data) ; typo `.tl__desc` (volontairement < `.prose`) ; contraste `.eyebrow--muted` (token kit fidèle) ; « aujourd'hui »/MM-YYYY (contenu `data.js` exact).
