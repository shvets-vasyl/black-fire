import type Lenis from "lenis"

export function useLockScroll(value: boolean = true) {
  const lenis = useState<Lenis>("lenis")

  return value ? lenis.value.stop() : lenis.value.start()
}
