# Story 7.1: Route /contact et formulaire

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want un formulaire de contact,
so that je peux écrire à Simon (UX-DR16, FR9).

## Acceptance Criteria

1. **Given** la référence `Contact.jsx` et la contrainte site statique (pas de backend), **When** on crée la route `/contact` avec le formulaire (`ZInput`, `ZButton`), **Then** le formulaire valide les champs côté front et affiche un feedback.
2. **Given** la contrainte d'absence de serveur, **When** on soumet le formulaire, **Then** aucune dépendance backend n'est requise (NFR4).

> Périmètre : **création de la route `/contact` + le formulaire de contact** (colonne gauche de `Contact.jsx`) avec validation et feedback **front uniquement**. La carte infos, le CTA terminal et les hexagones sociaux (colonne droite) sont la **story 7.2**. Cette story doit néanmoins poser le squelette de page (`pages/contact.vue`, grille `contact__grid`) que 7.2 complétera, sans casser le prerender ni le lint.

## Tasks / Subtasks

- [ ] Tâche 1 — Créer la route `/contact` (AC: #1)
  - [ ] Créer `pages/contact.vue` (`<script setup lang="ts">`) — la route n'existe pas encore (à créer, cf. pages.md)
  - [ ] Poser le squelette : `<MainComponent>` (ou section/container conforme au châssis) avec l'en-tête de page (eyebrow `// contact`, titre `Parlons de votre projet`, paragraphe d'intro en français 1re personne)
  - [ ] Prévoir la grille à deux colonnes `contact__grid` (colonne gauche = formulaire ici ; colonne droite réservée à la story 7.2 — placeholder neutre acceptable)
  - [ ] Vérifier l'auto-import des composants et que la route `/contact` se charge en `yarn dev`
