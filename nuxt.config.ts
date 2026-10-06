// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from "node:url"

const SITE_NAME = "BLACK FIRE"
const SITE_DESCRIPTION = "Marketing, film and web — made by one team, in one voice."

export default defineNuxtConfig({
  typescript: {
    shim: false,
  },

  compatibilityDate: "2025-07-15",

  nitro: {
    alias: {
      // The hoisted h3 package is v2. Nitro still uses v1.
      h3: fileURLToPath(
        new URL(
          "./node_modules/nitropack/node_modules/h3/dist/index.mjs",
          import.meta.url
        )
      ),
    },
  },

  runtimeConfig: {
    mail: {
      user: "sayhi@blackfire.studio",
      pass: "",
      to: "sayhi@blackfire.studio",
    },
  },

  devtools: { enabled: false },

  modules: ["@nuxt/eslint", "@nuxtjs/device"],

  css: ["@/assets/styles/main.scss"],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/utils/mixins.scss" as *;\n',
        },
      },
    },
  },

  site: {
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
  },

  app: {
    pageTransition: { name: "page", mode: "in-out" },
    head: {
      charset: "utf-8",
      title: SITE_NAME,
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#0e0e0e" },
        { name: "title", content: SITE_NAME },
        { name: "description", content: SITE_DESCRIPTION },

        { property: "og:type", content: "website" },
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:title", content: SITE_NAME },
        { property: "og:description", content: SITE_DESCRIPTION },
        { property: "og:image", content: "/opengraph.jpg" },
        { property: "og:image:width", content: "600" },
        { property: "og:image:height", content: "314" },
        { property: "og:image:type", content: "image/jpeg" },

        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: SITE_NAME },
        { name: "twitter:description", content: SITE_DESCRIPTION },
        { name: "twitter:image", content: "/opengraph.jpg" },
      ],
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
    },
  },
})
