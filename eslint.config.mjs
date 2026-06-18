// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

// Flat config ESLint 9/10. La base Nuxt est générée par le module @nuxt/eslint
// (.nuxt/eslint.config.mjs). On ajoute Prettier en dernier pour qu'il prime sur
// les règles de mise en forme, puis nos règles projet.
export default withNuxt(
  {
    // Matériel de référence / outillage hors application — non linté.
    // docs/ contient notamment le design system source en React (.jsx).
    ignores: ["docs/**", "_bmad/**", ".claude/**", ".agents/**"],
  },
  eslintPluginPrettierRecommended,
  {
    rules: {
      "prefer-const": "error",
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    },
  },
);
