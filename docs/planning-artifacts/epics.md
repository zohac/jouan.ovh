---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories']
inputDocuments:
  - docs/specs/spec-design-system-revamp/SPEC.md
  - docs/specs/spec-design-system-revamp/pages.md
  - docs/specs/spec-design-system-revamp/primitives.md
  - docs/project-context.md
---

# jouan.ovh - Epic Breakdown

## Overview

Ce document décompose la refonte de jouan.ovh sur le nouveau design system
(contrat : `SPEC-design-system-revamp`) en épics et stories implémentables.
Sources : SPEC.md (capacités/contraintes), pages.md + primitives.md (UX),
project-context.md (technique).

## Requirements Inventory

### Functional Requirements

FR1: Migrer le projet vers une stack à jour (Nuxt 4, abandon de `@nuxt/bridge-edge`, deps actuelles) avant toute refonte visuelle. _(CAP-1)_
FR2: Rendre les tokens du design system (couleurs, typo, espacement, rayons, élévation, motion, polices) disponibles comme source unique de vérité du style. _(CAP-2)_
FR3: Recréer les primitives du DS en composants Vue 3 réutilisables. _(CAP-3)_
FR4: Refondre le châssis global (header fixe, footer, navigation, liens sociaux hexagonaux). _(CAP-4)_
FR5: Page d'accueil = hero Terminal (A) + aperçu services + stats + projets sélectionnés. _(CAP-5)_
FR6: Page Services = 3 offres (WordPress / Applications web / IA) + étapes du process (route `/services`). _(CAP-6)_
FR7: Page À-propos = portrait, bio, timeline expérience, formation, stack. _(CAP-7)_
FR8: Blog = index (+ empty-state) et vue article prose + code via `@nuxt/content`. _(CAP-8)_
FR9: Page Contact = formulaire + carte infos + CTA terminal + socials (route `/contact`). _(CAP-9)_
FR10: Conserver et restyler l'easter-egg terminal draggable selon le DS. _(CAP-10)_
FR11: Respecter les fondamentaux d'accessibilité et de motion du DS. _(CAP-11)_

### NonFunctional Requirements

NFR1: Dark-first uniquement — aucun thème clair ; orange Ubuntu = unique accent héros.
NFR2: Aucune valeur de couleur/espace/rayon hardcodée ; tout passe par les tokens.
NFR3: Port, pas copie — recréation en Vue 3 `<script setup>` + SCSS `@use` (jamais `@import`).
NFR4: Compatibilité prerender — tout passe `nuxi generate`, accès DOM gardés.
NFR5: Déploiement préservé — `CNAME` + chaîne `yarn generate` → `gh-pages` non régressés.
NFR6: Langue & voix — français, 1re personne « je », vouvoiement, pas d'emoji.
NFR7: Typo signature — Ubuntu Mono (titres/labels/code), Ubuntu sans (corps long).
NFR8: Séquencement — la migration (FR1) doit être livrée et verte avant FR2+.
NFR9: Easter-egg terminal préservé — aucune commande existante cassée.

### Additional Requirements

- Gestionnaire de paquets **Yarn** ; build `yarn generate` → `.output/public` ; déploiement `yarn deploy` (push-dir `gh-pages`).
- SCSS structuré (`abstract/` `base/` `components/` `pages/`), entrée `assets/scss/main.scss`, système `@use`.
- Nuxt : auto-import des composants, `pages/`, layout `layouts/default.vue`, images via `<nuxt-img>`/`<nuxt-picture>`.
- Blog via `@nuxt/content` markdown — dossier `content/` à créer.
- Pas de framework de test ; barre de qualité = lint (`eslint`, `stylelint`) + build vert.
- Code legacy Options API + `vue-property-decorator` : migrer/supprimer, ne pas étendre.
- Lint : ESLint + Prettier (double quotes, `;`, `max-len 120`) + `stylelint-scss`.

### UX Design Requirements

