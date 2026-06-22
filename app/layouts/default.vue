<template>
  <div class="init">
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
.init {
  // Fond de page dark-first (token). Remplace l'ancien dégradé legacy
  // orange/aubergine (anciens tokens SCSS `_color.$`) qui débordait derrière
  // les sections transparentes (révélé par la story 3.2). Le hero porte son
  // propre `hero__grad`, le footer son `--bg-sunken` — inchangés.
  background: var(--bg-page);

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
