<template>
  <main class="about">
    <!-- Hero À-propos : portrait + identité (colonne gauche) + bio + stack (colonne droite).
         Porté de About.jsx (section hero) : recréation Vue 3 + tokens, aucune copie JSX.
         La section CV (expériences + formation) suit dans une <section--sunken> (story 5.2). -->
    <section class="section">
      <div class="container">
        <div class="about__grid">
          <!-- Colonne gauche : portrait, identité, localisation, CTA -->
          <div class="about__identity">
            <ZAvatar src="/images/portrait.jpeg" :alt="profile.name" initials="SJ" size="xl" ring />
            <h1 class="about__name">{{ profile.name }}</h1>
            <p class="about__role">{{ profile.role }}</p>
            <p class="prose about__location">
              <ZIcon name="pin" class="about__pin" />
              {{ profile.city }}
            </p>
            <div class="about__cta">
              <ZButton :as="NuxtLink" to="/contact" variant="primary">Me contacter</ZButton>
              <ZButton as="a" :href="`mailto:${profile.email}`" variant="secondary">M'écrire</ZButton>
            </div>
          </div>

          <!-- Colonne droite : eyebrow + bio (1re personne, emphases sur les technologies) + stack -->
          <div class="about__bio">
            <h2 class="eyebrow">// à propos</h2>
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

            <!-- Stack technique (story 5.2) — sous la bio, conforme à About.jsx. ZTag = pill.
                 Liste sémantique (<ul>/<li>) pour annonce « liste de N éléments » aux lecteurs d'écran. -->
            <div class="about__stack">
              <h2 class="eyebrow eyebrow--muted">// stack</h2>
              <ul class="hero__tags">
                <li v-for="skill in skills" :key="skill">
                  <ZTag>{{ skill }}</ZTag>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section CV (story 5.2) : timeline d'expériences (gauche) + formation (droite).
         Porté de About.jsx (2e section--sunken), grille 1.4fr / 0.6fr. -->
    <section class="section section--sunken">
      <div class="container">
        <div class="about__cv">
          <!-- Colonne gauche : timeline d'expériences (la plus récente en haut).
               <ol> : séquence chronologique annoncée comme liste ordonnée aux lecteurs d'écran. -->
          <div>
            <h2 class="eyebrow">// expériences</h2>
            <ol class="tl">
              <li v-for="xp in experiences" :key="xp.org" class="tl__item">
                <div class="tl__date">{{ xp.date }}</div>
                <div class="tl__role">{{ xp.role }}</div>
                <div class="tl__org">{{ xp.org }}</div>
                <div class="tl__desc">{{ xp.desc }}</div>
              </li>
            </ol>
          </div>

          <!-- Colonne droite : formation (une ZCard par diplôme), liste sémantique <ul>/<li>. -->
          <div>
            <h2 class="eyebrow">// formation</h2>
            <ul class="about__degrees">
              <li v-for="degree in degrees" :key="degree.name">
                <ZCard padded>
                  <div class="tl__date">{{ degree.date }}</div>
                  <div class="about__degree-name">{{ degree.name }}</div>
                  <div class="tl__org">{{ degree.school }}</div>
                </ZCard>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Page À-propos — hero portrait + bio + stack (story 5.1/5.2) puis section CV
// (timeline d'expériences + formation, story 5.2). Porté de About.jsx du UI kit :
// hero 2 colonnes (0.8fr identité / 1.2fr bio), section CV 2 colonnes (1.4fr / 0.6fr),
// stack en <ZTag>, formation en <ZCard>. Dark-first, tokens uniquement, prerender-safe.
import { NuxtLink } from "#components";

// Libellés repris de data.js (window.SITE) — name, role, city, email.
const profile = {
  name: "Simon Jouan",
  role: "Développeur web freelance",
  city: "Valognes, France",
  email: "simon@jouan.ovh",
} as const;

// Stack technique (data.js → S.skills) — ordre conservé. Rendue en <ZTag> (pill).
const skills = [
  "php",
  "symfony",
  "wordpress",
  "node.js",
  "nest.js",
  "nuxt.js",
  "vue",
  "typescript",
  "docker",
  "tailwind",
  "n8n",
  "mysql",
];

// Expériences (data.js → S.experiences) — de la plus récente à la plus ancienne.
// `org` sert de clé v-for stable (unique).
const experiences = [
  {
    date: "02/2021 — aujourd'hui",
    role: "Testeur QA",
    org: "Linkizz",
    desc: "Tests automatisés — Node.js, TypeScript, TestCafé.",
  },
  {
    date: "05/2020 — 12/2021",
    role: "Développeur Full Stack",
    org: "CINS",
    desc: "PHP/MySQL, Symfony 4/5, Drupal, Prestashop, WordPress, Docker.",
  },
  {
    date: "07/2007 — 05/2019",
    role: "Métrologue",
    org: "A+ Métrologie / Trescal",
    desc: "Technicien métrologue multi-grandeur, suppléant COFRAC électricité-magnétisme.",
  },
];

// Formation (data.js → S.degrees). `name` sert de clé v-for stable (unique).
const degrees = [
  { date: "2017 — 2018", name: "Développeur d'application — PHP / Symfony", school: "OpenClassrooms" },
  { date: "1999 — 2001", name: "BTS CIRA", school: "Lycée A. de Tocqueville, Cherbourg" },
];

