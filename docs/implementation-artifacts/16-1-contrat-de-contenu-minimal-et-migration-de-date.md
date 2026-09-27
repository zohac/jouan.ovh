# Story 16.1: Contrat de contenu minimal et migration de date

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a mainteneur de la plateforme éditoriale,
I want un schéma de collection Content typé et déterministe qui valide le contrat minimal des articles T0,
so that aucun article invalide, ambigu ou daté selon deux règles concurrentes n'atteigne jamais les surfaces publiques.

**Epic :** 16 — Plateforme éditoriale durable (gate T0)
**FR couverts :** FR55 (contrat de contenu minimal), FR60 (contrat de date) — PRD `FR-1`, `FR-3` (contrat de date)
**NFR :** NFR21 (design system — non applicable ici, aucun UI), NFR17 (pnpm strict)

## Acceptance Criteria

1. **Champs requis T0 acceptés.** Le schéma `blog` accepte exactement `title`, `description`, `date`, `author`, `pillar`, `format`, `tags`, `draft`, `visibility`. `title`, `description` et `path` sont déjà fournis par `type: "page"` — ne pas les redéclarer.

2. **Enums fermés.** `pillar` ∈ `ai-systems` | `software-engineering` | `automation`. `format` ∈ `deep-dive` | `tutorial` | `lab-note` | `project-log` | `opinion` | `comparison` | `case-study` | `reference`. `visibility` ∈ `public` | `private`. `author` = `simon-jouan` (identifiant unique). `goals` ∈ `seo` | `authority` | `business` | `memory`, optionnel.

3. **`tags` kebab-case.** Minuscules, tirets, non vides. Vocabulaire contrôlé, pas de capitalisation.

4. **`date` seul champ de publication.** Format `YYYY-MM-DD`, date calendaire réelle (rejeter `2026-02-30`), sémantique Europe/Paris. `publishedAt` est **refusé avec une erreur explicite**, pas ignoré.

5. **`updated` conditionnel.** Optionnel ; si présent, `updated >= date`. La date de publication reste immuable.

6. **`goals` inerte.** Accepté mais sans effet sur la publication, le classement ou un appel à l'action. Aucun code de lecture ne doit en dépendre en T0.

7. **Erreur de validation explicite.** Une valeur d'enum invalide échoue avec un message nommant le champ et les valeurs acceptées. Aucun build partiel.

8. **Unicité de `title` dans le corpus public.** Deux articles publiés distincts ne peuvent pas partager le même `title`. **⚠️ Non implémentable en Zod** — voir Dev Notes § « Unicité de titre ».

9. **Limites de phase.** Les champs R1 (`project`, `featured`, `evergreen`, `seo`, `canonical`, `related`, `series`, `archived`) ne sont **pas** introduits en T0.

## Tasks / Subtasks

- [ ] **T1 — Inventorier les consommateurs du schéma avant de toucher quoi que ce soit** (préalable à tout)
  - [ ] T1.1 Lire `content.config.ts` en entier (101 lignes) avant d'éditer
  - [ ] T1.2 Confirmer que `isIndexableBlogEntry` n'est **pas** modifié par cette story (voir § Interdits)
  - [ ] T1.3 Vérifier `docker compose up` tourne ou lancer la commande ponctuelle

