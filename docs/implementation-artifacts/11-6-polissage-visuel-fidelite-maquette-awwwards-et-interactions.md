---
baseline_commit: 3ac365cc1a89c92b23a9d9059f13dd45b8543fbe
---

# Story 11.6: Polissage visuel, fidélité maquette Awwwards & interactions dynamiques

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur découvrant la page d'accueil de jouan.ovh,
I want retrouver l'impact visuel immersif, le raffinement typographique et les interactions micro-cinétiques de la maquette Awwwards (hero sans rupture, header transparent puis flouté au scroll, logo officiel blanc, boutons généreux et magnétiques, cartes en 3D tilt, statistiques contrastées, carte CTA ample et aérée, footer parfaitement lisible),
so that l'expérience soit véritablement au niveau d'un portfolio primé Awwwards et reflète une qualité d'ingénierie web et de design irréprochable (FR18, FR20, FR22, FR23, FR25, FR27, UX-DR18, UX-DR20, UX-DR22, UX-DR24, UX-DR25, NFR1, NFR2, NFR11, NFR12).

## Acceptance Criteria

1. **Hero & Atmosphère continue (Zéro coupure visuelle)** :
   - **Given** la page d'accueil et la pile atmosphérique fixed `<HomeAtmosComponent />` (auroras, grille de points, scanlines, vignette)
   - **When** la page est affichée, `.hero` ne possède aucun arrière-plan opaque (`var(--bg-page)`) ni dégradé tronquant l'atmosphère globale
   - **Then** `.hero` a un fond 100% transparent et une hauteur minimale `min-height: 100vh`, s'intégrant sans rupture visuelle dans l'atmosphère continue
   - **And** le titre principal du hero adopte les proportions de la maquette (`clamp(2.6rem, 6.4vw, 5.2rem)`, `line-height: 0.98`), avec les mots clés en accentuation orange italique (`<em>...</em>`), pour une scénographie visuelle affirmée.

2. **Header transparent au repos & fondu sombre au scroll** :
   - **Given** le composant `HeaderComponent.vue` fixé en haut de page
   - **When** la position de défilement est en haut (`scrollY <= 20`)
   - **Then** le header est transparent sans bordure inférieure (`background: transparent; border-bottom: 1px solid transparent; backdrop-filter: none;`)
   - **And** dès le défilement (`scrollY > 20`), la classe `.stuck` est appliquée avec une transition douce de 0.3s (`background: color-mix(in srgb, var(--surface-0) 80%, transparent)` ou `hsl(320 30% 6% / 0.72)`, `backdrop-filter: blur(12px)`, bordure `var(--border-subtle)`)
   - **And** une barre de progression de scroll discrète (hauteur 2px, dégradé accent) est présente en haut de l'écran.

3. **Logo officiel blanc dans la barre de navigation** :
   - **Given** le lien de marque `.hdr__brand` dans `HeaderComponent.vue`
   - **When** le composant est rendu
   - **Then** l'icône gemme orange `<ZIcon name="gem">` est remplacée par le logo officiel wireframe blanc de la marque (`/images/logo_white.png` ou SVG équivalent)
   - **And** le logo est accompagné de `jouan.ovh` avec le domaine en nuance atténuée (`<b>jouan</b><span class="dim">.ovh</span>`).

4. **Dimensions et présence des boutons (`ZButton`)** :
   - **Given** les primitives `ZButton` et les boutons d'appel à l'action sur la home
   - **When** ils sont affichés en taille `lg` ou standard
   - **Then** ils bénéficient des dimensions généreuses de la maquette (`height: 46px` à `48px`, padding horizontal `0 var(--space-5)`, typo `var(--font-mono)`, `font-size: var(--fs-sm)`, `letter-spacing: var(--ls-wide)`) pour une ergonomie et un impact visuel accrus.

5. **Animation et micro-interactions des boutons (Effet magnétique & Glow)** :
   - **Given** les boutons interactifs sur la page d'accueil (ou primitive `ZButton`)
   - **When** le pointeur de la souris survole le bouton sur ordinateur de bureau
   - **Then** un micro-effet magnétique attire doucement le bouton et/ou son libellé intérieur (`.mag`) vers les coordonnées du curseur (`translate(x, y)` subtil)
   - **And** le survol déclenche un feedback lumineux (`transform: translateY(-1px)`, `box-shadow: var(--glow-accent)`)
   - **And** l'effet est neutralisé instantanément sous `prefers-reduced-motion: reduce` et sous `@media (hover: none)`.

