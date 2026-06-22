<template>
  <header class="hdr">
    <div class="hdr__in">
      <NuxtLink to="/" class="hdr__brand" @click="closeMenu">
        <ZIcon name="gem" class="hdr__logo" />
        <b>jouan.ovh</b>
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
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="hdr__right">
        <CurrentTime class="hdr__clock" />
        <ZBadge tone="success" dot class="hdr__badge">Disponible</ZBadge>
        <ZButton variant="terminal" size="sm" class="hdr__action" @click="addNewTerminal">
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
        {{ item.label }}
      </NuxtLink>

      <div class="hdr__menu-actions">
        <ZButton variant="terminal" size="sm" @click="openTerminalFromMenu">
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
  { to: "/", label: "Accueil" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "À propos" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

// Lien actif : exact pour l'accueil, préfixe pour les autres (couvre /blog/[...slug]).
function isActive(to: string): boolean {
  if (to === "/") {
    return route.path === "/";
  }
  return route.path === to || route.path.startsWith(`${to}/`);
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
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKeydown);
  desktopMq?.removeEventListener("change", onDesktopChange);
  unregisterTerminalLauncher(addNewTerminal);
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css */
.hdr {
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--header-height);

  // Verre sombre translucide : surface de page (token) à 82 % d'opacité + flou.
  background: color-mix(in srgb, var(--surface-0) 82%, transparent);
  border-bottom: 1px solid var(--border-subtle);

  /* stylelint-disable-next-line property-no-vendor-prefix -- Safari : autoprefixer non câblé, préfixe manuel requis */
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
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
  gap: var(--space-2);
  text-decoration: none;

  .hdr__logo {
    font-size: 24px;
    color: var(--accent);
  }

  b {
    font-family: var(--font-mono);
    font-size: var(--fs-md);
    font-weight: var(--fw-bold);
    color: var(--text-strong);
  }
}

.hdr__nav {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  min-width: 0; // autorise la nav à rétrécir plutôt que de pousser l'overflow
  margin-left: var(--space-4);
}

.hdr__link {
  padding: var(--space-2) var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition:
    color var(--dur-fast) var(--ease-standard),
    background var(--dur-fast) var(--ease-standard);

  &:hover {
    color: var(--text-strong);
    background: var(--surface-2);
  }
}

.hdr__link--active {
  color: var(--accent);
}

.hdr__right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-left: auto;
}

.hdr__clock {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--text-muted);
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
    outline: none;
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

// ---- Dégradé progressif (tablette) pour éviter l'overflow du header
// avant que le burger ne prenne le relais (< 900px). ----
@media (width <= 1100px) {
  .hdr__clock {
    display: none;
  }
}

@media (width <= 1000px) {
  .hdr__badge {
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
  .hdr__clock,
  .hdr__badge,
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
  .hdr__link,
  .hdr__menu {
    transition: none;
  }
}
</style>
