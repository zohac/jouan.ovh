<template>
  <section class="hero-banner">
    <WindowWrapperComponent
      background-color="hsla(0, 0%, 100%, 1)"
      text-color="hsla(0, 0%, 32%, 1)"
      height="auto"
      width="600px"
    >
      <h1 class="fs-5x wwc-space-inline">Simon JOUAN</h1>
      <p class="fs-2x wwc-space-inline wwc-space-stack">
        Développeur Web FullStack & Testeur/QA
      </p>
      <NuxtLink
        to="/about"
        class="btn btn-large no-typewriting wwc-space-inline wwc-space-stack"
        >En savoir plus</NuxtLink
      >
    </WindowWrapperComponent>

    <WindowWrapperComponent
      height="auto"
      width="512px"
      overflow="hidden"
      background-color="hsla(0, 0%, 100%, 1)"
      class="img"
    >
      <nuxt-picture
        src="/images/undraw_programming_re_kg9v.svg"
        :img-attrs="getAttr"
        class="no-typewriting rotateY-180"
      />
    </WindowWrapperComponent>
  </section>
</template>

<script lang="ts" setup>
import WindowWrapperComponent from "~/components/WindowWrapperComponent.vue";

defineComponent({
  name: "Home",
});

const getAttr = {
  alt: "Portrait de Simon JOUAN",
  title: "Portrait de Simon JOUAN",
  loading: "eager",
  height: 512,
  width: 512,
  decoding: "edger",
};
</script>

<style lang="scss" scoped>
@use "assets/scss/abstract/variables" as _variables;
@use "assets/scss/abstract/space" as _space;
@use "assets/scss/abstract/function" as _function;
@use "assets/scss/components/button";

.home-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-banner {
  --main-space-inset: #{_space.$space-inset-16x};

  padding: var(--main-space-inset);
  height: 100%;
  width: 100%;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0 0;
  grid-template-areas:
    "img"
    ".";

  align-items: center;
  justify-items: center;

  @media (min-width: _function.breakpoint("lg")) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    gap: 0 0;
    grid-template-areas: ". img";

    height: calc(
      100vh - #{_variables.$header-height} - #{_variables.$footer-height}
    );
  }

  .img {
    grid-area: img;
  }
}

.wwc-space-inline {
  margin: 0 #{_space.$space-inset-16x};
}

.wwc-space-stack {
  margin-bottom: #{_space.$space-inset-16x};
}

.fs-5x {
  $-font-size: _variables.$font-size-5x-large;

  font-size: #{$-font-size};
  font-weight: #{_variables.$font-weight-bold};
  line-height: #{_function.line-height($-font-size)};
}

.fs-2x {
  $-font-size: _variables.$font-size-2x-large;

  font-size: #{$-font-size};
  font-weight: #{_variables.$font-weight-regular};
  line-height: #{_function.line-height($-font-size)};
}

picture {
  height: 512px;
  width: 512px;
  overflow: hidden;
  border-radius: 24px;
}

.rotateY-180 {
  img {
    transform: rotateY(180deg);
  }
}
</style>
