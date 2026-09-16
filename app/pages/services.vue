<template>
  <main class="services">
    <!-- En-tête + grille d'offres (story 12.5) -->
    <section class="section">
      <div class="container">
        <p class="eyebrow"><span aria-hidden="true">// </span>services</p>
        <h1 class="services__title">Des systèmes IA construits autour de vos vrais processus métier.</h1>
        <p class="prose services__intro">
          Je pars d’un workflow existant, pas d’une technologie à placer. Du cadrage initial jusqu'au maintien en
          condition opérationnelle, l’IA intervient uniquement là où elle apporte réellement quelque chose.
        </p>

        <ul class="grid-3">
          <li v-for="offer in offers" :key="offer.id">
            <ZCard class="offer" :accent="offer.featured" :featured="offer.featured">
              <div v-if="offer.featured" class="offer__badge">
                <ZBadge tone="accent">Format cœur</ZBadge>
              </div>
              <div class="offer__icon"><ZIcon :name="offer.icon" /></div>
              <h2 class="offer__title">{{ offer.title }}</h2>
              <p v-if="offer.hook" class="offer__hook">{{ offer.hook }}</p>
              <p class="offer__desc">{{ offer.desc }}</p>
              <ul class="offer__points">
                <li v-for="point in offer.points" :key="point">{{ point }}</li>
              </ul>
              <div class="offer__footer">
                <div class="offer__price">
                  <b>{{ offer.price }}</b>
                </div>
                <p v-if="offer.disclaimer" class="offer__disclaimer">
                  {{ offer.disclaimer }}
                </p>
                <div class="offer__cta">
                  <ZButton
                    :as="NuxtLink"
                    to="/contact"
                    :variant="offer.featured ? 'primary' : 'secondary'"
                    :aria-label="offer.ctaAriaLabel"
                    class="offer__btn"
                  >
                    {{ offer.ctaText }}
                  </ZButton>
                </div>
              </div>
            </ZCard>
          </li>
        </ul>
      </div>
    </section>

    <!-- Section process : 4 étapes ordonnées + CTA (story 12.5) -->
    <section class="section section--sunken">
      <div class="container">
        <p class="eyebrow"><span aria-hidden="true">// </span>comment ça se passe</p>
        <h2 class="process__title">Un déroulé simple en quatre temps</h2>

        <ol class="process">
          <li v-for="step in steps" :key="step.n" class="process__step">
            <div class="process__num" aria-hidden="true">{{ step.n }}</div>
            <h3 class="process__step-title">{{ step.title }}</h3>
            <p class="prose process__desc">{{ step.desc }}</p>
            <div v-if="step.inlineCta" class="process__cta-inline-wrapper">
              <NuxtLink :to="step.inlineCta.to" class="process__inline-cta">
                {{ step.inlineCta.label }}
              </NuxtLink>
            </div>
          </li>
        </ol>

        <div class="process__cta">
          <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
            Me parler de votre besoin
            <template #iconRight><ZIcon name="arrow" /></template>
          </ZButton>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Page Services : catalogue d'offres IA packagées + process 4 étapes + CTA contact.
// Données statiques (3 offres, 4 étapes) déclarées localement. Prerender-safe, dark-first.
import { NuxtLink } from "#components";
import { SITE } from "~/data/site";

interface Offer {
  /** Clé v-for stable (indépendante du contenu affiché). */
  id: string;
  /** Nom d'icône dans le set ZIcon. */
  icon: string;
  title: string;
  hook?: string;
  desc: string;
  points: string[];
  price: string;
  disclaimer?: string;
  /** Offre mise en avant : carte accent + glow + badge. */
  featured: boolean;
  ctaText: string;
  ctaAriaLabel: string;
}

interface Step {
  n: string;
  title: string;
  desc: string;
  inlineCta?: {
    to: string;
    label: string;
  };
}

