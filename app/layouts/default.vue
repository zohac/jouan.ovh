<template>
  <div class="init" role="img" title="">
    <HeaderComponent />

    <slot />

    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import FooterComponent from "../components/FooterComponent.vue";
import HeaderComponent from "../components/HeaderComponent.vue";
</script>

<style lang="scss" scoped>
@use "assets/scss/abstract/color" as _color;

.init {
  --init-color-red: #{_color.$red};
  --init-color-aubergine-dark: #{_color.$aubergine-dark};
  --init-color-orange: #{_color.$orange};

  background-image:
    linear-gradient(127deg, var(--init-color-aubergine-dark), transparent),
    linear-gradient(217deg, var(--init-color-orange), transparent),
    linear-gradient(0deg, var(--init-color-red), transparent);

  // Flex column : header sticky en haut, footer riche poussé en bas via
  // `margin-top: auto` (le footer dépasse 56px — l'ancienne grille à hauteur
  // fixe le tronquait). --header-height/--footer-height viennent des tokens (2.1).
  display: flex;
  flex-direction: column;
  margin: 0;
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
}
</style>
