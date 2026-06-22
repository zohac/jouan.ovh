<template>
  <ul class="hexrow">
    <li v-for="social in socials" :key="social.icon">
      <HexagonLinkComponent :link="social.url">
        <template #icon><ZIcon :name="social.icon" /></template>
        <template #title>{{ social.label }}</template>
      </HexagonLinkComponent>
    </li>
  </ul>
</template>

<script setup lang="ts">
// Rangée d'hexagones sociaux (footer / contact). Glyphes centralisés via ZIcon (story 2.7).
// URLs reprises de l'existant.
const socials = [
  { icon: "github", url: "https://github.com/zohac", label: "GitHub" },
  { icon: "x", url: "https://twitter.com/fenrir0680", label: "Twitter" },
  { icon: "linkedin", url: "https://www.linkedin.com/in/simonjouan/", label: "LinkedIn" },
];
</script>

<style lang="scss" scoped>
.hexrow {
  display: flex;
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
