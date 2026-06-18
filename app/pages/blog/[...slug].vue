<template>
  <main>
    <ContentRenderer v-if="page" :value="page" />
  </main>
</template>

<script setup lang="ts">
// @nuxt/content v3 : queryCollection + ContentRenderer remplacent <ContentDoc />.
const route = useRoute();
const { data: page } = await useAsyncData(`blog-${route.path}`, () => queryCollection("blog").path(route.path).first());
</script>
