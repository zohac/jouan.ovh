# Addendum — recherche, brownfield et décisions de cadrage

Ce document conserve la profondeur qui ne doit pas alourdir le PRD : recherche externe, observations brownfield, contraintes techniques et options écartées.

## 1. Décisions de cadrage

- Le PRD est destiné à un site public existant, avec une rigueur d'exigences moyenne à élevée mais sans cérémonie de lancement lourde.
- L'entrée retenue est Vision + Features.
- Le mode de découverte est Fast path.
- La hiérarchie éditoriale est : autorité technique, audience qualifiée, support commercial, patrimoine/mémoire technique publique.
- Les succès business et SEO sont descriptifs ; aucune cible chiffrée n'est inventée.
- Le découpage approuvé est T0 préparation technique, E1 publication éditoriale réelle et R1 roadmap conditionnelle.
- Epic 6 est conservé comme baseline historique ; Epic 16 est l'unité backlog ; Epic 14 reste le checkpoint amont.

## 2. Recherche sur l'autorité éditoriale technique

### Observations

- L'autorité vient principalement d'une expérience de première main, d'une analyse, d'une méthode, d'une mesure ou d'une limite documentée ; un résumé générique d'outils ou de tendances n'offre pas la même différenciation.
- Les blogs techniques durables relient souvent des notes, logs, études de cas, synthèses et contenus evergreen en un corpus navigable, plutôt qu'en calendrier d'articles isolés.
- Les études de cas crédibles exposent problème, contraintes, alternatives, méthode, résultat, limites et réutilisation ; les chiffres sans référence initiale ou sans méthode ne sont pas des preuves.
- La découverte combine HTML crawlable, liens internes descriptifs, page auteur, navigation thématique, flux autonome, sources primaires, sitemap et métadonnées structurées.
- La transparence de l'auteur, des dates, des sources, des versions, des incertitudes et des corrections renforce la crédibilité.
- `llms.txt`, Markdown et AEO sont des couches d'accès et de compatibilité ; ils ne constituent pas une autorité ou un raccourci de classement.

### Anti-patterns écartés

- Calendrier de production piloté par le volume de mots-clés.
- Résumés IA génériques ou articles de tendances déconnectés d'un travail réel.
- Case studies avec ROI ou gains spectaculaires sans référence initiale, méthode ou limites.
- Revendication d'expertise sans artefacts inspectables.
- Manipulation de la fraîcheur ou changement artificiel de dates.
- Duplication d'un même article dans plusieurs hubs, tags ou variantes.
- AEO cargo cult : exports, schémas ou réécritures IA utilisés comme promesse de visibilité.
- Processus éditorial si lourd qu'il supprime les détails d'ingénierie, l'incertitude et les limites.
- Ajout prématuré de CMS, recherche, newsletter, tags ou pages projet avant un flux de production durable.

### Sources consultées

