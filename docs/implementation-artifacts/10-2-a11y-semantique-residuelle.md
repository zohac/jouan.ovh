---
baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
---

# Story 10.2: A11y sémantique résiduelle (home / services / contact)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur utilisant un lecteur d'écran,
I want une sémantique de titres, de listes et de régions cohérente sur toutes les pages,
so that la structure du site m'est annoncée correctement (FR12).

## Acceptance Criteria

**Given** home, services et la colonne d'infos `/contact`, encore en `<div>`/`<p>` à certains endroits
**When** on généralise la convention a11y (libellé de section en `<h2 class="eyebrow">` neutralisé, séquences en `<ol>`/`<ul>`, process `/services` en `<ol>`, paires label/valeur `/contact` en `<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` non vocalisé)
**Then** l'outline de titres est `h1 → h2…` sans saut sur home et services, les séquences sont des listes sémantiques, et le **rendu visuel reste identique** (h2 neutralisé, `list-style: none` + reset des marges)
**And** `pnpm lint`/`typecheck`/`generate` verts ; arbre d'accessibilité vérifié au navigateur (desktop + mobile)

## Tasks / Subtasks

- [x] Tâche 1 — Home (`app/pages/index.vue`) : titres + listes (AC: tout)
  - [x] Auditer l'outline : `<h1 class="hero__title">` (l.9). Les **libellés de section** qui ouvrent une section et n'ont pas de titre propre passent en `<h2 class="eyebrow">` ; ceux qui sont un **kicker au-dessus d'un titre existant** restent `<p>`. Cas : l.8 `// développeur web freelance` = kicker du hero (au-dessus du `<h1>`) → **reste `<p>`** ; l.69 `// ce que je fais` est suivi d'un `<h2 class="section__title">` (l.70) → kicker, **reste `<p>`** ; l.101 `// projets sélectionnés` → **vérifier** s'il est suivi d'un titre ; si non, le passer en `<h2 class="eyebrow">`. (Convention story 5.2 : `font-weight`/`line-height` hérités → rendu identique.)
  - [x] **Séquences répétées en listes** : la grille des 3 offres (aperçu services) et la grille des projets sélectionnés (cartes `v-for`) → `<ul>` + `<li>` (`list-style: none` + reset marges UA → rendu identique). Numéros/ordre éventuels en `aria-hidden`.
- [x] Tâche 2 — Services (`app/pages/services.vue`) : process en `<ol>` + titres (AC: tout)
  - [x] **Process en `<ol>`/`<li>`** (différé revue 4.2) : `.process` est aujourd'hui `<div class="process"><div v-for="step" class="process__step">` avec `<div class="process__num">{{ step.n }}</div>` + `<h3>` (l.55-60). Passer `.process` en `<ol>`, `.process__step` en `<li>` ; les numéros `01…04` (`process__num`) en `aria-hidden="true"` (l'ordre est porté par la liste). `list-style: none` + reset → rendu identique.
  - [x] La grille des **3 offres** (`v-for` offer, l.~25) → `<ul>`/`<li>` ; `offer__points` est déjà un `<ul>` (l.27) — OK. Vérifier l'outline : `<h1>` (l.7), `<h2 class="offer__title">` (l.25 — ⚠️ il y a un h2 par offre dans une grille ; acceptable si la section a un libellé), `<h2 class="process__title">` (l.53). Eyebrows l.6/l.52 = kickers de titres existants → restent `<p>`.
