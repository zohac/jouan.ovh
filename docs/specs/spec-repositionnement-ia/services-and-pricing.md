# Structure des Services, Process & Grille Tarifaire

## 1. Les 3 Offres d'Intervention

### Offre 1 — Automatisation de processus métier
- **Titre :** Automatisation de processus métier
- **Promesse :** Cartographie d'un workflow existant, identification des tâches répétitives et construction du système qui automatise ce qui mérite réellement de l'être.
- **Cas d'usage :** Qualification de demandes, enrichissement de données, traitement de mails/documents, reporting, synchronisation inter-outils, préparation de propositions, mise à jour CRM.
- **Tags techniques :** `Workflow` · `APIs` · `Automation` · `PostgreSQL`

### Offre 2 — Agents IA intégrés à vos outils
- **Titre :** Agents IA intégrés à vos outils
- **Promesse :** Quand une étape nécessite de lire, interpréter, synthétiser ou décider entre plusieurs actions, intégration de l'IA dans le flux de travail sans reconstruire ce qui fonctionne déjà.
- **Cas d'usage :** Agents outillés (Tool Calling / APIs), extraction structurée, recherche augmentée, validation humaine préalable, intégrations MCP et orchestration.
- **Tags techniques :** `Agents IA` · `LLM` · `MCP` · `Human-in-the-loop`

### Offre 3 — Applications IA sur mesure
- **Titre :** Applications IA sur mesure
- **Promesse :** Lorsque le workflow nécessite un produit dédié, développement de toute la chaîne : interface, backend, base de données, authentification, intégrations, IA, tests et déploiement.
- **Cas d'usage :** Outil métier interne, SaaS, application desktop, pipeline documentaire, interface de supervision, industrialisation d'un prototype existant.
- **Tags techniques :** `TypeScript` · `Nuxt` · `NestJS` · `PostgreSQL` · `Tauri`

---

## 2. Déroulement d'un Projet en 4 Étapes

```text
Diagnostic (20-30 min) ──► Cadrage / Blueprint ──► Build & Intégration ──► Suivi & Exploitation
```

1. **Étape 1 — Diagnostic (Prise de contact / Échange initial) :**
   - Échange de 20 à 30 minutes pour qualifier le problème.
   - Analyse du processus réel : fréquence, acteurs, outils impliqués, données manipulées, irritants et impact sur l'activité.
   - CTA associé : `Identifier un workflow`.
2. **Étape 2 — Cadrage :**
   - Formalisation du workflow cible, des étapes manuelles à conserver sous contrôle humain, des connecteurs API requis, des KPI de mesure et du périmètre projet.
   - Fait l'objet d'un livrable dédié (Blueprint) pour les sujets complexes.
3. **Étape 3 — Construction & Intégration (Build) :**
   - Développement logiciel du système, connexion aux outils métiers (CRM, ERP, messagerie...), couverture de tests automatisés et mise à l'épreuve sur cas réels avant livraison.
4. **Étape 4 — Suivi & Amélioration (Exploitation) :**
   - Monitoring en production, maintenance préventive/corrective, ajustements aux évolutions d'APIs tierces ou modèles d'IA, mesure factuelle des résultats.

---

## 3. Grille Tarifaire & Engagements Commerciaux

### Format Cœur — AI Workflow Sprint
- **Tarif public affiché :** *À partir de 3 500 € HT*
- **Règle absolue :** Un Sprint = Un workflow prioritaire borné (ex: ingestion de lead → enrichissement → qualification → scoring → CRM → proposition préparée → validation humaine).
- **Livrables inclus :** Diagnostic, cartographie avant/après, KPI, architecture, dev, intégrations, tests, mise en production, documentation, mesure initiale.
- **Ordres de grandeur internes indicatifs :**
  - Pilote borné : 2 500 – 3 900 € HT
  - Système métier intégré : 3 900 – 6 500 € HT
  - Système multi-workflows avancé : 6 500 – 12 000 €+ HT

### Format Cadrage — AI Workflow Blueprint
- **Tarif public affiché :** *À partir de 750 € HT*
- **Utilité :** Pour les projets nécessitant plusieurs heures d'audit préalable, modélisation de données et choix d'architecture avant de s'engager sur le build.
- **Livrable :** Dossier de cadrage complet (process actuel, irritants, volumes, risques, flux cible, matrice IA vs automation vs humain, KPI, architecture, budget estimé).

### Format Exploitation — AI Care
- **Tarif public affiché :** *À partir de 490 € HT / mois*
- **Définition :** Maintien en condition opérationnelle d'une capacité intégrée au processus métier (pas "le salaire d'un employé IA").
- **Périmètre inclus :** Supervision/monitoring, maintenance corrective, support réactif, suivi des coûts d'inférence, micro-ajustements de prompts/modèles, optimisations de prompts et code.
- **Exclusions strictes :** Nouveaux workflows (font l'objet d'un nouveau Sprint), migrations d'envergure, et **consommations tierces directes** (tokens LLM, OCR, scraping, SMS/email, serveurs dédiés) refacturées au réel ou prises en charge directement par le client.
