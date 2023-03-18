<template>
  <button @click="$emit('open-terminal')">Terminal</button>
</template>

<script lang="ts">

export default defineComponent({
  name: 'TerminalButton',
  emits: ['open-terminal'],
});
</script>

<style lang="scss" scoped>
  @use "assets/scss/abstract/space";
  @use "assets/scss/abstract/radius";
  @use "assets/scss/abstract/function";
  @use "assets/scss/abstract/variables";
  @use "assets/scss/components/list";

  button {
    --button-inset-x: #{list.$list-space-inset-8x-x};
    --button-inset-y: #{list.$list-space-inset-8x-y};
    --button-font-size: #{variables.$font-size-base};
    --button-font-weight: #{variables.$font-weight-regular};
    --button-line-height: #{function.line-height(var(--button-font-size))};

    // color system
    // =============================================================================
    --button-color-background: var(--color-dark-background);
    --button-color-background-hover: var(--color-dark-background-hover);
    //--button-color-border: ;
    //--button-color-border-hover: ;
    // Shapes : icons/elements
    //--button-color-shapes: var(--button-color-border-hover);
    //--button-color-shapes-hover: var(--color-text);
    //--button-color-shapes-active: var(--color-text-hover);
    --button-color-text: var(--color-dark-text);
    --button-color-text-hover: var(--color-dark-text-hover);
    //--button-color-text-active: ;
    
    font-size: var(--button-font-size);
    font-weight: var(--button-font-weight);
    line-height: var(--button-line-height);
    
    color: var(--button-color-text);
    background-color: var(--button-color-background);
    border: none;
    text-decoration: none;
    padding: var(--button-inset-x) var(--button-inset-y);
    display: inline-block;
    
    &:hover {
      background-color: var(--button-color-background-hover);
      color: var(--button-color-text-hover);
    }
  }
  
</style>