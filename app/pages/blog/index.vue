<template>
  <main class="blog">
    <section class="section">
      <div class="container">
        <!-- En-tête (porté de Blog.jsx : eyebrow + titre + sous-titre prose) -->
        <p class="eyebrow">// ~/blog</p>
        <h1 class="blog__title">Notes de dev</h1>
        <p class="prose blog__subtitle">
          WordPress, architecture, IA appliquée — ce que j'apprends en construisant des choses.
        </p>

        <!-- Liste des articles (triés par date décroissante), cartes interactives -->
        <ul v-if="articles && articles.length" class="blog__list">
          <li v-for="article in articles" :key="article.path" class="blog__item">
            <ZCard :as="NuxtLink" :to="article.path" interactive class="post">
              <NuxtImg
                v-if="article.image"
                class="post__thumb"
                :src="article.image.src"
                :alt="article.image.alt"
                width="200"
                height="130"
                sizes="200px"
                format="webp"
              />
              <div class="post__body">
                <ul v-if="article.tags?.length" class="hero__tags post__tags">
                  <li v-for="tag in article.tags" :key="tag">
                    <ZTag>{{ tag }}</ZTag>
                  </li>
                </ul>
                <h2 class="post__title">{{ article.title }}</h2>
                <p class="post__desc">{{ article.description }}</p>
                <div class="post__meta">
                  <span>{{ formatDate(article.date) }}</span>
                  <!-- `read` est optionnel : pas de séparateur ni de « de lecture » orphelins. -->
                  <template v-if="article.read">
                    <span aria-hidden="true">·</span>
                    <span>{{ article.read }} de lecture</span>
                  </template>
                </div>
              </div>
            </ZCard>
          </li>
        </ul>

        <!-- Erreur de chargement (distincte d'un véritable empty-state) -->
        <ZCard v-else-if="error" class="blog__notice" padded>
          <NuxtImg
            class="blog__notice-img"
            src="/images/undraw_code_thinking_re_gka2.svg"
            alt=""
            width="220"
            height="165"
          />
          <h2 class="blog__notice-title">Le chargement des articles a échoué.</h2>
          <p class="prose blog__notice-text">
            Une erreur est survenue lors de la récupération des articles. Ce n'est pas vous, c'est moi : merci de
            réessayer dans quelques instants.
          </p>
        </ZCard>

        <!-- Empty-state : aucun article publié (texte français conservé, restylé via tokens) -->
        <ZCard v-else class="blog__notice" padded>
          <NuxtImg
            class="blog__notice-img"
            src="/images/undraw_code_thinking_re_gka2.svg"
            alt=""
            width="220"
            height="165"
          />
          <h2 class="blog__notice-title">Pas encore d'articles.</h2>
          <p class="prose blog__notice-text">
            Je travaille actuellement sur de nouveaux contenus pour partager ce que j'apprends en développement web.
            Revenez bientôt pour découvrir mes prochaines publications.
          </p>
        </ZCard>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Index du blog (story 6.1) — porté de Blog.jsx : en-tête + liste d'articles en
// cartes ZCard interactives, méta mono, empty-state restylé. Contenu via @nuxt/content
// v3 (queryCollection). Dark-first, tokens uniquement, prerender-safe (requête résolue
// au build par useAsyncData). La vue article (/blog/[...slug]) est la story 6.2.
import { NuxtLink } from "#components";

// Articles triés par date décroissante. La requête de contenu est résolue côté
// build/SSR → rendu prerender-safe. `error` distingue un échec de chargement d'un
// véritable empty-state (liste vide).
const { data: articles, error } = await useAsyncData("blog-list", () =>
  queryCollection("blog").order("date", "DESC").all(),
);

// Date ISO (front-matter) → affichage français. timeZone UTC : rendu déterministe
// (indépendant du fuseau de build), pas de décalage d'un jour à l'hydration.
const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const formatDate = (iso: string) => dateFormatter.format(new Date(iso));

// Métadonnées de la page. Domaine de production cf. public/CNAME (dev.jouan.ovh).
const siteUrl = "https://dev.jouan.ovh";
const pageTitle = "Blog — jouan.ovh";
const pageDescription =
  "Notes de dev — WordPress, architecture et IA appliquée : ce que j'apprends en construisant des produits web.";
const pageUrl = `${siteUrl}/blog`;

// JSON-LD : flux d'articles (Blog → BlogPosting) pour les moteurs / agrégateurs.
// Construit à partir de la liste résolue (snapshot au build, page prerendue).
const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Notes de dev",
  description: pageDescription,
  url: pageUrl,
  blogPost: (articles.value ?? []).map((article) => ({
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    url: `${siteUrl}${article.path}`,
    ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
    ...(article.image ? { image: `${siteUrl}${article.image.src}` } : {}),
  })),
};

useHead({
  title: pageTitle,
  link: [{ rel: "canonical", href: pageUrl }],
  meta: [
    { name: "description", content: pageDescription },
    // Open Graph (partage Facebook/LinkedIn…).
    { property: "og:type", content: "website" },
    { property: "og:title", content: pageTitle },
    { property: "og:description", content: pageDescription },
    { property: "og:url", content: pageUrl },
    // Twitter Card.
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: pageTitle },
    { name: "twitter:description", content: pageDescription },
  ],
  script: [{ type: "application/ld+json", innerHTML: JSON.stringify(blogJsonLd) }],
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / Blog.jsx */
// .section / .container / .eyebrow / .prose / .hero__tags sont des primitives de
// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
.blog {
  display: block;
}

// ---- En-tête (porté de Blog.jsx L9-13) ----
.blog__title {
  margin-bottom: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-4xl);
  font-weight: var(--fw-light);
  line-height: var(--lh-tight);
  color: var(--text-strong);
}

.blog__subtitle {
  max-width: 56ch;
  margin-bottom: var(--space-10);
  color: var(--text-muted);
}

// ---- Liste d'articles (porté de Blog.jsx : flex column + .post de kit.css) ----
// <ul> sémantique (annonce « liste de N articles ») : reset des puces et marges UA.
.blog__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;
}

// Carte article = ZCard interactive rendue en lien : grille vignette / contenu.
.post {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: var(--space-5);
  text-decoration: none;
  color: inherit;
}

.post__thumb {
  width: 100%;
  height: 130px;
  object-fit: cover;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
}

.post__tags {
  margin-bottom: var(--space-2);
}

.post__title {
  margin-bottom: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-xl);
  font-weight: var(--fw-regular);
  line-height: var(--lh-snug);
  color: var(--text-strong);
}

.post__desc {
  margin: 0 0 var(--space-3);
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  line-height: var(--lh-relaxed);
  color: var(--text-body);
}

.post__meta {
  display: flex;
  gap: var(--space-3);
  align-items: center;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--text-faint);
}

// ---- Empty-state / erreur (ZCard centrée, illustration + message) ----
.blog__notice {
  max-width: 60ch;
  margin: 0 auto;
  text-align: center;
}

.blog__notice-img {
  width: 220px;
  height: auto;
  margin: 0 auto var(--space-6);
}

.blog__notice-title {
  margin-bottom: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-xl);
  font-weight: var(--fw-regular);
  color: var(--text-strong);
}

.blog__notice-text {
  color: var(--text-muted);
}

// ---- Responsive (cf. kit.css @media max-width: 900px : .post → 1 colonne) ----
@media (width <= 900px) {
  .post {
    grid-template-columns: 1fr;
  }
}
</style>
