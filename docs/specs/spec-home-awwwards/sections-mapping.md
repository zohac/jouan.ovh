# Cartographie des sections & Adaptation Multi-pages

Ce document détaille la transposition de la maquette source `Home - Awwwards.html` vers l'architecture applicative Nuxt 4 de `jouan.ovh`, en application directe de la direction stratégique (`direction_strategique_site.md`) et du profil Malt (`contexte_malt.md`).

---

## 1. Principe directeur : Vitrine immersive vs Pages complètes

La maquette HTML brute `Home - Awwwards.html` a été conçue comme un prototype autonome avec des ancres intra-page (`#services`, `#work`, `#journal`, `#contact`).  
Dans `jouan.ovh`, la home refondue agit comme un **entonnoir de conversion commercial**, orientant les visiteurs vers les pages complètes du site :

| Section Maquette Awwwards | Rôle sur la Home refondue | Contenu aligné Malt / Direction Stratégique | Destination / Route cible |
| :--- | :--- | :--- | :--- |
| **Navigation Header** | Menu de navigation du site | Liens directs vers les pages applicatives Nuxt. | Liens Nuxt vers `/services`, `/about`, `/blog`, `/contact`. |
| **Hero & Terminal** | Positionnement commercial immédiat | « Développeur Full Stack TypeScript — Nuxt / NestJS » + pitch création/évolution SaaS + badge Malt. | CTA primaire vers `/contact` (« Discuter de votre projet »), secondaire vers `/about`, lien externe vers profil Malt. |
| **Marquee Stack** | Défilé continu des technologies prioritaires | Stack moderne ciblée : TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API. | Ruban visuel continu alimenté par `SITE.skills`. |
| **Services (3 cartes)** | Présentation des 3 offres ciblées | 1. Création d'apps web & SaaS<br>2. Dév Full Stack TypeScript<br>3. Évolution & architecture applicative | Cartes cliquables avec renvoi vers `/services` (où se trouve le déroulé du process en 4 étapes). |
| **Projets sélectionnés** | Preuves concrètes de réalisations SaaS | 1. **Keova** (SaaS ERP équestre Nuxt 4/NestJS/PostgreSQL/Stripe)<br>2. **TryOn** (SaaS IA générative Nuxt/NestJS/Python/ComfyUI)<br>3. **Nodium** (Lab d'agents IA desktop) | Liens externes vers les projets via `<ZExternalLink>`, renvoi vers `/about` pour le parcours complet (Kidizz, CINS). |
| **Statistiques clés** | Réassurance et crédibilité | 11 ans d'expérience web · 2 SaaS fondés / opérés · Culture QA & automatisation E2E. | Compteurs visuels intégrés à la section projets. |
| **Journal (Blog)** | Vitrine d'ingénierie logicielle | Les 3 derniers articles techniques du blog. | Lien global « Voir tous les articles » menant vers `/blog`. |
| **CTA Final** | Appel à la conversion orienté mission | « Un projet d'application web ou SaaS ? Discutons-en. » | Bouton vers `/contact`, lien externe vers profil Malt (`<ZExternalLink>`). |

---

## 2. Découpage technique et éditorial des blocs

### A. Pile Atmosphérique (`.atmos`)
- **Composants :** 3 auroras (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`) en gradients radiaux floutés avec animations `@keyframes` lentes (26s à 32s).
- **Textures :** Grille de points (`.grid-dots`) et scanlines terminales (`.scanlines`), grain discret en overlay et vignette périphérique.
- **Accessibilité :** Balisage en `aria-hidden="true"`, et neutralisation totale des keyframes sous `@media (prefers-reduced-motion: reduce)`.

### B. Boot Sequence (`.boot`)
- **Comportement :** Écran d'initialisation stylisé `jouan.os` affichant la montée en charge système.
- **Règles :**
  - S'efface automatiquement après 1 à 1.5s ou immédiatement au clic / touche Escape.
  - Contournement immédiat sous `prefers-reduced-motion: reduce` ou si déjà visualisé au cours de la session (`sessionStorage`).
  - Déclenche la frappe progressive du terminal hero à sa fermeture.

### C. Hero Commercial & Terminal Vitrine
- **Accroche commerciale :**
  - Sur-titre : `// DÉVELOPPEUR FREELANCE · NUXT & NESTJS`
  - Titre principal : `Développeur Full Stack TypeScript`
  - Sous-titre : `Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.`
  - Badge de statut : `● Disponible pour missions freelance · Profil Malt vérifié` (avec lien `<ZExternalLink>` vers Malt).
  - CTAs :
    - Principal : `<ZButton to="/contact">Discuter de votre projet</ZButton>`
    - Secondaire : `<ZButton variant="secondary" to="/about">Voir le parcours & CV</ZButton>`
- **Terminal vitrine :**
  - Simulation de frappe séquentielle :
    - `$ whoami` → `Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)`
    - `$ cat focus.txt` → `SaaS, web apps, clean architecture, automated testing (QA) & AI engineering`
    - `$ ls ~/projets` → `keova.app/  tryon-saas/  nodium-lab/`

### D. Marquee Stack Moderne
- **Contenu :** Ruban continu affichant les technologies phares de `SITE.skills` :
  `TypeScript · Nuxt 4 · Vue.js · NestJS · Node.js · PostgreSQL · TypeORM · Stripe Connect · Cypress · Docker · REST API · Vitest`
- **Animation :** `@keyframes` fluide, pause automatique au survol de la souris, figeage statique sous `prefers-reduced-motion: reduce`.

### E. Vitrine des Services (3 Offres Ciblées)
1. **Création d'applications web & SaaS**
   - *Promesse :* De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.
   - *Technologies :* Nuxt, NestJS, PostgreSQL, Stripe Connect.
2. **Développement Full Stack TypeScript**
   - *Promesse :* Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.
   - *Technologies :* Vue 3, Nuxt, NestJS, Node.js, TypeORM.
3. **Évolution & Architecture applicative**
   - *Promesse :* Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).
   - *Technologies :* Tests E2E Cypress, CI/CD, audits, optimisations.

### F. Preuves Concrètes & Projets Phares
- **1. Keova App (Pièce maîtresse SaaS en production) :**
  - Statut : `● En production`
  - Rôle : Co-fondateur & Développeur Full Stack
  - Description : ERP vertical SaaS complet dédié au secteur équestre (gestion de pensions, facturation automatisée, réservations).
  - Stack : Nuxt 4, NestJS, PostgreSQL, TypeORM, Stripe Connect, Docker.
  - Lien externe : `<ZExternalLink href="https://keova.app">keova.app</ZExternalLink>`.
- **2. TryOn (Étude de cas SaaS & IA générative) :**
  - Statut : `○ Étude de cas (MVP livré)` *(projet non renouvelé en ligne depuis 01/2026 — valorisé pour son architecture technique et son intégration IA sans lien externe 404)*
  - Rôle : CTO & Développeur Full Stack
  - Description : Plateforme SaaS B2B d'essayage virtuel de vêtements pour marques de mode via l'IA générative (diffusion models, workflows asynchrones, files Redis).
  - Stack : Nuxt 3, NestJS, Python microservices, ComfyUI, Stripe, PostgreSQL.
  - Action : Badge d'étude de cas / renvoi vers le détail de la mission sur `/about` ou profil Malt.
- **3. Nodium (Laboratoire R&D en cours) :**
  - Statut : `◐ R&D / En cours`
  - Rôle : Créateur & Ingénieur IA
  - Description : Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.
  - Stack : TypeScript, Electron/Tauri, Agentic workflows, Local runtimes.
- **Statistiques clés de réassurance :**
  - `11` Années d'expérience web
  - `100%` TypeScript & SaaS de bout en bout
  - `QA` Culture d'automatisation & zéro régression

### G. Bloc CTA Final
- **Titre :** `Un projet d'application web ou SaaS ?`
- **Sous-titre :** `Que ce soit pour créer un nouveau produit, accélérer votre roadmap ou fiabiliser votre stack TypeScript, parlons-en.`
- **Actions :**
  - Bouton primaire : `<ZButton to="/contact">Discuter de votre projet</ZButton>`
  - Bouton externe : `<ZExternalLink href="https://www.malt.fr/profile/simonjouan">Me contacter sur Malt</ZExternalLink>`
