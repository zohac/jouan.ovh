<template>
  <footer>
    <LinkListComponent />
  </footer>
</template>

<script>
import LinkListComponent from "~/components/LinkListComponent.vue";

export default {
  name: "ZCardFooter",
  components: { LinkListComponent }
};
</script>

<style lang="scss" scoped>
  @use "assets/scss/abstract/space" as _space;

  footer {
    --zcf-space-inset: #{_space.$space-inset-16x};

    grid-area: footer;
    padding: var(--zcf-space-inset);
    height: auto;

    max-width: calc(100vw - 2 * var(--zcf-space-inset));
  }
</style>