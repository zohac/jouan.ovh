<template>
  <main class="home">
    <section class="hero hero__grad">
      <div class="hero__in container">
        <div class="hero__grid">
          <!-- Colonne gauche : accroche, CTA, tags -->
          <div class="anim hero__text">
            <p class="eyebrow">// développeur web freelance</p>
            <h1 class="hero__title">Du code <em>sur-mesure</em>,<br />de l'IA <em>utile</em>.</h1>
            <p class="hero__sub">{{ tagline }}</p>
            <div class="hero__cta">
              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
                Démarrer un projet
                <template #iconRight><ZIcon name="arrow" /></template>
              </ZButton>
              <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir les services </ZButton>
            </div>
            <div class="hero__tags">
              <ZTag v-for="tag in tags" :key="tag">{{ tag }}</ZTag>
            </div>
          </div>

          <!-- Colonne droite : fenêtre terminal décorative (statique) -->
          <div class="anim hero__term-col">
            <div class="hero-term">
              <div class="hero-term__bar">
                <span class="hero-term__dots" aria-hidden="true">
                  <span class="hero-term__dot hero-term__dot--close" />
                  <span class="hero-term__dot hero-term__dot--min" />
                  <span class="hero-term__dot hero-term__dot--max" />
                </span>
                <span class="hero-term__title">anon.@jouan.ovh: ~</span>
              </div>

              <div class="hero-term__body">
                <template v-for="row in terminalRows" :key="row.id">
                  <p class="hero-term__line" aria-hidden="true">
                    <span class="prm"
                      ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
                      ><span class="prm__dir">~</span><span class="prm__sep">$ </span
                      ><span class="prm__cmd">{{ row.cmd }}</span></span
                    >
                  </p>
                  <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
                </template>

                <button
                  type="button"
                  class="hero-term__open"
                  aria-label="Ouvrir le terminal interactif"
                  @click="openTerminal"
                >
                  <span class="prm"
                    ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
                    ><span class="prm__dir">~</span><span class="prm__sep">$ </span><span class="prm__cmd">help</span
                    ><span class="prm__caret" aria-hidden="true"
                  /></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Page d'accueil — hero Terminal (A). Porté de Home.jsx (fonction HeroTerminal)
// du UI kit : recréation Vue 3 + tokens (aucune copie JSX). Dark-first, accent
// orange sur le titre et le CTA primaire. (Story 3.1)
import { NuxtLink } from "#components";
import { useTerminal } from "~/composables/useTerminal";

// Contenu repris de data.js (window.SITE) — 1re personne, vouvoiement, pas d'emoji.
const tagline = "Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils.";
const tags = ["php", "symfony", "wordpress", "nest.js", "nuxt.js"];

// Lignes du terminal décoratif, fidèles à HeroTerminal (Home.jsx). Codées en dur
// côté template (pas de chiffres/projets inventés : stats & projets = stories 3.2 / 3.3).
// `id` = clé v-for stable (indépendante du contenu affiché), garantie unique.
const terminalRows = [
  { id: "line-1", cmd: "whoami", out: "Simon Jouan — Développeur web freelance", tone: "ink" },
  { id: "line-2", cmd: "cat stack.txt", out: "PHP/Symfony · WordPress · Node/Nest · Nuxt", tone: "blue" },
  { id: "line-3", cmd: "ls ~/projets", out: "keova.app/   patio-conseil.fr/", tone: "green" },
];

// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le
// header). No-op tant qu'aucun terminal n'est disponible (prerender). La
// restylisation du terminal lui-même relève d'Epic 8.
const { open: openTerminal } = useTerminal();
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Home.jsx */
.home {
  display: block;
}

// Entrée one-shot (pas une boucle) — keyframe globale fade-rise (_root.scss).
.anim {
  animation: fade-rise var(--dur-slow) var(--ease-out) both;
}

.hero__term-col {
  // Décalage d'entrée fidèle à Home.jsx (animationDelay 80ms) — pas de token motion
  // équivalent (les --dur-* couvrent les transitions, pas les délais d'orchestration).
  animation-delay: 80ms;
}

// ---- Hero (porté de kit.css : .hero, .hero__grad, .hero__in, .hero__grid…) ----
.hero {
  position: relative;
  overflow: hidden;
}

.hero__grad {
  // Dégradés décoratifs dérivés des tokens (orange accent + aubergine saturé) via
  // color-mix — pas de valeur HSL en dur. Base = fond de page. Fidèle à kit.css
  // (.hero__grad : aubergine ~60 % de saturation → token --aubergine-vivid).
  background:
    radial-gradient(900px 500px at 78% -10%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%),
    radial-gradient(
      700px 500px at 0% 110%,
      color-mix(in srgb, var(--aubergine-vivid) 28%, transparent),
      transparent 60%
    ),
    var(--bg-page);
}

.hero__in {
  position: relative;
  z-index: 1;

  // padding-block uniquement : le gutter horizontal vient de .container
  // (longhands distincts → pas de conflit de shorthand entre les deux classes).
  padding-block: var(--space-20);
}

