export type ConsentState = "unknown" | "accepted" | "declined";

const STORAGE_KEY = "jouan_consent_telemetry";
const REPLAY_STORAGE_KEY = "jouan_consent_replay";
const REVOCATION_FALLBACK_KEY = "jouan_consent_revocation_fallback";

type PersistedConsent = Exclude<ConsentState, "unknown">;

function isEuPostHogHost(host: string | undefined): boolean {
  if (!host) {
    return false;
  }
  try {
    const url = new URL(host);
    return url.protocol === "https:" && url.hostname === "eu.i.posthog.com";
  } catch {
    return false;
  }
}

function readStoredValue(key: string): PersistedConsent | undefined {
  if (!import.meta.client) {
    return undefined;
  }
  try {
    const value = localStorage.getItem(key) ?? sessionStorage.getItem(key);
    return value === "accepted" || value === "declined" ? value : undefined;
  } catch {
    return undefined;
  }
}

function persistValue(key: string, value: PersistedConsent): boolean {
  if (!import.meta.client) {
    return false;
  }
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    try {
      sessionStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Composable centralisant le consentement télémétrie (RGPD opt-in, Epic 14).
 *
 * La mesure d'audience et le Session Replay disposent de deux consentements
 * indépendants. Un ancien consentement « accepted » est migré vers la mesure
 * uniquement ; le replay doit être réaccepté explicitement.
 */
export function useConsent() {
  const consentState = useState<ConsentState>("consent-state", () => "unknown");
  const replayConsentState = useState<ConsentState>("replay-consent-state", () => "unknown");
  const showConsentModal = useState<boolean>("consent-modal-visible", () => false);
  const dntForced = useState<boolean>("consent-dnt-forced", () => false);
  const focusRequested = useState<boolean>("consent-focus-requested", () => false);
  const revocationFallback = useState<boolean>("consent-revocation-fallback", () => false);

  const isAnalyticsConfigured = (): boolean => {
    if (!import.meta.client) {
      return false;
    }
    const config = useRuntimeConfig().public;
    return Boolean(config.posthogKey) && isEuPostHogHost(config.posthogHost);
  };

  const isDoNotTrackEnabled = (): boolean => {
    if (!import.meta.client) {
      return false;
    }
    const nav = navigator as Navigator & {
      msDoNotTrack?: string | null;
      globalPrivacyControl?: boolean;
    };
    const win = window as Window & { doNotTrack?: string | null };
    const dnt = nav.doNotTrack ?? nav.msDoNotTrack ?? win.doNotTrack;
    return nav.globalPrivacyControl === true || dnt === "1" || dnt === "yes";
  };

  const refreshPrivacySignal = (): boolean => {
    const blocked = isDoNotTrackEnabled();
    if (blocked) {
      dntForced.value = true;
      consentState.value = "declined";
      replayConsentState.value = "declined";
      showConsentModal.value = false;
    }
    return blocked || dntForced.value;
  };

  const clearRevocationFallback = (): void => {
    if (!import.meta.client) {
      return;
    }
    try {
      localStorage.removeItem(REVOCATION_FALLBACK_KEY);
      sessionStorage.removeItem(REVOCATION_FALLBACK_KEY);
    } catch {
      // Le stockage peut être indisponible : l'état mémoire reste fail-closed.
    }
  };

  const persist = (key: string, value: PersistedConsent): void => {
    if (!persistValue(key, value)) {
      revocationFallback.value = true;
      try {
        localStorage.setItem(REVOCATION_FALLBACK_KEY, "declined");
      } catch {
        try {
          sessionStorage.setItem(REVOCATION_FALLBACK_KEY, "declined");
        } catch {
          // Aucun stockage disponible : la révocation reste appliquée en mémoire.
        }
      }
    } else {
      clearRevocationFallback();
    }
  };

  const acceptAnalytics = (): void => {
    if (dntForced.value || refreshPrivacySignal()) {
      return;
    }
    consentState.value = "accepted";
    replayConsentState.value = "declined";
    showConsentModal.value = false;
    focusRequested.value = false;
    persist(STORAGE_KEY, "accepted");
    persist(REPLAY_STORAGE_KEY, "declined");
  };

  const acceptReplay = (): void => {
    if (dntForced.value || refreshPrivacySignal() || consentState.value !== "accepted") {
      return;
    }
    replayConsentState.value = "accepted";
    persist(REPLAY_STORAGE_KEY, "accepted");
  };

  const declineReplay = (): void => {
    replayConsentState.value = "declined";
    persist(REPLAY_STORAGE_KEY, "declined");
  };

  const declineAnalytics = (): void => {
    consentState.value = "declined";
    replayConsentState.value = "declined";
    showConsentModal.value = false;
    focusRequested.value = false;
    persist(STORAGE_KEY, "declined");
    persist(REPLAY_STORAGE_KEY, "declined");
  };

  const dismissConsentModal = (): void => {
    showConsentModal.value = false;
    focusRequested.value = false;
  };

  const openConsentModal = (): void => {
    focusRequested.value = true;
    showConsentModal.value = true;
  };

  const initConsent = (): void => {
    if (!import.meta.client) {
      return;
    }

    if (refreshPrivacySignal()) {
      return;
    }

    if (revocationFallback.value || readStoredValue(REVOCATION_FALLBACK_KEY) === "declined") {
      consentState.value = "declined";
      replayConsentState.value = "declined";
      showConsentModal.value = false;
      return;
    }

    const storedAnalytics = readStoredValue(STORAGE_KEY);
    const storedReplay = readStoredValue(REPLAY_STORAGE_KEY);
    consentState.value = storedAnalytics ?? "unknown";
    replayConsentState.value =
      consentState.value === "accepted" ? (storedReplay ?? "declined") : (storedReplay ?? "unknown");
    showConsentModal.value = consentState.value === "unknown" && isAnalyticsConfigured();
  };

  return {
    consentState,
    replayConsentState,
    showConsentModal,
    dntForced,
    focusRequested,
    isAnalyticsConfigured,
    isTrackingBlocked: refreshPrivacySignal,
    acceptAnalytics,
    acceptReplay,
    declineReplay,
    declineAnalytics,
    // Alias conservés pour les appels historiques et les extensions CMP.
    accept: acceptAnalytics,
    decline: declineAnalytics,
    dismissConsentModal,
    openConsentModal,
    initConsent,
  };
}
