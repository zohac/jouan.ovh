---
title: 'Carte de visite digitale plein écran et QR code BNI'
type: 'feature'
created: '2026-09-15'
status: 'done'
baseline_commit: '367f088da0704de2b04669a974b85bb9aae198fc'
context:
  - 'docs/project-context.md'
  - 'AGENTS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Simon participe jeudi soir à une réunion d'entrepreneurs type BNI sans cartes de visite papier ; il a besoin d'une carte de visite digitale immédiate sur mobile, plein écran en vertical et horizontal, sans navigation parasite, affichant son QR code vCard et ses coordonnées pour transmission instantanée.

**Approach:** Créer une route dédiée `/contact/card` plein écran (`100dvh`, sans layout global) aux couleurs du Design System avec QR code haute lisibilité, coordonnées directes (tél, email, site), téléchargement direct d'une fiche `.vcf` (vCard 3.0), et ajouter un point d'accès discret sur la page `/contact`.

## Boundaries & Constraints

**Always:**
- Exécuter tous les builds, lints et tests exclusivement via Docker (`docker compose run --rm web ...`).
- Respecter le Design System sombre (tokens SCSS de `_root.scss`, typographie Ubuntu/Mono, accents orange/cyan) sans aucune couleur ou espacement en dur.
- Aucun hardcoding de domaine : utiliser `useSiteUrl()` pour l'URL de base et `SITE.profile` pour les données partagées (DRY).
- Garantir un contraste maximal sur le cadre du QR code (fond blanc ou très clair) pour permettre le scan instantané par les appareils photo iOS/Android même en éclairage tamisé.
- Responsive complet `100dvh` : mise en page en colonne en portrait, mise en page split 2 colonnes en paysage.
- Accessibilité : focus visible avec repli `forced-colors`, respect de `prefers-reduced-motion: reduce`.

**Ask First:**
- Modifier la structure globale de navigation ou d'autres pages que `/contact` et `/contact/card`.

**Never:**
- Ne pas intégrer d'émojis dans l'UI (NFR6).
- Ne pas afficher le header global ou le footer global sur `/contact/card` (page épurée dédiée smartphone).
- Ne pas exécuter de commandes de packaging/Node directement sur la machine hôte.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Affichage mobile portrait | Navigation vers `/contact/card` sur smartphone vertical | Carte centrée pleine hauteur `100dvh`, nom/rôle en haut, QR code contrasté au centre, coordonnées et CTA en bas sans scroll parasite | N/A |
| Affichage mobile paysage | Smartphone pivoté horizontalement | Layout split 2 colonnes (profil + coordonnées + CTA à gauche, grand QR code à droite) s'adaptant à `100dvh` | N/A |
| Scan appareil photo | Visiteur scanne le QR code affiché à l'écran | Décodage natif immédiat de la vCard intégrée dans l'application Contacts du smartphone | Fond contrasté blanc garanti pour scan rapide |
| Clic CTA "Télécharger contact" | Visiteur clique sur "Enregistrer le contact (.vcf)" | Téléchargement direct du fichier `simon-jouan.vcf` avec ouverture native carnet d'adresses | Fichier statique servi via `public/simon-jouan.vcf` |
| Navigation depuis `/contact` | Visiteur clique sur "Carte de visite & QR Code" | Transition fluide vers `/contact/card` | Lien NuxtLink standard |

</frozen-after-approval>

## Code Map

- `app/data/site.ts` -- Centralisation du numéro de téléphone de Simon (`phone`, `phoneRaw`) dans `IProfile` (DRY).
- `public/simon-jouan.vcf` -- Fichier vCard 3.0 standardisé téléchargeable nativement.
- `app/components/ui/ZIcon.vue` -- Ajout des glyphes au trait `phone`, `qr` et `download`.
- `app/pages/contact/card.vue` -- Route dédiée plein écran sans layout global (`definePageMeta({ layout: false })`).
- `app/pages/contact.vue` -- Bouton/encart discret menant vers `/contact/card`.

## Tasks & Acceptance

**Execution:**
- [x] `app/data/site.ts` -- Ajouter `phone?: string` et `phoneRaw?: string` à l'interface `IProfile` et à l'objet `profile` -- Source unique de vérité pour les coordonnées de Simon.
- [x] `public/simon-jouan.vcf` -- Créer la fiche vCard 3.0 standardisée avec nom, prénom, téléphone, email, site et titre -- Permettre le téléchargement direct sur iOS et Android.
- [x] `app/components/ui/ZIcon.vue` -- Ajouter les icônes au trait `phone`, `qr` et `download` -- Cohérence visuelle avec les primitives du DS.
- [x] `app/pages/contact/card.vue` -- Créer la page plein écran avec layout désactivé, vue portrait et paysage adaptative, QR code contrasté, liens cliquables `tel:`, `mailto:`, bouton `.vcf` et retour au portfolio -- Répondre au besoin de présentation instantanée en réunion BNI.
- [x] `app/pages/contact.vue` -- Ajouter le bouton discret d'accès à la carte de visite dans la colonne infos -- Intégration naturelle et découvrable depuis le site.

**Acceptance Criteria:**
- Given la route `/contact/card`, when affichée sur mobile en mode portrait ou paysage, then aucun header/footer global n'est affiché, le contenu occupe `100dvh` sans débordement involontaire, et le QR code reste parfaitement lisible et scannable.
- Given la fiche contact, when on clique sur "Enregistrer le contact", then le fichier `simon-jouan.vcf` est téléchargé avec le numéro `+33 6 58 96 90 20`, l'email `simon@jouan.ovh` et l'URL du portfolio.
- Given la page `/contact`, when on consulte les coordonnées, then un bouton discret avec icône QR permet d'accéder directement à `/contact/card`.
- Given la suite de validation Docker `pnpm lint && pnpm typecheck && pnpm generate`, when lancée, then 0 erreur n'est relevée et la route `/contact/card` est pré-rendue avec succès en HTML statique.

## Spec Change Log

*(Vide — première version draft issue du cadrage BMad Quick Dev)*

## Verification

**Commands:**
- `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -- expected: 0 erreur lint/typecheck et génération statique de toutes les routes incluant `/contact/card`.

**Manual checks (if no CLI):**
- Inspecter `/contact/card` en viewport portrait (375x812px) et paysage (812x375px).
- Vérifier le téléchargement du fichier `simon-jouan.vcf`.
- Vérifier le contraste du QR code pour scan caméra.

## Suggested Review Order

**Route Carte de Visite Digitale (Plein Écran & Responsive)**

- Page dédiée 100dvh, sans layout global, adaptative portrait/paysage
  [`card.vue:1`](../../app/pages/contact/card.vue#L1)

- Intégration du point d'entrée discret depuis la page contact
  [`contact.vue:114`](../../app/pages/contact.vue#L114)

**Fiche Contact & Assets Partagés**

- Fichier vCard 3.0 standardisé téléchargeable
  [`simon-jouan.vcf:1`](../../public/simon-jouan.vcf#L1)

- Centralisation des coordonnées téléphoniques dans SITE.profile
  [`site.ts:20`](../../app/data/site.ts#L20)

- Nouvelles icônes au trait (phone, qr, download)
  [`ZIcon.vue:43`](../../app/components/ui/ZIcon.vue#L43)

