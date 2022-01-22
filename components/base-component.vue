<template>
  <div class="init">
    <main-component />

    <footer-component />
  </div>
</template>

<script>
export default {
  name: "base-component"
}
</script>

<style scoped>
  .init {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 100vw;
    height: auto;
    min-height: 100vh;
    overflow: hidden;
    margin: 0;

    font-size: 1rem;

    --gradient-to-color: #E95420;
    --gradient-from-color: #772953;
    --gradient-color-stops: var(--gradient-from-color), var(--gradient-to-color, rgba(119, 41, 83, 0));

    background-image: linear-gradient(to right, var(--gradient-color-stops));
  }
</style>
