<template>
  <main class="home">
    <ClientOnly>
      <HomeBootOverlay @boot-complete="onBootComplete" />
    </ClientOnly>
    <HomeAtmosComponent />
    <ZCustomCursor />

    <section class="hero">
      <div class="hero__in container">
        <div class="hero__grid">
          <!-- Colonne gauche : accroche commerciale, badge dispo, CTAs -->
          <div class="anim hero__text">
            <h2 class="eyebrow">
              <span aria-hidden="true">// </span>DÉVELOPPEUR FULL STACK · SYSTÈMES IA &amp; AUTOMATISATION
            </h2>
            <h1 class="hero__title">Automatisez les workflows qui freinent votre équipe.</h1>
            <p class="hero__sub">
              Je conçois des agents IA, automatisations et applications métier qui s’intègrent à vos outils existants —
              de l’identification du problème jusqu’à la mise en production.
            </p>
            <p class="hero__credibility">
              Full Stack TypeScript · Agents IA · APIs · PostgreSQL · MCP · IA locale · QA
            </p>

            <div class="hero__badge-wrap">
              <span class="hero__pulse-dot" aria-hidden="true" />
              <span>Disponible pour nouvelles missions freelance</span>
              <template v-if="SITE.profile.maltUrl">
                <span aria-hidden="true"> · </span>
                <ZExternalLink :href="SITE.profile.maltUrl"> Profil Malt vérifié </ZExternalLink>
              </template>
            </div>

            <div class="hero__cta">
              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
                Identifier un workflow à automatiser
                <template #iconRight><ZIcon name="arrow" /></template>
              </ZButton>
              <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir mes systèmes IA </ZButton>
            </div>
          </div>

          <!-- Colonne droite : terminal hero cinétique -->
          <div class="anim hero__term-col">
            <HomeHeroTerminal :auto-start="isBootFinished" />
          </div>
        </div>

        <!-- Ruban défilant de la stack moderne remonté au sein du hero (fidèle à la maquette) -->
        <HomeStackMarquee class="hero__marquee" />
      </div>
    </section>

    <!-- Vitrine des 3 services cibles (Story 12.3 / AC-1) -->
    <section class="section">
      <div class="container">
        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos systèmes</h2>
        <ul class="grid-3">
          <li v-for="service in services" :key="service.id">
            <ZCard class="offer" interactive tilt :accent="service.featured" :featured="service.featured">
              <div class="offer__top">
                <div class="offer__icon"><ZIcon :name="service.icon" /></div>
                <span class="offer__no">{{ service.no }}</span>
              </div>
              <h3 class="offer__title">{{ service.title }}</h3>
              <p class="offer__desc">{{ service.desc }}</p>
              <ul class="offer__points">
                <li v-for="point in service.points" :key="point">
                  <ZIcon name="check" class="offer__check" />
                  <span>{{ point }}</span>
                </li>
              </ul>
              <ul class="hero__tags offer__tags">
                <li v-for="tag in service.tags" :key="tag">
                  <ZTag>{{ tag }}</ZTag>
                </li>
              </ul>
              <div class="offer__price">
                <span>{{ service.price }}</span>
              </div>
              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
                En savoir plus →
              </NuxtLink>
            </ZCard>
          </li>
        </ul>
      </div>
    </section>

    <!-- Bloc différenciateur « Prototype → Production » (Story 12.3 / AC-2) -->
    <section class="section section--sunken diff-block">
      <div class="container">
        <p class="eyebrow"><span aria-hidden="true">// </span>au-delà de la démo</p>
        <h2 class="section__title diff-block__title">
          Un agent qui fonctionne trois fois n’est pas encore un système fiable.
        </h2>
        <p class="prose diff-block__lead">
          Mon background Full Stack et QA me permet de traiter ce qui arrive après le prototype : authentification,
          permissions, données, erreurs, retries, logs, tests, coûts, monitoring, sécurité et supervision humaine.
          L’objectif n’est pas de mettre de l’IA partout. L’objectif est de construire un workflow qui reste utile
          lorsqu’il rencontre la vraie vie.
        </p>

        <ul class="pillars-grid">
          <li v-for="pillar in pillars" :key="pillar.id">
            <ZCard class="pillar" padded>
              <div class="pillar__icon">
                <ZIcon :name="pillar.icon" />
              </div>
              <h3 class="pillar__title">{{ pillar.title }}</h3>
              <p class="pillar__desc">{{ pillar.desc }}</p>
            </ZCard>
          </li>
        </ul>
      </div>
    </section>

    <!-- Projets sélectionnés & Statistiques de réassurance (Story 11.4 / AC-1 & AC-2) -->
    <section class="section">
      <div class="container">
        <div class="block__head">
          <p class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</p>
          <h2 class="section__title">Des produits qui tournent en production</h2>
        </div>

        <ul class="work">
          <li v-for="(project, index) in projects" :key="project.name">
            <component
              :is="project.url ? ZExternalLink : 'div'"
              :href="project.url"
              class="work__row"
              :class="{ 'work__row--link': Boolean(project.url) }"
              :data-hot="project.url ? '' : undefined"
              @mousemove="onProjectMouseMove"
              @mouseleave="onProjectMouseLeave"
            >
              <span class="work__no">{{ String(index + 1).padStart(2, "0") }}</span>
              <div class="work__main">
                <div class="work__topline">
                  <h3 class="work__name">{{ project.name }}</h3>
                  <span v-if="project.status" class="work__status">{{ project.status }}</span>
                </div>
                <p class="work__role">{{ project.role }}</p>
                <p class="prose work__desc">{{ project.desc }}</p>
                <ul class="hero__tags work__tags">
                  <li v-for="(tag, tagIndex) in project.tags" :key="`${tag}-${tagIndex}`">
                    <ZTag>{{ tag }}</ZTag>
                  </li>
                </ul>
              </div>
              <span v-if="project.url" class="work__go" aria-hidden="true">
                <ZIcon name="arrow" />
              </span>
            </component>
          </li>
        </ul>

        <!-- Statistiques clés de réassurance (Story 11.4 / AC-2) -->
        <ul class="stats">
          <li v-for="stat in stats" :key="stat.id" class="stat">
            <b>{{ stat.value }}</b>
            <span>{{ stat.label }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Journal technique / Notes de dev (Story 11.4 / AC-3) -->
    <section class="section">
      <div class="container">
        <div class="block__head block__head--row">
          <div>
            <p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>
            <h2 class="section__title">Notes de dev, écrites en construisant</h2>
          </div>
          <NuxtLink to="/blog" class="seeall" data-hot>
            cat tous-les-articles
            <ZIcon name="arrow" class="seeall__icon" />
          </NuxtLink>
        </div>

        <!-- Liste des articles les plus récents -->
        <ul v-if="articles && articles.length" class="journal">
          <li v-for="article in articles" :key="article.path" class="journal__item">
            <ZCard :as="NuxtLink" :to="article.path" :padded="false" interactive tilt class="jpost" data-hot>
              <NuxtImg
                v-if="article.image"
                class="jpost__thumb"
                :src="article.image.src"
                :alt="article.image.alt"
                width="360"
                height="200"
                sizes="360px"
                format="webp"
              />
              <div class="jpost__body">
                <ul v-if="article.tags?.length" class="hero__tags jpost__tags">
                  <li v-for="(tag, tagIndex) in article.tags" :key="`${tag}-${tagIndex}`">
                    <ZTag>{{ tag }}</ZTag>
                  </li>
                </ul>
                <h3 class="jpost__title">{{ article.title }}</h3>
                <p v-if="article.description" class="prose jpost__desc">{{ article.description }}</p>
                <div class="jpost__meta">
                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
                  <template v-if="article.read">
                    <span aria-hidden="true">·</span>
                    <span>{{ article.read }} de lecture</span>
                  </template>
                  <span class="jpost__arrow" aria-hidden="true">
                    <ZIcon name="arrow" />
                  </span>
                </div>
              </div>
            </ZCard>
          </li>
        </ul>

        <!-- État d'attente sobre lorsque aucun article n'est encore publié -->
        <ZCard v-else class="journal__empty" padded>
          <p class="journal__empty-code">$ cat ~/journal/*.md</p>
          <p class="journal__empty-text">Les notes d'ingénierie et retours d'expérience sont en cours de rédaction.</p>
          <ZButton :as="NuxtLink" to="/blog" variant="secondary" size="sm"> Consulter la section blog </ZButton>
        </ZCard>
      </div>
    </section>

    <!-- Bloc CTA final de conversion (Story 11.4 / AC-4) -->
    <section class="section">
      <div class="container">
        <div class="cta">
          <p class="eyebrow cta__eyebrow"><span aria-hidden="true">$ </span>./contact --start</p>
          <h2 class="cta__title">
            Un projet en tête ?<br />
            Mettons-le <span class="cta__highlight">en production</span>.
          </h2>
          <p class="cta__subtitle">
            Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript,
            parlons-en.
          </p>
          <div class="cta__actions">
            <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg" data-hot>
              Discuter de votre projet
              <template #iconRight><ZIcon name="arrow" /></template>
            </ZButton>
            <ZButton
              v-if="SITE.profile.maltUrl"
              :as="ZExternalLink"
              :href="SITE.profile.maltUrl"
              variant="secondary"
              size="lg"
              data-hot
            >
              Me contacter sur Malt
            </ZButton>
            <ZButton :as="NuxtLink" to="/about" variant="ghost" size="lg" data-hot> Voir le parcours &amp; CV </ZButton>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Page d'accueil — refonte Hero Full Stack TS, Projets SaaS, Journal & CTA final (Story 11.4).
// Architecture multi-pages Nuxt 4, dark-first, accent orange.
import { onBeforeUnmount, onMounted, ref } from "vue";
import { NuxtLink, ZExternalLink } from "#components";
import { SITE } from "~/data/site";

const isBootFinished = ref(false);
const isReducedMotion = ref(false);
let motionMq: MediaQueryList | null = null;

function onMotionChange(e: MediaQueryListEvent) {
  isReducedMotion.value = e.matches;
}

onMounted(() => {
  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  isReducedMotion.value = motionMq.matches;
  motionMq.addEventListener("change", onMotionChange);
});

onBeforeUnmount(() => {
  motionMq?.removeEventListener("change", onMotionChange);
});

function onBootComplete() {
  isBootFinished.value = true;
}

function onProjectMouseMove(event: MouseEvent) {
  if (isReducedMotion.value) {
    return;
  }
  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
    return;
  }
  const target = event.currentTarget as HTMLElement | null;
  if (!target) {
    return;
  }
  const rect = target.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return;
  }
  const px = (event.clientX - rect.left) / rect.width - 0.5;
  const py = (event.clientY - rect.top) / rect.height - 0.5;
  target.style.transform = `perspective(1000px) rotateX(${-py * 3.5}deg) rotateY(${px * 4.5}deg) translateY(-2px)`;
}

function onProjectMouseLeave(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement | null;
  if (target) {
    target.style.transform = "";
  }
}

interface HomeServiceOffer {
  id: string;
  no: string;
  icon: "code" | "layers" | "spark" | "bot" | "terminal" | "zap";
  title: string;
  desc: string;
  points: string[];
  tags: string[];
  price: string;
  featured: boolean;
}

interface ProductionPillar {
  id: string;
  icon: "code" | "layers" | "spark" | "bot" | "terminal" | "zap";
  title: string;
  desc: string;
}

// Vitrine des 3 offres ciblées Systèmes IA & Automatisation (Story 12.3 / AC-1).
const services: HomeServiceOffer[] = [
  {
    id: "automation",
    no: "01 / 03",
    icon: "layers",
    title: "Automatisation de processus métier",
    desc: "Cartographie d'un workflow existant, identification des tâches répétitives et construction du système qui automatise ce qui mérite réellement de l'être.",
    points: [
      "Cartographie de flux & connecteurs d'APIs",
      "Ingestion, enrichissement et traitement de données",
      "Synchronisation d'outils métier & reporting",
    ],
    tags: ["Workflow", "APIs", "Automation", "PostgreSQL"],
    price: "À partir de 3 500 € HT",
    featured: false,
  },
  {
    id: "agents",
    no: "02 / 03",
    icon: "bot",
    title: "Agents IA intégrés à vos outils",
    desc: "Intégration d'agents outillés dans vos flux existants pour lire, interpréter, synthétiser et décider sans casser vos habitudes de travail.",
    points: [
      "Agents outillés (Tool Calling) & serveurs MCP",
      "Extraction structurée & analyse documentaire",
      "Supervision humaine obligatoire (Human-in-the-loop)",
    ],
    tags: ["Agents IA", "LLM", "MCP", "Human-in-the-loop"],
    price: "À partir de 3 500 € HT",
    featured: true,
  },
  {
    id: "apps",
    no: "03 / 03",
    icon: "code",
    title: "Applications IA sur mesure",
    desc: "Développement complet de solutions logicielles dédiées quand le workflow nécessite une interface, un backend robuste et une base de données sur mesure.",
    points: [
      "Applications web complètes Nuxt & NestJS",
      "Applications desktop sécurisées Tauri (IA locale)",
      "Architecture PostgreSQL, tests QA & déploiement",
    ],
    tags: ["TypeScript", "Nuxt", "NestJS", "PostgreSQL", "Tauri"],
    price: "Sur mesure / Sprint",
    featured: false,
  },
];

// 4 Piliers d'industrialisation « Prototype → Production » (Story 12.3 / AC-2).
const pillars: ProductionPillar[] = [
  {
    id: "data",
    icon: "layers",
    title: "Données",
    desc: "Provenance, structuration, stockage, rétention, secrets.",
  },
  {
    id: "reliability",
    icon: "zap",
    title: "Fiabilité",
    desc: "Cas limites, retries, fallbacks, tests, observabilité.",
  },
  {
    id: "ai",
    icon: "bot",
    title: "IA",
    desc: "Sorties structurées, versionnage, évaluations, contrôle humain.",
  },
  {
    id: "ops",
    icon: "terminal",
    title: "Exploitation",
    desc: "Monitoring, coûts, support, maintenance, évolution.",
  },
];

// Projets sélectionnés — source unique `app/data/site.ts` (Story 11.4 / AC-1).
const projects = SITE.projects;

// Chiffres clés de réassurance (Story 11.4 / AC-2).
const stats = [
  { id: "stat-1", value: "11", label: "années d'expérience web" },
  { id: "stat-2", value: "100%", label: "TypeScript & SaaS de bout en bout" },
  { id: "stat-3", value: "QA", label: "culture d'automatisation & zéro régression" },
];

// Récupération des 3 derniers articles du journal technique (Story 11.4 / AC-3).
const { data: articles } = await useAsyncData("home-articles", () =>
  queryCollection("blog").order("date", "DESC").limit(3).all(),
);

const siteUrl = useSiteUrl();
const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Simon Jouan — Développeur Full Stack TypeScript",
    url: siteUrl,
    description: SITE.profile.role,
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.profile.name,
    jobTitle: SITE.profile.role,
    url: siteUrl,
    image: `${siteUrl}/images/portrait.jpeg`,
    email: SITE.profile.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.profile.city,
      addressCountry: "FR",
    },
  },
];

usePageSeo({
  title: "Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS",
  description:
    "Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL.",
  path: "/",
  image: "/images/portrait.jpeg",
  type: "website",
  jsonLd: homeJsonLd,
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Home.jsx */
.home {
  display: block;
}

// Entrée one-shot (pas une boucle) — keyframe globale fade-rise (_root.scss).
.anim {
  animation: fade-rise var(--dur-slow) var(--ease-out) both;
}

.hero__term-col {
  // Décalage d'entrée fidèle à Home.jsx (animationDelay 80ms) — pas de token motion
  // équivalent (les --dur-* couvrent les transitions, pas les délais d'orchestration).
  animation-delay: 80ms;
}

// ---- Hero (porté de kit.css & Home - Awwwards.html) ----
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: calc(var(--header-height) + var(--space-6)) 0 var(--space-10);
  background: transparent;
}

