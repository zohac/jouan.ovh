---
baseline_commit: f077f9b563bcef69bc61b9f28913f6db071e8b36
---

# Story 13.1: Fondations des Tokens SCSS Thème Clair et Sanctuarisation du Terminal

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur préférant un environnement d'affichage clair,
I want que les variables CSS du design system exposent une palette claire « Papier technique / Crème solaire » tout en préservant le terminal sombre,
so that l'application s'adapte sans rupture de style ni dénaturation de l'immersion CLI (FR37, UX-DR32, NFR17, NFR19, CAP-1).

## Acceptance Criteria

1. **Given** le fichier `app/assets/scss/abstract/_root.scss`
   **When** on inspecte les règles de style globales du projet
   **Then** un bloc de surcharge dédié `[data-theme="light"]` est déclaré à la suite des tokens racine `:root`
   **And** ce bloc redéfinit les alias sémantiques de surfaces avec la palette « Papier technique / Crème solaire » :
     - `--bg-page: hsl(38deg 25% 97%)` (`#FAF8F4` — fond de page principal crème chaleureux)
     - `--bg-sunken: hsl(38deg 20% 93%)` (`#F1EDE6` — sections en creux)
     - `--bg-card: hsl(0deg 0% 100%)` (`#FFFFFF` — cartes de contenu blanches nettes)
     - `--bg-elevated: hsl(38deg 30% 99%)` (`#FFFEFB` — survol et popovers)
     - `--bg-input: hsl(38deg 15% 95%)` (`#F5F3EE` — champs et conteneurs secondaires)
   **And** les alias sémantiques de bordures sont adaptés aux teintes chaudes :
     - `--border-subtle: hsl(35deg 15% 88%)` (`#E6E2DC`)
     - `--border-default: hsl(35deg 12% 80%)` (`#D1CCC4`)
     - `--border-strong: hsl(35deg 12% 68%)` (`#B3ABA2`)
   **And** les ombres sont réétalonnées pour un fond clair :
     - `--shadow-1: 0 1px 3px hsl(35deg 20% 40% / 8%)`
     - `--shadow-2: 0 3px 10px hsl(35deg 20% 40% / 10%)`
     - `--shadow-3: 0 8px 24px hsl(35deg 20% 40% / 12%)`
     - `--shadow-hairline: inset 0 1px 0 hsl(0deg 0% 100% / 80%)`
   **And** les tokens d'accent et de sélection sont ajustés :
     - `--accent: hsl(24deg 95% 44%)` (`#DA5207` — contraste AA > 4.5:1 garanti sur fond blanc/crème)
     - `--accent-soft: hsl(24deg 94% 53% / 10%)`
     - `--accent-ring: hsl(24deg 94% 53% / 35%)`
     - `--selection: hsl(24deg 94% 53% / 22%)`
     - `--overlay: hsl(320deg 30% 10% / 40%)`.

2. **Given** les alias sémantiques d'encre (typographie) en mode clair
   **When** le thème `[data-theme="light"]` est appliqué
   **Then** les variables de texte adoptent la gamme aubergine profonde garantissant un confort et une conformité WCAG :
     - `--text-strong: hsl(320deg 30% 12%)` (`#271524` — ratio de contraste > 14:1 sur fond crème, conforme WCAG AAA)
     - `--text-body: hsl(320deg 18% 26%)` (`#473644` — ratio de contraste > 8:1 sur fond crème, conforme WCAG AAA)
     - `--text-muted: hsl(320deg 10% 44%)` (`#756773` — ratio de contraste > 4.5:1 sur fond crème, conforme WCAG AA)
     - `--text-faint: hsl(320deg 8% 58%)` (`#988D96` — réservé aux éléments secondaires désactivés)
     - `--ink-on-accent: hsl(0deg 0% 100%)` (`#FFFFFF` sur les boutons à fond plein).

