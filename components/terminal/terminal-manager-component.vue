<template>
  <div>
    <terminal-component
      v-for="terminal in terminals"
      :id="terminal.id"
      :key="terminal.id"
    ></terminal-component>
  </div>
</template>

<script setup>

</script>

<style scoped>

</style>