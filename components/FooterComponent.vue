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
  @use "assets/scss/abstract/color" as _color;
  @use "assets/scss/abstract/variables" as _variables;

  footer {
    --footer-height: #{_variables.$footer-height};

    // color system
    // =============================================================================
    --footer-color-background: #{_color.$aubergine-dark};
    //--footer-color-background-hover: #{_color.$dark-background-hover};
    //--footer-color-border: ;
    //--footer-color-border-hover: ;
    --footer-color-text: #{_color.$dark-text};
    //--footer-color-text-hover: var(--color-dark-text-hover);
    //--footer-color-text-active: ;
    //--footer-color-shapes: var(--footer-color-border-hover);
    //--footer-color-shapes-hover: var(--color-text);
    //--footer-color-shapes-active: var(--color-text-hover);
    --footer-color-red-light: #{_color.$red-light};
    
    -webkit-animation: 4s linear 0s 1 fadeIn;
    animation: 4s linear 0s 1 fadeIn;
    height: var(--footer-height);
    width: 100%;
    max-width: 100vw;
    text-align: center;
    color: var(--footer-color-text);
    background-color: var(--footer-color-background);

    .copyright {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;

      .text-color-red-light {
        color: var(--footer-color-red-light);
        margin-left: 0.125rem;
        margin-right: 0.125rem;
      }

      a {
        color: var(--footer-color-text);
        margin-left: 0.125rem;
      }
    }
  }
</style>