// Métadonnées de la page. Voix 1re personne cohérente (cf. contrainte Langue & voix).
const pageTitle = "À propos — jouan.ovh";
const pageDescription =
  "Développeur web freelance à Valognes, je conçois des applications en PHP/Symfony, des sites WordPress sur-mesure et des produits Node.js / Nest.js / Nuxt.js — voici mon parcours.";
// Domaine de production (cf. public/CNAME : dev.jouan.ovh).
const pageUrl = "https://dev.jouan.ovh/about";
const pageImage = "https://dev.jouan.ovh/images/portrait.jpeg";

useHead({
  title: pageTitle,
  link: [{ rel: "canonical", href: pageUrl }],
  meta: [
    { name: "description", content: pageDescription },
    // Open Graph (partage Facebook/LinkedIn…).
    { property: "og:type", content: "profile" },
    { property: "og:title", content: pageTitle },
    { property: "og:description", content: pageDescription },
    { property: "og:url", content: pageUrl },
    { property: "og:image", content: pageImage },
    // Twitter Card.
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: pageTitle },
    { name: "twitter:description", content: pageDescription },
    { name: "twitter:image", content: pageImage },
  ],
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / About.jsx */
// .section / .container / .eyebrow / .prose / .hero__tags sont des primitives de
// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
.about {
  display: block;
}

// Les libellés de section sont des <h2> (outline a11y navigable au lecteur d'écran),
// stylés en eyebrow. Neutralise le poids et l'interligne propres au <h2> pour un
// rendu strictement identique au <p class="eyebrow"> initial (line-height: inherit
// reproduit l'héritage du corps, comme le ferait un <p>).
.eyebrow {
  font-weight: var(--fw-regular);
  line-height: inherit;
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

// ---- Colonne droite : bio ----
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

    // Anneau de focus accent + outline transparent : ce dernier reste invisible
    // en rendu normal mais devient une couleur système en `forced-colors`
    // (High Contrast), où le box-shadow est neutralisé. A11y : focus toujours visible.
    &:focus-visible {
      outline: 2px solid transparent;
      outline-offset: 2px;
      border-radius: var(--radius-xs);
      box-shadow: var(--ring-accent);
    }
  }
}

// ---- Stack (porté de About.jsx : bloc sous la bio) ----
// .hero__tags (rangée de chips) = primitive de layout globale (base/_layout.scss).
.about__stack {
  margin: var(--space-6) 0;
}

// ---- Section CV : grille expériences / formation (porté de About.jsx : 1.4fr / 0.6fr) ----
.about__cv {
  display: grid;
  grid-template-columns: 1.4fr 0.6fr;
  gap: var(--space-12);
}

// ---- Timeline d'expériences (porté de kit.css : .tl*) ----
// `margin-top` repris de l'inline JSX (<div class="tl" style="margin-top: var(--space-5)">).
// Rail vertical + points partagent un même axe (--tl-axis) et sont centrés dessus via
// translateX(-50%). Correction d'un défaut de la maquette : dans kit.css le point
// (left:-22px sur .tl__item, décalé du padding-left) tombait ~2px à droite du rail
// (left:5px sur .tl), les deux centres n'étant pas sur le même axe.
// Px restants = géométrie décorative fine (épaisseur 1px, point 11px, bord 2px,
// retraits verticaux 6px) sans équivalent dans l'échelle de tokens d'espacement.
.tl {
  // Axe du rail, mesuré depuis le bord gauche de .tl.
  --tl-axis: 5px;

  // <ol> : neutraliser puces/numéros et marges UA (reset : margin 0 0 16px 32px).
  position: relative;
  margin: var(--space-5) 0 0;
  padding-left: var(--space-6);
  list-style: none;
}

.tl::before {
  content: "";
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: var(--tl-axis);
  width: 1px;
  background: var(--border-default);
  transform: translateX(-50%);
}

.tl__item {
  position: relative;
  padding-bottom: var(--space-6);
}

// `left` ramène le point sur --tl-axis en compensant le padding-left de .tl
// (le ::before est positionné par rapport à .tl__item, pas à .tl).
.tl__item::before {
  content: "";
  position: absolute;
  top: 6px;
  left: calc(var(--tl-axis) - var(--space-6));
  width: 11px;
  height: 11px;
  background: var(--surface-0);
  border: 2px solid var(--accent);
  border-radius: var(--radius-circle);
  transform: translateX(-50%);
}

.tl__date {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: var(--ls-wide);
  color: var(--accent);
}

.tl__role {
  // kit.css:138 utilise `margin: 2px 0` ; --space-1 (4px) est le token le plus proche
  // (pureté tokens, delta 2px imperceptible) — pas de token d'espacement à 2px.
  margin: var(--space-1) 0;
  font-family: var(--font-mono);
  font-size: var(--fs-md);
  color: var(--text-strong);
}

.tl__org {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.tl__desc {
  margin-top: var(--space-2);
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--text-body);
}

// ---- Formation (porté de About.jsx : flex column + <Card padded>) ----
// <ul> : neutraliser puces et marges UA (reset : margin 0 0 16px 32px).
.about__degrees {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  margin: var(--space-5) 0 0;
  padding: 0;
  list-style: none;
}

.about__degree-name {
  margin: var(--space-1) 0;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-strong);
}

// ---- Responsive (cf. kit.css @media max-width: 900px : .grid-2 → 1 colonne) ----
@media (width <= 900px) {
  .about__grid,
  .about__cv {
    grid-template-columns: 1fr;
    gap: var(--space-10);
  }
}
</style>