// Les 3 offres officielles V1 — 1re personne, vouvoiement, zéro emoji.
const offers: Offer[] = [
  {
    id: "sprint",
    icon: "zap",
    title: "AI Workflow Sprint",
    hook: "Un Sprint = un workflow prioritaire",
    desc: "Conception, intégration logicielle et mise en production d'un workflow métier complet avec IA ciblée et supervision humaine.",
    points: [
      "Diagnostic approfondi & cartographie avant/après",
      "Architecture système, connecteurs API & intégrations métier",
      "Modèles d'IA & prompt engineering avec sorties typées",
      "Tests automatisés sur cas réels & boucle de validation humaine",
      "Déploiement en production, documentation & mesure initiale",
    ],
    price: "À partir de 3 500 € HT",
    featured: true,
    ctaText: "Lancer un Sprint",
    ctaAriaLabel: "Discuter d'un AI Workflow Sprint",
  },
  {
    id: "blueprint",
    icon: "layers",
    title: "AI Workflow Blueprint",
    hook: "Cadrage préalable pour problématique complexe",
    desc: "Pour les projets nécessitant un audit préalable, une modélisation de données et des choix d'architecture avant de s'engager sur le build.",
    points: [
      "Audit du processus actuel, volumes & points de friction",
      "Matrice de décision : code déterministe vs IA vs humain",
      "Schéma d'architecture technique & flux de données cibles",
      "Analyse des risques, contraintes de sécurité & secrets",
      "Spécification des KPI de mesure & estimation budgétaire",
    ],
    price: "À partir de 750 € HT",
    featured: false,
    ctaText: "Demander un Blueprint",
    ctaAriaLabel: "Demander un AI Workflow Blueprint",
  },
  {
    id: "care",
    icon: "bot",
    title: "AI Care",
    hook: "Maintien en condition opérationnelle",
    desc: "Maintien en condition opérationnelle d'une capacité intégrée au processus métier pour garantir disponibilité, précision et maîtrise des coûts.",
    points: [
      "Supervision proactive, alertes & analyse des échecs",
      "Maintenance corrective & adaptation aux APIs tierces",
      "Suivi des coûts d'inférence & micro-ajustements de prompts",
      "Support technique réactif & veille sur les nouveaux modèles",
    ],
    disclaimer:
      "Consommations tierces d'APIs et tokens (LLM, OCR, scraping...) refacturées au réel ou prises en charge directement par le client.",
    price: "À partir de 490 € HT / mois",
    featured: false,
    ctaText: "Découvrir AI Care",
    ctaAriaLabel: "Découvrir l'accompagnement AI Care",
  },
];

// Étapes du process en 4 temps. L'ordre du tableau garantit l'affichage 01 → 04.
const steps: Step[] = [
  {
    n: "01",
    title: "Diagnostic",
    desc: "Échange de 20 à 30 minutes pour qualifier le problème, comprendre le workflow existant et identifier les goulots d'étranglement.",
    inlineCta: {
      to: "/contact",
      label: "Identifier un workflow →",
    },
  },
  {
    n: "02",
    title: "Cadrage",
    desc: "Formalisation du workflow cible, des étapes manuelles à conserver sous contrôle humain, des connecteurs API requis et des KPI de mesure. Fait l'objet d'un Blueprint pour les sujets complexes.",
  },
  {
    n: "03",
    title: "Construction & intégration",
    desc: "Développement logiciel du système, connexion aux outils métiers (CRM, ERP, messagerie...), couverture de tests automatisés et mise à l'épreuve sur cas réels avant livraison.",
  },
  {
    n: "04",
    title: "Suivi & amélioration",
    desc: "Monitoring en production, maintenance préventive/corrective, ajustements aux évolutions d'APIs tierces ou modèles d'IA, mesure factuelle des résultats.",
  },
];

const siteUrl = useSiteUrl();

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Services & Tarifs — Simon Jouan",
  description:
    "Développement de systèmes IA et automatisation de processus métier : offres packagées (AI Workflow Sprint, Blueprint, AI Care) et déroulement d'intervention transparent.",
  url: `${siteUrl}/services`,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: offers.map((offer, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: offer.title,
        description: offer.desc,
        provider: {
          "@type": "Organization",
          "@id": `${siteUrl}/#organization`,
          name: SITE.profile.name,
        },
        offers: {
          "@type": "Offer",
          description: offer.price,
        },
      },
    })),
  },
};

