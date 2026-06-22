---
id: SPEC-design-system-revamp
companions:
  - pages.md
  - primitives.md
  - ../../project-context.md
  - ../../design_system/README.md
  - ../../design_system/ui_kits/jouan-site/README.md
sources: []
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Refonte jouan.ovh sur le nouveau design system

## Why

Une **vision à réaliser** : le site personnel de Simon Jouan (développeur web freelance) doit incarner sa nouvelle identité de marque — un design system dark-first, à saveur Ubuntu/terminal (orange Ubuntu + aubergine, Ubuntu Mono), déjà finalisé dans `docs/design_system/` (tokens CSS, primitives React, UI kit complet). Le site actuel (Nuxt 3 + SCSS/Vue) ne reflète pas cette identité. Il faut **porter** ce design system vers le codebase Vue/SCSS, page par page. La marque vise un positionnement « artisan indie soigné × orienté IA × accessible » et le site en est la vitrine principale. Prérequis structurant : la stack est vieillissante (Nuxt 3 + `@nuxt/bridge-edge`) et doit être **entièrement mise à niveau avant** la refonte, pour bâtir sur une base saine.

## Capabilities

- id: CAP-1
  intent: Le projet est migré vers une stack à jour (Nuxt 4, abandon de `@nuxt/bridge-edge`, toutes dépendances actuelles) avant tout travail de refonte visuelle.
  success: `pnpm install` puis `pnpm generate` (exécutés via Docker) réussissent sans erreur sur Nuxt 4 ; le site pré-refonte rend les mêmes pages qu'avant et se déploie sur `gh-pages` avec `CNAME` intact.

- id: CAP-2
  intent: Les tokens du design system (couleurs, typographie, espacement, rayons, élévation, motion, polices) sont disponibles dans le codebase comme source unique de vérité du style.
  success: Les valeurs de `docs/design_system/tokens/*.css` sont consommables depuis n'importe quel composant Vue (via SCSS `@use` et/ou CSS custom properties globales) ; aucune valeur de couleur/espace/rayon n'est hardcodée dans les nouveaux composants.

- id: CAP-3
  intent: Les primitives du design system sont recréées en composants Vue 3 réutilisables.
  success: `Button`, `Card`, `Badge`, `Tag`, `Input`, `Avatar`, `Prompt`, `TerminalWindow` existent en `.vue` (`<script setup>`), stylées via les tokens, et rendent conformément aux références de `docs/design_system/components/` (voir `primitives.md`).

- id: CAP-4
  intent: Le châssis global (header fixe, footer, navigation, liens sociaux hexagonaux) est refondu selon le design system.
  success: Header fixe 56px avec logo diamant, footer 56px, nav fonctionnelle, hexagones sociaux ; conforme au UI kit, dark-first, responsive mobile.

- id: CAP-5
  intent: La page d'accueil présente hero + aperçu services + stats + projets sélectionnés.
  success: `/` rend les 4 blocs conformément à `Home.jsx` du UI kit (voir `pages.md`), avec la **direction de hero Terminal (A)** retenue en production.

- id: CAP-6
  intent: Une page Services présente les trois offres (WordPress / Applications web / IA) et les étapes du process.
  success: Nouvelle route `/services` rendant les 3 offres + steps conformément à `Services.jsx`.

- id: CAP-7
  intent: La page À-propos présente portrait, bio, timeline d'expérience, formation et stack.
  success: `/about` rend ces sections conformément à `About.jsx`.

- id: CAP-8
  intent: Le blog liste les articles et affiche un article en vue prose + code, alimenté par `@nuxt/content`.
  success: `/blog` (index avec empty-state soigné) et `/blog/[...slug]` (prose + blocs de code stylés) rendent conformément à `Blog.jsx`, en réutilisant le pipeline `@nuxt/content` existant.

- id: CAP-9
  intent: Une page Contact propose un formulaire, une carte d'infos, un CTA terminal et les liens sociaux.
  success: Nouvelle route `/contact` rendant formulaire + infos + CTA terminal + socials conformément à `Contact.jsx`.

