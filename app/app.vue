<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { SITE } from "~/data/site";

const { initTheme } = useTheme();

onMounted(() => {
  initTheme();
});

// Métadonnées Schema.org globales (Organization / publisher du site).
// Résolues depuis Nuxt Site Config (useSiteUrl) et les données partagées (SITE).
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
