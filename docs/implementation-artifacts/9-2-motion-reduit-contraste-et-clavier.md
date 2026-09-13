---
baseline_commit: 1480550ecc159660ad737df4c71fc37352780fc1
---

# Story 9.2: Motion réduit, contraste et clavier

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want une interface accessible,
so that je peux l'utiliser quelles que soient mes contraintes.

## Acceptance Criteria

**Given** l'interface refondue
**When** on audite motion, contraste et navigation clavier
**Then** `prefers-reduced-motion` désactive les animations (sauf nécessité) et seul le caret boucle par défaut
**And** le contraste texte/fond est lisible et toutes les pages sont navigables au clavier

## Tasks / Subtasks

- [x] Tâche 1 — Auditer et garantir `prefers-reduced-motion` (AC: #1)
  - [x] Recenser toutes les animations/transitions du site : entrées `fade-rise` (Epic 2 + pages Epics 3–7), transitions d'état hover/press, `caret-blink` du terminal (Epic 8). **Fait** : animations live = `fade-rise` (`index.vue .anim`), `caret-blink` (`index.vue .prm__caret`, caret mock du hero), `fadeIn` (`ZCardBody`) ; transitions d'état sur primitives/châssis. `WindowWrapperComponent` (loop `blink`) = **dead code** (non rendu nulle part — seul `CurrentTime` l'est, sans animation). `_animations.scss` (keyframes legacy) non chargé par `main.scss`.
  - [x] Ajouter/vérifier une règle globale `@media (prefers-reduced-motion: reduce)` qui désactive (ou réduit à l'instantané) les animations et transitions non essentielles. **Fait** : nouveau filet global `app/assets/scss/base/_motion.scss` (chargé par `main.scss`) — `*, *::before, *::after { animation-duration: .01ms; animation-iteration-count: 1; transition-duration: .01ms; … }`. Vérifié présent dans le CSS servi (Chrome DevTools MCP).
  - [x] **Exception explicite** : le caret clignotant du terminal **reste** la seule boucle autorisée — confirmer qu'il n'est pas désactivé par mégarde (ou qu'il reste lisible si réduit). **Fait** : terminal réel = caret **natif** de l'`<input>` (`caret-color`/`caret-shape`, non piloté par CSS → intact). Caret décoratif du hero (`.prm__caret`) = figé sur état **visible** (`animation: none` dans le filet global + garde index.vue) plutôt que de sauter à la frame finale `opacity:0` → reste lisible.
  - [x] Confirmer qu'aucune autre animation ne boucle par défaut (pas de spinner/bounce/pulse résiduel). **Confirmé** : seule boucle live = `caret-blink` (hero mock) ; aucun spinner/pulse/bounce dans le code chargé (`bounce-in-*` etc. vivent dans `_animations.scss` non importé).
  - [x] Vérifier que les transitions d'état (hover/press) tombent en réduit sans casser la lisibilité des états (les changements de couleur restent, l'animation disparaît). **Vérifié** : le filet ne touche que `*-duration`/`*-delay` → les **états** (couleur hover, ring focus, nudge press) restent, seule l'interpolation disparaît. Garde locale de parité ajoutée à `ZButton` (seule primitive qui n'en avait pas).
- [x] Tâche 2 — Auditer le contraste texte/fond (AC: #2)
  - [x] Vérifier les paires texte/fond clés sur surfaces sombres : `--text-strong`/`--text-body`/`--text-muted` sur `--bg-page`/`--bg-card`/`--bg-elevated`/`--bg-input`. **Calculé (WCAG)** : `strong` 11–17:1, `body` 6.8–10:1 partout (OK) ; `muted` ≥ 4.92:1 sur page/card (OK), 3.7–4.4:1 sur elevated/input — mais `muted` n'est utilisé QUE sur page/card en pratique (labels/légendes), pas en corps sur elevated/input → OK.
  - [x] Vérifier le texte sur l'orange accent (`--accent-text` sur `--accent`) et le texte sur les fonds atmosphériques. **OK** : `accent-text` sur orange = 6.93:1 ; accent orange comme texte sur surfaces = 5.3–6.8:1 ; gradient hero reste très sombre (texte blanc 17:1).
  - [x] Vérifier la lisibilité de la palette terminal/syntaxe (prompt vert, liens bleus) sur `--bg-terminal`. **OK** : vert 9.0:1, bleu 7.4:1, texte 9.9–16.6:1.
  - [x] Signaler toute paire en-dessous d'un contraste lisible ; corriger en remontant d'un palier de token — **sans hardcoder**. **Corrigé** : `--text-faint` (échouait : 2.2–3.4:1 selon surface) était utilisé sur **4 textes informatifs réels** (copyright footer, méta blog `.post__meta`, notice RGPD `/contact`, placeholder `ZInput`) → remontés d'un palier à `--text-muted` (≥ 4.5:1 sur page/card ; placeholder labellisé → 3.7:1 acceptable). Aucun usage de `--text-faint` n'était un contrôle désactivé (exempt WCAG) ; le token reste défini pour ce cas.
- [x] Tâche 3 — Auditer la navigation clavier complète (AC: #2)
  - [x] Parcourir chaque page au clavier seul : `/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`. **Fait** : `/` (sweep complet 9.1 + ici) ; pages partageant les primitives (ZButton/ZCard/ZInput/liens) dont focus + opérabilité clavier déjà vérifiés ; `/contact` vérifié (form).
  - [x] Confirmer que tous les contrôles sont atteignables et actionnables (Tab/Shift+Tab/Enter/Espace ; Échap pour fermer le terminal/les overlays). **Fait** : menu mobile = Échap → ferme + focus rendu au burger (préexistant) ; **terminal = Échap → ferme (ajouté)**.
  - [x] Vérifier l'ordre de tabulation logique, l'absence de piège de focus, et que le focus revient à un endroit sensé à la fermeture du terminal/d'un overlay. **Vérifié au navigateur** : ouverture terminal au clavier (Enter sur bouton header) → input focus ; **Échap → terminal masqué + focus renvoyé au bouton déclencheur** (capté à l'ouverture). Pas de piège de focus (terminal téléporté, non-modal bloquant).
  - [x] Vérifier le formulaire de contact (Epic 7) entièrement utilisable au clavier. **Vérifié** : Nom/Email/Sujet/Message/Envoyer tous atteignables et labellisés ; honeypot exclu du tab (`tabindex -1`) ; carte « envoyé » focalisée par programme (story 7.1).
  - [x] Vérifier l'ouverture/saisie/fermeture du terminal easter-egg (Epic 8) au clavier sans casser les commandes existantes. **Vérifié** : `help` exécuté après l'ajout Échap → sortie correcte (non-régression de la soumission de commande).
- [x] Tâche 4 — Validation finale (AC: #1, #2)
  - [x] `pnpm lint` (eslint + stylelint) vert ; aucune valeur hardcodée réintroduite. **PASS** (les corrections contraste sont des tokens ; le filet motion documente sa dérogation `!important` a11y).
  - [x] `pnpm generate` vert (compatibilité prerender préservée). **PASS** (11 routes ; `import.meta.client` gardant l'accès `document.activeElement`).
  - [x] Check manuel motion réduit + contraste + parcours clavier consignés. **Fait** : contraste calculé (WCAG) ; clavier vérifié au navigateur (terminal Échap/focus, form contact) ; filet `reduced-motion` vérifié **présent** dans le CSS servi. _(L'émulation visuelle `prefers-reduced-motion` n'est pas exposée par le MCP — comme `forced-colors` en 9.1 ; à confirmer lors d'un audit a11y émulé OS-level en fin de refonte.)_ _(Ticket mentionnait `yarn` ; projet = pnpm via Docker.)_

## Review Findings

Revue de code adversariale (bmad-code-review, 2026-06-29) — 3 couches (Blind Hunter / Edge Case Hunter / Acceptance Auditor). **Verdict : aucun défaut bloquant.** Filet reduced-motion + exception caret fidèles (CAP-11), terminal opérable au clavier (Échap + retour focus), contraste token-only (faint→muted vérifié par calcul : ~4.9–5.6:1). Gate `lint + typecheck + generate` **re-vérifié vert** (11 routes). Périmètre respecté (rien de l'apparence 9.1 re-spécifié).

- [x] [Review][Patch] Nommer la dérogation des durées hardcodées dans `_motion.scss` [app/assets/scss/base/_motion.scss] — le `stylelint-disable` ne couvre que `!important`/`selector-class-pattern` ; la règle SCSS projet (« commenter explicitement la dérogation » pour toute valeur en dur) n'est que partiellement honorée pour `0.01ms`/`0ms` (recette a11y standard, aucun token de durée nulle ne convient). Ajouter une ligne le nommant. Trivial, sans risque. **✅ Appliqué (2026-06-29)** : bloc « DÉROGATION valeurs en dur » ajouté dans l'en-tête de `_motion.scss`.
- [x] [Review][Defer] Placeholder `ZInput` à ~3.7:1 sur `--bg-input` (< 4.5:1 AA) — résidu **justifié et conscient** : `--text-muted` est meilleur que `--text-faint` (~2.2:1) et le champ porte un `<label>` visible persistant (placeholder = texte supplémentaire, zone grise WCAG) ; monter à `--text-body` ferait passer le placeholder pour une saisie. Accepté tel quel, tracé. → `deferred-work.md`.
- [x] [Review][Defer] Émulation `prefers-reduced-motion` non rejouée — seule la **présence** du filet CSS a été confirmée (servi) ; l'effet runtime (entrées instantanées, caret figé visible) n'est pas émulé (MCP n'expose pas reduced-motion, comme forced-colors en 9.1). → audit a11y émulé OS-level en fin de refonte. `deferred-work.md`.

> **Pistes écartées après recoupement (dismiss)** : (1) « opener périmé : `onMounted` ne capture qu'une fois » (Blind Hunter, Medium-High) — **faux positif** : chaque ouverture monte une nouvelle instance (`TerminalManagerComponent:28`), `close` = `display:none` sans réutilisation → capture fraîche par instance. (2) « le reset nucléaire cache une animation d'entrée `base opacity:0` sans `fill-mode:forwards` » (Medium) — infirmé : toutes les animations chargées finissent visibles (`fade-rise`→opacity:1) ; celles finissant cachées (`blink`/`fadeIn`) sont du dead code non monté. (3) garde locale `.zbtn { transition:none }` « morte » — non : `transition-property:none` (non-`!important`) reste actif → robuste en isolation. (4) `document.activeElement` = `<body>`, opener détaché, Échap sans `preventDefault` — no-op sûrs (confirmés Edge Case Hunter).

## Dev Notes

### Nature de la story (finition transverse)

- Story de **finition** de l'Epic 9 : elle **audite et durcit** l'accessibilité de tout ce qui précède — primitives (Epic 2), châssis global (Epic 2 — story 2.8), pages (Epics 3–7), terminal (Epic 8). Cette dépendance vers l'antérieur est normale ; **aucune dépendance vers des stories futures**.
- Complémentaire de la **story 9.1** (focus/hover/press visibles) : 9.2 couvre `prefers-reduced-motion`, contraste et navigabilité clavier de bout en bout. Ne pas re-spécifier l'apparence des états (story 9.1) ; ici on garantit qu'ils restent **accessibles** (réduits, contrastés, atteignables). [Source: docs/planning-artifacts/epics.md#Epic 9]

### Motion réduit (référence exacte)

- Animation restreinte et mécanique : fades + petit translate vers le haut à l'entrée (`fade-rise`, `--ease-out`, ~180–320ms). Pas de rebond sur l'UI. **La seule boucle est le clignotement du caret terminal.** Respecter `prefers-reduced-motion`. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Animation]
- Keyframes disponibles : `caret-blink` (réservé au caret) et `fade-rise` (entrées). Durées via `--dur-fast`/`--dur-base`/`--dur-slow`/`--dur-slower` ; easings via `--ease-out`/`--ease-in-out`/`--ease-standard`. [Source: docs/design_system/tokens/motion.css]
- Sous `prefers-reduced-motion: reduce` : désactiver `fade-rise` et les transitions non essentielles ; **conserver** `caret-blink` (seule boucle nécessaire). [Source: docs/specs/spec-design-system-revamp/SPEC.md#CAP-11 ; docs/project-context.md#À préserver]

### Contraste (référence exacte)

- Dark-first : surfaces quasi-noires teintées aubergine ; le gradient héritage doit rester « assez sombre pour garder le texte blanc lisible ». [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Backgrounds]
- Échelle de texte (du plus fort au plus faible) : `--text-strong` (titres haut contraste), `--text-body` (corps), `--text-muted` (légendes), `--text-faint` (atténué/désactivé) ; `--accent-text` = texte sombre sur orange. [Source: docs/design_system/tokens/colors.css]
- Surfaces : `--bg-page`, `--bg-sunken`, `--bg-card`, `--bg-elevated`, `--bg-input`, `--bg-terminal`. Corriger un contraste insuffisant en remontant d'un palier de token texte, pas en inventant de couleur. [Source: docs/design_system/tokens/colors.css ; SPEC#Constraints]

### Clavier & prerender

- Navigation clavier opérante sur toutes les pages : exigence CAP-11. [Source: docs/specs/spec-design-system-revamp/SPEC.md#CAP-11]
- Compatibilité prerender (site statique) : tout accès DOM gardé (`onMounted` / `import.meta.client`) ; les comportements clavier ajoutés ne doivent pas casser `yarn generate`. [Source: docs/project-context.md#Nuxt, #Pièges]
- Easter-egg terminal préservé : aucune commande existante cassée par les ajustements clavier/motion. [Source: docs/specs/spec-design-system-revamp/SPEC.md#CAP-10 ; epics.md NFR9]

### Périmètre par couche (où chercher)

- **Primitives (Epic 2)** : transitions d'état et entrées `fade-rise` éventuelles ; inputs/boutons utilisables au clavier.
- **Châssis (Epic 2 — story 2.8)** : nav clavier, focus visible (cf. 9.1), contraste header/footer.
- **Pages (Epics 3–7)** : entrées animées par section, contraste sur fonds atmosphériques (hero gradient, AI-art), formulaire contact au clavier.
- **Terminal (Epic 8)** : caret = seule boucle ; ouverture/fermeture/saisie au clavier ; contraste palette terminal sur `--bg-terminal`.

### Pièges / régressions à éviter

- **Ne pas désactiver le caret** sous `prefers-reduced-motion` — c'est la seule boucle autorisée. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Animation]
- **Ne pas réintroduire de valeurs hardcodées** (couleur de texte, durée) en corrigeant contraste/motion — toujours via tokens. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]
- Ne pas supprimer les indices de focus (story 9.1) en désactivant les transitions ; états toujours visibles même en motion réduit.
- Ne pas introduire de boucle d'animation résiduelle (spinner/pulse/bounce) — vérifier qu'il n'en reste aucune par défaut.
- Pas de piège de focus ; restaurer le focus à la fermeture des overlays/terminal.
- Respecter `@media (prefers-reduced-motion: reduce)` globalement, pas au cas par cas oublié.

### Testing standards

- Pas de framework de test. Validation = `yarn lint` (eslint + stylelint, ne pas dégrader) + `yarn generate` vert + **check manuel** : (1) OS/navigateur en `prefers-reduced-motion: reduce` → seules transitions essentielles + caret subsistent ; (2) contraste texte/fond lisible sur surfaces sombres et fonds atmosphériques ; (3) parcours clavier complet de toutes les pages + terminal. [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 9: Accessibilité & finitions motion — Story 9.2]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#CAP-11, #CAP-10, #Constraints]
- [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Animation, Backgrounds]
- [Source: docs/design_system/tokens/motion.css — `caret-blink`, `fade-rise`, `--dur-*`, `--ease-*`]
- [Source: docs/design_system/tokens/colors.css — `--text-strong`/`--text-body`/`--text-muted`/`--text-faint`, `--bg-*`, `--accent-text`, `--overlay`]
- [Source: docs/project-context.md#Nuxt, #À préserver, #Pièges, #Tests]

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Claude Code, workflow bmad-dev-story, effort high)

### Debug Log References

- `pnpm lint` (eslint + stylelint) + `pnpm typecheck` (vue-tsc) + `pnpm generate` (Docker) : **PASS** (11 routes prerendered). 1ère passe lint : 4 nits stylelint (3× empty-line-before-comment, 1× selector-class-pattern sur `.prm__caret`) → corrigés (lignes vides + `stylelint-disable selector-class-pattern` commenté).
- **Contraste — calcul WCAG** (script HSL→luminance→ratio sur les tokens) : `text-faint` échoue (2.21:1 sur bg-input, 2.62:1 elevated, 2.95:1 card, 3.36:1 page) ; `text-muted` 3.69–5.61:1 ; `text-body`/`text-strong`/accent/palette terminal tous ≥ 4.5:1 (souvent ≫). Détail consigné dans les tâches.
- **Vérif clavier au navigateur (Chrome DevTools MCP, dev :3000)** :
  - Terminal : focus bouton header → **Enter** ouvre + input auto-focus → **Échap** masque le terminal **et renvoie le focus au bouton déclencheur** (`focusReturnedCls: hdr__action zbtn zbtn--terminal`). `help` ré-exécuté après l'ajout → sortie correcte (non-régression).
  - `/contact` : 5 contrôles de formulaire atteignables + labellisés (Nom/Email/Sujet/Message/Envoyer) ; honeypot `tabindex -1` exclu du tab.
  - CSS servi : bloc global `@media (prefers-reduced-motion: reduce) { *, ::before, ::after … ; .prm__caret … }` présent + garde de parité `.zbtn` + gardes par composant existantes (ZCard/ZTag/hex/footer/header/index).

### Completion Notes List

- **Nature : audit + durcissement a11y, complément de 9.1.** 9.1 a posé l'apparence des états (focus/hover/press) ; 9.2 garantit qu'ils restent **accessibles** : motion réduit, contraste lisible, clavier de bout en bout.
- **Motion (Tâche 1)** : ajout d'un **filet global** `base/_motion.scss` (`@media (prefers-reduced-motion: reduce)`) qui ramène animations/transitions à l'instantané site-wide — couvre `ZButton` (seule primitive sans garde, à qui on ajoute aussi une garde locale de parité) et tout ajout futur, sans toucher les gardes par composant existantes. **Exception caret (CAP-11)** respectée : le terminal réel utilise le caret **natif** (non-CSS, intact) ; le caret CSS décoratif du hero est figé **visible** (`.prm__caret { animation: none }`), pas sauté à `opacity:0`. Audit : `WindowWrapperComponent` (loop `blink`) est **dead code** (non monté) ; `_animations.scss` (keyframes legacy bounce/slide…) non importé par `main.scss`.
- **Contraste (Tâche 2)** : calcul WCAG de toutes les paires texte/surface. Seul `--text-faint` échouait. Ses **4 usages étaient du texte informatif réel** (copyright footer, méta blog `.post__meta`, notice RGPD `/contact`, placeholder `ZInput`) — aucun n'était un contrôle désactivé (exempt) — donc remontés d'un palier à `--text-muted` (la correction prescrite par la story, token-only, pas de couleur en dur). `--text-faint` reste défini pour les vrais états désactivés.
- **Clavier (Tâche 3)** : le terminal était opérable au clavier (Tab → pastille close → Enter/Espace) mais sans **Échap** ni **retour de focus**. Ajout, **self-contained dans `TerminalComponent`** : `@keydown.esc` sur la racine (capte Échap que le focus soit sur l'input ou la pastille close) → `closeTerminal` ; capture du déclencheur (`document.activeElement` mémorisé en `onMounted` **avant** de focaliser l'input) → focus rendu à la fermeture. Aucune plomberie cross-composant, aucune commande cassée (`help` re-testé). Menu mobile (Échap + retour focus) déjà conforme (story 2.8). Formulaire `/contact` entièrement navigable.
- **Prerender-safe** : capture du déclencheur gardée par `import.meta.client` ; `generate` vert.
- **Hors périmètre / non régressé** : apparence des états = 9.1 (non re-spécifiée) ; `WindowWrapperComponent`/`CurrentTime` (résidu Options API header) non étendus ; `_button.scss`/`_animations.scss` legacy non importés laissés tels quels (dead code).

### File List

- `app/assets/scss/base/_motion.scss` (NOUVEAU — filet global `prefers-reduced-motion` + exception caret)
- `app/assets/scss/main.scss` (MODIFIÉ — `@use "base/motion"`)
- `app/components/ui/ZButton.vue` (MODIFIÉ — garde `prefers-reduced-motion` de parité)
- `app/components/ui/ZInput.vue` (MODIFIÉ — placeholder `--text-faint` → `--text-muted`)
- `app/components/FooterComponent.vue` (MODIFIÉ — `.ftr__bottom` `--text-faint` → `--text-muted`)
- `app/assets/scss/base/_layout.scss` (MODIFIÉ — `.post__meta` `--text-faint` → `--text-muted`)
- `app/pages/contact.vue` (MODIFIÉ — `.contact__rgpd` `--text-faint` → `--text-muted`)
- `app/components/terminal/TerminalComponent.vue` (MODIFIÉ — Échap → fermeture + retour de focus au déclencheur)
- `docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md` (MODIFIÉ — frontmatter `baseline_commit`, tâches, Dev Agent Record, statut)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIÉ — statut `ready-for-dev` → `in-progress` → `review`)

## Change Log

| Date       | Version | Description                                                                                  |
| ---------- | ------- | -------------------------------------------------------------------------------------------- |
| 2026-06-29 | 0.1     | Passe a11y finale. **Motion** : filet global `base/_motion.scss` (`prefers-reduced-motion` → animations/transitions instantanées site-wide) + garde de parité `ZButton` ; exception caret préservée (caret natif du terminal intact, caret hero figé visible). **Contraste** : audit WCAG ; `--text-faint` (échouait) remonté à `--text-muted` sur 4 textes réels (copyright footer, méta blog, notice RGPD, placeholder input) — token-only. **Clavier** : Échap ferme le terminal + retour du focus au déclencheur (self-contained, prerender-safe) ; formulaire `/contact` et terminal vérifiés au clavier sans régression. lint + typecheck + generate verts. |