- [ ] Tâche 2 — Construire le formulaire avec les primitives DS (AC: #1)
  - [ ] Utiliser `ZInput` (Epic 2, story 2.6) pour les champs : `Nom` (required), `Email` (`type=email`, required), `Sujet` (optionnel), `Message` (multiline, required)
  - [ ] Reproduire la disposition de `Contact.jsx` : `Nom` + `Email` sur une rangée (`grid-2`), puis `Sujet`, puis `Message` pleine largeur
  - [ ] CTA d'envoi via `ZButton` variante `primary`, taille `lg`, icône flèche à droite, libellé `Envoyer le message`
- [ ] Tâche 3 — Validation et feedback **front uniquement** (AC: #1, #2)
  - [ ] À la soumission : `@submit.prevent` — aucun appel réseau, aucune dépendance backend
  - [ ] Valider côté front les champs requis (Nom, Email, Message) et le format email ; afficher des messages d'erreur français sous les champs invalides
  - [ ] En cas de succès, afficher l'état « envoyé » : carte accent avec ligne mono verte `✓ Message envoyé` (`var(--term-green)`) + message de confirmation français (cf. `sent` dans `Contact.jsx`), à la place du formulaire
  - [ ] Gérer l'état réactif (`sent`, erreurs de champ) via `ref`/`reactive` (`<script setup>`)
- [ ] Tâche 4 — Style via tokens & dark-first (AC: #1)
  - [ ] Styler la page/le formulaire en SCSS scoped, en consommant les tokens (espacement, couleurs, typo) — aucune valeur hardcodée (NFR2)
  - [ ] Titres/labels en Ubuntu Mono, prose en Ubuntu sans (NFR7) ; intro en `var(--text-muted)`, largeur de lecture limitée (~48ch)
- [ ] Tâche 5 — Vérification (AC: #1, #2)
  - [ ] `yarn dev` : la page `/contact` se charge, le formulaire valide et bascule sur l'état « envoyé », sans erreur console
  - [ ] `yarn lint` ne régresse pas ; pas d'accès DOM non gardé (compatibilité prerender)

## Dev Notes

### Contexte & contraintes (depuis project-context.md et SPEC)

- **Route `/contact` à CRÉER** — elle n'existe pas dans `pages/` (seules `index.vue`, `about.vue`, `blog/` existent). [Source: docs/specs/spec-design-system-revamp/pages.md]
- **Site statique, AUCUN backend** : le formulaire est non fonctionnel côté serveur ; **validation/feedback front uniquement** (NFR4 / Non-goal « pas de backend »). Ne pas ajouter d'endpoint, de `$fetch`, ni de service tiers. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Non-goals ; pages.md#Contact]
- **Compatibilité prerender** : tout accès DOM gardé (`onMounted` / `import.meta.client`) ; la validation front pure n'en nécessite normalement aucun. [Source: docs/project-context.md#Nuxt]
- **Tokens, pas de valeurs en dur** ; SCSS `@use` (jamais `@import`) ; styles `<style lang="scss" scoped>`. [Source: docs/project-context.md#SCSS]
- **Port, pas copie** : ne pas copier `Contact.jsx` tel quel — recréer en Vue 3 `<script setup>`. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]
- **Langue & voix** : français, 1re personne « je », vouvoiement, pas d'emoji (le `✓` de l'état envoyé est un glyphe, pas un emoji — conservé tel quel depuis la réf). [Source: docs/project-context.md#Langue]
- **Pas de framework de test** : barre de qualité = lint + `yarn dev`/`generate` verts. [Source: docs/project-context.md#Tests]

### Dépendances de stories

- **Dépend de Epic 2** : primitives `ZInput` (story 2.6) et `ZButton` (story 2.3), tokens (stories 2.1/2.2). Si ces primitives ne sont pas encore disponibles au moment du dev, les implémenter d'abord (Epic 2) — ne pas recréer une variante ad hoc dans la page.
- **Ne dépend PAS** de stories futures. La colonne droite (carte infos, CTA terminal, socials) est traitée en **story 7.2**.

### Fichiers à créer / modifier

- **`pages/contact.vue`** (CREATE) — page de la route `/contact`, `<script setup lang="ts">`. Squelette + colonne formulaire (cette story) ; la colonne infos/CTA/socials sera ajoutée en 7.2.
- (Optionnel) un partiel SCSS de page sous `assets/scss/pages/` si le projet suit ce pattern pour les styles de page non scopés — sinon styles scopés dans `contact.vue`. [Source: docs/project-context.md#Organisation]

### Mapping depuis `Contact.jsx` (référence visuelle → Vue)

- En-tête : `p.eyebrow "// contact"` → titre `h1` « Parlons de votre projet » (`--fs-4xl`, `--fw-light`) → paragraphe d'intro `var(--text-muted)`, max-width ~48ch.
- Formulaire (`form.contact__form` + `onSubmit`) :
  - Rangée `grid-2` : `<Input label="Nom" required>` + `<Input label="Email" type="email" required>` → deux `ZInput`.
  - `<Input label="Sujet">` (optionnel) → `ZInput`.
  - `<Input label="Message" multiline required>` → `ZInput` multiline (textarea).
  - `<Button variant="primary" size="lg" type="submit" iconRight={arrow}>Envoyer le message</Button>` → `ZButton`.
- État envoyé (`sent`) : `<Card accent>` avec ligne mono `✓ Message envoyé` en `var(--term-green)` + prose de confirmation → carte DS (`ZCard` accent quand dispo, sinon conteneur tokenisé).
- Contenu : libellés/placeholders français repris de `Contact.jsx` ; ne pas inventer de copy net-nouvelle au-delà de la réf (Non-goal copywriting). [Source: docs/design_system/ui_kits/jouan-site/Contact.jsx]

### Pièges / régressions à éviter

- **Ne pas** soumettre le formulaire à un backend / endpoint : le `submit` doit rester local (`preventDefault` + bascule d'état). Ajouter un backend casserait NFR4 et la cible statique.
- **Ne pas** hardcoder couleurs/espaces (ex. `--term-green`, `--text-muted`, `--fs-*`, `--space-*` viennent des tokens portés en Epic 2).
- **Ne pas** dupliquer la logique des primitives : la validation/affichage d'erreur est portée par la page, mais le rendu champ/bouton passe par `ZInput`/`ZButton`.
- Le `multiline` de `ZInput` doit rendre un `<textarea>` accessible (label associé) — vérifier le contrat de la primitive (story 2.6).

### Project Structure Notes

- Nouvelle page isolée ; aucune base de données / entité. Pas d'impact sur les routes existantes (`/`, `/about`, `/blog`).
- L'ajout de l'entrée de nav vers `/contact` est porté par le **châssis global (story 2.8)** — ne pas modifier le header ici au-delà du strict nécessaire.

### Testing standards

- Pas de framework de test. Validation = `yarn lint` (ne pas dégrader) + **`yarn dev`** : `/contact` se charge, la validation front signale les champs invalides, et la soumission valide affiche l'état « envoyé ». Vérifier la compatibilité `yarn generate` (prerender) si la primitive `ZInput` introduit du code client. [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 7: Page Contact — Story 7.1]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#Capabilities (CAP-9), #Constraints, #Non-goals]
- [Source: docs/specs/spec-design-system-revamp/pages.md — ligne `/contact` (à créer) + Notes par page#Contact]
- [Source: docs/design_system/ui_kits/jouan-site/Contact.jsx — formulaire + état `sent`]
- [Source: docs/design_system/ui_kits/jouan-site/data.js — `window.SITE` (email, libellés)]
- [Source: docs/project-context.md#Technology Stack, #Règles Langage & Framework, #Tests]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.

### File List
