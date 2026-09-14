<template>
  <header class="hdr" :class="{ 'hdr--stuck': isScrolled }">
    <div class="hdr__progress" :style="{ width: `${scrollProgress}%` }" aria-hidden="true" />
    <div class="hdr__in">
      <NuxtLink to="/" class="hdr__brand" @click="onBrandClick">
        <NuxtImg src="/images/logo_white.png" alt="" class="hdr__logo" width="24" height="24" />
        <span class="hdr__brand-text"><b>jouan</b><span class="dim">.ovh</span></span>
      </NuxtLink>

      <nav class="hdr__nav" aria-label="Navigation principale">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="hdr__link"
          :class="{ 'hdr__link--active': isActive(item.to) }"
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          <span class="hdr__link-prefix" aria-hidden="true">{{ item.prefix }} </span>
          <span class="hdr__link-label">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="hdr__right">
        <ZButton variant="terminal" size="sm" class="hdr__action hdr__action--terminal" @click="addNewTerminal">
          <template #icon><ZIcon name="terminal" /></template>
          Terminal
        </ZButton>
        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" class="hdr__action">
          Démarrer un projet
        </ZButton>

        <button
          ref="burgerButton"
          class="hdr__burger"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="hdr-mobile-menu"
          :aria-label="menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
          @click="toggleMenu"
        >
          <ZIcon :name="menuOpen ? 'arrow' : 'layers'" />
        </button>
      </div>
    </div>

    <!-- Dock d'état tout à droite de l'écran (hors container centré) -->
    <div class="hdr__dock-right" aria-label="Statut et heure">
      <div class="hdr__status-badge">
        <span class="hdr__status-dot" aria-hidden="true" />
        <span class="hdr__status-text">Disponible</span>
      </div>
      <CurrentTime class="hdr__dock-clock" />
    </div>

    <!-- Menu mobile -->
    <div v-if="menuOpen" class="hdr__overlay" @click="closeMenuAndRefocus" />
    <nav id="hdr-mobile-menu" class="hdr__menu" :class="{ 'hdr__menu--open': menuOpen }" aria-label="Navigation mobile">
      <NuxtLink
        v-for="(item, index) in navItems"
        :key="item.to"
        :ref="(el) => registerFirstLink(el, index)"
        :to="item.to"
        class="hdr__menu-link"
        :class="{ 'hdr__menu-link--active': isActive(item.to) }"
        :aria-current="isActive(item.to) ? 'page' : undefined"
        @click="closeMenu"
      >
        <span class="hdr__menu-link-prefix" aria-hidden="true">{{ item.prefix }} </span>
        <span class="hdr__menu-link-label">{{ item.label }}</span>
      </NuxtLink>

      <div class="hdr__menu-actions">
        <div class="hdr__menu-status">
          <div class="hdr__status-badge">
            <span class="hdr__status-dot" aria-hidden="true" />
            <span class="hdr__status-text">Disponible</span>
          </div>
          <CurrentTime class="hdr__menu-clock" />
        </div>
        <ZButton variant="terminal" size="sm" class="hdr__action--terminal" @click="openTerminalFromMenu">
          <template #icon><ZIcon name="terminal" /></template>
          Terminal
        </ZButton>
        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" @click="closeMenu">
          Démarrer un projet
        </ZButton>
      </div>
    </nav>

    <TerminalManagerComponent ref="terminalManager" />
  </header>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance } from "vue";
import { onBeforeUnmount, onMounted, nextTick, ref } from "vue";
import { NuxtLink } from "#components";
import TerminalManagerComponent from "~/components/terminal/TerminalManagerComponent.vue";

const route = useRoute();

const navItems = [
  { to: "/", label: "Accueil", prefix: "~" },
  { to: "/services", label: "Services", prefix: "//" },
  { to: "/about", label: "À propos", prefix: "./" },
  { to: "/blog", label: "Blog", prefix: "~/" },
  { to: "/contact", label: "Contact", prefix: "$" },
];

// Lien actif : exact pour l'accueil, préfixe pour les autres (couvre /blog/[...slug]).
function isActive(to: string): boolean {
  if (to === "/") {
    return route.path === "/";
  }
  return route.path === to || route.path.startsWith(`${to}/`);
}

// --- Scroll state & progress ---
const isScrolled = ref(false);
const scrollProgress = ref(0);

function onScroll() {
  const top = window.scrollY || document.documentElement.scrollTop || 0;
  isScrolled.value = top > 20;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  const progress = h > 0 ? (top / h) * 100 : 0;
  scrollProgress.value = Math.min(100, Math.max(0, progress));
}

// --- Terminal easter-egg (préservé) ---
const terminalManager = ref<InstanceType<typeof TerminalManagerComponent> | null>(null);

function addNewTerminal() {
  terminalManager.value?.createNewTerminal();
}

