<template>
  <MainComponent class="page-stub">
    <h1>Contact</h1>
    <p>Le formulaire de contact arrive bientôt. En attendant, écrivez-moi directement&nbsp;:</p>
    <ZButton as="a" href="mailto:simon@jouan.ovh" variant="primary">
      <template #icon><ZIcon name="mail" /></template>
      simon@jouan.ovh
    </ZButton>
  </MainComponent>
</template>

<script setup lang="ts">
// Stub minimal : la page Contact riche (formulaire) est livrée par l'Epic 7.
// Présent ici pour que la nav (story 2.8) et le prerender ne cassent pas.
useHead({ title: "Contact — jouan.ovh" });
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
