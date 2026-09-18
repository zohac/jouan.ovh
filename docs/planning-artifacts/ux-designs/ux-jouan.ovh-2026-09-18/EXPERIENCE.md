---
name: jouan.ovh
description: Systèmes IA & automatisation métier — Expérience et Comportement Thème Light & Dark
status: final
sources:
  - docs/project-context.md
  - AGENTS.md
  - docs/specs/spec-repositionnement-ia/SPEC.md
  - docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md
updated: 2026-09-18
---

# Experience Specification — Thème Light & Dark (jouan.ovh)

## 1. Foundation

- **Plateforme & Form-factor :** Web responsive universel (Desktop large, Laptop, Tablette, Mobile).
- **Architecture technique sous-jacente :** Nuxt 4 SSG (génération statique), Vue 3 (`<script setup lang="ts">`), SCSS Dark-first avec variables CSS sur `:root` et surcharge via l'attribut HTML racine `[data-theme="light"]` / `[data-theme="dark"]`.
- **Référence d'identité visuelle :** `DESIGN.md` (spécification des tokens, contrastes et de l'ambiance « Papier technique / Crème solaire »).
- **Rôle de cette spécification :** Définir la mécanique d'orchestration du thème, les transitions d'état, la persistance locale, les comportements du composant `ThemeToggle` et la garantie d'accessibilité sans faille (a11y).

---

## 2. Information Architecture

### 2.1 Emplacement du point de contrôle (ThemeToggle)

Le contrôle du thème est un utilitaire d'ambiance et de confort de lecture. Il s'insère naturellement dans l'architecture globale sans perturber le tunnel de conversion commercial :

| Surface / Conteneur | Emplacement Précis | Rôle et Contexte UX |
|---|---|---|
| **Header Desktop** | `.hdr__dock-right`, immédiatement à gauche du badge d'état `.hdr__status-badge` (« Disponible »). | Présent en permanence sans encombrer la navigation principale (`~`, `//`, `./`, `~/`, `$`). Équilibre visuellement l'horloge et le badge de disponibilité. |
| **Menu Mobile (Drawer)** | `.hdr__menu-status` (dans le bas du volet mobile ouvert), aligné avec le statut « Disponible » et l'horloge. | Accessible facilement au pouce lors de l'ouverture du menu mobile, sans surcharger la barre fixe supérieure sur petit écran. |

---

## 3. Voice and Tone (Microcopy & Accessibilité Vocale)

En accord avec la charte sobre et professionnelle du site (zéro emoji, style inspiré du terminal d'`AGENTS.md`) :
- **Intitulés accessibles (`aria-label`) :** Dynamiques et descriptifs du mode courant et de l'action à venir.
  - État `system` actif (OS sombre) : `"Thème : Système (Sombre actif). Cliquer pour forcer le mode Sombre."`
  - État `system` actif (OS clair) : `"Thème : Système (Clair actif). Cliquer pour forcer le mode Sombre."`
  - État `dark` forcé : `"Thème : Sombre forcé. Cliquer pour forcer le mode Clair."`
  - État `light` forcé : `"Thème : Clair forcé. Cliquer pour revenir au mode Système."`
- **Infobulle native (`title`) :** `"Changer de thème (Système / Sombre / Clair)"`.
- **Annonce d'état (Live Region / Lecteur d'écran) :** Lors du changement, un élément masqué avec `aria-live="polite"` annonce : `"Mode [Sombre / Clair / Système] activé."`

---

## 4. Component Patterns — Le Composant `ThemeToggle`

### 4.1 Modèle de Données & Cycle Ternaire

L'état utilisateur `themePreference` accepte 3 valeurs :
1. `'system'` : L'application écoute le média `(prefers-color-scheme: dark)`.
2. `'dark'` : L'utilisateur force le mode sombre, indépendamment de l'OS.
3. `'light'` : L'utilisateur force le mode clair, indépendamment de l'OS.

**Algorithme de cycle au clic / déclenchement clavier :**
```text
[ system ] ──(clic)──> [ dark ] ──(clic)──> [ light ] ──(clic)──> [ system ]
```

### 4.2 Résolution du Thème Effectif (`resolvedTheme`)
- Si `themePreference === 'dark'` → `resolvedTheme = 'dark'`
- Si `themePreference === 'light'` → `resolvedTheme = 'light'`
- Si `themePreference === 'system'` → `resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'`

### 4.3 Application sur le DOM
Le thème résolu est projeté directement sur l'élément racine :
- `<html data-theme="dark">` ou `<html data-theme="light">`
- Si `themePreference === 'system'`, un attribut complémentaire `data-theme-source="system"` est présent pour permettre le stylage fin de l'indicateur d'état.

---

## 5. State Patterns & Persistance

### 5.1 Persistance Locale
- **Clé de stockage :** `localStorage.getItem('jouan_theme_mode')`.
- **Valeurs valides :** `'system' | 'dark' | 'light'`.
- Si aucune clé n'est trouvée (visiteur novice ou navigation privée réinitialisée) : valeur par défaut `'system'`.

