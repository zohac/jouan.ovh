---
id: SPEC-analytics-search-console
updated: 2026-09-25
companions:
  - tracking-plan.md
  - compliance-gdpr.md
  - seo-verification.md
sources: []
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Télémétrie respectueuse de la vie privée, SEO Nuxt, AEO et observabilité Google Search Console

## Why

Suite au déploiement du repositionnement commercial ciblant les systèmes IA et l’automatisation métier, le site `jouan.ovh` ne dispose actuellement d’aucune visibilité sur le trafic et les conversions, ni d’aucun suivi d’indexation dans les moteurs de recherche. L’absence de métriques interdit d’évaluer l’attractivité de la proposition de valeur, d’auditer les parcours de qualification ou de détecter les requêtes de recherche organiques. Ce contrat spécifie l’instrumentation de PostHog Cloud EU, l’activation de Google Search Console et la maintenance SEO/AEO statique. Il met à disposition des capacités de mesure et des contrôles techniques, sans promettre un résultat de classement, de citation ou d’attribution.

## Capabilities

- id: CAP-1
  intent: Le client web initialise PostHog Cloud EU de façon asynchrone uniquement en production et côté navigateur, sans blocage de rendu ni impact sur la génération statique Nitro.
  success: En production, le script client charge `posthog-js` depuis l'hôte EU (`https://eu.i.posthog.com`), la clé d'API publique est injectée via `runtimeConfig.public.posthogKey`, et aucun appel réseau analytics n'est émis en environnement de développement local ou lors de `nuxi generate`.

- id: CAP-2
  intent: Le système active l'enregistrement de sessions (rejeu de session) après consentement explicite pour analyser les points de friction de navigation.
  success: Les sessions utilisateurs sont enregistrées et visionnables sur l’interface PostHog EU après un consentement distinct, avec masquage forcé des champs de saisie, du terminal, des liens de contact et des attributs sensibles (`maskAllInputs: true`, `maskAllElementAttributes: true`, `maskTextSelector: ".ph-no-capture, .terminal, input, textarea"`, `recordBody: false`).

- id: CAP-3
  intent: Le système instrumente un spectre exhaustif d'événements comportementaux et de micro/macro-conversions pour disposer d'un volume de données riche et exploitable avant tri ultérieur.
  success: Sont capturés et envoyés à PostHog : les navigations SPA (`$pageview`), la profondeur de scroll (25%, 50%, 75%, 100%), tous les clics CTA (Hero, cartes de services, offres tarifaires, liens de contact), les interactions avec le terminal (ouverture, commandes saisies, exécutions invalides), les étapes du formulaire Web3Forms (focus, saisie, succès, échec), les clics vers les liens externes (LinkedIn, GitHub, email) et la lecture des articles du blog.

- id: CAP-4
  intent: La collecte analytique et l'enregistrement de sessions garantissent une conformité stricte au RGPD via un mécanisme de consentement explicite (opt-in) sobre et révocable.
  success: L'ingestion est cantonnée à l'infrastructure européenne de PostHog, un composant d'invite de consentement inspiré du terminal permet d'activer séparément la télémétrie et le rejeu de session, les signaux `Do Not Track` et `Global Privacy Control` désactivent automatiquement la collecte, un lien permanent dans le pied de page permet de révoquer chaque choix à tout moment, et la page `/confidentialite` documente les finalités et les durées de conservation vérifiées.

- id: CAP-5
  intent: Le domaine apex `jouan.ovh` est vérifié et monitoré dans Google Search Console via un enregistrement DNS TXT géré chez OVH.
  success: Google Search Console valide la propriété du domaine sur le périmètre DNS global (`jouan.ovh`) sans requérir de balise meta ou de fichier de vérification supplémentaire dans le code source de l'application Nuxt.

- id: CAP-6
  intent: Les moteurs de recherche indexent les routes publiques valides et les articles publiés grâce à un `sitemap.xml` autogénéré et un `robots.txt` déclaratif.
  success: `robots.txt` déclare l’autorisation d’exploration en production et l’indexation est bloquée en staging ; `sitemap.xml` est généré par `@nuxtjs/sitemap` en `zeroRuntime`, contient une seule fois chaque route indexable et chaque article publié, avec des URLs absolues, un HTML statique correspondant et des dates `lastmod` issues de `updated` ou `date` uniquement.

- id: CAP-7
  intent: L'agent IA dispose des capacités de configuration et d'audit PostHog via l'outillage MCP (Model Context Protocol).
  success: La spécification intègre le protocole MCP officiel PostHog (`@posthog/mcp` / wizard PostHog) pour permettre le requêtage et l'administration des métriques et feature flags directement depuis l'environnement agentic.

