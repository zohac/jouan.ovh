<template>
  <section class="content">
    <slot name="title" />
    <slot name="body" />
  </section>
</template>

<script>
export default {
  name: "ZCardBody",
};

</script>

<style lang="scss" scoped>
  section {
    grid-area: section;
    padding: var(--article-space-inset);

    display: flex;
    flex-direction: column;
    justify-content: center;

    text-align: center;

    max-width: calc(100vw - 2 * var(--main-space-inset));

    h1 {
      color: var(--article-color-text-hover);
    }

    h2 {
      color: var(--article-color-text);
    }

    &.content {
      animation: fadeIn 1000ms ease-out forwards;
    }
  }
</style>