usePageSeo({
  title: "Services & Tarifs — Simon Jouan",
  description:
    "Développement de systèmes IA et automatisation de processus métier : offres packagées (AI Workflow Sprint, Blueprint, AI Care) et déroulement d'intervention transparent.",
  path: "/services",
  image: "/images/portrait.jpeg",
  type: "website",
  jsonLd: servicesJsonLd,
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) */
.services {
  display: block;
}

// .section / .section--sunken / .container / .eyebrow / .prose : primitives de
// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.

// ---- En-tête ----
.services__title {
  max-width: 22ch;
  margin-bottom: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-4xl);
  font-weight: var(--fw-light);
  line-height: var(--lh-tight);
  color: var(--text-strong);
}

.services__intro {
  max-width: 62ch;
  margin-bottom: var(--space-10);
  color: var(--text-muted);
}

// ---- Grille des offres (.grid-3 / .offer*) ----
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    display: flex;
  }
}

.offer {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.offer__badge {
  margin-bottom: var(--space-3);
}

.offer__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-10); // 40px
  height: var(--space-10);
  margin-bottom: var(--space-4);

  // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
  // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
  font-size: 22px;
  color: var(--accent);
  background: var(--accent-soft);
  border-radius: var(--radius-md);
}

.offer__title {
  margin-bottom: var(--space-1);
  font-family: var(--font-mono);
  font-size: var(--fs-xl);
  font-weight: var(--fw-regular);
  color: var(--text-strong);
}

.offer__hook {
  margin: 0 0 var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: var(--fw-medium);
  letter-spacing: var(--ls-wide);
  color: var(--accent);
}

.offer__desc {
  margin: 0 0 var(--space-4);
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  line-height: var(--lh-relaxed);
  color: var(--text-body);
}

.offer__points {
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    padding: var(--space-1) 0 var(--space-1) var(--space-5);
    font-family: var(--font-mono);
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }

  // Puce fléchée « → »
  li::before {
    content: "→";
    position: absolute;
    left: 0;
    color: var(--accent);
  }
}

.offer__footer {
  display: flex;
  flex-direction: column;
  margin-top: auto;
  padding-top: var(--space-5);
}

.offer__price {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);

  b {
    font-size: var(--fs-lg);
    font-weight: var(--fw-bold);
    color: var(--text-strong);
  }
}

.offer__disclaimer {
  margin: var(--space-2) 0 0;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  line-height: var(--lh-normal);
  color: var(--text-muted);
  opacity: 0.85;
}

.offer__cta {
  margin-top: var(--space-4);
}

.offer__btn {
  width: 100%;
}

// ---- Section process ----
.process__title {
  margin-bottom: var(--space-8);
  font-family: var(--font-mono);
  font-size: var(--fs-3xl);
  font-weight: var(--fw-regular);
  color: var(--text-strong);
}

.process {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;
}

.process__step {
  display: flex;
  flex-direction: column;
}

.process__num {
  font-family: var(--font-mono);
  font-size: var(--fs-3xl);
  font-weight: var(--fw-light);
  color: var(--accent);
}

.process__step-title {
  margin: var(--space-2) 0;
  font-family: var(--font-mono);
  font-size: var(--fs-lg);
  font-weight: var(--fw-regular);
  color: var(--text-strong);
}

.process__desc {
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.process__cta-inline-wrapper {
  margin-top: auto;
  padding-top: var(--space-3);
}

.process__inline-cta {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--accent);
  text-decoration: none;
  transition:
    color var(--dur-base) var(--ease-standard),
    text-decoration-color var(--dur-base) var(--ease-standard);

  &:hover {
    color: var(--accent-hover);
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
    border-radius: var(--radius-xs);
  }
}

.process__cta {
  margin-top: var(--space-12);
  text-align: center;
}

// ---- Responsive ----
@media (width <= 900px) {
  .grid-3,
  .process {
    grid-template-columns: 1fr;
  }
}
</style>
