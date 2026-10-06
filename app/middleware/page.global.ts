import defaultTransition from "@/utils/page-transition/default"

export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.client) {
    const transitionDone = useState<boolean>("transition-done")
    if (!transitionDone.value && to.path !== from.path) {
      return abortNavigation()
    }
  }

  defaultTransition(to, from)
})
