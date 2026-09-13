---
baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
---

# Story 10.3: Liens externes accessibles (helper + audit `target="_blank"`)

Status: done

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

- [x] Tâche 1 — Factoriser le helper de lien externe (AC: #1)
  - [x] Créer un mécanisme unique réutilisable : primitive DS `app/components/ui/ZExternalLink.vue` (auto-import sans préfixe). Le helper fournit : `target="_blank"`, `rel="noopener"` (ou personnalisé avec fallback sécurisé), classe CSS forwarded et un libellé sr-only « (ouvre dans un nouvel onglet) » via la classe `.screen-reader-text`.
  - [x] Le helper compose avec les usages existants sans imposer de wrapper bloquant la mise en page.
- [x] Tâche 2 — Auditer et migrer TOUS les `target="_blank"` (AC: tout)
  - [x] Inventaire `grep -rn 'target="_blank"' app/` et migration :
    - **`app/components/HexagonLinkComponent.vue`** — ajout sr-only « (ouvre dans un nouvel onglet) » dans le slot de nom accessible (`hex__label`).
    - **`app/components/FooterComponent.vue`** — liens projets migrés vers `<ZExternalLink>`.
    - **`app/pages/about.vue`** — lien `keova.app` migré vers `<ZExternalLink>`.
    - **`app/pages/index.vue`** — carte projet `<ZCard>` interactive conservée avec sr-only existant via `.screen-reader-text`.
  - [x] Vérifier qu'aucun `target="_blank"` non audité / sans sr-only ne subsiste (`grep` final).
- [x] Tâche 3 — Validation (AC: tout)
  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` exécuté avec succès (code 0).
  - [x] Vérification du nom accessible et préservation du rendu visuel.

### Review Findings

- [x] [Review][Patch] Unifier tous les liens externes via le helper unique ZExternalLink [app/components/HexagonLinkComponent.vue:2, app/pages/index.vue:102]
- [x] [Review][Patch] Garantir la présence systématique de noopener dans computedRel [app/components/ui/ZExternalLink.vue:36]
- [x] [Review][Patch] Retirer le bridage de prop class?: string pour exploiter le fallthrough natif [app/components/ui/ZExternalLink.vue:24]
- [x] [Review][Patch] Sécuriser computedSrText contre les chaînes vides ou d'espaces [app/components/ui/ZExternalLink.vue:37]
- [x] [Review][Patch] Aligner le statut de la story 10.3 dans sprint-status.yaml [docs/implementation-artifacts/sprint-status.yaml:186]

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
Gemini 2.5 Pro

### Debug Log References
- Lint initial ajusté avec Prettier / ESLint.
- Validation intégrale `pnpm lint && pnpm typecheck && pnpm generate` passée avec succès sous Docker.
- Revue de code adversariale : 5 patchs appliqués (unification complète ZExternalLink sur HexagonLinkComponent et index.vue, enforcement noopener, fallthrough class, garde srText, alignement sprint status).

### Completion Notes List
- Création de la primitive Design System `app/components/ui/ZExternalLink.vue` avec `target="_blank"`, `rel="noopener"` garanti, slots et mention screen-reader-text.
- Mise à jour de `app/components/HexagonLinkComponent.vue` pour router intégralement via `<ZExternalLink>`.
- Remplacement du lien brut dans `app/components/FooterComponent.vue` par `<ZExternalLink>`.
- Remplacement du lien keova.app dans `app/pages/about.vue` par `<ZExternalLink>`.
- Refactorisation de la carte projet dans `app/pages/index.vue` pour utiliser `:as="ZExternalLink"`, éliminant le span sr-only ad-hoc en double.
- Audit exhaustif `grep` : 100 % des `target="_blank"` passent désormais par le helper unique `ZExternalLink`.
- Validation Docker réussie (lint, typecheck, build statique Nuxt 4 Nitro).

### File List
- `app/components/ui/ZExternalLink.vue` (NEW)
- `app/components/HexagonLinkComponent.vue` (MODIFIED)
- `app/components/FooterComponent.vue` (MODIFIED)
- `app/pages/about.vue` (MODIFIED)
- `app/pages/index.vue` (MODIFIED)
- `docs/implementation-artifacts/10-3-liens-externes-accessibles.md` (MODIFIED)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
