# Conformité RGPD, Protection de la Vie Privée & Session Replay

Ce document formalise les garde-fous juridiques et techniques garantissant que l'instrumentation PostHog EU et l'activation du Session Replay sur `jouan.ovh` respectent strictement le RGPD et la vie privée des visiteurs.

---

## 1. Hébergement Européen & Souveraineté

- **Point d'ingestion & stockage :** PostHog Cloud région Union Européenne (`https://eu.i.posthog.com`).
- **Garantie juridique :** Les données demeurent sous la juridiction des règlements européens de protection des données, sans transfert vers les infrastructures US de PostHog.
- **Aucune monétisation :** Aucune donnée n'est cédée, croisée ou revendue à des tiers ou régies publicitaires.

---

## 2. Configuration Sécurisée du Session Replay

Le Session Replay est activé dès la première livraison pour observer l'ergonomie et la fluidité des parcours de navigation, sous réserve des règles strictes suivantes :

### A. Masquage forcé des saisies (Data Masking)
- `mask_all_inputs: true` : Tout contenu tapé par le visiteur dans un `<input>` ou un `<textarea>` (nom, email, description de processus métier, budget) est systématiquement masqué par des astérisques lors de la capture vidéo.
- `mask_all_element_attributes: true` : Les attributs DOM pouvant véhiculer des informations d'état personnel sont neutralisés.
- `mask_text_selector: ".ph-no-capture, input, textarea"` : Sélecteur étendu de masquage forcé.

### B. Balisage explicite d'exclusion sur le formulaire de contact
Les champs du formulaire de contact dans [`app/pages/contact.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/contact.vue) intègrent la classe CSS native `ph-no-capture` de PostHog. Même en cas de régression de configuration globale, le SDK ignore physiquement les données de ces éléments.

---

## 3. Minimisation des Données & Anonymat

- **Pas d'identification nominale (`posthog.identify`) :** Aucun profil utilisateur n'est enrichi avec l'adresse email, le nom ou la société du visiteur, même après la soumission réussie d'un formulaire. L'identifiant PostHog demeure un UUID aléatoire anonyme.
- **Anonymisation de l'adresse IP :** L'adresse IP complète n'est ni affichée ni stockée de manière identifiable dans les métriques.
- **Stockage local maîtrisé :** Utilisation du stockage de session ou localStorage sans cookie traceur inter-sites (`persistence: 'localStorage+cookie'` ou `persistence: 'memory'`).

---

## 4. Gestion du Consentement & Bandeau Cookie "Terminal"

### A. Pourquoi le bandeau est obligatoire (Règle CNIL / ePrivacy)
Si la simple mesure d'audience anonymisée bénéficie d'une exemption CNIL, **l'activation du Session Replay (enregistrement vidéo de session) requiert obligatoirement un consentement préalable explicite (opt-in)** selon les lignes directrices européennes.

### B. Spécification du Bandeau Cookie / Télémétrie
Pour préserver l'univers esthétique épuré de `jouan.ovh`, le bandeau prend la forme d'un toast discret inspiré du terminal :
- **Design System :** Boîtier flottant en bas de l'écran, fond sombre aubergine (`--surface-raised`), bordure fine (`--border-subtle`), typographie monospace pour l'invite (`// telemetry:`).
- **Zéro Emoji (NFR6) :** Aucun pictogramme superflu, uniquement texte clair et actions univoques.
- **Actions claires :**
  - Bouton primaire : `Accepter` (active le plan de taggage complet et le Session Replay sécurisé).
  - Bouton secondaire : `Refuser` (désactive le Session Replay et coupe le tracking persistant).
  - Lien discret : `En savoir plus` renvoyant vers `/confidentialite`.
- **Comportement technique :**
  - PostHog est initialisé en attente (`opt_out_capturing_by_default: true`) ou Session Replay suspendu tant que l'utilisateur n'a pas cliqué sur `Accepter`.
  - Le choix est mémorisé dans `localStorage` (`jouan_consent_telemetry: 'accepted' | 'declined'`).
  - Le signal `navigator.doNotTrack === '1'` désactive automatiquement le tracking sans même afficher le bandeau.
  - Un bouton d'action dans le Footer (`Gestion des cookies`) permet de révoquer son consentement à tout instant conformément au RGPD.

---

## 5. Mise à Jour de la Page Politique de Confidentialité

La page [`app/pages/confidentialite.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/confidentialite.vue) est enrichie pour mentionner :
1. L'utilisation de **PostHog Cloud EU** pour l'amélioration continue de l'ergonomie et la détection d'erreurs techniques.
2. L'activation d'enregistrements de session anonymisés avec masquage systématique des champs de saisie.
3. La neutralisation automatique en cas d'activation du réglage "Ne pas me pister" (Do Not Track) sur le navigateur.
4. La durée de rétention des données fixée au maximum recommandé (14 mois glissants).
