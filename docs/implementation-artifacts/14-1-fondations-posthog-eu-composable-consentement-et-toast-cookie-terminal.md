---
baseline_commit: d8193c7
---

# Story 14.1: Fondations PostHog EU, Composable de Consentement & Toast Cookie Terminal

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur du site `jouan.ovh`,
I want être informé sobrement de la télémétrie de navigation et pouvoir accepter ou refuser les cookies/analytics via une invite terminal non intrusive,
so that mes droits à la vie privée soient respectés sans dégrader l'expérience esthétique du portfolio (FR43, FR45, NFR6, CAP-1, CAP-4).

## Acceptance Criteria

1. **Given** l'infrastructure client Nuxt 4, le projet PostHog Cloud EU et l'environnement Docker
   **When** on intègre la dépendance client PostHog et l'outillage agentic
   **Then** le paquet `posthog-js` est ajouté aux `dependencies` de `package.json` **exclusivement via le conteneur Docker** (`docker compose run --rm web sh -c "corepack enable && pnpm add posthog-js"`), le `pnpm-lock.yaml` est mis à jour, et **aucune commande pnpm/npx n'a été lancée sur l'hôte macOS**
   **And** le serveur MCP officiel PostHog est enregistré pour l'agent (`@posthog/mcp`) avec la clé API personnelle `POSTHOG_API_KEY` (preset « MCP Server ») et l'hôte EU `https://eu.i.posthog.com`, de sorte que l'agent puisse piloter PostHog (lecture projet, clé publique `phc_...`, réglages Session Replay) pendant la configuration
   **And** `.agents/mcp_config.json` et `.env.example` restent cohérents avec cette configuration (variables `NUXT_PUBLIC_POSTHOG_KEY`, `NUXT_PUBLIC_POSTHOG_HOST`, `POSTHOG_API_KEY`).

2. **Given** le fichier `nuxt.config.ts`
   **When** on déclare la configuration d'exécution
   **Then** les variables `runtimeConfig.public.posthogKey` (défaut `""`, injectée par `NUXT_PUBLIC_POSTHOG_KEY`) et `runtimeConfig.public.posthogHost` (défaut `https://eu.i.posthog.com`, injectée par `NUXT_PUBLIC_POSTHOG_HOST`) sont présentes dans le bloc `runtimeConfig.public`, sans aucune clé ni URL en dur dans le code
   **And** aucune de ces valeurs n'est requise au build : `pnpm generate` réussit avec une `posthogKey` vide.

3. **Given** l'infrastructure client Nuxt 4
   **When** on crée le composable `app/composables/useConsent.ts`
   **Then** il expose :
   - un état réactif partagé `consentState: 'unknown' | 'accepted' | 'declined'` (via `useState`, valeur initiale `'unknown'`)
   - une méthode `accept()` qui positionne l'état à `'accepted'`, persiste `localStorage.setItem('jouan_consent_telemetry', 'accepted')` et active la capture PostHog
   - une méthode `decline()` qui positionne l'état à `'declined'`, persiste `'declined'` et désactive la capture PostHog
   - une méthode `openConsentModal()` qui force la ré-affichage du toast (révocation depuis le footer), y compris après un choix déjà enregistré
   - une méthode d'initialisation (ex. `initConsent()`) qui lit `localStorage` **et** détecte `navigator.doNotTrack === '1'` : dans ce cas, l'état bascule automatiquement sur `'declined'` **sans afficher le toast**
   **And** tout accès à `localStorage`, `navigator` ou `document` est gardé par `import.meta.client` (compatibilité prerender SSG, aucune erreur à `pnpm generate`).

