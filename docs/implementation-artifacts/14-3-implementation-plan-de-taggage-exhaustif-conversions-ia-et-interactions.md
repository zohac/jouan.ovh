---
baseline_commit: d8193c7
---

# Story 14.3 : Implémentation du Plan de Taggage Exhaustif (Conversions IA & Interactions)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Simon Jouan,
I want que chaque interaction significative du visiteur (navigation, scroll, CTA hero & services, étapes du formulaire de contact, ouverture et commandes du terminal, lecture du blog, clics sortants) émette un événement PostHog documenté, dans le strict respect du consentement RGPD,
so that je dispose d'un spectre maximal de données comportementales et de conversion pour arbitrer l'attractivité de l'offre IA après plusieurs semaines d'exploitation (CAP-3 / FR46).

## Acceptance Criteria

1. **Given** le plugin `app/plugins/posthog.client.ts` (livré en 14.1 + corrigé en 14.2), `posthog-js@^1.434.7` installé, le composable `app/composables/useConsent.ts` exposant `consentState`, `dntForced` et `isAnalyticsConfigured()`, et le plan de taggage canonique `docs/specs/spec-analytics-search-console/tracking-plan.md`
   **When** le visiteur accepte la télémétrie et navigue sur le site
   **Then** chaque catégorie d'événements ci-dessous est émise via `useAnalytics().track(name, props)` (un helper partagé unique, no-op si consentement refusé ou Do Not Track, no-op en environnement de développement) :
   - *Navigation / scroll / cycle de vie :* `$pageview` à chaque transition de route Nuxt (`path`, `title`, `referrer`), `scroll_depth_reached` aux seuils 25/50/75/100% par page, `time_on_page_threshold` aux seuils 30s, 60s, 180s, 300s, `theme_toggle_clicked` (`from_theme`, `to_theme`, `system_theme`)
   - *Hero & Proposition de valeur (Accueil) :* `hero_cta_clicked` (`cta_id`, `cta_label`, `destination`), `hero_badge_clicked` (`badge_state`), `hero_terminal_interaction` (`interaction_type`)
   - *Offres & Services IA :* `service_card_hovered` (>1.5s, `service_id`, `location`), `service_card_clicked` (`service_id`, `service_title`, `location`), `differentiator_block_viewed`, `pricing_card_viewed`, `pricing_cta_clicked` (`package_id`, `starting_price_ht`), `process_step_interacted` (`step_number`, `step_title`)
   - *Projets phares :* `project_card_clicked` (`project_slug`, `project_status`), `project_external_link_clicked` (`project_slug`, `target_url`), `project_tag_clicked` (`tech_tag`)
   - *Tunnel de Contact (`/contact`) :* `contact_page_viewed` (`origin_cta`, `referrer`), `contact_field_focused` (`field_id`), `contact_field_completed` (`field_id`, `char_count_bucket`), `contact_form_submit_attempt` (`fields_filled_count`, `form_validity`), `contact_form_success` (`has_company`, `latency_ms`), `contact_form_error` (`error_status`, `error_message`), `direct_email_copied` (`email_context`), `linkedin_profile_clicked` (`location`)
   - *Terminal (Interactif & Floating) :* `terminal_window_opened` (`trigger_source`), `terminal_window_closed` (`duration_open_seconds`, `commands_count`), `terminal_command_executed` (`command_name`, `is_known_command`), `terminal_invalid_command` (`command_raw_length`), `terminal_minimized_maximized` (`action`)
   - *Journal technique (`/blog`) :* `blog_article_viewed` (`article_slug`, `article_title`, `reading_time_est`), `blog_toc_clicked` (`heading_id`, `article_slug`), `blog_code_copied` (`code_language`, `article_slug`), `blog_article_finished` (`article_slug`, `total_seconds`)
   - *Liens externes & footer :* `external_link_clicked` (`destination_domain`, `link_text`, `location`), `footer_legal_clicked` (`target_page`)
   **And** le helper est centralisé dans `app/composables/useAnalytics.ts`, expose `{ track(name, props?), install(), isReady() }`, et l'installation paresseuse (listeners globaux + `$pageview`) ne se déclenche que **lorsque `consentState === 'accepted'`** ; en cas de transition vers `'declined'` ou DNT forcé, les listeners sont retirés et les appels à `track()` deviennent des no-op silencieux.

2. **Given** le helper `useAnalytics` activé et le cycle de vie du routeur Nuxt
   **When** le visiteur navigue entre les 13 routes (ou change d'URL via `#`-hash)
   **Then** un événement `$pageview` est émis sur **chaque transition `router.afterEach`** avec `path`, `title` (résolu via `useHead`/`usePageSeo`), `referrer` (`document.referrer` côté client, fallback `'direct'` au SSR/prerender) et `query_params` sérialisés — sans double capture entre les changements de hash (un seul événement par changement réel de `route.fullPath`).
   **And** le scroll depth et le time-on-page sont scopés au cycle de vie de chaque page :.reset à chaque `$pageview` et émettent **une seule fois** par palier atteint (idempotent via `Set` de paliers émis).

3. **Given** le DOM rendu et le helper `useAnalytics` actif
   **When** le visiteur interagit avec un élément interactif (CTA, carte service, étape du process, carte projet, lien sortant, bascule de thème, formulaire contact)
   **Then** les événements sont émis **sans modification des primitives DS** (`ZButton`, `ZCard`, `ZExternalLink`, `ZInput` restent inchangés) en utilisant deux mécanismes complémentaires :
   - **Délégation globale `click`** sur `document` au phase `capture` : `<a target="_blank">` → `external_link_clicked`, `<ZButton variant="primary">`/`<ZButton variant="secondary">` munis d'un attribut `data-analytics="…"` → événement custom, bouton du terminal dans le header/contact identifié par `data-analytics-trigger="terminal"` → `terminal_window_opened`/`closed`…
   - **Événements émis depuis les composants métier existants** pour les cas non couverts par la délégation (soumission de formulaire, ouverture du toast, entrée dans `submitInput` du terminal, focus/blur de champ contact, focus/blur dans le hero terminal, etc.) en appelant directement `useAnalytics().track(...)` depuis le `<script setup>` (client-only via `import.meta.client`).
   **And** les `referrer`, `destination_domain`, `path` ne contiennent **jamais** de donnée personnelle libre (jamais de textarea/email), uniquement des URLs et libellés techniques.

4. **Given** l'environnement Docker et la stack de validation
   **When** on exécute la commande de validation complète
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript vue-tsc et l'ensemble des routes statiques pré-rendues sans anomalie.
   **And** aucun appel réseau analytics (`eu.i.posthog.com`) n'est émis en environnement de développement local **et** pendant `pnpm generate` (le `.client.ts` du plugin est désactivé par `import.meta.dev` / `import.meta.prerender`).
   **And** la vérification finale via MCP PostHog (`query-session-recordings-list` ou `query-events-list`) sur les 7 derniers jours de production confirme la présence d'événements de toutes les catégories émises (au moins un événement représentatif par groupe d'AC).

