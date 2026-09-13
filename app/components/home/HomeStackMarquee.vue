<template>
  <div v-if="skillsList.length" class="marquee" aria-hidden="true">
    <div class="marquee__track">
      <!-- Première passe -->
      <span v-for="(skill, index) in skillsList" :key="`skill-a-${index}`" class="marquee__item">
        <b class="marquee__label">{{ skill }}</b>
        <span class="marquee__star" aria-hidden="true">✦</span>
      </span>
      <!-- Deuxième passe pour la boucle infinie CSS sans coupure -->
      <span
        v-for="(skill, index) in skillsList"
        :key="`skill-b-${index}`"
        class="marquee__item marquee__item--duplicate"
      >
        <b class="marquee__label">{{ skill }}</b>
        <span class="marquee__star" aria-hidden="true">✦</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
// Ruban défilant continu de la stack moderne prioritaire (Story 11.3 / AC-1 / CAP-4).
// Alimenté par SITE.skills (app/data/site.ts) avec mapping soigné des libellés.
// Défilement continu pur CSS masqué aux lecteurs d'écran (aria-hidden="true").
// Pause automatique au :hover et arrêt complet sous prefers-reduced-motion.
import { computed } from "vue";
import { SITE } from "~/data/site";

const SKILL_LABEL_MAP: Record<string, string> = {
  typescript: "TypeScript",
  nuxt: "Nuxt 4",
  vue: "Vue.js",
  "nest.js": "NestJS",
  "node.js": "Node.js",
  postgresql: "PostgreSQL",
  typeorm: "TypeORM",
  stripe: "Stripe Connect",
  cypress: "Cypress",
  docker: "Docker",
  "rest-api": "REST API",
  vitest: "Vitest",
};

const skillsList = computed(() => {
  return SITE.skills.map((skillKey) => SKILL_LABEL_MAP[skillKey] ?? skillKey);
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern */
.marquee {
  display: block;
  width: 100%;
  padding-block: var(--space-5);
  overflow: hidden;
  border-block: 1px solid var(--border-subtle);
  mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);

  &:hover .marquee__track {
    animation-play-state: paused;
  }
}

.marquee__track {
  display: flex;
  gap: var(--space-8);
  width: max-content;
  will-change: transform;
  animation: scroll-x 32s linear infinite;
}

.marquee__item {
  display: inline-flex;
  gap: var(--space-8);
  align-items: center;
  font-family: var(--font-mono);
  font-size: var(--fs-xl);
  letter-spacing: var(--ls-wide);
  color: var(--text-faint);
  white-space: nowrap;
}

.marquee__label {
  font-weight: var(--fw-regular);
  color: var(--text-body);
}

.marquee__star {
  color: var(--accent);
}

@keyframes scroll-x {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(calc(-50% - var(--space-8) / 2));
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee {
    mask-image: none;
  }

  .marquee__track {
    animation: none;
  }

  .marquee__item--duplicate {
    display: none;
  }
}
</style>