// Expose l'ouverture du terminal au reste du site via le lanceur partagé
// (ex. ligne « help » du hero d'accueil, story 3.1). Le gestionnaire reste
// monté ici ; on enregistre seulement une référence vers sa méthode.
const { register: registerTerminalLauncher, unregister: unregisterTerminalLauncher } = useTerminal();

// --- Menu mobile accessible ---
const menuOpen = ref(false);
const firstMenuLink = ref<HTMLElement | null>(null);
const burgerButton = ref<HTMLElement | null>(null);

function registerFirstLink(el: Element | ComponentPublicInstance | null, index: number) {
  if (index !== 0) {
    return;
  }
  const instance = el as ComponentPublicInstance | null;
  firstMenuLink.value = (instance?.$el ?? el) as HTMLElement | null;
}

function openMenu() {
  menuOpen.value = true;
  nextTick(() => firstMenuLink.value?.focus());
}

function closeMenu() {
  menuOpen.value = false;
}

function onBrandClick(event: MouseEvent) {
  closeMenu();
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }
  if (route.path === "/") {
    event.preventDefault();
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: isReducedMotion ? "auto" : "smooth" });
  }
}

// Fermeture clavier/overlay : renvoie le focus au burger (déclencheur) — a11y.
function closeMenuAndRefocus() {
  if (!menuOpen.value) {
    return;
  }
  closeMenu();
  nextTick(() => burgerButton.value?.focus());
}

function toggleMenu() {
  if (menuOpen.value) {
    closeMenu();
  } else {
    openMenu();
  }
}

function openTerminalFromMenu() {
  addNewTerminal();
  closeMenu();
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && menuOpen.value) {
    closeMenuAndRefocus();
  }
}

// Passage en desktop alors que le menu mobile est ouvert : on le ferme (sinon
// l'overlay fixed resterait actif et le menu deviendrait incohérent au resize).
let desktopMq: MediaQueryList | null = null;
function onDesktopChange(event: MediaQueryListEvent) {
  if (event.matches) {
    closeMenu();
  }
}

onMounted(() => {
  document.addEventListener("keydown", onKeydown);
  desktopMq = window.matchMedia("(min-width: 901px)");
  desktopMq.addEventListener("change", onDesktopChange);
  registerTerminalLauncher(addNewTerminal);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKeydown);
  desktopMq?.removeEventListener("change", onDesktopChange);
  unregisterTerminalLauncher(addNewTerminal);
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css */
.hdr {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  height: var(--header-height);
  background: transparent;
  border-bottom: 1px solid transparent;
  transition:
    background var(--dur-base) var(--ease-standard),
    border-color var(--dur-base) var(--ease-standard),
    backdrop-filter var(--dur-base) var(--ease-standard),
    -webkit-backdrop-filter var(--dur-base) var(--ease-standard);
}

.hdr--stuck {
  background: color-mix(in srgb, var(--surface-0) 80%, transparent);
  border-bottom-color: var(--border-subtle);

  /* stylelint-disable-next-line property-no-vendor-prefix -- Safari : autoprefixer non câblé, préfixe manuel requis */
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}

.hdr__progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
  box-shadow: 0 0 10px var(--accent);
  pointer-events: none;
  transition: width 0.05s linear;
}

.hdr__in {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  width: 100%;
  max-width: var(--container-xl);
  height: 100%;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.hdr__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
  cursor: pointer;

  .hdr__logo {
    display: block;
    width: 24px;
    height: 24px;
    object-fit: contain;
    filter: drop-shadow(0 2px 6px color-mix(in srgb, var(--surface-0) 60%, transparent));
    transition:
      transform var(--dur-base) var(--ease-standard),
      filter var(--dur-base) var(--ease-standard);
  }

  .hdr__brand-text {
    transition: transform var(--dur-fast) var(--ease-standard);
  }

  b {
    font-family: var(--font-mono);
    font-size: var(--fs-md);
    font-weight: var(--fw-bold);
    color: var(--text-strong);
    transition: color var(--dur-fast) var(--ease-standard);
  }

  .dim {
    color: var(--text-faint);
    transition: color var(--dur-fast) var(--ease-standard);
  }

  &:hover {
    .hdr__logo {
      transform: rotate(-12deg) scale(1.15);
      filter: drop-shadow(0 0 10px color-mix(in srgb, var(--accent) 70%, transparent));
    }

    b {
      color: var(--accent);
    }

    .dim {
      color: var(--text-body);
    }
  }

  // Lien focusable (logo + nom) : anneau DS comme les autres focusables du châssis.
  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 2px;
    border-radius: var(--radius-sm);
    box-shadow: var(--ring-accent);
  }
}

.hdr__nav {
  position: absolute;
  left: 50%;
  display: flex;
  align-items: center;
  gap: var(--space-6);
  transform: translateX(-50%);
}

.hdr__link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 4px 0;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-body);
  text-decoration: none;
  background: transparent;
  transition: color var(--dur-fast) var(--ease-standard);

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1.5px;
    background: var(--accent);
    transition: width var(--dur-base) var(--ease-out);
  }

  &:hover {
    color: var(--text-strong);
    background: transparent;

    &::after {
      width: 100%;
    }
  }

  // Anneau de focus DS
  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 4px;
    border-radius: var(--radius-xs);
    box-shadow: var(--ring-accent);
  }
}

