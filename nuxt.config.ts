// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          sourceMap: true,
          additionalData:
            '@use "@/assets/scss/abstract" as *; @use "@/assets/scss/base" as *;',
        },
      },
    },
  },
});
