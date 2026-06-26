---
baseline_commit: 3223ed6d5c312c621862a5d3477143a1cbce8ac9
---

# Story 7.1: Route /contact et formulaire

Status: review

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

- [x] Tâche 1 — Créer la route `/contact` (AC: #1)
  - [x] Créer `pages/contact.vue` (`<script setup lang="ts">`) — la route n'existe pas encore (à créer, cf. pages.md)
  - [x] Poser le squelette : `<MainComponent>` (ou section/container conforme au châssis) avec l'en-tête de page (eyebrow `// contact`, titre `Parlons de votre projet`, paragraphe d'intro en français 1re personne)
  - [x] Prévoir la grille à deux colonnes `contact__grid` (colonne gauche = formulaire ici ; colonne droite réservée à la story 7.2 — placeholder neutre acceptable)
  - [x] Vérifier l'auto-import des composants et que la route `/contact` se charge en `yarn dev`
- [x] Tâche 2 — Construire le formulaire avec les primitives DS (AC: #1)
  - [x] Utiliser `ZInput` (Epic 2, story 2.6) pour les champs : `Nom` (required), `Email` (`type=email`, required), `Sujet` (optionnel), `Message` (multiline, required)
  - [x] Reproduire la disposition de `Contact.jsx` : `Nom` + `Email` sur une rangée (`grid-2`), puis `Sujet`, puis `Message` pleine largeur
  - [x] CTA d'envoi via `ZButton` variante `primary`, taille `lg`, icône flèche à droite, libellé `Envoyer le message`
- [x] Tâche 3 — Validation et feedback **front uniquement** (AC: #1, #2)
  - [x] À la soumission : `@submit.prevent` — aucun appel réseau, aucune dépendance backend
  - [x] Valider côté front les champs requis (Nom, Email, Message) et le format email ; afficher des messages d'erreur français sous les champs invalides
  - [x] En cas de succès, afficher l'état « envoyé » : carte accent avec ligne mono verte `✓ Message envoyé` (`var(--term-green)`) + message de confirmation français (cf. `sent` dans `Contact.jsx`), à la place du formulaire
  - [x] Gérer l'état réactif (`sent`, erreurs de champ) via `ref`/`reactive` (`<script setup>`)
- [x] Tâche 4 — Style via tokens & dark-first (AC: #1)
  - [x] Styler la page/le formulaire en SCSS scoped, en consommant les tokens (espacement, couleurs, typo) — aucune valeur hardcodée (NFR2)
  - [x] Titres/labels en Ubuntu Mono, prose en Ubuntu sans (NFR7) ; intro en `var(--text-muted)`, largeur de lecture limitée (~48ch)
- [x] Tâche 5 — Vérification (AC: #1, #2)
  - [x] `yarn dev` : la page `/contact` se charge, le formulaire valide et bascule sur l'état « envoyé », sans erreur console
  - [x] `yarn lint` ne régresse pas ; pas d'accès DOM non gardé (compatibilité prerender)

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

claude-opus-4-8[1m] (Claude Code, workflow bmad-dev-story)

### Debug Log References

- `pnpm lint` / `pnpm typecheck` / `pnpm generate` (Docker) : tous PASS ; `/contact` prerendu.
- Vérif comportementale Chrome DevTools MCP : (1) soumission à vide → 3 erreurs FR (Nom/Email/Message), Sujet épargné ; (2) email `pasunemail` → « Cet email ne semble pas valide. » (Nom/Message valides) ; (3) champs valides → bascule sur l'état envoyé (`ZCard accent` + « ✓ Message envoyé » vert). Console propre, desktop + mobile (form → 1 colonne).

### Completion Notes List

- Refonte de `app/pages/contact.vue` (stub mailto → page complète, colonne gauche de `Contact.jsx`). Squelette `<section><div class="container"><div class="contact__grid">` (1fr / 0.8fr) ; **colonne droite `.contact__info` = placeholder réservé à la story 7.2** (infos / CTA terminal / socials).
- En-tête : eyebrow `// contact`, `h1` « Parlons de votre projet » (mono, `--fs-4xl`/`--fw-light`), intro `.prose` `--text-muted` max-width 48ch.
- Formulaire en primitives DS : `ZInput` × 4 (Nom required, Email `type=email` required, Sujet optionnel, Message `multiline` required) — Nom+Email en rangée `grid-2` ; CTA `ZButton` primary `lg` + `ZIcon name="arrow"` à droite.
- **Validation + feedback 100 % front (NFR4)** : `@submit.prevent` (aucun appel réseau / backend) ; `novalidate` sur le `<form>` pour afficher nos messages FR (et non les bulles natives) via `ZInput` (`:error` + `:hint`) ; regex email permissive. État réactif `reactive(form)` / `reactive(errors)` / `ref(sent)`.
- État envoyé : `ZCard accent` avec **`role="status"`** (annoncé aux lecteurs d'écran à l'apparition) ; ligne mono `--term-green` « ✓ Message envoyé » (`✓` en `aria-hidden`, le texte porte le sens) + confirmation `.prose`.
- Tokens uniquement, `<style scoped>`, primitives globales (`.section`/`.container`/`.eyebrow`/`.prose`) consommées. Aucun accès DOM → prerender-safe. `useHead` title + description (l'OG/JSON-LD site-wide est l'item SEO consolidé — hors 7.1, comme `/services`).

### File List

- `app/pages/contact.vue` (REFONTE — page Contact : grille + formulaire DS + validation front + **envoi réel Web3Forms** (honeypot, états sending/error), focus a11y, re-validation live, notice RGPD ; placeholder colonne droite pour 7.2)
- `nuxt.config.ts` (MODIFIÉ — `runtimeConfig.public.web3formsAccessKey` via env)
- `.env.example` (CRÉÉ — documente `NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY`)
- `docs/specs/spec-design-system-revamp/SPEC.md` (MODIFIÉ — Non-goals + Decisions : Web3Forms acté, supersede « ni service tiers »)
- `docs/implementation-artifacts/7-1-route-contact-et-formulaire.md` (MODIFIÉ — frontmatter `baseline_commit`, tâches, Dev Agent Record, findings, statut)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIÉ — statut story `ready-for-dev` → `in-progress` → `review`)
- `docs/implementation-artifacts/deferred-work.md` (MODIFIÉ — suivis Web3Forms : clé à provisionner + politique de confidentialité)

## Change Log

| Date       | Version | Description                                                                                            |
| ---------- | ------- | ------------------------------------------------------------------------------------------------------ |
| 2026-06-26 | 0.1     | Implémentation story 7.1 — route `/contact` + formulaire DS (`ZInput`/`ZButton`), validation & feedback front uniquement (état envoyé `ZCard accent`), squelette grille pour 7.2. |
| 2026-06-26 | 0.2     | Correctifs de revue (zéro dette) : **envoi réel Web3Forms** (clé env, honeypot, états sending/error ; supersede NFR4 → SPEC maj) ; focus a11y (1er champ invalide / carte envoyée) ; re-validation live des erreurs ; notice RGPD. |

## Review Findings

_Code review (bmad-code-review) — 2026-06-26. Couches : Blind Hunter (fichier seul) · Edge Case Hunter (fichier + projet) · Acceptance Auditor (diff + SPEC/ticket/`Contact.jsx`). Verdict : AC #1 (validation + feedback front) et AC #2/NFR4 (aucun backend) **vérifiées satisfaites** ; périmètre 7.2 respecté (colonne droite = placeholder) ; copy verbatim de `Contact.jsx` ; tokens-only ; prerender-safe. Contrats `ZInput`/`ZButton`/`ZCard`/`ZIcon` + tokens tous vérifiés sains._

- [x] [Review][Patch] Brancher l'**envoi réel via Web3Forms** (décision Simon : ni démo factice, ni `mailto:`). — ✅ résolu : `$fetch` POST vers `https://api.web3forms.com/submit` au submit ; clé via **`runtimeConfig.public.web3formsAccessKey`** (env `NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY`, jamais en dur ; `.env.example` ajouté) ; **honeypot** anti-spam hors écran + `botcheck` ; états `sending` (bouton « Envoi en cours… » désactivé) et `submitError` (`role="alert"`) ajoutés à côté de `sent`. Validation front + état « ✓ envoyé » conservés ; succès = `res.success` → carte envoyée + focus, échec → message FR. Prerender-safe (fetch client-only ; `generate` OK). **SPEC mise à jour** (Non-goals + Decisions). Vérifié : `sending` → état erreur sans clé (400 attendu, capturé). _Suivis (hors dette) : Simon crée la clé Web3Forms + renseigne l'env ; politique de confidentialité dédiée (notice RGPD déjà posée sous le form)._ [app/pages/contact.vue ; nuxt.config.ts ; .env.example]
- [x] [Review][Patch] a11y — gestion du focus. — ✅ résolu : à l'échec de validation, focus sur le 1er champ invalide (`[aria-invalid="true"]`) ; au succès, focus sur la carte `.contact__sent` (`tabindex="-1"` + `role="status"`, après `nextTick`). Vérifié : focus → « Nom » après submit vide. [app/pages/contact.vue]
- [x] [Review][Patch] UX — erreurs collantes. — ✅ résolu : après le 1er envoi (`submitted`), `watch` sur Nom/Email/Message re-valide à la saisie → l'erreur d'un champ se lève dès qu'il devient valide. Vérifié : saisir « Marie » lève l'erreur Nom, Email/Message restent. [app/pages/contact.vue]
- [x] [Review][Defer] SEO `/contact` : `useHead` ne pose que `title`+`description` (pas d'OG/canonical/JSON-LD) — identique à `/services`, scopé hors 7.1 par le dev. — deferred, à traiter avec la centralisation SEO site-wide déjà tracée (`useSeoMeta`/`app.head` + `SITE_URL`/`jsonLdScript` partagés) — Epic 9 / story SEO.

_Rejetés (bruit / faux positifs vérifiés)_ : « le formulaire ne fait rien » comme défaut (FAUX — c'est NFR4, conception assumée ; remonté en décision) ; regex email permissive (intentionnelle, commentée — Edge) ; pas d'anti-spam / maxlength / ReDoS (sans soumission ni backend → sans objet ; regex linéaire) ; indicateur « requis » absent (FAUX — `ZInput` rend un `*` + `required` natif annoncé à l'AT) ; progressive enhancement JS-off (sans backend où POST → sans objet) ; `✓` glyphe vs `ZIcon` (intentionnel, repris du kit, `aria-hidden`) ; `48ch`/`1fr 0.8fr`/`900px` (mesures structurelles mandatées kit/DS) ; newlines dans `name` (input mono-ligne les empêche) ; valeur non-trim conservée (donnée jamais consommée) ; messages inline non-i18n (site mono-français) ; état non réversible (acceptable pour un formulaire de contact) ; `.contact__main`/`.contact__sent` non stylés (hooks structurels inertes — Auditor).
