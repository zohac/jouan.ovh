import type { PostHog } from "posthog-js";
import { effectScope, watch, type Ref } from "vue";
import type { RouteLocationNormalized, Router } from "vue-router";
import { useConsent, type ConsentState } from "~/composables/useConsent";
import { usePosthog } from "~/composables/usePosthog";

/**
 * Helper central de télémétrie (Epic 14, story 14.3 — FR46 / CAP-3).
 *
 * Unique point d'émission des événements du plan de taggage
 * (`docs/specs/spec-analytics-search-console/tracking-plan.md`), dans le strict
 * respect du consentement RGPD :
 *
 * - `track(name, props?)` : no-op silencieux si le consentement n'est pas
 *   « accepted », si Do Not Track est forcé, ou en dev/prerender. Les événements
 *   émis avant le chargement du SDK sont mis en file (borne) puis rejoués.
 * - `install()` : installe (une seule fois) les collectes automatiques :
 *   `$pageview` (routeur Nuxt), `scroll_depth_reached` (paliers 25/50/75/100),
 *   `time_on_page_threshold` (30/60/180/300 s), la délégation globale `click`
 *   (liens externes `target="_blank"`, attribut `data-analytics`, vues
 *   `data-analytics-view`). Idempotent.
 * - `isReady()` : indique si la capture est effectivement possible.
 *
 * Aucune primitive du Design System n'est modifiée : l'instrumentation passe par
 * des attributs `data-*` (forwardés via `$attrs`) et par des appels explicites
 * depuis les composants métier.
 */

type AnalyticsValue = string | number | boolean | null | undefined;
export type AnalyticsProps = Record<string, AnalyticsValue>;

/** Contrat d'attribut : `data-analytics="event_name|prop:valeur|prop:valeur"`. */
const ANALYTICS_ATTR = "data-analytics";
/** Vues observées via `data-analytics-view="<clé>"` (IntersectionObserver 50 %). */
const VIEW_EVENTS: Record<string, { name: string; props: AnalyticsProps }> = {
  pricing: { name: "pricing_card_viewed", props: { section: "pricing_grid" } },
  differentiator: { name: "differentiator_block_viewed", props: { section_id: "differentiator" } },
  // F-12 : les étapes du process utilisent des clés dynamiques `process-step-N`
  // (résolues dans `onViewIntersect` avec extraction du numéro). Voir template
  // `<li data-analytics-view="process-step-${stepNumber}">` côté `services.vue`.
};

const SCROLL_STEPS = [25, 50, 75, 100] as const;
const TIME_STEPS = [30, 60, 180, 300] as const;
const PENDING_LIMIT = 50;

