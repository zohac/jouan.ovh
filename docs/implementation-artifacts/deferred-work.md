# Deferred work

_Travaux réels mais reportés, remontés par les revues de code. À reprendre dans la story/epic indiquée._

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
