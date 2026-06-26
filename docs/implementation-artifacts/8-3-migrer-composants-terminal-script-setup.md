---
baseline_commit: 7ea5b6d9cbe5ca8f018dcea57c19bb63c475510a
---

# Story 8.3: Migrer les composants terminal vers `<script setup>`

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a mainteneur du codebase,
I want que le sous-système terminal soit en `<script setup lang="ts">` (plus d'Options API),
so that le dernier îlot legacy est résorbé et le code homogène, sans aucune régression fonctionnelle (FR10, NFR9).

> **Contexte de décision** : la rétro Epic 7 a acté qu'Epic 8 = **refonte COMPLÈTE du terminal**, pas seulement un restyle. La story **8.1** a livré le **restyle CSS** (fenêtre/prompt, logique intacte) ; la story **8.2** vérifie commandes + ouverture. Cette story **8.3** porte la **migration Options API → `<script setup>`** des coquilles de composants, à **comportement strictement constant**. [Source: `docs/specs/spec-design-system-revamp/SPEC.md#Decisions` (Refonte du terminal — CAP-10) ; `docs/project-context.md#UI` ; `epic-7-retro-2026-06-26.md` §6/§7]

## Acceptance Criteria

1. **Given** les composants `components/terminal/TerminalComponent.vue` et `TerminalManagerComponent.vue` aujourd'hui en **Options API** (`defineComponent`), **When** on les réécrit en **`<script setup lang="ts">`**, **Then** ils ne contiennent plus d'Options API et conservent **exactement** le même comportement (rendu, props/émissions, refs, cycle de vie).
2. **Given** le terminal migré, **When** on l'ouvre et on exécute chaque commande, **Then** `help`, `about`, `skills`, `projets`, `contact`, `clear` répondent **sans régression**, le **drag** et le **resize** fonctionnent, la **fermeture** et le **focus** de l'input marchent, et l'**historique** (flèches haut/bas) est préservé.
3. **Given** le restyle DS livré en 8.1, **When** la migration est faite, **Then** le **rendu visuel reste identique** (aucune perte de style : fenêtre aubergine, blur, radius, prompt vert, caret) et `pnpm lint` / `typecheck` / `generate` restent **verts**.

> Périmètre : **migration `<script setup>` des coquilles Vue du sous-système terminal** (`TerminalComponent.vue`, `TerminalManagerComponent.vue`). Les **classes `programs/*` (`IProgram`) et `interfaces/`** sont déjà du **TS pur** — **ne pas les réécrire**. Le **restyle** (8.1) et l'**ajout des programmes manquants / vérif commandes** (8.2) sont hors de cette story. `WindowWrapperComponent` / `CurrentTime` (Options API, mais propres au **header**) sont **hors périmètre** (résidu legacy distinct, cf. Dev Notes).

## Tasks / Subtasks

- [ ] Tâche 1 — Migrer `TerminalComponent.vue` Options API → `<script setup lang="ts">` (AC: #1, #2)
  - [ ] Convertir `data()` → `ref`/`reactive` ; `methods` → fonctions ; `computed` → `computed()` ; `mounted`/`beforeUnmount` → `onMounted`/`onBeforeUnmount` ; `props`/`emits` → `defineProps`/`defineEmits` (typés).
  - [ ] **Préserver les classes porteuses de handlers** (`terminal-header`, `close-button`, `user-input`, `resize-handle`) — testées par `classList.contains(...)` dans la logique drag/resize : ne pas les renommer/retirer.
  - [ ] Conserver les écouteurs globaux (`mousemove`/`mouseup` pour le drag), la logique resize, focus input, historique, `runCommand`/`programManager`. Accès DOM gardés client (`onMounted` / `import.meta.client`) — le terminal manipule le DOM, garder le pattern.
  - [ ] Ne PAS toucher au `<style>` restylé en 8.1 ni au `<template>` au-delà du strict nécessaire (refs/bindings).
- [ ] Tâche 2 — Migrer `TerminalManagerComponent.vue` Options API → `<script setup lang="ts">` (AC: #1)
  - [ ] Convertir l'état (liste de terminaux), `createNewTerminal(config?)` et le rendu `v-for` ; exposer l'API attendue par `useTerminal()` / le header (vérifier `defineExpose` si une ref publique est consommée).
  - [ ] Vérifier que l'ouverture depuis le **header** ET depuis le **CTA `/contact`** (`useTerminal().open()`, story 7.2) continue de fonctionner — un seul `TerminalManager` monté, pas de second gestionnaire.
- [ ] Tâche 3 — Vérification fonctionnelle exhaustive (AC: #2, #3 — pas de framework de test)
  - [ ] **Avant migration** : ouvrir le terminal, dérouler `help`/`about`/`skills`/`projets`/`contact`/`clear`, tester drag + resize + close + focus + historique ; noter le comportement de référence.
  - [ ] **Après migration** : rejouer **la même check-list** au navigateur (Chrome DevTools MCP) et confirmer l'absence de régression (commandes, drag, resize, ouverture header + `/contact`).
  - [ ] `pnpm lint` (eslint + stylelint) + `pnpm typecheck` + `pnpm generate` (Docker) verts ; rendu visuel identique à 8.1 (diff visuel).

## Dev Notes

### Périmètre & décision

- **Migration à comportement constant** : c'est une réécriture mécanique Options API → `<script setup>`, **zéro changement fonctionnel ni visuel**. Le risque vient de la nature **stateful + DOM-lourde** (drag/resize) du composant ; **aucun framework de test** → la seule garantie est la **vérif manuelle commande-par-commande + drag + ouverture, avant/après** (AC #2/#3). [Source: `project-context.md#UI`, `#Tests`]
- **Décision Simon (rétro Epic 7)** : refonte complète retenue malgré la reco dev initiale (restyle-only). Cette story matérialise la migration que 8.1/8.2 ne couvraient pas. [Source: `epic-7-retro-2026-06-26.md` §6]

### Fichiers concernés

- **`app/components/terminal/TerminalComponent.vue`** (MIGRATION — `<script>` Options API → `<script setup lang="ts">`). `<style>` restylé (8.1) et structure `<template>` à préserver.
- **`app/components/terminal/TerminalManagerComponent.vue`** (MIGRATION — idem). Vérifier l'API consommée par `useTerminal()` / `HeaderComponent`.
- **`app/components/terminal/programs/*` + `interfaces/`** (NE PAS TOUCHER — déjà TS pur `IProgram`). Si une coquille référence un programme, ne change que l'import/usage, pas la classe.
- **`terminal.config.ts`** (lecture — `userName`/`domainName`/`initialData` ; ne pas casser).

### Hors périmètre

- **8.1** (restyle CSS — `done`/`review`) et **8.2** (commandes manquantes + non-régression commandes). Cette story ne re-style pas et n'ajoute pas de commande.
- **`WindowWrapperComponent.vue` / `CurrentTime.vue`** : encore en Options API mais **propres au header** (`HeaderComponent`), pas au terminal. Résidu legacy **distinct** — à migrer hors « refonte du terminal » (cleanup optionnel séparé, à tracer si souhaité). Ne pas les embarquer ici pour ne pas régresser le header.

### Pièges / régressions à éviter (NFR9)

- **Classes de handlers** (`terminal-header`, `resize-handle`, `close-button`, `user-input`) testées par `classList.contains(...)` → ne pas renommer.
- **`defineExpose`** : si le header/`useTerminal` appelle une méthode publique (`createNewTerminal`) sur une ref de composant, l'exposer explicitement (sinon `null` en `<script setup>`).
- **Ordre d'init / refs** : en `<script setup>`, les refs de template ne sont peuplées qu'après montage — garder les accès DOM dans `onMounted`.
- **Prerender** : le terminal est client-only ; conserver les gardes (`import.meta.client` / `onMounted`). `generate` doit rester vert.
- **`v-html` des sorties de commandes** (tables `about`/`system-info`) : inchangé, ne pas casser le rendu injecté.

### Testing standards

- Pas de framework de test. Validation = `pnpm lint`/`typecheck`/`generate` verts (Docker) + **vérification manuelle exhaustive au navigateur** (Chrome DevTools MCP) : check-list commandes + drag + resize + close + focus + historique + ouverture (header & `/contact`), **avant ET après** la migration, plus diff visuel (rendu identique à 8.1). [Source: `project-context.md#Tests`, `#UI` (mandat vérif commande-par-commande)]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 8 — Story 8.3]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#Decisions (Refonte du terminal — CAP-10), #CAP-3]
- [Source: docs/project-context.md#UI (décision Epic 8), #Tests, #À préserver pendant la refonte]
- [Source: docs/implementation-artifacts/epic-7-retro-2026-06-26.md §6 (décision) + §7 (prep + mitigation)]
- [Source: app/components/terminal/TerminalComponent.vue, TerminalManagerComponent.vue, terminal.config.ts]
- [Source: app/composables/useTerminal (ouverture partagée, story 7.2) ; app/components/HeaderComponent.vue]
