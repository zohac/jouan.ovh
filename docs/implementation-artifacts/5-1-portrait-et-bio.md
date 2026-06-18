# Story 5.1: Portrait et bio

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want voir le portrait et la bio de Simon,
so that je connais la personne derrière le travail (UX-DR14, FR7).

## Acceptance Criteria

**Given** la référence `About.jsx`, le portrait et le contenu `data.js`
**When** on refond `/about` avec portrait + bio
**Then** la section rend conformément à la référence, en français 1re personne

## Tasks / Subtasks

- [ ] Tâche 1 — Préparer l'asset portrait (AC)
  - [ ] Copier `docs/design_system/assets/brand/portrait.jpeg` vers `public/images/portrait.jpeg` (assets statiques servis par `@nuxt/image` → cible `public/images/`, cf. project-context).
  - [ ] Vérifier que l'image est bien servie en dev (`/images/portrait.jpeg`).
- [ ] Tâche 2 — Refondre la page `pages/about.vue` (AC)
  - [ ] Remplacer l'implémentation legacy actuelle (`MainComponent` + `ZCard*` Options API) par un nouveau composant en `<script setup lang="ts">`.
  - [ ] Construire la section « hero À-propos » en grille 2 colonnes (gauche ≈ `0.8fr` portrait + identité, droite ≈ `1.2fr` bio), conforme à `About.jsx` (`<section class="section">` + `<div class="container">` + `grid-2`).
  - [ ] Colonne gauche : portrait via `<nuxt-img>` (radius pill / `ZAvatar` une fois disponible — voir Dev Notes), nom (`Simon Jouan`), rôle en mono accent (`Développeur web freelance`), localisation (`Valognes, France`) avec icône pin, et deux CTA (« Me contacter » → `/contact`, « CV » → `mailto:`).
  - [ ] Colonne droite : eyebrow `// à propos`, bio en `.prose` (deux paragraphes, voir contenu en Dev Notes), avec les emphases `<strong>` sur les technologies.
- [ ] Tâche 3 — Contenu & voix FR (AC)
  - [ ] Reprendre la bio depuis `About.jsx` (texte 1re personne « je » déjà rédigé) ; libellés depuis `data.js` (`name`, `role`, `city`, `email`).
  - [ ] Aucun emoji ; vouvoiement ; lien `keova.app` en `target="_blank" rel="noreferrer"`.
- [ ] Tâche 4 — Style via tokens (AC)
  - [ ] Styles en `<style lang="scss" scoped>` consommant les tokens du DS (Epic 2), `@use` jamais `@import`.
  - [ ] Aucune valeur de couleur/espace/rayon hardcodée (mapper sur `--fs-*`, `--space-*`, `--accent`, `--text-muted`, `--text-strong`, etc.).
- [ ] Tâche 5 — Vérification
  - [ ] `yarn dev` : `/about` se charge sans erreur, le portrait s'affiche, la bio est lisible.
  - [ ] Compatibilité prerender : aucun accès `window`/`document` hors garde ; `yarn lint` ne régresse pas.
  - [ ] Réserver l'espace pour les sections timeline/formation/stack ajoutées par la story 5.2 (ne pas les implémenter ici).

## Dev Notes

### Périmètre

- **Cette story = portrait + bio uniquement** (haut de page `/about`). La timeline d'expérience, la formation et la stack (`ZTag`/`ZBadge`) sont la **story 5.2** — ne pas les traiter ici, mais laisser la structure de page prête à les recevoir (la 5.2 ajoute une `<section class="section section--sunken">` sous le hero).

### Contexte & contraintes (depuis project-context.md et SPEC)