- Google Search Central, [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), mise à jour décembre 2025.
- Google Search Central, [Spam policies](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content), orientation 2026.
- Google Search Central, [Optimizing for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), mise à jour juillet 2026.
- Simon Willison, [About, disclosures et colophon](https://simonwillison.net/about/), modèle observable de publication technique personnelle.
- GitHub Engineering, [Better tools made Copilot code review worse](https://github.blog/ai-and-ml/github-copilot/better-tools-made-copilot-code-review-worse-heres-how-we-actually-improved-it/), juillet 2026, exemple de case study avec régression, mesure et limites.

## 3. Implication pour le produit

La recherche ne demande pas une nouvelle fonctionnalité de ranking. Elle renforce une règle de qualité : un article doit pouvoir montrer ce que Simon a construit, testé ou observé, avec un problème, des contraintes, une méthode, des preuves, un résultat ou une absence de résultat explicitée, et des limites.

### Provenance et limite d'usage

Les pages externes ont été consultées le 24 septembre 2026. Elles servent d'observations de terrain et non de exigences normatives. Chaque recommandation du PRD doit être reliée soit à une source brownfield, soit à une décision utilisateur explicite, soit à une déduction explicitement marquée comme hypothèse. Le brief original de la conversation et ses éventuelles nouvelles décisions doivent être versionnés séparément avant la finalisation de la SPEC.

La checklist éditoriale minimale proposée est :

1. Qu'ai-je construit, testé ou observé ?
2. Quel problème et quelles contraintes ont compté ?
3. Quelles preuves soutiennent les affirmations ?
4. Qu'est-ce qui a changé et qu'est-ce qui a échoué ?
5. Qu'est-ce qui est incertain, privé ou non mesuré ?
6. Où le lecteur peut-il aller ensuite ?

### Politique de confiance éditoriale

| Ressource ou action | Première release |
| --- | --- |
| Markdown, code local et images optimisées servies par le site | Autorisé après revue de licence, de secret et d'accessibilité |
| Lien HTTP(S) externe descriptif | Autorisé ; `ZExternalLink`, pas de paramètre de suivi ni donnée personnelle |
| Image distante, iframe, script, tracker ou gestionnaire d'événements | Interdit sans approbation explicite et revue de vie privée |
| HTML brut ou ressource qui charge une tierce partie | Interdit dans la première release |
| Paramètre de requête, URL de suivi ou requête contenant une donnée personnelle | Interdit dans les artefacts et analytics |

- Les sources primaires, versions, environnements et licences sont déclarés dans le corps Markdown lorsque la reproduction en dépend.
- Les liens externes sont descriptifs et ne transmettent pas de donnée personnelle ; les liens ouvrant un nouvel onglet utilisent la primitive d'accessibilité existante.
- Une source privée ou non citable est remplacée par une explication de la méthode, sans exposer le dépôt, le client ou le chemin interne.
- Une référence cassée est corrigée ou explicitement signalée dans la décision éditoriale.

## 4. Brownfield technique

### Stack et contraintes

- Nuxt 4.4.8 et `@nuxt/content` 3.14.
- Génération statique vers GitHub Pages.
- Docker obligatoire pour pnpm, lint, typecheck et generate.
- Design system, tokens, composants UI, `SITE.profile`, `SITE.projects` et Site Config existants.
- `@nuxt/image` pour les images.
- `usePageSeo` et les modules Nuxt SEO, AI Ready et workflow CI déjà présents.

### Sources de vérité

- `SITE.profile` pour Simon Jouan.
- `SITE.projects` pour les projets.
- `content.config.ts` pour la collection blog.
- `app/utils/blog-indexability.ts` pour publication/indexabilité.
- `app/composables/usePageSeo.ts` pour les métadonnées de page.
- `server/plugins/seo-content.ts` pour la réconciliation sitemap.
- `nuxt.config.ts` pour le scan de routes et l'AEO.
- `.github/workflows/cd.yml` pour la gate et les fixtures.

### Risques d'implémentation

- `date` est consommé dans de nombreuses couches ; un renommage non atomique casserait le build ou produirait des métadonnées divergentes.
- `/blog/[...slug]` peut capturer un hub si les hubs ne sont pas des routes Vue dédiées.
- Le scan Content ne voit pas les hubs Vue.
- `crawlLinks: true` peut transformer une relation non filtrée en route pré-rendue.
- Le middleware AEO protège les URLs `.md`, pas les URLs HTML directes.
- Les exclusions sitemap ne garantissent pas actuellement une politique complète d'accès direct.
- Epic 14 modifie plusieurs fichiers que le blog devra ensuite étendre.

## 5. Options écartées

| Option | Raison |
| --- | --- |
| Nouveau CMS | Contenu Git et Content v3 déjà suffisants ; infrastructure inutile |
| Collection auteurs séparée | Un seul auteur et `SITE.profile` existent |
| Collection projets séparée | `SITE.projects` est la source existante ; relation à stabiliser avec un ID |
| Hubs Content ordinaires | Collision avec le catch-all article |
| Deuxième module SEO | `usePageSeo`, Sitemap, Robots et AI Ready ont déjà des propriétaires |
| RSS comme sous-produit AEO | Le flux a son propre contrat de distribution et de MIME |
| Recherche externe ou index vectoriel | Dépendance et complexité incompatibles avec le MVP statique |
| Mermaid, bouton de copie, temps de lecture calculé | Options P2 sans besoin démontré dans le premier lot |

## 6. Décisions de planning appliquées

- Epic 6 passe à `done` comme baseline historique ; aucune story 6.3+ n'est créée.
- Epic 16 « Plateforme éditoriale durable — contrat, publication et patrimoine » est ajoutée en backlog, sans story d'implémentation.
- Epic 14 est `done` pour ses six tâches ; son point de contrôle est réconcilié documentairement, avec des réserves externes suivies. L'ouverture de l'Epic 16 reste conditionnée à la ratification des contrats et à la décision de Simon sur ces réserves.
- La SPEC, `content-contract.md`, `verification-plan.md`, `architecture-diagrams.md` et `brownfield.md` sont alignés sur T0/E1/R1.
- Les stories restent bloquées jusqu'à la ratification opérationnelle des contrats et à la confirmation D-08 au checkpoint Epic 14.

## 7. Source de l'investigation

La source brownfield complète est `docs/implementation-artifacts/investigations/blog-editorial-brief-investigation.md`. Le PRD ne doit pas la remplacer ; il doit utiliser ses conclusions pour éviter de répéter l'audit brownfield.
