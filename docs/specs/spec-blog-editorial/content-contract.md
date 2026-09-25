# Contrat de contenu, visibility et matrice de routes

> **Companion normatif révisé le 2026-09-25.** Ce fichier porte les détails exécutables qui dépassent le kernel de `SPEC.md`. Il est aligné sur les phases T0/E1/R1 et ne remplace pas les décisions de rollout du PRD.

## 1. Phases et conventions de publication

### Phases

- **T0 — préparation technique :** contrat minimal, résolution, `/blog`, article, homepage et non-régression SEO/AEO.
- **E1 — lancement éditorial :** article réel, checklist FR-18, promotion contrôlée et probes.
- **R1 — roadmap :** hubs, related, auteur enrichi, projets, AEO étendue, RSS, champs optionnels et analytics enhancements.

### Convention de date T0

- `date` est l'unique champ de publication de T0, au format `YYYY-MM-DD`.
- `updated` est optionnel et doit être supérieur ou égal à `date`.
- `publishedAt` est refusé en T0. Toute introduction ultérieure doit être atomique, versionnée et couverte par une migration de tous les consommateurs.
- La sémantique de publication est Europe/Paris.
- Si une future version accepte les deux champs, une divergence doit échouer ; aucune valeur n'est choisie silencieusement.

### Matrice de migration

| Changement | Découpage requis |
| --- | --- |
| Ajouter `publishedAt` | Schéma, normaliseur, helpers, pages, resolver, scan, AEO, CI et fixtures |
| Renommer `date` | Migration atomique de tous les consommateurs ; pas de modification du seul schéma |
| Ajouter un état de visibility | Schéma, resolver, route article, listes, sitemap, AEO, CI et probes |
| Ajouter un champ public AEO | Allow-list, owner, export, assertion CI et décision de phase |
| Ajouter une relation | Résolution déterministe, filtrage avant crawl, fixture et définition de gate |

## 2. Frontmatter des articles

Les champs obligatoires sont ceux validés par le schéma et le pipeline de publication. Un champ optionnel n'est pas rendu simplement parce qu'il est présent.

| Champ | Type cible | T0 | R1 | Règle |
| --- | --- | --- | --- | --- |
| `title` | string | oui | oui | Unicité dans le corpus public T0 ; unicité par hub à l'ouverture R1 |
| `description` | string | oui | oui | Résumé utilisé par les cartes, listements et métadonnées |
| `date` | `YYYY-MM-DD` | oui | oui | Unique date de publication T0 ; Europe/Paris |
| `updated` | `YYYY-MM-DD` | non | non | Si présent, `updated >= date` ; ne décrit pas une correction cosmétique |
| `author` | enum `simon-jouan` | oui | oui | Résolu depuis `SITE.profile`, jamais une chaîne libre |
| `pillar` | enum fermé | oui | oui | Exactement un pilier : `ai-systems`, `software-engineering`, `automation` |
| `format` | enum fermé | oui | oui | Valeurs machine de la section 3 ; indépendant du pilier |
| `goals` | liste d'enums | optionnel | optionnel | Interne par défaut ; aucun effet T0 sur publication, articles liés ou appel à l'action |
| `tags` | liste de strings | oui | oui | Minuscules, kebab-case, vocabulaire contrôlé |
| `draft` | boolean | oui | oui | `true` signifie non public |
| `visibility` | enum `public/private` | oui | oui | `private` signifie absence de HTML production ; distinct de l'indexabilité |
| `noindex` | boolean | optionnel | optionnel | Article public avec balise `noindex` ; ne signifie pas privé |
| `robots` | boolean/string | optionnel | optionnel | Propriété Nuxt Robots ; ne transforme pas un article en privé |
| `sitemap` | boolean/object | optionnel | optionnel | Propriété Nuxt Sitemap ; n'est pas un contrôle de confidentialité |
| `project` | ID public nullable | non | oui | R1 uniquement ; lookup par ID stable, jamais par nom humain |
| `featured` | boolean | non | oui | Curation homepage R1 ; ne modifie pas la publication T0 |
| `evergreen` | boolean | non | oui | Signal éditorial interne ou public selon gate R1 |
| `image` | `{ src, alt }` | non | oui | `alt` obligatoire ; image locale ou ressource approuvée |
| `read` | string | non | oui | Valeur éditoriale facultative ; aucun calcul automatique T0 |
| `seo` | objet fermé | non | oui | Overrides limités et consommés par `usePageSeo()` ; pas de second head |
| `canonical` | URL absolue ou null | non | oui | Résolue via Site Config ; self-canonical par défaut T0 |
| `related` | liste de slugs | non | oui | R1 ; cibles publiques, filtrées avant rendu et crawl |
| `series` | objet fermé | non | oui | Schéma seulement en R1 ; pas d'UI de séries dans le lot initial |
| `archived` | boolean | non | oui | Traitement éditorial à définir en R1 |

