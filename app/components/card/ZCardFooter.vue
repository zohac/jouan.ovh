<template>
  <footer>
    <LinkListComponent />
  </footer>
</template>

<script>
import LinkListComponent from "~/components/LinkListComponent.vue";

export default {
  name: "ZCardFooter",
  components: { LinkListComponent },
};
</script>

<style lang="scss" scoped>
footer {
  // Padding aligné sur le token DS (--space-4 = 16px, parité avec le legacy).
  padding: var(--space-4);
  height: auto;
}
</style>