- [ ] **T2 — Étendre le schéma Zod** (AC: #1 #2 #3 #4 #5 #6 #7 #9)
  - [ ] T2.1 Ajouter `author: z.literal("simon-jouan")`
  - [ ] T2.2 Ajouter `pillar: z.enum([...])`
  - [ ] T2.3 Ajouter `format: z.enum([...])`
  - [ ] T2.4 Ajouter `visibility: z.enum(["public", "private"]).default("public")`
  - [ ] T2.5 Ajouter `goals: z.array(z.enum([...])).optional()`
  - [ ] T2.6 Durcir `tags` : `z.array(z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, ...))` — remplacer le `z.array(z.string()).default([])` actuel
  - [ ] T2.7 **Refuser `publishedAt`** : ajouter une refinement qui lève si la clé est présente
  - [ ] T2.8 **Supprimer `sitemapExcluded`** — champ mort, jamais écrit (voir Dev Notes)
  - [ ] T2.9 **Préserver `updatedAt`** — NE PAS le supprimer (voir Dev Notes, piège critique)

- [ ] **T3 — Unicité de `title` dans le corpus public** (AC: #8)
  - [ ] T3.1 Implémenter dans le hook `content:file:afterParse` de `nuxt.config.ts`, **en réutilisant le pattern `contentSourcePathByRoute` déjà présent** (lignes 676-682)
  - [ ] T3.2 Filtrer sur le statut public via `isPublishedBlogEntry(context.content)` — un brouillon peut partager un titre avec un publié
  - [ ] T3.3 Lever une erreur nommant les deux sources en collision
  - [ ] T3.4 Réinitialiser la map entre deux scans, sinon le cache SQLite rend le check non fiable (voir Dev Notes)

- [ ] **T4 — Valider** (AC: #1 à #9)
  - [ ] T4.1 `docker compose run --rm web sh -c "corepack enable && pnpm typecheck"` → code 0
  - [ ] T4.2 Même commande avec `pnpm lint` → 0 ESLint, 0 Stylelint
  - [ ] T4.3 `pnpm generate` → code 0, `/blog` toujours pré-rendu
  - [ ] T4.4 Créer une fixture temporaire conforme, valider, puis **supprimer** et vérifier par `git status` + recherche de slugs
  - [ ] T4.5 Vérifier qu'un `publishedAt` présent fait bien échouer le build, et qu'un `format: deep-dive` invalide échoue aussi

## Dev Notes

### 🚨 Piège 1 — `read` est consommé en 3 endroits, dont le JSON-LD

Le contrat `content-contract.md:55` marque `read` comme **T0 = non**. Le PRD §12 interdit le
« temps de lecture **calculé** ». Mais `read` est un champ **manuel**, et il est **lu en production** :

```
app/pages/blog/index.vue:37        <template v-if="article.read">
app/pages/blog/index.vue:39          <span>{{ article.read }} de lecture</span>
app/pages/blog/[...slug].vue:23    <template v-if="page.read">
app/pages/blog/[...slug].vue:115   reading_time_est: article.read ?? null,   ← DANS le JSON-LD BlogPosting
```

**Décision par défaut : NE PAS retirer `read` en T0.** Le garder comme champ optionnel inchangé.
Pourquoi : le PRD interdit le *calcul*, pas la *valeur éditoriale* ; `content-contract.md:55` dit
lui-même « Valeur éditoriale facultative ; aucun calcul automatique T0 ». Le retirer casse
`reading_time_est` dans le JSON-LD (donnée structurée livrée par l'Epic 12) et deux templates.

**Ce qu'il ne faut surtout pas faire :** ajouter un calcul automatique de temps de lecture. C'est un
non-goal PRD §12, et la maquette courante l'affiche — donc la tentation est réelle.

**Question ouverte pour Simon** : `read` sort-il du contrat en T0 ou reste-t-il optionnel jusqu'à R1 ?
Voir § Questions ouvertes.

### 🚨 Piège 2 — l'unicité de `title` est impossible en Zod

Zod valide **un document**. L'AC exige une garantie **à l'échelle de la collection**.
Un `.refine()` / `.superRefine()` dans `content.config.ts` n'a pas accès aux autres articles et ne
peut pas les voir.

**Le codebase contient déjà la solution** : `content:file:afterParse` (`nuxt.config.ts:656`)
maintient une `Map` de routes → source et **lève déjà** sur collision :

```ts
// nuxt.config.ts:678-684 — pattern à réutiliser tel quel
const existing = contentRouteState.get(normalizedPath);
if (existing?.source && source && existing.source !== source) {
  throw new Error(`[content] Collision de route Content : ${normalizedPath}.`);
}
if (source) {
  contentSourcePathByRoute.set(normalizedPath, source);
}
```

Répliquer ce pattern avec une `Map<title, source>` filtrée sur le statut public.

**⚠️ Subtilité SQLite :** le commentaire de `scanContentRouteState` (`nuxt.config.ts:399-404`) dit
que le cache peut réutiliser une entrée parsée **sans rejouer** `content:file:afterParse`. Une map
accumulée au niveau module peut donc être obsolète ou compter deux fois le même article. Réinitialiser
la map au début de
chaque scan, ou accepter que le check s'exerce au premier parse et documenter la limite.

### 🚨 Piège 3 — `updatedAt` n'est pas dans le contrat mais est requis par l'AEO

`content-contract.md` ne liste **pas** `updatedAt`. Le supprimer en « alignant le schéma sur le
contrat » casserait `nuxt-ai-ready` :

```
nuxt.config.ts:189-193   lit sourceData.updated → écrit generatedData.updatedAt
nuxt.config.ts:689-695   le hook afterParse dérive updatedAt depuis updated
```

`updatedAt` est un **alias interne dérivé**, jamais une source éditoriale. **Le conserver tel quel.**

### `visibility` sera accepté mais non appliqué

`isIndexableBlogEntry` (`app/utils/blog-indexability.ts`) ne connaît **pas** `visibility` : il ne
traite que `date`, `draft`, `noindex`, `robots`, `seo.robots` et `sitemap`. Après cette story, un
article `visibility: private` est donc **public**.

C'est **attendu et sans risque immédiat** : la story 16.2 implémente le resolver, et les fixtures
n'arrivent qu'en 16.6. Mais ne pas livrer 16.1 seule en production, et le documenter explicitement.

### Interdits absolus pour cette story

| ❌ Interdit | Pourquoi |
|---|---|
| Modifier `isIndexableBlogEntry` | Passée à `defineSitemapSchema({ filter })` et sérialisée via `Function#toString()` par `@nuxtjs/sitemap` (AD-02). Elle ne doit **rien importer**. C'est la story 16.2. |
| Réduire la duplication interne de `isIndexableBlogEntry` | Sa duplication de `isSitemapExcluded` et `hasNoindexDirective` est une **contrainte d'architecture**, pas un défaut. |
| Toucher `nuxt.config.ts` hors du hook `afterParse` | Le scan FS et le hook `content` calculent tous deux `contentRouteState`. Toute retouche a un effet de bord sur le prerender et l'indexabilité. |
| Ajouter une dépendance npm | AD-08, PRD §12. Les capacités content/Zod existent déjà. |
| Introduire un champ R1 | `project`, `featured`, `evergreen`, `seo`, `canonical`, `related`, `series`, `archived` sont R1. |
| Modifier `/blog`, l'article, la homepage, les composants DS | Stories 16.3, 16.4, 16.5. |
| Toucher `updatedAt` ou `read` | Voir pièges 1 et 3. |
| Utiliser `npm` ou `yarn` | pnpm strict (NFR17). Jamais sur l'hôte. |

### Champs à ne PAS supprimer, même absents du contrat

| Champ | Pourquoi il reste |
|---|---|
| `updatedAt` | Alias interne lu par `nuxt-ai-ready` (`nuxt.config.ts:189-193`). Piège Epic 14. |
| `read` | Consommé par 2 templates + le JSON-LD. Retrait = régression SEO. |
| `image` | Rendu par `blog/index.vue:17-20` et le JSON-LD `[...slug].vue:220-223,254-255`. `content-contract.md:54` le marque T0 = non, mais la fixture T0 « article sans image » (`:200`) suppose que les images existent. **Le garder optionnel.** |
| `noindex`, `robots`, `sitemap` | Propriétés des modules Nuxt SEO. `sitemap` est un `z.union([defineSitemapSchema(...), z.literal(false), z.null()])` — les sentinelles `false`/`null` sont nécessaires pour exclure une URL sans casser Zod. |

### À supprimer

| Champ | Pourquoi |
|---|---|
| `sitemapExcluded` | **Mort.** Déclaré `content.config.ts:63` avec le commentaire « Champ interne overwritten par la transformation ci-dessous », mais **aucune transformation ne l'écrit**. Les occurrences dans `nuxt.config.ts:442,701` et `blog-indexability.ts:106,108` sont des variables locales, jamais des lectures de frontmatter. La source de vérité est `isSitemapExcluded(metadata)`, qui lit `sitemap`. |

### Project Structure Notes

Fichiers **UPDATE** :

| Fichier | Nature de la modification |
|---|---|
| `content.config.ts` | Étendre le schéma Zod. Retirer `sitemapExcluded`. Durcir `tags`. |
| `nuxt.config.ts` | **Uniquement** le hook `content:file:afterParse` (l. 656-710) pour l'unicité de `title`. Réutiliser le pattern `contentSourcePathByRoute` existant. |

Fichiers **NEW** : aucun.

Composants DS : aucun. Primitives UI : aucune. Story sans UI — NFR21 non applicable.

### Testing Standards

- **Aucun framework de test n'est ajouté** (NFR25, PRD FR-17 « hors périmètre »).
- Validation = gate Docker + assertions CI existantes :
  `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`
- La validation fonctionnelle du contrat passe par des **fixtures temporaires** (story 16.6) — ne pas
  créer de fichier de test dans cette story.
- Les fixtures ne sont **jamais** versionnées ni déployées ; leur suppression se vérifie par un
  `git status` et une recherche de slugs.

### References

| Source | Section |
|---|---|
| `docs/specs/spec-blog-editorial/content-contract.md` | §1 convention de date, §2 matrice frontmatter, §3 énumérations, §8 fixtures T0 |
| `docs/planning-artifacts/architecture-blog-editorial.md` | AD-02, AD-03, AD-08, §2 contrainte de sérialisation, §3.1 champ mort, §6.1 schéma |
| `docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md` | FR-1, FR-3, §6.3 décisions de cadrage, §12 non-goals (l. 600) |
| `docs/planning-artifacts/epics.md` | Epic 16, stories 16.1 / 16.2, matrice de correspondance PRD → epics |
| `docs/project-context.md` | Règles Docker, `@nuxt/content` v3, pièges Content |
| `app/utils/blog-indexability.ts` | l. 49-58 contrainte de sérialisation et garde `Array#filter` |
| `nuxt.config.ts` | l. 189-193 AEO `updatedAt`, l. 399-404 cache SQLite, l. 656-710 hook `afterParse`, l. 678-684 collision de route |
| `content.config.ts` | l. 63 champ mort, l. 71 filtre sérialisé, l. 84-89 refine `updated` |

## Questions ouvertes

1. **`read` : sortie du contrat en T0 ou optionnel jusqu'à R1 ?** Décision par défaut appliquée :
   **conservé en optionnel**, aucun calcul automatique. Retrait différé à une décision de phase, car
   il casse `reading_time_est` dans le JSON-LD.
2. **`image` : T0 = « non » dans le contrat, mais fixture « article sans image » et rendu en
   production.** Décision par défaut appliquée : **conservé en optionnel**. Le contrat mériterait
   une correction de cellule.
3. **L'unicité de `title` relève-t-elle de cette story ou de la gate 16.7 ?** Elle est ici parce que
   l'AC l'exige et qu'un mécanisme existe déjà dans le codebase. Une simple assertion de fixture en
   16.7 serait plus simple mais ne protégerait pas la production.

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
