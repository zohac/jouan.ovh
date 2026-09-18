---
id: SPEC-analytics-search-console
companions:
  - tracking-plan.md
  - compliance-gdpr.md
  - seo-verification.md
sources: []
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Analytics Privacy-First (PostHog EU) & Observabilité SEO (Google Search Console)

## Why

Suite au déploiement du repositionnement commercial ciblant les systèmes IA et l'automatisation métier, le site `jouan.ovh` ne dispose actuellement d'aucune visibilité sur le trafic et les conversions, ni d'aucun suivi d'indexation dans les moteurs de recherche. L'absence de métriques interdit d'évaluer l'attractivité de la proposition de valeur, d'auditer les parcours de qualification ou de détecter les requêtes de recherche organiques. Ce contrat spécifie l'instrumentation de PostHog Cloud EU (analytics, capture granulaire d'événements et Session Replay) et l'activation de Google Search Console (via enregistrement DNS TXT chez OVH, `sitemap.xml` et `robots.txt`), garantissant une observabilité maximale dès la V1 tout en sanctuarisant la conformité RGPD, la performance SSG et la rigueur Docker du projet.

## Capabilities

- id: CAP-1
  intent: Le client web initialise PostHog Cloud EU de façon asynchrone uniquement en production et côté navigateur, sans blocage de rendu ni impact sur la génération statique Nitro.
  success: En production, le script client charge `posthog-js` depuis l'hôte EU (`https://eu.i.posthog.com`), la clé d'API publique est injectée via `runtimeConfig.public.posthogKey`, et aucun appel réseau analytics n'est émis en environnement de développement local ou lors de `nuxi generate`.

- id: CAP-2
  intent: Le système active l'enregistrement de sessions (Session Replay) dès la première mise en production pour analyser les points de friction de navigation.
  success: Les sessions utilisateurs sont enregistrées et visionnables sur l'interface PostHog EU, avec masquage intégral forcé de tous les champs de saisie, textes de formulaires et attributs sensibles (`mask_all_inputs: true`, `mask_all_element_attributes: true`), garantissant qu'aucune donnée personnelle n'est capturée dans la vidéo de session.

- id: CAP-3
  intent: Le système instrumente un spectre exhaustif d'événements comportementaux et de micro/macro-conversions pour disposer d'un volume de données riche et exploitable avant tri ultérieur.
  success: Sont capturés et envoyés à PostHog : les navigations SPA (`$pageview`), la profondeur de scroll (25%, 50%, 75%, 100%), tous les clics CTA (Hero, cartes de services, offres tarifaires, liens de contact), les interactions avec le terminal (ouverture, commandes saisies, exécutions invalides), les étapes du formulaire Web3Forms (focus, saisie, succès, échec), les clics vers les liens externes (LinkedIn, GitHub, email) et la lecture des articles du blog.

- id: CAP-4
  intent: La collecte analytique et l'enregistrement de sessions garantissent une conformité stricte au RGPD via un mécanisme de consentement explicite (opt-in) sobre et révocable.
  success: L'ingestion est cantonnée à l'infrastructure européenne de PostHog, un composant toast de consentement inspiré du terminal permet d'accepter ou refuser le Session Replay et la télémétrie, le signal `Do Not Track` désactive automatiquement la collecte, un lien permanent dans le footer permet de révoquer son choix à tout moment, et la page `/confidentialite` documente l'ensemble des finalités.

- id: CAP-5
  intent: Le domaine apex `jouan.ovh` est vérifié et monitoré dans Google Search Console via un enregistrement DNS TXT géré chez OVH.
  success: Google Search Console valide la propriété du domaine sur le périmètre DNS global (`jouan.ovh`) sans requérir de balise meta ou de fichier de vérification supplémentaire dans le code source de l'application Nuxt.

- id: CAP-6
  intent: Les moteurs de recherche indexent l'intégralité des 13 routes publiques valides grâce à un `sitemap.xml` autogénéré et un fichier `robots.txt` déclaratif.
  success: La route `https://jouan.ovh/robots.txt` déclare l'autorisation d'exploration et l'URL du sitemap, et `https://jouan.ovh/sitemap.xml` liste dynamiquement l'ensemble des routes publiques et articles de blog avec des URLs absolues générées par `useSiteUrl()`.

- id: CAP-7
  intent: L'agent IA dispose des capacités de configuration et d'audit PostHog via l'outillage MCP (Model Context Protocol).
  success: La spécification intègre le protocole MCP officiel PostHog (`@posthog/mcp` / wizard PostHog) pour permettre le requêtage et l'administration des métriques et feature flags directement depuis l'environnement agentic.

- id: CAP-8
  intent: L'ensemble des ajouts techniques préserve l'intégrité de la chaîne de compilation Docker et les standards de performance du projet.
  success: La commande de validation `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` passe avec zéro erreur ESLint/Stylelint/TypeScript, et les 13 routes statiques sont générées dans `.output/public` avec leurs artefacts SEO conformes.

## Constraints

- **Hébergement européen strict :** Ingestion et stockage des données analytics exclusivement sur la région Europe de PostHog (`https://eu.i.posthog.com`).
- **Session Replay sécurisé :** Masquage natif et strict de toute donnée textuelle saisie par l'utilisateur (`mask_all_inputs: true`).
- **Consentement opt-in :** Activation du Session Replay et des cookies conditionnée au consentement explicite via un bandeau discret terminal conforme RGPD.
- **Isolation environnementale :** Neutralisation stricte du tracking en développement local et lors des builds SSG.
- **Zéro hardcoding :** Aucune clé ou URL en dur dans le code ; consommation obligatoire de `runtimeConfig.public` et `useSiteUrl()`.
- **Environnement Docker exclusif :** Tout ajout de dépendance (`posthog-js`, etc.) et exécution d'outils doit s'effectuer dans Docker.
- **Règle NFR6 :** Zéro emoji dans l'ensemble des fichiers, métadonnées, logs et libellés.
- **Performance Core Web Vitals :** Chargement de `posthog-js` en mode différé / asynchrone non bloquant.

## Non-goals

- Ne pas implémenter Google Analytics (GA4) ni de tags publicitaires tiers (Meta Pixel, LinkedIn Insight).
- Ne pas collecter de données nominatives en clair (adresses email, noms d'entreprises) sans consentement explicite.
- Ne pas intégrer de bandeau cookie lourd ou modal bloquant générique (conserver un toast discret et intégré à l'univers terminal du site).
- Ne pas modifier le code Nuxt pour la vérification GSC (déléguée à l'enregistrement DNS TXT chez OVH).
- Ne pas créer de tableau de bord analytics intégré dans l'UI du portfolio.

## Success signal

Une session de navigation sur `https://jouan.ovh` en production est capturée avec succès dans PostHog Cloud EU (restitution de la session en replay avec inputs masqués et remontée de l'ensemble des événements du plan de taggage), et Google Search Console valide la propriété du domaine apex tout en explorant le sitemap sans anomalie.

## Assumptions

- Simon Jouan ajoute l'enregistrement DNS TXT fourni par Google Search Console sur la zone DNS `jouan.ovh` chez OVH.
- Simon Jouan dispose d'un projet PostHog Cloud EU et fournit sa clé de publication publique (`phc_...`) via la variable d'environnement `NUXT_PUBLIC_POSTHOG_KEY`.
- Pour l'outillage MCP, une clé API personnelle PostHog (`POSTHOG_API_KEY`) avec le preset "MCP Server" sera mise à disposition de l'agent.