- id: CAP-10
  intent: L'easter-egg terminal draggable existant est conservé et restylé selon le design system.
  success: Le sous-système `components/terminal/` fonctionne (ouverture modale, commandes `help`/`about`/`skills`/`projets`/`contact`/`clear`), avec le style terminal du DS (fond aubergine profond, prompt vert, blur, caret clignotant) ; aucune commande existante n'est cassée.

- id: CAP-11
  intent: L'interface respecte les fondamentaux d'accessibilité et de motion du design system.
  success: `prefers-reduced-motion` respecté (seule boucle = caret terminal) ; états focus/hover/press visibles ; contraste texte lisible sur fonds sombres ; navigation clavier opérante.

## Constraints

- **Migration d'abord** : CAP-1 doit être livrée et verte (build + déploiement) avant d'entamer CAP-2 et au-delà.
- **Outillage : pnpm + Docker** : le gestionnaire de paquets est **pnpm** (jamais `npm`/`yarn`) ; tout le dev et l'outillage (install, lint, typecheck, generate) passe **par Docker** (`docker compose`), pas sur l'hôte.
- **Dark-first uniquement** : aucun thème clair. Surfaces sombres teintées aubergine ; orange Ubuntu = unique couleur accent héros.
- **Tokens, pas de valeurs en dur** : la source de vérité du style est `docs/design_system/tokens/` ; les composants consomment des tokens (SCSS `@use` / CSS vars).
- **Port, pas copie** : les `.jsx`/CSS du DS ne sont pas copiés tels quels ; recréation en Vue 3 `<script setup>` + SCSS `@use` (jamais `@import`).
- **Compatibilité prerender** : tout doit passer `nuxi generate` (site statique) ; accès DOM gardés (`onMounted` / `import.meta.client`).
- **Déploiement préservé** : `CNAME` et la chaîne `pnpm generate` → `gh-pages` ne doivent pas régresser.
- **Langue & voix** : français, 1re personne « je », vouvoiement, pas d'emoji.
- **Typo signature** : Ubuntu Mono (titres/labels/code), Ubuntu sans (corps long).
- **Easter-egg terminal conservé** : feature secondaire à préserver, pas à supprimer.

## Non-goals

- Pas de thème clair / bascule de thème.
- Pas de copie 1:1 du site live actuel (c'est un rebrand, une interprétation).
- Pas de backend ni CMS au-delà du markdown `@nuxt/content` existant.
- Le sélecteur de hero et le switcher d'accent du UI kit sont des outils de **prototype**, non livrés : une seule direction est retenue en production.
- Pas de rédaction de contenu marketing net-nouveau au-delà de ce que fournissent le DS / `data.js` et le contenu existant (le copywriting fin est hors-périmètre de cette refonte technique).
- Pas d'introduction d'un framework de test dans cette refonte (la barre reste lint + build vert), sauf décision séparée.

## Success signal

Le site jouan.ovh, reconstruit sur Nuxt 4, rend toutes ses pages (Accueil, Services, À-propos, Blog + article, Contact) fidèles au UI kit du design system — dark-first, Ubuntu Mono, accent orange — avec l'easter-egg terminal fonctionnel, et est déployé en production sur `gh-pages` avec le domaine custom intact. Un visiteur perçoit immédiatement la nouvelle identité « OS de nuit » cohérente sur tout le parcours.

## Decisions

- **Hero d'accueil** : direction **Terminal (A)** retenue (CAP-5).
- **Routes** : `/services` et `/contact` ajoutées comme pages dédiées (CAP-6, CAP-9).
- **Cible de migration (CAP-1, livrée en Epic 1)** : **Nuxt 4 + Vue 3 + TypeScript 6 + ESLint 10 (flat config via `@nuxt/eslint`)**, abandon de `@nuxt/bridge-edge`, code sous `app/`, toutes deps à jour. **Gestionnaire de paquets : pnpm** (migration depuis Yarn) ; **dev et outillage via Docker** (`docker compose`). `@nuxt/content` v3, `@nuxt/image` v2.

## Assumptions

- Accent **orange Ubuntu** retenu par défaut en production (la marque définit l'orange comme unique couleur héros).
- Le contenu français de départ est repris de `data.js` du UI kit et du contenu existant, puis ajusté ; pas de recherche de contenu nouvelle.
- Le blog reste alimenté par `@nuxt/content` en markdown (dossier `content/` à créer).
