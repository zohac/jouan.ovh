<template>
  <MainComponent>
    <ul>
      <ContentList path="/blog">

        <template #default="{ list }">
          <li v-for="article in list" :key="article._path">
            <NuxtLink :to="article._path">
              <img v-if="article.image" :src="article.image.src" :alt="article.image.alt">
              <h2>{{ article.title }}</h2>
              <p>{{ article.description }}</p>
            </NuxtLink>
          </li>
        </template>

        <template #not-found>
          <ZCardComponent :class="'container-w50'">
            <ZCardHeader :img="img" />
            <ZCardBody>
              <template #title>
                <h1>Oups, il n'y a pas encore d'articles sur mon blog pour le moment.</h1>
              </template>

              <template #body>
                <p>
                  Mais ne vous inquiétez pas, je travaille actuellement sur de nouveaux contenus passionnants pour
                  partager mes connaissances en développement web et mobile. Restez connecté(e) et n'hésitez pas à
                  revenir bientôt pour découvrir mes prochaines publications.
                </p>
              </template>
            </ZCardBody>
          </ZCardComponent>
        </template>

      </ContentList>
    </ul>
  </MainComponent>
</template>

<script lang="ts">
import ZCardBody from "~/components/card/ZCardBody.vue";
import ZCardComponent from "~/components/card/ZCardComponent.vue";
import ZCardHeader, { ImageInterface } from "~/components/card/ZCardHeader.vue";
import { getRandomUrl } from "~/utils/functions";

const IMG_BLOG_URLS = [
  '/images/00010-1600x896.png',
  '/images/00011-1600x896.png',
  '/images/00012-1600x896.png',
  '/images/00013-1600x896.png',
  '/images/00014-1600x896.png',
  '/images/00015-1600x896.png',
  '/images/00016-1600x896.png',
  '/images/00017-1600x896.png',
];

export default {
  name: "Blog",
  components: { ZCardComponent, ZCardBody, ZCardHeader },

  setup() {
    const img = reactive({
      src: getRandomUrl(IMG_BLOG_URLS),
      attr: {
        loading: 'eager',
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

  main {
    padding: 1rem;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;

    li {
      background: white;
      width: 50vw;
      padding: 1rem;
      margin-bottom: 1rem;

      border-radius: 4px;
      overflow: hidden;
    }
  }

  .container-w50 {
    width: 100vw;

    @media (min-width: function.breakpoint("sm")) {
      max-width: 90vw;
    }

    @media (min-width: function.breakpoint("md")) {
      max-width: 80vw;
    }

    @media (min-width: function.breakpoint("lg")) {
      max-width: 70vw;
    }

    @media (min-width: function.breakpoint("xl")) {
      max-width: 60vw;
    }

    @media (min-width: function.breakpoint("xxl")) {
      max-width: 50vw;
    }
  }

</style>