.hero__grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: var(--space-12);
  align-items: center;
}

.container {
  width: 100%;
  max-width: var(--container-xl);
  margin: 0 auto;
  padding-inline: var(--space-6);
}

// ---- Colonne texte ----
.eyebrow {
  margin: 0 0 var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: var(--ls-wider);
  text-transform: uppercase;
  color: var(--accent);
}

.hero__title {
  font-family: var(--font-mono);
  font-size: var(--fs-6xl);
  font-weight: var(--fw-light);
  letter-spacing: var(--ls-tight);
  color: var(--text-strong);

  em {
    font-style: normal;
    color: var(--accent);
  }
}

.hero__sub {
  max-width: 46ch;
  margin: var(--space-5) 0 var(--space-6);
  font-family: var(--font-sans);
  font-size: var(--fs-lg);
  line-height: var(--lh-relaxed);
  color: var(--text-body);
}

.hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.hero__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

// ---- Fenêtre terminal décorative (porté de TerminalWindow.jsx / Prompt.jsx) ----
// Dérogation tokens-only assumée : les dimensions fixes du chrome (hauteur min
// de fenêtre 300px, barre 30px, pastilles 13px / gap 7px) reproduisent à
// l'identique la spec du composant DS et n'ont pas de token d'espacement
// équivalent (échelle base-4). Couleurs, rayons et ombres restent en tokens.
// `min-height` (et non `height`) : la fenêtre s'étend au contenu — pas de
// scrollbar parasite si le rendu mono dépasse de quelques px.
.hero-term {
  display: flex;
  flex-direction: column;
  min-height: 300px;
  overflow: hidden;
  border: 1px solid var(--accent-2-soft);
  border-radius: var(--radius-sm);
  box-shadow: var(--glow-terminal);
}

.hero-term__bar {
  position: relative;
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--space-2);
  height: 30px;
  padding: 0 var(--space-3);
  background: var(--aubergine-black);
}

.hero-term__dots {
  display: flex;
  align-items: center;
  gap: 7px;
}

.hero-term__dot {
  width: 13px;
  height: 13px;
  border-radius: var(--radius-circle);
}

.hero-term__dot--close {
  background: var(--term-red);
}

.hero-term__dot--min {
  background: var(--term-yellow);
}

.hero-term__dot--max {
  background: var(--term-green);
}

.hero-term__title {
  position: absolute;
  inset: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: var(--ls-wide);
  color: var(--text-muted);
  text-align: center;
  pointer-events: none;
}

.hero-term__body {
  flex: 1;
  min-height: 0;
  padding: var(--space-4);
  overflow: auto;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  line-height: var(--lh-snug);
  color: var(--ink-1);
  background: var(--bg-terminal);
  overflow-wrap: break-word;
}

@supports (backdrop-filter: blur(5px)) {
  .hero-term__body {
    background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
    backdrop-filter: blur(5px);
  }
}

.hero-term__line {
  margin: 0;
}

.hero-term__out {
  margin: 0 0 var(--space-4);
}

.hero-term__out--ink {
  color: var(--ink-1);
}

.hero-term__out--blue {
  color: var(--term-blue);
}

.hero-term__out--green {
  color: var(--term-green);
}

// Ligne « help » cliquable → ouvre l'easter-egg terminal (bouton natif = clavier OK).
.hero-term__open {
  display: block;
  width: 100%;
  padding: 0;
  font: inherit;
  text-align: left;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: var(--radius-xs);

  &:focus-visible {
    outline: none;
    box-shadow: var(--ring-accent);
  }
}

// ---- Prompt (porté de Prompt.jsx : couleurs héritage) ----
.prm {
  font-family: var(--font-mono);
}

.prm__user {
  font-weight: var(--fw-bold);
  color: var(--prompt);
}

.prm__sep {
  color: var(--ink-1);
}

.prm__dir {
  font-weight: var(--fw-bold);
  color: var(--term-blue);
}

.prm__cmd {
  color: var(--ink-1);
}

// Caret : dimensions en em reprises telles quelles de Prompt.jsx (glyphe
// proportionnel à la police) — pas de token équivalent pour un curseur.
.prm__caret {
  display: inline-block;
  width: 0.55em;
  height: 1.05em;
  margin-left: 1px;
  vertical-align: text-bottom;
  background: var(--prompt);

  // Seule animation en boucle de l'UI (caret terminal). Keyframe globale (_root.scss).
  animation: caret-blink 1s steps(1) infinite;
}

// ---- Responsive (cf. kit.css @media max-width: 900px) ----
@media (width <= 900px) {
  .hero__grid {
    grid-template-columns: 1fr;
  }

  .hero__title {
    font-size: var(--fs-4xl);
  }
}

@media (prefers-reduced-motion: reduce) {
  .anim,
  .prm__caret {
    animation: none;
  }
}
</style>
