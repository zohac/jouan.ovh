<template>
  <footer>
    <SocialLinkListComponent />
  </footer>
</template>

<script>
import SocialLinkListComponent from "../social/social-link-list-component.vue";

export default {
  name: "ZCardFooter",
  components: { SocialLinkListComponent }
};
</script>

<style lang="scss" scoped>
  footer {
    grid-area: footer;
    padding: var(--article-space-inset);
    height: auto;

    max-width: calc(100vw - 2 * var(--main-space-inset));
  }
</style>