# Vitrine Projets & Démonstrateurs Techniques

## 1. Les 3 Projets Phares du Repositionnement

Les trois projets sélectionnés représentent trois familles de problèmes distinctes et apportent des preuves concrètes de maîtrise sur toute la chaîne logicielle :

### 1.1 Keova Signal — Intelligence Commerciale & Qualification Autonome
- **Statut :** Système interne / En développement actif (Dépôt privé `zohac/keova_signal`, pas de lien sortant direct, badge `Projet interne / Dépôt privé`).
- **Accroche :** Détecter le bon prospect au bon moment.
- **Description :** Moteur d’acquisition B2B conçu pour détecter les créations d'entreprises au moment exact de leur immatriculation légale. Il ingère les flux Open Data Sirene Insee (régulation Token Bucket 25 req/min, filtre CNIL strict `statutDiffusion != 'O'`), découvre la présence web des dirigeants par scraping éthique (Cheerio, détection CMS et signaux faibles de lancement), applique un double étage de scoring (ICP Gate binaire + Priority Score 0 à 100 via règles déclaratives YAML versionnées) et expose un serveur MCP natif (10 outils typés) permettant le pilotage par agent IA avec validation humaine.
- **Preuves techniques apportées :** Ingestion Open Data Insee, limitation Token Bucket, filtre éthique/CNIL, web discovery heuristique, scraping Cheerio assaini, scoring double étage découplé (Zod), audit trail append-only en JSONB, serveur MCP natif (transport stdio, 10 outils), boucle human-in-the-loop.
- **Stack affichable :** `Node.js 22` · `TypeScript` · `MCP Server` · `PostgreSQL` · `Cheerio` · `Docker`
- **Visuels disponibles :**
  - Image principale : `public/images/projects/keova-signal-dashboard.png` (Vue dashboard sombre, funnel 1 465 leads, scoring coloré).
  - Image zoom : `public/images/projects/keova-signal-drawer.png` (Tiroir latéral, fit score, décomposition des règles YAML).
  - Image data : `public/images/projects/keova-signal-analytics.png` (Efficacité par canal Instagram/Email/Form, conversion CMS).

### 1.2 Debrief — IA Locale & Privacy-First pour Équipes Commerciales
- **Statut :** R&D / En développement (Dépôt privé `zohac/debrief`, application desktop privacy-first).
- **Accroche :** Transformer un rendez-vous commercial en apprentissage exploitable.
- **Description :** Application desktop respectueuse de la vie privée reposant sur le principe du *privacy by impossibility* : 100 % des inférences et traitements tournent en local sur la machine, sans dépendance externe ni envoi réseau. Elle orchestre ASR local via `whisper.cpp` (`ggml-large-v3.bin`), diarisation locuteurs via `sherpa-onnx` (Pyannote 3.0 + 3D-Speaker Eres2Net), anonymisation locale par bras composite GLiNER + CamemBERT-NER avec passerelle anti-fuite étanche (`SafeEnginePayload`), et génération de la carte débrief via `llama-server` supervisé embarquant Google Gemma 4 IT (GGUF Q4_K_M) sur 65 536 tokens de contexte.
- **Preuves techniques apportées :** 100 % on-device (zéro fuite réseau), orchestration native Tauri/Rust, bindings C++ / Rust, ONNX Runtime (`ort`), modèles ASR & diarisation multi-locuteurs, anonymisation NER réversible, supervision de sous-processus `llama-server`, UI warm-paper éditoriale.
- **Stack affichable :** `Tauri` · `Rust` · `whisper.cpp` · `sherpa-onnx` · `llama.cpp` · `Gemma 4`
- **Visuels disponibles dans `public/images/projects/` :**
  - `debrief-dashboard.png` (Vue dashboard d'accueil, métriques et synthèse).
  - `debrief-enregistrer-un-appel.png` (Écran d'enregistrement / import audio, consentement).
  - `debrief-journal-list.png` (Liste des rendez-vous et statuts).
  - `debrief-journal-detail.png` (Carte débrief détaillée, verbatims, conseil pivot et analyse).

### 1.3 Devis-Assist — Pipeline Documentaire Métier & Chiffrage BTP
- **Statut :** Produit / Spécifications & Architecture BMM validées (Dépôt privé `zohac/devis-assist`).
- **Accroche :** Transformer un historique de devis BTP en aide au chiffrage.
- **Description :** Solution d'ingestion et d'analyse de devis artisans BTP pour accélérer la production d'un premier budget. Elle combine l'API Mistral OCR 3 (extraction native des tableaux en Markdown/HTML avec 95 % d'exactitude), un traitement asynchrone découplé par file de tâches BullMQ/Redis derrière une interface port/adapter (`OcrProviderPort`), et un référentiel métier dynamique à base de services canoniques hiérarchisés. L'algorithme de matching s'appuie sur une boucle d'auto-apprentissage (Data Flywheel) : exact match, trigramme PostgreSQL `pg_trgm`, mots-clés et consolidation des alias validés par la revue humaine.
- **Preuves techniques apportées :** Architecture hexagonale (ports/adapters), intégration Mistral OCR 3, file de tâches asynchrone BullMQ/Redis, Data Flywheel avec apprentissage des alias par validation humaine, matching flou trigramme PostgreSQL, souveraineté multi-tenant des catalogues de prix.
- **Stack affichable :** `NestJS` · `Nuxt UI 4` · `PostgreSQL pg_trgm` · `Mistral OCR` · `BullMQ`
- **Visuels :** Spécifications d'écrans détaillées Nuxt UI (web) et Flutter (mobile). Schéma de pipeline documentaire.

---

## 2. Statut et Conservation des Anciens Projets

Les anciens projets ne sont pas supprimés du site, mais ils cèdent la place d'honneur sur la page d'accueil pour éviter de brouiller le message :

- **Keova (App) :** Reste mentionné dans le parcours / portfolio global. **Règle absolue :** Ne plus jamais utiliser la mention obsolète "ERP équestre", remplacer par une formulation d'application SaaS de gestion opérationnelle.
- **Nodium :** Reste dans l'historique R&D. **Règle absolue :** Ne pas employer l'intitulé "Ingénieur IA", préférer "Créateur · R&D agents IA" ou "Développeur IA".
- **TryOn & Projets Web historiques :** Reclassés dans le parcours ou les archives d'ingénierie logicielle.
