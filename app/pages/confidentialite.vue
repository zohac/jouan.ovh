<template>
  <main class="legal">
    <section class="section">
      <div class="container container--legal">
        <p class="eyebrow"><span aria-hidden="true">// </span>confidentialité</p>
        <h1 class="legal__title">Politique de confidentialité</h1>
        <p class="prose legal__lead">
          Cette politique détaille la façon dont vos données personnelles sont traitées lors de votre navigation sur
          <strong>jouan.ovh</strong> et lors de l'utilisation du formulaire de contact.
        </p>

        <div class="prose legal__content">
          <section class="legal__section">
            <h2 class="legal__heading">1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données personnelles collectées sur ce site est :<br />
              <strong>{{ profile.name }}</strong
              ><br />
              {{ profile.role }} — {{ profile.city }}.<br />
              Contact électronique :
              <a class="legal__link" :href="`mailto:${profile.email}`">{{ profile.email }}</a>
            </p>
          </section>

          <section class="legal__section">
            <h2 class="legal__heading">2. Données collectées et finalités</h2>
            <p>Le site <strong>jouan.ovh</strong> limite la collecte des données personnelles au strict nécessaire :</p>
            <ul>
              <li>
                <strong>Formulaire de contact :</strong> lorsque vous envoyez un message via la page
                <NuxtLink to="/contact" class="legal__link">Contact</NuxtLink>, je collecte votre <strong>nom</strong>,
                votre <strong>adresse email</strong>, ainsi que le <strong>sujet</strong> (facultatif) et le
                <strong>contenu de votre message</strong>. Les champs nom, email et message sont obligatoires pour me
                permettre de vous répondre.
              </li>
              <li>
                <strong>Finalité :</strong> ces informations sont utilisées exclusivement pour traiter votre demande, y
                répondre et assurer le suivi de nos échanges professionnels.
              </li>
              <li>
                <strong>Base légale (RGPD art. 6.1.a &amp; 6.1.b) :</strong> le traitement repose sur votre démarche
                volontaire lors de l'envoi du formulaire (consentement) et sur l'exécution de mesures précontractuelles
                en vue d'une éventuelle collaboration.
              </li>
            </ul>
          </section>

          <section class="legal__section">
            <h2 class="legal__heading">3. Sous-traitance et transfert de données</h2>
            <p>
              Le formulaire de contact s'appuie sur le service tiers <strong>Web3Forms</strong> pour acheminer les
              messages vers ma boîte de messagerie électronique :
            </p>
            <ul>
              <li>
                <strong>Sous-traitant :</strong> Web3Forms (<ZExternalLink
                  class="legal__link"
                  href="https://web3forms.com"
                  rel="noopener"
                  >web3forms.com</ZExternalLink
                >).
              </li>
              <li>
                <strong>Rôle &amp; localisation :</strong> transmission sécurisée des données de formulaire sans
                stockage persistant sur un serveur applicatif dédié propre au site. L'infrastructure de routage de
                Web3Forms est hébergée aux États-Unis (AWS us-east).
              </li>
              <li>
                <strong>Mesures de sécurité :</strong> les flux sont intégralement chiffrés en transit (HTTPS / TLS).
              </li>
            </ul>
            <p>
              Aucune donnée personnelle n'est vendue, louée ou cédée à des tiers à des fins commerciales ou
              publicitaires.
            </p>
          </section>

          <section class="legal__section">
            <h2 class="legal__heading">4. Durée de conservation</h2>
            <p>
              Les données transmises par le formulaire de contact sont conservées pendant le temps nécessaire au
              traitement de votre demande et aux échanges commerciaux qui en découlent, dans la limite maximale de
              <strong>3 ans</strong> après le dernier contact émanant de votre part, sauf obligation légale ou
              réglementaire contraire.
            </p>
          </section>

          <section class="legal__section">
            <h2 class="legal__heading">5. Vos droits (RGPD)</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et
              Libertés, vous disposez des droits suivants concernant vos données à caractère personnel :
            </p>
            <ul>
              <li>
                <strong>Droit de retrait du consentement :</strong> vous pouvez à tout moment retirer votre consentement
                au traitement de vos données.
              </li>
              <li>
                <strong>Droit d'accès :</strong> obtenir la confirmation que des données vous concernant sont traitées
                et en obtenir une copie.
              </li>
              <li>
                <strong>Droit de rectification :</strong> demander la modification de vos données inexactes ou
                incomplètes.
              </li>
              <li>
                <strong>Droit à l'effacement :</strong> demander la suppression de vos données personnelles (« droit à
                l'oubli »).
              </li>
              <li>
                <strong>Droit à la limitation du traitement :</strong> demander le gel temporaire du traitement de
                certaines données.
              </li>
              <li>
                <strong>Droit d'opposition :</strong> vous opposer à tout moment au traitement de vos données pour
                motifs légitimes.
              </li>
              <li>
                <strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré, couramment
                utilisé et lisible par machine.
              </li>
            </ul>
            <p>
              Pour exercer ces droits, vous pouvez me contacter directement par email à :
              <a class="legal__link" :href="`mailto:${profile.email}`">{{ profile.email }}</a
              >.
            </p>
            <p>
              Si vous estimez, après m'avoir contacté, que vos droits ne sont pas respectés, vous disposez du droit
              d'introduire une réclamation auprès de la <strong>CNIL</strong> (Commission Nationale de l'Informatique et
              des Libertés —
              <ZExternalLink class="legal__link" href="https://www.cnil.fr" rel="noopener">cnil.fr</ZExternalLink>).
            </p>
          </section>

          <section class="legal__section">
            <h2 class="legal__heading">6. Cookies et traceurs</h2>
            <p>
              Le site <strong>jouan.ovh</strong> est un site statique hébergé sur GitHub Pages. Il
              <strong>n'utilise aucun cookie traceur, publicitaire ou d'analyse d'audience tiers</strong> nécessitant un
              consentement préalable au sens des recommandations de la CNIL.
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
  title: "Politique de confidentialité — jouan.ovh",
  description:
    "Politique de confidentialité et protection des données personnelles (RGPD) du site jouan.ovh — Simon Jouan.",
  path: "/confidentialite",
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
