<template>
  <main class="blog-article">
    <section class="section">
      <div class="container">
        <article v-if="page" class="article">
          <!-- Lien retour (porté de Blog.jsx : hdr__link « ← Retour au blog »).
               Le glyphe ← est décoratif (aria-hidden) : le lecteur d'écran lit « Retour au blog ». -->
          <NuxtLink to="/blog" class="article__back"><span aria-hidden="true">←</span> Retour au blog</NuxtLink>

          <!-- En-tête : tags, titre, méta (auteur · date · lecture), image héro -->
          <ul v-if="page.tags?.length" class="hero__tags article__tags">
            <li v-for="tag in page.tags" :key="tag">
              <ZTag>{{ tag }}</ZTag>
            </li>
          </ul>

          <h1 class="article__title">{{ page.title }}</h1>

          <div class="post__meta article__meta">
            <span>Simon Jouan</span>
            <span aria-hidden="true">·</span>
            <time :datetime="page.date">{{ formatDate(page.date) }}</time>
            <template v-if="page.read">
              <span aria-hidden="true">·</span>
              <span>{{ page.read }}</span>
            </template>
          </div>

          <NuxtImg
            v-if="page.image"
            class="article__hero"
            :src="page.image.src"
            :alt="page.image.alt"
            width="760"
            height="320"
            sizes="760px"
            format="webp"
          />

          <!-- Corps de l'article : HTML généré par @nuxt/content, stylé via :deep() -->
          <div class="prose article__prose">
            <ContentRenderer :value="page" />
          </div>

          <!-- Bloc CTA de fin (porté de Blog.jsx) -->
          <div class="article__cta">
            <span class="article__cta-label">Un projet en tête ?</span>
            <ZButton :as="NuxtLink" to="/contact" variant="primary">
              Démarrer un projet
              <template #iconRight><ZIcon name="arrow" /></template>
            </ZButton>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Vue article du blog (story 6.2) — porté de Blog.jsx (fonction Article) : structure
// .article (760px), en-tête tags/titre/méta/héro, prose Ubuntu sans, blocs de code en
// palette terminale (Shiki désactivé, cf. nuxt.config), CTA de fin. Contenu via
// @nuxt/content v3 (queryCollection + ContentRenderer). Prerender-safe (useAsyncData).
import { NuxtLink } from "#components";

const route = useRoute();

// Normalise le chemin (retire le(s) slash(es) final/aux) pour éviter un faux 404
// sur une URL du type "/blog/mon-article/".
const path = computed(() => route.path.replace(/\/+$/, "") || "/");

const { data: page, error } = await useAsyncData(
  // Clé reproductible côté SSR + refetch automatique lors d'une navigation client entre slugs.
  () => `blog-${path.value}`,
  () => queryCollection("blog").path(path.value).first(),
  { watch: [path] },
);

// Erreur adaptée à l'état courant : 500 si la requête de contenu échoue (on ne masque
// pas une vraie erreur derrière un 404), 404 uniquement quand l'article n'existe pas.
const resolveContentError = () => {
  if (error.value) {
    return createError({ statusCode: 500, statusMessage: "Erreur lors du chargement de l'article" });
  }
  if (!page.value) {
    return createError({ statusCode: 404, statusMessage: "Article introuvable" });
  }
  return null;
};

// Rendu initial (SSR / prerender) : throw pour fixer le bon statut HTTP. Pas besoin de
// `fatal: true` ici, un throw au niveau du setup est déjà traité comme une erreur de page.
const initialError = resolveContentError();
if (initialError) {
  throw initialError;
}

// Navigation client entre slugs : le refetch met à jour `page`/`error` sans réexécuter le
// setup → on (dé)clenche la page d'erreur de façon réactive.
if (import.meta.client) {
  watch([page, error], () => {
    const clientError = resolveContentError();
    if (clientError) {
      showError(clientError);
    } else {
      clearError();
    }
  });
}

// SEO par article (parité avec /about et /blog). `SITE_URL` = util partagé (app/utils/seo).
useHead(() => {
  const article = page.value;
  if (!article) {
    return {};
  }
  const url = `${SITE_URL}${article.path}`;
  const image = article.image ? `${SITE_URL}${article.image.src}` : undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: { "@type": "Person", name: "Simon Jouan" },
    url,
    ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
    ...(image ? { image } : {}),
  };
  return {
    title: `${article.title} — jouan.ovh`,
    link: [{ rel: "canonical", href: url }],
    meta: [
      { name: "description", content: article.description },
      { property: "og:type", content: "article" },
      { property: "og:title", content: article.title },
      { property: "og:description", content: article.description },
      { property: "og:url", content: url },
      ...(image ? [{ property: "og:image", content: image }] : []),
      { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
      { name: "twitter:title", content: article.title },
      { name: "twitter:description", content: article.description },
      ...(image ? [{ name: "twitter:image", content: image }] : []),
    ],
    script: [jsonLdScript(jsonLd)],
  };
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / Blog.jsx */
// .section / .container / .prose / .hero__tags / .post__meta sont des primitives de
// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
.blog-article {
  display: block;
}

// ---- Conteneur article (porté de kit.css : .article) ----
.article {
  max-width: 760px;
  margin: 0 auto;
}

// Lien retour (porté de kit.css : .hdr__link) — mono discret, soulignement + ring au focus.
.article__back {
  display: inline-block;
  margin-bottom: var(--space-5);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
  text-decoration: none;

  &:hover {
    color: var(--text-strong);
  }

  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 2px;
    border-radius: var(--radius-xs);
    box-shadow: var(--ring-accent);
  }
}

.article__tags {
  margin-bottom: var(--space-4);
}

// Titre article (porté de kit.css : .article h1).
.article__title {
  margin-bottom: var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--fs-4xl);
  font-weight: var(--fw-light);
  line-height: var(--lh-tight);
  color: var(--text-strong);
}

