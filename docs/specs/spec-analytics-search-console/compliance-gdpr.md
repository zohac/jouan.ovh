# Conformité RGPD, Protection de la Vie Privée & Session Replay

Ce document formalise les garde-fous juridiques et techniques garantissant que l'instrumentation PostHog EU et l'activation du Session Replay sur `jouan.ovh` respectent strictement le RGPD et la vie privée des visiteurs.

---

## 1. Hébergement Européen & Souveraineté

- **Point d'ingestion & stockage :** PostHog Cloud région Union Européenne (`https://eu.i.posthog.com`).
- **Hébergement retenu :** le projet utilise la région Union Européenne de PostHog (`https://eu.i.posthog.com`). Les garanties contractuelles de non-transfert extra-régional doivent être confirmées dans les conditions PostHog applicables ; elles ne sont pas déduites du seul code applicatif.
- **Aucune monétisation :** Aucune donnée n'est cédée, croisée ou revendue à des tiers ou régies publicitaires.

---

## 2. Configuration Sécurisée du Session Replay

Le Session Replay est activé dès la première livraison pour observer l'ergonomie et la fluidité des parcours de navigation, sous réserve des règles strictes suivantes :

### A. Masquage forcé des saisies (Data Masking)

- `maskAllInputs: true` : tout contenu tapé par le visiteur dans un `<input>` ou un `<textarea>` (nom, email, description de processus métier) est systématiquement masqué par des astérisques lors de la capture vidéo.
- `maskAllElementAttributes: true` : Les attributs DOM pouvant véhiculer des informations d'état personnel sont neutralisés.
- `maskTextSelector: ".ph-no-capture, .terminal, input, textarea"` : le terminal et les zones explicitement exclues sont masqués, en plus des champs de saisie.
- `recordBody: false` : les corps de requêtes réseau ne sont pas capturés par le replay.

### B. Balisage explicite d'exclusion sur le formulaire de contact

