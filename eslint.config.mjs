// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"

export default withNuxt([
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "vue/no-mutating-props": "off",
      "vue/no-side-effects-in-computed-properties": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "vue/no-v-html": "off",
      "vue/no-v-text-v-html-on-component": "off",
    },
  },
  eslintPluginPrettierRecommended,
])
