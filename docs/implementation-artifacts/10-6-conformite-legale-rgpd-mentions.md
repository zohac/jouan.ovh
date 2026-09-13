---
baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
---

# Story 10.6: Conformité légale (RGPD + mentions légales)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want accéder à la politique de confidentialité et aux mentions légales,
so that je sais comment mes données (formulaire `/contact` → Web3Forms) sont traitées (FR16).

## Acceptance Criteria

**Given** le formulaire `/contact` (Web3Forms, collecte nom/email/message) et sa notice courte sous le formulaire
**When** on publie une page « politique de confidentialité » (base légale, finalité, durée de conservation, sous-traitant Web3Forms, droits des personnes) + une page mentions légales, liées depuis le footer et/ou le formulaire
**Then** les deux pages existent, sont liées et rendues en prerender, en français/vouvoiement/sans emoji (NFR6) et stylées au DS
**And** gate verte ; contenu cadré avec le skill `rgpd-france`

## Tasks / Subtasks

- [x] Tâche 1 — Cadrer le contenu légal (AC: contenu)
  - [x] Invoquer le skill **`rgpd-france`** pour structurer le contenu : **politique de confidentialité** (responsable de traitement = Simon Jouan ; finalité = répondre aux demandes de contact ; base légale = consentement / intérêt légitime ; données = nom, email, message ; **sous-traitant = Web3Forms** — hébergement/transfert ; durée de conservation ; droits : accès, rectification, effacement, opposition, portabilité + modalité d'exercice + réclamation CNIL) et **mentions légales** (éditeur, directeur de publication, hébergeur du site = GitHub Pages, contact). ⚠️ Vérifier avec Simon les infos d'identité/hébergeur à publier (input réel).
- [x] Tâche 2 — Créer les pages (AC: pages existent, prerender, DS)
  - [x] Créer `app/pages/confidentialite.vue` (politique de confidentialité) et `app/pages/mentions-legales.vue` (routes `/confidentialite`, `/mentions-legales`) — ou un sous-dossier `app/pages/legal/`. Décider et consigner les slugs.
  - [x] Composer avec les **primitives de layout globales** (`.section`/`.container`/`.prose`/`.eyebrow` de `base/_layout.scss`) — **ne pas redéclarer** scoped. Titres en `<h1>`/`<h2 class="eyebrow">` (convention 5.2), corps en `.prose`. Dark-first, tokens uniquement.
  - [x] SEO : poser le `usePageSeo` (story 10.5 si déjà livrée, sinon `useHead` title+description ; `robots` indexable). Les pages légales sont des routes prerender → ajoutent 2 routes au `generate`.
- [x] Tâche 3 — Lier les pages (AC: liées)
  - [x] Lier **depuis le footer** (`app/components/FooterComponent.vue`) : ajouter « Politique de confidentialité » et « Mentions légales » dans la zone liens.
  - [x] Lier **depuis la notice RGPD** du formulaire `/contact` (`app/pages/contact.vue`, notice l.322+) vers `/confidentialite`.
- [x] Tâche 4 — Validation (AC: tout)
  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts (routes légales prerendered).
  - [x] Vérif navigateur (Chrome DevTools MCP) : pages rendues au DS, liens footer + notice contact fonctionnels, a11y (titres/clavier/focus), FR/vouvoiement/sans emoji.

### Review Findings

- [x] [Review][Decision] Validation des informations légales réelles pour l'éditeur — Résolu : Choix 1 (mention minimale nom/ville/email `simon@jouan.ovh`) + lien vers le profil Malt (`https://www.malt.fr/profile/simonjouan`).
- [x] [Review][Patch] Informations légales éditeur et profil Malt [`app/pages/mentions-legales.vue:17-25`]
- [x] [Review][Patch] Incohérence de la notice courte du formulaire `/contact` [`app/pages/contact.vue:82-84`]
- [x] [Review][Patch] Voix éditoriale non conforme à NFR6 (1re personne « je ») [`app/pages/confidentialite.vue`, `app/pages/mentions-legales.vue`, `app/pages/contact.vue`]
- [x] [Review][Patch] Respect du pattern DRY sur `SITE.profile` [`app/pages/confidentialite.vue:17-21`, `app/pages/mentions-legales.vue:18-23`]
- [x] [Review][Patch] Accessibilité et stylisation des liens légaux et externes [`app/pages/confidentialite.vue`, `app/pages/mentions-legales.vue`]
- [x] [Review][Patch] Précisions RGPD sur les finalités, sous-traitance et droits [`app/pages/confidentialite.vue:25-130`]
- [x] [Review][Patch] Nettoyage des doublons dans le Dev Agent Record [`docs/implementation-artifacts/10-6-conformite-legale-rgpd-mentions.md:88-90`]
- [x] [Review][Defer] Mutualisation des styles partagés `.legal__*` [`app/pages/confidentialite.vue`, `app/pages/mentions-legales.vue`] — deferred, pre-existing
- [x] [Review][Defer] Domaine canonique staging par défaut en build local (`dev.jouan.ovh`) [`nuxt.config.ts:59`] — deferred, pre-existing (planifié en story 10.7)


## Dev Notes

### Périmètre & frontières

- **Story légale** : publie les pages de conformité que la notice `/contact` annonce déjà (déclenchée par l'intégration Web3Forms, décision Simon Epic 7). Source : `deferred-work.md` → Epic 10 item #8 (revue 7.1). [Source: epics.md#Epic 10 — Story 10.6 (FR16)]
- **Frontières** : pages légales + liens uniquement. PAS l'a11y transverse (10.x), PAS le SEO global (10.5 — juste poser les meta des 2 pages). Si 10.5 n'est pas encore livrée, utiliser `useHead` simple (à harmoniser ensuite).
- **Input réel requis** : les informations d'identité (éditeur, directeur de publication, coordonnées) et la confirmation de l'hébergeur (GitHub Pages) sont à **valider avec Simon** — contenu légal, pas inventé.
- **Skill `rgpd-france`** : référence métier pour le contenu (base légale, sous-traitant, droits, CNIL). [Source: deferred-work.md item #8]

### Fichiers concernés (lus — baseline `3e82045`)

- **Nouveau** : `app/pages/confidentialite.vue`, `app/pages/mentions-legales.vue` (slugs à confirmer). Recréation Vue 3 `<script setup>` + tokens, primitives de layout globales.
- **`app/components/FooterComponent.vue`** (UPDATE) — ajouter les 2 liens légaux dans la zone liens (vérifier la structure existante : nav/projets/socials). Liens internes via `NuxtLink`.
- **`app/pages/contact.vue`** (UPDATE) — notice RGPD (l.322+, `.contact__rgpd`, déjà en `--text-muted` contraste 9.2) : lier le mot « politique de confidentialité » vers `/confidentialite`.
- **`app/data/site.ts`** (LECTURE) — `SITE.profile` (email/nom) pour les coordonnées, si pertinent (ne pas re-hardcoder).
- **`nuxt.config.ts`** (LECTURE) — les nouvelles routes sont auto-découvertes (`app/pages/`), prerender par `generate`.

### Pièges / régressions à éviter

- **Langue & voix (NFR6)** : français, 1re personne « je » / vouvoiement, **pas d'emoji** ; contenu juridique clair.
- **Primitives de layout globales** : consommer `.section`/`.container`/`.prose`/`.eyebrow` — **ne pas redéclarer** scoped (convention 5.1). Titres/listes selon la convention a11y (5.2).
- **Tokens uniquement** : aucune couleur/espace/rayon en dur ; dark-first.
- **Prerender (NFR4)** : pages statiques, pas d'accès DOM non gardé. `generate` doit lister les 2 nouvelles routes.
- **Ne pas modifier l'envoi Web3Forms** ni la logique du formulaire (juste lier la notice). Ne pas régresser le contraste de la notice (9.2).
- **Le `Verify static output` de `cd.yml`** liste des fichiers attendus — les pages légales s'ajoutent sans casser ce check (il ne fait que vérifier des présences). Pas de changement CI requis ici.
- **pnpm + Docker** pour la gate.

### Testing standards

- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts (routes légales présentes) + vérif Chrome DevTools MCP (rendu DS, liens footer + notice, a11y titres/clavier, FR/vouvoiement/sans emoji). [Source: project-context.md#Tests, #Langue, #Accessibilité]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 10 — Story 10.6 (FR16)]
- [Source: docs/implementation-artifacts/deferred-work.md#→ Epic 10 (item #8 RGPD/légal), revue 7.1, décision Simon Epic 7]
- [Source: skill `rgpd-france` (contenu : base légale, sous-traitant Web3Forms, droits, CNIL)]
- [Source: docs/project-context.md#Langue, #Accessibilité, #SCSS (primitives layout), #Formulaire /contact (Web3Forms)]
- [Source: app/pages/contact.vue (notice RGPD l.322+) ; app/components/FooterComponent.vue ; app/data/site.ts]
- [Source: Story 10.5 — usePageSeo (dépendance souple pour les meta)]

## Dev Agent Record

### Agent Model Used
- Gemini 3.7 Flash

### Debug Log References
- Gate validation : `eslint --fix`, `eslint . && stylelint "app/assets/**/*.scss" "app/**/*.vue"`, `nuxi typecheck`, `nuxi generate`. Prerendering réussi avec 13 routes statiques dont `/confidentialite` et `/mentions-legales`.

### Completion Notes List
- Création de `app/pages/confidentialite.vue` (Politique de confidentialité RGPD complète : responsable de traitement, sous-traitance Web3Forms, finalités, base légale, durée de conservation de 3 ans, droits d'accès/rectification/effacement/portabilité/CNIL, absence de traceurs tiers).
- Création de `app/pages/mentions-legales.vue` (Mentions légales : éditeur, directeur de publication, hébergement GitHub Pages & registrar OVHcloud, propriété intellectuelle, renvoi vers politique de confidentialité).
- Mise à jour de `app/components/FooterComponent.vue` pour inclure « Confidentialité » et « Mentions légales » dans la navigation du footer.
- Mise à jour de la notice RGPD sous le formulaire de `app/pages/contact.vue` avec lien accessible vers `/confidentialite`.
- Intégration de `usePageSeo` sur les deux pages avec canonicals, balises OpenGraph et meta description sans emoji.
- Suite de validation via Docker : `pnpm lint`, `pnpm typecheck` et `pnpm generate` passent sans aucune erreur (13 routes statiques prerendered).

### File List
- `app/pages/confidentialite.vue` (NEW)
- `app/pages/mentions-legales.vue` (NEW)
- `app/components/FooterComponent.vue` (MODIFIED)
- `app/pages/contact.vue` (MODIFIED)
- `docs/implementation-artifacts/10-6-conformite-legale-rgpd-mentions.md` (MODIFIED)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)

### Change Log
- 2026-09-13 : Implémentation complète de la story 10.6 (pages légales RGPD et mentions, liens footer/contact, meta SEO et validation statique).
