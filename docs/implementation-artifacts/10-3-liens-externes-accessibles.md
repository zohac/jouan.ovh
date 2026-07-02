---
baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
---

# Story 10.3: Liens externes accessibles (helper + audit `target="_blank"`)

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want savoir quand un lien ouvre un nouvel onglet,
so that je ne suis pas désorienté par un changement de contexte (FR13, WCAG G201).

## Acceptance Criteria

**Given** les liens `target="_blank"` du site (hexagones sociaux header/footer, cartes projet, liens bio…)
**When** on factorise un helper de lien externe (icône + libellé sr-only « (ouvre dans un nouvel onglet) ») et on l'applique à tous les `_blank`
**Then** chaque lien `_blank` porte `rel="noopener"` + l'indication sr-only via le helper unique (aucune duplication ad hoc)
**And** aucun `_blank` non audité ne subsiste (vérif `grep`) ; rendu visuel inchangé ; gate verte

## Tasks / Subtasks

- [ ] Tâche 1 — Factoriser le helper de lien externe (AC: #1)
  - [ ] Créer un mécanisme unique réutilisable : soit un **composant** `app/components/ui/ZExternalLink.vue` (ou `app/components/ExternalLinkComponent.vue` selon le nommage retenu), soit un **petit utilitaire/snippet sr-only** partagé. Décision à consigner. Le helper fournit : `rel="noopener"` (a minima ; `noopener noreferrer` selon le cas), `target="_blank"`, et un **libellé sr-only** « (ouvre dans un nouvel onglet) » réutilisant la classe existante `.screen-reader-text` (déjà utilisée `index.vue:121`). Optionnellement une icône « lien externe » (`ZIcon`) décorative `aria-hidden`.
  - [ ] Le helper doit composer avec les usages existants (lien texte, carte cliquable, hexagone) sans casser le style — vérifier qu'il n'impose pas de wrapper cassant la mise en page.
- [ ] Tâche 2 — Auditer et migrer TOUS les `target="_blank"` (AC: tout)
  - [ ] Inventaire `grep -rn 'target="_blank"' app/` (4 occurrences au baseline) et migration via le helper :
    - **`app/components/HexagonLinkComponent.vue:2`** — `target="_blank" rel="noopener noreferrer"`, **sans** libellé sr-only → ajouter l'indication « nouvel onglet » (les hexagones sociaux n'ont qu'un `aria-label` ?). Vérifier le nom accessible (réseau social) + sr-only onglet.
    - **`app/components/FooterComponent.vue:24`** — `target="_blank"` → vérifier `rel` + ajouter sr-only.
    - **`app/pages/index.vue:110`** — carte projet : **déjà** dotée du sr-only (`index.vue:121`, fix 3.3). L'aligner sur le helper pour cohérence (pas de régression).
    - **`app/pages/about.vue:34`** — `keova.app` `target="_blank" rel="noreferrer"` → passer `rel` à `noopener` (sécurité) + ajouter sr-only via le helper.
  - [ ] Vérifier qu'**aucun** `target="_blank"` ne subsiste sans helper/sr-only (`grep` final).
- [ ] Tâche 3 — Validation (AC: tout)
  - [ ] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts.
  - [ ] Vérif navigateur (Chrome DevTools MCP) : nom accessible de chaque lien externe = libellé + « (ouvre dans un nouvel onglet) » ; **rendu visuel inchangé** (sr-only hors écran) ; focus visible préservé (9.1).

## Dev Notes

### Périmètre & frontières

- **Story de finition a11y** : factorise un **helper de lien externe** unique et l'applique site-wide. Source : `deferred-work.md` → Epic 10 item #2 (revue 3.3). [Source: epics.md#Epic 10 — Story 10.3 (FR13), WCAG G201]
- **Frontières** : uniquement les liens **externes** (`target="_blank"`). PAS la sémantique titres/listes (10.2), PAS le SEO (10.5). Rendu visuel **inchangé**.
- **Réutiliser l'existant, ne pas réinventer** : la classe `.screen-reader-text` existe déjà (`app/pages/index.vue:121`) ; le set `ZIcon` (story 2.7) a peut-être un glyphe « lien externe ». Vérifier avant d'en créer un.

### Fichiers concernés (lus — baseline `3e82045`)

- **`app/components/HexagonLinkComponent.vue`** (UPDATE) — `<a class="hex" :href="link" target="_blank" rel="noopener noreferrer">` (l.2). Composant réutilisé header/footer/contact pour les socials. Vérifier l'`aria-label`/nom accessible existant ; ajouter sr-only « nouvel onglet » (sans casser la grille hexagonale).
- **`app/components/FooterComponent.vue`** (UPDATE) — lien `target="_blank"` (l.24). Vérifier `rel` + sr-only.
- **`app/components/LinkListComponent.vue`** (LECTURE) — peut piloter les listes de liens (socials) ; voir s'il rend les `HexagonLinkComponent` (point de factorisation possible).
- **`app/pages/index.vue`** (UPDATE léger) — cartes projet `target="_blank"` (l.110) + sr-only existant (l.121) : aligner sur le helper, **ne pas régresser** le fix 3.3.
- **`app/pages/about.vue`** (UPDATE) — lien `keova.app` (l.34) `rel="noreferrer"` → `noopener` + sr-only.
- **Nouveau** : helper `ZExternalLink`/util (emplacement selon convention : primitives DS sous `app/components/ui/`, auto-import sans préfixe). [Source: project-context.md#Conventions de nommage]

### Pièges / régressions à éviter

- **Rendu visuel inchangé** : le libellé « nouvel onglet » est **sr-only** (classe `.screen-reader-text`), jamais visible. L'icône externe éventuelle est `aria-hidden`.
- **`rel`** : préférer `rel="noopener"` (sécurité `window.opener`) ; `noreferrer` seulement si la confidentialité du référent est voulue. Harmoniser.
- **Ne pas casser** le style des hexagones (grille SVG) ni des cartes projet en insérant le wrapper du helper. Tester chaque surface.
- **Focus visible (9.1)** : le helper ne doit pas réintroduire `outline: none` sans repli forced-colors. Réutiliser les anneaux DS existants.
- **Auto-import `<component :is>`** : si le helper enveloppe un `NuxtLink`/`a` dynamique, passer une **référence** importée depuis `#components`, jamais un nom en string (piège story 2.8). [Source: project-context.md#Nuxt]
- **pnpm + Docker** pour toute commande.

### Testing standards

- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + vérif Chrome DevTools MCP (nom accessible des liens externes + rendu inchangé + focus). `grep` final = zéro `_blank` non audité. [Source: project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 10 — Story 10.3 (FR13)]
- [Source: docs/implementation-artifacts/deferred-work.md#→ Epic 10 (item #2 audit _blank), revue 3.3]
- [Source: docs/project-context.md#Accessibilité, #Conventions de nommage, #Nuxt (piège component :is)]
- [Source: app/components/HexagonLinkComponent.vue, FooterComponent.vue, LinkListComponent.vue ; app/pages/index.vue, about.vue]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