.hero__in {
  position: relative;
  z-index: 1;
  width: 100%;
}

.hero__grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: var(--space-12);
  align-items: center;
}

.hero__marquee {
  margin-top: var(--space-10);
}

// .section / .container / .eyebrow / .prose : primitives de layout globales
// (app/assets/scss/base/_layout.scss) — non redéclarées ici.

// ---- Colonne texte ----
.hero__title {
  margin: 0;
  font-family: var(--font-mono);
  font-size: clamp(2.6rem, 6.4vw, 5.2rem);
  font-weight: var(--fw-regular);
  line-height: 0.98;
  letter-spacing: var(--ls-tight);
  color: var(--text-strong);
  text-shadow: 0 2px 14px color-mix(in srgb, var(--surface-0) 80%, transparent);

  em {
    font-style: italic;
    color: var(--accent);
  }
}

.hero__sub {
  max-width: 46ch;
  margin: var(--space-5) 0 var(--space-4);
  font-family: var(--font-sans);
  font-size: var(--fs-lg);
  line-height: var(--lh-relaxed);
  color: var(--text-body);
  text-shadow: 0 1px 8px color-mix(in srgb, var(--surface-0) 70%, transparent);
}

.hero__credibility {
  margin: 0 0 var(--space-6);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: var(--ls-wide);
  color: var(--text-muted);
}

.hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

// ---- Badge de disponibilité & CTAs ----
.hero__badge-wrap {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-body);

  a {
    color: var(--accent);
    text-decoration: underline;

    &:hover {
      color: var(--accent-hover);
    }

    &:focus-visible {
      outline: 2px solid transparent;
      outline-offset: 2px;
      box-shadow: var(--ring-accent);
    }
  }
}

.hero__pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-circle);
  background: var(--success);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 60%, transparent);
  animation: pulse-dot 2.2s infinite var(--ease-out);

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
}

@keyframes pulse-dot {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 60%, transparent);
  }

  70% {
    box-shadow: 0 0 0 6px color-mix(in srgb, var(--success) 0%, transparent);
  }

  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 0%, transparent);
  }
}

.section__title {
  margin-bottom: var(--space-8);
  font-family: var(--font-mono);
  font-size: var(--fs-3xl);
  font-weight: var(--fw-regular);
  color: var(--text-strong);
}

// ---- Aperçu services (porté de .grid-3 / .offer*) ----
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

.offer__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.offer__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-10); // 40px
  height: var(--space-10);

  // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
  // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
  font-size: 22px;
  color: var(--accent);
  background: var(--accent-soft);
  border-radius: var(--radius-md);
}

.offer__no {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: var(--ls-wider);
  color: var(--text-faint);
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
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin: 0 0 var(--space-4);
  padding: 0;
  list-style: none;

  li {
    display: flex;
    gap: var(--space-2);
    align-items: flex-start;
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    line-height: var(--lh-normal);
    color: var(--text-muted);
  }
}

