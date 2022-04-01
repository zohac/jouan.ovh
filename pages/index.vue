<template>

  <div class="init" role="img" title="">
    <header-component />

    <main-component />

    <footer-component />
  </div>

</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'IndexPage'
})
</script>


<style lang="scss" scoped>
  .init {
    align-items: center;
    background-image:
      linear-gradient(127deg, var(--color-aubergine-dark), transparent),
      linear-gradient(217deg, var(--color-orange), transparent),
      linear-gradient(0deg, var(--color-red), transparent);
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    justify-content: center;
    margin: 0;
    min-height: 100vh;
    overflow: auto;
    width: 100vw;
  }
</style>
