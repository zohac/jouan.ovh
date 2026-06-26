---
baseline_commit: 2b1879d08e31ce7e86efe6a9bea7600e67d26551
---

# Story 7.2: Infos, CTA terminal et socials

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want des moyens de contact alternatifs,
so that je choisis comment joindre Simon (UX-DR16, FR9).

## Acceptance Criteria

1. **Given** la référence `Contact.jsx`, **When** on implémente la carte infos, le CTA terminal et les liens sociaux hexagonaux, **Then** ils rendent conformément à la référence.
2. **Given** le CTA terminal, **When** on l'active, **Then** le CTA terminal ouvre l'easter-egg terminal.

> Périmètre : **colonne droite de `Contact.jsx`** sur la route `/contact` (créée en story 7.1) — carte infos (email / localisation / disponibilité), carte CTA terminal qui **ouvre** l'easter-egg, et rangée d'hexagones sociaux. S'appuie sur l'ouverture du terminal **déjà fonctionnelle** (`TerminalManagerComponent`). Le **restyle** du terminal (fenêtre/prompt au DS) est l'**Epic 8** — ne pas en dépendre : il suffit que l'ouverture marche.

## Tasks / Subtasks

- [x] Tâche 1 — Carte infos (AC: #1)
  - [x] Dans la colonne droite de `pages/contact.vue`, ajouter une carte (`ZCard`) avec trois `infoitem` : `// email` (lien `mailto:` en `var(--term-blue)`), `// localisation` (ville), `// disponibilité` (badge `Ouvert aux missions freelance`)
  - [x] Alimenter le contenu depuis les données du site (email, ville, disponibilité) — cf. `data.js` (`window.SITE`)
  - [x] Le badge de disponibilité utilise `ZBadge` (Epic 2, story 2.5) tone `success` avec point (`dot`)
- [x] Tâche 2 — Carte CTA terminal (AC: #1, #2)
  - [x] Ajouter une carte « offer » au fond terminal (`var(--bg-terminal)`, bordure aubergine) avec la ligne prompt `anon.@jouan.ovh:~$ ./contact` et un court texte d'invite français
  - [x] Bouton `ZButton` variante `terminal`, taille `sm`, icône terminal, libellé `Ouvrir le terminal`
  - [x] Au clic, **ouvrir l'easter-egg terminal** via le mécanisme existant (cf. Dev Notes — `TerminalManagerComponent.createNewTerminal()`)
- [x] Tâche 3 — Hexagones sociaux (AC: #1)
  - [x] Ajouter la rangée d'hexagones sociaux (`hexrow`) en bas de la colonne droite, un hexagone par réseau (GitHub, Twitter/X, LinkedIn)
  - [x] Réutiliser le composant existant `HexagonLinkComponent` (et/ou le pattern de `LinkListComponent`) avec les glyphes SVG inline et les URLs de `data.js` (`window.SITE.social`) ; liens en `target="_blank" rel="noreferrer"`, `title`/`aria-label` par réseau
- [x] Tâche 4 — Style via tokens & dark-first (AC: #1)
  - [x] Styler en SCSS scoped via tokens (aucune valeur hardcodée — NFR2) ; `@use` (jamais `@import`)
  - [x] Labels `// email`/`// localisation`/… en Ubuntu Mono ; ligne prompt en mono `var(--term-green)` ; respecter dark-first
- [x] Tâche 5 — Vérification (AC: #1, #2)
  - [x] `yarn dev` : la colonne droite rend la carte infos + carte CTA + hexagones ; le clic sur « Ouvrir le terminal » ouvre une fenêtre de terminal fonctionnelle
  - [x] `yarn lint` ne régresse pas ; accès DOM gardés (compatibilité prerender)

## Dev Notes

### Contexte & contraintes (depuis project-context.md et SPEC)

- **S'inscrit dans `pages/contact.vue`** créé en **story 7.1** : cette story remplit la **colonne droite** de la grille `contact__grid`. [Source: docs/specs/spec-design-system-revamp/pages.md#Contact]
- **Easter-egg terminal conservé** : feature à préserver, jamais supprimer. L'ouverture est **déjà fonctionnelle** dans le code. [Source: docs/project-context.md#À préserver ; SPEC.md#Constraints]
- **Tokens, pas de valeurs en dur** ; SCSS `@use` (jamais `@import`) ; styles scoped. [Source: docs/project-context.md#SCSS]
- **Port, pas copie** : recréer la colonne droite de `Contact.jsx` en Vue 3 `<script setup>`, pas de copier-coller JSX. [Source: SPEC.md#Constraints]
- **Langue & voix** : français, 1re personne, vouvoiement, pas d'emoji. [Source: docs/project-context.md#Langue]
- **Pas de framework de test** : barre = lint + `yarn dev`/`generate` verts. [Source: docs/project-context.md#Tests]

### Dépendances de stories

- **Dépend de story 7.1** (route `/contact` + grille de page) et de **Epic 2** : `ZCard` (2.4), `ZBadge` (2.5), `ZButton` (2.3), tokens (2.1/2.2), iconographie (2.7).
- **Dépend de l'ouverture du terminal existante** (sous-système `components/terminal/`) — qui fonctionne déjà.
- **Ne dépend PAS** du **restyle terminal (Epic 8)** : le CTA doit seulement **ouvrir** le terminal ; son apparence finale est traitée séparément. Ne pas bloquer cette story sur Epic 8.

### Mécanisme d'ouverture du terminal (existant — à réutiliser)

- L'ouverture passe par **`components/terminal/TerminalManagerComponent.vue`**, qui expose `createNewTerminal(terminalConfig?)` et instancie un `TerminalComponent` draggable par terminal.
- Pattern de référence : `components/HeaderComponent.vue` — il monte `<TerminalManagerComponent ref="terminalManager" />` puis appelle `terminalManager.value.createNewTerminal()` (déclenché par `TerminalButton` via l'évènement `open-terminal`).
- Options d'implémentation pour le CTA de la page Contact (choisir la plus simple sans dupliquer d'état) :
  - Réutiliser la **même instance de `TerminalManager`** que le header si elle est accessible (terminal global du châssis), pour éviter deux gestionnaires concurrents ;
  - sinon, monter une instance de `TerminalManagerComponent` dans `pages/contact.vue` et appeler `createNewTerminal()` au clic du `ZButton` (calquer le pattern du header).
- Le terminal manipule le DOM (draggable) : son montage/ouverture doit rester **gardé client** (le composant gère déjà l'easter-egg) — ne pas introduire d'accès `window`/`document` non gardé côté page. [Source: components/terminal/TerminalManagerComponent.vue ; components/HeaderComponent.vue ; docs/project-context.md#Nuxt]

### Mapping depuis `Contact.jsx` (colonne droite → Vue)

- `div.contact__info` contient, dans l'ordre :
  - **Carte infos** (`<Card>`) : trois `infoitem` (`k` = label mono, `v` = valeur) — `// email` (`<a mailto:>` `var(--term-blue)`), `// localisation` (`S.city`), `// disponibilité` (`<Badge tone="success" dot>Ouvert aux missions freelance</Badge>`). → `ZCard` + `ZBadge`.
  - **Carte CTA terminal** (`<Card className="offer">`, `background: var(--bg-terminal)`, `borderColor: hsl(319 40% 30% / 0.5)`) : ligne mono `anon.@jouan.ovh:~$ ./contact`, prose d'invite, `<Button variant="terminal" size="sm" icon={terminal} onClick={openTerminal}>Ouvrir le terminal</Button>`. → `ZCard` + `ZButton` ; `onClick` → ouverture terminal.
  - **`div.hexrow`** : `S.social.map(...)` → un `<a class="hex">` par réseau avec glyphe SVG inline. → réutiliser `HexagonLinkComponent` / pattern `LinkListComponent`.
- Données : email/ville/social repris de `data.js` (`window.SITE`) ; ne pas inventer de copy au-delà de la réf. [Source: docs/design_system/ui_kits/jouan-site/Contact.jsx ; data.js]

### Pièges / régressions à éviter

- **Ne pas casser l'ouverture du terminal** : réutiliser le mécanisme existant (`createNewTerminal`) plutôt que d'en réécrire un. Éviter deux `TerminalManager` qui se marchent dessus si un terminal global existe déjà (header).
- **Ne pas** dépendre du restyle terminal (Epic 8) : tester l'**ouverture**, pas l'apparence finale du terminal.
- **Ne pas** hardcoder couleurs/espaces (`--bg-terminal`, `--term-green`, `--term-blue`, la bordure aubergine, etc. proviennent des tokens — Epic 2).
- Hexagones : réutiliser le composant existant `HexagonLinkComponent` (déjà tokenisé) plutôt que de redéfinir la géométrie hexagonale ; ajuster seulement le mapping de données/icônes si besoin.
- Le `✓`/glyphes ne sont pas des emoji ; pas d'emoji ajouté (NFR6).

### Project Structure Notes

- Édite `pages/contact.vue` (créé en 7.1) ; réutilise `components/HexagonLinkComponent.vue`, `components/LinkListComponent.vue`, `components/terminal/TerminalManagerComponent.vue`. Aucune base de données / entité.
- Pas d'impact sur les autres routes ; l'entrée de nav vers `/contact` reste portée par le châssis (story 2.8).

### Testing standards

- Pas de framework de test. Validation = `yarn lint` (ne pas dégrader) + **`yarn dev`** : la colonne droite rend infos + CTA + hexagones conformément à la réf, et le clic sur le CTA **ouvre** le terminal (commandes existantes non testées ici — c'est l'Epic 8). Vérifier `yarn generate` (prerender) reste vert. [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 7: Page Contact — Story 7.2]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#Capabilities (CAP-9, CAP-10), #Constraints]
- [Source: docs/specs/spec-design-system-revamp/pages.md — Notes par page#Contact, #Layout global]
- [Source: docs/design_system/ui_kits/jouan-site/Contact.jsx — carte infos + carte CTA terminal + `hexrow`]
- [Source: docs/design_system/ui_kits/jouan-site/data.js — `window.SITE` (email, city, social)]
- [Source: docs/design_system/ui_kits/jouan-site/icons.jsx — glyphes terminal / sociaux]
- [Source: components/terminal/TerminalManagerComponent.vue ; components/HeaderComponent.vue — mécanisme d'ouverture]
- [Source: components/HexagonLinkComponent.vue ; components/LinkListComponent.vue — hexagones sociaux]

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Claude Code, workflow bmad-dev-story)

### Debug Log References

- `pnpm lint` / `pnpm typecheck` / `pnpm generate` (Docker) : tous PASS ; `/contact` prerendu.
- Vérif Chrome DevTools MCP : colonne droite (infos email/localisation/dispo, carte CTA terminal aubergine, hexagones GitHub/Twitter/LinkedIn) fidèle à `Contact.jsx`, desktop + mobile (→ 1 colonne) ; **clic « Ouvrir le terminal » → la fenêtre terminal s'ouvre** (logo ASCII + prompt vert). Console propre.
- ⚠️ Faux négatif initial : le 1er clic n'ouvrait rien à cause de `504 (Outdated Optimize Dep)` Vite (cache de pré-bundling périmé après `docker compose restart`) → l'import dynamique du terminal échouait. **Un reload purge le cache** ; ensuite l'ouverture fonctionne. (Même famille de piège transitoire dev que la base SQLite content après generate.)

### Completion Notes List

- Complète la colonne droite de `app/pages/contact.vue` (placeholder 7.1 → contenu), porté de `Contact.jsx` :
  - **Carte infos** (`ZCard`) : 3 `infoitem` (label mono `// email`/`// localisation`/`// disponibilité`) — email `mailto:` en `--term-blue` (ring de focus a11y), ville, et `ZBadge tone="success" dot` « Ouvert aux missions freelance ». Données `contact = { email, city }` (data.js).
  - **Carte CTA terminal** (`ZCard` fond `--bg-terminal`, bordure `--accent-2-soft`) : ligne prompt mono `anon.@jouan.ovh:~$ ./contact` (vert + `./contact` off-white), invite, `ZButton variant="terminal" size="sm"` + `ZIcon name="terminal"`.
  - **Hexagones sociaux** : réutilisation directe de `<LinkListComponent />` (rangée `hexrow` partagée avec le footer ; `HexagonLinkComponent` + `ZIcon`, liens `_blank rel=noopener noreferrer`, label sr-only).
- **Ouverture du terminal (AC #2)** : via le composable partagé `useTerminal().open()` — le `TerminalManagerComponent` reste monté **une seule fois** dans le header (pas de 2ᵉ gestionnaire). `open()` est un **no-op au prerender** (aucun lanceur enregistré) → prerender-safe ; côté client il déclenche `createNewTerminal()`. Aucune dépendance au restyle terminal (Epic 8).
- Tokens uniquement, `<style scoped>`, primitives globales consommées. La colonne droite hérite de la grille `contact__grid` (1fr / 0.8fr → 1 colonne sous 900px) posée en 7.1.

### File List

- `app/pages/contact.vue` (MODIFIÉ — colonne droite : carte infos `ZCard`/`ZBadge`, carte CTA terminal, `LinkListComponent` ; script `contact` + `useTerminal` ; styles colonne droite)
- `docs/implementation-artifacts/7-2-infos-cta-terminal-et-socials.md` (MODIFIÉ — frontmatter `baseline_commit`, tâches, Dev Agent Record, statut)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIÉ — statut story `ready-for-dev` → `in-progress` → `review`)

## Change Log

| Date       | Version | Description                                                                                          |
| ---------- | ------- | ---------------------------------------------------------------------------------------------------- |
| 2026-06-26 | 0.1     | Implémentation story 7.2 — colonne droite de `/contact` : carte infos (`ZBadge` dispo), carte CTA terminal (ouvre l'easter-egg via `useTerminal`), hexagones sociaux (`LinkListComponent`). |
| 2026-06-26 | 0.2     | Revue de code : aucune violation (Edge `[]`, Auditor OK). 1 patch appliqué (prompt décoratif `aria-hidden`) ; 2 différés Epic 9 (sémantique a11y infos, DRY `SITE`). Build vert + AC #2 vérifiée au navigateur (le CTA ouvre le terminal). Statut → `done`. |

## Review Findings

_Code review (bmad-code-review) — 2026-06-26. Couches : Blind Hunter (diff seul) · Edge Case Hunter (diff + projet, retour `[]`) · Acceptance Auditor (diff + SPEC/ticket/`Contact.jsx`). Verdict : AC #1 et AC #2/CAP-10 satisfaites, aucune violation dure ; `useTerminal()` (registre partagé, no-op prerender, pas de 2ᵉ TerminalManager), `ZCard`/`ZBadge`/`ZButton`/`ZIcon`, `LinkListComponent` (rel + sr-only) et tokens tous vérifiés sains. Implémentation propre._

- [ ] [Review][Patch] a11y — la ligne de prompt décorative `anon.@jouan.ovh:~$ ./contact` est un `<p>` réel, lue **verbatim** par les lecteurs d'écran (« anon point at jouan point ovh… »). L'ajouter en `aria-hidden="true"` (le bouton « Ouvrir le terminal » + le texte d'invite portent déjà le sens). [app/pages/contact.vue (.contact__prompt)]
- [x] [Review][Defer] a11y sémantique de la carte infos : les `infoitem` sont des `<div>` label/valeur (pas de `<dl>/<dt>/<dd>` ni `aria`), le préfixe `//` est lu « slash slash », la colonne droite n'a pas de titre, et le CTA terminal pourrait porter `aria-haspopup="dialog"`. Fidèle au kit mais améliorable. — deferred, lot a11y Epic 9 (avec eyebrow→titre + listes home/services). _(Note DRY : `contact.email`/`city` sont inline ici comme `profile.email` dans `/about` — candidat à une constante `SITE` partagée, future consolidation.)_

_Rejetés (bruit / faux positifs vérifiés)_ : `@click` non forwardé par `ZButton` (FAUX — forwardé via `passthroughAttrs` ; pattern déjà utilisé au hero 3.1) ; `ZIcon` non `aria-hidden` (FAUX — décoratif par défaut sans `label`) ; ring de focus email forced-colors (FAUX — `outline: 2px transparent` **est** le repli) ; override de spécificité `ZCard` (vérifié : gagne ; + c'est le pattern du kit `.offer`) ; bordure terminal `--accent-2-soft` 28% vs kit 50% (c'est le **token DS de bordure terminal**, identique à `ZButton variant="terminal"` → usage DS correct, la valeur kit était le prototype) ; double espacement gap+margin (FAUX — contextes différents : gap entre cartes, margin entre infoitems dans la carte) ; liens sociaux non sûrs (vérifié : `target=_blank rel="noopener noreferrer"` + libellé sr-only) ; `badge dot` couleur seule (FAUX — le texte « Ouvert… » porte le sens, `dot` `aria-hidden`) ; indication « nouvel onglet » socials (item 3.3 déjà tracé Epic 9) ; `mailto` scraper-bait / no-JS (conformes spec, standard) ; `.prose` sur l'invite (fidèle kit, primitive corps de texte) ; contraste `--term-blue` (token DS) ; icône Twitter `x` vs `twitter` (même glyphe, choix pré-existant du composant partagé) ; `rel` `noopener noreferrer` vs `noreferrer` du kit (sécurité-positif) ; `as const` (inoffensif).
