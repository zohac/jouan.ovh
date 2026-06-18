# Story 9.2: Motion réduit, contraste et clavier

Status: ready-for-dev

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

- [ ] Tâche 1 — Auditer et garantir `prefers-reduced-motion` (AC: #1)
  - [ ] Recenser toutes les animations/transitions du site : entrées `fade-rise` (Epic 2 + pages Epics 3–7), transitions d'état hover/press, `caret-blink` du terminal (Epic 8).
  - [ ] Ajouter/vérifier une règle globale `@media (prefers-reduced-motion: reduce)` qui désactive (ou réduit à l'instantané) les animations et transitions non essentielles.
  - [ ] **Exception explicite** : le caret clignotant du terminal **reste** la seule boucle autorisée — confirmer qu'il n'est pas désactivé par mégarde (ou qu'il reste lisible si réduit).
  - [ ] Confirmer qu'aucune autre animation ne boucle par défaut (pas de spinner/bounce/pulse résiduel).
  - [ ] Vérifier que les transitions d'état (hover/press) tombent en réduit sans casser la lisibilité des états (les changements de couleur restent, l'animation disparaît).
- [ ] Tâche 2 — Auditer le contraste texte/fond (AC: #2)
  - [ ] Vérifier les paires texte/fond clés sur surfaces sombres : `--text-strong`/`--text-body`/`--text-muted` sur `--bg-page`/`--bg-card`/`--bg-elevated`/`--bg-input`.
  - [ ] Vérifier le texte sur l'orange accent (`--accent-text` sur `--accent`) et le texte sur les fonds atmosphériques (gradient héritage, fond AI-art sous `--overlay`).
  - [ ] Vérifier la lisibilité de la palette terminal/syntaxe (prompt vert, liens bleus) sur `--bg-terminal`.
  - [ ] Signaler toute paire en-dessous d'un contraste lisible ; corriger en remontant d'un palier de token (`--text-muted` → `--text-body`, etc.) — **sans hardcoder** de nouvelle couleur.
- [ ] Tâche 3 — Auditer la navigation clavier complète (AC: #2)
  - [ ] Parcourir chaque page au clavier seul : `/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`.
  - [ ] Confirmer que tous les contrôles sont atteignables et actionnables (Tab/Shift+Tab/Enter/Espace ; Échap pour fermer le terminal/les overlays).
  - [ ] Vérifier l'ordre de tabulation logique, l'absence de piège de focus, et que le focus revient à un endroit sensé à la fermeture du terminal/d'un overlay.
  - [ ] Vérifier le formulaire de contact (Epic 7) entièrement utilisable au clavier (saisie, validation front, soumission/feedback).
  - [ ] Vérifier l'ouverture/saisie/fermeture du terminal easter-egg (Epic 8) au clavier sans casser les commandes existantes.
- [ ] Tâche 4 — Validation finale (AC: #1, #2)
  - [ ] `yarn lint` (eslint + stylelint) vert ; aucune valeur hardcodée réintroduite.
  - [ ] `yarn generate` vert (compatibilité prerender préservée).
  - [ ] Check manuel motion réduit (OS/navigateur en `reduce`) + contraste + parcours clavier consignés.

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

### Debug Log References

### Completion Notes List

### File List
