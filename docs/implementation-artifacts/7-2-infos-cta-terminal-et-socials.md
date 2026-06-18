# Story 7.2: Infos, CTA terminal et socials

Status: ready-for-dev

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

- [ ] Tâche 1 — Carte infos (AC: #1)
  - [ ] Dans la colonne droite de `pages/contact.vue`, ajouter une carte (`ZCard`) avec trois `infoitem` : `// email` (lien `mailto:` en `var(--term-blue)`), `// localisation` (ville), `// disponibilité` (badge `Ouvert aux missions freelance`)
  - [ ] Alimenter le contenu depuis les données du site (email, ville, disponibilité) — cf. `data.js` (`window.SITE`)
  - [ ] Le badge de disponibilité utilise `ZBadge` (Epic 2, story 2.5) tone `success` avec point (`dot`)
- [ ] Tâche 2 — Carte CTA terminal (AC: #1, #2)
  - [ ] Ajouter une carte « offer » au fond terminal (`var(--bg-terminal)`, bordure aubergine) avec la ligne prompt `anon.@jouan.ovh:~$ ./contact` et un court texte d'invite français
  - [ ] Bouton `ZButton` variante `terminal`, taille `sm`, icône terminal, libellé `Ouvrir le terminal`
  - [ ] Au clic, **ouvrir l'easter-egg terminal** via le mécanisme existant (cf. Dev Notes — `TerminalManagerComponent.createNewTerminal()`)
- [ ] Tâche 3 — Hexagones sociaux (AC: #1)
  - [ ] Ajouter la rangée d'hexagones sociaux (`hexrow`) en bas de la colonne droite, un hexagone par réseau (GitHub, Twitter/X, LinkedIn)
  - [ ] Réutiliser le composant existant `HexagonLinkComponent` (et/ou le pattern de `LinkListComponent`) avec les glyphes SVG inline et les URLs de `data.js` (`window.SITE.social`) ; liens en `target="_blank" rel="noreferrer"`, `title`/`aria-label` par réseau
- [ ] Tâche 4 — Style via tokens & dark-first (AC: #1)
  - [ ] Styler en SCSS scoped via tokens (aucune valeur hardcodée — NFR2) ; `@use` (jamais `@import`)
  - [ ] Labels `// email`/`// localisation`/… en Ubuntu Mono ; ligne prompt en mono `var(--term-green)` ; respecter dark-first
- [ ] Tâche 5 — Vérification (AC: #1, #2)
  - [ ] `yarn dev` : la colonne droite rend la carte infos + carte CTA + hexagones ; le clic sur « Ouvrir le terminal » ouvre une fenêtre de terminal fonctionnelle
  - [ ] `yarn lint` ne régresse pas ; accès DOM gardés (compatibilité prerender)

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

### Debug Log References

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.

### File List
