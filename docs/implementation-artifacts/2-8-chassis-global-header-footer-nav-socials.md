# Story 2.8: Châssis global (header, footer, nav, socials)

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want un en-tête, un pied de page et une navigation refondus,
so that le site a un cadre cohérent sur toutes les pages (UX-DR11, FR4).

## Acceptance Criteria

1. **Given** le UI kit (Header/Footer) et les composants header/footer existants, **When** on refond le header fixe 56px (logo diamant), le footer 56px et la nav, **Then** ils rendent conformément au UI kit, dark-first et responsive mobile.
2. **Given** le châssis refondu, **When** on navigue, **Then** les hexagones sociaux sont présents (footer/contact) et la nav mène aux routes existantes (`/`, `/blog`, `/about`) + **`/services`** et **`/contact`**.

> Périmètre : **châssis global** (header fixe, footer, navigation, hexagones sociaux). Réutilise les primitives (`ZButton` 2.3, `ZBadge` 2.5) et l'iconographie (2.7). Les **pages** `/services` et `/contact` elles-mêmes sont les Epics 4 et 7 ; ici on n'ajoute que les **entrées de nav** vers ces routes (les pages peuvent être des stubs si non encore créées, ou les liens pointent vers les routes prévues).

## Tasks / Subtasks

- [ ] Tâche 1 — Refondre `HeaderComponent.vue` — header fixe 56px (AC: #1, #2)
  - [ ] Header **fixe/sticky** en haut, `height var(--header-height)` (56px), fond sombre (`--surface-0`/`--surface-1`), bordure basse hairline `--border-subtle`.
  - [ ] Brand : logo **diamant** (24px, cf. 2.7) + `jouan.ovh` en mono bold (`--font-mono`, `--text-strong`).
  - [ ] Nav desktop : liens mono `--fs-sm`, `--text-muted` ; hover `--text-strong` + `--surface-2` ; actif `--accent`.
  - [ ] Bloc droite : `ZBadge tone="success" dot` « Disponible », `ZButton variant="terminal" size="sm"` (Terminal) + `ZButton variant="primary" size="sm"` (« Démarrer un projet » → `/contact`).
  - [ ] Préserver l'ouverture du **terminal easter-egg** (le bouton Terminal déclenche `TerminalManagerComponent.createNewTerminal()` — déjà câblé via `TerminalButton`).
- [ ] Tâche 2 — Navigation + routes (AC: #2)
  - [ ] Items de nav : `Accueil` (`/`), `Services` (`/services`), `À propos` (`/about`), `Blog` (`/blog`), `Contact` (`/contact`) — via `<NuxtLink>`.
  - [ ] État actif géré par la route courante (`route.path`) ; `/blog/[...slug]` (article) marque `Blog` actif.
  - [ ] Ajouter les liens `/services` et `/contact` même si les pages sont créées dans les Epics 4/7 (créer des stubs minimaux si nécessaire pour ne pas casser le prerender — ou s'assurer que les routes existent).
- [ ] Tâche 3 — Responsive mobile (AC: #1)
  - [ ] En mobile, masquer la nav inline (`.hdr__nav` masquée < md, cf. kit.css `@media .hdr__nav { display:none }`) et fournir un menu accessible (réutiliser/améliorer le menu burger existant : focus sur 1er item, fermeture par overlay/Escape).
  - [ ] Conserver la navigation clavier (focus visible, Tab order).
- [ ] Tâche 4 — Refondre `FooterComponent.vue` (AC: #1, #2)
  - [ ] Footer dark-first : colonnes `// Navigation`, `// Projets`, `// Réseaux` (eyebrows mono uppercase `--ls-wider`) + bas de page `© 2026 Simon Jouan — jouan.ovh` et la ligne terminal (`anon.@jouan.ovh:~$ echo "merci de votre visite"`, partie commande en `--term-green`).
  - [ ] **Hexagones sociaux** (GitHub / X / LinkedIn) présents dans le footer (et réutilisables sur Contact, Epic 7).
  - [ ] Hauteur : le DS prescrit `--footer-height` 56px (UX-DR11) ; le UI kit `Footer.jsx` est un footer riche multi-colonnes (plus haut). Décider : barre 56px minimale **ou** footer riche du kit ; la mention « footer 56px » concerne la barre — privilégier le footer riche du UI kit avec une barre basse, et documenter. [Voir Dev Notes]
- [ ] Tâche 5 — Hexagones sociaux (AC: #2)
  - [ ] Refondre `HexagonLinkComponent.vue` / `LinkListComponent.vue` au style DS : hexagone `--surface-2`, glyphe `currentColor` (2.7), hover `background var(--accent)` + glyphe `--ink-on-accent` (cf. kit.css `.hex:hover`).
  - [ ] Centraliser les 3 liens (GitHub `zohac`, X `fenrir0680`, LinkedIn `simonjouan`) — repris de l'existant.
- [ ] Tâche 6 — Vérification (AC: #1, #2)
  - [ ] `yarn dev` : header fixe 56px sur toutes les pages, nav vers `/`, `/services`, `/about`, `/blog`, `/contact` ; footer + hexagones ; responsive mobile OK ; terminal s'ouvre toujours.
  - [ ] `yarn lint` (eslint + stylelint) vert ; `yarn generate` vert (toutes les routes prerendues, `CNAME` intact).

## Dev Notes

### Contexte & contraintes (depuis project-context.md et SPEC)

- **CAP-4** : header fixe 56px (logo diamant), footer 56px, nav fonctionnelle, hexagones sociaux ; conforme UI kit, dark-first, responsive mobile. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Capabilities (CAP-4)]
- **Routes ajoutées** : `/services` et `/contact` comme pages dédiées (CAP-6, CAP-9) ; ici, la **nav** doit y mener. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Decisions]
- **Layout DS** : header fixe `--header-height` 56px (logo diamant), footer 56px, hexagones = motif patrimonial du footer/contact. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Layout rules]
- **Easter-egg terminal conservé** : le bouton Terminal du header ne doit pas casser l'ouverture du terminal draggable. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints (CAP-10) ; docs/project-context.md#À préserver]
- **Port, pas copie** ; **tokens, pas de hardcode** ; **français, voix « je »/vouvoiement, pas d'emoji**. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]
- **Prerender + déploiement** : `CNAME` et la chaîne `yarn generate` → `gh-pages` non régressés ; accès DOM gardés (menu mobile, terminal). [Source: docs/project-context.md#Pièges]
- Dépend de 2.3 (`ZButton`), 2.5 (`ZBadge`), 2.7 (icônes/logo/glyphes). Tokens 2.1 + base 2.2.

### Fichiers à modifier / créer (lus — état actuel)

- **`components/HeaderComponent.vue`** (UPDATE/refonte) — état actuel : `<header>` grid, bouton burger logo `logo_white_32x32.png`, `<nav>` overlay mobile avec liens `Accueil`/`Blog`/`À propos` + `TerminalButton`, `TerminalManagerComponent`, `CurrentTime`. Styles legacy via `_color.$dark-background`, `variables.$header-height`, animations menu. À refondre : tokens DS, ajouter `Services`/`Contact`, brand diamant + nom, bloc droite (badge + 2 boutons), header **fixe**. Conserver le câblage terminal (`addNewTerminal`/`terminalManager`) et l'accessibilité menu (focus 1er item).
- **`components/FooterComponent.vue`** (UPDATE/refonte) — état actuel : footer 56px, « Made with ♥ and Nuxtjs », `_color.$aubergine-dark`, animation fadeIn. À refondre : colonnes nav/projets/réseaux + barre terminal, hexagones, tokens DS. Retirer l'emoji ♥ (règle « pas d'emoji » ; le ♥ est une entité `&#9829;` — remplaçable par la ligne terminal du kit).
- **`components/HexagonLinkComponent.vue`** (UPDATE) — état actuel : hexagone paramétrable via CSS vars, couleurs `_color.$gray-*`. Restyler aux tokens DS (`--surface-2`, hover `--accent`).
- **`components/LinkListComponent.vue`** (UPDATE) — état actuel : 3 `HexagonLinkComponent` avec glyphes GitHub/Twitter/LinkedIn inline. Réutiliser les glyphes centralisés (2.7) ; garder les URLs.
- **`pages/services.vue`, `pages/contact.vue`** (CREATE stub si absentes) — pour que les liens de nav ne cassent pas le prerender (les pages riches sont Epics 4/7). Vérifier l'arbo `pages/` existante.
- **Réf. UI kit** : `docs/design_system/ui_kits/jouan-site/Header.jsx`, `Footer.jsx`, `kit.css` (sélecteurs `.hdr*`, `.ftr*`, `.hex*`), `data.js` (liste `social`, `projects`), `icons.jsx`.

### Mapping depuis le UI kit (Header.jsx / Footer.jsx / kit.css)

- **Header** : items `[["home","Accueil"],["services","Services"],["about","À propos"],["blog","Blog"],["contact","Contact"]]` ; brand logo blanc + `<b>jouan.ovh</b>` ; right = `Badge success dot "Disponible"`, `Button terminal sm "Terminal"`, `Button primary sm "Démarrer un projet"` → contact. [Source: Header.jsx]
- **kit.css `.hdr`** : `position: sticky; top:0; z-index:50; height var(--header-height);` ; `.hdr__brand img { 24px }` ; `.hdr__link` mono `--fs-sm` `--text-muted`, hover `--text-strong`+`--surface-2`, `--active` `--accent` ; `.hdr__right { margin-left:auto; gap var(--space-3) }` ; `@media .hdr__nav { display:none }` (mobile). [Source: kit.css]
- **Footer** : colonnes `// Navigation`, `// Projets` (depuis `S.projects`), `// Réseaux` (hexagones depuis `S.social`) ; bas : `© 2026 …` + ligne `anon.@jouan.ovh:~$ echo "merci de votre visite"` (commande en `--term-green`). [Source: Footer.jsx]
- **kit.css `.ftr`/`.hex`** : `.ftr { background var(--surface-1); border-top 1px var(--border-subtle) }` ; `.hex { width:46px; height:53px; … }` hover `color var(--ink-on-accent); background var(--accent)` ; `.hex svg { 20px }`. [Source: kit.css]
- **Données sociales/projets** : reprendre de `data.js` (UI kit) et/ou de l'existant (`LinkListComponent` : GitHub `zohac`, Twitter `fenrir0680`, LinkedIn `simonjouan`).

### Pièges / régressions à éviter

- **Header 56px vs footer riche** : `--header-height`/`--footer-height` = 56px (UX-DR11). Le `Footer.jsx` du kit est multi-colonnes (plus haut que 56px) ; interpréter « footer 56px » comme la **barre** réglementaire, et livrer le footer riche du kit avec une barre basse. Documenter la décision en PR.
- **Ne pas casser le terminal** : garder `TerminalManagerComponent` + `addNewTerminal` ; le `ZButton variant="terminal"` doit appeler la même logique d'ouverture. (CAP-10 / NFR9)
- **Header fixe = compenser le contenu** : un header `position: fixed`/`sticky` peut masquer le haut du contenu → prévoir `padding-top`/scroll-margin sur le layout (sticky gère mieux le flux que fixed). Vérifier le layout `layouts/default.vue`.
- **Pas d'emoji** : retirer le ♥ du footer legacy. [Source: docs/project-context.md#Langue]
- **Routes manquantes au prerender** : `/services` et `/contact` doivent exister (stub minimal) sinon `nuxi generate` ou les `<NuxtLink>` peuvent 404. Vérifier `pages/`.
- **Accès DOM gardé** : menu mobile (toggle, focus, Escape) sous `onMounted`/`import.meta.client`. (NFR4)
- **Responsive** : nav inline masquée en mobile + menu accessible ; conserver la navigation clavier et le focus visible. (CAP-11)

### Project Structure Notes

- Le châssis vit dans `components/` (composants `*Component.vue`, convention de nommage existante) ; les primitives consommées sont dans `components/ui/`. Layout global `layouts/default.vue` orchestre header/footer. [Source: docs/project-context.md#Conventions de nommage, #Nuxt]

### Testing standards

- Pas de framework de test. Validation = `yarn lint` (eslint + stylelint) + **`yarn generate` vert** (toutes routes, `CNAME` présent dans `.output/public`) + vérif visuelle : header fixe 56px, nav 5 entrées, footer + hexagones, responsive mobile, terminal fonctionnel. [Source: docs/project-context.md#Tests, #Build & déploiement]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 2: Fondations du design system — Story 2.8]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#Capabilities (CAP-4), #Decisions (routes /services, /contact), #Constraints]
- [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Layout rules (header/footer 56px, hexagones)]
- [Source: docs/design_system/ui_kits/jouan-site/Header.jsx, Footer.jsx, kit.css, icons.jsx, data.js]
- [Source: components/HeaderComponent.vue, FooterComponent.vue, HexagonLinkComponent.vue, LinkListComponent.vue (état actuel)]
- [Source: docs/project-context.md#Conventions de nommage, #À préserver (terminal), #Pièges (prerender, CNAME)]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
