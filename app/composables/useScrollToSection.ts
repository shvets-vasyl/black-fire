import type Lenis from "lenis"

export function useScrollToSection() {
  const scrollToSection = (id: string) => {
    const target = document.getElementById(id)
    const lenis = useState<Lenis | null>("lenis").value
    if (!target || !lenis) return

    lenis.scrollTo(target, { force: true })
  }

  const onSectionClick = (event: MouseEvent, id: string) => {
    event.preventDefault()
    scrollToSection(id)
  }

  return { scrollToSection, onSectionClick }
}