6. **Animation 3D Tilt interactive des cartes** :
   - **Given** les cartes de la section services (`.offer` / `ZCard`) et projets
   - **When** l'utilisateur déplace la souris sur la surface d'une carte
   - **Then** la carte applique une inclinaison 3D dynamique en perspective (`perspective(800px) rotateX(...) rotateY(...) translateY(-4px)`)
   - **And** lors de la sortie du curseur (`mouseleave`), la carte revient fluidement à sa position neutre
   - **And** l'animation est strictement désactivée sous `prefers-reduced-motion: reduce`.

7. **Lisibilité & Contraste des statistiques clés** :
   - **Given** la grille des 3 cartes de statistiques (`11 années d'expérience web`, `100% TypeScript & SaaS`, `QA culture d'automatisation`)
   - **When** elles sont affichées dans la section `section--sunken`
   - **Then** chaque carte dispose d'un arrière-plan visible et lisible (`var(--surface-1)` ou `hsl(319 22% 9% / 0.5)` avec bordure `var(--border-subtle)`)
   - **And** les valeurs numériques/clés `b` sont affichées en blanc pur contrasté (`var(--text-strong)`, `font-size: var(--fs-5xl)`), et les libellés descriptifs `span` en `var(--text-muted)` sans aucune transparence excessive ni zone sombre illisible.

8. **Bloc CTA « Un projet en tête ? » ample et aéré** :
   - **Given** le conteneur `.cta` de conversion finale
   - **When** le bloc est rendu
   - **Then** il dispose d'un espacement généreux fidèle à la maquette (`padding: clamp(48px, 7vw, 84px) var(--space-6)`)
   - **And** le fond arbore un halo lumineux radial supérieur (`radial-gradient(ellipse 80% 120% at 50% 0%, var(--accent-2-soft), transparent 70%)`)
   - **And** le titre h2 gagne en échelle (`clamp(2rem, 5vw, 3.4rem)`) avec l'accentuation « *en production* » en italique accentué, et des boutons d'action largement espacés.

9. **Contraste et visibilité du Footer** :
   - **Given** le composant `FooterComponent.vue`
   - **When** le footer est affiché
   - **Then** tous les éléments textuels (titres de colonnes `// NAVIGATION`, `// PROJETS`, `// RÉSEAUX`, description du profil, mentions légales) respectent les critères de contraste WCAG AA sur le fond sombre (`var(--text-muted)` pour les labels, `var(--text-body)` pour le corps, `var(--text-strong)` au hover des liens), garantissant une lisibilité sans effort.

