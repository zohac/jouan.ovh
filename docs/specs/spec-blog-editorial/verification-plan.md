# Plan de vérification Docker T0/E1/R1

> Companion de validation de la SPEC blog éditorial. Il ne vaut pas autorisation de modifier le code avant ratification des contrats et du checkpoint Epic 14.

## 1. Préconditions

1. Epic 14 est revu, réconcilié et enregistré dans un checkpoint propre.
2. La SPEC, le content-contract, le PRD et la proposition de sprint sont versionnés.
3. Les décisions D-01 à D-08 sont ratifiées ; D-08 a été confirmée au checkpoint Epic 14 le 2026-09-26.
4. Les fixtures sont temporaires, marquées, non versionnées et supprimées après validation.
5. Aucun `pnpm`, `npm`, `yarn` ou `nuxi` n'est lancé sur l'hôte.

## 2. Gate Docker commune

Commande obligatoire pour T0 :

```sh
docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
```

La commande doit terminer avec le code `0` et exécuter ESLint, Stylelint, vue-tsc et la génération statique Nitro sans erreur.

Si un serveur de développement tourne pendant la génération :

```sh
docker compose restart web
```

## 3. Gate T0 — Préparation technique

### Fixtures minimales

Créer dans un checkout local ou une branche QA temporaire :

- article publié minimal avec `title`, `description`, `date`, `author`, `pillar`, `format`, `tags`, `draft` et `visibility` ;
- article `draft: true` ;
- article à venir ;
- article `visibility: private` ;
- article `noindex: true` ;
- article `robots: false` ;
- article `sitemap: false` ;
- article `sitemap: null` ;
- article imbriqué `index.md` ;
- article sans image pour vérifier le fallback éditorial ;
- goals présent mais interne, sans effet de publication ou de classement.

T0 ne crée pas de fixture hub, related, projet ou RSS. Ces fixtures sont R1.

### Assertions statiques T0

Vérifier dans `.output/public` :

- `index.html` ;
- `blog/index.html` ;
- le HTML de l'article public ;
- les jumeaux Markdown des routes publiques concernées ;
- `sitemap.xml` ;
- `robots.txt` ;
- `llms.txt` ;
- `llms-full.txt` ;
- `sitemap.md` ;
- `CNAME` ;
- `_headers`.

Vérifier ensuite :

- `/blog` affiche la promesse et les trois derniers articles publics triés par date décroissante ;
- l'empty state est explicite sans corpus public ;
- la homepage affiche seulement les articles autorisés et conserve son comportement actuel ;
- les articles brouillons, futurs et privés sont absents des listes et artefacts publics ;
- `noindex`, `robots: false` et `sitemap: false/null` suivent exactement la matrice de visibility ;
- aucune fixture n'est présente dans le bundle de production ;
- les dates HTML, JSON-LD, sitemap, Markdown et AEO sont cohérentes ;
- le canonical et l'URL effectivement servie utilisent la source Site Config et la politique ratifiée ;
- `CNAME` contient exactement `jouan.ovh` ;
- les budgets AEO restent respectés ;
- aucun nouveau événement, propriété ou paramètre analytics n'est ajouté.

### Validation navigateur T0

Effectuer un smoke test desktop 1280 px et mobile 375 px sur :

- `/` ;
- `/blog` ;
- `/blog/<article-publié>` ;
- `/about`.

Contrôler :

- hiérarchie `h1` → `h2` → `h3` ;
- clavier, focus visible et tabulation ;
- contrastes, textes alternatifs et liens externes accessibles ;
- code long, tableaux et taxonomie sans overflow horizontal ;
- images responsives et fallback sans image ;
- baseline du design system à ratifier au checkpoint Epic 14 ;
- terminal sanctuarisé ;
- `forced-colors` ;
- `prefers-reduced-motion` ;
- appel à l'action sans lien vers un contenu privé ou non public.

La gate T0 est bloquante pour la story technique. Elle ne vaut pas preuve d'autorité éditoriale.

## 4. Gate E1 — Lancement éditorial

E1 commence après T0 vert.

