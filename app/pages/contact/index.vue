<template>
  <main class="contact">
    <section class="section">
      <div class="container">
        <div class="contact__grid">
          <!-- Colonne gauche : en-tête + formulaire (story 7.1 / story 12.6) -->
          <div class="contact__main">
            <p class="eyebrow"><span aria-hidden="true">// </span>contact</p>
            <h1 class="contact__title">Parlons de votre workflow</h1>
            <p class="prose contact__intro">
              Décrivez-moi simplement le processus qui vous ralentit ou vous fait perdre du temps au quotidien. Je vous
              réponds sous 48h avec une première analyse de faisabilité.
            </p>

            <!-- État « envoyé » : carte accent + ligne mono verte. role="status" + focus
                 programmatique (tabindex -1) → annonce fiable aux lecteurs d'écran. -->
            <ZCard v-if="sent" ref="sentCard" accent class="contact__sent" role="status" tabindex="-1">
              <p class="contact__sent-line"><span aria-hidden="true">✓</span> Message envoyé</p>
              <p class="prose contact__sent-text">
                Merci ! Je vous réponds sous 48h avec une première analyse de faisabilité à votre adresse.
              </p>
            </ZCard>

            <!-- Formulaire — envoi via Web3Forms (service sans serveur, clé en env). Validation
                 front d'abord ; `novalidate` pour afficher nos messages FR (et non les bulles
                 natives). Compatible site statique : le fetch ne tourne qu'au clic, côté client. -->
            <form v-else ref="formRef" class="contact__form" novalidate @submit.prevent="onSubmit">
              <!-- Honeypot anti-spam : hors flux visuel et hors tabulation ; rempli = bot. -->
              <div class="contact__hp" aria-hidden="true">
                <label>
                  Ne remplissez pas ce champ
                  <input v-model="honeypot" type="text" tabindex="-1" autocomplete="off" />
                </label>
              </div>

              <div class="contact__row">
                <ZInput
                  v-model="form.name"
                  label="Nom"
                  placeholder="Votre nom"
                  required
                  autocomplete="name"
                  :error="Boolean(errors.name)"
                  :hint="errors.name"
                />
                <ZInput
                  v-model="form.email"
                  label="Email professionnel"
                  type="email"
                  placeholder="vous@entreprise.com"
                  required
                  autocomplete="email"
                  :error="Boolean(errors.email)"
                  :hint="errors.email"
                />
              </div>

              <div class="contact__row">
                <ZInput
                  v-model="form.company"
                  label="Entreprise"
                  placeholder="Nom de votre structure"
                  autocomplete="organization"
                />
                <ZInput
                  v-model="form.frequency"
                  label="Combien de fois ce process se répète-t-il ?"
                  placeholder="Ex : quotidien, 10x par semaine…"
                  autocomplete="off"
                />
              </div>

              <ZInput
                v-model="form.workflow"
                label="Quel processus souhaitez-vous améliorer ?"
                placeholder="Ex : qualification des leads, devis BTP, extraction de factures…"
                required
                autocomplete="off"
                :error="Boolean(errors.workflow)"
                :hint="errors.workflow"
              />

              <ZInput
                v-model="form.currentState"
                label="Comment fonctionne-t-il aujourd’hui ?"
                multiline
                placeholder="Outils utilisés, étapes manuelles, qui intervient, où l’information se perd…"
                required
                :error="Boolean(errors.currentState)"
                :hint="errors.currentState"
              />

              <!-- Erreur d'envoi réseau (distincte des erreurs de validation par champ). -->
              <p v-if="submitError" class="contact__error" role="alert">{{ submitError }}</p>

              <div>
                <ZButton type="submit" variant="primary" size="lg" :disabled="sending">
                  {{ sending ? "Envoi en cours…" : "Décrire mon workflow" }}
                  <template #iconRight><ZIcon name="arrow" /></template>
                </ZButton>
              </div>

              <p class="contact__rgpd">
                En envoyant ce formulaire, vos coordonnées et la description de votre workflow sont transmises via
                Web3Forms à seule fin de qualifier votre besoin et vous répondre. Consultez la
                <NuxtLink to="/confidentialite" class="contact__rgpd-link">politique de confidentialité</NuxtLink>.
              </p>
            </form>
          </div>

          <!-- Colonne droite (story 7.2) : carte infos + carte CTA terminal + hexagones sociaux -->
          <div class="contact__info">
            <h2 class="screen-reader-text">Coordonnées et terminal</h2>
            <!-- Carte infos : email / localisation / disponibilité -->
            <ZCard class="contact__infocard">
              <dl class="contact__infolist">
                <div class="infoitem">
                  <dt class="infoitem__k"><span aria-hidden="true">// </span>email</dt>
                  <dd class="infoitem__v">
                    <a class="contact__email" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
                  </dd>
                </div>
                <div class="infoitem">
                  <dt class="infoitem__k"><span aria-hidden="true">// </span>localisation</dt>
                  <dd class="infoitem__v">{{ contact.city }}</dd>
                </div>
                <div class="infoitem">
                  <dt class="infoitem__k"><span aria-hidden="true">// </span>disponibilité</dt>
                  <dd class="infoitem__v">
                    <div class="contact__avail"><ZBadge tone="success" dot>Ouvert aux missions freelance</ZBadge></div>
                  </dd>
                </div>
              </dl>
            </ZCard>

            <!-- Carte d'accès carte de visite digitale & QR Code -->
            <ZCard class="contact__cardcta">
              <p class="contact__cardcta-eyebrow"><span aria-hidden="true">// </span>carte de visite digitale</p>
              <p class="prose contact__cardcta-text">Fiche contact prête à scanner avec QR code vCard.</p>
              <ZButton :as="NuxtLink" to="/contact/card" variant="secondary" size="sm">
                <template #icon><ZIcon name="qr" /></template>
                Carte de visite &amp; QR Code
              </ZButton>
            </ZCard>

            <!-- Carte CTA terminal : ouvre l'easter-egg via le lanceur partagé (useTerminal) -->
            <ZCard class="contact__term">
              <!-- Prompt décoratif (flavor terminal) : aria-hidden — le bouton + l'invite portent le sens. -->
              <p class="contact__prompt" aria-hidden="true">
                anon.@jouan.ovh:~$ <span class="contact__prompt-cmd">./contact</span>
              </p>
              <p class="prose contact__term-text">Vous préférez la ligne de commande ? Ouvrez le terminal.</p>
              <ZButton variant="terminal" size="sm" aria-haspopup="dialog" @click="openTerminal">
                <template #icon><ZIcon name="terminal" /></template>
                Ouvrir le terminal
              </ZButton>
            </ZCard>

            <!-- Hexagones sociaux (composant partagé avec le footer) -->
            <LinkListComponent />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Page Contact — colonne gauche : en-tête + formulaire (story 7.1, envoi Web3Forms,
// service tiers SANS serveur). Colonne droite : infos + CTA terminal + socials (story 7.2).
import { nextTick, reactive, ref, watch } from "vue";
import { NuxtLink } from "#components";
import { SITE } from "~/data/site";

// Infos de contact — source unique `app/data/site.ts`.
const contact = SITE.profile;

// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le header).
// no-op au prerender (aucun lanceur) → prerender-safe ; ouvre le terminal côté client.
const { open: openTerminal } = useTerminal();

interface ContactForm {
  name: string;
  email: string;
  company?: string;
  workflow: string;
  currentState: string;
  frequency?: string;
}

interface Web3FormsResponse {
  success: boolean;
  message: string;
}

const ERROR_MESSAGE = `L'envoi a échoué. Réessayez, ou écrivez-moi directement à ${SITE.profile.email}.`;

// Clé Web3Forms injectée par l'env (NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY) — jamais en dur.
const accessKey = useRuntimeConfig().public.web3formsAccessKey;

const form = reactive<ContactForm>({
  name: "",
  email: "",
  company: "",
  workflow: "",
  currentState: "",
  frequency: "",
});

// Message d'erreur par champ requis ("" = valide). Rendu sous le champ via ZInput.
const errors = reactive({
  name: "",
  email: "",
  workflow: "",
  currentState: "",
});

const honeypot = ref("");
const sent = ref(false);
const sending = ref(false);
const submitError = ref("");
// Passe à true au 1er envoi → active la re-validation live (les erreurs se lèvent à la saisie).
const submitted = ref(false);

const formRef = ref<HTMLFormElement | null>(null);
const sentCard = ref<{ $el: HTMLElement } | null>(null);

// Format email volontairement permissif (un @, un point dans le domaine) : on évite les
// faux négatifs d'une regex stricte ; Web3Forms revalide côté service.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Nettoie les espaces et les caractères zero-width / invisibles (ex: \u200B)
function cleanInput(val?: string): string {
  return (val ?? "").replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
}

function validate(): boolean {
  const name = cleanInput(form.name);
  const email = cleanInput(form.email);
  const workflow = cleanInput(form.workflow);
  const currentState = cleanInput(form.currentState);

  errors.name = name ? "" : "Votre nom est requis.";
  errors.email = !email ? "Votre email est requis." : EMAIL_RE.test(email) ? "" : "Cet email ne semble pas valide.";
  errors.workflow = workflow ? "" : "Veuillez préciser le processus à améliorer.";
  errors.currentState = currentState ? "" : "Veuillez décrire le fonctionnement actuel.";
  return !errors.name && !errors.email && !errors.workflow && !errors.currentState;
}

// Après un 1er envoi, re-valider à la saisie : corriger un champ lève son message d'erreur
// sans attendre une nouvelle soumission.
watch(
  () => [form.name, form.email, form.workflow, form.currentState],
  () => {
    if (submitted.value) {
      validate();
    }
  },
);

async function focusSentCard(): Promise<void> {
  await nextTick();
  sentCard.value?.$el?.focus();
}

async function onSubmit(): Promise<void> {
  submitted.value = true;
  submitError.value = "";

  if (!validate()) {
    // a11y : amener le focus sur le 1er champ invalide.
    await nextTick();
    formRef.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    return;
  }

  // Honeypot rempli = bot : on n'envoie rien et on affiche l'état de succès.
  if (honeypot.value) {
    sent.value = true;
    await focusSentCard();
    return;
  }

  sending.value = true;
  try {
    const name = cleanInput(form.name);
    const email = cleanInput(form.email);
    const company = cleanInput(form.company);
    const workflow = cleanInput(form.workflow);
    const currentState = cleanInput(form.currentState);
    const frequency = cleanInput(form.frequency);
    const workflowSubject = workflow.slice(0, 80);

    const res = await $fetch<Web3FormsResponse>("https://api.web3forms.com/submit", {
      method: "POST",
      body: {
        access_key: accessKey,
        name,
        email,
        company,
        subject: `Qualification de workflow : ${workflowSubject || "Nouveau projet"}`,
        workflow,
        current_state: currentState,
        frequency,
        message: `Processus à améliorer : ${workflow}\n\nFonctionnement actuel :\n${currentState}\n\nFréquence : ${frequency || "Non spécifiée"}\nEntreprise : ${company || "Non spécifiée"}`,
        botcheck: "",
      },
    });
    if (res.success) {
      sent.value = true;
      await focusSentCard();
    } else {
      submitError.value = ERROR_MESSAGE;
    }
  } catch {
    submitError.value = ERROR_MESSAGE;
  } finally {
    sending.value = false;
  }
}

const siteUrl = useSiteUrl();

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact — Simon Jouan",
  description:
    "Parlons de votre workflow : décrivez le processus métier qui vous ralentit pour identifier les opportunités d'automatisation et d'agents IA adaptés.",
  url: `${siteUrl}/contact`,
  mainEntity: {
    "@type": "Person",
    name: SITE.profile.name,
    email: SITE.profile.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.profile.city,
      addressCountry: "FR",
    },
  },
};