.offer__check {
  flex-shrink: 0;
  margin-top: calc(var(--space-1) / 2);
  font-size: var(--fs-sm);
  color: var(--term-green);
}

.offer__tags {
  margin-bottom: var(--space-4);
}

.offer__price {
  margin-top: auto;
  padding-top: var(--space-4);
  border-top: 1px dashed var(--border-subtle);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--accent);
}

.offer__more {
  margin-top: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--accent);
  text-decoration: none;

  &::after {
    position: absolute;
    inset: 0;
    content: "";
  }

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    // Outline transparent : rendu en couleur système sous forced-colors.
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
    border-radius: var(--radius-xs);
  }
}

// ---- Bloc Différenciateur « Prototype → Production » (Story 12.3 / AC-2) ----
.diff-block__title {
  max-width: 28ch;
  margin-bottom: var(--space-4);
}

.diff-block__lead {
  max-width: 72ch;
  margin: 0 0 var(--space-8);
  font-size: var(--fs-md);
  line-height: var(--lh-relaxed);
  color: var(--text-body);
}

.pillars-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    display: flex;
  }
}

.pillar {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.pillar__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-10);
  height: var(--space-10);
  margin-bottom: var(--space-4);
  font-size: var(--fs-xl);
  color: var(--accent);
  background: var(--accent-soft);
  border-radius: var(--radius-md);
}