1. Sélectionner un article réel nommé.
2. Vérifier sa provenance, ses sources, licences, limites et données privées.
3. Calculer le hash de la version soumise.
4. Remplir la checklist FR-18 versionnée dans `docs/implementation-artifacts/editorial-reviews/<slug>.md`.
5. Obtenir un résultat `pass` de Simon ; toute modification de date, hash, source ou limite invalide le pass.
6. Construire l'artefact statique et vérifier la promotion contrôlée.
7. Déployer sur l'environnement de promotion prévu.
8. Exécuter les probes HTTP post-déploiement sur `/`, `/blog`, l'article, le canonical, le sitemap, robots et les artefacts Markdown/AEO.
9. Vérifier l'absence de fixture, de secret, de donnée privée et de relation non autorisée.
10. Consigner le commit, le hash, l'artefact, les probes et la décision de clôture.

Un article réel non approuvé ne peut pas être promu. Une fixture ne satisfait pas E1.

## 5. Gate R1 — Capacités conditionnelles

Chaque capacité R1 possède sa propre gate et ne peut pas être incluse implicitement dans T0/E1.

| Capacité | Précondition | Fixture/preuve minimale |
| --- | --- | --- |
| Hubs | Slugs réservés, routes Vue, precedence et discovery owner | HTML, canonical, sitemap et état vide de chaque hub |
| Related | Deux articles publics, ordre, tie-break et invalidation | Cibles valides/invalides, déduplication, crawl filtering |
| Auteur/projet | ID public, destination autorisée, privacy review | Page auteur, contexte projet et absence de fuite |
| AEO étendue | Allow-list champ → owner → output → assertion | Artefacts AEO et absence de champ privé |
| RSS | Owner statique, path, MIME, champs item et exclusions | XML, Content-Type, discovery et exclusions |
| Analytics enhancements | Revue privacy et dictionnaire de données | Consentement, minimisation, rétention et no-diff |
| Curation/navigation | Source de vérité et propriétaire de navigation | Homepage/header/footer et comportement responsive |

## 6. Rollback et takedown

### Retour arrière éditorial

Déclencheur : régression de contenu, route, canonical, date ou distribution sans secret ni donnée personnelle.

- identifier le dernier commit et le dernier artefact statique validés ;
- régénérer et redéployer l'artefact précédent ;
- rejouer HTML, Markdown, sitemap, robots et AEO ;
- consigner le résultat.

### Retrait de confidentialité et de sécurité

Déclencheur : secret, donnée personnelle, dépendance compromise ou contenu non autorisé.

- arrêter la promotion et classifier l'incident ;
- révoquer et renouveler les secrets exposés ;
- purger les artefacts générés et caches contrôlés ;
- demander le retrait aux surfaces tierces lorsque cela est possible ;
- servir 404 ou 410 selon le runbook ;
- documenter le risque résiduel de l'historique Git, des anciens déploiements et des caches externes ;
- consigner propriétaire, impact, nettoyage, limites et preuve.

Un revert Git seul ne vaut pas takedown de confidentialité.

## 7. Promotion contrôlée

- Aucun article réel n'est promu avant build, assertions statiques, revue navigateur/a11y et bundle de promotion verts.
- La première publication suit un déploiement contrôlé ou canari.
- Un probe post-déploiement obligatoire confirme les codes HTTP, le canonical, le sitemap, robots et les artefacts Markdown/AEO avant clôture E1.
- Un échec de probe déclenche le retour arrière ou le takedown approprié.

## 8. Rapport de vérification

Consigner dans le Dev Agent Record et, pour E1, dans le dossier éditorial :

- commit ou checkpoint de départ ;
- version de SPEC/PRD/content-contract/verification-plan ;
- commande Docker exacte et code de sortie ;
- fixtures utilisées, supprimées et preuve de nettoyage ;
- liste des fichiers générés inspectés ;
- matrice visibility × surface × statut HTTP ;
- résultats desktop/mobile et a11y ;
- checklist FR-18 et hash de l'article réel pour E1 ;
- résultats HTTP production ;
- décisions manuelles restantes et propriétaire de chaque limite.

## 9. Critères de sortie

### T0

La story technique est terminable seulement si la gate Docker, les assertions T0, la revue navigateur/a11y, la non-régression homepage et la suppression des fixtures sont documentées.

### E1

La publication éditoriale est terminable seulement si l'article réel passe FR-18, la promotion contrôlée et les probes post-déploiement. Un article sans preuve ou une fixture ne sont pas acceptés.

### R1

Une capacité R1 est terminable seulement si sa précondition, sa fixture, son owner, son assertion, sa gate et sa preuve de non-régression sont explicites.
