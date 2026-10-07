import type { Project } from "~/data/projects"

export function useProjectPopup() {
  const route = useRoute()
  const router = useRouter()
  const isOpen = useState("project-popup-open", () => false)
  const project = useState<Project | null>("project-popup-project", () => null)

  const open = (item: Project) => {
    project.value = item

    if (!isOpen.value) {
      isOpen.value = true
      if (import.meta.client) useLockScroll(true)
    }

    if (!import.meta.client) return
    if (route.query.project === item.slug) return

    router.push({
      path: route.path,
      query: { ...route.query, project: item.slug },
      hash: route.hash,
    })
  }

  const close = () => {
    isOpen.value = false
    if (!import.meta.client) return
    if (route.query.project === undefined) return

    const query = { ...route.query }
    delete query.project
    router.replace({ path: route.path, query, hash: route.hash })
  }

  return { isOpen, project, open, close }
}