// Méta : base mono via .post__meta (global) ; ici on ajoute la marge de l'en-tête.
.article__meta {
  margin: var(--space-4) 0 var(--space-8);
}

// Image héro (porté de kit.css : .article__hero).
.article__hero {
  width: 100%;
  height: 320px;
  margin-bottom: var(--space-8);
  object-fit: cover;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
}

// ---- Prose (HTML généré par @nuxt/content → cibler via :deep()) ----
// .prose (global) donne déjà font-sans / lh-relaxed / text-body. Ici : taille + rythme
// vertical + titres + code, fidèles à kit.css (.article .prose ...).
.article__prose {
  font-size: var(--fs-md);

  :deep(p) {
    margin: 0 0 var(--space-5);
  }

  :deep(h2) {
    margin: var(--space-8) 0 var(--space-3);
    font-family: var(--font-mono);
    font-size: var(--fs-2xl);
    font-weight: var(--fw-regular);
    line-height: var(--lh-snug);
    color: var(--text-strong);
  }

  :deep(h3) {
    margin: var(--space-6) 0 var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--fs-xl);
    font-weight: var(--fw-regular);
    line-height: var(--lh-snug);
    color: var(--text-strong);
  }

  :deep(h4) {
    margin: var(--space-5) 0 var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--fs-lg);
    font-weight: var(--fw-medium);
    color: var(--text-strong);
  }

  // Emphase forte = couleur titre (cf. emphases bio /about).
  :deep(strong) {
    font-weight: var(--fw-bold);
    color: var(--text-strong);
  }

  // Liens du corps prose : couleur lien DS + ring de focus accessible.
  :deep(a) {
    color: var(--link);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }

    &:focus-visible {
      outline: 2px solid transparent; // forced-colors : rendu en couleur système
      outline-offset: 2px;
      border-radius: var(--radius-xs);
      box-shadow: var(--ring-accent);
    }
  }

  // Ancres d'auto-lien des titres (@nuxt/content enrobe chaque titre d'un <a href="#…">) :
  // garder le titre neutre (couleur héritée, pas de soulignement bleu).
  :deep(h2 a),
  :deep(h3 a),
  :deep(h4 a) {
    color: inherit;
    text-decoration: none;
  }

  // Bloc de code : palette terminale (fond aubergine, mono off-white). Shiki est
  // désactivé → <pre><code> nu, donc pas de styles inline par token à surcharger.
  :deep(pre) {
    margin: 0 0 var(--space-5);
    padding: var(--space-4);
    overflow: auto;
    font-family: var(--font-mono);
    font-size: var(--fs-sm);
    line-height: var(--lh-snug);
    color: var(--text-strong);
    background: var(--bg-terminal);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
  }

  // Code inline = vert terminal ; le code en bloc hérite la couleur du <pre> (off-white).
  :deep(code) {
    font-family: var(--font-mono);
    font-size: 0.92em;
    color: var(--term-green);
  }

  :deep(pre code) {
    color: inherit;
  }

  // Listes : indentation tokenisée, puces/numéros en accent (esprit DS, cf. .offer li).
  :deep(ul),
  :deep(ol) {
    margin: 0 0 var(--space-5);
    padding-left: var(--space-6);
  }

  :deep(li) {
    margin-bottom: var(--space-2);
  }

  :deep(li::marker) {
    color: var(--accent);
  }

  // Citation : filet d'accent + texte discret italique.
  :deep(blockquote) {
    margin: 0 0 var(--space-5);
    padding: var(--space-1) 0 var(--space-1) var(--space-4);
    color: var(--text-muted);
    font-style: italic;
    border-left: 2px solid var(--accent);
  }

  :deep(blockquote p:last-child) {
    margin-bottom: 0;
  }

  // Séparateur (filet discret).
  :deep(hr) {
    margin: var(--space-8) 0;
    border: 0;
    border-top: 1px solid var(--border-subtle);
  }

  // Tableaux : filets DS, en-tête mono sur surface élevée.
  :deep(table) {
    width: 100%;
    margin: 0 0 var(--space-5);
    font-size: var(--fs-sm);
    border-collapse: collapse;
  }

  :deep(th),
  :deep(td) {
    padding: var(--space-2) var(--space-3);
    text-align: left;
    border: 1px solid var(--border-default);
  }

  :deep(th) {
    font-family: var(--font-mono);
    font-weight: var(--fw-medium);
    color: var(--text-strong);
    background: var(--bg-elevated);
  }

  // Images insérées dans la prose : jamais de débordement, coins arrondis DS.
  :deep(img) {
    max-width: 100%;
    height: auto;
    margin: var(--space-2) 0 var(--space-5);
    border-radius: var(--radius-md);
  }
}

// ---- Bloc CTA de fin (porté de Blog.jsx) ----
.article__cta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  align-items: center;
  justify-content: space-between;
  margin-top: var(--space-10);
  padding-top: var(--space-6);
  border-top: 1px solid var(--border-subtle);
}

.article__cta-label {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}
</style>