### 5.2 Prévention du Flash au Chargement (Anti-FOUC)
Puisque `jouan.ovh` est compilé en SSG (HTML statique pré-généré sur GitHub Pages) :
- **Problème à bannir :** Un visiteur avec préférence « Light » ou OS clair ne doit jamais subir un flash noir de 200ms pendant l'hydratation Vue.
- **Pattern de solution obligatoire :**
  Un script synchrone ultra-léger (< 15 lignes de JavaScript pur sans dépendance) injecté au tout début du `<head>` dans `nuxt.config.ts` :
  ```js
  (function() {
    try {
      var pref = localStorage.getItem('jouan_theme_mode') || 'system';
      var resolved = pref;
      if (pref === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      document.documentElement.setAttribute('data-theme', resolved);
      document.documentElement.setAttribute('data-theme-source', pref);
    } catch (e) {}
  })();
  ```
- Dès que le DOM commence à peindre, `data-theme` est positionné, évitant tout clignotement.

### 5.3 Écoute Système Réactive
Quand `themePreference === 'system'`, un listener sur `window.matchMedia('(prefers-color-scheme: dark)')` met à jour automatiquement `data-theme` si l'utilisateur bascule son OS du mode jour au mode nuit (ou inversement via programmation horaire de son système d'exploitation).

---

## 6. Interaction Primitives

- **Clic souris / Tap tactile :** Avance au prochain état dans la boucle ternaire.
- **Support Clavier :**
  - Le bouton est un `<button type="button">` natif, atteignable via la touche `Tab`.
  - Déclenchable par `Entrée` ou `Espace`.
  - Focus visible haute visibilité avec anneau orange (`--ring-accent`).
- **Comportement Motion Réduit (`prefers-reduced-motion: reduce`) :**
  - Toutes les animations de rotation d'icône ou de transition d'arrière-plan sont désactivées. Le changement de thème et d'icône est instantané.

---

## 7. Accessibility Floor (Normes & Résilience a11y)

1. **Règle Zéro-Emoji :** L'UI n'utilise aucun glyphe Unicode de soleil ou de lune dans ses textes ou infobulles. Les icônes sont des tracés SVG scalables intégrés avec `aria-hidden="true"`.
2. **Cibles tactiles :**
   - Taille minimale de 36px sur desktop, 40px avec zone de tap étendue (padding invisible) sur mobile pour respecter le standard WCAG 2.5.5 / 2.5.8.
3. **Mode Contraste Élevé Système (`forced-colors: active`) :**
   - Le bouton dispose du repli `outline: 2px solid transparent; outline-offset: 2px;` pour garantir sa lisibilité en mode Windows High Contrast.
   - Les icônes SVG utilisent `fill: currentColor; stroke: currentColor;` afin d'hériter des couleurs imposées par le système (ex. `ButtonText`, `Highlight`).
4. **Sanctuarisation du terminal :**
   - Même si l'utilisateur sélectionne le thème clair, la console terminal hero et les fenêtres interactives conservent leur contraste AAA sur fond noir/aubergine (`#2e0024`), empêchant toute fatigue visuelle ou illisibilité de la syntaxe de code.

---

## 8. Key Flows (Parcours Utilisateurs Clés)

### Flow 1 — Alexandre, CTO en télétravail lumineux (OS en mode Clair)
1. **Contexte :** 14h, journée ensoleillée. L'OS d'Alexandre (macOS) est réglé en mode clair.
2. **Arrivée :** Alexandre ouvre `https://jouan.ovh`.
3. **Beat 1 :** Grâce au script anti-FOUC, le site s'affiche immédiatement dans le thème « Papier technique / Crème solaire ». Aucun flash sombre. Les cartes blanches se détachent délicatement sur le fond crème.
4. **Beat 2 (Climax) :** Alexandre arrive sur le Hero et s'arrête sur le Terminal interactif. Le terminal est noir et violet sombre, avec son prompt vert étincelant. Alexandre tape `./workflow --inspect` et apprécie le contraste saisissant entre la lisibilité reposante de la page et l'aspect pro du terminal.
5. **Résultat :** Confort de lecture optimal en plein soleil, image de marque technique préservée.

---

### Flow 2 — Sophie, Directrice des opérations le soir (Forçage Manuel)
1. **Contexte :** 22h, Sophie consulte le site depuis son smartphone. Son OS est en mode sombre.
2. **Beat 1 :** Le site s'ouvre naturellement en mode sombre aubergine, synchronisé avec son système.
3. **Beat 2 :** Sophie préfère lire les études de cas de Keova Signal avec un contraste positif (texte sombre sur fond clair).
4. **Beat 3 (Climax) :** Elle ouvre le menu burger, aperçoit le bouton de thème à côté du badge vert « Disponible » et clique dessus deux fois : l'état passe à `Sombre forcé`, puis à `Clair forcé`. La page s'éclaire doucement.
5. **Résultat :** La préférence est stockée dans son `localStorage`. Quand elle revient le lendemain, le site s'ouvre toujours en mode clair sans réinitialisation.

---

### Flow 3 — Rétablissement de la synchronisation système
1. **Contexte :** Sophie souhaite à nouveau laisser son iPhone gérer automatiquement le thème jour/nuit.
2. **Action :** Depuis le dock d'état, elle clique sur le bouton de thème (actuellement en icône soleil).
3. **Climax :** Le bouton affiche désormais l'icône écran/système, et le thème redevient immédiatement sombre en harmonie avec son OS nocturne.
4. **Résultat :** `jouan_theme_mode` est réinitialisé à `'system'`.
