<template>
  <main-component>
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
          <z-card-component :class="'container-w50'">
            <z-card-header :img="getImg" />
            <z-card-body>
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
            </z-card-body>
          </z-card-component>
        </template>

      </ContentList>
    </ul>
  </main-component>
</template>

<script lang="ts">
import ZCardBody from "../../components/card/z-card-body.vue";
import ZCardHeader, { ImageInterface } from "../../components/card/z-card-header.vue";
import MainComponent from "../../components/main-component.vue";
import ZCardComponent from "../../components/z-card-component.vue";

export default {
  name: "Blog",
  components: { ZCardBody, ZCardHeader, ZCardComponent, MainComponent },

  computed: {
    getImg(): ImageInterface {
      return {
        src: '/images/00010-1600x896.png',
        attr: {
          loading: 'eager',
          decoding: 'async',
        }
      }
    },
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