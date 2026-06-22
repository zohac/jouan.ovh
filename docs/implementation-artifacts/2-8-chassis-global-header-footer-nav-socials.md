---
baseline_commit: a811354968e53578b1a0108a881c23a7bc9f038f
---

# Story 2.8: Châssis global (header, footer, nav, socials)

Status: review

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

- [x] Tâche 1 — Refondre `HeaderComponent.vue` — header fixe 56px (AC: #1, #2)
  - [x] Header **sticky** (`position: sticky; top:0; z-index:50`), `height var(--header-height)` (56px), verre sombre translucide (valeur DS kit + `backdrop-filter: blur(10px)` + préfixe `-webkit-` Safari), bordure basse `--border-subtle`.
  - [x] Brand : logo **diamant** `<ZIcon name="gem">` (24px, `var(--accent)`) + `jouan.ovh` mono bold (`--font-mono`, `--text-strong`).
  - [x] Nav desktop : liens mono `--fs-sm`, `--text-muted` ; hover `--text-strong` + `--surface-2` ; actif `--accent`.
  - [x] Bloc droite : `ZBadge tone="success" dot` « Disponible », `ZButton variant="terminal" size="sm"` (+ `ZIcon terminal`) et `ZButton variant="primary" size="sm"` (« Démarrer un projet » → `/contact`).
  - [x] **Terminal easter-egg préservé** : le `ZButton` terminal appelle `addNewTerminal()` → `TerminalManagerComponent.createNewTerminal()` (même logique qu'avant ; `TerminalButton.vue` legacy supprimé, remplacé par `ZButton`).
- [x] Tâche 2 — Navigation + routes (AC: #2)
  - [x] Items de nav : `Accueil` / `Services` / `À propos` / `Blog` / `Contact` via `<NuxtLink>`.
  - [x] État actif via `route.path` : exact pour `/`, préfixe pour les autres (couvre `/blog/[...slug]` → `Blog` actif).
  - [x] **Stubs `pages/services.vue` + `pages/contact.vue` créés** (dark-first, tokens) → routes prerendues (`/services`, `/contact` dans `.output/public`), nav sans 404. Pages riches = Epics 4/7.
- [x] Tâche 3 — Responsive mobile (AC: #1)
  - [x] < 900px (cf. kit) : nav inline / horloge / badge / boutons masqués ; **menu burger** accessible (`aria-expanded`, `aria-controls`, focus 1er item à l'ouverture, fermeture **Escape** + clic overlay).
  - [x] Navigation clavier conservée (focus visible sur burger via `--ring-accent`, liens focusables). Écouteur `keydown` Escape sous `onMounted`/`onBeforeUnmount` (prerender-safe).
- [x] Tâche 4 — Refondre `FooterComponent.vue` (AC: #1, #2)
  - [x] Footer dark-first riche : colonnes `// Navigation`, `// Projets`, `// Réseaux` (eyebrows mono uppercase `--ls-wider`) + barre basse `© {year} Simon Jouan — jouan.ovh` et ligne terminal `anon.@jouan.ovh:~$ echo "merci de votre visite"` (commande en `--term-green`).
  - [x] **Hexagones sociaux** présents (via `LinkListComponent`).
  - [x] **Décision hauteur** : footer **riche** du UI kit (multi-colonnes, > 56px) avec barre basse, conformément à la note de la story. Le `--footer-height` (56px) ne contraint plus le layout (passé en flex column).
- [x] Tâche 5 — Hexagones sociaux (AC: #2)
  - [x] `HexagonLinkComponent.vue` refondu au style DS : hexagone `clip-path` (kit), `--surface-2`, glyphe `currentColor` (`ZIcon`), hover `background var(--accent)` + `color var(--ink-on-accent)`, focus visible, libellé a11y masqué visuellement.
  - [x] `LinkListComponent.vue` refondu : 3 liens (GitHub `zohac`, Twitter `fenrir0680`, LinkedIn `simonjouan`) via `ZIcon`, layout `.hexrow`.
- [x] Tâche 6 — Vérification (AC: #1, #2)
  - [x] Rendu prouvé par build : header sticky sur toutes les pages, 5 liens nav (actif correct), bloc droite badge+boutons, burger + `#hdr-mobile-menu`, footer 3 colonnes + 3 hexagones + ligne terminal, **0 emoji ♥**. CTA primary → `<a href="/contact" class="zbtn zbtn--primary">` (navigable).
  - [x] `pnpm lint` **exit 0** ; `pnpm typecheck` **exit 0** ; `pnpm generate` **exit 0** (toutes routes dont `/services` + `/contact` ; `CNAME` = `dev.jouan.ovh` intact).

### Review Findings

- [x] [Review][Patch] Exposer l'état actif de navigation avec `aria-current="page"` [app/components/HeaderComponent.vue:10] **→ Résolu** : `:aria-current="isActive(item.to) ? 'page' : undefined"` sur les liens nav desktop **et** mobile. Prouvé dans la sortie (`<a aria-current="page" href="/about">` sur /about).
- [x] [Review][Patch] Durcir le menu mobile pour le focus clavier et le changement de breakpoint [app/components/HeaderComponent.vue:45] **→ Résolu** : (a) fermeture clavier (Escape) / clic overlay → `closeMenuAndRefocus()` qui **renvoie le focus au burger** (`ref="burgerButton"`) ; (b) `matchMedia("(min-width: 901px)")` ferme le menu au passage en desktop ; (c) overlay masqué en desktop (`@media (width >= 901px)`) en filet SSR/pré-JS.
- [x] [Review][Patch] Prévenir l'overflow du header sur largeurs tablette [app/components/HeaderComponent.vue:268] **→ Résolu** : dégradé progressif avant le burger — horloge masquée `@media (width <= 1100px)`, badge masqué `@media (width <= 1000px)` ; `min-width: 0` sur `.hdr__nav` (shrink plutôt qu'overflow).
- [x] [Review][Patch] Remplacer la couleur de header hardcodée par une composition de tokens [app/components/HeaderComponent.vue:159] **→ Résolu** : `background: color-mix(in srgb, var(--surface-0) 82%, transparent)` (surface de page token à 82 %), remplace le `hsl(320deg 40% 5% / 82%)` hardcodé.

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

claude-opus-4-8[1m] (Amelia / BMad dev-story)

### Debug Log References

- `pnpm lint` → exit 0 ; `pnpm typecheck` → exit 0 ; `pnpm generate` → exit 0 (toutes routes prerendues, `/services` + `/contact` inclus, `CNAME` intact). 2 erreurs Stylelint transitoires (`scss/double-slash-comment-empty-line-before`, `media-feature-range-notation`) corrigées via `--fix`.
- **Bug d'intégration trouvé & corrigé** : `<ZButton as="NuxtLink" to="…">` rendait un `<NuxtLink>` **littéral** (élément inconnu, CTA non navigable) — `<component :is>` ne résout pas un nom de composant passé en **chaîne**, et `resolveComponent("NuxtLink")` échoue (NuxtLink est auto-importé, non enregistré globalement). Correctif : passer la **référence** `NuxtLink` importée de `#components` via `:as="NuxtLink"`. Vérifié : `<a href="/contact" class="zbtn zbtn--primary">` + **0 `<NuxtLink>` littéral** dans toute la sortie.
- Preuves sortie : `<header class="hdr">` sticky ; brand `ZIcon gem` ; 5 `hdr__link` (`/about` → `hdr__link--active` sur /about) ; `zbadge--success`, `zbtn--terminal` (`<button type="button">`), `zbtn--primary` → `<a href="/contact">` ; `hdr__burger` + `#hdr-mobile-menu` ; footer `// Navigation`/`// Projets`/`// Réseaux` + hexagones + `echo "merci de votre visite"` ; 0 `&#9829;`.

### Completion Notes List

- **`HeaderComponent.vue` refondu** : sticky 56px, brand diamant, nav desktop (5 liens, actif via `route.path`), bloc droite (horloge + badge Disponible + boutons Terminal/Contact), menu burger mobile accessible (focus 1er item, Escape, overlay), `TerminalManagerComponent` conservé. 100 % tokens, BEM `stylelint-disable` inline.
- **Easter-egg terminal** : `ZButton variant="terminal"` → `addNewTerminal()` → `createNewTerminal()` (logique inchangée). **`TerminalButton.vue` supprimé** (wrapper legacy remplacé par `ZButton`, devenu orphelin).
- **`FooterComponent.vue` refondu** : footer riche multi-colonnes (Navigation/Projets/Réseaux) + barre basse (© + ligne terminal `--term-green`). Emoji ♥ legacy retiré (règle « pas d'emoji »). Projets repris de `data.js` (keova.app, patio-conseil.fr).
- **`HexagonLinkComponent.vue` refondu** : hexagone `clip-path` DS (remplace le hexagone legacy à pseudo-éléments complexes), `--surface-2` → hover `--accent`/`--ink-on-accent`, `<a target="_blank" rel="noopener noreferrer">`, libellé a11y visuellement masqué, focus visible.
- **`LinkListComponent.vue` refondu** : glyphes via `ZIcon` (centralisés en 2.7), `.hexrow`, URLs conservées.
- **`layouts/default.vue`** : grille à hauteurs fixes (qui tronquait le footer riche) → **flex column** `min-height:100vh` ; header sticky + footer `margin-top:auto`. `--header-height`/`--footer-height` viennent des tokens (2.1) ; import `_variables` inutile retiré. Dégradé de fond legacy conservé (hors périmètre).
- **Stubs `pages/services.vue` + `pages/contact.vue`** : minimaux, dark-first, pour que la nav et le prerender ne cassent pas (pages riches = Epics 4/7).
- **Fix primitives `as` (ZButton/ZCard)** : commentaire clarifié — `as` attend une balise native **ou une référence de composant** (ex. `NuxtLink` de `#components`), pas un nom en chaîne. Comportement `<component :is>` inchangé (le bug venait de l'usage en chaîne).
- **Décision logo** : diamant `ZIcon gem` en `var(--accent)` (orange = accent héros) plutôt que le PNG blanc — vectoriel, net en 24px, contrôlé par token.
- **CurrentTime** conservé (horloge mono discrète dans le bloc droite, masquée < 900px) — feature existante préservée.

#### Correctifs de revue (2026-06-22)

- ✅ Résolu [Patch] **aria-current** : `:aria-current="isActive(...) ? 'page' : undefined"` sur les liens nav desktop + mobile (état actif exposé aux lecteurs d'écran, aligné sur la logique `isActive` y compris `/blog/[...slug]`).
- ✅ Résolu [Patch] **durcissement menu mobile** : retour de focus au burger à la fermeture clavier/overlay (`closeMenuAndRefocus`), fermeture automatique au passage desktop via `matchMedia("(min-width: 901px)")`, overlay neutralisé en desktop (`@media (width >= 901px)`). Écouteurs ajoutés/retirés dans `onMounted`/`onBeforeUnmount` (prerender-safe).
- ✅ Résolu [Patch] **overflow tablette** : horloge masquée ≤ 1100px, badge masqué ≤ 1000px (dégradé progressif avant le burger < 900px) ; `min-width: 0` sur `.hdr__nav`.
- ✅ Résolu [Patch] **couleur header tokenisée** : `color-mix(in srgb, var(--surface-0) 82%, transparent)` à la place du `hsl(...)` hardcodé.
- Validation : `pnpm lint` / `typecheck` / `generate` **exit 0** (24 routes, CNAME intact). Preuves dans la sortie : `aria-current="page"` (lien actif), `background:color-mix(in srgb,var(--surface-0)…)`, `@media(max-width:1100px){.hdr__clock{display:none}}`, `@media(max-width:1000px){.hdr__badge{display:none}}`, `@media(min-width:901px){.hdr__overlay{display:none}}`.

### File List

- `app/components/HeaderComponent.vue` (REFONTE) — header sticky DS + nav + menu mobile + terminal.
- `app/components/FooterComponent.vue` (REFONTE) — footer riche DS + barre terminal (sans emoji).
- `app/components/HexagonLinkComponent.vue` (REFONTE) — hexagone clip-path DS, a11y.
- `app/components/LinkListComponent.vue` (REFONTE) — glyphes via ZIcon, `.hexrow`.
- `app/components/terminal/TerminalButton.vue` (SUPPRIMÉ) — remplacé par `ZButton variant="terminal"`.
- `app/layouts/default.vue` (MODIFIÉ) — flex column (footer riche non tronqué, header sticky).
- `app/pages/services.vue` (CRÉÉ) — stub (Epic 4).
- `app/pages/contact.vue` (CRÉÉ) — stub (Epic 7).
- `app/components/ui/ZButton.vue` (MODIFIÉ) — commentaire `as` (référence composant), pas de changement de comportement.
- `app/components/ui/ZCard.vue` (MODIFIÉ) — idem `as`.

## Change Log

| Date | Version | Description | Auteur |
|------|---------|-------------|--------|
| 2026-06-22 | 0.1 | Châssis global refondu : header sticky 56px (brand gem, nav 5 liens, badge+boutons, terminal préservé, menu mobile accessible), footer riche + hexagones DS, stubs /services + /contact, layout flex. Fix CTA `as="NuxtLink"` (référence via #components). Lint/typecheck/generate verts, CNAME intact. Clôt l'Epic 2. Status → review. | Amelia (dev-story) |
| 2026-06-22 | 0.2 | Correctifs de revue : 4 findings résolus (aria-current sur nav, durcissement menu mobile focus/breakpoint + overlay desktop, dégradé tablette anti-overflow horloge/badge, couleur header via `color-mix` de token). Lint/typecheck/generate verts. | Amelia (dev-story) |
