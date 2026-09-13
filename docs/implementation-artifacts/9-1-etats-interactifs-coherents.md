---
baseline_commit: b46136840da7a7eecaa18fa694965dd42d33acd4
---

# Story 9.1: États interactifs cohérents

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want des états visuels clairs sur les éléments interactifs,
so that je sais ce qui est cliquable et focalisé.

## Acceptance Criteria

**Given** les primitives et la navigation
**When** on vérifie les états focus/hover/press
**Then** chaque élément interactif a des états visibles conformes au DS
**And** le focus clavier est toujours visible

## Tasks / Subtasks

- [x] Tâche 1 — Recenser tous les éléments interactifs du site (AC: #1)
  - [x] Lister les primitives interactives (Epic 2) : `ZButton`, `ZInput`, `ZCard` (si cliquable), `ZTag`/`ZBadge` (si liens), avatars cliquables, icônes-actions.
  - [x] Lister les éléments du châssis global (Epic 2 — story 2.8) : liens de nav du header, logo diamant, liens du footer, hexagones sociaux.
  - [x] Lister les éléments propres aux pages (Epics 3–7) : CTA hero, liens « aperçu services », cartes de projets, cartes d'offre `/services`, liens timeline/stack `/about`, cartes d'articles + liens `/blog`, champs + bouton + CTA terminal + socials `/contact`.
  - [x] Lister les éléments du terminal (Epic 8) : zone de saisie, liens cliquables dans les sorties, bouton/contrôle d'ouverture-fermeture, poignée draggable.
- [x] Tâche 2 — Vérifier et harmoniser l'état hover (AC: #1)
  - [x] Surfaces (cartes, panneaux) : éclaircissement d'un cran (`--surface-2` → `--surface-3` via `--bg-elevated`) et/ou passage de la bordure à `var(--border-strong)`. **Conforme** (`ZCard--interactive` : `--border-strong` + lift ; `ZButton--secondary` : `--surface-2` → `--surface-3`). Aucun changement requis.
  - [x] Boutons primaires : l'orange s'éclaircit (`var(--accent)` → `var(--accent-hover)`). **Conforme** (`ZButton--primary:hover`). Aucun changement requis.
  - [x] Liens : soulignement / bleu plus clair (`var(--link)`). **Conforme** (liens nav/footer → `--text-strong`/`--accent` ; liens prose/email → soulignement + `--term-blue`). Aucun changement requis.
  - [x] Confirmer que toute transition hover passe par les tokens motion (`--dur-fast`/`--dur-base`, `--ease-out`) — pas de durée/easing en dur. **Vérifié** : toutes les transitions live consomment les tokens motion ; seul résidu de durée en dur = `_button.scss` (legacy **non importé** par `main.scss`, dead code) + `WindowWrapperComponent`/`CurrentTime` (résidu Options API header, hors périmètre) + delays d'entrée intentionnels (motion = 9.2).
- [x] Tâche 3 — Vérifier et harmoniser l'état press/active (AC: #1)
  - [x] Boutons : couleur active (`var(--accent-active)`) + léger nudge de ~1px vers le bas ; **pas** de scale-shrink, pas de rebond. **Conforme** (`ZButton--primary:active` : `--accent-active` + `translateY(1px)` ; secondary/danger : `translateY(1px)`). Aucun changement requis.
  - [x] Éléments cliquables non-bouton : feedback press cohérent et discret. **Conforme** : liens = feedback hover (couleur/soulignement) ; cartes-liens = lift hover ; pas de press inventé (le DS ne spécifie pas de nudge sur les liens texte).
- [x] Tâche 4 — Vérifier et garantir l'état focus clavier visible (AC: #2)
  - [x] Chaque élément focalisable expose un anneau de focus visible (`:focus-visible`) utilisant `var(--accent-ring)` (ou `--border-strong` selon la primitive), jamais `outline: none` sans remplacement visible. **Corrigé** : repli `forced-colors` (deferred-work #1) ajouté au niveau des primitives DS (`ZButton`, `ZCard`, `ZTag` ×2, `ZInput`) — `outline: none` → `outline: 2px solid transparent; outline-offset: 2px;` (rendu en couleur système sous contraste forcé, le ring `box-shadow` reste le focus normal). **Lacune comblée** : les liens du châssis (logo header/footer, liens de nav header + menu mobile, liens footer) n'avaient que l'outline UA par défaut → anneau DS `--ring-accent` + repli `forced-colors` ajoutés.
  - [x] Le focus reste visible sur fonds sombres et sur les surfaces atmosphériques (gradient héritage, fond AI-art sous overlay) — contraste suffisant de l'anneau. **Vérifié** au navigateur (ring orange visible sur header vitré + hero dégradé).
  - [x] Les inputs renforcent leur bordure au focus (`--border-default` → `--border-strong`) conformément à `ZInput` (Epic 2 — story 2.6). **Conforme (focus plus fort que demandé)** : `ZInput:focus` pose `border-color: --accent` **+** ring `--accent-ring` (pattern DS README, plus prominent que `--border-strong`) ; `:hover` renforce déjà à `--border-strong`. Non régressé (n'aurait fait qu'affaiblir le focus).
  - [x] L'ordre de tabulation suit l'ordre visuel/logique sur chaque page. **Vérifié** (sweep clavier `/` : logo → nav (5) → Terminal → CTA → contenu).
- [x] Tâche 5 — Vérification manuelle transverse (AC: #1, #2)
  - [x] Parcourir chaque page (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) au clavier (Tab/Shift+Tab/Enter/Espace) et confirmer que focus/hover/press sont visibles partout. **Fait** (Chrome DevTools MCP : sweep `/` + audit CSS compilé des sélecteurs `:focus-visible` du châssis et des primitives ; pages `/about`/`/blog`/`/contact` déjà conformes — repli `forced-colors` posé en 3.2/5.1/6.x/7.x).
  - [x] Vérifier le terminal easter-egg (ouverture, saisie, liens) au clavier sans régression. **Fait** : ouverture par Enter sur le bouton header → terminal monté, input auto-focus (caret = indicateur de focus), bouton close focusable (`tabindex 0`, outline orange forced-colors-safe, Epic 8). Aucun lien `<a>` émis dans les sorties (texte coloré).
  - [x] `pnpm lint` (eslint + stylelint) + `pnpm typecheck` + `pnpm generate` verts (aucune valeur hardcodée réintroduite). **PASS** (Docker, 11 routes prerendered). _(Le ticket mentionnait `yarn` ; le projet est pnpm via Docker.)_

## Review Findings

Revue de code adversariale (bmad-code-review, 2026-06-29) — 3 couches (Blind Hunter / Edge Case Hunter / Acceptance Auditor). **Verdict : zéro défaut de code.** Diff focus-only conforme (hover/press intacts), 5 liens du châssis dotés d'un anneau DS, repli forced-colors centralisé aux primitives, aucun `outline: none` nu, périmètre respecté (rien de 9.2). Gate `lint + typecheck + generate` **re-vérifié vert** par la revue (11 routes prerendered).

- [x] [Review][Defer] Deux idiomes forced-colors coexistent — soldé en suivi — le repli inline `outline: 2px solid transparent` (9.1, primitives + châssis) cohabite avec un bloc page-level `@media (forced-colors: active)` préexistant dans `index.vue` (`.hero-term__open`/`.offer__more`, epic 3). Inoffensif (les deux produisent un focus visible en contraste forcé) ; candidat à unification DS-wide ultérieure. **Non introduit par 9.1** (préexistant). → tracé dans `deferred-work.md`.

> **Pistes écartées après recoupement (dismiss)** : (1) « rayon des anneaux incohérent (nav/menu carrés vs brand/footer arrondis) » (Blind Hunter) — **faux positif** : `.hdr__link`/`.hdr__menu-link` portent déjà `border-radius` dans leur règle de base (`HeaderComponent.vue:256/389`), seuls brand/footer (base sans rayon) l'ajoutent → tous les anneaux arrondis. (2) « clipping de l'anneau par un ancêtre `overflow:hidden` » — infirmé : aucun `overflow:hidden` sur les ancêtres du header/nav/footer. (3) « tokens inexistants (`--ring-accent`/`--radius-sm`/`--radius-xs`) » — infirmé : tous définis (`_root.scss`), `--ring-accent` = la valeur box-shadow correcte (le `--accent-ring` couleur n'est pas utilisé en box-shadow). (4) « littéraux `2px` hardcodés » — dérogation a11y légitime (largeur/offset d'outline, pas de token DS dédié), pattern déjà établi (`contact.vue`/`about.vue`/`index.vue`). (5) « `.hdr__brand`/`.ftr__brand` pas focusables » — infirmé : vrais `<a>`/NuxtLink.

> **Réserve de vérification (non bloquante)** : le rendu de l'anneau sous `forced-colors: active` n'a pas été émulé visuellement (idiome WHCM documenté + déjà livré/éprouvé dans le codebase — `about.vue`/`contact.vue` ; déclarations présentes et résolues confirmées). Vérif clavier AC#2 en mode normal faite au navigateur par le dev (sweep Tab + audit `styleSheets`).

## Dev Notes

### Nature de la story (finition transverse)

- C'est une story de **finition** de l'Epic 9 : elle ne crée pas de nouvelle UI, elle **audite et harmonise** ce qui a été produit en amont — primitives (Epic 2), châssis global (Epic 2 — story 2.8), pages (Epics 3–7) et terminal (Epic 8). Cette dépendance vers tout l'antérieur est normale ; il n'y a **aucune dépendance vers des stories futures**.
- Périmètre : **états interactifs uniquement** (focus / hover / press + visibilité du focus clavier). Le motion réduit, le contraste et la navigabilité clavier complète sont l'objet de la **story 9.2** ; ne pas les traiter ici sauf chevauchement direct (la visibilité du focus est partagée et prioritaire ici). [Source: docs/planning-artifacts/epics.md#Epic 9]

### États conformes au DS (référence exacte)

- **Hover** : éclaircir la surface d'un cran (`--surface-2` → `--surface-3`) et/ou passer la bordure à `--border-strong` ; les boutons primaires éclaircissent l'orange (`--accent` → `--accent-hover`) ; les liens gagnent un soulignement / un bleu plus clair. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Hover states]
- **Press** : se poser sur la couleur active (`--accent-active`) avec un nudge de ~1px vers le bas ; **pas de scale-shrink**. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Press states]
- **Focus** : anneau visible via `--accent-ring` (`hsl(24 94% 53% / 0.45)`) ; `--border-strong` au focus pour bordures/inputs. [Source: docs/design_system/tokens/colors.css — `--accent-ring`, `--border-strong`]
- **Bordures** : hairlines 1px solides — `--border-subtle` pour séparateurs/cartes, `--border-default` pour inputs, `--border-strong` au hover/focus. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Borders]
- **Transitions** : courtes et mécaniques (`--dur-fast` 120ms / `--dur-base` 180ms, `--ease-out`) ; pas de rebond sur l'UI. [Source: docs/design_system/tokens/motion.css]

