<template>
  <footer class="ftr">
    <div class="ftr__container">
      <div class="ftr__in">
        <div class="ftr__brand-col">
          <NuxtLink to="/" class="ftr__brand">
            <ZIcon name="gem" class="ftr__logo" />
            <b>jouan.ovh</b>
          </NuxtLink>
          <p class="ftr__tagline">Développeur web freelance. Valognes, France.</p>
        </div>

        <nav class="ftr__col" aria-label="Navigation du pied de page">
          <h2 class="ftr__title">// Navigation</h2>
          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="ftr__link">{{ item.label }}</NuxtLink>
        </nav>

        <div class="ftr__col">
          <h2 class="ftr__title">// Projets</h2>
          <ZExternalLink
            v-for="project in projects"
            :key="project.url"
            :href="project.url"
            rel="noopener noreferrer"
            class="ftr__link"
            >{{ project.name }}</ZExternalLink
          >
        </div>

        <div class="ftr__col">
          <h2 class="ftr__title">// Réseaux</h2>
          <LinkListComponent />
        </div>
      </div>

      <div class="ftr__bottom">
        <span>© {{ year }} Simon Jouan — jouan.ovh</span>
        <span class="ftr__term">anon.@jouan.ovh:~$ <span class="ftr__cmd">echo "merci de votre visite"</span></span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import LinkListComponent from "~/components/LinkListComponent.vue";
import { SITE } from "~/data/site";

const navItems = [
  { to: "/", label: "Accueil" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "À propos" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

// Projets — source unique `app/data/site.ts` (le footer n'affiche que nom + URL).
const projects = SITE.projects;

const year = new Date().getFullYear();
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis Footer.jsx/kit.css */
.ftr {
  margin-top: auto;
  background: var(--surface-1);
  border-top: 1px solid var(--border-subtle);
  padding: var(--space-12) 0 var(--space-8);
}

.ftr__container {
  width: 100%;
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.ftr__in {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
  align-items: flex-start;
  justify-content: space-between;
}

.ftr__brand-col {
  max-width: 300px;
}

.ftr__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
  text-decoration: none;

  .ftr__logo {
    font-size: 22px;
    color: var(--accent);
  }

  b {
    font-family: var(--font-mono);
    font-size: var(--fs-md);
    font-weight: var(--fw-bold);
    color: var(--text-strong);
  }

  // Lien focusable (logo + nom) : anneau DS cohérent avec le reste du châssis.
  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 2px;
    border-radius: var(--radius-sm);
    box-shadow: var(--ring-accent);
  }
}

.ftr__tagline {
  margin: 0;
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.ftr__col {
  display: flex;
  flex-direction: column;
}

.ftr__title {
  margin: 0 0 var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: var(--fw-regular);
  letter-spacing: var(--ls-wider);
  text-transform: uppercase;
  color: var(--text-muted);
}

.ftr__link {
  display: block;
  padding: var(--space-1) 0;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-body);
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease-standard);

  &:hover {
    color: var(--accent);
  }

  // Anneau de focus DS (les liens du footer n'avaient que l'outline UA par défaut).
  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 2px;
    border-radius: var(--radius-xs);
    box-shadow: var(--ring-accent);
  }
}

.ftr__bottom {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  justify-content: space-between;
  margin-top: var(--space-8);
  padding-top: var(--space-5);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);

  // Contraste (story 9.2) : --text-faint (~3:1 sur la surface footer) → --text-muted
  // pour une ligne de copyright lisible (≥ 4.5:1). Token, pas de couleur en dur.
  color: var(--text-muted);
  border-top: 1px solid var(--border-subtle);
}

.ftr__cmd {
  color: var(--term-green);
}

@media (prefers-reduced-motion: reduce) {
  .ftr__link {
    transition: none;
  }
}
</style>