Les champs `goals`, `project`, `featured`, `evergreen`, `image`, `read`, `seo`, `canonical`, `related`, `series` et `archived` ne deviennent pas publics ou distribués automatiquement. Leur visibilité est définie par la phase, la surface et l'allow-list AEO.

## 3. Énumérations et libellés

### Piliers

| Valeur machine | Label public |
| --- | --- |
| `ai-systems` | Systèmes IA |
| `software-engineering` | Ingénierie logicielle |
| `automation` | Automatisation métier |

### Formats

```text
deep-dive
tutorial
lab-note
project-log
opinion
comparison
case-study
reference
```

### Goals

```text
seo
authority
business
memory
```

`goals` est interne par défaut. Il ne devient public que par une décision de phase, de capacité et d'allow-list.

## 4. Relations

### Auteur

La source de vérité reste `SITE.profile`. La valeur frontmatter `simon-jouan` est un identifiant éditorial, pas une duplication du nom, de la bio ou des liens. `/about` est l'URL canonique T0 et R1.

### Projet — R1

`project` doit référencer un ID public stable ajouté à `IProject`. Le resolver ne doit jamais établir de correspondance par nom humain. Le projet ne peut pas exposer de dépôt privé, de chemin interne ou de donnée non publique.

La destination — ancre existante, page projet future ou contexte textuel — doit être approuvée avant R1. T0 n'affiche aucun contexte projet.

### Related — R1

Ordre de résolution :

1. `related` explicite ;
2. même projet ;
3. même pilier ;
4. tags communs ;
5. récence.

Maximum trois suggestions. Le resolver doit :

- supprimer l'article courant ;
- vérifier que la cible existe ;
- vérifier qu'elle est publiée selon la matrice de visibility ;
- ne jamais produire de lien vers un draft, un futur, un article privé ou une cible non autorisée ;
- échouer sur une référence explicite invalide ;
- omettre avec avertissement une relation déduite invalide ;
- filtrer avant le HTML et avant `crawlLinks`.

T0 ne rend aucun related et ne résout aucun projet.

## 5. SEO, AEO et distribution

Le chemin propriétaire reste :

```text
usePageSeo()
  → canonical / Open Graph / Twitter / JSON-LD
Content Sitemap/Robots
  → découverte et exclusions
nuxt-ai-ready
  → Markdown, llms.txt, llms-full.txt, sitemap.md
```

Règles T0 :

- `usePageSeo()` et `useSiteUrl()` sont les propriétaires du canonical et de l'URL résolue.
- `/about` reste canonique ; aucun alias `/a-propos` n'est ajouté.
- Aucun override SEO imbriqué ni canonical top-level concurrent n'est activé en T0.
- `robots` et `sitemap` top-level restent alignés sur les modules Nuxt existants.
- Toute nouvelle projection de champ AEO exige une allow-list et une assertion CI.
- `BlogPosting` utilise l'auteur résolu, `date`, `updated`, l'image, le canonical et les champs réellement rendus.
- Le RSS n'existe pas en T0 et ne remplace jamais sitemap, canonical ou AEO.

## 6. Matrice de routes