- **Port, pas copie** : `About.jsx` est React + CSS vars ; recréer en Vue 3 `<script setup>` + SCSS `@use`. Ne pas copier le `.jsx` tel quel. [Source: docs/project-context.md#Port du design system]
- **Images TOUJOURS via `<nuxt-img>` / `<nuxt-picture>`**, jamais `<img>` brut ; assets statiques sous `public/images/`. [Source: docs/project-context.md#Nuxt]
- **Tokens, pas de valeurs en dur** : couleurs/espaces/rayons via tokens DS. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]
- **Langue & voix** : français, 1re personne « je », vouvoiement, pas d'emoji. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]
- **Compatibilité prerender** (site statique) : tout accès DOM gardé (`onMounted` / `import.meta.client`). [Source: docs/project-context.md#Nuxt]
- **SCSS** : `<style lang="scss" scoped>`, système `@use ... as _alias` uniquement. [Source: docs/project-context.md#SCSS (règle critique)]

### Fichiers à modifier / créer

- **`pages/about.vue`** (REFONTE) — état actuel : page legacy en Options API qui affiche une `ZCardComponent` avec portrait « drip art » et le titre « Simon Jouan / Développeur Web FullStack & Testeur/QA / Freelance ». À remplacer par la nouvelle section portrait + bio en `<script setup lang="ts">`, fidèle à `About.jsx`. [Source: pages/about.vue]
- **`public/images/portrait.jpeg`** (CREATE) — copie de `docs/design_system/assets/brand/portrait.jpeg`.

### Dépendances (Epic 2)

- **`ZAvatar.vue`** (story 2.6, UX-DR7, radius pill, prop `ring`) : si disponible, l'utiliser pour le portrait (`<ZAvatar :src="..." :alt="..." size="xl" ring />` comme dans `About.jsx`). À défaut, encadrer un `<nuxt-img>` avec le style avatar (radius pill, anneau) en local et migrer vers `ZAvatar` ensuite.
- **`ZButton.vue`** (story 2.3, UX-DR2) : utiliser pour les CTA (`variant="primary"` → « Me contacter » ; `variant="secondary" as="a" :href="mailto:..."` → « CV »).
- **Tokens** (story 2.1) + **polices Ubuntu** (story 2.2) : la bio en Ubuntu sans, rôle/labels en Ubuntu Mono.
- **Layout global** (story 2.8) : la page s'insère dans `layouts/default.vue` (header/footer déjà refondus).
- Ces dépendances pointent vers l'**Epic 2** (autorisé). Aucune dépendance vers des stories futures.

### Mapping About.jsx → Vue (section concernée par cette story)

- `<section className="section">` → `<section class="section">` ; `<div className="container">` → idem.
- `grid-2` avec `gridTemplateColumns: "0.8fr 1.2fr"`, `alignItems: "start"`.
- Colonne gauche :
  - `<Avatar src="../../assets/brand/portrait.jpeg" alt={S.name} size="xl" ring />` → `<ZAvatar src="/images/portrait.jpeg" :alt="name" size="xl" ring />` (chemin **réécrit** vers `public/`).
  - `<h1>{S.name}</h1>` → « Simon Jouan » (`--fs-3xl`).
  - `<p>{S.role}</p>` en `--font-mono` + `--accent` → « Développeur web freelance ».
  - `<p className="prose">… {S.city}</p>` avec icône pin → « Valognes, France ».
  - Deux `<Button>` : `variant="primary"` (« Me contacter ») et `variant="secondary" as="a" href={"mailto:"+S.email}` (« CV »).
- Colonne droite :
  - `<p className="eyebrow">// à propos</p>`.
  - Deux paragraphes `.prose` (`--fs-md`) — **contenu exact** :
    > Développeur web freelance, je viens d'un parcours technique (métrologie, instrumentation) avant de basculer dans le code. Aujourd'hui je conçois des applications en **PHP/Symfony**, des sites **WordPress** sur-mesure, et des produits en **Node.js / Nest.js / Nuxt.js**.
    >
    > Je suis aussi fondateur du SaaS [keova.app](https://keova.app), et j'aime mettre l'IA au service du code — agents, automatisations, intégrations LLM.
  - Les `<strong>` portent `color: var(--text-strong)`.
- **Ne pas implémenter ici** le `// stack` (`S.skills.map(...)`) ni les sections expériences/formation : ce sont la story 5.2.

### Contenu (data.js — pour cette story)

- `name: "Simon Jouan"`, `role: "Développeur web freelance"`, `city: "Valognes, France"`, `email: "simon@jouan.ovh"`. [Source: docs/design_system/ui_kits/jouan-site/data.js]
- Bio : texte 1re personne déjà rédigé dans `About.jsx` (voir mapping ci-dessus).

### Pièges / régressions à éviter

- Chemin portrait : `About.jsx` référence `../../assets/brand/portrait.jpeg` (relatif au kit). Dans le site, copier vers `public/images/portrait.jpeg` et référencer `/images/portrait.jpeg` via `<nuxt-img>`.
- Ne pas hardcoder des couleurs/tailles ; mapper sur les tokens (`--fs-3xl`, `--fs-md`, `--fs-sm`, `--space-*`, `--accent`, `--text-muted`, `--text-strong`, `--font-mono`).
- Prerender : pas d'accès DOM non gardé (la bio est statique, attention si une icône Lucide nécessite un montage client — la garder simple/SVG inline).
- Ne pas réintroduire le composant legacy `ZCardComponent` / Options API pour cette page.
- Ne pas casser le `CNAME` ni la chaîne de déploiement (validation build = passe transverse).

### Project Structure Notes

- Page sous `pages/about.vue` (structure racine conservée, cf. story 1.1 `srcDir: '.'`).
- Aucune base de données / entité à créer.

### Testing standards

- Pas de framework de test. Validation = `yarn lint` (ne pas dégrader) + **`yarn dev` charge `/about`** (portrait visible, bio lisible) + compatibilité `yarn generate` (prerender). [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 5: Page À-propos — Story 5.1]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#Capabilities (CAP-7), #Constraints]
- [Source: docs/specs/spec-design-system-revamp/pages.md#/about]
- [Source: docs/design_system/ui_kits/jouan-site/About.jsx — section hero portrait + bio]
- [Source: docs/design_system/ui_kits/jouan-site/data.js — name, role, city, email]
- [Source: docs/design_system/assets/brand/portrait.jpeg — asset portrait]
- [Source: docs/project-context.md#Port du design system, #Nuxt, #SCSS (règle critique), #Langue, #Tests]
- [Source: pages/about.vue — implémentation legacy à refondre]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
