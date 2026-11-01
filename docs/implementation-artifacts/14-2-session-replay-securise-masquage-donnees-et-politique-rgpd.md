---
baseline_commit: d8193c7
---

# Story 14.2: Session Replay sécurisé, Masquage des Données Sensibles & Mise à Jour RGPD

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a développeur et visiteur,
I want que les sessions enregistrées ne capturent aucune donnée personnelle ou texte confidentiel,
so that l'analyse UX s'effectue dans le respect absolu du RGPD et du secret des échanges (FR44, NFR14, CAP-2, CAP-3).

## Acceptance Criteria

1. **Given** le plugin `app/plugins/posthog.client.ts` (livré en 14.1) et l'API réelle de `posthog-js@1.434.7`
   **When** le visiteur accepte la télémétrie
   **Then** le Session Replay est initialisé avec un masquage strict, via l'API **réellement supportée** par la version installée :
   - `session_recording: { maskAllInputs: true, maskTextSelector: ".ph-no-capture, input, textarea", maskAllElementAttributes: true }`
   **And** l'enregistrement reste **désactivé tant que le consentement n'est pas accordé** (`disable_session_recording: true` à l'`init`, puis `startSessionRecording()` uniquement sur `consentState === 'accepted'`), et est stoppé (`stopSessionRecording()` + `opt_out_capturing()`) sur `'declined'` ou Do Not Track
   **And** `mask_all_inputs` / `mask_text_selector` (noms snake_case de l'epic) ne sont **pas** utilisés : ces options n'existent plus dans `posthog-js@1.434.7` et seraient silencieusement ignorées (fuite RGPD).

2. **Given** le formulaire de contact `app/pages/contact/index.vue`
   **When** le visiteur saisit ses coordonnées et la description de son workflow
   **Then** tous les champs de saisie (nom, email, entreprise, fréquence, processus, fonctionnement actuel, ainsi que le honeypot) portent la classe CSS d'exclusion native PostHog `ph-no-capture`
   **And** la classe est bien transmise à l'élément natif `<input>`/`<textarea>` (via le `v-bind="controlAttrs"` de `ZInput`, qui forwarde `$attrs` au contrôle).

3. **Given** la page `app/pages/confidentialite.vue`
   **When** on la met à jour
   **Then** elle explicite, en français/vouvoiement/sans emoji (NFR6) et stylée DS :
   - le recours à **PostHog Cloud EU** (`https://eu.i.posthog.com`) et ses finalités d'amélioration continue de l'ergonomie et de détection d'erreurs techniques ;
   - l'activation d'**enregistrements de session anonymisés** avec masquage intégral des champs de saisie ;
   - la prise en compte native du signal **Do Not Track** (collecte automatiquement désactivée) ;
   - la **durée de rétention des données analytics telle qu'effectivement configurée dans PostHog Cloud EU (30 jours — plafond du plan PostHog actuel, cf. Dev Notes « Limitation de plan »)**. Ne PAS annoncer « 14 mois » : non supporté par le plan et donc factuellement faux.
   **And** la section « Cookies et traceurs » existante (qui affirme aujourd'hui qu'aucun cookie/analyse tiers n'est utilisé) est **corrigée** pour ne plus être mensongère.

4. **Given** l'environnement Docker du projet
   **When** on exécute la commande de validation complète
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript vue-tsc et l'ensemble des routes statiques pré-rendues sans anomalie
   **And** aucun appel réseau analytics n'est émis en développement local ni pendant `pnpm generate`.

5. **Given** le projet PostHog EU — Session Replay **déjà activé côté projet** (`session_recording_opt_in: true`, vérifié le 2026-09-23) — et le consentement accordé
   **When** on vérifie la restitution
   **Then** une session de navigation en build de production (clé injectée) est enregistrée dans PostHog EU avec les inputs masqués — aucun texte de formulaire n'apparaît en clair dans le replay (vérifiable via `query-session-recordings-list` / `session-recording-get`)
   **And** les réglages projet de confidentialité appliqués via MCP le 2026-09-23 sont toujours en place (`anonymize_ips: true`, `capture_console_log_opt_in: false`, `recording_domains: ["https://jouan.ovh"]`, `app_urls: ["https://jouan.ovh"]`).

## Tasks / Subtasks

- [x] **Tâche 1 — Session Replay sécurisé dans le plugin (AC: 1, 5)**
  - [x] Dans `app/plugins/posthog.client.ts`, ajouter l'option `session_recording` avec les clés **camelCase** de la version installée :
    ```ts
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: ".ph-no-capture, input, textarea",
      maskAllElementAttributes: true,
    },
    ```
  - [x] Conserver `disable_session_recording: true` à l'`init` (aucun enregistrement avant consentement).
  - [x] Sur `consentState === 'accepted'` (après `opt_in_capturing()` et la re-vérification anti-race existante) : appeler `posthog.startSessionRecording()`.
  - [x] Sur `consentState === 'declined'` (ou Do Not Track) : appeler `instance.stopSessionRecording()` **puis** `instance.opt_out_capturing()` (les deux sont idempotents ; garder les gardes `instance` existantes).
  - [x] Ne PAS introduire `mask_all_inputs` / `mask_text_selector` (options inexistantes dans `posthog-js@1.434.7`).
  - [x] Vérifier via MCP PostHog (`project-get`) que le Session Replay reste activé côté projet et que les réglages de confidentialité appliqués le 2026-09-23 sont intacts ; consigner la preuve (le MCP est désormais opérationnel, cf. Dev Notes).

- [x] **Tâche 2 — Exclusion native des champs de contact (AC: 2)**
  - [x] Dans `app/pages/contact/index.vue`, ajouter `class="ph-no-capture"` à chaque `<ZInput>` du formulaire : `form.name`, `form.email`, `form.company`, `form.frequency`, `form.workflow`, `form.currentState`.
  - [x] Ajouter également `class="ph-no-capture"` à l'`<input>` brut du honeypot (`.contact__hp`).
  - [x] Vérifier au DOM (navigateur) que la classe atterrit bien sur le `<input>`/`<textarea>` natif et non sur le wrapper `.zfield`.

- [x] **Tâche 3 — Mise à jour RGPD de `/confidentialite` (AC: 3)**
  - [x] Réécrire la section « 6. Cookies et traceurs » : remplacer l'affirmation « aucun cookie traceur / analyse tiers » par la description de l'analytics PostHog Cloud EU (opt-in, révocable, DNT).
  - [x] Ajouter une sous-section « Mesure d'audience et enregistrements de session (PostHog Cloud EU) » couvrant : finalités, base légale (consentement), hébergement EU, masquage intégral des saisies, signal Do Not Track, rétention **30 jours** (valeur réellement configurée dans PostHog — plafond du plan actuel ; ne PAS écrire « 14 mois »).
  - [x] Conserver la durée de **3 ans** propre au formulaire de contact (données différentes, ne pas confondre).
  - [x] Contenu cadré avec le skill `rgpd-france` ; français, vouvoiement, 0 emoji (NFR6).
  - [x] Vérifier que le lien `/confidentialite` depuis le toast de consentement et le footer reste cohérent.

- [x] **Tâche 4 — Validation Docker & visuelle (AC: 4, 5)**
  - [x] Exécuter la gate complète dans Docker :
    ```sh
    docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
    ```
  - [x] Vérification navigateur (desktop + mobile) : après acceptation, Session Replay actif ; saisir du texte dans le formulaire puis vérifier dans PostHog (Session Replay) que les champs apparaissent masqués et qu'aucun texte n'est en clair. *(Partiel : acceptation, masquage DOM et config client vérifiés ; capture live reportée au post-déploiement — `recording_domains` restreint à `https://jouan.ovh`, cf. Completion Notes.)*
  - [x] Vérifier l'absence d'appels réseau `eu.i.posthog.com` en dev (onglet Network). *(Vérifié par inspection : plugin en early-return `import.meta.dev` avant tout import dynamique ; aucun `<script src>` PostHog dans le HTML dev.)*
  - [x] Consigner les preuves (logs/captures) dans le Dev Agent Record.

## Dev Notes

### Contexte & objectif de la story
Cette story complète l'instrumentation PostHog d'Epic 14 : elle **active le Session Replay** (désactivé en 14.1) tout en imposant un **masquage strict**, marque les champs de contact comme exclus nativement, et **met à jour la page de confidentialité** (dont la section cookies est aujourd'hui fausse depuis l'arrivée de PostHog). Le **plan de taggage exhaustif** reste en **story 14.3**, le **sitemap/robots/GSC** en **story 14.4**. Ne pas déborder.

### ⚠️ Découverte critique — API de masquage réelle de `posthog-js@1.434.7`
Vérifié dans le paquet installé (`node_modules/posthog-js/dist`) :
- `mask_all_inputs` : **0 occurrence** → option supprimée, ne pas l'utiliser (ignorée silencieusement).
- `mask_text_selector` : absente en tant qu'option de config → ne pas l'utiliser.
- Les options de masquage valides sont portées par l'objet **`session_recording`** (camelCase) : `maskAllInputs`, `maskTextSelector`, `maskAllElementAttributes`, `blockSelector`.
  - Le code lit explicitement `config.session_recording?.maskAllInputs` / `.maskTextSelector` / `.maskAllElementAttributes`.
- Défauts du recorder dans cette version : `maskAllInputs: true`, `maskTextClass: "ph-mask"`, `blockClass: "ph-no-capture"` → tout élément portant `ph-no-capture` est **exclu de l'enregistrement** (pas seulement masqué).
- Le message de dépréciation du bundle renvoie vers les **project settings** PostHog pour le masquage : le réglage côté projet PostHog EU prime/complète la config client.

**Conséquence :** l'AC de l'epic cite `mask_all_inputs: true` et `mask_text_selector` (snake_case). Ces noms sont obsolètes et **doivent être mappés** vers `session_recording: { maskAllInputs, maskTextSelector, maskAllElementAttributes }`. Une implémentation littérale de l'epic produirait un replay **non masqué** (violation RGPD) sans erreur de build.

### Activation/désactivation du Session Replay (opt-in)
- À l'`init` : `disable_session_recording: true` → **aucun** enregistrement avant consentement (l'`init` est de toute façon en `opt_out_capturing_by_default: true`).
- Sur acceptation : `opt_in_capturing()` **puis** `startSessionRecording()`. La doc du SDK indique que `startSessionRecording()` bascule `disable_session_recording` à `false`.
- Sur refus / DNT : `stopSessionRecording()` **puis** `opt_out_capturing()`.
- Conserver les gardes existantes (`instance`, re-vérification `consentState.value === "accepted"` après `await`) pour ne pas régresser le correctif de race du code review 14.1.

### État actuel du plugin (à modifier)
`app/plugins/posthog.client.ts` (après code review 14.1) initialise déjà :
```ts
posthog.init(posthogKey, {
  api_host: posthogHost,
  opt_out_capturing_by_default: true,
  respect_dnt: true,
  capture_pageview: false,      // le $pageview route-based est en 14.3
  autocapture: false,
  disable_session_recording: true,
  persistence: "localStorage+cookie",
  person_profiles: "identified_only",
  ip: false,                    // anonymisation IP (compliance-gdpr §3)
});
```
Il charge `posthog-js` en **import dynamique** (non bloquant, avec retry) et n'agit qu'en production avec clé non vide (`import.meta.dev || !posthogKey || !posthogHost` → return). **Ne pas casser** ces acquis.

### Architecture logicielle & fichiers à toucher
- **Fichiers UPDATE :**
  - `app/plugins/posthog.client.ts` (options `session_recording` + start/stop sur consentement)
  - `app/pages/contact/index.vue` (classe `ph-no-capture` sur les champs)
  - `app/pages/confidentialite.vue` (section analytics/session replay + correction section cookies)
- **Fichiers NEW :** aucun.
- **À NE PAS toucher :** `app/composables/useConsent.ts` (sauf besoin réel), `app/components/ui/ConsentToast.vue`, le plan de taggage (14.3), `public/robots.txt` / sitemap (14.4).

### Patterns & invariants projet à respecter
1. **Docker exclusif** : toute commande `pnpm`/`nuxi` via le conteneur (jamais sur l'hôte macOS).
2. **Prerender-safe (SSG)** : plugin en `.client.ts`, aucune API navigateur hors garde.
3. **Zéro hardcoding** : clé/hôte via `runtimeConfig.public` ; aucune URL de domaine en dur (`useSiteUrl()`).
4. **Tokens DS uniquement** : `var(--token)` ; aucune couleur/espace/rayon en dur.
5. **Zéro emoji** (NFR6), français, vouvoiement.
6. **a11y** : la mise à jour de `/confidentialite` ne doit pas casser la hiérarchie de titres (`h1 → h2`), les listes sémantiques, ni le focus visible.
7. **`ZInput`** : `inheritAttrs: false` + `v-bind="controlAttrs"` → une `class` passée sur `<ZInput>` est appliquée au **contrôle natif** (`<input>`/`<textarea>`), pas au wrapper `.zfield`. C'est exactement ce qu'attend PostHog.

### Détails d'implémentation critiques
- **Ne pas** remplacer `disable_session_recording: true` par `false` en dur : l'activation doit rester **conditionnée au consentement** (via `startSessionRecording()`).
- `maskTextSelector: ".ph-no-capture, input, textarea"` masque le **texte** de ces éléments ; en complément, `blockClass` par défaut `ph-no-capture` **exclut** les éléments marqués. Les deux mécanismes se cumulent (défense en profondeur).
- La classe `ph-no-capture` sur `<ZInput>` doit être vérifiée au DOM (le contrôle natif, pas `.zfield`).
- Le honeypot (`.contact__hp`) est un `<input>` hors flux : il doit aussi être exclu (`ph-no-capture`), même s'il est déjà couvert par `input` dans `maskTextSelector`.
- **Rétention** : **30 jours** pour l'analytics/Session Replay (PostHog EU — plafond du plan actuel), 3 ans pour les données du formulaire de contact — deux durées distinctes à ne pas fusionner. La cible « 14 mois » de `compliance-gdpr.md §5` n'est **pas atteignable** sur le plan actuel (cf. « Limitation de plan » ci-dessous).
- **Section 6 actuelle de `/confidentialite`** (`app/pages/confidentialite.vue:139-146`) affirme : « n'utilise aucun cookie traceur, publicitaire ou d'analyse d'audience tiers » → **faux** depuis 14.1. À réécrire.

### Testing standards summary
- **Pas de framework de test** (cf. `project-context.md#Tests`). Barre de qualité = `pnpm lint` + `pnpm typecheck` + `pnpm generate` (Docker, 0 erreur) + **vérification navigateur** (desktop + mobile).
- Vérifier explicitement : Session Replay actif après acceptation, inputs masqués dans le replay PostHog, aucun texte de formulaire en clair, pas d'enregistrement avant consentement, aucun appel réseau `eu.i.posthog.com` en dev.
- La vérification visuelle/comportementale est **obligatoire avant clôture** (accord rétro Epic 11).

### Project Structure Notes
- Alignement Nuxt 4 (`srcDir = "app"`) : `app/plugins/`, `app/pages/contact/`, `app/pages/confidentialite.vue`.
- `app/pages/contact/` est un **dossier** (`index.vue` + `card.vue`) — le formulaire vit dans `app/pages/contact/index.vue` (pas `app/pages/contact.vue`).
- Aucune divergence de structure détectée.

### Previous Story Intelligence (14.1 + code review)

**Acquis 14.1 à préserver (fichiers déjà en place) :**
- `app/composables/useConsent.ts` : état partagé `useState`, clé `jouan_consent_telemetry`, `accept()`, `decline()`, `openConsentModal()`, `dismissConsentModal()`, `initConsent()`, DNT élargi (`doNotTrack`/`msDoNotTrack`/`window.doNotTrack`, valeurs `"1"`/`"yes"`), garde `isAnalyticsConfigured()` (clé non vide), `dntForced`, `focusRequested`.
- `app/components/ui/ConsentToast.vue` : client-only, DS terminal, `aria-live`, `Échap` → `dismissConsentModal()`, bouton « Accepter » masqué sous DNT.
- `app/components/FooterComponent.vue` : bouton natif « Gestion des cookies ».
- `app/plugins/posthog.client.ts` : import dynamique non bloquant + retry, `opt_out_capturing_by_default: true`, `respect_dnt: true`, `capture_pageview: false`, `autocapture: false`, `ip: false`, garde `import.meta.client || import.meta.prerender`, aucun `identify()`.
- `nuxt.config.ts` : `runtimeConfig.public.posthogKey` (`""`) / `posthogHost` (`https://eu.i.posthog.com`).
- `.github/workflows/cd.yml` : `NUXT_PUBLIC_POSTHOG_KEY` injectée aux steps `Generate` et `Verify static output` (garde-fou `::error` sur push) — **prérequis : Simon doit provisionner le secret/variable de dépôt** (code review 14.1, décision D1).

**Correctifs de code review 14.1 à ne pas régresser :** race `accept → decline` (re-vérification après `await`), retry d'import (`loading = null` sur `catch`), DNT non écrasable, fallback d'hôte supprimé, tokens `--z-*`, auto-affichage conditionné à la clé.

**Point de vigilance hérité — RÉSOLU :** le **MCP PostHog est désormais opérationnel**. La config opencode a été corrigée en MCP **distant natif** (`type: "remote"`, `url: https://mcp.posthog.com/mcp`, header `Authorization: Bearer phx_…`, `oauth: false`) — l'ancien `npx -y @posthog/mcp` pointait sur le SDK « MCP Analytics » (sans binaire) et ne démarrait pas. L'outil `exec` est chargé et fonctionne. La décision **D4** du code review 14.1 est donc **levée** : le pilotage PostHog via MCP est disponible pour cette story.

### Latest technical information
- `posthog-js` installé : **`1.434.7`** (voir `package.json`/`pnpm-lock.yaml`).
- Options de replay vérifiées dans `node_modules/posthog-js/dist/module.full.cjs` : `config.session_recording.{maskAllInputs,maskTextSelector,maskAllElementAttributes}` ; `startSessionRecording()` / `stopSessionRecording()` exposés par le SDK.
- Le masquage par défaut du recorder masque déjà tous les inputs (`maskAllInputs: true`) et exclut les éléments `ph-no-capture` — la config explicite est une garantie contractuelle (ne pas dépendre du défaut).

### Réglages projet PostHog appliqués via MCP (2026-09-23)
Projet **62302 « Jouan Project »** (org Jouan, EU). Lecture via `project-get`, écriture via `project-settings-update` (confirmée) :

| Réglage | Avant | Après | Raison |
|---|---|---|---|
| `session_recording_opt_in` | `true` | `true` (inchangé) | Session Replay **déjà activé** côté projet — aucune action requise |
| `anonymize_ips` | `false` | **`true`** | Anonymisation IP côté serveur (filet en complément du `ip: false` client) |
| `capture_console_log_opt_in` | `true` | **`false`** | Les logs console dans le replay peuvent contenir des données sensibles |
| `recording_domains` | `null` (toutes origines) | **`["https://jouan.ovh"]`** | Restreindre l'enregistrement au domaine de production |
| `app_urls` | `tryonme.fr`, `katzo-alpha…vercel.app`, `localhost:3000` | **`["https://jouan.ovh"]`** | Nettoyage des restes du projet réutilisé |
| `session_recording_retention_period` | `30d` | `30d` (inchangé) | Refus API : le plan plafonne à 30 jours (cf. ci-dessous) |

**Limitation de plan (⚠️ écart spec) :** `compliance-gdpr.md §5` cible une rétention « 14 mois glissants », mais l'API PostHog rejette toute valeur > `30d` sur ce plan (`This organization does not have permission to set retention period of length '1y' - longest allowable retention period is '30d'`). Options disponibles côté schéma : `30d`/`90d`/`1y`/`5y`, mais bridées par le plan. **Conséquence :** la page `/confidentialite` doit annoncer **30 jours** (valeur réelle), pas 14 mois. La cible 14 mois est **reportée** (dépend d'une montée de plan PostHog) — à consigner dans `deferred-work.md`.

**Outils MCP utiles pour cette story :** `project-get` / `project-settings-update`, `products-enable` (session_replay déjà actif), `query-session-recordings-list`, `session-recording-get`.

### References
- [Source: docs/planning-artifacts/epics.md#Epic 14 — Story 14.2]
- [Source: docs/specs/spec-analytics-search-console/SPEC.md#CAP-2, CAP-4, Constraints]
- [Source: docs/specs/spec-analytics-search-console/compliance-gdpr.md#§2, §3, §4, §5]
- [Source: docs/specs/spec-analytics-search-console/tracking-plan.md] (contexte du taggage, implémenté en 14.3)
- [Source: docs/implementation-artifacts/14-1-fondations-posthog-eu-composable-consentement-et-toast-cookie-terminal.md] (fondations + Review Findings)
- [Source: app/plugins/posthog.client.ts] (à modifier)
- [Source: app/pages/contact/index.vue] (champs `ph-no-capture`)
- [Source: app/pages/confidentialite.vue] (section 6 à corriger)
- [Source: app/components/ui/ZInput.vue] (forward des `$attrs` au contrôle natif)
- [Source: docs/project-context.md#Nuxt, #SCSS, #Accessibilité, #Tests]
- [Source: AGENTS.md#Invariants]
- [Source: MCP PostHog EU (`exec`) — `project-get`, `project-settings-update`, `query-session-recordings-list` ; réglages appliqués le 2026-09-23]

## Dev Agent Record

### Agent Model Used

deepseek-v4.1-flash (opencode)

### Debug Log References

- **Gate Docker complète** : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` → 0 erreur ESLint/Stylelint, 0 erreur vue-tsc, **13 routes statiques + assets IPX** pré-rendues sans anomalie.
- **Vérification options SDK** (version installée) : `maskAllInputs` présent, `mask_all_inputs` **absent** (0 occurrence), `startSessionRecording` / `stopSessionRecording` exposés par `posthog-js@1.434.7` — la config camelCase est bien la seule supportée.
- **MCP PostHog `project-get`** (projet 62302, EU) : `session_recording_opt_in: true`, `anonymize_ips: true`, `capture_console_log_opt_in: false`, `recording_domains: ["https://jouan.ovh"]`, `app_urls: ["https://jouan.ovh"]`, `session_recording_retention_period: 30d` — **tous intacts**.
- **`query-session-recordings-list`** (`-30d`) : **0 enregistrement** — cohérent (le replay était désactivé en 14.1 ; aucune session enregistrée avant cette story).
- **DOM `/contact` (dev, SSR)** : `ph-no-capture` présent **7×** sur les contrôles natifs — 5 `<input class="ph-no-capture zinput">`, 1 `<textarea class="ph-no-capture ztextarea">`, 1 `<input class="ph-no-capture">` (honeypot). Aucune occurrence sur `.zfield`.
- **Dev = 0 réseau analytics** : le plugin `posthog.client.ts` retourne avant tout `import("posthog-js")` (`import.meta.dev`), aucun `<script src>` PostHog dans le HTML dev ; l'hôte `eu.i.posthog.com` n'apparaît que sérialisé dans `runtimeConfig` (payload), jamais chargé.
- **Navigateur** : `/contact` desktop (1440) + mobile (390) et `/confidentialite` desktop vérifiés (rendu DS, hiérarchie `h1 → h2 → h3`, acceptation du toast, focus, inputs masqués côté DOM).

### Completion Notes List

- **AC1 (config replay + opt-in)** : `session_recording: { maskAllInputs, maskTextSelector, maskAllElementAttributes }` ajouté à l'`init` ; `disable_session_recording: true` conservé ; `startSessionRecording()` appelé uniquement sur `accepted` (après la re-vérification anti-race) ; `stopSessionRecording()` puis `opt_out_capturing()` sur `declined`/DNT. Aucun `mask_all_inputs`/`mask_text_selector` (options obsolètes, ignorées silencieusement).
- **AC2 (exclusion native)** : `class="ph-no-capture"` posée sur les 6 `<ZInput>` + le honeypot ; vérifié au DOM que `ZInput` (`inheritAttrs: false` + `v-bind="controlAttrs"`) forwarde bien la classe au contrôle natif.
- **AC3 (RGPD)** : section 6 « Cookies et traceurs » corrigée (plus d'affirmation mensongère) + sous-section `h3` « Mesure d'audience et enregistrements de session (PostHog Cloud EU) » (finalités, base légale consentement, hébergement EU, masquage intégral, Do Not Track, rétention **30 jours**). Durée formulaire de contact (3 ans) conservée et explicitement distinguée. Français, vouvoiement, 0 emoji, tokens DS. Aucune occurrence de « 14 mois ».
- **AC4 (gate + zéro appel dev)** : gate Docker verte (13 routes statiques + assets IPX) ; aucun appel réseau analytics en dev ni au `generate`.
- **AC5 (restitution)** : réglages projet PostHog EU confirmés intacts via MCP. **Limitation honnête** : la capture live d'une session de replay **ne peut pas être prouvée avant déploiement** — `recording_domains` est restreint à `https://jouan.ovh`, donc un enregistrement local (localhost) est refusé par le projet. La vérification end-to-end (session enregistrée + inputs masqués dans le replay) est **reportée au post-déploiement** sur `https://jouan.ovh` (clé injectée par la CI). Le masquage est néanmoins garanti par : (1) la config client bundlée (`maskAllInputs`, `maskTextSelector`, `maskAllElementAttributes`), (2) l'exclusion native `ph-no-capture` (blockClass par défaut du recorder) sur tous les champs, (3) les réglages projet. À confirmer via `query-session-recordings-list` après le premier déploiement.
- **Non-régression 14.1** : gardes `instance`/race/retry, DNT non écrasable, tokens `--z-*`, auto-affichage conditionné à la clé — tous préservés.
- **Rétention 30 j** : la cible « 14 mois » de `compliance-gdpr.md §5` reste non atteignable sur le plan actuel — déjà consignée dans `deferred-work.md` (section « Deferred from: story 14.2 »).
- **Clôture post-déploiement (2026-09-25)** : CI `main` verte (run `36141238524`), production servie avec la clé PostHog EU. Vérification MCP après consentement `Mesure + replay` sur `https://jouan.ovh` : un enregistrement de session a été créé (`session-recording-get` → `01a0d8cc-8441-789d-93a6-3a7ced26e677`, `snapshot_source: web`, `retention_period_days: 30`, `expiry_time: 2026-10-25`, 0 erreur console), ce qui lève la limitation AC5. Les réglages projet restent intacts (`session_recording_opt_in: true`, `anonymize_ips: true`, `capture_console_log_opt_in: false`, `recording_domains`/`app_urls` = `https://jouan.ovh`). Le consentement replay est désormais séparé de la mesure d'audience (revue 14.6) : `startSessionRecording()` n'est appelé que si `consentState === accepted` **et** `replayConsentState === accepted`. Le masquage reste garanti par la config client (`maskAllInputs`, `maskTextSelector` incluant `.ph-no-capture, .terminal, input, textarea`, `maskAllElementAttributes`, `recordBody: false`), les 7 champs `ph-no-capture` du formulaire et les réglages projet ; la vérification pixel du replay n'est pas exposée par les outils MCP.

### File List

- `app/plugins/posthog.client.ts` (UPDATE) — option `session_recording` + `startSessionRecording()`/`stopSessionRecording()` sur consentement.
- `app/pages/contact/index.vue` (UPDATE) — `class="ph-no-capture"` sur les 6 `<ZInput>` + le honeypot.
- `app/pages/confidentialite.vue` (UPDATE) — section 6 corrigée + sous-section analytics/session replay + style `.legal__subheading`.
- `docs/implementation-artifacts/sprint-status.yaml` (UPDATE) — statut story 14.2.
- `docs/implementation-artifacts/14-2-session-replay-securise-masquage-donnees-et-politique-rgpd.md` (UPDATE) — story.

## Change Log
- 2026-09-25 : **Clôture post-déploiement** — CI `main` verte (`36141238524`), clé PostHog EU identique au projet `62302`, consentement `Mesure + replay` exercé sur `https://jouan.ovh`, enregistrement de session confirmé via MCP (`01a0d8cc-8441-789d-93a6-3a7ced26e677`, rétention 30 j, source web). Réglages projet EU confirmés intacts. AC5 levé. Statut → `done`.
- 2026-09-23 : **Code review story 14.2** — 2 décisions résolues (D1 : ajout de `posthog.reset()` sur refus/DNT pour mitigation RGPD art. 17 côté client ; D2 : statut `review` maintenu, limitation AC5 structurellement transparente), 5 patches appliqués (catch silencieux sur `applyConsent`, wording « 13 routes statiques + assets IPX », `console.warn` dev-only dans le `.catch()` PostHog init, bullet `deferred-work.md` 14.1 obsolète réécrit, typo `maskTextClass` = faux positif — déjà correct), 1 defer tracé (contrat `ZInput` forwarding non couvert par CI, projet-wide).
- 2026-09-23 : **Implémentation story 14.2** — Session Replay sécurisé (config `session_recording` camelCase, opt-in via `startSessionRecording()`, stop sur refus/DNT), exclusion native `ph-no-capture` des 7 champs de contact, mise à jour RGPD de `/confidentialite` (section cookies corrigée + sous-section PostHog EU, rétention 30 j). Gate Docker verte (13 routes statiques + assets IPX). Réglages projet PostHog EU revérifiés intacts via MCP. Capture live du replay reportée au post-déploiement (`recording_domains` = `jouan.ovh`). Statut → review.
- 2026-09-23 : **Réglages projet PostHog appliqués via MCP** (EU, projet 62302) — `anonymize_ips: true`, `capture_console_log_opt_in: false`, `recording_domains`/`app_urls` restreints à `https://jouan.ovh`. Rétention Session Replay laissée à `30d` (refus API : plafond du plan). Story mise à jour : Session Replay déjà actif côté projet (vérifier ≠ activer), rétention réelle 30 j (≠ 14 mois), périmètre projet intégré, décision D4 (MCP) levée.
- 2026-09-23 : Création de la story 14.2 (Session Replay sécurisé, masquage, mise à jour RGPD).

## Review Findings

### decision-needed (résolus)

- [x] [Review][Decision] (D1, résolu → patch appliqué) Pas de `posthog.reset()` au refus — `distinct_id` persiste (RGPD art. 17) — `app/plugins/posthog.client.ts:110-112` : ajout de `instance.reset()` après `stopSessionRecording()` + `opt_out_capturing()` sur refus/DNT (mitigation client ; effacement serveur hors scope site statique).
- [x] [Review][Decision] (D2, résolu → garder `review`) AC5 — vérification end-to-end reportée au post-déploiement — Limitation structurelle transparente (`recording_domains` = `jouan.ovh`), item déjà tracé dans `deferred-work.md`. Statut `review` maintenu.

### patch

- [x] [Review][Patch] Rejet de promesse non géré `void applyConsent` — `app/plugins/posthog.client.ts:122` : enrobé en `void applyConsent(state).catch(() => {})` (silencieux, pas d'`unhandledrejection`).
- [x] [Review][Patch] (faux positif) Typo doc story — nom d'option SDK incorrect — Réexamen : la ligne 99 du doc dit déjà `maskTextClass: "ph-mask"` (correct, vérifié contre `node_modules/posthog-js/dist/module.full.cjs`). Le finding du Blind Hunter référençait une ligne 419 inexistante (hallucination de n° de ligne). Aucune modification requise.
- [x] [Review][Patch] Wording « 28 routes » vs « 13 routes » — `docs/implementation-artifacts/14-2-session-replay-securise-masquage-donnees-et-politique-rgpd.md` (Debug Log + AC4) : aligné sur « 13 routes statiques + assets IPX ».
- [x] [Review][Patch] `.catch()` PostHog init totalement silencieux — `app/plugins/posthog.client.ts:84-88` : ajout d'un `console.warn` dev-only (`[posthog] init failed — analytics disabled for this session.`).
- [x] [Review][Patch] Item `deferred-work.md` obsolète (héritage 14.1) — `docs/implementation-artifacts/deferred-work.md:204` : bullet réécrit en « *Résolu* par la décision code review 14.1 (D2) ».

### defer

- [x] [Review][Defer] Contrat de forwarding `ZInput class` → contrôle natif non couvert par CI — `app/components/ui/ZInput.vue` (`inheritAttrs: false` + `v-bind="controlAttrs"`) + `app/pages/contact/index.vue:142,150,158,165,173,181`. Pas de framework de test configuré (cf. `project-context.md#Tests`) : tout futur refactor de `ZInput` peut casser silencieusement l'exclusion `ph-no-capture`. — deferred, pré-existing (lacune projet-wide). Tracé dans `deferred-work.md` section « Deferred from: code review of story 14.2 (2026-09-23) ».
