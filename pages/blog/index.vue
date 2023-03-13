<template>
  <main>
    <ul>
      <ContentList v-slot="{ list }" path="/blog">
        <li v-for="article in list" :key="article._path">
          <NuxtLink :to="article._path">
            <img v-if="article.image" :src="article.image.src" :alt="article.image.alt">
            <h2>{{ article.title }}</h2>
            <p>{{ article.description }}</p>
          </NuxtLink>
        </li>
      </ContentList>
    </ul>
  </main>
</template>

<script>
export default {
  name: "Blog"
};
</script>

<style lang="scss" scoped>
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
</style>