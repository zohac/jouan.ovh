<template>
  <footer>
    <div class="animation-wrapper">
      <div class="animate-slide"></div>
    </div>

    <div class="copyright">
      Made with <span class="text-color-red-light">&#9829;</span> and <a href="https://nuxtjs.org/fr">Nuxtjs</a>. Copyright &copy; {{ currentDate }} Simon JOUAN
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterComponent",

  data() {
    return {
      currentDate: new Date().getFullYear(),
    }
  }
}

</script>

<style lang="scss" scoped>
  footer {
    -webkit-animation: 4s linear 0s 1 fadeIn;
    animation: 4s linear 0s 1 fadeIn;
    width: 100%;

    text-align: center;
    height: auto;

    color: var(--color-text-light);
    background-color: var(--color-aubergine-dark);

    .animation-wrapper {
      -webkit-animation: 2s linear 0s 1 width-100;
      animation: 2s linear 0s 1 width-100;

      width: 100%;
      position: relative;
      -ms-scroll-chaining: none;
      overscroll-behavior: none;
      opacity: 0;
      height: 1px;
      align-self: flex-start;

      background-color: var(--color-aubergine-light);

      .animate-slide {
        -webkit-animation: 2s linear 0s 1 slide;
        animation: 2s linear 0s 1 slide;
        width: 0.25rem;
        box-shadow: 0 0 10px 3px var(--color-light);
        left: 0;
        position: absolute;
        opacity: 0;
        height: 1px;
        border-radius: 9999px;

        background-color: var(--color-light);
      }
    }

    .copyright {
      flex-grow: 2;

      margin: 1.25rem;

      .text-color-red-light {
        color: var(--color-red-light);
      }

      a {
        color: var(--color-text-light);
      }
    }
  }
</style>
