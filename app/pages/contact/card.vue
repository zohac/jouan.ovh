<template>
  <main class="card-screen">
    <HomeAtmosComponent />

    <section class="card-screen__wrap" aria-labelledby="card-title">
      <div class="vcard">
        <!-- Colonne / Bloc profil et coordonnées -->
        <div class="vcard__identity">
          <div class="vcard__header">
            <ZAvatar src="/images/portrait.jpeg" alt="Portrait de Simon Jouan" size="md" ring />
            <div class="vcard__titles">
              <p class="eyebrow vcard__eyebrow"><span aria-hidden="true">// </span>carte de visite</p>
              <h1 id="card-title" class="vcard__name">{{ profile.name }}</h1>
              <p class="vcard__role">{{ profile.role }}</p>
            </div>
          </div>

          <div class="vcard__badge">
            <ZBadge tone="success" dot>Ouvert aux missions freelance</ZBadge>
          </div>

          <ul class="vcard__coords" role="list">
            <li>
              <a :href="`tel:${profile.phoneRaw}`" class="vcard__coord-link ph-no-capture">
                <span class="vcard__coord-icon" aria-hidden="true"><ZIcon name="phone" /></span>
                <span class="vcard__coord-text">{{ profile.phone }}</span>
              </a>
            </li>
            <li>
              <a :href="`mailto:${profile.email}`" class="vcard__coord-link ph-no-capture">
                <span class="vcard__coord-icon" aria-hidden="true"><ZIcon name="mail" /></span>
                <span class="vcard__coord-text">{{ profile.email }}</span>
              </a>
            </li>
            <li>
              <NuxtLink to="/" class="vcard__coord-link">
                <span class="vcard__coord-icon" aria-hidden="true"><ZIcon name="gem" /></span>
                <span class="vcard__coord-text">jouan.ovh</span>
              </NuxtLink>
            </li>
          </ul>

          <div class="vcard__actions">
            <ZButton as="a" href="/simon-jouan.vcf" download variant="primary" size="md" class="vcard__btn">
              <template #icon><ZIcon name="download" /></template>
              Enregistrer le contact (.vcf)
            </ZButton>
            <ZButton :as="NuxtLink" to="/" variant="ghost" size="sm" class="vcard__btn-back">
              <template #icon><ZIcon name="arrow" /></template>
              Voir le portfolio complet
            </ZButton>
          </div>
        </div>

        <!-- Colonne / Bloc QR Code haute lisibilité -->
        <div class="vcard__qr-pane">
          <div class="vcard__qr-box">
            <NuxtImg
              src="/images/qr-code.svg"
              alt="QR Code vCard pour enregistrer le contact de Simon Jouan"
              class="vcard__qr-img"
              width="240"
              height="240"
              priority
            />
          </div>
          <p class="vcard__qr-caption" aria-hidden="true">
            <span class="vcard__qr-prompt">&gt; </span>Scannez pour ajouter aux contacts
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
import { SITE } from "~/data/site";

definePageMeta({
  layout: false,
});

const profile = SITE.profile;
const siteUrl = useSiteUrl();

const cardJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: profile.email,
  telephone: profile.phone,
  url: siteUrl,
  image: `${siteUrl}/images/portrait.jpeg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: profile.city,
    addressCountry: "FR",
  },
};

usePageSeo({
  title: "Carte de visite — Simon Jouan",
  description:
    "Fiche contact et QR code vCard de Simon Jouan, Développeur Full Stack spécialisé en systèmes IA et automatisation métier.",
  path: "/contact/card",
  image: "/images/portrait.jpeg",
  type: "profile",
  jsonLd: cardJsonLd,
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention BEM du projet */
.card-screen {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  box-sizing: border-box;
  padding-inline: var(--space-4);
  padding-block: var(--space-4);
  background: transparent;
  color: var(--text-body);
  overflow-x: hidden;
}

.card-screen__wrap {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 860px;
}

// ---- Carte principale ----
.vcard {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-8);
  align-items: center;
  padding-inline: var(--space-8);
  padding-block: var(--space-8);
  background: color-mix(in srgb, var(--surface-2) 85%, transparent);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  box-shadow:
    0 16px 40px rgb(0 0 0 / 45%),
    0 0 0 1px color-mix(in srgb, var(--accent) 10%, transparent);
  backdrop-filter: blur(16px);
}

// ---- Identité & coordonnées ----
.vcard__identity {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.vcard__header {
  display: flex;
  gap: var(--space-4);
  align-items: center;
}

.vcard__eyebrow {
  margin: 0;
  font-size: var(--fs-xs);
  line-height: var(--lh-normal);
}

.vcard__name {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-2xl);
  font-weight: var(--fw-medium);
  line-height: var(--lh-tight);
  color: var(--text-strong);
}

.vcard__role {
  margin: var(--space-1) 0 0;
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.vcard__badge {
  display: inline-flex;
}

// ---- Coordonnées cliquables ----
.vcard__coords {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: 0;
  margin: var(--space-2) 0;
  list-style: none;
}

.vcard__coord-link {
  display: inline-flex;
  gap: var(--space-3);
  align-items: center;
  padding-inline: var(--space-3);
  padding-block: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-strong);
  text-decoration: none;
  background: color-mix(in srgb, var(--surface-1) 60%, transparent);
  border: 1px solid color-mix(in srgb, var(--line-subtle) 80%, transparent);
  border-radius: var(--radius-md);
  transition:
    background var(--dur-fast) var(--ease-standard),
    border-color var(--dur-fast) var(--ease-standard),
    color var(--dur-fast) var(--ease-standard);

  &:hover {
    background: var(--surface-3);
    border-color: var(--accent);
    color: var(--accent);
  }

  &:focus-visible {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }
}

.vcard__coord-icon {
  display: inline-flex;
  color: var(--accent);
}

// ---- Actions ----
.vcard__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: center;
  margin-top: var(--space-2);
}

.vcard__btn {
  flex: 1 1 auto;
}

.vcard__btn-back {
  flex: none;
}

// ---- Volet QR Code ----
.vcard__qr-pane {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
}

// Cadre blanc ultra contrasté : indispensable pour scan immédiat par les capteurs photos
.vcard__qr-box {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  background: hsl(0deg 0% 100%);
  border: 2px solid var(--accent);
  border-radius: var(--radius-lg);
  box-shadow:
    0 8px 30px rgb(0 0 0 / 60%),
    0 0 20px color-mix(in srgb, var(--accent) 35%, transparent);
}

.vcard__qr-img {
  display: block;
  width: 220px;
  height: 220px;
  max-width: 100%;
  aspect-ratio: 1 / 1;
}

.vcard__qr-caption {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--text-muted);
  text-align: center;
}

.vcard__qr-prompt {
  color: var(--term-green);
}

// ---- Responsive Portrait (mobiles en vertical) ----
@media (width <= 768px) {
  .vcard {
    grid-template-columns: 1fr;
    gap: var(--space-6);
    padding-inline: var(--space-5);
    padding-block: var(--space-6);
  }

  .vcard__qr-pane {
    order: -1; // En portrait mobile, le QR code est immédiatement visible au premier coup d'œil
  }

  .vcard__qr-box {
    padding: var(--space-3);
  }

  .vcard__qr-img {
    width: 200px;
    height: 200px;
  }

  .vcard__actions {
    flex-direction: column;
    align-items: stretch;
  }
}

// ---- Responsive Paysage compact (ex. smartphone pivoté horizontalement) ----
@media (orientation: landscape) and (height <= 550px) {
  .card-screen {
    padding-inline: var(--space-3);
    padding-block: var(--space-3);
  }

  .vcard {
    grid-template-columns: 1.2fr 1fr;
    gap: var(--space-4);
    padding-inline: var(--space-4);
    padding-block: var(--space-4);
  }

  .vcard__identity {
    gap: var(--space-2);
  }

  .vcard__coords {
    margin: 0;
    gap: var(--space-1);
  }

  .vcard__coord-link {
    padding-inline: var(--space-2);
    padding-block: var(--space-1);
    font-size: var(--fs-xs);
  }

  .vcard__qr-pane {
    order: 0;
  }

  .vcard__qr-box {
    padding: var(--space-2);
  }

  .vcard__qr-img {
    width: 140px;
    height: 140px;
  }
}

// ---- Motion réduit & Contraste forcé ----
@media (prefers-reduced-motion: reduce) {
  .vcard__coord-link {
    transition: none;
  }
}

@media (forced-colors: active) {
  .vcard,
  .vcard__qr-box,
  .vcard__coord-link {
    forced-color-adjust: none;
    border: 2px solid CanvasText;
  }
}
</style>
