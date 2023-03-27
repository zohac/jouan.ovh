<template>
  <article>
    <slot />
  </article>
</template>

<script lang="ts">
export default {
  name: "ZCardComponent",
};
</script>

<style lang="scss" scoped>
  @use "assets/scss/abstract/space";
  @use "assets/scss/abstract/radius";
  @use "assets/scss/abstract/variables";
  @use "assets/scss/abstract/function";
  @use "assets/scss/abstract/color" as _color;
  @use "assets/scss/abstract/box_shadow" as _boxShadow;

  article {
    --main-space-inset: #{space.$space-inset-16x};
    --article-space-inset: #{space.$space-inset-16x};
    --article-radius: #{radius.$radius-rounded-4px};
    --article-footer-button-height: 32px;
    --article-footer-height:
      calc(var(--article-footer-button-height) * 3 + #{space.$space-stack-8x} * 2 + var(--article-space-inset) * 2);

    // color system
    // =============================================================================
    --article-color-background: #{_color.$background};
    //--article-color-background-hover: ;
    //--article-color-border: ;
    //--article-color-border-hover: ;
    --article-color-text: #{_color.$text};
    --article-color-text-hover: #{_color.$text-hover};
    //--article-color-text-active: ;
    //--article-color-shapes: var(--article-color-border-hover);
    //--article-color-shapes-hover: var(--color-text);
    //--article-color-shapes-active: var(--color-text-hover);

    -webkit-animation: bounce-in-fwd 1.1s both;
    animation: bounce-in-fwd 1.1s both;
    background-color: var(--article-color-background);
    border-radius: var(--article-radius);
    box-shadow: #{_boxShadow.$box-shadow-2}, #{_boxShadow.$box-shadow-1};
    color: var(--article-color-text);
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    gap: 0 0;
    grid-auto-flow: row;
    grid-template-areas:
        "header"
        "section"
        "footer";

    min-width: calc(2 * var(--main-space-inset));
    max-width: calc(100vw - (2 * var(--main-space-inset)));
  }
</style>