### Tokens & valeurs (source unique de vérité)

- Consommer exclusivement les tokens CSS (`var(--…)`) / SCSS `@use` ; aucune couleur/durée/rayon en dur. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints — Tokens, pas de valeurs en dur ; #CAP-2]
- Tokens d'états disponibles : `--accent`, `--accent-hover`, `--accent-active`, `--accent-ring`, `--accent-soft`, `--bg-card`, `--bg-elevated`, `--bg-input`, `--border-subtle`, `--border-default`, `--border-strong`, `--link`. [Source: docs/design_system/tokens/colors.css]
- Pattern de theming projet : déclarer des CSS custom properties locales au composant à partir des tokens, puis consommer via `var()`. [Source: docs/project-context.md#SCSS (règle critique)]

### Périmètre par couche (où chercher)

- **Primitives (Epic 2)** : `ZButton` (story 2.3), `ZInput` (story 2.6), `ZCard` (story 2.4), `ZBadge`/`ZTag` (story 2.5), `ZAvatar` (story 2.6) — les états y sont définis à la source ; vérifier qu'ils sont corrects et factorisés, pas redéfinis ad hoc dans les pages.
- **Châssis (Epic 2 — story 2.8)** : header fixe 56px (logo diamant), nav, footer 56px, hexagones sociaux.
- **Pages (Epics 3–7)** : Home (Epic 3), Services (Epic 4), About (Epic 5), Blog (Epic 6), Contact (Epic 7) — vérifier les éléments interactifs spécifiques à chaque page.
- **Terminal (Epic 8)** : `TerminalWindow`/`Prompt` (story 8.1), commandes + draggable (story 8.2).

### Pièges / régressions à éviter

- **Ne pas réintroduire de valeurs hardcodées** (couleur d'anneau, durée, rayon) — toujours via tokens. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]
- **Ne jamais** faire `outline: none` sans fournir un focus visible de remplacement (anneau via `--accent-ring`). Le focus clavier doit **toujours** rester visible (AC #2).
- Respecter les tokens motion : pas de durée/easing inventés pour les transitions d'état. [Source: docs/design_system/tokens/motion.css]
- **Press = nudge ~1px, pas de scale-shrink**, pas de rebond. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Press states]
- Ne pas dupliquer les états dans les pages s'ils appartiennent à une primitive — corriger à la source pour rester cohérent.
- Compatibilité prerender (site statique) : tout accès DOM gardé (`onMounted` / `import.meta.client`). [Source: docs/project-context.md#Nuxt]

### Testing standards

- Pas de framework de test. Validation = `yarn lint` (eslint + stylelint, ne pas dégrader) + `yarn generate` vert + **check manuel** : parcours clavier (Tab/Shift+Tab) de toutes les pages confirmant focus/hover/press visibles partout. [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 9: Accessibilité & finitions motion — Story 9.1]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#CAP-11, #Constraints]
- [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Hover states, Press states, Borders, Animation]
- [Source: docs/design_system/tokens/colors.css — `--accent`, `--accent-hover`, `--accent-active`, `--accent-ring`, `--border-strong`]
- [Source: docs/design_system/tokens/motion.css — `--dur-fast`, `--dur-base`, `--ease-out`]
- [Source: docs/project-context.md#Règles Langage & Framework, #SCSS (règle critique), #Tests]

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Claude Code, workflow bmad-dev-story, effort high)

### Debug Log References

- `pnpm lint` (eslint + stylelint) + `pnpm typecheck` (vue-tsc) + `pnpm generate` (Docker) : **PASS** (11 routes prerendered) après harmonisation.
- **Vérification clavier au navigateur (Chrome DevTools MCP, dev :3000)** : sweep `Tab` sur `/` — chaque focusable rapporté avec son `:focus-visible` calculé. Résultats : `hdr__brand`, `hdr__link` (×5), `ZButton--terminal`/`--primary` → `box-shadow: rgba(248,113,22,.45) 0 0 0 3px` (`--ring-accent`) **+** `outline: 2px solid rgba(0,0,0,0)` (repli forced-colors). Terminal ouvert par Enter → input auto-focus + close `tabindex 0`. Audit du CSS compilé (`document.styleSheets`) : tous les sélecteurs `:focus-visible` du châssis (`hdr__brand/link/menu-link`, `ftr__brand/link`) et des primitives (`zbtn`, `zcard--interactive`, `ztag--clickable`, `ztag__remove`) portent `box-shadow: var(--ring-accent)` + `outline: transparent solid 2px` ; `hex` conserve son `outline: 2px solid var(--accent)` (déjà forced-colors-safe). Capture d'écran : anneau orange net sur le lien « Accueil ».

### Completion Notes List

- **Nature : audit + harmonisation, zéro nouvelle UI.** L'audit a confirmé que **hover** (Tâche 2) et **press** (Tâche 3) étaient déjà cohérents et 100 % token-driven sur les primitives et le châssis — **aucun changement requis** sur ces deux axes. Tout le travail de code porte sur la **visibilité du focus** (Tâche 4, AC #2).
- **Inventaire des éléments interactifs (Tâche 1)** :
  - _Primitives (Epic 2)_ : `ZButton` (hover/active/focus ✅), `ZInput` (hover/focus ✅), `ZCard--interactive` (hover lift/focus ✅), `ZTag--clickable` + `ztag__remove` (hover/focus ✅), `ZBadge`/`ZAvatar`/`ZIcon` = non interactifs (statut/déco).
  - _Châssis (story 2.8)_ : logo header/footer, liens nav header + menu mobile, burger, liens footer (nav/projets), hexagones sociaux.
  - _Pages (Epics 3–7)_ : `/` (`hero-term__open`, `offer__more`, cartes projet `ZCard as="a"`), `/services` (`ZCard`/`ZButton`), `/about` (lien bio), `/blog` (cartes/liens), `/contact` (`ZInput`, CTA terminal, `contact__email`, socials). Tous via primitives ou focusables déjà traités (repli forced-colors posé en 3.2/5.1/6.x/7.x).
  - _Terminal (Epic 8)_ : input (caret = focus), close button (focusable, outline orange), poignée drag ; aucun `<a>` dans les sorties.
- **Correctif central — repli `forced-colors` au niveau des primitives DS (deferred-work item #1, revues 3.2/5.1)** : les rings de focus en `box-shadow: var(--ring-accent)` disparaissent en contraste forcé (Windows High Contrast) → focus invisible. Corrigé **une seule fois à la source** (ZButton, ZCard, ZTag ×2, ZInput) en remplaçant `outline: none` par `outline: 2px solid transparent; outline-offset: 2px;` — invisible en rendu normal (le ring prend le relais), rendu en **couleur système** sous forced-colors. Pattern identique à celui déjà posé localement sur les pages (`contact__email`, lien bio `/about`…), désormais factorisé pour tous les consommateurs des primitives.
- **Lacune de focus comblée — liens du châssis** : `hdr__brand`, `hdr__link`, `hdr__menu-link`, `ftr__brand`, `ftr__link` n'avaient **aucun** `:focus-visible` (ils tombaient sur l'outline UA par défaut, non conforme au DS). Ajout de l'anneau DS `--ring-accent` + repli forced-colors. `hdr__burger` (qui avait déjà le ring) reçoit aussi le repli forced-colors.
- **Hors changement (déjà conformes)** : pages `/`, `/about`, `/blog`, `/contact` et terminal (focus traités en amont) ; `hex` (outline orange déjà forced-colors-safe) ; `ZInput` (focus `--accent` + ring, plus fort que `--border-strong` — non régressé) ; `contact__sent:focus { outline:none }` (région `role=status` focalisée par programme, `tabindex -1`, non tabulable — légitime).
- **Hors périmètre, respecté** : motion réduit / contraste / navigabilité clavier complète = **story 9.2** (non traités ici, sauf visibilité du focus qui est partagée et prioritaire). `_button.scss` (durée `0.15s` en dur) = SCSS legacy **non importé** par `main.scss` (dead code) → non corrigé. `WindowWrapperComponent`/`CurrentTime` (durées en dur) = résidu Options API header, hors « refonte ».

### File List

- `app/components/ui/ZButton.vue` (MODIFIÉ — repli forced-colors sur `:focus-visible`)
- `app/components/ui/ZCard.vue` (MODIFIÉ — repli forced-colors sur `.zcard--interactive:focus-visible`)
- `app/components/ui/ZTag.vue` (MODIFIÉ — repli forced-colors sur `.ztag--clickable` + `.ztag__remove`)
- `app/components/ui/ZInput.vue` (MODIFIÉ — repli forced-colors sur `.zinput,.ztextarea:focus`)
- `app/components/HeaderComponent.vue` (MODIFIÉ — anneau DS sur `hdr__brand`/`hdr__link`/`hdr__menu-link` + repli forced-colors sur `hdr__burger`)
- `app/components/FooterComponent.vue` (MODIFIÉ — anneau DS + repli forced-colors sur `ftr__brand`/`ftr__link`)
- `docs/implementation-artifacts/9-1-etats-interactifs-coherents.md` (MODIFIÉ — frontmatter `baseline_commit`, tâches, Dev Agent Record, statut)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIÉ — statut story `ready-for-dev` → `in-progress` → `review`)
- `docs/implementation-artifacts/deferred-work.md` (MODIFIÉ — item Epic 9 #1 « repli forced-colors DS-wide » soldé)

## Change Log

| Date       | Version | Description                                                                                  |
| ---------- | ------- | -------------------------------------------------------------------------------------------- |
| 2026-06-29 | 0.1     | Audit + harmonisation des états interactifs. Hover/press déjà conformes (token-driven) → aucun changement. Focus (AC #2) : repli `forced-colors` ajouté **une seule fois au niveau des primitives DS** (`ZButton`/`ZCard`/`ZTag`/`ZInput`, deferred-work #1) — `outline:none` → `outline: 2px solid transparent` (couleur système en contraste forcé, ring `box-shadow` conservé) ; anneau de focus DS `--ring-accent` ajouté aux liens du châssis (logo + nav header/menu, liens footer) qui n'avaient que l'outline UA. Vérif clavier au navigateur (ring visible, ordre de tab logique) + lint/typecheck/generate verts. |