UX-DR1: Porter les tokens `docs/design_system/tokens/*.css` vers `assets/scss/abstract/` (et/ou CSS vars globales) — couleurs, typographie, espacement, rayons, élévation, motion, polices Ubuntu Mono + Ubuntu sans.
UX-DR2: Primitive `ZButton.vue` (variantes primary orange / dark, états hover/press/focus) — réf. `components/core/Button.jsx` + `.d.ts`.
UX-DR3: Primitive `ZCard.vue` (fond `--bg-card`, bordure hairline, `--radius-md`, ombres + hairline) — refond les `ZCard*` existants.
UX-DR4: Primitive `ZBadge.vue` — réf. `Badge.jsx`.
UX-DR5: Primitive `ZTag.vue` (radius pill) — réf. `Tag.jsx`.
UX-DR6: Primitive `ZInput.vue` (bordure `--border-default` → `--border-strong` au focus) — réf. `Input.jsx`.
UX-DR7: Primitive `ZAvatar.vue` (radius pill) — réf. `Avatar.jsx`.
UX-DR8: `Prompt` terminal (`anon.@jouan.ovh:~$`, vert) — réf. `terminal/Prompt.jsx`.
UX-DR9: Style `TerminalWindow` (fond aubergine profond, `blur(5px)`, radius-sm, caret clignotant) — réf. `terminal/TerminalWindow.jsx`.
UX-DR10: Iconographie — Lucide via CDN (`currentColor`), glyphes sociaux en SVG inline, logo diamant SVG.
UX-DR11: Layout global — header fixe 56px (logo diamant), footer 56px, hexagones sociaux (footer/contact).
UX-DR12: Home — hero Terminal (A), aperçu services, stats, projets sélectionnés (réf. `Home.jsx`, contenu `data.js`).
UX-DR13: Services — 3 cartes d'offre + section process étapes (réf. `Services.jsx`).
UX-DR14: About — portrait + bio + timeline + formation + stack (réf. `About.jsx`).
UX-DR15: Blog — index avec empty-state soigné + vue article prose/code stylés (réf. `Blog.jsx`).
UX-DR16: Contact — formulaire (validation front, pas de backend) + carte infos + CTA terminal + socials (réf. `Contact.jsx`).
UX-DR17: Accessibilité & motion — `prefers-reduced-motion` (seule boucle = caret), états focus/hover/press visibles, contraste lisible, navigation clavier.

### FR Coverage Map

FR1: Epic 1 — Migration de la stack vers Nuxt 4
FR2: Epic 2 — Tokens du design system disponibles
FR3: Epic 2 — Primitives Vue réutilisables
FR4: Epic 2 — Châssis global (header/footer/nav/socials)
FR5: Epic 3 — Page d'accueil (hero Terminal A)
FR6: Epic 4 — Page Services (route /services)
FR7: Epic 5 — Page À-propos
FR8: Epic 6 — Blog (index + article)
FR9: Epic 7 — Page Contact (route /contact)
FR10: Epic 8 — Terminal easter-egg restylé
FR11: Epic 9 — Accessibilité & finitions motion

## Epic List

### Epic 1: Migration de la stack vers Nuxt 4
Le site tourne sur une stack moderne (Nuxt 4, deps à jour, abandon de `@nuxt/bridge-edge`), build & déploiement verts — base saine et bloquante pour la refonte.
**FRs covered:** FR1 _(NFR4, NFR5, NFR8)_

### Epic 2: Fondations du design system
Langage visuel en place (tokens) + kit de primitives Vue réutilisables + châssis global (header/footer/nav/socials) refondu et visible sur tout le site.
**FRs covered:** FR2, FR3, FR4 _(UX-DR1–7, 10, 11)_

### Epic 3: Page d'accueil
Le visiteur découvre Simon via le hero Terminal (A) + aperçu services + stats + projets sélectionnés.
**FRs covered:** FR5 _(UX-DR12)_

### Epic 4: Page Services
Le visiteur comprend les trois offres (WordPress / Applications web / IA) et le process (nouvelle route `/services`).
**FRs covered:** FR6 _(UX-DR13)_

