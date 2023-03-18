<template>
  <footer>
    <div class="copyright">
      Made with <span class="text-color-red-light">&#9829;</span>
      and <a href="https://nuxtjs.org/fr">Nuxtjs</a>.
      Copyright &copy; {{ currentDate }} Simon JOUAN
    </div>
  </footer>
</template>

<script setup>

defineComponent({
name: 'FooterComponent',
});

const currentDate = ref(new Date().getFullYear());

</script>

<style lang="scss" scoped>
  footer {
    -webkit-animation: 4s linear 0s 1 fadeIn;
    animation: 4s linear 0s 1 fadeIn;
    width: 100%;
    max-width: 100vw;

    text-align: center;
    height: auto;

    color: var(--color-dark-text);
    background-color: var(--color-aubergine-dark);

    .copyright {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;

      .text-color-red-light {
        color: var(--color-red-light);
        margin-left: 0.125rem;
        margin-right: 0.125rem;
      }

      a {
        color: var(--color-text-light);
        margin-left: 0.125rem;
      }
    }
  }
</style>
