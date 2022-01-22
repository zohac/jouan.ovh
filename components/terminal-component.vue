<template>
  <div ref="terminal">
    Ouvrez le comme si vous étiez sous <div class="tooltip">linux
      <div class="tooltiptext">ctrl + alt + t</div>
    </div>
  </div>
</template>

<script lang="ts">
import terminal from '../utils/terminal/src/main';

export default {
  name: "terminal-component",

  mounted() {
    this.$refs.terminal.append(terminal.render());
  },
}

</script>

<style>
  @import '../utils/terminal/src/asset/css/ubuntu_theme.css';
</style>