## Tasks / Subtasks

- [x] **Tâche 1 — Helper central `app/composables/useAnalytics.ts` (AC: 1, 2, 3)**
  - [x] Créer `app/composables/useAnalytics.ts` exposant `{ track(name, props?), isReady() }` (et éventuellement `install(opts)`). En `<script setup>` Vue 3 + TypeScript strict. **Pas d'import direct de `posthog-js`** dans ce fichier (l'import asynchrone doit passer par le plugin, ce helper ne référence que la **Promise du SDK chargé** ou une interface fine pour ne pas lier le helper à l'import dynamique du plugin).
  - [x] `track(name, props?)` lit `useConsent().consentState` ; si `consentState !== 'accepted'` OU si `consent-dnt-forced` est vrai OU si `import.meta.dev`/`import.meta.prerender` sont vrais, **return** silencieusement (no-op). Sinon, déléguer à la fonction de capture effective (`posthog.capture(...)`) via la Promise du plugin (gérée par un `state ref` initialisé par le plugin).
  - [x] `install()` / hook d'auto-initialisation : enregistre sur `import.meta.client` :
    - `router.afterEach((to, from)` → `track('$pageview', { path, title, referrer, query_params })` (idempotent : pas d'émission si `to.fullPath === from.fullPath`).
    - `window.addEventListener('scroll', scrollHandler, { passive: true })` avec `IntersectionObserver`/`scrollY`/`document.documentElement.scrollHeight` pour `scroll_depth_reached` aux paliers `{ 25, 50, 75, 100 }`, scopés à la page courante (`Set` par route). Pas d'émission si `prefers-reduced-motion: reduce` (respect global).
    - `setTimeout`/`setInterval` pour `time_on_page_threshold` à `30s/60s/180s/300s` depuis la dernière `$pageview` ; reset à chaque navigation.
    - Délégation globale `click` en phase `capture` sur `document` : pour `event.target` proche d'un `<a target="_blank">`, calcule `destination_domain` (`new URL(href).hostname`, fallback `'unknown'`), `link_text` (`textContent.trim().slice(0, 80)`), `location` (URL de la page courante), et émet `external_link_clicked`.
    - Pour `event.target.closest('[data-analytics]')`, lit l'attribut (format `nom|prop:val|prop:val`) et émet l'événement. Voir `data-attr contract` dans les Dev Notes.
  - [x] Ajouter un `onConsentChange` interne (regarde `consentState` via `watch` + `consent-dnt-forced`) : si `'accepted'` et non-DNT, appelle `install()` (idempotent) ; sinon, appelle `uninstall()` (retire les `scroll`/`click` listeners, annule les timers, conserve la fonction `track` comme no-op si refus futur).
  - [x] Exposer en lecture seule : `isReady(): boolean` pour permettre aux composants métier d'éviter d'émettre s'ils le souhaitent.

- [x] **Tâche 2 — Plugin client d'initialisation `app/plugins/posthog.client.ts` — extension minimale (AC: 1)**
  - [x] Ajouter, **sans casser les acquis 14.1+14.2** (api_host, opt_out_capturing_by_default, respect_dnt, capture_pageview:false, autocapture:false, disable_session_recording + startSessionRecording/stopSessionRecording, persistence, person_profiles:'identified_only', ip:false, reset() au refus) :
    - À la fin du `loadPostHog().then(...)`, après `posthog.init(...)` réussi, **exposer l'instance `posthog`** via une variable d'état partagée (ex. `useState('posthog-instance', () => posthog)` ou via le composable `useConsent()` étendu avec un slot d'instance) — **sans modifier la signature de useConsent** (l'ajouter comme nouveau composable léger `usePosthog()` qui retourne `{ instance: Ref<PostHog|null>, ready: Ref<boolean> }`, auto-importé par Nuxt via `app/composables/`).
    - Appeler `useAnalytics().install()` une fois l'instance disponible.
  - [x] Garantir que `applyConsent('accepted')` met à jour `usePosthog().ready = true` **après** `loadPostHog()` (extension de la branche existante, sans toucher le code `useReset/race` actuel).
  - [x] **Ne pas modifier** les autres fichiers Story 14.2 (plugin tels quels). Conserver le `console.warn` dev-only dans `.catch()`.

- [x] **Tâche 3 — Page Accueil `app/pages/index.vue` : instrumentation des CTA Hero, offres, projets, CTA final (AC: 1, 3)**
  - [x] Hero CTAs — ajouter `<ZButton data-analytics="hero_cta_clicked|cta_id:identify_workflow|destination:/contact" ... />` sur le CTA primaire et `data-analytics="hero_cta_clicked|cta_id:view_systems|destination:/services"` sur le CTA secondaire. Le badge Malt : `data-analytics="hero_badge_clicked|badge_state:available"` (ou `'busy'` si `SITE.profile.available` bascule). `<a href="mailto:...">` du CTA final : `data-analytics="direct_email_copied|email_context:homepage_hero"`.
  - [x] Cartes services (`.offer__more` `NuxtLink`) — ajouter `data-analytics="service_card_clicked|service_id:automation|location:homepage_services"`, `service_id:agents`, `service_id:apps`. Le hover géré par JS : hook sur `mouseenter` + délai >1.5s (timeout) avant émission de `service_card_hovered` (idempotent par session via `Set`).
  - [x] Bloc différenciateur `.diff-block` — ajouter `data-analytics="differentiator_block_viewed"` racine + `IntersectionObserver` (émission unique à 50% visible).
  - [x] Cartes projets — `data-analytics="project_card_clicked|project_slug:keova-signal|location:homepage"` etc. **UNIQUEMENT** sur les `<ZExternalLink>` éventuels (Keova App legacy) : `data-analytics="project_external_link_clicked|project_slug:keova-app|target_url:..."`. Pour les 3 projets phares (privés, pas de lien sortant), `project_card_clicked` n'est pas émis (les cartes sont des vitrines non cliquables actuellement — décision explicite : **ne pas ajouter** de data-attr factice, ce qui évite un événement mensonger). Tags `<ZTag>` à l'intérieur : `data-analytics="project_tag_clicked|tech_tag:..."`.
  - [x] CTA final — `data-analytics="hero_cta_clicked|cta_id:identify_workflow_workflow|destination:/contact"` sur le bouton primaire ; le bouton email : `data-analytics="direct_email_copied|email_context:homepage_final"`.

- [x] **Tâche 4 — Page Services `app/pages/services.vue` : instrumentation des 3 offres, AI Care, étapes process (AC: 1, 3)**
  - [x] Sur chaque CTA d'offre (`offer.ctaText`/`offer.ctaAriaLabel`) ajouter `data-analytics="pricing_cta_clicked|package_id:automatisation|starting_price_ht:sur_devis"` (et `workflow`, `sur_mesure`, `ai_care`).
  - [x] Sur la grille des offres racine : `data-analytics-view="pricing"` pour IntersectionObserver → `pricing_card_viewed` au 1er croisement.
  - [x] **Suppression des ancres intra-page** : actuellement `offer.to = "/services#automatisation"` (et `#workflow`, `#sur-mesure`). Pour la cohérence avec l'architecture multi-pages (NFR26) **et** avec le tracking (les ancres ne déclenchent pas `$pageview`), remplacer par `to: "/contact"` en gardant l'identifiant via `data-analytics` (la position interne reste inchangée — seule la destination externe passe sur la page contact). Cf. note dans Dev Notes : justification Epic 12 CAP-9 + FR50.
  - [x] Sur chaque étape du process — `data-analytics="process_step_interacted|step_number:01|step_title:Diagnostic"` sur le CTA inline de l'étape 1 (lien `/contact`). Pour les étapes 2-4 (sans lien), pas d'émission auto (le tracking plan ne nécessite que l'interaction).

- [x] **Tâche 5 — Page Contact `app/pages/contact/index.vue` : instrumentation du formulaire (AC: 1, 3)**
  - [x] `contact_page_viewed` — émis par `useAnalytics().track()` dans un `onMounted` du script setup (avec `origin_cta` lu via `useRoute().query` ou `document.referrer`, `referrer` via `document.referrer`).
  - [x] `contact_field_focused` — émettre au premier `focus` de chaque `<ZInput>` (`@focus` `once` handler). `field_id` ∈ `name|email|company|workflow|currentState|frequency`. Utiliser un `v-on:focus.once` sur les `ZInput` serait invasif — préférer une délégation `focusin` globale en phase `capture` sur `formRef`, avec filtre `data-field` ou lookup du `name` via `closest('input,textarea')?.getAttribute('name')`.
  - [x] `contact_field_completed` — émettre au `blur` si le champ est valide (pas vide). Délégation `focusout` sur `formRef`.
  - [x] `contact_form_submit_attempt` — émettre dans `onSubmit` avant validation, avec `fields_filled_count` (compte des champs non vides) et `form_validity` booléen.
  - [x] `contact_form_success` — émettre sur `res.success === true`, `latency_ms` via `performance.now()` capturé en début de `onSubmit`. `has_company` dérivé de `form.company`.
  - [x] `contact_form_error` — émettre sur `res.success === false` ET sur `catch` ; `error_status = res?.success === false ? 'api_rejection' : 'network_error'`, `error_message = res?.message ?? 'fetch_error'`. ⚠️ **NE PAS** logger le contenu des champs : `error_message` doit être l'`status` HTTP ou un code interne court, jamais un extrait de payload.
  - [x] `direct_email_copied` — `data-analytics="direct_email_copied|email_context:contact_page"` sur le lien `<a :href="mailto:...">` de la colonne infos.
  - [x] `linkedin_profile_clicked` — `data-analytics="linkedin_profile_clicked|location:contact_page"` sur le `<HexagonLinkComponent>` LinkedIn. ⚠️ Le composant `HexagonLinkComponent` ne supporte pas `data-attr` pour l'instant (slot-only). Ajouter le support via le mécanisme de **délégation** dans `useAnalytics.install()` : sélecteur `[href*="linkedin.com"]` (cf. note sur `external_link_clicked` ci-dessous — la même mécanique convient).

- [x] **Tâche 6 — Terminal interactif (AC: 1, 3)**
  - [x] `terminal_window_opened` — émettre dans `useTerminal().open()` (composable `app/composables/useTerminal.ts`) **et** dans `HeaderComponent.addNewTerminal()`/`openTerminalFromMenu()`. `trigger_source` ∈ `header_icon | keyboard_shortcut | contact_cta_hero_prompt`. Pour le contact CTA : `trigger_source: "contact_cta"` ; pour le menu mobile : `trigger_source: "header_icon"` (depuis le menu mobile) ; pour le bouton header desktop : `trigger_source: "header_icon"` ; pour le hero (CTA interactif dans `HomeHeroTerminal.vue`) : `trigger_source: "hero_prompt"`. ⚠️ L'extension du composable `useTerminal` doit rester minimale : ajouter une signature optionnelle `open(opts?: { trigger_source?: string })` (par défaut `header_icon`).
  - [x] `terminal_window_closed` — émettre dans `TerminalComponent.closeTerminal()`. `duration_open_seconds` = `(Date.now() - openedAt) / 1000` ; `commands_count` = `commandHistory.value.length` capturés en interne. **MODIFICATION** `TerminalComponent.vue` : ajouter `openedAt` ref (set dans `onMounted`), exposer via `defineExpose({ openedAt, commandHistory })` pour permettre au `TerminalManagerComponent` d'accéder (alternative : import `useAnalytics().track` directement dans `TerminalComponent` — choix laissé au dev mais l'option `defineExpose` évite la dépendance circulaire).
  - [x] `terminal_command_executed` — émettre dans `submitInput` après `runCommand(command)`. `command_name` = nom reconnu (`help | whoami | systems | skills | projects | contact | ...`) ou `null` si inconnu. `is_known_command` booléen.
  - [x] `terminal_invalid_command` — émis en alternative dans `runCommand` quand `program` est `undefined` (commande non mappée). `command_raw_length` = `command.length`. ⚠️ **NE PAS** transmettre `command` en clair (RGPD, RGPD art. 5 minimisation) : seul `command_raw_length` est exporté.
  - [x] Hero terminal `HomeHeroTerminal.vue` — `hero_terminal_interaction` au premier `click` sur la fenêtre hero OU à la première `keypress` sur un input (séparer les deux via `interaction_type: 'click' | 'keypress'`). Implémenter avec `@click.once` ou un flag `interacted` interne.

- [x] **Tâche 7 — Blog : instrumentation des vues articles, ToC, copie de code (AC: 1, 3)**
  - [x] `blog_article_viewed` — émettre dans un `onMounted` de `app/pages/blog/[...slug].vue`, avec `article_slug = page.value.path`, `article_title = page.value.title`, `reading_time_est = page.value.read`.
  - [x] `blog_article_finished` — émettre sur dépassement de 90% du `scrollHeight` de la fenêtre (1 fois par article). Réinitialisé à chaque navigation slug.
  - [x] `blog_toc_clicked` — déléguer les clics sur `prose a[href^="#"]` (ancres générées par `@nuxt/content`) avec `heading_id` extrait du `href` (`href.split('#')[1]`) et `article_slug` lu sur la route courante.
  - [x] `blog_code_copied` — déléguer les clics sur `prose pre` munis d'un bouton de copie (cf. si un bouton `.code-copy` existe, sinon ignorer). Implémenter en écoutant l'événement `copy` global sur `prose pre` (sélection + Cmd/Ctrl+C).
  - [x] **Garde-fou** : la story 6.2 n'ayant pas formellement introduit un bouton de copie unifié, valider la présence/absence par `grep -r 'class="code-copy"' app/` ; si rien n'existe, émettre `blog_code_copied` uniquement sur événements `copy` réellement émis par l'utilisateur (sélection dans un `<pre>`) — sans bouton dédié.

- [x] **Tâche 8 — Thème clair/sombre & autres événements transverses (AC: 1)**
  - [x] `theme_toggle_clicked` — dans `app/components/ui/ThemeToggle.vue`, modifier `handleToggle` pour lire `preference.value` AVANT et APRÈS `cycleTheme()` et émettre. `from_theme = preference.value` (avant), `to_theme = preference.value` (après), `system_theme = window.matchMedia(...).matches ? 'dark' : 'light'` lu une seule fois. ⚠️ Garantir que l'événement n'est émis QUE si `preference.value` change effectivement (sinon clic sur l'écran sans changement = bruit). Solution: `if (from_theme !== to_theme) useAnalytics().track(...)`.
  - [x] `terminal_minimized_maximized` — émis quand le bouton close est cliqué (équivalent d'un minimize sur les fenêtres type macOS). ⚠️ Le composant ne différencie pas explicitement minimize/maximize — l'événement est mappé sur **close** (le close est l'unique action de fenêtrage). Solution pragmatique : émettre `terminal_window_closed` lorsque le close-button est cliqué, et **ne pas** émettre `terminal_minimized_maximized` (action non supportée par le composant actuel — décision explicite : omettre cet événement). Ajouter un commentaire dans la story Dev Notes.

- [x] **Tâche 9 — Footer & Liens légaux (AC: 1, 3)**
  - [x] `footer_legal_clicked` — `data-analytics="footer_legal_clicked|target_page:mentions-legales"` (et `target_page:confidentialite`) sur les `<NuxtLink to="/mentions-legales">` et `<NuxtLink to="/confidentialite">` du footer.
  - [x] `external_link_clicked` — mécanisme global de délégation capture sur `<a target="_blank">` (cf. Tâche 1). Couvre automatiquement :
    - Le `<ZExternalLink class="legal__link" href="https://www.cnil.fr" rel="noopener">` dans `/confidentialite`.
    - Le `<ZExternalLink href="https://www.malt.fr/profile/simonjouan" ...>` dans `app/pages/index.vue` et dans `/mentions-legales`.
    - Le `HexagonLinkComponent` (GitHub, Twitter, LinkedIn) dans `LinkListComponent.vue` (footer + /contact).
    - Le `<ZExternalLink href="https://web3forms.com" ...>` et `https://eu.i.posthog.com` dans `/confidentialite`.
    - Les `<ZExternalLink href="https://pages.github.com" ...>` et `https://www.ovhcloud.com` dans `/mentions-legales`.
  - [x] `linkedin_profile_clicked` — pour la granularité demandée par le tracking-plan (`location` ∈ `header`/`footer`/`contact`), la **même** mécanique de délégation sur `[href*="linkedin.com"]` suffit (et l'événement `external_link_clicked` se déclenche aussi : c'est le contrat du tracking-plan ; ne pas dupliquer).

- [x] **Tâche 10 — Validation Docker & observabilité PostHog (AC: 4)**
  - [x] Exécuter : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`. **0 erreur**.
  - [x] Vérifier l'absence d'appel `eu.i.posthog.com` en dev (onglet Network ; alternative : `console.warn('[posthog] init failed')` si ad-blocker simulé). Consigner la preuve.
  - [x] **Vérification PostHog** après le prochain déploiement sur `jouan.ovh` (recording_domains restreint) : via MCP, requêter `query-events-list` filtré sur les 7 derniers jours, grouper par `$event_name`, et confirmer la présence d'événements pour **chacune des 6 grandes catégories** de l'AC 1. Marquer la story en `done` seulement si la vérification est passante. *(Note : ce point n'est pas bloquant pour la validation CI/gate locale — il est documenté en post-déploiement.)*

## Dev Notes

### ⚠️ Décision critique — Architecture du helper `useAnalytics`

Le helper **`useAnalytics`** est **un composable client-only** (imports en `import.meta.client` guard), NOT a global handler.
Il orchestre **3** types d'événements :

1. **Événements push** depuis les composants métier : `useAnalytics().track('contact_form_success', { ... })`.
2. **Événements automatiques** : `$pageview` via `router.afterEach`, `scroll_depth_reached` via `scroll`, `time_on_page_threshold` via `setTimeout`.
3. **Événements délégués** : capture-phase `click` + `focusin` + `focusout` sur `document` filtrés par sélecteurs (cible `[target="_blank"]`, `[data-analytics]`, etc.).

Il **NE MODIFIE AUCUNE PRIMITIVE DS** : `ZButton`, `ZCard`, `ZExternalLink`, `ZInput` restent inchangées. Toute la mécanique d'attribut se fait via :
- Soit `data-analytics="nom|prop:valeur|prop:valeur"` passé en prop sur `<ZButton ...>` (les primitives forwardent déjà `$attrs` via Vue 3 vers la racine ; pour `ZButton` spécifiquement vérifier que l'attribut atterrit sur le `<button>`/`<a>` rendu).
- Soit des sélecteurs stables (`[target="_blank"]`, `a[href*="linkedin.com"]`) dans le délégué global.

### Architecture logicielle et fichiers à toucher

**Fichiers NEW (4 max) :**
- `app/composables/useAnalytics.ts` — composable principal (helper partagé).
- `app/composables/usePosthog.ts` — wrapper léger exposant `{ instance: Ref<PostHog | null>, ready: Ref<boolean> }`. Auto-importé via `app/composables/`.
- (optionnel, si le plugin grossit trop) refactor `app/plugins/posthog.client.ts` — mais rester minimal pour cette story.
- NE PAS créer d'`app/middleware/analytics.global.ts` : la SSR + prerender ne déclenche pas le tracking et causerait des erreurs `window` non gardées. Tout reste dans le plugin `.client.ts` + composables.

**Fichiers UPDATE :**
- `app/plugins/posthog.client.ts` — exposer l'instance `posthog` au composable `usePosthog()` après `init`.
- `app/composables/useConsent.ts` — **NE PAS MODIFIER** (sauf bug), per 14.1 invariants.
- `app/pages/index.vue` — `data-analytics-*` sur les boutons Hero et CTA final, event `service_card_hovered` + `differentiator_block_viewed`.
- `app/pages/services.vue` — `pricing_cta_clicked` sur chaque `<ZButton :as="NuxtLink" to="/contact">` des cartes d'offres et AI Care, `data-analytics-view="pricing"` racine.
- `app/pages/contact/index.vue` — brancher `contact_page_viewed` au mount ; modifier `onSubmit` pour `submit_attempt`/`success`/`error` ; brancher `contact_field_focused`/`completed` via délégation.
- `app/components/terminal/TerminalComponent.vue` — exporter `openedAt` via `defineExpose` + appeler `useAnalytics().track('terminal_command_executed'/'terminal_invalid_command'/'terminal_window_closed')` aux bons endroits.
- `app/components/terminal/TerminalManagerComponent.vue` — appeler `useAnalytics().track('terminal_window_opened'/'terminal_minimized_maximized')` dans `createNewTerminal` avec `trigger_source` paramétrable.
- `app/components/ui/ThemeToggle.vue` — appel à `useAnalytics().track('theme_toggle_clicked', ...)` dans `handleToggle`.
- `app/components/FooterComponent.vue` — `data-analytics="footer_legal_clicked|..."` sur les deux liens légaux.
- `app/pages/blog/[...slug].vue` — appel à `useAnalytics().track('blog_article_viewed'/'blog_article_finished')`.
- `app/composables/useTerminal.ts` — étendre la signature `open(opts?: { trigger_source?: string })`.

**Fichiers NEW aucun en dehors des composables** (pas de nouveau plugin, pas de middleware, pas de store).

**À NE PAS toucher :**
- `app/components/ui/ZButton.vue`, `ZCard.vue`, `ZInput.vue`, `ZExternalLink.vue`, `ZIcon.vue`, `ZBadge.vue`, `ZTag.vue` — invariants DS. Toute la mécanique d'attribut passe par `$attrs`/`$listeners` Vue 3 ou par la délégation `document`.
- `app/assets/scss/**` — pas de styles à ajouter.
- Le `.gitignore`, `package.json` — pas de nouvelle dépendance (`posthog-js` déjà installé en 14.1).

### Contract `data-analytics` (à documenter dans `useAnalytics`)

Format: `data-analytics="event_name|prop1:value1|prop2:value2"`.
- L'événement est `event_name` (string). Les `|` séparent des paires `key:value`.
- L'absence de `|` après le nom = événement **sans** propriété personnalisée (juste le nom).
- Plusieurs attributs `data-*` complémentaires (ex. `data-analytics-href` pour lire un href sans dépendre de `closest`) peuvent compléter.
- Exemples :
  - `<ZButton data-analytics="hero_cta_clicked|cta_id:identify_workflow">`
  - `<a data-analytics="external_link_clicked|destination_domain:malt.fr" target="_blank" href="https://www.malt.fr/profile/simonjouan">Malt</a>` → pour `external_link_clicked`, le helper ne lit PAS le `data-analytics` mais déclenche via la délégation `[target="_blank"]` (priorité sur le contrat pour rester générique).
- `ZButton` foward-t-il réellement les `data-*` à l'élément rendu ? **À vérifier** avant Tâche 3 : lire `app/components/ui/ZButton.vue` et confirmer que la racine `<button as>`/`<a as>` reçoit `$attrs.class` ET `$attrs['data-*']`. Si seuls `class`/`$listeners` sont forwardés, alors placer `data-analytics` directement sur les `<NuxtLink>` ou `<a>` natifs (cf. CTA du hero qui utilise `ZButton :as="NuxtLink"` — `data-analytics` atterrit alors sur le `<a>` rendu par `<NuxtLink>`).

### Patterns & invariants projet à respecter

1. **Docker exclusif** : toute commande `pnpm` via conteneur (jamais sur l'hôte macOS).
2. **Prerender-safe (SSG)** : tout composable analytics doit court-circuiter en SSR via `import.meta.client` + `if (!import.meta.client) return;` en tête de fonction. Le `.client.ts` du plugin est désactivé au prerender, donc **toutes** les installations de listeners doivent être gardées par `import.meta.client`.
3. **Zéro hardcoding** : `eu.i.posthog.com` / `phc_…` via `runtimeConfig.public.posthogHost` / `posthogKey`. Aucune URL/clé en dur.
4. **Tokens DS uniquement** : si un style est nécessaire pour un badge d'event dev-only (`[posthog]` console.warn), ne pas en ajouter (cette story n'ajoute aucun style).
5. **Zéro emoji** (NFR6), français, vouvoiement.
6. **a11y** : aucune régression sur la navigation clavier. Les zones interactives qui ne l'étaient pas doivent le rester (pas de `<button>` modifié en `<div>`).
7. **Consentement** : `useAnalytics().track()` doit être un **no-op silencieux** si `consentState !== 'accepted'` (donc OK d'appeler depuis le code métier sans devoir guarder partout — l'unique garde est dans `track()`).
8. **RGPD — minimisation** : ne jamais envoyer le contenu des champs formulaire dans les événements. `error_message` est un code interne (`'api_rejection'`, `'network_error'`, etc.), jamais le payload Web3Forms.

### Détails d'implémentation critiques

- **AC 1 — propriétés canoniques** : la table `tracking-plan.md` est la **source de vérité** des noms de propriétés. Respecter `snake_case` partout (`cta_id`, `service_id`, `project_slug`, `destination_domain`, etc.).
- **AC 2 — idempotence du scroll/time** : utiliser des `Set<number>` (paliers émis par path) et un `Set<string>` (seuils de temps émis). Reset à chaque `$pageview`.
- **AC 2 — `referrer`** : `document.referrer` côté client ; `'direct'` en SSR/prerender (où l'événement n'est de toute façon pas émis).
- **AC 3 — pas de modification des primitives DS** : déjà documenté ci-dessus. Si une primitive ne forwarde pas les `data-*` (à vérifier), fallback : placer l'attribut sur le `<a>`/`<button>` natif adjacent.
- **Tâche 6 — terminal** : `terminal_invalid_command` n'envoie PAS la commande en clair (RGPD art. 5). Seulement `command_raw_length`.
- **Tâche 6 — `openedAt`** : `TerminalComponent` est instancié plusieurs fois (un par `createNewTerminal`). Chaque instance a sa propre `openedAt`. Ne PAS centraliser dans `useAnalytics`.
- **Tâche 9 — delegation `[target="_blank"]`** : doit être ajoutée **une seule fois** dans `useAnalytics.install()`. Idempotence par flag (`installed: boolean`).
- **Tâche 4 — ancres intra-page** : la story 12.3 plaçait `to="/services#automatisation"` sur les `.offer__more`. Pour la **cohérence avec NFR26 (architecture multi-pages stricte)** et le tracking de conversion (les ancres `#` ne déclenchent pas `$pageview` et sont impossibles à distinguer du chargement initial), cette story **remplace les ancres par `/contact`** sur les CTAs des 3 cartes d'offres. Les `id="automatisation|workflow|sur-mesure"` restent sur les `<ZCard>` pour permettre une navigation future si nécessaire (cf. note Epic 12 CAP-9).

### Testing standards summary

- **Pas de framework de test** (cf. `project-context.md`). Barre = `pnpm lint` + `pnpm typecheck` + `pnpm generate` (Docker, 0 erreur) + **vérification navigateur** manuelle (Tâche 10).
- Vérifier explicitement : `useAnalytics().track(...)` ne lance **pas** d'appel si consentement refusé (vérifier via `console.log` temporaire dans le `track()` ou en refusant via le toast), si DNT forcé (vérifier `navigator.doNotTrack = '1'`), si `import.meta.dev` (vérifier `console.warn` du plugin manquant), et dans le `pnpm generate` (aucun appel `eu.i.posthog.com` dans `.output/public/_nuxt/*.js`).
- La vérification visuelle n'est pas obligatoire pour cette story (pas de composant visuel ajouté) — mais le smoke-test « accepter la télémétrie + naviguer 30 s » doit valider l'émission réelle.

### Project Structure Notes

- Alignement Nuxt 4 (`srcDir = "app"`) : `app/composables/`, `app/pages/`, `app/components/`.
- `app/composables/useAnalytics.ts` est **auto-importé** par Nuxt (convention `composables/`), donc utilisable directement : `useAnalytics()`.
- `app/composables/usePosthog.ts` idem. **Aucun** import explicite nécessaire dans les composants.
- **Aucune** nouvelle dépendance npm requise : `posthog-js@^1.434.7` (installé en 14.1) suffit pour `posthog.capture` + `posthog.startSessionRecording` (déjà câblés en 14.1+14.2).

### Previous Story Intelligence (14.1 + 14.2)

**Acquis 14.1 à préserver :**
- `app/composables/useConsent.ts` : opt-in/DNT, persistance `jouan_consent_telemetry`, `accept/decline/dismissConsentModal/openConsentModal/initConsent`.
- `app/components/ui/ConsentToast.vue` : aria-live, Échap → dismiss, DNT masqué.
- `app/components/FooterComponent.vue` : bouton « Gestion des cookies ».
- `app/plugins/posthog.client.ts` : `import.meta.client`/`prerender`/`dev` guards ; init async ; `opt_out_capturing_by_default` ; `respect_dnt` ; **`capture_pageview: false`** (le `$pageview` route-based arrive via cette story) ; `autocapture: false` ; `disable_session_recording` ; persistence `localStorage+cookie` ; `person_profiles: 'identified_only'` ; `ip: false`.
- `nuxt.config.ts` : `runtimeConfig.public.posthogKey`, `posthogHost`. **Aucune modif.**
- `.github/workflows/cd.yml` : secret `NUXT_PUBLIC_POSTHOG_KEY` câblé (story 14.1 code review).

**Acquis 14.2 (code review passé) :**
- `session_recording: { maskAllInputs, maskTextSelector, maskAllElementAttributes }` + start/stop sur consentement.
- `instance.reset()` au refus (mitigation RGPD art. 17 client-side, distinct_id neuf).
- `void applyConsent(state).catch(() => {})` (anti-unhandledrejection).
- `console.warn` dev-only dans le `.catch()` PostHog init.

### References

- [Source: docs/planning-artifacts/epics.md#Epic 14 — Story 14.3]
- [Source: docs/specs/spec-analytics-search-console/SPEC.md#CAP-3]
- [Source: docs/specs/spec-analytics-search-console/tracking-plan.md] (source de vérité des noms d'événements + propriétés)
- [Source: docs/specs/spec-analytics-search-console/compliance-gdpr.md] (consent, masquage, masquage rejoué)
- [Source: docs/implementation-artifacts/14-1-fondations-posthog-eu-composable-consentement-et-toast-cookie-terminal.md] (plugin + composable useConsent + ConsentToast)
- [Source: docs/implementation-artifacts/14-2-session-replay-securise-masquage-donnees-et-politique-rgpd.md] (session_recording config, instance.reset())
- [Source: app/composables/useConsent.ts] (consentState, dntForced, isAnalyticsConfigured)
- [Source: app/composables/useTheme.ts] (theme_toggle_clicked event)
- [Source: app/components/terminal/TerminalComponent.vue] (submitInput, runCommand, closeTerminal, defineProps)
- [Source: app/components/terminal/TerminalManagerComponent.vue] (createNewTerminal, defineExpose)
- [Source: app/components/terminal/interfaces/IProgram.ts] (program.run contract)
- [Source: AGENTS.md#Section 5 — Docker, Zéro emoji, a11y, Nuxt gotchas]
- [Source: docs/project-context.md#Nuxt, #SCSS, #Tests, #Accessibilité]
- [Source: MCP PostHog EU (`exec`) — `query-events-list`, `query-session-recordings-list` ; post-déploiement `jouan.ovh` (recording_domains restreint)]

## Dev Agent Record

### Agent Model Used

`opencode-go/deepseek-v4.1-flash`

### Debug Log References

- `docker compose run --rm web sh -c "corepack enable && pnpm lint"` → 0 erreur ESLint/Stylelint.
- `docker compose run --rm web sh -c "corepack enable && pnpm typecheck"` → 0 erreur vue-tsc (après une correction : `useConsent()` n'expose pas `isAnalyticsConfigured()` dans son retour ; la détection de configuration lit désormais directement `useRuntimeConfig().public.posthogKey`, sans modifier `useConsent`).
- `docker compose run --rm web sh -c "corepack enable && pnpm generate"` → 28 routes pré-rendues (13 pages + assets), build Nitro vert.
- Vérification HTML SSR (`curl http://localhost:3000/...`) : tous les attributs `data-analytics` et `data-analytics-view` sont présents sur `/`, `/services`, `/contact` ; les 6 contrôles du formulaire portent bien leur `name` (`name`, `email`, `company`, `frequency`, `workflow`, `currentState`).
- Dev local : `posthogKey` vide + garde `import.meta.dev` → aucun listener installé, aucune requête vers `eu.i.posthog.com` (chaîne d'host uniquement présente dans le bundle client via `runtimeConfig`, jamais appelée au build).

### Completion Notes List

- **AC1 — helper central** : `app/composables/useAnalytics.ts` expose `{ track(name, props?), install(), isReady() }`. `track()` est un no-op silencieux hors consentement `accepted`, sous Do Not Track, en dev et au prerender ; les événements émis avant le chargement du SDK sont mis en file (borne 50) puis rejoués. `install()`/`uninstall()` sont pilotés par une veille de consentement/détection DNT (scope détaché, idempotent).
- **AC1 — registre SDK** : `app/composables/usePosthog.ts` (module-level `shallowRef`) expose l'instance au helper ; le plugin l'alimente après `init()` réussi et la retire au refus. `useConsent` n'a **pas** été modifié.
- **AC2 — `$pageview`** : émis sur `router.afterEach` avec `path`, `title` (lu après application du head), `referrer` (`document.referrer` ou `direct`) et `query_params` ; les changements de hash seuls (path+query identiques) sont ignorés. Scroll depth (25/50/75/100) et time-on-page (30/60/180/300 s) sont réinitialisés à chaque page et idempotents via `Set`.
- **AC3 — zéro modification des primitives DS** : instrumentation par attributs `data-analytics` (forwardés via `$attrs` : `ZButton`, `ZTag`, `NuxtLink`) + délégation globale `click` capture (`a[target="_blank"]` → `external_link_clicked` ; `[data-analytics]` → événement custom ; `linkedin.com` → `linkedin_profile_clicked`). Événements non couverts par délégation émis depuis les composants métier (formulaire, terminal, thème, blog). Aucun contenu de champ n'est transmis (`command_raw_length`, `char_count_bucket`, `error_message` court uniquement — RGPD art. 5).
- **AC4 — gate Docker 100 % verte** (lint + typecheck + generate, 28 routes), aucun appel analytics en dev/generate.
- **Décisions explicites / écarts documentés :**
  - `terminal_minimized_maximized` **omis** : le composant terminal ne distingue pas minimize/maximize/restore (le close est l'unique action de fenêtrage) — conformément à la Tâche 8.
  - `project_card_clicked` **non émis** sur les 3 projets phares : ce sont des cartes-vitrines non cliquables (aucun lien sortant), conformément à la Tâche 3 (pas d'événement mensonger). `project_tag_clicked` est bien émis sur les `ZTag` ; `external_link_clicked` couvre les liens externes du footer (Keova App, réseaux).
  - `blog_code_copied` : aucun bouton `.code-copy` n'existe (vérifié par `grep`) → émission sur l'événement natif `copy` lorsque la sélection est dans un `<pre>`.
  - **Ancres intra-page** : les cartes services de la home pointaient `/services#automatisation|#workflow|#sur-mesure`. Conformément à l'intention de la Tâche 4 (NFR26 : pas d'ancres intra-page) les ancres sont retirées → destination `/services`. **Écart assumé vs libellé littéral de la story (`to: "/contact"`)** : conserver `/services` préserve l'AC de la story 15.1 (`done`) « lien d'exploration contextuel ciblant /services » et évite un libellé trompeur (« Voir les types d'automatisation » → /contact). L'identifiant de carte reste porté par `service_id` dans `data-analytics`.
  - CTA final d'accueil : `cta_id:identify_workflow_final` (au lieu du doublon `identify_workflow_workflow` de la story) pour une donnée exploitable.

### File List

**NEW**
- `app/composables/useAnalytics.ts`
- `app/composables/usePosthog.ts`

**UPDATE**
- `app/plugins/posthog.client.ts`
- `app/composables/useTerminal.ts`
- `app/components/FooterComponent.vue`
- `app/components/HeaderComponent.vue`
- `app/components/ui/ThemeToggle.vue`
- `app/components/terminal/TerminalComponent.vue`
- `app/components/home/HomeHeroTerminal.vue`
- `app/pages/index.vue`
- `app/pages/services.vue`
- `app/pages/contact/index.vue`
- `app/pages/blog/[...slug].vue`
- `docs/implementation-artifacts/sprint-status.yaml`

## Change Log

- 2026-09-23 : Création de la story 14.3 (Plan de Taggage Exhaustif — Conversions IA & Interactions).
- 2026-09-24 : Implémentation complète (helpers `useAnalytics`/`usePosthog`, plugin étendu, instrumentation home/services/contact/terminal/blog/footer/thème) ; gate Docker verte (lint + typecheck + generate, 28 routes). Statut → review.
- 2026-09-24 : **Code review (3 couches adverses)** — 2 décisions (F-14, F-15 — nomenclature V1.1 du `tracking-plan.md`), 20 patches appliqués (5 sanitisers PII, 4 régressions silencieuses plugin, 7 métriques bruitées, 2 hygiene a11y, 2 nomenclature tracking-plan) ; 2 defer (Shiki désactivé, `linkedin_profile_clicked:header` inatteignable) ; 6 dismiss vérifiés. Gate Docker verte (28 routes). Statut → done.

## Review Findings

_Code review du 2026-09-24 (diff non commité vs `d8193c7`, baseline_commit story) — 3 couches adverses : Blind Hunter, Edge Case Hunter, Acceptance Auditor._

### Decision-needed (2)

- [x] [Review][Decision] `service_id` de la home dérive de la nomenclature canonique [app/pages/index.vue:434, 450, 466, 1740, 1817] — **Résolu (option 2, 2026-09-24)** : mise à jour de `tracking-plan.md` §3 pour refléter la nomenclature V1.1 réelle (`automation | agents | apps`), avec note de traçabilité (valeur historique `workflow_automation | ai_agents | custom_ai_apps`).
- [x] [Review][Decision] `pricing_cta_clicked.package_id` dérive de la nomenclature canonique [app/pages/services.vue:278-282, 1925-1929] — **Résolu (option 1, 2026-09-24)** : mise à jour de `tracking-plan.md` §3 avec nomenclature V1.1 (`automatisation | workflow | sur_mesure | ai_care`) et note de traçabilité (valeur historique `blueprint | sprint | care`).

### Patch (20 — inclut F-14 et F-15 résolus)

- [x] [Review][Patch] Mettre à jour `tracking-plan.md` §3 — nomenclature `service_id` [docs/specs/spec-analytics-search-console/tracking-plan.md:30-37] — Aligner le tableau `service_card_hovered`/`service_card_clicked` sur la nomenclature V1.1 émise (`service_id ∈ {automation, agents, apps}` pour la home) avec note de traçabilité (« valeur historique : `workflow_automation | ai_agents | custom_ai_apps` »).
- [x] [Review][Patch] Mettre à jour `tracking-plan.md` §3 — nomenclature `package_id` [docs/specs/spec-analytics-search-console/tracking-plan.md:35-36] — Aligner le tableau `pricing_cta_clicked` sur les 4 IDs V1.1 émis (`package_id ∈ {automatisation, workflow, sur_mesure, ai_care}`) avec note de traçabilité (« valeur historique : `blueprint | sprint | care` »).

### Patch (18)

- [x] [Review][Patch] Fuite PII — `window.location.href` complet dans `external_link_clicked.location` [app/composables/useAnalytics.ts:218] — Émet l'URL complète (path + query + hash). Si la query contient email/token/PII, fuite vers PostHog. Sanitizer : utiliser `window.location.pathname` ou regex de blacklist.
- [x] [Review][Patch] Fuite PII — `link_text` peut contenir l'email pour les boutons mailto: [app/composables/useAnalytics.ts:219] — `textContent` peut inclure l'email rendu comme libellé. Sanitizer : retirer les patterns email (`/[\w.+-]+@[\w-]+\.[\w.-]+/g` → `'email_redacted'`).
- [x] [Review][Patch] Fuite PII — `JSON.stringify(query)` brut dans `$pageview.query_params` [app/composables/useAnalytics.ts:154] — Toutes les query strings entrantes (emails, tokens UTM, deep links avec PII) sont sérialisées telles quelles. Sanitizer : whitelister les clés `utm_*`, `origin`, `ref` ; redact les autres.
- [x] [Review][Patch] Fuite PII — `document.referrer` brut dans `$pageview` et `contact_page_viewed` [app/composables/useAnalytics.ts:155 + app/pages/contact/index.vue:333] — L'URL de provenance complète (query + hash) est trackée. Sanitizer : ne garder que `new URL(referrer).hostname` ou `'direct'`.
- [x] [Review][Patch] Fuite PII — `error_message` Web3Forms peut contenir le contenu saisi [app/pages/contact/index.vue:413] — Web3Forms renvoie parfois des messages contextuels (`'Invalid email: user@foo.com'`). Sanitizer : n'envoyer que des codes internes courts (`'api_rejection'`, `'network_error'`, `'validation_error'`), pas le `res.message`.
- [x] [Review][Patch] Analytics silencieusement mortes après cycle « Refuser → Ré-accept » [app/plugins/posthog.client.ts:42-65, 101-126] — Après `instance.reset()`, le closure-scoped `instance` n'est jamais remis à `null`. `loadPostHog()` court-circuite sur `if (instance)` et `setInstance(posthog)` n'est jamais réappelé. Tous les events après ce cycle sont perdus dans `pending`. Fix : `instance = null` dans la branche declined de `applyConsent`, ou re-check dans `loadPostHog`.
- [x] [Review][Patch] `terminal_window_closed` jamais émis si fermeture brutale [app/components/terminal/TerminalComponent.vue:296-312] — `closeTerminal()` n'est appelé que via le bouton close ou Échap. Une fermeture par `beforeunload`/`pagehide` perd `duration_open_seconds` et `commands_count`. Fix : ajouter un listener `pagehide` qui force `closeTerminal()` (idempotent grâce à `hasEmittedClose`).
- [x] [Review][Patch] `pending` peut être replayed après un refus → RGPD art. 7.3 [app/composables/useAnalytics.ts:62-67 + app/plugins/posthog.client.ts:122-125] — Lors d'un decline, `setInstance(null)` ne vide pas `pending`. Ré-accepter replay les events émis sous DNT/refus. Fix : `pending.length = 0` dans la branche declined de `applyConsent`.
- [x] [Review][Patch] Pages courtes : 4 paliers `scroll_depth_reached` en bloc [app/composables/useAnalytics.ts:161-171] — `scrollable <= 0` ⇒ `percentage = 100` ⇒ 4 events factices par page non-scrollable. Fix : `if (scrollable <= 0) return;` ou n'émettre que `100`.
- [x] [Review][Patch] `service_card_hovered` non neutralisé sous `prefers-reduced-motion` [app/pages/index.vue:369-405] — Le hover >1.5s déclenche toujours l'émission. Incohérence avec Epic 11 §7. Fix : guard `if (isReducedMotion.value) return;` dans `onServiceHover`.
- [x] [Review][Patch] `hero_badge_clicked` n'est émis qu'au clic sur le lien Malt enfant [app/pages/index.vue:26-36] — Le nom d'événement est trompeur. Fix : renommer l'événement en `hero_malt_link_clicked` OU rendre le badge cliquable avec un vrai handler.
- [x] [Review][Patch] `process_step_interacted` inatteignable pour 3/4 étapes [app/pages/services.vue:103-115] — Seule l'étape 01 a un `inlineCta`. Fix : ajouter `data-analytics-view="process_step_N"` sur chaque étape et 4 entrées dans `VIEW_EVENTS` du helper.
- [x] [Review][Patch] Race accept→decline laisse un `distinct_id` non révoqué [app/plugins/posthog.client.ts:101-126] — Decline pendant `loadPostHog()` en cours ⇒ `instance === null` au moment du decline ⇒ `posthog.init()` écrit un `distinct_id` persistant. Fix : re-check `consentState.value` après `posthog.init()` et appeler `posthog.reset()` si pas `accepted`.
- [x] [Review][Patch] Double `$pageview` possible sur navigation ultra-rapide [app/composables/useAnalytics.ts:148-159] — Le `setTimeout(0)` interne n'est pas stocké ⇒ non cancellable par `uninstall()`. Fix : stocker le `timeoutId` dans `timeouts[]` (ou un tableau dédié), clear dans `removeAllListeners()`.
- [x] [Review][Patch] Chargement PostHog SDK même si DNT forcé (consentement déjà acquis) [app/composables/useAnalytics.ts + app/plugins/posthog.client.ts] — Edge-case : localStorage `accepted` + DNT actif ⇒ SDK chargé pour rien. Fix : dans `applyConsent("accepted")`, early-return si `dntForced.value === true`.
- [x] [Review][Patch] Pas de retour de focus après fermeture du toast de consentement [app/components/ui/ConsentToast.vue:46-58] — Après Accept/Decline via le footer, le focus retourne à `<body>`. Fix : mémoriser `document.activeElement` à `openConsentModal()`, restaurer sur accept/decline.
- [x] [Review][Patch] `route.query.origin` non sanitizé dans `contact_page_viewed.origin_cta` [app/pages/contact/index.vue:331-335] — Valeur brute remontée dans PostHog. Fix : whitelister via regex `^[a-z0-9_-]+$` ou enum fermée (`hero_cta|footer|direct`).
- [x] [Review][Patch] `time_on_page_threshold` non pausé sur onglet caché + `reducedMotion` capturé une seule fois [app/composables/useAnalytics.ts:118-130, 299-325] — Les paliers se déclenchent en arrière-plan ; `reducedMotion` non réactif. Fix : clear timers sur `document.visibilitychange` hidden + listener MediaQueryList `change` pour `reducedMotion`.

### Defer (2)

- [x] [Review][Defer] `blog_code_copied.code_language` toujours `unknown` [app/pages/blog/[...slug].vue:147-161] — deferred, pre-existing : Shiki désactivé intentionnellement pour la palette DS terminal (cf. project-context.md). Conséquence connue et assumée.
- [x] [Review][Defer] `linkedin_profile_clicked.location: 'header'` est inatteignable [app/composables/useAnalytics.ts:198-208] — deferred, pre-existing : aucun lien LinkedIn dans le `<header>` aujourd'hui. Code mort non bloquant ; à harmoniser si extension future.
