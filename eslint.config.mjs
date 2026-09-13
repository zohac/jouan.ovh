// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

// Flat config ESLint 9/10. La base Nuxt est générée par le module @nuxt/eslint
// (.nuxt/eslint.config.mjs). Nos règles projet sont déclarées d'abord, puis
// Prettier est appliqué EN DERNIER : eslint-plugin-prettier/recommended embarque
// eslint-config-prettier, qui doit primer pour désactiver toute règle de mise en
// forme conflictuelle (best practice flat config).
export default withNuxt(
  {
    // Matériel de référence / outillage hors application — non linté.
    // docs/ contient notamment le design system source en React (.jsx).
    ignores: ["docs/**", "_bmad/**", ".claude/**", ".agents/**"],
  },
  {
    rules: {
      "prefer-const": "error",
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    },
  },
  {
    // Pages, layouts et fichiers racine de l'app : noms à un seul mot autorisés
    // (convention Nuxt). L'exemption auto de @nuxt/eslint ne couvre pas le srcDir
    // app/ ici, on la rétablit explicitement.
    files: ["app/pages/**/*.vue", "app/layouts/**/*.vue", "app/app.vue", "app/error.vue"],
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
  // Prettier en dernier : prime sur toutes les règles de formatage ci-dessus.
  eslintPluginPrettierRecommended,
);
