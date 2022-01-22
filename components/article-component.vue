<template>
  <article>

    <div class="flex-grow-2">
      <h1 class="text-2xl font-bold">Simon JOUAN</h1>
      <h2 class="text-grey-warm-100">Développeur Web FullStack</h2>
    </div>

    <div class="social">
      <a href="#">github</a>
      <a href="#">twitter</a>
      <a href="#">linkedin</a>
    </div>

  </article>
</template>

<script>
export default {
  name: "article-component"
}
</script>

<style scoped>
  article {
    display: flex;
    flex-direction: row;

    overflow: hidden;

    border-radius: 0.25rem;

    --bg-opacity: 1;
    background-color: #EEEDEB;
    background-color: rgba(238, 237, 235, var(--bg-opacity));

    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  article > div {
    display: flex;
    justify-content: center;
    flex-direction: column;

    padding: 1.25rem;

    text-align: left;
  }

  .social {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    justify-content: space-between;
    align-items: center;
  }

  .flex-grow-2 {
    flex-grow: 2;
  }
</style>