3. **Given** les conteneurs et fenêtres d'émulation terminal (`.home-hero-terminal`, `.hero-term`, `.terminal-window`, `.terminal`)
   **When** le document HTML porte l'attribut `data-theme="light"`
   **Then** les règles d'isolation sanctuarisent le terminal :
     - Le fond reste sombre : `--bg-terminal: var(--aubergine-deep)` (`hsl(319deg 100% 9%)` / `#2E0024`)
     - Les textes restent clairs : `--text-strong: var(--ink-1)` (`hsl(30deg 18% 95%)`), `--text-body: var(--ink-2)` (`hsl(28deg 10% 74%)`)
     - Les couleurs de syntaxe (`--term-green`, `--term-blue`, etc.) et le prompt vert clignotant restent inchangés
     - Aucune décoloration ni inversion involontaire ne se produit à l'intérieur du Terminal Hero ou de la console draggable.

4. **Given** la suite d'outillage et les standards de code du projet
   **When** on exécute la vérification dans Docker
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint"` s'exécute avec 0 erreur ESLint et 0 erreur Stylelint
   **And** la syntaxe HSL avec degrés (`deg`) et pourcentages respecte scrupuleusement la configuration `.stylelintrc.json`.

## Tasks / Subtasks

- [x] Tâche 1 — Déclaration des tokens de surface et d'encre clairs dans `app/assets/scss/abstract/_root.scss` (AC: 1, 2)
  - [x] Ajouter le sélecteur `[data-theme="light"]` à la suite du bloc `:root`.
  - [x] Déclarer la rampe des surfaces claires (`--bg-page`, `--bg-sunken`, `--bg-card`, `--bg-elevated`, `--bg-input`).
  - [x] Déclarer la rampe d'encres aubergine (`--text-strong`, `--text-body`, `--text-muted`, `--text-faint`).
  - [x] Déclarer les bordures douces (`--border-subtle`, `--border-default`, `--border-strong`), les ombres claires et l'accent orange contrasté AA.
  - [x] Vérifier la conformité de la notation CSS (angles `deg`, pourcentages sans virgules non standard).

- [x] Tâche 2 — Sanctuarisation du Terminal Hero et des fenêtres CLI (AC: 3)
  - [x] Déclarer dans `_root.scss` (ou dans une section dédiée) la réinitialisation locale des tokens pour les sélecteurs `.hero-term`, `.home-hero-terminal`, `.terminal-window`, `.terminal`.
  - [x] Forcer les variables internes de surface et de texte (`--bg-terminal`, `--text-strong`, `--text-body`, `--text-muted`, `--border-subtle`, `--border-default`, `--border-terminal`).
  - [x] Vérifier qu'aucun composant terminal n'est pollué par les encres sombres du mode clair.

- [x] Tâche 3 — Vérification visuelle locale et conformité Stylelint / Docker (AC: 4)
  - [x] Tester temporairement l'application de `data-theme="light"` sur la balise `<html>` pour vérifier le rendu des cartes blanches sur fond crème.
  - [x] Lancer `docker compose run --rm web sh -c "corepack enable && pnpm lint"` et corriger tout avertissement Stylelint.

### Review Findings

- [x] [Review][Patch] Utiliser les tokens déclarés (`var(--aubergine-deep)`, `var(--border-terminal)`) dans le bloc de sanctuarisation du terminal au lieu de valeurs HSL hardcodées [`app/assets/scss/abstract/_root.scss:247-253`]
- [x] [Review][Patch] Sanctuariser explicitement `--selection` et `--accent` dans les fenêtres de terminal pour préserver l'orange vif éclatant et la sélection sombre [`app/assets/scss/abstract/_root.scss:246-254`]
- [x] [Review][Defer] Ajustement des tokens d'interaction secondaires (--accent-hover, --accent-active) et validation des composants transverses en thème clair [`docs/planning-artifacts/epics.md`] — deferred, prévu en Story 13.4

## Dev Notes

