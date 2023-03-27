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
  @use "assets/scss/abstract/color" as _color;
  @use "assets/scss/abstract/animations";

  section {
    --zcb-color-text: #{_color.$gray-5};

    grid-area: section;
    padding: var(--article-space-inset);
    max-width: calc(100vw - 2 * var(--main-space-inset));

    h1 {
      color: var(--zcb-color-text);
      margin: 0;
    }

    &.content {
      animation: fadeIn 2000ms ease-out forwards;
    }
  }
</style>