### Epic 5: Page À-propos
Le visiteur découvre le parcours : portrait, bio, timeline d'expérience, formation, stack.
**FRs covered:** FR7 _(UX-DR14)_

### Epic 6: Blog
Le visiteur lit les articles : index (+ empty-state soigné) et vue article prose + code via `@nuxt/content`.
**FRs covered:** FR8 _(UX-DR15)_

### Epic 7: Page Contact
Le visiteur peut contacter Simon : formulaire (validation front) + carte infos + CTA terminal + socials (nouvelle route `/contact`).
**FRs covered:** FR9 _(UX-DR16)_

### Epic 8: Terminal easter-egg restylé
L'easter-egg terminal draggable fonctionne et adopte le style du DS (Prompt + TerminalWindow), sans casser les commandes existantes.
**FRs covered:** FR10 _(UX-DR8, UX-DR9)_

### Epic 9: Accessibilité & finitions motion
Passe transverse finale : états focus/hover/press, `prefers-reduced-motion`, contraste, navigation clavier.
**FRs covered:** FR11 _(UX-DR17)_

---

## Epic 1: Migration de la stack vers Nuxt 4

Le site tourne sur une stack moderne, build & déploiement verts — base saine et bloquante pour la refonte (NFR8).

### Story 1.1: Migrer le cœur vers Nuxt 4

As a mainteneur du site,
I want migrer le projet de Nuxt 3 vers Nuxt 4 et retirer `@nuxt/bridge-edge`,
So that le site repose sur une base moderne et supportée.

**Acceptance Criteria:**

**Given** le projet sur Nuxt 3 + `@nuxt/bridge-edge`
**When** on met à niveau vers Nuxt 4 et on retire la dépendance bridge
**Then** `yarn install` réussit et `yarn dev` démarre sans erreur
**And** `nuxt.config.ts` est adapté à Nuxt 4 (structure `app/` ou compat) et le SSR/generate reste activé

### Story 1.2: Mettre à jour les modules et dépendances

As a mainteneur du site,
I want mettre à jour Vue 3, TypeScript 5, sass, `@nuxt/content` et `@nuxt/image`,
So that toutes les dépendances sont alignées avec Nuxt 4 et sans deprecations bloquantes.

**Acceptance Criteria:**

