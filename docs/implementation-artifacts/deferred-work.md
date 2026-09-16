# Deferred work

_Travaux réels mais reportés, remontés par les revues de code. À reprendre dans la story/epic indiquée._

---

## 📋 Inventaire consolidé (synthèse — maj rétro Epic 9, 2026-06-29)

_Vue d'ensemble par destination. Le détail par story est conservé dans les sections chronologiques ci-dessous. Aucune dette technique laissée dans les épics (chaque story a soldé ses findings) ; ce sont des **généralisations DS-wide / d'architecture** délibérément regroupées pour être traitées en un seul passage._

> **Décision rétro Epic 9 (2026-06-29) :** les épics 1→9 sont `done`, **mais la refonte n'est pas livrée**. Tout le reste (a11y résiduel non couvert par 9.1/9.2, SEO, RGPD, déploiement, audit a11y émulé) est **consolidé dans un futur Epic 10 « fin de refonte »** — épic à écrire (handoff `bmad` planification). Epic 9 se clôt tel quel.

### ✅ Soldé en Epic 9

- ~~**Repli `forced-colors` DS-wide**~~ — ✅ **Résolu (story 9.1)** : repli posé une seule fois au niveau des primitives DS (`ZButton`, `ZCard`, `ZTag`, `ZInput`) via `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (rendu en couleur système sous forced-colors, le ring `box-shadow` restant le focus normal) ; anneau DS `--ring-accent` + même repli ajoutés aux liens du châssis (logo + nav header/menu, liens footer) qui n'avaient que l'outline UA. _(revues 3.2, 5.1)_
- ~~**Filet `prefers-reduced-motion` global + exception caret**~~ — ✅ **Résolu (story 9.2)** : `base/_motion.scss` ramène animations/transitions à l'instantané site-wide ; caret natif du terminal intact, caret déco du hero figé visible.
- ~~**Contraste — `--text-faint` sous AA**~~ — ✅ **Résolu (story 9.2)** : 4 textes informatifs réels remontés à `--text-muted` (token-only).
- ~~**Clavier — Échap + retour de focus terminal**~~ — ✅ **Résolu (story 9.2)**.

### → Epic 10 — Fin de refonte (épic à écrire ; décision rétro Epic 9)

**A11y résiduel (non couvert par les AC de 9.1/9.2) :**

1. ~~**Généralisation de la convention a11y titres + listes**~~ — ✅ **Résolu en 10.2**
2. ~~**Audit site-wide des liens `target="_blank"`**~~ — ✅ **Résolu en 10.3**
3. ~~**Sémantique a11y de la colonne `/contact`**~~ — ✅ **Résolu en 10.2**
4. ~~**Audit a11y émulé OS-level**~~ — ✅ **Résolu (story 10.4)** : validation runtime `forced-colors: active` et `prefers-reduced-motion: reduce` + parcours lecteur d'écran VoiceOver. _(revues 9.1, 9.2, 10.4)_
5. ~~**Unifier les deux idiomes forced-colors**~~ — ✅ **Résolu (story 10.4)** : bloc page-level `@media` d'`index.vue` rabattu sur le repli inline standard DS `outline: 2px solid transparent; outline-offset: 2px;`. 100% des focusables unifiés. _(revues 9.1, 10.4)_

**SEO :**

6. **Centralisation SEO site-wide** — la **dette concrète est soldée** (6.2) : `SITE_URL` unique dans `app/utils/seo.ts` (dédup `/about`+`/blog`+article), JSON-LD via `jsonLdScript()` qui échappe `</script>`. ✅ **`SITE_URL` sourcé depuis `runtimeConfig` fait en 10.1** (`runtimeConfig.public.siteUrl` + composable `useSiteUrl()`, surchargeable `NUXT_PUBLIC_SITE_URL`). **Reste** (architecture, non-dette) : migrer vers `useSeoMeta`/`app.head` partagé, ajouter `publisher`/`Organization` (ou `nuxt-schema-org`), et étendre OG/JSON-LD aux pages encore nues (home, services, contact). → **story 10.5**. _(revues 5.1, 6.1, 6.2)_
7. ~~**Domaine de production**~~ — ✅ **Résolu en 10.7** : DNS OVH configuré (`jouan.ovh` → 4 IPs GitHub Pages, `www` → CNAME), `public/CNAME` = `jouan.ovh`, `nuxt.config.ts` `siteUrl` = `https://jouan.ovh`, CI guard `Verify static output` aligné sur `jouan.ovh`, HTTPS actif et forcé sur GitHub Pages.