10. **Validation qualité & Gate Docker** :
    - **Given** l'ensemble des ajustements visuels et interactifs appliqués
    - **When** on exécute la suite de validation Docker
    - **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` passe avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript, et 13 routes statiques générées avec succès par Nitro.

## Tasks / Subtasks

- [x] Tâche 1 — Hero & Atmosphère continue (AC: 1)
  - [x] Supprimer les fonds solides/dégradés opaques `.hero__grad` avec `var(--bg-page)` dans `app/pages/index.vue`.
  - [x] Passer `.hero` en fond transparent sur `min-height: 100vh` avec padding généreux pour respirer avec le viewport.
  - [x] Rehausser la typographie du titre `.hero__title` (`clamp(2.4rem, 5.2vw, 4.4rem)`, `line-height: 1.05`) et insérer les spans/italiques accentués (`<em>`) pour un impact éditorial fidèle à la maquette.

- [x] Tâche 2 — Header dynamique au scroll & Barre de progression (AC: 2, 3)
  - [x] Mettre à jour `HeaderComponent.vue` pour démarrer avec un état transparent sans bordure au repos (`scrollY <= 20`).
  - [x] Ajouter l'écouteur de scroll (throttlé/passif ou `useEventListener`) activant la classe `.hdr--stuck` avec fond de verre sombre flouté (`backdrop-filter: blur(12px)`) et bordure `var(--border-subtle)`.
  - [x] Ajouter la barre de progression de défilement (hauteur 2px, dégradé `var(--accent)`) liée au scroll global.
  - [x] Remplacer l'icône gemme orange `<ZIcon name="gem">` par le logo officiel wireframe blanc [`public/images/logo_white.png`](file:///Users/simon/dev/jouan.ovh/public/images/logo_white.png) avec le texte `jouan.ovh` (`<b>jouan</b><span class="dim">.ovh</span>`).

- [x] Tâche 3 — Tailles des boutons & Effet magnétique (AC: 4, 5)
  - [x] Ajuster la primitive `ZButton.vue` pour les tailles `lg` et standard (hauteur 48px en lg / 42px en standard, padding horizontal généreux, typo mono, tracking étendu).
  - [x] Ajouter le support du micro-effet magnétique sur les boutons interactifs desktop (`mousemove` / décalage subtil du texte `.zbtn__inner`), avec réinitialisation sur `mouseleave` et neutralisation sous `prefers-reduced-motion: reduce`.
  - [x] Ajouter les transitions et ombres portées accentuées au hover (`var(--glow-accent)`, `translateY(-1px)`).

- [x] Tâche 4 — Effet 3D Tilt sur les cartes de services & projets (AC: 6)
  - [x] Intégrer la directive ou l'écouteur `mousemove` d'inclinaison 3D (`perspective(800px) rotateX(...) rotateY(...) translateY(-4px)`) sur les cartes de services (`ZCard` avec prop `tilt`) et les blocs journal.
  - [x] S'assurer du retour doux à la normale sur `mouseleave`.
  - [x] Encapsuler l'effet sous garde `matchMedia('(prefers-reduced-motion: reduce)')` et `import.meta.client`.

- [x] Tâche 5 — Lisibilité des Statistiques & CTA de conversion (AC: 7, 8)
  - [x] Corriger le style des cartes `.stat` dans `app/pages/index.vue` : fond `var(--surface-1)` / `hsl(319 22% 9% / 0.85)`, bordure subtile, chiffres `b` éclatants en blanc `var(--text-strong)` (`fs-5xl`), libellés `span` en `var(--text-muted)`.
  - [x] Agrandir le conteneur `.cta` (`padding: clamp(48px, 7vw, 84px) var(--space-6)`), injecter le dégradé radial supérieur d'ambiance, rehausser le titre h2 (`clamp(2rem, 4.5vw, 3.2rem)`) et espacer les CTAs.

- [x] Tâche 6 — Visibilité et contraste du Footer (AC: 9)
  - [x] Revoir les styles et contrastes de `FooterComponent.vue` pour rehausser les couleurs de texte (`var(--text-muted)` / `var(--text-strong)`, logo white wireframe).
  - [x] S'assurer que chaque lien de navigation, lien de projet et mention légale ressort clairement sur le fond sombre sans sensation d'invisibilité ou de transparence excessive.

- [x] Tâche 7 — Validation qualité & Gate Docker (AC: 10)
  - [x] Lancer la suite de validation Docker complète : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [x] Vérifier la conformité de l'affichage sur navigateur et la non-régression multi-pages (13 routes pré-rendues statiquement).

### Review Findings

- [x] [Review][Decision] Alignement de la pile de tests : Cypress vs TestCafé — TestCafé officialisé comme stack réelle de Simon.
- [x] [Review][Decision] Échelle et hauteur de ligne du Hero Title — Choix 2A validé : passage à clamp(2.6rem, 6.4vw, 5.2rem) et line-height: 0.98 (AC1). Converti en patch.
- [x] [Review][Decision] Mapping des couleurs d'accent du Footer — Choix 3A validé : conservation du parti pris Awwwards var(--accent).
- [x] [Review][Decision] 3D Tilt sur la liste des projets phares — Choix 4B validé : intégration de l'effet 3D tilt sur les projets. Converti en patch.
- [x] [Review][Patch] Remplacement des balises <img> brutes par le composant <NuxtImg> [app/components/HeaderComponent.vue:275, app/components/FooterComponent.vue:105]
- [x] [Review][Patch] Remplacement de la ville codée en dur « Valognes » par SITE.profile.city et aria-label dynamique [app/components/CurrentTime.vue:3,10]
- [x] [Review][Patch] Suppression de l'animation en boucle blink sur le séparateur horaire [app/components/CurrentTime.vue:48-57]
- [x] [Review][Patch] Prise en compte de (hover: none) et non-écrasement du lift hover CSS sur ZButton [app/components/ui/ZButton.vue:80-95]
- [x] [Review][Patch] Neutralisation du 3D tilt sous (hover: none) et garde contre division par zéro / NaN [app/components/ui/ZCard.vue:63-80]
- [x] [Review][Patch] Neutralisation complète du hover transform sous prefers-reduced-motion: reduce pour .stat et .hex [app/pages/index.vue:761-775, app/components/HexagonLinkComponent.vue:35-39]
- [x] [Review][Patch] Correction et robustesse de la barre de progression et navigation du Header [app/components/HeaderComponent.vue:123-169]
- [x] [Review][Patch] Rétablissement de la cohérence de statut : Story 11.6 en review dans sprint-status.yaml [docs/implementation-artifacts/sprint-status.yaml:63]
- [x] [Review][Patch] Typographie Hero Title conforme à l'AC1 clamp(2.6rem, 6.4vw, 5.2rem) et line-height: 0.98 [app/pages/index.vue:478]
- [x] [Review][Patch] Intégration du micro-tilt 3D sur les éléments de la liste des projets phares [app/pages/index.vue:245-280, 580-620]

### Review Findings — Epic 11 Consolidated Review

- [x] [Review][Decision] Arbitrage Shader WebGL Flow Chrome vs pur CSS — Option 1A validée (shader conservé, fallback CSS, specs alignées)
- [x] [Review][Decision] Harmonisation de la stack : TestCafé vs Cypress — Option 2A validée (TestCafé conservé pour alignement Malt)
- [x] [Review][Decision] Titre Hero H1 — Option 3A validée (H1 épuré conservé, surtitre spécialisé)
- [x] [Review][Patch] Nettoyer la référence de listener resize dans `HomeAtmosComponent.vue` [app/components/home/HomeAtmosComponent.vue:287]
- [x] [Review][Patch] Gérer la mise en veille de l'onglet via `visibilitychange` dans `HomeAtmosComponent.vue` [app/components/home/HomeAtmosComponent.vue:292]
- [x] [Review][Patch] Gérer l'événement `webglcontextlost` et bascule fallback dans `HomeAtmosComponent.vue` [app/components/home/HomeAtmosComponent.vue:281]
- [x] [Review][Patch] Remplacer les couleurs hexadécimales en dur du fallback par des tokens CSS [app/components/home/HomeAtmosComponent.vue:345]
- [x] [Review][Patch] Sécuriser le cycle de vie des écouteurs hover et reduced-motion dans `ZCustomCursor.vue` [app/components/ui/ZCustomCursor.vue:105]
- [x] [Review][Patch] Encapsuler le hover CSS de `ZButton.vue` sous `@media (hover: hover)` et sécuriser les liens désactivés [app/components/ui/ZButton.vue:202]
- [x] [Review][Patch] Supprimer l'URL Keova hardcodée en fallback dans `about.vue` pour un DRY strict [app/pages/about.vue:105]
- [x] [Review][Patch] Dynamiser la liste des projets dans `HomeHeroTerminal.vue` depuis `SITE.projects` et sécuriser l'échappement dans `Projets.ts` [app/components/home/HomeHeroTerminal.vue:106]
- [x] [Review][Patch] Sécuriser le parsing de date contre les valeurs invalides dans `formatDate.ts` [app/utils/formatDate.ts:12]
- [x] [Review][Patch] Gérer la bascule dynamique de `prefers-reduced-motion` dans `HomeBootOverlay.vue` [app/components/home/HomeBootOverlay.vue:118]
- [x] [Review][Defer] Carte vedette asymétrique pour le premier article du blog sur la Home [app/pages/index.vue:885] — deferred, pre-existing
- [x] [Review][Defer] Normalisation fine de l'adresse Schema.org (`addressLocality`/`addressCountry`) [app/composables/usePageSeo.ts] — deferred, pre-existing

## Dev Notes

- **Atmosphère & Hero :** La maquette [`Home - Awwwards.html`](file:///Users/simon/dev/jouan.ovh/docs/design_system/ui_kits/jouan-site/Home%20-%20Awwwards.html) repose sur un conteneur d'atmosphère `.atmos` en `position: fixed; inset: 0; z-index: 0;` avec 3 auroras (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`), la grille de points (`.grid-dots`), les scanlines CRT et la vignette. Le Hero est désormais **entièrement transparent** afin de flotter au-dessus de cette atmosphère sans délimitation carrée ou coupure de couleur.
- **Header scroll behavior :** Dans `HeaderComponent.vue`, le header est fixé en haut avec un fond transparent sans bordure à `scrollY <= 20`, puis bascule vers `.hdr--stuck` avec fond de verre flouté (`backdrop-filter: blur(12px)`) et bordure `var(--border-subtle)` au scroll. La fine barre de progression supérieure suit la position de défilement.
- **Magnetic buttons & Tilt cards :** Implémentés au cœur des primitives `ZButton.vue` (effet magnétique 2D sur le conteneur et son sous-élément `zbtn__inner`) et `ZCard.vue` (prop `tilt` avec projection `perspective(800px) rotateX(...) rotateY(...)`), neutralisés automatiquement sous reduced-motion.
- **Tokens SCSS & Docker gate :** Conforme aux invariants `AGENTS.md` — 0 erreur ESLint/Stylelint, 0 erreur TypeScript vue-tsc, 13 routes statiques SSG Nitro générées dans le conteneur Docker.

