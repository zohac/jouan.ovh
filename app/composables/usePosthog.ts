import type { PostHog } from "posthog-js";
import { ref, shallowRef, type Ref } from "vue";

/**
 * Registre partagé de l'instance PostHog (Epic 14, story 14.3).
 *
 * Le plugin `posthog.client.ts` alimente ce registre après un `init()` réussi ;
 * `useAnalytics()` le consomme pour émettre les événements métier. Registre
 * module-level (et non `useState`) volontairement : l'instance du SDK n'est ni
 * sérialisable ni pertinente côté serveur — elle n'est renseignée que côté
 * client, jamais pendant le prerender SSG.
 *
 * `shallowRef` : on ne veut pas que Vue « réactive en profondeur » l'objet du SDK.
 */
const instance = shallowRef<PostHog | null>(null);
const ready = ref(false);

export interface UsePosthogReturn {
  /** Instance PostHog initialisée (null tant que le SDK n'est pas chargé). */
  instance: Ref<PostHog | null>;
  /** Vrai dès qu'une instance est disponible et prête à capturer. */
  ready: Ref<boolean>;
  /** Alimenté par le plugin : renseigne (ou réinitialise) l'instance partagée. */
  setInstance: (posthog: PostHog | null) => void;
}

export function usePosthog(): UsePosthogReturn {
  const setInstance = (posthog: PostHog | null): void => {
    instance.value = posthog;
    ready.value = posthog !== null;
  };

  return { instance, ready, setInstance };
}