// --- Sanitisers RGPD (story 14.3 — F-01..F-04, F-21) -----------------------
// Whitelist des query keys acceptées dans `$pageview.query_params` (F-03).
const ALLOWED_QUERY_KEYS = new Set(["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]);
// Regex de masquage PII (emails, téléphones, tokens et credentials).
const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
const PHONE_RE = /(?<!\w)\+?\d(?:[\d .()-]{7,}\d)(?!\w)/gu;
const TOKEN_RE = /[A-Za-z0-9_-]{24,}/g;
const CREDENTIAL_RE = /(?:token|secret|api[_-]?key|auth|code)[=:_-]+[A-Za-z0-9_-]{6,}/giu;
const PII_REDACTED = "[redacted]";
const MAX_ATTRIBUTION_VALUE_LENGTH = 120;
// Les paramètres UTM sont des métadonnées de campagne, pas un champ libre :
// toute valeur avec espaces, caractères non campagnards ou longueur anormale
// est neutralisée avant emission.
const SAFE_ATTRIBUTION_VALUE_RE = /^[a-zA-Z0-9._:+-]+$/u;

/** Retire la query string et le hash d'une URL — ne conserve que `pathname`. */
function sanitizeLocation(): string {
  const path = engine?.router.currentRoute.value.path ?? "/";
  return redactPii(path);
}

/** Extrait l'origine (hostname) d'une URL de provenance, fallback `'direct'`. */
function sanitizeReferrer(referrer: string): string {
  if (!referrer) {
    return "direct";
  }
  try {
    return new URL(referrer).hostname || "direct";
  } catch {
    return "direct";
  }
}

/** Remplace emails et tokens longs par `[redacted]` dans une chaîne libre. */
function redactPii(value: string): string {
  return value
    .replace(EMAIL_RE, PII_REDACTED)
    .replace(PHONE_RE, PII_REDACTED)
    .replace(CREDENTIAL_RE, PII_REDACTED)
    .replace(TOKEN_RE, PII_REDACTED);
}

function sanitizeAnalyticsValue(value: AnalyticsValue): AnalyticsValue {
  if (typeof value !== "string") {
    return value;
  }
  const trimmed = value.trim();
  if (/^https?:\/\//iu.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      return `${url.origin}${url.pathname}`;
    } catch {
      return trimmed.split(/[?#]/u, 1)[0] ?? "";
    }
  }
  if (trimmed.startsWith("/")) {
    return redactPii(trimmed.split(/[?#]/u, 1)[0] ?? "").slice(0, 240);
  }
  return redactPii(trimmed).slice(0, 240);
}

function sanitizeAnalyticsProps(props?: AnalyticsProps): AnalyticsProps | undefined {
  if (!props) {
    return undefined;
  }
  return Object.fromEntries(
    Object.entries(props).map(([key, value]) => [key, sanitizeAnalyticsValue(value)]),
  ) as AnalyticsProps;
}

/** Neutralise une valeur d'attribution avant son émission PostHog. */
function sanitizeAttributionValue(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > MAX_ATTRIBUTION_VALUE_LENGTH) {
    return "";
  }
  const redacted = redactPii(trimmed);
  return SAFE_ATTRIBUTION_VALUE_RE.test(redacted) ? redacted : PII_REDACTED;
}

/** Filtre + sanitise un objet query pour la sérialisation JSON. */
function sanitizeQuery(query: Record<string, unknown>): string {
  const out: Record<string, string> = {};
  Object.keys(query).forEach((key) => {
    if (!ALLOWED_QUERY_KEYS.has(key)) {
      return;
    }
    const value = query[key];
    if (typeof value === "string" || typeof value === "number") {
      const sanitized = sanitizeAttributionValue(String(value));
      if (sanitized) {
        out[key] = sanitized;
      }
    }
  });
  return Object.keys(out).length ? JSON.stringify(out) : "";
}

interface AnalyticsEngine {
  consentState: Ref<ConsentState>;
  dntForced: Ref<boolean>;
  isTrackingBlocked: () => boolean;
  instance: Ref<PostHog | null>;
  router: Router;
  /** Une clé PostHog est-elle configurée ? (sinon aucun listener n'est installé). */
  configured: boolean;
}

let engine: AnalyticsEngine | null = null;
let watchStarted = false;
let installed = false;

let removers: Array<() => void> = [];
let timeouts: Array<ReturnType<typeof setTimeout>> = [];
let viewObserver: IntersectionObserver | null = null;
let observedViews = new WeakSet<Element>();
let pending: Array<{ name: string; props?: AnalyticsProps }> = [];
let emittedScroll = new Set<number>();
let emittedTime = new Set<number>();
let lastPageKey = "";

function isClient(): boolean {
  return import.meta.client && !import.meta.prerender;
}

/** Télémétrie autorisée à l'instant T ? (client, prod, consentement, DNT). */
function analyticsEnabled(): boolean {
  if (!isClient() || import.meta.dev || !engine || !engine.configured) {
    return false;
  }
  if (engine.consentState.value !== "accepted") {
    return false;
  }
  return !engine.isTrackingBlocked();
}

function currentPath(): string {
  return sanitizeLocation();
}

/** Écrit dans le SDK ; met en file si l'instance n'est pas encore chargée. */
function capture(name: string, props?: AnalyticsProps): void {
  const safeProps = sanitizeAnalyticsProps(props);
  const posthog = engine?.instance.value;
  if (!posthog) {
    pending.push({ name, props: safeProps });
    if (pending.length > PENDING_LIMIT) {
      pending.shift();
    }
    return;
  }
  posthog.capture(name, safeProps);
}

function flushPending(): void {
  if (!analyticsEnabled() || !engine?.instance.value) {
    return;
  }
  const queued = pending;
  pending = [];
  queued.forEach((item) => engine?.instance.value?.capture(item.name, item.props));
}

/** Vide la file d'attente des événements émis avant chargement du SDK.
 *  Appelé sur refus / DNT pour éviter un replay d'événements émis sous
 *  un état où le consentement n'était pas acquis (RGPD art. 7.3). */
function clearPending(): void {
  pending = [];
}

/** Émet un événement si — et seulement si — la télémétrie est autorisée. */
function track(name: string, props?: AnalyticsProps): void {
  if (!analyticsEnabled()) {
    return;
  }
  capture(name, props);
}

function startTimeThresholds(): void {
  TIME_STEPS.forEach((seconds) => {
    timeouts.push(
      setTimeout(() => {
        if (emittedTime.has(seconds) || !analyticsEnabled()) {
          return;
        }
        emittedTime.add(seconds);
        track("time_on_page_threshold", { seconds, page_path: currentPath() });
      }, seconds * 1000),
    );
  });
}

/** F-22 : suspend les paliers de temps quand l'onglet est caché (l'utilisateur
 *  ne regarde pas la page). Les paliers déjà émis sont conservés (Set). */
function pauseTimeThresholds(): void {
  timeouts.forEach(clearTimeout);
  timeouts = [];
}

function resumeTimeThresholds(): void {
  if (timeouts.length > 0) {
    return;
  }
  startTimeThresholds();
}

/** Réinitialise l'état scopé page (scroll + temps) à chaque `$pageview`. */
function resetPageTracking(): void {
  emittedScroll = new Set();
  emittedTime = new Set();
  timeouts.forEach(clearTimeout);
  timeouts = [];
  startTimeThresholds();
}

let pendingPageview: ReturnType<typeof setTimeout> | null = null;

function emitPageview(path: string, fullPath: string, query: Record<string, unknown>): void {
  if (fullPath === lastPageKey) {
    return;
  }
  lastPageKey = fullPath;
  resetPageTracking();

  // F-17 : annule un `$pageview` précédent encore en attente (cas d'une
  // navigation ultra-rapide A → B → A en <1 tick) pour éviter une double
  // émission. Le `setTimeout` est également stocké pour être cancellable
  // par `uninstall()`.
  if (pendingPageview !== null) {
    clearTimeout(pendingPageview);
    pendingPageview = null;
  }

  // Différé d'un tick : `useHead`/`usePageSeo` applique le titre juste après la
  // navigation — on lit le titre résolu plutôt que l'ancien.
  pendingPageview = setTimeout(() => {
    pendingPageview = null;
    const queryParams = sanitizeQuery(query);
    track("$pageview", {
      path,
      title: document.title,
      referrer: sanitizeReferrer(document.referrer),
      ...(queryParams ? { query_params: queryParams } : {}),
    });
  }, 0);
}

function handleScroll(): void {
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - window.innerHeight;
  // F-09 : page non-scrollable → ne pas émettre en bloc les 4 paliers. On
  // considère la page comme « 100 % lue » et on émet uniquement ce palier
  // (cohérent avec l'intention de mesure d'attention).
  if (scrollable <= 0) {
    if (!emittedScroll.has(100)) {
      emittedScroll.add(100);
      track("scroll_depth_reached", { depth_percentage: 100, page_path: currentPath() });
    }
    return;
  }
  const percentage = (window.scrollY / scrollable) * 100;
  SCROLL_STEPS.forEach((step) => {
    if (!emittedScroll.has(step) && percentage >= step) {
      emittedScroll.add(step);
      track("scroll_depth_reached", { depth_percentage: step, page_path: currentPath() });
    }
  });
}

function parseAnalyticsAttr(value: string | null): { name: string; props?: AnalyticsProps } | null {
  if (!value) {
    return null;
  }
  const [rawName, ...pairs] = value.split("|");
  const name = (rawName ?? "").trim();
  if (!name) {
    return null;
  }
  if (!pairs.length) {
    return { name };
  }
  const props: AnalyticsProps = {};
  pairs.forEach((pair) => {
    const separator = pair.indexOf(":");
    if (separator <= 0) {
      return;
    }
    const key = pair.slice(0, separator).trim();
    const val = pair.slice(separator + 1).trim();
    if (key) {
      props[key] = val;
    }
  });
  return { name, props };
}

function linkedinLocation(link: Element): "header" | "footer" | "contact" {
  if (link.closest("footer")) {
    return "footer";
  }
  if (link.closest("header")) {
    return "header";
  }
  return "contact";
}

function emitExternalLink(link: HTMLAnchorElement): void {
  let destinationDomain = "unknown";
  try {
    destinationDomain = new URL(link.href).hostname;
  } catch {
    // href relatif/malformé : on garde "unknown".
  }
  track("external_link_clicked", {
    destination_domain: destinationDomain,
    link_text: redactPii((link.textContent ?? "").trim().slice(0, 80)),
    location: sanitizeLocation(),
  });
}

function onClickCapture(event: MouseEvent): void {
  if (!analyticsEnabled() || !(event.target instanceof Element)) {
    return;
  }
  const target = event.target;

  // Priorité au lien externe (contrat du tracking plan) : tout `target="_blank"`
  // générique est instrumenté sans dépendre d'un `data-analytics`.
  const external = target.closest('a[target="_blank"]');
  if (external instanceof HTMLAnchorElement) {
    emitExternalLink(external);
    if (external.href.includes("linkedin.com")) {
      track("linkedin_profile_clicked", { location: linkedinLocation(external) });
    }
    return;
  }

  const annotated = target.closest(`[${ANALYTICS_ATTR}]`);
  if (annotated) {
    const parsed = parseAnalyticsAttr(annotated.getAttribute(ANALYTICS_ATTR));
    if (parsed) {
      track(parsed.name, parsed.props);
    }
  }
}

function onViewIntersect(entries: IntersectionObserverEntry[]): void {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }
    const key = entry.target.getAttribute("data-analytics-view");
    if (!key) {
      return;
    }
    // Clé dynamique avec suffixe numérique (`process-step-1`, `process-step-2`, …)
    // — lookup avec extraction du numéro, fallback générique si non mappé.
    const dynamicMatch = /^process-step-(\d+)$/.exec(key);
    if (dynamicMatch) {
      const stepNumber = Number(dynamicMatch[1]);
      const title = entry.target.getAttribute("data-analytics-step-title") ?? "";
      track("process_step_interacted", { step_number: stepNumber, step_title: title });
    } else {
      const definition = VIEW_EVENTS[key];
      if (definition) {
        track(definition.name, definition.props);
      }
    }
    viewObserver?.unobserve(entry.target);
  });
}

function registerGlobalProperties(): void {
  const posthog = engine?.instance.value;
  if (!posthog) {
    return;
  }
  const width = window.innerWidth;
  const height = window.innerHeight;
  posthog.register({
    locale: document.documentElement.lang || "fr",
    viewport_width: width,
    viewport_height: height,
    screen_category: width < 768 ? "mobile" : width <= 1024 ? "tablet" : "desktop",
    prefers_reduced_motion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  });
}

function scanViewTargets(): void {
  if (!viewObserver) {
    return;
  }
  document.querySelectorAll("[data-analytics-view]").forEach((el) => {
    if (observedViews.has(el)) {
      return;
    }
    observedViews.add(el);
    viewObserver?.observe(el);
  });
}

function removeAllListeners(): void {
  removers.forEach((remove) => remove());
  removers = [];
  timeouts.forEach(clearTimeout);
  timeouts = [];
  if (pendingPageview !== null) {
    clearTimeout(pendingPageview);
    pendingPageview = null;
  }
  viewObserver?.disconnect();
  viewObserver = null;
  observedViews = new WeakSet();
}

/** Installe les collectes automatiques (idempotent). */
function install(): void {
  if (!isClient() || import.meta.dev || !engine || !engine.configured) {
    return;
  }
  if (engine.consentState.value !== "accepted" || engine.isTrackingBlocked()) {
    return;
  }
  flushPending();
  registerGlobalProperties();
  if (installed) {
    return;
  }
  installed = true;
  window.addEventListener("resize", registerGlobalProperties, { passive: true });
  removers.push(() => window.removeEventListener("resize", registerGlobalProperties));

  const { router } = engine;

  // Détection « vraie » transition : on ignore les changements de hash seuls
  // (path + query identiques) pour éviter une double capture.
  const onRouteChange = (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    if (to.fullPath.split("#")[0] !== from.fullPath.split("#")[0]) {
      emitPageview(to.path, to.fullPath, to.query);
    }
  };
  removers.push(router.afterEach(onRouteChange));

  // Pageview initial si la route est déjà résolue (consentement tardif) ;
  // sinon le hook `afterEach` couvrira la navigation initiale.
  const current = router.currentRoute.value;
  if (current.matched.length > 0) {
    emitPageview(current.path, current.fullPath, current.query);
  }

  const onScroll = () => {
    handleScroll();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  removers.push(() => window.removeEventListener("scroll", onScroll));

  document.addEventListener("click", onClickCapture, true);
  removers.push(() => document.removeEventListener("click", onClickCapture, true));

  // F-22 : suspend/reprend les paliers de temps sur changement de visibilité.
  const onVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      pauseTimeThresholds();
    } else if (document.visibilityState === "visible") {
      resumeTimeThresholds();
    }
  };
  document.addEventListener("visibilitychange", onVisibilityChange);
  removers.push(() => document.removeEventListener("visibilitychange", onVisibilityChange));

  if ("IntersectionObserver" in window) {
    viewObserver = new IntersectionObserver(onViewIntersect, { threshold: 0.5 });
    scanViewTargets();
  }

  // Re-scanne le DOM après chaque navigation (nouvelles vues montées).
  removers.push(
    router.afterEach(() => {
      setTimeout(scanViewTargets, 0);
    }),
  );
}

/** Retire les collectes automatiques (transition refus / DNT). */
function uninstall(): void {
  if (!installed) {
    return;
  }
  installed = false;
  removeAllListeners();
  lastPageKey = "";
  emittedScroll = new Set();
  emittedTime = new Set();
}

function isReady(): boolean {
  return analyticsEnabled() && Boolean(engine?.instance.value);
}

/**
 * Composable central. À n'appeler qu'en contexte Nuxt valide (plugin ou setup) :
 * le premier appel capture le routeur et l'état de consentement partagés.
 */
export function useAnalytics(): {
  track: (name: string, props?: AnalyticsProps) => void;
  install: () => void;
  isReady: () => boolean;
  /** Vide la file d'attente des événements émis avant chargement du SDK. */
  clearPending: () => void;
} {
  if (!engine && import.meta.client) {
    const consent = useConsent();
    engine = {
      consentState: consent.consentState,
      dntForced: consent.dntForced,
      isTrackingBlocked: consent.isTrackingBlocked,
      instance: usePosthog().instance,
      router: useRouter(),
      configured: consent.isAnalyticsConfigured(),
    };
  }

  const engineRef = engine;
  if (!watchStarted && engineRef) {
    watchStarted = true;
    // Scope détaché : la veille survit à un éventuel démontage du composant
    // qui a déclenché le premier appel.
    effectScope(true).run(() => {
      watch(
        [engineRef.consentState, engineRef.dntForced],
        ([state, dnt]) => {
          if (state === "accepted" && !dnt) {
            install();
          } else {
            uninstall();
          }
        },
        { immediate: true },
      );
    });
  }

  return { track, install, isReady, clearPending };
}
