<template>
  <main class="about">
    <!-- Hero À-propos : portrait + identité (colonne gauche) + bio (colonne droite).
         Porté de About.jsx (section hero) : recréation Vue 3 + tokens, aucune copie JSX.
         La timeline d'expériences, la formation et la stack (une <section--sunken> SOUS
         ce hero) sont la story 5.2 — non implémentées ici, place réservée en bas. -->
    <section class="section">
      <div class="container">
        <div class="about__grid">
          <!-- Colonne gauche : portrait, identité, localisation, CTA -->
          <div class="about__identity">
            <ZAvatar src="/images/portrait.jpeg" :alt="profile.name" size="xl" ring />
            <h1 class="about__name">{{ profile.name }}</h1>
            <p class="about__role">{{ profile.role }}</p>
            <p class="prose about__location">
              <ZIcon name="pin" class="about__pin" />
              {{ profile.city }}
            </p>
            <div class="about__cta">
              <ZButton :as="NuxtLink" to="/contact" variant="primary">Me contacter</ZButton>
              <ZButton as="a" :href="`mailto:${profile.email}`" variant="secondary">CV</ZButton>
            </div>
          </div>

          <!-- Colonne droite : eyebrow + bio (1re personne, emphases sur les technologies) -->
          <div class="about__bio">
            <p class="eyebrow">// à propos</p>
            <p class="prose about__para">
              Développeur web freelance, je viens d'un parcours technique (métrologie, instrumentation) avant de
              basculer dans le code. Aujourd'hui je conçois des applications en <strong>PHP/Symfony</strong>, des sites
              <strong>WordPress</strong> sur-mesure, et des produits en <strong>Node.js / Nest.js / Nuxt.js</strong>.
            </p>
            <p class="prose about__para">
              Je suis aussi fondateur du SaaS
              <a href="https://keova.app" target="_blank" rel="noreferrer">keova.app</a>, et j'aime mettre l'IA au
              service du code — agents, automatisations, intégrations LLM.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Story 5.2 : la <section class="section section--sunken"> (timeline expériences +
         formation + stack ZTag) s'insère ici, sous le hero. Ne pas implémenter en 5.1. -->
  </main>
</template>

<script setup lang="ts">
// Page À-propos — hero portrait + bio (story 5.1). Porté de About.jsx du UI kit :
// grille 2 colonnes (0.8fr identité / 1.2fr bio), portrait via <ZAvatar ring>, CTA
// <ZButton>, bio en français 1re personne. Dark-first, tokens uniquement.
import { NuxtLink } from "#components";

// Libellés repris de data.js (window.SITE) — name, role, city, email.
const profile = {
  name: "Simon Jouan",
  role: "Développeur web freelance",
  city: "Valognes, France",
  email: "simon@jouan.ovh",
} as const;

useHead({
  title: "À propos — jouan.ovh",
  meta: [
    {
      name: "description",
      content:
        "Simon Jouan, développeur web freelance à Valognes : mon parcours, et les technologies que j'utilise — PHP/Symfony, WordPress, Node.js / Nest.js / Nuxt.js.",
    },
  ],
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / About.jsx */
.about {
  display: block;
}

// ---- Section + container (porté de kit.css : .section, .container) ----
.section {
  // padding-block uniquement : le gutter horizontal vient de .container (enfant).
  padding-block: var(--space-16);
}

.container {
  width: 100%;
  max-width: var(--container-xl);
  margin: 0 auto;
  padding-inline: var(--space-6);
}

// ---- Grille du hero (porté de About.jsx : grid-2 + gridTemplateColumns "0.8fr 1.2fr") ----
.about__grid {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  align-items: start;
  gap: var(--space-6);
}

// ---- Colonne gauche : identité ----
.about__name {
  margin: var(--space-5) 0 var(--space-1);
  font-family: var(--font-mono);
  font-size: var(--fs-3xl);
  font-weight: var(--fw-regular);
  line-height: var(--lh-tight);
  color: var(--text-strong);
}

.about__role {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--accent);
}

.about__location {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-4);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.about__cta {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-5);
}

// ---- Colonne droite : eyebrow + bio ----
.eyebrow {
  margin: 0 0 var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: var(--ls-wider);
  text-transform: uppercase;
  color: var(--accent);
}

.prose {
  font-family: var(--font-sans);
  line-height: var(--lh-relaxed);
  color: var(--text-body);
}

.about__para {
  margin: 0 0 var(--space-4);
  font-size: var(--fs-md);

  &:last-child {
    margin-bottom: 0;
  }

  // Emphases sur les technologies (porté des <strong> d'About.jsx).
  strong {
    color: var(--text-strong);
  }

  // Lien externe keova.app (porté de l'<a> d'About.jsx) — couleur lien du DS,
  // soulignement au survol + ring de focus accessible (pas d'outline: none nu).
  a {
    color: var(--link);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }

    &:focus-visible {
      outline: none;
      border-radius: var(--radius-xs);
      box-shadow: var(--ring-accent);
    }
  }
}

// ---- Responsive (cf. kit.css @media max-width: 900px : .grid-2 → 1 colonne) ----
@media (width <= 900px) {
  .about__grid {
    grid-template-columns: 1fr;
    gap: var(--space-10);
  }
}
</style>
