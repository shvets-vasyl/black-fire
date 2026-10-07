export function useSiteNav() {
  const route = useRoute()
  const router = useRouter()
  const { scrollToSection } = useScrollToSection()
  const activeId = computed(() => (route.path === "/work" ? "work" : null))

  const nav = [
    { id: "work", text: "Work", href: "/work" },
    { id: "services", text: "Services", href: "/#services" },
    { id: "about", text: "About us", href: "/#about" },
  ]

  const openSection = (event: MouseEvent, id: string) => {
    event.preventDefault()

    if (route.path === "/") {
      scrollToSection(id)
      return
    }

    void router.push({ path: "/", hash: `#${id}` })
  }

  const openNav = (event: MouseEvent, id: string) => {
    if (id === "work") {
      event.preventDefault()
      if (route.path !== "/work") void router.push("/work")
      return
    }

    openSection(event, id)
  }

  return { nav, activeId, openNav, openSection }
}
