<template>
  <main>
    <ContentRenderer v-if="page" :value="page" />
  </main>
</template>

<script setup lang="ts">
// @nuxt/content v3 : queryCollection + ContentRenderer remplacent <ContentDoc />.
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
</script>
