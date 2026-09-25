# Brownfield — architecture existante et frontière de changement

## État confirmé

Le blog n'est pas un nouveau système. Le dépôt contient déjà une collection Content typée et une route article dynamique :

- `content.config.ts:10-89` déclare la collection `blog` ;
- `app/pages/blog/index.vue:95-98` interroge, filtre et trie la collection ;
- `app/pages/blog/[...slug].vue:93-107` résout un article et `:178-195` applique les erreurs de publication ;
- `app/pages/index.vue:527-533` consomme les trois derniers articles pour la homepage.

Le corpus suivi ne contient actuellement aucun article Markdown : `content/blog/` ne contient que `.gitkeep`. La CI injecte des fixtures temporaires pour valider le contrat SEO/AEO (`.github/workflows/cd.yml:55-180,453-523`).

## Propriétaires à réutiliser

| Domaine | Propriétaire actuel | Règle pour le blog |
| --- | --- | --- |
| Publication/indexabilité | `app/utils/blog-indexability.ts:16-99` | Les listes, hubs, related, RSS et contrôles doivent réutiliser les mêmes règles |
| Données auteur | `app/data/site.ts:13-51` | Ne pas créer de collection authors pour un auteur unique |
| Données projets | `app/data/site.ts:26-38,73-105` | Ajouter une clé publique stable si une relation est retenue |
| SEO page | `app/composables/usePageSeo.ts:34-109` | Étendre l'API ou pré-résoudre les overrides ; ne pas créer un second head |
| JSON-LD article | `app/pages/blog/[...slug].vue:210-259` | Enrichir l'objet `BlogPosting` existant |
| Sitemap/robots | `content.config.ts:67-89`, `server/plugins/seo-content.ts:24-74` | Préserver un propriétaire unique et ajouter les nouvelles routes explicitement |
| AEO | `nuxt.config.ts:118-186,419-464`, plugins AI Ready | Étendre l'allow-list et les assertions seulement pour les champs publics |
| Prérendu Content | `nuxt.config.ts:311-379,531-591` | Garder la synchronisation avec le schéma et les fixtures |
| Design system | `app/components/ui/`, `app/assets/scss/base/_layout.scss` | Composer les primitives existantes ; pas de librairie UI parallèle |

## Frontières à ne pas croiser

### 1. `date` est un contrat transverse

`date` est lu directement par `content.config.ts`, les deux listes, `app/utils/blog-indexability.ts`, le scan de `nuxt.config.ts`, `server/plugins/seo-content.ts`, les exports AEO et la CI. Un changement de nom doit être atomique ou passer par un alias documenté.

### 2. Le catch-all article ne peut pas porter les hubs

`app/pages/blog/[...slug].vue` traite toute route `/blog/**` comme un article. Les hubs doivent être des routes Vue dédiates, par exemple :

```text
app/pages/blog/ia/index.vue
app/pages/blog/engineering/index.vue
app/pages/blog/automatisation/index.vue
```

Un article dont le slug serait `ia`, `engineering` ou `automatisation` ne doit pas être introduit sans arbitrage explicite.

### 3. Le scan Content ne voit pas les hubs Vue

`contentRouteState` ne suit que les fichiers `content/blog/**`. Une page Vue de hub doit donc posséder son propre SEO, son entrée sitemap et son assertion de présence HTML.

### 4. Les relations doivent précéder le crawler

`nuxt.config.ts:613-615` active `crawlLinks: true`. Toute cible `related` doit être résolue et filtrée avant le rendu. Une relation invalide ne doit pas créer une route publique par accident.

### 5. Preview et publication sont distinctes

Le build statique exclut les drafts et routes explicitement non indexables, mais la route article HTML directe ne filtre que la publication (`app/pages/blog/[...slug].vue:178-195`). La politique preview doit être écrite avant d'ajouter une surface de lecture supplémentaire.

## État Git et sequencing

Le working tree contient des changements non commités de l'Epic 14, story 14.6 en revue. Les fichiers `content.config.ts`, `nuxt.config.ts`, les deux pages blog, `usePageSeo`, les plugins serveur, le workflow et les dépendances sont déjà touchés. Le blog doit être traité dans un checkpoint ou worktree séparé après stabilisation d'Epic 14.

## Dépendances

Aucune nouvelle dépendance n'est justifiée par le brief seul. Les capacités de contenu, image, SEO, sitemap, AEO et génération statique sont déjà présentes. Une dépendance de recherche, Mermaid ou flux doit être réévaluée comme décision séparée, après le MVP.

## Phases de migration

### T0

T0 réutilise `content.config.ts`, le resolver de publication, `usePageSeo()`, Site Config, les modules Sitemap/Robots, AI Ready, les composants UI et la gate Docker. T0 ne crée ni hub Vue, ni relation projet, ni related rendu, ni RSS, ni nouvelle projection AEO.

### E1

E1 réutilise le même artefact statique et les mêmes propriétaires. La seule capacité éditoriale nouvelle est la gate FR-18 et la promotion contrôlée d'un article réel.

### R1

R1 peut ajouter des routes Vue, related, relations projet, champs publics AEO ou RSS, mais chaque extension doit réserver ses slugs, définir ses IDs, sa destination, son allow-list, son propriétaire, sa fixture, son filtrage avant crawler, son SEO/sitemap et son test de vie privée avant implémentation.

## État de ratification

Cette révision est approuvée pour le planning. Elle ne débloque pas encore les stories : le checkpoint Epic 14 et la ratification opérationnelle de D-08 doivent être enregistrés avant T0.



- `docs/project-context.md` — stack, règles Docker, DS, SEO/AEO et tests.
- `docs/implementation-artifacts/investigations/blog-editorial-brief-investigation.md` — diagnostic sourcé de l'extension.
- `docs/implementation-artifacts/14-5-migration-stack-nuxt-seo-sitemap-robots-site-config.md` — propriété sitemap/robots.
- `docs/implementation-artifacts/14-6-aeo-ai-ready-llms-markdown-oai-searchbot.md` — distribution AEO et limites de production.
