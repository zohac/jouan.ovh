# Plan de Taggage Exhaustif — PostHog EU

Conformément à la directive projet (« Mieux vaut un maximum d'événements à configurer que pas assez, le tri s'effectuera après plusieurs semaines d'exploitation »), ce document détaille l'ensemble exhaustif des événements comportementaux, déclencheurs et métadonnées suivis sur `jouan.ovh`.

---

## 1. Navigation, Défilement & Cycle de Vie

| Nom de l'événement       | Déclencheur                                   | Propriétés spécifiques                                    | Objectif métier                                                |
| :----------------------- | :-------------------------------------------- | :-------------------------------------------------------- | :------------------------------------------------------------- |
| `$pageview`              | Changement de route via le routeur Nuxt       | `path`, `title`, `referrer`, `query_params`               | Suivi global du trafic et des parcours entre les pages.        |
| `scroll_depth_reached`   | Franchissement des paliers de scroll vertical | `depth_percentage` (`25`, `50`, `75`, `100`), `page_path` | Mesure de l'attention et de la consommation réelle du contenu. |
| `time_on_page_threshold` | Temps actif passé sur une page sans rebond    | `seconds` (`30`, `60`, `180`, `300`), `page_path`         | Qualification du temps d'engagement utile.                     |
| `theme_toggle_clicked`   | Clic sur le bouton de bascule de thème        | `from_theme`, `to_theme`, `system_theme`                  | Analyse de la préférence utilisateur sombre vs clair.          |

---

## 2. Hero & Proposition de Valeur Principale (Accueil)

| Nom de l'événement          | Déclencheur                                                     | Propriétés spécifiques                                                     | Objectif métier                                      |
| :-------------------------- | :-------------------------------------------------------------- | :------------------------------------------------------------------------- | :--------------------------------------------------- |
| `hero_cta_clicked`          | Clic sur un des deux CTAs principaux du Hero                    | `cta_id` (`identify_workflow`, `view_systems`), `cta_label`, `destination` | Mesure de l'impact immédiat du hook d'accroche IA.   |
| `hero_badge_clicked`        | Clic sur le badge de disponibilité ("Disponible pour missions") | `badge_state` (`available`, `busy`)                                        | Intérêt pour la disponibilité commerciale immédiate. |
| `hero_terminal_interaction` | Première interaction avec le terminal intégré au Hero           | `interaction_type` (`click`, `keypress`)                                   | Évaluation de la curiosité pour l'univers terminal.  |

---

## 3. Offres & Services IA (`/` et `/services`)

| Nom de l'événement            | Déclencheur                                                  | Propriétés spécifiques                                                                                                                           | Objectif métier                                                |
| :---------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------- |
| `service_card_hovered`        | Survol prolongé (>1.5s) d'une carte de service               | `service_id` (`automation`, `agents`, `apps` — voir _Note nomenclature V1.1_), `location`                                                        | Détection de l'intérêt d'exploration avant clic.               |
| `service_card_clicked`        | Clic sur le titre ou le lien d'une carte de service          | `service_id`, `service_title`, `location`                                                                                                        | Comparaison de l'attractivité relative des 3 piliers d'offre.  |
| `differentiator_block_viewed` | Défilement jusqu'au bloc "Prototype vers Production"         | `section_id`: `differentiator`                                                                                                                   | Mesure de l'exposition au message clé de fiabilité/QA.         |
| `pricing_card_viewed`         | Visibilité de la grille tarifaire sur `/services`            | `section`: `pricing_grid`                                                                                                                        | Mesure de l'accès à la transparence tarifaire.                 |
| `pricing_cta_clicked`         | Clic sur un CTA d'engagement tarifaire                       | `package_id` (`automatisation`, `workflow`, `sur_mesure`, `ai_care` — voir _Note nomenclature V1.1_), `starting_price_ht` (`sur_devis` ou `250`) | Qualification de l'intention d'achat selon le ticket d'entrée. |
| `process_step_interacted`     | Clic ou intersection (>50%) avec une des 4 étapes du process | `step_number` (`1`, `2`, `3`, `4`), `step_title` (`Diagnostic`, `Cadrage`, `Construction & intégration`, `Exploitation & mesure`)                | Analyse de la compréhension de la méthode de travail.          |

> **Note nomenclature V1.1** (mise à jour 2026-09-24, code review story 14.3)
>
> Le plan de taggage historique listait `service_id ∈ {workflow_automation, ai_agents, custom_ai_apps}` et `package_id ∈ {blueprint, sprint, care}`. La nomenclature réellement émise par le code actuel (Epic 12 + Epic 15 — Repositionnement commercial V1/V1.1) diverge :
>
> - `service_id` émis : `automation | agents | apps` (3 cartes de l'accueil, alignées sur les `id` du tableau `services` dans `app/pages/index.vue`).
> - `package_id` émis : `automatisation | workflow | sur_mesure | ai_care` (4 offres sur `/services` post-V1.1).
>
> Les valeurs historiques restent valides comme référence d'archive pour les analyses pré-V1.1 ; tout nouveau dashboard doit utiliser les valeurs V1.1.

---

## 4. Réalisations & Projets Phares

| Nom de l'événement              | Déclencheur                                                  | Propriétés spécifiques                                                       | Objectif métier                                              |
| :------------------------------ | :----------------------------------------------------------- | :--------------------------------------------------------------------------- | :----------------------------------------------------------- |
| `project_card_clicked`          | Clic sur une carte de projet en vitrine                      | `project_slug` (`keova-signal`, `debrief`, `devis-assist`), `project_status` | Mesure de l'intérêt pour les cas concrets (B2B, local, BTP). |
| `project_external_link_clicked` | Clic sur le lien de démonstration ou repo GitHub d'un projet | `project_slug`, `destination_domain`                                         | Intérêt pour la preuve technique et le code source.          |
| `project_tag_clicked`           | Clic sur un badge technologique d'un projet                  | `tech_tag` (ex: `python`, `nuxt`, `ocr`, `agents`)                           | Détection des compétences technologiques recherchées.        |

---

## 5. Tunnel de Qualification & Formulaire de Contact (`/contact`)

| Nom de l'événement            | Déclencheur                                            | Propriétés spécifiques                                            | Objectif métier                                               |
| :---------------------------- | :----------------------------------------------------- | :---------------------------------------------------------------- | :------------------------------------------------------------ |
| `contact_page_viewed`         | Arrivée sur la page `/contact`                         | `origin_cta`, `referrer`                                          | Entrée officielle dans le tunnel de conversion.               |
| `contact_field_focused`       | Focus initial sur un champ de formulaire               | `field_id` (`name`, `email`, `company`, `workflow_desc`, `tools`) | Détection du début effectif de rédaction.                     |
| `contact_field_completed`     | Perte de focus (`blur`) après saisie valide d'un champ | `field_id`, `char_count_bucket` (`<20`, `20-100`, `>100`)         | Suivi de la complétion progressive sans enregistrer le texte. |
| `contact_form_submit_attempt` | Clic sur le bouton de soumission du formulaire         | `fields_filled_count`, `form_validity`                            | Mesure de la volonté d'envoi.                                 |
| `contact_form_success`        | Confirmation de réception via l'API Web3Forms          | `has_company` (booléen), `latency_ms`                             | **Macro-conversion principale** du site.                      |
| `contact_form_error`          | Échec de l'envoi (réseau ou validation Web3Forms)      | `error_status`, `error_code` (`api_rejection` ou `network_error`) | Alerting technique sans message fournisseur ni contenu saisi. |
| `direct_email_copied`         | Clic pour copier l'adresse email de contact            | `email_context` (`footer`, `contact_page`)                        | Suivi des prises de contact hors formulaire.                  |
| `linkedin_profile_clicked`    | Clic sur le lien vers le profil LinkedIn               | `location` (`header`, `footer`, `contact`)                        | Mesure des redirections vers le canal social professionnel.   |

---

## 6. Sous-système Terminal (Interactif & Floating)

| Nom de l'événement             | Déclencheur                                       | Propriétés spécifiques                                                                            | Objectif métier                                               |
| :----------------------------- | :------------------------------------------------ | :------------------------------------------------------------------------------------------------ | :------------------------------------------------------------ |
| `terminal_window_opened`       | Déclenchement de l'ouverture du terminal flottant | `trigger_source` (`header_icon`, `keyboard_shortcut`, `hero_prompt`)                              | Appétence pour les fonctionnalités avancées/développeur.      |
| `terminal_window_closed`       | Fermeture de la fenêtre du terminal               | `duration_open_seconds`, `commands_count`                                                         | Durée moyenne d'exploration du terminal.                      |
| `terminal_command_executed`    | Validation d'une commande dans le terminal        | `command_name` (`help`, `whoami`, `systems`, `skills`, `projects`, `contact`), `is_known_command` | Analyse des commandes explorées par les visiteurs techniques. |
| `terminal_invalid_command`     | Saisie d'une commande non reconnue                | `command_raw_length`                                                                              | Détection d'intentions ou curiosités non couvertes.           |
| `terminal_minimized_maximized` | Changement d'état de la fenêtre terminal          | `action` (`minimize`, `maximize`, `restore`)                                                      | Ergonomie et comportement de fenêtrage.                       |

---

## 7. Journal Technique & Blog (`/blog`)

| Nom de l'événement      | Déclencheur                                       | Propriétés spécifiques                              | Objectif métier                                       |
| :---------------------- | :------------------------------------------------ | :-------------------------------------------------- | :---------------------------------------------------- |
| `blog_article_viewed`   | Ouverture d'un article de blog                    | `article_slug`, `article_title`, `reading_time_est` | Popularité des thématiques d'ingénierie et d'IA.      |
| `blog_toc_clicked`      | Clic sur un lien de la table des matières interne | `heading_id`, `article_slug`                        | Navigation ciblée au sein des articles longs.         |
| `blog_code_copied`      | Clic sur le bouton de copie d'un bloc de code     | `code_language`, `article_slug`                     | Utilité concrète des extraits techniques partagés.    |
| `blog_article_finished` | Défilement atteignant la fin d'un article         | `article_slug`, `total_seconds`                     | Taux d'achèvement de lecture des contenus techniques. |

---

## 8. Liens Externes & Footer

| Nom de l'événement      | Déclencheur                                               | Propriétés spécifiques                                | Objectif métier                                         |
| :---------------------- | :-------------------------------------------------------- | :---------------------------------------------------- | :------------------------------------------------------ |
| `external_link_clicked` | Clic sur tout composant `<ZExternalLink>`                 | `destination_domain`, `link_text`, `location`         | Cartographie des sorties vers les écosystèmes externes. |
| `footer_legal_clicked`  | Clic sur Mentions légales ou Politique de confidentialité | `target_page` (`mentions-legales`, `confidentialite`) | Consultation de la conformité juridique.                |

---

## 9. Propriétés Globales Inhérentes à Chaque Événement

Chaque événement émis par le SDK PostHog est enrichi par `useAnalytics()` avec les propriétés globales suivantes :

- `locale` : `fr`
- `viewport_width` / `viewport_height` : dimensions de la fenêtre, actualisées au redimensionnement.
- `screen_category` : `mobile` (<768px), `tablet` (768px-1024px), `desktop` (>1024px).
- `prefers_reduced_motion` : `true` / `false`.
- `$pageview.query_params` : objet JSON sérialisé et filtré par la whitelist UTM, uniquement sur les événements de navigation ; ce n'est pas une propriété libre.

Les propriétés contenant des URL sont réduites à leur origine et leur chemin ; les messages d'erreur, identifiants de contexte, URLs complètes et réponses de fournisseur ne sont pas des propriétés libres. Une valeur de télémétrie doit provenir d'une enum documentée ou être une mesure agrégée.

---

## 10. Mesure AEO et referral ChatGPT

La story 14.6 n'ajoute aucun événement IA contenant une nouvelle dimension personnelle. Après consentement explicite, la whitelist de `useAnalytics()` conserve uniquement les paramètres UTM autorisés et valide leurs valeurs comme identifiants de campagne ; les emails, téléphones, tokens longs, credentials courts, espaces et caractères atypiques sont neutralisés. Une session referral ChatGPT est donc observée lorsque la requête contient `utm_source=chatgpt.com` ; la valeur reste dans la propriété sérialisée `$pageview.query_params`.

### Propriétés et segmentation

| Élément                | Contrat                                                                                                                                                                                    |
| :--------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Source de segmentation | `utm_source=chatgpt.com` dans `$pageview.query_params`, après consentement et hors DNT.                                                                                                    |
| Autres paramètres      | `utm_medium`, `utm_campaign`, `utm_term` et `utm_content` uniquement ; les clés inconnues sont ignorées.                                                                                   |
| Unité de comptage      | Une session PostHog est l'unité principale ; les événements de conversion sont comptés dans cette session.                                                                                 |
| Propagation            | L'UTM n'est pas copié automatiquement vers les pages internes ; la mesure principale utilise la pageview d'atterrissage et les conversions associées dans la fenêtre définie.              |
| Conversion qualifiée   | `contact_form_success` est la macro-conversion principale ; `contact_form_submit_attempt` et `direct_email_copied` sont des signaux secondaires.                                           |
| Fenêtre                | Attribution descriptive de 30 jours pour les événements PostHog, avec une comparaison avant/après sur au moins quatre semaines ; aucune causalité ni garantie de conversion n'est inférée. |

### Panel de prompts et contrôle externe

Le panel de mesure fixe comporte des requêtes en français portant sur les systèmes IA, l'automatisation métier, les agents intégrés et la fiabilité des workflows. Le panel initial, exécuté au moins une fois par semaine pendant chaque période, comprend :

- « Quels sont les trois types de workflows métier qu'une PME peut automatiser en priorité ? »
- « Quand un agent IA intégré est-il pertinent plutôt qu'une automatisation classique ? »
- « Comment fiabiliser un workflow qui mobilise des API, des outils internes et un modèle de langage ? »
- « Quels sont les critères pour choisir entre une automatisation ciblée et une application métier sur mesure ? »

Pour chaque exécution, le journal indique la date, le prompt, l'URL mentionnée éventuelle, la page attribuée, l'exactitude de la réponse et la présence d'une citation correcte. Une citation observée est un constat de sortie, pas une garantie de citation future.

Google Search Console sert de contrôle organique : pages indexées, requêtes, impressions et clics sont suivis séparément des sessions referral. L'absence d'UTM, le refus du consentement et les signaux Do Not Track/GPC rendent la session non observable. Aucun score de lisibilité machine ni aucune présence de fichier `llms.txt` n'est utilisé comme proxy de classement ou de causalité.
