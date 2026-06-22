<template>
  <MainComponent>
    <ul v-if="articles && articles.length">
      <li v-for="article in articles" :key="article.path">
        <NuxtLink :to="article.path">
          <NuxtImg v-if="article.image" :src="article.image.src" :alt="article.image.alt" />
          <h2>{{ article.title }}</h2>
          <p>{{ article.description }}</p>
        </NuxtLink>
      </li>
    </ul>

    <ZCard v-else-if="error" class="container-w50" :padded="false">
      <ZCardHeader :img="img" />
      <ZCardBody>
        <template #title>
          <h1>Oups, le chargement des articles a échoué.</h1>
        </template>

        <template #body>
          <p>
            Une erreur est survenue lors de la récupération des articles du blog. Ce n'est pas vous, c'est moi : merci
            de réessayer dans quelques instants.
          </p>
        </template>
      </ZCardBody>
    </ZCard>

    <ZCard v-else class="container-w50" :padded="false">
      <ZCardHeader :img="img" />
      <ZCardBody>
        <template #title>
          <h1>Oups, il n'y a pas encore d'articles sur mon blog pour le moment.</h1>
        </template>

        <template #body>
          <p>
            Mais ne vous inquiétez pas, je travaille actuellement sur de nouveaux contenus passionnants pour partager
            mes connaissances en développement web et mobile. Restez connecté(e) et n'hésitez pas à revenir bientôt pour
            découvrir mes prochaines publications.
          </p>
        </template>
      </ZCardBody>
    </ZCard>
  </MainComponent>
</template>

<script lang="ts">
import ZCardBody from "~/components/card/ZCardBody.vue";
import type { ImageInterface } from "~/components/card/ZCardHeader.vue";
import ZCardHeader from "~/components/card/ZCardHeader.vue";

export default {
  name: "Blog",
  components: { ZCardBody, ZCardHeader },

  async setup() {
    const img = reactive({
      src: "/images/undraw_code_thinking_re_gka2.svg",
      attr: {
        loading: "eager",
        decoding: "async",
        height: 256,
        class: "fixed-height img-center",
      },
    }) as ImageInterface;

    // @nuxt/content v3 : queryCollection remplace <ContentList path="/blog">.
    // On expose `error` pour distinguer un échec de chargement d'un véritable empty-state.
    const { data: articles, error } = await useAsyncData("blog-list", () => queryCollection("blog").all());

    return {
      img,
      articles,
      error,
    };
  },
};
</script>

<style lang="scss" scoped>
@use "assets/scss/abstract/function";
@use "assets/scss/abstract/color/gray" as _gray;

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