.hdr__link--active {
  color: var(--text-strong);

  &::after {
    width: 100%;
  }

  .hdr__link-prefix {
    color: var(--accent);
  }
}

.hdr__link-prefix,
.hdr__menu-link-prefix {
  font-family: var(--font-mono);
  color: var(--text-faint);
  transition: color var(--dur-fast) var(--ease-standard);
}

.hdr__link:hover .hdr__link-prefix,
.hdr__link--active .hdr__link-prefix,
.hdr__menu-link:hover .hdr__menu-link-prefix,
.hdr__menu-link--active .hdr__menu-link-prefix {
  color: var(--accent);
}

.hdr__right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-left: auto;
}

.hdr__action--terminal {
  border-color: color-mix(in srgb, var(--term-green) 40%, transparent);
  box-shadow: 0 0 12px color-mix(in srgb, var(--term-green) 22%, transparent);

  &:hover {
    border-color: var(--term-green);
    box-shadow:
      0 0 20px color-mix(in srgb, var(--term-green) 45%, transparent),
      var(--glow-terminal);
  }
}

// Dock de statut & horloge positionné tout à droite de l'écran (hors container centré)
.hdr__dock-right {
  position: absolute;
  top: 50%;
  right: var(--space-6);
  z-index: 52;
  display: flex;
  gap: var(--space-3);
  align-items: center;
  transform: translateY(-50%);
}

.hdr__status-badge {
  display: inline-flex;
  gap: var(--space-2);
  align-items: center;
  padding: 4px 10px;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--term-green);
  user-select: none;
  background: color-mix(in srgb, var(--term-green) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--term-green) 40%, transparent);
  border-radius: var(--radius-pill);
  box-shadow: 0 0 10px color-mix(in srgb, var(--term-green) 18%, transparent);
  transition:
    box-shadow var(--dur-base) var(--ease-standard),
    border-color var(--dur-base) var(--ease-standard);

  /* stylelint-disable-next-line property-no-vendor-prefix */
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);

  &:hover {
    border-color: var(--term-green);
    box-shadow: 0 0 16px color-mix(in srgb, var(--term-green) 35%, transparent);
  }
}

.hdr__status-dot {
  width: 7px;
  height: 7px;
  background: var(--term-green);
  border-radius: var(--radius-circle);
  box-shadow: 0 0 6px var(--term-green);
}

.hdr__dock-clock {
  margin-left: var(--space-1);
}

.hdr__burger {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-size: 20px;
  color: var(--text-strong);
  cursor: pointer;
  background: none;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);

  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }
}

.hdr__overlay {
  position: fixed;
  inset: var(--header-height) 0 0;
  z-index: 40;
  background: var(--overlay);
}

.hdr__menu {
  display: none;
}

.hdr__menu-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--space-2);
  margin-bottom: var(--space-2);
  border-bottom: 1px solid var(--border-subtle);
}

// Dégradé progressif pour le dock droit sur largeurs moyennes (évite la collision avec le CTA à 1440px)
@media (width <= 1650px) {
  .hdr__dock-right {
    display: none;
  }
}

// Sécurité : pas d'overlay en desktop (le menu mobile y est fermé par JS).
@media (width >= 901px) {
  .hdr__overlay {
    display: none;
  }
}

// ---- Responsive : < 900px (cf. kit.css) ----
@media (width <= 900px) {
  .hdr__nav,
  .hdr__dock-right,
  .hdr__right .hdr__action {
    display: none;
  }

  .hdr__burger {
    display: inline-flex;
  }

  .hdr__menu {
    position: fixed;
    inset: var(--header-height) 0 auto 0;
    z-index: 45;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    padding: var(--space-4) var(--space-6) var(--space-6);
    background: var(--surface-1);
    border-bottom: 1px solid var(--border-subtle);
    box-shadow: var(--shadow-3);
    transform: translateY(-8px);
    opacity: 0;
    visibility: hidden;
    transition:
      transform var(--dur-base) var(--ease-out),
      opacity var(--dur-base) var(--ease-standard),
      visibility var(--dur-base);
  }

  .hdr__menu--open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
}

.hdr__menu-link {
  padding: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-base);
  color: var(--text-body);
  text-decoration: none;
  border-radius: var(--radius-sm);

  &:hover {
    color: var(--text-strong);
    background: var(--surface-2);
  }

  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }
}

.hdr__menu-link--active {
  color: var(--accent);
}

.hdr__menu-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

@media (prefers-reduced-motion: reduce) {
  .hdr,
  .hdr__progress,
  .hdr__link,
  .hdr__link::after,
  .hdr__menu {
    transition: none !important;
  }

  .hdr__brand .hdr__logo,
  .hdr__brand:hover .hdr__logo {
    transform: none;
    transition: none;
  }
}
</style>
