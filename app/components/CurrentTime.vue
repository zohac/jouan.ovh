<template>
  <time class="current-time" :datetime="currentTimeIso" aria-label="Heure locale de Valognes">
    <span class="current-time__hours">{{ hours }}</span>
    <span class="current-time__colon" :class="{ 'current-time__colon--hidden': !isColonVisible }" aria-hidden="true"
      >:</span
    >
    <span class="current-time__minutes">{{ minutes }}</span>
  </time>
</template>

<script lang="ts" setup>
import type { Ref } from "vue";
import { onMounted, onUnmounted, ref } from "vue";

defineComponent({
  name: "CurrentTime",
});

const hours = ref("--");
const minutes = ref("--");
const currentTimeIso = ref("");
const isColonVisible = ref(true);

function updateTime() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Paris",
  }).formatToParts(now);

  const hourPart = parts.find((p) => p.type === "hour")?.value ?? "";
  const minutePart = parts.find((p) => p.type === "minute")?.value ?? "";

  hours.value = hourPart.padStart(2, "0");
  minutes.value = minutePart.padStart(2, "0");
  currentTimeIso.value = now.toISOString();

  // Un clignotement exact par seconde (alternance à chaque seconde système)
  isColonVisible.value = now.getSeconds() % 2 === 0;
}

const interval: Ref<ReturnType<typeof setInterval> | null> = ref(null);

onMounted(() => {
  updateTime();
  interval.value = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (interval.value !== null) {
    clearInterval(interval.value);
  }
});
</script>

<style scoped lang="scss">
/* stylelint-disable selector-class-pattern -- convention BEM */
.current-time {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-variant-numeric: tabular-nums;
  letter-spacing: var(--ls-wide);
  color: var(--text-muted);
}

.current-time__colon {
  display: inline-block;
  margin: 0 1px;
  transition: opacity 0.1s linear;

  &--hidden {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .current-time__colon,
  .current-time__colon--hidden {
    opacity: 1;
    transition: none;
  }
}
</style>