### Project Structure Notes

- Fichiers modifiés :
  - `app/pages/index.vue` (hero transparent sans coupure, h1 expressif, cartes stats contrastées et lisibles, CTA ample et aéré, activation tilt sur les cartes)
  - `app/components/HeaderComponent.vue` (header transparent initialement, classe `.hdr--stuck` au scroll, logo white wireframe, barre de progression)
  - `app/components/FooterComponent.vue` (logo white wireframe, contrastes renforcés des liens et en-têtes)
  - `app/components/ui/ZButton.vue` (dimensions généreuses, micro-effet magnétique fluide)
  - `app/components/ui/ZCard.vue` (support du 3D tilt interactif sur mousemove)

### References

- [Maquette Awwwards concept](file:///Users/simon/dev/jouan.ovh/docs/design_system/ui_kits/jouan-site/Home%20-%20Awwwards.html)
- [AGENTS.md](file:///Users/simon/dev/jouan.ovh/AGENTS.md)
- [Sprint Status](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/sprint-status.yaml)
- [Epics & Stories](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md#epic-11)

## Dev Agent Record

### Agent Model Used

Gemini 3.7 Flash (Medium)

### Debug Log References

- Validation Docker exécutée avec succès (`pnpm lint && pnpm typecheck && pnpm generate`) : 0 erreur, 13 routes pré-rendues statiquement.

### Completion Notes List

- ✅ Hero sans coupure : suppression du fond solide `.hero__grad`, hero 100% transparent sur `min-height: 100vh`, titre ample avec em en orange italique.
- ✅ Header au scroll : transparent sans bordure au repos (`scrollY <= 20`), fond sombre flouté (`backdrop-filter: blur(12px)`) au scroll (`.hdr--stuck`), barre de progression 2px en haut.
- ✅ Logo officiel blanc : remplacement du diamant orange par `logo_white.png` dans le header et le footer.
- ✅ Boutons agrandis et magnétiques : primitive `ZButton` enrichie avec dimensions généreuses (48px en lg, 42px en standard) et micro-effet magnétique sur desktop.
- ✅ 3D Tilt des cartes : support natif dans `ZCard` (`prop tilt`) sur les services et les articles du journal.
- ✅ Statistiques lisibles et contrastées : fond `var(--surface-1)` / `85%`, chiffres `b` en blanc pur éclatant `var(--text-strong)` (`fs-5xl`).
- ✅ Bloc CTA « Un projet en tête ? » : padding ample (`clamp(48px, 7vw, 84px)`), halo lumineux radial supérieur, typographie h2 expressive et boutons aérés.
- ✅ Footer contrasté : contraste et visibilité rehaussés des rubriques et liens.

### File List

- `app/pages/index.vue`
- `app/components/HeaderComponent.vue`
- `app/components/FooterComponent.vue`
- `app/components/ui/ZButton.vue`
- `app/components/ui/ZCard.vue`
- `docs/implementation-artifacts/11-6-polissage-visuel-fidelite-maquette-awwwards-et-interactions.md`
- `docs/implementation-artifacts/sprint-status.yaml`
- `docs/planning-artifacts/epics.md`