.pillar__title {
  margin: 0 0 var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-lg);
  font-weight: var(--fw-regular);
  color: var(--text-strong);
}

.pillar__desc {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  line-height: var(--lh-normal);
  color: var(--text-muted);
}

// ---- Section Projets sélectionnés (porté de Home - Awwwards.html .work) ----
.work {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    display: block;
    width: 100%;
  }
}

.work__row {
  position: relative;
  display: grid;
  grid-template-columns: var(--fs-6xl) 1fr auto;
  gap: var(--space-6);
  align-items: center;
  padding: var(--space-8) var(--space-3);
  border-top: 1px solid var(--border-subtle);
  text-decoration: none;
  color: inherit;
  transition:
    padding-left var(--dur-slow) var(--ease-out),
    background var(--dur-slow) var(--ease-standard),
    transform var(--dur-fast) var(--ease-standard);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, var(--accent-soft), transparent 60%);
    opacity: 0;
    transition: opacity var(--dur-slow) var(--ease-standard);
  }
}

li:last-child .work__row {
  border-bottom: 1px solid var(--border-subtle);
}

.work__row--link {
  cursor: pointer;

  &:hover {
    padding-left: var(--space-6);

    &::before {
      opacity: 1;
    }

    .work__name {
      color: var(--accent);
    }

    .work__go {
      color: var(--accent);
      transform: translate(6px, -6px);
    }
  }

  &:focus-visible {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
    border-radius: var(--radius-xs);
  }
}

