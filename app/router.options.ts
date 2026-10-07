import type { RouterConfig } from "@nuxt/schema"

export default {
  scrollBehavior(_to, from, _savedPosition) {
    if (!from.name) {
      return { top: 0, left: 0 }
    }

    return false
  },
} satisfies RouterConfig
