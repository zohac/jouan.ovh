<template>
  <main-component class="home-center">
    <z-card-component class="home-card-w">
      <z-card-header :img="portraitImg" />

      <z-card-body>
        <template #title>
          <h1>Simon Jouan</h1>
        </template>

        <template #body>
          <p>Développeur Web FullStack & Testeur/QA</p>
          <p>Freelance</p>
        </template>
      </z-card-body>

      <z-card-footer />
    </z-card-component>
  </main-component>
</template>

<script lang="ts">
import { getRandomUrl } from "~/utils/functions";
import ZCardBody from "../components/card/z-card-body.vue";
import ZCardFooter from "../components/card/z-card-footer.vue";
import ZCardHeader, { ImageInterface } from "../components/card/z-card-header.vue";
import MainComponent from "../components/main-component.vue";
import ZCardComponent from "../components/z-card-component.vue";

const PORTRAIT_URLS = [
  '/images/portrait_512x512_drip_art_1.webp',
  '/images/portrait_512x512_drip_art_2.webp',
  // '/images/portrait_512x512_drip_art_3.webp',
  '/images/portrait_512x512_drip_art_4.webp',
  // '/images/portrait_512x512_drip_art_5.webp',
  // '/images/portrait_512x512_drip_art_6.webp',
  '/images/portrait_512x512_drip_art_7.webp',
  '/images/portrait_512x512_drip_art_8.webp',
  '/images/portrait_512x512_drip_art_9.webp',
];

export default {
  components: { ZCardComponent, ZCardHeader, ZCardBody, ZCardFooter, MainComponent },

  computed: {
    portraitImg(): ImageInterface {
      return {
        src: getRandomUrl(PORTRAIT_URLS),
        attr: {
          alt: 'Portrait de Simon JOUAN',
          title: 'Portrait de Simon JOUAN',
          loading: 'eager',
          height: 512,
          width: 512,
          decoding: 'async',
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@use "assets/scss/abstract/function";

  .home-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .home-card-w {
    --home-card-width: 100%;

    width: var(--home-card-width);

    @media (min-width: function.breakpoint("xs")) {
      --home-card-width: 475px;
    }
  }
</style>