Les champs du formulaire de contact dans [`app/pages/contact/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/contact/index.vue) intègrent la classe CSS native `ph-no-capture` de PostHog. Même en cas de régression de configuration globale, le SDK ignore physiquement les données de ces éléments.

---

## 3. Minimisation des Données & Anonymat

- **Pas d'identification nominale (`posthog.identify`) :** Aucun profil utilisateur n'est enrichi avec l'adresse email, le nom ou la société du visiteur, même après la soumission réussie d'un formulaire. L'identifiant PostHog demeure un UUID aléatoire anonyme.
- **Anonymisation de l'adresse IP :** l'adresse IP complète n'est pas envoyée dans la charge utile analytics ; l'identifiant PostHog aléatoire et les propriétés de navigation restent des données pseudonymes, pas une absence de donnée personnelle.
- **Stockage local maîtrisé :** `persistence: 'localStorage'` est utilisé, avec `opt_out_persistence_by_default: true` ; aucun cookie traceur inter-sites n'est activé.

---

## 4. Gestion du Consentement & Bandeau Cookie "Terminal"

### A. Pourquoi le bandeau est obligatoire (Règle CNIL / ePrivacy)

Si la simple mesure d'audience anonymisée bénéficie d'une exemption CNIL, **l'activation du Session Replay (enregistrement vidéo de session) requiert obligatoirement un consentement préalable explicite (opt-in)** selon les lignes directrices européennes.

### B. Spécification du Bandeau Cookie / Télémétrie

Pour préserver l'univers esthétique épuré de `jouan.ovh`, le bandeau prend la forme d'un toast discret inspiré du terminal :

- **Design System :** Boîtier flottant en bas de l'écran, fond sombre aubergine (`--surface-raised`), bordure fine (`--border-subtle`), typographie monospace pour l'invite (`// telemetry:`).
- **Zéro Emoji (NFR6) :** Aucun pictogramme superflu, uniquement texte clair et actions univoques.
- **Actions claires :**
  - `Mesure uniquement` active la mesure d'audience et laisse le Session Replay désactivé.
  - `Mesure + replay` active les deux traitements après un consentement explicite distinct dans le texte.
  - `Refuser` désactive les deux traitements et coupe la persistance.
  - `En savoir plus` renvoie vers `/confidentialite`.
- **Comportement technique :**
  - PostHog est initialisé en attente (`opt_out_capturing_by_default: true`) ; le Session Replay reste suspendu tant que son consentement séparé n'est pas accordé.
  - Les choix sont mémorisés dans `localStorage` (`jouan_consent_telemetry` et `jouan_consent_replay`).
  - Les signaux `navigator.doNotTrack`, `navigator.msDoNotTrack`, `window.doNotTrack` et `navigator.globalPrivacyControl` désactivent la mesure.
  - Un bouton d'action dans le Footer (`Gestion des cookies`) permet de révoquer chaque choix à tout instant conformément au RGPD.

---

## 5. Mise à Jour de la Page Politique de Confidentialité

La page [`app/pages/confidentialite.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/confidentialite.vue) est enrichie pour mentionner :

1. L'utilisation de **PostHog Cloud EU** pour l'amélioration continue de l'ergonomie et la détection d'erreurs techniques.
2. Des consentements distincts pour la mesure d'audience et le Session Replay, avec masquage des champs de saisie, du terminal et des zones de contact.
3. La neutralisation automatique en cas de signal Do Not Track ou Global Privacy Control.
4. Une rétention de 30 jours pour les enregistrements de session ; la durée des événements analytics reste celle du projet PostHog et n'est pas présentée comme 30 jours par le site.

---

## 6. Crawlers IA et artefacts AEO

La story 14.6 ajoute une couche de lisibilité machine pour les contenus déjà publics :

- `OAI-SearchBot` est autorisé dans `robots.txt` pour la politique de recherche ChatGPT. Cette autorisation décrit une règle de crawl ; elle ne garantit ni la découverte d'une URL, ni sa citation, ni une réponse dans ChatGPT.
- `GPTBot` est bloqué dans `robots.txt` afin d'exclure le contenu public de l'entraînement des modèles, selon la politique respectueuse de la vie privée retenue.
- `ChatGPT-User` correspond à une visite initiée par une personne. Il n'est pas utilisé pour un crawl automatique et ne constitue pas un contrôle d'accès ; OpenAI précise que les règles `robots.txt` peuvent ne pas s'y appliquer.
- `Content-Signal` et `Content-Usage`, lorsqu'ils sont présents, restent des indications volontaires. Ils ne remplacent pas les directives OpenAI par user-agent, ne constituent pas une garantie de sécurité et ne garantissent pas une visibilité ou une citation.
- `llms.txt`, `llms-full.txt`, `sitemap.md` et les jumeaux `.md` sont des copies de contenus publics déjà indexables. Ils n'incluent ni valeur de formulaire, ni nom ou message soumis par un visiteur, ni secret, ni cookie, ni donnée d'analytics, ni contenu privé, endpoint technique ou composant de terminal.
- Les pages légales et les coordonnées professionnelles déjà publiées restent des contenus publics. La politique de confidentialité est elle-même lisible dans l'export afin que les agents puissent comprendre les limites de la collecte ; cela ne transforme pas une donnée publique en donnée personnelle de visiteur.

Les routes noindex, brouillons, articles futurs et entrées explicitement exclues du sitemap ne sont pas publiées dans les artefacts AEO. Les dumps internes AI Ready et le dump technique `__nuxt_content/blog/sql_dump.txt` sont retirés de la sortie statique ; les artefacts publics ne doivent donc pas exposer de contenu exclu par une URL technique non liée.

## 7. Mesure du trafic referral ChatGPT

La whitelist de `useAnalytics()` conserve uniquement `utm_source`, `utm_medium`, `utm_campaign`, `utm_term` et `utm_content`. Les valeurs sont filtrées : emails, téléphones, tokens longs, credentials courts, espaces et caractères non compatibles avec un identifiant de campagne sont remplacés par `[redacted]` ou ignorés. Après consentement explicite et hors Do Not Track/GPC, une session provenant de ChatGPT Search peut donc être identifiée par `utm_source=chatgpt.com` dans la propriété sérialisée `$pageview.query_params`.

La collecte ne reçoit ni contenu de formulaire, ni nom, ni adresse email, ni message, ni token. Une session sans UTM, un refus de consentement ou un signal Do Not Track/GPC ne produit pas de mesure PostHog exploitable. La présence d'un UTM ne prouve pas une visite assistée par ChatGPT.

Le protocole d'observation comprend une période de référence et une période post-déploiement d'au moins quatre semaines. Les contrôles sont :

- les sessions referral identifiées par `utm_source=chatgpt.com` ;
- les conversions qualifiées, notamment la soumission réussie du formulaire ;
- un panel fixe de prompts français, avec URL mentionnée, exactitude de la réponse et citation correcte ou non ;
- les pages et requêtes visibles dans Google Search Console, comme indicateur organique de contrôle ;
- les vérifications techniques de couverture, de liens, de doublons et de taille des artefacts.

Ces observations décrivent une tendance et ne constituent ni une attribution causale, ni une garantie de classement, de citation ou de visibilité. Un changement de `robots.txt` peut également être pris en compte avec un délai par les moteurs.

## 8. Limites des preuves actuelles

- La configuration du replay, les exclusions DOM et une session de production sont vérifiées ; l'inspection visuelle du rendu de la vidéo n'est pas exposée par les outils MCP.
- La rétention de 30 jours concerne les enregistrements de session. La durée effective des événements analytics doit être relevée dans le projet PostHog avant d'en tirer une conclusion.
- La mesure d'effet AEO et la validation Google Search Console restent des opérations distinctes, non déduites de la génération des artefacts.
