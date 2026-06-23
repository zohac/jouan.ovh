<template>
  <main class="services">
    <!-- En-tête + grille d'offres (story 4.1). La 2e section (process) viendra en 4.2. -->
    <section class="section">
      <div class="container">
        <p class="eyebrow">// services</p>
        <h1 class="services__title">Des prestations claires, pensées comme des produits.</h1>
        <p class="prose services__intro">
          Du site WordPress à l'application sur-mesure, en passant par l'IA appliquée — je m'occupe de la technique,
          vous gardez la main sur votre projet.
        </p>

        <div class="grid-3">
          <ZCard
            v-for="offer in offers"
            :key="offer.id"
            class="offer"
            :accent="offer.featured"
            :featured="offer.featured"
          >
            <div v-if="offer.featured" class="offer__badge">
              <ZBadge tone="accent">Le plus demandé</ZBadge>
            </div>
            <div class="offer__icon"><ZIcon :name="offer.icon" /></div>
            <h2 class="offer__title">{{ offer.title }}</h2>
            <p class="offer__desc">{{ offer.desc }}</p>
            <ul class="offer__points">
              <li v-for="point in offer.points" :key="point">{{ point }}</li>
            </ul>
            <div class="offer__price">
              <b>{{ offer.price }}</b>
            </div>
            <div class="offer__cta">
              <ZButton
                :as="NuxtLink"
                to="/contact"
                :variant="offer.featured ? 'primary' : 'secondary'"
                :aria-label="`Discuter du projet — ${offer.title}`"
                class="offer__btn"
              >
                Discuter du projet
              </ZButton>
            </div>
          </ZCard>
        </div>
      </div>
    </section>

    <!-- Section process : 4 étapes ordonnées + CTA (story 4.2). Porté de Services.jsx L45-61. -->
    <section class="section section--sunken">
      <div class="container">
        <p class="eyebrow">// comment ça se passe</p>
        <h2 class="process__title">Un déroulé simple en quatre temps</h2>

        <div class="process">
          <div v-for="step in steps" :key="step.n" class="process__step">
            <div class="process__num">{{ step.n }}</div>
            <h3 class="process__step-title">{{ step.title }}</h3>
            <p class="prose process__desc">{{ step.desc }}</p>
          </div>
        </div>

        <div class="process__cta">
          <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
            Demander un devis
            <template #iconRight><ZIcon name="arrow" /></template>
          </ZButton>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Page Services — en-tête + grille des 3 offres (story 4.1) puis section process
// (4 étapes ordonnées + CTA « Demander un devis », story 4.2). Porté de Services.jsx
// du UI kit : recréation Vue 3 + tokens (aucune copie JSX). Dark-first, accent orange.
import { NuxtLink } from "#components";

interface Offer {
  /** Clé v-for stable (indépendante du contenu affiché). */
  id: string;
  /** Nom d'icône dans le set ZIcon (story 2.7). */
  icon: string;
  title: string;
  desc: string;
  points: string[];
  price: string;
  /** Offre mise en avant : carte accent + glow + badge. */
  featured: boolean;
}

// Contenu repris à l'identique de data.js (window.SITE.services) — 1re personne,
// vouvoiement, pas d'emoji. « Applications web » est l'offre mise en avant.
const offers: Offer[] = [
  {
    id: "wordpress",
    icon: "wp",
    title: "WordPress sur-mesure",
    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
    points: ["Thème sur-mesure (press-wind / Tailwind)", "Plugins & blocs Gutenberg", "Performance & SEO technique"],
    price: "à partir de 1 500 €",
    featured: false,
  },
  {
    id: "apps",
    icon: "code",
    title: "Applications web",
    desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.",
    points: ["API REST / GraphQL (Symfony · Nest.js)", "Front Vue / Nuxt", "Tests & CI/CD, qualité QA"],
    price: "sur devis",
    featured: true,
  },
  {
    id: "ia",
    icon: "spark",
    title: "IA & automatisation",
    desc: "L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.",
    points: ["Agents & workflows (n8n)", "Intégration d'API LLM", "Automatisation de contenu"],
    price: "sur devis",
    featured: false,
  },
];

// Étapes du process — texte repris à l'identique de Services.jsx (tableau `steps`,
// pas dans data.js). L'ordre du tableau garantit l'affichage 01 → 04 (AC #1).
// `n` (numéro affiché) sert aussi de clé v-for stable et unique.
const steps = [
  { n: "01", title: "Échange", desc: "On cadre le besoin, le périmètre et le budget — sans jargon inutile." },
  { n: "02", title: "Conception", desc: "Architecture, maquette, et plan de livraison clair." },
  { n: "03", title: "Développement", desc: "Code propre, testé, livré par itérations visibles." },
  { n: "04", title: "Livraison & suivi", desc: "Mise en ligne, documentation, et accompagnement." },
];

useHead({
  title: "Services — jouan.ovh",
  meta: [
    {
      name: "description",
      content:
        "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
    },
  ],
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Services.jsx */
.services {
  display: block;
}

// .section / .section--sunken / .container / .eyebrow / .prose : primitives de
// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.

// ---- En-tête (porté de Services.jsx L13-21) ----
.services__title {
  max-width: 16ch;
  margin-bottom: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-4xl);
  font-weight: var(--fw-light);
  line-height: var(--lh-tight);
  color: var(--text-strong);
}

.services__intro {
  max-width: 60ch;
  margin-bottom: var(--space-10);
  color: var(--text-muted);
}

// ---- Grille des offres (porté de kit.css : .grid-3 / .offer*) ----
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
}

// `display:flex` (porté de l'inline JSX) : le prix + CTA sont poussés en bas via
// `margin-top: auto`, alignant les pieds de carte sur des hauteurs inégales.
.offer {
  display: flex;
  flex-direction: column;
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
  margin-bottom: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-xl);
  font-weight: var(--fw-regular);
  color: var(--text-strong);
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

  // Puce fléchée « → » (porté de kit.css .offer li::before).
  li::before {
    content: "→";
    position: absolute;
    left: 0;
    color: var(--accent);
  }
}

.offer__price {
  // `margin-top: auto` colle le prix (et le CTA qui suit) au bas de la carte ;
  // `padding-top` reprend l'inline JSX (space-5) au lieu du margin-top du kit.
  margin-top: auto;
  padding-top: var(--space-5);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);

  b {
    font-size: var(--fs-lg);
    font-weight: var(--fw-bold);
    color: var(--text-strong);
  }
}

.offer__cta {
  margin-top: var(--space-4);
}

// Bouton CTA en pleine largeur (porté de l'inline `width: 100%` du JSX).
.offer__btn {
  width: 100%;
}

// ---- Section process (porté de Services.jsx L45-61) ----
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

.process__cta {
  margin-top: var(--space-12);
  text-align: center;
}

// ---- Responsive (cf. kit.css @media max-width: 900px) ----
@media (width <= 900px) {
  .grid-3,
  .process {
    grid-template-columns: 1fr;
  }
}
</style>
