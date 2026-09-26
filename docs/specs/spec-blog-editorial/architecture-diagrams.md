# Diagrammes d'architecture, de visibility et de distribution

> Companion de la SPEC blog éditorial. Les flux T0 sont la cible de la première livraison ; les flux R1 sont conditionnels et ne doivent pas être réintroduits dans T0 par un simple lien ou une configuration de scan.

## 1. Flux brownfield actuel

```mermaid
flowchart LR
  MD[content/blog/*.md] --> Z[content.config.ts]
  Z --> Q[queryCollection blog]
  Q --> H[blog-indexability.ts]
  H --> L[index blog]
  H --> A[article /blog slug]
  H --> P[home journal]
  H --> S[sitemap / robots]
  Q --> M[AI Ready / Markdown]
  M --> LLM[llms.txt / llms-full.txt]
  S --> CI[assertions CI]
  M --> CI
```

## 2. Flux T0 — préparation technique

```mermaid
flowchart TD
  C[Article Markdown minimal] --> V[Contrat éditorial T0]
  V --> R[Resolver partagé de visibility]
  R --> PUB[Publication / exclusion]
  R --> HOME[/ et /blog]
  R --> ART[Article public]
  PUB --> SEO[usePageSeo / BlogPosting]
  PUB --> SITE[Sitemap / robots]
  PUB --> AEO[AI Ready existant]
  HOME --> T0[Gate T0]
  ART --> T0
  SEO --> T0
  SITE --> T0
  AEO --> T0
  T0 --> CLEAN[Suppression des fixtures]
```

T0 ne contient ni hub, ni related, ni lookup projet, ni RSS, ni nouvelle projection AEO.

## 3. Flux R1 — capacités conditionnelles

```mermaid
flowchart TD
  R[Resolver T0 ratifié] --> HUB[Hubs Vue dédiés]
  R --> REL[Related filtré]
  R --> PROJ[Projet par ID public]
  R --> AEO2[AEO étendu par allow-list]
  R --> FEED[RSS si approuvé]
  R --> CUR[featured / navigation]
  HUB --> G[R1 gate par capacité]
  REL --> G
  PROJ --> G
  AEO2 --> G
  FEED --> G
  CUR --> G
```

Chaque branche R1 possède son propre contrat, propriétaire, fixture, assertion et définition de terminé.

## 4. Frontières de responsabilité

```mermaid
flowchart TB
  PAGE[Pages Vue] --> SEO[usePageSeo]
  PAGE --> QUERY[queryCollection]
  QUERY --> HELPER[Helpers publication]
  HELPER --> BUILD[Nitro prerender]
  BUILD --> SITEMAP[Sitemap / robots]
  BUILD --> AEO[AI Ready]
  BUILD --> CI[Gate Docker T0]
  SCAN[Scan nuxt.config] --> BUILD
  CI --> CHECKS[Assertions T0]
  CI --> E1[E1 article réel / probes]
```

`usePageSeo()`, `useSiteUrl()`, les modules Sitemap/Robots, AI Ready et CI restent des propriétaires uniques. Aucun composant T0 ne crée un second `head`, sitemap, robots, resolver ou flux de distribution.

## 5. Resolver de visibility

```mermaid
flowchart TD
  DOC[Document blog] --> D{draft / futur / private?}
  D -->|oui| HIDE[HTML absent]
  HIDE --> PREVIEW[Preview séparée]
  D -->|non| N{noindex / robots false?}
  N -->|oui| PUBLIC[HTML public 200]
  PUBLIC --> HIDDEN[Pas de sélections / découverte]
  N -->|non| S{sitemap false/null?}
  S -->|oui| HTML[HTML public 200]
  HTML --> NOFEED[Pas de sitemap / AEO / RSS]
  S -->|non| ALL[Listes + sitemap + AEO]
```

La matrice complète et ses assertions sont normatives dans `verification-plan.md`. Un état ne peut pas être déduit d'un simple nom de champ sans règle de précédence.

## 6. Relation article / projet — R1

```mermaid
flowchart LR
  SITE[SITE.projects] --> ID[ID public stable]
  MD[Frontmatter project R1] --> LOOKUP[Lookup par ID]
  ID --> LOOKUP
  LOOKUP --> AUTH[Destination autorisée]
  AUTH --> DISPLAY[Contexte projet public]
  DISPLAY --> FILTER[Filtre de visibility]
  FILTER --> LINK[Lien ou contexte sans dépôt privé]
```

T0 ne déclenche ni lookup ni affichage projet. Une correspondance par nom humain est interdite.

## 7. Related — R1

```mermaid
flowchart LR
  EXPLICIT[Related explicite] --> FILTER[Filtre public / indexable]
  PROJECT[Projet R1] --> FILTER
  PILLAR[Pilier] --> FILTER
  TAGS[Tags] --> FILTER
  DATE[Récence] --> FILTER
  FILTER --> DEDUP[Déduplication + self removal]
  DEDUP --> MAX[Maximum 3]
  MAX --> CRAWL[HTML puis crawlLinks]
```

Une relation explicite invalide échoue ; une relation déduite invalide est omise avec avertissement. Le filtre précède le HTML et `crawlLinks`.

## 8. Promotion E1 et rollback

```mermaid
flowchart LR
  REVIEW[FR-18 pass + hash] --> BUILD[Build statique]
  BUILD --> ASSERT[Assertions statiques]
  ASSERT --> CANARY[Promotion contrôlée / canari]
  CANARY --> PROBE[Probes HTTP production]
  PROBE -->|vert| CLOSE[Clôture E1]
  PROBE -->|échec| ROLLBACK[Retour arrière éditorial]
  PROBE -->|fuite / secret| TAKEDOWN[Retrait confidentialité]
```

Le retour arrière éditorial et le takedown confidentialité/sécurité sont distincts. Un simple `git revert` ne constitue pas une preuve de suppression d'une donnée déjà publiée.

## 9. Règles de lecture

- Le resolver est la source de vérité du contrat de publication ; les pages ne doivent pas inventer leur propre filtre.
- Les hubs Vue ne passent pas par `contentRouteState` comme les documents Markdown.
- Les relations sont filtrées avant le rendu afin que `crawlLinks: true` ne puisse pas créer une route non voulue.
- Le RSS est un propriétaire de distribution séparé, jamais un second propriétaire du sitemap ou du canonical.
- Le baseline visuel et de navigation est celui à ratifier au checkpoint Epic 14 ; le blog ne déclenche pas de migration de thème.