- id: CAP-8
  intent: L’ensemble des ajouts techniques préserve l’intégrité de la chaîne de compilation Docker et les standards de performance du projet.
  success: La commande de validation `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` passe avec zéro erreur ESLint/Stylelint/TypeScript ; les fichiers SEO attendus sont générés dans `.output/public` et vérifiés par nom, contenu et origine, sans dépendance à un total de routes Nitro instable.

- id: CAP-9
  intent: La maintenance SEO repose sur les modules Nuxt SEO officiels et une configuration de site partagée, au lieu d’un manifeste de routes manuel.
  success: `@nuxtjs/sitemap` et `@nuxtjs/robots` possèdent chacun une seule route, sont chargés avant `@nuxt/content`, alimentent le sitemap via `defineSitemapSchema()`/`defineRobotsSchema()` et les handlers manuels sont supprimés ; le build SSG reste statique et la CI vérifie les artefacts sans hypothèse sur un nombre total de routes.

- id: CAP-10
  intent: Les contenus publics sont exposés dans des formats lisibles par les agents IA, avec une politique de crawl OpenAI explicite et une mesure d’attribution.
  success: `nuxt-ai-ready@2.4.0` produit au build `llms.txt`, `llms-full.txt`, `sitemap.md` et les représentations Markdown des routes publiques éligibles ; `OAI-SearchBot` est autorisé pour la politique de recherche, `GPTBot` est bloqué pour l’entraînement, les sorties ne contiennent aucune valeur de formulaire ni donnée privée et aucune documentation ne promet un classement ChatGPT. La mesure referral est descriptive, conditionnée au consentement et ne constitue pas une attribution causale.

## Constraints

- **Hébergement européen retenu :** l'ingestion et le stockage de la télémétrie utilisent la région Europe de PostHog (`https://eu.i.posthog.com`). Les garanties contractuelles de non-transfert extra-régional doivent être confirmées dans les conditions PostHog applicables ; elles ne sont pas déduites du code seul.
- **Rejeu de session sécurisé :** masquage natif et strict de toute donnée textuelle saisie par l’utilisateur, du terminal et des zones de contact (`maskAllInputs: true`, `maskAllElementAttributes: true`, `maskTextSelector: ".ph-no-capture, .terminal, input, textarea"`, `recordBody: false`).
- **Consentements distincts :** la mesure d'audience et le rejeu de session sont activés séparément via une invite terminal discrète conforme RGPD.
- **Isolation environnementale :** Neutralisation stricte du tracking en développement local et lors des builds SSG.
- **Zéro hardcoding :** Aucune clé, URL de domaine ou secret dans le code ; consommation obligatoire de `NUXT_SITE_URL`/Site Config et de `useSiteUrl()` pour l’origine canonique.
- **Source SEO unique :** une seule implémentation possède `/sitemap.xml` et `/robots.txt` ; les routes manuelles de la tâche 14.4 sont retirées lors de la migration 14.5.
- **Manifeste interdit :** Aucun tableau d’articles ou manifeste de routes manuel ne doit être réintroduit ; la découverte Nuxt Content v3 et le hook de prérenderisation dynamique sont les sources-de-vérité.
- **Découverte statique :** Les routes articles sont prérendues et ne reposent pas sur une source runtime-only pour GitHub Pages.
- **AEO sans promesse :** `llms.txt` et Markdown facilitent la lecture machine mais ne constituent pas un facteur de classement ou une garantie de citation ChatGPT.
- **Version AEO revue :** `nuxt-ai-ready` est verrouillé exactement en `2.4.0` ; la compatibilité est vérifiée avec Nuxt `4.4.8`, `@nuxt/content` `3.14.0`, `better-sqlite3` `12.11.1`, `@nuxtjs/sitemap` `8.5.1`, `@nuxtjs/robots` `6.2.3` et Node Docker `22.23.0`.
- **Configuration statique AEO :** `contentSource: true`, `contentNegotiation: false`, `database: false`, `runtimeSync: false`, `cron: false`, `sitemapMd: true`, `describedby: true` et `llmsTxt.markdownLinks: true` sont explicites ; MCP, WebMCP, API Catalog et Agent Skills sont désactivés.
- **Couverture AEO :** les routes publiques de base et les articles publiés sont exportés ; les noindex, brouillons, futurs et exclusions explicites sont retirés des artefacts AEO après génération. Les pages légales et les coordonnées professionnelles déjà publiques restent des contenus publics.
- **Budgets AEO :** `llms.txt` est plafonné à 64 KiB et `llms-full.txt` à 1 MiB ; la CI échoue au-delà de ces seuils.
- **En-têtes AEO :** `public/_headers` reste la source des règles de sécurité et de cache ; AI Ready ajoute les règles Markdown à la sortie générée et la CI ne recopie jamais le fichier source.
- **Routes internes :** les dumps `__ai-ready` et `__nuxt_content/blog/sql_dump.txt` sont supprimés de la sortie statique ; les autres routes techniques ne sont ni liées ni utilisées comme contenu AEO.
- **Politique OpenAI explicite :** `OAI-SearchBot` et `GPTBot` sont configurés indépendamment ; `ChatGPT-User` est une visite initiée par une personne, pas un crawl automatique ni un contrôle d'accès. Les directives IA volontaires ne remplacent pas un contrôle d’accès.
- **Environnement Docker exclusif :** Tout ajout de dépendance (`posthog-js`, etc.) et exécution d'outils doit s'effectuer dans Docker.
- **Règle NFR6 :** Zéro emoji dans l'ensemble des fichiers, métadonnées, logs et libellés.
- **Performance Core Web Vitals :** Chargement de `posthog-js` en mode différé / asynchrone non bloquant.

