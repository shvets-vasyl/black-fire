export function useProjectPopup() {
  const isOpen = useState("project-popup-open", () => false)
  const projectName = useState("project-popup-name", () => "")

  const open = (name: string) => {
    projectName.value = name
    if (isOpen.value) return

    isOpen.value = true
    if (!import.meta.client) return
    useLockScroll(true)
  }

  const close = () => {
    isOpen.value = false
  }

  return { isOpen, projectName, open, close }
}
