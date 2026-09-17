---
id: SPEC-repositionnement-ia
companions:
  - messaging-matrix.md
  - services-and-pricing.md
  - projects-showcase.md
sources:
  - docs/jouan-ovh-offre-v1-brief-codex.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Repositionnement Offre V1 — Systèmes IA & Automatisation Métier

## Why

Le site actuel positionne Simon Jouan comme développeur Full Stack technique (Nuxt/NestJS/SaaS), ce qui dilue la valeur perçue et attire des demandes génériques ou peu qualifiées. Le nouveau positionnement commercial cible directement la douleur opérationnelle des entreprises : automatiser les processus métier chronophages et intégrer des systèmes et agents IA fiables en production. Le savoir-faire Full Stack et la culture QA deviennent le garant d'industrialisation (au-delà du prototype ou de l'automatisation fragile), sans renier l'identité sobre d'inspiration terminal du portfolio.

## Capabilities

- id: CAP-1
  intent: La source unique de données du site (`site.ts`) et les éléments globaux de marque (footer, bio, tags, métadonnées) reflètent le positionnement d'expert systèmes IA et automatisation métier, en éliminant les intitulés proscrits (ingénieur IA, ERP équestre, WordPress principal, localisation erronée).
  success: Une inspection de `app/data/site.ts` et des pieds de page confirme la présence du titre "Développeur Full Stack spécialisé en systèmes IA & automatisation métier", la localisation "France · Remote", la mise à jour des bios et l'absence totale de "Ingénieur IA" ou "ERP équestre".

- id: CAP-2
  intent: Le visiteur arrivant sur la page d'accueil identifie en moins de 15 secondes la promesse d'automatisation des workflows d'équipe via un Hero restructuré et un terminal interactif mis à jour.
  success: Le hero affiche le H1 "Automatisez les workflows qui freinent votre équipe", le sous-titre orienté intégration métier, les CTAs dédiés ("Identifier un workflow à automatiser" et "Voir mes systèmes IA"), et les sorties de commande du terminal hero reflètent les commandes `whoami`, `focus.txt` et `~/systems`.

- id: CAP-3
  intent: La page d'accueil présente la nouvelle offre en 3 cartes de services et un bloc différenciateur "prototype vers production" valorisant la robustesse technique et la QA.
  success: La section "Ce que je propose" expose les 3 offres (Automatisation de processus métier, Agents IA intégrés à vos outils, Applications IA sur mesure) avec leurs tags respectifs, immédiatement suivie du bloc "Un agent qui fonctionne trois fois n'est pas encore un système fiable" détaillant les piliers Données, Fiabilité, IA et Exploitation.

