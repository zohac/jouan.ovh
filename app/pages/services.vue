<template>
  <MainComponent class="page-stub">
    <h1>Services</h1>
    <p>Cette page arrive bientôt. En attendant, parlons de votre projet.</p>
    <ZButton :as="NuxtLink" to="/contact" variant="primary">Démarrer un projet</ZButton>
  </MainComponent>
</template>

<script setup lang="ts">
// Stub minimal : la page Services riche est livrée par l'Epic 4.
// Présent ici pour que la nav (story 2.8) et le prerender ne cassent pas.
import { NuxtLink } from "#components";

useHead({ title: "Services — jouan.ovh" });
</script>

<style lang="scss" scoped>
.page-stub {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-items: flex-start;
  padding: var(--space-12) var(--space-6);
  color: var(--text-body);

  h1 {
    color: var(--text-strong);
  }
}
</style>
