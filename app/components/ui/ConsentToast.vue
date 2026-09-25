<template>
  <div
    v-if="visible"
    ref="toastEl"
    class="consent"
    role="region"
    aria-label="Préférences de télémétrie"
    aria-live="polite"
    tabindex="-1"
    @keydown.escape="dismissConsentModal"
  >
    <div class="consent__box">
      <p class="consent__prompt"><span aria-hidden="true">// </span>telemetry:</p>
      <p class="consent__text">
        PostHog (hébergement européen) peut mesurer l'audience pour améliorer l'ergonomie. Le Session Replay est
        facultatif : il enregistre les interactions de navigation, avec les champs de saisie et le terminal masqués.
      </p>
      <div class="consent__actions">
        <!-- Sous Do Not Track, la capture est déjà refusée : pas d'action d'acceptation. -->
        <ZButton v-if="!dntForced" variant="primary" size="sm" @click="onAcceptAnalytics">Mesure uniquement</ZButton>
        <ZButton v-if="!dntForced" variant="secondary" size="sm" @click="onAcceptWithReplay">Mesure + replay</ZButton>
        <ZButton variant="ghost" size="sm" @click="onDecline">Refuser</ZButton>
        <NuxtLink to="/confidentialite" class="consent__link">En savoir plus</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Toast de consentement télémétrie (Epic 14, CAP-4) — invite terminal sobre,
// rendue client-only pour éviter tout mismatch d'hydratation en SSG.
import { computed, nextTick, onMounted, ref, watch } from "vue";

const {
  showConsentModal,
  dntForced,
  focusRequested,
  acceptAnalytics,
  acceptReplay,
  declineAnalytics,
  dismissConsentModal,
} = useConsent();

const toastEl = ref<HTMLElement | null>(null);

// F-19 : mémorise l'élément focalisé à l'ouverture explicite (via footer)
// pour le restaurer à la fermeture (a11y — pas de focus perdu sur `<body>`).
let lastFocusedBeforeOpen: HTMLElement | null = null;

// Garde de montage : n'apparaît jamais au prerender/SSR.
const mounted = ref(false);
onMounted(() => {
  mounted.value = true;
});

const visible = computed(() => mounted.value && showConsentModal.value);

// Mémorise le focus à l'ouverture, le restaure à la fermeture.
watch(visible, async (isVisible, wasVisible) => {
  if (isVisible && !wasVisible) {
    lastFocusedBeforeOpen = (document.activeElement as HTMLElement | null) ?? null;
  }
  if (!isVisible || !focusRequested.value) {
    return;
  }
  await nextTick();
  toastEl.value?.focus();
});

// Restaure le focus au déclencheur après accept/decline (uniquement si ouvert
// explicitement, pas à l'auto-affichage initial).
watch(
  () => [showConsentModal.value, focusRequested.value] as const,
  ([isOpen, wasRequested]) => {
    if (!isOpen && wasRequested && lastFocusedBeforeOpen && document.contains(lastFocusedBeforeOpen)) {
      lastFocusedBeforeOpen.focus();
      lastFocusedBeforeOpen = null;
    }
  },
);

function onAcceptAnalytics(): void {
  acceptAnalytics();
}

function onAcceptWithReplay(): void {
  acceptAnalytics();
  acceptReplay();
}

function onDecline(): void {
  declineAnalytics();
}
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) */
.consent {
  // Au-dessus du header (--z-header-raised) et du contenu.
  position: fixed;
  right: var(--space-4);
  bottom: var(--space-4);
  left: var(--space-4);
  z-index: var(--z-toast);
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.consent__box {
  width: 100%;
  max-width: 520px;
  padding: var(--space-4) var(--space-5);
  font-family: var(--font-mono);
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-3);
  pointer-events: auto;
  animation: consent-in var(--dur-base) var(--ease-standard) both;
}

.consent__prompt {
  margin: 0 0 var(--space-2);
  font-size: var(--fs-sm);
  color: var(--term-green);
}

.consent__text {
  margin: 0 0 var(--space-4);
  font-size: var(--fs-xs);
  line-height: var(--lh-normal);
  color: var(--text-muted);
}

.consent__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
}

.consent__link {
  font-size: var(--fs-xs);
  color: var(--accent);
  text-decoration: underline;

  &:hover {
    color: var(--accent-hover);
  }

  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 2px;
    border-radius: var(--radius-xs);
    box-shadow: var(--ring-accent);
  }
}

@keyframes consent-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .consent__box {
    animation: none;
  }
}
</style>
