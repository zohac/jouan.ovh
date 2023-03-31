<template>
  <MainComponent class="home-center">
    <ZCardComponent class="home-card-w">
      <ZCardHeader :img="img" />

      <ZCardBody>
        <template #title>
          <h1>Simon Jouan</h1>
        </template>

        <template #body>
          <p>Développeur Web FullStack & Testeur/QA</p>
          <p>Freelance</p>
        </template>
      </ZCardBody>

      <ZCardFooter />
    </ZCardComponent>
  </MainComponent>
</template>

<script lang="ts">
import ZCardBody from "~/components/card/ZCardBody.vue";
import ZCardComponent from "~/components/card/ZCardComponent.vue";
import ZCardFooter from "~/components/card/ZCardFooter.vue";
import ZCardHeader, { ImageInterface } from "~/components/card/ZCardHeader.vue";

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
  name: "Home",
  components: { ZCardComponent, ZCardFooter, ZCardBody, ZCardHeader },

  setup() {
    const img = reactive({
      // src: getRandomUrl(PORTRAIT_URLS),
      src: '/images/portrait_512x512_drip_art_8.webp',
      attr: {
        alt: 'Portrait de Simon JOUAN',
        title: 'Portrait de Simon JOUAN',
        loading: 'eager',
        height: 512,
        width: 512,
        decoding: 'async',
      }
    }) as ImageInterface;

    return {
      img,
    }
  },
};
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
