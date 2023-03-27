<template>
  <div class="init" role="img" title="">
    <HeaderComponent />

    <slot />

    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import FooterComponent from "../components/FooterComponent.vue";
import HeaderComponent from "../components/HeaderComponent.vue";</script>

<style lang="scss" scoped>
  @use "assets/scss/abstract/color" as _color;
  @use "assets/scss/abstract/variables" as _variables;

  .init {
    --init-color-red: #{_color.$red};
    --init-color-aubergine-dark: #{_color.$aubergine-dark};
    --init-color-orange: #{_color.$orange};

    --header-height: #{_variables.$header-height};
    --footer-height: #{_variables.$footer-height};

    background-image:
      linear-gradient(127deg, var(--init-color-aubergine-dark), transparent),
      linear-gradient(217deg, var(--init-color-orange), transparent),
      linear-gradient(0deg, var(--init-color-red), transparent);
    margin: 0;
    min-height: 100vh;
    height: auto;
    overflow: auto;
    width: 100%;
    max-width: 100vw;

    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: var(--header-height) 1fr var(--footer-height);
    gap: 0 0;
    grid-template-areas:
          "."
          "."
          ".";
  }
</style>
