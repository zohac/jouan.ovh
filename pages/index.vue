<template>

  <div class="init" role="img" title="">
    <header-component />

    <main-component />

    <footer-component />
  </div>

</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IndexPage'
})
</script>


<style lang="scss" scoped>
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

    background-image:
      linear-gradient(127deg, var(--color-aubergine-dark), transparent),
      linear-gradient(217deg, var(--color-orange), transparent),
      linear-gradient(0deg, var(--color-red), transparent);
  }
</style>