.work__no {
  position: relative;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-faint);
}

.work__main {
  position: relative;
}

.work__topline {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-3);
}

.work__name {
  margin: 0;
  font-family: var(--font-mono);
  font-size: clamp(1.4rem, 2.8vw, 2rem);
  font-weight: var(--fw-regular);
  letter-spacing: var(--ls-tight);
  color: var(--text-strong);
  transition: color var(--dur-base) var(--ease-standard);
}

.work__status {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--accent);
  letter-spacing: var(--ls-wide);
}

.work__role {
  margin: var(--space-1) 0 0;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--text-muted);
}

.work__desc {
  max-width: 65ch;
  margin: var(--space-3) 0 0;
  font-size: var(--fs-sm);
}

.work__tags {
  margin-top: var(--space-4);
}

.work__go {
  position: relative;
  font-size: var(--fs-xl);
  color: var(--text-faint);
  transition:
    transform var(--dur-base) var(--ease-out),
    color var(--dur-base) var(--ease-standard);
}

// ---- Stats (porté de .stats) ----
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  margin: var(--space-12) 0 0;
  padding: 0;
  list-style: none;
}

.stat {
  padding: var(--space-6);
  background: color-mix(in srgb, var(--surface-1) 85%, transparent);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-2);
  backdrop-filter: blur(8px);
  transition:
    border-color var(--dur-fast) var(--ease-standard),
    transform var(--dur-fast) var(--ease-standard);

  &:hover {
    border-color: var(--border-strong);
    transform: translateY(-2px);
  }

  b {
    display: block;
    margin-bottom: var(--space-2);
    font-family: var(--font-mono);
    font-size: clamp(var(--fs-4xl), 4.5vw, var(--fs-5xl));
    font-weight: var(--fw-bold);
    line-height: 1;
    letter-spacing: var(--ls-tight);
    color: var(--text-strong);
  }

  span {
    font-family: var(--font-mono);
    font-size: var(--fs-sm);
    letter-spacing: var(--ls-wide);
    color: var(--text-muted);
  }
}

// ---- Section Journal (porté de Home - Awwwards.html .journal) ----
.block__head--row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-6);
  margin-bottom: var(--space-8);

  .section__title {
    margin-bottom: 0;
  }
}