### Architecture des Tokens SCSS & Emplacement des fichiers
- **Fichier principal à modifier :** `app/assets/scss/abstract/_root.scss`
- **Fichiers de référence :**
  - Spécification visuelle : [`docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md`](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md)
  - Architecture technique : [`docs/specs/spec-theme-light-dark/technical-architecture.md`](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-theme-light-dark/technical-architecture.md)
  - Règles globales : [`AGENTS.md`](file:///Users/simon/dev/jouan.ovh/AGENTS.md)

### Invariants critiques à respecter
- **Environnement Docker obligatoire :** Ne jamais lancer `pnpm` sur la machine hôte. Toute commande s'exécute via :
  ```sh
  docker compose run --rm web sh -c "corepack enable && pnpm lint"
  ```
- **Zéro Emoji :** Aucun caractère emoji dans les commentaires de code ou les styles.
- **Règle d'or Stylelint :** Le projet utilise la notation standard CSS Color Module Level 4 pour HSL : `hsl(38deg 25% 97%)` et pour l'alpha `hsl(24deg 94% 53% / 10%)`. Ne pas utiliser de virgules dans les déclarations HSL (`hsl(38, 25%, 97%)` est rejeté par Stylelint).

### Code Snippet de référence pour `_root.scss`

```scss
// ============================================================
//  Surcharge Thème Clair — Palette « Papier technique / Crème solaire »
// ============================================================
[data-theme="light"] {
  // Surfaces claires
  --bg-page: hsl(38deg 25% 97%);
  --bg-sunken: hsl(38deg 20% 93%);
  --bg-card: hsl(0deg 0% 100%);
  --bg-elevated: hsl(38deg 30% 99%);
  --bg-input: hsl(38deg 15% 95%);

  // Encres aubergine (contrastes WCAG AAA)
  --text-strong: hsl(320deg 30% 12%);
  --text-body: hsl(320deg 18% 26%);
  --text-muted: hsl(320deg 10% 44%);
  --text-faint: hsl(320deg 8% 58%);
  --ink-on-accent: hsl(0deg 0% 100%);

  // Bordures douces
  --border-subtle: hsl(35deg 15% 88%);
  --border-default: hsl(35deg 12% 80%);
  --border-strong: hsl(35deg 12% 68%);

  // Accent & sélections
  --accent: hsl(24deg 95% 44%);
  --accent-soft: hsl(24deg 94% 53% / 10%);
  --accent-ring: hsl(24deg 94% 53% / 35%);
  --selection: hsl(24deg 94% 53% / 22%);
  --overlay: hsl(320deg 30% 10% / 40%);

  // Ombres adaptées
  --shadow-1: 0 1px 3px hsl(35deg 20% 40% / 8%);
  --shadow-2: 0 3px 10px hsl(35deg 20% 40% / 10%);
  --shadow-3: 0 8px 24px hsl(35deg 20% 40% / 12%);
  --shadow-hairline: inset 0 1px 0 hsl(0deg 0% 100% / 80%);
}

// Sanctuarisation absolue du terminal sombre
.home-hero-terminal,
.hero-term,
.terminal-window,
.terminal {
  --bg-terminal: hsl(319deg 100% 9%);
  --text-strong: var(--ink-1);
  --text-body: var(--ink-2);
  --text-muted: var(--ink-3);
  --border-subtle: var(--line-subtle);
  --border-default: var(--line);
  --border-terminal: hsl(319deg 40% 30% / 40%);
}
```

## Dev Agent Record

### Agent Model Used

Gemini 3.7 Flash (Medium)

### Debug Log References

- Validation Gate Docker exécutée avec succès (`pnpm lint`, `pnpm typecheck`, `pnpm generate`).
- 0 erreur ESLint, 0 erreur Stylelint.
- 24 routes SSG pré-rendues sans anomalie.

### Completion Notes List

- Déclaration de la palette claire « Papier technique / Crème solaire » sous `[data-theme="light"]` dans `app/assets/scss/abstract/_root.scss`.
- Redéfinition des alias sémantiques de surfaces (`--bg-page`, `--bg-sunken`, `--bg-card`, `--bg-elevated`, `--bg-input`), encres aubergine WCAG AAA (`--text-strong`, `--text-body`, `--text-muted`, `--text-faint`, `--ink-on-accent`), bordures chaudes, ombres et accents orange contrastés.
- Sanctuarisation stricte des composants terminaux (`.home-hero-terminal`, `.hero-term`, `.terminal-window`, `.terminal`) avec préservation du fond sombre, encres claires et bordures terminales.

### File List
- `app/assets/scss/abstract/_root.scss`
