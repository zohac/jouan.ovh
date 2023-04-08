<template>
  <div class="current-time">
    {{ currentTime }}
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, Ref } from "vue";

defineComponent({
  name: "CurrentTime",
});

const currentTime = ref("");

function updateTime() {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const interval: Ref<ReturnType<typeof setInterval> | null> = ref(null);

onMounted(() => {
  updateTime();
  interval.value = setInterval(updateTime, 15000);
});

onUnmounted(() => {
  if (interval.value !== null) {
    clearInterval(interval.value);
  }
});
</script>

<style scoped lang="scss">
.current-time {
  /* Ajoutez ici les styles pour personnaliser l'apparence de l'heure */
}
</style>
