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
              <a class="legal__link ph-no-capture" :href="`mailto:${profile.email}`">{{ profile.email }}</a>
            </p>
          </section>

          <section class="legal__section">
            <h2 class="legal__heading">2. Données collectées et finalités</h2>
            <p>Le site <strong>jouan.ovh</strong> limite la collecte des données personnelles au strict nécessaire :</p>
            <ul>
              <li>
                <strong>Formulaire de contact :</strong> lorsque vous envoyez une demande via la page
                <NuxtLink to="/contact" class="legal__link">Contact</NuxtLink>, je collecte votre <strong>nom</strong>,
                votre <strong>adresse email</strong>, le nom de votre <strong>entreprise</strong> (facultatif), la
                <strong>fréquence</strong> du processus (facultatif), ainsi que la description de votre workflow
                (<strong>processus à améliorer</strong> et <strong>fonctionnement actuel</strong>). Les champs nom,
                email, processus et fonctionnement actuel sont obligatoires pour me permettre de qualifier votre besoin
                et vous répondre.
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
              <a class="legal__link ph-no-capture" :href="`mailto:${profile.email}`">{{ profile.email }}</a
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
              <strong
                >n'utilise aucun cookie publicitaire ni aucun traceur cédé à des tiers à des fins commerciales</strong
              >.
            </p>
            <p>
              Le site recourt toutefois à une mesure d'audience respectueuse de la vie privée (PostHog Cloud EU) qui
              <strong>n'est activée qu'après votre consentement explicite</strong>, recueilli via le bandeau affiché à
              votre première visite. Le consentement de la mesure d'audience et celui du Session Replay sont séparés :
              vous pouvez accepter l'un, refuser l'autre ou retirer chaque choix à tout moment grâce au bouton « Gestion
              des cookies » présent dans le pied de page. Les signaux <strong>Do Not Track</strong> et
              <strong>Global Privacy Control</strong> désactivent la mesure sans action de votre part.
            </p>

            <h3 class="legal__subheading">Mesure d'audience et enregistrements de session (PostHog Cloud EU)</h3>
            <ul>
              <li>
                <strong>Mesure d'audience :</strong> amélioration continue de l'ergonomie du site, compréhension des
                parcours et détection d'erreurs techniques. Elle est désactivée tant que son consentement n'est pas
                accordé.
              </li>
              <li>
                <strong>Session Replay :</strong> enregistrement facultatif des interactions de navigation pour
                diagnostiquer les difficultés d'usage. Il est désactivé par défaut et nécessite un consentement
                distinct.
              </li>
              <li>
                <strong>Base légale :</strong> votre consentement (RGPD art. 6.1.a), demandé séparément pour la mesure
                d'audience et le Session Replay. Aucun événement ni enregistrement n'est activé avant l'acceptation
                correspondante.
              </li>
              <li>
                <strong>Hébergement :</strong> les données sont traitées au sein de l'Union européenne par
                <strong>PostHog Cloud EU</strong> (<ZExternalLink
                  class="legal__link"
                  href="https://eu.i.posthog.com"
                  rel="noopener"
                  >eu.i.posthog.com</ZExternalLink
                >), sous-traitant de la mesure d'audience.
              </li>
              <li>
                <strong>Données collectées :</strong> identifiant PostHog aléatoire, pages et interactions consultées,
                paramètres de campagne filtrés et, si vous l'acceptez, enregistrement de session. Les champs de saisie,
                le terminal, les liens de contact et les zones marquées sont exclus ou masqués. L'adresse IP n'est pas
                ajoutée à la charge utile cliente. Aucun nom, email, entreprise ou description de workflow n'est envoyé
                dans les événements analytics.
              </li>
              <li>
                <strong>Do Not Track et Global Privacy Control :</strong> lorsque votre navigateur transmet l'un de ces
                signaux, la mesure d'audience et les enregistrements sont automatiquement désactivés.
              </li>
              <li>
                <strong>Durée de conservation :</strong> les enregistrements de session sont conservés
                <strong>30 jours</strong> dans PostHog Cloud EU. La durée de conservation des événements de mesure
                d'audience est celle définie dans la configuration du projet PostHog ; le site ne la remplace pas par
                une promesse de 30 jours. La durée effective doit être vérifiée dans le tableau de bord avant toute
                exploitation des données.
              </li>
            </ul>
            <p>
              Ces durées sont distinctes de celle des données transmises via le
              <NuxtLink to="/contact" class="legal__link">formulaire de contact</NuxtLink>, conservées jusqu'à
              <strong>3 ans</strong> après le dernier contact (cf. section 4).
            </p>
          </section>

          <section class="legal__section">
            <h2 class="legal__heading">7. Découvrabilité par les agents IA</h2>
            <p>
              Le site publie certains contenus publics sous forme de fichiers Markdown et de fichiers
              <code>llms.txt</code> pour faciliter leur lecture par des agents compatibles. Il s'agit d'une convention
              de lisibilité machine, pas d'une promesse de classement, de citation ou d'apparition dans une réponse
              ChatGPT.
            </p>
            <ul>
              <li>
                <strong>OAI-SearchBot :</strong> autorisé dans <code>robots.txt</code> pour la découverte et la
                recherche ChatGPT. Une autorisation de crawl ne garantit ni la découverte effective d'une page ni sa
                citation.
              </li>
              <li>
                <strong>GPTBot :</strong> bloqué dans <code>robots.txt</code> pour ne pas utiliser le contenu public à
                des fins d'entraînement de modèles, selon la politique respectueuse de la vie privée retenue.
              </li>
              <li>
                <strong>ChatGPT-User :</strong> correspond à une visite initiée par une personne. Il n'est pas utilisé
                pour un crawl automatique et ne constitue pas un contrôle d'accès ; OpenAI précise que les règles
                `robots.txt` peuvent ne pas s'y appliquer.
              </li>
              <li>
                <strong>Content-Signal et Content-Usage :</strong> lorsqu'ils sont émis, ce sont des indications
                volontaires. Elles ne remplacent pas les règles OpenAI par user-agent et ne constituent ni une garantie
                de sécurité ni un contrôle d'accès.
              </li>
            </ul>
            <p>
              Les fichiers AEO ne contiennent pas les valeurs saisies dans le formulaire, les secrets, les cookies de
              session, les scripts analytics ou les composants du terminal. Les pages légales et les coordonnées
              professionnelles qui sont déjà publiques restent, elles, des contenus publics. Après consentement, la
              mesure du trafic referral conserve uniquement les paramètres UTM autorisés, notamment
              <code>utm_source=chatgpt.com</code>, sans donnée de formulaire.
            </p>
            <p>
              La politique sera évaluée sur une période de référence et une période post-déploiement d'au moins quatre
              semaines, avec les sessions referral, les conversions qualifiées, un panel de requêtes en français et les
              indicateurs Google Search Console comme contrôles. Ces mesures décrivent une tendance ; elles
              n'établissent pas de causalité ni de résultat garanti. Un changement de <code>robots.txt</code> peut
              également être pris en compte avec un délai par les moteurs.
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
  title: "Politique de confidentialité — Simon Jouan",
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

.legal__subheading {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-lg);
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
