<template>
  <footer>
    <div class="animation-wrapper">
      <div class="animate-slide"></div>
    </div>

    <div>
      Made with <span class="text-orange-ubuntu-100">&#9829;</span> and <a href="https://nuxtjs.org/fr">Nuxtjs</a>. Copyright &copy; {{ currentDate }} Simon JOUAN
    </div>
  </footer>
</template>

<script>
export default {
  name: "footer-component",

  data() {
    return {
      currentDate: new Date().getFullYear()
    }
  }
}

</script>

<style scoped>
  footer {
    -webkit-animation: 4s linear 0s 1 fadeIn;
    animation: 4s linear 0s 1 fadeIn;
    width: 100%;
    --text-opacity: 1;
    color: #EEEDEB;
    color: rgba(238, 237, 235, var(--text-opacity));
    text-align: center;
    padding: 1.25rem;
    height: auto;
    --bg-opacity: 1;
    background-color: #2C001E;
    background-color: rgba(44, 0, 30, var(--bg-opacity));
  }
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
    --bg-opacity: 1;
    background-color: #957F8E;
    background-color: rgba(149, 127, 142, var(--bg-opacity));
  }
  .animate-slide {
    -webkit-animation: 2s linear 0s 1 slide;
    animation: 2s linear 0s 1 slide;
    width: 0.25rem;
    box-shadow: 0 0 10px 3px rgba(255,255,255,1);
    left: 0;
    position: absolute;
    opacity: 0;
    height: 1px;
    border-radius: 9999px;
    --bg-opacity: 1;
    background-color: #6B4C61;
    background-color: rgba(107, 76, 97, var(--bg-opacity));
  }

  .text-orange-ubuntu-100 {
    --text-opacity: 1;
    color: #E95420;
    color: rgba(233, 84, 32, var(--text-opacity));
  }
</style>
