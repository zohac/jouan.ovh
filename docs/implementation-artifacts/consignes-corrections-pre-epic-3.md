# Consignes dev — Dernières corrections avant l'Epic 3

> Issu de la rétro Epic 2 (`epic-2-retro-2026-06-22.md`). Objectif : partir propre
> pour l'Epic 3. Deux consignes indépendantes, à exécuter via Docker, sur la branche
> `feat/design-system-revamp`, en **deux commits séparés**.
>
> Rappels de process : rappeler le périmètre dans la consigne d'agent ; cocher la
> checklist pré-revue (tokens-only + a11y) avant de passer en review.

## Diagnostic (état au 2026-06-22)

- `pnpm lint` : **0 erreur, 44 warnings** Stylelint legacy (la rétro disait 43 ; +1 venu de `HexagonLinkComponent.vue`).
- Tous les partials SCSS fautifs sont **encore importés** (`_animations` par `card/ZCardBody.vue`, `_button` par `pages/index.vue`, `_mixin` via `_typography.scss`) → on **corrige**, on ne supprime pas.
- Les 2 `clip` de `_reset.scss` ont **déjà** leur `clip-path` équivalent juste en dessous → suppression sans risque a11y.
- `vue-property-decorator` : **0 usage** réel, mais `experimentalDecorators: true` traîne dans `tsconfig.json`.

Répartition des 44 warnings :

| Fichier | Nb | Règles |
|---|---|---|
| `app/assets/scss/abstract/_animations.scss` | 32 | `declaration-block-no-duplicate-properties` (transform / animation-timing-function dans keyframes) |
| `app/assets/scss/base/_reset.scss` | 6 | `font-family-no-duplicate-names` (×2), `declaration-property-value-keyword-no-deprecated` appearance:button (×2), `property-no-deprecated` clip (×2) |
| `app/assets/scss/components/_button.scss` | 2 | `declaration-block-no-duplicate-properties` user-select |
| `app/assets/scss/abstract/_mixin.scss` | 3 | `scss/no-global-function-names` (red/green/blue) |
| `app/components/HexagonLinkComponent.vue` | 1 | `property-no-deprecated` clip |

---

## Consigne A — Solder les 44 warnings Stylelint legacy

**Objectif.** `pnpm lint` à **0 erreur / 0 warning**. Aucune régression visuelle ni d'accessibilité. Nettoyage **iso-comportement**, pas une refonte.

**Périmètre — STRICTEMENT ces 5 fichiers, uniquement pour éteindre les warnings listés ci-dessus.**

**Hors périmètre (ne PAS faire) :** supprimer/restructurer des partials SCSS, migrer le legacy vers les tokens DS, toucher à `_root.scss` ou à un token, modifier le rendu visuel d'une animation, refondre un composant.

**Gestes précis par fichier :**

1. **`_mixin.scss`** (`scss/no-global-function-names`, lignes 2-4) — manuel.
   Le mixin `background-opacity` utilise `rgba(red($c), green($c), blue($c), $o)`. Le remplacer par l'équivalent moderne **`rgba($color, $opacity)`** (Sass accepte directement couleur + alpha) — plus simple, supprime les 3 fonctions globales. *(Fallback explicite : `@use "sass:color"` + `color.channel($c, "red", $space: rgb)`.)* Vérifier que `_typography.scss` (`@include mixin.font-style-normal`) compile toujours.

2. **`_reset.scss`** (6) :
   - `font-family-no-duplicate-names` (94, 133) → retirer le `monospace` dupliqué dans la stack. `--fix` gère.
   - `appearance: button` déprécié (217, 316) → `appearance: auto`. `--fix` gère.
   - `clip` déprécié (564, 579) → **supprimer la déclaration `clip: …`** dans `.screen-reader-text` et `.screen-reader-text:focus`. Le `clip-path: inset(50%)` / `clip-path: none` équivalent est **déjà présent** juste en dessous. ⚠️ **a11y : vérifier après coup que `.screen-reader-text` reste masqué visuellement mais lisible par lecteur d'écran** (masquage désormais porté par `clip-path` seul).

3. **`_button.scss`** (`declaration-block-no-duplicate-properties`, 97-98) → `user-select` dupliqué : `--fix` gère (dernière valeur gagne, comportement préservé).

4. **`_animations.scss`** (32, `declaration-block-no-duplicate-properties`) → `transform` / `animation-timing-function` dupliqués dans les keyframes. **Lancer `--fix` sur ce fichier puis relire le diff** (règle « dernière valeur gagne » → iso-comportement). ⚠️ Observation à signaler : `@keyframes bounce-in-fwd` est **défini deux fois** (lignes 195 et 255) — la 2ᵉ écrase la 1ʳᵉ. Confirmer laquelle `ZCardBody` consomme avant tout `--fix` agressif.

5. **`HexagonLinkComponent.vue`** (`clip` déprécié, 55) → convertir en `clip-path` (ou supprimer si un `clip-path` équivalent existe déjà). Style scoped — vérifier le rendu de l'hexagone après coup.

**Méthode suggérée :**
```sh
docker compose run --rm web sh -c "corepack enable && pnpm lint:style -- --fix"
```
absorbe les ~39 fixables, puis traiter manuellement le reliquat (`_mixin`, les `clip`), puis relire le diff intégral.

**Validation (via Docker, obligatoire) :**
- `pnpm lint` → **0 erreur, 0 warning**
- `pnpm typecheck` → vert
- `pnpm generate` → vert (24 routes)

**Checklist pré-revue :**
- [ ] lint 0/0, typecheck + generate verts
- [ ] `.screen-reader-text` : masquage visuel + accessibilité lecteur d'écran préservés
- [ ] aucune animation modifiée visuellement (diff `_animations.scss` relu, iso-comportement)
- [ ] aucun token DS / `_root.scss` touché ; aucun composant refondu
- [ ] `_typography.scss` compile toujours (mixin modifié)

**Commit suggéré :** `style(ds): solder les warnings Stylelint legacy`

---

## Consigne B — Retirer `vue-property-decorator` + `experimentalDecorators`

**Objectif.** Supprimer un reliquat legacy inutilisé (dette Epic 1, action 4) avant l'Epic 3.

**Préalable (garde) — à re-confirmer :** `grep -rn "vue-property-decorator\|@Component\|@Prop\|@Watch\|@Emit" app` → **0 résultat**. Si un seul usage apparaît, **arrêter** et le signaler (ne pas migrer dans cette consigne).

**Périmètre — STRICTEMENT :**
- retirer `vue-property-decorator` de `package.json` via
  `docker compose run --rm web sh -c "corepack enable && pnpm remove vue-property-decorator"` (met à jour `pnpm-lock.yaml`)
- retirer la ligne `"experimentalDecorators": true` de `tsconfig.json`

**Hors périmètre :** ne PAS toucher au sous-système `app/components/terminal/` (les classes TS qui implémentent `IProgram` **ne sont pas** des décorateurs `vue-property-decorator`) ; ne retirer aucune autre option de `tsconfig.json`.

**Validation (via Docker) :** `pnpm typecheck` vert, `pnpm generate` vert (24 routes), `pnpm lint` vert.

**Commit suggéré :** `chore: retirer vue-property-decorator inutilisé`

---

**Enchaînement recommandé :** A puis B, deux commits séparés. Après ça, l'arbre est propre pour l'Epic 3.