usePageSeo({
  title: "Contact — Simon Jouan",
  description:
    "Parlons de votre workflow : décrivez le processus métier qui vous ralentit pour identifier les opportunités d'automatisation et d'agents IA adaptés.",
  path: "/contact",
  image: "/images/portrait.jpeg",
  type: "website",
  jsonLd: contactJsonLd,
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / Contact.jsx */
// .section / .container / .eyebrow / .prose sont des primitives de layout globales
// (app/assets/scss/base/_layout.scss) — non redéclarées ici.
.contact {
  display: block;
}

// ---- Grille (porté de kit.css : .contact__grid 1fr / 0.8fr) ----
.contact__grid {
  display: grid;
  grid-template-columns: 1fr 0.8fr;
  gap: var(--space-12);
  align-items: start;
}

// ---- En-tête (porté de Contact.jsx) ----
.contact__title {
  margin-bottom: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-4xl);
  font-weight: var(--fw-light);
  line-height: var(--lh-tight);
  color: var(--text-strong);
}

.contact__intro {
  max-width: 48ch;
  margin-bottom: var(--space-8);
  color: var(--text-muted);
}

// ---- Formulaire (porté de kit.css : .contact__form) ----
.contact__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

// Rangée Nom + Email (porté de Contact.jsx : grid-2, gap space-4).
.contact__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

// Honeypot : hors écran et hors tabulation (piège à bots, invisible aux humains).
// On évite display:none (certains bots l'ignorent).
.contact__hp {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

// Erreur d'envoi réseau.
.contact__error {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--danger);
}

// Notice RGPD discrète sous le bouton.
.contact__rgpd {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  line-height: var(--lh-normal);

  // Contraste (story 9.2) : notice légale = info réelle → --text-muted (≥ 4.5:1),
  // plus lisible que --text-faint. Reste discrète. Token, pas de couleur en dur.
  color: var(--text-muted);
}

.contact__rgpd-link {
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

// Carte « envoyé » focalisée par programme (tabindex -1) : pas de contour UA résiduel.
.contact__sent:focus {
  outline: none;
}

// ---- État envoyé (porté de Contact.jsx : Card accent + ligne mono verte) ----
.contact__sent-line {
  margin-bottom: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-md);
  color: var(--term-green);
}

.contact__sent-text {
  margin: 0;
  font-size: var(--fs-sm);
}

// ============================================================
//  Colonne droite (story 7.2) : infos / CTA terminal / socials
// ============================================================
// Colonne (porté de kit.css : .contact__info — flex column).
.contact__info {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

// ---- Carte infos (porté de kit.css : .infoitem / .k / .v) ----
.contact__infolist {
  margin: 0;
  padding: 0;
}

.infoitem {
  font-family: var(--font-mono);

  &:not(:last-child) {
    margin-bottom: var(--space-5);
  }
}

.infoitem__k {
  font-size: var(--fs-xs);
  font-weight: var(--fw-regular);
  letter-spacing: var(--ls-wider);
  text-transform: uppercase;
  color: var(--text-muted);
}

.infoitem__v {
  margin: 0;
  font-size: var(--fs-md);
  color: var(--text-strong);
}

// Lien email en bleu terminal (porté de Contact.jsx), ring de focus accessible.
.contact__email {
  text-decoration: none;
  color: var(--term-blue);

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 2px;
    border-radius: var(--radius-xs);
    box-shadow: var(--ring-accent);
  }
}

.contact__avail {
  margin-top: var(--space-2);
}

// ---- Carte CTA terminal (porté de Contact.jsx : Card .offer fond terminal) ----
// Surcharge du fond/bordure de ZCard ; nesting sous .contact__info pour la spécificité.
.contact__info .contact__term {
  background: var(--bg-terminal);
  border-color: var(--accent-2-soft);
}

.contact__prompt {
  margin: 0 0 var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--term-green);
}

// Commande tapée : off-white (porté de l'inline ink-1 de Contact.jsx).
.contact__prompt-cmd {
  color: var(--text-strong);
}

.contact__term-text {
  margin: 0 0 var(--space-3);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

// ---- Carte CTA Carte de visite & QR Code ----
.contact__cardcta-eyebrow {
  margin: 0 0 var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--text-muted);
}

.contact__cardcta-text {
  margin: 0 0 var(--space-3);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

// ---- Responsive (cf. kit.css @media max-width: 900px : grilles → 1 colonne) ----
@media (width <= 900px) {
  .contact__grid,
  .contact__row {
    grid-template-columns: 1fr;
  }
}
</style>