- id: CAP-4
  intent: La page d'accueil met en avant 3 projets phares démontrant la résolution de problèmes métier concrets (Keova Signal, Debrief, Devis-Assist), tout en conservant les réalisations antérieures dans un statut d'archives ou de parcours.
  success: Les trois projets affichés en vitrine principale sont Keova Signal (commercial / signaux d'achat), Debrief (desktop / IA locale privacy-first) et Devis-Assist (BTP / OCR & extraction documentaire), avec leurs statuts réels (interne, R&D, MVP) et sans métrique ni ROI fictif.

- id: CAP-5
  intent: La page Services (`/services`) détaille la méthodologie d'intervention en 4 étapes et la grille tarifaire transparente des 3 formats d'engagement.
  success: La page `/services` articule le processus (Diagnostic, Cadrage, Build, Exploitation) et affiche les offres "AI Workflow Sprint" (à partir de 3 500 € HT), "AI Workflow Blueprint" (à partir de 750 € HT) et "AI Care" (à partir de 490 € HT/mois) en dissociant explicitement les coûts d'infrastructure et d'APIs tierces.

- id: CAP-6
  intent: La page À propos (`/about`) retrace la trajectoire professionnelle en articulant la métrologie industrielle, le contrôle qualité (QA), le développement Full Stack et l'ingénierie des systèmes IA.
  success: Le contenu d'introduction et la timeline relient explicitement la rigueur de métrologie et QA à la fiabilité des agents IA en production (reproductibilité, gestion des cas limites, observabilité).

- id: CAP-7
  intent: Le visiteur peut qualifier directement son workflow problématique via les CTA de bas de page et le formulaire de contact mis à jour.
  success: Le CTA final global pose la question "Quel process vous fait perdre du temps chaque semaine ?" avec le prompt inspecteur `$ ./workflow --inspect`, et le formulaire de contact permet de saisir la description du processus et son fonctionnement actuel.

- id: CAP-8
  intent: Les métadonnées SEO, OpenGraph et données structurées Schema.org intègrent les nouveaux mots-clés sans allégations trompeuses.
  success: `usePageSeo` injecte les balises de titres ("Simon Jouan — Systèmes IA, agents & automatisation métier") et descriptions cibles sur l'ensemble des 13 routes pré-rendues.

- id: CAP-9
  intent: La refonte de contenu préserve intégralement les acquis d'accessibilité (a11y WCAG / RGAA), le responsive mobile et l'univers graphique terminal dark-first sans régression technique.
  success: La validation Docker `pnpm lint && pnpm typecheck && pnpm generate` passe avec 0 erreur et les contrastes, focus clavier et comportements motion réduit sont maintenus conformes aux standards du projet.

## Constraints

- **Direction artistique pérenne :** Conservation stricte du thème sombre aubergine, de l'accent orange, de la typographie Ubuntu/monospace et de l'ambiance terminal. Zéro cliché visuel d'IA générique (pas de cerveaux lumineux, néons bleus/violets, robots ou logos OpenAI partout).
- **Zéro Emoji :** Conformité stricte à la règle NFR6 du projet (aucun emoji dans les contenus textuels ou l'UI).
- **Vérité des faits :** Aucun ROI inventé, aucune promesse magique de remplacement d'employés, respect des statuts réels des projets (R&D, MVP, interne).
- **Environnement Docker exclusif :** Toute validation et compilation s'exécute dans Docker via `docker compose run --rm web ...`.
- **DRY & Pas d'URL en dur :** Données centralisées dans `app/data/site.ts`, URL résolue via `useSiteUrl()`.

## Non-goals

- Ne pas refondre l'identité graphique, le logo ou le Design System de base.
- Ne pas construire de système d'authentification ou d'espace client sur `jouan.ovh`.
- Ne pas supprimer brutalement les anciens projets du code (conservation propre pour archives ou parcours).
- Ne pas créer de calculateur de devis automatisé complexe en V1.

## Success signal

Le site déployé sur `jouan.ovh` (ou prévisualisé en local) permet à un prospect ou client en moins de 20 secondes d'identifier Simon comme développeur Full Stack capable d'automatiser un processus métier via des systèmes IA robustes, avec 3 démonstrateurs techniques crédibles et une proposition d'audit initial immédiate, validé par une gate CI/Docker verte à 100 %.

## Assumptions

- Les dépôts `zohac/keova_signal`, `zohac/debrief` et `zohac/devis-assist` sont des projets privés sous propriété intellectuelle : ils sont présentés avec le statut `Projet interne / Dépôt privé` sans lien GitHub sortant direct.
- Keova Signal dispose déjà de 3 visuels haute définition copiés dans `public/images/projects/`.
- Debrief dispose de 3 captures de référence prêtes à l'import depuis son Design System.
- Devis-Assist est représenté fidèlement sous son statut de phase de spécification et d'architecture BMM validées (pipeline Mistral OCR 3, BullMQ, pg_trgm).
- Les anciens projets restent référencés dans le code de `site.ts` sous une section secondaire d'archives/parcours.

## Open Questions

- L'expérience `Linkizz` sur la page À propos doit-elle être conservée telle quelle, ajustée ou complétée ?

