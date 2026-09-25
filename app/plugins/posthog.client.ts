import type { BeforeSendFn, PostHog } from "posthog-js";
import { watch } from "vue";
import { useConsent, type ConsentState } from "~/composables/useConsent";
import { useAnalytics } from "~/composables/useAnalytics";
import { usePosthog } from "~/composables/usePosthog";

function sanitizePostHogUrl(value: string): string {
  if (!/^(?:https?:\/\/|\/)/u.test(value)) {
    return value.split(/[?#]/u, 1)[0] ?? "";
  }
  try {
    const url = new URL(value, window.location.origin);
    return `${url.origin}${url.pathname}`;
  } catch {
    return value.split(/[?#]/u, 1)[0] ?? "";
  }
}

const sanitizePostHogEvent: BeforeSendFn = (event) => {
  if (!event) {
    return null;
  }
  const properties = { ...(event.properties ?? {}) };
  for (const key of ["$current_url", "$pathname", "$referrer"] as const) {
    const value = properties[key];
    if (typeof value === "string") {
      properties[key] = sanitizePostHogUrl(value);
    }
  }
  return { ...event, properties };
};

/**
 * Initialisation PostHog Cloud EU (Epic 14, CAP-1).
 *
 * - Client uniquement (plugin `.client` + garde `import.meta.client`), jamais exécuté au prerender.
 * - Désactivé en développement local : aucun appel réseau analytics hors production.
 * - Chargement différé et non bloquant de `posthog-js` (import dynamique).
 * - Opt-out par défaut : la capture n'est activée qu'après consentement explicite.
 * - Le replay possède un consentement distinct de la mesure d'audience.
 */
export default defineNuxtPlugin(() => {
  // Garde client explicite (AC6), en complément du suffixe `.client.ts`.
  if (!import.meta.client || import.meta.prerender) {
    return;
  }

  const { consentState, replayConsentState, initConsent, isAnalyticsConfigured, isTrackingBlocked } = useConsent();
  // Registre partagé (consommé par `useAnalytics`) + helper de taggage exhaustif.
  const { setInstance } = usePosthog();
  const { install, clearPending } = useAnalytics();

  // Lecture de la préférence persistée + détection DNT/GPC (toujours client).
  initConsent();

  const config = useRuntimeConfig().public;
  const posthogKey = config.posthogKey;
  // Hôte unique : la valeur par défaut vit dans `runtimeConfig` (nuxt.config.ts).
  const posthogHost = config.posthogHost;

  // Pas de clé/hôte EU valide ou environnement de dev : le consentement fonctionne,
  // mais aucun SDK analytics n'est chargé (zéro requête vers PostHog).
  if (import.meta.dev || !isAnalyticsConfigured() || !posthogKey || !posthogHost) {
    return;
  }

  let instance: PostHog | null = null;
  let loading: Promise<PostHog | null> | null = null;
  let generation = 0;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  let retryAttempt = 0;

  const clearRetry = (): void => {
    if (retryTimer !== null) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
  };

  const loadPostHog = (): Promise<PostHog | null> => {
    if (instance) {
      return Promise.resolve(instance);
    }
    if (loading) {
      return loading;
    }

    const currentGeneration = generation;
    loading = import("posthog-js")
      .then(({ default: posthog }) => {
        if (currentGeneration !== generation || isTrackingBlocked() || consentState.value !== "accepted") {
          posthog.reset();
          return null;
        }

        posthog.init(posthogKey, {
          api_host: posthogHost,
          // Opt-out tant que le consentement n'est pas accordé (RGPD opt-in).
          opt_out_capturing_by_default: true,
          // Ne crée aucune persistance avant un opt-in explicite.
          opt_out_persistence_by_default: true,
          // Respecte aussi le signal navigateur Do Not Track.
          respect_dnt: true,
          // Le plan de taggage implémente le $pageview route-based : pas
          // d'auto-capture ici pour éviter une double capture.
          capture_pageview: false,
          // Événements explicites uniquement ; pas d'autocapture DOM.
          autocapture: false,
          // Le replay est Piloté séparément par replayConsentState.
          disable_session_recording: true,
          session_recording: {
            maskAllInputs: true,
            maskTextSelector: ".ph-no-capture, .terminal, input, textarea",
            maskAllElementAttributes: true,
            recordBody: false,
          },
          // Une URL automatique peut contenir un token dans une route ou une
          // query string : elle est systématiquement réduite à origin + pathname.
          before_send: sanitizePostHogEvent,
          // Persistance locale maîtrisée, sans identification nominative.
          persistence: "localStorage",
          person_profiles: "identified_only",
          // Les IP sont omises de la charge utile cliente.
          ip: false,
        });

        if (currentGeneration !== generation || isTrackingBlocked() || consentState.value !== "accepted") {
          posthog.reset();
          return null;
        }

        instance = posthog;
        setInstance(posthog);
        return posthog;
      })
      .catch(() => {
        loading = null;
        if (import.meta.dev) {
          console.warn("[posthog] init failed — analytics disabled for this session.");
        }
        return null;
      });
    return loading;
  };

  const scheduleRetry = (): void => {
    if (retryTimer !== null || retryAttempt >= 2 || consentState.value !== "accepted" || isTrackingBlocked()) {
      return;
    }
    retryAttempt += 1;
    retryTimer = setTimeout(() => {
      retryTimer = null;
      void applyConsent(consentState.value, replayConsentState.value);
    }, 5_000);
  };

  const stopAndReset = (): void => {
    clearRetry();
    retryAttempt = 0;
    generation += 1;
    loading = null;
    clearPending();
    if (instance) {
      instance.stopSessionRecording();
      instance.opt_out_capturing();
      instance.reset();
    }
    instance = null;
    setInstance(null);
  };

  async function applyConsent(analyticsState: ConsentState, replayState: ConsentState): Promise<void> {
    if (analyticsState !== "accepted" || isTrackingBlocked()) {
      stopAndReset();
      return;
    }

    const posthog = await loadPostHog();
    if (!posthog || consentState.value !== "accepted" || isTrackingBlocked()) {
      scheduleRetry();
      return;
    }

    posthog.opt_in_capturing();
    if (replayState === "accepted" && consentState.value === "accepted" && !isTrackingBlocked()) {
      posthog.startSessionRecording();
    } else {
      posthog.stopSessionRecording();
    }

    // Installe les collectes automatiques du plan de taggage (story 14.3).
    install();
  }

  // Réagit aux deux consentements : la mesure et le replay sont indépendants.
  watch(
    [consentState, replayConsentState],
    ([analyticsState, replayState]) => {
      // Silencieux : un échec du SDK ne doit pas produire d'unhandledrejection.
      void applyConsent(analyticsState, replayState).catch(() => {});
    },
    { immediate: true },
  );
});
