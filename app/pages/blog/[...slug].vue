<template>
  <main>
    <ContentRenderer v-if="page" :value="page" />
  </main>
</template>

<script setup lang="ts">
// @nuxt/content v3 : queryCollection + ContentRenderer remplacent <ContentDoc />.
const route = useRoute();
const { data: page } = await useAsyncData(
  // Clé reproductible côté SSR + refetch automatique lors d'une navigation client entre slugs.
  () => `blog-${route.path}`,
  () => queryCollection("blog").path(route.path).first(),
  { watch: [() => route.path] },
);

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: "Article introuvable", fatal: true });
}
</script>
