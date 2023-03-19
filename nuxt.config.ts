// import { defineNuxtConfig } from "@nuxt/bridge";

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
      meta: [
        {
          name: "description",
          content:
            "Développeur Fullstack et Testeur/QA freelance passionné par la création de solutions web performantes." +
            " Discutons de votre projet.",
        },
      ],
    },
    // baseURL: "jouan.ovh",
  },
  css: ["@/assets/scss/main.scss"],
  modules: ["@nuxt/content", "@nuxt/image-edge"],
  ssr: true,
  target: "static",
  experimental: {
    payloadExtraction: false,
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ["/", "/**"],
    },
    routeRules: {
      "/": { static: true },
      "/**": { static: true },
    },
  },
  vite: {
    build: {
      ssr: true,
    },
  },
  webpack: {
    extractCSS: true,
  },
});