**Given** les versions héritées dans `package.json`
**When** on met à jour les modules et on remplace `@nuxt/image-edge` par `@nuxt/image` stable
**Then** le blog (`@nuxt/content`) et les images (`<nuxt-img>`/`<nuxt-picture>`) fonctionnent
**And** le code legacy `vue-property-decorator` est neutralisé ou migré (pas d'erreur de compilation)

### Story 1.3: Migrer l'outillage lint vers ESLint 9 (flat config)

As a mainteneur du site,
I want migrer ESLint vers la flat config 9 et réaligner Prettier/Stylelint,
So that le lint reste la barre de qualité après la montée de version.

**Acceptance Criteria:**

**Given** la config `.eslintrc.js` historique
**When** on migre vers `eslint.config.*` (flat) compatible Nuxt 4
**Then** `yarn lint` (eslint + stylelint) s'exécute sans erreur de configuration
**And** les règles clés sont préservées (`max-len 120`, double quotes, `prefer-const`)

### Story 1.4: Valider build statique et déploiement gh-pages

As a mainteneur du site,
I want valider `yarn generate` et le déploiement gh-pages après migration,
So that la chaîne de production est verte avant d'entamer la refonte.

**Acceptance Criteria:**

**Given** la stack migrée
**When** on lance `yarn generate`
**Then** le build statique réussit et `.output/public` contient les pages existantes
**And** le fichier `CNAME` est présent dans la sortie et le déploiement `gh-pages` reste fonctionnel

---

## Epic 2: Fondations du design system

Langage visuel, primitives Vue réutilisables et châssis global refondu, visibles sur tout le site.

### Story 2.1: Porter les tokens du design system

As a développeur,
I want porter les tokens DS (couleurs, typo, espacement, rayons, élévation, motion) vers le codebase,
So that tout composant style via une source unique de vérité (UX-DR1, FR2, NFR2).

**Acceptance Criteria:**

**Given** les tokens dans `docs/design_system/tokens/*.css`
**When** on les porte vers `assets/scss/abstract/` (et/ou CSS vars globales) via `@use`
**Then** les valeurs (orange accent, surfaces aubergine, échelle d'espacement, rayons, ombres, motion) sont consommables depuis n'importe quel composant
**And** aucune valeur de couleur/espace/rayon n'est hardcodée dans le nouveau code

### Story 2.2: Polices et base dark-first

As a visiteur,
I want une base typographique et de fond cohérente,
So that le site adopte l'identité « OS de nuit » (UX-DR1, NFR1, NFR7).

**Acceptance Criteria:**

**Given** les polices Ubuntu Mono (ttf locales) et Ubuntu sans
**When** on configure `@font-face`/import et le reset/base dark-first
**Then** Ubuntu Mono sert aux titres/labels/code et Ubuntu sans au corps long
**And** le fond par défaut est sombre (aucun thème clair) et lisible

### Story 2.3: Primitive ZButton

As a développeur,
I want un composant bouton conforme au DS,
So that les CTA sont cohérents (UX-DR2, FR3).

**Acceptance Criteria:**

**Given** la référence `components/core/Button.jsx` (+ `.d.ts`)
**When** on crée `ZButton.vue` (`<script setup>`)
**Then** les variantes (primary orange, dark) et tailles rendent conformément à la référence
**And** les états hover/press/focus suivent les tokens (orange → hover/active, nudge press)

### Story 2.4: Primitive ZCard

As a développeur,
I want un composant carte conforme au DS,
So that le contenu est présenté de façon cohérente (UX-DR3, FR3).

**Acceptance Criteria:**

**Given** la référence `Card.jsx` et les `ZCard*` existants
**When** on crée/refond `ZCard.vue` (fond `--bg-card`, bordure hairline, `--radius-md`, ombres + hairline)
**Then** la carte rend conformément à la référence
**And** les usages existants de `ZCard*` sont migrés sans régression

### Story 2.5: Primitives ZBadge et ZTag

As a développeur,
I want des composants badge et tag conformes au DS,
So that les libellés et chips sont cohérents (UX-DR4, UX-DR5, FR3).

**Acceptance Criteria:**

**Given** les références `Badge.jsx` et `Tag.jsx`
**When** on crée `ZBadge.vue` et `ZTag.vue` (tag en radius pill)
**Then** ils rendent conformément aux références et stylent via tokens

### Story 2.6: Primitives ZInput et ZAvatar

As a développeur,
I want des composants champ et avatar conformes au DS,
So that les formulaires et identités visuelles sont cohérents (UX-DR6, UX-DR7, FR3).

**Acceptance Criteria:**

**Given** les références `Input.jsx` et `Avatar.jsx`
**When** on crée `ZInput.vue` (bordure `--border-default` → `--border-strong` au focus) et `ZAvatar.vue` (radius pill)
**Then** ils rendent conformément aux références et stylent via tokens

### Story 2.7: Iconographie

As a développeur,
I want un système d'icônes cohérent,
So that l'UI utilise des icônes au trait et les glyphes de marque (UX-DR10).

**Acceptance Criteria:**

**Given** l'approche DS (Lucide CDN + SVG inline)
**When** on intègre Lucide (`currentColor`), les glyphes sociaux en SVG inline et le logo diamant
**Then** les icônes héritent de la couleur du texte
**And** aucune police d'icône n'est introduite

### Story 2.8: Châssis global (header, footer, nav, socials)

As a visiteur,
I want un en-tête, un pied de page et une navigation refondus,
So that le site a un cadre cohérent sur toutes les pages (UX-DR11, FR4).

**Acceptance Criteria:**

**Given** le UI kit (Header/Footer) et les composants header/footer existants
**When** on refond le header fixe 56px (logo diamant), le footer 56px et la nav
**Then** ils rendent conformément au UI kit, dark-first et responsive mobile
**And** les hexagones sociaux sont présents (footer/contact) et la nav mène aux routes existantes + `/services`, `/contact`

---

## Epic 3: Page d'accueil

Le visiteur découvre Simon via le hero Terminal (A) + aperçu services + stats + projets.

### Story 3.1: Hero Terminal (A)

As a visiteur,
I want un hero d'accueil en style terminal,
So that je perçois immédiatement l'identité de marque (UX-DR12, FR5).

**Acceptance Criteria:**

**Given** la direction de hero Terminal (A) de `Home.jsx`
**When** on implémente le hero sur `/`
**Then** le hero rend en style terminal (prompt, caret, accroche française 1re personne)
**And** un CTA principal mène à un parcours clé (ex. contact/about)

### Story 3.2: Aperçu services et stats

As a visiteur,
I want voir un aperçu des services et des chiffres clés,
So that je comprends rapidement l'offre (UX-DR12, FR5).

**Acceptance Criteria:**

**Given** le contenu `data.js` (services, stats)
**When** on implémente les blocs aperçu services + stats sur `/`
**Then** les 3 services et les stats rendent conformément à `Home.jsx`
**And** un lien mène à la page Services

### Story 3.3: Projets sélectionnés

As a visiteur,
I want voir des projets sélectionnés,
So that j'évalue le travail de Simon (UX-DR12, FR5).

**Acceptance Criteria:**

**Given** le contenu projets de `data.js`
**When** on implémente le bloc projets sur `/` avec `ZCard`
**Then** les projets sélectionnés rendent en cartes conformes au DS

---

## Epic 4: Page Services

Le visiteur comprend les trois offres et le process (route `/services`).

### Story 4.1: Route /services et cartes d'offre

As a visiteur,
I want une page Services avec les trois offres,
So that je comprends ce que Simon propose (UX-DR13, FR6).

**Acceptance Criteria:**

**Given** la référence `Services.jsx` et le contenu `data.js`
**When** on crée la route `/services` avec 3 cartes (WordPress / Applications web / IA)
**Then** les 3 offres rendent conformément à la référence
**And** la route est accessible depuis la nav

### Story 4.2: Section process

As a visiteur,
I want voir les étapes du process,
So that je sais comment se déroule une collaboration (UX-DR13, FR6).

**Acceptance Criteria:**

**Given** les étapes du process dans `Services.jsx`/`data.js`
**When** on implémente la section process sur `/services`
**Then** les étapes rendent dans l'ordre conformément à la référence

---

## Epic 5: Page À-propos

Le visiteur découvre le parcours de Simon.

### Story 5.1: Portrait et bio

As a visiteur,
I want voir le portrait et la bio de Simon,
So that je connais la personne derrière le travail (UX-DR14, FR7).

**Acceptance Criteria:**

**Given** la référence `About.jsx`, le portrait et le contenu `data.js`
**When** on refond `/about` avec portrait + bio
**Then** la section rend conformément à la référence, en français 1re personne

### Story 5.2: Timeline, formation et stack

As a visiteur,
I want voir l'expérience, la formation et la stack technique,
So that j'évalue les compétences de Simon (UX-DR14, FR7).

**Acceptance Criteria:**

**Given** le contenu CV de `data.js`
**When** on implémente la timeline d'expérience, la formation et la stack sur `/about`
**Then** les trois sections rendent conformément à la référence
**And** la stack utilise des `ZTag`/`ZBadge`

---

## Epic 6: Blog

Le visiteur lit les articles (index + article).

### Story 6.1: Index du blog et empty-state

As a visiteur,
I want une liste d'articles soignée,
So that je trouve du contenu à lire (UX-DR15, FR8).

**Acceptance Criteria:**

**Given** le pipeline `@nuxt/content` et la référence `Blog.jsx`
**When** on crée le dossier `content/` et on refond `/blog` (index + empty-state)
**Then** la liste rend en cartes conformes au DS
**And** l'empty-state français soigné s'affiche quand il n'y a aucun article

### Story 6.2: Vue article (prose + code)

As a visiteur,
I want lire un article avec une mise en forme lisible,
So that le contenu prose et code est agréable (UX-DR15, FR8).

**Acceptance Criteria:**

**Given** un article markdown dans `content/`
**When** on refond `/blog/[...slug]`
**Then** la prose (Ubuntu sans) et les blocs de code (Ubuntu Mono, palette terminal) rendent conformément au DS

---

## Epic 7: Page Contact

Le visiteur peut contacter Simon (route `/contact`).

### Story 7.1: Route /contact et formulaire

As a visiteur,
I want un formulaire de contact,
So that je peux écrire à Simon (UX-DR16, FR9).

**Acceptance Criteria:**

**Given** la référence `Contact.jsx` et la contrainte site statique (pas de backend)
**When** on crée la route `/contact` avec le formulaire (`ZInput`, `ZButton`)
**Then** le formulaire valide les champs côté front et affiche un feedback
**And** aucune dépendance backend n'est requise (NFR4)

### Story 7.2: Infos, CTA terminal et socials

As a visiteur,
I want des moyens de contact alternatifs,
So that je choisis comment joindre Simon (UX-DR16, FR9).

**Acceptance Criteria:**

**Given** la référence `Contact.jsx`
**When** on implémente la carte infos, le CTA terminal et les liens sociaux hexagonaux
**Then** ils rendent conformément à la référence
**And** le CTA terminal ouvre l'easter-egg terminal

---

## Epic 8: Terminal easter-egg restylé

L'easter-egg terminal fonctionne et adopte le style du DS.

### Story 8.1: Style TerminalWindow et Prompt

As a visiteur,
I want un terminal au style de la marque,
So that l'easter-egg s'intègre à l'identité (UX-DR8, UX-DR9, FR10).

**Acceptance Criteria:**

**Given** `components/terminal/` existant et les références `TerminalWindow.jsx`/`Prompt.jsx`
**When** on restyle la fenêtre (fond aubergine profond, `blur(5px)`, radius-sm, caret clignotant) et le prompt vert (`anon.@jouan.ovh:~$`)
**Then** le terminal rend conformément au DS
**And** le caret clignotant est la seule animation en boucle

### Story 8.2: Préserver les commandes et l'ouverture

As a visiteur,
I want que toutes les commandes du terminal marchent,
So that l'easter-egg reste fonctionnel après refonte (FR10, NFR9).

**Acceptance Criteria:**

**Given** le sous-système terminal restylé
**When** on teste l'ouverture modale et les commandes
**Then** `help`, `about`, `skills`, `projets`, `contact`, `clear` répondent sans régression
**And** le terminal reste draggable

---

## Epic 9: Accessibilité & finitions motion

Passe transverse finale de qualité.

### Story 9.1: États interactifs cohérents

As a visiteur,
I want des états visuels clairs sur les éléments interactifs,
So that je sais ce qui est cliquable et focalisé (UX-DR17, FR11).

**Acceptance Criteria:**

**Given** les primitives et la navigation
**When** on vérifie les états focus/hover/press
**Then** chaque élément interactif a des états visibles conformes au DS
**And** le focus clavier est toujours visible

### Story 9.2: Motion réduit, contraste et clavier

As a visiteur,
I want une interface accessible,
So that je peux l'utiliser quelles que soient mes contraintes (UX-DR17, FR11).

**Acceptance Criteria:**

**Given** l'interface refondue
**When** on audite motion, contraste et navigation clavier
**Then** `prefers-reduced-motion` désactive les animations (sauf nécessité) et seul le caret boucle par défaut
**And** le contraste texte/fond est lisible et toutes les pages sont navigables au clavier
