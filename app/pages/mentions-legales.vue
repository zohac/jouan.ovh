<template>
  <main class="legal">
    <section class="section">
      <div class="container container--legal">
        <p class="eyebrow"><span aria-hidden="true">// </span>mentions</p>
        <h1 class="legal__title">Mentions légales</h1>
        <p class="prose legal__lead">
          Informations légales et mentions obligatoires relatives à l'édition et à l'hébergement du site
          <strong>jouan.ovh</strong> (conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans
          l'économie numérique).
        </p>

        <div class="prose legal__content">
          <section class="legal__section">
            <h2 class="legal__heading">1. Éditeur du site</h2>
            <p>
              Le site <strong>jouan.ovh</strong> est édité par :<br />
              <strong>{{ profile.name }}</strong
              ><br />
              Activité : {{ profile.role }}<br />
              Localisation : {{ profile.city }}<br />
              Courrier électronique :
              <a class="legal__link ph-no-capture" :href="`mailto:${profile.email}`">{{ profile.email }}</a
              ><br />
              Profil freelance (Malt) :
              <ZExternalLink class="legal__link" href="https://www.malt.fr/profile/simonjouan" rel="noopener"
                >malt.fr/profile/simonjouan</ZExternalLink
              >
            </p>
          </section>

          <section class="legal__section">
            <h2 class="legal__heading">2. Directeur de la publication</h2>
            <p>
              Le directeur de la publication et responsable de la rédaction est <strong>{{ profile.name }}</strong
              >.
            </p>
          </section>

          <section class="legal__section">
            <h2 class="legal__heading">3. Hébergement du site</h2>
            <p>
              Le site est hébergé sous forme statique par :<br />
              <strong>GitHub, Inc.</strong> (via le service GitHub Pages)<br />
              Adresse : 88 Colin P Kelly Jr St, San Francisco, CA 94107, États-Unis<br />
              Site web :
              <ZExternalLink class="legal__link" href="https://pages.github.com" rel="noopener"
                >pages.github.com</ZExternalLink
              >
            </p>
            <p>
              Le nom de domaine <strong>jouan.ovh</strong> est enregistré auprès de :<br />
              <strong>OVHcloud SAS</strong><br />
              Adresse : 2 rue Kellermann, 59100 Roubaix, France<br />
              Site web :
              <ZExternalLink class="legal__link" href="https://www.ovhcloud.com" rel="noopener"
                >ovhcloud.com</ZExternalLink
              >
            </p>
          </section>

          <section class="legal__section">
            <h2 class="legal__heading">4. Propriété intellectuelle</h2>
            <p>
              L'ensemble des contenus présents sur ce site (textes, articles, visuels, charte graphique, codes sources
              du design system) relèvent des législations françaises et internationales sur le droit d'auteur et la
              propriété intellectuelle.
            </p>
            <p>
              Tous les droits de reproduction sont réservés. Toute reproduction, représentation, modification ou
              diffusion intégrale ou partielle de ces éléments, sans l'accord exprès et écrit de l'auteur, est interdite
              et constituerait une contrefaçon sanctionnée par le Code de la propriété intellectuelle.
            </p>
          </section>

          <section class="legal__section">
            <h2 class="legal__heading">5. Données personnelles</h2>
            <p>
              Pour toute information relative à la collecte, au traitement et à la protection de vos données
              personnelles (notamment via le formulaire de contact), ainsi qu'aux modalités d'exercice de vos droits
              (accès, rectification, effacement), veuillez consulter la
              <NuxtLink to="/confidentialite" class="legal__link">politique de confidentialité</NuxtLink>.
            </p>
          </section>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { SITE } from "~/data/site";
import { usePageSeo } from "~/composables/usePageSeo";

const profile = SITE.profile;

usePageSeo({
  title: "Mentions légales — Simon Jouan",
  description: "Mentions légales, informations éditeur et hébergement du site jouan.ovh — Simon Jouan.",
  path: "/mentions-legales",
  type: "website",
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention BEM DS */
.legal {
  display: block;
}

.container--legal {
  max-width: var(--container-lg);
}

.legal__title {
  margin-bottom: var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--fs-4xl);
  font-weight: var(--fw-light);
  line-height: var(--lh-tight);
  color: var(--text-strong);
}

.legal__lead {
  max-width: 65ch;
  margin-bottom: var(--space-10);
  font-size: var(--fs-lg);
  color: var(--text-muted);
}

.legal__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.legal__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);

  p {
    margin: 0;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding-left: var(--space-5);
    margin: 0;
  }
}

.legal__heading {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-xl);
  font-weight: var(--fw-medium);
  color: var(--text-strong);
}

.legal__link {
  color: var(--term-blue);
  text-decoration: underline;

  &:hover {
    color: var(--accent);
  }

  &:focus-visible {
    outline: 2px solid transparent;
    outline-offset: 2px;
    border-radius: var(--radius-xs);
    box-shadow: var(--ring-accent);
  }
}

@media (width <= 640px) {
  .legal__title {
    font-size: var(--fs-3xl);
  }
}
</style>
