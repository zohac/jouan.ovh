---
baseline_commit: c1b8a200419751d2817144be71e60d508b413626
---

# Story 12.6: Page À propos, CTA d'inspection de workflow, formulaire & SEO site-wide

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a prospect souhaitant vérifier la crédibilité du profil et initier une demande ciblée,
I want comprendre le lien entre le parcours qualité/métrologie de Simon et la robustesse de ses systèmes IA, et pouvoir qualifier mon workflow dans le formulaire,
so that j'envoie une demande précise et pertinente (FR33, FR34, FR35, FR36, NFR15, NFR16, UX-DR31, CAP-6, CAP-7, CAP-8, CAP-9).

## Acceptance Criteria

1. **Given** la page À propos dans `app/pages/about.vue`
   **When** le visiteur consulte la section Hero et la biographie
   **Then** le titre du profil affiche `SITE.profile.role` (`Développeur Full Stack spécialisé en systèmes IA & automatisation métier`)
   **And** la localisation affiche `SITE.profile.city` (`France · Remote`)
   **And** le texte de bio expose le parcours réel reliant les 12 ans de métrologie industrielle et l'expérience QA aux réflexes de robustesse logicielle et d'observabilité en production
   **And** la page intègre le bloc philosophie officiel :
     - « Je ne pars pas de "où mettre de l'IA ?", je pars de : »
     - qu’est-ce qui prend du temps ?
     - qu’est-ce qui se répète ?
     - où l’information se perd-elle ?
     - où une personne doit-elle recopier, rechercher ou interpréter ?
     - qu’est-ce qui doit absolument rester sous contrôle humain ?
     - « Ensuite seulement vient la solution technique. »
   **And** la section expériences valorise la QA (Linkizz, 02/2021 — aujourd'hui) et la métrologie (A+ Métrologie / Trescal) comme un atout direct pour la fiabilité des systèmes IA.

2. **Given** le bloc CTA final de conversion sur les pages clés (`app/pages/index.vue` et le CTA de fin d'article dans `app/pages/blog/[...slug].vue`)
   **When** le visiteur arrive en bas de page
   **Then** le bloc CTA affiche :
     - L'eyebrow terminal : `<span aria-hidden="true">$ </span>./workflow --inspect`
     - Le titre H2 : `Quel process vous fait perdre du temps chaque semaine ?`
     - Le corps d'accompagnement : `Décrivez-moi simplement comment il fonctionne aujourd’hui. Je vous dirai ce qui mérite d’être automatisé, ce qui doit rester humain et si l’IA apporte réellement quelque chose.`
     - Le CTA principal `<ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">` : `Identifier un workflow à automatiser` avec icône flèche droite
     - Le CTA secondaire `<ZButton>` vers le contact direct (`mailto:` ou formulaire) : `M’écrire directement`.

3. **Given** la page de contact et son formulaire dans `app/pages/contact/index.vue`
   **When** le visiteur souhaite initier un échange
   **Then** l'en-tête de la page oriente vers la qualification du problème (`Parlons de votre workflow`)
   **And** le formulaire Web3Forms est adapté pour recueillir la qualification du workflow :
     - Champ `Nom` (requis)
     - Champ `Email professionnel` (requis, type `email`)
     - Champ `Entreprise` (optionnel)
     - Champ `Quel processus souhaitez-vous améliorer ?` (champ requis)
     - Champ `Comment fonctionne-t-il aujourd’hui ?` (champ multiligne requis)
     - Champ `Combien de fois ce process se répète-t-il ?` (optionnel, fréquence)
   **And** le bouton de soumission affiche l'intitulé `Décrire mon workflow`
   **And** la charge utile envoyée à l'API Web3Forms transmet l'ensemble de ces champs de qualification de manière explicite et lisible dans l'email reçu
   **And** la notice RGPD est mise à jour pour mentionner les données transmises.

4. **Given** les balises de référencement (SEO), OpenGraph et données structurées Schema.org sur l'ensemble du site
   **When** les 13 routes statiques sont générées en SSG et auditées
   **Then** le composable `usePageSeo` injecte sur chaque page un titre et une meta-description cohérents avec le repositionnement :
     - Homepage (`/`) : titre `Simon Jouan — Systèmes IA, agents & automatisation métier` et description `Développeur Full Stack spécialisé en systèmes IA et automatisation métier. Agents IA, intégrations, applications sur mesure et workflows mis en production.`
     - À propos (`/about`) : titre `À propos — Simon Jouan` et description alignée sur le parcours métrologie, culture QA et ingénierie logicielle
     - Contact (`/contact`) : titre `Contact — Simon Jouan` et description orientée qualification de processus
     - Services (`/services`) : titre `Services & Tarifs — Simon Jouan` (conforme à la story 12.5)
     - Blog (`/blog`) : titre `Blog — Simon Jouan`
     - Mentions légales & Confidentialité : titres unifiés avec suffixe `— Simon Jouan`
   **And** `aboutJsonLd` dans `app/pages/about.vue` utilise `SITE.profile.city` (`France · Remote`) pour `addressLocality` sans résidu de localisation obsolète.

5. **Given** les contraintes de Design System et d'accessibilité (a11y WCAG / RGAA)
   **When** les pages modifiées sont inspectées et testées
   **Then** les styles respectent scrupuleusement les custom properties globales (`var(--token)`) sans couleurs ni marges en dur
   **And** la règle `ZÉRO EMOJI` (NFR6) est respectée sur l'intégralité des textes, templates et styles
   **And** les champs de formulaire disposent de labels explicites, d'attributs `required`, `aria-invalid` et de gestion d'erreur hydration-safe avec focus sur la première erreur.

6. **Given** l'ensemble des modifications de la story 12.6
   **When** on exécute la gate de validation Docker
   **Then** `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint / Stylelint, 0 erreur TypeScript, et les 13 routes statiques (+ assets) pré-rendues avec succès par Nitro.

## Tasks / Subtasks

- [x] Tâche 1 — Refonte de la page À propos (`app/pages/about.vue`) (AC: 1, 4, 5)
  - [x] Mettre à jour la biographie hero en intégrant les paragraphes officiels sur les 12 ans de métrologie, la bascule dans le code et la culture QA.
  - [x] Insérer le bloc philosophie d'intervention sous forme de carte ou bloc stylisé (`ZCard` ou section typographique BEM).
  - [x] Mettre en valeur l'expérience Linkizz dans la timeline des expériences en explicitant l'apport de la QA à la conception d'agents fiables.
  - [x] Vérifier la consommation de `SITE.profile.role` et `SITE.profile.city`.
  - [x] Aligner les métadonnées SEO et le JSON-LD `aboutJsonLd` (`addressLocality: "France · Remote"`).

- [x] Tâche 2 — Mise à jour du CTA final global sur la Homepage et le Blog (AC: 2, 5)
  - [x] Dans `app/pages/index.vue`, remplacer le bloc CTA final actuel par la formulation officielle :
    - Eyebrow : `<span aria-hidden="true">$ </span>./workflow --inspect`
    - H2 : `Quel process vous fait perdre du temps chaque semaine ?`
    - Sous-titre : `Décrivez-moi simplement comment il fonctionne aujourd’hui. Je vous dirai ce qui mérite d’être automatisé, ce qui doit rester humain et si l’IA apporte réellement quelque chose.`
    - CTA 1 : `Identifier un workflow à automatiser` (vers `/contact`) avec icône flèche droite
    - CTA 2 : `M’écrire directement` (vers `mailto:simon@jouan.ovh`)
  - [x] Dans `app/pages/blog/[...slug].vue`, harmoniser le CTA de fin d'article pour orienter vers la qualification de workflow.

- [x] Tâche 3 — Réorientation du formulaire de contact vers la qualification de workflow (`app/pages/contact/index.vue`) (AC: 3, 5)
  - [x] Adapter l'en-tête et l'introduction de la page : `Parlons de votre workflow` et message d'accueil orienté gain de temps/process.
  - [x] Mettre à jour l'interface `ContactForm` :
    - `name: string`
    - `email: string`
    - `company: string`
    - `workflow: string` (Quel processus souhaitez-vous améliorer ?)
    - `currentState: string` (Comment fonctionne-t-il aujourd’hui ?)
    - `frequency?: string` (Combien de fois ce process se répète-t-il ?)
  - [x] Adapter le template du formulaire avec les composants `ZInput` (champs texte et multiligne) et les attributs d'accessibilité.
  - [x] Modifier le bouton de soumission : `Décrire mon workflow`.
  - [x] Adapter la fonction de validation `validate()` et l'envoi vers l'API Web3Forms (`body` avec clés explicites `name`, `email`, `company`, `workflow`, `current_state`, `frequency`, `message`).
  - [x] Mettre à jour le texte RGPD d'information sous le formulaire.

- [x] Tâche 4 — Harmonisation SEO transverse site-wide (`usePageSeo`) (AC: 4)
  - [x] Mettre à jour le titre et la description dans `app/pages/index.vue` : `Simon Jouan — Systèmes IA, agents & automatisation métier`.
  - [x] Mettre à jour le titre et la description dans `app/pages/about.vue`.
  - [x] Mettre à jour le titre et la description dans `app/pages/contact/index.vue` : `Contact — Simon Jouan`.
  - [x] Mettre à jour le titre dans `app/pages/blog/index.vue` : `Blog — Simon Jouan`.
  - [x] Vérifier et unifier les métadonnées dans `app/pages/confidentialite.vue` et `app/pages/mentions-legales.vue`.

- [x] Tâche 5 — Styles SCSS, responsive et accessibilité (AC: 5)
  - [x] Styliser le bloc philosophie sur `/about` en utilisant les tokens du Design System (`--bg-surface`, `--border-subtle`, `--accent`).
  - [x] Vérifier la disposition responsive du formulaire de contact sur mobile et desktop.
  - [x] Contrôler les contrastes, le focus visible (`:focus-visible`) et l'absence totale d'emoji.

- [x] Tâche 6 — Validation qualité Docker (AC: 6)
  - [x] Exécuter la gate de validation complète : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [x] Vérifier 0 erreur ESLint / Stylelint, 0 erreur vue-tsc et la génération SSG Nitro sans avertissement.

### Review Findings

- [x] [Review][Patch] Intégrer le bloc CTA final complet dans la vue article de blog [app/pages/blog/[...slug].vue:46-52]
- [x] [Review][Patch] Typage optionnel de l'interface `ContactForm` [app/pages/contact/index.vue:180-187]
- [x] [Review][Patch] Robustesse du sujet d'email Web3Forms et assainissement des entrées [app/pages/contact/index.vue:230-240, 285]
- [x] [Review][Patch] Harmonisation de la confirmation d'envoi avec la promesse 48h [app/pages/contact/index.vue:18-19]
- [x] [Review][Patch] Restauration du nom d'entité `Blog` dans le JSON-LD [app/pages/blog/index.vue:113]
- [x] [Review][Patch] Masquage accessible du symbole flèche dans la liste philosophie [app/pages/about.vue:321]

## Dev Agent Record

### Implementation Plan
- **Tâche 1 (Page À propos) :** Refonte de la bio (`about.vue`) avec mise en avant du parcours métrologie industrielle (12 ans) et culture QA au service de la robustesse des systèmes IA. Insertion du bloc philosophie d'intervention stylisé avec les tokens DS. Mise à jour de la timeline d'expériences (Linkizz et A+ Métrologie / Trescal) et alignement de `aboutJsonLd.addressLocality`.
- **Tâche 2 (CTA final global) :** Refonte du CTA final sur `index.vue` avec le prompt `./workflow --inspect`, le H2 ciblant le gain de temps hebdomadaire et les boutons d'action. Harmonisation du CTA de fin d'article dans `blog/[...slug].vue`.
- **Tâche 3 (Formulaire de contact) :** Transformation du formulaire sur `contact/index.vue` en formulaire de qualification de workflow métier (Nom, Email pro, Entreprise, Processus à améliorer, Fonctionnement actuel, Fréquence). Validation reactive et payload Web3Forms enrichi.
- **Tâche 4 (SEO site-wide) :** Harmonisation des titres, méta-descriptions et JSON-LD Schema.org sur toutes les pages (`/`, `/about`, `/contact`, `/blog`, `/blog/[...slug]`, `/confidentialite`, `/mentions-legales`, `/contact/card`).
- **Tâche 5 & 6 (Styles, a11y & Validation) :** Validation rigoureuse des tokens DS, de l'accessibilité a11y et exécution de la gate complète Docker (0 erreur ESLint, 0 erreur vue-tsc, build statique SSG Nitro de 24 routes / assets réussi).

### Completion Notes
- Page À propos (`about.vue`) refondue conformément à la charte et au brief : bio officielle, bloc philosophie d'intervention, valorisation de la QA (Linkizz) et de la métrologie dans la timeline.
- CTA final sur `index.vue` et `blog/[...slug].vue` aligné sur `./workflow --inspect` et l'orientation gain de temps opérationnel.
- Formulaire de contact (`contact/index.vue`) adapté pour la qualification de flux avec conservation du honeypot, focus accessible sur erreurs et transmission des champs détaillés à Web3Forms.
- Titres SEO, descriptions et données structurées unifiés sur toutes les routes du site.
- Validation Docker 100% verte : ESLint/Stylelint sans erreur, vérification de types TypeScript vue-tsc validée, pré-rendu statique SSG Nitro réussi.

## File List

- [MODIFY] [app/pages/about.vue](file:///Users/simon/dev/jouan.ovh/app/pages/about.vue)
- [MODIFY] [app/pages/contact/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/contact/index.vue)
- [MODIFY] [app/pages/contact/card.vue](file:///Users/simon/dev/jouan.ovh/app/pages/contact/card.vue)
- [MODIFY] [app/pages/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue)
- [MODIFY] [app/pages/blog/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/blog/index.vue)
- [MODIFY] [app/pages/blog/[...slug].vue](file:///Users/simon/dev/jouan.ovh/app/pages/blog/%5B...slug%5D.vue)
- [MODIFY] [app/pages/confidentialite.vue](file:///Users/simon/dev/jouan.ovh/app/pages/confidentialite.vue)
- [MODIFY] [app/pages/mentions-legales.vue](file:///Users/simon/dev/jouan.ovh/app/pages/mentions-legales.vue)
- [MODIFY] [docs/implementation-artifacts/sprint-status.yaml](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/sprint-status.yaml)
- [MODIFY] [docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide.md)

## Change Log

- 2026-09-17 : Revue de code contradictoire (bmad-code-review) soldée avec succès. Application des 6 correctifs : intégration du bloc CTA final complet dans la vue article de blog (`blog/[...slug].vue`), typage optionnel de `ContactForm`, assainissement anti-caractères invisibles et limitation à 80 caractères du sujet d'email Web3Forms, harmonisation du message de confirmation vers la promesse 48h (`contact/index.vue`), restauration du nom d'entité `Notes de dev` dans le Schema.org Blog (`blog/index.vue`), et masquage accessible `content: "→" / ""` de la flèche de philosophie (`about.vue`). Gate Docker (lint, typecheck, SSG) 100% verte. Statut passé à `done`.
- 2026-09-16 : Implémentation complète de la Story 12.6 — Refonte de la page À propos avec bloc philosophie et timeline métrologie/QA, CTA d'inspection de workflow sur la Homepage et le Blog, formulaire de qualification de workflow sur Contact, et harmonisation transverse du SEO et des données structurées Schema.org sur l'ensemble des 13 routes statiques. Gate Docker (lint, typecheck, SSG) verte à 100%.

## Dev Notes

### Architecture & Contraintes d'environnement
- **Environnement Docker STRICT :** Ne jamais exécuter `pnpm` sur l'hôte macOS. Toute commande d'outillage doit s'exécuter dans Docker : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm <cmd>"`. [Source: AGENTS.md#Section 2]
- **Tokens & Design System :** Aucune couleur ou espacement en dur. Utiliser impérativement `var(--token)`. [Source: AGENTS.md#Section 5.3]
- **Primitives de Layout :** Les classes `.section`, `.section--sunken`, `.container`, `.eyebrow`, `.prose` sont des primitives globales (`app/assets/scss/base/_layout.scss`). Ne pas les redéclarer dans le bloc scoped. [Source: AGENTS.md#Section 5.3]
- **Icônes :** Utiliser les glyphes de `<ZIcon name="..." />` (`arrow`, `pin`, `mail`, `terminal`, etc.). [Source: app/components/ui/ZIcon.vue]
- **Zéro Emoji :** Règle stricte NFR6 / NFR13.
- **Formulaire Web3Forms :** Conserve la clé injectée via `useRuntimeConfig().public.web3formsAccessKey`. Web3Forms accepte n'importe quelles propriétés additionnelles dans le corps JSON et les retransmet dans le corps du courriel.

### Ce qui doit être préservé
- Le fonctionnement du honeypot anti-spam (`honeypot` invisible pour les humains) sur le formulaire de contact.
- L'annonce accessible `role="status"` et le focus sur la confirmation d'envoi.
- L'accès à la carte de visite digitale (`/contact/card`) et à l'easter egg terminal (`useTerminal`).
- La timeline chronologique et la structure sémantique `<ol>` sur `/about`.

### Items différés intégrés à cette story (depuis `deferred-work.md`)
- **Description SEO `/about` repositionnée sur les systèmes IA** (`app/pages/about.vue:142`).
- **Format de `addressLocality` Schema.org sur `/about`** (`app/pages/about.vue:159`) aligné sur `SITE.profile.city` (`France · Remote`).

### Références
- Spécification canonique : [docs/specs/spec-repositionnement-ia/SPEC.md#CAP-6](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/SPEC.md) (CAP-6, CAP-7, CAP-8, CAP-9)
- Charte éditoriale & messaging : [docs/specs/spec-repositionnement-ia/messaging-matrix.md](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/messaging-matrix.md)
- Brief Codex : [docs/jouan-ovh-offre-v1-brief-codex.md](file:///Users/simon/dev/jouan.ovh/docs/jouan-ovh-offre-v1-brief-codex.md) (Sections 16, 17, 18, 19)
- Cahier des charges : [docs/planning-artifacts/epics.md#Story-12.6](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)
- Invariants d'implémentation : [AGENTS.md](file:///Users/simon/dev/jouan.ovh/AGENTS.md)
- Travaux différés : [docs/implementation-artifacts/deferred-work.md](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/deferred-work.md)