| Route | Phase | Rôle | Source | Indexation |
| --- | --- | --- | --- | --- |
| `/` | T0 | Homepage et journal récent | `SITE` + resolver blog | indexable, selon règle Epic 14 |
| `/blog` | T0 | Homepage éditoriale | resolver blog | indexable |
| `/blog/ia` | R1 | Hub Systèmes IA | resolver + route Vue | indexable si approuvé |
| `/blog/engineering` | R1 | Hub Ingénierie logicielle | resolver + route Vue | indexable si approuvé |
| `/blog/automatisation` | R1 | Hub Automatisation métier | resolver + route Vue | indexable si approuvé |
| `/blog/<slug>` | T0/E1 | Article | un document `blog` public | self-canonical ; noindex selon état |
| `/about` | T0/R1 | Auteur | `SITE.profile` + contenus publics | canonique |
| `/rss.xml` | R1 | Flux si approuvé | articles publics | distribution conditionnelle |
| `/projets/<slug>` | R1 | Projet détaillé si approuvé | projet stable + articles publics | décision distincte |

Le catch-all `/blog/[...slug]` reste réservé aux articles. Les hubs ne sont pas des documents Content ordinaires. Les slugs de hubs sont réservés en R1.

## 7. Matrice de visibility T0

La précédence est : `draft`/future/`private` → absence de production ; puis `noindex`/`robots: false` → HTML public mais absence des sélections et artefacts de découverte ; puis `sitemap: false/null` → HTML public et absence de sitemap/AEO/RSS, sans suppression automatique des liens éditoriaux.

| État | HTML production | Listes et homepage | Sitemap / AEO | RSS | Accès direct |
| --- | --- | --- | --- | --- | --- |
| `draft: true` | absent | absent | absent | absent | 404 ; preview séparé |
| article futur | absent | absent | absent | absent | 404 ; preview séparé |
| `visibility: private` | absent | absent | absent | absent | 404 ; preview séparé |
| publié + `noindex: true` | présent avec `noindex` | absent des sélections | absent | absent | 200 |
| publié + `robots: false` | présent avec directive robots | absent des sélections | absent | absent | 200 |
| publié + `sitemap: false/null` | présent | présent, sauf autre règle d'exclusion | absent | absent | 200 |
| publié + indexable | présent | présent | présent | absent tant que R1 RSS n'est pas approuvé | 200 |

Toute combinaison inconnue échoue ou est documentée dans la décision de migration. Une page ne peut pas être publique et privée simultanément.

## 8. Fixtures et gates

### T0

- article publié minimal ;
- article brouillon ;
- article futur ;
- article `visibility: private` ;
- article `noindex: true` ;
- article `robots: false` ;
- article `sitemap: false` ;
- article `sitemap: null` ;
- article imbriqué `index.md` ;
- article sans image pour vérifier le fallback éditorial ;
- aucune fixture hub, related ou projet dans T0.

### E1

- article réel nommé avec preuve et hash ;
- promotion contrôlée et probes post-déploiement ;
- aucun contenu de démonstration promu.

### R1

- fixtures dédiées aux hubs, related, projet, AEO étendue, champs optionnels et RSS si approuvés.

Les fixtures sont locales, QA ou CI temporaires ; elles ne sont jamais versionnées ni déployées en production. Leur suppression est vérifiée par un diff et une recherche de slugs.

## 9. Traçabilité des champs AEO

| Champ | Propriétaire | Sortie autorisée T0 | Sortie R1 | Assertion |
| --- | --- | --- | --- | --- |
| `title` | `usePageSeo` / article | HTML, sitemap, Markdown, AEO | idem | URL, title et slug cohérents |
| `description` | `usePageSeo` / article | HTML, sitemap, Markdown, AEO | idem | description non vide et stable |
| `date` / `updated` | resolver | HTML, JSON-LD, sitemap, Markdown, AEO | idem | dates cohérentes, Europe/Paris |
| `author` | `SITE.profile` | HTML, JSON-LD, Markdown, AEO | idem | auteur unique résolu |
| `pillar` / `format` | resolver | HTML, listes, JSON-LD autorisé | idem + hubs | enum machine valide |
| `project` / `related` | resolver R1 | aucun en T0 | contexte/liens autorisés | public + destination valide |
| `goals` | décision éditoriale | aucun | allow-list explicite | aucun effet T0 |
| champs SEO optionnels | `usePageSeo` | aucun dans T0 | head selon allow-list | un seul head/propriétaire |