**Légal / RGPD :**

8. ~~**Politique de confidentialité (RGPD)**~~ — ✅ **Résolu en 10.6** : pages `/confidentialite` et `/mentions-legales` créées et liées depuis le footer et le formulaire, avec mention de Web3Forms, des droits RGPD et de l'hébergement.

**Déploiement :**

9. ~~**Déploiement gh-pages réel**~~ — ✅ **Résolu en 10.7** : premier merge sur `main` et déploiement réel `gh-pages` exécuté et validé. Site servi en production avec HTTPS sur `https://jouan.ovh`.

---

## Deferred from: code review of 12-1-source-unique-de-donnees-sitets-et-coherence-globale (2026-09-16)

- **Description SEO `/about` non encore repositionnée sur les systèmes IA** (`app/pages/about.vue:142`) — la description de la page mentionne encore le profil antérieur Nuxt/NestJS/SaaS. Prévu au scope de la Story 12.6 (refonte page À propos & SEO site-wide).
- **Format de `addressLocality` Schema.org sur `/about`** (`app/pages/about.vue:159`) — `addressLocality` hérite de `"France · Remote"`. Prévu pour révision et ajustement structuré dans la Story 12.6.

## Deferred from: code review of 9-2-motion-reduit-contraste-et-clavier (2026-06-29)

