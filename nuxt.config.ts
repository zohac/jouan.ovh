// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "..::<sj />::..",
      htmlAttrs: {
        lang: "fr",
      },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
      meta: [{ name: "description", content: "My amazing site." }],
    },
  },
  css: ["@/assets/scss/main.scss"],
  modules: ["@nuxt/content"],
  webpack: {
    extractCSS: true,
  },
});
