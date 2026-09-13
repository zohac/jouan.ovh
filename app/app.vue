<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { SITE } from "~/data/site";

// Métadonnées Schema.org globales (Organization / publisher du site).
// Résolues depuis runtimeConfig (useSiteUrl) et les données partagées (SITE).
const siteUrl = useSiteUrl();

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: SITE.profile.name,
  url: siteUrl,
  logo: `${siteUrl}/images/logo.png`,
  email: SITE.profile.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.profile.city,
    addressCountry: "FR",
  },
};

useHead({
  script: [jsonLdScript(organizationJsonLd)],
});
</script>

<style lang="scss" scoped></style>
