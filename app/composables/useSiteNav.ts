import type Lenis from "lenis"

const sectionIds = ["work", "services", "about"]

export function useSiteNav() {
  const route = useRoute()
  const router = useRouter()
  const { scrollToSection } = useScrollToSection()
  const activeId = useState<string | null>("nav-active", () => null)

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

  if (import.meta.client) watchActiveSection(route, activeId)

  return { nav, activeId, openNav, openSection }
}

let watching = false

function watchActiveSection(
  route: ReturnType<typeof useRoute>,
  activeId: Ref<string | null>
) {
  if (watching) return
  watching = true

  const update = () => {
    if (route.path === "/work") {
      activeId.value = "work"
      return
    }

    if (route.path !== "/") {
      activeId.value = null
      return
    }

    const line = window.innerHeight * 0.35
    let current: string | null = null

    for (const id of sectionIds) {
      const section = document.getElementById(id)
      if (!section) continue
      if (section.getBoundingClientRect().top <= line) current = id
    }

    activeId.value = current
  }

  const lenis = useState<Lenis | null>("lenis")

  watch(
    lenis,
    (value) => {
      value?.on("scroll", update)
    },
    { immediate: true }
  )

  watch(() => route.path, () => nextTick(update))
  onMounted(update)
}