4. **Given** le composant `app/components/ui/ConsentToast.vue`
   **When** un visiteur arrive sans choix de consentement enregistré et sans signal Do Not Track
   **Then** un toast flottant s'affiche en bas d'écran, conforme au Design System sombre aubergine :
   - fond `var(--bg-elevated)` (ou `var(--surface-3)`), bordure `var(--border-subtle)`, ombre `var(--shadow-3)`, rayon `var(--radius-lg)`
   - préfixe stylisé terminal `// telemetry:` en `var(--font-mono)` (préfixe décoratif `// ` encapsulé dans `<span aria-hidden="true">`)
   - **zéro emoji** (NFR6)
   - bouton primaire `Accepter` (active PostHog et, à terme, le Session Replay) et bouton secondaire `Refuser`
   - lien discret `En savoir plus` vers `/confidentialite` (via `NuxtLink`)
   **And** le toast est rendu **client-only** (aucun mismatch d'hydratation en SSG) et porte une sémantique accessible : conteneur avec `role="region"` (ou `role="dialog"` non modal) et `aria-label` en français, boutons atteignables au clavier avec focus visible (`box-shadow: var(--ring-accent)` + repli `outline: 2px solid transparent; outline-offset: 2px;`)
   **And** le toast disparaît dès qu'un choix est fait (état `accepted` ou `declined`), et toute animation d'entrée/sortie est neutralisée sous `prefers-reduced-motion: reduce`.

5. **Given** le composant `app/components/FooterComponent.vue`
   **When** un visiteur souhaite modifier son choix
   **Then** un lien discret « Gestion des cookies » (français, sans emoji) est présent dans le footer et appelle `openConsentModal()` au clic pour rouvrir le toast à tout moment
   **And** ce déclencheur est un élément interactif natif (`<button type="button">`) accessible au clavier avec focus visible, et ne casse pas la mise en page existante du footer.

6. **Given** le plugin `app/plugins/posthog.client.ts`
   **When** l'application s'exécute côté navigateur
   **Then** le plugin initialise PostHog avec `posthog.init(posthogKey, { api_host: posthogHost, opt_out_capturing_by_default: true, ... })`, de façon **non bloquante** (chargement différé / dynamique de `posthog-js`)
   **And** l'initialisation est strictement gardée côté client (`import.meta.client`) et **désactivée hors production** : aucun appel réseau analytics n'est émis en développement local ni pendant `pnpm generate`
   **And** PostHog reste en `opt_out_capturing_by_default: true` tant que le consentement n'est pas accordé ; l'état `'accepted'` déclenche `posthog.opt_in_capturing()` et l'état `'declined'` (ou Do Not Track) maintient/force `posthog.opt_out_capturing()`
   **And** le plugin n'appelle **jamais** `posthog.identify()` (aucune donnée nominative) et ne casse pas le prerender si `posthogKey` est vide.

7. **Given** l'environnement Docker du projet
   **When** on exécute la commande de validation complète
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript vue-tsc et l'ensemble des routes statiques pré-rendues sans anomalie
   **And** le toast de consentement est vérifié visuellement au navigateur (Chrome DevTools MCP, desktop + mobile) : rendu fidèle au DS terminal, boutons cliquables, réouverture depuis le footer, disparition après choix, et **aucun appel réseau vers `eu.i.posthog.com` en mode dev**.

## Tasks / Subtasks

- [x] **Tâche 1 — Outillage agentic MCP PostHog & dépendance client (AC: 1)**
  - [x] Enregistrer le serveur MCP PostHog pour l'agent dans la configuration opencode (`~/.config/opencode/opencode.json`, bloc `mcp`) :
    ```jsonc
    "posthog": {
      "type": "local",
      "command": ["npx", "-y", "@posthog/mcp"],
      "environment": {
        "POSTHOG_API_KEY": "{env:POSTHOG_API_KEY}",
        "POSTHOG_HOST": "https://eu.i.posthog.com"
      },
      "enabled": true
    }
    ```
    Vérifier que la clé est bien résolue depuis l'environnement et **ne jamais** la committer.
  - [x] Vérifier `.agents/mcp_config.json` (déjà présent) et `.env.example` (variables PostHog déjà documentées) — les aligner si nécessaire.
  - [x] Après inscription PostHog par Simon, **piloter PostHog via le MCP** pour : confirmer la région EU (`https://eu.i.posthog.com`), récupérer la clé publique de projet (`phc_...`) à injecter dans `NUXT_PUBLIC_POSTHOG_KEY`, et vérifier les réglages Session Replay (masquage des inputs) prévus en story 14.2. **Fait via le navigateur (PostHog EU, org Katzo, projet réutilisé)** : région **EU Cloud** confirmée, Project token récupéré, clé API personnelle « opencode MCP » (preset MCP Server) créée. *(Le pilotage via le serveur MCP lui-même nécessite un redémarrage d'opencode pour charger le MCP — disponible dès la prochaine session.)*
  - [x] Installer `posthog-js` **dans Docker uniquement** : `docker compose run --rm web sh -c "corepack enable && pnpm add posthog-js"`. Vérifier l'ajout dans `package.json` (`dependencies`) et `pnpm-lock.yaml`.

- [x] **Tâche 2 — Configuration runtime PostHog (AC: 2)**
  - [x] Ajouter `posthogKey: ""` et `posthogHost: "https://eu.i.posthog.com"` dans `runtimeConfig.public` de `nuxt.config.ts`, avec un commentaire renvoyant à `.env.example` (pattern identique à `web3formsAccessKey`/`siteUrl`).
  - [x] Confirmer qu'aucune valeur n'est en dur et que `pnpm generate` passe avec `posthogKey` vide.

- [x] **Tâche 3 — Composable `useConsent` (AC: 3)**
  - [x] Créer `app/composables/useConsent.ts` avec `useState` partagé (`consentState`), la clé `jouan_consent_telemetry`, `accept()`, `decline()`, `openConsentModal()`, `initConsent()`.
  - [x] Implémenter la détection `navigator.doNotTrack === '1'` → `'declined'` silencieux (pas de toast).
  - [x] Garder tous les accès navigateur derrière `import.meta.client`.

- [x] **Tâche 4 — Plugin `posthog.client.ts` (AC: 6)**
  - [x] Créer `app/plugins/posthog.client.ts` : init paresseuse/non bloquante, `opt_out_capturing_by_default: true`, garde client + `import.meta.dev`/`import.meta.prerender`, réaction au consentement (`opt_in_capturing`/`opt_out_capturing`), aucun `identify()`.
  - [x] Consommer `useRuntimeConfig().public.posthogKey` / `posthogHost`.

- [x] **Tâche 5 — Composant `ConsentToast.vue` (AC: 4)**
  - [x] Créer `app/components/ui/ConsentToast.vue` (`<script setup lang="ts">`) conforme DS : préfixe `// telemetry:`, boutons `Accepter`/`Refuser`, lien `En savoir plus` → `/confidentialite`, zéro emoji.
  - [x] Rendu client-only + a11y (`role`/`aria-label`, focus visible, repli forced-colors, neutralisation motion réduit).
  - [x] Monter le toast dans le châssis (ex. `app/layouts/default.vue`) pour un affichage global.

- [x] **Tâche 6 — Intégration footer (AC: 5)**
  - [x] Ajouter le lien « Gestion des cookies » dans `FooterComponent.vue` appelant `openConsentModal()`, sans régression de layout ni d'a11y.

- [x] **Tâche 7 — Validation Docker & visuelle (AC: 7)**
  - [x] Exécuter la gate complète dans Docker :
    ```sh
    docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
    ```
  - [x] Vérification visuelle Chrome DevTools MCP (desktop + mobile) : toast, boutons, réouverture footer, disparition après choix, absence d'appel réseau PostHog en dev.
  - [x] Consigner les preuves (logs/captures) dans le Dev Agent Record.

## Dev Notes

### Contexte & objectif de la story
Cette story pose **uniquement les fondations** d'Epic 14 : dépendance, runtimeConfig, consentement opt-in, toast terminal et initialisation client conditionnée. Le **Session Replay sécurisé** (masquage `ph-no-capture`, mise à jour `/confidentialite`) est en **story 14.2**, le **plan de taggage exhaustif** en **story 14.3** et le **sitemap/robots/GSC** en **story 14.4**. Ne pas déborder sur ces périmètres.

### Architecture logicielle & fichiers à toucher
- **Fichiers NEW :**
  - `app/composables/useConsent.ts`
  - `app/plugins/posthog.client.ts` (dossier `app/plugins/` à créer — il n'existe pas encore)
  - `app/components/ui/ConsentToast.vue`
- **Fichiers UPDATE :**
  - `nuxt.config.ts` (bloc `runtimeConfig.public`)
  - `package.json` + `pnpm-lock.yaml` (dépendance `posthog-js`)
  - `app/components/FooterComponent.vue` (lien « Gestion des cookies »)
  - `app/layouts/default.vue` (montage global du toast)
  - `.agents/mcp_config.json` (vérification/alignement) et éventuellement `~/.config/opencode/opencode.json` (enregistrement MCP — hors dépôt)
- **À NE PAS toucher dans cette story :** `app/pages/confidentialite.vue` (14.2), le formulaire contact (14.2), les composants de pages pour le taggage (14.3), `public/robots.txt` / sitemap (14.4).

### Patterns & invariants projet à respecter (issus de `project-context.md` + `AGENTS.md`)
1. **Docker exclusif** : toute commande `pnpm`/`npx` passe par le conteneur. Ne jamais lancer `pnpm add` sur l'hôte macOS.
2. **Prerender-safe (SSG)** : aucun accès `window`/`document`/`localStorage`/`navigator` hors `import.meta.client` ou `onMounted()`. Le plugin est en `.client.ts`.
3. **Zéro hardcoding** : la clé et l'hôte PostHog viennent de `runtimeConfig.public`, jamais en dur. Pas d'URL de domaine en dur (utiliser `useSiteUrl()` si nécessaire).
4. **Tokens DS uniquement** : `var(--token)`, aucune couleur/espace/rayon en dur. Le token `--surface-raised` mentionné dans l'epic **n'existe pas** dans `_root.scss` — utiliser les tokens existants `--bg-elevated` (= `--surface-3`) ou `--surface-3`, `--border-subtle`, `--shadow-3`, `--radius-lg`, `--font-mono`, `--ring-accent`.
5. **Zéro emoji** (NFR6), français, vouvoiement, 1re personne pour Simon.
6. **A11y dès l'écriture** : focus visible (`box-shadow: var(--ring-accent)` + repli inline `outline: 2px solid transparent; outline-offset: 2px;`), sémantique de rôle correcte, clavier fonctionnel, motion réduit respecté.
7. **Composants `ui/`** : auto-importés **sans préfixe de dossier** (`<ConsentToast>`). `<script setup lang="ts">` obligatoire.
8. **Le composant de toast doit être client-only** : monter sous garde `import.meta.client` ou via un `<ClientOnly>` pour éviter tout mismatch d'hydratation en SSG.

### Détails d'implémentation critiques
- **Isolation production (CAP-1)** : le SPEC impose « aucun appel réseau analytics en développement local ou lors de `nuxi generate` ». Garder l'init derrière une double garde : `import.meta.client && !import.meta.dev && import.meta.env.PROD` (et/ou vérifier `posthogKey` non vide). Ne pas initialiser si la clé est absente.
- **Chargement non bloquant (Performance)** : importer `posthog-js` en dynamique (`await import("posthog-js")`) dans `onMounted`/hook client, ou exposer un singleton lazy — jamais d'import statique bloquant dans le bundle critique.
- **État partagé plugin ↔ toast ↔ footer** : utiliser `useState("consent-state")` dans `useConsent` pour que le plugin, le toast et le footer partagent la même source réactive. Le plugin peut réagir au changement via un `watch` sur `consentState`.
- **Do Not Track** : `navigator.doNotTrack === '1'` (ou `window.doNotTrack === '1'`) → `'declined'` automatique et **toast masqué**. Ne jamais écraser un DNT par un `accept()` ultérieur : conserver le mode décliné forcé (le préciser dans le code).
- **`openConsentModal()`** : doit réinitialiser l'affichage du toast même si un choix existe (révocation RGPD). Prévoir un état d'affichage (`showToast`) distinct de `consentState`.
- **Pas de `posthog.identify()`** (compliance-gdpr.md §3) : l'identifiant reste un UUID anonyme.
- **`.env.example`** documente déjà `NUXT_PUBLIC_POSTHOG_KEY`, `NUXT_PUBLIC_POSTHOG_HOST`, `POSTHOG_API_KEY` — ne pas dupliquer/diverger.

### Testing standards summary
- **Pas de framework de test** (cf. `project-context.md#Tests`). Barre de qualité = `pnpm lint` + `pnpm typecheck` + `pnpm generate` (Docker, 0 erreur) + **vérification visuelle et comportementale Chrome DevTools MCP** (desktop + mobile).
- Vérifier explicitement : toast affiché au 1er passage, disparition après choix, réouverture footer, `localStorage['jouan_consent_telemetry']` renseigné, DNT → toast absent, et **absence d'appels réseau `eu.i.posthog.com` en dev** (onglet Network).
- La vérification visuelle est **obligatoire avant clôture** (accord rétro Epic 11) : la gate verte est nécessaire mais non suffisante.

### Project Structure Notes
- Alignement sur la structure Nuxt 4 (`srcDir = "app"`) : `app/composables/`, `app/plugins/`, `app/components/ui/`.
- Le dossier `app/plugins/` n'existe pas encore — le créer.
- `ConsentToast` dans `app/components/ui/` suit la convention des primitives DS (`Z*` pour les primitives ; ce composant applicatif garde son nom explicite sans préfixe `Z`, auto-importé sans préfixe de dossier).
- Aucune divergence de structure détectée.

### References
- [Source: docs/planning-artifacts/epics.md#Epic 14 — Story 14.1]
- [Source: docs/specs/spec-analytics-search-console/SPEC.md#CAP-1, CAP-4, CAP-7, CAP-8]
- [Source: docs/specs/spec-analytics-search-console/compliance-gdpr.md#§2, §3, §4]
- [Source: docs/specs/spec-analytics-search-console/tracking-plan.md] (contexte du taggage, implémenté en 14.3)
- [Source: docs/implementation-artifacts/spec-alignement-commercial-v1-2.md] (dernier chantier livré, baseline `d8193c7`)
- [Source: app/composables/useTheme.ts] (pattern `useState` + garde `import.meta.client` + `localStorage` + écouteur)
- [Source: app/components/FooterComponent.vue] (cible d'intégration du lien « Gestion des cookies »)
- [Source: nuxt.config.ts] (pattern `runtimeConfig.public`, ex. `web3formsAccessKey`)
- [Source: .env.example] (variables PostHog déjà documentées)
- [Source: .agents/mcp_config.json] (serveur MCP PostHog existant)
- [Source: docs/project-context.md#Nuxt, #SCSS, #Accessibilité, #Tests]
- [Source: AGENTS.md#Invariants]

## Dev Agent Record

### Agent Model Used

deepseek-v4.1-flash (opencode-go)

### Debug Log References

- Gate Docker complète (2 passes) : `pnpm lint` 0 erreur ESLint/Stylelint, `pnpm typecheck` 0 erreur vue-tsc, `pnpm generate` → **28 routes statiques pré-rendues**, exit 0.
- Build initial échoué : `ERR_PNPM_IGNORED_BUILDS` sur `core-js@3.50.0` (dépendance transitive de `posthog-js`) → ajout de l'entrée `core-js: false` dans `allowBuilds` de `pnpm-workspace.yaml` (pnpm 11 exige une décision explicite allow/deny pour chaque paquet ; aucun script de build n'est requis pour `core-js`).
- HTML pré-rendu (`.output/public/index.html`) : `posthogKey:""` et `posthogHost:"https://eu.i.posthog.com"` inlinés via runtimeConfig (aucune clé, aucune balise `telemetry`/toast). `posthog-js` isolé dans un chunk JS séparé (`Cpz7rUyO.js`, 308 kB) chargé dynamiquement.
- Vérification visuelle Chrome DevTools MCP (dev :3000) :
  - Desktop 1440×900 : toast affiché bas-centre (`// telemetry:` + texte FR + Accepter/Refuser/En savoir plus), rendu DS conforme (capture `consent-toast-desktop`).
  - Mobile 390×844 : toast pleine largeur, actions sur une ligne (capture `consent-toast-mobile`).
  - Clic `Accepter` → toast disparu (`.consent` absent du DOM) ; rechargement → toast absent (persistance `localStorage` confirmée).
  - Clic footer `Gestion des cookies` → toast réaffiché (révocation) ; clic `Refuser` → toast disparu.
  - *Note : les captures `consent-toast-desktop`/`consent-toast-mobile` n'ont pas été versionnées dans le dépôt (vérification visuelle consignée en texte uniquement).*
- **Vérification visuelle post-code-review (2026-09-23, dev :3000)** : après `docker compose restart web` (cache `.nuxt` invalidé par le `generate`), toast réouvert via le bouton footer — rendu DS conforme (desktop 1440×900, mobile 390×844), actions sur une ligne, fermeture effective au clic `Refuser`. Captures locales : `.openchamber/screenshots/consent-toast-review-desktop-*.jpg` et `...-mobile-*.jpg` (non versionnées). Aucun mismatch d'hydratation attribuable à `ConsentToast` (seul le warning pré-existant `HomeHeroTerminal` subsiste).
- Warning d'hydratation `HomeHeroTerminal` (mismatch `<noscript>`) : **pré-existant et hors périmètre** — reproduit sans le composant `ConsentToast` (test de contrôle avec `ClientOnly` retiré). Aucun warning d'hydratation attribuable à cette story (`ClientOnly` isole le toast).
- **Configuration PostHog EU (réelle)** : compte existant (org « Katzo ») déjà sur `eu.posthog.com` (région **EU Cloud**, projet ID `62302`). Le plan gratuit limitant à 1 projet, le projet existant (ancien « TRYON », mort) a été réutilisé. **Project token** `phc_KeNHjBX1AxRjRj4bQQCjJqtJDoeRqghZdw7FSohN7Vu` injecté dans `.env` (`NUXT_PUBLIC_POSTHOG_KEY`). Clé API personnelle « opencode MCP » (preset **MCP Server**, accès projet) créée et renseignée dans `~/.config/opencode/opencode.json` (bloc `mcp.posthog`, hors dépôt) + `.env` (`POSTHOG_API_KEY`).
- **Preuve d'ingestion end-to-end** : build de production (`pnpm generate` avec clé) servi statiquement, consentement accepté puis navigation `/` → `/services`. PostHog EU (vue *Activity → Explore events*) a reçu **3 événements** : `$pageview` (`/`), `$opt_in` (`/` et `/services`) — l'initialisation conditionnée, l'opt-in et le `$pageview` automatique fonctionnent. `.output/public/index.html` inline bien `posthogKey:"phc_…"` (aucun hardcode : source `runtimeConfig`).
- **Décision d'implémentation (révisée au code review 2026-09-23, D2)** : `capture_pageview` passé à `false` pour laisser la story 14.3 implémenter le `$pageview` route-based sans double capture. `autocapture: false`, `disable_session_recording: true` (Session Replay = story 14.2) et `ip: false` (anonymisation, compliance-gdpr §3) conservés.

### Completion Notes List

- Toutes les tâches sont terminées ; la gate Docker est 100 % verte (28 routes pré-rendues).
- `posthog-js@1.434.7` installé en Docker, ajouté à `dependencies`.
- `useConsent` : état partagé `useState`, persistance `jouan_consent_telemetry`, DNT (`navigator.doNotTrack === '1'`) → déclin silencieux non écrasable, `openConsentModal()` pour révocation.
- Plugin `posthog.client.ts` : import dynamique non bloquant, `opt_out_capturing_by_default: true`, `respect_dnt: true`, `capture_pageview: true`, `autocapture: false`, `disable_session_recording: true` (Session Replay = 14.2), `persistence: "localStorage+cookie"`, aucun `identify()`, inactif en dev et sans clé.
- `ConsentToast` client-only (`ClientOnly` + garde `mounted`), tokens DS, focus visible + repli forced-colors, animation neutralisée sous reduced-motion.
- Footer : bouton natif « Gestion des cookies » (focus visible, sans régression de layout).
- MCP PostHog enregistré et clé configurée ; le pilotage via MCP sera actif après redémarrage d'opencode.
- **Fichiers hors dépôt** (non commités) : `.env` (gitignoré — clés `NUXT_PUBLIC_POSTHOG_KEY`, `POSTHOG_API_KEY`) et `~/.config/opencode/opencode.json` (serveur MCP).

- **Clôture post-déploiement (2026-09-25)** : la CI GitHub Actions `main` est verte (run `36141238524`), les artefacts AEO sont servis en production (`/llms.txt`, `/llms-full.txt`, `/robots.txt`, `/sitemap.xml`, `/sitemap.md` en 200) et la vérification MCP confirme le projet PostHog EU, le token de production et les réglages de replay. Le consentement 14.1 a ensuite été scindé analytics/replay par la revue de la story 14.6 (voir Change Log), sans régression de l'opt-in.

### File List

- `app/composables/useConsent.ts` (nouveau)
- `app/plugins/posthog.client.ts` (nouveau)
- `app/components/ui/ConsentToast.vue` (nouveau)
- `app/layouts/default.vue` (modifié — montage `ClientOnly`)
- `app/components/FooterComponent.vue` (modifié — bouton « Gestion des cookies »)
- `nuxt.config.ts` (modifié — `runtimeConfig.public.posthogKey`/`posthogHost`)
- `package.json`, `pnpm-lock.yaml` (modifiés — dépendance `posthog-js`)
- `pnpm-workspace.yaml` (modifié — `core-js: false`)
- `.github/workflows/cd.yml` (modifié — `NUXT_PUBLIC_POSTHOG_KEY` sur `Generate` + `Verify static output`, code review D1)
- `app/assets/scss/abstract/_root.scss` (modifié — échelle de tokens `--z-*`, code review)
- `docs/implementation-artifacts/sprint-status.yaml` (modifié)
- `docs/implementation-artifacts/14-1-fondations-posthog-eu-composable-consentement-et-toast-cookie-terminal.md` (story)

## Change Log
- 2026-09-25 : **Clôture** — décision D4 levée (MCP PostHog opérationnel, projet EU `62302`, token production identique, réglages replay intacts) ; CI `main` verte et artefacts AEO servis en production ; consentement final scindé analytics/replay par la revue 14.6 (`Mesure uniquement` / `Mesure + replay` / `Refuser`, `accept()`/`decline()` conservés comme alias). Statut → `done`.
- 2026-09-23 : **Code review (3 couches adverses)** — 15 findings patch + 3 defer + 3 dismiss. Patchs appliqués : `NUXT_PUBLIC_POSTHOG_KEY` câblée dans `.github/workflows/cd.yml` (D1), `capture_pageview: false` (D2), `ip: false` (D3), race accept→decline corrigée, retry d'import PostHog, toast Échap/aria-live/focus, garde `import.meta.client`, fallback d'hôte retiré, tokens `--z-*`, DNT élargi, bouton footer regroupé. Reste bloqué : vérification via MCP PostHog (D4, après redémarrage d'opencode). Gate Docker verte (28 routes).
- 2026-09-23 : Configuration PostHog EU réelle (région EU confirmée, project token + clé MCP, réutilisation du projet unique du plan gratuit), enregistrement du serveur MCP PostHog, `capture_pageview: true`, preuve d'ingestion end-to-end (`$pageview` + `$opt_in` reçus dans PostHog). Gate Docker verte (28 routes).
- 2026-09-23 : Implémentation de la story 14.1 — fondations PostHog EU (plugin client différé, opt-out par défaut), composable `useConsent` (opt-in RGPD + DNT), toast terminal `ConsentToast`, lien footer « Gestion des cookies », runtimeConfig PostHog, enregistrement MCP PostHog.
- 2026-09-23 : Création de la story 14.1 (fondations PostHog EU, consentement opt-in, toast terminal, outillage MCP PostHog).

### Review Findings

_Code review du 2026-09-23 (diff non commité vs `d8193c7`) — 3 couches adverses : Blind Hunter, Edge Case Hunter, Acceptance Auditor._

- [x] [Review][Patch][Résolu] (ex-Décision D4) Vérification PostHog via le serveur MCP PostHog — Résolu le 2026-09-25 : MCP opérationnel (`project-get`), projet `62302` servi par `https://eu.posthog.com`, `api_token` identique à la clé injectée en production (`phc_rvr9…`), `session_recording_opt_in: true`, `anonymize_ips: true`, `recording_domains`/`app_urls` restreints à `https://jouan.ovh`. Preuves complètes en story 14.2.
- [x] [Review][Patch] (ex-Décision D1) PostHog absent du pipeline de déploiement — Résolu : `NUXT_PUBLIC_POSTHOG_KEY` ajoutée aux steps `Generate` et `Verify static output` de `.github/workflows/cd.yml` (pattern `NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY`), avec garde-fou `::error` sur push. **Action requise côté Simon** : provisionner `NUXT_PUBLIC_POSTHOG_KEY` (`phc_...`) dans `Settings → Secrets and variables → Repository secrets` (ou `vars`).
- [x] [Review][Patch] (ex-Décision D2) `capture_pageview` à `false` — Résolu : `app/plugins/posthog.client.ts` passe `capture_pageview: false` ; le `$pageview` route-based reste à la story 14.3 (pas de double capture).
- [x] [Review][Patch] (ex-Décision D3) Anonymisation IP absente vs `compliance-gdpr.md §3` — Résolu : `ip: false` ajouté à `posthog.init()`.
- [x] [Review][Patch] Sous DNT, « Accepter » est inerte et le toast reste bloqué ouvert [app/composables/useConsent.ts] — Résolu : le bouton « Accepter » est masqué sous DNT (`ConsentToast`), et `openConsentModal()`/`dismissConsentModal()` garantissent une sortie propre. Plus de toast bloqué avec bouton mort.
- [x] [Review][Patch] Race accept→decline pendant l'import asynchrone → opt-in après refus [app/plugins/posthog.client.ts] — Résolu : `applyConsent()` re-vérifie `consentState.value === "accepted"` après l'`await loadPostHog()` avant tout `opt_in_capturing()`.
- [x] [Review][Patch] Échec d'import PostHog définitivement mis en cache, sans retry [app/plugins/posthog.client.ts] — Résolu : `.catch()` réarme `loading = null` pour autoriser une nouvelle tentative.
- [x] [Review][Patch] Toast sans échappatoire : fermeture, Échap, focus, annonce [app/components/ui/ConsentToast.vue] — Résolu : `aria-live="polite"`, `@keydown.escape` → `dismissConsentModal()`, focus déplacé sur le toast uniquement en ouverture explicite (footer).
- [x] [Review][Patch] Garde `import.meta.client` explicite absente du plugin (AC6) [app/plugins/posthog.client.ts] — Résolu : garde `if (!import.meta.client || import.meta.prerender) return;` en tête de plugin.
- [x] [Review][Patch] Fallback d'URL PostHog EU hardcodé et dupliqué (AC2) [app/plugins/posthog.client.ts] — Résolu : fallback retiré ; l'hôte vient uniquement de `runtimeConfig.public.posthogHost`.
- [x] [Review][Patch] `z-index: 90` en dur [app/components/ui/ConsentToast.vue] — Résolu : échelle de tokens `--z-header`/`--z-header-raised`/`--z-toast`/`--z-modal` ajoutée à `_root.scss` ; le toast consomme `var(--z-toast)`.
- [x] [Review][Patch] Toast affiché alors que le tracker est inactif (clé vide) [app/composables/useConsent.ts] — Résolu : l'auto-affichage est conditionné à `isAnalyticsConfigured()` (clé PostHog non vide) ; le déclencheur manuel du footer reste disponible.
- [x] [Review][Patch] Détection DNT incomplète [app/composables/useConsent.ts] — Résolu : couvre `navigator.doNotTrack`, `navigator.msDoNotTrack`, `window.doNotTrack` et les valeurs `"1"`/`"yes"`.
- [x] [Review][Patch] Footer : 3e enfant flex sous `space-between` [app/components/FooterComponent.vue] — Résolu : le bouton cookies et la ligne terminal sont regroupés dans `.ftr__bottom-right` ; la répartition gauche/droite d'origine est préservée.
- [x] [Review][Patch] Inexactitudes du Dev Agent Record [story] — Résolu : (a) description `core-js` corrigée ci-dessous ; (b) « 28 routes » **vérifié exact** — la gate réémet `Prerendered 28 routes` (Nitro compte les variantes IPX et le dump de contenu, pas seulement les 10 fichiers HTML) ; (c) mention de captures non versionnées ajoutée au Dev Agent Record.
- [x] [Review][Defer] Pas de synchronisation inter-onglets du consentement [app/composables/useConsent.ts] — deferred, pre-existing : un onglet déjà ouvert conserve l'état obsolète jusqu'au rechargement ; amélioration, non régression.
- [x] [Review][Defer] Choix de consentement non persistant si `localStorage` indisponible [app/composables/useConsent.ts:26-35] — deferred, pre-existing : limitation inhérente (navigation privée restrictive), l'état retombe en mémoire et le toast réapparaît au chargement suivant.
- [x] [Review][Defer] Premier `$pageview` d'un visiteur déjà accepté perdu [app/plugins/posthog.client.ts] — deferred : sans objet désormais (`capture_pageview: false`, décision D2) ; le pageview sera géré en 14.3.