## Non-goals

- Ne pas implémenter Google Analytics (GA4) ni de tags publicitaires tiers (Meta Pixel, LinkedIn Insight).
- Ne pas collecter de données nominatives en clair (adresses email, noms d'entreprises) sans consentement explicite.
- Ne pas intégrer de bandeau cookie lourd ou modal bloquant générique (conserver un toast discret et intégré à l'univers terminal du site).
- Ne pas modifier le code Nuxt pour la vérification GSC (déléguée à l'enregistrement DNS TXT chez OVH).
- Ne pas créer de tableau de bord analytics intégré dans l'UI du portfolio.
- Ne pas exécuter de serveur MCP, WebMCP, runtime sync ou base de données de production pour l’AEO sur GitHub Pages.
- Ne pas élargir la collecte PostHog : seuls les paramètres UTM de la whitelist peuvent documenter un referral, après consentement et hors DNT/GPC ; leurs valeurs sont validées comme identifiants de campagne et les emails, téléphones, tokens longs et credentials courts sont neutralisés.
- Définir la mesure sur une période de référence et une période post-déploiement d’au moins quatre semaines ; distinguer sessions referral, conversions, panel de prompts français et contrôles GSC.
- Ne pas déduire une causalité ou un classement d’un fichier `llms.txt`, d’une citation observée ou d’un score de lisibilité machine.
- Ne pas indexer de contenu privé, de données de formulaire ou de secrets dans `llms.txt`, `llms-full.txt` ou les fichiers `.md`.
- Ne pas utiliser `llms.txt` ou un score de lisibilité agent comme promesse de classement, de citation ou de visibilité ChatGPT.

## Success signal

En production, une session consentant aux mesures peut être observée dans PostHog Cloud EU (rejeu de session, champs masqués et événements du plan de taggage). Les artefacts SEO/AEO statiques sont disponibles avec une politique d'exploration IA explicite. La validation de la propriété du domaine apex et la soumission du sitemap dans Google Search Console restent des opérations externes à exécuter ; leur résultat ne doit pas être déduit de la présence des fichiers. La mesure d'effet AEO reste descriptive et ne constitue ni une attribution causale ni une garantie de classement.

## Assumptions

- Simon Jouan ajoute l'enregistrement DNS TXT fourni par Google Search Console sur la zone DNS `jouan.ovh` chez OVH.
- Simon Jouan dispose d'un projet PostHog Cloud EU et fournit sa clé de publication publique (`phc_...`) via la variable d'environnement `NUXT_PUBLIC_POSTHOG_KEY`.
- Simon fournit ou fixe `NUXT_SITE_URL`, `NUXT_SITE_NAME` et `NUXT_SITE_ENV=production` dans le build GitHub Pages afin que les modules SEO et AI Ready utilisent l’origine canonique.
- La CI utilise Node 22 avec une version effective compatible avec le module AI Ready ; la version Docker observée est `22.23.0` et le minimum SQLite documenté est `22.13+` ou le fallback `better-sqlite3` installé.
- La version `nuxt-ai-ready@2.4.0` est revue et verrouillée dans le manifeste et le lockfile ; aucune installation `latest`, mise à jour de Nuxt/Content ou second générateur `llms.txt` n'est suivie.
- La publication GitHub Pages et la vérification HTTP après déploiement sont documentées pour la production ; la validation Google Search Console et la mesure d'effet AEO restent des étapes opératoires distinctes, à consigner lorsqu'elles sont exécutées.
