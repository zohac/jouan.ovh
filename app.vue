<template>
  <div class="init" role="img" title="">
    <header-component />

    <main-component />

    <footer-component />
  </div>
</template>

<style lang="scss" scoped>
.init {
  --init-color-red: var(--color-red);                         /*without text*/
  --init-color-aubergine-dark: var(--color-aubergine-dark);   /*with light text*/
  --init-color-orange: var(--color-orange);                   /*without text*/

  background-image:
    linear-gradient(127deg, var(--init-color-aubergine-dark), transparent),
    linear-gradient(217deg, var(--init-color-orange), transparent),
    linear-gradient(0deg, var(--init-color-red), transparent);
  margin: 0;
  min-height: 100vh;
  overflow: auto;
  width: 100vw;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: var(--header-height) 1fr var(--footer-height);
  gap: 0 0;
  grid-template-areas:
      "."
      "."
      ".";
  justify-content: center;
}
</style>