.seeall {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
  text-decoration: none;
  white-space: nowrap;
  transition: color var(--dur-base) var(--ease-standard);

  &:hover {
    color: var(--accent);
  }

  &:focus-visible {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
    border-radius: var(--radius-xs);
  }
}

.seeall__icon {
  font-size: var(--fs-base);
}

.journal {
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

.jpost {
  display: flex;
  flex-direction: column;
  width: 100%;
  color: inherit;
  text-decoration: none;

  &:hover {
    .jpost__title {
      color: var(--accent);
    }

    .jpost__arrow {
      color: var(--accent);
      transform: translate(4px, -4px);
    }
  }
}

.jpost__thumb {
  width: 100%;
  height: 10rem;
  object-fit: cover;
  border-bottom: 1px solid var(--border-subtle);
}

.jpost__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: var(--space-5);
}

.jpost__tags {
  margin-bottom: var(--space-3);
}

.jpost__title {
  margin: 0 0 var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-lg);
  font-weight: var(--fw-regular);
  line-height: var(--lh-snug);
  color: var(--text-strong);
  transition: color var(--dur-base) var(--ease-standard);
}

.jpost__desc {
  margin: 0 0 var(--space-4);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.jpost__meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: auto;
  padding-top: var(--space-4);
  border-top: 1px dashed var(--border-subtle);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--text-faint);
}

.jpost__arrow {
  margin-left: auto;
  font-size: var(--fs-base);
  color: var(--text-faint);
  transition:
    transform var(--dur-base) var(--ease-out),
    color var(--dur-base) var(--ease-standard);
}

.journal__empty {
  max-width: 60ch;
  margin: 0 auto;
  text-align: center;
}

.journal__empty-code {
  margin: 0 0 var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--accent);
}

.journal__empty-text {
  margin: 0 0 var(--space-5);
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  line-height: var(--lh-relaxed);
  color: var(--text-muted);
}

// ---- Bloc CTA final (porté de .cta) ----
.cta {
  position: relative;
  padding: clamp(48px, 7vw, 84px) var(--space-6);
  overflow: hidden;
  text-align: center;
  background:
    radial-gradient(ellipse 80% 120% at 50% 0%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%),
    color-mix(in srgb, var(--surface-1) 85%, transparent);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-3), var(--shadow-hairline);
}

.cta__eyebrow {
  display: inline-block;
  margin-bottom: var(--space-4);
}

.cta__title {
  margin: 0 0 var(--space-4);
  font-family: var(--font-mono);
  font-size: clamp(2rem, 4.5vw, 3.2rem);
  font-weight: var(--fw-regular);
  line-height: 1.08;
  letter-spacing: var(--ls-tight);
  color: var(--text-strong);
}

.cta__highlight {
  font-style: italic;
  color: var(--accent);
}

.cta__subtitle {
  max-width: 58ch;
  margin: 0 auto var(--space-8);
  font-family: var(--font-sans);
  font-size: var(--fs-lg);
  line-height: var(--lh-relaxed);
  color: var(--text-muted);
}

.cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  justify-content: center;
  align-items: center;
}

// ---- Responsive ----
@media (width <= 900px) {
  .hero__grid {
    grid-template-columns: 1fr;
  }

  .hero__title {
    font-size: var(--fs-4xl);
  }

  .grid-3,
  .journal {
    grid-template-columns: 1fr;
  }

  .pillars-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .block__head--row {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (width <= 680px) {
  .work__row {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }

  .work__no,
  .work__go {
    display: none;
  }

  .pillars-grid,
  .stats {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .anim {
    animation: none;
  }

  .work__row,
  .work__go,
  .jpost__arrow,
  .seeall {
    transition: none;
  }

  .stat {
    transition: none;

    &:hover {
      transform: none;
    }
  }

  .work__row {
    transform: none !important;
  }

  .work__row--link:hover {
    padding-left: var(--space-3);

    .work__go {
      transform: none;
    }
  }

  .jpost:hover {
    .jpost__arrow {
      transform: none;
    }
  }
}
</style>
