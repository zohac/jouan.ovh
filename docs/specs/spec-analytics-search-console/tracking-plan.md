# Plan de Taggage Exhaustif — PostHog EU

Conformément à la directive projet (« Mieux vaut un maximum d'événements à configurer que pas assez, le tri s'effectuera après plusieurs semaines d'exploitation »), ce document détaille l'ensemble exhaustif des événements comportementaux, déclencheurs et métadonnées suivis sur `jouan.ovh`.

---

## 1. Navigation, Défilement & Cycle de Vie

| Nom de l'événement | Déclencheur | Propriétés spécifiques | Objectif métier |
| :--- | :--- | :--- | :--- |
| `$pageview` | Changement de route via le routeur Nuxt | `path`, `title`, `referrer`, `query_params` | Suivi global du trafic et des parcours entre les pages. |
| `scroll_depth_reached` | Franchissement des paliers de scroll vertical | `depth_percentage` (`25`, `50`, `75`, `100`), `page_path` | Mesure de l'attention et de la consommation réelle du contenu. |
| `time_on_page_threshold` | Temps actif passé sur une page sans rebond | `seconds` (`30`, `60`, `180`, `300`), `page_path` | Qualification du temps d'engagement utile. |
| `theme_toggle_clicked` | Clic sur le bouton de bascule de thème | `from_theme`, `to_theme`, `system_theme` | Analyse de la préférence utilisateur sombre vs clair. |

---

## 2. Hero & Proposition de Valeur Principale (Accueil)

| Nom de l'événement | Déclencheur | Propriétés spécifiques | Objectif métier |
| :--- | :--- | :--- | :--- |
| `hero_cta_clicked` | Clic sur un des deux CTAs principaux du Hero | `cta_id` (`identify_workflow`, `view_systems`), `cta_label`, `destination` | Mesure de l'impact immédiat du hook d'accroche IA. |
| `hero_badge_clicked` | Clic sur le badge de disponibilité ("Disponible pour missions") | `badge_state` (`available`, `busy`) | Intérêt pour la disponibilité commerciale immédiate. |
| `hero_terminal_interaction` | Première interaction avec le terminal intégré au Hero | `interaction_type` (`click`, `keypress`) | Évaluation de la curiosité pour l'univers terminal. |

---

## 3. Offres & Services IA (`/` et `/services`)

| Nom de l'événement | Déclencheur | Propriétés spécifiques | Objectif métier |
| :--- | :--- | :--- | :--- |
| `service_card_hovered` | Survol prolongé (>1.5s) d'une carte de service | `service_id` (`workflow_automation`, `ai_agents`, `custom_ai_apps`), `location` | Détection de l'intérêt d'exploration avant clic. |
| `service_card_clicked` | Clic sur le titre ou le lien d'une carte de service | `service_id`, `service_title`, `location` | Classement de l'attractivité relative des 3 piliers d'offre. |
| `differentiator_block_viewed` | Défilement jusqu'au bloc "Prototype vers Production" | `section_id`: `differentiator` | Mesure de l'exposition au message clé de fiabilité/QA. |
| `pricing_card_viewed` | Visibilité de la grille tarifaire sur `/services` | `section`: `pricing_grid` | Mesure de l'accès à la transparence tarifaire. |
| `pricing_cta_clicked` | Clic sur un CTA d'engagement tarifaire | `package_id` (`blueprint`, `sprint`, `care`), `starting_price_ht` | Qualification de l'intention d'achat selon le ticket d'entrée. |
| `process_step_interacted` | Clic ou interaction avec les 4 étapes du process | `step_number` (`1`, `2`, `3`, `4`), `step_title` | Analyse de la compréhension de la méthode de travail. |

---

## 4. Réalisations & Projets Phares

| Nom de l'événement | Déclencheur | Propriétés spécifiques | Objectif métier |
| :--- | :--- | :--- | :--- |
| `project_card_clicked` | Clic sur une carte de projet en vitrine | `project_slug` (`keova-signal`, `debrief`, `devis-assist`), `project_status` | Mesure de l'intérêt pour les cas concrets (B2B, local, BTP). |
| `project_external_link_clicked`| Clic sur le lien de démonstration ou repo GitHub d'un projet | `project_slug`, `target_url` | Intérêt pour la preuve technique et le code source. |
| `project_tag_clicked` | Clic sur un badge technologique d'un projet | `tech_tag` (ex: `python`, `nuxt`, `ocr`, `agents`) | Détection des compétences technologiques recherchées. |

---

## 5. Tunnel de Qualification & Formulaire de Contact (`/contact`)

| Nom de l'événement | Déclencheur | Propriétés spécifiques | Objectif métier |
| :--- | :--- | :--- | :--- |
| `contact_page_viewed` | Arrivée sur la page `/contact` | `origin_cta`, `referrer` | Entrée officielle dans le tunnel de conversion. |
| `contact_field_focused` | Focus initial sur un champ de formulaire | `field_id` (`name`, `email`, `company`, `workflow_desc`, `tools`) | Détection du début effectif de rédaction. |
| `contact_field_completed` | Perte de focus (`blur`) après saisie valide d'un champ | `field_id`, `char_count_bucket` (`<20`, `20-100`, `>100`) | Suivi de la complétion progressive sans enregistrer le texte. |
| `contact_form_submit_attempt`| Clic sur le bouton de soumission du formulaire | `fields_filled_count`, `form_validity` | Mesure de la volonté d'envoi. |
| `contact_form_success` | Confirmation de réception via l'API Web3Forms | `has_company` (booléen), `latency_ms` | **Macro-conversion principale** du site. |
| `contact_form_error` | Échec de l'envoi (réseau ou validation Web3Forms) | `error_status`, `error_message` | Alerting technique sur les frictions de conversion. |
| `direct_email_copied` | Clic pour copier l'adresse email de contact | `email_context` (`footer`, `contact_page`) | Suivi des prises de contact hors formulaire. |
| `linkedin_profile_clicked` | Clic sur le lien vers le profil LinkedIn | `location` (`header`, `footer`, `contact`) | Mesure des redirections vers le canal social professionnel. |

---

## 6. Sous-système Terminal (Interactif & Floating)

| Nom de l'événement | Déclencheur | Propriétés spécifiques | Objectif métier |
| :--- | :--- | :--- | :--- |
| `terminal_window_opened` | Déclenchement de l'ouverture du terminal flottant | `trigger_source` (`header_icon`, `keyboard_shortcut`, `hero_prompt`) | Appétence pour les fonctionnalités avancées/développeur. |
| `terminal_window_closed` | Fermeture de la fenêtre du terminal | `duration_open_seconds`, `commands_count` | Durée moyenne d'exploration du terminal. |
| `terminal_command_executed` | Validation d'une commande dans le terminal | `command_name` (`help`, `whoami`, `systems`, `skills`, `projects`, `contact`), `is_known_command` | Analyse des commandes explorées par les visiteurs techniques. |
| `terminal_invalid_command` | Saisie d'une commande non reconnue | `command_raw_length` | Détection d'intentions ou curiosités non couvertes. |
| `terminal_minimized_maximized`| Changement d'état de la fenêtre terminal | `action` (`minimize`, `maximize`, `restore`) | Ergonomie et comportement de fenêtrage. |

---

## 7. Journal Technique & Blog (`/blog`)

| Nom de l'événement | Déclencheur | Propriétés spécifiques | Objectif métier |
| :--- | :--- | :--- | :--- |
| `blog_article_viewed` | Ouverture d'un article de blog | `article_slug`, `article_title`, `reading_time_est` | Popularité des thématiques d'ingénierie et d'IA. |
| `blog_toc_clicked` | Clic sur un lien de la table des matières interne | `heading_id`, `article_slug` | Navigation ciblée au sein des articles longs. |
| `blog_code_copied` | Clic sur le bouton de copie d'un bloc de code | `code_language`, `article_slug` | Utilité concrète des extraits techniques partagés. |
| `blog_article_finished` | Défilement atteignant la fin d'un article | `article_slug`, `total_seconds` | Taux d'achèvement de lecture des contenus techniques. |

---

## 8. Liens Externes & Footer

| Nom de l'événement | Déclencheur | Propriétés spécifiques | Objectif métier |
| :--- | :--- | :--- | :--- |
| `external_link_clicked` | Clic sur tout composant `<ZExternalLink>` | `destination_domain`, `link_text`, `location` | Cartographie des sorties vers les écosystèmes externes. |
| `footer_legal_clicked` | Clic sur Mentions légales ou Politique de confidentialité | `target_page` (`mentions-legales`, `confidentialite`) | Consultation de la conformité juridique. |

---

## 9. Propriétés Globales Inhérentes à Chaque Événement

Chaque événement émis par le SDK PostHog est enrichi automatiquement avec :
- `locale` : `fr`
- `viewport_width` / `viewport_height` : Dimensions d'écran.
- `screen_category` : `mobile` (<768px), `tablet` (768px-1024px), `desktop` (>1024px).
- `prefers_reduced_motion` : `true` / `false`.
- `app_version` : Numéro de version courant du projet.