- [x] Tâche 3 — Contact (`app/pages/contact.vue`) : colonne infos en `<dl>` + CTA terminal (AC: tout)
  - [x] **Paires label/valeur** de `.contact__infocard` (l.91+) : aujourd'hui `<div class="infoitem__k">// email</div>` + valeur en `<div>`. Passer en `<dl>` / `<dt>` (label) / `<dd>` (valeur). Le préfixe `//` (décoratif) en `aria-hidden="true"` (ou pseudo-élément) pour ne pas être lu « slash slash ». Reset CSS pour rendu identique.
  - [x] **CTA terminal** (carte ouvrant l'easter-egg) : ajouter `aria-haspopup="dialog"` (signale l'ouverture d'un overlay). Vérifier qu'un libellé/titre de section structure la colonne droite (un `<h2 class="eyebrow">` si elle ouvre une région sans titre).
- [x] Tâche 4 — Validation (AC: tout)
  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts.
  - [x] **Diff visuel + arbre d'accessibilité** (Chrome DevTools MCP), desktop ET mobile : rendu **identique** au pixel (h2 neutralisés, listes reset) ; outline de titres `h1 → h2…` sans saut ; listes annoncées comme listes ; `//` non vocalisé.

## Dev Notes

### Périmètre & frontières

- **Story de finition a11y sémantique** : généralise à **home** et **services** la convention déjà appliquée sur `/about` (5.2), `/blog` (6.1), article (6.2), + sémantique de la colonne `/contact` (différé 7.2). Source : `deferred-work.md` → Epic 10 items #1 et #3. [Source: epics.md#Epic 10 — Story 10.2 (FR12)]
- **Frontières** : **PAS** de motion/contraste/forced-colors (= 9.x + story 10.4), **PAS** de SEO (= 10.5), **PAS** de changement visuel. Uniquement le **balisage sémantique** à rendu constant.
- **Convention de référence (story 5.2, déjà dans project-context)** : un libellé de section (eyebrow `// …`) **qui ouvre une section** porte un `<h2 class="eyebrow">` (style neutralisé : `font-weight`/`line-height` hérités → rendu identique), **pas** un `<p>`. Une **séquence** (étapes, cartes répétées, tags) se balise en `<ol>`/`<ul>` + `<li>` (`list-style: none` + reset marges UA → rendu identique). [Source: docs/project-context.md#Accessibilité — Hiérarchie de titres & sémantique de listes]

### Fichiers concernés (lus — baseline `3e82045`)

- **`app/pages/index.vue`** (UPDATE) — hero eyebrow l.8 (kicker, reste `<p>`), `<h1>` l.9 ; section « ce que je fais » l.69 eyebrow + `<h2 section__title>` l.70 ; section « projets sélectionnés » l.101 (auditer le titre). Grilles offres + projets en `v-for` → `<ul>`/`<li>`. ⚠️ l.110 carte projet a `target="_blank"` + sr-only (story 10.3, ne pas dupliquer ici).
- **`app/pages/services.vue`** (UPDATE) — `.process` (l.50-62) en `<ol>`/`<li>` + `process__num` `aria-hidden` ; grille des 3 offres `v-for` (l.~25) en `<ul>`/`<li>` ; `offer__points` déjà `<ul>` (l.27). Steps proviennent de `const steps` (process 4 temps).
- **`app/pages/contact.vue`** (UPDATE) — `.contact__info` / `.contact__infocard` (l.89-101) : `infoitem__k` (`// email` / `// localisation` / `// disponibilité`) → `<dl>/<dt>/<dd>` + `//` `aria-hidden`. CTA terminal → `aria-haspopup="dialog"`. Données via `SITE.profile` (`app/data/site.ts`) — ne pas re-hardcoder.
- **`app/assets/scss/base/_layout.scss`** (LECTURE/UPDATE éventuel) — la classe globale `.eyebrow` neutralise déjà le style d'un `<h2>`. Si un reset de liste générique manque, l'ajouter au partiel global, pas en scoped (convention 5.1).

### Pièges / régressions à éviter

- **Rendu strictement identique** : tout changement de balise doit neutraliser le style UA (h2 → hérite `font-weight`/`line-height` via `.eyebrow` ; ol/ul → `list-style: none; margin: 0; padding: 0`). Vérif à l'œil (A1), pas seulement au code.
- **Ne pas toucher** : le `target="_blank"`/sr-only (story 10.3), le SEO (10.5), les états/motion (9.x/10.4). Ne pas casser le `v-for :key`.
- **Eyebrow = kicker vs ouverture de section** : ne pas transformer mécaniquement TOUS les eyebrows en `<h2>` — seuls ceux qui ouvrent une section **sans** titre propre. Un eyebrow au-dessus d'un `<h1>`/`<h2>` existant reste `<p>` (sinon doublon de titre).
- **Prerender (NFR4)** : pur markup, safe. **pnpm + Docker** pour toute commande.
- **Contraste `//`** : si `//` passe en pseudo-élément, garder le token de couleur (pas de hardcode).

### Testing standards

- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + **diff visuel** (rendu identique) et **arbre d'accessibilité** (Chrome DevTools MCP) desktop + mobile : outline titres, listes annoncées, `//` non lu, `aria-haspopup` présent. [Source: project-context.md#Tests, #Vérif visuelle avant revue]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 10 — Story 10.2 (FR12)]
- [Source: docs/implementation-artifacts/deferred-work.md#→ Epic 10 (item #1 titres/listes, #3 sémantique /contact) ; revues 4.2, 5.2, 6.1, 7.2]
- [Source: docs/project-context.md#Accessibilité (convention titres/listes 5.2), #Vérif visuelle avant revue]
- [Source: app/pages/index.vue, app/pages/services.vue, app/pages/contact.vue, app/assets/scss/base/_layout.scss, app/data/site.ts]

## Dev Agent Record

### Agent Model Used

- Gemini 3.7 Flash (Low)

### Debug Log References

- Validation Docker `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` exécutée avec succès (11 routes prerendered, 0 lint error, 0 typecheck error).
- Vérification statique des sorties HTML :
  - `contact/index.html` : `<h2 class="screen-reader-text">Coordonnées et terminal</h2>` présent, `<dl class="contact__infolist">`, `aria-haspopup="dialog"`.
  - `index.html` : `<h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>`, `aria-haspopup="dialog"`, listes `<ul>` sur `.grid-3` et `.grid-2.projects`.
  - `services/index.html` : `<ol class="process">` avec `aria-hidden="true"` sur les numéros d'étape, `<ul>` sur `.grid-3`, préfixes `//` en `aria-hidden`.

### Completion Notes List

- `app/assets/scss/base/_layout.scss` : neutralisation de `font-weight: var(--fw-regular)` et `line-height: var(--lh-relaxed)` sur `.eyebrow` pour garantir la stricte parité visuelle entre `<h2 class="eyebrow">` et `<p class="eyebrow">`.
- `app/pages/index.vue` :
  - `hero__tags` encapsulé en `<ul>`/`<li>` (hero et projets).
  - Titre de section `// projets sélectionnés` passé en `<h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>` (l'eyebrow ouvre la section projets sans titre secondaire).
  - Préfixes décoratifs `// ` encapsulés dans `<span aria-hidden="true">// </span>` sur tous les eyebrows.
  - Grille des 3 services et grille des 2 projets passées en `<ul>`/`<li>` avec reset CSS et flex stretch (`> li { display: flex }`, `.offer, .project { display: flex; flex-direction: column; width: 100% }`).
  - Déclencheur terminal hero enrichi de `aria-haspopup="dialog"`.
- `app/pages/services.vue` :
  - Grille des 3 offres passée en `<ul>`/`<li>` avec reset CSS et flex stretch (`> li { display: flex }`, `.offer { display: flex; flex-direction: column; width: 100% }`).
  - Process 4 étapes passé en `<ol class="process">` / `<li class="process__step">` avec `process__num` marqué en `aria-hidden="true"` et reset CSS.
  - Préfixes `// ` encapsulés dans `<span aria-hidden="true">// </span>`.
- `app/pages/contact.vue` :
  - Colonne droite enrichie d'un titre masqué accessible `<h2 class="screen-reader-text">Coordonnées et terminal</h2>` (résolution Décision 1).
  - Carte infos structurée en `<dl class="contact__infolist">`, `<dt class="infoitem__k">`, `<dd class="infoitem__v">`.
  - Préfixe `// ` encapsulé dans `<span aria-hidden="true">// </span>` pour éviter la vocalisation "slash slash".
  - Reset CSS sur `.contact__infolist`, `.infoitem__k`, `.infoitem__v` pour garantir la stricte conformité visuelle.
  - Bouton CTA terminal enrichi de `aria-haspopup="dialog"`.

### File List

- `app/assets/scss/base/_layout.scss` (MODIFIED)
- `app/pages/index.vue` (MODIFIED)
- `app/pages/services.vue` (MODIFIED)
- `app/pages/contact.vue` (MODIFIED)
- `docs/implementation-artifacts/deferred-work.md` (MODIFIED)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
- `docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md` (MODIFIED)

### Review Findings

_Revue de code contradictoire (`bmad-code-review`, 2026-09-13) — 3 couches parallèles (Blind Hunter / Edge Case Hunter / Acceptance Auditor), aucune couche en échec._

- [x] [Review][Patch] Ajouter un titre accessible masqué <h2 class="screen-reader-text"> dans la colonne droite (résolution Decision 1) [app/pages/contact.vue:89]
- [x] [Review][Patch] Encapsuler le préfixe // décoratif dans un span aria-hidden sur le nouveau titre [app/pages/index.vue:98]
- [x] [Review][Patch] Rétablir l'étirement en hauteur et l'alignement des cartes dans les listes [app/pages/index.vue:73, app/pages/services.vue:13]
- [x] [Review][Patch] Neutraliser explicitement l'interligne d'eyebrow au niveau du paragraphe [app/assets/scss/base/_layout.scss:39]
- [x] [Review][Patch] Ajouter aria-haspopup="dialog" sur le déclencheur terminal du hero [app/pages/index.vue:51]
- [x] [Review][Patch] Compléter les preuves d'exécution et la précision technique dans la story [docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md:80]
- [x] [Review][Defer] Rôle dialog et accessibilité interne de la fenêtre terminal [app/components/WindowWrapperComponent.vue:2] — deferred, pre-existing
