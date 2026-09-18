---
id: SPEC-theme-light-dark
companions:
  - ../../planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md
  - ../../planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md
  - technical-architecture.md
sources: []
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Thème Light & Dark (jouan.ovh)

## Why

Le site actuel est conçu exclusivement en thème sombre aubergine, ce qui limite le confort de lecture pour les visiteurs consultant le portfolio en environnement à forte luminosité (en extérieur, sur écran non traité ou selon leur habitude système). L'ajout d'un thème clair « Papier technique / Crème solaire » tout en préservant le terminal sombre résout cette gêne visuelle, renforce l'accessibilité globale et offre aux visiteurs un contrôle complet (synchronisation avec leur OS ou forçage manuel persistant).

## Capabilities

- id: CAP-1
  intent: Le visiteur peut consulter l'intégralité du site dans une palette claire « Papier technique » contrastée et lisible sans dénaturer l'identité de marque ni modifier l'apparence sombre des terminaux.
  success: L'application de `data-theme="light"` permute l'ensemble des arrière-plans (`#FAF8F4`), bordures et textes aubergine profonde (`#271524`, contraste > 8:1) sur toutes les routes statiques, tandis que le Terminal Hero et les fenêtres flottantes conservent leur fond sombre (`#2E0024`) et leurs couleurs syntaxiques d'origine.

- id: CAP-2
  intent: Le site adopte automatiquement le thème préféré du système d'exploitation de l'utilisateur dès la première visite et réagit en temps réel à tout changement d'ambiance système tant qu'aucun forçage n'a été enregistré.
  success: En absence de clé locale, le basculement de `prefers-color-scheme` entre sombre et clair dans le système (ou l'émulation DevTools) adapte immédiatement le thème sans rafraîchissement ni interruption de lecture.

- id: CAP-3
  intent: L'utilisateur peut surcharger manuellement le thème de son choix et conserver ce paramètre lors de ses visites ultérieures sur le même terminal.
  success: La sélection d'un thème forcé (`dark` ou `light`) s'enregistre dans le `localStorage` du navigateur sous la clé `jouan_theme_mode` et est restaurée fidèlement lors des rechargements et navigations futures.

- id: CAP-4
  intent: L'utilisateur dispose dans le Header d'une commande compacte positionnée immédiatement à gauche du statut « Disponible » permettant de faire défiler les états Système, Sombre et Clair.
  success: Un bouton d'action placé dans le dock d'état du header (`.hdr__dock-right`) et dans le tiroir mobile avance cycliquement dans l'ordre `Système → Sombre → Clair → Système`, affiche l'icône vectorielle correspondante (`monitor` / `moon` / `sun`), et met à jour son `aria-label` descriptif sans aucun emoji textuel.

- id: CAP-5
  intent: Tout chargement d'une page pré-rendue applique le thème effectif dès le premier instant sans aucun flash lumineux ou clignotement de thème inverse lors de l'hydratation côté client.
  success: Un script inline synchrone injecté dans le `<head>` du document HTML résout et applique `data-theme` sur l'élément racine avant le premier paint du navigateur, sans provoquer de décalage de mise en page ni de flash FOUC.

- id: CAP-6
  intent: La sélection du thème et la navigation en mode clair sont pleinement utilisables au clavier, intelligibles pour les lecteurs d'écran et visibles en mode contraste élevé système.
  success: Le bouton est manipulable par `Tab`, `Entrée` et `Espace`, expose un indicateur de focus distinct (`--ring-accent`), supporte le mode Windows High Contrast via `forced-colors`, et tous les textes du thème clair valident le seuil de contraste WCAG AA (> 4.5:1).

## Constraints

- **Environnement Docker exclusif :** Toute compilation, vérification TypeScript et validation SSG s'exécute strictement via `docker compose run --rm web ...`.
- **Zéro Emoji :** Conformité stricte avec la règle NFR6 du projet (aucun caractère emoji dans les libellés, infobulles, SVG ou code).
- **Sanctuarisation du Terminal :** Le Terminal Hero et le composant `TerminalComponent` conservent impérativement leur fond sombre aubergine (`#2E0024`) et leur rendu CLI dans les deux thèmes.
- **Architecture SSG Statique :** Aucune dépendance à un middleware serveur ou cookie HTTP dynamique ; persistance reposant exclusivement sur `localStorage` et les media queries côté client.
- **DRY & Pas de tokens hardcodés :** Toutes les couleurs et élévations sont exposées via les variables CSS sémantiques de `_root.scss`.

## Non-goals

- Ne pas implémenter de sélecteur libre de couleurs ou de générateur de thèmes personnalisés.
- Ne pas synchroniser le thème via un compte utilisateur ou un backend distant.
- Ne pas convertir l'interface interne du terminal en thème clair.
- Ne pas introduire de bibliothèque externe de gestion de thème ou de framework CSS tiers.

## Success signal

Sur n'importe quelle page de `jouan.ovh`, un utilisateur clique sur la commande située à gauche de « Disponible » : l'interface bascule instantanément entre les modes Système, Sombre et Clair avec une palette crème « Papier technique » contrastée WCAG AA/AAA, le choix persiste au rechargement de page sans flash FOUC, et la suite de vérification Docker (`pnpm lint && pnpm typecheck && pnpm generate`) réussit avec 0 erreur sur l'ensemble des 13 routes statiques.

## Assumptions

- Les trois tracés d'icônes (`monitor`, `moon`, `sun`) sont ajoutés directement dans `ZIcon.vue` sans dépendance externe.
- Le script synchrone anti-FOUC est configuré dans `nuxt.config.ts` au niveau de `app.head.script`.