- **Placeholder `ZInput` ~3.7:1 sur `--bg-input` (< 4.5:1 AA)** — résidu conscient : `--text-muted` (relevé de `--text-faint` ~2.2:1) reste sous AA sur la surface la plus claire, mais le champ porte un `<label>` visible persistant (placeholder = texte supplémentaire, zone grise WCAG) ; monter encore le ferait passer pour une saisie. Acceptable tel quel ; à revoir si un token de placeholder dédié ≥ 4.5:1 est introduit. _(revue 9.2)_
- ~~**Audit a11y émulé OS-level (reduced-motion + forced-colors + lecteur d'écran)**~~ — ✅ **Résolu en 10.4** : validation runtime complète effectuée sous émulation navigateur & VoiceOver. _(revues 9.2, 10.4)_

## Deferred from: code review of 9-1-etats-interactifs-coherents (2026-06-29)

- ~~**Unifier les deux idiomes forced-colors**~~ — ✅ **Résolu en 10.4** : repli inline `outline: 2px solid transparent; outline-offset: 2px;` généralisé à `index.vue`, suppression du bloc `@media` local. _(revues 9.1, 10.4)_
- ~~**Émulation `forced-colors: active` non rejouée**~~ — ✅ **Résolu en 10.4** : vérification runtime sous contraste forcé émulé sur l'ensemble des routes. _(revues 9.1, 10.4)_

## Deferred from: code review of 7-2-infos-cta-terminal-et-socials (2026-06-26)

- **a11y sémantique de la colonne droite `/contact`** — la carte infos rend les paires label/valeur en `<div>` (pas de `<dl>/<dt>/<dd>`), le préfixe `//` est lu « slash slash », pas de titre de section, et le CTA terminal n'a pas `aria-haspopup="dialog"`. Fidèle au kit, non bloquant. À reprendre dans le **lot a11y Epic 9** (item 2 consolidé : sémantique titres/listes/régions). _(La ligne de prompt décorative a été traitée en patch 7.2 — `aria-hidden`.)_
- ~~**DRY — données de contact inline**~~ — ✅ **Résolu en 8.2** : `contact.email`/`city` (`/contact`) et `profile.email`/`city` (`/about`) consomment désormais la source unique `app/data/site.ts` (`SITE.profile`). _(La consolidation `SITE_URL` SEO reste un sujet distinct, item 4.)_

## Deferred from: code review of 7-1-route-contact-et-formulaire (2026-06-26)

- **SEO `/contact`** — `useHead` ne pose que `title`+`description` (pas d'OG/canonical/JSON-LD), comme `/services`. Déjà couvert par l'**item 4 consolidé** (« étendre OG/JSON-LD aux pages encore nues : home, services, **contact** »). → story SEO dédiée / Epic 9. _(Les 2 autres findings 7.1 — focus a11y à l'envoi, erreurs collantes — sont des **patchs** de la story, pas des différés ; cf. Review Findings du ticket.)_
- ~~**Clé d'accès Web3Forms à provisionner**~~ — ✅ **OK** (Simon, 2026-06-26) : clé créée et renseignée dans l'env `NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY`. L'envoi réel du formulaire `/contact` est opérationnel.
- **Politique de confidentialité (RGPD)** — le formulaire collecte nom/email/message transmis à un tiers (Web3Forms) ; une **notice courte est posée sous le formulaire**. Reste à publier une **page « politique de confidentialité »** dédiée (base légale, finalité, durée, sous-traitant Web3Forms, droits) et à la lier — cf. skill `rgpd-france`. → tâche légale de fin de refonte (hors périmètre 7.1/7.2).

## Deferred from: code review of 6-2-vue-article-prose-et-code (2026-06-25)

- **Centralisation SEO site-wide (consolidation)** — _Dette concrète résolue en 6.2_ : `SITE_URL` extrait dans `app/utils/seo.ts` (source unique, dédup `/about`+`/blog`+`/blog/[...slug]`) ; JSON-LD via helper `jsonLdScript()` qui **échappe `<`** (plus de risque `</script>`). _Reste_ (architecture, non-dette) : migration `useSeoMeta`/`app.head` partagé, `SITE_URL` depuis `runtimeConfig`, `publisher`/`Organization` (ou `nuxt-schema-org`). → story SEO dédiée / Epic 9.
- ~~**a11y dates blog + flèche retour**~~ — ✅ **Résolu** : dates en `<time :datetime>` (article + index) ; `←` du lien retour en `<span aria-hidden="true">`. _Reste_ la généralisation a11y (eyebrow→titre + listes home/services) → Epic 9.

## Deferred from: code review of 6-1-index-du-blog-et-empty-state (2026-06-23)

- ~~**SEO `/blog`**~~ — ✅ **Résolu sur `/blog`** (décision Simon : zéro dette) : `og:*`/`twitter:*`/`canonical` + JSON-LD `Blog`→`BlogPosting` ajoutés au `useHead`, vérifiés dans le HTML prerendu. _Reste_ la **centralisation SEO site-wide** (autres pages que `/about` + `/blog`, via `useSeoMeta` partagé / `app.head`) — Epic 9.
- ~~**Sémantique liste du feed d'articles**~~ — ✅ **Résolu** : feed en `<ul class="blog__list">` + `<li>` par article (reset de liste, rendu identique). _Reste_ la **généralisation a11y** (eyebrow→titre + listes home/services) — Epic 9.

## Deferred from: code review of 5-2-timeline-formation-et-stack (2026-06-23)

- ~~**Sémantique a11y des sections CV de `/about`**~~ — ✅ **Résolu sur `/about`** (décision Simon : zéro dette) : libellés de section en `<h2 class="eyebrow">` (outline `h1 → h2×4`), expériences en `<ol>/<li>`, formation et stack en `<ul>/<li>` ; rendu visuel identique (h2 neutralisé `font-weight`/`line-height`, listes `list-style:none` + marges reset). `<time datetime>` écarté (dates = plages, pas de valeur machine). _Reste à généraliser_ la convention (eyebrow→titre + listes) à **home / services**, en lot avec les items a11y ci-dessous (process `<ol>` 4.2, liens `_blank` 3.3) — **passage a11y d'Epic 9**.

## Deferred from: code review of 5-1-portrait-et-bio (2026-06-23)

_Décision Simon : zéro dette technique → les 3 items ci-dessous ont été traités immédiatement (commit de correctifs de revue), pas reportés._

- ~~**Duplication inter-pages des primitives de layout**~~ — ✅ **Résolu** : primitives `.section` / `.section--sunken` / `.container` / `.eyebrow` / `.prose` extraites dans `app/assets/scss/base/_layout.scss` (global, chargé par `main.scss`) ; duplications scoped retirées de `index.vue`, `services.vue`, `about.vue`. Vérif visuelle desktop des 3 pages : aucune régression.
- ~~**Repli `forced-colors` du ring de focus (lien bio `keova.app`)**~~ — ✅ **Résolu localement** : `outline: 2px solid transparent` + `outline-offset` sur le `:focus-visible` du lien (rendu en couleur système en contraste forcé). Le **pattern DS-wide** identique (`ZButton`/`ZTag`/`ZCard`/`ZInput`) reste tracé ci-dessous (revue 3.2) pour un correctif unique au niveau du DS — Epic 9.
- ~~**Balises Open Graph / Twitter / canonical absentes**~~ — ✅ **Résolu** pour `/about` : `og:*`, `twitter:*` et `canonical` ajoutés au `useHead` (domaine `dev.jouan.ovh`), vérifiés dans le HTML prérendu. _Reste à étendre aux autres pages_ (centralisation possible via `useSeoMeta` partagé / `app.head`) — amélioration SEO site-wide à planifier hors 5.1.

## Deferred from: code review of 4-2-section-process (2026-06-22)

- **Sémantique `<ol>` pour la séquence du process (`/services`)** — Les 4 étapes ordonnées sont rendues en grille de `<div>` (numéros « 01 »…« 04 » en texte). Fidèle à `Services.jsx` et l'ordre est déjà annoncé aux lecteurs d'écran (AC satisfait, non bloquant). Amélioration : passer en `<ol>`/`<li>` avec les numéros `aria-hidden` (ordre porté par la liste). Décision Simon : accepté tel quel pour 4.2, amélioration différée au passage a11y d'Epic 9.

## Deferred from: code review of 3-3-projets-selectionnes (2026-06-22)

- **Audit site-wide des liens `target="_blank"` sans indication « nouvel onglet »** — _Les cartes projet de `/` ont été traitées localement (span sr-only « (ouvre dans un nouvel onglet) ») lors du fix 3.3._ Reste à auditer/uniformiser les **autres** liens `_blank` du site (hexagones sociaux du header/footer, etc.) et idéalement à factoriser un helper de lien externe (icône + libellé sr-only). Recommandation WCAG G201. À traiter dans le passage a11y d'Epic 9.

## Deferred from: code review of 3-2-apercu-services-et-stats (2026-06-22)

- ~~`role="img" title=""` résiduel sur le wrapper racine `.init`~~ — ✅ **Résolu** lors du fix 3.2 (commit `132093d`) : attribut retiré de `app/layouts/default.vue`.
- **Repli `forced-colors` DS-wide (rings de focus en `box-shadow`)** — En mode contraste forcé (Windows High Contrast), les `box-shadow` sont supprimées → le ring de focus disparaît. _Les focusables propres aux pages `/` (`.offer__more`, `.hero-term__open`) ont reçu un repli `@media (forced-colors: active)` lors du fix 3.2._ Reste le pattern **systémique des primitives DS** (`ZButton`, `ZTag`, `ZCard`, `ZInput`, liens…) qui utilisent `box-shadow: var(--ring-accent)` : à corriger une seule fois au niveau du DS (repli `outline` sous `forced-colors`). Relève d'Epic 9 (contraste & clavier).

## Deferred from: code review of 8-1-style-terminalwindow-et-prompt (2026-06-26)

_Décision Simon : zéro dette technique → l'item ci-dessous a été traité dans la story 8.1 (non reporté en 8.3)._

- ~~**CSS mort `.command-prefix` / `.git-prompt-branch` dans `TerminalComponent.vue`**~~ — ✅ **Résolu en 8.1** : classes mortes confirmées par `grep` (aucun usage dans le `<template>` ni dans `programs/`) et **supprimées**. Plus de nettoyage à reporter en 8.3.

## Deferred from: code review of 8-2-preserver-les-commandes-et-louverture (2026-06-26)

_Décision Simon (approche DRY/SOLID) : zéro dette → les items ci-dessous ont été traités dans la story 8.2, pas reportés._

- ~~**DRY — données dupliquées en dur dans les programmes terminal**~~ — ✅ **Résolu en 8.2** : **source de vérité unique `app/data/site.ts`** (`SITE.profile`/`skills`/`projects`, typée `IProfile`/`IProject`). Tous les consommateurs branchés — `Skills/Projets/Contact/About.ts` (terminal), `index.vue`, `about.vue`, `contact.vue`, `FooterComponent.vue` — rendu **identique** vérifié au navigateur. **Solde aussi** l'item « données de contact inline » de la revue 7.2 (ci-dessus). _Reste, hors-scope DRY_ : les `experiences`/`degrees` divergent de **contenu** entre le CV terminal (`About.ts`, 4 xp / 3 diplômes détaillés) et `/about` (3 xp / 2 diplômes condensés) — leur unification est une **décision de contenu** (choisir la version canonique + adapter l'affichage), à trancher en passage CV dédié, pas un refactor mécanique.
- ~~**Duplication du bookkeeping d'historique dans la branche `clear`**~~ — ✅ **Résolu en 8.2** : helper `recordHistoryAndResetInput()` partagé entre la branche `clear` et le flux normal de `submitInput`. Plus de report en 8.3.

## Deferred from: code review of 10-1-decision-hebergement-prod-et-derisquage-deploiement (2026-07-02)

- **`article.image.src` sans slash initial → URL d'image malformée** — Dans `blog/index.vue` (JSON-LD `image`) et `blog/[...slug].vue` (`og:image` + JSON-LD), `` `${siteUrl}${article.image.src}` `` concatène sans séparateur : un frontmatter d'article avec `image: { src: "images/x.webp" }` (sans `/` initial) produirait `https://dev.jouan.ovhimages/x.webp`. **Pré-existant** (identique avec l'ancienne constante `SITE_URL`, non introduit par 10.1) et **non déclenchable aujourd'hui** (`content/blog/` vide → 0 article). `content.config.ts` type `image.src` en `z.string()` sans contrainte de format. À corriger à la **factorisation de la construction d'URL SEO de la story 10.5** (helper unique + normalisation slash, ou schéma `image.src` `startsWith("/")`). _(revue 10.1 — Edge Case Hunter)_

## Deferred from: code review of 10-1-decision-hebergement-prod-et-derisquage-deploiement (2026-09-12)

- **`article.image.src` sans slash initial → URL d'image malformée** — Reconfirmé par re-review 10.1 (`app/pages/blog/index.vue:122`, `app/pages/blog/[...slug].vue:121`). Même verdict : pré-existant au baseline, non déclenchable avec `content/blog/` vide, déjà routé vers la normalisation/factorisation SEO de la story 10.5.

## Deferred from: code review of 10-2-a11y-semantique-residuelle (2026-09-13)

- **Rôle dialog et accessibilité interne de la fenêtre terminal** — Les déclencheurs du terminal (`contact.vue`, `index.vue`) portent désormais `aria-haspopup="dialog"`, mais la fenêtre elle-même (`WindowWrapperComponent.vue`) ne porte pas encore de `role="dialog"`, `aria-modal="true"`, ni de piège de focus. Composant hérité Options API propre au header (hors périmètre 10.2). À traiter lors d'une refonte / consolidation a11y du terminal ou en story 10.4. _(revue 10.2 — Blind + Edge Case Hunter)_

## Deferred from: code review of 10-4-validation-a11y-emulee-et-unification-forced-colors (2026-09-13)

- **Terminal input `.user-input` sans outline de focus en contraste forcé** (`TerminalComponent.vue:461`) — CLI terminal avec caret natif coloré (`caret-color`, `caret-shape: block`). En mode contraste forcé, le caret natif sert d'indicateur de focus sans ring de focus extérieur. Préexistant (Epic 8).
- **`ZInput` utilise `&:focus` plutôt que `:focus-visible`** (`ZInput.vue:173`) — Stylage du focus appliqué au focus natif des formulaires plutôt qu'exclusivement au clavier. Préexistant (Epic 2).
- **Terminal resize handle manipulable uniquement à la souris** (`TerminalComponent.vue:320`) — `<div>` de redimensionnement de fenêtre avec drag à la souris, sans contrôle clavier équivalent. Préexistant (Epic 8).
- **Accessibilité interne de la fenêtre terminal (rôle dialog / focus trap)** (`TerminalComponent.vue:1`) — Fenêtre terminal interactive sans `role="dialog"`, nom accessible ou confinement de focus (déjà tracé en revue 10.2). Préexistant (Epic 8).
- **Honeypot input sous `aria-hidden="true"`** (`contact.vue:178`) — Champ antispam masqué visuellement et aux technologies d'assistance. Préexistant (Epic 7).

## Deferred from: code review of 10-5-seo-centralise-site-wide (2026-09-13)

- **Prix numériques et devise structurée (`priceCurrency`) pour les offres dans Schema.org** (`app/pages/services.vue:141-147`) — Les prestations exposent des libellés UI de présentation (« à partir de 1 500 € », « sur devis »). Une formalisation stricte sous forme de grille tarifaire machine-readable Schema.org (`priceCurrency: 'EUR'`, `price: 1500`) relève d'une décision de contenu/commerciale sur la formalisation tarifaire.

## Deferred from: code review of 10-6-conformite-legale-rgpd-mentions (2026-09-13)

- **Mutualisation des styles partagés `.legal__*`** (`app/pages/confidentialite.vue`, `app/pages/mentions-legales.vue`) — Les deux pages dupliquent actuellement leur bloc `<style scoped>` `.legal__*`. Préexistant/standard pour des pages Vue distinctes ; factorisable dans un partiel SCSS si d'autres pages légales devaient être créées.
- **Domaine canonique staging par défaut en build local (`dev.jouan.ovh`)** (`nuxt.config.ts:59`) — Dépend de la story 10.7 (Mise en production réelle, FR17 : bascule de `SITE_URL` vers `https://jouan.ovh` et domaine de production). Déjà tracé et planifié en story 10.7.

## Deferred from: code review of 11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique (2026-09-13)

- ~~**Alignement de la copie commerciale, terminal JouanOS et tags hero de la page d'accueil**~~ — ✅ **Résolu en 11.2** (`HomeBootOverlay.vue`, `HomeHeroTerminal.vue`, `index.vue`).
- ~~**Marquee de stack moderne ordonnée et mise en avant des 3 services**~~ — ✅ **Résolu en 11.3** (`HomeStackMarquee.vue`, `index.vue`).
- ~~**Preuves statistiques SaaS (100k+, 85%), journal technique et bouton CTA vers profil Malt**~~ — ✅ **Résolu en 11.4** (projets SaaS, stats clés, journal, cta final dans `index.vue`).
- ~~**Audit SEO transverse et mise à jour des métadonnées secondaires** (`app/pages/about.vue`)~~ — ✅ **Résolu en 11.5** (`about.vue` : bio, rôle Full Stack TS, localisation Rouen, expériences et JSON-LD synchronisés).

## Deferred from: code review of 11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles (2026-09-13)

- **Aligner le catalogue de la page dédiée `/services` et ses métadonnées SEO/JSON-LD avec les 3 nouvelles offres de l'accueil** (`app/pages/services.vue`) — La page `/services` actuelle présente toujours le catalogue historique (WordPress, applications, IA) et les descriptions associées. La refonte complète de `/services` pour calquer les 3 offres SaaS Full Stack TS relève d'une future story d'évolution de la page services.
- **Couverture automatisée par tests E2E / visuels de la boucle continue du marquee** (`app/components/home/HomeStackMarquee.vue`) — Validation automatisée du défilement, du `:hover` et de l'arrêt sous reduced-motion. Prévu dans la validation transverse de la **Story 11.5**.

## Deferred from: code review of 11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion (2026-09-13)

- **Différenciation éditoriale d'une carte vedette dans le journal (CAP-7)** (`app/pages/index.vue:150`) — La spécification CAP-7 envisageait une carte vedette et des vignettes secondaires. L'AC3 de la story 11.4 a implémenté une grille uniforme élégante à 3 cartes conforme à la maquette `Home - Awwwards.html`. La hiérarchisation avancée (première carte mise en avant) pourra être reprise lors de l'enrichissement éditorial du blog.

## Deferred from: code review of 11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker (2026-09-13)

- **Nettoyage résiduel des mentions « WordPress » sur les autres pages secondaires** (`app/pages/contact.vue`, `app/pages/blog/index.vue`) — Si la page `about.vue` a été harmonisée en Story 11.5 et `/services` fait l'objet d'un suivi différé dédié, `contact.vue` (placeholder de formulaire et description SEO) et `blog/index.vue` (sous-titre et meta description) conservent des mentions WordPress historiques à réaligner lors d'un futur rafraîchissement éditorial transversal.
